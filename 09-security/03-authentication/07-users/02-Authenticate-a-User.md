# 验证用户

要以用户身份进行身份验证，您必须提供用户名、密码和[认证数据库](https://www.mongodb.com/docs/mongodb-shellmongosh-authentication-options/)与该用户关联。

> 重要的:
>
> 无法在同一用户之间切换 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)会议。**作为不同的用户进行身份验证意味着会话具有两个**经过身份验证的用户的特权。在用户退出和重新启动之间切换 [`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)， 你可以：

* 在连接期间进行身份验证

  开始[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)与[`-u `](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--username),[`-p`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password), 和 [`--authenticationDatabase `](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationDatabase)命令行选项：

  ```
  mongosh --port 27017  --authenticationDatabase \
      "admin" -u "myUserAdmin" -p
  ```

* 连接后验证

  使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), 连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例：

  ```
  mongosh --port 27017
  ```

  在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，切换到身份验证数据库（在本例中为`admin`），并使用[`db.auth(, )`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth)方法或[`authenticate`](https://www.mongodb.com/docs/manual/reference/command/authenticate/#mongodb-dbcommand-dbcmd.authenticate) 命令对[身份验证数据库：](https://www.mongodb.com/docs/mongodb-shellmongosh-authentication-options/)

  ```
  use admin
  db.auth("myUserAdmin", passwordPrompt()) // or cleartext password
  ```

  > 提示:
  >
  > 该[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)方法提示您输入密码。您也可以直接将密码指定为字符串。我们建议使用该[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)方法来避免密码在您的屏幕上可见并可能将密码泄露到您的 shell 历史记录中。

出现提示时输入密码。

有关使用 MongoDB 驱动程序的示例，请参阅[驱动程序文档。](https://www.mongodb.com/docs/drivers/)









翻译：韩鹏帅

原文：[Authenticate a User](https://www.mongodb.com/docs/manual/tutorial/authenticate-a-user/)
