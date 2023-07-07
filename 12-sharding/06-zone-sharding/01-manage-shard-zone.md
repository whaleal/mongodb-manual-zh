# 管理分片区域 

在分片集群中，您可以创建代表一组分片的区域，并将一个或多个分片键值范围与该区域相关联。 MongoDB 仅将属于区域范围的读取和写入路由到区域内的那些分片。

> 提示:
>
> 通过在对空的或不存在的集合进行分片之前定义区域和区域范围，分片收集操作会为定义的区域范围创建块以及任何其他块以覆盖分片键值的整个范围，并执行初始操作 基于区域范围的块分布。 块的初始创建和分配允许更快地设置分区分片。 初始分配后，平衡器管理后续的块分配。

### 将分片添加到区域

[`sh.addShardToZone()`](https://www.mongodb.com/docs/v4.4/reference/method/sh.addShardToZone/#mongodb-method-sh.addShardToZone)连接到实例时，使用该方法将区域与特定分片关联 [`mongos`](https://www.mongodb.com/docs/v4.4/reference/program/mongos/#mongodb-binary-bin.mongos) 。单个分片可能有多个可用区，多个分片也可能有相同的可用区。

> 例子:
>
> 以下示例将区域添加到两个分片，并将`NYC`区域 添加到第三个分片：`SFO``NRT`
>
> ```
> sh.addShardToZone("shard0000", "NYC")
> sh.addShardToZone("shard0001", "NYC")
> sh.addShardToZone("shard0002", "SFO")
> sh.addShardToZone("shard0002", "NRT")
> ```

[`sh.removeShardFromZone()`](https://www.mongodb.com/docs/v4.4/reference/method/sh.removeShardFromZone/#mongodb-method-sh.removeShardFromZone)您可以在连接到实例时 使用该方法从特定分片中删除区域 [`mongos`](https://www.mongodb.com/docs/v4.4/reference/program/mongos/#mongodb-binary-bin.mongos)，如下例所示，该示例`NRT`从分片中删除区域：

```
sh.removeShardFromZone("shard0002", "NRT")
```

## 创建区域范围

要定义区域的分片键范围，请[`sh.updateZoneKeyRange()`](https://www.mongodb.com/docs/v4.4/reference/method/sh.updateZoneKeyRange/#mongodb-method-sh.updateZoneKeyRange) 在连接到[`mongos`](https://www.mongodb.com/docs/v4.4/reference/program/mongos/#mongodb-binary-bin.mongos)实例时使用该方法。任何给定的分片键范围只能有*一个*分配的区域。您不能重叠定义的范围。

> 例子:
>
> `users`给定一个在数据库中命名的集合`records`，按`zipcode`字段进行分片。以下操作分配：
>
> 给定记录数据库中名为 users 的集合，按邮政编码字段进行分片。以下操作分配：
>
> * `NYC`曼哈顿和布鲁克林区域的两个邮政编码范围
> * `SFO`旧金山地区的一系列邮政编码
>
> ```
> sh.updateZoneKeyRange("records.users", { zipcode: "10001" }, { zipcode: "10281" }, "NYC")
> sh.updateZoneKeyRange("records.users", { zipcode: "11201" }, { zipcode: "11240" }, "NYC")
> sh.updateZoneKeyRange("records.users", { zipcode: "94102" }, { zipcode: "94135" }, "SFO")
> ```

> 笔记:
>
> - 区域范围始终包含下边界且不包含上边界。
> - 删除集合会删除其关联的区域/标签范围。

## 删除区域范围

*3.4版中的新增功能*： 使用 shell 辅助方法[`sh.removeRangeFromZone()`](https://www.mongodb.com/docs/v4.4/reference/method/sh.removeRangeFromZone/#mongodb-method-sh.removeRangeFromZone)从区域中删除范围。

> 例子:
>
> 以下示例删除`NYC`曼哈顿内邮政编码范围的区域分配：
>
> ```
> sh.removeRangeFromZone("records.user", {zipcode: "10001"}, {zipcode: "10281"})
> ```

> 笔记:
>
> 删除集合会删除其关联的区域/标签范围。

## 查看现有区域

用于[`sh.status()`](https://www.mongodb.com/docs/v4.4/reference/method/sh.status/#mongodb-method-sh.status)列出与集群中每个分片关联的区域。[`shards`](https://www.mongodb.com/docs/v4.4/reference/config-database/#mongodb-data-config.shards)您还可以通过查询数据库中的集合来查看分片区域 `config`。

以下示例使用该[`find()`](https://www.mongodb.com/docs/v4.4/reference/method/db.collection.find/#mongodb-method-db.collection.find)方法返回该`NYC`区域的所有分片。

```
use config
db.shards.find({ tags: "NYC" })
```

以下示例使用该[`find()`](https://www.mongodb.com/docs/v4.4/reference/method/db.collection.find/#mongodb-method-db.collection.find)方法返回与该`NYC`区域关联的任何范围。

```
use config
db.tags.find({ tag: "NYC" })
```









译者：韩鹏帅

原文 - [Manage Shard Zones]( https://docs.mongodb.com/manual/tutorial/manage-shard-zone/ )

