## `update`事件

### 概括

`update`

`update`当操作更新集合中的文档时，就会发生事件。

> 笔记:要了解有关修改集合选项时发生的事件的更多信息，请参阅该[`modify`](https://www.mongodb.com/docs/manual/reference/change-events/modify/#mongodb-data-modify)事件。

### 描述

| Field                                           | 类型                                                         | 描述                                                         |
| :---------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `_id`                                           | Document                                                     | 一个[BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON)对象，用作更改流事件的标识符。该值用作恢复更改流时的参数`resumeToken` 。`resumeAfter`该`_id`对象具有以下形式：`{   "_data" : <BinData|hex string>}`该`_data`类型取决于 MongoDB 版本，在某些情况下，还取决于更改流打开或恢复时的[功能兼容性版本 (fCV) 。](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)有关类型的完整列表，请参阅[恢复令牌](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume-token)`_data`。有关通过 恢复更改流的示例`resumeToken`，请参阅 [恢复更改流。](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-stream-resume) |
| `clusterTime`                                   | Timestamp                                                    | 与事件关联的 oplog 条目的时间戳。与 [多文档事务](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions)关联的更改流事件通知 都具有相同的`clusterTime`值：提交事务的时间。在分片集群上，具有相同事件的事件`clusterTime`可能并不都与同一事务相关。有些事件与交易根本无关。要识别单个事务的事件，您可以在变更流事件文档中使用`lsid`和的组合。`txnNumber`*4.0版本中的新功能*。 |
| `collectionUUID`                                | UUID                                                         | UUID标识发生更改的集合。*6.0版本中的新内容*。                |
| `documentKey`                                   | document                                                     | 包含由[CRUD](https://www.mongodb.com/docs/manual/crud/#std-label-crud)`_id`操作创建或修改的文档的值的文档。对于分片集合，此字段还显示文档的完整分片键。如果该`_id`字段已经是分片键的一部分，则不会重复。 |
| `fullDocument`                                  | document                                                     | [由CRUD](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-CRUD)操作创建或修改的文档。仅当您将更改流配置为 设置 时，才会出现此 `fullDocument`字段`updateLookup`。当您使用 配置更改流时`updateLookup`，该字段表示更新操作修改的文档的当前多数提交版本。该文档可能与中描述的更改有所不同 [更新说明](https://www.mongodb.com/docs/manual/reference/change-events/update/#std-label--idref--updateDescription)在原始更新操作和完整文档查找之间是否有任何其他多数提交的操作修改了文档。有关详细信息，请参阅[查找更新操作的完整文档。](https://www.mongodb.com/docs/manual/changeStreams/#std-label-change-streams-updateLookup)*在6.0版本中进行了更改*。从 MongoDB 6.0 开始，如果您`changeStreamPreAndPostImages`使用 、 或 来设置该选项[`db.createCollection()`](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection)，[`create`](https://www.mongodb.com/docs/manual/reference/command/create/#mongodb-dbcommand-dbcmd.create)则 [`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)该`fullDocument`字段将显示插入、替换或更新后的文档（文档后图像）。 `fullDocument`始终包含在`insert`活动中。 |
| `fullDocumentBeforeChange`                      | document                                                     | 操作应用更改之前的文档。即文档原像。当您使用方法或 或命令`changeStreamPreAndPostImages` 为集合启用该字段时，此字段可用。[`db.createCollection()`](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection)[`create`](https://www.mongodb.com/docs/manual/reference/command/create/#mongodb-dbcommand-dbcmd.create)[`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)*6.0版本中的新内容*。 |
| `lsid`                                          | document                                                     | 与事务关联的会话的标识符。仅当操作是[多文档事务的一部分时才出现。](https://www.mongodb.com/docs/manual/core/transactions/)*4.0版本中的新功能*。 |
| `ns`                                            | document                                                     | 受事件影响的命名空间（数据库和/或集合）。                    |
| `ns.coll`                                       | string                                                       | 发生事件的集合的名称。                                       |
| `ns.db`                                         | string                                                       | 发生事件的数据库的名称。                                     |
| `operationType`                                 | string                                                       | 更改通知报告的操作类型。`update`返回这些更改事件的值。       |
| `updateDescription`                             | document                                                     | 描述由更新操作更新或删除的字段的文档。                       |
| `updateDescription.``disambiguatedPaths`        | document                                                     | 一份文档，澄清了`updateDescription`.当`update`更改事件描述路径包含句点 ( `.`) 或路径包含非数组数字子字段的字段上的更改时，该字段`disambiguatedPath`会向文档提供一个数组，该数组列出了已修改字段的路径中的每个条目。要求您将[showExpandedEvents](https://www.mongodb.com/docs/manual/reference/change-events/#std-label-change-streams-expanded-events)选项设置为`true`。*6.1版本中的新增内容*。 |
| `updateDescription.``removedFields`             | array                                                        | 由更新操作删除的字段的数组。                                 |
| `updateDescription.``truncatedArrays`           | array                                                        | 一组文档，记录使用以下一个或多个阶段通过基于管道的更新执行的数组截断：[`$addFields`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/addFields/#mongodb-pipeline-pipe.-addFields)[`$set`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/set/#mongodb-pipeline-pipe.-set)[`$replaceRoot`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/replaceRoot/#mongodb-pipeline-pipe.-replaceRoot)[`$replaceWith`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/replaceWith/#mongodb-pipeline-pipe.-replaceWith)笔记如果替换整个数组，则会在下面报告截断情况[updateDescription.updatedFields 。](https://www.mongodb.com/docs/manual/reference/change-events/update/#std-label--idref--ud-updatedFields) |
| `updateDescription.``truncatedArrays.``field`   | string                                                       | 截断字段的名称。                                             |
| `updateDescription.``truncatedArrays.``newSize` | integer                                                      | 截断数组中的元素数量。                                       |
| `updateDescription.``updatedFields`             | document                                                     | 其键对应于更新操作修改的字段的文档。每个字段的值对应于这些字段的新值，而不是产生新值的操作。 |
| `txnNumber`                                     | NumberLong                                                   | 与[LSID](https://www.mongodb.com/docs/manual/reference/change-events/update/#std-label--idref--lsid)，一个有助于唯一标识交易的数字。仅当操作是[多文档事务的一部分时才出现。](https://www.mongodb.com/docs/manual/core/transactions/)*4.0版本中的新功能*。 |
| `wallTime`                                      | [ISODate](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-ISODate) | 数据库操作的服务器日期和时间。`wallTime` 不同之处`clusterTime`在于，`clusterTime`时间戳是从与数据库操作事件关联的 oplog 条目中获取的。*6.0版本中的新内容*。 |

## 行为

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

- 在文档更新或删除操作时未在集合上启用。

- 在 中设置的图像前和图像后保留时间后删除 `expireAfterSeconds`。

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

- 启用前图像和后图像会消耗存储空间并增加处理时间。仅在需要时才启用前像和后像。
- 将更改流事件大小限制为小于 16 MB。要限制事件大小，您可以：
  * 将文档大小限制为 8 MB。如果其他更改流事件字段 不大，您可以在[更改流输出](https://www.mongodb.com/docs/manual/reference/change-events/#std-label-change-stream-output)中同时请求前图像和后图像。`updateDescription`
  * `updateDescription`如果其他变更流事件字段（例如）不大，则仅请求变更流输出中最多 16 MB 的文档的后期图像 。
  * 如果满足以下条件，则仅请求变更流输出中最大 16 MB 的文档的原像：
    - 文档更新仅影响文档结构或内容的一小部分，*并且*
    - 不引起`replace`变更事件。事件`replace`总是包含后期图像。
- 要请求原像，您可以`fullDocumentBeforeChange`将 `required`或`whenAvailable`设置为[`db.collection.watch()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.watch/#mongodb-method-db.collection.watch)。要请求后图像，您可以`fullDocument`使用相同的方法进行设置。
- 原像被写入集合中`config.system.preimages`。
  * 该`config.system.preimages`集合可能会变得很大。要限制集合大小，您可以设置`expireAfterSeconds` 原像的时间，如前所示。
  * 原像由后台进程异步删除。

> 重要
>
> **向后不兼容的功能**
>
> 从 MongoDB 6.0 开始，如果您将文档前映像和后映像用于[changeStreams](https://www.mongodb.com/docs/manual/reference/change-events/#std-label-change-stream-output)，则必须 使用该命令为每个集合禁用[changeStreamPreAndPostImages](https://www.mongodb.com/docs/manual/reference/command/collMod/#std-label-collMod-change-stream-pre-and-post-images)[`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)，然后才能降级到早期 MongoDB 版本

> 提示:
>
> **也可以看看：**
>
> - 有关更改流事件和输出，请参阅 [更改事件。](https://www.mongodb.com/docs/manual/reference/change-events/#std-label-change-stream-output)
> - 要观察集合的更改，请参阅 [`db.collection.watch()`。](https://www.mongodb.com/docs/manual/reference/method/db.collection.watch/#mongodb-method-db.collection.watch)
> - 有关更改流输出的完整示例，请参阅 [使用文档前图像和后图像更改流。](https://www.mongodb.com/docs/manual/reference/method/db.collection.watch/#std-label-db.collection.watch-change-streams-pre-and-post-images-example)

#### 路径消歧

*6.1版本中的新增内容*。

该`updateDescription`字段记录操作对文档中特定字段所做的更改。这些字段描述符使用点 ( `.`) 作为路径分隔符，使用数字作为数组索引，当它包含使用点或数字的字段名称时，这会导致一些歧义。

当`update`事件报告涉及不明确字段的更改时，`disambiguatedPaths`文档会提供路径键以及列出每个路径组件的数组。

> 变更:
>
> 该字段仅在以[showExpandedEvents](https://www.mongodb.com/docs/manual/reference/change-events/#std-label-change-streams-expanded-events)选项`disambiguatedPaths`启动的变更流上可用

例如，考虑一个列出人员及其居住的城镇的文档：

```
{
   "name": "Anthony Trollope",
   "home.town": "Oxford",
   "residences": [
      {"0": "Oxford"},
      {"1": "Sunbury"}
   ]
}
```

* 当更新将`home.town`字段从`Oxford`to 修改时`London`，它会生成如下所示的更新描述：

  ```
  "updateDescription": {
     "updatedFields": {
        "home.town": "London"
     },
     "disambiguatedPaths": {
        "home.town": [ "home.town" ]
     }
  }
  ```

  由于该字段`home.town`包含句点，因此该`disambiguatedPaths` 字段显示一个具有一个值的数组，以表明`town`不是 的子字段`home`。

* 当更新修改数组中的值`residences`以进行相同的更改时，它会生成如下所示的更新描述：

  ```
  "updateDescription": {
     "updatedFields": {
        "residences.0.0": "London"
     },
     "disambiguatedPaths": { "residences.0.0": [ "residences", 0, "0" ] }
  }
  ```

  消除歧义的路径包括指示数组索引的整数和指示嵌套文档内的字段名称的`0`字符串。`"0"`

  `disambiguatedPath`不**包含**数字字段有两种情况：

* 当路径中的第一个字段是数字字符串时（即`0.name`）。这并不含糊，因为第一个字段不能是数组索引。

* 当数字字符串字段有前导零时（即`0001`）。这是明确的，因为整数不能有前导零。

### 例子

以下示例说明了一个`update`事件：

```
{
   "_id": { <Resume Token> },
   "operationType": "update",
   "clusterTime": <Timestamp>,
   "wallTime": <ISODate>,
   "ns": {
      "db": "engineering",
      "coll": "users"
   },
   "documentKey": {
      "_id": ObjectId("58a4eb4a30c75625e00d2820")
   },
   "updateDescription": {
      "updatedFields": {
         "email": "alice@10gen.com"
      },
      "removedFields": ["phoneNumber"],
      "truncatedArrays": [ {
         "field" : "vacation_time",
         "newSize" : 36
      } ]
   }
}
```

以下示例说明了`update`使用选项打开的变更流的事件`fullDocument : updateLookup`：

```
{
   "_id": { <Resume Token> },
   "operationType": "update",
   "clusterTime": <Timestamp>,
   "wallTime": <ISODate>,
   "ns": {
      "db": "engineering",
      "coll": "users"
   },
   "documentKey": {
      "_id": ObjectId("58a4eb4a30c75625e00d2820")
   },
   "updateDescription": {
      "updatedFields": {
         "email": "alice@10gen.com"
      },
      "removedFields": ["phoneNumber"],
      "truncatedArrays": [ {
         "field" : "vacation_time",
         "newSize" : 36
      } ],
      "disambiguatedPaths": { }
   },
   "fullDocument": {
      "_id": ObjectId("58a4eb4a30c75625e00d2820"),
      "name": "Alice",
      "userName": "alice123",
      "email": "alice@10gen.com",
      "team": "replication"
   }
}
```

该`fullDocument`文档代表更新文档的最新多数提交版本。该`fullDocument`文档可能与更新操作时的文档有所不同，具体取决于更新操作和文档查找之间发生的交错多数提交操作的数量。



参见

原文 - [update Event](https://www.mongodb.com/docs/manual/reference/change-events/update/)

