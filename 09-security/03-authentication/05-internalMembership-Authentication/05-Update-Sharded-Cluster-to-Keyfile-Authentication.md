 **将分片集群更新为密钥文件身份验证**

**概述**

在[sharded cluster](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)上实施访问控制需要配置：

- 使用[Internal Authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)的集群组件之间的安全性。


- 使用[Role-Based Access Control](https://www.mongodb.com/docs/manual/core/authorization/)连接客户端和集群之间的安全性。


对于本教程，分片集群的每个成员都必须使用相同的内部身份验证机制和设置。 这意味着对集群中的每个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 和 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 强制执行内部身份验证。

以下教程使用密钥文件启用内部身份验证。

强制执行内部身份验证还会强制执行用户访问控制。 要连接到副本集，像  [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 这样的客户端
需要使用[user account](https://www.mongodb.com/docs/manual/core/authorization/)。 请参阅[Access Control](https://www.mongodb.com/docs/manual/tutorial/enforce-keyfile-access-control-in-existing-sharded-cluster/#std-label-security-shardClust-enforce-access-control)。

**云管理器和操作管理器**

如果 云管理器 或 操作管理器 正在管理您的部署，则会自动执行内部身份验证。

要在托管部署上配置访问控制，请参阅：`Configure Access Control for MongoDB Deployments` 在
[Cloud Manager manual](https://www.mongodb.com/docs/cloud-manager/tutorial/edit-host-authentication-credentials/)或 [Ops Manager manual](https://www.mongodb.com/docs/ops-manager/current/tutorial/edit-host-authentication-credentials/)。

**注意事项**

>[IMPORTANT]重要
>为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。 在配置副本集成员或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。
>
>使用主机名而不是 IP 地址来配置跨分割网络水平的集群。 从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

**IP绑定**

在 3.6 版中更改。

从 MongoDB 3.6 开始，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到 localhost。

**操作系统**

本教程主要涉及 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 进程。 Windows 用户应该改用 exe 程序。

**密钥文件安全**

密钥文件是最低限度的安全形式，最适合测试或开发环境。 对于生产环境，我们建议使用[x.509 certificates](https://www.mongodb.com/docs/manual/core/security-x.509/)。

**访问控制**

本教程仅涵盖在 `admin` 数据库上创建最少数量的管理用户。 对于用户认证，本教程使用默认的 [SCRAM](https://www.mongodb.com/docs/manual/core/security-scram/) 认证机制。 质询-响应安全机制最适合测试或开发环境。 对于生产环境，我们建议使用 [x.509 certificates](https://www.mongodb.com/docs/manual/core/security-x.509/)或 [LDAP Proxy Authentication](https://www.mongodb.com/docs/manual/core/security-ldap/) （仅适用于 MongoDB Enterprise）或 [Kerberos Authentication](https://www.mongodb.com/docs/manual/core/kerberos/)（仅适用于 MongoDB Enterprise）。

有关为特定认证机制创建用户的详细信息，请参阅特定认证机制页面。

有关用户创建和管理的最佳实践，请参阅[➤ Configure Role-Based Access Control](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-security-checklist-role-based-access-control)。

**用户**

通常，要为分片集群创建用户，请连接到 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 并添加分片集群用户。

但是，一些维护操作需要直接连接到分片集群中的特定分片。 要执行这些操作，您必须直接连接到分片并以分片本地管理用户身份进行身份验证。

Shard-local 用户只存在于特定的分片中，并且应该只用于特定于分片的维护和配置。 您无法使用分片本地用户连接到 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)。

**停机时间**

升级分片集群以实施访问控制需要停机。

有关详细信息，请参阅[Users](https://www.mongodb.com/docs/manual/core/security-users/)安全文档。

**步骤**

**对现有分片集群部署实施密钥文件内部身份验证**

1. **创建密钥文件**

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

   有关使用[Keyfiles](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#std-label-internal-auth-keyfile)的其他详细信息和要求，请参阅密钥文件。

2. **将密钥文件复制到分片集群中的每个组件**

   每个托管分片集群的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 组件的服务器都必须包含密钥文件的副本。

   将密钥文件复制到托管分片集群成员的每个服务器。 确保运行 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的用户是文件的所有者并且可以访问密钥文件。

   避免将密钥文件存储在可以轻松与托管 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的硬件断开连接的存储介质上，例如 USB 驱动器或网络附加存储设备。

3. **禁用平衡器**

   将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)。

   ```shell
   sh.stopBalancer()
   ```

   如果正在进行迁移，平衡器可能不会立即停止。 [`sh.stopBalancer()`](https://www.mongodb.com/docs/manual/reference/method/sh.stopBalancer/#mongodb-method-sh.stopBalancer) 方法会阻塞 shell，直到平衡器停止。

   从 MongoDB 6.0 开始，不执行自动分块。 这是因为平衡政策的改进。 自动拆分命令仍然存在，但不执行操作。 有关详细信息，请参阅[Balancing Policy Changes](https://www.mongodb.com/docs/manual/release-notes/6.0/#std-label-release-notes-6.0-balancing-policy-changes)。

   在 MongoDB 6.0 之前的版本中， [`sh.stopBalancer()`](https://www.mongodb.com/docs/manual/reference/method/sh.stopBalancer/#mongodb-method-sh.stopBalancer) 还会禁用分片集群的自动拆分。

   使用 [`sh.getBalancerState()`](https://www.mongodb.com/docs/manual/reference/method/sh.getBalancerState/#mongodb-method-sh.getBalancerState) 验证平衡器是否已停止。

   ```shell
   sh.getBalancerState()
   ```

   >[IMPORTANT]重要
   >
   >在平衡器停止运行之前不要继续。

   有关配置分片集群平衡器行为的教程，请参阅[Manage Sharded Cluster Balancer](https://www.mongodb.com/docs/manual/tutorial/manage-sharded-cluster-balancer/) 。

4. **关闭分片集群的所有 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例**

   将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到每个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 并关闭它们。

   在 `admin` 数据库上使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法安全地关闭 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)：

   ```shell
   db.getSiblingDB("admin").shutdownServer()
   ```

   重复直到集群中的所有 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例都处于离线状态。

   完成此步骤后，集群中的所有 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例都应该处于离线状态。

5. **关闭配置服务器 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例**

   将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到配置服务器部署中的每个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 并关闭它们。

   对于副本集配置服务器部署，最后关闭主要成员。

   在 `admin` 数据库上使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer)方法安全地关闭 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

   ```shell
   db.getSiblingDB("admin").shutdownServer()
   ```

   重复直到所有配置服务器都离线。

6. **关闭分片副本集 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例**

   对于每个分片副本集，将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到副本集中的每个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 成员并关闭它们。 最后关闭主要成员。

   在 `admin` 数据库上使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法安全地关闭 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

   ```shell
   db.getSiblingDB("admin").shutdownServer()
   ```

   对每个分片副本集重复此步骤，直到所有分片副本集中的所有 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例都处于离线状态。

   完成此步骤后，整个分片集群应该处于离线状态。

7. **在配置服务器上实施访问控制**

   启动配置服务器副本集中的每个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。 包括 `keyFile` 设置。 `keyFile` 设置强制执行[Internal/Membership Authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)和[Role-Based Access Control](https://www.mongodb.com/docs/manual/core/authorization/)。

   您可以通过配置文件或命令行指定 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 设置。

   **配置文件**

   如果使用配置文件，请将 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 选项设置为密钥文件的路径，将 [`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName) 设置为所需的副本集名称，并将 [`sharding.clusterRole`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-sharding.clusterRole) 选项设置为 `configsvr`。

   ```yaml
   security:
     keyFile: <path-to-keyfile>
   sharding:
     clusterRole: configsvr
   replication:
     replSetName: <setname>
   storage:
      dbpath: <path>
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

   有关命令行选项的更多信息，请参阅 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 参考页。

   确保在重新启动每个成员时使用原始副本集名称。 您不能更改副本集的名称。

8. **对分片集群中的每个分片实施访问控制**

   使用 `keyFile `参数运行 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 会强制执行[Internal/Membership Authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)和[Role-Based Access Control](https://www.mongodb.com/docs/manual/core/authorization/)。

   使用配置文件或命令行启动副本集中的每个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

   **配置文件**

   如果使用配置文件，请将 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 选项设置为密钥文件的路径，将 [`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName) 设置为所需的副本集名称，并将 [`sharding.clusterRole`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-sharding.clusterRole) 选项设置为 `configsvr`。

   ```yaml
   security:
     keyFile: <path-to-keyfile>
   replication:
     replSetName: <setname>
   storage:
      dbPath: <path>
   ```

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp) 设置。 有关详细信息，请参阅[Localhost Binding Compatibility Changes.](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

   使用配置文件启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

   ```shell
   mongod --config <path-to-config-file>
   ```

   **命令行**

   如果使用命令行参数，请使用 `--keyFile` 和 `--replSet` 参数启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

   ```shell
   mongod --keyfile <path-to-keyfile> --replSet <setname> --dbpath <path>
   ```

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

   有关命令行选项的更多信息，请参阅 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 参考页。

   确保在重新启动每个成员时使用原始副本集名称。 您不能更改副本集的名称。

   重复此步骤，直到集群中的所有分片都在线。

9. **创建分片本地用户管理员（可选）**

   >[IMPORTANT]重要
   >
   >[Localhost Exception](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)允许通过 localhost 接口连接的客户端在 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 强制访问控制上创建用户。 创建第一个用户后，[Localhost Exception](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception) 关闭。
   >
   >第一个用户必须具有创建其他用户的权限，例如具有 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase) 的用户。 这确保您可以在[Localhost Exception](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception) 关闭后创建其他用户。
   >
   >如果至少有一个用户没有创建用户的权限，一旦 [Localhost Exception](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)关闭，您可能无法创建或修改具有新权限的用户，因此无法访问某些功能或操作。

   对于集群中的每个分片副本集，连接 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)通过[localhost interface](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)到主要成员。 您必须在与目标 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 相同的机器上运行 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 才能使用 localhost 接口。

   在 `admin` 数据库上创建一个具有 `userAdminAnyDatabase` 角色的用户。 该用户可以根据需要为分片副本集创建其他用户。 创建此用户还会关闭 [Localhost Exception](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)。

   以下示例在 `admin` 数据库上创建分片本地用户 `fred`。

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
       pwd: passwordPrompt(),  // or cleartext password
       roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
     }
   )
   ```

10. **对  [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)  服务器实施访问控制**

    使用 `keyFile` 参数运行 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 会强制执行[Internal/Membership Authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)和[Role-Based Access Control](https://www.mongodb.com/docs/manual/core/authorization/)。

    使用配置文件或命令行启动副本集中的每个  [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 。

    **配置文件**

    如果使用配置文件，请将 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 设置为密钥文件的路径，并将 [`sharding.configDB`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-sharding.configDB) 设置为副本集名称，并且副本集的至少一个成员采用 `<replSetName>/<host:port`> 格式。

    ```yaml
    security:
      keyFile: <path-to-keyfile>
    sharding:
      configDB: <configReplSetName>/cfg1.example.net:27019,cfg2.example.net:27019,...
    ```

    根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp) 设置。 有关详细信息，请参阅[Localhost Binding Compatibility Changes.](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

    使用配置文件启动[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)：

    ```shell
    mongos --config <path-to-config-file>
    ```

    **命令行**

    如果使用命令行参数，请使用 `--keyFile`和`--configdb` 参数启动[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)。

    ```shell
    mongos --keyFile <path-to-keyfile> --configdb <configReplSetName>/cfg1.example.net:27019,cfg2.example.net:27019,...
    ```

    根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 `--bind_ip`。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

    此时，整个分片集群重新上线，可以使用指定的密钥文件进行内部通信。 但是，像 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 这样的外部程序需要使用正确配置的用户才能读取或写入集群。

11. **通过本地主机接口连接到 mongos 实例**

    通过本地主机接口将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到其中一个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例。 您必须在与 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例相同的物理机器上运行 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。

    [localhost interface](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)仅可用，因为尚未为部署创建用户。 [localhost interface](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)在创建第一个用户后关闭。

12. **创建用户管理员**

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

13. **以用户管理员身份进行身份验证**

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

14. **为集群管理创建管理用户**

    集群管理员用户具有分片集群的 [`clusterAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin)角色，而不是分片本地集群管理员。

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

15. **以集群管理员身份进行身份验证**

    要执行分片操作，请使用 [`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth) 方法或新的方法作为 [`clusterAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin) 用户进行身份验证
    带有用户名、密码和 `authenticationDatabase` 参数的 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 会话。

    >[NOTE]注意
    >
    >这是分片集群的集群管理员，而不是分片本地集群管理员。

16. **启动平衡器**

    启动平衡器。

    ```shell
    sh.startBalancer()
    ```

    从 MongoDB 6.0 开始，不执行自动分块。 这是因为平衡政策的改进。 自动拆分命令仍然存在，但不执行操作。 有关详细信息，请参阅[Balancing Policy Changes](https://www.mongodb.com/docs/manual/release-notes/6.0/#std-label-release-notes-6.0-balancing-policy-changes)。

    在 MongoDB 6.0 之前的版本中， [`sh.startBalancer()`](https://www.mongodb.com/docs/manual/reference/method/sh.startBalancer/#mongodb-method-sh.startBalancer) 还可以为分片集群启用自动拆分。

    使用 [`sh.getBalancerState()`](https://www.mongodb.com/docs/manual/reference/method/sh.getBalancerState/#mongodb-method-sh.getBalancerState) 验证平衡器是否已启动。

    有关分片集群平衡器的教程，请参阅[Manage Sharded Cluster Balancer](https://www.mongodb.com/docs/manual/tutorial/manage-sharded-cluster-balancer/)。

17. **创建其他用户（可选）**

    创建用户以允许客户端连接和访问分片集群。 有关可用的内置角色，例如[`read`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-read)和[`readWrite`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWrite)，请参阅[Database User Roles](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-database-user-roles)。 您可能还需要其他管理用户。 有关用户的更多信息，请参阅[Users](https://www.mongodb.com/docs/manual/core/security-users/)。

    要创建其他用户，您必须以具有 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase) 或 [`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin) 角色的用户身份进行身份验证。

**x.509 内部认证**

有关使用 x.509 进行内部身份验证的详细信息，请参阅[Use x.509 Certificate for Membership Authentication](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/)。

要从密钥文件内部身份验证升级到 x.509 内部身份验证，请参阅[Upgrade from Keyfile Authentication to x.509 Authentication](https://www.mongodb.com/docs/manual/tutorial/upgrade-keyfile-to-x509/)。

>[TIP]提示
>
>也可以看看：
>
>- [Sharded Cluster Components](https://www.mongodb.com/docs/manual/core/sharded-cluster-components/)
>- [Operational Restrictions in Sharded Clusters](https://www.mongodb.com/docs/manual/core/sharded-cluster-requirements/)

 参见

原文 - [Update Sharded Cluster to Keyfile Authentication](https://www.mongodb.com/docs/manual/tutorial/enforce-keyfile-access-control-in-existing-sharded-cluster/ )

译者：景圣