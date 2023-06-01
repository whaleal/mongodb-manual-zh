# 从现有分片集群中删除分片

要删除分片，您必须确保分片的数据已迁移到集群中的其余分片。此过程描述了如何安全地迁移数据以及如何删除分片。

当您在块分布不均匀的集群中删除分片时，平衡器首先从耗尽分片中删除块，然后平衡剩余的不均匀块分布。

此过程描述如何从集群中删除分片。 *不要*使用此过程将整个集群迁移到新硬件。

要删除分片，使用`mongosh`连接到集群的一个`mongos`实例。然后使用本文档中的任务序列从集群中删除分片。

## 注意事项

- 分片删除可能会导致打开的更改流游标关闭，并且关闭的更改流游标可能无法完全恢复。
- 您可以在分片移除过程中安全地重启集群。如果您在正在进行的耗尽过程中重新启动集群，则耗尽会在集群组件重新启动后自动继续。 MongoDB 在 config.shards 集合中记录分片耗尽状态。



## 确保平衡器进程已启用

要成功地从分片迁移数据，**必须**启用平衡器进程 。在`mongosh`使用`sh.getBalancerState()`检查平衡器状态 .



## 确定要删除的分片的名称

要确定分片的名称，请使用`mongosh`连接到一个`mongos`实例或者：

- 使用`listShards`命令，如下所示：

  ```shell
  db.adminCommand( { listShards: 1 } )
  ```

  

- 运行`sh.status()`方法或者 `db.printShardingStatus()`。

`shards._id`字段列出了每个分片的名称。



## 从分片中删除块

从`admin`数据库中运行`removeShard`命令。这开始将块从您要删除的分片“排出”到集群中的其他分片。例如，对于名为`mongodb0`的分片，运行：

```shell
db.adminCommand( { removeShard: "mongodb0" } )
```



[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)将 `removeShard`命令的 write concern转换为`"majority"`

此操作返回以下响应：

```shell
{
   "msg" : "draining started successfully",
   "state" : "started",
   "shard" : "mongodb0",
   "note" : "you need to drop or movePrimary these databases",
   "dbsToMove" : [
      "fiz",
      "buzz"
   ],
   "ok" : 1,
   "operationTime" : Timestamp(1575398919, 2),
   "$clusterTime" : {
      "clusterTime" : Timestamp(1575398919, 2),
      "signature" : {
         "hash" : BinData(0,"Oi68poWCFCA7b9kyhIcg+TzaGiA="),
         "keyId" : NumberLong("6766255701040824328")
      }
   }
}
```



平衡器开始从命名`mongodb0` 的分片将块迁移到集群中的其他分片。这些迁移发生得很慢，以避免对整个集群造成过度的负载。根据您的网络容量和数据量，此操作可能需要几分钟到几天才能完成。

>## 笔记
>
>输出包括指示数据库的字段`dbsToMove`，如果有的话，分片是主分片。在从分片中排出所有块后，您必须`movePrimary`为数据库或者删除数据库（这将删除关联的数据文件）。





## 检查迁移状态

要检查过程中任何阶段的迁移进度，请 再次从`admin`数据库运行`removeShard`。例如，对于名为`mongodb0`的分片，运行：

```shell
db.adminCommand( { removeShard: "mongodb0" } )
```



[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)将`removeShard`命令的 write concren转换为`"majority"`

该命令返回类似于以下内容的输出：

```shell
{
   "msg" : "draining ongoing",
   "state" : "ongoing",
   "remaining" : {
      "chunks" : NumberLong(2),
      "dbs" : NumberLong(2),
      "jumboChunks" : NumberLong(0)         // Available starting in 4.2.2 (and 4.0.14)
   },
   "note" : "you need to drop or movePrimary these databases",
   "dbsToMove" : [
      "fizz",
      "buzz"
   ],
   "ok" : 1,
   "operationTime" : Timestamp(1575399086, 1655),
   "$clusterTime" : {
      "clusterTime" : Timestamp(1575399086, 1655),
      "signature" : {
         "hash" : BinData(0,"XBrTmjMMe82fUtVLRm13GBVtRE8="),
         "keyId" : NumberLong("6766255701040824328")
      }
   }
}
```



在输出中，该`remaining`字段包括以下字段：

