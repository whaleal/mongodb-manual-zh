****数据库参考****[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/database-references/#database-references)

对于 MongoDB 中的许多用例，相关数据存储在单个[文档](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-document)中的非规范化数据模型是最佳的。但是，在某些情况下，将相关信息存储在单独的文档中是有意义的，通常是在不同的集合或数据库中。

>[IMPORTANT]
>
>您可以使用[`$lookup`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup)管道阶段对同一数据库中的未分片集合执行左外连接。
>
>您还可以使用[`$graphLookup`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/graphLookup/#mongodb-pipeline-pipe.-graphLookup)管道阶段加入未分片的集合以执行递归搜索。

此页面概述了在 [`$lookup`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup)和[`$graphLookup`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/graphLookup/#mongodb-pipeline-pipe.-graphLookup)管道阶段之前的替代过程。

MongoDB 应用程序使用以下两种方法之一来关联文档：

- [手册参考](https://www.mongodb.com/docs/manual/reference/database-references/#std-label-document-references)将一个文档的字段保存 `_id`在另一个文档中作为参考。您的应用程序运行第二个查询以返回相关数据。这些参考对于大多数用例来说简单且足够。
- [数据库引用](https://www.mongodb.com/docs/manual/reference/database-references/#std-label-dbref-explanation)是从一个文档到另一个文档的引用，使用第一个文档的`_id`字段、集合名称、可选的数据库名称以及任何其他字段的值。DBRefs 允许您更轻松地引用存储在多个集合或数据库中的文档。

要解析 DBRef，您的应用程序必须执行额外的查询以返回引用的文档。一些[MongoDB 驱动程序](https://www.mongodb.com/docs/drivers/)提供辅助方法使 DBRefs 能够解析为文档，但这不会自动发生。

DBRefs 提供了一种通用格式和类型来表示文档之间的关系。如果您的数据库必须与多个框架和工具交互，DBRef 格式还提供了表示文档之间链接的通用语义。

除非您有令人信服的理由使用 DBRef，否则请改用手动引用。

**手册参考**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/database-references/#manual-references)

**背景**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/database-references/#background)

[手动引用是将一个文档的](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-document) `_id`字段包含在另一个文档中的做法 。然后应用程序可以发出第二个查询以根据需要解析引用的字段。

**过程**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/database-references/#process)

考虑以下插入两个文档的操作，使用第一个文档的 `_id`字段作为第二个文档中的引用：

```shell
original_id = ObjectId()

db.places.insertOne({
    "_id": original_id,
    "name": "Broadway Center",
    "url": "bc.example.net"
})

db.people.insertOne({
    "name": "Erin",
    "places_id": original_id,
    "url":  "bc.example.net/Erin"
})
```

然后，当查询从集合中返回文档时，如果需要，您可以对集合中字段`people`引用的文档进行第二次查询。`places_id``places`

**采用**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/database-references/#use)

对于几乎所有想要存储两个文档之间关系的情况，请使用[手册参考](https://www.mongodb.com/docs/manual/reference/database-references/#std-label-document-references). 引用很容易创建，您的应用程序可以根据需要解析引用。

手动链接的唯一限制是这些引用不传达数据库和集合名称。如果单个集合中的文档与多个集合中的文档相关，则可能需要考虑使用 DBRefs。

**数据库引用**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/database-references/#dbrefs)

**背景**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/database-references/#background-1)

DBRefs 是表示[文档](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-document)的约定，而不是特定的引用类型。`_id`除了来自字段的值之外，它们还包括集合的名称，在某些情况下还包括数据库名称。

可选地，DBRefs 可以包含任意数量的其他字段。额外的字段名称必须遵循 服务器版本强加的任何[字段名称规则。](https://www.mongodb.com/docs/manual/reference/limits/#std-label-limit-restrictions-on-field-names)

**格式**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/database-references/#format)

DBRef 具有以下字段：

- `$ref`

  该`$ref`字段包含引用文档所在的集合的名称。

- `$id`

  该`$id`字段包含`_id`引用文档中字段的值。

- `$db`

  *选修的。*包含引用文档所在的数据库的名称。

>[EXAMPLE]
>
>DBRef 文档类似于以下文档：
>
>```json
>{ "$ref" : <value>, "$id" : <value>, "$db" : <value> }
>```
>
>考虑在字段中存储 DBRef 的集合中的文档 `creator`：
>
>```json
>{
>  "_id" : ObjectId("5126bbf64aed4daf9e2ab771"),
>  // .. application fields
>  "creator" : {
>                  "$ref" : "creators",
>                  "$id" : ObjectId("5126bc054aed4daf9e2ab772"),
>                  "$db" : "users",
>                  "extraField" : "anything"
>               }
>}
>```
>
>此示例中的 DBRef 指向数据库 `creators` 集合中的文档，该文档在其字段中具有。它还包含一个可选字段。`users``ObjectId("5126bc054aed4daf9e2ab772")``_id`

>[NOTE]
>
>DBRef 中字段的顺序很重要，使用 DBRef 时必须使用上述顺序。

**DBRef 的驱动程序支持**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/database-references/#driver-support-for-dbrefs)

| 驱动    | DBRef 支持 | 笔记                                                         |
| :------ | :--------- | :----------------------------------------------------------- |
| C       | 不支持     | 您可以手动遍历引用。                                         |
| C++     | 不支持     | 您可以手动遍历引用。                                         |
| C＃     | 支持的     | 请参阅[C# 驱动页面](https://www.mongodb.com/docs/drivers/csharp/) 想要查询更多的信息。 |
| Go      | 不支持     | 您可以手动遍历引用。                                         |
| Haskell | 不支持     | 您可以手动遍历引用。                                         |
| Java    | 支持的     | 请参阅[Java 驱动页面](https://www.mongodb.com/docs/drivers/java/) 想要查询更多的信息。 |
| Node.js | 支持的     | 请参阅[Node.js 驱动页面](https://www.mongodb.com/docs/drivers/node/) 想要查询更多的信息。 |
| Perl    | 支持的     | 请参阅[Perl 驱动页面](https://www.mongodb.com/docs/drivers/perl/) 想要查询更多的信息。 |
| PHP     | 不支持     | 您可以手动遍历引用。                                         |
| Python  | 支持的     | 请参阅[PyMongo 驱动页面](https://www.mongodb.com/docs/drivers/pymongo/) 想要查询更多的信息。 |
| Ruby    | 支持的     | 请参阅[Ruby 驱动页面](https://www.mongodb.com/docs/ruby-driver/current/) 想要查询更多的信息。 |
| Scala   | 不支持     | 您可以手动遍历引用。                                         |

**采用**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/database-references/#use-1)

在大多数情况下，您应该使用[手册参考](https://www.mongodb.com/docs/manual/reference/database-references/#std-label-document-references)连接两个或多个相关文档的方法。但是，如果您需要引用多个集合中的文档，请考虑使用 DBRefs。

 参见

原文 - [Database References]( https://docs.mongodb.com/manual/reference/database-references/ )

译者：景圣
