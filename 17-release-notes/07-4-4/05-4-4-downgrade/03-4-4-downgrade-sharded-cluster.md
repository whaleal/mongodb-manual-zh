# 将4.4分片集群降级到4.2

在尝试降级之前，请熟悉本文档的内容。

## 降级路径

> 重要：
>
> 在升级或降级副本集之前，请确保所有副本集成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从4.4降级，请降级到4.2的最新补丁版本。

MongoDB仅支持单版本降级。您不能降级到当前版本后多个版本的版本。您可以将4.4系列降级为4.2系列部署，但是，不支持进一步降级4.2系列部署到4.0系列部署。

> 警告：
>
> **降级**
>
> 如果您需要从4.4版本降级，请降级到4.2.6或更高版本。您无法降级到4.2.5或更早的版本。

## 创建备份

*可选但推荐。*创建数据库的备份。

## 先决条件

要从4.4降级到4.2，您必须删除仍然存在的不兼容功能和/或更新不兼容的配置设置。

### 1.命名空间长度

从MongoDB 4.4开始：

* 对于设置为`"4.4"`或更高的[功能兼容性版本](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)，MongoDB将未分片集合和视图的限制提高到255字节，将分片集合的限值提高到235字节。对于集合或视图，命名空间包括数据库名称、点（`.`）分隔符和集合/视图名称（例如`<database>.<collection>`）
* 对于设置为`"4.2"`或更早[的功能兼容性版本](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)，未分片集合和视图命名空间的最大长度为120字节，碎片集合的最大长度为100字节。

在降级之前，请解决名称空间超过功能兼容性版本（fCV）4.2的120字节[命名空间长度](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Namespace-Length)限制的任何集合或视图。

