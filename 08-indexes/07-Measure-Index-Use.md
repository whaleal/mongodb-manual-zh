## 测量索引的使用情况

### 获取索引访问信息`$indexStats`

使用[`$indexStats`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/indexStats/#mongodb-pipeline-pipe.-indexStats)聚合阶段获取有关集合的每个索引的使用情况的统计信息。例如，以下聚合操作返回`orders`集合上索引使用情况的统计信息：

```
db.orders.aggregate( [ { $indexStats: { } } ] )
```

> 提示:
>
> **也可以看看:**
>
> [`$indexStats`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/indexStats/#mongodb-pipeline-pipe.-indexStats)

### 返回查询计划`explain()`

在[executionStats](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.explain/#std-label-explain-method-executionStats)模式下使用[`db.collection.explain()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.explain/#mongodb-method-db.collection.explain)或 方法返回有关查询过程的统计信息，包括使用的索引、扫描的文档数以及查询处理所花费的时间（以毫秒为单位）。[`cursor.explain()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.explain/#mongodb-method-cursor.explain)

运行[`db.collection.explain()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.explain/#mongodb-method-db.collection.explain)或[allPlansExecution](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.explain/#std-label-explain-method-allPlansExecution)[`cursor.explain()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.explain/#mongodb-method-cursor.explain)模式 下的方法 ，查看计划选择过程中收集的部分执行统计信息。

> 提示
>
> **也可以看看:**
>
> [`planCacheKey`](https://www.mongodb.com/docs/v7.0/core/query-plans/#std-label-plan-cache-key)

### 控制索引 与以下内容一起使用`hint()`

要*强制*MongoDB 对操作使用特定索引 [`db.collection.find()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.find/#mongodb-method-db.collection.find)，请使用 方法指定索引 [`hint()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.hint/#mongodb-method-cursor.hint)。将[`hint()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.hint/#mongodb-method-cursor.hint) 方法附加到方法中[`find()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.find/#mongodb-method-db.collection.find)。考虑以下示例：

```
db.people.find(
   { name: "John Doe", zipcode: { $gt: "63000" } }
).hint( { zipcode: 1 } )
```

要查看特定索引的执行统计信息，请附加到 [`db.collection.find()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.find/#mongodb-method-db.collection.find)方法[`hint()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.hint/#mongodb-method-cursor.hint)后跟[`cursor.explain()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.explain/#mongodb-method-cursor.explain)，例如：

```
db.people.find(
   { name: "John Doe", zipcode: { $gt: "63000" } }
).hint( { zipcode: 1 } ).explain("executionStats")
```

或者，将[`hint()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.hint/#mongodb-method-cursor.hint)方法附加到 [`db.collection.explain().find()`：](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.explain/#mongodb-method-db.collection.explain)

```
db.people.explain("executionStats").find(
   { name: "John Doe", zipcode: { $gt: "63000" } }
).hint( { zipcode: 1 } )
```

`$natural`为该方法指定运算符[`hint()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.hint/#mongodb-method-cursor.hint) 以防止 MongoDB 使用*任何*索引：

```
db.people.find(
   { name: "John Doe", zipcode: { $gt: "63000" } }
).hint( { $natural: 1 } )
```

### 索引指标

除了[`$indexStats`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/indexStats/#mongodb-pipeline-pipe.-indexStats)聚合阶段之外，MongoDB 还提供各种索引统计信息，您在分析数据库索引使用情况时可能需要考虑这些统计信息：

- 在输出中[`serverStatus`：](https://www.mongodb.com/docs/v7.0/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)
  - [`metrics.queryExecutor.scanned`](https://www.mongodb.com/docs/v7.0/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.metrics.queryExecutor.scanned)
  - [`metrics.operation.scanAndOrder`](https://www.mongodb.com/docs/v7.0/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.metrics.operation.scanAndOrder)
- 在输出中[`collStats`：](https://www.mongodb.com/docs/v7.0/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats)
  - [`totalIndexSize`](https://www.mongodb.com/docs/v7.0/reference/command/collStats/#mongodb-data-collStats.totalIndexSize)
  - [`indexSizes`](https://www.mongodb.com/docs/v7.0/reference/command/collStats/#mongodb-data-collStats.indexSizes)
- 在输出中[`dbStats`：](https://www.mongodb.com/docs/v7.0/reference/command/dbStats/#mongodb-dbcommand-dbcmd.dbStats)
  - [`dbStats.indexes`](https://www.mongodb.com/docs/v7.0/reference/command/dbStats/#mongodb-data-dbStats.indexes)
  - [`dbStats.indexSize`](https://www.mongodb.com/docs/v7.0/reference/command/dbStats/#mongodb-data-dbStats.indexSize)

