# 分布在两个或多个数据中心的副本集

## 概述

虽然[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)提供了针对单实例故障的基本保护，但其节点都位于单个数据中心的副本集很容易受到数据中心故障的影响。停电、网络中断和自然灾害都是可能影响其节点位于单个设施中的副本集的问题。

如果其中一个数据中心不可用，则将副本集节点分布在不同地理位置的数据中心会增加冗余并提供容错能力。

## 节点分布

为了在数据中心发生故障时保护您的数据，请至少保留一个节点在备用数据中心。如果可能，使用奇数个数据节点，并选择一种节点分布，即使在数据中心丢失的情况下，剩余的副本集节点也可以占多数或至少提供数据副本的可能性最大.

### 例子

#### 三节点副本集

例如，对于一个三街店副本集，一些可能的节点分布包括：

- 两个数据中心：两个节点到数据中心1，一个节点到数据中心2。如果副本集的节点之一是仲裁者，则将仲裁者分配给数据中心1和一个承载数据的节点。
  - 如果数据中心 1 出现故障，副本集将变为只读。
  - 如果数据中心 2 出现故障，副本集仍然可写，因为数据中心 1 中的节点可以举行选举。
- 三个数据中心：一个节点到数据中心 1，一个节点到数据中心 2，一个节点到数据中心 3。
  - 如果任何数据中心出现故障，副本集仍然可写，因为其余成员可以举行选举。



## 笔记

跨两个数据中心分布副本集成员提供了优于单个数据中心的优势。在两个数据中心分布中，

- 如果其中一个数据中心出现故障，与单个数据中心分布不同，数据仍然可用于读取。
- 如果只有少数成员的数据中心宕机，副本集仍然可以提供写操作和读操作。
- 但是，如果拥有大多数成员的数据中心出现故障，副本集将变为只读。

如果可能，将成员分布在至少三个数据中心。对于配置服务器副本集 (CSRS)，最佳做法是分布在三个（或更多，取决于成员数量）中心。如果第三个数据中心的成本过高，一种分配的可能性是在两个数据中心之间平均分配数据承载成员，如果您的公司政策允许，则将剩余的成员存储在云中。

#### 五成员副本集

对于具有 5 个成员的副本集，一些可能的成员分布包括：

- 两个数据中心：数据中心 1 的三个成员和数据中心 2 的两个成员。
  - 如果数据中心 1 出现故障，副本集将变为只读。
  - 如果数据中心 2 出现故障，副本集仍然可写，因为数据中心 1 中的成员可以创建多数。
- 三个数据中心：两个成员到数据中心 1，两个成员到数据中心 2，一个成员到站点数据中心 3。
  - 如果任何数据中心出现故障，副本集仍然可写，因为其余成员可以举行选举。



## 笔记

跨两个数据中心分布副本集成员提供了优于单个数据中心的优势。在两个数据中心分布中，

- 如果其中一个数据中心出现故障，与单个数据中心分布不同，数据仍然可用于读取。
- 如果只有少数成员的数据中心宕机，副本集仍然可以提供写操作和读操作。
- 但是，如果拥有大多数成员的数据中心出现故障，副本集将变为只读。

如果可能，将成员分布在至少三个数据中心。对于配置服务器副本集 (CSRS)，最佳做法是分布在三个（或更多，取决于成员数量）中心。如果第三个数据中心的成本过高，一种分配的可能性是在两个数据中心之间平均分配数据承载成员，如果您的公司政策允许，则将剩余的成员存储在云中。

例如，以下 5 个成员的副本集将其成员分布在三个数据中心。

![分布在三个数据中心的 5 成员副本集的示意图。](../../images/replica-set-architecture-geographically-distributed01.svg)

点击放大

## 议员的可选举性

副本集的一些节点，例如具有网络限制或资源有限的节点，不应该成为[故障转移](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-failover)中的主节点。将不应成为主节点的节点配置为具有[优先级 0 。](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/#std-label-replica-set-secondary-only-members)

在某些情况下，您可能希望一个数据中心的节点在其他数据中心的节点之前被选为主节点。您可以修改节点的[`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)值，使一个数据中心节点的 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)比其他数据中心节点的更高。

在下面的例子中，Data Center 1 中的副本集节点的优先级高于 Data Center 2 和 3 中的节点；数据中心 2 中的节点比数据中心 3 中的节点具有更高的优先级：

![分布在三个数据中心的 5 成员副本集的示意图。 副本集包括优先级为 0.5 和优先级为 0 的成员。](../../imageS/replica-set-architecture-geographically-distributed.svg)

点击放大

## 连通性

验证您的网络配置是否允许所有节点之间的通信；即每个节点必须能够连接到每个其他节点。



## 提示

### 也可以看看：

- [部署地理冗余副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/)
- [部署副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/)
- [将仲裁器添加到副本集](https://www.mongodb.com/docs/manual/tutorial/add-replica-set-arbiter/)
- [将成员添加到副本集](https://www.mongodb.com/docs/manual/tutorial/expand-replica-set/)

←  [三成员副本集](https://www.mongodb.com/docs/manual/core/replica-set-architecture-three-members/)[副本集高可用性](https://www.mongodb.com/docs/manual/core/replica-set-high-availability/) →

原文链接 - https://docs.mongodb.com/manual/core/replica-set-architecture-geographically-distributed/ 

译者：陆文龙

