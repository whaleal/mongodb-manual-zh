# 副本集的写安全

[副本集的写安全](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-write-concern)描述了在操作成功返回之前必须确认写入操作的数据承载节点（即主节点和从节点，但不是仲裁节点）的数量。节点只有在成功接收并应用写入后才能确认写入操作。

对于副本集，写安全 [`w: "majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)需要确认写入操作已传播到 [计算出的大多数](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-calculating-majority-count)数据承载投票成员。对于大多数副本集配置， [`w: "majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)是默认的写安全。要了解 MongoDB 如何确定默认写安全，请参阅[隐式默认写安全。](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-default-behavior)

对于启用了[日志记录](https://www.mongodb.com/docs/manual/core/journaling/#std-label-journaling-internals)`"majority"`的节点集群，将写安全与[`j : true`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.j)可以防止[回滚](https://www.mongodb.com/docs/manual/core/replica-set-rollbacks/#std-label-replica-set-rollbacks)写安全确认数据。

具有写安全的写操作 [`w: 1`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)要求只有主副本集节点在返回写安全确认之前确认写。您可以指定一个整数值，该整数值大于`1`要求来自主节点的确认，以及满足指定值所需的尽可能多的从节点，最多不超过副本集中数据承载节点的总数。

有关写入确认行为的完整文档，请参阅[确认行为。](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-ack-behavior)

![写入关注级别为 ``w: "majority"`` 的副本集的写入操作，或者写入主要的和至少一个次要的。](../../images/replica-set-write-concern01.svg)

发出需要写安全确认的写操作的应用程序会一直等待，直到主节点收到来自指定写安全所需数量的节点的确认。对于`w`大于 1 或 `w : "majority"`的写安全，主节点会等待，直到所需数量的从节点在返回写安全确认之前确认写入。对于写安全`w: 1`，主节点可以在本地应用写操作后立即返回写安全确认。

确认写入的节点越多，写入的数据在 [主节点发生故障](https://www.mongodb.com/docs/manual/replication/#std-label-replication-auto-failover)时回滚的可能性就越小。但是，指定高的写安全会增加延迟，因为客户端必须等待，直到收到请求的写入关注确认级别。

为任何给定的写入操作选择理想的写安全取决于您的应用程序的性能目标和数据持久性要求。有关配置写关注以防止回滚的更多指导，请参阅[避免副本集回滚。](https://www.mongodb.com/docs/manual/core/replica-set-rollbacks/#std-label-rollback-avoid)

## 验证对副本集的写入操作

以下操作包括该方法的`writeConcern`选项[`insertOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)。该操作指定： -[`"majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)写关注，以及 - 5 秒超时。

[`wtimeout`](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-wtimeout)write concern 参数确保操作不会无限期地阻塞。

```
db.products.insertOne(
   { item: "envelopes", qty : 100, type: "Clasp" },
   { writeConcern: { w: "majority" , wtimeout: 5000 } }
)
```



应用程序一直等到主节点返回写安全确认，这表明[计算出的大多数](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-calculating-majority-count)数据承载投票节点已确认写入操作。例如，在 3个节点副本集 (PSS) 中，该操作需要 3 个节点中的 2 个节点的确认。如果稍后将副本集扩展为包括两个额外的投票次要节点，则相同的操作将需要 5 个副本集成节点的 3 个的确认。如果主节点未在 `wtimeout`限制内返回写关注确认，则写操作将失败并出现写安全错误。

等待指定写安全超时的写操作，仅表示要求数量的副本集成员在该`wtimeout`时间段内没有确认写操作。它不一定表示主节点未能应用写入。在写安全错误时，数据可能存在于副本集节点的子集上，并且可以继续复制，直到集群中的所有节点都拥有该数据。无论写安全确认的状态如何，应用程序都应考虑写入数据的潜在可用性。

指定写安全的确切语法取决于写操作。有关写安全支持和语法的说明，请参阅写入操作的文档。有关写安全的完整文档，请参阅[写安全。](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-write-concern)

>## 提示
>
>### 也可以看看：
>
>[写方法致谢](https://www.mongodb.com/docs/manual/release-notes/2.6-compatibility/#std-label-write-methods-incompatibility)



## 修改默认写安全

您可以通过发出[`setDefaultRWConcern`](https://www.mongodb.com/docs/manual/reference/command/setDefaultRWConcern/#mongodb-dbcommand-dbcmd.setDefaultRWConcern)命令来修改副本集的默认写安全。

如果您发出具有特定写安全的写操作，写操作将使用其自己的写安全而不是默认值。

>## 提示
>
>### 也可以看看：
>
>[写安全](https://www.mongodb.com/docs/manual/reference/write-concern/)

## 自定义写入问题

您可以[标记](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/)副本集的节点并使用生成的标记集来创建自定义写入问题。有关使用标签集配置自定义写入问题的信息，请参阅[配置副本集标签](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/)集。

←  [副本集读写语义](https://www.mongodb.com/docs/manual/applications/replication/)[阅读偏好](https://www.mongodb.com/docs/manual/core/read-preference/) →

原文链接 - https://docs.mongodb.com/manual/core/replica-set-write-concern/ 

译者：陆文龙

