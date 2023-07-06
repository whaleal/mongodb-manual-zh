# 替换副本集成员

如果您需要更改副本集成员的主机名而不更改该成员或副本集的配置，则可以使用本教程中概述的操作。例如，如果您必须重新配置系统或重命名主机，您可以使用此模式来最小化更改的范围。

## Operation

要更改副本集成员的主机名，请修改该 [`members[n\].host`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.host)字段。当您重新配置集合时，字段的值 [`members[n\]._id`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-._id)不会改变。

有关更多信息， 请参阅[副本集配置](https://www.mongodb.com/docs/manual/reference/replica-configuration/)[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)。



>## NOTE
>
>任何副本集配置更改都可以触发当前 [主](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)节点下台，从而强制进行[选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)。在选举期间，当前 shell 会话和连接到此副本集的客户端断开连接，即使操作成功也会产生错误。



## 例子

要将在`mongo2.example.net`处配置的副本集成员的主机名更改为`members[0]`，请发出以下命令序列：

```
cfg = rs.conf()
cfg.members[0].host = "mongo2.example.net"
rs.reconfig(cfg)
```



←  [从副本集中删除节点](https://www.mongodb.com/docs/manual/tutorial/remove-replica-set-member/)[节点配置教程](https://www.mongodb.com/docs/manual/administration/replica-set-member-configuration/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/replace-replica-set-member/

译者：陆文龙
