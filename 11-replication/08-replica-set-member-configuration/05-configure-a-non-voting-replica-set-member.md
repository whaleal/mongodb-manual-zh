# 配置非投票副本集成员[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-a-non-voting-replica-set-member/#configure-non-voting-replica-set-member)

无投票权的成员允许您添加额外的成员以在最多七名投票成员之外进行阅读分发。

要将成员配置为无投票权，请 使用 [`replSetReconfig`](https://www.mongodb.com/docs/manual/reference/command/replSetReconfig/#mongodb-dbcommand-dbcmd.replSetReconfig)命令*或其*[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)将其 [`members[n\].votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)和[`members[n\].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)值 设置为的辅助方法`0`。非投票副本集成员必须*有*一个 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)。`0`

>## 笔记
>
>从 MongoDB 4.4 开始，副本重新配置一次只能添加或删除*一个*投票副本集成员。要修改多个成员的投票，发出一系列 [`replSetReconfig`](https://www.mongodb.com/docs/manual/reference/command/replSetReconfig/#mongodb-dbcommand-dbcmd.replSetReconfig)或[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)操作以一次修改一个成员。有关详细信息，请参阅 [重新配置一次最多只能添加或删除一个投票成员](https://www.mongodb.com/docs/manual/reference/command/replSetReconfig/#std-label-replSetReconfig-cmd-single-node)。



## 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-a-non-voting-replica-set-member/#procedure)

以下过程将单个[辅助](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary) 副本集成员配置为非投票。要将[主要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary) 成员转换为无投票权成员，您必须首先使用[`replSetStepDown`](https://www.mongodb.com/docs/manual/reference/command/replSetStepDown/#mongodb-dbcommand-dbcmd.replSetStepDown)或其 shell 帮助 程序成功降低主要成员，[`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)然后再执行此过程。

- 1）连接到副本集主

  连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到副本集[primary ：](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)`mongosh --host "<hostname>:<port>"`将`<hostname>`和替换`<port>`为副本集主副本的主机名和端口。包括部署所需的任何其他参数。

- 2) 检索副本配置

  在 shell 中发出[`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)方法并将结果分配给变量`cfg`：`cfg = rs.conf();`返回的[文档](https://www.mongodb.com/docs/manual/reference/replica-configuration/#std-label-replSetGetConfig-output)包含一个 [`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)数组，其中数组中的每个元素都包含单个副本集成员的配置。

- 3) 将成员配置为无投票权

  要将副本成员更改为无投票权，请将其[`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)和 设置[`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)为`0`。`cfg.members[n].votes = 0;cfg.members[n].priority = 0;`替换`n`为要修改的成员的数组索引位置。该[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)数组是*零索引*的，其中数组中的第一个元素的索引位置为 `0`。数组中成员的数组索引位置 *不同于*特定成员的 [`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)数组索引位置。不要*使用*来引用 中任何成员的数组索引 位置[。](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)[`members[n\]._id`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-._id)[`_id`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-._id)[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)

- 4) 使用新配置重新配置副本集

  使用[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)方法使用更新的副本集配置文档重新配置副本集。`rs.reconfig(cfg);`

>## 警告
>
>- shell 方法可以强制当前[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)primary 下台，从而导致[选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)。当主要步骤关闭时， [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)关闭所有客户端连接。虽然这通常需要 10-20 秒，但请尝试在计划的维护期间进行这些更改。
>- 避免重新配置包含不同 MongoDB 版本成员的副本集，因为验证规则可能因 MongoDB 版本而异。



## 相关文件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-a-non-voting-replica-set-member/#related-documents)

- [`members[n\].votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)
- [副本集重新配置](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#std-label-replica-set-reconfiguration-usage)
- [副本集选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/)

←  [Configure a Delayed Replica Set Member](https://www.mongodb.com/docs/manual/tutorial/configure-a-delayed-replica-set-member/)[Convert a Secondary to an Arbiter](https://www.mongodb.com/docs/manual/tutorial/convert-secondary-into-arbiter/) →

原文链接 -  https://docs.mongodb.com/manual/tutorial/configure-a-non-voting-replica-set-member/

译者：陆文龙

