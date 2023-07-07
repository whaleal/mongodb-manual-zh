# 存储引擎

[存储引擎](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-storage-engine)是数据库的组件，负责管理数据在内存和磁盘中的存储方式。MongoDB 支持多种存储引擎，因为不同的引擎对特定的工作负载表现更好。为您的用例选择合适的存储引擎会显着影响您的应用程序的性能。



## NOTE

从 4.2 版开始，MongoDB 删除了已弃用的 MMAPv1 存储引擎。

- ➤ WiredTiger 存储引擎（*默认*）

  [WiredTiger](https://www.mongodb.com/docs/manual/core/wiredtiger/)是从 MongoDB 3.2 开始的默认存储引擎。它非常适合大多数工作负载，建议用于新部署。WiredTiger 提供文档级并发模型、检查点和压缩等功能。在 MongoDB Enterprise 中，WiredTiger 还支持 [Encryption at Rest](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)。请参阅 [加密存储引擎。](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/#std-label-encrypted-storage-engine)

- ➤内存存储引擎

  [内存存储引擎](https://www.mongodb.com/docs/manual/core/inmemory/)在 MongoDB Enterprise 中可用。它不是将文档存储在磁盘上，而是将它们保留在内存中以获得更可预测的数据延迟。

←  [贮存](https://www.mongodb.com/docs/manual/storage/)[WiredTiger 存储引擎](https://www.mongodb.com/docs/manual/core/wiredtiger/) →

原文链接 -https://docs.mongodb.com/manual/core/storage-engines/

译者：陆文龙

