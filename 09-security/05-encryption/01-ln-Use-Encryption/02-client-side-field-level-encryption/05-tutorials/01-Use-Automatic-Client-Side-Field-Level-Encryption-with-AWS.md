## 将自动客户端字段级加密与 AWS 结合使用

## 概述

本指南向您展示如何使用 Amazon Web Services (AWS) KMS构建支持客户端字段级加密 (CSFLE) 的应用程序。

完成本指南中的步骤后，您应该：

- 托管在 AWS KMS 实例上的客户主密钥。
- 使用您的客户主密钥插入加密文档的工作客户端应用程序。

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
> [完整的 C# 应用程序](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/aws/reader/CSFLE/)

## 设置 KMS

```
// You are viewing the C# driver code examples.
// Use the dropdown menu to select a different driver.
```

1. 创建客户主密钥

   * 登录您的[AWS 管理控制台](https://aws.amazon.com/console/)

   * 导航到[AWS KMS 控制台](https://aws.amazon.com/kms/)

   * 创建您的客户主密钥

     按照官方 AWS 文档创建一个新的对称密钥 [创建对称 KMS 密钥](https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html#create-symmetric-cmk). 您创建的密钥是您的客户主密钥。选择有助于您识别它的名称和描述；这些字段不会影响您的CMK的功能或配置。

     在密钥生成过程的**使用权限**步骤中，应用以下默认密钥策略，启用身份和访问管理 ( IAM ) 策略以授予对您的客户主密钥的访问权限：

     ```
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Sid": "Enable IAM User Permissions",
           "Effect": "Allow",
           "Principal": {
             "AWS": "<ARN of your AWS account principal>"
           },
           "Action": "kms:*",
           "Resource": "*"
         }
       ]
     }
     
     ```

     > 重要的:
     >
     > 记录您的客户主密钥的Amazon 资源名称 ( ARN ) 和区域。您将在本指南的后续步骤中使用这些。

     > 提示:
     >
     > **了解更多**
     >
     > 要了解有关您的客户主密钥的更多信息，请参阅 [密钥和密钥保管库。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)
     >
     > 要了解有关关键政策的更多信息，请参阅 [AWS KMS 中的关键策略](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html) 在 AWS 官方文档中。

2. 创建 AWS IAM 用户

   * 导航到[AWS IAM 控制台](https://aws.amazon.com/iam/)

   * 创建 IAM 用户

     按照官方 AWS 文档在 AWS 管理控制台中 创建一个新的编程IAM用户[添加用户](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html). 您将使用此IAM用户作为支持 CSFLE 的应用程序的服务帐户。您的应用程序使用IAM 用户通过 AWS KMS 进行身份验证，以使用您的客户主密钥 (CMK) 加密和解密您的数据加密密钥 (DEK)。

     > 重要的:
     >
     > **记录您的凭证**
     >
     > 确保在创建IAM用户的最后一步中记录以下IAM凭证：
     >
     > - **访问密钥 ID**
     > - **秘密访问密钥**
     >
     > 您只有一次机会记录这些凭据。如果您在此步骤中不记录这些凭证，则必须创建另一个IAM用户。

   * 授予权限

     授予您的IAM用户`kms:Encrypt`和`kms:Decrypt`远程主密钥的权限。

     > 重要的:
     >
     > 新的客户端IAM用户*不应*具有主密钥的管理权限。为了确保您的数据安全，请遵循 [最小特权原则。](https://en.wikipedia.org/w/index.php?title=Principle_of_least_privilege&oldid=1080333157)

     以下内联策略允许IAM用户以尽可能低的权限使用客户主密钥进行加密和解密：

     > 笔记:
     >
     > **远程主密钥 ARN**
     >
     > 以下策略需要您在 [创建主密钥](https://www.mongodb.com/docs/manual/core/csfle/tutorials/aws/aws-automatic/#std-label-aws-create-master-key)本指南的步骤。

     ```
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": ["kms:Decrypt", "kms:Encrypt"],
           "Resource": "<the Amazon Resource Name (ARN) of your remote master key>"
         }
       ]
     }
     
     ```

     要将上述策略应用于您的IAM用户，请遵循 [添加 IAM 身份权限](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html#add-policies-console) AWS 文档中的指南。

     > 重要的:
     >
     > **在生产中使用 IAM 角色进行身份验证**
     >
     > 将支持 CSFLE 的应用程序部署到生产环境时，通过IAM角色而不是IAM用户对您的应用程序进行身份验证。
     >
     > 要使用IAM角色进行身份验证，请在您的 KMS 提供程序对象中指定您的临时 IAM角色凭证，如下所示:
     >
     > ```
     > {
     >     "accessKeyId":"<temporary access key ID>",
     >     "secretAccessKey":"<temporary secret access key>",
     >     "sessionToken":"<temporary session token>"
     > }
     > ```
     >
     > 您可以通过以下机制获取您的临时IAM角色凭证：
     >
     > - [调用 AssumeRole](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html)
     > - [从 EC2 实例元数据中检索凭证](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html#instance-metadata-security-credentials)
     >
     > `MongoClient`您的应用程序必须包含逻辑以获取新的临时凭证并在每组临时凭证过期时重新创建启用 CSFLE 的实例。
     >
     > 要了解有关IAM角色的更多信息，请参阅官方 AWS 文档中的以下页面：
     >
     > - [IAM 角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
     > - [何时创建 IAM 角色（而不是用户）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id.html#id_which-to-choose_role)
     >
     > `AssumeRole` 要了解如何获取临时凭证并担任本指南支持的每种语言的角色，请参阅AWS 文档中的以下可运行示例：
     >
     > * [Java](https://docs.aws.amazon.com/code-samples/latest/catalog/javav2-sts-src-main-java-com-example-sts-AssumeRole.java.html)
     > * [NodeJS](https://docs.aws.amazon.com/code-samples/latest/catalog/javascriptv3-sts-src-sts_assumerole.js.html)
     > * [Python](https://docs.aws.amazon.com/code-samples/latest/catalog/python-sts-sts_temporary_credentials-assume_role_mfa.py.html) (示例使用多因素身份验证)
     > * [C#](https://docs.aws.amazon.com/code-samples/latest/catalog/dotnetv3-STS-AssumeRole-AssumeRoleExample-AssumeRole.cs.html)
     > * [Go](https://docs.aws.amazon.com/code-samples/latest/catalog/go-sts-TakeRole-TakeRole.go.html)

## 创建应用程序

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

2. 创建新的数据加密密钥

   * 添加您的 AWS KMS 凭证

     将服务帐户凭据添加到支持 CSFLE 的客户端代码。

     > 提示:
     >
     > 您创建并记录了您的访问密钥 ID 和秘密访问密钥[创建 IAM 用户](https://www.mongodb.com/docs/manual/core/csfle/tutorials/aws/aws-automatic/#std-label-csfle-tutorial-aws-create-iam-user) 本指南的步骤。
     >
     > ```
     > var kmsProviders = new Dictionary<string, IReadOnlyDictionary<string, object>>();
     > var provider = "aws";
     > var awsKmsOptions = new Dictionary<string, object>
     > {
     >    { "accessKeyId", "<Your AWS Access Key ID>" },
     >    { "secretAccessKey", "<Your AWS Secret Access Key>" }
     > };
     > kmsProviders.Add(provider, awsKmsOptions);
     > ```
     >
     > > 提示:
     > >
     > > **了解更多**
     > >
     > > 要了解有关 AWS 的 KMS 提供程序对象的更多信息，请参阅 [Amazon Web Services KMS 。](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers-aws)

   * 添加您的关键信息

     更新以下代码以指定您的客户主密钥：

     > 提示:
     >
     > 您在_[创建客户主密钥](https://www.mongodb.com/docs/manual/core/csfle/tutorials/aws/aws-automatic/#std-label-aws-create-master-key) 本指南的步骤。
     >
     > ```
     > var dataKeyOptions = new DataKeyOptions(
     >    masterKey: new BsonDocument
     >    {
     >        { "region", "<Your AWS Key Region>" },
     >        { "key", "<Your AWS Key ARN>" },
     >    });
     > ```

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
   > 要查看显示您的客户端应用程序在使用 AWS KMS 时如何创建数据加密密钥的图表，请参阅 [架构。](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers-aws-architecture)
   >
   > 要了解有关创建使用 AWS KMS 中托管的客户主密钥加密的数据加密密钥的选项的更多信息，请参阅 [dataKeyOpts 对象。](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-kms-datakeyopts-aws)

   > 提示:
   >
   > **请参阅：完整代码**
   >
   > 要查看制作数据加密密钥的完整代码，请参阅 [我们的 Github 存储库](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/aws/reader/CSFLE/MakeDataKey.cs)

3. 配置 MongoClient

   * 指定 Key Vault 集合命名空间

     指定`encryption.__keyVault`为 Key Vault 集合命名空间

     ```
     var keyVaultNamespace = CollectionNamespace.FromFullName("encryption.__keyVault");
     ```

   * 指定您的 AWS 凭证

     指定`aws`KMS 提供商和您的IAM用户凭证：

     > 提示:
     >
     > 您创建并记录了您的访问密钥 ID 和秘密访问密钥[创建 IAM 用户](https://www.mongodb.com/docs/manual/core/csfle/tutorials/aws/aws-automatic/#std-label-csfle-tutorial-aws-create-iam-user) 本指南的步骤。

     ```
     var kmsProviders = new Dictionary<string, IReadOnlyDictionary<string, object>>();
     var provider = "aws";
     var awsKmsOptions = new Dictionary<string, object>
     {
        { "accessKeyId", "<Your AWS Access Key ID>" },
        { "secretAccessKey", "<Your AWS Secret Access Key>" }
     };
     kmsProviders.Add(provider, awsKmsOptions);
     ```

   * 为您的收藏创建加密模式

     > 提示:
     >
     > **添加您的数据加密密钥 Base64 ID**
     >
     > 确保更新以下代码以包含您的 Base64 DEK ID。您在 [生成您的数据加密密钥](https://www.mongodb.com/docs/manual/core/csfle/tutorials/aws/aws-automatic/#std-label-csfle-aws-create-dek)本指南的步骤。

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
   > 要查看插入加密文档的完整代码，请参见 [我们的 Github 存储库](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/aws/reader/CSFLE/InsertEncryptedDocument.cs)

5. 检索您的加密文档

   检索您插入的加密文档 [插入带有加密字段的文档](https://www.mongodb.com/docs/manual/core/csfle/tutorials/aws/aws-automatic/#std-label-csfle-aws-insert) 本指南的步骤。

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
   > 要查看查找加密文档的完整代码，请参见 [我们的 Github 存储库](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/csfle/dotnet/aws/reader/CSFLE/InsertEncryptedDocument.cs)

## 了解更多

要了解 CSFLE 的工作原理，请参阅 [基础知识。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/#std-label-csfle-fundamentals)

要了解有关本指南中提到的主题的更多信息，请参阅以下链接：

- [在参考](https://www.mongodb.com/docs/manual/core/csfle/reference/#std-label-csfle-reference)页面上了解有关 CSFLE 组件的更多信息。
- [在密钥和密钥保管库](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)页面上了解客户主密钥和数据加密密钥的工作原理
- [在CSFLE KMS 提供商](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers)页面上查看 KMS 提供商如何管理您的 CSFLE 密钥。







译者：韩鹏帅

原文：[Use Automatic Client-Side Field Level Encryption with AWS](https://www.mongodb.com/docs/manual/core/csfle/tutorials/aws/aws-automatic/)
