#  比较/排序命令

在本页面

* [Numeric Types](https://docs.mongodb.com/manual/reference/bson-type-comparison-order/numeric-types)
* [Strings](https://docs.mongodb.com/manual/reference/bson-type-comparison-order/strings)
* [Arrays](https://docs.mongodb.com/manual/reference/bson-type-comparison-order/arrays)
* [Dates and Timestamps](https://docs.mongodb.com/manual/reference/bson-type-comparison-order/dates-and-timestamps)
* [Non-existent Fields](https://docs.mongodb.com/manual/reference/bson-type-comparison-order/non-existent-fields)
* [BinData](https://docs.mongodb.com/manual/reference/bson-type-comparison-order/bindata)

 MongoDB在比较不同[BSON types](https://www.mongodb.com/docs/v6.0/reference/bson-types/#std-label-bson-types)的值时，按照从低到高的顺序进行比较:

1. MinKey (内部类型)
2. Null
3.  数字(`ints, longs, doubles, decimals`)
4. Symbol, String
5. Object
6. Array
7. BinData
8. ObjectId
9. Boolean
10. Date
11. Timestamp
12. Regular Expression
13. MaxKey (internal type)

 

## 数字类型

为了便于比较，`MongoDB`将某些类型视为等效的。例如，数值类型在比较之前进行转换



## Strings

### 二进制比较

默认情况下，`MongoDB`使用简单的二进制比较来比较字符串。

### 排序规则

排序规则允许用户为字符串比较指定特定于语言的规则，例如字母大小写和重音标记的规则

排序规则规范的语法如下:

```javascript
{
   locale: <string>,
   caseLevel: <boolean>,
   caseFirst: <string>,
   strength: <int>,
   numericOrdering: <boolean>,
   alternate: <string>,
   maxVariable: <string>,
   backwards: <boolean>
}
```

 在指定排序规则时，区域设置字段是强制的;所有其他排序字段都是可选的。用于字段的描述，参见 [Collation Document.](https://www.mongodb.com/docs/v6.0/reference/collation/#std-label-collation-document-fields)。

 如果没有为集合或操作指定排序规则，`MongoDB`将使用以前版本中使用的简单二进制比较进行字符串比较。



## 数组

在数组比较中:

- 小于比较或升序排序根据`BSON`类型排序顺序比较数组中最小的元素。
- 大于比较或降序排序是根据反向`BSON`类型排序顺序比较数组中最大的元素。
- 当比较值为单元素数组的字段(例如`[1]`)与非数组字段(例如`2`)时，比较值为`1`和`2`。
- 空数组的比较(例如，`[]`)认为空数组小于空值或缺少字段值。



## Objects

` MongoDB`对`BSON`对象的比较顺序如下:

1.  递归地比较键值对在`BSON`对象中出现的顺序。
2. 比较字段类型。MongoDB对字段类型使用以下比较顺序，从低到高:
   1. MinKey (internal type)
   2. Null
   3. Numbers (ints, longs, doubles, decimals)
   4. Symbol, String
   5. Object
   6. Array
   7. BinData
   8. ObjectId
   9. Boolean
   10. Date
   11. Timestamp
   12. Regular Expression
   13. MaxKey (internal type)
3. 如果字段类型相等，则比较 [key field names.](https://www.mongodb.com/docs/v6.0/core/document/#std-label-document-field-names)。
4.  如果`key field`段名称相等，则比较字段值。
5.  如果字段值相等，则比较下一个键/值对(返回步骤1)。



## 日期和时间戳

日期对象排在时间戳对象之前。



##  不存在的字段

比较将不存在的字段视为空`BSON`对象。 因此，对文档`{}`和`{a: null}`中的`a`字段进行排序在排序顺序上将文件视为等价的。



## BinData

`MongoDB`对`BinData`的排序顺序如下:

1. 首先，数据的长度或大小。
2.  然后，由`BSON`单字节子类型。
3.  最后，对数据进行逐字节比较。



原文链接：https://www.mongodb.com/docs/v6.0/reference/bson-type-comparison-order/

译者：杨帅

