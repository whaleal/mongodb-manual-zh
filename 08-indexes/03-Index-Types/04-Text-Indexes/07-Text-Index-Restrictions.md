## 文本索引限制

文本索引有以下限制：

### 每个集合一个文本索引

一个集合最多可以有一个文本索引。

图集搜索（适用于[MongoDB 阿特拉斯](https://www.mongodb.com/atlas/database?tck=docs_server)) 支持单个集合上的多个全文搜索索引。要了解更多信息，请参阅[Atlas 搜索文档。](https://www.mongodb.com/docs/atlas/atlas-search/)

### 文本搜索和提示

如果查询包含[`$text`](https://www.mongodb.com/docs/v7.0/reference/operator/query/text/#mongodb-query-op.-text)表达式，则无法 [`hint()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.hint/#mongodb-method-cursor.hint)指定用于查询的索引。

### 文本索引和排序

文本索引无法提高排序操作的性能。此限制适用于单字段和复合文本索引。

### 复合文本索引

复合[索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound)可以包括文本索引键与升序和降序索引键的组合。但是，复合文本索引有以下限制：

- 复合文本索引不能包含任何其他特殊索引类型，例如[多键](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/#std-label-index-type-multi-key)或[地理空间](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-geospatial/#std-label-geospatial-index)索引字段。
- 如果复合文本索引包含文本索引键**之前的**[`$text`](https://www.mongodb.com/docs/v7.0/reference/operator/query/text/#mongodb-query-op.-text)键，则要执行搜索，查询谓词必须包含前面的键的**相等匹配条件。**
- 创建复合文本索引时，所有文本索引键必须在索引规范文档中相邻列出。

有关复合文本索引的示例，请参阅以下页面：

- [创建复合文本索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/create-text-index/#std-label-compound-text-index-example)
- [限制扫描的文本索引条目数](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/limit-number-of-items-scanned-for-text-search/#std-label-limit-entries-scanned)

### 排序选项

文本索引仅支持二进制比较，不支持 [排序](https://www.mongodb.com/docs/v7.0/reference/collation/#std-label-collation)选项。二进制比较比较每个字符串中每个字符的 Unicode 数字值，并且不考虑字母大小写或重音符号。

要在具有非简单排序规则的集合上创建文本索引，您必须`{ collation: { locale: "simple" } }`在创建索引时显式指定。

例如，考虑一个`collationTest`以排序规则命名的集合`{ locale: "en" }`：

```
db.createCollection(
   "collationTest",
   {
      collation: { locale: "en" }
   }
)
```

要在集合上创建文本索引`collationTest`，您必须指定`{ collation: { locale: "simple" } }`。以下命令在`quotes`字段上创建文本索引：

```
db.collationTest.createIndex(
   {
      quotes: "text"
   },
   {
      collation: { locale: "simple" }
   }
)
```

