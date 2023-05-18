# 用户

要在 MongoDB 中验证客户端，您必须将相应的用户添加到 MongoDB。

## 用户管理

[`db.createUser()`](https://www.mongodb.com/docs/manual/reference/method/db.createUser/#mongodb-method-db.createUser)您可以使用 以下方法添加用户[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh). 您创建的第一个用户必须具有创建其他用户的权限。或角色都授予创建其他用户[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)的 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)权限。

> 提示:
>
> **也可以看看：**
>
> [创建用户](https://www.mongodb.com/docs/manual/tutorial/create-users/)

您可以在创建用户时通过为用户分配[角色](https://www.mongodb.com/docs/manual/core/authorization/)来授予用户权限。您还可以通过更新现有用户来授予或撤销角色以及更新密码。有关用户管理方法的完整列表，请参阅 [用户管理。](https://www.mongodb.com/docs/manual/reference/method/#std-label-user-management-methods)

> 提示:
>
> **也可以看看：**
>
> [管理用户和角色](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/)

用户由用户名唯一标识并关联 [认证数据库](https://www.mongodb.com/docs/manual/core/security-users/#std-label-authentication-database). MongoDB 将用户与`userId`在 MongoDB 中创建时的唯一性相关联。

### LDAP 管理用户

[在LDAP 服务器上创建的 LDAP 托管用户在](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-security-ldap)[system.users](https://www.mongodb.com/docs/manual/reference/system-users-collection/)集合中没有关联文档，因此没有[`userId`](https://www.mongodb.com/docs/manual/reference/system-users-collection/#mongodb-data-admin.system.users.userId)与他们关联的字段。

## 认证数据库

添加用户时，您会在特定数据库中创建用户。您在其中创建用户的数据库是用户的身份验证数据库。

但是，用户的权限不限于他们的身份验证数据库。因此，一个用户可以拥有跨不同数据库的权限。有关角色的更多信息，请参阅 [基于角色的访问控制。](https://www.mongodb.com/docs/manual/core/authorization/)

用户名和身份验证数据库用作该用户的唯一标识符。MongoDB 将用户与`userId`在 MongoDB 中创建时的唯一性相关联。但是，在[LDAP 服务器上创建的 LDAP 托管用户在](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-security-ldap)[system.users](https://www.mongodb.com/docs/manual/reference/system-users-collection/)集合 中没有关联文档 ，因此没有[`userId`](https://www.mongodb.com/docs/manual/reference/system-users-collection/#mongodb-data-admin.system.users.userId)与他们关联的字段。

如果两个用户具有相同的名称但在不同的数据库中创建，则它们是两个独立的用户。如果您希望单个用户拥有多个数据库的权限，请为每个适用的数据库创建一个具有角色的用户。

## 集中用户数据

对于在 MongoDB 中创建的用户，MongoDB 将所有用户信息（包括[`name`](https://www.mongodb.com/docs/manual/reference/system-users-collection/#mongodb-data-admin.system.users.user)、[`password`](https://www.mongodb.com/docs/manual/reference/system-users-collection/#mongodb-data-admin.system.users.credentials)和用户的 ）存储[`authentication database`](https://www.mongodb.com/docs/manual/reference/system-users-collection/#mongodb-data-admin.system.users.db)在数据库的[system.users](https://www.mongodb.com/docs/manual/reference/system-users-collection/)集合中`admin` 。

不要直接修改这个集合。要管理用户，请使用指定的[用户管理命令。](https://www.mongodb.com/docs/manual/reference/command/#std-label-user-management-commands)

## 分片集群用户

要为分片集群创建用户，请连接到一个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例并添加用户。要以在实例上创建的用户身份进行身份验证[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，您必须通过[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例进行身份验证。

在分片集群中，MongoDB 将用户配置数据存储在 [配置服务器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-server)`admin`的数据库中[。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-server)

### 分片本地用户

一些维护操作，例如[`cleanupOrphaned`](https://www.mongodb.com/docs/manual/reference/command/cleanupOrphaned/#mongodb-dbcommand-dbcmd.cleanupOrphaned)、 [`compact`](https://www.mongodb.com/docs/manual/reference/command/compact/#mongodb-dbcommand-dbcmd.compact)或[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)，需要直接连接到分片集群中的特定分片。要执行这些操作，您必须直接连接到分片并以 *分片本地*管理用户身份进行身份验证。

要创建*分片本地*管理用户，请直接连接到分片的主节点并创建用户。有关如何创建分片本地用户管理员的说明，请参阅 [Deploy Sharded Cluster with Keyfile Authentication](https://www.mongodb.com/docs/manual/tutorial/deploy-sharded-cluster-with-keyfile-access-control/) 教程。

MongoDB 将*分片本地*用户存储在`admin`分片本身的数据库中。这些*分片本地*用户独立于通过 . 添加到分片集群的用户[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)。 *分片本地*用户是分片的本地用户，无法通过 [`mongos`.](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

与分片的直接连接应该只用于特定于分片的维护和配置或用于目标分析工作负载。一般来说，客户端应该通过 [`mongos`.](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)





翻译：韩鹏帅

原文：[Users](https://www.mongodb.com/docs/manual/core/security-users/)