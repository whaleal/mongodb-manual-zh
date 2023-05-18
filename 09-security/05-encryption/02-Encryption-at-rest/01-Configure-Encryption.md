## 配置加密

**概述**

本页讨论服务器配置以支持静态加密。如果你使用[MongoDB 地图集](https://www.mongodb.com/cloud/atlas)，您的数据已经加密。MongoDB 在云提供商级别管理 Atlas 加密，但您也可以使用自己的密钥管理解决方案。查看地图集[密钥管理文件](https://docs.atlas.mongodb.com/security-kms-encryption/)了解详情。

MongoDB Enterprise 3.2 为 WiredTiger 存储引擎引入了本机加密选项。在 Atlas 之外，加密仅适用于使用 WiredTiger 存储引擎的企业安装。

加密密钥的安全管理是存储加密的关键要求。MongoDB 使用未随 MongoDB 安装一起存储的主密钥。只有主密钥是外部管理的，其他密钥可以与您的 MongoDB 实例一起存储。

MongoDB 的加密存储引擎支持主密钥的两种密钥管理选项：

- 通过密钥管理互操作性协议 (KMIP) 与第三方密钥管理设备集成。**推荐的**
- 通过密钥文件使用本地密钥管理。

>[IMPORTANT]
>
>MongoDB 无法加密现有数据。当您使用新密钥启用加密时，MongoDB 实例不能有任何预先存在的数据。如果您的 MongoDB 安装已经有现有数据，请参阅 [静态加密现有数据](https://www.mongodb.com/docs/manual/tutorial/configure-encryption/#std-label-encrypt-existing-data)额外的步骤。

**密钥管理器**

MongoDB Enterprise 支持使用兼容的密钥管理设备安全传输密钥。使用密钥管理器允许将密钥存储在密钥管理器中。

MongoDB Enterprise 支持使用符合密钥管理互操作性协议 (KMIP) 的密钥管理设备安全传输密钥。任何为 KMIP 提供支持的设备供应商都应该是兼容的。

有关 MongoDB 认证合作伙伴的列表，请参阅[合作伙伴名单](https://www.mongodb.com/partners/list).

>[TIP]
>
>**推荐的**
>
>使用密钥管理器符合监管密钥管理指南，例如 HIPAA、PCI-DSS 和 FERPA，并且建议使用本地密钥管理。

**先决条件**

- 您的密钥管理器必须支持 KMIP 通信协议。
- 要向 KMIP 服务器验证 MongoDB，您必须拥有密钥管理设备颁发的有效证书。

>[NOTE]
>
>**在 4.0 版中更改**
>
>Windows 上的 MongoDB Enterprise 不再支持`AES256-GCM`. 此密码现在仅在 Linux 上可用。

**使用新密钥加密**

要创建新密钥，请从以下选项[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)开始连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)密钥管理器 ：

- [`--enableEncryption`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--enableEncryption)
- [`--kmipServerName`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipServerName)
- [`--kmipPort`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipPort)
- [`--kmipServerCAFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipServerCAFile)
- [`--kmipClientCertificateFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipClientCertificateFile)

根据您的配置需要包括其他选项。例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`. 有关详细信息，请参阅 [本地主机绑定兼容性更改。](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

以下操作在您的密钥管理器中创建一个新的主密钥， [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)用于加密[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)为每个数据库生成的密钥。

```shell
mongod --enableEncryption --kmipServerName <KMIP Server HostName> \
  --kmipPort <KMIP server port> --kmipServerCAFile ca.pem \
  --kmipClientCertificateFile client.pem
```

连接到 KMIP 服务器时，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 验证指定的[`--kmipServerName`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipServerName)是否与 KMIP 服务器提供的证书中的主题备用名称 `SAN`（或者，如果 `SAN` 不存在，则为通用名称 `CN`）匹配。 [1] 如果存在 `SAN`，则 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 不会与 `CN` 匹配。 如果主机名与 `SAN`（或 `CN`）不匹配，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 将无法连接。

要验证密钥创建和使用是否成功，请检查日志文件。如果成功，该过程将记录以下消息：

```shell
[initandlisten] Created KMIP key with id: <UID>
[initandlisten] Encryption key manager initialized using master key with id: <UID>
```

>[TIP]
>
>也可以看看：
>
>[加密密钥管理选项](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-label-encryption-key-management-options)

**使用现有密钥加密**

您可以使用您的 KMIP 服务器创建和管理的现有主密钥。要使用现有密钥，请从以下选项[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)开始连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)密钥管理器：

- [`--enableEncryption`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--enableEncryption)
- [`--kmipServerName`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipServerName)
- [`--kmipPort`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipPort)
- [`--kmipServerCAFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipServerCAFile)
- [`--kmipClientCertificateFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipClientCertificateFile)
- [`--kmipKeyIdentifier`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipKeyIdentifier)

根据您的配置需要包括其他选项。例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`. 有关详细信息，请参阅 [本地主机绑定兼容性更改。](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

```shell
mongod --enableEncryption --kmipServerName <KMIP Server HostName> \
  --kmipPort <KMIP server port> --kmipServerCAFile ca.pem \
  --kmipClientCertificateFile client.pem --kmipKeyIdentifier <UID>
```

连接到 KMIP 服务器时，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 验证指定的 [`--kmipServerName`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipServerName) 是否与 KMIP 服务器提供的证书中的主题备用名称 `SAN`（或者，如果 `SAN` 不存在，则为通用名称 `CN`）匹配。 [1] 如果存在 `SAN`，则 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 不会与 `CN` 匹配。 如果主机名与 `SAN`（或 `CN`）不匹配，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 将无法连接。

>[TIP]
>
>也可以看看：
>
>[加密密钥管理选项](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-label-encryption-key-management-options)

*[ 1 ]( [1](https://www.mongodb.com/docs/manual/tutorial/configure-encryption/#ref-san-id1) , [2](https://www.mongodb.com/docs/manual/tutorial/configure-encryption/#ref-san-id2) )* 从MongoDB 4.2开始，在进行SAN比较时，MongoDB支持DNS名称或IP地址的比较。在之前的版本中，MongoDB 只支持 DNS 名称的比较。

**本地密钥管理**

>[IMPORTANT]
>
>使用密钥文件方法不符合大多数监管密钥管理准则，需要用户安全地管理自己的密钥。
>
>密钥文件的安全管理至关重要。

要使用密钥文件进行加密，您必须有一个包含单个 16 或 32 字符字符串的 base64 编码密钥文件。密钥文件必须只能由[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)进程的所有者访问。

1. 使用 16 或 32 个字符的字符串创建 base64 编码的密钥文件。您可以使用您喜欢的任何方法生成编码的密钥文件。例如，

   ```shell
   openssl rand -base64 32 > mongodb-keyfile
   ```

2. 更新文件权限。

   ```shell
   chmod 600 mongodb-keyfile
   ```

3. 要使用密钥文件，请从[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)以下选项开始：

   - `--enableEncryption`,
   - `--encryptionKeyFile <path to keyfile>`,

   ```shell
   mongod --enableEncryption --encryptionKeyFile  mongodb-keyfile
   ```

   根据您的配置需要包括其他选项。例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`. 有关详细信息，请参阅 [本地主机绑定兼容性更改。](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

4. 验证加密密钥管理器是否已使用密钥文件成功初始化。如果操作成功，该过程将记录以下消息：

   ```shell
   [initandlisten] Encryption key manager initialized with key file: <path to keyfile>
   ```

>[TIP]
>
>也可以看看：
>
>[加密密钥管理选项](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-label-encryption-key-management-options)

**静态加密现有数据**

MongoDB 无法加密现有数据。当您使用新密钥启用加密时，MongoDB 实例不能有任何预先存在的数据。

如果您使用的是具有现有数据的副本集，请使用滚动[初始同步](https://www.mongodb.com/docs/manual/core/replica-set-sync/#std-label-replica-set-initial-sync)来加密数据。

例如，考虑一个包含三个成员的副本集。副本集正在使用中并包含您要加密的数据。这些是加密静态数据的步骤：

1. **准备一台服务器。**

   按照以下步骤准备服务器：

   - 选择一个辅助服务器。
   - [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在辅助服务器上停止。
   - 可选：备份[`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath). 如果不需要完整备份，请考虑仅备份 `diagnostic.data`目录以在出现问题时保留可能有用的故障排除数据。有关详细信息，请参阅[全时诊断数据捕获](https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/#std-label-ftdc-stub)。
   - 删除 [`dbPath`.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)

2. **启用加密。**

   启动辅助服务器[启用加密](https://www.mongodb.com/docs/manual/tutorial/configure-encryption/#std-label-encrypt-with-new-key). 该[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例创建一个新的密钥库。

3. **同步数据。**

   从主节点导入数据。[启动 mongod 进程](https://www.mongodb.com/docs/manual/tutorial/manage-mongodb-processes/)，适当指定 [复制选项。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-label-cli-mongod-replica-set)

   [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)执行初始同步并在同步过程中加密数据。

4. **在辅助设备上重复该过程。**

   [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)当第一个辅助实例完成导入和加密数据后，在其他辅助实例上重复该过程 。

5. **加密主节点。**

   当所有的辅助节点都被加密后，[`step down`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)主节点。符合条件的二级节点将选出一个新的主节点。

   旧的主要现在是次要的。重复这些步骤以删除未加密的数据，然后运行[初始同步。](https://www.mongodb.com/docs/manual/core/replica-set-sync/#std-label-replica-set-initial-sync)

 参见

原文 - [Configure Encryption]( https://docs.mongodb.com/manual/tutorial/configure-encryption/ )

译者：景圣