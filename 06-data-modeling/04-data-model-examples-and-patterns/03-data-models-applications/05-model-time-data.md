**模型物联网数据**

物联网 (IoT) 是连接到互联网的物理对象网络。其中许多设备（例如传感器）都会生成数据。

要有效地存储和检索此数据，您可以使用存储桶模式。

**桶模式**

组织物联网数据的一种常用方法是将数据分组到桶中。Bucketing 组织特定的数据组以帮助：

- 发现历史趋势，
- 预测未来趋势，以及
- 优化存储使用。

对数据进行分组的常用参数有：

- 时间
- 数据源（如果你有多个数据集）
- 顾客
- 数据类型（例如，财务数据中的交易类型）

>[NOTE]
>
>从 MongoDB 5.0 开始，[时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries-collections/#std-label-manual-timeseries-collection)是时间序列数据的推荐集合类型。不要**将**桶模式与时间序列集合结合使用，因为这会降低性能。

考虑一个存储从传感器获得的温度数据的集合。传感器每分钟记录一次温度并将数据存储在一个名为`temperatures`的集合中：

```json
// temperatures collection

{
  "_id": 1,
  "sensor_id": 12345,
  "timestamp": ISODate("2019-01-31T10:00:00.000Z"),
  "temperature": 40
}
{
  "_id": 2,
  "sensor_id": 12345,
  "timestamp": ISODate("2019-01-31T10:01:00.000Z"),
  "temperature": 40
}
{
  "_id": 3,
  "sensor_id": 12345,
  "timestamp": ISODate("2019-01-31T10:02:00.000Z"),
  "temperature": 41
}
...
```

这种方法在数据和索引大小方面不能很好地扩展。例如，如果应用程序需要在`sensor_id`和 `timestamp`字段上建立索引，则需要为来自传感器的每个传入读数建立索引以提高性能。

您可以利用文档模型将数据存储到包含特定时间跨度测量值的文档中。考虑以下更新后的模式，它将每分钟读取的读数分为一个小时的组：

```json
{
  "_id": 1,
  "sensor_id": 12345,
  "start_date": ISODate("2019-01-31T10:00:00.000Z"),
  "end_date": ISODate("2019-01-31T10:59:59.000Z"),
  "measurements": [
    {
      "timestamp": ISODate("2019-01-31T10:00:00.000Z"),
      "temperature": 40
    },
    {
      "timestamp": ISODate("2019-01-31T10:01:00.000Z"),
      "temperature": 40
    },
    ...
    {
      "timestamp": ISODate("2019-01-31T10:42:00.000Z"),
      "temperature": 42
    }
  ],
  "transaction_count": 42,
  "sum_temperature": 1783
}
```

这个更新的模式提高了可伸缩性并反映了应用程序实际使用数据的方式。用户可能不会查询特定的温度读数。相反，用户可能会查询一个小时或一天内的温度行为。桶模式通过将数据分组到统一的时间段来帮助促进这些查询。

**结合计算模式和桶模式**

这[示例文件](https://www.mongodb.com/docs/manual/tutorial/model-iot-data/#std-label-bucket-example-doc)包含两个计算字段：`transaction_count`和`sum_temperature`。如果应用程序经常需要检索给定小时的温度总和，则计算总和的运行总和可以帮助节省应用程序资源。这种计算模式方法消除了每次请求数据时计算总和的需要。

预聚合`sum_temperature`和`transaction_count`值支持进一步计算，例如特定桶的平均温度 ( `sum_temperature`/ )。`transaction_count`用户更有可能在应用程序中查询下午 2:00 到 3:00 之间的平均温度，而不是查询下午 2:03 的具体温度。存储和预先计算某些值允许应用程序更容易地提供该信息。

**MongoDB 中的时间表示**

MongoDB默认[以 UTC 格式存储时间](https://www.mongodb.com/docs/manual/reference/bson-types/#std-label-document-bson-type-date)，并将任何本地时间表示形式转换为这种形式。必须在某些未修改的本地时间值上运行或报告的应用程序可以将时区与 UTC 时间戳一起存储，并在其应用程序逻辑中计算原始本地时间。

**例子**

在 MongoDB shell 中，您可以存储当前日期和当前客户端与 UTC 的偏移量。

```javascript
var now = new Date();
db.data.save( { date: now,
                offset: now.getTimezoneOffset() } );
```

您可以通过应用保存的偏移量来重建原始本地时间：

```javascript
var record = db.data.findOne();
var localNow = new Date( record.date.getTime() -  ( record.offset * 60000 ) );
```

 参见

原文 - [Model Time Data]( https://docs.mongodb.com/manual/tutorial/model-time-data/ )

译者：景圣
