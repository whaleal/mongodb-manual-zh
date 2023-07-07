## 客户端的 TLS/SSL 配置

客户端必须支持 TLS/SSL 才能连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或者[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)的实例需要 [TLS/SSL 连接](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)[。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)

>[NOTE]
>
>- MongoDB的*Linux 64 位遗留 x64二进制文件***不**包括对 TLS/SSL 的支持。
>- 从 4.0 版开始，MongoDB在 TLS 1.1+ 可用的系统上禁用对 TLS 1.0 加密的支持。有关详细信息，请参阅[禁用 TLS 1.0 。](https://www.mongodb.com/docs/manual/release-notes/4.0/#std-label-4.0-disable-tls)

>[IMPORTANT]
>
>TLS/SSL、PKI（公钥基础设施）证书和证书颁发机构的完整描述超出了本文档的范围。此页面假定您事先了解 TLS/SSL 以及对有效证书的访问权限。

**`mongosh`配置（使用`tls`选项）**

>[NOTE]
>
>从 4.2 版本开始，MongoDB 提供`tls`了与选项相对应的`ssl`选项。这些`tls`选项提供 与选项**相同**的功能，`ssl`因为 MongoDB 一直支持 TLS 1.0 及更高版本。
>
>本节中的过程使用这些`tls`选项。有关使用其`ssl`别名的过程，请参见 [`mongosh`配置（使用`ssl`选项）。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-mongo-shell-ssl-connect)

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)提供各种 TLS/SSL 设置，包括：

| TLS 选项（4.2 中的新功能）                                   | 笔记                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`--tls`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tls) | 启用 TLS/SSL 连接。                                          |
| [`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateKeyFile) | 指定`.pem`包含的文件 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)要呈现给[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例的证书和密钥。此选项与 [`--tlsCertificateSelector`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateSelector)*在4.4版中更改*：[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)如果提供的 x.509 证书在主机系统时间`30` 的几天内过期，则在连接时记录警告。`mongod/mongos`有关详细信息，请参阅 [x.509 证书即将到期触发器警告](https://www.mongodb.com/docs/manual/release-notes/4.4/#std-label-4.4-rel-notes-certificate-expiration-warning)。 |
| [`--tlsCertificateKeyFilePassword`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateKeyFilePassword) | 如果[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)的证书密钥文件已加密。 |
| [`--tlsCAFile`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCAFile) | 指定用于验证实例提供的证书的证书颁发机构 (CA)`.pem`文件 。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) |
| [`--tlsCertificateSelector`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateSelector) | 如果在 Windows 或 macOS 上运行，请使用系统证书存储中的证书。( *4.0 版新功能*)此选项与 [`--tlsCertificateKeyFile`.](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateKeyFile)*在4.4版中更改*：[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)如果提供的 x.509 证书在主机系统时间`30` 的几天内过期，则在连接时记录警告。`mongod/mongos`有关详细信息，请参阅 [x.509 证书即将到期触发器警告](https://www.mongodb.com/docs/manual/release-notes/4.4/#std-label-4.4-rel-notes-certificate-expiration-warning)。 |

完整列表[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)的`tls` 选项，请参阅[mongosh-shell-tls 。](https://www.mongodb.com/docs/mongodb-shellmongosh-shell-tls/)

对于 TLS/SSL 连接，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)验证[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例提供的证书：

- [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)验证证书是否来自指定的证书颁发机构 ([`--tlsCAFile`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCAFile). 如果证书不是来自指定的 CA， [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)将无法连接。

- [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)验证主机名（在[`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host)选项或连接字符串) 与 或 提供的证书中的( 或者`SAN`，如果`SAN`不存在，则) 匹配。如果存在，`CN`[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)`SAN`[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 与 不匹配`CN`。`SAN`如果主机名与（或`CN`）不匹配，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)将无法连接。

  从MongoDB 4.2开始，在进行SAN比较时，MongoDB支持DNS名称或IP地址的比较。在之前的版本中，MongoDB 只支持 DNS 名称的比较。

  连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)对于需要 TLS/SSL 的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或 ，请指定[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)[`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host)选项或使用[连接字符串](https://www.mongodb.com/docs/manual/reference/connection-string/)指定主机名。`TLS/SSL`必须使用命令行选项指定所有其他选项。

**使用加密连接到 MongoDB 实例（`tls`选项）**

>[NOTE]
>
>该过程使用`tls`选项（从 MongoDB 4.2 开始可用）。有关使用其`ssl`别名的过程，请参见 [`mongosh`配置（使用`ssl`选项）。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-mongo-shell-ssl-connect)

要连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或者[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)的实例需要[加密通信](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#std-label-ssl-mongod-ssl-cert-key)，请启动[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)和：

- [`--tls`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tls)
- [`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host)和[`--tlsCAFile`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCAFile)验证服务器证书。

