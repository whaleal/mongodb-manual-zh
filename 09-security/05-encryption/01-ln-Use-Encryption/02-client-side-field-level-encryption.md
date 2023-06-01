# 客户端字段级加密

## 介绍

客户端字段级加密 (CSFLE) 是一项功能，使您能够在通过网络将数据发送到 MongoDB 之前对应用程序中的数据进行加密。启用 CSFLE 后，任何 MongoDB 产品都无法访问未加密形式的数据。

您可以使用以下机制设置 CSFLE：

- 自动加密：使您能够执行加密的读取和写入操作，而无需编写代码来指定如何加密字段。
- 显式加密：使您能够通过 MongoDB 驱动程序的加密库执行加密的读写操作。您必须在整个应用程序中指定使用此库进行加密的逻辑。

下表显示了哪些 MongoDB 服务器产品支持哪些 CSFLE 机制：

| 产品名称           | 支持自动加密 | 支持显式加密 |
| :----------------- | :----------- | :----------- |
| MongoDB Atlas      | 是的         | 是的         |
| MongoDB 企业高级版 | 是的         | 是的         |
| MongoDB 社区版     | 不           | 是的         |

要了解哪些 MongoDB 驱动程序支持 CSFLE，请参阅 [CSFLE 兼容性。](https://www.mongodb.com/docs/manual/core/csfle/reference/compatibility/#std-label-csfle-compatibility-reference)

## 特征

要了解 CSFLE 为您的应用程序带来的安全优势，请参阅[功能](https://www.mongodb.com/docs/manual/core/csfle/features/#std-label-csfle-features)页面。

## 安装

要了解使用 CSFLE 必须安装的内容，请参阅[安装要求](https://www.mongodb.com/docs/manual/core/csfle/install/#std-label-csfle-install)页面。

## 快速开始

要开始使用 CSFLE，请参阅[快速入门。](https://www.mongodb.com/docs/manual/core/csfle/quick-start/#std-label-csfle-quick-start)

在本指南中，代码示例使用占位符文本。在运行示例之前，用您自己的值替换这些占位符。

例如：

```
dek_id := "<Your Base64 DEK ID>"
```

您将用您的DEK ID 替换引号之间的所有内容。

```
dek_id := "abc123"
```

## 基础知识

要了解 CSFLE 的工作原理和设置方法，请参阅 [基础](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/#std-label-csfle-fundamentals)部分。

基础部分包含以下页面：

- [自动加密](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/automatic-encryption/#std-label-csfle-fundamentals-automatic-encryption)
- [显式加密](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manual-encryption/#std-label-csfle-fundamentals-manual-encryption)
- [加密模式](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/create-schema/#std-label-csfle-fundamentals-create-schema)
- [密钥和密钥保管库](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)
- [加密密钥管理](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manage-keys/#std-label-csfle-fundamentals-manage-keys)
- [字段和加密类型](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-csfle-reference-encryption-algorithms)

## 教程

要了解如何使用 CSFLE 执行特定任务，请参阅 [教程](https://www.mongodb.com/docs/manual/core/csfle/tutorials/#std-label-csfle-tutorials)部分。

## 参考

要查看有助于开发支持 CSFLE 的应用程序的信息，请参阅[参考](https://www.mongodb.com/docs/manual/core/csfle/reference/#std-label-csfle-reference)部分。

参考部分包含以下页面：

- [CSFLE 兼容性](https://www.mongodb.com/docs/manual/core/csfle/reference/compatibility/#std-label-csfle-compatibility-reference)
- [CSFLE 限制](https://www.mongodb.com/docs/manual/core/csfle/reference/limitations/#std-label-csfle-reference-encryption-limits)
- [CSFLE 加密模式](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#std-label-csfle-reference-encryption-schemas)
- [CSFLE 服务器端模式实施](https://www.mongodb.com/docs/manual/core/csfle/reference/server-side-schema/#std-label-csfle-reference-server-side-schema)
- [自动加密支持的操作](https://www.mongodb.com/docs/manual/core/csfle/reference/supported-operations/#std-label-csfle-reference-automatic-encryption-supported-operations)
- [CSFLE 特定的 MongoClient 选项](https://www.mongodb.com/docs/manual/core/csfle/reference/csfle-options-clients/#std-label-csfle-reference-mongo-client)
- [CSFLE KMS 提供商](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers)
- [CSFLE 加密组件](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-components/#std-label-csfle-reference-encryption-components)
- [CSFLE 如何解密文档](https://www.mongodb.com/docs/manual/core/csfle/reference/decryption/#std-label-csfle-reference-decryption)
- [CSFLE 密码原语](https://www.mongodb.com/docs/manual/core/csfle/reference/cryptographic-primitives/#std-label-csfle-reference-cryptographic-primitives)
- [为 CSFLE 安装和配置 mongocryptd](https://www.mongodb.com/docs/manual/core/csfle/reference/mongocryptd/#std-label-csfle-reference-mongocryptd)
- [安装 libmongocrypt](https://www.mongodb.com/docs/manual/core/csfle/reference/libmongocrypt/#std-label-csfle-reference-libmongocrypt)









译者：韩鹏帅

原文：[Client-Side Field Level Encryption](https://www.mongodb.com/docs/manual/core/csfle/)