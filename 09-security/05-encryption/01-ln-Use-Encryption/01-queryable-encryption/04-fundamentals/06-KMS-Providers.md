# KMS供应商

> 注意:
>
> Queryable Encryption 处于公共预览阶段，可用于评估目的。不建议将公共预览版用于生产部署，因为可能会引入重大更改。要了解有关预览版的更多信息，请参阅[可查询加密预览](https://www.mongodb.com/blog/post/mongodb-releases-queryable-encryption-preview/)博客文章。

## 概述

了解Queryable Encryption 支持的**密钥管理服务**提供商。

密钥**管理服务**是作为服务提供的密钥管理系统。

## 密钥管理服务任务

在可查询加密中，您的密钥管理服务执行以下任务：

- [创建并存储您的客户主密钥](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-reference-kms-providers-create-and-store)
- [创建和加密您的数据加密密钥](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-reference-kms-providers-encrypt)
- [解密数据加密密钥](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-reference-kms-providers-decrypt)

要了解有关客户主密钥和数据加密密钥的更多信息，请参阅 [密钥和密钥保管库。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/keys-key-vaults/#std-label-qe-reference-keys-key-vaults)

### 创建并存储您的客户主密钥

要创建客户主密钥，您必须配置密钥管理服务提供商以生成您的客户主密钥，如下所示：

![配置客户主密钥流程图](../../../../../images/KMS-Providers-1.png)

要查看演示如何在首选密钥管理服务中创建和存储 CMK的教程，请参阅[教程。](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/#std-label-qe-tutorial-automatic-encryption)

### 创建和加密数据加密密钥

创建数据加密密钥时，您必须执行以下操作：

* `ClientEncryption`在启用了可查询加密的应用程序中实例化一个实例：
  - 提供一个`kmsProviders`对象，该对象指定支持可查询加密的应用程序用于向您的KMS进行身份验证的凭据。
* 使用启用了可查询加密的应用程序中的对象`CreateDataKey`方法 创建数据加密密钥。`ClientEncryption`
  * 提供一个`dataKeyOpts`对象，指定您的KMS应该使用哪个密钥来加密您的新数据加密密钥。

要查看演示如何创建和加密数据加密密钥的教程，请参阅以下资源：

- [快速开始](https://www.mongodb.com/docs/manual/core/queryable-encryption/quick-start/#std-label-qe-quick-start)
- [教程](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/#std-label-qe-tutorial-automatic-encryption)

要查看所有受支持的 KMS 提供程序的 `kmsProviders` 和 `dataKeyOpts` 对象的结构，请参阅 [支持的密钥管理服务](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-reference-kms-providers-supported-kms)。

### 解密数据加密密钥

要解密数据加密密钥，您必须提供一个`kmsProviders`对象，该对象指定支持可查询加密的应用程序用于通过您的KMS进行身份验证并检索您的客户主密钥的凭据。

## 支持的密钥管理服务

本页的以下部分介绍了所有密钥管理服务提供商的以下信息：

- 启用可查询加密的客户端架构
- `kmsProviders`对象的结构
- `dataKeyOpts`对象的结构

可查询加密支持以下密钥管理服务提供商：

- [亚马逊网络服务 KMS](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-reference-kms-providers-aws)
- [Azure 密钥保管库](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-reference-kms-providers-azure)
- [谷歌云平台 KMS](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-reference-kms-providers-gcp)
- [KMIP](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-reference-kms-providers-kmip)
- [本地密钥提供者](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-reference-kms-providers-local)

### 亚马逊网络服务 KMS

本节提供与使用相关的信息 [AWS 密钥管理服务](https://aws.amazon.com/kms/) 在启用了可查询加密的应用程序中。

要查看演示如何在启用可查询加密的应用程序中使用 AWS KMS 的教程，请参阅 [将自动可查询加密与 AWS 结合使用。](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/aws/aws-automatic/#std-label-qe-tutorial-automatic-aws)

#### Architecture

下图描述了使用 AWS KMS 启用可查询加密的应用程序的架构。

![AWS KMS 启用可查询加密的应用程序的架构图](../../../../../images/KMS-Providers-2.png)

> 笔记:
>
> **客户端无法访问客户主密钥**
>
> 使用上述密钥管理服务时，启用可查询加密的应用程序无权访问您的客户主密钥。

#### kmsProviders 对象

`kmsProviders` 下表显示了AWS KMS 对象的结构：

| 场地         | IAM 用户需要 | IAM 角色所需 | 描述                                                 |
| :----------- | :----------- | :----------- | :--------------------------------------------------- |
| 访问密钥 ID  | Yes          | Yes          | 标识帐户用户。                                       |
| 秘密访问密钥 | Yes          | Yes          | 包含帐户用户的身份验证凭据。                         |
| 会话令牌     | No           | Yes          | 包含从 AWS Security Token Service (STS) 获取的令牌。 |

#### dataKeyOpts 对象

`dataKeyOpts` 下表显示了AWS KMS 对象的结构：

| 场地 | 必需的 | 描述                                                         |
| :--- | :----- | :----------------------------------------------------------- |
| 钥匙 | Yes    | [亚马逊资源编号 (ARN)](https://docs.aws.amazon.com/kms/latest/developerguide/viewing-keys.html#find-cmk-id-arn) 的主键。 |
| 地区 | No     | 您的主密钥的 AWS 区域，例如“us-west-2”；仅当您的 ARN 中未指定时才需要。 |
| 端点 | No     | AWS 端点的自定义主机名（如果为您的账户配置）。               |

### Azure 密钥保管库

本节提供与使用相关的信息 [Azure 密钥保管库](https://azure.microsoft.com/en-us/services/key-vault/) 在启用了可查询加密的应用程序中。

要查看演示如何在启用了可查询加密的应用程序中使用 Azure Key Vault 的教程，请参阅 [在 Azure 中使用自动可查询加密。](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/azure/azure-automatic/#std-label-qe-tutorial-automatic-azure)

#### Architecture

下图描述了使用 Azure Key Vault 启用可查询加密的应用程序的体系结构。

![Azure Key Vault 启用可查询加密的应用程序的架构图](../../../../../images/KMS-Providers-3.png)

> 笔记:
>
> **客户端无法访问客户主密钥**
>
> 使用上述密钥管理服务时，启用可查询加密的应用程序无权访问您的客户主密钥。

#### kmsProviders 对象

`kmsProviders` 下表显示了Azure Key Vault 对象的结构：

| 场地                           | 必需的 | 描述                                                         |
| :----------------------------- | :----- | :----------------------------------------------------------- |
| azure.tenantId                 | Yes    | 标识帐户的组织。                                             |
| azure.clientId                 | Yes    | 标识 clientId 以验证您注册的应用程序。                       |
| azure.clientSecret             | Yes    | 用于验证您注册的应用程序。                                   |
| azure.identityPlatformEndpoint | No     | 指定身份验证服务器的主机名和端口号。默认为 login.microsoftonline.com，只有非商业 Azure 实例才需要，例如政府或中国帐户。 |

#### dataKeyOpts 对象

`dataKeyOpts`下表显示了Azure Key Vault 对象的结构：

| 场地         | 必需的 | 描述                                               |
| :----------- | :----- | :------------------------------------------------- |
| 键名         | Yes    | 主密钥的名称                                       |
| 密钥版本     | No     | 主密钥的版本                                       |
| keyVault端点 | Yes    | 密钥保管库的 URL。例如 myVaultName.vault.azure.net |

### 谷歌云平台 KMS

本节提供与使用相关的信息 [谷歌云密钥管理](https://cloud.google.com/security-key-management) 在启用了可查询加密的应用程序中。

要查看演示如何在启用可查询加密的应用程序中使用 GCP KMS 的教程，请参阅 [将自动可查询加密与 GCP 结合使用。](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/gcp/gcp-automatic/#std-label-qe-tutorial-automatic-gcp)

#### Architecture

下图描述了使用 GCP KMS 启用可查询加密的应用程序的架构。

![GCP KMS 启用可查询加密的应用程序的架构图](../../../../../images/KMS-Providers-4.png)

> 笔记:
>
> **客户端无法访问客户主密钥**
>
> 使用上述密钥管理服务时，启用可查询加密的应用程序无权访问您的客户主密钥。

#### kmsProviders 对象

`kmsProviders` 下表显示了GCP KMS 对象的结构：

| 场地  | 必需的 | 描述                                                         |
| :---- | :----- | :----------------------------------------------------------- |
| email | Yes    | 标识您的服务帐户电子邮件地址。                               |
| 私钥  | Yes    | 标识您的服务帐户私钥 [base64字符串](https://en.wikipedia.org/wiki/Base64)或者 [二进制子类型 0](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#bson.Binary) 没有前缀和后缀标记的格式。 假设你的服务账号私钥值如下：`-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n`您将为该字段指定的值是：`your-private-key`如果您有`user-key.json`凭证文件，则可以通过在 bash 或类似的 shell 中执行以下命令来提取字符串：`cat user-key.json | jq -r .private_key | openssl pkcs8 -topk8 -nocrypt -inform PEM -outform DER | base64 -w 0` |
| 端点  | No     | 指定身份验证服务器的主机名和端口号。默认为 oauth2.googleapis.com。 |

#### dataKeyOpts 对象

`dataKeyOpts`下表显示了GCP KMS 对象的结构：

| 场地     | 必需的 | 描述                                                         |
| :------- | :----- | :----------------------------------------------------------- |
| 项目编号 | Yes    | 您在其中创建密钥的项目的标识符。                             |
| 地点     | Yes    | 为您的密钥指定的区域。                                       |
| 钥匙圈   | Yes    | 您的密钥所属的密钥组的标识符。                               |
| 键名     | Yes    | 对称主密钥的标识符。                                         |
| 密钥版本 | No     | 指定命名密钥的版本。如果未指定，则使用密钥的默认版本。       |
| 端点     | No     | 指定 Cloud KMS 的主机和可选端口。默认值为`cloudkms.googleapis.com`。 |

### KMIP

本节提供与使用 [KMIP](https://docs.oasis-open.org/kmip/spec/v1.0/os/kmip-spec-1.0-os.html) 启用可查询加密的应用程序中的兼容密钥管理服务提供商。

#### Architecture

下图描述了使用符合 KMIP 的密钥提供程序的启用可查询加密的应用程序的体系结构。

![符合 KMIP 的密钥提供程序的启用可查询加密的应用程序的体系结构图](../../../../../images/KMS-Providers-5.png)

> 重要的:
>
> **客户端访问客户主密钥**
>
> 当启用可查询加密的应用程序使用符合KMIP的密钥提供程序时，您的应用程序将直接访问您的客户主密钥。

#### kmsProviders 对象

`kmsProviders` 下表显示了符合 KMIP 的密钥管理服务的对象结构：

> 笔记:
>
> **通过 TLS/SSL 进行身份验证**
>
> 使用 KMIP 时，启用可查询加密的应用程序通过 TLS/SSL进行身份验证。

| 场地 | 必需的 | 描述                                 |
| :--- | :----- | :----------------------------------- |
| 端点 | Yes    | 指定身份验证服务器的主机名和端口号。 |

#### dataKeyOpts 对象

`dataKeyOpts`下表显示了符合 KMIP 的密钥管理服务的对象结构：

| 场地  | 必需的 | 描述                                                         |
| :---- | :----- | :----------------------------------------------------------- |
| keyId | No     | `keyId`一个96字节的 字段[秘密数据管理对象](http://docs.oasis-open.org/kmip/spec/v1.4/os/kmip-spec-v1.4-os.html#_Toc490660780) 存储在符合KMIP 的密钥提供程序中。如果您没有在发送给您的KMIP`keyId`兼容密钥提供程序的文档中指定该字段，驱动程序会在您的KMIP兼容密钥提供程序中创建一个新的 96 字节秘密数据托管对象作为您的主密钥。`masterKey` |
| 端点  | Yes    | 您的KMIP兼容密钥提供程序的 URI 。                            |

### 本地密钥提供者

本节提供与在启用可查询加密的应用程序中使用本地密钥提供程序（您的文件系统）相关的信息。

> 警告:
>
> **不要在生产中使用本地密钥文件**
>
> 文件系统中的本地密钥文件是不安全的， **不建议**用于生产。相反，您应该将客户主密钥存储在远程 [密钥管理系统](https://en.wikipedia.org/wiki/Key_management#Key_management_system) （公里）。
>
> 要了解如何在可查询加密实现中使用远程 KMS，请参阅[教程](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/#std-label-qe-tutorial-automatic-encryption)指南。

要查看演示如何使用本地密钥提供程序测试可查询加密的教程，请参阅 [快速入门。](https://www.mongodb.com/docs/manual/core/queryable-encryption/quick-start/#std-label-qe-quick-start)

#### Architecture

当您在启用了可查询加密的应用程序中使用本地密钥提供程序时，您的应用程序会从运行应用程序的计算机的文件系统中检索您的客户主密钥。

下图描述了使用本地密钥提供程序的支持 CSFLE 的应用程序的体系结构。

![ CSFLE 的应用程序的体系结构图](../../../../../images/KMS-Providers-6.png)

#### kmsProviders 对象

`kmsProviders` 下表显示了本地密钥提供程序的对象结构：

| 场地 | 必需的 | 描述                                                         |
| :--- | :----- | :----------------------------------------------------------- |
| 钥匙 | Yes    | 用于加密/解密数据密钥的主密钥。主密钥作为 base64 编码字符串传递。 |

#### dataKeyOpts 对象[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#datakeyopts-object-4)

当您使用本地密钥提供程序时，您可以通过您的`kmsProviders`对象指定您的客户主密钥。









译者：韩鹏帅

原文：[KMS Providers](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/)