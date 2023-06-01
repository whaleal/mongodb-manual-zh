**分片集群组件**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-components/#sharded-cluster-components)

MongoDB[分片集群](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)由以下组件组成：

- [shard](https://www.mongodb.com/docs/manual/core/sharded-cluster-shards/)：每个分片包含分片数据的一个子集。从 MongoDB 3.6 开始，分片必须部署为[副本集。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)
- [mongos](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/)：`mongos`充当查询路由器，提供客户端应用程序和分片集群之间的接口。从 MongoDB 4.4 开始，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 可以支持[对冲读取](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)以最大限度地减少延迟。
- [配置服务器](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/)：配置服务器存储集群的元数据和配置设置。从 MongoDB 3.4 开始，配置服务器必须部署为副本集 (CSRS)。

**生产配置**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-components/#production-configuration)

在生产集群中，确保数据冗余并且您的系统具有高可用性。对于生产分片集群部署，请考虑以下事项：

- 将配置服务器部署为 3 节点[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)
- 将每个分片部署为 3 个节点的[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)
- 部署一台或多台[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)路由器

**副本集分布**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-components/#replica-set-distribution)

在可能的情况下，考虑在适合作为灾难恢复位置的站点中部署每个副本集的一个节点。

>[NOTE]
>
>跨两个数据中心分布副本集成员提供了优于单个数据中心的优势。在两个数据中心分布中，
>
>- 如果其中一个数据中心出现故障，与单个数据中心分布不同，数据仍然可用于读取。
>- 如果只有少数成员的数据中心宕机，副本集仍然可以提供写操作和读操作。
>- 但是，如果拥有大多数成员的数据中心出现故障，副本集将变为只读。
>
>如果可能，将成员分布在至少三个数据中心。对于配置服务器副本集 (CSRS)，最佳做法是分布在三个（或更多，取决于成员数量）中心。如果第三个数据中心的成本过高，一种分配的可能性是在两个数据中心之间平均分配数据承载成员，如果您的公司政策允许，则将剩余的成员存储在云中。

**碎片数量**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-components/#number-of-shards)

分片需要至少两个分片来分发分片数据。如果您计划在不久的将来启用分片，但在部署时不需要，则单分片分片集群可能很有用。

**数量`mongos`及分布**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-components/#number-of-mongos-and-distribution)

部署多个[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)路由器支持高可用性和可扩展性。对于分片级别的高可用性，一种常见的模式是将实例放置在实例已在其上运行[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)的相同硬件[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)上。另一种选择是将[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)路由器嵌入应用层基础设施。

[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)部署中可以拥有的路由器数量没有限制。但是，由于[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)路由器经常与您的配置服务器通信，请在增加路由器数量时密切监控配置服务器的性能。[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)如果您发现性能下降，限制部署中路由器的数量可能会有所帮助 。

下图显示了生产中使用的常见分片集群架构：

![显示包含多个分片和 mongos 路由器的生产级分片集群的图表。](https://www.mongodb.com/docs/manual/images/sharded-cluster-production-architecture.png)

**开发配置**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-components/#development-configuration)

对于测试和开发，您可以部署一个具有最少组件数的分片集群。这些**非生产**集群具有以下组件：

- 一个[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例。
- 单个分片[副本集。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)
- 副本集[配置服务器。](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/#std-label-sharding-config-server)

下图显示了仅用于 **开发**的分片集群架构：

![显示包含单个分片和 mongos 路由器的开发分片集群的图表。](https://www.mongodb.com/docs/manual/images/sharded-cluster-test-architecture.png)



>[WARNING]
>
>仅将测试集群架构用于测试和开发。

>[TIP]
>
>也可以看看：
>
>[部署分片集群](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/)  https://docs.mongodb.com/manual/core/sharded-cluster-components/  )。

 

原文 - https://docs.mongodb.com/manual/core/sharded-cluster-components/ 

译者：陆文龙
