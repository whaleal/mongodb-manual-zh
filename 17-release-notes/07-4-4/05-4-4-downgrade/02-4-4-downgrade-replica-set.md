# 将4.4副本降级为4.2

在尝试降级之前，请熟悉本文档的内容。

## 降级路径

> 重要：
>
> 在升级或降级副本集之前，请确保所有副本集成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从4.4降级，请降级到4.2的最新补丁版本。

MongoDB仅支持单版本降级。您不能降级到当前版本后多个版本的版本。您可以将4.4系列降级为4.2系列部署，但是，不支持进一步降级4.2系列部署到4.0系列部署。

>警告：
>
>**降级**
>
>如果您需要从4.4版本降级，请降级到4.2.6或更高版本。您无法降级到4.2.5或更早的版本。

## 创建备份

*可选但推荐。*创建数据库的备份

## 访问控制

如果您的副本集启用了访问控制，则降级用户权限必须包括跨数据库列出和管理索引的权限。具有[`root`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-root)角色的用户拥有所需的特权。

## 先决条件

要从4.2降级到4.0，您必须删除持久存在的不兼容功能和/或更新不兼容的配置设置。

### 1.命名空间长度

从MongoDB 4.4开始：

* 对于设置为`"4.4"`或更高的[功能兼容性版本](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)，MongoDB将未分片集合和视图的限制提高到255字节，将分片集合的限值提高到235字节。对于集合或视图，命名空间包括数据库名称、点（`.`）分隔符和集合/视图名称（例如`<database>.<collection>`），
* 对于设置为`"4.2"`或更早[的功能兼容性版本](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)，未分片集合和视图命名空间的最大长度为120字节，碎片集合的最大长度为100字节。

在降级之前，请解决名称空间超过功能兼容性版本（fCV）4.2的120字节[命名空间长度](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Namespace-Length)限制的任何集合或视图。

要确定是否有名称空间超过120字节限制的集合或视图，请将mongo shell连接到主服务器并运行：

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

### 2.降级功能兼容性版本（fCV)

