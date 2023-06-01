# 可查询加密的 MongoClient 选项

> 注意:
>
> Queryable Encryption 处于公共预览阶段，可用于评估目的。不建议将公共预览版用于生产部署，因为可能会引入重大更改。要了解有关预览版的更多信息，请参阅[可查询加密预览](https://www.mongodb.com/blog/post/mongodb-releases-queryable-encryption-preview/)博客文章。

## 概述

查看有关实例的可查询加密特定配置选项的信息`MongoClient`。

## 自动加密选项

将`AutoEncryptionOpts`对象传递给您的`MongoClient` 实例以指定可查询加密特定选项。

下表描述了对象的结构 `AutoEncryptionOpts`：

| 范围                  | 类型          | 必需的 | 描述                                                         |
| :-------------------- | :------------ | :----- | :----------------------------------------------------------- |
| `keyVaultClient`      | `MongoClient` | 不     | `MongoClient`配置为连接到托管 Key Vault 集合的 MongoDB 实例的实例。如果省略该选项，则指定给包含配置的实例的 `keyVaultClient`MongoDB 实例将用作 Key Vault 集合的主机。`MongoClient``AutoEncryptionOpts`要了解有关 Key Vault 集合的更多信息，请参阅[Key Vault 集合。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/keys-key-vaults/#std-label-qe-reference-key-vault) |
| `keyVaultNamespace`   | String        | 是的   | Key Vault 集合的完整[命名空间。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-namespace) |
| `kmsProviders`        | Object        | 是的   | Queryable Encryption 使用的密钥管理系统 (KMS) 用于管理您的客户主密钥 (CMK)。要了解有关`kmsProviders`对象的更多信息，请参阅 [KMS 提供程序。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-fundamentals-kms-providers)要了解有关客户主密钥的更多信息，请参阅[密钥和密钥保管库。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/keys-key-vaults/#std-label-qe-reference-keys-key-vaults) |
| `encryptedFieldsMap`  | Object        | 不     | 加密模式。要了解如何构建加密模式，请参阅 [字段加密和可查询性。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/encrypt-and-query/#std-label-qe-fundamentals-encrypt-query) |
| `bypassQueryAnalysis` | Boolean       | 不     | 禁用传出命令的自动分析。设置`bypassQueryAnalysis` 为`true`在没有库的情况下对索引字段使用显式加密 `crypt_shared`。如果未指定，则默认为`false`。 |

## 例子

要查看演示如何使用 `AutoEncryptionOpts`配置 `MongoClient`实例的代码片段，请选择与您的驱动程序对应的选项卡：

```
var AutoEncryptionOpts =
{
   "keyVaultClient" : keyVaultClient,
   "keyVaultNamespace" : "<database>.<collection>",
   "kmsProviders" : { ... },
   "bypassQueryAnalysis": "<boolean value>", // optional - defaults to false
   "encryptedFieldsMap" : { ... }
}

cluster = Mongo(
  "mongodb://myhostexample.net:27017/?replicaSet=myReplicaSet",
  AutoEncryptionOpts
);

```

> 提示:
>
> **环境变量**
>
> 如果可能，考虑将提供的凭据定义为 `kmsProviders`环境变量，然后将它们传递给[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)使用[`--eval`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--eval)选项。这最大限度地减少了凭据泄漏到日志中的机会。

要了解用于配置自动加密共享库的其他选项，请参阅[配置。](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/shared-library/#std-label-qe-reference-shared-library-configuration)







译者：韩鹏帅

原文：[MongoClient Options for Queryable Encryption](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/qe-options-clients/)