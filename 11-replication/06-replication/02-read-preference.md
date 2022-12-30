# 阅读偏好[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference/#read-preference)

读取首选项描述了 MongoDB 客户端如何将读取操作路由到[副本集的成员。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)

![对副本集的读取操作。 默认读取首选项将读取路由到主节点。 ``nearest`` 的读取偏好将读取路由到最近的成员。](../../images/read-preference01.svg)

点击放大

默认情况下，应用程序将其读取操作定向到 [副本集中的](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)[主要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)成员（即读取首选项模式“主要”）。但是，客户端可以指定读取首选项以将读取操作发送到辅助节点。

阅读偏好包括[阅读偏好模式](https://www.mongodb.com/docs/manual/core/read-preference/#std-label-read-pref-modes-summary)以及可选的[标签集列表](https://www.mongodb.com/docs/manual/core/read-preference-tags/#std-label-replica-set-read-preference-tag-sets)、[maxStalenessSeconds](https://www.mongodb.com/docs/manual/core/read-preference-staleness/#std-label-replica-set-read-preference-max-staleness)选项和 [对冲读取](https://www.mongodb.com/docs/manual/core/read-preference-hedge-option/#std-label-read-preference-hedged-read)选项。[对冲读取](https://www.mongodb.com/docs/manual/core/read-preference-hedge-option/#std-label-read-preference-hedged-read)选项可用于 MongoDB 4.4+ 分片集群，用于使用非`primary`读取首选项的读取。



下表列出了阅读偏好模式的简要总结：



## 笔记

从 4.4 版本开始，非`primary`读取优先模式支持分片集群上的[对冲读取。](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)

| 阅读偏好模式                                                 | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary) | 默认模式。所有操作都从当前副本集 [primary读取。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)包含读取操作[的多文档事务必须使用读取首选项](https://www.mongodb.com/docs/manual/core/transactions/)[`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary). 给定事务中的所有操作必须路由到同一成员。 |
| [`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred) | 在大多数情况下，操作从[主要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)成员读取，但如果它不可用，则操作从[次要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary) 成员读取。从 4.4 版开始，[`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred)支持 分片集群上的[对冲读取。](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads) |
| [`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary) | [所有操作都从副本集的次要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员读取。从 4.4 版开始，[`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)支持 分片集群上的[对冲读取。](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads) |
| [`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred) | 在大多数情况下，操作从[次要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary) 成员读取，但如果没有[次要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员可用，则操作从分片集群上的[主要成员读取。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)从 4.4 版开始，[`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred)支持 分片集群上的[对冲读取。](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads) |
| [`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest) | 根据指定的延迟阈值，操作从随机合格的[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set) 成员读取，无论该成员是[primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary) 还是[secondary 。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)在计算延迟时，该操作会考虑以下因素：连接[`localThresholdMS`](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.localThresholdMS)字符串选项maxStalenessSeconds[读取](https://www.mongodb.com/docs/manual/core/read-preference-staleness/#std-label-replica-set-read-preference-max-staleness)首选项任何指定[的标签集列表](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/)从 4.4 版开始，[`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest)支持 分片集群上的对冲[读取](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)，并默认启用对冲读取选项。 |

有关阅读偏好模式的详细说明，请参阅 [阅读偏好模式。](https://www.mongodb.com/docs/manual/core/read-preference/#std-label-replica-set-read-preference-modes)



## 提示

### 也可以看看：

- [阅读偏好标签集列表](https://www.mongodb.com/docs/manual/core/read-preference-tags/#std-label-replica-set-read-preference-tag-sets)
- [阅读偏好`maxStalenessSeconds`](https://www.mongodb.com/docs/manual/core/read-preference-staleness/#std-label-replica-set-read-preference-max-staleness)
- [对冲读取](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)

## 行为[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference/#behavior)

- 所有阅读偏好模式除外[`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)可能会返回陈旧数据，因为[辅助](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)节点在异步过程中从主节点复制操作。 [[ 1 \]](https://www.mongodb.com/docs/manual/core/read-preference/#footnote-edge-cases-2-primaries)如果您选择使用非[`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary) 模式。
- 阅读偏好不影响数据的可见性；即客户端可以在写入结果被确认或传播到大多数副本集成员之前看到写入结果。有关详细信息，请参阅 [读取隔离、一致性和新近度。](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/)
- 阅读偏好不影响 [因果一致性](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-causal-consistency)。因果一致性会话为具有 读取关注的读取操作和具有写入关注的写入操作 提供的 [因果一致性保证](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)适用于 MongoDB 部署的所有成员。[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)[`"majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)



## 阅读偏好模式[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference/#read-preference-modes)

- `primary`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)

  所有读取操作仅使用当前副本集 [primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)。[[ 1 \]](https://www.mongodb.com/docs/manual/core/read-preference/#footnote-edge-cases-2-primaries)这是默认的阅读模式。如果主数据库不可用，读取操作会产生错误或抛出异常。这[`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)[读取首选项模式与使用标记集列表](https://www.mongodb.com/docs/manual/core/read-preference-tags/#std-label-replica-set-read-preference-tag-sets)或[maxStalenessSeconds](https://www.mongodb.com/docs/manual/core/read-preference-staleness/#std-label-replica-set-read-preference-max-staleness)的读取首选项模式不兼容。如果您指定标记集列表或一个`maxStalenessSeconds`值[`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)，驱动程序将产生一个错误。包含读取操作[的多文档事务必须使用读取首选项](https://www.mongodb.com/docs/manual/core/transactions/)[`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary). 给定事务中的所有操作必须路由到同一成员。

- `primaryPreferred`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred)

  在大多数情况下，操作从集合的[主要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)成员读取。但是，如果主要成员不可用（如[故障转移](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-failover)情况下的情况），则操作会从 满足读取首选项和标记集列表的[次要成员中读取。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)`maxStalenessSeconds`当。。。的时候[`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred)读取首选项包括一个[maxStalenessSeconds 值](https://www.mongodb.com/docs/manual/core/read-preference-staleness/#std-label-replica-set-read-preference-max-staleness)，并且没有可从中读取的主要数据，客户端通过比较次要数据的最后一次写入与次要数据与最近一次写入的数据来估计每个次要数据的陈旧程度。然后，客户端将读取操作定向到估计滞后小于或等于 的辅助节点`maxStalenessSeconds`。当读取首选项包括[标签集列表（标签集数组）](https://www.mongodb.com/docs/manual/core/read-preference-tags/#std-label-replica-set-read-preference-tag-sets)并且没有可从中读取的主要成员时，客户端会尝试查找具有匹配标签的次要成员（按顺序尝试标签集直到找到匹配项）。如果找到匹配的辅助节点，客户端会从[最近](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#std-label-replica-set-read-preference-behavior-nearest)的匹配辅助节点组中随机选择一个辅助节点。如果没有辅助节点具有匹配的标签，则读取操作会产生错误。当读取首选项包括一个`maxStalenessSeconds`值 **和**一个标签集列表时，客户端首先按陈旧性过滤，然后按指定的标签过滤。使用读取操作[`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred)模式可能会返回陈旧的数据。使用该 `maxStalenessSeconds`选项可以避免从客户端读取过时的次级数据。笔记从 4.4 版开始，[`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred)支持 分片集群上的[对冲读取。](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)

- `secondary`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)

  操作*只*从集合的[次要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员读取。如果没有辅助节点可用，则此读取操作会产生错误或异常。大多数副本集至少有一个辅助副本，但在某些情况下可能没有可用的辅助副本。例如，如果成员处于恢复状态或不可用，则具有[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)、辅助节点和 [仲裁节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-arbiter)的副本集可能没有任何辅助节点。当。。。的时候[`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)读取首选项包括一个[maxStalenessSeconds 值](https://www.mongodb.com/docs/manual/core/read-preference-staleness/#std-label-replica-set-read-preference-max-staleness)，客户端通过比较次要的最后一次写入与主要的写入来估计每个次要的陈旧程度。然后，客户端将读取操作定向到估计滞后小于或等于 的辅助节点`maxStalenessSeconds`。如果没有主要的，客户端使用具有最近写入的次要的进行比较。当读取首选项包含[标签集列表（标签集数组）](https://www.mongodb.com/docs/manual/core/read-preference-tags/#std-label-replica-set-read-preference-tag-sets)时，客户端会尝试查找具有匹配标签的次要成员（按顺序尝试标签集，直到找到匹配项）。如果找到匹配的辅助节点，客户端会从[最近](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#std-label-replica-set-read-preference-behavior-nearest)的匹配辅助节点组中随机选择一个辅助节点。如果没有辅助节点具有匹配的标签，则读取操作会产生错误。当读取首选项包括一个`maxStalenessSeconds`值 **和**一个标签集列表时，客户端首先按陈旧性过滤，然后按指定的标签过滤。使用读取操作[`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)模式可能会返回陈旧的数据。使用该 `maxStalenessSeconds`选项可以避免从客户端读取过时的次级数据。笔记从 4.4 版开始，[`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)支持 分片集群上的[对冲读取。](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)

- `secondaryPreferred`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred)

  在大多数情况下，操作从[次要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员读取，但在集合由单个 [主要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)成员（没有其他成员）组成的情况下，读取操作将使用副本集的主要成员。当。。。的时候[`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred)读取首选项包括一个[maxStalenessSeconds 值](https://www.mongodb.com/docs/manual/core/read-preference-staleness/#std-label-replica-set-read-preference-max-staleness)，客户端通过比较次要的最后一次写入与主要的写入来估计每个次要的陈旧程度。然后，客户端将读取操作定向到估计滞后小于或等于 的辅助节点`maxStalenessSeconds`。如果没有主要的，客户端使用具有最近写入的次要的进行比较。如果没有估计滞后小于或等于 的辅助节点`maxStalenessSeconds`，则客户端将读取操作定向到副本集的主节点。当读取首选项包含[标签集列表（标签集数组）](https://www.mongodb.com/docs/manual/core/read-preference-tags/#std-label-replica-set-read-preference-tag-sets)时，客户端会尝试查找具有匹配标签的次要成员（按顺序尝试标签集，直到找到匹配项）。如果找到匹配的辅助节点，客户端会从[最近](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#std-label-replica-set-read-preference-behavior-nearest)的匹配辅助节点组中随机选择一个辅助节点。如果没有辅助节点具有匹配的标签，则客户端将忽略标签并从主要节点读取。当读取首选项包括一个`maxStalenessSeconds`值 **和**一个标签集列表时，客户端首先按陈旧性过滤，然后按指定的标签过滤。使用读取操作[`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred)模式可能会返回陈旧的数据。使用该 `maxStalenessSeconds`选项可以避免从客户端读取过时的次级数据。笔记从 4.4 版开始，[`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred)支持 分片集群上的[对冲读取。](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)

- `nearest`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest)

  驱动程序从其网络延迟落在可接受的延迟窗口内的成员读取。读入[`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest)mode 在路由读取操作时不考虑成员是[主要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)成员还是 [次要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员：主要成员和次要成员被同等对待。设置此模式可最大限度地减少网络延迟对读取操作的影响，而不优先考虑当前或过时的数据。当读取首选项包含[maxStalenessSeconds 值](https://www.mongodb.com/docs/manual/core/read-preference-staleness/#std-label-replica-set-read-preference-max-staleness)时，客户端通过将次要的最后一次写入与主要的写入（如果可用）或如果没有主要的则与最近的写入进行比较来估计每个次要的陈旧程度。然后，客户端将过滤掉任何其估计滞后大于 的辅助节点，并随机将读取定向到网络延迟落在[可接受延迟窗口](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#std-label-replica-set-read-preference-behavior-nearest)`maxStalenessSeconds`内的剩余成员（主要或辅助） [。](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#std-label-replica-set-read-preference-behavior-nearest)如果你指定了一个[标签集列表](https://www.mongodb.com/docs/manual/core/read-preference-tags/#std-label-replica-set-read-preference-tag-sets)，客户端会尝试找到一个与指定的标签集列表相匹配的副本集成员，并将读取定向到[最近组中的任意成员。](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#std-label-replica-set-read-preference-behavior-nearest)当读取首选项包括一个`maxStalenessSeconds`值 **和**一个标签集列表时，客户端首先按陈旧性过滤，然后按指定的标签过滤。从剩余的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例中，客户端然后随机将读取定向到落在可接受的延迟窗口内的实例。阅读首选项[成员选择](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#std-label-replica-set-read-preference-behavior-nearest) 文档详细描述了该过程。使用读取操作[`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest)模式可能会返回陈旧的数据。使用该 `maxStalenessSeconds`选项可以避免从客户端读取过时的次级数据。笔记从 4.4 版本开始，读取首选项[`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest)，默认情况下，指定对分片集群上的读取使用[对冲读取。](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)



## 提示

### 也可以看看：

要了解特定阅读首选项设置的用例，请参阅[阅读首选项用例。](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#std-label-read-preference-use-cases)



## 配置阅读首选项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference/#configure-read-preference)

使用 MongoDB 驱动程序时，您可以使用驱动程序的读取首选项 API 指定读取首选项。见司机[API文档](https://www.mongodb.com/docs/drivers/). [您还可以在连接到副本集或分片集群](https://www.mongodb.com/docs/manual/reference/connection-string/#std-label-connections-read-preference)时设置读取首选项（对冲读取选项除外）。有关示例，请参阅 [连接字符串。](https://www.mongodb.com/docs/manual/reference/connection-string/#std-label-connections-read-preference)

对于给定的读取首选项，MongoDB 驱动程序使用相同的 [成员选择逻辑。](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#std-label-replica-set-read-preference-behavior-member-selection)

使用时[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，见 [`cursor.readPref()`](https://www.mongodb.com/docs/manual/reference/method/cursor.readPref/#mongodb-method-cursor.readPref)和[`Mongo.setReadPref()`。](https://www.mongodb.com/docs/manual/reference/method/Mongo.setReadPref/#mongodb-method-Mongo.setReadPref)

## 阅读偏好和交易[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference/#read-preference-and-transactions)

包含读取操作[的多文档事务必须使用读取首选项](https://www.mongodb.com/docs/manual/core/transactions/)[`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary). 给定事务中的所有操作必须路由到同一成员。

## 其他注意事项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference/#additional-considerations)

对于 包含或 阶段的[聚合管道](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)操作，无论读取首选项设置如何，管道都在[主要成员上运行。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)[`$out`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)[`$merge`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)

对于操作，只有不写入数据的[`mapReduce`](https://www.mongodb.com/docs/manual/reference/command/mapReduce/#mongodb-dbcommand-dbcmd.mapReduce)“内联” 操作支持读取优先级。[`mapReduce`](https://www.mongodb.com/docs/manual/reference/command/mapReduce/#mongodb-dbcommand-dbcmd.mapReduce)否则，[`mapReduce`](https://www.mongodb.com/docs/manual/reference/command/mapReduce/#mongodb-dbcommand-dbcmd.mapReduce)操作将在 [主要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)成员上运行。

| [ 1 ] | *( [1](https://www.mongodb.com/docs/manual/core/read-preference/#ref-edge-cases-2-primaries-id2) , [2](https://www.mongodb.com/docs/manual/core/read-preference/#ref-edge-cases-2-primaries-id3) )* 在[某些情况下](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/#std-label-edge-cases)，副本集中的两个节点可能*暂时*认为它们是主节点，但至多，其中一个节点将能够完成具有[`{ w: "majority" }`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)写入关注的写入。可以完成 [`{ w: "majority" }`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)写入的节点是当前主节点，另一个节点是尚未识别其降级的前主节点，通常是由于[网络分区](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-network-partition)。发生这种情况时，尽管请求了读取首选项，但连接到前一个主节点的客户端可能会观察到过时的数据 [`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)，并且对前一个主节点的新写入最终将回滚。 |
| ----- | ------------------------------------------------------------ |
|       |                                                              |

←  [写对副本集的关注](https://www.mongodb.com/docs/manual/core/replica-set-write-concern/)[阅读偏好标签集列表](https://www.mongodb.com/docs/manual/core/read-preference-tags/) →

原文链接 -https://docs.mongodb.com/manual/core/read-preference/ 

译者:陆文龙

