# 阅读偏好`maxStalenessSeconds`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-staleness/#read-preference-maxstalenessseconds)

由于网络拥塞、低磁盘吞吐量、长时间运行的操作等原因，副本集成员可能会落后于[主](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)`maxStalenessSeconds`副本。读取首选项选项允许您为从副本读取的数据指定最大复制延迟或“过时[”](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)。当辅助节点的估计陈旧度超过 `maxStalenessSeconds`时，客户端将停止使用它进行读取操作。



## 重要的

`maxStalenessSeconds`读取首选项适用于从辅助节点读取并希望避免从在复制主节点写入方面落后太多的辅助节点读取的应用程序。例如，辅助节点可能会由于自身与主节点之间的网络中断而停止复制。在这种情况下，客户端应该停止从辅助读取，直到管理员解决中断并且辅助恢复。

要使用`maxStalenessSeconds`，部署中的所有 MongoDB 实例都必须使用 MongoDB 3.4 或更高版本。如果任何实例位于早期版本的 MongoDB 上，驱动程序或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)将引发错误。



## 笔记

从 4.2 版开始，MongoDB 引入了一种[流量控制](https://www.mongodb.com/docs/manual/replication/#std-label-replication-flow-control)机制来控制主应用其写入的速率，目的是将[`majority committed`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.optimes.lastCommittedOpTime)延迟保持在指定的最大值以下。

您可以指定`maxStalenessSeconds`以下读取首选项模式：

- [`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred)
- [`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)
- [`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred)
- [`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest)

Max staleness 与模式不兼容，[`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)仅适用于为读取操作[选择](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#std-label-replica-set-read-preference-behavior-member-selection)集合的 [次要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员时。

当使用 为读取操作选择服务器时`maxStalenessSeconds`，客户端通过比较次要的最后一次写入与主要的写入来估计每个次要的陈旧程度。然后，客户端会将读取操作定向到估计滞后小于或等于 的辅助节点 `maxStalenessSeconds`。

如果没有主要的，客户端使用具有最近写入的次要的进行比较。

默认情况下，没有最大陈旧度，客户端在选择将读取操作定向到何处时不会考虑辅助节点的滞后。

您必须指定`maxStalenessSeconds`90 秒或更长的值：指定较小的`maxStalenessSeconds`值会引发错误。客户端通过定期检查每个副本集成员的最新写入日期来估计辅助副本的陈旧性。由于这些检查并不频繁，所以陈旧性估计是粗略的。因此，客户端不能强制执行`maxStalenessSeconds`小于 90 秒的值。

←  [阅读偏好标签集列表](https://www.mongodb.com/docs/manual/core/read-preference-tags/)[对冲阅读期权](https://www.mongodb.com/docs/manual/core/read-preference-hedge-option/) →

原文链接 -  https://docs.mongodb.com/manual/core/read-preference-staleness/ 

译者：陆文龙

