# 将4.4独立版降级到4.2级 

在尝试降级之前，请熟悉本文档的内容。

## 降级路径

如果您需要从4.4降级，请降级到4.2的最新补丁版本。

MongoDB仅支持单版本降级。您不能降级到当前版本后多个版本的版本。您可以将4.4系列降级为4.2系列部署，但是，不支持进一步降级4.2系列部署到4.0系列部署。

> 警告：
>
> **降级**
>
> 如果您需要从4.4版本降级，请降级到4.2.6或更高版本。您无法降级到4.2.5或更早的版本。

## 创建备份

*可选但推荐。*创建数据库的备份。

## 访问控制

如果您的部署启用了访问控制，则降级用户权限必须包括跨数据库列出和管理索引的权限。具有[`root`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-root)角色的用户拥有所需的特权。

## 先决条件

要从4.4降级到4.2，您必须删除仍然存在的不兼容功能和/或更新不兼容的配置设置。这些包括：

### 1、命名空间长度

从MongoDB 4.4开始：

- 对于设置为`"4.4"`或更高的[功能兼容性版本](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)，MongoDB将未分片集合和视图的限制提高到255字节，将分片集合的限值提高到235字节。对于集合或视图，命名空间包括数据库名称、点（`.`）分隔符和集合/视图名称（例如`<database>.<collection>`），
- 对于设置为`"4.2"`或更早[的功能兼容性版本](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)，未分片集合和视图命名空间的最大长度为120字节，碎片集合的最大长度为100字节。

在降级之前，请解决名称空间超过功能兼容性版本（fCV）4.2的120字节[命名空间长度](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Namespace-Length)限制的任何集合或视图。

要确定是否有名称空间超过120字节限制的集合或视图，请将mongo shell连接到 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例并运行：

```
db.adminCommand("listDatabases").databases.forEach(function(d){
   let mdb = db.getSiblingDB(d.name);

   mdb.getCollectionInfos( ).forEach(function(c){
      namespace = d.name + "." + c.name
      namespacelenBytes =  encodeURIComponent(namespace).length

      if (namespacelenBytes > 120) {
         print (c.type.toUpperCase() + " namespace exceeds 120 bytes:: " + namespace )
      }
   } )
})
```

如果任何集合或视图命名空间超过120字节，那么在降级fCV**之前**：

- 使用[`renameCollection`](https://www.mongodb.com/docs/upcoming/reference/command/renameCollection/#mongodb-dbcommand-dbcmd.renameCollection)命令重命名集合。
- 对于视图，请使用[`db.createView()`](https://www.mongodb.com/docs/upcoming/reference/method/db.createView/#mongodb-method-db.createView)使用较短的名称重新创建视图，然后删除原始视图。

### 2、降级功能兼容性版本（fCV）

要降级独立`featureCompatibilityVersion`：

1. 将mongo shell连接到 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例。

2. 降级`featureCompatibilityVersion`为`"4.2"`

   ```
   db.adminCommand({setFeatureCompatibilityVersion: "4.2"})
   ```

    [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion) 命令执行对内部系统集合的写入，并且是幂等的。如果由于任何原因命令未成功完成，请在v实例上重试该命令。

### 3、删除FCV 4.4持久功

只有当fCV被设置为`"4.4"`时，以下步骤才是必要的。

删除所有与4.2不兼容的持久4.4[功能](https://www.mongodb.com/docs/upcoming/release-notes/4.4-compatibility/#std-label-4.4-compatibility-enabled)。这些包括：

**复合散列指数**

删除所有[复合哈希索引。](https://www.mongodb.com/docs/upcoming/core/index-hashed/#std-label-index-type-compound-hashed)

使用[`db.collection.getIndexes()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)识别集合中的任何复合散列索引，并使用[`db.collection.dropIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex)删除这些索引。

### 4、删除4.4个功能

删除所有使用4.4功能的持久功能。这些包括但不限于：

- 如果任何包含4.4运算符的视图定义，例如[`$unionWith`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/unionWith/#mongodb-pipeline-pipe.-unionWith)或[`$function`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/function/#mongodb-expression-exp.-function)。另请参阅[新的聚合运算符。](https://www.mongodb.com/docs/upcoming/release-notes/4.4/#std-label-4.4-rel-notes-new-agg-operators)
- [`Unhide`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.unhideIndex/#mongodb-method-db.collection.unhideIndex)或[`drop`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex)隐藏的索引。

## 程序

> 警告：
>
> 在继续进行降级程序之前，请确保已完成先决条件。

### 1、下载最新的4.2二进制文件

使用软件包管理器或手动下载，获取4.2系列的最新版本。如果使用软件包管理器，请为4.2二进制文件添加一个新存储库，然后执行实际的降级过程。

> 重要：
>
> 在升级或降级副本集之前，请确保所有副本集成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从4.4降级，请降级到4.2的最新补丁版本。

### 2、关闭`mongod`实例。

要彻底关闭mongod进程，请将mongo shell连接到实例并运行：

```
db.adminCommand( { shutdown: 1 } )
```

[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)的[干净关闭](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)可以完成所有待处理操作，将所有数据刷新到数据文件中，并关闭所有数据文件。

### 3、使用最新的4.2 `mongod`实例重新启动。

将4.4二进制文件替换为下载的4.2个[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件，然后重新启动。









原文 - [Downgrade 4.4 Standalone to 4.2]( https://docs.mongodb.com/manual/release-notes/4.4-downgrade-standalone/ )

