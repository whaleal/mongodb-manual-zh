# 加密密钥管理

> 注意:
>
> Queryable Encryption 处于公共预览阶段，可用于评估目的。不建议将公共预览版用于生产部署，因为可能会引入重大更改。要了解有关预览版的更多信息，请参阅[可查询加密预览](https://www.mongodb.com/blog/post/mongodb-releases-queryable-encryption-preview/)博客文章。

在本指南中，您可以了解如何在启用了可查询加密的应用程序中使用密钥管理系统 ( KMS )管理加密密钥。

## 加密组件

MongoDB 使用以下组件来执行可查询加密：

- 数据加密密钥 (DEK)
- Key Vault 集合
- 客户主密钥 (CMK)
- 密钥管理系统 (KMS)

您的数据加密密钥是您用来加密 MongoDB 文档中的字段的密钥。您的DEK存储在名为 Key Vault 集合的 MongoDB 集合中的一个文档中。

您的客户主密钥是您用来加密数据加密密钥的密钥。MongoDB 在数据加密密钥创建期间使用指定的 CMK自动加密数据加密密钥。

CMK是可查询加密中最敏感的密钥。如果您的 CMK遭到破坏，您所有的加密数据都可以被解密。

使用密钥管理系统来存储您的客户主密钥。

要了解有关密钥之间关系的更多信息，请参阅 [密钥和密钥保管库。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/keys-key-vaults/#std-label-qe-reference-keys-key-vaults)

> 提示:
>
> **使用远程密钥管理服务提供商**
>
> 确保将客户主密钥 ( CMK ) 存储在远程 KMS 上。
>
> 要详细了解为什么应使用远程KMS，请参阅 [使用远程 KMS 的原因。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/manage-keys/#std-label-qe-reasons-to-use-remote-kms)
>
> 要查看所有受支持的KMS提供商的列表，请参阅 [KMS 提供商](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-fundamentals-kms-providers)页面。

## 支持的密钥管理服务

可查询加密支持以下密钥管理系统 ( KMS ) 提供程序：

- 亚马逊网络服务 KMS
- Azure 密钥保管库
- 谷歌云平台 KMS
- 任何符合 KMIP 的密钥管理系统
- 本地密钥提供者

要了解有关这些提供程序的更多信息，包括显示您的应用程序如何使用它们执行可查询加密的图表，请参阅 [KMS 提供程序。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-fundamentals-kms-providers)

### 使用远程 KMS 的原因

与使用本地文件系统托管CMK相比，使用远程KMS管理您的客户主密钥 ( CMK ) 具有以下优势：

- 通过访问审计安全存储密钥
- 降低访问权限问题的风险
- 密钥的可用性和分发到远程客户端
- 自动密钥备份和恢复
- 集中式加密密钥生命周期管理

此外，对于以下KMS提供商，您的 KMS会远程加密和解密您的数据加密密钥，确保您的客户主密钥永远不会暴露给启用了可查询加密的应用程序：

- 亚马逊网络服务 KMS
- Azure 密钥保管库
- 谷歌云平台 KMS

## 了解更多

有关详细说明如何使用每个受支持的KMS提供程序设置启用了可查询加密的应用程序的教程，请参阅以下页面：

- [在 AWS 中使用自动可查询加密](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/aws/aws-automatic/#std-label-qe-tutorial-automatic-aws)
- [在 Azure 中使用自动可查询加密](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/azure/azure-automatic/#std-label-qe-tutorial-automatic-azure)
- [将自动可查询加密与 GCP 结合使用](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/gcp/gcp-automatic/#std-label-qe-tutorial-automatic-gcp)









译者：韩鹏帅

原文：[Encryption Key Management](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/manage-keys/)