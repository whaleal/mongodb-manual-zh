 Replica Set Member States

# 副本集节点状态[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-states/#replica-set-member-states)

副本集的每个节点都有一个状态。

| 数字 | 姓名                                                         | 状态说明                                                     |
| :--- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 0    | [`STARTUP`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.STARTUP) | 还不是任何集合的活跃节点。所有节点都在这种状态下启动。在[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)解析[副本集配置文档](https://www.mongodb.com/docs/manual/administration/replica-set-member-configuration/)时 [`STARTUP`.](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.STARTUP) |
| 1    | [`PRIMARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.PRIMARY) | [primary](https://www.mongodb.com/docs/manual/core/replica-set-primary/) 是集群中唯一可以接受写操作的节点。有资格投票。 |
| 2    | [`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY) | state [secondary](https://www.mongodb.com/docs/manual/core/replica-set-secondary/)节点是的作用复制数据存储。有资格投票。 |
| 3    | [`RECOVERING`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.RECOVERING) | 节点要么执行启动自检，要么从完成[回滚](https://www.mongodb.com/docs/manual/core/replica-set-rollbacks/)或 [重新同步](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/)过渡。无法从该节点读取数据。有资格投票。 |
| 5    | [`STARTUP2`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.STARTUP2) | 该节点已加入集合并正在运行初始同步。有资格投票。（笔记：从 MongoDB 5.0 开始，如果节点是新添加到副本集的，则在初始同步过程中没有投票资格，也不能被选举。） |
| 6    | [`UNKNOWN`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.UNKNOWN) | 从该集合的另一个节点看来，节点的状态尚不清楚。               |
| 7    | [`ARBITER`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.ARBITER) | [仲裁节点](https://www.mongodb.com/docs/manual/core/replica-set-members/#std-label-replica-set-arbiters)不复制数据，只为参与选举而存在。有资格投票。 |
| 8    | [`DOWN`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.DOWN) | 从该集合的另一个节点看来，该节点是不可访问的。               |
| 9    | [`ROLLBACK`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK) | 该节点正在主动执行[回滚](https://www.mongodb.com/docs/manual/core/replica-set-rollbacks/)。有资格投票。无法从该节点读取数据。从 4.2 版开始，MongoDB 会在成员进入时终止所有正在进行的用户操作[`ROLLBACK`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)状态。 |
| 10   | [`REMOVED`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.REMOVED) | 该节点曾经在副本集中，但随后被删除。                         |

## 状态[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-states/#states)

### 核心状态[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-states/#core-states)

- `PRIMARY`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.PRIMARY)

  节点在[`PRIMARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.PRIMARY)状态接受写操作。副本集一次最多有一个主节点。一个[`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)[节点在选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)后成为主节点。[`PRIMARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.PRIMARY) 有资格投票。

- `SECONDARY`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)

  节点是[`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)state复制主节点oplog并可以配置为接受读取操作。从节点可参与投票， 也有可能成为主节点在主节点不可用到时候。

- `ARBITER`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.ARBITER)

  节点在[`ARBITER`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.ARBITER)状态不复制数据或接受写操作。他们有资格投票，并且存在只是为了在选举中打破平局。副本集应该只有一个成员[`ARBITER`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.ARBITER)说明该集合是否会有偶数的投票节点，并且可能会出现平局选举。任何副本集中最多只能配置一个仲裁器。有关使用仲裁器时的注意事项，请参阅 [副本集仲裁器。](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/)

有关核心状态的更多信息，请参阅[副本集成员](https://www.mongodb.com/docs/manual/core/replica-set-members/)。

### 其他状体[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-states/#other-states)

- `STARTUP`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.STARTUP)

  副本集的每个节点启动于[`STARTUP`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.STARTUP) 状态。然后[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)加载该节点的副本集配置，并将成员的状态转换为[`STARTUP2`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.STARTUP2)或者[`ARBITER`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.ARBITER). 节点在 [`STARTUP`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.STARTUP)没有资格投票，因为他们还不是任何副本集的公认节点。

- `STARTUP2`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.STARTUP2)

  副本集的每个数据承载节点进入 [`STARTUP2`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.STARTUP2)，然后[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)完成加载该节点的配置后，此时它成为副本集的活动节点并有资格投票。然后该节点决定是否进行初始同步。如果节点开始初始同步，该节点将保留在 [`STARTUP2`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.STARTUP2)直到复制完所有数据并建立所有索引。之后，节点过渡到[`RECOVERING`.](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)，从 MongoDB 5.0 开始，如果节点是新添加到副本集的，则在初始同步过程中没有投票资格，也不能被选举。

- `RECOVERING`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)

  副本集的节点进入[`RECOVERING`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)状态还不能接受读取操作。[`RECOVERING`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)状态可以在正常操作期间出现，并不一定反映错误情况。节点在[`RECOVERING`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)状态有资格在选举中投票，但没有资格成为 [`PRIMARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.PRIMARY)。一个节点在复制足够的数据以保证客户端读取数据的一致视图之后从[`RECOVERING`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)至[`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY) 。之间的唯一区别[`RECOVERING`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.RECOVERING) 和[`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)状态是[`RECOVERING`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.RECOVERING) 禁止客户端读取和[`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)允许他们读取。 [`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)状态不保证与主节点相关的数据的陈旧性。由于过载，[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)副本可能远远落后于副本集的其他节点，以至于它可能需要与副本集的其余部分重新[同步。](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/)发生这种情况时，节点进入 [`RECOVERING`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)状态，需要人工干预。

- `ROLLBACK`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)

  每当副本集在选举中替换[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)时，旧的主节点可能包含未复制到[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary) 的文档。在这种情况下，旧的主节点会恢复这些写入。在 [回滚](https://www.mongodb.com/docs/manual/core/replica-set-rollbacks/)期间，节点将拥有 [`ROLLBACK`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)状态。节点在[`ROLLBACK`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)状态有资格在选举中投票。从 4.2 版开始，MongoDB 会在节点进入时终止所有正在进行的用户操作[`ROLLBACK`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)状态。

### 错误状态[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-states/#error-states)

处于任何错误状态的节点都不能投票。

- `UNKNOWN`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.UNKNOWN)

  从未将状态信息传递给副本集的节点在[`UNKNOWN`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.UNKNOWN)状态。

- `DOWN`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.DOWN)

  失去与副本集连接的节点被视为[`DOWN`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.DOWN)，该集合的其余节点。

- `REMOVED`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.REMOVED)

  从副本集中删除的节点进入[`REMOVED`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.REMOVED) 状态。当节点进入[`REMOVED`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.REMOVED)状态，日志将使用`replSet REMOVED`消息条目标记此事件。

| [ [1](https://www.mongodb.com/docs/manual/reference/replica-states/#ref-edge-cases-2-primaries-id1) ] | 在[某些情况](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#std-label-edge-cases)下，副本集中的两个节点可能会*暂时*认为它们是主节点，但至多，其中一个节点将能够完成具有[`{ w: "majority" }`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)写安全的写入。可以完成写入的节点 [`{ w: "majority" }`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)是当前主节点，另一个节点是尚未识别其降级的前主节点，通常是由于网络[分区](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-network-partition)。发生这种情况时，连接到前一个主节点的客户端可能会观察到过时的数据，尽管已经请求了读取偏好 [`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)，并且对前一个主节点的新写入最终将回滚。 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |

←  [数据库`local`_](https://www.mongodb.com/docs/manual/reference/local-database/)                             [分片](https://www.mongodb.com/docs/manual/sharding/) →



原文链接 -  https://docs.mongodb.com/manual/reference/replica-states/ 

译者：陆文龙

