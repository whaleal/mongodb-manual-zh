## Security

## 安全

MongoDB provides various features, such as authentication, access control, encryption, to secure your MongoDB deployments. Some key security features include:

MongoD提供了各种各样的功能让你安全地部署MongoDB，诸如：身份认证、访问控制、加密。一些关键的安全功能包括：

| Authentication                                               | Authorization                                                | TLS/SSL                                                      |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| [Authentication](https://docs.mongodb.com/manual/core/authentication/)[SCRAM](https://docs.mongodb.com/manual/core/security-scram/)[x.509](https://docs.mongodb.com/manual/core/security-x.509/) | [Role-Based Access Control](https://docs.mongodb.com/manual/core/authorization/)[Enable Access Control](https://docs.mongodb.com/manual/tutorial/enable-authentication/)[Manage Users and Roles](https://docs.mongodb.com/manual/tutorial/manage-users-and-roles/) | [TLS/SSL (Transport Encryption)](https://docs.mongodb.com/manual/core/security-transport-encryption/)[Configure mongod and mongos for TLS/SSL](https://docs.mongodb.com/manual/tutorial/configure-ssl/)[TLS/SSL Configuration for Clients](https://docs.mongodb.com/manual/tutorial/configure-ssl-clients/) |

| Enterprise Only                                              | Encryption                                                   |      |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :--- |
| [Kerberos Authentication](https://docs.mongodb.com/manual/core/kerberos/)[LDAP Proxy Authentication](https://docs.mongodb.com/manual/core/security-ldap/)[Encryption at Rest](https://docs.mongodb.com/manual/core/security-encryption-at-rest/)[Auditing](https://docs.mongodb.com/manual/core/auditing/) | [Client-Side Field Level Encryption](https://docs.mongodb.com/manual/core/security-client-side-encryption/) |      |



| Authentication                                               | Authorization                                                | TLS/SSL                                                      |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| [身份认证](https://docs.mongodb.com/manual/core/authentication/)  [SCRAM](https://docs.mongodb.com/manual/core/security-scram/)  [x.509](https://docs.mongodb.com/manual/core/security-x.509/) | [基于角色的访问控制](https://docs.mongodb.com/manual/core/authorization/)  [启动访问控制](https://docs.mongodb.com/manual/tutorial/enable-authentication/)  [用户与角色管理](https://docs.mongodb.com/manual/tutorial/manage-users-and-roles/) | [TLS/SSL (传输加密)](https://docs.mongodb.com/manual/core/security-transport-encryption/)  [使用TLS/SSL配置mongod和mongos](https://docs.mongodb.com/manual/tutorial/configure-ssl/) [为客户端配置TLS/SSL ](https://docs.mongodb.com/manual/tutorial/configure-ssl-clients/) |

| Enterprise Only                                              | Encryption                                                   |      |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :--- |
| [Kerberos 验证](https://docs.mongodb.com/manual/core/kerberos/)  [LDAP 代理验证](https://docs.mongodb.com/manual/core/security-ldap/)  [静态加密](https://docs.mongodb.com/manual/core/security-encryption-at-rest/)  [审计](https://docs.mongodb.com/manual/core/auditing/) | [客户端字段级加密](https://docs.mongodb.com/manual/core/security-client-side-encryption/) |      |



### Security Checklist

### 安全检查列表

MongoDB also provides the [Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/) for a list of recommended actions to protect a MongoDB deployment.

MongoDB还为如何保护MongoDB部署提供了一个建议的操作列表即[安全检查列表]((https://docs.mongodb.com/manual/administration/security-checklist/))

*Last updated: 2019-12-05*

*最后更新于：2019-12-05*

This documents provides a list of security measures that you should implement to protect your MongoDB installation. The list is not meant to be exhaustive.

这个文档提供了一个保护MongoDB应该实施的安全措施列表。这个列表并不是完整无遗的。

**Pre-production Checklist/Considerations**

**生产环境前的检查列表/注意事项**

### ➤ Enable Access Control and Enforce Authentication

### ➤启动访问控制和强制身份认证

Enable access control and specify the authentication mechanism. You can use MongoDB’s SCRAM or x.509 authentication mechanism or integrate with your existing Kerberos/LDAP infrastructure. Authentication requires that all clients and servers provide valid credentials before they can connect to the system.

启动访问控制和指定身份认证的机制。你可以使用MongoDB的SCRMA或者x.509身份认证机制或者集成你已经使用的Kerberos/LDAP基础设施。身份认证要求所有的客户端和服务端在连接到系统之前提供有效的凭证。

See [Authentication](https://docs.mongodb.com/manual/core/authentication/) and [Enable Access Control](https://docs.mongodb.com/manual/tutorial/enable-authentication/).

请参阅[身份认证](https://docs.mongodb.com/manual/core/authentication/)和[开启访问控制](https://docs.mongodb.com/manual/tutorial/enable-authentication/)。

### ➤ Configure Role-Based Access Control

### ➤ 配置基于角色的访问控制

Create a user administrator **first**, then create additional users. Create a unique MongoDB user for each person/application that accesses the system.

**首先**创建一个管理员用户，然后再创建其他的用户。为每一人/应用程序创建唯一的用户以访问系统。

Follow the principle of least privilege. Create roles that define the exact access rights required by a set of users. Then create users and assign them only the roles they need to perform their operations. A user can be a person or a client application.

遵循最小权限原则。为一组用户创建他们所需的确切访问权限的角色。然后创建用户并且仅为他们分配执行操作所需的角色。一个用户可以是个人或者一个客户端程序。

>TIP
>
>A user can have privileges across different databases. If a user requires privileges on multiple databases, create a single user with roles that grant applicable database privileges instead of creating the user multiple times in different databases.

>提示：
>
>一个用户在不同数据库可以拥有不同的权限。如果一个用户要求在多个数据库的权限，使用有多个可授予适当数据库权限的角色来创建一个单一用户，而不是给不同的数据库创建多个用户。

See [Role-Based Access Control](https://docs.mongodb.com/manual/core/authorization/) and [Manage Users and Roles](https://docs.mongodb.com/manual/tutorial/manage-users-and-roles/).

请参阅[基于角色的访问控制](https://docs.mongodb.com/manual/core/authorization/)和[用户与角色管理](https://docs.mongodb.com/manual/tutorial/manage-users-and-roles/)。

### ➤ Encrypt Communication (TLS/SSL)

### ➤ 加密通信（TLS/SSL）

Configure MongoDB to use TLS/SSL for all incoming and outgoing connections. Use TLS/SSL to encrypt communication between [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) and [`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) components of a MongoDB deployment as well as between all applications and MongoDB.

配置MongoDB为所有传入和传出连接使用TLS/SSL。使用TLS/SSL加密MongoDB部署的[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)和[`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)组件以及所有应用程序和MongoDB之间的通信。

Starting in version 4.0, MongoDB uses the native TLS/SSL OS libraries:

从4.0版本开始，MongoDB使用操作系统原生的TLS/SSL库：

| Windows   | Secure Channel (Schannel) |
| --------- | ------------------------- |
| Linux/BSD | OpenSSL                   |
| macOS     | Secure Transport          |

| 操作系统  | 使用的系统库     |
| :-------- | ---------------- |
| Linux/BSD | OpenSSL          |
| macOS     | Secure Transport |

>NOTE
>
>Starting in version 4.0, MongoDB disables support for TLS 1.0 encryption on systems where TLS 1.1+ is available. For more details, see [Disable TLS 1.0](https://docs.mongodb.com/manual/release-notes/4.0/#disable-tls).

> 注意
>
> 从4.0版本开始，在支持TLS1.1+的系统上，MongoDB会禁用TLS1.0加密。更多详细信息，请参阅 [禁用TLS1.0](https://docs.mongodb.com/manual/tutorial/configure-ssl/).

请[参阅使用TLS/SSL配置mongod和mongos](https://docs.mongodb.com/manual/tutorial/configure-ssl/)

### ➤ Encrypt and Protect Data

### ➤加密和保护数据

Starting with MongoDB Enterprise 3.2, you can encrypt data in the storage layer with the WiredTiger storage engine’s native [Encryption at Rest](https://docs.mongodb.com/manual/core/security-encryption-at-rest/).

从MongoDB 3.2企业版开始，你可以使用WiredTiger存储引擎的本地[静态加密](https://docs.mongodb.com/manual/core/security-encryption-at-rest/)来加密存储层的数据。

If you are not using WiredTiger’s encryption at rest, MongoDB data should be encrypted on each host using file-system, device, or physical encryption (e.g. dm-crypt). Protect MongoDB data using file-system permissions. MongoDB data includes data files, configuration files, auditing logs, and key files.

如果你没有使用WiredTiger的静态加密，MongoDB的数据应该在每台主机上使用文件系统、设备或物理加密（例如dm-crypt）。使用文件系统权限保护MongoDB数据。MongoDB数据包括数据文件、配置文件、审计日志以及秘钥文件。

Collect logs to a central log store. These logs contain DB authentication attempts including source IP address.

将日志收集到一个中央日志存储区。这些日志包含了DB身份认证尝试及其源IP地址.

### ➤ Limit Network Exposure

### ➤ 限制网络暴露

Ensure that MongoDB runs in a trusted network environment and configure firewall or security groups to control inbound and outbound traffic for your MongoDB instances.

确保MongoDB运行在受信任的网络环境中并且配置防火墙或者安全组来控制MongoDB实例的入站和出站流量。

Allow only trusted clients to access the network interfaces and ports on which MongoDB instances are available. For instance, use IP whitelisting to allow access from trusted IP addresses (see )

只允许受信任的客户端访问MongoDB实例所在的网络接口和端口。例如，使用白名单机制允许受信任的IP地址访问。

>NOTE
>
>Starting with MongoDB 3.6, MongoDB binaries, [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) and [`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos), bind to `localhost` by default. From MongoDB versions 2.6 to 3.4, only the binaries from the official MongoDB RPM (Red Hat, CentOS, Fedora Linux, and derivatives) and DEB (Debian, Ubuntu, and derivatives) packages would bind to `localhost` by default. To learn more about this change, see [Localhost Binding Compatibility Changes](https://docs.mongodb.com/manual/release-notes/3.6-compatibility/#bind-ip-compatibility).

> 注意
>
> 从MongoDB 3.6开始，MongoDB的二进制文件：[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)和[`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)会默认绑定在`localhost`上。MongoDB 2.6到3.4版本，只有官方MongoDB RPM（Red Hat、CentOS、Fedora Linux和衍生品）和DEB（Debian、Ubuntu和衍生品）包中的二进制文件默认绑定在localhost。了解更多关于这个改变的信息，请参阅[localhost绑定兼容变更](https://docs.mongodb.com/manual/release-notes/3.6-compatibility/#bind-ip-compatibility)

See:

- [Network and Configuration Hardening](https://docs.mongodb.com/manual/core/security-hardening/)
- [`net.bindIp`](https://docs.mongodb.com/manual/reference/configuration-options/#net.bindIp) configuration setting
- [`security.clusterIpSourceWhitelist`](https://docs.mongodb.com/manual/reference/configuration-options/#security.clusterIpSourceWhitelist) configuration setting
- [authenticationRestrictions](https://docs.mongodb.com/manual/reference/method/db.createUser/#db-createuser-authenticationrestrictions) to specify per-user IP whitelist.

请参阅：

- [网络和配置加固](https://docs.mongodb.com/manual/core/security-hardening/)
- [`net.bindIp`](https://docs.mongodb.com/manual/reference/configuration-options/#net.bindIp)配置设定
- [`security.clusterIpSourceWhitelist`](https://docs.mongodb.com/manual/reference/configuration-options/#security.clusterIpSourceWhitelist)配置设定
- [authenticationRestrictions](https://docs.mongodb.com/manual/reference/method/db.createUser/#db-createuser-authenticationrestrictions)为每个用户指定IP白名单

Disable direct SSH root access.

禁用直接SSH root访问。

### ➤ Audit System Activity

### ➤系统活动审计

Track access and changes to database configurations and data. [MongoDB Enterprise](http://www.mongodb.com/products/mongodb-enterprise-advanced?jmp=docs) includes a system auditing facility that can record system events (e.g. user operations, connection events) on a MongoDB instance. These audit records permit forensic analysis and allow administrators to verify proper controls. You can set up filters to record specific events, such as authentication events.

跟踪对数据库配置和数据的访问和更改。[MongoDB企业版](http://www.mongodb.com/products/mongodb-enterprise-advanced?jmp=docs)包含了一个系统审计工具，可以记录MongoDB实例上的系统事件（例如用户操作、连接事件）。这些审计记录使审查分析得以进行并且允许管理员去验证适当的控制。可以设置过滤器来记录特定的事件，例如身份认证事件。

See [Auditing](https://docs.mongodb.com/manual/core/auditing/) and [Configure Auditing](https://docs.mongodb.com/manual/tutorial/configure-auditing/).

请参阅[Auditing](https://docs.mongodb.com/manual/core/auditing/) 和[Configure Auditing](https://docs.mongodb.com/manual/tutorial/configure-auditing/)

### ➤ Run MongoDB with a Dedicated User

### ➤使用专用用户运行MongoDB

Run MongoDB processes with a dedicated operating system user account. Ensure that the account has permissions to access data but no unnecessary permissions.

使用一个专用的操作系统账户运行MongoDB进程。确保这个账户除了访问数据，没有不必要的权限。

See [Install MongoDB](https://docs.mongodb.com/manual/installation/) for more information on running MongoDB.

关于运行MongoDB的更多信息，请参阅[MongoDB安装](https://docs.mongodb.com/manual/installation/)

### ➤ Run MongoDB with Secure Configuration Options

### ➤ 使用安全的配置选项运行MongoDB

MongoDB supports the execution of JavaScript code for certain server-side operations: [`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce) and [`$where`](https://docs.mongodb.com/manual/reference/operator/query/where/#op._S_where). If you do not use these operations, disable server-side scripting by using the [`--noscripting`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-noscripting) option on the command line.

MongoDB支持使用JavaScript代码对服务器端执行特定的操作，包括：[`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce)和[`$where`](https://docs.mongodb.com/manual/reference/operator/query/where/#op._S_where)。如果你不使用这些操作，在命令行使用[`--noscripting`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-noscripting)选项来禁用服务器端脚本。

Keep input validation enabled. MongoDB enables input validation by default through the [`net.wireObjectCheck`](https://docs.mongodb.com/manual/reference/configuration-options/#net.wireObjectCheck) setting. This ensures that all documents stored by the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instance are valid [BSON](https://docs.mongodb.com/manual/reference/glossary/#term-bson).

确保启用了输入验证。MongoDB默认通过[`net.wireObjectCheck`](https://docs.mongodb.com/manual/reference/configuration-options/#net.wireObjectCheck)设置启用输入验证。这确保了[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)实例存储的所有文档都是有效的[BSON](https://docs.mongodb.com/manual/reference/glossary/#term-bson)。

SEE:[Network and Configuration Hardening](https://docs.mongodb.com/manual/core/security-hardening/).

请参阅：[网络和配置加固](https://docs.mongodb.com/manual/core/security-hardening/)

### ➤ Request a Security Technical Implementation Guide (where applicable)

### ➤索取安全技术实施指南（如适用）

The Security Technical Implementation Guide (STIG) contains security guidelines for deployments within the United States Department of Defense. MongoDB Inc. provides its STIG, upon request, for situations where it is required. Please [request a copy](http://www.mongodb.com/lp/contact/stig-requests) for more information.

安全技术实施指南（STIG）包含美国国防部内部部署的安全指南。MongoDB公司为需要的情况提供了它的STIG。请[索取一个副本](http://www.mongodb.com/lp/contact/stig-requests)以获取更多信息。

### ➤ Consider Security Standards Compliance

### ➤考虑安全标准的合规性

For applications requiring HIPAA or PCI-DSS compliance, please refer to the [MongoDB Security Reference Architecture](https://www.mongodb.com/collateral/mongodb-security-architecture) to learn more about how you can use the key security capabilities to build compliant application infrastructure.

对于需要遵循HIPAA或者PCI-DSS的应用程序，请参看[MongoDB安全参考架构](https://www.mongodb.com/collateral/mongodb-security-architecture)以了解更多关于如何使用关键安全功能来构建合规的应用程序基础设施。

### Periodic/Ongoing Production Checks

### 定期/持续的产品检查

Periodically check for [MongoDB Product CVE](https://www.mongodb.com/alerts) and upgrade your products .

定期检查[MongoDB产品通用漏洞披露](https://www.mongodb.com/alerts)并且更新你的产品。

Consult the [MongoDB end of life dates](https://www.mongodb.com/support-policy) and upgrade your MongoDB installation. In general, try to stay on the latest version.

查询[MongoDB的生命周期终止日期](https://www.mongodb.com/support-policy)并升级你的MongoDB。一般来说，尽量使用最新的版本。

Ensure that your information security management system policies and procedures extend to your MongoDB installation, including performing the following:

确保你的信息安全管理的系统策略和程序在你安装的MongoDB上生效，包括执行以下操作：

- Periodically apply patches to your machine and review guidelines.
- Review policy/procedure changes, especially changes to your network rules to prevent inadvertent MongoDB exposure to the Internet.
- Review MongoDB database users and periodically rotate them.

- 定期对你的设备打补丁并且检查操作指南
- 检查策略及流程变更，尤其是网络规则的更改，以防无意中将MongoDB暴露在互联网。
- 检查MongoDB数据库用户并定期进行轮换。

原文链接：https://docs.mongodb.com/manual/security/

https://docs.mongodb.com/manual/administration/security-checklist/

译者：傅立
