**选择如何处理无效文件**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/handle-invalid-documents/#choose-how-to-handle-invalid-documents)

您可以指定 MongoDB 如何处理违反违规规则的文档。当操作会导致无效文档时，MongoDB 可以：

- 拒绝任何违反验证标准的插入或更新。这是默认行为。
- 允许操作继续，但在 MongoDB 日志中记录违规。

拒绝无效文档可确保您的模式保持一致。但是，在某些情况下，您可能希望允许无效文档，例如包含模式建立之前的文档的数据迁移。

**语境**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/handle-invalid-documents/#context)

您的架构`validationAction`选项决定了 MongoDB 如何处理无效文档：

| 验证操作 | 行为                                                         |
| :------- | :----------------------------------------------------------- |
| `error`  | （*默认*）MongoDB 拒绝任何违反验证标准的插入或更新。         |
| `warn`   | MongoDB 允许操作继续进行，但会在 MongoDB 日志中记录违规情况。 |

**选项 1：拒绝无效文件**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/handle-invalid-documents/#option-1--reject-invalid-documents)

以下过程显示如何创建拒绝无效文档的架构验证。

1. **使用创建一个集合`validationAction: "error"`。**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/handle-invalid-documents/#create-a-collection-with-validationaction---error-.)

   使用 JSON 架构验证器创建一个`contacts`集合，该验证器具有 `validationAction: "error"`：

   ```shell
   db.createCollection( "contacts", {
      validator: { $jsonSchema: {
         bsonType: "object",
         required: [ "phone" ],
         properties: {
            phone: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            email: {
               bsonType : "string",
               pattern : "@mongodb\\.com$",
               description: "must be a string and end with '@mongodb.com'"
            }
         }
      } },
      validationAction: "error"
   } )
   ```

   这`error` `validationAction`会导致 MongoDB 拒绝任何无效文档并阻止它们被插入到集合中。

2. **试图插入无效文档**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/handle-invalid-documents/#attempt-to-insert-an-invalid-document.)

   尝试插入以下文档：

   ```shell
   db.contacts.insertOne(
      { name: "Amanda", email: "amanda@xyz.com" }
   )
   ```

   该文档违反了验证规则，因为：

   - 该`email`字段与正则表达式模式不匹配。该`email`字段必须以`@mongodb.com`.
   - 它缺少必填`phone`字段。

   操作失败并出现以下错误：

   ```json
   MongoServerError: Document failed validation
   Additional information: {
     failingDocumentId: ObjectId("6377cca4aac957f2b77ea955"),
     details: {
       operatorName: '$jsonSchema',
       schemaRulesNotSatisfied: [
         {
           operatorName: 'properties',
           propertiesNotSatisfied: [
             {
               propertyName: 'email',
               description: "must be a string and end with '@mongodb.com'",
               details: [
                 {
                   operatorName: 'pattern',
                   specifiedAs: { pattern: '@mongodb\\.com$' },
                   reason: 'regular expression did not match',
                   consideredValue: 'amanda@xyz.com'
                 }
               ]
             }
           ]
         },
         {
           operatorName: 'required',
           specifiedAs: { required: [ 'phone' ] },
           missingProperties: [ 'phone' ]
         }
       ]
     }
   }
   ```

**选项 2：允许无效文档，但将它们记录在日志中**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/handle-invalid-documents/#option-2--allow-invalid-documents--but-record-them-in-the-log)

以下过程显示如何创建允许无效文档但在 MongoDB 日志中记录无效文档的模式验证。

1. **使用创建一个集合`validationAction: "warn"`。**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/handle-invalid-documents/#create-a-collection-with-validationaction---warn-.)

   使用 JSON 架构验证器创建一个`contacts2`集合，该验证器具有 `validationAction: "warn"`：

   ```shell
   db.createCollection( "contacts2", {
      validator: { $jsonSchema: {
         bsonType: "object",
         required: [ "phone" ],
         properties: {
            phone: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            email: {
               bsonType : "string",
               pattern : "@mongodb\\.com$",
               description: "must be a string and end with '@mongodb.com'"
            }
         }
      } },
      validationAction: "warn"
   } )
   ```

   允许将`warn` `validationAction`无效文档插入到集合中。无效文档记录在 MongoDB 日志中。

2. **试图插入无效文档。**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/handle-invalid-documents/#attempt-to-insert-an-invalid-document.-1)

   尝试插入以下文档：

   ```shell
   db.contacts2.insertOne(
      { name: "Amanda", email: "amanda@xyz.com" }
   )
   ```

   该文档违反了验证规则，因为：

   - 该`email`字段与正则表达式模式不匹配。该`email`字段必须以`@mongodb.com`.
   - 它缺少必填`phone`字段。

3. **检查无效文档的日志。**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/handle-invalid-documents/#check-the-logs-for-the-invalid-document.)

   要以可读格式查看 MongoDB 日志，请运行以下命令：

   ```shell
   db.adminCommand(
      { getLog:'global'} ).log.forEach(x => { print(x) }
   )
   ```

   MongoDB 日志包含类似于以下对象的条目：

   ```json
   {
      "t": {
         "$date": "2022-11-18T13:30:43.607-05:00"
      },
      "s": "W",
      "c": "STORAGE",
      "id": 20294,
      "ctx": "conn2",
      "msg": "Document would fail validation",
      "attr": {
         "namespace": "test.contacts2",
         "document": {
            "_id": {
               "$oid": "6377cf53d59841355cac1cd0"
            },
            "name": "Amanda",
            "email": "amanda@xyz.com"
         },
         "errInfo": {
            "failingDocumentId": {
               "$oid": "6377cf53d59841355cac1cd0"
            },
            "details": {
               "operatorName": "$jsonSchema",
               "schemaRulesNotSatisfied": [{
                  "operatorName": "properties",
                  "propertiesNotSatisfied": [{
                     "propertyName": "email",
                     "description": "must be a string and end with '@mongodb.com'",
                     "details": [{
                        "operatorName": "pattern",
                        "specifiedAs": {
                           "pattern": "@mongodb\\.com$"
                        },
                        "reason": "regular expression did not match",
                        "consideredValue": "amanda@xyz.com"
                     }]
                  }]
               }, {
                  "operatorName": "required",
                  "specifiedAs": {
                     "required": ["phone"]
                  },
                  "missingProperties": ["phone"]
               }]
            }
         }
      }
   }
   ```

**学到更多**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/handle-invalid-documents/#learn-more)

- [日志消息](https://www.mongodb.com/docs/manual/reference/log-messages/#std-label-log-messages-ref)
- [指定现有文档的验证级别](https://www.mongodb.com/docs/manual/core/schema-validation/specify-validation-level/#std-label-schema-specify-validation-level)

参见

原文：[Choose How to Handle Invalid Documents](https://www.mongodb.com/docs/manual/core/schema-validation/handle-invalid-documents/)

译者：景圣