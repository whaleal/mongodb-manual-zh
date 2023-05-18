# 管理用户和角色

## 概述

本教程提供了 MongoDB 授权模型下的用户和角色管理示例。[创建用户](https://www.mongodb.com/docs/manual/tutorial/create-users/)描述了如何将新用户添加到 MongoDB。

## 先决条件

> 重要的:
>
> 如果您已为部署[启用访问控制，则必须以具有每个部分中指定的所需权限的用户身份进行身份验证。](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)具有特定数据库中的[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)角色或角色的用户管理员 提供执行本教程中列出的操作所需的权限。有关将用户管理员添加为第一个用户的详细信息，[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)请参阅 [启用访问控制](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)

## 创建用户定义的角色

角色授予用户访问 MongoDB 资源的权限。MongoDB 提供了许多[内置角色](https://www.mongodb.com/docs/manual/reference/built-in-roles/)，管理员可以使用这些角色来控制对 MongoDB 系统的访问。但是，如果这些角色无法描述所需的权限集，您可以在特定数据库中创建新角色。

除了在`admin`数据库中创建的角色外，角色只能包含适用于其数据库的特权，并且只能从其数据库中的其他角色继承。

在数据库中创建的角色`admin`可以包括适用于`admin`数据库、其他数据库或 [集群](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-cluster)资源的特权，并且可以从其他数据库和`admin`数据库中的角色继承。

要创建新角色，请使用[`db.createRole()`](https://www.mongodb.com/docs/manual/reference/method/db.createRole/#mongodb-method-db.createRole)方法，指定数组中的权限`privileges`和数组中的继承角色`roles`。

MongoDB 使用数据库名称和角色名称的组合来唯一定义一个角色。每个角色都限定在您创建角色的数据库中，但 MongoDB 将所有角色信息存储在 数据库[`admin.system.roles`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data-admin.system.roles)中的集合中`admin`。

### 先决条件

要在数据库中创建角色，您必须具有：

- 对该[数据库资源](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-specific-db)[的](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)操作[。](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-specific-db)[`createRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createRole)
- 对该数据库的操作[，](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)以指定新角色的权限以及指定要继承的角色。[`grantRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-grantRole)

内置角色[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)和 对各自[资源的](https://www.mongodb.com/docs/manual/reference/resource-document/)[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)提供[`createRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createRole)和 操作[。](https://www.mongodb.com/docs/manual/reference/resource-document/)[`grantRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-grantRole)

要创建指定的角色`authenticationRestrictions`，您必须对创建 该角色的[数据库资源具有](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-specific-db)[操作权限。](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)[`setAuthenticationRestriction`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-setAuthenticationRestriction)

### 创建一个角色来管理当前操作

以下示例创建一个名为的角色`manageOpRole`，该角色仅提供运行 和 的[`db.currentOp()`](https://www.mongodb.com/docs/manual/reference/method/db.currentOp/#mongodb-method-db.currentOp)权限 [`db.killOp()`](https://www.mongodb.com/docs/manual/reference/method/db.killOp/#mongodb-method-db.killOp)。[[ 1 \]](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/#footnote-built-in-roles1)

> 笔记:
>
> 从 MongoDB 3.2.9 开始，用户不需要任何特定权限即可查看或终止他们自己对[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例的操作。有关详细信息，请参阅[`db.currentOp()`](https://www.mongodb.com/docs/manual/reference/method/db.currentOp/#mongodb-method-db.currentOp)和[`db.killOp()`](https://www.mongodb.com/docs/manual/reference/method/db.killOp/#mongodb-method-db.killOp)。

1. 使用适当的权限连接到 MongoDB。

   连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用指定的权限[先决条件](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/#std-label-define-roles-prereq)部分。

   以下过程使用`myUserAdmin`在 [启用访问控制中创建的。](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)

   ```
   mongosh --port 27017 -u myUserAdmin -p 'abc123' --authenticationDatabase 'admin'
   ```

   有权在 以及其他数据库`myUserAdmin`中创建角色。`admin`

2. 创建一个新角色来管理当前操作。

   `manageOpRole`具有作用于多个数据库以及[集群资源](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-cluster)的特权。因此，您必须在`admin`数据库中创建角色。

   ```
   use admin
   db.createRole(
      {
        role: "manageOpRole", 
        privileges: [
          { resource: { cluster: true }, actions: [ "killop", "inprog" ] },
          { resource: { db: "", collection: "" }, actions: [ "killCursors" ] }
        ],
        roles: []
      }
   )
   ```

   新角色授予终止任何操作的权限。

   > 警告:
   >
   > 终止正在运行的操作时要格外小心。仅使用[`db.killOp()`](https://www.mongodb.com/docs/manual/reference/method/db.killOp/#mongodb-method-db.killOp)方法或[`killOp`](https://www.mongodb.com/docs/manual/reference/command/killOp/#mongodb-dbcommand-dbcmd.killOp)命令终止客户端发起的操作，*不要*终止内部数据库操作。

内置角色[`clusterMonitor`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterMonitor)还提供与其他权限一起运行的权限[`db.currentOp()`](https://www.mongodb.com/docs/manual/reference/method/db.currentOp/#mongodb-method-db.currentOp)，内置角色提供与其他权限一起[`hostManager`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-hostManager)运行的权限。[`db.killOp()`](https://www.mongodb.com/docs/manual/reference/method/db.killOp/#mongodb-method-db.killOp)

### 创建要运行的角色`mongostat`

以下示例创建一个名为的角色`mongostatRole`，该角色仅提供运行权限[`mongostat`](https://www.mongodb.com/docs/database-tools/mongostat/#mongodb-binary-bin.mongostat)

1. 使用适当的权限连接到 MongoDB。

   连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用指定的权限[先决条件](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/#std-label-define-roles-prereq)部分。

   以下过程使用`myUserAdmin`在 [启用访问控制中创建的。](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)

   ```
   mongosh --port 27017 -u myUserAdmin -p 'abc123' --authenticationDatabase 'admin'
   ```

   有权在 以及其他数据库`myUserAdmin`中创建角色。`admin`

2. 创建一个新角色来管理当前操作。

   `mongostatRole`具有作用于[集群资源的](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-cluster)特权。因此，您必须在`admin`数据库中创建角色。

   ```
   use admin
   db.createRole(
      {
        role: "mongostatRole", 
        privileges: [
          { resource: { cluster: true }, actions: [ "serverStatus" ] }
        ],
        roles: []
      }
   )
   ```

    内置角色 [`clusterMonitor`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterMonitor)还提供运行权限 [`mongostat`](https://www.mongodb.com/docs/database-tools/mongostat/#mongodb-binary-bin.mongostat)连同其他特权。

### 创建角色`system.views`以跨数据库删除集合

以下示例创建一个名为的角色 `dropSystemViewsAnyDatabase`，该角色提供在任何数据库中删除集合的权限 `system.views`。

1. 使用适当的权限连接到 MongoDB。

   连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用指定的权限[先决条件](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/#std-label-define-roles-prereq)部分。

   以下过程使用`myUserAdmin`在 [启用访问控制中创建的。](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)

   ```
   mongosh --port 27017 -u myUserAdmin -p 'abc123' --authenticationDatabase 'admin'
   ```

   有权在 以及其他数据库`myUserAdmin`中创建角色。`admin`

2. 创建一个新角色以将`system.views`集合删除到任何数据库中。

   对于角色，指定一个[特权](https://www.mongodb.com/docs/manual/core/authorization/#std-label-privileges)，包括：

   * 一个`actions`包含 [`dropCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropCollection)动作的数组，以及
   * 为数据库 指定空字符串 ( ) 并为集合指定字符串的[资源文档](https://www.mongodb.com/docs/manual/reference/resource-document/)。有关详细信息，请参阅 [将跨数据库的集合指定为资源。](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-specific-collection)`""``"system.views"`

   ```
   use admin
   db.createRole(
      {
        role: "dropSystemViewsAnyDatabase", 
        privileges: [
          {
            actions: [ "dropCollection" ],
            resource: { db: "", collection: "system.views" }
          }
        ],
        roles: []
      }
   )
   ```

## 修改现有用户的访问权限

### 先决条件

- 您必须对数据库[执行操作才能授予对该数据库的角色。](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)[`grantRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-grantRole)
- 您必须对数据库执行[操作才能撤销对该数据库的角色。](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)[`revokeRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-revokeRole)
- 要查看角色的信息，您必须被明确授予该角色，或者必须对该角色的数据库执行[操作。](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)[`viewRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-viewRole)

### 程序

1. 使用适当的权限连接到 MongoDB。

   连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)作为具有先决条件部分中指定权限的用户。

   以下过程使用`myUserAdmin`在 [启用访问控制中创建的。](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)

   ```
   mongosh --port 27017 -u myUserAdmin -p 'abc123' --authenticationDatabase 'admin'
   ```

2. 确定用户的角色和权限。

   要显示要修改的用户的角色和权限，请使用 [`db.getUser()`](https://www.mongodb.com/docs/manual/reference/method/db.getUser/#mongodb-method-db.getUser)和[`db.getRole()`](https://www.mongodb.com/docs/manual/reference/method/db.getRole/#mongodb-method-db.getRole)方法。

   例如，要查看`reportsUser`在 [附加示例](https://www.mongodb.com/docs/manual/tutorial/create-users/#std-label-add-new-user)中创建的角色，请发出：

   ```
   use reporting
   db.getUser("reportsUser")
   ```

   要显示角色授予用户的数据库权限 `readWrite`，`"accounts"`请发出：

   ```
   use accounts
   db.getRole( "readWrite", { showPrivileges: true } )
   ```

3. 确定授予或撤销的权限。

   如果用户需要额外的权限，则向用户授予一个或多个具有所需权限集的角色。如果不存在这样的角色，[创建一个新角色](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/#std-label-create-user-defined-role) 具有适当的权限集。

   要撤销现有角色提供的部分特权：撤销原始角色并授予仅包含所需特权的角色。你可能需要[创建一个新角色](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/#std-label-create-user-defined-role)如果角色不存在。

4. 修改用户的访问权限。

   撤销角色

   使用方法撤销角色[`db.revokeRolesFromUser()`](https://www.mongodb.com/docs/manual/reference/method/db.revokeRolesFromUser/#mongodb-method-db.revokeRolesFromUser)。以下示例操作从数据库[`readWrite`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWrite) 中删除角色：`accounts``reportsUser`

   ```
   use reporting
   db.revokeRolesFromUser(
       "reportsUser",
       [
         { role: "readWrite", db: "accounts" }
       ]
   )
   ```

   ##### 授予角色

   使用方法授予角色[`db.grantRolesToUser()`](https://www.mongodb.com/docs/manual/reference/method/db.grantRolesToUser/#mongodb-method-db.grantRolesToUser) 。例如，以下操作授予 `reportsUser`用户[`read`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-read)对 `accounts`数据库的角色：

   ```
   use reporting
   db.grantRolesToUser(
       "reportsUser",
       [
         { role: "read", db: "accounts" }
       ]
   )
   ```

   对于分片集群，对用户的更改在 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)命令运行时即时发生。但是，对于 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)集群中的其他实例，用户缓存最多可能需要等待 10 分钟才能刷新。看 [`userCacheInvalidationIntervalSecs`。](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.userCacheInvalidationIntervalSecs)

## 修改现有用户的密码

### 先决条件

要修改数据库上另一个用户的密码，您必须 对该数据库执行[操作。](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)[`changePassword`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-changePassword)

### 程序

1. 使用适当的权限连接到 MongoDB。

   连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用指定的权限[先决条件](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/#std-label-change-password-prereq)部分。

   以下过程使用`myUserAdmin`在 [启用访问控制中创建的。](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)

   ```
   mongosh --port 27017 -u myUserAdmin -p 'abc123' --authenticationDatabase 'admin'
   ```

2. 更改密码

   将用户的用户名和新密码传递给该 [`db.changeUserPassword()`](https://www.mongodb.com/docs/manual/reference/method/db.changeUserPassword/#mongodb-method-db.changeUserPassword)方法。

   以下操作将`reporting`用户的密码更改为 `SOh3TbYhxuLiW8ypJPxmt1oOfL`：

   ```shell
   db.changeUserPassword("reporting", "SOh3TbYhxuLiW8ypJPxmt1oOfL")
   ```

> 提示:
>
> **也可以看看：**
>
> [更改您的密码和自定义数据](https://www.mongodb.com/docs/manual/tutorial/change-own-password-and-custom-data/)

## 查看用户的角色

### 先决条件

要查看其他用户的信息，您必须对其他用户的数据库执行 [viewUser](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-viewUser) 操作

用户可以查看自己的信息。

### 程序

1. 使用适当的权限连接到 MongoDB。

   连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)作为具有先决条件部分中指定权限的用户。

   以下过程使用`myUserAdmin`在 [启用访问控制中创建的。](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)

   ```
   mongosh --port 27017 -u myUserAdmin -p 'abc123' --authenticationDatabase 'admin'
   ```

2. 确定用户的角色

   使用[`usersInfo`](https://www.mongodb.com/docs/manual/reference/command/usersInfo/#mongodb-dbcommand-dbcmd.usersInfo)命令或[`db.getUser()`](https://www.mongodb.com/docs/manual/reference/method/db.getUser/#mongodb-method-db.getUser)方法显示用户信息。

   例如，要查看`reportsUser`在 [附加示例](https://www.mongodb.com/docs/manual/tutorial/create-users/#std-label-add-new-user)中创建的角色，请发出：

   ```
   use reporting
   db.getUser("reportsUser")
   ```

   在返回的文档中，该[`roles`](https://www.mongodb.com/docs/manual/reference/system-users-collection/#mongodb-data-admin.system.users.roles) 字段显示所有角色`reportsUser`：

   ```
   ...
   "roles" : [
      { "role" : "readWrite", "db" : "accounts" },
      { "role" : "read", "db" : "reporting" },
      { "role" : "read", "db" : "products" },
      { "role" : "read", "db" : "sales" }
   ]
   ```

## 查看角色的权限

### 先决条件

要查看角色的信息，您必须被明确授予该角色，或者必须对该角色的数据库执行[操作。](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)[`viewRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-viewRole)

### 程序

1. 使用适当的权限连接到 MongoDB

   连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)作为具有先决条件部分中指定权限的用户。

   以下过程使用`myUserAdmin`在 [启用访问控制中创建的。](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)

   ```
   mongosh --port 27017 -u myUserAdmin -p 'abc123' --authenticationDatabase 'admin'
   ```

2. 确定角色授予的特权。

   对于给定的角色，使用带有以下选项的[`db.getRole()`](https://www.mongodb.com/docs/manual/reference/method/db.getRole/#mongodb-method-db.getRole)方法或 命令：[`rolesInfo`](https://www.mongodb.com/docs/manual/reference/command/rolesInfo/#mongodb-dbcommand-dbcmd.rolesInfo)`showPrivileges`

   例如查看`read`角色对`products`数据库授予的权限，使用如下操作，发出：

   ```
   use products
   db.getRole( "read", { showPrivileges: true } )
   ```

   在返回的文档中，[`privileges`](https://www.mongodb.com/docs/manual/reference/command/rolesInfo/#mongodb-data-rolesInfo.privileges)和 [`inheritedPrivileges`](https://www.mongodb.com/docs/manual/reference/command/rolesInfo/#mongodb-data-rolesInfo.inheritedPrivileges)数组。列出 [`privileges`](https://www.mongodb.com/docs/manual/reference/command/rolesInfo/#mongodb-data-rolesInfo.privileges)了角色直接指定的权限，不包括从其他角色继承的权限。列出[`inheritedPrivileges`](https://www.mongodb.com/docs/manual/reference/command/rolesInfo/#mongodb-data-rolesInfo.inheritedPrivileges) 了该角色授予的所有权限，包括直接指定的和继承的。如果角色没有继承自其他角色，则这两个字段相同。

   ```shell
   ...
   "privileges" : [
     {
       "resource": { "db" : "products", "collection" : "" },
       "actions": [ "collStats","dbHash","dbStats","find","killCursors","planCacheRead" ]
     },
     {
       "resource" : { "db" : "products", "collection" : "system.js" },
       "actions": [ "collStats","dbHash","dbStats","find","killCursors","planCacheRead" ]
     }
   ],
   "inheritedPrivileges" : [
     {
       "resource": { "db" : "products", "collection" : "" },
       "actions": [ "collStats","dbHash","dbStats","find","killCursors","planCacheRead" ]
     },
     {
       "resource" : { "db" : "products", "collection" : "system.js" },
       "actions": [ "collStats","dbHash","dbStats","find","killCursors","planCacheRead" ]
     }
   ]
   
   ```








译者：韩鹏帅

原文：[Manage Users and Roles](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/)