# 将5.0独立版降级到4.4级

在尝试降级之前，请熟悉本文档的内容。

## 降级路径

如果您需要从5.0降级，请降级到4.4的最新补丁版本。

MongoDB仅支持单版本降级。您不能降级到当前版本后多个版本的版本。您可以将5.0系列降级为4.4系列部署，但是，不支持将4.4系列部署进一步降级为4.2系列部署。

## 创建备份

*可选但推荐。*创建数据库的备份。

## 访问控制

如果您的部署启用了访问控制，则降级用户权限必须包括跨数据库列出和管理索引的权限。具有[`root`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-root)角色的用户拥有所需的特权。

## 先决条件

要从5.0降级到4.4，您必须删除持续存在的不兼容功能和/或更新不兼容的配置设置。这些包括：

**1、群集默认读写问题**

MongoDB 5.0更改了集群范围读写问题默认值，降级到MongoDB 4.4可能会更改这些默认值。在降级之前，考虑手动配置集群的默认读写问题：

* 要手动配置集群的read或writeconcern的默认值，请使用[`setDefaultRWConcern`](https://www.mongodb.com/docs/upcoming/reference/command/setDefaultRWConcern/#mongodb-dbcommand-dbcmd.setDefaultRWConcern)命令。
* 如果群集包含仲裁器，并且您之前已禁用“多数”读取关注以防止在某些情况下出现缓存压力，则可能需要配置[`--enableMajorityReadConcern false`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--enableMajorityReadConcern)或[`replication.enableMajorityReadConcern: false`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-replication.enableMajorityReadConcern)如果降级，则返回false。

**2、带有`.`或`$`字符的文档字段**

MongoDB 5.0增加了对在文档字段名称中包含`.`或`$`字符的支持。在降级到MongoDB 4.4之前，您必须删除任何包含`.`或`$`字符的字段名的文档。

**3、精简格式时区数据文件**

MongoDB 5.0支持超薄格式时区数据文件。如果在部署中使用超薄格式的时区数据文件，如使用[`--timeZoneInfo`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--timeZoneInfo)命令行选项或[`processManagement.timeZoneInfo`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-processManagement.timeZoneInfo)配置文件设置提供给MongoDB的那样，则必须降级到MongoDB 4.4.7或更高版本，或者恢复时区数据文件以使用以前的非超薄格式数据文件。

**4、降级功能兼容性版本（fCV）**

要降级独立`featureCompatibilityVersion`：

1. 将mongo shell连接到mongod实例。

2. 降级`featureCompatibilityVersion`为`"4.4"`

   ```
   db.adminCommand({setFeatureCompatibilityVersion: "4.4"})
   ```

   [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令执行对内部系统集合的写入，并且是幂等的。如果由于任何原因命令未成功完成，请在[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例上重试该命令。

**5、删除fCV 5.0持久功能**

只有当fCV被设置为`"5.0"`时，以下步骤才是必要的。

删除所有与4.4不兼容的持久5.0[功能](https://www.mongodb.com/docs/upcoming/release-notes/5.0-compatibility/#std-label-5.0-compatibility-enabled)。这些包括：

时间序列集合

删除所有[时间序列集合。](https://www.mongodb.com/docs/upcoming/core/timeseries-collections/#std-label-manual-timeseries-collection)

运行时审计过滤器管理

- 通过在节点的配置文件中将`auditLog.runtimeConfiguration`设置为`false`，禁用运行时审计过滤器管理。
- 在本地配置文件中更新此实例的审计过滤器。

**6、删除5.0功能**

删除所有使用5.0功能的持久功能。这些包括但不限于：

- 如果任何视图定义包括5.0运算符，例如[`$dateAdd`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/dateAdd/#mongodb-expression-exp.-dateAdd)或[`$sampleRate`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/sampleRate/#mongodb-expression-exp.-sampleRate)，则必须将其删除。有关完整列表[，](https://www.mongodb.com/docs/upcoming/release-notes/5.0/#std-label-5.0-rel-notes-new-agg-operators)请参阅[新聚合运算符](https://www.mongodb.com/docs/upcoming/release-notes/5.0/#std-label-5.0-rel-notes-new-agg-operators)。

## 程序

> 警告：
>
> 在继续进行降级程序之前，请确保已完成先决条件。

### 1、下载最新的4.4二进制文件。

使用软件包管理器或手动下载，获取4.4系列的最新版本。如果使用软件包管理器，请为4.4二进制文件添加一个新存储库，然后执行实际的降级过程。

> 重要：
>
> 在升级或降级副本集之前，请确保所有副本集成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从5.0降级，请降级到4.4的最新补丁版本。

### 2、关闭`mongod`实例

要干净地关闭[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)进程，请连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到实例并运行：

```
db.adminCommand( { shutdown: 1 } )
```

[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)的[干净关闭](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)可以完成所有待处理操作，将所有数据刷新到数据文件中，并关闭所有数据文件。

### 3、更新配置文件。

在重新启动之前，通过更新[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例的配置文件来禁用任何可配置的5.0功能。

### 4、使用最新的4.4 `mongod`实例重新启动。

将5.0二进制文件替换为下载的4.4[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件，然后重新启动。



原文：[Downgrade 5.0 Standalone to 4.4](https://www.mongodb.com/docs/upcoming/release-notes/5.0-downgrade-standalone/)