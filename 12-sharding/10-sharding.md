# 分片参考

`mongosh`中的分片方法

| 姓名                            | 描述                                                         |
| :------------------------------ | :----------------------------------------------------------- |
| `sh.abortReshardCollection()`   | 中止重新分片操作。*5.0新版本*。                              |
| `sh.addShard()`                 | 将分片添加到分片集群。                                       |
| `sh.addShardTag()`              | 在 MongoDB 3.4 中，此方法别名为`sh.addShardToZone()`.        |
| `sh.addShardToZone()`           | 将分片关联到区域。支持在分片集群中配置区域。                 |
| `sh.addTagRange()`              | 在 MongoDB 3.4 中，此方法别名为`sh.updateZoneKeyRange()`.    |
| `sh.balancerCollectionStatus()` | 返回有关分片集合的块是否平衡的信息。*4.4版中的新*功能。      |
| `sh.commitReshardCollection()`  | 强制重新分片操作阻止写入并完成。*5.0新版本*。                |
| `sh.disableBalancing()`         | 禁用分片数据库中单个集合的平衡。不影响分片集群中其他集合的平衡。 |
| `sh.enableBalancing()`          | 如果之前使用禁用，则激活分片集合平衡器进程`sh.disableBalancing()`。 |
| `sh.disableAutoSplit()`         | 禁用分片集群的自动拆分。从 MongoDB 6.0 开始，不执行自动分块。这是因为平衡政策的改进。自动拆分命令仍然存在，但不执行操作。 |
| `sh.enableAutoSplit()`          | 为分片集群启用自动拆分。从 MongoDB 6.0 开始，不执行自动分块。这是因为平衡政策的改进。自动拆分命令仍然存在，但不执行操作。 |
| `sh.enableSharding()`           | 创建数据库。                                                 |
| `sh.getBalancerState()`         | 返回一个布尔值以报告当前是否启用了平衡器。                   |
| `sh.removeTagRange()`           | 在 MongoDB 3.4 中，此方法别名为`sh.removeRangeFromZone()`.   |
| `sh.removeRangeFromZone()`      | 删除一系列分片键和区域之间的关联。支持在分片集群中配置区域。 |
| `sh.help()`                     | 返回`sh`方法的帮助文本。                                     |
| `sh.isBalancerRunning()`        | 返回描述平衡器状态的文档。                                   |
| `sh.moveChunk()`                | 迁移分片集群中的块。                                         |
| `sh.removeShardTag()`           | 在 MongoDB 3.4 中，此方法别名为`sh.removeShardFromZone()`.   |
| `sh.removeShardFromZone()`      | 删除分片和区域之间的关联。用于管理区域分片。                 |
| `sh.reshardCollection()`        | 启动重新分片操作以更改集合的分片键，从而更改数据的分布。*5.0新版本*。 |
| `sh.setBalancerState()`         | 启用或禁用在分片之间迁移块的平衡器。                         |
| `sh.shardCollection()`          | 为集合启用分片。                                             |
| `sh.splitAt()`                  | 使用分片键的特定值作为分割点将现有块分成两个块。             |
| `sh.splitFind()`                | 将包含与查询匹配的文档的现有块分成两个大致相等的块。         |
| `sh.startBalancer()`            | 启用平衡器并等待平衡开始。                                   |
| `sh.status()`                   | 报告分片集群的状态，如`db.printShardingStatus()`.            |
| `sh.stopBalancer()`             | 禁用平衡器并等待任何正在进行的平衡轮次完成。                 |
| `sh.waitForBalancer()`          | 内部的。等待平衡器状态改变。                                 |
| `sh.waitForBalancerOff()`       | 内部的。等到平衡器停止运行。                                 |
| `sh.waitForPingChange()`        | 内部的。等待分`mongos`片集群中的一个 ping 状态发生变化。     |
| `sh.updateZoneKeyRange()`       | 将一系列分片键关联到一个区域。支持在分片集群中配置区域。     |
| `convertShardKeyToHashed()`     | 返回输入的散列值。                                           |

**分片数据库命令**

以下数据库命令支持分片集群。

| 姓名                       | 描述                                                         |
| :------------------------- | :----------------------------------------------------------- |
| `abortReshardCollection`   | 中止重新分片操作。*5.0新版本*。                              |
| `addShard`                 | 将分片添加到分片集群。                                       |
| `addShardToZone`           | 将分片与区域相关联。支持在分片集群中配置区域。               |
| `balancerCollectionStatus` | 返回有关分片集合的块是否平衡的信息。*4.4版中的新*功能。      |
| `balancerStart`            | 启动平衡器线程。                                             |
| `balancerStatus`           | 返回有关平衡器状态的信息。                                   |
| `balancerStop`             | 停止平衡器线程。                                             |
| `checkShardingIndex`       | 验证分片键上的索引的内部命令。                               |
| `clearJumboFlag`           | 清除`jumbo`块的标志。                                        |
| `cleanupOrphaned`          | 删除具有分片拥有的块范围之外的分片键值的孤立数据。           |
| `cleanupReshardCollection` | 清除失败的重新分片操作。*5.0新版本*。                        |
| `commitReshardCollection`  | 强制重新分片操作阻止写入并完成。*5.0新版本*。                |
| `enableSharding`           | 在特定数据库上启用分片。                                     |
| `flushRouterConfig`        | 强制`mongod`/`mongos`实例更新其缓存的路由元数据。            |
| `getShardMap`              | 报告分片集群状态的内部命令。                                 |
| `getShardVersion`          | 返回配置服务器]版本的内部命令。                              |
| `isdbgrid`                 | 验证一个进程是一个`mongos`.                                  |
| `listShards`               | 返回已配置分片的列表。                                       |
| `medianKey`                | 弃用的内部命令。                                             |
| `moveChunk`                | 在分片之间迁移块的内部命令。                                 |
| `movePrimary`              | 从分片集群中删除分片时重新分配主分片。                       |
| `moveRange`                | 在分片之间迁移范围的命令。                                   |
| `mergeChunks`              | 提供在单个分片上组合块的能力。                               |
| `removeShard`              | 开始从分片集群中删除分片的过程。                             |
| `removeShardFromZone`      | 删除分片和区域                                               |
| `reshardCollection`        | 启动重新分片操作以更改集合的分片键，从而更改数据的分布。*5.0新版本*。 |
| `setShardVersion`          | 用于设置配置服务器版本的内部命令。                           |
| `shardCollection`          | 启用集合的分片功能，允许对集合进行分片。                     |
| `shardingState`            | 报告是否`mongod`是分片集群的节点。                           |
| `split`                    | 创建一个新块。                                               |
| `splitVector`              | 确定分割点的内部命令。                                       |
| `unsetSharding`            | *在 MongoDB 5.0 中删除。*影响 MongoDB 部署中实例之间连接的内部命令。 |
| `updateZoneKeyRange`       | 添加或删除一系列分片数据与区域之间的关联。支持在分片集群中配置区域。 |

**参考文档**

- 操作限制

  部署分片集群的要求

- 对分片集群进行故障排除

  对分片集群部署进行故障排除的常用策略。

- 配置数据库

  `local`MongoDB 用于存储分片集群元数据的数据库内容的完整文档。



原文 -  https://docs.mongodb.com/manual/reference/sharding/ 

译者：景圣
