## 监控 MongoDB

监控是所有数据库管理的关键组成部分。牢牢掌握 MongoDB 的报告将使您能够评估数据库的状态并在没有危机的情况下维护您的部署。此外，了解 MongoDB 的正常操作参数将使您能够在问题升级为故障之前对其进行诊断。

本文档概述了 MongoDB 中可用的监控实用程序和报告统计信息。它还介绍了监控副本集和分片集群的诊断策略和建议。

### 监控策略

MongoDB 提供了各种方法来收集有关正在运行的 MongoDB 实例状态的数据：

- 从版本 4.0 开始，MongoDB 为独立版本和副本集提供[免费的云监控](https://www.mongodb.com/docs/manual/administration/free-monitoring/)。
- MongoDB 分发了一组实用程序，可提供数据库活动的实时报告。
- MongoDB 提供各种[数据库命令](https://www.mongodb.com/docs/manual/reference/command/)，以更高的保真度返回有关当前数据库状态的统计信息。
- [MongoDB 阿特拉斯](https://www.mongodb.com/atlas/database?tck=docs_server) 是一个云托管的数据库即服务，用于运行、监控和维护 MongoDB 部署。
- [MongoDB 云管理器](https://cloud.mongodb.com/?tck=docs_server)是一项托管服务，用于监视正在运行的 MongoDB 部署以收集数据并根据该数据提供可视化和警报。
- MongoDB Ops Manager 是[MongoDB Enterprise Advanced 中提供的本地解决方案](https://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server) 它监视正在运行的 MongoDB 部署以收集数据并根据该数据提供可视化和警报。

每种策略都可以帮助回答不同的问题，并且在不同的情况下都很有用。这些方法是互补的。

### MongoDB 报告工具

本节概述了随 MongoDB 一起分发的报告方法。它还提供了每种方法最适合帮助您解决的问题类型的示例。

#### 免费监控

*4.0版本中的新功能*。

MongoDB 为独立或副本集提供[免费的云监控](https://www.mongodb.com/docs/manual/administration/free-monitoring/)。

默认情况下，您可以使用 [`db.enableFreeMonitoring()`](https://www.mongodb.com/docs/manual/reference/method/db.enableFreeMonitoring/#mongodb-method-db.enableFreeMonitoring)和启用/禁用运行时期间的免费监控[`db.disableFreeMonitoring()`。](https://www.mongodb.com/docs/manual/reference/method/db.disableFreeMonitoring/#mongodb-method-db.disableFreeMonitoring)

免费监控提供长达24小时的数据。更多详情，请参阅 [免费监控。](https://www.mongodb.com/docs/manual/administration/free-monitoring/)

#### 实用工具

MongoDB 发行版包含许多实用程序，可以快速返回有关实例性能和活动的统计信息。通常，这些对于诊断问题和评估正常操作最有用。

#### `mongostat`

[`mongostat`](https://www.mongodb.com/docs/database-tools/mongostat/#mongodb-binary-bin.mongostat)按类型（例如插入、查询、更新、删除等）捕获并返回数据库操作的计数。这些计数报告服务器上的负载分布。

使用[`mongostat`](https://www.mongodb.com/docs/database-tools/mongostat/#mongodb-binary-bin.mongostat)了解运营类型的分布并为容量规划提供信息。请参阅[`mongostat`](https://www.mongodb.com/docs/database-tools/mongostat/#mongodb-binary-bin.mongostat) 详细信息请参考页面。

`mongotop`

[`mongotop`](https://www.mongodb.com/docs/database-tools/mongotop/#mongodb-binary-bin.mongotop)跟踪并报告 MongoDB 实例的当前读写活动，并按集合报告这些统计信息。

使用[`mongotop`](https://www.mongodb.com/docs/database-tools/mongotop/#mongodb-binary-bin.mongotop)检查您的数据库活动和使用是否符合您的期望。请参阅[`mongotop`](https://www.mongodb.com/docs/database-tools/mongotop/#mongodb-binary-bin.mongotop)详细信息请参考页面。

#### HTTP 控制台

*版本3.6中的更改*：MongoDB 3.6 删除了已弃用的 HTTP 接口和 MongoDB 的 REST API。

#### 命令

MongoDB 包含许多报告数据库状态的命令。

这些数据可以提供比上面讨论的实用程序更精细的粒度。考虑在脚本和程序中使用它们的输出来开发自定义警报，或修改应用程序的行为以响应实例的活动。该[`db.currentOp()`](https://www.mongodb.com/docs/manual/reference/method/db.currentOp/#mongodb-method-db.currentOp) 方法是识别数据库实例正在进行的操作的另一个有用工具。

#### `serverStatus`

该[`serverStatus`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)命令或[`db.serverStatus()`](https://www.mongodb.com/docs/manual/reference/method/db.serverStatus/#mongodb-method-db.serverStatus) 来自 shell，返回数据库状态的总体概述，详细说明磁盘使用情况、内存使用情况、连接、日志记录和索引访问。该命令返回很快，并且不影响 MongoDB 性能。

[`serverStatus`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)输出 MongoDB 实例状态的帐户。该命令很少直接运行。在大多数情况下，数据在汇总后更有意义，正如人们通过监控工具看到的那样，包括[MongoDB 云管理器](https://cloud.mongodb.com/?tck=docs_server)和[运营经理](https://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server)。尽管如此，所有管理员都应该熟悉 [`serverStatus`.](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)

#### `dbStats`

该[`dbStats`](https://www.mongodb.com/docs/manual/reference/command/dbStats/#mongodb-dbcommand-dbcmd.dbStats)命令或[`db.stats()`](https://www.mongodb.com/docs/manual/reference/method/db.stats/#mongodb-method-db.stats)来自 shell，返回一个解决存储使用和数据量问题的文档。它们 [`dbStats`](https://www.mongodb.com/docs/manual/reference/command/dbStats/#mongodb-dbcommand-dbcmd.dbStats)反映了所使用的存储量、数据库中包含的数据量以及对象、集合和索引计数器。

使用此数据来监视特定数据库的状态和存储容量。此输出还允许您比较数据库之间的使用情况并确定 数据库中的平均[文档大小。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-document)

#### `collStats`

或来自 shell，它提供类似于集合级别的统计信息，包括集合中对象的计数、集合的大小、集合使用的磁盘空间量以及有关其索引的信息[`collStats`](https://www.mongodb.com/docs/manual/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats)。[`db.collection.stats()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.stats/#mongodb-method-db.collection.stats)[`dbStats`](https://www.mongodb.com/docs/manual/reference/command/dbStats/#mongodb-dbcommand-dbcmd.dbStats)

#### `replSetGetStatus`

该[`replSetGetStatus`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-dbcommand-dbcmd.replSetGetStatus)命令（[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)来自 shell）返回副本集状态的概述。replSetGetStatus文档详细介绍了副本集的状态和配置以及有关其成员的统计信息[。](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/)

使用此数据可确保复制配置正确，并检查当前主机与副本集其他成员之间的连接。

#### 托管 (SaaS) 监控工具

这些是作为托管服务提供的监控工具，通常通过付费订阅来提供。

| 名称                                                         | 笔记                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [MongoDB cloud manager](https://cloud.mongodb.com/?tck=docs_server) | MongoDB Cloud Manager是一套基于云的服务，用于管理 MongoDB 部署。MongoDB Cloud Manager提供监控、备份和自动化功能。对于本地解决方案，另请参阅 [Ops Manager，可在 MongoDB Enterprise Advanced 中使用。](https://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server) |
| [VividCortex](https://www.vividcortex.com/)                  | VividCortex 提供对 MongoDB 的深入见解[生产数据库工作负载和查询性能](https://www.vividcortex.com/product/how-it-works)——以一秒的分辨率。跟踪延迟、吞吐量、错误等，以确保 MongoDB 上的应用程序的可扩展性和卓越性能。 |
| [Scout](http://scoutapp.com/)                                | 几个插件，包括[MongoDB监控](https://scoutapp.com/plugin_urls/391-mongodb-monitoring), [MongoDB 慢查询](http://scoutapp.com/plugin_urls/291-mongodb-slow-queries)， 和[MongoDB 副本集监控](http://scoutapp.com/plugin_urls/2251-mongodb-replica-set-monitoring)。 |
| [Server Density](http://www.serverdensity.com/)              | [MongoDB 仪表板](http://www.serverdensity.com/mongodb-monitoring/)、MongoDB 特定警报、复制故障转移时间表以及 iPhone、iPad 和 Android 移动应用程序。 |
| [Application Performance Management](http://ibmserviceengage.com/) | IBM 拥有应用程序性能管理 SaaS 产品，其中包括 MongoDB 以及其他应用程序和中间件的监控器。 |
| [New Relic](http://newrelic.com/)                            | New Relic 为应用程序性能管理提供全面支持。此外，New Relic 插件和见解使您能够在 New Relic 中查看来自 Cloud Manager 的监控指标。 |
| [Datadog](https://www.datadoghq.com/)                        | [基础设施监控](http://docs.datadoghq.com/integrations/mongodb/)可视化 MongoDB 部署的性能。 |
| [SPM Performance Monitoring](https://sematext.com/spm)       | [监控、异常检测和警报](https://sematext.com/spm/integrations/mongodb-monitoring/)SPM 监控所有关键 MongoDB 指标以及基础设施，包括。Docker 和其他应用程序指标，例如 Node.js、Java、NGINX、Apache、HAProxy 或 Elasticsearch。SPM 提供指标和日志的关联。 |
| [Pandora FMS](http://www.pandorafms.com/)                    | 潘多拉 FMS 提供[PandoraFMS-mongodb-监控](http://blog.pandorafms.org/how-to-monitor-mongodb-or-how-to-keep-your-users-happy/) 监控 MongoDB 的插件。 |

### 过程记录

在正常操作期间，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 将所有服务器活动和操作的实时记录报告到标准输出或日志文件。以下运行时设置控制这些选项。

- [`quiet`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-systemLog.quiet)。限制写入日志或输出的信息量。
- [`verbosity`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-systemLog.verbosity)。增加写入日志或输出的信息量。您还可以在运行时使用shell 中的[`logLevel`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.logLevel)参数或 方法修改日志记录的详细程度。[`db.setLogLevel()`](https://www.mongodb.com/docs/manual/reference/method/db.setLogLevel/#mongodb-method-db.setLogLevel)
- [`path`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-systemLog.path)。启用记录到文件，而不是标准输出。调整此设置时必须指定日志文件的完整路径。
- [`logAppend`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-systemLog.logAppend)。将信息添加到日志文件而不是覆盖该文件。

> 笔记
>
> 您可以将这些配置操作指定为[mongod](https://www.mongodb.com/docs/manual/reference/program/mongod/)或[mongos 的命令行参数](https://www.mongodb.com/docs/manual/reference/program/mongos/)
>
> 例如：
>
> ```
> mongod -v --logpath /var/log/mongodb/server1.log --logappend
> ```
>
> [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在模式下启动实例[`verbose`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-systemLog.verbosity)，将数据附加到位于 的日志文件中 `/var/log/mongodb/server1.log/`。

以下[数据库命令](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-database-command)也会影响日志记录：

- [`getLog`](https://www.mongodb.com/docs/manual/reference/command/getLog/#mongodb-dbcommand-dbcmd.getLog)。显示 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)进程日志中的最新消息。
- [`logRotate`](https://www.mongodb.com/docs/manual/reference/command/logRotate/#mongodb-dbcommand-dbcmd.logRotate)。仅轮换进程的日志文件[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 。请参阅[轮换日志文件。](https://www.mongodb.com/docs/manual/tutorial/rotate-log-files/)

### 日志编辑

*仅适用于 MongoDB 企业版*

或运行 with 在记录之前编辑伴随给定日志事件的任何消息，仅留下与事件相关的元数据、源文件或行号[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。防止潜在的敏感信息进入系统日志，但会牺牲诊断详细信息。[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)[`redactClientLogData`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.redactClientLogData)[`redactClientLogData`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.redactClientLogData)

例如，以下操作将文档插入到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)正在运行的无日志编辑中。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 日志[详细级别](https://www.mongodb.com/docs/manual/reference/log-messages/#std-label-log-messages-configure-verbosity)设置为 `1`：

```
db.clients.insertOne( { "name" : "Joe", "PII" : "Sensitive Information" } )
```

此操作会产生以下日志事件：

```
2017-06-09T13:35:23.446-04:00 I COMMAND  [conn1] command internal.clients
   appName: "MongoDB Shell"
   command: insert {
      insert: "clients",
      documents: [ {
            _id: ObjectId('593adc5b99001b7d119d0c97'),
            name: "Joe",
            PII: " Sensitive Information"
         } ],
      ordered: true
   }
   ...
```

当[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)运行并[`redactClientLogData`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.redactClientLogData)执行相同的插入操作时，它会生成以下日志事件：

```
2017-06-09T13:45:18.599-04:00 I COMMAND  [conn1] command internal.clients
   appName: "MongoDB Shell"
   command: insert {
      insert: "###", documents: [ {
         _id: "###", name: "###", PII: "###"
      } ],
      ordered: "###"
   }
```

[与静态加密](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/#std-label-security-encryption-at-rest)和[TLS/SSL（传输加密）](https://www.mongodb.com/docs/manual/core/security-transport-encryption/#std-label-transport-encryption)[`redactClientLogData`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.redactClientLogData)结合 使用，以帮助遵守法规要求。

### 诊断性能问题

当您使用 MongoDB 开发和操作应用程序时，您可能希望分析数据库作为应用程序的性能。 [MongoDB 性能](https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/)讨论了一些可能影响性能的操作因素。

### 复制和监控

除了任何 MongoDB 实例的基本监控要求之外，对于副本集，管理员还必须监控*复制延迟*。[“复制延迟”是指将主服务器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)上的写操作复制（即复制）到 [辅助](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)服务器所需的时间量。一些小的延迟时间可能是可以接受的，但随着复制滞后的增长，会出现严重的问题，包括：

- 主节点上的缓存压力越来越大。
- 滞后期间发生的操作不会复制到一个或多个辅助节点。如果您使用复制来确保数据持久性，则异常长的延迟可能会影响数据集的完整性。
- [如果复制延迟超过操作日志 ( oplog](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-oplog) )的长度，那么 MongoDB 将必须在辅助数据库上执行初始同步，从主数据库复制所有数据[并](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)重建所有索引。[[ 1 \]](https://www.mongodb.com/docs/manual/administration/monitoring/#footnote-oplog)这在正常情况下并不常见，但如果您将 oplog 配置为小于默认值，则可能会出现问题。

> 笔记:
>
> oplog 的大小只能在第一次运行期间使用命令[`--oplogSize`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--oplogSize)的参数进行配置[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，或者最好 [`oplogSizeMB`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.oplogSizeMB)使用 MongoDB 配置文件中的设置。如果在使用该选项运行之前未在命令行上指定此项[`--replSet`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--replSet) ，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)将创建默认大小的 oplog。
>
> 默认情况下，oplog 占 64 位系统上总可用磁盘空间的 5%。有关更改 oplog 大小的更多信息，请参阅[更改 Oplog 的大小。](https://www.mongodb.com/docs/manual/tutorial/change-oplog-size/)

#### 流量控制

从 MongoDB 4.2 开始，管理员可以限制主数据库应用其写入的速率，以将延迟保持在[`majority committed`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.optimes.lastCommittedOpTime)可配置的最大值以下[`flowControlTargetLagSeconds`。](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.flowControlTargetLagSeconds)

缺省情况下，流量控制为[`enabled`。](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.enableFlowControl)

> 笔记:
>
> 为了进行流量控制，副本集/分片集群必须具有：[featureCompatibilityVersion (fCV)](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv) of `4.2`和 read Concern [`majority enabled`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.enableMajorityReadConcern)。`4.2`也就是说，如果 fCV 未启用或读关注多数被禁用，则启用的流控制无效。

另请参阅：[检查复制延迟。](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#std-label-replica-set-replication-lag)

#### 副本集状态

复制问题通常是由于成员之间的网络连接问题造成的，或者是由于主[节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)没有资源来支持应用程序和复制流量造成的。要检查副本的状态，请[`replSetGetStatus`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-dbcommand-dbcmd.replSetGetStatus)在 shell 中使用以下帮助程序：

```
rs.status()
```

该[`replSetGetStatus`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-dbcommand-dbcmd.replSetGetStatus)参考提供了此输出的更深入的概述。[一般情况下，请注意的](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)值 [`optimeDate`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.members-n-.optimeDate)，特别要注意[主次](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)成员 之间的时间差。

oplog 可以增长超过其配置的大小限制，以避免删除[`majority commit point`.](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.optimes.lastCommittedOpTime)

#### 免费监控

> 笔记
>
> 从 4.0 版本开始，MongoDB 提供对独立集和副本集的[免费监控](https://www.mongodb.com/docs/manual/administration/free-monitoring/)。有关更多信息，请参阅[免费监控。](https://www.mongodb.com/docs/manual/administration/free-monitoring/)

#### Oplog条目应用缓慢

从版本 4.2 开始，副本集的辅助成员现在会记录应用时间超过慢速操作阈值的[oplog 条目。](https://www.mongodb.com/docs/manual/core/replica-set-oplog/#std-label-slow-oplog-application)这些缓慢的 oplog 消息：

- 记录在 中的辅助节点 [`diagnostic log`。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--logpath)
- 记录在[`REPL`](https://www.mongodb.com/docs/manual/reference/log-messages/#mongodb-data-REPL)带有文本的组件 下`applied op: <oplog entry> took <num>ms`。
- 不依赖日志级别（无论是系统级别还是组件级别）
- 不依赖于分析级别。
- 可能会受到影响[`slowOpSampleRate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate)，具体取决于您的 MongoDB 版本：
  * 在 MongoDB 4.2 中，这些慢速 oplog 条目不受[`slowOpSampleRate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate). 无论采样率如何，MongoDB 都会记录所有慢速 oplog 条目。
  * 在 MongoDB 4.4 及更高版本中，这些缓慢的 oplog 条目受到[`slowOpSampleRate`.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate)

探查器不会捕获慢速 oplog 条目。

#### 分片和监控

[在大多数情况下，分片集群](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)的组件 受益于与所有其他 MongoDB 实例相同的监控和分析。此外，集群需要进一步监控，以确保数据在节点之间有效分布以及分片操作正常运行。

> 提示:
>
> **也可以看看：**
>
> 有关更多信息，请参阅[分片文档。](https://www.mongodb.com/docs/manual/sharding/)

#### 配置服务器

[配置数据库](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-database)维护一个映射，标识哪些文档位于哪些分片上。[当块](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)在分片之间移动时，集群会更新此映射 。当配置服务器无法访问时，某些分片操作将变得不可用，例如移动块和启动[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例。但是，仍然可以从已运行的 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例访问集群。

由于无法访问的配置服务器可能会严重影响分片集群的可用性，因此您应该监控配置服务器以确保集群保持良好的平衡并且实例[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)可以重新启动。

[MongoDB 云管理器](https://cloud.mongodb.com/?tck=docs_server)和[运营经理](https://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server)监视配置服务器，并可以在配置服务器无法访问时创建通知。请参阅 [MongoDB 云管理器文档](https://www.mongodb.com/docs/cloud-manager/)和[运营管理器文档](https://www.mongodb.com/docs/ops-manager/current/application/)了解更多信息。

#### 平衡和块分配

最有效的[分片集群](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)部署可以均匀地平衡 分片之间的[块](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)。为了实现这一点，MongoDB 有一个后台[平衡器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-balancer)进程，用于分配数据以确保块始终在[分片之间最佳分配。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)

从内部 向发出[`db.printShardingStatus()`](https://www.mongodb.com/docs/manual/reference/method/db.printShardingStatus/#mongodb-method-db.printShardingStatus)or命令[`sh.status()`](https://www.mongodb.com/docs/manual/reference/method/sh.status/#mongodb-method-sh.status)[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。这将返回整个集群的概述，包括数据库名称和块列表。

#### 过时的锁

要检查数据库的锁定状态，请 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用以下命令连接到实例[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。发出以下命令序列以切换到`config`数据库并显示分片数据库上所有未完成的锁：

```
use config
db.locks.find()
```

平衡过程采用特殊的“平衡器”锁，以防止其他平衡活动发生。在`config`数据库中，使用以下命令查看“balancer”锁。

```
db.locks.find( { _id : "balancer" } )
```

*版本3.4中的更改*：从 3.4 开始，CSRS 配置服务器的主服务器使用名为“ConfigServer”的进程 ID 持有“平衡器”锁。这个锁永远不会被释放。要确定平衡器是否正在运行，请参阅 [检查平衡器是否正在运行。](https://www.mongodb.com/docs/manual/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-balancing-is-running)

### 存储节点看门狗

> 笔记
>
> - 从 MongoDB 4.2 开始，[存储节点看门狗](https://www.mongodb.com/docs/manual/administration/monitoring/#std-label-storage-node-watchdog)在社区版和 MongoDB 企业版中均可用。
> - 在早期版本（3.2.16+、3.4.7+、3.6.0+、4.0.0+）中， [存储节点看门狗](https://www.mongodb.com/docs/manual/administration/monitoring/#std-label-storage-node-watchdog)仅在 MongoDB 企业版中可用。

存储节点看门狗监视以下 MongoDB 目录以检测文件系统无响应：

- 目录[`--dbpath`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)_
- 目录`journal`里面的目录[`--dbpath`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)
- [`--logpath`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--logpath)文件的目录
- [`--auditPath`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--auditPath)文件的目录

> 笔记
>
> 从 MongoDB 6.1 开始，日志记录始终处于启用状态。因此，MongoDB 删除了该`storage.journal.enabled`选项以及相应的 `--journal`命令`--nojournal`行选项。

默认情况下，存储节点看门狗处于禁用状态。您只能在[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)启动时通过将[`watchdogPeriodSeconds`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.watchdogPeriodSeconds)参数设置为大于或等于 60 的整数来启用存储节点看门狗。但是，一旦启用，您可以暂停存储节点看门狗并在运行时重新启动。[`watchdogPeriodSeconds`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.watchdogPeriodSeconds)详情请参见 参数。

如果包含受监视目录的任何文件系统变得无响应，则存储节点看门狗将终止 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)并以状态代码 61 退出。如果 是 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)副本集的[主成员，则终止将启动](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)[故障转移](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-failover)，允许另一个成员成为主成员。

一旦 a[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)终止，可能无法在*同一台*计算机上干净地重新启动它。

> 笔记
>
> **符号链接**
>
> 如果其监视的任何目录是到其他卷的符号链接，则存储节点看门狗不会监视符号链接目标。
>
> 例如，如果[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)使用 [`storage.directoryPerDB: true`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.directoryPerDB)(或 [`--directoryperdb`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--directoryperdb)) 并将数据库目录符号链接到另一个卷，则存储节点看门狗不会遵循符号链接来监视目标。

存储节点看门狗检测无响应的文件系统并终止所需的最长时间几乎是值的*两倍*[`watchdogPeriodSeconds`。](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.watchdogPeriodSeconds)



 参见

原文 - [Monitoring for MongoDB]( https://docs.mongodb.com/manual/administration/monitoring/ )

