## 免费监控

> **警告**
>
> **免费监控已被弃用**
>
> 免费监控已于 2023 年 4 月被弃用，并将于 2023 年 8 月停用。
>
> 从 2023 年 4 月开始，您无法对 MongoDB 社区实例启用免费监控。当前使用免费监控的部署可以继续访问免费监控 UI，直到 2023 年 8 月。
>
> 您可以为您的部署选择另一个监控选项：
>
> - **部署 MongoDB Atlas 专用集群**。[迁移您的数据](https://www.mongodb.com/docs/atlas/migration-live-atlas-managed/#std-label-live-migration)到一个[MongoDB 阿特拉斯](https://www.mongodb.com/docs/atlas/getting-started/#std-label-atlas-getting-started)专用集群大小 M10 或更大，其中包括多种高级监控和警报功能：
>
>   * [Query Profiler](https://www.mongodb.com/docs/atlas/tutorial/profile-database/#std-label-query-profiler)
>   * [Performance Advisor](https://www.mongodb.com/docs/atlas/performance-advisor/#std-label-performance-advisor)
>   * [Real-Time Performance Panel](https://www.mongodb.com/docs/atlas/real-time-performance-panel/#std-label-real-time-metrics-status-tab)
>
>   通过应用代码获得 100 美元的 Atlas 积分 `FREE-MONITORING-100`。仅限前 300 位用户。
>
> - **部署 MongoDB Atlas 免费集群**。免费的 Atlas 集群包括基本的监控和警报功能。您先请 [
>   创建一个免费集群](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/)， 使用[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)和 [`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)手动创建数据库备份并从 MongoDB 社区实例导入数据。
>
> - **使用 MongoDB 云管理器**。这[MongoDB 云管理器](https://docs.cloudmanager.mongodb.com/)免费套餐包括基本的监控功能。

*4.0版本中的新功能*。

从版本 4.0 开始，MongoDB（社区版）为独立版本和副本集提供免费的云监控。

### 监测数据

免费监控提供有关您的部署的信息，包括：

- 操作执行时间
- 内存使用情况
- CPU使用率
- 操作计数

数据在上传24小时后过期。有关数据上传和过期的更多信息，请参阅 [监控数据和过期时间。](https://www.mongodb.com/docs/manual/administration/free-monitoring/#std-label-free-monitoring-data-expiration)

### 启用/禁用免费监控

默认情况下，您可以使用 [`db.enableFreeMonitoring()`](https://www.mongodb.com/docs/manual/reference/method/db.enableFreeMonitoring/#mongodb-method-db.enableFreeMonitoring)和启用/禁用运行时期间的免费监控[`db.disableFreeMonitoring()`。](https://www.mongodb.com/docs/manual/reference/method/db.disableFreeMonitoring/#mongodb-method-db.disableFreeMonitoring)

您还可以使用以下任一方法在启动过程中启用或禁用免费监控 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

- 配置文件设置[`cloud.monitoring.free.state`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-cloud.monitoring.free.state) 或
- 命令行选项[`--enableFreeMonitoring`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--enableFreeMonitoring)

启用免费监控后，它将保持启用状态，直到您将其禁用为止。

要查看您的免费监控状态，

- 使用该[`db.getFreeMonitoringStatus()`](https://www.mongodb.com/docs/manual/reference/method/db.getFreeMonitoringStatus/#mongodb-method-db.getFreeMonitoringStatus)方法。
- 该[`serverStatus`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)帮助程序 [`db.serverStatus()`](https://www.mongodb.com/docs/manual/reference/method/db.serverStatus/#mongodb-method-db.serverStatus)还包括该[`freeMonitoring`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.freeMonitoring)领域的免费监控统计数据。

### 访问控制

当使用访问控制运行时，用户必须具有以下权限才能启用免费监控并获取状态：

```
{ resource: { cluster : true }, actions: [ "setFreeMonitoring", "checkFreeMonitoringStatus" ] }
```

内置角色[`clusterMonitor`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterMonitor)role 提供此特权。

### 监控数据和有效期

启用后，监控数据会定期上传。监控数据24小时后过期。即您只能访问过去24小时内上传的监控数据。

如果您禁用免费监控并稍后重新启用免费监控，您可以访问过去 24 小时内尚未过期的之前指标。

### 监控网址

当您启用免费监控时，您将获得一个唯一的 URL，您可以在其中访问监控的数据。

>  重要的
>
> 与您共享此唯一 URL 的任何人都可以访问您的监控数据。





 参见

原文 - [Free Monitoring]( https://docs.mongodb.com/manual/administration/free-monitoring/ )

