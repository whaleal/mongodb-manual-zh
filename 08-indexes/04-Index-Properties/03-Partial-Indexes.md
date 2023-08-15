## 部分索引

部分索引仅对集合中满足指定过滤表达式的文档进行索引。通过对集合中的文档子集建立索引，部分索引具有较低的存储要求，并降低了索引创建和维护的性能成本。

### 创建部分索引

要创建`partial`索引，请使用 [`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)带有 `partialFilterExpression`选项的方法。该`partialFilterExpression` 选项接受使用以下方式指定过滤条件的文档：

- 等式表达式（即`field: value`或使用[`$eq`](https://www.mongodb.com/docs/v7.0/reference/operator/query/eq/#mongodb-query-op.-eq) 运算符），
- [`$exists: true`](https://www.mongodb.com/docs/v7.0/reference/operator/query/exists/#mongodb-query-op.-exists)表达，
- [`$gt`](https://www.mongodb.com/docs/v7.0/reference/operator/query/gt/#mongodb-query-op.-gt), [`$gte`](https://www.mongodb.com/docs/v7.0/reference/operator/query/gte/#mongodb-query-op.-gte), [`$lt`](https://www.mongodb.com/docs/v7.0/reference/operator/query/lt/#mongodb-query-op.-lt),[`$lte`](https://www.mongodb.com/docs/v7.0/reference/operator/query/lte/#mongodb-query-op.-lte)表达式,
- [`$type`](https://www.mongodb.com/docs/v7.0/reference/operator/query/type/#mongodb-query-op.-type)表达式,
- [`$and`](https://www.mongodb.com/docs/v7.0/reference/operator/query/and/#mongodb-query-op.-and)操作员，
- [`$or`](https://www.mongodb.com/docs/v7.0/reference/operator/query/or/#mongodb-query-op.-or)操作员，
- [`$in`](https://www.mongodb.com/docs/v7.0/reference/operator/query/in/#mongodb-query-op.-in)操作员

例如，以下操作创建一个复合索引，仅对字段`rating`大于 5 的文档建立索引。

```
db.restaurants.createIndex(
   { cuisine: 1, name: 1 },
   { partialFilterExpression: { rating: { $gt: 5 } } }
)
```

您可以`partialFilterExpression`为所有 MongoDB [索引类型](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/#std-label-index-types)指定一个选项。当为时间序列集合上的 TTL 索引指定 时 `partialFilterExpression`，您只能对集合进行过滤`metaField`。

> 提示:
>
> **也可以看看：**
>
> 要了解如何在MongoDB Compass中管理索引，请参阅[管理索引。](https://www.mongodb.com/docs/v7.0/tutorial/manage-indexes/#std-label-manage-indexes)

### 行为

#### 查询覆盖率

如果使用部分索引导致结果集不完整，MongoDB 不会使用部分索引进行查询或排序操作。

要使用部分索引，查询必须包含过滤表达式（或指定过滤表达式子集的修改过滤表达式）作为其查询条件的一部分。

例如，给定以下索引：

```
db.restaurants.createIndex(
   { cuisine: 1 },
   { partialFilterExpression: { rating: { $gt: 5 } } }
)
```

`rating: { $gte: 8 }`以下查询可以使用索引，因为查询谓词包含与索引过滤器表达式匹配的文档子集相匹配的条件`rating: { $gt: 5 }`：

```
db.restaurants.find( { cuisine: "Italian", rating: { $gte: 8 } } )
```

但是，以下查询无法在字段上使用部分索引， `cuisine`因为使用索引会导致结果集不完整。具体来说，查询谓词包含条件 `rating: { $lt: 8 }`，而索引包含过滤器`rating: { $gt: 5 }`。也就是说，查询`{ cuisine: "Italian", rating: { $lt: 8 } }`匹配的文档（例如评级等于 1 的意大利餐厅）比索引的文档多。

```
db.restaurants.find( { cuisine: "Italian", rating: { $lt: 8 } } )
```

同样，以下查询也不能使用部分索引，因为查询谓词不包含过滤表达式，使用索引将返回不完整的结果集。

```
db.restaurants.find( { cuisine: "Italian" } )
```

#### 与稀疏索引的比较

部分索引应该优先于[稀疏索引](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-index-type-sparse)。部分索引具有以下优点：

- 更好地控制哪些文档被索引。
- 稀疏索引提供的功能的超集。

*稀疏索引仅*根据索引字段的存在来选择要索引的文档，对于复合索引，则根据索引字段的存在来选择要索引的文档。

部分索引根据指定的过滤器确定索引条目。过滤器可以包括索引键以外的字段，并且可以指定除存在检查之外的条件。例如，部分索引可以实现与稀疏索引相同的行为：

```shell
db.contacts.createIndex(
   { name: 1 },
   { partialFilterExpression: { name: { $exists: true } } }
)
```

此部分索引支持与字段上的稀疏索引相同的查询 `name`。

但是，部分索引还可以在索引键以外的字段上指定过滤表达式。例如，以下操作创建部分索引，其中索引位于字段上`name`，但过滤表达式位于字段上`email`：

```shell
db.contacts.createIndex(
   { name: 1 },
   { partialFilterExpression: { email: { $exists: true } } }
)
```

为了让查询优化器选择此部分索引，查询谓词必须包含字段上的条件`name`以及字段上的*非空*`email`匹配。

例如，以下查询可以使用索引，因为它既包含字段上的条件`name`又包含字段上的非空匹配 `email`：

```
db.contacts.find( { name: "xyz", email: { $regex: /\.org$/ } } )
```

但是，以下查询无法使用索引，因为它在字段上包含空匹配`email`，而过滤表达式不允许这样做 `{ email: { $exists: true } }`：

```
db.contacts.find( { name: "xyz", email: { $exists: false } } )
```

### 限制

从 MongoDB 5.0 开始， 只要[partialFilterExpression](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndexes/#std-label-partialFilterExpression) 字段不表达等效的过滤器，就可以使用相同的[键模式](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndexes/#std-label-key_patterns) 创建多个部分[索引。](https://www.mongodb.com/docs/v7.0/core/index-partial/)

在 MongoDB 的早期版本中， 当使用相同的键模式和不同的[partialFilterExpressions](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndexes/#std-label-partialFilterExpression)时，不允许 创建多个[部分索引](https://www.mongodb.com/docs/v7.0/core/index-partial/)[。](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndexes/#std-label-partialFilterExpression)

您不能同时指定`partialFilterExpression`选项和`sparse`选项。

`_id`索引不能是部分索引。

分片键索引不能是部分索引。

### 例子

#### 在集合上创建部分索引

`restaurants`考虑包含类似于以下内容的文档的集合

```{
   "_id" : ObjectId("5641f6a7522545bc535b5dc9"),
   "address" : {
      "building" : "1007",
      "coord" : [
         -73.856077,
         40.848447
      ],
      "street" : "Morris Park Ave",
      "zipcode" : "10462"
   },
   "borough" : "Bronx",
   "cuisine" : "Bakery",
   "rating" : { "date" : ISODate("2014-03-03T00:00:00Z"),
                "grade" : "A",
                "score" : 2
              },
   "name" : "Morris Park Bake Shop",
   "restaurant_id" : "30075445"
}
```

`borough`您可以在和字段上添加部分索引，`cuisine`选择仅索引该`rating.grade` 字段所在的文档`A`：

```
db.restaurants.createIndex(
   { borough: 1, cuisine: 1 },
   { partialFilterExpression: { 'rating.grade': { $eq: "A" } } }
)
```

然后，对集合的以下查询`restaurants`使用部分索引返回布朗克斯中`rating.grade`等于 的餐馆`A`：

```
db.restaurants.find( { borough: "Bronx", 'rating.grade': "A" } )
```

但是，以下查询不能使用部分索引，因为查询表达式不包含该`rating.grade`字段：

```shell
db.restaurants.find( { borough: "Bronx", cuisine: "Bakery" } )
```

#### 具有唯一约束的部分索引

部分索引仅对集合中满足指定过滤表达式的文档进行索引。如果您同时指定 `partialFilterExpression`和[唯一约束](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)，则唯一约束仅适用于满足过滤表达式的文档。如果文档不满足过滤条件，则具有唯一约束的部分索引不会阻止插入不满足唯一约束的文档。

例如，一个集合`users`包含以下文档：

```shell
{ "_id" : ObjectId("56424f1efa0358a27fa1f99a"), "username" : "david", "age" : 29 }
{ "_id" : ObjectId("56424f37fa0358a27fa1f99b"), "username" : "amanda", "age" : 35 }
{ "_id" : ObjectId("56424fe2fa0358a27fa1f99c"), "username" : "rajiv", "age" : 57 }
```

以下操作创建一个索引，该索引指定字段的[唯一约束](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)`username`和部分过滤表达式`age: { $gte: 21 }`。

```shell
db.users.createIndex(
   { username: 1 },
   { unique: true, partialFilterExpression: { age: { $gte: 21 } } }
)
```

该索引会阻止插入以下文档，因为具有指定用户名的文档已存在且字段`age` 大于`21`：

```shell
db.users.insertMany( [
   { username: "david", age: 27 },
   { username: "amanda", age: 25 },
   { username: "rajiv", age: 32 }
] )
```

但是，以下具有重复用户名的文档是允许的，因为唯一约束仅适用于`age` 大于或等于 21 的文档。

```shell
db.users.insertMany( [
   { username: "david", age: 20 },
   { username: "amanda" },
   { username: "rajiv", age: null }
] )
```

