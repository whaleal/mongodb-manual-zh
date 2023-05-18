**将副本集更新为密钥文件身份验证（无停机时间）**

**概述**

为防止未经授权的访问，请对您的部署实施身份验证。 副本集的认证包括副本集成员之间的[internal authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#std-label-inter-process-auth)，以及连接到副本集的客户端的[user access control](https://www.mongodb.com/docs/manual/core/authorization/#std-label-authorization)。

如果您的部署不强制执行身份验证，MongoDB 3.4+ 提供[`--transitionToAuth`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--transitionToAuth)选项以执行无停机升级以强制执行身份验证。

本教程使用 [keyfile](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#std-label-internal-auth-keyfile)内部身份验证机制实现内部安全，并使用基于 [SCRAM](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram) 的[role-based access controls](https://www.mongodb.com/docs/manual/core/authorization/#std-label-authorization)来实现客户端连接。

**云管理器和操作管理器**

如果您当前正在使用或计划使用 Cloud Manager 或 Ops Manager，请参阅 [Cloud Manager manual](https://www.mongodb.com/docs/cloud-manager/tutorial/edit-host-authentication-credentials/)或 [
Ops Manager manual](https://www.mongodb.com/docs/ops-manager/current/tutorial/edit-host-authentication-credentials/)以实施访问控制。

**架构**
本教程假设您的副本集可以在退出现有主副本集成员后选择一个新的[primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)。 这需要：

- 大多数投票副本集成员在退出[primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)后可用。


- 至少一个[delayed](https://www.mongodb.com/docs/manual/core/replica-set-delayed-member/#std-label-replica-set-delayed-members)、[hidden](https://www.mongodb.com/docs/manual/core/replica-set-hidden-member/#std-label-replica-set-hidden-members)或[Priority 0](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/#std-label-replica-set-secondary-only-members) 的次要成员。

**过渡状态**
使用 [`--transitionToAuth`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--transitionToAuth) 运行的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 接受经过身份验证和未经身份验证的连接。 在此过渡状态期间连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 的客户端可以对任何数据库执行读取、写入和管理操作。

**客户端访问**
在以下过程结束时，副本集拒绝任何尝试建立未经身份验证的连接的客户端。 该过程为客户端应用程序创建[users](https://www.mongodb.com/docs/manual/core/security-users/#std-label-users)以在连接到副本集时使用。

有关用户创建和管理的最佳实践，请参阅[➤ Configure Role-Based Access Control](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-security-checklist-role-based-access-control)。

**IP绑定**

在 3.6 版中更改。

从 MongoDB 3.6 开始，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到 localhost。 如果部署的成员在不同的主机上运行，或者如果您希望远程客户端连接到您的部署，则必须指定 `--bind_ip` 或 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

**密码**

>[IMPORTANT]重要
>
>密码应随机、较长且复杂，以确保系统安全并防止或延迟恶意访问。

**对现有副本集实施密钥文件访问控制**

>[IMPORTANT]重要
>为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。 在配置副本集成员或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。
>
>使用主机名而不是 IP 地址来配置跨分割网络水平的集群。 从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

1. **创建用户管理员**

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
       pwd: " passwordPrompt(),     // or cleartext password
       roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
     }
   )
   ```

   完成此过程后，管理副本集中用户的任何客户端都必须验证为该用户或具有类似权限的用户。

   有关内置角色和与数据库管理操作相关的完整列表，请参阅[Database User Roles](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-database-user-roles)。

2. **创建集群用户**

   连接到主节点以创建具有 [`clusterAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin) 角色的用户。 [`clusterAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin) 角色授予对复制操作的访问权限，例如配置副本集。

   创建集群管理员用户并在 `admin` 数据库中分配 [`clusterAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin) 角色：

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
       "pwd" :  passwordPrompt(),     // or cleartext password
       roles: [ { "role" : "clusterAdmin", "db" : "admin" } ] 
     }
   )
   ```

   完成此过程后，任何管理或维护副本集的客户端都必须作为该用户或具有类似权限的用户进行身份验证。

   有关与副本集操作相关的内置角色的完整列表，请参阅[Cluster Administration Roles](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-cluster-admin-roles)。

3. **为客户端应用程序创建用户**
   创建用户以允许客户端应用程序连接副本集并与之交互。 完成本教程后，客户端必须作为配置用户进行身份验证才能连接到副本集。

   有关用于创建只读和读写用户的基本内置角色，请参阅[Database User Roles](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-database-user-roles)。

   下面创建一个对 `foo` 数据库具有读写权限的用户。

   >[IMPORTANT]重要
   >
   >密码应随机、较长且复杂，以确保系统安全并防止或延迟恶意访问。

   在 `foo` 数据库中创建一个具有[`readWrite`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWrite)角色的用户。

   >[TIP]提示
   >
   >从 `mongo` shell 版本 4.2 开始，您可以使用 [`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt) 方法结合各种用户身份验证/管理方法/命令来提示输入密码，而不是直接在方法/命令调用中指定密码。 但是，您仍然可以像使用早期版本的 `mongo` shell 一样直接指定密码。

   ```shell
   db.getSiblingDB("foo").createUser(
     {
       "user" : "joe",
       "pwd" :  passwordPrompt(),     // or cleartext password
       roles: [ { "role" : "readWrite", "db" : "foo" } ] 
     }
   )
   ```

   作为此用户进行身份验证的客户端可以对 foo 数据库执行读取和写入操作。 有关创建到副本集的经过身份验证的连接的更多信息，请参阅[Authenticate a User](https://www.mongodb.com/docs/manual/tutorial/authenticate-a-user/#std-label-authentication-auth-as-user)。

   有关添加用户的更多信息，请参阅 [Add Users](https://www.mongodb.com/docs/manual/tutorial/create-users/#std-label-add-new-user)。 添加新用户时考虑 [security best practices](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-security-checklist-role-based-access-control)。

4. **更新客户端应用程序**
   在该过程的这一点上，副本集不强制执行身份验证。 但是，客户端应用程序仍然可以指定身份验证凭证并连接到副本集。

   更新客户端应用程序以使用配置的用户对副本集进行身份验证。 经过身份验证的连接需要用户名、密码和身份验证数据库。 请参阅[Authenticate a User](https://www.mongodb.com/docs/manual/tutorial/authenticate-a-user/#std-label-authentication-auth-as-user)。

   例如，以下连接到名为 `mongoRepl` 的副本集并以用户` joe` 身份进行身份验证。

   ```shell
   mongosh  -u joe -password  -authenticationDatabase foo --host mongoRepl/mongo1.example.net:27017, mongo2.example.net:27017, mongo3.example.net:27017
   ```

   如果您没有为 [`-p`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password) 命令行选项指定密码，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 会提示输入密码。

   如果您的应用程序使用 MongoDB 驱动程序，请参阅相关的
   有关创建经过身份验证的连接的说明[driver](https://www.mongodb.com/docs/drivers/)文档。

   完成本教程后，副本集会拒绝未经身份验证的客户端连接。 现在执行此步骤可确保客户端可以在转换前后连接到副本集。

5. **创建密钥文件**

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

6. **将密钥文件复制到每个副本集成员**

   将密钥文件复制到托管副本集成员的每个服务器。 确保运行 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例的用户是文件的所有者并且可以访问密钥文件。

   避免将密钥文件存储在可以轻松与托管 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例的硬件断开连接的存储介质上，例如 USB 驱动器或网络附加存储设备。

7. **使用 `transitionToAuth` 重新启动副本集的每个辅助或仲裁成员**

   重启副本集中的每个[secondary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)或[arbiter](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-arbiter)成员，包括在配置中：

   - [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 设置。 将 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 设置为 true 启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 会将实例置于过渡状态，在该状态下它可以接受和创建经过身份验证和未经过身份验证的连接。

   - 一种内部身份验证机制，例如 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile)。


   您必须一次重新启动每个成员，以确保副本集中的大多数成员保持在线。

   **关闭辅助或仲裁成员**

   从连接到辅助服务器或仲裁服务器的 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 会话，对管理数据库发出 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer)。

   ```javascript
admin = db.getSiblingDB("admin")
admin.shutdownServer()
   ```

   **使用 `transitionToAuth` 重新启动次要或仲裁成员**

   在[configuration file](https://www.mongodb.com/docs/manual/administration/configuration/#std-label-configuration-file)中指定以下设置。

   - [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile)，带有密钥文件的路径。

   - [`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName) 为原始副本集名称。

   - [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 为真。

   从 MongoDB 3.6 开始，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到 localhost。 如果部署的成员在不同的主机上运行，或者如果您希望远程客户端连接到您的部署，则必须指定 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp) 设置。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

   ```yaml
security:
  keyFile: <path-to-keyfile>
  transitionToAuth: true
replication:
  replSetName: <replicaSetName>
   ```

   在启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 时指定 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config) 选项和配置文件的路径。

   ```shell
mongod --config <path-to-config-file>
   ```

   有关配置文件的更多信息，请参阅[configuration options](https://www.mongodb.com/docs/manual/reference/configuration-options/)。

   或者，您可以在启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 时使用等效的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 命令行选项（例如 [`--transitionToAuth`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--transitionToAuth) 和 [`--keyFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--keyFile)）。 有关选项的完整列表，请参阅 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 参考页面。

   包括适合您的部署的其他设置。

   在此步骤结束时，所有辅助节点和仲裁节点都应该启动并运行，并且 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 设置为 `true`。

8. **退出副本集的主要成员并使用 `--transitionToAuth` 重新启动它**

   退出副本集中的主要成员并重新启动该成员，包括在其配置中：

   - [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 设置。 将 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 设置为 true 启动 mongod 会将实例置于过渡状态，在该状态下它可以接受和创建经过身份验证和未经过身份验证的连接。

   - 一种内部身份验证机制，例如 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile)。


   **降级主副本集成员**

   使用 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到主节点并使用 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown) 方法降低主节点。

   ```shell
rs.stepDown()
   ```

   **关闭旧的主节点**

   一旦主节点退出并且副本集选择了一个新的主节点，关闭旧的主节点 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

   从连接到旧主数据库的 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 会话，在 `admin` 数据库上发出 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer)。

   ```shell
admin = db.getSiblingDB("admin")
admin.shutdownServer()
   ```

   **使用 `transitionToAuth` 重启旧的主节点**

   在[configuration file](https://www.mongodb.com/docs/manual/administration/configuration/#std-label-configuration-file)中指定以下设置。

   - [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile)，带有密钥文件的路径。

   - [`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName) 为原始副本集名称。

   - [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 为真。

   从 MongoDB 3.6 开始，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到 localhost。 如果部署的成员在不同的主机上运行，或者如果您希望远程客户端连接到您的部署，则必须指定 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp) 设置。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

   ```yaml
security:
  keyFile: <path-to-keyfile>
  transitionToAuth: true
replication:
  replSetName: <replicaSetName>
   ```

   在启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 时指定 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config) 选项和配置文件的路径。

   ```shell
mongod --config <path-to-config-file>
   ```

   有关配置文件的更多信息，请参阅[configuration options](https://www.mongodb.com/docs/manual/reference/configuration-options/)。

   或者，您可以在启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 时使用等效的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 命令行选项（例如 [`--transitionToAuth`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--transitionToAuth) 和 [`--keyFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--keyFile)）。 有关选项的完整列表，请参阅 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 参考页面。

   包括适合您的部署的其他设置。

   在此步骤结束时，所有辅助节点和仲裁节点都应该启动并运行，并且 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 设置为 `true`。

9. **在没有 `--transitionToAuth` 的情况下重启辅助节点和仲裁节点**

   重新启动副本集中的每个[secondary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)或[arbiter](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-arbiter)成员，在重新启动时删除 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 选项。 您必须一次执行此操作以确保副本集中的大多数成员保持在线。

   如果大多数副本集成员同时离线，则副本集可能会进入只读模式。

   **关闭旧的主节点**

   一旦主节点退出并且副本集选择了一个新的主节点，关闭旧的主节点 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

   从连接到旧主数据库的 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 会话，在 `admin` 数据库上发出 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer)。

   ```shell
   admin = db.getSiblingDB("admin")
   admin.shutdownServer()
   ```

   **不使用 `transitionToAuth` 重启旧的主节点**

   重新启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，这次没有 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 选项，但有内部身份验证机制，如 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile)。

   在配置文件中指定以下设置。

   - [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile)，带有密钥文件的路径。

   - [`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName) 为原始副本集名称。

   根据您的配置需要包括其他选项。 例如，如果您希望远程客户端连接到您的部署或您的部署成员在不同的主机上运行，请指定 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp) 设置。 有关详细信息，请参阅[Localhost Binding Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

   ```yaml
   security:
     keyFile: <path-to-keyfile>
   replication:
     replSetName: <replicaSetName>
   ```

   在启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 时指定 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config) 选项和配置文件的路径。

   ```shell
   mongod --config <path-to-config-file>
   ```

   有关配置文件的更多信息，请参阅[configuration options](https://www.mongodb.com/docs/manual/reference/configuration-options/)。

   或者，您可以在启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 时使用等效的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 命令行选项（例如 [`--transitionToAuth`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--transitionToAuth) 和 [`--keyFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--keyFile)）。 有关选项的完整列表，请参阅 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 参考页面。

   包括适合您的部署的其他设置。

   在此步骤结束时，所有辅助节点和仲裁节点都应该启动并运行，并配置了内部身份验证，但没有 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth)。 客户端只能使用配置的客户端身份验证机制连接到这些 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。

