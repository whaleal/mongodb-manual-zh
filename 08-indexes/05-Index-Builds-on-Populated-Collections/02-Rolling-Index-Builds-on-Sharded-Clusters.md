## 滚动索引构建在分片集群上

索引构建会影响分片集群的性能。默认情况下，MongoDB 4.4 及更高版本会在所有数据承载副本集成员上同时构建索引。分片集群上的索引构建仅发生在包含正在索引的集合的数据的分片上。对于无法容忍因索引构建而导致性能下降的工作负载，请考虑使用以下过程以滚动方式构建索引。

滚动索引构建一次最多取出一个分片副本集成员（从次要成员开始），并在该成员上独立构建索引。滚动索引构建需要每个分片至少进行一次副本集选举。

### 注意事项

#### 唯一索引

要使用以下过程创建[唯一索引，您必须在此过程期间停止对集合的所有写入。](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)

如果在此过程中无法停止对集合的所有写入，请不要使用本页上的过程。[`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)相反，通过在[`mongos`](https://www.mongodb.com/docs/v7.0/reference/program/mongos/#mongodb-binary-bin.mongos)分片集群上发出 来在集合上构建唯一索引。

#### 操作日志大小

确保您的[oplog](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-oplog)足够大，以允许索引或重新索引操作完成，而不会落后太远而无法赶上。 有关更多信息，请参阅[oplog 大小调整文档。](https://www.mongodb.com/docs/v7.0/core/replica-set-oplog/#std-label-replica-set-oplog-sizing)

### 先决条件

**用于构建唯一索引**

1. 要使用以下过程创建[唯一索引，您必须在索引构建期间停止对集合的所有写入。](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)否则，您可能会在副本集成员之间得到不一致的数据。如果无法停止对集合的所有写入，请勿使用以下过程创建唯一索引。

   > **警告**
   >
   > 如果无法停止对集合的所有写入，请勿使用以下过程创建唯一索引。

2. 在创建索引之前，请验证集合中没有文档违反索引约束。如果集合分布在分片上，并且分片包含具有重复文档的块，则创建索引操作可能会在没有重复项的分片上成功，但不会在有重复项的分片上成功。为了避免在分片之间留下不一致的索引，您可以发出 [`db.collection.dropIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex)from a[`mongos`](https://www.mongodb.com/docs/v7.0/reference/program/mongos/#mongodb-binary-bin.mongos)从集合中删除索引。

### 过程

> **重要的:**
>
> 以下以滚动方式构建索引的过程适用于分片集群部署，不适用于副本集部署。有关副本集的过程，请参阅 [在副本集上构建滚动索引](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-replica-sets/)。

#### A. 停止平衡器

连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到[`mongos`](https://www.mongodb.com/docs/v7.0/reference/program/mongos/#mongodb-binary-bin.mongos) 分片集群中的实例，并运行[`sh.stopBalancer()`](https://www.mongodb.com/docs/v7.0/reference/method/sh.stopBalancer/#mongodb-method-sh.stopBalancer)以禁用平衡器：[[ 1 \]](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/#footnote-autosplit-stop)

```
sh.stopBalancer()
```

> 笔记:
>
> 如果迁移正在进行中，系统将在停止平衡器之前完成正在进行的迁移。

要验证平衡器是否已禁用，请运行 [`sh.getBalancerState()`](https://www.mongodb.com/docs/v7.0/reference/method/sh.getBalancerState/#mongodb-method-sh.getBalancerState)，如果平衡器已禁用，则返回 false：

```
sh.getBalancerState()
```

| [ [1 ](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/#ref-autosplit-stop-id1)] | 从 MongoDB 6.1 开始，不再执行自动块分割。这是因为平衡政策的改进。自动分割命令仍然存在，但不执行操作。有关详细信息，请参阅 [平衡策略更改。](https://www.mongodb.com/docs/v7.0/release-notes/6.1/#std-label-release-notes-6.1-balancing-policy-changes)在 6.1 之前的 MongoDB 版本中，[`sh.stopBalancer()`](https://www.mongodb.com/docs/v7.0/reference/method/sh.stopBalancer/#mongodb-method-sh.stopBalancer) 还禁用分片集群的自动拆分。 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |

#### B. 确定集合的分布

从[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到 [`mongos`](https://www.mongodb.com/docs/v7.0/reference/program/mongos/#mongodb-binary-bin.mongos)，刷新缓存的路由表以 [`mongos`](https://www.mongodb.com/docs/v7.0/reference/program/mongos/#mongodb-binary-bin.mongos)避免返回集合的过时分布信息。刷新后，运行 [`db.collection.getShardDistribution()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.getShardDistribution/#mongodb-method-db.collection.getShardDistribution)您想要构建索引的集合。

例如，如果要在数据库`records`中的集合上创建升序索引`test`：

```
db.adminCommand( { flushRouterConfig: "test.records" } );
db.records.getShardDistribution();
```

该方法输出分片分布。例如，考虑一个具有 3 个分片`shardA`、`shardB`和的分片集群，`shardC` 并且[`db.collection.getShardDistribution()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.getShardDistribution/#mongodb-method-db.collection.getShardDistribution)返回以下内容：

```
Shard shardA at shardA/s1-mongo1.example.net:27018,s1-mongo2.example.net:27018,s1-mongo3.example.net:27018
 data : 1KiB docs : 50 chunks : 1
 estimated data per chunk : 1KiB
 estimated docs per chunk : 50
Shard shardC at shardC/s3-mongo1.example.net:27018,s3-mongo2.example.net:27018,s3-mongo3.example.net:27018
 data : 1KiB docs : 50 chunks : 1
 estimated data per chunk : 1KiB
 estimated docs per chunk : 50
Totals
 data : 3KiB docs : 100 chunks : 2
 Shard shardA contains 50% data, 50% docs in cluster, avg obj size on shard : 40B
 Shard shardC contains 50% data, 50% docs in cluster, avg obj size on shard : 40B
```

`test.records`从输出中，您只需为on `shardA`和构建索引`shardC`。

#### C. 在包含集合块的分片上建立索引

对于包含集合块的每个分片，请按照在分片上构建索引的过程进行操作。

##### C1. 停止一个辅助节点并重新启动为独立节点。

对于受影响的分片，停止[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)与其辅助分片之一关联的进程。进行以下配置更新后重新启动：

如果您使用配置文件，请进行以下配置更新：

- 更改[`net.port`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-net.port)为不同的端口。[[ 2 \]](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/#footnote-different-port) 记下原始端口设置作为注释。
- 注释掉该[`replication.replSetName`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-replication.replSetName)选项。
- 注释掉该[`sharding.clusterRole`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-sharding.clusterRole)选项。
- 将参数设置[`skipShardingConfigurationChecks`](https://www.mongodb.com/docs/v7.0/reference/parameters/#mongodb-parameter-param.skipShardingConfigurationChecks) 为部分`true`中的[`setParameter`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-setParameter)。
- 将参数设置`disableLogicalSessionCacheRefresh`为 部分`true`中的[`setParameter`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-setParameter)。

例如，对于分片副本集成员，更新后的配置文件将包含类似以下示例的内容：

```
net:
   bindIp: localhost,<hostname(s)|ip address(es)>
   port: 27218
#   port: 27018
#replication:
#   replSetName: shardA
#sharding:
#   clusterRole: shardsvr
setParameter:
   skipShardingConfigurationChecks: true
   disableLogicalSessionCacheRefresh: true
```

并重新启动：

```
mongod --config <path/To/ConfigFile>
```

其他设置（例如[`storage.dbPath`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-storage.dbPath)等）保持不变。

| [ 2 ] | *( [1](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/#ref-different-port-id2) , [2](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/#ref-different-port-id3) )* 通过[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在不同的端口上运行，可以确保副本集的其他成员和所有客户端在构建索引时不会联系该成员。 |
| ----- | ------------------------------------------------------------ |

##### C2.建立索引

直接连接到[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在新端口上作为独立运行的实例，并为此实例创建新索引。

例如，连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到实例，并使用该方法在集合的字段[`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)上创建升序索引 ：`username``records`

```
db.records.createIndex( { username: 1 } )
```

##### C3.`mongod`作为副本集成员重新启动程序

索引构建完成后，关闭[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。撤消作为独立启动时所做的配置更改，以返回到其原始配置并重新启动。

> 重要的:
>
> 一定要去掉 [`skipShardingConfigurationChecks`](https://www.mongodb.com/docs/v7.0/reference/parameters/#mongodb-parameter-param.skipShardingConfigurationChecks)参数和 `disableLogicalSessionCacheRefresh`参数。

例如，要重新启动副本集分片成员：

如果您使用配置文件：

- 恢复到原来的端口号。
- 取消注释[`replication.replSetName`.](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-replication.replSetName)
- 取消注释[`sharding.clusterRole`.](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-sharding.clusterRole)
- 删除[`skipShardingConfigurationChecks`](https://www.mongodb.com/docs/v7.0/reference/parameters/#mongodb-parameter-param.skipShardingConfigurationChecks) 该[`setParameter`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-setParameter)部分中的参数。
- 删除`disableLogicalSessionCacheRefresh` 该[`setParameter`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-setParameter)部分中的参数。

```
net:
   bindIp: localhost,<hostname(s)|ip address(es)>
   port: 27018
replication:
   replSetName: shardA
sharding:
   clusterRole: shardsvr
```

其他设置（例如[`storage.dbPath`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-storage.dbPath)等）保持不变。

并重新启动：

```
mongod --config <path/To/ConfigFile>
```

允许复制赶上该成员。

##### C4.对分片的其余辅助节点重复该过程

一旦该成员赶上了集合中的其他成员，请一次对分片的其余次要成员重复该过程：

1. [C1.停止一个辅助节点并重新启动为独立节点](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/#std-label-tutorial-index-on-sharded-clusters-stop-one-member)
2. [C2.建立索引](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/#std-label-tutorial-index-on-sharded-clusters-build-index)
3. [C3.`mongod`作为副本集成员重新启动程序](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/#std-label-tutorial-index-on-sharded-clusters-restart-mongod)

##### C5.在主节点上构建索引

当分片的所有辅助节点都有新索引时，降级分片的主节点，使用上述过程将其作为独立节点重新启动，并在前一个主节点上构建索引：

1. 使用[`rs.stepDown()`](https://www.mongodb.com/docs/v7.0/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)中的方法[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 辞去初选职务。成功降级后，当前主节点将成为辅助节点，并且副本集成员会选举新的主节点。
2. [C1.停止一个辅助节点并重新启动为独立节点](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/#std-label-tutorial-index-on-sharded-clusters-stop-one-member)
3. [C2.建立索引](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/#std-label-tutorial-index-on-sharded-clusters-build-index)
4. [C3.`mongod`作为副本集成员重新启动程序](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/#std-label-tutorial-index-on-sharded-clusters-restart-mongod)

#### D. 对其他受影响的分片重复此操作

完成分片索引的构建后，重复 [C. 在包含集合块的分片上建立索引](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/#std-label-tutorial-index-on-affected-shards)对于其他受影响的分片。

#### E. 重新启动平衡器

完成受影响分片的滚动索引构建后，重新启动平衡器。

连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到[`mongos`](https://www.mongodb.com/docs/v7.0/reference/program/mongos/#mongodb-binary-bin.mongos) 分片集群中的实例，然后运行[`sh.startBalancer()`](https://www.mongodb.com/docs/v7.0/reference/method/sh.startBalancer/#mongodb-method-sh.startBalancer)：[[ 3 \]](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/#footnote-autosplit-start)

```
sh.startBalancer()
```



| [ [3](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/#ref-autosplit-start-id4) ] | 从 MongoDB 6.1 开始，不再执行自动块分割。这是因为平衡政策的改进。自动分割命令仍然存在，但不执行操作。有关详细信息，请参阅 [平衡策略更改。](https://www.mongodb.com/docs/v7.0/release-notes/6.1/#std-label-release-notes-6.1-balancing-policy-changes)在6.1之前的MongoDB版本中，[`sh.startBalancer()`](https://www.mongodb.com/docs/v7.0/reference/method/sh.startBalancer/#mongodb-method-sh.startBalancer) 还启用了分片集群的自动拆分。 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |

### 附加信息

如果分片集合在包含集合块的每个分片上不具有完全相同的索引（包括索引选项），则分片集合的索引不一致。虽然正常操作时不应该出现索引不一致的情况，但是索引不一致的情况还是有可能出现的，比如：

- 
  当用户创建具有`unique`键约束的索引并且一个分片包含具有重复文档的块时。在这种情况下，创建索引操作可能在没有重复项的分片上成功，但在有重复项的分片上失败。
- 当用户以滚动方式跨分片创建索引，但未能为关联分片构建索引或错误地构建不同规格的索引时。

从 MongoDB 4.4（和 4.2.6）开始，[配置服务器](https://www.mongodb.com/docs/v7.0/core/sharded-cluster-config-servers/#std-label-sharding-config-server)主节点会定期检查分片集合的分片之间的索引不一致情况。要配置这些定期检查，请参阅 [`enableShardedIndexConsistencyCheck`](https://www.mongodb.com/docs/v7.0/reference/parameters/#mongodb-parameter-param.enableShardedIndexConsistencyCheck)和 [`shardedIndexConsistencyCheckIntervalMS`。](https://www.mongodb.com/docs/v7.0/reference/parameters/#mongodb-parameter-param.shardedIndexConsistencyCheckIntervalMS)

该命令返回在主配置服务器上运行时报告索引不一致的[`serverStatus`](https://www.mongodb.com/docs/v7.0/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)字段 。[`shardedIndexConsistency`](https://www.mongodb.com/docs/v7.0/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.shardedIndexConsistency)

要检查分片集合是否具有不一致的索引，请参阅 [查找跨分片的不一致索引](https://www.mongodb.com/docs/v7.0/tutorial/manage-indexes/#std-label-manage-indexes-find-inconsistent-indexes)