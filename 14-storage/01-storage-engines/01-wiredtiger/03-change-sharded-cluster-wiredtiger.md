# 将 Sharded Cluster 更改为 WiredTiger[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#change-sharded-cluster-to-wiredtiger)



## NOTE

从 4.2 版开始，MongoDB 删除了已弃用的 MMAPv1 存储引擎。在从使用 MMAPv1 的 MongoDB 4.0 部署升级到 MongoDB 4.2 之前，您必须先升级到 WiredTiger。

使用本教程更新 MongoDB 4.0 分片集群以使用 [WiredTiger 。](https://www.mongodb.com/docs/manual/core/wiredtiger/#std-label-storage-wiredtiger)

对于早期版本的 MongoDB：

- 要转换使用 MMAPv1 的 3.6 分片集群，请参阅 [MongoDB 3.6 手册。](https://www.mongodb.com/docs/v3.6/tutorial/change-sharded-cluster-wiredtiger/)
- 要转换使用 MMAPv1 的 3.4 分片集群，请参阅 [MongoDB 3.4 手册。](https://www.mongodb.com/docs/v3.4/tutorial/change-sharded-cluster-wiredtiger/)
- 要转换使用 MMAPv1 的 3.2 分片集群，请参阅 [MongoDB 3.2 手册。](https://www.mongodb.com/docs/v3.2/tutorial/change-sharded-cluster-wiredtiger/)

## 注意事项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#considerations)

### 停机时间[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#downtime)

如果更改任何分片的主机或端口[，](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)则还必须更新分片配置。



### PSA 三节点架构[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#psa-3-member-architecture)

从 MongoDB 3.6 开始，[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)默认情况下启用可用于 WiredTiger 的读安全。但是，对于 MongoDB 4.0.3+，如果您有一个具有主从仲裁器 (PSA) 架构的三节点分片副本集，则可以禁用 该分[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)片副本集的读安全。禁用[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)三节点 PSA 架构可避免可能的缓存压力增加。

下面的过程[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)通过包含 [`--enableMajorityReadConcern false`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--enableMajorityReadConcern). 如果您运行的是 MongoDB 4.0.1 或 4.0.2 PSA 架构，请先升级到最新的 4.0 版本以禁用此读取问题。



## NOTE

禁用[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)read concern 对更改流可用性没有影响。

禁用[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)read concern 可防止 [`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)修改索引的命令 [回滚](https://www.mongodb.com/docs/manual/core/replica-set-rollbacks/#std-label-replica-set-rollbacks)。如果需要回滚此类操作，您必须将受影响的节点与 [主](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)节点重新同步。

禁用[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)read concern 会影响对 分片集群上[事务的支持。](https://www.mongodb.com/docs/manual/core/transactions/)具体来说：

- [`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)如果事务涉及已[禁用读取关注“多数”](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#std-label-disable-read-concern-majority)的分片，则事务不能使用read concern [。](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#std-label-disable-read-concern-majority)
- 如果事务的任何读取或写入操作涉及已禁用 read concern 的分片，则写入多个分片错误的事务[`"majority"`。](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)

但是，它不会影响 副本集上的[事务。](https://www.mongodb.com/docs/manual/core/transactions/)对于副本集上的事务，即使禁用了读取关注，您也可以为多文档事务指定读取关注[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)（或[`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-) 或）。[`"local"`](https://www.mongodb.com/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-)[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)

有关 PSA 架构和read concern 的更多信息 [`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)，请参阅[Primary-Secondary-Arbiter Replica Sets 。](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#std-label-disable-read-concern-majority)

### MongoDB 3.0 或更高版本[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#mongodb-3.0-or-greater)

您必须使用 MongoDB 版本 3.0 或更高版本才能使用 WiredTiger 存储引擎。如果使用较早的 MongoDB 版本，您必须在继续更改存储引擎之前升级您的 MongoDB 版本。要升级您的 MongoDB 版本，请参阅相应版本的手册。

### 默认绑定到本地主机[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#default-bind-to-localhost)

MongoDB 二进制文件，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，默认绑定到`localhost`。

### 配置服务器[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#config-servers)

从版本 3.4 开始，配置服务器必须[部署为副本集 (CSRS)](https://www.mongodb.com/docs/manual/release-notes/3.4/#std-label-3.4-remove-sccc)。因此，版本 3.4+ 配置服务器已经使用 WiredTiger 存储引擎。

### XFS 和 WiredTiger[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#xfs-and-wiredtiger)

使用 WiredTiger 存储引擎，在 Linux 上建议使用 XFS 作为数据承载节点。有关详细信息，请参阅 [内核和文件系统。](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-linux-file-system)

### 仅限 MMAPv1 限制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#mmapv1-only-restrictions)

升级到 WiredTiger 后，您的 WiredTiger 部署将**不受** 以下仅限 MMAPv1 的限制：

| MMAPv1 限制        | 简短的介绍                                                   |
| :----------------- | :----------------------------------------------------------- |
| 命名空间数量       | 对于 MMAPv1，命名空间的数量限制为命名空间文件的大小除以 628。 |
| 命名空间文件的大小 | 对于 MMAPv1，命名空间文件不能大于 2047 兆字节。              |
| 数据库大小         | MMAPv1 存储引擎限制每个数据库不超过 16000 个数据文件。       |
| 数据大小           | 对于 MMAPv1，单个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例无法管理超过底层操作系统提供的最大虚拟内存地址空间的数据集。 |
| 数据库中的集合数   | 对于 MMAPv1 存储引擎，数据库中集合的最大数量是命名空间文件大小和数据库中集合索引数量的函数。 |

## 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#procedure)

对于每个副本集[shard](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)，将存储引擎更改为 WiredTiger：

### A. 将从节点更新为 WiredTiger。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#a.-update-the-secondary-members-to-wiredtiger.)

一次更新一个从节点：

 

#### 关闭从节点。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#shut-down-the-secondary-member)

在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), 关闭从节点。

```
use admin
db.shutdownServer()
```



 

#### `mongod`为新运行的 WiredTiger准备一个数据目录。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#prepare-a-data-directory-for-the-new-mongod-running-with-wiredtiger)

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)为将与 WiredTiger 存储引擎一起运行的新实例准备一个数据目录。`mongod`必须对该目录具有读写权限。您可以删除已停止的从节点当前数据目录的内容，也可以完全创建一个新目录。

`mongod`WiredTiger 不会从使用不同存储引擎创建的数据文件开始。

 

#### 更新 WiredTiger 的配置。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#update-configuration-for-wiredtiger)

从[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例配置中删除任何[MMAPv1 特定配置选项。](https://www.mongodb.com/docs/manual/release-notes/4.2/#std-label-4.2-mmapv1-conf-options)

 

#### 从 WiredTiger开始`mongod`。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#start-mongod-with-wiredtiger)

启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，指定`wiredTiger`为 [`--storageEngine`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--storageEngine)和为 WiredTiger 准备的数据目录为[`--dbpath`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)

根据需要指定其他选项，例如 [`--bind_ip`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)



## WRINING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

General Use (For Most Architectures)PSA Architecture

```
mongod --storageEngine wiredTiger --dbpath <newWiredTigerDBPath> --replSet <replSetName> --bind_ip localhost,<hostname(s)|ip address(es)>
```



由于`--dbpath`中不存在任何数据，因此`mongod`将执行 [初始同步](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/)。初始同步过程的长度取决于数据库的大小和副本集节点之间的网络连接。

您还可以在[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)中指定选项。要指定存储引擎，请使用[`storage.engine`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.engine)设置。

对其余从节点重复这些步骤，一次更新一个。

### B. 降级主节点。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#b.-step-down-the-primary.)

一旦所有从节点都升级到 WiredTiger，连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到主节点并用于 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)降低主要并强制选举新的主节点。

```
rs.stepDown()
```



### C.更新旧的主节点。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#c.-update-the-old-primary.)

当主节点降级并成为从节点时，像以前一样更新从节点以使用 WiredTiger：

 

#### 关闭从节点。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#shut-down-the-secondary-member-1)

在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), 关闭从节点。

```
use admin
db.shutdownServer()
```



 

#### `mongod`为新运行的 WiredTiger准备一个数据目录。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#prepare-a-data-directory-for-the-new-mongod-running-with-wiredtiger-1)

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)为将与 WiredTiger 存储引擎一起运行的新实例准备一个数据目录。`mongod`必须对该目录具有读写权限。您可以删除已停止的从节点当前数据目录的内容，也可以完全创建一个新目录。

`mongod`WiredTiger 不会从使用不同存储引擎创建的数据文件开始。

 

#### 更新 WiredTiger 的配置。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#update-configuration-for-wiredtiger-1)

从[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例配置中删除任何[MMAPv1 特定配置选项。](https://www.mongodb.com/docs/manual/release-notes/4.2/#std-label-4.2-mmapv1-conf-options)

 

#### 从 WiredTiger开始`mongod`。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/#start-mongod-with-wiredtiger-1)

启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，指定`wiredTiger`为 [`--storageEngine`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--storageEngine)和为 WiredTiger 准备的数据目录为[`--dbpath`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)

根据需要指定其他选项，例如 [`--bind_ip`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)



## WRINING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

General Use (For Most Architectures)PSA Architecture

```
mongod --storageEngine wiredTiger --dbpath <newWiredTigerDBPath> --replSet <replSetName> --bind_ip localhost,<hostname(s)|ip address(es)>
```



由于`--dbpath`中不存在任何数据，因此`mongod`将执行 [初始同步](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/)。初始同步过程的长度取决于数据库的大小和副本集节点之间的网络连接。

您还可以在[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)中指定选项。要指定存储引擎，请使用[`storage.engine`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.engine)设置。

对其他分片重复该过程。

←  [将副本集更改为 WiredTiger](https://www.mongodb.com/docs/manual/tutorial/change-replica-set-wiredtiger/)[In-Memory Storage Engine](https://www.mongodb.com/docs/manual/core/inmemory/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/change-sharded-cluster-wiredtiger/ 

译者：陆文龙

