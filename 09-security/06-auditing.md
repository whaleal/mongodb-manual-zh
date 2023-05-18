# 审计

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)MongoDB Enterprise 包括针对和实例的审计功能 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)。审计工具允许管理员和用户跟踪具有多个用户和应用程序的部署的系统活动。

## 启用和配置审计输出

审计工具可以将审计事件写入控制台、 [系统日志](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-syslog)、JSON 文件或 BSON 文件。要在 MongoDB Enterprise 中启用审计，请将审计输出目标设置为 [`--auditDestination`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--auditDestination). 有关详细信息，请参阅[配置审核。](https://www.mongodb.com/docs/manual/tutorial/configure-auditing/)

有关审核日志消息的信息，请参阅[系统事件审核消息。](https://www.mongodb.com/docs/manual/reference/audit-message/)

## 审计事件和过滤器

一旦启用，审计系统可以记录以下操作 [[ 1 \]](https://www.mongodb.com/docs/manual/core/auditing/#footnote-transactions)：

- 模式（DDL），
- 副本集和分片集群，
- 身份验证和授权，以及
- CRUD 操作（需要[`auditAuthorizationSuccess`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.auditAuthorizationSuccess)设置为`true`）。

> 笔记:
>
> 从 MongoDB 5.0 开始，[辅助节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)不会记录复制更改的 DDL 审计事件。对于修改[本地数据库](https://www.mongodb.com/docs/manual/reference/local-database/#std-label-replica-set-local-database)和[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)集合的 DDL 操作，仍会记录 DDL 审计事件。

有关审核操作的详细信息，请参阅[审核事件操作、详细信息和结果。](https://www.mongodb.com/docs/manual/reference/audit-message/#std-label-audit-action-details-results)

使用审计系统，您可以[设置过滤器](https://www.mongodb.com/docs/manual/tutorial/configure-audit-filters/#std-label-audit-filter)来限制捕获的事件。要设置过滤器，请参阅[配置审核过滤器。](https://www.mongodb.com/docs/manual/tutorial/configure-audit-filters/)

中止事务中的操作仍会生成审计事件。但是，没有审计事件表明事务已中止。

## 审计保证

审计系统将每个审计事件[[ 2 \]](https://www.mongodb.com/docs/manual/core/auditing/#footnote-filter)写入审计事件的内存缓冲区。MongoDB 定期将此缓冲区写入磁盘。对于从任何单个连接收集的事件，事件有一个总顺序：如果 MongoDB 将一个事件写入磁盘，系统保证它已将该连接的所有先前事件写入磁盘。

如果审计事件条目对应于影响数据库持久状态的操作，例如对数据的修改，MongoDB 将始终在写入 该条目的[日志](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-journal)*之前*将审计事件写入磁盘。

也就是说，在向日志添加操作之前，MongoDB 会在触发该操作的连接上写入所有审计事件，直至并包括该操作的条目。

这些审计保证要求 MongoDB 在 [`journaling`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.journal.enabled)启用的情况下运行。

>警告:
>
>**如果**服务器在将事件提交到审计日志之前终止，MongoDB 可能会丢失事件。在 MongoDB 提交到审计日志之前，客户端可能会收到事件的确认。例如，在审核聚合操作时，服务器可能会在返回结果之后但在审核日志刷新之前终止。
>
>此外，如果服务器无法在 处写入审核日志 [`audit destination`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--auditDestination)，则服务器将终止。

审核配置可以包括一个[过滤器](https://www.mongodb.com/docs/manual/tutorial/configure-audit-filters/#std-label-audit-filter)来限制要审核的事件。







译者：韩鹏帅

原文：[Auditing](https://www.mongodb.com/docs/manual/core/auditing/)
