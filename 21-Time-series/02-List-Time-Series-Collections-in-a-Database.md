# 列出数据库中的时间序列集合

您可以输出数据库中的集合列表，并按各种属性（包括集合类型）过滤结果。您可以使用此功能列出数据库中的所有时间序列集合。

## 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-check-type/#procedure)

要列出数据库中的所有时间序列集合，请使用 [`listCollections`](https://www.mongodb.com/docs/manual/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections)带有过滤器的命令 `{ type: "timeseries" }`：

```
db.runCommand( {
   listCollections: 1,
   filter: { type: "timeseries" }
} )
```



## 输出[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-check-type/#output)

对于时间序列集合，输出包括：

- `type: 'timeseries'`
- `options: { timeseries: { ... } }`

例如：

```
{
  cursor: {
    id: Long("0"),
    ns: 'test.$cmd.listCollections',
    firstBatch: [
      {
        name: 'weather',
        type: 'timeseries',
        options: {
          timeseries: {
            timeField: 'timestamp',
            metaField: 'metadata',
            granularity: 'hours',
            bucketMaxSpanSeconds: 2592000
          }
        },
        info: { readOnly: false }
      }
    ]
  },
  ok: 1
}
```

←  [创建和查询时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-procedures/)[为时间序列集合 (TTL) 设置自动删除](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-automatic-removal/) →