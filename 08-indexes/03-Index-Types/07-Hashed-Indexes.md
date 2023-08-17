## 散列索引

哈希索引收集并存储索引字段值的哈希值。

哈希索引支持使用哈希分片键进行[分片](https://www.mongodb.com/docs/v7.0/sharding/#std-label-sharding-background) 。[基于哈希的分片](https://www.mongodb.com/docs/v7.0/core/hashed-sharding/#std-label-sharding-hashed-sharding)使用字段的哈希索引作为分片键来跨分片集群对数据进行分区。

### 用例

[与范围](https://www.mongodb.com/docs/v7.0/core/ranged-sharding/#std-label-sharding-ranged)分片相比，使用散列分片键对集合进行分片可以使分片之间的数据分布更加均匀[。](https://www.mongodb.com/docs/v7.0/core/ranged-sharding/#std-label-sharding-ranged)

如果您的分片键[单调增加](https://www.mongodb.com/docs/v7.0/core/sharding-choose-a-shard-key/#std-label-shard-key-monotonic)，则使用散列索引作为分片键在分片之间均匀分配数据，而不是将数据写入上限为 [maxKey的分片。](https://www.mongodb.com/docs/v7.0/reference/bson-types/#std-label-bson-types)

单调递增分片键的常见示例是时间戳和[ObjectId](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-ObjectId)值。

### 行为

#### 浮点数字

哈希索引在哈希之前将浮点数截断为 64 位整数。例如，哈希索引使用相同的哈希来存储值`2.3`、`2.2`和`2.9`。这是一个**碰撞**，其中多个值被分配给单个散列键。冲突可能会对查询性能产生负面影响。

为了防止冲突，不要对无法可靠地转换为 64 位整数然后再转换回浮点数的浮点数使用哈希索引。

哈希索引不支持大于 2 53的浮点数 。

#### 局限性

哈希索引对数组字段和唯一属性有限制。

#### 数组字段

哈希函数不支持[多键索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/#std-label-index-type-multikey)。您无法在包含数组的字段上创建哈希索引*，也*无法将数组插入哈希索引字段。

#### 唯一约束

您不能对散列索引指定[唯一约束。](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)相反，您可以创建具有唯一约束的附加非散列索引。MongoDB 可以使用该非散列索引来强制所选字段的唯一性。

### 开始使用

要创建哈希索引，请参阅[创建哈希索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-hashed/create/#std-label-hashed-index-create)

### 细节

本节介绍哈希索引的技术细节。

### 哈希函数

> **重要的**
>
> 当 MongoDB 使用哈希索引来解析查询时，它会使用哈希函数自动计算哈希值。应用程序不需要**计算**哈希值。

要查看某个键的哈希值是什么，请使用该 [`convertShardKeyToHashed()`](https://www.mongodb.com/docs/v7.0/reference/method/convertShardKeyToHashed/#mongodb-method-convertShardKeyToHashed)方法。此方法使用与散列索引相同的散列函数。

### 嵌入文档

散列函数会折叠嵌入的文档并计算整个值的散列。

### 了解更多

- [分片](https://www.mongodb.com/docs/v7.0/sharding/#std-label-sharding-background)
- [哈希分片](https://www.mongodb.com/docs/v7.0/core/hashed-sharding/#std-label-sharding-hashed-sharding)
- [散列与远程分片](https://www.mongodb.com/docs/v7.0/core/hashed-sharding/#std-label-hashed-versus-ranged-sharding)