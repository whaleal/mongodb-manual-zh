# 副本集读写语义[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/applications/replication/#replica-set-read-and-write-semantics)

从客户端应用程序的角度来看，MongoDB 实例是作为单个服务器（即“独立”）运行还是作为 [副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)运行是透明的。但是，MongoDB 为副本集提供了额外的读写配置。

## NOTE

分片也是副本集的分片[集群在写入和读取操作方面提供相同的操作语义。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)

- [写对副本集的关注](https://www.mongodb.com/docs/manual/core/replica-set-write-concern/)

  写入关注描述了从 MongoDB 请求的写入操作的确认级别。

- [阅读偏好](https://www.mongodb.com/docs/manual/core/read-preference/)

  读取首选项指定驱动程序应将读取操作定向到何处（即副本集的哪些成员）。

- [服务器选择算法](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/)

  描述阅读偏好的机制。

←  [副本集故障转移期间的回滚](https://www.mongodb.com/docs/manual/core/replica-set-rollbacks/)[写对副本集的关注](https://www.mongodb.com/docs/manual/core/replica-set-write-concern/) →

 参见

原文 链接-https://docs.mongodb.com/manual/applications/replication/ 

译者：陆文龙

