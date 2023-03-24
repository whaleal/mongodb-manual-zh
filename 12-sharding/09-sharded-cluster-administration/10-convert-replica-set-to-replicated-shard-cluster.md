# 将副本集转换为分片集群

## 概述[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/convert-replica-set-to-replicated-shard-cluster/#overview)

本教程将单个三节点副本集转换为具有两个分片的分片集群。每个分片都是一个独立的三节点副本集。本教程特定于 MongoDB 6.0。其他版本的MongoDB请参考对应版本的MongoDB手册。

程序如下：

1. 创建初始的三节点副本集并将数据插入集合中。
2. 启动配置服务器和一个`mongos`. 
3. 将初始副本集添加为分片。
4. 创建第二个分片并添加到集群中。
5. 分片所需的集合。

## 注意事项

这些过程中的各个步骤会注明何时会发生停机。



>## 重要的
>
>这些过程会导致您的部署出现一些停机时间。



## 先决条件

本教程一共使用了十台服务器：一台服务器用于`mongos`,第一副本集、第二副本集和配置服务器副本集各三台服务器。

每个服务器在您的系统中都必须有一个可解析的域、主机名或 IP 地址。

本教程使用默认数据目录（例如`/data/db`和 `/data/configdb`）。创建具有适当权限的适当目录。

## 程序



### 设置初始副本集

此过程创建初始的三成节点副本集`rs0`。副本集节点位于以下主机上： `mongodb0.example.net`、`mongodb1.example.net`和 `mongodb2.example.net`。



#### 1.使用适当的选项启动副本集的每个成员。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/convert-replica-set-to-replicated-shard-cluster/#start-each-member-of-the-replica-set-with-the-appropriate-options)

对于每个节点，使用以下设置启动一个`mongod`实例：

- 设置`replication.replSetName`做为副本集名称。如果您的应用程序连接到多个副本集，则每个副本集必须具有不同的名称。
- 设置`net.bindIp`作为主机名/ip 或以逗号分隔的主机名/ips 列表。
- 根据您的部署设置任何其他设置。

在本教程中，三个`mongod`实例与以下主机关联：

| 副本集成员 | 主机名                 |
| :--------- | :--------------------- |
| 节点 0     | `mongodb0.example.net` |
| 节点1      | `mongodb1.example.net` |
| 节点2      | `mongodb2.example.net` |

以下示例通过`--replSet`和`--bind_ip`命令行选项指定副本集名称和 ip 绑定：



