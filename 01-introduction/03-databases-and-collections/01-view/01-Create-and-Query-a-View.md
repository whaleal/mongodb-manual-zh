# 创建和查询视图

在本页面

[`db.createCollection()` Syntax]()

[`db.createView()` Syntax]()

[`Restrictions`]()

[`Example`]()

[`Behavior`]()



要创建视图，请使用[`db.createCollection()`](https://www.mongodb.com/docs/v6.0/reference/method/db.createCollection/#mongodb-method-db.createCollection) or [`db.createView()`.](https://www.mongodb.com/docs/v6.0/reference/method/db.createView/#mongodb-method-db.createView)

```javascript
/IMPORTANT/
	 视图名称包含在集合列表输出中
    列出集合的操作，例如db.getCollectionInfos()和db.getCollectionNames()，在它们的输出中包含视图。
    视图定义是公共的;例如，db.getCollectionInfos()和视图上的explain操作将包括定义视图的管道。 因此，避免在视图定义中直接引用敏感字段和值。
```



## `db.createCollection()` Syntax

```javascript
db.createCollection(
  "<viewName>",
  {
    "viewOn" : "<source>",
    "pipeline" : [<pipeline>],
    "collation" : { <collation> }
  }
)
```



## `db.createView()` Syntax

```javascript
db.createView(
  "<viewName>",
  "<source>",
  [<pipeline>],
  {
    "collation" : { <collation> }
  }
)
```



## 限制条件

- 您必须在与源集合相同的数据库中创建视图。
-  视图定义管道不能包括 [`$out`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out) or the [`$merge`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge) 阶段。这个限制也适用于嵌入式管道，比如在[`$lookup`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup) 或 [`$facet`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/facet/#mongodb-pipeline-pipe.-facet) 阶段中使用的管道。
- 视图创建后不能重命名。



### 不支持的操作

某些操作在视图中不可用:

- [`db.collection.mapReduce()`.](https://www.mongodb.com/docs/v6.0/reference/method/db.collection.mapReduce/#mongodb-method-db.collection.mapReduce)
- [`$text`](https://www.mongodb.com/docs/v6.0/reference/operator/query/text/#mongodb-query-op.-text) 操作，因为聚合中的`$text`操作仅对第一阶段有效。
- [`$geoNear`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)管道阶段

 有关详细信息，请参见 [Supported Operations for Views.](https://www.mongodb.com/docs/v6.0/core/views/supported-operations/#std-label-views-supported-operations)。



## Example

 这个示例用学生数据填充一个集合，并创建一个视图来查询数据。



### 填充集合

创建一个`students`集合用于这个例子:

```javascript
db.students.insertMany( [
   { sID: 22001, name: "Alex", year: 1, score: 4.0 },
   { sID: 21001, name: "bernie", year: 2, score: 3.7 },
   { sID: 20010, name: "Chris", year: 3, score: 2.5 },
   { sID: 22021, name: "Drew", year: 1, score: 3.2 },
   { sID: 17301, name: "harley", year: 6, score: 3.1 },
   { sID: 21022, name: "Farmer", year: 1, score: 2.2 },
   { sID: 20020, name: "george", year: 3, score: 2.8 },
   { sID: 18020, name: "Harley", year: 5, score: 2.8 },
] )
```



### 使用`db.createView()`创建一个视图

使用 [`db.createView()`](https://www.mongodb.com/docs/v6.0/reference/method/db.createView/#mongodb-method-db.createView) 创建一个仅限于一年级学生的视图:

```javascript
db.createView(
   "firstYears",
   "students",
   [ { $match: { year: 1 } } ]
)
```

在这个例子中:

-  `firstYears`是新视图的名称。
- `students`是以集合为基础的的视图
- [`$match`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 是一个聚合表达式，匹配`studnets`集合中的一年级学生。



#### `Query the View`

下面的例子查询视图:

```javascript
db.firstYears.find({}, { _id: 0 } )
```

 下面的输出只包含了一年级学生的数据。 `{_id: 0}`[`projection`](https://www.mongodb.com/docs/v6.0/reference/method/db.collection.find/#std-label-method-find-projection)抑制输出中的`_id`字段。

```javascript
[
  { sID: 22001, name: 'Alex', year: 1, score: 4 },
  { sID: 22021, name: 'Drew', year: 1, score: 3.2 },
  { sID: 21022, name: 'Farmer', year: 1, score: 2.2 }
]
```

```javascript
/NOTE/
	Projection限制
  	 视图上的Find()操作不支持以下投影操作符:
				$

				$elemMatch

				$slice

				$meta
```



###  使用`db.createCollection()`创建一个视图

  [`db.createCollection()`](https://www.mongodb.com/docs/v6.0/reference/method/db.createCollection/#mongodb-method-db.createCollection) 方法允许创建具有特定选项的集合或视图。

 下面的示例创建一个`graduateStudents`视图。 视图只包含 [`$match`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段选择的文档。 可选的[`collation`](https://www.mongodb.com/docs/v6.0/reference/collation/#std-label-collation) 设置决定排序顺序。

```javascript
db.createCollection(
   "graduateStudents",
   {
      viewOn: "students",
      pipeline: [ { $match: { $expr: { $gt: [ "$year", 4 ] } } } ],
      collation: { locale: "en", caseFirst: "upper" }
   }
)
```

```javascript
/NOTE/
	Collation Behavior
  	 1. 可以在创建视图时为视图指定默认排序规则。如果没有指定排序规则，视图的默认排序规则是“simple”二进制比较排序规则。 也就是说，视图不继承集合的默认排序规则。
     2. 视图上的字符串比较使用视图的默认排序规则。尝试更改或覆盖视图默认排序规则的操作将失败并报错。
     3. 如果从另一个视图创建视图，则不能指定与源视图的排序规则不同的排序规则。
		 4.  如果执行涉及多个视图的聚合，例如$lookup或$graphLookup，视图必须具有相同的排序规则。
```

####  查询视图

下面的示例查询视图。为清楚起见，[`$unset`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/unset/#mongodb-pipeline-pipe.-unset)阶段从输出中删除了`_id`字段。

```javascript
db.graduateStudents.aggregate(
   [
      { $sort: { name: 1 } },
      { $unset: [ "_id" ] }
   ]
)
```

 在对输出进行排序时， [`$sort`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort) 阶段使用排序规则对大写字母在小写字母之前进行排序。

```javascript
[
  { sID: 18020, name: 'Harley', year: 5, score: 2.8 },
  { sID: 17301, name: 'harley', year: 6, score: 3.1 }
]
```



## 行为

下面几节描述了视图创建和查询的行为。



###  聚合优化

 查询视图时:

-  [`db.collection.find()`](https://www.mongodb.com/docs/v6.0/reference/method/db.collection.find/#mongodb-method-db.collection.find) 的Query `filter`, `projection`, `sort`, `skip`, `limit`和其他操作被转换为等效的[aggregation pipeline stages](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation-pipeline/#std-label-aggregation-pipeline-operator-reference)。
-  `MongoDB`将客户端查询附加到底层管道，并将该组合管道的结果返回给客户端。 MongoDB可以对合并管道应用[聚合管道优化](https://www.mongodb.com/docs/v6.0/core/aggregation-pipeline-optimization/)。
-  [聚合管道优化器](https://www.mongodb.com/docs/v6.0/core/aggregation-pipeline-optimization/)重新塑造视图聚合管道阶段，以提高性能。优化不会改变查询结果。



### 资源锁定

[`db.createView()`](https://www.mongodb.com/docs/v6.0/reference/method/db.createView/#mongodb-method-db.createView)  在操作期间获取指定集合或视图上的排他锁。对集合的所有后续操作都必须等待，直到 [`db.createView()`](https://www.mongodb.com/docs/v6.0/reference/method/db.createView/#mongodb-method-db.createView) 释放锁。 [`db.createView()`](https://www.mongodb.com/docs/v6.0/reference/method/db.createView/#mongodb-method-db.createView) 通常在短时间内持有此锁。

 创建视图需要在系统上获得一个额外的排他锁在数据库中的`system.views`集合中。该锁阻止在数据库中创建或修改视图，直到命令执行完成。





原文链接：https://www.mongodb.com/docs/v6.0/core/views/create-view/

译者：杨帅