10. **在没有 `--transitionToAuth` 的情况下下台并重新启动主副本集成员**

    退出副本集中的主要成员，然后在没有 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 选项的情况下重新启动它。

    >[IMPORTANT]重要
    >
    >在此步骤结束时，未使用 auth 连接的客户端将无法连接到副本集。 在完成此步骤之前更新客户端以使用身份验证连接以避免连接丢失。

    **降级主副本集成员**

    使用 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到主节点并使用 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown) 方法降低主节点。

    ```shell
    rs.stepDown()
    ```

    **关闭旧的主节点**

    一旦主节点退出并且副本集选择了一个新的主节点，关闭旧的主节点 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

    从连接到旧主数据库的 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 会话，在 `admin` 数据库上发出 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer)。

    ```shell
    admin = db.getSiblingDB("admin")
    admin.shutdownServer()
    ```

    **不使用 `transitionToAuth` 重启旧的主节点**

    重新启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，这次没有 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 选项，但有内部身份验证机制，如  [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile)。

    在[configuration file](https://www.mongodb.com/docs/manual/administration/configuration/#std-label-configuration-file)中指定以下设置。

    -  [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile)，带有密钥文件的路径。


    - [`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName) 为原始副本集名称。
    
    ```yaml
    security:
      keyFile: <path-to-keyfile>
    replication:
      replSetName: <replicaSetName>
    ```
    
    在启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 时指定 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config) 选项和配置文件的路径。
    
    ```shell
    mongod --config <path-to-config-file>
    ```
    
    有关配置文件的更多信息，请参阅[configuration options](https://www.mongodb.com/docs/manual/reference/configuration-options/)。
    
    您还可以在启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 时使用等效的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 选项。 有关选项的完整列表，请参阅 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 参考页面。
    
    包括适合您的部署的其他设置。
    
    在此步骤结束时，副本集的所有成员都应该启动并运行并强制执行身份验证。 客户端只能使用配置的客户端身份验证机制连接到这些 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。

**x.509 内部认证**

有关使用 x.509 进行内部身份验证的详细信息，请参阅[Use x.509 Certificate for Membership Authentication](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/)。

要从密钥文件内部身份验证升级到 x.509 内部身份验证，请参阅[Upgrade from Keyfile Authentication to x.509 Authentication](https://www.mongodb.com/docs/manual/tutorial/upgrade-keyfile-to-x509/)。

 参见

原文 - [Update Replica Set to Keyfile Authentication (No Downtime)]( https://docs.mongodb.com/manual/tutorial/enforce-keyfile-access-control-in-existing-replica-set-without-downtime/ )

译者：景圣