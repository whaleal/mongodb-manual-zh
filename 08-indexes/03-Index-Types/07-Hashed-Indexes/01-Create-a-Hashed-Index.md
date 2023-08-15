## 创建哈希索引

要对已包含数据的集合启用分片，您必须创建支持分片键的索引。要为空集合启用分片，您可以在对 [集合进行分片时指定分片键索引。](https://www.mongodb.com/docs/v7.0/core/sharding-shard-a-collection/#std-label-sharding-shard-key-creation)

哈希索引支持[哈希分片](https://www.mongodb.com/docs/v7.0/core/hashed-sharding/#std-label-sharding-hashed)。哈希索引充当[分片键](https://www.mongodb.com/docs/v7.0/core/sharding-shard-key/#std-label-sharding-shard-key)，根据字段值的哈希值在分片之间分配数据。

要创建单字段哈希索引，请指定`hashed`索引键的值：

```
db.<collection>.createIndex(
   {
      <field>: "hashed"
   }
)
```

要创建包含多个字段的哈希索引（复合哈希索引），请指定为*单个*索引键`hashed`的值。对于其他索引键，指定排序顺序（或）：`1``-1`

```
db.<collection>.createIndex(
   {
      <field1>: "hashed",
      <field2>: "<sort order>",
      <field3>: "<sort order>",
      ...
   }
)
```

### 关于此任务

您的散列索引可以包含单个字段或多个字段。索引中的字段指定数据如何在集群中的分片之间分布。

请考虑以下关于散列分片键的准则：

- 您为散列分片键选择的字段应该具有高 [基数](https://www.mongodb.com/docs/v7.0/core/sharding-choose-a-shard-key/#std-label-shard-key-range)，这意味着有大量不同的值。散列索引非常适合具有像 [ObjectId值或时间戳这样](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-ObjectId)[单调](https://www.mongodb.com/docs/v7.0/core/sharding-choose-a-shard-key/#std-label-shard-key-monotonic)变化的字段的分片键。
- 如果您的数据模型不包含具有高基数的单个字段，请考虑创建一个[复合散列索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-hashed/create/#std-label-compound-hashed-index-example)。复合哈希索引提供更多唯一索引值并可以增加基数。

哈希索引最多可以包含 32 个字段。

### 在你开始之前

要实现哈希分片，必须[部署分片集群。](https://www.mongodb.com/docs/v7.0/tutorial/deploy-shard-cluster/#std-label-sharding-procedure-setup)

### 例子

以下示例向您展示如何：

- [创建单字段哈希索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-hashed/create/#std-label-single-hashed-index-example)
- [创建复合哈希索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-hashed/create/#std-label-compound-hashed-index-example)

### 创建单字段哈希索引

考虑一个`orders`已经包含数据的集合。`orders`在集合中的字段上创建哈希索引`_id`：

```
db.orders.createIndex( { _id: "hashed" } )
```

该`_id`字段单调增加，这使其成为散列索引键的良好候选者。尽管`_id`值逐渐增加，但当 MongoDB 为各个值生成哈希时`_id`，这些哈希值不太可能位于同一个[chunk上。](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-chunk)

创建索引后，您可以对`orders`集合进行分片：

```
sh.shardCollection(
   "<database>.orders",
   { _id: "hashed" }
)
```

### 创建复合哈希索引

考虑一个`customers`已经包含数据的集合。在集合中的、 和字段`customers`上创建复合哈希索引：`name``address``birthday`

```
db.customers.createIndex(
   {
      "name" : 1
      "address" : "hashed",
      "birthday" : -1
   }
)
```

创建复合哈希索引时，必须指定为*单个*`hashed`索引键的值。对于其他索引键，指定排序顺序（或）。在前面的索引中，是哈希字段。`1``-1``address`

创建索引后，您可以对`customers`集合进行分片：

```
sh.shardCollection(
   "<database>.customers",
   {
      "name" : 1
      "address" : "hashed",
      "birthday" : -1
   }
)
```

### 了解更多

- [哈希分片](https://www.mongodb.com/docs/v7.0/core/hashed-sharding/#std-label-sharding-hashed)
- [选择一个分片键](https://www.mongodb.com/docs/v7.0/core/sharding-choose-a-shard-key/#std-label-sharding-shard-key-selection)
- [散列与远程分片](https://www.mongodb.com/docs/v7.0/core/hashed-sharding/#std-label-hashed-versus-ranged-sharding)
- [部署分片集群](https://www.mongodb.com/docs/v7.0/tutorial/deploy-shard-cluster/#std-label-sharding-procedure-setup)