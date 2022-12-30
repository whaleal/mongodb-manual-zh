 The local Database

# 数据库`local`_[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#the-local-database)

## 概述[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#overview)

每个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例都有自己的`local`数据库，用于存储复制过程中使用的数据以及其他特定于实例的数据。数据库对复制是不可见的`local`：数据库中的集合`local`不会被复制。

## `mongod`所有实例上的集合[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#collections-on-all-mongod-instances)

- `local.startup_log`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.startup_log)

  在启动时，每个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例都会插入一个文档到 [`startup_log`](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.startup_log)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)包含有关实例本身和主机信息的诊断 信息。[`startup_log`](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.startup_log)是一个上限集合。此信息主要用于诊断目的。例如，以下是来自 [`startup_log`](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.startup_log)收藏：`{  "_id" : "<string>",  "hostname" : "<string>",  "startTime" : ISODate("<date>"),  "startTimeLocal" : "<string>",  "cmdLine" : {        "dbpath" : "<path>",        "<option>" : <value>  },  "pid" : <number>,  "buildinfo" : {        "version" : "<string>",        "gitVersion" : "<string>",        "sysInfo" : "<string>",        "loaderFlags" : "<string>",        "compilerFlags" : "<string>",        "allocator" : "<string>",        "versionArray" : [ <num>, <num>, <...> ],        "javascriptEngine" : "<string>",        "bits" : <number>,        "debug" : <boolean>,        "maxBsonObjectSize" : <number>  }}`文件在[`startup_log`](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.startup_log)集合包含以下字段：`local.startup_log._id`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.startup_log._id)包括系统主机名和毫秒纪元值。`local.startup_log.hostname`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.startup_log.hostname)系统的主机名。`local.startup_log.startTime`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.startup_log.startTime)反映服务器启动时间的 UTC [ISODate值。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-ISODate)`local.startup_log.startTimeLocal`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.startup_log.startTimeLocal)报告的字符串[`startTime`](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.startup_log.startTime) 在系统的本地时区。`local.startup_log.cmdLine`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.startup_log.cmdLine)报告[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)运行时选项及其值的嵌入式文档。`local.startup_log.pid`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.startup_log.pid)此进程的进程标识符。`local.startup_log.buildinfo`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.startup_log.buildinfo)一个嵌入式文档，报告有关构建环境和用于编译它的设置的信息 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。这与 的输出相同 [`buildInfo`](https://www.mongodb.com/docs/manual/reference/command/buildInfo/#mongodb-dbcommand-dbcmd.buildInfo)。看[`buildInfo`。](https://www.mongodb.com/docs/manual/reference/command/buildInfo/#mongodb-data-buildInfo)

## 副本集成员上的集合[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#collections-on-replica-set-members)

- `local.system.replset`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.system.replset)

  [`local.system.replset`](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.system.replset)将副本集的配置对象作为其单个文档保存。要查看对象的配置信息，请[`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)从[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh). 您也可以直接查询此集合。

- `local.oplog.rs`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.oplog.rs)

  [`local.oplog.rs`](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.oplog.rs)是包含 [oplog](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-oplog)的上限集合。您可以使用设置在创建时设置其大小 [`oplogSizeMB`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.oplogSizeMB)。要在副本集启动后调整 oplog 的大小，请使用 [Change the Size of the Oplog](https://www.mongodb.com/docs/manual/tutorial/change-oplog-size/)过程。有关其他信息，请参阅[Oplog 大小](https://www.mongodb.com/docs/manual/core/replica-set-oplog/#std-label-replica-set-oplog-sizing)部分。从 MongoDB 4.0 开始，oplog 可以增长到超过其配置的大小限制以避免删除[`majority commit point`.](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.optimes.lastCommittedOpTime)从 MongoDB 5.0 开始，不再可能对作为[副本集运行的集群上的](https://www.mongodb.com/docs/manual/replication/#std-label-replication)[oplog](https://www.mongodb.com/docs/manual/core/replica-set-oplog/)执行手动写入操作。在作为 [独立实例](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-standalone)运行时对 oplog 执行写操作只能在 MongoDB 支持的指导下完成。

- `local.replset.minvalid`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.replset.minvalid)

  这包含副本集在内部使用的对象，用于跟踪复制状态。

## 限制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/local-database/#restrictions)

- 多文档事务`local`

  您不能在 [多文档事务](https://www.mongodb.com/docs/manual/core/transactions/)`local`中对数据库 中的集合执行读/写操作[。](https://www.mongodb.com/docs/manual/core/transactions/)

- 可重试写入`local`

  您不能在启用可[重试写入](https://www.mongodb.com/docs/manual/core/retryable-writes/#std-label-retryable-writes)`local`的情况下对 数据库中的集合执行写入操作。重要的官方 MongoDB 4.2 系列驱动程序默认启用可重试写入。写入`local`数据库的应用程序在升级到 4.2 系列驱动程序时会遇到写入错误，*除非*明确禁用可重试写入。要禁用可重试写入， 请在 MongoDB 集群[`retryWrites=false`](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.retryWrites)的 [连接字符串中指定。](https://www.mongodb.com/docs/manual/reference/connection-string/#std-label-mongodb-uri)

←  [副本集故障排除](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/)                        [副本集成员状态](https://www.mongodb.com/docs/manual/reference/replica-states/) →



原文 链接-  https://docs.mongodb.com/manual/reference/local-database/ 

译者：陆文龙



















 ！本页翻译征集中！

请点击页面上方 EDIT THIS PAGE 参与翻译。
详见：
[贡献指南]( https://github.com/JinMuInfo/MongoDB-Manual-zh/blob/master/CONTRIBUTING.md )、
[原文链接](  https://docs.mongodb.com/manual/reference/local-database/  )。

 参见



