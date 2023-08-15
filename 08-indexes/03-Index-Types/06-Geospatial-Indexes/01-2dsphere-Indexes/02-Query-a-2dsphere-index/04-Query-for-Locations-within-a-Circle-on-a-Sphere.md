## 查询球体上在圆内的位置

您可以查询球体表面上位于圆内的位置数据。使用这些查询来返回位于[球冠](https://en.wikipedia.org/w/index.php?title=Spherical_cap&oldid=1107980309)内的数据。

要查询球体上的圆内的位置数据，请使用 [`$geoWithin`](https://www.mongodb.com/docs/v7.0/reference/operator/query/geoWithin/#mongodb-query-op.-geoWithin)with[`$centerSphere`](https://www.mongodb.com/docs/v7.0/reference/operator/query/centerSphere/#mongodb-query-op.-centerSphere)运算符。在 `$centerSphere`运算符中，指定要查询的圆的坐标和半径：

```
db.<collection>.find( {
   <location field> : {
      $geoWithin : {
         $centerSphere: [
            [ <longitude>, <latitude> ],
            <radius>
         ]
       }
    }
 } )
```

### 关于此任务

- 当您指定经度和纬度坐标时，请先列出 **经度**，然后列出**纬度**。
  - 有效的经度值介于`-180`和之间`180`（包含两者）。
  - 有效的纬度值介于`-90`和之间`90`（包含两者）。
- 在运算符中，以**弧度**`$centerSphere`指定圆的半径 。要将其他单位与弧度相互转换，请参阅[将球面运算符的距离转换为弧度](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/calculate-distances/#std-label-calculate-distance-spherical-geometry)[。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/calculate-distances/#std-label-calculate-distance-spherical-geometry)
  - 此示例计算以公里为单位的距离。要将公里转换为弧度，请将公里值除以`6378.1`。
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

要查询集合，请`$geoWithin`与`$centerSphere` 运算符一起使用：

```
db.places.find( {
   loc: {
      $geoWithin: {
         $centerSphere: [
            [ -1.76, 51.16 ],
            10 / 6378.1
         ]
      }
   }
} )
```

该查询返回字段位于 longitude , latitude `loc`点的 10 公里半径范围内的文档。`-1.76``51.16`

输出：

```
[
   {
     _id: ObjectId("63fd205e4a08b5e248c03e32"),
     loc: { type: 'Point', coordinates: [ -1.83, 51.18 ] },
     name: 'Stonehenge',
     category: 'Monument'
   }
]
```

### 了解更多

- [`$geoWithin`](https://www.mongodb.com/docs/v7.0/reference/operator/query/geoWithin/#mongodb-query-op.-geoWithin)
- [`$centerSphere`](https://www.mongodb.com/docs/v7.0/reference/operator/query/centerSphere/#mongodb-query-op.-centerSphere)
- [查询多边形边界的位置](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/query/geojson-bound-by-polygon/#std-label-2dsphere-query-geojson-objects-polygon)
- [查询与 GeoJSON 对象相交的位置](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/query/intersections-of-geojson-objects/#std-label-2dsphere-query-intersection)
- [查询球体上某个点附近的位置](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/query/proximity-to-geojson/#std-label-2dsphere-query-geojson-proximity)
- [地理空间索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/restrictions/#std-label-geospatial-restrictions)