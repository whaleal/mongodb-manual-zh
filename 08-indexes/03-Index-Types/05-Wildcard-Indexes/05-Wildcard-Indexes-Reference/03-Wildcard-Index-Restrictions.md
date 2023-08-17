## 通配符索引限制

本页介绍通配符索引的限制，例如不兼容的属性和不支持的查询模式。

### 复合通配符索引限制

[复合通配符索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/index-wildcard-compound/#std-label-wildcard-index-compound)有以下限制：

* 复合通配符索引只能有一个通配符术语。

  例如，您不能指定以下索引：

  ```
  { userID: 1, "object1.$**": 1, "object2.$**": 1 }
  ```

* a 中的非通配符术语`compound wildcard index`必须是单个关键术语。不允许使用[多键索引项。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/#std-label-index-type-multikey)

* `wildcardProjection`仅当通配符字段为 时，该选项才有效`$**`。`wildcardProjection`当您为通配符索引项指定字段路径时，不能使用。

  这是一个有效的定义：

  ```
  {
      key: { "$**": 1 },
      name: "index_all_with_projection",
      wildcardProjection: {
         "someFields.name": 1,
         "otherFields.values": 1
      }
  }
  ```

  这是一个无效的定义：

  ```
  {
      key: { "someFields.$**": 1 },
      name: "invalid_index",
      wildcardProjection: {
         "someFields.name": 1,
         "otherFields.values": 1
      }
  }
  ```

* 默认情况下该`_id`字段被省略。如果您需要该`_id` 字段：

  - 将通配符索引指定为`$**`
  - 用一个`wildcardProjection`
  - 指定`_id`字段

  ```
  db.studentGrades.createIndex(
     {
        "$**": 1,
     },
     {
        wildcardProjection: {
           _id: 1,
           exams: 1,
           extraCredit: 1
        }
     }
  )
  ```

* 通配符字段和常规字段中不能包含相同的字段。您可以使用 a`wildcardProjection`从通配符模式中排除字段。

  ```
  db.studentGrades.createIndex(
     {
        exams: 1,
        "$**": 1,
        homeworks: 1
     },
     {
        wildcardProjection: {
           exams: 0,
           homeworks: 0
        }
     }
  )
  ```

### 不兼容的索引属性

您不能为通配符索引指定以下属性：

- [TTL](https://www.mongodb.com/docs/v7.0/core/index-ttl/#std-label-index-feature-ttl)
- [独特的](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)

### 不兼容的索引类型

您不能使用通配符语法 ( ) 创建以下索引类型`$.**`：

- [2d（地理空间）](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/#std-label-2d-index)
- [2dsphere（地理空间）](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)
- [散列](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-hashed/#std-label-index-type-hashed)

> 笔记:
>
> **消歧义**
>
> [通配符索引与创建通配符文本索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/create-wildcard-text-index/#std-label-create-wildcard-text-index)不同且不兼容 。通配符索引不支持使用[`$text`](https://www.mongodb.com/docs/v7.0/reference/operator/query/text/#mongodb-query-op.-text)运算符的查询。

### 片键

您不能使用通配符索引作为[分片键索引。](https://www.mongodb.com/docs/v7.0/core/sharding-shard-key/#std-label-sharding-shard-key-indexes)

### 不支持的查询模式

通配符索引不支持以下查询模式：

#### 数组字段不等于`null`

如果给定字段是集合中任何文档中的数组，则通配符索引无法支持查询该字段不等于 的文档`null`。

例如，考虑一个`inventory`在 上具有通配符索引的集合`product_attributes`。如果通配符索引是集合中任何文档中的数组，则**不能**支持以下查询：`product_attributes.tags`

```
db.inventory.find( { $ne : [ "product_attributes.tags", null ] } )

db.inventory.aggregate( [
   {
      $match : { $ne : [ "product_attributes.tags", null ] }
   }
] )
```

#### 文档和数组的相等匹配

通配符索引存储文档或数组内容的条目，而不是文档或数组本身。因此，通配符索引无法支持文档或数组上的精确相等匹配。

例如，考虑一个`inventory`在 上具有通配符索引的集合`product_attributes`。通配符索引不支持以下查询：

```
db.inventory.find(
   {
      "product_attributes" : { "price" : 29.99 }
   }
)

db.inventory.find(
   {
      "product_attributes.tags" : [ "waterproof", "fireproof" ]
   }
)
```

>笔记:
>
>通配符索引**可以**支持字段等于空文档的查询`{}`。

同样，通配符索引不能支持文档和数组上的精确**不等式**匹配。例如，通配符索引 on `product_attributes`不能支持以下查询：

```
db.inventory.aggregate( [
   {
      $match : {
         $ne : [ "product_attributes", { "price" : 29.99 } ]
      }
   }
] )

db.inventory.aggregate( [
   {
      $match : {
         $ne : [ "product_attributes.tags", [ "waterproof", "fireproof" ] ]
      }
   }
] )
```

#### 字段不存在

通配符索引是[稀疏的](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-index-type-sparse)，并且不索引空字段。因此，通配符索引不支持查询不存在字段的文档。

例如，考虑一个`inventory`在 上具有通配符索引的集合`product_attributes`。通配符索引不支持以下查询：

```
db.inventory.find(
   {
      "product_attributes" : { $exists : false }
   }
)

db.inventory.aggregate( [
  {
     $match : {
        "product_attributes" : { $exists : false }
     }
  }
] )
```

#### 多字段查询谓词

通配符索引最多支持*一个*查询谓词字段。这意味着：

- MongoDB 不能使用非通配符索引来支持查询谓词的一部分，也不能使用通配符索引来支持另一部分。
- MongoDB 不能使用多个通配符索引来支持同一查询中的不同谓词。
- 当单个通配符索引可以支持多个查询字段的情况下，MongoDB只能使用通配符索引来支持其中一个查询字段。MongoDB 根据相关通配符索引路径自动选择支持通配符索引的字段。

例如，考虑一个`inventory`在 上具有通配符索引的集合`product_attributes`。通配符索引不能支持以下查询中的所有谓词：

```
db.inventory.find(
   {
      "product_attributes.price": { $gt: 20 },
      "product_attributes.material": "silk",
      "product_attributes.size": "large"
   }
)
```

相反，MongoDB 使用通配符索引仅支持其中一个查询谓词。MongoDB 根据相关通配符索引路径选择支持哪个谓词。不支持的查询谓词显示在[`rejectedPlans`](https://www.mongodb.com/docs/v7.0/reference/explain-results/#mongodb-data-explain.queryPlanner.rejectedPlans)解释 [结果中。](https://www.mongodb.com/docs/v7.0/reference/explain-results/#std-label-explain-results)

> 笔记
>
> **$或行为**
>
> MongoDB 可以使用相同的通配符索引来支持查询[`$or`](https://www.mongodb.com/docs/v7.0/reference/operator/query/or/#mongodb-query-op.-or)或聚合[`$or`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/or/#mongodb-expression-exp.-or) 运算符的每个独立参数。

#### 带排序的查询

**仅当**满足以下所有条件时，MongoDB 才能使用通配符索引来满足 ：[`sort()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.sort/#mongodb-method-cursor.sort)

- 查询规划器选择通配符索引来满足查询谓词。
- [`sort()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.sort/#mongodb-method-cursor.sort)仅指定查询谓词字段**。**
- 指定的字段永远不是数组。

如果不满足上述条件，MongoDB就无法使用通配符索引进行排序。MongoDB 不支持[`sort()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.sort/#mongodb-method-cursor.sort) 需要与查询谓词不同的索引的操作。

考虑集合上的以下通配符索引`products`：

```
db.products.createIndex( { "product_attributes.$**" : 1 } )
```

以下操作查询单个字段 `product_attributes.price`并对该同一字段进行排序：

```
db.products.find(
  { "product_attributes.price" : { $gt : 10.00 } },
).sort(
  { "product_attributes.price" : 1 }
)
```

假设指定的`price`永远不是数组，MongoDB 可以使用`product_attributes.$**`通配符索引来满足[`find()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.find/#mongodb-method-db.collection.find)和[`sort()`。](https://www.mongodb.com/docs/v7.0/reference/method/cursor.sort/#mongodb-method-cursor.sort)