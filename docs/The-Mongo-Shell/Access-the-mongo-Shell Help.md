##  使用 mongo Shell帮助
**在本页面**

* [命令行帮助](#命令行)
* [shell帮助](#shell)
* [数据库帮助](#数据库)
* [表级别帮助](#收集)
* [游标级别帮助](#光标)
* [包装对象帮助](#包装对象)

除了《 MongoDB中文手册》中的文档外，mongo shell在其“联机”帮助系统中提供了一些其他信息。 本文档概述了访问此帮助信息的过程。  

### <span id="命令行">**命令行帮助**</span>

要查看选项列表和启动`mongo shell`相关的帮助，请从命令行使用`--help`选项：

```shell
mongo --help
```

### <span id="shell">**Shell帮助**</span>

当需要查看帮助列表时，请在`mongo shell`中键入`help` ：

```shell
help
```

### <span id="数据库">**数据库帮助**</span>

在mongo shell中：

当需要查看服务器上的数据库列表，请使用show dbs命令：

```shell
show dbs
```

**`show database`是`show dbs`的别名**  
当需要查看可在db对象上使用的方法的帮助列表，请调用`db.help()`方法：

```shell
db.help()
```

当需要查看在 `shell`中查看某些方法的具体实现，请键入不带括号（（））的`db.<方法名称>`，如以下示例所示，它将返回方法`db.updateUser()`的实现：

```shell
db.updateUser
```

如果部署使用访问控制运行，则该操作将根据用户权限返回不同的值。 有关详细信息，请参见listDatabases行为。

### <span id="收集">**表级别帮助**</span>

在mongo shell中：

要查看当前数据库中的集合列表，请使用show collections命令：

```shell
show collections
```

另可参考：[show collections](https://docs.mongodb.com/manual/release-notes/4.0-compatibility/#compat-show-collections)  要查看收集对象上可用方法的帮助（例如`db.<collection>`），请使用`db.<collection>.help()`方法：

```
db.collection.help()
```

`<collection>`可以是存在的集合的名称，尽管您可以指定不存在的集合。  要查看收集方法的实现，请键入不带括号（（））的`db.<collection>.<method>`名称，如以下示例所示，它将返回`save()`方法的实现：

```shell
db.collection.save
```

### <span id="光标">**游标相关帮助**</span>

在mongo shell中使用`find()`方法执行读取操作时，可以使用各种游标方法来修改`find()`行为，并可以使用各种JavaScript方法来处理从`find()`方法返回的游标。  要列出可用的修饰符和游标处理方法，请使用`db.collection.find().help()`命令：

```shell
db.collection.find().help()
```

`<collection>`可以是存在的集合的名称，尽管您可以指定不存在的集合。  要查看cursor方法的实现，请输入不带括号（（））的`db.<collection>.find().<method>`名称，如以下示例所示，它将返回`toArray()`方法的实现：

```shell
db.collection.find().toArray
```

处理游标的一些有用方法是：  
`·hasNext()`检查光标是否还有更多文档要返回。  
`·next()`返回下一个文档，并将光标位置向前移动一个。  
`·forEach（<function>）`迭代整个光标，并将`<function>`应用于光标返回的每个文档。`<function>`期望一个参数，该参数对应于每次迭代的文档。  有关迭代游标和从游标中检索文档的示例，请参见 [cursor handling](https://docs.mongodb.com/manual/tutorial/iterate-a-cursor/)。有关所有可用的游标方法，另请参见[Cursor](https://docs.mongodb.com/manual/reference/method/#js-query-cursor-methods)。

### <span id="包装对象">**包装对象帮助**</span>

要获取mongo shell中可用的包装器类的列表，例如`BinData()`，请在`mongo shell`中键入`help misc`：

```shell
help misc
```

另可参考：  
[mongo Shell Methods](https://docs.mongodb.com/manual/reference/method/)   