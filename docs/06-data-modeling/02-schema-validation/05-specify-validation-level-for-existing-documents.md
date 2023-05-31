**指定现有文档的验证级别**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#specify-validation-level-for-existing-documents)

对于在添加验证之前集合中已经存在的文档，您可以指定 MongoDB 如何将验证规则应用于这些文档。

**语境**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#context)

您的模式`validationLevel`确定 MongoDB 应用验证规则的文档：

| 验证级别   | 行为                                                         |
| :--------- | :----------------------------------------------------------- |
| `strict`   | （*默认*）MongoDB 将验证规则应用于所有插入和更新。           |
| `moderate` | MongoDB 仅将验证规则应用于现有的有效文档。不检查在添加验证之前存在的对无效文档的更新的有效性。 |

**先决条件**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#prerequisite)

此页面上的示例使用`contacts`包含这些文档的集合：

```shell
db.contacts.insertMany([
   { "_id": 1, "name": "Anne", "phone": "+1 555 123 456", "city": "London", "status": "Complete" },
   { "_id": 2, "name": "Ivan", "city": "Vancouver" }
])
```

**步骤：使用`strict`验证**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#steps--use-strict-validation)

以下示例`strict`向集合添加验证`contacts` 并显示尝试更新无效文档时的结果。

1. **指定具有`strict`验证级别的验证规则。**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#specify-validation-rules-with-strict-validation-level.)

   将验证器添加到`contacts`集合中`strict` `validationLevel`：

   ```shell
   db.runCommand( {
      collMod: "contacts",
      validator: { $jsonSchema: {
         bsonType: "object",
         required: [ "phone", "name" ],
         properties: {
            phone: {
               bsonType: "string",
               description: "phone must be a string and is required"
            },
            name: {
               bsonType: "string",
               description: "name must be a string and is required"
            }
         }
      } },
      validationLevel: "strict"
   } )
   ```

   因为`validationLevel`是`strict`，当任何文档更新时，MongoDB 会检查该文档以进行验证。

2. **测试验证**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#test-the-validation.)

   以下更新命令修改`contacts` 集合中的两个文档，使得两个文档都不符合要求`name`为字符串的验证规则：

   ```shell
   db.contacts.updateOne(
      { _id: 1 },
      { $set: { name: 10 } }
   )
   
   db.contacts.updateOne(
      { _id: 2 },
      { $set: { name: 20 } }
   )
   ```

3. **观察结果**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#observe-results.)

   两次更新操作均失败。MongoDB 为每个操作返回以下输出：

   ```json
    MongoServerError: Document failed validation
    Additional information: {
      failingDocumentId: <id>,
      details: {
        operatorName: '$jsonSchema',
        schemaRulesNotSatisfied: [
          {
            operatorName: 'properties',
            propertiesNotSatisfied: [
              {
                propertyName: 'name',
                description: 'name must be a string and is required',
                details: [
                  {
                    operatorName: 'bsonType',
                    specifiedAs: { bsonType: 'string' },
                    reason: 'type did not match',
                    consideredValue: <value>,
                    consideredType: 'int'
                  }
                ]
              }
            ]
          },
          {
            operatorName: 'required',
            specifiedAs: { required: [ 'phone', 'name' ] },
            missingProperties: [ 'phone' ]
          }
        ]
      }
    }
   ```

**步骤：使用`moderate`验证**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#steps--use-moderate-validation)

以下示例`moderate`向集合添加验证`contacts` 并显示尝试更新无效文档时的结果。

1. **指定具有`moderate`验证级别的验证规则**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#specify-validation-rules-with-moderate-validation-level.)

   将验证器添加到`contacts`集合中`moderate` `validationLevel`：

   ```shell
   db.runCommand( {
      collMod: "contacts",
      validator: { $jsonSchema: {
         bsonType: "object",
         required: [ "phone", "name" ],
         properties: {
            phone: {
               bsonType: "string",
               description: "phone must be a string and is required"
            },
            name: {
               bsonType: "string",
               description: "name must be a string and is required"
            }
         }
      } },
      validationLevel: "moderate"
   } )
   ```

   因为`validationLevel`是`moderate`：

   - 如果使用 更新文档`_id: 1`，MongoDB 将应用新的验证规则，因为现有文档满足验证要求。
   - 如果使用 更新文档`_id: 2`，MongoDB 不会应用新的验证规则，因为现有文档不符合验证要求。

2. **测试验证**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#test-the-validation.-1)

   以下更新命令修改`contacts` 集合中的两个文档，使得两个文档都不符合要求`name`为字符串的验证规则：

   ```shell
   db.contacts.updateOne(
      { _id: 1 },
      { $set: { name: 10 } }
   )
   
   db.contacts.updateOne(
      { _id: 2 },
      { $set: { name: 20 } }
   )
   ```

3. **观察结果**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#observe-results.-1)

   MongoDB 为每个操作返回以下输出：

   ```json
   // _id: 1
   
   MongoServerError: Document failed validation
   Additional information: {
     failingDocumentId: 1,
     details: {
       operatorName: '$jsonSchema',
       schemaRulesNotSatisfied: [
         {
           operatorName: 'properties',
           propertiesNotSatisfied: [
             {
               propertyName: 'name',
               description: 'name must be a string and is required',
               details: [
                 {
                   operatorName: 'bsonType',
                   specifiedAs: { bsonType: 'string' },
                   reason: 'type did not match',
                   consideredValue: 10,
                   consideredType: 'int'
                 }
               ]
             }
           ]
         }
       ]
     }
   }
   
   // _id: 2
   
   {
      acknowledged: true,
      insertedId: null,
      matchedCount: 1,
      modifiedCount: 0,
      upsertedCount: 0
   }
   ```

   输出显示：

   - 带有 的文档更新失败`_id: 1`。该文档满足初始验证要求，MongoDB 对该文档应用验证规则。
   - 带有 的文档更新成功`_id: 2`。该文档不满足初始验证要求，MongoDB 不对该文档应用验证规则。

>[IMPORTANT]
>
>错误输出供人类使用。它将来可能会发生变化，不应在脚本中依赖它。

**学到更多**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#learn-more)

- [选择如何处理无效文件](https://www.mongodb.com/docs/manual/core/schema-validation/handle-invalid-documents/#std-label-schema-validation-handle-invalid-docs)
- [修改架构验证](https://www.mongodb.com/docs/manual/core/schema-validation/update-schema-validation/#std-label-schema-update-validation)

参见

原文：[Specify Validation Level for Existing Documents](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/)

译者：景圣