例如，考虑使用以下选项[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)运行的实例 ：`hostname.example.com`

```shell
mongod --tlsMode requireTLS --tlsCertificateKeyFile <pem>
```

要连接到实例，请启动[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)具有以下选项：

```shell
mongosh --tls --host hostname.example.com --tlsCAFile /etc/ssl/caToValidateServerCertificates.pem
```

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)根据指定的主机名和 CA 文件验证[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例提供的证书。

**连接到需要客户端证书的 MongoDB 实例（`tls`选项）**

>[NOTE]
>
>该过程使用`tls`选项（从 MongoDB 4.2 开始可用）。有关使用其`ssl`别名的过程，请参见 [`mongosh`配置（使用`ssl`选项）。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-mongo-shell-ssl-connect)



要连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)需要[CA 签名的客户端证书](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#std-label-ssl-mongod-ca-signed-ssl-cert-key)，请开始[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)和：

- [`--tls`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tls)
- [`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host)和[`--tlsCAFile`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCAFile)验证服务器证书，
- [`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateKeyFile)选项指定要呈现给服务器的客户端证书。

例如，考虑使用以下选项[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)运行的实例 ：`hostname.example.com`

```shell
mongod --tlsMode requireTLS --tlsCertificateKeyFile /etc/ssl/mongodb.pem --tlsCAFile /etc/ssl/caToValidateClientCertificates.pem
```

要连接到实例，请启动[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)具有以下选项：

```shell
mongosh --tls --host hostname.example.com --tlsCertificateKeyFile /etc/ssl/client.pem --tlsCAFile /etc/ssl/caToValidateServerCertificates.pem
```

**Windows 和 macOS**

要从系统证书库中指定客户端证书，请使用[`--tlsCertificateSelector`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateSelector)选项而不是 [`--tlsCertificateKeyFile`.](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateKeyFile)

如果 CA 文件也在系统证书存储中，则可以省略 [`--tlsCAFile`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCAFile)选项。

例如，如果具有`CN`(Common Name) 的 证书`myclient.example.net`和随附的 CA 文件都在 macOS 系统证书存储中，您可以这样连接：

```shell
mongosh --tls  --host hostname.example.com --tlsCertificateSelector subject="myclient.example.net"
```

[从 MongoDB 4.2 开始不推荐使用](https://www.mongodb.com/docs/manual/release-notes/4.2/#std-label-4.2-tls)这些选项[：](https://www.mongodb.com/docs/manual/release-notes/4.2/#std-label-4.2-tls)

- `--ssl`
- `--sslCAFile`
- `--sslPEMKeyFile`
- `--sslCertificateSelector`

中有可用的`mongosh`，但您应该改用`tls` 替代品。

**避免使用`--tlsAllowInvalidCertificates`选项**

>[WARNING]
>
>尽管可用，但请避免使用 [`--tlsAllowInvalidCertificates`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsAllowInvalidCertificates)如果可能的话。如果使用 [`--tlsAllowInvalidCertificates`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsAllowInvalidCertificates)是必要的，仅在无法入侵的系统上使用该选项。
>
>如果[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)运行与 [`--tlsAllowInvalidCertificates`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsAllowInvalidCertificates)选项，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 不会尝试验证服务器证书。这会导致过期[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)证书以及伪装成有效[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的外部进程的漏洞。如果您只需要禁用 TLS/SSL 证书中主机名的验证，请参阅 [`--tlsAllowInvalidHostnames`.](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsAllowInvalidHostnames)

`**mongosh`配置（使用`ssl`选项）**

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)提供各种 TLS/SSL 设置，包括：

| SSL 选项（在 4.2 中弃用）  | 笔记                                                         |
| :------------------------- | :----------------------------------------------------------- |
| `--ssl`                    | 启用 TLS/SSL 连接。                                          |
| `--sslPEMKeyFile`          | 指定`.pem`包含的文件 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)要呈现给[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例的证书和密钥。 |
| `--sslPEMKeyPassword`      | 如果[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)的证书密钥文件已加密。 |
| `--sslCAFile`              | 指定用于验证实例提供的证书的证书颁发机构 (CA)`.pem`文件 。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) |
| `--sslCertificateSelector` | 如果在 Windows 或 macOS 上运行，请使用系统证书存储中的证书。( *4.0 版新功能*) |

有关`ssl` 选项的完整列表，请参阅[SSL 选项。](https://www.mongodb.com/docs/mongodb-shellmongosh-ssl/)

对于 TLS/SSL 连接，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)验证[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例提供的证书：

- [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)验证证书是否来自指定的证书颁发机构`--sslCAFile`。如果证书不是来自指定的 CA，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 将无法连接。

- [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)验证主机名（在[`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host)选项或连接字符串) 与 或 提供的证书中的( 或者`SAN`，如果`SAN`不存在，则) 匹配。如果存在，`CN`[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)`SAN`[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 与 不匹配`CN`。`SAN`如果主机名与（或`CN`）不匹配，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)将无法连接。

  从MongoDB 4.2开始，在进行SAN比较时，MongoDB支持DNS名称或IP地址的比较。在之前的版本中，MongoDB 只支持 DNS 名称的比较。

  连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)对于需要 TLS/SSL 的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或 ，请指定[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)[`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host)选项或使用[连接字符串](https://www.mongodb.com/docs/manual/reference/connection-string/)指定主机名。`TLS/SSL`必须使用命令行选项指定所有其他选项。

**使用加密连接到 MongoDB 实例（`--ssl`选项）**

>[NOTE]
>
>该过程使用`ssl`选项。有关使用 `tls`别名的过程（从 MongoDB 4.2 开始可用），请参阅 [mongo-shell-tls 。](https://www.mongodb.com/docs/mongodb-shellmongo-shell-tls/)

要连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例需要[加密通信](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#std-label-ssl-mongod-ssl-cert-key)，请启动[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)和：

- `--ssl`
- [`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host)并`--sslCAFile`验证服务器证书。

例如，考虑使用以下选项[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)运行的实例 ：`hostname.example.com`

```shell
mongod --sslMode requireSSL --sslPEMKeyFile <pem>
```

要连接到实例，请启动[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)具有以下选项：

```shell
mongosh --ssl --host hostname.example.com --sslCAFile /etc/ssl/caToValidateServerCertificates.pem
```

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)根据指定的主机名和 CA 文件验证[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例提供的证书。

**连接到需要客户端证书的 MongoDB 实例（`ssl`选项）**

>[NOTE]
>
>该过程使用`ssl`选项。有关使用 `tls`别名的过程（从 MongoDB 4.2 开始可用），请参阅 [`mongosh`配置（使用`tls`选项）。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-mongo-shell-tls-connect)

要连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)需要[CA 签名的客户端证书](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#std-label-ssl-mongod-ca-signed-ssl-cert-key)，请开始[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)和：

- `--ssl`
- [`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host)和`--sslCAFile`验证服务器证书，
- `--sslPEMKeyFile`选项指定要呈现给服务器的客户端证书。

例如，考虑使用以下选项[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)运行的实例 ：`hostname.example.com`

```shell
mongod --sslMode requireSSL --sslPEMKeyFile /etc/ssl/mongodb.pem --sslCAFile /etc/ssl/ca.pem
```

要连接到实例，请启动[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)具有以下选项：

```shell
mongosh --ssl --host hostname.example.com --sslPEMKeyFile /etc/ssl/client.pem --sslCAFile /etc/ssl/ca.pem
```

**在 Windows 和 macOS 上**

您还可以使用该`--sslCertificateSelector`选项从系统证书存储区指定客户端证书，而不是使用 `--sslPEMKeyFile`. 如果 CA 文件也在系统证书存储中，则可以省略该`--sslCAFile`选项。

例如，要在 macOS 上使用系统证书存储中的`CN`（通用名称） 证书`myclient.example.net`和 CA 文件，请启动[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)具有以下选项：

```shell
mongosh --ssl  --host hostname.example.com --sslCertificateSelector subject=myclient.example.net
```

**避免使用`--sslAllowInvalidCertificates`选项**

>[WARNING]
>
>`--sslAllowInvalidCertificates`尽管可用，但请尽可能避免使用该 选项。如果 `--sslAllowInvalidCertificates`必须使用 ，请仅在无法入侵的系统上使用该选项。
>
>如果[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)（和别的 [MongoDB 工具](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-mongodb-tools-support-ssl)) 与 `--sslAllowInvalidCertificates`选项一起运行， [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)（和别的 [MongoDB 工具](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-mongodb-tools-support-ssl)) 不会尝试验证服务器证书。这会导致过期 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)证书以及伪装成有效 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例的外部进程的漏洞。如果您只需要禁用 TLS/SSL 证书中主机名的验证，请参阅`--sslAllowInvalidHostnames`。

**MongoDB Atlas , MongoDB Cloud Manager和 MongoDB Ops Manager**

MongoDB Atlas使用 TLS/SSL 来加密与数据库的连接。

MongoDB Cloud Manager和 Ops Manager Monitoring 代理使用加密通信来收集其统计信息。因为代理已经加密了与MongoDB Cloud Manager /Ops Manager 服务器的通信，所以这只是在每个主机的基础上在MongoDB Cloud Manager /Ops Manager 中启用 TLS/SSL 支持的问题。

有关详细信息，请参阅：

- [MongoDB 地图集文档](https://docs.atlas.mongodb.com/setup-cluster-security/)
- [MongoDB 云管理器文档](https://www.mongodb.com/docs/cloud-manager/)
- [MongoDB Ops 管理器文档。](https://www.mongodb.com/docs/ops-manager/current/)

**MongoDB 驱动程序**

MongoDB 驱动程序支持加密通信。看：

- [C Driver](http://api.mongodb.org/c/current/advanced-connections.html)
- [C++ Driver](https://mongodb.github.io/mongo-cxx-driver/)
- [C# Driver](http://mongodb.github.io/mongo-csharp-driver/2.0/reference/driver/ssl/)
- [Java Driver](http://mongodb.github.io/mongo-java-driver/3.0/driver/reference/connecting/ssl/)
- [Node.js Driver](http://mongodb.github.io/node-mongodb-native/3.1/tutorials/connect/ssl/)
- [Perl Driver](https://metacpan.org/pod/MongoDB::MongoClient#ssl)
- [PHP Driver](https://php.net/manual/en/mongodb-driver-manager.construct.php)
- [Python Driver](https://pymongo.readthedocs.io/en/stable/examples/tls.html)
- [Ruby Driver](https://www.mongodb.com/docs/ruby-driver/v2.2/#mongodb-x509-mechanism)
- [Scala Driver](http://mongodb.github.io/mongo-scala-driver/1.1/reference/connecting/ssl/)

**MongoDB 工具**

各种 MongoDB 实用程序支持加密通信。这些工具包括：

- [`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)
- [`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)
- [`mongofiles`](https://www.mongodb.com/docs/database-tools/mongofiles/#mongodb-binary-bin.mongofiles)
- [`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)
- [`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)
- [`mongostat`](https://www.mongodb.com/docs/database-tools/mongostat/#mongodb-binary-bin.mongostat)
- [`mongotop`](https://www.mongodb.com/docs/database-tools/mongotop/#mongodb-binary-bin.mongotop)

要使用这些工具进行加密通信，请使用`ssl`与 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh). 看[`mongosh`配置（使用`ssl`选项）。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-mongo-shell-ssl-connect)

>[TIP]
>
>也可以看看：
>
>[为 TLS/SSL配置`mongod`和`mongos`](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)

 参见

原文 - [TLS/SSL Configuration for Clients]( https://docs.mongodb.com/manual/tutorial/configure-ssl-clients/ )

译者：景圣

