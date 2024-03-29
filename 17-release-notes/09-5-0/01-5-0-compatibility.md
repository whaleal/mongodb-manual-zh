# MongoDB 5.0中的兼容性变化

以下5.0更改可能会影响与旧版本MongoDB的兼容性。

## 某些命令只接受可识别的参数

从MongoDB 5.0开始，如果传递了命令不显式接受的参数，某些数据库命令会引发错误。在MongoDB 4.4及更早版本中，无法识别的参数被默默忽略。

受影响的命令：

- [`abortTransaction`](https://www.mongodb.com/docs/upcoming/reference/command/abortTransaction/#mongodb-dbcommand-dbcmd.abortTransaction)
- [`aggregate`](https://www.mongodb.com/docs/upcoming/reference/command/aggregate/#mongodb-dbcommand-dbcmd.aggregate)
- [`authenticate`](https://www.mongodb.com/docs/upcoming/reference/command/authenticate/#mongodb-dbcommand-dbcmd.authenticate)
- [`collMod`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)
- [`commitTransaction`](https://www.mongodb.com/docs/upcoming/reference/command/commitTransaction/#mongodb-dbcommand-dbcmd.commitTransaction)
- [`create`](https://www.mongodb.com/docs/upcoming/reference/command/create/#mongodb-dbcommand-dbcmd.create)
- [`createIndexes`](https://www.mongodb.com/docs/upcoming/reference/command/createIndexes/#mongodb-dbcommand-dbcmd.createIndexes)
- [`delete`](https://www.mongodb.com/docs/upcoming/reference/command/delete/#mongodb-dbcommand-dbcmd.delete)
- [`drop`](https://www.mongodb.com/docs/upcoming/reference/command/drop/#mongodb-dbcommand-dbcmd.drop)
- [`dropDatabase`](https://www.mongodb.com/docs/upcoming/reference/command/dropDatabase/#mongodb-dbcommand-dbcmd.dropDatabase)
- [`dropIndexes`](https://www.mongodb.com/docs/upcoming/reference/command/dropIndexes/#mongodb-dbcommand-dbcmd.dropIndexes)
- [`endSessions`](https://www.mongodb.com/docs/upcoming/reference/command/endSessions/#mongodb-dbcommand-dbcmd.endSessions)
- [`explain`](https://www.mongodb.com/docs/upcoming/reference/command/explain/#mongodb-dbcommand-dbcmd.explain)
- [`find`](https://www.mongodb.com/docs/upcoming/reference/command/find/#mongodb-dbcommand-dbcmd.find)
- [`findAndModify`](https://www.mongodb.com/docs/upcoming/reference/command/findAndModify/#mongodb-dbcommand-dbcmd.findAndModify)
- [`getMore`](https://www.mongodb.com/docs/upcoming/reference/command/getMore/#mongodb-dbcommand-dbcmd.getMore)
- [`hello`](https://www.mongodb.com/docs/upcoming/reference/command/hello/#mongodb-dbcommand-dbcmd.hello)
- [`insert`](https://www.mongodb.com/docs/upcoming/reference/command/insert/#mongodb-dbcommand-dbcmd.insert)
- [`killCursors`](https://www.mongodb.com/docs/upcoming/reference/command/killCursors/#mongodb-dbcommand-dbcmd.killCursors)
- [`listCollections`](https://www.mongodb.com/docs/upcoming/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections)
- [`listDatabases`](https://www.mongodb.com/docs/upcoming/reference/command/listDatabases/#mongodb-dbcommand-dbcmd.listDatabases)
- [`listIndexes`](https://www.mongodb.com/docs/upcoming/reference/command/listIndexes/#mongodb-dbcommand-dbcmd.listIndexes)
- [`ping`](https://www.mongodb.com/docs/upcoming/reference/command/ping/#mongodb-dbcommand-dbcmd.ping)
- [`refreshSessions`](https://www.mongodb.com/docs/upcoming/reference/command/refreshSessions/#mongodb-dbcommand-dbcmd.refreshSessions)
- [`update`](https://www.mongodb.com/docs/upcoming/reference/command/update/#mongodb-dbcommand-dbcmd.update)

## 移除了命

从MongoDB 5.0开始，删除了以下数据库命令和mongo shell helper方法：

| 删除了命令                                                   | 替代品                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `db.collection.copyTo()`                                     | [`$out`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out) |
| [`db.collection.ensureIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.ensureIndex/#mongodb-method-db.collection.ensureIndex) | [`db.collection.createIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) |
| `db.collection.save()`                                       | [`db.collection.insertOne()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)[`db.collection.insertMany()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany) |
| [`db.resetError()`](https://www.mongodb.com/docs/upcoming/reference/method/db.resetError/#mongodb-method-db.resetError) | 无法使用                                                     |
| [`geoSearch`](https://www.mongodb.com/docs/upcoming/reference/command/geoSearch/#mongodb-dbcommand-dbcmd.geoSearch) | 其中之一 [Geospatial Query Operators](https://www.mongodb.com/docs/upcoming/reference/operator/query-geospatial/#std-label-geospatial-query-selectors) |
| `Mongo.getSecondaryOk()`                                     | [Mongo.getReadPrefMode()](https://www.mongodb.com/docs/upcoming/reference/method/Mongo.getReadPrefMode/) |
| `Mongo.isCausalConsistency`                                  | 无法使用                                                     |
| `Mongo.setSecondaryOk()`                                     | [Mongo.setReadPref()](https://www.mongodb.com/docs/upcoming/reference/method/Mongo.setReadPref/) |
| `rs.secondaryOk()`                                           | [Mongo.setReadPref()](https://www.mongodb.com/docs/upcoming/reference/method/Mongo.setReadPref/) |
| [`resetError`](https://www.mongodb.com/docs/upcoming/reference/command/resetError/#mongodb-dbcommand-dbcmd.resetError) | 无法使用                                                     |
| [`shardConnPoolStats`](https://www.mongodb.com/docs/upcoming/reference/command/shardConnPoolStats/#mongodb-dbcommand-dbcmd.shardConnPoolStats) | [`connPoolStats`](https://www.mongodb.com/docs/upcoming/reference/command/connPoolStats/#mongodb-dbcommand-dbcmd.connPoolStats) |
| [`unsetSharding`](https://www.mongodb.com/docs/upcoming/reference/command/unsetSharding/#mongodb-dbcommand-dbcmd.unsetSharding) | 无法使用                                                     |

## 移除了参数

MongoDB 5.0删除了以下服务器参数：

| 移除了参数                                    | 描述                                                         |
| :-------------------------------------------- | :----------------------------------------------------------- |
| `cachePressureThreshold`                      | MongoDB 5.0删除了`cachePressureThreshold`服务器参数。由于WiredTiger计算快照窗口大小的方式发生了变化，此参数不再相关。 |
| `shouldMultiDocTxnCreateCollectionAndIndexes` | MongoDB 5.0删除了`shouldMultiDocTxnCreateCollectionAndIndexes`服务器参数。在5.0+中，事务内部的集合和索引创建始终处于启用状态。您不能再使用服务器参数禁用此行为。 |

## 已移除索引类型

MongoDB 5.0删除了不建议使用的[geoHaystack](https://www.mongodb.com/docs/upcoming/core/geohaystack/)索引。改为使用[2d索引](https://www.mongodb.com/docs/upcoming/core/2d/#std-label-2d-index)。

将MongoDB实例升级到5.0并设置[featureCompatibilityVersion](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)到`5.0`将删除任何先前存在的[geoHaystack](https://www.mongodb.com/docs/upcoming/core/geohaystack/)索引。

## 移除了指标

从MongoDB 5.0开始，[`serverStatus`](https://www.mongodb.com/docs/upcoming/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)命令没有输出[`opReadConcernCounters`](https://www.mongodb.com/docs/upcoming/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.opReadConcernCounters)，其中包含[读取](https://www.mongodb.com/docs/upcoming/reference/read-concern/#std-label-read-concern-levels)查询操作指定的[关注级别](https://www.mongodb.com/docs/upcoming/reference/read-concern/#std-label-read-concern-levels)。相反，新的[`readConcernCounters`](https://www.mongodb.com/docs/upcoming/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.readConcernCounters)替换[`opReadConcernCounters`](https://www.mongodb.com/docs/upcoming/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.opReadConcernCounters)并包含其他信息。

从MongoDB 5.0开始，[`serverStatus`](https://www.mongodb.com/docs/upcoming/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)命令不会输出`cache pressure percentage threshold`和`current cache pressure percentage`underwiredTiger`wiredTiger.snapshot-window-settings`。

### `currentOp`输出变化

从MongoDB 5.0开始，[`$currentOp.remainingOperationTimeEstimated`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/currentOp/#mongodb-data--currentOp.remainingOperationTimeEstimated)指标仅存在于[收件人碎片](https://www.mongodb.com/docs/upcoming/core/sharding-reshard-a-collection/#std-label-sharding-resharding)，当[分片操作](https://www.mongodb.com/docs/upcoming/reference/method/sh.reshardCollection/#std-label-resharding-process-details)正在进行中。

## TTL expireAfterSeconds设置为NaN时的行为

从MongoDB 5.0开始，[TTL](https://www.mongodb.com/docs/upcoming/tutorial/expire-data/#std-label-ttl-collections)索引`expireAfterSeconds`设置为`NaN` 与早期版本相比[，行为发生了变化](https://www.mongodb.com/docs/upcoming/tutorial/expire-data/#std-label-expireData-warning)。

行为变化会影响：

- 直接升级
- 从早期版本开始的初始同步
- [`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)来自早期版本

执行上述任何操作都会导致`expireAfterSeconds`价值`NaN`被视为`expireAfterSeconds`的`0`。因此，文件可能会立即过期。

从MongoDB 5.0.14（和6.0.2）开始，服务器将不会使用具有`expireAfterSeconds`设置为`NaN`。

## shell变化

Mongo shell在MongoDB v5.0中已被弃用。替换的shell是[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。

MongoDB v5.0中的外sell也发生了变化。请参考[安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)了解更多详情。

## 复本集

### `enableMajorityReadConcern`无法配置

从MongoDB 5.0开始，[`enableMajorityReadConcern`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-replication.enableMajorityReadConcern)和[`--enableMajorityReadConcern`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--enableMajorityReadConcern)由于存储引擎的改进，无法更改，并且始终设置为`true`。

在早期版本的MongoDB中，[`enableMajorityReadConcern`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-replication.enableMajorityReadConcern)和[`--enableMajorityReadConcern`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--enableMajorityReadConcern)是可配置的，可以设置为`false`防止存储缓存压力使用三元一级-二级仲裁器（PSA）架构固定部署。

如果您使用的是三人初级-中学仲裁员（PSA）架构，请考虑以下几点：

- 书面关注[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)如果辅助功能不可用或滞后，可能会导致性能问题。有关如何缓解这些问题的建议，请参阅[缓解PSA副本集的性能问题。](https://www.mongodb.com/docs/upcoming/tutorial/mitigate-psa-performance-issues/#std-label-performance-issues-psa)
- 如果您使用的是全局默认值[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)写入问题小于大多数的大小，您的查询可能会返回陈旧（未完全复制）的数据。

### `secondaryDelaySecs`配置设置

从MongoDB 5.0开始，[`secondaryDelaySecs`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.secondaryDelaySecs)替换s `slaveDelay`。此更改不向后兼容。s

### Split Horizon DNS需要主机名

配置集群节点[拆分地平线DNS](https://en.wikipedia.org/wiki/Split-horizon_DNS)，使用主机名而不是IP地址。

从MongoDB v5.0开始，[`replSetInitiate`](https://www.mongodb.com/docs/upcoming/reference/command/replSetInitiate/#mongodb-dbcommand-dbcmd.replSetInitiate)和[`replSetReconfig`](https://www.mongodb.com/docs/upcoming/reference/command/replSetReconfig/#mongodb-dbcommand-dbcmd.replSetReconfig)拒绝使用IP地址而不是主机名的配置。

使用[`disableSplitHorizonIPCheck`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.disableSplitHorizonIPCheck)修改无法更新以使用主机名的节点。该参数仅适用于配置命令。

[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)不依赖[`disableSplitHorizonIPCheck`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.disableSplitHorizonIPCheck)启动时进行验证。遗产[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)使用IP地址而不是主机名的实例将在升级后启动。

配置了IP地址的实例会记录使用主机名而不是IP地址的警告。

### 非事务性读取配置事务

从MongoDB 5.0开始，不允许在[`config.transactions`](https://www.mongodb.com/docs/upcoming/reference/config-database/#mongodb-data-config.transactions)包含以下阅读问题和选项的集合：

- [`"snapshot"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)
- [`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)并设置了 [afterClusterTime ](https://www.mongodb.com/docs/upcoming/reference/read-concern/#std-label-afterClusterTime)选项
- 使用[MongoDB驱动程序](https://www.mongodb.com/docs/drivers/)和[`"majority"`](https://www.mongodb.com/docs/upcoming/core/read-isolation-consistency-recency/#std-label-sessions)在a内[因果一致的会话](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)

### 手动操作日志写入

从MongoDB 5.0开始，不再可能对在作为[副本集](https://www.mongodb.com/docs/upcoming/replication/#std-label-replication)运行的集群上进行[oplog](https://www.mongodb.com/docs/upcoming/replication/#std-label-replication)。作为[独立实例](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-standalone)运行时，对oplog执行写操作只能在MongoDB支持的指导下完成。

### 新投票副本集成员的自动重新配置

从MongoDB 5.0开始，新添加的中学不算作有表决权的成员，在达到[`SECONDARY`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)状态。

当新的投票节点添加到副本集时，[`replSetReconfig`](https://www.mongodb.com/docs/upcoming/reference/command/replSetReconfig/#mongodb-dbcommand-dbcmd.replSetReconfig)将在内部向节点的配置添加一个newlyAdded字段。具有newlyAdded字段的节点不计入当前投票节点数。当初始同步完成并且节点达到 [`SECONDARY`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)状态时，将自动删除newlyAdded字段。

> 笔记：
>
> - 尝试添加名为`newlyAdded`即使使用`{ force: true }`。
> - 如果现有节点具有`newlyAdded`字段，使用[`rs.reconfig()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)更改配置不会删除`newlyAdded`田野。这个`newlyAdded`字段将附加到用户提供的配置中。
> - [`replSetGetConfig`](https://www.mongodb.com/docs/upcoming/reference/command/replSetGetConfig/#mongodb-dbcommand-dbcmd.replSetGetConfig)将从其输出中删除任何`newlyAdded`字段。如果你想看任何`newlyAdded`字段，您可以直接查询[`local.system.replset`](https://www.mongodb.com/docs/upcoming/reference/local-database/#mongodb-data-local.system.replset)集合。

### 删除了 getLastErrorDefaults 的可自定义值

从MongoDB 5.0开始，除了默认值外，您无法使用[`settings.getLastErrorDefaults`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.getLastErrorDefaults)指定默认写入问题`{ w: 1, wtimeout: 0 }`。相反，请使用[`setDefaultRWConcern`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.getLastErrorDefaults)命令为副本集或分片集群设置默认读写关注配置

## 阅读Capped Collections上的关注`snapshot`

从MongoDB 5.0开始，当从封顶集合阅读时，不能使用读取关注点“snapshot”。

## `local`是默认读取问题

从MongoDB 5.0开始，[`"local"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-)是针对主要和次要读取操作的默认读取关注级别。

这可能会为使用过滤器的计数查询带来显著的延迟增加，并且[涵盖的查询。](https://www.mongodb.com/docs/upcoming/core/query-optimization/#std-label-covered-queries)

您可以通过设置集群范围来选择退出此行为[阅读关注](https://www.mongodb.com/docs/upcoming/reference/read-concern/#std-label-read-concern)[`setDefaultRWConcern`。](https://www.mongodb.com/docs/upcoming/reference/command/setDefaultRWConcern/#mongodb-dbcommand-dbcmd.setDefaultRWConcern)

## 最新`cursor.map()`退货类型

[`cursor.map()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.map/#mongodb-method-cursor.map)在遗留mongo shell中返回了一个数组。返回类型是[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)中的Cursor。可以使用.toArray（）转换结果。

## 更新操作符更改

从MongoDB 5.0开始，当您使用以下具有空操作数表达式（`{ }`的更新运算符时，[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)不再引发错误：

- [`$addToSet`](https://www.mongodb.com/docs/upcoming/reference/operator/update/addToSet/#mongodb-update-up.-addToSet)
- [`$bit`](https://www.mongodb.com/docs/upcoming/reference/operator/update/bit/#mongodb-update-up.-bit)
- [`$currentDate`](https://www.mongodb.com/docs/upcoming/reference/operator/update/currentDate/#mongodb-update-up.-currentDate)
- [`$inc`](https://www.mongodb.com/docs/upcoming/reference/operator/update/inc/#mongodb-update-up.-inc)
- [`$max`](https://www.mongodb.com/docs/upcoming/reference/operator/update/max/#mongodb-update-up.-max)
- [`$min`](https://www.mongodb.com/docs/upcoming/reference/operator/update/min/#mongodb-update-up.-min)
- [`$mul`](https://www.mongodb.com/docs/upcoming/reference/operator/update/mul/#mongodb-update-up.-mul)
- [`$pop`](https://www.mongodb.com/docs/upcoming/reference/operator/update/pop/#mongodb-update-up.-pop)
- [`$pull`](https://www.mongodb.com/docs/upcoming/reference/operator/update/pull/#mongodb-update-up.-pull)
- [`$pullAll`](https://www.mongodb.com/docs/upcoming/reference/operator/update/pullAll/#mongodb-update-up.-pullAll)
- [`$push`](https://www.mongodb.com/docs/upcoming/reference/operator/update/push/#mongodb-update-up.-push)
- [`$rename`](https://www.mongodb.com/docs/upcoming/reference/operator/update/rename/#mongodb-update-up.-rename)
- [`$set`](https://www.mongodb.com/docs/upcoming/reference/operator/update/set/#mongodb-update-up.-set)
- [`$setOnInsert`](https://www.mongodb.com/docs/upcoming/reference/operator/update/setOnInsert/#mongodb-update-up.-setOnInsert)
- [`$unset`](https://www.mongodb.com/docs/upcoming/reference/operator/update/unset/#mongodb-update-up.-unset)

空更新不会导致任何更改，也不会创建[oplog](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-oplog)条目（这意味着该操作是no-op）。

### 更新操作员处理订单

从MongoDB 5.0开始，更新运算符按照词典顺序处理带有基于字符串的名称的文档字段。带有数字名称的字段按数字顺序处理。有关详细信息，请参阅[更新运算符行为](https://www.mongodb.com/docs/upcoming/reference/operator/update/#std-label-update-operators-processing-order)。

### `$setWindowFields`阶段，包含事务和快照读取问题

在5.3之前的MongoDB版本中，[`$setWindowFields`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/setWindowFields/#mongodb-pipeline-pipe.-setWindowFields)聚合管道阶段不能与[事务](https://www.mongodb.com/docs/upcoming/core/transactions/#std-label-transactions)或[`"snapshot"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)读取问题一起使用。

## 聚合管道运算符参数限制

以下聚合管道运算符现在有一个64位整数值最大限制。

- [`$sort`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort)
- [`$limit`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/limit/#mongodb-pipeline-pipe.-limit)

如果您传递的值超过此限制，管道将返回无效的参数错误。

## `listDatabases`产出变化

从MongoDB 5.0开始，针对mongod运行的 [`listDatabases`](https://www.mongodb.com/docs/upcoming/reference/command/listDatabases/#mongodb-dbcommand-dbcmd.listDatabases)命令的输出与针对mongos运行的[`listDatabases`](https://www.mongodb.com/docs/upcoming/reference/command/listDatabases/#mongodb-dbcommand-dbcmd.listDatabases)命令的输出更加一致。

下表显示了MongoDB 5.0和早期版本之间[`listDatabases`](https://www.mongodb.com/docs/upcoming/reference/command/listDatabases/#mongodb-dbcommand-dbcmd.listDatabases)输出字段的数据类型差异。仅列出5.0和更早版本之间不同的字段。

| 字段          | 在MongoDB 5.0中键入 | 在MongoDB 4.4及更早版本中键入（`mongod`） | 在MongoDB 4.4及更早版本中键入（`mongos`） |
| :------------ | :------------------ | :---------------------------------------- | :---------------------------------------- |
| `sizeOnDisk`  | 整数                | 双倍                                      | 整数                                      |
| `totalSize`   | 整数                | 双倍                                      | 整数                                      |
| `totalSizeMb` | 整数                | 不存在（见下文）                          | 整数                                      |

[`listDatabases`](https://www.mongodb.com/docs/upcoming/reference/command/listDatabases/#mongodb-dbcommand-dbcmd.listDatabases)输出现在包括针对[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)或[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)运行时的`totalSizeMb`字段。在MongoDB 4.4及更早版本中，`totalSizeMb`仅在与[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)运行时出现。`totalSizeMb`是`sizeOnDisk`字段的总和，以兆字节表示。

当对着[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)运行时，[`listDatabases`](https://www.mongodb.com/docs/upcoming/reference/command/listDatabases/#mongodb-dbcommand-dbcmd.listDatabases)输出中的`shards`字段包含特定碎片上每个集合的字段值对。`shards`字段中的大小值以整数表示。

## 安全

### TLS连接X509证书启动警告

从MongoDB 5.0开始，当[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)证书不包含[主题替代名称](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-Subject-Alternative-Name)属性时，它们会发出启动警告。

以下平台不支持通用名称验证：

- iOS 13及更高版本
- MacOS 10.15及更高版本
- 去1.15及更高

使用这些平台的客户端不会对使用主机名[由CommonName属性指定的](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-KMIP-subject-alternative-name-CN)x.509证书的MongoDB服务器[进行身份验证](https://www.mongodb.com/docs/upcoming/tutorial/configure-x509-client-authentication/#std-label-x509-client-authentication)[。](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-KMIP-subject-alternative-name-CN)

## 地图减少

从5.0版本开始，MongoDB不建议使用[地图减少](https://www.mongodb.com/docs/upcoming/core/map-reduce/)操作。

有关映射减少操作的聚合管道替代方案示例，请参阅[地图减少到聚合管道](https://www.mongodb.com/docs/upcoming/reference/map-reduce-to-aggregation-pipeline/)和[地图减少示例。](https://www.mongodb.com/docs/upcoming/tutorial/map-reduce-examples/)

## 审计

MongoDB 5.0增加了可以在运行时配置的审计功能。

如果`auditLog.runtimeConfiguration`设置为`true`，则`mongod`和`mongos`配置文件将无法再设置`setParameter.auditAuthorizationSuccess`或[配置审计过滤器](https://www.mongodb.com/docs/upcoming/tutorial/configure-audit-filters/)。如果服务器配置文件包含这些设置，服务器将无法启动并记录错误。

如果`auditLog.runtimeConfiguration`设置为`false`，并且存在审计过滤器配置文档，则将发出启动警告，但服务器不会中止。

## 降低分片事务中过期数据块的风险

从MongoDB 5.0开始，如果您更改[`transactionLifetimeLimitSeconds`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.transactionLifetimeLimitSeconds)参数，您还必须将[`transactionLifetimeLimitSeconds`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.transactionLifetimeLimitSeconds)更改为所有配置服务器副本集成员的相同值。保持此值的一致性：

- 确保路由表历史记录至少保留在碎片副本集成员的事务生命周期限制之内。
- 降低事务重试频率，从而提高性能。

## 一般变化

从MongoDB 5.0开始:

- 对于设置为`"5.0"`或更高的[功能兼容性版本](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)，用户不能再直接写入[`.system.views`](https://www.mongodb.com/docs/upcoming/reference/system-collections/#mongodb-data--database-.system.views)集合。
- The [`reIndex`](https://www.mongodb.com/docs/upcoming/reference/command/reIndex/#mongodb-dbcommand-dbcmd.reIndex) command and the [`db.collection.reIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.reIndex/#mongodb-method-db.collection.reIndex) shell method may only be run on [standalone](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-standalone) instances.
- 单个管道中允许的[聚合管道阶段](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation-pipeline/#std-label-aggregation-pipeline-operator-reference)数量限制为1000个。
- 当启用[`directoryPerDB`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.directoryPerDB)或[`--directoryperdb`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--directoryperdb)时，删除数据库中的最终集合（或删除数据库本身），将删除该数据库的新空子目录。
- 如有必要，[`$subtract`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/subtract/#mongodb-expression-exp.-subtract)聚合运算符将转换结果的数据类型，以准确表示结果值。有关特定转换，请参阅[`$subtract`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/subtract/#mongodb-expression-exp.-subtract)。此更改也适用于MongoDB 4.4.3+、4.2.12+、4.0.22+和3.6.22+。
- MongoDB删除了`--serviceExecutor`命令行选项和相应的`net.serviceExecutor`配置选项。
- 如果设置了`--apiStrict`选项，则不得在同一客户端会话中同时对多个用户进行身份验证。在设置`--apiStrict`选项时，尝试以现有用户身份登录时作为新用户进行身份验证，每次身份验证尝试都会生成一次错误消息。如果您不使用`--apiStrict`选项，在当前以现有用户身份登录时作为新用户进行身份验证，每次身份验证尝试都会向日志写一次警告。
- [权重](https://www.mongodb.com/docs/upcoming/core/index-text/#std-label-specify-weights)选项仅适用于`$text`索引。
- 在尝试使用将更改隐式默认写入关注的[配置](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/)重新配置重新配置[非分片](https://www.mongodb.com/docs/upcoming/sharding/#std-label-sharded-vs-non-sharded-collections)[副本](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-replica-set)之前，您必须显式设置全局默认[写入问题](https://www.mongodb.com/docs/upcoming/reference/write-concern/#std-label-write-concern)。要设置全局默认写入问题，请使用[`setDefaultRWConcern`](https://www.mongodb.com/docs/upcoming/reference/command/setDefaultRWConcern/#mongodb-dbcommand-dbcmd.setDefaultRWConcern)命令。
- 要设置`replSetOplog`大小[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，使用`Double()`构造函数和[`replSetResizeOplog`](https://www.mongodb.com/docs/upcoming/reference/command/replSetResizeOplog/#mongodb-dbcommand-dbcmd.replSetResizeOplog)命令。

### 弃用

| 不建议使用的                                                 | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| `mongo`                                                      | The legacy `mongo` shell has been deprecated in MongoDB v5.0. The replacement is [`mongosh`。](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) |
| [`db.printSlaveReplicationInfo()`](https://www.mongodb.com/docs/upcoming/reference/method/db.printSlaveReplicationInfo/#mongodb-method-db.printSlaveReplicationInfo) | *自4.4.1版本以来不建议使用：*改为使用使用[`db.printSecondaryReplicationInfo()`](https://www.mongodb.com/docs/upcoming/reference/method/db.printSecondaryReplicationInfo/#mongodb-method-db.printSecondaryReplicationInfo)。 |
| [`rs.printSlaveReplicationInfo()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.printSlaveReplicationInfo/#mongodb-method-rs.printSlaveReplicationInfo) | *自4.4.1版本以来不建议使用：*改为Users[`rs.printSecondaryReplicationInfo()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.printSecondaryReplicationInfo/#mongodb-method-rs.printSecondaryReplicationInfo)。 |
| [`security.clusterIpSourceWhitelist`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-security.clusterIpSourceWhitelist) | *在5.0版本中不建议使用：*改为使用[`security.clusterIpSourceAllowlist`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-security.clusterIpSourceAllowlist)。 |
| [`--clusterIpSourceWhitelist`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--clusterIpSourceWhitelist) | *5.0版本不建议使用：*改用[`--clusterIpSourceAllowlist`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--clusterIpSourceAllowlist)。 |
| [`logout`](https://www.mongodb.com/docs/upcoming/reference/command/logout/#mongodb-dbcommand-dbcmd.logout) | *在5.0版本中不建议使用：*断开与服务器的连接以结束会话。      |
| [`db.logout()`](https://www.mongodb.com/docs/upcoming/reference/method/db.logout/#mongodb-method-db.logout) | *在5.0版本中不建议使用：*断开与服务器的连接以结束会话。      |
| [本地](https://www.mongodb.com/docs/upcoming/reference/audit-message/#std-label-audit-message-local)审计消息字段 | *5.0版本不建议使用：*改用[clientMetadata](https://www.mongodb.com/docs/upcoming/reference/audit-message/#std-label-audit-message-clientMetadata)审计消息中的`localEndpoint`字段。 |



#### 不建议使用的电线协议操作码

MongoDB 5.0不建议使用以下[有线协议操作码：](https://www.mongodb.com/docs/upcoming/reference/mongodb-wire-protocol/#std-label-mongodb-wire-protocol)

- `OP_REPLY`
- `OP_UPDATE`
- `OP_INSERT`
- `OP_QUERY`
- `OP_GET_MORE`
- `OP_DELETE`
- `OP_KILL_CURSORS`

较新的驱动程序版本使用[OP_MSG](https://www.mongodb.com/docs/upcoming/reference/mongodb-wire-protocol/#std-label-wire-op-msg)，而不是这些不建议使用的操作码。

MongoDB 5.0也不建议使用相关命令和方法：

- `getLastError`
- `db.getLastError()`
- `db.getLastErrorObj()`

为了确保您的驱动程序使用最新的有线协议，请将驱动程序升级到与5.0兼容的版本。

任何显式使用`getLastError`、`db.getLastError()`、ordb`db.getLastErrorObj()`的代码都应使用CRUD API来发出所需的[写入问题](https://www.mongodb.com/docs/upcoming/reference/write-concern/#std-label-write-concern)。有关写操作成败的信息将由驱动程序直接作为返回值提供。



## 5.0 功能兼容性

5.0中的一些功能不仅需要5.0二进制文件，还需要将[功能兼容性版本](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)（fCV）设置为5.0。这些功能包括：

- 创建[时间序列集合](https://www.mongodb.com/docs/upcoming/core/timeseries-collections/#std-label-manual-timeseries-collection)需要将fCV设置为5.0+。
- [配置运行时审计过滤器管理](https://www.mongodb.com/docs/upcoming/tutorial/configure-audit-filters/#std-label-configure-audit-filters-at-runtime)需要将fCV设置为5.0+。
- 在字段名称中使用`.`和`$`需要将fCV设置为5.0+。
- [重新分片集合](https://www.mongodb.com/docs/upcoming/core/sharding-reshard-a-collection/#std-label-sharding-resharding)需要将fCV设置为5.0+。





原文：[Compatibility Changes in MongoDB 5.0](https://www.mongodb.com/docs/upcoming/release-notes/5.0-compatibility/)