# 部署分片集群

**概述**

本教程涉及创建一个新的分片集群，该集群由一个 `mongos`配置服务器副本集和两个分片副本集组成。

**注意事项**

**连通性**

分片集群的每个节点都必须能够连接到集群中的*所有*其他节点。这包括所有分片和配置服务器。确保网络和安全系统（包括所有接口和防火墙）允许这些连接。

**主机名和配置**

>[IMPORTANT]
>
>为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集成员或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。
>
>使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

**本地主机部署**

如果您使用其中一个`localhost`或其 IP 地址作为任何主机标识符的主机名部分，则*必须*将该标识符用作集群中任何其他 MongoDB 组件的主机设置。

例如，该`sh.addShard()`方法采用`host` 目标分片的主机名作为参数。如果设置`host`为 `localhost`，则必须`localhost`用作集群中所有其他分片的主机。

**安全**

本教程不*包括配置*Internal/Membership Authentication或 Role-Based Access Control所需的步骤 。

在生产环境中，分片集群应至少采用x.509安全性来进行内部身份验证和客户端访问。

**程序**

**创建配置服务器副本集**

以下步骤部署配置服务器副本集。

对于生产部署，部署一个至少包含三节点的配置服务器副本集。出于测试目的，您可以创建单节点副本集。

>[NOTE]
>
>配置服务器副本集不得使用与任何分片副本集相同的名称。

对于本教程，配置服务器副本集节点与以下主机相关联：

| 配置服务器副本集节点 | 主机名             |
| :------------------- | :----------------- |
| 节点 0               | `cfg1.example.net` |
| 节点1                | `cfg2.example.net` |
| 节点2                | `cfg3.example.net` |

1. **启动配置服务器副本集的每个节点**。

   启动*each* `mongod`时，通过配置文件或命令行指定`mongod`设置。

   **配置文件**

   如果使用配置文件，请设置：

   ```yaml
   sharding:
     clusterRole: configsvr
   replication:
     replSetName: <replica set name>
   net:
     bindIp: localhost,<hostname(s)|ip address(es)>
   ```

   - `sharding.clusterRole`到`configsvr`,

   - `replication.replSetName`到配置服务器副本集的所需名称，

   - `net.bindIp`远程客户端（包括配置服务器副本集的其他成员以及分片集群的其他成员）可以用来连接到实例的主机名/IP 地址或以逗号分隔的主机名或 IP 地址列表的选项。

     >[WARNING]
     >
     >在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 安全清单。至少，考虑 启用身份验证和 强化网络基础设施。

   - 适用于您的部署的其他设置，例如 `storage.dbPath`和`net.port`。

   使用`--config`的选项设置为配置文件路径启动`mongod`。

   ```shell
   mongod --config <path-to-config-file>
   ```

   **命令行**

   如果使用命令行选项，请使用 `--configsvr`、`--replSet`、`--bind_ip` 和其他适合您的部署的选项启动 `mongod`。 例如：

   >[WARNING]
   >
   >在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。至少，考虑 启用身份验证和 强化网络基础设施。

   ```shell
   mongod --configsvr --replSet <replica set name> --dbpath <path> --bind_ip localhost,<hostname(s)|ip address(es)>
   ```

   

2. **连接到其中一个配置服务器**。

   连接`mongosh`给配置服务器成员之一。

   ```shell
   mongosh --host <hostname> --port <port>
   ```

3. **启动副本集**。

   从`mongosh`, 运行该`rs.initiate()`方法。

   `rs.initiate()`可以带一个可选的副本集配置文件。在 副本集配置文档中，包括：

   - `_id`设置为`replication.replSetName`或`--replSet`选项中指定的副本集名称。
   - 配置服务器副本集的`configsvr`字段设置为`true`。
   - 每个副本集成员都有一个文档的`members`数组。

   >[IMPORTANT]
   >
   >仅在副本集的*一个*`mongod`实例上运行`rs.initiate()`。 

   ```shell
   rs.initiate(
     {
       _id: "myReplSet",
       configsvr: true,
       members: [
         { _id : 0, host : "cfg1.example.net:27019" },
         { _id : 1, host : "cfg2.example.net:27019" },
         { _id : 2, host : "cfg3.example.net:27019" }
       ]
     }
   )
   ```

   有关副本集配置文档的更多信息，请参阅副本集配置。

   配置服务器副本集 (CSRS) 启动并启动后，继续创建分片副本集。

**创建分片副本集**

对于生产部署，请使用至少包含三个节点的副本集。出于测试目的，您可以创建单节点副本集。

>[NOTE]
>
>分片副本集不能使用与配置服务器副本集相同的名称。

对于每个分片，使用以下步骤创建分片副本集：

