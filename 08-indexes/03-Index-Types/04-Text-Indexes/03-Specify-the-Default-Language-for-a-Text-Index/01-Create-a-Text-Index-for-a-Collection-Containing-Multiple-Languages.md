### 为包含多种语言的集合创建文本索引

您可以创建文本索引来提高在包含多种语言文本的文档或嵌入文档的集合上运行的文本搜索查询的性能。

如果集合包含采用多种不同语言的文档或嵌入文档，请包含一个名为的字段`language`并将这些文档的语言指定为字段值。要查看可用于文本索引的语言，请参阅[文本搜索语言。](https://www.mongodb.com/docs/v7.0/reference/text-search-languages/#std-label-text-search-languages)

您的插入操作应类似于此示例，以支持多种语言的文本索引：

```
db.<collection>.insertOne(
   {
      <field>: <value>,
      language: <language>
   }
)
```

#### 在你开始之前

创建一个`quotes`包含多语言文档的集合，其中包含以下`language`字段：

```
db.quotes.insertMany(
   {
      _id: 1,
      language: "portuguese",
      original: "A sorte protege os audazes.",
      translation:
        [
           {
              language: "english",
              quote: "Fortune favors the bold."
           },
           {
              language: "spanish",
              quote: "La suerte protege a los audaces."
           }
       ]
   },
   {
      _id: 2,
      language: "spanish",
      original: "Nada hay más surrealista que la realidad.",
      translation:
         [
           {
             language: "english",
             quote: "There is nothing more surreal than reality."
           },
           {
             language: "french",
             quote: "Il n'y a rien de plus surréaliste que la réalité."
           }
         ]
   },
   {
      _id: 3,
      original: "Is this a dagger which I see before me?",
      translation:
      {
         language: "spanish",
         quote: "Es este un puñal que veo delante de mí."
      }
   }
)
```

### 步骤

以下操作在`original`和 `translation.quote`字段上创建文本索引：

```
db.quotes.createIndex( { original: "text", "translation.quote": "text" } )
```

### 结果

`original`生成的索引支持对包含和字段的文档和嵌入文档进行文本搜索查询`translation.quote`。文本索引遵循不同的后缀词干规则，并根据字段中的值忽略特定于每种语言的停用词`language`。

例如，以下查询搜索`french`单词 `réalité`

```
db.quotes.find(
   { $text:
      { $search: "réalité" }
   }
)
```

输出：

```
[
   {
      _id: 2,
      language: 'spanish',
      original: 'Nada hay más surrealista que la realidad.',
      translation: [
         {
            language: 'english',
            quote: 'There is nothing more surreal than reality.'
         },
         {
            language: 'french',
            quote: "Il n'y a rien de plus surréaliste que la réalité."
         }
      ]
   }
]
```

对于不包含该`language`字段的嵌入文档，

- 如果封闭文档包含该`language`字段，则索引将使用嵌入文档的文档语言。
- 否则，索引将使用嵌入文档的默认语言。

对于不包含该`language`字段的文档，索引使用默认语言，即英语。

### 了解更多

- 要在除 之外的字段中指定文本索引语言`language`，请参阅[使用任何字段指定文本索引语言。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/specify-language-text-index/use-any-field-to-specify-language/#std-label-text-index-specify-language-in-field)
- 要了解如何指定文本索引的默认语言，请参阅 [指定文本索引的默认语言。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/specify-text-index-language/#std-label-specify-default-text-index-language)
- 要了解其他文本索引属性，请参阅[文本索引属性。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-properties/#std-label-text-index-properties)

