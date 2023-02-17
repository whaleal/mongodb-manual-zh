**JSON 模式验证技巧**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/json-schema-tips/#tips-for-json-schema-validation)

本页介绍了 JSON 模式验证的最佳实践，以帮助避免常见问题。

**`_id`领域和`additionalProperties: false`**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/json-schema-tips/#_id-field-and-additionalproperties--false)

当您`additionalProperties: false`在 JSON 模式中指定时，MongoDB 拒绝包含未包含在您的模式`properties`对象中的字段的文档。

因为所有对象都包含一个自动生成的`_id`字段，所以当您设置 时`additionalProperties: false`，您必须 在您的对象中包含该`_id`字段。`properties`如果不这样做，所有文件都会被拒绝。

例如，通过此验证，没有文档是有效的：

```json
{
  "$jsonSchema": {
    "required": [ "_id", "storeLocation" ],
    "properties": {
      "storeLocation": { "bsonType": "string" }
    },
    "additionalProperties": false
  }
}
```

此验证确保它`storeLocation`是一个字符串。但是，该 `properties`对象不包含`_id`字段。

要允许集合中的文档，您必须更新`properties` 对象以包含一个`_id`字段：

```json
{
  "$jsonSchema": {
    "required": [ "_id", "storeLocation" ],
    "properties": {
      "_id": { "bsonType": "objectId" },
      "storeLocation": { "bsonType": "string" }
    },
    "additionalProperties": false
  }
}
```

`null`**字段值验证**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/json-schema-tips/#validation-for-null-field-values)

您的应用程序可能配置为将缺少的字段值设置为 `null`，而不是在发送到集合的对象中不包括这些字段。

如果您的模式验证字段的数据类型，要插入具有`null`该字段值的文档，您必须明确允许`null` 作为有效的 BSON 类型。

例如，此架构验证不允许文档 where `storeLocation`is `null`:

```shell
db.createCollection("sales",
   {
      validator:
         {
            "$jsonSchema": {
               "properties": {
                  "storeLocation": { "bsonType": "string" }
               }
            }
         }
    }
 )
```

通过前面的验证，拒绝此文档：

```shell
db.store.insertOne( { storeLocation: null } )
```

或者，此架构验证允许`null`以下值 `storeLocation`：

```shell
db.createCollection("store",
   {
      validator:
         {
            "$jsonSchema": {
               "properties": {
                  "storeLocation": { "bsonType": [ "null", "string" ] }
               }
            }
         }
    }
 )
```

通过前面的验证，允许此文档：

```shell
db.store.insertOne( { storeLocation: null } )
```

>[NOTE]
>
>**空字段与缺失字段的比较**
>
>`null`字段值与缺失字段不同。如果文档中缺少某个字段，MongoDB 不会验证该字段。

参见

原文：[Tips for JSON Schema Validation](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/json-schema-tips/)

译者：景圣