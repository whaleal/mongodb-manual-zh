**修改架构验证**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/update-schema-validation/#modify-schema-validation)

将架构验证添加到集合后，您可以随时修改架构验证。例如，您可以决定：

- 集合中的文档`users`不再需要电子邮件地址。
- 将字段的最小长度`password`从 8 个字符增加到 12 个。

要修改集合的模式验证，请使用[`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod) 命令并在`validator`对象中指定更新的验证。

**语境**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/update-schema-validation/#context)

您可以修改架构验证的所有组件，包括其规则、验证级别和验证操作。

如果您更新集合的验证规则，则在验证更改之前插入的文档可能不再有效。MongoDB 如何处理这些无效文档取决于您的`validationLevel`. 默认情况下，MongoDB 对所有文档应用验证检查，无论它们是何时插入的。

**步骤**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/update-schema-validation/#steps)

以下过程创建一个包含验证规则的集合，然后修改这些规则。插入无效和有效文档时，您将观察到结果。

1. **创建一个带有验证的集合**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/update-schema-validation/#create-a-collection-with-validation.)

   创建`users`具有验证规则的集合：

   ```shell
   db.createCollection("users", {
      validator: {
         $jsonSchema: {
            bsonType: "object",
            required: [ "username", "password" ],
            properties: {
               name: {
                  bsonType: "string",
                  description: "must be a string and is required"
               },
               password: {
                  bsonType: "string",
                  minLength: 8,
                  description: "must be a string of at least 8 characters, and is required"
               }
            }
         }
      }
   } )
   ```

2. **修改验证架构**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/update-schema-validation/#modify-the-validation-schema.)

   运行以下[`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令将 `minLength`字段的值`password`从 8 更改为 12：

   ```shell
   db.runCommand( { collMod: "users",
      validator: {
         $jsonSchema: {
            bsonType: "object",
            required: [ "username", "password" ],
            properties: {
               name: {
                  bsonType: "string",
                  description: "must be a string and is required"
               },
               password: {
                  bsonType: "string",
                  minLength: 12,
                  description: "must be a string of at least 12 characters, and is required"
               }
            }
         }
      }
   } )
   ```

>[TIP]
>
>您还可以使用该`collMod`命令向未使用验证创建的现有集合添加验证。

**结果**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/update-schema-validation/#results)

以下示例展示了将有效文档和无效文档插入用户集合时会发生什么，以及如何处理由于验证规则更改而不再有效的先前有效文档。

**插入无效文件**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/update-schema-validation/#insert-an-invalid-document)

以下操作尝试插入无效文档。文档无效，因为`password`字段长度为 10 个字符，而最小长度为 12：

```shell
db.users.insertOne(
   {
      "username": "salesAdmin01",
      "password": "kT9$j4wg#M"
   }
)
```

MongoDB 返回以下错误：

```json
MongoServerError: Document failed validation
Additional information: {
  failingDocumentId: ObjectId("62be0adb73c105dde9231299"),
  details: {
    operatorName: '$jsonSchema',
    schemaRulesNotSatisfied: [
      {
        operatorName: 'properties',
        propertiesNotSatisfied: [
          {
            propertyName: 'password',
            description: 'must be a string of at least 8 characters, and is required',
            details: [
              {
                operatorName: 'minLength',
                specifiedAs: { minLength: 12 },
                reason: 'specified string length was not satisfied',
                consideredValue: 'kT9$j4wg#M'
              }
            ]
          }
        ]
      }
    ]
  }
}
```

**插入有效文件**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/update-schema-validation/#insert-a-valid-document)

以下操作插入一个有效文档，其中`password` 字段长度至少为 12 个字符：

```shell
db.users.insertOne(
   {
      "username": "salesAdmin01",
      "password": "8p&SQd7T90$KKx"
   }
)
```

**处理以前有效但不再有效的文件**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/update-schema-validation/#handle-a-previously-valid-document-that-is-no-longer-valid)

考虑以下文档，它对第一个版本的模式验证有效，但对第二个版本无效：

```shell
db.users.insertOne(
   {
      "username": "salesAdmin02",
      "password": "i8U60*VyL8"
   }
)
```

文档的`password`字段是 10 个字符。模式验证的第一个版本至少需要 8 个字符，这意味着该文档是有效的。但是，在将验证更新为要求`password`至少 12 个字符后，文档不再有效。

当模式验证的更改导致以前有效的文档变得无效时，新的无效文档将保留在集合中。

MongoDB 处理新无效文档的方式取决于模式的 `validationLevel`. 此示例中的模式验证使用默认值`validationLevel`，`strict`这意味着文档必须匹配新的验证规则。每次更新文档时，MongoDB 都会检查验证。

如果更新后的模式验证有一个`validationLevel`of `moderate`，则该文档将不需要匹配新的验证规则。

**学到更多**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/update-schema-validation/#learn-more)

- [指定现有文档的验证级别](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#std-label-schema-specify-validation-level)
- [选择如何处理无效文件](https://www.mongodb.com/docs/manual/core/schema-validation/handle-invalid-documents/#std-label-schema-validation-handle-invalid-docs)

参见

原文：[Modify Schema Validation](https://www.mongodb.com/docs/manual/core/schema-validation/update-schema-validation/)

译者：景圣