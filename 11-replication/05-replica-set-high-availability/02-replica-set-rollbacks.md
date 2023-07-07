# 副本集故障转移期间的回滚

[当节点在故障转移](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-failover)后重新加入其[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)时，回滚将恢复对以前[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)的写操作。仅当主节点已接受在主节点降级之前[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)**未成功复制的写操作时，才需要回滚。**当主节点作为从节点重新加入集合时，它会恢复或“回滚”其写入操作，以保持数据库与其他节点的一致性。

MongoDB 试图避免回滚，这种情况应该很少见。当确实发生回滚时，它通常是网络分区的结果。无法跟上前一个主节点上的操作吞吐量的从节点会增加回滚的大小和影响。

如果写操作在主节点降级之前复制到副本集的另一个成员，*并且*该成员仍然可用并且可供大多数副本集访问，则*不会*发生回滚。



## 收集回滚数据

### 配置回滚数据

该[`createRollbackDataFiles`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.createRollbackDataFiles)参数控制是否在回滚期间创建回滚文件。



### 回滚数据

默认情况下，当发生回滚时，MongoDB 将回滚数据写入 [BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON)文件。

>## note
>
>### 回滚目录更改
>
>从 Mongo 4.4 开始，集合的回滚目录以集合的 UUID 而不是集合命名空间命名。



**MongoDB 4.4+**

对于回滚数据的每个集合，回滚文件位于一个`<dbpath>/rollback/<collectionUUID>` 目录中，文件名格式如下：

```
removed.<timestamp>.bson
```

例如，如果数据库中集合`comments`的 `reporting`数据回滚：

```
<dbpath>/rollback/20f74796-d5ea-42f5-8c95-f79b39bad190/removed.2020-02-19T04-57-11.0.bson
```

`<dbpath>`的[在](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)哪里[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)？[`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)



## 提示

### 集合名称

要获取集合名称，您可以`rollback file`在 MongoDB 日志中搜索。例如，如果日志文件是 `/var/log/mongodb/mongod.log`，您可以使用在日志`grep`中搜索实例`"rollback file"`：

```
grep "rollback file" /var/log/mongodb/mongod.log
```

或者，您可以遍历所有数据库并运行 [`db.getCollectionInfos()`](https://www.mongodb.com/docs/manual/reference/method/db.getCollectionInfos/#mongodb-method-db.getCollectionInfos)特定 UUID，直到获得匹配项。例如：

```
var mydatabases=db.adminCommand("listDatabases").databases;
var foundcollection=false;

for (var i = 0; i < mydatabases.length; i++) {
   let mdb = db.getSiblingDB(mydatabases[i].name);
   collections = mdb.getCollectionInfos( { "info.uuid": UUID("20f74796-d5ea-42f5-8c95-f79b39bad190") } );

   for (var j = 0; j < collections.length; j++) {   // Array of 1 element
      foundcollection=true;
      print(mydatabases[i].name + '.' + collections[j].name);
      break;
   }

   if (foundcollection) { break; }
}
```

**MongoDB 4.2**

对于回滚数据的每个集合，回滚文件位于一个`<dbpath>/rollback/<db>.<collection>` 目录中，文件名格式如下：

```
removed.<timestamp>.bson
```

例如，如果数据库中集合`comments`的 `reporting`数据回滚：

```
<dbpath>/rollback/reporting.comments/removed.2019-01-31T02-57-40.0.bson
```

`<dbpath>`的[在](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)哪里[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)？[`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)

### 回滚数据排除

如果回滚操作是集合删除或文档删除，则集合删除或文档删除的回滚不会写入回滚数据目录。

### 读取回滚数据

