# 将6.0分片集群降级到5.0



在尝试降级之前，请熟悉此页面中的内容。

## 降级路径

> 重要：
>
> 在升级或降级分片集群之前，请确保所有分片集群成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从6.0降级，请降级到5.0的最新补丁版本。

MongoDB仅支持单版本降级。您不能降级到当前版本后多个版本的版本。您可以将6.0系列降级为5.0系列部署，但是，不支持进一步将5.0系列部署降级为4.4系列部署。

### 先决条件

在开始降级程序之前，您必须完成以下先决条件步骤。

#### 1、创建备份

*可选但推荐。*创建数据库的备份。

要了解如何创建备份，请参阅[MongoDB备份方法。](https://www.mongodb.com/docs/upcoming/core/backups/#std-label-backup-methods)

#### 2、移除向后不兼容的功能

要从6.0降级到5.0，您必须删除与5.0不兼容的6.0功能。有关不兼容功能以及如何删除它们的列表，请参阅[降级注意事项。](https://www.mongodb.com/docs/upcoming/release-notes/6.0-compatibility/#std-label-6.0-downgrade-considerations)

#### 3、确保没有进行分片操作

确保所有[分片操作](https://www.mongodb.com/docs/upcoming/core/sharding-reshard-a-collection/#std-label-sharding-resharding)都已成功完成。如果最近的重新分片操作因主故障转移而失败，您必须先运行[`cleanupReshardCollection`](https://www.mongodb.com/docs/upcoming/reference/command/cleanupReshardCollection/#mongodb-dbcommand-dbcmd.cleanupReshardCollection)命令，然后才能降级分片集群的`featureCompatibilityVersion`。

如果您在降级分片集群`featureCompatibilityVersion`时仍在运行重新分片操作，则分片操作将无法完成。

#### 4、降级功能兼容性版本（fCV）

要降级分片集群的fCV：

1. 确保没有进行初始同步。在初始同步进行时运行这些[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令会导致初始同步重新启动。

2. 确保没有节点在其[副本集配置](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/)中包含`newlyAdded`字段。在副本集中的每个节点上运行以下命令以验证这一点：

   ```
   use local
   db.system.replset.find( { "members.newlyAdded" : { $exists : true } } );
   ```

   `newlyAdded`字段仅在初始同步期间和之后不久出现在节点的副本集配置文档中。

3. 确保没有副本集成员处于[`ROLLBACK`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)或[`RECOVERING`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)状态。

4. 使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到您的[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例。

5. 降级`featureCompatibilityVersion`为`"5.0"`

   ```
   db.adminCommand( { setFeatureCompatibilityVersion: "5.0" } )
   ```

   [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令执行对内部系统集合的写入，并且是幂等的。如果命令没有成功完成，请在[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例上重试该命令。

   > 笔记：
   >
   > **故障排除**
   >
   > - 当[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)分片集群上运行时，使用`ConflictingOperationInProgress`块迁移、拆分和合并可能会失败。
   > - 如果[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)失败，出现`ManualInterventionRequired`错误，并且集群最近经历了因选择而失败的分片操作，则在再次尝试运行[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)之前，您必须运行`cleanupReshardCollection`命令。

6. 为了确保副本集的所有成员都具有更新的`featureCompatibilityVersion`，请连接到每个副本集成员并检查`featureCompatibilityVersion`：

   ```
   db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
   ```

   >**访问控制**
   >
   >对于启用了访问控制的分片集群，要在碎片副本集成员上运行`adminCommand`，您必须以[碎片本地用户](https://www.mongodb.com/docs/upcoming/core/security-users/#std-label-shard-local-users)的身份连接到该成员[。](https://www.mongodb.com/docs/upcoming/core/security-users/#std-label-shard-local-users)

   所有成员都应返回一个结果，其中包括：

   ```
   "featureCompatibilityVersion" : { "version" : "5.0" }
   ```

   如果任何成员返回`"6.0"``featureCompatibilityVersion`等待成员返回`"5.0"`版本，然后再继续。

有关返回的`featureCompatibilityVersion`值的详细信息，请参阅 [Get FeatureCompatibilityVersion.](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)

## 降级程序

> 警告：
>
> 在继续下调程序之前，请确保所有分片集群成员，包括延迟的复制集成员，具有先决条件更改。为此，请在降级之前检查`featureCompatibilityVersion`并删除每个节点的不兼容功能。

### 1、下载最新的5.0二进制文件

使用软件包管理器或手动下载，获取5.0系列的最新版本。如果使用软件包管理器，请为5.0二进制文件添加一个新存储库，然后执行实际的降级过程。

> 重要：
>
> 在升级或降级副本集之前，请确保所有副本集成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从6.0降级，请降级到5.0的最新补丁版本。

### 2、将6.0二进制文件替换为下载的5.0二进制文件。

确保5.0二进制文件在您的系统PATH中。要确认您的二进制版本，请运行以下命令：

```
mongod --version
```

命令输出应指示5.0系列版本。

### 3、停用平衡器。

要停用均衡器，请连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到分片集群中的[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例，并运行以下命令：

```
sh.stopBalancer()
```

> 笔记：
>
> 如果迁移正在进行中，MongoDB在停止平衡器之前完成正在进行的迁移。要检查平衡器的当前状态，请运行[`sh.isBalancerRunning()`。](https://www.mongodb.com/docs/upcoming/reference/method/sh.isBalancerRunning/#mongodb-method-sh.isBalancerRunning)

要验证平衡器是否已禁用，请运行以下命令：

```
sh.getBalancerState()
```

[`sh.getBalancerState()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.getBalancerState/#mongodb-method-sh.getBalancerState)如果平衡器被禁用，则返回`false`。

有关禁用平衡器的更多信息，请参阅[禁用平衡器。](https://www.mongodb.com/docs/upcoming/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-balancing-disable-temporarily)

#### 4、降级`mongos`

1. 要阻止`mongos`，请运行以下命令：

   ``` 
   db.shutdownServer()
   ```

2. 使用5.0二进制文件重新启动`mongos`。

### 5、降级每个碎片，一次一个。

1. 降级碎片的次要成员，一次一个。

   * 关闭

     要关闭[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)进程，请使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到部署并运行以下命令：

     ```
     db.adminCommand( { shutdown: 1 } )
     ```

   * 重新启动

     要启动`mongod`进程，请运行以下命令：

     ```
     mongod --dbpath </path-to-data-folder>
     ```

   * 等待成员进入`SECONDARY`状态。

     在降级下一个二级评级之前，请等待成员恢复到`SECONDARY`状态。要检查成员的状态，请使用[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)方法[`mongosh`。](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

   * 重复前面的步骤，以降低每个辅助成员的评级。

2. 降级分片仲裁器（如果有的话）

   如果副本集不包括仲裁器，请跳过此步骤。

   降级分片集群的[仲裁员](https://www.mongodb.com/docs/upcoming/core/replica-set-arbiter/#std-label-replica-set-arbiter-configuration)成员：

   * 关闭

     要关闭仲裁员，请使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到仲裁器并运行以下命令：

     ```
     db.adminCommand( { shutdown: 1 } )
     ```

   * 删除仲裁者数据目录的内容。

     要查找仲裁器[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)的数据目录，请检查[`storage.dbPath`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.dbPath)配置设置或[`--dbpath`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--dbpath)命令行选项。

     运行以下命令：

     ```
     rm -rf /path/to/mongodb/datafiles/*
     ```

   * 重新启动仲裁器。

     要启动`mongod`进程，请运行以下命令：

     ```
     mongod --dbpath </path-to-mongodb-datafiles>
     ```

   * 等待成员进入`ARBITER`状态。

     在降级主级之前，请等待成员恢复到`ARBITER`状态。要检查成员的状态，请使用[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)方法[`mongosh`。](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

3. 降低分片优先级。

   * 降低

     [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，使用[`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)下级初选，并开始新初选的选举：

     ```
     rs.stepDown()
     ```

   * 验证主调是否已下调。

     运行以下命令：

     ```
     rs.status()
     ```

     验证初选是否已下台，并且其他成员是否已处于`PRIMARY`状态。

   * 关闭前主要成员。

     要关闭前一个主服务器，请使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)并运行以下命令：

     ```
     db.adminCommand( { shutdown: 1 } )
     ```

   * 用5.0二进制文件重新启动[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)。

     要启动`mongod`进程，请运行以下命令：

     ```
     mongod --dbpath </path-to-mongodb-datafiles>
     ```

4. 重复前面的步骤，以降低每个辅助成员的评级。

### 6、降级配置服务器

1. 一次降级配置服务器副本集（CSRS）的碎片辅助成员：

   * 关闭辅助。

     连接到辅助并运行以下命令：

     ```
     db.adminCommand( { shutdown: 1 } )
     ```

   * 重新启动成员。

     要启动`mongod`进程，请运行以下命令：

     ```
     mongod --dbpath </path-to-data-folder>
     ```

   * 等待成员进入`SECONDARY`状态。

     在降级下一个二级评级之前，请等待成员恢复到`SECONDARY`状态。要检查成员的状态，请使用[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)方法[`mongosh`。](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

   * 重复前面的步骤，以降低每个辅助成员的评级。

2. 降级配置服务器主服务器。

   * 降低初选

     [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，运行[`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)下级初选，并开始新初选的选举：

     ```
     rs.stepDown()
     ```

   * 验证主调是否已下调。

     运行以下命令：

     ```
     rs.status()
     ```

     验证初选是否已下台，并且其他成员是否已处于`PRIMARY`状态。

   * 关闭前主要成员

     要关闭前一个主服务器，请使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)并运行以下命令：

     ```
     db.adminCommand( { shutdown: 1 } )
     ```

   * 用5.0二进制文件重新启动[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)。

     要启动`mongod`进程，请运行以下命令：

     ```
     mongod --dbpath </path-to-mongodb-datafiles>
     ```

### 7、重新启用平衡器。

降级所有分片集群组件后，连接到其中之一，并运行以下命令以重新启用平衡器：

```
sh.startBalancer()
```

[`sh.startBalancer()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.startBalancer/#mongodb-method-sh.startBalancer)方法还允许对分片集群进行自动拆分。



原文：[Downgrade 6.0 Sharded Cluster to 5.0](https://www.mongodb.com/docs/upcoming/release-notes/6.0-downgrade-sharded-cluster/)