**查询和修改有效或无效文件**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/use-json-schema-query-conditions/#query-for-and-modify-valid-or-invalid-documents)

如果您在创建集合后向其添加验证，或修改现有的验证模式，则您的集合中可能包含无效文档。同样，如果您的架构`validationAction`是 `warn`，则您的集合可以包含无效文档。您可以查询无效文档，以便有可能从您的集合中更新或删除它们。

要查找与指定架构匹配或不匹配的文档，请使用[`$jsonSchema`](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)with 查询运算符。`$jsonSchema`同样，您可以通过在写入操作的查询条件中使用基于模式的更新或删除文档。

**例子**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/use-json-schema-query-conditions/#examples)

`inventory`使用以下文档创建示例集合：

```shell
db.inventory.insertMany( [
   { item: "journal", qty: NumberInt(25), size: { h: 14, w: 21, uom: "cm" }, instock: true },
   { item: "notebook", qty: NumberInt(50), size: { h: 8.5, w: 11, uom: "in" }, instock: true },
   { item: "paper", qty: NumberInt(100), size: { h: 8.5, w: 11, uom: "in" }, instock: 1 },
   { item: "planner", qty: NumberInt(75), size: { h: 22.85, w: 30, uom: "cm" }, instock: 1 },
   { item: "postcard", qty: NumberInt(45), size: { h: 10, w: 15.25, uom: "cm" }, instock: true },
   { item: "apple", qty: NumberInt(45), status: "A", instock: true },
   { item: "pears", qty: NumberInt(50), status: "A", instock: true }
] )
```

**定义架构对象**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/use-json-schema-query-conditions/#define-a-schema-object)

定义示例模式对象并将其存储在名为的变量中 `myschema`：

```javascript
let myschema =
{
   $jsonSchema: {
      required: [ "item", "qty", "instock" ],
      properties: {
         item: { bsonType: "string" },
         qty: { bsonType: "int" },
         size: {
            bsonType: "object",
            required: [ "uom" ],
            properties: {
               uom: { bsonType: "string" },
               h: { bsonType: "double" },
               w: { bsonType: "double" }
            }
          },
          instock: { bsonType: "bool" }
      }
   }
}
```

**查找与架构匹配的文档**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/use-json-schema-query-conditions/#find-documents-that-match-the-schema)

这些命令返回与架构匹配的所有文档：

```shell
db.inventory.find(myschema)
db.inventory.aggregate( [ { $match: myschema } ] )
```

这两个命令返回相同的结果：

```json
[
  {
    _id: ObjectId("62b5cd5a14b92d148400f7a3"),
    item: 'apple',
    qty: 45,
    status: 'A',
    instock: true
  },
  {
    _id: ObjectId("62b5cd5a14b92d148400f7a4"),
    item: 'pears',
    qty: 50,
    status: 'A',
    instock: true
  }
]
```

**查找与架构不匹配的文档**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/use-json-schema-query-conditions/#find-documents-that-don-t-match-the-schema)

要查找所有不满足 schema: 的文档，请 [`$jsonSchema`](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)与[`$nor`](https://www.mongodb.com/docs/manual/reference/operator/query/nor/#mongodb-query-op.-nor)运算符一起使用：

```shell
db.inventory.find( { $nor: [ myschema ] } )
```

输出：

```json
[
  {
    _id: ObjectId("62b5cd5a14b92d148400f79e"),
    item: 'journal',
    qty: 25,
    size: { h: 14, w: 21, uom: 'cm' },
    instock: true
  },
  {
    _id: ObjectId("62b5cd5a14b92d148400f79f"),
    item: 'notebook',
    qty: 50,
    size: { h: 8.5, w: 11, uom: 'in' },
    instock: true
  },
  {
    _id: ObjectId("62b5cd5a14b92d148400f7a0"),
    item: 'paper',
    qty: 100,
    size: { h: 8.5, w: 11, uom: 'in' },
    instock: 1
  },
  {
    _id: ObjectId("62b5cd5a14b92d148400f7a1"),
    item: 'planner',
    qty: 75,
    size: { h: 22.85, w: 30, uom: 'cm' },
    instock: 1
  },
  {
    _id: ObjectId("62b5cd5a14b92d148400f7a2"),
    item: 'postcard',
    qty: 45,
    size: { h: 10, w: 15.25, uom: 'cm' },
    instock: true
  }
]
```

**更新与架构不匹配的文档**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/use-json-schema-query-conditions/#update-documents-that-don-t-match-the-schema)

此命令更新所有与架构不匹配的文档并将文档的`isValid`字段设置为`false`：

```shell
db.inventory.updateMany(
   {
      $nor: [ myschema ]
   },
   {
      $set: { isValid: false }
   }
)
```

要验证更新，请查询集合：

```shell
db.inventory.find()
```

输出：

```json
[
  {
    _id: ObjectId("62b5cd5a14b92d148400f79e"),
    item: 'journal',
    qty: 25,
    size: { h: 14, w: 21, uom: 'cm' },
    instock: true,
    isValid: false
  },
  {
    _id: ObjectId("62b5cd5a14b92d148400f79f"),
    item: 'notebook',
    qty: 50,
    size: { h: 8.5, w: 11, uom: 'in' },
    instock: true,
    isValid: false
  },
  {
    _id: ObjectId("62b5cd5a14b92d148400f7a0"),
    item: 'paper',
    qty: 100,
    size: { h: 8.5, w: 11, uom: 'in' },
    instock: 1,
    isValid: false
  },
  {
    _id: ObjectId("62b5cd5a14b92d148400f7a1"),
    item: 'planner',
    qty: 75,
    size: { h: 22.85, w: 30, uom: 'cm' },
    instock: 1,
    isValid: false
  },
  {
    _id: ObjectId("62b5cd5a14b92d148400f7a2"),
    item: 'postcard',
    qty: 45,
    size: { h: 10, w: 15.25, uom: 'cm' },
    instock: true,
    isValid: false
  },
  {
    _id: ObjectId("62b5cd5a14b92d148400f7a3"),
    item: 'apple',
    qty: 45,
    status: 'A',
    instock: true
  },
  {
    _id: ObjectId("62b5cd5a14b92d148400f7a4"),
    item: 'pears',
    qty: 50,
    status: 'A',
    instock: true
  }
]
```

**删除与架构不匹配的文档**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/use-json-schema-query-conditions/#delete-documents-that-don-t-match-the-schema)

此命令删除所有与架构不匹配的文档：

```shell
db.inventory.deleteMany( { $nor: [ myschema ] } )
```

要验证更新，请查询集合：

```shell
db.inventory.find()
```

输出：

```json
[
  {
    _id: ObjectId("62b5cd5a14b92d148400f7a3"),
    item: 'apple',
    qty: 45,
    status: 'A',
    instock: true
  },
  {
    _id: ObjectId("62b5cd5a14b92d148400f7a4"),
    item: 'pears',
    qty: 50,
    status: 'A',
    instock: true
  }
]
```

**学到更多**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/use-json-schema-query-conditions/#learn-more)

- [查询和投影运算符](https://www.mongodb.com/docs/manual/reference/operator/query/#std-label-query-projection-operators-top)
- [指定现有文档的验证级别](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#std-label-schema-specify-validation-level)

参见

原文：[Query for and Modify Valid or Invalid Documents](https://www.mongodb.com/docs/manual/core/schema-validation/use-json-schema-query-conditions/)

译者：景圣