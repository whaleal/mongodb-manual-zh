# 选项

使用以下选项来控制 MongoDB Shell连接和行为的各个方面。

## 常规选项

- `--build-info`

  返回一个 JSON 格式的文档，其中包含有关 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)构建的信息。

- **--eval <javascript>**

  评估 JavaScript 表达式。您可以使用单个`--eval` 参数或`--eval`同时使用多个参数。

  `mongosh`评估参数后`--eval`，它将结果打印到您的命令行。如果使用多条`--eval` 语句，`mongosh`只打印最后一条的结果 `--eval`。

  **示例：格式化输出**

  要获得适合自动解析的输出，请使用 `EJSON.stringify()`.

  ```
  mongosh --quiet  --host rs0/centos1104 --port 27500 \
          --eval "EJSON.stringify(rs.status().members.map( \
            m => ({'id':m._id, 'name':m.name, 'stateStr':m.stateStr})));" \
  | jq
  ```

  用 解析后`jq`，输出类似于：

  ```
  [
    {
       "id": 0,
       "name": "centos1104:27500",
       "stateStr": "PRIMARY"
    },
    {
       "id": 1,
       "name": "centos1104:27502",
       "stateStr": "SECONDARY"
    },
    {
       "id": 2,
       "name": "centos1104:27503",
       "stateStr": "SECONDARY"
    }
  ]
  
  ```

  > 笔记
  >
  > `EJSON`内置了格式选项，可以消除对像`jq`. 例如，以下代码生成格式与上述相同的输出。
  >
  > ```
  > mongosh --quiet  --host rs0/centos1104 --port 27500 \
  >         --eval "EJSON.stringify( rs.status().members.map( \
  >           ({ _id, name, stateStr }) => ({ _id, name, stateStr })), null, 2);"
  > ```

**示例：多个 ``--eval`` 参数**

要获取 中的集合列表`moviesDatabase`，请使用多个 `--eval`语句：

```
mongosh --quiet \
        --eval 'use moviesDatabase' \
        --eval 'show collections' \
        mongodb://localhost/
```

`--help, -h`返回有关MongoDB Shell的选项和使用的信息。

`--nodb`

防止 shell 连接到任何数据库实例。

`--norc`

防止 shell`~/.mongoshrc.js` 在启动时进行采购和评估。

`--quiet`

跳过启动期间的所有消息（例如欢迎消息和启动警告）并直接转到提示符。

`--shell`

启用外壳接口。如果你调用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-program-mongosh) 命令并指定一个 JavaScript 文件作为参数，或者使用 [`--eval`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--eval)要在命令行上指定 JavaScript，[`--shell`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--shell)选项在文件完成执行后为用户提供 shell 提示。

`--verbose`

在连接过程中和运行命令时增加 shell 输出的详细程度。

`--version`

返回MongoDB Shell版本号。

## 稳定的 API 选项

`--apiVersion <version number>`

