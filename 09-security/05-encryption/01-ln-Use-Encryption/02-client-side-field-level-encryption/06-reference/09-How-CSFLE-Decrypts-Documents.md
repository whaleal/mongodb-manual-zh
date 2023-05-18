# CSFLE 如何解密文档

本页介绍 CSFLE 如何使用您的数据加密密钥和客户主密钥中的元数据来解密数据。

## 用于解密的元数据

当您使用 CSFLE 加密数据时，您加密的数据将存储为[`BinData`](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#mongodb-bsontype-Binary)包含以下元数据的子类型 6 对象：

- `_id`用于加密数据的数据加密密钥
- 用于加密数据的加密算法

数据加密密钥包含描述用于加密它们的客户主密钥的元数据。

司机和[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)使用此元数据尝试自动解密您的数据

## 自动解密过程

为了自动解密您的数据，启用 CSFLE 的客户端执行以下过程：

1. 检查`BinData`要解密的字段的 blob 元数据，了解用于加密值的数据加密密钥和加密算法。

2. 检查在当前数据库连接中为指定的数据加密密钥配置的 Key Vault 集合。如果 Key Vault 集合不包含指定的密钥，则自动解密失败并且驱动程序返回加密的`BinData`blob。

3. 检查用于加密密钥材料的客户主密钥 (CMK) 的数据加密密钥元数据。

4. 解密数据加密密钥。此过程因 KMS 提供商而异：

   * **AWS**

     对于 Amazon Web Services (AWS) KMS，将数据加密密钥发送到您的 AWS KMS 实例进行解密。如果 CMK 不存在 *或者*连接配置未授予对 CMK 的访问权限，则解密失败并且驱动程序返回加密的 `BinData`blob。

     > 提示:
     >
     > 要了解如何使用 Amazon Web Services KMS 进行自动加密，请参阅 [将自动客户端字段级加密与 AWS 结合使用。](https://www.mongodb.com/docs/manual/core/csfle/tutorials/aws/aws-automatic/#std-label-csfle-tutorial-automatic-aws)

   * **GCP**

     对于 Google Cloud Platform (GCP) KMS，将数据加密密钥发送到您的 GCP KMS 实例进行解密。如果 CMK 不存在*或者*连接配置未授予对 CMK 的访问权限，则解密失败并且驱动程序返回加密的`BinData`blob。

     > 提示:
     >
     > 要了解如何使用 Google Cloud Platform KMS 进行自动加密，请参阅[将自动客户端字段级加密与 GCP 结合使用。](https://www.mongodb.com/docs/manual/core/csfle/tutorials/gcp/gcp-automatic/#std-label-csfle-tutorial-automatic-gcp)

   * **Azure**

     对于 Azure Key Vault，将数据加密密钥发送到您的 Azure Key Vault 实例进行解密。如果 CMK 不存在 *或者*连接配置未授予对 CMK 的访问权限，则解密失败并且驱动程序返回加密的`BinData`blob。

     > 提示:
     >
     > 要了解如何使用 Azure Key Vault 进行自动加密，请参阅[在 Azure 中使用自动客户端字段级加密。](https://www.mongodb.com/docs/manual/core/csfle/tutorials/azure/azure-automatic/#std-label-csfle-tutorial-automatic-azure)

   * **KMIP**

     对于符合 KMIP 的 KMS，从 KMS 中检索 CMK，然后在本地使用 CMK 解密数据加密密钥。如果 CMK 不存在*或者*连接配置未授予对 CMK 的访问权限，则解密失败并且驱动程序返回加密的`BinData`blob。

     > 提示:
     >
     > 要了解如何使用符合 KMIP 的 KMS 进行自动加密，请参阅[将自动客户端字段级加密与 KMIP 结合使用。](https://www.mongodb.com/docs/manual/core/csfle/tutorials/kmip/kmip-automatic/#std-label-csfle-tutorial-automatic-kmip)

   * **本地密钥提供程序**

     对于本地密钥提供程序，从您的文件系统检索 CMK 并使用它来解密数据加密密钥。如果数据库配置中指定的本地密钥未用于加密数据加密密钥，则解密失败并且驱动程序返回加密的`BinData`blob。

     > 警告:
     >
     > **不要在生产中使用本地密钥提供程序**
     >
     > 本地密钥提供程序是一种不安全的存储方法，不 **建议**用于生产。相反，您应该将客户主密钥存储在远程 [密钥管理系统](https://en.wikipedia.org/wiki/Key_management#Key_management_system) （公里）。
     >
     > 要了解如何在 CSFLE 实施中使用远程 KMS，请参阅[教程](https://www.mongodb.com/docs/manual/core/csfle/tutorials/#std-label-csfle-tutorial-automatic-encryption)指南。

5. `BinData`使用解密的数据加密密钥和适当的算法解密该值。

有权访问 MongoDB 服务器但无权访问所需 CMK 和数据加密密钥的应用程序*无法*解密这些`BinData`值。

## 自动加密读取行为

对于读取操作，驱动程序在发出读取操作之前*使用*您的加密模式对查询文档中的字段值进行加密。

然后，您的客户端应用程序使用`BinData`元数据自动解密您从 MongoDB 收到的文档。

要了解有关加密模式的更多信息，请参阅 [加密模式。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/create-schema/#std-label-csfle-fundamentals-create-schema)

## 了解更多

要了解如何为客户端字段级加密配置数据库连接，请参阅 [CSFLE-Specific MongoClient Options 。](https://www.mongodb.com/docs/manual/core/csfle/reference/csfle-options-clients/#std-label-csfle-reference-mongo-client)

要了解有关数据加密密钥和客户主密钥之间关系的更多信息，请参阅[密钥和密钥保管库。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)







译者：韩鹏帅

原文：[How CSFLE Decrypts Documents](https://www.mongodb.com/docs/manual/core/csfle/reference/decryption/)