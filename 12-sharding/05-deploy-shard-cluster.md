**部署分片集群**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#deploy-a-sharded-cluster)

**概述**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#overview)

本教程涉及创建一个新的分片集群，该集群由一个 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)配置服务器副本集和两个分片副本集组成。

**注意事项**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#considerations)

**连通性**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#connectivity)

分片集群的每个成员都必须能够连接到集群中的*所有*其他成员。这包括所有分片和配置服务器。确保网络和安全系统（包括所有接口和防火墙）允许这些连接。

**主机名和配置**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#hostnames-and-configuration)

>[IMPORTANT]
>
>为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集成员或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。
>
>使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

**本地主机部署**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#localhost-deployments)

如果您使用其中一个`localhost`或其 IP 地址作为任何主机标识符的主机名部分，则*必须*将该标识符用作集群中任何其他 MongoDB 组件的主机设置。

例如，该[`sh.addShard()`](https://www.mongodb.com/docs/manual/reference/method/sh.addShard/#mongodb-method-sh.addShard)方法采用`host` 目标分片的主机名作为参数。如果设置`host`为 `localhost`，则必须`localhost`用作集群中所有其他分片的主机。

**安全**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#security)

本教程不*包括配置*[Internal/Membership Authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)或 [Role-Based Access Control](https://www.mongodb.com/docs/manual/core/authorization/)所需的步骤 [。](https://www.mongodb.com/docs/manual/core/authorization/)

在生产环境中，分片集群应至少采用[x.509](https://www.mongodb.com/docs/manual/core/security-x.509/)安全性来进行内部身份验证和客户端访问。

**程序**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#procedure)

**创建配置服务器副本集**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#create-the-config-server-replica-set)

以下步骤部署配置服务器副本集。

对于生产部署，部署一个至少包含三个成员的配置服务器副本集。出于测试目的，您可以创建单成员副本集。

>[NOTE]
>
>配置服务器副本集不得使用与任何分片副本集相同的名称。

对于本教程，配置服务器副本集成员与以下主机相关联：

| 配置服务器副本集成员 | 主机名             |
| :------------------- | :----------------- |
| 成员 0               | `cfg1.example.net` |
| 成员1                | `cfg2.example.net` |
| 成员2                | `cfg3.example.net` |

1. **启动配置服务器副本集的每个成员**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#start-each-member-of-the-config-server-replica-set)

   启动*each* [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)时，通过配置文件或命令行指定[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 设置。

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

   - [`sharding.clusterRole`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-sharding.clusterRole)到`configsvr`,

   - [`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName)到配置服务器副本集的所需名称，

   - [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)远程客户端（包括配置服务器副本集的其他成员以及分片集群的其他成员）可以用来连接到实例的主机名/IP 地址或以逗号分隔的主机名或 IP 地址列表的选项。

     >[WARNING]
     >
     >在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

   - 适用于您的部署的其他设置，例如 [`storage.dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)和[`net.port`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.port)。有关配置文件的更多信息，请参阅[配置选项。](https://www.mongodb.com/docs/manual/reference/configuration-options/)

   使用`--config`的选项设置为配置文件路径启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

   ```shell
   mongod --config <path-to-config-file>
   ```

   **命令行**

   如果使用命令行选项，请使用 `--configsvr`、`--replSet`、`--bind_ip` 和其他适合您的部署的选项启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。 例如：

   >[WARNING]
   >
   >在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

   ```shell
   mongod --configsvr --replSet <replica set name> --dbpath <path> --bind_ip localhost,<hostname(s)|ip address(es)>
   ```

   有关启动参数的更多信息，请参阅 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)参考页。

2. **连接到其中一个配置服务器**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#connect-to-one-of-the-config-servers)

   连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)给配置服务器成员之一。

   ```shell
   mongosh --host <hostname> --port <port>
   ```

3. **启动副本集**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#initiate-the-replica-set)

   从[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), 运行该[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)方法。

   [`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)可以带一个可选的[副本集配置文件](https://www.mongodb.com/docs/manual/reference/replica-configuration/)。在 [副本集配置文档](https://www.mongodb.com/docs/manual/reference/replica-configuration/)中，包括：

   - [`_id`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf._id)设置为[`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName)或`--replSet`选项中指定的副本集名称。
   - 配置服务器副本集的[`configsvr`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.configsvr)字段设置为`true`。
   - 每个副本集成员都有一个文档的[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)数组。

   >[IMPORTANT]
   >
   >仅在副本集的*一个*[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例上运行[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)。 

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

   有关[副本集](https://www.mongodb.com/docs/manual/reference/replica-configuration/)配置文档的更多信息，请参阅副本集配置。

   配置服务器副本集 (CSRS) 启动并启动后，继续创建分片副本集。

**创建分片副本集**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#create-the-shard-replica-sets)

对于生产部署，请使用至少包含三个成员的副本集。出于测试目的，您可以创建单成员副本集。

>[NOTE]
>
>分片副本集不能使用与配置服务器副本集相同的名称。

对于每个分片，使用以下步骤创建分片副本集：

1. **启动分片副本集的每个成员**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#start-each-member-of-the-shard-replica-set)

   启动*each* [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)时，通过配置文件或命令行指定[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 设置。

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

   - [`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName)到副本集的所需名称，

   - [`sharding.clusterRole`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-sharding.clusterRole)选择`shardsvr`，

   - [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)远程客户端（包括配置服务器副本集的其他成员以及分片集群的其他成员）可以用来连接到实例的 ip 选项或逗号分隔的 ips 列表。

     >[WARNING]
     >
     >在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

   - 适用于您的部署的其他设置，例如 [`storage.dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)和[`net.port`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.port)。有关配置文件的更多信息，请参阅[配置选项。](https://www.mongodb.com/docs/manual/reference/configuration-options/)

   使用`--config`的选项设置配置文件路径启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

   ```shell
   mongod --config <path-to-config-file>
   ```

   **命令行**

   如果使用命令行选项，请使用 `--replSet`、`--shardsvr`、`--bind_ip` 选项以及适合您的部署的其他选项启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。 例如：

   ```shell
   mongod --shardsvr --replSet <replSetname>  --dbpath <path> --bind_ip localhost,<hostname(s)|ip address(es)>
   ```

   有关启动参数的更多信息，请参阅 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 参考页。

2. **连接到分片副本集的一个成员**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#connect-to-one-member-of-the-shard-replica-set)

   连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到副本集成员之一。

   ```shell
   mongosh --host <hostname> --port <port>
   ```

3. **启动副本集**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#initiate-the-replica-set-1)

   从[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), 运行该[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)方法。

   [`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)可以带一个可选的[副本集配置文件](https://www.mongodb.com/docs/manual/reference/replica-configuration/)。在 [副本集配置文档](https://www.mongodb.com/docs/manual/reference/replica-configuration/)中，包括：

   - 该[`_id`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf._id)字段设置为[`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName)或 `--replSet`选项中指定的副本集名称。
   - 每个副本集成员都有一个文档的[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)数组。

   以下示例启动一个三成员副本集。

   >[IMPORTANT]
   >
   >仅在副本集的*一个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)*实例上运行[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)。

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

**为 Sharded Cluster启动一个`mongos`**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#start-a-mongos-for-the-sharded-cluster)

[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用配置文件或命令行参数启动以指定配置服务器。

**配置文件**

如果使用配置文件，请将 [`sharding.configDB`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-sharding.configDB)配置服务器副本集名称和副本集的至少一个成员设置为 `<replSetName>/<host:port>`格式。

>[WARNING]
>
>在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

```yaml
sharding:
  configDB: <configReplSetName>/cfg1.example.net:27019,cfg2.example.net:27019
net:
  bindIp: localhost,<hostname(s)|ip address(es)>
```

开始[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)指定`--config` 选项和配置文件的路径。

```shell
mongos --config <path-to-config>
```

有关配置文件的更多信息，请参阅 [配置选项。](https://www.mongodb.com/docs/manual/reference/configuration-options/)

此时，您的分片集群由 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)和配置服务器组成。您现在可以使用[`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到分片集群

**命令行**

如果使用命令行参数启动 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 并指定 `--configdb`、`--bind_ip` 和其他适合您的部署的选项。 例如：

>[WARNING]
>
>在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

```shell
mongos --configdb <configReplSetName>/cfg1.example.net:27019,cfg2.example.net:27019,cfg3.example.net:27019 --bind_ip localhost,<hostname(s)|ip address(es)>
```

包括适合您的部署的任何其他选项。

此时，您的分片集群由 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 和配置服务器组成。 您现在可以使用 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到分片集群。

**连接到分片集群**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#connect-to-the-sharded-cluster)

连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)。指定`host`和`port`在其`mongos`上运行：

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

**分片集合**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#shard-a-collection)

要分片集合，请连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)并 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用该[`sh.shardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection)方法。

>[NOTE]
>
>**分片和索引**
>
>如果集合已经包含数据，则必须 在对集合进行分片之前[创建](https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/#std-label-method-createIndex)支持 分片[键](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)的索引。如果集合为空，MongoDB 会创建索引作为 [`sh.shardCollection()`.](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection)

MongoDB 提供了两种分片集合的策略：

- [散列分片](https://www.mongodb.com/docs/manual/core/hashed-sharding/#std-label-sharding-hashed)使用 单个字段 的[散列索引作为分片](https://www.mongodb.com/docs/manual/core/index-hashed/#std-label-index-hashed-index)[键](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)来跨分片集群对数据进行分区。

  ```shell
  sh.shardCollection("<database>.<collection>", { <shard key field> : "hashed" } )
  ```

- [基于范围的分片](https://www.mongodb.com/docs/manual/core/ranged-sharding/#std-label-sharding-ranged)可以使用多个字段作为片键，并将数据划分为由片键值确定的连续范围。

  ```shell
  sh.shardCollection("<database>.<collection>", { <shard key field> : 1, ... } )
  ```

**片键注意事项**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#shard-key-considerations)

您对分片键的选择会影响分片的效率，以及您利用某些分片功能（例如[区域](https://www.mongodb.com/docs/manual/core/zone-sharding/#std-label-zone-sharding)）的能力。要了解如何选择有效的分片键，请参阅[选择分片键。](https://www.mongodb.com/docs/manual/core/sharding-choose-a-shard-key/#std-label-sharding-shard-key-selection)

从 4.0 版开始，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 提供方法[`convertShardKeyToHashed()`](https://www.mongodb.com/docs/manual/reference/method/convertShardKeyToHashed/#mongodb-method-convertShardKeyToHashed)。此方法使用与散列索引相同的散列函数，可用于查看某个键的散列值。

>[TIP]
>
>**也可以看看**：
>
>- 对于散列分片键，请参阅散列分片 [键](https://www.mongodb.com/docs/manual/core/hashed-sharding/#std-label-hashed-sharding-shard-key)
>- 对于远程分片分片键，请参阅分片键 [选择](https://www.mongodb.com/docs/manual/core/ranged-sharding/#std-label-sharding-ranged-shard-key)

 参见

原文 - [Deploy a Sharded Cluster]( https://docs.mongodb.com/manual/tutorial/deploy-shard-cluster/ )

译者：景圣
