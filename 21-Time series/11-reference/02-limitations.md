# 时间序列收集限制 

此页面描述了使用[时间序列集合的限制。](https://www.mongodb.com/docs/manual/core/timeseries-collections/#std-label-manual-timeseries-collection)

## 不支持的功能[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#unsupported-features)

时间序列集合不支持以下功能：

- [图集搜索](https://www.mongodb.com/docs/atlas/atlas-search/)
- [改变流](https://www.mongodb.com/docs/manual/changeStreams/#std-label-changeStreams)
- [客户端字段级加密](https://www.mongodb.com/docs/manual/core/csfle/#std-label-manual-csfle-feature)
- [数据库触发器](https://www.mongodb.com/docs/realm/triggers/database-triggers/)
- [GraphQL API](https://www.mongodb.com/docs/realm/graphql/)
- [架构验证规则](https://www.mongodb.com/docs/manual/core/schema-validation/#std-label-schema-validation-overview)
- [`reIndex`](https://www.mongodb.com/docs/manual/reference/command/reIndex/#mongodb-dbcommand-dbcmd.reIndex)
- [`renameCollection`](https://www.mongodb.com/docs/manual/reference/command/renameCollection/#mongodb-dbcommand-dbcmd.renameCollection)

[阿特拉斯设备同步](https://www.mongodb.com/docs/realm/sync/)仅当时间序列集合不对称同步时才受支持。有关详细信息，请参阅 [启用 Atlas 设备同步。](https://www.mongodb.com/docs/realm/sync/configure/enable-sync/)

## 聚合 $out 和 $merge[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#aggregation--out-and--merge)

您不能使用[`$out`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)或[`$merge`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)聚合管道阶段将数据从另一个集合添加到时间序列集合。



## 更新和删除[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#updates-and-deletes)

从 MongoDB 5.1 开始，您可以执行一些删除和更新操作。

删除命令必须满足以下要求：

- 您只能匹配[metaField](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-procedures/#std-label-time-series-fields)字段值。
- 您的删除命令不得限制要删除的文档数。设置`justOne: false`或使用 [`deleteMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/#mongodb-method-db.collection.deleteMany)方法。

更新命令必须满足以下要求：

- 您只能匹配`metaField`字段值。
- 您只能修改`metaField`字段值。
- 您的更新文档只能包含[更新运算符](https://www.mongodb.com/docs/manual/reference/operator/update/#std-label-update-operators)表达式。
- 您的更新命令不得限制要更新的文档数量。设置`multi: true`或使用 [`updateMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany)方法。
- 您的更新命令不得设置[upsert: true 。](https://www.mongodb.com/docs/manual/reference/method/db.collection.update/#std-label-update-upsert)

在 MongoDB 5.0 中，时间序列集合只支持插入操作和读取查询。更新和手动删除操作会导致错误。

要自动删除旧数据，[请设置自动删除 (TTL) 。](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-automatic-removal/#std-label-set-up-automatic-removal)

要从集合中删除所有文档，请使用 [`drop()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.drop/#mongodb-method-db.collection.drop)drop 方法删除集合。



## 时间序列二级索引[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#time-series-secondary-indexes)

MongoDB 6.0 改进了对二级索引的支持。

### MongoDB 6.0 及更高版本的时间序列二级索引[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#time-series-secondary-indexes-with-mongodb-6.0-and-later)

从 MongoDB 6.0 开始，您可以为任何字段添加[二级索引。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary-index)

不支持这些索引类型：

- [文本索引](https://www.mongodb.com/docs/manual/core/index-text/#std-label-index-feature-text)
- [二维索引](https://www.mongodb.com/docs/manual/core/2d/#std-label-2d-index)
- [唯一索引](https://www.mongodb.com/docs/manual/core/index-unique/#std-label-index-type-unique)

不支持[TTL](https://www.mongodb.com/docs/manual/core/index-ttl/#std-label-index-feature-ttl)索引属性。对于 TTL 删除，请使用[expireAfterSeconds 。](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#std-label-db.createCollection.expireAfterSeconds)

您只能在`metaField`上使用[多键索引](https://www.mongodb.com/docs/manual/core/index-multikey/#std-label-index-type-multikey)类型。

部分支持这些索引属性。您可以创建：

- `metaField`除和之外的每个字段的 [部分索引](https://www.mongodb.com/docs/manual/core/index-partial/#std-label-index-type-partial)`timeField`。
- 上的[稀疏索引](https://www.mongodb.com/docs/manual/core/index-sparse/#std-label-index-type-sparse)`metaField`。

有关从 MongoDB 6.0 开始可用的时间序列二级索引的改进，请参阅 MongoDB 6.0 中的[时间序列二级索引。](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-secondary-index/#std-label-timeseries-add-secondary-index-mongodb-6.0)

[如果时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries-collections/#std-label-manual-timeseries-collection)上有[二级索引](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary-index)并且您需要降级功能兼容版本 (FCV)，则必须首先删除与降级后的 FCV 不兼容的所有二级索引。看[。](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)

### MongoDB 5.0 及更早版本的时间序列二级索引[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#time-series-secondary-indexes-with-mongodb-5.0-and-earlier)

在 MongoDB 5.0 及更早版本中：

- `metaField`可以有二级索引。
- `timeField` 可以有二级索引。
- 如果`metaField`是文档，您可以在文档内的字段上添加二级索引。



## TIP

### 也可以看看：

[索引](https://www.mongodb.com/docs/manual/indexes/#std-label-indexes)

## 上限集合[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#capped-collections)

您不能将时间序列集合创建为[上限集合。](https://www.mongodb.com/docs/manual/core/capped-collections/#std-label-manual-capped-collection)

## 集合类型的修改[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#modification-of-collection-type)

您只能在创建集合时设置集合类型：

- 无法将现有集合转换为时间序列集合。
- 时间序列集合不能转换为不同的集合类型。

要将数据从现有集合移动到时间序列集合，请将数据 [迁移到时间序列集合。](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-migrate-data-into-timeseries-collection/#std-label-migrate-data-into-a-timeseries-collection)

## 修改`timeField`和`metaField`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#modification-of-timefield-and-metafield)

您只能在创建集合时设置集合的`timeField`和`metaField` 参数。您以后不能修改这些参数。



## 的修改`granularity`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#modification-of-granularity)

设置后`granularity`，一次只能增加一级。`granularity`可以从`"seconds"`到 `"minutes"`或从`"minutes"`到`"hours"`更改。不允许进行其他更改。

要将`granularity`from更改`"seconds"`为`"hours"`，首先增加`granularity`to `"minutes"`，然后再增加 to `"hours"`。



## 分片[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#sharding)

从 MongoDB 5.1（和 5.0.6）开始，您可以创建分片时间序列集合。

在 MongoDB 5.0.6 之前的版本中，您不能对时间序列集合进行分片。

### 分片管理命令[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#sharding-administration-commands)

从 MongoDB 5.2（和 5.1.2、5.0.6）开始，您可以在集合上运行[分片管理命令](https://www.mongodb.com/docs/manual/reference/command/nav-sharding/#std-label-db-commands-sharding)（例如 [`moveChunk`](https://www.mongodb.com/docs/manual/reference/command/moveChunk/#mongodb-dbcommand-dbcmd.moveChunk)） 。`system.buckets`

在 MongoDB 5.0.6 之前的版本中，您不能为分片时间序列集合运行分片管理命令。

### 片键字段[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#shard-key-fields)

在对时间序列集合进行分片时，只能在分片键中指定以下字段：

- 这`metaField`
- 的子领域`metaField`
- 这`timeField`

您可以在分片键中指定这些字段的组合。`_id`分片键模式中不允许包含其他字段，包括。

当您指定分片键时：

- `metaField`可以是：
  - [哈希分片键](https://www.mongodb.com/docs/manual/core/hashed-sharding/#std-label-sharding-hashed-sharding)
  - [远程分片键](https://www.mongodb.com/docs/manual/core/ranged-sharding/#std-label-sharding-ranged)
- `timeField`一定是：
  - [远程分片](https://www.mongodb.com/docs/manual/core/ranged-sharding/#std-label-sharding-ranged)键
  - 在分片键模式的末尾



## TIP

避免**仅**将 the指定`timeField`为分片键。由于`timeField` [单调增加](https://www.mongodb.com/docs/manual/core/sharding-choose-a-shard-key/#std-label-shard-key-monotonic)，它可能导致所有写入出现在集群内的单个块上。理想情况下，数据均匀分布在块中。

要了解如何最好地选择分片键，请参阅：

- [选择一个分片键](https://www.mongodb.com/docs/manual/core/sharding-choose-a-shard-key/#std-label-sharding-shard-key-requirements)
- [MongoDB 博客：关于为 MongoDB 选择分片键。](https://www.mongodb.com/blog/post/on-selecting-a-shard-key-for-mongodb?tck=docs_server)

### 重新分片[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#resharding)

您不能重新分片时间序列集合。

## 交易[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#transactions)

您不能在[事务中写入时间序列集合。](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions)



## NOTE

事务支持从时间序列集合中读取。

## 查看限制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#view-limitations)

时间序列集合是可写的非物化视图。视图的限制适用于时间序列集合。

- 您不能从时间序列存储桶集合命名空间（即以 为前缀的集合`system.buckets`）创建视图。

←  [时间序列压缩](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-compression/)[交易](https://www.mongodb.com/docs/manual/core/transactions/) →

原文链接 -https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/

译者：陆文龙
