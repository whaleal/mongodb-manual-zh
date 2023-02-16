# 副本集协议版本

从 4.0 版开始，MongoDB 仅支持副本集协议版本 1 ( [`pv1`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.protocolVersion))。`pv1`是使用 MongoDB 3.2 或更高版本创建的所有新副本集的默认设置。

## 保存写入[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/#preservation-of-writes)

### `w:1`写[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/#w-1-writes)

使用[`pv1`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.protocolVersion)，您可以 [`catchUpTimeoutMillis`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.catchUpTimeoutMillis)在更快的故障转移和[`w:1`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)写入保存之间确定优先级。

### `w: "majority"`写[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/#w---majority--writes)

`pv1`保证保存已确认的[`w: "majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)写入。

## 可用性[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/#availability)

`pv1`在 MongoDB 3.2 或更高版本中可用，并且是使用 3.2 或更高版本创建的所有新副本集的默认设置。

## 仲裁者[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/#arbiters)

对于以下 MongoDB 版本，与具有仲裁器的副本集相比 （MongoDB 4.0+ 不再支持）`pv1`增加了回滚的可能性：[`w:1`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)`pv0`

- MongoDB 3.4.1
- MongoDB 3.4.0
- MongoDB 3.2.11 或更早版本

对于支持 的其他版本的 MongoDB `pv1`，`pv1`不会增加[`w:1`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)带有仲裁者的副本集回滚的可能性。

## 优先事项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/#priorities)

对于以下 MongoDB 版本，与具有不同设置的副本集相比 （MongoDB 4.0+ 不再支持） `pv1`增加了回滚的可能性：[`w:1`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)`pv0`[`members[n\].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)

- MongoDB 3.4.1
- MongoDB 3.4.0
- MongoDB 3.2.11 或更早版本

对于支持的其支持`pv1`的 MongoDB版本，设置`pv1`不会增加具有不同设置[`w:1`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)的副本集设置[`members[n].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)回滚的可能性。

## 否决权[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/#vetoes)

`pv1`不使用否决权。个别节点可以在特定选举中投票支持或反对候选人，但不能单独否决（中止）选举。



## 同时初选的检测[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/#detection-of-simultaneous-primaries)

在[某些情况](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#std-label-edge-cases)下，副本集中的两个节点可能会*暂时*认为它们是主节点，但至多，其中一个节点将能够完成具有[`{ w: "majority" }`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)写入关注的写入。可以完成写入的节点 [`{ w: "majority" }`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)是当前主节点，另一个节点是尚未识别其降级的前主节点，通常是由于网络[分区](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-network-partition)。发生这种情况时，连接到前一个主节点的客户端可能会观察到过时的数据，尽管已经请求了读取偏好 [`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)，并且对前一个主节点的新写入最终将回滚。

`pv1`使用[术语](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-term)的概念。这允许更快地检测同时进行的初选，并在短时间内进行多次成功的选举。

## 背靠背选举[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/#back-to-back-elections)

`pv1`做出“最大努力”尝试让具有最高[`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)可用呼叫选举的次级。这可能导致背靠背选举，因为具有更高优先级的合格成员可以召集选举。

但是，在 MongoDB 3.6+（以及 MongoDB 3.4.2+ 和 3.2.12+）中，对于`pv1`：

- 优先级选举被限制为仅当优先级较高的节点与当前主节点的距离在 10 秒内时才会发生。
- 如果仲裁者检测到与候选人同等或更高优先级的健康初选，他们将在选举中投反对票。

## 双重投票[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/#double-voting)

`pv1`防止在一名成员的选举呼吁中进行双重投票。这是通过使用[术语来实现的。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-term)



## 修改副本集协议版本[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/#modify-replica-set-protocol-version)

从 4.0 版开始，MongoDB 仅支持副本集协议版本 1 ( [`pv1`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.protocolVersion))。

但是，MongoDB 3.2 到 MongoDB 3.6 支持副本集协议版本`1`和协议版本`0`。

在将 MongoDB 3.2 的协议版本更改为 MongoDB 3.6 之前，请确保至少有一个 oplog 条目（从当前协议版本生成）已从主节点复制到所有辅从节点。要检查，在每个从节点上，检查从[`optimes.lastCommittedOpTime.t`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.optimes.lastCommittedOpTime)返回的字段 [`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)。例如，连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到每个从节点并运行：

```
rs.status().optimes.lastCommittedOpTime.t
```



- 如果当前副本集协议版本是`0`，则`t`等于`-1`。
- 如果当前副本集协议版本为`1`，`t`则大于`-1`。

一旦您确认至少一个 oplog 条目（使用当前协议版本）已复制到所有从节点，您就可以更改协议版本。

要更改副本集协议版本，[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)请使用新的 [`protocolVersion`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.protocolVersion). 例如，升级到`pv1`，连接 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到当前主节点并执行以下操作序列：

```
cfg = rs.conf();
cfg.protocolVersion=1;
rs.reconfig(cfg);
```



您可以[`catchUpTimeoutMillis`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.catchUpTimeoutMillis)在更快的故障转移和[`w:1`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)写入保存之间确定优先级。

←  [副本集配置](https://www.mongodb.com/docs/manual/reference/replica-configuration/)[副本集故障排除](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/)





原文链接： https://docs.mongodb.com/manual/reference/replica-set-protocol-versions/

译者：陆文龙
