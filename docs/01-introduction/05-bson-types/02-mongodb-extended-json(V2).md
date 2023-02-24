# `MongoDB`扩展`JSON`(V2)



在本页面

[MongoDB Extended JSON v2 Usage]()

[BSON Data Types and Associated Representations]()

[Examples]()



```javascript
| **IMPORTANT** |
| ------------- |
| 解惑：        |
			下一页讨论MongoDB Extended JSON v2。关于在遗留的MongoDB Extended JSON v1的讨论，见MongoDB Extended JSON (v1)（https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json-v1/）

```

` JSON`只能直接表示`BSON`支持的类型的一个子集。 为了保存类型信息，`MongoDB`在`JSON`格式中添加了以下扩展。

- 规范模式
  - 一种以牺牲可读性和互操作性为代价强调类型保存的字符串格式。也就是说，从规范到`BSON`的转换通常会保留类型信息，除非在某些特定情况下

- 宽松模式
  - 一种以牺牲类型保存为代价强调可读性和互操作性的字符串格式。也就是说，从宽松格式到`BSON`格式的转换可能会丢失类型信息。

两种格式都符合[`JSON`格式文件](http://www.json.org/)并且可以被各种` MongoDB` 驱动程序和工具解析。



## `MongoDB`扩展`JSON v2`用法

### 驱动

 以下驱动程序使用扩展` JSON v2.0`

- `C`
- `C++`
- `Go`

- `Java`
- `Node`
- `Perl`

- `PHPC`
- `Python`
- `Scala`

 对于使用遗留的` MongoDB Extended JSON v1`的`c#`和`Ruby`，请参考[MongoDB Extended JSON (v1).](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json-v1/)。

### 扩展`JSON`方法

` MongoDB`为扩展`JSON`提供了以下方法:

```html
方法                  描述
serialize           序列化BSON对象并以Extended JSON格式返回数据。
                    EJSON.serialize( db.<collection>.findOne() )

deserialize         将序列化文档转换为字段和值对。这些值有BSON 类型。
										EJSON.deserialize( <serialized object> )
										
stringify           转换元素和类型将反序列化对象中的字符串配对。
									  EJSON.stringify( <deserialized object> )
									  
parse               将字符串转化为元素和类型对
                    EJSON.parse( <string> )
```

有关使用示例，请参阅[扩展的 JSON 对象转换](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#std-label-ex-obj-conversions)。

 有关更多详细信息，请参阅文档:

- [MongoDB NodeJS Driver](https://mongodb.github.io/node-mongodb-native/4.0/)
- [BSON Parser](https://github.com/mongodb-js/bson-ext)
- [BSON-EXT Parser](https://github.com/mongodb-js/bson-ext)

###  `MongoDB`数据库工具

从`4.2`版开始:

```javascript
二进制                变化
bsondump            使用扩展JSON v2.0(规范模式)格式。
mongodump           元数据使用扩展 JSON v2.0(规范模式)格式。需要mongorestore支持扩展JSON v2.0(规范模式或放宽模式)格式的4.2										或更高版本。
									 	Tip:
									 	通常来说，mongodump和mongorestore需使用相同版本.
mongoexport         默认情况下以扩展 JSON v2.0(宽松模式)创建输出数据。
										如果使用--jsonFormat，则在扩展 JSON v2.0(规范模式)中创建输出数据。
mongoimport         默认情况下，导入数据采用Extended JSON v2.0(放松模式或规范模式)。
										如果指定了选项--legacy，则可以识别Extended JSON v1.0格式的数据。
										Tip:
										通常来说，mongoexport和mongoimport版本应该一致。
```



## `BSON`数据类型和相关的表征

下面介绍了一些常见的`BSON`数据类型以及`Canonical`和`relax`中的相关表示。

[`Array`](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#mongodb-bsontype-Array)[`Binary`](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#mongodb-bsontype-Binary)[`Date`](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#mongodb-bsontype-Date)  [`Decimal128`](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#mongodb-bsontype-Decimal128)[`Document`](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#mongodb-bsontype-Document)[`Double`](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#mongodb-bsontype-Double)  [`Int32`](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#mongodb-bsontype-Int32)[`Int64`](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#mongodb-bsontype-Int64)[`MaxKey`](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#mongodb-bsontype-MaxKey)  [`MinKey`](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#mongodb-bsontype-MinKey)[`ObjectId`](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#mongodb-bsontype-ObjectId)[`Regular Expression`](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#mongodb-bsontype-Regular-Expression)[`Timestamp`](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#mongodb-bsontype-Timestamp)



### `Array`

```javascript
     标准                              宽松
[ <elements> ]                   <Same as Canonical>
```

 其中数组元素如下:

- <elements>
  - 数组元素使用`Extended JSON`。
  - 若要指定空数组，请省略内容`[]`。



### `Binary`

|                             标准                             |        宽松         |
| :----------------------------------------------------------: | :-----------------: |
| `{ "$binary":    {       "base64": "<payload>",       "subType": "<t>"    } }` | <Same as Canonical> |

各值如下:

- "<payload>"
  - `Base64`编码(填充为`“=”`)有效负载字符串
- "<t>"
  - 对应于`BSON`二进制子类型的一个或两个字符的十六进制字符串



### `Date`

`1970`年至`9999`年的日期，包括:

|                   标准                   |                    宽松                    |
| :--------------------------------------: | :----------------------------------------: |
| `{"$date": {"$numberLong": "<millis>"}}` | `{"$date": "<ISO-8601 Date/Time Format>"}` |

 对于`1970`年之前或`9999`年之后的日期:

|                   标准                   |        宽松         |
| :--------------------------------------: | :-----------------: |
| `{"$date": {"$numberLong": "<millis>"}}` | <Same as Canonical> |

各值如下:

- "<millis>"
  - 作为字符串的`64`位有符号整数。该值表示相对于`epoch`的毫秒数。
- `"<ISO-8601 Date/Time Format>"`
  - 在 [ISO-8601 Internet Date/Time Format](https://tools.ietf.org/html/rfc3339#section-5.6)的日期作为字符串
  - ` date/time`的最大时间精度为毫秒:
    - 如果小数部分不为零，小数秒正好有`3`位小数。
    -  否则，如果分数秒为零，则应省略。



### `Decimal128`

|                标准                |         宽松          |
| :--------------------------------: | :-------------------: |
| `{ "$numberDecimal": "<number>" }` | `<Same as Canonical>` |



各值如下:

- `"<number>"`
  - 一个[高精度小数](https://github.com/mongodb/specifications/blob/master/source/bson-decimal128/decimal128.rst) 作为一个字符串。



### `Document`

|      标准       |         宽松          |
| :-------------: | :-------------------: |
| `{ <content> }` | `<Same as Canonical>` |

其中`document`内容如下:

- `<content>`
  - `Name:value pairs`使用`Extended JSON`。
  - 若要指定一个空文档，请省略内容`{}`。



### `Double`

*对于有限数*

|                   标准                   |         宽松         |
| :--------------------------------------: | :------------------: |
| `{"$numberDouble": "<decimal string>" }` | <non-integer number> |

 *对于无限数或`NAN`*:

|                         标准                         |        宽松         |
| :--------------------------------------------------: | :-----------------: |
| `{"$numberDouble": <"Infinity"|"-Infinity"|"NaN"> }` | <Same as Canonical> |

各值如下:

- `"<decimal string>"`
  -  作为字符串的64位有符号浮点数。
- <non-integer number>
  - 一个非整数。整数被解析为整数而不是双精度数。



### `Int64`

|              标准               |   宽松    |
| :-----------------------------: | :-------: |
| `{ "$numberLong": "<number>" }` | <integer> |

各值如下:

- "<number>"
  -  作为字符串的64位有符号整数。
- <integer>
  - 64位有符号整数。



### `Int32`

|              标准              |   宽松    |
| :----------------------------: | :-------: |
| `{ "$numberInt": "<number>" }` | <integer> |

各值如下:

- "<number>"
  -  作为字符串的32位有符号整数。
- <integer>
  - 32位有符号整数。



### **`MaxKey`**

|        标准        |         宽松          |
| :----------------: | :-------------------: |
| `{ "$maxKey": 1 }` | `<Same as Canonical>` |

` MaxKey BSON`数据类型比所有其他类型都要高。有关BSON类型比较顺序的更多信息，请参阅[`Comparison/Sort Order`](https://www.mongodb.com/docs/v6.0/reference/bson-type-comparison-order/#std-label-faq-dev-compare-order-for-BSON-types)顺序。



### **`ObjectId`**

|               标准               |         宽松          |
| :------------------------------: | :-------------------: |
| `{ "$oid": "<ObjectId bytes>" }` | `<Same as Canonical>` |

各值如下:

- "<ObjectId bytes>"
  - 表示`ObjectId`字节的24个字符的大端十六进制字符串。



### **`Regular Expression`**

|                             标准                             |         宽松          |
| :----------------------------------------------------------: | :-------------------: |
| `{ "$regularExpression":    {       "pattern": "<regexPattern>",       "options": "<options>"   } }` | `<Same as Canonical>` |

各值如下:

- "<regexPattern>"
  - 对应于正则表达式模式的字符串。 字符串可以包含有效的`JSON`字符和未转义的双引号`(")`字符， 但可能不包含未转义的正斜杠`(/)`字符。
- "<options>"
  - 指定`BSON`正则表达式选项(`'g'， 'i'， 'm'和's'`)的字符串或空字符串`""`。

```javascript
**IMPORTANT**
		选项必须按字母顺序排列。
```



### **`Timestamp`**

|                  标准                  |         宽松          |
| :------------------------------------: | :-------------------: |
| `{"$timestamp": {"t": <t>, "i": <i>}}` | `<Same as Canonical>` |

各值如下：

- <t>
  - 从纪元开始的秒数的正整数。
- <i>
  - 增量为正整数。





## 例子

 下面的例子说明了扩展`JSON`的用法。



### 类型表示

| 字段名称             | 标准格式                                                | 宽松格式                                                |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| `"_id:"`             | `{"$oid":"5d505646cf6d4fe581014ab2"}`                   | `{"$oid":"5d505646cf6d4fe581014ab2"}`                   |
| `"arrayField":`      | `["hello",{"$numberInt":"10"}]`                         | `["hello",10]`                                          |
| `"dateField":`       | `{"$date":{"$numberLong":"1565546054692"}}`             | `{"$date":"2019-08-11T17:54:14.692Z"}`                  |
| `"dateBefore1970":`  | `{"$date":{"$numberLong":"-1577923200000"}}`            | `{"$date":{"$numberLong":"-1577923200000"}}`            |
| `"decimal128Field":` | `{"$numberDecimal":"10.99"}`                            | `{"$numberDecimal":"10.99"}`                            |
| `"documentField":`   | `{"a":"hello"}`                                         | `{"a":"hello"}`                                         |
| `"doubleField":`     | `{"$numberDouble":"10.5"}`                              | `10.5`                                                  |
| `"infiniteNumber"`   | `{"$numberDouble":"Infinity"}`                          | `{"$numberDouble":"Infinity"}`                          |
| `"int32field":`      | `{"$numberInt":"10"}`                                   | `10`                                                    |
| `"int64Field":`      | `{"$numberLong":"50"}`                                  | `50`                                                    |
| `"minKeyField":`     | `{"$minKey":1}`                                         | `{"$minKey":1}`                                         |
| `"maxKeyField":`     | `{"$maxKey":1}`                                         | `{"$maxKey":1}`                                         |
| `"regexField":`      | `{"$regularExpression":{"pattern":"^H","options":"i"}}` | `{"$regularExpression":{"pattern":"^H","options":"i"}}` |
| `"timestampField":`  | `{"$timestamp":{"t":1565545664,"i":1}}`                 | `{"$timestamp":{"t":1565545664,"i":1}}`                 |



### 扩展`JSON`对象转换

下面的简短示例创建一个文档对象，然后使用`Extended JSON`对象转换方法将对象转换为不同的形式。

### `Setup`

在`conversions`集合中创建一个`document`:

```javascript
db.conversions.insertOne( { insertDate: new Date() } )
```

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 返回一个文档对象:

```javascript
{
  acknowledged: true,
  insertedId: ObjectId("61fbaf25671c45f3f5f4074a")
}
```



#### `EJSON.serialize`

 序列化存储在`MongoDB`文档对象中的数据:

```javascript
serialized = EJSON.serialize( db.conversions.findOne() )
```

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 解析`JavaScript`对象并返回前缀为`“$”`[`types`](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#std-label-type-representations)的值:

```javascript
{
  _id: { '$oid': '61fbaf25671c45f3f5f4074a' },
  insertDate: { '$date': '2022-02-03T10:32:05.230Z' }
}
```



#### `EJSON.deserialize`

 反序列化序列化对象:

```javascript
EJSON.deserialize( serialized )
```

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 解析`JavaScript`对象并返回默认为 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) [`type`](https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/#std-label-type-representations)的值

```javascript
{
  _id: new ObjectId( "61fbaf25671c45f3f5f4074a" ),
  insertDate: ISODate( "2022-02-03T10:32:05.230Z" )
}
```



#### `EJSON.stringify`

 将对象转换为字符串:

```javascript
stringified = EJSON.stringify( db.conversions.findOne() )
```

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)将转换对象的元素输出为字符串:

```javascript
{
   "_id": {"$oid":"61fbaf25671c45f3f5f4074a"},
   "insertDate":{"$date":"2022-02-03T10:32:05.230Z"}
}
```



#### `EJSON.parse`

 解析一个字符串创建一个对象:

```javascript
EJSON.parse( stringified )
```

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)将转换后的字符串作为文档返回:

```javascript
{
  _id: new ObjectId("61fbaf25671c45f3f5f4074a"),
  insertDate: ISODate("2022-02-03T10:32:05.230Z")
}
```



原文链接：https://www.mongodb.com/docs/v6.0/reference/mongodb-extended-json/

译者：杨帅