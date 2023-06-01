### 为 TLS/SSL配置`mongod`和`mongos`

**概述**

本文档帮助您配置新的 MongoDB 实例以支持 TLS/SSL。有关将当前不使用 TLS/SSL 的集群升级为使用 TLS/SSL 的说明，请参阅[升级集群以改用 TLS/SSL](https://www.mongodb.com/docs/manual/tutorial/upgrade-cluster-to-ssl/) 。

MongoDB 使用本机 TLS/SSL 操作系统库：

| 平台         | TLS/SSL 库          |
| :----------- | :------------------ |
| 视窗         | 安全通道 (Schannel) |
| 操作系统/BSD | 打开SSL             |
| 苹果系统     | 安全运输            |

>[NOTE]
>
>- 从 4.0 版开始，MongoDB在 TLS 1.1+ 可用的系统上禁用对 TLS 1.0 加密的支持。有关详细信息，请参阅[禁用 TLS 1.0 。](https://www.mongodb.com/docs/manual/release-notes/4.0/#std-label-4.0-disable-tls)
>- MongoDB 的 TLS/SSL 加密只允许对所有连接使用至少 128 位密钥长度的强 TLS/SSL 密码。
>- MongoDB的*Linux 64 位传统 x64*构建**不**包括对 TLS/SSL 的支持。

**先决条件**

>[IMPORTANT]
>
>TLS/SSL、PKI（公钥基础设施）证书和证书颁发机构的完整描述超出了本文档的范围。此页面假定您事先了解 TLS/SSL 以及对有效证书的访问权限。

**证书颁发机构**

对于生产用途，您的 MongoDB 部署应使用由证书颁发机构生成和签名的有效证书。您或您的组织可以生成和维护独立的证书颁发机构，或使用第三方 TLS 供应商生成的证书。获取和管理证书超出了本文档的范围。

`mongod`和`mongos`证书密钥文件

在建立 TLS/SSL 连接时， [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)向其客户端提供证书密钥文件以建立其身份。[[ 1 \]](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#footnote-FIPS)证书密钥文件包含一个公钥证书及其关联的私钥，但只有公共部分会显示给客户端。

MongoDB 可以使用证书颁发机构颁发的任何有效 TLS/SSL 证书或自签名证书。如果您使用自签名证书，虽然通信通道将被加密以防止窃听连接，但*不会*验证服务器身份。这使您容易受到中间人攻击。使用由受信任的证书颁发机构签名的证书将允许 MongoDB 驱动程序验证服务器的身份。

通常，除非网络是可信的，否则请避免使用自签名证书。

关于副本集和分片集群成员的证书，建议在不同的服务器上使用不同的证书。这最大限度地减少了私钥的暴露并允许进行主机名验证。

[ [1](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#ref-FIPS-id1) ]对于 FIPS 模式，确保证书符合 FIPS（即使用符合 FIPS 的算法）并且私钥符合 PKCS#8 标准。如果您需要将私钥转换为 PKCS#8 格式，可以使用各种转换工具，例如`openssl pkcs8` 和其他。

程序（使用`net.tls`设置）

>[NOTE]
>
>从 4.2 版本开始，MongoDB 提供了`net.tls`与设置（及其相应的命令行选项）相对应的 `net.ssl`设置（和相应的命令行选项）。这些`net.tls`设置提供与选项**相同**的功能，`net.ssl`因为 MongoDB 一直支持 TLS 1.0 及更高版本。
>
>本节中的过程使用这些`net.tls`设置。有关使用`net.ssl`别名的过程，请参见[程序（使用`net.ssl`设置）。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#std-label-configure-ssl)

设置`mongod`并`mongos`使用 TLS/SSL 证书和密钥

以下部分将 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/配置[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)为使用 TLS/SSL 连接。通过这些 TLS/SSL 设置， [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)将其证书密钥文件呈现给客户端。但是， [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)不需要来自客户端的证书密钥文件来验证客户端的身份。要要求客户端的证书密钥文件，请参阅 [设置`mongod`和`mongos`使用客户端证书验证](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#std-label-ssl-mongod-ca-signed-ssl-cert-key)替代。

>[NOTE]
>
>该过程使用`net.tls`设置（从 MongoDB 4.2 开始可用）。有关使用`net.ssl`设置的步骤，请参阅 [程序（使用`net.ssl`设置）。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#std-label-configure-ssl)

要使用 TLS/SSL 连接，请在您的 /实例的 [配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)中包含以下[TLS/SSL 设置](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-net-tls-conf-options)[：](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

**PEM 密钥文件 (Linux/Windows/macOS)**

| 环境                                                         | 笔记                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`net.tls.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.mode) | 设置为`requireTLS`。此设置限制每个服务器仅使用 TLS/SSL 加密连接。您还可以指定值`allowTLS`或`preferTLS`设置在端口上使用混合 TLS/SSL 模式。详情请见 [`net.tls.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.mode)。 |
| [`net.tls.certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile) | 设置为包含 TLS/SSL 证书和密钥的文件的路径。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例将此文件呈现给其客户端以建立实例的身份。 |

**系统 SSL 证书存储(Windows/macOS)**

从 MongoDB 4.0 开始，您可以为 Windows 和 macOS 使用系统 SSL 证书存储。要使用系统 SSL 证书存储，请指定 [`net.tls.certificateSelector`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateSelector)而不是指定证书密钥文件。

| 环境                                                         | 笔记                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`net.tls.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.mode) | 设置为`requireTLS`。此设置限制每个服务器仅使用 TLS/SSL 加密连接。您还可以指定值`allowTLS`或`preferTLS`设置在端口上使用混合 TLS/SSL 模式。详情请见 [`net.tls.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.mode)。 |
| [`net.tls.certificateSelector`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateSelector) | 设置为属性（`subject`或 `thumbprint`）和值。此设置用于选择证书。详情请见 [`net.tls.certificateSelector`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateSelector)。 |

例如，考虑实例的以下配置[文件](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

```yaml
net:
   tls:
      mode: requireTLS
      certificateKeyFile: /etc/ssl/mongodb.pem
systemLog:
   destination: file
   path: "/var/log/mongodb/mongod.log"
   logAppend: true
storage:
   dbPath: "/var/lib/mongodb"
processManagement:
   fork: true
net:
   bindIp: localhost,mongodb0.example.net
   port: 27017
```

使用上述配置的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例只能使用 TLS/SSL 连接：

```shell
mongod --config <path/to/configuration/file>
```

也就是说，客户端必须指定 TLS/SSL 连接。有关使用 TLS/SSL 连接的更多信息，请参阅 [使用加密连接到 MongoDB 实例（`tls`选项）](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-tls-client-connection-only)。

>[TIP]
>
>也可以看看：
>
>您还可以配置[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用命令行选项而不是配置文件：
>
>- 对于， [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)请参见：; 和 [。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsCertificateSelector)[`--tlsMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsMode)[`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsCertificateKeyFile)[`--tlsCertificateSelector`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsCertificateSelector)
>- 对于 ， [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)请参见：; 和 [。](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsCertificateSelector)[`--tlsMode`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsMode)[`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsCertificateKeyFile)[`--tlsCertificateSelector`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsCertificateSelector)

设置`mongod`并`mongos`使用客户端证书验证

以下部分配置 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)以使用 TLS/SSL 连接并执行客户端证书验证。使用这些 TLS/SSL 设置：

- [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)将其证书密钥文件提交给客户端进行验证。
- [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)需要来自客户端的证书密钥文件来验证客户端的身份。

>[NOTE]
>
>该过程使用`net.tls`设置（从 MongoDB 4.2 开始可用）。有关使用`net.ssl`设置的步骤，请参阅 [程序（使用`net.ssl`设置）。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#std-label-configure-ssl)

要使用 TLS/SSL 连接并执行客户端证书验证，请在您的/实例的 [配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)中包含以下[TLS/SSL 设置](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-net-tls-conf-options)[：](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

>[NOTE]
>
>从 MongoDB 4.0 开始，您可以为 Windows 和 macOS 使用系统 SSL 证书存储。要使用系统 SSL 证书存储，请指定 [`net.ssl.certificateSelector`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.certificateSelector)而不是指定证书密钥文件。

| 环境                                                         | 笔记                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`net.tls.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.mode) | 设置为`requireTLS`。此设置限制每个服务器仅使用 TLS/SSL 加密连接。您还可以指定值`allowTLS`或`preferTLS`设置在端口上使用混合 TLS/SSL 模式。详情请见 [`net.tls.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.mode)。 |
| [`net.tls.certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile) | 设置为包含 TLS/SSL 证书和密钥的文件的路径。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例将此文件呈现给其客户端以建立实例的身份。 |
| [`net.tls.CAFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.CAFile) | 设置为包含用于验证客户端证书的证书链的文件的路径。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例使用此文件来验证其客户端提供的证书。证书链包括根证书颁发机构的证书。 |

例如，考虑实例的以下配置[文件](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

```yaml
net:
   tls:
      mode: requireTLS
      certificateKeyFile: /etc/ssl/mongodb.pem
      CAFile: /etc/ssl/caToValidateClientCertificates.pem
systemLog:
   destination: file
   path: "/var/log/mongodb/mongod.log"
   logAppend: true
storage:
   dbPath: "/var/lib/mongodb"
processManagement:
   fork: true
net:
   bindIp: localhost,mongodb0.example.net
   port: 27017
```

使用上述配置的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例只能使用 TLS/SSL 连接，并且需要来自其客户端的有效证书：

```shell
mongod --config <path/to/configuration/file>
```

也就是说，客户端必须指定 TLS/SSL 连接并将其证书密钥文件提供给实例。有关使用 TLS/SSL 连接的更多信息，请参阅 [连接到需要客户端证书的 MongoDB 实例（`tls`选项）](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-mongo-connect-require-client-certificates-tls)。

>[TIP]
>
>也可以看看：
>
>您还可以配置[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用命令行选项而不是配置文件：
>
>- 对于[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，请参见[`--tlsMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsMode)、 [`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsCertificateKeyFile)和 [`--tlsCAFile`。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsCAFile)
>- 对于 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos), 见[`--tlsMode`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsMode), [`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsCertificateKeyFile), [`--tlsCAFile`。](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsCAFile)

为客户端阻止已撤销的证书

>[NOTE]
>
>该过程使用`net.tls`设置（从 MongoDB 4.2 开始可用）。有关使用`net.ssl`设置的步骤，请参阅 [程序（使用`net.ssl`设置）。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#std-label-configure-ssl)

为了防止证书被吊销的客户端连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例，您可以使用：

- - 在线证书状态协议 (OCSP)

    从 4.4 版开始，为了检查证书吊销，MongoDB[`enables`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ocspEnabled)默认使用 OCSP（在线证书状态协议）作为指定 CRL 文件或使用[`system SSL certificate store`.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateSelector)在 4.0 和 4.2 版本中，只能通过[`system certificate store`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateSelector)在 Windows 或 macOS 上使用 OCSP 来使用。

- - 证书撤销列表 (CRL)

    要指定 CRL 文件，请将 include [`net.tls.CRLFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.CRLFile)设置为包含已撤销证书的文件。例如：

    ```yaml
    net:
      tls:
        mode: requireTLS
        certificateKeyFile: /etc/ssl/mongodb.pem
        CAFile: /etc/ssl/caToValidateClientCertificates.pem
        CRLFile: /etc/ssl/revokedCertificates.pem
    ```

    

    出示 `/etc/ssl/revokedCertificates.pem` 中列出的证书的客户端将无法连接。

    >[TIP]
    >
    >也可以看看：您还可以使用命令行选项配置已撤销的证书列表。
    >
    >- 对于[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，见[`--tlsCRLFile`。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsCRLFile)
    >- 对于[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，见[`--tlsCRLFile`。](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsCRLFile)

仅在客户端出示证书时验证

在大多数情况下，确保客户端出示有效证书很重要。但是，如果您的客户端无法提供客户端证书或正在过渡到使用证书，您可能只想验证来自提供证书的客户端的证书。

>[NOTE]
>
>该过程使用`net.tls`设置（从 MongoDB 4.2 开始可用）。有关使用`net.ssl`设置的步骤，请参阅 [程序（使用`net.ssl`设置）。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#std-label-configure-ssl)

要绕过不提供证书的客户端的客户端证书验证，请将 [`net.tls.allowConnectionsWithoutCertificates`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.allowConnectionsWithoutCertificates)设为`true`.

例如：

```yaml
net:
  tls:
    mode: requireTLS
    certificateKeyFile: /etc/ssl/mongodb.pem
    CAFile: /etc/ssl/caToValidateClientCertificates.pem
    allowConnectionsWithoutCertificates: true
```

A [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用这些设置运行允许连接来自：

- 不提供证书的客户端。
- 提供有效证书的客户端。

>[NOTE]
>
>如果客户端出示证书，则该证书必须是有效证书。
>
>所有连接，包括那些没有提供证书的连接，都使用 TLS/SSL 加密。

有关客户端TLS/SSL 连接的更多信息，请参阅[客户端的 TLS/SSL 配置。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-ssl-clients)

>[TIP]
>
>也可以看看：
>
>您还可以使用命令行选项进行配置：
>
>- 对于[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，见 [`--tlsAllowConnectionsWithoutCertificates`。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsAllowConnectionsWithoutCertificates)
>- 对于[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，见 [`--tlsAllowConnectionsWithoutCertificates`。](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsAllowConnectionsWithoutCertificates)

**禁止协议[![img](https://www.mongodb.com/docs/manual/assets/link.svg)**](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#disallow-protocols)

>[NOTE]
>
>该过程使用`net.tls`设置（从 MongoDB 4.2 开始可用）。有关使用`net.ssl`设置的步骤，请参阅 [程序（使用`net.ssl`设置）。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#std-label-configure-ssl)

要防止 MongoDB 服务器接受使用特定协议的传入连接，[`net.tls.disabledProtocols`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.disabledProtocols)请将其设置为不允许的协议。

例如，以下配置阻止 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)接受使用`TLS1_0`或的传入连接`TLS1_1`

```yaml
net:
  tls:
    mode: requireTLS
    certificateKeyFile: /etc/ssl/mongodb.pem
    CAFile: /etc/ssl/caToValidateClientCertificates.pem
    disabledProtocols: TLS1_0,TLS1_1
```

>[TIP]
>
>也可以看看：
>
>您还可以使用命令行选项进行配置：
>
>- 对于[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，见[`--tlsDisabledProtocols`。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsDisabledProtocols)
>- 对于[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，见[`--tlsDisabledProtocols`。](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsDisabledProtocols)

TLS/SSL 证书密码

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)如果/的证书密钥文件 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)已加密，请将 include [`net.tls.certificateKeyFilePassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFilePassword)设置为密码。

>[TIP]
>
>从 MongoDB 4.2 开始，为避免以明文形式指定密码，您可以在配置文件中使用[扩展值。](https://www.mongodb.com/docs/manual/reference/expansion-directives/#std-label-externally-sourced-values)

>[TIP]
>
>也可以看看：
>
>您还可以使用命令行选项进行配置：
>
>- 对于[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，见[`--tlsCertificateKeyFilePassword`。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsCertificateKeyFilePassword)
>- 对于[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，见[`--tlsCertificateKeyFilePassword`。](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsCertificateKeyFilePassword)

**在线证书轮换**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#online-certificate-rotation)

从 MongoDB 5.0 开始，您可以按需轮换以下证书密钥文件：

- [`TLS Certificates`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile)
- [`CRL (Certificate Revocation List) files`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.CRLFile) （在 Linux 和 Windows 平台上）
- [`CA (Certificate Authority) files`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.CAFile)

要轮换这些证书中的一个或多个：

1. 替换您希望在文件系统上轮换的一个或多个证书，注意以下限制：
   - 每个新证书必须与其要替换的证书具有*相同的文件名*和 *相同的文件路径。*
   - 如果轮换加密[`TLS Certificate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile)，其密码必须与旧证书的密码相同（如 [`certificateKeyFilePassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFilePassword)配置文件设置所指定）。证书轮换不支持交互式密码提示。
2. 连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到您希望对其执行证书轮换的实例[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)
3. 运行[`rotateCertificates`](https://www.mongodb.com/docs/manual/reference/command/rotateCertificates/#mongodb-dbcommand-dbcmd.rotateCertificates)命令或 shell [`db.rotateCertificates()`](https://www.mongodb.com/docs/manual/reference/method/db.rotateCertificates/#mongodb-method-db.rotateCertificates)方法以轮换实例使用的证书。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

当发生证书轮换时：

- [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)与或 实例的现有连接[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)不会终止，并将继续使用旧证书。
- 任何新连接都将使用新证书。

不正确、过期、吊销或丢失的证书文件将导致证书轮换失败，但不会使现有的 TLS 配置无效或终止运行[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)进程。

在 MongoDB 5.0 之前，证书轮换需要停机，并且通常在维护窗口期间执行。

有关其他注意事项和完整使用说明，请参阅[`rotateCertificates`](https://www.mongodb.com/docs/manual/reference/command/rotateCertificates/#mongodb-dbcommand-dbcmd.rotateCertificates)或[`db.rotateCertificates()`](https://www.mongodb.com/docs/manual/reference/method/db.rotateCertificates/#mongodb-method-db.rotateCertificates) 。

在 FIPS 模式下运行

>FIPS 兼容的 TLS/SSL 仅在[MongoDB 企业版](http://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server). 有关详细信息，请参阅 [为 FIPS 配置 MongoDB 。](https://www.mongodb.com/docs/manual/tutorial/configure-fips/)

有关更多详细信息，请参阅[为 FIPS 配置 MongoDB 。](https://www.mongodb.com/docs/manual/tutorial/configure-fips/)

**下一步**

要为客户端配置 TLS/SSL 支持，请参阅客户端的 [TLS/SSL 配置。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/)

>[TIP]
>
>也可以看看：
>
>[使用 x.509 证书对客户端进行身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-x509-client-authentication/)

**程序（使用`net.ssl`设置）**

>[NOTE]
>
>从 4.2 版本开始，MongoDB 提供了`net.tls`与设置（及其相应的命令行选项）相对应的 `net.ssl`设置（和相应的命令行选项）。这些`net.tls`设置提供与选项**相同**的功能，`net.ssl`因为 MongoDB 一直支持 TLS 1.0 及更高版本。
>
>本节中的过程使用这些`net.ssl`设置。有关使用`net.tls`别名的过程，请参见[程序（使用`net.tls`设置）。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#std-label-configure-tls)

**设置`mongod`并`mongos`使用 TLS/SSL 证书和密钥**

以下部分将 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/配置[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)为使用 TLS/SSL 连接。通过这些 TLS/SSL 设置， [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)将其证书密钥文件呈现给客户端。但是， [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)不需要来自客户端的证书密钥文件来验证客户端的身份。要要求客户端的证书密钥文件，请参阅 [设置`mongod`并`mongos`使用客户端证书验证](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#std-label-client-cert-validation-ssl)反而。

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)要使用 TLS/SSL 连接，请在您的/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例的 [配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)中包含以下 TLS/SSL 设置[：](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)

**PEM 密钥文件 (Linux/Windows/macOS)**

| 环境                                                         | 笔记                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`net.ssl.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.mode) | 设置为`requireSSL`。此设置限制每个服务器仅使用 TLS/SSL 加密连接。您还可以指定`allowSSL`或`preferSSL` 使用混合 TLS/SSL 模式。详情请见 [`net.ssl.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.mode)。 |
| [`net.ssl.PEMKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.PEMKeyFile) | 设置为`.pem`包含 TLS/SSL 证书和密钥的文件。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例将此文件呈现给其客户端以建立实例的身份。如果密钥已加密，请指定密码 ( [`net.ssl.PEMKeyPassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.PEMKeyPassword))。 |

**系统 SSL 证书存储(Windows/macOS)**

从 MongoDB 4.0 开始，您可以为 Windows 和 macOS 使用系统 SSL 证书存储。要使用系统 SSL 证书存储，请指定 [`net.ssl.certificateSelector`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.certificateSelector)而不是指定证书密钥文件。

| 环境                                                         | 笔记                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`net.ssl.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.mode) | 设置为`requireSSL`。此设置限制每个服务器仅使用 TLS/SSL 加密连接。您还可以指定`allowSSL`或`preferSSL` 使用混合 TLS/SSL 模式。详情请见 [`net.ssl.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.mode)。 |
| [`net.ssl.certificateSelector`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.certificateSelector) | 设置为属性（`subject`或 `thumbprint`）和值。此设置用于选择证书。详情请见 [`net.ssl.certificateSelector`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.certificateSelector)。 |

例如，考虑[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例的以下配置[文件](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)：

```yaml
net:
   ssl:
      mode: requireSSL
      PEMKeyFile: /etc/ssl/mongodb.pem
systemLog:
   destination: file
   path: "/var/log/mongodb/mongod.log"
   logAppend: true
storage:
   dbPath: "/var/lib/mongodb"
processManagement:
   fork: true
net:
   bindIp: localhost,mongodb0.example.net
   port: 27017
```

使用上述配置的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例只能使用 TLS/SSL 连接：

```shell
mongod --config <path/to/configuration/file>
```

也就是说，客户端必须指定 TLS/SSL 连接。有关使用 TLS/SSL 连接的更多信息，请参阅 [使用加密连接到 MongoDB 实例（`--ssl`选项）](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-ssl-client-connection-only)。

>[TIP]
>
>也可以看看：
>
>您还可以配置[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 使用命令行选项而不是配置文件：
>
>- 对于，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)请参见：; 和[。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslCertificateSelector)[`--sslMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslMode)[`--sslPEMKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslPEMKeyFile)[`--sslCertificateSelector`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslCertificateSelector)
>- 对于， [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)请参见：; 和 [。](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--sslCertificateSelector)[`--sslMode`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--sslMode)[`--sslPEMKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--sslPEMKeyFile)[`--sslCertificateSelector`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--sslCertificateSelector)

**设置`mongod`并`mongos`使用客户端证书验证**

以下部分配置 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)以使用 TLS/SSL 连接并执行客户端证书验证。使用这些 TLS/SSL 设置：

- [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)将其证书密钥文件提交给客户端进行验证。
- [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)需要来自客户端的证书密钥文件来验证客户端的身份。

要使用 TLS/SSL 连接，请在您的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例的 [配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)中包含以下 TLS/SSL 设置[：](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)

>[NOTE]
>
>从 MongoDB 4.0 开始，您可以为 Windows 和 macOS 使用系统 SSL 证书存储。要使用系统 SSL 证书存储，请指定 [`net.ssl.certificateSelector`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.certificateSelector)而不是指定证书密钥文件。



| 环境                                                         | 笔记                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`net.ssl.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.mode) | 设置为`requireSSL`。此设置限制每个服务器仅使用 TLS/SSL 加密连接。您还可以指定`allowSSL`或`preferSSL` 使用混合 TLS/SSL 模式。详情请见 [`net.ssl.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.mode)。 |
| [`net.ssl.PEMKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.PEMKeyFile) | 设置为`.pem`包含 TLS/SSL 证书和密钥的文件。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例将此文件呈现给其客户端以建立实例的身份。如果密钥已加密，请指定密码 ( [`net.ssl.PEMKeyPassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.PEMKeyPassword))。 |
| [`net.ssl.CAFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.CAFile) | 设置为包含用于验证客户端证书的证书链的文件的路径。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例使用此文件来验证其客户端提供的证书。证书链包括根证书颁发机构的证书。 |

例如，考虑实例的以下配置[文件](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

```yaml
net:
   ssl:
      mode: requireSSL
      PEMKeyFile: /etc/ssl/mongodb.pem
      CAFile: /etc/ssl/caToValidateClientCertificates.pem
systemLog:
   destination: file
   path: "/var/log/mongodb/mongod.log"
   logAppend: true
storage:
   dbPath: "/var/lib/mongodb"
processManagement:
   fork: true
net:
   bindIp: localhost,mongodb0.example.net
   port: 27017
```

使用上述配置的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例只能使用 TLS/SSL 连接，并且需要来自其客户端的有效证书：

```
mongod --config <path/to/configuration/file>
```

也就是说，客户端必须指定 TLS/SSL 连接并将其证书密钥文件提供给实例。有关使用 TLS/SSL 连接的更多信息，请参阅 [连接到需要客户端证书的 MongoDB 实例（`ssl`选项）](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-mongo-connect-require-client-certificates-ssl)。

>[TIP]
>
>也可以看看：
>
>您还可以配置[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用命令行选项而不是配置文件：
>
>- 对于[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，请参见[`--sslMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslMode)、 [`--sslPEMKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslPEMKeyFile)和 [`--sslCAFile`。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslCAFile)
>- 对于[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，请参见[`--sslMode`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--sslMode)、 [`--sslPEMKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--sslPEMKeyFile)和 [`--sslCAFile`。](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--sslCAFile)

**为客户端阻止已撤销的证书**

为了防止证书被吊销的客户端连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例，您可以使用：

- - 在线证书状态协议 (OCSP)

    从 4.4 版开始，为了检查证书吊销，MongoDB[`enables`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ocspEnabled)默认使用 OCSP（在线证书状态协议）作为指定 CRL 文件或使用[`system SSL certificate store`.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.certificateSelector)在 4.0 和 4.2 版本中，只能通过[`system certificate store`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.certificateSelector)在 Windows 或 macOS 上使用 OCSP 来使用。

- - 证书撤销列表 (CRL)

    要指定 CRL 文件，请将 include [`net.tls.CRLFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.CRLFile)设置为包含已撤销证书的文件。例如：

    ```yaml
    net:
      ssl:
        mode: requireSSL
        PEMKeyFile: /etc/ssl/mongodb.pem
        CAFile: /etc/ssl/caToValidateClientCertificates.pem
        CRLFile: /etc/ssl/revokedCertificates.pem
    ```

    出示 `/etc/ssl/revokedCertificates.pem` 中列出的证书的客户端将无法连接。

    >[TIP]
    >
    >也可以看看：您还可以使用命令行选项配置已撤销的证书列表。
    >
    >- 对于[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，见[`--sslCRLFile`。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslCRLFile)
    >- 对于[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，见[`--sslCRLFile`。](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--sslCRLFile)

**仅在客户端出示证书时验证**

在大多数情况下，确保客户端出示有效证书很重要。但是，如果您的客户端无法提供客户端证书或正在过渡到使用证书，您可能只想验证来自提供证书的客户端的证书。

要绕过不提供证书的客户端的客户端证书验证，请将 [`net.ssl.allowConnectionsWithoutCertificates`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.allowConnectionsWithoutCertificates)设为`true`.

例如：

```yaml
net:
  ssl:
    mode: requireSSL
    PEMKeyFile: /etc/ssl/mongodb.pem
    CAFile: /etc/ssl/caToValidateClientCertificates.pem
    allowConnectionsWithoutCertificates: true
```

A [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用这些设置运行允许连接来自：

- 不提供证书的客户端。
- 提供有效证书的客户端。

>[NOTE]
>
>如果客户端出示证书，则该证书必须是有效证书。
>
>所有连接，包括那些没有提供证书的连接，都使用 TLS/SSL 加密。

有关客户端TLS/SSL 连接的更多信息，请参阅[客户端的 TLS/SSL 配置。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-ssl-clients)

>[TIP]
>
>也可以看看：
>
>您还可以使用命令行选项进行配置：
>
>- 对于[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，见[`--sslAllowConnectionsWithoutCertificates`。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslAllowConnectionsWithoutCertificates)
>- 对于[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，见[`--sslAllowConnectionsWithoutCertificates`。](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--sslAllowConnectionsWithoutCertificates)

**禁止协议**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#disallow-protocols-1)

要防止 MongoDB 服务器接受使用特定协议的传入连接，[`net.ssl.disabledProtocols`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.disabledProtocols)请将其设置为不允许的协议。

例如，以下配置阻止 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)接受使用`TLS1_0`或的传入连接`TLS1_1`

```yaml
net:
  ssl:
    mode: requireSSL
    PEMKeyFile: /etc/ssl/mongodb.pem
    CAFile: /etc/ssl/caToValidateClientCertificates.pem
    disabledProtocols: TLS1_0,TLS1_1
```

>[TIP]
>
>也可以看看：
>
>您还可以使用命令行选项进行配置：
>
>- 对于[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，见[`--sslDisabledProtocols`。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslDisabledProtocols)
>- 对于[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，见[`--sslDisabledProtocols`。](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--sslDisabledProtocols)

**TLS/SSL 证书密码**

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)如果/的证书密钥文件 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)已加密，请将 include [`net.ssl.PEMKeyPassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.PEMKeyPassword)设置为密码。

>[TIP]
>
>也可以看看：
>
>您还可以使用命令行选项进行配置：
>
>- 对于[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，见[`--sslPEMKeyPassword`。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslPEMKeyPassword)
>- 对于[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，见[`--sslPEMKeyPassword`。](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--sslPEMKeyPassword)

**在 FIPS 模式下运行**

>[NOTE]
>
>FIPS 兼容的 TLS/SSL 仅在[MongoDB 企业版](http://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server). 有关详细信息，请参阅 [为 FIPS 配置 MongoDB 。](https://www.mongodb.com/docs/manual/tutorial/configure-fips/)

有关更多详细信息，请参阅[为 FIPS 配置 MongoDB 。](https://www.mongodb.com/docs/manual/tutorial/configure-fips/)

**下一步**

要为客户端配置 TLS/SSL 支持，请参阅客户端的 [TLS/SSL 配置。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/)

>[TIP]
>
>也可以看看：
>
>[使用 x.509 证书对客户端进行身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-x509-client-authentication/)

 参见

原文 - [Configure mongod and mongos for TLS/SSL]( https://docs.mongodb.com/manual/tutorial/configure-ssl/ )

译者：景圣