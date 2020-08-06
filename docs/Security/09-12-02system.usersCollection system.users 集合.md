# system.users  Collection[¶](https://docs.mongodb.com/manual/reference/system-users-collection/#system-users-collection)

# system.users 集合

On this page

- [`system.users` Schema](https://docs.mongodb.com/manual/reference/system-users-collection/#system-users-schema)
- [system.users 集合的Schema](https://docs.mongodb.com/manual/reference/system-users-collection/#system-users-schema)
- [Example](https://docs.mongodb.com/manual/reference/system-users-collection/#example)
- [例子](https://docs.mongodb.com/manual/reference/system-users-collection/#example)

The `system.users` collection in the `admin` database stores user [authentication](https://docs.mongodb.com/manual/core/authentication/#authentication) and [authorization](https://docs.mongodb.com/manual/core/authorization/#authorization) information. To manage data in this collection, MongoDB provides [user management commands](https://docs.mongodb.com/manual/reference/command/#user-management-commands).

system.users 集合在 admin 数据库中，保存了用户[身份验证](https://docs.mongodb.com/manual/core/authentication/#authentication)和[授权](https://docs.mongodb.com/manual/core/authorization/#authorization)的信息。为了管理这个集合的数据，MongoDB 提供了用户管理指令。

## system.users Schema

## system.users 集合的Schema

The documents in the `system.users` collection have the following schema:

system.users 集合中的文档具有以下的 schema：

copy

```
{
  _id: <system defined id>,
  userId : <system assigned UUID>,  // Starting in MongoDB 4.0.9
  user: "<name>",
  db: "<database>",
  credentials: { <authentication credentials> },
  roles: [
           { role: "<role name>", db: "<database>" },
           ...
         ],
  customData: <custom information>,
  authenticationRestrictions : [ <documents> ] // Starting in MongoDB 4.0
 }
```

Each `system.users` document has the following fields:

每个 system.users 文档都有以下字段： 

- `admin.system.users.``userId`

  A unique identifier for the user assigned to the user upon creation.[`userId`](https://docs.mongodb.com/manual/reference/system-users-collection/#admin.system.users.userId) is available for users [`created`](https://docs.mongodb.com/manual/reference/method/db.createUser/#db.createUser) in MongoDB 4.0.9 and later.*New in version 4.0.9.*

  创建时分配给用户的唯一标识符。[userId](https://docs.mongodb.com/manual/reference/system-users-collection/#admin.system.users.userId) 适用于在MongoDB 4.0.9 及更高的版本[创建](https://docs.mongodb.com/manual/reference/method/db.createUser/#db.createUser)的用户

- `admin.system.users.``user`

  The user name. A user exists in the context of a single logical database (see [`admin.system.users.db`](https://docs.mongodb.com/manual/reference/system-users-collection/#admin.system.users.db)) but can have access on other databases through roles specified in the [`roles`](https://docs.mongodb.com/manual/reference/system-users-collection/#admin.system.users.roles) array.

  用户名。用户位于单个逻辑数据库的上下文中(请参考资料[`admin.system.users.db)`](https://docs.mongodb.com/manual/reference/system-users-collection/#admin.system.users.db)，但可以通过[`roles`](https://docs.mongodb.com/manual/reference/system-users-collection/#admin.system.users.roles)组中指定的角色访问其他数据库。 

- `admin.system.users.``db`

  The [authentication database](https://docs.mongodb.com/manual/core/security-users/#authentication-database) associated with the user. The user’s privileges are not necessarily limited to this database. The user can have privileges in additional databases through the [`roles`](https://docs.mongodb.com/manual/reference/system-users-collection/#admin.system.users.roles) array.

  与用户关联的[身份验证数据库](https://docs.mongodb.com/manual/core/security-users/#authentication-database)。用户的权限不一定限于此数据库。用户可以通过该[`roles`](https://docs.mongodb.com/manual/reference/system-users-collection/#admin.system.users.roles)组在其他数据库中拥有特权。

- `admin.system.users.``credentials`

  User’s authentication information. For users with externally stored authentication credentials, such as users that use [Kerberos](https://docs.mongodb.com/manual/tutorial/control-access-to-mongodb-with-kerberos-authentication/) or x.509 certificates for authentication, the `system.users` document for that user does not contain the [`credentials`](https://docs.mongodb.com/manual/reference/system-users-collection/#admin.system.users.credentials) field. For [SCRAM](https://docs.mongodb.com/manual/core/security-scram/#authentication-scram) user credentials, the information includes the mechanism, iteration count, and authentication parameters.SEE ALSO[`scramSHA256IterationCount`](https://docs.mongodb.com/manual/reference/parameters/#param.scramSHA256IterationCount)[`scramIterationCount`](https://docs.mongodb.com/manual/reference/parameters/#param.scramIterationCount)

  用户的身份验证信息。对于具有外部存储的身份验证凭据的用户，例如使用 [Kerberos](https://docs.mongodb.com/manual/tutorial/control-access-to-mongodb-with-kerberos-authentication/) 或x.509证书进行身份验证的`system.users` 用户，该用户的文档不包含该 [`credentials`](https://docs.mongodb.com/manual/reference/system-users-collection/#admin.system.users.credentials)字段。对于 [SCRAM](https://docs.mongodb.com/manual/core/security-scram/#authentication-scram)用户凭据，该信息包括机制，迭代计数和身份验证参数。

  也可以看看

  - [`scramSHA256IterationCount`](https://docs.mongodb.com/manual/reference/parameters/#param.scramSHA256IterationCount)
  - [`scramIterationCount`](https://docs.mongodb.com/manual/reference/parameters/#param.scramIterationCount)

- `admin.system.users.``roles`

  An array of roles granted to the user. The array contains both [built-in roles](https://docs.mongodb.com/manual/reference/built-in-roles/#built-in-roles) and [user-defined role](https://docs.mongodb.com/manual/core/security-user-defined-roles/#user-defined-roles).

 授予用户的一系列角色。该组包含 [内置角色](https://docs.mongodb.com/manual/reference/built-in-roles/#built-in-roles)和[用户定义角色](https://docs.mongodb.com/manual/core/security-user-defined-roles/#user-defined-roles)。

  A role document has the following syntax:

  角色文档具有以下语法：

  copy

  ```js
  { role: "<role name>", db: "<database>" }
  ```

   A role document has the following fields:

  角色文档有以下字段

  `admin.system.users.roles[n].``role

  ​           The name of a role. A role can be a [built-in role](https://docs.mongodb.com/manual/reference/built-in-roles/#built-in-roles) provided by MongoDB or a [custom user-defined role](https://docs.mongodb.com/manual/core/security-user-defined-roles/#user-defined-roles).

  ​           角色名称。角色可以是 MongoDB 提供的[内置](https://docs.mongodb.com/manual/reference/built-in-roles/#built-in-roles)角色，也可以是[用户自定义角色](https://docs.mongodb.com/manual/core/security-user-defined-roles/#user-defined-roles)。

  `admin.system.users.roles[n].``db`

  ​           The name of the database where role is defined.

  ​          定义角色的数据库的名称。

  When specifying a role using the [role management](https://docs.mongodb.com/manual/reference/command/#role-management-commands) or [user management](https://docs.mongodb.com/manual/reference/command/#user-management-commands) commands, you can specify the role name alone (e.g. `"readWrite"`) if the role that exists on the database on which the command is run.

  使用[角色管理](https://docs.mongodb.com/manual/reference/command/#role-management-commands)或[用户管理](https://docs.mongodb.com/manual/reference/command/#user-management-commands)命令指定`"readWrite"`角色时，如果运行命令的数据库中存在该角色，则可以单独指定角色名称（例如“ readWrite”）。

- `admin.system.users.``customData`

  Optional custom information about the user.

  有关用户的可选自定义信息。

- `admin.system.users.``authenticationRestrictions`

  An array of authentication restrictions the server enforces for the user. The array containsa list of IP addresses and CIDR ranges from which the user is allowed to connect to the server or from which the server can accept users.*New in version 4.0.*
  
  服务器为用户强制执行的一系列身份验证限制。该数组包含 IP 地址和 CIDR 范围的列表，允许用户从中连接到服务器或服务器可以从中接受用户。
  
  版本4.0中的新功能。

## Example

Consider the following document in the `system.users` collection:

考虑`system.users`集合中的以下文档：

copy

```
{
   "_id" : "home.Kari",
   "userId" : UUID("ec1eced7-055a-4ca8-8737-60dd02c52793"),  // Available starting in MongoDB 4.0.9
   "user" : "Kari",
   "db" : "home",
   "credentials" : {
      "SCRAM-SHA-1" : {
         "iterationCount" : 10000,
         "salt" : "S/xM2yXFosynbCu4GzFDgQ==",
         "storedKey" : "Ist4cgpEd1vTbnRnQLdobgmOsBA=",
         "serverKey" : "e/0DyzS6GPboAA2YNBkGYm87+cg="
      },
      "SCRAM-SHA-256" : {
         "iterationCount" : 15000,
         "salt" : "p1G+fZadAeYAbECN8F/6TMzXGYWBaZ3DtWM0ig==",
         "storedKey" : "LEgLOqZQmkGhd0owm/+6V7VdJUYJcXBhPUvi9z+GBfk=",
         "serverKey" : "JKfnkVv9iXwxyc8JaapKVwLPy6SfnmB8gMb1Pr15T+s="
      }
   },
   "authenticationRestrictions" : [                           // Available starting in MongoDB 4.0
      { "clientSource" : [ "69.89.31.226" ], "serverAddress" : [ "172.16.254.1" ] }
   ],
   "customData" : {
      "zipCode" : "64157"
   },
   "roles" : [
      {
         "role" : "read",
         "db" : "home"
      },
      {
         "role" : "readWrite",
         "db" : "test"
      }
   ]
}
```

The document shows that a user `Kari`’s authentication database is the `home` database. `Kari` has the [`read`](https://docs.mongodb.com/manual/reference/built-in-roles/#read) role in the `home` database, the [`readWrite`](https://docs.mongodb.com/manual/reference/built-in-roles/#readWrite) role in the `test` database.

该文档显示用户`Kari`的身份验证数据库是 home`数据库。在数据库中`Kari 具有 [read](https://docs.mongodb.com/manual/reference/built-in-roles/#read) 角色，在 test 数据库中具有[`readWrite`](https://docs.mongodb.com/manual/reference/built-in-roles/#readWrite)角色 。


原文链接：[https://docs.mongodb.com/manual/reference/system-users-collection/](https://docs.mongodb.com/manual/reference/system-users-collection/)

译者：谢伟成