要确定是否有名称空间超过120字节限制的集合或视图，请将mongo shell连接到一个[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例并运行：

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

- 对于未分片的集合，请使用thenameCollection命令重命名集合。
- 对于分片收藏：
  * 使用[`$merge`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)到名称较短的新分片集合中，然后删除原始集合。
  * 使用[`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)和[`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)进入名称较短的新集合，然后删除原始集合。
- 对于视图，请使用[`db.createView()`](https://www.mongodb.com/docs/upcoming/reference/method/db.createView/#mongodb-method-db.createView)使用较短的名称重新创建视图，然后删除原始视图。

### 2.降级功能兼容性版本（fCV)

> 提示：
>
> - 降级到 [featureCompatibilityVersion（fCV）：“4.2”](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-set-fcv)在每个碎片上隐式执行[`replSetReconfig`](https://www.mongodb.com/docs/upcoming/reference/command/replSetReconfig/#mongodb-dbcommand-dbcmd.replSetReconfig)，以从配置文档和块中删除[`term`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.term)字段，直到新配置传播到大多数replica集成员。

要降级分片集群`featureCompatibilityVersion`：

1. 将mongo shell连接到mongos实例。

2. 降级`featureCompatibilityVersion`为`"4.2"`

   ```
   db.adminCommand({setFeatureCompatibilityVersion: "4.2"})
   ```

    [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令执行对内部系统集合的写入，并且是幂等的。如果由于某种原因命令没有成功完成，请在mongos实例上重试该命令。

   > 笔记：
   >
   > 当[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)分片集群上运行时，块迁移、拆分和合并可能会因`ConflictingOperationInProgress`而失败。

3. 为了确保分片集群的所有成员都反映更新的`featureCompatibilityVersion`，请连接到每个碎片副本集成员和每个配置服务器副本集成员，并检查`featureCompatibilityVersion`：

   > 提示：
   >
   > 对于启用了访问控制的分片集群，要对碎片副本集成员运行以下命令，您必须以[碎片本地用户](https://www.mongodb.com/docs/upcoming/core/security-users/#std-label-shard-local-users)的身份连接到该成员[。](https://www.mongodb.com/docs/upcoming/core/security-users/#std-label-shard-local-users)

   ```
   db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
   ```

   所有成员都应返回一个结果，其中包括：

   ```
   "featureCompatibilityVersion" : { "version" : "4.2" }
   ```

   如果任何成员返回的featureCompatibilityVersion为“4. 4”，请等待该成员反映版本“4. 2”后再继续。

   > 笔记：
   >
   > 仲裁员不会复制[`admin.system.version`](https://www.mongodb.com/docs/upcoming/reference/system-collections/#mongodb-data-admin.system.version)集合。因此，仲裁员总是有一个与二进制文件降级版本相等的功能兼容性版本，无论副本集的FCV值如何。
   >
   > 例如，MongoDB 4.4集群中的仲裁器的FCV值为4.2。

   有关返回的featureCompatibilityVersion值的详细信息，请参阅[Get FeatureCompatibilityVersion.](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)

### 3.删除FCV 4.4持久功能

只有当fCV被设置为`"4.4"`时，以下步骤才是必要的。

删除所有与4.2不兼容的持久4.4[功能](https://www.mongodb.com/docs/upcoming/release-notes/4.4-compatibility/#std-label-4.4-compatibility-enabled)。这些包括：

**复合散列指数**

删除所有[复合哈希索引。](https://www.mongodb.com/docs/upcoming/release-notes/4.4/#std-label-4.4-rel-notes-compound-hashed-index)

使用[`db.collection.getIndexes()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)识别集合中的任何复合散列索引，并使用[`db.collection.dropIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex)删除这些索引。

如果使用复合散列索引对任何集合进行了分片，请使用下面的复合散列分片键中列出的指导。

**复合散列碎片键**

删除使用[复合散列碎片密钥](https://www.mongodb.com/docs/upcoming/release-notes/4.4/#std-label-4.4-rel-notes-sharding-compound-hashed)分片的任何碎片集合[。](https://www.mongodb.com/docs/upcoming/release-notes/4.4/#std-label-4.4-rel-notes-sharding-compound-hashed)

使用[`sh.status()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.status/#mongodb-method-sh.status)使用复合散列碎片密钥识别分片集合，并删除这些集合。

* 如果集合为空，*或者*集合确实包含需要保存的数据，请使用[`db.collection.drop()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.drop/#mongodb-method-db.collection.drop)删除集合。
* 如果集合有需要保存的数据，请*先*备份集合，然后使用[`db.collection.drop()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.drop/#mongodb-method-db.collection.drop)删除集合。降级集群后，将数据恢复到集群中。

### 4.删除4.4功能

删除所有使用4.4功能的持久功能。这些包括但不限于：

- 如果任何包含4.4运算符的视图定义，例如[`$unionWith`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/unionWith/#mongodb-pipeline-pipe.-unionWith)或[`$function`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/function/#mongodb-expression-exp.-function)。另请参阅[新的聚合运算符。](https://www.mongodb.com/docs/upcoming/release-notes/4.4/#std-label-4.4-rel-notes-new-agg-operators)
- [`Unhide`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.unhideIndex/#mongodb-method-db.collection.unhideIndex)或[`drop`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex)隐藏的索引。

### 5.更新缺失的分片键

在MongoDB 4.4中，分片集合中的[文档中](https://www.mongodb.com/docs/upcoming/core/sharding-shard-key/#std-label-shard-key-missing)可能会[缺少](https://www.mongodb.com/docs/upcoming/core/sharding-shard-key/#std-label-shard-key-missing)分片键字段。

如果您降级到4.2，并且分片集合包含缺少分片键字段的文档，则4.2 [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例不会返回缺少分片键字段的文档。为了避免这种情况，请在降级之前更新文档以包含缺失的分片键字段。

要查找缺少碎片密钥任何部分的文档，请使用[`$exists`](https://www.mongodb.com/docs/upcoming/reference/operator/query/exists/#mongodb-query-op.-exists)运算符。

例如，如果集合`contacts`有分键`{ zipcode: 1 }`，则查找没有`zipcode`字段的文档：

```
db.contacts.find( { zipcode: { $exists: false } } )
```

要将这些文档的缺失分块键字段设置为`null`，您可以使用[`db.collection.updateMany()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany)方法：

```
db.contacts.updateMany( { zipcode: { $exists: false } }, { $set: { zipcode: null } } )
```

如果将缺失的碎片键字段设置为非`null`值，则无法使用thedb[`db.collection.updateMany()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany)方法，您必须在事务中或作为可重试写入执行更新。有关详细信息，请参阅[设置缺失的碎片键字段。](https://www.mongodb.com/docs/upcoming/core/sharding-set-missing-shard-key-fields/#std-label-shard-key-missing-set)

### 6.更新超过512字节的碎片键

*在4.4版本中更改*：在4.4版本中，MongoDB删除了碎片键大小的512字节限制。然而，对于MongoDB 4.2及更早版本，碎片密钥不能超过512字节。将任何超过512字节大小限制的碎片键值更新为在512字节大小限制范围内。要更新文档的碎片键值，请参阅[更改文档的碎片键值。](https://www.mongodb.com/docs/upcoming/core/sharding-change-shard-key-value/#std-label-update-shard-key)

## 程序

### 降级分片集群

> 警告：
>
> 在继续下调程序之前，请确保所有成员，包括分片集群中的延迟副本集成员，反映先决条件更改。也就是说，在降级之前，检查`featureCompatibilityVersion`并删除每个节点的不兼容功能。

#### 1、下载最新的4.2二进制文件。

使用软件包管理器或手动下载，获取4.2系列的最新版本。如果使用软件包管理器，请为4.2二进制文件添加一个新存储库，然后执行实际的降级过程。

> 重要：
>
> 在升级或降级副本集之前，请确保所有副本集成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从4.4降级，请降级到4.2的最新补丁版本。

#### 2、停用平衡器。

将mongo shell连接到分片集群中的mongos实例，并运行 [`sh.stopBalancer()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.stopBalancer/#mongodb-method-sh.stopBalancer)禁用均衡器：

```
sh.stopBalancer()
```

> 笔记：
>
> 如果迁移正在进行中，系统将在停止平衡器之前完成正在进行的迁移。您可以runsh[`sh.isBalancerRunning()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.isBalancerRunning/#mongodb-method-sh.isBalancerRunning)来检查平衡器的当前状态。

要验证平衡器是否已禁用，请运行[`sh.getBalancerState()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.getBalancerState/#mongodb-method-sh.getBalancerState)），如果平衡器被禁用，则返回false：

```
sh.getBalancerState()
```

有关禁用平衡器的更多信息，请参阅[禁用平衡器。](https://www.mongodb.com/docs/upcoming/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-balancing-disable-temporarily)

#### 3、降级`mongos`实例。

降级二进制文件并重新启动。

#### 4、降级每个碎片，一次一个

一次降级一个碎片。

A. 一次降级碎片的[辅助](https://www.mongodb.com/docs/upcoming/core/replica-set-members/#std-label-replica-set-secondary-members)成员:

1. 在mongosh中运行以下命令以执行干净关闭，或参阅 [Stop `mongod` Processes](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)以了解安全终止[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)进程的其他方法：

   ```
   db.adminCommand( { shutdown: 1 } )
   ```

2. 将4.4二进制文件替换为4.2二进制文件并重新启动。

3. 请等待成员恢复到SECONDARY状态，然后再降级下一个辅助成员。要检查成员的状态，请将mongo shell连接到shard并运行[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)方法。

   重复对每个辅助成员降级。

B. 降级分片[仲裁器](https://www.mongodb.com/docs/upcoming/core/replica-set-arbiter/#std-label-replica-set-arbiter-configuration)（如果有的话）

如果副本集不包括仲裁器，请跳过此步骤。

1. 在mongosh中运行以下命令以执行干净关闭，或参阅 [Stop `mongod` Processes](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)以了解安全终止mongod进程的其他方法：

   ```
   db.adminCommand( { shutdown: 1 } )
   ```

2. 删除仲裁者数据目录的内容。Thestorage[`storage.dbPath`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.dbPath)配置设置或[`--dbpath`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--dbpath)命令行选项指定arbitermongod的数据目录[。](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)

   ```
   rm -rf /path/to/mongodb/datafiles/*
   ```

3. 将4.4二进制文件替换为4.2二进制文件并重新启动。

4. 等待成员恢复到仲裁器状态。要检查成员的状态，请将mongo shell连接到成员并运行[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)方法。

C .降级分片的主节点

1. 逐步关闭副本集主副本。将一个mongo shell连接到主服务器，并使用 [`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)将主服务器降级，强制选举一个新的主服务器：

   ```
   rs.stepDown()
   ```

2. 运行[`rs.status()`）](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)

   ```
   rs.status()
   ```

   当状态显示初选已下台，而另一名成员已处于`PRIMARY`状态时，请继续。

3. 从mongo shell运行下面的命令来执行主进程的干净关闭，或者参考[Stop `mongod` Processes](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)了解安全终止[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)进程的其他方法：

   ```
   db.adminCommand( { shutdown: 1 } )
   ```

4. 将4.4二进制文件替换为4.2二进制文件并重新启动。

对剩余的分片重复。

#### 5、降级配置服务器

A . 一次降级配置服务器副本集（CSRS）的[辅助](https://www.mongodb.com/docs/upcoming/core/replica-set-members/#std-label-replica-set-secondary-members)成员：

1. 在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)中运行以下命令以执行干净关闭，或参阅 [Stop `mongod` Processes](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)以了解安全终止[`mongo`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)进程的其他方法：

   ```
   db.adminCommand( { shutdown: 1 } )
   ```

2. 将4.4二进制文件替换为4.2二进制文件并重新启动。

3. 请等待成员恢复到SECONDARY状态，然后再降级下一个辅助成员。要检查成员的状态，请将mongo shell连接到shard并运行[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status) 方法。

   重复对每个辅助成员降级

B. 逐步降低配置服务器主服务器

1. 将一个mongo shell连接到主服务器，并使用[`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)将主服务器降级，强制选举一个新的主服务器：

   ```
   rs.stepDown()
   ```

2. 运行[`rs.status()`）。](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)

   ```
   rs.status()
   ```

   当状态显示初选已下台，而另一名成员已处于`PRIMARY`状态时，请继续。

3. 从`mongo` shell运行下面的命令来执行主进程的干净关闭，或者参考 [Stop `mongod` Processes](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)了解安全终止 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)进程的其他方法：

   ```
   db.adminCommand( { shutdown: 1 } )
   ```

4. 将4.4二进制文件替换为4.2二进制文件并重新启动.

#### 6、重新启用平衡

一旦分片集群组件的降级完成，将`mongo shell`连接到[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos) 并重新启用均衡器。

```
sh.startBalancer()
```

mongo shell方法 [`sh.startBalancer()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.startBalancer/#mongodb-method-sh.startBalancer) 还支持对分片集群进行自动拆分。





原文 - [Downgrade 4.4 Sharded Cluster to 4.2]( https://docs.mongodb.com/manual/release-notes/4.4-downgrade-sharded-cluster/ )

