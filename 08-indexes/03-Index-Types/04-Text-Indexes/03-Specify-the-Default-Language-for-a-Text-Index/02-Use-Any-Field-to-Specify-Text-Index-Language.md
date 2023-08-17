## 使用任何字段指定文本索引语言

文本索引的语言决定了运行文本搜索查询时用于解析词干词和忽略停用词的规则。

默认情况下，如果文本索引没有[默认语言](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/specify-text-index-language/#std-label-specify-text-index-language)，则索引使用`language` 文档字段来确定它使用的语言。因此，文本索引不限于单一语言，因为 `language`字段的值可以在文档之间发生变化。

您可以更改索引用于确定其语言的字段。如果您的字段名称不是英文，并且您的文档没有名为 的字段，这非常有用`language`。

要在 以外的字段中指定文本索引语言`language`，请`language_override`在创建索引时包含以下选项：

```
db.<collection>.createIndex(
   { <field> : "text" },
   { language_override: "<field>" }
)
```

文本索引使用选项中指定的字段`language_override` 来确定相应文档使用的语言。

对于不包含 中指定字段的文档 `language_override`，索引使用英语作为其语言。

### 在你开始之前

创建`quotes`集合：

```
db.quotes.insertMany(
   [
      {
         _id: 1,
         idioma: "portuguese",
         quote: "A sorte protege os audazes"
      },
      {
         _id: 2,
         idioma: "spanish",
         quote: "Nada hay más surrealista que la realidad."
      },
      {
         _id: 3,
         idioma: "english",
         quote: "is this a dagger which I see before me"
      }
   ]
)
```

每个报价的语言在`idioma`字段中指定。

### 步骤

在字段上创建文本索引`quote`。指定 `language_override`使文本索引使用 `idioma`语言字段的选项：

```
db.quotes.createIndex(
   { quote : "text" },
   { language_override: "idioma" }
)
```

### 结果

该索引支持对字段进行文本搜索查询`quote`，并根据字段中指定的语言使用语言规则`idioma`。每个文档在该字段中指定不同的值`idioma`，这意味着每个文档都使用不同的语言规则进行搜索。

考虑以下示例：

### 搜索有效术语

以下查询搜索字符串`audazes`：

```
db.quotes.find(
   {
      $text: { $search: "audazes" }
   }
)
```

输出：

```
[
  { _id: 1, idioma: 'portuguese', quote: 'A sorte protege os audazes' }
]
```

前面的查询使用葡萄牙语作为完成查询的语言。

### 搜索停用词

以下查询搜索字符串`hay`：

```
db.quotes.find(
   {
      $text: { $search: "hay" }
   }
)
```

即使字符串`hay` 出现在`quote`document 字段中，前面的查询也不会返回任何结果`_id: 2`。

文档`_id: 2`指定西班牙语语言。`hay`在西班牙语中被视为停用词，因此不包含在文本索引中。

### 了解更多

- 要查看可用于文本索引的语言，请参阅 [文本搜索语言。](https://www.mongodb.com/docs/v7.0/reference/text-search-languages/#std-label-text-search-languages)
- 要了解如何为整个文本索引指定默认语言，请参阅[指定文本索引的默认语言。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/specify-text-index-language/#std-label-specify-text-index-language)
- 要查看文本索引限制，请参阅[文本索引限制。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-restrictions/#std-label-text-index-restrictions)