**绕过架构验证**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/bypass-document-validation/#bypass-schema-validation)

在某些情况下，您可能需要绕过集合的架构验证规则。例如，如果您要将可能无效的数据从备份恢复到具有验证规则的集合。在这种情况下，旧文档可能无法满足新的验证要求。

**语境**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/bypass-document-validation/#context)

绕过模式验证是在每个操作的基础上完成的。如果您绕过架构验证以插入无效文档，则以后对无效文档的任何更新都必须：

- 也绕过架构验证
- 结果是一个有效的文件

**支持的操作**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/bypass-document-validation/#supported-operations)

您可以使用以下命令和方法绕过每个操作的验证：

- [`applyOps`](https://www.mongodb.com/docs/manual/reference/command/applyOps/#mongodb-dbcommand-dbcmd.applyOps)命令
- [`findAndModify`](https://www.mongodb.com/docs/manual/reference/command/findAndModify/#mongodb-dbcommand-dbcmd.findAndModify)命令和 [`db.collection.findAndModify()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.findAndModify/#mongodb-method-db.collection.findAndModify)方法
- [`mapReduce`](https://www.mongodb.com/docs/manual/reference/command/mapReduce/#mongodb-dbcommand-dbcmd.mapReduce)命令和 [`db.collection.mapReduce()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.mapReduce/#mongodb-method-db.collection.mapReduce)方法
- [`insert`](https://www.mongodb.com/docs/manual/reference/command/insert/#mongodb-dbcommand-dbcmd.insert)命令
- [`update`](https://www.mongodb.com/docs/manual/reference/command/update/#mongodb-dbcommand-dbcmd.update)命令
- [`$out`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)命令和 方法的[`$merge`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)阶段 [`aggregate`](https://www.mongodb.com/docs/manual/reference/command/aggregate/#mongodb-dbcommand-dbcmd.aggregate)[`db.collection.aggregate()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.aggregate/#mongodb-method-db.collection.aggregate)

**先决条件**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/bypass-document-validation/#prerequisite)

对于已启用访问控制的部署，要绕过文档验证，经过身份验证的用户必须有 [`bypassDocumentValidation`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-bypassDocumentValidation)操作。内置角色 [`dbAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin)并[`restore`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-restore)提供此操作。

**步骤**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/bypass-document-validation/#steps)

下面的示例创建一个具有模式验证的集合，然后通过绕过验证规则插入一个无效文档。

1. **创建具有验证规则的集合**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/bypass-document-validation/#create-a-collection-with-validation-rules)

   创建一个`students`集合并使用[`$jsonSchema`](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema) 运算符设置模式验证规则：

   ```shell
   db.createCollection("students", {
      validator: {
         $jsonSchema: {
            bsonType: "object",
            required: [ "name", "year", "major", "address" ],
            properties: {
               name: {
                  bsonType: "string",
                  description: "must be a string and is required"
               },
               year: {
                  bsonType: "int",
                  minimum: 2017,
                  maximum: 3017,
                  description: "must be an integer in [ 2017, 3017 ] and is required"
               }
            }
         }
      }
   } )
   ```

2. **绕过验证以插入无效文档**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/bypass-document-validation/#bypass-the-validation-to-insert-an-invalid-document)

   以下文档无效，因为该`year` 字段超出了允许的范围 ( `2017`- `3017`)：

   ```json
   {
      name: "Alice",
      year: Int32( 2016 ),
      major: "History",
      gpa: Double(3.0),
      address: {
         city: "NYC",
         street: "33rd Street"
      }
   }
   ```

   要绕过验证规则并插入无效文档，请运行以下`insert`命令，将 `bypassDocumentValidation`选项设置为`true`：

   ```json
   db.runCommand( {
      insert: "students",
      documents: [
         {
            name: "Alice",
            year: Int32( 2016 ),
            major: "History",
            gpa: Double(3.0),
            address: {
               city: "NYC",
               street: "33rd Street"
            }
         }
      ],
      bypassDocumentValidation: true
   } )
   ```

**结果**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/bypass-document-validation/#results)

要确认文档已成功插入，请查询 `students`集合：

```shell
db.students.find()
```

MongoDB 返回插入的文档：

```json
[
   {
      _id: ObjectId("62bcb4db3f7991ea4fc6830e"),
      name: 'Alice',
      year: 2016,
      major: 'History',
      gpa: 3,
      address: { city: 'NYC', street: '33rd Street' }
   }
]
```

**学到更多**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/bypass-document-validation/#learn-more)

- [查询和修改有效或无效文件](https://www.mongodb.com/docs/manual/core/schema-validation/use-json-schema-query-conditions/#std-label-use-json-schema-query-conditions)
- [指定现有文档的验证级别](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#std-label-schema-specify-validation-level)

参见

原文：[Bypass Schema Validation](https://www.mongodb.com/docs/manual/core/schema-validation/bypass-document-validation/)

译者：景圣