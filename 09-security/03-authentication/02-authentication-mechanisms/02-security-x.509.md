 **x.509**

MongoDB 支持 x.509 证书认证，用于客户端认证以及副本集和分片集群成员的内部认证。

x.509 证书身份验证需要安全的 [TLS/SSL connection](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)。

**证书颁发机构**

对于生产用途，您的 MongoDB 部署应使用由证书颁发机构生成和签名的有效证书。 您或您的组织可以生成和维护独立的证书颁发机构，或使用第三方 TLS 供应商生成的证书。 获取和管理证书不在本文档的讨论范围之内。

**客户端 x.509 证书**

要对服务器进行身份验证，客户端可以使用 x.509 证书而不是用户名和密码。

**客户端证书要求**

客户端证书要求:

- 单个证书颁发机构 (CA) 必须同时为客户端和服务器颁发证书。

- 每个唯一的 MongoDB 用户必须有一个唯一的证书。

- x.509 证书不能过期。

  >[NOTE]注意
  >
  >*在 4.4 版中更改*：如果提供的 x.509 证书在 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/ [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 主机系统时间的 30 天内过期，mongod/mongos 会记录连接警告。 有关详细信息，请参阅  [x.509 Certificates Nearing Expiry Trigger Warnings](https://www.mongodb.com/docs/manual/release-notes/4.4/#std-label-4.4-rel-notes-certificate-expiration-warning) 。

- 客户端证书必须包含以下字段：

  ```shell
  keyUsage = digitalSignature
  extendedKeyUsage = clientAuth
  ```

- 以下客户端证书属性中的至少一个必须与 [`net.tls.clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile) 和 [`net.tls.certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile) 服务器证书中的属性**不同**：

  - 组织 (`O`)
  - 组织单位 (`OU`)

  - 域组件 (`DC`)

- 包含专有名称 (DN) 的客户端 x.509 证书的主题必须**不同**于[member x.509 certificates](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/#std-label-x509-member-certificate)的主题。

  >[IMPORTANT]重要
  >
  >如果客户端 x.509 证书的主题与[Member x.509 Certificate](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/#std-label-x509-member-certificate) （或 [`tlsX509ClusterAuthDNOverride`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.tlsX509ClusterAuthDNOverride)，如果已设置）的 `O`、`OU` 和` DC` 属性完全匹配，则客户端连接被接受，权限被授予完全，并在日志中出现一条提示信息。
  >
  >只有[cluster member x509 certificates](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/#std-label-x509-member-certificate)应该使用相同的 O、OU 和 DC 属性组合。

  *4.2 新版功能*：如果 MongoDB 部署设置了 [`tlsX509ClusterAuthDNOverride`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.tlsX509ClusterAuthDNOverride)，则客户端 x.509 证书的主题不得与该值匹配。

**MongoDB 用户和 $external 数据库**

要使用客户端证书进行身份验证，您必须首先将客户端证书的主题添加为 `$external` 数据库中的 MongoDB 用户。 `$external 数据库是用户的[Authentication Database](https://www.mongodb.com/docs/manual/core/security-users/#std-label-authentication-database)。

每个唯一的 x.509 客户端证书适用于一个 MongoDB 用户。 您不能使用单个客户端证书对多个 MongoDB 用户进行身份验证。

要对 $external 身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[Client Sessions and Causal Consistency Guarantees](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)，用户名不能超过 10k 字节。

**TLS 连接 X509 证书启动提示**

从 MongoDB 5.0 开始，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 现在在其证书不包含[Subject Alternative Name](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-Subject-Alternative-Name)属性时发出启动警告。

以下平台不支持公用名验证：

- iOS 13 and higher
- MacOS 10.15 and higher
- Go 1.15 and higher

使用这些平台的客户端将不会向使用主机名由[specified by CommonName attributes](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-label-KMIP-subject-alternative-name-CN)的 x.509 证书的 MongoDB 服务器进行[authenticate](https://www.mongodb.com/docs/manual/tutorial/configure-x509-client-authentication/#std-label-x509-client-authentication)。

**成员 x.509 证书**

对于分片集群和副本集成员之间的内部身份验证，您可以使用 x.509 证书而不是[keyfiles](https://www.mongodb.com/docs/manual/tutorial/deploy-sharded-cluster-with-keyfile-access-control/)。

**成员证书要求**

使用成员证书来验证分片集群或副本集的成员身份。 成员证书存储在 [`net.tls.clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile) 和 [`net.tls.certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile) 中。 成员证件要求：

- 单个证书颁发机构 (CA) 必须为分片集群或副本集的成员颁发所有 x.509 证书。

- x.509 证书不能过期。

  >[NOTE]注意
  >
  >*在 4.4 版中更改*：如果提供的 x.509 证书在 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/ [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 主机系统时间的 30 天内过期，mongod/mongos 会记录连接警告。 有关详细信息，请参阅  [x.509 Certificates Nearing Expiry Trigger Warnings](https://www.mongodb.com/docs/manual/release-notes/4.4/#std-label-4.4-rel-notes-certificate-expiration-warning) 。

- 在成员证书的主题中找到的可分辨名称 (`DN`) 必须至少为以下属性之一指定非空值：

  - 组织 (`O`)
  - 组织单位 (`OU`)
  - 域组件 (`DC`)

- 每个集群成员证书在其 [`net.tls.clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile) 和 [`net.tls.certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile)  证书中必须具有相同的 Os、OU 和 DC。 这也适用于  [`tlsX509ClusterAuthDNOverride`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.tlsX509ClusterAuthDNOverride) 值（如果已设置）。 属性顺序无关紧要。

  这是一个例子。 下面两个`DN`有`O`和`OU`的匹配规范，不指定`DC`。

  ```javascript
  CN=host1,OU=Dept1,O=MongoDB,ST=NY,C=US
  C=US, ST=CA, O=MongoDB, OU=Dept1, CN=host2
  ```

  以下示例不正确，因为 `DN `不匹配。 一个 `DN` 有两个 `OU` 规范，另一个只有一个 `OU` 规范。

  ```javascript
  CN=host1,OU=Dept1,OU=Sales,O=MongoDB
  CN=host2,OU=Dept1,O=MongoDB
  ```

- Common Name (`CN`) 或 Subject Alternative Name (`SAN`) 条目之一必须与其他集群成员的服务器主机名匹配。 从 MongoDB 4.2 开始，在比较 `SAN` 时，MongoDB 可以比较 DNS 名称或 IP 地址。 在以前的版本中，MongoDB 只比较 DNS 名称。

  例如，集群的证书可能具有以下`subject`s：

  ```javascript
  subject= CN=<myhostname1>,OU=Dept1,O=MongoDB,ST=NY,C=US
  subject= CN=<myhostname2>,OU=Dept1,O=MongoDB,ST=NY,C=US
  subject= CN=<myhostname3>,OU=Dept1,O=MongoDB,ST=NY,C=US
  ```

- 如果证书包含密钥扩展用法 (`extendedKeyUsage`) 设置，则该值必须包含 `clientAuth`（“TLS Web 客户端身份验证”）。

  ```javascript
  extendedKeyUsage = clientAuth
  ```

**用于成员身份验证的 MongoDB 配置**

您可以使用 TLS 在副本集（每个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例）或分片集群（每个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例）的每个成员之间进行内部身份验证。

要使用 TLS 进行内部身份验证，请使用以下设置：

- [`security.clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.clusterAuthMode) or [`--clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--clusterAuthMode) set to `x509`
- [`net.tls.clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile) or [`--tlsClusterFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--clusterAuthMode) （从 MongoDB 4.2 开始可用）

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsCertificateKeyFile) 实例使用它们的证书密钥文件向客户端证明它们的身份，但证书密钥文件也可用于成员身份验证。 如果不指定集群文件，成员将使用他们的证书密钥文件进行成员身份验证。 使用 [`net.tls.certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile) 或 [`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsCertificateKeyFile)  指定证书密钥文件（从 MongoDB 4.2 开始可用）。

要将证书密钥文件用于客户端身份验证和成员身份验证，证书必须：

- 省略 `extendedKeyUsage` 或
- 指定 `extendedKeyUsage = serverAuth, clientAuth`

 参见

原文 - [x.509]( https://docs.mongodb.com/manual/core/security-x.509/ )

译者：景圣
