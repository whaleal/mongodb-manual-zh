# CSFLE 特定的 MongoClient 选项

## 概述

查看有关实例的客户端字段级加密 (CSFLE) 特定配置选项的信息`MongoClient`。

## 自动加密选项

将一个`autoEncryptionOpts`对象传递给您的`MongoClient` 实例以指定特定于 CSFLE 的选项。

下表描述了对象的结构 `autoEncryptionOpts`：

| 范围                   | 类型          | 必需的 | 描述                                                         |
| :--------------------- | :------------ | :----- | :----------------------------------------------------------- |
| `keyVaultClient`       | `MongoClient` | 不     | `MongoClient`配置为连接到托管 Key Vault 集合的 MongoDB 实例的实例。如果省略该选项，则指定给包含配置的实例的 `keyVaultClient`MongoDB 实例将用作 Key Vault 集合的主机。`MongoClient``autoEncryptionOpts`要了解有关 Key Vault 集合的更多信息，请参阅[Key Vault 集合。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-key-vault) |
| `keyVaultNamespace`    | String        | 是的   | Key Vault 集合的完整[命名空间。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-namespace) |
| `kmsProviders`         | Object        | 是的   | 客户端字段级加密使用的密钥管理系统 (KMS) 来管理您的客户主密钥 (CMK)。要了解有关`kmsProviders`对象的更多信息，请参阅 [CSFLE KMS 提供程序。](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers)要了解有关客户主密钥的更多信息，请参阅[密钥和密钥保管库。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults) |
| `tlsOptions`           | Object        | 不     | 将密钥管理系统提供程序名称映射到 TLS 配置选项的对象。要了解有关 TLS 选项的更多信息，请参阅：[TLS 选项。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-label-tls-mongod-options)要了解有关 TLS 的更多信息，请参阅：[TLS/SSL（传输加密）。](https://www.mongodb.com/docs/manual/core/security-transport-encryption/#std-label-transport-encryption) |
| `schemaMap`            | Object        | 不     | 加密模式。要了解如何构建加密模式，请参阅 [加密模式。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/create-schema/#std-label-csfle-fundamentals-create-schema)有关加密模式的完整文档，请参阅[CSFLE 加密模式。](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#std-label-csfle-reference-encryption-schemas) |
| `bypassAutoEncryption` | Boolean       | 不     | 指定`true`绕过自动客户端字段级加密规则并执行显式加密。`bypassAutoEncryption`不禁用自动解密。要了解有关此选项的更多信息，请参阅 [自动解密。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manual-encryption/#std-label-csfle-fundamentals-manual-encryption-automatic-decryption) |

## 例子

要查看演示如何使用 `autoEncryptionOpts`配置 `MongoClient`实例的代码片段，请选择与您的驱动程序对应的选项卡：

```
var autoEncryptionOpts =
{
   "keyVaultNamespace" : "<database>.<collection>",
   "kmsProviders" : { ... },
   "schemaMap" : { ... }
}

cluster = Mongo(
  "<Your Connection String>",
  autoEncryptionOpts
);

```

> 提示:
>
> **环境变量**
>
> 如果可能，考虑将提供的凭据定义为 `kmsProviders`环境变量，然后将它们传递给[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)使用[`--eval`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--eval)选项。这最大限度地减少了凭据泄漏到日志中的机会。







译者：韩鹏帅

原文：[CSFLE-Specific MongoClient Options](https://www.mongodb.com/docs/manual/core/csfle/reference/csfle-options-clients/)