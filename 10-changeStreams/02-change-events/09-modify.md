## `modify`事件

### 概括

**modify**

*6.0版本中的新内容*。

修改集合时会发生事件`modify`，例如当 [`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令在集合或视图中添加或删除选项时。仅当更改流的 [showExpandedEvents](https://www.mongodb.com/docs/manual/reference/change-events/#std-label-change-streams-expanded-events)选项设置为 时才会收到此事件`true`。

> 笔记:
>
> 要了解有关更新单个文档时发生的事件的更多信息，请参阅该update事件。

### 描述

| Field                                   | 类型                                                         | 描述                                                         |
| :-------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `_id`                                   | Document                                                     | 一个[BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON)对象，用作更改流事件的标识符。该值用作恢复更改流时的参数`resumeToken` 。`resumeAfter`该`_id`对象具有以下形式：`{   "_data" : <BinData|hex string>}`该`_data`类型取决于 MongoDB 版本，在某些情况下，还取决于更改流打开或恢复时的[功能兼容性版本 (fCV) 。](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)有关类型的完整列表，请参阅[恢复令牌](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume-token)`_data`。有关通过 恢复更改流的示例`resumeToken`，请参阅 [恢复更改流。](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume) |
| `clusterTime`                           | Timestamp                                                    | 与事件关联的 oplog 条目的时间戳。与 [多文档事务](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions)关联的更改流事件通知 都具有相同的`clusterTime`值：提交事务的时间。在分片集群上，具有相同事件的事件`clusterTime`可能并不都与同一事务相关。有些事件与交易根本无关。要识别单个事务的事件，您可以在变更流事件文档中使用`lsid`和的组合。`txnNumber`*4.0版本中的新功能*。 |
| `collectionUUID`                        | UUID                                                         | UUID标识发生更改的集合。*6.0版本中的新内容*。                |
| `lsid`                                  | document                                                     | 与事务关联的会话的标识符。仅当操作是[多文档事务的一部分时才出现。](https://www.mongodb.com/docs/manual/core/transactions/)*4.0版本中的新功能*。 |
| `ns`                                    | document                                                     | 受事件影响的命名空间（数据库和/或集合）。                    |
| `ns.db`                                 | string                                                       | 发生事件的数据库的名称。                                     |
| `ns.coll`                               | string                                                       | 发生事件的集合的名称。                                       |
| `operationDescription`                  | document                                                     | 有关更改操作的附加信息。仅当更改流使用 [扩展事件时，此文档及其子字段才会出现。](https://www.mongodb.com/docs/manual/reference/change-events/#std-label-change-streams-expanded-events)*6.0版本中的新内容*。 |
| `operationDescription.``index`          | document                                                     | 被修改的索引。*6.0版本中的新内容*。                          |
| `operationDescription.``indexes`        | array                                                        | 列出由操作更改的索引的文档数组。                             |
| `operationType`                         | string                                                       | 更改通知报告的操作类型。`modify`返回这些更改事件的值。       |
| `stateBeforeChange`                     | document                                                     | 文档显示操作更改之前的集合和索引选项。                       |
| `stateBeforeChange.``collectionOptions` | document                                                     | 文档显示操作更改之前的集合选项。                             |
| `stateBeforeChange.``indexOptions`      | document                                                     | 文档显示操作更改之前的索引选项。                             |
| `txnNumber`                             | NumberLong                                                   | 与[LSID](https://www.mongodb.com/docs/manual/reference/change-events/modify/#std-label--idref--lsid)，一个有助于唯一标识交易的数字。仅当操作是[多文档事务的一部分时才出现。](https://www.mongodb.com/docs/manual/core/transactions/)*4.0版本中的新功能*。 |
| `wallTime`                              | [ ISODate](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-ISODate) | 数据库操作的服务器日期和时间。`wallTime` 不同之处`clusterTime`在于，`clusterTime`时间戳是从与数据库操作事件关联的 oplog 条目中获取的。*6.0版本中的新内容*。 |

### 例子

以下示例显示了一个`modify`事件：

```
{
   "_id": { <ResumeToken> },
   "operationType": "modify",
   "clusterTime": Timestamp({ t: 1654878543, i: 1 }),
   "collectionUUID": UUID("47d6baac-eeaa-488b-98ae-893f3abaaf25"),
   "wallTime": ISODate("2022-06-10T16:29:03.704Z"),
   "ns": {
      "db": "test",
      "coll": "authors" },
   "operationDescription": {
      "index": {
         "name": "age_1",
         "hidden": true
      }
   },
   "stateBeforeChange": {
      "collectionOptions": {
          "uuid": UUID("47d6baac-eeaa-488b-98ae-893f3abaaf25")
      },
      "indexOptions": {
         "hidden": false
      }
   }
}
```





参见

原文 - [modify Event](https://www.mongodb.com/docs/manual/reference/change-events/modify/)

