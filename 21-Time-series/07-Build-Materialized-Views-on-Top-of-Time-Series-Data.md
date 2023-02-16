# 在时间序列数据之上构建物化视图

时间序列数据的物化视图可用于：

- 归档
- 分析
- 为无法访问原始数据的团队提供数据访问便利

要创建[按需物化视图](https://www.mongodb.com/docs/manual/core/materialized-views/)，请使用[`$merge`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)聚合管道阶段来转换和存储您的数据：

```
db.weather.aggregate([
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
  }, {
     $merge: { into: "dailytemperatureaverages", whenMatched: "replace" }
  }
])
```



前面的管道将根据 `dailytemperatureaverages`集合创建或更新包含所有每日温度平均值的`weather`集合。



## NOTE

无法本地安排这些物化视图的刷新。

有关实体化视图的更多信息，请参阅 [按需实体化视图。](https://www.mongodb.com/docs/manual/core/materialized-views/)

←  [将数据迁移到时间序列集合中](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-migrate-data-into-timeseries-collection/)[分片时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-shard-collection/) →

原文链接 -https://www.mongodb.com/docs/manual/core/timeseries/timeseries-build-materialized-views/

译者：陆文龙