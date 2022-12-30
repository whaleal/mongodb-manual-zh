# 部署地理冗余副本集[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#deploy-a-geographically-redundant-replica-set)

## 概述[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#overview)

[本教程概述了在多个位置](https://www.mongodb.com/docs/manual/core/replica-set-architecture-geographically-distributed/#std-label-replica-set-geographical-distribution)部署 具有成员的[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)的过程。本教程介绍了三成员副本集和五成员副本集。如果您有偶数个副本集成员，请添加另一个数据承载成员，如果可能，以部署奇数个投票成员。 [[ ](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#footnote-arbiter-alternative)[1 ](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#footnote-arbiter-alternative)[]](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#footnote-arbiter-alternative)

有关分布式副本集的更多信息，请参阅 [跨两个或多个数据中心](https://www.mongodb.com/docs/manual/core/replica-set-architecture-geographically-distributed/#std-label-replica-set-geographical-distribution)分布的副本集。另请参阅 [副本集部署架构](https://www.mongodb.com/docs/manual/core/replica-set-architectures/#std-label-replica-set-architecture)和[复制参考。](https://www.mongodb.com/docs/manual/reference/replication/#std-label-replication-toc)

| [ 1 ] | *( [1](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#ref-arbiter-alternative-id1) , [2](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#ref-arbiter-alternative-id2) )* 如果情况禁止另一个数据承载成员并且您有偶数的投票成员，则可以添加仲裁者。有关使用仲裁器时的注意事项，请参阅 [副本集仲裁器。](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/#std-label-replica-set-arbiter-configuration) |
| ----- | ------------------------------------------------------------ |
|       |                                                              |

## 注意事项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#considerations)

### 建筑学[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#architecture)

在生产中，将副本集的每个成员部署到自己的机器上。如果可能，请确保 MongoDB 侦听默认端口 `27017`.

有关详细信息，请参阅[副本集部署架构。](https://www.mongodb.com/docs/manual/core/replica-set-architectures/)

### 主机名[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#hostnames)



## 重要的

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集成员或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。

使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

### IP绑定[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#ip-binding)

使用该[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)选项可确保 MongoDB 侦听来自已配置地址上的应用程序的连接。

*在3.6版中更改*：



## 警告

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

MongoDB 二进制文件，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，默认绑定到 localhost。如果为二进制文件设置了[`net.ipv6`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ipv6)配置文件设置或`--ipv6`命令行选项，则二进制文件还会绑定到本地主机 IPv6 地址。默认情况下[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)绑定到 localhost 的只接受来自在同一台计算机上运行的客户端的连接。这种绑定行为包括 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)以及您的副本集或分片集群的其他成员。远程客户端无法连接到仅绑定到本地主机的二进制文件。要覆盖默认绑定并绑定到其他 IP 地址，请使用 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)配置文件设置或`--bind_ip` 命令行选项指定主机名或 IP 地址列表。



## 警告

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





### 连通性[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#connectivity)

确保网络流量可以在集合的所有成员和网络中的所有客户端之间安全传递。

考虑以下：

- 建立虚拟专用网络。确保您的网络拓扑通过局域网路由单个站点内成员之间的所有流量。
- 配置访问控制以防止未知客户端连接到副本集。
- 配置网络和防火墙规则，以便仅在默认 MongoDB 端口上允许传入和传出数据包，并且仅允许来自您的部署。请参阅 IP 绑定注意事项。

确保副本集的每个成员都可以通过可解析的 DNS 或主机名访问。您应该适当地配置您的 DNS 名称或设置您的系统`/etc/hosts`文件以反映此配置。

每个成员都必须能够连接到每个其他成员。有关如何检查您的连接的说明，请参阅 [测试所有成员之间的连接。](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#std-label-replica-set-troubleshooting-check-connection)

### 配置[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#configuration)

在部署MongoDB之前创建MongoDB存放数据文件的目录。

在存储在 或相关位置的[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)中指定[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)配置。`/etc/mongod.conf`

有关配置选项的更多信息，请参阅 [配置文件选项。](https://www.mongodb.com/docs/manual/reference/configuration-options/)

### 会员分布[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#distribution-of-the-members)

如果可能，使用奇数个数据中心，并选择一种成员分布，即使在数据中心丢失的情况下，剩余的副本集成员也可以占多数或至少提供数据副本的可能性最大.

### 投票成员[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#voting-members)

永远不要部署超过七名有投票权的成员。

## 先决条件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#prerequisites)

对于本教程中的所有配置，将每个副本集成员部署在单独的系统上。尽管您可以在单个系统上部署多个副本集成员，但这样做会降低副本集的冗余和容量。此类部署通常用于测试目的。

本教程假设您已在将成为副本集一部分的每个系统上安装 MongoDB。如果您尚未安装 MongoDB，请参阅[安装教程。](https://www.mongodb.com/docs/manual/installation/#std-label-tutorial-installation)

## 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#procedures)



### 部署一个地理冗余的三成员副本集[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#deploy-a-geographically-redundant-three-member-replica-set)



## 重要的

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集成员或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。

使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

对于地理冗余的三成员副本集部署，您必须决定如何分布您的系统。这三个成员的一些可能分布是：

- 跨三个数据中心：每个站点一名成员。
- 跨两个数据中心：两个成员到站点 A，一个成员到站点 B。如果副本集的成员之一是仲裁器 [[ 1 \]](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#footnote-arbiter-alternative)，则将仲裁器分配到具有数据承载成员的站点 A。



## 笔记

跨两个数据中心分布副本集成员提供了优于单个数据中心的优势。在两个数据中心分布中，

- 如果其中一个数据中心出现故障，与单个数据中心分布不同，数据仍然可用于读取。
- 如果只有少数成员的数据中心宕机，副本集仍然可以提供写操作和读操作。
- 但是，如果拥有大多数成员的数据中心出现故障，副本集将变为只读。

如果可能，将成员分布在至少三个数据中心。对于配置服务器副本集 (CSRS)，最佳做法是分布在三个（或更多，取决于成员数量）中心。如果第三个数据中心的成本过高，一种分配的可能性是在两个数据中心之间平均分配数据承载成员，如果您的公司政策允许，则将剩余的成员存储在云中。

1个

#### 使用适当的选项启动副本集的每个成员。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#start-each-member-of-the-replica-set-with-the-appropriate-options)

对于每个成员，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)使用以下设置启动一个实例：

- 将[`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName)选项设置为副本集名称。如果您的应用程序连接到多个副本集，则每个副本集必须具有不同的名称。
- 将[`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)选项设置为主机名/ip 或以逗号分隔的主机名/ips 列表。
- 根据您的部署设置任何其他设置。

在本教程中，三个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例与以下主机关联：

| 副本集成员 | 主机名                 |
| :--------- | :--------------------- |
| 会员 0     | `mongodb0.example.net` |
| 会员1      | `mongodb1.example.net` |
| 会员2      | `mongodb2.example.net` |

以下示例通过[`--replSet`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--replSet)和[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip) 命令行选项指定副本集名称和 ip 绑定：



## 警告

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

```
mongod --replSet "rs0" --bind_ip localhost,<hostname(s)|ip address(es)>
```



对于，指定远程客户端（包括副本集的其他成员）可用于连接到实例的实例`<hostname(s)|ip address(es)>`的主机名和/或 IP 地址。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

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

2个

#### 连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到其中一个`mongod`实例。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#connect-to-one-of-the-mongod-instances)

从其中一个正在运行的同一台机器[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)上（在本教程中，`mongodb0.example.net`），开始 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh). 要连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 默认端口上的侦听本地主机`27017`，只需发出：

```
mongosh
```



根据您的路径，您可能需要指定路径 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)二进制。

如果您`mongod`未在默认端口上运行，请指定 [`--port`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--port)的选项`mongosh`。

3个

#### 启动副本集。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#initiate-the-replica-set)

从[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)在副本集成员 0 上运行。



## 重要的

仅在副本集的*一个*[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)实例上运行。 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)



## 重要的

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集成员或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。

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

4个

#### 查看副本集配置。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#view-the-replica-set-configuration)

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



5个

#### 选修的。配置成为主要成员的资格。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#optional-configure-the-member-eligibility-for-becoming-primary)

在某些情况下，您可能希望一个数据中心的成员在其他数据中心的成员之前被选为主要成员。您可以修改[`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)成员的值，使一个数据中心 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)的成员比其他数据中心的成员更高。

副本集的一些成员，例如具有网络限制或资源有限的成员，不应该成为[故障转移](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-failover)中的主要成员。将不应成为主要成员的成员配置为具有[优先级 0 。](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/#std-label-replica-set-secondary-only-members)

例如，要降低位于其中一个站点（在此示例中为 `mongodb2.example.net`）的成员的相对资格，请将成员的优先级设置为`0.5`。

1. 查看副本集配置以确定 [`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)成员的数组位置。请记住，数组位置与以下内容不同`_id`：

   ```
   rs.conf()
   ```

   

2. 将副本集配置对象复制到一个变量（`cfg`在下面的示例中）。然后，在变量中，为成员设置正确的优先级。然后将变量传递给以[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)更新副本集配置。

   例如，要为数组中的第三个成员（即位置 2 的成员）设置优先级，请发出以下命令序列：

   ```
   cfg = rs.conf()
   cfg.members[2].priority = 0.5
   rs.reconfig(cfg)
   ```

   

   

   ## 笔记

   shell 方法可以强制当前[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)primary 下台，从而引起选举。当主要步骤关闭时，所有客户端都将断开连接。这是预期的行为。虽然选择新主节点的平均时间通常不应超过 12 秒，但始终确保在计划维护期间发生任何副本配置更改。

这些命令返回后，您将拥有一个地理上冗余的三成员副本集。

6个

#### 确保副本集有一个主要的。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#ensure-that-the-replica-set-has-a-primary)

用于[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)标识副本集中的主节点。

### 部署地理冗余的五成员副本集[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#deploy-a-geographically-redundant-five-member-replica-set)



## 重要的

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集成员或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。

使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

对于地理冗余的五成员副本集部署，您必须决定如何分布您的系统。五名成员的一些可能分布是：

- 跨三个数据中心：站点 A 中的两名成员，站点 B 中的两名成员，站点 C 中的一名成员。
- 跨四个数据中心：一个站点中有两个成员，其他三个站点中有一个成员。
- 跨五个数据中心：每个站点一名成员。
- 跨两个数据中心：站点 A 中的三个成员和站点 B 中的两个成员。如果可能，避免仅跨两个数据中心分布配置服务器副本集。



## 笔记

跨两个数据中心分布副本集成员提供了优于单个数据中心的优势。在两个数据中心分布中，

- 如果其中一个数据中心出现故障，与单个数据中心分布不同，数据仍然可用于读取。
- 如果只有少数成员的数据中心宕机，副本集仍然可以提供写操作和读操作。
- 但是，如果拥有大多数成员的数据中心出现故障，副本集将变为只读。

如果可能，将成员分布在至少三个数据中心。对于配置服务器副本集 (CSRS)，最佳做法是分布在三个（或更多，取决于成员数量）中心。如果第三个数据中心的成本过高，一种分配的可能性是在两个数据中心之间平均分配数据承载成员，如果您的公司政策允许，则将剩余的成员存储在云中。

1个

#### 使用适当的选项启动副本集的每个成员。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#start-each-member-of-the-replica-set-with-the-appropriate-options-1)

对于每个成员，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)使用以下设置启动一个实例：

- 将[`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName)选项设置为副本集名称，

  如果您的应用程序连接到多个副本集，则每个副本集必须具有不同的名称。一些驱动程序按副本集名称对副本集连接进行分组。

- 将[`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)选项设置为主机名/IP 地址或以逗号分隔的主机名/IP 地址列表，以及

- 根据您的部署设置任何其他设置。

在本教程中，五个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例与以下主机关联：

| 副本集成员 | 主机名                 |
| :--------- | :--------------------- |
| 会员 0     | `mongodb0.example.net` |
| 会员1      | `mongodb1.example.net` |
| 会员2      | `mongodb2.example.net` |
| 会员3      | `mongodb3.example.net` |
| 会员4      | `mongodb4.example.net` |

以下示例通过[`--replSet`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--replSet)和[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip) 命令行选项指定副本集名称和 ip 绑定：



## 警告

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

```
mongod --replSet "rs0" --bind_ip localhost,<hostname(s)|ip address(es)>
```



对于，指定远程客户端（包括副本集的其他成员）可用于连接到实例的实例`<hostname(s)|ip address(es)>`的主机名和/或 IP 地址。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

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

2个

#### 连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到其中一个`mongod`实例。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#connect-to-one-of-the-mongod-instances-1)

从其中一个正在运行的同一台机器[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)上（在本教程中，`mongodb0.example.net`），开始 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh). 要连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 默认端口上的侦听本地主机`27017`，只需发出：

```
mongosh
```



根据您的路径，您可能需要指定路径 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)二进制。

