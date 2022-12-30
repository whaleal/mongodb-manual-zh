 **通过 OpenLDAP 使用 SASL 和 LDAP 进行身份验证**

MongoDB Enterprise 提供对用户代理身份验证的支持。 这允许管理员配置 MongoDB 集群，通过将身份验证请求代理到指定的轻量级目录访问协议 (LDAP) 服务来对用户进行身份验证。

>[NOTE]注意
>
>对于链接到 `libldap` 的 MongoDB 4.2 Enterprise 二进制文件（例如在 RHEL 上运行时），对 libldap 的访问是同步的，会产生一些性能/延迟成本。
>
>对于链接到` libldap_r` 的 MongoDB 4.2 Enterprise 二进制文件，与早期 MongoDB 版本相比，行为没有变化。

**注意事项**

>[WARNING]警告
>
>MongoDB Enterprise for Windows 不支持通过 `saslauthd` 进行绑定。

- Linux MongoDB 服务器支持通过 `saslauthd` 守护进程绑定到 LDAP 服务器。
- 在客户端和服务器之间以及 saslauthd 和 LDAP 服务器之间使用安全的加密或可信连接。 LDAP 服务器使用 `SASL PLAIN` 机制，以明文形式发送和接收数据。 您应该只使用受信任的渠道，例如 VPN、使用 TLS/SSL 加密的连接或受信任的有线网络。

**配置saslauthd**

LDAP 对用户身份验证的支持需要正确配置 saslauthd 守护进程以及 MongoDB 服务器。

1. **指定机制**

   在使用 `/etc/sysconfig/saslauthd` 文件配置 `saslauthd` 的系统上，例如 Red Hat Enterprise Linux、Fedora、CentOS 和 Amazon Linux AMI，将机制 `MECH` 设置为 `ldap`：

   ```shell
   MECH=ldap
   ```

   在使用 `/etc/default/saslauthd` 文件配置 `saslauthd` 的系统上，例如 Ubuntu，将 `MECHANISMS` 选项设置为 `ldap`：

   ```shell
   MECHANISMS="ldap"
   ```

