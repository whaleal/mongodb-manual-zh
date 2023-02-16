# 分片时间序列集合

*5.1版中的新*功能。

使用本教程对新的或现有的时间序列集合进行分片。



## IMPORTANT

在完成本教程之前，请查看时间序列集合的[分片限制](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/#std-label-time-series-limitations-sharding)。

## 限制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-shard-collection/#limitations)

您不能[重新将分片](https://www.mongodb.com/docs/manual/core/sharding-reshard-a-collection/#std-label-sharding-resharding)时间序列集合分片。但是，您可以[优化其 shard key 。](https://www.mongodb.com/docs/manual/core/sharding-refine-a-shard-key/#std-label-shard-key-refine)

## 先决条件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-shard-collection/#prerequisites)

要对时间序列集合进行分片，您必须[部署一个分片集群](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/#std-label-sharding-procedure-setup)来托管包含您的时间序列集合的数据库。

## 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-shard-collection/#procedures)

### 分片新的时间序列集合[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-shard-collection/#shard-a-new-time-series-collection)

 

#### 连接到您的分片集群。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-shard-collection/#connect-to-your-sharded-cluster)

连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)您的分片集群。指定`host`和`port`在其 `mongos`上运行：

```
mongosh --host <hostname> --port <port>
```

 

#### 确认您的数据库已启用分片。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-shard-collection/#confirm-that-sharding-is-enabled-on-your-database)

运行[`sh.status()`](https://www.mongodb.com/docs/manual/reference/method/sh.status/#mongodb-method-sh.status)以确认您的数据库已启用分片：

```
sh.status()
```



该命令返回分片信息：

```
--- Sharding Status ---
   sharding version: {
      "_id" : 1,
      "minCompatibleVersion" : 5,
      "currentVersion" : 6,
...
```



 

#### 创建集合。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-shard-collection/#create-the-collection)

使用[`shardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection)带有[timeseries](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#std-label-method-sharded-time-series-collection-options)选项的方法。

例如：

```
sh.shardCollection(
   "test.weather",
   { "metadata.sensorId": 1 },
   {
      timeseries: {
         timeField: "timestamp",
         metaField: "metadata",
         granularity: "hours"
      }
   }
)
```



在这个例子中，[`sh.shardCollection()`：](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection)

- `weather`对 `test`数据库中命名的新时间序列集合进行分片。
- `metadata.sensorId`将字段指定为[shard key 。](https://www.mongodb.com/docs/manual/core/sharding-shard-key/#std-label-shard-key)
- 指定`granularity`小时数。

以下文档包含该集合的适当元数据：

```
db.weather.insertOne( {
   "metadata": { "sensorId": 5578, "type": "temperature" },
   "timestamp": ISODate("2021-05-18T00:00:00.000Z"),
   "temp": 12
} )
```



### 分片现有时间序列集合[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-shard-collection/#shard-an-existing-time-series-collection)

 

#### 连接到您的分片集群。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-shard-collection/#connect-to-your-sharded-cluster-1)

连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)您的分片集群。指定`host`和`port`在其 `mongos`上运行：

```
mongosh --host <hostname> --port <port>
```



 

#### 确认您的数据库已启用分片。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-shard-collection/#confirm-that-sharding-is-enabled-on-your-database-1)

运行[`sh.status()`](https://www.mongodb.com/docs/manual/reference/method/sh.status/#mongodb-method-sh.status)以确认您的数据库已启用分片：

```
sh.status()
```



该命令返回分片信息：

```
--- Sharding Status ---
   sharding version: {
      "_id" : 1,
      "minCompatibleVersion" : 5,
      "currentVersion" : 6,
...
```



 

#### 分片集合。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-shard-collection/#shard-the-collection)

使用[`shardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection)方法对集合进行分片。

考虑具有以下属性的时间序列集合：

```
db.createCollection(
   "deliverySensor",
   {
      timeseries: {
         timeField: "timestamp",
         metaField: "metadata",
         granularity: "minutes"
      }
   }
)
```



该集合中的示例文档类似于：

```
db.deliverySensor.insertOne( {
   "metadata": { "location": "USA", "vehicle": "truck" },
   "timestamp": ISODate("2021-08-21T00:00:10.000Z"),
   "speed": 50
} )
```



要对集合进行分片，请运行以下命令：

```
sh.shardCollection( "test.deliverySensor", { "metadata.location": 1 } )
```



在这个例子中，[`sh.shardCollection()`：](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection)

- `deliverySensor`对`test`数据库中命名的现有时间序列集合进行分片。
- `metadata.location`将字段指定为[shard key](https://www.mongodb.com/docs/manual/core/sharding-shard-key/#std-label-shard-key)。`location`是集合的子字段 `metaField`。

当您指定的集合[`sh.shardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection)是时间序列集合时，您不需要指定 [timeseries](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#std-label-method-sharded-time-series-collection-options) 选项。

## 附加信息[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-shard-collection/#additional-information)

- [时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries-collections/#std-label-manual-timeseries-collection)
- [`sh.shardCollection()`](https://www.mongodb.com/docs/manual/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection)
- [`shardCollection`](https://www.mongodb.com/docs/manual/reference/command/shardCollection/#mongodb-dbcommand-dbcmd.shardCollection)

←  [在时间序列数据之上构建物化视图](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-build-materialized-views/)[时间序列集合的最佳实践](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-best-practices/) →

原文链接-https://www.mongodb.com/docs/manual/core/timeseries/timeseries-shard-collection/

译者：陆文龙