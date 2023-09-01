## 插入

### 概括

`insert`

​	`insert`当操作将文档添加到集合时，就会发生事件。

### 描述

| 场地             | 类型                                                         | 描述                                                         |
| :--------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `_id`            | Document                                                     | 一个[BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON)对象，用作更改流事件的标识符。该值用作恢复更改流时的参数`resumeToken` 。`resumeAfter`该`_id`对象具有以下形式：`{   "_data" : <BinData|hex string>}`该`_data`类型取决于 MongoDB 版本，在某些情况下，还取决于更改流打开或恢复时的[功能兼容性版本 (fCV) 。](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)有关类型的完整列表，请参阅[恢复令牌](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume-token)`_data`。有关通过 恢复更改流的示例`resumeToken`，请参阅 [恢复更改流。](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume) |
| `clusterTime`    | Timestamp                                                    | 与事件关联的 oplog 条目的时间戳。与 [多文档事务](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions)关联的更改流事件通知 都具有相同的`clusterTime`值：提交事务的时间。在分片集群上，具有相同事件的事件`clusterTime`可能并不都与同一事务相关。有些事件与交易根本无关。要识别单个事务的事件，您可以在变更流事件文档中使用`lsid`和的组合。`txnNumber`*4.0版本中的新功能*。 |
| `collectionUUID` | UUID                                                         | UUID标识发生更改的集合。*6.0版本中的新内容*。                |
| `documentKey`    | UUID                                                         | 包含由[CRUD](https://www.mongodb.com/docs/manual/crud/#std-label-crud)`_id`操作创建或修改的文档的值的文档。对于分片集合，此字段还显示文档的完整分片键。如果该`_id`字段已经是分片键的一部分，则不会重复。 |
| `fullDocument`   | document                                                     | 操作创建的文档。*在6.0版本中进行了更改*。从 MongoDB 6.0 开始，如果您`changeStreamPreAndPostImages`使用 、 或 来设置该选项[`db.createCollection()`](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection)，[`create`](https://www.mongodb.com/docs/manual/reference/command/create/#mongodb-dbcommand-dbcmd.create)则 [`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)该`fullDocument`字段将显示插入、替换或更新后的文档（文档后图像）。 `fullDocument`始终包含在`insert`活动中。 |
| `lsid`           | document                                                     | 与事务关联的会话的标识符。仅当操作是[多文档事务的一部分时才出现。](https://www.mongodb.com/docs/manual/core/transactions/)*4.0版本中的新功能*。 |
| `ns`             | document                                                     | 受事件影响的命名空间（数据库和/或集合）。                    |
| `ns.coll`        | string                                                       | 发生事件的集合的名称。                                       |
| `ns.db`          | string                                                       | 发生事件的数据库的名称。                                     |
| `operationType`  | string                                                       | 更改通知报告的操作类型。`insert`返回这些更改事件的值。       |
| `txnNumber`      | NumberLong                                                   | 与[LSID](https://www.mongodb.com/docs/manual/reference/change-events/insert/#std-label--idref--lsid)，一个有助于唯一标识交易的数字。仅当操作是[多文档事务的一部分时才出现。](https://www.mongodb.com/docs/manual/core/transactions/)*4.0版本中的新功能*。 |
| `wallTime`       | [ISO日期](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-ISODate) | 数据库操作的服务器日期和时间。`wallTime` 不同之处`clusterTime`在于，`clusterTime`时间戳是从与数据库操作事件关联的 oplog 条目中获取的。*6.0版本中的新内容*。 |

###  例子

以下示例说明了一个`insert`事件：

```
{
   "_id": { <Resume Token> },
   "operationType": "insert",
   "clusterTime": <Timestamp>,
   "wallTime": <ISODate>,
   "ns": {
      "db": "engineering",
      "coll": "users"
   },
   "documentKey": {
      "userName": "alice123",
      "_id": ObjectId("599af247bb69cd89961c986d")
   },
   "fullDocument": {
      "_id": ObjectId("599af247bb69cd89961c986d"),
      "userName": "alice123",
      "name": "Alice"
   }
```

该`documentKey`字段包括`_id`和`userName` 字段。这表明该`engineering.users`集合已分片，分片键为`userName`和`_id`。

该`fullDocument`文档代表插入时文档的版本。





参见

原文 - [insert](https://www.mongodb.com/docs/manual/reference/change-events/insert/ )

