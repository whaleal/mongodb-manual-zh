# 将6.0复制副本集降级为5.0

在尝试降级之前，请熟悉此页面中的内容。

## 降级路径

> 重要：
>
> 在升级或降级副本集之前，请确保所有副本集成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从6.0降级，请降级到5.0的最新补丁版本。

MongoDB仅支持单版本降级。您不能降级到当前版本后多个版本的版本。您可以将6.0系列降级为5.0系列部署，但是，不支持进一步将5.0系列部署降级为4.4系列部署。

## 访问控制

如果您的副本集启用了访问控制，则降级用户权限必须包括跨数据库列出和管理索引的权限。具有[`root`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-root)角色的用户拥有所需的特权。

## 先决条件

在开始降级程序之前，您必须完成以下先决条件步骤。

### 1.创建备份

*可选但推荐。*创建数据库的备份。

要了解如何创建备份，请参阅[MongoDB备份方法。](https://www.mongodb.com/docs/upcoming/core/backups/#std-label-backup-methods)

### 2.移除向后不兼容的功能

要从6.0降级到5.0，您必须删除与5.0不兼容的6.0功能。有关不兼容功能以及如何删除它们的列表，请参阅[降级注意事项。](https://www.mongodb.com/docs/upcoming/release-notes/6.0-compatibility/#std-label-6.0-downgrade-considerations)

### 3.降级功能兼容性版本（fCV）

要降级副本集的fCV：

1. 确保没有进行初始同步。在初始同步进行时运行这些[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令会导致初始同步重新启动。

2. 确保没有节点在其[副本集配置](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/)中包含`newlyAdded`字段。在副本集中的每个节点上运行以下命令以验证这一点：

   ```
   use local
   db.system.replset.find( { "members.newlyAdded" : { $exists : true } } );
   ```

   `newlyAdded`字段仅在初始同步期间和之后不久出现在节点的副本集配置文档中。

3. 确保没有副本集成员处于[`ROLLBACK`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)或[`RECOVERING`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)状态。

4. 使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到您的主服务器。

5. 降级`featureCompatibilityVersion`为`"5.0"`

   ```
   db.adminCommand( { setFeatureCompatibilityVersion: "5.0" } )
   ```

   [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令执行对内部系统集合的写入，并且是幂等的。如果命令没有成功完成，请在主命令上重试该命令。

6. 为了确保副本集的所有成员都具有更新的`featureCompatibilityVersion`，请连接到每个副本集成员并检查`featureCompatibilityVersion`：

   ```
   db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
   ```

   所有成员都应返回一个结果，其中包括：

   ```
   "featureCompatibilityVersion" : { "version" : "5.0" }
   ```

   如果任何成员返回`"6.0"``featureCompatibilityVersion`等待成员返回`"5.0"`版本，然后再继续。

有关返回的`featureCompatibilityVersion`值的详细信息，请参阅 [Get FeatureCompatibilityVersion.](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)

## 降级程序

>警告：
>
>在继续进行降级过程之前，请确保所有复制集成员，包括延迟的复制集成员，都有先决条件更改。为此，请在降级之前检查`featureCompatibilityVersion`并删除每个节点的不兼容功能。

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

### 3、降级副本集的辅助成员

降级副本集的每个[辅助](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-secondary)成员，一次降级一个：

1. 关闭

    要关闭[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)进程，请使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到辅助并运行以下命令：

   ```
   db.adminCommand( { shutdown: 1 } )
   ```

2. 重启

   要启动`mongod`进程，请运行以下命令：

   ```
   mongod --dbpath </path-to-data-folder>
   ```

   要了解有关启动mongod进程的更多信息，请参见[Start `mongod` Processes.](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-start-mongod-processes)

3. 等待成员进入`SECONDARY`状态。

   在降级下一个二级之前，等待成员恢复到`SECONDARY`状态。要检查成员的状态，请使用[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)方法[`mongosh`。](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

4. 在成员进入`SECONDARY`阶段后，下调下一个二级。

### 4、降级仲裁器副本集成员（如果有的话）。

如果副本集不包括仲裁器，请跳过此步骤。

降级副本集的[仲裁器](https://www.mongodb.com/docs/upcoming/core/replica-set-arbiter/#std-label-replica-set-arbiter-configuration)成员：

1. 关闭

   要关闭仲裁器，请使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到仲裁器并运行以下命令：

   ```
   db.adminCommand( { shutdown: 1 } )
   ```

2. 删除仲裁者数据目录的内容.

   要查找仲裁器[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)的数据目录，请检查thestorage[`storage.dbPath`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.dbPath)配置设置或[`--dbpath`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--dbpath)命令行选项。

   运行以下命令：

   ```
   rm -rf /path/to/mongodb/datafiles/*
   ```

3. 重新启动仲裁器。

   要启动`mongod`进程，请运行以下命令：

   ```
   mongod --dbpath </path-to-mongodb-datafiles>
   ```

   要了解有关启动mongod进程的更多信息，请参见[Start `mongod` Processes.](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-start-mongod-processes)

4. 等待成员进入`ARBITER`状态。

   在降级主级之前，请等待成员恢复到`ARBITER`状态。要检查成员的状态，请使用[`mongosh`。](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

### 5、降级主要级别。

1. 降低初选。

   [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，使用[`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)下调主程序，并强制执行正常的故障转移过程。

   ```
   rs.stepDown()
   ```

2. 验证主调是否已下调。

   运行以下命令：

   ```
   rs.status()
   ```

   验证初选是否已下调，并且其他成员是否已处于`PRIMARY`状态。

3. 更换并重新启动以前的主`mongod`。

   * 关闭

     要对主服务器进行关机，请使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到主命令并运行以下命令：

     ```
     db.adminCommand( { shutdown: 1 } )
     ```

   * 用5.0二进制文件重新启动[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)。

     要启动`mongod`进程，请运行以下命令：

     ```
     mongod --dbpath </path-to-mongodb-datafiles>
     ```

     要了解有关启动mongod进程的更多信息，请参见[Start `mongod` Processes.](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-start-mongod-processes)



原文：[Downgrade 6.0 Replica Set to 5.0](https://www.mongodb.com/docs/upcoming/release-notes/6.0-downgrade-replica-set/)