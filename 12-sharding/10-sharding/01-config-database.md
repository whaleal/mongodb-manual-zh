# 配置数据库

数据库中的集合`config`支持：

- 分片集群操作
- 独立、副本集和分片集群的因果一致会话以及副本集和分片集群的可重试写入。

## 限制

从 MongoDB 5.0 开始，不允许非事务读取具有以下阅读问题和选项的`config.transactions`集合：

- `"snapshot"`
- `"majority"`并且 设置了afterClusterTime选项
- 当使用MongoDB 驱动程序`"majority"` 在因果一致的会话中





>## 重要的
>
>`config`数据库的模式是 *内部的*，可能会在 MongoDB 的版本之间发生变化。`config`数据库 不是一个可靠的API，用户在正常操作或维护过程中不应向`config`数据库写入数据。



>## 笔记
>
>`config`您不能在多文档事务中对数据库中的集合执行读/写操作.

## 支持分片集群操作的集合

要访问`config`数据库并查看支持分片操作的集合列表，请使用`mongosh`连接到 `mongos` 分片集群中的一个实例并发出以下命令：

```shell
use config

show collections
```



>
>
>## 笔记
>
>如果使用访问控制运行，请确保您拥有授予`listCollections`对数据库操作的权限。



配置数据库主要供内部使用，在正常操作期间，您不应手动向其中插入或存储数据。但是，如果您需要验证分片集群的配置服务器的写入可用性，您可以将文档插入测试集合（在确保不存在该名称的集合之后）：



>
>
>## 警告
>
>在正常运行的系统上修改`config`数据库可能会导致不稳定或不一致的数据集。如果必须修改`config`数据库，请使用`mongodump`创建`config`数据库的完整备份。



```shell
db.testConfigServerWriteAvail.insertOne( { a : 1 } )
```



如果操作成功，则配置服务器可用于处理写入。

服务器的未来版本可能在配置数据库中包含不同的集合，因此在为测试集合选择名称时要小心。

MongoDB 在数据库中使用以下集合`config`来支持分片：

`config.changelog`



>## 提示
>
>### 内部 MongoDB 元数据
>
>这配置数据库是内部的：应用程序和管理员不应在正常操作过程中修改或依赖其内容。



`changelog`集合为分片集合的元数据的每个更改存储一个文档。



>## 例子
>
>以下示例显示从`changelog`收藏：
>
>```shell
>{
> "_id" : "<hostname>-<timestamp>-<increment>",
> "server" : "<hostname><:port>",
> "clientAddr" : "127.0.0.1:63381",
> "time" : ISODate("2012-12-11T14:09:21.039Z"),
> "what" : "split",
> "ns" : "<database>.<collection>",
> "details" : {
>    "before" : {
>       "min" : {
>          "<database>" : { $minKey : 1 }
>       },
>       "max" : {
>          "<database>" : { $maxKey : 1 }
>       },
>       "lastmod" : Timestamp(1000, 0),
>       "lastmodEpoch" : ObjectId("000000000000000000000000")
>    },
>    "left" : {
>       "min" : {
>          "<database>" : { $minKey : 1 }
>       },
>       "max" : {
>          "<database>" : "<value>"
>       },
>       "lastmod" : Timestamp(1000, 1),
>       "lastmodEpoch" : ObjectId(<...>)
>    },
>    "right" : {
>       "min" : {
>          "<database>" : "<value>"
>       },
>       "max" : {
>          "<database>" : { $maxKey : 1 }
>       },
>       "lastmod" : Timestamp(1000, 2),
>       "lastmodEpoch" : ObjectId("<...>")
>    },
>    "owningShard" : "<value>"
> }
>}
>```



中的每个文档`changelog`集合包含以下字段：

- `config.changelog._id`

  `changelog._id`的值为 `<hostname>-<timestamp>-<increment>`。

- `config.changelog.server`

  保存此数据的服务器的主机名。

- `config.changelog.clientAddr`

  保存客户端地址的字符串， 即启动此更改的`mongos`实例。

- `config.changelog.time`

  反映更改发生时间的ISODate时间戳。

