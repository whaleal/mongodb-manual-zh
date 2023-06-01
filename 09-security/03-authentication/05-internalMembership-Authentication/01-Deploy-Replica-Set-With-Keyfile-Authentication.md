 **使用密钥文件身份验证部署副本集**

**概述**

对[replica set](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)实施访问控制需要配置：

- 使用[Internal Authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)的副本集成员之间的安全性，以及


- 使用[Role-Based Access Control](https://www.mongodb.com/docs/manual/core/authorization/)连接客户端和副本集之间的安全性。


对于本教程，副本集的每个成员都使用相同的内部身份验证机制和设置。

强制执行内部身份验证还会强制执行用户访问控制。 要连接到副本集，客户喜欢[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)
需要使用[user account](https://www.mongodb.com/docs/manual/core/authorization/)。 请参阅[Users and Authentication Mechanisms](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-with-keyfile-access-control/#std-label-security-repSetDeploy-access-control)。

**云管理器和操作管理器**

如果您当前正在使用或计划使用 Cloud Manager 或 Ops Manager，请参阅 [Cloud Manager manual](https://www.mongodb.com/docs/cloud-manager/tutorial/edit-host-authentication-credentials/)或 [
Ops Manager manual](https://www.mongodb.com/docs/ops-manager/current/tutorial/edit-host-authentication-credentials/)以实施访问控制。

**注意事项**

>[IMPORTANT]重要
>为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。 在配置副本集成员或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。
>
>使用主机名而不是 IP 地址来配置跨分割网络水平的集群。 从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

**IP绑定**

在 3.6 版中更改。

从 MongoDB 3.6 开始，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到 localhost。 如果部署的成员在不同的主机上运行，或者如果您希望远程客户端连接到您的部署，则必须指定 `--bind_ip` 或 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

**操作系统**

本教程主要涉及 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 进程。 Windows 用户应该改用 exe 程序。

**密钥文件安全**

密钥文件是最低限度的安全形式，最适合测试或开发环境。 对于生产环境，我们建议使用[x.509 certificates](https://www.mongodb.com/docs/manual/core/security-x.509/)。

**用户和认证机制**

本教程仅涵盖在 admin 数据库上创建最少数量的管理用户。 对于用户认证，本教程使用默认的 [SCRAM](https://www.mongodb.com/docs/manual/core/security-scram/) 认证机制。 质询-响应安全机制最适合测试或开发环境。 对于生产环境，我们建议使用 [x.509 certificates](https://www.mongodb.com/docs/manual/core/security-x.509/)或 [LDAP Proxy Authentication](https://www.mongodb.com/docs/manual/core/security-ldap/) （仅适用于 MongoDB Enterprise）或 [Kerberos Authentication](https://www.mongodb.com/docs/manual/core/kerberos/)（仅适用于 MongoDB Enterprise）。

有关为特定认证机制创建用户的详细信息，请参阅特定认证机制页面。

有关用户创建和管理的最佳实践，请参阅[➤ Configure Role-Based Access Control](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-security-checklist-role-based-access-control)。

**使用密钥文件访问控制部署新副本集**

>[IMPORTANT]重要
>为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。 在配置副本集成员或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。
>
>使用主机名而不是 IP 地址来配置跨分割网络水平的集群。 从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

1. **创建密钥文件**

   使用 [keyfile](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#std-label-internal-auth-keyfile)身份验证，副本集中的每个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例都使用密钥文件的内容作为共享密码来对部署中的其他成员进行身份验证。 只有具有正确密钥文件的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例才能加入副本集。

   >[NOTE]注意
   >
   >从 MongoDB 4.2 开始，[keyfiles for internal membership authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#std-label-internal-auth-keyfile)使用 YAML 格式以允许密钥文件中有多个密钥。 YAML 格式接受以下内容：
   >
   >- 单个键字符串（与早期版本相同），
   >
   >- 多个键字符串（每个字符串必须用引号引起来），或
   >
   >- 键字符串的序列。
   >
   >YAML 格式与使用文本文件格式的现有单密钥密钥文件兼容。

   密钥的长度必须介于 6 到 1024 个字符之间，并且只能包含 base64 集中的字符。 副本集的所有成员必须共享至少一个公共密钥。

   >[NOTE]注意
   >
   >在 UNIX 系统上，密钥文件不得具有组或世界权限。 在 Windows 系统上，不检查密钥文件权限。

   您可以使用您选择的任何方法生成密钥文件。 例如以下操作使用`openssl`生成一个复杂的伪随机1024字符串作为共享密码。 然后它使用 `chmod` 更改文件权限以仅向文件所有者提供读取权限：

   ```shell
   openssl rand -base64 756 > <path-to-keyfile>
   chmod 400 <path-to-keyfile>
   ```

2. **将密钥文件复制到每个副本集成员**

   将密钥文件复制到托管副本集成员的每个服务器。 确保运行 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例的用户是文件的所有者并且可以访问密钥文件。

   避免将密钥文件存储在可以轻松与托管 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例的硬件断开连接的存储介质上，例如 USB 驱动器或网络附加存储设备。

3. **在启用访问控制的情况下启动副本集的每个成员**

   对于副本集中的每个成员，使用 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 配置文件设置或 `--keyFile` 命令行选项启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。 使用 `--keyFile` 命令行选项或 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 配置文件设置运行 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 会强制执行[Internal/Membership Authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/) 和[Role-Based Access Control](https://www.mongodb.com/docs/manual/core/authorization/)。

   **配置文件**

   如果使用配置文件，设置

   - [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 到密钥文件的路径，和

   - [`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName) 到副本集名称。

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp) 设置。 有关详细信息，请参阅[Localhost Binding Compatibility Changes.](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

   ```yaml
   security:
     keyFile: <path-to-keyfile>
   replication:
     replSetName: <replicaSetName>
   net:
      bindIp: localhost,<hostname(s)|ip address(es)>
   ```

   使用配置文件启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

   ```shell
   mongod --config <path-to-config-file>
   ```

   有关配置文件的更多信息，请参阅[configuration options](https://www.mongodb.com/docs/manual/reference/configuration-options/)。

   **命令行**
   如果使用命令行选项，请使用以下选项启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

   - `--keyFile` 设置为密钥文件的路径，并且

   - `--replSet` 设置为副本集名称。

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

4. **通过本地主机接口连接到副本集的成员**

   通过[localhost interface](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到其中一个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例。 您必须在与 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例相同的物理机器上运行 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。

   [localhost interface](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)仅可用，因为尚未为部署创建用户。[localhost interface](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)界面在创建第一个用户后关闭。

5. **启动副本集**

   从 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 运行 [`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)方法。

   [`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate) 可以带一个可选的[replica set configuration document](https://www.mongodb.com/docs/manual/reference/replica-configuration/)。 在[replica set configuration document](https://www.mongodb.com/docs/manual/reference/replica-configuration/)中，包括：

   - [`_id`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf._id) 字段设置为在 [`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName) 或 `--replSet` 选项中指定的副本集名称。

   - 成员数组，每个副本集成员都有一个文档。


   以下示例启动了一个三成员副本集。

   >[IMPORTANT]重要
   >
   >仅在副本集的一个且仅一个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例上运行 [`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)。

   >[IMPORTANT]重要
   >
   >为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。 在配置副本集成员或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。
   >
   >使用主机名而不是 IP 地址来配置跨分割网络水平的集群。 从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

   ```java
rs.initiate(
  {
    _id : "myReplSet",
    members: [
      { _id : 0, host : "mongo1.example.net:27017" },
      { _id : 1, host : "mongo2.example.net:27017" },
      { _id : 2, host : "mongo3.example.net:27017" }
    ]
  }
)
   ```

   [`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)触发选举并选出其中一个成员作为主要成员。

   在继续之前连接到主服务器。 使用 [`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status) 定位主要成员。

6. **创建用户管理员。**

   >[IMPORTANT]重要
   >
   >创建第一个用户后， [localhost exception](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)将不再可用。
   >
   >第一个用户必须具有创建其他用户的权限，例如具有  [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase) 的用户。 这确保您可以在 [Localhost Exception](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception) 关闭后创建其他用户。
   >
   >如果至少有一个用户没有创建用户的权限，一旦 localhost 异常关闭，您可能无法创建或修改具有新权限的用户，因此无法访问必要的操作。

   使用 [`db.createUser()`](https://www.mongodb.com/docs/manual/reference/method/db.createUser/#mongodb-method-db.createUser) 方法添加用户。 用户至少应具有 admin 数据库的 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase) 角色。

   您必须连接到主服务器才能创建用户。

   以下示例在 admin 数据库上创建具有 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase) 角色的用户 fred。

   >[IMPORTANT]重要
   >
   >密码应随机、较长且复杂，以确保系统安全并防止或延迟恶意访问。

   >[TIP]提示
   >
   >从 `mongo` shell 版本 4.2 开始，您可以使用 [`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt) 方法结合各种用户身份验证/管理方法/命令来提示输入密码，而不是直接在方法/命令调用中指定密码。 但是，您仍然可以像使用早期版本的 `mongo` shell 一样直接指定密码。

   ```javascript
   admin = db.getSiblingDB("admin")
   admin.createUser(
     {
       user: "fred",
       pwd: passwordPrompt(), // or cleartext password
       roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
     }
   )
   ```

   出现提示时输入密码。有关内置角色和与数据库管理操作相关的完整列表，请参阅[Database User Roles](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-database-user-roles)。

7. **以用户管理员身份进行身份验证**

   向管理数据库进行身份验证。

   在 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 中，使用 [`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth) 进行身份验证。 例如，以下身份验证为用户管理员 `fred`：

   >[TIP]提示
   >
   >从 `mongo` shell 版本 4.2 开始，您可以使用 [`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt) 方法结合各种用户身份验证/管理方法/命令来提示输入密码，而不是直接在方法/命令调用中指定密码。 但是，您仍然可以像使用早期版本的 `mongo` shell 一样直接指定密码。

   ```javascript
   db.getSiblingDB("admin").auth("fred", passwordPrompt()) // or cleartext password
   ```

   或者，使用 `-u <username>`、`-p <password>` 和 `--authenticationDatabase` 参数将新的 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 实例连接到主副本集成员。

   ```shell
   mongosh -u "fred" -p  --authenticationDatabase "admin"
   ```

   如果您没有为 [`-p`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password) 命令行选项指定密码，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 会提示输入密码。

8. **创建集群管理员**

   [`clusterAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin) 角色授予对复制操作的访问权限，例如配置副本集。

   创建集群管理员用户并在 admin 数据库中分配 [`clusterAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin) 角色：

   >[TIP]提示
   >
   >从 `mongo` shell 版本 4.2 开始，您可以使用 [`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt) 方法结合各种用户身份验证/管理方法/命令来提示输入密码，而不是直接在方法/命令调用中指定密码。 但是，您仍然可以像使用早期版本的 `mongo` shell 一样直接指定密码。

   ```javascript
   db.getSiblingDB("admin").createUser(
     {
       "user" : "ravi",
       "pwd" : passwordPrompt(),     // or cleartext password
       roles: [ { "role" : "clusterAdmin", "db" : "admin" } ]
     }
   )
   ```

   出现提示时输入密码。

   有关与副本集和分片集群操作相关的内置角色的完整列表，请参阅[Cluster Administration Roles](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-cluster-admin-roles)。

9. **创建其他用户（可选）**

   创建用户以允许客户端连接副本集并与之交互。 有关用于创建只读和读写用户的基本内置角色，请参阅[Database User Roles](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-database-user-roles)。

   您可能还需要其他管理用户。 有关用户的更多信息，请参阅[Users](https://www.mongodb.com/docs/manual/core/security-users/)。

**x.509 内部认证**

有关使用 x.509 进行内部身份验证的详细信息，请参阅[Use x.509 Certificate for Membership Authentication](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/)。

要从密钥文件内部身份验证升级到 x.509 内部身份验证，请参阅[Upgrade from Keyfile Authentication to x.509 Authentication](https://www.mongodb.com/docs/manual/tutorial/upgrade-keyfile-to-x509/)。

 参见

原文 - [Deploy Replica Set With Keyfile Authentication]( https://docs.mongodb.com/manual/tutorial/deploy-replica-set-with-keyfile-access-control/ )

译者：景圣

