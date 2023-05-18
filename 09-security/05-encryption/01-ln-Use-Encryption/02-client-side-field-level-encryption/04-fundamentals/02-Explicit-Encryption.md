# 显式加密

## 概述

了解如何使用客户端字段级加密 (CSFLE) 的**显式加密机制。**

显式加密是一种机制，您可以在其中指定在对数据库执行的每个操作中如何加密和解密文档中的字段。

显式加密在以下 4.2 版或更高版本的 MongoDB 产品中可用：

- MongoDB 社区服务器
- MongoDB 企业高级版
- MongoDB Atlas

## 使用显式加密

要使用显式加密，您必须在支持 CSFLE 的应用程序中执行以下操作：

- [创建一个 ClientEncryption 实例](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manual-encryption/#std-label-csfle-fundamentals-manual-encryption-client-enc)
- [加密读写操作中的字段](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manual-encryption/#std-label-csfle-fundamentals-manual-encryption-update-operations)
- [手动](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manual-encryption/#std-label-csfle-fundamentals-manual-encryption-manual-decryption) 或者 [自动地](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manual-encryption/#std-label-csfle-fundamentals-manual-encryption-automatic-decryption) 解密文档中的字段

### 创建一个 ClientEncryption 实例

要使用显式加密，您必须创建一个`ClientEncryption` 实例。`ClientEncryption`是跨驱动程序使用的抽象，并且 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)封装显式加密中涉及的Key Vault 集合和KMS操作。

要创建`ClientEncryption`实例，您必须指定以下信息：

- `MongoClient`有权访问您的 Key Vault 集合的实例
- Key Vault 集合的命名空间
- 配置`kmsProviders`为可以访问 托管客户主密钥的KMS 的对象

有关更多`ClientEncryption`选项，请参阅[CSFLE 特定的 MongoClient 选项。](https://www.mongodb.com/docs/manual/core/csfle/reference/csfle-options-clients/#std-label-csfle-reference-mongo-client)

要查看显示如何创建`ClientEncryption` 实例的代码片段，请参阅[例子](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manual-encryption/#std-label-csfle-fundamentals-manual-encryption-example) 本指南的一部分。

### 加密读写操作中的字段

您必须更新整个应用程序的读取和写入操作，以便您的应用程序在执行读取和写入操作之前加密字段。

要加密字段，请使用实例`encrypt`的方法`ClientEncryption` 。

要查看显示如何使用该`encrypt`方法的代码片段，请参阅[例子](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manual-encryption/#std-label-csfle-fundamentals-manual-encryption-example) 本指南的一部分。

### 手动解密

使用显式加密时，您可以手动或自动解密加密字段。

要手动解密您的字段，请使用实例`decrypt`的方法 `ClientEncryption`。

要查看显示如何使用该`decrypt`方法的代码片段，请参阅[例子](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manual-encryption/#std-label-csfle-fundamentals-manual-encryption-example) 本指南的一部分。

### 自动解密

要自动解密您的字段，您必须 `MongoClient`按如下方式配置您的实例：

- 指定您的 Key Vault 集合
- 指定`kmsProviders`对象
- 如果您使用 MongoDB Community Server，请将`bypassAutoEncryption` 选项设置为`True`

> 笔记:
>
> **自动解密在 MongoDB 社区服务器中可用**
>
> 虽然自动加密需要 MongoDB Enterprise 或 MongoDB Atlas，但自动解密在以下 4.2 或更高版本的 MongoDB 产品中可用：
>
> * MongoDB 社区服务器
> * MongoDB 企业高级版
> * MongoDB Atlas

要查看演示如何启用自动解密的代码片段，请选择与您的首选语言对应的选项卡：

```
var clientSettings = MongoClientSettings.FromConnectionString(connectionString);
var autoEncryptionOptions = new AutoEncryptionOptions(
    keyVaultNamespace: keyVaultNamespace,
    kmsProviders: kmsProviders,
    bypassAutoEncryption: true);
clientSettings.AutoEncryptionOptions = autoEncryptionOptions;
var client = new MongoClient(clientSettings);

```

## 例子

假设您要将具有以下结构的文档插入到您的 MongoDB 实例中：

```
{
  "name": "<name of person>",
  "age": <age of person>,
  "favorite-foods": ["<array of foods>"]
}

```

1. 创建一个 MongoClient 实例

   在此示例中，您使用同一个`MongoClient`实例来访问您的 Key Vault 集合以及读取和写入加密数据。

   以下代码片段显示了如何创建`MongoClient`实例：

   ```
   var client = new MongoClient(connectionString);
   ```

2. 创建一个 ClientEncryption 实例

   以下代码片段显示了如何创建`ClientEncryption` 实例：

   ```
   var collection = client.GetDatabase(db).GetCollection<BsonDocument>(coll);
   var clientEncryptionOptions = new ClientEncryptionOptions(
       keyVaultClient: client,
       keyVaultNamespace: keyVaultNamespace,
       kmsProviders: kmsProviders);
   var clientEncryption = new ClientEncryption(clientEncryptionOptions);
   ```

3. 加密字段并插入

   您想要使用以下算法加密文档的字段：

   | 字段名称         | 加密演算法    | BSON 字段类型 |
   | :--------------- | :------------ | :------------ |
   | `name`           | Deter         | String        |
   | `age`            | No encryption | Int           |
   | `favorite-foods` | Random        | Array         |

   以下代码片段显示了如何手动加密文档中的字段并将文档插入 MongoDB：

   > 笔记:
   >
   > 以下示例中的变量`dataKeyId`指的是数据加密密钥 (DEK)。要了解如何使用本地密钥提供程序生成 DEK，请参阅[快速入门](https://www.mongodb.com/docs/manual/core/csfle/quick-start/#std-label-csfle-quick-start-create-dek)。要了解如何使用特定的密钥管理系统创建 DEK，请参阅[教程。](https://www.mongodb.com/docs/manual/core/csfle/tutorials/#std-label-csfle-tutorials)

   ```
   var encryptedName = clientEncryption.Encrypt(
       "Greg",
       new EncryptOptions(algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic", keyId: dataKeyId),
       CancellationToken.None);
   var encryptedFoods = clientEncryption.Encrypt(
       new BsonArray { "Cheese", "Grapes" },
       new EncryptOptions(algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random", keyId: dataKeyId),
       CancellationToken.None);
   collection.InsertOne(new BsonDocument { { "name", encryptedName }, { "age", 83 }, { "foods", encryptedFoods } });
   ```

4. 检索文档和解密字段

   以下代码片段显示了如何检索您插入的文档并手动解密加密字段：

   ```
   var nameToQuery = "Greg";
   var encryptedNameToQuery = clientEncryption.Encrypt(
       nameToQuery,
       new EncryptOptions(algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic", keyId: dataKeyId),
       CancellationToken.None);
   var doc = collection.Find(new BsonDocument { { "name", encryptedNameToQuery } }).Single();
   Console.WriteLine($"Encrypted document: {doc}");
   doc["name"] = clientEncryption.Decrypt(doc["name"].AsBsonBinaryData, CancellationToken.None);
   doc["foods"] = clientEncryption.Decrypt(doc["foods"].AsBsonBinaryData, CancellationToken.None);
   Console.WriteLine($"Decrypted field: {doc}");
   ```

## 服务器端字段级加密实施

MongoDB 支持使用[模式验证](https://www.mongodb.com/docs/manual/core/schema-validation/#std-label-schema-validation-overview)来强制加密集合中的特定字段。

在配置为强制加密某些字段的 MongoDB 实例上使用显式加密机制执行客户端字段级加密的客户端必须按照 MongoDB 实例上指定的方式加密这些字段。

要了解如何设置服务器端 CSFLE 实施，请参阅[CSFLE 服务器端架构实施。](https://www.mongodb.com/docs/manual/core/csfle/reference/server-side-schema/#std-label-csfle-reference-server-side-schema)

## 了解更多

要了解有关 Key Vault 集合、数据加密密钥和客户主密钥的更多信息，请参阅[密钥和 Key Vault 。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)

要了解有关KMS提供程序和`kmsProviders`对象的更多信息，请参阅[CSFLE KMS 提供程序。](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers)







译者：韩鹏帅

原文：[Explicit Encryption](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manual-encryption/)
