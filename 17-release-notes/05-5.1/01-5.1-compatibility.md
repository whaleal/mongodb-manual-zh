# MongoDB 5.1中的兼容性变化

> 重要：
>
> MongoDB 5.1是一个快速版本，仅支持MongoDB Atlas。MongoDB 5.1不支持在本地使用。有关更多信息，请参阅[MongoDB版本控制。](https://www.mongodb.com/docs/upcoming/reference/versioning/#std-label-release-version-numbers)

以下5.1更改可能会影响与旧版本MongoDB的兼容性。

## 删除操作符

从MongoDB 5.1开始，删除这些运算符：

| 删除了操作符           | 替代品                                                       |
| ---------------------- | ------------------------------------------------------------ |
| $comment               | [`cursor.comment()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.comment/#mongodb-method-cursor.comment) |
| $explain               | [`cursor.explain()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.explain/#mongodb-method-cursor.explain) |
| $hint                  | [`cursor.hint()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.hint/#mongodb-method-cursor.hint) |
| $max                   | [`cursor.max()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.max/#mongodb-method-cursor.max) |
| $maxTimeMS             | [`cursor.maxTimeMS()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.maxTimeMS/#mongodb-method-cursor.maxTimeMS) |
| $min                   | [`cursor.min()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.min/#mongodb-method-cursor.min) |
| $orderby               | [`cursor.sort()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.sort/#mongodb-method-cursor.sort) |
| $query                 | 看 [Cursor Methods](https://www.mongodb.com/docs/upcoming/reference/method/js-cursor/#std-label-doc-cursor-methods) |
| $returnKey             | [`cursor.returnKey()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.returnKey/#mongodb-method-cursor.returnKey) |
| $showDiskLoc           | [`cursor.showRecordId()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.showRecordId/#mongodb-method-cursor.showRecordId) |
| `db.getLastError()`    | 看 [Legacy Opcodes Removed](https://www.mongodb.com/docs/upcoming/release-notes/5.1-compatibility/#std-label-legacy-op-codes-removed) |
| `db.getLastErrorObj()` | 看 [Legacy Opcodes Removed](https://www.mongodb.com/docs/upcoming/release-notes/5.1-compatibility/#std-label-legacy-op-codes-removed) |
| `getLastError`         | 看 [Legacy Opcodes Removed](https://www.mongodb.com/docs/upcoming/release-notes/5.1-compatibility/#std-label-legacy-op-codes-removed) |

## 移除了参数

MongoDB 5.1删除了以下服务器参数：

| 移除了参数                                                   | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`--tlsFIPSMode`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--tlsFIPSMode) | 此选项已从MongoDB社区版中删除。可在[MongoDB企业](http://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server)版本。FIPS不是MongoDB社区版中支持的功能。如果您的安装无论如何都使用FIPS，则在升级之前，您需要[重新配置TLS/SSL连接](https://www.mongodb.com/docs/upcoming/tutorial/configure-ssl/)。 |

MongoDB 5.1从mongo shell中删除了以下参数：

| 移除了参数            | 描述                                                         |
| :-------------------- | :----------------------------------------------------------- |
| `--useLegacyWriteOps` | 移除了使用OP_INSERT、OP_UPDATE和OP_DELETE的功能。shell将仅使用OP_MSG写入命令。 |
| `--writeMode`         | 移除了使用OP_INSERT、OP_UPDATE和OP_DELETE的功能。shell将仅使用OP_MSG写入命令。 |
| `--readMode`          | 使用OP_QUERY遗留查找的功能被删除。shell将仅使用OP_MSG查找命令。 |
| `--rpcProtocols`      | 删除了对OP_QUERY RPC协议的支持。shell将始终使用OP_MSG RPC协议。 |

### `$setWindowFields`阶段，包含事务和快照读取问题

在5.3之前的MongoDB版本中，[`$setWindowFields`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/setWindowFields/#mongodb-pipeline-pipe.-setWindowFields)聚合管道阶段不能与[事务](https://www.mongodb.com/docs/upcoming/core/transactions/#std-label-transactions)或[`"snapshot"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)读取问题一起使用。

## 副本集

### 启动或添加碎片时，断言群集范围写入关注已设置

从MongoDB 5.1开始，在启动、重新启动或添加[shard server ](https://www.mongodb.com/docs/upcoming/sharding/)withsh[`sh.addShard()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.addShard/#mongodb-method-sh.addShard)时，必须设置[集群宽写入关注（CWWC）。](https://www.mongodb.com/docs/upcoming/reference/command/setDefaultRWConcern/#std-label-set_global_default_write_concern)

如果未设置`CWWC`，并且碎片配置为[默认写入问题](https://www.mongodb.com/docs/upcoming/reference/write-concern/#std-label-write-concern)为`{ w : 1 }`，则碎片服务器将无法启动或添加，并返回错误。

有关如何计算默认写入问题的详细信息，请参阅默认写入问题计算。

### rs.reconfig群集范围写入关注确认

从MongoDB 5.1开始，您必须在发布任何[`reconfigs`](https://www.mongodb.com/docs/upcoming/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)前设置[集群宽写入关注（CWWC），](https://www.mongodb.com/docs/upcoming/reference/command/setDefaultRWConcern/#std-label-set_global_default_write_concern)否则将更改新[副本集](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-replica-set)成员的[默认写入关注](https://www.mongodb.com/docs/upcoming/reference/write-concern/#std-label-write-concern)。

### 仲裁员

季度快速发布版本不支持仲裁器。如果您的部署包含仲裁器，则仅使用LTS版本。

## 时间序列集合

> 警告：
>
> 如果您在MongoDB 5.1或更高版本中创建分片[时间序列集合](https://www.mongodb.com/docs/upcoming/core/timeseries-collections/#std-label-manual-timeseries-collection)，则降级到早于MongoDB 5.0.4的版本将导致数据丢失。
>
> 在降级到早于5.0.4的版本之前，请删除所有分片时间系列集合。

## 一般变化

### `$regex`查找查询 不再忽略无效的注册表达式

从MongoDB 5.1开始，无效的[`$regex options`](https://www.mongodb.com/docs/upcoming/reference/operator/query/regex/#mongodb-query-op.-regex)选项不再被忽略。此更改使[`$regex options`](https://www.mongodb.com/docs/upcoming/reference/operator/query/regex/#mongodb-query-op.-regex)与在[`aggregate`](https://www.mongodb.com/docs/upcoming/reference/command/aggregate/#mongodb-dbcommand-dbcmd.aggregate)命令和[投影](https://www.mongodb.com/docs/upcoming/tutorial/project-fields-from-query-results/#std-label-projection)查询中使用`$regex`更加一致。

### `$regex`架构验证错误行为

从MongoDB 5.1开始，如果集合具有包含无效[`$regex options`](https://www.mongodb.com/docs/upcoming/reference/operator/query/regex/#mongodb-query-op.-regex)的[模式验证](https://www.mongodb.com/docs/upcoming/core/schema-validation/specify-query-expression-rules/#std-label-schema-validation-query-expression)规则，则服务器：

- 阻止所有插入和更新操作，直到使用[`collMod`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令修改包含无效正则表达式模式的模式验证规则。
- 将警告错误写入[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)日志文件。

### FIPS模式默认SCRAM-SHA-1身份验证关闭

从MongoDB 5.1开始，在[FIPS模式下](https://www.mongodb.com/docs/upcoming/tutorial/configure-fips/#std-label-fips-overview)运行的实例默认禁用[SCRAM-SHA-1身份验证机制](https://www.mongodb.com/docs/upcoming/reference/parameters/#std-label-authentication-parameters)。您可以使用setParameter.authenticationMechanisms命令启用[SCRAM-SHA-1 身份验证机制](https://www.mongodb.com/docs/upcoming/reference/parameters/#std-label-authentication-parameters)。

此更改不会影响面向MongoDB [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion) 4.0+的驱动程序。

### `$mod`错误行为

从MongoDB 5.1（以及5.0.4和4.4.10）开始，如果`divisor`或`remainder`计算为某些值，[`$mod`](https://www.mongodb.com/docs/upcoming/reference/operator/query/mod/#mongodb-query-op.-mod)运算符会返回错误。See[$mod行为。](https://www.mongodb.com/docs/upcoming/reference/operator/query/mod/#std-label-mod-behavior)

### 旧版操作码已删除

自MongoDB v3.6以来，MongoDB驱动程序一直使用[OP_MSG](https://www.mongodb.com/docs/upcoming/reference/mongodb-wire-protocol/#std-label-wire-op-msg)而不是[OP_QUERY](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-query)和其他传统操作码。

此版本取消了对以下传统操作码的支持：

- [OP_INSERT](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-insert)
- [OP_DELETE](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-delete)
- [OP_更新](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-update)
- [OP_KILL_CURSORS](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-kill-cursors)
- [OP_GET_更多](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-get-more)
- [OP_QUERY](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-query)

为了避免因删除这些操作代码而中断，请将驱动程序升级到最新版本。

[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)将关闭连接，不会响应：

- [OP_INSERT](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-insert)
- [OP_DELETE](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-delete)
- [OP_更新](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-update)
- [OP_KILL_CURSORS](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-kill-cursors)

[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)将返回以下错误：

* [OP_GET_更多](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-get-more)
* [OP_QUERY](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-query)遗留查找

[OP_QUERY ](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-query)RPC协议可用于以下命令：

* `_isSelf`
* `authenticate`
* `buildinfo`
* `buildInfo`
* `hello`
* `ismaster`
* `isMaster`
* `saslContinue`
* `saslStart`

如果用于查找操作，[OP_QUERY](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-query)将返回错误。如果作为[OP_QUERY](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-query)发出，所有其他命令都将被拒绝[。](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-query)

如果您尝试使用MongoDB 5.1或更新的mongo shell连接到MongoDB 3.4或更早版本的mongod实例，您将收到如下错误消息：

```
Connection handshake failed. Is your mongod 3.4 or older?
:: caused by :: network error while attempting to run command
'isMaster' on host '127.0.0.1:27017'
```

## 平台支持

从MongoDB 5.1.2开始，不再支持以下平台。

### 社区版

- RHEL-72-s390x





原文：[Compatibility Changes in MongoDB 5.1](https://www.mongodb.com/docs/upcoming/release-notes/5.1-compatibility/)