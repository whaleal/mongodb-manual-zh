## 创建索引来支持你的查询

当索引包含查询扫描的所有字段时，索引支持查询。查询扫描索引而不是集合。创建支持查询的索引可以大大提高查询性能。

本文档描述了创建支持查询的索引的策略。

### 如果所有查询都使用相同的单键，则创建单键索引

如果您只查询给定集合中的单个键，那么您只需为该集合创建一个单键索引。`category`例如，您可以在集合中创建索引`product`：

```
db.products.createIndex( { "category": 1 } )
```

#### 创建复合索引以支持多种不同的查询

如果您有时仅查询一个键，而有时则对该键与第二个键组合进行查询，则创建复合索引比创建单键索引更有效。MongoDB 将为这两个查询使用复合索引。例如，您可以在 和 上创建`category`索引`item`。

```
db.products.createIndex( { "category": 1, "item": 1 } )
```

这允许您两种选择。可以只查询，也可以组合`category`查询。多个字段上的单个[复合索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound)可以支持搜索这些字段的“前缀”子集的所有查询。`category``item`

**例子:**

集合上的以下索引：

```
{ x: 1, y: 1, z: 1 }
```

可以支持以下索引支持的查询：

```
{ x: 1 }
{ x: 1, y: 1 }
```

在某些情况下，前缀索引可以提供更好的查询性能：例如，如果`z`是一个大数组。

该`{ x: 1, y: 1, z: 1 }`索引还可以支持许多与以下索引相同的查询：

```
{ x: 1, z: 1 }
```

此外，`{ x: 1, z: 1 }`还有一个额外的用途。给出以下查询：

```
db.collection.find( { x: 5 } ).sort( { z: 1} )
```

索引`{ x: 1, z: 1 }`同时支持查询和排序操作，而`{ x: 1, y: 1, z: 1 }`索引只支持查询。有关排序的更多信息，请参阅 [使用索引对查询结果进行排序。](https://www.mongodb.com/docs/v7.0/tutorial/sort-results-with-indexes/#std-label-sorting-with-indexes)

### 创建索引以支持文本搜索

对于托管在 MongoDB Atlas 上的数据，您可以使用 Atlas Search 索引支持全文搜索。要了解更多信息，请参阅[创建 Atlas 搜索索引。](https://www.mongodb.com/docs/atlas/atlas-search/create-index/)

对于自我管理（非Atlas）部署，MongoDB 提供了一种`text` 索引类型，支持在集合中搜索字符串内容。要了解有关自我管理文本索引的更多信息，请参阅 [文本索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/#std-label-index-feature-text)

### 索引的使用和整理

要使用索引进行字符串比较，操作还必须指定相同的排序规则。也就是说，如果操作指定了不同的排序规则，则具有排序规则的索引无法支持对索引字段执行字符串比较的操作。

例如，集合在带有排序规则 locale 的`myColl`字符串字段上有一个索引。`category``"fr"`

```
db.myColl.createIndex( { category: 1 }, { collation: { locale: "fr" } } )
```

以下查询操作，指定与索引相同的排序规则，可以使用索引：

```
db.myColl.find( { category: "cafe" } ).collation( { locale: "fr" } )
```

但是，以下查询操作（默认情况下使用“简单”二进制整理器）无法使用索引：

```
db.myColl.find( { category: "cafe" } )
```

对于索引前缀键不是字符串、数组和嵌入文档的复合索引，指定不同排序规则的操作仍然可以使用索引来支持索引前缀键的比较。

例如，集合`myColl`在数字字段`score`和`price`以及字符串字段 上有一个复合索引`category`；该索引是使用用于字符串比较的排序规则区域设置创建的 `"fr"`：

```
db.myColl.createIndex(
   { score: 1, price: 1, category: 1 },
   { collation: { locale: "fr" } } )
```

以下操作使用`"simple"`二进制排序规则对索引`category`字段进行字符串比较，可以使用索引仅完成`score: 5`查询的一部分：

```
db.myColl.find( { score: 5, category: "cafe" } )
```