# invalidate

### 概括

`invalidate`

​	`invalidate`当操作使更改流无效时，就会发生事件。例如，在集合上打开的更改流后来被删除或重命名将导致事件`invalidate`。

### 描述

| Field           | 类型                                                         | 描述                                                         |
| :-------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `_id`           | Document                                                     | 一个[BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON)对象，用作更改流事件的标识符。该值用作恢复更改流时的参数`resumeToken` 。`resumeAfter`该`_id`对象具有以下形式：`{   "_data" : <BinData|hex string>}`该`_data`类型取决于 MongoDB 版本，在某些情况下，还取决于更改流打开或恢复时的[功能兼容性版本 (fCV) 。](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)有关类型的完整列表，请参阅[恢复令牌](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume-token)`_data`。有关通过 恢复更改流的示例`resumeToken`，请参阅 [恢复更改流。](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume) |
| `clusterTime`   | Timestamp                                                    | 与事件关联的 oplog 条目的时间戳。与 [多文档事务](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions)关联的更改流事件通知 都具有相同的`clusterTime`值：提交事务的时间。在分片集群上，具有相同事件的事件`clusterTime`可能并不都与同一事务相关。有些事件与交易根本无关。要识别单个事务的事件，您可以在变更流事件文档中使用`lsid`和的组合。`txnNumber`*4.0版本中的新功能*。 |
| `operationType` | string                                                       | 更改通知报告的操作类型。`invalidate`返回这些更改事件的值。   |
| `wallTime`      | [ ISODate](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-ISODate) | 数据库操作的服务器日期和时间。`wallTime` 不同之处`clusterTime`在于，`clusterTime`时间戳是从与数据库操作事件关联的 oplog 条目中获取的。*6.0版本中的新内容*。 |

### 例子

以下示例说明了一个`invalidate`事件：

```
{
   "_id": { <Resume Token> },
   "operationType": "invalidate",
   "clusterTime": <Timestamp>,
   "wallTime": <ISODate>
}

```

当发生影响监视集合的[drop](https://www.mongodb.com/docs/manual/reference/change-events/drop/#std-label-change-event-drop)、[rename](https://www.mongodb.com/docs/manual/reference/change-events/rename/#std-label-change-event-rename)或[dropDatabase](https://www.mongodb.com/docs/manual/reference/change-events/dropDatabase/#std-label-change-event-dropDatabase)操作时，在集合上打开的更改流会引发一个`invalidate`事件 。

当发生影响所监视数据库的[dropDatabase](https://www.mongodb.com/docs/manual/reference/change-events/dropDatabase/#std-label-change-event-dropDatabase)事件时，在数据库上打开的更改流会引发一个`invalidate`事件 。

`invalidate`事件关闭更改流光标。

您不能`resumeAfter`在更改流之后使用它来恢复更改流 [使事件无效](https://www.mongodb.com/docs/manual/reference/change-events/invalidate/#std-label-change-event-invalidate)（例如，集合删除或重命名）关闭流。从 MongoDB 4.2 开始，您可以使用 [startAfter](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-start-after)在某个更改之后启动一个新的更改流[使事件无效。](https://www.mongodb.com/docs/manual/reference/change-events/invalidate/#std-label-change-event-invalidate)







参见

原文 - [invalidate](https://www.mongodb.com/docs/manual/reference/change-events/invalidate/ )

