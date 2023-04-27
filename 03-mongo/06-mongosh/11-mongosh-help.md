# mongosh帮助

本文档概述了 [`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

> 提示：
>
> 在 中访问帮助时`mongosh`，您可以交替使用`.help()`和 `.help`语法。

## 命令行帮助

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)要查看用于运行可执行文件和连接到部署的选项，请使用[`--help`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--help) 命令行中的选项：

```
mongosh --help
```

## `mongosh`shell 帮助

要查看控制台中可用的命令列表[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，请`help`在正在运行的[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)控制台中键入：

```
help
```

## 数据库帮助

您可以从控制台内部查看数据库级别的信息 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)：

默认情况下[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)在提示中显示当前数据库。您还可以通过运行命令查看当前数据库`db`：

```
db
```

### 显示可用数据库

要查看服务器上可用的数据库列表，请使用以下 `show dbs`命令：

```
show dbs
```

`show databases`是 的别名`show dbs`。

> 提示：
>
> 数据库列表将根据您的访问权限而改变。有关查看数据库的访问限制的详细信息，请参阅[`listDatabases`.](https://www.mongodb.com/docs/manual/reference/command/listDatabases/#mongodb-dbcommand-dbcmd.listDatabases)

### 显示数据库方法

查看列表[数据库方法](https://www.mongodb.com/docs/manual/reference/method/js-database/)你可以在`db`对象上使用，运行 [`db.help()`:](https://www.mongodb.com/docs/manual/reference/method/db.help/#mongodb-method-db.help)

```
db.help()
```

输出类似于以下缩写列表：

```
Database Class:
  getMongo                      Returns the current database connection
  getName                       Returns the name of the DB
  getCollectionNames            Returns an array containing the names of all collections in the current database.
  getCollectionInfos            Returns an array of documents with collection information, i.e. collection name and options, for the current database.
  runCommand                    Runs an arbitrary command on the database.
  adminCommand                  Runs an arbitrary command against the admin database.
  ...

```

### 显示特定数据库方法的帮助

要在 中查看特定数据库方法的帮助`mongosh`，请键入 `db.<method name>`，然后键入`.help`或`.help()`。以下示例返回帮助[`db.adminCommand()`](https://www.mongodb.com/docs/manual/reference/method/db.adminCommand/#mongodb-method-db.adminCommand) 方法：

```
db.adminCommand.help()
```

输出类似于以下内容：

```
db.adminCommand({ serverStatus: 1 }):
  Runs an arbitrary command against the admin database.
  For more information on usage: https://www.mongodb.com/docs/manual/reference/method/db.adminCommand

```

### 显示数据库方法的其他使用详细信息

要查看 中数据库方法的其他使用详细信息`mongosh`，请键入`db.<method name>`不带括号 ( `()`) 的。以下示例返回有关的详细信息 [`db.adminCommand()`](https://www.mongodb.com/docs/manual/reference/method/db.adminCommand/#mongodb-method-db.adminCommand)方法：

```
db.adminCommand
```

输出类似于以下内容：

```
[Function: adminCommand] AsyncFunction {
  apiVersions: [ 1, Infinity ],
  serverVersions: [ '3.4.0', '999.999.999' ],
  returnsPromise: true,
  topologies: [ 'ReplSet', 'Sharded', 'LoadBalanced', 'Standalone' ],
  returnType: { type: 'unknown', attributes: {} },
  deprecated: false,
  platforms: [ 0, 1, 2 ],
  isDirectShellCommand: false,
  acceptsRawInput: false,
  shellCommandCompleter: undefined,
  help: [Function (anonymous)] Help
}
```

## 收款帮助

您可以从控制台内部查看集合级别信息 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。

这些帮助方法接受集合名称，`<collection>`但您也可以使用通用术语“集合”，甚至可以使用不存在的集合。

### 列出当前数据库中的集合

要查看当前数据库中的集合列表，请使用以下 `show collections`命令：

```
show collections
```

输出`show collections`指示集合是否是 [时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries-collections/#std-label-manual-timeseries-collection)或只读[查看。](https://www.mongodb.com/docs/manual/core/views/#std-label-views-landing-page)

```
managementFeedback          [view]
survey
weather                     [time-series]
system.buckets.weather
system.views
```

在前面的示例中：

- `managementFeedback`是一个[看法](https://www.mongodb.com/docs/manual/core/views/#std-label-views-landing-page)
- `weather`是一个时间序列
- `survey`是一个集合
- `system.buckets.weather`是系统生成的集合，支持`weather`时间序列
- `system.views`是一个系统生成的集合，支持对其他集合的视图

### 显示收集方法

要查看集合对象上可用的方法列表，请使用以下 `db.<collection>.help()`方法：

```
db.collection.help()
```

`<collection>`可以是现有或不存在的集合的名称。

输出类似于以下缩写列表：

```
Collection Class:
  aggregate          Calculates aggregate values for the data in a collection or a view.
  bulkWrite          Performs multiple write operations with controls for order of execution.
  count              Returns the count of documents that would match a find() query for the collection or view.
  countDocuments     Returns the count of documents that match the query for a collection or view.
  deleteMany         Removes all documents that match the filter from a collection.
  deleteOne          Removes a single document from a collection.
  ...
```

### 显示特定收集方法的帮助

要在 中查看特定收集方法的帮助`mongosh`，请使用 `db.<collection>.<method name>`，然后使用`.help`或 `.help()`。

以下示例显示帮助[`db.collection.insertOne()`:](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)

```
db.collection.insertOne.help()
```

输出类似于以下内容：

```
db.collection.insertOne(document, options):
Inserts a document into a collection.
For more information on usage: https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne
```

### 显示收集方法的其他详细信息

要查看集合方法的其他详细信息，请键入方法名称， `db.<collection>.<method>`不带括号 ( `()`)。

以下示例返回有关的详细信息 [`insertOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)方法：

