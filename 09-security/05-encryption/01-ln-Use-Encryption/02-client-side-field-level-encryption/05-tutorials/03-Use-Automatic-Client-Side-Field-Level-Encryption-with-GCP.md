## 通过 GCP 使用自动客户端字段级加密

## 概述

本指南向您展示如何使用 Google Cloud Key Management Service 构建支持客户端字段级加密 (CSFLE) 的应用程序。

完成本指南中的步骤后，您应该：

- 托管在 Google Cloud Key Management Service 上的CMK 。
- 使用您的CMK插入加密文档的客户端应用程序。

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
> [完整的 C# 应用程序](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/gcp/reader/CSFLE/)

## 设置 KMS

```
// You are viewing the C# driver code examples.
// Use the dropdown menu to select a different driver.
```

1. 注册 GCP 服务帐户

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

     | Field       | Required | 描述                                                         |
     | :---------- | :------- | :----------------------------------------------------------- |
     | key_name    | Yes      | CMK的标识符。                                                |
     | key_ring    | Yes      | 您的密钥所属的密钥组的标识符。                               |
     | key_version | No       | 指定密钥的版本。                                             |
     | location    | Yes      | 为您的密钥指定的区域。                                       |
     | endpoint    | No       | Google Cloud KMS 的主机和可选端口。默认值为`cloudkms.googleapis.com`。 |

## 创建应用程序

选择与您在应用程序中使用的 MongoDB 驱动程序相对应的选项卡，以查看相关代码示例。

1. 在 Key Vault 集合上创建唯一索引

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

   * 添加您的 GCP KMS 凭据

     将服务帐户凭据添加到支持 CSFLE 的客户端代码。

     > 提示:
     >
     > 您将包含服务帐户密钥凭据的文件保存在[创建 GCP 服务帐号](https://www.mongodb.com/docs/manual/core/csfle/tutorials/gcp/gcp-automatic/#std-label-gcp-register-account) 本指南的步骤。
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
     var kmsProviders = new Dictionary<string, IReadOnlyDictionary<string, object>>();
     var provider = "gcp";
     var gcpKmsOptions = new Dictionary<string, object>
     {
        { "privateKey", "<Your GCP Private Key>" },
        { "email", "<Your GCP Email>" },
     };
     kmsProviders.Add(provider, gcpKmsOptions);
     ```

     > 提示:
     >
     > **了解更多**
     >
     > 要详细了解 GCP 的 KMS 提供程序对象，请参阅 [Google Cloud Platform KMS 。](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers-gcp)

   * 添加您的关键信息

     更新以下代码以指定您的客户主密钥：

     > 提示:
     >
     > 您在中记录了您的客户主密钥详细信息[创建客户主密钥](https://www.mongodb.com/docs/manual/core/csfle/tutorials/gcp/gcp-automatic/#std-label-gcp-create-master-key) 本指南的步骤。

     ```
     var dataKeyOptions = new DataKeyOptions(
        masterKey: new BsonDocument
        {
            { "projectId", "Your GCP Project ID" },
            { "location", "Your GCP Key Location" } ,
            { "keyRing", "<Your GCP Key Ring>" },
            { "keyName", "<Your GCP Key Name>" },
        });
     ```

   * 生成您的数据加密密钥

     ```
     var clientEncryptionOptions = new ClientEncryptionOptions(
         keyVaultClient: keyVaultClient,
         keyVaultNamespace: keyVaultNamespace,
         kmsProviders: kmsProviders
         );
     
     var clientEncryption = new ClientEncryption(clientEncryptionOptions);
     var dataKeyId = clientEncryption.CreateDataKey(provider, dataKeyOptions, CancellationToken.None);
     var dataKeyIdBase64 = Convert.ToBase64String(GuidConverter.ToBytes(dataKeyId, GuidRepresentation.Standard));
     Console.WriteLine($"DataKeyId [base64]: {dataKeyIdBase64}");
     ```

   > 提示:
   >
   > **了解更多**
   >
   > 要查看显示您的客户端应用程序在使用 Google 云密钥管理服务时如何创建您的数据加密密钥的图表，请参阅 [架构。](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers-gcp-architecture)
   >
   > 要详细了解用于创建使用 Azure Key Vault 中托管的客户主密钥加密的数据加密密钥的选项，请参阅 [kmsProviders 对象](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-kms-provider-object-gcp)和 [dataKeyOpts 对象。](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-kms-datakeyopts-gcp)

   > 提示:
   >
   > **请参阅：完整代码**
   >
   > 要查看制作数据加密密钥的完整代码，请参阅 [我们的 Github 存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/gcp/reader/CSFLE/MakeDataKey.cs)

3. 配置 MongoClient

   * 指定 Key Vault 集合命名空间

     指定`encryption.__keyVault`为 Key Vault 集合命名空间。

     ```
     var keyVaultNamespace = CollectionNamespace.FromFullName("encryption.__keyVault");
     ```

   * 指定您的云帐户凭据

     指定云提供商和您的服务帐户凭据：

     ```
     var kmsProviders = new Dictionary<string, IReadOnlyDictionary<string, object>>();
     var provider = "gcp";
     var gcpKmsOptions = new Dictionary<string, object>
     {
        { "privateKey", "<Your GCP Private Key>" },
        { "email", "<Your GCP Email>" },
     };
     kmsProviders.Add(provider, gcpKmsOptions);
     ```

   * 为您的收藏创建加密模式

     > 提示:
     >
     > **添加您的数据加密密钥 Base64 ID**
     >
     > 确保更新以下代码以包含您的 Base64 DEK ID。您在 [生成您的数据加密密钥](https://www.mongodb.com/docs/manual/core/csfle/tutorials/gcp/gcp-automatic/#std-label-csfle-gcp-create-dek)本指南的步骤。

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
         extraOptions: extraOptions
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
   > 要查看插入加密文档的完整代码，请参见 [我们的 Github 存储库](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/gcp/reader/CSFLE/InsertEncryptedDocument.cs)
   >
   > 

5. 检索您的加密文档

   检索您插入的加密文档 [插入带有加密字段的文档](https://www.mongodb.com/docs/manual/core/csfle/tutorials/gcp/gcp-automatic/#std-label-csfle-gcp-insert) 本指南的步骤。

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
   > 要查看查找加密文档的完整代码，请参见 [我们的 Github 存储库](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/gcp/reader/CSFLE/InsertEncryptedDocument.cs)

## 了解更多

要了解有关本指南中提到的主题的更多信息，请参阅以下链接：

- [在参考](https://www.mongodb.com/docs/manual/core/csfle/reference/#std-label-csfle-reference)页面上了解有关 CSFLE 组件的更多信息。
- [在密钥和密钥保管库](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)页面上了解客户主密钥和数据加密密钥的工作原理
- [在CSFLE KMS 提供商](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers)页面上查看 KMS 提供商如何管理您的 CSFLE 密钥。







译者：韩鹏帅

原文：[Use Automatic Client-Side Field Level Encryption with GCP](https://www.mongodb.com/docs/manual/core/csfle/tutorials/gcp/gcp-automatic/)