 **使用 x.509 证书进行成员身份验证**

MongoDB 支持用于安全 TLS/SSL 连接的 x.509 证书身份验证。 分片集群成员和副本集成员可以使用 x.509 证书来验证他们对集群或副本集的成员身份，而不是使用密钥文件。 成员身份验证是一个内部过程。

>[NOTE]注意
>
>从 4.0 版开始，MongoDB 在 TLS 1.1+ 可用的系统上禁用对 TLS 1.0 加密的支持。 有关详细信息，请参阅[Disable TLS 1.0](https://www.mongodb.com/docs/manual/release-notes/4.0/#std-label-4.0-disable-tls)。

启用内部身份验证还会启用[Role-Based Access Control](https://www.mongodb.com/docs/manual/core/authorization/)。 客户端必须作为用户进行身份验证才能连接并在部署中执行操作。

- 有关将用户添加到部署的说明，请参阅[Manage Users and Roles](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/)。


- 有关使用 x.509 证书进行用户身份验证的说明，请参阅[Use x.509 Certificates to Authenticate Clients](https://www.mongodb.com/docs/manual/tutorial/configure-x509-client-authentication/) 。

>[IMPORTANT]重要
>
>TLS/SSL、PKI（公钥基础设施）证书（尤其是 x.509 证书）和证书颁发机构的完整描述超出了本文档的范围。 本教程假定您事先了解 TLS/SSL 以及访问有效的 x.509 证书。

**成员 x.509 证书**

>[NOTE]注意
>
>您必须具有有效的 x.509 证书。
>
>从 MongoDB 4.2 开始，如果在使用 x.509 身份验证时指定 `--tlsAllowInvalidateCertificates` 或 `net.tls.allowInvalidCertificates: true` ，则无效证书仅足以建立 TLS 连接，但不足以进行身份验证。

**证书要求**

使用成员证书来验证分片集群或副本集的成员身份。 成员证书存储在 net.tls.clusterFile 和 net.tls.certificateKeyFile 中。 会员证件要求：

- 单个证书颁发机构 (CA) 必须为分片集群或副本集的成员颁发所有 x.509 证书。


- x.509 证书不能过期。

  >[NOTE]注意
  >
  >在 4.4 版中更改：如果提供的 x.509 证书在 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) / [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 主机系统时间的 30 天内过期，mongod/mongos 会在连接时记录警告。 有关详细信息，请参阅[x.509 Certificates Nearing Expiry Trigger Warnings](https://www.mongodb.com/docs/manual/release-notes/4.4/#std-label-4.4-rel-notes-certificate-expiration-warning)。

- 在成员证书的主题中找到的可分辨名称 (`DN`) 必须至少为以下属性之一指定非空值：

  - 组织 (`O`)

  - 组织单位 (`OU`)

  - 域组件 (`DC`)

- 每个集群成员证书在其 [`net.tls.clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile) 和 [`net.tls.certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile) 证书中必须具有相同的 `O`s、`OU` 和` DC`。 这也适用于  [`tlsX509ClusterAuthDNOverride`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.tlsX509ClusterAuthDNOverride) 值（如果已设置）。 属性顺序无关紧要。

  这是一个例子。 下面两个`DN`有`O`和`OU`的匹配规范，不指定`DC`。

  ```shell
  CN=host1,OU=Dept1,O=MongoDB,ST=NY,C=US
  C=US, ST=CA, O=MongoDB, OU=Dept1, CN=host2
  ```

  以下示例不正确，因为 `DN` 不匹配。 一个 `DN` 有两个 `OU` 规范，另一个只有一个 `OU` 规范。

  ```shell
  CN=host1,OU=Dept1,OU=Sales,O=MongoDB
  CN=host2,OU=Dept1,O=MongoDB
  ```

- Common Name (`CN`) 或 Subject Alternative Name (`SAN`) 条目之一必须与其他集群成员的服务器主机名匹配。 从 MongoDB 4.2 开始，在比较 SAN 时，MongoDB 可以比较 DNS 名称或 IP 地址。 在以前的版本中，MongoDB 只比较 DNS 名称。

  例如，集群的证书可能具有以下`subject`：

  ```shell
  subject= CN=<myhostname1>,OU=Dept1,O=MongoDB,ST=NY,C=US
  subject= CN=<myhostname2>,OU=Dept1,O=MongoDB,ST=NY,C=US
  subject= CN=<myhostname3>,OU=Dept1,O=MongoDB,ST=NY,C=US
  ```

- 如果证书包含扩展密钥用法 (`extendedKeyUsage`) 设置，则该值必须包含 `clientAuth`（“TLS Web 客户端身份验证”）。

  ```shell
  extendedKeyUsage = clientAuth
  ```

**配置副本集/分片集群**

在滚动升级程序之外，[replica set](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)或[sharded cluster](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)的每个组件都应使用相同的 `--clusterAuthMode` 设置以确保它可以安全地连接到部署中的所有其他组件。

对于[replica set](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)部署，这包括副本集的所有 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 成员。

对于[sharded cluster](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)部署，这包括所有 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例。

>[NOTE]注意
>
>[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到 localhost。 如果部署的成员在不同的主机上运行，或者如果您希望远程客户端连接到您的部署，则必须指定 `--bind_ip` 或 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)。

**使用命令行选项 (tls)**

>[NOTE]注意
>
>本节中的过程使用` tls `设置/选项。 有关使用已弃用的 `ssl` 别名的过程，请参阅[
>Use Command-line Options (`ssl`)](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/#std-label-configure-member-ssl)。
>
>`tls `设置/选项提供与 `ssl` 选项相同的功能，因为 MongoDB 一直支持 TLS 1.0 及更高版本。

**TLS（命令行选项）**

```shell
mongod --replSet <name> --tlsMode requireTLS --clusterAuthMode x509 --tlsClusterFile <path to membership certificate and key PEM file> --tlsCertificateKeyFile <path to TLS/SSL certificate and key file> --sslCAFile <path to root CA file> --bind_ip localhost,<hostname(s)|ip address(es)>
```

**TLS（配置文件）**

```yaml
security:
   clusterAuthMode: x509
net:
   tls:
      mode: requireTLS
      certificateKeyFile: <path to its TLS/SSL certificate and key file>
      CAFile: <path to root CA PEM file to verify received certificate>
      clusterFile: <path to its certificate key file for membership authentication>
   bindIp: localhost,<hostname(s)|ip address(es)>
```

>[IMPORTANT]重要
>
>要使用 x.509 身份验证，必须指定 `--tlsCAFile` 或 `net.tls.CAFile`，除非您使用 `--tlsCertificateSelector` 或 `--net.tls.certificateSelector`。

包括您的特定配置所需的任何其他选项、TLS/SSL 或其他选项。

有关详细信息，请参阅[Configure `mongod` and `mongos` for TLS/SSL](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)

**使用命令行选项 (ssl)**

>[NOTE]注意
>
>本节中的过程使用已弃用的 `ssl` 设置/选项。 有关使用其 `tls` 别名（在 MongoDB 4.2+ 中可用）的过程，请参阅[Use Command-line Options (`tls`)](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/#std-label-configure-member-tls)。
>
>`tls `设置/选项提供与 `ssl` 选项相同的功能，因为 MongoDB 一直支持 TLS 1.0 及更高版本。

**SSL（命令行选项）**

要为内部集群成员身份验证指定 x.509 证书，请附加额外的 TLS/SSL 选项 `--clusterAuthMode` 和 `--sslClusterFile`，如以下副本集成员示例所示：

```shell
mongod --replSet <name> --sslMode requireSSL --clusterAuthMode x509 --sslClusterFile <path to membership certificate and key PEM file> --sslPEMKeyFile <path to TLS/SSL certificate and key PEM file> --sslCAFile <path to root CA PEM file> --bind_ip localhost,<hostname(s)|ip address(es)>
```

**SSL（配置文件）**

```yaml
security:
   clusterAuthMode: x509
net:
   ssl:
      mode: requireSSL
      PEMKeyFile: <path to TLS/SSL certificate and key PEM file>
      CAFile: <path to root CA PEM file>
      clusterFile: <path to x.509 membership certificate and key PEM file>
   bindIp: localhost,<hostname(s)|ip address(es)>
```

>[IMPORTANT]重要
>
>要使用 x.509 身份验证，必须指定 `--tlsCAFile` 或 `net.tls.CAFile`，除非您使用 `--tlsCertificateSelector` 或 `--net.tls.certificateSelector`。

包括您的特定配置所需的任何其他选项、TLS/SSL 或其他选项。

有关详细信息，请参阅[Configure `mongod` and `mongos` for TLS/SSL](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)。

**附加信息**

要从密钥文件内部身份验证升级到 x.509 内部身份验证，请参阅[Upgrade from Keyfile Authentication to x.509 Authentication.](https://www.mongodb.com/docs/manual/tutorial/upgrade-keyfile-to-x509/)。

要将证书滚动更新为具有不同 DN 的新证书，请参阅[Rolling Update of x.509 Cluster Certificates that Contain New DN](https://www.mongodb.com/docs/manual/tutorial/rotate-x509-membership-certificates/)。

 参见

原文 - [Use x.509 Certificate for Membership Authentication]( https://docs.mongodb.com/manual/tutorial/configure-x509-member-authentication/ )

译者：景圣