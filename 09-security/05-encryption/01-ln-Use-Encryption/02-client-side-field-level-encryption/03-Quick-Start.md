# 快速开始

## 概述

本指南向您展示如何使用自动客户端字段级加密 (CSFLE) 和 MongoDB 驱动程序来加密文档。

完成本指南后，您应该具备以下知识和软件：

- 了解配置驱动程序以加密文档中的字段的步骤。
- 使用自动客户端字段级加密的工作但不是生产就绪的客户端应用程序。

> 重要的:
>
> **不要在生产中使用此应用程序**
>
> 由于此示例应用程序将加密密钥存储在应用程序的文件系统中，因此您可能会面临未经授权访问密钥或丢失用于解密数据的密钥的风险。
>
> 要查看演示如何创建支持 CSFLE 的生产就绪应用程序的教程，请参阅 [教程。](https://www.mongodb.com/docs/manual/core/csfle/tutorials/#std-label-csfle-tutorial-automatic-encryption)

## 开始之前

要完成并运行本指南中的代码，您需要设置您的开发环境，如[安装要求](https://www.mongodb.com/docs/manual/core/csfle/install/#std-label-csfle-install)页面所示。

从页面右侧的**选择您的语言**下拉菜单中选择您想要查看其代码示例的编程语言。

>提示:
>
>**请参阅：完整应用程序**
>
>要查看本教程的完整可运行应用程序代码，请转到以下链接：
>
>[完整的 C# 应用程序](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/local/reader/CSFLE/)

## 步骤

```
// You are viewing the C# driver code examples.
// Use the dropdown menu to select a different driver.
```

1. 创建客户主密钥

   您必须创建客户主密钥 ( CMK ) 才能执行 CSFLE。

   创建一个 96 字节的 Customer Master Key 并将其保存在您的**Local Key Provider**中，这是您的文件系统，作为文件`master-key.txt`

   ```
   openssl rand 96 > master-key.txt
   ```

   > 笔记:
   >
   > **使用编程语言创建客户主密钥**
   >
   > 如果您更愿意使用您喜欢的编程语言来生成您的CMK，您可以查看演示如何使用本指南的每种支持语言生成客户主密钥的代码片段[Github](https://github.com/mongodb/docs/tree/master/source/includes/quick-start/generate-master-key)

   > 警告:
   >
   > **不要在生产中使用本地密钥提供程序**
   >
   > 本地密钥提供程序是一种不安全的存储方法，不 **建议**用于生产。相反，您应该将客户主密钥存储在远程 [密钥管理系统](https://en.wikipedia.org/wiki/Key_management#Key_management_system) （公里）。
   >
   > 要了解如何在 CSFLE 实施中使用远程 KMS，请参阅[教程](https://www.mongodb.com/docs/manual/core/csfle/tutorials/#std-label-csfle-tutorial-automatic-encryption)指南。

2. 在 Key Vault 集合上创建唯一索引

   `keyAltNames`在集合中的字段 上创建唯一索引`encryption.__keyVault`。

   选择与您首选的 MongoDB 驱动程序对应的选项卡：

   ```
   var connectionString = "<Your MongoDB URI>";
   var keyVaultNamespace = CollectionNamespace.FromFullName("encryption.__keyVault");
   var keyVaultClient = new MongoClient(connectionString);
   var indexOptions = new CreateIndexOptions<BsonDocument>();
   indexOptions.Unique = true;
   indexOptions.PartialFilterExpression = new BsonDocument { { "keyAltNames", new BsonDocument { { "$exists", new BsonBoolean(true) } } } };
   var builder = Builders<BsonDocument>.IndexKeys;
   var indexKeysDocument = builder.Ascending("keyAltNames");
   var indexModel = new CreateIndexModel<BsonDocument>(indexKeysDocument, indexOptions);
   var keyVaultDatabase = keyVaultClient.GetDatabase(keyVaultNamespace.DatabaseNamespace.ToString());
   // Drop the Key Vault Collection in case you created this collection
   // in a previous run of this application.  
   keyVaultDatabase.DropCollection(keyVaultNamespace.CollectionName);
   // Drop the database storing your encrypted fields as all
   // the DEKs encrypting those fields were deleted in the preceding line.
   keyVaultClient.GetDatabase("medicalRecords").DropCollection("patients");
   var keyVaultCollection = keyVaultDatabase.GetCollection<BsonDocument>(keyVaultNamespace.CollectionName.ToString());
   keyVaultCollection.Indexes.CreateOne(indexModel);
   ```

3. 创建数据加密密钥

   * 读取客户主密钥并指定 KMS 提供商设置

     检索您在[创建客户主密钥](https://www.mongodb.com/docs/manual/core/csfle/quick-start/#std-label-csfle-quick-start-create-master-key)本指南的步骤。

     将CMK值传递给您的 KMS 提供商设置。客户端使用这些设置来发现CMK。当您使用本地密钥提供程序时，请将提供程序名称设置为 `local`。

     ```
     var kmsProviders = new Dictionary<string, IReadOnlyDictionary<string, object>>();
     var provider = "local";
     string localMasterKeyBase64Read = File.ReadAllText("master-key.txt");
     var localMasterKeyBytes = Convert.FromBase64String(localMasterKeyBase64Read);
     var localOptions = new Dictionary<string, object>
     {
         { "key", localMasterKeyBytes }
     };
     kmsProviders.Add("local", localOptions);
     ```

   * 创建数据加密密钥

     使用您的 MongoDB 连接字符串和 Key Vault 集合命名空间构造一个客户端，并创建一个数据加密密钥：

     > 笔记:
     >
     > **Key Vault 集合命名空间权限**
     >
     > 本指南中的 Key Vault 集合是数据库`__keyVault` 中的集合`encryption`。确保您的应用程序用于连接到 MongoDB 的数据库用户具有[读写](https://www.mongodb.com/docs/manual/reference/built-in-roles/#readWrite) 命名空间的权限`encryption.__keyVault`。

     ```
     var clientEncryptionOptions = new ClientEncryptionOptions(
         keyVaultClient: keyVaultClient,
         keyVaultNamespace: keyVaultNamespace,
         kmsProviders: kmsProviders
         );
     
     var clientEncryption = new ClientEncryption(clientEncryptionOptions);
     var dataKeyOptions = new DataKeyOptions();
     var dataKeyId = clientEncryption.CreateDataKey(provider, dataKeyOptions, CancellationToken.None);
     var dataKeyIdBase64 = Convert.ToBase64String(GuidConverter.ToBytes(dataKeyId, GuidRepresentation.Standard));
     Console.WriteLine($"DataKeyId [base64]: {dataKeyIdBase64}");
     ```

     上述代码的输出应类似于以下内容：

     ```
     DataKeyId [base64]: 3k13WkSZSLy7kwAAP4HDyQ==
     ```

   > 提示:
   >
   > **请参阅：完整代码**
   >
   > 要查看制作数据加密密钥的完整代码，请参阅 [我们的 Github 存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/local/reader/CSFLE/MakeDataKey.cs)

4. 配置 MongoClient

   * 指定 Key Vault 集合命名空间

     指定`encryption.__keyVault`为 Key Vault 集合命名空间。

     ```
     var keyVaultNamespace = CollectionNamespace.FromFullName("encryption.__keyVault");
     ```

   * 指定本地客户主密钥

     指定 KMS 提供商并指定您的内联密钥：

     ```
     var kmsProviders = new Dictionary<string, IReadOnlyDictionary<string, object>>();
     var provider = "local";
     var localMasterKeyPath = "master-key.txt";
     string localMasterKeyBase64Read = File.ReadAllText(localMasterKeyPath);
     var localMasterKeyBytes = Convert.FromBase64String(localMasterKeyBase64Read);
     var localOptions = new Dictionary<string, object>
     {
         { "key", localMasterKeyBytes }
     };
     kmsProviders.Add(provider, localOptions);
     ```

   * 为您的收藏创建加密模式

     > 提示:
     >
     > **添加您的数据加密密钥 Base64 ID**
     >
     > 确保更新以下代码以包含您的 Base64 DEK ID。您在 [生成您的数据加密密钥](https://www.mongodb.com/docs/manual/core/csfle/quick-start/#std-label-csfle-local-create-dek)本指南的步骤。

     ```
     var keyId = "<Your base64 DEK ID here>";
     var schema = new BsonDocument
     {
        { "bsonType", "object" },
        {
            "encryptMetadata",
            new BsonDocument("keyId", new BsonArray(new[] { new BsonBinaryData(Convert.FromBase64String(keyId), BsonBinarySubType.UuidStandard) }))
        },
        {
            "properties",
            new BsonDocument
            {
                {
                    "ssn", new BsonDocument
                    {
                        {
                            "encrypt", new BsonDocument
                            {
                                { "bsonType", "int" },
                                { "algorithm", "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic" }
                            }
                        }
                    }
                },
                {
                    "bloodType", new BsonDocument
                    {
                        {
                            "encrypt", new BsonDocument
                            {
                                { "bsonType", "string" },
                                { "algorithm", "AEAD_AES_256_CBC_HMAC_SHA_512-Random" }
                            }
                        }
                    }
                },
                {
                    "medicalRecords", new BsonDocument
                    {
                        {
                            "encrypt", new BsonDocument
                            {
                                { "bsonType", "array" },
                                { "algorithm", "AEAD_AES_256_CBC_HMAC_SHA_512-Random" }
                            }
                        }
                    }
                },
                {
                    "insurance", new BsonDocument
                    {
                        { "bsonType", "object" },
                        {
                            "properties", new BsonDocument
                            {
                                {
                                    "policyNumber", new BsonDocument
                                    {
                                        {
                                            "encrypt", new BsonDocument
                                            {
                                                { "bsonType", "int" },
                                                { "algorithm", "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
     };
     var schemaMap = new Dictionary<string, BsonDocument>();
     schemaMap.Add(dbNamespace, schema);
     ```

   * 指定加密二进制文件的位置

     `mongocryptd`通过使用以下配置选项指定二进制文件的路径，将客户端配置为生成进程：

     > 笔记:
     >
     > **加密可执行文件**
     >
     > 如果`mongocryptd.exe`可执行文件不在 PATH 中，请指定生成路径。
     >
     > ```
     > var mongoBinariesPath = "<Path to mongocryptd binary>";
     > var extraOptions = new Dictionary<string, object>()
     > {
     >    { "mongocryptdSpawnPath", mongoBinariesPath },
     > };
     > ```

   * 创建 MongoClient

     使用以下自动加密设置实例化 MongoDB 客户端对象：

     ```
     var clientSettings = MongoClientSettings.FromConnectionString(connectionString);
     var autoEncryptionOptions = new AutoEncryptionOptions(
         keyVaultNamespace: keyVaultNamespace,
         kmsProviders: kmsProviders,
         schemaMap: schemaMap,
         extraOptions: extraOptions
         );
     clientSettings.AutoEncryptionOptions = autoEncryptionOptions;
     var secureClient = new MongoClient(clientSettings);
     ```

5. 插入带有加密字段的文档

   使用启用 CSFLE 的 实例使用以下代码片段`MongoClient`将加密文档插入 命名空间：`medicalRecords.patients`

   ```
   var sampleDocFields = new BsonDocument
   {
       { "name", "Jon Doe" },
       { "ssn", 145014000 },
       { "bloodType", "AB-" },
       {
           "medicalRecords", new BsonArray
           {
               new BsonDocument("weight", 180),
               new BsonDocument("bloodPressure", "120/80")
           }
       },
       {
           "insurance", new BsonDocument
           {
               { "policyNumber", 123142 },
               { "provider", "MaestCare" }
           }
       }
   };
   
   // Construct an auto-encrypting client
   var secureCollection = secureClient.GetDatabase(db).GetCollection<BsonDocument>(coll);
   
   // Insert a document into the collection
   secureCollection.InsertOne(sampleDocFields);
   ```

   插入文档时，支持 CSFLE 的客户端会加密文档的字段，使其类似于以下内容：

   ```
   {
     "_id": { "$oid": "<_id of your document>" },
     "name": "Jon Doe",
     "ssn": {
       "$binary": "<cipher-text>",
       "$type": "6"
     },
     "bloodType": {
       "$binary": "<cipher-text>",
       "$type": "6"
     },
     "medicalRecords": {
       "$binary": "<cipher-text>",
       "$type": "6"
     },
     "insurance": {
       "provider": "MaestCare",
       "policyNumber": {
         "$binary": "<cipher-text>",
         "$type": "6"
       }
     }
   }
   
   ```

   > 提示:
   >
   > **请参阅：完整代码**
   >
   > 要查看插入加密文档的完整代码，请参见 [我们的 Github 存储库](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/local/reader/CSFLE/InsertEncryptedDocument.cs)

6. 检索您的加密文档

   检索您插入的加密文档 [插入带有加密字段的文档](https://www.mongodb.com/docs/manual/core/csfle/quick-start/#std-label-csfle-quick-start-insert) 本指南的步骤。

   为了展示 CSFLE 的功能，以下代码片段使用配置为自动 CSFLE 的客户端以及未配置为自动 CSFLE 的客户端查询您的文档。

   ```
   Console.WriteLine("Finding a document with regular (non-encrypted) client.");
   var filter = Builders<BsonDocument>.Filter.Eq("name", "Jon Doe");
   var regularResult = regularCollection.Find(filter).Limit(1).ToList()[0];
   Console.WriteLine($"\n{regularResult}\n");
   
   Console.WriteLine("Finding a document with encrypted client, searching on an encrypted field");
   var ssnFilter = Builders<BsonDocument>.Filter.Eq("ssn", 145014000);
   var secureResult = secureCollection.Find(ssnFilter).Limit(1).First();
   Console.WriteLine($"\n{secureResult}\n");
   ```

   上述代码片段的输出应如下所示：

   ```
   Finding a document with regular (non-encrypted) client.
   
   {
     _id: new ObjectId("629a452e0861b3130887103a"),
     name: 'Jon Doe',
     ssn: new Binary(Buffer.from("0217482732d8014cdd9ffdd6e2966e5e7910c20697e5f4fa95710aafc9153f0a3dc769c8a132a604b468732ff1f4d8349ded3244b59cbfb41444a210f28b21ea1b6c737508d9d30e8baa30c1d8070c4d5e26", "hex"), 6),
     bloodType: new Binary(Buffer.from("0217482732d8014cdd9ffdd6e2966e5e79022e238536dfd8caadb4d7751ac940e0f195addd7e5c67b61022d02faa90283ab69e02303c7e4001d1996128428bf037dea8bbf59fbb20c583cbcff2bf3e2519b4", "hex"), 6),
     'key-id': 'demo-data-key',
     medicalRecords: new Binary(Buffer.from("0217482732d8014cdd9ffdd6e2966e5e790405163a3207cff175455106f57eef14e5610c49a99bcbd14a7db9c5284e45e3ee30c149354015f941440bf54725d6492fb3b8704bc7c411cff6c868e4e13c58233c3d5ed9593eca4e4d027d76d3705b6d1f3b3c9e2ceee195fd944b553eb27eee69e5e67c338f146f8445995664980bf0", "hex"), 6),
     insurance: {
       policyNumber: new Binary(Buffer.from("0217482732d8014cdd9ffdd6e2966e5e79108decd85c05be3fec099e015f9d26d9234605dc959cc1a19b63072f7ffda99db38c7b487de0572a03b2139ac3ee163bcc40c8508f366ce92a5dd36e38b3c742f7", "hex"), 6),
       provider: 'MaestCare'
     }
   }
   
   Finding a document with encrypted client, searching on an encrypted field
   
   {
     _id: new ObjectId("629a452e0861b3130887103a"),
     name: 'Jon Doe',
     ssn: 241014209,
     bloodType: 'AB+',
     'key-id': 'demo-data-key',
     medicalRecords: [ { weight: 180, bloodPressure: '120/80' } ],
     insurance: { policyNumber: 123142, provider: 'MaestCare' }
   }
   ```

   > 提示:
   >
   > **请参阅：完整代码**
   >
   > 要查看查找加密文档的完整代码，请参见 [我们的 Github 存储库](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/local/reader/CSFLE/InsertEncryptedDocument.cs)

## 了解更多

要查看有关使用远程 KMS 的生产就绪 CSFLE 的教程，请参阅[教程。](https://www.mongodb.com/docs/manual/core/csfle/tutorials/#std-label-csfle-tutorial-automatic-encryption)

要了解 CSFLE 的工作原理，请参阅 [基础知识。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/#std-label-csfle-fundamentals)

要了解有关本指南中提到的主题的更多信息，请参阅以下链接：

- [客户主密钥](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)
- [密钥管理系统提供商](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers)
- [数据加密密钥](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)
- [Key Vault 集合](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)
- [加密模式](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#std-label-csfle-reference-encryption-schemas)
- [mongocryptd](https://www.mongodb.com/docs/manual/core/csfle/reference/mongocryptd/#std-label-csfle-reference-mongocryptd)
- [CSFLE 特定的 MongoClient 设置](https://www.mongodb.com/docs/manual/core/csfle/reference/csfle-options-clients/#std-label-csfle-reference-mongo-client)
- [自动 CSFLE 写入](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/automatic-encryption/#std-label-csfle-fundamentals-automatic-encryption)







译者：韩鹏帅

原文：[Quick Start](https://www.mongodb.com/docs/manual/core/csfle/quick-start/)