 **LDAP 代理身份验证**

[MongoDB Enterprise](http://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server)支持将身份验证请求代理到轻量级目录访问协议 (LDAP) 服务。

MongoDB 支持简单和 SASL 绑定到 LDAP 服务器：

| Via         | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| 操作系统库  | 从版本 3.4 开始，MongoDB 支持通过操作系统库绑定到 LDAP 服务器。<br/><br/>这允许 Linux 和 Windows 上的 MongoDB 服务器使用 LDAP 服务器进行身份验证。<br/><br/>在早期版本中，Microsoft Windows 上的 MongoDB 无法连接到 LDAP 服务器。 |
| `saslauthd` | Linux 上的 MongoDB 服务器支持通过 saslauthd 守护进程绑定到 LDAP 服务器。<br/><br/>不适用于 Windows 上的 MongoDB。 |

**注意事项**

LDAP 的完整描述不在本文档的范围之内。 本页假定您事先了解 LDAP。

本文档仅描述 MongoDB LDAP 身份验证，并不替代 LDAP 上的其他资源。 我们鼓励您在配置 LDAP 身份验证之前彻底熟悉 LDAP 及其相关主题。

MongoDB 可以提供[professional services](https://www.mongodb.com/products/consulting?tck=docs_server)为您的 MongoDB 部署优化 LDAP 身份验证配置。

**连接池**

从4.2.0版本开始，在连接LDAP服务器进行认证/授权时，MongoDB默认：

- 如果运行则使用连接池：
  - 在 Windows 
  - 或 Linux 上，其中 MongoDB Enterprise 二进制文件与 [libldap_r.](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-libldap-vs-libldap_r) 链接。
- 如果运行则不使用连接池：

  - 在 Linux 上，其中 MongoDB Enterprise 二进制文件与 [libldap](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-libldap-vs-libldap_r)链接。

要更改连接池行为，请更新 [`ldapUseConnectionPool`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ldapUseConnectionPool) 参数。

**`saslauthd` 和目录权限**

>[IMPORTANT]重要
>指定给 [`security.sasl.saslauthdSocketPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.sasl.saslauthdSocketPath) 或 [`--setParameter saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath) 的 `saslauthd` Unix 域套接字文件的父目录必须授予读取和执行 (r-x) 权限：
>
>- 启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 的用户，或者
>
>
>- 该用户所属的组。
>
>
>如果没有对 `saslauthd` 目录及其内容的指定权限，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 无法通过 `saslauthd` 成功进行身份验证。

**`libldap` and `libldap_r`**

对于链接到 `libldap` 的 MongoDB 4.2 Enterprise 二进制文件（例如在 RHEL 上运行时），对 `libldap` 的访问是同步的，会产生一些性能/延迟成本。

对于链接到 `libldap_r` 的 MongoDB 4.2 Enterprise 二进制文件，与早期 MongoDB 版本相比，行为没有变化。

**在 MongoDB 服务器上管理 LDAP 用户**

用户管理需要在 LDAP 服务器和 MongoDB 服务器上同时管理用户。 对于通过 LDAP 进行身份验证的每个用户，MongoDB 需要 `$external` 数据库上的用户名与身份验证用户名完全匹配。 更改 LDAP 服务器上的用户可能需要更改相应的 MongoDB `$external` 用户。

要对 `$external` 身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[Client Sessions and Causal Consistency Guarantees](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions) ，用户名不能大于 10k 字节。

>[IMPORTANT]重要
>
>用户身份验证为 `sam@dba.example.com`。 MongoDB 服务器绑定到 LDAP 服务器并根据任何[`username transformations`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)对用户进行身份验证。 身份验证成功后，MongoDB 服务器会检查 `$external` 数据库中的用户 `sam@dba.example.com` 并授予经过身份验证的用户与该用户关联的角色和权限。

要管理 MongoDB 服务器上的用户，您必须验证为 LDAP 用户，其对应的 MongoDB `$external` 用户对 `$external` 数据库具有用户管理权限，例如 [`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin) 提供的权限。

>[IMPORTANT]重要
>
>如果没有`$external`用户对`$external`数据库有用户管理权限，则不能进行LDAP认证的用户管理。 如果您在启用 LDAP 身份验证之前配置用户，但没有创建适当的用户管理员，则可能会发生这种情况。

**管理现有的非 LDAP 用户**

如果现有用户不在 `$external` 数据库中，您必须满足每个用户的以下要求以确保继续访问：

- 用户在 LDAP 服务器上有对应的用户对象
- 用户存在于 `$external` 数据库中，具有同等的角色和权限

如果您想继续允许不在 `$external` 数据库上的用户访问，则必须配置 [`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter) [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms) 以根据需要包含 `SCRAM-SHA-1` 和/或 `SCRAM-SHA-256`。 然后，用户在进行身份验证时必须指定 `--authenticationMechanism SCRAM-SHA-1` 或 `SCRAM-SHA-256`。

**在副本集上部署 LDAP 身份验证**

对于 [replica sets](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)，在配置[primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)之前先在辅助成员和[arbiter](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-arbiter) 成员上配置 LDAP 身份验证。 这也适用于[shard replica sets](https://www.mongodb.com/docs/manual/core/sharded-cluster-shards/)或[config server replica sets](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/#std-label-csrs)。 一次配置一个副本集成员以维护大多数成员的写入可用性。

**在分片集群上部署 LDAP 身份验证**

在[sharded clusters](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)中，您必须在[config servers](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-server)和集群级用户的每个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 上配置 LDAP 身份验证。 您可以选择为分片本地用户在每个[shard](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)上配置 LDAP 授权。

**通过操作系统 LDAP 库进行 LDAP 身份验证**

通过 OS 库过程的 LDAP 身份验证总结如下：

1. 客户端向 MongoDB 进行身份验证，提供用户凭证。

2. 如果用户名在绑定到 LDAP 服务器之前需要映射到 LDAP DN，MongoDB 可以根据配置的 [`security.ldap.userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping) 设置应用转换。

3. MongoDB 使用提供的用户名绑定到 [`security.ldap.servers`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.servers) 中指定的 LDAP 服务器，或者如果应用了转换，则使用转换后的用户名。

   MongoDB 默认使用简单绑定，但如果在 [`security.ldap.bind.method`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.method) 和 [`security.ldap.bind.saslMechanisms`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.saslMechanisms) 中配置，也可以使用 sasl 绑定。

   如果转换需要查询 LDAP 服务器，或者如果 LDAP 服务器不允许匿名绑定，则 MongoDB 在尝试之前使用指定给 [`security.ldap.bind.queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser) 和 [`security.ldap.bind.queryPassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword) 的用户名和密码绑定到 LDAP 服务器 验证提供的用户凭证。

4. LDAP 服务器将绑定尝试的结果返回给 MongoDB。 成功后，MongoDB 会尝试授权用户。

5. MongoDB 服务器尝试将用户名映射到 $external 数据库上的用户，为用户分配与匹配用户关联的任何角色或权限。 如果 MongoDB 找不到匹配的用户，则身份验证失败。

6. 客户端可以执行 MongoDB 授予经过身份验证的用户角色或权限的那些操作。

要通过操作系统库使用 LDAP 进行身份验证，请将以下设置指定为 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或  [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 配置文件的一部分：

| 选项                                                         | 描述                                                         | 是否必须                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [`security.ldap.servers`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.servers) | `host[:port]` 格式的 LDAP 服务器引号括起来的逗号分隔列表。   | **YES**                                                      |
| [`security.ldap.bind.method`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.method) | 用于指定 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 用于验证或绑定到 LDAP 服务器的方法。 指定 `sasl` 以使用 [`security.ldap.bind.saslMechanisms`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.saslMechanisms) 中定义的 SASL 协议之一。<br/><br/>默认为简单。 | **NO**，除非使用 `sasl` 绑定到 LDAP 服务器。                 |
| [`ecurity.ldap.bind.saslMechanisms`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.saslMechanisms) | 用于指定 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 在验证或绑定到 LDAP 服务器时可以使用的 SASL 机制。 MongoDB 和 LDAP 服务器必须就至少一种 SASL 机制达成一致。<br/><br/>默认为 `DIGEST-MD5`。 | **NO**，除非将方法设置为 `sasl` 并且您需要不同的或额外的 SASL 机制。 |
| [`security.ldap.bind.queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser) | LDAP 实体，由其专有名称 (DN) 或 SASL 名称标识，MongoDB 服务器在连接到 LDAP 服务器时使用它进行身份验证或绑定。<br/><br/>与[`queryPassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword)一起使用。<br/><br/>指定的用户必须具有适当的权限才能在 LDAP 服务器上执行查询。 | **NO**，除非将查询指定为 userToDNMapping 转换的一部分，或者 LDAP 服务器的安全设置不允许匿名绑定。 |
| [`security.ldap.bind.queryPassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword) | 使用 [`queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser) 时用于向 LDAP 服务器进行身份验证的密码。 | **NO**，除非指定 [`queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser) |
| [`security.ldap.bind.useOSDefaults`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.useOSDefaults) | Windows MongoDB 部署可以使用操作系统凭据代替 [`queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser) 和 [`queryPassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword) 进行身份验证或绑定，就像连接到 LDAP 服务器时一样。 | 否，除非替换 [`queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser) 和 [`queryPassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword)。 |
| [`security.ldap.userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping) | 客户端可以使用格式与配置的[`bind method`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.method)所期望的格式不兼容的用户名进行身份验证。 例如，简单绑定可能需要完整的 LDAP DN，而用于向 MongoDB 进行身份验证的用户名可能是电子邮件地址。<br/><br/>[`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping) 允许 MongoDB 将传入的用户名转换为与您的 LDAP 架构兼容的格式。 MongoDB 支持使用替换模板或 LDAP 查询模板进行转换。<br/><br/>如果指定将 LDAP 查询用作转换一部分的 [`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping) 转换，则还必须指定具有 LDAP 服务器适当权限级别的 [`queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser) | **NO**，除非客户端使用需要转换的用户名进行身份验证。         |

**通过 `saslauthd` 进行 LDAP 身份验证**

 >[WARNING]警告
 >
 >MongoDB Enterprise for Windows 不支持通过 `saslauthd` 进行绑定。

**注意事项**

- Linux MongoDB 服务器支持通过 `saslauthd` 守护进程绑定到 LDAP 服务器。
- 在客户端和服务器之间以及 saslauthd 和 LDAP 服务器之间使用安全的加密或可信连接。 LDAP 服务器使用 `SASL PLAIN` 机制，以明文形式发送和接收数据。 您应该只使用受信任的渠道，例如 VPN、使用 TLS/SSL 加密的连接或受信任的有线网络。

**配置**

要将 MongoDB 服务器配置为通过 `saslauthd` 绑定到 LDAP 服务器，请使用以下命令行选项或以下配置文件设置启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

**命令行选项**

- [`--auth`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--auth) 启用访问控制，
- [`--setParameter`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--setParameter) 将 [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms) 设置为 PLAIN，以及
- [`--setParameter`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--setParameter) 将 [`saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath) 参数设置为 saslauthd 实例的 Unix 域套接字的路径。 指定空字符串 `""` 以使用默认的 Unix 域套接字路径。

包括部署所需的任何其他命令行选项。 有关  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 命令行选项的完整文档，请参阅  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

您需要使用适合您的 LDAP 服务器的参数来创建或更新 `saslauthd.conf` 文件。 记录 `saslauthd.conf` 不在本文档的范围之内。

**配置文件设置**

- [`security.authorization`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.authorization) 设置为启用，
- 将  [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms) 参数设置为 PLAIN 的 setParameter，以及

- 将 [`saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath) 设置为 saslauthd 实例的 Unix 域套接字路径的 `setParameter`。 指定空字符串 `""` 以使用默认的 Unix 域套接字路径。

包括部署所需的任何其他配置文件设置。 有关配置文件的完整文档，请参阅 [YAML configuration file](https://www.mongodb.com/docs/manual/reference/configuration-options/)。

您需要使用适合您的 LDAP 服务器的参数来创建或更新 `saslauthd.conf `文件。 记录` saslauthd.conf` 不在本文档的范围之内。

>[IMPORTANT]重要
>
>指定给 [`security.sasl.saslauthdSocketPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.sasl.saslauthdSocketPath) 或 [`--setParameter saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath) 的 saslauthd Unix 域套接字文件的父目录必须授予读取和执行 (`r-x`) 权限：
>
>- 启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 的用户，或
>
>
>- 该用户所属的组。
>
>
>如果没有对 `saslauthd` 目录及其内容的指定权限，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 无法通过 `saslauthd` 成功进行身份验证。

以下教程提供了有关配置 saslauthd.conf 以使用两种流行的 LDAP 服务的基本信息：

- [Authenticate Using SASL and LDAP with OpenLDAP](https://www.mongodb.com/docs/manual/tutorial/configure-ldap-sasl-openldap/)
- [Authenticate Using SASL and LDAP with ActiveDirectory](https://www.mongodb.com/docs/manual/tutorial/configure-ldap-sasl-activedirectory/)

请参阅 `saslauthd` 的文档以及您的特定 LDAP 服务以获取指导。

**通过 LDAP 身份验证连接到 MongoDB 服务器**

要通过 LDAP 身份验证对 MongoDB 服务器进行身份验证，请在 $external 数据库上使用带有以下参数的 [`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth) ：

| 选项        | 描述                               |
| ----------- | ---------------------------------- |
| `username`  | The username to authenticate as.   |
| `password`  | The password to authenticate with. |
| `mechanism` | Set to `PLAIN`.                    |

参见

原文 - [LDAP Proxy Authentication]( https://docs.mongodb.com/manual/core/security-ldap/ )

译者：景圣

