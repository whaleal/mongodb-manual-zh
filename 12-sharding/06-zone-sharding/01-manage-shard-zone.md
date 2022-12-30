 管理分片区[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/manage-shard-zone/#manage-shard-zones)

在分片集群中，您可以创建代表一组分片的区域，并将一个或多个分片[键值](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)范围关联到该区域。MongoDB 将属于区域范围内的读取和写入仅路由到区域内的那些分片。

>[TIP]
>
>*在4.0.3版中更改*：通过在对空集合或不存在的集合进行分片*之前*定义区域和区域范围，分片集合操作会为定义的区域范围创建块以及任何其他块以覆盖整个范围分片键值并根据区域范围执行初始块分配。这种块的初始创建和分布允许更快地设置分区分片。在初始分配之后，平衡器管理接下来的块分配。有关示例，请参阅[为空或不存在的集合预定义区域和区域范围。](https://www.mongodb.com/docs/manual/reference/method/sh.updateZoneKeyRange/#std-label-pre-define-zone-range-example)

**将分片添加到区域**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/manage-shard-zone/#add-shards-to-a-zone)

[`sh.addShardToZone()`](https://www.mongodb.com/docs/manual/reference/method/sh.addShardToZone/#mongodb-method-sh.addShardToZone)连接到[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例时使用方法将区域与特定分片 相关联。单个分片可能有多个区域，多个分片也可能有相同的区域。

>[EXAMPLE]
>
>以下示例将区域添加`NYC`到两个分片，并将区域 `SFO`和`NRT`添加到第三个分片：
>
>```shell
>sh.addShardToZone("shard0000", "NYC")
>sh.addShardToZone("shard0001", "NYC")
>sh.addShardToZone("shard0002", "SFO")
>sh.addShardToZone("shard0002", "NRT")
>```

[`sh.removeShardFromZone()`](https://www.mongodb.com/docs/manual/reference/method/sh.removeShardFromZone/#mongodb-method-sh.removeShardFromZone)您可以在连接到实例时 使用该方法从特定分片中删除区域 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，如以下示例所示，该示例`NRT`从分片中删除区域：

```shell
sh.removeShardFromZone("shard0002", "NRT")
```

**创建区域范围**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/manage-shard-zone/#create-a-zone-range)

要定义区域的分片键范围，请[`sh.updateZoneKeyRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.updateZoneKeyRange/#mongodb-method-sh.updateZoneKeyRange) 在连接到[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例时使用该方法。任何给定的分片键范围可能只有*一个*分配区域。您不能重叠定义的范围。

>[EXAMPLE]
>
>`users`给定一个在`records`数据库中命名的集合，按`zipcode`字段分片。以下操作分配：
>
>- `NYC`曼哈顿和布鲁克林区的两个邮政编码范围
>- 旧金山`SFO`特区的一系列邮政编码
>
>```shell
>sh.updateZoneKeyRange("records.users", { zipcode: "10001" }, { zipcode: "10281" }, "NYC")
>sh.updateZoneKeyRange("records.users", { zipcode: "11201" }, { zipcode: "11240" }, "NYC")
>sh.updateZoneKeyRange("records.users", { zipcode: "94102" }, { zipcode: "94135" }, "SFO")
>```

>[NOTE]
>
>- 区域范围始终包含下边界且不包含上边界。
>- 删除集合会删除其关联的区域/标签范围。

**删除区域范围**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/manage-shard-zone/#remove-a-zone-range)

使用 shell 帮助程序方法[`sh.removeRangeFromZone()`](https://www.mongodb.com/docs/manual/reference/method/sh.removeRangeFromZone/#mongodb-method-sh.removeRangeFromZone)从区域中删除范围。

>[EXAMPLE]
>
>以下示例删除了`NYC`曼哈顿内邮政编码范围的区域分配：
>
>```shell
>sh.removeRangeFromZone("records.user", {zipcode: "10001"}, {zipcode: "10281"})
>```

>[NOTE]
>
>删除集合会删除其关联的区域/标签范围。

**查看现有区域**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/manage-shard-zone/#view-existing-zones)

用于[`sh.status()`](https://www.mongodb.com/docs/manual/reference/method/sh.status/#mongodb-method-sh.status)列出与集群中每个分片关联的区域。您还可以通过查询 数据库[`shards`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.shards)中的集合来查看分片区域`config`。

以下示例使用该[`find()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find)方法返回该`NYC`区域的所有分片。

```shell
use config
db.shards.find({ tags: "NYC" })
```

您可以在数据库集合中找到所有[命名空间](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-namespace)的 区域范围。的输出还显示所有区域范围。[`tags`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.tags)`config`[`sh.status()`](https://www.mongodb.com/docs/manual/reference/method/sh.status/#mongodb-method-sh.status)

以下示例使用该[`find()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find)方法返回与区域关联的任何范围`NYC`。

```shell
use config
db.tags.find({ tag: "NYC" })
```

 参见

原文 - [Manage Shard Zones]( https://docs.mongodb.com/manual/tutorial/manage-shard-zone/ )

译者：景圣