- `config.changelog.what`

  反映记录的更改类型。可能的值包括：

  `dropCollection`

  `dropCollection.start`

  `dropDatabase`

  `dropDatabase.start`

  `moveChunk.start`

  `moveChunk.commit`

  `split`

  `multi-split`

- `config.changelog.ns`

  发生更改的命名空间。

- `config.changelog.details`

  包含有关更改的其他详细信息的文档。 详细信息文档的结构取决于更改的类型。

`config.chunks`

>
>
>## 提示
>
>### 内部 MongoDB 元数据
>
>配置数据库是内部的：应用程序和管理员不应在正常操作过程中修改或依赖其内容。



这`chunks`为集群中的每个块存储一个文档。考虑以下名为`mydb.foo-a_\"cat\"` 的块的文档示例：

```shell
{
   "_id" : "mydb.foo-a_\"cat\"",
   "lastmod" : Timestamp(2, 1),
   "uuid": "c025d039-e626-435e-b2d2-c1d436038041",
   "min" : {
         "animal" : "cat"
   },
   "max" : {
         "animal" : "dog"
   },
   "shard" : "shard0004",
   "history" : [ { "validAfter" : Timestamp(1569368571, 27), "shard" : "shard0004" } ]
}
```



`min`这些文档在和字段中存储描述块的分片键的值范围`max`。此外，该`shard`字段标识集群中“拥有”该块的分片。

`config.collections`

>
>
>## 提示
>
>### 内部 MongoDB 元数据
>
>配置数据库是内部的：应用程序和管理员不应在正常操作过程中修改或依赖其内容。



`collections`集合 为集群中的每个分片集合存储一个文档。`pets` 给定一个在数据库中命名的集合`records`，在`collections` 集合将类似于以下内容：

```
{
   "_id" : "records.pets",
   "lastmod" : ISODate("2021-07-21T15:48:15.193Z"),
   "timestamp": Timestamp(1626882495, 1),
   "key" : {
         "a" : 1
   },
   "unique" : false,
   "lastmodEpoch" : ObjectId("5078407bd58b175c5c225fdc"),
   "uuid" :  UUID("f8669e52-5c1b-4ea2-bbdc-a00189b341da")
}
```

`config.databases`



>## 提示
>
>### 内部 MongoDB 元数据
>
>配置数据库是内部的：应用程序和管理员不应在正常操作过程中修改或依赖其内容。



`databases`集合为集群中的每个数据库存储一个文档。

对于每个数据库，相应的文档显示名称、数据库的主分片]、数据库的分片启用状态和版本。

```shell
{ "_id" : "test", "primary" : "shardA", "partitioned" : true, "version" : { "uuid" : UUID("516a5f79-5eb9-4844-8ee9-b8e9de91b760"), "timestamp" : Timestamp(1626894204, 1), "lastMod" : 1 } }
{ "_id" : "hr", "primary" : "shardA", "partitioned" : false, "version" : { "uuid" : UUID("8e39d61d-6259-4c33-a5ed-bcd2ae317b6f"), "timestamp" : Timestamp(1626895015, 1), "lastMod" : 1 } }
{ "_id" : "reporting", "primary" : "shardB", "partitioned" : false, "version" : { "uuid" : UUID("07c63242-51b3-460c-865f-a67b3372d792"), "timestamp" : Timestamp(1626895826, 1), "lastMod" : 1 } }
```



该方法`sh.status()`在数据库部分返回此信息。

`config.lockpings`



>## 提示
>
>### 内部 MongoDB 元数据
>
>这配置数据库是内部的：应用程序和管理员不应在正常操作过程中修改或依赖其内容。



这`lockpings`collection 跟踪分片集群中的活动组件。给定一个正在运行的`mongos` 集群`example.com:30000`，文档在 `lockpings`集合将类似于：

```shell
{ "_id" : "example.com:30000:1350047994:16807", "ping" : ISODate("2012-10-12T18:32:54.892Z") }
```

`config.locks`



>## 提示
>
>### 内部 MongoDB 元数据
>
>这配置数据库是内部的：应用程序和管理员不应在正常操作过程中修改或依赖其内容。



这`locks`集合存储分布式锁。配置服务器副本集的主节点通过向集合中插入文档来锁定`locks` 。

