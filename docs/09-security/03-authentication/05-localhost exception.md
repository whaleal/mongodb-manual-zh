本地主机异常

>[IMPROTANT]重要
>
>在 `mongod` 实例上，localhost 异常仅在 MongoDB 实例中没有创建用户或角色时适用。

localhost 异常允许您启用访问控制，然后在系统中创建第一个用户或角色。 启用访问控制后，连接到 localhost 界面并在 admin 数据库中创建第一个用户。

如果您先创建一个用户，则该用户必须具有创建其他用户的权限。 `userAdmin` 或` userAdminAnyDatabase` 角色都授予创建其他用户的权限。

>[WARNING]警告
>
>使用 localhost 异常的连接只能创建第一个用户或角色。
>
>一旦您创建了任何用户或角色，localhost 异常就会被禁用。 如果您需要创建用户和角色，则必须首先使用内置的 userAdmin 或 userAdminAnyDatabase 角色之一创建用户。 如果先创建角色，则无法创建用户。

首先使用 `db.createRole()` 方法创建角色的能力专门针对使用 LDAP 授权的用户。 有关详细信息，请参阅 LDAP 授权。

分片集群的本地主机异常

>[IMPROTANT]重要
>
>- 在 `mongos` 上，localhost 异常仅在没有创建**分片集群用户**或角色时适用。
>- 在分片集群中，本地主机异常适用于单独的每个分片以及整个集群。

创建分片集群并通过` mongos` 实例添加[用户管理员](C:\Users\14040\Desktop\mongodb-manual-zh-dev\09-security\03-authentication\02-authentication-mechanisms\01-secruity-scream\Use SCRAM to Authenticate Clients.md)后，您仍然必须防止对各个分片进行未经授权的访问。 为防止对单个分片进行未经授权的访问，请对集群中的每个分片执行以下步骤之一：

- 在分片的主节点上创建[用户管理员](C:\Users\14040\Desktop\mongodb-manual-zh-dev\09-security\03-authentication\02-authentication-mechanisms\01-secruity-scream\Use SCRAM to Authenticate Clients.md)。
- 在启动时禁用 localhost 异常。 要禁用 localhost 异常，请将 `enableLocalhostAuthBypass` 参数设置为 `0`。

译者：景圣

参见

原文：[Localhost Exception](https://www.mongodb.com/docs/manual/core/localhost-exception/)