# 密钥和密钥保管库

> 注意:
>
> Queryable Encryption 处于公共预览阶段，可用于评估目的。不建议将公共预览版用于生产部署，因为可能会引入重大更改。要了解有关预览版的更多信息，请参阅[可查询加密预览](https://www.mongodb.com/blog/post/mongodb-releases-queryable-encryption-preview/)博客文章。

## 概述

在本指南中，您可以了解有关可查询加密的以下组件的详细信息：

- Key Vault 集合
- 数据加密密钥 (DEK)
- 客户主密钥 (CMK)

要查看演示如何使用上述组件设置启用可查询加密的客户端的分步指南，请参阅以下资源：

- [快速开始](https://www.mongodb.com/docs/manual/core/queryable-encryption/quick-start/#std-label-qe-quick-start)
- [教程](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/#std-label-qe-tutorial-automatic-encryption)

## 钥匙

客户**主密钥(CMK) 是您用来加密****数据加密密钥**(DEK)的密钥 。CMK 是可查询加密中最敏感的密钥。如果您的 CMK 遭到破坏，您所有的加密数据都可以被解密。

> 重要的:
>
> **使用远程密钥管理服务提供商**
>
> 确保将客户主密钥 ( CMK ) 存储在远程 KMS 上。
>
> 要详细了解为何应使用远程KMS，请参阅 [使用远程 KMS 的原因。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/manage-keys/#std-label-qe-reasons-to-use-remote-kms)
>
> 要查看所有受支持的KMS提供商的列表，请参阅 [KMS 提供商](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-fundamentals-kms-providers)页面。

数据加密密钥 (DEK) 是用于加密 MongoDB 文档中的字段的密钥。您将数据加密密钥存储在使用 CMK 加密的 Key Vault 集合中。如果无法访问您的 CMK，您的客户端应用程序将无法解密您的数据加密密钥，进而无法解密您的数据。要了解有关 Key Vault 集合的更多信息，请参阅 [Key Vault 集合。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/keys-key-vaults/#std-label-qe-reference-key-vault)

> 重要的:
>
> **删除密钥**
>
> 如果删除数据加密密钥 (DEK)，则使用该 DEK 加密的所有字段将永久不可读。
>
> 如果您删除一个 CMK，所有使用该 CMK 加密的 DEK 加密的字段将永久不可读。

要查看详细说明 DEK、CMK 和 Key Vault 集合如何在所有受支持的密钥管理服务 (KMS) 提供程序体系结构中交互的图表，请参阅 [KMS 提供程序。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-fundamentals-kms-providers)

## Key Vault 集合

您的 Key Vault 集合是您用来存储 **数据加密密钥 (DEK) 文档的**MongoDB 集合。DEK 文档是包含数据加密密钥的 BSON 文档，具有以下结构：

```
{
  "_id" : UUID(<string>),
  "status" : <int>,
  "masterKey" : {<object>},
  "updateDate" : ISODate(<string>),
  "keyMaterial" : BinData(0,<string>),
  "creationDate" : ISODate(<string>),
  "keyAltNames" : <array>
}
```

您可以像创建标准 MongoDB 集合一样创建 Key Vault 集合。您的 Key Vault 集合必须在该字段上 具有 [唯一索引](https://www.mongodb.com/docs/manual/core/index-unique/#std-label-index-type-unique)`keyAltNames`。要检查唯一索引是否存在，您可以 [`listIndexes`](https://www.mongodb.com/docs/manual/reference/command/listIndexes/#mongodb-dbcommand-dbcmd.listIndexes)针对 Key Vault 集合运行命令。如果唯一索引不存在，应用程序必须在执行 DEK 管理之前创建它。

要了解如何创建 MongoDB 集合，请参阅[数据库和集合](https://www.mongodb.com/docs/manual/core/databases-and-collections/#std-label-collections)

> 提示:
>
> **mongosh 功能**
>
> 这[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)如果不存在，方法 [`KeyVault.createKey()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.createKey/#mongodb-method-KeyVault.createKey)会自动在字段上创建一个唯一索引。`keyAltNames`

### Key Vault 集合名称

您可以使用任何非管理[命名空间](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-namespace)来存储您的 Key Vault 集合。按照惯例，本文档中的示例使用 `encryption.__keyVault` [命名空间。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-namespace)

> 警告:
>
> 不要使用`admin`数据库来存储与加密相关的集合。如果您为此集合使用管理数据库，您的 MongoDB 客户端可能会由于缺少权限而无法访问或解密您的数据。

### 权限

有权访问 Key Vault 集合的应用程序[`read`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-read)可以通过查询集合来检索 DEK。但是，只有有权访问用于加密 DEK 的 CMK 的应用程序才能使用该 DEK 进行加密或解密。您必须授予您的应用程序访问 Key Vault 集合和您的 CMK 的权限，才能使用 DEK 加密和解密文档。

要了解如何授予对 MongoDB 集合的访问权限，请参阅 [管理用户和角色](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/) 在 MongoDB 手册中。

要了解如何授予您的应用程序访问您的 CMK 的权限，请参阅 [教程](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/#std-label-qe-tutorial-automatic-encryption)教程。

### Key Vault 集群

默认情况下，MongoDB 将 Key Vault 集合存储在连接的集群上。MongoDB 还支持在与连接的集群不同的 MongoDB 部署上托管 Key Vault 集合。应用程序必须有权访问托管 Key Vault 集合的集群和连接集群才能执行可查询加密操作。

要指定托管 Key Vault 集合的集群，请使用 `keyVaultClient`客户端`MongoClient`对象的字段。要了解有关客户端`MongoClient`对象中特定于可查询加密的配置选项的更多信息，请参阅 [可查询加密的 MongoClient 选项](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/qe-options-clients/#std-label-qe-reference-mongo-client)指南。

### 更新 Key Vault 集合

要将DEK添加到 Key Vault 集合，请使用对象`createKey`的方法 `ClientEncryption`。

要删除或更新DEK，请使用标准 [增删改查](https://www.mongodb.com/docs/manual/crud/)操作。您将 DEK 作为文档存储在 MongoDB 中，您可以将任何文档操作应用于 DEK。

要查看说明如何创建DEK 的教程，请参阅[快速入门。](https://www.mongodb.com/docs/manual/core/queryable-encryption/quick-start/#std-label-qe-local-create-dek)

> 提示:
>
> **mongosh 具体功能**
>
> [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)提供以下用于处理 Key Vault 集合的其他方法：
>
> - [`getKeyVault()`](https://www.mongodb.com/docs/manual/reference/method/getKeyVault/#mongodb-method-getKeyVault)
> - [`KeyVault.getKey()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.getKey/#mongodb-method-KeyVault.getKey)
> - [`KeyVault.getKeys()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.getKeys/#mongodb-method-KeyVault.getKeys)
> - [`KeyVault.getKeyByAltName()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.getKeyByAltName/#mongodb-method-KeyVault.getKeyByAltName)
> - [`KeyVault.createKey()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.createKey/#mongodb-method-KeyVault.createKey)
> - [`KeyVault.addKeyAlternateName()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.addKeyAlternateName/#mongodb-method-KeyVault.addKeyAlternateName)
> - [`KeyVault.removeKeyAlternateName()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.removeKeyAlternateName/#mongodb-method-KeyVault.removeKeyAlternateName)









译者：韩鹏帅

原文：[Keys and Key Vaults](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/keys-key-vaults/)