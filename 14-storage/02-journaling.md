# 日志[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/journaling/#journaling)

为了在发生故障时提供持久性，MongoDB 使用预*写日志记录*到磁盘[日志](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-journal)文件。



## 日志和 WiredTiger 存储引擎[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/journaling/#journaling-and-the-wiredtiger-storage-engine)



## IMPORTANT

本节提到的*日志是指WiredTiger write-ahead log（即journal），并不是MongoDB的日志文件。*

[WiredTiger](https://www.mongodb.com/docs/manual/core/wiredtiger/)使用[检查点](https://www.mongodb.com/docs/manual/core/wiredtiger/#std-label-storage-wiredtiger-checkpoints)来提供磁盘上数据的一致视图，并允许 MongoDB 从上一个检查点恢复。但是，如果 MongoDB 在检查点之间意外退出，则需要日志记录来恢复在最后一个检查点之后发生的信息。



## NOTE

从 MongoDB 4.0 开始，您不能为使用 WiredTiger 存储引擎的副本集节点指定[`--nojournal`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--nojournal)选项或[`storage.journal.enabled: false`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.journal.enabled)。

使用日志记录，恢复过程：

1. 在数据文件中查找最后一个检查点的标识符。
2. 在日志文件中搜索与最后一个检查点的标识符匹配的记录。
3. 自上次检查点以来应用日志文件中的操作。



### 日志过程[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/journaling/#journaling-process)

*在版本3.2中更改*。

通过日志记录，WiredTiger 为每个客户端发起的写操作创建一个日志记录。日志记录包括由初始写入引起的任何内部写入操作。例如，对集合中文档的更新可能会导致对索引的修改；WiredTiger 创建单个日志记录，其中包括更新操作及其关联的索引修改。

MongoDB 配置 WiredTiger 使用内存缓冲来存储日志记录。线程协调分配和复制到它们的缓冲区部分。所有最大 128 kB 的日志记录都被缓冲。

WiredTiger 在以下任何情况下将缓冲的日志记录同步到磁盘：

- 对于副本集节点（主要和从节点），

  - 如果有操作等待 oplog 条目。可以等待 oplog 条目的操作包括：
    - 转发针对 oplog 的扫描查询
    - [作为因果一致会话](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-causal-consistency)的一部分执行的读取操作
  - 此外，对于次要成员，在每次批量应用 oplog 条目之后。

- 如果写操作包括或暗示 [`j: true`.](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.j)

  

  ## NOTE

  写关注[`"majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)意味着`j: true`如果[`writeConcernMajorityJournalDefault`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.writeConcernMajorityJournalDefault)是真的。

- 每 100 毫秒一次（参见 参考资料[`storage.journal.commitIntervalMs`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.journal.commitIntervalMs)）。

- 当 WiredTiger 创建新的日志文件时。因为 MongoDB 使用 100 MB 的日志文件大小限制，所以 WiredTiger 大约每 100 MB 数据创建一个新的日志文件。



## IMPORTANT

在写入操作之间，虽然日志记录保留在 WiredTiger 缓冲区中，但在硬关闭[`mongod`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)



## TIP

### 也可以看看：

该[`serverStatus`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)命令在字段中返回有关 WiredTiger 日志统计信息的信息[`wiredTiger.log`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.wiredTiger.log) 。

### 日志文件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/journaling/#journal-files)

对于日志文件，MongoDB 在该目录下创建一个名为`journal` 的子目录[`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)。WiredTiger 日志文件的名称具有以下格式`WiredTigerLog.<sequence>` ，其中`<sequence>`是从 `0000000001`.



#### 日志记录[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/journaling/#journal-records)

日志文件包含每个客户端发起的写入操作的记录

- 日志记录包括由初始写入引起的任何内部写入操作。例如，对集合中文档的更新可能会导致对索引的修改；WiredTiger 创建单个日志记录，其中包括更新操作及其关联的索引修改。
- 每条记录都有一个唯一的标识符。
- WiredTiger 的最小日志记录大小为 128 字节。

#### 压缩[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/journaling/#compression)

默认情况下，MongoDB 配置 WiredTiger 对其日志数据使用 snappy 压缩。要指定不同的压缩算法或不压缩，请使用 [`storage.wiredTiger.engineConfig.journalCompressor`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.wiredTiger.engineConfig.journalCompressor)设置。有关详细信息，请参阅[更改 WiredTiger Journal Compressor](https://www.mongodb.com/docs/manual/tutorial/manage-journaling/#std-label-manage-journaling-change-wt-journal-compressor) .s



## NOTE

如果日志记录小于或等于 128 字节（最小值 [WiredTiger 的日志记录大小](https://www.mongodb.com/docs/manual/core/journaling/#std-label-wt-jouraling-record)), WiredTiger 不压缩该记录。

#### 日志文件大小限制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/journaling/#journal-file-size-limit)

MongoDB 的 WiredTiger 日志文件的最大大小限制约为 100 MB。

- 一旦文件超过该限制，WiredTiger 就会创建一个新的日志文件。
- WiredTiger 自动删除旧日志文件以仅保留从上一个检查点恢复所需的文件。

#### 预先分配[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/journaling/#pre-allocation)

WiredTiger 预分配日志文件。



## 日志和内存存储引擎[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/journaling/#journaling-and-the-in-memory-storage-engine)

从 MongoDB Enterprise 版本 3.2.6 开始，[内存存储引擎](https://www.mongodb.com/docs/manual/core/inmemory/)是一般可用性 (GA) 的一部分。因为它的数据保存在内存中，所以没有单独的日志。[`j: true`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.j)立即确认具有写关注的写操作。

如果副本集的任何投票成员使用[内存存储引擎](https://www.mongodb.com/docs/manual/core/inmemory/#std-label-storage-inmemory)，则必须设置 [`writeConcernMajorityJournalDefault`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.writeConcernMajorityJournalDefault)为`false`。



## NOTE

从 4.2 版（以及 4.0.13 和 3.6.14 ）开始，如果副本集节点使用[内存存储引擎](https://www.mongodb.com/docs/manual/core/inmemory/) （投票或非投票）但副本集已 [`writeConcernMajorityJournalDefault`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.writeConcernMajorityJournalDefault)设置为 true，则副本集成员记录启动警告。

[`writeConcernMajorityJournalDefault`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.writeConcernMajorityJournalDefault)设置为 时，MongoDB在确认写入之前`false`不会等待[`w: "majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-) 写入写入磁盘日志。因此，[`"majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)如果给定副本集中的大多数节点发生暂时性丢失（例如崩溃和重启），写操作可能会回滚。



## TIP

### 也可以看看：

[内存存储引擎：持久性](https://www.mongodb.com/docs/manual/core/inmemory/#std-label-inmemory-durability)

←  [内存存储引擎](https://www.mongodb.com/docs/manual/core/inmemory/)[管理日记](https://www.mongodb.com/docs/manual/tutorial/manage-journaling/) →

原文链接 -https://docs.mongodb.com/manual/core/journaling/

译者：陆文龙

