# 阅读偏好用例[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#read-preference-use-cases)

以下文档解释了各种读取首选项模式的常见用例，以及概述何时不应更改默认主读首选项的反指示。

## 阅读偏好模式[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#read-preference-modes)

| 阅读偏好模式                                                 | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary) | 默认模式。所有操作都从当前副本集 [主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)读取。包含读取操作[的多文档事务](https://www.mongodb.com/docs/manual/core/transactions/)[`主节点`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)必须使用读取首选项。给定事务中的所有操作必须路由到同一节点。 |
| [`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred) | 在大多数情况下，操作从[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)读取，但如果它不可用，则操作从[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary) 读取。从 4.4 版开始，[`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred)支持 分片集群上的[对冲读取。](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads) |
| [`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary) | [所有操作都从副本集的从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)读取。从 4.4 版开始，[`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)支持 分片集群上的[对冲读取。](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads) |
| [`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred) | 在大多数情况下，操作从[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)读取，但如果没有[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)可用，则操作从分片集群上的[主节点读取。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)从 4.4 版开始，[`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred)支持 分片集群上的[对冲读取。](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads) |
| [`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest) | 根据指定的延迟阈值，操作从随机合格的[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set) 节点读取，无论该节点是[primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary) 还是[secondary 。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)在计算延迟时，该操作会考虑以下因素：连接[`localThresholdMS`](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.localThresholdMS)字符串选项maxStalenessSeconds[读取](https://www.mongodb.com/docs/manual/core/read-preference-staleness/#std-label-replica-set-read-preference-max-staleness)首选项任何指定[的标签集列表](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/)从 4.4 版本开始，[`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest)支持 分片集群上的对冲[读取](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)，并默认启用对冲读取选项。 |

## 使用非主要阅读偏好的指示[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#indications-to-use-non-primary-read-preference)

以下是使用非[`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary) 读取偏好模式的常见用例：

- 运行不影响前端应用程序的系统操作。

  ## NOTE

  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)读取首选项与直接连接到单个实例无关。但是，为了在与副本集的从节点的直接连接上执行读取操作，您必须设置读取首选项，例如 [从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)

- 为地理分布的应用程序提供本地读取。

  如果您在多个数据中心拥有应用程序服务器，您可以考虑拥有一个[地理分布的副本集](https://www.mongodb.com/docs/manual/core/replica-set-architecture-geographically-distributed/#std-label-replica-set-geographical-distribution)并使用非主节点或 [`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest)读取首选项。这允许客户端从最低延迟成员读取，而不是总是从主要成员读取。

- 在故障转移期间保持可用性。

  如果[`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred)您希望应用程序在正常情况下从主节点读取，但在主节点不可用时允许从从节点读取过时数据，请使用。这在故障转移期间为您的应用程序提供了“只读模式”。



## 非主要阅读偏好的反指示[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#counter-indications-for-non-primary-read-preference)

一般来说，不要*使用*[`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)和 [`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred)来提供额外的读容量，因为：

- 副本的所有节点具有大致相等的写入流量；因此，从节点将以与主节点大致相同的速率为读取服务。

- 复制是异步的，在成功的写入操作和复制到从节点之间存在一定的延迟。从从节点读取可以返回陈旧的数据；从不同的从节点读取可能会导致非单调读取。

  *在3.6版更改*：从 MongoDB 3.6 开始，客户端可以使用[客户端会话和因果一致性保证](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)来确保单调读取。

- *如果该集合的任何*节点变得不可用，则将读取操作分发给从节点可能会损害可用性，因为该集合的其余节点将需要能够处理所有应用程序请求。

[分片](https://www.mongodb.com/docs/manual/sharding/)通过在一组机器上分配读写操作来增加读写容量，并且通常是增加容量的更好策略。

有关读取首选项的内部应用的更多信息，请参阅[服务器选择算法。](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/)



## 最大化一致性[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#maximize-consistency)

为避免*过时*的读取，请使用[`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)读取首选项和 . 如果主节点不可用，例如在选举期间或大多数副本集不可访问时，使用读取首选项的读取操作会产生错误或抛出异常。[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-) `readConcern`[`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)



在某些情况下，副本集可能暂时有两个主节点；但是，只有一个主节点能够确认具有[`"majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)写入问题的写入。

- 部分[网络分区](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-network-partition)可以将主节点（`P` 旧）隔离到具有少数节点的分区中，而分区的另一侧包含大多数节点。占多数的分区将选举一个新的主节点（`P` new），但在短时间内，旧的主节点（`P` old）可能仍会继续提供读写服务，因为它尚未检测到它只能看到少数节点在副本集中。在此期间，如果旧主节点 ( `P` old ) 仍然作为主节点对客户端可见，则从该主节点读取的数据可能会反映陈旧数据。
- 主节点（`P` 旧）可能会变得无响应，这将触发选举，并且可以选出新的主节点（`P` 新），为读取和写入服务。如果无响应的主节点（`P` 旧的）再次开始响应，则两个主节点将在短时间内可见。当`P` 旧的下台时，短暂的时期将结束。但是，在短暂的时间内，客户端可能会从旧的主`P` old中读取，这可能会提供过时的数据。

为了提高一致性，您可以禁用自动[故障转移](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-failover)；但是，禁用自动故障转移会牺牲可用性。

## 最大化可用性[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#maximize-availability)

要尽可能允许读取操作，请使用 [`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred). 当有主节点时，您将获得一致的读取[[ 1 \]](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#footnote-edge-cases-2-primaries)，但如果没有主节点，您仍然可以查询[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)。但是，在使用这种读取模式时，请考虑描述的情况 [`secondary`对比`secondaryPreferred`_](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#std-label-caveat-secondaryPreferred)

| [ [1](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#ref-edge-cases-2-primaries-id3) ] | 在[一些情况](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#std-label-edge-cases)，副本集中的两个节点可能会*暂时*认为它们是主节点，但至多，其中一个节点将能够完成带有[`{ w: "majority" }`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)写关注的写入。可以完成 [`{ w: "majority" }`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)写入的节点是当前主节点，另一个节点是尚未识别其降级的前主节点，通常是由于[网络分区](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-network-partition)。发生这种情况时，连接到前一个主节点的客户端可能会观察到过时的数据，尽管已经请求了读取偏好 [`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)，并且对前一个主节点的新写入最终将回滚。 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |

## 最小化延迟[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#minimize-latency)

要始终从低延迟节点读取，请使用[`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest). 驾驶员或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)将从最近的节点以及距离最近的节点不超过15 毫秒[[ 2 \]](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#footnote-secondary-acceptable-latency)的节点那里读取信息 。

[`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest)不*保证*一致性。如果离您的应用程序服务器最近的节点是具有复制滞后的从节点，则查询可能会返回陈旧数据。[`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest)仅反映网络距离，不反映 I/O 或 CPU 负载。

| [ [2](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#ref-secondary-acceptable-latency-id4) ] | 该阈值是可配置的。[`localPingThresholdMs`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.localPingThresholdMs)有关适当的设置，请参阅 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)或您的驱动程序文档。 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |

## 来自地理分布节点的查询[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#query-from-geographically-distributed-members)

如果副本集的节点是地理分布的，您可以创建反映实例位置的副本标签，然后配置您的应用程序以查询附近的节点。

例如，如果“east”和“west”数据中心的节点被 [标记](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/#std-label-replica-set-configuration-tag-sets) `{'dc': 'east'}`为and `{'dc': 'west'}`，则您在东部数据中心的应用程序服务器可以使用以下读取首选项从附近的节点读取：

```
db.collection.find().readPref('nearest', [ { 'dc': 'east' } ])
```



尽管[`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest)已经有利于具有低网络延迟的节点，但包含标签可以使选择更可预测。



## `secondary`对比`secondaryPreferred`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#secondary-vs-secondarypreferred)

对于特定的专用查询（例如 ETL、报告），您可以使用[`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)读取首选项模式将读取负载从主数据库转移。对于此用例，[`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)模式优于[`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred)模式，因为 [`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred)存在以下情况的风险：如果所有从节点都不可用并且您的副本集有足够的[仲裁器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-arbiter) [[ 3 \]](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#footnote-arbiter-limit)来防止主节点退出，那么主节点将接收来自主节点的所有流量客户。如果主节点无法处理此负载，查询将与写入竞争。因此，使用读取首选项[`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)来分发这些特定的专用查询而不是 [`secondaryPreferred`.](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred)

| [ [3](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#ref-arbiter-limit-id5) ] | 通常，避免在副本集中部署仲裁器，而是使用奇数个数据承载节点。如果必须部署仲裁器，请避免为每个副本集部署多个仲裁器。 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |

←  [对冲阅读期权](https://www.mongodb.com/docs/manual/core/read-preference-hedge-option/)	                [服务器选择算法](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/) →

原文链接 -  https://docs.mongodb.com/manual/core/read-preference-use-cases/ 

译者：陆文龙

