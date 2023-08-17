## 上限集合

### 概述

[上限集合](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-capped-collection)是固定大小的集合，支持根据插入顺序插入和检索文档的高吞吐量操作。上限集合的工作方式与循环缓冲区类似：一旦集合填满其分配的空间，它就会通过覆盖集合中最旧的文档来为新文档腾出空间。

有关创建上限集合的更多信息，请参阅[`createCollection()`](https://www.mongodb.com/docs/v7.0/reference/method/db.createCollection/#mongodb-method-db.createCollection)或。[`create`](https://www.mongodb.com/docs/v7.0/reference/command/create/#mongodb-dbcommand-dbcmd.create)

```
提示:
作为上限集合的替代方案，请考虑 MongoDB 的 TTL（生存时间）索引。如通过设置 TTL 使集合中的数据过期中所述，这些索引允许您根据日期类型字段的值和索引的 TTL 值使普通集合中的数据过期并删除。

TTL 索引与上限集合不兼容。
```

### 行为

#### 广告订单

有上限的集合保证插入顺序的保留。因此，查询不需要索引即可按插入顺序返回文档。如果没有这种索引开销，上限集合可以支持更高的插入吞吐量。

#### 自动删除最旧的文档

为了给新文档腾出空间，上限集合会自动删除集合中最旧的文档，而无需脚本或显式删除操作。

考虑以下上限集合的潜在用例：

- 存储大容量系统生成的日志信息。在没有索引的上限集合中插入文档的速度接近于将日志信息直接写入文件系统的速度。此外，内置的*先进先出*属性维护事件的顺序，同时管理存储使用。例如，[操作日志](https://www.mongodb.com/docs/v7.0/core/capped-collections/#std-label-capped-collections-oplog) 使用上限集合。
- 在上限集合中缓存少量数据。由于缓存的读取量大于写入量，因此您需要确保该集合*始终*保留在工作集中（即 RAM 中）*，或者*接受所需索引的一些写入惩罚。

#### Oplog 集合

[在副本集中存储](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-replica-set)[操作](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-oplog)日志的 oplog.rs 集合使用上限集合。

从 MongoDB 4.0 开始，与其他上限集合不同，oplog 可以增长超过其配置的大小限制，以避免删除[`majority commit point`.](https://www.mongodb.com/docs/v7.0/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.optimes.lastCommittedOpTime)

> **笔记:**
>
> MongoDB 将 oplog 的上限大小四舍五入到最接近的 256 整数倍（以字节为单位）。

#### `_id`指数

默认情况下，上限集合有一个`_id`字段和该字段上的索引`_id` 。

### 限制和建议

#### 读

从 MongoDB 5.0 开始，在读取 "capped"（固定大小）集合时，无法使用读关注级别 "[snapshot](https://www.mongodb.com/docs/v7.0/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)"。

#### 更新

如果您计划更新上限集合中的文档，请创建索引，以便这些更新操作不需要集合扫描。

#### 分片

您无法对上限集合进行分片。

#### 查询效率

使用自然排序有效地从集合中检索最近插入的元素。这类似于`tail` 在日志文件上使用命令。

#### 聚合`$out`

聚合管道阶段[`$out`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out) 无法将结果写入上限集合。

#### 交易

从 MongoDB 4.2 开始，在事务中无法向 "[capped](https://www.mongodb.com/docs/v7.0/core/capped-collections/#std-label-manual-capped-collection)"（固定大小）集合写入数据。

#### 稳定的API

[稳定 API](https://www.mongodb.com/docs/v7.0/reference/stable-api/#std-label-stable-api) V1不支持上限集合。

### 过程

#### 创建上限集合

您必须使用该方法显式创建上限集合 [`db.createCollection()`](https://www.mongodb.com/docs/v7.0/reference/method/db.createCollection/#mongodb-method-db.createCollection)，该方法是 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)命令的助手[`create`](https://www.mongodb.com/docs/v7.0/reference/command/create/#mongodb-dbcommand-dbcmd.create)。创建上限集合时，您必须指定集合的最大大小（以字节为单位），MongoDB 将为集合预先分配该大小。上限集合的大小包括少量的内部开销空间。

```
db.createCollection( "log", { capped: true, size: 100000 } )
```

>  *笔记*
>
> 您为该`size`字段提供的值必须大于且`0`小于或等于 `1024^5`(1 PB )。MongoDB 将`size`所有上限集合的 舍入为最接近的 256 整数倍（以字节为单位）。

此外，您还可以使用该字段指定集合的最大文档数，`max`如下文档所示：

```
db.createCollection("log", { capped : true, size : 5242880, max :
5000 } )
```

> 重要的:
>
> 即使您指定了文档数量，该`size`字段*始终是必需的。*`max`如果集合在达到最大文档计数之前达到最大大小限制，MongoDB 会删除较旧的文档。

> 提示:
>
> See:
>
> [`db.createCollection()`](https://www.mongodb.com/docs/v7.0/reference/method/db.createCollection/#mongodb-method-db.createCollection) 和 [`create`.](https://www.mongodb.com/docs/v7.0/reference/command/create/#mongodb-dbcommand-dbcmd.create)

#### 查询上限集合

如果您[`find()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.find/#mongodb-method-db.collection.find)在未指定顺序的情况下对上限集合执行 a，MongoDB 将保证结果的顺序与插入顺序相同。

要以反向插入顺序检索文档，请 与参数设置为 的 方法[`find()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.find/#mongodb-method-db.collection.find)一起发出，如下例所示：[`sort()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.sort/#mongodb-method-cursor.sort)[`$natural`](https://www.mongodb.com/docs/v7.0/reference/operator/meta/natural/#mongodb-operator-metaOp.-natural)`-1`

```
db.cappedCollection.find().sort( { $natural: -1 } )
```

#### 检查集合是否有上限

使用该[`isCapped()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.isCapped/#mongodb-method-db.collection.isCapped)方法来确定集合是否有上限，如下所示：

```
db.collection.isCapped()
```

#### 将集合转换为上限

您可以使用以下命令将非上限集合转换为上限集合[`convertToCapped`](https://www.mongodb.com/docs/v7.0/reference/command/convertToCapped/#mongodb-dbcommand-dbcmd.convertToCapped)：

```
db.runCommand({"convertToCapped": "mycoll", size: 100000});
```

该`size`参数指定上限集合的大小（以字节为单位）。

#### 更改上限集合的大小

*6.0版本中的新功能*。

[`collMod`](https://www.mongodb.com/docs/v7.0/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)您可以使用命令的 选项来设置上限集合的大小`cappedSize`以`cappedSize`字节为单位。`cappedSize`必须大于且`0`小于或等于`1024^5`(1 PB )。

> **笔记:**
>
> 在调整上限集合的大小之前，您必须已将 featureCompatibilityVersion[至少](https://www.mongodb.com/docs/v7.0/reference/command/setFeatureCompatibilityVersion/#std-label-set-fcv)设置为 version `"6.0"`。

例如，以下命令将上限`"log"`集合的最大大小设置为 100000 字节：

```
db.runCommand( { collMod: "log", cappedSize: 100000 } )
```

#### 更改上限集合中的最大文档数

*6.0版本中的新功能*。

要更改上限集合中的最大文档数，请使用 [`collMod`](https://www.mongodb.com/docs/v7.0/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令的`cappedMax`选项。如果`cappedMax`小于或等于`0`，则没有最大文档限制。如果 `cappedMax`小于集合中当前的文档数，MongoDB 将在下一次插入操作时删除多余的文档。

例如，以下命令将 `"log"`上限集合中的最大文档数设置为 500：

```
db.runCommand( { collMod: "log", cappedMax: 500 } )
```

#### 可追溯游标

您可以在固定大小的集合中使用可追溯游标](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-tailable-cursor)（Tailable Cursor）。类似于 Unix 的 tail -f 命令，可追溯游标会"追踪"固定大小集合的末尾。当新文档插入到固定大小集合中时，您可以使用可追溯游标继续检索文档。这使您能够实时获取新插入的数据，适用于监视日志、事件流等需要实时数据的情境。

请参阅“[可追溯游标](https://www.mongodb.com/docs/v7.0/core/tailable-cursors/)”以获取有关创建可追溯游标的信息。
