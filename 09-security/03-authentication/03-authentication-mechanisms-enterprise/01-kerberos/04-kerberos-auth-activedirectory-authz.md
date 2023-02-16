**使用 Kerberos 身份验证和 Active Directory 授权配置 MongoDB**

[MongoDB Enterprise](http://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server) 支持查询 LDAP 服务器以获取经过身份验证的用户所属的 LDAP 组。 MongoDB 将每个返回组的 LDAP 可分辨名称 (DN) 映射到管理数据库上的角色。 MongoDB 根据映射的角色及其相关权限对用户进行授权。 有关详细信息，请参阅[LDAP Authorization](https://www.mongodb.com/docs/manual/core/security-ldap-external/#std-label-security-ldap-external) 。

MongoDB Enterprise 支持使用 [Kerberos service](https://www.mongodb.com/docs/manual/core/kerberos/)进行身份验证。 Kerberos 是用于大型客户端/服务器系统的行业标准身份验证协议。

本教程介绍如何在平台库里配置 MongoDB 来用 Kerberos 服务器执行身份验证和用 Active Directory (AD) 服务器执行授权。

**先决条件**

>[IMPORTANT]重要
>
>在继续之前，请彻底熟悉以下内容：
>
>- [Kerberos Authentication](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-security-kerberos)
>- [LDAP Authorization](https://www.mongodb.com/docs/manual/core/security-ldap-external/#std-label-security-ldap-external)
>- [Active Directory](https://msdn.microsoft.com/en-us/library/bb742424.aspx)

AD 的完整描述不在本教程的范围内。 本教程假定您具有 AD 的先验知识。

MongoDB 支持使用 SASL 机制在 MongoDB 服务器和 AD 之间进行绑定。 SASL 的完整描述、SASL 机制或给定 SASL 机制的特定 AD 配置要求不在本教程的范围之内。 本教程假定您事先了解 SASL 及其相关主题。

设置和配置 Kerberos 部署不在本文档的讨论范围之内。 本教程假设您已经为 MongoDB 部署中的每个  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例配置了一个 [Kerberos service principal](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-kerberos-service-principal)，并且您为每个  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例都有一个有效的[keytab file](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)。

对于副本集和分片集群，请确保您的配置使用完全限定的域名 (FQDN) 而不是 IP 地址或不合格的主机名。 您必须使用 GSSAPI 的 FQDN 才能正确解析 Kerberos 领域并允许您进行连接。

要验证您使用的是 MongoDB Enterprise，请将 `--version` 命令行选项传递给  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)：

```shell
mongod --version
```

在此命令的输出中，查找字符串 `modules: subscription` 或 `modules: enterprise` 以确认您使用的是 MongoDB Enterprise 二进制文件。

**注意事项**

本教程介绍了为 Kerberos 身份验证和 AD 授权配置 MongoDB。

要在您自己的 MongoDB 服务器上执行此过程，您必须根据您自己的特定基础架构修改给定的过程，尤其是 Kerberos 配置、构建 AD 查询或管理用户。

**传输层安全**

默认情况下，MongoDB 在绑定到 AD 服务器时会创建 TLS/SSL 连接。 这需要配置 MongoDB 服务器的主机以访问 AD 服务器的证书颁发机构 (CA) 证书。

本教程提供了所需主机配置的说明。

本教程假设您有权访问 AD 服务器的 CA 证书，并且可以在 MongoDB 服务器上创建证书的副本。

**Active Directory 架构示例** 

本教程使用以下示例 AD 对象作为提供的查询、配置和输出的基础。 每个对象仅显示可能属性的一个子集。

**用户对象**

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

**分组对象**

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

**Active Directory 凭证**

本教程使用用户名和密码在 AD 服务器上执行查询。 提供的凭证必须在 AD 服务器上具有足够的权限，以支持与 [`security.ldap.userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping) 或 [`security.ldap.authz.queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate) 相关的查询。

**副本集**

MongoDB LDAP 授权要求副本集中的每个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 至少在 MongoDB 3.4.0 或更高版本上。

**分片集群**

MongoDB LDAP 授权要求分片集群中的每个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 至少在 MongoDB 3.4.0 或更高版本上。

**步骤**

1. **为运行 MongoDB 的服务器配置 TLS/SSL**

   要通过 TLS/SSL 连接到 AD (AD) 服务器，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 需要访问 AD 服务器的证书颁发机构 (CA) 证书。

   在 Linux 上，通过 ldap.conf 文件中的 `TLS_CACERT` 或 `TLS_CACERTDIR` 选项指定 AD 服务器的 CA 证书。

   您平台的包管理器在安装 MongoDB Enterprise 的 libldap 依赖项时创建 `ldap.conf` 文件。 有关配置文件或引用选项的完整文档，请参阅[ldap.conf](http://www.openldap.org/software/man.cgi?query=ldap.conf)

   在 Microsoft Windows 上，使用平台的凭证管理工具加载 AD 服务器的证书颁发机构 (CA) 证书。 确切的凭证管理工具取决于 Windows 版本。 要使用该工具，请参阅适用于您的 Windows 版本的文档。

   如果 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 无法访问 AD CA 文件，则它们无法创建与 Active Directory 服务器的 TLS/SSL 连接。

   或者，将 [`security.ldap.transportSecurity`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.transportSecurity) 设置为 `none` 以禁用 TLS/SSL。

   >[WARNING]警告
   >
   >将 [`transportSecurity`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.transportSecurity) 设置为 `none` 会在 MongoDB 和 AD 服务器之间传输明文信息，包括用户凭证。

2. **（仅限 Windows）将服务主体名称分配给 MongoDB Windows 服务**

   对于在 Windows 操作系统上运行的 MongoDB 服务器，您必须使用[setspn.exe](https://technet.microsoft.com/en-us/library/cc731241(v=ws.11).aspx)将服务主体名称 (SPN) 分配给运行 MongoDB 服务的帐户。

   ```shell
   setspn.exe -S <service>/<fully qualified domain name> <service account name>
   ```

   >[EXAMPLE]示例
   >
   >例如，如果 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 在 `mongodbserver.example.com` 上作为名为 mongodb 的服务运行，服务帐户名称为 `mongodb_dev@example.com`，则分配 SPN 的命令如下所示：
   >
   >```shell
   >setspn.exe -S mongodb/mongodbserver.example.com mongodb_dev@example.com
   >```

   >[NOTE]注意
   >
   >Windows Server 2003 不支持 `setspn.exe -S`。 有关 `setspn.exe` 的完整文档，请参见[setspn.exe](https://technet.microsoft.com/en-us/library/cc731241(v=ws.11).aspx)

3. **（仅限 Linux）为 MongoDB 服务器创建密钥表文件。**

   对于在 Linux 平台上运行的 MongoDB 服务器，您必须确保服务器具有特定于在该服务器上运行的 MongoDB 实例的 [keytab file](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)的副本。

   您必须授予运行 MongoDB 服务的 Linux 用户对密钥表文件的读取权限。 记下密钥表文件位置的完整路径。\

4. **连接到 MongoDB 服务器**

   使用以下命令连接到 MongoDB 服务器[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)使用 [`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host)和[`--port`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--port)。

   ```shell
   mongosh --host <hostname> --port <port>
   ```

   如果您的 MongoDB 服务器当前强制执行身份验证，则您必须以具有角色管理权限的用户身份向 `admin` 数据库进行身份验证，例如 [`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin) 或 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase) 提供的权限。 包括适当的[`--authenticationMechanism`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationMechanism)用于 MongoDB 服务器配置的身份验证机制。

   ```shell
   mongosh --host <hostname> --port <port> --username <user> --password <pass> --authenticationDatabase="admin" --authenticationMechanism="<mechanism>"
   ```

   >[NOTE]注意
   >
   >对于 Windows MongoDB 部署，您应该替换[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)与 [`mongo.exe`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)

5. **创建用户管理角色**

   使用AD管理MongoDB用户，需要在`admin`数据库上至少创建一个可以创建和管理角色的角色，比如[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)或[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)提供的角色。

   角色的名称必须与 AD 组的可分辨名称完全匹配。 该组必须至少有一个 AD 用户作为成员。

   鉴于可用[Active Directory groups](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/#std-label-kerb-auth-ldap-authz-groupObj)，以下操作：

   - 创建一个以 AD 组命名的角色 `CN=dba、CN=Users、DC=example、DC=com` 和

   - 为其分配 admin 数据库上的 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase) 角色。

     ```javascript
     var admin = db.getSiblingDB("admin")
     admin.createRole(
        {
          role: "CN=dba,CN=Users,DC=example,DC=com",
          privileges: [],
          roles: [ "userAdminAnyDatabase" ]
        }
     )
     ```

     您也可以为用户应具有用户管理权限的每个数据库授予 [`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin) 角色。 这些角色为角色创建和管理提供了必要的权限。

     >[IMPORTATNT]重要
     >
     >在配置 MongoDB 角色、AD 组或组成员身份时考虑应用[principle of least privilege](https://www.us-cert.gov/bsi/articles/knowledge/principles/least-privilege)

6. **创建 MongoDB 配置文件。**

   MongoDB [configuration file](https://www.mongodb.com/docs/manual/administration/configuration/)是一个带有 `.conf` 文件扩展名的纯文本 YAML 文件。

   - 如果您要升级现有的 MongoDB 部署，请复制当前配置文件并从该副本开始工作。
   - （仅限 Linux）如果这是新部署并且您使用平台的包管理器安装 MongoDB Enterprise，则安装包括 `/etc/mongod.con`f 默认配置文件。 使用该默认配置文件，或制作该文件的副本以供使用。

   - 如果不存在这样的文件，则创建一个带有 `.conf `扩展名的空文件，并从该新配置文件开始工作。

7. **配置 MongoDB 以连接到 Active Directory。**

   在MongoDB配置文件中，将[`security.ldap.servers`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.servers)设置为AD服务器的主机和端口。 如果您的 AD 基础设施包括多个用于复制目的的 AD 服务器，请将服务器的主机和端口指定为 [`security.ldap.servers`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.servers) 的逗号分隔列表。

   >[EXAMPLE]示例
   >
   >要连接到位于 `activedirectory.example.net` 的 AD 服务器，请在配置文件中包含以下内容：
   >
   >```yaml
   >security:
   >  ldap:
   >    servers: "activedirectory.example.net"
   >```

   MongoDB 必须绑定到 AD 服务器才能执行查询。 默认情况下，MongoDB 使用简单的身份验证机制将自己绑定到 AD 服务器。

   或者，您可以在配置文件中配置以下设置以使用 SASL 绑定到 AD 服务器：

   - 将 [`security.ldap.bind.method`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.method) 设置为 sasl
   - [`security.ldap.bind.saslMechanisms`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.saslMechanisms)，指定AD服务器支持的一串以逗号分隔的SASL机制。

   本教程使用默认的简单 `LDAP` 身份验证机制。

8. **配置 MongoDB 以进行 Kerberos 身份验证。**

   在 MongoDB 配置文件中，将 [`security.authorization`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.authorization) 设置为 enabled 并将 [`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter) [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms) 设置为 `GSSAPI`

   要通过 Kerberos 启用身份验证，请在配置文件中包含以下内容：

   ```yaml
   security:
     authorization: "enabled"
   setParameter:
     authenticationMechanisms: "GSSAPI"
   ```

9. **配置用于授权的 LDAP 查询模板。**

   在 MongoDB 配置文件中，将 [`security.ldap.authz.queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate) 设置为[RFC4516](https://tools.ietf.org/html/rfc4516)  格式化的 LDAP 查询 URL 模板。

   在模板中，您可以使用：

   - `{USER}` 占位符，用于将经过身份验证的用户名替换为 LDAP 查询 URL。
   - `{PROVIDED_USER}` 占位符将提供的用户名替换为 LDAP 查询，即在身份验证或 LDAP 转换之前。 （从版本 4.2 开始可用）

   设计查询模板以检索用户组。

   >[NOTE]注意
   >
   >[RFC4515](https://tools.ietf.org/html/rfc4515)、RFC4516 或 AD 查询的完整描述不在本教程的讨论范围内。 本教程中提供的 [`queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate) 仅为示例，可能不适用于您的特定 AD 部署。

   >[EXAMPLE]示例
   >
   >以下查询模板返回任何将 `{USER}` 列为成员的组，遵循递归组成员身份。 此 LDAP 查询假定组对象通过使用成员属性存储完整的用户专有名称 (DN) 来跟踪用户成员资格。 该查询包括[LDAP_MATCHING_RULE_IN_CHAIN](https://msdn.microsoft.com/en-us/library/aa746475(v=vs.85).aspx) 的 AD 特定匹配规则 OID `1.2.840.113556.1.4.1941`。 此匹配规则是 AD 特定于 LDAP 搜索过滤器的扩展。
   >
   >```yaml
   >security:
   >  ldap:
   >    authz:
   >      queryTemplate:
   >        "DC=example,DC=com??sub?(&(objectClass=group)(member:1.2.840.113556.1.4.1941:={USER}))"
   >```
   >
   >使用查询模板，MongoDB 将 `{USER}` 替换为经过身份验证的用户名以查询 LDAP 服务器。
   >
   >例如，用户验证为 `CN=sam,CN=Users,DC=dba,DC=example,DC=com`。 MongoDB 基于 [`queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate) 创建一个 LDAP 查询，用经过身份验证的用户名替换 {USER} 令牌。 Active Directory 服务器对直接或间接将用户列为成员的任何组执行递归组查找。 基于[Active Directory groups](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/#std-label-kerb-auth-ldap-authz-groupObj)，AD 服务器返回 `CN=dba,CN=Users,DC=example,DC=com` 和 `CN=engineering,CN=Users,DC=example,DC=com`。

   MongoDB 将每个返回的组 DN 映射到 `admin` 数据库上的一个角色。 对于每个映射的组 DN，如果` admin` 数据库中存在名称与 DN 完全匹配的现有角色，MongoDB 会授予用户分配给该角色的角色和权限。

   匹配规则 `LDAP_MATCHING_RULE_IN_CHAIN`` 需要提供身份验证用户的完整 DN。 由于 Kerberos 需要使用用户的 userPrincipalName` 进行身份验证，因此您必须使用 [`security.ldap.userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping) 将传入的用户名转换为 DN。 下一步提供有关转换传入用户名以支持 [`queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate) 的指导。
   
10. **通过 Active Directory 转换传入的用户名以进行身份验证。**

   在 MongoDB 配置文件中，设置[`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping)以将身份验证用户提供的用户名转换为 AD DN 以支持 [`queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)。

   >[EXAMPLE]示例
   >
   >以下 [`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping) 配置使用匹配正则表达式过滤器来捕获提供的用户名。 MongoDB 在执行查询之前将捕获的用户名插入到 `ldapQuery` 查询模板中。
   >
   >```yaml
   >security:
   >  ldap:
   >    userToDNMapping:
   >      '[
   >         {
   >            match : "(.+)",
   >            ldapQuery: "DC=example,DC=com??sub?(userPrincipalName={0})"
   >         }
   >    ]'
   >```

   您必须修改给定的示例配置以匹配您的部署。 例如，`ldapQuery` 基本 DN 必须与包含您的用户实体的基本 DN 相匹配。 可能需要进行其他修改以支持您的 AD 部署。

   >[EXAMPLE]示例
   >
   >用户验证为 `alice@ENGINEERING.EXAMPLE.COM`。 MongoDB 首先应用 [`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping) 中指定的任何转换。 根据提供的配置，MongoDB 在匹配阶段捕获用户名并执行 LDAP 查询：
   >
   >```shell
   >DC=example,DC=com??sub?(userPrincipalName=alice@ENGINEERING.EXAMPLE.COM)
   >```
   >
   >基于配置的 [
   >Active Directory users](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/#std-label-kerb-auth-ldap-authz-userObj)，AD服务器应该返回`CN=alice, CN=Users, DC=engineering, DC=example,DC=com`。
   >
   >MongoDB 然后执行在 [`queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate) 中配置的 LDAP 查询，将 `{USER}` 令牌替换为转换后的用户名 `CN=alice,CN=Users,DC=engineering,DC=example,DC=com`。

   >[IMPORTANT]重要
   >
   >如果使用 [`userToDNMapping`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.userToDNMapping) 的替换参数来转换组名，则替换的结果必须是 [
   >RFC4514](https://www.ietf.org/rfc/rfc4514.txt) 转义字符串。

11. **配置查询凭证**

    MongoDB 需要凭证才能在 AD 服务器上执行查询。

    在配置文件中配置以下设置：

    - [`security.ldap.bind.queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser)，指定 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 绑定的 Kerberos 用户，以便在 AD 服务器上执行查询。
    - [`security.ldap.bind.queryPassword`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryPassword)，为指定的[`queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser)指定密码。

    ```yaml
    security:
      ldap:
        bind:
          queryUser: "mongodbadmin@dba.example.com"
          queryPassword: "secret123"
    ```

    在 Windows MongoDB 服务器上，您可以将 [`security.ldap.bind.useOSDefaults`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.useOSDefaults) 设置为 true 以使用操作系统用户的凭据而不是 queryUser 和 queryPassword。

    [`queryUser`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.bind.queryUser) 必须有权代表 MongoDB 执行所有 LDAP 查询。

12. **可选：添加其他配置设置**

    根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp) 设置。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

13. **使用 Kerberos 身份验证和 Active Directory 授权启动 MongoDB 服务器**

    使用 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config) 选项启动 MongoDB 服务器，指定在此过程中创建的配置文件的路径。 如果 MongoDB 服务器当前正在运行，请做好停止服务器的适当准备。

    `Linux MongoDB Servers`

    在 Linux 上，您必须指定 `KRB5_KTNAME` 环境变量，指定 MongoDB 服务器的密钥表文件的路径。

    ```shell
    env KRB5_KTNAME <path-to-keytab> mongod --config <path-to-config-file>
    ```

    `Microsoft Windows MongoDB Servers`

    在 Windows 上，您必须将 MongoDB 服务器作为服务主体帐户启动，如之前在过程中配置的那样：

    ```shell
    mongod.exe --config <path-to-config-file>
    ```

14. **连接到 MongoDB 服务器**

    连接到 MongoDB 服务器，以用户身份进行身份验证，该用户的直接或传递组成员身份对应于具有 [`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)、[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase) 或具有等效权限的自定义角色的管理数据库上的 MongoDB 角色。

    使用 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 向 MongoDB 服务器进行身份验证，设置以下选项：

    - [`--host`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--host) with the hostname of the MongoDB server
    - [`--port`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--port) with the port of the MongoDB server
    - [`--username`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--username) to the user's `userPrincipalName`
    - [`--password`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password) to the user's password (or omit to have [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) prompt for the password)
    - [`--authenticationMechanism`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationMechanism) to `"GSSAPI"`
    - [`--authenticationDatabase`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationDatabase) to `"$external"`

    >[EXAMPLE]示例
    >
    >在此过程的前面，您在 admin 数据库上配置了 `dn:CN=dba,CN=Users,DC=example,DC=com` 角色所需的权限。 这个角色对应一个AD组。 根据配置的 [
    >AD users](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/#std-label-kerb-auth-ldap-authz-userObj)，您可以验证为用户 `sam@dba.example.com` 并获得所需的权限。
    >
    >```shell
    >mongosh --username sam@DBA.EXAMPLE.COM --password  --authenticationMechanisms="GSSAPI" --authenticationDatabase "$external" --host <hostname> --port <port>
    >```
    >
    >如果您没有为 [`-p`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password) 命令行选项指定密码，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 会提示输入密码。

    Windows MongoDB 部署必须使用 [`mongo.exe`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo) 而不是 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。

    给定已配置的[Active Directory users](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/#std-label-kerb-auth-ldap-authz-userObj)，用户成功验证并获得适当的权限。

    >[NOTE]注意
    >
    >如果您想作为现有的非 ·$external· 用户进行身份验证，请将 [`--authenticationMechanism`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationMechanism) 设置为 SCRAM 身份验证机制（例如 `SCRAM-SHA-1` 或 `SCRAM-SHA-256`）。 这要求 MongoDB 服务器的 [`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter) [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms) 适当地包括 `SCRAM-SHA-1` 和/或 `SCRAM-SHA-256`。

15. **创建用于映射返回的 AD 组的角色**

    对于您希望用于 MongoDB 授权的 AD 服务器上的每个组，您必须在 MongoDB 服务器的`admin`数据库上创建一个匹配的角色。

    >[EXAMPLE]示例
    >
    >以下操作创建一个以 AD 组 DN `CN=PrimaryApplication,CN=Users,DC=example,DC=com` 命名的角色，分配适合该组的角色和权限：
    >
    >```javascript
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
    >鉴于已配置的[Active Directory groups](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/#std-label-kerb-auth-ldap-authz-groupObj)，MongoDB 授予用户身份验证为 `sam@DBA.EXAMPLE.COM `或` alice@ENGINEERING.EXAMPLE.COM` 对 PrimaryApplication 数据库的[`readWrite`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWrite)角色。

    >[NOTE]注意
    >
    >要管理 `admin` 数据库上的角色，您必须通过 `admin` 上的 [`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)、[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase) 或具有同等权限的自定义角色的用户身份验证。

16. **可选：将现有用户从 $external 转移到 Active Directory 服务器**

    如果使用在 `$external` 数据库上配置的用户升级现有安装，则必须满足每个用户的以下要求，以确保在为 Kerberos 身份验证和 AD 授权配置 MongoDB 后访问：

    - 用户在AD服务器上有对应的用户对象。
    - 用户在 AD 服务器上具有相应组的成员身份。

    - MongoDB 包含以用户的 AD 组命名的管理数据库中的角色，以便授权用户保留其特权。

    >[EXAMPLE]示例
    >
    >`$external` 数据库中存在以下用户：
    >
    >```javascript
    >{
    >  user : "joe@ANALYTICS.EXAMPLE.COM",
    >  roles: [
    >    { role : "read", db : "web_analytics" },
    >    { role : "read", db : "PrimaryApplication" }
    >  ]
    >}
    >```
    >
    >假设用户属于 AD 组 `CN=marketing,CN=Users,DC=example,DC=com`，以下操作创建具有适当权限的匹配角色：
    >
    >```javascript
    >db.getSiblingDB("admin").createRole(
    >   {
    >     role: "CN=marketing,CN=Users,DC=example,DC=com",
    >     privileges: [],
    >     roles: [
    >       { role: "read", db: "web_analytics" }
    >       { role: "read", db: "PrimaryApplication" }
    >     ]
    >   }
    >)
    >```
    >
    >基于配置的 [`queryTemplate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.ldap.authz.queryTemplate)，MongoDB 授权在 `CN=marketing,CN=Users,DC=example,DC=com` 组中具有直接或传递成员资格的任何用户对 `web_analytics` 和 `PrimaryApplication` 数据库执行[`read`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-read)操作。

    >[IMPORTANT]重要
    >
    >为相应的 AD 组配置角色时，请记住所有具有该组成员身份的用户都可以获得分配的角色和权限。 在配置 MongoDB 角色、AD 组或组成员身份时考虑应用[principle of least privilege](https://www.us-cert.gov/bsi/articles/knowledge/principles/least-privilege)。

    如果您想继续允许非 `$externa`l 数据库上的用户访问 MongoDB，则必须在 [`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter) [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms) 配置选项中包含 SCRAM 身份验证机制（例如 `SCRAM-SHA-1` 和/或 `SCRAM-SHA-256`）。

    ```yaml
    setParameter:
      authenticationMechanisms: "GSSAPI,SCRAM-SHA-1,SCRAM-SHA-256"
    ```

    或者，按照上述过程将非 `$external` 用户转换为 AD。

此过程生成以下配置文件：

```yaml
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

>[IMPORTANT]重要
>
>给定的示例配置需要修改以匹配您的 AD 架构、目录结构和配置。 您可能还需要用于部署的其他[configuration file options](https://www.mongodb.com/docs/manual/reference/configuration-options/)。

有关配置角色和权限的更多信息，请参阅：

- [role-based access control](https://www.mongodb.com/docs/manual/core/authorization/#std-label-authorization)
- [privilege actions](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)
- [collection level access control](https://www.mongodb.com/docs/manual/core/collection-level-access-control/)

**测试和验证**

完成配置步骤后，您可以使用 [`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)工具验证您的配置。

与 MongoDB 4.4 一起引入的 [`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 提供了一种方便的方法来验证平台的 Kerberos 配置以用于 MongoDB，并测试来自 MongoDB 客户端的 Kerberos 身份验证是否按预期工作。 有关详细信息，请参阅 [`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 文档。

[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 仅在 MongoDB Enterprise 中可用。

 参见

原文 - [Configure MongoDB with Kerberos Authentication and Active Directory Authorization]( https://docs.mongodb.com/manual/tutorial/kerberos-auth-activedirectory-authz/ )

译者：景圣