2. **调整缓存行为**

   在某些 Linux 发行版上，`saslauthd` 以启用身份验证凭据的缓存开始。 在重新启动或缓存过期之前，`saslauthd` 不会联系 LDAP 服务器以在其身份验证缓存中重新验证用户。 这允许 `saslauthd` 成功验证其缓存中的用户，即使在 LDAP 服务器已关闭或缓存的用户凭证已被撤销的情况下也是如此。

   要设置身份验证缓存的过期时间（以秒为单位），请参阅[-t option](http://www.linuxcommand.org/man_pages/saslauthd8.html)  的 `saslauthd`。

3. **使用 OpenLDAP 配置 LDAP 选项**

   如果 `saslauthd.conf` 文件不存在，请创建它。 `saslauthd.conf `文件通常位于 `/etc` 文件夹中。 如果指定不同的文件路径，请参阅[-O option](http://www.linuxcommand.org/man_pages/saslauthd8.html)  的 `saslauthd`。

   要连接到 OpenLDAP 服务器，请使用以下配置选项更新 `saslauthd.conf `文件：

   ```javascript
   ldap_servers: <ldap uri>
   ldap_search_base: <search base>
   ldap_filter: <filter>
   ```

   `ldap_servers` 指定用于身份验证的 LDAP 服务器的 uri。 通常，对于安装在本地计算机上的 OpenLDAP，您可以指定值 `ldap://localhost:389`，或者如果使用基于 TLS/SSL 的 LDAP，您可以指定值 `ldaps://localhost:636`。

   `ldap_search_base `指定搜索相关的专有名称。 搜索包括下面的基地或对象。

   `ldap_filter` 指定搜索过滤器。

   这些配置选项的值应对应于特定于您的测试的值。 例如，要过滤电子邮件，请改为指定 `ldap_filter: (mail=%n)`。

   **OpenLDAP 示例**

   OpenLDAP 的示例 `saslauthd.conf` 文件包括以下内容：

   ```javascript
   ldap_servers: ldaps://ad.example.net
   ldap_search_base: ou=Users,dc=example,dc=com
   ldap_filter: (uid=%u)
   ```

   要使用此示例 OpenLDAP 配置，请创建具有 `uid` 属性（登录名）的用户，并将用户组织单位 (`ou`) 置于域组件 `(dc) example` 和` com` 下。

   有关 `saslauthd` 配置的更多信息，请参阅[
   http://www.openldap.org/doc/admin24/guide.html#Configuringsaslauthd](http://www.openldap.org/doc/admin24/guide.html#Configuringsaslauthd).

4. **测试 `saslauthd` 配置。**

   使用 `testsaslauthd` 实用程序测试 `saslauthd` 配置。 例如：

   ```shell
   testsaslauthd -u testuser -p testpassword -f /var/run/saslauthd/mux
   ```
   
   - `0：OK “Success”`表示认证成功。
   
   - `0：NO “authentication failed”`表示用户名、密码或配置错误。
   
   根据主机操作系统上 `saslauthd` 目录的位置修改文件路径。
   
   >[IMPORTANT]重要
   >指定给 [`security.sasl.saslauthdSocketPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.sasl.saslauthdSocketPath) 或 [`--setParameter saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath) 的 `saslauthd` Unix 域套接字文件的父目录必须授予读取和执行 (r-x) 权限：
   >
   >- 启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 的用户，或者
   >
   >
   >- 该用户所属的组。
   >
   >如果没有对 `saslauthd` 目录及其内容的指定权限，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 无法通过 `saslauthd` 成功进行身份验证。

**配置 MongoDB**

1. **将用户添加到 MongoDB 进行身份验证**

   将用户添加到 MongoDB 中的 `$external` 数据库。 要指定用户的权限，请为用户分配角色。

   要对 `$external` 身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[Client Sessions and Causal Consistency Guarantees](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions) ，用户名不能大于 10k 字节。

   例如，以下添加了一个对记录数据库具有只读访问权限的用户。

   ```javascript
   db.getSiblingDB("$external").createUser(
       {
         user : <username>,
         roles: [ { role: "read", db: "records" } ]
       }
   )
   ```

   根据需要添加其他主体。 有关创建和管理用户的更多信息，请参阅[User Management Commands](https://www.mongodb.com/docs/manual/reference/command/nav-user-management/)。

2. **配置 MongoDB 服务器**

   要将 MongoDB 服务器配置为使用 `saslauthd` 实例进行代理身份验证，请在启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 时包括以下选项：

   - [`--auth`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--auth) 命令行选项或 [`security.authorization`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.authorization) 设置，
   - [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)参数设置为 PLAIN，并且
   - [`saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath) 参数设置为 saslauthd 实例的 Unix 域套接字的路径。

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

   如果您使用[`authorization`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.authorization)选项来强制执行身份验证，您将需要权限来创建用户。

   **使用特定的 `saslauthd` 套接字路径**

   对于 `/<some>/<path>/saslauthd` 的套接字路径，将 [`saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath) 设置为 `/<some>/<path>/saslauthd/mux`，如以下命令行示例所示：

   ```shell
   mongod --auth --setParameter saslauthdPath=/<some>/<path>/saslauthd/mux --setParameter authenticationMechanisms=PLAIN
   ```

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

   或者，如果使用 YAML 格式的配置文件，请在文件中指定以下设置：

   ```yaml
   security:
      authorization: enabled
   
   setParameter:
      saslauthdPath: /<some>/<path>/saslauthd/mux
      authenticationMechanisms: PLAIN
   ```

   或者，如果使用[older configuration file format](https://www.mongodb.com/docs/v2.4/reference/configuration-options/)：

   ```properties
   auth=true
   setParameter=saslauthdPath=/<some>/<path>/saslauthd/mux
   setParameter=authenticationMechanisms=PLAIN
   ```

   **使用默认的 Unix 域套接字路径**

   要使用默认的 Unix 域套接字路径，请将 [`saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath) 设置为空字符串`""`，如以下命令行示例所示：

   ```shell
   mongod --auth --setParameter saslauthdPath="" --setParameter authenticationMechanisms=PLAIN
   ```

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

   或者，如果使用 [YAML format configuration file](https://www.mongodb.com/docs/manual/reference/configuration-options/)，请在文件中指定以下设置：

   ```yaml
   security:
      authorization: enabled
   
   setParameter:
      saslauthdPath: ""
      authenticationMechanisms: PLAIN
   ```

   或者，如果使用[older configuration file format](https://www.mongodb.com/docs/v2.4/reference/configuration-options/)：

   ```properties
   auth=true
   setParameter=saslauthdPath=""
   setParameter=authenticationMechanisms=PLAIN
   ```

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp) 设置。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

3. **在 `mongosh` 中验证用户**

   您可以在连接期间从命令行进行身份验证，或者先连接然后使用  [`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth) 方法进行身份验证。

   **在连接期间进行身份验证**

   要在连接 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 时进行身份验证，请使用以下命令行选项运行 `mongosh`，替换 `<host>` 和 `<user>`，并在出现提示时输入您的密码：

   ```shell
   mongosh --host <host> --authenticationMechanism PLAIN --authenticationDatabase '$external' -u <user> -p
   ```

   服务器以明文形式转发密码。 通常，仅在受信任的通道（VPN、TLS/SSL、受信任的有线网络）上使用。 请参阅注意事项。

   **连接后验证**

   或者，在不提供凭据的情况下进行连接，然后在 `$external` 数据库上调用 [`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth) 方法。 在机制字段中指定值“`PLAIN`”，在用户和密码字段中分别指定用户和密码。 使用默认的 `digestPassword` 值 (`false`)，因为服务器必须收到未消化的密码才能转发到 `saslauthd`，如以下示例所示：

   >[TIP]提示
   >
   >从 `mongo` shell 版本 4.2 开始，您可以使用 [`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt) 方法结合各种用户身份验证/管理方法/命令来提示输入密码，而不是直接在方法/命令调用中指定密码。 但是，您仍然可以像使用早期版本的 `mongo` shell 一样直接指定密码。

   ```javascript
   db.getSiblingDB("$external").auth(
      {
        mechanism: "PLAIN",
        user: <username>,
        pwd:  passwordPrompt() // or cleartext password
      }
   )
   ```

   出现提示时输入密码。

   服务器以明文形式转发密码。 通常，仅在受信任的通道（VPN、TLS/SSL、受信任的有线网络）上使用。 请参阅注意事项。

 参见

原文 - [Authenticate Using SASL and LDAP with OpenLDAP]( https://docs.mongodb.com/manual/tutorial/configure-ldap-sasl-openldap/ )

译者：景圣
