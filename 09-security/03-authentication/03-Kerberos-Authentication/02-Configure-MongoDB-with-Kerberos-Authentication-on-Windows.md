# 在 Windows 上使用 Kerberos 身份验证配置 MongoDB

## 概述

MongoDB Enterprise 支持使用[Kerberos 服务](https://www.mongodb.com/docs/manual/core/kerberos/)进行身份验证。Kerberos 是用于大型客户端/服务器系统的行业标准身份验证协议。Kerberos 允许 MongoDB 和应用程序利用现有的身份验证基础设施和流程。MongoDB Enterprise 仅支持 [麻省理工学院实施](https://kerberos.org/) Kerberos 的。

## 先决条件

设置和配置 Kerberos 部署超出了本文档的范围。本教程假定已为每个 实例配置了[Kerberos 服务主体](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-kerberos-service-principal)。[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe)

对于副本集和分片集群，请确保您的配置使用完全限定的域名 (FQDN) 而不是 IP 地址或不合格的主机名。您必须使用 GSSAPI 的 FQDN 才能正确解析 Kerberos 领域并允许您进行连接。

## 程序

1. 在没有 Kerberos 的情况下开始`mongod.exe`

   对于 Kerberos 用户的初始添加，请 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)在没有 Kerberos 支持的情况下开始。

   如果 Kerberos 用户已经在 MongoDB 中并且具有 [创建用户所需的权限](https://www.mongodb.com/docs/manual/reference/command/createUser/#std-label-createUser-required-access)，则可以 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)从 Kerberos 支持开始。

   包括适合您的部署的其他设置。

   > 笔记:
   >
   > [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)并[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到本地主机。如果部署的成员在不同的主机上运行，或者如果您希望远程客户端连接到您的部署，则必须指定`--bind_ip`或 [`net.bindIp`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)

2. 连接到`mongod`

   连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 实例。如果[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)已[`--auth`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--auth)启用，请确保您[使用创建用户所需的权限进行连接。](https://www.mongodb.com/docs/manual/reference/command/createUser/#std-label-createUser-required-access)

3. 将 Kerberos 主体添加到 MongoDB。

   将 Kerberos 主体添加`<username>@<KERBEROS REALM>`到数据库中的 MongoDB `$external`。**以全部大写形式**指定 Kerberos 领域 。数据库`$external`允许 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)咨询外部来源（例如 Kerberos）以进行身份验证。要指定用户的权限，请 为用户分配[角色。](https://www.mongodb.com/docs/manual/core/authorization/)

   要对身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[客户端会话和因果一致性保证](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)，`$external`用户名不能超过 10k 字节。

   `reportingapp@EXAMPLE.NET`以下示例添加了对数据库具有只读访问权限的 Kerberos 主体 `records`：

   ```
   use $external
   db.createUser(
      {
        user: "reportingapp@EXAMPLE.NET",
        roles: [ { role: "read", db: "records" } ]
      }
   )
   ```

   根据需要添加其他主体。对于要使用 Kerberos 进行身份验证的每个用户，您必须在 MongoDB 中创建一个相应的用户。有关创建和管理用户的更多信息，请参阅 [用户管理命令。](https://www.mongodb.com/docs/manual/reference/command/nav-user-management/)

4. 从 Kerberos 支持开始`mongod.exe`

   你必须开始[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)作为[服务主体帐户。](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-windows-with-kerberos-authentication/#std-label-assign-service-principal-name)

   要开始[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)使用 Kerberos 支持，请将[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)参数 设置[`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)为`GSSAPI`：

   ```
   mongod.exe --setParameter authenticationMechanisms=GSSAPI <additional mongod.exe options>
   ```

   根据您的配置需要包括其他选项。例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`. 有关详细信息，请参阅 [本地主机绑定兼容性更改。](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

   例如，以下启动一个[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 支持 Kerberos 的独立实例：

   ```
   mongod.exe --auth --setParameter authenticationMechanisms=GSSAPI --bind_ip localhost,<hostname(s)|ip address(es)>
   ```

5. `mongo.exe`将shell连接到`mongod.exe`并进行身份验证。

   [`mongo.exe`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)作为 Kerberos 主体连接shell 客户端`application@EXAMPLE.NET`。

   您可以从命令行进行连接和身份验证。

   使用`cmd.exe`：

   ```
   mongo.exe --host hostname.example.net --authenticationMechanism=GSSAPI --authenticationDatabase=$external --username reportingapp@EXAMPLE.NET
   ```

   使用`Windows PowerShell`：

   ```
   mongo.exe --host hostname.example.net --authenticationMechanism=GSSAPI --authenticationDatabase='$external' --username reportingapp@EXAMPLE.NET  
   ```

   如果要连接到主机名与 Kerberos 名称匹配的系统，请确保为该选项指定完全限定的域名 (FQDN) `--host` ，而不是 IP 地址或不合格的主机名。

   如果您要连接到主机名与 Kerberos 名称不匹配的系统，请先连接到[`mongo.exe`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)，[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)然后从 [`mongo.exe`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)shell 中使用该 [`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth)方法在数据库中进行身份验证`$external` 。

   ```
   use $external
   db.auth( { mechanism: "GSSAPI", user: "reportingapp@EXAMPLE.NET" } )
   ```

## 其他注意事项

### `mongos.exe`为 Kerberos配置

要开始[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe)使用 Kerberos 支持，请将 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe)参数设置[`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms) 为`GSSAPI`. 你必须开始[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe)作为 [服务主体帐户：](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-windows-with-kerberos-authentication/#std-label-assign-service-principal-name)

```
mongos.exe --setParameter authenticationMechanisms=GSSAPI <additional mongos options>
```

根据您的配置需要包括其他选项。例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`. 有关详细信息，请参阅 [本地主机绑定兼容性更改。](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

例如，以下启动一个[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)支持 Kerberos 的实例：

```
mongos.exe --setParameter authenticationMechanisms=GSSAPI --configdb shard0.example.net, shard1.example.net,shard2.example.net --keyFile C:\<path>\mongos.keyfile --bind_ip localhost,<hostname(s)|ip address(es)>
```

[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe)根据配置的需要修改或包含任何其他选项。例如， [`--keyFile`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--keyFile)您可以使用[x.509 成员身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/#std-label-x509-internal-authentication)，而不是用于分片集群成员的内部身份验证。

### 将服务主体名称分配给 MongoDB Windows 服务

用于将服务主体名称 (SPN) 分配给运行服务 `setspn.exe`的帐户：[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe)

```
setspn.exe -S <service>/<fully qualified domain name> <service account name>
```

> 例子:
>
> 如果使用服务帐户名称作为名为on[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)的服务运行 ，请按如下方式分配 SPN：`mongodb``testserver.mongodb.com``mongodtest`
>
> ```
> setspn.exe -S mongodb/testserver.mongodb.com mongodtest
> ```

### 合并额外的身份验证机制

Kerberos 身份验证 ( [GSSAPI](https://www.mongodb.com/docs/manual/core/authentication/#std-label-security-auth-kerberos) (Kerberos)) 可以与：

* MongoDB的SCRAM认证机制：
  - [SCRAM-SHA-1](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram)
  - [SCRAM-SHA-256](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram)（*在 MongoDB 4.0 中添加*）
* MongoDB 对 LDAP 的认证机制：
  - [普通](https://www.mongodb.com/docs/manual/core/authentication/#std-label-security-auth-ldap)（LDAP SASL）
* MongoDB 对 x.509 的认证机制：
  - [MONGODB-X509 )](https://www.mongodb.com/docs/manual/core/security-x.509/#std-label-security-auth-x509)'

指定机制如下:

```
--setParameter authenticationMechanisms=GSSAPI,SCRAM-SHA-256
```

仅在使用时添加其他机制。该参数设置不影响MongoDB对集群成员的内部认证。

## 测试和验证

完成配置步骤后，您可以使用该[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)工具验证您的配置。

与 MongoDB 4.4 一起引入，[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 提供了一种方便的方法来验证平台的 Kerberos 配置以用于 MongoDB，并测试来自 MongoDB 客户端的 Kerberos 身份验证是否按预期工作。[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)有关详细信息，请参阅 文档。

[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)仅在 MongoDB Enterprise 中可用。





翻译：韩鹏帅

原文：[Configure MongoDB with Kerberos Authentication on Windows](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-windows-with-kerberos-authentication/)
