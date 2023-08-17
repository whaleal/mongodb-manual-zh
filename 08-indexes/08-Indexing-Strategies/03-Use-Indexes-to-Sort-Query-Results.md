## 使用索引对查询结果进行排序

由于索引包含有序记录，MongoDB 可以从包含排序字段的索引中获取排序结果。*如果*排序使用与查询谓词相同的索引，MongoDB*可以* 使用多个索引来支持排序操作。

如果 MongoDB 无法使用一个或多个索引来获取排序顺序，则 MongoDB 必须对数据执行阻塞排序操作。阻塞排序表示 MongoDB 必须在返回结果之前消耗并处理排序的所有输入文档。阻塞排序不会阻塞集合或数据库上的并发操作。

从 MongoDB 6.0 开始，如果服务器在管道执行阶段需要超过 100 MB 的内存，MongoDB 会自动将临时文件写入磁盘，除非该查询指定 `{ allowDiskUse: false }`. 在版本 4.4 和 5.0 中，如果服务器需要超过 100 MB 的系统内存来进行阻塞排序操作，MongoDB 将返回错误，除非该查询指定 [`cursor.allowDiskUse()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.allowDiskUse/#mongodb-method-cursor.allowDiskUse)。详细信息请参见 [`allowDiskUseByDefault`。](https://www.mongodb.com/docs/v7.0/reference/parameters/#mongodb-parameter-param.allowDiskUseByDefault)

使用索引的排序操作通常比阻塞排序具有更好的性能。

> 笔记:
>
> 当您根据使用 [多键索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/#std-label-index-type-multikey)进行索引的数组字段进行排序时，查询计划将包含 [阻塞排序](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-blocking-sort)阶段，除非满足以下两个条件：
>
> - 所有排序字段的索引[边界](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/multikey-index-bounds/#std-label-multikey-index-bounds-intersecting)`[MinKey, MaxKey]`都是。
> - 任何多键索引字段的边界都不具有与排序模式相同的路径前缀。

### 使用单字段索引排序

如果单个字段上有升序或降序索引，则对该字段的排序操作可以是任一方向。

例如，在`a`集合的字段上创建升序索引`records`：

```
db.records.createIndex( { a: 1 } )
```

该索引可以支持升序排序`a`：

```
db.records.find().sort( { a: 1 } )
```

`a`该索引还可以通过逆序遍历索引来支持以下降序排序：

```
db.records.find().sort( { a: -1 } )
```

### 对多个字段进行排序

创建[复合索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound)以支持对多个字段进行排序。

您可以指定对索引的所有键或子集进行排序；但是，排序键必须按照它们在索引中出现的*顺序*列出。例如，索引键模式`{ a: 1, b: 1 }`可以支持 on 上的排序`{ a: 1, b: 1 }`，但*不支持*on 上的排序`{ b: 1, a: 1 }`。

对于使用复合索引进行排序的查询，文档中所有键的指定排序方向[`cursor.sort()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.sort/#mongodb-method-cursor.sort)必须与索引键模式匹配*或*与索引键模式相反。例如，索引键模式可以支持对and`{ a: 1, b: -1 }`进行排序，但**不支持** 对or进行排序。`{ a: 1, b: -1 }``{ a: -1, b: 1 }``{ a: -1, b: -1 }``{a: 1, b: 1}`

#### 排序和索引前缀

如果排序键对应于索引键或索引*前缀*，MongoDB可以使用索引对查询结果进行排序。复合索引的前缀是由索引键模式开头的一个或多个键组成的子集*。*

例如，在`data`集合上创建复合索引：

```
db.data.createIndex( { a:1, b: 1, c: 1, d: 1 } )
```

然后，以下是该索引的前缀：

```
{ a: 1 }
{ a: 1, b: 1 }
{ a: 1, b: 1, c: 1 }
```

以下查询和排序操作使用索引前缀对结果进行排序。这些操作不需要对内存中的结果集进行排序。

| 例子                                                       | 索引前缀               |
| :--------------------------------------------------------- | :--------------------- |
| `db.data.find().sort( { a: 1 } )`                          | `{ a: 1 }`             |
| `db.data.find().sort( { a: -1 } )`                         | `{ a: 1 }`             |
| `db.data.find().sort( { a: 1, b: 1 } )`                    | `{ a: 1, b: 1 }`       |
| `db.data.find().sort( { a: -1, b: -1 } )`                  | `{ a: 1, b: 1 }`       |
| `db.data.find().sort( { a: 1, b: 1, c: 1 } )`              | `{ a: 1, b: 1, c: 1 }` |
| `db.data.find( { a: { $gt: 4 } } ).sort( { a: 1, b: 1 } )` | `{ a: 1, b: 1 }`       |

考虑以下示例，其中索引的前缀键同时出现在查询谓词和排序中：

```
db.data.find( { a: { $gt: 4 } } ).sort( { a: 1, b: 1 } )
```

在这种情况下，MongoDB 可以使用索引按照排序指定的顺序检索文档。如示例所示，查询谓词中的索引前缀可以与排序中的前缀不同。

#### 索引的排序和无前缀子集

索引可以支持对索引键模式的非前缀子集进行排序操作。为此，查询必须 在排序键之前的所有前缀键上包含**相等条件。**

例如，该集合`data`具有以下索引：

```
{ a: 1, b: 1, c: 1, d: 1 }
```

以下操作可以使用索引来获取排序顺序：

| 例子                                                      | 索引前缀                |
| :-------------------------------------------------------- | :---------------------- |
| `db.data.find( { a: 5 } ).sort( { b: 1, c: 1 } )`         | `{ a: 1 , b: 1, c: 1 }` |
| `db.data.find( { b: 3, a: 4 } ).sort( { c: 1 } )`         | `{ a: 1, b: 1, c: 1 }`  |
| `db.data.find( { a: 5, b: { $lt: 3} } ).sort( { b: 1 } )` | `{ a: 1, b: 1 }`        |

正如最后一个操作所示，查询文档中只有排序子集*之前的*索引字段必须具有相等条件；其他索引字段可以指定其他条件。

如果查询未在**排序**规范之前或与排序规范重叠的索引前缀上指定相等条件，则该操作将无法**有效**地使用该索引。例如，以下操作指定排序文档`{ c: 1 }`，但查询文档不包含前面索引字段`a`和的相等匹配`b`：

```
db.data.find( { a: { $gt: 2 } } ).sort( { c: 1 } )
db.data.find( { c: 5 } ).sort( { c: 1 } )
```

这些操作**不会**有效地使用索引`{ a: 1, b: 1, c: 1, d: 1 }`，甚至可能不会使用索引来检索文档。

### 索引排序顺序

索引文档的集合在关键字段中可能有多种数据类型。

- 当索引有多个数据类型的键时，索引按照[BSON 类型排序顺序进行排序。](https://www.mongodb.com/docs/v7.0/reference/bson-type-comparison-order/#std-label-bson-types-comparison-order)
- 在数组比较中：
  - 小于比较或升序排序根据 BSON 类型排序顺序比较数组的最小元素。
  - 大于比较或降序排序根据相反的 BSON 类型排序顺序来比较数组的最大元素。
  - 将值为单元素数组的字段（例如， `[ 1 ]`）与非数组字段（例如，`2`）进行比较时，比较结果为`1`和`2`。
  - 空数组的比较（例如，`[ ]`）将空数组视为小于某个`null`值或缺少字段值。

请参阅[索引排序示例。](https://www.mongodb.com/docs/v7.0/tutorial/sort-results-with-indexes/#std-label-ex-sort-index-types)

### 索引的使用和整理

要使用索引进行字符串比较，操作还必须指定相同的排序规则。也就是说，如果操作指定了不同的排序规则，则具有排序规则的索引无法支持对索引字段执行字符串比较的操作。

例如，集合在带有排序规则 locale 的`myColl`字符串字段上有一个索引。`category``"fr"`

```
db.myColl.createIndex( { category: 1 }, { collation: { locale: "fr" } } )
```

以下查询操作，指定与索引相同的排序规则，可以使用索引：

```
db.myColl.find( { category: "cafe" } ).collation( { locale: "fr" } )
```

但是，以下查询操作（默认情况下使用“简单”二进制整理器）无法使用索引：

```
db.myColl.find( { category: "cafe" } )
```

对于索引前缀键不是字符串、数组和嵌入文档的复合索引，指定不同排序规则的操作仍然可以使用索引来支持索引前缀键的比较。

例如，集合`myColl`在数字字段`score`和`price`以及字符串字段 上有一个复合索引`category`；该索引是使用用于字符串比较的排序规则区域设置创建的 `"fr"`：

```
db.myColl.createIndex(
   { score: 1, price: 1, category: 1 },
   { collation: { locale: "fr" } } )
```

以下使用`"simple"`二进制排序规则进行字符串比较的操作可以使用索引：

```
db.myColl.find( { score: 5 } ).sort( { price: 1 } )
db.myColl.find( { score: 5, price: { $gt: NumberDecimal( "10" ) } } ).sort( { price: 1 } )
```

以下操作使用`"simple"`二进制排序规则对索引`category`字段进行字符串比较，可以使用索引仅完成`score: 5`查询的一部分：

```
db.myColl.find( { score: 5, category: "cafe" } )
```

### 例子

以下示例演示了索引键具有相同或不同类型时的排序。

创建`keyTypes`集合：

```shell
db.keyTypes.insertMany( [
  { seqNum: 1, seqType: null, type: "null" },
  { seqNum: 29, seqType: null, type: "null" },
  { seqNum: 2, seqType: Int32("10"), type: "Int32"  },
  { seqNum: 28, seqType: Int32("10"), type: "Int32"  },
  { seqNum: 3, seqType: Long("10"), type: "Long" },
  { seqNum: 27, seqType: Long("10"), type: "Long" },
  { seqNum: 4, seqType: Decimal128("10"), type: "Decimal128" },
  { seqNum: 26, seqType: Decimal128("10"), type: "Decimal128" },
  { seqNum: 5, seqType: Double("10"), type: "Double" },
  { seqNum: 25, seqType: Double("10"), type: "Double"  },
  { seqNum: 6, seqType: String("10"), type: "String"  },
  { seqNum: 24, seqType: String("10"), type: "String" },
  { seqNum: 7, seqType: [ "1", "2", "3" ], type: "Array" },
  { seqNum: 23, seqType: [ "1", "2", "3" ], type: "Array" },
  { seqNum: 8, seqType: [ [1], [2], [3] ], type: "Array" },
  { seqNum: 22, seqType: [ [1], [2], [3] ], type: "Array " },
  { seqNum: 9, seqType: [ 1, 2, 3 ], type: "Array" },
  { seqNum: 21, seqType: [ 1, 2, 3 ], type: "Array" },
  { seqNum: 10, seqType: true, type: "Boolean" },
  { seqNum: 11, seqType: new Timestamp(), type: "Timestamp" },
  { seqNum: 12, seqType: new Date(), type: "Date" },
  { seqNum: 13, seqType: new ObjectId(), type: "ObjectId" },
] )
```

在序列号 ( `seqNum`) 和序列类型 ( `seqType`) 字段上创建索引：

```
db.keyTypes.createIndex( { seqNum: 1 } )

db.keyTypes.createIndex( { seqType: 1 } )
```

使用 查询集合[`find()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.find/#mongodb-method-db.collection.find)。投影文档`{ _id: 0 }`抑制`_id`输出显示中的场。

```
db.keyTypes.find( {}, { _id: 0 } )
```

文档按插入顺序返回：

```
{ seqNum: 1, seqType: null, type: 'null' },
{ seqNum: 29, seqType: null, type: 'null' },
{ seqNum: 2, seqType: 10, type: 'Int32' },
{ seqNum: 28, seqType: 10, type: 'Int32' },
{ seqNum: 3, seqType: Long("10"), type: 'Long' },
{ seqNum: 27, seqType: Long("10"), type: 'Long' },
{ seqNum: 4, seqType: Decimal128("10"), type: 'Decimal128' },
// Output truncated
```

序列号 ( `seqNum`) 索引具有相同类型的值。使用`seqNum`索引查询`keyTypes`集合：

```
db.keyTypes.find( {}, { _id: 0 } ).sort( { seqNum: 1} )
```

键`seqNum`是整数。文档按数字顺序返回：

```
{ seqNum: 1, seqType: null, type: 'null' },
{ seqNum: 2, seqType: 10, type: 'Int32' },
{ seqNum: 3, seqType: Long("10"), type: 'Long' },
{ seqNum: 4, seqType: Decimal128("10"), type: 'Decimal128' },
{ seqNum: 5, seqType: 10, type: 'Double' },
{ seqNum: 6, seqType: '10', type: 'String' },
{ seqNum: 7, seqType: [ '1', '2', '3' ], type: 'Array' },
// Output truncated
```

序列类型 ( `seqType`) 索引具有不同类型的值。使用`seqType`索引查询`keyTypes`集合：

```
db.keyTypes.find( {}, { _id: 0 } ).sort( { seqType: 1} )
```

文档以[BSON 类型排序顺序返回：](https://www.mongodb.com/docs/v7.0/reference/bson-type-comparison-order/#std-label-bson-types-comparison-order)

```
{ seqNum: 1, seqType: null, type: 'null' },
{ seqNum: 29, seqType: null, type: 'null' },
{ seqNum: 9, seqType: [ 1, 2, 3 ], type: 'Array' },
{ seqNum: 21, seqType: [ 1, 2, 3 ], type: 'Array' },
{ seqNum: 2, seqType: 10, type: 'Int32' },
{ seqNum: 28, seqType: 10, type: 'Int32' },
{ seqNum: 3, seqType: Long("10"), type: 'Long' },
{ seqNum: 27, seqType: Long("10"), type: 'Long' },
{ seqNum: 4, seqType: Decimal128("10"), type: 'Decimal128' },
{ seqNum: 26, seqType: Decimal128("10"), type: 'Decimal128' },
{ seqNum: 5, seqType: 10, type: 'Double' },
{ seqNum: 25, seqType: 10, type: 'Double' },
{ seqNum: 7, seqType: [ '1', '2', '3' ], type: 'Array' },
{ seqNum: 23, seqType: [ '1', '2', '3' ], type: 'Array' },
{ seqNum: 6, seqType: '10', type: 'String' },
{ seqNum: 24, seqType: '10', type: 'String' },
{ seqNum: 8, seqType: [ [ 1 ], [ 2 ], [ 3 ] ], type: 'Array' },
{ seqNum: 22, seqType: [ [ 1 ], [ 2 ], [ 3 ] ], type: 'Array ' },
{
  seqNum: 13,
  seqType: ObjectId("6239e3922604d5a7478df071"),
  type: 'ObjectId'
},
{ seqNum: 10, seqType: true, type: 'Boolean' },
{
  seqNum: 12,
  seqType: ISODate("2022-03-22T14:56:18.100Z"),
  type: 'Date'
},
{
  seqNum: 11,
  seqType: Timestamp({ t: 1647960978, i: 1 }),
  type: 'Timestamp'
}
```

- 在数组比较中：
  - 小于比较或升序排序根据 BSON 类型排序顺序比较数组的最小元素。
  - 大于比较或降序排序根据相反的 BSON 类型排序顺序来比较数组的最大元素。
  - 将值为单元素数组的字段（例如， `[ 1 ]`）与非数组字段（例如，`2`）进行比较时，比较结果为`1`和`2`。
  - 空数组的比较（例如，`[ ]`）将空数组视为小于某个`null`值或缺少字段值。
- 数值类型（Int32、Long、Decimal128、Double）与其他类型相比是等效的。
- 在 Numbers BSON 类型中，数字类型是排序的：
  - 整数32
  - 长的
  - 十进制128
  - 双倍的