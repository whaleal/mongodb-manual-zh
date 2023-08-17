### 文本索引

> 笔记:
>
> 本页介绍自我管理（非 Atlas）部署的文本搜索功能。对于 MongoDB Atlas 上托管的数据，MongoDB 提供了改进的全文搜索解决方案，[Atlas Search](https://www.mongodb.com/docs/atlas/atlas-search/)

文本索引支持对包含字符串内容的字段进行[文本搜索查询。](https://www.mongodb.com/docs/v7.0/text-search/#std-label-text-search)文本索引可提高在字符串内容中搜索特定单词或短语时的性能。

一个集合只能有**一个**文本索引，但该索引可以涵盖多个字段。

要创建文本索引，请使用以下原型：

```
db.<collection>.createIndex(
   {
      <field1>: "text",
      <field2>: "text",
      ...
   }
)
```

### 文本搜索支持

文本索引支持[`$text`](https://www.mongodb.com/docs/v7.0/reference/operator/query/text/#mongodb-query-op.-text)本地部署上的查询操作。要执行文本搜索，您必须创建文本索引并使用 `$text`查询运算符。

### 用例

在线商店`clothing`集合中的文档包括一个 `description`字段，其中包含描述每个项目的文本字符串。要查找衣服的材质`silk`，请在该字段上创建一个文本索引 `description`，并对带有关键字的文档运行文本搜索查询`silk`。搜索将返回`silk` 该字段中提及的所有文档`description`。

### 开始使用

要了解如何创建文本索引以及在特定用例中使用文本索引，请参阅：

- [创建文本索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/create-text-index/#std-label-create-text-index)
- [创建通配符文本索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/create-wildcard-text-index/#std-label-create-wildcard-text-index)
- [指定文本索引的默认语言](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/specify-text-index-language/#std-label-specify-default-text-index-language)
- [限制扫描的文本索引条目数](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/limit-number-of-items-scanned-for-text-search/#std-label-limit-entries-scanned)

### 细节 

本节描述文本索引的详细信息。

### 复合文本索引

对于包含文本索引键和其他类型键的复合索引，只有文本索引字段决定索引是否引用文档。其他键无法确定索引是否引用文档。

### `sparse`属性

文本索引总是[稀疏的](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-index-type-sparse)。当您创建文本索引时，MongoDB 会忽略该`sparse`选项。

如果现有或新插入的文档缺少文本索引字段（或者该字段为 null 或空数组），MongoDB 不会为该文档添加文本索引条目。

### 存储要求和性能成本

文本索引具有以下存储要求和性能成本：

- 文本索引可能占用大量内存。对于每个插入的文档，在每个索引字段中的每个唯一的词的后处理词形都包含一个索引条目。
- 构建文本索引类似于构建大型的 [多键索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/#std-label-index-type-multi-key)，但比在相同数据上构建简单有序（标量）索引需要更长时间。
- 在构建占用大量内存的文本索引时，确保您的文件描述符拥有足够高的限制。请参阅[推荐设置。](https://www.mongodb.com/docs/v7.0/reference/ulimit/#std-label-ulimit)
- 文本索引会影响写入性能，因为 MongoDB 必须为每个新的源文档的每个索引字段中的每个唯一的词添加一个索引条目。
- 文本索引存储文本字符串的单个单词，而不存储短语或有关文档中单词之间距离的信息。因此，如果整个集合适合在 RAM 中，指定多个词的查询会更快执行。

### 了解更多

- 要了解有关文本索引的更多信息，请参阅：
  - [为文本搜索结果分配权重](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/control-text-search-results/#std-label-control-text-search-results)
  - [文本索引属性](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-properties/#std-label-text-index-properties)
  - [文本索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-restrictions/#std-label-text-index-restrictions)
  - [文本索引版本](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-versions/#std-label-text-index-versions)
- 有关文本搜索示例，请参阅[`$text reference page`.](https://www.mongodb.com/docs/v7.0/reference/operator/query/text/#mongodb-query-op.-text)
- 有关[`$text`](https://www.mongodb.com/docs/v7.0/reference/operator/query/text/#mongodb-query-op.-text)聚合管道中的示例操作，请参阅 [聚合管道中的文本搜索。](https://www.mongodb.com/docs/v7.0/tutorial/text-search-in-aggregation/#std-label-text-agg)