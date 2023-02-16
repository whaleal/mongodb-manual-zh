# 将数据迁移到时间序列集合中

将数据从现有集合迁移到[时间序列集合：](https://www.mongodb.com/docs/manual/core/timeseries-collections/#std-label-manual-timeseries-collection)

1. [创建新的时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-migrate-data-into-timeseries-collection/#std-label-migrate-timeseries-new-collection)
2. [转换数据（可选）](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-migrate-data-into-timeseries-collection/#std-label-migrate-timeseries-transform)
3. [将数据迁移到时间序列集合中](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-migrate-data-into-timeseries-collection/#std-label-migrate-timeseries-migrate-data)



## 创建新的时间序列集合[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-migrate-data-into-timeseries-collection/#create-a-new-time-series-collection)

要创建新的[时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries-collections/#std-label-manual-timeseries-collection)，请在 [`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
db.createCollection(
    "weathernew", {
      timeseries: {
         timeField: "ts",
         metaField: "metaData",
         granularity: "hours"
       }
     }
)
```



有关上述命令的更多信息，请参阅 [创建时间序列集合。](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-procedures/#std-label-manual-timeseries-collection-create)



## 转换数据（可选）[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-migrate-data-into-timeseries-collection/#transform-data--optional-)

时间序列集合支持[指定](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-secondary-index/#std-label-timeseries-add-secondary-index)为 `metaField`. 如果您的时间序列数据的数据模型没有为您的元数据指定字段，您可以转换数据以创建一个。要转换现有集合中的数据，请使用 [`$merge`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)或[`$out`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)创建包含时间序列数据的临时集合。

考虑具有以下格式的天气数据的集合：

```
 {
    "_id" : ObjectId("5553a998e4b02cf7151190b8"),
    "st" : "x+47600-047900",
    "ts" : ISODate("1984-03-05T13:00:00Z"),
    "position" : {
      "type" : "Point",
      "coordinates" : [ -47.9, 47.6 ]
    },
    "elevation" : 9999,
    "callLetters" : "VCSZ",
    "qualityControlProcess" : "V020",
    "dataSource" : "4",
    "type" : "FM-13",
    "airTemperature" : { "value" : -3.1, "quality" : "1" },
    "dewPoint" : { "value" : 999.9, "quality" : "9" },
    "pressure" : { "value" : 1015.3, "quality" : "1" },
    "wind" : {
      "direction" : { "angle" : 999, "quality" : "9" },
      "type" : "9",
      "speed" : { "rate" : 999.9, "quality" : "9" }
    },
    "visibility" : {
      "distance" : { "value" : 999999, "quality" : "9" },
      "variability" : { "value" : "N", "quality" : "9" }
    },
    "skyCondition" : {
      "ceilingHeight" : { "value" : 99999, "quality" : "9", "determination" : "9" },
      "cavok" : "N"
    },
    "sections" : [ "AG1" ],
    "precipitationEstimatedObservation" : { "discrepancy" : "2", "estimatedWaterDepth" : 999 }
}
```



要转换此数据，我们发出以下命令：

```
db.weather_data.aggregate([
  {
     $addFields: {
       metaData: {
         "st": "$st",
         "position": "$position",
         "elevation": "$elevation",
         "callLetters": "$callLetters",
         "qualityControlProcess": "$qualityControlProcess",
         "type": "$type"
       }
     },
  }, {
     $project: {
        _id: 1,
        ts: 1,
        metaData: 1,
        dataSource: 1,
        airTemperature: 1,
        dewPoint: 1,
        pressure: 1,
        wind: 1,
        visibility: 1,
        skyCondition: 1,
        sections: 1,
        precipitationEstimatedObservation: 1
     }
  }, {
     $out: "temporarytimeseries"
  }
])
```



运行此命令后，您将获得一个中间 `temporarytimeseries`集合：

```
db.temporarytimeseries.findOne()
{
   "_id" : ObjectId("5553a998e4b02cf7151190b8"),
   "ts" : ISODate("1984-03-05T13:00:00Z"),
   "dataSource" : "4",
   "airTemperature" : { "value" : -3.1, "quality" : "1" },
   "dewPoint" : { "value" : 999.9, "quality" : "9" },
   "pressure" : { "value" : 1015.3, "quality" : "1" },
   "wind" : {
     "direction" : { "angle" : 999, "quality" : "9" },
     "type" : "9",
     "speed" : { "rate" : 999.9, "quality" : "9" }
   },
   "visibility" : {
     "distance" : { "value" : 999999, "quality" : "9" },
     "variability" : { "value" : "N", "quality" : "9" }
   },
   "skyCondition" : {
     "ceilingHeight" : { "value" : 99999, "quality" : "9", "determination" : "9" },
     "cavok" : "N"
   },
   "sections" : [ "AG1" ],
   "precipitationEstimatedObservation" : { "discrepancy" : "2", "estimatedWaterDepth" : 999 },
   "metaData" : {
     "st" : "x+47600-047900",
     "position" : {
       "type" : "Point",
       "coordinates" : [ -47.9, 47.6 ]
     },
     "elevation" : 9999,
     "callLetters" : "VCSZ",
     "qualityControlProcess" : "V020",
     "type" : "FM-13"
   }
}
```





## 将数据迁移到时间序列集合中[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-migrate-data-into-timeseries-collection/#migrate-data-into-a-time-series-collection-1)

要将非类型的现有集合中的数据迁移 `timeseries`到[时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries-collections/#std-label-manual-timeseries-collection)中，请使用[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)和 [`mongorestore`.](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)



## WARNING

迁移或回填到时间序列集合中时，您应该始终按从旧到新的顺序插入文档。在这种情况下[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)以自然顺序导出文档和`--maintainInsertionOrder`选项 [`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)保证文档的相同插入顺序。

例如，要导出`temporarytimeseries`集合，请发出以下命令：

```
mongodump
    --uri="mongodb://mongodb0.example.com:27017,mongodb1.example.com:27017,mongodb2.example.com:27017/weather" \
    --collection=temporarytimeseries --out=timeseries
```



该命令返回以下输出：

```
2021-06-01T16:48:39.980+0200  writing weather.temporarytimeseries to timeseries/weather/temporarytimeseries.bson
2021-06-01T16:48:40.056+0200  done dumping weather.temporarytimeseries (10000 documents)
```



要导入`timeseries/weather/temporarytimeseries.bson`新集合`weathernew`，请发出以下命令：

```
mongorestore
    --uri="mongodb://mongodb0.example.com:27017,mongodb1.example.com:27017,mongodb2.example.com:27017/weather" \
    --collection=weathernew --noIndexRestore \
    --maintainInsertionOrder \
    timeseries/weather/temporarytimeseries.bson
```



该命令返回以下输出：

```
2021-06-01T16:50:56.639+0200  checking for collection data in timeseries/weather/temporarytimeseries.bson
2021-06-01T16:50:56.640+0200  restoring to existing collection weather.weathernew without dropping
2021-06-01T16:50:56.640+0200  reading metadata for weather.weathernew from timeseries/weather/temporarytimeseries.metadata.json
2021-06-01T16:50:56.640+0200  restoring weather.weathernew from timeseries/weather/temporarytimeseries.bson
2021-06-01T16:51:01.229+0200  no indexes to restore
2021-06-01T16:51:01.229+0200  finished restoring weather.weathernew (10000 documents, 0 failures)
2021-06-01T16:51:01.229+0200  10000 document(s) restored successfully. 0 document(s) failed to restore.
```





## NOTE

确保使用以下命令运行前面的命令 [`--noIndexRestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--noIndexRestore)选项。 [`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)无法在时间序列集合上创建索引。

如果您的原始集合有二级索引，请立即手动重新创建它们。



## TIP

### 也可以看看：

[将二级索引添加到时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-secondary-index/#std-label-timeseries-add-secondary-index)

←  [将二级索引添加到时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-secondary-index/)[在时间序列数据之上构建物化视图](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-build-materialized-views/) →

原文链接 -https://www.mongodb.com/docs/manual/core/timeseries/timeseries-migrate-data-into-timeseries-collection/

译者：陆文龙