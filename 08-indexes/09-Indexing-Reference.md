## 索引参考

### mongosh中的索引方法

| 名称                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) | 在集合上构建索引。                                           |
| [`db.collection.dropIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex) | 删除集合上的指定索引。                                       |
| [`db.collection.dropIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.dropIndexes/#mongodb-method-db.collection.dropIndexes) | 删除集合上的所有索引。                                       |
| [`db.collection.getIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes) | 返回描述集合上现有索引的文档数组。                           |
| [`db.collection.reIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.reIndex/#mongodb-method-db.collection.reIndex) | 重建集合上的所有现有索引。                                   |
| [`db.collection.totalIndexSize()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.totalIndexSize/#mongodb-method-db.collection.totalIndexSize) | 报告集合上索引使用的总大小。[`totalIndexSize`](https://www.mongodb.com/docs/v7.0/reference/command/collStats/#mongodb-data-collStats.totalIndexSize)提供输出字段周围的包装器[`collStats`](https://www.mongodb.com/docs/v7.0/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats)。 |
| [`cursor.explain()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.explain/#mongodb-method-cursor.explain) | 报告游标的查询执行计划。                                     |
| [`cursor.hint()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.hint/#mongodb-method-cursor.hint) | 强制 MongoDB 使用特定索引进行查询。                          |
| [`cursor.max()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.max/#mongodb-method-cursor.max) | 指定游标的独占索引上限。配合使用[`cursor.hint()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.hint/#mongodb-method-cursor.hint) |
| [`cursor.min()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.min/#mongodb-method-cursor.min) | 指定游标的包含索引下限。配合使用[`cursor.hint()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.hint/#mongodb-method-cursor.hint) |

### 索引数据库命令

| 名称                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`createIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#mongodb-dbcommand-dbcmd.createIndexes) | 为集合构建一个或多个索引。                                   |
| [`dropIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/dropIndexes/#mongodb-dbcommand-dbcmd.dropIndexes) | 从集合中删除索引。                                           |
| [`compact`](https://www.mongodb.com/docs/v7.0/reference/command/compact/#mongodb-dbcommand-dbcmd.compact) | 对集合进行碎片整理并重建索引。                               |
| [`reIndex`](https://www.mongodb.com/docs/v7.0/reference/command/reIndex/#mongodb-dbcommand-dbcmd.reIndex) | 重建集合上的所有索引。                                       |
| [`validate`](https://www.mongodb.com/docs/v7.0/reference/command/validate/#mongodb-dbcommand-dbcmd.validate) | 扫描集合数据和索引的正确性的内部命令。                       |
| [`geoSearch`](https://www.mongodb.com/docs/v7.0/reference/command/geoSearch/#mongodb-dbcommand-dbcmd.geoSearch) | *在 MongoDB 5.0 中删除。*使用 MongoDB 的干草堆索引功能执行地理空间查询。 |
| [`checkShardingIndex`](https://www.mongodb.com/docs/v7.0/reference/command/checkShardingIndex/#mongodb-dbcommand-dbcmd.checkShardingIndex) | 验证分片键索引的内部命令。                                   |
| [`setIndexCommitQuorum`](https://www.mongodb.com/docs/v7.0/reference/command/setIndexCommitQuorum/#mongodb-dbcommand-dbcmd.setIndexCommitQuorum) | 更改数据承载成员（即提交仲裁）的最小数量（包括主成员），在主成员将这些索引标记为就绪之前，这些成员必须投票以提交正在进行的[索引构建。](https://www.mongodb.com/docs/v7.0/core/index-creation/#std-label-index-operations-replicated-build) |

### 地理空间查询选择器

| 名称                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`$geoWithin`](https://www.mongodb.com/docs/v7.0/reference/operator/query/geoWithin/#mongodb-query-op.-geoWithin) | 选择边界[GeoJSON 几何图形](https://www.mongodb.com/docs/v7.0/reference/geojson/#std-label-geospatial-indexes-store-geojson)内的几何图形。2dsphere和[2d](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/#std-label-2d-index)索引 [支持](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)[.](https://www.mongodb.com/docs/v7.0/reference/operator/query/geoWithin/#mongodb-query-op.-geoWithin)[`$geoWithin`](https://www.mongodb.com/docs/v7.0/reference/operator/query/geoWithin/#mongodb-query-op.-geoWithin) |
| [`$geoIntersects`](https://www.mongodb.com/docs/v7.0/reference/operator/query/geoIntersects/#mongodb-query-op.-geoIntersects) | [选择与GeoJSON](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-GeoJSON)几何图形相交的几何图形。[2dsphere](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)索引支持 [`$geoIntersects`.](https://www.mongodb.com/docs/v7.0/reference/operator/query/geoIntersects/#mongodb-query-op.-geoIntersects) |
| [`$near`](https://www.mongodb.com/docs/v7.0/reference/operator/query/near/#mongodb-query-op.-near) | 返回靠近某个点的地理空间对象。需要地理空间索引。2dsphere和[2d](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/#std-label-2d-index)索引 [支持](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)[.](https://www.mongodb.com/docs/v7.0/reference/operator/query/near/#mongodb-query-op.-near)[`$near`](https://www.mongodb.com/docs/v7.0/reference/operator/query/near/#mongodb-query-op.-near) |
| [`$nearSphere`](https://www.mongodb.com/docs/v7.0/reference/operator/query/nearSphere/#mongodb-query-op.-nearSphere) | 返回球体上某个点附近的地理空间对象。需要地理空间索引。2dsphere和[2d](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/#std-label-2d-index)索引 [支持](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/#std-label-2dsphere-index)[.](https://www.mongodb.com/docs/v7.0/reference/operator/query/nearSphere/#mongodb-query-op.-nearSphere)[`$nearSphere`](https://www.mongodb.com/docs/v7.0/reference/operator/query/nearSphere/#mongodb-query-op.-nearSphere) |