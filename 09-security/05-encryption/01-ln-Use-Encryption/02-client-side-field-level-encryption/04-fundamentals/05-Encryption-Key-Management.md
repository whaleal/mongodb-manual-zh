# 加密密钥管理

在本指南中，您可以了解如何在支持客户端字段级加密 (CSFLE) 的应用程序中使用密钥管理系统 ( KMS ) 管理加密密钥。

## 加密组件

MongoDB 使用以下组件来执行客户端字段级加密：

- 数据加密密钥 (DEK)
- Key Vault 集合
- 客户主密钥 (CMK)
- 密钥管理系统 (KMS)

您的数据加密密钥是您用来加密 MongoDB 文档中的字段的密钥。您的DEK存储在名为 Key Vault 集合的 MongoDB 集合中的一个文档中。

您的客户主密钥是您用来加密数据加密密钥的密钥。MongoDB 在数据加密密钥创建期间使用指定的 CMK自动加密数据加密密钥。

CMK是CSFLE中最敏感的密钥。如果您的 CMK遭到破坏，您所有的加密数据都可以被解密。

使用密钥管理系统来存储您的客户主密钥。

要了解有关密钥之间关系的更多信息，请参阅 [密钥和密钥保管库。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)

> 重要的:
>
> **使用远程密钥管理服务提供商**
>
> 确保将客户主密钥 ( CMK ) 存储在远程 KMS 上。
>
> 要详细了解为什么应使用远程KMS，请参阅 [使用远程 KMS 的原因。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manage-keys/#std-label-csfle-reasons-to-use-remote-kms)
>
> 要查看所有受支持的KMS提供程序的列表，请参阅 [CSFLE KMS 提供程序](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers)页面。

## 支持的密钥管理服务

客户端字段级加密支持以下密钥管理系统 ( KMS ) 提供程序：

- 亚马逊网络服务 KMS
- Azure 密钥保管库
- 谷歌云平台 KMS
- 任何符合 KMIP 的密钥管理系统
- 本地密钥提供程序*（仅用于测试）*

默认的 KMIP 协议版本是 1.2。[您可以在 MongoDB 服务器配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-configuration-options)中将 MongoDB 配置为使用 KMIP 版本 1.0 或 1.1 [。](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-configuration-options)

要了解有关这些提供程序的更多信息，包括显示您的应用程序如何使用它们执行客户端字段级加密的图表，请参阅 [CSFLE KMS 提供程序。](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers)

### 使用远程 KMS 的原因

与使用本地文件系统托管CMK相比，使用远程KMS管理您的客户主密钥 ( CMK ) 具有以下优势：

- 通过访问审计安全存储密钥
- 降低访问权限问题的风险
- 密钥的可用性和分发到远程客户端
- 自动密钥备份和恢复
- 集中式加密密钥生命周期管理

此外，对于以下KMS提供商，您的 KMS远程加密和解密您的数据加密密钥，确保您的客户主密钥永远不会暴露给启用 CSFLE 的应用程序：

- 亚马逊网络服务 KMS
- Azure 密钥保管库
- 谷歌云平台 KMS

## 管理数据加密密钥的备用名称

您可以分配数据加密密钥 ( DEK ) 备用名称以使密钥更易于引用。分配备用名称允许您执行以下操作：

- 通过与字段不同的方式引用 DEK `_id`。
- 在运行时动态分配 DEK。

### 使用备用名称创建数据加密密钥

> 重要的:
>
> **先决条件**
>
> 在添加新的键备用名称之前，您必须在该`keyAltNames`字段上创建一个唯一索引。客户端字段级加密取决于服务器强制执行的密钥备用名称的唯一性。
>
> 要了解如何创建唯一索引，请参阅[唯一索引。](https://www.mongodb.com/docs/manual/core/index-unique/#std-label-index-type-unique)

以下示例使用备用名称创建DEK 。选择与您的驱动程序语言相对应的选项卡：

```
var keyVaultClient = new MongoClient(connectionString);
var clientEncryptionOptions = new ClientEncryptionOptions(
    keyVaultClient: keyVaultClient,
    keyVaultNamespace: keyVaultNamespace,
    kmsProviders: kmsProviders);
var clientEncryption = new ClientEncryption(clientEncryptionOptions);

var dataKeyOptions = new DataKeyOptions(
    alternateKeyNames: new[] { "<Your Key Alt Name>" },
    masterKey: new BsonDocument
    {
        { "<Your dataKeyOpts Keys>", "<Your dataKeyOpts Values>" },
    });

var dataKeyId = clientEncryption.CreateDataKey("<Your KMS Provider>", dataKeyOptions, CancellationToken.None);

```

要了解有关`dataKeyOpts`和`kmsProviders`对象的更多信息，请参阅 [CSFLE KMS 提供程序。](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers)

### 在自动加密方案中使用密钥备用名称

加密模式包含用户指定的规则，这些规则标识哪些字段必须加密以及如何加密这些字段。在您的加密规则中，您可以为加密您的字段的数据加密密钥指定备用密钥名称。

**您必须使用JSON 指针**引用密钥备用名称。JSON 指针是一个以字符为前缀的字符串`"/"`，可用于访问同一文档或另一文档中的特定字段值。使用 JSON 指针引用查询或更新文档中包含密钥备用名称值的字段。

> 重要的:
>
> **不能对确定性加密的字段使用备用名称**
>
> [在使用确定性加密算法](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-csfle-deterministic-encryption)加密字段时，您不能通过它的备用名称来引用DEK。要确定性地加密您的字段，您必须指定要用于加密您的字段的密钥。`_id`

#### 加密方案中的引用密钥备用名称

考虑以下加密字段的加密模式`salary` ：

```
{
  "<database>.<collection>": {
    "bsonType": "object",
    "properties": {
      "salary": {
        "encrypt": {
          "bsonType": "int",
          "keyId": "/fieldWithAltName",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      }
    }
  }
}
```

架构的`keyId`字段包含一个 JSON 指针，用于引用 `fieldWithAltName`正在加密的文档中的字段。

以下文档的`fieldWithAltName`值为`my-alt-name`：

```
{
  "name": "Jon Doe",
  "salary": 45000,
  "fieldWithAltName": "my-alt-name"
}
```

该`salary`字段由具有备用名称的数据加密密钥加密`my-alt-name`。

#### 在运行时动态分配键

您可以使用备用密钥名称在运行时为字段动态设置数据加密密钥。使用此功能可以使用相同的加密模式使用不同的数据加密密钥加密单个文档。

例如，考虑以下文档：

```
{
    "name": "Jon Doe",
    "salary": 45000,
    "fieldWithAltName": "my-alt-name"
},
{
    "name": "Jane Smith",
    "salary": 70000,
    "fieldWithAltName": "my-other-alt-name"
}
```

您使用配置有加密模式的支持 CSFLE 的客户端插入前面的文档[前面的例子。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manage-keys/#std-label-csfle-reference-key-alt-name-in-schema)

在加密模式中，该`salary.encrypt.keyId`字段包含一个指向`fieldWithAltName`插入文档字段的 JSON 指针。因此，`salary`两个示例文档中的字段使用特定于单个文档的数据加密密钥进行唯一加密。键在运行时动态分配。

## 过程：使用 Mongo Shell 轮换加密密钥

使用 1.5 版及更高版本的 Mongo Shell，您可以使用该`rewrapManyDataKey`方法轮换加密密钥。该`rewrapManyDataKey`方法自动解密多个数据密钥并使用指定的客户主密钥 (CMK) 重新加密它们。然后，它会更新密钥保管库集合中的轮换密钥。此方法允许您根据两个可选参数轮换加密密钥：

- 用于指定要轮换的键的过滤器。如果没有数据键与给定的过滤器匹配，则不会轮换任何键。省略筛选器以轮换密钥保管库集合中的所有密钥。
- 表示新 CMK 的对象。省略此对象以使用其当前 CMK 轮换数据密钥。

使用`rewrapManyDataKey`以下语法：

```
keyVault = db.getKeyVault()

keyVault.rewrapManyDataKey(
   {
      "<Your custom filter>"
   },
   {
      provider: "<KMS provider>",
      masterKey: {
         "<dataKeyOpts Key>" : "<dataKeyOpts Value>"
      }
   }
)
```

要详细了解`dataKeyOpts`您的 KMS 提供商的对象，请参阅 [支持的密钥管理服务。](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers-supported-kms)

## 删除数据加密密钥

[您可以使用标准 CRUD删除操作](https://www.mongodb.com/docs/manual/tutorial/remove-documents/#std-label-write-op-delete)从 Key Vault 集合中 删除DEK [。](https://www.mongodb.com/docs/manual/tutorial/remove-documents/#std-label-write-op-delete)

> 提示:
>
> **MongoDB Shell 特定功能**
>
> MongoDB shell 允许您使用以下方法删除DEK ：`UUID``keyVault.deleteKey()`
>
> ```
> keyVault = db.getKeyVault()
> keyVault.deleteKey(UUID("<UUID String>"))
> ```

要了解有关 Key Vault 集合的更多信息，请参阅[Key Vault 集合。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-key-vault)

## 了解更多

有关详细说明如何使用每个受支持的KMS提供程序设置支持 CSFLE 的应用程序的教程，请参阅以下页面：

- [将自动客户端字段级加密与 AWS 结合使用](https://www.mongodb.com/docs/manual/core/csfle/tutorials/aws/aws-automatic/#std-label-csfle-tutorial-automatic-aws)
- [在 Azure 中使用自动客户端字段级加密](https://www.mongodb.com/docs/manual/core/csfle/tutorials/azure/azure-automatic/#std-label-csfle-tutorial-automatic-azure)
- [通过 GCP 使用自动客户端字段级加密](https://www.mongodb.com/docs/manual/core/csfle/tutorials/gcp/gcp-automatic/#std-label-csfle-tutorial-automatic-gcp)
- [通过 KMIP 使用自动客户端字段级加密](https://www.mongodb.com/docs/manual/core/csfle/tutorials/kmip/kmip-automatic/#std-label-csfle-tutorial-automatic-kmip)

要查看加密模式的其他示例，请参阅 [CSFLE 加密模式。](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#std-label-csfle-reference-encryption-schemas)







译者：韩鹏帅

原文：[Encryption Key Management](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manage-keys/)
