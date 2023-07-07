# 将6.0独立降级到5.0

在尝试降级之前，请熟悉此页面中的内容。

## 降级路径

如果您需要从6.0降级，请降级到5.0的最新补丁版本。

MongoDB仅支持单版本降级。您不能降级到当前版本后多个版本的版本。您可以将6.0系列降级为5.0系列部署，但是，不支持进一步将5.0系列部署降级为4.4系列部署。

## 访问控制

如果您的部署启用了访问控制，则降级用户权限必须包括跨数据库列出和管理索引的权限。具有[`root`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-root)角色的用户拥有所需的特权。

## 先决条件

在开始降级程序之前，您必须完成以下先决条件步骤。

### 1.创建备份

*可选但推荐。*创建数据库的备份。

要了解如何创建备份，请参阅[MongoDB备份方法。](https://www.mongodb.com/docs/upcoming/core/backups/#std-label-backup-methods)

### 2.移除向后不兼容的功能

要从6.0降级到5.0，您必须删除与5.0不兼容的6.0功能。有关不兼容功能以及如何删除它们的列表，请参阅[降级注意事项。](https://www.mongodb.com/docs/upcoming/release-notes/6.0-compatibility/#std-label-6.0-downgrade-considerations)

### 3.降级功能兼容性版本（fCV）

要降级独立实例`featureCompatibilityVersion`：

1. 使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例。

2. 降级`featureCompatibilityVersion`为`"5.0"`

   ```
   db.adminCommand( { setFeatureCompatibilityVersion: "5.0" } )
   ```

   [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令执行对内部系统集合的写入，并且是幂等的。如果命令没有成功完成，请在[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例上重试该命令。

## 降级程序

> 警告：
>
> 在继续进行降级程序之前，请确保已完成先决条件。

### 1、下载最新的5.0二进制文件

使用软件包管理器或手动下载，获取5.0系列的最新补丁版本。如果使用软件包管理器，请为5.0二进制文件添加一个新存储库，然后执行实际的降级过程。

### 2、将6.0二进制文件替换为下载的5.0二进制文件。

确保5.0二进制文件在您的系统PATH中。要确认您的二进制版本，请运行以下命令：

```
mongod --version
```

### 3、关闭`mongod`实例。

要关闭[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)进程，请使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到部署并运行以下命令：

```
db.adminCommand( { shutdown: 1 } )
```

### 4、更新配置文件

在重新启动之前，通过更新[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例的配置文件来禁用任何可配置的6.0功能。

要查看可配置的6.0功能列表，请查看[6.0发布说明。](https://www.mongodb.com/docs/upcoming/release-notes/6.0/#std-label-release-notes-6.0)

### 5、使用最新的5.0 `mongod`实例重新启动。

要启动`mongod`进程，请运行以下命令：

```
mongod --dbpath </path-to-data-folder>
```

要了解有关启动mongod进程的更多信息，请参见 [Start `mongod`Processes.](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-start-mongod-processes)。



原文：[Downgrade 6.0 Standalone to 5.0](https://www.mongodb.com/docs/upcoming/release-notes/6.0-downgrade-standalone/)