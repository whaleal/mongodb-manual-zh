# 将5.0复制副本集降级到4.4

在尝试降级之前，请熟悉本文档的内容。

## 降级路径

> 重要：
>
> 在升级或降级副本集之前，请确保所有副本集成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从5.0降级，请降级到4.4的最新补丁版本。

MongoDB仅支持单版本降级。您不能降级到当前版本后多个版本的版本。您可以将5.0系列降级为4.4系列部署，但是，不支持将4.4系列部署进一步降级为4.2系列部署。

## 访问控制

如果您的副本集启用了访问控制，则降级用户权限必须包括跨数据库列出和管理索引的权限。具有[`root`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-root)角色的用户拥有所需的特权。

## 先决条件

要从5.0降级到4.4，您必须删除持续存在的不兼容功能和/或更新不兼容的配置设置。这些包括：

### 1.集群默认读写问题

MongoDB 5.0更改了集群范围读写问题默认值，降级到MongoDB 4.4可能会更改这些默认值。在降级之前，考虑手动配置集群的默认读写问题：

* 要手动配置集群的read或writeconcern的默认值，请使用[`setDefaultRWConcern`](https://www.mongodb.com/docs/upcoming/reference/command/setDefaultRWConcern/#mongodb-dbcommand-dbcmd.setDefaultRWConcern)命令。
* 如果群集包含仲裁器，并且您之前已禁用“多数”读取关注以防止在某些情况下出现缓存压力，则可能需要配置--enableMajorityReadConcern false或replication。enableMajorityReadConcern：如果降级，则返回false。

### 2.带有`.`或`$`字符的文档字段

MongoDB 5.0增加了对在文档字段名称中包含`.`或`$`字符的支持。在降级到MongoDB 4.4之前，您必须删除任何包含`.`或`$`字符的字段名的文档。

### 3.精简格式时区数据文件

MongoDB 5.0支持超薄格式时区数据文件。如果在部署中使用超薄格式的时区数据文件，如使用[`--timeZoneInfo`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--timeZoneInfo)命令行选项或[`processManagement.timeZoneInfo`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-processManagement.timeZoneInfo)配置文件设置提供给MongoDB的那样，则必须降级到MongoDB 4.4.7或更高版本，或者恢复时区数据文件以使用以前的非超薄格式数据文件。

### 4.降级功能兼容性版本（fCV）

首先，验证以下内容：

* 确保没有进行初始同步。在初始同步进行时，Running[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令将导致初始同步重新启动。

* 确保没有节点在其[副本集配置](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/)中包含`newlyAdded`字段。在副本集中的每个节点上运行以下命令以验证这一点：

  ```
  use local
  db.system.replset.find( { "members.newlyAdded" : { $exists : true } } );
  ```

  `newlyAdded`字段仅在初始同步期间和之后不久出现在节点的副本集配置文档中。

* 确保没有副本集成员处于[`ROLLBACK`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)或[`RECOVERING`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)状态。

接下来，要降级副本集`featureCompatibilityVersion`：

1. 将mongo shell连接到主服务器。

2. 降级`featureCompatibilityVersion`为`"4.4"`

   ```
   db.adminCommand({setFeatureCompatibilityVersion: "4.4"})
   ```

   [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令执行对内部系统集合的写入，并且是幂等的。如果由于任何原因命令未能成功完成，请在主命令上重试该命令。

3. 为了确保副本集的所有成员都反映更新的`featureCompatibilityVersion`，请连接到每个副本集成员并检查`featureCompatibilityVersion`：

   ```
   db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
   ```

   所有成员都应返回一个结果，其中包括：

   ```
   "featureCompatibilityVersion" : { "version" : "4.4" }
   ```

   如果任何成员返回`"5.0"``featureCompatibilityVersion`等待成员反映`"4.4"`版本，然后再继续。

   > 笔记：
   >
   > 仲裁员不会复制[`admin.system.version`](https://www.mongodb.com/docs/upcoming/reference/system-collections/#mongodb-data-admin.system.version)集合。因此，仲裁员总是有一个与二进制文件降级版本相等的功能兼容性版本，无论副本集的FCV值如何。
   >
   > 例如，MongoDB 5.0集群中的仲裁器的FCV值为4.4。

   有关返回的featureCompatibilityVersion值的详细信息，请参阅 [Get FeatureCompatibilityVersion.](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)

### 5.删除fCV 5.0持久功能

只有当fCV被设置为`"5.0"`时，以下步骤才是必要的。

删除所有与4.4不兼容的持久5.0[功能](https://www.mongodb.com/docs/upcoming/release-notes/5.0-compatibility/#std-label-5.0-compatibility-enabled)。这些包括：

**时间序列集合**

​	删除所有[时间序列集合。](https://www.mongodb.com/docs/upcoming/core/timeseries-collections/#std-label-manual-timeseries-collection)

运行时审计过滤器管理

* 重置组中[主](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-primary)服务器上的默认值 withdb`db.admin.runCommand`。主服务器应该是组中最后一个要更新的配置服务器。

  ```
  db.admin.runCommand(
     {
        setAuditConfig: 1,
        filter: {},
        auditAuthorizationSuccess: false
     }
  )
  ```

  降级后也可以删除配置文档：

  ```
  config.settings.remove({_id: 'audit'});
  ```

* 通过在节点的配置文件中将`auditLog.runtimeConfiguration`设置为`false`，禁用每个节点上的运行时审计过滤器管理。

* 在本地配置文件中更新此实例的审计过滤器。

### 6.删除5.0功能

删除所有使用5.0功能的持久功能。这些包括但不限于：

- 如果任何视图定义包括5.0运算符，例如[`$dateAdd`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/dateAdd/#mongodb-expression-exp.-dateAdd)或[`$sampleRate`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/sampleRate/#mongodb-expression-exp.-sampleRate)，则必须将其删除。有关完整列表[，](https://www.mongodb.com/docs/upcoming/release-notes/5.0/#std-label-5.0-rel-notes-new-agg-operators)请参阅[新聚合运算符](https://www.mongodb.com/docs/upcoming/release-notes/5.0/#std-label-5.0-rel-notes-new-agg-operators)。

## 程序

> 警告：
>
> 在继续进行降级过程之前，请确保所有复制集成员，包括延迟的复制集成员，都反映先决条件更改。也就是说，在降级之前，检查`featureCompatibilityVersion`并删除每个节点的不兼容功能。

#### 1、下载最新的4.4二进制文件。

使用软件包管理器或手动下载，获取4.4系列的最新版本。如果使用软件包管理器，请为4.4二进制文件添加一个新存储库，然后执行实际的降级过程。

> 重要：
>
> 在升级或降级副本集之前，请确保所有副本集成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从5.0降级，请降级到4.4的最新补丁版本。

#### 2、降级副本集的辅助成员

降级副本集的每个[辅助](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-secondary)成员，一次降级一个：

1. 在mongosh中运行以下命令以执行干净关闭，或参阅 [Stop `mongod`](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)进程以了解安全终止mongod进程的其他方法：

   ```
   db.adminCommand( { shutdown: 1 } )
   ```

2. 将5.0二进制文件替换为4.4二进制文件并重新启动。

3. 等待成员恢复到`SECONDARY`状态，然后再降级下一个二级。要检查成员的状态，请使用[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)方法[`mongos`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

4. 一旦成员进入`SECONDARY`阶段，就降级下一级中。

#### 3、降级仲裁器副本集成员（如果有的话）

如果副本集不包括仲裁器，请跳过此步骤。

降级副本集的[仲裁器](https://www.mongodb.com/docs/upcoming/core/replica-set-arbiter/#std-label-replica-set-arbiter-configuration)成员：

1. 在mongosh中运行以下命令以执行干净的关闭，或者参阅 [Stop `mongod`](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)进程以了解安全终止mongod进程的其他方法

   ```
   db.adminCommand( { shutdown: 1 } )
   ```

2. 删除仲裁者数据目录的内容。Thestorage[`storage.dbPath`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.dbPath)配置设置或[`--dbpath`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--dbpath)命令行选项指定仲裁器[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)的数据目录[。](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)

   ```
   rm -rf /path/to/mongodb/datafiles/*
   ```

3. 将5.0二进制文件替换为4.4二进制文件并重新启动。

4. 等待成员恢复到`ARBITER`状态。要查看会员的状态，请连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)成员和runrs[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)方法。

#### 4、降低初选

使用[`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)逐步降低[主](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-primary)程序，强制执行正常的[故障转移](https://www.mongodb.com/docs/upcoming/core/replica-set-high-availability/#std-label-replica-set-failover)程序。

```
rs.stepDown()
```

[`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)加快故障转移程序，比直接关闭主故障转移更可取。

### 5、更换并重新启动以前的主`mongod`

当[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)显示主级已下台，而其他成员已处于`PRIMARY`状态时：

1. 在mongosh中运行以下命令以执行干净关闭，或参阅 [Stop `mongod`](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)进程以了解安全终止mongod进程的其他方法：

   ```
   db.adminCommand( { shutdown: 1 } )
   ```

2. 将[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件替换为4.4二进制文件，然后重新启动。





原文：[Downgrade 5.0 Replica Set to 4.4](https://www.mongodb.com/docs/upcoming/release-notes/5.0-downgrade-replica-set/)



