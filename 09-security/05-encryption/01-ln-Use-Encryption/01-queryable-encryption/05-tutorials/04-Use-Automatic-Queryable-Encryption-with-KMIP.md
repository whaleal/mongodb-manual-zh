## 将自动可查询加密与 KMIP 结合使用

## 概述

本指南向您展示如何使用符合密钥管理互操作性协议 (KMIP) 的密钥提供程序构建支持可查询加密 ( QE ) 的应用程序。

完成本指南中的步骤后，您应该：

- 托管在符合KMIP 的密钥提供程序上的客户主密钥。
- 使用您的客户主密钥插入加密文档的工作客户端应用程序。

## 开始之前

要完成并运行本指南中的代码，您需要设置您的开发环境，如[安装要求](https://www.mongodb.com/docs/manual/core/queryable-encryption/install/#std-label-qe-install)页面所示。

在本指南中，代码示例使用占位符文本。在运行示例之前，用您自己的值替换这些占位符。

例如：

```
dek_id := "<Your Base64 DEK ID>"
```

您将用您的DEK ID 替换引号之间的所有内容。

```
dek_id := "abc123"
```

从页面右侧的**选择您的语言**下拉菜单中选择您想要查看其代码示例的编程语言。

> 提示:
>
> **请参阅：完整应用程序**
>
> 要查看本教程的完整可运行应用程序代码，请转到以下链接：
>
> [完成 Mongosh 应用程序](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/kmip/reader/)

## 设置 KMS

```
// You are viewing the Mongosh driver code examples.
// Use the dropdown menu to select a different driver.
```

1. 配置符合 KMIP 的密钥提供程序

   要将 MongoDB 驱动程序客户端连接到您的KMIP兼容密钥提供程序，您必须配置您的KMIP兼容密钥提供程序，以便它接受您的客户端的 TLS 证书。

   有关如何接受客户端证书的信息，请参阅您的KMIP兼容密钥提供程序的文档。

2. 指定您的证书

   您的客户端必须通过 TLS 连接到符合KMIP 的密钥提供程序，并出示符合KMIP的密钥提供程序接受的客户端证书：

   ```
   const tlsOptions = {
     kmip: {
       tlsCAFile:
         "<path to file containing your Certificate Authority certificate>",
       tlsCertificateKeyFile: "<path to your client certificate file>",
     },
   };
   ```

## 创建应用程序

选择与您在应用程序中使用的 MongoDB 驱动程序相对应的选项卡，以查看相关代码示例。

1. 在您的 Key Vault 集合上创建唯一索引

   `keyAltNames`在集合中的字段 上创建唯一索引`encryption.__keyVault`。

   选择与您首选的 MongoDB 驱动程序对应的选项卡：

   ```
   const uri = "<Your Connection String>";
   const keyVaultClient = Mongo(uri);
   const keyVaultDB = keyVaultClient.getDB(keyVaultDatabase);
   // Drop the Key Vault Collection in case you created this collection
   // in a previous run of this application.
   keyVaultDB.dropDatabase();
   keyVaultDB.createCollection(keyVaultCollection);
   
   const keyVaultColl = keyVaultDB.getCollection(keyVaultCollection);
   keyVaultColl.createIndex(
     { keyAltNames: 1 },
     {
       unique: true,
       partialFilterExpression: { keyAltNames: { $exists: true } },
     }
   );
   ```

2. 创建数据加密密钥

   * 添加您的端点

     指定符合KMIP的密钥提供程序的 URI 端点

     ```
     const provider = "kmip";
     const kmsProviders = {
       kmip: {
         endpoint: "<endpoint for your KMIP-compliant key provider>",
       },
     };
     ```

   * 添加您的关键信息

     以下代码提示您的KMIP兼容密钥提供程序自动生成客户主密钥：

     ```
     const masterKey = {}; // an empty key object prompts your KMIP-compliant key provider to generate a new Customer Master Key
     ```

   * 生成您的数据加密密钥

     ```
     const autoEncryptionOpts = {
       keyVaultNamespace: keyVaultNamespace,
       kmsProviders: kmsProviders,
       tlsOptions: tlsOptions,
     };
     
     const encClient = Mongo(uri, autoEncryptionOpts);
     const keyVault = encClient.getKeyVault();
     
     const dek1 = keyVault.createKey(provider, {
       masterKey: masterKey,
       keyAltNames: ["dataKey1"],
     });
     const dek2 = keyVault.createKey(provider, {
       masterKey: masterKey,
       keyAltNames: ["dataKey2"],
     });
     const dek3 = keyVault.createKey(provider, {
       masterKey: masterKey,
       keyAltNames: ["dataKey3"],
     });
     const dek4 = keyVault.createKey(provider, {
       masterKey: masterKey,
       keyAltNames: ["dataKey4"],
     });
     ```

   > 提示:
   >
   > **请参阅：完整代码**
   >
   > 要查看制作数据加密密钥的完整代码，请参阅 [我们的 Github 存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/kmip/reader/make_data_key.js

3. 配置 MongoClient

   * 指定 Key Vault 集合命名空间

     指定`encryption.__keyVault`为 Key Vault 集合命名空间。

     ```
     const keyVaultDB = "encryption";
     const keyVaultColl = "__keyVault";
     const keyVaultNamespace = `${keyVaultDB}.${keyVaultColl}`;
     const secretDB = "medicalRecords";
     const secretCollection = "patients";
     ```

   * 指定您的 KMIP 端点

     `kmip`在您的对象中指定并输入符合KMIP 的`kmsProviders`密钥提供程序的 URI 端点：

     ```
     const provider = "kmip";
     const kmsProviders = {
       kmip: {
         endpoint: "<endpoint for your KMIP-compliant key provider>",
       },
     };
     ```

   * 为您的收藏创建加密字段映射

     ```
     const uri = "<Your Connection String>";
     const unencryptedClient = Mongo(uri);
     const autoEncryptionOpts = { kmsProviders, keyVaultNamespace };
     
     const encClient = Mongo(uri, autoEncryptionOpts);
     const keyVault = encClient.getKeyVault();
     const keyVaultClient = unencryptedClient
       .getDB(keyVaultDB)
       .getCollection(keyVaultColl);
     
     const dek1 = keyVaultClient.findOne({ keyAltNames: "dataKey1" });
     const dek2 = keyVaultClient.findOne({ keyAltNames: "dataKey2" });
     const dek3 = keyVaultClient.findOne({ keyAltNames: "dataKey3" });
     const dek4 = keyVaultClient.findOne({ keyAltNames: "dataKey4" });
     
     const secretDB = "medicalRecords";
     const secretColl = "patients";
     
     const encryptedFieldsMap = {
       [`${secretDB}.${secretColl}`]: {
         fields: [
           {
             keyId: dek1._id,
             path: "patientId",
             bsonType: "int",
             queries: { queryType: "equality" },
           },
           {
             keyId: dek2._id,
             path: "medications",
             bsonType: "array",
           },
           {
             keyId: dek3._id,
             path: "patientRecord.ssn",
             bsonType: "string",
             queries: { queryType: "equality" },
           },
           {
             keyId: dek4._id,
             path: "patientRecord.billing",
             bsonType: "object",
           },
         ],
       },
     };
     ```

     > 提示:
     >
     > **深入阅读模式**
     >
     > 要查看有关如何构建您在此步骤中使用的架构的深入说明，请参阅[加密架构](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/create-schema/#std-label-csfle-fundamentals-create-schema)指南。
     >
     > 要查看加密模式的所有受支持加密规则的列表，请参阅 [CSFLE 加密模式](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#std-label-csfle-reference-encryption-schemas)指南。

   * 指定自动加密共享库的位置

     ```
     
     ```

   * 创建 MongoClient

     使用以下自动加密设置实例化 MongoDB 客户端对象：

     ```
     const autoEncryptionOptions = {
       keyVaultNamespace: keyVaultNamespace,
       kmsProviders: kmsProviders,
       bypassQueryAnalysis: false,
       encryptedFieldsMap: encryptedFieldsMap,
       tlsOptions: tlsOptions,
     };
     
     const encryptedClient = Mongo(uri, autoEncryptionOptions);
     const encryptedColl = encryptedClient
       .getDB(secretDB)
       .getCollection(secretColl);
     const unencryptedColl = unencryptedClient
       .getDB(secretDB)
       .getCollection(secretColl);
     ```

4. 插入带有加密字段的文档

   使用启用 QE的实例使用以下代码片段`MongoClient`将加密文档插入 命名空间：`medicalRecords.patients`

   ```
   encryptedColl.insertOne({
     firstName: "Jon",
     lastName: "Doe",
     patientId: 12345678,
     address: "157 Electric Ave.",
     patientRecord: {
       ssn: "987-65-4320",
       billing: {
         type: "Visa",
         number: "4111111111111111",
       },
     },
     medications: ["Atorvastatin", "Levothyroxine"],
   });
   ```

   当您插入文档时，启用了可查询加密的客户端会加密文档的字段，使其类似于以下内容:

   ```
   {
     "_id": { "$oid": "<_id value>" },
     "firstName": "Jon",
     "lastName": "Doe",
     "patientId": {
       "$binary": {
         "base64": "<ciphertext>",
         "subType": "06"
       }
     },
     "address": "157 Electric Ave.",
     "patientRecord": {
       "ssn": {
         "$binary": {
           "base64": "<ciphertext>",
           "subType": "06"
         }
       },
       "billing": {
         "$binary": {
           "base64": "<ciphertext>",
           "subType": "06"
         }
       }
     },
     "medications": {
       "$binary": {
         "base64": "<ciphertext>",
         "subType": "06"
       }
     },
     "__safeContent__": [
       {
         "$binary": {
           "base64": "<ciphertext>",
           "subType": "00"
         }
       },
       {
         "$binary": {
           "base64": "<ciphertext>",
           "subType": "00"
         }
       }
     ]
   }
   
   ```

   > 警告:
   >
   > **不要修改 __safeContent__ 字段**
   >
   > 该`__safeContent__`字段对于可查询加密至关重要。不要修改该字段的内容。

   > 提示:
   >
   > **请参阅：完整代码**
   >
   > 要查看插入加密文档的完整代码，请参见 [我们的 Github 存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/kmip/reader/insert_encrypted_document.js)

5. 检索您的加密文档

   检索您插入的加密文档 [插入带有加密字段的文档](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/kmip/kmip-automatic/#std-label-qe-kmip-insert) 本指南的步骤。

   为了展示QE的功能，以下代码片段使用配置为自动QE的客户端和未配置为自动QE的客户端查询您的文档。

   ```
   console.log("Finding a document with regular (non-encrypted) client.");
   console.log(unencryptedColl.findOne({ firstName: /Jon/ }));
   console.log(
     "Finding a document with encrypted client, searching on an encrypted field"
   );
   console.log(encryptedColl.findOne({ "patientRecord.ssn": "987-65-4320" }));
   ```

   上述代码片段的输出应如下所示：

   ```
   Finding a document with regular (non-encrypted) client.
   {
     _id: new ObjectId("628eabeb37590e84ea742665"),
     firstName: 'Jon',
     lastName: 'Doe',
     patientId: new Binary(Buffer.from("0798810acc0f4f46c9a76883cee80fca12102e9ddcbcdae46a821fa108a8155a850f2d0919475b6531ada68973d436a199b537a05a98a708c36d2bfec4979d59cbe66878865ce19e392d3e4789d309bdacc336e32efcc851806ae0a41b355288c10d01e39147e1c40d919c41913a0c9d2d3fad0d0d1d2873c4fc82c6c22f27b517df5f3131b331b96ed16a7c5cf89e09082a2d898c2dcd73da91d08760ba74a70077b2d0fdbbe1eea75655a19fcc397812325ad40b102cbd16b8d36b22e11e3f93404f24a8ff68cfdec3c22b0e787cb30078a5227b2a", "hex"), 6),
     address: '157 Electric Ave.',
     patientRecord: {
       ssn: new Binary(Buffer.from("07e8b69630c32f4a00a542af768f8abcf50223edd812ff20b0ecb046ee1a9f5a0eef8d85d99cd26076411129942752516ee605c55aadce73f3d44d81ea6ddbbb8134b108a9deb40d8cab9cb4f08ef210ab0c9d2ea4347f9d235b861baf29751e60abcf059eb5c120305bd5ac05a4e07ac8ccfa6d37283f4cdbfeb7a8accb65b71857d486b5cf55e354d6a95e287d9e2dd65f3f9d9c4c9d0bdb1f26c4bd549d7be77db81796be293e08b2223bac67b212423c4e06568578b5bd7a3c33cedc1b291bcda0b27e005144d344563711a489f24b8e9b65bbb721d3a0e9d9b227a0cec0cbad", "hex"), 6),
       billing: new Binary(Buffer.from("06808ae69d4caa49cf90bb688f386f097f03f870a7b8fcebb1980c9ee5488b1f0f68558fc2163adcd92d00ea5f349f56ed34e7b391f54c48ed2760b4bde73022fc818dc7486a4e046b92ce9c82e00333c7779d9d6bb476713a20632b593b7de54812662cfc4d174d05451d3f4195514e12edba", "hex"), 6)
     },
     medications: new Binary(Buffer.from("06665ec15d38254dc4aa16da856789d33404f27bfea53e0d2fa4deaff166989ab33f469644d89c29112d33b41dbe54ec2d89c43f3de52cdc5d454e8694046216f533614fa7b42b7c5406d6518f7ed8f9e3ce52fda6c8b2146d0f8cc51e21a3467183697e1735a9f60c18e173c1916101", "hex"), 6),
     __safeContent__: [
       new Binary(Buffer.from("3044b134ad0f7c8a90dab1e05bb8b296a8ede540796bd7403ab47693cdba1b26", "hex"), 0),
       new Binary(Buffer.from("a22ddf9a5657cdd56bef72febbba44371899e6486962a1c07d682082c4e65712", "hex"), 0)
     ]
   }
   Finding a document with encrypted client, searching on an encrypted field
   {
     _id: new ObjectId("628eaca1dcf9b63e2f43162d"),
     firstName: 'Jon',
     lastName: 'Doe',
     patientId: 12345678,
     address: '157 Electric Ave.',
     patientRecord: {
       ssn: '987-65-4320',
       billing: { type: 'Visa', number: '4111111111111111' }
     },
     medications: [ 'Atorvastatin', 'Levothyroxine' ],
     __safeContent__: [
       new Binary(Buffer.from("fbdc6cfe3b4659693650bfc60baced27dcb42b793efe09da0ded54d60a9d5a1f", "hex"), 0),
       new Binary(Buffer.from("0f92ff92bf904a858ef6fd5b1e508187f523e791f51d8b64596461b38ebb1791", "hex"), 0)
     ]
   }
   
   ```

   > 提示:
   >
   > **请参阅：完整代码**
   >
   > 要查看插入加密文档的完整代码，请参见 [我们的 Github 存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/kmip/reader/insert_encrypted_document.js)

## 了解更多

要了解有关本指南中提到的主题的更多信息，请参阅以下链接：

- [密钥和密钥保管库](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/keys-key-vaults/#std-label-qe-reference-keys-key-vaults)
- [知识管理系统供应商](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-fundamentals-kms-providers)







译者：韩鹏帅

原文：[Use Automatic Queryable Encryption with KMIP](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/kmip/kmip-automatic/)