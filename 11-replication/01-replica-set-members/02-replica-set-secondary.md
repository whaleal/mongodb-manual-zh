# 副本集次要成员[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-secondary/#replica-set-secondary-members)

辅助设备维护[主](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)设备数据集的副本。为了复制数据，辅助节点在异步过程中将主节点的[oplog](https://www.mongodb.com/docs/manual/core/replica-set-oplog/)中的操作应用于自己的数据集。[[ 1 \]](https://www.mongodb.com/docs/manual/core/replica-set-secondary/#footnote-slow-oplogs)副本集可以有一个或多个辅助副本。

以下三成员副本集有两个次要成员。辅助节点复制主节点的操作日志并将操作应用于它们的数据集。

![由一个主节点和两个辅助节点组成的 3 成员副本集的示意图。](../../images/replica-set-secondary01.svg)

点击放大

虽然客户端不能向辅助成员写入数据，但客户端可以从辅助成员读取数据。有关客户端如何将读取操作定向到副本集的更多信息，请参见[读取首选项](https://www.mongodb.com/docs/manual/core/read-preference/)。

次级可以成为主要的。如果当前主节点不可用，副本集将举行[选举](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-election)以选择哪个辅助节点成为新的主节点。

在以下三成员副本集中，主副本不可用。这会触发选举，其中一个剩余的辅助节点成为新的主要节点。

![新初选选举图。 在具有两个辅助副本的三成员副本集中，主副本变得不可访问。 主节点丢失会触发选举，其中一个从节点成为新的主节点](../../images/replica-set-secondary02.svg)

点击放大

有关详细信息，请参阅 [副本集选举。](https://www.mongodb.com/docs/manual/core/replica-set-elections/)

您可以为特定目的配置次要成员。您可以将辅助配置为：

- 防止它在选举中成为主要的，这允许它驻留在辅助数据中心或充当冷备用。请参阅 [优先级 0 副本集成员。](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/)
- 防止应用程序从中读取数据，这允许它运行需要与正常流量分离的应用程序。请参阅 [隐藏的副本集成员。](https://www.mongodb.com/docs/manual/core/replica-set-hidden-member/)
- 保留一个正在运行的“历史”快照，用于从某些错误中恢复，例如无意中删除的数据库。请参阅 [延迟副本集成员。](https://www.mongodb.com/docs/manual/core/replica-set-delayed-member/)

| [ [1](https://www.mongodb.com/docs/manual/core/replica-set-secondary/#ref-slow-oplogs-id1) ] | 从 4.2 版开始，副本集的次要成员现在会[记录比慢速操作阈值应用时间更长的 oplog 条目](https://www.mongodb.com/docs/manual/core/replica-set-oplog/#std-label-slow-oplog-application)。这些缓慢的 oplog 消息：记录在 [`diagnostic log`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--logpath)记录在[`REPL`](https://www.mongodb.com/docs/manual/reference/log-messages/#mongodb-data-REPL)带有文本的组件 下`applied op: <oplog entry> took <num>ms`。不依赖于日志级别（无论是在系统级别还是组件级别）不要依赖于分析级别。可能受 影响[`slowOpSampleRate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate)，具体取决于您的 MongoDB 版本：在 MongoDB 4.2 中，这些慢速 oplog 条目不受[`slowOpSampleRate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate). 无论采样率如何，MongoDB 都会记录所有慢速 oplog 条目。在 MongoDB 4.4 及更高版本中，这些慢速 oplog 条目受[`slowOpSampleRate`.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate)探查器不会捕获慢速 oplog 条目。 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |

←  [副本集主](https://www.mongodb.com/docs/manual/core/replica-set-primary/)[优先级为 0 的副本集成员](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/) →

原文链接 -  https://docs.mongodb.com/manual/core/replica-set-secondary/ 

译者：陆文龙

