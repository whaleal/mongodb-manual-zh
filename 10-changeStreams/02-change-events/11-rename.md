## `rename`事件

### 概括

`rename`

*4.0.1版本中的新增功能*。

`rename`重命名集合时会发生事件。

### 描述

| Field                               | 类型                                                         | 描述                                                         |
| :---------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `_id`                               | Document                                                     | 一个[BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON)对象，用作更改流事件的标识符。该值用作恢复更改流时的参数`resumeToken` 。`resumeAfter`该`_id`对象具有以下形式：`{   "_data" : <BinData|hex string>}`该`_data`类型取决于 MongoDB 版本，在某些情况下，还取决于更改流打开或恢复时的[功能兼容性版本 (fCV) 。](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)有关类型的完整列表，请参阅[恢复令牌](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume-token)`_data`。有关通过 恢复更改流的示例`resumeToken`，请参阅 [恢复更改流。](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume) |
| `clusterTime`                       | Timestamp                                                    | 与事件关联的 oplog 条目的时间戳。与 [多文档事务](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions)关联的更改流事件通知 都具有相同的`clusterTime`值：提交事务的时间。在分片集群上，具有相同事件的事件`clusterTime`可能并不都与同一事务相关。有些事件与交易根本无关。要识别单个事务的事件，您可以在变更流事件文档中使用`lsid`和的组合。`txnNumber`*4.0版本中的新功能*。 |
| `collectionUUID`                    | UUID                                                         | UUID标识发生更改的集合。*6.0版本中的新内容*。                |
| `lsid`                              | document                                                     | 与事务关联的会话的标识符。仅当操作是[多文档事务的一部分时才出现。](https://www.mongodb.com/docs/manual/core/transactions/)*4.0版本中的新功能*。 |
| `ns`                                | document                                                     | 受事件影响的命名空间（数据库和/或集合）。                    |
| `ns.db`                             | string                                                       | 发生事件的数据库的名称。                                     |
| `ns.coll`                           | string                                                       | 发生事件的集合的名称。                                       |
| `operationDescription`              | document                                                     | 有关更改操作的附加信息。仅当更改流使用 [扩展事件时，此文档及其子字段才会出现。](https://www.mongodb.com/docs/manual/reference/change-events/#std-label-change-streams-expanded-events)*6.0版本中的新内容*。 |
| `operationDescription.``dropTarget` | UUID                                                         | 在重命名操作中删除的集合的UUID 。*6.0版本中的新内容*。       |
| `operationDescription.``to`         | document                                                     | 重命名后集合的新命名空间。*6.0版本中的新内容*。              |
| `operationDescription.``to.coll`    | document                                                     | 重命名后集合的新名称。*6.0版本中的新内容*。                  |
| `operationDescription.``to.db`      | document                                                     | 重命名后数据库的新名称。*6.0版本中的新内容*。                |
| `operationType`                     | string                                                       | 更改通知报告的操作类型。`rename`返回这些更改事件的值。       |
| `to`                                | document                                                     | 重命名后集合的新命名空间。                                   |
| `to.coll`                           | document                                                     | 重命名后集合的新名称。                                       |
| `to.db`                             | document                                                     | 重命名后数据库的新名称。                                     |
| `txnNumber`                         | NumberLong                                                   | 与[LSID](https://www.mongodb.com/docs/manual/reference/change-events/rename/#std-label--idref--lsid)，一个有助于唯一标识交易的数字。仅当操作是[多文档事务的一部分时才出现。](https://www.mongodb.com/docs/manual/core/transactions/)*4.0版本中的新功能*。 |
| `wallTime`                          | [ISODate](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-ISODate) | 数据库操作的服务器日期和时间。`wallTime` 不同之处`clusterTime`在于，`clusterTime`时间戳是从与数据库操作事件关联的 oplog 条目中获取的。*6.0版本中的新内容*。 |

### 行为

#### 扩展活动信息

*在6.0版本中进行了更改*。

从 MongoDB 6.0 开始，当更改流的[showExpandedEvents](https://www.mongodb.com/docs/manual/reference/change-events/#std-label-change-streams-expanded-events)选项设置为时，事件包含一个文档。本文档提供了一个显示更改的数据库和集合的字段，以及一个指示 操作是否在重命名之前删除集合的字段。`true``rename``operationDescription``to``dropTarget``rename`

### 例子

以下示例说明了一个`rename`事件：

```
{
   "_id": { <Resume Token> },
   "operationType": "rename",
   "clusterTime": <Timestamp>,
   "wallTime": <ISODate>,
   "ns": {
      "db": "engineering",
      "coll": "users"
   },
   "to": {
      "db": "engineering",
      "coll": "people"
   },
   "operationDescription": {
      "to": {
         "db": "engineering",
         "coll": "people"
      }
   }
}
```

事件`rename`会导致 针对其集合或集合打开的更改流[的无效事件](https://www.mongodb.com/docs/manual/reference/change-events/invalidate/#std-label-change-event-invalidate)。`ns``to`





参见

原文 - [rename Event](https://www.mongodb.com/docs/manual/reference/change-events/rename/)

