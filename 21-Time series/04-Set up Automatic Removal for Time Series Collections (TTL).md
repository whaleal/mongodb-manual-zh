# 为时间序列集合 (TTL) 设置自动删除

创建[时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries-collections/#std-label-manual-timeseries-collection)时，可以使用参数设置自动移除早于指定秒数的文档 `expireAfterSeconds`：

```
db.createCollection(
    "weather24h",
    {
       timeseries: {
          timeField: "timestamp",
          metaField: "metadata",
          granularity: "hours"
       },
       expireAfterSeconds: 86400
    }
)
```



到期阈值是`timeField`字段值加上指定的秒数。`weather24h`考虑集合中的以下文档 ：

```
{
   "metadata": {"sensorId": 5578, "type": "temperature"},
   "timestamp": ISODate("2021-05-18T10:00:00.000Z"),
   "temp": 12
}
```



该文档将从数据库中过期于 `"2021-05-19T10:00:00.000Z"`。一旦存储桶中的所有文档都过期，删除过期存储桶的后台任务将在下一次运行期间删除该存储桶。看 [删除操作的时机](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-automatic-removal/#std-label-timeseries-collection-delete-operations-timing)想要查询更多的信息。

## 在集合上启用自动删除[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-automatic-removal/#enable-automatic-removal-on-a-collection)

要为现有[时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries-collections/#std-label-manual-timeseries-collection)启用自动删除文档，请发出以下 [`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令：

```
db.runCommand({
   collMod: "weather24h",
   expireAfterSeconds: 604801
})
```



## 更改`expireAfterSeconds`参数[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-automatic-removal/#change-the-expireafterseconds-parameter)

要更改`expireAfterSeconds`参数值，请发出以下 [`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令：

```shell
db.runCommand({
   collMod: "weather24h",
   expireAfterSeconds: 604801
})
```



## 检索当前值`expireAfterSeconds`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-automatic-removal/#retrieve-the-current-value-of-expireafterseconds)

要检索的当前值`expireAfterSeconds`，请使用以下 [`listCollections`](https://www.mongodb.com/docs/manual/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections)命令：

```
db.runCommand( { listCollections: 1 } )
```



结果文档包含包含该`options.expireAfterSeconds`字段的时间序列集合的文档。

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
               timeseries: { ... }
            },
            ...
         },
         ...
       ]
    }
 }
```



## 禁用自动删除[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-automatic-removal/#disable-automatic-removal)

要禁用自动删除，请使用[`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令设置`expireAfterSeconds`为`off`：

```
db.runCommand({
    collMod: "weather24h",
    expireAfterSeconds: "off"
})
```



## 行为[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-automatic-removal/#behavior)



### 删除操作的时机[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-automatic-removal/#timing-of-delete-operations)

MongoDB 不保证过期数据会在过期后立即被删除。一旦存储桶中的所有文档都过期，删除过期存储桶的后台任务将在下一次运行期间删除该存储桶。单个桶允许覆盖的最大时间跨度由`granularity`时间序列集合的 控制：

| `granularity`       | 覆盖时间跨度 |
| :------------------ | :----------- |
| `"seconds"`（默认） | 一小时       |
| `"minutes"`         | 24小时       |
| `"hours"`           | 30天         |

删除过期存储桶的后台任务每 60 秒运行一次。因此，在文档到期、桶中所有其他文档到期和后台任务运行之间的时间段内，文档可能保留在集合中。

因为删除操作的持续时间取决于您的 mongod 实例的工作负载，所以过期数据可能会存在超过后台任务运行之间 60 秒的时间。

←  [列出数据库中的时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-check-type/)[设置时间序列数据的粒度](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-granularity/) →



原文链接 -https://www.mongodb.com/docs/manual/core/timeseries/timeseries-automatic-removal/

译者：陆文龙