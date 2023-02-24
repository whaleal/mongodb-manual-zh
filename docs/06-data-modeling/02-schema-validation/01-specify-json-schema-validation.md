**指定 JSON 架构验证**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/#specify-json-schema-validation)

JSON Schema 是一个词汇表，允许您注释和验证 JSON 文档。您可以使用 JSON 模式以人类可读的格式为您的字段指定验证规则。

**语境**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/#context)

MongoDB 支持 JSON Schema 草案 4，包括[核心规范](https://tools.ietf.org/html/draft-zyp-json-schema-04)和[验证规范](https://tools.ietf.org/html/draft-fge-json-schema-validation-00), 有一些差异。有关详细信息，请参阅[扩展](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#std-label-jsonSchema-extension)和 [遗漏。](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#std-label-json-schema-omission)

有关 JSON 模式的更多信息，请参阅[官网。](http://json-schema.org/)

**限制**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/#restrictions)

您不能为以下内容指定架构验证：

- `admin`、`local`和`config`数据库中的集合
- [系统收藏](https://www.mongodb.com/docs/manual/reference/system-collections/#std-label-metadata-system-collections)

**步骤**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/#steps)

在此示例中，您创建了一个`students`包含验证规则的集合，并在您尝试插入无效文档后观察结果。

1. **创建一个带有验证的集合**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/#create-a-collection-with-validation.)

   创建一个`students`集合并使用[`$jsonSchema`](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema) 运算符设置模式验证规则。例如：

   ```shell
   db.createCollection("students", {
      validator: {
         $jsonSchema: {
            bsonType: "object",
            title: "Student Object Validation",
            required: [ "address", "major", "name", "year" ],
            properties: {
               name: {
                  bsonType: "string",
                  description: "'name' must be a string and is required"
               },
               year: {
                  bsonType: "int",
                  minimum: 2017,
                  maximum: 3017,
                  description: "'year' must be an integer in [ 2017, 3017 ] and is required"
               },
               gpa: {
                  bsonType: [ "double" ],
                  description: "'gpa' must be a double if the field exists"
               }
            }
         }
      }
   } )
   ```

   >[TIP]
   >
   >**用标题和描述字段阐明规则**
   >
   >当规则不是很清楚时，您可以使用`title`和字段来提供验证规则的解释。`description`当文档验证失败时，MongoDB 会在错误输出中包含这些字段。

2. **确认验证可防止无效文档**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/#confirm-that-the-validation-prevents-invalid-documents.)

   以下插入操作失败，因为`gpa`在`validator`需要`double`.

   ```shell
   db.students.insertOne( {
      name: "Alice",
      year: Int32( 2019 ),
      major: "History",
      gpa: Int32(3),
      address: {
         city: "NYC",
         street: "33rd Street"
      }
   } )
   ```

   该操作返回此错误：

   ```shell
   MongoServerError: Document failed validation
   
   Additional information: {
     failingDocumentId: ObjectId("630d093a931191850b40d0a9"),
     details: {
       operatorName: '$jsonSchema',
       title: 'Student Object Validation',
       schemaRulesNotSatisfied: [
         {
           operatorName: 'properties',
           propertiesNotSatisfied: [
             {
               propertyName: 'gpa',
               description: "'gpa' must be a double if the field exists",
               details: [
                 {
                   operatorName: 'bsonType',
                   specifiedAs: { bsonType: [ 'double' ] },
                   reason: 'type did not match',
                   consideredValue: 3,
                   consideredType: 'int'
                 }
               ]
             }
           ]
         }
       ]
     }
   }
   ```

3. **插入有效文档**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/#insert-a-valid-document.)

   将`gpa`字段更改为双精度后插入成功：

   ```shell
   db.students.insertOne( {
      name: "Alice",
      year: NumberInt(2019),
      major: "History",
      gpa: Double(3.0),
      address: {
         city: "NYC",
         street: "33rd Street"
      }
   } )
   ```

4. **查询有效文件**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/#query-for-the-valid-document.)

   要确认文档已成功插入，请查询 `students`集合：

   ```shell
   db.students.find()
   ```

   MongoDB 返回插入的文档：

   ```json
   [
     {
       _id: ObjectId("62bb413014b92d148400f7a5"),
       name: 'Alice',
       year: 2019,
       major: 'History',
       gpa: 3,
       address: { city: 'NYC', street: '33rd Street' }
     }
   ]
   ```

**附加信息**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/#additional-information)

您可以将 JSON 模式验证与[查询运算符验证结合起来。](https://www.mongodb.com/docs/manual/core/schema-validation/specify-query-expression-rules/#std-label-schema-validation-query-expression)

例如，考虑`sales`具有此架构验证的集合：

```shell
db.createCollection{ "sales", {
  validator: {
    "$and": [
      // Validation with query operators
      {
        "$expr": {
          "$lt": ["$lineItems.discountedPrice", "$lineItems.price"]
        }
      },
      // Validation with JSON Schema
      {
        "$jsonSchema": {
          "properties": {
            "items": { "bsonType": "array" }
          }
        }
      }
    ]
  }
}
```

前面的验证对 `sales`集合中的文档强制执行这些规则：

- `lineItems.discountedPrice`必须小于`lineItems.price`。此规则是使用[`$lt`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lt/#mongodb-expression-exp.-lt)运算符指定的。
- 该`items`字段必须是一个数组。此规则使用 指定 [`$jsonSchema`。](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)

**学到更多**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/#learn-more)

- 要查看 JSON 架构中允许的关键字的完整列表，请参阅 [可用关键字。](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#std-label-jsonSchema-keywords)
- 要限制特定字段可以包含的值，请参阅 [指定允许的字段值。](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/specify-allowed-field-values/#std-label-schema-allowed-field-values)
- 为避免 JSON 模式验证出现问题，请参阅 JSON 模式验证 [提示。](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/json-schema-tips/#std-label-json-schema-tips)

参见

原文：[Specify JSON Schema Validation](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/)

译者：景圣