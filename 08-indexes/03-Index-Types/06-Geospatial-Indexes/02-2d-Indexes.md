## 二维索引

二维索引支持对存储为 [二维平面](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-geometry)上的点的数据进行查询。2d 索引用于对[旧坐标对的查询。](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-legacy)

要创建二维索引，请将字符串指定`2d`为索引类型：

```
db.<collection>.createIndex( { <location field> : "2d" } )
```

您不能使用 2d 索引来查询[GeoJSON](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-GeoJSON)对象。要启用对 GeoJSON 对象的查询，请使用[2dsphere索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)

### 用例

使用二维索引对二维平面内表示的数据进行查询和计算。例如：

- 一款分析两件艺术作品之间视觉相似性的应用程序。
- 可以对二维图形进行计算的计算器。
- 一款计算二维地图上玩家之间距离的手机游戏。

### 开始使用

要了解如何创建和查询二维索引，请参阅：

- [创建二维索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/create/#std-label-2d-index-create)
- [查询平面上某个点附近的位置](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/query/proximity-flat-surface/#std-label-2d-index-proximity-query)
- [查询平面上形状内的位置](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/query/points-within-a-shape/#std-label-2d-index-query-within-flat-shape)

### 细节

#### 支持的计算

2D索引支持在平面欧几里得空间上进行计算

对于球面几何计算，将数据存储为 [GeoJSON 对象](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-geojson)并使用 2dsphere 索引来支持地理空间查询。

### 复合二维索引

您可以创建引用两个字段的复合二维索引：

- 第一个字段必须是位置字段。索引构造首先选择该字段的查询。
- 第二个字段根据附加条件进一步过滤结果。

复合二维索引可以覆盖查询。

### 稀疏属性

2d 索引始终是[稀疏的](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-index-type-sparse)并忽略[稀疏](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-index-type-sparse)选项。如果文档缺少 2d 索引字段（或者该字段是`null`空数组），MongoDB 不会将该文档的条目添加到 2d 索引。对于插入，MongoDB 会插入文档，但不会添加到二维索引中。

对于包含二维索引键和其他类型键的复合索引，只有二维索引字段决定索引是否引用文档。

### 了解更多

- [地理空间查询](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-queries)
- [查询 2dsphere 索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/query/#std-label-2dsphere-index-query)
- [地理空间索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/restrictions/#std-label-geospatial-restrictions)