

# TLS/SSL（传输加密）

## 传输安全协议/SSL

MongoDB 支持 TLS/SSL（传输层安全/安全套接字层）来加密 MongoDB 的所有网络流量。TLS/SSL 确保 MongoDB 网络流量只能由预期的客户端读取。

### TLS 版本

MongoDB在 TLS 1.1+ 可用的系统上禁用对 TLS 1.0 加密的支持。有关详细信息，请参阅[禁用 TLS 1.0 。](https://www.mongodb.com/docs/manual/release-notes/4.0/#std-label-4.0-disable-tls)

### TLS 库

MongoDB 使用本机 TLS/SSL 操作系统库：

| 平台      | TLS/SSL库                 |
| :-------- | :------------------------ |
| Windows   | Secure Channel (Schannel) |
| Linux/BSD | OpenSSL                   |
| macOS     | Secure Transport          |

## TLS/SSL 密码

MongoDB 的 TLS/SSL 加密只允许对所有连接使用至少 128 位密钥长度的强 TLS/SSL 密码。

### 前向保密

前向保密密码套件创建一个临时会话密钥，该密钥受服务器私钥保护但永远不会传输。使用临时密钥可确保即使服务器的私钥泄露，您也无法使用泄露的密钥解密过去的会话。

MongoDB支持使用Ephemeral Diffie-Hellman（DHE）和Ephemeral Elliptic Curve Diffie-Hellman（ECDHE）算法的前向保密密码套件。

#### Ephemeral Elliptic Curve Diffie-Hellman (ECDHE)

| 平台    | 支持级别                                                     |
| :------ | :----------------------------------------------------------- |
| Linux   | *从版本 4.2 开始* 如果 Linux 平台的 OpenSSL 支持自动选择曲线，则 MongoDB 启用对 Ephemeral Elliptic Curve Diffie-Hellman (ECDHE) 的支持。否则，如果 Linux 平台的 OpenSSL 不支持自动曲线选择，MongoDB 会尝试使用`prime256v1`命名曲线启用 ECDHE 支持。*从 3.6.14 和 4.0.3 开始*如果在编译期间 Linux 平台的 OpenSSL 支持自动曲线选择，则 MongoDB 启用对临时椭圆曲线 Diffie-Hellman (ECDHE) 的支持。 笔记: 如果启用了对 ECDHE 的支持，MongoDB 4.2+ 会尝试启用对[Ephemeral Diffie-Hellman (DHE)](https://www.mongodb.com/docs/manual/core/security-transport-encryption/#std-label-dhe)如果[Ephemeral Diffie-Hellman (DHE)](https://www.mongodb.com/docs/manual/core/security-transport-encryption/#std-label-dhe) 未明确启用。看[Ephemeral Diffie-Hellman (DHE)](https://www.mongodb.com/docs/manual/core/security-transport-encryption/#std-label-dhe) 了解详情。 |
| Windows | 从版本4.0开始，Ephemeral Elliptic Curve Diffie-Hellman（ECDHE）通过使用安全通道（Scannean）（原生Windows TLS/SSL库）隐式支持。 |
| macOS   | 从4.0版本开始，Ephemeral Elliptic Curve Diffie-Hellman（ECDHE）通过使用Secure Transport（原生macOS TLS/SSL库）隐式支持。 |

ECDHE 密码套件比静态 RSA 密码套件慢。为了使用 ECDHE 获得更好的性能，您可以使用使用椭圆曲线数字签名算法 ( `ECDSA`) 的证书。也可以看看 [前向保密性能](https://www.mongodb.com/docs/manual/core/security-transport-encryption/#std-label-forward-secrecy-performance)了解更多信息

#### Ephemeral Diffie-Hellman (DHE)

| 平台    | 支持级别                                                     |
| :------ | :----------------------------------------------------------- |
| Linux   | *从版本 4.2 开始*：MongoDB 启用对 Ephemeral Diffie-Hellman (DHE) 的支持：如果[`opensslDiffieHellmanParameters`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.opensslDiffieHellmanParameters)在启动时设置（无论是否[ECDHE](https://www.mongodb.com/docs/manual/core/security-transport-encryption/#std-label-ecdhe)启用或禁用）。否则，如果[`opensslDiffieHellmanParameters`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.opensslDiffieHellmanParameters) 参数未设置但如果[ECDHE](https://www.mongodb.com/docs/manual/core/security-transport-encryption/#std-label-ecdhe)已启用，MongoDB 使用`ffdhe3072`参数启用 DHE，如中所定义[RFC-7919#appendix-A.2 。](https://tools.ietf.org/html/7919#appendix-A.2)*对于版本 3.6 和 4.0*，MongoDB 启用了对 Ephemeral Diffie-Hellman (DHE) 的支持：如果[`opensslDiffieHellmanParameters`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.opensslDiffieHellmanParameters)在启动时设置。 |
| Windows | 从4.0版本开始，通过使用安全通道（Scannean）（原生Windows TLS/SSL库）隐式支持Ephemeral Diffie-Hellman（DHE）。 |
| macOS   | 从4.0版开始，通过使用本机macOS TLS/SSL库Secure Transport隐式支持Ephemeral Diffie-Hellman（DHE）。 |

> 笔记:
> 如果客户端与 DHE 协商密码套件但不能接受服务器选择的参数，则 TLS 连接失败。
>
> 除非从 Oracle 购买了扩展支持，否则 Java 6 和 7 不支持强参数（即大小大于 1024）。但是，Java 7 支持并更喜欢 ECDHE，因此如果可用，将协商 ECDHE。

DHE（和 ECDHE）密码套件的性能低于静态 RSA 密码套件，其中 DHE 明显低于 ECDHE。看 [前向保密性能](https://www.mongodb.com/docs/manual/core/security-transport-encryption/#std-label-forward-secrecy-performance)了解更多信息。

#### 前向保密性能

DHE 和 ECDHE 密码套件比静态 RSA 密码套件慢，其中 DHE 比 ECDHE 慢得多。

为了使用 ECDHE 获得更好的性能，您可以使用使用Elliptic Curve Digital Signature Algorithm (`ECDSA`) 的证书。[`opensslCipherConfig`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.opensslCipherConfig)或者，您可以使用以下示例中的参数禁用 ECDHE 密码套件 （也禁用 DHE）

```
mongod --setParameter opensslCipherConfig='HIGH:!EXPORT:!aNULL:!kECDHE:!ECDHE:!DHE:!kDHE@STRENGTH'
```

如果由于性能原因需要禁用对 DHE 密码套件的支持，可以使用该[`opensslCipherConfig`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.opensslCipherConfig) 参数，如下例所示：

```
mongod --setParameter opensslCipherConfig='HIGH:!EXPORT:!aNULL:!DHE:!kDHE@STRENGTH'
```

## 证书

要将 TLS/SSL 与 MongoDB 一起使用，您必须将 TLS/SSL 证书作为 `PEM`文件，它们是串联的证书容器。

MongoDB 可以使用证书颁发机构颁发的任何有效 TLS/SSL 证书或自签名证书。对于生产用途，您的 MongoDB 部署应使用由同一证书颁发机构生成和签名的有效证书。您可以生成和维护独立的证书颁发机构，或使用第三方 TLS/SSL 供应商生成的证书。

使用由受信任的证书颁发机构签名的证书允许 MongoDB 驱动程序验证服务器的身份。

例如，请参阅[客户端的 TLS/SSL 配置。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/)

### 证书到期警告

*在4.4版中更改*：[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/如果提供的 x.509 证书在主机系统时间 的几天[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)内过期，则在连接时记录警告。有关详细信息，请参阅 [x.509 证书即将到期触发器警告](https://www.mongodb.com/docs/manual/release-notes/4.4/#std-label-4.4-rel-notes-certificate-expiration-warning)。`30``mongod/mongos`

### OCSP（在线证书状态协议）

从 4.4 版开始，为了检查证书吊销，MongoDB [`enables`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ocspEnabled)默认使用 OCSP（在线证书状态协议）。[`Certificate Revocation List (CRL)`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.CRLFile)OCSP 的使用消除了定期下载并 使用更新的 CRL重新启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/的需要。[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

在 4.0 和 4.2 版本中，只能通过在 Windows 或 macOS 上使用 OCSP 来使用[`system certificate store`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateSelector)。

作为其 OCSP 支持的一部分，MongoDB 4.4+ 在 Linux 上支持以下内容：

* [OCSP stapling](https://tools.ietf.org/html/rfc6961). 通过 OCSP stapling，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)在 TLS/SSL 握手期间向客户端提供这些证书时，将 OCSP 状态响应附加或“stapling”到它们的证书。通过将 OCSP 状态响应包含在证书中，OCSP stapling避免了客户端单独请求检索所提供证书的 OCSP 状态的需要。
* [OCSP must-staple 扩展](https://tools.ietf.org/html/rfc7633). OCSP must-staple 是一个可以添加到服务器证书的扩展，它告诉客户端在 TLS/SSL 握手期间收到证书时期望 OCSP staple。

MongoDB 还提供了以下与 OCSP 相关的参数：

| 范围                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`ocspEnabled`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ocspEnabled) | 启用或禁用 OCSP 支持。                                       |
| [`ocspValidationRefreshPeriodSecs`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ocspValidationRefreshPeriodSecs) | 指定在刷新装订的 OCSP 状态响应之前等待的秒数。               |
| [`tlsOCSPStaplingTimeoutSecs`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.tlsOCSPStaplingTimeoutSecs) | [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)指定/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例应等待接收其证书的 OCSP 状态响应的最大秒数 。 |
| [`tlsOCSPVerifyTimeoutSecs`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.tlsOCSPVerifyTimeoutSecs) | [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)指定验证客户端证书时/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)应等待 OCSP 响应的最大秒数 。 |

[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter)您可以在启动时使用配置文件设置或 命令行选项设置这些参数 [`--setParameter`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--setParameter)。

>  笔记:
>
> 从 MongoDB 5.0 开始，该[`rotateCertificates`](https://www.mongodb.com/docs/manual/reference/command/rotateCertificates/#mongodb-dbcommand-dbcmd.rotateCertificates)命令和[`db.rotateCertificates()`](https://www.mongodb.com/docs/manual/reference/method/db.rotateCertificates/#mongodb-method-db.rotateCertificates)方法还将刷新任何装订的 OCSP 响应。

## 身份验证

除了加密连接之外，TLS/SSL 还允许使用证书进行身份验证，用于[客户端身份验证](https://www.mongodb.com/docs/manual/core/authentication/)以及副本集和分片集群成员的[内部身份验证。](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)

有关详细信息，请参阅：

- [为 TLS/SSL配置`mongod`和`mongos`](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)
- [客户端的 TLS/SSL 配置](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/)
- [使用 x.509 证书对客户端进行身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-x509-client-authentication/)
- [使用 x.509 证书进行成员身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/)

## FIPS 模式

> 笔记:
>
> **企业特证**
>
> 仅在 MongoDB Enterprise 中可用。

联邦信息处理标准 (FIPS) 是美国政府的计算机安全标准，用于认证安全加密和解密数据的软件模块和库。您可以将 MongoDB 配置为与 FIPS 140-2 认证的 OpenSSL 库一起运行。将 FIPS 配置为默认运行或根据需要从命令行运行。

有关示例，请参阅[为 FIPS 配置 MongoDB 。](https://www.mongodb.com/docs/manual/tutorial/configure-fips/)









译者：韩鹏帅

原文：[TLS/SSL (Transport Encryption)](https://www.mongodb.com/docs/manual/core/security-transport-encryption/)