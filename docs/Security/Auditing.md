# Auditing[](https://docs.mongodb.com/manual/core/auditing/)
# 审计
On this page

- [Enable and Configure Audit Output]启用和配置审计输出(https://docs.mongodb.com/manual/core/auditing/#enable-and-configure-audit-output)
- [Audit Events and Filter]审计事件和过滤器(https://docs.mongodb.com/manual/core/auditing/#audit-events-and-filter)
- [Audit Guarantee]审计保证
(https://docs.mongodb.com/manual/core/auditing/#audit-guarantee)

MongoDB Enterprise includes an auditing capability for mongod and mongos instances. The auditing facility allows administrators and users to track system activity for deployments with multiple users and applications.
MongoDB 企业版包含针对 mongod 和 mongos 实例的审计功能 。审核功能使管理员和用户可以跟踪具有多个用户和多个客户端应用的 mongodb 的运行情况。


## Enable and Configure Audit Output[](https://docs.mongodb.com/manual/core/auditing/#enable-and-configure-audit-output)
## 启用和配置审计输出
The auditing facility can write audit events to the console, the syslog, a JSON file, or a BSON file. To enable auditing for MongoDB Enterprise, see Configure Auditing.
审计功能可以将审计事件写入控制台console，syslog，JSON 文件或 BSON 文件。要为 MongoDB 企业版启用审计，请参阅[配置审计](https://docs.mongodb.com/manual/tutorial/configure-auditing/)。

For information on the audit log messages, see System Event Audit Messages.
有关审计日志消息的信息，请参阅[系统事件审计消息](https://docs.mongodb.com/manual/reference/audit-message/)。

## Audit Events and Filter[](https://docs.mongodb.com/manual/core/auditing/#audit-events-and-filter)
## 审计事件和过滤器
Once enabled, the auditing system can record the following operations [1]:
启用后，审计系统可以记录以下操作[1]:

- schema (DDL),
- replica set and sharded cluster,
- authentication and authorization, and
- CRUD operations (requires auditAuthorizationSuccess set to true).

- 模式（DDL）,
- 副本集集群和分片集群，
- 认证和授权，以及
- CRUD操作（要求auditAuthorizationSuccess设置为true）。

For details on audited actions, see Audit Event Actions, Details, and Results.
有关审计的操作的详细信息，请参阅[审计事件操作，详细信息和结果](https://docs.mongodb.com/manual/reference/audit-message/#audit-action-details-results)。

With the auditing system, you can set up filters to restrict the events captured. To set up filters, see Configure Audit Filters.
使用审计系统，您可以[设置过滤器](https://docs.mongodb.com/manual/tutorial/configure-audit-filters/#audit-filter)以限制捕获的事件。要设置过滤器，请参阅[“配置审计过滤器”](https://docs.mongodb.com/manual/tutorial/configure-audit-filters/)。

[1]	Operations in an aborted transaction still generate audit events. However, there is no audit event that indicates that the transaction aborted.
在一个被中止的事务中[1]中的操作任然会生成一个审计事件，但是没有一个审计事件指示事务被中止了。

## Audit Guarantee[](https://docs.mongodb.com/manual/core/auditing/#audit-guarantee)
## 审计保证

The auditing system writes every audit event [2] to an in-memory buffer of audit events. MongoDB writes this buffer to disk periodically. For events collected from any single connection, the events have a total order: if MongoDB writes one event to disk, the system guarantees that it has written all prior events for that connection to disk.
审计系统将每个审计事件[2](https://docs.mongodb.com/manual/core/auditing/#filter)写入审计事件的内存缓冲区中。MongoDB定期将此缓冲区写入磁盘。对于从任何单个连接收集的事件，这些事件具有总顺序：如果MongoDB将一个事件写入磁盘，系统将保证已将该连接的所有先前事件写入磁盘。

If an audit event entry corresponds to an operation that affects the durable state of the database, such as a modification to data, MongoDB will always write the audit event to disk before writing to the journal for that entry.
如果审计事件条目对应的操作影响数据库的持久状态，如修改数据的操作，则MongoDB始终会在将审计事件写入磁盘之前将事件条目写入日志

That is, before adding an operation to the journal, MongoDB writes all audit events on the connection that triggered the operation, up to and including the entry for the operation.
也就是说，在将操作添加到[日志](https://docs.mongodb.com/manual/reference/glossary/#term-journal)之前，MongoDB会在触发该操作的连接上写入所有审计事件，直到并包括该操作的条目。

These auditing guarantees require that MongoDB run with journaling enabled.
这些审计保证要求MongoDB在[journaling](https://docs.mongodb.com/manual/reference/configuration-options/#storage.journal.enabled)启用的情况下运行 。

## WARNING
## 警告
MongoDB may lose events if the server terminates before it commits the events to the audit log. The client may receive confirmation of the event before MongoDB commits to the audit log.
如果服务器在将事件提交到审计日志之前终止，则MongoDB可能会丢失事件。在MongoDB提交审计日志之前，客户端可能会收到事件确认。
For example, while auditing an aggregation operation, the server might crash after returning the result but before the audit log flushes.
例如，在审计聚合操作时，服务器可能在返回结果之后但在刷新审计日志之前崩溃。

[2]	Audit configuration can include a filter to limit events to audit.
[2](https://docs.mongodb.com/manual/core/auditing/#id3)审计配置可以包括一个[筛选器](https://docs.mongodb.com/manual/tutorial/configure-audit-filters/#audit-filter)，以限制要审计的事件。

## 附录：
Configure Auditing 配置审计：[https://docs.mongodb.com/manual/tutorial/configure-auditing/](https://docs.mongodb.com/manual/tutorial/configure-auditing/)

Configure Audit Filters  配置审计过滤器：[https://docs.mongodb.com/manual/tutorial/configure-audit-filters/](https://docs.mongodb.com/manual/tutorial/configure-audit-filters/)

System Event Audit Messages 系统事件审计消息： [https://docs.mongodb.com/manual/reference/audit-message/](https://docs.mongodb.com/manual/reference/audit-message/)



原文链接：https://docs.mongodb.com/manual/core/auditing/

译者：谢伟成
