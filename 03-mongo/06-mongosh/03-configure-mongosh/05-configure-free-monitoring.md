# 配置免费监控

*新版本1.4.1*。

`mongosh`当您连接到 MongoDB 社区版集群时，会提示您启用 MongoDB 的免费监控服务。

监控服务提供有关您的部署的信息，例如操作执行时间和内存使用情况。

要启用免费监控，请运行以下命令

```shell
db.enableFreeMonitoring()
```

要永久禁用此提醒，请运行以下命令：

```shell
db.disableFreeMonitoring()
```

有关免费监控的更多信息，请参阅 [免费监控。](https://www.mongodb.com/docs/manual/administration/free-monitoring/)



翻译：韩鹏帅

原文： [Configure Free Monitoring](https://www.mongodb.com/docs/mongodb-shell/free-monitoring/)