```
db.collection.insertOne
```

输出类似于以下内容：

```
[Function: insertOne] AsyncFunction {
  apiVersions: [ 1, Infinity ],
  serverVersions: [ '3.2.0', '999.999.999' ],
  returnsPromise: true,
  topologies: [ 'ReplSet', 'Sharded', 'LoadBalanced', 'Standalone' ],
  returnType: { type: 'unknown', attributes: {} },
  deprecated: false,
  platforms: [ 0, 1, 2 ],
  isDirectShellCommand: false,
  acceptsRawInput: false,
  shellCommandCompleter: undefined,
  help: [Function (anonymous)] Help
}
```

## 游标帮助

修改[读取操作](https://www.mongodb.com/docs/manual/tutorial/query-documents/#std-label-read-operations-queries)那个用 [`find()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find), 使用[游标方法。](https://www.mongodb.com/docs/mongodb-shell/reference/methods/#std-label-mongosh-cursor-methods)

要列出可用的修饰符和游标处理方法，请使用以下 `db.collection.find().help()`命令：

```
db.collection.find().help()
```

此帮助调用接受集合名称，`<collection>`但您也可以使用通用术语“集合”，甚至可以使用不存在的集合。

处理游标的一些有用方法是：

- [`hasNext()`](https://www.mongodb.com/docs/manual/reference/method/cursor.hasNext/#mongodb-method-cursor.hasNext)检查游标是否有更多文档。
- [`next()`](https://www.mongodb.com/docs/manual/reference/method/cursor.next/#mongodb-method-cursor.next)返回下一个文档并将光标位置向前移动一个。
- [`forEach()`](https://www.mongodb.com/docs/manual/reference/method/cursor.forEach/#mongodb-method-cursor.forEach) 将 应用于 `<function>`游标返回的每个文档。

有关可用游标方法的列表，请参见[光标。](https://www.mongodb.com/docs/manual/reference/method/#std-label-js-query-cursor-methods)

## BSON 类帮助

`mongosh`提供帮助方法[BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON)类。帮助方法提供了 BSON 类的简要概述和包含更多信息的链接。

要访问 BSON 类的帮助，请`.help()`在类名或类的实例化实例上运行：

```
<BSON class>.help()
// or
<BSON class>().help()
```

例如，要查看`ObjectId`BSON 类的帮助，请运行以下命令之一：

```
ObjectId.help()
```

```
ObjectId().help()
```

`mongosh`两种方法返回相同的输出`.help()`：

```
The ObjectId BSON Class:
For more information on usage: https://mongodb.github.io/node-mongodb-native/3.6/api/ObjectID.html
```

`mongosh`为以下 BSON 类提供帮助方法：

- `BinData`
- `Code`
- `DBRef`
- `MinKey`
- `MaxKey`
- `NumberDecimal`
- `NumberInt`
- `NumberLong`
- `ObjectId`
- `Symbol` *（已弃用）*
- `Timestamp`

## 命令助手

`mongosh`提供以下方法和命令来包装某些数据库命令并获取有关您的部署的信息：

| 帮助方法和命令           | 描述                                                         |
| :----------------------- | :----------------------------------------------------------- |
| `db.help()`              | 显示数据库方法的帮助。                                       |
| `db.<collection>.help()` | 显示有关收集方法的帮助。可以`<collection>`是现有集合或不存在的集合的名称。 |
| `help`                   | 显示帮助。                                                   |
| `show collections`       | 显示当前数据库的所有集合的列表。                             |
| `show dbs`               | 显示服务器上所有数据库的列表。  `show dbs`与 同义`show databases`。 |
| `show log <name>`        | 显示内存中指定记录器名称的最后一段日志。如果您不指定 a `<name>`，则命令默认为`global`。要显示`startupWarning`日志，     请运行：`show log startupWarnings` |
| `show logs`              | 显示可访问的记录器名称。请参阅[检索 Shell 日志。](https://www.mongodb.com/docs/mongodb-shell/logs/) |
| `show profile`           | 显示耗时 1 毫秒或更长时间的五个最近操作。请参阅有关的文档 [数据库分析器](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/)了解更多信息。 |
| `show roles`             | 显示当前数据库的所有角色的列表，包括用户定义的和内置的。     |
| `show tables`            | 显示当前数据库中的集合列表。看`show collections`。           |
| `show users`             | 显示当前数据库的用户列表。                                   |









翻译：韩鹏帅

原文：[mongosh Help](https://www.mongodb.com/docs/mongodb-shell/reference/access-mdb-shell-help/)