# System-Event-Audit-Messages

<a name="O6a63"></a>
# System Event Audit Messages[¶](#system-event-audit-messages)
<a name="9FZd0"></a>
# 系统事件审核消息[¶](#system-event-audit-messages)
On this page<br />在本页

- [Audit Message](#audit-message)
- [Audit Event Actions, Details, and Results](#audit-event-actions-details-and-results)
- [审核消息](#audit-message)
- [审核事件操作，详情和结果](#audit-event-actions-details-and-results)

Note<br />注意<br />Available only in [MongoDB Enterprise](http://www.mongodb.com/products/mongodb-enterprise-advanced?jmp=docs) and [MongoDB Atlas](https://cloud.mongodb.com/user#/atlas/login).<br />仅在[MongoDB 企业版](http://www.mongodb.com/products/mongodb-enterprise-advanced?jmp=docs)和[MongoDB Atlas](https://cloud.mongodb.com/user#/atlas/login)可用。
<a name="38pzo"></a>
## Audit Message[¶](#audit-message)
<a name="s5Ryv"></a>
## 审核消息[¶](#audit-message)
The [event auditing feature](../../core/auditing/) can record events in JSON format. To configure auditing output, see [Configure Auditing](../../tutorial/configure-auditing/).<br />[事件审核功能](../../core/auditing/)可以用JSON格式记录事件。配置审核输出，请参阅[配置审核](../../tutorial/configure-auditing/)。<br />The recorded JSON messages have the following syntax:<br />记录的JSON消息格式如下：<br />copy
```js
{
  atype: <String>,
  ts : { "$date": <timestamp> },
  local: { ip: <String>, port: <int> },
  remote: { ip: <String>, port: <int> },
  users : [ { user: <String>, db: <String> }, ... ],
  roles: [ { role: <String>, db: <String> }, ... ],
  param: <document>,
  result: <int>
}
```
复制
```js
{
  atype: <String>,
  ts : { "$date": <timestamp> },
  local: { ip: <String>, port: <int> },
  remote: { ip: <String>, port: <int> },
  users : [ { user: <String>, db: <String> }, ... ],
  roles: [ { role: <String>, db: <String> }, ... ],
  param: <document>,
  result: <int>
}
```
| Field | Type | Description |
| :--- | :--- | :--- |
| `atype` | string | Action type. See [Audit Event Actions, Details, and Results](https://docs.mongodb.com/manual/reference/audit-message/index.html#audit-action-details-results). |
| `ts` | document | Document that contains the date and UTC time of the event, in ISO 8601 format. |
| `local` | document | Document that contains the local `ip` address and the `port` number of the running instance. |
| `remote` | document | Document that contains the remote `ip` address and the `port` number of the incoming connection associated with the event. |
| `users` | array | Array of user identification documents. Because MongoDB allows a session to log in with different user per database, this array can have more than one user. Each document contains a `user` field for the username and a `db` field for the authentication database for that user. |
| `roles` | array | Array of documents that specify the [roles](https://docs.mongodb.com/manual/core/authorization/) granted to the user. Each document contains a `role` field for the name of the role and a `db` field for the database associated with the role. |
| `param` | document | Specific details for the event. See [Audit Event Actions, Details, and Results](https://docs.mongodb.com/manual/reference/audit-message/index.html#audit-action-details-results). |
| `result` | integer | Error code. See [Audit Event Actions, Details, and Results](https://docs.mongodb.com/manual/reference/audit-message/index.html#audit-action-details-results). |

| 字段 | 类型 | 描述 |
| :---: | :---: | :--- |
| `atype` | string | 操作类型. 详情请看[审核事件操作，详情和结果](#audit-action-details-results). |
| `ts` | document | 文档包含日期和UTC时间格式为ISO 8601 |
| `local` | document | 文档包含运行实例本地IP和端口 |
| `remote` | document | 文档包含与事件相关的传入连接的远程ip和端口号 |
| `users` | array | 数组包含一组用户识别文档。由于MongoDB允许会话以每个数据库的不同用户身份登录，因此该数组可以包含多个用户。每个文档都包含user字段记录用户名和db字段记录验证该用户的数据库名 |
| `roles` | array | 数组包含文档，用于指定授予用户的角色。每个文档包含一个role字段记录角色名和一个db字段记录与该角色相关的数据库名 |
| `param` | document | 事件的详细信息。请看[审核事件操作，详情和结果](#audit-action-details-results). |
| `result` | integer | 错误码。请看[审核事件操作，详情和结果](#audit-action-details-results). |

<a name="fB7ya"></a>
## Audit Event Actions, Details, and Results[¶](#audit-event-actions-details-and-results)
<a name="W7Bsz"></a>
## 审核事件操作，详情和结果[¶](#audit-event-actions-details-and-results)
The following table lists for each `atype` or action type, the associated `param` details and the `result` values, if any.<br />下表列出了每种atype或操作类型，相关的param详细信息和result值(如果有)。

| `atype` | `param` | `result` |
| :--- | :--- | :--- |
| `authenticate` | '' | `0` - Success`18` - Authentication Failed |
| `authCheck` | `{ command: , ns: ., args: } ``ns` is optional.`args` field may be redacted.字段是可选的。args字段可能已经被修改了。 | `0` - Success`13` - Unauthorized to perform the operation.By default, the auditing system logs only the authorization failures. To enable the system to log authorization successes, use the [`auditAuthorizationSuccess`](https://docs.mongodb.com/manual/reference/parameters/#param.auditAuthorizationSuccess) parameter. [[1]](https://docs.mongodb.com/manual/reference/audit-message/index.html#performance)默认情况下，审核系统仅记录授权失败。要使系统记录授权成功，请使用[`auditAuthorizationSuccess`](https://docs.mongodb.com/manual/reference/parameters/#param.auditAuthorizationSuccess)参数。[[1]](https://docs.mongodb.com/manual/reference/audit-message/index.html#performance) |
| [`createCollection`](https://docs.mongodb.com/manual/reference/privilege-actions/#createCollection) | `{ ns: . }` | `0` - Success |
| `createDatabase` | `{ ns: }` | `0` - Success |
| [`createIndex`](https://docs.mongodb.com/manual/reference/privilege-actions/#createIndex) | `{ ns: ., indexName: , indexSpec: }` | `0` - Success |
| `renameCollection` | `{ old: ., new: . }` | `0` - Success |
| [`dropCollection`](https://docs.mongodb.com/manual/reference/privilege-actions/#dropCollection) | `{ ns: . }` | `0` - Success |
| [`dropDatabase`](https://docs.mongodb.com/manual/reference/privilege-actions/#dropDatabase) | `{ ns: }` | `0` - Success |
| [`dropIndex`](https://docs.mongodb.com/manual/reference/privilege-actions/#dropIndex) | `{ ns: ., indexName: }` | `0` - Success |
| [`createUser`](https://docs.mongodb.com/manual/reference/privilege-actions/#createUser) | `{ user: , db: , customData: , roles: [ { role: , db: }, ... ] }`The `customData` field is optional. | `0` - Success |
| [`dropUser`](https://docs.mongodb.com/manual/reference/privilege-actions/#dropUser) | `{ user: , db: }` | `0` - Success |
| `dropAllUsersFromDatabase` | `{ db: }` | `0` - Success |
| `updateUser` | `{ user: , db: , passwordChanged: , customData: , roles: [ { role: , db: }, ... ] }`The `customData` field is optional. | `0` - Success |
| `grantRolesToUser` | `{ user: , db: , roles: [ { role: , db: }, ... ] }` | `0` - Success |
| `revokeRolesFromUser` | `{ user: , db: , roles: [ { role: , db: }, ... ] }` | `0` - Success |
| [`createRole`](https://docs.mongodb.com/manual/reference/privilege-actions/#createRole) | `{ role: , db: , roles: [ { role: , db: }, ... ], privileges: [ { resource: , actions: [ , ... ] }, ... ] }`The `roles` and the `privileges` fields are optional.For details on the resource document, see [Resource Document](https://docs.mongodb.com/manual/reference/resource-document/#resource-document). For a list of actions, see [Privilege Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#security-user-actions).  roles和privileges字段是可选的，关于resource文档详情，请查看[Resource Document](https://docs.mongodb.com/manual/reference/resource-document/#resource-document).关于操作列表，请查看[Privilege Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#security-user-actions). | `0` - Success |
| `updateRole` | `{ role: , db: , roles: [ { role: , db: }, ... ], privileges: [ { resource: , actions: [ , ... ] }, ... ] }`The `roles` and the `privileges` fields are optional.For details on the resource document, see [Resource Document](https://docs.mongodb.com/manual/reference/resource-document/#resource-document). For a list of actions, see [Privilege Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#security-user-actions).roles和privileges字段是可选的。关于resource文档详情，请查看[Resource Document](https://docs.mongodb.com/manual/reference/resource-document/#resource-document).关于操作列表，请查看[Privilege Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#security-user-actions). | `0` - Success |
| [`dropRole`](https://docs.mongodb.com/manual/reference/privilege-actions/#dropRole) | `{ role: , db: }` | `0` - Success |
| `dropAllRolesFromDatabase` | `{ db: }` | `0` - Success |
| `grantRolesToRole` | `{ role: , db: , roles: [ { role: , db: }, ... ] }` | `0` - Success |
| `revokeRolesFromRole` | `{ role: , db: , roles: [ { role: , db: }, ... ] }` | `0` - Success |
| `grantPrivilegesToRole` | `{ role: , db: , privileges: [ { resource: , actions: [ , ... ] }, ... ] }`For details on the resource document, see [Resource Document](https://docs.mongodb.com/manual/reference/resource-document/#resource-document). For a list of actions, see [Privilege Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#security-user-actions).关于resource这个字段对应的文档，请查看[Resource Document](https://docs.mongodb.com/manual/reference/resource-document/#resource-document).关于操作列表，请查看[Privilege Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#security-user-actions). | `0` - Success |
| `revokePrivilegesFromRole` | `{ role: , db: , privileges: [ { resource: , actions: [ , ... ] }, ... ] }`For details on the resource document, see [Resource Document](https://docs.mongodb.com/manual/reference/resource-document/#resource-document). For a list of actions, see [Privilege Actions](https://docs.mongodb.com/manual/reference/privilege-actions/#security-user-actions). | `0` - Success |
| `replSetReconfig` | `{ old: { _id: , version: , ... members: [ ... ], settings: { ... } }, new: { _id: , version: , ... members: [ ... ], settings: { ... } } }`For details on the replica set configuration document, see [Replica Set Configuration](https://docs.mongodb.com/manual/reference/replica-configuration/). | `0` - Success |
| [`enableSharding`](https://docs.mongodb.com/manual/reference/privilege-actions/#enableSharding) | `{ ns: }` | `0` - Success |
| `shardCollection` | `{ ns: ., key: , options: { unique: } }` | `0` - Success |
| [`addShard`](https://docs.mongodb.com/manual/reference/privilege-actions/#addShard) | `{ shard: , connectionString: :, maxSize: }`When a shard is a replica set, the `connectionString` includes the replica set name and can include other members of the replica set.当分片是副本集时，connectionString包含副本集集群名字和可以包含其他副本集成员。 | `0` - Success |
| [`removeShard`](https://docs.mongodb.com/manual/reference/privilege-actions/#removeShard) | `{ shard: }` | `0` - Success |
| [`shutdown`](https://docs.mongodb.com/manual/reference/privilege-actions/#shutdown) | `{ }`Indicates commencement of database shutdown. 指明数据库开始关闭 | `0` - Success |
| [`applicationMessage`](https://docs.mongodb.com/manual/reference/privilege-actions/#applicationMessage) | `{ msg: }`See [`logApplicationMessage`](https://docs.mongodb.com/manual/reference/command/logApplicationMessage/#dbcmd.logApplicationMessage). | `0` - Success |

[[1]](#id1) Enabling [`auditAuthorizationSuccess`](../parameters/#param.auditAuthorizationSuccess) degrades performance more than logging only the authorization failures.<br />[[1]](#id1)启用[审核授权成功](../parameters/#param.auditAuthorizationSuccess)与仅记录授权失败相比，启用会使性能下降更多。<br />
<br />
<br />
