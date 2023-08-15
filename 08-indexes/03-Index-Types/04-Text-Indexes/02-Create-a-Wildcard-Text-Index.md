### 创建通配符文本索引

您可以创建一个文本索引，其中包含集合中带有字符串数据的每个文档字段。这些文本索引称为**通配符文本索引**。通配符文本索引支持对未知、任意或动态生成的字段[进行文本搜索。](https://www.mongodb.com/docs/v7.0/text-search/#std-label-text-search)

要创建通配符文本索引，请将索引键设置为通配符说明符 ( `$**`) 并将索引值设置为`text`：

```
db.<collection>.createIndex( { "$**": "text" } )
```

### 关于此任务

[通配符文本索引与通配符索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/#std-label-wildcard-index-core)不同。通配符文本索引支持使用[`$text`](https://www.mongodb.com/docs/v7.0/reference/operator/query/text/#mongodb-query-op.-text)运算符的查询，而通配符索引则不支持。

创建通配符文本索引后，当您插入或更新文档时，索引会更新以包含任何新的字符串字段值。因此，通配符文本索引会对插入和更新的性能产生负面影响。

仅当要索引的字段未知或可能更改时才使用通配符文本索引。通配符文本索引在特定字段上的性能不如目标文本索引。如果您的集合包含阻止目标索引的任意字段名称，请考虑重新建模您的架构以具有一致的字段名称。要了解有关目标索引的更多信息，请参阅[创建索引以支持您的查询。](https://www.mongodb.com/docs/v7.0/tutorial/create-indexes-to-support-queries/#std-label-create-indexes-to-support-queries)

### 在你开始之前 

创建`blog`包含以下文档的集合：

```
db.blog.insertMany( [
   {
     _id: 1,
     content: "This morning I had a cup of coffee.",
     about: "beverage",
     keywords: [ "coffee" ]
   },
   {
     _id: 2,
     content: "Who likes chocolate ice cream for dessert?",
     about: "food",
     keywords: [ "poll" ]
   },
   {
     _id: 3,
     content: "My favorite flavors are strawberry and coffee",
     about: "ice cream",
     keywords: [ "food", "dessert" ]
   }
] )
```

### 步骤

在集合上创建通配符文本索引`blog`：

```
db.blog.createIndex( { "$**": "text" } )
```

### 结果

通配符文本索引支持对集合中所有字段进行文本搜索查询。考虑以下查询：

#### 搜索单个单词

查询`blog`集合中的字符串`coffee`：

```
db.blog.find( { $text: { $search: "coffee" } } )
```

输出：

```
[
  {
    _id: 1,
    content: 'This morning I had a cup of coffee.',
    about: 'beverage',
    keywords: [ 'coffee' ]
  },
  {
    _id: 3,
    content: 'My favorite flavors are strawberry and coffee',
    about: 'ice cream',
    keywords: [ 'food', 'dessert' ]
  }
]
```

前面的查询返回在任何字段中包含该字符串的所有文档 `coffee`。

### 搜索多个术语

查询`blog`集合中包含字符串 `poll` **或 的** `coffee`文档：

```
db.blog.find( { $text: { $search: "poll coffee" } } )
```

输出：

```
[
  {
    _id: 1,
    content: 'This morning I had a cup of coffee.',
    about: 'beverage',
    keywords: [ 'coffee' ]
  },
  {
    _id: 3,
    content: 'My favorite flavors are strawberry and coffee',
    about: 'ice cream',
    keywords: [ 'food', 'dessert' ]
  },
  {
    _id: 2,
    content: 'Who likes chocolate ice cream for dessert?',
    about: 'food',
    keywords: [ 'poll' ]
  }
]
```

前面的查询返回包含该字符串`poll` 或`coffee`任何字段的文档。

### 搜索准确的短语

查询`blog`集合中包含短语的文档 `chocolate ice cream`：

```
db.blog.find( { $text: { $search: "\"chocolate ice cream\"" } } )
```

输出：

```
[
  {
    _id: 2,
    content: 'Who likes chocolate ice cream for dessert?',
    about: 'food',
    keywords: [ 'poll' ]
  }
]
```

前面的查询返回在任何字段中包含确切短语的文档 `chocolate ice cream`。

### 了解更多

- 要了解如何控制文本查询结果的排名，请参阅 [为文本搜索结果分配权重。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/control-text-search-results/#std-label-specify-weights)
- 您可以将通配符文本索引作为复合文本索引的一部分包含在内。要了解有关复合文本索引的更多信息，请参阅 [创建复合文本索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/create-text-index/#std-label-compound-text-index-example)
- 要查看文本搜索查询的示例，请参阅[`$text`。](https://www.mongodb.com/docs/v7.0/reference/operator/query/text/#mongodb-query-op.-text)
- 要了解文本索引属性（例如区分大小写），请参阅 [文本索引属性。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-properties/#std-label-text-index-properties)