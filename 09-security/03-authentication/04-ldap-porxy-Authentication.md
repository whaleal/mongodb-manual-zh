# LDAP 代理身份验证

[MongoDB 企业版](http://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server)支持将身份验证请求代理到轻量级目录访问协议 (LDAP) 服务。

MongoDB 支持简单和 SASL 绑定到 LDAP 服务器：

| 通过        | 描述                                                         |
| :---------- | :----------------------------------------------------------- |
| 操作系统库  | 从版本 3.4 开始，MongoDB 支持通过操作系统库绑定到 LDAP 服务器。这允许 Linux 和 Windows 上的 MongoDB 服务器使用 LDAP 服务器进行身份验证。在早期版本中，Microsoft Windows 上的 MongoDB 无法连接到 LDAP 服务器。 |
| `saslauthd` | Linux 上的 MongoDB 服务器支持通过守护进程绑定到 LDAP 服务器`saslauthd`。不适用于 Windows 上的 MongoDB。 |

## 注意事项

LDAP 的完整描述超出了本文档的范围。本页假定您事先了解 LDAP。

本文档仅描述 MongoDB LDAP 身份验证，并不替代 LDAP 上的其他资源。我们鼓励您在配置 LDAP 身份验证之前彻底熟悉 LDAP 及其相关主题。

MongoDB 可以提供[专业的服务](https://www.mongodb.com/products/consulting?tck=docs_server)为您的 MongoDB 部署优化 LDAP 身份验证配置。

### 连接池

从4.2.0版本开始，在连接LDAP服务器进行认证/授权时，MongoDB默认：

- 如果运行则使用连接池：
  - 在 Windows 或
  - 在 MongoDB Enterprise 二进制文件链接的 Linux 上 [libldap_r 。](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-libldap-vs-libldap_r)
- 如果运行则不使用连接池：
  - 在 MongoDB Enterprise 二进制文件链接的 Linux 上 [libldap 。](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-libldap-vs-libldap_r)

要更改连接池行为，请更新 [`ldapUseConnectionPool`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ldapUseConnectionPool)参数。

### `saslauthd`和目录权限

> 重要的:
>
> 指定给或的 `saslauthd`Unix 域套接字文件的父目录必须授予读取和执行 ( ) 权限：[`security.sasl.saslauthdSocketPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.sasl.saslauthdSocketPath)[`--setParameter saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath)`r-x`
>
> - 用户*启动*[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)或
> - 该用户所属的组。
>
> 如果没有对 saslauthd 目录及其内容的指定权限，mongod 或 mongos 无法通过 saslauthd 成功进行身份验证。

### `libldap`和`libldap_r`

对于链接的 MongoDB 4.2 Enterprise 二进制文件 `libldap`（例如在 RHEL 上运行时），对 的访问 `libldap`是同步的，会产生一些性能/延迟成本。

对于链接到 的 MongoDB 4.2 Enterprise 二进制文件 `libldap_r`，与早期 MongoDB 版本相比，行为没有变化。

### 在 MongoDB 服务器上管理 LDAP 用户

用户管理需要在 LDAP 服务器和 MongoDB 服务器上同时管理用户。对于通过 LDAP 进行身份验证的每个用户，MongoDB 需要数据库中的用户`$external`名与身份验证用户名完全匹配。更改 LDAP 服务器上的用户可能需要更改相应的 MongoDB`$external`用户。

要对身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[客户端会话和因果一致性保证](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)，`$external`用户名不能超过 10k 字节。

> 例子:
>
> 用户验证为`sam@dba.example.com`。MongoDB 服务器绑定到 LDAP 服务器并对用户进行身份验证，尊重任何 [`username transformations`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping). 身份验证成功后，MongoDB 服务器会检查 `$external`数据库中的用户`sam@dba.example.com`，并向经过身份验证的用户授予与该用户关联的角色和权限。

要管理 MongoDB 服务器上的用户，您必须验证为 LDAP 用户，其对应的 MongoDB`$external`用户对`$external`数据库具有用户管理权限，例如 [`userAdmin`.](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)

> 重要的:
>
> 如果没有`$external`用户拥有数据库的用户管理权限 `$external`，则无法对LDAP 认证进行用户管理。如果您在启用 LDAP 身份验证之前配置用户，但没有创建适当的用户管理员，则可能会发生这种情况。

### 管理现有的非 LDAP 用户

如果现有用户不在`$external`数据库中，则必须满足每个用户的以下要求以确保继续访问：

- 用户在 LDAP 服务器上有对应的用户对象
- 用户存在于`$external`具有等效角色和权限的数据库中

如果您想继续允许*不在*数据库上 的用户访问`$external`，则必须配置为包含和/或 适当。然后，用户必须在进行身份验证时指定 或 。[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter) [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)`SCRAM-SHA-1` `SCRAM-SHA-256` `--authenticationMechanism SCRAM-SHA-1` `SCRAM-SHA-256`

### 在副本集上部署 LDAP 身份验证

对于[副本集，在配置](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)[主成员](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)之前先 在[辅助](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员和[仲裁](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-arbiter)成员上配置 LDAP 身份验证 。这也适用于[分片副本集](https://www.mongodb.com/docs/manual/core/sharded-cluster-shards/)或[配置服务器副本集](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/#std-label-csrs)。一次配置一个副本集成员以维护大多数成员的写入可用性。

### 在分片集群上部署 LDAP 身份验证

在[分片集群中，您必须在](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)[配置服务器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-server)上为 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)集群级用户配置 LDAP 身份验证。您可以选择为分片本地用户在每个[分片](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)上配置 LDAP 授权。

## 通过操作系统 LDAP 库进行 LDAP 身份验证

通过 OS 库过程的 LDAP 身份验证总结如下：

1. 客户端向 MongoDB 进行身份验证，提供用户的凭据。

2. 如果用户名在绑定到 LDAP 服务器之前需要映射到 LDAP DN，MongoDB 可以根据配置的设置应用转换 [`security.ldap.userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)。

3. MongoDB 绑定到使用提供的用户名指定的 LDAP 服务器 [`security.ldap.servers`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.servers)，或者如果应用了转换，则使用转换后的用户名。

   MongoDB 默认使用简单绑定，但如果在and `sasl`中配置也可以使用绑定[。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.saslMechanisms)[`security.ldap.bind.method`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.method)[`security.ldap.bind.saslMechanisms`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.saslMechanisms)

   如果转换需要查询 LDAP 服务器，或者如果 LDAP 服务器不允许匿名绑定，则 MongoDB在尝试验证提供的用户凭据之前使用指定的用户名和密码[`security.ldap.bind.queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser)绑定 到 LDAP 服务器。[`security.ldap.bind.queryPassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword)

4. LDAP 服务器将绑定尝试的结果返回给 MongoDB。成功后，MongoDB 会尝试授权用户。

5. MongoDB 服务器尝试将用户名映射到数据库上的用户 `$external`，为用户分配与匹配用户关联的任何角色或权限。如果 MongoDB 找不到匹配的用户，则身份验证失败。

6. 客户端可以执行 MongoDB 授予经过身份验证的用户角色或权限的那些操作。

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)要通过操作系统库使用 LDAP 进行身份验证，请将以下设置指定为您的或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 配置文件的一部分：

| 选项                                                         | 描述                                                         | 必需的                                                       |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`security.ldap.servers`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.servers) | 以引号括起来的逗号分隔的 LDAP 服务器列表格式`host[:port]` 。 | **是的**                                                     |
| [`security.ldap.bind.method`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.method) | [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)用于指定或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 用于验证或绑定到 LDAP 服务器的方法。指定`sasl`使用 中定义的 SASL 协议之一 [`security.ldap.bind.saslMechanisms`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.saslMechanisms)默认为`simple`. | **否**，除非用于`sasl`绑定到 LDAP 服务器。                   |
| [`security.ldap.bind.saslMechanisms`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.saslMechanisms) | 用于指定 SASL 机制[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，或者 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)可以在验证或绑定到 LDAP 服务器时使用。MongoDB 和 LDAP 服务器必须就至少一种 SASL 机制达成一致。默认为`DIGEST-MD5`. | **否**，除非设置[`method`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.method)为 `sasl` *并且*您需要不同的或额外的 SASL 机制。 |
| [`security.ldap.bind.queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser) | LDAP 实体，由其专有名称 (DN) 或 SASL 名称标识，MongoDB 服务器在连接到 LDAP 服务器时使用它进行身份验证或绑定。与 一起使用[`queryPassword`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword)指定的用户必须具有适当的权限才能在 LDAP 服务器上执行查询。 | **NO**，除非将查询指定为 [`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)转换的一部分，或者如果 LDAP 服务器的安全设置不允许匿名绑定。 |
| [`security.ldap.bind.queryPassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword) | 使用 时用于验证 LDAP 服务器的密码 [`queryUser`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser) | **否**，除非指定 [`queryUser`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser) |
| [`security.ldap.bind.useOSDefaults`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.useOSDefaults) | Windows MongoDB 部署可以使用操作系统凭据代替[`queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser)连接 [`queryPassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword)到 LDAP 服务器时进行身份验证或绑定。 | **不**，除非替换[`queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser)and [`queryPassword`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword) |
| [`security.ldap.userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping) | 客户端可能会使用格式与配置的[`bind method`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.method). 例如，`simple`绑定可能需要完整的 LDAP DN，而用于向 MongoDB 进行身份验证的用户名可能是电子邮件地址。[`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)允许 MongoDB 将传入的用户名转换为与您的 LDAP 模式兼容的格式。MongoDB 支持使用替换模板或 LDAP 查询模板进行转换。如果指定将LDAP 查询用作转换的一部分的转换，则还必须为 LDAP 服务器[`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping) 指定 具有适当权限级别的[`queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser) | **否**，除非客户端使用需要转换的用户名进行身份验证。         |

## LDAP 身份验证通过`saslauthd`

> 警告:
>
> MongoDB Enterprise for Windows 不支持通过 `saslauthd`.

### 注意事项

- Linux MongoDB 服务器支持通过守护进程绑定到 LDAP 服务器 `saslauthd`。
- 在客户端和服务器之间以及`saslauthd`LDAP 服务器之间使用安全加密或受信任的连接。LDAP 服务器使用该机制，以**明文形式**`SASL PLAIN`发送和接收数据。您应该只使用受信任的渠道，例如 VPN、使用 TLS/SSL 加密的连接或受信任的有线网络。

### 配置

要使用 via 配置 MongoDB 服务器绑定到 LDAP 服务器 ，请使用以下命令行选项*或*以下配置文件设置`saslauthd`启动：[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

**命令行选项:**

- [`--auth`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--auth)启用访问控制，

- [`--setParameter`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--setParameter)设置 [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)为`PLAIN`，并且

- [`--setParameter`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--setParameter)参数 [`saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath)设置为实例的 Unix 域套接字的路径`saslauthd`。指定一个空字符串`""`以使用默认的 Unix 域套接字路径。

  包括部署所需的任何其他命令行选项。有关[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 命令行选项的完整文档，请参阅[`mongod`。](https://www.mongodb.com/docs/manual/reference/program/mongod/)

**使用配置文件:**

- [`security.authorization`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.authorization)设置`enabled`为

- `setParameter`参数 [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)设置为 `PLAIN`, 和

- `setParameter`设置[`saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath)为 saslauthd 实例的 Unix 域套接字的路径。指定一个空字符串`""`以使用默认的 Unix 域套接字路径。

  包括部署所需的任何其他配置文件设置。有关配置文件的完整文档，请参阅 [YAML 配置文件。](https://www.mongodb.com/docs/manual/reference/configuration-options/)

您需要`saslauthd.conf`使用适合您的 LDAP 服务器的参数来创建或更新该文件。记录`saslauthd.conf`不在本文档的范围内。

>重要的:
>
>指定给或的 `saslauthd`Unix 域套接字文件的父目录必须授予读取和执行 ( ) 权限：[`security.sasl.saslauthdSocketPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.sasl.saslauthdSocketPath)[`--setParameter saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath)`r-x`
>
>- 用户*启动*[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)或
>- 该用户所属的组。
>
>如果没有对目录及其内容的指定权限，则[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)无法通过身份验证成功 。`saslauthd` `saslauthd`

以下教程提供了有关配置以`saslauthd.conf`使用两种流行的 LDAP 服务的基本信息：

- [通过 OpenLDAP 使用 SASL 和 LDAP 进行身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-ldap-sasl-openldap/)
- [通过 ActiveDirectory 使用 SASL 和 LDAP 进行身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-ldap-sasl-activedirectory/)

请参阅文档`saslauthd`以及您的特定 LDAP 服务以获取指导。

## 通过 LDAP 身份验证连接到 MongoDB 服务器

要通过 LDAP 身份验证对 MongoDB 服务器进行身份验证，请 [`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth)在`$external`数据库上使用以下参数：

| 选项        | 描述                   |
| :---------- | :--------------------- |
| `username`  | 进行身份验证的用户名。 |
| `password`  | 用于验证的密码。       |
| `mechanism` | 设置为`PLAIN`。        |









翻译：韩鹏帅

原文：[LDAP Proxy Authentication](https://www.mongodb.com/docs/manual/core/security-ldap/)