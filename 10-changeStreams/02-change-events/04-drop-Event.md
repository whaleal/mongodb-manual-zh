## drop 事件

### 概要

`drop`

*4.0.1版本中的新增功能*。

`drop`从数据库中删除集合时会发生事件。

### 描述

| 场地             | 类型                                                         | 描述                                                         |
| :--------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `_id`            | Document                                                     | 一个[BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON)对象，用作更改流事件的标识符。该值用作恢复更改流时的参数`resumeToken` 。`resumeAfter`该`_id`对象具有以下形式：`{   "_data" : <BinData|hex string>}`该`_data`类型取决于 MongoDB 版本，在某些情况下，还取决于更改流打开或恢复时的[功能兼容性版本 (fCV) 。](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)有关类型的完整列表，请参阅[恢复令牌](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume-token)`_data`。有关通过 恢复更改流的示例`resumeToken`，请参阅 [恢复更改流。](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume) |
| `clusterTime`    | Timestamp                                                    | 与事件关联的 oplog 条目的时间戳。与 [多文档事务](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions)关联的更改流事件通知 都具有相同的`clusterTime`值：提交事务的时间。在分片集群上，具有相同事件的事件`clusterTime`可能并不都与同一事务相关。有些事件与交易根本无关。要识别单个事务的事件，您可以在变更流事件文档中使用`lsid`和的组合。`txnNumber`*4.0版本中的新功能*。 |
| `collectionUUID` | UUID                                                         | UUID标识发生更改的集合。*6.0版本中的新内容*。                |
| `lsid`           | document                                                     | 与事务关联的会话的标识符。仅当操作是[多文档事务的一部分时才出现。](https://www.mongodb.com/docs/manual/core/transactions/)*4.0版本中的新功能*。 |
| `ns`             | document                                                     | 受事件影响的命名空间（数据库和/或集合）。                    |
| `ns.coll`        | string                                                       | 发生事件的集合的名称。                                       |
| `ns.db`          | string                                                       | 发生事件的数据库的名称。                                     |
| `operationType`  | string                                                       | 更改通知报告的操作类型。`drop`返回这些更改事件的值。         |
| `txnNumber`      | NumberLong                                                   | 与[LSID](https://www.mongodb.com/docs/manual/reference/change-events/drop/#std-label--idref--lsid)，一个有助于唯一标识交易的数字。仅当操作是[多文档事务的一部分时才出现。](https://www.mongodb.com/docs/manual/core/transactions/)*4.0版本中的新功能*。 |
| `wallTime`       | [ ISODate](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-ISODate) | 数据库操作的服务器日期和时间。`wallTime` 不同之处`clusterTime`在于，`clusterTime`时间戳是从与数据库操作事件关联的 oplog 条目中获取的。*6.0版本中的新内容*。 |

### 例子

以下示例说明了一个`drop`事件：

```
{
   "_id": { <Resume Token> },
   "operationType": "drop",
   "clusterTime": <Timestamp>,
   "wallTime": <ISODate>,
   "ns": {
      "db": "engineering",
      "coll": "users"
   }
}
```



事件`drop`会导致[`invalidate`](https://www.mongodb.com/docs/manual/reference/change-events/invalidate/#mongodb-data-invalidate)针对其自己的`ns`集合打开的更改流的事件。





参见

原文 - [drop Event](https://www.mongodb.com/docs/manual/reference/change-events/drop/ )

