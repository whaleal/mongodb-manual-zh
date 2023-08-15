## 集群集合

*5.3版本中的新功能*。

### 概述

[从 MongoDB 5.3 开始，您可以使用集群索引](https://www.mongodb.com/docs/v7.0/reference/method/db.createCollection/#std-label-db.createCollection.clusteredIndex)创建集合 。使用聚集索引创建的集合称为聚集集合。

### 优势

由于集群集合存储按 [集群索引键值](https://www.mongodb.com/docs/v7.0/reference/method/db.createCollection/#std-label-db.createCollection.clusteredIndex)排序的文档，因此与非集群集合相比，集群集合具有以下优点：

- 无需辅助索引即可更快地对集群集合进行查询，例如对集群索引键进行范围扫描和相等比较的查询。
- 集群集合具有较低的存储大小，这有助于提高查询和批量插入的性能。
- 集群集合可以消除对辅助的[TTL（生存时间）索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-properties/#std-label-ttl-index)的需求
  * [如果指定expireAfterSeconds](https://www.mongodb.com/docs/v7.0/reference/method/db.createCollection/#std-label-db.createCollection.expireAfterSeconds)字段，则集群索引也是 TTL 索引 。
  * 要用作 TTL 索引，该`_id`字段必须是受支持的日期类型。请参阅[TTL 索引。](https://www.mongodb.com/docs/v7.0/core/index-ttl/#std-label-index-feature-ttl)
  * 如果使用集群索引作为 TTL 索引，可以提高文档删除性能并减少集群集合存储大小。
- 集群集合对插入、更新、删除和查询有额外的性能改进。
  * 所有集合都有一个[_id 索引。](https://www.mongodb.com/docs/v7.0/indexes/#std-label-index-type-id)
  * 非集群集合将`_id`索引与文档分开存储。这需要两次写入用于插入、更新和删除，两次读取用于查询。
  * 集群集合按值顺序将索引和文档存储在一起`_id`。这需要一次写入用于插入、更新和删除，一次读取用于查询。

### 行为

集群集合存储按[集群索引键值](https://www.mongodb.com/docs/v7.0/reference/method/db.createCollection/#std-label-db.createCollection.clusteredIndex)排序的文档。

集合中只能有一个集群索引，因为文档只能按一种顺序存储。只有具有集群索引的集合才会按排序顺序存储数据。

您可以拥有聚集索引并向集群集合添加[二级索引。](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-secondary-index)集群索引与二级索引不同：

- 只有在创建集合时才能创建集群索引。
- 集群索引键与集合一起存储。该命令返回的集合大小[`collStats`](https://www.mongodb.com/docs/v7.0/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats)包括集群索引大小。

> **重要的:**
>
> *向后不兼容的功能*
>
> 您必须先删除集群集合，然后才能降级到早于 5.3 的 MongoDB 版本。

### 局限性

集群集合的限制：

- 您无法将非集群集合转换为集群集合，反之亦然。相反，您可以：
  - 使用具有阶段或阶段的[聚合管道](https://www.mongodb.com/docs/v7.0/aggregation/#std-label-aggregation-pipeline-intro)从一个集合中读取文档并将其写入另一个集合。[`$out`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)[`$merge`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)
  - 导出收集数据[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)并将数据导入到另一个集合中[`mongorestore`。](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)
- 默认情况下，如果集群集合上存在[二级索引并且您的查询可以使用二级索引，则选择二级索引而不是集群索引。](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-secondary-index)
  - 您必须提供使用集群索引的提示，因为[查询优化器不会自动选择它。](https://www.mongodb.com/docs/v7.0/core/query-plans/)
  - 如果存在可用的二级索引，则查询优化器不会自动使用[集群索引](https://www.mongodb.com/docs/v7.0/reference/method/db.createCollection/#std-label-db.createCollection.clusteredIndex)。
  - 当查询使用集群索引时，它将执行 [有界集合扫描。](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-bounded-collection-scan)
- 集群索引键必须位于该`_id`字段上。
- 您无法隐藏集群索引。请参阅[隐藏索引。](https://www.mongodb.com/docs/v7.0/core/index-hidden/)
- 如果集群集合有二级索引，则该集合的存储大小会更大。这是因为具有较大集群索引键的集群集合上的二级索引可能比非集群集合上的二级索引具有更大的存储大小。
- 集群集合可能不是[上限集合。](https://www.mongodb.com/docs/v7.0/core/capped-collections/#std-label-manual-capped-collection)

### 设置您自己的集群索引键值

默认情况下，[集群索引](https://www.mongodb.com/docs/v7.0/reference/method/db.createCollection/#std-label-db.createCollection.clusteredIndex)键值是唯一的文档 [对象标识符。](https://www.mongodb.com/docs/v7.0/reference/bson-types/#std-label-objectid)

您可以设置自己的集群索引键值。你的键：

- 必须包含唯一值。
- 必须是不可变的。
- 应包含顺序递增的值。这不是必需的，但可以提高插入性能。
- 应尽可能小的大小。
  * 聚集索引支持大小最大为 8 MB 的键，但最好使用小得多的聚集索引键。
  * 较大的聚集索引键会导致聚集集合的大小增加，并且二级索引也更大。这降低了集群集合的性能和存储优势。
  * 与非聚集索引上的二级索引相比，具有较大聚集索引键的聚集集合上的二级索引可能会使用更多空间。

### 例子

本节显示集群集合示例。

#### `Create`例子

下面的[`create`](https://www.mongodb.com/docs/v7.0/reference/command/create/#mongodb-dbcommand-dbcmd.create)例子添加了一个[聚集集合](https://www.mongodb.com/docs/v7.0/core/clustered-collections/#std-label-clustered-collections)命名`products`：

```
db.runCommand( {
   create: "products",
   clusteredIndex: { "key": { _id: 1 }, "unique": true, "name": "products clustered key" }
} )
```

在示例中，[clusteredIndex](https://www.mongodb.com/docs/v7.0/reference/command/create/#std-label-create.clusteredIndex) 指定：

- `"key": { _id: 1 }`，它将集群索引键设置为字段 `_id`。
- `"unique": true`，表示集群索引键值必须是唯一的。
- `"name": "products clustered key"`，它设置集群索引名称。

### `db.createCollection`例子

下面的[`db.createCollection()`](https://www.mongodb.com/docs/v7.0/reference/method/db.createCollection/#mongodb-method-db.createCollection)例子添加了一个 [集群集合](https://www.mongodb.com/docs/v7.0/core/clustered-collections/#std-label-clustered-collections)命名`stocks`：

```
db.createCollection(
   "stocks",
   { clusteredIndex: { "key": { _id: 1 }, "unique": true, "name": "stocks clustered key" } }
)
```

在示例中，[clusteredIndex](https://www.mongodb.com/docs/v7.0/reference/method/db.createCollection/#std-label-db.createCollection.clusteredIndex)指定：

- `"key": { _id: 1 }`，它将集群索引键设置为字段 `_id`。
- `"unique": true`，表示集群索引键值必须是唯一的。
- `"name": "stocks clustered key"`，它设置集群索引名称。

#### 日期集群索引键示例

以下[`create`](https://www.mongodb.com/docs/v7.0/reference/command/create/#mongodb-dbcommand-dbcmd.create)示例添加一个名为 的集群集合`orders`：

```
db.createCollection(
   "orders",
   { clusteredIndex: { "key": { _id: 1 }, "unique": true, "name": "orders clustered key" } }
)
```

在示例中，[clusteredIndex](https://www.mongodb.com/docs/v7.0/reference/method/db.createCollection/#std-label-db.createCollection.clusteredIndex)指定：

- `"key": { _id: 1 }`，它将集群索引键设置为字段 `_id`。
- `"unique": true`，表示集群索引键值必须是唯一的。
- `"name": "orders clustered key"`，它设置集群索引名称。

以下示例将文档添加到`orders`集合中：

```
db.orders.insertMany( [
   { _id: ISODate( "2022-03-18T12:45:20Z" ), "quantity": 50, "totalOrderPrice": 500 },
   { _id: ISODate( "2022-03-18T12:47:00Z" ), "quantity": 5, "totalOrderPrice": 50 },
   { _id: ISODate( "2022-03-18T12:50:00Z" ), "quantity": 1, "totalOrderPrice": 10 }
] )
```

clusteredIndex键`_id` [存储](https://www.mongodb.com/docs/v7.0/reference/command/create/#std-label-create.clusteredIndex)订单日期。

如果`_id`在范围查询中使用该字段，性能会得到提高。例如，以下查询使用`_id`和[`$gt`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/gt/#mongodb-expression-exp.-gt)返回订单日期晚于提供的日期的订单：

```
db.orders.find( { _id: { $gt: ISODate( "2022-03-18T12:47:00.000Z" ) } } )
```

输出示例：

```
[
   {
      _id: ISODate( "2022-03-18T12:50:00.000Z" ),
      quantity: 1,
      totalOrderPrice: 10
   }
]
```

### 确定集合舒服为集群集合

要确定集合是否是集群的，请使用以下 [`listCollections`](https://www.mongodb.com/docs/v7.0/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections)命令：

```
db.runCommand( { listCollections: 1 } )
```

对于集群集合，您将在输出中看到[clusteredIndex详细信息。](https://www.mongodb.com/docs/v7.0/reference/command/create/#std-label-create.clusteredIndex)例如，以下输出显示了`orders`集群集合的详细信息：

```
...
name: 'orders',
type: 'collection',
options: {
   clusteredIndex: {
      v: 2,
      key: { _id: 1 },
      name: 'orders clustered key',
      unique: true
   }
},
...
```

`v`是索引版本。