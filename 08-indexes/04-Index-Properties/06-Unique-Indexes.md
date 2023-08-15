## 唯一索引

唯一索引确保索引字段不存储重复值；ie 强制索引字段的唯一性。 默认情况下，MongoDB在创建集合期间在[_id](https://www.mongodb.com/docs/v7.0/core/document/#std-label-document-id-field)字段上创建唯一索引。

> 笔记;
>
> **新的内部格式**
>
> 从 MongoDB 4.2 开始，对于4.2（或更高版本）的[featureCompatibilityVersion](https://www.mongodb.com/docs/v7.0/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv) (fCV)，MongoDB 对唯一索引使用新的内部格式，该格式与早期 MongoDB 版本不兼容。新格式适用于现有的唯一索引以及新创建/重建的唯一索引。

### 创建唯一索引

要创建唯一索引，请使用选项设置为 的[`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) 方法。`unique``true`

```
db.collection.createIndex( <key and index type specification>, { unique: true } )
```

#### 单个字段上的唯一索引

例如，要在集合`user_id`的字段 上创建唯一索引`members`，请在中使用以下操作 [`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
db.members.createIndex( { "user_id": 1 }, { unique: true } )
```

#### 独特复合指数

[您还可以对复合索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound)强制执行唯一约束。[如果对复合索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound)使用唯一约束 ，那么 MongoDB 将强制索引键值*组合的唯一性。*

例如，要在集合的`groupNumber`、`lastname`和`firstname`字段上创建唯一索引`members`，请在中使用以下操作[`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
db.members.createIndex( { groupNumber: 1, lastname: 1, firstname: 1 }, { unique: true } )
```

创建的索引强制、和值的 *组合*具有唯一性。`groupNumber``lastname``firstname`

再举一个例子，考虑一个包含以下文档的集合：

```
{ _id: 1, a: [ { loc: "A", qty: 5 }, { qty: 10 } ] }
```

在和上创建唯一的复合[多键](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/#std-label-index-type-multikey)索引：`a.loc``a.qty`

```
db.collection.createIndex( { "a.loc": 1, "a.qty": 1 }, { unique: true } )
```

唯一索引允许将以下文档插入到集合中，因为索引强制 和值的*组合*的唯一性：`a.loc``a.qty`

```
db.collection.insertMany( [
   { _id: 2, a: [ { loc: "A" }, { qty: 5 } ] },
   { _id: 3, a: [ { loc: "A", qty: 10 } ] }
] )
```

> 提示:
>
> *也可以看看：*
>
> - [跨单独文档的唯一约束](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-unique-separate-documents)
> - [唯一索引和缺失字段](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-unique-index-and-missing-field)

### 行为

#### 限制

MongoDB 无法创建[唯一索引](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)如果集合已包含违反索引唯一约束的数据，则在指定的索引字段上执行此操作。

您不能对[散列索引指定唯一约束。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-hashed/#std-label-index-type-hashed)

#### 在副本集和分片集群上构建唯一索引

对于副本集和分片集群，使用[滚动过程](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-replica-sets/)创建唯一索引要求您在该过程期间停止对集合的所有写入。如果在此过程中无法停止对集合的所有写入，请勿使用滚动过程。相反，通过以下方式在集合上构建唯一索引：

- [`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)在副本集的主节点上发出，或者
- [`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)针对 分片集群发布[`mongos`](https://www.mongodb.com/docs/v7.0/reference/program/mongos/#mongodb-binary-bin.mongos)。

#### 跨单独文档的唯一约束

唯一约束适用于集合中的单独文档。也就是说，唯一索引可以防止*不同的*文档具有相同的索引键值。

由于该约束适用于单独的文档，因此对于唯一的 [多键](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/#std-label-index-type-multikey)索引，只要该文档的索引键值不与另一个文档的索引键值重复，文档就可能具有导致重复索引键值的数组元素。在这种情况下，重复的索引条目仅插入到索引中一次。

例如，考虑包含以下文档的集合：

```
{ _id: 1, a: [ { loc: "A", qty: 5 }, { qty: 10 } ] }
{ _id: 2, a: [ { loc: "A" }, { qty: 5 } ] }
{ _id: 3, a: [ { loc: "A", qty: 10 } ] }
```

`a.loc`在和上创建唯一的复合多键索引`a.qty`：

```
db.collection.createIndex( { "a.loc": 1, "a.qty": 1 }, { unique: true } )
```

如果集合中没有其他文档具有索引键值，则唯一索引允许将以下文档插入到集合中`{ "a.loc": "B", "a.qty": null }`。

```
db.collection.insertOne( { _id: 4, a: [ { loc: "B" }, { loc: "B" } ] } )
```

#### 唯一索引和缺失字段

如果文档在唯一索引中没有索引字段的值，则索引将为该文档存储空值。由于唯一性约束，MongoDB 只允许一个缺少索引字段的文档。如果有多个文档没有索引字段值或缺少索引字段，则索引构建将失败并出现重复键错误。

例如，一个集合在 上有一个唯一索引`x`：

```
db.collection.createIndex( { "x": 1 }, { unique: true } )
```

`x`如果集合尚未包含缺少该字段的文档，则唯一索引允许插入不 带该字段的文档`x`：

```
db.collection.insertOne( { y: 1 } )
```

`x`但是，如果集合已包含缺少该字段的文档，则在插入不带该字段的文档时，唯一索引会出错`x`：

```
db.collection.insertOne( { z: 1 } )
```

由于违反了字段值的唯一约束，操作无法插入文档`x`：

```
WriteResult({
   "nInserted" : 0,
   "writeError" : {
      "code" : 11000,
      "errmsg" : "E11000 duplicate key error index: test.collection.$a.b_1 dup key: { : null }"
   }
})
```

> 提示:
>
> **也可以看看：**
>
> [唯一部分索引](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-unique-partial-indexes)

#### 唯一部分索引

部分索引仅对集合中满足指定过滤表达式的文档进行索引。如果您同时指定了 `partialFilterExpression`和 a[唯一约束](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)，唯一约束仅适用于满足过滤表达式的文档。

如果文档不满足过滤条件，则具有唯一约束的部分索引不会阻止插入不满足唯一约束的文档。有关示例，请参阅 [具有唯一约束的部分索引。](https://www.mongodb.com/docs/v7.0/core/index-partial/#std-label-partial-index-with-unique-constraints)

#### 分片集群和唯一索引

[您不能对散列索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-hashed/#std-label-index-type-hashed)指定唯一约束[。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-hashed/#std-label-index-type-hashed)

对于范围分片集合，只能有以下索引 [独特：](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)

- 片键上的索引
- [复合索引](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-compound-index)，其中分片键是[前缀](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-compound-index-prefix)
- 默认`_id`索引；**但是**，**如果**字段不是分片键或分片键的前缀，则索引仅对每个分片**强制**`_id`执行唯一性约束。`_id`

> 重要的:
>
> **唯一性和 _id 索引**
>
> 如果该`_id`字段不是分片键或分片键的前缀，`_id`则索引仅对每个分片强制执行唯一性约束，而**不是**跨分片强制执行。
>
> 例如，考虑一个跨越`{x: 1}`两个分片 A 和 B 的分片集合（带有 分片键 ）。由于该`_id`键不是分片键的一部分，因此该集合可能包含一个在分片 A 中 `_id`具有值的文档和另一个在分片 B 中具有值的文档。`1``_id``1`
>
> 如果该`_id`字段既不是分片键也不是分片键的前缀，MongoDB 希望应用程序强制`_id`跨分片的值的唯一性。

唯一索引约束意味着：

- 对于待分片的集合，如果该集合还有其他唯一索引，则无法对其进行分片。
- 对于已经分片的集合，不能在其他字段上创建唯一索引。

#### 稀疏和非稀疏唯一索引

从 MongoDB 5.0 开始，具有相同 [键模式的](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndexes/#std-label-key_patterns)[唯一稀疏索引](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-sparse-unique-index) 和[唯一非稀疏](https://www.mongodb.com/docs/v7.0/core/indexes/index-properties/#std-label-unique-index)索引可以存在于单个集合中。

##### 独特且稀疏的索引创建

此示例创建具有相同键模式和不同`sparse`选项的多个索引：

```
db.scoreHistory.createIndex( { score : 1 }, { name: "unique_index", unique: true } )
db.scoreHistory.createIndex( { score : 1 }, { name: "unique_sparse_index", unique: true, sparse: true } )
```

##### 基本和稀疏索引创建

您还可以使用相同的键模式（带或不带稀疏选项）创建基本索引：

```
db.scoreHistory.createIndex( { score : 1 }, { name: "sparse_index", sparse: true } )
db.scoreHistory.createIndex( { score : 1 }, { name: "basic_index" } )
```

##### 具有重复键模式的基本索引和唯一索引

从 MongoDB 5.0 开始，基本索引和唯一索引可以使用相同的[键模式存在。](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndexes/#std-label-key_patterns)

这种关键模式的重复允许向已索引的字段添加唯一索引。

在这个例子中：

使用键模式创建基本索引`{ score : 1 }`并插入三个文档。

```
db.scoreHistory.createIndex( { score : 1 }, { name: "basic_index" } )
db.scoreHistory.insert( { score : 1 } )
db.scoreHistory.insert( { score : 2 } )
db.scoreHistory.insert( { score : 3 } )
```

使用相同的键模式创建唯一索引`{ score : 1 }`。

```
db.scoreHistory.createIndex( { score : 1 }, { name: "unique_index", unique: true } )
```

尝试插入重复`score`文档，但由于唯一索引而失败。

```
db.scoreHistory.insert( { score : 3 } )
```