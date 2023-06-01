#### 更改您的密码和自定义数据

## 概述

具有适当权限的用户可以更改自己的密码和自定义数据。[`Custom data`](https://www.mongodb.com/docs/manual/reference/system-users-collection/#mongodb-data-admin.system.users.customData)存储可选的用户信息。

## 注意事项

要生成用于此过程的强密码，您可以使用该 `openssl`实用程序的`rand`命令。例如，发出`openssl rand`以下选项以创建 48 个伪随机字节的 base64 编码字符串：

```shell
openssl rand -base64 48
```

## 先决条件

要修改您自己的密码和自定义数据，您必须具有分别授予[`changeOwnPassword`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-changeOwnPassword)和 [操作](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)用户数据库的权限。[`changeOwnCustomData`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-changeOwnCustomData)

1. 以具有管理用户和角色权限的用户身份连接。

   连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)具有管理用户和角色的权限，例如具有 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)角色的用户。以下过程使用 `myUserAdmin`在[启用访问控制中创建的。](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)

   ```
   mongosh --port 27017 -u myUserAdmin -p  --authenticationDatabase 'admin'
   ```

   如果您不指定密码[`-p`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password) 命令行选项，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)提示输入密码。

2. 创建具有适当权限的角色。

   在`admin`数据库中，一个带有和 [`create`](https://www.mongodb.com/docs/manual/reference/method/db.createRole/#mongodb-method-db.createRole)的新角色[。](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-changeOwnCustomData)[`changeOwnPassword`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-changeOwnPassword)[`changeOwnCustomData`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-changeOwnCustomData)

   ```
   use admin
   db.createRole(
      { role: "changeOwnPasswordCustomDataRole",
        privileges: [
           { 
             resource: { db: "", collection: ""},
             actions: [ "changeOwnPassword", "changeOwnCustomData" ]
           }
        ],
        roles: []
      }
   )
   ```

3. 添加具有此角色的用户。

   在`test`数据库中，[`create`](https://www.mongodb.com/docs/manual/reference/method/db.createUser/#mongodb-method-db.createUser)具有已创建角色的新用户`"changeOwnPasswordCustomDataRole"`。例如，以下操作创建了一个同时具有内置角色[`readWrite`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWrite)和用户创建的用户`"changeOwnPasswordCustomDataRole"`。

   > 提示:
   >
   > 从 shell 的 4.2 版本开始`mongo`，您可以将[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)方法与各种用户身份验证/管理方法/命令结合使用来提示输入密码，而不是直接在方法/命令调用中指定密码。但是，您仍然可以像使用早期版本的 shell 一样直接指定密码 `mongo`。

   ```
   use test
   db.createUser(
      {
        user:"user123",
        pwd: passwordPrompt(),  // or cleartext password
        roles:[ "readWrite", { role:"changeOwnPasswordCustomDataRole", db:"admin" } ] 
      }
   )
   ```

   要授予现有用户新角色，请使用 [`db.grantRolesToUser()`.](https://www.mongodb.com/docs/manual/reference/method/db.grantRolesToUser/#mongodb-method-db.grantRolesToUser)

## 步骤

1. 使用适当的权限连接。

   连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)作为具有适当权限的用户。

   例如，以下操作连接到 `user123`在[先决条件](https://www.mongodb.com/docs/manual/tutorial/change-own-password-and-custom-data/#std-label-change-own-password-prereq) 部分。

   ```
   mongosh --port 27017 -u user123 --authenticationDatabase 'test' -p
   ```

   如果您不指定密码[`-p`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password) 命令行选项，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)提示输入密码。

   检查您是否具有在 [先决条件](https://www.mongodb.com/docs/manual/tutorial/change-own-password-and-custom-data/#std-label-change-own-password-prereq)部分以及查看用户信息，请使用[`usersInfo`](https://www.mongodb.com/docs/manual/reference/command/usersInfo/#mongodb-dbcommand-dbcmd.usersInfo)带有 `showPrivileges`选项的命令。

2. 更改您的密码和自定义数据。

   使用[`db.updateUser()`](https://www.mongodb.com/docs/manual/reference/method/db.updateUser/#mongodb-method-db.updateUser)方法更新密码和自定义数据。

   例如，以下操作将用户密码更改为 `KNlZmiaNUp0B`，自定义数据更改为`{ title: "Senior Manager" }`：

   > 提示:
   >
   > 从 shell 的 4.2 版本开始`mongo`，您可以将[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)方法与各种用户身份验证/管理方法/命令结合使用来提示输入密码，而不是直接在方法/命令调用中指定密码。但是，您仍然可以像使用早期版本的 shell 一样直接指定密码 `mongo`。

   ```
   use test
   db.updateUser(
      "user123",
      {
         pwd: passwordPrompt(),  // or cleartext password
         customData: { title: "Senior Manager" }
      }
   )
   ```

   出现提示时输入密码。









译者：韩鹏帅

原文：[Change Your Password and Custom Data](https://www.mongodb.com/docs/manual/tutorial/change-own-password-and-custom-data/)