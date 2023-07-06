# 将副本集更改为 WiredTiger



## NOTE

### 从 MongoDB 4.2 开始

- `noPadding`和`usePowerOf2Sizes`MMAPv1 选项 [`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)已删除。不要使用这些选项，因为从 MongoDB 4.0 升级到 4.2 会导致 4.2[从节点](https://www.mongodb.com/docs/manual/core/replica-set-members/#std-label-replica-set-secondary-members)立即停止。
- MongoDB 删除了已弃用的 MMAPv1 存储引擎。如果要从使用 MMAPv1 的 MongoDB 4.0 部署升级到 MongoDB 4.2，则必须升级到 WiredTiger。

使用本教程更新副本集以使用[WiredTiger](https://www.mongodb.com/docs/manual/core/wiredtiger/#std-label-storage-wiredtiger)。该过程以滚动方式更新副本集以避免停机。

## 注意事项

副本集可以有具有不同存储引擎的节点。因此，您可以更新节点以滚动方式使用 WiredTiger 存储引擎。



### PSA 三节点架构

[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)默认情况下启用可用于 WiredTiger的读取关注。但是，在具有主从仲裁器 (PSA) 架构的三成员副本集中，您可以禁用 [`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读安全。禁用[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)三节点 PSA 架构的读可避免可能的缓存压力增加。

这[程序](https://www.mongodb.com/docs/manual/tutorial/change-replica-set-wiredtiger/#std-label-change-replica-set-wiredtiger-procedure) 下面[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)通过包含 [`--enableMajorityReadConcern false`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--enableMajorityReadConcern)

[程序](https://www.mongodb.com/docs/manual/tutorial/change-replica-set-wiredtiger/#std-label-change-replica-set-wiredtiger-procedure) 通过包含 [`--enableMajorityReadConcern false`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--enableMajorityReadConcern)禁用 PSA 架构的[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取关注。

## NOTE

禁用[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取关注对更改流可用性没有影响。

有关 PSA 架构和阅读关注的更多信息 [`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)，请参阅[Primary-Secondary-Arbiter Replica Sets 。](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#std-label-disable-read-concern-majority)

### 默认绑定到本地主机

MongoDB 二进制文件，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，默认绑定到`localhost`。

### XFS 和 WiredTiger

使用 WiredTiger 存储引擎，在 Linux 上建议使用 XFS 作为数据承载节点。有关详细信息，请参阅 [内核和文件系统。](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-linux-file-system)

### 仅限 MMAPv1 限制

升级到 WiredTiger 后，您的 WiredTiger 部署将**不受** 以下仅限 MMAPv1 的限制：

| MMAPv1 限制        | 简短的介绍                                                   |
| :----------------- | :----------------------------------------------------------- |
| 命名空间数量       | 对于 MMAPv1，命名空间的数量限制为命名空间文件的大小除以 628。 |
| 命名空间文件的大小 | 对于 MMAPv1，命名空间文件不能大于 2047 兆字节。              |
| 数据库大小         | MMAPv1 存储引擎限制每个数据库不超过 16000 个数据文件。       |
| 数据大小           | 对于 MMAPv1，单个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例无法管理超过底层操作系统提供的最大虚拟内存地址空间的数据集。 |
| 数据库中的集合数   | 对于 MMAPv1 存储引擎，数据库中集合的最大数量是命名空间文件大小和数据库中集合索引数量的函数。 |



## 程序

以下过程以滚动方式更新副本集。该过程首先更新[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)，然后降级[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)，并更新降级的节点。

要将节点更新为 WiredTiger，该过程会删除节点的数据，从[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)WiredTiger 开始，并执行 [初始同步。](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/)

### A. 将从节点更新为 WiredTiger。

一次更新一个从节点：



#### 关闭从节点。

在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), 关闭从节点。

```
use admin
db.shutdownServer()
```





#### `mongod`为新运行的 WiredTiger准备一个数据目录。

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)为将与 WiredTiger 存储引擎一起运行的新实例准备一个数据目录。`mongod`必须对该目录具有读写权限。您可以删除已停止的从节点当前数据目录的内容，也可以完全创建一个新目录。

`mongod`WiredTiger 不会从使用不同存储引擎创建的数据文件开始。

 

#### 更新 WiredTiger 的配置。

从 实例配置中删除任何[MMAPv1 特定配置选项。](https://www.mongodb.com/docs/manual/release-notes/4.2/#std-label-4.2-mmapv1-conf-options)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)



#### 从 WiredTiger开始`mongod`。

开始[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，指定`wiredTiger`为 [`--storageEngine`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--storageEngine)和为 WiredTiger 准备的数据目录为[`--dbpath`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)

根据需要指定其他选项，例如 [`--bind_ip`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)



## WRININIG

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

一般用途（对于大多数架构）PSA架构

```
mongod --storageEngine wiredTiger --dbpath <newWiredTigerDBPath> --replSet <replSetName> --bind_ip localhost,<hostname(s)|ip address(es)>
```



由于 `--dbpath`中不存在任何数据，因此`mongod`将执行 [初始同步](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/)。初始同步过程的时间取决于数据库的大小和副本集节点之间的网络连接。

您还可以在[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)中指定选项。要指定存储引擎，请使用[`storage.engine`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.engine)设置。

对其余从节点重复这些步骤，一次更新一个。

### B. 降级主节点。



## IMPORTANT

如果更新副本集的所有节点以使用 WiredTiger，请确保在更新主节点之前先更新所有从节点。

一旦所有从节点都升级到 WiredTiger，连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到主要并用于 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)降低主节点并强制选举新的主节点。

```
rs.stepDown()
```



### C.更新降级的主节点。

当主节点降级并成为从节点时，像以前一样更新从节点以使用 WiredTiger：

 

#### 关闭从节点。

在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), 关闭从节点。

```
use admin
db.shutdownServer()
```



#### ` mongod`为新运行的 WiredTiger准备一个数据目录。

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)为将与 WiredTiger 存储引擎一起运行的新实例准备一个数据目录。`mongod`必须对该目录具有读写权限。您可以删除已停止的从节点当前数据目录的内容，也可以完全创建一个新目录。

`mongod`WiredTiger 不会从使用不同存储引擎创建的数据文件开始。

 

#### 更新 WiredTiger 的配置。

从 实例配置中删除任何[MMAPv1 特定配置选项。](https://www.mongodb.com/docs/manual/release-notes/4.2/#std-label-4.2-mmapv1-conf-options)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

 

#### 从 WiredTiger开始`mongod`。

开始[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，指定`wiredTiger`为 [`--storageEngine`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--storageEngine)和为 WiredTiger 准备的数据目录为[`--dbpath`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)

根据需要指定其他选项，例如 [`--bind_ip`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)



## WARNING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

一般用途（对于大多数架构）PSA架构

```
mongod --storageEngine wiredTiger --dbpath <newWiredTigerDBPath> --replSet <replSetName> --bind_ip localhost,<hostname(s)|ip address(es)>
```



由于`--dbpath`中不存在任何数据，因此`mongod`将执行 [初始同步](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/)。初始同步过程的长度取决于数据库的大小和副本集节点之间的网络连接。

您还可以在[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)中指定选项。要指定存储引擎，请使用[`storage.engine`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.engine)设置。

←  [将 Standalone 更改为 WiredTiger](https://www.mongodb.com/docs/manual/tutorial/change-standalone-wiredtiger/)[将 Sharded Cluster 更改为 WiredTiger](https://www.mongodb.com/docs/manual/tutorial/change-sharded-cluster-wiredtiger/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/change-replica-set-wiredtiger/

译者：陆文龙

