# MongoDB 查询 API

在本页面

[文档模型]()

[代码即数据]()

[入门指南]()



 `MongoDB Query API`是用于与数据交互的方式。

`Query API`包含两种在`MongoDB`中查询数据的方法:

- [CRUD Operations](https://www.mongodb.com/docs/v6.0/crud/)
- [Aggregation pipelines](https://www.mongodb.com/docs/v6.0/core/aggregation-pipeline/)

 你可以使用查询`API`来执行:

-  特定的查询。探索 MongoDB 数据使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), [罗盘](https://www.mongodb.com/docs/compass/current/), [VSCode](https://code.visualstudio.com/docs/azure/mongodb) 或`MongoDB`[driver](https://www.mongodb.com/docs/drivers/)。
- 数据转换。使用 [聚合管道](https://www.mongodb.com/docs/v6.0/core/aggregation-pipeline/)改造数据并执行计算。
- 文档连接支持 使用[`$lookup`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup) 和 [`$unionWith`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/unionWith/#mongodb-pipeline-pipe.-unionWith) 组合来自不同集合的数据。
- 图形和地理空间查询。使用[`$geoWithin`](https://www.mongodb.com/docs/v6.0/reference/operator/query/geoWithin/#mongodb-query-op.-geoWithin) 和 [`$geoNear`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear) 等操作符分析地理空间数据，使用 [`$graphLookup`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/graphLookup/#mongodb-pipeline-pipe.-graphLookup) 分析图形数据。
- 全文检索。使用[`$search`](https://www.mongodb.com/docs/atlas/atlas-search/query-syntax/#mongodb-pipeline-pipe.-search)阶段对数据执行高效的文本搜索。
- 索引。 通过为数据架构使用正确的 [index type](https://www.mongodb.com/docs/v6.0/indexes/#std-label-indexes)来提高`MongoDB`查询性能。
- 按需物化视图。 使用[`$out`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out) 和 [`$merge`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge) 为常见查询创建物化视图。
- 时序分析。使用[时间序列集合](https://www.mongodb.com/docs/v6.0/core/timeseries/timeseries-procedures/#std-label-manual-timeseries-collection-create)查询和聚合时间戳数据。



## 文档模型

 `MongoDB`中的文档是由字段和键值对组成的数据结构。文档存储为`BSON`，它是[JSON](https://www.mongodb.com/docs/v6.0/reference/glossary/#std-term-JSON)的二进制表示形式。 这种抽象程度较低可以帮助您更快地开发，并减少查询和数据建模方面的工作。文档模型提供了几个优点，包括:

- 在许多编程语言中，文档对应于原生数据类型。
- 嵌入式文档和数组减少了对昂贵连接的需求。
- 灵活的模式。 文档不需要具有相同的字段集，并且集合中的不同文档中的字段的数据类型可能不同。



## 代码即数据

MongoDB查询 API支持[drivers](https://www.mongodb.com/docs/drivers/)对于重要的编程语言。这些驱动程序允许调用数据库并使用应用程序的原生语法生成查询。



## 入门指南

 要准备开始，请访问`MongoDB`[入门指南](https://www.mongodb.com/docs/v6.0/tutorial/getting-started/)。在这里你可以找到资源，代码示例和教程，演示`MongoDB`查询`API`。



原文链接：https://www.mongodb.com/docs/v6.0/query-api/

译者：杨帅



