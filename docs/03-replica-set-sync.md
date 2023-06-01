# 副本集数据同步[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-sync/#replica-set-data-synchronization)

为了维护共享数据集的最新副本，副本集的从节点[同步](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sync)或从其他节点复制数据。MongoDB 使用两种形式的数据同步：初始同步用完整数据集填充新节点，复制将持续更改应用到整个数据集。



## 初始同步[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-sync/#initial-sync)

初始同步将所有数据从副本集的一个节点复制到另一个节点。看[初始同步源选择](https://www.mongodb.com/docs/manual/core/replica-set-sync/#std-label-replica-set-initial-sync-source-selection)有关初始同步源选择标准的更多信息。

从 MongoDB 4.4 开始，您可以使用[`initialSyncSourceReadPreference`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.initialSyncSourceReadPreference)参数指定首选的初始同步源。该参数只能在启动时指定 [`mongod`。](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

从 MongoDB 5.2 开始，初始同步可以是*逻辑*的或*基于文件副本的*。



### 逻辑初始同步过程[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-sync/#logical-initial-sync-process)

当您执行逻辑初始同步时，MongoDB：

1. 克隆除[本地](https://www.mongodb.com/docs/manual/reference/local-database/#std-label-replica-set-local-database)数据库之外的所有数据库。为了克隆， [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)扫描每个源数据库中的每个集合并将所有数据插入到这些集合的它自己的副本中。
2. 在为每个集合复制文档时构建所有集合索引。
3. 在数据复制期间拉取新添加的 oplog 记录。确保目标节点在`local`数据库中有足够的磁盘空间来临时存储这些 oplog 记录在此数据复制阶段的持续时间。
4. 将所有更改应用于数据集。使用来自源的操作日志，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)更新其数据集以反映副本集的当前状态。

当初始同步完成时，成员从 过渡 [`STARTUP2`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.STARTUP2)到[`SECONDARY`。](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)

要执行初始同步，请参阅 [重新同步副本集的成员。](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/)



### 基于文件复制的初始同步[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-sync/#file-copy-based-initial-sync)

*仅在 MongoDB Enterprise 中可用。*

基于文件复制的初始同步通过在文件系统上复制和移动文件来运行初始同步过程。这种同步方法可以比 [逻辑初始同步。](https://www.mongodb.com/docs/manual/core/replica-set-sync/#std-label-replica-set-initial-sync-logical)



## IMPORTANT

### 基于文件副本的初始同步可能会导致计数不准确

基于文件副本的初始同步完成后，如果您在 [`count()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.count/#mongodb-method-db.collection.count)没有查询谓词的情况下运行该方法，则返回的文档计数可能不准确。

没有查询谓词的`count`方法如下所示： `db.<collection>.count()`。

要了解更多信息，请参阅[没有查询谓词的不准确计数。](https://www.mongodb.com/docs/manual/reference/method/db.collection.count/#std-label-count-method-behavior-query-predicate)

#### 启用基于文件复制的初始同步[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-sync/#enable-file-copy-based-initial-sync)

要启用基于文件复制的初始同步，请将 [`initialSyncMethod`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.initialSyncMethod)参数设置`fileCopyBased`为初始同步的目标节点。该参数只能在启动时设置。

#### 行为[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-sync/#behavior)

基于文件副本的初始同步将`local`正在同步的节点上的数据库替换为正在*同步的*节点的`local`数据库。

#### 限制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-sync/#limitations)

- 在基于文件复制的初始同步期间：
  - 您不能对*同步到*的节点或*同步自*的节点运行备份。
  - 您不能写入`local`正在*同步到*的节点上的数据库。
- 您一次只能从一个给定的节点运行初始同步。
- 使用加密存储引擎时，MongoDB 使用源密钥加密目标。



### 容错[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-sync/#fault-tolerance)

如果执行初始同步的从节点在同步过程中遇到*非暂时性* （即持久性）网络错误，则从节点从头开始重新启动初始同步过程。

*从 MongoDB 4.4 开始，如果被瞬态*（即临时）网络错误、集合删除或集合重命名中断，则执行初始同步的从节点可以尝试恢复同步过程。同步源还必须运行 MongoDB 4.4 以支持可恢复的初始同步。如果同步源运行 MongoDB 4.2 或更早版本，从节点必须重新启动初始同步过程，就好像它遇到了非暂时性网络错误一样。

默认情况下，从节点尝试恢复初始同步 24 小时。MongoDB 4.4 添加了 [`initialSyncTransientErrorRetryPeriodSeconds`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.initialSyncTransientErrorRetryPeriodSeconds)服务器参数，用于控制从节点尝试恢复初始同步的时间量。如果从节点在配置的时间段内无法成功恢复初始同步过程，它会从副本集中选择一个新的健康源并从头开始重新启动初始同步过程。

`10`次要尝试在返回致命错误之前多次重新启动初始同步。



### 初始同步源选择[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-sync/#initial-sync-source-selection)

初始同步源选择取决于 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)启动参数 的值[`initialSyncSourceReadPreference`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.initialSyncSourceReadPreference)（*4.4 新增*）：

- 对于[`initialSyncSourceReadPreference`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.initialSyncSourceReadPreference)设置为 [`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)（默认情况下[`chaining`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.chainingAllowed)禁用），选择[主要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary) 作为同步源。如果主节点不可用或无法访问，请记录错误并定期检查主节点的可用性。
- 对于[`initialSyncSourceReadPreference`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.initialSyncSourceReadPreference)设置为 [`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred)（投票副本集节点的默认值），尝试选择[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)作为同步源。如果主节点不可用或无法访问，则从剩余的副本集节点中执行同步源选择。
- 对于所有其他支持的读取模式，从副本集节点执行同步源选择。

执行初始同步源选择的节点通过所有副本集节点的列表进行两次传递：



在选择初始同步源的第一遍时，节点将以下条件应用于每个副本集节点：

- 同步源*必须*处于[`PRIMARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.PRIMARY)或 [`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)复制状态。
- 同步源*必须*在线且可访问。
- 如果[`initialSyncSourceReadPreference`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.initialSyncSourceReadPreference)是 [`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)或[`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred)，则同步源*必须*是[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)
- 同步源*必须*是[`visible`.](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.hidden)
- 同步源*必须*在`30`主节点上最新的 oplog 条目的几秒钟内。
- 如果是节点[`builds indexes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.buildIndexes)，则同步源*必须* 建立索引。
- 如果节点[`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)在副本集选举中，同步源也*必须*投票。
- 如果节点*不是*[`delayed member`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.secondaryDelaySecs)则同步源*不得*延迟。
- 如果节点*是*[`delayed member`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.secondaryDelaySecs)则同步源必须具有较短的配置延迟。
- 同步源*必须*比当前最佳同步源更快（即延迟更低）。

如果在第一遍之后没有候选同步源剩余，则该节点执行具有宽松标准的第二遍。请参阅**同步源选择（第二遍）**。

如果节点在两次通过后无法选择初始同步源，它会记录一个错误并等待`1`第二次，然后重新启动选择过程。从节点可以在出现错误退出之前多次[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)重新启动初始同步源选择过程。`10`



在进行第二遍选择初始同步源时，成员将以下条件应用于每个副本集节点：

- 同步源*必须*处于 [`PRIMARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.PRIMARY)或[`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)复制状态。
- 同步源*必须*在线且可访问。
- 如果[`initialSyncSourceReadPreference`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.initialSyncSourceReadPreference)是 [`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)，则同步源*必须*是 [从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)
- 如果节点[`builds indexes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.buildIndexes)，则同步源必须建立索引。
- 同步源*必须*比当前最佳同步源更快（即延迟更低）。

如果节点在两次通过后无法选择初始同步源，它会记录一个错误并等待`1`第二次，然后重新启动选择过程。从节点可以在出现错误退出之前多次[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)重新启动初始同步源选择过程。`10`

## 复制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-sync/#replication)

从节点在初始同步后连续复制数据。从节点从源同步中复制操作[日志](https://www.mongodb.com/docs/manual/core/replica-set-oplog/)，并在异步过程中应用这些操作。

根据 ping 时间和其他节点复制状态的变化，从节点可以根据需要自动更改*与源的同步。*看[复制同步源选择](https://www.mongodb.com/docs/manual/core/replica-set-sync/#std-label-replica-set-replication-sync-source-selection) 有关同步源选择标准的更多信息。

| [ [1](https://www.mongodb.com/docs/manual/core/replica-set-sync/#ref-slow-oplogs-id1) ] | 从 4.2 版开始，副本集的从节点现在会[记录比慢速操作阈值应用时间更长的 oplog 条目](https://www.mongodb.com/docs/manual/core/replica-set-oplog/#std-label-slow-oplog-application)。这些缓慢的 oplog 消息：记录在 [`diagnostic log`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--logpath)记录在[`REPL`](https://www.mongodb.com/docs/manual/reference/log-messages/#mongodb-data-REPL)带有文本的组件 下`applied op: <oplog entry> took <num>ms`。不依赖于日志级别（无论是在系统级别还是组件级别）不要依赖于分析级别。可能受 影响[`slowOpSampleRate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate)，具体取决于您的 MongoDB 版本：在 MongoDB 4.2 中，这些慢速 oplog 条目不受[`slowOpSampleRate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate). 无论采样率如何，MongoDB 都会记录所有慢速 oplog 条目。在 MongoDB 4.4 及更高版本中，这些慢速 oplog 条目受[`slowOpSampleRate`.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate)探查器不会捕获慢速 oplog 条目。 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |



### 流复制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-sync/#streaming-replication)

从 MongoDB 4.4 开始，*来自*源的同步将连续的[oplog](https://www.mongodb.com/docs/manual/core/replica-set-oplog/)条目流发送到它们的同步从节点。流式复制减轻了高负载和高延迟网络中的复制滞后。它也是：

- 减少从从节点读取的陈旧性。
- 降低了由于主节点故障转移而丢失[w:1的写操作的风险。](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-w)
- [使用w: >1](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-w)减少写操作的延迟[`w: "majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)（即任何需要等待复制的写关注）。

在 MongoDB 4.4 之前，从节点通过*从源向其同步*发出请求并等待响应来获取成批的[oplog条目。](https://www.mongodb.com/docs/manual/core/replica-set-oplog/)这需要为每批[oplog](https://www.mongodb.com/docs/manual/core/replica-set-oplog/)条目进行一次网络往返。MongoDB 4.4 添加了用于禁用流复制和使用旧复制行为的启动参数。*如果从源同步*有任何资源限制，或者如果您希望限制 MongoDB 对网络带宽的使用以进行复制，则将参数设置为 only。[`oplogFetcherUsesExhaust`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.oplogFetcherUsesExhaust)[`oplogFetcherUsesExhaust`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.oplogFetcherUsesExhaust)`false`



### 多线程复制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-sync/#multithreaded-replication)

MongoDB 使用多线程批量应用写入操作以提高并发性。MongoDB 按文档 ID ( [WiredTiger](https://www.mongodb.com/docs/manual/core/wiredtiger/#std-label-storage-wiredtiger) ) 对批次进行分组，并使用不同的线程同时应用每组操作。MongoDB 始终按照原始写入顺序将写入操作应用于给定文档。

如果读取发生在应用复制批处理的从节点上，则以辅助节点为[目标](https://www.mongodb.com/docs/manual/core/read-preference/#std-label-replica-set-read-preference)并配置[读取关注](https://www.mongodb.com/docs/manual/reference/read-concern/#std-label-read-concern)级别 [`"local"`](https://www.mongodb.com/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-)或 [`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)从数据的[WiredTiger快照读取的读取操作。](https://www.mongodb.com/docs/manual/core/wiredtiger/#std-label-storage-wiredtiger)

从快照读取保证了数据的一致视图，并允许读取与正在进行的复制同时发生而无需锁定。因此，需要这些读取关注级别的辅助读取不再需要等待应用复制批次，并且可以在收到它们时进行处理。

### 流量控制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-sync/#flow-control)

从 MongoDB 4.2 开始，管理员可以限制主数据库应用其写入的速率，目的是将[`majority committed`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.optimes.lastCommittedOpTime)延迟保持在可配置的最大值以下[`flowControlTargetLagSeconds`。](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.flowControlTargetLagSeconds)

默认情况下，流量控制是[`enabled`.](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.enableFlowControl)

>## 笔记
>
>为了进行流量控制，副本集/分片集群必须具有：[featureCompatibilityVersion (FCV)](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)和 `4.2`read concern [`majority enabled`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.enableMajorityReadConcern)。`4.2`也就是说，如果 FCV 不是，或者如果读取关注多数被禁用，则启用的流量控制无效。
>
>有关详细信息，请参阅[流量控制。](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#std-label-flow-control)



### 复制同步源选择[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-sync/#replication-sync-source-selection)

复制同步源选择取决于副本集 [`chaining`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.chainingAllowed)设置：

- 启用链接（默认），从副本集节点执行同步源选择。
- 在禁用链接的情况下，选择[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)作为同步源。如果主服务器不可用或无法访问，请记录错误并定期检查主服务器的可用性。

执行复制同步源选择的成员通过所有副本集成员的列表进行两次传递：

**第一遍：**

在选择初始同步源的第一遍时，节点将以下条件应用于每个副本集节点：

- 同步源*必须*处于[`PRIMARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.PRIMARY)或 [`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)复制状态。
- 同步源*必须*在线且可访问。
- 如果[`initialSyncSourceReadPreference`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.initialSyncSourceReadPreference)是 [`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)或[`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred)，则同步源*必须*是[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)
- 同步源*必须*是[`visible`.](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.hidden)
- 同步源*必须*在`30`主节点上最新的 oplog 条目的几秒钟内。
  - 如果是节点[`builds indexes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.buildIndexes)，则同步源*必须* 建立索引。

- 如果节点[`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)在副本集选举中，同步源也*必须*投票。
- 如果节点*不是*，[`delayed member`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.secondaryDelaySecs)则同步源*不得*延迟。
- 如果节点*是*，[`delayed member`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.secondaryDelaySecs)则同步源必须具有较短的配置延迟。
- 同步源*必须*比当前最佳同步源更快（即延迟更低）。

如果在第一遍之后没有候选同步源剩余，则该节点执行具有宽松标准的第二遍。请参阅**同步源选择（第二遍）**。

如果节点在两次通过后无法选择初始同步源，它会记录一个错误并等待`1`第二次，然后重新启动选择过程。从节点可以在出现错误退出之前多次[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)重新启动初始同步源选择过程。`10`

**第二关**

在进行第二遍选择初始同步源时，节点将以下条件应用于每个副本集节点：

- 同步源*必须*处于 [`PRIMARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.PRIMARY)或[`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)复制状态。
- 同步源*必须*在线且可访问。
- 如果[`initialSyncSourceReadPreference`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.initialSyncSourceReadPreference)是 [`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)，则同步源*必须*是 [次要的。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)
- 如果是成员[`builds indexes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.buildIndexes)，则同步源必须建立索引。
- 同步源*必须*比当前最佳同步源更快（即延迟更低）。

如果节点在两次通过后无法选择初始同步源，它会记录一个错误并等待`1`第二次，然后重新启动选择过程。从节点可以在出现错误退出之前多次[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)重新启动初始同步源选择过程。`10`

如果在第一遍之后没有候选同步源剩余，则该节点执行具有宽松标准的第二遍。请参阅**同步源选择（第二遍）**。

如果节点在两次通过后无法选择同步源，它会记录一个错误并等待`1`第二次，然后再重新启动选择过程。

每小时可以更改源的次数可通过设置[`maxNumSyncSourceChangesPerHour`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.maxNumSyncSourceChangesPerHour) 参数进行配置。

>## NOTE
>
>从 MongoDB 4.4 开始， 在选择初始同步源时，启动参数[`initialSyncSourceReadPreference`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.initialSyncSourceReadPreference)优先于副本集的设置。[`settings.chainingAllowed`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.chainingAllowed)副本集成员成功执行初始同步后，将遵循 [`chainingAllowed`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.chainingAllowed)选择复制同步源时的值。
>
>看[初始同步源选择](https://www.mongodb.com/docs/manual/core/replica-set-sync/#std-label-replica-set-initial-sync-source-selection)有关初始同步源选择的更多信息。

←  [副本集操作日志](https://www.mongodb.com/docs/manual/core/replica-set-oplog/)																			[副本集部署架构](https://www.mongodb.com/docs/manual/core/replica-set-architectures/) →



原文链接 -https://docs.mongodb.com/manual/core/replica-set-sync/ 

译者：陆文龙

