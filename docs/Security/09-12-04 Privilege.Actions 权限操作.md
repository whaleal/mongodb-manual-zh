[Security](https://docs.mongodb.com/manual/security/) > [Security Reference](https://docs.mongodb.com/manual/reference/security/) > Privilege Actions



# Privilege Actions 权限操作

On this page

- [Query and Write Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#query-and-write-actions)
- [Database Management Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#database-management-actions)
- [Deployment Management Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#deployment-management-actions)
- [Change Stream Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#change-stream-actions)
- [Replication Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#replication-actions)
- [Sharding Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#sharding-actions)
- [Server Administration Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#server-administration-actions)
- [Session Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#session-actions)
- [Free Monitoring Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#free-monitoring-actions)
- [Diagnostic Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#diagnostic-actions)
- [Internal Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#internal-actions)



在本页面

- [查询和写入操作](https://docs.mongodb.com/manual/reference/privilege-actions/#query-and-write-actions)
- [数据库管理操作](https://docs.mongodb.com/manual/reference/privilege-actions/#database-management-actions)
- [部署管理操作](https://docs.mongodb.com/manual/reference/privilege-actions/#deployment-management-actions)
- [变更流操作](https://docs.mongodb.com/manual/reference/privilege-actions/#change-stream-actions)
- [复制操作](https://docs.mongodb.com/manual/reference/privilege-actions/#replication-actions)
- [分片操作](https://docs.mongodb.com/manual/reference/privilege-actions/#sharding-actions)
- [服务器管理操作](https://docs.mongodb.com/manual/reference/privilege-actions/#server-administration-actions)
- [会话操作](https://docs.mongodb.com/manual/reference/privilege-actions/#session-actions)
- [免费监控操作](https://docs.mongodb.com/manual/reference/privilege-actions/#free-monitoring-actions)
- [诊断操作](https://docs.mongodb.com/manual/reference/privilege-actions/#diagnostic-actions)
- [内部操作](https://docs.mongodb.com/manual/reference/privilege-actions/#internal-actions)



Privilege actions define the operations a user can perform on a [resource](https://docs.mongodb.com/manual/reference/resource-document/#resource-document). A MongoDB [privilege](https://docs.mongodb.com/manual/core/authorization/#privileges) comprises a [resource](https://docs.mongodb.com/manual/reference/resource-document/#resource-document) and the permitted actions. This page lists available actions grouped by common purpose.

权限操作定义了用户可以对[资源](https://docs.mongodb.com/manual/reference/resource-document/#resource-document)执行的操作。MongoDB [权限](https://docs.mongodb.com/manual/core/authorization/#privileges)包括 [资源](https://docs.mongodb.com/manual/reference/resource-document/#resource-document)和允许的操作。此页面列出了按通用目的分组的可用操作。

MongoDB provides built-in roles with pre-defined pairings of resources and permitted actions. For lists of the actions granted, see [Built-In Roles](https://docs.mongodb.com/manual/reference/built-in-roles/). To define custom roles, see [Create a User-Defined Role](https://docs.mongodb.com/manual/tutorial/manage-users-and-roles/#create-user-defined-role).

MongoDB为内置角色提供了预定义的资源对和允许的操作对。有关授予的操作的列表，请参见 [内置角色](https://docs.mongodb.com/manual/reference/built-in-roles/)。要定义自定义角色，请参阅 [创建用户定义的角色](https://docs.mongodb.com/manual/tutorial/manage-users-and-roles/#create-user-defined-role)。



## Query and Write Actions 查询和写操作[¶](https://docs.mongodb.com/manual/reference/privilege-actions/#query-and-write-actions)

- `find`

User can perform the following commands, and their equivalent helper methods:

- [`aggregate`](https://docs.mongodb.com/manual/reference/command/aggregate/#dbcmd.aggregate) for all [pipeline operations](https://docs.mongodb.com/manual/reference/operator/aggregation/) **except** [`$collStats`](https://docs.mongodb.com/manual/reference/operator/aggregation/collStats/#pipe._S_collStats), [`$out`](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out), and [`$indexStats`](https://docs.mongodb.com/manual/reference/operator/aggregation/indexStats/#pipe._S_indexStats).
- [`checkShardingIndex`](https://docs.mongodb.com/manual/reference/command/checkShardingIndex/#dbcmd.checkShardingIndex)
- [`count`](https://docs.mongodb.com/manual/reference/command/count/#dbcmd.count)
- [`dataSize`](https://docs.mongodb.com/manual/reference/command/dataSize/#dbcmd.dataSize)
- [`distinct`](https://docs.mongodb.com/manual/reference/command/distinct/#dbcmd.distinct)
- [`filemd5`](https://docs.mongodb.com/manual/reference/command/filemd5/#dbcmd.filemd5)
- [`find`](https://docs.mongodb.com/manual/reference/command/find/#dbcmd.find)
- [`geoSearch`](https://docs.mongodb.com/manual/reference/command/geoSearch/#dbcmd.geoSearch)
- [`getLastError`](https://docs.mongodb.com/manual/reference/command/getLastError/#dbcmd.getLastError)
- [`getMore`](https://docs.mongodb.com/manual/reference/command/getMore/#dbcmd.getMore)
- [`killCursors`](https://docs.mongodb.com/manual/reference/command/killCursors/#dbcmd.killCursors), provided that the cursor is associated with a currently authenticated user.
- [`listCollections`](https://docs.mongodb.com/manual/reference/command/listCollections/#dbcmd.listCollections)
- [`listIndexes`](https://docs.mongodb.com/manual/reference/command/listIndexes/#dbcmd.listIndexes)
- [`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce) with the `{out: inline}` option.
- [`resetError`](https://docs.mongodb.com/manual/reference/command/resetError/#dbcmd.resetError)

Required for the query portion of the [`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce) command and [`db.collection.mapReduce`](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#db.collection.mapReduce) helper method when [outputting to a collection](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#mapreduce-out-mtd).

Required for the query portion of the [`findAndModify`](https://docs.mongodb.com/manual/reference/command/findAndModify/#dbcmd.findAndModify) command and [`db.collection.findAndModify`](https://docs.mongodb.com/manual/reference/method/db.collection.findAndModify/#db.collection.findAndModify) helper method.

Required on the *source* collection for the [`cloneCollectionAsCapped`](https://docs.mongodb.com/manual/reference/command/cloneCollectionAsCapped/#dbcmd.cloneCollectionAsCapped) and [`renameCollection`](https://docs.mongodb.com/manual/reference/command/renameCollection/#dbcmd.renameCollection) commands and the [`db.collection.renameCollection()`](https://docs.mongodb.com/manual/reference/method/db.collection.renameCollection/#db.collection.renameCollection) helper method.

- For MongoDB 4.0.6+:

  If the user does not have the [`listDatabases`](https://docs.mongodb.com/manual/reference/privilege-actions/#listDatabases) privilege action, users can run the [`listDatabases`](https://docs.mongodb.com/manual/reference/command/listDatabases/#dbcmd.listDatabases) command to return a list of databases for which the user has privileges (including databases for which the user has privileges on specific collections) if the command is run with `authorizedDatabases` option unspecified or set to `true`.

- For MongoDB 4.0.5:

  If the user does not have the [`listDatabases`](https://docs.mongodb.com/manual/reference/privilege-actions/#listDatabases) privilege action, users can run the [`listDatabases`](https://docs.mongodb.com/manual/reference/command/listDatabases/#dbcmd.listDatabases) command to return a list of databases for which the user has the [`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find) action privilege if the command is run with `authorizedDatabases` option unspecified or set to `true`.

- For MongoDB 4.0.0-4.0.4:

  If the user does not have the [`listDatabases`](https://docs.mongodb.com/manual/reference/privilege-actions/#listDatabases) privilege action, users can run the [`listDatabases`](https://docs.mongodb.com/manual/reference/command/listDatabases/#dbcmd.listDatabases) command to return a list of databases for which the user has the [`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find) action privilege.

Apply this action to database or collection resources.



- `find`



用户可以执行以下命令及其等效的帮助方法：

- [`aggregate`](https://docs.mongodb.com/manual/reference/command/aggregate/#dbcmd.aggregate)对于所有[管道操作](https://docs.mongodb.com/manual/reference/operator/aggregation/) （[`$collStats`](https://docs.mongodb.com/manual/reference/operator/aggregation/collStats/#pipe._S_collStats)，[`$out`](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out)和 [`$indexStats`](https://docs.mongodb.com/manual/reference/operator/aggregation/indexStats/#pipe._S_indexStats)**除外）** 。
- [`checkShardingIndex`](https://docs.mongodb.com/manual/reference/command/checkShardingIndex/#dbcmd.checkShardingIndex)
- [`count`](https://docs.mongodb.com/manual/reference/command/count/#dbcmd.count)
- [`dataSize`](https://docs.mongodb.com/manual/reference/command/dataSize/#dbcmd.dataSize)
- [`distinct`](https://docs.mongodb.com/manual/reference/command/distinct/#dbcmd.distinct)
- [`filemd5`](https://docs.mongodb.com/manual/reference/command/filemd5/#dbcmd.filemd5)
- [`find`](https://docs.mongodb.com/manual/reference/command/find/#dbcmd.find)
- [`geoSearch`](https://docs.mongodb.com/manual/reference/command/geoSearch/#dbcmd.geoSearch)
- [`getLastError`](https://docs.mongodb.com/manual/reference/command/getLastError/#dbcmd.getLastError)
- [`getMore`](https://docs.mongodb.com/manual/reference/command/getMore/#dbcmd.getMore)
- [`killCursors`](https://docs.mongodb.com/manual/reference/command/killCursors/#dbcmd.killCursors)，前提是光标与当前经过身份验证的用户相关联。
- [`listCollections`](https://docs.mongodb.com/manual/reference/command/listCollections/#dbcmd.listCollections)
- [`listIndexes`](https://docs.mongodb.com/manual/reference/command/listIndexes/#dbcmd.listIndexes)
- [`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce)与`{out: inline}`选项
- [`resetError`](https://docs.mongodb.com/manual/reference/command/resetError/#dbcmd.resetError)

[输出到集合](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#mapreduce-out-mtd)时，[`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce)命令和 [`db.collection.mapReduce`](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#db.collection.mapReduce)辅助方法的查询部分是必需的。

[`findAndModify`](https://docs.mongodb.com/manual/reference/command/findAndModify/#dbcmd.findAndModify)命令行和[`db.collection.findAndModify`](https://docs.mongodb.com/manual/reference/method/db.collection.findAndModify/#db.collection.findAndModify)辅助方法的查询部分是必需的。

[`cloneCollectionAsCapped`](https://docs.mongodb.com/manual/reference/command/cloneCollectionAsCapped/#dbcmd.cloneCollectionAsCapped)和[`renameCollection`](https://docs.mongodb.com/manual/reference/command/renameCollection/#dbcmd.renameCollection)命令行以及[`db.collection.renameCollection()`](https://docs.mongodb.com/manual/reference/method/db.collection.renameCollection/#db.collection.renameCollection)辅助方法要求有源集合。

- 对于MongoDB 4.0.6+：

  如果用户没有[`listDatabases`](https://docs.mongodb.com/manual/reference/privilege-actions/#listDatabases) 操作权限，用户运行[`listDatabases`](https://docs.mongodb.com/manual/reference/command/listDatabases/#dbcmd.listDatabases) 命令行时`authorizedDatabases`未指定或设置选项为`true`，则用户可以运行该命令以返回该用户具有权限的数据库的列表（包括该用户对特定集合具有权限的数据库）。

- 对于MongoDB 4.0.5：

  如果用户没有[`listDatabases`](https://docs.mongodb.com/manual/reference/privilege-actions/#listDatabases) 操作权限，在`authorizedDatabases`未指定选项或设置为`true`的情况下运行[`listDatabases`](https://docs.mongodb.com/manual/reference/command/listDatabases/#dbcmd.listDatabases) 命令时，用户可以运行该命令以返回该用户对其具有[`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find)操作权限的数据库的列表 。

- 对于MongoDB 4.0.0-4.0.4：

  如果用户没有[`listDatabases`](https://docs.mongodb.com/manual/reference/privilege-actions/#listDatabases) 操作权限，则用户可以运行[`listDatabases`](https://docs.mongodb.com/manual/reference/command/listDatabases/#dbcmd.listDatabases) 命令以返回该用户对其具有[`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find)操作权限的数据库列表 。

将此操作应用于数据库或集合资源。



- `insert`

  User can perform the following commands and their equivalent methods:
  
  - [`insert`](https://docs.mongodb.com/manual/reference/command/insert/#dbcmd.insert)
  - [`create`](https://docs.mongodb.com/manual/reference/command/create/#dbcmd.create)
  
  Required for the output portion of the [`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce) command and [`db.collection.mapReduce()`](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#db.collection.mapReduce) helper method when [outputting to a collection](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#mapreduce-out-mtd).
  
  Required for the [`aggregate`](https://docs.mongodb.com/manual/reference/command/aggregate/#dbcmd.aggregate) command and [`db.collection.aggregate()`](https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/#db.collection.aggregate) helper method when using the [`$out`](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out) pipeline operator.
  
  Required for the [`update`](https://docs.mongodb.com/manual/reference/command/update/#dbcmd.update) and [`findAndModify`](https://docs.mongodb.com/manual/reference/command/findAndModify/#dbcmd.findAndModify) commands and equivalent helper methods when used with the `upsert` option.
  
  Required on the *destination* collection for the following commands and their helper methods:
  
  - [`cloneCollection`](https://docs.mongodb.com/manual/reference/command/cloneCollection/#dbcmd.cloneCollection)
  - [`cloneCollectionAsCapped`](https://docs.mongodb.com/manual/reference/command/cloneCollectionAsCapped/#dbcmd.cloneCollectionAsCapped)
  - [`renameCollection`](https://docs.mongodb.com/manual/reference/command/renameCollection/#dbcmd.renameCollection)
  
  Apply this action to database or collection resources.



- `insert`

  用户可以执行以下命令及其等效方法：

  - [`insert`](https://docs.mongodb.com/manual/reference/command/insert/#dbcmd.insert)
  - [`create`](https://docs.mongodb.com/manual/reference/command/create/#dbcmd.create)

  [输出到集合](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#mapreduce-out-mtd)时，[`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce) 命令和 [`db.collection.mapReduce()`](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#db.collection.mapReduce)方法的输出部分是必需的。

  使用管道[`$out`](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out)运算符时，[`aggregate`](https://docs.mongodb.com/manual/reference/command/aggregate/#dbcmd.aggregate)命令和 [`db.collection.aggregate()`](https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/#db.collection.aggregate)帮助程序方法是必需的。

  当使用[`update`](https://docs.mongodb.com/manual/reference/command/update/#dbcmd.update)和[`findAndModify`](https://docs.mongodb.com/manual/reference/command/findAndModify/#dbcmd.findAndModify) 命令以及等效的帮助程序方法时，`upsert`是必需的 。

  以下命令及其辅助方法在*目标*集合上是必需的：

  - [`cloneCollection`](https://docs.mongodb.com/manual/reference/command/cloneCollection/#dbcmd.cloneCollection)
  - [`cloneCollectionAsCapped`](https://docs.mongodb.com/manual/reference/command/cloneCollectionAsCapped/#dbcmd.cloneCollectionAsCapped)
  - [`renameCollection`](https://docs.mongodb.com/manual/reference/command/renameCollection/#dbcmd.renameCollection)

  将此操作应用于数据库或集合资源。



- `remove`

  User can perform the [`delete`](https://docs.mongodb.com/manual/reference/command/delete/#dbcmd.delete) command and equivalent helper method.Required for the write portion of the [`findAndModify`](https://docs.mongodb.com/manual/reference/command/findAndModify/#dbcmd.findAndModify) command and [`db.collection.findAndModify()`](https://docs.mongodb.com/manual/reference/method/db.collection.findAndModify/#db.collection.findAndModify) method.Required for the [`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce) command and [`db.collection.mapReduce()`](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#db.collection.mapReduce) helper method when you specify the `replace` action when [outputting to a collection](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#mapreduce-out-mtd).Required for the [`aggregate`](https://docs.mongodb.com/manual/reference/command/aggregate/#dbcmd.aggregate) command and [`db.collection.aggregate()`](https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/#db.collection.aggregate) helper method when using the [`$out`](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out) pipeline operator.Apply this action to database or collection resources.



- `remove`

  用户可以执行[`delete`](https://docs.mongodb.com/manual/reference/command/delete/#dbcmd.delete)命令和等效的辅助方法。

  [`findAndModify`](https://docs.mongodb.com/manual/reference/command/findAndModify/#dbcmd.findAndModify) 命令和[`db.collection.findAndModify()`](https://docs.mongodb.com/manual/reference/method/db.collection.findAndModify/#db.collection.findAndModify)方法的write 部分是必需的。

  当您指定`replace`[输出到集合](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#mapreduce-out-mtd)时，该[`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce)命令和 [`db.collection.mapReduce()`](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#db.collection.mapReduce)辅助方法是必需的。

  使用[`$out`](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out)管道运算符时，[`aggregate`](https://docs.mongodb.com/manual/reference/command/aggregate/#dbcmd.aggregate)命令和 [`db.collection.aggregate()`](https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/#db.collection.aggregate)辅助方法是必需的。

  将此操作应用于数据库或集合资源。



- `update`

  User can perform the [`update`](https://docs.mongodb.com/manual/reference/command/update/#dbcmd.update) command and equivalent helper methods.Required for the [`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce) command and [`db.collection.mapReduce()`](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#db.collection.mapReduce) helper method when [outputting to a collection](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#mapreduce-out-mtd) without specifying the `replace` action.Required for the [`findAndModify`](https://docs.mongodb.com/manual/reference/command/findAndModify/#dbcmd.findAndModify) command and [`db.collection.findAndModify()`](https://docs.mongodb.com/manual/reference/method/db.collection.findAndModify/#db.collection.findAndModify) helper method.Apply this action to database or collection resources.



- `update`

用户可以执行[`update`](https://docs.mongodb.com/manual/reference/command/update/#dbcmd.update)命令和等效的帮助方法。

在不指定`replace`操作的情况下[输出到集合](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#mapreduce-out-mtd)时，[`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce)命令和 [`db.collection.mapReduce()`](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#db.collection.mapReduce)辅助方法是必需的 。

[`findAndModify`](https://docs.mongodb.com/manual/reference/command/findAndModify/#dbcmd.findAndModify)命令和 [`db.collection.findAndModify()`](https://docs.mongodb.com/manual/reference/method/db.collection.findAndModify/#db.collection.findAndModify)辅助方法是必需的。

将此操作应用于数据库或集合资源。



- `bypassDocumentValidation`

  *New in version 3.2.*
  
  Users can bypass [document validation](https://docs.mongodb.com/manual/core/schema-validation/) on commands and methods that support the `bypassDocumentValidation` option. The following commands and their equivalent methods support bypassing document validation:
  
  - [`aggregate`](https://docs.mongodb.com/manual/reference/command/aggregate/#dbcmd.aggregate)
  - [`applyOps`](https://docs.mongodb.com/manual/reference/command/applyOps/#dbcmd.applyOps)
  - [`cloneCollection`](https://docs.mongodb.com/manual/reference/command/cloneCollection/#dbcmd.cloneCollection) on the *destination* collection
  - [`findAndModify`](https://docs.mongodb.com/manual/reference/command/findAndModify/#dbcmd.findAndModify)
  - [`insert`](https://docs.mongodb.com/manual/reference/command/insert/#dbcmd.insert)
  - [`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce)
  - [`update`](https://docs.mongodb.com/manual/reference/command/update/#dbcmd.update)
  
  Apply this action to database or collection resources.



- `bypassDocumentValidation`

*3.2版中的新功能。*

用户可以绕过支持`bypassDocumentValidation`选项的命令和方法的[文档验证](https://docs.mongodb.com/manual/core/schema-validation/)。以下命令及其等效方法支持绕过文档验证：

- [`aggregate`](https://docs.mongodb.com/manual/reference/command/aggregate/#dbcmd.aggregate)
- [`applyOps`](https://docs.mongodb.com/manual/reference/command/applyOps/#dbcmd.applyOps)
- 在*目标*集合上的[`cloneCollection`](https://docs.mongodb.com/manual/reference/command/cloneCollection/#dbcmd.cloneCollection)
- [`findAndModify`](https://docs.mongodb.com/manual/reference/command/findAndModify/#dbcmd.findAndModify)
- [`insert`](https://docs.mongodb.com/manual/reference/command/insert/#dbcmd.insert)
- [`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce)
- [`update`](https://docs.mongodb.com/manual/reference/command/update/#dbcmd.update)

将此操作应用于数据库或集合资源。



- `useUUID`

User can execute the following commands using a UUID as if it were a namespace:

- [`find`](https://docs.mongodb.com/manual/reference/command/find/#dbcmd.find)
- [`listIndexes`](https://docs.mongodb.com/manual/reference/command/listIndexes/#dbcmd.listIndexes)

For example, this privilege authorizes a user to run the following command which executes a [`find`](https://docs.mongodb.com/manual/reference/command/find/#dbcmd.find) command on a collection with the given UUID. In order to be successful, this operation also requires that the user is authorized to execute the `find` command on the collection namespace corresponding to the given UUID.

copycopied

```
db.runCommand({find: UUID("123e4567-e89b-12d3-a456-426655440000")})
```

For more information on collection UUIDs, see [Collections](https://docs.mongodb.com/manual/core/databases-and-collections/#collections).

Apply this action to the `cluster` resource.



- `useUUID`

*3.6版的新功能。*

用户可以使用UUID来执行以下命令 ，就像它是名称空间一样：

- [`find`](https://docs.mongodb.com/manual/reference/command/find/#dbcmd.find)
- [`listIndexes`](https://docs.mongodb.com/manual/reference/command/listIndexes/#dbcmd.listIndexes)

例如，此权限授权用户运行以下命令，该[`find`](https://docs.mongodb.com/manual/reference/command/find/#dbcmd.find)命令对具有给定UUID的集合执行命令。为了获得成功，此操作还需要授权用户`find`在与给定UUID对应的集合名称空间上执行命令。

复制

```
db.runCommand({find: UUID("123e4567-e89b-12d3-a456-426655440000")})
```

有关集合UUID的更多信息，请参见 [集合](https://docs.mongodb.com/manual/core/databases-and-collections/#collections)。

将此操作应用于`cluster`资源。



## Database Management Actions 数据库管理操作[¶](https://docs.mongodb.com/manual/reference/privilege-actions/#database-management-actions)

- `changeCustomData`

  User can change the custom information of any user in the given database. Apply this action to database resources.

  用户可以更改给定数据库中任何用户的自定义信息。将此操作应用于数据库资源。



- `changeOwnCustomData`

  Users can change their own custom information. Apply this action to database resources. See also [Change Your Password and Custom Data](https://docs.mongodb.com/manual/tutorial/change-own-password-and-custom-data/).

  用户可以更改自己的自定义信息。将此操作应用于数据库资源。另请参阅 [更改密码和自定义数据](https://docs.mongodb.com/manual/tutorial/change-own-password-and-custom-data/)。



- `changeOwnPassword`

  Users can change their own passwords. Apply this action to database resources. See also [Change Your Password and Custom Data](https://docs.mongodb.com/manual/tutorial/change-own-password-and-custom-data/).

  用户可以更改自己的密码。将此操作应用于数据库资源。另请参阅 [更改密码和自定义数据](https://docs.mongodb.com/manual/tutorial/change-own-password-and-custom-data/)。



- `changePassword`

  User can change the password of any user in the given database. Apply this action to database resources.

  用户可以更改给定数据库中任何用户的密码。将此操作应用于数据库资源。



- `createCollection`

  User can perform the [`db.createCollection()`](https://docs.mongodb.com/manual/reference/method/db.createCollection/#db.createCollection) method. Apply this action to database or collection resources.

  用户可以执行[`db.createCollection()`](https://docs.mongodb.com/manual/reference/method/db.createCollection/#db.createCollection)方法。将此操作应用于数据库或集合资源。



- `createIndex`

  Provides access to the [`db.collection.createIndex()`](https://docs.mongodb.com/manual/reference/method/db.collection.createIndex/#db.collection.createIndex) method and the [`createIndexes`](https://docs.mongodb.com/manual/reference/command/createIndexes/#dbcmd.createIndexes) command. Apply this action to database or collection resources.

  提供对[`db.collection.createIndex()`](https://docs.mongodb.com/manual/reference/method/db.collection.createIndex/#db.collection.createIndex)方法和[`createIndexes`](https://docs.mongodb.com/manual/reference/command/createIndexes/#dbcmd.createIndexes)命令的访问。将此操作应用于数据库或集合资源。



- `createRole`

  User can create new roles in the given database. Apply this action to database resources.

  用户可以在给定的数据库中创建新角色。将此操作应用于数据库资源。



- `createUser`

  User can create new users in the given database. Apply this action to database resources.

  用户可以在给定的数据库中创建新用户。将此操作应用于数据库资源。



- `dropCollection`

  User can perform the [`db.collection.drop()`](https://docs.mongodb.com/manual/reference/method/db.collection.drop/#db.collection.drop) method. Apply this action to database or collection resources.

  用户可以执行该[`db.collection.drop()`](https://docs.mongodb.com/manual/reference/method/db.collection.drop/#db.collection.drop)方法。将此操作应用于数据库或集合资源。



- `dropRole`

  User can delete any role from the given database. Apply this action to database resources.

  用户可以从给定的数据库中删除任何角色。将此操作应用于数据库资源。



- `dropUser`

  User can remove any user from the given database. Apply this action to database resources.

  用户可以从给定的数据库中删除任何用户。将此操作应用于数据库资源。



- `enableProfiler`

  User can perform the [`db.setProfilingLevel()`](https://docs.mongodb.com/manual/reference/method/db.setProfilingLevel/#db.setProfilingLevel) method. Apply this action to database resources.

  用户可以执行[`db.setProfilingLevel()`](https://docs.mongodb.com/manual/reference/method/db.setProfilingLevel/#db.setProfilingLevel)方法。将此操作应用于数据库资源。



- `grantRole`

  User can grant any role in the database to any user from any database in the system. Apply this action to database resources.

  用户可以将数据库中的任何角色从系统中的任何数据库授予任何用户。将此操作应用于数据库资源。



- `killCursors`

  Starting in MongoDB 4.2, users can always kill their own cursors, regardless of whether the users have the privilege to [`killCursors`](https://docs.mongodb.com/manual/reference/privilege-actions/#killCursors). As such, the [`killCursors`](https://docs.mongodb.com/manual/reference/privilege-actions/#killCursors) privilege has no effect in MongoDB 4.2+.In MongoDB 3.6.3 through MongoDB 4.0.x, users require [`killCursors`](https://docs.mongodb.com/manual/reference/privilege-actions/#killCursors) privilege to kill their own curors when access control is enabled. Cursors are associated with the users at the time of cursor creation. Apply this action to collection resources.

  从MongoDB 4.2开始，用户始终可以关闭自己的游标，而不管用户是否具有 [`killCursors`](https://docs.mongodb.com/manual/reference/privilege-actions/#killCursors)的权限。因此，该[`killCursors`](https://docs.mongodb.com/manual/reference/privilege-actions/#killCursors) 权限在MongoDB 4.2+中无效。

  在MongoDB 3.6.3到MongoDB 4.0.x中，[`killCursors`](https://docs.mongodb.com/manual/reference/privilege-actions/#killCursors)启用访问控制后，用户需要权限来关闭自己的游标。游标创建时，游标与用户相关联。将此操作应用于收集资源。



- `killAnyCursor`

  *New in version 3.6.3.*

  User can kill **any** cursor, even cursors created by other users. Apply this action to collection resources.

  版本3.6.3中的新功能。

  用户可以关闭**任何**游标，甚至可以关闭其他用户创建的游标。将此操作应用于收集资源。



- `revokeRole`

  User can remove any role from any user from any database in the system. Apply this action to database resources.

  用户可以从系统中任何数据库的任何用户中删除任何角色。将此操作应用于数据库资源。



- `setAuthenticationRestriction`

  

  *New in version 3.6.*

  User can specify the [authenticationRestrictions](https://docs.mongodb.com/manual/reference/command/createUser/#create-user-auth-restrictions) field in the `user` document when running the following commands:

  - [createUser](https://docs.mongodb.com/manual/reference/command/createUser/)
- [updateUser](https://docs.mongodb.com/manual/reference/command/updateUser/)
  
  User can specify the `authenticationRestrictions` field in the `role` document when running the following commands:

  - [createRole](https://docs.mongodb.com/manual/reference/command/createRole/)
- [updateRole](https://docs.mongodb.com/manual/reference/command/updateRole/)
  
  NOTE

  The following built-in roles grant this privilege:

  - The [`userAdmin`](https://docs.mongodb.com/manual/reference/built-in-roles/#userAdmin) role provides this privilege on the database that the role is assigned.
- The [`userAdminAnyDatabase`](https://docs.mongodb.com/manual/reference/built-in-roles/#userAdminAnyDatabase) role provides this privilege on all databases.
  
  Transitively, the [`restore`](https://docs.mongodb.com/manual/reference/built-in-roles/#restore) and [`root`](https://docs.mongodb.com/manual/reference/built-in-roles/#root) roles also provide this privilege.

  Apply this action to database resources.

  

  *3.6版的新功能。*

  运行以下命令时，用户可以在`user`文档中指定 [authenticationRestrictions](https://docs.mongodb.com/manual/reference/command/createUser/#create-user-auth-restrictions)字段：

  - [createUser](https://docs.mongodb.com/manual/reference/command/createUser/)
- [updateUser](https://docs.mongodb.com/manual/reference/command/updateUser/)
  
  运行以下命令时，用户可以`authenticationRestrictions`在`role`文档中指定字段 ：

  - [createRole](https://docs.mongodb.com/manual/reference/command/createRole/)
- [updateRole](https://docs.mongodb.com/manual/reference/command/updateRole/)
  
  注意

  以下内置角色授予此权限：

  - 该[`userAdmin`](https://docs.mongodb.com/manual/reference/built-in-roles/#userAdmin)角色提供对数据库的这一权限的角色分配。
- 该 [`userAdminAnyDatabase`](https://docs.mongodb.com/manual/reference/built-in-roles/#userAdminAnyDatabase)角色在所有数据库上提供此权限。
  
  在传递上，[`restore`](https://docs.mongodb.com/manual/reference/built-in-roles/#restore)和[`root`](https://docs.mongodb.com/manual/reference/built-in-roles/#root)角色也提供此特权。

  将此操作应用于数据库资源。



- `unlock`

  User can perform the [`db.fsyncUnlock()`](https://docs.mongodb.com/manual/reference/method/db.fsyncUnlock/#db.fsyncUnlock) method. Apply this action to the `cluster` resource.

  用户可以执行[`db.fsyncUnlock()`](https://docs.mongodb.com/manual/reference/method/db.fsyncUnlock/#db.fsyncUnlock)方法。将此操作应用于`cluster`资源。



- `viewRole`

  User can view information about any role in the given database. Apply this action to database resources.

  用户可以查看有关给定数据库中任何角色的信息。将此操作应用于数据库资源。



- `viewUser`

  User can view the information of any user in the given database. Apply this action to database resources.

  用户可以在给定的数据库中查看任何用户的信息。将此操作应用于数据库资源。



## Deployment Management Actions 部署管理操作[¶](https://docs.mongodb.com/manual/reference/privilege-actions/#deployment-management-actions)

- `authSchemaUpgrade`

  User can perform the `authSchemaUpgrade` command. Apply this action to the `cluster` resource.

  用户可以执行`authSchemaUpgrade`命令。将此操作应用于`cluster`资源。



- `cleanupOrphaned`

  User can perform the [`cleanupOrphaned`](https://docs.mongodb.com/manual/reference/command/cleanupOrphaned/#dbcmd.cleanupOrphaned) command. Apply this action to the `cluster` resource.

  用户可以执行[`cleanupOrphaned`](https://docs.mongodb.com/manual/reference/command/cleanupOrphaned/#dbcmd.cleanupOrphaned)命令。将此操作应用于`cluster`资源。



- `cpuProfiler`

  User can enable and use the CPU profiler. Apply this action to the `cluster` resource.

  用户可以启用和使用CPU分析器。将此操作应用于 `cluster`资源。



- `inprog`

  User can use the [`db.currentOp()`](https://docs.mongodb.com/manual/reference/method/db.currentOp/#db.currentOp) method to return information on pending and active operations. Apply this action to the `cluster` resource.*Changed in version 3.2.9:* Even without the [`inprog`](https://docs.mongodb.com/manual/reference/privilege-actions/#inprog) privilege, on [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instances, users can view their own operations by running `db.currentOp( { "$ownOps": true } )`.

  用户可以使用[`db.currentOp()`](https://docs.mongodb.com/manual/reference/method/db.currentOp/#db.currentOp)方法返回有关挂起和活动操作的信息。将此操作应用于`cluster`资源。

  *在版本3.2.9中进行了更改：*即使没有[`inprog`](https://docs.mongodb.com/manual/reference/privilege-actions/#inprog)权限，用户也可以在[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)实例上通过运行`db.currentOp( { "$ownOps": true } )`来查看自己的操作。



- `invalidateUserCache`

  Provides access to the [`invalidateUserCache`](https://docs.mongodb.com/manual/reference/command/invalidateUserCache/#dbcmd.invalidateUserCache) command. Apply this action to the `cluster` resource.

  提供对[`invalidateUserCache`](https://docs.mongodb.com/manual/reference/command/invalidateUserCache/#dbcmd.invalidateUserCache)命令的访问。将此操作应用于`cluster`资源。



- `killop`

  User can perform the [`db.killOp()`](https://docs.mongodb.com/manual/reference/method/db.killOp/#db.killOp) method. Apply this action to the `cluster` resource.*Changed in version 3.2.9:* Even without the [`killop`](https://docs.mongodb.com/manual/reference/privilege-actions/#killop) privilege, on [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instances, users can kill their own operations.

  用户可以执行[`db.killOp()`](https://docs.mongodb.com/manual/reference/method/db.killOp/#db.killOp)方法。将此操作应用于`cluster`资源。

  *在版本3.2.9中进行了更改：*即使没有[`killop`](https://docs.mongodb.com/manual/reference/privilege-actions/#killop)权限，在 [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)实例上，用户也可以关闭自己的操作。



- `planCacheRead`

  

  User can run the following operations:

  - [`$planCacheStats`](https://docs.mongodb.com/manual/reference/operator/aggregation/planCacheStats/#pipe._S_planCacheStats) aggregation stage.
  - [`planCacheListPlans`](https://docs.mongodb.com/manual/reference/command/planCacheListPlans/#dbcmd.planCacheListPlans) command and [`PlanCache.getPlansByQuery()`](https://docs.mongodb.com/manual/reference/method/PlanCache.getPlansByQuery/#PlanCache.getPlansByQuery) method.
  - [`planCacheListQueryShapes`](https://docs.mongodb.com/manual/reference/command/planCacheListQueryShapes/#dbcmd.planCacheListQueryShapes) command and the [`PlanCache.listQueryShapes()`](https://docs.mongodb.com/manual/reference/method/PlanCache.listQueryShapes/#PlanCache.listQueryShapes) method.

  Apply this action to database or collection resources.
  
  
  
  用户可以执行以下操作：
  
  - [`$planCacheStats`](https://docs.mongodb.com/manual/reference/operator/aggregation/planCacheStats/#pipe._S_planCacheStats) 聚集阶段。
  - [`planCacheListPlans`](https://docs.mongodb.com/manual/reference/command/planCacheListPlans/#dbcmd.planCacheListPlans)命令和 [`PlanCache.getPlansByQuery()`](https://docs.mongodb.com/manual/reference/method/PlanCache.getPlansByQuery/#PlanCache.getPlansByQuery)方法。
  - [`planCacheListQueryShapes`](https://docs.mongodb.com/manual/reference/command/planCacheListQueryShapes/#dbcmd.planCacheListQueryShapes)命令和 [`PlanCache.listQueryShapes()`](https://docs.mongodb.com/manual/reference/method/PlanCache.listQueryShapes/#PlanCache.listQueryShapes)方法。
  
  将此操作应用于数据库或集合资源。



- `planCacheWrite`

  User can perform the [`planCacheClear`](https://docs.mongodb.com/manual/reference/command/planCacheClear/#dbcmd.planCacheClear) command and the [`PlanCache.clear()`](https://docs.mongodb.com/manual/reference/method/PlanCache.clear/#PlanCache.clear) and [`PlanCache.clearPlansByQuery()`](https://docs.mongodb.com/manual/reference/method/PlanCache.clearPlansByQuery/#PlanCache.clearPlansByQuery) methods. Apply this action to database or collection resources.

  用户可以执行[`planCacheClear`](https://docs.mongodb.com/manual/reference/command/planCacheClear/#dbcmd.planCacheClear)命令以及 [`PlanCache.clear()`](https://docs.mongodb.com/manual/reference/method/PlanCache.clear/#PlanCache.clear)和[`PlanCache.clearPlansByQuery()`](https://docs.mongodb.com/manual/reference/method/PlanCache.clearPlansByQuery/#PlanCache.clearPlansByQuery) 方法。将此操作应用于数据库或集合资源。



- `storageDetails`

  User can perform the `storageDetails` command. Apply this action to database or collection resources.

  用户可以执行`storageDetails`命令。将此操作应用于数据库或集合资源。



## Change Stream Actions 变更流操作[¶](https://docs.mongodb.com/manual/reference/privilege-actions/#change-stream-actions)

- `changeStream`

  User with [`changeStream`](https://docs.mongodb.com/manual/reference/privilege-actions/#changeStream) and [`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find) on the specific collection, all non-`system` collections in a specifc database, or all non-`system` collections across all databases can open [change stream cursor](https://docs.mongodb.com/manual/changeStreams/) for that resource.

  用户在指定集合上使用[`changeStream`](https://docs.mongodb.com/manual/reference/privilege-actions/#changeStream)和[`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find)上，在指定数据库中的所有非`system`集合或所有数据库中的所有非`system`集合都可以为这些资源打开[变更流游标](https://docs.mongodb.com/manual/changeStreams/)。



## Replication Actions 复制操作[¶](https://docs.mongodb.com/manual/reference/privilege-actions/#replication-actions)

- `appendOplogNote`

  User can append notes to the oplog. Apply this action to the `cluster` resource.

  用户可以在操作日志中添加注释。将此操作应用于 `cluster`资源。



- `replSetConfigure`

  User can configure a replica set. Apply this action to the `cluster` resource.

  用户可以配置副本集。将此操作应用于`cluster` 资源。



- `replSetGetConfig`

  User can view a replica set’s configuration. Provides access to the [`replSetGetConfig`](https://docs.mongodb.com/manual/reference/command/replSetGetConfig/#dbcmd.replSetGetConfig) command and [`rs.conf()`](https://docs.mongodb.com/manual/reference/method/rs.conf/#rs.conf) helper method.Apply this action to the `cluster` resource.

  用户可以查看副本集的配置。提供对[`replSetGetConfig`](https://docs.mongodb.com/manual/reference/command/replSetGetConfig/#dbcmd.replSetGetConfig)命令和[`rs.conf()`](https://docs.mongodb.com/manual/reference/method/rs.conf/#rs.conf)辅助方法的访问 。

  将此操作应用于`cluster`资源。



- `replSetGetStatus`

  User can perform the [`replSetGetStatus`](https://docs.mongodb.com/manual/reference/command/replSetGetStatus/#dbcmd.replSetGetStatus) command. Apply this action to the `cluster` resource.

  用户可以执行[`replSetGetStatus`](https://docs.mongodb.com/manual/reference/command/replSetGetStatus/#dbcmd.replSetGetStatus)命令。将此操作应用于`cluster`资源。



- `replSetHeartbeat`

  User can perform the `replSetHeartbeat` command. Apply this action to the `cluster` resource.

  用户可以执行`replSetHeartbeat`命令。将此操作应用于`cluster`资源。



- `replSetStateChange`

  User can change the state of a replica set through the [`replSetFreeze`](https://docs.mongodb.com/manual/reference/command/replSetFreeze/#dbcmd.replSetFreeze), [`replSetMaintenance`](https://docs.mongodb.com/manual/reference/command/replSetMaintenance/#dbcmd.replSetMaintenance), [`replSetStepDown`](https://docs.mongodb.com/manual/reference/command/replSetStepDown/#dbcmd.replSetStepDown), and [`replSetSyncFrom`](https://docs.mongodb.com/manual/reference/command/replSetSyncFrom/#dbcmd.replSetSyncFrom) commands. Apply this action to the `cluster` resource.

  用户可以通过 [`replSetFreeze`](https://docs.mongodb.com/manual/reference/command/replSetFreeze/#dbcmd.replSetFreeze)，[`replSetMaintenance`](https://docs.mongodb.com/manual/reference/command/replSetMaintenance/#dbcmd.replSetMaintenance)， [`replSetStepDown`](https://docs.mongodb.com/manual/reference/command/replSetStepDown/#dbcmd.replSetStepDown)，和[`replSetSyncFrom`](https://docs.mongodb.com/manual/reference/command/replSetSyncFrom/#dbcmd.replSetSyncFrom) 命令改变一个副本集的状态。将此操作应用于`cluster`资源。



- `resync`

  User can perform the `resync` command. Apply this action to the `cluster` resource.

  用户可以执行`resync`命令。将此操作应用于`cluster`资源。





## Sharding Actions 分片操作[¶](https://docs.mongodb.com/manual/reference/privilege-actions/#sharding-actions)

- `addShard`

  User can perform the [`addShard`](https://docs.mongodb.com/manual/reference/command/addShard/#dbcmd.addShard) command. Apply this action to the `cluster` resource.

  用户可以执行[`addShard`](https://docs.mongodb.com/manual/reference/command/addShard/#dbcmd.addShard)命令。将此操作应用于`cluster`资源。



- `clearJumboFlag`

  *Available starting in 4.2.3 and 4.0.15*Required to clear a chunk’s jumbo flag using the [`clearJumboFlag`](https://docs.mongodb.com/manual/reference/command/clearJumboFlag/#dbcmd.clearJumboFlag) command. Apply this action to database or collection resources.Included in the [`clusterManager`](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterManager) built-in role.

  *从4.2.3和4.0.15开始可用*

  使用[`clearJumboFlag`](https://docs.mongodb.com/manual/reference/command/clearJumboFlag/#dbcmd.clearJumboFlag)命令清除块的巨型标志所必需 。将此操作应用于数据库或集合资源。

  包含在[`clusterManager`](https://docs.mongodb.com/manual/reference/built-in-roles/#clusterManager)内置角色中。



- `enableSharding`



> APPLICABLE RESOURCES
>
> The action can apply to either:
>
> - [Database](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-db) or [collection](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-db-collection) resource to enable sharding for a database or shard a collection.
> - [Cluster](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-collection) resource to perform various shard zone operations (Starting in version 4.2.2, 4.0.14, 3.6.16).



| Resources                                                    | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [Database](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-db) or[Collection](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-db-collection) | Grants users privileges to perform the following operations:Enable sharding on a database using the [`enableSharding`](https://docs.mongodb.com/manual/reference/command/enableSharding/#dbcmd.enableSharding) command, andShard a collection using the [`shardCollection`](https://docs.mongodb.com/manual/reference/command/shardCollection/#dbcmd.shardCollection) command. |
| [Cluster](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-collection)*Starting in version 4.2.2, 4.0.14, 3.6.16* | Grants users privileges to perform the following shard zone operations:[`addShardToZone`](https://docs.mongodb.com/manual/reference/command/addShardToZone/#dbcmd.addShardToZone)[`updateZoneKeyRange`](https://docs.mongodb.com/manual/reference/command/updateZoneKeyRange/#dbcmd.updateZoneKeyRange)[`removeShardFromZone`](https://docs.mongodb.com/manual/reference/command/removeShardFromZone/#dbcmd.removeShardFromZone)You can also perform these shard zone operations if you have [`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find)/[`update`](https://docs.mongodb.com/manual/reference/privilege-actions/#update) actions on the appropriate collections in the `config` database. Refer to the specific operations for details. |





> 适用资源
>
> 该操作可以应用于以下任一情况：
>
> - [数据库](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-db)或[集合](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-db-collection)资源，用于为数据库启用分片或对[集合](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-db-collection)进行分片。
> - [群集](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-collection)资源以执行各种分片区操作（从版本4.2.2、4.0.14、3.6.16开始）。



| 资源                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [数据库](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-db)或[集合](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-db-collection) | 授予用户执行以下操作的权限：使用以下[`enableSharding`](https://docs.mongodb.com/manual/reference/command/enableSharding/#dbcmd.enableSharding)命令在数据库上启用分片 ，然后使用[`shardCollection`](https://docs.mongodb.com/manual/reference/command/shardCollection/#dbcmd.shardCollection) 命令对集合进行分片。 |
| [群集](https://docs.mongodb.com/manual/reference/resource-document/#resource-specific-collection)*从版本4.2.2、4.0.14、3.6.16开始* | 授予用户执行以下分区域操作的权限：- [`addShardToZone`](https://docs.mongodb.com/manual/reference/command/addShardToZone/#dbcmd.addShardToZone)  - [`updateZoneKeyRange`](https://docs.mongodb.com/manual/reference/command/updateZoneKeyRange/#dbcmd.updateZoneKeyRange)  - [`removeShardFromZone`](https://docs.mongodb.com/manual/reference/command/removeShardFromZone/#dbcmd.removeShardFromZone)  如果对数据库中的相应集合执行[`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find)/ [`update`](https://docs.mongodb.com/manual/reference/privilege-actions/#update)操作，则还可以执行这些分片区 `config`操作。有关详细信息，请参见具体操作。 |



- `flushRouterConfig`

  User can perform the [`flushRouterConfig`](https://docs.mongodb.com/manual/reference/command/flushRouterConfig/#dbcmd.flushRouterConfig) command. Apply this action to the `cluster` resource.

  用户可以执行[`flushRouterConfig`](https://docs.mongodb.com/manual/reference/command/flushRouterConfig/#dbcmd.flushRouterConfig)命令。将此操作应用于`cluster`资源。



- `getShardMap`

  User can perform the [`getShardMap`](https://docs.mongodb.com/manual/reference/command/getShardMap/#dbcmd.getShardMap) command. Apply this action to the `cluster` resource.

  用户可以执行[`getShardMap`](https://docs.mongodb.com/manual/reference/command/getShardMap/#dbcmd.getShardMap)命令。将此操作应用于`cluster`资源。



- `getShardVersion`

  User can perform the [`getShardVersion`](https://docs.mongodb.com/manual/reference/command/getShardVersion/#dbcmd.getShardVersion) command. Apply this action to database resources.

  用户可以执行[`getShardVersion`](https://docs.mongodb.com/manual/reference/command/getShardVersion/#dbcmd.getShardVersion)命令。将此操作应用于数据库资源。



- `listShards`

  User can perform the [`listShards`](https://docs.mongodb.com/manual/reference/command/listShards/#dbcmd.listShards) command. Apply this action to the `cluster` resource.

  用户可以执行[`listShards`](https://docs.mongodb.com/manual/reference/command/listShards/#dbcmd.listShards)命令。将此操作应用于`cluster`资源。



- `moveChunk`

  User can perform the [`moveChunk`](https://docs.mongodb.com/manual/reference/command/moveChunk/#dbcmd.moveChunk) command. In addition, user can perform the [`movePrimary`](https://docs.mongodb.com/manual/reference/command/movePrimary/#dbcmd.movePrimary) command provided that the privilege is applied to an appropriate database resource. Apply this action to database or collection resources.

  用户可以执行[`moveChunk`](https://docs.mongodb.com/manual/reference/command/moveChunk/#dbcmd.moveChunk)命令。此外，如果将权限应用于适当的数据库资源，则用户可以执行[`movePrimary`](https://docs.mongodb.com/manual/reference/command/movePrimary/#dbcmd.movePrimary)命令。将此操作应用于数据库或集合资源。



- `removeShard`

  User can perform the [`removeShard`](https://docs.mongodb.com/manual/reference/command/removeShard/#dbcmd.removeShard) command. Apply this action to the `cluster` resource.

  用户可以执行[`removeShard`](https://docs.mongodb.com/manual/reference/command/removeShard/#dbcmd.removeShard)命令。将此操作应用于`cluster`资源。



- `shardingState`

  User can perform the [`shardingState`](https://docs.mongodb.com/manual/reference/command/shardingState/#dbcmd.shardingState) command. Apply this action to the `cluster` resource.

  用户可以执行[`shardingState`](https://docs.mongodb.com/manual/reference/command/shardingState/#dbcmd.shardingState)命令。将此操作应用于`cluster`资源。



- `splitChunk`

  User can perform the [`splitChunk`](https://docs.mongodb.com/manual/reference/command/splitChunk/#dbcmd.splitChunk) command and the [`mergeChunks`](https://docs.mongodb.com/manual/reference/command/mergeChunks/#dbcmd.mergeChunks) command. Apply this action to database or collection resources.

  用户可以执行[`splitChunk`](https://docs.mongodb.com/manual/reference/command/splitChunk/#dbcmd.splitChunk)命令和 [`mergeChunks`](https://docs.mongodb.com/manual/reference/command/mergeChunks/#dbcmd.mergeChunks)命令。将此操作应用于数据库或集合资源。



- `splitVector`

  User can perform the [`splitVector`](https://docs.mongodb.com/manual/reference/command/splitVector/#dbcmd.splitVector) command. Apply this action to database or collection resources.

  用户可以执行[`splitVector`](https://docs.mongodb.com/manual/reference/command/splitVector/#dbcmd.splitVector)命令。将此操作应用于数据库或集合资源。



## Server Administration Actions 服务器管理操作[¶](https://docs.mongodb.com/manual/reference/privilege-actions/#server-administration-actions)

- `applicationMessage`

  User can perform the [`logApplicationMessage`](https://docs.mongodb.com/manual/reference/command/logApplicationMessage/#dbcmd.logApplicationMessage) command. Apply this action to the `cluster` resource.

  用户可以执行[`logApplicationMessage`](https://docs.mongodb.com/manual/reference/command/logApplicationMessage/#dbcmd.logApplicationMessage)命令。将此操作应用于`cluster`资源。



- `closeAllDatabases`

  User can perform the `closeAllDatabases` command. Apply this action to the `cluster` resource.

  用户可以执行`closeAllDatabases`命令。将此操作应用于`cluster`资源。



- `collMod`

  User can perform the [`collMod`](https://docs.mongodb.com/manual/reference/command/collMod/#dbcmd.collMod) command. Apply this action to database or collection resources.

  用户可以执行[`collMod`](https://docs.mongodb.com/manual/reference/command/collMod/#dbcmd.collMod)命令。将此操作应用于数据库或集合资源。



- `compact`

  User can perform the [`compact`](https://docs.mongodb.com/manual/reference/command/compact/#dbcmd.compact) command. Apply this action to database or collection resources.

  用户可以执行[`compact`](https://docs.mongodb.com/manual/reference/command/compact/#dbcmd.compact)命令。将此操作应用于数据库或集合资源。



- `connPoolSync`

  User can perform the [`connPoolSync`](https://docs.mongodb.com/manual/reference/command/connPoolSync/#dbcmd.connPoolSync) command. Apply this action to the `cluster` resource.

  用户可以执行[`connPoolSync`](https://docs.mongodb.com/manual/reference/command/connPoolSync/#dbcmd.connPoolSync)命令。将此操作应用于`cluster`资源。



- `convertToCapped`

  User can perform the [`convertToCapped`](https://docs.mongodb.com/manual/reference/command/convertToCapped/#dbcmd.convertToCapped) command. Apply this action to database or collection resources.

  用户可以执行[`convertToCapped`](https://docs.mongodb.com/manual/reference/command/convertToCapped/#dbcmd.convertToCapped)命令。将此操作应用于数据库或集合资源。



- `dropConnections`

  User can perform the [`dropConnections`](https://docs.mongodb.com/manual/reference/command/dropConnections/#dbcmd.dropConnections) command. Apply this action to the `cluster` resource.

  用户可以执行[`dropConnections`](https://docs.mongodb.com/manual/reference/command/dropConnections/#dbcmd.dropConnections)命令。将此操作应用于`cluster`资源。



- `dropDatabase`

  User can perform the [`dropDatabase`](https://docs.mongodb.com/manual/reference/command/dropDatabase/#dbcmd.dropDatabase) command. Apply this action to database resources.

  用户可以执行[`dropDatabase`](https://docs.mongodb.com/manual/reference/command/dropDatabase/#dbcmd.dropDatabase)命令。将此操作应用于数据库资源。



- `dropIndex`

  User can perform the [`dropIndexes`](https://docs.mongodb.com/manual/reference/command/dropIndexes/#dbcmd.dropIndexes) command. Apply this action to database or collection resources.

  用户可以执行[`dropIndexes`](https://docs.mongodb.com/manual/reference/command/dropIndexes/#dbcmd.dropIndexes)命令。将此操作应用于数据库或集合资源。



- `forceUUID`

  *New in version 3.6.*User can create a collection with a user-defined [collection UUID](https://docs.mongodb.com/manual/core/databases-and-collections/#collections-uuids) using the [`applyOps`](https://docs.mongodb.com/manual/reference/command/applyOps/#dbcmd.applyOps) command.Apply this action to the `cluster` resource.

  *3.6版的新功能。*

  用户可以使用 [`applyOps`](https://docs.mongodb.com/manual/reference/command/applyOps/#dbcmd.applyOps)命令使用用户定义的[集合UUID](https://docs.mongodb.com/manual/core/databases-and-collections/#collections-uuids)创建集合。

  将此操作应用于`cluster`资源。



- `fsync`

  User can perform the [`fsync`](https://docs.mongodb.com/manual/reference/command/fsync/#dbcmd.fsync) command. Apply this action to the `cluster` resource.

  用户可以执行[`fsync`](https://docs.mongodb.com/manual/reference/command/fsync/#dbcmd.fsync)命令。将此操作应用于`cluster`资源。



- `getParameter`

  User can perform the [`getParameter`](https://docs.mongodb.com/manual/reference/command/getParameter/#dbcmd.getParameter) command. Apply this action to the `cluster` resource.

  用户可以执行[`getParameter`](https://docs.mongodb.com/manual/reference/command/getParameter/#dbcmd.getParameter)命令。将此操作应用于`cluster`资源。



- `hostInfo`

  Provides information about the server the MongoDB instance runs on. Apply this action to the `cluster` resource.

  提供有关运行MongoDB实例的服务器的信息。将此操作应用于`cluster`资源。



- `logRotate`

  User can perform the [`logRotate`](https://docs.mongodb.com/manual/reference/command/logRotate/#dbcmd.logRotate) command. Apply this action to the `cluster` resource.

  用户可以执行[`logRotate`](https://docs.mongodb.com/manual/reference/command/logRotate/#dbcmd.logRotate)命令。将此操作应用于`cluster`资源。



- `reIndex`

  User can perform the [`reIndex`](https://docs.mongodb.com/manual/reference/command/reIndex/#dbcmd.reIndex) command. Apply this action to database or collection resources.

  用户可以执行[`reIndex`](https://docs.mongodb.com/manual/reference/command/reIndex/#dbcmd.reIndex)命令。将此操作应用于数据库或集合资源。



- `renameCollectionSameDB`

  Allows the user to rename collections on the current database using the [`renameCollection`](https://docs.mongodb.com/manual/reference/command/renameCollection/#dbcmd.renameCollection) command. Apply this action to database resources.Additionally, the user must either *have* [`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find) on the source collection or *not have* [`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find) on the destination collection.If a collection with the new name already exists, the user must also have the [`dropCollection`](https://docs.mongodb.com/manual/reference/privilege-actions/#dropCollection) action on the destination collection.

  允许用户使用[`renameCollection`](https://docs.mongodb.com/manual/reference/command/renameCollection/#dbcmd.renameCollection)命令在当前数据库上重命名集合 。将此操作应用于数据库资源。

  此外，用户必须*拥有* [`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find)源集合或者*没有* [`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find)目标集合。

  如果已经存在使用新名称的集合，则用户还必须使用[`dropCollection`](https://docs.mongodb.com/manual/reference/privilege-actions/#dropCollection)对目标集合执行操作。



- `setParameter`

  User can perform the [`setParameter`](https://docs.mongodb.com/manual/reference/command/setParameter/#dbcmd.setParameter) command. Apply this action to the `cluster` resource.

  用户可以执行[`setParameter`](https://docs.mongodb.com/manual/reference/command/setParameter/#dbcmd.setParameter)命令。将此操作应用于`cluster`资源。



- `shutdown`

  User can perform the [`shutdown`](https://docs.mongodb.com/manual/reference/command/shutdown/#dbcmd.shutdown) command. Apply this action to the `cluster` resource.

  用户可以执行[`shutdown`](https://docs.mongodb.com/manual/reference/command/shutdown/#dbcmd.shutdown)命令。将此操作应用于`cluster`资源。



- `touch`

  User can perform the `touch` command. Apply this action to the `cluster` resource.

  用户可以执行`touch`命令。将此操作应用于`cluster`资源。



## Session Actions 会话的操作[¶](https://docs.mongodb.com/manual/reference/privilege-actions/#session-actions)

- `impersonate`

  *New in version 3.6.*

  User can perform the [`killAllSessionsByPattern`](https://docs.mongodb.com/manual/reference/command/killAllSessionsByPattern/#dbcmd.killAllSessionsByPattern) command with `users` and `roles` pattern. Apply this action to the `cluster` resource.To run [`killAllSessionsByPattern`](https://docs.mongodb.com/manual/reference/command/killAllSessionsByPattern/#dbcmd.killAllSessionsByPattern) command, users must also have [`killAnySession`](https://docs.mongodb.com/manual/reference/privilege-actions/#killAnySession) privileges on the cluster resource.

  *3.6版的新功能。*

  用户可以使用`users`和`roles`模式执行[`killAllSessionsByPattern`](https://docs.mongodb.com/manual/reference/command/killAllSessionsByPattern/#dbcmd.killAllSessionsByPattern)命令。将此操作应用于 `cluster`资源。

  要运行[`killAllSessionsByPattern`](https://docs.mongodb.com/manual/reference/command/killAllSessionsByPattern/#dbcmd.killAllSessionsByPattern)命令，用户还必须对群集资源具有[`killAnySession`](https://docs.mongodb.com/manual/reference/privilege-actions/#killAnySession)权限。



- `listSessions`

  *New in version 3.6.*

  User can perform the [`$listSessions`](https://docs.mongodb.com/manual/reference/operator/aggregation/listSessions/#pipe._S_listSessions) operation or [`$listLocalSessions`](https://docs.mongodb.com/manual/reference/operator/aggregation/listLocalSessions/#pipe._S_listLocalSessions) operation for all users or specified user(s). Apply this action to the `cluster` resource.

  *3.6版的新功能。*

  用户可以为所有用户或指定用户执行[`$listSessions`](https://docs.mongodb.com/manual/reference/operator/aggregation/listSessions/#pipe._S_listSessions)一项或 [`$listLocalSessions`](https://docs.mongodb.com/manual/reference/operator/aggregation/listLocalSessions/#pipe._S_listLocalSessions)多项操作。将此操作应用于`cluster`资源。



- `killAnySession`

  *New in version 3.6.*

  User can perform the  and the [`killAllSessionsByPattern`](https://docs.mongodb.com/manual/reference/command/killAllSessionsByPattern/#dbcmd.killAllSessionsByPattern) command. Apply this action to the `cluster` resource.

  SEE ALSO[`impersonate`](https://docs.mongodb.com/manual/reference/privilege-actions/#impersonate)

  *3.6版的新功能。*

  用户可以执行[`killAllSessions`](https://docs.mongodb.com/manual/reference/command/killAllSessions/#dbcmd.killAllSessions)和 [`killAllSessionsByPattern`](https://docs.mongodb.com/manual/reference/command/killAllSessionsByPattern/#dbcmd.killAllSessionsByPattern)命令。将此操作应用于`cluster`资源。

  也可以看看[`impersonate`](https://docs.mongodb.com/manual/reference/privilege-actions/#impersonate)



## Free Monitoring Actions 免费的监控操作[¶](https://docs.mongodb.com/manual/reference/privilege-actions/#free-monitoring-actions)

- `checkFreeMonitoringStatus`

  User with this action on the `cluster` resource can check the status of [Free Monitoring](https://docs.mongodb.com/manual/administration/free-monitoring/).

  *New in version 4.0.*

  对`cluster`资源执行此操作的用户可以检查“ [免费监控”](https://docs.mongodb.com/manual/administration/free-monitoring/)的状态。

  *4.0版本中的新功能。*



- `setFreeMonitoring`

  User with this action on the `cluster` resource can enable or disable [Free Monitoring](https://docs.mongodb.com/manual/administration/free-monitoring/).

  *New in version 4.0.*

  对`cluster`资源执行此操作的用户可以启用或禁用“ [免费监控”](https://docs.mongodb.com/manual/administration/free-monitoring/)。

  *4.0版本中的新功能。*





## Diagnostic Actions 诊断操作[¶](https://docs.mongodb.com/manual/reference/privilege-actions/#diagnostic-actions)

- `collStats`

  User can perform the [`collStats`](https://docs.mongodb.com/manual/reference/command/collStats/#dbcmd.collStats) command. Apply this action to database or collection resources.

  用户可以执行[`collStats`](https://docs.mongodb.com/manual/reference/command/collStats/#dbcmd.collStats)命令。将此操作应用于数据库或集合资源。



- `connPoolStats`

  User can perform the [`connPoolStats`](https://docs.mongodb.com/manual/reference/command/connPoolStats/#dbcmd.connPoolStats) and [`shardConnPoolStats`](https://docs.mongodb.com/manual/reference/command/shardConnPoolStats/#dbcmd.shardConnPoolStats) commands. Apply this action to the `cluster` resource.

  用户可以执行[`connPoolStats`](https://docs.mongodb.com/manual/reference/command/connPoolStats/#dbcmd.connPoolStats)和[`shardConnPoolStats`](https://docs.mongodb.com/manual/reference/command/shardConnPoolStats/#dbcmd.shardConnPoolStats) 命令。将此操作应用于`cluster`资源。



- `cursorInfo`

  User can perform the [`cursorInfo`](https://docs.mongodb.com/manual/reference/command/cursorInfo/#dbcmd.cursorInfo) command. Apply this action to the `cluster` resource.

  用户可以执行[`cursorInfo`](https://docs.mongodb.com/manual/reference/command/cursorInfo/#dbcmd.cursorInfo)命令。将此操作应用于`cluster`资源。



- `dbHash`

  User can perform the [`dbHash`](https://docs.mongodb.com/manual/reference/command/dbHash/#dbcmd.dbHash) command. Apply this action to database or collection resources.

  用户可以执行[`dbHash`](https://docs.mongodb.com/manual/reference/command/dbHash/#dbcmd.dbHash)命令。将此操作应用于数据库或集合资源。



- `dbStats`

  User can perform the [`dbStats`](https://docs.mongodb.com/manual/reference/command/dbStats/#dbcmd.dbStats) command. Apply this action to database resources.

  用户可以执行[`dbStats`](https://docs.mongodb.com/manual/reference/command/dbStats/#dbcmd.dbStats)命令。将此操作应用于数据库资源。



- `getCmdLineOpts`

  User can perform the [`getCmdLineOpts`](https://docs.mongodb.com/manual/reference/command/getCmdLineOpts/#dbcmd.getCmdLineOpts) command. Apply this action to the `cluster` resource.

  用户可以执行[`getCmdLineOpts`](https://docs.mongodb.com/manual/reference/command/getCmdLineOpts/#dbcmd.getCmdLineOpts)命令。将此操作应用于`cluster`资源。



- `getLog`

  User can perform the [`getLog`](https://docs.mongodb.com/manual/reference/command/getLog/#dbcmd.getLog) command. Apply this action to the `cluster` resource.

  用户可以执行[`getLog`](https://docs.mongodb.com/manual/reference/command/getLog/#dbcmd.getLog)命令。将此操作应用于`cluster`资源。



- `indexStats`

  User can perform the `indexStats` command. Apply this action to database or collection resources.*Changed in version 3.0:* MongoDB 3.0 removes the `indexStats` command.

  用户可以执行`indexStats`命令。将此操作应用于数据库或集合资源。

  *在版本3.0*中进行了*更改：* MongoDB 3.0删除了该`indexStats`命令。



- `listDatabases`

  User can perform the [`listDatabases`](https://docs.mongodb.com/manual/reference/command/listDatabases/#dbcmd.listDatabases) command. Apply this action to the `cluster` resource.

- For MongoDB 4.0.6+:

  If the user does not have the [`listDatabases`](https://docs.mongodb.com/manual/reference/privilege-actions/#listDatabases) privilege action, users can run the [`listDatabases`](https://docs.mongodb.com/manual/reference/command/listDatabases/#dbcmd.listDatabases) command to return a list of databases for which the user has privileges (including databases for which the user has privileges on specific collections) if the command is run with `authorizedDatabases` option unspecified or set to `true`.

- For MongoDB 4.0.5:

  If the user does not have the [`listDatabases`](https://docs.mongodb.com/manual/reference/privilege-actions/#listDatabases) privilege action, users can run the [`listDatabases`](https://docs.mongodb.com/manual/reference/command/listDatabases/#dbcmd.listDatabases) command to return a list of databases for which the user has the [`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find) action privilege if the command is run with `authorizedDatabases` option unspecified or set to `true`.

- For MongoDB 4.0.0-4.0.4:

  If the user does not have the [`listDatabases`](https://docs.mongodb.com/manual/reference/privilege-actions/#listDatabases) privilege action, users can run the [`listDatabases`](https://docs.mongodb.com/manual/reference/command/listDatabases/#dbcmd.listDatabases) command to return a list of databases for which the user has the [`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find) action privilege.

  

  用户可以执行[`listDatabases`](https://docs.mongodb.com/manual/reference/command/listDatabases/#dbcmd.listDatabases)命令。将此操作应用于`cluster`资源。

- 对于MongoDB 4.0.6+：

  如果用户没有[`listDatabases`](https://docs.mongodb.com/manual/reference/privilege-actions/#listDatabases) 操作权限，则如果运行[`listDatabases`](https://docs.mongodb.com/manual/reference/command/listDatabases/#dbcmd.listDatabases) 命令时`authorizedDatabases`未指定或设置选项为`true`，则用户可以运行该命令以返回该用户具有权限的数据库的列表（包括该用户对特定集合具有权限的数据库）。 

- 对于MongoDB 4.0.5：

  如果用户没有[`listDatabases`](https://docs.mongodb.com/manual/reference/privilege-actions/#listDatabases) 操作权限，则在`authorizedDatabases`命令未指定选项或设置为`true`的情况下运行[`listDatabases`](https://docs.mongodb.com/manual/reference/command/listDatabases/#dbcmd.listDatabases) 命令时，用户可以运行该命令以返回该用户对其具有[`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find)操作权限的数据库的列表 。

- 对于MongoDB 4.0.0-4.0.4：

  如果用户没有[`listDatabases`](https://docs.mongodb.com/manual/reference/privilege-actions/#listDatabases) 操作权限，则用户可以运行[`listDatabases`](https://docs.mongodb.com/manual/reference/command/listDatabases/#dbcmd.listDatabases) 命令以返回该用户对其具有[`find`](https://docs.mongodb.com/manual/reference/privilege-actions/#find)操作权限的数据库列表 。



- `listCollections`

  User can perform the [`listCollections`](https://docs.mongodb.com/manual/reference/command/listCollections/#dbcmd.listCollections) command. Apply this action to database resources.NOTEStarting in version 4.0, user without the required privilege can run the [`listCollections`](https://docs.mongodb.com/manual/reference/command/listCollections/#dbcmd.listCollections) command with **both** `authorizedCollections` and `nameOnly` options set to `true`. In this case, the command returns just the name and type of the collection(s) to which the user has privileges.

  

  用户可以执行[`listCollections`](https://docs.mongodb.com/manual/reference/command/listCollections/#dbcmd.listCollections)命令。将此操作应用于数据库资源。

  > 注意
  >
  > 从4.0版本开始，没有所需权限的用户可以**在** `authorizedCollections`和`nameOnly`选项都设置为`true`的情况下运行[`listCollections`](https://docs.mongodb.com/manual/reference/command/listCollections/#dbcmd.listCollections)命令。在这种情况下，该命令仅返回用户具有特权的集合的名称和类型。



- `listIndexes`

  User can perform the [`listIndexes`](https://docs.mongodb.com/manual/reference/command/listIndexes/#dbcmd.listIndexes) command. Apply this action to database or collection resources.

  用户可以执行[`listIndexes`](https://docs.mongodb.com/manual/reference/command/listIndexes/#dbcmd.listIndexes)命令。将此操作应用于数据库或集合资源。



- `netstat`

  User can perform the [`netstat`](https://docs.mongodb.com/manual/reference/command/netstat/#dbcmd.netstat) command. Apply this action to the `cluster` resource.

  用户可以执行[`netstat`](https://docs.mongodb.com/manual/reference/command/netstat/#dbcmd.netstat)命令。将此操作应用于`cluster`资源。



- `serverStatus`

  User can perform the [`serverStatus`](https://docs.mongodb.com/manual/reference/command/serverStatus/#dbcmd.serverStatus) command. Apply this action to the `cluster` resource.

  用户可以执行[`serverStatus`](https://docs.mongodb.com/manual/reference/command/serverStatus/#dbcmd.serverStatus)命令。将此操作应用于`cluster`资源。



- `validate`

  User can perform the [`validate`](https://docs.mongodb.com/manual/reference/command/validate/#dbcmd.validate) command. Apply this action to database or collection resources.

  用户可以执行[`validate`](https://docs.mongodb.com/manual/reference/command/validate/#dbcmd.validate)命令。将此操作应用于数据库或集合资源。



- `top`

  User can perform the [`top`](https://docs.mongodb.com/manual/reference/command/top/#dbcmd.top) command. Apply this action to the `cluster` resource.

  用户可以执行[`top`](https://docs.mongodb.com/manual/reference/command/top/#dbcmd.top)命令。将此操作应用于 `cluster`资源。





## Internal Actions 内部操作[¶](https://docs.mongodb.com/manual/reference/privilege-actions/#internal-actions)

- `anyAction`

  Allows any action on a resource. **Do not** assign this action unless it is absolutely necessary.

  允许对资源执行任何操作。除非绝对必要，否则**不要**分配此操作。



- `internal`

  Allows internal actions. **Do not** assign this action unless it is absolutely necessary.

  允许内部动作。除非绝对必要，否则**不要**分配此操作。





原文链接：https://docs.mongodb.com/manual/reference/privilege-actions/

