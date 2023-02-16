# 将成员添加到副本集

## 概述[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/expand-replica-set/#overview)

[本教程解释了如何向现有副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)添加额外节点 。有关复制部署模式的背景，请参阅[副本集部署架构](https://www.mongodb.com/docs/manual/core/replica-set-architectures/)文档。

### 最大投票成员[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/expand-replica-set/#maximum-voting-members)

一个副本集最多可以有七个有[投票权的节点](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-election-internals)。要将成员添加到已经有七个投票成员的副本集，您必须将该成员添加 [为非投票节点](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-non-voting-members)或从[`existing member`.](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)

### 初始化脚本[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/expand-replica-set/#init-scripts)

在生产部署中，您可以配置一个[初始化脚本](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-init-script) 来管理节点进程。

### 现有节点[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/expand-replica-set/#existing-members)

您可以使用这些过程将新节点添加到现有集。您还可以使用相同的过程来“重新添加”已删除的节点。如果被删除的节点的数据仍然相对较新，则可以很容易地恢复和赶上。

### 数据文件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/expand-replica-set/#data-files)

如果您有现有节点的备份或快照，您可以将数据文件（例如[`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)目录）移动到新系统并使用它们快速启动新节点

。这些文件必须是：

- 来自同一副本集成员的数据文件的有效副本。有关详细信息，请参阅使用文件系统快照 文档[备份和还原。](https://www.mongodb.com/docs/manual/tutorial/backup-with-filesystem-snapshots/)

  

  ## IMPORTANT

  始终使用文件系统快照来创建现有副本集成员的副本。**不要**使用 [`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)和[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)播种一个新的副本集节点。

- [比主节点作](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary) [日志](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-oplog)中最旧的操作更新。新节点必须能够通过应用主操作日志中的操作成为当前节点。

### IP绑定[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/expand-replica-set/#ip-binding)



## WARNING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

MongoDB 二进制文件，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，默认绑定到 localhost。如果为二进制文件设置了[`net.ipv6`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ipv6)配置文件设置或`--ipv6`命令行选项，则二进制文件还会绑定到本地主机 IPv6 地址。

默认情况下[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)绑定到 localhost 的只接受来自在同一台计算机上运行的客户端的连接。这种绑定行为包括 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)以及您的副本集或分片集群的其他成员。远程客户端无法连接到仅绑定到本地主机的二进制文件。

要覆盖默认绑定并绑定到其他 IP 地址，请使用 [`net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)配置文件设置或`--bind_ip` 命令行选项指定主机名或 IP 地址列表。



## IMPORTANT

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





## IMPORTANT

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集成员或分片集群节点时，使用 DNS 主机名而不是 IP 地址尤为重要。

使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

## 要求[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/expand-replica-set/#requirements)

1. 一个活跃的副本集。
2. 一个新的 MongoDB 系统能够支持您的数据集，活动副本集可以通过网络访问。

否则，请使用 MongoDB[安装教程](https://www.mongodb.com/docs/manual/installation/#std-label-tutorials-installation)和[部署副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/) 教程。

## 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/expand-replica-set/#procedures)

### 准备数据目录[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/expand-replica-set/#prepare-the-data-directory)

在将新节点添加到现有[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)之前，使用以下策略之一准备新节点的[数据目录：](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-dbpath)

- 确保新节点的数据目录*不*包含数据。新成员将从现有节点复制数据。

  如果新节点处于[恢复](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-recovering)状态，它必须退出并成为[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)，然后 MongoDB 才能在复制过程中复制所有数据。此过程需要时间，但不需要管理员干预。

- 从现有节点手动复制数据目录。新节点成为从节点，并将赶上副本集的当前状态。复制数据可能会缩短新节点成为当前节点的时间。

  确保您可以将数据目录复制到新节点，并[在 oplog 允许的窗口](https://www.mongodb.com/docs/manual/core/replica-set-oplog/#std-label-replica-set-oplog-sizing)内开始复制。否则，新实例将必须执行初始同步，这将完全重新同步数据，如[重新同步副本集成员中所述。](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/)

  用于[`rs.printReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/rs.printReplicationInfo/#mongodb-method-rs.printReplicationInfo)检查关于 oplog 的副本集节点的当前状态。

有关复制部署模式的背景，请参阅 [副本集部署架构](https://www.mongodb.com/docs/manual/core/replica-set-architectures/)文档。



### 将成员添加到现有副本集[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/expand-replica-set/#add-a-member-to-an-existing-replica-set)



## IMPORTANT

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集成员或分片集群节点时，使用 DNS 主机名而不是 IP 地址尤为重要。

使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

1. 启动新[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例。指定数据目录和副本集名称。以下示例指定 `/srv/mongodb/db0`数据目录和`rs0`副本集：

   ```
   mongod --dbpath /srv/mongodb/db0 --replSet rs0  --bind_ip localhost,<hostname(s)|ip address(es)>
   ```

   

   

   ## WARNING

   在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

   有关配置选项的更多信息，请参阅 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)手册页。

   

   ## NOTE

   ### 可选的

   `mongod.conf` [您可以在配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)中指定数据目录、副本集名称和ip绑定，并 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)使用以下命令启动：

   ```
   mongod --config /etc/mongod.conf
   ```

   

2. 连接到副本集的主节点。

   您只能在连接到主节点时添加节点。如果您不知道哪个成员是主节点，请登录副本集的任何节点并发出[`db.hello()`](https://www.mongodb.com/docs/manual/reference/method/db.hello/#mongodb-method-db.hello)命令。

3. 用于[`rs.add()`](https://www.mongodb.com/docs/manual/reference/method/rs.add/#mongodb-method-rs.add)将新节点添加到副本集。将 传递[`member configuration document`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)给方法。例如，要在 host 上添加一个节点 `mongodb3.example.net`，请发出以下命令：

   ```
   rs.add( { host: "mongodb3.example.net:27017" } )
   ```

   

   

   ## WARNING

   在 MongoDB 5.0 之前，新添加的从节点仍然算作投票节点，即使它在数据一致之前既不能提供读取服务也不能成为主要节点。如果您运行的是早于 5.0 的 MongoDB 版本并添加一个其[`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes) 和[`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)设置大于零的辅助节点，这可能会导致大多数投票成员在线但无法选举主要节点的情况。为避免这种情况，请考虑最初使用 [`priority :0`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)和添加新的辅助[`votes :0`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)。然后，运行[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)以确保成员已转换为[`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)状态。最后，用于 [`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)更新其优先级和选票。

←  [将 Standalone 转换为副本集](https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/)[从副本集中删除成员](https://www.mongodb.com/docs/manual/tutorial/remove-replica-set-member/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/expand-replica-set/

译者：陆文龙

