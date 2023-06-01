# CSFLE KMS 提供商

## 概述

了解客户端字段级加密 (CSFLE) 支持的**密钥管理服务提供商。**

密钥**管理服务**是作为服务提供的密钥管理系统。

## 密钥管理服务任务

在 CSFLE 中，您的密钥管理服务执行以下任务：

- [创建并存储您的客户主密钥](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers-create-and-store)
- [创建和加密您的数据加密密钥](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers-encrypt)
- [解密数据加密密钥](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers-decrypt)

要了解有关客户主密钥和数据加密密钥的更多信息，请参阅 [密钥和密钥保管库。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)

### 创建并存储您的客户主密钥

要创建客户主密钥，您必须配置密钥管理服务提供商以生成您的客户主密钥，如下所示：

![建客户主密钥流程图](/Users/jinmu/Desktop/mongodb-manual-zh/images/CSFLE-KMS-Providers-01.png)

要查看演示如何在首选密钥管理服务中创建和存储 CMK的教程，请参阅[教程。](https://www.mongodb.com/docs/manual/core/csfle/tutorials/#std-label-csfle-tutorial-automatic-encryption)

### 创建和加密数据加密密钥

创建数据加密密钥时，您必须执行以下操作：

- `ClientEncryption`在支持 CSFLE 的应用程序中实例化一个实例：
  - 提供一个对象，该对象指定支持 CSFLE 的应用程序用于通过KMS`kmsProviders`进行身份验证的凭据。
- 使用支持 CSFLE 的应用程序中对象`CreateDataKey`的方法 创建数据加密密钥。`ClientEncryption`
  - 提供一个`dataKeyOpts`对象，指定您的KMS应该使用哪个密钥来加密您的新数据加密密钥。

要查看演示如何创建和加密数据加密密钥的教程，请参阅以下资源：

- [快速开始](https://www.mongodb.com/docs/manual/core/csfle/quick-start/#std-label-csfle-quick-start)
- [教程](https://www.mongodb.com/docs/manual/core/csfle/tutorials/#std-label-csfle-tutorial-automatic-encryption)

要查看所有受支持的KMS提供程序的结构`kmsProviders`和对象，请参阅 `dataKeyOpts`[支持的密钥管理服务。](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers-supported-kms)

### 解密数据加密密钥

要解密数据加密密钥，您必须提供一个`kmsProviders`对象，该对象指定支持 CSFLE 的应用程序使用您的KMS进行身份验证并检索您的客户主密钥的凭据。

要了解有关解密数据加密密钥的更多信息，请参阅 [CSFLE 如何解密文档。](https://www.mongodb.com/docs/manual/core/csfle/reference/decryption/#std-label-csfle-reference-decryption-how-decryption-works)

## 支持的密钥管理服务

本页的以下部分介绍了所有密钥管理服务提供商的以下信息：

- 支持 CSFLE 的客户端架构
- `kmsProviders`对象的结构
- `dataKeyOpts`对象的结构

CSFLE 支持以下密钥管理服务提供商：

- [亚马逊网络服务 KMS](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers-aws)
- [Azure 密钥保管库](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers-azure)
- [谷歌云平台 KMS](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers-gcp)
- [KMIP](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers-kmip)
- [本地密钥提供程序](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers-local)

### 亚马逊网络服务 KMS

本节提供与使用相关的信息 [AWS 密钥管理服务](https://aws.amazon.com/kms/) 在支持 CSFLE 的应用程序中。

要查看演示如何在支持 CSFLE 的应用程序中使用 AWS KMS 的教程，请参阅 [将自动客户端字段级加密与 AWS 结合使用。](https://www.mongodb.com/docs/manual/core/csfle/tutorials/aws/aws-automatic/#std-label-csfle-tutorial-automatic-aws)

#### 架构

下图描述了使用AWS KMS的支持 CSFLE 的应用程序的架构。

![AWS KMS的支持 CSFLE 的应用程序的架构图](/Users/jinmu/Desktop/mongodb-manual-zh/images/CSFLE-KMS-Providers-02.png)

> 笔记:
>
> **客户端无法访问客户主密钥**
>
> 使用上述密钥管理服务时，启用 CSFLE 的应用程序无权访问您的客户主密钥。

#### kmsProviders 对象

`kmsProviders` 下表显示了AWS KMS 对象的结构：

| 场地         | IAM 用户需要 | IAM 角色所需 | 描述                                                 |
| :----------- | :----------- | :----------- | :--------------------------------------------------- |
| 访问密钥 ID  | 是的         | 是的         | 标识帐户用户。                                       |
| 秘密访问密钥 | 是的         | 是的         | 包含帐户用户的身份验证凭据。                         |
| 会话令牌     | 不           | 是的         | 包含从 AWS Security Token Service (STS) 获取的令牌。 |

#### dataKeyOpts 对象

`dataKeyOpts` 下表显示了AWS KMS 对象的结构：

| 场地     | 必需的 | 描述                                                         |
| :------- | :----- | :----------------------------------------------------------- |
| key      | Yes    | [亚马逊资源编号 (ARN)](https://docs.aws.amazon.com/kms/latest/developerguide/viewing-keys.html#find-cmk-id-arn) 的主键。 |
| region   | No     | 您的主密钥的 AWS 区域，例如“us-west-2”；仅当您的 ARN 中未指定时才需要。 |
| endpoint | No     | AWS 端点的自定义主机名（如果为您的账户配置）。               |

### Azure 密钥保管库

本节提供与使用相关的信息 [Azure 密钥保管库](https://azure.microsoft.com/en-us/services/key-vault/) 在支持 CSFLE 的应用程序中。

要查看演示如何在支持 CSFLE 的应用程序中使用 Azure Key Vault 的教程，请参阅 [在 Azure 中使用自动客户端字段级加密。](https://www.mongodb.com/docs/manual/core/csfle/tutorials/azure/azure-automatic/#std-label-csfle-tutorial-automatic-azure)

架构

下图描述了使用 Azure Key Vault 的支持 CSFLE 的应用程序的体系结构.

![Azure Key Vault 的支持 CSFLE 的应用程序的体系结构](/Users/jinmu/Desktop/mongodb-manual-zh/images/CSFLE-KMS-Providers-03.png)

> 笔记:
>
> **客户端无法访问客户主密钥**
>
> 使用上述密钥管理服务时，启用 CSFLE 的应用程序无权访问您的客户主密钥。

#### kmsProviders 对象

`kmsProviders` 下表显示了Azure Key Vault 对象的结构：

| 场地                           | 必需的 | 描述                                                         |
| :----------------------------- | :----- | :----------------------------------------------------------- |
| azure.tenantId                 | 是的   | 标识帐户的组织。                                             |
| azure.clientId                 | 是的   | 标识 clientId 以验证您注册的应用程序。                       |
| azure.clientSecret             | 是的   | 用于验证您注册的应用程序。                                   |
| azure.identityPlatformEndpoint | 不     | 指定身份验证服务器的主机名和端口号。默认为 login.microsoftonline.com，只有非商业 Azure 实例才需要，例如政府或中国帐户。 |

#### dataKeyOpts 对象

`dataKeyOpts`下表显示了Azure Key Vault 对象的结构：

| 场地             | 必需的 | 描述                                               |
| :--------------- | :----- | :------------------------------------------------- |
| keyName          | 是的   | 主密钥的名称                                       |
| keyVersion       | 不     | 主密钥的版本                                       |
| keyVaultEndpoint | 是的   | 密钥保管库的 URL。例如 myVaultName.vault.azure.net |

### 谷歌云平台 KMS

本节提供与使用相关的信息 [谷歌云密钥管理](https://cloud.google.com/security-key-management) 在支持 CSFLE 的应用程序中。

要查看演示如何在支持 CSFLE 的应用程序中使用 GCP KMS 的教程，请参阅 [将自动客户端字段级加密与 GCP 结合使用。](https://www.mongodb.com/docs/manual/core/csfle/tutorials/gcp/gcp-automatic/#std-label-csfle-tutorial-automatic-gcp)

**结构**

下图描述了使用 GCP KMS 的支持 CSFLE 的应用程序的架构。

![ GCP KMS 的支持 CSFLE 的应用程序的架构](/Users/jinmu/Desktop/mongodb-manual-zh/images/CSFLE-KMS-Providers-04.png)

> 笔记:
>
> **客户端无法访问客户主密钥**
>
> 使用上述密钥管理服务时，启用 CSFLE 的应用程序无权访问您的客户主密钥。

#### kmsProviders 对象

`kmsProviders` 下表显示了GCP KMS 对象的结构：

| 场地     | 必需的 | 描述                                                         |
| :------- | :----- | :----------------------------------------------------------- |
| email    | 是的   | 标识您的服务帐户电子邮件地址。                               |
| 私钥     | 是的   | 标识您的服务帐户私钥 [base64字符串](https://en.wikipedia.org/wiki/Base64)或者 [二进制子类型 0](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#bson.Binary) 没有前缀和后缀标记的格式。 假设你的服务账号私钥值如下：`-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n`您将为该字段指定的值是：`your-private-key`如果您有`user-key.json`凭证文件，则可以通过在 bash 或类似的 shell 中执行以下命令来提取字符串：`cat user-key.json | jq -r .private_key | openssl pkcs8 -topk8 -nocrypt -inform PEM -outform DER | base64 -w 0` |
| endpoint | 不     | 指定身份验证服务器的主机名和端口号。默认为 oauth2.googleapis.com。 |

#### dataKeyOpts 对象

`dataKeyOpts`下表显示了GCP KMS 对象的结构：

| 场地       | 必需的 | 描述                                                         |
| :--------- | :----- | :----------------------------------------------------------- |
| projectId  | 是的   | 您在其中创建密钥的项目的标识符。                             |
| location   | 是的   | 为您的密钥指定的区域。                                       |
| keyRing    | 是的   | 您的密钥所属的密钥组的标识符。                               |
| keyName    | 是的   | 对称主密钥的标识符。                                         |
| keyVersion | 不     | 指定命名密钥的版本。如果未指定，则使用密钥的默认版本。       |
| endpoint   | 不     | 指定 Cloud KMS 的主机和可选端口。默认值为`cloudkms.googleapis.com`。 |

### KMIP

本节提供与使用 [KMIP](https://docs.oasis-open.org/kmip/spec/v1.0/os/kmip-spec-1.0-os.html) 在支持 CSFLE 的应用程序中使用兼容的密钥管理服务提供商。

要查看演示如何在支持 CSFLE 的应用程序中使用符合 KMIP 的密钥管理服务提供程序的教程，请参阅 [将自动客户端字段级加密与 KMIP 结合使用。](https://www.mongodb.com/docs/manual/core/csfle/tutorials/kmip/kmip-automatic/#std-label-csfle-tutorial-automatic-kmip)

**结构**

下图描述了使用符合KMIP的密钥提供程序的支持 CSFLE 的应用程序的体系结构。

![符合KMIP的密钥提供程序的支持 CSFLE 的应用程序的体系结构](/Users/jinmu/Desktop/mongodb-manual-zh/images/CSFLE-KMS-Providers-05.png)

> 重要的:
>
> **客户端访问客户主密钥**
>
> 当支持 CSFLE 的应用程序使用符合KMIP的密钥提供程序时，您的应用程序将直接访问您的客户主密钥。

#### kmsProviders 对象

下表显示了KMIP兼容密钥提供`kmsProviders` 程序的对象结构：

> 笔记:
>
> **通过 TLS/SSL 进行身份验证**
>
> 使用 KMIP 时，支持 CSFLE 的应用程序通过 TLS/SSL进行身份验证。

| 场地     | 必需的 | 描述                                 |
| :------- | :----- | :----------------------------------- |
| endpoint | Yes    | 指定身份验证服务器的主机名和端口号。 |

#### dataKeyOpts 对象

`dataKeyOpts`下表显示了符合 KMIP 的密钥管理服务的对象结构：

| 场地     | 必需的 | 描述                                                         |
| :------- | :----- | :----------------------------------------------------------- |
| keyId    | No     | `keyId`一个96字节的 字段[秘密数据管理对象](http://docs.oasis-open.org/kmip/spec/v1.4/os/kmip-spec-v1.4-os.html#_Toc490660780) 存储在符合KMIP 的密钥提供程序中。如果您没有在发送给您的KMIP`keyId`兼容密钥提供程序的文档中指定该字段，驱动程序会在您的KMIP兼容密钥提供程序中创建一个新的 96 字节秘密数据托管对象作为您的主密钥。`masterKey` |
| endpoint | Yes    | 您的KMIP兼容密钥提供程序的 URI 。                            |

### 本地密钥提供程序

本节提供与在支持 CSFLE 的应用程序中使用本地密钥提供程序（您的文件系统）相关的信息。

> 警告:
>
> **不要在生产中使用本地密钥提供程序**
>
> 本地密钥提供程序是一种不安全的存储方法，不 **建议**用于生产。相反，您应该将客户主密钥存储在远程 [密钥管理系统](https://en.wikipedia.org/wiki/Key_management#Key_management_system) （公里）。
>
> 要了解如何在 CSFLE 实施中使用远程 KMS，请参阅[教程](https://www.mongodb.com/docs/manual/core/csfle/tutorials/#std-label-csfle-tutorial-automatic-encryption)指南。

要查看演示如何使用本地密钥提供程序测试客户端字段级加密的教程，请参阅 [快速入门。](https://www.mongodb.com/docs/manual/core/csfle/quick-start/#std-label-csfle-quick-start)

**结构**

当您在支持 CSFLE 的应用程序中使用本地密钥提供程序时，您的应用程序会从运行您的应用程序的计算机的文件系统中检索您的客户主密钥。

下图描述了使用本地密钥提供程序的支持 CSFLE 的应用程序的体系结构。

![本地密钥提供程序的支持 CSFLE 的应用程序的体系结构图](/Users/jinmu/Desktop/mongodb-manual-zh/images/CSFLE-KMS-Providers-06.png)

#### kmsProviders 对象

`kmsProviders` 下表显示了本地密钥提供程序的对象结构：

| 场地 | 必需的 | 描述                                                         |
| :--- | :----- | :----------------------------------------------------------- |
| key  | 是的   | 用于加密/解密数据密钥的主密钥。主密钥作为 base64 编码字符串传递。 |

#### dataKeyOpts 对象

当您使用本地密钥提供程序时，您可以通过您的`kmsProviders`对象指定您的客户主密钥。







译者：韩鹏帅

原文：[CSFLE KMS Providers](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/)