| 场地          | 描述                                                         |
| :------------ | :----------------------------------------------------------- |
| `chunks`      | 当前保留在分片上的块总数。                                   |
| `dbs`         | 主分片为分片的数据库总数。这些数据库在输出字段中指定`dbsToMove`。 |
| `jumboChunks` | 对于`chunks`总数而言，其数量是巨大的。如果`jumboChunks`大于0，等到 分片上只剩下`jumboChunks`。一旦只剩下`jumbo`块，您必须在耗尽完成之前手动清除jumbo标志。`jumbo`标志清除后，平衡器可以迁移这些块。但是，如果修改正在迁移的任何文档的写入队列超过 500MB 内存，则迁移将失败。*从 4.2.2（和 4.0.14）开始可用* |

继续检查命令的状态`removeShard`，直到剩余的块数为`0`

```shell
db.adminCommand( { removeShard: "mongodb0" } )
```





## 将数据库移动到另一个主分片

如果分片是集群中一个或多个数据库的主分片，则必须使该数据库使用不同的分片作为其主分片。removeShard 在命令输出的 dbsToMove 字段中列出您需要移动的所有数据库。 如果分片不是任何数据库的主分片，请跳到下一个任务，
完成迁移。

要将数据库移动到另一个分片，请使用`movePrimary`命令。

>## 重要的
>
>为保证顺利迁移，运行`movePrimary`前请参考`movePrimary` 命令文档中的注意事项。



要将`fizz`数据库从`mongodb0`迁移到`mongodb1`，请发出以下命令：

```shell
db.adminCommand( { movePrimary: "fizz", to: "mongodb1" })
```



`mongos`使用`"majority"` write concern 对于`movePrimary`。

直到 MongoDB 完成移动所有数据，此命令才会返回。此命令的响应将类似于以下内容：

```
{
   "ok" : 1,
   "operationTime" : Timestamp(1575400369, 9),
   "$clusterTime" : {
   "clusterTime" : Timestamp(1575400369, 9),
   "signature" : {
      "hash" : BinData(0,"2Nz8QCcVXB0LJLm1hsXfpTCaM0M="),
      "keyId" : NumberLong("6766255701040824328")
   }
}
}
```



### 使用`movePrimary`移动未分片的集合

*对于 MongoDB 4.2 及之前的版本，如果在包含未分片*集合的 数据库上使用`movePrimary`命令，则必须执行以下附加步骤。

>## 笔记
>
>在移动包含未分片集合的数据库时，MongoDB 4.4 不需要这些额外的步骤。



- 对于**MongoDB 4.2**，您必须：
  - 重启所有`mongos`实例**和**所有 `mongod`分片节点（包括从节点）；
  - `flushRouterConfig`在将任何数据读取或写入任何已移动的未分片集合之前，请在所有 `mongos`]实例和所有`mongod`分片节点（包括从节点）上使用该命令。
- 对于**MongoDB 4.0 及更早版本**，您必须：
  - 重启所有`mongos`实例；
  - 在将任何数据读取或写入任何已移动的未分片集合之前，请在所有`mongos`实例上使用`flushRouterConfig`命令。

这些步骤确保所有集群节点刷新它们的元数据缓存，其中包括主分片的位置。否则，您可能会在读取时丢失数据，并且可能无法将数据写入正确的分片。要恢复，您必须手动干预。



## 完成迁移

要清除所有元数据信息并完成删除，请 再次运行`removeShard`。例如，对于名为`mongodb0`的分片 ，运行：

```shell
db.adminCommand( { removeShard: "mongodb0" } )
```



`mongos `将 `removeShard `命令的write concern转换为`“majority”`。



完成时出现一条成功消息：

```shell
{
    "msg" : "removeshard completed successfully",
    "state" : "completed",
    "shard" : "mongodb0",
    "ok" : 1,
    "operationTime" : Timestamp(1575400370, 2),
    "$clusterTime" : {
       "clusterTime" : Timestamp(1575400370, 2),
       "signature" : {
          "hash" : BinData(0,"JjSRciHECXDBXo0e5nJv9mdRG8M="),
          "keyId" : NumberLong("6766255701040824328")
       }
    }
}
```



一旦该`state`字段的值为“完成”，您就可以安全地停止组成`mongodb0`分片的实例。







原文 - https://docs.mongodb.com/manual/tutorial/remove-shards-from-cluster/

译者：陆文龙

