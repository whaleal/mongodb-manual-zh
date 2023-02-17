# MongoDB 4.4中的兼容性变化

以下4.4更改可能会影响与旧版本MongoDB的兼容性。

## 移除了命令

以下4.4更改可能会影响与旧版本的兼容性 MongoDB的版本。

| 删除了命令                 | 移除了助手                    | 替代品                                                       |
| :------------------------- | :---------------------------- | :----------------------------------------------------------- |
| `cloneCollection`          | `db.cloneCollection()`        | 使用[`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)和[`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)，或使用聚合管道[`$out`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)或[`$merge`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)阶段，或使用驱动程序编写脚本。 |
| `planCacheListPlans`       | `PlanCache.getPlansByQuery()` | 使用聚合管道阶段[`$planCacheStats`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/planCacheStats/#mongodb-pipeline-pipe.-planCacheStats)或Use the `mongo` shell helper method[`PlanCache.list()`](https://www.mongodb.com/docs/upcoming/reference/method/PlanCache.list/#mongodb-method-PlanCache.list). (Available starting in version 4.4)另见[`$planCacheStats`更改](https://www.mongodb.com/docs/upcoming/release-notes/4.4/#std-label-4.4-agg-planCachesStats-changes)。 |
| `planCacheListQueryShapes` | `PlanCache.listQueryShapes()` | 使用聚合管道阶段[`$planCacheStats`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/planCacheStats/#mongodb-pipeline-pipe.-planCacheStats)或Use the `mongo` shell helper method[`PlanCache.list()`](https://www.mongodb.com/docs/upcoming/reference/method/PlanCache.list/#mongodb-method-PlanCache.list). (Available starting in version 4.4)另见[`$planCacheStats`更改](https://www.mongodb.com/docs/upcoming/release-notes/4.4/#std-label-4.4-agg-planCachesStats-changes)。 |

## 移除了参数

MongoDB删除了以下服务器参数：

| 删除了参数            | 描述                                                         |
| :-------------------- | :----------------------------------------------------------- |
| `failIndexKeyTooLong` | MongoDB 4.4删除了`failIndexKeyTooLong`参数。此参数在4.2中被弃用，因为具有[功能兼容性](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)版本（fCV）4.2+的MongoDB不再施加[索引密钥限制。](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Index-Key-Limit) |

## 工具变更

从4.4版本开始，社区版和企业版的[Windows MSI安装程序](https://www.mongodb.com/docs/upcoming/tutorial/install-mongodb-enterprise-on-windows/)不包括[MongoDB数据库工具](https://www.mongodb.com/docs/database-tools/)（`mongoimport`、`mongoexport`等）。要在Windows上下载和安装MongoDB数据库工具，请参阅[安装MongoDB数据库工具。](https://www.mongodb.com/docs/database-tools/installation/installation/)

如果您依赖MongoDB 4.2或之前的MSI安装程序与MongoDB服务器一起安装数据库工具，您现在必须单独下载数据库工具。

## 副本集

### 回滚目录

从Mongo 4.4开始，集合的回滚目录以集合的UUID而不是集合命名空间命名；例如

```
<dbpath>/rollback/20f74796-d5ea-42f5-8c95-f79b39bad190/removed.2020-02-19T04-57-11.0.bson
```

有关详细信息，请参阅[回滚数据。](https://www.mongodb.com/docs/upcoming/core/replica-set-rollbacks/#std-label-replica-set-rollback-data)

### `replSetGetStatus` 输出字段更改

 [`replSetGetStatus`](https://www.mongodb.com/docs/upcoming/reference/command/replSetGetStatus/#mongodb-dbcommand-dbcmd.replSetGetStatus)命令及其mongo shell helper  [`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)从其输出中删除了以下弃用字段：

| 已删除字段                                                   | 替代品                                                       |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`syncingTo`](https://www.mongodb.com/docs/upcoming/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.syncingTo) | 改用[`syncSourceHost`](https://www.mongodb.com/docs/upcoming/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.syncSourceHost)。 |
| [`members[n\].syncingTo`](https://www.mongodb.com/docs/upcoming/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.members-n-.syncingTo) | 改用[`members[n\].syncSourceHost`](https://www.mongodb.com/docs/upcoming/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.members-n-.syncSourceHost)。 |

### 复制品配置文档更改

MongoDB 4.4将[`term`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.term)字段添加到副本集[配置文档](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#std-label-replica-set-configuration-document)中。副本集成员使用[`term`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.term)和[`version`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.version)就“最新”副本配置达成共识。设置[功能兼容性版本（fCV）：“4.4”](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-set-fcv)隐式执行[`replSetReconfig`](https://www.mongodb.com/docs/upcoming/reference/command/replSetReconfig/#mongodb-dbcommand-dbcmd.replSetReconfig)，将[`term`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.term)字段添加到配置文档和块中，直到新配置传播到大多数副本集成员。同样，降级到`fCV : "4.2"`隐式执行重新配置以删除[`term`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.term)字段。

### 操作的初始同步限制

从MongoDB 4.4开始，要在副本集成员上运行，以下操作要求该成员处于[`PRIMARY`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.PRIMARY)或[`SECONDARY`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)状态。

- [`listDatabases`](https://www.mongodb.com/docs/upcoming/reference/command/listDatabases/#mongodb-dbcommand-dbcmd.listDatabases)
- [`listCollections`](https://www.mongodb.com/docs/upcoming/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections)
- [`listIndexes`](https://www.mongodb.com/docs/upcoming/reference/command/listIndexes/#mongodb-dbcommand-dbcmd.listIndexes)
- [`distinct`](https://www.mongodb.com/docs/upcoming/reference/command/distinct/#mongodb-dbcommand-dbcmd.distinct)
- [`dbStats`](https://www.mongodb.com/docs/upcoming/reference/command/dbStats/#mongodb-dbcommand-dbcmd.dbStats)
- [`collStats`](https://www.mongodb.com/docs/upcoming/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats)

如果成员处于其他状态，例如[`STARTUP2`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.STARTUP2)，则操作错误

在之前的版本中，当成员处于[`STARTUP2`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.STARTUP2)时，也可以运行操作。然而，操作要等到成员过渡到[`RECOVERING`。](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)

### 自定义 `getLastErrorDefaults` 值已弃用

从4.4版本开始，MongoDB不建议指定asettings[`settings.getLastErrorDefaults`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.getLastErrorDefaults)值，而不是`{ w: 1, wtimeout: 0 }`的默认值。MongoDB 4.4尊重您指定的任何写入关注值，但未来的MongoDB版本可能不会尊重默认值以外的值。相反，请使用[`setDefaultRWConcern`](https://www.mongodb.com/docs/upcoming/reference/command/setDefaultRWConcern/#mongodb-dbcommand-dbcmd.setDefaultRWConcern)命令为副本集或分片集群设置默认的读或写关注配置。

## 预测兼容性变更

### 将字段设置为新值

从MongoDB 4.4开始，[find](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.find/#std-label-find-projection)和[`findAndModify()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.findAndModify/#mongodb-method-db.collection.findAndModify)投影可以接受[聚合表达式和聚合语法。](https://www.mongodb.com/docs/upcoming/release-notes/4.4/#std-label-4.4-projection)

通过使用聚合表达式和语法，包括使用文字和聚合变量，如果您为投影字段值指定文字（数字或布尔值除外），则该字段将用新值投影。

例如，考虑包含astatus字段的文档的集合清单：

```
db.inventory.insertOne( { _id: 1, item: "postcard", status: "A", instock: [ { warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 } ] })

```

从MongoDB，4.4开始，以下操作用新值而不是当前值投影字段`status`和`instock`：

```
db.inventory.find(
   { status: "A" },
   { status: "Active", instock: ["blue", "crimson"] }
)
```

也就是说，该操作返回以下文档：

```
{ "_id" : 1, "status" : "Active", "instock" : [ "blue", "crimson" ] }

```

在之前的版本中，任何规范值（零/假值或[以前不受支持的文档值](https://www.mongodb.com/docs/upcoming/release-notes/4.4/#std-label-4.4-projection)除外）都被视为`true`，以指示将字段及其当前值包含。也就是说，在早期版本中，之前的操作返回一个文档，其中包含`status`和`instock`字段及其当前值：

```
{ "_id" : 1, "status" : "A", "instock" : [ { "warehouse" : "B", "qty" : 15 }, { "warehouse" : "C", "qty" : 35 } ] }

```

### `$elemMatch`投影字段顺序

从MongoDB 4.4开始，无论文档中字段的顺序如何，现有字段的[`$elemMatch`](https://www.mongodb.com/docs/upcoming/reference/operator/projection/elemMatch/#mongodb-projection-proj.-elemMatch)投影都会在其他现有字段包含之后返回字段。

例如，考虑使用以下文档收集`players`：

```
db.players.insertOne( {
   name: "player1",
   games: [ { game: "abc", score: 8 }, { game: "xyz", score: 5 } ],
   joined: new Date("2020-01-01"),
   lastLogin: new Date("2020-05-01")
} )
```

在4.4+版本中，以下投影在投影中包含的其他现有字段之后返回`games`字段，即使文档中，该字段在`joined`和`lastLogin`字段之前列出：

```
db.players.find( {}, { games: { $elemMatch: { score: { $gt: 5 } } }, joined: 1, lastLogin: 1 } )
```

也就是说，该操作返回以下文档：

```
{
   "_id" : ObjectId("5edef64a1c099fff6b033977"),
   "joined" : ISODate("2020-01-01T00:00:00Z"),
   "lastLogin" : ISODate("2020-05-01T00:00:00Z"),
   "games" : [ { "game" : "abc", "score" : 8 } ]
}

```

在4.2及更早版本中，现有字段的[`$elemMatch`](https://www.mongodb.com/docs/upcoming/reference/operator/projection/elemMatch/#mongodb-projection-proj.-elemMatch)投影支持文档中的顺序：

```
{
  "_id" : ObjectId("5edef91e76ddff7d92f118e1"),
  "games" : [ { "game" : "abc", "score" : 8 } ],
  "joined" : ISODate("2020-01-01T00:00:00Z"),
  "lastLogin" : ISODate("2020-05-01T00:00:00Z")
}
```

### `$slice`嵌入式数组

从MongoDB 4.4开始，当投影是包含投影的一部分时，嵌套文档中数组的[`$slice`](https://www.mongodb.com/docs/upcoming/reference/operator/projection/slice/#mongodb-projection-proj.-slice)投影不再返回嵌套文档中的其他字段。

例如，考虑包含asize字段的文档的集合`inventory`：

```
{ item: "socks", qty: 100, details: { colors: [ "blue", "red" ], sizes: [ "S", "M", "L"] } }

```

从MongoDB 4.4开始，以下操作仅用指定`colors`组切片投影`_id`字段（默认）、`qty`字段和`details`字段：

```
db.inventory.find( { }, { qty: 1, "details.colors": { $slice: 1 } } )
```

也就是说，该操作返回以下文档：

```
{ "_id" : ObjectId("5ee92a6ec644acb6d13eedb1"), "qty" : 100, "details" : { "colors" : [ "blue" ] } }
```

如果[`$slice`](https://www.mongodb.com/docs/upcoming/reference/operator/projection/slice/#mongodb-projection-proj.-slice)投影是排除投影的一部分，则该操作将继续返回嵌套文档中的其他字段。也就是说，以下预测是排除预测。投影排除`_id`字段和`colors`数组中位于指定切片之外的元素，并返回所有其他字段。

```
db.inventory.find( { }, { _id: 0, "details.colors": { $slice: 1 } } )
```

```
{ "item" : "socks", "qty" : 100, "details" : { "colors" : [ "blue" ], "sizes" : [ "S", "M", "L" ] } }
```

[`$slice`](https://www.mongodb.com/docs/upcoming/reference/operator/projection/slice/#mongodb-projection-proj.-slice)投影本身被认为是一个排除。

在之前的版本中，[`$slice`](https://www.mongodb.com/docs/upcoming/reference/operator/projection/slice/#mongodb-projection-proj.-slice)投影还包括嵌套文档中的其他字段，无论投影是包含还是排除。

### 路径冲突限制

#### 路径冲突： 嵌入文档及其字段

从MongoDB 4.4开始，使用任何嵌入式文档的字段投影嵌入式文档是非法的。

例如，考虑包含asize字段的文档的集合`inventory`：

```
{ ..., size: { h: 10, w: 15.25, uom: "cm" }, ... }
```

从MongoDB 4.4开始，以下操作失败，并出现`Path collision`错误，因为它试图同时投影`size`文档和`size.uom`字段：

```
db.inventory.find( {}, { size: 1, "size.uom": 1 } )  // Invalid starting in 4.4
```

在之前的版本中，嵌入式文档及其字段之间的后期投影决定了投影：

* 如果嵌入式文档的投影是在对其字段的任何和所有投影之后进行的，MongoDB会投影嵌入式文档。例如，投影文档`{ "size.uom": 1, size: 1 }`产生与投影文档`{ size: 1 }`相同的结果。
* 如果嵌入式文档的投影在投影之前，MongoDB会投影指定的字段。例如，投影文档`{ "size.uom": 1, size: 1, "size.h": 1 }`产生与投影文档`{ "size.uom": 1, "size.h": 1 }`相同的结果。

#### 路径冲突： 数组的$slice和嵌入字段 `$slice`

从MongoDB 4.4开始，[查找](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.find/#std-label-find-projection)和[`findAndModify()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.findAndModify/#mongodb-method-db.collection.findAndModify)投影不能同时包含数组的[`$slice`](https://www.mongodb.com/docs/upcoming/reference/operator/projection/slice/#mongodb-projection-proj.-slice)和嵌入在数组中的字段。

例如，考虑包含数组字段`instock`的集合`inventory`：

```
{ ..., instock: [ { warehouse: "A", qty: 35 }, { warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 } ], ... }
```

从MongoDB 4.4开始，以下操作失败，并出现`Path collision`错误：

```
db.inventory.find( {}, { "instock": { $slice: 1 }, "instock.warehouse": 0 } ) // Invalid starting in 4.4
```

在之前的版本中，投影同时应用投影，并返回`instock`数组中的第一个元素（`$slice: 1`但抑制投影元素中的`warehouse`字段。从MongoDB 4.4开始，要实现相同的结果，请使用带有两个单独的[`$project`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project)阶段的[`db.collection.aggregate()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.aggregate/#mongodb-method-db.collection.aggregate)方法。

### `$`-前缀字段路径限制

从MongoDB 4.4开始，[find](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.find/#std-label-find-projection)和[`findAndModify()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.findAndModify/#mongodb-method-db.collection.findAndModify)投影不能投影以`$`开头的字段，但[DBRef字段](https://www.mongodb.com/docs/upcoming/reference/database-references/#std-label-dbref-explanation)除外[。](https://www.mongodb.com/docs/upcoming/reference/database-references/#std-label-dbref-explanation)

例如，从MongoDB 4.4开始，以下操作无效：

```
db.inventory.find( {}, { "$instock.warehouse": 0, "$item": 0, "detail.$price": 1 } ) // Invalid starting in 4.4
```

在早期版本中，MongoDB忽略了`$`前缀的字段预测。

### `$` 位置运算符放置限制 

从MongoDB 4.4开始，[`$`](https://www.mongodb.com/docs/upcoming/reference/operator/projection/positional/#mongodb-projection-proj.-)投影运算符只能出现在字段路径的末尾；例如`"field.$"`或`"fieldA.fieldB.$"`

例如，从MongoDB 4.4开始，以下操作无效：

```
db.inventory.find( { }, { "instock.$.qty": 1 } ) // Invalid starting in 4.4

```

要解决，请删除跟随[`$`](https://www.mongodb.com/docs/upcoming/reference/operator/projection/positional/#mongodb-projection-proj.-)投影运算符的字段路径的组件。

在之前的版本中，MongoDB忽略了路径中跟随`$`的部分；即投影被视为`"instock.$"`

### `$` 位置运算符和 `$slice` 限制

从MongoDB 4.4开始，[查找](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.find/#std-label-find-projection)和[`findAndModify()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.findAndModify/#mongodb-method-db.collection.findAndModify)投影不能将[`$slice`](https://www.mongodb.com/docs/upcoming/reference/operator/projection/slice/#mongodb-projection-proj.-slice)投影表达式作为[`$`](https://www.mongodb.com/docs/upcoming/reference/operator/projection/positional/#mongodb-projection-proj.-)投影表达式的一部分。

例如，从MongoDB 4.4开始，以下操作无效：''

```
db.inventory.find( { "instock.qty": { $gt: 25 } }, { "instock.$": { $slice: 1 } } ) // Invalid starting in 4.4

```

在以前的版本中，MongoDB返回第一个元素（instock.$）在符合查询条件的库存数组中;即位置投影`“instock.”`“优先，并且$slice：1为空操作。`“instock.$“`：{ $切片：1 }不排除任何其他文档字段。

### 空字段名投影限制

从MongoDB 4.4开始，[查找](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.find/#std-label-find-projection)和[`findAndModify()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.findAndModify/#mongodb-method-db.collection.findAndModify)投影不能包含空字段名称的投影。

例如，从MongoDB 4.4开始，以下操作无效：

```
db.inventory.find( { }, { "": 0 } ) // Invalid starting in 4.4
```

在之前的版本中，MongoDB将空字段的包含/排除视为对不存在字段的投影。

### 文本搜索元数据{ $meta: "textScore" }查询要求

从MongoDB 4.4开始，您必须在[`db.collection.find()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.find/#mongodb-method-db.collection.find)操作的查询谓词中指定[`$text`](https://www.mongodb.com/docs/upcoming/reference/operator/query/text/#mongodb-query-op.-text)运算符，以便在投影或排序中使用[`{ $meta: "textScore" }`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/meta/#mongodb-expression-exp.-meta)表达式。例如：

```
db.articles.find(
   { $text: { $search: "cake" } },
   { score: { $meta: "textScore" } }
);

db.articles.find(
   { $text: { $search: "cake" } },
   { score: { $meta: "textScore" } }
).sort( { score: {  $meta: "textScore" } } );
```

如果您没有在查询谓词中指定[`$text`](https://www.mongodb.com/docs/upcoming/reference/operator/query/text/#mongodb-query-op.-text)运算符，则操作失败。例如，从MongoDB 4.4开始，以下操作无效：

```
db.articles.find(
   { },
   { score: { $meta: "textScore" } }
)
db.articles.find(
   { },
   { score: { $meta: "textScore" } }
).sort( { score: {  $meta: "textScore" } } );
```

## `$sort`变化

从MongoDB 4.4开始，[`sort()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.sort/#mongodb-method-cursor.sort)方法现在使用与[`$sort`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort)聚合阶段相同的排序算法。通过此更改，对包含重复值的字段执行[`sort()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.sort/#mongodb-method-cursor.sort)的查询更有可能导致这些值的排序顺序不一致。

为了保证在重复值上使用[`sort()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.sort/#mongodb-method-cursor.sort)时的排序一致性，请在排序中包含一个仅包含唯一值的附加字段。

这可以通过将`_id`字段添加到您的排序中来轻松实现。

有关更多信息，请参阅[排序一致性](https://www.mongodb.com/docs/upcoming/reference/method/cursor.sort/#std-label-sort-cursor-consistent-sorting)。

## 映射减少更改

### 减少包含单个值的键

从MongoDB 4.4开始，当您运行[`mapReduce`](https://www.mongodb.com/docs/upcoming/reference/command/mapReduce/#mongodb-dbcommand-dbcmd.mapReduce)命令时，无论关联密钥中包含多少值，MongoDB都会调用`reduce`函数。

在早期版本中，MongoDB不会为具有单个值的键调用`reduce`函数。

有关更多信息，请参阅[使用情况。](https://www.mongodb.com/docs/upcoming/reference/command/mapReduce/#std-label-map-reduce-usage)

### 映射-减少输出更改

从MongoDB 4.4开始，[`mapReduce`](https://www.mongodb.com/docs/upcoming/reference/command/mapReduce/#mongodb-dbcommand-dbcmd.mapReduce)从其输出中删除`counts`字段。

在早期版本中，该命令在其输出中包含一个`counts`字段。例如：

```
"counts" : {
   "input" : 4,
   "emit" : 4,
   "reduce" : 1,
   "output" : 2
},
```

### 映射函数的发射限制

从MongoDB 4.4开始，`map`函数不再将每个`emit()`输出的大小限制在MongoDB[最大BSON文档大小](https://www.mongodb.com/docs/upcoming/reference/limits/#std-label-limit-bson-document-size)的一半[。](https://www.mongodb.com/docs/upcoming/reference/limits/#std-label-limit-bson-document-size)

在早期版本中，单个发射只能容纳MongoDB[最大BSON文档大小](https://www.mongodb.com/docs/upcoming/reference/limits/#std-label-limit-bson-document-size)的一半

### 删除对具有范围的BSON类型JavaScript代码的支持

[`mapReduce`](https://www.mongodb.com/docs/upcoming/reference/command/mapReduce/#mongodb-dbcommand-dbcmd.mapReduce)不再支持其函数的不建议使用的具有范围的[BSON类型](https://www.mongodb.com/docs/upcoming/reference/bson-types/#std-label-bson-types)JavaScript代码（BSON类型15）。`map`、`reduce`和`finalize`函数必须是BSON类型String（BSON Type 2）或BSON类型JavaScript（BSON Type 13）。要传递可以在`map`中访问的常量值，`reduce`和`finalize`函数，请使用`scope`域参数。

自4.2.1版本以来，不建议使用具有[`mapReduce`](https://www.mongodb.com/docs/upcoming/reference/command/mapReduce/#mongodb-dbcommand-dbcmd.mapReduce)函数范围的JavaScript代码。

> 另见：
>
> [弃用](https://www.mongodb.com/docs/upcoming/release-notes/4.4-compatibility/#std-label-4.4-compatibility-deprecations)

## 结构化日志记录

从MongoDB 4.4开始，mongod / mongos实例现在以结构化JSON格式输出所有日志消息。这包括发送到文件、syslog和stdout（标准输出）日志目标的日志输出，以及getLog命令的输出。

以前，日志条目作为明文输出。

如果您有现有的日志解析实用程序，或使用日志摄取服务，您可能需要使用MongoDB 4.4为新的结构化日志格式重新配置这些工具。

有关新结构化日志格式的详细检查，请参阅[日志消息](https://www.mongodb.com/docs/upcoming/reference/log-messages/#std-label-log-messages-ref)，包括使用新日志结构[进行日志解析](https://www.mongodb.com/docs/upcoming/reference/log-messages/#std-label-log-message-parsing)的[示例](https://www.mongodb.com/docs/upcoming/reference/log-messages/#std-label-log-message-parsing)。

### 删除 `rs` getLog值

从MongoDB 4.4开始， [`getLog`](https://www.mongodb.com/docs/upcoming/reference/command/getLog/#mongodb-dbcommand-dbcmd.getLog)命令不再接受`rs`值，因为已经不建议使用这种消息类型的分类。相反，日志消息现在总是由其[组件](https://www.mongodb.com/docs/upcoming/reference/log-messages/#std-label-log-message-components)标识，包括复制消息的**REPL**。

有关在组件字段上过滤的日志解析示例，请参阅[按组件过滤](https://www.mongodb.com/docs/upcoming/reference/log-messages/#std-label-log-message-parsing-example-filter-component)。

### 时间戳格式

随着向结构化JSON日志记录的过渡，不再支持`ctime`时间戳格式。以下配置选项不再接受`ctime`作为有效参数：

- [`systemLog.timeStampFormat`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-systemLog.timeStampFormat)
- [`mongod --timeStampFormat`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--timeStampFormat)
- [`mongos --timeStampFormat`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#std-option-mongos.--timeStampFormat)

改用`iso8601-local`（默认）或`iso8601-utc`时间戳格式。

### maxLogSizeKB参数

随着向结构化JSON日志记录的过渡，[`maxLogSizeKB`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.maxLogSizeKB)服务器参数现在可以截断日志条目中超过指定限制的任何单个属性。以前，此参数将截断整个日志条目。

此外：

- [`maxLogSizeKB`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.maxLogSizeKB)现在接受`0`的值，这完全禁用截断。
- [`maxLogSizeKB`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.maxLogSizeKB)不再接受负值。

有关更多信息，请参阅[日志消息截断](https://www.mongodb.com/docs/upcoming/reference/log-messages/#std-label-log-message-truncation)。

## 一般变化

* MongoDB 4.4取消了对gperftools cpu分析器的支持。作为此更改的一部分，[`hostManager`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-hostManager)不再在集群上提供[`cpuProfiler`](https://www.mongodb.com/docs/upcoming/reference/privilege-actions/#mongodb-authaction-cpuProfiler)特权操作。
* 参数[`ldapConnectionPoolMaximumConnectionsPerHost`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.ldapConnectionPoolMaximumConnectionsPerHost)现在默认值为2。在之前的版本中，默认值未设置。
* [`serverStatus`](https://www.mongodb.com/docs/upcoming/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)返回[`flowControl.locksPerKiloOp`](https://www.mongodb.com/docs/upcoming/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.flowControl.locksPerKiloOp)而不是[`flowControl.locksPerOp`。](https://www.mongodb.com/docs/upcoming/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.flowControl.locksPerOp)
* [`$dateFromParts`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/dateFromParts/#mongodb-expression-exp.-dateFromParts)表达式运算符现在支持`year`和`isoWeekYear`字段的值范围为`1-9999`。在之前的版本中，这些字段支持的值范围为`0-9999`。
* 列表 [`索引`](https://www.mongodb.com/docs/upcoming/reference/command/listIndexes/#mongodb-dbcommand-dbcmd.listIndexes) 和 `mongo` shell 助手方法 [`db.collection.getIndexes（）`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)不再返回 索引规范文档中的名称空间`ns`字段。
* MongoDB 4.4删除了`--noIndexBuildRetry`命令行选项和相应的`storage.indexBuildRetry`选项。
* [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)现在，如果您将空的`writeConcern`值（即`writeConcern: {}`传递给不支持写入问题的命令，则会记录错误。在早期版本中，[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)忽略了这些命令的空`writeConcern`值。
* 带有[`compact`](https://www.mongodb.com/docs/upcoming/reference/command/compact/#mongodb-dbcommand-dbcmd.compact)命令的`force`选项不再是boolean.`force: true`和`force: false`已被弃用，并将导致错误。

### db.collection.validate()参数更改

`mongo`方法[`db.collection.validate()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.validate/#mongodb-method-db.collection.validate)不再只接受布尔参数。

也就是说，该方法不再接受`db.collection.validate(<boolean>)`作为速记ftb`db.collection.validate({full: <boolean>})`

| 代替                            | 使用                                                         |
| :------------------------------ | :----------------------------------------------------------- |
| `db.collection.validate(true)`  | `db.collection.validate({ full: true })`                     |
| `db.collection.validate(false)` | `db.collection.validate()`-或-`db.collection.validate({ full: false })` |

### 全面验证`oplog`

从MongoDB 4.4开始，WiredTiger`oplog`上[的完整](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.validate/#std-label-method-validate-full)验证跳过了更彻底的检查。[`validate.warnings`](https://www.mongodb.com/docs/upcoming/reference/command/validate/#mongodb-data-validate.warnings)包括该行为的通知。

### MMAPv1清理

- [`dbStats`](https://www.mongodb.com/docs/upcoming/reference/command/dbStats/#mongodb-dbcommand-dbcmd.dbStats)命令不再返回过时的MMAPv1 `numExtents`字段。
- [`replSetGetStatus`](https://www.mongodb.com/docs/upcoming/reference/command/replSetGetStatus/#mongodb-dbcommand-dbcmd.replSetGetStatus)命令不再在其输出中返回过时的MMAPv1字段`replSetGetStatus.initialSyncStatus.fetchedMissingDocs`。
- [`fsync`](https://www.mongodb.com/docs/upcoming/reference/command/fsync/#mongodb-dbcommand-dbcmd.fsync)命令不再接受过时的MMAPv1字段`async`作为选项。

### 弃用

#### 地理空间

MongoDB 4.4不建议使用[geoHaystack](https://www.mongodb.com/docs/upcoming/core/geohaystack/)索引和[`geoSearch`](https://www.mongodb.com/docs/upcoming/reference/command/geoSearch/#mongodb-dbcommand-dbcmd.geoSearch)命令。使用[`$geoNear`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)或[`$geoWithin`](https://www.mongodb.com/docs/upcoming/reference/operator/query/geoWithin/#mongodb-query-op.-geoWithin)的[2d索引](https://www.mongodb.com/docs/upcoming/core/2d/#std-label-2d-index)。

#### BSON类型带范围的JavaScript代码

从MongoDB 4.4开始：

* [`$where`](https://www.mongodb.com/docs/upcoming/reference/operator/query/where/#mongodb-query-op.-where)不再支持不建议使用的带范围的BSON类型JavaScript代码（BSON类型15）。[`$where`](https://www.mongodb.com/docs/upcoming/reference/operator/query/where/#mongodb-query-op.-where)运算符仅支持BSON类型String（BSON Type 2）或BSON类型JavaScript（BSON Type 13）。
* [`mapReduce`](https://www.mongodb.com/docs/upcoming/reference/command/mapReduce/#mongodb-dbcommand-dbcmd.mapReduce)不再支持其函数的不建议使用的带范围的BSON类型JavaScript代码（BSON类型15）。`map`、`reduce`和`finalize`函数必须是BSON类型String（BSON Type 2）或BSON类型JavaScript（BSON Type 13）。要传递可以在`map`中访问的常量值，`reduce`和`finalize`函数，请使用作用`scope`参数。

自MongoDB 4.2.1以来，不建议使用范围为[`$where`](https://www.mongodb.com/docs/upcoming/reference/operator/query/where/#mongodb-query-op.-where)和[`mapReduce`](https://www.mongodb.com/docs/upcoming/reference/command/mapReduce/#mongodb-dbcommand-dbcmd.mapReduce)函数的BSON类型JavaScript代码。

分片

MongoDB 4.4不建议使用以下分片命令：

- [`shardConnPoolStats`](https://www.mongodb.com/docs/upcoming/reference/command/shardConnPoolStats/#mongodb-dbcommand-dbcmd.shardConnPoolStats)（改用[`connPoolStats`](https://www.mongodb.com/docs/upcoming/reference/command/connPoolStats/#mongodb-dbcommand-dbcmd.connPoolStats)）
- [`unsetSharding`](https://www.mongodb.com/docs/upcoming/reference/command/unsetSharding/#mongodb-dbcommand-dbcmd.unsetSharding)

#### Lookaside Table Overflow文件大小限制

从MongoDB 4.4开始，WiredTiger lookaside表（LAS）缓存溢出文件不再存在。因此，MongoDB 4.4不建议使用（LAS）缓存溢出文件限制的以下选项和参数；这些选项和参数从MongoDB 4.4开始无效：

- [`storage.wiredTiger.engineConfig.maxCacheOverflowFileSizeGB`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.wiredTiger.engineConfig.maxCacheOverflowFileSizeGB)配置文件选项
- [`--wiredTigerMaxCacheOverflowFileSizeGB`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--wiredTigerMaxCacheOverflowFileSizeGB)命令行选项
- [`wiredTigerMaxCacheOverflowSizeGB`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.wiredTigerMaxCacheOverflowSizeGB)参数

## 4.4 功能兼容性

4.4中的一些功能不仅需要4.4二进制文件，还需要将[功能兼容性版本](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)（fCV）设置为4.4。这些功能包括：

- 提高fCV设置为4.4+的MongoDB版本的[命名空间长度](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Namespace-Length)限制。
- 创建[复合散列索引](https://www.mongodb.com/docs/upcoming/release-notes/4.4/#std-label-4.4-rel-notes-compound-hashed-index)需要将fCV设置为4.4+。



 





原文 - [Compatibility Changes in MongoDB 4.4]( https://docs.mongodb.com/manual/release-notes/4.4-compatibility/ )

