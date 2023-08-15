## MongoDB 扩展 JSON (v1)

> 重要:
>
> **消歧义**
>
> 下一页讨论 MongoDB Extended JSON v1（旧版扩展 JSON）。有关 MongoDB 扩展 JSON v2 的讨论，请参阅 [MongoDB 扩展 JSON (v2) 。](https://www.mongodb.com/docs/v7.0/reference/mongodb-extended-json/)
>
> 有关 中支持的数据类型[`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)，请参阅 [mongosh 数据类型。](https://www.mongodb.com/docs/mongodb-shell/reference/data-types/)
>
> 对于传统的 MongoDB Shell 支持的数据类型，请参阅 [/core/shell-types。](https://www.mongodb.com/docs/v4.4/core/shell-types/)

[JSON](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-JSON)只能表示 [BSON](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-BSON)支持的类型的子集。为了保留类型信息，MongoDB 在 JSON 格式中添加了以下扩展：

- *严格模式*。BSON 类型的严格模式表示符合[JSON RFC](http://www.json.org/)。任何 JSON 解析器都可以将这些严格模式表示解析为键/值对；但是，只有 MongoDB 内部 JSON 解析器能够识别该格式传达的类型信息。
- `mongo` *Shell模式*。MongoDB内部JSON解析器和 [`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)shell可以解析这种模式。

用于各种数据类型的表示形式取决于解析 JSON 的上下文。

### MongoDB 扩展 JSON v1 和 MongoDB 驱动程序

以下驱动程序使用扩展 JSON v1.0（旧版）

- C#
- Ruby

对于其他驱动程序，请参阅[MongoDB Extended JSON (v2) 。](https://www.mongodb.com/docs/v7.0/reference/mongodb-extended-json/)

### 解析器和支持的格式

#### 严格模式输入

下面可以*通过* 识别类型信息来解析严格模式下的表示。

- [`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)4.0 及更早版本
- `--query`各种 MongoDB 工具的选项
- [MongoDB 指南针](https://www.mongodb.com/products/compass)

其他 JSON 解析器（包括[`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)shell）可以将严格模式表示解析为键/值对，但*无法* 识别类型信息。

#### `mongo`Shell模式下输入

下面可以*通过* 识别类型信息来解析`mongo`shell 模式下的表示。

- [`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)4.0 及更早版本
- `--query`各种 MongoDB 工具的选项
- [`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)shell

#### 严格模式下的输出

在4.2版本之前，[`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)*以 MongoDB Extended JSON v1 的严格模式*输出数据 。

#### `mongo`Shell模式下的输出

在4.2版本之前，[`bsondump`](https://www.mongodb.com/docs/database-tools/bsondump/#mongodb-binary-bin.bsondump)`mongo` *以Shell 模式*输出。

### BSON 数据类型和相关表示

*下面介绍 BSON 数据类型以及严格模式*和`mongo` *Shell 模式*下的相关表示

#### 二进制

**data_binary**

| 严格模式                                     | [`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)shell模式 |
| :------------------------------------------- | :----------------------------------------------------------- |
| `{ "$binary": "<bindata>", "$type": "<t>" }` | `BinData ( <t>, <bindata> )`                                 |

其中值如下：

- `<bindata>`是二进制字符串的 Base64 表示形式。
- `<t>`是指示数据类型的单个字节的表示。在 *严格模式*下它是一个十六进制字符串，在*Shell模式*下它是一个整数。请参阅扩展 bson 文档。http://bsonspec.org/spec.html

#### 日期

**data_date**

| 严格模式                | [`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)外壳模式 |
| :---------------------- | :----------------------------------------------------------- |
| `{ "$date": "<date>" }` | `new Date ( <date> )`                                        |

在*严格模式*下，`<date>`是 ISO-8601 日期格式，模板后面带有强制时区字段`YYYY-MM-DDTHH:mm:ss.mmm<+/-Offset>`。

在*Shell 模式*下，`<date>`是 64 位有符号整数的 JSON 表示形式，给出自 UTC 纪元以来的毫秒数。

#### 时间戳

**data_timestamp**

| 严格模式                                   | [`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)shell模式 |
| :----------------------------------------- | :----------------------------------------------------------- |
| `{ "$timestamp": { "t": <t>, "i": <i> } }` | `Timestamp( <t>, <i> )`                                      |

其中值如下：

- `<t>`是自纪元以来秒数的 32 位无符号整数的 JSON 表示形式。
- `<i>`是增量的 32 位无符号整数。

#### 正则表达式

**data_regex**

| 严格模式                                             | [`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)shell模式 |
| :--------------------------------------------------- | :----------------------------------------------------------- |
| `{ "$regex": "<sRegex>", "$options": "<sOptions>" }` | /<jRegex>/<jOptions>                                         |

其中值如下：

- `<sRegex>`是一串有效的 JSON 字符。
- `<jRegex>`是一个字符串，可以包含有效的 JSON 字符和未转义的双引号 ( `"`) 字符，但不能包含未转义的正斜杠 ( `/`) 字符。
- `<sOptions>`是一个包含由字母表字母表示的正则表达式选项的字符串。
- `<jOptions>`是一个字符串，只能包含字符“g”、“i”、“m”和“s”（在 v1.9 中添加）。由于`JavaScript`和 `mongo Shell`表示支持有限范围的选项，因此在转换为该表示时，任何不合格的选项都将被删除。

#### OID

**data_oid**

| 严格模式             | [`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)shell模式 |
| :------------------- | :----------------------------------------------------------- |
| `{ "$oid": "<id>" }` | `ObjectId( "<id>" )`                                         |

其中值如下：

- `<id>`是一个 24 个字符的十六进制字符串。

#### 数据库参考

**data_ref**

| 严格模式                              | [`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)shell模式 |
| :------------------------------------ | :----------------------------------------------------------- |
| `{ "$ref": "<name>", "$id": "<id>" }` | `DBRef("<name>", "<id>")`                                    |

其中值如下：

- `<name>`是一串有效的 JSON 字符。
- `<id>`是任何有效的扩展 JSON 类型。

#### 未定义类型

**data_undefined**

| 严格模式                 | [`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)shell模式 |
| :----------------------- | :----------------------------------------------------------- |
| `{ "$undefined": true }` | `undefined`                                                  |

JavaScript/BSON 未定义类型的表示形式。

您*不能*`undefined`在查询文档中使用。`people` 考虑使用旧shell将以下文档插入到集合中[`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)：

```
db.people.insertOne( { name : "Sally", age : undefined } )
```

以下查询返回错误：

```
db.people.find( { age : undefined } )
db.people.find( { age : { $gte : undefined } } )
```

但是，您可以使用 查询未定义的值[`$type`](https://www.mongodb.com/docs/v7.0/reference/operator/query/type/#mongodb-query-op.-type)，如下所示：

```
db.people.find( { age : { $type : 6 } } )
```

`age`此查询返回该字段具有 value的所有文档`undefined`。

> *重要*
>
> 未定义的 BSON 类型是[已弃用](https://bsonspec.org/spec.html)。[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)而是存储一个空值。
>
> 例如，使用相同的代码在中插入文档 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)在旧[`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo) shell 中：
>
> ```
> db.people.insertOne( { name : "Sally", age : undefined } )
> ```
>
> 生成的文档有所不同：
>
> ```
> { "name" : "Sally", "age" : null }
> { "name" : "Sally", "age" : undefined }
> ```

#### 最小键（MinKey）

**data_minkey**

| 严格模式           | [`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)shell模式 |
| :----------------- | :----------------------------------------------------------- |
| `{ "$minKey": 1 }` | `MinKey`                                                     |

MinKey BSON 数据类型的表示形式，其比较低于所有其他类型。有关 BSON 类型比较顺序的更多信息，请参阅 [比较/排序顺序。](https://www.mongodb.com/docs/v7.0/reference/bson-type-comparison-order/#std-label-faq-dev-compare-order-for-BSON-types)

#### 最大键值(MaxKey)

**data_maxkey**

| 严格模式           | [`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)shell模式 |
| :----------------- | :----------------------------------------------------------- |
| `{ "$maxKey": 1 }` | `MaxKey`                                                     |

MaxKey BSON 数据类型的表示形式比所有其他类型都要高。有关 BSON 类型比较顺序的更多信息，请参阅 [比较/排序顺序。](https://www.mongodb.com/docs/v7.0/reference/bson-type-comparison-order/#std-label-faq-dev-compare-order-for-BSON-types)

#### 长整型（NumberLong）

**data_numberlong**

| 严格模式                        | [`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)shell模式 |
| :------------------------------ | :----------------------------------------------------------- |
| `{ "$numberLong": "<number>" }` | `NumberLong( "<number>" )`                                   |

`NumberLong`是一个 64 位有符号整数。在旧版 [`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)shell 中，必须使用引号来插入 a `NumberLong`，否则操作将产生错误。

例如，以下命令尝试 在整数值两边插入带`9223372036854775807`引号和不带引号的 a ：`NumberLong`

```
db.json.insertOne( { longQuoted : NumberLong("9223372036854775807") } )
db.json.insertOne( { longUnQuoted : NumberLong(9223372036854775807) } )
```

突出显示的行会在旧 shell 中产生错误 [`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)。插入成功 [`mongosh`。](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

#### 十进制数（NumberDecimal）

**data_numberdecimal**

| 严格模式                           | [`mongo`](https://www.mongodb.com/docs/v7.0/reference/mongo/#mongodb-binary-bin.mongo)shell模式 |
| :--------------------------------- | :----------------------------------------------------------- |
| `{ "$numberDecimal": "<number>" }` | `NumberDecimal( "<number>" )`                                |

`NumberDecimal`是一个[高精度小数](https://github.com/mongodb/specifications/blob/master/source/bson-decimal128/decimal128.rst)。必须包含引号，否则输入的数字将被视为双精度数，从而导致数据丢失。

例如，以下命令将值`123.40`作为 带引号和不带引号的插入：`NumberDecimal`

```
db.json.insertOne( { decimalQuoted : NumberDecimal("123.40") } )
db.json.insertOne( { decimalUnQuoted : NumberDecimal(123.40) } )
```

当您检索文档时， 的值`decimalUnQuoted`已更改，但`decimalQuoted`保留其指定的精度：

```
db.json.find()
{ "_id" : ObjectId("596f88b7b613bb04f80a1ea9"), "decimalQuoted" : NumberDecimal("123.40") }
{ "_id" : ObjectId("596f88c9b613bb04f80a1eaa"), "decimalUnQuoted" : NumberDecimal("123.400000000000") }
```

> *重要*
>
> 此插入行为的不同之处在于[`mongosh`。](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)
>
> 带引号的字符串格式 ,`NumberDecimal("123.40")`已弃用。插入成功，但也会产生警告。
>
> 不带引号的字符串格式 ，`NumberDecimal(123.40)`将值存储为`123.4`。尾随`0`被丢弃。
