# MongoDB 6.0中的兼容性变化

本页面介绍了MongoDB 6.0中引入的可能影响与旧版本MongoDB兼容性的更改。

MongoDB 6.0是一个主要版本，这意味着它支持MongoDB Atlas和本地部署。MongoDB 6.0包括MongoDB快速版本5.1、5.2和5.3中引入的更改。本页面介绍了这些快速发布和MongoDB 6.0中引入的兼容性更改。

要了解有关Major和Rapid版本之间差异的更多信息，请参阅[MongoDB版本控制。](https://www.mongodb.com/docs/upcoming/reference/versioning/#std-label-release-version-numbers)

## 集合

### `allowDiskUse`变化

从MongoDB 6.0开始，默认情况下，需要超过100兆字节内存才能将临时文件写入磁盘的管道阶段。在MongoDB的早期版本中，您必须将`{ allowDiskUse: true }`传递给单个`find`和`aggregate`命令才能启用此行为。

单个find和aggregate命令可能会通过以下任一方式覆盖[`allowDiskUseByDefault`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.allowDiskUseByDefault)参数：

- 当`allowDiskUseByDefault`设置为`false`
- 当`allowDiskUseByDefault`设置为`true`

## 更改流

从MongoDB 5.3开始，在[范围迁移](https://www.mongodb.com/docs/upcoming/core/sharding-balancer-administration/#std-label-range-migration-procedure)期间，不会生成[更改流](https://www.mongodb.com/docs/upcoming/changeStreams/#std-label-changeStreams)事件以更新[孤儿文档](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-orphaned-document)。

## 索引

### 最后一个剩余的碎片密钥索引不能无意中删除

从MongoDB 6.0开始，将`"*"`传递给[`dropIndexes`](https://www.mongodb.com/docs/upcoming/reference/command/dropIndexes/#mongodb-dbcommand-dbcmd.dropIndexes)或[`db.collection.dropIndexes()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.dropIndexes/#mongodb-method-db.collection.dropIndexes)将删除**除**`_id`索引和最后一个剩余的碎片键索引（如果存在）以外的所有索引。尝试显式删除最后一个剩余的分键索引会引发错误

### 现有索引可以在索引构建期间删除

从MongoDB 5.2开始，您可以使用[`dropIndexes`](https://www.mongodb.com/docs/upcoming/reference/command/dropIndexes/#mongodb-dbcommand-dbcmd.dropIndexes)或[`db.collection.dropIndexes()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.dropIndexes/#mongodb-method-db.collection.dropIndexes)在同一集合上删除现有索引，即使正在构建索引。在早期版本中，尝试在正在进行的索引构建期间删除不同的索引会导致`BackgroundOperationInProgressForNamespace`错误。

### 2dsphere文档索引键

为了防止内存不足错误，[`indexMaxNumGeneratedKeysPerDocument`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.indexMaxNumGeneratedKeysPerDocument)限制了为单个文档生成的[2dsphere索引密钥](https://www.mongodb.com/docs/upcoming/geospatial-queries/#std-label-geo-2dsphere)的最大数量。

请参阅[`indexMaxNumGeneratedKeysPerDocument`。](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.indexMaxNumGeneratedKeysPerDocument)

## 移除了传统的`mongo`shell

MongoDB 6.0中删除了mongo shell。替代品是 [`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

## 平台支持

从MongoDB 5.1.2开始，不再支持以下平台：

### 社区版

- RHEL-72-s390x

## 正则表达式

### `$regex`查找查询 不再忽略无效的注册表达式

从MongoDB 5.1开始，无效的[`$regex options`](https://www.mongodb.com/docs/upcoming/reference/operator/query/regex/#mongodb-query-op.-regex)选项不再被忽略。此更改使[`$regex options`](https://www.mongodb.com/docs/upcoming/reference/operator/query/regex/#mongodb-query-op.-regex)与在[`aggregate`](https://www.mongodb.com/docs/upcoming/reference/command/aggregate/#mongodb-dbcommand-dbcmd.aggregate)命令和[投影](https://www.mongodb.com/docs/upcoming/tutorial/project-fields-from-query-results/#std-label-projection)查询中使用`$regex`更一致。

### `$regex`架构验证错误行为

从MongoDB 5.1开始，如果集合具有包含无效[`$regex options`](https://www.mongodb.com/docs/upcoming/reference/operator/query/regex/#mongodb-query-op.-regex)的[模式验证](https://www.mongodb.com/docs/upcoming/core/schema-validation/specify-query-expression-rules/#std-label-schema-validation-query-expression)规则，则服务器：

- 在使用[`collMod`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令修改包含无效正则表达式模式的模式验证规则之前，阻止所有插入和更新操作。
- 将警告错误写入[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)日志文件。

## 删除了操作员

从MongoDB 5.1开始，删除这些遗留查询运算符：

| 删除了操作员           | 替代品                                                       |
| :--------------------- | :----------------------------------------------------------- |
| $评论                  | [`cursor.comment()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.comment/#mongodb-method-cursor.comment) |
| $解释                  | [`cursor.explain()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.explain/#mongodb-method-cursor.explain) |
| $提示                  | [`cursor.hint()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.hint/#mongodb-method-cursor.hint) |
| 最大值                 | [`cursor.max()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.max/#mongodb-method-cursor.max) |
| $maxTimeMS             | [`cursor.maxTimeMS()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.maxTimeMS/#mongodb-method-cursor.maxTimeMS) |
| 最小                   | [`cursor.min()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.min/#mongodb-method-cursor.min) |
| $orderby               | [`cursor.sort()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.sort/#mongodb-method-cursor.sort) |
| $查询                  | 查看[光标方法](https://www.mongodb.com/docs/upcoming/reference/method/js-cursor/#std-label-doc-cursor-methods) |
| $returnKey             | [`cursor.returnKey()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.returnKey/#mongodb-method-cursor.returnKey) |
| $show磁盘Loc           | [`cursor.showRecordId()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.showRecordId/#mongodb-method-cursor.showRecordId) |
| `db.getLastError()`    | 看[旧版操作码已删除](https://www.mongodb.com/docs/upcoming/release-notes/6.0-compatibility/#std-label-legacy-op-codes-removed) |
| `db.getLastErrorObj()` | 看[旧版操作码已删除](https://www.mongodb.com/docs/upcoming/release-notes/6.0-compatibility/#std-label-legacy-op-codes-removed) |
| `getLastError`         | 看[旧版操作码已删除](https://www.mongodb.com/docs/upcoming/release-notes/6.0-compatibility/#std-label-legacy-op-codes-removed) |

## 删除了选项

MongoDB 6.0删除 了 `--cpu` [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod) 选项.

## 移除了参数

MongoDB 6.0删除了以下服务器参数：

| 删除了参数                                                   | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`--tlsFIPSMode`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--tlsFIPSMode) | 此选项已从MongoDB社区版中删除。它有MongoDB企业版。FIPS不是MongoDB社区版中支持的功能。如果您的安装无论如何都使用了FIPS，则在升级之前，您需要[重新配置TLS/SSL连接](https://www.mongodb.com/docs/upcoming/tutorial/configure-ssl/)。 |

## TTL `expireAfterSeconds`设置为`NaN`时的行为

将TTL `expireAfterSeconds`设置为`NaN`会经历从MongoDB 4.4到MongoDB 6.0的行为变化，这会影响MongoDB 4.4及更早版本的初始同步以及MongoDB 4.4及更早版本的[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)。执行任何这些操作都会导致将值为NaN的`expireAfterSeconds`视为值为0的`expireAfterSeconds`。因此，可能会发生文档立即过期的情况。

## 副本集

### 启动或添加碎片时，断言群集范围写入关注已设置

从MongoDB 5.1开始，在启动、重新启动或添加[shard server ](https://www.mongodb.com/docs/upcoming/sharding/)withsh[`sh.addShard()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.addShard/#mongodb-method-sh.addShard)时，必须设置[集群宽写入关注（CWWC）。](https://www.mongodb.com/docs/upcoming/reference/command/setDefaultRWConcern/#std-label-set_global_default_write_concern)

如果未设置`CWWC`，并且碎片配置为[默认写入问题](https://www.mongodb.com/docs/upcoming/reference/write-concern/#std-label-write-concern)为`{ w : 1 }`，则碎片服务器将无法启动或添加，并返回错误。

有关如何计算默认写入问题的详细信息，请参阅默认写入问题计算。

### `rs.reconfig`集群宽写入问题验证

从MongoDB 5.1开始，您必须先设置[集群宽写入关注（CWWC），](https://www.mongodb.com/docs/upcoming/reference/command/setDefaultRWConcern/#std-label-set_global_default_write_concern)然后发布任何[`reconfigs`](https://www.mongodb.com/docs/upcoming/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)，否则将更改新[副本集](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-replica-set)成员的[默认写入关注](https://www.mongodb.com/docs/upcoming/reference/write-concern/#std-label-write-concern)。

## 安全

### 群集内身份验证

从MongoDB 5.3开始，[SCRAM-SHA-1](https://www.mongodb.com/docs/upcoming/core/security-scram/#std-label-authentication-scram-sha-1)不能用于集群内身份验证。仅支持[SCRAM-SHA-256](https://www.mongodb.com/docs/upcoming/core/security-scram/#std-label-authentication-scram-sha-256)。

在之前的MongoDB版本中，SCRAM-SHA-1和SCRAM-SHA-256都可以用于集群内身份验证，即使SCRAM没有显式启用。

### FIPS模式默认SCRAM-SHA-1身份验证关闭

从MongoDB 5.1开始，在[FIPS模式下](https://www.mongodb.com/docs/upcoming/tutorial/configure-fips/#std-label-fips-overview)运行的实例默认禁用[SCRAM-SHA-1身份验证机制](https://www.mongodb.com/docs/upcoming/reference/parameters/#std-label-authentication-parameters)。您可以使用[setParameter.authenticationMechanisms](https://www.mongodb.com/docs/upcoming/reference/parameters/#std-label-set-parameter-authenticationMechanisms-code)命令启用[SCRAM-SHA-1身份验证机制](https://www.mongodb.com/docs/upcoming/reference/parameters/#std-label-authentication-parameters)。

此更改不会影响面向MongoDB [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion) 4.0+的驱动程序。

## 时间序列集

> 警告：
>
> 如果您在MongoDB 5.1或更高版本中创建分片[时间序列集合](https://www.mongodb.com/docs/upcoming/core/timeseries-collections/#std-label-manual-timeseries-collection)，则降级到早于MongoDB 5.0.4的版本将导致数据丢失。
>
> 在降级到早于5.0.4的版本之前，请删除所有分片时间序列集合。

### 时间序列集合的次要索引

如果[时间序列集合](https://www.mongodb.com/docs/upcoming/core/timeseries-collections/#std-label-manual-timeseries-collection)上有[辅助索引](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-secondary-index)[，](https://www.mongodb.com/docs/upcoming/core/timeseries-collections/#std-label-manual-timeseries-collection)并且您需要降级功能兼容性版本（FCV），您必须首先删除与降级FCV不兼容的任何辅助索引。请参阅[`setFeatureCompatibilityVersion`。](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)

## 一般变化

### 弃用

| 不建议使用的                                                 | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`db.collection.reIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.reIndex/#mongodb-method-db.collection.reIndex) | MongoDB v6.0不建议使用[`db.collection.reIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.reIndex/#mongodb-method-db.collection.reIndex)方法。 |
| [`reIndex`](https://www.mongodb.com/docs/upcoming/reference/command/reIndex/#mongodb-dbcommand-dbcmd.reIndex) | 在MongoDB v6.0中不建议使用[`reIndex`](https://www.mongodb.com/docs/upcoming/reference/command/reIndex/#mongodb-dbcommand-dbcmd.reIndex)命令。 |
| 简单网络管理协议（SNMP）                                     | 从MongoDB 6.0开始，SNMP已被弃用，并将在下一个版本中被删除。要监控您的部署，请使用[MongoDB运营经理](https://www.mongodb.com/docs/ops-manager/current/)。 |

### `$mod`错误行为

从MongoDB 5.1（以及5.0.4和4.4.10）开始，如果`divisor`或`remainder`计算为某些值，[`$mod`](https://www.mongodb.com/docs/upcoming/reference/operator/query/mod/#mongodb-query-op.-mod)运算符将返回错误。请参阅[$mod行为。](https://www.mongodb.com/docs/upcoming/reference/operator/query/mod/#std-label-mod-behavior)

### 旧版操作码已删除

MongoDB 6.0取消了对以下传统操作码和数据库命令的支持：

- [OP_INSERT](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-insert)
- [OP_DELETE](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-delete)
- [OP_更新](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-update)
- [OP_KILL_CURSORS](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-kill-cursors)
- [OP_GET_更多](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-get-more)
- [OP_QUERY](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-query)
- `getLastError`

> 警告：
>
> **升级驱动程序**
>
> 为了避免因删除这些操作码而中断，请将**驱动程序升级到最新版本**。

如果您尝试使用MongoDB 5.1或更新的mongo shell连接到MongoDB 3.4或更早版本的mongod实例，您将收到如下错误消息：

```
Connection handshake failed. Is your mongod 3.4 or older?
:: caused by :: network error while attempting to run command
'isMaster' on host '127.0.0.1:27017'
```

**mongod对旧操作码的响应**

自MongoDB 3.6以来，MongoDB驱动程序一直使用[OP_MSG](https://www.mongodb.com/docs/upcoming/reference/mongodb-wire-protocol/#std-label-wire-op-msg)而不是[OP_QUERY](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-query)和其他传统操作码和命令

从MongoDB 6.0开始：

- [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)将关闭连接，不会响应：

  - [OP_INSERT](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-insert)
  - [OP_DELETE](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-delete)
  - [OP_更新](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-update)
  - [OP_KILL_CURSORS](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-kill-cursors)

- [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)将保持连接打开状态，并返回以下错误：

  - `getLastError`数据库命令
  - [OP_GET_更多](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-get-more)
  - [OP_QUERY ](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-query)发现
  - 大多数[OP_QUERY ](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-query)RPC命令消息

  > 笔记：
  >
  > **OP_QUERY RPC命令**
  >
  > [OP_QUERY ](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-query)RPC协议可用于以下命令：
  >
  > - `_isSelf`
  > - `authenticate`
  > - `buildinfo`
  > - `buildInfo`
  > - `hello`
  > - `ismaster`
  > - `isMaster`
  > - `saslContinue`
  > - `saslStart`
  >
  > 如果作为[OP_QUERY](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-query)发出，所有其他命令都将被拒绝[。](https://www.mongodb.com/docs/upcoming/legacy-opcodes/#std-label-wire-op-query)

### 删除了服务器端JavaScript的不建议使用的数组和字符串函数

MongoDB 6.0将用于[服务器端JavaScript](https://www.mongodb.com/docs/upcoming/core/server-side-javascript/#std-label-server-side-javascript)、[`$accumulator`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/accumulator/#mongodb-group-grp.-accumulator)、[`$function`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/function/#mongodb-expression-exp.-function)和[`$where`](https://www.mongodb.com/docs/upcoming/reference/operator/query/where/#mongodb-query-op.-where)表达式的内部JavaScript引擎从MozJS-60升级到MozJS-91。MozJS-60中存在的几个已弃用的非标准数组和字符串函数在MozJS-91中被删除。

有关已删除的数组和字符串函数的完整列表，请参阅本页的下一节。

> 笔记：
>
> **仅删除静态函数**
>
> 只有*静态JavaScript*函数被删除。仍然可以使用与已删除函数相当的*原型函数*。
>
> 例如：
>
> - `Array.concat(<array1>, <array2>)`是一个静态函数，不再在MongoDB 6.0中工作。
> - `<array1>.concat(<array2>)`是一个原型函数，仍然在MongoDB 6.0中工作。
>
> 此行为既适用于已删除的数组，也适用于已删除的字符串函数。

**删除了数组函数**

从MongoDB 6.0开始，以下数组函数将被删除，不能在服务器端JavaScript中使用`$accumulator`、`$function`和`$where`表达式：

- `Array.concat`
- `Array.every`
- `Array.filter`
- `Array.forEach`
- `Array.indexOf`
- `Array.join`
- `Array.lastIndexOf`
- `Array.map`
- `Array.pop`
- `Array.push`
- `Array.reduce`
- `Array.reduceRight`
- `Array.reverse`
- `Array.shift`
- `Array.slice`
- `Array.some`
- `Array.sort`
- `Array.splice`
- `Array.unshift`

**删除了字符串函数**

从MongoDB 6.0开始，以下数组函数将被删除，不能在服务器端JavaScript中使用`$accumulator`、`$function`和`$where`表达式：

- `String.charAt`
- `String.charCodeAt`
- `String.concat`
- `String.contains`
- `String.endsWith`
- `String.includes`
- `String.indexOf`
- `String.lastIndexOf`
- `String.localeCompare`
- `String.match`
- `String.normalize`
- `String.replace`
- `String.search`
- `String.slice`
- `String.split`
- `String.startsWith`
- `String.substr`
- `String.substring`
- `String.toLocaleLowerCase`
- `String.toLocaleUpperCase`
- `String.toLowerCase`
- `String.toUpperCase`
- `String.trim`
- `String.trimLeft`
- `String.trimRight`

### 默认`db.stats()`设置

从MongoDB 6.0开始，[`dbStats`](https://www.mongodb.com/docs/upcoming/reference/command/dbStats/#mongodb-dbcommand-dbcmd.dbStats)命令和[`db.stats()`](https://www.mongodb.com/docs/upcoming/reference/method/db.stats/#mongodb-method-db.stats)方法仅在[freeStorage](https://www.mongodb.com/docs/upcoming/reference/command/dbStats/#std-label-dbStats-freeStorage)参数设置为1时报告分配给集合的可用空间。

### 索引过滤器和整理

从MongoDB 6.0开始，索引过滤器使用之前使用[`planCacheSetFilter`](https://www.mongodb.com/docs/upcoming/reference/command/planCacheSetFilter/#mongodb-dbcommand-dbcmd.planCacheSetFilter)命令设置的[排序](https://www.mongodb.com/docs/upcoming/reference/collation/#std-label-collation)。

### 集合和视图中的数组具有`distinct`命令

从MongoDB 6.0开始，[`distinct`](https://www.mongodb.com/docs/upcoming/reference/command/distinct/#mongodb-dbcommand-dbcmd.distinct)命令在使用数组时返回相同的集合和[视图](https://www.mongodb.com/docs/upcoming/core/views/#std-label-views-landing-page)结果。

请参阅[集合和视图中的数组。](https://www.mongodb.com/docs/upcoming/reference/command/distinct/#std-label-distinct-arrays-in-collections-and-views)

## 降级注意事项

以下部分提供了从部署中删除向后不兼容功能的信息。如果您要从MongoDB 6.0降级到更早的版本，请查看以下部分，以确保您的部署在降级后成功运行。

### 集群集合

从MongoDB 5.3开始，如果您使用的是[集群集合](https://www.mongodb.com/docs/upcoming/core/clustered-collections/#std-label-clustered-collections)，则必须先删除这些集合，然后才能降级到更早的MongoDB版本。

### 用户写入阻止

从MongoDB 6.0开始，如果您需要降级功能兼容性版本，请确保禁用集群到集群复制和用户写入阻止。

请参阅[集群到集群复制和用户写入阻止。](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-setFeatureCompatibilityVersion-user-write-blocking)

### 时间序列集合

在降级之前，您必须删除时间序列集合：

- MongoDB 6.0或更高版本到MongoDB 5.0.7或更早版本。
- MongoDB 5.3到MongoDB 5.0.5或更早版本。

请参阅[时间序列集合。](https://www.mongodb.com/docs/upcoming/core/timeseries-collections/#std-label-manual-timeseries-collection)

### 集群参数

从MongoDB 6.0开始，确保所有[`setClusterParameter`](https://www.mongodb.com/docs/upcoming/reference/command/setClusterParameter/#mongodb-dbcommand-dbcmd.setClusterParameter)操作都已完成。如果在分片集群上有任何正在进行的`setClusterParameter`操作，则无法成功降级FCV。

### SELinux政策数据

从MongoDB 5.1开始，您必须从之前克隆SELinux策略的目录运行以下命令，然后才能降级到更早的MongoDB版本：

```
sudo make uninstall
```

### 密钥管理互操作性协议（KMIP）设置

从MongoDB 5.3 Enterprise开始，如果您使用的是以下KMIP设置，则必须从配置文件中删除它们，然后才能降级到更早的MongoDB版本：

- [`security.kmip.keyStatePollingSeconds`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-security.kmip.keyStatePollingSeconds)
- [`security.kmip.activateKeys`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-security.kmip.activateKeys)

### 基于时间的更改流图像前和图像后集合

从MongoDB 6.0开始，如果您使用`changeStreamOptions.preAndPostImages.expireAfterSeconds`来控制[图像前和图像后集合](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.watch/#std-label-db.collection.watch-change-streams-pre-and-post-images-example)的[更改流的](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.watch/#std-label-db.collection.watch-change-streams-pre-and-post-images-example)基于时间保留，则必须确保降级时没有活动`setClusterParameter`操作。

### 审核日志加密设置

从MongoDB 6.0 Enterprise开始，如果您正在使用审计日志加密，则必须从配置文件中删除以下设置，然后才能降级到更早的MongoDB版本：

- [`auditLog.auditEncryptionKeyIdentifier`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-auditLog.auditEncryptionKeyIdentifier)
- [`auditLog.localAuditKeyFile`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-auditLog.localAuditKeyFile)

现有的加密审计日志保持加密，您可以保留您为存储和处理加密日志而开发的任何程序。

请参阅[使用KMIP服务器管理加密MongoDB审计日志的密钥。](https://www.mongodb.com/docs/upcoming/core/security-encryption-at-rest/#std-label-security-encryption-at-rest-audit-log)

### 使用图像前后文档更改流

从MongoDB 6.0开始，如果您使用文档前后图像进行[更改流](https://www.mongodb.com/docs/upcoming/reference/change-events/#std-label-change-stream-output)，则必须使用[`collMod`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令禁用每个集合的[changeStreamPreAndPostImages](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#std-label-collMod-change-stream-pre-and-post-images)，然后才能降级到更早的MongoDB版本。

### 通过扩展事件更改流

如果您的应用程序使用更改流，请确保它不需要`showExpandedEvents`选项，该选项在降级后将不可用。

### 带有srv的LDAP：和srv_raw：

如果您的集群配置在其LDAP配置中使用新的`"srv:"`或`"srv_raw:"`URL类型，则降级后将无法重新启动。在进行降级之前或降级之前，从集群的配置中删除新的URL类型。

### 带有加密字段的集合

在完成FCV降级之前，您必须删除使用加密字段的集合。如果有使用`encryptedFields`的集合，降级将无法完成。



原文：[Compatibility Changes in MongoDB 6.0](https://www.mongodb.com/docs/upcoming/release-notes/6.0-compatibility/)

