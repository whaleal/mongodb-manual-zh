# 方法

以下文档列出了MongoDB Shell中可用的方法。单击一种方法可在 [MongoDB 手册](https://www.mongodb.com/docs/manual/)，包括语法和示例

>重要的:
>
>重置 shell 与服务器的连接的方法会触发所有打开的服务器的终止[会话](https://www.mongodb.com/docs/manual/reference/server-sessions/). 当会话结束时，所有正在进行的操作也将终止，并且如果启用了身份验证，则客户端必须重新进行身份验证。
>
>以下方法重置 shell 的连接：
>
>- `db.auth`
>- `Mongo.setReadPref`
>- `Mongo.setReadConcern`

## Administration Methods

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`db.adminCommand()`](https://www.mongodb.com/docs/manual/reference/method/db.adminCommand/#mongodb-method-db.adminCommand) | 对数据库运行命令`admin`。                                    |
| [`db.currentOp()`](https://www.mongodb.com/docs/manual/reference/method/db.currentOp/#mongodb-method-db.currentOp) | 报告当前正在进行的操作。                                     |
| [`db.killOp()`](https://www.mongodb.com/docs/manual/reference/method/db.killOp/#mongodb-method-db.killOp) | 终止指定的操作。                                             |
| [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) | 关断电流[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或者[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 清洁安全地处理。 |
| [`db.fsyncLock()`](https://www.mongodb.com/docs/manual/reference/method/db.fsyncLock/#mongodb-method-db.fsyncLock) | 刷新写入磁盘并锁定数据库以防止写入操作并协助备份操作。       |
| [`db.fsyncUnlock()`](https://www.mongodb.com/docs/manual/reference/method/db.fsyncUnlock/#mongodb-method-db.fsyncUnlock) | 允许在锁定的数据库上继续写入 [`db.fsyncLock()`.](https://www.mongodb.com/docs/manual/reference/method/db.fsyncLock/#mongodb-method-db.fsyncLock) |

## 批量操作方法

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`db.collection.initializeOrderedBulkOp()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.initializeOrderedBulkOp/#mongodb-method-db.collection.initializeOrderedBulkOp) | 初始化并返回一个新的[`Bulk()`](https://www.mongodb.com/docs/manual/reference/method/Bulk/#mongodb-method-Bulk)集合的操作生成器。该构建器构建了一个有序的 MongoDB 批量执行的写操作列表。 |
| [`db.collection.initializeUnorderedBulkOp()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.initializeUnorderedBulkOp/#mongodb-method-db.collection.initializeUnorderedBulkOp) | 初始化并返回一个新的[`Bulk()`](https://www.mongodb.com/docs/manual/reference/method/Bulk/#mongodb-method-Bulk)集合的操作生成器。该构建器构建了一个无序列表，其中包含 MongoDB 批量执行的写入操作。 |
| [`Bulk()`](https://www.mongodb.com/docs/manual/reference/method/Bulk/#mongodb-method-Bulk) | 创建一个批量操作构建器，用于构建要为单个集合批量执行的写入操作列表。要实例化构建器，请使用[`db.collection.initializeOrderedBulkOp()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.initializeOrderedBulkOp/#mongodb-method-db.collection.initializeOrderedBulkOp) 或者[`db.collection.initializeUnorderedBulkOp()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.initializeUnorderedBulkOp/#mongodb-method-db.collection.initializeUnorderedBulkOp)方法。 |
| [`Bulk.execute()`](https://www.mongodb.com/docs/manual/reference/method/Bulk.execute/#mongodb-method-Bulk.execute) | 执行由[`Bulk()`](https://www.mongodb.com/docs/manual/reference/method/Bulk/#mongodb-method-Bulk) 运营建设者。 |
| [`Bulk.find()`](https://www.mongodb.com/docs/manual/reference/method/Bulk.find/#mongodb-method-Bulk.find) | 指定更新或删除操作的查询条件。                               |
| [`Bulk.find.hint()`](https://www.mongodb.com/docs/manual/reference/method/Bulk.find.hint/#mongodb-method-Bulk.find.hint) | 设置指定索引以支持批量操作的**提示选项。**                   |
| [`Bulk.find.remove()`](https://www.mongodb.com/docs/manual/reference/method/Bulk.find.remove/#mongodb-method-Bulk.find.remove) | 将删除操作添加到批量操作列表。                               |
| [`Bulk.find.removeOne()`](https://www.mongodb.com/docs/manual/reference/method/Bulk.find.removeOne/#mongodb-method-Bulk.find.removeOne) | 将单个文档删除操作添加到批量操作列表中。                     |
| [`Bulk.find.replaceOne()`](https://www.mongodb.com/docs/manual/reference/method/Bulk.find.replaceOne/#mongodb-method-Bulk.find.replaceOne) | 将单个文档替换操作添加到批量操作列表中。                     |
| [`Bulk.find.updateOne()`](https://www.mongodb.com/docs/manual/reference/method/Bulk.find.updateOne/#mongodb-method-Bulk.find.updateOne) | 将单个文档更新操作添加到批量操作列表中。                     |
| [`Bulk.find.update()`](https://www.mongodb.com/docs/manual/reference/method/Bulk.find.update/#mongodb-method-Bulk.find.update) | 将**多**更新操作添加到批量操作列表。该方法更新现有文档中的特定字段。 |
| [`Bulk.find.upsert()`](https://www.mongodb.com/docs/manual/reference/method/Bulk.find.upsert/#mongodb-method-Bulk.find.upsert) | 设置[更新插入](https://www.mongodb.com/docs/manual/reference/glossary/#term-upsert)`true`用于更新或替换操作的选项。 |
| [`Bulk.getOperations()`](https://www.mongodb.com/docs/manual/reference/method/Bulk.getOperations/#mongodb-method-Bulk.getOperations) | 返回通过执行的写操作数组 [`Bulk.execute()`.](https://www.mongodb.com/docs/manual/reference/method/Bulk.execute/#mongodb-method-Bulk.execute) |
| [`Bulk.insert()`](https://www.mongodb.com/docs/manual/reference/method/Bulk.insert/#mongodb-method-Bulk.insert) | 将插入操作添加到批量操作列表。                               |
| [`Bulk.toJSON()`](https://www.mongodb.com/docs/manual/reference/method/Bulk.tojson/#mongodb-method-Bulk.toJSON) | 返回一个 JSON 文档，其中包含操作数和批次数[`Bulk()`](https://www.mongodb.com/docs/manual/reference/method/Bulk/#mongodb-method-Bulk)目的。 |
| [`Bulk.toString()`](https://www.mongodb.com/docs/manual/reference/method/Bulk.toString/#mongodb-method-Bulk.toString) | 以字符串形式返回一个 JSON 文档，其中包含操作数和批次数[`Bulk()`](https://www.mongodb.com/docs/manual/reference/method/Bulk/#mongodb-method-Bulk)目的。 |

## 收集方法

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`db.collection.aggregate()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.aggregate/#mongodb-method-db.collection.aggregate) | 提供对 [聚合管道。](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/) |
| [`db.collection.bulkWrite()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/#mongodb-method-db.collection.bulkWrite) | 提供批量写入操作功能。                                       |
| [`db.collection.count()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.count/#mongodb-method-db.collection.count) | 在 1.0.6 中弃用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。使用 [`db.collection.countDocuments()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.countDocuments/#mongodb-method-db.collection.countDocuments)或者 [`db.collection.estimatedDocumentCount()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.estimatedDocumentCount/#mongodb-method-db.collection.estimatedDocumentCount)反而。 |
| [`db.collection.countDocuments()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.countDocuments/#mongodb-method-db.collection.countDocuments) | 返回集合或视图中的文档数。包裹[`$group`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group)聚合阶段 [`$sum`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sum/#mongodb-group-grp.-sum)表达。 |
| [`db.collection.estimatedDocumentCount()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.estimatedDocumentCount/#mongodb-method-db.collection.estimatedDocumentCount) | 返回集合或视图中文档的近似计数。                             |
| [`db.collection.createIndex()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) | 在集合上建立索引。                                           |
| [`db.collection.createIndexes()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndexes/#mongodb-method-db.collection.createIndexes) | 在集合上构建一个或多个索引。                                 |
| [`db.collection.dataSize()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.dataSize/#mongodb-method-db.collection.dataSize) | 返回集合的大小。包裹 [`size`](https://www.mongodb.com/docs/manual/reference/command/collStats/#mongodb-data-collStats.size)输出中的字段 [`collStats`.](https://www.mongodb.com/docs/manual/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats) |
| [`db.collection.deleteOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/#mongodb-method-db.collection.deleteOne) | 删除集合中的单个文档。                                       |
| [`db.collection.deleteMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/#mongodb-method-db.collection.deleteMany) | 删除集合中的多个文档。                                       |
| [`db.collection.distinct()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.distinct/#mongodb-method-db.collection.distinct) | 返回指定字段具有不同值的文档数组。                           |
| [`db.collection.drop()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.drop/#mongodb-method-db.collection.drop) | 从数据库中删除指定的集合。                                   |
| [`db.collection.dropIndex()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex) | 删除集合上的指定索引。                                       |
| [`db.collection.dropIndexes()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.dropIndexes/#mongodb-method-db.collection.dropIndexes) | 删除集合上的所有索引。                                       |
| [`db.collection.ensureIndex()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.ensureIndex/#mongodb-method-db.collection.ensureIndex) | 已弃用。使用[`db.collection.createIndex()`.](https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) |
| [`db.collection.explain()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.explain/#mongodb-method-db.collection.explain) | 返回有关各种方法的查询执行的信息。                           |
| [`db.collection.find()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find) | 对集合或视图执行查询并返回游标对象。                         |
| [`db.collection.findAndModify()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.findAndModify/#mongodb-method-db.collection.findAndModify) | 原子地修改并返回单个文档。                                   |
| [`db.collection.findOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.findOne/#mongodb-method-db.collection.findOne) | 执行查询并返回单个文档。                                     |
| [`db.collection.findOneAndDelete()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndDelete/#mongodb-method-db.collection.findOneAndDelete) | 查找单个文档并将其删除。                                     |
| [`db.collection.findOneAndReplace()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndReplace/#mongodb-method-db.collection.findOneAndReplace) | 查找单个文档并替换它。                                       |
| [`db.collection.findOneAndUpdate()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/#mongodb-method-db.collection.findOneAndUpdate) | 查找单个文档并更新它。                                       |
| [`db.collection.getIndexes()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes) | 返回描述集合中现有索引的文档数组。                           |
| [`db.collection.getShardDistribution()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.getShardDistribution/#mongodb-method-db.collection.getShardDistribution) | 打印分片集合的数据分布统计信息。                             |
| [`db.collection.getShardVersion()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.getShardVersion/#mongodb-method-db.collection.getShardVersion) | 为数据库命令提供包装器[获取碎片版本。](https://www.mongodb.com/docs/manual/reference/command/getShardVersion/) |
| [`db.collection.insertOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne) | 在集合中插入一个新文档。                                     |
| [`db.collection.insertMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany) | 在集合中插入几个新文档。                                     |
| [`db.collection.isCapped()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.isCapped/#mongodb-method-db.collection.isCapped) | 报告集合是否是[封顶收藏。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-capped-collection) |
| [`db.collection.mapReduce()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.mapReduce/#mongodb-method-db.collection.mapReduce) | 跑步[map-reduce](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-map-reduce)集合上的聚合操作。 |
| [`db.collection.reIndex()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.reIndex/#mongodb-method-db.collection.reIndex) | 重建集合上的所有现有索引。                                   |
| [`db.collection.renameCollection()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.renameCollection/#mongodb-method-db.collection.renameCollection) | 更改集合的名称。                                             |
| [`db.collection.replaceOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.replaceOne/#mongodb-method-db.collection.replaceOne) | 替换集合中的单个文档。                                       |
| [`db.collection.stats()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.stats/#mongodb-method-db.collection.stats) | 报告集合的状态。提供一个包装器[`collStats`.](https://www.mongodb.com/docs/manual/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats) |
| [`db.collection.storageSize()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.storageSize/#mongodb-method-db.collection.storageSize) | 报告集合使用的总大小（以字节为单位）。提供一个包装器[`storageSize`](https://www.mongodb.com/docs/manual/reference/command/collStats/#mongodb-data-collStats.storageSize)的领域 [`collStats`](https://www.mongodb.com/docs/manual/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats)输出。 |
| [`db.collection.totalIndexSize()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.totalIndexSize/#mongodb-method-db.collection.totalIndexSize) | 报告集合上的索引使用的总大小。提供一个包装器[`totalIndexSize`](https://www.mongodb.com/docs/manual/reference/command/collStats/#mongodb-data-collStats.totalIndexSize) 的领域[`collStats`](https://www.mongodb.com/docs/manual/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats)输出。 |
| [`db.collection.totalSize()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.totalSize/#mongodb-method-db.collection.totalSize) | 报告集合的总大小，包括集合中所有文档和所有索引的大小。       |
| [`db.collection.updateOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne) | 修改集合中的单个文档。                                       |
| [`db.collection.updateMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany) | 修改集合中的多个文档。                                       |
| [`db.collection.validate()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.validate/#mongodb-method-db.collection.validate) | 验证集合。                                                   |
| [`db.collection.watch()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.watch/#mongodb-method-db.collection.watch) | 打开一个[更改流光标](https://www.mongodb.com/docs/manual/changeStreams/)在集合上。 |

## 连接方式

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`Mongo()`](https://www.mongodb.com/docs/manual/reference/method/Mongo/#mongodb-method-Mongo) | `mongo`JavaScript 构造函数，用于从shell 或 JavaScript 文件实例化数据库连接。这[`Mongo()`](https://www.mongodb.com/docs/manual/reference/method/Mongo/#mongodb-method-Mongo)方法具有以下参数：范围类型描述`host`细绳*选修的*目标数据库连接的连接字符串。如果省略，[`Mongo()`](https://www.mongodb.com/docs/manual/reference/method/Mongo/#mongodb-method-Mongo)在默认端口上实例化到本地主机接口的连接`27017`。`autoEncryptionOpts`文档*选修的**4.2版中的新功能*。启用的配置参数 [客户端字段级加密。](https://www.mongodb.com/docs/manual/core/security-client-side-encryption/)`autoEncryptionOpts`覆盖数据库连接的现有客户端字段级加密配置。如果省略，[`Mongo()`](https://www.mongodb.com/docs/manual/reference/method/Mongo/#mongodb-method-Mongo) 继承当前数据库连接的客户端字段级加密配置。有关用法和语法的文档，请参阅 [自动加密选项。](https://www.mongodb.com/docs/manual/reference/method/Mongo/#std-label-autoEncryptionOpts) |
| [`Mongo.getDB()`](https://www.mongodb.com/docs/manual/reference/method/Mongo.getDB/#mongodb-method-Mongo.getDB) | 返回一个数据库对象。                                         |
| [`Mongo.setReadPref()`](https://www.mongodb.com/docs/manual/reference/method/Mongo.setReadPref/#mongodb-method-Mongo.setReadPref) | 设置[阅读偏好](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-read-preference)用于 MongoDB 连接。 |
| [`Mongo.watch()`](https://www.mongodb.com/docs/manual/reference/method/Mongo.watch/#mongodb-method-Mongo.watch) | 打开一个[更改流光标](https://www.mongodb.com/docs/manual/changeStreams/)副本集或分片集群报告其数据库中的所有非系统集合，除了 、`admin`和`local`数据库`config`。 |



## 游标方法

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`cursor.addOption()`](https://www.mongodb.com/docs/manual/reference/method/cursor.addOption/#mongodb-method-cursor.addOption) | 添加修改查询行为的特殊线路协议标志。                         |
| [`cursor.allowPartialResults()`](https://www.mongodb.com/docs/manual/reference/method/cursor.allowPartialResults/#mongodb-method-cursor.allowPartialResults) | 允许[`db.collection.find()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find)如果一个或多个查询的分片不可用，则针对分片集合的操作返回部分结果，而不是错误。 |
| [`cursor.batchSize()`](https://www.mongodb.com/docs/manual/reference/method/cursor.batchSize/#mongodb-method-cursor.batchSize) | 控制 MongoDB 将在单个网络消息中返回给客户端的文档数。以下示例查询以 100 个为一组返回结果：`db.myCollection.find().batchSize(100)` |
| [`cursor.close()`](https://www.mongodb.com/docs/manual/reference/method/cursor.close/#mongodb-method-cursor.close) | 关闭游标并释放关联的服务器资源。                             |
| [`cursor.collation()`](https://www.mongodb.com/docs/manual/reference/method/cursor.collation/#mongodb-method-cursor.collation) | 指定由返回的游标的排序规则 [`db.collection.find()`.](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find) |
| [`cursor.comment()`](https://www.mongodb.com/docs/manual/reference/method/cursor.comment/#mongodb-method-cursor.comment) | 将注释附加到查询以允许在日志和 system.profile 集合中进行跟踪。 |
| [`cursor.count()`](https://www.mongodb.com/docs/manual/reference/method/cursor.count/#mongodb-method-cursor.count) | 修改游标以返回结果集中的文档数而不是文档本身。               |
| [`cursor.explain()`](https://www.mongodb.com/docs/manual/reference/method/cursor.explain/#mongodb-method-cursor.explain) | 报告游标的查询执行计划。                                     |
| [`cursor.forEach()`](https://www.mongodb.com/docs/manual/reference/method/cursor.forEach/#mongodb-method-cursor.forEach) | 为游标中的每个文档应用一个 JavaScript 函数。                 |
| [`cursor.hasNext()`](https://www.mongodb.com/docs/manual/reference/method/cursor.hasNext/#mongodb-method-cursor.hasNext) | 返回`true`游标是否有文档并且可以迭代。                       |
| [`cursor.hint()`](https://www.mongodb.com/docs/manual/reference/method/cursor.hint/#mongodb-method-cursor.hint) | 强制 MongoDB 使用特定索引进行查询。                          |
| [`cursor.isClosed()`](https://www.mongodb.com/docs/manual/reference/method/cursor.isClosed/#mongodb-method-cursor.isClosed) | `true`如果游标关闭则返回。                                   |
| [`cursor.isExhausted()`](https://www.mongodb.com/docs/manual/reference/method/cursor.isExhausted/#mongodb-method-cursor.isExhausted) | `true`如果游标已关闭*并且*批处理中没有剩余对象，则返回。     |
| [`cursor.itcount()`](https://www.mongodb.com/docs/manual/reference/method/cursor.itcount/#mongodb-method-cursor.itcount) | 通过获取和迭代结果集来计算游标客户端中的文档总数。           |
| [`cursor.limit()`](https://www.mongodb.com/docs/manual/reference/method/cursor.limit/#mongodb-method-cursor.limit) | 限制游标结果集的大小。                                       |
| [`cursor.map()`](https://www.mongodb.com/docs/manual/reference/method/cursor.map/#mongodb-method-cursor.map) | 将函数应用于游标中的每个文档，并将返回值收集到数组中。       |
| [`cursor.max()`](https://www.mongodb.com/docs/manual/reference/method/cursor.max/#mongodb-method-cursor.max) | 指定游标的独占索引上限。用于与[`cursor.hint()`](https://www.mongodb.com/docs/manual/reference/method/cursor.hint/#mongodb-method-cursor.hint) |
| [`cursor.maxTimeMS()`](https://www.mongodb.com/docs/manual/reference/method/cursor.maxTimeMS/#mongodb-method-cursor.maxTimeMS) | 指定处理游标操作的累积时间限制（以毫秒为单位）。             |
| [`cursor.min()`](https://www.mongodb.com/docs/manual/reference/method/cursor.min/#mongodb-method-cursor.min) | 指定游标的包含索引下限。用于与[`cursor.hint()`](https://www.mongodb.com/docs/manual/reference/method/cursor.hint/#mongodb-method-cursor.hint) |
| [`cursor.next()`](https://www.mongodb.com/docs/manual/reference/method/cursor.next/#mongodb-method-cursor.next) | 返回游标中的下一个文档。                                     |
| [`cursor.noCursorTimeout()`](https://www.mongodb.com/docs/manual/reference/method/cursor.noCursorTimeout/#mongodb-method-cursor.noCursorTimeout) | 指示服务器避免在一段时间不活动后自动关闭游标。               |
| [`cursor.objsLeftInBatch()`](https://www.mongodb.com/docs/manual/reference/method/cursor.objsLeftInBatch/#mongodb-method-cursor.objsLeftInBatch) | 返回当前游标批次中剩余的文档数。                             |
| [`cursor.readConcern()`](https://www.mongodb.com/docs/manual/reference/method/cursor.readConcern/#mongodb-method-cursor.readConcern) | 指定一个[阅读关注](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-read-concern)为一个 [`db.collection.find()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find)手术。 |
| [`cursor.readPref()`](https://www.mongodb.com/docs/manual/reference/method/cursor.readPref/#mongodb-method-cursor.readPref) | 指定一个[阅读偏好](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-read-preference)到游标来控制客户端如何将查询定向到[副本集。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set) |
| [`cursor.returnKey()`](https://www.mongodb.com/docs/manual/reference/method/cursor.returnKey/#mongodb-method-cursor.returnKey) | 修改游标以返回索引键而不是文档。                             |
| [`cursor.showRecordId()`](https://www.mongodb.com/docs/manual/reference/method/cursor.showRecordId/#mongodb-method-cursor.showRecordId) | 向游标返回的每个文档添加一个内部存储引擎 ID 字段。           |
| [`cursor.size()`](https://www.mongodb.com/docs/manual/reference/method/cursor.size/#mongodb-method-cursor.size) | 应用后返回游标中文档的计数 [`skip()`](https://www.mongodb.com/docs/manual/reference/method/cursor.skip/#mongodb-method-cursor.skip)和[`limit()`](https://www.mongodb.com/docs/manual/reference/method/cursor.limit/#mongodb-method-cursor.limit)方法。 |
| [`cursor.skip()`](https://www.mongodb.com/docs/manual/reference/method/cursor.skip/#mongodb-method-cursor.skip) | 返回一个游标，该游标仅在传递或跳过多个文档后才开始返回结果。 |
| [`cursor.sort()`](https://www.mongodb.com/docs/manual/reference/method/cursor.sort/#mongodb-method-cursor.sort) | 返回根据排序规范排序的结果。                                 |
| [`cursor.tailable()`](https://www.mongodb.com/docs/manual/reference/method/cursor.tailable/#mongodb-method-cursor.tailable) | 将游标标记为可尾。仅对位于上限集合上的游标有效。             |
| [`cursor.toArray()`](https://www.mongodb.com/docs/manual/reference/method/cursor.toArray/#mongodb-method-cursor.toArray) | 返回一个数组，其中包含游标返回的所有文档。                   |

## 数据库方法

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`db.aggregate()`](https://www.mongodb.com/docs/manual/reference/method/db.aggregate/#mongodb-method-db.aggregate) | 运行不需要底层集合的管理/诊断管道。                          |
| [`db.createCollection()`](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection) | 创建新的集合或视图。                                         |
| [`db.createView()`](https://www.mongodb.com/docs/manual/reference/method/db.createView/#mongodb-method-db.createView) | 创建一个视图作为将指定的聚合管道应用于源集合或视图的结果。   |
| [`db.commandHelp()`](https://www.mongodb.com/docs/manual/reference/method/db.commandHelp/#mongodb-method-db.commandHelp) | 显示指定数据库命令的帮助文本。                               |
| [`db.dropDatabase()`](https://www.mongodb.com/docs/manual/reference/method/db.dropDatabase/#mongodb-method-db.dropDatabase) | 删除当前数据库。                                             |
| [`db.getCollection()`](https://www.mongodb.com/docs/manual/reference/method/db.getCollection/#mongodb-method-db.getCollection) | 返回一个集合或视图对象。用于访问名称在[`mongo`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)壳。 |
| [`db.getCollectionInfos()`](https://www.mongodb.com/docs/manual/reference/method/db.getCollectionInfos/#mongodb-method-db.getCollectionInfos) | 返回当前数据库中所有集合和视图的集合信息。                   |
| [`db.getCollectionNames()`](https://www.mongodb.com/docs/manual/reference/method/db.getCollectionNames/#mongodb-method-db.getCollectionNames) | 列出当前数据库中的所有集合和视图。                           |
| [`db.getMongo()`](https://www.mongodb.com/docs/manual/reference/method/db.getMongo/#mongodb-method-db.getMongo) | 返回当前数据库连接。                                         |
| [`db.getLogComponents()`](https://www.mongodb.com/docs/manual/reference/method/db.getLogComponents/#mongodb-method-db.getLogComponents) | 返回当前的日志详细程度设置。                                 |
| [`db.getName()`](https://www.mongodb.com/docs/manual/reference/method/db.getName/#mongodb-method-db.getName) | 返回当前数据库的名称。                                       |
| [`db.getProfilingStatus()`](https://www.mongodb.com/docs/manual/reference/method/db.getProfilingStatus/#mongodb-method-db.getProfilingStatus) | 返回当前[配置文件级别](https://www.mongodb.com/docs/manual/reference/command/profile/#dbcmd.profile),[slowOpThresholdMs](https://www.mongodb.com/docs/manual/reference/configuration-options/#operationProfiling.slowOpThresholdMs) 设置，和[慢操作采样率](https://www.mongodb.com/docs/manual/reference/configuration-options/#operationProfiling.slowOpSampleRate) 环境。 |
| [`db.getSiblingDB()`](https://www.mongodb.com/docs/manual/reference/method/db.getSiblingDB/#mongodb-method-db.getSiblingDB) | 提供对指定数据库的访问。                                     |
| [`db.listCommands()`](https://www.mongodb.com/docs/manual/reference/method/db.listCommands/#mongodb-method-db.listCommands) | 提供所有数据库命令的列表。                                   |
| [`db.logout()`](https://www.mongodb.com/docs/manual/reference/method/db.logout/#mongodb-method-db.logout) | 结束经过身份验证的会话。                                     |
| [`db.printShardingStatus()`](https://www.mongodb.com/docs/manual/reference/method/db.printShardingStatus/#mongodb-method-db.printShardingStatus) | 打印分片配置的格式化报告以及有关分片集群中现有块的信息。     |
| [`db.runCommand()`](https://www.mongodb.com/docs/manual/reference/method/db.runCommand/#mongodb-method-db.runCommand) | 运行一个[数据库命令。](https://www.mongodb.com/docs/manual/reference/command/) |
| [`db.setLogLevel()`](https://www.mongodb.com/docs/manual/reference/method/db.setLogLevel/#mongodb-method-db.setLogLevel) | 为[记录消息。](https://www.mongodb.com/docs/manual/reference/log-messages/) |
| [`db.setProfilingLevel()`](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#mongodb-method-db.setProfilingLevel) | 配置数据库[分析器级别](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#set-profiling-level-level), [慢速](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#set-profiling-level-options-slowms)， 和[采样率。](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#set-profiling-level-options-samplerate) |
| [`db.watch()`](https://www.mongodb.com/docs/manual/reference/method/db.watch/#mongodb-method-db.watch) | 打开一个[更改流光标](https://www.mongodb.com/docs/manual/change-streams/)用于报告其所有非系统集合的数据库。 |

## 免费监测方法

从 MongoDB 4.0 开始，MongoDB（社区版）提供 [免费云监控](https://www.mongodb.com/docs/manual/administration/free-monitoring/)用于独立和副本集部署。



> 笔记:
>
> 免费云监控仅适用于 MongoDB 社区版。

| 方法                                                         | 描述                         |
| :----------------------------------------------------------- | :--------------------------- |
| [`db.disableFreeMonitoring()`](https://www.mongodb.com/docs/manual/reference/method/db.disableFreeMonitoring/#mongodb-method-db.disableFreeMonitoring) | 为您的部署禁用免费云监控。   |
| [`db.enableFreeMonitoring()`](https://www.mongodb.com/docs/manual/reference/method/db.enableFreeMonitoring/#mongodb-method-db.enableFreeMonitoring) | 为您的部署启用免费的云监控。 |
| [`db.getFreeMonitoringStatus()`](https://www.mongodb.com/docs/manual/reference/method/db.getFreeMonitoringStatus/#mongodb-method-db.getFreeMonitoringStatus) | 返回部署的免费云监控状态。   |

## 客户端字段级加密方法

> 笔记:
>
> ### 限制
>
> - `mongosh`自动加密仅在连接到 Atlas 集群或 MongoDB Enterprise Server时可用。有关详细信息，请参阅[自动客户端字段级加密](https://www.mongodb.com/docs/manual/core/security-automatic-client-side-encryption/). 本节列出的方法用于*手动*加密，非企业服务器支持。
> - 的 Homebrew 安装不提供自动加密`mongosh`。
> - 字段级加密仅在`mongosh`二进制中可用，在[嵌入式指南针外壳。](https://www.mongodb.com/docs/compass/current/embedded-shell/)

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`ClientEncryption.decrypt()`](https://www.mongodb.com/docs/manual/reference/method/ClientEncryption.decrypt/#mongodb-method-ClientEncryption.decrypt) | 如果当前数据库连接配置`encryptedValue`为可以访问密钥管理服务 (KMS) 和用于加密的密钥保管库，则解密指定的`encryptedValue`. |
| [`ClientEncryption.encrypt()`](https://www.mongodb.com/docs/manual/reference/method/ClientEncryption.encrypt/#mongodb-method-ClientEncryption.encrypt) | `encryptionKeyId` 使用指定的和加密指定的值`encryptionAlgorithm`。 |
| [`getClientEncryption()`](https://www.mongodb.com/docs/manual/reference/method/getClientEncryption/#mongodb-method-getClientEncryption) | 返回`ClientEncryption`当前数据库集合的对象。                 |
| [`getKeyVault()`](https://www.mongodb.com/docs/manual/reference/method/getKeyVault/#mongodb-method-getKeyVault) | 返回`KeyVault`当前数据库连接的对象。                         |
| [`KeyVault.addKeyAlternateName()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.addKeyAlternateName/#mongodb-method-KeyVault.addKeyAlternateName) | 添加`keyAltName`到`keyAltNames`具有指定 UUID 的数据加密密钥的数组。 |
| [`KeyVault.createKey()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.createKey/#mongodb-method-KeyVault.createKey) | 将数据加密密钥添加到与数据库连接关联的密钥保管库。           |
| [`KeyVault.deleteKey()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.deleteKey/#mongodb-method-KeyVault.deleteKey) | 从与数据库连接关联的密钥保管库中删除具有指定 UUID 的数据加密密钥。 |
| [`KeyVault.getKey()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.getKey/#mongodb-method-KeyVault.getKey) | 获取具有指定 UUID 的数据加密密钥。数据加密密钥必须存在于与数据库连接关联的密钥保管库中。 |
| [`KeyVault.getKeyByAltName()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.getKeyByAltName/#mongodb-method-KeyVault.getKeyByAltName) | 获取具有指定`keyAltName`.                                    |
| [`KeyVault.getKeys()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.getKeys/#mongodb-method-KeyVault.getKeys) | 返回存储在与数据库连接关联的密钥保管库中的所有数据加密密钥。 |
| [`KeyVault.removeKeyAlternateName()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.removeKeyAlternateName/#mongodb-method-KeyVault.removeKeyAlternateName) | `keyAltName`从具有指定 UUID 的数据加密密钥中删除指定的。数据加密密钥必须存在于与数据库连接关联的密钥保管库中。 |

## 本机方法

| 方法              | 描述                                                         |
| :---------------- | :----------------------------------------------------------- |
| `cd()`            | 将当前工作目录更改为指定路径。                               |
| `isInteractive()` | 返回一个布尔值，指示 mongosh 是以交互模式还是脚本模式运行。  |
| `load()`          | 在 shell 中加载并运行 JavaScript 文件。在 中`mongosh`，使用该`load()`方法加载的脚本支持`__filename`和`__dirname`Node.js 变量。这些变量分别返回加载脚本的文件名和目录。返回值始终是绝对路径。在旧版 shell 中，您无法使用该`load()`方法访问脚本的文件名或目录。 |
| `print()`         | 打印指定的文本或变量。`print()`并且`printjson()` 是 . 的别名`console.log()`。`> print("hello world")hello world> x = "example text"> print(x)example text` |
| `pwd()`           | 返回活动 shell 会话的当前工作目录。                          |
| `quit()`          | 退出当前 shell 会话。                                        |
| `sleep()`         | 暂停[`mongo`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)给定时间段内的 shell。 |
| `version()`       | 返回实例的当前版本`mongosh`。                                |

## 查询计划缓存方法

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`db.collection.getPlanCache()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.getPlanCache/#mongodb-method-db.collection.getPlanCache) | 返回一个接口以访问查询计划缓存对象和`PlanCache`集合的关联方法。 |
| [`PlanCache.clear()`](https://www.mongodb.com/docs/manual/reference/method/PlanCache.clear/#mongodb-method-PlanCache.clear) | 删除集合的所有缓存查询计划。                                 |
| [`PlanCache.clearPlansByQuery()`](https://www.mongodb.com/docs/manual/reference/method/PlanCache.clearPlansByQuery/#mongodb-method-PlanCache.clearPlansByQuery) | 清除指定缓存的查询计划 [查询形状。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-query-shape) |
| [`PlanCache.help()`](https://www.mongodb.com/docs/manual/reference/method/PlanCache.help/#mongodb-method-PlanCache.help) | 列出可用于查看和修改集合的查询计划缓存的方法。               |
| [`PlanCache.list()`](https://www.mongodb.com/docs/manual/reference/method/PlanCache.list/#mongodb-method-PlanCache.list) | 返回一个数组 [计划缓存条目](https://www.mongodb.com/docs/manual/core/query-plans/) 为收藏。 |

## 复制方法

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`rs.add()`](https://www.mongodb.com/docs/manual/reference/method/rs.add/#mongodb-method-rs.add) | 将成员添加到副本集。您必须连接到副本集的主节点才能运行此方法。 |
| [`rs.addArb()`](https://www.mongodb.com/docs/manual/reference/method/rs.addArb/#mongodb-method-rs.addArb) | 将仲裁器添加到现有副本集。                                   |
| [`rs.config()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.config) | 返回包含当前副本集配置的文档。                               |
| [`rs.freeze()`](https://www.mongodb.com/docs/manual/reference/method/rs.freeze/#mongodb-method-rs.freeze) | 使连接到的副本集成员`mongosh`在指定的持续时间内没有资格成为主要成员。您必须以秒为单位指定持续时间。 |
| [`db.getReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/db.getReplicationInfo/#mongodb-method-db.getReplicationInfo) | 从 oplog 数据返回副本集的状态。                              |
| [`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate) | 初始化一个新的副本集。                                       |
| [`db.printReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/db.printReplicationInfo/#mongodb-method-db.printReplicationInfo) | `mongosh`返回连接到的副本集成员的操作日志。                  |
| [`rs.printReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/rs.printReplicationInfo/#mongodb-method-rs.printReplicationInfo) | `mongosh`返回连接到的副本集成员的操作日志。                  |
| `db.printSecondaryReplicationInfo`                           | 返回副本集的次要成员的状态。这与方法相同`rs.printSecondaryReplicationInfo()`。此方法的输出类似于 [`db.printSlaveReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/db.printSlaveReplicationInfo/#mongodb-method-db.printSlaveReplicationInfo)方法。这[`db.printSlaveReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/db.printSlaveReplicationInfo/#mongodb-method-db.printSlaveReplicationInfo)方法在`mongosh`. 改用 `db.printSecondaryReplicationInfo()`。以下是 `rs.printSecondaryReplicationInfo()`在具有两个次要成员的副本集上发出的方法的示例输出：`source: rs2.example.net:27017{  syncedTo: 'Tue Oct 13 2020  09:37:28 GMT-0700 (Pacific Daylight Time)',  replLag: '0 secs (0 hrs) behind the primary '}---source: rs3.example.net:27017{  syncedTo: 'Tue Oct 13 2020  09:37:28 GMT-0700 (Pacific Daylight Time)',  replLag: '0 secs (0 hrs) behind the primary '}` |
| `rs.printSecondaryReplicationInfo`                           | 返回副本集的次要成员的状态。这与方法相同`db.printSecondaryReplicationInfo()` 。此方法的输出类似于 [`rs.printSlaveReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/rs.printSlaveReplicationInfo/#mongodb-method-rs.printSlaveReplicationInfo)遗产中的方法 [`mongo`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)壳。这[`rs.printSlaveReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/rs.printSlaveReplicationInfo/#mongodb-method-rs.printSlaveReplicationInfo)方法在`mongosh`. 改用 `rs.printSecondaryReplicationInfo()`。以下是 `rs.printSecondaryReplicationInfo()`在具有两个次要成员的副本集上发出的方法的示例输出：`source: rs2.example.net:27017{  syncedTo: 'Tue Oct 13 2020 09:42:18 GMT-0700 (Pacific Daylight Time)',  replLag: '0 secs (0 hrs) behind the primary '}---source: rs3.example.net:27017{  syncedTo: 'Tue Oct 13 2020 09:42:18 GMT-0700 (Pacific Daylight Time)',  replLag: '0 secs (0 hrs) behind the primary '}` |
| [rs.重新配置（）](https://www.mongodb.com/docs/manual/reference/command/replSetReconfig/) | 修改现有副本集的配置。                                       |
| [`rs.remove()`](https://www.mongodb.com/docs/manual/reference/method/rs.remove/#mongodb-method-rs.remove) | 从副本集中删除主机名指定的成员。                             |
| [`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status) | `mongosh`返回连接到的副本集成员的状态。                      |
| [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown) | 使副本集的主要成为次要。您必须连接到主服务器才能运行此方法。 |
| [`rs.syncFrom()`](https://www.mongodb.com/docs/manual/reference/method/rs.syncFrom/#mongodb-method-rs.syncFrom) | `mongosh`将同步目标重置为由连接到的副本集成员的主机名指定的副本集成员。 |

## 角色管理方法

| 方法                                                         | 描述                                   |
| :----------------------------------------------------------- | :------------------------------------- |
| [`db.createRole()`](https://www.mongodb.com/docs/manual/reference/method/db.createRole/#mongodb-method-db.createRole) | 创建角色并指定其权限。                 |
| [`db.dropRole()`](https://www.mongodb.com/docs/manual/reference/method/db.dropRole/#mongodb-method-db.dropRole) | 删除用户定义的角色。                   |
| [`db.dropAllRoles()`](https://www.mongodb.com/docs/manual/reference/method/db.dropAllRoles/#mongodb-method-db.dropAllRoles) | 删除与数据库关联的所有用户定义角色。   |
| [`db.getRole()`](https://www.mongodb.com/docs/manual/reference/method/db.getRole/#mongodb-method-db.getRole) | 返回指定角色的信息。                   |
| [`db.getRoles()`](https://www.mongodb.com/docs/manual/reference/method/db.getRoles/#mongodb-method-db.getRoles) | 返回数据库中所有用户定义角色的信息。   |
| [`db.grantPrivilegesToRole()`](https://www.mongodb.com/docs/manual/reference/method/db.grantPrivilegesToRole/#mongodb-method-db.grantPrivilegesToRole) | 将权限分配给用户定义的角色。           |
| [`db.revokePrivilegesFromRole()`](https://www.mongodb.com/docs/manual/reference/method/db.revokePrivilegesFromRole/#mongodb-method-db.revokePrivilegesFromRole) | 从用户定义的角色中删除指定的权限。     |
| [`db.grantRolesToRole()`](https://www.mongodb.com/docs/manual/reference/method/db.grantRolesToRole/#mongodb-method-db.grantRolesToRole) | 指定用户定义的角色从中继承特权的角色。 |
| [`db.revokeRolesFromRole()`](https://www.mongodb.com/docs/manual/reference/method/db.revokeRolesFromRole/#mongodb-method-db.revokeRolesFromRole) | 从角色中删除继承的角色。               |
| [`db.updateRole()`](https://www.mongodb.com/docs/manual/reference/method/db.updateRole/#mongodb-method-db.updateRole) | 更新用户定义的角色。                   |

## 会话对象方法

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`Mongo.startSession()`](https://www.mongodb.com/docs/manual/reference/method/Mongo.startSession/#mongodb-method-Mongo.startSession) | 启动连接会话。                                               |
| [会话.advanceOperationTime()](https://www.mongodb.com/docs/manual/reference/method/Session/) | 更新操作时间。                                               |
| [会话结束会话()](https://www.mongodb.com/docs/manual/reference/method/Session/) | 结束会话。                                                   |
| [会话.getClusterTime()](https://www.mongodb.com/docs/manual/reference/method/Session/) | 返回会话看到的最近的集群时间。                               |
| [会话.getDatabase()](https://www.mongodb.com/docs/manual/reference/method/Session/) | 从 shell 中的会话访问指定的数据库。                          |
| [会话.getOperationTime()](https://www.mongodb.com/docs/manual/reference/method/Session/) | 返回会话的最后确认操作的时间戳。                             |
| [会话.getOptions()](https://www.mongodb.com/docs/manual/reference/method/Session/) | 返回会话的选项。                                             |
| [会话.hasEnded()](https://www.mongodb.com/docs/manual/reference/method/Session/) | 返回一个布尔值，指定会话是否已结束。                         |
| [`SessionOptions()`](https://www.mongodb.com/docs/manual/reference/method/SessionOptions/#mongodb-method-SessionOptions) | shell 中会话的选项。访问 [`SessionOptions()`](https://www.mongodb.com/docs/manual/reference/method/SessionOptions/#mongodb-method-SessionOptions)对象，使用[`Session.getOptions()`.](https://www.mongodb.com/docs/manual/reference/method/Session/#mongodb-method-Session.getOptions) |

## 服务器状态方法

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`db.hello()`](https://www.mongodb.com/docs/manual/reference/method/db.hello/#mongodb-method-db.hello) | 返回描述角色的文档 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例。如果[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)是副本集的成员，那么[`isWritablePrimary`](https://www.mongodb.com/docs/manual/reference/command/hello/#mongodb-data-hello.isWritablePrimary)和 [`secondary`](https://www.mongodb.com/docs/manual/reference/command/hello/#mongodb-data-hello.secondary)字段报告实例是否是 [基本的](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)或者如果它是[次要的](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)副本集的成员。 |
| [`db.hostInfo()`](https://www.mongodb.com/docs/manual/reference/method/db.hostInfo/#mongodb-method-db.hostInfo) | 返回一个文档，其中包含有关运行 MongoDB 实例的系统的信息。    |
| [`db.collection.latencyStats()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.latencyStats/#mongodb-method-db.collection.latencyStats) | 返回指定集合的延迟统计信息。                                 |
| [`db.printCollectionStats()`](https://www.mongodb.com/docs/manual/reference/method/db.printCollectionStats/#mongodb-method-db.printCollectionStats) | 返回每个集合的统计信息。                                     |
| [`db.serverBuildInfo()`](https://www.mongodb.com/docs/manual/reference/method/db.serverBuildInfo/#mongodb-method-db.serverBuildInfo) | 返回显示编译参数的文档[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例。 |
| [`db.serverCmdLineOpts()`](https://www.mongodb.com/docs/manual/reference/method/db.serverCmdLineOpts/#mongodb-method-db.serverCmdLineOpts) | 返回一个文档，其中包含有关用于启动 MongoDB 实例的运行时选项的信息。 |
| [`db.serverStatus()`](https://www.mongodb.com/docs/manual/reference/method/db.serverStatus/#mongodb-method-db.serverStatus) | 返回提供数据库进程概述的文档。                               |
| [`db.stats()`](https://www.mongodb.com/docs/manual/reference/method/db.stats/#mongodb-method-db.stats) | 返回报告当前数据库状态的文档。                               |
| [`db.version()`](https://www.mongodb.com/docs/manual/reference/method/db.version/#mongodb-method-db.version) | 返回的版本[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例。 |

## 分片方法

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`sh.addShard()`](https://www.mongodb.com/docs/manual/reference/method/sh.addShard/#mongodb-method-sh.addShard) | 将分片添加到分片集群。                                       |
| [`sh.addShardTag()`](https://www.mongodb.com/docs/manual/reference/method/sh.addShardTag/#mongodb-method-sh.addShardTag) | 化名为[`sh.addShardToZone()`.](https://www.mongodb.com/docs/manual/reference/method/sh.addShardToZone/#mongodb-method-sh.addShardToZone) |
| [`sh.addShardToZone()`](https://www.mongodb.com/docs/manual/reference/method/sh.addShardToZone/#mongodb-method-sh.addShardToZone) | 将分片与区域相关联。支持在分片集群中配置区域。               |
| [`sh.addTagRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.addTagRange/#mongodb-method-sh.addTagRange) | 化名为[`sh.updateZoneKeyRange()`.](https://www.mongodb.com/docs/manual/reference/method/sh.updateZoneKeyRange/#mongodb-method-sh.updateZoneKeyRange) |
| [`sh.balancerCollectionStatus()`](https://www.mongodb.com/docs/manual/reference/method/sh.balancerCollectionStatus/#mongodb-method-sh.balancerCollectionStatus) | 返回有关分片集合的块是否平衡的信息。*4.4版中的新功能*。      |
| [`sh.disableAutoSplit()`](https://www.mongodb.com/docs/manual/reference/method/sh.disableAutoSplit/#mongodb-method-sh.disableAutoSplit) | 禁用分片集群的自动拆分。                                     |
| [`sh.disableBalancing()`](https://www.mongodb.com/docs/manual/reference/method/sh.disableBalancing/#mongodb-method-sh.disableBalancing) | 禁用分片数据库中单个集合的平衡。不影响分片集群中其他集合的平衡。 |
| [`sh.enableAutoSplit()`](https://www.mongodb.com/docs/manual/reference/method/sh.enableAutoSplit/#mongodb-method-sh.enableAutoSplit) | 为分片集群启用自动拆分。                                     |
| [`sh.enableBalancing()`](https://www.mongodb.com/docs/manual/reference/method/sh.enableBalancing/#mongodb-method-sh.enableBalancing) | 如果之前使用禁用，则激活分片集合平衡器进程[`sh.disableBalancing()`.](https://www.mongodb.com/docs/manual/reference/method/sh.disableBalancing/#mongodb-method-sh.disableBalancing) |
| [`sh.enableSharding()`](https://www.mongodb.com/docs/manual/reference/method/sh.enableSharding/#mongodb-method-sh.enableSharding) | 在特定数据库上启用分片。                                     |
| [`sh.getBalancerState()`](https://www.mongodb.com/docs/manual/reference/method/sh.getBalancerState/#mongodb-method-sh.getBalancerState) | 返回一个布尔值以报告是否[平衡器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-balancer)当前已启用。 |
| [`sh.isBalancerRunning()`](https://www.mongodb.com/docs/manual/reference/method/sh.isBalancerRunning/#mongodb-method-sh.isBalancerRunning) | 返回一个布尔值以报告是否[平衡器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-balancer)进程当前正在迁移块。 |
| [`sh.moveChunk()`](https://www.mongodb.com/docs/manual/reference/method/sh.moveChunk/#mongodb-method-sh.moveChunk) | 迁移一个[块](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)在一个[分片集群。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster) |
| [`sh.removeRangeFromZone()`](https://www.mongodb.com/docs/manual/reference/method/sh.removeRangeFromZone/#mongodb-method-sh.removeRangeFromZone) | 删除一系列分片键值和一个之间的关联 [区。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-zone) |
| [`sh.removeShardFromZone()`](https://www.mongodb.com/docs/manual/reference/method/sh.removeShardFromZone/#mongodb-method-sh.removeShardFromZone) | 删除分片和一个之间的关联[区。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-zone) |
| [`sh.removeShardTag()`](https://www.mongodb.com/docs/manual/reference/method/sh.removeShardTag/#mongodb-method-sh.removeShardTag) | 删除标签和分片之间的关联。                                   |
| [`sh.removeTagRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.removeTagRange/#mongodb-method-sh.removeTagRange) | 将一系列分片键值删除到使用创建的分片标签[`sh.addShardTag()`](https://www.mongodb.com/docs/manual/reference/method/sh.addShardTag/#mongodb-method-sh.addShardTag)方法。此方法别名为 [`sh.removeRangeFromZone()`](https://www.mongodb.com/docs/manual/reference/method/sh.removeRangeFromZone/#mongodb-method-sh.removeRangeFromZone)在 MongoDB 3.4 中。 |
| [`sh.setBalancerState()`](https://www.mongodb.com/docs/manual/reference/method/sh.setBalancerState/#mongodb-method-sh.setBalancerState) | 启用或禁用[平衡器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-balancer)迁移 [块](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)之间[碎片。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard) |
| [`sh.shardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection) | 为集合启用分片。                                             |
| [`sh.splitAt()`](https://www.mongodb.com/docs/manual/reference/method/sh.splitAt/#mongodb-method-sh.splitAt) | 划分一个现有的[块](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)使用的特定值分为两个块[片键](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)作为分界点。 |
| [`sh.splitFind()`](https://www.mongodb.com/docs/manual/reference/method/sh.splitFind/#mongodb-method-sh.splitFind) | 划分一个现有的[块](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)它包含一个将查询匹配成两个大致相等的块的文档。 |
| [`sh.startBalancer()`](https://www.mongodb.com/docs/manual/reference/method/sh.startBalancer/#mongodb-method-sh.startBalancer) | 启用[平衡器。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-balancer) |
| [`sh.status()`](https://www.mongodb.com/docs/manual/reference/method/sh.status/#mongodb-method-sh.status) | 报告分片集群的状态。                                         |
| [`sh.stopBalancer()`](https://www.mongodb.com/docs/manual/reference/method/sh.stopBalancer/#mongodb-method-sh.stopBalancer) | 禁用[平衡器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-balancer). 此操作不会等待平衡器完成任何正在进行的操作，并且可能会终止正在进行的操作。 |
| [`sh.updateZoneKeyRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.updateZoneKeyRange/#mongodb-method-sh.updateZoneKeyRange) | 将一系列分片键与区域相关联。支持在分片集群中配置区域。       |

## 遥测方法

这些方法配置是否`mongosh`跟踪匿名遥测数据。默认情况下启用遥测。

有关`mongosh`使用遥测跟踪哪些数据的更多信息，请参阅[配置遥测选项。](https://www.mongodb.com/docs/mongodb-shell/telemetry/#std-label-telemetry)

| 方法                                                         | 描述                   |
| :----------------------------------------------------------- | :--------------------- |
| [`disableTelemetry()`](https://www.mongodb.com/docs/mongodb-shell/telemetry/#mongodb-method-disableTelemetry) | 为 禁用遥测`mongosh`。 |
| [`enableTelemetry()`](https://www.mongodb.com/docs/mongodb-shell/telemetry/#mongodb-method-enableTelemetry) | 为 启用遥测`mongosh`。 |

## 交易方式

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`Session.abortTransaction()`](https://www.mongodb.com/docs/manual/reference/method/Session.abortTransaction/#mongodb-method-Session.abortTransaction) | 终止一个[多文件交易](https://www.mongodb.com/docs/manual/core/transactions/) 并回滚事务中操作所做的任何数据更改。 |
| [`Session.commitTransaction()`](https://www.mongodb.com/docs/manual/reference/method/Session.commitTransaction/#mongodb-method-Session.commitTransaction) | 将操作所做的更改保存在[多文件交易](https://www.mongodb.com/docs/manual/core/transactions/)并结束交易。 |
| [`Session.startTransaction()`](https://www.mongodb.com/docs/manual/reference/method/Session.startTransaction/#mongodb-method-Session.startTransaction) | 启动一个[多文件交易](https://www.mongodb.com/docs/manual/core/transactions/) 与会话相关联。 |

## 用户管理方法

> 重要的:
>
> 这[`passwordPrompt()`](https://www.mongodb.com/docs/manual/reference/method/passwordPrompt/#mongodb-method-passwordPrompt)中目前不支持该方法`mongosh`。因此，在使用以下方法时，您必须将密码指定为参数：
>
> - [`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth)
> - [`db.changeUserPassword()`](https://www.mongodb.com/docs/manual/reference/method/db.changeUserPassword/#mongodb-method-db.changeUserPassword)
> - [`db.createUser()`](https://www.mongodb.com/docs/manual/reference/method/db.createUser/#mongodb-method-db.createUser)
> - [`db.updateUser()`](https://www.mongodb.com/docs/manual/reference/method/db.updateUser/#mongodb-method-db.updateUser)

| 方法                                                         | 描述                                   |
| :----------------------------------------------------------- | :------------------------------------- |
| [`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth) | 对数据库的用户进行身份验证。           |
| [`db.changeUserPassword()`](https://www.mongodb.com/docs/manual/reference/method/db.changeUserPassword/#mongodb-method-db.changeUserPassword) | 更改现有用户的密码。                   |
| [`db.createUser()`](https://www.mongodb.com/docs/manual/reference/method/db.createUser/#mongodb-method-db.createUser) | 创建新用户。                           |
| [`db.dropAllUsers()`](https://www.mongodb.com/docs/manual/reference/method/db.dropAllUsers/#mongodb-method-db.dropAllUsers) | 删除与数据库关联的所有用户。           |
| [`db.dropUser()`](https://www.mongodb.com/docs/manual/reference/method/db.dropUser/#mongodb-method-db.dropUser) | 删除单个用户。                         |
| [`db.getUser()`](https://www.mongodb.com/docs/manual/reference/method/db.getUser/#mongodb-method-db.getUser) | 返回有关指定用户的信息。               |
| [`db.getUsers()`](https://www.mongodb.com/docs/manual/reference/method/db.getUsers/#mongodb-method-db.getUsers) | 返回有关与数据库关联的所有用户的信息。 |
| [`db.updateUser()`](https://www.mongodb.com/docs/manual/reference/method/db.updateUser/#mongodb-method-db.updateUser) | 更新指定用户的数据。                   |
| [`db.grantRolesToUser()`](https://www.mongodb.com/docs/manual/reference/method/db.grantRolesToUser/#mongodb-method-db.grantRolesToUser) | 向用户授予角色及其权限。               |
| [`db.revokeRolesFromUser()`](https://www.mongodb.com/docs/manual/reference/method/db.revokeRolesFromUser/#mongodb-method-db.revokeRolesFromUser) | 删除用户的角色。                       |







翻译：韩鹏帅

原文：[Methods](https://www.mongodb.com/docs/mongodb-shell/reference/methods/)