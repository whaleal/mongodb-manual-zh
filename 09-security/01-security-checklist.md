# 安全检查表

本文档提供了一个安全措施列表，您应该实施这些措施来保护您的 MongoDB 安装。该清单并非详尽无遗。

## 生产前检查清单/注意事项

* 启用访问控制并强制执行身份验证

  * 启用访问控制并指定身份验证机制

    MongoDB 社区支持多种[身份验证机制](https://www.mongodb.com/docs/manual/core/authentication/#std-label-security-authentication-mechanisms)，客户端可以使用这些机制来验证其身份:

    * [SCRAM](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram)（*默认*）
    * [x.509 证书身份验证。](https://www.mongodb.com/docs/manual/core/security-x.509/#std-label-security-auth-x509)

    除了上述机制外，MongoDB Atlas 和 MongoDB Enterprise 还支持以下机制：

    * [LDAP 代理身份验证](https://www.mongodb.com/docs/manual/core/authentication/#std-label-security-auth-ldap)，以及
    * [Kerberos 身份验证。](https://www.mongodb.com/docs/manual/core/authentication/#std-label-security-auth-kerberos)

    这些机制允许 MongoDB 集成到您现有的身份验证系统中。

  > 提示:
  >
  > **也可以看看**:
  >
  > * [验证](https://www.mongodb.com/docs/manual/core/authentication/)
  > * [启用访问控制](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)

* 配置基于角色的访问控制

  * **先**创建[用户管理员](https://www.mongodb.com/docs/manual/tutorial/configure-scram-client-authentication/#std-label-create-user-admin) ，再创建其他用户。为访问系统的每个人/应用程序创建一个唯一的 MongoDB 用户。

  * 遵循最小特权原则。创建定义一组用户所需的确切访问权限的角色。然后创建用户并仅向他们分配执行操作所需的角色。用户可以是个人或客户端应用程序。

    > 笔记:
    >
    > 一个用户可以拥有跨不同数据库的权限。如果用户需要多个数据库的权限，请创建一个具有授予适用数据库权限的角色的用户，而不是在不同的数据库中多次创建用户。

  > 提示:
  >
  > ** 也可以看看：**
  >
  > - [基于角色的访问控制](https://www.mongodb.com/docs/manual/core/authorization/)
  > - [管理用户和角色](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/)

* 加密通信 (TLS/SSL)

  * 将 MongoDB 配置为对所有传入和传出连接使用 TLS/SSL。使用 TLS/SSL 加密 MongoDB 部署组件之间以及所有应用程序和 MongoDB 之间的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)通信。[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

    MongoDB 使用本机 TLS/SSL 操作系统库：

    | 平台         | TLS/SSL 库          |
    | :----------- | :------------------ |
    | 视窗         | 安全通道 (Schannel) |
    | 操作系统/BSD | 打开SSL             |
    | 苹果系统     | 安全运输            |

  > 提示:
  >
  > **也可以看看：**
  >
  > [为 TLS/SSL配置`mongod`和。`mongos`](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)

* 加密和保护数据

  * 您可以使用 WiredTiger 存储引擎的本机静态[加密对存储层中的数据进行加密。](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)
  * 如果您未使用 WiredTiger 的静态加密，则应使用文件系统、设备或物理加密（例如 dm-crypt）在每个主机上对 MongoDB 数据进行加密。您还应该使用文件系统权限来保护 MongoDB 数据。MongoDB数据包括数据文件、配置文件、审计日志和密钥文件。
  * 在通过线路将数据传输到服务器之前，您可以使用[可查询加密](https://www.mongodb.com/docs/manual/core/queryable-encryption/#std-label-qe-manual-feature-qe)或[客户端字段级加密来加密文档应用程序端中的字段。](https://www.mongodb.com/docs/manual/core/csfle/#std-label-manual-csfle-feature)
  * 将日志收集到中央日志存储。这些日志包含数据库身份验证尝试，包括源 IP 地址。

* 限制网络曝光

  * 确保 MongoDB 在受信任的网络环境中运行，并配置防火墙或安全组来控制 MongoDB 实例的入站和出站流量。
  * 禁用直接 SSH root 访问。
  * 只允许受信任的客户端访问 MongoDB 实例可用的网络接口和端口。

  >提示:
  >
  >**也可以看看:**
  >
  >- [网络和配置强化](https://www.mongodb.com/docs/manual/core/security-hardening/)
  >- 配置[`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)设置
  >- 配置[`security.clusterIpSourceAllowlist`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.clusterIpSourceAllowlist)设置
  >- 命令的 authenticationRestrictions 字段 指定[每个](https://www.mongodb.com/docs/manual/reference/method/db.createUser/#std-label-db-createUser-authenticationRestrictions)[`db.createUser()`](https://www.mongodb.com/docs/manual/reference/method/db.createUser/#mongodb-method-db.createUser)用户的 IP 允许列表。

* 审核系统活动

  * 跟踪对数据库配置和数据的访问和更改。 [MongoDB 企业版](http://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server) 包括一个系统审计工具，可以记录 MongoDB 实例上的系统事件（包括用户操作和连接事件）。这些审计记录允许进行取证分析，并允许管理员进行适当的控制。您可以设置过滤器以仅记录特定事件，例如身份验证事件。

  >提示:
  >
  >**也可以看看：**
  >
  >- [审计](https://www.mongodb.com/docs/manual/core/auditing/)
  >- [配置审计](https://www.mongodb.com/docs/manual/tutorial/configure-auditing/)

* 使用专用用户运行 MongoDB

  * 使用专用操作系统用户帐户运行 MongoDB 进程。确保该帐户具有访问数据的权限，但没有不必要的权限。

  > 提示:
  >
  > **也可以看看：**
  >
  > [安装 MongoDB](https://www.mongodb.com/docs/manual/installation/)

* 使用安全配置选项运行 MongoDB

  * MongoDB 支持为某些服务器端操作 执行 JavaScript 代码：[`mapReduce`](https://www.mongodb.com/docs/manual/reference/command/mapReduce/#mongodb-dbcommand-dbcmd.mapReduce)、、、和。如果您不使用这些操作，请使用该选项禁用服务器端脚本。[`$where`](https://www.mongodb.com/docs/manual/reference/operator/query/where/#mongodb-query-op.-where)[`$accumulator`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/accumulator/#mongodb-group-grp.-accumulator)[`$function`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/function/#mongodb-expression-exp.-function)[`--noscripting`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--noscripting)
  * 保持输入验证启用。MongoDB 通过[`net.wireObjectCheck`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.wireObjectCheck)设置默认启用输入验证。这确保实例存储的所有文档 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)都是有效的[BSON 。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON)

* 索取安全技术实施指南（如适用）

  * 安全技术实施指南 (STIG) 包含美国国防部内部部署的安全指南。MongoDB Inc. 提供其 STIG，基于 [要求](http://www.mongodb.com/lp/contact/stig-requests).

* 考虑安全标准合规性

  * 对于需要 HIPAA 或 PCI-DSS 合规性的应用，请参阅[MongoDB 安全参考架构](https://www.mongodb.com/collateral/mongodb-security-architecture) 了解有关如何使用 MongoDB 的关键安全功能构建合规应用程序基础设施的更多信息。

## 定期/持续的生产检查

* 定期检查[MongoDB 产品 CVE](https://www.mongodb.com/alerts)并升级您的产品。
* 咨询的[MongoDB 生命周期结束日期](https://www.mongodb.com/support-policy)并根据需要升级您的 MongoDB 安装。一般来说，尽量保持最新版本。
* 确保您的信息安全管理系统策略和程序扩展到您的 MongoDB 安装，包括执行以下操作：
  - 定期为您的机器应用补丁。
  - 查看策略/程序更改，尤其是对网络规则的更改，以防止无意中将 MongoDB 暴露在 Internet 上。
  - 查看 MongoDB 数据库用户并定期轮换他们。

## 报告可疑的安全漏洞

如果您怀疑您在任何 MongoDB 产品中发现了安全漏洞，请通过 MongoDB 报告该问题[错误提交表格](https://www.mongodb.com/security).







译者：韩鹏帅

原文：[Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
