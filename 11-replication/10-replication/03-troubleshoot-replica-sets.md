 Troubleshoot Replica Sets

# 副本集故障排除[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#troubleshoot-replica-sets)

本节介绍对[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)部署进行故障排除的常见策略 。



## 检查副本集状态[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#check-replica-set-status)

要显示副本集的当前状态和每个节点的当前状态，请[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)在 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到副本集的 [primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)的会话。显示的信息说明 [`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)，请参见[replSetGetStatus 。](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/)

>## NOTE
>
>该[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)方法是运行 [`replSetGetStatus`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-dbcommand-dbcmd.replSetGetStatus)数据库命令的包装器。



## 检查复制延迟[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#check-the-replication-lag)

复制滞后是[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)上的操作 与该操作从[oplog](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-oplog)应用到 [从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)之间的延迟。复制滞后可能是一个重大问题，并会严重影响 MongoDB[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)部署。过多的复制滞后使得“滞后”节点没有资格快速成为主节点，并增加了分布式读取操作不一致的可能性。

要检查复制滞后的当前长度：

- 在一个[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到主会话，调用该[`rs.printSecondaryReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/rs.printSecondaryReplicationInfo/#mongodb-method-rs.printSecondaryReplicationInfo)方法。

  返回`syncedTo`每个节点的值，它显示最后一个 oplog 条目写入从节点的时间，如以下示例所示：

  ```
  source: m1.example.net:27017
      syncedTo: Thu Apr 10 2014 10:27:47 GMT-0400 (EDT)
      0 secs (0 hrs) behind the primary
  source: m2.example.net:27017
      syncedTo: Thu Apr 10 2014 10:27:47 GMT-0400 (EDT)
      0 secs (0 hrs) behind the primary
  ```

  

  当主节点的不活动时间大于 members[n].secondaryDelaySecs 值时，延迟节点可能会显示为落后主节点 0 秒。

  >## NOTE
  >
  >该[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)方法是 [`replSetGetStatus`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-dbcommand-dbcmd.replSetGetStatus)数据库命令的包装器。

  

- **通过检查复制延迟**图中可用 的非零或增加的 oplog 时间值来监视复制速率[云管家](https://docs.cloudmanager.mongodb.com/reference/alerts/replication-lag/) 并在[运营经理](https://docs.opsmanager.mongodb.com/current/reference/alerts/replication-lag/).

### 复制滞后原因[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#replication-lag-causes)

复制滞后的可能原因包括：

- **网络延迟**

  检查集合节点之间的网络路由，确保没有丢包或网络路由问题。

  使用工具包括`ping`测试集合节点之间的延迟并`traceroute`公开数据包网络端点的路由。

- **磁盘吞吐量**

  如果从节点上的文件系统和磁盘设备无法像主节点一样快速地将数据刷新到磁盘，那么从节点将难以保持状态。与磁盘相关的问题在多租户系统（包括虚拟化实例）上非常普遍，如果系统通过 IP 网络访问磁盘设备（如 Amazon 的 EBS 系统就是这种情况），则可能是暂时的。

  使用系统级工具评估磁盘状态，包括 `iostat`或`vmstat`。

- **并发**

  在某些情况下，在主节点上长时间运行的操作会阻止在从节点上进行复制。为了获得最佳结果，请配置[写安全](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-w)以要求确认复制到从节点。如果复制跟不上写负载，这可以防止写操作返回。

  您还可以使用[数据库探查器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-database-profiler)查看是否存在与延迟发生率相对应的缓慢查询或长时间运行的操作。

- **适当写安全**

  如果您正在执行需要大量写入主节点的大数据摄取或批量加载操作，尤其是使用[`unacknowledged write concern`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)，则从节点将无法足够快地读取操作日志以跟上更改。

  为防止这种情况，请在每 100、1000 或其他时间间隔后请求[写入确认写入关注](https://www.mongodb.com/docs/manual/reference/write-concern/)，以便为从节点提供赶上主节点的机会。

  有关详细信息，请参阅：

  - [写关注](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-w)
  - [副本集写关注](https://www.mongodb.com/docs/manual/core/distributed-queries/#std-label-write-operations-replica-sets)
  - [操作日志大小](https://www.mongodb.com/docs/manual/core/replica-set-oplog/#std-label-replica-set-oplog-sizing)



### 流量控制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#flow-control)

从 MongoDB 4.2 开始，管理员可以限制主节点应用的写入的速率，目的是将[`majority committed`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.optimes.lastCommittedOpTime)延迟保持在可配置的最大值以下[`flowControlTargetLagSeconds`。](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.flowControlTargetLagSeconds)

默认情况下，流量控制是[`enabled`.](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.enableFlowControl)

>## NOTE
>
>为了进行流量控制，副本集/分片集群必须具有：
>
>[featureCompatibilityVersion (FCV)](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)为 `4.2`并启用read concern [`majority enabled`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.enableMajorityReadConcern)。也就是说，如果 FCV 不是 4.2 或如果read concern [`majority enabled`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.enableMajorityReadConcern)被禁用，则启用的流量控制无效。

启用流控制后，随着延迟增长接近 [`flowControlTargetLagSeconds`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.flowControlTargetLagSeconds)，在主节点上的写入必须在获取锁定以应用写入之前获得票证。通过限制每秒发出的票证数量，流量控制机制试图将延迟保持在目标之下。

如果副本集没有收到足够的负载来进行流量控制，可能会发生复制滞后，例如在无响应的 [从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)的情况下。

要查看流量控制的状态，请在[primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)上运行以下命令 ：

运行该[`rs.printSecondaryReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/rs.printSecondaryReplicationInfo/#mongodb-method-rs.printSecondaryReplicationInfo)方法以确定是否有任何节点滞后：

1. ```
   rs.printSecondaryReplicationInfo()
   ```
   



示例输出：

```
source: 192.0.2.2:27017
{
  syncedTo: 'Mon Jan 31 2022 18:58:50 GMT+0000 (Coordinated Universal Time)',
  replLag: '0 secs (0 hrs) behind the primary '
}
---
source: 192.0.2.3:27017
{
  syncedTo: 'Mon Jan 31 2022 18:58:05 GMT+0000 (Coordinated Universal Time)',
  replLag: '45 secs (0 hrs) behind the primary '
}
```

1. 运行[`serverStatus`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)命令并使用 [`flowControl.isLagged`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.flowControl.isLagged)值来判断副本集是否进行了流量控制：

   ```
   db.runCommand( { serverStatus: 1 } ).flowControl.isLagged
   ```

   示例输出：

   ```
   false
   ```

   如果流量控制没有参与，调查[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary) 以确定复制滞后的原因，例如硬件、网络或应用程序的限制。

有关流量控制统计信息的信息，请参阅：

- [`flowControl`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.flowControl)
- [`$currentOp.waitingForFlowControl`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/currentOp/#mongodb-data--currentOp.waitingForFlowControl)和[`$currentOp.flowControlStats`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/currentOp/#mongodb-data--currentOp.flowControlStats)
- [`currentOp.waitingForFlowControl`](https://www.mongodb.com/docs/manual/reference/command/currentOp/#mongodb-data-currentOp.waitingForFlowControl)和[`currentOp.flowControlStats`](https://www.mongodb.com/docs/manual/reference/command/currentOp/#mongodb-data-currentOp.flowControlStats)

## Oplog条目应用缓慢[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#slow-application-of-oplog-entries)

从 4.2 版开始（也可以从 4.0.6 开始使用），副本集的从节点现在会[记录比慢速操作阈值应用时间更长的 oplog 条目](https://www.mongodb.com/docs/manual/core/replica-set-oplog/#std-label-slow-oplog-application)。这些缓慢的 oplog 消息：

- 记录在 [`diagnostic log`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--logpath)
- 记录在[`REPL`](https://www.mongodb.com/docs/manual/reference/log-messages/#mongodb-data-REPL)带有文本的组件 下`applied op: <oplog entry> took <num>ms`。
- 不依赖于日志级别（无论是在系统级别还是组件级别）
- 不要依赖于分析级别。
- 可能受 影响[`slowOpSampleRate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate)，具体取决于您的 MongoDB 版本：
  - 在 MongoDB 4.2 及更早版本中，这些慢速 oplog 条目不受[`slowOpSampleRate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate). 无论采样率如何，MongoDB 都会记录所有慢速 oplog 条目。
  - 在 MongoDB 4.4 及更高版本中，这些慢速 oplog 条目受[`slowOpSampleRate`.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate)

探查器不会捕获慢速 oplog 条目。



## 测试所有节点之间的连接[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#test-connections-between-all-members)

[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)的所有节点都必须能够连接到该复制集的每个其他节点以支持复制。始终验证两个“方向”的连接。网络拓扑和防火墙配置会阻止正常和所需的连接，从而阻止复制。

*在3.6版中更改*：

>## WARNING
>
>在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)



MongoDB 二进制文件，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，默认绑定到 localhost。如果为二进制文件设置了[`net.ipv6`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ipv6)配置文件设置或`--ipv6`命令行选项，则二进制文件还会绑定到本地主机 IPv6 地址。默认情况下[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)绑定到 localhost 的只接受来自在同一台计算机上运行的客户端的连接。这种绑定行为包括 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)以及您的副本集或分片集群的其他节点。远程客户端无法连接到仅绑定到本地主机的二进制文件。要覆盖默认绑定并绑定到其他 IP 地址，请使用 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)配置文件设置或`--bind_ip` 命令行选项指定主机名或 IP 地址列表。

>## WARNING
>
>从 MongDB 5.0 开始，[水平分割 DNS](https://en.wikipedia.org/wiki/Split-horizon_DNS)仅配置了 IP 地址的节点无法启动验证并报告错误。看[`disableSplitHorizonIPCheck`。](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.disableSplitHorizonIPCheck)



例如，以下[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例绑定到 localhost 和`My-Example-Associated-Hostname`与 IP 地址关联的主机名`198.51.100.1`：

```
mongod --bind_ip localhost,My-Example-Associated-Hostname
```



为了连接到此实例，远程客户端必须指定主机名或其关联的 IP 地址`198.51.100.1`：

```
mongosh --host My-Example-Associated-Hostname

mongosh --host 198.51.100.1
```





考虑以下双向网络测试示例：



## 例子

给定一个副本集，其中三个节点在三个不同的主机上运行：

- `m1.example.net`
- `m2.example.net`
- `m3.example.net`

这三个都使用默认端口`27017`。

1. `m1.example.net`使用以下操作集测试与其他主机的连接`m1.example.net`：

   ```
   mongosh --host m2.example.net --port 27017
   
   mongosh --host m3.example.net --port 27017
   ```

   

2. 使用以下设置 from 的操作测试 from`m2.example.net`与其他两台主机的连接`m2.example.net`，如：

   ```
   mongosh --host m1.example.net --port 27017
   
   mongosh --host m3.example.net --port 27017
   ```

   

   您现在已经测试了 两个方向之间`m2.example.net`的连接。`m1.example.net`

3. `m3.example.net`使用从主机设置的以下操作 测试与其他两台主机的连接`m3.example.net`，如下所示：

   ```
   mongosh --host m1.example.net --port 27017
   
   mongosh --host m2.example.net --port 27017
   ```

   

如果任何方向的任何连接失败，请检查您的网络和防火墙配置并重新配置您的环境以允许这些连接。

## 重启多个从节点时出现套接字异常[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#socket-exceptions-when-rebooting-more-than-one-secondary)

当您重新启动副本集的节点时，请确保该集能够在维护期间选择一个主节点。这意味着要确保大部分集合[`members[n].votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)都可用。

当一个集群的活跃节点不能再占多数时，该集群的 [主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)就会退位并成为[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)。从 MongoDB 4.2 开始，当主节点降级时，它不再关闭所有客户端连接。在 MongoDB 4.0 及更早版本中，当主节点停止运行时，它会关闭所有客户端连接。

在集群选出新的主节点之前，客户端无法写入副本集。



## 例子

给定一个三节点副本集，其中每个节点都有一票，如果至少有两个节点可以相互连接，则该副本集可以选出一个主节点。如果您同时重新启动两个从节点，则主节点会降级并成为从节点。直到至少另一个次级变得可用，即至少一个重新启动的次级也变得可用，该集合没有主要并且不能选择新的主要。

有关投票的更多信息，请参阅[副本集选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/)。有关连接错误的相关信息，请参阅[TCP`keepalive`时间会影响 MongoDB 部署吗？.](https://www.mongodb.com/docs/manual/faq/diagnostics/#std-label-faq-keepalive)



## 检查 Oplog 的大小[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#check-the-size-of-the-oplog)

更大的[oplog](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-oplog)可以为副本集提供更大的延迟容忍度，并使副本集更具弹性。

要检查给定[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)节点的 oplog 大小，请连接到该节点[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)并运行该 [`rs.printReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/rs.printReplicationInfo/#mongodb-method-rs.printReplicationInfo)方法。

输出显示 oplog 的大小和 oplog 中包含的操作的日期范围。在以下示例中，oplog 大约为 10 MB，能够容纳大约 26 小时（94400 秒）的操作：

```
configured oplog size:   10.10546875MB
log length start to end: 94400 (26.22hrs)
oplog first event time:  Mon Mar 19 2012 13:50:38 GMT-0400 (EDT)
oplog last event time:   Wed Oct 03 2012 14:59:10 GMT-0400 (EDT)
now:                     Wed Oct 03 2012 15:00:21 GMT-0400 (EDT)
```



oplog 应该足够长以在您期望的次要停机时间内保存所有事务。[[ 1 \]](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#footnote-oplog)至少，一个 oplog 应该能够保持至少 24 小时的操作；然而，许多用户更喜欢有 72 小时甚至一周的操作时间。

有关 oplog 大小如何影响操作的更多信息，请参阅：

- [操作日志大小，](https://www.mongodb.com/docs/manual/core/replica-set-oplog/#std-label-replica-set-oplog-sizing)
- [延迟副本集节点](https://www.mongodb.com/docs/manual/core/replica-set-delayed-member/#std-label-replica-set-delayed-members)，和
- [检查复制延迟。](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#std-label-replica-set-replication-lag)

>## NOTE
>
>您通常希望所有成员的 oplog 大小相同。如果调整 oplog 的大小，请在所有成员上调整它的大小。



要更改 oplog 的大小，请参阅[更改 Oplog 的大小](https://www.mongodb.com/docs/manual/tutorial/change-oplog-size/) 教程。

| [ [1](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#ref-oplog-id2) ] | 从 MongoDB 4.0 开始，oplog 可以增长到超过其配置的大小限制以避免删除[`majority commit point`.](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.optimes.lastCommittedOpTime) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |

←  [副本集协议版本](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/)           [数据库`local`_](https://www.mongodb.com/docs/manual/reference/local-database/) →



原文链接： https://docs.mongodb.com/manual/tutorial/troubleshoot-replica-sets/

译者：陆文龙

