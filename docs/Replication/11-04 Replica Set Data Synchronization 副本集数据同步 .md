# Replica Set Data Synchronization

# 副本集数据同步

On this page 本章

- [Initial Sync](https://docs.mongodb.com/manual/core/replica-set-sync/#initial-sync)初始化同步
- [Replication](https://docs.mongodb.com/manual/core/replica-set-sync/#replication)复制

In order to maintain up-to-date copies of the shared data set, secondary members of a replica set [sync](https://docs.mongodb.com/manual/reference/glossary/#term-sync) or replicate data from other members. MongoDB uses two forms of data synchronization: initial sync to populate new members with the full data set, and replication to apply ongoing changes to the entire data set.

为了维护共享数据集的最新副本，副本集中的从节点成员可以从其他成员同步或复制数据。MongoDB中有两种形式的数据同步：初始化同步将完整的数据集填充至新成员；而复制会持续将变更应用到整个数据集上。



## Initial Sync

## 初始化同步

Initial sync copies all the data from one member of the replica set to another member. See [Initial Sync Source Selection](https://docs.mongodb.com/manual/core/replica-set-sync/#replica-set-initial-sync-source-selection) for more information on initial sync source selection criteria.

初始化同步会从副本集成员中的一个节点复制所有的数据到另外一个成员。有关初始化同步源选择条件的更多信息请参见[初始化同步源选择](https://docs.mongodb.com/manual/core/replica-set-sync/#replica-set-initial-sync-source-selection)。

Starting in MongoDB 4.2.7, you can specify the preferred initial sync source using the [`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) parameter. This parameter can only be specified when starting the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod).

从MongoDB 4.2.7开始，你可以使用参数[`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) 指定优先的初始化同步源。这只能在启动[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)时配置。

### Process

### 过程

When you perform an initial sync, MongoDB:

1. Clones all databases except the [local](https://docs.mongodb.com/manual/reference/local-database/#replica-set-local-database) database. To clone, the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) scans every collection in each source database and inserts all data into its own copies of these collections.

   *Changed in version 3.4:* Initial sync builds all collection indexes as the documents are copied for each collection. In earlier versions of MongoDB, only the `_id` indexes are built during this stage.

   *Changed in version 3.4:* Initial sync pulls newly added oplog records during the data copy. Ensure that the target member has enough disk space in the `local` database to temporarily store these oplog records for the duration of this data copy stage.

2. Applies all changes to the data set. Using the oplog from the source, the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) updates its data set to reflect the current state of the replica set.

   When the initial sync finishes, the member transitions from [`STARTUP2`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.STARTUP2) to [`SECONDARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.SECONDARY).

To perform an initial sync, see [Resync a Member of a Replica Set](https://docs.mongodb.com/manual/tutorial/resync-replica-set-member/).

当执行一个初始化同步时，MongoDB会：

1. 克隆除[local](https://docs.mongodb.com/manual/reference/local-database/#replica-set-local-database)数据库之外的所有数据库。为了进行克隆，[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 扫描每个源数据库中的各个集合，并将所有数据插入到这些集合各自的副本中。

   3.4版本的变化：初始化同步在为每个集合复制文档时会建立集合的所有索引。在MongoDB的早期版本中，在这个阶段只建立_id索引。

   3.4版本的变化：初始化同步会获取在数据复制期间新增的oplog记录。请确保目标成员的local 数据库中有足够的磁盘空间，以便可以在数据复制阶段期间内临时存储这些oplog记录。

2. 对数据集应用所有的更改。使用来自源库的oplog，[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 更新其数据集以反映副本集的当前状态。当初始化同步完成后，目标成员会从 [`STARTUP2`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.STARTUP2)状态转为[`SECONDARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.SECONDARY)状态。

若要执行初始化同步，请参见[重新同步副本集成员](https://docs.mongodb.com/manual/tutorial/resync-replica-set-member/)。



### Fault Tolerance

### 容错

To recover from transient network or operation failures, initial sync has built-in retry logic.

*Changed in version 3.4:* MongoDB 3.4 improves the initial sync retry logic to be more resilient to intermittent failures on the network.

为了从短暂网络或操作故障中恢复，初始化同步具有内置的重试逻辑。

版本3.4的变化：MongoDB 3.4改进了初始化同步的重试逻辑，对网络上的间歇性故障更有弹性。

### Initial Sync Source Selection

#### 初始化同步源的选择

Initial sync source selection depends on the value of the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) startup parameter [`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) (*new in 4.2.7*):

- For [`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) set to [`primary`](https://docs.mongodb.com/manual/core/read-preference/#primary) (default if [`chaining`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.settings.chainingAllowed) is disabled), select the [primary](https://docs.mongodb.com/manual/reference/glossary/#term-primary) as the sync source. If the primary is unavailable or unreachable, log an error and periodically check for primary availability.
- For [`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) set to [`primaryPreferred`](https://docs.mongodb.com/manual/core/read-preference/#primaryPreferred), attempt to select the [primary](https://docs.mongodb.com/manual/reference/glossary/#term-primary) as the sync source. If the primary is unavailable or unreachable, perform sync source selection from the remaining replica set members.
- For [`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) set to [`nearest`](https://docs.mongodb.com/manual/core/read-preference/#nearest) (default if `chaining` is enabled), perform sync source selection from the replica set members.
- For all remaining supported read preference modes, perform sync source selection from the replica set members.

初始化同步源的选择取决于[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 的启动参数[`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) （版本4.2.7中的新参数）：

- 若参数[`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) 设置为 [`primary`](https://docs.mongodb.com/manual/core/read-preference/#primary) （禁用级联后的默认值），则选择主节点作为同步源。如果主服务器不可用或无法访问，则记录错误并定期检查主服务器的可用性。
- 若参数[`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) 设置为[`primaryPreferred`](https://docs.mongodb.com/manual/core/read-preference/#primaryPreferred)，则优先尝试选择主节点作为同步源。如果主节点不可用或者无法访问，则将从剩余可用的副本集成员中选择同步源。
- 若参数[`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) 设置为[`nearest`](https://docs.mongodb.com/manual/core/read-preference/#nearest) （启用级联后的默认值），则从副本集成员中选择网络时延最小的节点最为同步源。
- 对于所有其他受支持的读偏好类型，则将从这些副本集成员中选择同步源。



Members performing initial sync source selection make two passes through the list of all replica set members:

执行初始化同步源选择的成员将会遍历所有副本集成员的列表两次：

**Sync Source Selection (First Pass)**

**同步源选择（第一次遍历）**

The member applies the following criteria to each replica set member when making the first pass for selecting a initial sync source:

- The sync source *must* be in the [`PRIMARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.PRIMARY) or [`SECONDARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.SECONDARY) replication state.
- The sync source *must* be online and reachable.
- If [`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) is [`secondary`](https://docs.mongodb.com/manual/core/read-preference/#secondary) or [`secondaryPreferred`](https://docs.mongodb.com/manual/core/read-preference/#secondaryPreferred), the sync source *must* be a [secondary](https://docs.mongodb.com/manual/reference/glossary/#term-secondary).
- The sync source *must* be [`visible`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].hidden).
- The sync source *must* be within `30` seconds of the newest oplog entry on the primary.
- If the member [`builds indexes`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].buildIndexes), the sync source *must* build indexes.
- If the member [`votes`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].votes) in replica set elections, the sync source *must* also vote.
- If the member is *not* a [`delayed member`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].slaveDelay), the sync source *must not* be delayed.
- If the member *is* a [`delayed member`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].slaveDelay), the sync source must have a shorter configured delay.
- The sync source *must* be faster (i.e. lower latency) than the current best sync source.

当选择初始同步源进行第一次遍历时，执行同步源选择的成员将检查每个副本集成员是否满足如下条件：

- 同步源必须处于 [`PRIMARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.PRIMARY) 或者 [`SECONDARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.SECONDARY) 的复制状态。
- 同步源必须是在线且可访问的。
- 如果参数 [`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) 设置为 [`secondary`](https://docs.mongodb.com/manual/core/read-preference/#secondary) 或者 [`secondaryPreferred`](https://docs.mongodb.com/manual/core/read-preference/#secondaryPreferred)，则同步源必须是一个从节点。
- 同步源必须和主节点最新的oplog条目同步时间相差在30s之内。
- 如果该成员是可创建索引的，则同步源也必须可创建索引。
- 如果该成员可参与副本集选举投票，则同步源也必须具有投票权。
- 如果该成员不是一个延迟成员，则同步源也不能是延迟成员。
- 如果该成员是一个延迟成员，则同步源必须配置一个更短的延迟时间。
- 同步源必须比当前最好的同步源更快(即更低的时延)。

If no candidate sync sources remain after the first pass, the member performs a second pass with relaxed criteria. See **Sync Source Selection (Second Pass)**.

如果第一次遍历没有产生候选的同步源，则该成员会用更宽松的条件进行第二次遍历。请参考**同步源选择（第二次遍历）**。

**Sync Source Selection (Second Pass)**

**同步源选择（第二次遍历）**

The member applies the following criteria to each replica set member when making the second pass for selecting a initial sync source:

- The sync source *must* be in the [`PRIMARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.PRIMARY) or [`SECONDARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.SECONDARY) replication state.
- The sync source *must* be online and reachable.
- If [`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) is [`secondary`](https://docs.mongodb.com/manual/core/read-preference/#secondary), the sync source *must* be a [secondary](https://docs.mongodb.com/manual/reference/glossary/#term-secondary).
- If the member [`builds indexes`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].buildIndexes), the sync source must build indexes.
- The sync source *must* be faster (i.e. lower latency) than the current best sync source.

当选择初始同步源进行第二次遍历时，执行同步源选择的成员将检查每个副本集成员是否满足如下条件：

- 同步源必须处于 [`PRIMARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.PRIMARY) 或者 [`SECONDARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.SECONDARY) 的复制状态。
- 同步源必须是在线且可访问的。
- 如果参数 [`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) 设置为 [`secondary`](https://docs.mongodb.com/manual/core/read-preference/#secondary) ，则同步源必须是一个从节点。
- 如果该成员是可创建索引的，则同步源也必须可创建索引。
- 同步源必须比当前最好的同步源更快(即更低的时延)。

If the member cannot select an initial sync source after two passes, it logs an error and waits `1` second before restarting the selection process. The secondary [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) can restart the initial sync source selection process up to `10` times before exiting with an error.

如果该成员在两次遍历后依然无法选择出初始同步源，它会记录报错并在等待1s后重新发起选择的过程。从节点的Mongod进程在出现报错退出之前，最多会重试10次初始同步源选择的过程。





## Replication

## 复制

Secondary members replicate data continuously after the initial sync. Secondary members copy the [oplog](https://docs.mongodb.com/manual/core/replica-set-oplog/) from their *sync from* source and apply these operations in an asynchronous process. [[1\]](https://docs.mongodb.com/manual/core/replica-set-sync/#slow-oplogs)

从节点成员在初始化同步之后会不断地复制数据。从节点成员从同步源复制[oplog](https://docs.mongodb.com/manual/core/replica-set-oplog/) ，并以异步的方式应用这些操作 [[1\]](https://docs.mongodb.com/manual/core/replica-set-sync/#slow-oplogs)。

Secondaries may automatically change their *sync from* source as needed based on changes in the ping time and state of other members’ replication.

从节点可以根据ping时间和其他成员复制状态的变化，按需来自动调整它们的同步源。

*Changed in version 3.2:* MongoDB 3.2 replica set members with [`1 vote`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].votes) cannot sync from members with [`0 votes`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].votes).

3.2版本的变化：MongoDB 3.2中投票权为1的副本集成员无法从投票权为0的成员那里同步数据。

Secondaries avoid syncing from [delayed members](https://docs.mongodb.com/manual/core/replica-set-delayed-member/#replica-set-delayed-members) and [hidden members](https://docs.mongodb.com/manual/core/replica-set-hidden-member/#replica-set-hidden-members).

从节点应避免从[延迟成员](https://docs.mongodb.com/manual/core/replica-set-delayed-member/#replica-set-delayed-members)和[隐藏成员](https://docs.mongodb.com/manual/core/replica-set-hidden-member/#replica-set-hidden-members)中同步数据。

If a secondary member has [`members[n].buildIndexes`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].buildIndexes) set to `true`, it can only sync from other members where [`buildIndexes`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].buildIndexes) is `true`. Members where [`buildIndexes`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].buildIndexes) is `false` can sync from any other member, barring other sync restrictions. [`buildIndexes`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].buildIndexes) is `true` by default.

如果一个从节点成员的参数[`members[n].buildIndexes`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].buildIndexes) 设置为true，它只能从其他参数[buildIndexes](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].buildIndexes)设置为true的成员同步数据。参数[buildIndexes](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].buildIndexes)设置为false的成员可以从任何其他节点同步数据，除非有其他的同步限制。参数[buildIndexes](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].buildIndexes)默认为true。



| [[1\]](https://docs.mongodb.com/manual/core/replica-set-sync/#id1) | Starting in version 4.2 (also available starting in 4.0.6), secondary members of a replica set now [log oplog entries](https://docs.mongodb.com/manual/release-notes/4.2/#slow-oplog) that take longer than the slow operation threshold to apply. These slow oplog messages are logged for the secondaries in the [`diagnostic log`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-logpath) under the [`REPL`](https://docs.mongodb.com/manual/reference/log-messages/#REPL) component with the text `applied op: took ms`. These slow oplog entries depend only on the slow operation threshold. They do not depend on the log levels (either at the system or component level), or the profiling level, or the slow operation sample rate. The profiler does not capture slow oplog entries. |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [[1\]](https://docs.mongodb.com/manual/core/replica-set-sync/#id1) | 从4.2版本开始（从4.0.6开始也是可行的），副本集的副本成员会记录oplog中应用时间超过慢操作阈值的慢操作条目。这些慢oplog信息被记录在从节点的诊断日志中，其路径位于REPL 组件的文本`applied op: took ms`中。这些慢日志条目仅仅依赖于慢操作阈值。它们不依赖于日志级别（无论是系统还是组件级别）、过滤级别，或者慢操作采样比例。过滤器不会捕获慢日志条目。 |



### Multithreaded Replication

### 多线程复制

MongoDB applies write operations in batches using multiple threads to improve concurrency. MongoDB groups batches by document id ([WiredTiger](https://docs.mongodb.com/manual/core/wiredtiger/#storage-wiredtiger)) and simultaneously applies each group of operations using a different thread. MongoDB always applies write operations to a given document in their original write order.

MongoDB通过使用多线程批量应用写操作来提高并发。MongoDB根据文档id （[WiredTiger](https://docs.mongodb.com/manual/core/wiredtiger/#storage-wiredtiger)）进行分批，同时使用不同的线程应用每组操作。MongoDB总是按照原始的写顺序对给定的文档应用写操作。

*Changed in version 4.0.*

Starting in MongoDB 4.0, read operations that [target secondaries](https://docs.mongodb.com/manual/core/read-preference/#replica-set-read-preference) and are configured with a [read concern](https://docs.mongodb.com/manual/reference/read-concern/#read-concern) level of [`"local"`](https://docs.mongodb.com/manual/reference/read-concern-local/#readconcern."local") or [`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority") will now read from a [WiredTiger](https://docs.mongodb.com/manual/core/wiredtiger/#storage-wiredtiger) snapshot of the data if the read takes place on a secondary where replication batches are being applied. Reading from a snapshot guarantees a consistent view of the data, and allows the read to occur simultaneously with the ongoing replication without the need for a lock. As a result, secondary reads requiring these read concern levels no longer need to wait for replication batches to be applied, and can be handled as they are received.

*4.0版本的变化。*

从MongoDB 4.0开始，如果读取发生在正在应用批量复制的从节点上，那么针对从节点且读关注级别设置为“local”或“majority”的读取操作，现在将从WiredTiger数据快照中读取数据。从快照中读取数据可以保证数据的一致性视图，并且允许在进行复制的同时进行读取，而不需要使用锁。因此，这些读关注级别的从节点读取操作不再需要等待批量复制应用完成，并且可以在接收它们的同时进行处理。

### Flow Control

### 流控制

Starting in MongoDB 4.2, administrators can limit the rate at which the primary applies its writes with the goal of keeping the [`majority committed`](https://docs.mongodb.com/manual/reference/command/replSetGetStatus/#replSetGetStatus.optimes.lastCommittedOpTime) lag under a configurable maximum value [`flowControlTargetLagSeconds`](https://docs.mongodb.com/manual/reference/parameters/#param.flowControlTargetLagSeconds).

从MongoDB 4.2开始，管理员可以限制主节点应用其写操作的速度，目的是将大多数提交延迟保持在可配置参数[`flowControlTargetLagSeconds`](https://docs.mongodb.com/manual/reference/parameters/#param.flowControlTargetLagSeconds)最大值之下。

By default, flow control is [`enabled`](https://docs.mongodb.com/manual/reference/parameters/#param.enableFlowControl).

默认情况下，流控制是启用的。

NOTE

For flow control to engage, the replica set/sharded cluster must have: [featureCompatibilityVersion (FCV)](https://docs.mongodb.com/manual/reference/command/setFeatureCompatibilityVersion/#view-fcv) of `4.2` and read concern [`majority enabled`](https://docs.mongodb.com/manual/reference/configuration-options/#replication.enableMajorityReadConcern). That is, enabled flow control has no effect if FCV is not `4.2` or if read concern majority is disabled.

For more information, see [Flow Control](https://docs.mongodb.com/manual/tutorial/troubleshoot-replica-sets/#flow-control).

说明

为了进行流控制，副本集/分片集群必须满足：参数[featureCompatibilityVersion (FCV)](https://docs.mongodb.com/manual/reference/command/setFeatureCompatibilityVersion/#view-fcv) 设置为4.2，并启用majority级别的读关注。也就是说，如果FCV不是4.2，或者读关注majority被禁用，那么流控制的启用将不会生效。

更多信息请参见[流控制](https://docs.mongodb.com/manual/tutorial/troubleshoot-replica-sets/#flow-control)。



### Replication Sync Source Selection

### 复制同步源的选择

Replication sync source selection depends on the replica set [`chaining`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.settings.chainingAllowed) setting:

- With chaining enabled (default), perform sync source selection from the replica set members.
- With chaining disabled, select the [primary](https://docs.mongodb.com/manual/reference/glossary/#term-primary) as the sync source. If the primary is unavailable or unreachable, log an error and periodically check for primary availability.

复制同步源的选择取决于副本集参数[`chaining`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.settings.chainingAllowed) 的设置：

- 启用级联(默认)后，从副本集成员间执行同步源选择。
- 禁用级联后，选择主节点作为复制源。如果主服务器不可用或无法访问，则记录错误并定期检查主服务器的可用性。

Members performing replication sync source selection make two passes through the list of all replica set members:

执行复制同步源选择的成员将会遍历所有副本集成员的列表两次：

**Sync Source Selection (First Pass)**

**同步源选择（第一次）**

The member applies the following criteria to each replica set member when making the first pass for selecting a replication sync source:

- The sync source *must* be in the [`PRIMARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.PRIMARY) or [`SECONDARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.SECONDARY) replication state.
- The sync source *must* be online and reachable.
- The sync source *must* have newer oplog entries than the member (i.e. the sync source is *ahead* of the member).
- The sync source *must* be [`visible`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].hidden).
- The sync source *must* be within `30` seconds of the newest oplog entry on the primary.
- If the member [`builds indexes`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].buildIndexes), the sync source *must* build indexes.
- If the member [`votes`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].votes) in replica set elections, the sync source *must* also vote.
- If the member is *not* a [`delayed member`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].slaveDelay), the sync source *must not* be delayed.
- If the member *is* a [`delayed member`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].slaveDelay), the sync source must have a shorter configured delay.
- The sync source *must* be faster (i.e. lower latency) than the current best sync source.

当为选择复制同步源进行第一次遍历时，执行同步源选择的成员将检查每个副本集成员是否满足如下条件：

- 同步源必须处于 [`PRIMARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.PRIMARY) 或者 [`SECONDARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.SECONDARY) 的复制状态。
- 同步源必须是在线且可访问的。
- 同步源必须比该成员具有更新的oplog条目（即同步源数据同步领先于该成员）。
- 同步源必须是[可见的](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].hidden)。
- 同步源必须和主节点最新的oplog条目同步时间相差在30s之内。
- 如果该成员是可创建索引的，则同步源也必须可创建索引。
- 如果该成员可参与副本集选举投票，则同步源也必须具有投票权。
- 如果该成员不是一个延迟成员，则同步源也不能是延迟成员。
- 如果该成员是一个延迟成员，则同步源必须配置一个更短的延迟时间。
- 同步源必须比当前最好的同步源更快(即更低的时延)。

If no candidate sync sources remain after the first pass, the member performs a second pass with relaxed criteria. See the **Sync Source Selection (Second Pass)**.

如果第一次遍历没有产生候选的同步源，则该成员会用更宽松的条件进行第二次遍历。请参考**同步源选择（第二次遍历）**。

**Sync Source Selection (Second Pass)**

**同步源选择（第二次遍历）**

The member applies the following criteria to each replica set member when making the second pass for selecting a replication sync source:

- The sync source *must* be in the [`PRIMARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.PRIMARY) or [`SECONDARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.SECONDARY) replication state.
- The sync source *must* be online and reachable.
- If the member [`builds indexes`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.members[n].buildIndexes), the sync source must build indexes.
- The sync source *must* be faster (i.e. lower latency) than the current best sync source.

当为选择复制同步源进行第二次遍历时，执行同步源选择的成员将检查每个副本集成员是否满足如下条件：

- 同步源必须处于 [`PRIMARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.PRIMARY) 或者 [`SECONDARY`](https://docs.mongodb.com/manual/reference/replica-states/#replstate.SECONDARY) 的复制状态。
- 同步源必须是在线且可访问的。
- 如果该成员是可创建索引的，则同步源也必须可创建索引。
- 同步源必须比当前最好的同步源更快(即更低的时延)。

If the member cannot select a sync source after two passes, it logs an error and waits `1` second before restarting the selection process.

如果该成员在两次遍历后依然无法选择出初始同步源，它会记录报错并在等待1s后重新发起选择的过程。

NOTE说明

Starting in MongoDB 4.2.7, the startup parameter [`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) takes precedence over the replica set’s [`settings.chainingAllowed`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.settings.chainingAllowed) setting when selecting an initial sync source. After a replica set member successfully performs initial sync, it defers to the value of [`chainingAllowed`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.settings.chainingAllowed) when selecting a replication sync source.

从MongoDB 4.2.7开始，当选择一个初始化同步源时，启动参数 [`initialSyncSourceReadPreference`](https://docs.mongodb.com/manual/reference/parameters/#param.initialSyncSourceReadPreference) 是优先级高于副本集参数 [`settings.chainingAllowed`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.settings.chainingAllowed)。在副本集成员成功执行初始化同步之后，选择复制同步源时则取决于参数 [`chainingAllowed`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.settings.chainingAllowed)的值。

See [Initial Sync Source Selection](https://docs.mongodb.com/manual/core/replica-set-sync/#replica-set-initial-sync-source-selection) for more information on initial sync source selection.

有关初始化同步源的选择的更多信息请参考[初始化同步源的选择](https://docs.mongodb.com/manual/core/replica-set-sync/#replica-set-initial-sync-source-selection) 。



原文链接：https://docs.mongodb.com/manual/core/replica-set-sync/

译者：李正洋
