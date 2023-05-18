 **分片集群的轮换密钥**

分片集群成员可以使用[keyfile](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#std-label-internal-auth-keyfile)相互验证为同一部署的成员。

从 4.2 版开始，一个[keyfile](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#std-label-internal-auth-keyfile)可以包含多个密钥，如果至少一个密钥在成员之间是通用的，则建立成员身份验证。 这允许在不停机的情况下滚动升级密钥。

以下教程逐步完成了在不停机的情况下更新分片集群密钥的过程。 [1]

>[WARNING]警告
>
>本教程中的示例键仅用于说明目的。 不要用于您的部署。 相反，使用您选择的任何方法生成密钥文件（例如，`openssl rand -base64 756 `等）。

考虑一个分片集群，其中每个成员的密钥文件都包含以下密钥：

![Image of current key to replace.](https://www.mongodb.com/docs/manual/images/example-key1.png)

以下过程更新分片集群成员以使用新密钥：

![Image of new key.](https://www.mongodb.com/docs/manual/images/example-key2.png)

[1] 本教程不适用于用于MongoDB加密存储引擎本地密钥管理的keyfile。 该密钥文件只能包含一个密钥。

**步骤**

1. **修改密钥文件以包含旧密钥和新密钥**

   修改每个成员的密钥文件以包括旧密钥和新密钥。 您可以将多个键指定为用引号括起来的字符串或键序列。

   >[WARNING]警告
   >
   >本教程中的示例键仅用于说明目的。 不要用于您的部署。 相反，使用您选择的任何方法生成密钥文件（例如，`openssl rand -base64 756 `等）。

   **多个键字符串**

   您可以指定多个键字符串，其中每个键字符串都用引号引起来

   ![Image of multiple key strings.](https://www.mongodb.com/docs/manual/images/example-multiple-keys1.png)

   **多键序列**

   您可以将多个键字符串指定为键字符串序列（可选地用引号引起来）：

   ![Image of multiple key string sequence.](https://www.mongodb.com/docs/manual/images/example-multiple-keys2.png)

2. **重启每个成员**

   一旦所有密钥文件都包含旧密钥和新密钥，一次重新启动每个成员。

   **配置服务器**

   **对于配置服务器副本集 (CSRS) 的每个辅助节点**，将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到成员并：

   - 使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法关闭成员：

     ```javascript
     use admin
     db.shutdownServer()
     ```

   - 重新启动成员。

   **对于主要的**，将  [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到成员，然后

   - 使用 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown) 降级成员：

     ```shell
     rs.stepDown()
     ```

   - 使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法关闭成员：

     ```shell
     use admin
     db.shutdownServer()
     ```

   - 重新启动成员。

   **分片副本集**

   **对于分片副本集的每个次要成员**，将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到成员并：

   - 使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法关闭成员：

     ```javascript
     use admin
     db.shutdownServer()
     ```

   - 重新启动成员。

   **对于每个分片副本集的主节点**，将  [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到成员，然后

   - 使用 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown) 降级成员：

     ```shell
     rs.stepDown()
     ```

   - 使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法关闭成员：

     ```shell
     use admin
     db.shutdownServer()
     ```

   - 重新启动成员。

   **`mongos`路由器**

   **对于每个 mongos/router 实例**，将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到  [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)  实例并：

   - 使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法关闭成员：

     ```javascript
     use admin
     db.shutdownServer()
     ```

   - 重新启动成员。

   一旦所有成员都重新启动，成员现在接受用于成员身份验证的旧密钥或新密钥。

3. **仅将密钥文件内容更新为新密钥**

   >WARNING]警告
   >
   >本教程中的示例键仅用于说明目的。 不要用于您的部署。 相反，使用您选择的任何方法生成密钥文件（例如，`openssl rand -base64 756 `等）。

   修改每个成员的密钥文件以仅包含新密码。

   ![Image of new key.](https://www.mongodb.com/docs/manual/images/example-key2.png)

4. **重启每个成员**

   一旦所有密钥文件都包含旧密钥和新密钥，一次重新启动每个成员。

   **配置服务器**

   **对于配置服务器副本集 (CSRS) 的每个辅助节点**，将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到成员并：

   - 使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法关闭成员：

     ```javascript
     use admin
     db.shutdownServer()
     ```

   - 重新启动成员。

   **对于主要的**，将  [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到成员，然后

   - 使用 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown) 降级成员：

     ```shell
     rs.stepDown()
     ```

   - 使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法关闭成员：

     ```shell
     use admin
     db.shutdownServer()
     ```

   - 重新启动成员。

   **分片副本集**

   **对于分片副本集的每个次要成员**，将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到成员并：

   - 使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法关闭成员：

     ```javascript
     use admin
     db.shutdownServer()
     ```

   - 重新启动成员。

   **对于每个分片副本集的主节点**，将  [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到成员，然后

   - 使用 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown) 降级成员：

     ```shell
     rs.stepDown()
     ```

   - 使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法关闭成员：

     ```shell
     use admin
     db.shutdownServer()
     ```

   - 重新启动成员。

   **`mongos`路由器**

   **对于每个 mongos/router 实例**，将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到  [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)  实例并：

   - 使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法关闭成员：

     ```javascript
     use admin
     db.shutdownServer()
     ```

   - 重新启动成员。

   一旦所有成员都重新启动，成员现在接受用于成员身份验证的旧密钥或新密钥。

 参见

原文 - [Rotate Keys for Sharded Clusters]( https://www.mongodb.com/docs/manual/tutorial/rotate-key-sharded-cluster/ )

译者：景圣