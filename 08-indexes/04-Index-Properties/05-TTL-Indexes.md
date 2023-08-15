## TTL索引

> 笔记:
>
> 如果您要删除文档以节省存储成本，请考虑 [在线存档](https://www.mongodb.com/docs/atlas/online-archive/manage-online-archive/)在 [MongoDB 阿特拉斯](https://www.mongodb.com/cloud?tck=docs_server)。Online Archive 自动将不常访问的数据存档到完全托管的 S3 存储桶中，以实现经济高效的数据分层。

TTL 索引是特殊的单字段索引，MongoDB 可以使用它在一段时间后或在特定时钟时间自动从集合中删除文档。数据过期对于某些类型的信息非常有用，例如机器生成的事件数据、日志和会话信息，这些信息只需要在数据库中保留有限的时间。

### 创建 TTL 索	

> 警告
>
> 创建 TTL 索引后，可能会立即删除大量符合条件的文档。如此大的工作负载可能会导致服务器出现性能问题。为了避免这些问题，请计划在下班时间创建索引，或者批量删除符合条件的文档，然后再为以后的文档创建索引。

要创建 TTL 索引，请使用[`createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex). 指定索引字段，该索引字段可以是[日期类型](https://www.mongodb.com/docs/v7.0/reference/bson-types/#std-label-document-bson-type-date)，也可以是包含日期类型值的数组。使用该`expireAfterSeconds`选项指定 TTL 值（以秒为单位）。

TTL 索引`expireAfterSeconds`值必须在`0`且 `2147483647`包含在内。

`lastModifiedDate`例如，要在集合的字段上创建`eventlog`TTL值为秒的TTL索引`3600`，请使用以下操作[`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
db.eventlog.createIndex( { "lastModifiedDate": 1 }, {
expireAfterSeconds: 3600 } )
```

从 MongoDB 6.3 开始，您可以在 [时间序列集合](https://www.mongodb.com/docs/v7.0/core/timeseries-collections/#std-label-manual-timeseries-landing)上创建部分 TTL 索引。这些索引使用集合作为[关键字](https://www.mongodb.com/docs/v7.0/core/index-partial/#std-label-index-type-partial)`timeField`段，并且 需要 .`metaField`

时间序列集合包含一个可选`expireAfterSeconds` 字段。如果您不设置它，则带有 的 TTL 索引 `partialFilterExpression`可让您为与过滤器匹配的文档设置过期期限。如果您确实设置了`expireAfterSeconds`，则部分 TTL 索引可让您为匹配文档设置不同的、较短的过期期限。您只能`partialFilterExpression`在 上创建`metaField`。

> 重要的:
>
> 如果`expireAfterSeconds`集合的值低于`expireAfterSeconds`部分TTL索引的值，则集合会在较短的时间后删除文档，因此TTL索引不起作用。

此天气数据时间序列集合会在 24 小时后删除文档：

```
db.createCollection(
    "weather24h",
    {
       timeseries: {
          timeField: "timestamp",
          metaField: "sensor",
          granularity: "hours"
       },
       expireAfterSeconds: 86400})
```

此 TTL 索引会在 1 小时（而不是 24 小时）后从 MongoDB NYC 总部天气传感器删除文档：

```
db.eventlog.createIndex(
  { "timestamp": 1 },
  { partialFilterExpression: { "sensor": { $eq: "40.761873, -73.984287" } } },
  { expireAfterSeconds: 3600 } )
```

###  将非 TTL 单字段索引转换为 TTL 索引 

从 MongoDB 5.1 开始，您可以将该`expireAfterSeconds`选项添加到现有的单字段索引。要将非TTL单字段索引更改为TTL索引，请使用[`collMod`](https://www.mongodb.com/docs/v7.0/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)数据库命令：

```
db.runCommand({
  "collMod": <collName>,
  "index": {
    "keyPattern": <keyPattern>,
    "expireAfterSeconds": <number>
  }
})
```

以下示例将具有模式的非 TTL 单字段索引转换`{ "lastModifiedDate": 1 }`为 TTL 索引：

```
db.runCommand({
  "collMod": "tickets",
  "index": {
    "keyPattern": { "lastModifiedDate": 1 },
    "expireAfterSeconds": 100
  }
})
```

### 更改`expireAfterSeconds`TTL 索引的值

要更改`expireAfterSeconds`TTL 索引的值，请使用 [`collMod`](https://www.mongodb.com/docs/v7.0/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)数据库命令：

```
db.runCommand({
  "collMod": <collName>,
  "index": {
    "keyPattern": <keyPattern>,
    "expireAfterSeconds": <number>
  }
})
```

以下示例使用集合上的`expireAfterSeconds`模式更改索引的值 ：`{ "lastModifiedDate": 1 }``tickets`

```
db.runCommand({
  "collMod": "tickets",
  "index": {
    "keyPattern": { "lastModifiedDate": 1 },
    "expireAfterSeconds": 100
  }
})
```

### 行为

#### 数据过期

TTL 索引在自索引字段值经过指定秒数后使文档过期；即过期阈值是索引字段值加上指定的秒数。

如果字段是一个数组，并且索引中有多个日期值，MongoDB 将使用数组中*最低（即最早）的日期值来计算过期阈值。*

对于时间序列集合，当桶中的所有文档过期时，TTL 索引也会删除该桶中的数据。这等于存储桶的时间戳上限加上该`expireAfterSeconds`值。例如，如果某个存储桶包含的数据直到`2023-03-27T18:29:59Z` 和`expireAfterSeconds`为 300，则 TTL 索引将在 后使该存储桶过期`2023-03-27T18:34:59Z`。

如果文档中的索引字段不是 [日期](https://www.mongodb.com/docs/v7.0/reference/bson-types/#std-label-document-bson-type-date)或包含一个或多个日期值的数组，则该文档不会过期。

如果文档不包含索引字段，则该文档不会过期。

#### 删除操作

后台线程[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)读取索引中的值并从集合中删除过期的[文档。](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-document)

[当 TTL 线程处于活动状态时，您将在数据库探查器](https://www.mongodb.com/docs/v7.0/tutorial/manage-the-database-profiler/#std-label-database-profiler)的输出[`db.currentOp()`](https://www.mongodb.com/docs/v7.0/reference/method/db.currentOp/#mongodb-method-db.currentOp)或收集的数据中 看到删除操作[。](https://www.mongodb.com/docs/v7.0/tutorial/manage-the-database-profiler/#std-label-database-profiler)

从 MongoDB 6.1 开始：

- 为了提高效率，MongoDB 可能会批量删除多个文档。
- 命令[`explain`](https://www.mongodb.com/docs/v7.0/reference/command/explain/#mongodb-dbcommand-dbcmd.explain)结果包含用于批量[文档](https://www.mongodb.com/docs/v7.0/reference/explain-results/#std-label-explain-results)删除的 新`BATCHED_DELETE`阶段。

#### 删除操作的时机

一旦索引在[主数据库](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-primary)上构建完成，MongoDB 就会开始删除过期的文档或时间序列存储桶。有关索引构建过程的更多信息，请参阅[在已填充集合上构建索引。](https://www.mongodb.com/docs/v7.0/core/index-creation/#std-label-index-operations)

TTL索引并不能保证过期数据在过期后立即被删除。文档过期时间和 MongoDB 从数据库中删除文档的时间之间可能存在延迟。

删除过期文档的后台任务*每 60 秒*运行一次。因此，在文档过期和后台任务运行之间的时间段内，文档可能会保留在集合中。MongoDB 在索引完成后 0 到 60 秒开始删除文档。

由于删除操作的持续时间取决于实例的工作负载，因此过期数据可能会在后台任务运行之间的 60 秒时间段*之外*[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)存在一段时间。

与其他删除一样，由 TTL 任务发起的删除操作在前台运行。

##### 副本集

在[副本集](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-replica-set)成员上，TTL 后台线程*仅* 在成员处于状态[Primary](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-primary)时删除文档。当成员处于[secondary](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-secondary)状态时，TTL 后台线程处于空闲状态。[辅助](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-secondary)成员从主成员复制删除操作。

#### 支持查询

TTL 索引以与非 TTL 索引相同的方式支持查询。

### 限制

- TTL索引是单字段索引。[复合索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound)不支持TTL并忽略该 `expireAfterSeconds`选项。
- 该`_id`字段不支持TTL索引。
- [您无法在上限集合](https://www.mongodb.com/docs/v7.0/core/capped-collections/#std-label-manual-capped-collection)上创建 TTL 索引[。](https://www.mongodb.com/docs/v7.0/core/capped-collections/#std-label-manual-capped-collection)
- 您只能在集合上为[时间序列集合](https://www.mongodb.com/docs/v7.0/core/timeseries-collections/#std-label-manual-timeseries-landing)`timeField`创建 TTL 索引。
- 您不能使用来更改现有索引的[`createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)值。`expireAfterSeconds`而是使用 [`collMod`](https://www.mongodb.com/docs/v7.0/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)数据库命令。看 [更改`expireAfterSeconds`TTL 索引的值。](https://www.mongodb.com/docs/v7.0/core/index-ttl/#std-label-change-ttl-expireafterseconds-value)
- 如果某个字段已存在非 TTL 单字段索引，则无法在同一字段上创建 TTL 索引，因为无法创建具有相同键规范且仅选项不同的索引。到[将非 TTL 单字段索引更改为 TTL 索引](https://www.mongodb.com/docs/v7.0/core/index-ttl/#std-label-convert-non-ttl-single-field-index-into-ttl)，使用 [`collMod`](https://www.mongodb.com/docs/v7.0/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)数据库命令。