# 部署地理冗余副本集

## 概述

[本教程概述了部署多个节点](https://www.mongodb.com/docs/manual/core/replica-set-architecture-geographically-distributed/#std-label-replica-set-geographical-distribution)的[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)的过程。本教程介绍了三节点副本集和五节点副本集。如果您有偶数个副本集节点，请添加另一个数据承载节点，如果可能，以部署奇数个投票节点。

有关分布式副本集的更多信息，请参阅 [跨两个或多个数据中心](https://www.mongodb.com/docs/manual/core/replica-set-architecture-geographically-distributed/#std-label-replica-set-geographical-distribution)分布的副本集。另请参阅 [副本集部署架构](https://www.mongodb.com/docs/manual/core/replica-set-architectures/#std-label-replica-set-architecture)和[复制参考。](https://www.mongodb.com/docs/manual/reference/replication/#std-label-replication-toc)

| [ 1 ] | *( [1](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#ref-arbiter-alternative-id1) , [2](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#ref-arbiter-alternative-id2) )* 如果情况禁止另一个数据承载成员并且您有偶数的投票成员，则可以添加仲裁者。有关使用仲裁器时的注意事项，请参阅 [副本集仲裁器。](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/#std-label-replica-set-arbiter-configuration) |
| ----- | ------------------------------------------------------------ |
|       |                                                              |

## 注意事项

### 搭建

在生产中，将副本集的每个节点部署到自己的机器上。如果可能，请确保 MongoDB 侦听默认端口 `27017`.

有关详细信息，请参阅[副本集部署架构。](https://www.mongodb.com/docs/manual/core/replica-set-architectures/)

### 主机名



## IMPORTANT

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集节点或分片集群节点时，使用 DNS 主机名而不是 IP 地址尤为重要。

使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

### IP绑定

使用该[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)选项可确保 MongoDB 侦听来自已配置地址上的应用程序的连接。

*在3.6版中更改*：



## WARNING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

MongoDB 二进制文件，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，默认绑定到 localhost。如果为二进制文件设置了[`net.ipv6`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ipv6)配置文件设置或`--ipv6`命令行选项，则二进制文件还会绑定到本地主机 IPv6 地址。默认情况下[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)绑定到 localhost 的只接受来自在同一台计算机上运行的客户端的连接。这种绑定行为包括 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)以及您的副本集或分片集群的其他成节点。远程客户端无法连接到仅绑定到本地主机的二进制文件。要覆盖默认绑定并绑定到其他 IP 地址，请使用 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)配置文件设置或`--bind_ip` 命令行选项指定主机名或 IP 地址列表。



## WARNING

从 MongDB 5.0 开始，[水平分割 DNS](https://en.wikipedia.org/wiki/Split-horizon_DNS)仅配置了 IP 地址的节点无法启动验证并报告错误。看[`disableSplitHorizonIPCheck`。](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.disableSplitHorizonIPCheck)

例如，以下[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例绑定到 localhost 和`My-Example-Associated-Hostname`与 IP 地址关联的主机名`198.51.100.1`：

```
mongod --bind_ip localhost,My-Example-Associated-Hostname
```



为了连接到此实例，远程客户端必须指定主机名或其关联的 IP 地址`198.51.100.1`：

```
mongosh --host My-Example-Associated-Hostname

mongosh --host 198.51.100.1
```





### 连通性

确保网络流量可以在集合的所有节点和网络中的所有客户端之间安全传递。

考虑以下：

- 建立虚拟专用网络。确保您的网络拓扑通过局域网路由单个站点内节点之间的所有流量。
- 配置访问控制以防止未知客户端连接到副本集。
- 配置网络和防火墙规则，以便仅在默认 MongoDB 端口上允许传入和传出数据包，并且仅允许来自您的部署。请参阅 IP 绑定注意事项。

确保副本集的每个节点都可以通过可解析的 DNS 或主机名访问。您应该适当地配置您的 DNS 名称或设置您的系统`/etc/hosts`文件以反映此配置。

每个节点都必须能够连接到每个其他节点。有关如何检查您的连接的说明，请参阅 [测试所有节点之间的连接。](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#std-label-replica-set-troubleshooting-check-connection)

### 配置

在部署MongoDB之前创建MongoDB存放数据文件的目录。

在存储在 或相关位置的[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)中指定[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)配置。`/etc/mongod.conf`

有关配置选项的更多信息，请参阅 [配置文件选项。](https://www.mongodb.com/docs/manual/reference/configuration-options/)

### 节点分布

如果可能，使用奇数个数据中心，并选择一种节点分布，即使在数据中心丢失的情况下，剩余的副本集节点也可以占多数或至少提供数据副本的可能性最大.

### 投票节点

永远不要部署超过七名有投票权的节点。

## 先决条件

对于本教程中的所有配置，将每个副本集节点部署在单独的系统上。尽管您可以在单个系统上部署多个副本集节点，但这样做会降低副本集的冗余和容量。此类部署通常用于测试目的。

本教程假设您已在将成为副本集一部分的每个系统上安装 MongoDB。如果您尚未安装 MongoDB，请参阅[安装教程。](https://www.mongodb.com/docs/manual/installation/#std-label-tutorial-installation)

## 程序



### 部署一个地理冗余的三节点副本集



## IMPORTANT

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集节点或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。

使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

对于地理冗余的三节点副本集部署，您必须决定如何分布您的系统。这三个节点的一些可能分布是：

- 跨三个数据中心：每个站点一个节点。
- 跨两个数据中心：两个节点到站点 A，一个节点到站点 B。如果副本集的节点之一是仲裁器 [[ 1 \]](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#footnote-arbiter-alternative)，则将仲裁器分配到具有数据承载节点的站点 A。



## NOTE

跨两个数据中心分布副本集节点提供了优于单个数据中心的优势。在两个数据中心分布中，

- 如果其中一个数据中心出现故障，与单个数据中心分布不同，数据仍然可用于读取。
- 如果只有少数节点的数据中心宕机，副本集仍然可以提供写操作和读操作。
- 但是，如果拥有大多数节点的数据中心出现故障，副本集将变为只读。

如果可能，将节点分布在至少三个数据中心。对于配置服务器副本集 (CSRS)，最佳做法是分布在三个（或更多，取决于节点数量）中心。如果第三个数据中心的成本过高，一种分配的可能性是在两个数据中心之间平均分配数据承载节点，如果您的公司政策允许，则将剩余的节点存储在云中。

#### 使用适当的选项启动副本集的每个节点。

对于每个节点，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)使用以下设置启动一个实例：

- 将[`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName)选项设置为副本集名称。如果您的应用程序连接到多个副本集，则每个副本集必须具有不同的名称。
- 将[`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)选项设置为主机名/ip 或以逗号分隔的主机名/ips 列表。
- 根据您的部署设置任何其他设置。

在本教程中，三个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例与以下主机关联：

| 副本集成员 | 主机名                 |
| :--------- | :--------------------- |
| 节点 0     | `mongodb0.example.net` |
| 节点1      | `mongodb1.example.net` |
| 节点3      | `mongodb2.example.net` |

以下示例通过[`--replSet`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--replSet)和[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip) 命令行选项指定副本集名称和 ip 绑定：



## WARNING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

```
mongod --replSet "rs0" --bind_ip localhost,<hostname(s)|ip address(es)>
```



对于，指定远程客户端（包括副本集的其他节点）可用于连接到实例的实例`<hostname(s)|ip address(es)>`的主机名和/或 IP 地址。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

或者，您也可以在[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)[`replica set name`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName)中指定和[：](https://www.mongodb.com/docs/manual/reference/configuration-options/)[`ip addresses`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)

```
replication:
   replSetName: "rs0"
net:
   bindIp: localhost,<hostname(s)|ip address(es)>
```



要从配置文件开始[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，请使用以下选项指定配置文件的路径[`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config)：

```
mongod --config <path-to-config>
```



在生产部署中，您可以配置一个[初始化脚本](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-init-script) 来管理这个过程。Init 脚本超出了本文档的范围。



#### 连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到其中一个`mongod`实例。

从其中一个正在运行的同一台机器[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)上（在本教程中，`mongodb0.example.net`），开始 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh). 要连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 默认端口上的侦听本地主机`27017`，只需发出：

```
mongosh
```



根据您的路径，您可能需要指定路径 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)二进制。

如果您`mongod`未在默认端口上运行，请指定 [`--port`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--port)的选项`mongosh`。



#### 启动副本集。

从[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)在副本集节点 0 上运行。



## IMPORTANT

仅在副本集的*一个*[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)实例上运行。 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)



## IMPORTANT

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集节点或分片集群节点时，使用 DNS 主机名而不是 IP 地址尤为重要。

使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

```
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



#### 查看副本集配置。

用于[`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)显示[副本集配置对象：](https://www.mongodb.com/docs/manual/reference/replica-configuration/)

```
rs.conf()
```



副本集配置对象类似于以下内容：

```
{
   "_id" : "rs0",
   "version" : 1,
   "protocolVersion" : NumberLong(1),
   "members" : [
      {
         "_id" : 0,
         "host" : "mongodb0.example.net:27017",
         "arbiterOnly" : false,
         "buildIndexes" : true,
         "hidden" : false,
         "priority" : 1,
         "tags" : {

         },
         "secondaryDelaySecs" : NumberLong(0),
         "votes" : 1
      },
      {
         "_id" : 1,
         "host" : "mongodb1.example.net:27017",
         "arbiterOnly" : false,
         "buildIndexes" : true,
         "hidden" : false,
         "priority" : 1,
         "tags" : {

         },
         "secondaryDelaySecs" : NumberLong(0),
         "votes" : 1
      },
      {
         "_id" : 2,
         "host" : "mongodb2.example.net:27017",
         "arbiterOnly" : false,
         "buildIndexes" : true,
         "hidden" : false,
         "priority" : 1,
         "tags" : {

         },
         "secondaryDelaySecs" : NumberLong(0),
         "votes" : 1
      }
      
   ],
   "settings" : {	
      "chainingAllowed" : true,
      "heartbeatIntervalMillis" : 2000,
      "heartbeatTimeoutSecs" : 10,
      "electionTimeoutMillis" : 10000,
      "catchUpTimeoutMillis" : -1,
      "getLastErrorModes" : {

      },
      "getLastErrorDefaults" : {
         "w" : 1,
         "wtimeout" : 0
      },
      "replicaSetId" : ObjectId("585ab9df685f726db2c6a840")
   }
}
```





#### 可选的。配置成为主要成员的资格。

在某些情况下，您可能希望一个数据中心的节点在其他数据中心的节点之前被选为主要成员。您可以修改节点的[`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)值，使一个数据中心节点的 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)的节点比其他数据中心节点的priority更高。

副本集的一些节点，例如具有网络限制或资源有限的节点，不应该成为[故障转移](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-failover)中的主节点。将不应成为主节点的节点配置为具有[优先级 0 。](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/#std-label-replica-set-secondary-only-members)

例如，要降低位于其中一个站点（在此示例中为 `mongodb2.example.net`）的节点的相对资格，请将节点的优先级设置为`0.5`。

1. 查看副本集配置以确定 [`members节点的数组位置。请记住，数组位置与以下内容不同`_id`：

   ```
   rs.conf()
   ```

   

2. 将副本集配置对象复制到一个变量（`cfg`在下面的示例中）。然后，在变量中，为节点设置正确的优先级。然后将变量传递给以[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)更新副本集配置。

   例如，要为数组中的第三个节点（即位置 2 的节点）设置优先级，请发出以下命令序列：

   ```
   cfg = rs.conf()
   cfg.members[2].priority = 0.5
   rs.reconfig(cfg)
   ```

   

   

   ## NOTE

   shell 方法可以强制当前[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)primary 下台，从而引起选举。当主要步骤关闭时，所有客户端都将断开连接。这是预期的行为。虽然选择新主节点的平均时间通常不应超过 12 秒，但始终确保在计划维护期间发生任何副本配置更改。

这些命令返回后，您将拥有一个地理上冗余的三节点副本集。



#### 确保副本集有一个主节点。

用于[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)标识副本集中的主节点。

### 部署地理冗余的五节点副本集



## IMPORTANT

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集节点或分片集群节点时，使用 DNS 主机名而不是 IP 地址尤为重要。

使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

对于地理冗余的五节点副本集部署，您必须决定如何分布您的系统。五名节点的一些可能分布是：

- 跨三个数据中心：站点 A 中的两名节点，站点 B 中的两名节点，站点 C 中的一名节点。
- 跨四个数据中心：一个站点中有两个节点，其他三个站点中有一个节点。
- 跨五个数据中心：每个站点一名成员节点
- 跨两个数据中心：站点 A 中的三个节点和站点 B 中的两个节点。如果可能，避免仅跨两个数据中心分布配置服务器副本集。



## NOTE

跨两个数据中心分布副本集节点提供了优于单个数据中心的优势。在两个数据中心分布中，

- 如果其中一个数据中心出现故障，与单个数据中心分布不同，数据仍然可用于读取。
- 如果只有少数节点的数据中心宕机，副本集仍然可以提供写操作和读操作。
- 但是，如果拥有大多数节点的数据中心出现故障，副本集将变为只读。

如果可能，将节点分布在至少三个数据中心。对于配置服务器副本集 (CSRS)，最佳做法是分布在三个（或更多，取决于节点数量）中心。如果第三个数据中心的成本过高，一种分配的可能性是在两个数据中心之间平均分配数据承载节点，如果您的公司政策允许，则将剩余的节点存储在云中。



#### 使用适当的选项启动副本集的每个节点。

对于每个节点，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)使用以下设置启动一个实例：

- 将[`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName)选项设置为副本集名称，

  如果您的应用程序连接到多个副本集，则每个副本集必须具有不同的名称。一些驱动程序按副本集名称对副本集连接进行分组。

- 将[`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)选项设置为主机名/IP 地址或以逗号分隔的主机名/IP 地址列表，以及

- 根据您的部署设置任何其他设置。

在本教程中，五个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例与以下主机关联：

| 副本集成员 | 主机名                 |
| :--------- | :--------------------- |
| 节点 0     | `mongodb0.example.net` |
| 节点1      | `mongodb1.example.net` |
| 节点2      | `mongodb2.example.net` |
| 节点3      | `mongodb3.example.net` |
| 节点4      | `mongodb4.example.net` |

以下示例通过[`--replSet`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--replSet)和[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip) 命令行选项指定副本集名称和 ip 绑定：



## WARNING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

```
mongod --replSet "rs0" --bind_ip localhost,<hostname(s)|ip address(es)>
```



对于，指定远程客户端（包括副本集的其他节点）可用于连接到实例的实例`<hostname(s)|ip address(es)>`的主机名和/或 IP 地址。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

或者，您也可以在 [配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)[`replica set name`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName)中指定和[：](https://www.mongodb.com/docs/manual/reference/configuration-options/)[`hostnames/ip addresses`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)

```
replication:
   replSetName: "rs0"
net:
   bindIp: localhost,<hostname(s)|ip address(es)>
```



要从配置文件开始[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，请使用以下选项指定配置文件的路径[`--config`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--config)：

```
mongod --config <path-to-config>
```



在生产部署中，您可以配置一个[初始化脚本](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-init-script) 来管理这个过程。Init 脚本超出了本文档的范围。



#### 连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到其中一个`mongod`实例。

从其中一个正在运行的同一台机器[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)上（在本教程中，`mongodb0.example.net`），开始 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh). 要连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 默认端口上的侦听本地主机`27017`，只需发出：

```
mongosh
```



根据您的路径，您可能需要指定路径 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)二进制。

如果您`mongod`未在默认端口上运行，请指定 [`--port`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--port)的选项`mongosh`。



#### 启动副本集。

从[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)在副本集节点 0 上运行。



## IMPORTANT

仅在副本集的*一个*[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)实例上运行。 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

```
rs.initiate( {
   _id : "rs0",
   members: [
      { _id: 0, host: "mongodb0.example.net:27017" },
      { _id: 1, host: "mongodb1.example.net:27017" },
      { _id: 2, host: "mongodb2.example.net:27017" },
      { _id: 3, host: "mongodb3.example.net:27017" },
      { _id: 4, host: "mongodb4.example.net:27017" }
   ]
})
```



 

#### 查看副本集配置。

用于[`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)显示[副本集配置对象：](https://www.mongodb.com/docs/manual/reference/replica-configuration/)

```
rs.conf()
```



副本集配置对象类似于以下内容：

```
{
   "_id" : "rs0",
   "version" : 1,
   "protocolVersion" : NumberLong(1),
   "writeConcernMajorityJournalDefault" : true,
   "members" : [
      {
         "_id" : 0,
         "host" : "mongodb0.example.net:27017",
         "arbiterOnly" : false,
         "buildIndexes" : true,
         "hidden" : false,
         "priority" : 1,
         "tags" : {

         },
         "secondaryDelaySecs" : NumberLong(0),
         "votes" : 1
      },
      {
         "_id" : 1,
         "host" : "mongodb1.example.net:27017",
         "arbiterOnly" : false,
         "buildIndexes" : true,
         "hidden" : false,
         "priority" : 1,
         "tags" : {

         },
         "secondaryDelaySecs" : NumberLong(0),
         "votes" : 1
      },
      {
         "_id" : 2,
         "host" : "mongodb2.example.net:27017",
         "arbiterOnly" : false,
         "buildIndexes" : true,
         "hidden" : false,
         "priority" : 1,
         "tags" : {

         },
         "secondaryDelaySecs" : NumberLong(0),
         "votes" : 1
      },
      {
         "_id" : 3,
         "host" : "mongodb3.example.net:27017",
         "arbiterOnly" : false,
         "buildIndexes" : true,
         "hidden" : false,
         "priority" : 1,
         "tags" : {

         },
         "secondaryDelaySecs" : NumberLong(0),
         "votes" : 1
      },
      {
         "_id" : 4,
         "host" : "mongodb4.example.net:27017",
         "arbiterOnly" : false,
         "buildIndexes" : true,
         "hidden" : false,
         "priority" : 1,
         "tags" : {

         },
         "secondaryDelaySecs" : NumberLong(0),
         "votes" : 1
      }
   ],
   "settings" : {
      "chainingAllowed" : true,
      "heartbeatIntervalMillis" : 2000,
      "heartbeatTimeoutSecs" : 10,
      "electionTimeoutMillis" : 10000,
      "catchUpTimeoutMillis" : -1,
      "catchUpTakeoverDelayMillis" : 30000,
      "getLastErrorModes" : {

      },
      "getLastErrorDefaults" : {
         "w" : 1,
         "wtimeout" : 0
      },
      "replicaSetId" : ObjectId("5df2c9ccc21c478b838b98d6")
   }
}
```





#### 可选 的。配置成为主节点的资格。

在某些情况下，您可能希望一个数据中心的节点在其他数据中心的节点之前被选为主节点。您可以修改节点的[`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)值，使一个数据中心节点的 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)值比其他数据中心节点的值更高。

副本集的一些节点，例如具有网络限制或资源有限的节点，不应该成为[故障转移](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-failover)中的主节点。将不应成为主节点的节点配置为具有[优先级 0 。](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/#std-label-replica-set-secondary-only-members)

例如，要降低位于其中一个站点（在此示例中为 `mongodb2.example.net`）的节点的相对资格，请将节点的优先级设置为`0.5`。

1. 查看副本集配置以确定 [`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)节点的数组位置。请记住，数组位置与以下内容不同`_id`：

   ```
   rs.conf()
   ```

   

2. 将副本集配置对象复制到一个变量（`cfg`在下面的示例中）。然后，在变量中，为节点设置正确的优先级。然后将变量传递给以[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)更新副本集配置。

   例如，要为数组中的第三个节点（即位置 2 的节点）设置优先级，请发出以下命令序列：

   ```
   cfg = rs.conf()
   cfg.members[2].priority = 0.5
   rs.reconfig(cfg)
   ```

   

   

   ## NOTE

   shell 方法可以强制当前[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)主节点下台，从而引起选举。当主节点关闭时，所有客户端都将断开连接。这是预期的行为。虽然选择新主节点的平均时间通常不应超过 12 秒，但始终确保在计划维护期间发生任何副本配置更改。

这些命令返回后，您将拥有一个地理上冗余的五成员副本集。

 

#### 确保副本集有一个主节点。

用于[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)标识副本集中的主节点。

←  [部署用于测试和开发的副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-for-testing/)[将仲裁器添加到副本集](https://www.mongodb.com/docs/manual/tutorial/add-replica-set-arbiter/) →



原文链接 - https://docs.mongodb.com/manual/tutorial/deploy-geographically-distributed-replica-set/

译者：陆文龙

