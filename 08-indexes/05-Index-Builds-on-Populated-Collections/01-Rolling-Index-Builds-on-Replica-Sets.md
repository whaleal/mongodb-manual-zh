## 滚动索引建立在副本集上

索引构建会影响副本集性能。默认情况下，MongoDB 4.4 及更高版本会在所有数据承载副本集成员上同时构建索引。对于无法容忍因索引构建而导致性能下降的工作负载，请考虑使用以下过程以滚动方式构建索引。

滚动索引构建一次最多取出一个副本集成员（从次要成员开始），并在该成员上独立构建索引。滚动索引构建需要至少一次副本集选举。

### 注意事项

#### 唯一索引

要使用以下过程创建[唯一索引，您必须在此过程期间停止对集合的所有写入。](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)

如果在此过程中无法停止对集合的所有写入，请不要使用本页上的过程。[`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)相反，通过在副本集的主数据库上发出来在集合上构建唯一索引。

#### 操作日志大小

确保您的[oplog](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-oplog)足够大，以允许索引或重新索引操作完成，而不会落后太远而无法赶上。 有关更多信息，请参阅[oplog 大小调整文档。](https://www.mongodb.com/docs/v7.0/core/replica-set-oplog/#std-label-replica-set-oplog-sizing)

### 先决条件

用于构建唯一索引

要使用以下过程创建[唯一索引，您必须在索引构建期间停止对集合的所有写入。](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)否则，您可能会在副本集成员之间得到不一致的数据。

> 警告:
>
> 如果无法停止对集合的所有写入，请勿使用以下过程创建唯一索引。

### 过程

> 重要的:
>
> 以下以滚动方式构建索引的过程适用于副本集部署，而不适用于分片集群。有关分片集群的过程，请参阅 [在分片集群上构建滚动索引](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/)。

#### A. 停止一个辅助节点并重新启动为独立节点。

停止[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)与辅助进程关联的进程。进行以下配置更新后重新启动：

如果您使用配置文件，请进行以下配置更新：

- 注释掉该[`replication.replSetName`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-replication.replSetName)选项。
- 更改[`net.port`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-net.port)为不同的端口。[[ 1 \]](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-replica-sets/#footnote-different-port) 记下原始端口设置作为注释。
- 将参数设置`disableLogicalSessionCacheRefresh`为 部分`true`中的[`setParameter`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-setParameter)

例如，副本集成员的更新配置文件将包含类似以下示例的内容：

```
net:
   bindIp: localhost,<hostname(s)|ip address(es)>
   port: 27217
#   port: 27017
#replication:
#   replSetName: myRepl
setParameter:
   disableLogicalSessionCacheRefresh: true
```

其他设置（例如[`storage.dbPath`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-storage.dbPath)等）保持不变。

并重新启动：

```
mongod --config <path/To/ConfigFile>
```

| [ 1 ] | *( [1](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-replica-sets/#ref-different-port-id1) , [2](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-replica-sets/#ref-different-port-id2) )* 通过[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在不同的端口上运行，可以确保副本集的其他成员和所有客户端在构建索引时不会联系该成员。 |
| ----- | ------------------------------------------------------------ |
|       |                                                              |

#### B. 建立索引

直接连接到[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在新端口上作为独立运行的实例，并为此实例创建新索引。

例如，连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到实例，并使用在集合的字段[`createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)上创建升序索引：`username``records`

```
db.records.createIndex( { username: 1 } )
```

####  C. 将 mongod 程序作为副本集成员重新启动。

索引构建完成后，关闭[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。撤消作为独立启动时所做的配置更改以返回其原始配置并作为副本集的成员重新启动。

> 重要的:
>
> 请务必删除该`disableLogicalSessionCacheRefresh` 参数。

例如，要重新启动您的副本集成员：

如果您使用配置文件：

- 恢复到原来的端口号。
- 取消注释[`replication.replSetName`.](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-replication.replSetName)
- 删除`disableLogicalSessionCacheRefresh` 该[`setParameter`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-setParameter)部分中的参数。

例如：

```
net:
   bindIp: localhost,<hostname(s)|ip address(es)>
   port: 27017
replication:
   replSetName: myRepl
```



其他设置（例如[`storage.dbPath`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-storage.dbPath)等）保持不变。

并重新启动：

```
mongod --config <path/To/ConfigFile>
```

允许复制赶上该成员

#### D. 重复该过程以处理剩余的辅助节点。

一旦该成员赶上该组中的其他成员，请一次对剩余的次要成员重复此过程：

1. [A. 停止一个辅助节点并重新启动为独立节点。](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-replica-sets/#std-label-tutorial-index-on-replica-sets-stop-one-member)
2. [B. 建立索引](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-replica-sets/#std-label-tutorial-index-on-replica-sets-build-index)
3. [C.将 mongod 程序作为副本集成员重新启动](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-replica-sets/#std-label-tutorial-index-on-replica-sets-restart-mongod)

#### E. 在主节点上构建索引

当所有辅助节点都有新索引时，降级主节点，使用上述过程将其作为独立节点重新启动，并在前一个主节点上构建索引：

1. 使用[`rs.stepDown()`](https://www.mongodb.com/docs/v7.0/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)中的方法[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 辞去初选职务。成功降级后，当前主节点将成为辅助节点，并且副本集成员会选举新的主节点。
2. [A. 停止一个辅助节点并重新启动为独立节点。](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-replica-sets/#std-label-tutorial-index-on-replica-sets-stop-one-member)
3. [B. 建立索引](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-replica-sets/#std-label-tutorial-index-on-replica-sets-build-index)
4. [C.将 mongod 程序作为副本集成员重新启动](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-replica-sets/#std-label-tutorial-index-on-replica-sets-restart-mongod)