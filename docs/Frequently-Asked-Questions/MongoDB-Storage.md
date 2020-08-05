# FAQ: MongoDB Storage

# 常见问题：MongoDB存储

On this page

- [Storage Engine Fundamentals](https://docs.mongodb.com/manual/faq/storage/#storage-engine-fundamentals)
- [Can you mix storage engines in a replica set?](https://docs.mongodb.com/manual/faq/storage/#can-you-mix-storage-engines-in-a-replica-set)
- [WiredTiger Storage Engine](https://docs.mongodb.com/manual/faq/storage/#wiredtiger-storage-engine)
- [Data Storage Diagnostics](https://docs.mongodb.com/manual/faq/storage/#data-storage-diagnostics)

This document addresses common questions regarding MongoDB’s storage system.

在本页面

- [存储引擎基础知识](https://docs.mongodb.com/manual/faq/storage/#storage-engine-fundamentals)
- [您可以在副本集中混用存储引擎吗？](https://docs.mongodb.com/manual/faq/storage/#can-you-mix-storage-engines-in-a-replica-set)
- [WiredTiger存储引擎](https://docs.mongodb.com/manual/faq/storage/#wiredtiger-storage-engine)
- [数据存储诊断](https://docs.mongodb.com/manual/faq/storage/#data-storage-diagnostics)

本文档解决了有关MongoDB存储系统的常见问题。



## Storage Engine Fundamentals

## 存储引擎基础知识

### What is a storage engine?

### 什么是存储引擎？[¶](https://docs.mongodb.com/manual/faq/storage/#what-is-a-storage-engine)

A storage engine is the part of a database that is responsible for managing how data is stored, both in memory and on disk. Many databases support multiple storage engines, where different engines perform better for specific workloads. For example, one storage engine might offer better performance for read-heavy workloads, and another might support a higher throughput for write operations.

存储引擎是数据库的一部分，负责管理如何在内存和磁盘上存储数据。许多数据库支持多个存储引擎，其中不同的引擎在特定工作负载下性能更好。例如，一个存储引擎可能为读取大量工作负载提供更好的性能，而另一个可能为写入操作提供更高的吞吐量。

SEE ALSO

[Storage Engines](https://docs.mongodb.com/manual/core/storage-engines/)

参见

[储存引擎](https://docs.mongodb.com/manual/core/storage-engines/)



## Can you mix storage engines in a replica set?

## 您可以在副本集中混用存储引擎吗？

Yes. You can have replica set members that use different storage engines (WiredTiger and in-memory)

可以。您可以让副本集成员使用不同的存储引擎（WiredTiger和内存中）

NOTE

Starting in version 4.2, MongoDB removes the deprecated MMAPv1 storage engine.

注意

从4.2版开始，MongoDB删除不推荐使用的MMAPv1存储引擎。



## WiredTiger Storage Engine

## WiredTiger存储引擎

### Can I upgrade an existing deployment to WiredTiger?

### 我可以将现有部署升级到WiredTiger吗？

Yes. See:

- [Change Standalone to WiredTiger](https://docs.mongodb.com/manual/tutorial/change-standalone-wiredtiger/)
- [Change Replica Set to WiredTiger](https://docs.mongodb.com/manual/tutorial/change-replica-set-wiredtiger/)
- [Change Sharded Cluster to WiredTiger](https://docs.mongodb.com/manual/tutorial/change-sharded-cluster-wiredtiger/)

可以。参见：

- [将单机部署的存储引擎更改为WiredTiger](https://docs.mongodb.com/manual/tutorial/change-standalone-wiredtiger/)

- [将副本集的存储引擎更改为WiredTiger](https://docs.mongodb.com/manual/tutorial/change-replica-set-wiredtiger/)

- [将分片集群的存储引擎更改为WiredTiger](https://docs.mongodb.com/manual/tutorial/change-sharded-cluster-wiredtiger/)

  

### How much compression does WiredTiger provide?

### WiredTiger提供的压缩比率是多少？

The ratio of compressed data to uncompressed data depends on your data and the compression library used. By default, collection data in WiredTiger use [Snappy block compression](https://docs.mongodb.com/manual/reference/glossary/#term-snappy); [zlib](https://docs.mongodb.com/manual/reference/glossary/#term-zlib) and [zstd](https://docs.mongodb.com/manual/reference/glossary/#term-zstd) compression is also available. Index data use [prefix compression](https://docs.mongodb.com/manual/reference/glossary/#term-prefix-compression) by default.

压缩数据与未压缩数据的比率取决于您的数据和使用的压缩算法库。默认情况下，WiredTiger中的集合数据使用[Snappy块压缩](https://docs.mongodb.com/manual/reference/glossary/#term-snappy)；也可以使用[zlib](https://docs.mongodb.com/manual/reference/glossary/#term-zlib) 和[zstd](https://docs.mongodb.com/manual/reference/glossary/#term-zstd)压缩。索引数据默认使用[前缀压缩](https://docs.mongodb.com/manual/reference/glossary/#term-prefix-compression)。



### To what size should I set the WiredTiger internal cache?

### 我应该将WiredTiger内部缓存设置为多大？

With WiredTiger, MongoDB utilizes both the WiredTiger internal cache and the filesystem cache.

通过WiredTiger，MongoDB可以利用WiredTiger内部缓存和文件系统缓存。

Starting in MongoDB 3.4, the default WiredTiger internal cache size is the larger of either:

- 50% of (RAM - 1 GB), or
- 256 MB.

从MongoDB 3.4开始，默认的WiredTiger内部缓存大小是以下两者中的较大者：

- 50％（内存大小 -1 GB），或
- 256 MB。

For example, on a system with a total of 4GB of RAM the WiredTiger cache will use 1.5GB of RAM (`0.5 * (4 GB - 1 GB) = 1.5 GB`). Conversely, a system with a total of 1.25 GB of RAM will allocate 256 MB to the WiredTiger cache because that is more than half of the total RAM minus one gigabyte (`0.5 * (1.25 GB - 1 GB) = 128 MB < 256 MB`).

例如，在总共有4GB 内存的系统上，WiredTiger缓存将使用1.5GB RAM（`0.5 * (4 GB - 1 GB) = 1.5 GB`）。相反，总内存为1.25 GB的系统将为WiredTiger缓存分配256 MB，因为这是总内存的一半以上减去1 GB （`0.5 * (1.25 GB - 1 GB) = 128 MB < 256 MB`）。



NOTE

In some instances, such as when running in a container, the database can have memory constraints that are lower than the total system memory. In such instances, this memory limit, rather than the total system memory, is used as the maximum RAM available.

注意

在某些情况下，例如在容器中运行时，数据库的内存限制可能低于系统总内存。在这种情况下，此内存限制而不是系统总内存将用作最大可用内存。

要查看内存限制，请参阅[`hostInfo.system.memLimitMB`](https://docs.mongodb.com/manual/reference/command/hostInfo/#hostInfo.system.memLimitMB)。

To see the memory limit, see [`hostInfo.system.memLimitMB`](https://docs.mongodb.com/manual/reference/command/hostInfo/#hostInfo.system.memLimitMB).

By default, WiredTiger uses Snappy block compression for all collections and prefix compression for all indexes. Compression defaults are configurable at a global level and can also be set on a per-collection and per-index basis during collection and index creation.

默认情况下，WiredTiger对所有集合使用Snappy块压缩，对所有索引使用前缀压缩。压缩默认值是可以在全局级别配置的，也可以在每个集合和每个索引创建期间单独进行设置。

Different representations are used for data in the WiredTiger internal cache versus the on-disk format:

WiredTiger内部缓存中的数据与磁盘上的数据使用不同表示形式的数据格式：

- Data in the filesystem cache is the same as the on-disk format, including benefits of any compression for data files. The filesystem cache is used by the operating system to reduce disk I/O.
- Indexes loaded in the WiredTiger internal cache have a different data representation to the on-disk format, but can still take advantage of index prefix compression to reduce RAM usage. Index prefix compression deduplicates common prefixes from indexed fields.
- Collection data in the WiredTiger internal cache is uncompressed and uses a different representation from the on-disk format. Block compression can provide significant on-disk storage savings, but data must be uncompressed to be manipulated by the server.

- 文件系统缓存中的数据与磁盘格式相同，包括对数据文件进行的任何压缩的好处也是一样的。操作系统使用文件系统缓存来减少磁盘I / O。
- 加载到WiredTiger内部缓存中的索引的数据表示形式与磁盘格式不同，但是仍可以利用索引前缀压缩来减少内存使用量。索引前缀压缩可从索引字段中删除通用前缀。
- WiredTiger内部缓存中的集合数据是未压缩的，并使用与磁盘格式不同的表示形式。块压缩可以节省大量的磁盘存储空间，但数据必须解压缩才能由服务器操作。

Via the filesystem cache, MongoDB automatically uses all free memory that is not used by the WiredTiger cache or by other processes.

通过文件系统缓存，MongoDB自动使用WiredTiger缓存或其他进程未使用的所有可用内存。

To adjust the size of the WiredTiger internal cache, see [`storage.wiredTiger.engineConfig.cacheSizeGB`](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.engineConfig.cacheSizeGB) and [`--wiredTigerCacheSizeGB`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-wiredtigercachesizegb). Avoid increasing the WiredTiger internal cache size above its default value.

要调整WiredTiger内部缓存的大小，请参阅 [`storage.wiredTiger.engineConfig.cacheSizeGB`](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.engineConfig.cacheSizeGB)和 [`--wiredTigerCacheSizeGB`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-wiredtigercachesizegb)。避免将WiredTiger内部缓存的大小增加到其默认值以上。

NOTE

The [`storage.wiredTiger.engineConfig.cacheSizeGB`](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.engineConfig.cacheSizeGB) limits the size of the WiredTiger internal cache. The operating system will use the available free memory for filesystem cache, which allows the compressed MongoDB data files to stay in memory. In addition, the operating system will use any free RAM to buffer file system blocks and file system cache.

To accommodate the additional consumers of RAM, you may have to decrease WiredTiger internal cache size.

注意

[`storage.wiredTiger.engineConfig.cacheSizeGB`](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.engineConfig.cacheSizeGB)限制WiredTiger内部缓存的大小。操作系统将使用可用的空闲内存进行文件系统缓存，从而允许压缩的MongoDB数据文件保留在内存中。此外，操作系统将使用任何可用的内存来缓冲文件系统块和文件系统缓存。

为了容纳更多的RAM使用者，您可能必须减小WiredTiger内部缓存的大小。



The default WiredTiger internal cache size value assumes that there is a single [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instance per machine. If a single machine contains multiple MongoDB instances, then you should decrease the setting to accommodate the other [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instances.

默认的WiredTiger内部缓存大小值假定每台计算机有一个[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)实例。如果一台机器包含多个MongoDB实例，则应减小设置以容纳其他[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 实例。

If you run [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) in a container (e.g. `lxc`, `cgroups`, Docker, etc.) that does *not* have access to all of the RAM available in a system, you must set [`storage.wiredTiger.engineConfig.cacheSizeGB`](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.engineConfig.cacheSizeGB) to a value less than the amount of RAM available in the container. The exact amount depends on the other processes running in the container. See [`memLimitMB`](https://docs.mongodb.com/manual/reference/command/hostInfo/#hostInfo.system.memLimitMB).

如果您的[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)是运行在无法访问所有系统中所有可用的内存的容器（例如`lxc`， `cgroups`，Docker，等等）中时，您必须将[`storage.wiredTiger.engineConfig.cacheSizeGB`](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.engineConfig.cacheSizeGB)的值设置为小于容器中可用内存大小的值。确切的大小取决于容器中运行的其他进程。请参阅 [`memLimitMB`](https://docs.mongodb.com/manual/reference/command/hostInfo/#hostInfo.system.memLimitMB)。

To view statistics on the cache and eviction rate, see the [`wiredTiger.cache`](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.wiredTiger.cache) field returned from the [`serverStatus`](https://docs.mongodb.com/manual/reference/command/serverStatus/#dbcmd.serverStatus) command.

要查看有关缓存和缓存淘汰率的统计信息，请参阅[`wiredTiger.cache`](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.wiredTiger.cache)命令返回的[`serverStatus`](https://docs.mongodb.com/manual/reference/command/serverStatus/#dbcmd.serverStatus)字段。



### How frequently does WiredTiger write to disk?

### WiredTiger写入磁盘的频率如何？[¶](https://docs.mongodb.com/manual/faq/storage/#how-frequently-does-wiredtiger-write-to-disk)

- Checkpoints

  Starting in version 3.6, MongoDB configures WiredTiger to create checkpoints (i.e. write the snapshot data to disk) at intervals of 60 seconds. In earlier versions, MongoDB sets checkpoints to occur in WiredTiger on user data at an interval of 60 seconds or when 2 GB of journal data has been written, whichever occurs first.

- Journal Data

  WiredTiger syncs the buffered journal records to disk upon any of the following conditions:
  
  - For replica set members (primary and secondary members),
  
    - If there are operations waiting for oplog entries. Operations that can wait for oplog entries include:
      - forward scanning queries against the oplog
      - read operations performed as part of [causally consistent sessions](https://docs.mongodb.com/manual/core/read-isolation-consistency-recency/#causal-consistency)
    - Additionally for secondary members, after every batch application of the oplog entries.
  
  - If a write operation includes or implies a write concern of [`j: true`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern.j).
  
    NOTE
  
    Write concern [`"majority"`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority") implies `j: true` if the [`writeConcernMajorityJournalDefault`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.writeConcernMajorityJournalDefault) is true.
  
  - At every 100 milliseconds (See [`storage.journal.commitIntervalMs`](https://docs.mongodb.com/manual/reference/configuration-options/#storage.journal.commitIntervalMs)).
  
  - When WiredTiger creates a new journal file. Because MongoDB uses a journal file size limit of 100 MB, WiredTiger creates a new journal file approximately every 100 MB of data.

- Checkpoints（检查点）

  从版本3.6开始，MongoDB将WiredTiger配置为以60秒的间隔创建检查点（即，将快照数据写入磁盘）。在早期版本中，MongoDB将检查点设置为在WiredTiger中以60秒的间隔或在写入2 GB的预写日志数据时，对用户数据进行检查，以先发生者为准。

  

- Journal Data（预写日志数据）

  WiredTiger根据以下间隔或条件写入磁盘：

  - 对于副本集成员（主节点和次节点成员），

    - 如果有等待操作日志输入的操作，可以等待操作日志条目的操作包括:
      - 针对oplog转发扫描查询
      - 读取操作，作为[因果一致会话的](https://docs.mongodb.com/manual/core/read-isolation-consistency-recency/#causal-consistency)一部分
    - 另外，对于从节点成员，在每次批量处理oplog条目之后。

  - 如果写入操作包括写关注的j参数： [`j: true`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern.j)

    注意

    如果[`writeConcernMajorityJournalDefault`](https://docs.mongodb.com/manual/reference/replica-configuration/#rsconf.writeConcernMajorityJournalDefault)是真的，写关注[`"majority"`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority")参数为`j: true`。

  

- 每隔100毫秒（请参阅[`storage.journal.commitIntervalMs`](https://docs.mongodb.com/manual/reference/configuration-options/#storage.journal.commitIntervalMs)）。

  

- WiredTiger创建新的日记文件时。由于MongoDB使用的预写日志文件大小限制为100 MB，因此WiredTiger大约每100 MB数据创建一个新的日志文件。

  

### How do I reclaim disk space in WiredTiger?

### 如何在WiredTiger中回收磁盘空间？

The WiredTiger storage engine maintains lists of empty records in data files as it deletes documents. This space can be reused by WiredTiger, but will not be returned to the operating system unless under very specific circumstances.

WiredTiger存储引擎在删除文档时会维护数据文件中的空记录列表。WiredTiger可以重用此空间，但是除非在非常特定的情况下，否则不会将其返回给操作系统。

The amount of empty space available for reuse by WiredTiger is reflected in the output of [`db.collection.stats()`](https://docs.mongodb.com/manual/reference/method/db.collection.stats/#db.collection.stats) under the heading `wiredTiger.block-manager.file bytes available for reuse`.

WiredTiger可以重用的可用空间量反映在[`db.collection.stats()`](https://docs.mongodb.com/manual/reference/method/db.collection.stats/#db.collection.stats)标题下的`wiredTiger.block-manager.file bytes available for reuse`输出中。

To allow the WiredTiger storage engine to release this empty space to the operating system, you can de-fragment your data file. This can be achieved using the [`compact`](https://docs.mongodb.com/manual/reference/command/compact/#dbcmd.compact) command. For more information on its behavior and other considerations, see [`compact`](https://docs.mongodb.com/manual/reference/command/compact/#dbcmd.compact).

为了使WiredTiger存储引擎可以将此空白空间释放给操作系统，可以对数据文件进行碎片整理。这可以使用[`compact`](https://docs.mongodb.com/manual/reference/command/compact/#dbcmd.compact)命令来实现。有关其行为和其他注意事项的更多信息，请参见[`compact`](https://docs.mongodb.com/manual/reference/command/compact/#dbcmd.compact)。



## Data Storage Diagnostics

## 数据存储诊断[¶](https://docs.mongodb.com/manual/faq/storage/#data-storage-diagnostics)

### How can I check the size of a collection?

### 如何查看集合的大小？

To view the statistics for a collection, including the data size, use the [`db.collection.stats()`](https://docs.mongodb.com/manual/reference/method/db.collection.stats/#db.collection.stats) method from the [`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo) shell. The following example issues [`db.collection.stats()`](https://docs.mongodb.com/manual/reference/method/db.collection.stats/#db.collection.stats) for the `orders` collection:

要查看集合的统计信息，包括数据大小，请使用[`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo) shell程序中的[`db.collection.stats()`](https://docs.mongodb.com/manual/reference/method/db.collection.stats/#db.collection.stats)方法(https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo)。以下示例为`orders`集合执行[db.collection.stats()`](https://docs.mongodb.com/manual/reference/method/db.collection.stats/#db.collection.stats)：

copy 复制

```
db.orders.stats();
```

MongoDB also provides the following methods to return specific sizes for the collection:

MongoDB还提供以下方法来返回集合的特定大小信息：

- [`db.collection.dataSize()`](https://docs.mongodb.com/manual/reference/method/db.collection.dataSize/#db.collection.dataSize) to return the uncompressed data size in bytes for the collection.
- [`db.collection.storageSize()`](https://docs.mongodb.com/manual/reference/method/db.collection.storageSize/#db.collection.storageSize) to return the size in bytes of the collection on disk storage. If collection data is compressed (which is the [`default for WiredTiger`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-wiredtigercollectionblockcompressor)), the storage size reflects the compressed size and may be smaller than the value returned by [`db.collection.dataSize()`](https://docs.mongodb.com/manual/reference/method/db.collection.dataSize/#db.collection.dataSize).
- [`db.collection.totalIndexSize()`](https://docs.mongodb.com/manual/reference/method/db.collection.totalIndexSize/#db.collection.totalIndexSize) to return the index sizes in bytes for the collection. If an index uses prefix compression (which is the [`default for WiredTiger`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-wiredtigerindexprefixcompression)), the returned size reflects the compressed size.

- [`db.collection.dataSize()`](https://docs.mongodb.com/manual/reference/method/db.collection.dataSize/#db.collection.dataSize) 返回该集合的未压缩数据大小（以字节为单位）。
- [`db.collection.storageSize()`](https://docs.mongodb.com/manual/reference/method/db.collection.storageSize/#db.collection.storageSize)返回磁盘存储上集合的大小（以字节为单位）。如果集合数据被压缩（即[`default for WiredTiger`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-wiredtigercollectionblockcompressor)），则存储大小将反映压缩后的大小，并且可能小于[`db.collection.dataSize()`](https://docs.mongodb.com/manual/reference/method/db.collection.dataSize/#db.collection.dataSize)所返回的值 。
- [`db.collection.totalIndexSize()`](https://docs.mongodb.com/manual/reference/method/db.collection.totalIndexSize/#db.collection.totalIndexSize)返回集合的索引大小（以字节为单位）。如果索引使用前缀压缩（即[`default for WiredTiger`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-wiredtigerindexprefixcompression)），则返回的大小将反映压缩后的大小。

The following script prints the statistics for each database:

以下脚本打印每个数据库的统计信息：

copy 复制

```
db.adminCommand("listDatabases").databases.forEach(function (d) {
   mdb = db.getSiblingDB(d.name);
   printjson(mdb.stats());
})
```

The following script prints the statistics for each collection in each database:

以下脚本打印每个数据库中每个集合的统计信息：

copy 复制

```
db.adminCommand("listDatabases").databases.forEach(function (d) {
   mdb = db.getSiblingDB(d.name);
   mdb.getCollectionNames().forEach(function(c) {
      s = mdb[c].stats();
      printjson(s);
   })
})
```



### How can I check the size of the individual indexes for a collection?

### 如何检查集合的各个索引的大小？[¶](https://docs.mongodb.com/manual/faq/storage/#how-can-i-check-the-size-of-the-individual-indexes-for-a-collection)

To view the size of the data allocated for each index, use the [`db.collection.stats()`](https://docs.mongodb.com/manual/reference/method/db.collection.stats/#db.collection.stats) method and check the [`indexSizes`](https://docs.mongodb.com/manual/reference/command/collStats/#collStats.indexSizes) field in the returned document.

要查看为每个索引分配的数据大小，请使用 [`db.collection.stats()`](https://docs.mongodb.com/manual/reference/method/db.collection.stats/#db.collection.stats)方法并检查返回文档中的[`indexSizes`](https://docs.mongodb.com/manual/reference/command/collStats/#collStats.indexSizes)字段。

If an index uses prefix compression (which is the [`default for WiredTiger`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-wiredtigerindexprefixcompression)), the returned size for that index reflects the compressed size.

如果索引使用前缀压缩（即[`default for WiredTiger`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-wiredtigerindexprefixcompression)），则该索引的返回大小将反映压缩后的大小。



### How can I get information on the storage use of a database?如何获得有关数据库存储使用的信息？[¶](https://docs.mongodb.com/manual/faq/storage/#how-can-i-get-information-on-the-storage-use-of-a-database)

The [`db.stats()`](https://docs.mongodb.com/manual/reference/method/db.stats/#db.stats) method in the [`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo) shell returns the current state of the “active” database. For the description of the returned fields, see [dbStats Output](https://docs.mongodb.com/manual/reference/command/dbStats/#dbstats-output).

[`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo) shell中的[`db.stats()`](https://docs.mongodb.com/manual/reference/method/db.stats/#db.stats)方法返回“活跃”数据库的当前状态。有关返回的字段的说明，参见[dbStats Output](https://docs.mongodb.com/manual/reference/command/dbStats/#dbstats-output)。



原文链接：https://docs.mongodb.com/manual/faq/storage/

译者：钟秋

update:小芒果

