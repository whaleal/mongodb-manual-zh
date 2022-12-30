**区域**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/zone-sharding/#zones)

在分片集群中，您可以根据分[片键创建分片数据](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)[区域](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-zone)。您可以将每个区域与集群中的一个或多个分片相关联。一个分片可以关联任意数量的区域。在平衡集群中，MongoDB仅将区域覆盖的[块](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)迁移 到与该区域关联的那些分片。

可以应用区域的一些常见部署模式如下：

- 隔离一组特定分片上的特定数据子集。
- 确保最相关的数据驻留在地理位置上最接近应用程序服务器的分片上。
- 根据分片硬件的硬件/性能将数据路由到分片。

下图说明了具有三个分片和两个区域的分片集群。该`A`区域表示一个范围，下限为`1`，上限为`10`。该`B`区域表示具有下边界`10`和上边界的范围`20`。分片`Alpha`和`Beta`有`A`区。碎片`Beta`也有`B`区域。分片`Charlie`没有与之关联的区域。集群处于稳定状态，没有块违反任何区域。

![分片集群中基于区域的数据分布图](https://www.mongodb.com/docs/manual/images/sharded-cluster-zones.bakedsvg.svg)

点击放大

**行为和操作**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/zone-sharding/#behavior-and-operations)

**范围**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/zone-sharding/#ranges)

每个区域覆盖集合的一个或多个分[片键值范围。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)区域覆盖的每个范围始终包含其下边界且不包含其上边界。区域不能共享范围，也不能有重叠范围。

例如，考虑 上的分片键`{"x": 1}`。集群具有以下区域范围：

```json
{ "x" : 5 } --> { "x" : 10 } // Zone A
{ "x" : 10} --> { "x" : 20 } // Zone B
```

- 分片键值为 的文档`7`被路由到区域 A。
- 分片键值为 的文档`10`被路由到区域 B。

**哈希分片键和区域范围**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/zone-sharding/#hashed-shard-keys-and-zone-ranges)

对于分片键包含散列字段的集合，该字段上的区域范围和数据分布在散列值上。该区域包含其*散列*分片键值落入定义范围内的文档。散列字段上的区域范围与未散列字段上的区域范围不具有相同的可预测文档路由行为。

例如，考虑 上的分片键`{"x" : "hashed"}`。以下范围表示和之间的*散列*范围：`5``10`

```json
{ "x": NumberLong("4470791281878691347") } --> { "x": NumberLong("7766103514953448109") } // Zone A
```

- 具有分片键值的文档`1`被路由到区域 A，因为*散列*值`1`落在定义的范围内。
- 具有分片键值的文档`15`被路由到区域 A，因为*散列*值`15`落在定义的范围内。
- 分片键值为 的文档`8`不会路由到区域 A，因为 的*散列*值`8`不在定义的范围内。

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)提供 [`convertShardKeyToHashed()`](https://www.mongodb.com/docs/manual/reference/method/convertShardKeyToHashed/#mongodb-method-convertShardKeyToHashed)用于计算指定参数的后哈希值。

哈希字段上区域范围的一种有效用法是将集合的数据限制为单个区域中的一个或多个分片。[使用minKey](https://www.mongodb.com/docs/manual/reference/bson-types/)作为下限， 使用[maxkey](https://www.mongodb.com/docs/manual/reference/bson-types/)作为上限，创建一个覆盖可能的散列分片键值的整个范围的区域范围。

为了定义范围，MongoDB 提供了[`updateZoneKeyRange`](https://www.mongodb.com/docs/manual/reference/command/updateZoneKeyRange/#mongodb-dbcommand-dbcmd.updateZoneKeyRange) 命令和相关的辅助方法 [`sh.updateZoneKeyRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.updateZoneKeyRange/#mongodb-method-sh.updateZoneKeyRange)以及[`sh.addShardTag()`.](https://www.mongodb.com/docs/manual/reference/method/sh.addShardTag/#mongodb-method-sh.addShardTag)

从 MongoDB 4.0.2 开始，您可以 在未分片的集合或不存在的集合上运行[`updateZoneKeyRange`](https://www.mongodb.com/docs/manual/reference/command/updateZoneKeyRange/#mongodb-dbcommand-dbcmd.updateZoneKeyRange)数据库命令及其帮助 程序。[`sh.updateZoneKeyRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.updateZoneKeyRange/#mongodb-method-sh.updateZoneKeyRange)[`sh.addTagRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.addTagRange/#mongodb-method-sh.addTagRange)

删除集合会删除其关联的区域/标签范围。

**初始块分布**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/zone-sharding/#initial-chunk-distribution)

*在4.0.3版中更改*：通过在对空集合或不存在的集合进行分片*之前*定义区域和区域范围，分片集合操作会为定义的区域范围创建块以及任何其他块以覆盖整个范围分片键值并根据区域范围执行初始块分布。这种块的初始创建和分布允许更快地设置分区分片。在初始分配之后，平衡器管理接下来的块分配。

从 4.4 版开始，MongoDB 支持在 [复合散列索引](https://www.mongodb.com/docs/manual/core/index-hashed/#std-label-index-type-compound-hashed)上分片集合。当使用复合散列分片键分片一个空的或不存在的集合时，为了让 MongoDB 执行初始块创建和分发，额外的要求适用。

有关示例，请参阅[为空或不存在的集合预定义区域和区域范围。](https://www.mongodb.com/docs/manual/reference/method/sh.updateZoneKeyRange/#std-label-pre-define-zone-range-hashed-example)

>[TIP]
>
>**也可以看看**：
>
>[`sh.balancerCollectionStatus()`](https://www.mongodb.com/docs/manual/reference/method/sh.balancerCollectionStatus/#mongodb-method-sh.balancerCollectionStatus)

**平衡器**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/zone-sharding/#balancer)

[平衡器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-balancer)尝试将分片集合的块均匀分布到集群中的所有分片。

对于标记为迁移的每个[块](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)，平衡器检查任何已配置区域的每个可能的目标分片。如果块范围落入某个区域，则平衡器会将块迁移到该区域内的分片中。不属于 zone 的chunk 可以存在于集群中的*任意分片上，正常迁移。*

在平衡轮次期间，如果平衡器检测到任何块违反了给定分片的配置区域，则平衡器会将这些块迁移到不存在冲突的分片。

在将区域与一个或多个分片相关联并使用分片集合的分片键范围配置该区域后，集群可能需要一些时间来迁移分片集合的受影响数据。这取决于 chunk 的划分和集群中数据的当前分布。平衡完成后，给定区域中文档的读取和写入仅路由到该区域内的一个或多个分片。

配置完成后，平衡器会在未来的 [平衡轮次中考虑区域。](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-sharding-internals-balancing)

>[TIP]
>
>也可以看看：
>
>[`sh.balancerCollectionStatus()`](https://www.mongodb.com/docs/manual/reference/method/sh.balancerCollectionStatus/#mongodb-method-sh.balancerCollectionStatus)

**片键**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/zone-sharding/#shard-key)

在定义要覆盖的区域的新范围时，您必须使用包含在分片[键中的字段。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)如果使用[复合](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-compound-index)分片键，范围必须包含分片键的前缀。

例如，给定一个 shard key `{ a : 1, b : 1, c : 1 }`，创建或更新一个范围以覆盖`b`requires 的值，包括`a`作为前缀。创建或更新范围以涵盖`c`需要包含`a`和`b`作为前缀的值。

您不能使用不包含在分片键中的字段创建范围。例如，如果您想使用区域根据地理位置对数据进行分区，则分片键需要第一个字段来包含地理数据。

在为集合选择分片键时，请考虑您可能希望使用哪些字段来配置区域。有关[选择分片键](https://www.mongodb.com/docs/manual/core/sharding-choose-a-shard-key/#std-label-sharding-internals-choose-shard-key) 的注意事项，请参阅选择分片键。

**碎片区边界**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/zone-sharding/#shard-zone-boundaries)

区域范围始终包含下边界且不包含上边界。

>[TIP]
>
>也可以看看：
>
>[管理分片区](https://www.mongodb.com/docs/manual/tutorial/manage-shard-zone/)

 参见

原文 - [Zones]( https://docs.mongodb.com/manual/core/zone-sharding/ )

译者：景圣
