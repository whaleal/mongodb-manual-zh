# 生产注意事项

下一页列出了运行事务的一些生产注意事项。无论您是在副本集还是分片集群上运行事务，这些都适用。对于在分片集群上运行事务，另请参阅[生产注意事项（分片集群）](https://www.mongodb.com/docs/manual/core/transactions-sharded-clusters/)以了解特定于分片集群的其他注意事项。

## 可用性

- **在 4.0 版本**中，MongoDB 支持副本集上的多文档事务。

- **在 4.2 版本**中，MongoDB 引入了分布式事务，增加了对分片集群上的多文档事务的支持，并合并了现有的对副本集上的多文档事务的支持。

  要在 MongoDB 4.2 部署（副本集和分片集群）上使用事务，客户端**必须**使用针对 MongoDB 4.2 更新的 MongoDB 驱动程序。



## NOTE

### 分布式事务和多文档事务

从 MongoDB 4.2 开始，这两个术语是同义词。分布式事务是指分片集群和副本集上的多文档事务。从 MongoDB 4.2 开始，多文档事务（无论是在分片集群还是副本集上）也称为分布式事务。

## 功能兼容性

要使用事务，部署的所有节点的[featureCompatibilityVersion](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv) 必须至少为：

| 部署     | 最低限度`featureCompatibilityVersion` |
| :------- | :------------------------------------ |
| 副本集   | `4.0`                                 |
| 分片集群 | `4.2`                                 |

要检查某个节点的 fCV，请连接到该成员并运行以下命令：

```
db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
```



有关详细信息，请参阅 [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)参考页。



## 运行时间限制

默认情况下，事务的运行时间必须少于一分钟。[`transactionLifetimeLimitSeconds`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.transactionLifetimeLimitSeconds)您可以使用 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例修改此限制 。对于分片集群，必须为所有分片副本集节点修改该参数。超过此限制的事务被视为已过期，并将被定期清理过程中止。

对于分片集群，您还可以指定`maxTimeMS`对 `commitTransaction`. 有关更多信息，请参阅[分片集群事务时间限制。](https://www.mongodb.com/docs/manual/core/transactions-sharded-clusters/#std-label-transactions-sharded-clusters-time-limit)



## 操作日志大小限制

- 从 4.2 版开始，

  MongoDB 根据需要创建尽可能多的 oplog 条目来封装事务中的所有写操作，而不是事务中所有写操作的单个条目。这消除了单个 oplog 条目对其所有写入操作强加的 16MB 事务总大小限制。尽管删除了总大小限制，但每个 oplog 条目仍必须在 16MB 的 BSON 文档大小限制内。

- 在 4.0 版本中，

  如果事务包含任何写操作，MongoDB 在提交时创建一个单独的[oplog（操作日志）条目。](https://www.mongodb.com/docs/manual/core/replica-set-oplog/)也就是说，事务中的各个操作没有相应的 oplog 条目。相反，单个 oplog 条目包含事务中的所有写操作。事务的 oplog 条目必须在 BSON 文档大小限制 16MB 之内。

## WiredTiger缓存

为防止存储缓存压力对性能产生负面影响：

- 当您放弃交易时，中止交易。
- 当您在事务中的单个操作期间遇到错误时，中止并重试该事务。

[`transactionLifetimeLimitSeconds`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.transactionLifetimeLimitSeconds)它还确保定期中止过期事务以减轻存储缓存压力。



## NOTE

如果您有超过 5% 的未提交事务， [`WiredTiger cache size`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.wiredTiger.engineConfig.cacheSizeGB)事务将中止并返回[写入冲突](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-write-conflict)错误。

## 交易与安全

- 如果使用[访问控制](https://www.mongodb.com/docs/manual/core/authorization/)运行，您必须拥有[事务](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions-operations)中 操作的[权限](https://www.mongodb.com/docs/manual/reference/built-in-roles/)[。](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions-operations)
- 如果运行[审计](https://www.mongodb.com/docs/manual/core/auditing/)，中止事务中的操作仍然被审计。但是，没有审计事件表明事务已中止。



## 分片配置限制

您不能在分片[`writeConcernMajorityJournalDefault`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.writeConcernMajorityJournalDefault)设置为的分片集群上运行事务`false` （例如具有使用[内存存储引擎](https://www.mongodb.com/docs/manual/core/inmemory/)的投票节点的分片）。

## 分片集群和仲裁者

如果任何事务操作读取或写入包含仲裁程序的分片，则写入操作跨越多个分片的事务将出错并中止。



## 获取锁

默认情况下，事务最多等待`5`毫秒以获取事务中操作所需的锁。如果事务无法在`5`毫秒内获取其所需的锁，则事务中止。

事务在中止或提交时释放所有锁。



## TIP

在开始事务之前立即创建或删除集合时，如果在事务中访问集合，请发出带有写入关注的创建或删除操作，[`"majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)以确保事务可以获得所需的锁。

### 锁定请求超时

您可以使用该[`maxTransactionLockRequestTimeoutMillis`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.maxTransactionLockRequestTimeoutMillis) 参数来调整事务等待获取锁的时间。增加[`maxTransactionLockRequestTimeoutMillis`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.maxTransactionLockRequestTimeoutMillis)允许事务中的操作等待指定的时间来获取所需的锁。这有助于避免事务因瞬时并发锁获取而中止，例如快速运行的元数据操作。但是，这可能会延迟死锁事务操作的中止。

您还可以通过设置 [`maxTransactionLockRequestTimeoutMillis`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.maxTransactionLockRequestTimeoutMillis)为来使用特定于操作的超时`-1`。



## 挂起的 DDL 操作和事务

如果正在进行多文档事务，则影响相同数据库或集合的新 DDL 操作将在事务后等待。虽然存在这些挂起的 DDL 操作，但访问与挂起的 DDL 操作相同的数据库或集合的新事务无法获得所需的锁，并且将在等待后中止[`maxTransactionLockRequestTimeoutMillis`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.maxTransactionLockRequestTimeoutMillis)。此外，访问相同数据库或集合的新非事务操作将阻塞，直到达到 `maxTimeMS`限制。

考虑以下场景：

- 需要集合锁的 DDL 操作

  当正在进行的事务`employees`对数据库中的集合执行各种 CRUD 操作时`hr`，管理员[`db.collection.createIndex()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)对集合发出 DDL 操作`employees`。 [`createIndex()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)需要对集合进行独占集合锁定。在进行中的事务完成之前， [`createIndex()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)操作必须等待获取锁。任何影响`employees` 收集并在[`createIndex()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) 挂起时启动的新事务必须等到 [`createIndex()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)完成。挂起的[`createIndex()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)DDL 操作不会影响`hr`数据库中其他集合的事务。例如，数据库中`contractors`集合的新事务`hr`可以正常启动和完成。

- 需要数据库锁的 DDL 操作

  当正在进行的事务对数据库中的集合执行各种 CRUD 操作时`employees`，`hr`管理员对同一数据库 [`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)中的集合发出 DDL 操作。需要父 数据库上的数据库锁。`contractors`[`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)`hr`在进行中的事务完成之前，[`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod) 操作必须等待获取锁。任何影响`hr`数据库或其*任何*集合并在[`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)挂起时启动的新事务必须等到 [`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)完成。

在任何一种情况下，如果 DDL 操作保持挂起的时间超过 [`maxTransactionLockRequestTimeoutMillis`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.maxTransactionLockRequestTimeoutMillis)，则等待该操作的挂起事务将中止。也就是说， 的值 [`maxTransactionLockRequestTimeoutMillis`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.maxTransactionLockRequestTimeoutMillis)必须至少涵盖正在进行的事务*和*挂起的 DDL 操作完成所需的时间。



## TIP

### 也可以看看：

- [正在进行的事务和写入冲突](https://www.mongodb.com/docs/manual/core/transactions-production-consideration/#std-label-transactions-write-conflicts)
- [正在进行的事务和过时的读取](https://www.mongodb.com/docs/manual/core/transactions-production-consideration/#std-label-transactions-stale-reads)
- [哪些管理命令锁定数据库？](https://www.mongodb.com/docs/manual/faq/concurrency/#std-label-faq-concurrency-database-lock)
- [哪些管理命令锁定集合？](https://www.mongodb.com/docs/manual/faq/concurrency/#std-label-faq-concurrency-collection-lock)



## 正在进行的事务和写入冲突

如果事务正在进行中，并且事务外的写入修改了事务中的操作稍后试图修改的文档，则事务会因为写入冲突而中止。

如果一个事务正在进行中并且已经获取了修改文档的锁，当事务外部的写操作试图修改同一个文档时，写操作会一直等到事务结束。



## TIP

### 也可以看看：

- [获取锁](https://www.mongodb.com/docs/manual/core/transactions-production-consideration/#std-label-txns-locks)
- [挂起的 DDL 操作和事务](https://www.mongodb.com/docs/manual/core/transactions-production-consideration/#std-label-txn-prod-considerations-ddl)
- [`$currentOp output`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/currentOp/#mongodb-data--currentOp.prepareReadConflicts)



## 正在进行的事务和过时的读取

事务内的读取操作可以返回陈旧数据。也就是说，事务内的读取操作不能保证看到其他已提交事务或非事务写入执行的写入。例如，考虑以下序列：1) 事务正在进行中 2) 事务外的写删除文档 3) 事务内的读操作能够读取现在删除的文档，因为该操作正在使用快照从写之前。

为避免在单个文档的事务内部读取过时，您可以使用该[`db.collection.findOneAndUpdate()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/#mongodb-method-db.collection.findOneAndUpdate)方法。例如：

```
session.startTransaction( { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } } );

employeesCollection = session.getDatabase("hr").employees;

employeeDoc = employeesCollection.findOneAndUpdate(
   { _id: 1, employee: 1, status: "Active" },
   { $set: { employee: 1 } },
   { returnNewDocument: true }
);
```



- 如果员工文档在事务之外发生了更改，则事务中止。
- 如果员工文件没有改变，事务返回文件并锁定文件。

## 进行中的事务和块迁移

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

## 错误

### MongoDB 4.0 驱动程序的使用

要在 MongoDB 4.2 部署（副本集和分片集群）上使用事务，客户端**必须**使用针对 MongoDB 4.2 更新的 MongoDB 驱动程序。

在具有多个实例的分片集群上[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，使用为 MongoDB 4.0（而不是 MongoDB 4.2）更新的驱动程序执行事务将失败并可能导致错误，包括：



## NOTE

您的驱动程序可能会返回不同的错误。有关详细信息，请参阅驱动程序的文档。

| 错误代码 | 错误信息                                                |
| :------- | :------------------------------------------------------ |
| 251      | `cannot continue txnId -1 for session ... with txnId 1` |
| 50940    | `cannot commit with no participants`                    |

## 附加信息



## TIP

### 也可以看看：

[生产注意事项（分片集群）](https://www.mongodb.com/docs/manual/core/transactions-sharded-clusters/)

←  [Drivers API](https://www.mongodb.com/docs/manual/core/transactions-in-applications/)[Production Considerations (Sharded Clusters)](https://www.mongodb.com/docs/manual/core/transactions-sharded-clusters/) →

原文链接 - https://docs.mongodb.com/manual/core/transactions-production-consideration/ 

译者：陆文龙

