#  文档

在本页面

- [文档结构](https://docs.mongodb.com/v4.2/core/document/document-structure)
- [点符号](https://docs.mongodb.com/v4.2/core/document/dot-notation)
- [文档限制](https://docs.mongodb.com/v4.2/core/document/document-limitations)
- [文档结构的其他用途](https://docs.mongodb.com/v4.2/core/document/other-uses-of-the-document-structure)
- [更多阅读](https://docs.mongodb.com/v4.2/core/document/further-reading)

MongoDB将数据记录存储为BSON文档。BSON是[JSON](https://docs.mongodb.com/v4.2/reference/glossary/term-json)文档的二进制表示[形式](https://docs.mongodb.com/v4.2/reference/glossary/term-json)，尽管它包含比JSON更多的数据类型。有关BSON规范，请参见[bsonspec.org](http://bsonspec.org/)。另请参阅[BSON类型](https://docs.mongodb.com/v4.2/reference/bson-types/)。

![A MongoDB document.](https://docs.mongodb.com/v4.2/_images/crud-annotated-document.bakedsvg.svg)



##  文档结构

 MongoDB文档由字段和值对组成，结构如下:

```javascript
{
   field1: value1,
   field2: value2,
   field3: value3,
   ...
   fieldN: valueN
}
```

字段的值可以是任何BSON [数据类型](https://docs.mongodb.com/v4.2/reference/bson-types/)，包括其他文档，数组和文档数组。例如，以下文档包含各种类型的值：

```javascript
var mydoc = {
               _id: ObjectId("5099803df3f4948bd2f98391"),
               name: { first: "Alan", last: "Turing" },
               birth: new Date('Jun 23, 1912'),
               death: new Date('Jun 07, 1954'),
               contribs: [ "Turing machine", "Turing test", "Turingery" ],
               views : NumberLong(1250000)
            }
```

 上述字段的数据类型如下:

- `_id`拥有一个[`ObjectId`](https://docs.mongodb.com/v4.2/reference/bson-types/objectid)。

- `name`包含一个包含字段`first`和`last`的*嵌入式文档*。

- `birth`和`death`保留*`Date`*类型的值。

- `contribs`拥有字符串数组。

- `views`拥有`NumberLong`类型的值。

###  字段名称

字段名称是字符串。

[文档](https://docs.mongodb.com/v4.2/core/document/)对字段名称有以下限制：

- 字段名称`_id`保留作主键使用;它的值在集合中必须是唯一的，是不可变的，并且可以是数组以外的任何类型。如果`_id`包含子字段，子字段名不能以(`$`)符号开头。
- 字段名称**不能**包含`null`字符。
- 服务器允许存储包含点（即`.`）和美元符号（即 `$`）的字段名称。
-  `MongodB 5.0`增加了在字段名中使用(`$`)和(`.`)的改进支持。有一些限制。有关详细信息，请参阅[Field Name Considerations](https://www.mongodb.com/docs/v6.0/core/dot-dollar-considerations/#std-label-crud-concepts-dot-dollar-considerations)。

`BSON`文档可能有多个相同名称的字段，但是,大多数[MongoDB interfaces](https://www.mongodb.com/docs/drivers/)，不支持重复字段名的结构(例如`hash`表)来表示`MongoDB`。 如果需要操作具有多个同名字段的文档，请参见[driver documentation](https://www.mongodb.com/docs/drivers/) .

由`MongoDB`内部进程创建的一些文档可能有重复的字段，但没有`MongoDB`进程会向现有的用户文档添加重复的字段。

###  字段值限制

 `MongoDB 2.6`到`MongoDB`版本的[featureCompatibilityVersion](https://www.mongodb.com/docs/v6.0/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv) (`fCV`)设置为“`4.0`”或更早版本

对于[索引集合](https://www.mongodb.com/docs/v6.0/indexes/)，索引字段的值具有[最大索引键长度](https://www.mongodb.com/docs/v6.0/reference/limits/#mongodb-limit-Index-Key-Limit)。有关详细信息，请参阅 [最大索引键长度](https://www.mongodb.com/docs/v6.0/reference/limits/#mongodb-limit-Index-Key-Limit)。



## 点符号

MongoDB使用点符号来访问数组的元素和访问嵌入文档的字段。

### 数组

要通过从零开始的索引位置指定或访问数组中的元素，请将数组名称与点(`.`)和从零开始的索引位置连接起来，并将引号括起来:

```
"<array>.<index>"
```

例如，给定文档中的以下字段:

```javascript
{
   ...
   contribs: [ "Turing machine", "Turing test", "Turingery" ],
   ...
}
```

 要指定`contribs`数组中的第三个元素，请使用点符号"`contribs.2`"。

查询数组的示例请参见:

- [Query an Array](https://www.mongodb.com/docs/v6.0/tutorial/query-arrays/)
- [Query an Array of Embedded Documents](https://www.mongodb.com/docs/v6.0/tutorial/query-array-of-documents/)

```javascript
Tip:
	参见：
		 1. $[]所有用于更新操作的位置运算符
		 2. $[<identifier>] 用于更新操作的过滤位置运算符
		 3. $  用于更新操作的位置运算符
     4. $  当数组下标位置未知时的投影运算符
     5. `Query an Array` 对于带有数组的点符号的例子
```

### 嵌入式文档

要使用点符号指定或访问嵌入文档的字段，将嵌入的文档名称与点(`.`)和字段名称连接起来，并用引号括起来:

```
"<embedded document>.<field>"
```

 例如，给定文档中的以下字段:

```javascript
{
   ...
   name: { first: "Alan", last: "Turing" },
   contact: { phone: { type: "cell", number: "111-222-3333" } },
   ...
}
```

- 要指定在字段中命名`last`的`name`字段，请使用点符号`"name.last"`。
- 要在字段`number`中的`phone`文档中 指定`contact`，请使用点号`"contact.phone.number"`。

有关查询嵌入式文档的示例，请参见:

- [Query on Embedded/Nested Documents](https://www.mongodb.com/docs/v6.0/tutorial/query-embedded-documents/)
- [Query an Array of Embedded Documents](https://www.mongodb.com/docs/v6.0/tutorial/query-array-of-documents/)

##  

## 文档的限制

文档有以下属性:

### 文档大小限制

 最大`BSON`文档大小为`16`兆字节(MB)。

最大文档大小有助于确保单个文档不会使用过多的RAM或在传输过程中使用过多的带宽。为了存储大于最大大小的文档，`MongoDB`提供了`GridFS API`。查看[`mongofiles`](https://www.mongodb.com/docs/database-tools/mongofiles/#mongodb-binary-bin.mongofiles)和你的[driver](https://www.mongodb.com/docs/drivers/)文档了解有关`GridFS`的更多信息。



### 文档字段顺序

与`JavaScript`对象不同，`BSON`文档中的字段是有序的。

#### 查询中的字段顺序

对于查询，字段顺序行为如下:

- 在比较文档时，字段顺序非常重要。例如，当在查询文档中比较字段`a`和`b`时:
  - ·`{a: 1, b: 1}` 等于 `{a: 1, b: 1}`
  - {a: 1, b: 1}` 不等于 `{b: 1, a: 1}`

- 为了有效地执行查询，查询引擎可以在查询处理期间对字段重新排序。在其他情况下，当处理这些投影运算符时，可能会发生重新排序字段:[`$project`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project), [`$addFields`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/addFields/#mongodb-pipeline-pipe.-addFields), [`$set`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/set/#mongodb-pipeline-pipe.-set), 和 [`$unset`.](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/unset/#mongodb-pipeline-pipe.-unset)
  - 字段重新排序可能发生在中间结果以及查询返回的最终结果中。
  -  由于某些操作可能会对字段重新排序，因此在使用前面列出的投影运算符的查询返回的结果中，不应依赖特定的字段排序。

#### 写操作中的字段顺序

 对于写操作，`MongoDB`保持文档字段的顺序，但以下情况除外:

-  `_id`字段总是文档中的第一个字段。 
- 包含[`renaming`](https://www.mongodb.com/docs/v6.0/reference/operator/update/rename/#mongodb-update-up.-rename)字段名称的更新可能会导致文档中的字段重新排序。



###  `_id`字段

在`MongoDB`中，存储在集合中的每个文档都需要一个唯一的[_id](https://www.mongodb.com/docs/v6.0/reference/glossary/#std-term-_id) 字段作为[主键](https://www.mongodb.com/docs/v6.0/reference/glossary/#std-term-primary-key)。 如果插入的文档遗漏了`_id`字段，`MongoDB`驱动会自动为`_id`字段生成一个[ObjectId](https://www.mongodb.com/docs/v6.0/reference/bson-types/#std-label-objectid) 。

这也适用于通过 [upsert: true](https://www.mongodb.com/docs/v6.0/reference/method/db.collection.update/#std-label-upsert-parameter)的更新操作插入的文档。

` _id`字段有以下行为和约束:

-  默认情况下，`MongoDB`在创建集合时在`_id`字段上创建一个唯一的索引。
- ` _id`字段总是文档中的第一个字段。如果服务器首先接收到一个没有`_id`字段的文档，那么服务器将把这个字段移到最开始。

####  _`if`_`id`中包含子字段，则子字段名不能开头

带有 ( `$`) 符号

- 该`_id`字段可能包含任何[BSON 数据类型](https://www.mongodb.com/docs/v6.0/reference/bson-types/)的值，除了数组、正则表达式或未定义。

```javascript
**WARNING**
	为了确保复制功能正常，不要在`_id`字段中存储`BSON`正则表达式类型的值。
```

 以下是用于存储`_id`值的常用选项:

- 使用一个[ObjectId](https://www.mongodb.com/docs/v6.0/reference/bson-types/#std-label-objectid)。
-  如果可用，使用自然唯一标识符。这样可以节省空间并避免额外的索引。
-  生成一个自动递增的数字。
-  在应用程序代码中生成`UUID`。 为了更有效地存储集合和`_id`索引中的`UUID`值，请将`UUID`存储为`BSON` `BinData`类型的值。 如果满足以下条件，`BinData`类型的索引键将更有效地存储在索引中:
  -  二进制子类型取值范围为`0 ~ 7`或`128 ~ 135`
  - 字节数组的长度为：`0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 或 32`
-  使用驱动程序的`BSON UUID`工具来生成`UUID`。 注意驱动程序实现可能以不同的方式实现`UUID`序列化和反序列化逻辑 这可能与其他驱动程序不完全兼容。

```javascript
**NOTE**
	大多数`MongoDB`驱动客户端都会包含`_id`字段，并在将插入操作发送给`MongoDB之`前生成一个`ObjectId`. 然而，如果客户端发送一个没有`_id`字段的文档，`mongod`将添加`_id`字段并生成`ObjectId`。
```



## 文档结构的其他用途

除了定义数据记录外，`MongoDB`还自始至终使用文档结构,包括但不限于:[query filters](https://www.mongodb.com/docs/v6.0/core/document/#std-label-document-query-filter), [update specifications documents](https://www.mongodb.com/docs/v6.0/core/document/#std-label-document-update-specification), and [index specification documents](https://www.mongodb.com/docs/v6.0/core/document/#std-label-document-index-specification).



### 查询过滤文档

 查询筛选器文档指定了确定要选择哪些记录进行读取、更新和删除操作的条件。

可以使用<field>:<value>表达式指定相等条件和[query operator](https://www.mongodb.com/docs/v6.0/reference/operator/query/)表达式。

```javascript
{
  <field1>: <value1>,
  <field2>: { <operator>: <value> },
  ...
}
```

 见下文例子:

- [Query Documents](https://www.mongodb.com/docs/v6.0/tutorial/query-documents/)
- [Query on Embedded/Nested Documents](https://www.mongodb.com/docs/v6.0/tutorial/query-embedded-documents/)
- [Query an Array](https://www.mongodb.com/docs/v6.0/tutorial/query-arrays/)
- [Query an Array of Embedded Documents](https://www.mongodb.com/docs/v6.0/tutorial/query-array-of-documents/)



### 更新规范文档

 更新规范文档使用[update operators](https://www.mongodb.com/docs/v6.0/reference/operator/update/#std-label-update-operators) 指定在更新操作期间对特定字段执行的数据修改。

```javascript
{
  <operator1>: { <field1>: <value1>, ... },
  <operator2>: { <field2>: <value2>, ... },
  ...
}
```

有关示例，请参见[Update specifications.](https://www.mongodb.com/docs/v6.0/tutorial/update-documents/#std-label-update-documents-modifiers)。

###  

### 索引规范文档

索引规范文档定义了要索引的字段和索引类型:

```javas
{ <field1>: <type1>, <field2>: <type2>, ...  }
```



## 补充说明

 有关`MongoDB`文档模型的更多信息，下载[MongoDB Application Modernization Guide](https://www.mongodb.com/modernize?tck=docs_server).

 下载包括以下资源:

-  关于`MongoDB`数据建模方法的介绍
- 白皮书涵盖了从[RDBMS](https://www.mongodb.com/docs/v6.0/reference/glossary/#std-term-RDBMS) 数据模型迁移到MongoDB的最佳实践和注意事项
-  引用`MongoDB`模式与它的`RDBMS`等价
-  应用现代化记分卡





原文链接：https://www.mongodb.com/docs/v6.0/core/document/

译者：杨帅
