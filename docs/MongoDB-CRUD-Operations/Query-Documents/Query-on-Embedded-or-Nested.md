
### Query on Embedded/Nested(查询嵌入/嵌套文档)
本页提供使用mongo shell中的[db.collection.find()](https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find)方法对嵌入式/嵌套文档进行查询操作的示例。 此页面上的示例使用库存收集。 要填充库存收集，请运行以下命令：

```shell
db.inventory.insertMany( [
	{ item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
	{ item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A" },
	{ item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
	{ item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
	{ item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" }
]);
```

#### **匹配嵌入/嵌套文档**

要在作为嵌入/嵌套文档的字段上指定相等条件，请使用查询过滤器文档**{<`field`>：<`value`>}**，其中**<`value`>**是要匹配的文档。<br />例如，以下查询选择字段大小等于文档**{h：14，w：21，uom：“ cm”}**的所有文档：

```shell
db.inventory.find( { size: { h: 14, w: 21, uom: "cm" } } )
```

整个嵌入式文档上的相等匹配要求与指定的**<`value`>**文档完全匹配，包括字段顺序。 例如，以下查询与库存集中的任何文档都不匹配：

```shell
db.inventory.find(  { size: { w: 21, h: 14, uom: "cm" } }  )
```

#### **查询嵌套字段**

要在嵌入式/嵌套文档中的字段上指定查询条件，请使用点符号（**“ field.nestedField”**）。

> **注意**
>
> **使用点符号查询时，字段和嵌套字段必须在引号内。**<br />

**在嵌套字段上指定相等匹配**<br />以下示例选择嵌套在**size**字段中的**uom**字段等于**“ in”**的所有文档：

```shell
db.inventory.find( { "size.uom": "in" } )
```

**使用查询运算符指定匹配**<br />查询过滤器文档可以使用查询运算符以以下形式指定条件：

```shell
{ <field1>: { <operator1>: <value1> }, ... }
```

以下查询在size字段中嵌入的字段h上使用小于运算符（[$lt](#)）：

```shell
db.inventory.find( { "size.h": { $lt: 15 } } )
```

**指定AND条件**<br />以下查询选择嵌套字段**h**小于**15**，嵌套字段**uom**等于**“ in”**，状态字段等于**“ D”**的所有文档：

```shell
db.inventory.find( { "size.h": { $lt: 15 }, "size.uom": "in", status: "D" } )
```



#### **附加查询教程**

有关其他查询示例，请参见：

- [Query Documents](https://docs.mongodb.com/manual/tutorial/query-documents/)
- [Query an Array](https://docs.mongodb.com/manual/tutorial/query-arrays/)
- [Query an Array of Embedded Documents](https://docs.mongodb.com/manual/tutorial/query-array-of-documents/)
<a name="YYjR5"></a>