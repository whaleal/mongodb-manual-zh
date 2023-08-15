## 通配符索引

MongoDB 支持在一个字段或一组字段上创建索引，以提高查询性能。MongoDB 支持[灵活的模式](https://www.mongodb.com/docs/v7.0/core/data-modeling-introduction/#std-label-manual-data-modeling-intro)，这意味着集合中的文档字段名称可能有所不同。使用通配符索引支持对任意或未知字段的查询。

要创建通配符索引，请使用通配符说明符 ( `$**`) 作为索引键：

```
db.collection.createIndex( { "$**": <sortOrder> } )
```

您可以使用以下命令创建通配符索引：

- [`createIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#mongodb-dbcommand-dbcmd.createIndexes)
- [`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)
- [`db.collection.createIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndexes/#mongodb-method-db.collection.createIndexes)

### 用例

仅当您要索引的字段未知或可能更改时才使用通配符索引。通配符索引在特定字段上的性能不如目标索引。如果您的集合包含阻止目标索引的任意字段名称，请考虑重新建模您的架构以具有一致的字段名称。要了解有关目标索引的更多信息，请参阅 [创建索引以支持您的查询。](https://www.mongodb.com/docs/v7.0/tutorial/create-indexes-to-support-queries/#std-label-create-indexes-to-support-queries)

在以下场景中考虑使用通配符索引：

- 如果您的应用程序查询字段名称因文档而异的集合，请创建通配符索引以支持对所有可能的文档字段名称的查询。
- 如果您的应用程序重复查询子字段不一致的嵌入文档字段，请创建通配符索引以支持对所有子字段的查询。
- 如果您的应用程序查询具有共同特征的文档。复合通配符索引可以有效地覆盖对具有公共字段的文档的许多查询。要了解更多信息，请参阅 [复合通配符索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/index-wildcard-compound/#std-label-wildcard-index-compound)

### 开始使用

您可以使用通配符索引执行以下任务：

- [在单个字段上创建通配符索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/create-wildcard-index-single-field/#std-label-create-wildcard-index-single-field)
- [在通配符索引中包含或排除字段](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/create-wildcard-index-multiple-fields/#std-label-create-wildcard-index-multiple-fields)
- [在所有字段上创建通配符索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/create-wildcard-index-all-fields/#std-label-create-wildcard-index-all-fields)
- [创建复合通配符索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/index-wildcard-compound/#std-label-create-wildcard-index-compound)

### 细节

通配符索引的行为如下：

- 您可以在集合中创建多个通配符索引。
- 通配符索引可以覆盖与集合中其他索引相同的字段。
- 通配符索引`_id`默认省略该字段。要将 `_id`字段包含在通配符索引中，您必须`wildcardProjection`通过指定 来显式地将其包含在文档中`{ "_id" : 1 }`。
- 通配符索引是[稀疏索引](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-index-type-sparse)，仅包含具有索引字段的文档的条目，即使索引字段包含空值也是如此。
- [通配符索引与通配符文本索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/create-wildcard-text-index/#std-label-create-wildcard-text-index)不同且不兼容 。通配符索引不支持使用[`$text`](https://www.mongodb.com/docs/v7.0/reference/operator/query/text/#mongodb-query-op.-text)运算符的查询。

### 覆盖查询

仅当满足以下所有条件**时**，通配符索引才能支持[覆盖查询：](https://www.mongodb.com/docs/v7.0/core/query-optimization/#std-label-covered-queries)

- 查询规划器选择通配符索引来满足查询谓词。
- 查询谓词*恰好*指定了通配符索引所覆盖的一个字段。
- 查询投影显式排除并*仅*`_id`包含 查询字段。
- 指定的查询字段绝不是数组。

考虑集合上的以下通配符索引`employees`：

```
db.employees.createIndex( { "$**" : 1 } )
```

以下操作查询单个字段`lastName`并从结果文档中投影出所有其他字段：

```
db.employees.find(
  { "lastName" : "Doe" },
  { "_id" : 0, "lastName" : 1 }
)
```

如果指定的`lastName`不是数组，MongoDB可以使用 `$**`通配符索引来支持覆盖查询。

### 了解更多

要了解有关通配符索引的更多信息，请参阅：

- [通配符索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/reference/restrictions/#std-label-wildcard-index-restrictions)
- [嵌入式对象和数组的通配符索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/reference/embedded-object-behavior/#std-label-wildcard-index-embedded-object-behavior)
- [通配符索引签名](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/reference/wildcard-projection-signature/#std-label-wildcard-projection-signature)
- [带排序的查询](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/reference/restrictions/#std-label-wildcard-index-sort)