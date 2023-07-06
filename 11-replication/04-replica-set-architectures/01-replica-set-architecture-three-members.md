# 三成员副本集

获得副本集的好处所需的副本集节点的最小数量是三个节点。三节点副本集可以有三个数据承载节点（Primary-Secondary-Secondary）（*推荐*）或者如果情况（例如成本）禁止添加第三个数据承载节点，两个数据承载节点和一个仲裁者（Primary-二级仲裁器）。[[ 1 \]](https://www.mongodb.com/docs/manual/core/replica-set-architecture-three-members/#footnote-arbiter-considerations)

| [ [1](https://www.mongodb.com/docs/manual/core/replica-set-architecture-three-members/#ref-arbiter-considerations-id1) ] | 有关使用仲裁器时的注意事项，请参阅 [副本集仲裁器。](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |



## 主要有两个次要成员 (P-S-S)

具有三个存储数据的成员的副本集具有：

- [一个主节点](https://www.mongodb.com/docs/manual/core/replica-set-primary/)
- [两个从节点](https://www.mongodb.com/docs/manual/core/replica-set-secondary/)。两个从节点都可以成为[选举中的主节点。](https://www.mongodb.com/docs/manual/core/replica-set-elections/)

![由一个主节点和两个辅助节点组成的 3 成员副本集的示意图。](../../images/replica-set-architecture-three-members01.svg)

除了主节点之外，这些部署始终提供数据集的两个完整副本。这些副本集提供额外的容错和[高可用性](https://www.mongodb.com/docs/manual/core/replica-set-high-availability/#std-label-replica-set-failover)。如果主节点不可用，副本集会选择一个辅助节点作为主节点并继续正常操作。旧的主节点在可用时重新加入该集合。

![新初选选举图。 在具有两个辅助副本的三成员副本集中，主副本变得不可访问。 主节点丢失会触发选举，其中一个从节点成为新的主节点](../../images/replica-set-architecture-three-members02.svg)

点击放大



## 主节点与从节点和仲裁节点 (P-S-A)



## 笔记

有关使用仲裁器时的注意事项，请参阅 [副本集仲裁器。](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/)

具有两个存储数据的成员的三成员副本集具有：

- [一个主节点](https://www.mongodb.com/docs/manual/core/replica-set-primary/)
- 一个从节点。[从节点 可以在选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/)中成为主节点。
- 一个[仲裁节点](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/)。仲裁者只在选举中投票。

![由主节点、辅助节点和仲裁节点组成的副本集示意图。](../../images/replica-set-architecture-three-members03.svg)

由于仲裁节点不保存数据副本，因此这些部署仅提供一份完整的数据副本。仲裁节点需要更少的资源，但代价是更有限的冗余和容错。

但是，具有主节点、从节点和仲裁节点程序的部署可确保在主节点*或*从节点不可用时副本集仍然可用。如果主节点不可用，副本集将选举 从节点作为主节点。

![新初选选举图。 在具有辅助节点和仲裁节点的三成员副本集中，主节点变得不可访问。 主节点丢失会触发次级节点成为新主节点的选举。](../../images/replica-set-architecture-three-members04.svg)



## NOTE

### 也可以看看：[部署副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/)

原文链接 - https://docs.mongodb.com/manual/core/replica-set-architecture-three-members/ 

译者：陆文龙
