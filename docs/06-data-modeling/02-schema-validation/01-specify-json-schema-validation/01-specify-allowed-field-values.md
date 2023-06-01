**指定允许的字段值**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/specify-allowed-field-values/#specify-allowed-field-values)

创建[JSON Schema](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/#std-label-schema-validation-json)时，您可以指定特定字段中允许的值。使用此功能可确保您的字段值属于一组预期的值，例如国家/地区列表。同样，您可以使用此功能来防止在将数据插入集合时出现人为错误，例如打字错误。

**语境**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/specify-allowed-field-values/#context)

要指定允许值的列表，`enum`请在 JSON 架构中使用关键字。关键字的`enum`意思是“枚举”，用于列出字段的可能值。

**步骤**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/specify-allowed-field-values/#steps)

考虑一家只向法国、英国和美国运送产品的服装公司。在验证器中，您可以列出允许的国家/地区值并拒绝指定不同国家/地区的文档。

1. **创建一个包含验证的集合**`enum`。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/specify-allowed-field-values/#create-a-collection-with-validation-containing-enum.)

   创建一个`shipping`集合并使用[`$jsonSchema`](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema) 运算符设置模式验证规则：

   ```shell
   db.createCollection("shipping", {
      validator: {
         $jsonSchema: {
            bsonType: "object",
            title: "Shipping Country Validation",
            properties: {
               country: {
                  enum: [ "France", "United Kingdom", "United States" ],
                  description: "Must be either France, United Kingdom, or United States"
               }
            }
         }
      }
   } )
   ```

   对象中的`enum`字段`country`仅允许`country`字段为`France`、`United Kingdom`或的文档`United States`。

2. **确认验证可防止无效文档**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/specify-allowed-field-values/#confirm-that-the-validation-prevents-invalid-documents.)

   以下插入操作失败，因为`country`is `Germany`不在允许值列表中。

   ```shell
   db.shipping.insertOne( {
      item: "sweater",
      size: "medium",
      country: "Germany"
   } )
   ```

   该操作返回此错误：

   ```json
   MongoServerError: Document failed validation
   Additional information: {
     failingDocumentId: ObjectId("630d1057931191850b40d0aa"),
     details: {
       operatorName: '$jsonSchema',
       title: 'Shipping Country Validation',
       schemaRulesNotSatisfied: [
         {
           operatorName: 'properties',
           propertiesNotSatisfied: [
             {
               propertyName: 'country',
               description: 'Must be either France, United Kingdom, or United States',
               details: [
                 {
                   operatorName: 'enum',
                   specifiedAs: {
                     enum: [ 'France', 'United Kingdom', 'United States' ]
                   },
                   reason: 'value was not found in enum',
                   consideredValue: 'Germany'
                 }
               ]
             }
           ]
         }
       ]
     }
   }
   ```

3. **插入有效文档**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/specify-allowed-field-values/#insert-a-valid-document.)

   将`country`字段更改为允许的值之一后，插入成功：

   ```shell
   db.shipping.insertOne( {
      item: "sweater",
      size: "medium",
      country: "France"
   } )
   ```

4. **查询有效文件**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/specify-allowed-field-values/#query-for-the-valid-document.)

   要确认文档已成功插入，请查询 `shipping`集合：

   ```shell
   db.shipping.find()
   ```

   MongoDB 返回文档：

   ```json
   [
     {
       _id: ObjectId("630d10d5931191850b40d0ab"),
       item: 'sweater',
       size: 'medium',
       country: 'France'
     }
   ]
   ```

参见

原文：[Specify Allowed Field Values](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/specify-allowed-field-values/)

译者：景圣

