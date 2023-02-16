# 设置时间序列数据的粒度[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-granularity/#set-granularity-for-time-series-data)



## NOTE

您必须运行 MongoDB 5.0.1 或更高版本才能在创建集合后更改时间序列集合的粒度。请参阅[MongoDB 5.0 已知问题。](https://www.mongodb.com/docs/manual/release-notes/5.0/#std-label-5.0-known-issue-granularity)

创建[时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries-collections/#std-label-manual-timeseries-collection)时，将粒度设置为与字段具有相同唯一值的连续传入测量之间的时间跨度最接近的值`metaField` ：

```
db.createCollection(
    "weather24h",
    {
       timeseries: {
          timeField: "timestamp",
          metaField: "metadata",
          granularity: "minutes"
       },
       expireAfterSeconds: 86400
    }
)
```



`granularity`通过优化时间序列集合中的数据在内部存储的方式，准确设置参数可以提高性能。

要准确设置参数，请选择`granularity`最接近字段值指定的唯一数据源的摄取率的值`metaField`。

例如，如果您的“metaField”数据识别天气传感器并且您每 5 分钟从每个单独的传感器获取一次数据，则您应该选择“分钟”。 即使您有数千个传感器，并且来自不同传感器的数据仅相隔几秒钟，“粒度”仍应基于由其元数据唯一标识的一个传感器的摄取率。

在下表中，您可以看到为每个“粒度”值存储在一起的数据的最大时间跨度：

| `granularity`         | Covered Time Span |
| :-------------------- | :---------------- |
| `"seconds"` (default) | one hour          |
| `"minutes"`           | 24 hours          |
| `"hours"`             | 30 days           |



## TIP

### See also:

[Timing of Automatic Removal](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-automatic-removal/#std-label-timeseries-collection-delete-operations-timing)

## Retrieve the `granularity` of a Time Series Collection[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-granularity/#retrieve-the-granularity-of-a-time-series-collection)

要检索 `granularity` 的当前值，请使用 [`listCollections`](https://www.mongodb.com/docs/manual/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections) 命令：

```
db.runCommand( { listCollections: 1 } )
```



结果文档包含时间序列集合的文档，其中包含 `options.timeseries.granularity` 字段。

```
{
    cursor: {
       id: <number>,
       ns: 'test.$cmd.listCollections',
       firstBatch: [
         {
            name: <string>,
            type: 'timeseries',
            options: {
               expireAfterSeconds: <number>,
               timeseries: {
                  timeField: <string>,
                  metaField: <string>,
                  granularity: <string>,
                  bucketMaxSpanSeconds: <number>
               }
            },
            ...
         },
         ...
       ]
    }
 }
```



## 更改时间序列集合的“粒度”[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-granularity/#change-the-granularity-of-a-time-series-collection)

要更改 `granularity` 参数值，请发出以下 [`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod) 命令：

```
db.runCommand({
   collMod: "weather24h",
   timeseries: { granularity: "hours" }
})
```



设置后，一次`granularity`只能增加一个级别。从`"seconds"`到`"minutes"`或从`"minutes"`到 `"hours"`。不允许进行其他更改。如果您需要将 `granularity`from更改`"seconds"`为`"hours"`，请先增加 `granularity`to `"minutes"`，然后再增加 to `"hours"`。



## NOTE

您不能修改分`granularity`片时间序列集合的。

←  [为时间序列集合 (TTL) 设置自动删除](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-automatic-removal/)[将二级索引添加到时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-secondary-index/) →

原文链接 -https://www.mongodb.com/docs/manual/core/timeseries/timeseries-granularity/

译者：陆文龙