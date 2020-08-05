
# MongoDB Performance[](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#mongodb-performance "Permalink to this headline")   MongoDB性能

On this page

-   [Locking Performance](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#locking-performance)  锁性能
-   [Number of Connections](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#number-of-connections)  连接数
-   [Database Profiling](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#database-profiling)  数据库性能
-   [Full Time Diagnostic Data Capture](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#full-time-diagnostic-data-capture)   全时诊断数据采集

As you develop and operate applications with MongoDB, you may need to analyze the performance of the application and its database. When you encounter degraded performance, it is often a function of database access strategies, hardware availability, and the number of open database connections.
当您开发和操作基于MongoDB的应用时，您或许需要分析应用和数据库的性能表现。应用的性能降级通常是因为数据库访问策略、硬件可用性和数据库连接数设置不正确导致的。

Some users may experience performance limitations as a result of inadequate or inappropriate indexing strategies, or as a consequence of poor schema design patterns.  [Locking Performance](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#analyzing-performance-locks)  discusses how these can impact MongoDB’s internal locking.
一些用户可能因为采用不合适的索引策略，或使用糟糕的表设计模式，而遭遇应用或数据库性能瓶颈。[锁性能章节](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#analyzing-performance-locks)  探讨这些因素如何对MongoDB内部的死锁产生影响。

Performance issues may indicate that the database is operating at capacity and that it is time to add additional capacity to the database. In particular, the application’s working set should fit in the available physical memory.
性能问题可能说明数据库正在按容量临界值执行，是时候为数据库添加额外的服务器资源。通常应用程序的工作集需与服务器可用物理内存相匹配。

In some cases performance issues may be temporary and related to abnormal traffic load. As discussed in  [Number of Connections](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#number-of-connections), scaling can help relax excessive traffic.
某些性能问题可能是暂时的，与不正常负载有关。[连接数](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#number-of-connections)章节，讨论了一些通过数量缩放释放过度负载的措施。

[Database Profiling](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#database-profiling)  can help you to understand what operations are causing degradation.
[数据库性能](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#database-profiling)章节或许可以帮助您了解什么类型的操作会造成性能降级。

## Locking Performance[](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#locking-performance "Permalink to this headline") 锁性能

MongoDB uses a locking system to ensure data set consistency. If certain operations are long-running or a queue forms, performance will degrade as requests and operations wait for the lock.
MongoDB使用一套锁机制确保数据集的一致性。如果某个操作执行时间较长或是一个队列表单，下一操作请求由于要等待当前操作释放锁而出现性能降级。

Lock-related slowdowns can be intermittent. To see if the lock has been affecting your performance, refer to the  [locks](https://docs.mongodb.com/manual/reference/command/serverStatus/#server-status-locks)  section and the  [globalLock](https://docs.mongodb.com/manual/reference/command/serverStatus/#globallock)  section of the  [`serverStatus`](https://docs.mongodb.com/manual/reference/command/serverStatus/#dbcmd.serverStatus "serverStatus")  output.
与锁相关的慢查询可能是间歇性的，确定是否由于死锁影响了应用性能，请参考[`serverStatus`](https://docs.mongodb.com/manual/reference/command/serverStatus/#dbcmd.serverStatus "serverStatus") 输出内容中的 [锁](https://docs.mongodb.com/manual/reference/command/serverStatus/#server-status-locks) 部分和 [全局锁](https://docs.mongodb.com/manual/reference/command/serverStatus/#globallock)  部分。

Dividing  `locks.timeAcquiringMicros`  by  `locks.acquireWaitCount`  can give an approximate average wait time for a particular lock mode.
`locks.timeAcquiringMicros`除以`locks.acquireWaitCount`能计算出特定锁模式的平均等待时间。

`locks.deadlockCount`  provide the number of times the lock acquisitions encountered deadlocks.
`locks.deadlockCount`获取死锁次数。

If  [`globalLock.currentQueue.total`](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.globalLock.currentQueue.total "globalLock.currentQueue.total")  is consistently high, then there is a chance that a large number of requests are waiting for a lock. This indicates a possible concurrency issue that may be affecting performance.
如果 [`globalLock.currentQueue.total`](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.globalLock.currentQueue.total "globalLock.currentQueue.total") 值持续较高，有可能有大量的请求在等待锁释放。说明可能有影响性能的并发问题。

If  [`globalLock.totalTime`](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.globalLock.totalTime "globalLock.totalTime")  is high relative to  [`uptime`](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.uptime "uptime"), the database has existed in a lock state for a significant amount of time.
如果  [`globalLock.totalTime`](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.globalLock.totalTime "globalLock.totalTime")  相对于  [`uptime`](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.uptime "uptime") 较高，说明数据库的死锁已经维持一段时间了。

Long queries can result from ineffective use of indexes; non-optimal schema design; poor query structure; system architecture issues; or insufficient RAM resulting in disk reads.
慢查询可能的原因：索引的无效使用；非最优表设计模式；糟糕的查询结构；系统架构问题；内存不足触发磁盘读取。

## Number of Connections[](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#number-of-connections "Permalink to this headline") 连接数

In some cases, the number of connections between the applications and the database can overwhelm the ability of the server to handle requests. The following fields in the  [`serverStatus`](https://docs.mongodb.com/manual/reference/command/serverStatus/#dbcmd.serverStatus "serverStatus")  document can provide insight:
某些情形下，应用和数据之间的连接数可能超出了服务器能处理的请求数，[`serverStatus`](https://docs.mongodb.com/manual/reference/command/serverStatus/#dbcmd.serverStatus "serverStatus")  json文档中的一些属性可以提供一些洞察。

-   [`connections`](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.connections "connections")  is a container for the following two fields: 
- [`connections`](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.connections "connections") 是如下两个字段的容器：
    -   [`connections.current`](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.connections.current "connections.current")  the total number of current clients connected to the database instance.[`connections.current`](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.connections.current "connections.current") 是连接到当前数据库实例的客户端连接总数。
    -   [`connections.available`](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.connections.available "connections.available")  the total number of unused connections available for new clients. [`connections.available`](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.connections.available "connections.available") 是可以给新客户端使用的剩余连接总数。

If there are numerous concurrent application requests, the database may have trouble keeping up with demand. If this is the case, then you will need to increase the capacity of your deployment.
如果有大量的并发应用请求，数据库可能无法满足需求。您可能需要对数据库进行扩容。

For read-heavy applications, increase the size of your  [replica set](https://docs.mongodb.com/manual/reference/glossary/#term-replica-set)  and distribute read operations to  [secondary](https://docs.mongodb.com/manual/reference/glossary/#term-secondary)  members.
对于“读”较频繁的应用，您需要增加  [复制集](https://docs.mongodb.com/manual/reference/glossary/#term-replica-set)  的大小并将读操作路由到  [secondary](https://docs.mongodb.com/manual/reference/glossary/#term-secondary)  节点

For write-heavy applications, deploy  [sharding](https://docs.mongodb.com/manual/reference/glossary/#term-sharding)  and add one or more  [shards](https://docs.mongodb.com/manual/reference/glossary/#term-shard)  to a  [sharded cluster](https://docs.mongodb.com/manual/reference/glossary/#term-sharded-cluster)  to distribute load among  [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod "bin.mongod")  instances.
对于“写”较频繁的应用，部署  [分片](https://docs.mongodb.com/manual/reference/glossary/#term-sharding)  并添加多个  [分片](https://docs.mongodb.com/manual/reference/glossary/#term-shard)  到  [分片集](https://docs.mongodb.com/manual/reference/glossary/#term-sharded-cluster)  分散  [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod "bin.mongod")  实例之间的负载。

Spikes in the number of connections can also be the result of application or driver errors. All of the officially supported MongoDB drivers implement connection pooling, which allows clients to use and reuse connections more efficiently. An extremely high number of connections, particularly without corresponding workload, is often indicative of a driver or other configuration error.
连接数峰值也可能是应用程序或驱动程序错误的结果。所有官方MongoDB驱动均实现了连接池，支持客户端更高效的使用和复用连接对象。高连接数却未发现相匹配的负载，可能说明驱动或者其他配置发生错误。

Unless constrained by system-wide limits, the maximum number of incoming connections supported by MongoDB is configured with the  [`maxIncomingConnections`](https://docs.mongodb.com/manual/reference/configuration-options/#net.maxIncomingConnections "net.maxIncomingConnections")  setting. On Unix-based systems, system-wide limits can be modified using the  `ulimit`  command, or by editing your system’s  `/etc/sysctl`  file. See  [UNIX ulimit Settings](https://docs.mongodb.com/manual/reference/ulimit/)  for more information.
通过设置[`maxIncomingConnections`](https://docs.mongodb.com/manual/reference/configuration-options/#net.maxIncomingConnections "net.maxIncomingConnections")  配置指定mongoDB支持的最大传入连接数，该值不可超过操作系统最大范围限制。Unix类操作系统中，系统最大范围限制可以通过  `ulimit`  命令修改，或通过编辑  `/etc/sysctl`  文件修改。更多详情参见  [UNIX ulimit 设置](https://docs.mongodb.com/manual/reference/ulimit/)  章节。

## Database Profiling[](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#database-profiling "Permalink to this headline")  数据库性能

The  [Database Profiler](https://docs.mongodb.com/manual/tutorial/manage-the-database-profiler/)  collects detailed information about operations run against a mongod instance. The profiler’s output can help to identify inefficient queries and operations.
[数据库分析器](https://docs.mongodb.com/manual/tutorial/manage-the-database-profiler/)  收集MongoDB实例上执行操作的详细信息。“分析器”的输出能帮助用户识别无效查询和操作。

You can enable and configure profiling for individual databases or for all databases on a  [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod "bin.mongod")  instance. Profiler settings affect only a single  [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod "bin.mongod")  instance and will not propagate across a  [replica set](https://docs.mongodb.com/manual/reference/glossary/#term-replica-set)  or  [sharded cluster](https://docs.mongodb.com/manual/reference/glossary/#term-sharded-cluster).
您可以给一个  [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod "bin.mongod")  实例的单个或全部数据库开启和配置数据库分析器。分析器的配置仅作用于单个  [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod "bin.mongod")  实例，并不会在[复制集](https://docs.mongodb.com/manual/reference/glossary/#term-replica-set)  或  [分片集](https://docs.mongodb.com/manual/reference/glossary/#term-sharded-cluster)  上传播。

See  [Database Profiler](https://docs.mongodb.com/manual/tutorial/manage-the-database-profiler/)  for information on enabling and configuring the profiler.
开启和配置分析器参见  [数据库分析器](https://docs.mongodb.com/manual/tutorial/manage-the-database-profiler/)  章节。

The following profiling levels are available:
以下分析级别可用：
|Level  |Description  |
|--|--|
|`0`|The profiler is off and does not collect any data. This is the default profiler level.分析器关闭且不收集数据，默认配置0。|
|`1`|The profiler collects data for operations that take longer than the value of  `slowms`.分析器对执行时间超过  `slowms`  阈值的操作进行数据收集|
|`2`|The profiler collects data for all operations.分析器对所有操作进行数据收集|

> IMPORTANT
> 重要
> 
> Profiling can impact performance and shares settings with the system
> log. Carefully consider any performance and security implications
> before configuring and enabling the profiler on a production
> deployment.
> 分析器会影响性能且与系统日志共享配置。生产环境开启或设置分析器前请认证考虑性能和安全性影响。
> 
> See  [Profiler Overhead](https://docs.mongodb.com/manual/tutorial/manage-the-database-profiler/#database-profiling-overhead)  for more information on potential performance degradation.
> 分析器可能造成的潜在性能降级参见  [分析器开销](https://docs.mongodb.com/manual/tutorial/manage-the-database-profiler/#database-profiling-overhead)  章节

> NOTE
> 注意
> 
> When  [`logLevel`](https://docs.mongodb.com/manual/reference/parameters/#param.logLevel "param.logLevel")  is set to  `0`, MongoDB records  _slow_  operations to the diagnostic log at a rate determined by  [`slowOpSampleRate`](https://docs.mongodb.com/manual/reference/configuration-options/#operationProfiling.slowOpSampleRate "operationProfiling.slowOpSampleRate"). Starting in MongoDB 4.2, the secondaries of replica sets log  [all oplog entry messages that take longer than the slow operation threshold to apply](https://docs.mongodb.com/manual/release-notes/4.2/#slow-oplog)  regardless of the sample rate.
> 当[`logLevel`](https://docs.mongodb.com/manual/reference/parameters/#param.logLevel "param.logLevel")设置成0时，MongoDB慢查询将以[`slowOpSampleRate`](https://docs.mongodb.com/manual/reference/configuration-options/#operationProfiling.slowOpSampleRate "operationProfiling.slowOpSampleRate")确定的采样速率发送到诊断日志。从MongoDB 4.2开始，复制集Secondaries节点的[所有超过慢查询阈值的oplog条目信息都将输出](https://docs.mongodb.com/manual/release-notes/4.2/#slow-oplog)  ，并不遵从这一采样速率。
> At higher  [`logLevel`](https://docs.mongodb.com/manual/reference/parameters/#param.logLevel "param.logLevel")  settings, all operations appear in the diagnostic log regardless of their latency with the following exception: the logging of  [slow oplog entry messages by the secondaries](https://docs.mongodb.com/manual/release-notes/4.2/#slow-oplog). The secondaries log only the slow oplog entries; increasing the  [`logLevel`](https://docs.mongodb.com/manual/reference/parameters/#param.logLevel "param.logLevel")  does not log all oplog entries.
> 更高级别的  [`logLevel`](https://docs.mongodb.com/manual/reference/parameters/#param.logLevel "param.logLevel")  配置下，所有操作都将显示在诊断日志中，无论其延迟时间如何，除了：[secondaries节点的慢oplog条目消息的记录](https://docs.mongodb.com/manual/release-notes/4.2/#slow-oplog)的日志。secondaries节点日志只记录慢的oplog条目；增加  [`logLevel`](https://docs.mongodb.com/manual/reference/parameters/#param.logLevel "param.logLevel")  不会记录所有oplog条目。

Starting in MongoDB 4.2, the  [profiler entries](https://docs.mongodb.com/manual/tutorial/manage-the-database-profiler/)  and the  [diagnostic log messages (i.e. mongod/mongos log messages)](https://docs.mongodb.com/manual/reference/log-messages/#log-message-slow-ops)  for read/write operations include:
从MongoDB 4.2开始，  [profiler entries(分析器实体)](https://docs.mongodb.com/manual/tutorial/manage-the-database-profiler/)  和  读/写操作的[diagnostic log messages (i.e. mongod/mongos log messages)(诊断日志消息，例如：mongod/mongos 日志消息)](https://docs.mongodb.com/manual/reference/log-messages/#log-message-slow-ops)包括：

-   `queryHash`  to help identify slow queries with the same  [query shape](https://docs.mongodb.com/manual/reference/glossary/#term-query-shape).
-  `queryHash`  帮助判别有相同  [query shape](https://docs.mongodb.com/manual/reference/glossary/#term-query-shape)  的慢查询。
-   `planCacheKey`  to provide more insight into the  [query plan cache](https://docs.mongodb.com/manual/core/query-plans/)  for slow queries.
-  `planCacheKey`  对慢查询的  [query plan cache 查询计划缓存](https://docs.mongodb.com/manual/core/query-plans/)  提供更多详情。

## Full Time Diagnostic Data Capture[](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#full-time-diagnostic-data-capture "Permalink to this headline") 诠释诊断数据采集

To facilitate analysis of the MongoDB server behavior by MongoDB Inc. engineers,  `mongod`  and  `mongos`  processes include a Full Time Diagnostic Data Collection (FTDC) mechanism. FTDC data files are compressed, are not human-readable, and inherit the same file access permissions as the MongoDB data files. Only users with access to FTDC data files can transmit the FTDC data. MongoDB Inc. engineers cannot access FTDC data independent of system owners or operators. MongoDB processes run with FTDC on by default. For more information on MongoDB Support options, visit  [Getting Started With MongoDB Support](https://www.mongodb.com/support/get-started?jmp=docs).

“mongod”和“mongos”进程包括一个全时诊断数据收集（FTDC）机制，以便于MongoDB公司工程师对MongoDB服务器运行情况进行分析。FTDC数据文件是不可读压缩格式，并且继承与MongoDB数据文件相同的文件访问权限。只有能够访问FTDC数据文件的用户才能传输FTDC数据。工程师不能独立于系统所有者或运营人员访问FTDC数据。MongoDB进程默认运行FTDC。更多MongoDB支持选项请查看  [Getting Started With MongoDB Support](https://www.mongodb.com/support/get-started?jmp=docs)。

FTDC PRIVACY
FTDC隐私

FTDC data files are compressed and not human-readable. MongoDB Inc. engineers cannot access FTDC data without explicit permission and assistance from system owners or operators.
FTDC数据文件是的不可读压缩格式。MongoDB公司工程师没有系统所有者或运营者的明确许可和帮助，不能访问FTDC数据。

FTDC data  **never**  contains any of the following information:
FTDC数据  **从不**  包含如下类型信息：

-   Samples of queries, query predicates, or query results  查询、查询谓词或查询结果的示例
-   Data sampled from any end-user collection or index  从任何最终用户集合或索引中采样的数据
-   System or MongoDB user credentials or security certificates  系统或MongoDB用户凭据或安全证书

FTDC data contains certain host machine information such as hostnames, operating system information, and the options or settings used to start the  [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod "bin.mongod")  or  [`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos "bin.mongos"). This information may be considered protected or confidential by some organizations or regulatory bodies, but is not typically considered to be Personally Identifiable Information (PII). For clusters where these fields were configured with protected, confidential, or PII data, please notify MongoDB Inc. engineers before sending the FTDC data so appropriate measures can be taken.
FTDC data包含某些主机信息，例如：主机名称，操作系统信息，和用于启动[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod "bin.mongod")  或  [`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos "bin.mongos")的配置。这些信息可能被某些组织或监管机构视为受保护或机密，但通常不被视为个人身份信息（PII）。对于这些字段配置了受保护、机密或PII数据的集群，请在发送FTDC数据之前通知MongoDB公司工程师，以便采取适当的措施。

FTDC periodically collects statistics produced by the following commands:
FTDC定期收集由以下命令生成的统计信息：

-   [`serverStatus`](https://docs.mongodb.com/manual/reference/command/serverStatus/#dbcmd.serverStatus "serverStatus")
-   [`replSetGetStatus`](https://docs.mongodb.com/manual/reference/command/replSetGetStatus/#dbcmd.replSetGetStatus "replSetGetStatus")  ([`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod "bin.mongod")  only)  (仅mongod)
-   [`collStats`](https://docs.mongodb.com/manual/reference/command/collStats/#dbcmd.collStats "collStats")  for the  [`local.oplog.rs`](https://docs.mongodb.com/manual/reference/local-database/#local.oplog.rs "local.oplog.rs")  collection ([`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod "bin.mongod")  only)   对 [`local.oplog.rs`](https://docs.mongodb.com/manual/reference/local-database/#local.oplog.rs "local.oplog.rs") 表的 [`collStats`](https://docs.mongodb.com/manual/reference/command/collStats/#dbcmd.collStats "collStats") 命令。(仅mongod)
-   [`connPoolStats`](https://docs.mongodb.com/manual/reference/command/connPoolStats/#dbcmd.connPoolStats "connPoolStats")  ([`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos "bin.mongos")  only) (仅mongos)

Depending on the host operating system, the diagnostic data may include one or more of the following statistics:
依赖于主机操作系统，诊断数据可能包括如下统计：

-   CPU utilization  CPU使用率
-   Memory utilization  内存使用率
-   Disk utilization related to performance.  FTDC does not include data related to storage capacity.  与性能相关的磁盘利用率。FTDC不包括与存储容量相关的数据。
-   Network performance statistics. FTDC only captures metadata and does not capture or inspect any network packets.  网络性能统计。FTDC只捕获元数据，不捕获或检查任何网络数据包。

FTDC collects statistics produced by the following commands on file rotation or startup:
FTDC收集在文件交换或启动时以下命令生成的统计信息

-   [`getCmdLineOpts`](https://docs.mongodb.com/manual/reference/command/getCmdLineOpts/#dbcmd.getCmdLineOpts "getCmdLineOpts")
-   [`buildInfo`](https://docs.mongodb.com/manual/reference/command/buildInfo/#dbcmd.buildInfo "buildInfo")
-   [`hostInfo`](https://docs.mongodb.com/manual/reference/command/hostInfo/#dbcmd.hostInfo "hostInfo")

[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod "bin.mongod")  processes store FTDC data files in a  `diagnostic.data`  directory under the instances  [`storage.dbPath`](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath "storage.dbPath"). All diagnostic data files are stored under this directory. For example, given a  [`dbPath`](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath "storage.dbPath")  of  `/data/db`, the diagnostic data directory would be  `/data/db/diagnostic.data`.
[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod "bin.mongod")进程将FTDC数据文件存储在mongoDB实例  [`storage.dbPath`](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath "storage.dbPath")  下的  `diagnostic.data`  目录中。所有诊断数据文件被存储在这个路径下。举例：[`dbPath`](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath "storage.dbPath")  设置成  `/data/db`  ，诊断数据路径则是  `/data/db/diagnostic.data`。

[`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos "bin.mongos")  processes store FTDC data files in a diagnostic directory relative to the  [`systemLog.path`](https://docs.mongodb.com/manual/reference/configuration-options/#systemLog.path "systemLog.path")  log path setting. MongoDB truncates the logpath’s file extension and concatenates  `diagnostic.data`  to the remaining name. For example, given a  [`path`](https://docs.mongodb.com/manual/reference/configuration-options/#systemLog.path "systemLog.path")  setting of  `/var/log/mongodb/mongos.log`, the diagnostic data directory would be  `/var/log/mongodb/mongos.diagnostic.data`.
[`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos "bin.mongos")  进程将FTDC数据文件存储在相对于  [`systemLog.path`](https://docs.mongodb.com/manual/reference/configuration-options/#systemLog.path "systemLog.path")  日志路径设置的诊断目录中。MongoDB截断日志文件扩展名，并将  `diagnostic.data`  连接到剩余的名称。举例：  [`path`](https://docs.mongodb.com/manual/reference/configuration-options/#systemLog.path "systemLog.path")  设置`/var/log/mongodb/mongos.log`，诊断数据路径为`/var/log/mongodb/mongos.diagnostic.data`。

FTDC runs with the following defaults:
FTDC默认按如下执行：

-   Data capture every 1 second  每秒进行数据采集
-   200MB maximum  `diagnostic.data`  folder size.  最大200MB“diagnostic.data”文件夹大小。

These defaults are designed to provide useful data to MongoDB Inc. engineers with minimal impact on performance or storage size. These values only require modifications if requested by MongoDB Inc. engineers for specific diagnostic purposes.
这些默认设置旨在向MongoDB公司工程师提供有用的数据，对性能或存储大小的影响最小。这些值仅在MongoDB公司工程师出于特定诊断目的需求时才需修改。

You can view the FTDC source code on the  [MongoDB Github Repository](https://github.com/mongodb/mongo/tree/master/src/mongo/db/ftdc). The  `ftdc_system_stats_*.ccp`  files specifically define any system-specific diagnostic data captured.
您能在[MongoDB Github Repository](https://github.com/mongodb/mongo/tree/master/src/mongo/db/ftdc)查看FTDC源代码。`ftdc_system_stats_*.ccp`  文件具体定义捕获的任何特定于系统的诊断数据。

To disable FTDC, start up the  [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod "bin.mongod")  or  [`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos "bin.mongos")  with the  `diagnosticDataCollectionEnabled:  false`  option specified to the  [`setParameter`](https://docs.mongodb.com/manual/reference/privilege-actions/#setParameter "setParameter")  setting in your configuration file:
以  `diagnosticDataCollectionEnabled:  false`  启动[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod "bin.mongod")  或  [`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos "bin.mongos")，或者在配置文件   [`setParameter`](https://docs.mongodb.com/manual/reference/privilege-actions/#setParameter "setParameter")  中设置该选项，可关闭FTDC。

    setParameter:
      diagnosticDataCollectionEnabled: false

Disabling FTDC may increase the time or resources required when analyzing or debugging issues with support from MongoDB Inc. engineers.
关闭FTDC可能增加MongDB公司工程师分析和调试问题的时间和资源。

原文链接：https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/#mongodb-performance

译者：程哲欣