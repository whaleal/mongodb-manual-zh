# [ ](#)聚合管道限制

[]()

在本页面

*   [结果大小限制](#result-size-restrictions)

*   [Memory 限制](#memory-restrictions)

使用[管道]()命令的聚合操作具有以下限制。

[]()

## <span id="result-size-restrictions">结果大小限制</span>

更改 version 3.6：MongoDB 3.6 删除[管道]()命令的选项，以将其结果作为单个文档返回。

[管道]()命令可以_retret 一个游标或 store 存储集合中的结果。返回游标或将结果存储在集合中时，结果集中的每个文档都受[BSON 文件大小]()限制，目前为 16 兆字节;如果任何单个文档超过[BSON 文件大小]()限制，该命令将产生错误。该限制仅适用于退回的文件;在管道处理期间，文档可能超过此大小。 [db.collection.aggregate()]()方法默认返回游标。  
聚合命令可以返回游标或将结果存储在集合中。 当返回游标或将结果存储在集合中时，结果集中的每个文档都受BSON文档大小限制（当前为16兆字节）； 如果任何单个文档超出BSON文档大小限制，该命令将产生错误。 该限制仅适用于退回的文件； 在管道处理过程中，文档可能会超出此大小。 db.collection.aggregate（）方法返回一个游标。

[]()

[]()

## <span id="memory-restrictions">Memory 限制</span>

更改了 version 2.6.

管道阶段的 RAM 限制为 100 兆字节。如果某个阶段超出此限制，MongoDB 将产生错误。要允许处理大型数据集，请使用`allowDiskUse`选项启用聚合管道阶段以将数据写入临时 files。

聚合管道阶段的RAM限制为100 MiB（100 * 1024 * 1024字节）。 如果阶段超出此限制，则MongoDB将产生错误。 为了处理大型数据集，可以在aggregate（）方法中设置allowDiskUse选项。 allowDiskUse选项使大多数聚合管道操作可以将数据写入临时文件。 以下聚合操作是allowDiskUse选项的例外： 这些操作必须在内存限制限制内：

更改了 version 3.4.

* $ graphLookup阶段 
[$graphLookup]()阶段必须保持在 100 兆字节的 memory 限制内。如果为[aggregate()]()操作指定了`allowDiskUse: true`，[$graphLookup]()阶段将忽略该选项。如果[aggregate()]()操作中还有其他阶段，则`allowDiskUse: true`选项对这些其他阶段有效。  
* $ add阶段中使用的累加器表达式（从版本3.6.17开始）  
* $ group阶段中使用的$ push累加器表达式（从版本3.6.17开始）  

如果管道包含观察到allowDiskUse的其他阶段：true 在aggregate（）操作中，allowDiskUse：true选项在其他阶段有效。  


> **也可以看看**<br />
> [$sort 和 Memory 限制]()和[$group Operator 和 Memory]()。