要读取回滚文件的内容，请使用[`bsondump`](https://www.mongodb.com/docs/database-tools/bsondump/#mongodb-binary-bin.bsondump). 根据应用程序的内容和知识，管理员可以决定下一步要采取的行动。



## 避免副本集回滚

对于副本集，[写安全](https://www.mongodb.com/docs/manual/reference/write-concern/) [`{ w: 1 }`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)只提供对主写操作的确认。如果在写入操作复制到任何从节点之前主节点退出，则数据可能会回滚。这包括在使用写安全提交 的[多文档事务中写入的数据。](https://www.mongodb.com/docs/manual/core/transactions/)[`{ w: 1 }`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)

### 日记和写安全`majority`

为防止已向客户端确认的数据回滚，请在启用日记功能的情况下运行所有投票节点，并使用[{ w: "majority" } 写安全](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-w)以保证写入操作在返回确认之前传播到大多数副本集节点给发行客户。

从 MongoDB 5.0 开始，`{ w: "majority" }`是*大多数*MongoDB 部署的默认写安全。请参阅[隐式默认写安全。](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-default-behavior)

[`writeConcernMajorityJournalDefault`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.writeConcernMajorityJournalDefault)设置为false 时，MongoDB在确认写入之前不会等待[`w: "majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-) 写入磁盘日志。因此，[`"majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)如果给定副本集中的大多数节点发生暂时性丢失（例如崩溃和重启），写操作可能会回滚。

### 可回滚数据的可见性

- 无论写入的[写安全](https://www.mongodb.com/docs/manual/reference/write-concern/)是什么，其他使用[`"local"`](https://www.mongodb.com/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-)或[`"available"`](https://www.mongodb.com/docs/manual/reference/read-concern-available/#mongodb-readconcern-readconcern.-available-) 读取安全的客户端都可以在写入操作被发出客户端确认之前看到写入操作的结果。
- 使用[`"local"`](https://www.mongodb.com/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-)或[`"available"`](https://www.mongodb.com/docs/manual/reference/read-concern-available/#mongodb-readconcern-readconcern.-available-) 读取安全的客户端可以读取数据，这些数据随后可能会在副本集故障转移期间[回滚。](https://www.mongodb.com/docs/manual/core/replica-set-rollbacks/)

对于[多文档事务](https://www.mongodb.com/docs/manual/core/transactions/)中的操作，当事务提交时，事务中所做的所有数据更改都被保存并在事务外可见。也就是说，事务不会在回滚其他更改时提交它的某些更改。

在事务提交之前，事务中所做的数据更改在事务外是不可见的。

但是，当事务写入多个分片时，并非所有外部读取操作都需要等待已提交事务的结果跨分片可见。例如，如果事务已提交并且写入 1 在分片 A 上可见，但写入 2 在分片 B 上尚不可见，则外部读取安全 [`"local"`](https://www.mongodb.com/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-)可以读取写入 1 的结果而看不到写入 2。

## 回滚注意事项

### 用户操作

[`ROLLBACK`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)从 4.2 版开始，当节点进入状态时，MongoDB 会终止所有正在进行的用户操作。

### 索引构建

- 对于[功能兼容版本 (fcv)](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv) `"4.2"`，MongoDB 在开始回滚之前等待任何正在进行的 [索引构建](https://www.mongodb.com/docs/manual/core/index-creation/#std-label-index-operations)完成。

有关索引构建过程的更多信息，请参阅 [在已填充集合上构建索引。](https://www.mongodb.com/docs/manual/core/index-creation/#std-label-index-operations)

### [`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)Read Concern 禁用时的索引操作

禁用[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取安全 [`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)会阻止修改索引的命令 [滚回来](https://www.mongodb.com/docs/manual/core/replica-set-rollbacks/#std-label-replica-set-rollbacks). 如果需要回滚此类操作，您必须将受影响的节点与 [主](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)节点重新同步。

### 大小限制

MongoDB 不限制您可以回滚的数据量。



### 回滚经过的时间限制

回滚时间限制默认为 24 小时，可使用[`rollbackTimeLimitSecs`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.rollbackTimeLimitSecs)参数进行配置。

MongoDB 将运行时间测量为 oplog 中的第一个常见操作与被回滚成员的 oplog 中的最后一个条目之间的时间。



## 提示

### 也可以看看：

[副本集高可用性](https://www.mongodb.com/docs/manual/core/replica-set-high-availability/)和 [副本集选举。](https://www.mongodb.com/docs/manual/core/replica-set-elections/)

←  [Replica Set Elections](https://www.mongodb.com/docs/manual/core/replica-set-elections/)[Replica Set Read and Write Semantics](https://www.mongodb.com/docs/manual/applications/replication/)

原文链接 - https://docs.mongodb.com/manual/core/replica-set-rollbacks/ 

译者：陆文龙



