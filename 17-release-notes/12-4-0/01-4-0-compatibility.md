# MongoDB 4.0中的兼容性变化

以下4.0更改可能会影响与旧版本MongoDB的兼容性。

## 移除对`MONGODB-CR`

从4.0版本开始，MongoDB取消了对已弃用的MongoDB挑战响应（`MONGODB-CR`）身份验证机制的支持。

自3.0版本以来，MongoDB不支持创建`MONGODB-CR`用户，除非部署已从2.6或更早的部署升级，该部署已经拥有`MONGODB-CR`用户，并且没有升级身份验证模式。

如果您的部署在`MONGODB-CR`模式中存储了用户凭据，则在升级到4.0版本**之前，**您必须升级到[咸挑战响应身份验证机制（SCRAM](https://www.mongodb.com/docs/upcoming/core/security-scram/#std-label-authentication-scram)）。有关升级到`SCRAM`的信息，请参阅[升级到SCRAM。](https://www.mongodb.com/docs/upcoming/release-notes/3.0-scram/)

### 删除`authSchemaUpgrade`命令

MongoDB 4.0删除了`authSchemaUpgrade`命令。该命令在MongoDB 3.0到MongoDB 3.6中可用，支持将`MONGODB-CR`用户系统升级为`SCRAM`用户的过程。

如果您的部署在`MONGODB-CR`模式中存储了用户凭据，则在升级到4.0版本**之前，**您必须升级到[咸挑战响应身份验证机制（SCRAM](https://www.mongodb.com/docs/upcoming/core/security-scram/#std-label-authentication-scram)）。有关升级到`SCRAM`的信息，请参阅[升级到SCRAM。](https://www.mongodb.com/docs/upcoming/release-notes/3.0-scram/)

### 从`db.copyDatabase()`中删除`MONGODB-CR`支持`copydb`

方法`db.copyDatabase()`无法从强制执行`MONGODB-CR`身份验证的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例复制。

`copydb`命令无法从强制`MONGODB-CR`身份验证的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例复制。结合此更改，MongoDB 4.0删除了`copydbgetnonce`命令。

## 不建议使用MMAPv1

从4.0版本开始，MongoDB不建议使用MMAPv1存储引擎。

要将您的MMAPv1存储引擎部署更改为[WiredTiger存储引擎](https://www.mongodb.com/docs/upcoming/core/wiredtiger/)，请参阅：

- [将“独立产品”更改为“WiredTiger”](https://www.mongodb.com/docs/upcoming/tutorial/change-standalone-wiredtiger/)
- [将副本集更改为WiredTiger](https://www.mongodb.com/docs/upcoming/tutorial/change-replica-set-wiredtiger/)
- [将分片集群更改为WiredTiger](https://www.mongodb.com/docs/upcoming/tutorial/change-sharded-cluster-wiredtiger/)

## x.509 认证证书限制

从MongoDB 4.2开始，如果指定`--tlsAllowInvalidateCertificates`或`net.tls.allowInvalidCertificates：true`在使用x.509身份验证时，无效证书仅足以建立TLS连接，但不足以进行身份验证。

如果您使用无效证书执行x.509身份验证，请将证书更新为有效证书。例如，您可以使用受信任的CA对现有证书进行签名，或者如果使用自定义CA，请使用[`net.ssl.CAFile`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.ssl.CAFile)指定CA[。](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.ssl.CAFile)

## 副本集

### 删除复制集的`pv0`

从4.0版本开始，MongoDB删除了已弃用的副本集协议版本0 `pv0`。

在升级到MongoDB 4.0之前，您必须升级到[`pv1`。](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.protocolVersion)

要升级到`pv1`，请将`mongo` shell连接到副本集主副本，并执行以下操作序列：

```
cfg = rs.conf();
cfg.protocolVersion=1;
rs.reconfig(cfg);
```

为了减少[`w:1`](https://www.mongodb.com/docs/upcoming/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)回滚的可能性，您还可以将副本集重新配置为更高的[`settings.catchUpTimeoutMillis`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.catchUpTimeoutMillis)设置。

有关`pv1`的更多信息，请参阅[Replica Set协议版本。](https://www.mongodb.com/docs/upcoming/reference/replica-set-protocol-versions/)

### 删除主从复制

MongoDB 4.0取消了对已弃用的主从复制的支持。在升级到MongoDB 4.0之前，如果您的部署使用主从复制，则必须升级到副本集。

要从主从复制转换为副本集，请参阅

### 日志和复制集

从MongoDB 4.0开始，对于使用WiredTiger存储引擎的复制集成员，您无法指定`--nojournal`选项或`storage.journal.enabled: false`。

### 索引构建和复制集

不能使用[`--replSet`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--replSet)或 [`replication.replSetName`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-replication.replSetName)指定`--noIndexBuildRetry`或storage.indexBuildRetry。也就是说，不能对属于副本集的mongod实例使用--noIndexBuildRetry或`storage.indexBuildRetry`。

### 回滚限制

MongoDB 4.0取消了可以[回滚](https://www.mongodb.com/docs/upcoming/core/replica-set-rollbacks/)的数据量限制。在之前的版本中，[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例不会回滚超过300兆字节的数据，如果需要回滚超过300兆字节的数据，则需要手动干预。

从MongoDB 4.0开始，回滚时间限制默认为1天，可以使用新参数[`rollbackTimeLimitSecs`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.rollbackTimeLimitSecs)配置。在早期版本中，回滚时间限制不可配置，设置为30分钟。

## 分片集群

[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)对影响分片集群元数据的以下操作使用[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)写入关注：

| 命令                                                         | 方法                                                         | 笔记                |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :------------------ |
| [`addShard`](https://www.mongodb.com/docs/upcoming/reference/command/addShard/#mongodb-dbcommand-dbcmd.addShard) | [`sh.addShard()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.addShard/#mongodb-method-sh.addShard) |                     |
| [`create`](https://www.mongodb.com/docs/upcoming/reference/command/create/#mongodb-dbcommand-dbcmd.create) | [`db.createCollection()`](https://www.mongodb.com/docs/upcoming/reference/method/db.createCollection/#mongodb-method-db.createCollection) |                     |
| [`drop`](https://www.mongodb.com/docs/upcoming/reference/command/drop/#mongodb-dbcommand-dbcmd.drop) | [`db.collection.drop()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.drop/#mongodb-method-db.collection.drop) |                     |
| [`dropDatabase`](https://www.mongodb.com/docs/upcoming/reference/command/dropDatabase/#mongodb-dbcommand-dbcmd.dropDatabase) | [`db.dropDatabase()`](https://www.mongodb.com/docs/upcoming/reference/method/db.dropDatabase/#mongodb-method-db.dropDatabase) | 在MongoDB 3.6中更改 |
| [`enableSharding`](https://www.mongodb.com/docs/upcoming/reference/command/enableSharding/#mongodb-dbcommand-dbcmd.enableSharding) | [`sh.enableSharding()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.enableSharding/#mongodb-method-sh.enableSharding) |                     |
| [`movePrimary`](https://www.mongodb.com/docs/upcoming/reference/command/movePrimary/#mongodb-dbcommand-dbcmd.movePrimary) |                                                              |                     |
| [`renameCollection`](https://www.mongodb.com/docs/upcoming/reference/command/renameCollection/#mongodb-dbcommand-dbcmd.renameCollection) | [`db.collection.renameCollection()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.renameCollection/#mongodb-method-db.collection.renameCollection) |                     |
| [`shardCollection`](https://www.mongodb.com/docs/upcoming/reference/command/shardCollection/#mongodb-dbcommand-dbcmd.shardCollection) | [`sh.shardCollection()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection) |                     |
| [`removeShard`](https://www.mongodb.com/docs/upcoming/reference/command/removeShard/#mongodb-dbcommand-dbcmd.removeShard) |                                                              |                     |
| [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion) |                                                              |                     |

## `4.0`功能兼容性

4.0中的一些功能不仅需要4.0二进制文件，还需要将`featureCompatibilityVersion`设置为`4.0`。这些功能包括：

- [SCRAM-SHA-256](https://www.mongodb.com/docs/upcoming/release-notes/4.0/#std-label-4.0-scram-sha-256)
- [新型转换运算符和增强功能](https://www.mongodb.com/docs/upcoming/release-notes/4.0/#std-label-4.0-agg-type-conversion)
- [多文档交易](https://www.mongodb.com/docs/upcoming/release-notes/4.0/#std-label-4.0-txn)
- [$dateToString选项更改](https://www.mongodb.com/docs/upcoming/release-notes/4.0/#std-label-4.0-dateToString)
- [新的变更流方法](https://www.mongodb.com/docs/upcoming/release-notes/4.0/#std-label-4.0-change-stream-methods)
- [更改流恢复令牌数据类型更改](https://www.mongodb.com/docs/upcoming/release-notes/4.0/#std-label-4.0-resume-token)

## 一般的

- 地理空间查询运算符[`$near`](https://www.mongodb.com/docs/upcoming/reference/operator/query/near/#mongodb-query-op.-near)和[`$nearSphere`](https://www.mongodb.com/docs/upcoming/reference/operator/query/nearSphere/#mongodb-query-op.-nearSphere)现在支持对分片集合进行查询。
- 对于 [`create`](https://www.mongodb.com/docs/upcoming/reference/command/create/#mongodb-dbcommand-dbcmd.create)命令（和mongo shell  [`db.createCollection()`](https://www.mongodb.com/docs/upcoming/reference/method/db.createCollection/#mongodb-method-db.createCollection)方法），在本地数据库以外的数据库中创建集合时，不能将选项autoIndexId设置为false。
- 启用[身份验证](https://www.mongodb.com/docs/upcoming/core/authentication/#std-label-authentication)后，在没有[`listDatabases`](https://www.mongodb.com/docs/upcoming/reference/privilege-actions/#mongodb-authaction-listDatabases)操作特权的情况下运行[`listDatabases`](https://www.mongodb.com/docs/upcoming/reference/command/listDatabases/#mongodb-dbcommand-dbcmd.listDatabases)命令将返回运行该命令的用户具有[`find`](https://www.mongodb.com/docs/upcoming/reference/privilege-actions/#mongodb-authaction-find)操作权限的所有数据库的列表。在之前的版本中，在没有[`listDatabases`](https://www.mongodb.com/docs/upcoming/reference/privilege-actions/#mongodb-authaction-listDatabases)操作的情况下运行命令会导致`Unauthorized`响应。
- [`taskExecutorPoolSize`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.taskExecutorPoolSize)的默认值从`0`更改为1。在Linux上，要恢复4.0部署的先前行为，settaskExecutorPoolSize为`0`和[AsyncRequestsSenderUseBaton](https://www.mongodb.com/docs/v4.0/reference/parameters/#param.AsyncRequestsSenderUseBaton)`false`。
- MongoDB 4.0删除了将[mongod](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-mongod)和[mongos](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#std-label-mongos)s实例的transportLayer和net.transportLayer设置为legacy的功能。transportLayer设置自动设置为asio，且无法修改。
- 从MongoDB 4.0开始，[`reIndex`](https://www.mongodb.com/docs/upcoming/reference/command/reIndex/#mongodb-dbcommand-dbcmd.reIndex)命令及其helperdb[`db.collection.reIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.reIndex/#mongodb-method-db.collection.reIndex)采用[`Global exclusive (W) lock`](https://www.mongodb.com/docs/upcoming/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.locks)，并将阻止其他操作，直到完成。
- 如果为`year`、`isoYear`和`timezone`以外的字段指定的值超出有效范围，[`$dateFromParts`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/dateFromParts/#mongodb-expression-exp.-dateFromParts)携带或减去其他日期部分的差额来计算日期。在之前的版本中，超过范围的值会导致错误。
- 改变了[`killCursors`](https://www.mongodb.com/docs/upcoming/reference/privilege-actions/#mongodb-authaction-killCursors)特权操作的行为。在MongoDB 4.0之前，如果用户知道该光标的ID，他们可以杀死任何光标。从MongoDB 4.0起，[`killCursors`](https://www.mongodb.com/docs/upcoming/reference/privilege-actions/#mongodb-authaction-killCursors)特权允许用户杀死与当前身份验证的用户关联的任何光标。如果用户没有终止光标的权限，[`killCursors`](https://www.mongodb.com/docs/upcoming/reference/command/killCursors/#mongodb-dbcommand-dbcmd.killCursors)将返回错误。
- MongoDB 4.0添加了[`killAnyCursor`](https://www.mongodb.com/docs/upcoming/reference/privilege-actions/#mongodb-authaction-killAnyCursor)特权操作，授予用户为指定集合终止任何光标的权限。
- 当试图连接到[功能兼容性版本（fCV）](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)大于[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例时，[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)二进制文件将崩溃。例如，您无法将MongoDB 4.0版本[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)连接到[fCV](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)设置为4.2的4.2分片集群。但是，您可以将MongoDB 4.0版本的[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)连接到[fCV](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)设置为4.0的4.2分片集群。

- 从4.0开始，MongoDB按配置解析`localhost`IP地址，而不是假设`127.0.0.1`。

### `cursor.min()`和`cursor.max()`

如果您使用[`max()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.max/#mongodb-method-cursor.max)和[`min()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.min/#mongodb-method-cursor.min)来指定范围，则[`max()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.max/#mongodb-method-cursor.max)指定的边界必须大于[`min()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.min/#mongodb-method-cursor.min)指定的绑定[。](https://www.mongodb.com/docs/upcoming/reference/method/cursor.min/#mongodb-method-cursor.min)

在之前的版本中，边界可以相等，但不会扫描索引条目，总是导致一个空的结果集。

## 禁用TLS 1.0

MongoDB二进制文件（[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)、[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)和`mongo`）在提供TLS 1.1+的系统上禁用对TLS 1.0加密的支持。

如果您需要支持TLS 1.0：

- 对于[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，您可以指定`none`tonet[`net.ssl.disabledProtocols`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.ssl.disabledProtocols)或[`--sslDisabledProtocols none`。](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--sslDisabledProtocols)

- 对于[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例，您可以指定`none`tonet[`net.ssl.disabledProtocols`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.ssl.disabledProtocols)或[`--sslDisabledProtocols none`。](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#std-option-mongos.--sslDisabledProtocols)

- 对于mongo shell，您可以指定`--sslDisabledProtocols none`。

  `-sslDisabledProtocols`选项可用于mongo shell，位于：

  - MongoDB 4.0+版本
  - MongoDB 3.6.5版本+
  - MongoDB版本3.4.15+

在macOS上，要将mongo shell 3.6.4或更早版本连接到MongoDB 4.0+部署，需要显式启用TLS 1.0。

## AES-GCM

Windows上的MongoDB Enterprise不再支持`AES256-GCM`。此密码现在仅在Linux上可用。

## `mongo`shell

### `show collections`

在mongo shell中，show collections等价于：

```
db.runCommand( { listCollections: 1.0, authorizedCollections: true, nameOnly: true } )
```

* 对于具有所需访问权限的用户，`show collections`列出了数据库的非系统集合。
* 对于没有所需访问权限的用户，`show collections`仅列出用户拥有特权的集合。

当4.0版本的mongo shell连接到不支持`authorizedCollections`和`nameOnly`选项的早期版本MongoDB部署时，

- 用户必须拥有运行[`listCollections`](https://www.mongodb.com/docs/upcoming/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections)所需的访问权限[。](https://www.mongodb.com/docs/upcoming/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections)
- 如果用户没有所需的访问权限并运行`show collections`，MongoDB使用[`connectionStatus`](https://www.mongodb.com/docs/upcoming/reference/command/connectionStatus/#mongodb-dbcommand-dbcmd.connectionStatus)返回的[`authenticatedUserPrivileges`](https://www.mongodb.com/docs/upcoming/reference/command/connectionStatus/#mongodb-data-connectionStatus.authInfo.authenticatedUserPrivileges)字段为用户返回大致的集合列表。

### `db.getCollectionNames()`

[`db.getCollectionNames()`](https://www.mongodb.com/docs/upcoming/reference/method/db.getCollectionNames/#mongodb-method-db.getCollectionNames)等价于：

```
db.runCommand( { listCollections: 1.0, authorizedCollections: true, nameOnly: true } )
```

- 对于具有所需访问权限（在数据库上授予[`listCollections`](https://www.mongodb.com/docs/upcoming/reference/privilege-actions/#mongodb-authaction-listCollections)操作的特权）的用户，该方法列出了数据库所有集合的名称。
- 对于没有所需访问权限的用户，该方法仅列出用户拥有特权的集合。例如，如果用户在数据库中的特定集合上[`find`](https://www.mongodb.com/docs/upcoming/reference/privilege-actions/#mongodb-authaction-find)，该方法将仅返回该集合。

## 删除了二进制和不建议使用的字段/命令

### `mongoperf`

MongoDB 4.0删除了`mongoperf`二进制文件。

### `copydb`和`clone`命令

MongoDB 4.0不建议使用[copydb](https://www.mongodb.com/docs/v4.0/reference/command/copydb/)和[無性系](https://www.mongodb.com/docs/v4.0/reference/command/clone/)命令和他们的[蒙古](https://www.mongodb.com/docs/v4.0/reference/program/mongo/)贝壳帮手[db.copy数据库（）](https://www.mongodb.com/docs/v4.0/reference/method/db.copyDatabase/)和[db.cloneDatabase（）。](https://www.mongodb.com/docs/v4.0/reference/method/db.cloneDatabase/)

作为替代方案，用户可以使用[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)和[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)（带有themorestore选项[`--nsFrom`](https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--nsFrom)和[`--nsTo`](https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--nsTo)）或使用驱动程序编写脚本。

例如，要将`test`数据库从在默认端口27017上运行的本地实例复制到同一实例上的`examples`数据库，您可以：

* 使用[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)将测试数据库转储到归档文件mongodump-test-db：

  ```
  mongodump --archive="mongodump-test-db" --db=test
  ```

* 使用[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)与[`--nsFrom`](https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--nsFrom)和[`--nsTo`](https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--nsTo)从存档中恢复（通过数据库名称更改）：

  ```
  mongorestore --archive="mongodump-test-db" --nsFrom='test.*' --nsTo='examples.*'
  ```

> 提示：
>
> 必要时包括其他选项，例如指定uri或主机、用户名、密码和身份验证数据库。

或者，您可以[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)`test`数据库到标准输出流和管道进入[`mongorestore`：](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)

```
mongodump --archive --db=test | mongorestore --archive  --nsFrom='test.*' --nsTo='examples.*'
```

#### 参数：

* MongoDB删除了过时的`logUserIds`参数。改为使用[审计](https://www.mongodb.com/docs/upcoming/core/auditing/)。

### `$isolated`运算符号

MongoDB放弃了对`$isolated`运算符的支持。如果您有一个包含`$isolated`运算符的现有部分索引或包含`$isolated`运算符的视图，请在升级之前在定义中重新创建没有运算符的索引或视图。

代替`$isolated`运算符，而是使用[事务](https://www.mongodb.com/docs/upcoming/core/transactions/)。

### `geoNear`指挥权

MongoDB 4.0不建议使用`geoNear`命令。改为使用以下操作之一。

- [`$geoNear`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)聚合阶段。
- [`$near`](https://www.mongodb.com/docs/upcoming/reference/operator/query/near/#mongodb-query-op.-near)查询操作员。
- [`$nearSphere`](https://www.mongodb.com/docs/upcoming/reference/operator/query/nearSphere/#mongodb-query-op.-nearSphere)查询操作员。

### `maxScan`选项

MongoDB不赞成[`find`](https://www.mongodb.com/docs/upcoming/reference/command/find/#mongodb-dbcommand-dbcmd.find)命令的选项maxScan和mongo shell助手游标.maxScan（）。而是使用maxTimeMS选项或帮助器[`cursor.maxTimeMS()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.maxTimeMS/#mongodb-method-cursor.maxTimeMS)。

### 输出字段更改

* 不建议使用从[`replSetGetStatus`](https://www.mongodb.com/docs/upcoming/reference/command/replSetGetStatus/#mongodb-dbcommand-dbcmd.replSetGetStatus)返回的以下字段：

  - [`replSetGetStatus.syncingTo`](https://www.mongodb.com/docs/upcoming/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.syncingTo)

  - [`replSetGetStatus.members[n\].syncingTo`](https://www.mongodb.com/docs/upcoming/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.members-n-.syncingTo)

  - 改用

    [`replSetGetStatus.syncSourceHost`](https://www.mongodb.com/docs/upcoming/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.syncSourceHost)和[`replSetGetStatus.members[n\].syncSourceHost`](https://www.mongodb.com/docs/upcoming/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.members-n-.syncSourceHost)

  - [`$currentOp`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/currentOp/#mongodb-pipeline-pipe.-currentOp)聚合阶段、[`currentOp`](https://www.mongodb.com/docs/upcoming/reference/command/currentOp/#mongodb-dbcommand-dbcmd.currentOp)命令和[`db.currentOp()`](https://www.mongodb.com/docs/upcoming/reference/method/db.currentOp/#mongodb-method-db.currentOp)助手不再在其输出中返回`threadId`字段。

  - [`serverStatus`](https://www.mongodb.com/docs/upcoming/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)命令现在总是为[`asserts.warning`](https://www.mongodb.com/docs/upcoming/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.asserts.warning)字段返回`0`。

     





原文 - [Compatibility Changes in MongoDB 4.0]( https://docs.mongodb.com/manual/release-notes/4.0-compatibility/ )

