# 创建用户

启用访问控制后，用户需要表明自己的身份。您必须授予用户一个或多个[角色](https://www.mongodb.com/docs/manual/core/authorization/#std-label-roles)。角色授予用户在 MongoDB[资源](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-document)上执行特定[操作的](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)[权限](https://www.mongodb.com/docs/manual/core/authorization/#std-label-privileges)[。](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-document)

MongoDB 系统的每个应用程序和用户都应该映射到一个不同的用户。*这种访问隔离*原则有助于访问撤销和持续的用户维护。为确保系统的[最低权限](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-least-privilege)，只授予用户所需的最少权限集。

## 先决条件

为了能够创建用户，您需要：

- [启用访问控制](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/#std-label-enable-access-control)
- [创建用户管理员](https://www.mongodb.com/docs/manual/tutorial/configure-scram-client-authentication/#std-label-create-user-admin)

对于常规用户创建，您必须拥有以下权限：

- 要在数据库中创建新用户，您必须 对该[数据库资源执行](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-specific-db)[操作](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)[。](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-specific-db)[`createUser`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createUser)
- 要向用户授予角色，您必须对该角色的数据库执行[操作。](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)[`grantRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-grantRole)

和内置角色 在各自的[资源](https://www.mongodb.com/docs/manual/reference/resource-document/)[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)上提供 和操作[。](https://www.mongodb.com/docs/manual/reference/resource-document/)[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)[`createUser`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createUser)[`grantRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-grantRole)

## 程序

> 笔记:
>
> 以下过程使用[SCRAM](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram) 身份验证。有关其他身份验证机制的更多信息，请参阅[额外的例子。](https://www.mongodb.com/docs/manual/tutorial/create-users/#std-label-create-users-examples)

1. 连接和验证

   使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，连接到您的主服务器 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，或者在分片集群中，连接到您的 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)并以用户管理员或用户身份进行身份验证[所需特权：](https://www.mongodb.com/docs/manual/tutorial/create-users/#std-label-add-user-prereq)

   * 在连接期间进行身份验证

     开始[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)与[`-u `](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--username),[`-p`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password), 和 [`--authenticationDatabase `](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationDatabase)命令行选项：

     ```
     mongosh --port 27017  --authenticationDatabase \
         "admin" -u "myUserAdmin" -p
     ```

     出现提示时输入密码。

   * 连接后验证

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

2. 为您的服务创建额外的用户

   > 笔记:
   >
   > 以下步骤使用[SCRAM](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram)身份验证。有关其他身份验证机制的更多信息，请参阅 [额外的例子。](https://www.mongodb.com/docs/manual/tutorial/create-users/#std-label-create-users-examples)

   验证为用户管理员后，使用该 [`db.createUser()`](https://www.mongodb.com/docs/manual/reference/method/db.createUser/#mongodb-method-db.createUser)方法创建其他用户。您可以为用户分配任何[内置角色](https://www.mongodb.com/docs/manual/reference/built-in-roles/)或 [用户定义的角色。](https://www.mongodb.com/docs/manual/core/security-user-defined-roles/)

   以下操作将一个用户添加`myTester`到`test` 数据库中，该用户具有数据库[`readWrite`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWrite)中的角色`test` 以及数据库[`read`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-read)中的角色`reporting` 。

   ```
   use test
   db.createUser(
     {
       user: "myTester",
       pwd:  passwordPrompt(),   // or cleartext password
       roles: [ { role: "readWrite", db: "test" },
                { role: "read", db: "reporting" } ]
     }
   )
   
   ```

   > 提示:
   >
   > 该[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)方法提示您输入密码。您也可以直接将密码指定为字符串。我们建议使用该[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)方法来避免密码在您的屏幕上可见并可能将密码泄露到您的 shell 历史记录中。

   您在其中创建用户的数据库（在本例中为`test`）是该用户的[身份验证数据库](https://www.mongodb.com/docs/manual/core/security-users/#std-label-user-authentication-database)。尽管用户对此数据库进行了身份验证，但该用户可以在其他数据库中拥有角色。用户的认证数据库不限制用户的权限。

   创建其他用户后，退出[`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

3. 连接到实例并验证为`myTester`

   > 重要的:
   >
   > 无法在同一用户之间切换 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)会议。**作为不同的用户进行身份验证意味着会话具有两个**经过身份验证的用户的特权。在用户退出和重新启动之间切换 [`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

   退出后[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)作为`myUserAdmin`，重新连接为 `myTester`：

   * 在连接期间进行身份验证

     开始[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)与[`-u `](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--username),[`-p`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password), 和 [`--authenticationDatabase `](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationDatabase)命令行选项：

     ```
     mongosh --port 27017 -u "myTester" \
         --authenticationDatabase "test" -p
     ```

     出现提示时输入用户密码。

   * 连接后验证

     ```
     mongosh --port 27017
     ```

     在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，切换到身份验证数据库（在本例中为`admin`），并使用[`db.auth(, )`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth)方法进行身份验证：

     ```shell
     use test
     db.auth("myTester", passwordPrompt())  // or cleartext password
     ```

     > 提示:
     >
     > 该[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)方法提示您输入密码。您也可以直接将密码指定为字符串。我们建议使用该[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)方法来避免密码在您的屏幕上可见并可能将密码泄露到您的 shell 历史记录中。

     出现提示时输入用户密码。

4. 插入文档作为`myTester`

   作为用户`myTester`，您有权在数据库中执行读写操作`test`（以及在`reporting`数据库中执行读取操作）。验证为 后 `myTester`，将文档插入`test` 数据库中的集合。例如，您可以在`test`数据库中执行以下插入操作：

   ```shell
   db.foo.insertOne( { x: 1, y: 1 } )
   ```

> 提示:
>
> **也可以看看：**
>
> [管理用户和角色](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/)

## 其他示例

#### 用户名/密码认证

以下操作在`reporting` 数据库中创建一个具有指定名称、密码和角色的用户。

> 提示:
>
> 该[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)方法提示您输入密码。您也可以直接将密码指定为字符串。我们建议使用该[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)方法来避免密码在您的屏幕上可见并可能将密码泄露到您的 shell 历史记录中。

```
use reporting
db.createUser(
  {
    user: "reportsUser",
    pwd: passwordPrompt(),  // or cleartext password
    roles: [
       { role: "read", db: "reporting" },
       { role: "read", db: "products" },
       { role: "read", db: "sales" },
       { role: "readWrite", db: "accounts" }
    ]
  }
)
```

### Kerberos 认证

使用外部身份验证机制（例如 Kerberos）对 MongoDB 进行身份验证的用户必须在数据库中创建`$external` ，这允许[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)或[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 参考外部源进行身份验证。

要对身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[客户端会话和因果一致性保证](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)，`$external`用户名不能超过 10k 字节。

对于 Kerberos 身份验证，您必须添加 Kerberos 主体作为用户名。您不需要指定密码。

`reportingapp@EXAMPLE.NET`以下操作添加了对数据库具有只读访问权限的Kerberos 主体 `records` ：

```
use $external
db.createUser(
    {
      user: "reportingapp@EXAMPLE.NET",
      roles: [
         { role: "read", db: "records" }
      ]
    }
)
```

> 提示:
>
> **也可以看看：**
>
> 有关为 MongoDB 部署设置 Kerberos 身份验证的更多信息，请参阅以下教程：
>
> - [在 Linux 上使用 Kerberos 身份验证配置 MongoDB](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-with-kerberos-authentication/)
> - [在 Windows 上使用 Kerberos 身份验证配置 MongoDB](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-windows-with-kerberos-authentication/)

### LDAP 身份验证

使用外部身份验证机制（例如 LDAP）对 MongoDB 进行身份验证的用户必须在数据库中创建`$external` ，这允许[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)或[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 参考外部源进行身份验证。

要对身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[客户端会话和因果一致性保证](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)，`$external`用户名不能超过 10k 字节。

对于 LDAP 身份验证，您必须指定用户名。您不需要指定密码，因为它由 LDAP 服务处理。

以下操作添加`reporting`对数据库具有只读访问权限的用户`records`：

```
use $external
db.createUser(
    {
      user: "reporting",
      roles: [
         { role: "read", db: "records" }
      ]
    }
)
```

> 提示:
>
> **也可以看看：**
>
> 有关为 MongoDB 部署设置 LDAP 身份验证的更多信息，请参阅以下教程：
>
> - [通过 ActiveDirectory 使用 SASL 和 LDAP 进行身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-ldap-sasl-activedirectory/)
> - [通过 OpenLDAP 使用 SASL 和 LDAP 进行身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-ldap-sasl-openldap/)

### x.509 客户端证书身份验证

使用外部身份验证机制（例如 x.509 客户端证书身份验证）对 MongoDB 进行身份验证的用户必须在数据库中创建`$external` ，这允许[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)或[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 参考外部源进行身份验证。

要对身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[客户端会话和因果一致性保证](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)，`$external`用户名不能超过 10k 字节。

对于 x.509 客户端证书身份验证，您必须添加来自客户端证书的值`subject`作为 MongoDB 用户。每个唯一的 x.509 客户端证书对应一个 MongoDB 用户。您不需要指定密码。

以下操作添加 `CN=myName,OU=myOrgUnit,O=myOrg,L=myLocality,ST=myState,C=myCountry` 对数据库具有只读访问权限的客户端证书主题用户`records`。

```
use $external
db.createUser(
    {
      user: "CN=myName,OU=myOrgUnit,O=myOrg,L=myLocality,ST=myState,C=myCountry",
      roles: [
         { role: "read", db: "records" }
      ]
    }
)
```

> 提示:
>
> **也可以看看：**
>
> 有关为 MongoDB 部署设置 x.509 客户端证书身份验证的更多信息，请参阅以下教程：
>
> - [使用 x.509 证书对客户端进行身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-x509-client-authentication/)

## 下一步

要管理用户、分配角色和创建自定义角色，请参阅 [管理用户和角色。](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/)









翻译：韩鹏帅

原文：[Create a User](https://www.mongodb.com/docs/manual/tutorial/create-users/)