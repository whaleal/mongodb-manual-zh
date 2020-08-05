# Auditing

<a name="Y4jVG"></a>
# Auditing
<a name="oAXOL"></a>
# 审计
On this page

- [Enable and Configure Audit Output]启用和配置审计输出([https://docs.mongodb.com/manual/core/auditing/#enable-and-configure-audit-output](https://docs.mongodb.com/manual/core/auditing/#enable-and-configure-audit-output))
- [Audit Events and Filter]审计事件和过滤器([https://docs.mongodb.com/manual/core/auditing/#audit-events-and-filter](https://docs.mongodb.com/manual/core/auditing/#audit-events-and-filter))
- [Audit Guarantee]审计保证<br />
([https://docs.mongodb.com/manual/core/auditing/#audit-guarantee](https://docs.mongodb.com/manual/core/auditing/#audit-guarantee))

MongoDB Enterprise includes an auditing capability for mongod and mongos instances. The auditing facility allows administrators and users to track system activity for deployments with multiple users and applications.<br />MongoDB 企业版包含针对 mongod 和 mongos 实例的审计功能 。审计功能使管理员和用户可以跟踪具有多个用户和多个客户端应用的 mongodb 的运行情况。
<a name="RB2ZZ"></a>
## Enable and Configure Audit Output
<a name="Xtw83"></a>
## 启用和配置审计输出
The auditing facility can write audit events to the console, the syslog, a JSON file, or a BSON file. To enable auditing for MongoDB Enterprise, see Configure Auditing.<br />审计功能可以将审计事件写入控制台console，syslog，JSON 文件或 BSON 文件。要为 MongoDB 企业版启用审计，请参阅[配置](https://docs.mongodb.com/manual/tutorial/configure-auditing/)审计。<br />For information on the audit log messages, see System Event Audit Messages.<br />有关审核日志消息的信息，请参阅[系统事件](https://docs.mongodb.com/manual/reference/audit-message/)审计[消息](https://docs.mongodb.com/manual/reference/audit-message/)。
<a name="F7zky"></a>
## Audit Events and Filter
<a name="jGRLq"></a>
## 审计事件和过滤器
Once enabled, the auditing system can record the following operations [1]:<br />启用后，审计系统可以记录以下操作[1]:

- schema (DDL),<br />
- replica set and sharded cluster,<br />
- authentication and authorization, and<br />
- CRUD operations (requires auditAuthorizationSuccess set to true).<br />
- 模式（DDL）,<br />
- 副本集集群和分片集群，<br />
- 认证和授权，以及<br />
- CRUD操作（要求auditAuthorizationSuccess设置为true）。<br />

For details on audited actions, see Audit Event Actions, Details, and Results.<br />有关审计的操作的详细信息，请参阅审计[事件操作，详细信息和结果](https://docs.mongodb.com/manual/reference/audit-message/#audit-action-details-results)。<br />With the auditing system, you can set up filters to restrict the events captured. To set up filters, see Configure Audit Filters.<br />使用审计系统，您可以[设置过滤器](https://docs.mongodb.com/manual/tutorial/configure-audit-filters/#audit-filter)以限制捕获的事件。要设置过滤器，请参阅[“配置](https://docs.mongodb.com/manual/tutorial/configure-audit-filters/)审计[过滤器”](https://docs.mongodb.com/manual/tutorial/configure-audit-filters/)。<br />[1]	Operations in an aborted transaction still generate audit events. However, there is no audit event that indicates that the transaction aborted.<br />在一个被中止的事务中[1]中的操作任然会生成一个审计事件，但是没有一个审计事件指示事务被中止了。
<a name="WaY5r"></a>
## Audit Guarantee
<a name="YvXxL"></a>
## 审计保证
The auditing system writes every audit event [2] to an in-memory buffer of audit events. MongoDB writes this buffer to disk periodically. For events collected from any single connection, the events have a total order: if MongoDB writes one event to disk, the system guarantees that it has written all prior events for that connection to disk.<br />审计系统将每个审计事件[2](https://docs.mongodb.com/manual/core/auditing/#filter)写入审计事件的内存缓冲区中。MongoDB定期将此缓冲区写入磁盘。对于从任何单个连接收集的事件，这些事件具有总顺序：如果MongoDB将一个事件写入磁盘，系统将保证已将该连接的所有先前事件写入磁盘。<br />If an audit event entry corresponds to an operation that affects the durable state of the database, such as a modification to data, MongoDB will always write the audit event to disk before writing to the journal for that entry.<br />如果审计事件条目对应的操作影响数据库的持久状态，如修改数据的操作，则MongoDB始终会在将审计事件写入磁盘之前将事件条目写入日志<br />That is, before adding an operation to the journal, MongoDB writes all audit events on the connection that triggered the operation, up to and including the entry for the operation.<br />也就是说，在将操作添加到[日志](https://docs.mongodb.com/manual/reference/glossary/#term-journal)之前，MongoDB会在触发该操作的连接上写入所有审计事件，直到并包括该操作的条目。<br />These auditing guarantees require that MongoDB run with journaling enabled.<br />这些审计保证要求MongoDB在[journaling](https://docs.mongodb.com/manual/reference/configuration-options/#storage.journal.enabled)启用的情况下运行 。
<a name="FGtuB"></a>
## WARNING
<a name="5NuB2"></a>
## 警告
MongoDB may lose events if the server terminates before it commits the events to the audit log. The client may receive confirmation of the event before MongoDB commits to the audit log.<br />如果服务器在将事件提交到审计日志之前终止，则MongoDB可能会丢失事件。在MongoDB提交审计日志之前，客户端可能会收到事件确认。<br />For example, while auditing an aggregation operation, the server might crash after returning the result but before the audit log flushes.<br />例如，在审计聚合操作时，服务器可能在返回结果之后但在刷新审计日志之前崩溃。<br />[2]	Audit configuration can include a filter to limit events to audit.<br />[2](https://docs.mongodb.com/manual/core/auditing/#id3)审计配置可以包括一个[筛选器](https://docs.mongodb.com/manual/tutorial/configure-audit-filters/#audit-filter)，以限制要审计的事件。
<a name="z80GP"></a>
## 附录：
Configure Auditing 配置审计：[https://docs.mongodb.com/manual/tutorial/configure-auditing/](https://docs.mongodb.com/manual/tutorial/configure-auditing/)<br />Configure Audit Filters  配置审计过滤器：[https://docs.mongodb.com/manual/tutorial/configure-audit-filters/](https://docs.mongodb.com/manual/tutorial/configure-audit-filters/)<br />System Event Audit Messages 系统事件审计消息： [https://docs.mongodb.com/manual/reference/audit-message/](https://docs.mongodb.com/manual/reference/audit-message/)<br />
<br />
<br />
