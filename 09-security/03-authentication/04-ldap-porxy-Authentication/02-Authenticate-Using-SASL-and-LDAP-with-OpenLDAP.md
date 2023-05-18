# 通过 OpenLDAP 使用 SASL 和 LDAP 进行身份验证

MongoDB Enterprise 提供对用户代理身份验证的支持。这允许管理员配置 MongoDB 集群，通过将身份验证请求代理到指定的轻量级目录访问协议 (LDAP) 服务来对用户进行身份验证。

> 笔记:
>
> 对于链接的 MongoDB 4.2 Enterprise 二进制文件 `libldap`（例如在 RHEL 上运行时），对 的访问 `libldap`是同步的，会产生一些性能/延迟成本。
>
> 对于链接到 的 MongoDB 4.2 Enterprise 二进制文件 `libldap_r`，与早期 MongoDB 版本相比，行为没有变化.

## 注意事项

> 警告:
>
> MongoDB Enterprise for Windows 不支持通过 saslauthd 进行绑定。

* Linux MongoDB 服务器支持通过守护进程绑定到 LDAP 服务器 `saslauthd`。
* 在客户端和服务器之间以及`saslauthd`LDAP 服务器之间使用安全加密或受信任的连接。LDAP 服务器使用该机制，以**明文形式**`SASL PLAIN`发送和接收数据。您应该只使用受信任的渠道，例如 VPN、使用 TLS/SSL 加密的连接或受信任的有线网络。

## 配置`saslauthd`

`saslauthd`LDAP 对用户身份验证的支持需要守护进程和 MongoDB 服务器的正确配置。

1. 指定机制

   `saslauthd`在使用该 文件配置的系统上`/etc/sysconfig/saslauthd`，例如 Red Hat Enterprise Linux、Fedora、CentOS 和 Amazon Linux AMI，将机制设置`MECH`为 `ldap`：

   ```
   MECH=ldap
   ```

   `saslauthd`在使用该 文件配置的系统`/etc/default/saslauthd`（例如 Ubuntu）上，将选项设置`MECHANISMS` 为`ldap`：

   ```
   MECHANISMS="ldap"
   ```

