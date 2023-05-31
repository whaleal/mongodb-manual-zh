# 静态加密

静态加密与传输加密和保护相关帐户、密码和加密密钥的良好安全策略结合使用时，有助于确保符合安全和隐私标准，包括 HIPAA、PCI-DSS 和 FERPA

## 加密存储引擎

> 笔记:
>
> **企业版特证**
>
> 仅在 MongoDB Enterprise 中可用。

>  重要的:
>
> **仅适用于 WiredTiger 存储引擎。**

MongoDB Enterprise 3.2 为 WiredTiger 存储引擎引入了本机加密选项。此功能允许 MongoDB 加密数据文件，以便只有拥有解密密钥的方才能解码和读取数据。

### 加密过程

> 笔记:
>
> **在 4.0 版中更改**
>
> Windows 上的 MongoDB Enterprise 不再支持`AES256-GCM`. 此密码现在仅在 Linux 上可用。

如果启用加密，MongoDB Enterprise 使用的默认加密模式是`AES256-CBC`（或密码块链接模式下的 256 位高级加密标准）通过 OpenSSL。AES-256 使用对称密钥；即加密和解密文本的相同密钥。MongoDB Enterprise for Linux 还支持经过身份验证的加密 `AES256-GCM`（或 Galois/Counter 模式下的 256 位高级加密标准）。FIPS 模式加密也可用。

