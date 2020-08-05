# In-Memory Storage Engine

<a name="WZ6hv"></a>
# 内存存储引擎

<br />原文链接：[https://docs.mongodb.com/manual/core/inmemory/](https://docs.mongodb.com/manual/core/inmemory/)<br />Starting in MongoDB Enterprise version 3.2.6, the in-memory storage engine is part of general availability (GA) in the 64-bit builds. Other than some metadata and diagnostic data, the in-memory storage engine does not maintain any on-disk data, including configuration data, indexes, user credentials, etc.<br />从MongoDB Enterprise 3.2.6开始，In-Memory内存存储引擎是64位版本中通用可用性（GA）的一部分。 除某些元数据和诊断数据外，In-Memory内存存储引擎不维护任何磁盘上的数据，包括配置数据、索引、用户凭据等。<br />By avoiding disk I/O, the in-memory storage engine allows for more predictable latency of database operations.<br />通过避免磁盘I / O，内存中存储引擎使数据库操作的延迟更可预测。
<a name="Idx5M"></a>
## **Specify In-Memory Storage Engine**
<a name="ltRXJ"></a>
## **指定In-Memory存储引擎**
To select the in-memory storage engine, specify:<br />要选择in-memory内存存储引擎，配置启动参数即可：<br />inMemory for the --storageEngine option, or the storage.engine setting if using a configuration file.<br />用于--storageEngine选项设置inMemory；或者如果使用配置文件方式，则为storage.engine设置。<br />--dbpath, or storage.dbPath if using a configuration file. Although the in-memory storage engine does not write data to the filesystem, it maintains in the<br />--dbpath small metadata files and diagnostic data as well temporary files for building large indexes.<br />--dbpath，如果使用配置文件，则为storage.dbPath。 尽管内存存储引擎不会将数据写入文件系统，但它会在--dbpath中维护小型元数据文件和诊断数据以及用于构建大型索引的临时文件。<br />For example, from the command line:<br />例如，从命令行输入参数命令：
> mongod --storageEngine inMemory --dbpath

Or, if using the [YAML configuration file format](https://docs.mongodb.com/manual/reference/configuration-options/):<br />或者，如果使用[YAML配置文件格式]（[https://docs.mongodb.com/manual/reference/configuration-options/](https://docs.mongodb.com/manual/reference/configuration-options/)）：
> storage:
> engine: inMemory
> dbPath:

See inMemory Options for configuration options specific to this storage engine. Most mongod configuration options are available for use with in-memory storage engine except for those options that are related to data persistence, such as journaling or encryption at rest configuration.<br />请参阅内存选项中有关此存储引擎的配置选项。 除与数据持久性相关的那些选项参数（例如日志记录或静态配置加密）外，大多数mongod配置选项均可用于in-memory内存存储引擎。
> WARNING警告
> The in-memory storage engine does not persist data after process shutdown.
> 进程关闭后，内存中存储引擎不会保留数据。

<a name="Zf2jf"></a>
## Concurrency 并发
The in-memory storage engine uses document-level concurrency control for write operations. As a result, multiple clients can modify different documents of a collection at the same time.<br />in-memory内存存储引擎将文档级并发控制用于写入操作。 因此，多个客户端可以同时修改集合的不同文档。
<a name="b6A1Z"></a>
## Memory Use 内存使用
In-memory storage engine requires that all its data (including indexes, oplog if mongod instance is part of a replica set, etc.) must fit into the specified --inMemorySizeGB command-line option or storage.inMemory.engineConfig.inMemorySizeGB setting in the YAML configuration file.<br />内存存储引擎要求其所有数据（包括索引，oplog（如果mongod实例是副本集的一部分）等）必须适合指定的--inMemorySizeGB命令行选项或中的storage.inMemory.engineConfig.inMemorySizeGB设置。 YAML配置文件。<br />By default, the in-memory storage engine uses 50% of physical RAM minus 1 GB.<br />默认情况下，in-memory 内存存储引擎使用50％的（物理RAM减去1GB）。<br />If a write operation would cause the data to exceed the specified memory size, MongoDB returns with the error:<br />如果写操作将导致数据超过指定的内存大小，则MongoDB返回错误：
> "WT_CACHE_FULL: operation would overflow cache" “ WT_CACHE_FULL：操作将溢出缓存”

To specify a new size, use the storage.inMemory.engineConfig.inMemorySizeGB setting in the YAML configuration file format:<br />要指定新大小，请使用YAML配置文件格式的storage.inMemory.engineConfig.inMemorySizeGB设置：<br />Or use the command-line option --inMemorySizeGB:<br />或使用命令行选项--inMemorySizeGB启动服务：
> mongod --storageEngine inMemory --dbpath  --inMemorySizeGB

<a name="cTCYv"></a>
## Durability 持久性
The in-memory storage engine is non-persistent and does not write data to a persistent storage. Non-persisted data includes application data and system data, such as users, permissions, indexes, replica set configuration, sharded cluster configuration, etc.<br />内存中存储引擎是非持久性的，不会将数据写入持久性存储。 非持久数据包括应用程序数据和系统数据，例如用户，权限，索引，副本集配置，分片群集配置等。<br />As such, the concept of journal or waiting for data to become durable does not apply to the in-memory storage engine.<br />因此，日志或等待数据变得持久的概念不适用于内存中的存储引擎。<br />If any voting member of a replica set uses the in-memory storage engine, you must set writeConcernMajorityJournalDefault to false.<br />如果副本集的任何有投票权的成员使用内存存储引擎，则必须将writeConcernMajorityJournalDefault设置为false。
> NOTE 注意
> Starting in version 4.2 (and 4.0.13 and 3.6.14 ), if a replica set member uses the in-memory storage engine (voting or non-voting) but the replica set has writeConcernMajorityJournalDefault set to true, the replica set member logs a startup warning.
> 从版本4.2（以及4.0.13和3.6.14）开始，如果副本集成员使用内存中的存储引擎（投票或不投票），但是副本集的writeConcernMajorityJournalDefault设置为true，则副本集成员记录a 启动警告。
> With writeConcernMajorityJournalDefault set to false, MongoDB does not wait for w: "majority" writes to be written to the on-disk journal before acknowledging the writes. As such, majority write operations could possibly roll back in the event of a transient loss (e.g. crash and restart) of a majority of nodes in a given replica set.
> 将writeConcernMajorityJournalDefault设置为false时，MongoDB不会等待w：在确认写入之前，“多数”写入将写入磁盘日志。 这样，如果给定副本集中大多数节点的瞬时丢失（例如崩溃和重新启动），多数写入操作可能会回滚。

Write operations that specify a write concern journaled are acknowledged immediately. When an mongod instance shuts down, either as result of the shutdown command or due to a system error, recovery of in-memory data is impossible.<br />立即记录指定日记记录的写关注点的写操作。 当mongod实例由于shutdown命令或由于系统错误而关闭时，无法恢复内存中的数据。
<a name="Tj8fF"></a>
## Transactions
Starting in MongoDB 4.2, transactions are supported on replica sets and sharded clusters where:<br />从MongoDB 4.2开始，副本集和分片群集上支持事务，其中：<br />the primary uses the WiredTiger storage engine, and the secondary members use either the WiredTiger storage engine or the in-memory storage engines.<br />In MongoDB 4.0, only replica sets using the WiredTiger storage engine supported transactions.<br />主要成员使用WiredTiger存储引擎，辅助成员使用WiredTiger存储引擎或内存中存储引擎。<br />在MongoDB 4.0中，仅使用WiredTiger存储引擎的副本集支持事务。
> NOTE注意
> You cannot run transactions on a sharded cluster that has a shard with writeConcernMajorityJournalDefault set to false, such as a shard with a voting member that uses the in-memory storage engine.
> 您无法在具有将writeConcernMajorityJournalDefault设置为false的分片的分片群集上运行事务，例如，具有使用in-memory 内存存储引擎的投票成员的分片集群。

<a name="oKPrz"></a>
## Deployment Architectures 部署架构
In addition to running as standalones, mongod instances that use in-memory storage engine can run as part of a replica set or part of a sharded cluster.<br />除了独立运行外，使用in-memory内存存储引擎的mongod实例还可以作为副本集的一部分或分片群集的一部分运行。
<a name="KXtzm"></a>
### Replica Set 复制集
You can deploy mongod instances that use in-memory storage engine as part of a replica set. For example, as part of a three-member replica set, you could have:<br />可以部署将in-memory内存存储引擎用作副本集一部分的mongod实例。 例如，作为三副本集的一部分，您可能需要修改配置：

- two mongod instances run with in-memory storage engine.两个mongod实例与内存存储引擎一起运行。
- one mongod instance run with WiredTiger storage engine. Configure the WiredTiger member as a hidden member (i.e. hidden: true and priority: 0).一个使用WiredTiger存储引擎运行的mongod实例。 将WiredTiger成员配置为隐藏成员（即hidden：true和优先级：0）。

With this deployment model, only the mongod instances running with the in-memory storage engine can become the primary. Clients connect only to the in-memory storage engine mongod instances. Even if both mongod instances running in-memory storage engine crash and restart, they can sync from the member running WiredTiger. The hidden mongod instance running with WiredTiger persists the data to disk, including the user data, indexes, and replication configuration information.<br />使用此部署模型，只有与in-memory内存存储引擎一起运行的mongod实例才能成为主要实例。 客户端仅连接到内存存储引擎mongod实例。 即使两个运行内存存储引擎的mongod实例都崩溃并重新启动，它们也可以从运行WiredTiger的成员进行同步。 与WiredTiger一起运行的隐藏mongod实例会将数据持久保存到磁盘，包括用户数据，索引和复制配置信息。
> NOTE 注意
> In-memory storage engine requires that all its data (including oplog if mongod is part of replica set, etc.) fit into the specified --inMemorySizeGB command-line option or storage.inMemory.engineConfig.inMemorySizeGB setting. See Memory Use.
> In-memory内存存储引擎要求其所有数据（如果mongod是副本集的一部分，则包括oplog等）都应适合指定的--inMemorySizeGB命令行选项或storage.inMemory.engineConfig.inMemorySizeGB设置。 请参阅内存使用。

<a name="CTQuK"></a>
### Sharded Cluster 分片集群
You can deploy mongod instances that use in-memory storage engine as part of a sharded cluster. For example, in a sharded cluster, you could have one shard that has consists of the following replica set:<br />可以将使用内存存储引擎的mongod实例部署为分片群集的一部分。 例如，在分片群集中，您可以拥有一个由以下副本集组成的分片：

- two mongod instances run with in-memory storage engine 两个mongod实例与内存存储引擎一起运行
- one mongod instance run with WiredTiger storage engine. Configure the WiredTiger member as a hidden member (i.e. hidden: true and priority: 0). 一个WiredTiger存储引擎运行的mongod实例。 将WiredTiger成员配置为隐藏成员（即hidden：true和优先级：0）。

To this shard, add the tag inmem. For example, if this shard has the name shardC, connect to the mongos and run sh.addShardTag().<br />在此分片节点上，添加标记inmem。 例如，如果此分片的名称为shardC，请连接到mongos并运行sh.addShardTag（）命令，添加标签。<br />For example,<br />sh.addShardTag("shardC", "inmem")<br />To the other shards, add a separate tag persisted .<br />例如，<br />sh.addShardTag（“ shardC”，“ inmem”）<br />向其他分片添加一个单独的标签persisted。
```
sh.addShardTag("shardA", "persisted")
sh.addShardTag("shardB", "persisted")
```
For each sharded collection that should reside on the inmem shard, assign to the entire chunk range the tag inmem:<br />对于应驻留在inmem分片上的每个分片集合，将标签inmem分配给整个块范围：
```
`sh.addTagRange("test.analytics", { shardKey: MinKey }, { shardKey: MaxKey }, "inmem")`
```
For each sharded collection that should reside across the persisted shards, assign to the entire chunk range the tag persisted:<br />对于应该驻留在持久化分片上的每个分片集合，将标签持久化分配给整个块范围：
```
`sh.addTagRange("salesdb.orders", { shardKey: MinKey }, { shardKey: MaxKey }, "persisted")`
```

<br />

