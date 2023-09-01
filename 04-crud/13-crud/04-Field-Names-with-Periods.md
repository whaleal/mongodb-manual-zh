## 带有句点 ( `.`) 和美元符号 ( `$`)的字段名称

### 概述

MongoDB 5.0 改进了对以美元 ( `$`) 为前缀或包含句点 ( `.`) 的字段名称的支持。用于存储数据的验证规则已更新，以便更轻松地处理使用这些字符的数据源。

在大多数情况下，使用此类字段名称存储的数据无法直接访问。您需要 在访问这些字段的查询中使用[`$getField`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/getField/#mongodb-expression-exp.-getField)、[`$setField`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/setField/#mongodb-expression-exp.-setField)、 和 等 辅助方法。[`$literal`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/literal/#mongodb-expression-exp.-literal)

对于所有类型的存储操作，字段名称验证规则并不相同。本页总结了不同的插入和更新操作如何处理美元 ( `$`) 前缀的字段名称。

### 插入操作

允许以美元 ( `$`) 为前缀的字段作为插入的顶级和嵌套字段名称。

```
db.sales.insertOne( {
   "$price": 50.00,
   "quantity": 30
} )
```

美元 ( `$`) 前缀字段允许在使用其他保留字的插入中使用。运算符名称（[`$inc`](https://www.mongodb.com/docs/manual/reference/operator/update/inc/#mongodb-update-up.-inc)例如`id`、`db`、 和 ）可以用作字段名称`ref`。

```
db.books.insertOne( {
   "$id": "h1961-01",
   "location": {
      "$db": "novels",
      "$ref": "2007042768",
      "$inc": true
} } )
```

[在upsert](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-upsert)期间创建新文档的更新被视为字段名称验证`insert`而不是`update`字段名称验证。[更新插入](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-upsert)可以接受美元 ( `$`) 前缀字段。但是，[更新插入](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-upsert)`match`是一种特殊情况，如果更新部分选择现有文档，则类似的更新操作可能会导致错误。

此代码示例具有`upsert: true`，因此如果集合尚未包含与查询术语 匹配的文档，它将插入一个新文档`{ "date": "2021-07-07" }`。如果此示例代码与现有文档匹配，则更新将失败，因为`$hotel`带有美元 ( `$`) 前缀。

```
db.expenses.updateOne(
   { "date": "2021-07-07" },
   { $set: {
      "phone": 25.17,
      "$hotel": 320.10
   } },
   { upsert: true }
)
```

### 文档替换更新

更新操作员要么用新文档替换现有字段，要么修改这些字段。在更新执行替换的情况下，`$`不允许以美元 ( ) 为前缀的字段作为顶级字段名称。

考虑一个像这样的文档

```
{
   "_id": "E123",
   "address": {
      "$number": 123,
      "$street": "Elm Road"
   },
   "$rooms": {
      "br": 2,
      "bath": 1
   }
}
```

您可以使用替换现有文档的更新运算符来修改字段`address.$street`，但无法以 `$rooms`这种方式更新字段。

```
db.housing.updateOne(
   { "_id": "E123" },
   { $set: { "address.$street": "Elm Ave" } }
)
```

用作[`$setField`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/setField/#mongodb-expression-exp.-setField)聚合管道的一部分 [更新顶层](https://www.mongodb.com/docs/manual/core/dot-dollar-considerations/#std-label-dotDollar-aggregate-update)以 $( `$`) 为前缀的字段，例如`$rooms`.

### 文档修改更新

当更新修改而不是替换现有文档字段时，美元 ( `$`) 前缀字段可以是顶级字段名称。可以直接访问子字段，但您需要一个辅助方法来访问顶级字段。

> 也可以看看:
>
> [`$getField`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/getField/#mongodb-expression-exp.-getField), [`$setField`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/setField/#mongodb-expression-exp.-setField), [`$literal`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/literal/#mongodb-expression-exp.-literal),[`$replaceWith`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/replaceWith/#mongodb-pipeline-pipe.-replaceWith)

考虑一个包含像这样的库存记录这样的文档的集合：

```
{
   _id: ObjectId("610023ad7d58ecda39b8d161"),
   "part": "AB305",
   "$bin": 200,
   "quantity": 100,
   "pricing": { sale: true, "$discount": 60 }
}
```

`pricing.$discount`可以直接查询子字段。

```
db.inventory.findAndModify( {
    query: { "part": { $eq: "AB305" } },
    update: { $inc: { "pricing.$discount": 10 } }
} )
```

使用[`$getField`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/getField/#mongodb-expression-exp.-getField)和[`$literal`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/literal/#mongodb-expression-exp.-literal)访问顶级`$bin`字段的值。

```
db.inventory.findAndModify( {
   query: { $expr: {
      $eq: [ { $getField: { $literal: "$bin" } }, 200 ]
   } },
   update: { $inc: { "quantity": 10 } }
} )
```

### 使用聚合管道进行更新

在阶段中使用[`$setField`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/setField/#mongodb-expression-exp.-setField)、、[`$getField`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/getField/#mongodb-expression-exp.-getField)和 可修改聚合[管道](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-pipeline)中以dollar() 为前缀的字段[。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-pipeline)[`$literal`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/literal/#mongodb-expression-exp.-literal)[`$replaceWith`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/replaceWith/#mongodb-pipeline-pipe.-replaceWith)`$`

考虑一组学校记录，例如：

```
{
   "_id": 100001,
   "$term": "fall",
   "registered": true,
   "grade": 4
}
```

[使用管道](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-pipeline)更新以美元 ( `$`) 为前缀的字段，为春季学期创建一个新集合 `$term`。

```
db.school.aggregate( [
   { $match: { "registered": true } },
   { $replaceWith: {
      $setField: {
         field: { $literal: "$term" },
         input: "$$ROOT",
         value: "spring"
   } } },
   { $out: "spring2022" }
] )
```

### 一般限制

除了上面的存储验证规则之外，使用美元 ( `$`) 前缀的字段名称还有一些一般限制。这些字段不能：

- 被索引
- 用作分片键的一部分
- 使用验证[`$jsonSchema`](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)
- 使用转义序列进行修改
- 与使用 [现场级加密](https://www.mongodb.com/docs/drivers/security/client-side-field-level-encryption-guide/)
- 用作`_id`文档中的子字段

> 警告
>
> **美元符号 ($) 和句点 (.) 可能导致数据丢失**
>
> `$`当使用美元 ( ) 前缀的字段名称或包含句点 ( ) 的字段名称时，如果这些字段名称与早于 MongoDB 5.0 的服务器上的未确认写入（[写入关注](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-write-concern)`.`）结合使用，则数据丢失的可能性很小。 `w=0`
>
> 运行[`insert`](https://www.mongodb.com/docs/manual/reference/command/insert/#mongodb-dbcommand-dbcmd.insert)、[`update`](https://www.mongodb.com/docs/manual/reference/command/update/#mongodb-dbcommand-dbcmd.update)和 [`findAndModify`](https://www.mongodb.com/docs/manual/reference/command/findAndModify/#mongodb-dbcommand-dbcmd.findAndModify)命令时，5.0 兼容的驱动程序会取消使用字段名称以美元 ( `$`) 为前缀或包含句点 ( `.`) 的文档的限制。这些字段名称在早期驱动程序版本中生成客户端错误。
>
> 无论驱动程序连接到哪个服务器版本，这些限制都会被删除。如果 5.0 驱动程序将文档发送到较旧的服务器，则该文档将被拒绝，而不会发送错误。

> 警告
>
> **美元符号 ($) 和句点 (.) 的导入和导出问题**
>
> 从 MongoDB 5.0 开始，文档字段名称可以以美元 ( `$`) 为前缀，并且可以包含句点 ( `.`)。然而， [`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)和[`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)在某些情况下，使用这些字符的字段名称可能无法按预期工作。
>
> [MongoDB 扩展 JSON v2](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#std-label-extended-json-high-level-ref-v2) 无法区分类型包装器和恰好与类型包装器同名的字段。不要在相应的 BSON 表示形式可能包含美元 ( `$`) 前缀键的上下文中使用扩展 JSON 格式。[DBRef](https://www.mongodb.com/docs/manual/reference/database-references/#std-label-dbref-explanation)机制 是这个一般规则的一个例外。
>
> 使用上也有限制[`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)和 [`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)`.`字段名称中包含句点 ( )。由于 CSV 文件使用句点 ( `.`) 来表示数据层次结构，因此字段名称中的句点 ( `.`) 将被误解为嵌套级别。





 参见

原文 - https://www.mongodb.com/docs/v7.0/core/dot-dollar-considerations/