> 笔记:
>
> **AES256-GCM 和文件系统备份**
>
> 为了[加密存储引擎](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/#std-label-encrypted-storage-engine)使用`AES256-GCM`加密模式，`AES256-GCM`要求每个进程使用唯一的计数器块值和密钥。
>
> 为了[加密存储引擎](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/#std-label-encrypted-storage-engine) 配置`AES256-GCM`密码：
>
> * **从热备份恢复**
>
>   从 4.2 开始，如果您从通过“热”备份（即正在[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)运行）获取的文件中恢复，MongoDB 可以在启动时检测到“脏”键并自动翻转数据库键以避免 IV（初始化向量）重用。
>
> * **从冷备份恢复**
>
>   但是，如果您从通过“冷”备份（即未[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)运行）获取的文件中恢复，MongoDB 无法在启动时检测到“脏”键，并且 IV 的重用会使机密性和完整性保证失效。
>
>   从 4.2 开始，为了避免从冷文件系统快照恢复后重用密钥，MongoDB 添加了一个新的命令行选项[`--eseDatabaseKeyRollover`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--eseDatabaseKeyRollover)。当使用该 [`--eseDatabaseKeyRollover`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--eseDatabaseKeyRollover)选项启动时，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例会滚动使用 `AES256-GCM`密码配置的数据库密钥并退出。
>
> > 提示:
> >
> > * 一般来说，如果对 MongoDB Enterprise 4.2+ 使用基于文件系统的备份，请尽可能使用“热”备份功能。
> > * 对于 MongoDB Enterprise 版本 4.0 及更早版本，如果您使用 `AES256-GCM`加密模式，请不要**复制**数据文件或从文件系统快照（“热”或“冷”）恢复。

数据加密过程包括：

- 生成主密钥。
- 为每个数据库生成密钥。
- 使用数据库密钥加密数据。
- 使用主密钥加密数据库密钥。

加密透明地发生在存储层；即所有数据文件从文件系统的角度来看都是完全加密的，数据仅以未加密状态存在于内存中和传输过程中。

要加密 MongoDB 的所有网络流量，您可以使用 TLS/SSL（传输层安全/安全套接字层）。请参阅 [为客户端](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)[配置TLS/SSL`mongod``mongos`](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)和 [TLS/SSL 配置。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/)

### 密钥管理

> 重要的:
>
> **加密密钥的安全管理至关重要。**

数据库密钥在服务器内部，并且仅以加密格式分页到磁盘。MongoDB 在任何情况下都不会将主密钥分页到磁盘。

只有主密钥在服务器外部（即与数据和数据库密钥分开保存），并且需要外部管理。为了管理主密钥，MongoDB 的加密存储引擎支持两种密钥管理选项：

- 通过密钥管理互操作性协议 (KMIP) 与第三方密钥管理设备集成。**受到推崇的**
- 通过密钥文件进行本地密钥管理。

要配置 MongoDB 进行加密并使用两个密钥管理选项之一，请参阅 [配置加密。](https://www.mongodb.com/docs/manual/tutorial/configure-encryption/)

### 加密和复制

加密不是复制的一部分：

- 不复制主密钥和数据库密钥，并且
- 数据未通过网络进行本地加密。

虽然您可以为节点重复使用相同的密钥，但 MongoDB 建议为每个节点使用单独的密钥以及使用传输加密。

有关详细信息，请参阅[轮换加密密钥。](https://www.mongodb.com/docs/manual/tutorial/rotate-encryption-key/#std-label-rotate-encryption-keys)

### 审计日志

仅在 MongoDB Enterprise 中可用。

#### 使用 KMIP 服务器管理用于加密 MongoDB 审计日志的密钥

从 MongoDB 6.0 Enterprise 开始，您可以使用外部密钥管理互操作性协议 (KMIP) 服务器安全地管理用于加密 MongoDB 审计日志的密钥。

KMIP 简化了加密密钥的管理并消除了对非标准密钥管理流程的使用。

默认的 KMIP 协议版本是 1.2。[您可以在 MongoDB 服务器配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-configuration-options)中将 MongoDB 配置为使用 KMIP 版本 1.0 或 1.1 [。](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-configuration-options)

要将 KMIP 服务器与审计日志加密一起使用，请配置以下设置和参数：

- [`auditLog.auditEncryptionKeyIdentifier`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-auditLog.auditEncryptionKeyIdentifier)环境
- [`auditLog.compressionMode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-auditLog.compressionMode)环境
- [`auditEncryptionHeaderMetadataFile`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.auditEncryptionHeaderMetadataFile)范围
- [`auditEncryptKeyWithKMIPGet`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.auditEncryptKeyWithKMIPGet)范围

要测试审核日志加密，您还可以使用该 [`auditLog.localAuditKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-auditLog.localAuditKeyFile)设置。

[`auditLog.auditEncryptionKeyIdentifier`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-auditLog.auditEncryptionKeyIdentifier)从 MongoDB 6.0 开始，如果您需要降级到更早的 MongoDB 版本，您必须首先通过删除或 禁用审计日志加密

[`auditLog.localAuditKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-auditLog.localAuditKeyFile)。现有的加密审计日志保持加密状态，您可以保留为存储和处理加密日志而开发的任何程序。

> 笔记:
>
> 对于审计日志加密，审计日志目标必须是一个文件。[syslog](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-syslog)不能用作目标。

#### 未加密的审计日志和进程日志

如果您没有使用外部密钥管理互操作性协议 (KMIP) 服务器来管理用于加密审计日志的密钥（如上一节所示），则本节适用。

作为 MongoDB 加密存储引擎的一部分，审计日志文件未加密。作为正常操作的一部分，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)带[日志记录的](https://www.mongodb.com/docs/manual/administration/monitoring/#std-label-monitoring-standard-loggging)运行可能会将潜在的敏感信息输出到日志文件，具体取决于配置的[日志详细程度。](https://www.mongodb.com/docs/manual/reference/log-messages/#std-label-log-messages-configure-verbosity)

使用该[`security.redactClientLogData`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.redactClientLogData)设置可防止潜在的敏感信息进入`mongod`进程日志。设置[`redactClientLogData`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.redactClientLogData)会减少日志中的详细信息，并可能使日志诊断复杂化。

有关详细信息，请参阅[日志编辑手册条目。](https://www.mongodb.com/docs/manual/administration/monitoring/#std-label-monitoring-log-redaction)

## 应用层加密

应用层加密在应用层内提供基于每个字段或每个文档的加密。

*4.2版新*功能：MongoDB 4.2 系列驱动程序提供了客户端字段级加密框架。有关详细信息，请参阅 [客户端字段级加密。](https://www.mongodb.com/docs/manual/core/csfle/#std-label-manual-csfle-feature)

要加密完整文档，请编写自定义加密和解密例程或使用商业解决方案。

有关 MongoDB 认证合作伙伴的列表，请参阅[合作伙伴名单](https://www.mongodb.com/partners/list).







译者：韩鹏帅

原文：[Encryption at Rest](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)
