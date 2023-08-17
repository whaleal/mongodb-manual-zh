### 创建 2dsphere 索引

2dsphere 索引支持类地球体上的地理空间查询。例如，2dsphere 索引可以：

- 确定指定区域内的点。
- 计算与指定点的接近度。
- 返回坐标查询的精确匹配。

要创建 2dsphere 索引，请使用该 [`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)方法并指定字符串 `"2dsphere"`作为索引类型：

```
db.<collection>.createIndex( { <location field> : "2dsphere" } )
```

中的值`<location field>`必须是：

- [GeoJSON 对象](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-geojson)
- [旧坐标对](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-legacy)

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

该字段中的值`loc`是[GeoJSON 点。](https://www.mongodb.com/docs/v7.0/reference/geojson/#std-label-geojson-point)

### 过程

以下操作在位置字段上创建 2dsphere 索引 `loc`：

```
db.places.createIndex( { loc : "2dsphere" } )
```

### 下一步

创建 2dsphere 索引后，您可以使用该索引进行地理空间查询。要了解更多信息，请参阅[查询 2dsphere 索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/query/#std-label-2dsphere-index-query)

### 了解更多

- [2dsphere 索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)
- [地理空间查询](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-queries)
- [地理空间索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/restrictions/#std-label-geospatial-restrictions)