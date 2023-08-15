### 为文本搜索结果分配权重

当 MongoDB 返回文本搜索结果时，它会为每个返回的文档分配一个**分数。**分数表示文档与给定搜索查询的相关性。您可以按分数对返回的文档进行排序，以使最相关的文档首先出现在结果集中。

如果您的[复合索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound)具有多个文本索引键，则可以为每个索引字段指定不同的**权重。**索引字段的权重表示该字段相对于其他索引字段的重要性，权重越高，文本搜索得分越高。

例如，`title`如果您知道用户可能会搜索标题，或者`title`与其他文档字段相比包含更多相关的搜索词，则可以强调字段上的搜索匹配。

索引字段的默认权重为 1。要调整索引字段的权重，请在方法中包含权重选项 [`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)，如下例所示：

```
db.<collection>.createIndex(
   {
     <field1>: "text",
     <field2>: "text",
     ...
   },
   {
     weights: {
       <field1>: <weight>,
       <field2>: <weight>,
       ...
     },
     name: <indexName>
   }
 )
```

> 重要的
>
> 如果在创建索引后更改索引中的权重，MongoDB 需要重新索引该集合。重新索引会对性能产生负面影响，尤其是对于大型集合。有关更多信息，请参阅[在已填充集合上构建索引。](https://www.mongodb.com/docs/v7.0/core/index-creation/#std-label-index-creation-background)

### 关于此任务

您有一个`blog`包含各个博客文章文档的集合。每个文档包含：

- 帖子的内容。
- 帖子涵盖的主题。
- 与帖子相关的关键字列表。

您想要创建文本索引，以便用户可以对博客文章执行文本搜索。您的应用程序支持对内容、主题和关键字的搜索。

您希望该`content`字段上的匹配优先于其他文档字段。`content`使用索引权重为查询结果中的匹配项分配更大的重要性并对查询结果进行排序，以便`content`匹配项首先出现。

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

`text`为每个索引字段创建具有不同权重的索引：

```
db.blog.createIndex(
   {
     content: "text",
     keywords: "text",
     about: "text"
   },
   {
     weights: {
       content: 10,
       keywords: 5
     },
     name: "BlogTextIndex"
   }
 )
```

该`text`指数有以下字段和权重：

- `content`权重为 10。
- `keywords`权重为 5。
- `about`默认权重为 1。

这些权重指示索引字段彼此之间的相对重要性。

### 结果

以下示例显示索引字段的不同权重如何影响结果分数。每个示例都根据 `textScore`每个文档对结果进行排序。要访问文档的`textScore` 属性，请使用[`$meta`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/meta/#mongodb-expression-exp.-meta)运算符。

### `content`和`about`字段中的匹配

以下查询在`blog`集合中的文档中搜索字符串`ice cream`：

```
db.blog.find(
   {
      $text: { $search: "ice cream" }
   },
   {
      score: { $meta: "textScore" }
   }
).sort( { score: { $meta: "textScore" } } )
```

输出：

```
[
  {
    _id: 2,
    content: 'Who likes chocolate ice cream for dessert?',
    about: 'food',
    keywords: [ 'food', 'poll' ],
    score: 12
  },
  {
    _id: 3,
    content: 'My favorite flavors are strawberry and coffee',
    about: 'ice cream',
    keywords: [ 'food', 'dessert' ],
    score: 1.5
  }
]
```

搜索字符串`ice cream`匹配：

- 文档`content`中带有`_id: 2`.
- 文档`about`中带有`_id: 3`.

`content`领域内的术语匹配的`10`影响力（`10:1`权重）是领域内的术语匹配的数倍`keywords`。

### `keywords`和`about`字段中的匹配

以下查询在`blog`集合中的文档中搜索字符串`food`：

```
db.blog.find(
   {
      $text: { $search: "food" }
   },
   {
      score: { $meta: "textScore" }
   }
).sort( { score: { $meta: "textScore" } } )
```

输出：

```
[
  {
    _id: 3,
    content: 'My favorite flavors are strawberry and coffee',
    about: 'ice cream',
    keywords: [ 'food', 'dessert' ],
    score: 5.5
  },
  {
    _id: 2,
    content: "Who likes chocolate ice cream for dessert?",
    about: 'food',
    keywords: [ 'poll' ],
    score: 1.1
  }
]
```

搜索字符串`food`匹配：

- 文档`keywords`中带有`_id: 3`.
- 文档`about`中带有`_id: 2`.

`keywords`领域内的术语匹配的`5`影响力（`5:1`权重）是领域内的术语匹配的数倍`about`。

### 单个文档中的多个匹配项

以下查询在`blog`集合中的文档中搜索字符串`coffee`：

```
db.blog.find(
   {
      $text: { $search: "coffee" }
   },
   {
      score: { $meta: "textScore" }
   }
).sort( { score: { $meta: "textScore" } } )
```

输出：

```
[
  {
    _id: 1,
    content: 'This morning I had a cup of coffee.',
    about: 'beverage',
    keywords: [ 'coffee' ],
    score: 11.666666666666666
  },
  {
    _id: 3,
    content: 'My favorite cake flavors are strawberry and coffee',
    about: 'ice cream',
    keywords: [ 'food', 'dessert' ],
    score: 6
  }
]
```

搜索字符串`coffee`匹配：

- 文档中的和`content`字段带有.`keywords``_id: 1`
- 文档`content`中带有`_id: 3`.

为了计算`score`搜索字符串何时匹配多个字段，MongoDB 将匹配数乘以相应字段的权重并对结果求和。

### 了解更多

要了解有关 MongoDB 中文本搜索的更多信息，请参阅：

- [执行文本搜索（自我管理部署）](https://www.mongodb.com/docs/v7.0/core/link-text-indexes/#std-label-perform-text-search-onprem)
- [文本搜索运算符（自我管理部署）](https://www.mongodb.com/docs/v7.0/core/text-search-operators/#std-label-text-search-operators-onprem)
- [文本搜索语言](https://www.mongodb.com/docs/v7.0/reference/text-search-languages/#std-label-text-search-languages)
- [`$meta`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/meta/#mongodb-expression-exp.-meta)

> 笔记:
>
> **Atlas Search**
>
> 对于 MongoDB Atlas 上托管的数据， [图集搜索](https://www.mongodb.com/docs/atlas/atlas-search/)提供比`text`索引更强大的自定义评分。要了解更多信息，请参阅图集搜索 [评分](https://www.mongodb.com/docs/atlas/reference/atlas-search/scoring/)文档。