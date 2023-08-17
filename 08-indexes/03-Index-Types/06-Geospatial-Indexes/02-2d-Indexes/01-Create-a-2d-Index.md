## 创建二维索引

二维索引支持对[平面欧几里得平面中的位置数据进行查询。](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-geometry)

要创建二维索引，请使用该[`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) 方法。索引类型是`"2d"`：

```
db.<collection>.createIndex( { <location field> : "2d" } )
```

### 关于此任务

- 中的值`<location field>`必须是[旧坐标对。](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-legacy)
- 指定旧坐标对时，首先列出**经度**，然后列出**纬度**。
  - 有效的经度值介于`-180`和之间`180`（包含两者）。
  - 有效的纬度值介于`-90`和之间`90`（包含两者）。

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

在字段上创建二维索引`address`：

```
db.contacts.createIndex( { address : "2d" } )
```

### 下一步

创建二维索引后，您可以使用二维索引来支持位置数据的计算。要查看使用二维索引的查询示例，请参阅：

- [查询平面上某个点附近的位置](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/query/proximity-flat-surface/#std-label-2d-index-proximity-query)

### 了解更多

- [定义 2d 索引的位置精度](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/create/define-location-precision/#std-label-2d-index-define-location-precision)
- [定义二维索引的位置范围](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/create/define-location-range/#std-label-2d-index-define-location-range)
- [地理空间索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/restrictions/#std-label-geospatial-restrictions)
- 要创建支持球面计算的索引，请参阅[2dsphere 索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)