**分片集群平衡器**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#sharded-cluster-balancer)

MongoDB 平衡器是一个后台进程，它监视每个分片集合的每个分片上的数据[量](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)。当给定分片上分片集合的数据量达到特定 [移民门槛](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-sharding-migration-thresholds)，平衡器尝试在分片之间自动迁移数据并在尊重[区域](https://www.mongodb.com/docs/manual/core/zone-sharding/#std-label-zone-sharding)的同时达到每个分片的均匀数据量。默认情况下，平衡器进程始终处于启用状态。

[分片集群](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)的平衡过程对 用户和应用程序层是完全透明的，尽管在该过程发生时可能会对性能产生一些影响。

![分布在三个分片上的集合图。 对于此集合，分片之间的块数差异达到*迁移阈值*（在本例中为 2）并触发迁移。](https://www.mongodb.com/docs/manual/images/sharding-migrating.bakedsvg.svg)

平衡器在配置服务器副本集 (CSRS) 的主服务器上运行。

**平衡器内部**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#balancer-internals)

范围迁移在带宽和工作负载方面带来一些开销，这两者都会影响数据库性能。[平衡器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-balancer)试图通过以下方式最小化影响：

- 在任何给定时间将分片限制为最多一次迁移。具体来说，一个分片不能同时参与多个数据迁移。平衡器一次迁移一个范围。

  MongoDB 可以执行并行数据迁移，但是一个分片一次最多可以参与一个迁移。对于具有*n 个*分片的分片集群，MongoDB 最多可以执行*n/2*（向下取整）次同时迁移。

  也可以看看[异步范围迁移清理。](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-range-migration-queuing)

- 仅当分片集合中数据最多的分片与该集合中数据最少的分片之间的 **数据量差异达到**[迁移门槛。](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-sharding-migration-thresholds)

您可以暂时禁用平衡器进行维护。有关详细信息，请参阅 [禁用平衡器](https://www.mongodb.com/docs/manual/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-balancing-disable-temporally)。

您还可以限制平衡器运行的窗口，以防止它影响生产流量。有关详细信息，请参阅[安排平衡窗口](https://www.mongodb.com/docs/manual/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-schedule-balancing-window)。

>[NOTE]
>
>平衡窗口的规范是相对于配置服务器副本集的主要本地时区的。

>[TIP]
>
>也可以看看：
>
>[管理分片集群平衡器](https://www.mongodb.com/docs/manual/tutorial/manage-sharded-cluster-balancer/#std-label-sharded-cluster-balancer)

**在集群中添加和删除分片**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#adding-and-removing-shards-from-the-cluster)

将分片添加到集群会造成不平衡，因为新分片没有数据。虽然 MongoDB 立即开始将数据迁移到新的分片，但集群平衡之前可能需要一些时间。有关将分片添加到集群的说明，请参阅将分[片添加到集群](https://www.mongodb.com/docs/manual/tutorial/add-shards-to-shard-cluster/#std-label-sharding-procedure-add-shard) 教程。

从集群中删除分片会产生类似的不平衡，因为驻留在该分片上的数据必须在整个集群中重新分布。虽然 MongoDB 会立即开始清空已删除的分片，但在集群达到平衡之前可能需要一些时间。在此过程中*不要关闭与删除的分片关联的服务器。*

当您在块分布不均匀的集群中删除分片时，平衡器首先从耗尽分片中删除块，然后平衡剩余的不均匀块分布。

有关从集群中安全删除分片的说明，请参阅[从集群中删除](https://www.mongodb.com/docs/manual/tutorial/remove-shards-from-cluster/#std-label-remove-shards-from-cluster-tutorial)分片教程。

>[TIP]
>
>也可以看看：
>
>[`sh.balancerCollectionStatus()`](https://www.mongodb.com/docs/manual/reference/method/sh.balancerCollectionStatus/#mongodb-method-sh.balancerCollectionStatus)

**范围迁移程序**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#range-migration-procedure)

所有范围迁移都使用以下过程：

1. 平衡器进程将[`moveRange`](https://www.mongodb.com/docs/manual/reference/command/moveRange/#mongodb-dbcommand-dbcmd.moveRange)命令发送到源分片。

2. 源在收到内部 [`moveRange`](https://www.mongodb.com/docs/manual/reference/command/moveRange/#mongodb-dbcommand-dbcmd.moveRange)命令时开始移动。在迁移过程中，对范围的操作将发送到源分片。源分片负责范围的传入写入操作。

3. 目标分片构建源所需但目标不存在的任何索引。

4. 目标分片开始请求范围内的文档并开始接收数据副本。也可以看看 [范围迁移和复制。](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-range-migration-replication)

5. 在接收到范围内的最终文档后，目标分片启动同步过程以确保它具有迁移期间发生的对迁移文档的更改。

6. 完全同步后，源分片连接到 [配置数据库](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-database)并使用范围的新位置更新集群元数据。

7. 源分片完成元数据更新后，一旦该范围内没有打开的游标，源分片就会删除其文档副本。

   >[NOTE]
   >
   >如果平衡器需要从源分片执行额外的块迁移，则平衡器可以开始下一个块迁移，而无需等待当前迁移过程完成此删除步骤。看[异步范围迁移清理。](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-chunk-migration-queuing)

   >[TIP]
   >
   >也可以看看：
   >
   >[`moveChunk`目录](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#std-label-moveChunk-directory)

>[TIP]
>
>也可以看看：
>
>[`shardingStatistics.countDonorMoveChunkLockTimeout`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.shardingStatistics.countDonorMoveChunkLockTimeout)

**迁移阈值**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#migration-thresholds)

为了最小化平衡对集群的影响， [平衡器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-balancer)仅在分片集合的日期分布达到特定阈值后才开始平衡。

如果分片之间的数据差异（对于该集合）小于[迁移阈值。](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-sharding-migration-thresholds)

>[TIP]
>
>也可以看看：
>
>[`sh.balancerCollectionStatus()`](https://www.mongodb.com/docs/manual/reference/method/sh.balancerCollectionStatus/#mongodb-method-sh.balancerCollectionStatus)

**异步范围迁移清理**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#asynchronous-range-migration-cleanup)

为了从分片迁移数据，平衡器一次迁移一个范围的数据。但是，平衡器不会等待当前迁移的删除阶段完成后再开始下一次范围迁移。范围迁移过程和删除阶段见[范围迁移](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#std-label-sharding-range-migration)。

这种排队行为允许分片在集群严重不平衡的情况下更快地卸载数据，例如在没有预拆分的情况下执行初始数据加载时以及添加新分片时。

此行为也会影响[`moveRange`](https://www.mongodb.com/docs/manual/reference/command/moveRange/#mongodb-dbcommand-dbcmd.moveRange)命令，并且使用该[`moveRange`](https://www.mongodb.com/docs/manual/reference/command/moveRange/#mongodb-dbcommand-dbcmd.moveRange)命令的迁移脚本可能会更快地进行。

在某些情况下，删除阶段可能会持续更长时间。范围迁移得到增强，在删除阶段发生故障转移时更具弹性。即使副本集的主节点在此阶段崩溃或重新启动，也会清除孤立的文档。

平衡器设置可以改变行为，`_waitForDelete`以便当前迁移的删除阶段阻止下一个块迁移的开始。通常`_waitForDelete`用于内部测试目的。有关详细信息，请参阅 [等待删除。](https://www.mongodb.com/docs/manual/tutorial/manage-sharded-cluster-balancer/#std-label-wait-for-delete-setting)

**范围迁移和复制**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#range-migration-and-replication)

在范围迁移期间，该`_secondaryThrottle`值确定迁移何时继续处理范围中的下一个文档。

在[`config.settings`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.settings)集合中：

- 如果`_secondaryThrottle`平衡器的设置设置为写关注，则范围迁移期间的每个文档移动都必须在继续下一个文档之前收到请求的确认。
- 如果`_secondaryThrottle`平衡器的设置设置为 `true`，则范围迁移期间的每个文档移动必须在迁移继续范围内的下一个文档之前从至少一个辅助节点接收确认。这相当于 的写关注[`{ w: 2 }`。](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)
- 如果未设置该`_secondaryThrottle`设置，则迁移过程不会等待复制到辅助文件，而是继续下一个文档。

要更新`_secondaryThrottle`平衡器的参数，请参阅 [Secondary Throttle](https://www.mongodb.com/docs/manual/tutorial/manage-sharded-cluster-balancer/#std-label-sharded-cluster-config-secondary-throttle)示例。

独立于任何`_secondaryThrottle`设置，范围迁移的某些阶段具有以下复制策略：

- 在使用范围位置更新配置服务器之前，MongoDB 会短暂暂停所有应用程序读取和写入要迁移到源分片上的集合。MongoDB 更新后恢复应用程序读写。范围移动要求所有写入在将范围移动提交到配置服务器之前和之后都被副本集的大多数成员确认。
- 当传出迁移完成并发生清理时，必须将所有写入复制到大多数服务器，然后才能进行进一步清理（来自其他传出迁移）或新的传入迁移可以继续。

要更新集合 `_secondaryThrottle`中的设置 ，请参阅[Secondary Throttle](https://www.mongodb.com/docs/manual/tutorial/manage-sharded-cluster-balancer/#std-label-sharded-cluster-config-secondary-throttle)示例。[`config.settings`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.settings)

**每个范围要迁移的最大文档数**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#maximum-number-of-documents-per-range-to-migrate)

默认情况下，如果范围内的文档数大于配置[范围大小](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#std-label-sharding-range-size)除以平均文档大小的结果的 2 倍，则 MongoDB 无法移动范围。如果 MongoDB 可以移动块的子范围并将大小减小到小于该范围，则平衡器通过迁移范围来实现。 [`db.collection.stats()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.stats/#mongodb-method-db.collection.stats)包括该`avgObjSize`字段，它表示集合中的平均文档大小。

对于块是[太大而无法迁移：](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-migration-chunk-size-limit)

- 平衡器设置`attemptToBalanceJumboChunks`允许平衡器迁移太大而无法移动的块，只要块没有标记为[jumbo](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#std-label-jumbo-chunk)。有关详细信息，请参见 [超出大小限制](https://www.mongodb.com/docs/manual/tutorial/manage-sharded-cluster-balancer/#std-label-balance-chunks-that-exceed-size-limit)的平衡范围。

  发出[`moveRange`](https://www.mongodb.com/docs/manual/reference/command/moveRange/#mongodb-dbcommand-dbcmd.moveRange)和[`moveChunk`](https://www.mongodb.com/docs/manual/reference/command/moveChunk/#mongodb-dbcommand-dbcmd.moveChunk) 命令时，可以指定[forceJumbo](https://www.mongodb.com/docs/manual/reference/command/moveRange/#std-label-moverange-forceJumbo)选项以允许迁移太大而无法移动的范围。范围可能会或可能不会被标记为 [jumbo 。](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#std-label-jumbo-chunk)

**范围删除性能调整**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#range-deletion-performance-tuning)

[`rangeDeleterBatchSize`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.rangeDeleterBatchSize)您可以使用和 [`rangeDeleterBatchDelayMS`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.rangeDeleterBatchDelayMS)参数调整范围删除对性能的影响。例如：

- 要限制每批删除的文档数，可以设置 [`rangeDeleterBatchSize`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.rangeDeleterBatchSize)为较小的值，例如`32`.
- 要在批量删除之间添加额外的延迟，您可以设置 [`rangeDeleterBatchDelayMS`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.rangeDeleterBatchDelayMS)高于当前默认值的 `20`毫秒数。

>[NOTE]
>
>如果在要删除的集合上正在进行读取操作或打开游标，则范围删除过程可能不会继续。

**更改流和孤立文档**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#change-streams-and-orphan-documents)

从 MongoDB 5.3 开始，在[范围迁移](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-range-migration-procedure),不会为[孤立文档](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-orphaned-document) 的更新生成[更改流事件](https://www.mongodb.com/docs/manual/changeStreams/#std-label-changeStreams)[。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-orphaned-document)

**分片大小**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#shard-size)

默认情况下，随着数据集的增长，MongoDB 会尝试用每个分片上的数据填充所有可用磁盘空间。为确保集群始终有能力处理数据增长，监控磁盘使用情况以及其他性能指标。

有关设置分片最大大小的说明，请参阅[更改给定分片的最大存储大小](https://www.mongodb.com/docs/manual/tutorial/manage-sharded-cluster-balancer/#std-label-sharded-cluster-config-max-shard-size)教程。

 参见

原文 - [Balancer]( https://docs.mongodb.com/manual/core/sharding-balancer-administration/ )

译者：景圣
