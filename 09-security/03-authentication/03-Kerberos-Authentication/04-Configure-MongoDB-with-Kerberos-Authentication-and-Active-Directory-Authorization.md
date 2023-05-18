# 使用 Kerberos 身份验证和 Active Directory 授权配置 MongoDB

[MongoDB 企业版](http://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server)支持向 LDAP 服务器查询经过身份验证的用户所属的 LDAP 组。MongoDB 将每个返回组的 LDAP 专有名称 (DN) 映射到数据库中的[角色](https://www.mongodb.com/docs/manual/core/authorization/#std-label-roles)`admin`。MongoDB 根据映射的角色及其相关权限对用户进行授权。有关详细信息，请参阅 [LDAP 授权。](https://www.mongodb.com/docs/manual/core/security-ldap-external/#std-label-security-ldap-external)

MongoDB Enterprise 支持使用[Kerberos 服务](https://www.mongodb.com/docs/manual/core/kerberos/)进行身份验证。Kerberos 是用于大型客户端/服务器系统的行业标准身份验证协议。

本教程介绍如何配置 MongoDB 以通过平台库通过 Kerberos 服务器执行身份验证并通过 Active Directory (AD) 服务器执行授权。

## 先决条件

> 重要的:
>
> 在继续之前，请彻底熟悉以下主题：
>
> - [Kerberos 认证](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-security-kerberos)
> - [LDAP 授权](https://www.mongodb.com/docs/manual/core/security-ldap-external/#std-label-security-ldap-external)
> - [活动目录](https://msdn.microsoft.com/en-us/library/bb742424.aspx)

AD的完整描述超出了本教程的范围。本教程假定您具有AD的先验知识。

MongoDB 支持使用 SASL 机制在 MongoDB 服务器和AD之间进行绑定。SASL、SASL 机制或给定 SASL 机制的特定AD配置要求的完整描述超出了本教程的范围。本教程假定您事先了解 SASL 及其相关主题。

设置和配置 Kerberos 部署超出了本文档的范围。本教程假设您已经为 MongoDB 部署中的每个 实例配置了 [Kerberos 服务主体](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-kerberos-service-principal)，并且您为每个实例都拥有一个有效的[密钥表文件](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

对于副本集和分片集群，请确保您的配置使用完全限定的域名 (FQDN) 而不是 IP 地址或不合格的主机名。您必须使用 GSSAPI 的 FQDN 才能正确解析 Kerberos 领域并允许您进行连接。

要验证您使用的是 MongoDB Enterprise，请将`--version` 命令行选项传递给[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or [`mongos`：](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

```
mongod --version
```

在此命令的输出中，查找字符串`modules: subscription`或`modules: enterprise`确认您使用的是 MongoDB Enterprise 二进制文件。

## 注意事项

本教程介绍了为 Kerberos 身份验证和 AD授权配置 MongoDB.

要在您自己的 MongoDB 服务器上执行此过程，您必须根据您自己的特定基础架构修改给定的过程，尤其是 Kerberos 配置、构建AD查询或管理用户

### 传输层安全

默认情况下，MongoDB 在绑定到AD服务器时会创建 TLS/SSL 连接。这需要配置 MongoDB 服务器的主机以访问 AD 服务器的证书颁发机构 (CA) 证书。

本教程提供了所需主机配置的说明

本教程假设您有权访问 AD 服务器的 CA 证书，并且可以在 MongoDB 服务器上创建证书的副本。

### 示例 Active Directory 架构

本教程使用以下示例AD对象作为提供的查询、配置和输出的基础。每个对象仅显示可能属性的一个子集。

用户对象

```shell
dn:CN=bob,CN=Users,DC=marketing,DC=example,DC=com
userPrincipalName: bob@marketing.example.com
memberOf: CN=marketing,CN=Users,DC=example,DC=com

dn:CN=alice,CN=Users,DC=engineering,DC=example,DC=com
userPrincipalName: alice@engineering.example.com
memberOf: CN=web,CN=Users,DC=example,DC=com
memberOf: CN=PrimaryApplication,CN=Users,DC=example,DC=com

dn:CN=sam,CN=Users,DC=dba,DC=example,DC=com
userPrincipalName: sam@dba.example.com
memberOf: CN=dba,CN=Users,DC=example,DC=com
memberOf: CN=PrimaryApplication,CN=Users,DC=example,DC=com

dn:CN=joe,CN=Users,DC=analytics,DC=example,DC=com
userPrincipalName: joe@analytics.example.com
memberof: CN=marketing,CN=Users,DC=example,DC=com
```

#### 组对象

```shell
dn:CN=marketing,CN=Users,DC=example,DC=com
member:CN=bob,CN=Users,DC=marketing,DC=example,DC=com
member:CN=joe,CN=Users,DC=analytics,DC=example,DC=com

dn:CN=engineering,CN=Users,DC=example,DC=com
member:CN=web,CN=Users,DC=example,DC=com
member:CN=dba,CN=users,DC=example,DC=com

dn:CN=web,CN=Users,DC=example,DC=com
member:CN=alice,CN=Users,DC=engineering,DC=example,DC=com

dn:CN=dba,CN=Users,DC=example,DC=com
member:CN=sam,CN=Users,DC=dba,DC=example,DC=com

dn:CN=PrimaryApplication,CN=Users,DC=example,DC=com
member:CN=sam,CN=Users,DC=dba,DC=example,DC=com
member:CN=alice,CN=Users,DC=engineering,DC=example,DC=com
```

### 活动目录凭据

本教程使用用户名和密码在AD服务器上执行查询 。提供的凭据必须在 AD 服务器上具有足够的权限以支持与 [`security.ldap.userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)或 相关的查询[`security.ldap.authz.queryTemplate`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)

### 副本集

MongoDB LDAP 授权要求副本集中的*每个* [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)副本至少在 MongoDB 3.4.0 或更高版本上。

### 分片集群

MongoDB LDAP 授权要求分片集群中的*每个* [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)至少在 MongoDB 3.4.0 或更高版本上。

## 程序

1. 为运行 MongoDB 的服务器配置 TLS/SSL。

   要通过 TLS/SSL 连接到AD[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) (AD) 服务器，需要[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)访问AD服务器的证书颁发机构 (CA) 证书。

   在 Linux 上，通过文件中的或选项指定AD服务器的 CA 证书。`TLS_CACERT``TLS_CACERTDIR``ldap.conf`

   您平台的包管理器`ldap.conf`在安装 MongoDB Enterprise 的`libldap`依赖项时创建文件。有关配置文件或引用选项的完整文档，请参阅 [配置文件](http://www.openldap.org/software/man.cgi?query=ldap.conf).

   在 Microsoft Windows上，使用平台的凭据管理工具加载AD服务器的证书颁发机构 (CA) 证书。确切的凭据管理工具取决于Windows版本。要使用该工具，请参阅适用于您的Windows版本的文档。

   如果[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)不能访问AD CA 文件，他们就无法创建到 Active Directory 服务器的 TLS/SSL 连接。

   或者，设置[`security.ldap.transportSecurity`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.transportSecurity)为`none` 禁用 TLS/SSL。

   > 警告:
   >
   > 设置[`transportSecurity`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.transportSecurity)为在 MongoDB 和AD`none`服务器之间传输明文信息，包括用户凭据。

2. （仅限 Windows）将服务主体名称分配给 MongoDB Windows 服务。

   对于在Windows 操作系统上运行的 MongoDB 服务器，您必须使用[setspn.exe](https://technet.microsoft.com/en-us/library/cc731241(v=ws.11).aspx)将服务主体名称 (SPN) 分配给运行 MongoDB 服务的帐户。

   ```shell
   setspn.exe -S <service>/<fully qualified domain name> <service account name>
   ```

   > 例子:
   >
   > 例如，如果 a[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)作为名为`mongodb`on 的服务运行，`mongodbserver.example.com`服务帐户名称为 `mongodb_dev@example.com`，则分配 SPN 的命令如下所示：
   >
   > ```shell
   > setspn.exe -S mongodb/mongodbserver.example.com mongodb_dev@example.com
   > ```

   > 笔记:
   >
   > Windows Server 2003 不支持 `setspn.exe -S`。有关 的完整文档`setspn.exe`，请参阅 [setspn.exe](https://technet.microsoft.com/en-us/library/cc731241(v=ws.11).aspx).

3. （仅限 Linux）为 MongoDB 服务器创建密钥表文件。

   对于在 Linux 平台上运行的 MongoDB 服务器，您必须确保服务器具有特定于在该服务器上运行的 MongoDB 实例的[密钥表文件的副本。](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)

   您必须授予运行 MongoDB 服务的 Linux 用户对密钥表文件的读取权限。记下密钥表文件位置的完整路径。

4. 连接到 MongoDB 服务器。

   使用以下命令连接到 MongoDB 服务器[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)使用 [`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host)和[`--port`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--port)选项。

   ```shell
   mongosh --host <hostname> --port <port>
   ```

   如果您的 MongoDB 服务器当前强制执行身份验证，则您必须`admin`以具有角色管理权限的用户身份向数据库进行身份验证，例如[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)或 提供的权限[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)。包括适当的 [`--authenticationMechanism`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationMechanism)用于 MongoDB 服务器配置的身份验证机制。

   ```
   mongosh --host <hostname> --port <port> --username <user> --password <pass> --authenticationDatabase="admin" --authenticationMechanism="<mechanism>"
   ```

   > 笔记:
   >
   > 对于Windows MongoDB 部署，您应该替换[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)和 [`mongo.exe`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)

5. 创建用户管理角色

   要使用AD管理 MongoDB 用户，您需要在数据库上创建至少一个`admin`可以创建和管理角色的角色，例如[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)或 提供的角色[`userAdminAnyDatabase`。](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)

   角色的名称必须与AD组的可分辨名称完全匹配。该组必须至少有一个AD用户作为成员。

   鉴于可用[活动目录组](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/#std-label-kerb-auth-ldap-authz-groupObj)，以下操作：

   * 创建一个以AD组 命名的角色`CN=dba,CN=Users,DC=example,DC=com`，以及
   * 为其分配数据库[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)中的角色`admin` 。

   ```
   var admin = db.getSiblingDB("admin")
   admin.createRole(
      {
        role: "CN=dba,CN=Users,DC=example,DC=com",
        privileges: [],
        roles: [ "userAdminAnyDatabase" ]
      }
   )
   ```

   您也可以[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)为用户应具有用户管理权限的每个数据库授予角色。这些角色为角色创建和管理提供了必要的权限。

   > 重要的:
   >
   > 考虑应用[最小特权原则](https://www.us-cert.gov/bsi/articles/knowledge/principles/least-privilege) 在配置 MongoDB 角色、AD组或组成员身份时。

6. 创建 MongoDB 配置文件。

   MongoDB[配置文件](https://www.mongodb.com/docs/manual/administration/configuration/)是一个带有文件扩展名的纯文本 YAML 文件`.conf`。

   - 如果您要升级现有的 MongoDB 部署，请复制当前配置文件并从该副本开始工作。
   - （仅限 Linux）如果这是新部署*并且*您使用平台的包管理器安装 MongoDB Enterprise，则安装包括`/etc/mongod.conf`默认配置文件。使用该默认配置文件，或制作该文件的副本以供使用。
   - 如果不存在这样的文件，则创建一个具有扩展名的空文件`.conf`并从该新配置文件开始工作。

7. 配置 MongoDB 以连接到 Active Directory。

   在MongoDB配置文件中，设置AD[`security.ldap.servers`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.servers)服务器的主机和端口。如果您的 AD基础设施包括多个用于复制目的的 AD服务器，请将服务器的主机和端口指定为以逗号分隔的列表到[.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.servers)[`security.ldap.servers`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.servers)

   > 例子:
   >
   > 要连接到位于 的 AD`activedirectory.example.net`服务器，请在配置文件中包含以下内容：
   >
   > ```
   > security:
   >   ldap:
   >     servers: "activedirectory.example.net"
   > ```

   MongoDB 必须绑定到AD服务器才能执行查询。默认情况下，MongoDB 使用简单的身份验证机制将自己绑定到AD服务器。

   或者，您可以在配置文件中配置以下设置以使用绑定到AD服务器`SASL`：

   - 设为[`security.ldap.bind.method`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.method)_`sasl`
   - [`security.ldap.bind.saslMechanisms`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.saslMechanisms), 指定AD服务器支持的逗号分隔的 SASL 机制字符串。

   本教程使用默认的`simple`LDAP 身份验证机制。

8. 配置 MongoDB 以进行 Kerberos 身份验证

   在 MongoDB 配置文件中， 设置[`security.authorization`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.authorization)为 `enabled`和[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter) [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)`GSSAPI`

   要通过 Kerberos 启用身份验证，请在配置文件中包含以下内容：

   ```
   security:
     authorization: "enabled"
   setParameter:
     authenticationMechanisms: "GSSAPI"
   ```

9. 配置用于授权的 LDAP 查询模板

   在 MongoDB 配置文件中，设置 [`security.ldap.authz.queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)为[RFC4516](https://tools.ietf.org/html/rfc4516)格式化的 LDAP 查询 URL 模板。

   在模板中，您可以使用：

   * `{USER}`占位符，用于将经过身份验证的用户名替换为 LDAP 查询 URL。
   * `{PROVIDED_USER}`占位符将提供的用户名替换为 LDAP 查询，即在身份验证或 LDAP 转换之前。（*从 4.2 版开始可用*）

   设计查询模板以检索用户组。

   >笔记:
   >
   >的完整描述[RFC4515](https://tools.ietf.org/html/rfc4515)、RFC4516 或AD查询超出了本教程的范围。本教程中提供[`queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)的仅为示例，可能不适用于您的特定AD部署。

   > 例子:
   >
   > 以下查询模板返回列为`{USER}`成员的任何组，遵循递归组成员身份。此 LDAP 查询假定组对象通过使用属性存储完整的用户专有名称 (DN) 来跟踪用户成员资格`member`。查询包括AD特定的匹配规则 OID `1.2.840.113556.1.4.1941`[LDAP_MATCHING_RULE_IN_CHAIN](https://msdn.microsoft.com/en-us/library/aa746475(v=vs.85).aspx). 此匹配规则是AD特定于 LDAP 搜索过滤器的扩展。
   >
   > ```shell
   > security:
   >   ldap:
   >     authz:
   >       queryTemplate:
   >         "DC=example,DC=com??sub?(&(objectClass=group)(member:1.2.840.113556.1.4.1941:={USER}))"
   > ```
   >
   > 使用查询模板，MongoDB 替换`{USER}`为经过身份验证的用户名来查询 LDAP 服务器。
   >
   > 例如，用户验证为 `CN=sam,CN=Users,DC=dba,DC=example,DC=com`。MongoDB 创建一个基于 的 LDAP 查询[`queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)，`{USER}`用经过身份验证的用户名替换令牌。Active Directory 服务器对直接或间接将用户列为成员的任何组执行递归组查找。基于 [活动目录组](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/#std-label-kerb-auth-ldap-authz-groupObj), AD服务器返回 `CN=dba,CN=Users,DC=example,DC=com`和 `CN=engineering,CN=Users,DC=example,DC=com`。

   MongoDB 将每个返回的组DN映射到数据库中的一个角色`admin`。对于每个映射组DN，如果数据库中存在名称与DN`admin`完全匹配的现有角色，则 MongoDB 会授予用户分配给该角色的角色和权限。

   匹配规则需要提供身份验证用户的`LDAP_MATCHING_RULE_IN_CHAIN`完整DN 。由于 Kerberos 需要使用用户的 进行身份验证`userPrincipalName`，因此您必须 使用将传入的用户名转换为DN[`security.ldap.userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)。下一步提供有关转换传入用户名以支持 [`queryTemplate`.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)

10. 通过 Active Directory 转换传入的用户名以进行身份验证。

    在 MongoDB 配置文件中，设置 [`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)将身份验证用户提供的用户名转换为AD DN 以支持[`queryTemplate`.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)

    > 例子:
    >
    > 以下[`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)配置使用`match`正则表达式过滤器来捕获提供的用户名。MongoDB`ldapQuery` 在执行查询之前将捕获的用户名插入到查询模板中。
    >
    > ```
    > security:
    >   ldap:
    >     userToDNMapping:
    >       '[
    >          {
    >             match : "(.+)",
    >             ldapQuery: "DC=example,DC=com??sub?(userPrincipalName={0})"
    >          }
    >     ]'
    > ```

    您必须修改给定的示例配置以匹配您的部署。例如，`ldapQuery`基本DN必须与包含您的用户实体的基本DN相匹配。可能需要进行其他修改以支持您的AD部署。

    > 例子:
    >
    > 用户验证为`alice@ENGINEERING.EXAMPLE.COM`。MongoDB 首先应用 [`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping). 基于提供的配置，MongoDB 捕获阶段中的用户名`match`并执行 LDAP 查询：
    >
    > ```
    > DC=example,DC=com??sub?(userPrincipalName=alice@ENGINEERING.EXAMPLE.COM)
    > ```
    >
    > 基于配置的[活动目录用户](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/#std-label-kerb-auth-ldap-authz-userObj)，AD 服务器应该返回
    >
    > `CN=alice,CN=Users,DC=engineering,DC=example,DC=com`。
    >
    > MongoDB 然后执行中配置的 LDAP 查询 [`queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)，用*转换后的*用户名 替换`{USER}` 令牌。
    >
    > `CN=alice,CN=Users,DC=engineering,DC=example,DC=com`

    > 重要的:
    >
    > 如果使用[`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)的 `substitution`参数来转换组名，则替换的结果**必须**是[RFC4514](https://www.ietf.org/rfc/rfc4514.txt)转义字符串。

11. 配置查询凭据

    MongoDB 需要凭据才能在AD服务器上执行查询

    在配置文件中配置以下设置：

    * [`security.ldap.bind.queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser)，指定 Kerberos 用户 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或绑定在AD[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)服务器上执行查询。
    * [`security.ldap.bind.queryPassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword), 为指定的 指定密码[`queryUser`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser)

    ```
    security:
      ldap:
        bind:
          queryUser: "mongodbadmin@dba.example.com"
          queryPassword: "secret123"
    ```

    在Windows MongoDB 服务器上，您可以设置 [`security.ldap.bind.useOSDefaults`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.useOSDefaults)为`true`使用操作系统用户的凭据而不是`queryUser`和`queryPassword`。

    必须[`queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser)有权代表 MongoDB 执行所有 LDAP 查询。

12. 可选：添加其他配置设置

    根据您的配置需要包括其他选项。例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定设置[`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)。有关详细信息，请参阅[本地主机绑定兼容性更改。](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

13. 使用 Kerberos 身份验证和 Active Directory 授权启动 MongoDB 服务器。

    使用选项启动 MongoDB 服务器[`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config)，指定在此过程中创建的配置文件的路径。如果 MongoDB 服务器当前正在运行，请做好停止服务器的适当准备。

    `Linux MongoDB Servers`

    在 Linux 上，您必须指定`KRB5_KTNAME`环境变量，指定 MongoDB 服务器的密钥表文件的路径。

    ```
    env KRB5_KTNAME <path-to-keytab> mongod --config <path-to-config-file>
    ```

    `Microsoft Windows MongoDB Servers`

    在Windows上，您必须按照之前在过程中配置的服务主体帐户启动 MongoDB 服务器：

    ```
    mongod.exe --config <path-to-config-file>
    ```

14. 连接到 MongoDB 服务器。

    连接到 MongoDB 服务器，以用户身份进行身份验证，该用户的直接或传递组成员身份对应于数据库上`admin` 具有[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)、[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)或具有等效权限的自定义角色的 MongoDB 角色。

    使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)要向 MongoDB 服务器进行身份验证，请设置以下选项

    * [`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host)使用 MongoDB 服务器的主机名
    * [`--port`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--port)使用 MongoDB 服务器的端口
    * [`--username`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--username)给用户的`userPrincipalName`
    * [`--password`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password)到用户的密码（或省略[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)提示输入密码）
    * [`--authenticationMechanism`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationMechanism)到`"GSSAPI"`
    * [`--authenticationDatabase`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationDatabase)到`"$external"`

    > 例子:
    >
    > 在此过程的前面，您 `dn:CN=dba,CN=Users,DC=example,DC=com`为`admin`数据库配置了具有所需权限的角色。这个角色对应一个AD组。基于配置的[广告用户](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/#std-label-kerb-auth-ldap-authz-userObj)，您可以作为用户进行身份验证 `sam@dba.example.com`并获得所需的权限。
    >
    > ```
    > mongosh --username sam@DBA.EXAMPLE.COM --password  --authenticationMechanisms="GSSAPI" --authenticationDatabase "$external" --host <hostname> --port <port>
    > ```
    >
    > 如果您不指定密码[`-p`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password)命令行选项，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 提示输入密码。

    Windows MongoDB 部署必须使用 [`mongo.exe`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)而不是[`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

    给定配置[活动目录用户](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/#std-label-kerb-auth-ldap-authz-userObj)，用户成功验证并获得适当的权限。

    > 笔记:
    >
    > 如果您想以现有非`$external`用户身份进行身份验证，请设置 [`--authenticationMechanism`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationMechanism)到 SCRAM 身份验证机制（例如`SCRAM-SHA-1`或`SCRAM-SHA-256`）。这要求 MongoDB 服务器包含和/或适当。[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter) [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)`SCRAM-SHA-1``SCRAM-SHA-256`

15. 创建用于映射返回的AD组的角色.

    对于您希望用于 MongoDB 授权的AD服务器上的每个组，您必须在 MongoDB 服务器的`admin`数据库上创建一个匹配的角色。

    >例子:
    >
    >以下操作创建一个以AD组 DN命名的角色`CN=PrimaryApplication,CN=Users,DC=example,DC=com`，分配适合该组的角色和权限：
    >
    >```
    >db.getSiblingDB("admin").createRole(
    >   {
    >     role: "CN=PrimaryApplication,CN=Users,DC=example,DC=com",
    >     privileges: [],
    >     roles: [
    >       { role: "readWrite", db: "PrimaryApplication" }
    >     ]
    >   }
    >)
    >```
    >
    >给定配置[活动目录组](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/#std-label-kerb-auth-ldap-authz-groupObj), MongoDB 授予用户身份验证为`sam@DBA.EXAMPLE.COM`or数据库上的`alice@ENGINEERING.EXAMPLE.COM`角色 。[`readWrite`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWrite)`PrimaryApplication`

    > 笔记:
    >
    > 要管理数据库中的角色，您必须被认证为具有on 、 或具有等效权限的自定义角色 on 的`admin`用户。[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)`admin`[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)

16. 可选：将现有用户从 Active Directory 服务器转移`$external`到 Active Directory 服务器。

    如果在数据库上配置[用户](https://www.mongodb.com/docs/manual/core/security-users/#std-label-users)升级现有安装`$external`，则必须满足每个用户的以下要求，以确保在为 Kerberos 身份验证和AD授权配置 MongoDB 后访问：

    * 用户在AD服务器上有对应的用户对象 。
    * 用户在AD服务器上具有相应组的成员身份。
    * `admin`MongoDB 包含以用户的 AD组命名的数据库角色，这样授权用户保留其特权。

    > 例子:
    >
    > 数据库中存在以下用户`$external`：
    >
    > ```
    > {
    >   user : "joe@ANALYTICS.EXAMPLE.COM",
    >   roles: [
    >     { role : "read", db : "web_analytics" },
    >     { role : "read", db : "PrimaryApplication" }
    >   ]
    > }
    > ```
    >
    > 假设用户属于AD组 `CN=marketing,CN=Users,DC=example,DC=com`，以下操作创建具有适当权限的匹配角色：
    >
    > ```
    > db.getSiblingDB("admin").createRole(
    >    {
    >      role: "CN=marketing,CN=Users,DC=example,DC=com",
    >      privileges: [],
    >      roles: [
    >        { role: "read", db: "web_analytics" }
    >        { role: "read", db: "PrimaryApplication" }
    >      ]
    >    }
    > )
    > ```
    >
    > 基于配置的[`queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)，MongoDB 授权任何在组中具有直接或传递成员资格的用户 对和 数据库`CN=marketing,CN=Users,DC=example,DC=com`执行 [`read`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-read)操作。`web_analytics``PrimaryApplication`

    > 重要的:
    >
    > 为相应的AD组配置角色时 ，请记住*所有*具有该组成员资格的用户都可以获得分配的角色和权限。考虑应用 [最小特权原则](https://www.us-cert.gov/bsi/articles/knowledge/principles/least-privilege) 在配置 MongoDB 角色、AD组或组成员身份时。

    如果您想继续允许非`$external`数据库用户访问 MongoDB，您必须在配置选项中包含 SCRAM 身份验证机制（例如`SCRAM-SHA-1`和/或`SCRAM-SHA-256`） 。[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter) [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)

    ```
    setParameter:
      authenticationMechanisms: "GSSAPI,SCRAM-SHA-1,SCRAM-SHA-256"
    ```

    或者，按照上述过程将非`$external`用户转换为AD 

此过程生成以下配置文件：

```
security:
   authorization: "enabled"
   ldap:
      servers: activedirectory.example.net"
      bind:
         queryUser: "mongodbadmin@dba.example.com"
         queryPassword: "secret123"
      userToDNMapping:
         '[
            {
               match: "(.+)"
               ldapQuery: "DC=example,DC=com??sub?(userPrincipalName={0})"
            }
         ]'
      authz:
         queryTemplate: "DC=example,DC=com??sub?(&(objectClass=group)(member:1.2.840.113556.1.4.1941:={USER}))"
setParameter:
   authenticationMechanisms: "GSSAPI"
```

> 重要的:
>
> 给定的示例配置需要修改以匹配您的AD架构、目录结构和配置。您可能还需要用于部署的其他[配置文件选项。](https://www.mongodb.com/docs/manual/reference/configuration-options/)

有关配置角色和权限的更多信息，请参阅：

- [基于角色的访问控制](https://www.mongodb.com/docs/manual/core/authorization/#std-label-authorization)
- [特权行动](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)
- [集合级访问控制](https://www.mongodb.com/docs/manual/core/collection-level-access-control/)

## 测试和验证

完成配置步骤后，您可以使用该[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)工具验证您的配置。

与 MongoDB 4.4 一起引入，[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 提供了一种方便的方法来验证平台的 Kerberos 配置以用于 MongoDB，并测试来自 MongoDB 客户端的 Kerberos 身份验证是否按预期工作。[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)有关详细信息，请参阅 文档。

[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)仅在 MongoDB Enterprise 中可用。







翻译：韩鹏帅

原文：[Configure MongoDB with Kerberos Authentication and Active Directory Authorization](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/)