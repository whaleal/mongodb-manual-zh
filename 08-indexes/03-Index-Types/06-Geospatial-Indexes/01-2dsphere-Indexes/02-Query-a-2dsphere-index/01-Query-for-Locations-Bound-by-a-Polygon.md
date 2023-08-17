## 查询被多边形边界所包围的位置

您可以查询指定多边形周长内的位置数据。

要查询周长内的位置数据，请使用 [`$geoWithin`](https://www.mongodb.com/docs/v7.0/reference/operator/query/geoWithin/#mongodb-query-op.-geoWithin)运算符并指定多边形顶点的坐标：

```
db.<collection>.find( {
   <location field> : {
      $geoWithin : {
         $geometry : {
            type : "Polygon",
            coordinates : [ <coordinates> ]
         }
       }
    }
 } )
```

### 关于此任务

- 使用运算符查询的字段中的值`$geoWithin`必须为 GeoJSON 格式。
- 当您指定经度和纬度坐标时，请先列出 **经度**，然后列出**纬度**。
  - 有效的经度值介于`-180`和之间`180`（包含两者）。
  - 有效的纬度值介于`-90`和之间`90`（包含两者）。
- 当您指定 Polygon 时`coordinates`，数组中的第一个和最后一个坐标必须相同。这封闭了多边形的边界。
- `$geoWithin`不需要地理空间索引。但是，地理空间索引可以提高查询性能。仅[2dsphere](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)地理空间索引支持`$geoWithin`. 有关详细信息，请参阅[创建 2dsphere 索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/create/#std-label-create-2dsphere-index)

### 在你开始之前

创建一个`places`包含这些文档的集合：

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

### 过程

用于`$geoWithin`查询集合。以下`$geoWithin` 查询指定具有四个顶点的多边形（矩形）并返回该多边形内的点：

```
db.places.find( {
   loc: {
      $geoWithin: {
         $geometry: {
            type: "Polygon",
            coordinates: [ [
               [ -73.95, 40.80 ],
               [ -73.94, 40.79 ],
               [ -73.97, 40.76 ],
               [ -73.98, 40.76 ],
               [ -73.95, 40.80 ]
            ] ]
          }
      }
   }
} )
```

输出：

```
[
  {
    _id: ObjectId("63a4a8d67348ebdcd0a061f0"),
    loc: { type: 'Point', coordinates: [ -73.97, 40.77 ] },
    name: 'Central Park',
    category: 'Park'
  }
]
```

### 了解更多

- [`$geoWithin`](https://www.mongodb.com/docs/v7.0/reference/operator/query/geoWithin/#mongodb-query-op.-geoWithin)
- [`Polygon`](https://www.mongodb.com/docs/v7.0/reference/geojson/#std-label-geojson-polygon)
- [地理空间索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/restrictions/#std-label-geospatial-restrictions)