
## 阅读关注“linearizable”


version 3.4 中的新功能。<br />

查询返回反映在读取操作开始之前完成的所有成功 majority-acknowledged 写入的数据。在返回结果之前，查询可以等待并发执行写入以传播到大多数副本集成员。

如果大多数副本集成员在读取操作后崩溃并重新启动，则如果writeConcernMajorityJournalDefault设置为`true`的默认 state，则读取操作返回的文档是持久的。

当writeConcernMajorityJournalDefault设置为`false`时，MongoDB 不会等待w：“多数”写入在确认写入之前写入 on-disk 日志。因此，`majority`写操作可能会在给定副本集中的大多数节点的瞬时丢失(e.g. 崩溃和重启)的事件中回滚。

您可以仅为主指定读取操作的线性化读取问题。

可线性化读取关注保证仅在读取操作指定唯一标识单个文档的查询过滤器时才适用。

> **提示**
>
> 如果大多数数据承载成员不可用，请始终使用带有线性化读取问题的`maxTimeMS`。 `maxTimeMS`确保操作不会无限期地阻塞，而是确保在无法满足读取关注时操作返回错误。

### 因果一致的会话

对于因果一致会话，Read concern linearizable不可用。

### 聚集限制

不能将[$out](#)或[$merge](#)阶段与read关注点“线性化”结合使用。也就是说，如果您为[db.collection.aggregate()](https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/#db.collection.aggregate)指定了**“linearizable”**read concern，则不能在管道中包含这两个阶段。

### 实时订单

结合[`"majority"`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority")写关注， [`"linearizable"`](https://docs.mongodb.com/manual/reference/read-concern-linearizable/#readconcern."linearizable")读关注使多个线程可以在单个文档上执行读写操作，就好像单个线程实时执行了这些操作一样。也就是说，这些读写的相应计划被认为是线性的。

### 阅读你自己的写作

更改了 version 3.6.

从 MongoDB 3.6 开始，如果写请求确认，则可以使用因果关系一致来读取您自己的写入。

在MongoDB 3.6之前，您必须发出具有写入关注点的写入操作， 然后 对读取操作使用或关注读取，以确保单个线程可以读取自己的写入。[`{ w: "majority" }`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority")[`"majority"`](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")[`"linearizable"`](https://docs.mongodb.com/manual/reference/read-concern-linearizable/#readconcern."linearizable")

### 性能比较

与“多数”不同，“可线性化”的读关注点向辅助成员确认读操作是从能够用 [`{ w: "majority" }`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority") 写关注点确认写操作的主成员读取的。这样，线性化的读取可能比“多数”或“局部”读取要慢得多。

如果大多数数据承载成员不可用，请始终使用带有线性化读取问题的`maxTimeMS`。 `maxTimeMS`确保操作不会无限期地阻塞，而是确保在无法满足读取关注时操作返回错误。

例如：

```shell
db.restaurants.find( { _id: 5 } ).readConcern("linearizable").maxTimeMS(10000)

db.runCommand( {
     find: "restaurants",
     filter: { _id: 5 },
     readConcern: { level: "linearizable" },
     maxTimeMS: 10000
} )
```

在某些情况下，一个副本集中的两个节点可能暂时认为它们是主节点，但它们中的一个最多能够完成[`{ w: "majority" }`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority")写关注点的写操作。能够完成[`{ w: "majority" }`](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority")写操作的节点是当前主节点，而另一个节点是前主节点，它还没有意识到降级，通常是由于网络分区。当发生这种情况时，连接到前主服务器的客户机可能会观察到陈旧的数据，尽管已经请求了读首选项主服务器，并且对前主服务器的新写操作最终将回滚。

