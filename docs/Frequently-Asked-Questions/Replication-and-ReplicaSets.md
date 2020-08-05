# FAQ: Replication and Replica Sets

# 常见问题：复制和副本集[¶](https://docs.mongodb.com/manual/faq/replica-sets/#faq-replication-and-replica-sets)

On this page

- [What kind of replication does MongoDB support?](https://docs.mongodb.com/manual/faq/replica-sets/#what-kind-of-replication-does-mongodb-support)
- [Does replication work over the Internet and WAN connections?](https://docs.mongodb.com/manual/faq/replica-sets/#does-replication-work-over-the-internet-and-wan-connections)
- [Can MongoDB replicate over a “noisy” connection?](https://docs.mongodb.com/manual/faq/replica-sets/#can-mongodb-replicate-over-a-noisy-connection)
- [Why use journaling if replication already provides data redundancy?](https://docs.mongodb.com/manual/faq/replica-sets/#why-use-journaling-if-replication-already-provides-data-redundancy)
- [What information do arbiters exchange with the rest of the replica set?](https://docs.mongodb.com/manual/faq/replica-sets/#what-information-do-arbiters-exchange-with-the-rest-of-the-replica-set)
- [Is it normal for replica set members to use different amounts of disk space?](https://docs.mongodb.com/manual/faq/replica-sets/#is-it-normal-for-replica-set-members-to-use-different-amounts-of-disk-space)
- [Can I rename a replica set?](https://docs.mongodb.com/manual/faq/replica-sets/#can-i-rename-a-replica-set)

在本页面

- [MongoDB支持哪种复制？](https://docs.mongodb.com/manual/faq/replica-sets/#what-kind-of-replication-does-mongodb-support)
- [复制是否可以通过Internet和WAN连接进行？](https://docs.mongodb.com/manual/faq/replica-sets/#does-replication-work-over-the-internet-and-wan-connections)
- [MongoDB可以通过“noisy”连接进行复制吗？](https://docs.mongodb.com/manual/faq/replica-sets/#can-mongodb-replicate-over-a-noisy-connection)
- [如果复制已经提供了数据冗余，为什么还要使用journaling(预写日志，WAL)功能？](https://docs.mongodb.com/manual/faq/replica-sets/#why-use-journaling-if-replication-already-provides-data-redundancy)
- [仲裁节点与副本集的其它节点交换哪些信息？](https://docs.mongodb.com/manual/faq/replica-sets/#what-information-do-arbiters-exchange-with-the-rest-of-the-replica-set)
- [副本集成员使用不同大小的磁盘空间是否正常？](https://docs.mongodb.com/manual/faq/replica-sets/#is-it-normal-for-replica-set-members-to-use-different-amounts-of-disk-space)
- [我可以重命名副本集吗？](https://docs.mongodb.com/manual/faq/replica-sets/#can-i-rename-a-replica-set)

This document answers common questions about replication in MongoDB. See also the [Replication](https://docs.mongodb.com/manual/replication/) section in the manual, which provides an [overview of replication](https://docs.mongodb.com/manual/replication/), including details on:

本文档回答了有关MongoDB中复制的常见问题。另请参见手册中的“ [复制”](https://docs.mongodb.com/manual/replication/)部分，其中[概述了复制](https://docs.mongodb.com/manual/replication/)，包括有关以下方面的详细信息：

- [Replica Set Members](https://docs.mongodb.com/manual/core/replica-set-members/)

- [Replica Set Deployment Architectures](https://docs.mongodb.com/manual/core/replica-set-architectures/)

- [Replica Set Elections](https://docs.mongodb.com/manual/core/replica-set-elections/)

- [副本集成员](https://docs.mongodb.com/manual/core/replica-set-members/)

- [副本集部署体系结构](https://docs.mongodb.com/manual/core/replica-set-architectures/)

- [副本集选举](https://docs.mongodb.com/manual/core/replica-set-elections/)

  

## What kind of replication does MongoDB support?MongoDB支持哪种复制？

MongoDB supports [replica sets](https://docs.mongodb.com/manual/replication/), which can have up to [50 nodes](https://docs.mongodb.com/manual/release-notes/3.0/#replica-sets-max-members).

MongoDB支持[副本集](https://docs.mongodb.com/manual/replication/)，[副本集](https://docs.mongodb.com/manual/replication/)最多可包含[50个节点](https://docs.mongodb.com/manual/release-notes/3.0/#replica-sets-max-members)。



## Does replication work over the Internet and WAN connections?复制是否可以通过Internet和WAN连接进行？

Yes.

For example, a deployment may maintain a [primary](https://docs.mongodb.com/manual/reference/glossary/#term-primary) and [secondary](https://docs.mongodb.com/manual/reference/glossary/#term-secondary) in an East-coast data center along with a [secondary](https://docs.mongodb.com/manual/reference/glossary/#term-secondary) member for disaster recovery in a West-coast data center.

可以。

例如，在东海岸数据中心可以部署一个[主节点](https://docs.mongodb.com/manual/reference/glossary/#term-primary)和一个[副节点](https://docs.mongodb.com/manual/reference/glossary/#term-secondary) ，以及在西海岸数据中心部署一个作为灾难恢复的[从节点](https://docs.mongodb.com/manual/reference/glossary/#term-secondary)成员。

SEE ALSO

[Deploy a Geographically Redundant Replica Set](https://docs.mongodb.com/manual/tutorial/deploy-geographically-distributed-replica-set/)

参见

[部署异地冗余的副本集](https://docs.mongodb.com/manual/tutorial/deploy-geographically-distributed-replica-set/)



## Can MongoDB replicate over a “noisy” connection?MongoDB可以通过“noisy”的连接进行复制吗？

Yes, but not without connection failures and the obvious latency.

是的，但连接失败和非常明显的延迟的情况下不行。

Members of the set will attempt to reconnect to the other members of the set in response to networking flaps. This does not require administrator intervention. However, if the network connections among the nodes in the replica set are very slow, it might not be possible for the members of the node to keep up with the replication.

集合中的成员将尝试重新连接到集合中的其他成员，以响应网络波动。这不需要管理员干预。但是，如果副本集中节点之间的网络连接非常慢，则节点成员可能无法跟上复制。

SEE ALSO

[Replica Set Elections](https://docs.mongodb.com/manual/core/replica-set-elections/)

参见

[副本集选举](https://docs.mongodb.com/manual/core/replica-set-elections/)



## Why use journaling if replication already provides data redundancy?如果复制已经提供了数据冗余，为什么还要使用journaling（预写日志，WAL）功能？

[Journaling](https://docs.mongodb.com/manual/reference/glossary/#term-journal) facilitates faster crash recovery.[Journaling](https://docs.mongodb.com/manual/reference/glossary/#term-journal)功能有助于加快崩溃恢复速度。

Journaling is particularly useful for protection against power failures, especially if your replica set resides in a single data center or power circuit.Journaling功能对于防止电源故障特别有用，尤其是当副本集位于单个数据中心或电源电路中时。

When a [replica set](https://docs.mongodb.com/manual/reference/glossary/#term-replica-set) runs with journaling, you can safely restart [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instances without additional intervention.

当[副本集](https://docs.mongodb.com/manual/reference/glossary/#term-replica-set)与Journaling一起运行时，您可以安全地重新启动 [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)实例，而无需其他干预。

NOTE

Journaling requires some resource overhead for write operations. Journaling has no effect on read performance, however.

Journaling is enabled by default on all 64-bit builds of MongoDB v2.0 and greater.

注意

Journaling记录需要一些资源开销来进行写操作。但是，Journaling对读取性能没有影响。

默认情况下，在MongoDB v2.0及更高版本的所有64位版本上都启用Journaling功能。



## What information do arbiters exchange with the rest of the replica set?

## 仲裁节点与副本集的其余节点交换哪些信息？

Arbiters never receive the contents of a collection but do exchange the following data with the rest of the replica set:

- Credentials used to authenticate the arbiter with the replica set. These exchanges are encrypted.
- Replica set configuration data and voting data. This information is not encrypted. Only credential exchanges are encrypted.

仲裁节点永远不会复制集合的数据内容，但会与副本集的其余节点交换以下数据：

- 用于副本集认证仲裁节点的凭据。这些交换数据是加密的。
- 副本集配置数据和投票数据。此信息未加密。仅加密交换凭证。

If your MongoDB deployment uses TLS/SSL, then all communications between arbiters and the other members of the replica set are secure.

如果您的MongoDB部署使用TLS / SSL，则仲裁节点与副本集其他成员之间的所有通信都是安全的。

See the documentation for [Configure mongod and mongos for TLS/SSL](https://docs.mongodb.com/manual/tutorial/configure-ssl/) for more information. As with all MongoDB components, run arbiters on secure networks.

有关更多信息，请参阅有关[为TLS / SSL配置mongod和mongos](https://docs.mongodb.com/manual/tutorial/configure-ssl/)的文档。与所有MongoDB组件一样，应该在安全网络上运行仲裁节点。

SEE

The overview of [Arbiter Members of Replica Sets](https://docs.mongodb.com/manual/core/replica-set-members/#replica-set-arbiters).

参见

[副本集仲裁成员](https://docs.mongodb.com/manual/core/replica-set-members/#replica-set-arbiters)概述 。



## Is it normal for replica set members to use different amounts of disk space?

## 副本集成员使用不同大小的磁盘空间是否正常？

Yes.

Factors including: different oplog sizes, different levels of storage fragmentation, and MongoDB’s data file pre-allocation can lead to some variation in storage utilization between nodes. Storage use disparities will be most pronounced when you add members at different times.

正常。

因素包括：不同的oplog大小，不同程度的存储碎片以及MongoDB的数据文件预分配，都可能导致节点之间的存储利用率发生一些变化。当您在不同时间添加成员时，存储使用差异将最为明显。（译者注：可以理解为先后添加，因此上述存储碎片程度等差异就会比较明显，从而导致影响磁盘占用不同）。



## Can I rename a replica set?我可以重命名副本集吗？

No.

You can use the backup and restore procedure described in the [Restore a Replica Set from MongoDB Backups](https://docs.mongodb.com/manual/tutorial/restore-replica-set-from-backup/) tutorial to create a new replica set with the desired name. Downtime may be necessary in order to ensure parity between the original replica set and the new one.

不可以。

您可以使用“ [从MongoDB备份还原副本集”](https://docs.mongodb.com/manual/tutorial/restore-replica-set-from-backup/)教程中描述的备份和还原过程来创建具有所需名称的新副本集。为了确保原始副本集和新副本集之间的奇偶校验，可能需要停机。



原文链接：https://docs.mongodb.com/manual/faq/replica-sets/

译者：钟秋

update：小芒果