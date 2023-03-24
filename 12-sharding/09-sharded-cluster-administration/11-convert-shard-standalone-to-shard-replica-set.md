# 将独立分片转换为分片副本集

从 MongoDB 3.6 开始，所有分片都必须是副本集。在将 3.4 分片集群升级到 3.6 版之前，您必须将任何作为独立`mongod`实例运行的分片转换为副本集分片。

本教程描述了将独立分片转换为分片副本集的过程。该过程特定于独立分片。要仅将独立转换为副本集（即不属于任何分片集群的一部分），请参阅 将独立转换为副本集。

## 程序



>## 重要的
>
>以下过程将独立分片转换为单节点副本集分片。该过程假定单节点在与以前相同的主机和端口上运行。



1. 关闭分片`mongod`单实例。

2. 使用指定新副本集名称的`--replSet`选项重新启动分片实例。确保名称是不同的（例如，您可以使用`shard name`作为副本集名称）；特别是，分片副本集不能使用与配置服务器副本集相同的名称。

   其他选项可以保持不变。

   例如，以下命令启动一个独立实例作为名为`shardA`的新副本集的节点。其他选项与之前相同；例如`--dbpath`指定standalone的现有数据库路径`/srv/mongodb/db0` 并且`--port`之前一样：

   ```shell
   mongod --port 27018 --dbpath /srv/mongodb/db0 --shardsvr --replSet shardA --bind_ip localhost,<ip address of the mongod host>
   ```

   

3. 使用`mongosh`连接到分片`mongod`实例。

4. 使用`rs.initiate()`初始化新的副本集：

   ```shell
   rs.initiate()
   ```

   

   副本集现在可以运行了。要查看副本集配置，请使用`rs.conf()`. 要检查副本集的状态，请使用`rs.status()`.

5. 断开与实例的连接。

6. 使用`mongosh`连接到分片集群的`mongos`实例之一 并检索分片信息：

   ```shell
   var myShard = db.getSiblingDB("config").shards.findOne( { _id: "<name>"} )
   ```

   

   替换`<name>`为分片的名称。分片的名称`<name>`与分片副本集名称分开（除非您使用分片名称作为副本集名称）。要检索分片的名称，请参阅`shards`和`sh.status()`方法结果中的部分。例如，如果`sh.status()`输出结果包括以下分片部分，则两个分片的名称分别为`"shard0000"`和 `"shard0001"`：

   ```shell
   shards:
         {  "_id" : "shard0000",  "host" : "mongodb1.example.net:27018",  "state" : 1 }
         {  "_id" : "shard0001",  "host" : "mongodb2.example.net:27018",  "state" : 1 }
   ```

   

7. 更新副本集`host`信息：

   ```shell
   myShard.host = "<replica-set>/<member>"
   ```

   

   `<replica-set>`替换副本集的名称。替换 `<member>`为副本集节点。例如 `shardA/mongodb1.example.net:27018`。

8. 保存信息。

   ```shell
   db.getSiblingDB("config").shards.save(myShard, { writeConcern: { w: "majority" } } )
   ```

   

9. 对分片集群中的下一个独立分片重复此操作。确保为每个分片副本集使用不同的名称。

10. 完成将分片独立实例转换为分片副本集后，强制分片集群的成员通过重新启动分片集群的所有成员来更新他们对其他分片连接字符串的了解：

    - 配置服务器副本集
    - `mongos`实例
    - 分片副本集

## 附加信息

要将成节点添加到此副本集，请使用`rs.add()`方法。有关将节点添加到副本集的更多信息，请参阅 将成员添加到副本集。

要将非分片独立转换为非分片副本集，请参阅 将独立转换为副本集。

原文 -  https://docs.mongodb.com/manual/tutorial/convert-shard-standalone-to-shard-replica-set/ 

译者：陆文龙

