## `shardCollection`事件

### 概括

`shardCollection`

*6.0版本中的新内容*。`shardCollection`当集合被分片时会发生一个事件。

### 描述

| Field                                        | 类型                                                         | 描述                                                         |
| :------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `_id`                                        | Document                                                     | 一个[BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON)对象，用作更改流事件的标识符。该值用作恢复更改流时的参数`resumeToken` 。`resumeAfter`该`_id`对象具有以下形式：`{   "_data" : <BinData|hex string>}`该`_data`类型取决于 MongoDB 版本，在某些情况下，还取决于更改流打开或恢复时的[功能兼容性版本 (fCV) 。](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)有关类型的完整列表，请参阅[恢复令牌](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume-token)`_data`。有关通过 恢复更改流的示例`resumeToken`，请参阅 [恢复更改流。](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume) |
| `clusterTime`                                | Timestamp                                                    | 与事件关联的 oplog 条目的时间戳。与 [多文档事务](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions)关联的更改流事件通知 都具有相同的`clusterTime`值：提交事务的时间。在分片集群上，具有相同事件的事件`clusterTime`可能并不都与同一事务相关。有些事件与交易根本无关。要识别单个事务的事件，您可以在变更流事件文档中使用`lsid`和的组合。`txnNumber`*4.0版本中的新功能*。 |
| `collectionUUID`                             | UUID                                                         | UUID标识发生更改的集合。*6.0版本中的新内容*。                |
| `lsid`                                       | document                                                     | 与事务关联的会话的标识符。仅当操作是[多文档事务的一部分时才出现。](https://www.mongodb.com/docs/manual/core/transactions/)*4.0版本中的新功能*。 |
| `ns`                                         | document                                                     | 受事件影响的命名空间（数据库和/或集合）。                    |
| `ns.coll`                                    | string                                                       | 发生事件的集合的名称。                                       |
| `ns.db`                                      | string                                                       | 发生事件的数据库的名称。                                     |
| `operationDescription`                       | document                                                     | 有关更改操作的附加信息。仅当更改流使用 [扩展事件时，此文档及其子字段才会出现。](https://www.mongodb.com/docs/manual/reference/change-events/#std-label-change-streams-expanded-events)*6.0版本中的新内容*。 |
| `operationDescription.``numInitialChunks`    | long                                                         | 操作期间在每个分片上创建的块数[`shardCollection`](https://www.mongodb.com/docs/manual/reference/command/shardCollection/#mongodb-dbcommand-dbcmd.shardCollection) 。*6.0版本中的新内容*。 |
| `operationDescription.``presplitHashedZones` | boolean                                                      | 指示当集合被分片时，分片块是否根据区域进行[预分割。](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#std-label-method-shard-collection-presplitHashedZones)*6.0版本中的新内容*。 |
| `operationDescription.``shardKey`            | document                                                     | 发生更改的集合的[分片键](https://www.mongodb.com/docs/manual/core/sharding-shard-key/#std-label-shard-key)。*6.0版本中的新内容*。 |
| `operationDescription.``unique`              | boolean                                                      | 如果集合是使用唯一的分片键分片的，则其值为 true。*6.0版本中的新内容*。 |
| `operationType`                              | string                                                       | 更改通知报告的操作类型。`shardCollection`返回这些更改事件的值。 |
| `txnNumber`                                  | NumberLong                                                   | 与[LSID](https://www.mongodb.com/docs/manual/reference/change-events/shardCollection/#std-label--idref--lsid)，一个有助于唯一标识交易的数字。仅当操作是[多文档事务的一部分时才出现。](https://www.mongodb.com/docs/manual/core/transactions/)*4.0版本中的新功能*。 |
| `wallTime`                                   | [ ISODate](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-ISODate) | 数据库操作的服务器日期和时间。`wallTime` 不同之处`clusterTime`在于，`clusterTime`时间戳是从与数据库操作事件关联的 oplog 条目中获取的。*6.0版本中的新内容*。 |

### 例子

以下示例显示了一个`shardCollection`事件：

```
{
   "_id": { <ResumeToken> },
   "operationType": "shardCollection",
   "clusterTime": Timestamp({ t: 1654894852, i: 52 }),
   "collectionUUID": UUID("98046a1a-b649-4e5b-9c75-67594221ce19"),
   "wallTime": ISODate("2022-06-10T21:00:52.854Z"),
   "ns": {
      "db": "test",
      "coll": "authors"
   },
   "operationDescription": {
      "shardKey": { "age": "hashed" },
      "unique": false,
      "numInitialChunks": Long("0"),
      "presplitHashedZones": false
   }
}
```





参见

原文 - [shardCollection Event](https://www.mongodb.com/docs/manual/reference/change-events/shardCollection/)

