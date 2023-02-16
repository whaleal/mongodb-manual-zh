# 时间序列集合的最佳实践

此页面描述了提高时间序列集合的性能和数据使用的最佳实践。



## 优化插入[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-best-practices/#optimize-inserts)

要优化时间序列集合的插入性能，请执行以下操作。

### 按元数据批处理文档[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-best-practices/#batch-documents-by-metadata)

插入多个文档时：

- 为避免网络往返，请使用单个 [`insertMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany)语句而不是多个[`insertOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)语句。
- 如果可能，订购或构建批次以包含每个系列的多个测量（由元数据定义）。

例如，如果您有两个传感器，`sensor A`和`sensor B`，包含来自单个传感器的多个测量值的批次会产生一次插入的成本，而不是每次测量一个插入件的成本。

以下操作插入六个文档，但只产生两次插入的成本（每批一次），因为文档是按传感器排序的：

```
db.temperatures.insertMany( [
   {
      "metadata": {
         "sensor": "sensorA"
      },
      "timestamp": ISODate("2021-05-18T00:00:00.000Z"),
      temperature: 10
   },
   {
      "metadata": {
         "sensor": "sensorA"
      },
      "timestamp": ISODate("2021-05-19T00:00:00.000Z"),
      temperature: 12
   },
   {
      "metadata": {
         "sensor": "sensorA"
      },
      "timestamp": ISODate("2021-05-20T00:00:00.000Z"),
      temperature: 13
   },
   {
      "metadata": {
         "sensor": "sensorB"
      },
      "timestamp": ISODate("2021-05-18T00:00:00.000Z"),
      temperature: 20
   },
   {
      "metadata": {
         "sensor": "sensorB"
      },
      "timestamp": ISODate("2021-05-19T00:00:00.000Z"),
      temperature: 25
   },
   {
      "metadata": {
         "sensor": "sensorB"
      },
      "timestamp": ISODate("2021-05-20T00:00:00.000Z"),
      temperature: 26
   }
] )
```



### 在文档中使用一致的字段顺序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-best-practices/#use-consistent-field-order-in-documents)

在文档中使用一致的字段顺序可以提高插入性能。

例如，插入这些文档可实现最佳插入性能：

```
{
   _id: ObjectId("6250a0ef02a1877734a9df57"),
   timestamp: 2020-01-23T00:00:00.441Z,
   name: 'sensor1',
   range: 1
},
{
   _id: ObjectId("6560a0ef02a1877734a9df66")
   timestamp: 2020-01-23T01:00:00.441Z,
   name: 'sensor1',
   range: 5
}
```



相比之下，这些文档*没有*达到最佳插入性能，因为它们的字段顺序不同：

```
{
   range: 1,
   _id: ObjectId("6250a0ef02a1877734a9df57"),
   name: 'sensor1',
   timestamp: 2020-01-23T00:00:00.441Z
},
{
   _id: ObjectId("6560a0ef02a1877734a9df66")
   name: 'sensor1',
   timestamp: 2020-01-23T01:00:00.441Z,
   range: 5
}
```



### 增加客户数量[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-best-practices/#increase-the-number-of-clients)

增加将数据写入您的集合的客户端数量可以提高性能。



## IMPORTANT

### 禁用可重试写入

要使用多个客户端写入数据，您必须禁用可重试写入。时间序列集合的可重试写入不会合并来自多个客户端的写入。

要了解有关可重试写入以及如何禁用它们的更多信息，请参阅可 [重试写入。](https://www.mongodb.com/docs/manual/core/retryable-writes/#std-label-retryable-writes)



## 优化压缩[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-best-practices/#optimize-compression)

要优化时间序列集合的数据压缩，请执行以下操作。

### 从文档中省略包含空对象和数组的字段[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-best-practices/#omit-fields-containing-empty-objects-and-arrays-from-documents)

要优化压缩，如果您的数据包含空对象或数组，请忽略文档中的空字段。

例如，考虑以下文档：

```
{
 time: 2020-01-23T00:00:00.441Z,
 coordinates: [1.0, 2.0]
},
{
   time: 2020-01-23T00:00:10.441Z,
   coordinates: []
},
{
   time: 2020-01-23T00:00:20.441Z,
   coordinates: [3.0, 5.0]
}
```



`coordinates`具有填充值的字段和空数组之间的交替会导致压缩器的架构更改。架构更改导致序列中的第二个和第三个文档保持未压缩状态。

相比之下，以下省略空数组的文档获得了最佳压缩的好处：

```
{
   time: 2020-01-23T00:00:00.441Z,
   coordinates: [1.0, 2.0]
},
{
   time: 2020-01-23T00:00:10.441Z
},
{
   time: 2020-01-23T00:00:20.441Z,
   coordinates: [3.0, 5.0]
}
```



### 将数值数据舍入到少数小数位[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-best-practices/#round-numeric-data-to-few-decimal-places)

将数值数据四舍五入到应用程序所需的精度。将数字数据四舍五入到更少的小数位可以提高压缩率。

←  [分片时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-shard-collection/)[时间序列集合参考](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-reference/) →

原文链接-https://www.mongodb.com/docs/manual/core/timeseries/timeseries-best-practices/

译者：陆文龙