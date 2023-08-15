## 定义二维索引的位置范围

[您可以定义2d 索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/#std-label-2d-index)中包含的坐标范围。默认情况下，二维索引的经度和纬度边界为：

- 大于或等于`-180`
- 少于`180`

要更改二维索引的位置范围，请在创建索引时指定`min`和 选项：`max`

```
db.<collection>.createIndex(
   {
      <location field>: "2d"
   },
   {
      min: <lower bound>,
      max: <upper bound>
   }
)
```

和范围包括**在内**`min`，并且适用于经度和纬度。`max`

### 关于此任务

> 重要的
>
> 2d 索引的默认位置范围允许纬度小于 -90 和大于 90，这些都是无效值。未定义使用这些无效点进行地理空间查询的行为。

为二维索引定义较小的位置范围可以减少索引中存储的数据量，并可以提高查询性能。

如果您的集合包含索引位置范围之外的坐标数据，则无法创建二维索引。

创建二维索引后，您无法插入包含索引位置范围之外的坐标数据的文档。

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

在字段上创建二维索引`address`。指定以下位置边界：

- `min`的界限`-75`
- `max`的界限`60`

```
db.contacts.createIndex(
   {
      address: "2d"
   },
   {
      min: -75,
      max: 60
   }
)
```

### 结果

该索引覆盖的位置范围更小，并且比默认的二维索引具有更高的性能。

创建索引后，您无法插入包含索引位置范围之外的坐标数据的文档。例如，您 **不能**插入以下文档：

```
db.contacts.insertOne(
   {
      name: "Paige Polson",
      phone: "402-555-0190",
      address: [ 70, 42.3 ]
   }
)
```

该`address`字段的经度值为`70`，高于 的`max`边界`60`。

### 下一步

您可以使用二维索引对位置数据进行计算，例如[邻近查询。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/query/proximity-flat-surface/#std-label-2d-index-proximity-query)

### 了解更多

- [定义 2d 索引的位置精度](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/create/define-location-precision/#std-label-2d-index-define-location-precision)
- [地理空间模型](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-geometry)
- [旧坐标对](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-legacy)