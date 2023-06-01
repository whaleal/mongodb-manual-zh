# 复制参考

## 中的复制方法`mongosh`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replication/#replication-methods-in-mongosh)

| 姓名                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`rs.add()`](https://www.mongodb.com/docs/manual/reference/method/rs.add/#mongodb-method-rs.add) | 将节点添加到副本集。                                         |
| [`rs.addArb()`](https://www.mongodb.com/docs/manual/reference/method/rs.addArb/#mongodb-method-rs.addArb) | 将[仲裁器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-arbiter)添加到副本集。 |
| [`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf) | 返回副本集配置文档。                                         |
| [`rs.freeze()`](https://www.mongodb.com/docs/manual/reference/method/rs.freeze/#mongodb-method-rs.freeze) | 防止当前节点在一段时间内寻求选举为主节点。                   |
| [`rs.help()`](https://www.mongodb.com/docs/manual/reference/method/rs.help/#mongodb-method-rs.help) | 返回[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)函数的基本帮助文本。 |
| [`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate) | 初始化一个新的副本集。                                       |
| [`rs.printReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/rs.printReplicationInfo/#mongodb-method-rs.printReplicationInfo) | 从主节点的角度打印副本集状态的格式化报告。                   |
| [`rs.printSecondaryReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/rs.printSecondaryReplicationInfo/#mongodb-method-rs.printSecondaryReplicationInfo) | 从从节点的角度打印副本集状态的格式化报告。                   |
| [`rs.printSlaveReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/rs.printSlaveReplicationInfo/#mongodb-method-rs.printSlaveReplicationInfo) | *4.4.1 版后已弃用：*改为使用 [`rs.printSecondaryReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/rs.printSecondaryReplicationInfo/#mongodb-method-rs.printSecondaryReplicationInfo)。 |
| [`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig) | 通过应用新的副本集配置对象重新配置副本集。                   |
| [`rs.remove()`](https://www.mongodb.com/docs/manual/reference/method/rs.remove/#mongodb-method-rs.remove) | 从副本集中删除节点。                                         |
| [`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status) | 返回包含有关副本集状态信息的文档。                           |
| [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown) | 使当前[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)成为强制[选举的从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-election) |
| [`rs.syncFrom()`](https://www.mongodb.com/docs/manual/reference/method/rs.syncFrom/#mongodb-method-rs.syncFrom) | 设置此副本集节点将从中同步的节点，覆盖默认的同步目标选择逻辑。 |

## 复制数据库命令[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replication/#replication-database-commands)

| 姓名                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`applyOps`](https://www.mongodb.com/docs/manual/reference/command/applyOps/#mongodb-dbcommand-dbcmd.applyOps) | [将oplog](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-oplog)条目应用于当前数据集的内部命令。 |
| [`hello`](https://www.mongodb.com/docs/manual/reference/command/hello/#mongodb-dbcommand-dbcmd.hello) | 显示有关此节点在副本集中的角色的信息，包括它是否是主节点。   |
| [`replSetAbortPrimaryCatchUp`](https://www.mongodb.com/docs/manual/reference/command/replSetAbortPrimaryCatchUp/#mongodb-dbcommand-dbcmd.replSetAbortPrimaryCatchUp) | 强制选定的[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)中止同步（赶上），然后完成到主节点的转换。 |
| [`replSetFreeze`](https://www.mongodb.com/docs/manual/reference/command/replSetFreeze/#mongodb-dbcommand-dbcmd.replSetFreeze) | 防止当前成员在一段时间内寻求选举为[主成员。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary) |
| [`replSetGetConfig`](https://www.mongodb.com/docs/manual/reference/command/replSetGetConfig/#mongodb-dbcommand-dbcmd.replSetGetConfig) | 返回副本集的配置对象。                                       |
| [`replSetGetStatus`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-dbcommand-dbcmd.replSetGetStatus) | 返回报告副本集状态的文档。                                   |
| [`replSetInitiate`](https://www.mongodb.com/docs/manual/reference/command/replSetInitiate/#mongodb-dbcommand-dbcmd.replSetInitiate) | 初始化一个新的副本集。                                       |
| [`replSetMaintenance`](https://www.mongodb.com/docs/manual/reference/command/replSetMaintenance/#mongodb-dbcommand-dbcmd.replSetMaintenance) | 启用或禁用维护模式，使[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)处于某种`RECOVERING`状态。 |
| [`replSetReconfig`](https://www.mongodb.com/docs/manual/reference/command/replSetReconfig/#mongodb-dbcommand-dbcmd.replSetReconfig) | 将新配置应用于现有副本集。                                   |
| [`replSetResizeOplog`](https://www.mongodb.com/docs/manual/reference/command/replSetResizeOplog/#mongodb-dbcommand-dbcmd.replSetResizeOplog) | 动态调整副本集节点的 oplog 大小。仅适用于 WiredTiger 存储引擎。 |
| [`replSetStepDown`](https://www.mongodb.com/docs/manual/reference/command/replSetStepDown/#mongodb-dbcommand-dbcmd.replSetStepDown) | 强制当前的[primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)下台*并*成为[secondary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)，强制进行选举。 |
| [`replSetSyncFrom`](https://www.mongodb.com/docs/manual/reference/command/replSetSyncFrom/#mongodb-dbcommand-dbcmd.replSetSyncFrom) | 显式覆盖用于选择要从中复制的节点的默认逻辑。                 |

## 副本集参考文档[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replication/#replica-set-reference-documentation)

- [副本集配置](https://www.mongodb.com/docs/manual/reference/replica-configuration/)

  [返回的副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)配置对象的完整文档[`rs.conf()`。](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)

- [副本集协议版本](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/)

  关于副本集协议版本的参考。

- [副本集故障排除](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/)

  副本集故障排除指南。

- [`local`数据库_](https://www.mongodb.com/docs/manual/reference/local-database/)

  实例用于支持复制的`local`数据库内容的完整文档。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

- [副本集节点状态](https://www.mongodb.com/docs/manual/reference/replica-states/)

  副本集primary状态的参考。

←  [使用 PSA 副本集缓解性能问题](https://www.mongodb.com/docs/manual/tutorial/mitigate-psa-performance-issues/)[副本集配置](https://www.mongodb.com/docs/manual/reference/replica-configuration/) →

原文链接 -  https://docs.mongodb.com/manual/reference/replication/ 

译者：陆文龙

