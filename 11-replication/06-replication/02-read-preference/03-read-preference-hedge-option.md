# 对冲阅读期权[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-hedge-option/#hedged-read-option)

从用于分片集群的 MongoDB 4.4 开始，您可以指定对非[读取首选项使用](https://www.mongodb.com/docs/manual/core/read-preference/)[对冲读取](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)[。](https://www.mongodb.com/docs/manual/core/read-preference/)`primary`

通过对冲读取，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例可以将读取操作路由到每个查询分片的两个副本集成员，并从每个分片的第一个响应者返回结果。

以下操作支持对冲读取：

| [`collStats`](https://www.mongodb.com/docs/manual/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats)[`count`](https://www.mongodb.com/docs/manual/reference/command/count/#mongodb-dbcommand-dbcmd.count)[`dataSize`](https://www.mongodb.com/docs/manual/reference/command/dataSize/#mongodb-dbcommand-dbcmd.dataSize)[`dbStats`](https://www.mongodb.com/docs/manual/reference/command/dbStats/#mongodb-dbcommand-dbcmd.dbStats)[`distinct`](https://www.mongodb.com/docs/manual/reference/command/distinct/#mongodb-dbcommand-dbcmd.distinct) | [`filemd5`](https://www.mongodb.com/docs/manual/reference/command/filemd5/#mongodb-dbcommand-dbcmd.filemd5)[`find`](https://www.mongodb.com/docs/manual/reference/command/find/#mongodb-dbcommand-dbcmd.find)[`listCollections`](https://www.mongodb.com/docs/manual/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections)[`listIndexes`](https://www.mongodb.com/docs/manual/reference/command/listIndexes/#mongodb-dbcommand-dbcmd.listIndexes)[`planCacheListFilters`](https://www.mongodb.com/docs/manual/reference/command/planCacheListFilters/#mongodb-dbcommand-dbcmd.planCacheListFilters) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |

为了为读取首选项指定对冲读取，MongoDB 4.4 为读取首选项引入了对冲读取选项。

## 启用对冲读取[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-hedge-option/#enable-hedged-reads)

要使用对冲读取，请为非读取首选项启用对冲读取选项`primary` 。读取首选项[`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest)默认指定对冲读取。

- 使用驱动程序时，请参阅[司机的阅读偏好API 。](https://www.mongodb.com/docs/drivers/)
- 使用时[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), 您可以使用辅助方法[`cursor.readPref()`](https://www.mongodb.com/docs/manual/reference/method/cursor.readPref/#mongodb-method-cursor.readPref)和[`Mongo.setReadPref()`.](https://www.mongodb.com/docs/manual/reference/method/Mongo.setReadPref/#mongodb-method-Mongo.setReadPref)

## 附加信息[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-hedge-option/#additional-information)

有关对冲读取的更多信息，请参阅[对冲读取。](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-mongos-hedged-reads)

### 使用对冲读取的成员选择[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-hedge-option/#member-selection-with-hedged-reads)

有关对冲读取的成员选择的详细信息，请参阅 [读取首选项和碎片。](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#std-label-read-preference-mechanics-sharded-cluster)

### 对冲读取诊断[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-hedge-option/#hedged-reads-diagnostics)

命令[`serverStatus`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)及其对应 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)方法[`db.serverStatus()`](https://www.mongodb.com/docs/manual/reference/method/db.serverStatus/#mongodb-method-db.serverStatus)返回 [`hedgingMetrics`。](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.hedgingMetrics)

←  [阅读偏好`maxStalenessSeconds`](https://www.mongodb.com/docs/manual/core/read-preference-staleness/)[阅读偏好用例](https://www.mongodb.com/docs/manual/core/read-preference-use-cases/)

原文链接 -  https://docs.mongodb.com/manual/core/read-preference-hedge-option/ 

译者：陆文龙

