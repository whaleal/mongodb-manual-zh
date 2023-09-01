## 聚合命令

> 笔记: 
>
> 有关特定运算符的详细信息，包括语法和示例，请单击运算符参考页面的链接。

### 聚合命令

| Name                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`aggregate`](https://www.mongodb.com/docs/manual/reference/command/aggregate/#mongodb-dbcommand-dbcmd.aggregate) | 执行[聚合任务](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/#std-label-aggregation-pipeline)，例如[`$group`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group)使用聚合管道。 |
| [`count`](https://www.mongodb.com/docs/manual/reference/command/count/#mongodb-dbcommand-dbcmd.count) | 计算集合或视图中的文档数。                                   |
| [`distinct`](https://www.mongodb.com/docs/manual/reference/command/distinct/#mongodb-dbcommand-dbcmd.distinct) | 显示在集合或视图中为指定键找到的不同值。                     |
| [`mapReduce`](https://www.mongodb.com/docs/manual/reference/command/mapReduce/#mongodb-dbcommand-dbcmd.mapReduce) | 对大型数据集执行[映射减少聚合。](https://www.mongodb.com/docs/manual/core/map-reduce/#std-label-map-reduce) |

### 聚合方法

| Name                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`db.collection.aggregate()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.aggregate/#mongodb-method-db.collection.aggregate) | 提供对[聚合管道的访问。](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/#std-label-aggregation-pipeline) |
| [`db.collection.mapReduce()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.mapReduce/#mongodb-method-db.collection.mapReduce) | 对大型数据集执行[映射减少聚合。](https://www.mongodb.com/docs/manual/core/map-reduce/#std-label-map-reduce) |



 参见

原文 - [Aggregation Commands]( https://docs.mongodb.com/manual/reference/operator/aggregation/interface/ )

