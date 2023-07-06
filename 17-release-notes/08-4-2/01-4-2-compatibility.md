





# MongoDB 4.2中的兼容性变化

## 拆卸MMAPv1存储引擎

MongoDB 4.2取消了对已弃用的MMAPv1存储引擎的支持。

如果您的4.0部署使用MMAPv1，则在升级到MongoDB 4.2之前，您必须将部署更改为[WiredTiger存储引擎](https://www.mongodb.com/docs/upcoming/core/wiredtiger/)。有关详细信息，请参阅：

- [将“独立产品”更改为“WiredTiger”](https://www.mongodb.com/docs/upcoming/tutorial/change-standalone-wiredtiger/)
- [将副本集更改为WiredTiger](https://www.mongodb.com/docs/upcoming/tutorial/change-replica-set-wiredtiger/)
- [将分片集群更改为WiredTiger](https://www.mongodb.com/docs/upcoming/tutorial/change-sharded-cluster-wiredtiger/)

### MMAPv1特定配置选项

MongoDB删除了以下MMAPv1特定配置选项：

| 移除了配置文件设置                        | 删除了命令行选项             |
| :---------------------------------------- | :--------------------------- |
| `storage.mmapv1.journal.commitIntervalMs` |                              |
| `storage.mmapv1.journal.debugFlags`       | `mongod --journalOptions`    |
| `storage.mmapv1.nsSize`                   | `mongod --nssize`            |
| `storage.mmapv1.preallocDataFiles`        | `mongod --noprealloc`        |
| `storage.mmapv1.quota.enforced`           | `mongod --quota`             |
| `storage.mmapv1.quota.maxFilesPerDB`      | `mongod --quotaFiles`        |
| `storage.mmapv1.smallFiles`               | `mongod --smallfiles`        |
| `storage.repairPath`                      | `mongod --repairpath`        |
| `replication.secondaryIndexPrefetch`      | `mongod --replIndexPrefetch` |

> 笔记：
>
> 从4.2版本开始，MongoDB进程将不会从这些选项开始。如果使用WiredTiger部署，请删除任何特定于MMAPv1的配置选项。

### MMAPv1特定参数

MongoDB删除了以下MMAPv1参数：

- `newCollectionsUsePowerOf2Sizes`
- `replIndexPrefetch`

### MMAPv1特定命令

MongoDB删除了MMAPv1特定的`touch`命令。

### MMAPv1命令和方法的特定选项

MongoDB删除了MMAPv1特定选项：

- `noPadding` and `usePowerOf2Sizes` for [`collMod`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)
- `verbose` for [`collStats`](https://www.mongodb.com/docs/upcoming/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats)
- `flags` for [`create`](https://www.mongodb.com/docs/upcoming/reference/command/create/#mongodb-dbcommand-dbcmd.create)
- `paddingFactor`, `paddingBytes`, `preservePadding` for [`db.createCollection()`.](https://www.mongodb.com/docs/upcoming/reference/method/db.createCollection/#mongodb-method-db.createCollection)

MongoDB忽略了[`fsync`](https://www.mongodb.com/docs/upcoming/reference/command/fsync/#mongodb-dbcommand-dbcmd.fsync)的MMAPv1特定选项`async`[。](https://www.mongodb.com/docs/upcoming/reference/command/fsync/#mongodb-dbcommand-dbcmd.fsync)

## 已移除或已弃用的命令和方法

### 移除对`group`命令的支持

从4.2版开始，MongoDB删除了 `group` 命令（从3.4版开始就不推荐使用）及其mongo shell助手`db.collection.group()`。

将[`db.collection.aggregate()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.aggregate/#mongodb-method-db.collection.aggregate)与[`$group`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group)阶段一起使用。

### 删除对`eval`命令的支持

从4.2版本开始，MongoDB删除了`eval`命令。自3.0版本以来，`eval`命令已被弃用。

关联的MongoDB 4.2 `mongo shell`方法`db.eval（）`和`db.collection.copyTo（）`只能在连接到MongoDB 4.0或更早版本时运行。

### 删除对`copydb`和`clone`命令的支持

从4.2版本开始，MongoDB删除了已弃用的`copydb`命令和`clone`命令。

对应的mongo shell助手`db.copyDatabase（）`和`db.cloneDatabase（）`只能在连接到MongoDB 4. 0或更早版本时运行。

作为替代方案，用户可以使用[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)和[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)（带有themorestore选项[`--nsFrom`](https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--nsFrom)和[`--nsTo`](https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--nsTo)）或使用驱动程序编写脚本。

例如，要将`test`数据库从在默认端口27017上运行的本地实例复制到同一实例上的`examples`数据库，您可以：

1. 使用[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)转储`test`数据库到archivemongodump`mongodump-test-db`：

   ```
   mongodump --archive="mongodump-test-db" --db=test
   ```

2. 使用[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)与[`--nsFrom`](https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--nsFrom)和[`--nsTo`](https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--nsTo)从存档中恢复（通过数据库名称更改）：

   ```
   mongorestore --archive="mongodump-test-db" --nsFrom='test.*' --nsTo='examples.*'
   ```

   > 提示：
   >
   > 必要时包括其他选项，例如指定uri或主机、用户名、密码和身份验证数据库。

   或者，您可以[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)`test`数据库到标准输出流和管道进入[`mongorestore`：](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)

   ```
   mongodump --archive --db=test | mongorestore --archive  --nsFrom='test.*' --nsTo='examples.*'
   ```

### 删除对`parallelCollectionScan`命令的支持

从4.2版本开始，MongoDB删除了`parallelCollectionScan`。

### 移除`maxScan`

MongoDB删除了find命令的过时选项maxScan和mongo shell助手 `cursor.maxTimeMS()`。请使用find命令的maxTimeMS选项，或使用帮助器 [`cursor.maxTimeMS()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.maxTimeMS/#mongodb-method-cursor.maxTimeMS)。

### 删除对`geoNear`命令的支持

从4.2版本开始，MongoDB删除了`geoNear`命令。改用[`$geoNear`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)聚合阶段。

[`$geoNear`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)的选项类似于已删除的`geoNear`命令，但有以下例外：

* 删除的`geoNear`命令在其输出中包含一个名为`dis`的字段，其中包含距离信息。

  对于[`$geoNear`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)阶段，指定距离字段名称 indistanceField。

* 已删除的`geoNear`命令接受`includeLocs`选项的`boolean`值，以包含`loc`字段。

  对于[`$geoNear`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)阶段，指定`includeLocs`中的位置字段名称。

* 删除的`geoNear`命令包括返回结果的`avgDistance`和`maxDistance`。

  您也可以使用聚合管道返回avgDistance和maxDistance。具体而言，在[`$geoNear`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)阶段之后，包括一个[`$group`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group)阶段以计算`avgDistance`和`maxDistance`：

  ```
  db.places.aggregate([
     { $geoNear: { near: <...>, distanceField: "dis", includeLocs: "loc", spherical: true, ... } },
     { $group: { _id: null, objectsLoaded: { $sum: 1 }, maxDistance:
           { $max: "$dis" }, avgDistance: { $avg: "$dis" } } }
  ])
  ```

  > 另见：
  >
  > [从`$geoNear`](https://www.mongodb.com/docs/upcoming/release-notes/4.2-compatibility/#std-label-4.2-compat-geoNear)

### 删除对`repairDatabase`命令的支持

从4.2版本开始，MongoDB删除了`repairDatabase`命令及其mongo shell助手`db.repairDatabase()`以及`repairDatabase`特权。

作为替代方案：

* 要压缩[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)的数据，请使用[`compact`](https://www.mongodb.com/docs/upcoming/reference/command/compact/#mongodb-dbcommand-dbcmd.compact)命令。有关操作的详细信息，请参阅[`compact`](https://www.mongodb.com/docs/upcoming/reference/command/compact/#mongodb-dbcommand-dbcmd.compact)命令。
* 要在独立构建索引，请使用[`reIndex`](https://www.mongodb.com/docs/upcoming/reference/command/reIndex/#mongodb-dbcommand-dbcmd.reIndex)命令或其助手[`db.collection.reIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.reIndex/#mongodb-method-db.collection.reIndex)。有关操作的详细信息，seereIndex命令和[`db.collection.reIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.reIndex/#mongodb-method-db.collection.reIndex)参考页面。
* 要为独立服务器恢复数据，请使用[`mongod --repair`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--repair)。有关详细信息[，](https://www.mongodb.com/docs/upcoming/tutorial/recover-data-following-unexpected-shutdown/)请参阅[意外关机后恢复独立状态](https://www.mongodb.com/docs/upcoming/tutorial/recover-data-following-unexpected-shutdown/)。

### 删除对`getPrevError`命令的支持

从4.2版本开始，MongoDB删除了过时的`getPrevError`命令及其mongo shell助手`db.getPrevError()`。

### 弃用对`cloneCollection`的支持

MongoDB不赞成`cloneCollection`命令及其mongo shell助手`db.cloneCollection()`

作为替代方案，

* 用户可以使用[`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)和[`mongoimport`。](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)
* 用户可以使用聚合管道[`$out`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)或[`$merge`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)阶段。
* 使用驱动程序编写脚本。

### 不建议使用的计划缓存命令/方法

MongoDB不建议使用以下内容：

* `PlanCache.getPlansByQuery()`方法/`planCacheListPlans`命令。

  要获取形状的缓存查询计划，请使用[`$planCacheStats`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/planCacheStats/#mongodb-pipeline-pipe.-planCacheStats)聚合阶段。[有关查询形状，](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/planCacheStats/#std-label-planCacheStats-cache-entry-for-query-shape)请参阅[查找缓存条目详细信息](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/planCacheStats/#std-label-planCacheStats-cache-entry-for-query-shape)。

* `PlanCache.listQueryShapes()`方法/`planCacheListQueryShapes`命令。

  要列出缓存的查询形状，请使用[`$planCacheStats`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/planCacheStats/#mongodb-pipeline-pipe.-planCacheStats)聚合阶段。请参阅[列表查询形状](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/planCacheStats/#std-label-planCacheStats-list-query-shapes)。

## 集合

### `$out`阶段限制

#### `$out`和观点

[视图](https://www.mongodb.com/docs/upcoming/core/views/#std-label-views-landing-page)定义`pipeline`不能包括[`$out`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)阶段。如果您已经有一个包含[`$out`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)阶段的现有视图，则无法再从此现有视图创建新视图。

对于包含[`$out`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)阶段的现有视图，您应该在没有[`$out`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)阶段的情况下[`drop`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.drop/#mongodb-method-db.collection.drop)并[`recreate`](https://www.mongodb.com/docs/upcoming/reference/method/db.createView/#mongodb-method-db.createView)视图，或者使用不包含[`$out`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)阶段的新管道[`replace the view definition`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)。

#### `$out`和`$lookup`

[`$lookup`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup)阶段不能将[`$out`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)阶段包含在[已加入集合](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/lookup/#std-label-lookup-syntax-let-pipeline)的嵌套管[道字段中](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/lookup/#std-label-lookup-syntax-let-pipeline)。

#### `$out`和`linearizable`读取关注级别

[`$out`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)阶段不能与读取关注[`"linearizable"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-linearizable/#mongodb-readconcern-readconcern.-linearizable-)一起使用。

#### `$out`和解释

如果聚合管道包含$out阶段，则不能在executionStats模式或allPlansExecution模式下运行 [`db.collection.explain()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.explain/#mongodb-method-db.collection.explain)方法（或 [`explain`](https://www.mongodb.com/docs/upcoming/reference/command/explain/#mongodb-dbcommand-dbcmd.explain)命令）。

如果聚合管道包含[`$out`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)阶段，要查看`executionStats`或`allPlansExecution`信息，请在没有[`$out`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)阶段的情况下运行exple解释，以便返回前几个阶段的解释结果。

或者，您可以在`queryPlanner`模式下为包含[`$out`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)阶段的聚合管道运行解释。

#### `$out`和`majority`阅读关注级别

从MongoDB 4.2开始，您可以为包含[`$out`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)阶段的聚合指定[读取关注](https://www.mongodb.com/docs/upcoming/reference/read-concern/)级别[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)”。

#### 从`$geoNear`中移除`limit`和`num`选项

从4.2版本开始，MongoDB删除了[`$geoNear`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)阶段的`limit`和`num`选项以及100个文档的默认限制。要限制[`$geoNear`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)的结果，请使用[`$geoNear`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)阶段和[`$limit`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/limit/#mongodb-pipeline-pipe.-limit)阶段。

例如，以下[`$geoNear`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)阶段包含`num`选项的聚合在4.2中不再有效。

```
db.places.aggregate([
   {
     $geoNear: {
        near: { type: "Point", coordinates: [ -73.99279 , 40.719296 ] },
        distanceField: "distance",
        num: 5,                 // Not supported in 4.2
        spherical: true
     }
   }
])
```

相反，您可以将聚合重写为以下管道：

```
db.places.aggregate([
   {
     $geoNear: {
        near: { type: "Point", coordinates: [ -73.99279 , 40.719296 ] },
        distanceField: "distance",
        spherical: true
     }
   },
   { $limit: 5 }
])
```

> 另见：
>
> [聚合改进](https://www.mongodb.com/docs/upcoming/release-notes/4.2/#std-label-4.2-agg)

## Transactions

* 从MongoDB 4.2开始，您无法将[`killCursors`](https://www.mongodb.com/docs/upcoming/reference/command/killCursors/#mongodb-dbcommand-dbcmd.killCursors)指定为[事务](https://www.mongodb.com/docs/upcoming/core/transactions/#std-label-transactions)中的第一个操作[。](https://www.mongodb.com/docs/upcoming/core/transactions/#std-label-transactions)
* 从MongoDB 4.2开始，不能在事务中写入capped集合。事务中仍支持从封顶集合中读取。
* 从MongoDB 4.2开始，MongoDB取消了事务的16MB总大小限制。在4.2版本中，MongoDB创建尽可能多的oplog条目，以封装事务中的所有写入操作。在之前的版本中，MongoDB为事务中的所有写入操作创建一个条目，从而对事务施加了16MB的总大小限制。

## 更改流

### 可用性

从MongoDB 4.2开始，无论[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取关注支持如何，[更改流](https://www.mongodb.com/docs/upcoming/changeStreams/)都是可用的；也就是说，读取关注`majority`支持可以启用（默认）或[禁用以](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#std-label-disable-read-concern-majority)使用更改流。

在MongoDB 4.0及更低版本中，只有当启用[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取关注支持（默认）时，[更改流](https://www.mongodb.com/docs/upcoming/changeStreams/)才可用。

> 另见：
>
> [4.2 更改流的更改](https://www.mongodb.com/docs/upcoming/release-notes/4.2/#std-label-4.2-change-stream)

### 默认排序

从MongoDB 4.2开始，更改流使用`simple`二进制比较，除非提供显式排序。在早期版本中，在单个集合上打开的更改流（[`db.collection.watch()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.watch/#mongodb-method-db.collection.watch)）将继承该集合的默认排序。

### 恢复令牌修改

从MongoDB 4.2开始，如果[更改流聚合管道](https://www.mongodb.com/docs/upcoming/changeStreams/#std-label-change-stream-modify-output)修改事件的[_id](https://www.mongodb.com/docs/upcoming/reference/change-events/#std-label-change-stream-event-id)字段，更改流将抛出异常。

## MongoDB Tools

### FIP模式

从4.2版本开始，MongoDB删除了以下程序的`--sslFIPSMode`选项：

- [`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)
- [`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)
- [`mongofiles`](https://www.mongodb.com/docs/database-tools/mongofiles/#mongodb-binary-bin.mongofiles)
- [`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)
- [`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)
- [`mongostat`](https://www.mongodb.com/docs/database-tools/mongostat/#mongodb-binary-bin.mongostat)
- [`mongotop`](https://www.mongodb.com/docs/database-tools/mongotop/#mongodb-binary-bin.mongotop)

如果 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod) / [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例被[配置为使用FIPS模式]( https://www.mongodb.com/docs/upcoming/tutorial/configure-fips/)，则程序将使用符合FIPS的连接连接到mongod / mongos。

### 扩展JSON v2

从4.2版本开始：

| 二进制                                                       | 变化                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`bsondump`](https://www.mongodb.com/docs/database-tools/bsondump/#mongodb-binary-bin.bsondump) | 使用扩展JSON v2.0（规范模式）格式。                          |
| [`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump) | 对元数据使用扩展JSON v2.0（规范模式）格式。需要[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)支持扩展JSON v2.0（规范模式或放松模式）格式的4.2或更高版本。提示一般来说，使用相应的版本[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)和[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)。也就是说，恢复使用特定版本创建的数据文件[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)，使用相应的版本[`mongorestore`。](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore) |
| [`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport) | 默认情况下，在Extended JSON v2.0（放松模式）中创建输出数据。如果与`--jsonFormat`一起使用，则在扩展JSON v2.0（规范模式）中创建输出数据。 |
| [`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport) | 默认情况下，预计导入数据处于扩展JSON v2.0（放松模式或规范模式）。如果指定了选项`--legacy`，可以识别扩展JSON v1.0格式的数据。提示一般来说，版本[`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)和[`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)应该匹配。也就是说，导入从[`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)，您应该使用相应的版本[`mongoimport`。](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport) |

有关MongoDB扩展JSON v2的详细信息，请参阅[MongoDB扩展JSON（v2）。](https://www.mongodb.com/docs/upcoming/reference/mongodb-extended-json/)

#### `--query`选项

从4.2版本开始，`mongodump --query`和`mongoexport --query`的查询选项必须采用[扩展JSON v2格式（放松或规范/严格模式），](https://www.mongodb.com/docs/upcoming/reference/mongodb-extended-json/)包括将字段名称和运算符包含在引号中，如下所示

```
mongoexport -d=test -c=records -q='{ "a": { "$gte": 3 }, "date": { "$lt": { "$date": "2016-01-01T00:00:00.000Z" } } }' --out=exportdir/myRecords.json
```

在早期版本中，查询选项使用[扩展JSON v1格式](https://www.mongodb.com/docs/upcoming/reference/mongodb-extended-json-v1/)，字段名称和运算符不需要在引号中：

```
mongoexport -d=test -c=records -q='{ a: { $gte: 3 }, date: { $lt: { "$date": "2016-01-01T00:00:00.000Z" } } }' --out=exportdir/myRecords.json
```

## 副本集状态更改

### 主节点降级

从MongoDB 4.2开始，[`replSetStepDown`](https://www.mongodb.com/docs/upcoming/reference/command/replSetStepDown/#mongodb-dbcommand-dbcmd.replSetStepDown)（以及导致降级的[`replSetReconfig`](https://www.mongodb.com/docs/upcoming/reference/command/replSetReconfig/#mongodb-dbcommand-dbcmd.replSetReconfig)）不再关闭所有客户端连接。然而，正在进行的写作被杀死了。

在MongoDB 4.0及更低版本中，[`replSetStepDown`](https://www.mongodb.com/docs/upcoming/reference/command/replSetStepDown/#mongodb-dbcommand-dbcmd.replSetStepDown)下调期间关闭所有客户端连接

### `ROLLBACK`状态

从4.2版本开始，当成员进入[`ROLLBACK`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)状态时，MongoDB会杀死所有正在进行的用户操作。

## 4.2 驱动程序默认启用可重试写入

与MongoDB 4.2及更高版本兼容的驱动程序默认启用[可重试写入](https://www.mongodb.com/docs/upcoming/core/retryable-writes/#std-label-retryable-writes)。较早的驱动程序需要[`retryWrites=true`](https://www.mongodb.com/docs/upcoming/reference/connection-string/#mongodb-urioption-urioption.retryWrites)选项。在使用与MongoDB 4.2及更高版本兼容的驱动程序的应用程序中，可以省略TheretryWrites[`retryWrites=true`](https://www.mongodb.com/docs/upcoming/reference/connection-string/#mongodb-urioption-urioption.retryWrites)选项。

要禁用可重试写入，使用与MongoDB 4.2及更高版本兼容的驱动程序的应用程序必须在连接环中包含[`retryWrites=false`](https://www.mongodb.com/docs/upcoming/reference/connection-string/#mongodb-urioption-urioption.retryWrites)。

> 重要：
>
> `local`数据库不支持可重试写入。写入`local`数据库的应用程序在升级到4.2系列驱动程序时将遇到写入错误，*除非*可重试写入被显式禁用。

## 一般变化

### 索引

#### 更严格的限制`reIndex`

MongoDB通过禁止在mongos上运行 [`reInde`](https://www.mongodb.com/docs/upcoming/reference/command/reIndex/#mongodb-dbcommand-dbcmd.reIndex)和[`db.collection.reIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.reIndex/#mongodb-method-db.collection.reIndex)，对针对分片集群中的集合运行reIndex命令和[`db.collection.reIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.reIndex/#mongodb-method-db.collection.reIndex)shell helper实施了更严格的限制。

#### 对`db.collection.dropIndex()`方法的限制

您无法指定[`db.collection.dropIndex("*")`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex)来删除所有非`_id`索引。改用[`db.collection.dropIndexes()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.dropIndexes/#mongodb-method-db.collection.dropIndexes)。

#### 重复索引创建尝试错误消息

如果您使用一个名称创建索引，然后尝试使用另一个名称再次创建索引，MongoDB会更改返回的响应。

从4.2版本开始， [`createIndexes`](https://www.mongodb.com/docs/upcoming/reference/command/createIndexes/#mongodb-dbcommand-dbcmd.createIndexes)命令和mongo shell助手 [`db.collection.createIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)和[`db.collection.createIndexes()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.createIndexes/#mongodb-method-db.collection.createIndexes)会报告一个错误，如果你用一个名字创建了一个索引，然后尝试用另一个名字再次创建相同的索引。

```
{
   "ok" : 0,
   "errmsg" : "Index with name: x_1 already exists with a different name",
   "code" : 85,
   "codeName" : "IndexOptionsConflict"
}
```

在之前的版本中，MongoDB没有再次创建索引，但会返回一个`ok`值为`1`的响应对象和一个暗示索引没有重新创建的注释。例如：

```
{
   "numIndexesBefore" : 2,
   "numIndexesAfter" : 2,
   "note" : "all indexes already exist",
   "ok" : 1
}
```

#### PowerPC上的哈希索引

对于[散列索引](https://www.mongodb.com/docs/upcoming/core/index-hashed/)，MongoDB 4.2确保PowerPC上浮点值2 63的散列值与其他平台一致。在之前的版本中，PowerPC上浮点值2 63的散列值与其他平台不一致。

虽然可能包含大于2 53的浮点值的字段上的[散列索引](https://www.mongodb.com/docs/upcoming/core/index-hashed/)是不受支持的配置，但客户端仍然可以插入索引字段值为2 63的文档。

要列出部署的所有散列索引，请参阅[PowerPC和2 63。](https://www.mongodb.com/docs/upcoming/core/index-hashed/#std-label-hashed-index-power-pc-check)

如果PowerPC上的当前MongoDB 4.0分片集群包含2 63的散列值作为分片密钥的一部分，则在将分片集群升级到4.2之前必须考虑其他考虑因素。请参阅[将分片集群升级到4.2。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-upgrade-sharded-cluster/)

### min()/max()

从MongoDB 4.2开始，在为adb[`db.collection.find()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.find/#mongodb-method-db.collection.find)操作指定[`min()`/](https://www.mongodb.com/docs/upcoming/reference/method/cursor.min/#mongodb-method-cursor.min)[`max()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.max/#mongodb-method-cursor.max)时，您必须使用[`cursor.hint()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.hint/#mongodb-method-cursor.hint)方法显式指定索引formin[`min()`/](https://www.mongodb.com/docs/upcoming/reference/method/cursor.min/#mongodb-method-cursor.min)[`max()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.max/#mongodb-method-cursor.max)除非[`find()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.find/#mongodb-method-db.collection.find)查询是`_id`字段`{ _id: <value> }`上的等式条件。

同样，在[`find`](https://www.mongodb.com/docs/upcoming/reference/command/find/#mongodb-dbcommand-dbcmd.find)命令中指定`min`/`max`时，您还必须显式指定`min`/`max`索引的`hint`。

在之前的版本中，无论查询条件如何，您都可以运行[`min()`/](https://www.mongodb.com/docs/upcoming/reference/method/cursor.min/#mongodb-method-cursor.min)[`max()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.max/#mongodb-method-cursor.max)或命令中相应的`min`/`max`字段），无论查询条件如何，都可以明确提示索引。如果在4.0及更早版本中没有提示运行，MongoDB将使用`indexBounds`中的字段选择索引；但是，如果具有不同排序顺序的相同字段上存在多个索引，则索引的选择可能模棱两可。

### CurrentOp

* 在报告`"getmore"`操作时，[`$currentOp`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/currentOp/#mongodb-pipeline-pipe.-currentOp)聚合阶段以及[`currentOp`](https://www.mongodb.com/docs/upcoming/reference/command/currentOp/#mongodb-dbcommand-dbcmd.currentOp)命令和[`db.currentOp()`](https://www.mongodb.com/docs/upcoming/reference/method/db.currentOp/#mongodb-method-db.currentOp)helper现在将`originatingCommand`字段作为新`cursor`字段中的嵌套字段返回。在之前的版本中，`originatingCommand`是相关`"getmore"`文档的顶级字段。另见[4.2 currentOp更改。](https://www.mongodb.com/docs/upcoming/release-notes/4.2/#std-label-4.2-currentOp)

### 服务器状态

* [`serverStatus`](https://www.mongodb.com/docs/upcoming/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)和[`db.serverStatus()`](https://www.mongodb.com/docs/upcoming/reference/method/db.serverStatus/#mongodb-method-db.serverStatus)方法以64位整数（即NumberLong）而不是32位整数（即NumberInt）的形式返回操作计数器和操作计数器Repl指标。

### 记录

* 登录[`syslog`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--syslog)时，消息文本的格式包括[组件](https://www.mongodb.com/docs/upcoming/reference/log-messages/#std-label-log-message-components)。例如：

  ```
  ...  ACCESS   [repl writer worker 5] Unsupported modification to roles collection ...
  ```

  以前，[`syslog`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--syslog)消息文本不包括该组件。例如：

  ```
  ... [repl writer worker 1] Unsupported modification to roles collection ...
  ```

* 从MongoDB 4.2开始，[`getLog`](https://www.mongodb.com/docs/upcoming/reference/command/getLog/#mongodb-dbcommand-dbcmd.getLog)命令截断任何包含超过1024个字符的事件。在早期版本中，[`getLog`](https://www.mongodb.com/docs/upcoming/reference/command/getLog/#mongodb-dbcommand-dbcmd.getLog)512个字符后截断。

* 从4.2版本开始，MongoDB记录[调试冗高水平](https://www.mongodb.com/docs/upcoming/reference/log-messages/#std-label-log-messages-configure-verbosity)。例如，如果冗高水平为2，MongoDB记录`D2`。

  在之前的版本中，MongoDB日志消息仅为调试级别指定`D`。

### Wire Protocol

* MongoDB不再支持已弃用的内部`OP_COMMAND`和相应的`OP_COMMANDREPLY`有线协议。

### `killCursors`变化

#### Transactions

从MongoDB 4.2开始，您无法将[`killCursors`](https://www.mongodb.com/docs/upcoming/reference/command/killCursors/#mongodb-dbcommand-dbcmd.killCursors)指定为[事务](https://www.mongodb.com/docs/upcoming/core/transactions/#std-label-transactions)中的第一个操作[。](https://www.mongodb.com/docs/upcoming/core/transactions/#std-label-transactions)

#### 特权

从MongoDB 4.2开始，用户总是可以杀死自己的光标，无论用户是否有[`killCursors`](https://www.mongodb.com/docs/upcoming/reference/privilege-actions/#mongodb-authaction-killCursors)的特权。因此，[`killCursors`](https://www.mongodb.com/docs/upcoming/reference/privilege-actions/#mongodb-authaction-killCursors)特权在MongoDB 4.2+中没有影响。

在MongoDB 3.6.3到MongoDB 4.0.x中，用户需要[`killCursors`](https://www.mongodb.com/docs/upcoming/reference/privilege-actions/#mongodb-authaction-killCursors)特权，以便在启用访问控制时杀死自己的光标。

### 移除`AsyncRequestsSenderUseBaton`参

在MongoDB 4.2+部署中，MongoDB删除了`AsyncRequestsSenderUseBaton`参数，并始终启用由该参数控制的性能增强。

### 更严格的`count`验证语法

从4.2版本开始，MongoDB对[`count`](https://www.mongodb.com/docs/upcoming/reference/command/count/#mongodb-dbcommand-dbcmd.count)命令的选项名称进行了更严格的验证。现在，如果您指定未知的选项名称，该命令会出错。

在之前的版本中，MongoDB忽略了无效的选项名称。

### 因果一致性会议

从MongoDB 4.2开始，[ClusterTime之后](https://www.mongodb.com/docs/upcoming/reference/read-concern/#std-label-afterClusterTime)不再支持以下命令[：](https://www.mongodb.com/docs/upcoming/reference/read-concern/#std-label-afterClusterTime)

- [`dbHash`](https://www.mongodb.com/docs/upcoming/reference/command/dbHash/#mongodb-dbcommand-dbcmd.dbHash)命令
- [`mapReduce`](https://www.mongodb.com/docs/upcoming/reference/command/mapReduce/#mongodb-dbcommand-dbcmd.mapReduce)命令
- [`validate`](https://www.mongodb.com/docs/upcoming/reference/command/validate/#mongodb-dbcommand-dbcmd.validate)命令

因此，这些操作不能与[因果一致的会话](https://www.mongodb.com/docs/upcoming/core/read-isolation-consistency-recency/#std-label-causal-consistency)相关联[。](https://www.mongodb.com/docs/upcoming/core/read-isolation-consistency-recency/#std-label-causal-consistency)

### 移除`fastmodinsert`指标

MongoDB 4.2从各种输出中删除了已弃用的`fastmodinsert`指标，包括解释excutingStats、分析器输出等。

### Map-Reduce

从4.2版本开始，MongoDB不建议：

- 地图减少选项以*创建*新的分片集合，以及使用[分片](https://www.mongodb.com/docs/upcoming/reference/command/mapReduce/#std-label-mapreduce-out-cmd)选项进行地图减少。要输出到分片集合，请先创建分片集合。MongoDB 4.2也不建议更换现有的分片集合。
- [非原子](https://www.mongodb.com/docs/upcoming/reference/command/mapReduce/#std-label-mapreduce-out-cmd)的明确规范[：false](https://www.mongodb.com/docs/upcoming/reference/command/mapReduce/#std-label-mapreduce-out-cmd)选项。

### 平衡器状态和自动拆分

从MongoDB 6.1开始，不执行自动分割块。这是因为平衡了政策的改进。自动拆分命令仍然存在，但不执行操作。有关详细信息，请参阅[平衡策略更改。](https://www.mongodb.com/docs/upcoming/release-notes/6.1/#std-label-release-notes-6.1-balancing-policy-changes)

在6.1之前的MongoDB版本中：

*  [`balancerStart`](https://www.mongodb.com/docs/upcoming/reference/command/balancerStart/#mongodb-dbcommand-dbcmd.balancerStart)命令和mongo shell helper方法[`sh.startBalancer()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.startBalancer/#mongodb-method-sh.startBalancer)和 [`sh.setBalancerState(true)`](https://www.mongodb.com/docs/upcoming/reference/method/sh.setBalancerState/#mongodb-method-sh.setBalancerState)也为分片集群启用自动拆分。

  在启用平衡器时禁用自动拆分，您可以使用[`sh.disableAutoSplit()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.disableAutoSplit/#mongodb-method-sh.disableAutoSplit)。

* [`balancerStop`](https://www.mongodb.com/docs/upcoming/reference/command/balancerStop/#mongodb-dbcommand-dbcmd.balancerStop)命令和mongo shell助手方法[`sh.stopBalancer()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.stopBalancer/#mongodb-method-sh.stopBalancer)和 [`sh.setBalancerState(false)`](https://www.mongodb.com/docs/upcoming/reference/method/sh.setBalancerState/#mongodb-method-sh.setBalancerState)也会禁用分片集群的自动拆分。

  要在禁用平衡器时启用自动拆分，您可以使用[`sh.enableAutoSplit()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.enableAutoSplit/#mongodb-method-sh.enableAutoSplit)。

`mongo`方法[`sh.enableBalancing(namespace)`](https://www.mongodb.com/docs/upcoming/reference/method/sh.enableBalancing/#mongodb-method-sh.enableBalancing)和[`sh.disableBalancing(namespace)`](https://www.mongodb.com/docs/upcoming/reference/method/sh.disableBalancing/#mongodb-method-sh.disableBalancing)对自动分割没有影响。

### 锁定诊断报告

从4.2版本开始，MongoDB报告`ReplicationStateTransition`锁定信息。

此外，MongoDB 4.2将`ParallelBatchWriterMode`锁信息与`Global`锁信息分开。早期的MongoDB版本报告`ParallelBatchWriterMode`锁定信息作为`Global`锁的一部分。

有关报告锁定信息的操作，请参阅：

- [`serverStatus`](https://www.mongodb.com/docs/upcoming/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)命令和[`db.serverStatus()`](https://www.mongodb.com/docs/upcoming/reference/method/db.serverStatus/#mongodb-method-db.serverStatus)方法。
- [`$currentOp`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/currentOp/#mongodb-pipeline-pipe.-currentOp)聚合管道阶段、[`currentOp`](https://www.mongodb.com/docs/upcoming/reference/command/currentOp/#mongodb-dbcommand-dbcmd.currentOp)命令和[`db.currentOp()`](https://www.mongodb.com/docs/upcoming/reference/method/db.currentOp/#mongodb-method-db.currentOp)方法。

### `findAndModify`查询/排序/投影参数验证

从MongoDB 4.2（以及4.0.12+和3.6.14+）开始，如果指定的查询、排序或投影参数不是文档， [`findAndModify`](https://www.mongodb.com/docs/upcoming/reference/command/findAndModify/#mongodb-dbcommand-dbcmd.findAndModify)命令及其关联的mongo shell方法就会出错。

在早期版本中，该操作将非文档查询或排序参数视为空文档`{}`。

参见：

- [`findAndModify`](https://www.mongodb.com/docs/upcoming/reference/command/findAndModify/#mongodb-dbcommand-dbcmd.findAndModify)
- [`db.collection.findOneAndDelete()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.findOneAndDelete/#mongodb-method-db.collection.findOneAndDelete)
- [`db.collection.findOneAndReplace()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.findOneAndReplace/#mongodb-method-db.collection.findOneAndReplace)
- [`db.collection.findOneAndUpdate()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.findOneAndUpdate/#mongodb-method-db.collection.findOneAndUpdate)
- [`db.collection.findAndModify()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.findAndModify/#mongodb-method-db.collection.findAndModify)

### `dropDatabase`和`movePrimary`

从MongoDB 4.2开始，

* 如果您删除数据库并创建一个同名的新数据库，则：
  * 重新启动所有[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例和[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)碎片成员；*或*
  * 在读取或写入该数据库之前，对所有[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例和[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)碎片成员使用[`flushRouterConfig`](https://www.mongodb.com/docs/upcoming/reference/command/flushRouterConfig/#mongodb-dbcommand-dbcmd.flushRouterConfig)命令。
* 如果使用 [`movePrimary`](https://www.mongodb.com/docs/upcoming/reference/command/movePrimary/#mongodb-dbcommand-dbcmd.movePrimary)命令移动未分片的集合，请执行以下任一操作：
  * 重新启动所有[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例和[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)碎片成员；*或*
  * 在读取或写入该数据库之前，对所有[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例和[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)碎片成员使用[`flushRouterConfig`](https://www.mongodb.com/docs/upcoming/reference/command/flushRouterConfig/#mongodb-dbcommand-dbcmd.flushRouterConfig)命令。

这确保了[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)和shard实例刷新其元数据缓存。否则，您可能会错过读取数据，并且可能不会将数据写入正确的碎片。要恢复，您必须手动干预。

在早期版本中，您只需要在它们实例上重新启动或运行[`flushRouterConfig`](https://www.mongodb.com/docs/upcoming/reference/command/flushRouterConfig/#mongodb-dbcommand-dbcmd.flushRouterConfig)。

有关更多信息，请参阅[`dropDatabase`](https://www.mongodb.com/docs/upcoming/reference/command/dropDatabase/#mongodb-dbcommand-dbcmd.dropDatabase)和[`movePrimary`](https://www.mongodb.com/docs/upcoming/reference/command/movePrimary/#mongodb-dbcommand-dbcmd.movePrimary)。

### `libldap`和`libldap_r`

对于针对`libldap`链接的MongoDB 4.2企业二进制文件（例如在RHEL上运行时），对`libldap`的访问是同步的，会产生一些性能/延迟成本。

对于与`libldap_r`链接的MongoDB 4.2企业二进制文件，与早期的MongoDB版本相比，行为没有变化。

### 连接池和LDAP服务器

从4.2版本开始，MongoDB将[`ldapUseConnectionPool`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.ldapUseConnectionPool)默认值更改为：

- `true`在Windows上。
- `true`在Linux上，MongoDB Enterprise二进制文件与`libldap_r`链接。

也就是说，在这些系统上，MongoDB默认使用连接池连接到LDAP服务器进行身份验证/授权。

在早期版本（版本4.0.9+）中，MongoDB使用`false`作为[`ldapUseConnectionPool`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.ldapUseConnectionPool)的默认值。也就是说，默认情况下，MongoDB不使用连接池连接到LDAP服务器进行身份验证/授权。

有关详细信息，请参阅[`ldapUseConnectionPool`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.ldapUseConnectionPool)。

### 删除`system.indexes`和`system.namespaces`集合

从4.2版本开始，MongoDB删除了`system.indexes`和`system.namespaces`集合（自v3.0以来不建议使用）。

随着这些集合的删除，从这些角色继承的内置角色[`clusterManager`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-clusterManager)、[`clusterMonitor`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-clusterMonitor)、[`dbAdmin`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-dbAdmin)、[`read`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-read)、[`restore`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-restore)和其他角色不再提供直接访问[`system.indexes`](https://www.mongodb.com/docs/upcoming/reference/system-collections/#mongodb-data--database-.system.indexes)和[`system.namespaces`](https://www.mongodb.com/docs/upcoming/reference/system-collections/#mongodb-data--database-.system.namespaces)集合的特权。

### 仲裁员降级需要清除数据目录

MongoDB 4.2仲裁器数据文件与MongoDB 4.0不兼容。从MongoDB 4.2降级到4.0需要删除仲裁器数据文件作为中间步骤。对MongoDB 4.2数据文件运行MongoDB 4.0仲裁器可能会导致意外行为。

副本集和分片集群的降级说明包括将仲裁员从4.2降级到4.0的具体步骤：

- [将4.2副本设置为4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-replica-set/)
- [将4.2分片集群降级到4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-sharded-cluster/)

### 分片收集和替换文档

从MongoDB 4.2开始

* 替换文档的操作，如 [`replaceOne()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.replaceOne/#mongodb-method-db.collection.replaceOne)或[`update()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.update/#mongodb-method-db.collection.update)（当用于替换文档时），将首先尝试使用查询过滤器来定位单个碎片。如果查询过滤器无法将操作定位到单个碎片，那么它将尝试以替换文档为目标。在早期版本中，这些操作仅尝试使用替换文档定位。
* 不建议使用`save()`方法：改用[`insertOne()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)或[`replaceOne()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.replaceOne/#mongodb-method-db.collection.replaceOne)方法。`save()`方法不能与*未*被`_id`分片的分片集合一起使用，尝试这样做将导致错误。
* 对于包含`upsert: true`且在分片集合上的替换文档操作，`filter`必须在全分片键上包含相等匹配。

## 4.2 功能兼容性

4.2中的一些功能不仅需要4.2二进制文件，还需要将[功能兼容性版本](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)（fCV）设置为4.2。这些功能包括：

* [分布式交易。](https://www.mongodb.com/docs/upcoming/release-notes/4.2/#std-label-4.2-distributed-txns)
* 删除fCV设置为4.2+的MongoDB版本的[索引密钥限制](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Index-Key-Limit)。在取消此限制的情况下，[`failIndexKeyTooLong`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.failIndexKeyTooLong)参数对fCV设置为4.2+的MongoDB版本没有影响，仅适用于fCV设置为`"4.0"`或更低版本的MongoDB 2.6至MongoDB版本。
* 删除fCV设置为4.2+的MongoDB版本的[索引名称长度](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Index-Name-Length)。
* [唯一索引](https://www.mongodb.com/docs/upcoming/core/index-unique/)的新内部格式。新格式既适用于现有的唯一索引，也适用于新创建/重建的唯一索引。
* 从MongoDB 4.2开始，用户不能再使用查询filter`$type: 0`作为`$exists:false`的同义词。要查询空字段或缺失字段，请参阅[查询空字段或缺失字段。](https://www.mongodb.com/docs/upcoming/tutorial/query-for-null-fields/)
* MongoDB 4.2添加了[通配符索引](https://www.mongodb.com/docs/upcoming/core/index-wildcard/#std-label-wildcard-index-core)，以支持用户对自定义字段或集合中的大量字段进行查询的工作负载。





原文 - [Compatibility Changes in MongoDB 4.2]( https://docs.mongodb.com/manual/release-notes/4.2-compatibility/ )

