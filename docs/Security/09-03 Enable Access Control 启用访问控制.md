### Enable Access Control

### 启用访问控制

On this page

- [Overview](https://docs.mongodb.com/manual/tutorial/enable-authentication/#overview)
- [User Administrator](https://docs.mongodb.com/manual/tutorial/enable-authentication/#user-administrator)
- [Procedure](https://docs.mongodb.com/manual/tutorial/enable-authentication/#procedure)
- [Additional Considerations](https://docs.mongodb.com/manual/tutorial/enable-authentication/#additional-considerations)

在页面上

- 概述
- 用户管理员
- 使用过程
- 其他注意事项

## Overview

## 概述

Enabling access control on a MongoDB deployment enforces authentication, requiring users to identify themselves. When accessing a MongoDB deployment that has access control enabled, users can only perform actions as determined by their roles.

在MongoDB部署时启用访问控制可以加强身份验证，要求用户表明自己的身份。当访问一个在部署时开启了访问控制的MongoDB时，用户只能执行由其角色决定的操作。

The following tutorial enables access control on a standalone [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instance and uses the [default authentication mechanism](https://docs.mongodb.com/manual/core/authentication-mechanisms/#authentication-mechanism-default). For all supported authentication mechanisms, see [Authentication Mechanisms](https://docs.mongodb.com/manual/core/authentication/#available-authentication-mechanisms).

下面的教程在一个独立的mongod实例上启用了访问控制并且使用默认的身份验证机制。对于所有支持的身份验证机制，请参阅身份验证机制。

## User Administrator

## 用户管理员

With access control enabled, ensure you have a user with [`userAdmin`](https://docs.mongodb.com/manual/reference/built-in-roles/#userAdmin) or [`userAdminAnyDatabase`](https://docs.mongodb.com/manual/reference/built-in-roles/#userAdminAnyDatabase) role in the `admin` database. This user can administrate user and roles such as: create users, grant or revoke roles from users, and create or modify customs roles.

启用访问控制时，确认你已经有一个具有userAdmin或者userAdminAnyDatabase角色的用户在admin数据库中。这个用户能管理用户和角色，例如：创建用户、授予或者撤销用户的角色、创建或者修改角色。

## Procedure

## 配置过程

The following procedure first adds a user administrator to a MongoDB instance running without access control and then enables access control.

下面的过程首先将一个管理员用户添加到一个运行时没有开启访问控制的MongoDB实例中，然后启用访问控制。

> Note:
>
> The example MongoDB instance uses [`port 27017`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-port) and the data directory `/var/lib/mongodb` directory . The example assumes the existence of the data directory `/var/lib/mongodb`. Specify a different data directory as appropriate.

> 说明：
>
> 这个示例的MongoDB实例，使用27017端口和/var/lib/mongodb目录作为数据目录。这个示例中假设存在/var/lib/mongodb这个数据目录。可以根据需要指定不同的数据目录。

### 1 Start MongoDB without access control.

### 1 没开启访问控制时启动MongoDB

Start a standalone [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instance without access control.

没开启访问控制时启动独立的mongod实例。

For example, open a terminal and issue the following:

例如，打开终端并发出以下命令：

``` shell
mongod --port 27017 --dbpath /var/lib/mongodb
```

### 2 Connect to the instance.

### 2 连接这个实例

For example, open a new terminal and connect a [`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo) shell to the instance:

例如，打开一个新的终端并且使用mongo shell连接到mongod实例：

```shell
mongo --port
```

Specify additional command line options as appropriate to connect the [`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo) shell to your deployment, such as `--host`.

适当地指定其他的命令行选项，将mongo shell 连接到你部署的mongod 实例，诸如 --host。

### 3 Create the user administrator.

### 3 创建一个用户管理员

From the [`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo) shell, add a user with the [`userAdminAnyDatabase`](https://docs.mongodb.com/manual/reference/built-in-roles/#userAdminAnyDatabase) role in the `admin` database. Include additional roles as needed for this user. For example, the following creates the user `myUserAdmin` in the `admin` database with the [`userAdminAnyDatabase`](https://docs.mongodb.com/manual/reference/built-in-roles/#userAdminAnyDatabase) role and the [`readWriteAnyDatabase`](https://docs.mongodb.com/manual/reference/built-in-roles/#readWriteAnyDatabase) role.

通过mongo shell 在admin数据库中增加一个有userAdminAnyDatabase 角色的用户。包括此用户需要的其他角色。例如，下面在admin数据库中创建用户myUserAdmin，此用户有userAdminAnyDatabase和readWriteAnyDatabase角色。

> TIP:
>
> Starting in version 4.2 of the [`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo) shell, you can use the [`passwordPrompt()`](https://docs.mongodb.com/manual/reference/method/passwordPrompt/#passwordPrompt) method in conjunction with various user authentication/management methods/commands to prompt for the password instead of specifying the password directly in the method/command call. However, you can still specify the password directly as you would with earlier versions of the [`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo) shell.

> 提示：
>
> mongo shell 从4.2版本开始，你可以结合使用passwordPrompt()方法和各种用户身份认证/管理方法/命令来提示输入密码，而不是直接在方法/命令调用中指定密码。然而，你仍然可以像早期版本的mongo shell一样直接指定密码。

``` shell
use admin
db.creatUser(
    {
        user: "myUserAdmin",
        pwd: passwordPrompt, // 或者输入明文密码
        roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
    }
)
```

> NOTE:
>
> The database where you create the user (in this example, `admin`) is the user’s [authentication database](https://docs.mongodb.com/manual/core/security-users/#user-authentication-database). Although the user would authenticate to this database, the user can have roles in other databases; i.e. the user’s authentication database does not limit the user’s privileges.

> 注解：
>
> 你在其中创建用户的数据库（在这个示例中是 admin）就是这个用户的身份认证数据库。尽管用户将向此数据库进行身份认证，但用户可以在其他数据库中具有角色；即用户的身份认证数据库不会限制用户的权限。

### 4 Re-start the MongoDB instance with access control.

### 4 开启访问控制后重启MongoDB实例

a. Shut down the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instance. For example, from the [`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo) shell, issue the following command:

a. 关闭mongod 实例。例如，通过mongo shell 输入下面的命令：

``` shell
db.adminCommand({shutdown: 1})
```

b. Exit the [`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo) shell.

b.退出mongo shell。

c.Start the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) with access control enabled.

c.开启访问控制后启动mongod

- If you start the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) from the command line, add the [`--auth`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-auth) command line option:
- 如果你从命令行启动mongod，则在命令行选项中增加 --auth：

```shell
mongod --auth --port 27017 --dbpath /var/lib/mongodb
```

- If you start the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) using a [configuration file](https://docs.mongodb.com/manual/reference/configuration-options/#configuration-options), add the [`security.authorization`](https://docs.mongodb.com/manual/reference/configuration-options/#security.authorization) configuration file setting:
- 如果你使用配置文件启动mongod，则在配置文件中增加security.authorization设置：

```shell
security:
    authorization: enabled
```

Clients that connect to this instance must now authenticate themselves as a MongoDB user. Clients can only perform actions as determined by their assigned roles.

  连接到此实例的客户端现在必须使用MongoDB的用户来认证自己。客户端只能执行其使用的MongoDB 用户所具有的角色指定的操作。

### 5 Connect and authenticate as the user administrator.

### 5 连接并作为用户管理员进行身份认证

Using the [`mongo`](https://docs.mongodb.com/v4.0/reference/program/mongo/#bin.mongo) shell, you can:

- Connect with authentication by passing in user credentials, or
- Connect first withouth authentication, and then issue the [`db.auth()`](https://docs.mongodb.com/v4.0/reference/method/db.auth/#db.auth) method to authenticate.

使用mongo shell，你可以：

- 连接时直接使用用户凭证来通过身份认证，或者
- 连接时先不进行身份认证，连接后使用db.auth()方法进行身份认证

**Authenticate during Connection**

**在连接时进行身份认证**

Start a [`mongo`](https://docs.mongodb.com/v4.0/reference/program/mongo/#bin.mongo) shell with the :option:-u <username> <mongo -u>, -p, and the  --authenticationDatabase <database> command line options:

开启mongo shell时，使用选项：-u <username> <mongo -u> 、-p 和 --authenticationDatabase <database> 命令行选项。

```shell
mongo --port 27017 -u "myUserAdmin" --authenticationDatabase "admin" -p
```



Enter your password when prompted. In this example, `abc123`.

当提示时输入你的密码，在本示例中是：adb123。

**Authenticate after Connection**

**在连接后进行身份认证**

Connect the mongo shell to the mongod:

连接mongo shell到mongod：

```shell
mongo --port 27017
```



In the `mongo` shell, switch to the authentication database (in this case, `admin`), and use [`db.auth(, )`](https://docs.mongodb.com/v4.0/reference/method/db.auth/#db.auth) method to authenticate:

在这个mongo shell 中，切换到认证数据库（在这个例子中是：admin），然后使用 db.auth(<username>, <pwd>)方法进行身份认证。

```shell
use admin

db.auth("myUserAdmin",  "abc123")
```



### 6 Create additional users as needed for your deployment.

### 6 根据你的部署需要创建其他用户

Once authenticated as the user administrator, use [`db.createUser()`](https://docs.mongodb.com/v4.0/reference/method/db.createUser/#db.createUser) to create additional users. You can assign any [built-in roles](https://docs.mongodb.com/v4.0/reference/built-in-roles/) or [user-defined roles](https://docs.mongodb.com/v4.0/core/security-user-defined-roles/) to the users.

一旦身份验证为用户管理员，就能使用db.createUser()来创建其他用户。你可以将任务内置角色或用户自定义的角色分配给用户。

The following operation adds a user `myTester` to the `test` database who has [`readWrite`](https://docs.mongodb.com/v4.0/reference/built-in-roles/#readWrite) role in the `test` database as well as [`read`](https://docs.mongodb.com/v4.0/reference/built-in-roles/#read) role in the `reporting` database.

下面的操作将用户myTester添加到test数据库，该用户在test数据库具有readWrite角色，在reporting 数据库具有read角色。

``` shell
use test
db.createUser(
  {
    user: "myTester",
    pwd: "xyz123",
    roles: [ { role: "readWrite", db: "test" },
             { role: "read", db: "reporting" } ]
  }
)
```

> NOTE:
>
> The database where you create the user (in this example, `test`) is that user’s [authentication database](https://docs.mongodb.com/v4.0/core/security-users/#user-authentication-database). Although the user would authenticate to this database, the user can have roles in other databases; i.e. the user’s authentication database does not limit the user’s privileges.	

> 说明：
>
> 你在其中创建用户的数据库（在这个示例中是test）就是这个用户的身份认证数据库。虽然用户将在此数据库进行身份认证，但用户可以具有其他数据库的角色；即用户的身份认证数据库不限制用户的权限。

After creating the additional users, disconnect the [`mongo`](https://docs.mongodb.com/v4.0/reference/program/mongo/#bin.mongo) shell.

执行完上面操作即创建完其他用户之后，断开和mongo shell 的连接。

### 7 Connect to the instance and authenticate as `myTester`.

### 7 连接到实例并且使用myTester用户进行身份验证。

After disconnecting the [`mongo`](https://docs.mongodb.com/v4.0/reference/program/mongo/#bin.mongo) shell as `myUserAdmin`, reconnect as `myTester`. You can:

- Connect with authentication by passing in user credentials, or
- Connect first without authentication, and then issue the [`db.auth()`](https://docs.mongodb.com/v4.0/reference/method/db.auth/#db.auth) method to authenticate.

将用户myUserAdmin从mongo shell断开连接后，使用myTester用户重连时，你可以：

- 连接时直接使用用户凭证来通过身份验证，或者
- 连接时先不进行身份认证，连接后使用db.auth()方法进行身份认证

**Authenticate during Connection**

**在连接期进行身份验证**

Start a [`mongo`](https://docs.mongodb.com/v4.0/reference/program/mongo/#bin.mongo) shell with the :option:-u <username> <mongo -u>, -p, and the  --authenticationDatabase <database> command line options:

开启mongo shell时，使用选项：-u <username> <mongo -u> 、-p 和 --authenticationDatabase <database> 命令行选项。

```shell
mongo --port 27017 -u "myTester" --authenticationDatabase "test" -p
```



Enter your password when prompted. In this example, `xyz123`.

当提示时输入你的密码，在本示例中是：xyz123。

**Authenticate after Connection**

**连接后进行身份验证**

Connect the mongo shell to the mongod:

连接mongo shell到mongod：

```shell
mongo --port 27017
```



In the `mongo` shell, switch to the authentication database (in this case, `admin`), and use [`db.auth(, )`](https://docs.mongodb.com/v4.0/reference/method/db.auth/#db.auth) method to authenticate:

在这个mongo shell 中，切换到认证数据库（在这个例子中是：admin），然后使用 db.auth(<username>, <pwd>)方法进行身份认证。

```shell
use test

db.auth("myTester",  "xyz123")
```

### 8 Insert a document as `myTester`.

### 8 使用用户myTester插入一个文档

As `myTester`, you have privileges to perform read and write operations in the `test` database (as well as perform read operations in the `reporting` database). Once authenticated as `myTester`, insert a document into a collection in `test` database. For example, you can peform the following insert operation in the `test` database:

作为用户myTester，你有在test数据库读写的权限和在reporting数据库读的权限。一旦使用myTester用户进行身份认证通过后，就可以在test数据库中插入一个文档到集合里面。例如，你可以在test数据库中做如下的插入操作：

```
db.foo.insert( { x: 1, y: 1 } )
```

SEE ALSO：[Manage Users and Roles](https://docs.mongodb.com/v4.0/tutorial/manage-users-and-roles/).

也可以参阅：管理用户和角色

## Additional Considerations

## 其他的注意事项

### Replica Sets and Sharded clusters

### 副本集和分片集群

Replica sets and sharded clusters require internal authentication between members when access control is enabled. For more details, please see [Internal Authentication](https://docs.mongodb.com/v4.0/core/security-internal-authentication/).

副本集和分片集群开启访问控制后，要求成员之间进行内部身份认证。更多详情，请参阅 内部身份认证。

### Localhost Exception

### 本地主机Localhost异常

You can create users either before or after enabling access control. If you enable access control before creating any user, MongoDB provides a [localhost exception](https://docs.mongodb.com/v4.0/core/security-users/#localhost-exception) which allows you to create a user administrator in the `admin` database. Once created, you must authenticate as the user administrator to create additional users as needed.

你可以在启动访问控制之前或之后创建用户。如果你在创建用户之前开启了访问控制，MongoDB提供了一个localhost 异常，它允许你在admin数据库创建一个用户管理员。创建之后，你必须使用这个用户管理员进行身份认证后，才能根据需要创建其他用户。



原文链接：https://docs.mongodb.com/manual/tutorial/enable-authentication/

译者：傅立