2. 调整缓存行为

   在某些 Linux 发行版上，从*启用*`saslauthd`身份验证凭据的缓存开始。直到重新启动或直到缓存过期，才会联系 LDAP 服务器以在其身份验证缓存中重新验证用户。这允许 在其缓存中成功验证用户，即使在 LDAP 服务器已关闭或缓存用户的凭据已被撤销的情况下。`saslauthd``saslauthd`

   要设置身份验证缓存的过期时间（以秒为单位），请参阅[-t 选项](http://www.linuxcommand.org/man_pages/saslauthd8.html)的 `saslauthd`。

3. 使用 OpenLDAP 配置 LDAP 选项.

   如果该`saslauthd.conf`文件不存在，请创建它。该`saslauthd.conf`文件通常位于`/etc` 文件夹中。如果指定不同的文件路径，请参阅 [-O选项](http://www.linuxcommand.org/man_pages/saslauthd8.html)的 `saslauthd`。

   要连接到 OpenLDAP 服务器，请`saslauthd.conf` 使用以下配置选项更新文件：

   ```
   ldap_servers: <ldap uri>
   ldap_search_base: <search base>
   ldap_filter: <filter>
   ```

   指定`ldap_servers`用于身份验证的 LDAP 服务器的 uri。通常，对于安装在本地计算机上的 OpenLDAP，您可以指定值`ldap://localhost:389` ，或者如果使用基于 TLS/SSL 的 LDAP，您可以指定值 `ldaps://localhost:636`。

   指定`ldap_search_base`与搜索相关的专有名称。搜索包括下面的基地或对象。

   指定`ldap_filter`搜索过滤器。

   这些配置选项的值应对应于特定于您的测试的值。例如，要过滤电子邮件，请 `ldap_filter: (mail=%n)`改为指定。

   #### OpenLDAP 示例

   OpenLDAP 的样本`saslauthd.conf`文件包括以下内容：

   ```
   ldap_servers: ldaps://ad.example.net
   ldap_search_base: ou=Users,dc=example,dc=com
   ldap_filter: (uid=%u)
   ```

   要使用此示例 OpenLDAP 配置，请创建具有属性（登录名）的用户`uid` 并将其置于域组件 ( )和 下的`Users`组织单位 ( ) 下。`ou``dc``example``com`

   有关`saslauthd`配置的更多信息，请参阅 [
   http://www.openldap.org/doc/admin24/guide.html#Configuringsaslauthd](http://www.openldap.org/doc/admin24/guide.html#Configuringsaslauthd).

4. 测试`saslauthd`配置

   使用实用`testsaslauthd`程序测试配置`saslauthd` 。例如：

   ```
   testsaslauthd -u testuser -p testpassword -f /var/run/saslauthd/mux
   ```

   - `0: OK "Success"`表示认证成功。
   - `0: NO "authentication failed"`表示用户名、密码或配置错误。

   根据 `saslauthd`主机操作系统上的目录位置修改文件路径。

   > 重要的:
   >
   > 指定给或的 `saslauthd`Unix 域套接字文件的父目录必须授予读取和执行 ( ) 权限：[`security.sasl.saslauthdSocketPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.sasl.saslauthdSocketPath)[`--setParameter saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath)`r-x`
   >
   > - 用户*启动*[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)或
   > - 该用户所属的组。
   >
   > 如果没有对目录及其内容的指定权限，则[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)无法通过身份验证成功 。`saslauthd``saslauthd`

## 配置 MongoDB

1. 将用户添加到 MongoDB 以进行身份验证。

   将用户添加到`$external`MongoDB 中的数据库。要指定用户的权限，请为用户分配[角色。](https://www.mongodb.com/docs/manual/core/authorization/)

   要对身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[客户端会话和因果一致性保证](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)，`$external`用户名不能超过 10k 字节。

   例如，以下添加一个对数据库具有只读访问权限的用户`records`。

   ```shell
   db.getSiblingDB("$external").createUser(
       {
         user : <username>,
         roles: [ { role: "read", db: "records" } ]
       }
   )
   
   ```

   根据需要添加其他主体。有关创建和管理用户的更多信息，请参阅 [用户管理命令。](https://www.mongodb.com/docs/manual/reference/command/nav-user-management/)

2. 配置 MongoDB 服务器

   要将 MongoDB 服务器配置为使用`saslauthd`实例进行代理身份验证，请在启动时包括以下选项[`mongod`：](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

   * [`--auth`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--auth)命令行选项或[`security.authorization`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.authorization)设置，

   * [`authenticationMechanisms`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)参数设置为`PLAIN`, 和

   * [`saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath)参数设置为实例的 Unix 域套接字的路径`saslauthd`。

     >重要的:
     >
     >指定给或的 `saslauthd`Unix 域套接字文件的父目录必须授予读取和执行 ( ) 权限：[`security.sasl.saslauthdSocketPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.sasl.saslauthdSocketPath)[`--setParameter saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath)`r-x`
     >
     >- 用户*启动*[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)或
     >- 该用户所属的组。
     >
     >如果没有对目录及其内容的指定权限，则[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)无法通过身份验证成功 。`saslauthd``saslauthd`

   如果您使用该[`authorization`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.authorization)选项来强制执行身份验证，您将需要创建用户的权限。

   #### 使用特定的`saslauthd`套接字路径。

   对于 的套接字路径`/<some>/<path>/saslauthd`，将 设置 [`saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath)为`/<some>/<path>/saslauthd/mux`，如以下命令行示例所示：

   ```
   mongod --auth --setParameter saslauthdPath=/<some>/<path>/saslauthd/mux --setParameter authenticationMechanisms=PLAIN
   ```

   根据您的配置需要包括其他选项。例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`. 有关详细信息，请参阅 [本地主机绑定兼容性更改。](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

   或者，如果使用[YAML 格式的配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)，请在文件中指定以下设置：

   ```shell
   security:
      authorization: enabled
   
   setParameter:
      saslauthdPath: /<some>/<path>/saslauthd/mux
      authenticationMechanisms: PLAIN
   ```

   或者，如果使用[旧的配置文件格式：](https://www.mongodb.com/docs/v2.4/reference/configuration-options/)

   ```shell
   auth=true
   setParameter=saslauthdPath=/<some>/<path>/saslauthd/mux
   setParameter=authenticationMechanisms=PLAIN
   ```

   #### 使用默认的 Unix 域套接字路径。

   要使用默认的 Unix 域套接字路径，请将 设置 [`saslauthdPath`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslauthdPath)为空字符串`""`，如以下命令行示例所示：

   ```shell
   mongod --auth --setParameter saslauthdPath="" --setParameter authenticationMechanisms=PLAIN
   ```

   根据您的配置需要包括其他选项。例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`. 有关详细信息，请参阅 [本地主机绑定兼容性更改。](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

   或者，如果使用[YAML 格式的配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)，请在文件中指定以下设置：

   ```shell
   security:
      authorization: enabled
   
   setParameter:
      saslauthdPath: ""
      authenticationMechanisms: PLAIN
   ```

   或者，如果使用[旧的配置文件格式：](https://www.mongodb.com/docs/v2.4/reference/configuration-options/)

   ```shell
   auth=true
   setParameter=saslauthdPath=""
   setParameter=authenticationMechanisms=PLAIN
   ```

   根据您的配置需要包括其他选项。例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定设置[`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)。有关详细信息，请参阅[本地主机绑定兼容性更改。](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

3. 对用户进行身份验证`mongosh`

   您可以在连接期间从命令行进行身份验证，或者先连接然后使用[`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth)方法进行身份验证。

   **在连接期间进行身份验证:**

   连接时进行身份验证 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，`mongosh`使用以下命令行选项运行，替换`<host>`和 `<user>`，并在出现提示时输入您的密码：

   ```
   mongosh --host <host> --authenticationMechanism PLAIN --authenticationDatabase '$external' -u <user> -p
   ```

   **连接后验证:**

   或者，在不提供凭据的情况下进行连接，然后在数据库[`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth)上调用该方法`$external`。`"PLAIN"`分别在字段中指定值，在和字段`mechanism`中指定用户和密码。使用默认 值 ( )，因为服务器必须收到未消化的密码才能转发到，如以下示例所示：`user``pwd``digestPassword``false``saslauthd`

   > 提示:
   >
   > 从 shell 的 4.2 版本开始`mongo`，您可以将[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)方法与各种用户身份验证/管理方法/命令结合使用来提示输入密码，而不是直接在方法/命令调用中指定密码。但是，您仍然可以像使用早期版本的 shell 一样直接指定密码 `mongo`。

   ```shell
   db.getSiblingDB("$external").auth(
      {
        mechanism: "PLAIN",
        user: <username>,
        pwd:  passwordPrompt() // or cleartext password
      }
   )
   ```

   出现提示时输入密码

   服务器以明文形式转发密码。通常，仅在受信任的通道（VPN、TLS/SSL、受信任的有线网络）上使用。请参阅注意事项。







翻译：韩鹏帅

原文：[Authenticate Using SASL and LDAP with OpenLDAP](https://www.mongodb.com/docs/manual/tutorial/configure-ldap-sasl-openldap/)