# 副本集选举[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-elections/#replica-set-elections)

[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)使用选举来确定哪个集成员将成为[主要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)成员。副本集可以触发选举以响应各种事件，例如：

- 向副本集添加一个新节点，
- [`initiating a replica set`,](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)
- [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)使用or等方法执行副本集维护[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)，以及
- [次要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员与主要成员失去连接的时间超过配置的[`timeout`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.electionTimeoutMillis)时间（默认为 10 秒）。

在下图中，主节点不可用的时间超过[`configured timeout`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.electionTimeoutMillis) 并触发[自动故障转移](https://www.mongodb.com/docs/manual/replication/#std-label-replication-auto-failover) 过程。剩下的一个从节点要求进行选举以选择一个新的主节点并自动恢复正常操作。

![新初选选举图。 在具有两个辅助副本的三成员副本集中，主副本变得不可访问。 主节点丢失会触发选举，其中一个从节点成为新的主节点](../../images/replica-set-elections01.svg)

点击放大

在选举成功完成之前，副本集无法处理写操作。[如果此类查询配置为在 secondaries 上运行，](https://www.mongodb.com/docs/manual/core/read-preference/#std-label-replica-set-read-preference)则副本集可以继续为读取查询提供服务 [。](https://www.mongodb.com/docs/manual/core/read-preference/#std-label-replica-set-read-preference)

假设 default ，集群选择新主节点之前的平均时间通常不应超过 12 秒[`replica configuration settings`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings)。这包括将主要标记为[不可用](https://www.mongodb.com/docs/manual/replication/#std-label-replication-auto-failover)以及调用并完成[选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections). [`settings.electionTimeoutMillis`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.electionTimeoutMillis)您可以通过修改复制配置选项来调整此时间段 。网络延迟等因素可能会延长完成副本集选举所需的时间，这反过来会影响您的集群在没有主节点的情况下可以运行的时间。这些因素取决于您的特定集群架构。

您的应用程序连接逻辑应包括对自动故障转移和后续选举的容忍度。MongoDB 驱动程序可以检测到主节点丢失并自动 [重试某些写操作](https://www.mongodb.com/docs/manual/core/retryable-writes/#std-label-retryable-writes)一次，提供额外的内置处理自动故障转移和选举：

兼容的驱动程序默认启用可重试写入

## 影响选举的因素和条件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-elections/#factors-and-conditions-that-affect-elections)

### 复制选举协议[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-elections/#replication-election-protocol)

复制[`protocolVersion: 1`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.protocolVersion)减少了副本集故障转移时间并加速了对多个同步主节点的检测。

您可以[`catchUpTimeoutMillis`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.catchUpTimeoutMillis)在更快的故障转移和[`w:1`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)写入保存之间确定优先级。

有关详细信息`pv1`，请参阅 [副本集协议版本。](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/)



### 心跳[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-elections/#heartbeats)

副本集成员每两秒发送一次心跳（ping）。如果心跳在 10 秒内未返回，则其他成员将违规成员标记为不可访问。

### 会员优先[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-elections/#member-priority)

在副本集具有稳定的主节点后，选举算法将“尽最大努力”尝试让具有最高 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)可用调用选举的辅助节点。成员优先级影响选举的时间和结果；具有较高优先级的二级节点比具有较低优先级的二级节点更早地召集选举，并且也更有可能获胜。但是，即使有更高优先级的辅助实例可用，也可以在短时间内将优先级较低的实例选为主要实例。副本集成员继续进行选举，直到可用的最高优先级成员成为主要成员。

优先级值为 的成员`0`不能成为主要成员并且不寻求选举。有关详细信息，请参阅 [优先级 0 副本集成员。](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/)



### 镜像读取[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-elections/#mirrored-reads)

从 4.4 版开始，MongoDB 提供[镜像读取](https://www.mongodb.com/docs/manual/replication/#std-label-mirrored-reads)，以使用最近访问的数据预热可选择的辅助成员的缓存。通过镜像读取，主节点可以镜像它接收到的[操作](https://www.mongodb.com/docs/manual/replication/#std-label-mirrored-reads-supported-operations)的子集，并将它们发送到可选择的辅助节点的子集。预热辅助缓存可以帮助在选举后更快地恢复性能。

有关详细信息，请参阅[镜像读取。](https://www.mongodb.com/docs/manual/replication/#std-label-mirrored-reads)

### 数据中心丢失[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-elections/#loss-of-a-data-center)

对于分布式副本集，数据中心的丢失可能会影响其他数据中心或数据中心中剩余成员选择主节点的能力。

如果可能，跨数据中心分布副本集成员，以最大限度地提高即使在数据中心丢失的情况下，剩余的副本集成员之一也可以成为新的主要成员的可能性。



## 提示

### 也可以看看：

[分布在两个或多个数据中心的副本集](https://www.mongodb.com/docs/manual/core/replica-set-architecture-geographically-distributed/)

### 网络分区[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-elections/#network-partition)

网络[分区](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-network-partition)可以将主节点隔离到具有少数节点的分区中。当 primary 检测到它只能看到副本集中的少数节点时，primary 会降级为 primary 并成为 secondary。独立地，分区中可以与一个[`majority`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.majorityVoteCount)节点（包括它自己）通信的成员举行选举成为新的主节点。

## 投票成员[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-elections/#voting-members)

副本集成员配置设置[`members[n\].votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes) 和成员[`state`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.members-n-.state)决定成员是否在选举中投票。

- [`members[n\].votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes) 所有在选举中设置等于 1 票的副本集成员。要排除成员在[选举](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-election)中投票，请将成员 [`members[n\].votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)配置的值更改为`0`。
  - 无投票权（即[`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)is `0`）的成员必须有 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)0 个。
  - [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)大于 0 的成员不能有 0 [`votes`。](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)
- 只有下列州的有投票权的成员才有资格投票：
  - [`PRIMARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.PRIMARY)
  - [`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)
  - [`STARTUP2`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.STARTUP2)（除非该成员是新添加到副本集的）
  - [`RECOVERING`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)
  - [`ARBITER`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.ARBITER)
  - [`ROLLBACK`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)



## 提示

### 也可以看看：

- [`replSetGetStatus.votingMembersCount`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.votingMembersCount)
- [`replSetGetStatus.writableVotingMembersCount`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.writableVotingMembersCount)



## 无投票权的成员[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-elections/#non-voting-members)

尽管无投票权的成员不在选举中投票，但这些成员持有副本集数据的副本，并且可以接受来自客户端应用程序的读取操作。

因为副本集最多可以有[50 个成员](https://www.mongodb.com/docs/manual/reference/limits/#mongodb-limit-Number-of-Members-of-a-Replica-Set)，但只有[7 个投票成员](https://www.mongodb.com/docs/manual/reference/limits/#mongodb-limit-Number-of-Voting-Members-of-a-Replica-Set)，非投票成员允许副本集有超过 7 个成员。

无投票权（即[`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)is `0`）的成员必须有 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)0 个。

例如，以下九个成员的副本集有七个有投票权的成员和两个没有投票权的成员。

![具有最多 7 个投票成员的 9 成员副本集的图表。](../../images/replica-set-elections02.svg)

点击放大

一个无投票权的成员同时拥有[`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)并且 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)等于`0`：

```
{
   "_id" : <num>,
   "host" : <hostname:port>,
   "arbiterOnly" : false,
   "buildIndexes" : true,
   "hidden" : false,
   "priority" : 0,
   "tags" : {

   },
   "secondaryDelaySecs" : NumberLong(0),
   "votes" : 0
}
```





## 重要的

不要改变**投票**数来控制哪些成员将成为主要成员。相反，修改 [`members[n\].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)选项。*仅* 在特殊情况下更改票数。例如，允许超过七个成员。

要配置非投票成员，请参阅 [配置非投票副本集成员。](https://www.mongodb.com/docs/manual/tutorial/configure-a-non-voting-replica-set-member/)

←  [副本集高可用性](https://www.mongodb.com/docs/manual/core/replica-set-high-availability/)[副本集故障转移期间的回滚](https://www.mongodb.com/docs/manual/core/replica-set-rollbacks/) →



原文链接 - https://docs.mongodb.com/manual/core/replica-set-elections/ 

译者：陆文龙

