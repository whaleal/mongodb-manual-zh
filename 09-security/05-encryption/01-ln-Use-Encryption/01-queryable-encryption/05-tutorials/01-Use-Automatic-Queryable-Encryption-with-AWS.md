# 在 AWS 中使用自动可查询加密

## 概述

本指南向您展示如何使用 Amazon Web Services (AWS) KMS构建启用了可查询加密的应用程序。

完成本指南中的步骤后，您应该：

- 托管在 AWS KMS 实例上的客户主密钥。
- 使用您的客户主密钥插入加密文档的工作客户端应用程序。

## 开始之前

要完成并运行本指南中的代码，您需要设置您的开发环境，如[安装要求](https://www.mongodb.com/docs/manual/core/queryable-encryption/install/#std-label-qe-install)页面所示。

> 提示:
>
> **请参阅：完整应用程序**
>
> 要查看您在本指南中创建的应用程序的完整代码，请选择与您的编程语言对应的选项卡，然后点击提供的链接：
>
> * mognosh
>   * [Complete Mongosh Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/aws/reader/)
> * Node.js
>   * [Complete Node.js Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/node/aws/reader/)
> * Python
>   * [Complete Python Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/python/aws/reader/)
> * Java
>   * [Complete Java Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/java/aws/reader/)
> * Go
>   * [Complete Go Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/go/aws/reader/)
> * C#
>   * [Complete C# Application](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/dotnet/aws/reader/)

## 设置 KMS

1. 创建客户主密钥

   * 登录您的[AWS 管理控制台](https://aws.amazon.com/console/)

   * 导航到[AWS KMS 控制台](https://aws.amazon.com/kms/)

   * 创建您的客户主密钥

     按照官方 AWS 文档创建一个新的对称密钥 [创建对称 KMS 密钥](https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html#create-symmetric-cmk). 您创建的密钥是您的客户主密钥。选择有助于您识别它的名称和描述；这些字段不会影响您的CMK的功能或配置。

     在密钥生成过程的**使用权限**步骤中，应用以下默认密钥策略，启用身份和访问管理 ( IAM ) 策略以授予对您的客户主密钥的访问权限：

     ```shell
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
     > 要了解有关您的客户主密钥的更多信息，请参阅 [密钥和密钥保管库。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/keys-key-vaults/#std-label-qe-reference-keys-key-vaults)
     >
     > 要了解有关关键政策的更多信息，请参阅 [AWS KMS 中的关键策略](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html) 在 AWS 官方文档中。

2. 创建 AWS IAM 用户

   * 导航到[AWS IAM 控制台](https://aws.amazon.com/iam/)

   * 创建 IAM 用户

     按照官方 AWS 文档在 AWS 管理控制台中 创建一个新的编程IAM用户[添加用户](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html). 您将使用此IAM用户作为支持可查询加密的应用程序的服务帐户。您的应用程序使用IAM 用户通过 AWS KMS 进行身份验证，以使用您的客户主密钥 (CMK) 加密和解密您的数据加密密钥 (DEK)。

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

3. 授予权限

   授予您的IAM用户`kms:Encrypt`和`kms:Decrypt`远程主密钥的权限。

   > 重要的:
   >
   > 新的客户端IAM用户*不应*具有主密钥的管理权限。为了确保您的数据安全，请遵循 [最小特权原则。](https://en.wikipedia.org/w/index.php?title=Principle_of_least_privilege&oldid=1080333157)

   以下内联策略允许IAM用户以尽可能低的权限使用客户主密钥进行加密和解密：

   > 笔记:
   >
   > **远程主密钥 ARN**
   >
   > 以下策略需要您在 [创建主密钥](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/aws/aws-automatic/#std-label-qe-aws-create-master-key)本指南的步骤。

   ```shell
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
   > 将启用了可查询加密的应用程序部署到生产环境时，通过IAM角色而不是IAM用户对您的应用程序进行身份验证。
   >
   > 要使用IAM角色进行身份验证，请在您的 KMS 提供程序对象中指定您的临时 IAM角色凭证，如下所示：
   >
   > ```shell
   > {
   >     "accessKeyId":"<temporary access key ID>",
   >     "secretAccessKey":"<temporary secret access key>",
   >     "sessionToken":"<temporary session token>"
   > }
   > ```
   >
   > 您可以通过以下机制获取您的临时IAM角色凭证：
   >
   > * [调用 AssumeRole](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html)
   > * [从 EC2 实例元数据中检索凭证](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html#instance-metadata-security-credentials)
   >
   > `MongoClient`您的应用程序必须包含逻辑以获取新的临时凭证并在每组临时凭证过期时重新创建启用了可查询加密的实例。
   >
   > 要了解有关IAM角色的更多信息，请参阅官方 AWS 文档中的以下页面：
   >
   > * [IAM 角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
   > * [何时创建 IAM 角色（而不是用户）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id.html#id_which-to-choose_role)
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

   ###  在 Key Vault 集合上创建唯一索引[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/aws/aws-automatic/#create-a-unique-index-on-your-key-vault-collection)

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

2. 创建您的数据加密密钥和加密集合

   * 添加您的 AWS KMS 凭证

     将服务帐户凭据添加到启用了可查询加密的客户端代码中。

     选择与您首选的 MongoDB 驱动程序对应的选项卡：

     > 提示:
     >
     > 您创建并记录了您的访问密钥 ID 和秘密访问密钥[创建 IAM 用户](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/aws/aws-automatic/#std-label-qe-tutorial-aws-create-iam-user) 本指南的步骤。

     ```shell
     const provider = "aws";
     const kmsProviders = {
       aws: {
         accessKeyId: "<Your AWS Access Key ID>",
         secretAccessKey: "<Your AWS Secret Access Key>",
       },
     };
     ```

     > 提示:
     >
     > **了解更多**
     >
     > 要了解有关 AWS 的 KMS 提供程序对象的更多信息，请参阅 [Amazon Web Services KMS 。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-reference-kms-providers-aws)

   * 添加您的关键信息

     更新以下代码以指定您的客户主密钥：

     > 提示:
     >
     > 您在_[创建客户主密钥](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/aws/aws-automatic/#std-label-qe-aws-create-master-key) 本指南的步骤。

     ```shell
     const masterKey = {
       key: "<Your AWS Key ARN>",
       region: "<Your AWS Key Region>",
     };
     ```

   * 创建您的数据加密密钥

     使用 MongoDB 连接字符串和 Key Vault 集合命名空间构建客户端，并创建数据加密密钥：

     > 笔记:
     >
     > **Key Vault 集合命名空间权限**
     >
     > 本指南中的 Key Vault 集合是数据库`__keyVault` 中的集合`encryption`。确保您的应用程序用于连接到 MongoDB 的数据库用户具有[读写](https://www.mongodb.com/docs/manual/reference/built-in-roles/#readWrite) 命名空间的权限`encryption.__keyVault`。
     >
     > ```shell
     > const autoEncryptionOpts = {
     >   keyVaultNamespace: keyVaultNamespace,
     >   kmsProviders: kmsProviders,
     > };
     > 
     > const encClient = Mongo(uri, autoEncryptionOpts);
     > const keyVault = encClient.getKeyVault();
     > 
     > const dek1 = keyVault.createKey(provider, {
     >   masterKey: masterKey,
     >   keyAltNames: ["dataKey1"],
     > });
     > const dek2 = keyVault.createKey(provider, {
     >   masterKey: masterKey,
     >   keyAltNames: ["dataKey2"],
     > });
     > const dek3 = keyVault.createKey(provider, {
     >   masterKey: masterKey,
     >   keyAltNames: ["dataKey3"],
     > });
     > const dek4 = keyVault.createKey(provider, {
     >   masterKey: masterKey,
     >   keyAltNames: ["dataKey4"],
     > });
     > ```

   * 创建您的加密Collection

     使用启用了可查询加密的`MongoClient`实例来指定必须加密哪些字段并创建加密集合：

     ```shell
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

   ```shell
   Created encrypted collection!
   ```

   > 提示:
   >
   > **了解更多**
   >
   > 要查看显示您的客户端应用程序在使用 AWS KMS 时如何创建数据加密密钥的图表，请参阅 [架构。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-reference-kms-providers-aws-architecture)
   >
   > 要了解有关创建使用 AWS KMS 中托管的客户主密钥加密的数据加密密钥的选项的更多信息，请参阅 [dataKeyOpts 对象。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-kms-datakeyopts-aws)

   > 提示:
   >
   > **请参阅：完整代码**
   >
   > 要查看制作数据加密密钥的完整代码，请参阅 [Queryable Encryption 示例应用程序存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/aws/reader/make_data_key.js)

3. 配置您的 MongoClient 以进行加密读写

   * 指定 Key Vault 集合命名空间

     指定`encryption.__keyVault`为 Key Vault 集合命名空间。

     ```shell
     const keyVaultDB = "encryption";
     const keyVaultColl = "__keyVault";
     const keyVaultNamespace = `${keyVaultDB}.${keyVaultColl}`;
     const secretDB = "medicalRecords";
     const secretCollection = "patients";
     ```

   * 指定您的 AWS 凭证

     指定`aws`KMS 提供商和您的IAM用户凭证：

     > 提示:
     >
     > 您创建并记录了您的访问密钥 ID 和秘密访问密钥[创建 IAM 用户](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/aws/aws-automatic/#std-label-qe-tutorial-aws-create-iam-user) 本指南的步骤。

     ```shell
     const kmsProviders = {
       aws: {
         accessKeyId: "<Your AWS Access Key ID>",
         secretAccessKey: "<Your AWS Secret Access Key>",
       },
     };
     ```

   * 为您的Collection创建加密字段映射

     ```shell
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

     ```shell
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

     ```shell
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

   ```shell
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
   > 要查看插入加密文档的完整代码，请参见 [Queryable Encryption 示例应用程序存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/aws/reader/insert_encrypted_document.js)

5. 检索您的加密文档

   检索您插入的加密文档 [插入带有加密字段的文档](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/aws/aws-automatic/#std-label-qe-aws-insert) 本指南的步骤。

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

   ```shell
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
   > 要查看查找加密文档的完整代码，请参见 [Queryable Encryption 示例应用程序存储库。](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption/mongosh/aws/reader/insert_encrypted_document.js)

## 了解更多

要了解可查询加密的工作原理，请参阅 [基础知识。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/#std-label-qe-fundamentals)

要了解有关本指南中提到的主题的更多信息，请参阅以下链接：

- [在参考](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/#std-label-qe-reference)页面上了解有关可查询加密组件的更多信息。
- [在密钥和密钥保管库](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/keys-key-vaults/#std-label-qe-reference-keys-key-vaults)页面上了解客户主密钥和数据加密密钥的工作原理。
- [在KMS 提供商](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-fundamentals-kms-providers)页面上查看 KMS 提供商如何管理您的可查询加密密钥。









译者：韩鹏帅

原文：[Use Automatic Queryable Encryption with AWS](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/aws/aws-automatic/)