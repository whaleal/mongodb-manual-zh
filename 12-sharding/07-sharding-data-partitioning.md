**使用块进行数据分区**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#data-partitioning-with-chunks)

MongoDB 使用与集合关联的分[片键](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)将数据划分为特定分片拥有的块[。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)[块](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)由一系列分[片](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-range)数据组成。范围可以是块的一部分或整个块。平衡器在分片之间迁移数据。每个块都有基于[shard key的包含下限和独占上限。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)

![分片键值空间的图表被分割成更小的范围或块。](https://www.mongodb.com/docs/manual/images/sharding-range-based.bakedsvg.svg)

块可以表示的最小数据单元是单个唯一的分片键值。

**初始块**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#initial-chunks)

**填充集合**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#populated-collection)

- 分片操作创建一个大的初始块以覆盖所有分片键值。
- 在初始块创建之后，平衡器在需要开始平衡数据时将范围移出初始块。

**空集合**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#empty-collection)

- 如果您定义为空或不存在的集合定义的[区域和区域范围（从 MongoDB 4.0.3 开始可用）：](https://www.mongodb.com/docs/manual/core/zone-sharding/#std-label-zone-sharding)
  - 分片操作为定义的区域范围创建空块以及任何其他块以覆盖分片键值的整个范围，并根据区域范围执行初始块分布。这种块的初始创建和分布允许更快地设置分区分片。
  - 在初始分配之后，平衡器管理接下来的块分配。
- 如果您没有为空的或不存在的集合定义区域和区域范围：
  - 对于散列分片：
    - 分片操作创建空块以覆盖分片键值的整个范围并执行初始块分配。默认情况下，该操作为每个分片创建 2 个块并跨集群迁移。您可以使用`numInitialChunks`选项指定不同数量的初始块。这种块的初始创建和分配允许更快地设置分片。
    - 在初始分配之后，平衡器管理接下来的块分配。
  - 对于远程分片：
    - 分片操作创建一个空块以覆盖分片键值的整个范围。
    - 在创建初始块后，平衡器会根据需要在分片之间迁移初始块，并管理未来的块分布。

>[TIP]
>
>也可以看看：
>
>[`sh.balancerCollectionStatus()`](https://www.mongodb.com/docs/manual/reference/method/sh.balancerCollectionStatus/#mongodb-method-sh.balancerCollectionStatus)

**范围大小**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#range-size)

MongoDB 中的默认[范围](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-range)大小为 128 兆字节。您可以 [增加或减少块大小](https://www.mongodb.com/docs/manual/tutorial/modify-chunk-size-in-sharded-cluster/#std-label-tutorial-modifying-range-size)。考虑更改默认块大小的影响：

1. 小范围导致更均匀的数据分布，但代价是更频繁的迁移。这会在查询路由 ( [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)) 层产生开销。
2. 大范围导致更少的迁移。*从网络角度和*查询路由层的内部开销来看，这都更有效。但是，这些效率是以潜在的数据分布不均匀为代价的。
3. 范围大小影响 [要迁移的每个范围的最大文档数。](https://www.mongodb.com/docs/manual/reference/limits/#mongodb-limit-Maximum-Number-of-Documents-Per-Range-to-Migrate)
4. [在对现有集合](https://www.mongodb.com/docs/manual/reference/limits/#mongodb-limit-Sharding-Existing-Collection-Data-Size)进行分片时，范围大小会影响最大集合大小 。分片后，数据范围大小不限制集合大小。

对于许多部署，以稍微不均匀分布的数据集为代价避免频繁和潜在的虚假迁移是有意义的。

**范围迁移**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#range-migration)

MongoDB 迁移分片[集群](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)中的数据范围，以在分片之间均匀分布分片集合的数据。迁移可能是：

- 手动的。仅在有限的情况下使用手动迁移，例如在批量插入期间分发数据。有关详细信息，请参阅[手动迁移块。](https://www.mongodb.com/docs/manual/tutorial/migrate-chunks-in-sharded-cluster/#std-label-migrate-chunks-sharded-cluster)

- 自动的。当分片集合的数据在分片之间分布不均匀时，[平衡器进程会自动迁移数据。](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-sharding-balancing)有关详细信息，请参阅[迁移阈值。](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-sharding-migration-thresholds)

有关分片集群[平衡器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-balancer)的更多信息，请参阅 [分片集群平衡器。](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-sharding-balancing)

>[TIP]
>
>也可以看看：
>
>[`shardingStatistics.countDonorMoveChunkLockTimeout`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.shardingStatistics.countDonorMoveChunkLockTimeout)

**平衡**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#balancing)

[平衡器](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-sharding-balancing-internals)是管理数据迁移的后台进程。如果最大和最小分片之间的数据量差异超过 [迁移阈值](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-sharding-migration-thresholds)，则平衡器开始跨集群迁移数据以确保均匀分布。

![分布在三个分片上的集合图。 对于此集合，分片之间的块数差异达到*迁移阈值*（在本例中为 2）并触发迁移。](https://www.mongodb.com/docs/manual/images/sharding-migrating.bakedsvg.svg)

您可以[管理](https://www.mongodb.com/docs/manual/tutorial/manage-sharded-cluster-balancer/#std-label-sharded-cluster-balancer)平衡器的某些方面。平衡器还尊重作为分片集群中配置区域的一部分创建的任何[区域。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-zone)

有关平衡器的更多信息， 请参阅[分片集群](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-sharding-balancing)[平衡器。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-balancer)

**不可分割/巨型块**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#indivisible-jumbo-chunks)

在某些情况下，块可以超出[指定块大小](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#std-label-sharding-chunk-size)但不能进行分裂。最常见的情况是当一个块表示单个分片键值时。由于 chunk 无法拆分，它会继续增长到超过 chunk 大小，成为一个**jumbo** chunk。随着这些**巨型**块继续增长，它们可能成为性能瓶颈，尤其是当分片键值出现[频率很高时。](https://www.mongodb.com/docs/manual/core/sharding-choose-a-shard-key/#std-label-shard-key-frequency)

从 MongoDB 5.0 开始，您可以通过更改文档的分片键来[重新分片集合。](https://www.mongodb.com/docs/manual/core/sharding-reshard-a-collection/#std-label-sharding-resharding)

从 MongoDB 4.4 开始，MongoDB 提供了 [`refineCollectionShardKey`](https://www.mongodb.com/docs/manual/reference/command/refineCollectionShardKey/#mongodb-dbcommand-dbcmd.refineCollectionShardKey)命令。细化集合的分片键可以实现更细粒度的数据分布，并且可以解决现有键基数不足导致大块的情况。

有关详细信息，请参阅：

- [更改分片键](https://www.mongodb.com/docs/manual/core/sharding-change-a-shard-key/#std-label-change-a-shard-key)
- [清`jumbo`旗](https://www.mongodb.com/docs/manual/tutorial/clear-jumbo-flag/)
- [每个范围要迁移的最大文档数](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-migration-chunk-size-limit)

**`moveChunk`目录**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#movechunk-directory)

默认情况下，[`sharding.archiveMovedChunks`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-sharding.archiveMovedChunks)禁用。

 参见

原文 - [Data Partitioning with Chunks]( https://docs.mongodb.com/manual/core/sharding-data-partitioning/ )

译者：景圣
