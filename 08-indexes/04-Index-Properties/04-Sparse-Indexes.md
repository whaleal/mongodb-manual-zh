## 稀疏索引

稀疏索引只包含具有索引字段的文档的条目，即使索引字段包含空值。索引会跳过任何缺少索引字段的文档。该索引是“稀疏”的，因为它不包括集合中的所有文档。相比之下，非稀疏索引包含集合中的所有文档，并为不包含索引字段的文档存储空值。

> 重要的:
>
> [MongoDB 提供了创建部分索引的](https://www.mongodb.com/docs/v7.0/core/index-partial/#std-label-index-type-partial)选项 。部分索引提供了稀疏索引功能的超集。部分索引应优先于稀疏索引。

### 创建稀疏索引

要创建稀疏索引，请使用选项设置为 的[`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) 方法。`sparse``true`

例如，以下操作在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)`xmpp_id`在集合的字段上创建稀疏索引`addresses`：

```
db.addresses.createIndex( { "xmpp_id": 1 }, { sparse: true } )
```

该索引不会索引不包含该`xmpp_id` 字段的文档。

> 笔记:
>
> 不要将 MongoDB 中的稀疏索引与[块级](http://en.wikipedia.org/wiki/Database_index#Sparse_index) 其他数据库中的索引。将它们视为具有特定过滤器的密集索引。

### 行为

#### 稀疏索引和不完整结果

如果稀疏索引会导致查询和排序操作的结果集不完整，MongoDB 将不会使用该索引，除非显式 [`hint()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.hint/#mongodb-method-cursor.hint)指定该索引。

例如，除非明确提示，否则查询`{ x: { $exists: false } }`不会在字段上使用稀疏索引。`x`看 [集合上的稀疏索引无法返回完整结果](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-sparse-index-incomplete-results)详细说明该行为的示例。

如果您包含[`hint()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.hint/#mongodb-method-cursor.hint)指定了 [稀疏索引](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-index-type-sparse)当您执行 [`count()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.count/#mongodb-method-cursor.count)集合中所有文档的操作（即使用空查询谓词）时，即使稀疏索引导致计数不正确，也会使用稀疏索引。

```
db.collection.insertOne( { _id: 1, y: 1 } );
db.collection.createIndex( { x: 1 }, { sparse: true } );

db.collection.find().hint( { x: 1 } ).count();
```

要获得正确的计数，请勿[`hint()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.hint/#mongodb-method-cursor.hint)使用 [稀疏索引](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-index-type-sparse)对集合中的所有文档进行计数时。

```
db.collection.find().count();

db.collection.createIndex( { y: 1 } );
db.collection.find().hint( { y: 1 } ).count();
```

#### 默认情况下稀疏的索引

以下索引类型始终是稀疏的

- [2d](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/#std-label-2d-index)
- [2dsphere（版本 2）](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-v2)
- [文本](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/#std-label-index-feature-text)
- [通配符](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/#std-label-wildcard-index-core)

#### 稀疏复合索引

复合索引可以包含不同类型的稀疏索引。索引类型的组合决定了复合索引如何匹配文档。

下表总结了包含不同类型稀疏索引的复合索引的行为：

| 复合索引组成部分                                             | 复合索引行为                                                 |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| 升序指数降序索引                                             | 仅索引至少包含一个键的值的文档。                             |
| 升序指数降序索引[地理空间索引](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-index-feature-geospatial) | 仅当文档包含某个字段的值时才索引该文档`geospatial`。不按升序或降序索引对文档进行索引。 |
| 升序指数降序索引[文本索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/#std-label-index-feature-text) | 仅当文档与其中一个`text` 字段匹配时才索引该文档。不按升序或降序索引对文档进行索引。 |

#### 稀疏和唯一属性

同时具有稀疏属性和[唯一](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)属性的索引，可以防止集合中的文档在某个字段上具有重复的值，但允许多个文档省略该字段。

### 例子

#### 在集合上创建稀疏索引

考虑一个`scores`包含以下文档的集合：

```
{ "_id" : ObjectId("523b6e32fb408eea0eec2647"), "userid" : "newbie" }
{ "_id" : ObjectId("523b6e61fb408eea0eec2648"), "userid" : "abby", "score" : 82 }
{ "_id" : ObjectId("523b6e6ffb408eea0eec2649"), "userid" : "nina", "score" : 90 }
```

该集合在字段上有一个稀疏索引`score`：

```
db.scores.createIndex( { score: 1 } , { sparse: true } )
```

然后，对集合的以下查询`scores`使用稀疏索引返回字段`score`小于 ( [`$lt`](https://www.mongodb.com/docs/v7.0/reference/operator/query/lt/#mongodb-query-op.-lt))的文档`90`：

```
db.scores.find( { score: { $lt: 90 } } )
```

由于userid的文档`"newbie"`不包含该 `score`字段，不符合查询条件，因此查询可以使用稀疏索引返回结果：

```
{ "_id" : ObjectId("523b6e61fb408eea0eec2648"), "userid" : "abby", "score" : 82 }
```

#### 集合上的稀疏索引无法返回完整结果

考虑一个`scores`包含以下文档的集合：

```
{ "_id" : ObjectId("523b6e32fb408eea0eec2647"), "userid" : "newbie" }
{ "_id" : ObjectId("523b6e61fb408eea0eec2648"), "userid" : "abby", "score" : 82 }
{ "_id" : ObjectId("523b6e6ffb408eea0eec2649"), "userid" : "nina", "score" : 90 }
```

该集合在字段上有一个稀疏索引`score`：

```
db.scores.createIndex( { score: 1 } , { sparse: true } )
```

由于 userid 的文档`"newbie"`不包含该 `score`字段，因此稀疏索引不包含该文档的条目。

考虑以下查询以返回集合中的**所有**文档`scores` （按`score`字段排序）：

```
db.scores.find().sort( { score: -1 } )
```

即使按索引字段排序，MongoDB 也不会**选择** 稀疏索引来完成查询以返回完整结果：

```
{ "_id" : ObjectId("523b6e6ffb408eea0eec2649"), "userid" : "nina", "score" : 90 }
{ "_id" : ObjectId("523b6e61fb408eea0eec2648"), "userid" : "abby", "score" : 82 }
{ "_id" : ObjectId("523b6e32fb408eea0eec2647"), "userid" : "newbie" }
```

要使用稀疏索引，请使用以下命令显式指定索引 [`hint()`：](https://www.mongodb.com/docs/v7.0/reference/method/cursor.hint/#mongodb-method-cursor.hint)

```
db.scores.find().sort( { score: -1 } ).hint( { score: 1 } )
```

使用索引会导致仅返回具有以下字段的文档`score`：

```
{ "_id" : ObjectId("523b6e6ffb408eea0eec2649"), "userid" : "nina", "score" : 90 }
{ "_id" : ObjectId("523b6e61fb408eea0eec2648"), "userid" : "abby", "score" : 82 }
```

> 提示;
>
> **也可以看看：**
>
> - [`explain()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.explain/#mongodb-method-cursor.explain)
> - [分析查询性能](https://www.mongodb.com/docs/v7.0/tutorial/analyze-query-plan/)

#### 具有唯一约束的稀疏索引

考虑一个`scores`包含以下文档的集合：

```
{ "_id" : ObjectId("523b6e32fb408eea0eec2647"), "userid" : "newbie" }
{ "_id" : ObjectId("523b6e61fb408eea0eec2648"), "userid" : "abby", "score" : 82 }
{ "_id" : ObjectId("523b6e6ffb408eea0eec2649"), "userid" : "nina", "score" : 90 }
```

您可以使用以下操作在字段上创建具有[唯一约束](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)和稀疏过滤器的索引：`score`

```
db.scores.createIndex( { score: 1 } , { sparse: true, unique: true } )
```

该索引*将允许*插入具有唯一字段值`score`或*不*包含`score`字段的文档。因此，考虑到`scores`集合中的现有文档，索引允许以下[插入操作：](https://www.mongodb.com/docs/v7.0/tutorial/insert-documents/)

```
db.scores.insertMany( [
   { "userid": "newbie", "score": 43 },
   { "userid": "abby", "score": 34 },
   { "userid": "nina" }
] )
```

但是，索引*不允许*添加以下文档，因为文档已存在且`score`值为`82` 和`90`：

```
db.scores.insertMany( [
   { "userid": "newbie", "score": 82 },
   { "userid": "abby", "score": 90 }
] )
```

#### 稀疏和非稀疏唯一索引

从 MongoDB 5.0 开始，[独特的稀疏](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-sparse-unique-index) 具有相同 [键模式的](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndexes/#std-label-key_patterns)[唯一非稀疏](https://www.mongodb.com/docs/v7.0/core/indexes/index-properties/#std-label-unique-index)索引可以存在于单个集合中

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

