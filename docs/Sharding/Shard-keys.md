# Shard Keys

# 分片键

> On this page 本页面中
> - [Shard Key Specification 分片键格式](https://docs.mongodb.com/manual/core/sharding-shard-key/#shard-key-specification)
> - [Change a Document’s Shard Key Value 改变一个文档的分片键值](https://docs.mongodb.com/manual/core/sharding-shard-key/#change-a-document-s-shard-key-value)
> - [Shard Key Indexes 分片键索引](https://docs.mongodb.com/manual/core/sharding-shard-key/#shard-key-indexes)
> - [Choosing a Shard Key 选择一个shard key](https://docs.mongodb.com/manual/core/sharding-shard-key/#choosing-a-shard-key)

The shard key determines the distribution of the collection’s [documents](https://docs.mongodb.com/manual/reference/glossary/#term-document) among the cluster’s [shards](https://docs.mongodb.com/manual/reference/glossary/#term-shard). The shard key is either an indexed [field](https://docs.mongodb.com/manual/reference/glossary/#term-field) or indexed [compound](https://docs.mongodb.com/manual/reference/glossary/#term-compound-index) fields that exists in every document in the collection.<br>
分片键决定了集合内的文档如何在集群的多个分片间的分布状况。分片键要么是一个索引字段，要么是一个存在于集合内所有文档中的复合索引字段。

MongoDB [partitions](https://docs.mongodb.com/manual/reference/glossary/#term-data-partition) data in the collection using ranges of shard key values. Each range defines a non-overlapping range of shard key values and is associated with a [chunk](https://docs.mongodb.com/manual/reference/glossary/#term-chunk).<br>
MongoDB使用分片键值范围对集合中的数据进行分区。每个范围都定义了一个分片键值的非重叠范围，并且与一个chunk(数据块，下同)相关联。

MongoDB attempts to distribute chunks evenly among the shards in the cluster. The shard key has a direct relationship to the effectiveness of chunk distribution. See [Choosing a Shard Key](https://docs.mongodb.com/manual/core/sharding-shard-key/#sharding-shard-key-selection).<br>
MongoDB尝试在集群中的各个分片之间平均分配数据块。 分片键与数据块分配的有效性直接相关。 请参阅【选择分片键】。

![shard key](https://docs.mongodb.com/manual/_images/sharding-range-based.bakedsvg.svg)

> IMPORTANT 重要
> - Once you shard a collection, the selection of the shard key is immutable; i.e. you cannot select a different shard key for that collection.<br>
一旦你对一个集合分片，那么其分片键就不可再改变；也就是说，你不可以对这个集合再重新选择另一个不一样的分片键。
> - Starting in MongoDB 4.2, you can update a document’s shard key value unless the shard key field is the immutable _id field. For details on updating the shard key, see Change a Document’s Shard Key Value.<br>
Before MongoDB 4.2, a document’s shard key field value is immutable.<br>
从MongoDB4.2版本开始，除非分片键是不可变的`_id`字段，否则你可以更新文档的分片键值。有关更新分片键的详细信息，请参考【修改文档的分片键值】。<br>
在MongoDB4.2之前的版本，文档的分片键字段值是不可变的。

## Shard Key Specification 分片键格式
To shard a collection, you must specify the target collection and the shard key to the [sh.shardCollection()](https://docs.mongodb.com/manual/reference/method/sh.shardCollection/#sh.shardCollection) method:
为了将一个集合分片，你必须在`sh.shardCollection（）`方法中指定目标集合和分片键：

```
sh.shardCollection( namespace, key )
```

- The namespace parameter consists of a string <database>.<collection> specifying the full [namespace](https://docs.mongodb.com/manual/reference/glossary/#term-namespace) of the target collection.<br>
`namespace`参数由字符串`<database>.<collection>`组成，该字符串指定目标集合的完整命名空间。
- The key parameter consists of a document containing a field and the index traversal direction for that field.<br>
`key`参数由包含一个字段和该字段的索引遍历方向的文档组成。

> IMPORTANT
> - Once you shard a collection, the selection of the shard key is immutable; i.e. you cannot select a different shard key for that collection.
> - Starting in MongoDB 4.2, you can update a document’s shard key value unless the shard key field is the immutable _id field. For details on updating the shard key, see Change a Document’s Shard Key Value.<br>
Before MongoDB 4.2, a document’s shard key field value is immutable.

For instructions sharding a collection using either the [hashed](https://docs.mongodb.com/manual/core/hashed-sharding/#sharding-hashed) or [ranged sharding](https://docs.mongodb.com/manual/core/ranged-sharding/#sharding-ranged) strategy, see Shard a Collection.<br>
有关使用散列或范围分片策略对集合进行分片的说明，请参阅【对集合进行分片】。

## Change a Document’s Shard Key Value 改变一个文档的分片键值

When updating the shard key value<br>
更新分片键时

- You `must` run on a [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) either in a [transaction](https://docs.mongodb.com/manual/core/transactions/) or as a [retryable write](https://docs.mongodb.com/manual/core/retryable-writes/). Do not issue the operation directly on the shard.<br>
`必须`在`事务`中或以`可重试写入`方式在mongos上运行。 不要直接在分片上执行操作。
- You `must` include an equality condition on the full shard key in the query filter. For example, if a collection messages uses `{ country : 1, userid : 1 }` as the shard key, to update the shard key for a document, you must include country: `<value>, userid: <value>` in the query filter. You can include additional fields in the query as appropriate.<br>
您必须在查询过滤器的完整分片键上包含相等条件。 例如，如果一个分片集合内使用`{country：1，userid：1}`作为分片键，要想更新文档的分片键，则必须在查询过滤器中包含`country：<value>，userid：<value>`。 也可以根据需要在查询中包括其他字段。

Starting in MongoDB 4.2, you can update a document’s shard key value unless the shard key field is the immutable _id field. To update, use the following operations to update a document’s shard key value:<br>
从MongoDB 4.2版本开始，除非分片键字段是不可变的`_id`字段，否则您可以更新文档的分片键值。 若要更新，请使用以下操作来更新文档的分片键值：

| Command 命令  | Method 方法  |
| :------------ |:---------------|
| [update](https://docs.mongodb.com/manual/reference/command/update/#dbcmd.update) with `multi: false`  | [db.collection.replaceOne()](https://docs.mongodb.com/manual/reference/method/db.collection.replaceOne/#db.collection.replaceOne)<br>[db.collection.updateOne()](https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#db.collection.updateOne)<br>[db.collection.update()](https://docs.mongodb.com/manual/reference/method/db.collection.update/#db.collection.update) with `multi: false` |
| [findAndModify](https://docs.mongodb.com/manual/reference/command/findAndModify/#dbcmd.findAndModify)     | [db.collection.findOneAndReplace()](https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndReplace/#db.collection.findOneAndReplace)<br>[db.collection.findOneAndUpdate()](https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate/#db.collection.findOneAndUpdate)<br>[db.collection.findAndModify()](https://docs.mongodb.com/manual/reference/method/db.collection.findAndModify/#db.collection.findAndModify)   |
| | [db.collection.bulkWrite()](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#db.collection.bulkWrite)<br>[Bulk.find.updateOne()](https://docs.mongodb.com/manual/reference/method/Bulk.find.updateOne/#Bulk.find.updateOne)<br>If the shard key modification results in moving the document to another shard, you cannot specify more than one shard key modification in the bulk operation; i.e. batch size of 1.<br>如果分片键修改导致将文档移动到另一个分片，则在批量操作中不能指定多个分片键修改；即批量大小为`1`。<br><br>If the shard key modification does not result in moving the document to another shard, you can specify multiple shard key modification in the bulk operation.<br>如果分片键修改不会导致将文档移动到另一个分片，则可以在批量操作中指定多个分片键修改。 |

## Shard Key Indexes 分片键索引

All sharded collections `must` have an index that supports the [shard key](https://docs.mongodb.com/manual/reference/glossary/#term-shard-key); i.e. the index can be an index on the shard key or a [compound index](https://docs.mongodb.com/manual/reference/glossary/#term-compound-index) where the shard key is a [prefix](https://docs.mongodb.com/manual/core/index-compound/#compound-index-prefix) of the index.<br>
所有分片集合都`必须`具有支持分片键的索引。 即索引可以是分片键的索引;也可以是复合索引，其中分片键是索引的前缀。

- If the collection is empty, `sh.shardCollection()` creates the index on the shard key if such an index does not already exists.<br>
如果集合为空，则`sh.shardCollection()`在分片键上创建索引（如果该索引尚不存在）。
- If the collection is not empty, you must create the index first before using `sh.shardCollection()`.<br>
如果集合不为空，则必须先创建索引，然后再使用`sh.shardCollection()`。

If you drop the last valid index for the shard key, recover by recreating an index on just the shard key.<br>
如果你删除了分片键的最后一个有效索引，请通过仅在分片键上重新创建索引来恢复。

### Unique Indexes 唯一索引

You cannot specify a unique constraint on a [hashed index](https://docs.mongodb.com/manual/core/index-hashed/#index-type-hashed).<br>
您不能在哈希索引上指定唯一约束。

For a ranged sharded collection, only the following indexes can be [unique](https://docs.mongodb.com/manual/core/index-unique/):<br>
对于一个范围分片的集合，只有以下索引可以是唯一的

- the index on the shard key<br>
分片键索引

- a compound index where the shard key is a prefix<br>
一个已分片键为前缀的复合索引

- the default `_id` index; **however**, the `_id` index only enforces the uniqueness constraint per shard if the `_id` field is not the shard key or the prefix of the shard key.<br>
默认的`_id`索引； 但是，如果`_id`字段不是分片键或分片键的前缀，则`_id`索引仅对每个分片强制执行唯一性约束。

> UNIQUENESS AND THE `_ID` INDEX: 关于`_id`索引和唯一性
>
> If the `_id` field is not the shard key or the prefix of the shard key, `_id` index only enforces the uniqueness constraint per shard and not across shards.<br>如果`_id`字段不是分片键或分片键的前缀，则`_id`索引仅对每个分片（而非跨分片）强制实施唯一性约束。
>
> For example, consider a sharded collection (with shard key `{x: 1}`) that spans two shards A and B. Because the `_id` key is not part of the shard key, the collection could have a document with `_id` value `1` in shard A and another document with `_id` value `1` in shard B.<br>例如，考虑一个跨越两个分片A和B的分片集合（具有分片键`{x：1}`）。由于`_id`键不是分片键的一部分，因此该集合可能在分片A中具有`_id`值为`1`的文档。 以及分片B中`_id`值为`1`的另一个文档。
>
> If the `_id` field is not the shard key nor the prefix of the shard key, MongoDB expects applications to enforce the uniqueness of the `_id` values across the shards.<br>如果`_id`字段不是分片键也不是分片键的前缀，则MongoDB期望应用程序来保证整个分片上`_id`值的唯一性。

The unique index constraints mean that:<br>
唯一的索引约束意味着：

- For a to-be-sharded collection, you cannot shard the collection if the collection has other unique indexes.<br>
对于一个即将要分片的集合，如果该集合具有其他唯一索引，则无法分片该集合。
- For an already-sharded collection, you cannot create unique indexes on other fields.<br>
对于已分片的集合，不能在其他字段上创建唯一索引。

Through the use of the unique index on the shard key, MongoDB can enforce uniqueness on the shard key values. MongoDB enforces uniqueness on the _entire_ key combination, and not individual components of the shard key. To enforce uniqueness on the shard key values, pass the `unique` parameter as `true` to the [sh.shardCollection()](https://docs.mongodb.com/manual/reference/method/sh.shardCollection/#sh.shardCollection) method:<br>
通过使用分片键上的唯一索引，MongoDB可以对分片键值实施唯一性约束。 MongoDB在整个键组合上（而不是分片键的单个组件）实施唯一性约束。 要对分片键值实施唯一性约束，请将`unique`参数设置为`true`传递给`sh.shardCollection()`方法：

- If the collection is empty, [sh.shardCollection()](https://docs.mongodb.com/manual/reference/method/sh.shardCollection/#sh.shardCollection) creates the unique index on the shard key if such an index does not already exist.<br>
如果集合为空，则`sh.shardCollection()`在分片键上创建唯一索引（如果该索引尚不存在）。
- If the collection is not empty, you must create the index first before using [sh.shardCollection()](https://docs.mongodb.com/manual/reference/method/sh.shardCollection/#sh.shardCollection).<br>
如果集合不为空，则必须先创建索引，然后再使用`sh.shardCollection()`。

Although you can have a unique [compound index](https://docs.mongodb.com/manual/reference/glossary/#term-compound-index) where the shard key is a [prefix](https://docs.mongodb.com/manual/core/index-compound/#compound-index-prefix), if using `unique` parameter, the collection must have a unique index that is on the shard key.<br>
尽管可以有一个唯一的复合索引，其中分片键是一个前缀，但是如果使用unique参数，则集合必须在分片键上具有唯一索引。

## Choosing a Shard Key 选择一个分片键

The choice of shard key affects the creation and [distribution of the chunks](https://docs.mongodb.com/manual/core/sharding-balancer-administration/#sharding-balancing) across the available [shards](https://docs.mongodb.com/manual/reference/glossary/#term-shard). This affects the overall efficiency and performance of operations within the sharded cluster.<br>
分片键的选择会影响可用分片中数据块的创建和分布。 这会影响分片群集内操作的整体效率和性能。

The shard key affects the performance and efficiency of the [sharding strategy](https://docs.mongodb.com/manual/sharding/#sharding-strategy) used by the sharded cluster.<br>
分片键会影响分片群集使用的分片策略的性能和效率。

The ideal shard key allows MongoDB to distribute documents evenly throughout the cluster.<br>
理想的分片键允许MongoDB在整个集群中均匀地分布所有文档。

![choosing a shard key](https://docs.mongodb.com/manual/_images/sharded-cluster-ranged-distribution-good.bakedsvg.svg)

At minimum, consider the consequences of the [cardinality](https://docs.mongodb.com/manual/core/sharding-shard-key/#shard-key-range), [frequency](https://docs.mongodb.com/manual/core/sharding-shard-key/#shard-key-frequency), and rate of [change](https://docs.mongodb.com/manual/core/sharding-shard-key/#shard-key-monotonic) of a potential shard key.<br>
至少要综合考虑潜在分片键的`基数`，`频率`和`变化率`等指标。

### Restrictions 限制

For restrictions on shard key, see [Shard Key Limitations](https://docs.mongodb.com/manual/reference/limits/#limits-shard-keys).<br>
有关分片键的限制，请参阅【分片键限制】。

### Collection Size 集合大小

When sharding a collection that is not empty, the shard key can constrain the maximum supported collection size for the initial sharding operation only. See [Sharding Existing Collection Data Size](https://docs.mongodb.com/manual/reference/limits/#Sharding-Existing-Collection-Data-Size).<br>
在对一个不为空的集合进行分片时，分片键只能为初始分片操作限制最大支持的集合大小。 请参阅【分片现有集合数据大小】。

> IMPORTANT 重要<br>
> A sharded collection can grow to any size after successful sharding.<br>
> 一个分片集合在成功分片之后就可以增长到任意大小，没有上限。

### Shard Key Cardinality 分片键基数

The [cardinality](https://docs.mongodb.com/manual/reference/glossary/#term-cardinality) of a shard key determines the maximum number of chunks the balancer can create. This can reduce or remove the effectiveness of horizontal scaling in the cluster.<br>
分片键的基数确定平衡器可以创建的最大数据块的数目。这会降低或消除集群中水平缩放的有效性。

A unique shard key value can exist on no more than a single chunk at any given time. If a shard key has a cardinality of 4, then there can be no more than 4 chunks within the sharded cluster, each storing one unique shard key value. This constrains the number of effective shards in the cluster to 4 as well - adding additional shards would not provide any benefit.<br>
在任何给定时间，唯一的分片键值最多只能存在一个块上。 如果分片密钥的基数为4，则分片集群中最多只能有4个块，每个块存储一个唯一的分片密钥值。 这也将群集中的有效分片数量也限制为4个-添加额外的分片不会提供任何好处。

The following image illustrates a sharded cluster using the field X as the shard key. If X has low cardinality, the distribution of inserts may look similar to the following:<br>
下图说明了使用字段X作为分片键的分片群集。 如果X具有低基数，则插入的分布可能类似于以下内容：

![sharded-cluster-ranged-distribution-low-cardinal](https://docs.mongodb.com/manual/_images/sharded-cluster-ranged-distribution-low-cardinal.bakedsvg.svg)

The cluster in this example would _not_ scale horizontally, as incoming writes would only route to a subset of shards.<br>
在此示例中，集群不会水平扩展，因为传入的写入将仅路由到分片的子集。

A shard key with high cardinality does not guarantee even distribution of data across the sharded cluster, though it does better facilitate horizontal scaling. The [frequency](https://docs.mongodb.com/manual/core/sharding-shard-key/#shard-key-frequency) and [rate of change](https://docs.mongodb.com/manual/core/sharding-shard-key/#shard-key-monotonic) of the shard key also contributes to data distribution. Consider each factor when choosing a shard key.<br>
具有高基数的分片键虽然可以更好地促进水平扩展，但不能保证在分片集群中均匀分布数据。 分片键的`频率`和`变化率`也有助于数据分配。 选择分片键时，请考虑每个因素。

If your data model requires sharding on a key that has low cardinality, consider using a [compound index](https://docs.mongodb.com/manual/reference/glossary/#term-compound-index) using a field that has higher relative cardinality.<br>
如果您的数据模型需要在具有低基数的键上分片，请考虑使用具有较高相对基数的字段的`复合索引`。

### Shard Key Frequency 分片键频率

Consider a set representing the range of shard key values - the `frequency` of the shard key represents how often a given value occurs in the data. If the majority of documents contain only a subset of those values, then the chunks storing those documents become a bottleneck within the cluster. Furthermore, as those chunks grow, they may become [indivisible chunks](https://docs.mongodb.com/manual/core/sharding-data-partitioning/#jumbo-chunks) as they cannot be split any further. This reduces or removes the effectiveness of horizontal scaling within the cluster.<br>
考虑一个代表分片键值范围的集合-分片键的频率代表给定值在数据中出现的频率。 如果大多数文档仅包含这些值的子集，那么存储这些文档的数据块将成为群集中的瓶颈。 此外，随着这些数据块的增长，它们可能会变成`不可分割的数据块`，因为它们无法进一步拆分。 这将降低或消除群集内水平扩展的有效性。

The following image illustrates a sharded cluster using the field `X` as the shard key. If a subset of values for `X` occur with high frequency, the distribution of inserts may look similar to the following:<br>
下图说明了使用字段`X`作为分片键的分片群集。 如果`X`值的子集高频出现，则插入的分布可能类似于以下内容：

![sharded-cluster-ranged-distribution-frequency](https://docs.mongodb.com/manual/_images/sharded-cluster-ranged-distribution-frequency.bakedsvg.svg)

A shard key with low frequency does not guarantee even distribution of data across the sharded cluster. The [cardinality](https://docs.mongodb.com/manual/core/sharding-shard-key/#shard-key-cardinality) and [rate of change](https://docs.mongodb.com/manual/core/sharding-shard-key/#shard-key-monotonic) of the shard key also contributes to data distribution. Consider each factor when choosing a shard key.<br>
低频的分片键不能保证整个分片群集中的数据均匀分布。 分片密钥的`基数`和`变化率`也有助于数据分配。 选择分片键时，请考虑每个因素。

If your data model requires sharding on a key that has high frequency values, consider using a compound index using a unique or low frequency value.<br>
如果您的数据模型需要在具有高频值的键上分片，请考虑使用具有唯一或低频值的`复合索引`。

### Monotonically Changing Shard Keys 单调变化的分片键

A shard key on a value that increases or decreases monotonically is more likely to distribute inserts to a single shard within the cluster.<br>
值单调增加或减少的分片键更有可能将插入内容分布到集群中的单个分片上。

This occurs because every cluster has a chunk that captures a range with an upper bound of [maxKey](https://docs.mongodb.com/manual/reference/bson-types/). **maxKey** always compares as higher than all other values. Similarly, there is a chunk that captures a range with a lower bound of [minKey](https://docs.mongodb.com/manual/reference/bson-types/). **minKey** always compares as lower than all other values.<br>
发生这种情况是因为每个集群都有一个大数据块，该大数据块捕获具有`maxKey`上限的范围。 `maxKey`始终比所有其他值更高。 类似地，有一个块用`minKey`的下限捕获范围。 `minKey`总是比所有其他值都低。

If the shard key value is always increasing, all new inserts are routed to the chunk with `maxKey` as the upper bound. If the shard key value is always decreasing, all new inserts are routed to the chunk with `minKey` as the lower bound. The shard containing that chunk becomes the bottleneck for write operations.<br>
如果分片键值始终在增加，则所有新插入都将路由到以`maxKey`为上限的块。 如果分片键值始终在减小，则所有新插入都将路由到以`minKey`为下限的块。 包含该块的分片将成为写操作的瓶颈。

The following image illustrates a sharded cluster using the field `X` as the shard key. If the values for `X` are monotonically increasing, the distribution of inserts may look similar to the following:<br>
下图说明了使用字段`X`作为分片键的分片群集。 如果`X`的值单调增加，则插入的分布可能类似于以下内容：

![sharded-cluster-monotonic-distribution](https://docs.mongodb.com/manual/_images/sharded-cluster-monotonic-distribution.bakedsvg.svg)

If the shard key value was monotonically decreasing, then all inserts would route to `Chunk A` instead.<br>
如果分片键值单调递减，则所有插入都将路由到`数据块A`。

A shard key that does not change monotonically does not guarantee even distribution of data across the sharded cluster. The [cardinality](https://docs.mongodb.com/manual/core/sharding-shard-key/#shard-key-cardinality) and [frequency](https://docs.mongodb.com/manual/core/sharding-shard-key/#shard-key-frequency) of the shard key also contributes to data distribution. Consider each factor when choosing a shard key.<br>
不能单调更改的分片键不能保证整个分片群集中的数据均匀分布。 分片键的`基数`和`频率`也有助于数据分配。 选择分片键时，请考虑每一个因素。

If your data model requires sharding on a key that changes monotonically, consider using [Hashed Sharding](https://docs.mongodb.com/manual/core/hashed-sharding/).<br>
如果您的数据模型需要对单调更改的键进行分片，请考虑使用`哈希分片`。



原文链接：https://docs.mongodb.com/manual/core/sharding-shard-key/

译者：刘翔
