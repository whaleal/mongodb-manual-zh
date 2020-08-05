

## 读取隔离、一致性和近效性

**在本页面**


*   [隔离保证](#隔离)
*   [单调写](#单调)
*   [实时订单](#订单)
*   [因果一致性](#因果)

### <span id="隔离">隔离保证</span>


#### 阅读未提交

根据读取的关注点，客户端可以在[持久](https://docs.mongodb.com/manual/reference/glossary/#term-durable)写入之前看到写入的结果：

- 不管写的[写关注点如何](https://docs.mongodb.com/manual/reference/write-concern/)，其他使用[`"local"`](https://docs.mongodb.com/manual/reference/read-concern-local/#readconcern."local")或[`"available"`](https://docs.mongodb.com/manual/reference/read-concern-available/#readconcern."available") 读关注的客户端都可以在向发布客户端确认写操作之前看到写操作的结果。
- 使用[`"local"`](https://docs.mongodb.com/manual/reference/read-concern-local/#readconcern."local")或[`"available"`](https://docs.mongodb.com/manual/reference/read-concern-available/#readconcern."available") 读取关注点的客户端可以读取数据，这些数据随后可能会在副本集故障转移期间[回滚](https://docs.mongodb.com/manual/core/replica-set-rollbacks/)。

对于[多文档事务中的操作](https://docs.mongodb.com/manual/core/transactions/)，当事务提交时，在事务中进行的所有数据更改都将保存并在事务外部可见。也就是说，一个事务在回滚其他事务时将不会提交其某些更改。

在提交事务之前，在事务外部看不到在事务中进行的数据更改。

但是，当事务写入多个分片时，并非所有外部读取操作都需要等待已提交事务的结果在所有分片上可见。例如，如果提交了一个事务，并且在分片A上可以看到写1，但是在分片B上还看不到写2，则外部读取在读关注点时 [`"local"`](https://docs.mongodb.com/manual/reference/read-concern-local/#readconcern."local")可以读取写1的结果而看不到写2。

“读取未提交”是默认的隔离级别，适用于 [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)独立实例以及副本集和分片群集。

#### 阅读未提交的单文档原子性

对于单个文档，写操作是原子的。即，如果写操作正在更新文档中的多个字段，则读操作将永远不会看到仅更新了某些字段的文档。但是，尽管客户端可能看不到*部分*更新的文档，但未提交的读取意味着并发的读取操作仍可以在使更改[持久](https://docs.mongodb.com/manual/reference/glossary/#term-durable)之前看到更新的文档。

对于独立[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)实例，对单个文档的一组读取和写入操作是可序列化的。使用副本集，*只有*在没有回滚的情况下，对单个文档的一组读取和写入操作才能序列化 。

### 读取未提交和多个文档写入

当单个写入操作（例如 [`db.collection.updateMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#db.collection.updateMany)）修改多个文档时，每个文档的修改都是原子的，但整个操作不是原子的。

当执行多文档写操作时，无论是通过单个写操作还是通过多个写操作，其他操作都可能会交错。

对于需要原子性地读写多个文档（在单个或多个集合中）的情况，MongoDB支持多文档事务：

- **在版本4.0中**，MongoDB支持副本集上的多文档事务。
- **在版本4.2中**，MongoDB引入了分布式事务，它增加了对分片群集上多文档事务的支持，并合并了对副本集上多文档事务的现有支持。

有关MongoDB中事务的详细信息，请参阅 [事务](https://docs.mongodb.com/manual/core/transactions/)页面。

> 重要 :
>
> 在大多数情况下，与单文档写入相比，多文档事务产生的性能成本更高，并且多文档事务的可用性不应替代有效的架构设计。在许多情况下， [非规范化数据模型（嵌入式文档和数组）](https://docs.mongodb.com/manual/core/data-model-design/#data-modeling-embedding)将继续是您的数据和用例的最佳选择。也就是说，在许多情况下，适当地对数据建模将最大程度地减少对多文档交易的需求。
>
> 有关其他事务使用方面的注意事项（例如运行时限制和操作日志大小限制），另请参见 [生产注意事项](https://docs.mongodb.com/manual/core/transactions-production-consideration/)。</div>

在不隔离多文档写入操作的情况下，MongoDB表现出以下行为：

1. 非时间点读取操作。假设读取操作在时间*t*<sub>1</sub>开始并开始读取文档。然后，写操作在稍后的时间*t* <sub>2</sub>提交对文档之一的更新。读者可能会看到文档的更新版本，因此看不到数据的时间点快照。
2. 不可序列化的操作。假设读取操作在时间*t* <sub>1</sub>读取文档*d* <sub>1</sub>，而写入操作在稍后的时间*t* <sub>3</sub>更新*d* <sub>1</sub>。这引入了读写依赖性，因此，如果要序列化操作，则读取操作必须先于写入操作。而且还假设写操作在时间*t* <sub>2</sub>更新文档*d* <sub>2</sub>，而读取操作随后在稍后的时间 *t* <sub>4</sub>读取*d* <sub>2</sub>。这就引入了写-读依赖关系，它将需要读操作来进行在可序列化计划中进行写操作*之后*。有一个依赖循环，使可序列化成为不可能。
3. 读取操作可能会丢失在读取操作过程中更新的匹配文档。

#### 光标快照

在某些情况下，MongoDB游标可以多次返回同一文档。当游标返回文档时，其他操作可能会与查询交错。如果其中某些操作更改了查询使用的索引上的索引字段；那么光标将多次返回同一文档。

如果您的集合中有一个或多个从未修改过的字段，则可以在此字段或这些字段上使用*唯一*索引，这样查询将最多返回每个文档一次。查询[`hint()`](https://docs.mongodb.com/manual/reference/method/cursor.hint/#cursor.hint)以显式强制查询使用该索引。


### <span id="单调">单调写</span>

默认情况下，MongoDB为独立[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)实例和副本集提供单调写保证。

有关单调的写入和分片群集，请参见 [因果一致性](https://docs.mongodb.com/manual/core/write-operations-atomicity/#causal-consistency)。


### <span id="订单">实时订单</span>

*3.4版的新功能。*

对于主服务器上的读取和写入操作，发出具有[`"linearizable"`](https://docs.mongodb.com/manual/reference/read-concern-linearizable/#readconcern."linearizable")读取关注的读取操作和具有[`"majority"`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority")写入关注的写入操作使多个线程可以在单个文档上执行读写操作，就好像单个线程实时地执行了这些操作一样。也就是说，这些读写的相应计划被认为是线性的。

​	也可以看看:

​	[因果一致性](https://docs.mongodb.com/manual/core/write-operations-atomicity/#causal-consistency)

### <span id="因果">因果一致性</span>

*3.6版的新功能。*

如果操作在逻辑上取决于先前的操作，则这些操作之间存在因果关系。例如，基于指定条件删除所有文档的写入操作和验证删除操作的后续读取操作具有因果关系。

在因果一致的会话中，MongoDB按照尊重因果关系的顺序执行因果操作，并且客户观察到与因果关系一致的结果。

#### 客户会话和因果一致性保证

为了提供因果一致性，MongoDB 3.6在客户端会话中启用因果一致性。因果一致的会话表示具有[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority") 读关注点的读操作和具有[`"majority"`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority")写关注点的写操作的关联序列具有因果关系，这由它们的顺序反映出来。 **应用程序必须确保一次只有一个线程在客户端会话中执行这些操作。**

对于因果相关的操作：

客户端启动客户端会话。

> 重要
>
> 客户会话仅保证以下方面的因果一致性：
>
> - 读取操作[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority"); 也就是说，返回数据已被大多数副本集成员确认并且是持久的。
>
> - 关注写操作；也就是说，写操作要求确认该操作已应用于大多数副本集的有投票权的成员。
>
>   有关因果一致性和各种读写问题的更多信息，请参见 [因果一致性和读写问题](https://docs.mongodb.com/manual/core/causal-consistency-read-write-concerns/)。

当客户端发出具有[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")读关注和写操作（具有 [`"majority"`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority")写关注）的读取序列时 ，客户端将会话信息包含在每个操作中。

对于与会话相关联的每个具有[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")读关注度的读操作和具有[`"majority"`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority")写关注度的写操作，即使操作错误，MongoDB也会返回操作时间和集群时间。客户端会话跟踪操作时间和群集时间。


> 注意
>
> 对于未确认的(w: 0)写操作，MongoDB不返回操作时间和集群时间。未被承认的书写不暗示任何因果关系。
>
> 虽然MongoDB在客户端会话中返回读操作和已确认的写操作的操作时间和集群时间，但只有读关注“多数”的读操作和写关注“多数”的写操作才能保证因果一致性。有关细节，请参阅 [因果一致性和读写问题](https://docs.mongodb.com/manual/core/causal-consistency-read-write-concerns/)。

关联的客户端会话跟踪这两个时间字段。

 > 注意
 >
 > 不同会话之间的操作可以因果一致。MongoDB驱动程序和[`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo)外壳程序提供了延长客户端会话的操作时间和集群时间的方法。因此，客户端可以提前一个客户端会话的群集时间和操作时间，使其与另一客户端会话的操作保持一致。

##### 因果一致性保证

下表列出了因果一致性会话提供的因果一致性保证，[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")涉及具有读关注的读取操作 和具有[`"majority"`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority")写关注的写入操作。

| 保证金       | 描述                                                         |
| :----------- | :----------------------------------------------------------- |
| 阅读您的文章 | 读操作反映了在其之前的写操作的结果。                         |
| 单调读       | 读取操作不会返回与先前读取操作相比更早的数据状态的结果。<br/>例如，如果在会话中：<br/>write<sub>1</sub>优先于write<sub>2</sub>，<br/>read<sub>1</sub>优先于read<sub>2</sub>，<br/>并且reda<sub>1</sub>返回反映write<sub>2</sub>的结果<br/>那么read<sub>2</sub>无法返回write<sub>1</sub>的结果。 |
| 单调写       | 必须在其他写入之前执行的写入操作将在其他写入之前执行。<br/>例如，如果在会话中write<sub>1</sub>必须在write<sub>2</sub>之前，那么在write<sub>2</sub>时数据的状态必须反映数据post write<sub>1</sub>的状态。其他的写操作可以交错在write<sub>1</sub>和write<sub>2</sub>之间，但是write<sub>2</sub>不能出现在write<sub>1</sub>之前。 |
| 写跟读       | 在读操作之后执行读操作之后必须发生的写操作。即，写入时的数据状态必须包含之前的读取操作的数据状态。 |

#### 读取首选项

这些保证适用于MongoDB部署的所有成员。例如，如果在因果一致的会话中发出具有[`"majority"`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority")写关注点的写操作， 然后发出从[`secondary`](https://docs.mongodb.com/manual/core/read-preference/#secondary)具有[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")读关注点的辅助卷（即读首选项） 读取的读，则读操作将反映写操作之后的数据库状态。
#### 隔离

因果一致的会话内的操作与会话外的操作不是隔离的。如果并发写操作在会话的写操作和读操作之间交错，则会话的读操作可能返回反映在会话的写操作*之后*发生的写操作的结果。
#### MongoDB驱动程序

> 提示
>
> 应用程序必须确保一次只有一个线程在客户端会话中执行这些操作。

客户端需要为MongoDB 3.6或更高版本更新的MongoDB驱动程序：

|             |            |              |
| ----------- | ---------- | ------------ |
| Java 3.6+   | C＃2.5以上 | Perl 2.0以上 |
| Python 3.6+ | 节点3.0+   | PHPC 1.4以上 |
| C 1.9以上   | 红宝石2.5+ | Scala 2.2+   |


#### 例子

> 重要
>
> 因果一致的会话只能保证因读而[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")引起的读和因[`"majority"`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority")写而引起的写的 因果一致性 

考虑一个集合项，它维护各种项的当前和历史数据。只有历史数据的结束日期是非空的。如果某个项的sku值发生了更改，则需要用结束日期更新具有旧sku值的文档，然后用当前sku值插入新文档。客户端可以使用因果一致会话来确保更新在插入之前发生。

#### 局限性

以下构建内存结构的操作在因果上不一致：

| 操作方式                                                     | 笔记                                               |
| ------------------------------------------------------------ | -------------------------------------------------- |
| [`collStats`](https://docs.mongodb.com/manual/reference/command/collStats/#dbcmd.collStats) |                                                    |
| [`$collStats`](https://docs.mongodb.com/manual/reference/operator/aggregation/collStats/#pipe._S_collStats)与`latencyStats`选项。 |                                                    |
| [`$currentOp`](https://docs.mongodb.com/manual/reference/operator/aggregation/currentOp/#pipe._S_currentOp) | 如果操作与因果一致的客户端会话相关联，则返回错误。 |
| [`createIndexes`](https://docs.mongodb.com/manual/reference/command/createIndexes/#dbcmd.createIndexes) |                                                    |
| [`dbHash`](https://docs.mongodb.com/manual/reference/command/dbHash/#dbcmd.dbHash) | 从MongoDB 4.2开始                                  |
| [`dbStats`](https://docs.mongodb.com/manual/reference/command/dbStats/#dbcmd.dbStats) |                                                    |
| [`getMore`](https://docs.mongodb.com/manual/reference/command/getMore/#dbcmd.getMore) | 如果操作与因果一致的客户端会话相关联，则返回错误   |
| [`$indexStats`](https://docs.mongodb.com/manual/reference/operator/aggregation/indexStats/#pipe._S_indexStats) |                                                    |
| [`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce) | 从MongoDB 4.2开始                                  |
| [`ping`](https://docs.mongodb.com/manual/reference/command/ping/#dbcmd.ping) | 如果操作与因果一致的客户端会话相关联，则返回错误。 |
| [`serverStatus`](https://docs.mongodb.com/manual/reference/command/serverStatus/#dbcmd.serverStatus) | 如果操作与因果一致的客户端会话相关联，则返回错误   |
| [`validate`](https://docs.mongodb.com/manual/reference/command/validate/#dbcmd.validate) | 从MongoDB 4.2开始                                  |

