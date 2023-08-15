### 地理空间索引

[地理空间索引支持对存储为GeoJSON](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-geojson)对象或[旧坐标](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-legacy)对的数据进行查询。您可以使用地理空间索引来提高地理空间数据查询的性能或运行某些地理空间查询。

MongoDB 提供两种类型的地理空间索引：

- [2dsphere Indexes](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)，支持解释球体上几何图形的查询。
- [2d Indexes](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/#std-label-2d-index)，支持解释平面上几何图形的查询。

要了解有关地理空间数据和查询操作的更多信息，请参阅[地理空间查询。](https://www.mongodb.com/docs/v7.0/geospatial-queries/)

### 用例

如果您的应用程序经常查询包含地理空间数据的字段，您可以创建地理空间索引来提高这些查询的性能。

某些查询操作需要地理空间索引。如果要使用[`$near`](https://www.mongodb.com/docs/v7.0/reference/operator/query/near/#mongodb-query-op.-near)or[`$nearSphere`](https://www.mongodb.com/docs/v7.0/reference/operator/query/nearSphere/#mongodb-query-op.-nearSphere) 运算符或[`$geoNear`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)聚合阶段进行查询，则必须创建地理空间索引。有关详细信息，请参阅[地理空间查询运算符](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-operators)和 [地理空间聚合阶段。](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-aggregation)

例如，考虑一个包含包含字段`subway`的文档的集合`location`，该字段指定城市中地铁站的坐标。您经常与[`$geoWithin`](https://www.mongodb.com/docs/v7.0/reference/operator/query/geoWithin/#mongodb-query-op.-geoWithin)操作员一起运行查询以返回特定区域内的车站列表。为了提高此查询的性能，您可以在字段上创建地理空间索引`location`。创建索引后，您可以使用[`$near`](https://www.mongodb.com/docs/v7.0/reference/operator/query/near/#mongodb-query-op.-near)运算符查询返回附近站点的列表，按从最近到最远的顺序排序。

### 开始使用

要创建地理空间索引并运行地理空间查询，请参阅：

- [创建 2dsphere 索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/create/#std-label-2dsphere-index-create)
- [查询 2dsphere 索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/query/#std-label-2dsphere-index-query)
- [创建二维索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/create/#std-label-2d-index-create)
- [查询二维索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/query/#std-label-2d-index-query)

### 细节

本节介绍有关地理空间索引的详细信息。

#### 分片集合

对集合进行分片时，不能使用地理空间索引作为[分片键。](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-shard-key)但是，您可以使用不同的字段作为分片键在分片集合上创建地理空间索引。

您可以使用地理空间[查询运算符](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-operators) 和[聚合阶段](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-aggregation)来查询分片集合上的地理空间数据。

在 MongoDB 4.0 之前，[`$near`](https://www.mongodb.com/docs/v7.0/reference/operator/query/near/#mongodb-query-op.-near)分[`$nearSphere`](https://www.mongodb.com/docs/v7.0/reference/operator/query/nearSphere/#mongodb-query-op.-nearSphere)片集合不支持查询。相反，您可以使用[`$geoNear`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear) 聚合阶段或`geoNear`命令。

#### 覆盖查询

地理空间索引无法[覆盖查询。](https://www.mongodb.com/docs/v7.0/core/query-optimization/#std-label-covered-queries)

#### 球面查询

使用`2d`索引对球形数据进行查询可能会返回不正确的结果或错误。例如， `2d`索引不支持环绕极点的球形查询。

但是，您可以将`2dsphere`索引用于球形查询 *和*二维查询。对于二维查询， `2dsphere`索引会将存储为旧坐标对的数据转换为[GeoJSON Point](https://www.mongodb.com/docs/v7.0/reference/geojson/#std-label-geojson-point)类型。

### 了解更多

有关示例地理空间查询操作，请参阅 [地理空间查询示例。](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-query-examples)

