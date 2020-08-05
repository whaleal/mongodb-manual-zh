# `2d`索引

在本页面

- [注意事项](https://docs.mongodb.com/master/core/2d/#considerations)
- [行为](https://docs.mongodb.com/master/core/2d/#behavior)
- [`sparse` 属性](https://docs.mongodb.com/master/core/2d/#sparse-property)
- [归类选项](https://docs.mongodb.com/master/core/2d/#collation-option)

`2d`对在二维平面上存储为点的数据使用索引。该`2d`索引适用于MongoDB 2.2及更早版本中使用的[旧式坐标对](https://docs.mongodb.com/master/geospatial-queries/#geospatial-legacy)。

在以下情况下使用`2d`索引：

- 您的数据库具有来自MongoDB 2.2或更早版本的旧版[旧版坐标对](https://docs.mongodb.com/master/geospatial-queries/#geospatial-legacy)，*并且*
- 您不打算将任何位置数据存储为[GeoJSON](https://docs.mongodb.com/master/reference/glossary/#term-geojson)对象。

有关地理空间查询的更多信息，请参见 [地理空间查询](https://docs.mongodb.com/master/geospatial-queries/)。

## 注意事项

从MongoDB 4.0开始，您可以`key`在[`$geoNear`](https://docs.mongodb.com/master/reference/operator/aggregation/geoNear/#pipe._S_geoNear)管道阶段指定一个选项 以指示要使用的索引字段路径。这允许将该[`$geoNear`](https://docs.mongodb.com/master/reference/operator/aggregation/geoNear/#pipe._S_geoNear)阶段用在具有多个`2d`索引和/或多个 [2dsphere索引](https://docs.mongodb.com/master/core/2dsphere/)的集合上：

- 如果您的集合具有多个`2d`索引和/或多个 [2dsphere索引](https://docs.mongodb.com/master/core/2dsphere/)，则必须使用该`key`选项来指定要使用的索引字段路径。
- 如果不指定`key`，则不能有多个 `2d`索引和/或多个[2dsphere索引，](https://docs.mongodb.com/master/core/2dsphere/)因为如果没有使用`key`，则多个`2d`索引或 `2dsphere`索引之间的索引选择是不明确的。

注意

如果未指定`key`，并且最多只有一个 `2d`索引索引和/或只有一个`2d`索引索引，则MongoDB首先会寻找`2d`要使用的索引。如果`2d`索引不存在，则MongoDB查找`2dsphere`要使用的索引。

`2d`如果您的位置数据包含GeoJSON对象，请不要使用索引。要同时在[旧式坐标对](https://docs.mongodb.com/master/geospatial-queries/#geospatial-legacy) *和* [GeoJSON对象上](https://docs.mongodb.com/master/geospatial-queries/#geospatial-geojson)[建立](https://docs.mongodb.com/master/core/2dsphere/)索引，请使用[2dsphere](https://docs.mongodb.com/master/core/2dsphere/)索引。

分片集合时，不能将`2d`索引用作分片[键](https://docs.mongodb.com/master/reference/glossary/#term-shard-key)。但是，可以通过使用其他字段作为分片键在分片集合上创建地理空间索引。

## 行为

该`2d`索引支持在[平坦的欧几里德平面](https://docs.mongodb.com/master/geospatial-queries/#geospatial-geometry)上进行的计算。该`2d`索引还支持球体（例如） 上的*仅距离*计算[`$nearSphere`](https://docs.mongodb.com/master/reference/operator/query/nearSphere/#op._S_nearSphere)，但是对于 球体（例如）上的*几何*计算[`$geoWithin`](https://docs.mongodb.com/master/reference/operator/query/geoWithin/#op._S_geoWithin)，请将数据存储为[GeoJSON对象](https://docs.mongodb.com/master/geospatial-queries/#geospatial-geojson)并使用 `2dsphere`索引。

甲`2d`索引可以参考两个字段。第一个必须是位置字段。阿`2d`化合物索引构造该第一选择的位置字段的查询，然后过滤由附加标准的那些结果。复合`2d`索引可以涵盖查询。

## `sparse`属性

`2d`索引总是[稀疏的，](https://docs.mongodb.com/master/core/index-sparse/)并且忽略[稀疏](https://docs.mongodb.com/master/core/index-sparse/)选项。如果文档缺少`2d`索引字段（或者该字段是`null`或为空数组），则MongoDB不会将文档条目添加到 `2d`索引中。对于插入，MongoDB会插入文档，但不会添加到`2d`索引中。

对于包含`2d`索引键和其他类型的键的复合索引，只有`2d`索引字段才能确定索引是否引用文档。

## 排序规则选项

`2d`索引仅支持简单的二进制比较，不支持[排序规则](https://docs.mongodb.com/master/reference/bson-type-comparison-order/#collation)选项。

要`2d`在具有非简单排序规则的集合上创建索引，必须在创建索引时明确指定。`{collation: {locale: "simple"} }`