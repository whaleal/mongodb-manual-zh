## Query Documents（查询文件）
该页面提供了在mongo shell中使用[db.collection.find()](https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find)方法进行查询操作的示例。 此页面上的示例使用库存收集。 要填充库存收集，请运行以下命令：<br />

```shell
db.inventory.insertMany([<br /> 
{ item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },<br />  
{ item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A" },<br /> 
{ item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },<br /> 
{ item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },<br />  
{ item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" }<br />
]);<br />
```

#### 选择集合中的所有文档

要选择集合中的所有文档，请将空文档作为查询过滤器参数传递给**find**方法。 查询过滤器参数确定选择条件：

```shell
db.inventory.find( {} )
```

此操作对应于以下SQL语句：<br />

```sql
SELECT * FROM inventory
```

有关该方法的语法的更多信息，请参见[find()](https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find)。

#### 指定平等条件

要指定相等条件，请在查询过滤器文档中（[query filter document](https://docs.mongodb.com/manual/core/document/#document-query-filter)）使用**<`field`>：<`value`>**表达式：

```shell
{ <field1>: <value1>, ... }
```

下面的示例从inventory中选择状态等于**" D"**的所有文档：

```shell
db.inventory.find( { status: "D" } )
```

此操作对应于以下SQL语句：

```sql
SELECT * FROM inventory WHERE status = "D"
```

#### 使用查询运算符指定条件

查询过滤器文档可以使用查询运算符以以下形式指定条件：

```shell
{ <field1>: { <operator1>: <value1> }, ... }
```

下面的示例从状态为**" A"**或**" D"**等于"库存"的inventory中检索所有文档：

```shell
db.inventory.find( { status: { $in: [ "A", "D" ] } } )
```

> **注意**<br />**使用比较运算符的查询会受到"类型括弧"的影响。**<br />

```shell
db.inventory.find( {
		 status: "A",
	 	$or: [ { qty: { $lt: 30 } }, { item: /^p/ } ]
} )
```

该操作对应于以下SQL语句：<br />

```sql
SELECT * FROM inventory WHERE status = "A" AND ( qty < 30 OR item LIKE "p%")
```

> **注意**<br />**MongoDB支持正则表达式$ regex查询以执行字符串模式匹配。**<br />

#### 附加查询教程<br />

有关其他查询示例，请参见：

- [Query on Embedded/Nested Documents](https://docs.mongodb.com/manual/tutorial/query-embedded-documents/)
- [Query an Array](https://docs.mongodb.com/manual/tutorial/query-arrays/)
- [Query an Array of Embedded Documents](https://docs.mongodb.com/manual/tutorial/query-array-of-documents/)
- [Project Fields to Return from Query](https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/)
- [Query for Null or Missing Fields](https://docs.mongodb.com/manual/tutorial/query-for-null-fields/)

####行为

**光标**<br />[db.collection.find()](https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find)方法将光标返回到匹配的文档。<br />

**读取隔离**<br />

*3.2版中的新功能*<br />对于对副本集和副本集分片的读取，读取关注允许客户端为其读取选择隔离级别。 有关更多信息，请参见阅读关注。

#### 附加方法

以下方法也可以从集合中读取文档：

- [db.collection.findOne](https://docs.mongodb.com/manual/reference/method/db.collection.findOne/#db.collection.findOne)
- In [aggregation pipeline](https://docs.mongodb.com/manual/core/aggregation-pipeline/), the [$match](https://docs.mongodb.com/manual/reference/operator/aggregation/match/#pipe._S_match) pipeline stage provides access to MongoDB queries.( 在聚合管道中，$ match管道步骤提供对MongoDB查询的访问。)

> **注意**<br />**[db.collection.findOne()](https://docs.mongodb.com/manual/reference/method/db.collection.findOne/#db.collection.findOne)方法还执行读取操作以返回单个文档。 在内部，db.collection.findOne()方法是db.collection.find()方法，其限制为1。**
> <a name="deLTM"></a>

