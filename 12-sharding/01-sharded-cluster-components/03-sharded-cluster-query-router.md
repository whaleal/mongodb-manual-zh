**mongos**

mongos 通过缓存来自配置服务器的元数据来跟踪哪些数据在哪个分片上。 mongos 使用元数据将操作从应用程序和客户端路由到 mongod 实例。 mongos 没有持久状态并且消耗最少的系统资源。

最常见的做法是在与应用程序服务器相同的系统上运行 mongos 实例，但您可以在分片或其他专用资源上维护 mongos 实例。 另见 mongos 数量和分布。

MongoDB[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例将查询和写入操作路由到[分片](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)集群中的分片。[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)从应用程序的角度为分片集群提供唯一的接口。应用程序从不直接与分片连接或通信。

[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)通过缓存来自[配置服务器](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/#std-label-sharded-cluster-config-server)的元数据来跟踪哪些数据在哪个分片上。[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用元数据将操作从应用程序和客户端路由到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)没有*持久* 状态并且消耗最少的系统资源。

最常见的做法是[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)在与应用程序服务器相同的系统上运行[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例，但您可以在分片或其他专用资源上维护[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例。另见[`mongos`数量和分布。](https://www.mongodb.com/docs/manual/core/sharded-cluster-components/#std-label-sharded-cluster-components-distribution)

**路由和结果过程**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#routing-and-results-process)

实例通过以下方式将[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)查询路由到[集群](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)：

1. 确定必须接收查询的[分片列表。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)
2. 在所有目标分片上建立游标。

然后 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 合并来自每个目标分片的数据并返回结果文档。 在 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 检索结果之前，在每个分片上执行某些查询修饰符，例如排序。

在 3.6 版更改：对于在多个分片上运行的聚合操作，如果操作不需要在数据库的主分片上运行，则这些操作可能会将结果路由回 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，然后合并结果。

在两种情况下，管道不符合在 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 上运行的条件。

第一种情况发生在拆分管道的合并部分包含必须在主分片上运行的阶段时。 例如，如果 `$lookup` 需要访问与运行聚合的分片集合位于同一数据库中的未分片集合，则合并必须在主分片上运行。

第二种情况发生在拆分管道的合并部分包含一个可能将临时数据写入磁盘的阶段，例如 `$group`，并且客户端已指定 `allowDiskUse:true`。 在这种情况下，假设合并管道中没有其他阶段需要主分片，则合并将在聚合所针对的分片集中随机选择的分片上运行。

有关聚合工作如何在分片集群查询的组件之间拆分的更多信息，请使用 `explain:true` 作为 [`aggregate()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.aggregate/#mongodb-method-db.collection.aggregate) 调用的参数。 返回将包括三个 json 对象。 `mergeType` 显示合并发生的阶段（“primaryShard”、“anyShard”或“mongos”）。 `splitPipeline` 显示管道中的哪些操作已在各个分片上运行。 `shards` 显示每个分片已完成的工作。

在某些情况下，当分[片键](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)或分片键的前缀是查询的一部分时，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)执行 [针对性操作](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-sharding-mongos-targeted)，将查询路由到集群中的分片子集。

[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)执行一个[广播操作](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-sharding-mongos-broadcast)对于*不*包含分 片[键](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)的查询，将查询路由到集群中的*所有*分片。某些确实包含分片键的查询可能仍会导致广播操作，具体取决于集群中数据的分布和查询的选择性。

看[目标行动与广播行动](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-sharding-query-isolation)有关目标和广播操作的更多信息。

从MongoDB 4.4开始，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)可以支持[对冲读取](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)以尽量减少延迟。看[对冲读取](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)想要查询更多的信息。

**`mongos`如何处理查询修饰符**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#how-mongos-handles-query-modifiers)

**排序**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#sorting)

如果查询结果未排序，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例将打开一个结果游标，该游标是分片上所有游标的“循环法”结果。

**限制**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#limits)

如果查询使用 [`limit()`](https://www.mongodb.com/docs/manual/reference/method/cursor.limit/#mongodb-method-cursor.limit)游标方法限制了结果集的大小，则[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例将该限制传递给分片，然后在将结果返回给客户端之前将限制重新应用到结果。

**跳过**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#skips)

如果查询使用[`skip()`](https://www.mongodb.com/docs/manual/reference/method/cursor.skip/#mongodb-method-cursor.skip) 游标方法指定要跳过的记录数，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)则*不能*将跳过传递给分片，而是从分片中检索未跳过的结果，并在组装完整结果时跳过适当数量的文档。

当与 a 结合使用时[`limit()`](https://www.mongodb.com/docs/manual/reference/method/cursor.limit/#mongodb-method-cursor.limit)， [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)会将*limit*加上[`skip()`](https://www.mongodb.com/docs/manual/reference/method/cursor.skip/#mongodb-method-cursor.skip)的值 传递给分片，以提高这些操作的效率。

**读取首选项和分片**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#read-preference-and-shards)

对于分片集群，在从分片读取时[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)应用[读取首选项](https://www.mongodb.com/docs/manual/core/read-preference/)。所选节点受[读取首选项](https://www.mongodb.com/docs/manual/core/read-preference/)和 [`replication.localPingThresholdMs`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.localPingThresholdMs)设置的约束，并针对每个操作重新评估。

有关读取首选项和分片集群的详细信息，请参阅 [读取首选项和分片。](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#std-label-read-preference-mechanics-sharded-cluster)

**对冲读取**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#hedged-reads)

从 4.4 版本开始，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例可以对冲使用非`primary` [读取偏好](https://www.mongodb.com/docs/manual/core/read-preference/)的读取。通过对冲读取，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例将读取操作路由到每个查询分片的两个副本集节点，并从每个分片的第一个响应者返回结果。为对冲读取操作而发送的附加读取使用[`maxTimeMSForHedgedReads`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.maxTimeMSForHedgedReads) 的 `maxTimeMS`值。

以下操作支持对冲读取：

- [`collStats`](https://www.mongodb.com/docs/manual/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats)
- [`count`](https://www.mongodb.com/docs/manual/reference/command/count/#mongodb-dbcommand-dbcmd.count)
- [`dataSize`](https://www.mongodb.com/docs/manual/reference/command/dataSize/#mongodb-dbcommand-dbcmd.dataSize)
- [`dbStats`](https://www.mongodb.com/docs/manual/reference/command/dbStats/#mongodb-dbcommand-dbcmd.dbStats)
- [`distinct`](https://www.mongodb.com/docs/manual/reference/command/distinct/#mongodb-dbcommand-dbcmd.distinct)
- [`filemd5`](https://www.mongodb.com/docs/manual/reference/command/filemd5/#mongodb-dbcommand-dbcmd.filemd5)
- [`find`](https://www.mongodb.com/docs/manual/reference/command/find/#mongodb-dbcommand-dbcmd.find)
- [`listCollections`](https://www.mongodb.com/docs/manual/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections)
- [`listIndexes`](https://www.mongodb.com/docs/manual/reference/command/listIndexes/#mongodb-dbcommand-dbcmd.listIndexes)
- [`planCacheListFilters`](https://www.mongodb.com/docs/manual/reference/command/planCacheListFilters/#mongodb-dbcommand-dbcmd.planCacheListFilters)

**对冲阅读和阅读偏好**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#hedged-reads-and-read-preference)

对冲读取在每个操作中指定为[读取首选项](https://www.mongodb.com/docs/manual/core/read-preference/)的一部分。非`primary` [阅读偏好](https://www.mongodb.com/docs/manual/core/read-preference/)支持对冲阅读。请参阅[对冲阅读偏好选项。](https://www.mongodb.com/docs/manual/core/read-preference-hedge-option/#std-label-read-preference-hedged-read)

- 要为非`primary`读取首选项指定对冲读取，请参阅驱动程序[阅读首选项 API 文档。](https://www.mongodb.com/docs/drivers/)
- 读取首[`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest)选项默认启用对冲读取选项。

有关读取首选项和分片集群以及节点选择的详细信息，请参阅[读取首选项和碎片。](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#std-label-read-preference-mechanics-sharded-cluster)

**启用/禁用对冲读取的支持**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#enable-disable-support-for-hedged-reads)

默认情况下，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例支持使用对冲读取。要关闭[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例对对冲读取的支持，请参阅[`readHedgingMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.readHedgingMode)参数。如果对冲读取支持是`off`，则无论为读取首选项指定的选项[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)如何，都不使用对冲读取。`hedge`

**对冲读取诊断**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#hedged-reads-diagnostics)

命令[`serverStatus`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)及其对应 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)方法[`db.serverStatus()`](https://www.mongodb.com/docs/manual/reference/method/db.serverStatus/#mongodb-method-db.serverStatus)返回 [`hedgingMetrics`。](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.hedgingMetrics)

**确认连接到`mongos`实例**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#confirm-connection-to-mongos-instances)

要检测您的客户端连接到的 MongoDB 实例是否为[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，请使用[`hello`](https://www.mongodb.com/docs/manual/reference/command/hello/#mongodb-dbcommand-dbcmd.hello)命令。当客户端连接到 a[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)时，[`hello`](https://www.mongodb.com/docs/manual/reference/command/hello/#mongodb-dbcommand-dbcmd.hello)返回一个`msg`包含包含字符串的字段 的文档`isdbgrid`。例如：

```json
{
   "isWritablePrimary" : true,
   "msg" : "isdbgrid",
   "maxBsonObjectSize" : 16777216,
   "ok" : 1,
   ...
}
```

如果应用程序改为连接到  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，则返回的文档不包含该`isdbgrid`字符串。

**目标行动与广播行动**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#targeted-operations-vs.-broadcast-operations)

通常，分片环境中最快的查询是那些 使用分[片键和来自](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)[配置服务器](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/#std-label-sharding-config-server)的集群元数据[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)路由到单个分片的查询。这些[有针对性的行动](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-sharding-mongos-targeted)使用分片键值定位满足查询文档的分片或分片子集。

对于不包含分片键的查询，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)必须查询所有分片，等待它们的响应，然后将结果返回给应用程序。这些“分散/聚集”查询可以是长时间运行的操作。

**广播业务**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#broadcast-operations)

[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例向集合的所有分片广播查询，**除非**[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)可以确定哪个分片或分片子集存储此数据。

![对分片集群的读取操作。 查询条件不包括分片键。 查询路由器 ``mongos`` 必须向集合的所有分片广播查询。](https://www.mongodb.com/docs/manual/images/sharded-cluster-scatter-gather-query.bakedsvg.svg)

在[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)收到所有分片的响应后，它会合并数据并返回结果文档。广播操作的性能取决于集群的整体负载，以及网络延迟、单个分片负载和每个分片返回的文档数量等变量。只要有可能，支持导致以下结果的操作[针对性操作](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-sharding-mongos-targeted)超过那些导致广播操作的。

多次更新操作始终是广播操作。

和方法是广播操作[`updateMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany)， [`deleteMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/#mongodb-method-db.collection.deleteMany)除非查询文档完整指定分片键。

**针对性操作**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#targeted-operations)

[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)可以将包含分片键或[复合](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-compound-index)分片键前缀的查询路由到特定分片或一组分片。[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)使用分片键值定位其范围包括分片键值的 [块](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)，并将查询定向到[包含](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)该块的分片。

![对分片集群的读取操作。 查询条件包括分片键。 查询路由器“mongos”可以将查询定位到适当的分片或分片。](https://www.mongodb.com/docs/manual/images/sharded-cluster-targeted-query.bakedsvg.svg)

例如，如果分片键是：

```json
{ a: 1, b: 1, c: 1 }
```

该[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)程序*可以*在特定分片或一组分片中路由包含完整分片键或以下任一分片键前缀的查询：

```json
{ a: 1 }
{ a: 1, b: 1 }
```

所有[`insertOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)操作都针对一个分片。数组中的每个文档都[`insertMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany)指向单个分片，但不能保证数组中的所有文档都插入到单个分片中。

所有[`updateOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne), [`replaceOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.replaceOne/#mongodb-method-db.collection.replaceOne)和[`deleteOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/#mongodb-method-db.collection.deleteOne) 操作*必须*包含分片[键](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)或`_id`在查询文档中。如果在没有分片键或`_id`.

根据集群中数据的分布和查询的选择性，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)可能仍然会执行一个[广播操作](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-sharding-mongos-broadcast)来满足这些查询。

**索引使用**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#index-use)

当分片收到查询时，它会使用最有效的索引来完成该查询。使用的索引可以是分 [片键索引](https://www.mongodb.com/docs/manual/core/sharding-shard-key/#std-label-sharding-shard-key-indexes)或分片上存在的另一个合格索引。

**分片集群安全**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#sharded-cluster-security)

使用[内部/节点身份验证](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)来实施集群内安全并防止未经授权的集群组件访问集群。您必须使用适当的安全设置启动每个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)在集群中以强制执行内部身份验证。

从 MongoDB 5.3 开始，[SCRAM-SHA-1](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram-sha-1) 不能用于集群内身份验证。仅 支持[SCRAM-SHA-256](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram-sha-256)。

在以前的 MongoDB 版本中，SCRAM-SHA-1 和 SCRAM-SHA-256 都可以用于集群内身份验证，即使没有明确启用 SCRAM。

有关[部署安全分片集群](https://www.mongodb.com/docs/manual/tutorial/deploy-sharded-cluster-with-keyfile-access-control/)的教程，请参阅使用密钥文件身份验证部署分片集群。

**集群用户**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#cluster-users)

分片集群支持[基于角色的访问控制](https://www.mongodb.com/docs/manual/core/authorization/) *(RBAC)*，用于限制对集群数据和操作的未授权访问。您必须使用选项启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)集群中的每个服务器，包括[配置服务器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-server)，[`--auth`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--auth)以强制执行 RBAC。或者，为集群间安全实施[内部/节点身份验证也可以通过 RBAC 实现用户访问控制。](https://www.mongodb.com/docs/manual/core/security-internal-authentication/)

强制执行 RBAC 后，客户必须指定一个[`--username`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--username), [`--password`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password)， 和 [`--authenticationDatabase`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationDatabase)当连接到[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)以访问集群资源时。

每个集群都有自己的集群用户。这些用户不能用于访问单个分片。

有关启用将用户添加到启用 RBAC 的 MongoDB 部署的教程，请参阅[启用访问控制。](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)

**元数据操作**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#metadata-operations)

[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)[`"majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)对影响分片集群元数据的以下操作使用写关注：

| 命令                                                         | 方法                                                         | 笔记                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :-------------------- |
| [`addShard`](https://www.mongodb.com/docs/manual/reference/command/addShard/#mongodb-dbcommand-dbcmd.addShard) | [`sh.addShard()`](https://www.mongodb.com/docs/manual/reference/method/sh.addShard/#mongodb-method-sh.addShard) |                       |
| [`create`](https://www.mongodb.com/docs/manual/reference/command/create/#mongodb-dbcommand-dbcmd.create) | [`db.createCollection()`](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection) |                       |
| [`drop`](https://www.mongodb.com/docs/manual/reference/command/drop/#mongodb-dbcommand-dbcmd.drop) | [`db.collection.drop()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.drop/#mongodb-method-db.collection.drop) |                       |
| [`dropDatabase`](https://www.mongodb.com/docs/manual/reference/command/dropDatabase/#mongodb-dbcommand-dbcmd.dropDatabase) | [`db.dropDatabase()`](https://www.mongodb.com/docs/manual/reference/method/db.dropDatabase/#mongodb-method-db.dropDatabase) | 在 MongoDB 3.6 中更改 |
| [`enableSharding`](https://www.mongodb.com/docs/manual/reference/command/enableSharding/#mongodb-dbcommand-dbcmd.enableSharding) | [`sh.enableSharding()`](https://www.mongodb.com/docs/manual/reference/method/sh.enableSharding/#mongodb-method-sh.enableSharding) |                       |
| [`movePrimary`](https://www.mongodb.com/docs/manual/reference/command/movePrimary/#mongodb-dbcommand-dbcmd.movePrimary) |                                                              |                       |
| [`renameCollection`](https://www.mongodb.com/docs/manual/reference/command/renameCollection/#mongodb-dbcommand-dbcmd.renameCollection) | [`db.collection.renameCollection()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.renameCollection/#mongodb-method-db.collection.renameCollection) |                       |
| [`shardCollection`](https://www.mongodb.com/docs/manual/reference/command/shardCollection/#mongodb-dbcommand-dbcmd.shardCollection) | [`sh.shardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection) |                       |
| [`removeShard`](https://www.mongodb.com/docs/manual/reference/command/removeShard/#mongodb-dbcommand-dbcmd.removeShard) |                                                              |                       |
| [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion) |                                                              |                       |

**附加信息**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#additional-information)

**燃料电池汽车兼容性**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#fcv-compatibility)

当[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)尝试连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)其 [功能兼容版本 (fCV)](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)大于[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos). 例如，您不能将 MongoDB 4.0版本连接[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)到[fCV](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)设置为4.2的4.2分 片集群。但是，您可以将 MongoDB 4.0版本 连接到4.2分片集群，并将[fCV](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)设置为4.0 。[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

**连接池**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#connection-pools)

从 MongoDB 4.2 开始，MongoDB 添加了参数 [`ShardingTaskExecutorPoolReplicaSetMatching`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ShardingTaskExecutorPoolReplicaSetMatching). 这个参数决定了 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)/[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例的连接池到分片集群的每个节点的最小大小。该值在运行时可能会有所不同。

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)并[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)为分片集群中的每个副本集维护到每个副本集的连接池。默认情况下，这些池的连接数至少是与主池的连接数。

要修改，请参阅[`ShardingTaskExecutorPoolReplicaSetMatching`。](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ShardingTaskExecutorPoolReplicaSetMatching)

**将聚合管道与集群一起使用**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#using-aggregation-pipelines-with-clusters)

有关分片如何与[聚合](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/#std-label-aggregation-pipeline)一起工作的更多信息，请阅读[实用的 MongoDB 聚合](https://www.practical-mongodb-aggregations.com/guides/sharding.html) 电子书。

 参见

原文 - [Router (mongos)]( https://docs.mongodb.com/manual/core/sharded-cluster-query-router/ )

译者：陆文龙
