**分片参考**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/sharding/#sharding-reference)

`mongosh`中的分片方法[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/sharding/#sharding-methods-in-mongosh)

| 姓名                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`sh.abortReshardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.abortReshardCollection/#mongodb-method-sh.abortReshardCollection) | 中止[重新分片操作。](https://www.mongodb.com/docs/manual/core/sharding-reshard-a-collection/#std-label-sharding-resharding)*5.0新版本*。 |
| [`sh.addShard()`](https://www.mongodb.com/docs/manual/reference/method/sh.addShard/#mongodb-method-sh.addShard) | 将分[片](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)添加到分片集群。 |
| [`sh.addShardTag()`](https://www.mongodb.com/docs/manual/reference/method/sh.addShardTag/#mongodb-method-sh.addShardTag) | 在 MongoDB 3.4 中，此方法别名为[`sh.addShardToZone()`.](https://www.mongodb.com/docs/manual/reference/method/sh.addShardToZone/#mongodb-method-sh.addShardToZone) |
| [`sh.addShardToZone()`](https://www.mongodb.com/docs/manual/reference/method/sh.addShardToZone/#mongodb-method-sh.addShardToZone) | 将分片关联到区域。支持在分片集群中配置[区域。](https://www.mongodb.com/docs/manual/core/zone-sharding/#std-label-zone-sharding) |
| [`sh.addTagRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.addTagRange/#mongodb-method-sh.addTagRange) | 在 MongoDB 3.4 中，此方法别名为[`sh.updateZoneKeyRange()`.](https://www.mongodb.com/docs/manual/reference/method/sh.updateZoneKeyRange/#mongodb-method-sh.updateZoneKeyRange) |
| [`sh.balancerCollectionStatus()`](https://www.mongodb.com/docs/manual/reference/method/sh.balancerCollectionStatus/#mongodb-method-sh.balancerCollectionStatus) | 返回有关分片集合的块是否平衡的信息。*4.4版中的新*功能。      |
| [`sh.commitReshardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.commitReshardCollection/#mongodb-method-sh.commitReshardCollection) | 强制[重新分片操作](https://www.mongodb.com/docs/manual/core/sharding-reshard-a-collection/#std-label-sharding-resharding)阻止写入并完成。*5.0新版本*。 |
| [`sh.disableBalancing()`](https://www.mongodb.com/docs/manual/reference/method/sh.disableBalancing/#mongodb-method-sh.disableBalancing) | 禁用分片数据库中单个集合的平衡。不影响分片集群中其他集合的平衡。 |
| [`sh.enableBalancing()`](https://www.mongodb.com/docs/manual/reference/method/sh.enableBalancing/#mongodb-method-sh.enableBalancing) | 如果之前使用禁用，则激活分片集合平衡器进程[`sh.disableBalancing()`。](https://www.mongodb.com/docs/manual/reference/method/sh.disableBalancing/#mongodb-method-sh.disableBalancing) |
| [`sh.disableAutoSplit()`](https://www.mongodb.com/docs/manual/reference/method/sh.disableAutoSplit/#mongodb-method-sh.disableAutoSplit) | 禁用分片集群的自动拆分。从 MongoDB 6.0 开始，不执行自动分块。这是因为平衡政策的改进。自动拆分命令仍然存在，但不执行操作。有关详细信息，请参阅 [平衡策略更改。](https://www.mongodb.com/docs/manual/release-notes/6.0/#std-label-release-notes-6.0-balancing-policy-changes) |
| [`sh.enableAutoSplit()`](https://www.mongodb.com/docs/manual/reference/method/sh.enableAutoSplit/#mongodb-method-sh.enableAutoSplit) | 为分片集群启用自动拆分。从 MongoDB 6.0 开始，不执行自动分块。这是因为平衡政策的改进。自动拆分命令仍然存在，但不执行操作。有关详细信息，请参阅 [平衡策略更改。](https://www.mongodb.com/docs/manual/release-notes/6.0/#std-label-release-notes-6.0-balancing-policy-changes) |
| [`sh.enableSharding()`](https://www.mongodb.com/docs/manual/reference/method/sh.enableSharding/#mongodb-method-sh.enableSharding) | 创建数据库。                                                 |
| [`sh.getBalancerState()`](https://www.mongodb.com/docs/manual/reference/method/sh.getBalancerState/#mongodb-method-sh.getBalancerState) | 返回一个布尔值以报告当前是否启用了[平衡器。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-balancer) |
| [`sh.removeTagRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.removeTagRange/#mongodb-method-sh.removeTagRange) | 在 MongoDB 3.4 中，此方法别名为[`sh.removeRangeFromZone()`.](https://www.mongodb.com/docs/manual/reference/method/sh.removeRangeFromZone/#mongodb-method-sh.removeRangeFromZone) |
| [`sh.removeRangeFromZone()`](https://www.mongodb.com/docs/manual/reference/method/sh.removeRangeFromZone/#mongodb-method-sh.removeRangeFromZone) | 删除一系列分片键和区域之间的关联。支持在分片集群中配置[区域。](https://www.mongodb.com/docs/manual/core/zone-sharding/#std-label-zone-sharding) |
| [`sh.help()`](https://www.mongodb.com/docs/manual/reference/method/sh.help/#mongodb-method-sh.help) | 返回`sh`方法的帮助文本。                                     |
| [`sh.isBalancerRunning()`](https://www.mongodb.com/docs/manual/reference/method/sh.isBalancerRunning/#mongodb-method-sh.isBalancerRunning) | 返回描述平衡器状态的文档。                                   |
| [`sh.moveChunk()`](https://www.mongodb.com/docs/manual/reference/method/sh.moveChunk/#mongodb-method-sh.moveChunk) | 迁移分[片集群](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)中的[块](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)[。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster) |
| [`sh.removeShardTag()`](https://www.mongodb.com/docs/manual/reference/method/sh.removeShardTag/#mongodb-method-sh.removeShardTag) | 在 MongoDB 3.4 中，此方法别名为[`sh.removeShardFromZone()`.](https://www.mongodb.com/docs/manual/reference/method/sh.removeShardFromZone/#mongodb-method-sh.removeShardFromZone) |
| [`sh.removeShardFromZone()`](https://www.mongodb.com/docs/manual/reference/method/sh.removeShardFromZone/#mongodb-method-sh.removeShardFromZone) | 删除分片和区域之间的关联。用于管理[区域分片。](https://www.mongodb.com/docs/manual/core/zone-sharding/#std-label-zone-sharding) |
| [`sh.reshardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.reshardCollection/#mongodb-method-sh.reshardCollection) | 启动[重新分片操作](https://www.mongodb.com/docs/manual/core/sharding-reshard-a-collection/#std-label-sharding-resharding)以更改集合的分片键，从而更改数据的分布。*5.0新版本*。 |
| [`sh.setBalancerState()`](https://www.mongodb.com/docs/manual/reference/method/sh.setBalancerState/#mongodb-method-sh.setBalancerState) | 启用或禁用在[分片](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)之间迁移[块的](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)[平衡器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-balancer)[。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard) |
| [`sh.shardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection) | 为集合启用分片。                                             |
| [`sh.splitAt()`](https://www.mongodb.com/docs/manual/reference/method/sh.splitAt/#mongodb-method-sh.splitAt) | [使用分片键](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)的特定值作为分割点将现有[块分成两个块。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk) |
| [`sh.splitFind()`](https://www.mongodb.com/docs/manual/reference/method/sh.splitFind/#mongodb-method-sh.splitFind) | 将包含与查询匹配的文档的现有[块分成两个大致相等的块。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk) |
| [`sh.startBalancer()`](https://www.mongodb.com/docs/manual/reference/method/sh.startBalancer/#mongodb-method-sh.startBalancer) | 启用[平衡器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-balancer)并等待平衡开始。 |
| [`sh.status()`](https://www.mongodb.com/docs/manual/reference/method/sh.status/#mongodb-method-sh.status) | 报告分[片集群](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)的状态，如[`db.printShardingStatus()`.](https://www.mongodb.com/docs/manual/reference/method/db.printShardingStatus/#mongodb-method-db.printShardingStatus) |
| [`sh.stopBalancer()`](https://www.mongodb.com/docs/manual/reference/method/sh.stopBalancer/#mongodb-method-sh.stopBalancer) | 禁用[平衡器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-balancer)并等待任何正在进行的平衡轮次完成。 |
| [`sh.waitForBalancer()`](https://www.mongodb.com/docs/manual/reference/method/sh.waitForBalancer/#mongodb-method-sh.waitForBalancer) | 内部的。等待平衡器状态改变。                                 |
| [`sh.waitForBalancerOff()`](https://www.mongodb.com/docs/manual/reference/method/sh.waitForBalancerOff/#mongodb-method-sh.waitForBalancerOff) | 内部的。等到平衡器停止运行。                                 |
| [`sh.waitForPingChange()`](https://www.mongodb.com/docs/manual/reference/method/sh.waitForPingChange/#mongodb-method-sh.waitForPingChange) | 内部的。等待分[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)片集群中的一个 ping 状态发生变化。 |
| [`sh.updateZoneKeyRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.updateZoneKeyRange/#mongodb-method-sh.updateZoneKeyRange) | 将一系列分片键关联到一个区域。支持在分片集群中配置[区域。](https://www.mongodb.com/docs/manual/core/zone-sharding/#std-label-zone-sharding) |
| [`convertShardKeyToHashed()`](https://www.mongodb.com/docs/manual/reference/method/convertShardKeyToHashed/#mongodb-method-convertShardKeyToHashed) | 返回输入的散列值。                                           |

**分片数据库命令**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/sharding/#sharding-database-commands)

以下数据库命令支持[分片集群。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)

| 姓名                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`abortReshardCollection`](https://www.mongodb.com/docs/manual/reference/command/abortReshardCollection/#mongodb-dbcommand-dbcmd.abortReshardCollection) | 中止[重新分片操作。](https://www.mongodb.com/docs/manual/core/sharding-reshard-a-collection/#std-label-sharding-resharding)*5.0新版本*。 |
| [`addShard`](https://www.mongodb.com/docs/manual/reference/command/addShard/#mongodb-dbcommand-dbcmd.addShard) | 将分[片](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)添加到分[片集群。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster) |
| [`addShardToZone`](https://www.mongodb.com/docs/manual/reference/command/addShardToZone/#mongodb-dbcommand-dbcmd.addShardToZone) | 将分片与[区域](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-zone)相关联。支持在分片集群中配置[区域。](https://www.mongodb.com/docs/manual/core/zone-sharding/#std-label-zone-sharding) |
| [`balancerCollectionStatus`](https://www.mongodb.com/docs/manual/reference/command/balancerCollectionStatus/#mongodb-dbcommand-dbcmd.balancerCollectionStatus) | 返回有关分片集合的块是否平衡的信息。*4.4版中的新*功能。      |
| [`balancerStart`](https://www.mongodb.com/docs/manual/reference/command/balancerStart/#mongodb-dbcommand-dbcmd.balancerStart) | 启动平衡器线程。                                             |
| [`balancerStatus`](https://www.mongodb.com/docs/manual/reference/command/balancerStatus/#mongodb-dbcommand-dbcmd.balancerStatus) | 返回有关平衡器状态的信息。                                   |
| [`balancerStop`](https://www.mongodb.com/docs/manual/reference/command/balancerStop/#mongodb-dbcommand-dbcmd.balancerStop) | 停止平衡器线程。                                             |
| [`checkShardingIndex`](https://www.mongodb.com/docs/manual/reference/command/checkShardingIndex/#mongodb-dbcommand-dbcmd.checkShardingIndex) | 验证分片键上的索引的内部命令。                               |
| [`clearJumboFlag`](https://www.mongodb.com/docs/manual/reference/command/clearJumboFlag/#mongodb-dbcommand-dbcmd.clearJumboFlag) | 清除`jumbo`块的标志。                                        |
| [`cleanupOrphaned`](https://www.mongodb.com/docs/manual/reference/command/cleanupOrphaned/#mongodb-dbcommand-dbcmd.cleanupOrphaned) | 删除具有分片拥有的块范围之外的分片键值的孤立数据。           |
| [`cleanupReshardCollection`](https://www.mongodb.com/docs/manual/reference/command/cleanupReshardCollection/#mongodb-dbcommand-dbcmd.cleanupReshardCollection) | 清除失败的[重新分片操作。](https://www.mongodb.com/docs/manual/core/sharding-reshard-a-collection/#std-label-sharding-resharding)*5.0新版本*。 |
| [`commitReshardCollection`](https://www.mongodb.com/docs/manual/reference/command/commitReshardCollection/#mongodb-dbcommand-dbcmd.commitReshardCollection) | 强制[重新分片操作](https://www.mongodb.com/docs/manual/core/sharding-reshard-a-collection/#std-label-sharding-resharding)阻止写入并完成。*5.0新版本*。 |
| [`enableSharding`](https://www.mongodb.com/docs/manual/reference/command/enableSharding/#mongodb-dbcommand-dbcmd.enableSharding) | 在特定数据库上启用分片。                                     |
| [`flushRouterConfig`](https://www.mongodb.com/docs/manual/reference/command/flushRouterConfig/#mongodb-dbcommand-dbcmd.flushRouterConfig) | 强制[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例更新其缓存的路由元数据。 |
| [`getShardMap`](https://www.mongodb.com/docs/manual/reference/command/getShardMap/#mongodb-dbcommand-dbcmd.getShardMap) | 报告分片集群状态的内部命令。                                 |
| [`getShardVersion`](https://www.mongodb.com/docs/manual/reference/command/getShardVersion/#mongodb-dbcommand-dbcmd.getShardVersion) | [返回配置服务器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-database)版本的内部命令。 |
| [`isdbgrid`](https://www.mongodb.com/docs/manual/reference/command/isdbgrid/#mongodb-dbcommand-dbcmd.isdbgrid) | 验证一个进程是一个[`mongos`.](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) |
| [`listShards`](https://www.mongodb.com/docs/manual/reference/command/listShards/#mongodb-dbcommand-dbcmd.listShards) | 返回已配置分片的列表。                                       |
| [`medianKey`](https://www.mongodb.com/docs/manual/reference/command/medianKey/#mongodb-dbcommand-dbcmd.medianKey) | 弃用的内部命令。看[`splitVector`。](https://www.mongodb.com/docs/manual/reference/command/splitVector/#mongodb-dbcommand-dbcmd.splitVector) |
| [`moveChunk`](https://www.mongodb.com/docs/manual/reference/command/moveChunk/#mongodb-dbcommand-dbcmd.moveChunk) | 在分片之间迁移块的内部命令。                                 |
| [`movePrimary`](https://www.mongodb.com/docs/manual/reference/command/movePrimary/#mongodb-dbcommand-dbcmd.movePrimary) | 从分片集群中删除分片时重新分配[主分片。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary-shard) |
| [`moveRange`](https://www.mongodb.com/docs/manual/reference/command/moveRange/#mongodb-dbcommand-dbcmd.moveRange) | 在分片之间迁移范围的命令。                                   |
| [`mergeChunks`](https://www.mongodb.com/docs/manual/reference/command/mergeChunks/#mongodb-dbcommand-dbcmd.mergeChunks) | 提供在单个分片上组合块的能力。                               |
| [`removeShard`](https://www.mongodb.com/docs/manual/reference/command/removeShard/#mongodb-dbcommand-dbcmd.removeShard) | 开始从分片集群中删除分片的过程。                             |
| [`removeShardFromZone`](https://www.mongodb.com/docs/manual/reference/command/removeShardFromZone/#mongodb-dbcommand-dbcmd.removeShardFromZone) | [删除分片和区域](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-zone)之间的关联。支持在分片集群中配置[区域。](https://www.mongodb.com/docs/manual/core/zone-sharding/#std-label-zone-sharding) |
| [`reshardCollection`](https://www.mongodb.com/docs/manual/reference/command/reshardCollection/#mongodb-dbcommand-dbcmd.reshardCollection) | 启动[重新分片操作](https://www.mongodb.com/docs/manual/core/sharding-reshard-a-collection/#std-label-sharding-resharding)以更改集合的分片键，从而更改数据的分布。*5.0新版本*。 |
| [`setShardVersion`](https://www.mongodb.com/docs/manual/reference/command/setShardVersion/#mongodb-dbcommand-dbcmd.setShardVersion) | [用于设置配置服务器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-database)版本的内部命令。 |
| [`shardCollection`](https://www.mongodb.com/docs/manual/reference/command/shardCollection/#mongodb-dbcommand-dbcmd.shardCollection) | 启用集合的分片功能，允许对集合进行分片。                     |
| [`shardingState`](https://www.mongodb.com/docs/manual/reference/command/shardingState/#mongodb-dbcommand-dbcmd.shardingState) | 报告是否[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)是分片集群的成员。 |
| [`split`](https://www.mongodb.com/docs/manual/reference/command/split/#mongodb-dbcommand-dbcmd.split) | 创建一个新[块。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk) |
| [`splitVector`](https://www.mongodb.com/docs/manual/reference/command/splitVector/#mongodb-dbcommand-dbcmd.splitVector) | 确定分割点的内部命令。                                       |
| [`unsetSharding`](https://www.mongodb.com/docs/manual/reference/command/unsetSharding/#mongodb-dbcommand-dbcmd.unsetSharding) | *在 MongoDB 5.0 中删除。*影响 MongoDB 部署中实例之间连接的内部命令。 |
| [`updateZoneKeyRange`](https://www.mongodb.com/docs/manual/reference/command/updateZoneKeyRange/#mongodb-dbcommand-dbcmd.updateZoneKeyRange) | 添加或删除一系列分片数据与[区域](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-zone)之间的关联。支持在分片集群中配置[区域。](https://www.mongodb.com/docs/manual/core/zone-sharding/#std-label-zone-sharding) |

**参考文档**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/sharding/#reference-documentation)

- [操作限制](https://www.mongodb.com/docs/manual/core/sharded-cluster-requirements/)

  部署分片集群的要求

- [对分片集群进行故障排除](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-sharded-clusters/)

  对分片集群部署进行故障排除的常用策略。

- [配置数据库](https://www.mongodb.com/docs/manual/reference/config-database/)

  `local`MongoDB 用于存储分片集群元数据的数据库内容的完整文档。

 参见

原文 - [Sharding Reference]( https://docs.mongodb.com/manual/reference/sharding/ )

译者：景圣
