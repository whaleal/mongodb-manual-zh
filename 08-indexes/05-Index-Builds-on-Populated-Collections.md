## 在已填充的集合上构建索引

从 MongoDB 4.2 开始，索引构建使用优化的构建过程，该过程在索引构建的开始和结束时在集合上持有独占锁。构建过程的其余部分由交错的读和写操作产生。有关索引构建过程和锁定行为的详细说明，请参阅[索引构建过程。](https://www.mongodb.com/docs/v7.0/core/index-creation/#std-label-index-build-process)

从 MongoDB 4.4 开始，索引构建在副本集或分片集群上，并在所有数据承载副本集成员上同时构建。主数据库需要最少数量的数据承载投票成员（即提交法定人数），包括其自身，必须在将索引标记为可供使用之前完成构建。“投票”成员是[`members[n\].votes`](https://www.mongodb.com/docs/v7.0/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)大于 的 任何副本集成员`0`。看[在复制环境中构建索引](https://www.mongodb.com/docs/v7.0/core/index-creation/#std-label-index-operations-replicated-build)了解更多信息。

### 行为

#### 前台和后台构建的比较

以前版本的 MongoDB 支持在前台或后台构建索引。前台索引构建速度很快，并生成更高效的索引数据结构，但需要在构建期间阻止对正在索引的集合的父数据库的所有读写访问。后台索引构建速度较慢且效率较低，但允许在构建过程中对数据库及其集合进行读写访问

从 MongoDB 4.2 开始，索引构建仅在构建过程的开始和结束期间获得对正在索引的集合的独占锁，以保护元数据更改。构建过程的其余部分使用后台索引构建的屈服行为来最大化构建期间对集合的读写访问。尽管有更宽松的锁定行为，4.2 索引构建仍然会产生高效的索引数据结构。

优化的索引构建性能至少与后台索引构建相当。对于在构建过程中收到很少或没有收到更新的工作负载，优化索引构建可以与基于相同数据构建前台索引一样快。

用于[`db.currentOp()`](https://www.mongodb.com/docs/v7.0/reference/method/db.currentOp/#mongodb-method-db.currentOp)监控正在进行的索引构建的进度。

`background`如果为其 [`createIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#mongodb-dbcommand-dbcmd.createIndexes)shell 帮助程序 [`createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)和 指定了索引构建选项， MongoDB 将忽略索引构建选项[`createIndexes()`。](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndexes/#mongodb-method-db.collection.createIndexes)

#### 索引构建期间的约束违规

对于对集合实施约束的索引（例如 [唯一](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)索引），索引构建完成*后*[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod) 会检查所有预先存在的和同时写入的文档是否违反这些约束。在索引构建期间可能存在违反索引约束的文档。如果任何文档在构建结束时违反索引约束，则会终止构建并引发错误。[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)

例如，考虑一个已填充的集合`inventory`。管理员想要在`product_sku` 字段上创建唯一索引。如果集合中的任何文档具有重复的 值 `product_sku`，索引构建仍然可以成功启动。如果在构建结束时仍然存在任何违规行为，则会[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)终止构建并引发错误。

同样，在索引构建过程中，应用程序可以成功地将`inventory`具有重复值的文档写入集合 。`product_sku`如果在构建结束时仍然存在任何违规行为，则会[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)终止构建并引发错误。

为了降低由于违反约束而导致索引构建失败的风险：

- 验证集合中没有文档违反索引约束。
- 停止无法保证无违规写入操作的应用程序对集合的所有写入。

**分片集合**

对于分布在多个分片上的分片集合，一个或多个分片可能包含具有重复文档的块。因此，创建索引操作可能在某些分片（即没有重复的分片）上成功，但在其他分片（即有重复的分片）上失败。为了避免在分片之间留下不一致的索引，您可以发出 [`db.collection.dropIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex)from a[`mongos`](https://www.mongodb.com/docs/v7.0/reference/program/mongos/#mongodb-binary-bin.mongos)从集合中删除索引。

为了降低发生这种情况的风险，在创建索引之前：

- 验证集合中没有文档违反索引约束。
- 停止无法保证无违规写入操作的应用程序对集合的所有写入。

> 提示:
>
> **也可以看看：**
>
> [分片集合的索引一致性检查](https://www.mongodb.com/docs/v7.0/core/index-creation/#std-label-index-creation-index-consistency)

#### 最大并发索引构建数

默认情况下，服务器最多允许三个并发索引构建。要更改允许的并发索引构建数量，请修改该 [`maxNumActiveUserIndexBuilds`](https://www.mongodb.com/docs/v7.0/reference/parameters/#mongodb-parameter-param.maxNumActiveUserIndexBuilds)参数。

如果并发索引构建的数量达到 指定的限制 `maxNumActiveUserIndexBuilds`，服务器将阻止其他索引构建，直到并发索引构建的数量降至限制以下。

### 索引构建对数据库性能的影响

#### 在写入繁重的工作负载期间构建索引

在目标集合处于重写入负载的时间段内构建索引可能会导致写入性能降低和索引构建时间更长。

考虑指定一个维护时段，在此期间应用程序停止或减少针对集合的写入操作。在此维护时段内启动索引构建，以减轻构建过程的潜在负面影响。

#### 可用系统内存 (RAM) 不足

[`createIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#mongodb-dbcommand-dbcmd.createIndexes)支持在集合上构建一个或多个索引。[`createIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#mongodb-dbcommand-dbcmd.createIndexes)使用内存和磁盘上的临时文件的组合来完成索引构建。内存使用的默认限制为[`createIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#mongodb-dbcommand-dbcmd.createIndexes)200 MB（对于版本 4.2.3 及更高版本）和 500 MB（对于版本 4.2.2 及更早版本），在使用单个命令构建的所有索引之间共享 [`createIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#mongodb-dbcommand-dbcmd.createIndexes)。达到内存限制后， 将使用该[`createIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#mongodb-dbcommand-dbcmd.createIndexes)目录中指定的子目录中的临时磁盘文件 来完成构建。`_tmp`[`--dbpath`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#std-option-mongod.--dbpath)

您可以通过设置服务器参数来覆盖内存限制 [`maxIndexBuildMemoryUsageMegabytes`](https://www.mongodb.com/docs/v7.0/reference/parameters/#mongodb-parameter-param.maxIndexBuildMemoryUsageMegabytes)。设置更高的内存限制可能会更快地完成索引构建。但是，相对于系统上未使用的 RAM 而言，将此限制设置得太高可能会导致内存耗尽和服务器关闭。

如果主机的可用可用 RAM 有限，您可能需要安排维护期以增加总系统 RAM，然后才能修改 RAM[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)使用情况。

### 在复制环境中构建索

> 笔记:
>
> **需要功能兼容性版本 4.4+**
>
> [`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)副本集或分片集群中的 每个成员都*必须*至少将[featureCompatibilityVersion](https://www.mongodb.com/docs/v7.0/reference/command/setFeatureCompatibilityVersion/#std-label-set-fcv)`4.4`设置为跨副本集成员同时启动索引构建。
>
> MongoDB 4.4 运行时`featureCompatibilityVersion: "4.2"`会在主数据库上构建索引，然后将索引构建复制到辅助数据库。

从 MongoDB 4.4 开始，索引构建在副本集或分片集群上，并在所有数据承载副本集成员上同时构建。对于分片集群，索引构建仅发生在包含正在索引的集合的数据的分片上。主数据库需要最少数量的数据承载[`voting`](https://www.mongodb.com/docs/v7.0/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)成员（即提交仲裁），包括其自身，必须在将索引标记为可供使用之前完成构建。

构建过程总结如下：

1. 主节点接收[`createIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#mongodb-dbcommand-dbcmd.createIndexes)命令并立即创建与索引构建关联的“startIndexBuild”oplog 条目。

2. 辅助节点在复制“startIndexBuild”oplog 条目后开始索引构建。

3. 一旦完成集合中数据的索引，每个成员都会“投票”提交构建。

4. 次要成员继续处理索引中的任何新写入操作，同时等待主要成员确认法定投票数。

5. 当主节点具有法定投票数时，它会检查任何违反键约束的情况，例如重复键错误。

   * 如果没有违反键约束，则主数据库将完成索引构建，将索引标记为可供使用，并创建关联的“commitIndexBuild”oplog 条目。
   * 如果存在任何关键约束违规，索引构建就会失败。主节点中止索引构建并创建关联的“abortIndexBuild”oplog 条目。

6. 辅助节点复制“commitIndexBuild”oplog 条目并完成索引构建。

   如果辅助节点复制“abortIndexBuild”oplog 条目，它们将中止索引构建并放弃构建作业

对于分片集群，索引构建仅发生在包含正在索引的集合的数据的分片上。

有关索引构建过程的更详细说明，请参阅[索引构建过程。](https://www.mongodb.com/docs/v7.0/core/index-creation/#std-label-index-build-process)

`"votingMembers"`默认情况下，索引构建使用或所有数据承载投票成员的提交仲裁。要使用非默认提交仲裁启动索引构建，请指定[commitQuorum](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#std-label-createIndexes-cmd-commitQuorum)参数 [`createIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#mongodb-dbcommand-dbcmd.createIndexes)或其 shell 帮助程序 [`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)和 [`db.collection.createIndexes()`。](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndexes/#mongodb-method-db.collection.createIndexes)

要修改正在进行的同步索引构建所需的提交仲裁，请使用以下命令[`setIndexCommitQuorum`](https://www.mongodb.com/docs/v7.0/reference/command/setIndexCommitQuorum/#mongodb-dbcommand-dbcmd.setIndexCommitQuorum)。

> 笔记:
>
> 索引构建会影响副本集性能。对于无法容忍因索引构建而导致性能下降的工作负载，请考虑执行滚动索引构建过程。滚动索引构建一次最多取出一个副本集成员（从次要成员开始），并在该成员上独立构建索引。滚动索引构建需要至少一次副本集选举。
>
> * 有关在副本集上构建滚动索引的信息，请参阅 [在副本集上构建滚动索引。](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-replica-sets/)
> * 有关分片集群上的滚动索引构建的信息，请参阅 [分片集群上的滚动索引构建。](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/)

#### Commit Quorum 与 Write Concern 对比

[提交仲裁](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#std-label-createIndexes-cmd-commitQuorum)和[写入关注](https://www.mongodb.com/docs/v7.0/reference/write-concern/#std-label-write-concern)之间存在重要区别[：](https://www.mongodb.com/docs/v7.0/reference/write-concern/#std-label-write-concern)

- 索引构建使用**提交仲裁**。
- 写操作使用**写关注点**。

集群中的每个数据承载节点都是投票成员。

提交**法定人数**指定有多少个数据承载投票成员，或者哪些投票成员（包括主要成员）必须准备提交提交[同时建立索引](https://www.mongodb.com/docs/v7.0/core/index-creation/#std-label-index-operations-simultaneous-build)。在主节点执行提交之前。

写入**问题**是确认写入已传播到指定数量的实例的级别。

提交**仲裁**指定在主节点提交索引构建之前必须有多少节点*准备好*完成索引构建。相反，当主节点提交索引构建时，**写关注** 指定在命令返回之前有多少节点必须*完成*索引构建。

### 构建失败和恢复

#### 中断索引建立在主索引上`mongod`

从 MongoDB 5.0 开始，如果主数据库[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在索引构建期间完全关闭并且 [commitQuorum](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#std-label-createIndexes-cmd-commitQuorum)设置为 default `votingMembers`，则索引构建进度将保存到磁盘。重新启动时会[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)自动恢复索引构建并从保存的检查点继续。在早期版本中，如果索引构建中断，则必须从头开始。

#### 中断索引建立在辅助索引上`mongod`

从 MongoDB 5.0 开始，如果辅助数据库[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在索引构建期间完全关闭并且 [commitQuorum](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#std-label-createIndexes-cmd-commitQuorum)设置为 default `votingMembers`，则索引构建进度将保存到磁盘。重新启动时会[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)自动恢复索引构建并从保存的检查点继续。在早期版本中，如果索引构建中断，则必须从头开始。

在 MongoDB 4.4 之前，启动过程会在任何恢复的索引构建之后停止。辅助副本可能与副本集不同步并需要重新同步。从 MongoDB 4.4 开始， [`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)可以在构建恢复索引时执行启动过程。

如果您[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)以独立方式重新启动（即删除或注释掉[`replication.replSetName`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-replication.replSetName)或省略 [`--replSetName`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#std-option-mongod.--replSet)），则[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod) 无法重新启动索引构建。构建保持暂停状态，直到手动构建[`dropped`。](https://www.mongodb.com/docs/v7.0/reference/command/dropIndexes/#mongodb-dbcommand-dbcmd.dropIndexes)

#### 独立索引构建中断`mongod`

如果[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在索引构建期间关闭，则索引构建作业和所有进度都会丢失。重新启动 [`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)不会重新启动索引构建。您必须重新发出该[`createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)操作才能重新启动索引构建。

#### 构建过程中的回滚

从 MongoDB 5.0 开始，如果在索引构建过程中节点回滚到之前的状态，索引构建进度将保存到磁盘。如果回滚结束时仍有工作要做，则会 [`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)自动恢复索引构建并从保存的检查点继续。

从版本 4.4 开始，MongoDB 可以暂停正在进行的索引构建以执行[回滚。](https://www.mongodb.com/docs/v7.0/core/replica-set-rollbacks/)

- 如果回滚没有恢复索引构建，MongoDB会在完成回滚后重新启动索引构建。
- 如果回滚恢复了索引构建，则必须在回滚完成后重新创建一个或多个索引。

在 MongoDb 4.4 之前，只有在所有正在进行的索引构建完成后才能开始回滚。

#### 分片集合的索引一致性检查

如果分片集合在包含集合块的每个分片上不具有完全相同的索引（包括索引选项），则分片集合的索引不一致。虽然正常操作时不应该出现索引不一致的情况，但是索引不一致的情况还是有可能出现的，比如：

- 当用户创建具有`unique`键约束的索引并且一个分片包含具有重复文档的块时。在这种情况下，创建索引操作可能在没有重复项的分片上成功，但在有重复项的分片上失败。
- 当用户以[滚动方式跨分片创建索引时（即手动跨分片逐一构建索引），](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/)但未能为关联分片构建索引，或者错误地构建了不同规格的索引。

从 MongoDB 4.4（以及 MongoDB 4.2.6）开始，[配置服务器](https://www.mongodb.com/docs/v7.0/core/sharded-cluster-config-servers/#std-label-sharding-config-server)主节点会定期检查分片集合的分片之间的索引不一致情况。要配置这些定期检查，请参阅 [`enableShardedIndexConsistencyCheck`](https://www.mongodb.com/docs/v7.0/reference/parameters/#mongodb-parameter-param.enableShardedIndexConsistencyCheck)和 [`shardedIndexConsistencyCheckIntervalMS`。](https://www.mongodb.com/docs/v7.0/reference/parameters/#mongodb-parameter-param.shardedIndexConsistencyCheckIntervalMS)

该命令返回在主配置服务器上运行时报告索引不一致的[`serverStatus`](https://www.mongodb.com/docs/v7.0/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)字段 。[`shardedIndexConsistency`](https://www.mongodb.com/docs/v7.0/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.shardedIndexConsistency)

要检查分片集合是否具有不一致的索引，请参阅 [查找跨分片的不一致索引。](https://www.mongodb.com/docs/v7.0/tutorial/manage-indexes/#std-label-manage-indexes-find-inconsistent-indexes)

#### 监控正在进行的索引构建

要查看索引构建操作的状态，可以使用 [`db.currentOp()`](https://www.mongodb.com/docs/v7.0/reference/method/db.currentOp/#mongodb-method-db.currentOp)以下方法[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。要筛选索引创建操作的当前操作，请参阅 [活动索引操作](https://www.mongodb.com/docs/v7.0/reference/method/db.currentOp/#std-label-currentOp-index-creation)以获取示例。

该[`msg`](https://www.mongodb.com/docs/v7.0/reference/command/currentOp/#mongodb-data-currentOp.msg)字段包括索引构建过程中当前阶段的完成百分比测量。

#### 观察日志中停止和恢复的索引构建

构建索引时，进度会写入 [MongoDB 日志](https://www.mongodb.com/docs/v7.0/reference/log-messages/#std-label-log-messages-ref)。如果索引构建停止并恢复，将会出现包含以下字段的日志消息：

```
 "msg":"Index build: wrote resumable state to disk",
 "msg":"Found index from unfinished build",
```

### 终止正在进行的索引构建

使用该[`dropIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/dropIndexes/#mongodb-dbcommand-dbcmd.dropIndexes)命令或其 shell 帮助程序 [`dropIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex)或 [`dropIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.dropIndexes/#mongodb-method-db.collection.dropIndexes)终止正在进行的索引构建。有关更多信息，请参阅[停止正在进行的索引构建。](https://www.mongodb.com/docs/v7.0/reference/command/dropIndexes/#std-label-dropIndexes-cmd-index-builds)

不要用于终止副本集或分片集群中正在进行的索引构建*。*[`killOp`](https://www.mongodb.com/docs/v7.0/reference/command/killOp/#mongodb-dbcommand-dbcmd.killOp)

### 指数构建过程

下表描述了索引构建过程的每个阶段：

| 阶段                   | 描述                                                         |
| :--------------------- | :----------------------------------------------------------- |
| 锁                     | 获得正在索引的集合上的[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)独占锁。`X`这会阻止集合上的所有读取和写入操作，包括应用任何复制的写入操作或针对集合的元数据命令。不会[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)产生此锁。 |
| 初始化                 | [`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在此初始状态下创建三个数据结构：初始索引元数据条目。临时表（“侧面写入表”），用于存储在构建过程中写入索引的集合时生成的键。可能导致密钥生成错误的所有文档的临时表（“约束违规表”）。当文档的索引字段具有无效键时，会发生键生成错误。例如，在构建[唯一索引时文档具有重复的字段值](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique) *，或者*在构建[2dsphere 索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)时文档包含格式错误的[GeoJSON 对象](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-geojson)[。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index) |
| 锁                     | 将[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)独占`X` 收集锁降级为意向独占 `IX`锁。周期性[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)地产生此锁以交错读取和写入操作。 |
| 扫描收藏               | 对于集合中的每个文档，[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod) 生成该文档的密钥并将该密钥转储到外部排序器中。如果[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在收集扫描期间生成键时遇到键生成错误，则会将该键存储在约束违规表中以供以后处理。如果[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在生成密钥时遇到任何其他错误，构建将失败并出现错误。一旦[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)完成集合扫描，它将排序的键转储到索引中。 |
| 进程端写表             | [`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)使用先进先出优先级排空侧写表。如果[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在处理侧写表中的键时遇到键生成错误，则会将该键存储在约束违反表中以供以后处理。如果[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在处理密钥时遇到任何其他错误，构建将失败并出现错误。对于在构建过程中写入集合的每个文档，都会[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)生成该文档的键并将其存储在侧写入表中以供以后处理。它[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)使用快照系统来设置要处理的密钥数量的限制。 |
| 投票并等待提交法定人数 | *不属于*[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)副本集的A会跳过此阶段。从 MongoDB 4.4 开始，[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)向主节点提交“投票”以提交索引。具体来说，它将“投票”写入 [主节点上的内部复制集合。](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-primary)如果是[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)主要[的](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-primary)，它会等到拥有提交法定投票数（默认情况下所有投票数据承载成员），然后再继续索引构建过程。如果[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)是[secondary](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-secondary)，它将等待直到复制“commitIndexBuild”或“abortIndexBuild”oplog 条目：如果[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)复制“commitIndexBuild”oplog 条目，它就会完成侧写表的排空，并进入索引构建过程的下一个阶段。如果[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)复制“abortIndexBuild”oplog 条目，它将中止索引构建并放弃构建作业。在等待提交仲裁时，会将写入[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)操作生成的任何附加键添加到正在索引到侧面写入表的集合中，并定期排空该表。 |
| 锁                     | 将集合上的[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)意向独占锁升级为共享锁。这会阻止对集合的所有写入操作，包括应用任何复制的写入操作或针对集合的元数据命令。`IX``S` |
| 完成处理临时侧写入表   | 继续[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)排出侧写表中的剩余记录。[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在此阶段可能会暂停复制。如果[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在处理侧写表中的键时遇到键生成错误，则会将该键存储在约束违反表中以供以后处理。如果[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在处理密钥时遇到任何其他错误，构建将失败并出现错误。 |
| 锁                     | 将集合上的[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)共享锁升级为集合上的排它锁。这会阻止集合上的所有读取和写入操作，包括应用任何复制的写入操作或针对集合的元数据命令。不会 产生此锁。`S``X`[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod) |
| 下降侧写表             | [`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在删除侧面写入表之前，应用该侧面写入表中的任何剩余操作。如果[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在处理侧写表中的键时遇到键生成错误，则会将该键存储在约束违反表中以供以后处理。如果[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在处理密钥时遇到任何其他错误，构建将失败并出现错误。此时，索引包含写入集合的所有数据。 |
| 流程约束违规表         | 如果 是[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)主要[的](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-primary)，它会使用先进先出优先级来排空约束违规表。如果约束冲突表中没有键产生键生成错误*或者*表为空，则 [`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)删除该表并创建一个“commitIndexBuild”oplog 条目。辅助节点可以在复制 oplog 条目后完成关联的索引构建。如果约束冲突表中的任何键仍然产生键生成错误，则[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)中止构建并引发错误。创建[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)关联的“abortIndexBuild”oplog 条目以指示辅助节点应中止并放弃索引构建作业。如果[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)是[辅助](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-secondary)表，它会删除约束违规表。由于主服务器*必须* 在创建“commitOplogEntry”oplog 条目之前成功排空约束违规表，因此辅助服务器可以安全地假设不存在违规。 |
| 将索引标记为就绪       | 更新[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)索引元数据以将索引标记为可供使用。 |
| 锁                     | 释放集合上的锁[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)。`X` |

> 提示:
>
> **也可以看看：**
>
> [常见问题解答：并发](https://www.mongodb.com/docs/v7.0/faq/concurrency/)