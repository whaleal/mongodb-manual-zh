## 为 FIPS 配置 MongoDB

**概述**

联邦信息处理标准 (FIPS) 是美国政府的计算机安全标准，用于认证安全加密和解密数据的软件模块和库。您可以将 MongoDB 配置为与 FIPS 140-2 认证的 OpenSSL 库一起运行。将 FIPS 配置为默认运行或根据需要从命令行运行。

FIPS 和 TLS/SSL 的完整描述超出了本文档的范围。本教程假设您事先了解 FIPS 和 TLS/SSL。

>[IMPORTANT]
>
>**MongoDB 和 FIPS**
>
>FIPS 是加密系统的属性，而不是访问控制系统的属性。但是，如果您的环境需要符合 FIPS 的加密 *和*访问控制，则必须确保访问控制系统仅使用符合 FIPS 的加密。
>
>MongoDB 的 FIPS 支持涵盖了 MongoDB 使用 SSL/TLS 库进行网络加密、SCRAM 身份验证和 x.509 身份验证的方式。如果您使用 Kerberos 或 LDAP 身份验证，则必须确保这些外部机制符合 FIPS。

>[NOTE]
>
>从 4.0 版开始，MongoDB在 TLS 1.1+ 可用的系统上禁用对 TLS 1.0 加密的支持。有关详细信息，请参阅[禁用 TLS 1.0 。](https://www.mongodb.com/docs/manual/release-notes/4.0/#std-label-4.0-disable-tls)

**平台支持**

FIPS 模式仅适用于[MongoDB 企业版](http://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server)版。请参阅 [安装 MongoDB Enterprise](https://www.mongodb.com/docs/manual/administration/install-enterprise/)下载并安装 [MongoDB 企业版。](http://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server)

以下平台支持 FIPS 模式：

| 平台     | TLS/SSL 库           |
| :------- | :------------------- |
| Linux    | 打开SSL              |
| 视窗     | 安全通道（SChannel） |
| 苹果系统 | 安全运输             |

**配置 FIPS**

为您的平台选择下面的选项卡：

**Linux**

**先决条件**

您的 Linux 系统必须具有配置有 FIPS 140-2 模块的 OpenSSL 库，以便支持 MongoDB 的 FIPS 模式。

- 通过运行以下命令验证您的 OpenSSL 软件是否包括 FIPS 支持：

  ```shell
  openssl version
  ```

- 对于 Red Hat Enterprise Linux 6.x (RHEL 6.x) 或其衍生版本，例如 CentOS 6.x，OpenSSL 工具包必须至少 `openssl-1.0.1e-16.el6_5`是使用 FIPS 模式的版本。要在这些平台上升级 OpenSSL 库，请运行以下命令：

  ```shell
  sudo yum update openssl
  ```

- 某些版本的 Linux 会定期执行一个过程，以使用预先分配的地址预先链接动态库。此过程会修改 OpenSSL 库，特别是`libcrypto`. OpenSSL FIPS 模式随后将无法通过启动时执行的签名检查，以确保`libcrypto`自编译以来未被修改。

  要将 Linux 预链接进程配置为不预链接`libcrypto`，请运行以下命令：

  ```shell
  sudo bash -c "echo '-b /usr/lib64/libcrypto.so.*' >>/etc/prelink.conf.d/openssl-prelink.conf"
  ```

将 Linux 系统配置为支持符合 FIPS 的操作后，请按照以下步骤将您的实例配置 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)为[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)在 FIPS 模式下运行。

**Windows系统**

**先决条件**

Microsoft 提供了以下有关为 Windows 10 和 Windows Server 2016 或更高版本配置 FIPS 模式的资源：

➤ [Windows 上的 FIPS 140-2 验证](https://docs.microsoft.com/en-us/windows/security/threat-protection/fips-140-validation)

将 Windows 系统配置为支持符合 FIPS 的操作后，请按照以下步骤将您的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例配置为在 FIPS 模式下运行。

**macOS**

**先决条件**

默认情况下，受支持的 macOS 版本符合 FIPS。查看适用于您的 macOS 版本的文档以验证其合规性状态。例如，Apple 为 macOS 10.14 提供了以下资源：

➤ [适用于 10.14 的 Apple FIPS 加密模块](https://support.apple.com/en-us/HT209638)

在兼容版本的 macOS 上，按照以下步骤将您的实例配置 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)为[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)在 FIPS 模式下运行。

**程序**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-fips/#procedure)

**A. 配置 MongoDB 以使用 TLS/SSL**

有关[配置`mongod``mongos`](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)部署以使用 TLS/ [SSL 的详细信息，请参阅为 TLS/SSL配置](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)[和配置。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)确保您的证书符合 FIPS 标准。

**B. 以 FIPS 模式运行 MongoDB 实例**

[在为 TLS/SSL](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)[配置](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)[和](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)后执行这些步骤[。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)[`mongod``mongos`](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)

1. 更改配置文件。

   要将您的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例配置为使用 FIPS 模式，请关闭实例并使用以下[`net.tls.FIPSMode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.FIPSMode)设置更新配置文件：

   **在 MongoDB 4.2+ 中：**

   ```yaml
   net:
      tls:
         FIPSMode: true
   ```

   尽管仍然可用，但[自 MongoDB 4.2](https://www.mongodb.com/docs/manual/release-notes/4.2/#std-label-4.2-tls)起[`net.ssl.FIPSMode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.FIPSMode)已 弃用[。](https://www.mongodb.com/docs/manual/release-notes/4.2/#std-label-4.2-tls)

   **在 MongoDB 4.0 及更早版本中：**

   ```yaml
   net:
      ssl:
         FIPSMode: true
   ```

2. 使用配置文件启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或实例化。[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

   例如，运行此命令以 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)使用其配置文件启动实例：

   ```shell
   mongod --config /etc/mongod.conf
   ```

**C. 确认 FIPS 模式正在运行**

检查服务器日志文件中是否有一条消息表明 FIPS 处于活动状态：

```shell
FIPS 140-2 mode activated
```

**其他注意事项**

**SCRAM SHA 和 FIPS 模式**

从 MongoDB 5.1 开始，实例运行在 [FIPS模式](https://www.mongodb.com/docs/manual/tutorial/configure-fips/#std-label-fips-overview)默认禁用 [SCRAM-SHA-1 身份验证机制](https://www.mongodb.com/docs/manual/reference/parameters/#std-label-authentication-parameters) 。您可以使用 [setParameter.authenticationMechanisms](https://www.mongodb.com/docs/manual/reference/parameters/#std-label-set-parameter-authenticationMechanisms-code)命令启用[SCRAM-SHA-1 身份验证机制。](https://www.mongodb.com/docs/manual/reference/parameters/#std-label-authentication-parameters)

此更改不会影响以 MongoDB [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)4.0+ 为目标的驱动程序。

如果您使用[SCRAM-SHA-1 ：](https://www.mongodb.com/docs/manual/reference/parameters/#std-label-authentication-parameters)

- [md5](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-md5)是必需的，但不用于加密目的，并且
- 如果你使用[FIPS模式](https://www.mongodb.com/docs/manual/tutorial/configure-fips/#std-label-fips-overview)，然后使用 [SCRAM-SHA-1](https://www.mongodb.com/docs/manual/reference/parameters/#std-label-authentication-parameters)代替：
  - [SCRAM-SHA-256,](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram)
  - [Kerberos,](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-security-kerberos)
  - [LDAP](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-security-ldap), or
  - [x.509](https://www.mongodb.com/docs/manual/core/security-x.509/#std-label-security-auth-x509)

**数据库工具和 FIPS 模式**

从 MongoDB 4.2 开始，以下程序不再支持该 [`--sslFIPSMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslFIPSMode)选项：

- [`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)
- [`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)
- [`mongofiles`](https://www.mongodb.com/docs/database-tools/mongofiles/#mongodb-binary-bin.mongofiles)
- [`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)
- [`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)
- [`mongostat`](https://www.mongodb.com/docs/database-tools/mongostat/#mongodb-binary-bin.mongostat)
- [`mongotop`](https://www.mongodb.com/docs/database-tools/mongotop/#mongodb-binary-bin.mongotop)

**`mongod`, `mongos`, 和 FIPS 模式**

如果您配置[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)并[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用 FIPS 模式，`mongod`并`mongos`使用符合 FIPS 的连接。

**MongoDB Shell 和 FIPS 模式**

默认值[`MongoDB Shell`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)分配：

- 包含 OpenSSL 1.1。
- 如果您配置[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和 使用 FIPS 模式，则使用符合 FIPS 的连接。[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)`mongod``mongos`

MongoDB 还提供了一个 MongoDB Shell 发行版，可以使用：

- 服务器上安装了 OpenSSL 1.1 和 OpenSSL 3。
- `--tlsFIPSMode`选项，启用`mongosh`FIPS 模式。

>[TIP]
>
>也可以看看：
>
>- 要下载包含 OpenSSL 1.1 和 OpenSSL 3 的 MongoDB Shell 发行版，请转到[MongoDB 下载中心。](https://www.mongodb.com/try/download/shell?jmp=docs)
>- [安装mongosh](https://www.mongodb.com/docs/mongodb-shell/install/#std-label-mdb-shell-install)

 参见

原文 - [Configure MongoDB for FIPS]( https://docs.mongodb.com/manual/tutorial/configure-fips/ )

译者：景圣