## 查询平面上形状内的位置

要查询平面上指定形状内的位置数据，请使用[`$geoWithin`](https://www.mongodb.com/docs/v7.0/reference/operator/query/geoWithin/#mongodb-query-op.-geoWithin)运算符。要使用`$geoWithin`出现在平面上的数据，请使用以下语法：

```
db.<collection>.find( {
   <location field> : {
      $geoWithin : {
         <shape operator> : <coordinates>
      }
    }
 } )
```

将这些值替换为您的查询：

| 字段               | 描述                                                         |
| :----------------- | :----------------------------------------------------------- |
| `<collection>`     | 要查询的集合。                                               |
| `<location field>` | 包含您的位置数据的字段。对于平面上的查询，您的数据必须存储为[旧坐标对。](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-legacy) |
| `<shape operator>` | 要在其中查询的形状。您可以指定以下形状之一：[`$box`](https://www.mongodb.com/docs/v7.0/reference/operator/query/box/#mongodb-query-op.-box)[`$polygon`](https://www.mongodb.com/docs/v7.0/reference/operator/query/polygon/#mongodb-query-op.-polygon)[`$center`](https://www.mongodb.com/docs/v7.0/reference/operator/query/center/#mongodb-query-op.-center)（定义一个圆）本页上的示例使用`$box`运算符。要查看使用其他形状的查询示例，请参阅这些运算符页面。 |
| `<coordinates>`    | 定义要在其中查询的形状边缘的坐标。与`$box`运算符一起使用时，坐标表示矩形的左下角和右上角。当您指定经度和纬度坐标时，请先列出 **经度**，然后列出**纬度**。有效的经度值介于`-180`和之间`180`（包含两者）。有效的纬度值介于`-90`和之间`90`（包含两者）。 |

### 关于此任务

`$geoWithin`不需要地理空间索引。但是，地理空间索引可以提高查询性能。

### 在你开始之前

创建`contacts`集合：

```
db.contacts.insertMany( [
   {
      name: "Evander Otylia",
      phone: "202-555-0193",
      address: [ 55.5, 42.3 ]
   },
   {
      name: "Georgine Lestaw",
      phone: "714-555-0107",
      address: [ -74, 44.74 ]
   }
] )
```

该`address`字段包含[旧坐标对。](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-legacy)

### 过程

用于`$geoWithin`查询`contacts`集合。以下 `$geoWithin`查询使用[`$box`](https://www.mongodb.com/docs/v7.0/reference/operator/query/box/#mongodb-query-op.-box)运算符返回出现在指定矩形内的文档：

```
db.contacts.find( {
   address: {
      $geoWithin: {
         $box: [ [ 49, 40 ], [ 60, 60 ] ]
      }
   }
} )
```

输出：

```
[
  {
    _id: ObjectId("647e4e496cdaf4dc323ec92a"),
    name: 'Evander Otylia',
    phone: '202-555-0193',
    address: [ 55.5, 42.3 ]
  }
]
```

运算符的值`$box`表示要在其中查询的矩形的左下角和右上角。

前面显示的查询`$geoWithin`返回具有以下顶点的矩形内的文档：

- `[ 49, 40 ]`
- `[ 49, 60 ]`
- `[ 60, 60 ]`
- `[ 60, 40 ]`

### 了解更多

要了解如何对`$geoWithin`其他形状使用该运算符，请参阅以下页面：

- 要在多边形内查询，请参阅[`$polygon`。](https://www.mongodb.com/docs/v7.0/reference/operator/query/polygon/#mongodb-query-op.-polygon)
- 要在圆内查询，请参见[`$center`。](https://www.mongodb.com/docs/v7.0/reference/operator/query/center/#mongodb-query-op.-center)