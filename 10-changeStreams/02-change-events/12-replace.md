## `replace`事件

### 概括

`replace`

`replace`当更新操作从集合中删除文档并将其替换为新文档时（例如 [`replaceOne`](https://www.mongodb.com/docs/manual/reference/method/db.collection.replaceOne/#mongodb-method-db.collection.replaceOne)调用该方法时），就会发生事件。

### 描述

| 场地                       | 类型                                                         | 描述                                                         |
| :------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `_id`                      | Document                                                     | 一个[BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON)对象，用作更改流事件的标识符。该值用作恢复更改流时的参数`resumeToken` 。`resumeAfter`该`_id`对象具有以下形式：`{   "_data" : <BinData|hex string>}`该`_data`类型取决于 MongoDB 版本，在某些情况下，还取决于更改流打开或恢复时的[功能兼容性版本 (fCV) 。](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)有关类型的完整列表，请参阅[恢复令牌](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume-token)`_data`。有关通过 恢复更改流的示例`resumeToken`，请参阅 [恢复更改流。](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume) |
| `clusterTime`              | Timestamp                                                    | 与事件关联的 oplog 条目的时间戳。与 [多文档事务](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions)关联的更改流事件通知 都具有相同的`clusterTime`值：提交事务的时间。在分片集群上，具有相同事件的事件`clusterTime`可能并不都与同一事务相关。有些事件与交易根本无关。要识别单个事务的事件，您可以在变更流事件文档中使用`lsid`和的组合。`txnNumber`*4.0版本中的新功能*。 |
| `collectionUUID`           | UUID                                                         | UUID标识发生更改的集合。*6.0版本中的新内容*。                |
| `documentKey`              | document                                                     | 包含由[CRUD](https://www.mongodb.com/docs/manual/crud/#std-label-crud)`_id`操作创建或修改的文档的值的文档。对于分片集合，此字段还显示文档的完整分片键。如果该`_id`字段已经是分片键的一部分，则不会重复。 |
| `fullDocument`             | document                                                     | 操作创建的新文档。*在6.0版本中进行了更改*。从 MongoDB 6.0 开始，如果您`changeStreamPreAndPostImages`使用 、 或 来设置该选项[`db.createCollection()`](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection)，[`create`](https://www.mongodb.com/docs/manual/reference/command/create/#mongodb-dbcommand-dbcmd.create)则 [`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)该`fullDocument`字段将显示插入、替换或更新后的文档（文档后图像）。 `fullDocument`始终包含在`insert`活动中。 |
| `fullDocumentBeforeChange` | document                                                     | 操作应用更改之前的文档。即文档原像。当您使用方法或 或命令`changeStreamPreAndPostImages` 为集合启用该字段时，此字段可用。[`db.createCollection()`](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection)[`create`](https://www.mongodb.com/docs/manual/reference/command/create/#mongodb-dbcommand-dbcmd.create)[`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)*6.0版本中的新内容*。 |
| `lsid`                     | document                                                     | 与事务关联的会话的标识符。仅当操作是[多文档事务的一部分时才出现。](https://www.mongodb.com/docs/manual/core/transactions/)*4.0版本中的新功能*。 |
| `ns`                       | document                                                     | 受事件影响的命名空间（数据库和/或集合）。                    |
| `ns.coll`                  | string                                                       | 发生事件的集合的名称。                                       |
| `ns.db`                    | string                                                       | 发生事件的数据库的名称。                                     |
| `operationType`            | string                                                       | 更改通知报告的操作类型。`replace`返回这些更改事件的值。      |
| `txnNumber`                | NumberLong                                                   | 与[LSID](https://www.mongodb.com/docs/manual/reference/change-events/replace/#std-label--idref--lsid)，一个有助于唯一标识交易的数字。仅当操作是[多文档事务的一部分时才出现。](https://www.mongodb.com/docs/manual/core/transactions/)*4.0版本中的新功能*。 |
| `wallTime`                 | [ ISODate](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-ISODate) | 数据库操作的服务器日期和时间。`wallTime` 不同之处`clusterTime`在于，`clusterTime`时间戳是从与数据库操作事件关联的 oplog 条目中获取的。*6.0版本中的新内容*。 |

### 行为

### 记录前图像和后图像

从 MongoDB 6.0 开始，`fullDocumentBeforeChange` 如果执行以下步骤，您会看到包含更改（或删除）文档之前的字段的文档：

1. 使用、 或`changeStreamPreAndPostImages`为集合启用新字段[。](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)[`db.createCollection()`](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection)[`create`](https://www.mongodb.com/docs/manual/reference/command/create/#mongodb-dbcommand-dbcmd.create)[`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)
2. 设置`fullDocumentBeforeChange`为`"required"`或 `"whenAvailable"`中[`db.collection.watch()`。](https://www.mongodb.com/docs/manual/reference/method/db.collection.watch/#mongodb-method-db.collection.watch)

`fullDocumentBeforeChange`更改流输出中的示例文档：

```
"fullDocumentBeforeChange" : {
   "_id" : ObjectId("599af247bb69cd89961c986d"),
   "userName" : "alice123",
   "name" : "Alice Smith"
}
```

有关更改流输出的完整示例，请参阅 [使用文档前图像和后图像更改流。](https://www.mongodb.com/docs/manual/reference/method/db.collection.watch/#std-label-db.collection.watch-change-streams-pre-and-post-images-example)

如果图像是以下情况，则前图像和后图像不可用于[更改流事件：](https://www.mongodb.com/docs/manual/reference/change-events/#std-label-change-stream-output)

* 在文档更新或删除操作时未在集合上启用。

* 在 中设置的图像前和图像后保留时间后删除 `expireAfterSeconds`

  * 以下示例设置`expireAfterSeconds`为`100` 秒：

    ```
    use admin
    db.runCommand( {
       setClusterParameter:
          { changeStreamOptions: { preAndPostImages: { expireAfterSeconds: 100 } } }
    } )
    
    ```

  * 以下示例返回当前`changeStreamOptions` 设置，包括`expireAfterSeconds`：

    ```
    db.adminCommand( { getClusterParameter: "changeStreamOptions" } )
    ```

  * 设置`expireAfterSeconds`为`off`使用默认保留策略：保留前映像和后映像，直到从 oplog 中删除相应的更改流[事件。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-oplog)

  * 如果从 oplog 中删除更改流事件，则无论前映像和后映像`expireAfterSeconds`保留时间如何，相应的前映像和后映像也会被删除。

其他注意事项：

* 启用前图像和后图像会消耗存储空间并增加处理时间。仅在需要时才启用前像和后像。
* 将更改流事件大小限制为小于 16 MB。要限制事件大小，您可以：
  - 将文档大小限制为 8 MB。如果其他更改流事件字段 不大，您可以在[更改流输出](https://www.mongodb.com/docs/manual/reference/change-events/#std-label-change-stream-output)中同时请求前图像和后图像。`updateDescription`
  - `updateDescription`如果其他变更流事件字段（例如）不大，则仅请求变更流输出中最多 16 MB 的文档的后期图像 。
  - 如果满足以下条件，则仅请求变更流输出中最大 16 MB 的文档的原像：
    * 文档更新仅影响文档结构或内容的一小部分，*并且*
    * 不引起`replace`变更事件。事件`replace`总是包含后期图像。
* 要请求原像，您可以`fullDocumentBeforeChange`将 `required`或`whenAvailable`设置为[`db.collection.watch()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.watch/#mongodb-method-db.collection.watch)。要请求后图像，您可以`fullDocument`使用相同的方法进行设置。
* 原像被写入集合中`config.system.preimages`。
  - 该`config.system.preimages`集合可能会变得很大。要限制集合大小，您可以设置`expireAfterSeconds` 原像的时间，如前所示。
  - 原像由后台进程异步删除。

> 重要的:
>
> **向后不兼容的功能**
>
> 从 MongoDB 6.0 开始，如果您将文档前映像和后映像用于[更改流](https://www.mongodb.com/docs/manual/reference/change-events/#std-label-change-stream-output)，则必须 使用该命令为每个集合禁用[changeStreamPreAndPostImages](https://www.mongodb.com/docs/manual/reference/command/collMod/#std-label-collMod-change-stream-pre-and-post-images)[`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)，然后才能降级到早期 MongoDB 版本

> 提示: 
>
> **也可以看看：**
>
> - 有关更改流事件和输出，请参阅 [更改事件。](https://www.mongodb.com/docs/manual/reference/change-events/#std-label-change-stream-output)
> - 要观察集合的更改，请参阅 [`db.collection.watch()`。](https://www.mongodb.com/docs/manual/reference/method/db.collection.watch/#mongodb-method-db.collection.watch)
> - 有关更改流输出的完整示例，请参阅 [使用文档前图像和后图像更改流。](https://www.mongodb.com/docs/manual/reference/method/db.collection.watch/#std-label-db.collection.watch-change-streams-pre-and-post-images-example)

### 例子

以下示例说明了一个`replace`事件：

```
{
   "_id": { <Resume Token> },
   "operationType": "replace",
   "clusterTime": <Timestamp>,
   "wallTime": <ISODate>,
   "ns": {
      "db": "engineering",
      "coll": "users"
   },
   "documentKey": {
      "_id": ObjectId("599af247bb69cd89961c986d")
   },
   "fullDocument": {
      "_id": ObjectId("599af247bb69cd89961c986d"),
      "userName": "alice123",
      "name": "Alice"
   }
}
```

操作`replace`使用更新命令，并由两个阶段组成：

- `documentKey`使用和删除原始文档
- 使用相同的方法插入新文档`documentKey`

事件`fullDocument`的`replace`代表插入替换文档后的文档。





参见

原文 - [replace Event](https://www.mongodb.com/docs/manual/reference/change-events/replace/ )

