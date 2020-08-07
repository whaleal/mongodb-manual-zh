# Replica Set Oplog[¶](https://docs.mongodb.com/manual/core/replica-set-oplog/#replica-set-oplog)

# 副本集Oplog

On this page

- [Oplog Size](https://docs.mongodb.com/manual/core/replica-set-oplog/#oplog-size) Oplog 大小
- [Workloads that Might Require a Larger Oplog Size](https://docs.mongodb.com/manual/core/replica-set-oplog/#workloads-that-might-require-a-larger-oplog-size)可能需要更大Oplog的工作负载
- [Oplog Status](https://docs.mongodb.com/manual/core/replica-set-oplog/#oplog-status)Oplog状态
- [Slow Oplog Application](https://docs.mongodb.com/manual/core/replica-set-oplog/#slow-oplog-application)慢Oplog应用程序
- [Oplog Collection Behavior](https://docs.mongodb.com/manual/core/replica-set-oplog/#oplog-collection-behavior)Oplog集合的特性

The [oplog](https://docs.mongodb.com/manual/reference/glossary/#term-oplog) (operations log) is a special [capped collection](https://docs.mongodb.com/manual/reference/glossary/#term-capped-collection) that keeps a rolling record of all operations that modify the data stored in your databases.

oplog(操作日志)是一个特殊的[有限集合](https://docs.mongodb.com/manual/reference/glossary/#term-capped-collection)，它对数据库中所存储数据的所有修改操作进行滚动记录。

NOTE说明

Starting in MongoDB 4.0, unlike other capped collections, the oplog can grow past its configured size limit to avoid deleting the [`majority commit point`](https://docs.mongodb.com/manual/reference/command/replSetGetStatus/#replSetGetStatus.optimes.lastCommittedOpTime).

从MongoDB 4.0开始，与其他有限集合不同，oplog集合可以超过其配置的大小限制，以避免[大多数提交点](https://docs.mongodb.com/manual/reference/command/replSetGetStatus/#replSetGetStatus.optimes.lastCommittedOpTime)被删除。

MongoDB applies database operations on the [primary](https://docs.mongodb.com/manual/reference/glossary/#term-primary) and then records the operations on the primary’s oplog. The [secondary](https://docs.mongodb.com/manual/reference/glossary/#term-secondary) members then copy and apply these operations in an asynchronous process. All replica set members contain a copy of the oplog, in the [`local.oplog.rs`](https://docs.mongodb.com/manual/reference/local-database/#local.oplog.rs) collection, which allows them to maintain the current state of the database.

MongoDB在[主节点](https://docs.mongodb.com/manual/reference/glossary/#term-primary)上应用数据库操作，然后将这些操作记录到主节点的oplog上。然后[从节点](https://docs.mongodb.com/manual/reference/glossary/#term-secondary)成员会以异步的方式复制并应用这些操作。所有副本集成员都包含一个oplog的副本，其位于[local.oplog.rs ](https://docs.mongodb.com/manual/reference/local-database/#local.oplog.rs)集合中，该集合可以让副本集成员维护数据库的当前状态。

To facilitate replication, all replica set members send heartbeats (pings) to all other members. Any [secondary](https://docs.mongodb.com/manual/reference/glossary/#term-secondary) member can import oplog entries from any other member.

为了便于复制，所有副本集成员将心跳(ping)发送给所有其他成员。任何[从节点](https://docs.mongodb.com/manual/reference/glossary/#term-secondary)成员都可以从任何其他成员导入oplog条目。

Each operation in the oplog is [idempotent](https://docs.mongodb.com/manual/reference/glossary/#term-idempotent). That is, oplog operations produce the same results whether applied once or multiple times to the target dataset.

oplog中的每个操作都是[幂等的](https://docs.mongodb.com/manual/reference/glossary/#term-idempotent)。也就是说，对目标数据集应用一次或多次oplog操作都会产生相同的结果。



## Oplog Size

## Oplog 大小

When you start a replica set member for the first time, MongoDB creates an oplog of a default size if you do not specify the oplog size. [[1\]](https://docs.mongodb.com/manual/core/replica-set-oplog/#oplog)

当您第一次启动一个副本集成员时，如果您没有指定oplog大小，MongoDB将创建一个默认大小的oplog。[[1\]](https://docs.mongodb.com/manual/core/replica-set-oplog/#oplog)

- For Unix and Windows systems

  The default oplog size depends on the storage engine:

  Storage Engine                        Default Oplog Size              Lower Bound      Upper Bound

  [In-Memory Storage Engine](https://docs.mongodb.com/manual/core/inmemory/)    5% of physical memory     50 MB                   50 GB

  [WiredTiger Storage Engine](https://docs.mongodb.com/manual/core/wiredtiger/)    5% of free disk space         990MB                  50 GB

- For 64-bit macOS systems

  The default oplog size is 192 MB of either physical memory or free disk space depending on the storage engine:

  Storage Engine                          Default Oplog Size             

  [In-Memory Storage Engine](https://docs.mongodb.com/manual/core/inmemory/)      192 MB of physical memory

  [WiredTiger Storage Engine](https://docs.mongodb.com/manual/core/wiredtiger/)      192 MB of free disk space

- 对于Unix和Windows系统

  oplog大小依赖于存储引擎：

  | 存储引擎           | 默认oplog大小    | 下限  | 上限 |
  | ------------------ | ---------------- | ----- | ---- |
  | In-Memory存储引擎  | 物理内存的5%     | 50MB  | 50GB |
  | WiredTiger存储引擎 | 空闲磁盘空间的5% | 990MB | 50GB |

- 对于64-bit macOS系统

  默认的oplog大小是192MB物理内存或空闲磁盘空间，具体取决于存储引擎:

  | 存储引擎           | 默认oplog大小     |
  | ------------------ | ----------------- |
  | In-Memory存储引擎  | 192MB物理内存     |
  | WiredTiger存储引擎 | 192MB空闲磁盘空间 |

In most cases, the default oplog size is sufficient. For example, if an oplog is 5% of free disk space and fills up in 24 hours of operations, then secondaries can stop copying entries from the oplog for up to 24 hours without becoming too stale to continue replicating. However, most replica sets have much lower operation volumes, and their oplogs can hold much higher numbers of operations.

在大多数情况下，默认的oplog大小就足够了。例如，如果一个oplog是空闲磁盘空间的5%，并且可容纳24小时的操作记录，那么从节点从oplog停止复制条目的时间可以长达24小时，并且不会因oplog条目变得太陈旧而无法继续复制。但是，大多数副本集的操作容量要小得多，它们的oplog可以容纳更多的操作。

Before [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) creates an oplog, you can specify its size with the [`oplogSizeMB`](https://docs.mongodb.com/manual/reference/configuration-options/#replication.oplogSizeMB) option. Once you have started a replica set member for the first time, use the [`replSetResizeOplog`](https://docs.mongodb.com/manual/reference/command/replSetResizeOplog/#dbcmd.replSetResizeOplog) administrative command to change the oplog size. [`replSetResizeOplog`](https://docs.mongodb.com/manual/reference/command/replSetResizeOplog/#dbcmd.replSetResizeOplog) enables you to resize the oplog dynamically without restarting the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) process.

在 [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 创建一个oplog前，您可以使用 [`oplogSizeMB`](https://docs.mongodb.com/manual/reference/configuration-options/#replication.oplogSizeMB) 选项来定义oplog的大小。一旦您第一次启动副本集成员后，可使用 [`replSetResizeOplog`](https://docs.mongodb.com/manual/reference/command/replSetResizeOplog/#dbcmd.replSetResizeOplog) 管理命令去改变oplog的大小。 [`replSetResizeOplog`](https://docs.mongodb.com/manual/reference/command/replSetResizeOplog/#dbcmd.replSetResizeOplog) 命令允许您动态调整oplog大小而无需重新启动 [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 进程。

| [[1\]](https://docs.mongodb.com/manual/core/replica-set-oplog/#id2) | Starting in MongoDB 4.0, the oplog can grow past its configured size limit to avoid deleting the [`majority commit point`](https://docs.mongodb.com/manual/reference/command/replSetGetStatus/#replSetGetStatus.optimes.lastCommittedOpTime). |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [[1\]](https://docs.mongodb.com/manual/core/replica-set-oplog/#id2) | 从MongoDB 4.0开始，oplog可以超过其配置的大小限制，来避免删除[大多数提交点](https://docs.mongodb.com/manual/reference/command/replSetGetStatus/#replSetGetStatus.optimes.lastCommittedOpTime)。 |

## Workloads that Might Require a Larger Oplog Size

## 可能需要更大Oplog大小的工作负载

If you can predict your replica set’s workload to resemble one of the following patterns, then you might want to create an oplog that is larger than the default. Conversely, if your application predominantly performs reads with a minimal amount of write operations, a smaller oplog may be sufficient.

如果您可以预测您的副本集的工作负载与以下模式之一相似，那么您可能希望创建一个比默认值更大的oplog。相反，如果您的应用程序主要执行读操作，而写操作很少，那么更小的oplog可能就足够了。

The following workloads might require a larger oplog size.

以下工作负载可能需要大容量的oplog。

### Updates to Multiple Documents at Once

### 一次更新多个文档

The oplog must translate multi-updates into individual operations in order to maintain [idempotency](https://docs.mongodb.com/manual/reference/glossary/#term-idempotent). This can use a great deal of oplog space without a corresponding increase in data size or disk use.

为了保持幂等性，oplog必须将多次更新转换为单个操作。这会使用大量的oplog空间，而不会相应增加数据大小或磁盘使用。

### Deletions Equal the Same Amount of Data as Inserts

### 删除与插入的数据量相等

If you delete roughly the same amount of data as you insert, the database will not grow significantly in disk use, but the size of the operation log can be quite large.

如果删除的数据量与插入的数据量大致相同，则数据库在磁盘使用方面不会显著增长，但操作日志的大小可能相当大。

### Significant Number of In-Place Updates

### 大量的就地更新

If a significant portion of the workload is updates that do not increase the size of the documents, the database records a large number of operations but does not change the quantity of data on disk.

如果工作负载中很大一部分是不增加文档大小的更新，那么数据库会记录大量操作，但不会更改磁盘上的数据量。

## Oplog Status

## Oplog状态

To view oplog status, including the size and the time range of operations, issue the [`rs.printReplicationInfo()`](https://docs.mongodb.com/manual/reference/method/rs.printReplicationInfo/#rs.printReplicationInfo) method. For more information on oplog status, see [Check the Size of the Oplog](https://docs.mongodb.com/manual/tutorial/troubleshoot-replica-sets/#replica-set-troubleshooting-check-oplog-size).

为了查看oplog的状态，包括oplog的大小和操作的时间范围，可使用[`rs.printReplicationInfo()`](https://docs.mongodb.com/manual/reference/method/rs.printReplicationInfo/#rs.printReplicationInfo) 方法。有关oplog状态的更多内容，请参见[检查Oplog大小](https://docs.mongodb.com/manual/tutorial/troubleshoot-replica-sets/#replica-set-troubleshooting-check-oplog-size)。

### Replication Lag and Flow Control

### 复制延迟和流控制

Under various exceptional situations, updates to a [secondary’s](https://docs.mongodb.com/manual/reference/glossary/#term-secondary) oplog might lag behind the desired performance time. Use [`db.getReplicationInfo()`](https://docs.mongodb.com/manual/reference/method/db.getReplicationInfo/#db.getReplicationInfo) from a secondary member and the [replication status](https://docs.mongodb.com/manual/reference/method/db.getReplicationInfo/) output to assess the current state of replication and determine if there is any unintended replication delay.

在各种异常情况下，对从节点oplog的更新可能会滞后于预期的性能时间。在从节点上使用 [`db.getReplicationInfo()`](https://docs.mongodb.com/manual/reference/method/db.getReplicationInfo/#db.getReplicationInfo)命令，以及根据复制状态输出结果来评估复制的当前状态，并确定是否存在任何意外的复制延迟。

Starting in MongoDB 4.2, administrators can limit the rate at which the primary applies its writes with the goal of keeping the [`majority committed`](https://docs.mongodb.com/manual/reference/command/replSetGetStatus/#replSetGetStatus.optimes.lastCommittedOpTime) lag under a configurable maximum value [`flowControlTargetLagSeconds`](https://docs.mongodb.com/manual/reference/parameters/#param.flowControlTargetLagSeconds).

从MongoDB 4.2开始，管理员可以限制主节点应用其写操作的速度，目的是将大多数提交延迟保持在可配置参数[`flowControlTargetLagSeconds`](https://docs.mongodb.com/manual/reference/parameters/#param.flowControlTargetLagSeconds)最大值之下。

By default, flow control is [`enabled`](https://docs.mongodb.com/manual/reference/parameters/#param.enableFlowControl).

默认情况下，流控制是启用的。

NOTE

For flow control to engage, the replica set/sharded cluster must have: [featureCompatibilityVersion (FCV)](https://docs.mongodb.com/manual/reference/command/setFeatureCompatibilityVersion/#view-fcv) of `4.2` and read concern [`majority enabled`](https://docs.mongodb.com/manual/reference/configuration-options/#replication.enableMajorityReadConcern). That is, enabled flow control has no effect if FCV is not `4.2` or if read concern majority is disabled.

See [Replication Lag](https://docs.mongodb.com/manual/tutorial/troubleshoot-replica-sets/#replica-set-replication-lag) for more information.

说明

为了进行流控制，副本集/分片集群必须满足：参数[featureCompatibilityVersion (FCV)](https://docs.mongodb.com/manual/reference/command/setFeatureCompatibilityVersion/#view-fcv) 设置为4.2，并启用majority读关注。也就是说，如果FCV不是4.2，或者读关注majority被禁用，那么启用流控制将不起作用。

更多信息请参见[流控制](https://docs.mongodb.com/manual/tutorial/troubleshoot-replica-sets/#flow-control)。

## Slow Oplog Application

## 慢Oplog应用程序

Starting in version 4.2 (also available starting in version 4.0.6), secondary members of a replica set now log oplog entries that take longer than the slow operation threshold to apply. These messages are [`logged`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-logpath) for the secondaries under the [`REPL`](https://docs.mongodb.com/manual/reference/log-messages/#REPL) component with the text `applied op: took ms`.

从4.2版本开始（从4.0.6开始也是可行的），副本集的副本成员会记录oplog中应用时间超过慢操作阈值的慢操作条目。这些慢oplog信息被记录在从节点[`REPL`](https://docs.mongodb.com/manual/reference/log-messages/#REPL) 组件的文本`applied op: took ms`中。

```
2018-11-16T12:31:35.886-0500 I REPL   [repl writer worker 13] applied op: command { ... }, took 112ms
```

The slow oplog application logging on secondaries are:

- Not affected by the [`slowOpSampleRate`](https://docs.mongodb.com/manual/reference/configuration-options/#operationProfiling.slowOpSampleRate); i.e. all slow oplog entries are logged by the secondary.
- Not affected by the [`logLevel`](https://docs.mongodb.com/manual/reference/parameters/#param.logLevel)/[`systemLog.verbosity`](https://docs.mongodb.com/manual/reference/configuration-options/#systemLog.verbosity) level (or the [`systemLog.component.replication.verbosity`](https://docs.mongodb.com/manual/reference/configuration-options/#systemLog.component.replication.verbosity) level); i.e. for oplog entries, the secondary logs only the slow oplog entries. Increasing the verbosity level does not log all oplog entries.
- Not captured by the [profiler](https://docs.mongodb.com/manual/tutorial/manage-the-database-profiler/) and not affected by the profiling level.

记录在从节点上的慢操作应用程序有：

- 不受 [`slowOpSampleRate`](https://docs.mongodb.com/manual/reference/configuration-options/#operationProfiling.slowOpSampleRate)的影响；例如，所有的慢oplog条目被记录在从节点上。
- 不受 [`logLevel`](https://docs.mongodb.com/manual/reference/parameters/#param.logLevel)/[`systemLog.verbosity`](https://docs.mongodb.com/manual/reference/configuration-options/#systemLog.verbosity) 级别的影响（或者[`systemLog.component.replication.verbosity`](https://docs.mongodb.com/manual/reference/configuration-options/#systemLog.component.replication.verbosity) 的级别）；例如，对于oplog条目，从节点仅记录慢oplog条目。增加日志的冗余级别不会导致记录所有的oplog条目。
- 不会被捕获器抓取到，并且不受捕获级别的影响。

For more information on setting the slow operation threshold, see

- [`mongod --slowms`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-slowms)
- [`slowOpThresholdMs`](https://docs.mongodb.com/manual/reference/configuration-options/#operationProfiling.slowOpThresholdMs)
- The [`profile`](https://docs.mongodb.com/manual/reference/command/profile/#dbcmd.profile) command or [`db.setProfilingLevel()`](https://docs.mongodb.com/manual/reference/method/db.setProfilingLevel/#db.setProfilingLevel) shell helper method.

更多有关慢操作阈值设置的信息，请参见：

- [`mongod --slowms`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-slowms)
- [`slowOpThresholdMs`](https://docs.mongodb.com/manual/reference/configuration-options/#operationProfiling.slowOpThresholdMs)
-  [`profile`](https://docs.mongodb.com/manual/reference/command/profile/#dbcmd.profile) 命令或者 [`db.setProfilingLevel()`](https://docs.mongodb.com/manual/reference/method/db.setProfilingLevel/#db.setProfilingLevel) shell帮助命令

## Oplog Collection Behavior

## Oplog集合的特性

If your MongoDB deployment uses the [WiredTiger Storage Engine](https://docs.mongodb.com/manual/core/wiredtiger/#storage-wiredtiger), you cannot [`drop`](https://docs.mongodb.com/manual/reference/command/drop/#dbcmd.drop) the `local.oplog.rs` collection from any replica set member. This restriction applies to both single-member and multi-member replica sets. Dropping the oplog can lead to data inconsistencies in the replica set if a node temporarily goes down and attempts to replay the oplog during the restart process.

如果你的MongoDB部署使用的是WiredTiger存储引擎，你无法从副本集任何成员中删除 `local.oplog.rs` 集合。这个限制适用于单成员和多成员的副本集。如果一个节点临时宕机并试图在重启过程中重新应用oplog，那么删除oplog可能会导致副本集中的数据不一致。





原文链接：https://docs.mongodb.com/manual/core/replica-set-oplog/

译者：李正洋
