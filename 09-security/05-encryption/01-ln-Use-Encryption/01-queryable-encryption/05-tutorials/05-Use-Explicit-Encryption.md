# 使用显式加密

> 注意:
>
> Queryable Encryption 处于公共预览阶段，可用于评估目的。不建议将公共预览版用于生产部署，因为可能会引入重大更改。要了解有关预览版的更多信息，请参阅[可查询加密预览](https://www.mongodb.com/blog/post/mongodb-releases-queryable-encryption-preview/)博客文章。

## 概述

本指南向您展示如何使用显式加密和 MongoDB 驱动程序来加密文档。

完成本指南后，您应该能够配置驱动程序以使用显式加密来加密文档中的字段。有了这些知识，您应该能够创建使用显式加密的客户端应用程序。带自动解密。

> 重要的:
>
> **不要在生产中使用此应用程序**
>
> 由于此示例应用程序将加密密钥存储在应用程序的文件系统中，因此您可能会面临未经授权访问密钥或丢失用于解密数据的密钥的风险。
>
> 要查看演示如何创建使用远程密钥管理系统的启用可查询加密的应用程序的教程，请参阅 [教程。](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/#std-label-qe-tutorial-automatic-encryption)

## 开始之前

要完成并运行本指南中的代码，您需要设置您的开发环境，如[安装要求](https://www.mongodb.com/docs/manual/core/queryable-encryption/install/#std-label-qe-install)页面所示。

> 提示:
>
> **请参阅：完整应用程序**
>
> 要查看您在本指南中创建的应用程序的完整代码，请选择与您首选的 MongoDB 驱动程序对应的选项卡，然后点击提供的链接：
>
> * Node.js
>   * [Complete Node.js Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/node/exp/reader/)
> * Python
>   * [Complete Python Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/python/exp/reader/)
> * Java
>   * [Complete Java Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/java/exp/reader/)
> * Go
>   * [Complete Go Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/go/exp/reader/)
> * C#
>   * [Complete C# Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/dotnet/exp/reader/)

## 程序

1. 创建客户主密钥

   您必须创建客户主密钥 ( CMK ) 才能执行可查询加密。

   创建一个 96 字节的客户主密钥并将其保存到文件中`master-key.txt`：

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
   > **不要在生产中使用本地密钥文件**
   >
   > 文件系统中的本地密钥文件是不安全的， **不建议**用于生产。相反，您应该将客户主密钥存储在远程 [密钥管理系统](https://en.wikipedia.org/wiki/Key_management#Key_management_system) （公里）。
   >
   > 要了解如何在可查询加密实现中使用远程 KMS，请参阅[教程](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/#std-label-qe-tutorial-automatic-encryption)指南。

2. 在 Key Vault 集合上创建唯一索引

   `keyAltNames`在集合中的字段 上创建唯一索引`encryption.__keyVault`。

   选择与您首选的 MongoDB 驱动程序对应的选项卡：

   ```
   var connectionString = "<Your MongoDB URI>";
   var keyVaultNamespace = CollectionNamespace.FromFullName("encryption.__keyVault");
   var keyVaultClient = new MongoClient(connectionString);
   var indexOptions = new CreateIndexOptions<BsonDocument>
   {
       Unique = true,
       PartialFilterExpression = new BsonDocument
           {{"keyAltNames", new BsonDocument {{"$exists", new BsonBoolean(true)}}}}
   };
   var builder = Builders<BsonDocument>.IndexKeys;
   var indexKeysDocument = builder.Ascending("keyAltNames");
   var indexModel = new CreateIndexModel<BsonDocument>(indexKeysDocument, indexOptions);
   var keyVaultDatabase = keyVaultClient.GetDatabase(keyVaultNamespace.DatabaseNamespace.DatabaseName);
   // Drop the Key Vault Collection in case you created this collection
   // in a previous run of this application.
   keyVaultDatabase.DropCollection(keyVaultNamespace.CollectionName);
   var keyVaultCollection = keyVaultDatabase.GetCollection<BsonDocument>(keyVaultNamespace.CollectionName);
   keyVaultCollection.Indexes.CreateOne(indexModel);
   ```

3. 创建您的数据加密密钥和加密集合

   * 读取客户主密钥并指定 KMS 提供商设置

     检索您在[创建客户主密钥](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/explicit-encryption/#std-label-qe-manual-enc-create-master-key)本指南的步骤。

     将CMK值传递给您的 KMS 提供商设置。客户端使用这些设置来发现CMK。将提供程序名称设置为`local`以通知驱动程序您正在使用本地密钥提供程序。

     选择与您首选的 MongoDB 驱动程序对应的选项卡：

     ```
     var kmsProviders = new Dictionary<string, IReadOnlyDictionary<string, object>>();
     const string provider = "local";
     var localMasterKeyBase64Read = File.ReadAllText("master-key.txt");
     var localMasterKeyBytes = Convert.FromBase64String(localMasterKeyBase64Read);
     var localOptions = new Dictionary<string, object>
     {
         {"key", localMasterKeyBytes}
     };
     kmsProviders.Add(provider, localOptions);
     ```

   * 创建您的数据加密密钥

     使用 MongoDB 连接字符串和 Key Vault 集合命名空间构建客户端，并创建数据加密密钥：

     > 笔记:
     >
     > **Key Vault 集合命名空间权限**
     >
     > Key Vault 集合位于`encryption.__keyVault` 命名空间中。确保您的应用程序用于连接到 MongoDB 的数据库用户 对此命名空间具有[读写权限。](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-manual-reference-role-read-write)

     ```
     var clientEncryptionOptions = new ClientEncryptionOptions(
         keyVaultClient,
         keyVaultNamespace,
         kmsProviders: kmsProviders
         );
     var clientEncryption = new ClientEncryption(clientEncryptionOptions);
     var dataKeyOptions1 = new DataKeyOptions(alternateKeyNames: new List<string> { "dataKey1" });
     var dataKeyOptions2 = new DataKeyOptions(alternateKeyNames: new List<string> { "dataKey2" });
     
     
     BsonBinaryData CreateKeyGetID(DataKeyOptions options)
     {
         var dateKeyGuid = clientEncryption.CreateDataKey(provider, options, CancellationToken.None);
         return new BsonBinaryData(dateKeyGuid, GuidRepresentation.Standard);
     }
     
     var dataKeyId1 = CreateKeyGetID(dataKeyOptions1);
     var dataKeyId2 = CreateKeyGetID(dataKeyOptions2);
     var dataKeyId3 = CreateKeyGetID(dataKeyOptions3);
     var dataKeyId4 = CreateKeyGetID(dataKeyOptions4);
     ```

   * 创建您的加密Collection

     使用启用了可查询加密的`MongoClient`实例来指定必须加密哪些字段并创建加密集合：

     ```
     var encryptedCollectionNamespace = CollectionNamespace.FromFullName("medicalRecords.patients");
     var encryptedFieldsMap = new Dictionary<string, BsonDocument>
     {
         {
             encryptedCollectionNamespace.FullName, new BsonDocument
             {
                 {
                     "fields", new BsonArray
                     {
                         new BsonDocument
                         {
                             {"keyId", dataKeyId1},
                             {"path", new BsonString("patientId")},
                             {"bsonType", new BsonString("int")},
                             {
                                 "queries", new BsonDocument
                                 {
                                     {"queryType", new BsonString("equality")}
                                 }
                             }
                         },
                         new BsonDocument
                         {
                             {"keyId", dataKeyId2},
                             {"path", new BsonString("medications")},
                             {"bsonType", new BsonString("array")},
                         },
                     }
                 }
             }
         }
     };
     
     var extraOptions = new Dictionary<string, object>()
     {
        { "cryptSharedLibPath", "<path to crypt_shared library>" },
     };
     
     var autoEncryptionOptions = new AutoEncryptionOptions(
         keyVaultNamespace,
         kmsProviders,
         encryptedFieldsMap: encryptedFieldsMap,
         extraOptions: extraOptions);
     
     var clientSettings = MongoClientSettings.FromConnectionString(connectionString);
     clientSettings.AutoEncryptionOptions = autoEncryptionOptions;
     var secureClient = new MongoClient(clientSettings);
     var encryptedDatabase = secureClient.GetDatabase(encryptedCollectionNamespace.DatabaseNamespace.DatabaseName);
     // Drop the encrypted collection in case you created this collection
     // in a previous run of this application.
     encryptedDatabase.DropCollection(encryptedCollectionNamespace.CollectionName);
     encryptedDatabase.CreateCollection(encryptedCollectionNamespace.CollectionName);
     Console.WriteLine("Created encrypted collection!");
     ```

   本节中代码的输出应类似于以下内容：

   ```
   Created encrypted collection!
   ```

   > 提示:
   >
   > **请参阅：完整代码**
   >
   > 要查看制作数据加密密钥的完整代码，请参阅 [Queryable Encryption 示例应用程序存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/dotnet/exp/reader/QueryableEncryption/MakeDataKey.cs)

4. 配置您的 MongoClient 以进行加密读写

   * 指定 Key Vault 集合命名空间

     指定`encryption.__keyVault`为 Key Vault 集合命名空间。

     ```
     var connectionString = "<Your MongoDB URI>";
     var keyVaultNamespace = CollectionNamespace.FromFullName("encryption.__keyVault");
     var coll = "patients";
     var db = "medicalRecords";
     ```

   * 指定客户主密钥

     指定 KMS 提供商并指定您的内联客户主密钥：

     ```
     var kmsProviders = new Dictionary<string, IReadOnlyDictionary<string, object>>();
     const string provider = "local";
     const string localMasterKeyPath = "master-key.txt";
     var localMasterKeyBase64Read = File.ReadAllText(localMasterKeyPath);
     var localMasterKeyBytes = Convert.FromBase64String(localMasterKeyBase64Read);
     var localOptions = new Dictionary<string, object>
     {
         {"key", localMasterKeyBytes}
     };
     kmsProviders.Add(provider, localOptions);
     ```

   * 检索数据加密密钥

     检索在中创建的数据加密密钥 [创建数据加密密钥](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/explicit-encryption/#std-label-qe-manual-encryption-tutorial-data-key-create) 本指南的步骤：

     ```
     var regularClient = new MongoClient(connectionString);
     var keyVaultCollection = regularClient.GetDatabase(keyVaultNamespace.DatabaseNamespace.DatabaseName)
         .GetCollection<BsonDocument>(keyVaultNamespace.CollectionName);
     
     Guid GetKeyId(string altName)
     {
         var filter = Builders<BsonDocument>.Filter.Eq<BsonString>("keyAltNames", altName);
         return keyVaultCollection.Find(filter).First<BsonDocument>()["_id"].AsGuid;
     }
     
     var dataKeyId1 = GetKeyId("dataKey1");
     var dataKeyId2 = GetKeyId("dataKey2");
     ```

   * 指定自动加密共享库路径

     ```
     var extraOptions = new Dictionary<string, object>()
     {
         {"cryptSharedLibPath", "<path to crypt_shared library>"},
     };
     ```

     > 提示:
     >
     > **了解更多**
     >
     > 要了解有关此路径引用的库的更多信息，请参阅[用于可查询加密的自动加密共享库](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/shared-library/#std-label-qe-reference-shared-library)页面。

   * 创建一个 MongoClient 对象

     `MongoClient`使用以下自动加密设置实例化对象：

     ```
     var clientSettings = MongoClientSettings.FromConnectionString(connectionString);
     var autoEncryptionOptions = new AutoEncryptionOptions(
         keyVaultNamespace,
         kmsProviders,
         bypassQueryAnalysis: true,
         extraOptions: extraOptions);
     clientSettings.AutoEncryptionOptions = autoEncryptionOptions;
     var secureClient = new MongoClient(clientSettings);
     var collection = secureClient.GetDatabase(db).GetCollection<BsonDocument>(coll);
     ```

     > 笔记:
     >
     > **自动解密**
     >
     > 我们使用一个`MongoClient`启用了自动加密的实例来执行自动解密。
     >
     > 要了解有关使用自动解密的显式加密的更多信息，请参阅[基础](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/#std-label-qe-fundamentals)部分。

   * 创建一个 ClientEncryption 对象

     实例化一个`ClientEncryption`对象如下：

     ```
     var clientEncryptionOptions = new ClientEncryptionOptions(
         keyVaultClient: regularClient,
         keyVaultNamespace: keyVaultNamespace,
         kmsProviders: kmsProviders
         );
     var clientEncryption = new ClientEncryption(clientEncryptionOptions);
     ```

5. 插入带有加密字段的文档

   使用以下代码片段，使用启用了可查询加密的 `MongoClient`实例将加密文档插入 命名空间：`medicalRecords.patients`

   ```
   var patientId = 12345678;
   var medications = new BsonArray
           {
               new BsonString("Atorvastatin"),
               new BsonString("Levothyroxine")
           };
   var indexedEncrypted = clientEncryption.Encrypt(
       patientId,
       new EncryptOptions(algorithm: "Indexed", keyId: dataKeyId1, contentionFactor: 1),
       CancellationToken.None);
   var unindexedEncrypted = clientEncryption.Encrypt(
       medications,
       new EncryptOptions(algorithm: "Unindexed", keyId: dataKeyId2),
       CancellationToken.None);
   collection.InsertOne(new BsonDocument { { "firstName", "Jon" }, { "patientId", indexedEncrypted }, { "medications", unindexedEncrypted } });
   ```

   插入文档时，启用了可查询加密的客户端会加密文档的字段，使其类似于以下内容：

   ```
   {
     "_id": {
       "$oid": "6303e36053cc7ec2e6a630bd"
     },
     "firstName": "Jon",
     "patientId": {
       "$binary": {
         "base64": "BxLJUBmg703civqMz8ASsD4QEYeSneOGiiYHfLE77ELEkp1EC/fXPrKCNRQl2mAFddszqDJ0P3znKrq0DVMEvJoU6wa0Ra+U+JjNVr8NtJE+TpTLCannY5Av6iGfLAaiHbM/E8Ftz1YCQsArQwuNp3wIV/GJPLa2662xsyk0wz7F6IRGC3FlnxpN4UIFaHE1M7Y6kEnx3tEy5uJBvU4Sex7I2H0kqHthClH77Q6xHIHc8H9d6upvgnEbkKBCnmc24A2pSG/xZ7LBsV3j5aOboPISuN/lvg==",
         "subType": "06"
       }
     },
     "medications": {
       "$binary": {
         "base64": "BvOsveapfUxiuQxCMSM2fYIEyRlQaSqR+0NxlMarwurBflvoMz1FrSjSGgCVCpK8X+YrilP6Bac99kkaUmRJfjo4savxcjpOfEnUj5bHciPyfQBYmYF4PMLDtTTzGZpPilb9d5KgpIMBXxHi+dIcog==",
         "subType": "06"
       }
     },
     "__safeContent__": [
       {
         "$binary": {
           "base64": "ZLPIpgxzXpHUGrvdIHetwmMagR+mqvuUj5nzXNGf/WM=",
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
   > 要查看完整代码以插入使用显式加密加密的文档，请参阅 [Queryable Encryption 示例应用程序存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/dotnet/exp/reader/QueryableEncryption/InsertEncryptedDocument.cs)

6. 检索您的加密文档

   检索您插入的加密文档 [插入带有加密字段的文档](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/explicit-encryption/#std-label-qe-tutorials-manual-enc-insert) 本指南通过对加密字段进行查询的步骤：

   ```
   var findPayload = clientEncryption.Encrypt(
       patientId,
       new EncryptOptions(algorithm: "Indexed", keyId: dataKeyId1, queryType: "equality", contentionFactor: 1),
       CancellationToken.None);
   var doc = collection.Find(new BsonDocument { { "patientId", findPayload } }).Single();
   Console.WriteLine($"Encrypted document: {doc}");
   ```

   上述代码片段的输出应包含以下文档：

   ```
   {
     "__safeContent__": [
       {
         "Subtype": 0,
         "Data": "LfaIuWm9o30MIGrK7GGUoStJMSNOjRgbxy5q2TPiDes="
       }
     ],
     "_id": "6303a770857952ca5e363fd2",
     "firstName": "Jon",
     "medications": ["Atorvastatin", "Levothyroxine"],
     "patientId": 12345678
   }
   ```

   > 提示:
   >
   > **请参阅：完整代码**
   >
   > 要查看用于检索加密文档的代码，请参阅 [Queryable Encryption 示例应用程序存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/dotnet/exp/reader/QueryableEncryption/InsertEncryptedDocument.cs)

## 了解更多

要查看有关将可查询加密与远程 KMS 结合使用的教程，请参阅[教程。](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/#std-label-qe-tutorial-automatic-encryption)

要了解可查询加密的工作原理，请参阅 [显式加密。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/manual-encryption/#std-label-qe-fundamentals-manual-encryption)

要了解有关本指南中提到的主题的更多信息，请参阅以下链接：

- [密钥和密钥保管库](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/keys-key-vaults/#std-label-qe-reference-keys-key-vaults)
- [知识管理系统供应商](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-fundamentals-kms-providers)









译者：韩鹏帅

原文：[Use Explicit Encryption](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/explicit-encryption/)
