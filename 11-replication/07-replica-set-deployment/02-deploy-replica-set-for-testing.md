# 部署用于测试和开发的副本集

此过程描述了在开发或测试环境中部署副本集。对于生产部署，请参阅 [部署副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/)教程。

本教程描述了如何从三个在禁用[访问控制](https://www.mongodb.com/docs/manual/core/authorization/)的情况下运行的 现有实例创建一个三节点[副本集。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

要部署启用[访问控制](https://www.mongodb.com/docs/manual/core/authorization/)的副本集，请 [参阅使用密钥文件身份验证部署副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-with-keyfile-access-control/#std-label-deploy-repl-set-with-auth)。如果您希望从单个 MongoDB 实例部署副本集，请参阅 [将独立实例转换为副本集](https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/)。有关副本集部署的更多信息，请参阅[复制](https://www.mongodb.com/docs/manual/replication/)和 [副本集部署架构](https://www.mongodb.com/docs/manual/core/replica-set-architectures/)文档。

## 概述

三个节点[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)提供了足够的冗余来应对大多数网络分区和其他系统故障。这些集合还具有足够的容量用于许多分布式读取操作。副本集应该总是有奇数个节点。这确保了[选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/)能够顺利进行。有关设计副本集的更多信息，请参阅[复制概述。](https://www.mongodb.com/docs/manual/replication/)

## 要求

对于测试和开发系统，您可以[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 在本地系统或虚拟实例中运行您的实例。

在部署副本集之前，您必须在将成为[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)一部分的每个系统上安装 MongoDB 。如果您尚未安装 MongoDB，请参阅[安装教程。](https://www.mongodb.com/docs/manual/installation/#std-label-tutorial-installation)

每个节点都必须能够连接到每个其他节点。有关如何检查您的连接的说明，请参阅 [测试所有节点之间的连接。](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-replica-sets/#std-label-replica-set-troubleshooting-check-connection)

## 注意事项



## IMPORTANT

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集节点或分片集群成员时，使用 DNS 主机名而不是 IP 地址尤为重要。

使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

### IP绑定



## WARNING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

MongoDB 二进制文件，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，默认绑定到 localhost。如果为二进制文件设置了[`net.ipv6`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ipv6)配置文件设置或`--ipv6`命令行选项，则二进制文件还会绑定到本地主机 IPv6 地址。

默认情况下[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)绑定到 localhost 的只接受来自在同一台计算机上运行的客户端的连接。这种绑定行为包括 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)以及您的副本集或分片集群的其他节点。远程客户端无法连接到仅绑定到本地主机的二进制文件。

要覆盖默认绑定并绑定到其他 IP 地址，请使用 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)配置文件设置或`--bind_ip` 命令行选项指定主机名或 IP 地址列表。



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



在这个测试部署中，三个节点在同一台机器上运行。

### 副本集命名



## IMPORTANT

这些说明只能用于测试或开发部署。

此过程中的示例创建一个名为 的新副本集`rs0`。

如果您的应用程序连接到多个副本集，则每个副本集必须具有不同的名称。一些驱动程序按副本集名称对副本集连接进行分组。

## 程序



## IMPORTANT

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集节点或分片集群节点时，使用 DNS 主机名而不是IP地址尤为重要。

使用主机名而不是IP地址来配置跨分割网络水平的集群。从MongoDB5.0开始，仅配置了IP地址的节点将无法通过启动验证而不会启动。

1. 通过发出类似于以下的命令为每个节点创建必要的数据目录：

   ```
   mkdir -p /srv/mongodb/rs0-0  /srv/mongodb/rs0-1 /srv/mongodb/rs0-2
   ```

   

   这将创建名为“rs0-0”、“rs0-1”和“rs0-2”的目录，其中将包含实例的数据库文件。

2. [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)通过发出以下命令在它们自己的 shell 窗口中启动您的实例：

   

   ## WARNING

   在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

   第一个节点：

   ```
   mongod --replSet rs0 --port 27017 --bind_ip localhost,<hostname(s)|ip address(es)> --dbpath /srv/mongodb/rs0-0  --oplogSize 128
   ```

   

   第二个节点：

   ```
   mongod --replSet rs0 --port 27018 --bind_ip localhost,<hostname(s)|ip address(es)> --dbpath /srv/mongodb/rs0-1  --oplogSize 128
   ```

   

   第三个节点：

   ```
   mongod --replSet rs0 --port 27019 --bind_ip localhost,<hostname(s)|ip address(es)> --dbpath /srv/mongodb/rs0-2 --oplogSize 128
   ```

   

   这会将每个实例作为名为`rs0`的副本集的成员启动，每个实例 都在不同的端口上运行，并使用设置指定数据目录的路径[`--dbpath`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)。如果您已经在使用建议的端口，请选择不同的端口。

   实例绑定到本地主机和主机的 ip 地址。

   [`--oplogSize`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--oplogSize)设置减少了每个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例使用的磁盘空间。[[ 1 \]](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-for-testing/#footnote-oplog) 这是测试和开发部署的理想选择，因为它可以防止机器过载。有关此配置选项和其他配置选项的更多信息，请参阅[配置文件选项。](https://www.mongodb.com/docs/manual/reference/configuration-options/)

3. 通过以下方式连接到您的一个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh). 您将需要通过指定其端口号来指示哪个实例。为了简单明了，您可能希望选择第一个，如以下命令所示；

   ```
   mongosh --port 27017
   ```

   

4. 在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), 用于[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)启动副本集。您可以在中创建副本集配置对象[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)环境，如以下示例所示：

   ```
   rsconf = {
     _id: "rs0",
     members: [
       {
        _id: 0,
        host: "<hostname>:27017"
       },
       {
        _id: 1,
        host: "<hostname>:27018"
       },
       {
        _id: 2,
        host: "<hostname>:27019"
       }
      ]
   }
   ```

   

   替换`<hostname>`为您系统的主机名，然后将`rsconf`文件传递给[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)如下：

   ```
   rs.initiate( rsconf )
   ```

   

5. 通过发出以下命令显示当前[副本配置：](https://www.mongodb.com/docs/manual/reference/replica-configuration/)

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
            "host" : "<hostname>:27017",
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
            "host" : "<hostname>:27018",
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
            "host" : "<hostname>:27019",
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
         "replicaSetId" : ObjectId("598f630adc9053c6ee6d5f38")
      }
   }
   ```

   

通过操作随时检查副本集的状态 [`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)。



## 提示

### 也可以看看：

以下 shell 函数的文档以获取更多信息：

- [`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)
- [`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)
- [`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)
- [`rs.add()`](https://www.mongodb.com/docs/manual/reference/method/rs.add/#mongodb-method-rs.add)

您也可以考虑[简单的设置脚本](https://github.com/mongodb/mongo-snippets/blob/master/replication/simple-setup.py) 作为基本自动配置副本集的示例。

有关 MongoDB 中读写语义的详细说明，请参阅[副本集读写语义。](https://www.mongodb.com/docs/manual/applications/replication/)

| [ [1](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-for-testing/#ref-oplog-id1) ] | oplog 可以增长到超过其配置的大小限制以避免删除[`majority commit point`.](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.optimes.lastCommittedOpTime) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |

←  [部署副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/)[部署地理冗余副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/deploy-replica-set-for-testing/

译者：陆文龙

