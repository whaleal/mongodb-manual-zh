# system.roles Collection

# system.roles 集合

On this page

- [`system.roles` Schema](https://docs.mongodb.com/manual/reference/system-roles-collection/#system-roles-schema)
- [`system.roles` 集合的Schema](https://docs.mongodb.com/manual/reference/system-roles-collection/#system-roles-schema)
- [Examples](https://docs.mongodb.com/manual/reference/system-roles-collection/#examples)
- [例子](https://docs.mongodb.com/manual/reference/system-roles-collection/#examples)

The `system.roles` collection in the `admin` database stores the user-defined roles. To create and manage these user-defined roles, MongoDB provides [role management commands](https://docs.mongodb.com/manual/reference/command/#role-management-commands).

admin数据库中的`system.roles`集合存储用户定义的角色。为了创建和管理这些用户自定义角色，MongoDB提供了[角色管理命令](https://docs.mongodb.com/manual/reference/command/#role-management-commands)。 

## system.roles Schema

## system.roles 集合的Schema

The documents in the `system.roles` collection have the following schema:

`system.roles`集合中的文档具有以下的schema：

copy

```
{
  _id: <system-defined id>,
  role: "<role name>",
  db: "<database>",
  privileges:
      [
          {
              resource: { <resource> },
              actions: [ "<action>", ... ]
          },
          ...
      ],
  roles:
      [
          { role: "<role name>", db: "<database>" },
          ...
      ]
}
```

A `system.roles` document has the following fields:

一个`system.roles`文档具有以下字段：

- `admin.system.roles.``role`

  The [`role`](https://docs.mongodb.com/manual/reference/system-roles-collection/#admin.system.roles.role) field is a string that specifies the name of the role.

  该[`role`](https://docs.mongodb.com/manual/reference/system-roles-collection/#admin.system.roles.role)字段是一个字符串，用于指定角色的名称。

- `admin.system.roles.``db`

  The [`db`](https://docs.mongodb.com/manual/reference/system-roles-collection/#admin.system.roles.db) field is a string that specifies the database to which the role belongs. MongoDB uniquely identifies each role by the pairing of its name (i.e. [`role`](https://docs.mongodb.com/manual/reference/system-roles-collection/#admin.system.roles.role)) and its database.

  该[`db`](https://docs.mongodb.com/manual/reference/system-roles-collection/#admin.system.roles.db)字段是一个字符串，用于指定角色所属的数据库。MongoDB通过名称（即[`role`](https://docs.mongodb.com/manual/reference/system-roles-collection/#admin.system.roles.role)）及其数据库的配对来唯一标识每个角色 。

- `admin.system.roles.``privileges`

  The [`privileges`](https://docs.mongodb.com/manual/reference/system-roles-collection/#admin.system.roles.privileges) array contains the privilege documents that define the [privileges](https://docs.mongodb.com/manual/core/authorization/#privileges) for the role.

  该[`privileges`](https://docs.mongodb.com/manual/reference/system-roles-collection/#admin.system.roles.privileges)数组包含权限文件，这些文件定义了角色的[权限](https://docs.mongodb.com/manual/core/authorization/#privileges)。

  A privilege document has the following syntax:

  权限文档具有以下语法：

  copy

  ```json
  {
    resource: { <resource> },
    actions: [ "<action>", ... ]
  }
  ```

  

  `Each privilege document has the following fields:`

  每个权限文档具有以下字段：

  admin.system.roles.privileges[n].`resource`

  A document that specifies the resources on which the privilege [`actions`](https://docs.mongodb.com/manual/reference/system-roles-collection/#admin.system.roles.privileges[n].actions) apply.

  一个文档，该文档指定权限[操作](https://docs.mongodb.com/manual/reference/system-roles-collection/#admin.system.roles.privileges[n].actions)所应用的资源。

   The document has one of the following form:

  该文档具有以下格式之一：

  copy

  ```json
  { db: <database>, collection: <collection> }
  ```

  or

  或者

  ```json
  { cluster : true }
  ```

  

  See [Resource Document](https://docs.mongodb.com/manual/reference/resource-document/#resource-document) for more details.

  有关更多详细信息，请阅读[资源文档](https://docs.mongodb.com/manual/reference/resource-document/#resource-document)。

  `admin.system.roles.privileges[n].actions`

  An array of actions permitted on the resource. For a list of actions, see [Privilege Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#security-user-actions).

  资源上允许的一系列操作， 有关操作列表，请参阅[权限操作](https://docs.mongodb.com/manual/reference/privilege-actions/#security-user-actions)

- `admin.system.roles.roles`

  The [`roles`](https://docs.mongodb.com/manual/reference/system-roles-collection/#admin.system.roles.roles) array contains role documents that specify the roles from which this role [inherits](https://docs.mongodb.com/manual/core/authorization/#inheritance) privileges.

  该[`roles`](https://docs.mongodb.com/manual/reference/system-roles-collection/#admin.system.roles.roles)数组包含角色文档，这些角色文档指定了该角色从中[继承](https://docs.mongodb.com/manual/core/authorization/#inheritance)权限的角色。

  A role document has the following syntax:

  角色文档具有以下语法：

  copy

  ```json
  { role: "<role name>", db: "<database>" }
  ```

  A role document has the following fields:

  角色文档具有以下字段：

  admin.system.roles.roles[n].`role`

  The name of the role. A role can be a [built-in role](https://docs.mongodb.com/manual/reference/built-in-roles/#built-in-roles) provided by MongoDB or a [user-defined role](https://docs.mongodb.com/manual/core/security-user-defined-roles/#user-defined-roles).

  角色名称。角色可以是 MongoDB 提供的[内置](https://docs.mongodb.com/manual/reference/built-in-roles/#built-in-roles)角色，也可以是[用户定义的角色](https://docs.mongodb.com/manual/core/security-user-defined-roles/#user-defined-roles)。

  `admin.system.roles.roles[n].`db`

  The name of the database where the role is defined.

  定义角色的数据库的名称。

## Examples

## 案例

Consider the following sample documents found in `system.roles` collection of the `admin` database.

考虑以下在admin 数据库的 system.roles 中发现的示例文档

### A User-Defined Role Specifies Privileges

### 用户自定义的角色指定权限

The following is a sample document for a user-defined role `appUser` defined for the `myApp` database:

以下是为 myApp 数据库定义的自定义用户 appUser 的示例文档

copy

```
{
  _id: "myApp.appUser",
  role: "appUser",
  db: "myApp",
  privileges: [
       { resource: { db: "myApp" , collection: "" },
         actions: [ "find", "createCollection", "dbStats", "collStats" ] },
       { resource: { db: "myApp", collection: "logs" },
         actions: [ "insert" ] },
       { resource: { db: "myApp", collection: "data" },
         actions: [ "insert", "update", "remove", "compact" ] },
       { resource: { db: "myApp", collection: "system.js" },
         actions: [ "find" ] },
  ],
  roles: []
}
```

The `privileges` array lists the five privileges that the `appUser` role specifies:

privileges数组列出了appUser角色指定的五个权限

- The first privilege permits its actions ( `"find"`, `"createCollection"`, `"dbStats"`, `"collStats"`) on all the collections in the `myApp` database *excluding* its system collections. See [Specify a Database as Resource](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-db).
- 第一个权限允许对 myApp 数据库中除 system 集合以外所有集合执行("find"`, `"createCollection"`, `"dbStats"`, `"collStats"`) 操作， 详见 [将数据库指定为操作资源](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-db).
- The next two privileges permits *additional* actions on specific collections, `logs` and `data`, in the `myApp` database. See [Specify a Collection of a Database as Resource](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-db-collection).
- 后面的两个权限允许对 myApp 数据库中指定的集合 logs 和 data 上执行额外的操作，详见 [指定数据库中的集合作为操作资源](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-db-collection).
- The last privilege permits actions on one [system collections](https://docs.mongodb.com/manual/reference/system-collections/) in the `myApp` database. While the first privilege gives database-wide permission for the `find` action, the action does not apply to `myApp`’s system collections. To give access to a system collection, a privilege must explicitly specify the collection. See [Resource Document](https://docs.mongodb.com/manual/reference/resource-document/).
- 最后一个权限允许在 myApp 数据库的 [system 集合](https://docs.mongodb.com/manual/reference/system-collections/) 上操作。虽然第一个权限为查找操作授予了数据库范围，但是不能在 myApp 数据库的 system 集合上操作。为了授予访问 system 集合的权限，权限必须显示指定需要操作的集合。详见[操作资源文档](https://docs.mongodb.com/manual/reference/resource-document/).

As indicated by the empty `roles` array, `appUser` inherits no additional privileges from other roles.

空的roles数组指定 appUser 没有从其他角色继承权限。

### User-Defined Role Inherits from Other Roles

### 用户自定义的角色继承其他角色权限

The following is a sample document for a user-defined role `appAdmin` defined for the `myApp` database: The document shows that the `appAdmin` role specifies privileges as well as inherits privileges from other roles:

以下示例文档为 myApp 数据库定义了用户自定义角色 appAdmin ：文档显示 appAdmin 角色指定了权限，也从其他角色继承了权限。

copy

```
{
  _id: "myApp.appAdmin",
  role: "appAdmin",
  db: "myApp",
  privileges: [
      {
         resource: { db: "myApp", collection: "" },
         actions: [ "insert", "dbStats", "collStats", "compact" ]
      }
  ],
  roles: [
      { role: "appUser", db: "myApp" }
  ]
}
```

The `privileges` array lists the privileges that the `appAdmin` role specifies. This role has a single privilege that permits its actions ( `"insert"`, `"dbStats"`, `"collStats"`, `"compact"`) on all the collections in the `myApp` database *excluding* its system collections. See [Specify a Database as Resource](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-db).

privileges 数组列举了 appAdmin 角色指定的权限，这个角色有一个权限，允许在除 system 集合外的所有集合上执行 ( `"insert"`, `"dbStats"`, `"collStats"`, `"compact"`)操作。详见[执行数据库作为操作资源](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-db).

The `roles` array lists the roles, identified by the role names and databases, from which the role `appAdmin` inherits privileges.

roles数组列出了由角色名称和数据库标识的角色，角色 appAdmin 从中继承权限。


原文链接：[https://docs.mongodb.com/manual/reference/system-roles-collection/](https://docs.mongodb.com/manual/reference/system-roles-collection/)

译者：谢伟成
