## MongoDB 性能

当您使用 MongoDB 开发和操作应用程序时，您可能需要分析应用程序及其数据库的性能。当您遇到性能下降时，通常是数据库访问策略、硬件可用性和打开的数据库连接数量的函数。

由于索引策略不充分或不适当，或者架构设计模式不佳，某些用户可能会遇到性能限制。[锁定性能](https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/#std-label-analyzing-performance-locks)讨论这些如何影响 MongoDB 的内部锁定。

性能问题可能表明数据库正在满负荷运行，并且是时候向数据库添加额外的容量了。特别是，应用程序的工作集应该适合可用的物理内存。

在某些情况下，性能问题可能是暂时的并且与异常流量负载有关。正如中所讨论的[连接数](https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/#std-label-number-of-connections)，缩放可以帮助缓解过多的流量。

数据库分析可以帮助您了解哪些操作导致性能下降。

### 锁定性能

MongoDB 使用锁定系统来确保数据集的一致性。如果某些操作长时间运行或形成队列，则随着请求和操作等待锁定，性能将会下降。

与锁定相关的减速可能是间歇性的。要查看锁定是否影响了性能，请参阅输出的[锁定](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#std-label-server-status-locks) 部分和[globalLock](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#std-label-globalLock)部分 [`serverStatus`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)。

将 [`locks..timeAcquiringMicros`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.locks.-type-.timeAcquiringMicros)  除以 [`locks..acquireWaitCount`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.locks.-type-.acquireWaitCount)  可以得出特定锁模式的近似平均等待时间。

[`locks..deadlockCount`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.locks.-type-.deadlockCount)提供锁获取遇到死锁的次数。

如果 [`globalLock.currentQueue.total`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.globalLock.currentQueue.total) 一直保持较高水平，那么可能有大量的请求在等待锁定。这可能表示存在可能影响性能的并发问题。

如果  [`globalLock.totalTime`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.globalLock.totalTime) 相对于正常运行时间较高，那么数据库在锁定状态下存在的时间较长。

长时间的查询可能是由于索引的效果不佳、非最佳的模式设计、查询结构不佳、系统架构问题或内存不足导致的磁盘读取引起的。

### 连接数

在某些情况下，应用程序和数据库之间的连接数量可能会超出服务器处理请求的能力。文档中的以下字段[`serverStatus`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)可以提供见解：

- [`connections`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.connections)是以下两个字段的容器：
  - [`connections.current`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.connections.current)当前连接到数据库实例的客户端总数。
  - [`connections.available`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.connections.available)新客户端可用的未使用连接总数。

如果存在大量并发应用程序请求，数据库可能无法满足需求。如果是这种情况，请增加部署服务的容量。

对于写入量大的应用程序，部署[分片](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharding)并将一个或多个 [分片](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)添加到[分片集群](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)中，以在实例之间分配负载 。

连接数的激增也可能是应用程序或驱动程序错误的结果。所有官方支持的MongoDB驱动程序都实现了连接池，这允许客户端更有效地使用和重用连接。极高数量的连接，特别是没有相应工作负载的情况下，通常表明存在驱动程序或其他配置错误。

除非受到系统范围的限制，否则 MongoDB 支持的最大传入连接数将通过该 [`maxIncomingConnections`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.maxIncomingConnections)设置进行配置。`ulimit`在基于 Unix 的系统上，可以使用命令或编辑系统文件来修改系统范围的限制`/etc/sysctl`。 有关详细信息，请参阅[UNIX`ulimit`设置。](https://www.mongodb.com/docs/manual/reference/ulimit/#std-label-ulimit)

### 数据库分析

数据库[分析器](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/#std-label-database-profiler)收集有关针对 mongod 实例运行的操作的详细信息。探查器的输出可以帮助识别低效的查询和操作。

您可以为单个数据库或实例上的所有数据库启用和配置分析[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。探查器设置仅影响单个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例，不会在[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)或[分片集群中传播。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)

有关启用和配置探查器的信息，请参阅[数据库探查器。](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/#std-label-database-profiler)

可以使用以下分析级别：

| 等级 | 描述                                                         |
| :--- | :----------------------------------------------------------- |
| `0`  | 探查器已关闭并且不收集任何数据。这是默认的探查器级别。       |
| `1`  | 探查器收集耗时超过过滤器值`slowms`或与[过滤器匹配的操作的数据。](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#std-label-set-profiling-level-options-filter)当设置过滤器时：和`slowms`选项`sampleRate`不用于分析。探查器仅捕获与 [过滤器匹配的操作。](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#std-label-set-profiling-level-options-filter) |
| `2`  | 探查器收集所有操作的数据。                                   |

> **警告**
>
> 分析可能会降低性能，并在系统日志中暴露未加密的查询数据。在配置和启用生产部署上的分析器之前，请仔细考虑任何性能和安全方面的影响。
>
> 有关潜在性能降低的更多信息，请参阅" [Profiler Overhead](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/#std-label-database-profiling-overhead) "。

> 笔记:
>
> 当[`logLevel`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.logLevel)设置为时`0`，MongoDB 以由 确定的速率 将*慢速操作记录到诊断日志中*[`slowOpSampleRate`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate)
>
> 在较高的设置下，所有操作都会出现在诊断日志中，无论其延迟如何，但以下例外：[辅助节点](https://www.mongodb.com/docs/manual/release-notes/4.2/#std-label-slow-oplog)[`logLevel`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.logLevel)记录慢速 oplog 条目消息。辅助节点仅记录慢速 oplog 条目；增加不记录所有 oplog 条目。[`logLevel`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.logLevel)

从 MongoDB 4.2 开始，用于读/写操作的[探查器条目](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/)和[诊断日志消息（即 mongod/mongos 日志消息）包括：](https://www.mongodb.com/docs/manual/reference/log-messages/#std-label-log-message-slow-ops)

- `queryHash`帮助识别具有相同 [查询形状的慢速查询。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-query-shape)
- `planCacheKey`以便更深入地了解慢速查询的[查询计划缓存。](https://www.mongodb.com/docs/manual/core/query-plans/)

### 全时诊断数据采集

为了帮助 MongoDB 工程师分析服务器行为，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)流程 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)包括全职诊断数据捕获 (FTDC) 机制。FTDC 默认启用。由于其在调试部署中的重要性，FTDC 线程故障是致命的并会停止父进程`mongod`或`mongos`进程。

> 重要的
>
> **FTDC 隐私**
>
> FTDC 数据文件经过压缩且不可读。它们继承与 MongoDB 数据文件相同的文件访问权限。只有有权访问 FTDC 数据文件的用户才能传输 FTDC 数据。
>
> 如果没有系统所有者或运营商的明确许可和协助，MongoDB 工程师无法访问 FTDC 数据。
>
> FTDC 数据**绝不**包含以下任何信息：
>
> - 查询、查询谓词或查询结果的示例
> - 从任何最终用户集合或索引中采样的数据
> - 系统或 MongoDB 用户凭证或安全证书
>
> FTDC 数据包含某些主机信息，例如主机名、操作系统信息以及用于启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或 的 选项或设置[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)。此信息可能被某些组织或监管机构视为受保护或保密，但通常不被视为个人身份信息 (PII)。对于这些字段配置了受保护、机密或 PII 数据的集群，请在发送 FTDC 数据之前通知 MongoDB 工程师，以协调适当的安全措施。

> 笔记
>
> **Windows 上的 FTDC 用户权限**
>
> 在 Windows 上，为了收集磁盘、CPU 和内存等系统数据，FTDC 需要以下组的 Microsoft 访问权限：
>
> - 性能监视器用户
> - 性能日志用户
>
> [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)如果正在运行的用户[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)不是管理员，请将其添加到这些组中以记录 FTDC 数据。有关更多信息，请参阅[微软文档在这里](https://learn.microsoft.com/en-us/windows/win32/perfctrs/restricting-access-to-performance-extension--dlls)。

FTDC 定期收集由以下命令生成的统计信息：

- [`serverStatus`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)
- [`replSetGetStatus`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-dbcommand-dbcmd.replSetGetStatus)（[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)仅）
- [`collStats`](https://www.mongodb.com/docs/manual/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats)供[`local.oplog.rs`](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.oplog.rs)收藏（[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)仅限）
- [`connPoolStats`](https://www.mongodb.com/docs/manual/reference/command/connPoolStats/#mongodb-dbcommand-dbcmd.connPoolStats)（[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)仅）

根据主机操作系统的不同，诊断数据可能包括以下一项或多项利用率统计信息：

- CPU利用率
- 内存利用率
- 磁盘利用率与性能相关。FTDC不包括与存储容量相关的数据。
- 网络性能统计。FTDC 仅捕获元数据，不捕获或检查任何网络数据包。

> 笔记
>
> 从 MongoDB 4.4 开始，如果进程在[容器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-container)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)中运行，FTDC 会从容器而不是主机操作系统的角度报告利用率统计信息。例如，如果在配置了 RAM 限制的容器中运行，FTDC 将根据容器的 RAM 限制（而不是主机操作系统的 RAM 限制）计算内存利用率。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

FTDC 收集以下命令在文件轮换或启动时产生的统计信息：

- [`getCmdLineOpts`](https://www.mongodb.com/docs/manual/reference/command/getCmdLineOpts/#mongodb-dbcommand-dbcmd.getCmdLineOpts)
- [`buildInfo`](https://www.mongodb.com/docs/manual/reference/command/buildInfo/#mongodb-dbcommand-dbcmd.buildInfo)
- [`hostInfo`](https://www.mongodb.com/docs/manual/reference/command/hostInfo/#mongodb-dbcommand-dbcmd.hostInfo)

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)进程将 FTDC 数据文件存储在 `diagnostic.data`实例下的目录 中[`storage.dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)。所有诊断数据文件都存储在该目录下。例如，给定 a [`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath) of `/data/db`，诊断数据目录将为 `/data/db/diagnostic.data`。

[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)进程将 FTDC 数据文件存储在与日志路径设置相关的诊断目录中[`systemLog.path`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-systemLog.path)。MongoDB 截断日志路径的文件扩展名并连接`diagnostic.data`到剩余的名称。例如，如果设置[`path`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-systemLog.path)为 `/var/log/mongodb/mongos.log`，则诊断数据目录将为 `/var/log/mongodb/mongos.diagnostic.data`。

您可以在以下位置查看 FTDC 源代码 [MongoDB Github 存储库](https://github.com/mongodb/mongo/tree/master/src/mongo/db/ftdc)。这些`ftdc_system_stats_*.ccp`文件专门定义了捕获的任何特定于系统的诊断数据。

FTDC 使用以下默认值运行：

- 每1秒采集一次数据
- 最大`diagnostic.data`文件夹大小为 200MB。

这些默认值旨在为 MongoDB 工程师提供有用的数据，同时对性能或存储大小的影响最小。仅当 MongoDB 工程师出于特定诊断目的请求时，才需要修改这些值。

要禁用 FTDC，请启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用 配置文件设置`diagnosticDataCollectionEnabled: false`中的选项 ：[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter)

```
setParameter:
  diagnosticDataCollectionEnabled: false
```

在 MongoDB 工程师的支持下，禁用 FTDC 可能会增加分析或调试问题时所需的时间或资源。有关 MongoDB 支持的信息，请访问[开始使用 MongoDB 支持](https://www.mongodb.com/support/get-started?tck=docs_server)。





 参见

原文 - [Performance]( https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/ )

