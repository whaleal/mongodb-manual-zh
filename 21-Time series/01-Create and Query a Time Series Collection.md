# 创建和查询时间序列集合

此页面显示如何使用代码示例创建和查询时间序列集合。



## 创建时间序列集合[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-procedures/#create-a-time-series-collection)

在将数据插入时间序列集合之前，必须使用以下 [`db.createCollection()`](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection)方法或[`create`](https://www.mongodb.com/docs/manual/reference/command/create/#mongodb-dbcommand-dbcmd.create) 命令显式创建集合：

```
db.createCollection(
    "weather",
    {
       timeseries: {
          timeField: "timestamp",
          metaField: "metadata",
          granularity: "hours"
       }
    }
)
```





## NOTE

### 功能兼容版本

您只能在 [featureCompatibilityVersion](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)设置为 5.0 或更高的系统上创建时间序列集合。



### `timeseries`对象字段[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-procedures/#timeseries-object-fields)

创建时间序列集合时，指定以下选项：

| 场地                     | 类型 | 描述                                                         |
| :----------------------- | :--- | :----------------------------------------------------------- |
| `timeseries.timeField`   | 细绳 | 必需的。每个时间序列文档中包含日期的字段的名称。时间序列集合中的文档必须有一个有效的 BSON 日期作为`timeField`. |
| `timeseries.metaField`   | 细绳 | 选修的。每个时间序列文档中包含元数据的字段名称。指定字段中的元数据应该是用于标记一系列唯一文档的数据。元数据应该很少改变，如果有的话。指定字段的名称可能`_id`与`timeseries.timeField`. 该字段可以是任何类型。 |
| `timeseries.granularity` | 细绳 | 选修的。可能的值是：`"seconds"``"minutes"``"hours"`默认情况下，MongoDB 将 设置为`granularity`以`"seconds"`进行高频摄取。手动设置`granularity`参数以通过优化时间序列集合中的数据在内部存储的方式来提高性能。要选择 的值`granularity`，请选择与连续传入测量之间的时间跨度最接近的匹配项。如果您指定`timeseries.metaField`，请考虑具有相同`metaField`字段唯一值的连续传入测量值之间的时间跨度。`metaField`如果测量值来自相同的源，则测量值通常对字段具有相同的唯一值。如果您不指定`timeseries.metaField`，请考虑插入到集合中的所有测量值之间的时间跨度。 |
| `expireAfterSeconds`     | 数字 | 选修的。通过指定文档过期后的秒数，启用[时间序列集合](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-time-series-collection)中文档的自动删除 。MongoDB 会自动删除过期的文档。有关详细信息，请参阅[设置时间序列集合 (TTL) 的自动删除](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-automatic-removal/#std-label-manual-timeseries-automatic-removal)。 |

该选项允许的其他`timeseries`选项是：

- `storageEngine`
- `indexOptionDefaults`
- `collation`
- `writeConcern`
- `comment`



## TIP

[`db.createCollection()`](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection)和[`create`。](https://www.mongodb.com/docs/manual/reference/command/create/#mongodb-dbcommand-dbcmd.create)

## 将测量插入时间序列集合[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-procedures/#insert-measurements-into-a-time-series-collection)

您插入的每个文档都应包含一个测量值。要一次插入多个文档，请发出以下命令：

```
db.weather.insertMany( [
   {
      "metadata": { "sensorId": 5578, "type": "temperature" },
      "timestamp": ISODate("2021-05-18T00:00:00.000Z"),
      "temp": 12
   },
   {
      "metadata": { "sensorId": 5578, "type": "temperature" },
      "timestamp": ISODate("2021-05-18T04:00:00.000Z"),
      "temp": 11
   },
   {
      "metadata": { "sensorId": 5578, "type": "temperature" },
      "timestamp": ISODate("2021-05-18T08:00:00.000Z"),
      "temp": 11
   },
   {
      "metadata": { "sensorId": 5578, "type": "temperature" },
      "timestamp": ISODate("2021-05-18T12:00:00.000Z"),
      "temp": 12
   },
   {
      "metadata": { "sensorId": 5578, "type": "temperature" },
      "timestamp": ISODate("2021-05-18T16:00:00.000Z"),
      "temp": 16
   },
   {
      "metadata": { "sensorId": 5578, "type": "temperature" },
      "timestamp": ISODate("2021-05-18T20:00:00.000Z"),
      "temp": 15
   }, {
      "metadata": { "sensorId": 5578, "type": "temperature" },
      "timestamp": ISODate("2021-05-19T00:00:00.000Z"),
      "temp": 13
   },
   {
      "metadata": { "sensorId": 5578, "type": "temperature" },
      "timestamp": ISODate("2021-05-19T04:00:00.000Z"),
      "temp": 12
   },
   {
      "metadata": { "sensorId": 5578, "type": "temperature" },
      "timestamp": ISODate("2021-05-19T08:00:00.000Z"),
      "temp": 11
   },
   {
      "metadata": { "sensorId": 5578, "type": "temperature" },
      "timestamp": ISODate("2021-05-19T12:00:00.000Z"),
      "temp": 12
   },
   {
      "metadata": { "sensorId": 5578, "type": "temperature" },
      "timestamp": ISODate("2021-05-19T16:00:00.000Z"),
      "temp": 17
   },
   {
      "metadata": { "sensorId": 5578, "type": "temperature" },
      "timestamp": ISODate("2021-05-19T20:00:00.000Z"),
      "temp": 12
   }
] )
```



要插入单个文档，请使用[`db.collection.insertOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne) 方法。



## TIP

### 优化插入性能

要了解如何为大型操作优化插入，请参阅 [优化插入。](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-best-practices/#std-label-tsc-best-practice-optimize-inserts)

## 查询时间序列集合[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-procedures/#query-a-time-series-collection)

您可以像查询标准 MongoDB 集合一样查询时间序列集合。

要从时间序列集合中返回一个文档，请运行：

```
db.weather.findOne({
   "timestamp": ISODate("2021-05-18T00:00:00.000Z")
})
```



示例输出：

```
{
   timestamp: ISODate("2021-05-18T00:00:00.000Z"),
   metadata: { sensorId: 5578, type: 'temperature' },
   temp: 12,
   _id: ObjectId("62f11bbf1e52f124b84479ad")
}
```

## 在时间序列集合上运行聚合[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-procedures/#run-aggregations-on-a-time-series-collection)

对于其他查询功能，请使用[聚合管道](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/#std-label-aggregation-pipeline)，例如：

```
db.weather.aggregate( [
   {
      $project: {
         date: {
            $dateToParts: { date: "$timestamp" }
         },
         temp: 1
      }
   },
   {
      $group: {
         _id: {
            date: {
               year: "$date.year",
               month: "$date.month",
               day: "$date.day"
            }
         },
         avgTmp: { $avg: "$temp" }
      }
   }
] )
```



示例聚合管道按测量日期对所有文档进行分组，然后返回当天所有温度测量值的平均值：

```
 {
  "_id" : {
    "date" : {
      "year" : 2021,
      "month" : 5,
      "day" : 18
    }
  },
  "avgTmp" : 12.714285714285714
}
{
  "_id" : {
    "date" : {
      "year" : 2021,
      "month" : 5,
      "day" : 19
    }
  },
  "avgTmp" : 13
}
```



←  [时间序列](https://www.mongodb.com/docs/manual/core/timeseries-collections/)[列出数据库中的时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-check-type/) →

原文链接 -https://www.mongodb.com/docs/manual/core/timeseries/timeseries-procedures/

译者：陆文龙