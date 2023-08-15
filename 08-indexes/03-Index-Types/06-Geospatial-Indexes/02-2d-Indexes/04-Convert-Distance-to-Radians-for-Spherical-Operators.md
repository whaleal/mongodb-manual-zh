## 将球面运算符的距离转换为弧度

2d 索引支持某些使用球面几何计算距离的查询运算符。球形查询运算符使用弧度表示距离。要将球形查询运算符与 2d 索引一起使用，您必须将距离转换为弧度。

2d 索引支持以下球形查询运算符：

- [`$centerSphere`](https://www.mongodb.com/docs/v7.0/reference/operator/query/centerSphere/#mongodb-query-op.-centerSphere)
- [`$geoNear`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)`spherical: true` 具有选项的管道阶段
- [`$near`](https://www.mongodb.com/docs/v7.0/reference/operator/query/near/#mongodb-query-op.-near)
- [`$nearSphere`](https://www.mongodb.com/docs/v7.0/reference/operator/query/nearSphere/#mongodb-query-op.-nearSphere)

### 关于此任务

使用二维索引查询球形数据可能会返回不正确的结果或错误。例如，二维索引不支持围绕极点的球形查询。

如果您的数据存储为经度和纬度，并且您经常在球面上运行查询，请使用[2dsphere 索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)而不是 2d 索引。

当您指定经度和纬度坐标时，请先列出 **经度**，然后列出**纬度**。

- 有效的经度值介于`-180`和之间`180`（包含两者）。
- 有效的纬度值介于`-90`和之间`90`（包含两者）。

### 过程

要将距离转换为弧度，请将距离除以球体（例如地球）的半径，其单位与距离测量值的单位相同。

地球赤道半径约为 3,963.2 英里或 6,378.1 公里。

### 例子

以下示例使用[`$centerSphere`](https://www.mongodb.com/docs/v7.0/reference/operator/query/centerSphere/#mongodb-query-op.-centerSphere)运算符来执行查询。运算`$centerSphere`符使用弧度来计算距离。

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

### 将英里转换为弧度

以下查询返回字段位于以200 英里为中心、半径为圆心的`address`圆内的文档：`[ -72, 44 ]`

```
db.contacts.find(
   {
      address:
         {
            $geoWithin:
               {
                  $centerSphere:
                     [
                        [ -72, 44 ] ,
                        200 / 3963.2
                     ]
               }
         }
   }
)
```

输出：

```
[
  {
    _id: ObjectId("647e565c6cdaf4dc323ec92d"),
    name: 'Georgine Lestaw',
    phone: '714-555-0107',
    address: [ -74, 44.74 ]
  }
]
```

在前面的查询中，要将 200 英里转换为弧度，需要将指定的英里除以 3963.2。

### 将千米转换为弧度

以下查询返回字段位于以500 公里为中心、半径为圆心的`address`圆内的文档：`[ 55, 42 ]`

```
db.contacts.find(
   {
      address:
         {
            $geoWithin:
               {
                  $centerSphere:
                     [
                        [ 55, 42 ] ,
                        500 / 6378.1
                     ]
               }
         }
   }
)
```

输出：

```
[
  {
    _id: ObjectId("647e565c6cdaf4dc323ec92c"),
    name: 'Evander Otylia',
    phone: '202-555-0193',
    address: [ 55.5, 42.3 ]
  }
]
```

在前面的查询中，为了将 500 公里转换为弧度，指定的公里数除以 6378.1。

