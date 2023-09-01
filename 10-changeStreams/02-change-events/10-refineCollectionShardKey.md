### FineCollectionShardKey 事件

### 概括

`refineCollectionShardKey`

*6.0版本中的新内容*。

`refineCollectionShardKey`当集合的分片键被修改时，就会发生事件。

### 描述

| 场地                                 | 类型      | 描述                                                         |
| :----------------------------------- | :-------- | :----------------------------------------------------------- |
| `_id`                                | Document  | 一个[BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON)对象，用作更改流事件的标识符。该值用作恢复更改流时的参数`resumeToken` 。`resumeAfter`该`_id`对象具有以下形式：`{   "_data" : <BinData|hex string>}`该`_data`类型取决于 MongoDB 版本，在某些情况下，还取决于更改流打开或恢复时的[功能兼容性版本 (fCV) 。](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)有关类型的完整列表，请参阅[恢复令牌](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume-token)`_data`。有关通过 恢复更改流的示例`resumeToken`，请参阅 [恢复更改流。](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume) |
| `clusterTime`                        | Timestamp | 与事件关联的 oplog 条目的时间戳。与 [多文档事务](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions)关联的更改流事件通知 都具有相同的`clusterTime`值：提交事务的时间。在分片集群上，具有相同事件的事件`clusterTime`可能并不都与同一事务相关。有些事件与交易根本无关。要识别单个事务的事件，您可以在变更流事件文档中使用`lsid`和的组合。`txnNumber`*4.0版本中的新功能*。 |
| `collectionUUID`                     | UUID      | UUID标识发生更改的集合。*6.0版本中的新内容*。                |
| `ns`                                 | Document  | 受事件影响的命名空间（数据库和/或集合）。                    |
| `ns.coll`                            | String    | 发生事件的集合的名称。                                       |
| `ns.db`                              | String    | 发生事件的数据库的名称。                                     |
| `operationDescription`               | Document  | 有关更改操作的附加信息。仅当更改流使用 [扩展事件时，此文档及其子字段才会出现。](https://www.mongodb.com/docs/manual/reference/change-events/#std-label-change-streams-expanded-events)*6.0版本中的新内容*。 |
| `operationDescription.``shardKey`    | Document  | 发生更改的集合的[分片键](https://www.mongodb.com/docs/manual/core/sharding-shard-key/#std-label-shard-key)。*6.0版本中的新内容*。 |
| `operationDescription.``oldShardKey` | Document  | 已更改集合的[分片键](https://www.mongodb.com/docs/manual/core/sharding-shard-key/#std-label-shard-key)。*6.1版本中的新增内容*。 |

### 例子

以下示例显示了一个`refineCollectionShardKey`事件：

```
{
   "_id": { <ResumeToken> },
   "operationType": "refineCollectionShardKey",
   "clusterTime": Timestamp({ t: 1654894852, i: 52 }),
   "collectionUUID": UUID("98046a1a-b649-4e5b-9c75-67594221ce19"),
   "ns": {"db": "reshard_collection_event", "coll": "coll"},
   "operationDescription": {
     "shardKey": {"_id": 1, akey: 1},
     "oldShardKey": {"_id": 1}
   }
}
```



参见

原文 - [refineCollectionShardKey Event](https://www.mongodb.com/docs/manual/reference/change-events/refineCollectionShardKey/)

