### 地理空间索引限制

[2d](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/#std-label-2d-index)和[2dsphere](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)索引是地理空间索引。地理空间索引有以下限制：

### 排序选项

二维索引不支持[排序](https://www.mongodb.com/docs/v7.0/reference/collation/#std-label-collation)选项，仅支持二进制比较。二进制比较比较每个字符串中每个字符的 Unicode 数字值，并且不考虑字母大小写或重音符号。

要在具有非简单排序规则的集合上创建二维索引，您必须`{ collation: { locale: "simple" } }`在创建索引时显式指定。

例如，考虑一个`collationTest`以排序规则命名的集合`{ locale: "en" }`：

```
db.createCollection(
   "collationTest",
   {
      collation: { locale: "en" }
   }
)
```

要在集合上创建二维索引`collationTest`，您必须指定`{ collation: { locale: "simple" } }`。此命令在字段上创建一个二维索引`loc`：

```
db.collationTest.createIndex(
   {
      loc: "2d"
   },
   {
      collation: { locale: "simple" }
   }
)
```

### 覆盖查询

地理空间索引无法覆盖查询。

### 片键

您不能使用地理空间索引作为[分片键](https://www.mongodb.com/docs/v7.0/core/sharding-shard-key/#std-label-shard-key)。但是，您可以使用不同的字段作为分片键在分片集合上创建地理空间索引。

### 多个地理空间索引`$geoNear`

如果您的集合具有多个地理空间索引，则在运行 [`$geoNear`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)管道阶段时，必须指定该`$geoNear` `key`选项。该`key`选项指定使用哪个索引来支持查询。

### 支持的数据类型

使用 2dsphere 索引进行索引的字段必须包含几何数据。几何数据可以是：

- [GeoJSON 数据](https://www.mongodb.com/docs/v7.0/reference/geojson/#std-label-geospatial-indexes-store-geojson)
- [旧坐标对](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-legacy)

你不能：

- 将包含非几何数据的文档插入到使用 2dsphere 索引进行索引的字段中。
- 在包含非几何数据的字段上构建 2dsphere 索引。

### 索引键数量

当您创建一个2dsphere索引时，mongod会将GeoJSON形状映射到内部表示形式。结果的内部表示可能是一个大数组的值。

该[`indexMaxNumGeneratedKeysPerDocument`](https://www.mongodb.com/docs/v7.0/reference/parameters/#mongodb-parameter-param.indexMaxNumGeneratedKeysPerDocument)设置限制为单个文档生成的最大键数，以防止内存不足错误。如果某个操作需要的键数量多于 `indexMaxNumGeneratedKeysPerDocument`参数指定的数量，则该操作将失败。

默认情况下，服务器允许`100,000`每个文档最多有索引键。要允许更多索引键，请提高该 [`indexMaxNumGeneratedKeysPerDocument`](https://www.mongodb.com/docs/v7.0/reference/parameters/#mongodb-parameter-param.indexMaxNumGeneratedKeysPerDocument)值。

### 平面上的精确匹配

二维索引无法提高坐标对上精确匹配的性能。

例如，考虑`contacts`包含以下文档的集合：

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

`address`字段上的二维索引**不会**提高以下查询的性能：

```
db.contacts.find( { address: [ 55.5, 42.3 ] } )
```

要提高此查询的性能，请在字段上创建升序或降序索引`address`：

```
db.contacts.createIndex( { address: 1 } )
```

### 了解更多

- [二维索引内部结构](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/internals/#std-label-2d-index-internals)
- [指数属性](https://www.mongodb.com/docs/v7.0/core/indexes/index-properties/#std-label-index-properties)

