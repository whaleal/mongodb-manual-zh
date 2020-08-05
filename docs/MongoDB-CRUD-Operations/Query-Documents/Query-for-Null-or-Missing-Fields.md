
### Query for Null or Missing Fields（查询空字段或缺少字段）
MongoDB中的不同查询运算符对空值的处理方式不同。<br />该页面提供了使用mongo shell中的[db.collection.find()](https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find)方法查询空值的操作示例。 此页面上的示例使用库存收集。 要填充库存收集，请运行以下命令：

```shell
db.inventory.insertMany([
	{ _id: 1, item: null },
	{ _id: 2 }
])
```

#### **平等过滤器**

**{item：null}**查询匹配包含值是**null**的**item**字段或不包含**item**字段的文档。

```shell
db.inventory.find( { item: null } )
```

该查询返回集合中的两个文档

#### 类型检查

{**item：{$ type：10}**}查询只匹配包含**item**字段值为**null**的文档； 即**item**字段的值为[BSON Type](https://docs.mongodb.com/manual/reference/bson-types/)为**Null**（类型编号10）：

```shell
db.inventory.find( { item : { $type: 10 } } )
```

该查询仅返回item字段值为**null**的文档。<br />

#### **存在检查**

以下示例查询不包含字段的文档。<br />{**item：{$ exists：false}**}查询与不包含**item**字段的文档匹配：

```shell
db.inventory.find( { item : { $exists: false } } )
```

该查询仅返回不包含项目字段的文档。<br />

另请参考：

[$type](#)和[$exists](#)运算符的参考文档。<br />





|                                                              |
| ------------------------------------------------------------ |
| 从MongoDB 4.2开始，用户不能再使用查询过滤器**$type：0**作为**$exists：false**的同义词。 要查询空字段或缺少字段，请参阅查询空字段或缺少字段。 |

