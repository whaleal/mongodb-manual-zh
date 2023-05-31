# 数据类型

MongoDB 服务器使用 [BSON](https://www.mongodb.com/docs/manual/reference/bson-types/)格式支持一些额外的数据类型，这些数据类型不可用[JSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-JSON) 格式。与遗留`mongo`shell 相比，MongoDB Shell ( `mongosh`) 的类型处理更符合 MongoDB 使用的默认类型[司机。](https://www.mongodb.com/docs/drivers/drivers/)

`mongosh`本文档重点介绍了旧 shell 和shell之间类型使用的变化`mongo`。见 [扩展 JSON](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/)有关受支持类型的更多信息的参考。

## 日期

`mongosh`提供各种方法来返回日期，可以是字符串形式，也可以是`Date`对象形式：

- `Date()`以字符串形式返回当前日期的方法。
- `new Date()``Date`使用 包装器返回对象的构造函数`ISODate()`。
- `ISODate()``Date`使用 包装器返回对象的构造函数`ISODate()`

## 对象ID

`mongosh`提供`ObjectId()`围绕 [对象ID](https://www.mongodb.com/docs/manual/reference/bson-types/#std-label-objectid)数据类型。要生成新的 ObjectId，请使用以下操作`mongosh`：

```
new ObjectId
```

从 1.8.0 开始，`ObjectId`包装器不再接受：

- ObjectId.prototype.generate
- ObjectId.prototype.getInc
- ObjectId.prototype.get_inc
- ObjectId.getInc

> 提示:
>
> **也可以看看：**
>
> [`ObjectId()`](https://www.mongodb.com/docs/manual/reference/method/ObjectId/#mongodb-method-ObjectId)

## 整数32

如果一个数字可以转换为 32 位整数，`mongosh`则将其存储为`Int32`. 如果不是，`mongosh`默认将数字存储为`Double`. `Int32` 存储在中的数值`mongosh`默认情况下会存储`Double`在 shell 中 `mongo`。

这[Int32()](http://mongodb.github.io/node-mongodb-native/3.6/api/Int32.html)构造函数可用于显式指定 32 位整数。

```
db.types.insertOne(
   {
       "_id": 1,
       "value": Int32("1"),
       "expectedType": "Int32"
   }
)
```

> 警告:
>
> 如果您使用旧 shell和旧shell连接到同一个集合，默认值`Int32`和类型可能会存储不一致。`Double``mongosh``mongo`

## Long

这[Long（）](http://mongodb.github.io/node-mongodb-native/3.6/api/Long.html)构造函数可用于显式指定 64 位整数。

```
db.types.insertOne(
   {
      "_id": 3,
      "value": Long("1"),
      "expectedType": "Long"
   }
)
```

>笔记:
>
>在遗产中[`mongo`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)shell`NumberLong()`接受字符串或整数值。在 中`mongosh`，`NumberLong()` 只接受字符串值。[长的（）](http://mongodb.github.io/node-mongodb-native/3.6/api/Long.html)提供管理与 64 位值之间的转换的方法。

## 十进制128

[十进制128()](http://mongodb.github.io/node-mongodb-native/3.6/api/Decimal128.html)values 是基于十进制的 128 位浮点数，可精确模拟十进制舍入。

此功能适用于处理 [货币数据](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/)，例如财务、税收和科学计算。

这`Decimal128` [BSON类型](https://www.mongodb.com/docs/manual/reference/bson-types/) 使用 IEEE 754 decimal128 浮点编号格式，支持 34 位十进制数字（即有效数字）和 −6143 至 +6144 的指数范围。

```
db.types.insertOne(
   {
       "_id": 5,
       "value": Decimal128("1"),
       "expectedType": "Decimal128"
   }
)
```

### 平等和排序顺序

该类型的值`Decimal128`根据其实际数值与其他数值类型进行比较和排序。基于二进制`Double`类型的数值通常具有基于十进制值的近似表示，并且可能不完全等于它们的十进制表示。

## 时间戳

MongoDB 使用一个 [BSON 时间戳](https://www.mongodb.com/docs/manual/reference/bson-types/#timestamps)在内部[操作日志](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-oplog). 该`Timestamp`类型的工作方式类似于 Java Timestamp 类型。使用[日期](https://www.mongodb.com/docs/mongodb-shell/reference/data-types/#std-label-mongo-shell-date-type)涉及日期的操作类型。

签名`Timestamp`有两个可选参数。

```
Timestamp( { "t": <integer>, "i": <integer> } )
```

| 范围 | 类型 | 默认                                                         | 定义                                                         |
| :--- | :--- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `t`  | 整数 | 当前时间自[UNIX 时代。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-unix-epoch) | 选修的。以秒为单位的时间。                                   |
| `i`  | 整数 | 1个                                                          | 选修的。用于在给定秒内有多个操作时进行排序。`i`如果没有使用则没有效果 `t`。 |

有关使用示例，请参阅[为新文档添加时间戳](https://www.mongodb.com/docs/mongodb-shell/reference/data-types/#std-label-timestamp-ex-default), [创建自定义时间戳。](https://www.mongodb.com/docs/mongodb-shell/reference/data-types/#std-label-timestamp-ex-custom)

## 类型检查

使用[`$type`](https://www.mongodb.com/docs/manual/reference/operator/query/type/#mongodb-query-op.-type)查询运算符或检查对象构造函数以确定类型。

Javascript`typeof`运算符返回通用值，例如 `number`or`object`而不是更具体的`Int32`or `ObjectId`。

Javascript 的`instanceof`运算符不可靠。例如， `instanceof`将服务器响应中的 BSON 值分配给与用户提供的值不同的基类。

有关使用示例，请参阅[类型检查`$type()`](https://www.mongodb.com/docs/mongodb-shell/reference/data-types/#std-label-type-check-ex-type)和 [使用构造函数进行类型检查。](https://www.mongodb.com/docs/mongodb-shell/reference/data-types/#std-label-type-check-ex-constructor)

## 例子

### 以字符串形式返回日期

要以字符串形式返回日期，请使用`Date()`方法，如以下示例所示：

```
var myDateString = Date();
```

要打印变量的值，请在 shell 中键入变量名称，如下所示：

```
myDateString
```

结果是 的值`myDateString`：

```
Wed Dec 19 2012 01:03:25 GMT-0500 (EST)
```

要验证类型，请使用`typeof`运算符，如下所示：

```
typeof myDateString
```

操作返回`string`。

### 返回`Date`

`mongosh``Date`用助手包装类型 的对象`ISODate`；然而，对象仍然是类型`Date`。

下面的示例同时使用了`new Date()`构造函数和 `ISODate()`返回`Date`对象的构造函数。

```
var myDate = new Date();
var myDateInitUsingISODateWrapper = ISODate();
```

您也可以将`new`运算符与`ISODate()`构造函数一起使用。

要打印变量的值，请在 shell 中键入变量名称，如下所示：

```
myDate
```

结果是包装在 助手中`Date`的值：`myDate``ISODate()`

```
ISODate("2012-12-19T06:01:17.171Z")
```

要验证类型：

```
var myDate = ISODate("2021-03-21T06:00:00.171Z")
Object.prototype.toString.call(myDate) === "[object Date]"
```

操作返回`true`。

### 数值类型

考虑 `types`集合：

```
{ _id: 1, value: 1, expectedType: 'Int32' },
{ _id: 2, value: Long("1"), expectedType: 'Long' },
{ _id: 3, value: 1.01, expectedType: 'Double' },
{ _id: 4, value: Decimal128("1.01"), expectedType: 'Decimal128' },
{ _id: 5, value: 3200000001, expectedType: 'Double' }
```

`db.types.find( <QUERY> )` 此表显示相应命令的结果`<QUERY>`。类型名称和别名在[BSON 类型](https://www.mongodb.com/docs/manual/reference/bson-types/)页。

| 询问                                                   | 结果                                                         |
| :----------------------------------------------------- | :----------------------------------------------------------- |
| `{   "value":      {         $type: "int"      }}`     | `{   _id: 1,   value: 1,   expectedType: 'Int32'}`           |
| `{   "value":      {         $type: "long"      }}`    | `{   _id: 2,   value: Long("1"),   expectedType: 'Long'}`    |
| `{   "value":      {         $type: "decimal"      }}` | `{   _id: 4,   value: Decimal128("1"),   expectedType: 'Decimal128'}` |
| `{   "value":      {         $type: "double"      }}`  | `{   _id: 3,   value: 1.01,   expectedType: 'Double'}{   _id: 5,   value: 3200000001,   expectedType: 'Double'}` |
| `{   "value":      {         $type: "number"      }}`  | `{    _id: 1,    value: 1,    expectedType: 'Int32'}{    _id: 2,    value: Long("1"),    expectedType: 'Long'}{    _id: 3,    value: 1.01,    expectedType: 'Double'}{    _id: 4,    value: Decimal128("1.01"),    expectedType: 'Decimal128'}{    _id: 5,    value: 3200000001,    expectedType: 'Double'}` |
| `{    "value": 1.01}`                                  | `{    _id: 3,    value: 1.01,    expectedType: 'Double'}`    |
| `{    "value": 1}`                                     | `{    _id: 1,    value: 1,    expectedType: 'Int32'}{    _id: 2,    value: Long("1"),    expectedType: 'Long'}` |

查询`{ "value": 1.01 }`隐式搜索 `Double`的表示`1.01`。文件`_id: 4`是一个 `Decimal128`所以它没有被选中。

但是请注意，这`{ "value": 1 }`会同时返回`Int32`和 `Long`类型。

### 默认数值类型一致性

考虑`typeExample`集合。该集合包含两个相同的文档，`{ "a": 1 }`. 第一个文档是在遗留`mongo`shell 中创建的，第二个文档是在 `mongosh`.

我们可以使用[`$type`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/type/#mongodb-expression-exp.-type)聚合管道中的运算符以查看在每个 shell 中分配的类型。

```
db.typeExample.aggregate(
  [
    {
       $project:
         {
           "valueType":
             {
               "$type": "$a"
             },
           "_id": 0
         }
    }
  ]
)
```

在旧`mongo`shell 中创建的第一个文档中，该值存储为`double`. 在`mongosh`文档中，值存储为 type `int`。

```
[
  {
     valueType: 'double'  // inserted in legacy mongo shell
  },
  {
     valueType: 'int'     // inserted in mongosh
  }
]
```

### 为新文档添加时间戳

使用`Timestamp()`不带参数使用默认设置插入多个文档

```
db.flights.insertMany(
   [
      { arrival: "true", ts: Timestamp() },
      { arrival: "true", ts: Timestamp() },
      { arrival: "true", ts: Timestamp() }
   ]
)
```

运行`db.flights.find({})`以查看时间戳。请注意，即使所有三个条目都在同一秒内被标记，但每个条目的间隔都会增加。

```
[
   {
      _id: ObjectId("6114216907d84f5370391919"),
      arrival: 'true',
      ts: Timestamp({ t: 1628709225, i: 1 })
   },
   {
      _id: ObjectId("6114216907d84f537039191a"),
      arrival: 'true',
      ts: Timestamp({ t: 1628709225, i: 2 })
   },
   {
      _id: ObjectId("6114216907d84f537039191b"),
      arrival: 'true',
      ts: Timestamp({ t: 1628709225, i: 3 })
   }
]
```

### 创建自定义时间戳

使用自定义参数插入具有特定 `Timestamp`.

此操作将三个文档插入集合`flights`并使用[UNIX 纪元](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-unix-epoch)值`1627811580`将时间设置`ts`为 2021 年 8 月 1 日格林威治标准时间 9:53。

```
db.flights.insertMany(
   [
      { arrival: "true", ts: Timestamp(1627811580, 10) },
      { arrival: "true", ts: Timestamp(1627811580, 20) },
      { arrival: "true", ts: Timestamp(1627811580, 30) }
   ]
)
```

生成的文档如下所示：

```
[
   {
      _id: ObjectId("6123d8315e6bba6f61a1031c"),
      arrival: 'true',
      ts: Timestamp({ t: 1627811580, i: 10 })
   },
   {
      _id: ObjectId("6123d8315e6bba6f61a1031d"),
      arrival: 'true',
      ts: Timestamp({ t: 1627811580, i: 20 })
   },
   {
      _id: ObjectId("6123d8315e6bba6f61a1031e"),
      arrival: 'true',
      ts: Timestamp({ t: 1627811580, i: 30 })
   }
]
```

### 类型检查`$type()`

这[`$type`](https://www.mongodb.com/docs/manual/reference/operator/query/type/#mongodb-query-op.-type)查询运算符接受与数据类型对应的字符串别名或数字代码。看 [BSON 类型](https://www.mongodb.com/docs/manual/reference/bson-types/)获取 BSON 数据类型列表及其相应的数字代码。

例如，这些类型检查`Decimal128`是等效的：

```
db.types.find( { "value": { $type: "decimal" } } )
db.types.find( { "value": { $type: 19 } } )
```

### 使用构造函数进行类型检查

检查对象`constructor`以确定类型。例如，输出[`db.collection.find()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find)是一个`Cursor`。

```
var findResults = db.housing.find({"multiUnit": true} )
findResults.constructor.name     // Returns the type
```







翻译：韩鹏帅

原文：[Data Types](https://www.mongodb.com/docs/mongodb-shell/reference/data-types/)

