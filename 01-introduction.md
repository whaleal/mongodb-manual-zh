#  MongoDB简介

在本页面

- [文档型数据库]()

- [主要特点]()



## 文档型数据库

在MongoDB中的一条记录代表一个文档，它是由字段和键值对组成的数据结构。MongoDB文档类似于JSON对象。字段的值可以包括其他文档、数组和文档数组。

![A MongoDB document.](https://www.mongodb.com/docs/v6.0/images/crud-annotated-document.bakedsvg.svg)



使用文档型的优点有：

- 在许多编程语言中文档型对应于原生数据类型			
-  嵌入式文档和数组减少了对昂贵的连接的需求
-  动态模式支持流畅的多态性



## 集合/视图/灵活的物化视图



MongoDB以集合([collections](https://www.mongodb.com/docs/v6.0/core/databases-and-collections/#std-label-collections))的形式存储文档。集合类似于关系型数据库中的表(tables)。

除了集合，MongoDB还支持:

- 只读视图([views](https://www.mongodb.com/docs/v6.0/core/views/))（从MongoDB3.4开始）
- [灵活的物化视图](https://www.mongodb.com/docs/v6.0/core/materialized-views/)(从MongoDB4.2开始)



## 主要特点

### 高性能

 MongoDB提供高性能数据持久性。特别是：

- 支持嵌入式数据模型降低数据库在系统上的I/O消耗
- 索引支持更快的查询，并可以包括来自嵌入式文档和数组的keys。

### 查询API

MongoDB查询API支持[读写操作(CRUD)](https://www.mongodb.com/docs/v6.0/crud/)以及:

- [数据聚合](https://www.mongodb.com/docs/v6.0/core/aggregation-pipeline/)
-  [文本检索](https://www.mongodb.com/docs/v6.0/text-search/)和[地理空间查询](https://www.mongodb.com/docs/v6.0/tutorial/geospatial-tutorial/)。

```html
Tip:
	另请参考：
		[SQL to MongoDB Mapping Chart](https://www.mongodb.com/docs/v6.0/reference/sql-comparison/)
		[SQL to Aggregation Mapping Chart](https://www.mongodb.com/docs/v6.0/reference/sql-aggregation-comparison/)
		
```

### 高可用

MongoDB的复制功能，称为复制集，提供:

- 自动故障转移
- 数据冗余

 复制集是一组MongoDB服务器，它们维护相同的数据集群，提供冗余并提高数据可用性。

### 水平拓展

 MongoDB将水平可伸缩性作为其核心功能的一部分:

- [分片](https://www.mongodb.com/docs/v6.0/sharding/#std-label-sharding-introduction)将数据分布在一组机器上。
- 从 3.4 开始，MongoDB 支持基于[shard key](https://www.mongodb.com/docs/v6.0/reference/glossary/#std-term-shard-key)创建数据[zones](https://www.mongodb.com/docs/v6.0/core/zone-sharding/#std-label-zone-sharding)。在一个平衡(balanced)集群中，MongoDB 将zone覆盖的读取和写入仅定向到zone内的那些分片。有关详细信息，请参阅[区域](https://www.mongodb.com/docs/v6.0/core/zone-sharding/#std-label-zone-sharding) 手册页。

###  支持多种存储引擎

MongoDB支持多种存储引擎:

- [WiredTiger Storage Engine](https://www.mongodb.com/docs/v6.0/core/wiredtiger/)(包括对[静止加密](https://www.mongodb.com/docs/v6.0/core/security-encryption-at-rest/)的支持))
- [In-Memory Storage Engine.](https://www.mongodb.com/docs/v6.0/core/inmemory/)

此外，MongoDB还提供了可插拔的存储引擎API，允许第三方为MongoDB开发存储引擎。





原文链接：https://www.mongodb.com/docs/v6.0/introduction/

译者：杨帅




