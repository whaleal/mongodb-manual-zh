## 通过 KMIP 使用自动客户端字段级加密

## 概述

本指南向您展示如何使用符合密钥管理互操作性协议 (KMIP) 的密钥提供程序构建支持客户端字段级加密 (CSFLE) 的应用程序。

完成本指南中的步骤后，您应该：

* 托管在符合KMIP 的密钥提供程序上的客户主密钥。
* 使用您的客户主密钥插入加密文档的工作客户端应用程序。

## 开始之前

要完成并运行本指南中的代码，您需要设置您的开发环境，如[安装要求](https://www.mongodb.com/docs/manual/core/csfle/install/#std-label-csfle-install)页面所示。

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
> [完整的 C# 应用程序](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/kmip/reader/CSFLE/)

## 设置 KMS

> 笔记:
>
> `mongod`在启动时读取 KMIP 配置。默认情况下，服务器使用 KMIP 协议版本 1.2。
>
> 要连接到版本 1.0 或 1.1 KMIP 服务器，请使用该 [`useLegacyProtocol`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.kmip.useLegacyProtocol) 设置。

```
// You are viewing the C# driver code examples.
// Use the dropdown menu to select a different driver.
```

1. 配置符合 KMIP 的密钥提供程序

   要将 MongoDB 驱动程序客户端连接到您的KMIP兼容密钥提供程序，您必须配置您的KMIP兼容密钥提供程序，以便它接受您的客户端的 TLS 证书。

   有关如何接受客户端证书的信息，请参阅您的KMIP兼容密钥提供程序的文档。

2. 指定您的证书

   您的客户端必须通过 TLS 连接到符合KMIP 的密钥提供程序，并出示符合KMIP的密钥提供程序接受的客户端证书：

   ```
   var tlsOptions = new Dictionary<string, SslSettings>();
   var sslSettings = new SslSettings();
   var clientCertificate = new X509Certificate2("<path to your pkcs12 client certificate file>");
   sslSettings.ClientCertificates = new List<X509Certificate>() {
       clientCertificate,
    };
   tlsOptions.Add(provider, sslSettings);
   ```

   > 重要的:
   >
   > 您的客户端证书必须采用 pcks12 格式。您可以通过以下命令使用 openssl 转换您的证书：
   >
   > ```
   > openssl pcks12 -export -out "<new pcks12 certificate>" -in "<certificate to convert>" \
   > -name "<new certificate name>" -password "<new certificate password>"
   > ```

## 创建应用程序

选择与您在应用程序中使用的 MongoDB 驱动程序相对应的选项卡，以查看相关代码示例。

1. 在您的 Key Vault 集合上创建唯一索引

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

2. 创建数据加密密钥

   * 添加您的端点

     指定符合KMIP的密钥提供程序的 URI 端点：

     ```
     var kmsProviders = new Dictionary<string, IReadOnlyDictionary<string, object>>();
     var provider = "kmip";
     var kmipKmsOptions = new Dictionary<string, object>
     {
        { "endpoint", "<endpoint for your KMIP-compliant key provider>" },
     };
     kmsProviders.Add(provider, kmipKmsOptions);
     ```

   * 添加您的关键信息

     以下代码提示您的KMIP兼容密钥提供程序自动生成客户主密钥：

     ```
     var dataKeyOptions = new DataKeyOptions(
         masterKey: new BsonDocument { } // an empty key object prompts your KMIP-compliant key provider to generate a new Customer Master Key
     );
     ```

   * 生成您的数据加密密钥

     ```
     var clientEncryptionOptions = new ClientEncryptionOptions(
         keyVaultClient: keyVaultClient,
         keyVaultNamespace: keyVaultNamespace,
         kmsProviders: kmsProviders,
         tlsOptions: tlsOptions
         );
     
     var clientEncryption = new ClientEncryption(clientEncryptionOptions);
     var dataKeyId = clientEncryption.CreateDataKey(provider, dataKeyOptions, CancellationToken.None);
     var dataKeyIdBase64 = Convert.ToBase64String(GuidConverter.ToBytes(dataKeyId, GuidRepresentation.Standard));
     Console.WriteLine($"DataKeyId [base64]: {dataKeyIdBase64}");
     ```

   > 提示:
   >
   > **请参阅：完整代码**
   >
   > 要查看制作数据加密密钥的完整代码，请参阅 [我们的 Github 存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/kmip/reader/CSFLE/MakeDataKey.cs)

3. 配置 MongoClient

   * 指定 Key Vault 集合命名空间

     指定`encryption.__keyVault`为 Key Vault 集合命名空间。

     ```
     var keyVaultNamespace = CollectionNamespace.FromFullName("encryption.__keyVault");
     ```

   * 指定您的 KMIP 端点

     `kmip`在您的对象中指定并输入符合KMIP 的`kmsProviders`密钥提供程序的 URI 端点：

     ```
     var kmsProviders = new Dictionary<string, IReadOnlyDictionary<string, object>>();
     var provider = "kmip";
     var kmipKmsOptions = new Dictionary<string, object>
     {
        { "endpoint", "<endpoint for your KMIP-compliant key provider>" },
     };
     kmsProviders.Add(provider, kmipKmsOptions);
     ```

   * 为您的收藏创建加密模式

     创建一个加密模式，指定您的客户端应用程序如何加密文档的字段：

     > 提示:
     >
     > **添加您的数据加密密钥 Base64 ID**
     >
     > 确保更新以下代码以包含您的 Base64 DEK ID。您在 [生成您的数据加密密钥](https://www.mongodb.com/docs/manual/core/csfle/tutorials/kmip/kmip-automatic/#std-label-csfle-kmip-create-dek)本指南的步骤。

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

     > 提示:
     >
     > **深入阅读模式**
     >
     > 要查看有关如何构建您在此步骤中使用的架构的深入说明，请参阅[加密架构](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/create-schema/#std-label-csfle-fundamentals-create-schema)指南。
     >
     > 要查看加密模式的所有受支持加密规则的列表，请参阅 [CSFLE 加密模式](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#std-label-csfle-reference-encryption-schemas)指南。

   * 指定加密二进制文件的位置

     `mongocryptd`通过使用以下配置选项指定二进制文件的路径，将客户端配置为生成进程：

     > 笔记:
     >
     > **加密可执行文件**
     >
     > 如果`mongocryptd.exe`可执行文件不在 PATH 变量中，请指定生成路径。

     ```
     var mongoBinariesPath = "<Path to mongocryptd binary>";
     var extraOptions = new Dictionary<string, object>()
     {
        { "mongocryptdSpawnPath", mongoBinariesPath },
     };
     ```

   * 创建 MongoClient

     使用以下自动加密设置实例化 MongoDB 客户端对象：

     ```
     var clientSettings = MongoClientSettings.FromConnectionString(connectionString);
     var autoEncryptionOptions = new AutoEncryptionOptions(
         keyVaultNamespace: keyVaultNamespace,
         kmsProviders: kmsProviders,
         schemaMap: schemaMap,
         extraOptions: extraOptions,
         tlsOptions: tlsOptions
         );
     clientSettings.AutoEncryptionOptions = autoEncryptionOptions;
     var secureClient = new MongoClient(clientSettings);
     ```

4. 插入带有加密字段的文档

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
   > 要查看插入加密文档的完整代码，请参见 [我们的 Github 存储库](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/kmip/reader/CSFLE/InsertEncryptedDocument.cs)

5. 检索您的加密文档

   检索您插入的加密文档 [插入带有加密字段的文档](https://www.mongodb.com/docs/manual/core/csfle/tutorials/kmip/kmip-automatic/#std-label-csfle-kmip-insert) 本指南的步骤。

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
   > 要查看插入加密文档的完整代码，请参见 [我们的 Github 存储库](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/kmip/reader/CSFLE/InsertEncryptedDocument.cs)

## 了解更多

要了解 CSFLE 的工作原理，请参阅 [基础知识。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/#std-label-csfle-fundamentals)

要了解有关本指南中提到的主题的更多信息，请参阅以下链接：

- [在参考](https://www.mongodb.com/docs/manual/core/csfle/reference/#std-label-csfle-reference)页面上了解有关 CSFLE 组件的更多信息。
- [在密钥和密钥保管库](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)页面上了解客户主密钥和数据加密密钥的工作原理。
- [在CSFLE KMS 提供商](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers)页面上查看 KMS 提供商如何管理您的 CSFLE 密钥。







译者：韩鹏帅

原文：[Use Automatic Client-Side Field Level Encryption with KMIP](https://www.mongodb.com/docs/manual/core/csfle/tutorials/kmip/kmip-automatic/)