## 数据库分析器（profiler）

数据库探查器收集有关针对 正在运行的实例执行的[数据库命令的](https://www.mongodb.com/docs/manual/reference/command/#std-label-database-commands)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)详细信息 。这包括 CRUD 操作以及配置和管理命令。分析器将其收集的所有数据写入一个 [`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)集合，即 每个分析数据库中的一个[上限集合。](https://www.mongodb.com/docs/manual/core/capped-collections/)有关探查器创建的文档的概述， 请参阅[数据库探查器输出。](https://www.mongodb.com/docs/manual/reference/database-profiler/)[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)

探查器是`off`默认的。您可以在以下几个实例之一针对每个数据库或每个实例启用探查器：[分析级别。](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/#std-label-database-profiling-level)

启用后，分析会对数据库性能和磁盘使用产生影响。看[数据库分析器开销](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/#std-label-database-profiling-overhead)了解更多信息。

本文档概述了数据库分析器的许多关键管理选项。有关其他相关信息，请参阅：

- [数据库分析器输出](https://www.mongodb.com/docs/manual/reference/database-profiler/#std-label-profiler)
- [配置文件命令](https://www.mongodb.com/docs/manual/reference/command/profile/#std-label-profile-command)
- [`db.currentOp()`](https://www.mongodb.com/docs/manual/reference/method/db.currentOp/#mongodb-method-db.currentOp)

> 警告
>
> 请勿尝试使用名称 system.profile 创建时间序列集合或视图。MongoDB 6.3 及更高版本会在尝试创建时返回非法操作错误。早期的 MongoDB 版本会崩溃。

### 分析级别

可以使用以下分析级别：

| 等级 | 描述                                                         |
| :--- | :----------------------------------------------------------- |
| `0`  | 探查器已关闭并且不收集任何数据。这是默认的探查器级别。       |
| `1`  | 探查器收集耗时超过过滤器值`slowms`或与[过滤器匹配的操作的数据。](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#std-label-set-profiling-level-options-filter)当设置过滤器时：和`slowms`选项`sampleRate`不用于分析。探查器仅捕获与 [过滤器匹配的操作。](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#std-label-set-profiling-level-options-filter) |
| `2`  | 探查器收集所有操作的数据。                                   |

### 启用和配置数据库分析

您可以为[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例启用数据库分析。

本节使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)helper [`db.setProfilingLevel()`](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#mongodb-method-db.setProfilingLevel)启用分析的助手。有关使用驱动程序的说明，请参阅您的[驱动程序文档。](https://www.mongodb.com/docs/drivers/)

当您为[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例启用分析时，您可以设置[分析级别](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/#std-label-database-profiling-levels)为大于 0 的值。探查器将数据记录在[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)集合中。在您启用数据库分析后， MongoDB 会 [`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)在数据库中创建集合。

要启用分析并设置分析级别，请将分析级别传递给[`db.setProfilingLevel()`](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#mongodb-method-db.setProfilingLevel)帮助程序。例如，要启用所有数据库操作的分析，请考虑以下操作[`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
db.setProfilingLevel(2)
```

shell 返回一个显示*上*一个分析级别的文档。键值`"ok" : 1`对表示操作成功：

```
{ "was" : 0, "slowms" : 100, "sampleRate" : 1.0, "ok" : 1 }
```

要验证新设置，请参阅 [检查分析级别](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/#std-label-database-profiling-view-status)部分。

从 MongoDB 5.0 开始（从 4.4.2 和 4.2.12 开始也可用），对[数据库分析器](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/#std-label-database-profiler) `level`、`slowms`、`sampleRate`、 或 `filter`使用[`profile`](https://www.mongodb.com/docs/manual/reference/command/profile/#mongodb-dbcommand-dbcmd.profile)命令或 [`db.setProfilingLevel()`](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#mongodb-method-db.setProfilingLevel)包装方法都记录在 [`log file`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--logpath)

#### 全局和每个数据库的分析设置

slowms 和 sampleRate 分析设置是全局的。一旦设置，这些设置会影响进程中的所有数据库。

当通过 [profile](https://www.mongodb.com/docs/manual/reference/command/profile/#mongodb-dbcommand-dbcmd.profile) 命令或 [db.setProfilingLevel()](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#mongodb-method-db.setProfilingLevel) shell 辅助方法进行设置时，分析级别和过滤器设置在数据库级别上进行设置。当作为命令行或[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-configuration-options)选项设置时，分析级别和过滤器设置会影响整个进程。

### 指定慢操作的阈值

默认情况下，慢操作阈值为100毫秒。要更改慢操作阈值，请以以下一种方式指定所需的阈值值：

* 使用 profile 命令或 [db.setProfilingLevel()](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#mongodb-method-db.setProfilingLevel) shell 辅助方法设置 slowms 的值。
* 在启动时通过命令行设置 --slowms 的值。
* 在配置文件中设置[slowOpThresholdMs](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpThresholdMs)的值。

例如，以下代码将当前 mongod 实例的分析级别设置为 1，并将 mongod 实例的慢操作阈值设置为 20 毫秒：

```
db.setProfilingLevel(1, { slowms: 20 })
```

分析级别为 1 会对比阈值更慢的操作进行分析。

> 重要
>
> 慢操作阈值适用于 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例中的所有数据库。它由数据库分析器和诊断日志使用，并且应设置为最高有用值以避免性能下降。

从 MongoDB 4.0 开始，您可以使用 `db.setProfilingLevel()` 来配置 `mongos` 的 `slowms` 和 `sampleRate`。对于 `mongos`，`slowms` 和 `sampleRate` 配置设置只影响诊断日志，而不影响分析器，因为 `mongos` 上不支持分析器

例如，以下设置 mongos 实例的慢操作阈值以记录慢操作：

```
db.setProfilingLevel(0, { slowms: 20 })
```

从 MongoDB 4.2 开始，分析器条目和读/写操作的诊断日志消息（即 mongod/mongos 的日志消息）包括以下内容：

* `queryHash` 用于帮助识别具有相同查询结构的慢查询。

* `planCacheKey` 用于更深入地了解慢查询的查询计划缓存。

从版本 4.2 开始，副本集的辅助成员现在会记录应用时间超过慢操作阈值的[oplog 条目。](https://www.mongodb.com/docs/manual/core/replica-set-oplog/#std-label-slow-oplog-application)这些慢的 oplog 消息：

* 被记录在诊断日志中的辅助成员。

* 以 REPL 组件的身份记录，文本为 

  ```
  applied op: <oplog entry> took <num>ms。
  ```

* 不依赖日志级别（无论是系统级别还是组件级别）

* 不依赖于分析级别。

* 可能会受到影响[`slowOpSampleRate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate)，具体取决于您的 MongoDB 版本:

  * 在 MongoDB 4.2 中，这些慢速 oplog 条目不受[`slowOpSampleRate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate). 无论采样率如何，MongoDB 都会记录所有慢速 oplog 条目。
  * 在 MongoDB 4.4 及更高版本中，这些缓慢的 oplog 条目受到[`slowOpSampleRate`.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate)

探查器不会捕获慢oplog 条目。

### 对慢操作的随机样本进行分析。

要仅对所有慢操作的随机抽样 子集进行分析，请以以下一种方式指定所需的抽样率：

* 使用 profile 命令或 db.setProfilingLevel() shell 辅助方法设置 sampleRate 的值。
* 在启动时通过命令行设置 mongod 的 --slowOpSampleRate 或 mongos 的 --slowOpSampleRate 的值。
* 在配置文件中设置 SlowOpSampleRate 的值。

默认情况下，sampleRate 设置为 1.0，表示会对所有慢操作进行分析。当 sampleRate 设置在 0 到 1 之间时，具有分析级别 1 的数据库将根据 sampleRate 仅对一定百分比的慢操作进行随机抽样分析。

例如，以下方法将 mongod 的分析级别设置为 1，并将分析器设置为对所有慢速操作的 42% 进行采样：

```
db.setProfilingLevel(1, { sampleRate: 0.42 })
```

修改后的采样率值也适用于系统日志。

从 MongoDB 4.0 开始，您可以使用 `db.setProfilingLevel()` 来配置 `mongos` 的 `slowms` 和 `sampleRate`。对于 `mongos`，`slowms` 和 `sampleRate` 配置设置只影响诊断日志，因为 `mongos` 上不支持分析器。

例如，以下设置 mongos 实例记录慢速操作的采样率：

```
db.setProfilingLevel(0, { sampleRate: 0.42 })
```

> 重要的
>
> 当[`logLevel`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.logLevel)设置为时`0`，MongoDB 以由 确定的速率 将*慢操作记录到诊断日志中*[`slowOpSampleRate`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate)
>
> 在较高的设置下，所有操作都会出现在诊断日志中，无论其延迟如何，但以下例外：[辅助节点](https://www.mongodb.com/docs/manual/release-notes/4.2/#std-label-slow-oplog)[`logLevel`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.logLevel)记录慢 oplog 条目消息。辅助节点仅记录慢 oplog 条目；增加不记录所有 oplog 条目。[`logLevel`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.logLevel)

请参阅《[数据库分析和分片](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/#std-label-db-profiling-sharding)》。

#### 设置Filter以确定被分析的操作

*4.4.2版本中的新增功能*。

您可以设置Filter来控制分析和记录哪些操作。您可以通过以下方式之一设置分析过滤器：

- 使用 [profile](https://www.mongodb.com/docs/manual/reference/command/profile/#mongodb-dbcommand-dbcmd.profile) 命令或 [db.setProfilingLevel()](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#mongodb-method-db.setProfilingLevel) shell 方法设置 filter 的值。
- 在[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-configuration-options)中设置 [filter](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.filter) 的值。

对于[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，该`filter`会影响诊断日志和分析器（如果启用）。

对于 mongos 实例，该`filter`仅影响诊断日志，不影响分析器，因为 mongos 上不支持分析器。

> 笔记
>
> `filter`设置分析后， [slowms](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#std-label-set-profiling-level-options-slowms)和[sampleRate](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#std-label-set-profiling-level-options-sampleRate)选项不会影响诊断日志或分析器。

例如，[`db.setProfilingLevel()`](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#mongodb-method-db.setProfilingLevel)对一个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例设置如下方法：

- 分析级别为 2
- [filter](https://www.mongodb.com/docs/manual/reference/method/db.setProfilingLevel/#std-label-set-profiling-level-options-filter) 为 { op: "query", millis: { $gt: 2000 } }，这会导致分析器仅记录执行时间超过2秒的查询操作。

```
db.setProfilingLevel( 2, { filter: { op: "query", millis: { $gt: 2000 } } } )
```

#### 查看分析级别

要查看[分析级别](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/#std-label-database-profiling-levels)，[`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
db.getProfilingStatus()
```

shell 返回类似于以下内容的文档：

```
{ "was" : 0, "slowms" : 100, "sampleRate" : 1.0, "ok" : 1 }
```

该`was`字段指示当前的分析级别。

该`slowms`字段指示操作时间阈值，以毫秒为单位，超过该阈值操作被认为是*缓慢的*。

该字段指示应分析的*缓慢*`sampleRate`操作的百分比。

#### 禁用分析

要禁用分析，请使用 [`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
db.setProfilingLevel(0)
```

#### 启用整个`mongod`实例的分析

为了在测试环境中进行开发，您可以为整个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例启用数据库分析。分析级别适用于 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例提供的所有数据库。

要启用实例分析[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，请在启动时传递以下选项[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

```
mongod --profile 1 --slowms 15 --slowOpSampleRate 0.5
```

或者，您可以在[配置文件中指定](https://www.mongodb.com/docs/manual/reference/configuration-options/)[操作Profiling ](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-operation-profiling-configuration-options)[。](https://www.mongodb.com/docs/manual/reference/configuration-options/)

这会将分析级别设置为`1`，将慢速操作定义为持续时间超过`15`毫秒的操作，并指定仅应分析50% 的*慢速操作。*[[ 2 \]](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/#footnote-slow-oplogs)

当 logLevel 设置为 0 时，slowms 和 slowOpSampleRate 也会影响记录到诊断日志中的操作。slowms 和 slowOpSampleRate 也可用于配置 mongos 的诊断日志记录。[2]

> 提示
>
> 可以看看：
>
> - [`mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.mode)
> - [`slowOpThresholdMs`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpThresholdMs)
> - [`slowOpSampleRate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate)

#### 数据库分析和分片

您*无法*在[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例上启用分析。要在分片集群中启用分析，您必须为集群中的每个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例启用分析。

但是，从 MongoDB 4.0 开始，您可以设置[`--slowms`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--slowms)和[`slowOpSampleRate`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--slowOpSampleRate)on[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)来配置慢速操作的诊断日志。

#### 查看分析器数据

数据库探查器在 [`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)集合中记录有关数据库操作的信息。

要查看分析信息，请查询[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)集合。要查看示例查询，请参阅 [Profiler 数据查询示例](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/#std-label-database-profiling-example-queries)。有关输出数据的说明，请参阅[数据库探查器输出。](https://www.mongodb.com/docs/manual/reference/database-profiler/)

从 MongoDB 4.4 开始，不再可能从[事务](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions)[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)内对集合 执行任何操作，包括读取[。](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions)

> 提示
>
> 您可以使用[`$comment`](https://www.mongodb.com/docs/manual/reference/operator/query/comment/#mongodb-query-op.-comment)将数据添加到查询谓词，以便更轻松地分析探查器中的数据。

#### Profiler 数据查询示例

此部分显示对[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile) 集合的示例查询。有关查询输出的说明，请参阅 [数据库探查器输出。](https://www.mongodb.com/docs/manual/reference/database-profiler/)

要返回集合中最新的 10 个日志条目[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile) ，请运行类似于以下内容的查询：

```
db.system.profile.find().limit(10).sort( { ts : -1 } ).pretty()
```

要返回除命令操作 ( [$cmd](https://www.mongodb.com/docs/manual/reference/glossary/#std-term--cmd) ) 之外的所有操作，请运行类似于以下内容的查询：

```
db.system.profile.find( { op: { $ne : 'command' } } ).pretty()
```

要返回特定集合的操作，请运行类似于以下内容的查询。此示例返回`mydb`数据库 `test`集合中的操作：

```
db.system.profile.find( { ns : 'mydb.test' } ).pretty()
```

要返回慢于`5`毫秒的操作，请运行类似于以下内容的查询：

```
db.system.profile.find( { millis : { $gt : 5 } } ).pretty()
```

要返回特定时间范围内的信息，请运行类似于以下内容的查询：

```
db.system.profile.find({
  ts : {
    $gt: new ISODate("2012-12-09T03:00:00Z"),
    $lt: new ISODate("2012-12-09T03:40:00Z")
  }
}).pretty()
```

以下示例查看时间范围，`user` 从输出中隐藏该字段以使其更易于阅读，并按每个操作运行所需的时间对结果进行排序：

```
db.system.profile.find({
  ts : {
    $gt: new ISODate("2011-07-12T03:00:00Z"),
    $lt: new ISODate("2011-07-12T03:40:00Z")
  }
}, { user: 0 }).sort( { millis: -1 } )
```

#### 显示最近的五个事件

在启用了分析的数据库上，`show profile`帮助程序[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)显示执行时间至少为 1 毫秒的最近 5 个操作。发出`show profile` 自[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)， 如下：

```
show profile
```

### 分析器（profiler）开销

启用后，分析会对数据库性能产生影响，尤其是在配置了 [分析级别](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/#std-label-database-profiling-level)2，或者当使用低[临界点](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/#std-label-database-profiling-specify-slowms-threshold)分析级别为 1 的值。分析还会消耗磁盘空间，因为它会记录到集合[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile) 和 MongoDB [`logfile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--logpath)。在生产部署上配置和启用探查器之前，请仔细考虑任何性能和安全影响。

#### system.profile 集合

该[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)集合是一个 [上限集合](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-capped-collection)，默认大小为 1 MB。这种大小的集合通常可以存储数千个配置文件文档，但某些应用程序可能会在每个操作中使用或多或少的配置文件数据。如果您需要更改集合的大小 [`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)，请按照以下步骤操作。

#### `system.profile`更改主节点上集合的大小

[要更改主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)上集合的大小，您必须：

1. 禁用分析。
2. 放下[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile) 收藏。
3. 创建一个新[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile) 集合。
4. 重新启用分析。

例如，要创建一个字节 (4 MB)[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)的新集合`4000000`，请使用以下操作序列 [`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
db.setProfilingLevel(0)

db.system.profile.drop()

db.createCollection( "system.profile", { capped: true, size:4000000 } )

db.setProfilingLevel(1)
```

#### 更改`system.profile`辅助节点上集合的大小

[要更改辅助](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)节点上的集合大小，您必须停止辅助节点，将其作为独立运行，然后执行上述步骤。完成后，作为副本集的成员重新启动独立服务器。有关更多信息，请参阅[对副本集成员执行维护](https://www.mongodb.com/docs/manual/tutorial/perform-maintence-on-replica-set-members/)[。](https://www.mongodb.com/docs/manual/tutorial/perform-maintence-on-replica-set-members/)

从版本 4.2 开始，副本集的次要成员现在会记录应用时间超过慢速操作阈值的[oplog 条目。](https://www.mongodb.com/docs/manual/core/replica-set-oplog/#std-label-slow-oplog-application)这些缓慢的 oplog 消息：

* 记录在 中的辅助节点 [`diagnostic log`。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--logpath)
* 被记录在 REPL 组件下，文本为 `applied op: <oplog entry> took <num>ms`。
* 不依赖日志级别（无论是系统级别还是组件级别）
* 不依赖于分析级别。
* 可能会受到 SlowOpSampleRate 的影响，具体取决于您的 MongoDB 版本：
  - 在 MongoDB 4.2 中，这些慢速 oplog 条目不受[`slowOpSampleRate`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate). 无论采样率如何，MongoDB 都会记录所有慢速 oplog 条目。
  - 在 MongoDB 4.4 及更高版本中，这些缓慢的 oplog 条目受到[`slowOpSampleRate`.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpSampleRate)

分析器不会捕获慢的 oplog 条目。



 参见

原文 - [Database Profiler]( https://docs.mongodb.com/manual/tutorial/manage-the-database-profiler/ )

