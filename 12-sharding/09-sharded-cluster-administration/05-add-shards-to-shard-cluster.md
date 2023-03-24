# 将分片添加到集群

在创建集群后或任何需要向集群添加容量的时候，将分片添加到分片集群。如果您尚未创建分片集群，请参阅部署分片集群。

在生产环境中，所有分片都应该是副本集。

## 注意事项

### 平衡

将分片添加到分片集群时，会影响 所有现有分片集合的集群分片之间的块平衡。平衡器将开始迁移块，以便集群达到平衡。

块迁移会对磁盘空间产生影响，因为默认情况下源分片会自动归档迁移的文档。

### 容量规划

将分片添加到集群时，始终确保集群有足够的容量来支持平衡集群所需的迁移，而不会影响合法的生产流量。

## 将分片添加到集群

您通过连接到`mongos` 实例与分片集群进行交互。

1. 使用`mongosh` 连接到`mongos` 实例。例如，如果 `mongos`可在 `mongos0.example.net`端口 上访问`27017`，请发出以下命令：

   ```shell
   mongosh --host mongos0.example.net --port 27017
   ```

   

2. 使用方法将分片添加到集群`sh.addShard()` ，如下面的示例所示。`sh.addShard()`为每个分片单独添加。如果分片是副本集，则指定副本集的名称并指定副本集的节点。在生产部署中，所有分片都应该是副本集。

   >## 笔记
   >
   >您可以改为使用`addShard`database 命令，该命令允许您指定分片的名称和最大大小。如果您不指定这些，MongoDB 会自动分配一个名称和最大大小。

   

   以下是使用`sh.addShard()`添加分片的示例 ：

   - 添加一个IP为`mongodb0.example.net`在`27018`端口上运行命名为`rs1`的副本集分片，请使用以下命令：

     ```shell
     sh.addShard( "rs1/mongodb0.example.net:27018" )
     ```

     

   - 要添加IP为`mongodb0.example.net`在`27018`端口上运行的独立`mongod`分片 ，请使用以下命令：

     ```shell
     sh.addShard( "mongodb0.example.net:27018" )
     ```

     

   >## 笔记
   >
   >块迁移到新分片可能需要一些时间。

   

原文 - https://docs.mongodb.com/manual/tutorial/add-shards-to-shard-cluster/

译者：陆文龙
