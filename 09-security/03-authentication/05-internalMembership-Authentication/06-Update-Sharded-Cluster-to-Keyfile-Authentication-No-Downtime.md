 **将分片集群更新为密钥文件身份验证（无停机时间）**

**概述**

>[IMPORTANT]重要
>
>以下过程适用于使用 MongoDB 3.4 或更高版本的分片集群。
>
>早期版本的 MongoDB 不支持无停机升级。 对于使用早期版本的 MongoDB 的分片集群，请参阅[Update Sharded Cluster to Keyfile Authentication](https://www.mongodb.com/docs/manual/tutorial/enforce-keyfile-access-control-in-existing-sharded-cluster/)。

MongoDB 分片集群可以强制执行[user authentication](https://www.mongodb.com/docs/manual/core/authentication/#std-label-authentication)及其组件的[internal authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#std-label-inter-process-auth)，以防止未经授权的访问。

以下教程描述了使用 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 转换现有分片集群以在不导致停机的情况下强制执行身份验证的过程。

在尝试本教程之前，请先熟悉本文档的内容。

**注意事项**

**云管理器和操作管理器**

如果您使用 Cloud Manager 或 Ops Manager 来管理您的部署，请参阅 [Cloud Manager manual](https://www.mongodb.com/docs/cloud-manager/tutorial/edit-host-authentication-credentials/)或 [
Ops Manager manual](https://www.mongodb.com/docs/ops-manager/current/tutorial/edit-host-authentication-credentials/)中的为 MongoDB 部署配置访问控制以强制执行身份验证。

**IP绑定**

在 3.6 版中更改。

从 MongoDB 3.6 开始，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到 `localhost`。

**内部和客户端认证机制**

本教程使用[SCRAM](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram) 配置身份验证以进行客户端身份验证，并使用[keyfile](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#std-label-internal-auth-keyfile)进行内部身份验证。

有关可用客户端和内部身份验证机制的完整列表，请参阅[Authentication](https://www.mongodb.com/docs/manual/core/authentication/#std-label-authentication)文档。

**架构**

本教程假设每个分片副本集以及配置服务器副本集都可以在退出其现有主副本后选择一个新的主副本。

仅当以下两个条件都为真时，副本集才能选举[primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)：

- 大多数投票副本集成员在退出[primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)后可用。


- 至少有一个未[delayed](https://www.mongodb.com/docs/manual/core/replica-set-delayed-member/#std-label-replica-set-delayed-members)、[hidden](https://www.mongodb.com/docs/manual/core/replica-set-hidden-member/#std-label-replica-set-hidden-members)或[Priority 0](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/#std-label-replica-set-secondary-only-members) 的可用次要成员。

**mongos实例的最小数量**

确保您的分片集群至少有两个可用的 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例。 本教程需要重启集群中的每个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)。 如果您的分片集群只有一个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例，这会导致在 mongos 离线期间停机。

**在现有分片集群上实施密钥文件访问控制**

**创建和分发密钥文件**

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
openssl rand -base64 755 > <path-to-keyfile>
chmod 400 <path-to-keyfile>
```

将密钥文件复制到托管分片集群成员的每个服务器。 确保运行 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的用户是文件的所有者并且可以访问密钥文件。

避免将密钥文件存储在可以轻松与托管 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的硬件断开连接的存储介质上，例如 USB 驱动器或网络附加存储设备。

有关使用密钥文件进行内部身份验证的更多信息，请参阅[Keyfiles](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#std-label-internal-auth-keyfile)。

**配置分片集群管理员用户和客户端用户**
您必须连接到 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 才能完成本节中的步骤。 在这些步骤中创建的用户是集群级别的用户，不能用于访问单个分片副本集。

1. **创建管理员用户**

   使用[`db.createUser()`](https://www.mongodb.com/docs/manual/reference/method/db.createUser/#mongodb-method-db.createUser)方法创建管理员用户并为其分配以下角色：

   - 管理数据库上的 [`clusterAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin)


   - `admin `数据库上的 [`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)  角色

   在分片集群上执行维护操作或用户管理操作的客户端必须在完成本教程时验证为该用户。 现在创建此用户以确保您在执行身份验证后可以访问集群。

   ```javascript
admin = db.getSiblingDB("admin");
admin.createUser(
  {
    user: "admin",
    pwd: "<password>",
    roles: [
      { role: "clusterAdmin", db: "admin" },
      { role: "userAdmin", db: "admin" }
    ]
  }
);
   ```

   >[IMPORTANT]重要
   >
   >密码应随机、较长且复杂，以确保系统安全并防止或延迟恶意访问。

2. **可选：为客户端应用程序创建其他用户**

   除了管理员用户之外，您还可以在执行身份验证之前创建其他用户。这可以确保在您完全执行身份验证后可以访问分片集群。

   >[EXAMPLE]示例
   >
   >以下操作在`marketing`数据库上创建用户 joe，并向该用户分配`marketing`数据库上的[`readWrite`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWrite)角色。
   >
   >```javascript
   >db.getSiblingDB("marketing").createUser(
   >{
   >"user": "joe",
   >"pwd": "<password>",
   >"roles": [ { "role" : "readWrite", "db" : "marketing" } ]
   >}
   >)
   >```
   >
   >认证为`“joe”`的客户端可以对`marketing`数据库执行读写操作。

3. **可选：更新客户端应用程序以指定身份验证凭据**

   虽然分片集群当前不强制执行身份验证，但您仍然可以更新客户端应用程序以在连接到分片集群时指定身份验证凭据。 这可以防止在完成本教程时丢失连接。

   >[EXAMPLE]示例
   >
   >以下操作使用  [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到分片集群，在`marketing`数据库上以用户 `joe` 身份进行身份验证。
   >
   >```javascript
   >mongosh  --username "joe" --password "<password>" \
   >--authenticationDatabase "marketing" --host mongos1.example.net:27017
   >```
   >
   >如果您的应用程序使用 MongoDB 驱动程序，请参阅相关的有关创建经过身份验证的连接的说明的[
   >driver](https://www.mongodb.com/docs/drivers/)文档。

**转换每个 mongos 实例以强制执行身份验证**

1. **创建一个新的 `mongos` 配置文件**

   对于每个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)：

   1. 复制现有的 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 配置文件，为其命名，例如` <filename>-secure.conf`（如果使用 Windows，则为 `.cfg`）。 您将使用这个新的配置文件来转换 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)以在分片集群中强制执行身份验证。 保留原始配置文件以备备份。

   2. 在新的配置文件中，添加以下设置：

      - [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 设置为` true`

      - [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 设置为密钥文件路径。

        如果使用不同的内部身份验证机制，请指定适合该机制的设置。

        ```yaml
        security:
           transitionToAuth: true
           keyFile: <path-to-keyfile>
        ```

        新的配置文件应该包含 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 以前使用的所有配置设置以及新的安全设置。

2. **一次一个，用新的配置文件重启 `mongos`**

   >[NOTE]注意
   >
   >如果您的集群只有一个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，则此步骤会在 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 离线时导致停机。

   按照以下过程重新启动 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例，一次一个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)：

   1. 连接到 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 以关闭。

   2. 对 admin 数据库使用 db.shutdownServer() 方法来安全地关闭 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)。

      ```shell
      db.getSiblingDB("admin").shutdownServer()
      ```

   3. 使用新配置文件重新启动 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，使用 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--config) 指定配置文件的路径。 例如，如果新配置文件名为 `mongos-secure.conf`：

      ```shell
      mongos --config <path>/mongos-secure.conf
      ```

      其中 `<path>` 表示包含新配置文件的文件夹的系统路径。

   对下一个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例重复重启过程，直到分片集群中的所有 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例都已重启。

在本节结束时，分片集群中的所有 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例都在使用 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 和 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 内部身份验证运行。

**过渡配置服务器副本集成员强制执行身份验证**

1. **创建一个新的`mongod` 配置文件**

   对于每个  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

   1. 复制现有的  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 配置文件，为其命名，例如` <filename>-secure.conf`（如果使用 Windows，则为 `.cfg`）。 您将使用这个新的配置文件来转换  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)以在分片集群中强制执行身份验证。 保留原始配置文件以备备份。

   2. 在新的配置文件中，添加以下设置：

      - [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 设置为` true`

      - [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 设置为密钥文件路径。

        如果使用不同的内部身份验证机制，请指定适合该机制的设置。

        ```yaml
        security:
           transitionToAuth: true
           keyFile: <path-to-keyfile>
        ```

2. **一次一个，用新的配置文件重启 `mongod`**

   重新启动副本集，一次一个成员，从[secondary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员开始。

   1. 要一次一个地重新启动次要成员，

      - 连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 并对 admin 数据库使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法来安全地关闭 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

        ```shell
        db.getSiblingDB("admin").shutdownServer()
        ```

      - 使用新配置文件重新启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，使用 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config) 指定配置文件的路径。 例如，如果新配置文件名为 `mongod-secure.conf`：

        ```shell
        mongod --config <path>/mongod-secure.conf
        ```

        其中 `<path>` 表示包含新配置文件的文件夹的系统路径。

      此成员启动后，对下一个次要成员重复此操作。

   2. 一旦所有次要成员都重新启动并启动，重新启动主要成员：

      - 连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。


      - 使用 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)方法降级主节点并触发选举。
    
        ```shell
        rs.stepDown()
        ```
    
        您可以使用 [`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status) 方法来确保副本集已选出新的主节点。
    
      - 一旦您退出主数据库并选出新的主数据库，使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法对管理数据库关闭旧的主数据库。
    
        ```shell
        db.getSiblingDB("admin").shutdownServer()
        ```
    
      - 使用新配置文件重新启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，使用 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config) 指定配置文件的路径。 例如，如果新配置文件名为 `mongod-secure.conf`：
    
        ```shell
        mongod --config <path>/mongod-secure.conf
        ```
    
        其中 `<path>` 表示包含新配置文件的文件夹的系统路径。

在本节结束时，分片集群中的所有[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例都在使用 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 和 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 内部身份验证运行。

**转换每个分片副本集成员以强制执行身份验证**

**创建分片本地管理员**

在强制身份验证的分片集群中，每个分片副本集都应该有自己的[shard-local administrator](https://www.mongodb.com/docs/manual/core/security-users/#std-label-shard-local-users)。 您不能对一个分片使用分片本地管理员来访问另一个分片或分片集群。

连接到每个分片副本集的主要成员，并使用[`db.createUser()`](https://www.mongodb.com/docs/manual/reference/method/db.createUser/#mongodb-method-db.createUser)方法创建管理员用户并为其分配以下角色：

- 管理数据库上的 [`clusterAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin)

- `admin `数据库上的 [`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)  角色

>[TIP]提示
>
>从 `mongo` shell 版本 4.2 开始，您可以使用 [`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt) 方法结合各种用户身份验证/管理方法/命令来提示输入密码，而不是直接在方法/命令调用中指定密码。 但是，您仍然可以像使用早期版本的 `mongo` shell 一样直接指定密码。

```javascript
admin = db.getSiblingDB("admin")
admin.createUser(
  {
    user: "admin",
    pwd: passwordPrompt(),  // or cleartext password
    roles: [
      { role: "clusterAdmin", db: "admin" },
      { role: "userAdmin", db: "admin" }
    ]
  }
)
```

完成本教程后，如果要连接到分片以执行需要直接连接到分片的维护操作，则必须以分片本地管理员身份进行身份验证。

>[NOTE]注意
>
>直接连接到分片应该只用于分片特定的维护和配置。 一般来说，客户端应该通过 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 连接到分片集群。

**步骤**

一次转换一个分片副本集，对分片集群中的每个分片副本集重复这些步骤。

1. **创建一个新的`mongod` 配置文件**

   对于每个  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

   1. 复制现有的  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 配置文件，为其命名，例如` <filename>-secure.conf`（如果使用 Windows，则为 `.cfg`）。 您将使用这个新的配置文件来转换  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)以在分片集群中强制执行身份验证。 保留原始配置文件以备备份。

   2. 在新的配置文件中，添加以下设置：

      - [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 设置为` true`

      - [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 设置为密钥文件路径。

        如果使用不同的内部身份验证机制，请指定适合该机制的设置。

        ```yaml
        security:
           transitionToAuth: true
           keyFile: <path-to-keyfile>
        ```

2. **一次一个，用新的配置文件重启 `mongod`**

   重新启动副本集，一次一个成员，从[secondary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员开始。

   1. 要一次一个地重新启动次要成员，

      - 连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 并对 admin 数据库使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法来安全地关闭 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

        ```shell
        db.getSiblingDB("admin").shutdownServer()
        ```

      - 使用新配置文件重新启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，使用 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config) 指定配置文件的路径。 例如，如果新配置文件名为 `mongod-secure.conf`：

        ```shell
        mongod --config <path>/mongod-secure.conf
        ```

        其中 `<path>` 表示包含新配置文件的文件夹的系统路径。

      此成员启动后，对下一个次要成员重复此操作。

   2. 一旦所有次要成员都重新启动并启动，重新启动主要成员：

      - 连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

      - 使用 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)方法降级主节点并触发选举。

        ```shell
        rs.stepDown()
        ```

        您可以使用 [`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status) 方法来确保副本集已选出新的主节点。

      - 一旦您退出主数据库并选出新的主数据库，使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法对管理数据库关闭旧的主数据库。

        ```shell
        db.getSiblingDB("admin").shutdownServer()
        ```

      - 使用新配置文件重新启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，使用 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config) 指定配置文件的路径。 例如，如果新配置文件名为 `mongod-secure.conf`：

        ```shell
        mongod --config <path>/mongod-secure.conf
        ```

        其中 `<path>` 表示包含新配置文件的文件夹的系统路径。

在本节结束时，分片集群中的所有[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例都在使用 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 和 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 内部身份验证运行。

**转换每个分片副本集成员以强制执行身份验证**

**创建分片本地管理员**

在强制身份验证的分片集群中，每个分片副本集都应该有自己的分片本地管理员。 您不能对一个分片使用分片本地管理员来访问另一个分片或分片集群。

连接到每个分片副本集的主要成员，并使用[`db.createUser()`](https://www.mongodb.com/docs/manual/reference/method/db.createUser/#mongodb-method-db.createUser)方法创建管理员用户并为其分配以下角色：

- 管理数据库上的 [`clusterAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin)

- `admin `数据库上的 [`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)  角色

>[TIP]提示
>
>从 `mongo` shell 版本 4.2 开始，您可以使用 [`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt) 方法结合各种用户身份验证/管理方法/命令来提示输入密码，而不是直接在方法/命令调用中指定密码。 但是，您仍然可以像使用早期版本的 `mongo` shell 一样直接指定密码。

```javascript
admin = db.getSiblingDB("admin")
admin.createUser(
  {
    user: "admin",
    pwd: passwordPrompt(),  // or cleartext password
    roles: [
      { role: "clusterAdmin", db: "admin" },
      { role: "userAdmin", db: "admin" }
    ]
  }
)
```

完成本教程后，如果要连接到分片以执行需要直接连接到分片的维护操作，则必须以分片本地管理员身份进行身份验证。

>[NOTE]注意
>
>直接连接到分片应该只用于分片特定的维护和配置。 一般来说，客户端应该通过 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 连接到分片集群。

**步骤**

一次转换一个分片副本集，对分片集群中的每个分片副本集重复这些步骤。

1. **创建一个新的`mongod` 配置文件**

   对于每个  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)：

   1. 复制现有的  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 配置文件，为其命名，例如` <filename>-secure.conf`（如果使用 Windows，则为 `.cfg`）。 您将使用这个新的配置文件来转换  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)以在分片集群中强制执行身份验证。 保留原始配置文件以备备份。

   2. 在新的配置文件中，添加以下设置：

      - [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 设置为` true`

      - [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 设置为密钥文件路径。

        如果使用不同的内部身份验证机制，请指定适合该机制的设置。

        ```yaml
        security:
           transitionToAuth: true
           keyFile: <path-to-keyfile>
        ```

2. **一次一个，用新的配置文件重启 `mongod`**

   重新启动副本集，一次一个成员，从[secondary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员开始。

   1. 要一次一个地重新启动次要成员，

      - 连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 并对 admin 数据库使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法来安全地关闭 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

        ```shell
        db.getSiblingDB("admin").shutdownServer()
        ```

      - 使用新配置文件重新启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，使用 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config) 指定配置文件的路径。 例如，如果新配置文件名为 `mongod-secure.conf`：

        ```shell
        mongod --config <path>/mongod-secure.conf
        ```

        其中 `<path>` 表示包含新配置文件的文件夹的系统路径。

      此成员启动后，对下一个次要成员重复此操作。

   2. 一旦所有次要成员都重新启动并启动，重新启动主要成员：

      - 连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

      - 使用 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)方法降级主节点并触发选举。

        ```shell
        rs.stepDown()
        ```

        您可以使用 [`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status) 方法来确保副本集已选出新的主节点。

      - 一旦您退出主数据库并选出新的主数据库，使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法对管理数据库关闭旧的主数据库。

        ```shell
        db.getSiblingDB("admin").shutdownServer()
        ```

      - 使用新配置文件重新启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，使用 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config) 指定配置文件的路径。 例如，如果新配置文件名为 `mongod-secure.conf`：

        ```shell
        mongod --config <path>/mongod-secure.conf
        ```

        其中 `<path>` 表示包含新配置文件的文件夹的系统路径。

在本教程的这一点上，分片集群的每个组件都在使用 `--transitionToAuth` 和 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 内部身份验证运行。 分片集群至少有一个管理用户，每个分片副本集都有一个分片本地管理用户。

其余部分涉及使分片集群脱离过渡状态以完全执行身份验证。

**在没有` transitionToAuth` 的情况下重启每个 `mongos` 实例**

>[IMPORTANT]重要
>
>在本节末尾，客户端必须指定身份验证凭证才能连接到分片集群。 在完成此部分之前更新客户端以指定身份验证凭证以避免连接丢失。

要完成在分片集群中完全强制执行身份验证的转换，您必须在没有[`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 设置的情况下重新启动每个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例。

1. **从 `mongos` 配置文件中删除 `transitionToAuth`**

   从本教程中创建的 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 配置文件中删除 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 键及其值。 保留教程中添加的 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 设置。

   ```shell
   security:
      keyFile: <path-to-keyfile>
   ```

2. **使用更新的配置文件重新启动` mongos`**

   >[NOTE]注意
   >
   >如果您的集群只有一个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，则此步骤会在 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 离线时导致停机。

   按照以下过程重新启动 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例，一次一个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)：

   1. 连接到 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 以关闭。

   2. 对 `admin` 数据库使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer)方法来安全地关闭 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)。

      ```shell
      db.getSiblingDB("admin").shutdownServer()
      ```

   3. 使用新配置文件重新启动 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，使用 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--config) 指定配置文件的路径。 例如，如果新配置文件名为 `mongos-secure.conf`：

      ```shell
      mongos --config <path>/mongos-secure.conf
      ```

      其中 `<path>` 表示包含新配置文件的文件夹的系统路径。

   对下一个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例重复重启过程，直到分片集群中的所有 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例都已重启。

   在本节结束时，分片集群中的所有 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例都在使用 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 和 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 内部身份验证运行。

**在没有 `transitionToAuth` 的情况下重启每个配置服务器副本集成员**

>[IMPORTANT]重要
>
>在本节末尾，客户端必须指定身份验证凭证才能连接到分片集群。 在完成此部分之前更新客户端以指定身份验证凭证以避免连接丢失。

要完成在分片集群中完全强制执行身份验证的转换，您必须在没有[`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 设置的情况下重新启动每个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例。

1. **从 `mongod` 配置文件中删除 `transitionToAuth`**

   从本教程中创建的配置服务器配置文件中删除 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth)  键及其值。 保留教程中添加的 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 设置。

   ```yaml
   security:
      keyFile: <path-to-keyfile>
   ```

2. **使用更新的配置文件重新启动` mongod`**

   重新启动副本集，一次一个成员，从次要成员开始。

   1. 要一次一个地重新启动次要成员，

      - 连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 并对 admin 数据库使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法来安全地关闭 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

        ```shell
        db.getSiblingDB("admin").shutdownServer()
        ```

      - 使用新配置文件重新启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，使用 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config) 指定配置文件的路径。 例如，如果新配置文件名为 `mongod-secure.conf`：

        ```shell
        mongod --config <path>/mongod-secure.conf
        ```

        其中 `<path>` 表示包含新配置文件的文件夹的系统路径。

      此成员启动后，对下一个次要成员重复此操作。

   2. 一旦所有次要成员都重新启动并启动，重新启动主要成员：

      - 连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

      - 使用 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)方法降级主节点并触发选举。

        ```shell
        rs.stepDown()
        ```

        您可以使用 [`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status) 方法来确保副本集已选出新的主节点。

      - 一旦您退出主数据库并选出新的主数据库，使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法对管理数据库关闭旧的主数据库。

        ```shell
        db.getSiblingDB("admin").shutdownServer()
        ```

      - 使用新配置文件重新启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，使用 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config) 指定配置文件的路径。 例如，如果新配置文件名为 `mongod-secure.conf`：

        ```shell
        mongod --config <path>/mongod-secure.conf
        ```

        其中 `<path>` 表示包含新配置文件的文件夹的系统路径。

   在本节的最后，配置服务器副本集中的所有 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例都强制执行客户端身份验证和[`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 内部身份验证。

   **在没有 `transitionToAuth` 的情况下重启每个分片副本集中的每个成员**

   >[IMPORTANT]重要
   >
   >在此步骤结束时，客户端必须指定身份验证凭据才能连接到分片副本集。 在完成此部分之前更新客户端以指定身份验证凭据以避免连接丢失。

   要完成在分片集群中完全强制执行身份验证的转换，您必须在没有 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth) 设置的情况下重新启动分片集群中每个分片副本集的每个成员。

   一次转换一个分片副本集，对分片集群中的每个分片副本集重复这些步骤。

   1. **从 `mongod` 配置文件中删除 `transitionToAuth`**

      从本教程中创建的配置服务器配置文件中删除 [`security.transitionToAuth`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.transitionToAuth)  键及其值。 保留教程中添加的 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 设置。

      ```yaml
      security:
         keyFile: <path-to-keyfile>
      ```

   2. **使用更新的配置文件重新启动` mongod`**

      重新启动副本集，一次一个成员，从次要成员开始。

      1. 要一次一个地重新启动次要成员，

         - 连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 并对 admin 数据库使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法来安全地关闭 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

           ```shell
           db.getSiblingDB("admin").shutdownServer()
           ```

         - 使用新配置文件重新启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，使用 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config) 指定配置文件的路径。 例如，如果新配置文件名为 `mongod-secure.conf`：

           ```shell
           mongod --config <path>/mongod-secure.conf
           ```

           其中 `<path>` 表示包含新配置文件的文件夹的系统路径。

         此成员启动后，对下一个次要成员重复此操作。

      2. 一旦所有次要成员都重新启动并启动，重新启动主要成员：

         - 连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

         - 使用 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)方法降级主节点并触发选举。

           ```shell
           rs.stepDown()
           ```

           您可以使用 [`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status) 方法来确保副本集已选出新的主节点。

         - 一旦您退出主数据库并选出新的主数据库，使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法对管理数据库关闭旧的主数据库。

           ```shell
           db.getSiblingDB("admin").shutdownServer()
           ```

         - 使用新配置文件重新启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，使用 [`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config) 指定配置文件的路径。 例如，如果新配置文件名为 `mongod-secure.conf`：

           ```shell
           mongod --config <path>/mongod-secure.conf
           ```

           其中 `<path>` 表示包含新配置文件的文件夹的系统路径。

      在本节的最后，配置服务器副本集中的所有 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例都强制执行客户端身份验证和[`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile) 内部身份验证。

      在本节的最后，分片集群中的所有 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 和[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例都强制执行客户端身份验证和 [`security.keyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.keyFile)  内部身份验证。 客户端只能使用配置的客户端身份验证机制连接到分片集群。 其他组件只能通过指定正确的密钥文件才能加入集群。

**x.509 内部认证**

MongoDB 支持用于安全 TLS/SSL 连接的 x.509 证书身份验证。 分片集群成员和副本集成员可以使用 x.509 证书来验证他们对集群或副本集的成员身份，而不是使用[Keyfiles](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#std-label-internal-auth-keyfile)。

有关使用 x.509 进行内部身份验证的详细信息，请参阅[Use x.509 Certificate for Membership Authentication](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/)。

要从密钥文件内部身份验证升级到 x.509 内部身份验证，请参阅[Upgrade from Keyfile Authentication to x.509 Authentication](https://www.mongodb.com/docs/manual/tutorial/upgrade-keyfile-to-x509/)。

 参见

原文 - [Update Sharded Cluster to Keyfile Authentication (No Downtime)]( https://www.mongodb.com/docs/manual/tutorial/enforce-keyfile-access-control-in-existing-sharded-cluster-no-downtime/ )

译者：景圣

