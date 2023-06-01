# 内部/成员认证

您可以要求[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)和 [分片集群](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)的成员相互进行身份验证。对于成员的内部认证，MongoDB 可以使用 [密钥文件](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#std-label-internal-auth-keyfile)或者[x.509](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#std-label-internal-auth-x509)证书。

所选方法用于所有内部通信。例如，当客户端[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用一种受支持的 [身份验证机制](https://www.mongodb.com/docs/manual/core/authentication/#std-label-security-authentication-mechanisms)对 a 进行身份验证时，`mongos`然后使用配置的内部身份验证方法连接到所需的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)进程。

> 笔记:
>
> 启用内部身份验证也会启用[客户端授权。](https://www.mongodb.com/docs/manual/core/authorization/)

## 密钥文件

密钥文件使用[SCRAM](https://www.mongodb.com/docs/manual/core/security-scram/)挑战和响应身份验证机制，其中密钥文件包含成员的共享密码。

### 关键要求

密钥的长度必须介于 6 到 1024 个字符之间，并且只能包含 base64 集中的字符。MongoDB 去除空白字符（例如`x0d`, `x09`, 和`x20`）以方便跨平台。因此，以下操作会产生相同的密钥：

```
echo -e "mysecretkey" > key1
echo -e "my secret key" > key1
echo -e "my secret key\n" > key2
echo -e "my    secret    key" > key3
echo -e "my\r\nsecret\r\nkey\r\n" > key4
```

### 密钥文件格式

从 MongoDB 4.2 开始，[用于内部成员身份验证的密钥文件](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#std-label-internal-auth-keyfile)使用 YAML 格式允许一个密钥文件中有多个密钥。YAML 格式接受以下内容：

- 单个键字符串（与早期版本相同）
- 多个键字符串（每个字符串必须用引号引起来），或
- 键字符串的序列。

YAML 格式与使用文本文件格式的现有单密钥密钥文件兼容。

例如，

单键:

如果密钥文件包含单个密钥，您可以指定带或不带引号的密钥字符串

```
my old secret key1
```

在文件中指定多个密钥的能力允许在不停机的情况下滚动升级密钥。请参阅 [为副本集轮换密钥](https://www.mongodb.com/docs/manual/tutorial/rotate-key-replica-set/)和 [为分片集群轮换密钥。](https://www.mongodb.com/docs/manual/tutorial/rotate-key-sharded-cluster/)

部署的所有实例[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例必须共享至少一个公共密钥。

在 UNIX 系统上，密钥文件不得具有组或世界权限。在 Windows 系统上，不检查密钥文件权限。

您必须将密钥文件存储在每个托管副本集或分片集群成员的服务器上。

*( [1](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#ref-exclude-encryption-keyfile-id1) , [2](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#ref-exclude-encryption-keyfile-id2) )* 对于[MongoDB的加密存储引擎](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)，用于本地密钥管理的[keyfile](https://www.mongodb.com/docs/manual/tutorial/configure-encryption/#std-label-encrypt-local-key-mgmt)只能包含一个密钥。

### 密钥文件的 MongoDB 配置

要指定密钥文件，请使用[`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile)设置或 `--keyFile`命令行选项。

有关密钥文件内部身份验证的示例，请参阅 [将副本集更新为密钥文件身份验证。](https://www.mongodb.com/docs/manual/tutorial/enforce-keyfile-access-control-in-existing-replica-set/)

## x.509

副本集或分片集群的成员可以使用 x.509 证书进行内部身份验证，而不是使用密钥文件。MongoDB 支持用于安全 TLS/SSL 连接的 x.509 证书身份验证。

> 笔记:
>
> MongoDB在 TLS 1.1+ 可用的系统上禁用对 TLS 1.0 加密的支持。有关详细信息，请参阅[禁用 TLS 1.0 。](https://www.mongodb.com/docs/manual/release-notes/4.0/#std-label-4.0-disable-tls)

### 成员证书要求[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#member-certificate-requirements)

使用成员证书来验证分片集群或副本集的成员身份。成员证书存储在 [`net.tls.clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile)和中[`net.tls.certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile)。会员证件要求：

- 单个证书颁发机构 (CA) 必须为分片集群或副本集的成员颁发所有 x.509 证书。
- x.509 证书不能*过期*。

> 笔记:
>
> *在4.4版中更改*：[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/如果提供的 x.509 证书在主机系统时间 的几天[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)内过期，则在连接时记录警告。有关详细信息，请参阅 [x.509 证书即将到期触发器警告](https://www.mongodb.com/docs/manual/release-notes/4.4/#std-label-4.4-rel-notes-certificate-expiration-warning)。`30``mongod/mongos`

* `DN`在成员证书的 中找到的 可分辨名称 ( ) 必须*至少*为以下属性之一`subject`指定非空值：

  - 组织 ( `O`)
  - 组织单位 ( `OU`)
  - 域组件 ( `DC`)

* 每个集群成员证书在其和 证书中必须具有相同的`O`s、`OU`s 和`DC`s 。如果已设置，这也适用于该值。属性顺序无关紧要。[`net.tls.clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile)[`net.tls.certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile)[`tlsX509ClusterAuthDNOverride`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.tlsX509ClusterAuthDNOverride)

  这是一个例子。下面的两个`DN`s 具有`O`与 和 的匹配规范`OU`，并且`DC`未指定。

  ```
  CN=host1,OU=Dept1,O=MongoDB,ST=NY,C=US
  C=US, ST=CA, O=MongoDB, OU=Dept1, CN=host2
  ```

  以下示例不正确，因为`DN`s 不匹配。一种 `DN`有两种`OU`规格，另一种只有一种`OU` 规格。

  ```
  CN=host1,OU=Dept1,OU=Sales,O=MongoDB
  CN=host2,OU=Dept1,O=MongoDB
  ```

* Common Name ( `CN`) 或 Subject Alternative Name ( `SAN`) 条目之一必须与其他集群成员的服务器主机名匹配。从 MongoDB 4.2 开始，在比较`SAN`s 时，MongoDB 可以比较 DNS 名称或 IP 地址。在以前的版本中，MongoDB 只比较 DNS 名称。

  例如，集群的证书可能具有以下`subject`s：

  ```
  subject= CN=<myhostname1>,OU=Dept1,O=MongoDB,ST=NY,C=US
  subject= CN=<myhostname2>,OU=Dept1,O=MongoDB,ST=NY,C=US
  subject= CN=<myhostname3>,OU=Dept1,O=MongoDB,ST=NY,C=US
  ```

* *如果*证书包含扩展密钥用法 ( `extendedKeyUsage`) 设置，则该值必须包含 `clientAuth`（“TLS Web 客户端身份验证”）。

  ```
  extendedKeyUsage = clientAuth
  ```

### MongoDB 配置

您可以使用 TLS 在副本集（每个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例）或分片集群（每个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例）的每个成员之间进行内部身份验证。

要使用 TLS 进行内部身份验证，请使用以下设置：

- [`security.clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.clusterAuthMode)或[`--clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--clusterAuthMode)设置为`x509`
- [`net.tls.clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile)或[`--tlsClusterFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--clusterAuthMode)（*从 MongoDB 4.2 开始可用*）

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsCertificateKeyFile)实例使用它们的证书密钥文件向客户端证明它们的身份，但证书密钥文件也可用于成员身份验证。如果不指定集群文件，成员将使用他们的证书密钥文件进行成员身份验证。[`net.tls.certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile)使用或 指定证书密钥文件[`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsCertificateKeyFile) （*从 MongoDB 4.2 开始可用*）。

要将证书密钥文件用于客户端身份验证和成员身份验证，证书必须：

- 省略`extendedKeyUsage`或
- 指定`extendedKeyUsage = serverAuth, clientAuth`

## 下一步

有关 x.509 内部身份验证的示例，请参阅 [使用 x.509 证书进行成员身份验证。](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/)

要从密钥文件内部身份验证升级到 x.509 内部身份验证，请参阅[从密钥文件身份验证升级到 x.509 身份验证。](https://www.mongodb.com/docs/manual/tutorial/upgrade-keyfile-to-x509/)







翻译：韩鹏帅

原文：[Internal/Membership Authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)