如果您`mongod`未在默认端口上运行，请指定 [`--port`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--port)的选项`mongosh`。

3个

#### 启动副本集。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#initiate-the-replica-set-1)

从[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)在副本集成员 0 上运行。



## 重要的

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



4个

#### 查看副本集配置。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#view-the-replica-set-configuration-1)

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



5个

#### 选修的。配置成为主要成员的资格。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#optional-configure-the-member-eligibility-for-becoming-primary-1)

在某些情况下，您可能希望一个数据中心的成员在其他数据中心的成员之前被选为主要成员。您可以修改[`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)成员的值，使一个数据中心 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)的成员比其他数据中心的成员更高。

副本集的一些成员，例如具有网络限制或资源有限的成员，不应该成为[故障转移](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-failover)中的主要成员。将不应成为主要成员的成员配置为具有[优先级 0 。](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/#std-label-replica-set-secondary-only-members)

例如，要降低位于其中一个站点（在此示例中为 `mongodb2.example.net`）的成员的相对资格，请将成员的优先级设置为`0.5`。

1. 查看副本集配置以确定 [`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)成员的数组位置。请记住，数组位置与以下内容不同`_id`：

   ```
   rs.conf()
   ```

   

2. 将副本集配置对象复制到一个变量（`cfg`在下面的示例中）。然后，在变量中，为成员设置正确的优先级。然后将变量传递给以[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)更新副本集配置。

   例如，要为数组中的第三个成员（即位置 2 的成员）设置优先级，请发出以下命令序列：

   ```
   cfg = rs.conf()
   cfg.members[2].priority = 0.5
   rs.reconfig(cfg)
   ```

   

   

   ## 笔记

   shell 方法可以强制当前[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)primary 下台，从而引起选举。当主要步骤关闭时，所有客户端都将断开连接。这是预期的行为。虽然选择新主节点的平均时间通常不应超过 12 秒，但始终确保在计划维护期间发生任何副本配置更改。

这些命令返回后，您将拥有一个地理上冗余的五成员副本集。

6个

#### 确保副本集有一个主要的。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/#ensure-that-the-replica-set-has-a-primary-1)

用于[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)标识副本集中的主节点。

←  [部署用于测试和开发的副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-for-testing/)[将仲裁器添加到副本集](https://www.mongodb.com/docs/manual/tutorial/add-replica-set-arbiter/) →



原文链接 - https://docs.mongodb.com/manual/tutorial/deploy-geographically-distributed-replica-set/

译者：陆文龙

