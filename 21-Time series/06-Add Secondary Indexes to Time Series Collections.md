# 将二级索引添加到时间序列集合

为了提高[时间序列集合](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-time-series-collection)的查询性能，添加一个或多个[二级索引](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary-index)以支持常见的时间序列查询模式。具体来说，我们建议您在指定为和 的字段上创建一个或多个[复合索引](https://www.mongodb.com/docs/manual/core/index-compound/#std-label-index-type-compound)。如果该字段的字段值是一个文档，您可以在该文档内的字段上创建二级索引。`timeField``metaField``metaField`



## NOTE

并非所有索引类型都受支持。有关不受支持的索引类型的列表，请参阅[时间序列集合上二级索引的限制。](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#std-label-timeseries-limitations-secondary-indexes)

例如，此命令在和 字段上创建[复合索引：](https://www.mongodb.com/docs/manual/core/index-compound/#std-label-index-type-compound)`metadata.sensorId``timestamp`

```
db.weather24h.createIndex( { "metadata.sensorId": 1, "timestamp": 1 } )
```





## TIP

[`db.collection.createIndex()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)



## 使用二级索引提高排序性能[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-secondary-index/#use-secondary-indexes-to-improve-sort-performance)

时间序列集合可以使用索引来提高`timeField`和上的排序性能`metaField`。

例如，以下`sensorData`集合包含来自天气传感器的测量值：

```
db.sensorData.insertMany( [ {
     "metadata": {
         "sensorId": 5578,
         "location": {
             type: "Point",
             coordinates: [-77.40711, 39.03335]
         }
     },
     "timestamp": ISODate("2022-01-15T00:00:00.000Z"),
     "currentConditions": {
         "windDirecton": 127.0,
         "tempF": 71.0,
         "windSpeed": 2.0,
         "cloudCover": null,
         "precip": 0.1,
         "humidity": 94.0,
     }
   },
   {
     "metadata": {
         "sensorId": 5578,
         "location": {
             type: "Point",
             coordinates: [-77.40711, 39.03335]
         }
     },
     "timestamp": ISODate("2022-01-15T00:01:00.000Z"),
     "currentConditions": {
         "windDirecton": 128.0,
         "tempF": 69.8,
         "windSpeed": 2.2,
         "cloudCover": null,
         "precip": 0.1,
         "humidity": 94.3,
     }
   },
   {
     "metadata": {
         "sensorId": 5579,
         "location": {
             type: "Point",
             coordinates: [-80.19773, 25.77481]
         }
     },
     "timestamp": ISODate("2022-01-15T00:01:00.000Z"),
     "currentConditions": {
         "windDirecton": 115.0,
         "tempF": 88.0,
         "windSpeed": 1.0,
         "cloudCover": null,
         "precip": 0.0,
         "humidity": 99.0,
     }
    }
  ]
)
```



时间序列集合自动创建聚集索引。在某些情况下，查询计划器可能会自动使用聚簇索引来提高排序性能。有关聚簇索引的更多信息，请参阅[聚簇索引。](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#std-label-db.createCollection.clusteredIndex)

以下对时间戳字段的排序操作使用聚簇索引来提高性能：

```
db.sensorData.find().sort( { "timestamp": 1 } )
```



要确认排序操作使用了聚簇索引，请使用以下`.explain( "executionStats" )`选项再次运行该操作：

```
db.sensorData.find().sort( { "timestamp": 1 } ).explain( "executionStats" )
```



`winningPlan.queryPlan.inputStage.stage`is和阶段`COLLSCAN`存在 `_internalBoundedSort`于解释计划输出中。该`interalBoundedSort`字段表示使用了聚簇索引。有关解释计划输出的更多信息，请参阅[解释结果。](https://www.mongodb.com/docs/manual/reference/explain-results/#std-label-explain-results)

时间序列集合的二级索引可以提高排序操作的性能，并增加可以使用索引的场景数量。

时间序列集合的排序操作可以使用`timeField`. 在某些情况下，排序操作也可以在`metaField`和上使用复合二级索引`timeField`。

聚合管道阶段[`$match`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match)并 [`$sort`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort)确定时间序列集合可以使用哪些索引。以下列表描述了可以使用索引的场景：

- 排序依据`{ <timeField:> ±1 }`使用聚簇索引
- 排序依据`{ <timeField>: ±1 }`使用二级索引 `<timeField>`
- 排序依据`{ <metaField>: ±1, timeField: ±1 }`使用二级索引`{ <metaField>: ±1, timeField: ±1 }`
- 排序依据在有点谓词时`{ <timeField>: ±1 }`使用二级索引 `{ metaField: ±1, timeField: ±1 }``<metaField>`

在字段上创建二级索引`timestamp`：

```
db.sensorData.createIndex( { "timestamp": 1 } )
```



以下对该`timestamp`字段的排序操作使用二级索引来提高性能：

```
db.sensorData.aggregate( [
  { $match: { "timestamp" : { $gte: ISODate("2022-01-15T00:00:00.000Z") } } },
  { $sort: { "timestamp": 1 } }
] )
```



要确认排序操作使用了二级索引，请使用以下`.explain( "executionStats" )`选项再次运行该操作：

```
db.sensorData.explain( "executionStats" ).aggregate( [
  { $match: { "timestamp": { $gte: ISODate("2022-01-15T00:00:00.000Z") } } },
  { $sort: { "timestamp": 1 } }
] )
```



### 时间序列集合的“最后一点”查询[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-secondary-index/#-last-point--queries-on-time-series-collections)

“最后一点”查询获取每个唯一元数据值的最新测量值。例如，您可能希望从所有传感器获取最新的温度读数。通过创建以下任何索引来提高最后一点查询的性能：

```
{ "metadata.sensorId": 1,  "timestamp": 1 }
{ "metadata.sensorId": 1,  "timestamp": -1 }
{ "metadata.sensorId": -1, "timestamp": 1 }
{ "metadata.sensorId": -1, "timestamp": -1 }
```



## NOTE

最后一点查询在使用[DISTINCT_SCAN 优化](https://www.mongodb.com/docs/manual/reference/explain-results/#std-label-explain-results)时性能最高。此优化仅在索引`timeField`降序时可用。

以下命令在`metaField` （升序）和`timeField`（降序）上创建复合二级索引：

```
db.sensorData.createIndex( { "metadata.sensorId": 1,  "timestamp": -1 } )
```



以下最后一点查询示例使用`timeField` 上面创建的降序复合二级索引：

```
db.sensorData.aggregate( [
   {
      $sort: { "metadata.sensorId": 1, "timestamp": -1 }
   },
   {
      $group: {
         _id: "$metadata.sensorId",
         ts: { $first: "$timestamp" },
         temperatureF: { $first: "$currentConditions.tempF" }
      }
   }
] )
```



要确认最后一点查询使用了二级索引，请使用以下命令再次运行该操作`.explain( "executionStats" )`：

```
db.getCollection( 'sensorData' ).explain( "executionStats" ).aggregate( [
   {
      $sort: { "metadata.sensorId": 1, "timestamp": -1 }
   },
   {
      $group: {
         _id: "$metadata.sensorId",
         ts: { $first: "$timestamp" },
         temperatureF: { $first: "$currentConditions.tempF" }
      }
   }
] )
```



`winningPlan.queryPlan.inputStage.stage`是`DISTINCT_SCAN`，表示使用了索引。有关解释计划输出的更多信息，请参阅[解释结果。](https://www.mongodb.com/docs/manual/reference/explain-results/#std-label-explain-results)

### 为时间序列集合指定索引提示[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-secondary-index/#specify-index-hints-for-time-series-collections)

索引提示使 MongoDB 使用特定索引进行查询。如果在提示中指定了索引，则对时间序列集合的某些操作只能利用该索引。

例如，以下查询导致 MongoDB 使用 `timestamp_1_metadata.sensorId_1`索引：

```
db.sensorData.find( { "metadata.sensorId": 5578 } ).hint( "timestamp_1_metadata.sensorId_1" )
```



在时间序列集合上，您可以使用索引名称或索引键模式指定提示。要获取集合中索引的名称，请使用[`db.collection.getIndexes()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)方法。



## MongoDB 6.0 中的时间序列二级索引[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-secondary-index/#time-series-secondary-indexes-in-mongodb-6.0)

从 MongoDB 6.0 开始，您可以：

- 在 、或测量字段上添加[复合索引。](https://www.mongodb.com/docs/manual/core/index-compound/)`timeField``metaField`
- 将[`$or`](https://www.mongodb.com/docs/manual/reference/operator/query/or/#mongodb-query-op.-or)、[`$in`](https://www.mongodb.com/docs/manual/reference/operator/query/in/#mongodb-query-op.-in)和[`$geoWithin`](https://www.mongodb.com/docs/manual/reference/operator/query/geoWithin/#mongodb-query-op.-geoWithin)运算符与时间序列集合的[部分索引一起使用。](https://www.mongodb.com/docs/manual/core/index-partial/)
- 添加[部分](https://www.mongodb.com/docs/manual/core/index-partial/)上`metaField`。
- 向任何字段或子字段添加[二级索引。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary-index)
- 使用`metaField`2dsphere[索引](https://www.mongodb.com/docs/manual/core/2dsphere/)。



## NOTE

[如果时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries-collections/#std-label-manual-timeseries-collection)上有[二级索引](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary-index)并且您需要降级功能兼容版本 (FCV)，则必须首先删除与降级后的 FCV 不兼容的所有二级索引。看[。](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)

←  [设置时间序列数据的粒度](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-granularity/)[将数据迁移到时间序列集合中](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-migrate-data-into-timeseries-collection/) →

原文链接 -https://www.mongodb.com/docs/manual/core/timeseries/timeseries-secondary-index/

译者：陆文龙