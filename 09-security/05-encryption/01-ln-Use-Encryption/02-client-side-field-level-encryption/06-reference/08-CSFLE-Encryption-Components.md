## CSFLE 加密组件

## 图表

下图说明了 MongoDB 驱动程序或[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)以及客户端字段级加密 (CSFLE) 的每个组件：

![本地密钥提供程序的支持 CSFLE 的应用程序的体系结构图](/Users/jinmu/Desktop/mongodb-manual-zh/images/CSFLE-Encryption-Components-01.png)

## 成分

以下部分讨论了上图中的各个组件。

### libmongocrypt

`libmongocrypt`是个[Apache 许可的开源](https://github.com/mongodb/libmongocrypt)官方 MongoDB 4.2+ 兼容驱动程序使用的核心加密库和 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)为客户端字段级加密提供动力。一些驱动程序可能需要特定的集成步骤来安装或链接库。

要查看安装步骤`libmongocrypt`，请参阅[libmongocrypt 参考页。](https://www.mongodb.com/docs/manual/core/csfle/reference/libmongocrypt/#std-label-csfle-reference-libmongocrypt)

### mongocryptd

`mongocryptd`支持自动加密，仅适用于 MongoDB Enterprise。`mongocryptd`不执行加密功能。

要了解更多信息`mongocryptd`，请参阅 [为 CSFLE 安装和配置 mongocryptd 。](https://www.mongodb.com/docs/manual/core/csfle/reference/mongocryptd/#std-label-csfle-reference-mongocryptd)

### Key Vault 集合

Key Vault 集合是一个标准的 MongoDB 集合，它存储用于加密应用程序数据的所有数据加密密钥。在存储在 Key Vault 集合中之前，数据加密密钥本身使用客户主密钥 ( CMK ) 进行加密。您可以将 Key Vault 集合托管在与存储加密应用程序数据的集群不同的 MongoDB 集群上。

要了解有关 Key Vault 集合的更多信息，请参阅 [密钥和 Key Vault 。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)

### 密钥管理系统

密钥管理系统 ( KMS ) 存储用于加密数据加密密钥的客户主密钥 ( CMK )。

要查看 MongoDB 支持的所有KMS提供程序的列表，请参阅[CSFLE KMS 提供程序。](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-csfle-reference-kms-providers)

### MongoDB集群

存储加密数据的 MongoDB 集群也可以强制执行客户端字段级加密。有关服务器端模式实施的更多信息，请参阅[CSFLE 服务器端模式实施。](https://www.mongodb.com/docs/manual/core/csfle/reference/server-side-schema/#std-label-csfle-reference-server-side-schema)







译者：韩鹏帅

原文：[CSFLE Encryption Components](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-components/)