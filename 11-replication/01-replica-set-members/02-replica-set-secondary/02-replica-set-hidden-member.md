# 隐藏的副本集成员

隐藏节点维护[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary) 数据集的副本，但对客户端应用程序**不可见**。隐藏节点适用于与[副本集中](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)其他节点具有不同使用模式的工作负载。隐藏节点必须始终是 [优先级为 0 的节点](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/#std-label-replica-set-secondary-only-members)，因此**不能成为主节点**。该[`db.hello()`](https://www.mongodb.com/docs/manual/reference/method/db.hello/#mongodb-method-db.hello)方法不显示隐藏成员。然而，隐藏节点**可以**在 [选举中投票。](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)

在下面的五个节点的副本集中，所有四个从节点都有主数据集的副本，但隐藏了一个从节点。

![具有隐藏优先级 0 成员的 5 成员副本集的图表。](../../../images/replica-set-hidden-member01.svg)

## 行为

### 读取操作

客户端不会将具有适当[阅读偏好](https://www.mongodb.com/docs/manual/core/read-preference/)的阅读分配给隐藏的从节点。因此，除了基本复制之外，这些节点不会收到任何流量。将隐藏节点用于专门的任务，例如报告和备份。



## IMPORTANT

如果您的集包含[delayed节点](https://www.mongodb.com/docs/manual/core/replica-set-delayed-member/)，请确保延迟节点(delayed节点)是隐藏的且没有投票权。

隐藏延迟复制集节点可以防止应用程序在没有直接连接到该节点的情况下查看和查询延迟数据。使延迟的副本集节点无投票权意味着他们将不计入确认具有写安全的写操作 [`"majority"`。](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)

如果不隐藏延迟节点，当一个或多个节点不可用时，副本集必须等待延迟节点，并且提交点滞后。滞后的提交点可能会导致性能问题。

例如，考虑一个 Primary-Secondary-Delayed 副本集配置，其中延迟的从节点以 10 分钟的延迟进行投票。

在一个非延迟的从节点不可用的情况下，Primary-Delayed 的降级配置必须等待至少 10 分钟才能确认写入操作[`"majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)。多数提交点将需要更长的时间才能推进，从而导致缓存压力类似于 [主节点的性能问题Secondary 和 Arbiter](https://www.mongodb.com/docs/manual/core/replica-set-architecture-three-members/#std-label-rs-architecture-psa) (PSA) 副本集。

有关多数提交点的更多信息，请参阅 [因果一致性和读写问题](https://www.mongodb.com/docs/manual/core/causal-consistency-read-write-concerns/)。有关解决性能问题的更多详细信息，请参阅 [副本集维护教程。](https://www.mongodb.com/docs/manual/tutorial/mitigate-psa-performance-issues/#std-label-performance-issues-psa)

在分片集群中，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)不要与隐藏节点交互。

### 表决

隐藏成员*可以*在副本集选举中投票。如果您停止投票的隐藏节点，请确保该集合拥有多数活跃节点，否则 [主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)将下台。

为了备份的目的，

- [`db.fsyncLock()`](https://www.mongodb.com/docs/manual/reference/method/db.fsyncLock/#mongodb-method-db.fsyncLock)使用低级备份实用程序（例如 、 或 ）确保可以安全地复制`cp`数据`scp`文件 `tar`。A[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)开始使用复制的文件包含用户写入的数据，这些数据与锁定的[`mongod`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)由于[日志同步](https://www.mongodb.com/docs/manual/core/journaling/#std-label-journal-process)或 [WiredTiger 快照](https://www.mongodb.com/docs/manual/core/wiredtiger/#std-label-storage-wiredtiger-checkpoints)等操作，锁定的数据文件可能会更改。虽然这对逻辑数据（例如客户端访问的数据）没有影响，但一些备份实用程序可能会检测到这些更改并发出警告或因错误而失败。有关 MongoDB 推荐的备份实用程序和过程的更多信息，请参阅 [MongoDB 备份方法。](https://www.mongodb.com/docs/manual/core/backups/)

### 写安全

隐藏的副本集节点可以确认用发出的写操作[`w: `](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)。但是，对于用 发出的写操作[`w : "majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)，隐藏节点也必须是有投票权的节点（即[`members[n].votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes) 大于`0`）才能确认`"majority"`写操作。非投票副本集成员（即[`members[n].votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes) is `0`）不能参与确认具有 `majority`写安全的写操作。

## 进一步阅读

有关备份 MongoDB 数据库的更多信息，请参阅[MongoDB 备份方法](https://www.mongodb.com/docs/manual/core/backups/)。要配置隐藏节点，请参阅 [配置隐藏副本集成员。](https://www.mongodb.com/docs/manual/tutorial/configure-a-hidden-replica-set-member/)

←  [优先级为 0 的副本集节点](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/)[延迟副本集节点](https://www.mongodb.com/docs/manual/core/replica-set-delayed-member/)



原文 链接- https://docs.mongodb.com/manual/core/replica-set-hidden-member/ 

译者：陆文龙