```shell
{
   "_id" : "test.myShardedCollection",
   "state" : 2,
   "process" : "ConfigServer",
   "ts" : ObjectId("5be0b9ede46e4f441a60d891"),
   "when" : ISODate("2018-11-05T21:52:00.846Z"),
   "who" : "ConfigServer:Balancer",
   "why" : "Migrating chunk(s) in collection test.myShardedCollection"
}
```



从 3.4 版开始，该`state`字段将始终具有一个值 `2`，以防止任何遗留`mongos`实例执行平衡操作。该`when`字段指定配置服务器节点成为主要节点的时间。

在 3.4 版本中，当平衡器处于活动状态时，平衡器会获取锁，如下面的 3.4 示例所示：

```shell
{
   "_id" : "balancer",
   "state" : 2,
   "ts" : ObjectId("5be0bc6cb20effa83b15baa8"),
   "who" : "ConfigServer:Balancer",
   "process" : "ConfigServer",
   "when" : ISODate("2018-11-05T21:56:13.096Z"),
   "why" : "CSRS Balancer"
}
```



从 3.6 版本开始，平衡器不再需要“锁”。如果您已从 3.4 升级到 3.6，您可以选择删除任何残留`"_id" : "balancer"`文件。

`config.migrationCoordinators`

*4.4版中的新功能*。

`migrationCoordinators` 集合存在于每个分片上，并为从该分片到另一个分片的每个正在进行的块迁移存储一个文档。如果无法将文档写入分片副本集的大多数节点，则块迁移将失败。

迁移完成后，描述迁移的文档将从集合中删除。

`config.mongos`



>## 提示
>
>### 内部 MongoDB 元数据
>
>这配置数据库是内部的：应用程序和管理员不应在正常操作过程中修改或依赖其内容。



`mongos`为隶属于集群的每个`mongos`实例存储一个文档 。集群出于报告目的维护此集合。

中的每个文档`mongos`集合包含以下字段：

| 场地                | 数据类型         | 描述                                                         |
| :------------------ | :--------------- | :----------------------------------------------------------- |
| `_id`               | String           | `mongos`运行的主机名和端口 。`_id`格式为 `<hostname>:<port>`. |
| `advisoryHostFQDNs` | Array of strings | `mongos`的完全限定域名 (FQDN)的数组。                        |
| `created`           | Date             | 启动`mongos`。*5.2版中的新功能*。                            |
| `mongoVersion`      | String           | 正在运行的`mongos`的MongoDB 版本。                           |
| `ping`              | Date             | `mongos`实例每 30 秒向 配置服务器发送一次 ping 。该字段表示最后一次 ping 时间。 |
| `up`                | NumberLong       | `mongos`截至上次 ping 已启动的秒数。                         |
| `waiting`           | Boolean          | 从 MongoDB 3.4 开始，这个字段总是存在`true`并且只是为了向后兼容。 |

下面的文档显示了正在运行在`example.com:27017`的`mongos`的状态。

```shell
[
   {
     _id: 'example.com:27017',
     advisoryHostFQDNs: [ "example.com" ],
     created: ISODate("2021-11-22T16:32:13.708Z"),
     mongoVersion: "5.2.0",
     ping: ISODate("2021-12-15T22:09:23.161Z"),
     up: Long("2007429"),
     waiting: true
   }
]
```

`config.rangeDeletions`

`rangeDeletions`集合存在于每个分片上，并为包含孤立文档的每个块范围存储一个文档。如果无法将文档写入分片副本集的大多数成员，则块迁移将失败。

当孤立的块范围被清除时，描述该范围的文档将从集合中删除。

`config.settings`



>## 提示
>
>### 内部 MongoDB 元数据
>
>这配置数据库是内部的：应用程序和管理员不应在正常操作过程中修改或依赖其内容。



这`settings`集合包含以下分片配置设置：

- 范围大小。要更改范围大小，请参阅修改分片集群中的范围大小。指定的`chunksize`值以兆字节为单位。

- 平衡器设置。要更改平衡器设置，包括平衡器状态，请参阅 管理分片集群平衡器。

