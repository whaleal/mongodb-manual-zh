# 三成员副本集[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-architecture-three-members/#three-member-replica-sets)

获得副本集的好处所需的副本集成员的最小数量是三个成员。三成员副本集可以有三个数据承载成员（Primary-Secondary-Secondary）（*推荐*）或者如果情况（例如成本）禁止添加第三个数据承载成员，两个数据承载成员和一个仲裁者（Primary-二级仲裁器）。[[ 1 \]](https://www.mongodb.com/docs/manual/core/replica-set-architecture-three-members/#footnote-arbiter-considerations)

| [ [1](https://www.mongodb.com/docs/manual/core/replica-set-architecture-three-members/#ref-arbiter-considerations-id1) ] | 有关使用仲裁器时的注意事项，请参阅 [副本集仲裁器。](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |



## 主要有两个次要成员 (PSS)[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-architecture-three-members/#primary-with-two-secondary-members--p-s-s-)

具有三个存储数据的成员的副本集具有：

- 一[小学。](https://www.mongodb.com/docs/manual/core/replica-set-primary/)
- 两名[次要](https://www.mongodb.com/docs/manual/core/replica-set-secondary/)成员。两个次要节点都可以成为[选举中的主要节点。](https://www.mongodb.com/docs/manual/core/replica-set-elections/)

![由一个主节点和两个辅助节点组成的 3 成员副本集的示意图。](../../images/replica-set-architecture-three-members01.svg)

点击放大

除了主数据集之外，这些部署始终提供数据集的两个完整副本。这些副本集提供额外的容错和[高可用性](https://www.mongodb.com/docs/manual/core/replica-set-high-availability/#std-label-replica-set-failover)。如果主节点不可用，副本集会选择一个辅助节点作为主节点并继续正常操作。旧的主要节点在可用时重新加入该集合。

![新初选选举图。 在具有两个辅助副本的三成员副本集中，主副本变得不可访问。 主节点丢失会触发选举，其中一个从节点成为新的主节点](../../images/replica-set-architecture-three-members02.svg)

点击放大



## 主要与次要和仲裁 (PSA)[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-architecture-three-members/#primary-with-a-secondary-and-an-arbiter--psa-)



## 笔记

有关使用仲裁器时的注意事项，请参阅 [副本集仲裁器。](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/)

具有两个存储数据的成员的三成员副本集具有：

- 一[小学。](https://www.mongodb.com/docs/manual/core/replica-set-primary/)
- 一名[次要](https://www.mongodb.com/docs/manual/core/replica-set-secondary/)成员。[secondary 可以在选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/)中成为 primary [。](https://www.mongodb.com/docs/manual/core/replica-set-elections/)
- 一个[仲裁者](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/)。仲裁者只在选举中投票。

![由主节点、辅助节点和仲裁节点组成的副本集示意图。](../../images/replica-set-architecture-three-members03.svg)

点击放大

由于仲裁器不保存数据副本，因此这些部署仅提供一份完整的数据副本。仲裁器需要更少的资源，但代价是更有限的冗余和容错。

但是，具有主要、次要和仲裁程序的部署可确保在主要*或*次要不可用时副本集仍然可用。如果 primary 不可用，副本集将选举 secondary 作为 primary。

![新初选选举图。 在具有辅助节点和仲裁节点的三成员副本集中，主节点变得不可访问。 主节点丢失会触发次级节点成为新主节点的选举。](../../images/replica-set-architecture-three-members04.svg)

点击放大



## 提示

### 也可以看看：

[部署副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/)

原文链接 - https://docs.mongodb.com/manual/core/replica-set-architecture-three-members/ 

译者：陆文龙
