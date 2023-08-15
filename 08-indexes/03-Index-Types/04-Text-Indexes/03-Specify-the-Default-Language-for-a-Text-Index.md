## 指定文本索引的默认语言

默认情况下，`default_language`文本索引为`english`。为了提高非英语文本搜索查询的性能，您可以指定与文本索引关联的不同默认语言。

与索引数据关联的默认语言决定后缀词干规则。默认语言还确定哪些特定于语言的停用词（例如英语中的`the`、`an`、`a`和`and`）不被编入索引。

要指定不同的语言，请`default_language`在创建文本索引时使用该选项。要查看可用于文本索引的语言，请参阅 [文本搜索语言](https://www.mongodb.com/docs/v7.0/reference/text-search-languages/#std-label-text-search-languages)。您的操作应该类似于此原型：

```
db.<collection>.createIndex(
   { <field>: "text" },
   { default_language: <language> }
)
```

如果您指定`default_language`值`none`，则文本索引会解析字段中的每个单词（包括停用词），并忽略后缀词干。

### 在你开始之前

创建一个`quotes`包含以下带有西班牙语文本字段的文档的集合：

```
db.quotes.insertMany( [
   {
      _id: 1,
      quote : "La suerte protege a los audaces."
   },
   {
      _id: 2,
      quote: "Nada hay más surrealista que la realidad."
   },
   {
      _id: 3,
      quote: "Es este un puñal que veo delante de mí?"
   },
   {
      _id: 4,
      quote: "Nunca dejes que la realidad te estropee una buena historia."
   }
] )
```

### 	步骤

以下操作在`quote`字段上创建文本索引并将`default_language`设为`spanish`：

```
db.quotes.createIndex(
   { quote: "text" },
   { default_language: "spanish" }
)
```

### 结果

`quote`生成的索引支持使用西班牙语后缀词干规则对字段进行文本搜索查询。例如，以下查询在字段`punal`中搜索关键字`quote`：

```
db.quotes.find(
   {
      $text: { $search: "punal" }
   }
)
```

输出：

```
[
   {
      _id: 3,
      quote: "Es este un puñal que veo delante de mí?"
   }
]
```

尽管该`$search`值设置为`punal`，查询仍将返回包含该单词的文档，`puñal`因为文本索引不[区分变音符号。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-properties/#std-label-text-index-diacritic-insensitivity)

该索引还忽略特定于语言的停用词。例如，尽管文档 包含`_id: 2`单词`hay`，但以下查询不会返回任何文档。`hay`被归类为西班牙语停用词，这意味着它不包含在文本索引中。

```
db.quotes.find(
   {
      $text: { $search: "hay" }
   }
)
```

### 了解更多

- 要为包含多种语言文本的集合创建文本索引，请参阅[为包含多种语言的集合创建文本索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/specify-language-text-index/create-text-index-multiple-languages/#std-label-multiple-language-text-index)
- 要了解其他文本索引属性，请参阅 [文本索引属性。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-properties/#std-label-text-index-properties)