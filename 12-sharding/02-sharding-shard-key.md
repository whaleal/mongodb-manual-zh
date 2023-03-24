**片键**

分片键可以是单个索引[字段](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-field)，也可以是复合索引覆盖的多个字段，[复合索引](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-compound-index)确定集合[文档](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-document)在集群[分片中的分布。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)

MongoDB 将分片键值（或散列分片键值）的跨度划分为不重叠的分片键值（或散列分片键值）范围。每个范围都与一个 [块](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)相关联，MongoDB 尝试在集群中的分片之间均匀分布块。

![分片键值空间的图表被分割成更小的范围或块。](https://www.mongodb.com/docs/manual/images/sharding-range-based.bakedsvg.svg)

shard key 直接关系到 chunk 分发的有效性。请参阅[选择分片键。](https://www.mongodb.com/docs/manual/core/sharding-choose-a-shard-key/#std-label-sharding-shard-key-selection)

**分片键索引**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-shard-key/#shard-key-indexes)

所有分片集合**必须**有一个支持分 [片键](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)的索引。索引可以是分片键上的索引，也可以是分 片键是索引[前缀的](https://www.mongodb.com/docs/manual/core/index-compound/#std-label-compound-index-prefix)[复合](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-compound-index)索引。

- 如果集合为空，[`sh.shardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection)则在分片键上创建索引（如果这样的索引尚不存在）。
- 如果集合不为空，则必须先创建索引才能使用[`sh.shardCollection()`。](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection)

如果删除分片键的最后一个有效索引，则通过仅在分片键上重新创建索引来恢复。

**唯一索引**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-shard-key/#unique-indexes)

MongoDB 可以对范围分片键索引实施唯一性约束。通过在分片键上使用唯一索引，MongoDB 对整个键组合而不是分片键的单个组件强制执行唯一性。

对于范围分片集合，只有以下索引可以是 [唯一的：](https://www.mongodb.com/docs/manual/core/index-unique/)

- 分片键上的索引

- 一个[复合索引](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-compound-index)，其中分片键是一个[前缀](https://www.mongodb.com/docs/manual/core/index-compound/#std-label-compound-index-prefix)

- 默认`_id`索引；**但是**，**如果**该字段**不是**分片键或分片键的前缀，则`_id`索引仅对每个分片强制执行唯一性约束。`_id`

  >[IMPORTANT]
  >
  >**唯一性和 _id 索引**
  >
  >如果该`_id`字段不是分片键或分片键的前缀，则`_id`索引仅对每个分片执行唯一性约束，而**不是**跨分片。
  >
  >例如，考虑一个`{x: 1}`跨越两个分片 A 和 B 的分片集合（带有分片键）。因为`_id`键不是分片键的一部分，所以该集合可能有一个在分片 A 中具有`_id`值的`1`文档和另一个 在分片 B 中具有`_id`值的文档`1`.
  >
  >如果该`_id`字段既不是分片键也不是分片键的前缀，MongoDB 希望应用程序强制`_id`跨分片值的唯一性。

唯一索引约束意味着：

- 对于待分片的集合，如果集合有其他唯一索引，则不能分片。
- 对于已经分片的集合，您不能在其他字段上创建唯一索引。
- 唯一索引为缺少索引字段的文档存储空值；即缺少索引字段被视为`null`索引键值的另一个实例。有关详细信息，请参阅 [唯一索引和缺失字段。](https://www.mongodb.com/docs/manual/core/index-unique/#std-label-unique-index-and-missing-field)

要强制分片键值的唯一性，请将`unique` 参数传递`true`给[`sh.shardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection)方法：

- 如果集合为空，[`sh.shardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection)则在分片键上创建唯一索引（如果这样的索引尚不存在）。
- 如果集合不为空，则必须先创建索引才能使用[`sh.shardCollection()`。](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection)

虽然你可以有一个唯一的[复合索引](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-compound-index)，其中分片键是一个[前缀](https://www.mongodb.com/docs/manual/core/index-compound/#std-label-compound-index-prefix)，但如果使用`unique` 参数，集合必须有一个位于分片键上的唯一索引。

您不能在[散列索引上指定唯一约束。](https://www.mongodb.com/docs/manual/core/index-hashed/#std-label-index-type-hashed)

**缺少片键字段**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-shard-key/#missing-shard-key-fields)

从 4.4 版开始，分片集合中的文档可能缺少分片键字段。要设置缺少的分片键字段，请参阅 [设置缺少的分片键字段。](https://www.mongodb.com/docs/manual/core/sharding-set-missing-shard-key-fields/#std-label-shard-key-missing-set)

**块范围和缺失的分片键字段**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-shard-key/#chunk-range-and-missing-shard-key-fields)

缺少的分片键字段与具有空值的分片键属于相同的块范围。例如，如果分片键在 fields 上`{ x: 1, y: 1 }`，那么：

| 文档丢失分片键     | 落入相同范围                |
| :----------------- | :-------------------------- |
| `{ x: "hello" }`   | `{ x: "hello", y: null }`   |
| `{ y: "goodbye" }` | `{ x: null, y: "goodbye" }` |
| `{ z: "oops" }`    | `{ x: null, y: null }`      |

**读/写操作和缺少分片键字段**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-shard-key/#read-write-operations-and-missing-shard-key-fields)

要定位缺少分片键字段的文档，您可以 在分片[`{ $exists: false }`](https://www.mongodb.com/docs/manual/reference/operator/query/exists/#mongodb-query-op.-exists)键字段上使用过滤条件。例如，如果分片键在 fields 上`{ x: 1, y: 1 }`，您可以通过运行以下查询找到缺少分片键字段的文档：

```shell
db.shardedcollection.find( { $or: [ { x: { $exists: false } }, { y: { $exists: false } } ] } )
```

如果您指定一个[null 相等匹配](https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/)过滤条件（例如`{ x: null }`），则该过滤器将**同时**匹配缺少分片键字段**和**分片键字段设置为的文档`null`。

一些写操作，例如带有`upsert` 规范的写操作，需要在分片键上进行相等匹配。在这些情况下，要以缺少分片键的文档为目标，除了`null`相等匹配之外还要包括另一个过滤条件。例如：

```json
{ _id: <value>, <shardkeyfield>: null } // _id of the document missing shard key
```

 

原文 -  https://docs.mongodb.com/manual/core/sharding-shard-key/ 

译者：陆文龙