> 提示：
>
> - 确保没有进行初始同步。在初始同步进行时，Running[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令将导致初始同步重新启动。
> - 确保没有副本集成员处于[`ROLLBACK`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)或[`RECOVERING`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)状态。
> - 降级到 [featureCompatibilityVersion (fCV)：“4.2”](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-set-fcv)隐式执行[`replSetReconfig`](https://www.mongodb.com/docs/upcoming/reference/command/replSetReconfig/#mongodb-dbcommand-dbcmd.replSetReconfig)，以从配置文档中删除[`term`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.term)字段并阻止，直到新配置传播到大多数副本集成员。

要降级副本集`featureCompatibilityVersion`：

1. 将mongo shell连接到主服务器。

2. 降级`featureCompatibilityVersion`为`"4.2"`

   ```
   db.adminCommand({setFeatureCompatibilityVersion: "4.2"})
   ```

   [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令执行对内部系统集合的写入，并且是幂等的。如果由于任何原因命令未能成功完成，请在主命令上重试该命令。

3. 为了确保副本集的所有成员都反映更新的`featureCompatibilityVersion`，请连接到每个副本集成员并检查`featureCompatibilityVersion`：

   ```
   db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
   ```

   所有成员都应返回一个结果，其中包括：

   ```
   "featureCompatibilityVersion" : { "version" : "4.2" }
   ```

   如果任何成员返回的featureCompatibilityVersion为“4. 4”，请等待该成员反映版本“4. 2”后再继续。

有关返回的featureCompatibilityVersion值的详细信息，请参阅 [Get FeatureCompatibilityVersion.](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)

> 笔记：
>
> 仲裁员不会复制[`admin.system.version`](https://www.mongodb.com/docs/upcoming/reference/system-collections/#mongodb-data-admin.system.version)集合。因此，仲裁员总是有一个与二进制文件降级版本相等的功能兼容性版本，无论副本集的FCV值如何。
>
> 例如，MongoDB 4.4集群中的仲裁器的FCV值为4.2。

### 3.删除FCV 4.4持久功能

只有当fCV被设置为`"4.4"`时，以下步骤才是必要的。

删除所有与4.2不兼容的持久4.4[功能](https://www.mongodb.com/docs/upcoming/release-notes/4.4-compatibility/#std-label-4.4-compatibility-enabled)。这些包括：

**复合散列指数**

​	删除所有复合哈希索引。

​	使用db.collection.getIndexes()识别集合中的任何复合散列索引，并使用db.collection.dropIndex()删除这些索引。

### 4.删除4.4功能

删除所有使用4.4功能的持久功能。这些包括但不限于：

- 如果任何包含4.4运算符的视图定义，例如[`$unionWith`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/unionWith/#mongodb-pipeline-pipe.-unionWith)或[`$function`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/function/#mongodb-expression-exp.-function)。另请参阅[新的聚合运算符。](https://www.mongodb.com/docs/upcoming/release-notes/4.4/#std-label-4.4-rel-notes-new-agg-operators)
- [`Unhide`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.unhideIndex/#mongodb-method-db.collection.unhideIndex)或[`drop`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex)隐藏的索引。

### 程序

> 警告：
>
> 在继续进行降级过程之前，请确保所有复制集成员，包括延迟的复制集成员，都反映先决条件更改。也就是说，在降级之前，检查`featureCompatibilityVersion`并删除每个节点的不兼容功能

#### 1、下载最新的4.2二进制文件。

使用软件包管理器或手动下载，获取4.2系列的最新版本。如果使用软件包管理器，请为4.2二进制文件添加一个新存储库，然后执行实际的降级过程。

> 重要：
>
> 在升级或降级副本集之前，请确保所有副本集成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从4.4降级，请降级到4.2的最新补丁版本。

#### 2、降级副本集的辅助成员。

降级副本集的每个[辅助](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-secondary)成员，一次降级一个：

1. 在mongosh中运行以下命令以执行干净关闭，或参阅 [Stop `mongod`Processes](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)以了解安全终止mongod进程的其他方法：

   ```
   db.adminCommand( { shutdown: 1 } )
   ```

2. 将4.4二进制文件替换为4.2二进制文件并重新启动。

3. 请等待成员恢复到SECONDARY状态，然后再降级下一个辅助节点。要检查成员的状态，请使用mongo shell中的 [`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)方法。

4. 一旦成员进入`SECONDARY`阶段，就降级下一级中

#### 3、降级仲裁器副本集成员（如果有的话）。

如果副本集不包括仲裁器，请跳过此步骤。

降级副本集的[仲裁器](https://www.mongodb.com/docs/upcoming/core/replica-set-arbiter/#std-label-replica-set-arbiter-configuration)成员：

1. 在mongosh中运行以下命令以执行干净关闭，或参阅 [Stop `mongod`Processes](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)以了解安全终止mongod进程的其他方法：

   ```
   db.adminCommand( { shutdown: 1 } )
   ```

2. 删除仲裁者数据目录的内容。Thestorage[`storage.dbPath`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.dbPath)配置设置或[`--dbpath`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--dbpath)命令行选项指定仲裁器[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)的数据目录[。](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)

   ```
   rm -rf /path/to/mongodb/datafiles/*
   ```

3. 将4.4二进制文件替换为4.2二进制文件并重新启动。

4. 等待成员恢复到仲裁器状态。要检查成员的状态，请将mongo shell连接到成员并运行[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)方法。

#### 4、降级主节点

在mongo shell中使用[`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)来逐步关闭主服务器并强制执行正常的故障转移过程。

```
rs.stepDown()
```

[`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)加快故障转移程序，比直接关闭主故障转移更可取。

#### 5、更换并重新启动以前的主`mongod`。

当[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)显示主级已下台，而其他成员已处于`PRIMARY`状态时：

1. 在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)中运行以下命令以执行干净关闭，或参阅 [Stop `mongod`Processes](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes) 以了解安全终止 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)进程的其他方法：

   ```
   db.adminCommand( { shutdown: 1 } )
   ```

2. 将[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件替换为4.2二进制文件，然后重新启动。



 参见

原文 - [Downgrade 4.4 Replica Set to 4.2]( https://docs.mongodb.com/manual/release-notes/4.4-downgrade-replica-set/ )

