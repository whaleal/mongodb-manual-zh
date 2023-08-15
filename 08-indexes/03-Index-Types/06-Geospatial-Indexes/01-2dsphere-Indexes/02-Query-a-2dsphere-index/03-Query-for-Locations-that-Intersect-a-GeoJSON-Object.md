## 查询与 GeoJSON 对象相交的位置

您可以查询与[GeoJSON 对象](https://www.mongodb.com/docs/v7.0/reference/geojson/#std-label-geospatial-indexes-store-geojson)相交的位置数据。例如，考虑一个存储加油站坐标的应用程序。您可以创建表示公路旅行的 GeoJSON [LineString](https://www.mongodb.com/docs/v7.0/reference/geojson/#std-label-geojson-linestring)，并查询与公路旅行路线相交的加油站。

要查询与 GeoJSON 对象相交的位置数据，请使用[`$geoIntersects`](https://www.mongodb.com/docs/v7.0/reference/operator/query/geoIntersects/#mongodb-query-op.-geoIntersects)运算符：

```
db.<collection>.find( {
   <location field> : {
      $geoIntersects : {
         $geometry : {
            type : "<GeoJSON object type>",
            coordinates : [ <coordinates> ]
         }
       }
    }
 } )
```

### 关于此任务

- 当您指定经度和纬度坐标时，请先列出 **经度**，然后列出**纬度**。
  - 有效的经度值介于`-180`和之间`180`（包含两者）。
  - 有效的纬度值介于`-90`和之间`90`（包含两者）。
- 如果某个位置与指定对象至少共享一个点，则该位置与该对象相交。这包括具有共享边缘的对象。
- `$geoIntersects`不需要地理空间索引。但是，地理空间索引可以提高查询性能。仅[2dsphere](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)地理空间索引支持`$geoIntersects`. 有关详细信息，请参阅[创建 2dsphere 索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/create/#std-label-create-2dsphere-index)

### 在你开始之前

创建一个`gasStations`包含这些文档的集合：

```
db.gasStations.insertMany( [
   {
      loc: { type: "Point", coordinates: [ -106.31, 35.65 ] },
      state: "New Mexico",
      country: "United States",
      name: "Horizons Gas Station"
   },
   {
      loc: { type: "Point", coordinates: [ -122.62, 40.75 ] },
      state: "California",
      country: "United States",
      name: "Car and Truck Rest Area"
   },
   {
      loc: { type: "Point", coordinates: [ -72.71, 44.15 ] },
      state: "Vermont",
      country: "United States",
      name: "Ready Gas and Snacks"
   }
] )
```

### 过程

以下`$geoIntersects`查询指定`LineString` 包含四个点的点并返回与该线相交的文档：

```
db.gasStations.find( {
   loc: {
      $geoIntersects: {
         $geometry: {
            type: "LineString",
            coordinates: [
               [ -105.82, 33.87 ],
               [ -106.01, 34.09 ],
               [ -106.31, 35.65 ],
               [ -107.39, 35.98 ]
            ]
          }
      }
   }
} )
```

输出：

```
[
   {
     _id: ObjectId("63f658d45e5eefbdfef81ca4"),
     loc: { type: 'Point', coordinates: [ -106.31, 35.65 ] },
     state: 'New Mexico',
     country: 'United States',
     name: 'Horizons Gas Station'
   }
]
```

### 了解更多

- [`$geoIntersects`](https://www.mongodb.com/docs/v7.0/reference/operator/query/geoIntersects/#mongodb-query-op.-geoIntersects)
- [`LineString`](https://www.mongodb.com/docs/v7.0/reference/geojson/#std-label-geojson-linestring)
- [查询多边形边界的位置](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/query/geojson-bound-by-polygon/#std-label-2dsphere-query-geojson-objects-polygon)
- [地理空间索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/restrictions/#std-label-geospatial-restrictions)