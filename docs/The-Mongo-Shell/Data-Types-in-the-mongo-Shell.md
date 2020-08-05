
## mongo Shell中的数据类型
**在本页面**

* [类型](#类型)

  * [Date](#date)
  * [ObjectId](#objectid)
  * [NumberLong](#numberlong)
  * [NumberInt](#numberint)
  * [NumberDecimal](#decimal)

* [在mongo Shell中检查类型](#检查)
  * [instanceof](#instanceof)
  * [typeof](#typof)

     

  

  **MongoDB BSON**支持除JSON本身支持类型之外的其他数据类型。 驱动程序以宿主语言为这些数据类型提供本机支持，而mongo shell还提供了一些帮助程序类来支持在mongo JavaScript shell中使用这些数据类型。 有关其他信息，请参见扩展JSON参考。  

  

  ### <span id="类型">**类型**</span>

####   <span id="date">Date</span>

mongo shell提供了多种返回日期的方法，这些方法可以是字符串，也可以是Date对象：  

  * **Date()** 方法，以字符串形式返回当前日期。  
  * **new Date()** 构造函数，该构造函数使用`ISODate()`包装器返回Date对象。
  * **ISODate()** 构造函数，该构造函数使用`ISODate()`包装器返回Date对象。

      

在内部，Date对象存储为带符号的64位整数，表示自Unix纪元（1970年1月1日）以来的毫秒数。  并非所有的数据库操作和驱动程序都支持完整的64位范围。 您可以安全地处理年份，年份范围在0到9999之间。  
**以字符串类型返回日期**<br />以字符串类型返回日期，要用到Data()方法，如下所示：

```shell
var myDateString = Date();
```

 要打印变量的值，请在shell中键入变量名称，如下所示：
    
 ```shell
myDateString
 ```

 myDataString值的结果如下：
    
 ```shell
Wed Dec 19 2012 01:03:25 GMT-0500 (EST)
 ```

 要验证类型，请使用typeof运算符，如下所示：
    
 ```shell
typeof myDateString
 ```

 该操作返回值为 **String**   

**Return Date**

mongo shell使用`ISODate`帮助程序包装Date类型的对象； 但是，对象仍为日期类型。  

下面的示例使用新的**Date()**构造函数和**ISODate()**构造函数来返回Date对象。  

```shell
var myDate = new Date();
var myDateInitUsingISODateWrapper = ISODate();
```

您也可以将new运算符与**ISODate()**构造函数一起使用。  
要打印变量的值，请在shell中键入变量名称，如下所示：

```shell
myDate
```

结果是包装在**ISODate()** 帮助器中的myDate的Date值：

```shell
ISODate("2012-12-19T06:01:17.171Z")
```

要验证类型，请使用instanceof运算符，如下所示：

```shell
myDate instanceof Date
myDateInitUsingISODateWrapper instanceof Date
```

这两个操作均返回`true` 

#### <span id="objectid">**ObjectID**</span>

  mongo shell提供了围绕ObjectId数据类型的ObjectId（）封装类。 要生成新的ObjectId，请在mongo shell中使用以下操作：

```shell
new ObjectId
```

参考：[ObjectId](https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId)<br />
#### <span id="numberlong">**NumberLong**</span>

 mongo shell默认情况下会将所有数字视为浮点型。mongo shell提供了**NumberLong()** 包装器来处理64位整数。<br />

**NumberLong()** 封装接受long作为字符串：

```shell
NumberLong("2090845886852")
```

以下示例使用NumberLong（）的封装写入集合：<br />

```shell
db.collection.insertOne( { _id: 10, calc: NumberLong("2090845886852") } )
db.collection.updateOne( { _id: 10 },         
					{ $set:  { calc: NumberLong("2555555000000") } } )
db.collection.updateOne( { _id: 10 },       
					{ $inc: { calc: NumberLong(5) } } )
```

检索文档以验证：

```shell
db.collection.findOne( { _id: 10 } )
```

在返回的文档中，calc字段包含一个NumberLong对象：

```shell
{ "_id" : 10, "calc" : NumberLong("2555555000005") }
```

如果使用`$inc` 通过浮点数递增包含NumberLong对象的字段的值，则数据类型将更改为浮点值，如以下示例所示：  

1.使用`$inc` 将calc字段增加 5，mongo shell将其视为浮点数：

```shell
db.collection.updateOne( { _id: 10 },
							{ $inc: { calc: 5 } } )
```

2.检索更新的文档：

```shell
db.collection.findOne( { _id: 10 } )
```

在更新的文档中，calc字段包含一个浮点值：

```shell
{ "_id" : 10, "calc" : 2555555000010 }
```

#### <span id="numberint">**NumberInt**</span>

  mongo shell默认情况下会将所有数字视为浮点值。 mongo shell提供**NumberInt()**构造函数来显式指定32位整数。<br />

#### <span id="decimal">**NumberDecimal**</span>
**始于3.4版本**  
mongo shell默认将所有数字视为64位浮点双精度值。 mongo shell提供了**NumberDecimal()**构造函数来显式指定基于128位的基于十进制的浮点值，该值能够精确地模拟十进制舍入。 此功能适用于处理货币数据的应用程序，例如金融、税收和科学计算。<br />十进制BSON类型使用IEEE 754十进制128浮点编号格式，该格式支持34个十进制数字（即有效数字）和-6143至+6144的指数范围。<br />NumberDecimal（）构造函数接受十进制值作为字符串：

```shell
NumberDecimal("1000.55")
```

该值存储在数据库中，如下所示：

```shell
NumberDecimal("1000.55")
```

**NumberDecimal()**构造函数还接受mongo shell中的双精度值（即不带引号），尽管不建议这样做，因为这样做可能会丢失精度。 构造函数创建基于二进制的双精度表示形式的基于十进制的参数（可能会丢失精度），然后将该值转换为精度为15位数字的十进制值。 下面的示例隐式地将值作为双精度值传递，并显示如何以15位精度创建值：

```shell
NumberDecimal(1000.55)
```

该值存储在数据库中，如下所示：

```shell
NumberDecimal("1000.55000000000")
```

下面的示例隐式地将该值作为双精度值传递，并说明如何发生精度损失：

```shell
NumberDecimal(9999999.4999999999)
```

该值存储在数据库中，如下所示：

```shell
NumberDecimal("9999999.50000000")
```

> **注意**<br />**要将十进制数据类型与MongoDB驱动程序一起使用，请确保使用支持该格式的驱动程序版本。**<br />

###  **相等和排序**  

比较十进制类型的值，并根据其实际数字值与其他数字类型进行排序。 基于二进制的double类型的数值通常具有基于十进制值的近似表示，并且可能不完全等于其十进制表示，因此在检查十进制值的相等性时，请使用**NumberDecimal()**构造函数。 考虑以下示例以及带有数字集合中的以下文档：

```shell
{ "_id" : 1, "val" : NumberDecimal( "9.99" ), "description" : "Decimal" }
{ "_id" : 2, "val" : 9.99, "description" : "Double" }
{ "_id" : 3, "val" : 10, "description" : "Double" }
{ "_id" : 4, "val" : NumberLong(10), "description" : "Long" }
{ "_id" : 5, "val" : NumberDecimal( "10.0" ), "description" : "Decimal" }
```

将下表中的查询插入`db.numbers.find（<query>）`方法时，将返回以下结果：

| 查询(Query) | 结果（Results） |
| --- | --- |
| **{ “val”: 9.99 }** | **{ “_id”: 2, “val”: 9.99, “description”: “Double” }** |
| **{ “val”: NumberDecimal( “9.99” ) }** | **{ “_id”: 1, “val”: NumberDecimal( “9.99” ), “description”: “Decimal” }** |
| **{ val: 10 }** | **{ “_id”: 3, “val”: 10, “description”: “Double” }**<br />**{ “_id”: 4, “val”: NumberLong(10), “description”: “Long” }**<br />**{ “_id”: 5, “val”: NumberDecimal( “10.0” ), “description”: “Decimal” }** |
| **{ val: NumberDecimal( “10” ) }** | **{ “_id”: 3, “val”: 10, “description”: “Double” }**<br />**{ “_id”: 4, “val”: NumberLong(10), “description”: “Long” }**<br />**{ “_id”: 5, “val”: NumberDecimal( “10.0” ), “description”: “Decimal” }** |

第一个查询 **{“ val”：9.99}** 隐式搜索9.99的双精度表示形式，该表示形式不等于该值的十进制表示形式。<br />
**NumberDecimal()** 构造函数用于查询以9.99十进制表示的文档。 排除双精度类型的值，因为它们与9.99的十进制表示形式的确切值不匹配。<br />
查询整数时，将返回所有数字类型的匹配值。 例如，查询10的双精度表示将在结果中包含10.0的十进制表示，反之亦然。<br /> 
**检查十进制类型**<br />

要测试十进制类型，请使用`$type `运算符，其字符串别名为“decimal”或19（十进制类型的数字代码）。

```shell
db.inventory.find( { price: { $type: "decimal" } } )
```

###  <span id="检查">**在mongo Shell中检查类型**</span>

为了确定字段的类型，mongo shell提供了instanceof和typeof运算符。<br />
#### <span id="instanceof">**instanceof**</span>

instanceof返回一个布尔值，以测试值是否是某种类型的实例。<br />
例如，以下操作测试_id字段是否为ObjectId类型的实例：

```shell
mydoc._id instanceof ObjectId
```

该操作返回true。<br />

#### <span id="typof">**typeof**</span>

typeof返回字段的类型。<br />

例如，以下操作返回_id字段的类型：

```
typeof mydoc._id
```

在这种情况下，typeof将返回更通用的**object** 类型，而不是**ObjectId**类型。


