## 通过设置 TTL 使集合中的数据过期

本文档介绍了 MongoDB 的“*生存时间*”或[TTL](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-TTL)收集功能。TTL 集合可以将数据存储在 MongoDB 中，并[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在指定的秒数或特定的时钟时间后自动删除数据。

数据过期对于某些类别的信息很有用，包括机器生成的事件数据、日志和仅需要保留一段有限时间的会话信息。

特殊的[TTL 索引属性](https://www.mongodb.com/docs/v7.0/core/index-ttl/#std-label-index-feature-ttl)支持 TTL 集合的实现。TTL 功能依赖于后台线程，[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)该线程读取索引中的日期类型值并从集合中删除过期[文档。](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-document)

要创建 TTL 索引，请使用[`createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex). 指定索引字段，该索引字段可以是[日期类型](https://www.mongodb.com/docs/v7.0/reference/bson-types/#std-label-document-bson-type-date)，也可以是包含日期类型值的数组。使用该`expireAfterSeconds`选项指定 TTL 值（以秒为单位）。

> 笔记:
>
> TTL索引是单字段索引。复合索引不支持 TTL 属性。有关 TTL 索引的更多信息，请参阅 [TTL 索引。](https://www.mongodb.com/docs/v7.0/core/index-ttl/#std-label-index-feature-ttl)

您可以`expireAfterSeconds`使用该命令修改现有 TTL 索引[`collMod`](https://www.mongodb.com/docs/v7.0/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)。

### 指定秒数后使文档过期

要在自索引字段经过指定秒数后使数据过期，请在保存 BSON 日期类型值或 BSON 日期类型对象数组的字段上创建 TTL 索引，并在字段中指定*正*`expireAfterSeconds`非零值。`expireAfterSeconds` 当自其索引字段中指定的时间起经过该字段中的 秒数时，文档将过期。[[ 1 \]](https://www.mongodb.com/docs/v7.0/tutorial/expire-data/#footnote-field-is-array-of-dates)

TTL 索引`expireAfterSeconds`值必须在`0`且 `2147483647`包含在内。

`log_events`例如，以下操作在集合的字段上创建索引 `createdAt`，并指定 `expireAfterSeconds`的值，`10`将过期时间设置为 指定的时间后十秒`createdAt`。

```
db.log_events.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 10 } )
```

将文档添加到`log_events`集合时，将 `createdAt`字段设置为当前时间：

```
db.log_events.insertOne( {
   "createdAt": new Date(),
   "logEvent": 2,
   "logMessage": "Success!"
} )
```

`log_events` 当文档的`createdAt`值 [[ 1 \]](https://www.mongodb.com/docs/v7.0/tutorial/expire-data/#footnote-field-is-array-of-dates)早于指定的秒数时，MongoDB将自动从集合中删除文档`expireAfterSeconds`。

| [ 1 ] | *( [1](https://www.mongodb.com/docs/v7.0/tutorial/expire-data/#ref-field-is-array-of-dates-id1) , [2](https://www.mongodb.com/docs/v7.0/tutorial/expire-data/#ref-field-is-array-of-dates-id2) )* 如果字段包含一组 BSON 日期类型对象，则如果至少一个 BSON 日期类型对象早于 中指定的秒数，则数据将过期 `expireAfterSeconds`。 |
| ----- | ------------------------------------------------------------ |
|       |                                                              |

### 文档在特定时钟时间过期

要在特定时钟时间使文档过期，请首先在保存 BSON 日期类型值或 BSON 日期类型对象数组的字段上创建 TTL 索引，*并*指定`expireAfterSeconds`值`0`。对于集合中的每个文档，将索引日期字段设置为与文档到期时间相对应的值。如果索引日期字段包含过去的日期，MongoDB 会认为该文档已过期。

`log_events`例如，以下操作在集合的字段上创建索引 `expireAt`并指定 `expireAfterSeconds`的值`0`：

```
db.log_events.createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } )
```

对于每个文档，设置 的值`expireAt`以对应于文档应过期的时间。例如，以下 [`insertOne()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)操作添加一个到期时间为 的文档`July 22, 2013 14:00:00`。

```
db.log_events.insertOne( {
   "expireAt": new Date('July 22, 2013 14:00:00'),
   "logEvent": 2,
   "logMessage": "Success!"
} )
```

`log_events` 当文档的`expireAt`值早于 中指定的秒数`expireAfterSeconds`（在本例中即早几秒）时，MongoDB 将自动从集合中删除文档`0` 。因此，数据在指定 `expireAt`值处过期。

### 使用 NaN 配置的索引

> ** 警告**
>
> 可能的数据丢失
>
> 当 TTL 索引`expireAfterSeconds`设置为 时`NaN`，升级、降级和某些同步操作可能会导致意外行为并可能导致数据丢失

不要在 TTL 索引配置中设置`expireAfterSeconds`为。`NaN`

在 MongoDB 5.0 之前，当 TTL 索引设置为 时`expireAfterSeconds`， `NaN`MongoDB 会记录错误并且不会删除任何记录。

从 MongoDB 5.0.0 - 5.0.13（和 6.0.0 - 6.0.1），`NaN`被视为 `0`. 如果 TTL 索引配置为`expireAfterSeconds`设置为 `NaN`，则所有 TTL 索引的文档都会立即过期。

从 MongoDB 5.0.14（和 6.0.2）开始，服务器将不再使用`expireAfterSeconds`设置为 的TTL 索引`NaN`。

但是，仍有一些情况可能会导致意外行为。文件可能会过期：

- 在从 MongoDB 5.0.0 - 5.0.13（或 6.0.0 - 6.0.1）初始同步到早期版本期间。
- 从早期版本升级到 MongoDB 5.0.0 - 5.0.13 时。
- 从 5.0 之前的版本恢复集合时[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump) 到 MongoDB 5.0.0 - 5.0.13（或 6.0.0 - 6.0.1）实例。

为了避免出现问题，请删除或更正任何配置错误的 TTL 索引。

1. 识别配置错误的索引

   在中运行以下脚本[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)壳。该脚本在旧 shell 中不起作用`mongo`。

   ```
   function getNaNIndexes() {
     const nan_index = [];
   
     const dbs = db.adminCommand({ listDatabases: 1 }).databases;
   
     dbs.forEach((d) => {
       const listCollCursor = db
         .getSiblingDB(d.name)
         .runCommand({ listCollections: 1 }).cursor;
   
       const collDetails = {
         db: listCollCursor.ns.split(".$cmd")[0],
         colls: listCollCursor.firstBatch.map((c) => c.name),
       };
   
       collDetails.colls.forEach((c) =>
         db
           .getSiblingDB(collDetails.db)
           .getCollection(c)
           .getIndexes()
           .forEach((entry) => {
             if (Object.is(entry.expireAfterSeconds, NaN)) {
               nan_index.push({ ns: `${collDetails.db}.${c}`, index: entry });
             }
           })
       );
     });
   
     return nan_index;
   };
   
   getNaNIndexes();
   ```

2. 纠正错误配置的索引

   使用该[`collMod`](https://www.mongodb.com/docs/v7.0/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令更新 `expireAfterSeconds`脚本发现的任何配置错误的值。

   作为替代方案，您可以[`drop`](https://www.mongodb.com/docs/v7.0/reference/command/dropIndexes/#mongodb-dbcommand-dbcmd.dropIndexes)使用命令来重新创建任何配置错误的 TTL 索引 [`createIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#mongodb-dbcommand-dbcmd.createIndexes)。

   