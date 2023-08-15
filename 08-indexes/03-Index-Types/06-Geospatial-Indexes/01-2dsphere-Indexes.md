## 2dsphere 索引

2dsphere 索引支持类地球体上的地理空间查询。例如，2dsphere 索引可以：

- 确定指定区域内的点。
- 计算与指定点的接近度。
- 返回坐标查询的精确匹配。

索引字段的值必须是：

- [GeoJSON 对象](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-geojson)

- [旧坐标对](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-legacy)

  对于旧坐标对，2dsphere 索引将数据转换为 [GeoJSON 点。](https://www.mongodb.com/docs/v7.0/reference/geojson/#std-label-geojson-point)

要创建 2dsphere 索引，请将字符串指定`2dsphere`为索引类型：

```
db.<collection>.createIndex( { <location field> : "2dsphere" } )
```

### 用例

使用 2dsphere 索引对数据点出现在地球或其他球面上的位置数据进行查询和执行计算。例如：

- 食品配送应用程序使用 2dsphere 索引来支持搜索附近的餐馆。
- 路线规划应用程序使用 2dsphere 索引来计算休息站之间的最短距离。
- 城市规划者使用 2dsphere 索引来查找城市范围内存在的公园。

### 开始使用

要了解如何创建和查询 2dsphere 索引，请参阅：

- [创建 2dsphere 索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/create/#std-label-2dsphere-index-create)
- [查询多边形边界的位置](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/query/geojson-bound-by-polygon/#std-label-2dsphere-query-geojson-objects-polygon)
- [查询球体上某个点附近的位置](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/query/proximity-to-geojson/#std-label-2dsphere-query-geojson-proximity)
- [查询与 GeoJSON 对象相交的位置](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/query/intersections-of-geojson-objects/#std-label-2dsphere-query-intersection)
- [查询球体上圆内的位置](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/query/points-within-circle-on-sphere/#std-label-2dsphere-query-points-within-circle-on-sphere)

### 细节

2dsphere 索引始终是[稀疏的，并且在作为](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-index-type-sparse)[复合索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound)的一部分创建时具有特殊行为[。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound)

### 稀疏属性

2dsphere 索引始终是[稀疏的](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-index-type-sparse)。当您创建 2dsphere 索引时，MongoDB 会忽略该`sparse`选项。

如果现有或新插入的文档不包含 2dsphere 索引字段（或者该字段是`null`空数组），MongoDB 不会将该文档的条目添加到索引中。

### 复合 2dsphere 索引

- 对于包含 2dsphere 索引键和其他类型键的复合索引，只有 2dsphere 索引字段决定索引是否引用文档。
- 复合 2dsphere 索引可以引用多个位置和非位置字段。相反，复合[二维](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/#std-label-2d-index) 索引只能引用一个位置字段和另一个字段。

### 了解更多

- [地理空间查询](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-queries)
- [地理空间查询运算符](https://www.mongodb.com/docs/v7.0/reference/operator/query-geospatial/#std-label-geospatial-query-operators)
- [通过地理空间查询查找餐厅](https://www.mongodb.com/docs/v7.0/tutorial/geospatial-tutorial/#std-label-geospatial-tutorial-restaurants)
- [地理空间索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/restrictions/#std-label-geospatial-restrictions)