# **配置服务器**

>IMPORTANT
>
>从 3.4 开始，`mongod` 不再支持使用已弃用的镜像实例作为配置服务器 (SCCC)。在将分片集群升级到 3.4 之前，必须将配置服务器从 SCCC 转换为 CSRS。
>
>要将您的配置服务器从 SCCC 转换为 CSRS，请参阅 MongoDB 3.4 手册`将配置服务器升级到副本集`

配置服务器存储分片集群的元数据。 元数据反映了分片集群中所有数据和组件的状态和组织。元数据包括每个分片上的块列表和定义块的范围。

mongos 实例缓存此数据并使用它来将读取和写入操作路由到正确的分片。当集群的元数据发生变化时`mongos`更新缓存，例如添加分片。分片还从配置服务器读取块元数据。

配置服务器还存储身份验证配置信息，例如基于角色的访问控制或集群的内部身份验证设置。

MongoDB 还使用配置服务器来管理分布式锁。

每个分片集群必须有自己的配置服务器。不要对不同的分片集群使用相同的配置服务器。

>WARNING
>
>在配置服务器上进行的管理操作可能会对分片集群的性能和可用性产生重大影响。根据受影响的配置服务器的数量，集群可能会在一段时间内处于只读或离线状态。

**副本集配置服务器**

*3.4版本中的变更*。

从 MongoDB 3.2 开始，分片集群的配置服务器可以部署为副本集(CSRS)，而不是三个镜像配置服务器 (SCCC)。配置服务器使用副本集可以提高配置服务器之间的一致性，因为 MongoDB 可以利用配置数据的标准副本集读写协议。此外，为配置服务器使用副本集允许分片集群拥有超过 3 个配置服务器，因为副本集最多可以有 50 个节点。要将配置服务器部署为副本集，配置服务器必须运行WiredTiger 存储引擎。

在 3.4 版中，MongoDB删除了对 SCCC 配置服务器的支持。

用于配置服务器时，以下限制适用于副本集配置：

- 必须有零仲裁者。
- 必须没有延迟节点。
- 必须建立索引（即任何节点都不应将 `members[n].buildIndexes`设置设置为 false）。

**配置服务器上的读写操作**

`admin`数据库和配置数据库存在于配置服务器上。

**写入配置服务器**

admin 数据库包含与身份验证和授权相关的集合以及其他 system.* 供内部使用的集合。

配置数据库包含包含分片集群元数据的集合。MongoDB 在元数据发生变化时将数据写入配置数据库，例如在[块迁移](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/)或[块拆分之后。](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/)

用户在正常操作或维护过程中应避免直接写入配置数据库。

写入配置服务器时，[MongoDB](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-w)使用`"majority"`.

**从配置服务器读取**

MongoDB 从`admin`数据库中读取身份验证和授权数据以及其他内部用途。

MongoDB 在启动时或元数据发生更改后（例如块迁移后）从`config`数据库中读取。[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)分片还从配置服务器读取块元数据。

从副本集配置服务器读取时，MongoDB 使用 [Read Concern](https://www.mongodb.com/docs/manual/reference/read-concern/)级别[`"majority"`。](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)

**配置服务器可用性**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/#config-server-availability)

如果配置服务器副本集丢失了它的主节点并且不能选出一个主节点，集群的元数据就会变成*只读*的。您仍然可以从分片读取和写入数据，但是在副本集可以选择主副本之前不会发生块迁移或块拆分。

在分片集群中，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)监控分片集群中的副本集（例如分片副本集，配置服务器副本集）。

如果所有配置服务器都不可用，则集群可能无法运行。为确保配置服务器保持可用和完整，配置服务器的备份至关重要。与存储在集群中的数据相比，配置服务器上的数据较小，配置服务器的活动负载相对较低。

对于3.2分片集群，如果连续尝试监控config server副本集失败次数超过 [`replMonitorMaxFailedChecks`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.replMonitorMaxFailedChecks)参数值，监控 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)或[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例将无法使用，直到您重启实例。看 [v3.2 故障排除指南](https://www.mongodb.com/docs/v3.2/tutorial/troubleshoot-sharded-clusters/#a-config-server-replica-set-member-become-unavailable) 解决方法。

有关详细信息，请参阅[配置服务器副本集节点变得不可用](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-sharded-clusters/#std-label-sharding-config-servers-and-availability)。

**分片集群元数据**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/#sharded-cluster-metadata)

配置服务器将元数据存储在[配置数据库中。](https://www.mongodb.com/docs/manual/reference/config-database/)

>[IMPORTANT]
>
>在对配置服务器进行任何维护之前，请始终备份`config`数据库。

要访问`config`数据库，请在中发出以下命令 [`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```shell
use config
```

通常，您不应该*直接*编辑`config` 数据库的内容。该`config`数据库包含以下集合：

- [`changelog`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.changelog)
- [`chunks`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.chunks)
- [`collections`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.collections)
- [`databases`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.databases)
- [`lockpings`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.lockpings)
- [`locks`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.locks)
- [`mongos`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.mongos)
- [`settings`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.settings)
- [`shards`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.shards)
- [`version`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.version)

有关这些集合及其在分片集群中的作用的更多信息，请参阅[配置数据库](https://www.mongodb.com/docs/manual/reference/config-database/)。看 [配置服务器上的读写操作](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/#std-label-config-server-read-write-ops)有关读取和更新元数据的更多信息。

**分片集群安全**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/#sharded-cluster-security)

使用[内部/节点身份验证](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)来实施集群内安全并防止未经授权的集群组件访问集群。您必须[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)使用适当的安全设置启动集群中的每个，以强制执行内部身份验证。

从 MongoDB 5.3 开始，[SCRAM-SHA-1](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram-sha-1) 不能用于集群内身份验证。仅 支持[SCRAM-SHA-256](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram-sha-256)。

在以前的 MongoDB 版本中，SCRAM-SHA-1 和 SCRAM-SHA-256 都可以用于集群内身份验证，即使没有明确启用 SCRAM。

有关[部署安全分片集群](https://www.mongodb.com/docs/manual/tutorial/deploy-sharded-cluster-with-keyfile-access-control/)的教程，请参阅使用密钥文件身份验证部署分片集群。

 参见

原文 - [Config Servers (metadata)]( https://docs.mongodb.com/manual/core/sharded-cluster-config-servers/ )

译者：陆文龙