1. **启动分片副本集的每个节点**。

   启动*each* `mongod`时，通过配置文件或命令行指定`mongod`设置。

   配置文件

   如果使用配置文件，请设置：

   ```yaml
   sharding:
       clusterRole: shardsvr
   replication:
       replSetName: <replSetName>
   net:
       bindIp: localhost,<ip address>
   ```

   - `replication.replSetName`到副本集的所需名称，

   - `sharding.clusterRole`选择`shardsvr`，

   - `net.bindIp`远程客户端（包括配置服务器副本集的其他成员以及分片集群的其他节点）可以用来连接到实例的 ip 选项或逗号分隔的 ips 列表。

     >[WARNING]
     >
     >在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。至少，考虑 启用身份验证和 强化网络基础设施。

   - 适用于您的部署的其他设置，例如 `storage.dbPath`和`net.port`。

   使用`--config`的选项设置配置文件路径启动`mongod`。

   ```shell
   mongod --config <path-to-config-file>
   ```

   **命令行**

   如果使用命令行选项，请使用 `--replSet`、`--shardsvr`、`--bind_ip` 选项以及适合您的部署的其他选项启动 `mongod`。 例如：

   ```shell
   mongod --shardsvr --replSet <replSetname>  --dbpath <path> --bind_ip localhost,<hostname(s)|ip address(es)>
   ```

   

2. **连接到分片副本集的一个节点**。

   连接`mongosh`到副本集节点之一。

   ```shell
   mongosh --host <hostname> --port <port>
   ```

3. **启动副本集**。

   从`mongosh`, 运行该`rs.initiate()`方法。

   `rs.initiate()`可以带一个可选的副本集配置文件。在 副本集配置文档]中，包括：

   - 该`_id`字段设置为`replication.replSetName`或 `--replSet`选项中指定的副本集名称。
   - 每个副本集节点都有一个文档的`members`数组。

   以下示例启动一个三节点副本集。

   >[IMPORTANT]
   >
   >仅在副本集的*一个 `mongod`*实例上运行`rs.initiate()`。

   ```shell
   rs.initiate(
     {
       _id : "myReplSet",
       members: [
         { _id : 0, host : "s1-mongo1.example.net:27018" },
         { _id : 1, host : "s1-mongo2.example.net:27018" },
         { _id : 2, host : "s1-mongo3.example.net:27018" }
       ]
     }
   )
   ```

**为 Sharded Cluster启动一个`mongos`**

`mongos`使用配置文件或命令行参数启动以指定配置服务器。

**配置文件**

如果使用配置文件，请将 `sharding.configDB`配置服务器副本集名称和副本集的至少一个节点设置为 `<replSetName>/<host:port>`格式。

>[WARNING]
>
>在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。至少，考虑 启用身份验证和强化网络基础设施。

```yaml
sharding:
  configDB: <configReplSetName>/cfg1.example.net:27019,cfg2.example.net:27019
net:
  bindIp: localhost,<hostname(s)|ip address(es)>
```

开始`mongos`指定`--config` 选项和配置文件的路径。

```shell
mongos --config <path-to-config>
```



此时，您的分片集群由 `mongos`和配置服务器组成。您现在可以使用`mongosh`.连接到分片集群

**命令行**

如果使用命令行参数启动 `mongos`并指定 `--configdb`、`--bind_ip` 和其他适合您的部署的选项。 例如：

>[WARNING]
>
>在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。至少，考虑 启用身份验证和 强化网络基础设施。

```shell
mongos --configdb <configReplSetName>/cfg1.example.net:27019,cfg2.example.net:27019,cfg3.example.net:27019 --bind_ip localhost,<hostname(s)|ip address(es)>
```

包括适合您的部署的任何其他选项。

此时，您的分片集群由 `mongos`和配置服务器组成。 您现在可以使用 `mongosh` 连接到分片集群。

**连接到分片集群**

连接`mongosh`到`mongos`。指定`host`和`port`在其`mongos`上运行：

```shell
mongosh --host <hostname> --port <port>
```

连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)后，继续执行下一过程以将分片添加到集群。

**将分片添加到集群**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#add-shards-to-the-cluster)

在一个[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到 的会话 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，使用[`sh.addShard()`](https://www.mongodb.com/docs/manual/reference/method/sh.addShard/#mongodb-method-sh.addShard)方法将每个分片添加到集群。

以下操作将单个分片副本集添加到集群：

```shell
sh.addShard( "<replSetName>/s1-mongo1.example.net:27018,s1-mongo2.example.net:27018,s1-mongo3.example.net:27018")
```

重复这些步骤，直到集群包含所有需要的分片。

**分片集合**

要分片集合，请连接`mongosh`并 `mongos`使用该`sh.shardCollection()`方法。

>[NOTE]
>
>**分片和索引**
>
>如果集合已经包含数据，则必须 在对集合进行分片之前创建支持 分片键的索引。如果集合为空，MongoDB 会创建索引作为 `sh.shardCollection()`.

MongoDB 提供了两种分片集合的策略：

- 散列分片使用 单个字段 的散列索引作为分片]键来跨分片集群对数据进行分区。

  ```shell
  sh.shardCollection("<database>.<collection>", { <shard key field> : "hashed" } )
  ```

- 基于范围的分片可以使用多个字段作为片键，并将数据划分为由片键值确定的连续范围。

  ```shell
  sh.shardCollection("<database>.<collection>", { <shard key field> : 1, ... } )
  ```

**片键注意事项**

您对分片键的选择会影响分片的效率，以及您利用某些分片功能（例如区域）的能力。

从 4.0 版开始，`mongosh`提供方法`convertShardKeyToHashed()`。此方法使用与散列索引相同的散列函数，可用于查看某个键的散列值。

>[TIP]
>
>**也可以看看**：
>
>- 对于散列分片键，请参阅散列分片 键
>- 对于远程分片分片键，请参阅分片键 选择

 

原文 - https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/

译者：陆文龙
