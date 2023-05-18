# 基于角色的访问控制

MongoDB 使用基于角色的访问控制 (RBAC) 来管理对 MongoDB 系统的访问。一个用户被授予一个或多个[角色](https://www.mongodb.com/docs/manual/core/authorization/#std-label-roles)决定了用户对数据库资源的访问权限和操作。在角色分配之外，用户无权访问系统。

## 启用访问控制

MongoDB 默认不启用访问控制。您可以使用[`--auth`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--auth)或 [`security.authorization`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.authorization)设置启用授权。启用[内部身份验证](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)还会启用客户端授权。

启用访问控制后，用户必须对自己[进行身份验证](https://www.mongodb.com/docs/manual/core/authentication/)。

## 角色

角色授予对资源执行指定操作[的](https://www.mongodb.com/docs/manual/reference/resource-document/)[权限](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)。每个权限要么在角色中明确指定，要么从另一个角色继承，或者两者兼而有之。

### 使用权

角色从不限制特权。如果用户有两个角色，则具有更大访问权限的角色优先。

例如，如果您将[`read`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-read)数据库角色授予已经拥有该角色的用户[`readWriteAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWriteAnyDatabase)，则该 `read`授予不会**撤销**对该数据库的写访问权限。

要撤销用户的角色，请使用[`revokeRolesFromUser`](https://www.mongodb.com/docs/manual/reference/command/revokeRolesFromUser/#mongodb-dbcommand-dbcmd.revokeRolesFromUser) 命令。

### 身份验证限制

角色可以对用户施加身份验证限制，要求他们从指定的源和目标 IP 地址范围进行连接。

有关详细信息，请参阅[身份验证限制。](https://www.mongodb.com/docs/manual/reference/command/createRole/#std-label-create-role-auth-restrictions)

### 特权

特权由指定的资源和允许对该资源执行的操作组成。

资源是数据库、集合[、](https://www.mongodb.com/docs/manual/reference/resource-document/)集合集或集群。如果资源是集群，则附属操作会影响系统的状态，而不是特定的数据库或集合。有关资源文档的信息，请参阅[资源文档。](https://www.mongodb.com/docs/manual/reference/resource-document/)

操作指定[资源](https://www.mongodb.com/docs/manual/reference/privilege-actions/)上允许的操作。有关可用操作，请参阅 [特权操作。](https://www.mongodb.com/docs/manual/reference/privilege-actions/)

### 继承的特权

角色可以在其定义中包含一个或多个现有角色，在这种情况下，角色会继承包含的角色的所有特权。

角色可以从其数据库中的其他角色继承特权。在数据库上创建的角色`admin`可以从任何数据库中的角色继承特权。

### 查看角色的权限

[`rolesInfo`](https://www.mongodb.com/docs/manual/reference/command/rolesInfo/#mongodb-dbcommand-dbcmd.rolesInfo) 您可以通过发出将`showPrivileges`和`showBuiltinRoles`字段都设置为 的 命令来查看角色的权限`true`。

## 用户和角色

您可以在用户创建期间为用户分配角色。您还可以更新现有用户以授予或撤销角色。有关用户管理方法的完整列表，请参阅[用户管理](https://www.mongodb.com/docs/manual/reference/method/#std-label-user-management-methods)

分配了角色的用户将获得该角色的所有权限。一个用户可以有多个角色。通过为不同数据库中的用户分配角色，在一个数据库中创建的用户可以具有操作其他数据库的权限。

> 笔记:
>
> 在数据库中创建的第一个用户应该是具有管理其他用户权限的用户管理员。请参阅 [启用访问控制。](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)

## 内置角色和用户定义的角色

MongoDB 提供[内置角色](https://www.mongodb.com/docs/manual/reference/built-in-roles/)，这些角色提供数据库系统中通常需要的一组权限。

如果这些内置角色无法提供所需的权限集，MongoDB 会提供创建和修改[用户定义角色的方法。](https://www.mongodb.com/docs/manual/core/security-user-defined-roles/)

## LDAP 授权

MongoDB Enterprise 支持查询 LDAP 服务器以获取经过身份验证的用户所属的 LDAP 组。MongoDB 将每个返回组的可分辨名称 (DN) 映射到[角色](https://www.mongodb.com/docs/manual/core/authorization/#std-label-roles)在数据库上`admin`。MongoDB 根据映射的角色及其相关权限对用户进行授权。有关详细信息，请参阅[LDAP 授权。](https://www.mongodb.com/docs/manual/core/security-ldap-external/#std-label-security-ldap-external)

















译者：韩鹏帅

原文：[Role-Based Access Control](https://www.mongodb.com/docs/manual/core/authorization/)
