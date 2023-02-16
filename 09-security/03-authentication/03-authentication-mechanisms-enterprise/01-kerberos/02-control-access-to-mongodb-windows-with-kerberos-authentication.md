**在 Windows 上使用 Kerberos 身份验证配置 MongoDB**

**概述**

MongoDB Enterprise 支持使用 [Kerberos service](https://www.mongodb.com/docs/manual/core/kerberos/)进行身份验证。 Kerberos 是用于大型客户端/服务器系统的行业标准身份验证协议。 Kerberos 允许 MongoDB 和应用程序利用现有的身份验证基础设施和流程。 MongoDB Enterprise 仅支持 Kerberos 的[MIT implementation](https://kerberos.org/)。

**先决条件**

设置和配置 Kerberos 部署不在本文档的讨论范围之内。 本教程假定已为每个 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 和[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 实例配置了  [Kerberos service principal](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-kerberos-service-principal)。

对于副本集和分片集群，请确保您的配置使用完全限定的域名 (FQDN) 而不是 IP 地址或不合格的主机名。 您必须使用 GSSAPI 的 FQDN 才能正确解析 Kerberos 领域并允许您进行连接。

**步骤**

1. 在没有 Kerberos 的情况下启动 `mongod.exe`

   对于 Kerberos 用户的初始添加，在没有 Kerberos 支持的情况下启动 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)。

   如果 Kerberos 用户已经在 MongoDB 中并且[privileges required to create a user](https://www.mongodb.com/docs/manual/reference/command/createUser/#std-label-createUser-required-access)，则可以使用 Kerberos 支持启动 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)。

   包括适合您的部署的其他设置。

   >[NOTE]注意
   >
   >从 MongoDB 3.6 开始，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到 localhost。 如果部署的成员在不同的主机上运行，或者如果您希望远程客户端连接到您的部署，则必须指定 `--bind_ip` 或 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

2. 连接到`mongod`

   将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。 如果 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 启用了 `--auth`，请确保您连接到[privileges required to create a user](https://www.mongodb.com/docs/manual/reference/command/createUser/#std-label-createUser-required-access)。

3. 将 Kerberos 主体添加到 MongoDB

   将 Kerberos 主体 `<username>@<KERBEROS REALM>` 添加到 `$external` 数据库中的 MongoDB。 以全部大写形式指定 Kerberos 领域。 `$external` 数据库允许 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 查询外部源（例如 Kerberos）以进行身份验证。 要指定用户的权限，请为用户分配[roles](https://www.mongodb.com/docs/manual/core/authorization/)。

   要对 `$external` 身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[Client Sessions and Causal Consistency Guarantees](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions) ，用户名不能大于 10k 字节。

   以下示例添加了对记录数据库具有只读访问权限的 Kerberos 主体 `reportingapp@EXAMPLE.NET`：

   ```javascript
   use $external
   db.createUser(
      {
        user: "reportingapp@EXAMPLE.NET",
        roles: [ { role: "read", db: "records" } ]
      }
   )
   ```

   根据需要添加其他主体。 对于每个要使用 Kerberos 进行身份验证的用户，您必须在 MongoDB 中创建一个相应的用户。 有关创建和管理用户的更多信息，请参阅[User Management Commands](https://www.mongodb.com/docs/manual/reference/command/nav-user-management/)。

4. 启动带有 Kerberos 支持的 `mongod.exe`。

   您必须启动 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 作为服务主体帐户。

   要启动支持 Kerberos 的 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)，请将 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 参数 [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms) 设置为 `GSSAPI`：

   ```shell
   mongod.exe --setParameter authenticationMechanisms=GSSAPI <additional mongod.exe options>
   ```

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

   例如，以下启动一个支持 Kerberos 的独立 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 实例：

   ```shell
   mongod.exe --auth --setParameter authenticationMechanisms=GSSAPI --bind_ip localhost,<hostname(s)|ip address(es)>
   ```

5. 将 `mongo.exe` shell 连接到 `mongod.exe` 并进行身份验证

   将 `mongo.exe` shell 客户端连接为 Kerberos 主体`application@EXAMPLE.NET`。

   您可以从命令行进行连接和身份验证。

   使用 `cmd.exe`：

   ```shell
   mongo.exe --host hostname.example.net --authenticationMechanism=GSSAPI --authenticationDatabase=$external --username reportingapp@EXAMPLE.NET
   ```

   使用 `Windows PowerShell`:

   ```shell
   mongo.exe --host hostname.example.net --authenticationMechanism=GSSAPI --authenticationDatabase='$external' --username reportingapp@EXAMPLE.NET  
   ```

   如果要连接到主机名与 Kerberos 名称匹配的系统，请确保为 `--host` 选项指定完全限定的域名 (FQDN)，而不是 IP 地址或不合格的主机名。

   如果您连接到主机名与 Kerberos 名称不匹配的系统，首先将 [`mongo.exe`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo) 连接到 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)，然后从 [`mongo.exe`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo) shell，使用 [`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth) 方法在 $external 数据库中进行身份验证。

   ```shell
   use $external
   db.auth( { mechanism: "GSSAPI", user: "reportingapp@EXAMPLE.NET" } )
   ```


**其他注意事项**

**为 Kerberos 配置 `mongos.exe`**

要启动支持 Kerberos 的 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe)，请将 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe) 参数 [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms) 设置为 GSSAPI。 您必须以[
service principal account](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-windows-with-kerberos-authentication/#std-label-assign-service-principal-name)启动 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe)：

```shell
mongos.exe --setParameter authenticationMechanisms=GSSAPI <additional mongos options>
```

根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

例如，以下启动一个支持 Kerberos 的 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例：

```shell
mongos.exe --setParameter authenticationMechanisms=GSSAPI --configdb shard0.example.net, shard1.example.net,shard2.example.net --keyFile C:\<path>\mongos.keyfile --bind_ip localhost,<hostname(s)|ip address(es)>
```

根据配置的需要修改或包含任何其他 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 选项。 例如，您可以使用 [x.509 member authentication](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/#std-label-x509-internal-authentication)，而不是使用 [`--keyFile`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--keyFile) 进行分片集群成员的内部身份验证。

**将服务主体名称分配给 MongoDB Windows 服务**

使用 `setspn.exe` 将服务主体名称 (SPN) 分配给运行 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 和 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 服务的帐户：

```shell
setspn.exe -S <service>/<fully qualified domain name> <service account name>
```

>[EXAMPLE]例子
>
>如果 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 在 `testserver.mongodb.com` 上以服务帐户 `mongodtest` 作为 `mongodb` 服务运行，请按如下方式分配 SPN：
>
>```shell
>setspn.exe -S mongodb/testserver.mongodb.com mongodtest
>```

**合并额外的身份验证机制**

Kerberos 身份验证（GSSAPI (Kerberos)）可以与以下工具一起使用：

- MongoDB SCRAM认证机制：

  - [SCRAM-SHA-1](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram)

  - [SCRAM-SHA-256](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram) (*Added in MongoDB 4.0*)

- MongoDB LDAP认证机制:
  - [PLAIN](https://www.mongodb.com/docs/manual/core/authentication/#std-label-security-auth-ldap) (LDAP SASL)
- MongoDB x.509认证机制 :
  - [MONGODB-X509)](https://www.mongodb.com/docs/manual/core/security-x.509/#std-label-security-auth-x509)

指定机制如下：

```shell
--setParameter authenticationMechanisms=GSSAPI,SCRAM-SHA-256
```

**测试和验证**

完成配置步骤后，您可以使用 [`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)工具验证您的配置。

与 MongoDB 4.4 一起引入的 [`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 提供了一种方便的方法来验证平台的 Kerberos 配置以用于 MongoDB，并测试来自 MongoDB 客户端的 Kerberos 身份验证是否按预期工作。 有关详细信息，请参阅 [`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 文档。

[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 仅在 MongoDB Enterprise 中可用。

 参见

原文 - [Configure MongoDB with Kerberos Authentication on Windows]( https://docs.mongodb.com/manual/tutorial/control-access-to-mongodb-windows-with-kerberos-authentication/ )

译者：景圣
