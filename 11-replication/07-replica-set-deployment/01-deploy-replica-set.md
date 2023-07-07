# 部署副本集

本教程描述了如何从三个在禁用[访问控制](https://www.mongodb.com/docs/manual/core/authorization/)的情况下运行的 现有实例创建一个三节点[副本集。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

要部署启用[访问控制](https://www.mongodb.com/docs/manual/core/authorization/)的副本集，请 [参阅使用密钥文件身份验证部署副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-with-keyfile-access-control/#std-label-deploy-repl-set-with-auth)。如果您希望从单个 MongoDB 实例部署副本集，请参阅 [将独立实例转换为副本集](https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/)。有关副本集部署的更多信息，请参阅[复制](https://www.mongodb.com/docs/manual/replication/)和 [副本集部署架构](https://www.mongodb.com/docs/manual/core/replica-set-architectures/)文档。

## 概述

三个节点[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)提供了足够的冗余来应对大多数网络分区和其他系统故障。这些集合还具有足够的容量用于许多分布式读取操作。副本集应该总是有奇数个节点。这确保了[选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/)能够顺利进行。有关设计副本集的更多信息，请参阅[复制概述。](https://www.mongodb.com/docs/manual/replication/)

## 要求

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 对于生产部署，您应该通过在不同的机器上托管实例来尽可能多地保持节点之间的分离。当使用虚拟机进行生产部署时，您应该将每个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例放置在由冗余电源电路和冗余网络路径提供服务的单独主机服务器上。

在部署副本集之前，您必须在将成为[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)一部分的每个系统上安装 MongoDB 。如果您尚未安装 MongoDB，请参阅[安装教程。](https://www.mongodb.com/docs/manual/installation/#std-label-tutorial-installation)



## 部署副本集时的注意事项

### 搭建

在生产中，将副本集的每个节点部署到自己的机器上。如果可能，请确保 MongoDB 侦听默认端口 `27017`.

有关详细信息，请参阅[副本集部署架构。](https://www.mongodb.com/docs/manual/core/replica-set-architectures/)

### 主机名

>## IMPORTANT
>
>为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集成员或分片集群节点时，使用 DNS 主机名而不是 IP 地址尤为重要。



使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

### IP绑定

使用该[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)选项可确保 MongoDB 侦听来自已配置地址上的应用程序的连接。

*在3.6版中更改*：



## WARNING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

MongoDB 二进制文件，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，默认绑定到 localhost。如果为二进制文件设置了[`net.ipv6`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ipv6)配置文件设置或`--ipv6`命令行选项，则二进制文件还会绑定到本地主机 IPv6 地址。默认情况下[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)绑定到 localhost 的只接受来自在同一台计算机上运行的客户端的连接。这种绑定行为包括 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)以及您的副本集或分片集群的其他节点。远程客户端无法连接到仅绑定到本地主机的二进制文件。要覆盖默认绑定并绑定到其他 IP 地址，请使用 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)配置文件设置或`--bind_ip` 命令行选项指定主机名或 IP 地址列表。



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

## 程序

以下过程概述了在禁用访问控制时部署副本集的步骤。

1个

### 使用适当的选项启动副本集的每个节点。

对于每个节点，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)使用以下设置启动一个实例：

- 将[`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName)选项设置为副本集名称。如果您的应用程序连接到多个副本集，则每个副本集必须具有不同的名称。
- 将[`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)选项设置为主机名/ip 或以逗号分隔的主机名/ips 列表。
- 根据您的部署设置任何其他设置。

在本教程中，三个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例与以下主机关联：

| 副本集成员 | 主机名                 |
| :--------- | :--------------------- |
| 节点 0     | `mongodb0.example.net` |
| 节点1      | `mongodb1.example.net` |
| 节点2      | `mongodb2.example.net` |

以下示例通过[`--replSet`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--replSet)和[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip) 命令行选项指定副本集名称和 ip 绑定：



## WARNING

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

### 连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到其中一个`mongod`实例。

从其中一个正在运行的同一台机器[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)上（在本教程中，`mongodb0.example.net`），开始 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh). 要连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 默认端口上的侦听本地主机`27017`，只需发出：

```
mongosh
```



根据您的路径，您可能需要指定路径 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)二进制。

如果您`mongod`未在默认端口上运行，请指定 [`--port`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--port)的选项`mongosh`。

3个

### 启动副本集。

从[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)在副本集成员 0 上运行。



## IMPORTANT

仅在副本集的*一个*[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)实例上运行。 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)



## IMPORTANT

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集节点或分片集群节点时，使用DNS主机名而不是IP地址尤为重要。

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

### 查看副本集配置。

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

### 确保副本集有一个主节点。

用于[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)标识副本集中的主节点。



## 提示

### 也可以看看：

[使用密钥文件身份验证部署副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-with-keyfile-access-control/#std-label-deploy-repl-set-with-auth)

←  [副本集部署教程](https://www.mongodb.com/docs/manual/administration/replica-set-deployment/)[部署用于测试和开发的副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-for-testing/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/deploy-replica-set/

译者：陆文龙

