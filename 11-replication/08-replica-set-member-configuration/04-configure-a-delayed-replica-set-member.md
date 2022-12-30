# 配置延迟副本集成员[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-a-delayed-replica-set-member/#configure-a-delayed-replica-set-member)

要配置延迟的辅助成员，请将其 [`members[n\].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)值设置为`0`， 将其值设置[`members[n\].hidden`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.hidden)为`true`，并将其[`members[n\].secondaryDelaySecs`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.secondaryDelaySecs)值设置为要延迟的秒数。

>## 重要的
>
>辅助的长度 [`members[n\].secondaryDelaySecs`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.secondaryDelaySecs)必须适合 oplog 的窗口。如果 oplog 比[`members[n\].secondaryDelaySecs`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.secondaryDelaySecs) 窗口短，则延迟成员无法成功复制操作。
>
>当您配置延迟成员时，延迟既适用于复制，也适用于成员的[oplog](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-oplog)。有关延迟成员及其使用的详细信息，请参阅 [延迟副本集成员。](https://www.mongodb.com/docs/manual/core/replica-set-delayed-member/)



## 例子[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-a-delayed-replica-set-member/#example)

以下示例为当前位于数组索引处的次要成员设置 1 小时的`0`延迟 [`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)。要设置延迟，请发出以下操作序列[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到主要的会话：

```
cfg = rs.conf()
cfg.members[0].priority = 0
cfg.members[0].hidden = true
cfg.members[0].secondaryDelaySecs = 3600
rs.reconfig(cfg)
```



副本集重新配置后，延迟的次要成员无法成为[主要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)成员，并且对应用程序是隐藏的。该 [`members[n\].secondaryDelaySecs`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.secondaryDelaySecs)值将复制和成员的[oplog](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-oplog)延迟3600 秒（1 小时）。

更新副本配置对象时，使用**数组索引**[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)访问数组 中的副本集成员。数组索引以. 不要将此索引值与数组中每个文档中的 **字段**值混淆。`0`[`members[n\]._id`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-._id)[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)

>## 警告
>
>- shell 方法可以强制当前[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)primary 下台，从而导致[选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)。当主要步骤关闭时， [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)关闭所有客户端连接。虽然这通常需要 10-20 秒，但请尝试在计划的维护期间进行这些更改。
>- 避免重新配置包含不同 MongoDB 版本成员的副本集，因为验证规则可能因 MongoDB 版本而异。

## 相关文件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-a-delayed-replica-set-member/#related-documents)

- [`members[n\].secondaryDelaySecs`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.secondaryDelaySecs)
- [副本集重新配置](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#std-label-replica-set-reconfiguration-usage)
- [操作日志大小](https://www.mongodb.com/docs/manual/core/replica-set-oplog/#std-label-replica-set-oplog-sizing)
- [更改 Oplog](https://www.mongodb.com/docs/manual/tutorial/change-oplog-size/)教程的大小
- [副本集选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/)

←  [配置一个隐藏的副本集成员](https://www.mongodb.com/docs/manual/tutorial/configure-a-hidden-replica-set-member/)[配置非投票副本集成员](https://www.mongodb.com/docs/manual/tutorial/configure-a-non-voting-replica-set-member/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/configure-a-delayed-replica-set-member/ 

译者：陆文龙

