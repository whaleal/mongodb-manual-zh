## ESR（Equality, Sort, Range）规则

引用多个字段的索引是[复合索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound)。复合索引可以显着提高查询响应时间。

索引键对应于文档字段。大多数情况下，应用ESR（相等、排序、范围）规则来排列索引键有助于创建更高效的[复合索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound)

本页介绍 ESR 规则。有关调优查询的更多信息，请参阅[`explain`](https://www.mongodb.com/docs/v7.0/reference/command/explain/#mongodb-dbcommand-dbcmd.explain)查询 [计划。](https://www.mongodb.com/docs/v7.0/core/query-plans/#std-label-query-plans-query-optimization)

> 提示:
>
> 要强制 MongoDB 使用特定索引，请在测试索引时使用[cursor.hint()](https://www.mongodb.com/docs/v7.0/reference/method/cursor.hint/#std-label-cursor-hint) 。

### Equality

“Equality”是指单个值的精确匹配。以下完全匹配查询扫描 cars 集合，以查找 model 字段与 Cordoba 完全匹配的文档。

```
db.cars.find( { model: "Cordoba" } )
db.cars.find( { model: { $eq: "Cordoba" } } )
```

索引搜索有效地利用精确匹配来限制满足查询所需检查的文档数量。将需要精确匹配的字段首先放置在索引中。

一个索引可能有多个键用于精确匹配的查询。相等匹配的索引键可以按任何顺序出现。但是，为了满足与索引的相等匹配，精确匹配的所有索引键必须位于任何其他索引字段之前。MongoDB 的搜索算法消除了以特定顺序排列精确匹配字段的任何需要。

精确匹配应该是有选择性的。为了减少扫描的索引键数量，请确保相等测试消除至少 90% 可能的文档匹配。

### Sort

“Sort”确定结果的顺序。排序遵循相等匹配，因为相等匹配减少了需要排序的文档数量。在相等匹配之后进行排序还允许 MongoDB 进行非阻塞排序。

当查询字段是索引键的子集时，索引可以支持排序操作。仅当查询包含排序键之前的所有前缀键的相等条件时，才支持对索引键子集进行排序操作。有关详细信息，请参阅： [索引的排序和无前缀子集。](https://www.mongodb.com/docs/v7.0/tutorial/sort-results-with-indexes/#std-label-sort-index-nonprefix-subset)

以下示例查询`cars`集合。输出按以下顺序排序`model`：

```
db.cars.find( { manufacturer: "GM" } ).sort( { model: 1 } )
```

`manufacturer` 为了提高查询性能，请在和字段上创建索引`model`：

```
db.cars.createIndex( { manufacturer: 1, model: 1 } )
```

- `manufacturer`是第一个键，因为它是相等匹配。
- `model``1`以与查询相同的顺序 ( ) 建立索引。

### Range

“Range”过滤扫描字段。扫描不需要精确匹配，这意味着范围过滤器松散地绑定到索引键。为了提高查询效率，请使范围边界尽可能严格，并使用相等匹配来限制必须扫描的文档数量。

范围过滤器类似于以下内容：

```
db.cars.find( { price: { $gte: 15000} } )
db.cars.find( { age: { $lt: 10 } } )
db.cars.find( { priorAccidents: { $ne: null } } )
```

MongoDB 无法对范围过滤器的结果进行索引排序。将范围过滤器放在排序谓词之后，以便 MongoDB 可以使用非阻塞索引排序。有关阻塞排序的更多信息，请参阅 [`cursor.allowDiskUse()`。](https://www.mongodb.com/docs/v7.0/reference/method/cursor.allowDiskUse/#mongodb-method-cursor.allowDiskUse)

### 其他注意事项

等号运算符 或[`$ne`](https://www.mongodb.com/docs/v7.0/reference/operator/query/ne/#mongodb-query-op.-ne)是[`$nin`](https://www.mongodb.com/docs/v7.0/reference/operator/query/nin/#mongodb-query-op.-nin)范围运算符，而不是等号运算符。

[`$regex`](https://www.mongodb.com/docs/v7.0/reference/operator/query/regex/#mongodb-query-op.-regex)是一个范围运算符。

[`$in`](https://www.mongodb.com/docs/v7.0/reference/operator/query/in/#mongodb-query-op.-in)可以是相等运算符或范围运算符。当[`$in`](https://www.mongodb.com/docs/v7.0/reference/operator/query/in/#mongodb-query-op.-in)单独使用时，它是一个相等运算符，执行一系列相等匹配。[`$in`](https://www.mongodb.com/docs/v7.0/reference/operator/query/in/#mongodb-query-op.-in)与 一起使用时，其作用类似于范围运算符`.sort()`。

### 例子

以下查询在`cars`集合中搜索福特制造的价格超过 15,000 美元的车辆。结果按型号排序：

```
db.cars.find(
   {
       manufacturer: 'Ford',
       cost: { $gt: 15000 }
   } ).sort( { model: 1 } )
```

该查询包含 ESR 规则的所有元素：

- `manufacturer: 'Ford'`是基于平等的匹配
- `cost: { $gt: 15000 }`是基于范围的匹配，并且
- `model`用于排序

根据 ESR 规则，示例查询的最佳索引为：

```
{ manufacturer: 1, model: 1, cost: 1 }
```

## 进一步讨论

许多 MongoDB 会议演讲深入讨论了 ESR 规则。

- [有效索引的提示和技巧](https://www.slideshare.net/mongodb/mongodb-local-toronto-2019-tips-and-tricks-for-effective-indexing)
- [错误查询的景象（和气味）](https://www.slideshare.net/mongodb/mongodb-world-2019-the-sights-and-smells-of-a-bad-query)
- [MongoDB 查询和索引的提示和技巧++](https://www.slideshare.net/mongodb/mongodb-world-2019-tips-and-tricks-for-querying-and-indexing-mongodb)