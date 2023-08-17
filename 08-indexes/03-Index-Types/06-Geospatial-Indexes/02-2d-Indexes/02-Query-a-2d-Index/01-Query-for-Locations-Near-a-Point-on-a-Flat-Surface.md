## 查询平面上某个点附近的位置

您可以查询出现在平面上指定点附近的位置数据。

要查询指定点附近的位置数据，请使用 [`$near`](https://www.mongodb.com/docs/v7.0/reference/operator/query/near/#mongodb-query-op.-near)运算符：

```
db.<collection>.find( {
   <location field> : {
      $near : {
         [ <longitude>, <latitude> ],
         $maxDistance : <distance in meters>
      }
    }
 } )
```

### 关于此任务

- 在运算符中指定坐标对时`$near`，首先列出 **经度**，然后列出**纬度**。
  - 有效的经度值介于`-180`和之间`180`（包含两者）。
  - 有效的纬度值介于`-90`和之间`90`（包含两者）。
- 指定字段中的距离（以**米**`$maxDistance`为单位） 。

### 在你开始之前

1. 创建`contacts`集合：

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

2. 要使用运算符查询位置数据，您必须在包含位置数据的字段上`$near`创建[地理空间索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-geospatial/#std-label-geospatial-index)

   在字段上创建二维索引`address`：

   ```
   db.contacts.createIndex( { address: "2d" } )
   ```

### 过程

用于`$near`查询集合。以下`$near`查询返回字段在`address`坐标对 50 米范围内的文档`[ -73.92, 40.78 ]`：

```
db.contacts.find( {
   address: {
      $near: [ -73.92, 40.78 ],
      $maxDistance : 50
   }
} )
```

输出：

```
[
   {
     _id: ObjectId("640a3dd9c639b6f094b00e89"),
     name: 'Georgine Lestaw',
     phone: '714-555-0107',
     address: [ -74, 44.74 ]
   }
]
```

结果按照距查询点的距离从最近到最远排序。

### 了解更多

- [`$near`](https://www.mongodb.com/docs/v7.0/reference/operator/query/near/#mongodb-query-op.-near)
- [`$geoNear`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)
- [地理空间索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/restrictions/#std-label-geospatial-restrictions)
- 要在球面上执行邻近查询，请参阅 [查询球体上点附近的位置。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/query/proximity-to-geojson/#std-label-2dsphere-query-geojson-proximity)