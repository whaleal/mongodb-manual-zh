## 将自动可查询加密与 GCP 结合使用

## 概述

本指南向您展示如何使用 Google Cloud Key Management Service 构建启用了可查询加密的应用程序。

完成本指南中的步骤后，您应该：

- 托管在 Google Cloud Key Management Service 上的CMK 。
- 使用您的CMK插入加密文档的客户端应用程序。

## 开始之前

要完成并运行本指南中的代码，您需要设置您的开发环境，如[安装要求](https://www.mongodb.com/docs/manual/core/queryable-encryption/install/#std-label-qe-install)页面所示。

> 提示:
>
> **请参阅：完整应用程序**
>
> 要查看您在本指南中创建的应用程序的完整代码，请选择与您的编程语言对应的选项卡，然后点击提供的链接：
>
> * mongosh
>   * [Complete Mongosh Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/gcp/reader/)
> * Node.js
>   * [Complete Node.js Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/node/gcp/reader/)
> * Python
>   * [Complete Python Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/python/gcp/reader/)
> * Java
>   * [Complete Java Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/java/gcp/reader/)
> * Go
>   * [Complete Go Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/go/gcp/reader/)
> * C#
>   * [Complete Go Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/dotnet/gcp/reader/)

## 设置 KMS

1. 注册 GCP 服务帐号

   * 注册或登录您现有的帐户[谷歌云](https://cloud.google.com/)

   * 为您的项目创建一个服务帐户

     要在 Google Cloud 上创建服务帐户，请按照 [创建服务帐号](https://cloud.google.com/iam/docs/creating-managing-service-accounts#creating) 谷歌官方文档中的指南。

   * 添加服务帐号密钥

     要在 Google Cloud 上添加服务帐户密钥，请按照 [管理服务帐户密钥](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) 谷歌官方文档中的指南。

     > 重要的:
     >
     > 创建服务帐户密钥时，您会收到一次性下载的私钥信息。确保以 PKCS12 或 JSON 格式下载此文件，以便在本教程后面使用。

2. 创建 GCP 客户主密钥

   * 创建一个新的客户主密钥

     按照以下步骤创建密钥环和对称密钥 [创建密钥](https://cloud.google.com/kms/docs/creating-keys) 谷歌官方文档中的指南。

     此密钥是您的客户主密钥 ( CMK )。

     记录您的CMK的以下详细信息，以便在本教程的后续步骤中使用。

     | 场地        | 必需的 | 描述                                                         |
     | :---------- | :----- | :----------------------------------------------------------- |
     | key_name    | Yes    | CMK的标识符。                                                |
     | key_ring    | Yes    | 您的密钥所属的密钥组的标识符。                               |
     | key_version | No     | 指定密钥的版本。                                             |
     | location    | Yes    | 为您的密钥指定的区域。                                       |
     | endpoint    | No     | Google Cloud KMS 的主机和可选端口。默认值为`cloudkms.googleapis.com`。 |

## 创建应用程序

选择与您在应用程序中使用的 MongoDB 驱动程序相对应的选项卡，以查看相关代码示例。

1. 在 Key Vault 集合上创建唯一索引

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

2. 创建您的数据加密密钥和加密集合

   * 添加您的 GCP KMS 凭据

     将服务帐户凭据添加到启用了可查询加密的客户端代码中。

     选择与您首选的 MongoDB 驱动程序对应的选项卡：

     > 提示:
     >
     > 您将包含服务帐户密钥凭据的文件保存在[创建 GCP 服务帐号](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/gcp/gcp-automatic/#std-label-qe-gcp-register-account) 本指南的步骤。
     >
     > 如果您下载了 JSON 格式的凭据，则可以使用以下命令提取私钥的值，并替换`<credentials-filename>`为您的凭据文件的名称：
     >
     > ```
     > cat <credentials-filename> | jq -r .private_key | openssl pkcs8 -topk8 -nocrypt -inform PEM -outform DER | base64
     > ```
     >
     > 如果您以 PKCS12 格式下载您的凭据，则需要指定您的 GCP 服务帐户导入密码并添加 PEM 密码短语以在使用以下命令访问密钥时访问它，并替换为您的凭据文件的名称`<credentials-filename>`：
     >
     > ```
     > openssl pkcs12 -info -in <credentials-filename>
     > ```

     ```
     const provider = "gcp";
     const kmsProviders = {
       gcp: {
         email: "<Your GCP Email>",
         privateKey: "<Your GCP Private Key>",
       },
     };
     ```

     > 提示:
     >
     > **了解更多**
     >
     > 要详细了解 GCP 的 KMS 提供程序对象，请参阅 [Google Cloud Platform KMS 。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-reference-kms-providers-gcp)

   * 添加您的关键信息

     更新以下代码以指定您的客户主密钥：

     > 提示:
     >
     > 您在中记录了您的客户主密钥详细信息[创建客户主密钥](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/gcp/gcp-automatic/#std-label-qe-gcp-create-master-key) 本指南的步骤。

     ```
     const masterKey = {
       projectId: "<Your Project ID>",
       location: "<Your Key Location>",
       keyRing: "<Your Key Ring>",
       keyName: "<Your Key Name>",
     };
     ```

   * 生成您的数据加密密钥

     使用 MongoDB 连接字符串和 Key Vault 集合命名空间构建客户端，并创建数据加密密钥：

     > 笔记:
     >
     > **Key Vault 集合命名空间权限**
     >
     > 本指南中的 Key Vault 集合是数据库`__keyVault` 中的集合`encryption`。确保您的应用程序用于连接到 MongoDB 的数据库用户具有[读写](https://www.mongodb.com/docs/manual/reference/built-in-roles/#readWrite) 命名空间的权限`encryption.__keyVault`。

     ```
     const autoEncryptionOpts = {
       keyVaultNamespace: keyVaultNamespace,
       kmsProviders: kmsProviders,
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
   > **了解更多**
   >
   > 要查看显示您的客户端应用程序在使用 Google 云密钥管理服务时如何创建您的数据加密密钥的图表，请参阅 [架构。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-reference-kms-providers-gcp-architecture)
   >
   > 要详细了解用于创建使用 Azure Key Vault 中托管的客户主密钥加密的数据加密密钥的选项，请参阅 [kmsProviders 对象](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-kms-provider-object-gcp)和 [dataKeyOpts 对象。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-kms-datakeyopts-gcp)

   > 提示:
   >
   > **请参阅：完整代码**
   >
   > 要查看制作数据加密密钥的完整代码，请参阅 [Queryable Encryption 示例应用程序存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/gcp/reader/make_data_key.js)

3. 配置您的 MongoClient 以进行加密读写

   * 指定 Key Vault 集合命名空间

     指定`encryption.__keyVault`为 Key Vault 集合命名空间。

     ```
     const keyVaultDB = "encryption";
     const keyVaultColl = "__keyVault";
     const keyVaultNamespace = `${keyVaultDB}.${keyVaultColl}`;
     const secretDB = "medicalRecords";
     const secretCollection = "patients";
     ```

   * 指定您的云帐户凭据

     指定云提供商和您的服务帐户凭据：

     ```
     const kmsProviders = {
       gcp: {
         email: "<Your GCP Email>",
         privateKey: "<Your GCP Private Key>",
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

4. 插入带有加密字段的文档

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

   > 警告:
   >
   > **不要修改 __safeContent__ 字段**
   >
   > 该`__safeContent__`字段对于可查询加密至关重要。不要修改该字段的内容。

   > 提示:
   >
   > **请参阅：完整代码**
   >
   > 要查看插入加密文档的完整代码，请参见 [Queryable Encryption 示例应用程序存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/gcp/reader/insert_encrypted_document.js)

5. 检索您的加密文档

   检索您插入的加密文档 [插入带有加密字段的文档](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/gcp/gcp-automatic/#std-label-qe-gcp-insert) 本指南的步骤。

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

   > 提示;
   >
   > **请参阅：完整代码**
   >
   > 要查看查找加密文档的完整代码，请参见 [Queryable Encryption 示例应用程序存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/gcp/reader/insert_encrypted_document.js)

## 了解更多

要了解有关本指南中提到的主题的更多信息，请参阅以下链接：

- [在参考](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/#std-label-qe-reference)页面上了解有关可查询加密组件的更多信息。
- [在密钥和密钥保管库](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/keys-key-vaults/#std-label-qe-reference-keys-key-vaults)页面上了解客户主密钥和数据加密密钥的工作原理。
- [在KMS 提供商](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-fundamentals-kms-providers)页面上查看 KMS 提供商如何管理您的可查询加密密钥。







译者：韩鹏帅

原文：[Use Automatic Queryable Encryption with GCP](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/gcp/gcp-automatic/)