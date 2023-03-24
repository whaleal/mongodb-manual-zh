# 查看集群配置



## 列出启用了分片的数据库

列出启用了分片的数据库，请查询 Config 数据库中的`databases`集合。 如果`partitioned`字段的值为`true` ，则数据库已启用分片。`mongosh`连接 `mongos`实例并运行以下操作以获取启用了分片的数据库的完整列表：

```shell
use config
db.databases.find( { "partitioned": true } )
```

>## 例子
>
>您可以使用以下命令序列返回集群中所有数据库的列表：
>
>```shell
>use config
>db.databases.find()
>```
>
>
>
>如果这返回以下结果集：
>
>```shell
>{ "_id" : "test", "primary" : "shardB", "partitioned" : false }
>{ "_id" : "animals", "primary" : "shardA", "partitioned" : true }
>{ "_id" : "farms", "primary" : "shardA", "partitioned" : false }
>```
>
>
>
>那么只为`animals`数据库启用分片。





## 列出分片

要列出当前配置的分片集，请使用`listShards`命令，如下所示：

```shell
db.adminCommand( { listShards : 1 } )
```





## 查看集群详细信息

要查看集群详细信息，请发出`db.printShardingStatus()`或 `sh.status()`。 两种方法都返回相同的输出。

>## 例子
>
>### 在 sh.status() 的以下示例输出中
>
>- `sharding version`显示分片元数据的版本号。
>- `shards`显示在集群中用作分片的`mongod`实例列表。
>- `databases`显示集群中的所有数据库，包括没有启用分片的数据库。
>- `foo`数据库的`chunks`信息显示每个分片上有多少块，并显示每个块的范围。
>
>```
>--- Sharding Status ---
>  sharding version: {
>    "_id" : 1,
>    "minCompatibleVersion" : 5,
>    "currentVersion" : 6,
>    "clusterId" : ObjectId("59a4443c3d38cd8a0b40316d")
>  }
>  shards:
>    {  "_id" : "shard0000",  "host" : "m0.example.net:27018" }
>    {  "_id" : "shard0001",  "host" : "m3.example2.net:27018" }
>    {  "_id" : "shard0002",  "host" : "m2.example.net:27018" }
>  active mongoses:
>    "3.4.7" : 1
>  autosplit:
>    Currently enabled: yes
>   balancer:
>    Currently enabled:  yes
>    Currently running:  no
>    Failed balancer rounds in last 5 attempts:  0
>    Migration Results for the last 24 hours:
>       1 : Success
>  databases:
>    {  "_id" : "foo",  "partitioned" : true,  "primary" : "shard0000" }
>        foo.contacts
>            shard key: { "zip" : 1 }
>            unique: false
>            balancing: true
>            chunks:
>                shard0001    2
>                shard0002    3
>                shard0000    2
>            { "zip" : { "$minKey" : 1 } } -->> { "zip" : "56000" } on : shard0001 { "t" : 2, "i" : 0 }
>            { "zip" : 56000 } -->> { "zip" : "56800" } on : shard0002 { "t" : 3, "i" : 4 }
>            { "zip" : 56800 } -->> { "zip" : "57088" } on : shard0002 { "t" : 4, "i" : 2 }
>            { "zip" : 57088 } -->> { "zip" : "57500" } on : shard0002 { "t" : 4, "i" : 3 }
>            { "zip" : 57500 } -->> { "zip" : "58140" } on : shard0001 { "t" : 4, "i" : 0 }
>            { "zip" : 58140 } -->> { "zip" : "59000" } on : shard0000 { "t" : 4, "i" : 1 }
>            { "zip" : 59000 } -->> { "zip" : { "$maxKey" : 1 } } on : shard0000 { "t" : 3, "i" : 3 }
>    {  "_id" : "test",  "partitioned" : false,  "primary" : "shard0000" }
>```

原文 - https://docs.mongodb.com/manual/tutorial/view-sharded-cluster-configuration/

译者：陆文龙

