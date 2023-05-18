### 通过本机 LDAP 使用 Active Directory 对用户进行身份验证和授权

从版本 3.4 开始，MongoDB Enterprise 通过平台 LDAP 库提供支持，用于将身份验证和授权请求代理到指定的轻量级目录访问协议 (LDAP) 服务，例如 Active Directory (AD)。

本教程介绍如何配置 MongoDB 以通过平台库通过 Active Directory (AD) 服务器执行身份验证和授权。

> 笔记:
>
> 对于链接的 MongoDB 4.2 Enterprise 二进制文件 `libldap`（例如在 RHEL 上运行时），对 的访问 `libldap`是同步的，会产生一些性能/延迟成本。
>
> 对于链接到 的 MongoDB 4.2 Enterprise 二进制文件 `libldap_r`，与早期 MongoDB 版本相比，行为没有变化。

## 先决条件

> 重要的:
>
> 在继续之前，请彻底熟悉以下主题：
>
> * [LDAP 身份验证](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-security-ldap)
> * [LDAP 授权](https://www.mongodb.com/docs/manual/core/security-ldap-external/#std-label-security-ldap-external)
> * [活动目录](https://msdn.microsoft.com/en-us/library/bb742424.aspx)

AD的完整描述超出了本教程的范围。本教程假定您具有AD的先验知识。

MongoDB 支持使用 SASL 机制在 MongoDB 服务器和AD之间进行绑定。SASL、SASL 机制或给定 SASL 机制的特定AD配置要求的完整描述超出了本教程的范围。本教程假定您事先了解 SASL 及其相关主题。

## 注意事项

本教程介绍如何配置 MongoDB 以进行AD 身份验证和授权。

要在您自己的 MongoDB 服务器上执行此过程，您必须根据您自己的特定基础架构修改给定的过程，尤其是 Active Directory 配置、构建AD 查询或管理用户。

### 传输层安全

默认情况下，MongoDB 在绑定到AD服务器时会创建 TLS/SSL 连接。这需要配置 MongoDB 服务器的主机以访问 AD 服务器的证书颁发机构 (CA) 证书。

本教程提供了所需主机配置的说明。

本教程假设您有权访问 AD 服务器的 CA 证书，并且可以在 MongoDB 服务器上创建证书的副本。

### 用户名

要对身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[客户端会话和因果一致性保证](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)，`$external`用户名不能超过 10k 字节。

### 示例 Active Directory 架构

本教程使用以下示例AD对象作为提供的查询、配置和输出的基础。每个对象仅显示可能属性的一个子集。

#### 用户对象

```
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

```
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

1. 为运行 MongoDB 的服务器配置 TLS/SSL

   要通过 TLS/SSL 连接到AD[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) (AD) 服务器，需要[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)访问AD服务器的证书颁发机构 (CA) 证书。

   在 Linux 上，通过文件中的或选项指定AD服务器的 CA 证书。`TLS_CACERT``TLS_CACERTDIR``ldap.conf`

   您平台的包管理器`ldap.conf`在安装 MongoDB Enterprise 的`libldap`依赖项时创建文件。有关配置文件或引用选项的完整文档，请参阅 [配置文件](http://www.openldap.org/software/man.cgi?query=ldap.conf).

   在 Microsoft Windows上，使用平台的凭据管理工具加载AD服务器的证书颁发机构 (CA) 证书。确切的凭据管理工具取决于Windows版本。要使用该工具，请参阅适用于您的Windows版本的文档。

   如果[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)不能访问AD CA 文件，他们就无法创建到 Active Directory 服务器的 TLS/SSL 连接。

   或者，设置[`security.ldap.transportSecurity`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.transportSecurity)为`none` 禁用 TLS/SSL。

   > 警告:
   >
   > 设置[`transportSecurity`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.transportSecurity)为在 MongoDB 和AD`none`服务器之间传输明文信息，包括用户凭据。

2. 连接到 MongoDB 服务器

   使用以下命令连接到 MongoDB 服务器[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)使用 [`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host)和[`--port`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--port)选项

   ```
   mongosh --host <hostname> --port <port>
   ```

   如果您的 MongoDB 服务器当前强制执行身份验证，则您必须`admin`以具有角色管理权限的用户身份向数据库进行身份验证，例如[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)或 提供的权限[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)。包括适当的 [`--authenticationMechanism`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationMechanism)用于 MongoDB 服务器配置的身份验证机制。

   ```
   mongosh --host <hostname> --port <port> --username <user> --password <pass> --authenticationDatabase="admin" --authenticationMechanism="<mechanism>"
   ```

   > 笔记:
   >
   > 对于Windows MongoDB 部署，您应该替换[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)和 [`mongo.exe`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)

3. 创建用户管理角色。

   要使用AD管理 MongoDB 用户，您需要在数据库上创建至少一个`admin`可以创建和管理角色的角色，例如[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)或 提供的角色[`userAdminAnyDatabase`。](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)

   角色的名称必须与AD组的可分辨名称完全匹配。该组必须至少有一个AD用户作为成员。

   给定可用的[Active Directory 组](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/#std-label-kerb-auth-ldap-authz-groupObj)，执行以下操作：

   * 创建一个以AD组 命名的角色`CN=dba,CN=Users,DC=example,DC=com`，以及
   * 为其分配数据库[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)中的角色`admin` 。

   ```shell
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

4. 创建 MongoDB 配置文件。

   MongoDB[配置文件](https://www.mongodb.com/docs/manual/administration/configuration/)是一个带有文件扩展名的纯文本 YAML 文件`.conf`。

   * 如果您要升级现有的 MongoDB 部署，请复制当前配置文件并从该副本开始工作。
   * （仅限 Linux）如果这是新部署*并且*您使用平台的包管理器安装 MongoDB Enterprise，则安装包括`/etc/mongod.conf`默认配置文件。使用该默认配置文件，或制作该文件的副本以供使用。
   * 如果不存在这样的文件，则创建一个具有扩展名的空文件`.conf`并从该新配置文件开始工作。

5. 配置 MongoDB 以连接到 Active Directory。

   在MongoDB配置文件中，设置AD[`security.ldap.servers`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.servers)服务器的主机和端口。如果您的 AD基础设施包括多个用于复制目的的 AD服务器，请将服务器的主机和端口指定为以逗号分隔的列表到[.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.servers)[`security.ldap.servers`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.servers)

   您还必须通过设置 [`security.authorization`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.authorization)to`enabled`和to来启用 LDAP 身份验证[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter) [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)`PLAIN`

   > 例子:
   >
   > 要连接到位于 的 AD`activedirectory.example.net`服务器，请在配置文件中包含以下内容：
   >
   > ```
   > security:
   >   authorization: "enabled"
   >   ldap:
   >     servers: "activedirectory.example.net"
   > setParameter:
   >   authenticationMechanisms: 'PLAIN'
   > ```

   MongoDB 必须绑定到AD服务器才能执行查询。默认情况下，MongoDB 使用简单的身份验证机制将自己绑定到AD服务器。

   或者，您可以在配置文件中配置以下设置以使用绑定到AD服务器`SASL`：

   - 设为[`security.ldap.bind.method`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.method)_`sasl`
   - [`security.ldap.bind.saslMechanisms`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.saslMechanisms), 指定AD服务器支持的逗号分隔的 SASL 机制字符串。

   本教程使用默认的`simple`LDAP 身份验证机制。

6. 配置用于授权的 LDAP 查询模板

   在 MongoDB 配置文件中，设置 [`security.ldap.authz.queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)为[RFC4516](https://tools.ietf.org/html/rfc4516)格式化的 LDAP 查询 URL 模板。

   在模板中，您可以使用：

   * `{USER}`占位符，用于将经过身份验证的用户名替换为 LDAP 查询 URL。
   * `{PROVIDED_USER}`占位符将提供的用户名替换为 LDAP 查询，即在身份验证或 LDAP 转换之前。（*从 4.2 版开始可用*）

   > 笔记:
   >
   > 的完整描述[RFC4515](https://tools.ietf.org/html/rfc4515)、RFC4516 或AD查询超出了本教程的范围。本教程中提供[`queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)的仅为示例，可能不适用于您的特定AD部署。

   > 例子:
   >
   > 以下查询模板返回列为`{USER}`成员的任何组，遵循递归组成员身份。此 LDAP 查询假定组对象通过使用属性存储完整的用户专有名称 (DN) 来跟踪用户成员资格`member`。查询包括AD特定的匹配规则 OID `1.2.840.113556.1.4.1941`[LDAP_MATCHING_RULE_IN_CHAIN](https://msdn.microsoft.com/en-us/library/aa746475(v=vs.85).aspx). 此匹配规则是AD特定于 LDAP 搜索过滤器的扩展。
   >
   > ```
   > security:
   >   ldap:
   >     authz:
   >       queryTemplate:
   >         "DC=example,DC=com??sub?(&(objectClass=group)(member:1.2.840.113556.1.4.1941:={USER}))"
   > ```
   >
   > 使用查询模板，MongoDB 替换`{USER}`为经过身份验证的用户名来查询 LDAP 服务器。
   >
   > 例如，用户验证为 `CN=sam,CN=Users,DC=dba,DC=example,DC=com`。MongoDB 创建一个基于 的 LDAP 查询[`queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)，`{USER}`用经过身份验证/转换的用户名替换令牌。Active Directory 服务器对直接或间接将用户列为成员的任何组执行递归组查找。基于 [活动目录组](https://www.mongodb.com/docs/manual/tutorial/authenticate-nativeldap-activedirectory/#std-label-activedirectory-authauthz-groupObj), AD服务器返回 `CN=dba,CN=Users,DC=example,DC=com`和 `CN=engineering,CN=Users,DC=example,DC=com`。

   MongoDB 将每个返回的组DN映射到数据库中的一个角色`admin`。对于每个映射组DN，如果数据库中存在名称与DN`admin`完全匹配的现有角色，则 MongoDB 会授予用户分配给该角色的角色和权限。

   匹配规则需要提供身份验证用户的`LDAP_MATCHING_RULE_IN_CHAIN`完整DN 。如果用户使用不同的用户名格式（例如他们的 ）进行身份验证，您必须使用`user principal name`将传入的用户名转换为DN [`security.ldap.userToDNMapping`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)

7. **可选：通过 Active Directory 转换传入的用户名以进行身份验证**

   如果您的用户使用非完整 LDAP DN 的用户名进行身份验证，您可能需要转换用户名以支持 LDAP 身份验证或授权。MongoDB 使用转换后的用户名进行身份验证和授权。

   在 MongoDB 配置文件中，设置 [`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)将身份验证用户提供的用户名转换为AD DN 以支持[`queryTemplate`.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)

   > 例子:
   >
   > 鉴于已配置[`queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)，用户必须使用其完整的 LDAP DN 进行身份验证。如果用户改为使用他们的 进行身份验证`userPrincipalName`，则必须应用转换以将提供的用户名转换为完整的 LDAP DN。
   >
   > 以下[`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)配置使用`match`正则表达式过滤器来捕获提供的用户名。MongoDB`ldapQuery` 在执行查询之前将捕获的用户名插入到查询模板中。
   >
   > ```shell
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
   >
   > Active Directory 服务器返回与匹配的用户对象关联的完整 LDAP DN `userPrincipalName`。然后 MongoDB 可以使用这个转换后的用户名进行身份验证*和*授权。

   您必须修改给定的示例配置以匹配您的部署。例如，`ldapQuery`基本DN必须与包含您的用户实体的基本DN相匹配。可能需要进行其他修改以支持您的AD部署。

   > 例子:
   >
   > 用户验证为`alice@ENGINEERING.EXAMPLE.COM`。MongoDB 首先应用 [`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping). 基于提供的配置，MongoDB 捕获阶段中的用户名`match`并执行 LDAP 查询：
   >
   > ```shell
   > DC=example,DC=com??sub?(userPrincipalName=alice@ENGINEERING.EXAMPLE.COM)
   > ```
   >
   > 基于配置的[活动目录用户](https://www.mongodb.com/docs/manual/tutorial/authenticate-nativeldap-activedirectory/#std-label-activedirectory-authauthz-userObj)，AD服务器应该返回
   >
   > `CN=alice,CN=Users,DC=engineering,DC=example,DC=com`
   >
   > MongoDB 然后执行中配置的 LDAP 查询 [`queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)，用*转换后的*用户名 替换`{USER}` 令牌。
   >
   > `CN=alice,CN=Users,DC=engineering,DC=example,DC=com`

   > 重要的:
   >
   > 如果使用[`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)的 `substitution`参数来转换组名，则替换的结果**必须**是[RFC4514](https://www.ietf.org/rfc/rfc4514.txt)转义字符串。

8. 配置查询凭据

   MongoDB 需要凭据才能在AD服务器上执行查询。

   在配置文件中配置以下设置：

   * [`security.ldap.bind.queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser)，指定 Active Directory 用户 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)绑定为在AD服务器上执行查询。
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

9. 可选：添加其他配置设置。

   添加部署所需的任何其他配置选项。例如，您可以指定您想要的[`storage.dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)或更改默认[`net.port`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.port)号码。

   [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)并[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到本地主机。如果部署的成员在不同的主机上运行，或者如果您希望远程客户端连接到您的部署，则必须指定设置[`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)。

10. 使用 Active Directory 身份验证和授权启动 MongoDB 服务器。

    使用选项启动 MongoDB 服务器[`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config)，指定在此过程中创建的配置文件的路径。如果 MongoDB 服务器当前正在运行，请做好停止服务器的适当准备。

    ```
    mongod --config <path-to-config-file>
    ```

    Windows MongoDB 部署必须使用 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)而不是[`mongod`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

11. 连接到 MongoDB 服务器

    连接到 MongoDB 服务器，以用户身份进行身份验证，该用户的直接或传递组成员身份对应于数据库上`admin` 具有[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)、[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)或具有等效权限的自定义角色的 MongoDB 角色。

    使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)要向 MongoDB 服务器进行身份验证，请设置以下选项：

    * [`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host)使用 MongoDB 服务器的主机名
    * [`--port`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--port)使用 MongoDB 服务器的端口
    * [`--username`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--username)到用户的用户名
    * [`--password`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password)到用户的密码
    * [`--authenticationMechanism`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationMechanism)到`'PLAIN'`
    * [`--authenticationDatabase`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationDatabase)到`'$external'`

    > 例子:
    >
    > 在此过程的前面，您 `dn:CN=dba,CN=Users,DC=example,DC=com`为`admin`数据库配置了具有所需权限的角色。这个角色对应一个AD组。基于配置的[广告用户](https://www.mongodb.com/docs/manual/tutorial/authenticate-nativeldap-activedirectory/#std-label-activedirectory-authauthz-userObj)，您可以作为用户进行身份验证 `sam@dba.example.com`并获得所需的权限。
    >
    > ```
    > mongosh --username sam@DBA.EXAMPLE.COM --password  --authenticationMechanism 'PLAIN' --authenticationDatabase '$external' --host <hostname> --port <port>
    > ```
    >
    > 如果您不指定密码[`-p`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password)命令行选项，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 提示输入密码。

    Windows MongoDB 部署必须使用 [`mongo.exe`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)而不是[`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

    给定配置[活动目录用户](https://www.mongodb.com/docs/manual/tutorial/authenticate-nativeldap-activedirectory/#std-label-activedirectory-authauthz-userObj)，用户成功验证并获得适当的权限。

    > 笔记:
    >
    > 如果您想以现有非`$external`用户身份进行身份验证，请设置 [`--authenticationMechanism`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationMechanism)到 SCRAM 认证机制（例如`SCRAM-SHA-1`或`SCRAM-SHA-256`视情况而定）。这要求 MongoDB 服务器的包含 和/或.[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter) [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)`SCRAM-SHA-1``SCRAM-SHA-256`

12. 创建用于映射返回的AD组的角色。

    对于您希望用于 MongoDB 授权的AD服务器上的每个组，您必须在 MongoDB 服务器的`admin`数据库上创建一个匹配的角色。

    > 例子:
    >
    > 以下操作创建一个以AD组 DN命名的角色`CN=PrimaryApplication,CN=Users,DC=example,DC=com`，分配适合该组的角色和权限：
    >
    > ```
    > db.getSiblingDB("admin").createRole(
    >    {
    >      role: "CN=PrimaryApplication,CN=Users,DC=example,DC=com",
    >      privileges: [],
    >      roles: [
    >        { role: "readWrite", db: "PrimaryApplication" }
    >      ]
    >    }
    > )
    > ```
    >
    > 给定配置[活动目录组](https://www.mongodb.com/docs/manual/tutorial/authenticate-nativeldap-activedirectory/#std-label-activedirectory-authauthz-groupObj), MongoDB 授予用户身份验证为`sam@DBA.EXAMPLE.COM`or数据库上的`alice@ENGINEERING.EXAMPLE.COM`角色 。[`readWrite`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWrite)`PrimaryApplication`

    > 笔记:
    >
    > 要管理数据库中的角色，您必须被认证为具有on 、 或具有等效权限的自定义角色 on 的`admin`用户。[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)`admin`[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)

13. 将现有用户从`$external`ActiveDirectory 服务器转移到

    如果在数据库上配置[用户](https://www.mongodb.com/docs/manual/core/security-users/#std-label-users)升级现有安装`$external`，则必须满足每个用户的以下要求，以确保在配置 MongoDB 以进行AD身份验证和授权后访问：

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

    如果您想继续允许非`$external`数据库用户访问 MongoDB，您必须在配置选项中包含 SCRAM 身份验证机制（例如`SCRAM-SHA-1`和/或`SCRAM-SHA-256`） 。例如：[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter) [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)

    ```
    setParameter:
      authenticationMechanisms: "PLAIN,SCRAM-SHA-1,SCRAM-SHA-256"
    ```

    或者，按照上述过程将非`$external`用户转换为AD 。

    此过程生成以下配置文件：

    ```shell
    security:
       authorization: "enabled"
       ldap:
          servers: "activedirectory.example.net"
          bind:
             queryUser: "mongodbadmin@dba.example.com"
             queryPassword: "secret123"
          userToDNMapping:
             '[
                {
                   match: "(.+)",
                   ldapQuery: "DC=example,DC=com??sub?(userPrincipalName={0})"
                }
             ]'
          authz:
             queryTemplate: "DC=example,DC=com??sub?(&(objectClass=group)(member:1.2.840.113556.1.4.1941:={USER}))"
    setParameter:
       authenticationMechanisms: "PLAIN"
    ```

    给定的示例配置需要修改以匹配您的 Active Directory 架构、目录结构和配置。您可能还需要用于部署的其他[配置文件选项。](https://www.mongodb.com/docs/manual/reference/configuration-options/)

    有关配置角色和权限的更多信息，请参阅：

    * [基于角色的访问控制](https://www.mongodb.com/docs/manual/core/authorization/#std-label-authorization)
    * [特权行动](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)
    * [集合级访问控制](https://www.mongodb.com/docs/manual/core/collection-level-access-control/)







翻译：韩鹏帅

原文：[Authenticate and Authorize Users Using Active Directory via Native LDAP](https://www.mongodb.com/docs/manual/tutorial/authenticate-nativeldap-activedirectory/)