## 执行长时间运行的快照查询

快照查询允许您读取最近单个时间点出现的数据。

从MongoDB 5.0开始，您可以使用读关注 来查询[辅助](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)[`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)节点上的数据。此功能提高了应用程序读取的多功能性和弹性。您不需要创建数据的静态副本，将其移至单独的系统中，并手动隔离这些长时间运行的查询，以免干扰您的操作工作负载。相反，您可以在读取数据的一致状态时对实时事务数据库执行长时间运行的查询。

在辅助节点上使用读取关注[`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)不会影响应用程序的写入工作负载。只有应用程序读取才能从隔离到辅助数据库的长时间运行的查询中受益。

当您需要执行以下操作时，请使用快照查询：

- 执行多个相关查询，并确保每个查询读取同一时间点的数据。
- 确保您读取过去某个时刻的数据的一致状态

### 比较本地读取和快照读取问题

当 MongoDB 使用默认的读取关注点执行长时间运行的查询时 [`"local"`](https://www.mongodb.com/docs/manual/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-)，查询结果可能包含与查询同时发生的写入数据。因此，查询可能会返回意外或不一致的结果。

为了避免这种情况，请创建一个[会话](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)并指定读取关注[`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)。通过读取关注 [`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)，MongoDB 使用快照隔离来运行您的查询，这意味着您的查询读取最近单个时间点出现的数据。

### 例子

本页上的示例展示了如何使用快照查询来：

- [从同一时间点运行相关查询](https://www.mongodb.com/docs/manual/tutorial/long-running-queries/#std-label-example-snapshot-queries-multiple)
- [从过去某个时刻读取数据的一致状态](https://www.mongodb.com/docs/manual/tutorial/long-running-queries/#std-label-example-snapshot-pit)

#### 从同一时间点运行相关查询

读取关注[`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)使您可以在会话中运行多个相关查询，并确保每个查询从同一时间点读取数据。

动物收容所有一个`pets`数据库，其中包含每种宠物的集合。该`pets`数据库有以下集合：

- `cats`
- `dogs`

每个集合中的每个文档都包含一个`adoptable`字段，指示宠物是否可供收养。例如，集合中的文档`cats`如下所示：

```
{
   "name": "Whiskers",
   "color": "white",
   "age": 10,
   "adoptable": true
}
```

您想要运行查询来查看所有集合中可供收养的宠物总数。为了提供一致的数据视图，您需要确保从每个集合返回的数据都来自单个时间点。

要实现此目标，请[`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-) 在会话中使用读取关注：

```
mongoc_client_session_t *cs = NULL;
mongoc_collection_t *cats_collection = NULL;
mongoc_collection_t *dogs_collection = NULL;
int64_t adoptable_pets_count = 0;
bson_error_t error;
mongoc_session_opt_t *session_opts;

cats_collection = mongoc_client_get_collection (client, "pets", "cats");
dogs_collection = mongoc_client_get_collection (client, "pets", "dogs");

/* Seed 'pets.cats' and 'pets.dogs' with example data */
if (!pet_setup (cats_collection, dogs_collection)) {
   goto cleanup;
}

/* start a snapshot session */
session_opts = mongoc_session_opts_new ();
mongoc_session_opts_set_snapshot (session_opts, true);
cs = mongoc_client_start_session (client, session_opts, &error);
mongoc_session_opts_destroy (session_opts);
if (!cs) {
   MONGOC_ERROR ("Could not start session: %s", error.message);
   goto cleanup;
}

/*
 * Perform the following aggregation pipeline, and accumulate the count in
 * `adoptable_pets_count`.
 *
 *  adoptablePetsCount = db.cats.aggregate(
 *      [ { "$match": { "adoptable": true } },
 *        { "$count": "adoptableCatsCount" } ], session=s
 *  ).next()["adoptableCatsCount"]
 *
 *  adoptablePetsCount += db.dogs.aggregate(
 *      [ { "$match": { "adoptable": True} },
 *        { "$count": "adoptableDogsCount" } ], session=s
 *  ).next()["adoptableDogsCount"]
 *
 * Remember in order to apply the client session to
 * this operation, you must append the client session to the options passed
 * to `mongoc_collection_aggregate`, i.e.,
 *
 * mongoc_client_session_append (cs, &opts, &error);
 * cursor = mongoc_collection_aggregate (
 *    collection, MONGOC_QUERY_NONE, pipeline, &opts, NULL);
 */
accumulate_adoptable_count (cs, cats_collection, &adoptable_pets_count);
accumulate_adoptable_count (cs, dogs_collection, &adoptable_pets_count);

printf ("there are %" PRId64 " adoptable pets\n", adoptable_pets_count);

```

前面的一系列命令：

- 用于`MongoClient()`建立与 MongoDB 部署的连接。
- 切换到`pets`数据库。
- 建立一个会话。该命令指定`snapshot=True`，因此会话使用读取关注[`"snapshot"`。](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)
- 对数据库中的每个集合执行以下操作`pets`：
  * 用于[`$match`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match)过滤字段为 的 `adoptable`文档`True`。
  * 用于[`$count`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/count/#mongodb-pipeline-pipe.-count)返回已过滤文档的计数。
  * `adoptablePetsCount`使用数据库中的计数递增变量。
- 打印`adoptablePetsCount`变量。

会话中的所有查询都会读取同一时间点出现的数据。因此，最终计数反映了数据的一致快照。

> 笔记:
>
> 如果会话持续时间超过WiredTiger历史记录保留期限（默认情况下300秒），则查询会出错 `SnapshotTooOld`。要了解如何配置快照保留并启用更长时间运行的查询，请参阅 [配置快照保留。](https://www.mongodb.com/docs/manual/tutorial/long-running-queries/#std-label-configure-snapshot-retention)

#### 从过去某个时刻读取数据的一致状态

读取关注[`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)可确保您的查询读取最近某个时间点出现的数据。

在线鞋店有一个`sales`集合，其中包含商店销售的每件商品的数据。例如，集合中的文档`sales` 如下所示：

```
{
   "shoeType": "boot",
   "price": 30,
   "saleDate": ISODate("2022-02-02T06:01:17.171Z")
}
```

每天午夜，都会运行一个查询来查看当天售出了多少双鞋。每日销售查询如下所示：

```
mongoc_client_session_t *cs = NULL;
mongoc_collection_t *sales_collection = NULL;
bson_error_t error;
mongoc_session_opt_t *session_opts;
bson_t *pipeline = NULL;
bson_t opts = BSON_INITIALIZER;
mongoc_cursor_t *cursor = NULL;
const bson_t *doc = NULL;
bool ok = true;
bson_iter_t iter;
int64_t total_sales = 0;

sales_collection = mongoc_client_get_collection (client, "retail", "sales");

/* seed 'retail.sales' with example data */
if (!retail_setup (sales_collection)) {
   goto cleanup;
}

/* start a snapshot session */
session_opts = mongoc_session_opts_new ();
mongoc_session_opts_set_snapshot (session_opts, true);
cs = mongoc_client_start_session (client, session_opts, &error);
mongoc_session_opts_destroy (session_opts);
if (!cs) {
   MONGOC_ERROR ("Could not start session: %s", error.message);
   goto cleanup;
}

if (!mongoc_client_session_append (cs, &opts, &error)) {
   MONGOC_ERROR ("could not apply session options: %s", error.message);
   goto cleanup;
}

pipeline = BCON_NEW ("pipeline",
                     "[",
                     "{",
                     "$match",
                     "{",
                     "$expr",
                     "{",
                     "$gt",
                     "[",
                     "$saleDate",
                     "{",
                     "$dateSubtract",
                     "{",
                     "startDate",
                     "$$NOW",
                     "unit",
                     BCON_UTF8 ("day"),
                     "amount",
                     BCON_INT64 (1),
                     "}",
                     "}",
                     "]",
                     "}",
                     "}",
                     "}",
                     "{",
                     "$count",
                     BCON_UTF8 ("totalDailySales"),
                     "}",
                     "]");

cursor = mongoc_collection_aggregate (
   sales_collection, MONGOC_QUERY_NONE, pipeline, &opts, NULL);
bson_destroy (&opts);

ok = mongoc_cursor_next (cursor, &doc);

if (mongoc_cursor_error (cursor, &error)) {
   MONGOC_ERROR ("could not get totalDailySales: %s", error.message);
   goto cleanup;
}

if (!ok) {
   MONGOC_ERROR ("%s", "cursor has no results");
   goto cleanup;
}

ok = bson_iter_init_find (&iter, doc, "totalDailySales");
if (ok) {
   total_sales = bson_iter_as_int64 (&iter);
} else {
   MONGOC_ERROR ("%s", "missing key: 'totalDailySales'");
   goto cleanup;
}
```

前面的查询：

- 使用[`$match`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match)with[`$expr`](https://www.mongodb.com/docs/manual/reference/operator/query/expr/#mongodb-query-op.-expr)指定 `saleDate`字段上的过滤器。
  - [`$expr`](https://www.mongodb.com/docs/manual/reference/operator/query/expr/#mongodb-query-op.-expr)允许在阶段中使用[聚合表达式](https://www.mongodb.com/docs/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions)（例如[`NOW`](https://www.mongodb.com/docs/manual/reference/aggregation-variables/#mongodb-variable-variable.NOW)） [`$match`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match)。
- 使用[`$gt`](https://www.mongodb.com/docs/manual/reference/operator/query/gt/#mongodb-query-op.-gt)运算符和[`$dateSubtract`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/dateSubtract/#mongodb-expression-exp.-dateSubtract) 表达式返回 大于`saleDate`执行查询前一天的文档。
- 用于[`$count`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/count/#mongodb-pipeline-pipe.-count)返回匹配文档的计数。计数存储在`totalDailySales`变量中。
- 指定读取关注点[`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)以确保查询从单个时间点读取。

该`sales`集合非常大，因此该查询可能需要几分钟才能运行。由于商店是在线的，因此一天中的任何时间都可以进行销售。

例如，考虑是否：

- 该查询于中午 12:00 开始执行。
- 上午 12:02 一名顾客购买了三双鞋。
- 该查询于凌晨 12:04 完成执行。

如果查询不使用 读取关注[`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)，则查询开始和完成之间发生的销售可以包含在查询计数中，尽管不是在报告当天发生。这可能会导致报告不准确，某些销售额被计算两次。

通过指定 read Concern [`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)，查询仅返回查询开始执行前不久数据库中存在的数据。

> 笔记:
>
> 如果查询时间超过WiredTiger历史记录保留期限（默认为300秒），则查询会出现错误 `SnapshotTooOld`。要了解如何配置快照保留并启用更长时间运行的查询，请参阅 [配置快照保留。](https://www.mongodb.com/docs/manual/tutorial/long-running-queries/#std-label-configure-snapshot-retention)

### 配置快照保留

默认情况下，WiredTiger 存储引擎保留历史记录 300 秒。从会话中第一次操作到最后一次操作，您可以使用一个会话`snapshot=true`总共 300 秒。如果您使用会话的时间较长，则会话会失败并出现错误`SnapshotTooOld`。同样，如果使用读关注查询数据，[`"snapshot"`](https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)并且查询持续时间超过 300 秒，则查询失败。

如果您的查询或会话运行时间超过 300 秒，请考虑增加快照保留期。要延长保留期限，请修改该[`minSnapshotHistoryWindowInSeconds`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.minSnapshotHistoryWindowInSeconds) 参数。

例如，此命令将 的值设置 [`minSnapshotHistoryWindowInSeconds`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.minSnapshotHistoryWindowInSeconds)为 600 秒：

```
db.adminCommand( { setParameter: 1, minSnapshotHistoryWindowInSeconds: 600 } )
```

>  重要的
>
> 修改[`minSnapshotHistoryWindowInSeconds`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.minSnapshotHistoryWindowInSeconds)为 [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)集群，您必须联系[Atlas支持。](https://www.mongodb.com/docs/atlas/support/)

#### 磁盘空间和历史记录

增加 的值[`minSnapshotHistoryWindowInSeconds`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.minSnapshotHistoryWindowInSeconds) 会增加磁盘使用量，因为服务器必须维护指定时间窗口内旧修改值的历史记录。使用的磁盘空间量取决于您的工作负载，较大的工作负载量需要更多的磁盘空间。





 参见

原文 - https://www.mongodb.com/docs/v7.0/tutorial/long-running-queries/