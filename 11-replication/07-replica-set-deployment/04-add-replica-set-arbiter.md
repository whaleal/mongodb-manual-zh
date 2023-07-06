# 将仲裁器添加到副本集

在某些情况下（比如你有一个主节点和一个从节点，但成本限制禁止添加另一个次要的），你可以选择将一个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例添加到副本集作为 [仲裁者](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/)在选举中投票。

仲裁者是[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)的一部分但不保存数据（即不提供数据冗余）的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例 。但是，他们可以参加[选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)[。](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)

仲裁器对资源的要求极低，不需要专用硬件。您可以在应用程序服务器或监控主机上部署仲裁器。



## IMPORTANT

不要在同时托管副本集的主要或次要成员的系统上运行仲裁程序。



## WARNING

避免在[副本集中](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)部署多个[仲裁器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-arbiter)。请参阅[对多个仲裁者的关注](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/#std-label-rollbacks-multi-arbiters)[。](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/#std-label-rollbacks-multi-arbiters)

将仲裁器添加到现有副本集：

- 通常，如果副本集中有两个或更少的数据承载节点，您可能需要首先为副本集设置[集群范围的写关注](https://www.mongodb.com/docs/manual/reference/command/setDefaultRWConcern/#std-label-set_global_default_write_concern)。
- 有关为什么可能需要设置[集群范围写入关注的更多信息，请参阅集群范围写入关注。](https://www.mongodb.com/docs/manual/reference/command/setDefaultRWConcern/#std-label-set_global_default_write_concern)

在使用仲裁器启动新的副本集之前，您不需要更改集群范围的写关注。



## TIP

### 也可以看看：

[默认写入关注公式](https://www.mongodb.com/docs/manual/reference/mongodb-defaults/#std-label-default-wc-formula)

## 注意事项

[季度快速发布](https://www.mongodb.com/docs/manual/reference/versioning/#std-label-release-version-numbers)版本不支持 [仲裁](https://www.mongodb.com/docs/manual/core/replica-set-members/#std-label-replica-set-arbiters)器。如果您的部署包括仲裁程序，请仅使用 LTS版本。

## Primary-Secondary-Arbiter 副本集

如果您使用的是三节点主从仲裁器 (PSA) 架构，请考虑以下事项：

- [`"majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)如果辅助节点不可用或滞后，写入问题可能会导致性能问题。有关如何缓解这些问题的建议，请参阅 [缓解 PSA 副本集的性能问题。](https://www.mongodb.com/docs/manual/tutorial/mitigate-psa-performance-issues/#std-label-performance-issues-psa)
- 如果您使用的是全局默认值[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-) 并且写入问题小于大多数的大小，则您的查询可能会返回陈旧（未完全复制）的数据。

### 副本集协议版本



## NOTE

对于以下 MongoDB 版本，与具有仲裁器的副本集相比 （MongoDB 4.0+ 不再支持）`pv1`增加了回滚的可能性：[`w:1`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)`pv0`

- MongoDB 3.4.1
- MongoDB 3.4.0
- MongoDB 3.2.11 或更早版本

请参阅[副本集协议版本。](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/)

### 仲裁者

仲裁器不存储数据，但在仲裁器的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 进程被添加到副本集之前，仲裁器将像任何其他 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)进程一样运行，并以一组数据文件和一个完整大小的[日志启动。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-journal)

### IP绑定



## WARNING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

MongoDB 二进制文件，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，默认绑定到 localhost。如果为二进制文件设置了[`net.ipv6`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ipv6)配置文件设置或`--ipv6`命令行选项，则二进制文件还会绑定到本地主机 IPv6 地址。

默认情况下[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)绑定到 localhost 的只接受来自在同一台计算机上运行的客户端的连接。这种绑定行为包括 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)以及您的副本集或分片集群的其他成员。远程客户端无法连接到仅绑定到本地主机的二进制文件。

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





## IMPORTANT

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集节点或分片集群节点时，使用 DNS 主机名而不是 IP 地址尤为重要。

使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

## 添加仲裁者



## WARNING

避免在[副本集中](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)部署多个[仲裁器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-arbiter)。请参阅[对多个仲裁者的关注](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/#std-label-rollbacks-multi-arbiters)[。](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/#std-label-rollbacks-multi-arbiters)

将仲裁器添加到现有副本集：

- 通常，如果副本集中有两个或更少的数据承载节点，您可能需要首先为副本集设置[集群范围的写关注](https://www.mongodb.com/docs/manual/reference/command/setDefaultRWConcern/#std-label-set_global_default_write_concern)。
- 有关为什么可能需要设置[集群范围写入关注的更多信息，请参阅集群范围写入关注。](https://www.mongodb.com/docs/manual/reference/command/setDefaultRWConcern/#std-label-set_global_default_write_concern)

在使用仲裁器启动新的副本集之前，您不需要更改集群范围的写关注。



## TIP

### 也可以看看：

[默认写入关注公式](https://www.mongodb.com/docs/manual/reference/mongodb-defaults/#std-label-default-wc-formula)



## IMPORTANT

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集成员或分片集群节点时，使用 DNS 主机名而不是 IP 地址尤为重要。

使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

1. [`storage.dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)为仲裁器创建数据目录（例如）。该[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例将目录用于配置数据。该目录*将不*保存数据集。例如，创建`/var/lib/mongodb/arb`目录：

   ```
   mkdir /var/lib/mongodb/arb
   ```

   

2. 启动仲裁器，指定数据目录和要加入的副本集的名称。以下启动一个仲裁器，使用和 `/var/lib/mongodb/arb` 作为副本集名称：[`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)`rs`

   

   ## WARNING

   在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

   ```
   mongod --port 27017 --dbpath /var/lib/mongodb/arb --replSet rs --bind_ip localhost,<hostname(s)|ip address(es)>
   ```

   

3. 连接到主节点并将仲裁器添加到副本集。使用该[`rs.addArb()`](https://www.mongodb.com/docs/manual/reference/method/rs.addArb/#mongodb-method-rs.addArb)方法，如以下示例所示，它假定`m1.example.net`是与仲裁器的指定 IP 地址相关联的主机名：

   ```
   rs.addArb("m1.example.net:27017")
   ```

   

   此操作添加在主机端口`27017`上 运行的仲裁程序。`m1.example.net`

←  [部署地理冗余副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-geographically-distributed-replica-set/)      [将 Standalone 转换为副本集](https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/add-replica-set-arbiter/

译者：陆文龙

