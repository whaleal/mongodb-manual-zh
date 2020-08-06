# Resource Document

# 资源文档

On this page

- [Database and/or Collection Resource](https://docs.mongodb.com/manual/reference/resource-document/#database-and-or-collection-resource)
- [数据库和/或集合资源](https://docs.mongodb.com/manual/reference/resource-document/#database-and-or-collection-resource)
- [Cluster Resource](https://docs.mongodb.com/manual/reference/resource-document/#cluster-resource)
- [集群资源](https://docs.mongodb.com/manual/reference/resource-document/#cluster-resource)
- [`anyResource`](https://docs.mongodb.com/manual/reference/resource-document/#anyresource)
- [`anyResource`](https://docs.mongodb.com/manual/reference/resource-document/#anyresource)

The resource document specifies the resources upon which a privilege permits `actions`.

资源文档指定了权限所允许操作的资源。

## Database and/or Collection Resource 

## 数据库和/或集合资源

To specify databases and/or collections, use the following syntax:

使用以下语法指定数据库和/或者集合：

copy

```js
{ db: <database>, collection: <collection> }
```



### Specify a Collection of a Database as Resource

### 指定一个数据库中的集合作为操作资源

If the resource document species both the `db` and `collection` fields as non-empty strings, the resource is the specified collection in the specified database. For example, the following document specifies a resource of the `inventory` collection in the `products` database:

如果资源文档同时指定了`db`和`collection`字段为非空字符串，操作资源就是该指定数据库中的指定集合。例如，下面的文档指定了`products`数据库中的`inventory`集合。

copy

```
{ db: "products", collection: "inventory" }
```

For a user-defined role scoped for a non-`admin` database, the resource specification for its privileges must specify the same database as the role. User-defined roles scoped for the `admin` database can specify other databases.

非`admin`数据库范围内的用户自定义角色，为其权限指定操作资源时必须指定与该角色相同的数据库。`admin`数据库范围内定义的角色可以指定其他其他数据库为操作资源。

### Specify a Database as Resource 

### 指定一个数据库为资源

If only the `collection` field is an empty string (`""`), the resource is the specified database, excluding the [system collections](https://docs.mongodb.com/manual/reference/system-collections/). For example, the following resource document specifies the resource of the `test` database, excluding the system collections:

如果仅`collection`字段为空字符串（`""`），操作资源就是该指定的数据库，但`system`集合除外。例如，下面的资源文档指定了操作资源为`test`数据库，但`system`集合除外。

copy

```
{ db: "test", collection: "" }
```

For a user-defined role scoped for a non-`admin` database, the resource specification for its privileges must specify the same database as the role. User-defined roles scoped for the `admin` database can specify other databases.

非`admin`数据库范围内的用户自定义角色，为其权限指定操作资源时必须指定与该角色相同的数据库。`admin`数据库范围内定义的角色可以指定其他数据库为操作资源。

NOTE

When you specify a database as the resource, system collections are excluded, unless you name them explicitly, as in the following:

当你指定一个数据库作为操作资源时，`system`集合是不包括在内的，除非像下面这样明确指定：

copy

```
{ db: "test", collection: "system.js" }
```

System collections include but are not limited to the following:

system集合包括但是不限于以下几项：

- [`.system.profile`](https://docs.mongodb.com/manual/reference/system-collections/#.system.profile)
- [`.system.js`](https://docs.mongodb.com/manual/reference/system-collections/#.system.js)
- [system.users Collection](https://docs.mongodb.com/manual/reference/system-users-collection/) in the `admin` database
- `admin`数据库中的[system.users](https://docs.mongodb.com/manual/reference/system-users-collection/)集合
- [system.roles Collection](https://docs.mongodb.com/manual/reference/system-roles-collection/) in the `admin` database
- `admin`数据库中的[system.roles](https://docs.mongodb.com/manual/reference/system-roles-collection/)集合



### Specify Collections Across Databases as Resource 

### 通过数据库指定集合作为操作资源

If only the `db` field is an empty string (`""`), the resource is all collections with the specified name across all databases. For example, the following document specifies the resource of all the `accounts` collections across all the databases:

如果`db`字段是空字符串（`""`），那么操作资源则是所有数据库中具有指定名称的集合。例如，以下文档指定了所有数据库中`accounts`集合的资源：

copy

```
{ db: "", collection: "accounts" }
```

For user-defined roles, only roles scoped for the `admin` database can have this resource specification for their privileges.

对于用户自定义角色，只有作用于`admin`数据库的角色才能拥有此资源指定的权限。

### Specify All Non-System Collections in All Databases  

### 指定所有数据库中的非 system 集合

If both the `db` and `collection` fields are empty strings (`""`), the resource is all collections, excluding the [system collections](https://docs.mongodb.com/manual/reference/system-collections/), in all the databases:

如果`db`和`collection`两个字段都为空字符串（`""`），那么可操作的资源将是所有数据库中除`system`外的所有集合。

copy

```
{ db: "", collection: "" }
```

For user-defined roles, only roles scoped for the `admin` database can have this resource specification for their privileges.

对于用户自定义角色，只有作用于`admin`数据库的角色才能拥有此资源指定的权限。

## Cluster Resource 

## 集群资源

To specify the cluster as the resource, use the following syntax:

要将群集指定为资源，请使用以下语法：

copy

```
{ cluster : true }
```

Use the `cluster` resource for actions that affect the state of the system rather than act on specific set of databases or collections. Examples of such actions are `shutdown`, `replSetReconfig`, and `addShard`. For example, the following document grants the action `shutdown` on the `cluster`.

使用集群作为 actions 的操作资源，而不是对特定的数据库或集合进行操作，这样的操作会影响系统状态。 此类操作的示例包括“关机”，“ 副本集重新配置”和“添加分片”。 例如，以下文档授予“集群”上的“关机”动作。
`cluster`资源是用来执行那些影响系统状态的操作，而不是用来对特定的数据库或集合执行操作。此类操作的示例包括`shutdown`、`replSetReconfig`和`addShard`。例如，以下文档会将`shutdown`操作赋予`cluster`。

copy

```
{ resource: { cluster : true }, actions: [ "shutdown" ] }
```

For user-defined roles, only roles scoped for the `admin` database can have this resource specification for their privileges.

对于用户自定义角色，只有作用于`admin`数据库的角色才能拥有此资源指定的权限。

## `anyResource`

The internal resource `anyResource` gives access to every resource in the system and is intended for internal use. **Do not** use this resource, other than in exceptional circumstances. The syntax for this resource is `{ anyResource: true }`.

内部资源`anyResource`使我们能访问系统中任何资源，它只供内部使用。除特殊情况外，不要使用这个资源。使用这个资源的语法为`{ anyResource: true }`。


原文链接：[https://docs.mongodb.com/manual/reference/resource-document/](https://docs.mongodb.com/manual/reference/resource-document/)

译者：谢伟成
