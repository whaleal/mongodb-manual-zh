# 管理链式复制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/manage-chained-replication/#manage-chained-replication)

从 2.0 版本开始，MongoDB 支持链式复制。当一个[次要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员从另一个次要成员而不是从[主要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)成员复制时，就会发生链式复制。这可能是这种情况，例如，如果辅助节点根据 ping 时间选择其复制目标并且最近的成员是另一个辅助节点。

链式复制可以减少主节点的负载。但链式复制也可能导致复制滞后增加，具体取决于网络拓扑。

您可以使用[副本集配置](https://www.mongodb.com/docs/manual/reference/replica-configuration/)[`settings.chainingAllowed`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.chainingAllowed)中的 设置在链式复制导致延迟的情况下禁用链式复制。

MongoDB 默认启用链式复制。此过程描述了如何禁用它以及如何重新启用它。

>## 笔记
>
>如果链式复制被禁用，您仍然可以使用 [`replSetSyncFrom`](https://www.mongodb.com/docs/manual/reference/command/replSetSyncFrom/#mongodb-dbcommand-dbcmd.replSetSyncFrom)来指定一个辅助从另一个辅助复制。但是该配置只会持续到次要重新计算要从哪个成员同步。



## 禁用链式复制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/manage-chained-replication/#disable-chained-replication)

要禁用链式复制，请将 [Replica Set Configuration](https://www.mongodb.com/docs/manual/reference/replica-configuration/)[`settings.chainingAllowed`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.chainingAllowed)中的 字段设置为。`false`

您可以使用以下命令序列设置 [`settings.chainingAllowed`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.chainingAllowed)为 `false`：

1. 将配置设置复制到`cfg`对象中：

   ```
   cfg = rs.config()
   ```

   

2. 注意当前配置设置是否包含 `settings`嵌入文档。如果他们这样做，请跳过此步骤。

   >## 警告
   >
   >为避免数据丢失，如果配置设置包含`settings`嵌入文档，请跳过此步骤。

   如果当前配置设置**不**包含 `settings`嵌入文档，请通过发出以下命令创建嵌入文档：

   ```
   cfg.settings = { }
   ```

   

3. 发出以下命令序列以设置 [`settings.chainingAllowed`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.chainingAllowed)为 `false`：

   ```
   cfg.settings.chainingAllowed = false
   rs.reconfig(cfg)
   ```

   

## 重新启用链式复制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/manage-chained-replication/#re-enable-chained-replication)

要重新启用链式复制，请设置 [`settings.chainingAllowed`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.chainingAllowed)为`true`. 您可以使用以下命令序列：

```
cfg = rs.config()
cfg.settings.chainingAllowed = true
rs.reconfig(cfg)
```



←  [使用不可用成员重新配置副本集](https://www.mongodb.com/docs/manual/tutorial/reconfigure-replica-set-with-unavailable-members/)[更改副本集中的主机名](https://www.mongodb.com/docs/manual/tutorial/change-hostnames-in-a-replica-set/) →

原文链接 -  https://docs.mongodb.com/manual/tutorial/change-hostnames-in-a-replica-set/

译者：陆文龙

