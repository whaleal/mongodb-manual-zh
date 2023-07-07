# 生产注意事项（分片集群）

从 4.2 版本开始，MongoDB 提供了为分片集群执行多文档事务的能力。

下一页列出了特定于在分片集群上运行事务的关注点。[这些问题是生产注意事项](https://www.mongodb.com/docs/manual/core/transactions-production-consideration/)中列出的问题之外的问题 [。](https://www.mongodb.com/docs/manual/core/transactions-production-consideration/)

## 分片事务和 MongoDB 驱动程序

*对于 MongoDB 4.2 部署（副本集和分片集群）上的事务*，客户端**必须**使用针对 MongoDB 4.2 更新的 MongoDB 驱动程序。

在具有多个实例的分片集群上[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，使用为 MongoDB 4.0（而不是 MongoDB 4.2）更新的驱动程序执行事务将失败并可能导致错误，包括：



## NOTE

您的驱动程序可能会返回不同的错误。有关详细信息，请参阅驱动程序的文档。

| 错误代码 | 错误信息                                                |
| :------- | :------------------------------------------------------ |
| 251      | `cannot continue txnId -1 for session ... with txnId 1` |
| 50940    | `cannot commit with no participants`                    |

## 表现

### 单个分片

针对单个分片的事务应该具有与副本集事务相同的性能。

### 多个分片

影响多个分片的事务会产生更大的性能成本。



## NOTE

在分片集群上，如果任何涉及的分片包含仲裁程序，则跨越多个分片的事务将出错并中止。



### 时限

要指定时间限制，请在 上指定`maxTimeMS`限制 `commitTransaction`。

如果`maxTimeMS`未指定，MongoDB 将使用 [`transactionLifetimeLimitSeconds`.](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.transactionLifetimeLimitSeconds)

如果`maxTimeMS`指定但会导致事务超过[`transactionLifetimeLimitSeconds`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.transactionLifetimeLimitSeconds)，MongoDB 将使用[`transactionLifetimeLimitSeconds`.](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.transactionLifetimeLimitSeconds)

要[`transactionLifetimeLimitSeconds`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.transactionLifetimeLimitSeconds)为分片集群修改，必须为所有分片副本集节点修改参数。

## 阅读关注

多文档事务支持[`"local"`](https://www.mongodb.com/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-)、 [`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)和[`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)读取关注级别。

对于分片集群上的事务，只有 [`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)读取关注点才能提供跨多个分片的一致快照。

有关阅读关注和交易的更多信息，请参阅 [交易和阅读关注。](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions-read-concern)

## 写下疑虑

您不能在分片[`writeConcernMajorityJournalDefault`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.writeConcernMajorityJournalDefault)设置为的分片集群上运行事务`false` （例如具有使用[内存存储引擎](https://www.mongodb.com/docs/manual/core/inmemory/)的投票节点的分片）。



## NOTE

不管[为事务指定的写关注点](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions-write-concern)如何，分片集群事务的提交操作包括一些使用`{w: "majority", j: true}`写关注点的部分。

## 仲裁节点

如果任何事务操作读取或写入包含仲裁程序的分片，则写入操作跨越多个分片的事务将出错并中止。

## 备份和恢复



## WARNING

[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)和[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore) **不能**成为具有正在进行的分片事务的 4.2+ 分片集群的备份策略的一部分，因为使用创建的备份 [`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump) *不维护*跨分片事务的原子性保证。

对于具有正在进行的分片事务的 4.2+ 分片集群，使用以下协调备份和恢复过程之一，这些过程 *确实维护*跨分片事务的原子性保证：

- [MongoDB 地图集](https://www.mongodb.com/cloud/atlas?tck=docs_server),
- [MongoDB 云管理器](https://www.mongodb.com/cloud/cloud-manager?tck=docs_server)， 要么
- [MongoDB 运营经理](https://www.mongodb.com/products/ops-manager?tck=docs_server).

## 块迁移

[块迁移](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-chunk-migration-procedure)在某些阶段获取独占集合锁。

如果一个正在进行的事务在一个集合上有锁，并且涉及该集合的块迁移开始，这些迁移阶段必须等待事务释放对集合的锁，从而影响块迁移的性能。

如果块迁移与事务交错（例如，如果事务开始时块迁移已经在进行中并且迁移在事务锁定集合之前完成），则事务在提交期间出错并中止。

根据两个操作的交错方式，一些示例错误包括（错误消息已被缩写）：

- `an error from cluster data placement change ... migration commit in progress for <namespace>`
- `Cannot find shardId the chunk belonged to at cluster time ...`



## TIP

### 也可以看看：

[`shardingStatistics.countDonorMoveChunkLockTimeout`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.shardingStatistics.countDonorMoveChunkLockTimeout)

## 提交期间的外部读取

在提交事务期间，外部读取操作可能会尝试读取将由事务修改的相同文档。如果事务写入多个分片，则在跨分片的提交尝试期间

- [`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)使用 read concern或 的外部读取[`"linearizable"`](https://www.mongodb.com/docs/manual/reference/read-concern-linearizable/#mongodb-readconcern-readconcern.-linearizable-)，或者是因果一致会话的一部分（即包括[afterClusterTime](https://www.mongodb.com/docs/manual/reference/read-concern/#std-label-afterClusterTime)）等待事务的所有写入可见。
- 使用其他读取关注点的外部读取不会等待事务的所有写入都可见，而是读取可用文档的事务前版本。



## TIP

### 也可以看看：

[事务和原子性](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions-atomicity)

## 附加信息

另请参阅[生产注意事项。](https://www.mongodb.com/docs/manual/core/transactions-production-consideration/)

←  [生产注意事项](https://www.mongodb.com/docs/manual/core/transactions-production-consideration/)[交易和运营](https://www.mongodb.com/docs/manual/core/transactions-operations/) →

原文链接 -https://docs.mongodb.com/manual/core/transactions-sharded-clusters/ 

译者：陆文龙

