# 本地主机异常

> 重要的:
>
> 在实例上，仅当MongoDB 实例中**没有创建用户或角色**[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)时才适用 localhost 异常。

localhost 异常允许您启用访问控制，然后在系统中创建第一个用户或角色。启用访问控制后，连接到本地主机界面并在`admin`数据库中创建第一个用户。

如果您先创建一个用户，则该用户必须具有创建其他用户的权限。或角色都授予创建其他用户[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)的 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)权限。

>警告:
>
>在实例上，仅当MongoDB 实例中**没有创建用户或角色**[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)时才适用 localhost 异常。

localhost 异常允许您启用访问控制，然后在系统中创建第一个用户或角色。启用访问控制后，连接到本地主机界面并在`admin`数据库中创建第一个用户。

如果您先创建一个用户，则该用户必须具有创建其他用户的权限。或角色都授予创建其他用户[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)的 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)权限。

>警告:
>
>*使用 localhost 异常的连接只能*创建 第**一个用户或角色**。
>
>一旦您创建了任何用户或角色，localhost 异常就会被禁用。如果您需要创建用户和角色，则必须首先使用内置[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)或 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)角色之一创建用户。如果先创建角色，则无法创建用户。

首先使用该方法创建角色的能力[`db.createRole()`](https://www.mongodb.com/docs/manual/reference/method/db.createRole/#mongodb-method-db.createRole) 专门针对使用 LDAP 授权的用户。有关详细信息，请参阅[LDAP 授权。](https://www.mongodb.com/docs/manual/core/security-ldap-external/#std-label-security-ldap-external)

## 分片集群的本地主机异常

> 重要的:
>
> - 在 a 上[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，localhost 异常仅适用于没有创建[分片集群用户](https://www.mongodb.com/docs/manual/core/security-users/#std-label-sharding-localhost) 或角色的情况。
> - 在分片集群中，本地主机异常适用于单独的每个分片以及整个集群。

创建分片集群并通过实例添加[用户管理员](https://www.mongodb.com/docs/manual/tutorial/configure-scram-client-authentication/#std-label-create-user-admin)[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)后，您 仍**必须**防止对各个分片进行未经授权的访问。为防止对单个分片进行未经授权的访问，请对集群中的每个分片执行以下步骤之一：

- 在分片的主节点上[创建用户管理员。](https://www.mongodb.com/docs/manual/tutorial/configure-scram-client-authentication/#std-label-create-user-admin)
- 在启动时禁用 localhost 异常。要禁用 localhost 异常，请将[`enableLocalhostAuthBypass`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.enableLocalhostAuthBypass)参数设置为 `0`.









翻译：韩鹏帅

原文：[Localhost Exception](https://www.mongodb.com/docs/manual/core/localhost-exception/)