# 快速开始

> 注意:
>
> Queryable Encryption 处于公共预览阶段，可用于评估目的。不建议将公共预览版用于生产部署，因为可能会引入重大更改。要了解有关预览版的更多信息，请参阅[可查询加密预览](https://www.mongodb.com/blog/post/mongodb-releases-queryable-encryption-preview/)博客文章。

## 概述

本指南向您展示如何使用自动可查询加密和 MongoDB 驱动程序来加密文档。

完成本指南后，您应该具备以下知识和软件：

* 了解配置驱动程序以加密文档中的字段的步骤。
* 使用自动可查询加密的工作但不是生产就绪的客户端应用程序。

>  重要的:
>
> **不要在生产中使用此应用程序**
>
> 由于此示例应用程序将加密密钥存储在应用程序的文件系统中，因此您可能会面临未经授权访问密钥或丢失用于解密数据的密钥的风险。
>
> 要查看演示如何创建使用远程密钥管理系统的启用可查询加密的应用程序的教程，请参阅 [教程。](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/#std-label-qe-tutorial-automatic-encryption)

## 开始之前

要完成并运行本指南中的代码，您需要设置您的开发环境，如[安装要求](https://www.mongodb.com/docs/manual/core/queryable-encryption/install/#std-label-qe-install)页面所示。

> 提示
>
> ### 请参阅：完整应用程序
>
> 要查看您在本指南中创建的应用程序的完整代码，请选择与您的编程语言对应的选项卡，然后点击提供的链接：
>
> * mongosh 
>   * [Complete mongosh Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/local/reader/)
> * Node.js
>   * [Complete Node.js Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/node/local/reader/)
> * Python
>   * [Complete Python Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/python/local/reader/)
> * java
>   * [Complete Java Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/java/local/reader/)
> * G0
>   * [Complete Go Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/go/local/reader/)
> * C#
>   * [Complete C# Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/dotnet/local/reader/)

## 程序

1. 创建客户主密钥

   您必须创建客户主密钥 ( CMK ) 才能执行可查询加密。

   创建一个 96 字节的客户主密钥并将其作为文件保存到您的文件系统`master-key.txt`：

   ```
   openssl rand 96 > master-key.txt
   ```

   >笔记:
   >
   >**使用编程语言创建客户主密钥**
   >
   >如果您更愿意使用您喜欢的编程语言来生成您的CMK，您可以查看演示如何使用本指南的每种支持语言生成客户主密钥的代码片段[GitHub](https://github.com/mongodb/docs/tree/master/source/includes/quick-start/generate-master-key)

   > 警告:
   >
   > **不要在生产中使用本地密钥文件**
   >
   > 文件系统中的本地密钥文件是不安全的， **不建议**用于生产。相反，您应该将客户主密钥存储在远程 [密钥管理系统](https://en.wikipedia.org/wiki/Key_management#Key_management_system) （公里）。
   >
   > 要了解如何在可查询加密实现中使用远程 KMS，请参阅[教程](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/#std-label-qe-tutorial-automatic-encryption)指南。

2. 在 Key Vault 集合上创建唯一索引

   `keyAltNames`在集合中的字段 上创建唯一索引`encryption.__keyVault`。

   选择与您首选的 MongoDB 驱动程序对应的选项卡：

   ```shell
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

3. 创建您的数据加密密钥和加密集合

   * 读取客户主密钥并指定 KMS 提供商设置

     检索您在[创建客户主密钥](https://www.mongodb.com/docs/manual/core/queryable-encryption/quick-start/#std-label-qe-quick-start-create-master-key)本指南的步骤。

     将CMK值传递给您的 KMS 提供商设置。客户端使用这些设置来发现CMK。将提供程序名称设置为`local`以通知驱动程序您正在使用本地密钥提供程序。

     选择与您首选的 MongoDB 驱动程序对应的选项卡：

     ```
     const provider = "local";
     const path = "./master-key.txt";
     // WARNING: Do not use a local key file in a production application
     const localMasterKey = fs.readFileSync(path);
     const kmsProviders = {
       local: {
         key: localMasterKey,
       },
     };
     ```

   * 创建您的数据加密密钥

     使用 MongoDB 连接字符串和 Key Vault 集合命名空间构建客户端，并创建数据加密密钥：

     > 笔记:
     >
     > **Key Vault 集合命名空间权限**
     >
     > 本指南中的 Key Vault 集合是数据库`__keyVault` 中的集合`encryption`。确保您的应用程序用于连接到 MongoDB 的数据库用户具有[读写](https://www.mongodb.com/docs/manual/reference/built-in-roles/#readWrite) 命名空间的权限`encryption.__keyVault`

     ```
     const autoEncryptionOpts = {
       keyVaultNamespace: keyVaultNamespace,
       kmsProviders: kmsProviders,
     };
     
     const encClient = Mongo(uri, autoEncryptionOpts);
     const keyVault = encClient.getKeyVault();
     
     const dek1 = keyVault.createKey(provider, {
       keyAltNames: ["dataKey1"],
     });
     const dek2 = keyVault.createKey(provider, {
       keyAltNames: ["dataKey2"],
     });
     const dek3 = keyVault.createKey(provider, {
       keyAltNames: ["dataKey3"],
     });
     const dek4 = keyVault.createKey(provider, {
       keyAltNames: ["dataKey4"],
     });
     ```

   * 创建您的加密收藏

     使用启用了可查询加密的`MongoClient`实例来指定必须加密哪些字段并创建加密集合：

     ```
     const encryptedFieldsMap = {
       [`${secretDB}.${secretCollection}`]: {
         fields: [
           {
             keyId: dek1,
             path: "patientId",
             bsonType: "int",
             queries: { queryType: "equality" },
           },
           {
             keyId: dek2,
             path: "medications",
             bsonType: "array",
           },
           {
             keyId: dek3,
             path: "patientRecord.ssn",
             bsonType: "string",
             queries: { queryType: "equality" },
           },
           {
             keyId: dek4,
             path: "patientRecord.billing",
             bsonType: "object",
           },
         ],
       },
     };
     
     try {
       const autoEncryptionOptions = {
         keyVaultNamespace: keyVaultNamespace,
         kmsProviders: kmsProviders,
         encryptedFieldsMap: encryptedFieldsMap,
       };
     
       const encClient = Mongo(uri, autoEncryptionOptions);
       const newEncDB = encClient.getDB(secretDB);
       // Drop the encrypted collection in case you created this collection
       // in a previous run of this application.
       newEncDB.dropDatabase();
       newEncDB.createCollection(secretCollection);
       console.log("Created encrypted collection!");
     ```

     本节中代码的输出应类似于以下内容：

     ```
     Created encrypted collection!
     ```

     > 提示:
     >
     > **请参阅：完整代码**
     >
     > 要查看制作数据加密密钥的完整代码，请参阅 [我们的 Github 存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/local/reader/make_data_key.js)

4. 配置您的 MongoClient 以进行加密读写

   * 指定 Key Vault 集合命名空间

     指定`encryption.__keyVault`为 Key Vault 集合命名空间。

     ```
     const keyVaultDB = "encryption";
     const keyVaultColl = "__keyVault";
     const keyVaultNamespace = `${keyVaultDB}.${keyVaultColl}`;
     const secretDB = "medicalRecords";
     const secretCollection = "patients";
     ```

   * 指定本地客户主密钥

     指定 KMS 提供商并指定您的内联客户主密钥：

     ```
     const provider = "local";
     const path = "./master-key.txt";
     const localMasterKey = fs.readFileSync(path);
     const kmsProviders = {
       local: {
         key: localMasterKey,
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

   * 指定自动加密共享库的位置

     ```
     // mongosh does not require you to specify the
     // location of the Automatic Encryption Shared Library
     ```

     > 提示:
     >
     > **了解更多**
     >
     > 要了解有关自动加密共享库的更多信息，请参阅[可查询加密页面的自动加密共享库](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/shared-library/#std-label-qe-reference-shared-library)。

   * 创建 MongoClient

     使用以下自动加密设置实例化 MongoDB 客户端对象：

     ```
     const autoEncryptionOptions = {
       keyVaultNamespace: keyVaultNamespace,
       kmsProviders: kmsProviders,
       bypassQueryAnalysis: false,
       encryptedFieldsMap: encryptedFieldsMap,
     };
     
     const encryptedClient = Mongo(uri, autoEncryptionOptions);
     const encryptedColl = encryptedClient
       .getDB(secretDB)
       .getCollection(secretColl);
     const unencryptedColl = unencryptedClient
       .getDB(secretDB)
       .getCollection(secretColl);
     ```

5. 插入带有加密字段的文档

   使用以下代码片段，使用启用了可查询加密的 `MongoClient`实例将加密文档插入 命名空间：`medicalRecords.patients`

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

   插入文档时，启用了可查询加密的客户端会加密文档的字段，使其类似于以下内容：

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

   >警告:
   >
   >**不要修改 __safeContent__ 字段**
   >
   >该`__safeContent__`字段对于可查询加密至关重要。不要修改该字段的内容。

   > 提示:
   >
   > **请参阅：完整代码**
   >
   > 要查看插入加密文档的完整代码，请参见 [我们的 Github 存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/local/reader/insert_encrypted_document.js)

6. 检索您的加密文件

   检索您插入的加密文档 [插入带有加密字段的文档](https://www.mongodb.com/docs/manual/core/queryable-encryption/quick-start/#std-label-qe-quick-start-insert) 本指南的步骤。

   为了显示可查询加密的功能，以下代码片段使用配置为自动可查询加密的客户端以及未配置为自动可查询加密的客户端查询您的文档。

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
   > 要查看查找加密文档的完整代码，请参见 [我们的 Github 存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/local/reader/insert_encrypted_document.js)

## 了解更多

要查看有关使用远程 KMS 进行生产就绪的可查询加密的教程，请参阅[教程。](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/#std-label-qe-tutorial-automatic-encryption)

要了解可查询加密的工作原理，请参阅 [基础知识。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/#std-label-qe-fundamentals)

要了解有关本指南中提到的主题的更多信息，请参阅以下链接：

- [在参考](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/#std-label-qe-reference)页面上了解有关可查询加密组件的更多信息。
- [在密钥和密钥保管库](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/keys-key-vaults/#std-label-qe-reference-keys-key-vaults)页面上了解客户主密钥和数据加密密钥的工作原理。
- [在KMS 提供商](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-fundamentals-kms-providers)页面上查看 KMS 提供商如何管理您的可查询加密密钥。







译者：韩鹏帅

原文：[Quick Start](https://www.mongodb.com/docs/manual/core/queryable-encryption/quick-start/)
