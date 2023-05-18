# 显式加密

> 注意:
>
> Queryable Encryption 处于公共预览阶段，可用于评估目的。不建议将公共预览版用于生产部署，因为可能会引入重大更改。要了解有关预览版的更多信息，请参阅[可查询加密预览](https://www.mongodb.com/blog/post/mongodb-releases-queryable-encryption-preview/)博客文章。

## 概述

了解如何使用可查询加密的**显式加密**机制

显式加密是一种机制，您可以在其中指定在对数据库执行的每个操作中如何加密和解密文档中的字段。

使用 6.0 或更高版本的以下 MongoDB 产品中提供显式加密：

- MongoDB 社区服务器
- MongoDB 企业高级版
- MongoDB Atlas

## 使用显式加密

以下部分概述了在支持可查询加密的应用程序中使用显式加密的方法：

- [创建`ClientEncryption`实例](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/manual-encryption/#std-label-qe-fundamentals-manual-encryption-client-enc)
- [加密读写操作中的字段](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/manual-encryption/#std-label-qe-fundamentals-manual-encryption-update-operations)
- [自动解密](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/manual-encryption/#std-label-qe-fundamentals-manual-encryption-automatic-decryption)

### 创建`ClientEncryption`实例

`ClientEncryption`是跨驱动程序使用的抽象，并且 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)封装显式加密中涉及的Key Vault 集合和KMS操作。

要创建`ClientEncryption`实例，请指定：

* 配置`kmsProviders`为可以访问 托管客户主密钥的KMS 的对象
* Key Vault 集合的命名空间
* 如果您使用 MongoDB Community Server，请将`bypassQueryAnalysis` 选项设置为`True`
* `MongoClient`有权访问您的 Key Vault 集合的实例

有关更多`ClientEncryption`选项，请参阅[可查询加密的 MongoClient 选项。](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/qe-options-clients/#std-label-qe-reference-mongo-client)

> 笔记:
>
> 代码示例目前不可用，但即将推出。

### 加密读写操作中的字段

您必须更新整个应用程序的读取和写入操作，以便您的应用程序在执行读取和写入操作之前加密字段。

要加密字段，请使用实例`encrypt`的方法`ClientEncryption` 。指定以下内容：

* 要加密的值
* 使用的算法，`Indexed`或者`Unindexed`
* 数据加密密钥的 ID
* 竞争因素（如果您正在使用该`Indexed`算法）
* 如果执行读取操作，请设置为您的字段定义的查询类型（如果您正在使用该`Indexed`算法）

> 笔记:
>
> **查询类型**
>
> 查询类型仅适用于读取操作。
>
> 要了解有关查询类型的更多信息，请参阅[查询类型。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/encrypt-and-query/#std-label-qe-query-types)

#### 算法选择

如果您在字段上`Indexed`指定 a，则使用该算法。`queryType`

`Indexed`支持相等查询。`Indexed`字段需要服务器上的索引。索引是通过 `encryptedFields`在 中指定选项来创建的[`db.createCollection()`。](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection)

### 自动解密

要自动解密您的字段，您必须 `MongoClient`按如下方式配置您的实例：

- 指定`kmsProviders`对象
- 指定您的 Key Vault 集合
- 如果您使用 MongoDB Community Server，请将`bypassQueryAnalysis` 选项设置为`True`

> 笔记:
>
> **自动解密在 MongoDB 社区服务器中可用**
>
> 尽管自动加密需要 MongoDB Enterprise 或 MongoDB Atlas，但使用 6.0 或更高版本的以下 MongoDB 产品中可以使用自动解密：
>
> - MongoDB 社区服务器
> - MongoDB 企业高级版
> - MongoDB Atlas

## 服务器端字段级加密实施

[指定加密字段](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/encrypt-and-query/#std-label-qe-specify-fields-for-encryption)以强制加密集合中的特定字段。

`Indexed`字段需要服务器上的索引。索引是通过`encryptedFields`在 中指定选项 来创建的[`db.createCollection()`。](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection)

在配置为强制加密某些字段的 MongoDB 实例上使用显式加密机制执行可查询加密的客户端必须按照 MongoDB 实例上指定的方式加密这些字段。

要了解如何设置服务器端可查询加密实施，请参阅[字段加密和可查询性。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/encrypt-and-query/#std-label-qe-fundamentals-encrypt-query)

## 了解更多

要了解有关 Key Vault 集合、数据加密密钥和客户主密钥的更多信息，请参阅[密钥和 Key Vault 。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)

要了解有关KMS提供程序和对象的更多信息`kmsProviders`，请参阅[CSFLE KMS 提供程序。](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers)









译者：韩鹏帅

原文：[Explicit Encryption](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/manual-encryption/)
