**在 Linux 上使用 Kerberos 身份验证配置 MongoDB**

**概述**

MongoDB Enterprise 支持使用 [Kerberos service](https://www.mongodb.com/docs/manual/core/kerberos/)进行身份验证。 Kerberos 是用于大型客户端/服务器系统的行业标准身份验证协议。 MongoDB Enterprise 仅支持 Kerberos 的 [MIT implementation](https://kerberos.org/)。

**先决条件**

要验证您使用的是 MongoDB Enterprise，请将 --version 命令行选项传递给 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)：

```shell
mongod --version
```

在此命令的输出中，查找字符串 `modules: subscription` 或 `modules: enterprise` 以确认您使用的是 MongoDB Enterprise 二进制文件。

对于副本集和分片集群，请确保您的配置使用完全限定的域名 (FQDN) 而不是 IP 地址或不合格的主机名。 您必须使用 GSSAPI 的 FQDN 才能正确解析 Kerberos 领域并允许您进行连接。

设置和配置 Kerberos 部署不在本文档的讨论范围之内。 请参阅
[
MIT Kerberos documentation](https://web.mit.edu/kerberos/krb5-latest/doc/)或您的操作系统文档，了解有关如何配置 Kerberos 部署的信息。

为了将 MongoDB 与 Kerberos 一起使用，必须将 MongoDB 部署中每个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的 Kerberos 服务主体[added to the Kerberos database](https://web.mit.edu/kerberos/krb5-latest/doc/admin/database.html#add-principal)中。 您可以通过在 KDC 上运行类似于以下内容的命令来添加服务主体：

```shell
kadmin.local addprinc mongodb/m1.example.com@EXAMPLE.COM
```

在每个运行 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 的系统上，必须为各自的服务主体创建一个密钥表文件。 您可以通过在运行 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 的系统上运行类似于以下的命令来创建 keytab 文件：

```shell
kadmin.local ktadd mongodb/m1.example.com@EXAMPLE.COM
```

**步骤**

以下过程概述了将 Kerberos 用户主体添加到 MongoDB、为 Kerberos 支持配置独立 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例、使用 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接并对用户主体进行身份验证的步骤。

1. 在没有 Kerberos 的情况下启动 `mongod`

   对于 Kerberos 用户的初始添加，在没有 Kerberos 支持的情况下启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

   如果 Kerberos 用户已经在 MongoDB 中并且具有[privileges required to create a user](https://www.mongodb.com/docs/manual/reference/command/createUser/#std-label-createUser-required-access)，则可以在 Kerberos 支持下启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

   包括适合您的部署的其他设置。

   >[NOTE]注意
   >
   >从 MongoDB 3.6 开始，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到 localhost。 如果部署的成员在不同的主机上运行，或者如果您希望远程客户端连接到您的部署，则必须指定 `--bind_ip` 或 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

2. 连接到`mongod`

   将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。 如果 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 启用了 `--auth`，请确保您连接到[privileges required to create a user](https://www.mongodb.com/docs/manual/reference/command/createUser/#std-label-createUser-required-access)。

3. 将 Kerberos 主体添加到 MongoDB

   将 Kerberos 主体 `<username>@<KERBEROS REALM>` 或 `<username>/<instance>@<KERBEROS REALM> `添加到 `$external` 数据库中的 MongoDB。 以全部大写形式指定 Kerberos 领域。 `$external` 数据库允许 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 查询外部源（例如 Kerberos）以进行身份验证。 要指定用户的权限，请为用户分配[roles](https://www.mongodb.com/docs/manual/core/authorization/)。

   要对 `$external` 身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[Client Sessions and Causal Consistency Guarantees](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions) ，用户名不能大于 10k 字节。

   以下示例添加了对记录数据库具有只读访问权限的 Kerberos 主体 `application/reporting@EXAMPLE.NET`：

   ```javascript
   use $external
   db.createUser(
      {
        user: "application/reporting@EXAMPLE.NET",
        roles: [ { role: "read", db: "records" } ]
      }
   )
   ```

   根据需要添加其他主体。 对于每个要使用 Kerberos 进行身份验证的用户，您必须在 MongoDB 中创建一个相应的用户。 有关创建和管理用户的更多信息，请参阅[User Management Commands](https://www.mongodb.com/docs/manual/reference/command/nav-user-management/)。

4. 在 Kerberos 支持下启动 `mongod`

   如果要在 Kerberos支持下启动  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，请将环境变量 KRB5_KTNAME 设置为密钥表文件的路径，并将 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 参数 [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms) 设置为 `GSSAPI`，格式如下：

   ```shell
   env KRB5_KTNAME=<path to keytab file> \
   mongod \
   --setParameter authenticationMechanisms=GSSAPI \
   <additional mongod options>
   ```

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

   例如，以下一个在 Kerberos支持下启动了一个独立的  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例：

   ```shell
   env KRB5_KTNAME=/opt/mongodb/mongod.keytab \
   /opt/mongodb/bin/mongod --auth \
   --setParameter authenticationMechanisms=GSSAPI \
   --dbpath /opt/mongodb/data --bind_ip localhost,<hostname(s)|ip address(es)>
   ```

   你的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 路径和你的 keytab 文件可能不同。 keytab 文件必须只能由 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 进程的所有者访问。

   使用官方的 `.deb` 或 `.rpm` 包，您可以在环境设置文件中设置 `KRB5_KTNAME`。 看[
   KRB5_KTNAME](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-with-kerberos-authentication/#std-label-setting-krb5_ktname)  了解详情。

5. 将 `mongosh` 连接到 `mongod` 并进行身份验证

   将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 客户端连接为 Kerberos 主体 `application/reporting@EXAMPLE.NET`。 在连接之前，您必须使用 Kerberos 的 kinit 程序获取 `application/reporting@EXAMPLE.NET` 的凭据。

   您可以从命令行进行连接和身份验证。

   ```shell
   mongosh --host hostname.example.net --authenticationMechanism=GSSAPI --authenticationDatabase='$external' --username application/reporting@EXAMPLE.NET
   ```

   如果要连接到主机名与 Kerberos 名称匹配的系统，请确保为 `--host` 选项指定完全限定的域名 (FQDN)，而不是 IP 地址或不合格的主机名。

   如果您连接到主机名与 Kerberos 名称不匹配的系统，首先将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，然后从 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 使用 [`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth) 方法在 `$external` 数据库中进行身份验证。

   ```javascript
   use $external
   db.auth( { mechanism: "GSSAPI", user: "application/reporting@EXAMPLE.NET" } )
   ```

**其他注意事项**

**KRB5_KTNAME**

如果您使用官方 `.deb` 或 `.rpm` 包之一安装 MongoDB Enterprise，并且使用包含的 init/upstart 脚本来控制 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例，则可以在默认环境设置文件中设置 `KRB5_KTNAME` 变量，而不是分别设置变量 时间。

 Red Hat 和 Debian-based 的系统的最新版本使用 `systemd`。 旧版本使用 `init` 进行系统初始化。 按照适当的说明为您的系统配置 `KRB5_KTNAME` 变量。

**`systemd` 配置文件**

systemd 在unit文件中存储配置。 更新unit文件以设置 `KRB5_KTNAME` 变量。

1. **找到unit文件**

   ```shell
   sudo systemctl cat mongod
   ```

   `systemctl`命令返回文件的位置并且展示它的内容。

2. **设置 `KRB5_KTNAME`**

   要设置 `KRB5_KTNAME` 变量，请编辑以下行以反映您的密钥表文件的位置：

   ```shell
   Environment="KRB5_KTNAME=<path-to-your-mongod.keytab-file>"
   ```

3. 编辑unit**文件**

   将编辑的行添加到unit文件中。 编辑后的unit文件将类似于：

   ```shell
   [Unit]
   Description=High-performance, schema-free document-oriented database
   After=network.target
   Documentation=https://docs.mongodb.org/manual
   [Service]
   User=mongodb
   Group=mongodb
   ExecStart=/usr/bin/mongod --config /etc/mongod.conf
   Environment="KRB5_KTNAME=/etc/mongod.keytab"
   PIDFile=/var/run/mongodb/mongod.pid
   # file size
   LimitFSIZE=infinity
   # cpu time
   LimitCPU=infinity
   # virtual memory size
   LimitAS=infinity
   # open files
   LimitNOFILE=64000
   # processes/threads
   LimitNPROC=64000
   # locked memory
   LimitMEMLOCK=infinity
   # total threads (user+kernel)
   TasksMax=infinity
   TasksAccounting=false
   # Recommended limits for for mongod as specified in
   # http://docs.mongodb.org/manual/reference/ulimit/#recommended-settings
   [Install]
   WantedBy=multi-user.target
   ```

4. **重新加载更新过的unit文件**

   ```shell
   sudo systemctl daemon-reload
   ```

5. **重新启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)服务**

   ```shell
   sudo systemctl restart mongod
   ```

`init`**配置文件**

安装`.rpm`, 默认环境配置文件： `/etc/sysconfig/mongod`.

安装 `.deb`, 文件是： `/etc/default/mongodb`.

通过添加类似于以下内容的行来设置 `KRB5_KTNAME` 值：

```shell
KRB5_KTNAME="<path to keytab>"
```

**为 Kerberos 配置 `mongos`**

要启动支持 Kerberos 的 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，请将环境变量 KRB5_KTNAME 设置为其[keytab file](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)的路径，并将 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 参数  [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms) 设置为 `GSSAPI`，格式如下：

```shell
env KRB5_KTNAME=<path to keytab file> \
mongos \
--setParameter authenticationMechanisms=GSSAPI \
<additional mongos options>
```

根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

例如，以下启动一个支持 Kerberos 的 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例：

```shell
env KRB5_KTNAME=/opt/mongodb/mongos.keytab \
mongos \
--setParameter authenticationMechanisms=GSSAPI \
--configdb shard0.example.net, shard1.example.net,shard2.example.net \
--keyFile /opt/mongodb/mongos.keyfile \
--bind_ip localhost,<hostname(s)|ip address(es)>
```

您的 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 和 [keytab file](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files) 文件的路径可能不同。 [keytab file](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files) 文件必须只能由 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 进程的所有者访问。

根据配置的需要修改或包含任何其他 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 选项。 例如，您可以使用 [x.509 member authentication](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/#std-label-x509-internal-authentication)，而不是使用 [`--keyFile`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--keyFile) 进行分片集群成员的内部身份验证。

**使用配置文件**

要使用[configuration file](https://www.mongodb.com/docs/manual/reference/configuration-options/)为 Kerberos 支持配置 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，请在配置文件中指定 [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms) 设置。

如果使用 [YAML configuration file format](https://www.mongodb.com/docs/manual/reference/configuration-options/)：

```yaml
setParameter:
   authenticationMechanisms: GSSAPI
```

根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定[`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp) 。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

例如，如果 /opt/mongodb/mongod.conf 包含独立 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 的以下配置设置：

```yaml
security:
   authorization: enabled
setParameter:
   authenticationMechanisms: GSSAPI
storage:
   dbPath: /opt/mongodb/data
net:
   bindIp: localhost,<hostname(s)|ip address(es)>
```

要使用 Kerberos 支持启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，请使用以下形式：

```shell
env KRB5_KTNAME=/opt/mongodb/mongod.keytab \
/opt/mongodb/bin/mongod --config /opt/mongodb/mongod.conf
```

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)、 [keytab file](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files) 和配置文件的路径可能不同。  [keytab file](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)必须只能由  [keytab file](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files) 进程的所有者访问。

**对 MongoDB 的 Kerberos 设置进行故障排除**

如果您在使用 Kerberos 身份验证启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 时遇到问题，请参阅[Troubleshoot Kerberos Authentication](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-kerberos/)。

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

仅在使用时添加其他机制。 该参数设置不影响MongoDB对集群成员的内部认证。

**测试和验证**

完成配置步骤后，您可以使用 [`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)工具验证您的配置。

与 MongoDB 4.4 一起引入的 [`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 提供了一种方便的方法来验证平台的 Kerberos 配置以用于 MongoDB，并测试来自 MongoDB 客户端的 Kerberos 身份验证是否按预期工作。 有关详细信息，请参阅 [`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 文档。

[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 仅在 MongoDB Enterprise 中可用。

 参见

原文 - [Configure MongoDB with Kerberos Authentication on Linux]( https://docs.mongodb.com/manual/tutorial/control-access-to-mongodb-with-kerberos-authentication/ )

译者：景圣
