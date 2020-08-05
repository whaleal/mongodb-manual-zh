
### Iterate a Cursor in the mongo Shell（在mongo Shell中迭代游标）
在本页面<br />

* [手动迭代游标](#游标)

* [迭代器索引](#索引)

* [游标行为](#行为)

* [游标信息](#信息)

[db.collection.find()](https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find)方法返回一个游标。 要访问文档，您需要迭代游标。 但是，在mongo shell中，如果未使用**var**关键字将返回的游标分配给变量，则该游标将自动迭代多达20次，以打印结果中的前20个文档。<br />以下示例描述了手动迭代游标以访问文档或使用迭代器索引的方法。
 #### <span id="游标">**手动迭代游标**</span>

在mongo shell中，当使用**var**关键字将`find()`方法返回的游标分配给变量时，游标不会自动进行迭代。<br />您可以在外壳程序中调用cursor变量以进行多达20次迭代并打印匹配的文档，如以下示例所示：

  ```shell
 var myCursor = db.users.find( { type: 2 } );
 myCursor
  ```

 您还可以使用游标方法`next()`来访问文档，如以下示例所示：

```shell
var myCursor = db.users.find( { type: 2 } );
  
 while (myCursor.hasNext())   
  printjson(myCursor.next());
 }
```

作为一种替代的打印操作，请考虑使用`printjson()`辅助方法替换`print(tojson())`：

```shell
var myCursor =  db.users.find( { type: 2 } );
myCursor.forEach(printjson);
```

有关游标方法的更多信息，请参见JavaScript游标方法和驱动程序文档([JavaScript cursor methods](https://docs.mongodb.com/manual/reference/method/#js-query-cursor-methods) )。<br />

您可以使用DBQuery.shellBatchSize更改默认值20的迭代数。有关更多信息，请参见使用mongo Shell（[Working with the mongo Shell](https://docs.mongodb.com/manual/mongo/#mongo-shell-executing-queries)）

#### <span id="索引">**迭代器索引**</span>

在mongo shell中，可以使用`toArray()`方法来迭代游标并以数组形式返回文档，如下所示：

```shell
var myCursor = db.inventory.find( { type: 2 } );
var documentArray = myCursor.toArray();
var myDocument = documentArray[3];
```

`toArray()`方法将光标返回的所有文档加载到RAM中；` toArray()`方法耗尽光标。<br />另外，某些驱动程序通过使用光标上的索引（即**cursor [index]**）来提供对文档的访问。 这是先调用`toArray()`方法，然后在结果数组上使用索引的快捷方式。<br />考虑以下示例：

```shell
var myCursor = db.users.find( { type: 2 } );
var myDocument = myCursor[1];
```

**myCursor [1]**等效于以下示例：

```shell
 myCursor.toArray() [1];
```

  

#### <span id="行为">**游标行为**</span>

**关闭非活动游标**<br />默认情况下，服务器将在闲置10分钟后或客户端用尽光标后自动关闭光标。 要在mongo shell中覆盖此行为，可以使用[cursor.noCursorTimeout()](https://docs.mongodb.com/manual/reference/method/cursor.noCursorTimeout/#cursor.noCursorTimeout)方法：

```shell
var myCursor = db.users.find().noCursorTimeout();
```

设置**noCursorTimeout**选项后，您必须使用`cursor.close()`手动关闭游标，或者用尽游标的结果。<br />有关设置**noCursorTimeout**选项的信息，请参见驱动程序文档。<br />**光标隔离**<br />当游标返回文档时，其他操作可能会与查询交错。<br />**光标批次**<br />MongoDB服务器批量返回查询结果。批处理中的数据量不会超过BSON文档的最大大小。若要覆盖批处理的默认大小，请参见`batchSize()`和`limit()`。<br />3.4版中的新增功能：`find()`，`aggregate()`，`listIndexes`和`listCollections`类型的操作每批返回最多16 MB。 `batchSize()`可以强制使用较小的限制，但不能强制使用较大的限制。<br />默认情况下，`find()`和`aggregate()`操作的初始批处理大小为101个文档。随后针对结果游标发出的getMore操作没有默认的批处理大小，因此它们仅受16 MB消息大小的限制。<br />对于包含不带索引的排序操作的查询，服务器必须在返回任何结果之前将所有文档加载到内存中以执行排序。<br /> <br />当您遍历游标并到达返回批处理的末尾时，如果还有更多结果，`cursor.next()`将执行getMore操作以检索下一个批处理。要查看在迭代游标时批处理中剩余多少文档，可以使用`objsLeftInBatch()`方法，如以下示例所示：<br />

```sql
var myCursor = db.inventory.find();
var myFirstDocument = myCursor.hasNext() ? myCursor.next() : null;
myCursor.objsLeftInBatch();
```

  

#### <span id= "信息">游标信息</span>

  `	db.serverStatus()`方法返回包含度量标准字段的文档。 指标字段包含一个带有以下信息的**metrics.cursor**字段：

  * 自上次服务器重新启动以来超时的游标数

  * 设置了选项**DBQuery.Option.noTimeout**的打开游标的数量，以防止一段时间不活动后发生超时

  * “固定”打开游标的数量

  * 打开的游标总数

    <br />

考虑以下示例，该示例调用`db.serverStatus()`方法并从结果中访问指标字段，然后从指标字段访问游标字段：

```shell
 db.serverStatus().metrics.cursor
```

 结果是以下文档：

 ```shell
 {  
 	"timedOut" : <number>
   "open" : { 
  	"noTimeout" : <number>,
   "pinned" : <number>,
    "total" : <number>
  	}
  }
 ```

另可参考：[db.serverStatus()](https://docs.mongodb.com/manual/reference/method/db.serverStatus/#db.serverStatus)
    <a name="Js5r3"></a>