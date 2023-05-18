# LDAP 授权

[MongoDB 企业版](http://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server)支持向 LDAP 服务器查询经过身份验证的用户所属的 LDAP 组。MongoDB 将每个返回组的可分辨名称 (DN) 映射到数据库中的[角色](https://www.mongodb.com/docs/manual/core/authorization/#std-label-roles)`admin`。MongoDB 根据映射的角色及其相关权限对用户进行授权。看 [LDAP 授权](https://www.mongodb.com/docs/manual/core/security-ldap-external/#std-label-security-ldap-external)了解更多信息。

LDAP 授权过程总结如下：

1. 客户端连接到 MongoDB 并使用任何 [身份验证](https://www.mongodb.com/docs/manual/core/authentication/#std-label-authentication)机制 执行身份验证[支持外部认证。](https://www.mongodb.com/docs/manual/core/security-ldap-external/#std-label-security-ldap-external-compatibility)

   要对身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[客户端会话和因果一致性保证](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)，`$external`用户名不能超过 10k 字节。

2. MongoDB 使用 [security.ldap.bind.queryUser](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser) 和 [security.ldap.bind.queryPassword](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword) 指定的凭据绑定到 [security.ldap.servers](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.servers) 指定的 LDAP 服务器。

   MongoDB 默认使用简单绑定，但如果在 [security.ldap.bind.method](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.method) 和[security.ldap.bind.saslMechanisms](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.saslMechanisms) 中配置，则可以使用 sasl 绑定。

3. MongoDB 使用 [security.ldap.authz.queryTemplate](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate) 构造一个 LDAP 查询，并查询 LDAP 服务器以获取经过身份验证的用户的组成员身份。

   MongoDB 可以使用 [security.ldap.userToDNMapping](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping) 选项转换用户名以支持查询模板。

4. LDAP 服务器评估查询并返回经过身份验证的用户所属的组列表。

5. MongoDB 通过将每个返回组的专有名称 (DN) 映射到数据库中的[角色](https://www.mongodb.com/docs/manual/core/authorization/#std-label-authorization)来授权用户在服务器上执行操作`admin`。如果返回的组 DN 与数据库中现有角色的名称完全匹配`admin`，则 MongoDB 会授予用户分配给该角色的角色和权限。看 [用于 LDAP 授权的 MongoDB 角色](https://www.mongodb.com/docs/manual/core/security-ldap-external/#std-label-security-ldap-external-roles)了解更多信息。

6. 客户端可以在 MongoDB 服务器上执行操作，这些操作需要授予经过身份验证的用户的角色或权限。

7. 在 定义的时间间隔内[`ldapUserCacheInvalidationInterval`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ldapUserCacheInvalidationInterval)，MongoDB 刷新`$external`缓存。在执行外部授权用户执行的后续操作之前，MongoDB 会从 LDAP 服务器重新获取他们的组成员身份。

## 注意事项

LDAP 的完整描述超出了本文档的范围。本页假定您事先了解 LDAP。

本文档仅描述 MongoDB LDAP 授权，并不替代 LDAP 上的其他资源。我们鼓励您在配置 LDAP 身份验证之前彻底熟悉 LDAP 及其相关主题。

MongoDB 可以提供[专业的服务](https://www.mongodb.com/products/consulting?tck=docs_server)为您的 MongoDB 部署优化 LDAP 授权配置。

### 兼容的认证机制

MongoDB 支持使用以下身份验证方法进行 LDAP 授权：

- [LDAP 代理身份验证](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-security-ldap)
- [Kerberos 认证](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-security-kerberos)
- [x.509](https://www.mongodb.com/docs/manual/core/security-x.509/#std-label-security-auth-x509)

通过此配置，MongoDB 使用 LDAP、X.509 或 Kerberos 授权来验证客户端连接。

### 连接池

从4.2.0版本开始，在连接LDAP服务器进行认证/授权时，MongoDB默认：

- 如果运行则使用连接池：
  * 在 Windows 或
  * [在 Linux 上，其中 MongoDB Enterprise 二进制文件与libldap_r](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-libldap-vs-libldap_r)链接 [。](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-libldap-vs-libldap_r)
- 如果运行则不使用连接池：
  * [在 Linux 上，其中 MongoDB Enterprise 二进制文件与libldap](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-libldap-vs-libldap_r)链接 [。](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-libldap-vs-libldap_r)

要更改连接池行为，请更新 [`ldapUseConnectionPool`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ldapUseConnectionPool)参数。

### `libldap`和`libldap_r`

对于链接的 MongoDB 4.2 Enterprise 二进制文件 `libldap`（例如在 RHEL 上运行时），对 的访问 `libldap`是同步的，会产生一些性能/延迟成本。

对于链接到 的 MongoDB 4.2 Enterprise 二进制文件 `libldap_r`，与早期 MongoDB 版本相比，行为没有变化。

### 用户管理

通过 LDAP 授权，用户创建和管理发生在 LDAP 服务器上。MongoDB 需要在数据库上创建[角色](https://www.mongodb.com/docs/manual/core/authorization/#std-label-roles)`admin` ，每个角色的名称与 LDAP 组专有名称 (DN) 完全匹配。这与 MongoDB 托管授权形成对比，后者需要在`$external`数据库上创建用户。

要管理 MongoDB 服务器上的角色，请以其组成员身份对应于具有角色管理权限的数据库角色的用户身份进行身份验证`admin`，例如[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin). 创建或更新与 LDAP 组 DN 相对应的角色，以便具有该组成员资格的用户获得适当的角色和权限。

例如，数据库管理员的 LDAP 组可能具有具有管理角色和权限的角色。用于营销或分析用户的 LDAP 组可能具有对某些数据库仅具有读取权限的角色。

> 重要的:
>
> 为相应的 LDAP 组配置角色时，请记住*所有* 具有该组成员资格的用户都可以获得配置的角色和权限。在配置 MongoDB 角色、LDAP 组或组成员身份时考虑应用最小权限原则。

如果不存在具有角色管理权限的角色*并且*不存在具有这些权限的非`$external`用户，则您实际上无法执行用户管理，因为无法更改新的或现有的角色以反映对 LDAP 服务器上的组或组成员身份的添加或更改。

要解决无法在 MongoDB 服务器上管理角色的情况，请执行以下过程：

1. 在没有身份验证和 LDAP 授权的情况下重启 MongoDB 服务器
2. 在数据库上创建一个角色`admin`，其名称对应于适当的 LDAP 组专有名称。选择组 DN 时，请考虑哪个组最适合数据库管理。
3. 使用身份验证和 LDAP 授权重新启动 MongoDB 服务器
4. 作为具有与创建的管理角色相对应的组成员身份的用户进行身份验证。

### 现有用户

使用 LDAP 进行授权的 MongoDB 服务器使 `$external`数据库上的任何现有用户都无法访问。如果数据库中存在现有用户 `$external`，则必须对数据库中的每个用户满足以下要求，`$external`以确保继续访问：

- 用户在 LDAP 服务器上有对应的用户对象
- 用户对象在适当的 LDAP 组中具有成员资格
- MongoDB 在以用户的 LDAP 组命名的数据库上具有角色`admin`，因此授予的角色和权限与授予非用户的相同`$external`。

如果您想继续允许*不在*数据库上 的用户访问`$external`，请确保 [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)参数包括 `SCRAM-SHA-1`和/或`SCRAM-SHA-256`适当。或者，应用上面列出的要求将这些用户转换为 LDAP 授权

### 副本集

对于[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)，在配置 [主要成员之前，先在](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)[次要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)成员和[仲裁](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-arbiter)成员上配置 LDAP 授权 。这也适用于[分片副本集](https://www.mongodb.com/docs/manual/core/sharded-cluster-shards/)或[配置服务器副本集](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/#std-label-csrs)。一次配置一个副本集成员以维护大多数成员的写入可用性。

### 分片集群

在[分片集群中，您必须在](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)[配置服务器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-server)上为集群级用户配置 LDAP 授权。您可以选择为分片本地用户在每个[分片](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)上配置 LDAP 授权 。

## 配置

您必须配置以下设置才能使用 LDAP 授权：

要通过操作系统库使用 LDAP 进行授权，请将以下设置指定为您的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 配置文件的一部分：

| 选项                                                         | 描述                                                         | 必需的                                                       |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`security.ldap.servers`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.servers) | 以引号括起来的逗号分隔的 LDAP 服务器列表格式`host[:port]` 。 | **是的**                                                     |
| [`security.ldap.authz.queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate) | 一个[RFC4515](https://tools.ietf.org/html/rfc4515)和[RFC4516](https://tools.ietf.org/html/rfc4516)MongoDB 执行的 LDAP 格式查询 URL 模板，用于获取用户所属的 LDAP 组。查询是相对于 中指定的一个或多个主机的[`servers`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.servers)您可以在模板中使用以下标记：`{USER}`将经过身份验证的用户名或 [`transformed`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping) 用户名替换到 LDAP 查询中。`{PROVIDED_USER}`将提供的用户名（即在身份验证或 LDAP 转换之前）替换为 LDAP 查询。（*从 4.2 版开始可用*）仅[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)支持该参数。[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 遵从在其[配置服务器上配置的此设置](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-server) | **是的**                                                     |
| [`security.ldap.bind.queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser) | MongoDB 服务器在连接到 LDAP 服务器并在其上执行操作和查询时绑定的身份。与 一起使用[`queryPassword`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword)指定的用户必须具有适当的权限以支持从配置的 [`queryTemplate`.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate) | **是的**                                                     |
| [`security.ldap.bind.queryPassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword) | 使用 时用于绑定到 LDAP 服务器的密码 [`queryUser`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser) | **是的**                                                     |
| [`security.ldap.bind.method`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.method) | [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)用于指定或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 用于验证或绑定到 LDAP 服务器的方法。指定`sasl`使用 中定义的 SASL 协议之一 [`security.ldap.bind.saslMechanisms`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.saslMechanisms)默认为`simple`. | **否**，除非用于`sasl`绑定到 LDAP 服务器。                   |
| [`security.ldap.bind.saslMechanisms`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.saslMechanisms) | 用于指定 SASL 机制[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，或者 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)可以在验证或绑定到 LDAP 服务器时使用。MongoDB 和 LDAP 服务器必须就至少一种 SASL 机制达成一致。默认为`DIGEST-MD5`. | **否**，除非设置[`method`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.method)为 `sasl`，并且您需要不同的或额外的 SASL 机制。 |
| [`security.ldap.bind.useOSDefaults`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.useOSDefaults) | Windows MongoDB 部署可以使用操作系统凭据代替[`queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser)连接 [`queryPassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword)到 LDAP 服务器时进行身份验证或绑定。 | **不**，除非替换[`queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser)and [`queryPassword`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword) |
| [`security.ldap.userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping) | 根据您的[`queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)，经过身份验证的客户端用户名可能需要转换以支持 LDAP 查询 URL。 [`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)允许 MongoDB 转换传入的用户名。 | **否**，除非客户端用户名需要转换为 LDAP DN。                 |

配置 LDAP 授权后，重新启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-program-mongod)或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-program-mongos). 服务器现在使用 X.509、Kerberos 或 LDAP 的 LDAP 授权来验证客户端连接。

### LDAP 查询模板

MongoDB 使用[`security.ldap.authz.queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)创建一个 [RFC4516](https://tools.ietf.org/html/rfc4516)格式化的 LDAP 查询 URL。在模板中，您可以使用：

- `{USER}`占位符，用于将经过身份验证的用户名替换为 LDAP 查询 URL。如果 MongoDB 使用 转换用户名 [`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)，MongoDB `{USER}`在构造 LDAP 查询 URL 时用转换后的用户名替换令牌。
- `{PROVIDED_USER}`占位符将提供的用户名替换为 LDAP 查询，即在身份验证或 LDAP 转换之前。

设计查询模板以检索用户组。

> 例子:
>
> 以下查询模板返回 LDAP 用户对象`memberOf`属性中列出的任何组。此查询假定该`memberOf` 属性存在 - 您的特定 LDAP 部署可能使用不同的属性或方法来跟踪组成员身份。此查询还假设用户使用完整的 LDAP DN 作为用户名进行身份验证。
>
> ```
> "{USER}?memberOf?base"
> ```

LDAP 查询 URL 必须符合中定义的格式[RFC4516](https://tools.ietf.org/html/rfc4516):

```
[ dn  [ ? [attributes] [ ? [scope] [ ? [filter] [ ? [Extensions] ] ] ] ] ]
```

考虑每个组件的定义，引用自 RFC4516：

> 这`dn`是一个 LDAP 可分辨名称，使用中描述的字符串格式[RFC4514](https://tools.ietf.org/html/rfc4514). 它标识 LDAP 搜索的基本对象或非搜索操作的目标。
>
> 该`attributes`构造用于指示应从一个或多个条目返回哪些属性。
>
> 该`scope`构造用于指定要在给定 LDAP 服务器中执行的搜索范围。允许的范围是基本对象搜索的“base”、一级搜索的“one”或子树搜索的“sub”。
>
> 用于指定搜索过滤`filter`器以在搜索期间应用于指定范围内的条目。它具有 [RFC4515] 中指定的格式。
>
> 该`extensions`构造为 LDAP URL 提供了一种可扩展性机制，允许在将来扩展 URL 的功能。

如果查询包含`attribute`，MongoDB 假定查询检索到该实体所属的 DN。

如果查询不包含属性，MongoDB 假定查询检索用户所属的所有实体。

MongoDB 当前忽略 LDAP 查询中指定的任何扩展。

> 重要的:
>
> RFC4516 或 LDAP 查询 URL 构造的完整描述超出了本文档的范围。

## 教程

以下教程包含通过操作系统 LDAP 库连接到 LDAP 服务器的过程：

* [通过本机 LDAP 使用 Active Directory 对用户进行身份验证和授权](https://www.mongodb.com/docs/manual/tutorial/authenticate-nativeldap-activedirectory/)
* [使用 Kerberos 身份验证和 Active Directory 授权配置 MongoDB](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/)

## 使用 LDAP 授权连接到 MongoDB 服务器

使用 LDAP 进行授权时，用户通过 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)必须：

* 放[`--authenticationDatabase`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationDatabase)到`$external`。

* 放[`--authenticationMechanism`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationMechanism)到适当的身份验证机制。

  如果使用[LDAP 身份验证](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-security-ldap)，请将其设置为`PLAIN`。

  如果使用[Kerberos 身份验证](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-security-kerberos)，请将其设置为 `GSSAPI`。

  如果使用[x.509](https://www.mongodb.com/docs/manual/core/security-x.509/#std-label-security-auth-x509)，请将其设置为`MONGODB-X.509`。

* 放[`--username`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--username)到尊重 [`security.ldap.authz.queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)或任何配置 [`security.ldap.userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)模板的用户名。

* 放[`--password`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password)到适当的密码。

包括[`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host)和[`--port`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--port)MongoDB 服务器的配置，以及与您的部署相关的任何其他选项。

例如，以下操作向使用 LDAP 身份验证和授权运行的 MongoDB 服务器进行身份验证：

```
mongosh --username alice@dba.example.com --password  --authenticationDatabase '$external' --authenticationMechanism "PLAIN"  --host "mongodb.example.com" --port 27017
```

如果您不指定密码[`--password`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password)命令行选项，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 提示输入密码。

> 重要的:
>
> 参数`$external`必须放在单引号中，而不是双引号中，以防止 shell 解释`$external` 为变量。

## 用于 LDAP 授权的 MongoDB 角色

MongoDB 将 LDAP 返回的每个返回组专有名称 (DN) 映射到数据库中的[`query`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)一个 [角色](https://www.mongodb.com/docs/manual/core/authorization/#std-label-authorization)`admin`。

如果 MongoDB 获得一个组，其 DN与现有角色的名称 **完全**匹配，MongoDB 将授予经过身份验证的用户角色和与该角色关联的[权限。](https://www.mongodb.com/docs/manual/core/authorization/#std-label-privileges)如果 MongoDB 无法将任何返回的组映射到角色，则 MongoDB 不会向用户授予任何权限。

> 笔记:
>
> [LDAP](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-security-ldap)和[kerberos](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-security-kerberos) 身份验证通常需要在数据库中创建用户`$external` 。如果还使用LDAP 进行授权，则不需要*在*数据库中创建用户`$external`。您只需要在数据库中创建适当的角色`admin`。用户仍然对`$external`数据库进行身份验证。

> 重要的:
>
> 如果您使用 LDAP 进行授权并且您的 LDAP 组 DN 包含[RFC4514](https://tools.ietf.org/html/rfc4514)转义序列，您在数据库中创建的角色`admin`也必须遵循 RFC4514 进行转义。

> 例子:
>
> 数据库在`admin`数据库上配置了以下角色：
>
> ```
> {
>     role: "CN=dba,CN=Users,DC=example,DC=com",
>     privileges: [],
>     roles: [ "dbAdminAnyDatabase", "clusterAdmin" ]
> }
> {
>    role: "CN=analytics,CN=Users,DC=example,DC=com"
>    privileges: [],
>    roles: [
>          { role : "read", db : "web_statistics" },
>          { role : "read", db : "user_statistics" }
>        ]
> }
> ```
>
> `alice@dba.example.com`根据数据库对 用户进行身份验证后`$external`，MongoDB 服务器执行从配置中派生的查询[`query template`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)，以检索包含经过身份验证的用户作为成员的组。在此示例中，MongoDB 服务器为用户检索以下组 DN：
>
> ```
> dn:CN=dba,CN=Users,dc=example,dc=com
> dn:CN=admin,CN=Users,dc=example,dc=com
> ```
>
> MongoDB 将这些组 DN 映射到`admin`数据库中的角色。第一个组 DN 匹配第一个角色，MongoDB 授予经过身份验证的用户其角色和权限。第二组 DN 不匹配服务器上的任何角色，因此 MongoDB 不授予额外的权限。
>
> 新用户`bob@analytics.example.com`对 `$external`数据库进行身份验证。MongoDB 服务器使用查询模板中提供的用户名重复查询过程。在此示例中，MongoDB 服务器为用户检索以下组 DN：
>
> ```
> dn:cn=analytics,CN=Users,dc=example,dc=com
> ```
>
> MongoDB 将这些组 DN 映射到数据库中的角色`admin`，并授予经过身份验证的用户第二个角色的角色和特权。
>
> 新用户`workstation@guest.example.com`对 `$external`数据库进行身份验证。MongoDB 服务器使用查询模板中提供的用户名重复查询过程。在此示例中，MongoDB 服务器为用户检索以下组 DN：
>
> ```
> dn:cn=guest,CN=Users,dc=example,dc=com
> ```
>
> MongoDB 将组映射到`admin`数据库中的一个角色，并且由于不存在匹配的角色，因此不会授予用户额外的权限。









译者：韩鹏帅

原文：[LDAP Authorization](https://www.mongodb.com/docs/manual/core/security-ldap-external/)
