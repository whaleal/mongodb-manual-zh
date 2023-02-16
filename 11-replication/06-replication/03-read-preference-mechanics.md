# 服务器选择算法

MongoDB 驱动程序使用服务器选择算法来选择要使用的副本集节点，或者当连接到多个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例时，选择[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)要使用的实例。

服务器选择在每个操作中发生一次。



## NOTE	

包含读取操作[的多文档事务](https://www.mongodb.com/docs/manual/core/transactions/)[`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)必须使用读取首选项。给定事务中的所有操作必须路由到同一节点。



## 副本集的读取首选项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#read-preference-for-replica-sets)

服务器选择每次操作发生一次，并受 [读取首选项](https://www.mongodb.com/docs/manual/core/read-preference/)和`localThresholdMS` 设置的约束，以确定节点是否有资格进行读取。为每个操作重新评估读取首选项。

| 读偏好模式                                                   | 选择过程                                                     |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)（默认） | 驱动程序选择主节点。                                         |
| [`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary) | 驱动程序收集符合条件的从节点列表。 [读取首选项中指定的maxStalenessSeconds](https://www.mongodb.com/docs/manual/core/read-preference-staleness/#std-label-replica-set-read-preference-max-staleness)和[标记集](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/)可以进一限制节点的资格。如果符合条件的节点列表不为空，则驱动程序确定哪个符合条件的节点是“最接近的”（即具有最低平均网络往返时间的节点）并通过添加平均往返时间来计算延迟窗口这个“最近”的服务器和 `localThresholdMS`. 驱动程序使用此延迟窗口将符合条件的节点列表缩减为落入此窗口内的节点。从属于延迟窗口内的符合条件的节点列表中，驱动程序随机选择一个符合条件的节点。 |
| [`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest) | 驱动程序收集符合条件的节点（主节点和从节点）的列表。[读取首选项中指定的maxStalenessSeconds](https://www.mongodb.com/docs/manual/core/read-preference-staleness/#std-label-replica-set-read-preference-max-staleness)和[标记集](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/) 可以进一步限制节点的资格。如果符合条件的节点列表不为空，则驱动程序确定哪个符合条件的节点是“最接近的”（即具有最低平均网络往返时间的节点）并通过添加平均往返时间来计算延迟窗口这个“最近”的服务器和 `localThresholdMS` [[ 1 \]](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#footnote-default-threshold)。驱动程序使用此延迟窗口将符合条件的节点列表缩减为落入此窗口内的节点。从属于延迟窗口内的符合条件的列表中，驱动程序随机选择一个符合条件的节点。 |
| [`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred) | 如果主服务器可用，驱动程序会选择主服务器。如果主节点不可用，则服务器选择遵循读取首选项的过程`secondary`来选择合格的从节点。 |
| [`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred) | 在读取首选项的服务器选择过程之后，如果符合条件的从节点列表不为空，则驱动程序会选择一个符合条件的从节点。否则，如果列表为空，则驱动程序选择主节点。 |



## 分片集群的读取首选项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#read-preference-for-sharded-clusters)



### 负载均衡[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#load-balancing)

如果连接种子列表中有多个[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例，驱动程序确定哪个[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)是“最接近的”（即具有最低平均网络往返时间的节点）并通过添加平均往返来计算延迟窗口 -这个“最近”[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例的时间和`localThresholdMS`. [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)驱动程序将在延迟窗口内的实例之间随机进行负载平衡。



### 读取首选项和碎片[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#read-preference-and-shards)

对于具有副本集分片的分片集群，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 在从分片读取时应用读取首选项。服务器选择由[读取首选项](https://www.mongodb.com/docs/manual/core/read-preference/)和[`replication.localPingThresholdMs`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.localPingThresholdMs) 设置决定。为每个操作重新评估读取首选项。

#### 对冲读取[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#hedged-reads)

从 4.4 版本开始，mongos 支持非主读偏好模式的对冲读。 也就是说，mongos 可以向另一个节点发送额外的读取（如果可用），以在使用非主读取首选项时对冲读取操作。 为对冲读取操作而发送的附加读取使用 maxTimeMSForHedgedReads 的 maxTimeMS 值。以下操作支持对冲读取：

| [`collStats`](https://www.mongodb.com/docs/manual/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats)[`count`](https://www.mongodb.com/docs/manual/reference/command/count/#mongodb-dbcommand-dbcmd.count)[`dataSize`](https://www.mongodb.com/docs/manual/reference/command/dataSize/#mongodb-dbcommand-dbcmd.dataSize)[`dbStats`](https://www.mongodb.com/docs/manual/reference/command/dbStats/#mongodb-dbcommand-dbcmd.dbStats)[`distinct`](https://www.mongodb.com/docs/manual/reference/command/distinct/#mongodb-dbcommand-dbcmd.distinct) | [`filemd5`](https://www.mongodb.com/docs/manual/reference/command/filemd5/#mongodb-dbcommand-dbcmd.filemd5)[`find`](https://www.mongodb.com/docs/manual/reference/command/find/#mongodb-dbcommand-dbcmd.find)[`listCollections`](https://www.mongodb.com/docs/manual/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections)[`listIndexes`](https://www.mongodb.com/docs/manual/reference/command/listIndexes/#mongodb-dbcommand-dbcmd.listIndexes)[`planCacheListFilters`](https://www.mongodb.com/docs/manual/reference/command/planCacheListFilters/#mongodb-dbcommand-dbcmd.planCacheListFilters) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |

要使用对冲读取：

- [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)必须启用对冲读取的支持（默认）。查看[`readHedgingMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.readHedgingMode)参数。
- [非主读取偏好](https://www.mongodb.com/docs/manual/core/read-preference/)必须启用对冲读取。

| 读偏好模式                                                   | 选择过程                                                     |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)（默认） | [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)选择主节点。 |
| [`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary) | 收集[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)符合条件的从节点列表。 [读取首选项中指定的maxStalenessSeconds](https://www.mongodb.com/docs/manual/core/read-preference-staleness/#std-label-replica-set-read-preference-max-staleness)和[标记集](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/)可以进一步限制节点的资格。如果符合条件的节点列表不为空，则 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)确定哪个符合条件的节点是“最接近的”（即具有最低平均网络往返时间的节点）并通过添加平均往返时间来计算延迟窗口这个“最近”的服务器和[`replication.localPingThresholdMs`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.localPingThresholdMs) （或[`--localThreshold`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--localThreshold) 命令行选项）。使用[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)此延迟窗口将符合条件的节点列表缩减为落入此窗口内的那些节点。从落入等待时间窗口内的符合条件的节点列表中，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)随机选择一个符合条件的节点。如果使用[对冲读取](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)则选择第二个符合条件的节点（如果可用）。 |
| [`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest) | 汇集合格节点（主节点和从节点）的[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)列表。[读取首选项中指定的maxStalenessSeconds](https://www.mongodb.com/docs/manual/core/read-preference-staleness/#std-label-replica-set-read-preference-max-staleness)和[标记集](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/)可以进一步限制节点的资格。如果符合条件的节点列表不为空，则 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)确定哪个符合条件的节点是“最接近的”（即具有最低平均网络往返时间的节点）并通过添加平均往返时间来计算延迟窗口这个“最近”的服务器和[`replication.localPingThresholdMs`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.localPingThresholdMs) （或[`--localThreshold`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--localThreshold) 命令行选项）[[ 1 \]](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#footnote-default-threshold)。使用 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)此延迟窗口将符合条件的节点列表缩减为落入此窗口内的那些节点。从落入等待时间窗口内的符合条件的节点列表中，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)随机选择一个符合条件的节点。如果使用[对冲读取](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)则选择第二个符合条件的节点（如果可用）。 |
| [`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred) | 如果主节点可用，则[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)选择主节点。如果主节点不可用或者[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)正在使用[对冲读取](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)，则服务器选择遵循读取首选项的过程 `secondary`。对于对冲读取，如果主节点可用，则[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 选择一个合格的次要（如果可用）。如果主节点不可用，则[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 选择两个符合条件的从节点（如果可用）。 |
| [`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred) | 在读取首选项的从节点服务器选择过程之后，如果符合条件的从节点列表不为空，则[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)选择一个符合条件的从节点。如果使用 [hedged reads](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)， [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)则选择另一个从节点（如果可用）。如果符合条件的从节点列表为空，或者如果[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)正在使用对冲读取并且只有一个合格的从节点可用，则[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)选择主节点。 |

| [ 1 ] | *( [1](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#ref-default-threshold-id1) , [2](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#ref-default-threshold-id1) )* 默认阈值为 15 毫秒。 |
| ----- | ------------------------------------------------------------ |
|       |                                                              |

←  [阅读偏好用例](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/)[副本集部署教程](https://www.mongodb.com/docs/manual/administration/replica-set-deployment/) →

原文链接 -  https://docs.mongodb.com/manual/core/read-preference-mechanics/ 

译者：陆文龙