>## 警告
>
>在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。至少，考虑 启用身份验证和 [强化网络基础设施。

```shell
mongod --replSet "rs0" --bind_ip localhost,<hostname(s)|ip address(es)>
```



对于`<hostname(s)|ip address(es)>`，指定远程客户端（包括副本集的其他节点）可用于连接到`mongod`实例的实例的主机名和/或 IP 地址。

或者，您也可以在配置文件中指定`replica set name`和`ip addresses`：

```shell
replication:
   replSetName: "rs0"
net:
   bindIp: localhost,<hostname(s)|ip address(es)>
```

​	

，请使用`--config`选项指定配置文件的路径启动`mongod`：

```shell
mongod --config <path-to-config>
```



在生产部署中，您可以配置一个初始化脚本 来管理这个过程。Init 脚本超出了本文档的范围。



#### 2.连接`mongosh`到其中一个`mongod`实例。

从其中一个`mongod`正在运行的同一台机器上（在本教程中，`mongodb0.example.net`），启动 `mongosh`。 要连接到`mongod`默认端口上的侦听本地主机`27017`：

```shell
mongosh
```



根据您的路径，您可能需要指定`mongosh`二进制文件路径 。

如果您`mongod`未在默认端口上运行，请指定`mongosh`的 `--port`的选项。



#### 3.启动副本集。

从`mongosh`运行`rs.initiate()`在副本集节点 0 上运行。



>## 重要的
>
>*仅*在副本集的一个 `mongod`实例上运行`rs.initiate()`。



>## 重要的
>
>为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集成员或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。
>
>使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。



```shell
rs.initiate( {
   _id : "rs0",
   members: [
      { _id: 0, host: "mongodb0.example.net:27017" },
      { _id: 1, host: "mongodb1.example.net:27017" },
      { _id: 2, host: "mongodb2.example.net:27017" }
   ]
})
```



MongoDB 使用默认副本集配置启动副本集。



#### 4.创建并填充新集合。

以下步骤将一百万条数据添加到`test_collection`集合中 ，可能需要几分钟时间，具体取决于您的系统。

要确定主节点，用`rs.status()`命令。

在副本集的主节点上执行以下操作：

```shell
use test
var bulk = db.test_collection.initializeUnorderedBulkOp();
people = ["Marc", "Bill", "George", "Eliot", "Matt", "Trey", "Tracy", "Greg", "Steve", "Kristina", "Katie", "Jeff"];
for(var i=0; i<1000000; i++){
   user_id = i;
   name = people[Math.floor(Math.random()*people.length)];
   number = Math.floor(Math.random()*10001);
   bulk.insert( { "user_id":user_id, "name":name, "number":number });
}
bulk.execute(); 
```



### 部署配置服务器副本集和`mongos`

此过程为配置服务器和 `mongos`.

- 配置服务器使用以下主机：`mongodb7.example.net`、 `mongodb8.example.net`和`mongodb9.example.net`。
- `mongos`用`mongodb6.example.net`。



#### 1.将配置服务器部署为三成员副本集。

在`mongodb7.example.net`、 `mongodb8.example.net`和`mongodb9.example.net`上启动配置服务器。指定相同的副本集名称。配置服务器使用默认数据目录`/data/configdb`和默认端口`27019`。



>## 警告
>
>在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。至少，考虑 启用身份验证和 强化网络基础设施。

```shell
mongod --configsvr --replSet configReplSet --bind_ip localhost,<hostname(s)|ip address(es)>
```



要修改默认设置或包含特定于您的部署的其他选项，请参阅`mongod`或 配置文件选项。

连接`mongosh`到其中一个配置服务器并运行`rs.initiate()`以启动副本集。



>## 重要的
>
>*仅*在副本集的一个`mongod`实例`rs.initiate()`上运行。 



>## 重要的
>
>为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集成员或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。
>
>使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。



```shell
rs.initiate( {
   _id: "configReplSet",
   configsvr: true,
   members: [
      { _id: 0, host: "mongodb07.example.net:27019" },
      { _id: 1, host: "mongodb08.example.net:27019" },
      { _id: 2, host: "mongodb09.example.net:27019" }
   ]
} )
```



#### 2.启动一个`mongos`实例。

`mongodb6.example.net`，运行`mongos`指定配置服务器副本集名称，后跟斜杠`/`和至少一个配置服务器主机名和端口。

```shell
mongos --configdb configReplSet/mongodb07.example.net:27019,mongodb08.example.net:27019,mongodb09.example.net:27019  --bind_ip localhost,<hostname(s)|ip address(es)>
```



### 将副本集重新启动为分片

对于分片集群，分片的`mongod`实例**必须**通过配置文件设置 `sharding.clusterRole`或通过命令行选项`--shardsvr` 将其角色明确指定为 `shardsvr`。



>## 笔记
>
>`mongod`具有该角色的实例的默认端口`shardsvr` 是`27018`。要使用不同的端口，请指定 `net.port`设置或`--port`选项。



#### 1.确定主要成员和次要成员。

连接`mongosh`到其中一个节点并运行 `rs.status()`以确定主节点和从节点。



#### 2.使用`--shardsvr`选项重新启动从节点。

一次启动一个从节点， 使用`--shardsvr`选项关闭并重新启动每个从节点。



>## 警告
>
>对于连接到副本集的从节点的应用程序，此步骤需要一些停机时间。连接到从节点的应用程序在重新启动辅助设备后可能会出错`CannotVerifyAndSignLogicalTime`，直到您执行中的步骤 添加初始副本集作为分片. 重新启动您的应用程序也将阻止它接收`CannotVerifyAndSignLogicalTime` 错误。



要继续使用同一端口，请包含该`--port`选项。根据您的部署情况包括其他选项，例如`--bind_ip`。

>
>
>## 警告
>
>在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 安全清单。至少，考虑 启用身份验证和 强化网络基础设施.

```shell
mongod --replSet "rs0" --shardsvr --port 27017 --bind_ip localhost,<hostname(s)|ip address(es)>

```



包括适合您的部署的任何其他选项。对另一个次级重复此步骤。



#### 3.降级主节点。

连接`mongosh`到主节点并降级主节点。



>## 警告
>
>此步骤需要一些停机时间。在执行以下步骤之前，应用程序添加初始副本集作为分片可能会出现错误`CannotVerifyAndSignLogicalTime`,  重新启动您的应用程序也将阻止它接收 `CannotVerifyAndSignLogicalTime`错误。



```shell
rs.stepDown()
```



#### 4.使用该`--shardsvr`选项重新启动主节点。

关闭主节点并使用`--shardsvr`选项重新启动。

要继续使用同一端口，请包含该`--port`选项。

```shell
mongod --replSet "rs0" --shardsvr --port 27017 --bind_ip localhost,<hostname(s)|ip address(es)>

```



包括适合您的部署的任何其他选项。

​	

### 添加初始副本集作为分片

以下过程将初始副本集添加`rs0`为分片。



#### 1.`mongosh`连接到`mongos`.

```shell
mongosh mongodb6.example.net:27017/admin
```





#### 2.添加分片。

使用以下方法将分片添加到集群,`sh.addShard()`：

```shell
sh.addShard( "rs0/mongodb0.example.net:27017,mongodb1.example.net:27017,mongodb2.example.net:27017" )
```



>## 警告
>
>一旦新分片处于活动状态，`mongosh`其他客户端必须 **始终**连接到该`mongos`实例。不要直接连接到`mongod`实例。如果您的客户端直接连接到分片，则可能会造成数据或元数据不一致。



### 添加第二个分片

以下过程为第二个分片部署一个新的副本集`rs1`并将其添加到集群中。副本集节点位于以下主机上：`mongodb3.example.net`、 `mongodb4.example.net`和`mongodb5.example.net`。

对于分片集群，分片的`mongod`实例**必须**通过配置文件设置`sharding.clusterRole`或通过命令行选项`--shardsvr`将其角色明确指定为 `shardsvr`。



>## 笔记
>
>`mongod`具有该角色的实例的默认端口`shardsvr` 是`27018`。要使用不同的端口，请指定 `net.port`设置或`--port`选项。



#### 1.使用适当的选项启动副本集的每个节点。

对于每个节点，启动一个`mongod`，通过`--replSet`选项指定副本集名称，并使用`--shardsvr`选项指定其作为分片的角色 。根据需要指定其他选项，例如`--bind_ip`。



>## 警告
>
>在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。至少，考虑启用身份验证和强化网络基础设施。



```shell
mongod --replSet "rs1" --shardsvr --port 27017 --bind_ip localhost,<hostname(s)|ip address(es)>

```



对`rs1`副本集的其他两个节点重复此步骤。



#### 2.连接`mongosh`到副本集节点。

连接`mongosh`到副本集的*一个*节点（例如`mongodb3.example.net`）

```shell
mongosh mongodb3.example.net
```



#### 3.启动副本集。

在`mongosh`，运行`rs.initiate()`以启动由当前节点组成的副本集。

>## 重要的
>
>*仅*在副本集的一个`mongod`实例`rs.initiate()`上运行。 



>## 重要的
>
>为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集成员或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。
>
>使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。



```shell
rs.initiate( {
   _id : "rs1",
   members: [
       { _id: 0, host: "mongodb3.example.net:27017" },
       { _id: 1, host: "mongodb4.example.net:27017" },
       { _id: 2, host: "mongodb5.example.net:27017" }
   ]
})
```



#### 4.在`mongosh`连接到`mongos`.

```shell
mongosh mongodb6.example.net:27017/admin
```



#### 5.添加分片。

使用`mongosh`连接到 `mongos`时，使用`sh.addShard()`方法将分片添加到集群 ：

```shell
sh.addShard( "rs1/mongodb3.example.net:27017,mongodb4.example.net:27017,mongodb5.example.net:27017" )
```



### 分片集合



#### 1.使用`mongosh`连接到`mongos`.

```shell
mongosh mongodb6.example.net:27017/admin
```



#### 2.确定分片键。

对于要分片的集合，确定分片键。分片键决定 MongoDB 如何在分片之间分发文档。好的分片键：

- 具有在所有文档中均匀分布的值，
- 将经常同时访问的文档分组为连续的块，并且
- 允许在分片之间有效分配活动。

此过程将使用`number`字段作为`test_collection`的分片键 。



#### 3.在分片键上创建索引。

在对非空集合进行分片之前，在分片键上创建索引。

```shell
use test
db.test_collection.createIndex( { number : 1 } )
```



#### 4.分片集合。

在`test`数据库中，将`test_collection`分片，指定`number`字段为分片键。

```shell
use test
sh.shardCollection( "test.test_collection", { "number" : 1 } )
```



`mongos` 的 writr concren `"majority"`用于`shardCollection` 命令及`sh.shardCollection()` 。

该方法返回操作的状态：

```shell
{ "collectionsharded" : "test.test_collection", "ok" : 1 }
```



平衡器在下次运行时重新分配文档块。当客户端将其他文档插入此集合时，会将`mongos`文档路由到适当的分片。



#### 5.确认分片正在平衡。

要确认平衡活动，请在`test`数据库中运行`db.stats()`或 `db.printShardingStatus()`。

```shell
use test
db.stats()
db.printShardingStatus()
```



`db.stats()`的示例输出：

```shell
{
  "raw" : {
      "rs0/mongodb0.example.net:27017,mongodb1.example.net:27017,mongodb2.example.net:27017" : {
         "db" : "test",
         "collections" : 1,
         "views" : 0,
         "objects" : 640545,
         "avgObjSize" : 70.83200339949052,
         "dataSize" : 45370913,
         "storageSize" : 50438144,
         "numExtents" : 0,
         "indexes" : 2,
         "indexSize" : 24502272,
         "ok" : 1,
         "$gleStats" : {
                     "lastOpTime" : Timestamp(0, 0),
                     "electionId" : ObjectId("7fffffff0000000000000003")
                  }
      },
      "rs1/mongodb3.example.net:27017,mongodb4.example.net:27017,mongodb5.example.net:27017" : {
         "db" : "test",
         "collections" : 1,
         "views" : 0,
         "objects" : 359455,
         "avgObjSize" : 70.83259935179647,
         "dataSize" : 25461132,
         "storageSize" : 8630272,
         "numExtents" : 0,
         "indexes" : 2,
         "indexSize" : 8151040,
         "ok" : 1,
         "$gleStats" : {
            "lastOpTime" : Timestamp(0, 0),
            "electionId" : ObjectId("7fffffff0000000000000001")
         }
         
      }
  },
  "objects" : 1000000,
  "avgObjSize" : 70,
  "dataSize" : 70832045,
  "storageSize" : 59068416,
  "numExtents" : 0,
  "indexes" : 4,
  "indexSize" : 32653312,
  "fileSize" : 0,
  "extentFreeList" : {
      "num" : 0,
      "totalSize" : 0
  },
  "ok" : 1
}
```



`db.printShardingStatus()`的示例输出：

```shell
--- Sharding Status ---
sharding version: {
   "_id" : 1,
   "minCompatibleVersion" : 5,
   "currentVersion" : 6,
   "clusterId" : ObjectId("5be0a488039b1964a7208c60")
}
shards:
   {  "_id" : "rs0",  "host" : "rs0/mongodb0.example.net:27017,mongodb1.example.net:27017,mongodb2.example.net:27017",  "state" : 1 }
   {  "_id" : "rs1",  "host" : "rs1/mongodb3.example.net:27017,mongodb4.example.net:27017,mongodb5.example.net:27017",  "state" : 1 }
active mongoses:
   "3.6.8" : 1
autosplit:
   Currently enabled: yes
balancer:
   Currently enabled:  yes
   Currently running:  yes
   Collections with active migrations: 
      test.test_collection started at Mon Nov 05 2018 15:16:45 GMT-0500
Failed balancer rounds in last 5 attempts:  0
Migration Results for the last 24 hours: 
   1 : Success
databases:
   {  "_id" : "test", "primary" : "rs0", "partitioned" : true }
      test.test_collection
            shard key: { "number" : 1 }
            unique: false
            balancing: true
            chunks:
               rs0   5
               rs1   1
            { "number" : { "$minKey" : 1 } } -->> { "number" : 1195 } on : rs1 Timestamp(2, 0) 
            { "number" : 1195 } -->> { "number" : 2394 } on : rs0 Timestamp(2, 1) 
            { "number" : 2394 } -->> { "number" : 3596 } on : rs0 Timestamp(1, 5) 
            { "number" : 3596 } -->> { "number" : 4797 } on : rs0 Timestamp(1, 6) 
            { "number" : 4797 } -->> { "number" : 9588 } on : rs0 Timestamp(1, 1) 
            { "number" : 9588 } -->> { "number" : { "$maxKey" : 1 } } on : rs0 Timestamp(1, 2)
```



第二次运行这些命令以证明块正在从`rs0`迁移到`rs1`.

原文 - https://docs.mongodb.com/manual/tutorial/convert-replica-set-to-replicated-shard-cluster/ 

译者：陆文龙



