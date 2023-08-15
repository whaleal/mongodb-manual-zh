## 查询球体上某个点附近的位置

您可以查询球体上指定点附近出现的位置数据。

要查询指定点附近的位置数据，请使用 [`$near`](https://www.mongodb.com/docs/v7.0/reference/operator/query/near/#mongodb-query-op.-near)运算符：

```
db.<collection>.find( {
   <location field> : {
      $near : {
         $geometry : {
            type : "Point",
            coordinates : [ <longitude>, <latitude> ]
         },
         $maxDistance : <distance in meters>
      }
    }
 } )
```

### 关于此任务

- 当您指定经度和纬度坐标时，请先列出 **经度**，然后列出**纬度**。
  - 有效的经度值介于`-180`和之间`180`（包含两者）。
  - 有效的纬度值介于`-90`和之间`90`（包含两者）。
- 指定字段中的距离（以**米**`$maxDistance`为单位） 。

### 在你开始之前

1. 创建一个`places`包含这些文档的集合：

   ```
   db.places.insertMany( [
      {
         loc: { type: "Point", coordinates: [ -73.97, 40.77 ] },
         name: "Central Park",
         category : "Park"
      },
      {
         loc: { type: "Point", coordinates: [ -73.88, 40.78 ] },
         name: "La Guardia Airport",
         category: "Airport"
      },
      {
         loc: { type: "Point", coordinates: [ -1.83, 51.18 ] },
         name: "Stonehenge",
         category : "Monument"
      }
   ] )
   ```

   该字段中的值`loc`是[GeoJSON 点。](https://www.mongodb.com/docs/v7.0/reference/geojson/#std-label-geojson-point)

2. 要使用运算符查询位置数据，您必须在包含位置数据的字段上`$near`创建[地理空间索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-geospatial/#std-label-geospatial-index)

   在字段上创建 2dsphere 索引`loc`：

   ```
   db.places.createIndex( { "loc": "2dsphere" } )
   ```

### 过程

用于`$near`查询集合。以下`$near`查询返回包含`loc`位于 的 GeoJSON 点 5000 米范围内的字段的文档`[ -73.92, 40.78 ]`：

```
db.places.find( {
   loc: {
      $near: {
         $geometry: {
            type: "Point",
            coordinates: [ -73.92, 40.78 ]
         },
         $maxDistance : 5000
      }
   }
} )
```

输出：

```
[
  {
    _id: ObjectId("63f7c3b15e5eefbdfef81cab"),
    loc: { type: 'Point', coordinates: [ -73.88, 40.78 ] },
    name: 'La Guardia Airport',
    category: 'Airport'
  },
  {
    _id: ObjectId("63f7c3b15e5eefbdfef81caa"),
    loc: { type: 'Point', coordinates: [ -73.97, 40.77 ] },
    name: 'Central Park',
    category: 'Park'
  }
]
```

结果按照距查询点的距离从最近到最远排序。

### 了解更多

- [`$near`](https://www.mongodb.com/docs/v7.0/reference/operator/query/near/#mongodb-query-op.-near)
- [`$nearSphere`](https://www.mongodb.com/docs/v7.0/reference/operator/query/nearSphere/#mongodb-query-op.-nearSphere)
- [`$geoNear`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)
- [`Point`](https://www.mongodb.com/docs/v7.0/reference/geojson/#std-label-geojson-point)
- [地理空间索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/restrictions/#std-label-geospatial-restrictions)