指定[api版本](https://www.mongodb.com/docs/manual/reference/stable-api/#std-label-api-version-desc). `"1"`是目前唯一支持的值。

`--apiStrict`

指定服务器将响应[API严格错误](https://www.mongodb.com/docs/manual/reference/stable-api/#std-label-api-strict-resp)如果您的应用程序使用外部的命令或行为[稳定的 API 。](https://www.mongodb.com/docs/manual/reference/stable-api/#std-label-stable-api)如果您指定[`--apiStrict`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--apiStrict)，您还必须指定 [`--apiVersion`.](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--apiVersion)

`--apiDeprecationErrors`

指定服务器将响应[API弃用错误](https://www.mongodb.com/docs/manual/reference/stable-api/#std-label-api-deprecation-resp)如果您的应用程序使用在指定的`apiVersion`.如果您指定[`--apiDeprecationErrors`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--apiDeprecationErrors)，您还必须指定[`--apiVersion`.](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--apiVersion)

## 连接选项

`--host <hostname>`

指定主机名 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或者[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)在跑。如果未指定，MongoDB Shell会尝试连接到在本地主机上运行的 MongoDB 进程。

- 要连接到副本集，

  指定[`replica set name`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName) 和集合成员的种子列表。使用以下表格：`<replSetName>/<hostname1><:port>,<hostname2><:port>,<...>`

- 对于 TLS/SSL 连接 ( [`--tls`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tls))，

  MongoDB Shell shell 验证主机名（在[`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host)选项或连接字符串）匹配`SAN`（或者，如果`SAN`不存在，则`CN`匹配） [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或者[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos). 如果`SAN`存在，则MongoDB Shell与`CN`. `SAN`如果主机名与（或）不匹配`CN`， MongoDB Shell shell 将无法连接。

为了[DNS 种子列表连接](https://www.mongodb.com/docs/manual/reference/connection-string/#dns-seedlist-connection-format/)

将连接协议指定为`mongodb+srv`，后跟 DNS SRV 主机名记录和任何选项。和选项（如果包含在连接字符串中）会覆盖 TXT 记录中设置的任何相应的 DNS 配置选项`authSource` 。`replicaSet`使用`mongodb+srv:`连接字符串隐式为客户端连接启用TLS / SSL（通常设置为）。可以通过在查询字符串中设置来关闭TLS`tls=true`选项。`tls=false`

>例子:
>
>```
>mongodb+srv://server.example.com/?connectionTimeout=3000ms
>```

`--port <port>`

指定端口[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或者 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例在听。如果 [`--port`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--port)未指定，MongoDB Shell尝试连接到端口`27017`。

### TLS 选项

- `--tls`

  启用连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或者 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)启用了TLS / SSL支持。要了解有关 TLS/SSL 和 MongoDB 的更多信息，请参阅：[为 TLS/SSL 配置 mongod 和 mongos](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)[客户端的 TLS/SSL 配置](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/)

- `--tlsCertificateKeyFile <filename>`

  指定`.pem`包含TLS / SSL 证书和密钥的文件`mongosh`。使用相对或绝对路径指定文件的文件名`.pem`。使用时需要此选项[`--tls`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tls)选项连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或者[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)需要的实例[客户证书](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-mongo-connect-require-client-certificates-tls). 也就是说， MongoDB Shell将此证书提供给服务器。

  > 笔记:
  >
  > 从 4.4 版开始，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)`30`如果提供的 x.509 证书在主机系统时间的几天 内过期，则会在连接时记录警告`mongod/mongos`。

  要了解有关 TLS/SSL 和 MongoDB 的更多信息，请参阅:

  - [为 TLS/SSL 配置 mongod 和 mongos](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)
  - [客户端的 TLS/SSL 配置](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/)

**--tlsCertificateKeyFilePassword <value>**

指定用于解密证书密钥文件的密码（即 [`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateKeyFile)).

使用 [`--tlsCertificateKeyFilePassword`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateKeyFilePassword)仅当证书密钥文件已加密时才使用该选项。在所有情况下，MongoDB Shell 都会从所有日志记录和报告输出中编辑密码。

如果PEM文件中的私钥是加密的，而你没有指定 [`--tlsCertificateKeyFilePassword`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateKeyFilePassword)选项; MongoDB Shell提示输入密码。

看[TLS/SSL 证书密码。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#std-label-ssl-certificate-password)

要了解有关 TLS/SSL 和 MongoDB 的更多信息，请参阅：

- [为 TLS/SSL 配置 mongod 和 mongos](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)
- [客户端的 TLS/SSL 配置](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/)

`--tlsCAFile <filename>`

指定`.pem`包含证书颁发机构的根证书链的文件。该文件用于验证由 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例。

使用相对或绝对路径指定文件的文件名`.pem`。

要了解有关 TLS/SSL 和 MongoDB 的更多信息，请参阅：

- [为 TLS/SSL 配置 mongod 和 mongos](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)
- [客户端的 TLS/SSL 配置](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/)

`--tlsCRLFile <filename>`

指定`.pem`包含证书吊销列表的文件。使用相对或绝对路径指定文件的文件名`.pem`。要了解有关 TLS/SSL 和 MongoDB 的更多信息，请参阅：[为 TLS/SSL 配置 mongod 和 mongos](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)[客户端的 TLS/SSL 配置](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/)

`--tlsAllowInvalidHostnames`

禁用验证证书中的主机名[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例。即使服务器证书中的主机名与服务器的主机不匹配，也允许MongoDB Shell连接到 MongoDB 实例。要了解有关 TLS/SSL 和 MongoDB 的更多信息，请参阅：[为 TLS/SSL 配置 mongod 和 mongos](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)[客户端的 TLS/SSL 配置](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/)

`--tlsAllowInvalidCertificates`

*4.2版中的新功能*。

绕过对提供的证书的验证检查 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例并允许连接到提供无效证书的服务器

> 笔记:
>
> 从 MongoDB 4.0 开始，如果您指定 [`--tlsAllowInvalidCertificates`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsAllowInvalidCertificates)使用 x.509 身份验证时，无效证书仅足以建立TLS / SSL连接，但*不足以*进行身份验证。

>告警:
>
>尽管可用，但请避免使用 [`--tlsAllowInvalidCertificates`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsAllowInvalidCertificates)如果可能的话。如果使用[`--tlsAllowInvalidCertificates`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsAllowInvalidCertificates)是必要的，仅在无法入侵的系统上使用该选项。
>
>如果MongoDB Shell shell（和其他 [MongoDB 工具](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-mongodb-tools-support-ssl)) 与运行 [`--tlsAllowInvalidCertificates`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsAllowInvalidCertificates)选项，外壳（和其他[MongoDB 工具](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-mongodb-tools-support-ssl)) 不要尝试验证服务器证书。这会导致过期漏洞 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)证书以及伪装成有效的外国流程[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或者[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例。如果您只需要禁用TLS / SSL证书中主机名的验证，请参阅 [`--tlsAllowInvalidHostnames`.](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsAllowInvalidHostnames)

要了解有关 TLS/SSL 和 MongoDB 的更多信息，请参阅：

- [为 TLS/SSL 配置 mongod 和 mongos](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)
- [客户端的 TLS/SSL 配置](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/)

**--tlsCertificateSelector <parameter>=<value>**

​	在 Windows 和 macOS 上可用，作为替代 [`--tlsCertificateKeyFile`.](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateKeyFile)

> 重要的:
>
> **Windows 和导入私钥**
>
> 导入私钥时，必须将其标记为可导出。默认情况下， Windows**证书导入向导**不选中此选项。

这[`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateKeyFile)和 [`--tlsCertificateSelector`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateSelector) 选项是互斥的。您只能指定一个。

指定证书属性以便从操作系统的证书库中选择匹配的证书。

[`--tlsCertificateSelector`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateSelector) 接受格式的参数`<property>=<value>`，其中属性可以是以下之一：

| 财产         | 值类型         | 描述                                                         |
| :----------- | :------------- | :----------------------------------------------------------- |
| `subject`    | ASCII 字符串   | 证书上的主题名称或通用名称                                   |
| `thumbprint` | 十六进制字符串 | 以十六进制表示的字节序列，用于通过其 SHA-1 摘要标识公钥。`thumbprint`有时 称为`fingerprint`。 |

使用系统 SSL 证书存储时，OCSP（在线证书状态协议）用于验证证书的吊销状态。

> 笔记:
>
> 从 4.4 版开始，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)`30`如果提供的 x.509 证书在主机系统时间的几天 内过期，则会在连接时记录警告`mongod/mongos`。

`--tlsDisabledProtocols <string>`

​	禁用指定的 TLS 协议。该选件可识别以下协议：

* `TLS1_0`
* `TLS1_1`
* `TLS1_2`
* *（从版本 4.0.4、3.6.9、3.4.24 开始）* `TLS1_3`
* 在 macOS 上，您不能同时禁用 和`TLS1_1`启用两者。您还必须至少禁用其他两个中的一个；例如，。`TLS1_0``TLS1_2``TLS1_0,TLS1_1`
* 要列出多个协议，请指定为逗号分隔的协议列表。例如`TLS1_0,TLS1_1`。
* 指定的禁用协议会覆盖任何默认的禁用协议。

从 4.0 版开始，如果 TLS 1.1+ 在系统上可用，MongoDB 将禁用 TLS 1.0。要启用禁用的 TLS 1.0，请`none`指定 [`--tlsDisabledProtocols`.](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsDisabledProtocols)

**--tlsUseSystemCA**

​	允许`mongosh`加载操作系统证书颁发机构可用的 TLS 证书。如果您想使用您的操作系统已经可用的 TLS 证书而不明确指定这些证书，请使用此选项`mongosh`。

## 身份验证选项

`--authenticationDatabase <dbname>`

​	指定指定的身份验证数据库 [`--username`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--username)已经被创造了。看 [身份验证数据库。](https://www.mongodb.com/docs/manual/core/security-users/#std-label-user-authentication-database)

​	如果您没有指定一个值 [`--authenticationDatabase`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationDatabase)，MongoDB Shell使用连接字符串中指定的数据库。

`--authenticationMechanism <name>`

​	*默认值*：SCRAM-SHA-1

​	指定MongoDB Shell用于对[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或者[`mongos`.](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

>笔记:
>
>从 4.0 版开始：
>
>- MongoDB 删除了对已弃用的 MongoDB Challenge-Response ( `MONGODB-CR`) 身份验证机制的支持。
>- MongoDB 使用 SHA-256 哈希函数 ( `SCRAM-SHA-256`) 添加了对 SCRAM 机制的支持。

| 价值                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [SCRAM-SHA-1](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram-sha-1) | [RFC 5802](https://tools.ietf.org/html/rfc5802)使用 SHA-1 散列函数的标准 Salted Challenge Response 认证机制。 |
| [SCRAM-SHA-256](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram-sha-256) | [RFC 7677](https://tools.ietf.org/html/rfc7677)使用 SHA-256 散列函数的标准 Salted Challenge Response 认证机制。需要将 featureCompatibilityVersion 设置为`4.0`。 |
| [MONGODB-X509](https://www.mongodb.com/docs/manual/core/security-x.509/#std-label-security-auth-x509) | MongoDB TLS / SSL证书认证。                                  |
| [GSSAPI](https://www.mongodb.com/docs/manual/core/authentication/#std-label-security-auth-kerberos)（克伯罗斯） | 使用 Kerberos 的外部身份验证。该机制仅适用于[MongoDB 企业版](http://www.mongodb.com/products/mongodb-enterprise-advanced?jmp=docs). |
| [清楚的](https://www.mongodb.com/docs/manual/core/authentication/#std-label-security-auth-ldap)(LDAPSASL) | 使用 LDAP 的外部身份验证。您还可以用于`PLAIN` 对数据库内用户进行身份验证。`PLAIN`以明文形式传输密码。该机制仅适用于 [MongoDB 企业版](http://www.mongodb.com/products/mongodb-enterprise-advanced?jmp=docs). |

`--gssapiServiceName`

​	使用指定服务的名称 [GSSAPI/Kerberos](https://www.mongodb.com/docs/manual/core/kerberos/). 仅当服务不使用默认名称`mongodb`.

​	此选项仅在 MongoDB Enterprise 中可用。

`--sspiHostnameCanonicalization <string>`

​	指定是否使用主机名规范化。

​	[`--sspiHostnameCanonicalization`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--sspiHostnameCanonicalization)`CANONICALIZE_HOST_NAME:true|false`与在中设置密钥 对具有相	同的效果 [`authMechanismProperties`](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.authMechanismProperties)的一部分 [连接字符串。](https://www.mongodb.com/docs/manual/reference/connection-string/#std-label-mongodb-uri)

​	如果[`--sspiHostnameCanonicalization`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--sspiHostnameCanonicalization)被设定为：

* `forwardAndReverse`，执行正向 DNS 查找，然后执行反向查找。1.3.0中的新功能`mongosh`。
* `forward`, 效果同设置 `authMechanismProperties=CANONICALIZE_HOST_NAME:true`。
* `none`, 效果同设置 `authMechanismProperties=CANONICALIZE_HOST_NAME:false`。

`--password <password>, -p <password>`

​	指定用于对使用身份验证的 MongoDB 数据库进行身份验证的密码。结合使用 [`--username`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--username)和 [`--authenticationDatabase`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationDatabase) 选项。

​	要强制MongoDB Shell提示输入密码，请输入 [`--password`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password)选项作为最后一个选项并省略参数。

`--username <username>, -u <username>`

​	指定用于对使用身份验证的 MongoDB 数据库进行身份验证的用户名。结合使用 [`--password`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password)和 [`--authenticationDatabase`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationDatabase) 选项。

## 会话选项

`--retryWrites`

启用[可重试写入](https://www.mongodb.com/docs/manual/core/retryable-writes/#std-label-retryable-writes). 可重试写入在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh). 默认情况下，可重试写入在旧版中是禁用的[`mongo`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)壳。要禁用可重试写入，请使用[`--retryWrites=false`.](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--retryWrites)

有关会话的更多信息，请参见[客户端会话和因果一致性保证。](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)

## 客户端字段级加密选项

- `--awsAccessKeyId <string>`

  一个[AWS 访问密钥](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)与具有 AWS Key Management Service (KMS) 权限的`List`IAM 用户关联。`Read`[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-program-mongosh)使用指定的[`--awsAccessKeyId`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsAccessKeyId)访问 KMS。[`--awsAccessKeyId`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsAccessKeyId)需要启用 [客户端字段级加密](https://www.mongodb.com/docs/manual/core/csfle/#std-label-manual-csfle-feature)为了[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-program-mongosh)外壳会话。 [`--awsAccessKeyId`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsAccessKeyId)需要以下*两个*命令行选项：[`--awsSecretAccessKey`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsSecretAccessKey)[`--keyVaultNamespace`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--keyVaultNamespace)如果[`--awsAccessKeyId`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsAccessKeyId)被省略，使用[`Mongo()`](https://www.mongodb.com/docs/manual/reference/method/Mongo/#mongodb-method-Mongo) shell 会话中的构造函数以启用客户端字段级加密。为了减轻将访问密钥泄漏到日志中的风险，请考虑指定一个环境变量以[`--awsAccessKeyId`.](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsAccessKeyId)

- `--awsSecretAccessKey <string>`

  一个[AWS 密钥](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) 关联到指定[`--awsAccessKeyId`.](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsAccessKeyId)[`--awsSecretAccessKey`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsSecretAccessKey)需要启用 [客户端字段级加密](https://www.mongodb.com/docs/manual/core/csfle/#std-label-manual-csfle-feature)为了[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-program-mongosh)会议。 [`--awsSecretAccessKey`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsSecretAccessKey)需要以下*两个*命令行选项：[`--awsAccessKeyId`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsAccessKeyId)[`--keyVaultNamespace`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--keyVaultNamespace)如果[`--awsSecretAccessKey`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsSecretAccessKey)及其支持选项被省略，使用[`Mongo()`](https://www.mongodb.com/docs/manual/reference/method/Mongo/#mongodb-method-Mongo)在 shell 会话中启用客户端字段级加密。为了减轻将访问密钥泄漏到日志中的风险，请考虑指定一个环境变量以 [`--awsSecretAccessKey`.](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsSecretAccessKey)

- `--awsSessionToken <string>`

  一个[AWS 会话令牌](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) 关联到指定[`--awsAccessKeyId`.](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsAccessKeyId)[`--awsSessionToken`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsSessionToken)需要启用 [客户端字段级加密](https://www.mongodb.com/docs/manual/core/csfle/#std-label-manual-csfle-feature)为了[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-program-mongosh)外壳会话。 [`--awsSessionToken`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsSessionToken)需要以下*所有*命令行选项：[`--awsAccessKeyId`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsAccessKeyId)[`--awsSecretAccessKey`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsSecretAccessKey)[`--keyVaultNamespace`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--keyVaultNamespace)如果[`--awsSessionToken`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsSessionToken)及其支持选项被省略，使用[`Mongo()`](https://www.mongodb.com/docs/manual/reference/method/Mongo/#mongodb-method-Mongo)在 shell 会话中启用客户端字段级加密。为了减轻将访问密钥泄漏到日志中的风险，请考虑指定一个环境变量以[`--awsSessionToken`.](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsSessionToken)

- `--keyVaultNamespace <string>`

  `<database>.<collection>`用作密钥保管库的集合的完整命名空间 ( )[客户端字段级加密](https://www.mongodb.com/docs/manual/core/csfle/#std-label-manual-csfle-feature). [`--keyVaultNamespace`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--keyVaultNamespace)是启用客户端字段级加密所必需的。为了[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-program-mongosh)外壳会话。 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-program-mongosh)如果指定的命名空间不存在，则创建它。[`--keyVaultNamespace`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--keyVaultNamespace)需要以下*两个*命令行选项：[`--awsAccessKeyId`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsAccessKeyId)[`--awsSecretAccessKey`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--awsSecretAccessKey)如果[`--keyVaultNamespace`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--keyVaultNamespace)及其支持选项被省略，使用[`Mongo()`](https://www.mongodb.com/docs/manual/reference/method/Mongo/#mongodb-method-Mongo)shell 会话中的构造函数以启用客户端字段级加密。







翻译：韩鹏帅

原文：[Options](https://www.mongodb.com/docs/mongodb-shell/reference/options/)
