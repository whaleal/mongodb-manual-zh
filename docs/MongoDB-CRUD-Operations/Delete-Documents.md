
## Delete Documents（删除文件）
此页面使用以下mongo shell方法

- [db.collection.deleteMany()](https://docs.mongodb.com/manual/reference/method/db.collection.deleteMany/#db.collection.deleteMany)
- [db.collection.deleteOne()](https://docs.mongodb.com/manual/reference/method/db.collection.deleteOne/#db.collection.deleteOne)

此页面上的示例使用库存收集。 要填充库存收集，请运行以下命令：

```shell
db.inventory.insertMany( [
		{ item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
		{ item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "P" },
		{ item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
		{ item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
		{ item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" },
] );
```

**删除所有文件**<br />要删除集合中的所有文档，请将空的过滤器文档{}传递给`db.collection.deleteMany()`方法。<br />以下示例从清单收集中删除所有文档：

```shell
db.inventory.deleteMany({})
```

该方法返回具有操作状态的文档。 有关更多信息和示例，请参见[deleteMany()](#)。<br />**删除所有符合条件的文档**<br />您可以指定标准或过滤器，以标识要删除的文档。 筛选器使用与读取操作相同的语法。<br />要指定相等条件，请在查询过滤器文档中使用**<`field`>**：**<`value`>**表达式：

```java 
{ <field1>: <value1>,...}
```

查询过滤器文档可以使用查询运算符以以下形式指定条件：

```java
{ <field1>: { <operator1>: <value1> }, ... }
```

要删除所有符合删除条件的文档，请将过滤器参数传递给[deleteMany()](#)方法。<br />以下示例从状态字段等于**“ A”**的清单集合中删除所有文档：

```shell
db.inventory.deleteMany({ status : "A" })
```

该方法返回具有操作状态的文档。 有关更多信息和示例，请参见[deleteMany()](#)。

**仅删除一个符合条件的文档**

要删除最多一个与指定过滤器匹配的文档（即使多个文档可以与指定过滤器匹配），请使用`db.collection.deleteOne()`方法。<br />下面的示例删除状态为**“ D”**的第一个文档：

```shell
db.inventory.deleteOne( { status: "D" } )
```

**删除行为**<br />**指标**<br />即使从集合中删除所有文档，删除操作也不会删除索引。<br />**原子性**<br />MongoDB中的所有写操作都是单个文档级别的原子操作。 有关MongoDB和原子性的更多信息，请参见原子性和事务（[Atomicity and Transactions](https://docs.mongodb.com/manual/core/write-operations-atomicity/)）。<br />**写确认书**<br />对于写入问题，您可以指定从MongoDB请求的写入操作的确认级别。 有关详细信息，请参见写关注（ [Write Concern](https://docs.mongodb.com/manual/reference/write-concern/)）。<br />另请参考：

- [db.collection.deleteMany()](https://docs.mongodb.com/manual/reference/method/db.collection.deleteMany/#db.collection.deleteMany)
- [db.collection.deleteOne()](https://docs.mongodb.com/manual/reference/method/db.collection.deleteOne/#db.collection.deleteOne)
- [Additional Methods](https://docs.mongodb.com/manual/reference/delete-methods/#additional-deletes)