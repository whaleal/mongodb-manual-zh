 **使用密钥文件身份验证部署分片集群**

**概述**

在[sharded cluster](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)上实施访问控制需要配置：

- 使用[Internal Authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)的集群组件之间的安全性。


- 使用[User Access Controls](https://www.mongodb.com/docs/manual/core/authorization/)连接客户端和集群之间的安全性。


对于本教程，分片集群的每个成员都必须使用相同的内部身份验证机制和设置。 这意味着对集群中的每个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 和 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 强制执行内部身份验证。

以下教程使用密钥文件启用内部身份验证。

强制执行内部身份验证还会强制执行用户访问控制。 要连接到副本集，像 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 这样的客户端
需要使用[user account](https://www.mongodb.com/docs/manual/core/authorization/)。 请参阅[Access Control](https://www.mongodb.com/docs/manual/tutorial/deploy-sharded-cluster-with-keyfile-access-control/#std-label-security-shardClust-deploy-access-control)。

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

从 MongoDB 3.6 开始，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到 localhost。 

**密钥文件安全**

密钥文件是最低限度的安全形式，最适合测试或开发环境。 对于生产环境，我们建议使用 [x.509 certificates](https://www.mongodb.com/docs/manual/core/security-x.509/)。

**访问控制**

本教程仅涵盖在 admin 数据库上创建最少数量的管理用户。 对于用户认证，本教程使用默认的 [SCRAM](https://www.mongodb.com/docs/manual/core/security-scram/) 认证机制。 质询-响应安全机制最适合测试或开发环境。 对于生产环境，我们建议使用 [x.509 certificates](https://www.mongodb.com/docs/manual/core/security-x.509/)或 [LDAP Proxy Authentication](https://www.mongodb.com/docs/manual/core/security-ldap/) （仅适用于 MongoDB Enterprise）或 [Kerberos Authentication](https://www.mongodb.com/docs/manual/core/kerberos/)（仅适用于 MongoDB Enterprise）。

有关为特定认证机制创建用户的详细信息，请参阅特定认证机制页面。

有关用户创建和管理的最佳实践，请参阅[➤ Configure Role-Based Access Control](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-security-checklist-role-based-access-control)。

**用户**

通常，要为分片集群创建用户，请连接到 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 并添加分片集群用户。

但是，一些维护操作需要直接连接到分片集群中的特定分片。 要执行这些操作，您必须直接连接到分片并以分片本地管理用户身份进行身份验证。

Shard-local 用户只存在于特定的分片中，并且应该只用于特定于分片的维护和配置。 您无法使用分片本地用户连接到[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)。

本教程需要创建分片集群用户，但包括添加分片本地用户的可选步骤。

有关详细信息，请参阅用户安全文档。

**操作系统**

本教程主要涉及 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 进程。 Windows 用户应该改用 exe 程序。

**使用密钥文件访问控制部署分片集群**

以下过程涉及创建一个新的分片集群，该集群由一个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)、配置服务器和两个分片组成。

>[IMPORTANT]重要
>为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。 在配置副本集成员或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。
>
>使用主机名而不是 IP 地址来配置跨分割网络水平的集群。 从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

**创建密钥文件**

通过密钥文件身份验证，分片集群中的每个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例都使用密钥文件的内容作为共享密码来对部署中的其他成员进行身份验证。 只有具有正确密钥文件的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例才能加入分片集群。

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

**分发密钥文件**

将密钥文件复制到托管分片集群成员的每个服务器。 确保运行 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例的用户是文件的所有者并且可以访问密钥文件。

避免将密钥文件存储在可以轻松与托管 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的硬件断开连接的存储介质上，例如 USB 驱动器或网络附加存储设备。

**创建配置服务器副本集**

以下步骤部署配置服务器副本集。

对于生产部署，部署一个至少包含三个成员的配置服务器副本集。 出于测试目的，您可以创建单成员副本集。

1. 启动配置服务器副本集中的每个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。 包括 `keyFile` 设置。` keyFile` 设置强制执行[Internal/Membership Authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)和[Role-Based Access Control](https://www.mongodb.com/docs/manual/core/authorization/)。

   您可以通过配置文件或命令行指定 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 设置。

   **配置文件**

   如果使用配置文件，请将 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 设置为密钥文件的路径，将 [`sharding.clusterRole`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-sharding.clusterRole) 设置为 `configsvr`，并将 [`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName) 设置为配置服务器副本集的所需名称。

   ```yaml
   security:
     keyFile: <path-to-keyfile>
   sharding:
     clusterRole: configsvr
   replication:
     replSetName: <setname>
   ```

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp) 设置。 有关详细信息，请参阅[Localhost Binding Compatibility Changes.](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

   使用配置文件启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

   ```shell
   mongod --config <path-to-config-file>
   ```

   **命令行**

   如果使用命令行参数，请使用 `--keyFile`、`--configsvr` 和 `--replSet` 参数启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

   ```shell
   mongod --keyFile <path-to-keyfile> --configsvr --replSet <setname> --dbpath <path>
   ```

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

2. **通过本地主机接口连接到副本集的成员**

   通过本地主机接口将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到其中一个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。 您必须在与 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例相同的物理机器上运行 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。

   [localhost interface](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)仅可用，因为尚未为部署创建用户。 [localhost interface](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)在创建第一个用户后关闭。

3. [`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate) 方法启动副本集并可以获取[replica set configuration document](https://www.mongodb.com/docs/manual/reference/replica-configuration/)。 在[replica set configuration document](https://www.mongodb.com/docs/manual/reference/replica-configuration/)中，包括：

   - [`_id`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf._id)。[`_id`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf._id) 必须匹配传递给 mongod 的 --replSet 参数。

   - [`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)段。[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)字段是一个数组，每个副本集成员都需要一个文档。

   - [`configsvr`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.configsvr) 字段。 配置服务器副本集的[`configsvr`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.configsvr) 字段必须设置为 true。

   有关副本集配置文档的更多信息，请参阅[Replica Set Configuration](https://www.mongodb.com/docs/manual/reference/replica-configuration/)。

   使用 [`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)方法和配置文档启动副本集：

   ```javascript
   rs.initiate(
     {
       _id: "myReplSet",
       configsvr: true,
       members: [
         { _id : 0, host : "cfg1.example.net:27019" },
         { _id : 1, host : "cfg2.example.net:27019" },
         { _id : 2, host : "cfg3.example.net:27019" }
       ]
     }
   )
   ```

   配置服务器副本集 (CSRS) 初始化并启动后，继续创建分片副本集。

**创建分片副本集**

对于生产部署，请使用至少包含三个成员的副本集。 出于测试目的，您可以创建单成员副本集。

这些步骤包括用于添加分片本地用户的可选过程。 现在执行它们可确保每个分片都有可用的用户来执行分片级维护。

1. **在启用访问控制的情况下启动副本集的每个成员**

   使用` keyFile` 参数运行 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 会强制执行[Internal/Membership Authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)和[Role-Based Access Control](https://www.mongodb.com/docs/manual/core/authorization/)。

   使用配置文件或命令行启动副本集中的每个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

   **配置文件**

   如果使用配置文件，请将 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 选项设置为密钥文件的路径，将 [`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName) 设置为所需的副本集名称，并将 [`sharding.clusterRole`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-sharding.clusterRole) 选项设置为 `shardsvr`。

   ```yaml
   security:
     keyFile: <path-to-keyfile>
   sharding:
     clusterRole: shardsvr
   replication:
     replSetName: <replSetName>
   storage:
      dbPath: <path>
   ```

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp) 设置。 有关详细信息，请参阅[Localhost Binding Compatibility Changes.](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

   使用配置文件启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

   ```shell
   mongod --config <path-to-config-file>
   ```

   **命令行**

   如果使用命令行参数，请使用 `--keyFile`、`--configsvr` 和 `--replSet` 参数启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

   ```shell
   mongod --keyFile <path-to-keyfile> --configsvr --replSet <setname> --dbpath <path>
   ```

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

2. **通过本地主机接口连接到副本集的成员**

   通过本地主机接口将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到其中一个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。 您必须在与 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例相同的物理机器上运行 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。

   [localhost interface](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)仅可用，因为尚未为部署创建用户。 [localhost interface](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)在创建第一个用户后关闭。

3. **启动副本集**

   从 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 运行 [`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate) 方法。

   [`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate) 可以带一个可选的[replica set configuration document](https://www.mongodb.com/docs/manual/reference/replica-configuration/)。 在[replica set configuration document](https://www.mongodb.com/docs/manual/reference/replica-configuration/)中，包括：

   - [`_id`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf._id)字段设置为在 [`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName) 或 `--replSet` 选项中指定的副本集名称。

   - [`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)数组，每个副本集成员都有一个文档。


   以下示例启动了一个三成员副本集。

   ```javascript
rs.initiate(
  {
    _id : "myReplSet",
    members: [
      { _id : 0, host : "s1-mongo1.example.net:27018" },
      { _id : 1, host : "s1-mongo2.example.net:27018" },
      { _id : 2, host : "s1-mongo3.example.net:27018" }
    ]
  }
)
   ```

   [`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate) 触发[election](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-election)并选出其中一个成员作为[primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)。

   在继续之前连接到主服务器。 使用[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status) 定位主要成员。

4. **创建分片本地用户管理员（可选）**

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

   出现提示时输入密码。 有关内置角色和与数据库管理操作相关的完整列表，请参阅[Database User Roles](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-database-user-roles)。

5. **作为分片本地用户管理员进行身份验证（可选）**

   向管理数据库进行身份验证。

   在 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 中，使用 [`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth) 进行身份验证。 例如，以下身份验证为用户管理员 fred：

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

6. **创建分片本地集群管理员（可选）**

   shard-local 集群管理员用户具有 clusterAdmin 角色，该角色提供允许访问复制操作的权限。

   有关与副本集操作相关的角色的完整列表，请参阅[Cluster Administration Roles](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-cluster-admin-roles)。

   创建集群管理员用户并在 `admin` 数据库中分配 [`clusterAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin) 角色：

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

**将 `mongos `连接到分片集群**

1. **将 [mongos](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)连接到集群**

   使用配置文件或命令行参数启动指定密钥文件的 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)。

   **配置文件**

   如果使用配置文件，请将 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 设置为密钥文件的路径，并将 [`sharding.configDB`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-sharding.configDB) 设置为副本集名称，并且副本集的至少一个成员采用 `<replSetName>/<host:port`> 格式。

   ```yaml
   security:
     keyFile: <path-to-keyfile>
   sharding:
     configDB: <configReplSetName>/cfg1.example.net:27019,cfg2.example.net:27019,...
   ```

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp) 设置。 有关详细信息，请参阅[Localhost Binding Compatibility Changes.](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

   使用配置文件启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

   ```shell
   mongod --config <path-to-config-file>
   ```

   **命令行**

   如果使用命令行参数，请使用 `--keyFile`、`--configsvr` 和 `--replSet` 参数启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

   ```shell
   mongod --keyFile <path-to-keyfile> --configsvr --replSet <setname> --dbpath <path>
   ```

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

2. **通过本地主机接口连接到副本集的成员**

   通过本地主机接口将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到其中一个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。 您必须在与 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例相同的物理机器上运行 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。

   [localhost interface](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)仅可用，因为尚未为部署创建用户。 [localhost interface](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)在创建第一个用户后关闭。

3. **创建用户管理员**

   >[IMPORTANT]重要
   >
   >创建第一个用户后， [localhost exception](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)将不再可用。
   >
   >第一个用户必须具有创建其他用户的权限，例如具有  [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase) 的用户。 这确保您可以在 [Localhost Exception](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception) 关闭后创建其他用户。
   >
   >如果至少有一个用户没有创建用户的权限，一旦 localhost 异常关闭，您可能无法创建或修改具有新权限的用户，因此无法访问必要的操作。

   使用 [`db.createUser()`](https://www.mongodb.com/docs/manual/reference/method/db.createUser/#mongodb-method-db.createUser) 方法添加用户。 用户至少应具有 admin 数据库的 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase) 角色。

   >[IMPORTANT]重要
   >
   >密码应随机、较长且复杂，以确保系统安全并防止或延迟恶意访问。

   以下示例在 admin 数据库上创建用户` fred`。

   >[TIP]提示
   >
   >从 `mongo` shell 版本 4.2 开始，您可以使用 [`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt) 方法结合各种用户身份验证/管理方法/命令来提示输入密码，而不是直接在方法/命令调用中指定密码。 但是，您仍然可以像使用早期版本的 `mongo` shell 一样直接指定密码。

   ```javascript
   admin = db.getSiblingDB("admin")
   admin.createUser(
     {
       user: "fred",
       pwd:  passwordPrompt(),     // or cleartext password
       roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
     }
   )
   ```

   有关内置角色和与数据库管理操作相关的完整列表，请参阅[Database User Roles](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-database-user-roles)。

4. **以用户管理员身份进行身份验证**

   使用 [`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth) 以用户管理员身份进行身份验证以创建其他用户：

   >[TIP]提示
   >
   >从 `mongo` shell 版本 4.2 开始，您可以使用 [`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt) 方法结合各种用户身份验证/管理方法/命令来提示输入密码，而不是直接在方法/命令调用中指定密码。 但是，您仍然可以像使用早期版本的 `mongo` shell 一样直接指定密码。

   ```javascript
   db.getSiblingDB("admin").auth("fred", passwordPrompt()) // or cleartext password
   ```

   出现提示时输入密码。

   或者，使用 `-u <username>`、`-p <password>` 和 `--authenticationDatabase` 参数将新的 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 实例连接到主副本集成员。

   ```shell
   mongosh -u "fred" -p  --authenticationDatabase "admin"
   ```

   如果您没有为 [`-p`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password) 命令行选项指定密码，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 会提示输入密码。

5. **为集群管理创建管理用户**

   集群管理员用户具有 [`clusterAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin) 角色，该角色授予对复制和分片操作的访问权限。

   在 `admin` 数据库中创建一个 [`clusterAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin) 用户。

   以下示例在 `admin` 数据库上创建用户 `ravi`。

   >[IMPORTANT]重要
   >
   >密码应随机、较长且复杂，以确保系统安全并防止或延迟恶意访问。

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

   有关内置角色和与数据库管理操作相关的完整列表，请参阅  [Cluster Administration Roles](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-cluster-admin-roles)。

6. **创建其他用户（可选）**

   创建用户以允许客户端连接和访问分片集群。 有关可用的内置角色，例如[`read`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-read)和[`readWrite`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWrite)，请参阅[Database User Roles](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-database-user-roles)。 您可能还需要其他管理用户。 有关用户的更多信息，请参阅[Users](https://www.mongodb.com/docs/manual/core/security-users/)。

   要创建其他用户，您必须以具有 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase) 或 [`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin) 角色的用户身份进行身份验证。

**将分片添加到集群**

要继续，您必须连接到 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 并作为分片集群的集群管理员用户进行身份验证。

>[NOTE]注意
>
>这是分片集群的集群管理员，而不是分片本地集群管理员。

要将每个分片添加到集群，请使用 sh.addShard() 方法。 如果分片是副本集，则指定副本集的名称并指定副本集的成员。 在生产部署中，所有分片都应该是副本集。

以下操作将单个分片副本集添加到集群：

```shell
sh.addShard( "<replSetName>/s1-mongo1.example.net:27017")
```

以下操作是将独立 mongod 分片添加到集群的示例：

```shell
sh.addShard( "s1-mongo1.example.net:27017")
```

重复这些步骤，直到集群包含所有分片。 此时，分片集群对集群以及每个分片集群组件之间的内部通信实施访问控制。

**分片集合**

要继续，您必须连接到 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 并作为分片集群的集群管理员用户进行身份验证。

>[NOTE]注意
>
>这是分片集群的集群管理员，而不是分片本地集群管理员。

要对集合进行分片，请使用 [`sh.shardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection) 方法。 您必须指定集合的完整命名空间和包含分片键的文档。

您对分片键的选择会影响分片的效率，以及您利用某些分片功能（例如区域）的能力。 请参阅[Choose a Shard Key](https://www.mongodb.com/docs/manual/core/sharding-choose-a-shard-key/#std-label-sharding-shard-key-selection)列出的选择注意事项。

如果集合已经包含数据，则必须在使用 [`shardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection) 之前使用 [`db.collection.createIndex()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) 方法在[shard key](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)上创建索引。

如果集合为空，MongoDB 将创建索引作为 [`sh.shardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection) 的一部分。

以下是 [`sh.shardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection) 方法的示例：

```shell
sh.shardCollection("<database>.<collection>", { <key> : <direction> } )
```

**下一步**

创建用户以允许客户端连接到分片集群并与之交互。

有关用于创建只读和读写用户的基本内置角色，请参阅[Database User Roles](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-database-user-roles)。

**x.509 内部认证**

有关使用 x.509 进行内部身份验证的详细信息，请参阅[Use x.509 Certificate for Membership Authentication](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/)。

要从密钥文件内部身份验证升级到 x.509 内部身份验证，请参阅[Upgrade from Keyfile Authentication to x.509 Authentication](https://www.mongodb.com/docs/manual/tutorial/upgrade-keyfile-to-x509/)。

 参见

原文 - [Rotate Keys for Replica Sets]( https://docs.mongodb.com/manual/tutorial/rotate-key-replica-set/ )

译者：景圣