## 定义 2d 索引的位置精度

在二维索引中，位置精度由用于存储索引数据的[geohash](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-geohash)值的大小（以位为单位）定义 。默认情况下，2d 索引使用 26 位精度，相当于大约两英尺（60 厘米）。

位置精度影响插入和读取操作的性能。

要更改默认精度，请`bits`在创建 2d 索引时指定一个值。您可以指定`bits`1 到 32 之间的值（含 1 和 32）。

```
db.<collection>.createIndex(
   { <location field>: "2d" },
   { bits: <bit precision> }
)
```

### 关于此任务

位置精度影响查询性能：

- 较低的精度可提高插入和更新操作的性能，并使用较少的存储空间。
- 更高的精度可以提高读取操作的性能，因为查询会扫描索引的较小部分以返回结果。

定位精度不影响查询精度。在最终的查询处理中始终使用网格坐标。

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

在字段上创建二维索引`address`。指定位的位置精度`32`：

```
db.contacts.createIndex(
   { address: "2d" },
   { bits: 32 }
)
```

### 下一步

您可以使用二维索引对位置数据进行计算，例如[邻近查询。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/query/proximity-flat-surface/#std-label-2d-index-proximity-query)

### 了解更多

- [Geohash 值](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/internals/#std-label-geospatial-indexes-geohash)
- [地理空间模型](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-geometry)
- [旧坐标对](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-legacy)