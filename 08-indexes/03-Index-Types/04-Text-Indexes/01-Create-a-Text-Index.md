### 创建文本索引

> 笔记:
>
> 本页介绍自我管理（非 Atlas）部署的文本搜索功能。对于 MongoDB Atlas 上托管的数据，MongoDB 提供了改进的全文搜索解决方案，[atlas搜索。](https://www.mongodb.com/docs/atlas/atlas-search/)

文本索引支持对包含字符串内容的字段进行文本搜索查询。文本索引可提高在字符串内容中搜索特定单词或短语时的性能。

要创建文本索引，请使用[`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) 方法。要索引包含字符串或字符串元素数组的字段，请将字符串指定`"text"`为索引键：

```
db.<collection>.createIndex(
   {
      <field1>: "text",
      <field2>: "text",
      ...
   }
)
```

### 关于此任务

- 一个集合最多可以有一个文本索引。

  图集搜索（适用于[MongoDB 阿特拉斯](https://www.mongodb.com/atlas/database?tck=docs_server)) 支持单个集合上的多个全文搜索索引。要了解更多信息，请参阅[Atlas 搜索文档。](https://www.mongodb.com/docs/atlas/atlas-search/)

- 您可以在单个文本索引中索引多个字段。文本索引最多可以包含 32 个字段。要查看示例，请参阅 [创建复合文本索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/create-text-index/#std-label-compound-text-index-example)

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

以下示例向您展示如何：

- [创建单字段文本索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/create-text-index/#std-label-single-text-index-example)
- [创建复合文本索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/create-text-index/#std-label-compound-text-index-example)

#### 创建单字段文本索引

在字段上创建文本索引`content`：

```
db.blog.createIndex( { "content": "text" } )
```

该索引支持字段上的文本搜索查询`content`。例如，以下查询返回字段`content` 包含字符串 的文档`coffee`：

```
db.blog.find(
   {
      $text: { $search: "coffee" }
   }
)
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

#### 非索引字段的匹配

索引`{ "content": "text" }`仅包含`content`字段，不返回非索引字段的匹配项。例如，以下查询在`blog`集合中搜索字符串 `food`：

```
db.blog.find(
   {
      $text: { $search: "food" }
   }
)
```

前面的查询没有返回任何文档。虽然该字符串`food` 出现在文档`_id: 2`和中`_id: 3`，但它分别出现在 `about`和`keywords`字段中。和字段不包含在文本索引中，因此不会影响文本搜索查询结果`about`。 `keywords`

### 创建复合文本索引

> 笔记:
>
> 在创建本示例中的索引之前,必须删除集合上[任何现有的文本索引](https://www.mongodb.com/docs/v7.0/core/indexes/drop-index/#std-label-drop-an-index)`blog` 。

```
db.blog.createIndex(
   {
      "about": "text",
      "keywords": "text"
   }
)
```

`about`该索引支持 和字段上的文本搜索查询`keywords` 。例如，以下查询返回字符串`food`出现在`about`or`keywords`字段中的文档：

```
db.blog.find(
   {
      $text: { $search: "food" }
   }
)
```

输出：

```
[
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

