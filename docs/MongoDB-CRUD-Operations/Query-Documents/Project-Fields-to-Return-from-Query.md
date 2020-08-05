### Project Fields to Return from Query（从查询返回的项目字段）
默认情况下，MongoDB中的查询返回匹配文档中的所有字段。 要限制MongoDB发送给应用程序的数据量，可以包含一个投影文档以指定或限制要返回的字段。<br />本页提供使用mongo shell中的[db.collection.find()](https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find)方法进行投影的查询操作示例。 此页面上的示例使用库存收集。 要填充库存收集，请运行以下命令：<br />

```shell
db.inventory.insertMany( [ 
	{ item: "journal", status: "A", size: { h: 14, w: 21, uom: "cm" }, instock: [ { warehouse: "A", qty: 5 } ] },
	{ item: "notebook", status: "A",  size: { h: 8.5, w: 11, uom: "in" }, instock: [ { warehouse: "C", qty: 5 } ] },
	{ item: "paper", status: "D", size: { h: 8.5, w: 11, uom: "in" }, instock: [ { warehouse: "A", qty: 60 } ] },
	{ item: "planner", status: "D", size: { h: 22.85, w: 30, uom: "cm" }, instock: [ { warehouse: "A", qty: 40 } ] },
	{ item: "postcard", status: "A", size: { h: 10, w: 15.25, uom: "cm" }, instock: [ { warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 } ] }
]);
```

#### **返回匹配文档中的所有字段**

如果未指定投影文档，则`db.collection.find()`方法将返回匹配文档中的所有字段。<br />以下示例返回状态为**“ A”**的清单集合中所有文档的所有字段：

```shell
db.inventory.find( { status: "A" } )
```

该操作对应于以下SQL语句：

```sql
SELECT * from inventory WHERE status = "A"
```

#### **仅返回指定的字段和_id字段**

通过将投影文档中的**<`field`>**设置为1，投影可以显式包括多个字段。 以下操作返回与查询匹配的所有文档。 在结果集中，只有项，状态以及默认情况下_id字段会返回到匹配的文档中。_

```shell
db.inventory.find( { status: "A" }, { item: 1, status: 1 } )
```

该操作对应于以下SQL语句：

```sql
SELECT _id, item, status from inventory WHERE status = "A"
```

> **注意**<br />除**_id**字段外，您无法在投影文档中合并包含和排除语句.

#### 返回除了被排除的字段之外的所有字段

您可以使用投影排除特定字段，而不是列出要在匹配文档中返回的字段。 以下示例返回匹配文档中状态和库存字段以外的所有字段：

```shell
db.inventory.find( { status: "A" }, { status: 0, instock: 0 } )
```

> 注意**<br />**除**_id**字段外，您无法在投影文档中合并包含和排除语句。

#### 返回嵌入式文档中的特定字段

您可以返回嵌入式文档中的特定字段。 使用点表示法引用嵌入式字段，并在投影文档中将其设置为1。<br />以下示例返回：

* _id字段(默认情况下返回).

* 项目字段.

* 状态字段.

* 大小文档中的uom字段.

<br />uom字段仍嵌入在尺寸文档中

```shell
db.inventory.find(
  { status: "A" },
  { item: 1, status: 1, "size.uom": 1 }
 )
```

#### **禁止嵌入文档中的特定字段**

您可以隐藏嵌入式文档中的特定字段。 使用点表示法引用投影文档中的嵌入字段并将其设置为0。<br />以下示例指定一个投影，以排除尺寸文档内的**uom**字段。 其他所有字段均在匹配的文档中返回：

  ```shell
 db.inventory.find( 
  	{ status: "A" },
  	{ "size.uom": 0 }
 )
  ```

 #### **阵列中嵌入式文档的投影**

使用点表示法可将特定字段投影在嵌入数组的文档中。<br />以下示例指定要返回的投影：

  * _id字段（默认情况下返回）

  * 项目字段

  * 状态字段

  * 库存数组中嵌入的文档中的数量字段

 ```shell
 db.inventory.find( { status: "A" }, { item: 1, status: 1, "instock.qty": 1 } )
 ```

#### **返回数组中的项目特定数组元素**

 对于包含数组的字段，MongoDB提供以下用于操纵数组的投影运算符:[$ elemMatch](#)，[$slice](#)和[$](#)。<br />以下示例使用[$slice](#)投影运算符返回库存数组中的最后一个元素：

 ```shell
db.inventory.find( { status: "A" }, { item: 1, status: 1, instock: { $slice: -1 } } )
 ```

[$ elemMatch](#) ，[$slice](#)和[$](#)是投影要包含在返回数组中的特定元素的唯一方法。 例如，您不能使用数组索引来投影特定的数组元素。 例如 {**“ instock.0”：1**}投影不会投影第一个元素的数组。<br />

 另请参考：

 [Query Documents](https://docs.mongodb.com/manual/tutorial/query-documents/)
    <a name="NsIgg"></a>