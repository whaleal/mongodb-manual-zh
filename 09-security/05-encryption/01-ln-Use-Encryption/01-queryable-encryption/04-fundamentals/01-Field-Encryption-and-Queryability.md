### 字段加密和可查询性

> 注意:
>
> Queryable Encryption 处于公共预览阶段，可用于评估目的。不建议将公共预览版用于生产部署，因为可能会引入重大更改。要了解有关预览版的更多信息，请参阅[可查询加密预览](https://www.mongodb.com/blog/post/mongodb-releases-queryable-encryption-preview/)博客文章。

### 概述

在本指南中，您可以了解以下可查询加密主题：

* 如何指定加密字段。
* 如何在创建集合时指定加密字段是否可查询。
* 查询类型以及您可以在加密字段上使用的查询类型。
* 决定是否在加密字段上启用查询时应考虑的事项。

### 指定加密字段

可查询加密允许您指定要在 MongoDB 文档中自动加密的字段。

>重要的:
>
>您可以指定文档中除 `_id`field 之外的任何字段进行加密。

要指定用于加密和查询的字段，请定义一个包含以下属性的 JSON 模式：

| 键名       | 类型   | 必需的?                              |
| :--------- | :----- | :----------------------------------- |
| `path`     | String | 需要                                 |
| `bsonType` | String | 需要                                 |
| `keyId`    | Binary | 需要                                 |
| `queries`  | Object | 可选，省略，除非您希望能够查询该字段 |

### 例子

此示例说明如何创建一个 JSON 模式，指定可查询加密功能应自动加密哪些字段。

考虑以下包含个人身份信息 (PII)、信用卡信息和敏感医疗信息的文件：

```
{
   "firstName": "Jon",
   "lastName": "Snow",
   "patientId": 12345187,
   "address": "123 Cherry Ave",
   "medications": [
      "Adderal",
      "Lipitor"
   ],
   "patientInfo": {
      "ssn": "921-12-1234",
      "billing": {
            "type": "visa",
            "number": "1234-1234-1234-1234"
      }
   }
}
```

为确保 PII 和敏感医疗信息的安全，请创建一个 JSON 模式，将可查询加密配置为自动加密这些字段。以下示例 JSON 模式显示了如何指定要加密的字段：

```
const encryptedFieldsObject = {
   fields: [
      {
         path: "patientId",
         keyId: "<unique data encryption key>",
         bsonType: "int"
      },
      {
         path: "patientInfo.ssn",
         keyId: "<unique data encryption key>",
         bsonType: "string"
      },
      {
         path: "medications",
         keyId: "<unique data encryption key>",
         bsonType: "array"
      },
      {
         path: "patientInfo.billing",
         keyId: "<unique data encryption key>",
         bsonType: "object"
      },
   ]
}
```

请注意，该`keyId`字段需要一个唯一的数据加密密钥 (DEK)，可查询加密使用该密钥来加密这些字段。有关 DEK 的更多信息，请参阅 [加密密钥管理。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/manage-keys/#std-label-qe-fundamentals-manage-keys)

### 指定可查询的加密字段

在您的 JSON 模式中包含`queries`您希望使其可查询的字段的属性。这使授权客户端能够使用加密字段发出读取和写入查询。您可以省略该`queries`属性，除非您希望能够查询该字段。

### 例子

以下代码片段显示了如何将`queries`属性添加到 JSON 模式以使`patientId`和`patientInfo.ssn` 字段可查询。

```shell
const encryptedFieldsObject = {
   fields: [
      {
         path: "patientId",
         keyId: "<unique data encryption key>",
         bsonType: "int",
         queries: { queryType: "equality" }
      },
      {
         path: "patientInfo.ssn",
         keyId: "<unique data encryption key>",
         bsonType: "string",
         queries: { queryType: "equality" }
      },
      {
         path: "medications",
         keyId: "<unique data encryption key>",
         bsonType: "array"
      },
      {
         path: "patientInfo.billing",
         keyId: "<unique data encryption key>",
         bsonType: "object"
      },
   ]
}
```

有关查询类型的详细信息，请参阅[查询类型。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/encrypt-and-query/#std-label-qe-query-types)

###启用可查询加密

您可以通过以下方式在 JSON 架构中指定的字段上启用可查询加密：

- 将常量表示的 JSON 模式传递`encryptedFieldsObject`给应用程序用来创建集合的客户端，如以下代码片段所示：

```
const client = new MongoClient(uri, {
   autoEncryption: {
      keyVaultNameSpace: "<your keyvault namespace>",
      kmsProviders: "<your kms provider>",
      extraOptions: {
         cryptSharedLibPath: "<path to FLE Shared Library>"
      },
      encryptedFieldsMap: {
         "<databaseName.collectionName>": { encryptedFieldsObject }
      }
   }

   ...

   await client.db("<database name>").createCollection("<collection name>");
}
```

> 笔记:
>
> 在创建集合之前启用可查询加密很重要。创建集合后启用可查询加密不会加密该集合中已有文档的字段。

有关配置选项的更多信息，请参阅[MongoClient Options for Queryable Encryption](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/qe-options-clients/#std-label-qe-reference-mongo-client)`autoEncryption`部分[。](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/qe-options-clients/#std-label-qe-reference-mongo-client)

* 将加密字段对象传递给您的调用以创建新集合，如以下代码片段所示：

```
await encryptedDB.createCollection("<collection name>", {
   encryptedFields: encryptedFieldsObject
});
```

> 提示:
>
> 为了获得最高级别的安全性，请在创建集合时以及创建访问集合的客户端时指定加密字段。这确保了如果服务器的安全受到威胁，信息仍然通过客户端加密。

> 重要的:
>
> MongoDB 建议在使用可查询加密时显式创建集合，而不是通过插入操作隐式创建集合。当您使用创建集合时`createCollection()`，该操作会在加密字段上创建索引。如果没有索引，对加密字段的查询可能会运行缓慢。

###查询类型

`queries`可查询加密允许您通过将查询类型传递给加密字段对象中的选项来指定要在哪些字段上启用查询。

Queryable Encryption 目前支持`none`or`equality`查询类型。作为 MongoDB 6.0 中可查询加密的一部分引入的新加密框架旨在适应额外的表达加密搜索，例如范围和字符串运算符。

查询类型`none`表示数据将被加密但不可查询。不能对查询类型为 的加密数据运行查询`none`。如果在以下位置运行查询，将返回加密数据：

* 非加密字段
* `equality`在同一集合中具有查询类型并在客户端解密的字段。

> 重要的:
>
> **未指定查询类型**
>
> 如果未明确指定查询类型，则查询类型将默认为`none`并且数据将不可查询。

查询`equality`类型允许您使用以下表达式查询加密字段：

- [$eq](https://www.mongodb.com/docs/manual/reference/operator/query/eq/)
- [$ne](https://www.mongodb.com/docs/manual/reference/operator/query/ne/)
- [$in](https://www.mongodb.com/docs/manual/reference/operator/query/in/)
- [$nin](https://www.mongodb.com/docs/manual/reference/operator/query/nin/)
- [$and](https://www.mongodb.com/docs/manual/reference/operator/query/and/)
- [$or](https://www.mongodb.com/docs/manual/reference/operator/query/or/)
- [$not](https://www.mongodb.com/docs/manual/reference/operator/query/not/)
- [$nor](https://www.mongodb.com/docs/manual/reference/operator/query/nor/)
- [$expr](https://www.mongodb.com/docs/manual/reference/operator/query/expr/)

> 笔记:
>
> 将加密字段与`null`正则表达式进行比较的查询将导致错误，即使使用受支持的查询运算符也是如此。

`equality`当操作将加密字段与以下任何 [BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON)类型进行比较时，使用查询类型的可查询加密不支持对字段的读取或写入操作：

- `double`
- `decimal128`
- `object`
- `array`
- `javascriptWithScope`（已弃用）

### 启用查询时的注意事项

当您使用 Queryable Encryption 时，您可以选择是否使加密字段可查询。如果您不需要执行读取操作或需要您读取加密字段的写入操作，您可以决定不启用对该字段的查询。您仍然可以通过查询其他可查询或未加密的字段来检索整个文档

当您使加密字段可查询时，可查询加密会为每个加密字段创建一个索引，这会使对该字段的写入操作花费更长的时间。当写入操作更新索引字段时，MongoDB 也会更新相关索引

当您启用对加密字段的查询时，您的集合需要更多存储空间。这些以 开头的集合名称`enxcol_.`包含重要的加密元数据。

> 警告:
>
> 不要修改以 `enxcol_.`开头的集合







译者：韩鹏帅

原文：[Field Encryption and Queryability](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/encrypt-and-query/)