- 自动拆分：

  从 MongoDB 6.0.3 开始，不执行自动分块。这是因为平衡政策的改进。自动拆分命令仍然存在，但不执行操作。有关详细信息，请参阅 平衡策略更改。

  在 6.0 之前的 MongoDB 版本中：

  - `balancerStart`还为分片集群启用自动拆分。
  - `balancerStop`还禁用分片集群的自动拆分。
  - 要启用或禁用自动拆分标志，请使用相应的 `sh.enableAutoSplit()`方法或 `sh.disableAutoSplit()`方法。

集合中的示例文档`settings`：

```shell
{ "_id" : "chunksize", "value" : 64 }
{ "_id" : "balancer", "mode" : "full", "stopped" : false }
```

`config.shards`



>## 提示
>
>### 内部 MongoDB 元数据
>
>这配置数据库是内部的：应用程序和管理员不应在正常操作过程中修改或依赖其内容。



`shards`在单独的文档中表示集群中的每个分片，如下所示：

```shell
{ "_id" : "shard0000", "host" : "localhost:30000", "state" : 1 }
```



如果分片是副本集，则该 `host`字段显示副本集的名称，然后是斜杠，然后是副本集每个节点的主机名的逗号分隔列表，如以下示例所示：

```shell
{ "_id" : "shard0001", "host" : "shard0001/localhost:27018,localhost:27019,localhost:27020", "state" : 1 }
```



如果分片分配了区域，则此文档有一个`tags`字段，其中包含分配给它的区域数组，如以下示例所示：

```shell
{ "_id" : "shard0002", "host" : "localhost:30002", "state" : 1, "tags": [ "NYC" ] }
```

`config.tags`



>## 提示
>
>### 内部 MongoDB 元数据
>
>这配置数据库是内部的：应用程序和管理员不应在正常操作过程中修改或依赖其内容。



`tags`集合保存集群中每个区域范围的文档。文件中的 `tags`集合类似于以下内容：

```shell
{
    "_id" : { "ns" : "records.users", "min" : { "zipcode" : "10001" } },
    "ns" : "records.users",
    "min" : { "zipcode" : "10001" },
    "max" : { "zipcode" : "10281" },
    "tag" : "NYC"
}
```

`config.version`



>## 提示
>
>### 内部 MongoDB 元数据
>
>这配置数据库是内部的：应用程序和管理员不应在正常操作过程中修改或依赖其内容。



`version`collection 保存当前的元数据版本号。该集合仅包含一个文档。例如：

```shell
{ "_id" : 1, "minCompatibleVersion" : 5, "currentVersion" : 6, "clusterId" : ObjectId("5d8bc01a690d8abbd2014ddd") }
```



访问`version`集合，必须使用 `db.getCollection()`方法。例如，要检索集合的文档：

```shell
db.getCollection("version").find()
```

## 支持会议的收藏品

从 MongoDB 3.6 开始，`config`数据库包含 *内部*集合以支持独立、副本集和分片集群的因果一致会话以及副本集和分片集群的可重试写入和事务。



>## 警告
>
>不要手动修改或删除这些集合。

要访问一个`mongod`或 `mongos`实例的这些集合，请使用mongosh连接到实例。

`config.system.sessions`

该`system.sessions`集合存储可供部署的所有节点使用的会话记录。

当用户在`mongod`或 `mongos`实例上创建会话时，会话的记录最初仅存在于实例的内存中。实例会定期将其缓存的会话同步到`system.sessions`集合；届时，部署的所有成员都可以看到它们。

要查看`system.sessions`集合中的记录，请使用 `$listSessions`。



>警告
>
>不要手动修改或删除`system.sessions`集合。



在分片集群中，`system.sessions`集合被分片。将分片添加到分片集群时，如果要添加的分片已经包含自己的`system.sessions`集合，MongoDB 会在添加过程中删除新分片的`system.sessions`集合。

从版本 4.4（和 4.2.7）开始，MongoDB 自动将`system.sessions`集合拆分为至少 1024 个块，并将块均匀分布在集群中的分片中。

`config.transactions`

该`transactions`集合存储用于支持 副本集和分片集群的可重试写入、和事务的记录。



>## 警告
>
>不要手动修改或删除`transactions`集合。



原文 -  https://docs.mongodb.com/manual/reference/config-database/ 

译者：陆文龙

