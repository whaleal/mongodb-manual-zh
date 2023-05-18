# 使用 SCRAM 验证客户端

以下过程在独立实例上设置 SCRAM 以进行客户端身份验证[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

要对副本集或分片集群使用 SCRAM 身份验证，请参阅 [使用密钥文件身份验证部署副本集。](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-with-keyfile-access-control/)

## 程序

1. 在没有访问控制的情况下启动 MongoDB

   启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)没有访问控制的独立实例。

   打开终端并以`mongod`用户身份运行以下命令：

   ```
   mongod --port 27017 --dbpath /var/lib/mongodb
   ```

   [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)本教程中的实例使用 数据[`port 27017`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--port)目录`/var/lib/mongodb` 。

   本教程假定该`/var/lib/mongodb`目录存在并且是默认的[`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath). 您可以根据需要指定不同的数据目录或端口。

   > 提示:
   >
   > 启动时[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，它会在目录中创建一些系统文件 `/var/lib/mongodb`。为确保系统文件拥有正确的所有权，请以`mongod` 用户身份遵循本教程。如果您[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)以`root`用户身份开始，则稍后必须更新文件所有权。

2. 连接到实例

   打开一个新终端并连接到数据库部署 [`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

   ```
   mongosh --port 27017
   ```

3. 创建用户管理员

   > 重要的:
   >
   > **本地主机异常**
   >
   > 您可以在启用访问控制之前或之后创建用户管理员。如果您在创建任何用户之前启用访问控制，MongoDB 会提供一个[本地主机异常](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)，允许您在数据库中创建用户管理员`admin`。创建后，您必须以用户管理员身份进行身份验证才能创建其他用户。

   使用[`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

   1. 切换到`admin`数据库
   2. 添加`myUserAdmin`具有 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)和 [`readWriteAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWriteAnyDatabase)角色的用户”：

   ```
   
   use admin
   db.createUser(
     {
       user: "myUserAdmin",
       pwd: passwordPrompt(), // or cleartext password
       roles: [
         { role: "userAdminAnyDatabase", db: "admin" },
         { role: "readWriteAnyDatabase", db: "admin" }
       ]
     }
   )
   
   ```

   > 提升:
   >
   > 该[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)方法提示您输入密码。您也可以直接将密码指定为字符串。我们建议使用该[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)方法来避免密码在您的屏幕上可见并可能将密码泄露到您的 shell 历史记录中。

   该[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)角色允许此用户：

   - 创建用户
   - 授予或撤销用户的角色
   - 创建或修改自定义角色

   您可以根据需要为用户分配额外的[内置角色](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-built-in-roles)或[用户定义的角色。](https://www.mongodb.com/docs/manual/core/security-user-defined-roles/#std-label-user-defined-roles)

   在本例中，您创建用户的数据库`admin`是用户的[身份验证数据库](https://www.mongodb.com/docs/manual/core/security-users/#std-label-user-authentication-database)。尽管用户需要对该数据库进行身份验证，但该用户可以在其他数据库中拥有角色。用户的身份验证数据库不限制用户的权限。

4. 重新启动具有访问控制的 MongoDB 实例

   关闭[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例。使用 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，发出以下命令：

   ```
   db.adminCommand( { shutdown: 1 } )
   ```

   出口[`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

   在启用访问控制的情况下启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

   - [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)如果从命令行启动，请添加[`--auth`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--auth)命令行选项：

     ```
     mongod --auth --port 27017 --dbpath /var/lib/mongodb
     ```

   - 如果您开始[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)使用 [配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-configuration-options)，请添加 [`security.authorization`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.authorization)配置文件设置

     ```
     security:
         authorization: enabled
     ```

   连接到此实例的客户端现在必须对自己进行身份验证，并且只能执行由其分配的角色确定的操作。

   > 重要的:
   >
   > **本地主机异常**
   >
   > 您可以在启用访问控制之前或之后创建用户。如果您在创建任何用户之前启用访问控制，MongoDB 会提供一个[本地主机异常](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)，允许您在数据库中创建用户管理员`admin`。创建后，您必须以用户管理员身份进行身份验证才能创建其他用户。

5. 以用户管理员身份连接和验证

   使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)， 你可以：

   **在连接期间进行身份认证:**

   开始[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)与[`-u `](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--username),[`-p`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password), 和 [`--authenticationDatabase `](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationDatabase)命令行选项：

   ```
   mongosh --port 27017  --authenticationDatabase \
       "admin" -u "myUserAdmin" -p
   ```

   **连接后验证:**

   使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，连接到您的数据库部署：

   ```
   mongosh --port 27017
   ```

   在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，切换到身份验证数据库（在本例中为`admin`），并使用[`db.auth(, )`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth)方法进行身份验证：

   ```
   use admin
   db.auth("myUserAdmin", passwordPrompt()) // or cleartext password
   ```

   > 提示:
   >
   > 该[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)方法提示您输入密码。您也可以直接将密码指定为字符串。我们建议使用该[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)方法来避免密码在您的屏幕上可见并可能将密码泄露到您的 shell 历史记录中。

   出现提示时输入密码。

## 下一步

要对副本集或分片集群使用 SCRAM 身份验证，请参阅 [使用密钥文件身份验证部署副本集。](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-with-keyfile-access-control/)



翻译：韩鹏帅

原文：[Use SCRAM to Authenticate Clients](https://www.mongodb.com/docs/manual/tutorial/configure-scram-client-authentication/)

