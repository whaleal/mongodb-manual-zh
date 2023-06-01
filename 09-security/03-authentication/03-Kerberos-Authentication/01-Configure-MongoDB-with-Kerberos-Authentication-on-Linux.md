# 在 Linux 上使用 Kerberos 身份验证配置 MongoDB

## 概述

MongoDB Enterprise 支持使用[Kerberos 服务](https://www.mongodb.com/docs/manual/core/kerberos/)进行身份验证。Kerberos 是用于大型客户端/服务器系统的行业标准身份验证协议。MongoDB Enterprise 仅支持 [麻省理工学院实施](https://kerberos.org/)Kerberos 的。

## 先决条件

要验证您使用的是 MongoDB Enterprise，请将`--version` 命令行选项传递给[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or [`mongos`：](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

```
mongod --version
```

在此命令的输出中，查找字符串`modules: subscription`或`modules: enterprise`确认您使用的是 MongoDB Enterprise 二进制文件。

对于副本集和分片集群，请确保您的配置使用完全限定的域名 (FQDN) 而不是 IP 地址或不合格的主机名。您必须使用 GSSAPI 的 FQDN 才能正确解析 Kerberos 领域并允许您进行连接。

设置和配置 Kerberos 部署超出了本文档的范围。请参阅[MIT Kerberos 文档](https://web.mit.edu/kerberos/krb5-latest/doc/)或您的操作系统文档以获取有关如何配置 Kerberos 部署的信息。

为了将 MongoDB 与 Kerberos 一起使用， MongoDB 部署中的每个 实例的[Kerberos 服务主体](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-kerberos-service-principal)必须是[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)[添加到 Kerberos 数据库](https://web.mit.edu/kerberos/krb5-latest/doc/admin/database.html#add-principal). 您可以通过在 KDC 上运行类似于以下内容的命令来添加服务主体：

```
kadmin.local addprinc mongodb/m1.example.com@EXAMPLE.COM
```

在每个运行[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或的系统上[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，[密钥表文件](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)必须是[创建](https://web.mit.edu/kerberos/krb5-latest/doc/admin/appl_servers.html#keytabs) 对于各自的服务主体。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)您可以通过在运行or的系统上运行类似于以下的命令来创建 keytab 文件 [`mongos`：](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

```
kadmin.local ktadd mongodb/m1.example.com@EXAMPLE.COM
```

## 程序

以下过程概述了将 Kerberos 用户主体添加到 MongoDB、[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)为 Kerberos 支持配置独立实例以及使用连接的步骤[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)并验证用户主体。

1. 在没有 Kerberos 的情况下开始`mongod`

   对于 Kerberos 用户的初始添加，请[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 在没有 Kerberos 支持的情况下开始。

   如果 Kerberos 用户已经在 MongoDB 中并且具有 [创建用户所需的权限](https://www.mongodb.com/docs/manual/reference/command/createUser/#std-label-createUser-required-access)，则可以 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)从 Kerberos 支持开始。

   包括适合您的部署的其他设置。

   > 笔记:
   >
   > [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)并[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到本地主机。如果部署的成员在不同的主机上运行，或者如果您希望远程客户端连接到您的部署，则必须指定`--bind_ip`或 [`net.bindIp`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)

2. 连接到`mongod`。

   连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。如果[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)已[`--auth`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--auth)启用，请确保您[使用创建用户所需的权限进行连接。](https://www.mongodb.com/docs/manual/reference/command/createUser/#std-label-createUser-required-access)

3. 将 Kerberos 主体添加到 MongoDB

   将 Kerberos 主体`<username>@<KERBEROS REALM>`或 添加`<username>/<instance>@<KERBEROS REALM>`到数据库中的 MongoDB `$external`。以全部大写形式指定 Kerberos 领域。数据库`$external`允许[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)咨询外部来源（例如 Kerberos）以进行身份验证。要指定用户的权限，请为用户分配[角色。](https://www.mongodb.com/docs/manual/core/authorization/)

   要对身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[客户端会话和因果一致性保证](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)，`$external`用户名不能超过 10k 字节。

   `application/reporting@EXAMPLE.NET`以下示例添加了对数据库具有只读访问权限的 Kerberos 主体 `records`：

   ```
   use $external
   db.createUser(
      {
        user: "application/reporting@EXAMPLE.NET",
        roles: [ { role: "read", db: "records" } ]
      }
   )
   
   ```

   根据需要添加其他主体。对于要使用 Kerberos 进行身份验证的每个用户，您必须在 MongoDB 中创建一个相应的用户。有关创建和管理用户的更多信息，请参阅 [用户管理命令。](https://www.mongodb.com/docs/manual/reference/command/nav-user-management/)

4. 从 Kerberos 支持开始`mongod`

   要启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)Kerberos 支持，请将环境变量设置`KRB5_KTNAME`为 keytab 文件的路径，并将[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)参数 [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)设置为`GSSAPI`以下形式：

   ```
   env KRB5_KTNAME=<path to keytab file> \
   mongod \
   --setParameter authenticationMechanisms=GSSAPI \
   <additional mongod options>
   
   ```

   根据您的配置需要包括其他选项。例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`. 有关详细信息，请参阅 [本地主机绑定兼容性更改。](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

   例如，以下启动一个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 支持 Kerberos 的独立实例：

   ```
   env KRB5_KTNAME=/opt/mongodb/mongod.keytab \
   /opt/mongodb/bin/mongod --auth \
   --setParameter authenticationMechanisms=GSSAPI \
   --dbpath /opt/mongodb/data --bind_ip localhost,<hostname(s)|ip address(es)>
   
   ```

   [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)您和您的[keytab 文件](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)的路径可能不同。[keytab 文件](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)必须 只能由进程的所有者访问[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 。

   使用官方`.deb`或软件包，您可以在环境设置文件中`.rpm`进行设置 。`KRB5_KTNAME`看 [KRB5_KTNAME](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-with-kerberos-authentication/#std-label-setting-krb5_ktname)了解详情。

5. 连接`mongosh`并`mongod`验证。

   连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)客户端作为 Kerberos 主体 `application/reporting@EXAMPLE.NET`。在连接之前，您必须使用 Kerberos 的`kinit`程序获取 `application/reporting@EXAMPLE.NET`.

   您可以从命令行进行连接和身份验证。

   ```
   mongosh --host hostname.example.net --authenticationMechanism=GSSAPI --authenticationDatabase='$external' --username application/reporting@EXAMPLE.NET
   ```

   如果要连接到主机名与 Kerberos 名称匹配的系统，请确保为该选项指定完全限定的域名 (FQDN) `--host` ，而不是 IP 地址或不合格的主机名。

   如果您要连接到主机名与 Kerberos 名称不匹配的系统，请先连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，然后从 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), 使用[`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth)方法在数据库中进行身份验证`$external`。

   ```
   use $external
   db.auth( { mechanism: "GSSAPI", user: "application/reporting@EXAMPLE.NET" } )
   ```

## 其他注意事项

### KRB5_KTNAME

`.deb` 如果您使用官方或软件包之一安装 MongoDB Enterprise `.rpm`，并使用包含的 init/upstart 脚本来控制实例[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，则可以`KRB5_KTNAME` 在默认环境设置文件中设置变量，而不是每次都设置变量。

最近版本的 Red Hat 和基于 Debian 的系统使用`systemd`. 旧版本用于`init`系统初始化。按照适当的说明`KRB5_KTNAME`为您的系统配置变量。

#### `systemd`配置文件

`systemd`将配置存储在单元文件中。更新单元文件以设置变量`KRB5_KTNAME`。

1. 查找单元文件

   ```
   sudo systemctl cat mongod
   ```

   该`systemctl`命令返回文件位置并显示其内容。

2. 放`KRB5_KTNAME`

   要设置`KRB5_KTNAME`变量，请编辑以下行以反映文件的位置`keytab`：

   ```
   Environment="KRB5_KTNAME=<path-to-your-mongod.keytab-file>"
   ```

3. 编辑单元文件

   将编辑的行添加到单元文件中。编辑后的单元文件将类似于：

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

4. 重新加载更新的单元文件:

   ```
   sudo systemctl daemon-reload
   ```

5. 重启[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)服务

   ```
   sudo systemctl restart mongod
   ```

#### `init`配置文件

对于`.rpm`安装，默认的环境设置文件是 `/etc/sysconfig/mongod`.

对于`.deb`安装，文件是`/etc/default/mongodb`.

`KRB5_KTNAME`通过添加类似于以下内容的行来设置值：

```
KRB5_KTNAME="<path to keytab>"
```

### `mongos`为 Kerberos配置

要开始[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)Kerberos 支持，请将环境变量设置为其[keytab 文件](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)`KRB5_KTNAME`的路径，并将参数 设置为以下形式：[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)[`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)`GSSAPI`

```
env KRB5_KTNAME=<path to keytab file> \
mongos \
--setParameter authenticationMechanisms=GSSAPI \
<additional mongos options>
```

根据您的配置需要包括其他选项。例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`. 有关详细信息，请参阅 [本地主机绑定兼容性更改。](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

例如，以下启动一个[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)支持 Kerberos 的实例：

```
env KRB5_KTNAME=/opt/mongodb/mongos.keytab \
mongos \
--setParameter authenticationMechanisms=GSSAPI \
--configdb shard0.example.net, shard1.example.net,shard2.example.net \
--keyFile /opt/mongodb/mongos.keyfile \
--bind_ip localhost,<hostname(s)|ip address(es)>
```

[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)您和您的[keytab 文件](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)的路径可能不同。[keytab 文件](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)必须只能由进程的所有者访问[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)。

[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)根据配置的需要修改或包含任何其他选项。例如， [`--keyFile`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--keyFile)您可以使用[x.509 成员身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/#std-label-x509-internal-authentication)，而不是用于分片集群成员的内部身份验证。

### 使用配置文件

要使用[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)配置[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)Kerberos 支持，请 在配置文件中指定设置。[`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)

如果使用[YAML 配置文件格式：](https://www.mongodb.com/docs/manual/reference/configuration-options/)

```
setParameter:
   authenticationMechanisms: GSSAPI
```

根据您的配置需要包括其他选项。例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定设置[`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)。有关详细信息，请参阅[本地主机绑定兼容性更改。](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

例如，如果`/opt/mongodb/mongod.conf`包含以下独立配置设置[`mongod`：](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

```
security:
   authorization: enabled
setParameter:
   authenticationMechanisms: GSSAPI
storage:
   dbPath: /opt/mongodb/data
net:
   bindIp: localhost,<hostname(s)|ip address(es)>
```

要开始[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)Kerberos 支持，请使用以下形式：

```
env KRB5_KTNAME=/opt/mongodb/mongod.keytab \
/opt/mongodb/bin/mongod --config /opt/mongodb/mongod.conf
```

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)您的[keytab 文件](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)和配置文件的路径可能不同。[keytab 文件](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)必须 只能由进程的所有者访问[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

### 对 MongoDB 的 Kerberos 设置进行故障排除

如果您在启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用 Kerberos 身份验证时遇到问题，请参阅 [Kerberos 身份验证疑难解答。](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-kerberos/)

### 合并额外的身份验证机制

Kerberos 身份验证 ( [GSSAPI](https://www.mongodb.com/docs/manual/core/authentication/#std-label-security-auth-kerberos) (Kerberos)) 可以与：

* MongoDB的SCRAM认证机制：
  * [SCRAM-SHA-1](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram)
  * [SCRAM-SHA-256](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram)（*在 MongoDB 4.0 中添加*）
* MongoDB 对 LDAP 的认证机制：
  * [普通](https://www.mongodb.com/docs/manual/core/authentication/#std-label-security-auth-ldap)（LDAP SASL）
* MongoDB 对 x.509 的认证机制：
  * [MONGODB-X509 )](https://www.mongodb.com/docs/manual/core/security-x.509/#std-label-security-auth-x509)

指定机制如下：

```
--setParameter authenticationMechanisms=GSSAPI,SCRAM-SHA-256
```

仅在使用时添加其他机制。该参数设置不影响MongoDB对集群成员的内部认证。

## 测试和验证

完成配置步骤后，您可以使用该[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)工具验证您的配置。

与 MongoDB 4.4 一起引入，[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 提供了一种方便的方法来验证平台的 Kerberos 配置以用于 MongoDB，并测试来自 MongoDB 客户端的 Kerberos 身份验证是否按预期工作。[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)有关详细信息，请参阅 文档。

[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)仅在 MongoDB Enterprise 中可用。







翻译：韩鹏帅

原文：[Configure MongoDB with Kerberos Authentication on Linux](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-with-kerberos-authentication/)
