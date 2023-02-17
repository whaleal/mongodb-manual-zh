**支持关键字搜索的模型数据**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-data-for-keyword-search/#model-data-to-support-keyword-search)

>[NOTE]
>
>关键字搜索*不同于*文本搜索或全文搜索，并且不提供词干提取或其他文本处理功能。见[关键字索引的局限性](https://www.mongodb.com/docs/manual/tutorial/model-data-for-keyword-search/#std-label-limit-keyword-indexes)部分了解更多信息。
>
>在 2.4 中，MongoDB 提供了文本搜索功能。有关详细信息，请参阅 [文本索引](https://www.mongodb.com/docs/manual/core/index-text/)。

如果您的应用程序需要对包含文本的字段的内容执行查询，您可以对文本执行精确匹配或 [`$regex`](https://www.mongodb.com/docs/manual/reference/operator/query/regex/#mongodb-query-op.-regex)使用正则表达式模式匹配。但是，对于很多对文本的操作，这些方法并不能满足应用需求。

此模式描述了一种使用 MongoDB 支持关键字搜索以支持应用程序搜索功能的方法，该方法使用存储在与文本字段相同的文档中的数组中的关键字。结合[多键索引](https://www.mongodb.com/docs/manual/core/index-multikey/#std-label-index-type-multikey)，该模式可以支持应用程序的关键字搜索操作。

**模式**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-data-for-keyword-search/#pattern)

要将结构添加到文档以支持基于关键字的查询，请在文档中创建一个数组字段并将关键字作为字符串添加到数组中。然后，您可以在数组上创建[多键索引](https://www.mongodb.com/docs/manual/core/index-multikey/#std-label-index-type-multi-key)并创建从数组中选择值的查询。

>[EXAMPLE]
>
>给定您要提供基于主题的搜索的图书馆卷的集合。对于每个卷，您添加 array `topics`，并根据给定卷的需要添加尽可能多的关键字。
>
>对于`Moby-Dick`卷，您可能有以下文档：
>
>```json
>{ title : "Moby-Dick" ,
>  author : "Herman Melville" ,
>  published : 1851 ,
>  ISBN : 0451526996 ,
>  topics : [ "whaling" , "allegory" , "revenge" , "American" ,
>    "novel" , "nautical" , "voyage" , "Cape Cod" ]
>}
>```
>
>`topics`然后在数组上创建一个多键索引：
>
>```shell
>db.volumes.createIndex( { topics: 1 } )
>```
>
>多键索引为`topics`数组中的每个关键字创建单独的索引条目。例如，索引包含一个条目 `whaling`和另一个条目`allegory`。
>
>然后根据关键字进行查询。例如：
>
>```shell
>db.volumes.findOne( { topics : "voyage" }, { title: 1 } )
>```

>[NOTE]
>
>具有大量元素的数组，例如具有数百或数千个关键字的数组，将在插入时产生更大的索引成本。

**关键字索引的局限性**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-data-for-keyword-search/#limitations-of-keyword-indexes)

MongoDB 可以支持使用特定数据模型和 [多键索引](https://www.mongodb.com/docs/manual/core/index-multikey/#std-label-index-type-multikey)的关键字搜索；但是，这些关键字索引在以下方面不足以与全文产品相媲美：

- *阻止*。MongoDB 中的关键字查询无法为根词或相关词解析关键字。
- *同义词*。基于关键字的搜索功能必须在应用层提供对同义词或相关查询的支持。
- *排名*。本文档中描述的关键字查找不提供加权结果的方法。
- *异步索引*。MongoDB 同步建立索引，这意味着用于关键字索引的索引始终是最新的，并且可以实时运行。但是，异步批量索引对于某些类型的内容和工作负载可能更有效。

 参见

原文 - [Model Data to Support Keyword Search]( https://docs.mongodb.com/manual/tutorial/model-data-for-keyword-search/ )

译者：景圣
