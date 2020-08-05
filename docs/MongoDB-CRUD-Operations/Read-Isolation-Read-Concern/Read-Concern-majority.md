## 阅读关注“majority”

 在本页面

*   [性能](#性能)
*   [可用性](#可用性)
*   [例子](#例子)
*   [存储引擎支持](#支持)
*   [阅读关注`"majority"`和交易](#交易)
*   [阅读关注`"majority"`和汇总](总)
*   [阅读你自己的写作](#写作)
*   [禁用阅读关注多数](#禁用)

对于与多文档事务无关的读操作，阅读问题**“majority”**保证所读的数据得到了大多数副本集成员的认可(即，所读的文档是持久的，并且保证不会回滚)。

对于多文档事务中的操作，只有当事务以写关注点“多数”提交时，读关注点“多数”才提供保证。否则，“多数”读取关注不能保证在事务中读取的数据。

不管读关注级别是什么，节点上的最新数据都可能不能反映系统中数据的最新版本。

### <span id="性能">性能</span>

每个副本集成员在内存中维护多数提交点处的数据视图。多数提交点是由初级计算的。为了满足读取关注**"majority"**，该节点从该视图返回数据，并且性能成本与其他读取关注相当。

### <span id="可用性">可用性</span>

读关注[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")可用于有或没有因果关系一致的会话和事务。

您可以[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")为具有三名成员的主次仲裁器（PSA）架构的部署禁用读关注。但是，这会影响分片群集上的变更流（仅在MongoDB 4.0和更早版本中）和事务。有关更多信息，请参见[禁用多数阅读关注](https://docs.mongodb.com/manual/reference/read-concern-majority/#disable-read-concern-majority)。

### <span id="例子">例子</span>

考虑写入操作 Write<sub>0</sub> 到三个成员副本集的以下时间轴：

> **注意**

* Write<sub>0</sub> 之前的所有写操作都已成功复制到所有成员。

* Write<sub>prev</sub> 是 Write<sub>0</sub>之前的写入。

* 在 Write<sub>0</sub>之后没有发生其他写操作。

  ![Timeline of a write operation to a three member replica set.](https://docs.mongodb.com/manual/_images/read-concern-write-timeline.svg)

| 时间          | 事件                                                         | 最新写                                                       | 最新的多数写                                                 |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| t<sub>0</sub> | 主要适用于Write<sub>0</sub>                                  | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>prev</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> | 主要：Write<sub>prev</sub><br/>次要<sub>1</sub>：Write<sub>prev</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> |
| t<sub>1</sub> | Secondary<sup>1</sup>适用于Write<sub>0</sub>                 | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> | 主要：Write<sub>prev</sub><br/>次要<sub>1</sub>：Write<sub>prev</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> |
| t<sub>2</sub> | Secondary<sup>2</sup>适用于Write<sub>0</sub>                 | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>0</sub> | 主要：Write<sub>prev</sub><br/>次要<sub>1</sub>：Write<sub>prev</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> |
| t<sub>3</sub> | Primary知道到Secondary<sub>1</sub>的复制成功，并向客户端发送确认 | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>0</sub> | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>prev</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> |
| t<sub>4</sub> | Primary 知道成功复制到 Secondary<sub>2</sub>                 | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>0</sub> | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>prev</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> |
| t<sub>5</sub> | Secondary<sub>1</sub>接收通知(通过常规复制机制)以更新其最近 w：“多数”写入的快照 | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>0</sub> | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> |
| t<sub>6</sub> | Secondary<sub>2</sub>接收通知(通过常规复制机制)以更新其最近 w：“多数”写入的快照 | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>0</sub> | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>0</sub> |

然后，下表总结了具有[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")读取关注的读取操作在时间将看到的数据状态`T`。

![Timeline of a write operation to a three member replica set.](https://docs.mongodb.com/manual/_images/read-concern-write-timeline.svg)

| 阅读目标              | Time `T`            | 数据状态                        |
| --------------------- | ------------------- | ------------------------------- |
| 主                    | 在t<sub>3</sub>之前 | 数据反映了 Write<sub>prev</sub> |
| 主                    | 在t<sub>3</sub>之后 | 数据反映了 Write<sub>0</sub>    |
| Secondary<sub>1</sub> | 在t<sub>5</sub>之前 | 数据反映了 Write<sub>prev</sub> |
| Secondary<sub>1</sub> | 在t<sub>5</sub>之后 | 数据反映了 Write<sub>0</sub>    |
| Secondary<sub>2</sub> | 在t<sub>6</sub>之前 | 数据反映了 Write<sub>prev</sub> |
| Secondary<sub>2</sub> | 在t<sub>6</sub>之后 | 数据反映了 Write<sub>0</sub>    |


### <span id="支持">存储引擎支持</span>

读取关注“多数”可用于 WiredTiger 存储引擎。

> **提示**
>
> [serverStatus](#)命令返回[storageEngine.supportsCommittedReads](#)字段，该字段指示存储引擎是否支持**”majority“**读取问题。

### <span id="交易">阅读关注`"majority"`和交易</span>

> 注意
>
> 您可以在事务级别上而不是在单个操作级别上设置读取关注。要设置事务的已读关注点，请参见[事务和已读关注点](https://docs.mongodb.com/manual/core/transactions/#transactions-read-concern)。

对于[多文档事务中的操作](https://docs.mongodb.com/manual/core/transactions/)，`"majority"`仅当事务以[写关注“多数”](https://docs.mongodb.com/manual/core/transactions/#transactions-write-concern)提交时，读关注才提供其保证。否则， [`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")读取关注点不能保证事务中读取的数据。

### <span id="总">阅读关注`"majority"`和汇总</span>

从MongoDB 4.2开始，您可以为包含阶段的聚合指定[读取关注](https://docs.mongodb.com/manual/reference/read-concern/)级别。[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")[`$out`](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out)

在MongoDB 4.0和更早版本中，您不能包括将读取关注用于聚合的[`$out`](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out) 阶段[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")。

### <span id="写作">阅读你自己的写作</span>

更改了 version 3.6.

从 MongoDB 3.6 开始，如果写请求确认，则可以使用因果关系一致来读取您自己的写入。

在MongoDB 3.6之前，您必须发出具有写入关注点的写入操作， 然后 对读取操作使用或关注读取，以确保单个线程可以读取自己的写入。[`{ w: "majority" }`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority")[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")[`"linearizable"`](https://docs.mongodb.com/manual/reference/read-concern-linearizable/#readconcern."linearizable")

### <span id="禁用">禁用阅读关注多数</span>

适用于3成员主-副-仲裁器体系结构

[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")如果您具有具有主要-次要仲裁器（PSA）体系结构的三成员副本集或具有三成员PSA分片的分片群集，则可以禁用读关注。

> **注意**
>
> 如果您使用的是 3-member PSA 以外的部署，则无需禁用多数读取关注。

对于三成员PSA架构，缓存压力将增加，如果任何承载数据的节点是关闭的。为了防止存储缓存压力使PSA架构的部署无法被锁定，您可以通过设置以下任一项来禁用read concern:

* [`--enableMajorityReadConcern`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-enablemajorityreadconcern)的命令行选项`false`。

*   [`replication.enableMajorityReadConcern`](https://docs.mongodb.com/manual/reference/configuration-options/#replication.enableMajorityReadConcern)配置文件设置为`false`。

要检查是否已禁用“大多数”的阅读关注，您可以[`db.serverStatus()`](https://docs.mongodb.com/manual/reference/method/db.serverStatus/#db.serverStatus)在[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)实例上运行 并检查该[`storageEngine.supportsCommittedReads`](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.storageEngine.supportsCommittedReads)字段。如果为`false`，则禁用“大多数”关注。
> **重要**
>
> 通常，除非必要，否则请避免禁用“多数”读取问题。但是，如果您的 three-member 副本集具有 primary-secondary-arbiter(PSA)architecture 或带有 three-member PSA 分片的分片 cluster，请禁用以防止存储缓存压力导致部署无法运行。
> 禁用“多数”读取问题会禁用对改变流的支持。

**更改流**

禁用[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")读取关注会禁用对MongoDB 4.0及更早版本的[变更流的](https://docs.mongodb.com/manual/changeStreams/)支持。对于MongoDB 4.2+，禁用读取关注**"majority"**不会影响更改流的可用性。

**交易次数**

禁用[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")读取关注会影响对分片群集上[事务的](https://docs.mongodb.com/manual/core/transactions/)支持 。特别：

- [`"snapshot"`](https://docs.mongodb.com/manual/reference/read-concern-snapshot/#readconcern."snapshot")如果事务涉及已[禁用读取关注“多数”的分片](https://docs.mongodb.com/manual/reference/read-concern-majority/#disable-read-concern-majority)，则该事务不能使用读取关注。
- 如果事务的任何读或写操作写入多个分片错误，则该事务涉及已禁用读取关注的分片[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")。

但是，它不影响 副本集上的[事务](https://docs.mongodb.com/manual/core/transactions/)。对于副本集上的事务，即使禁用了读取关注，也可以为多文档事务指定读取关注[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")（或[`"snapshot"`](https://docs.mongodb.com/manual/reference/read-concern-snapshot/#readconcern."snapshot") 或[`"local"`](https://docs.mongodb.com/manual/reference/read-concern-local/#readconcern."local")）[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")。