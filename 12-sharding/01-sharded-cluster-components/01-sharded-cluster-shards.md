**分片**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-shards/#shards)

[分片](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)包含分片集群的分片数据子[集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)。集群的分片一起保存集群的整个数据集。

从 MongoDB 3.6 开始，分片必须部署为[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)以提供冗余和高可用性。

用户、客户端或应用程序应仅直接连接到分片以执行本地管理和维护操作。

对单个分片执行查询只会返回数据的一个子集。连接到[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)以执行集群级别的操作，包括读取或写入操作。

>[IMPORTANT]
>
>MongoDB 不保证任何两个连续的[块](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk) 驻留在单个分片上。

**主分片**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-shards/#primary-shard)

分片集群中的每个数据库都有一个[主](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary-shard)分片，其中包含该数据库的所有未分片集合。每个数据库都有自己的主分片。主分片与副本集中的[主](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)分片无关。

[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)在创建新数据库时，通过选择集群中数据量最少的分片来选择主分片 。[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用命令`totalSize`返回的字段 [`listDatabases`](https://www.mongodb.com/docs/manual/reference/command/listDatabases/#mongodb-dbcommand-dbcmd.listDatabases)作为选择标准的一部分。

![主分片示意图。 主分片包含非分片集合以及来自分片集合的文档块。 分片 A 是主分片。](https://www.mongodb.com/docs/manual/images/sharded-cluster-primary-shard.bakedsvg.svg)

要更改数据库的主分片，请使用[`movePrimary`](https://www.mongodb.com/docs/manual/reference/command/movePrimary/#mongodb-dbcommand-dbcmd.movePrimary) 命令。迁移主分片的过程可能需要很长时间才能完成，在完成之前您不应访问与数据库关联的集合。根据迁移的数据量，迁移可能会影响整个集群操作。在尝试更改主分片之前，请考虑对集群操作和网络负载的影响。

当您使用以前用作副本集的分片部署新的分片[集群时，所有现有数据库将继续驻留在其原始副本集上。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)随后创建的数据库可以驻留在集群中的任何分片上。

**分片状态**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-shards/#shard-status)

使用[`sh.status()`](https://www.mongodb.com/docs/manual/reference/method/sh.status/#mongodb-method-sh.status)方法在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)查看集群的概览。该报告包括哪个分片是数据库的主要分片以及跨分片的[块](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)分布。[`sh.status()`](https://www.mongodb.com/docs/manual/reference/method/sh.status/#mongodb-method-sh.status)有关详细信息，请参阅方法。

**分片集群安全**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-shards/#sharded-cluster-security)

使用[内部/成员身份验证](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)来实施集群内安全并防止未经授权的集群组件访问集群。您必须[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)使用适当的安全设置启动集群中的每个，以强制执行内部身份验证。

从 MongoDB 5.3 开始，[SCRAM-SHA-1](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram-sha-1) 不能用于集群内身份验证。仅 支持[SCRAM-SHA-256](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram-sha-256)。

在以前的 MongoDB 版本中，SCRAM-SHA-1 和 SCRAM-SHA-256 都可以用于集群内身份验证，即使没有明确启用 SCRAM。

有关[部署安全分片集群](https://www.mongodb.com/docs/manual/tutorial/deploy-sharded-cluster-with-keyfile-access-control/)的教程，请参阅使用密钥文件身份验证部署分片集群。

**分片本地用户**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-shards/#shard-local-users)

每个分片都支持[基于角色的访问控制](https://www.mongodb.com/docs/manual/core/authorization/) *(RBAC)*，以限制对分片数据和操作的未授权访问。使用[`--auth`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--auth) 的选项强制 RBAC启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 副本集中的每个副本。或者，为集群内安全实施[内部/成员身份验证也可以通过 RBAC 实现用户访问控制。](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)

从 MongoDB 5.3 开始，[SCRAM-SHA-1](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram-sha-1) 不能用于集群内身份验证。仅 支持[SCRAM-SHA-256](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram-sha-256)。

在以前的 MongoDB 版本中，SCRAM-SHA-1 和 SCRAM-SHA-256 都可以用于集群内身份验证，即使没有明确启用 SCRAM。

每个分片都有自己的分片本地用户。这些用户不能在其他分片上使用，也不能用于通过[`mongos`.](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

有关启用将用户添加到启用 RBAC 的 MongoDB 部署的教程，请参阅[启用访问控制。](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)

 参见

原文 - [Shards]( https://docs.mongodb.com/manual/core/sharded-cluster-shards/ )

译者：景圣
