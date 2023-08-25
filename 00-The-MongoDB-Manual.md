#  MongoDB 用户手册 #

### 什么是 MongoDB？

MongoDB 是一个文档数据库，旨在简化应用程序开发和扩展。

运行 MongoDB

- [MongoDB Atlas](https://www.mongodb.com/cloud?tck=docs_server)完全在云端管理，
- 可用且免费使用的[MongoDB 社区](https://www.mongodb.com/docs/v7.0/administration/install-community/)来源，或
- MongoDB [Enterprise Advanced](https://www.mongodb.com/docs/v7.0/administration/install-community/)订阅。

[开始使用 MongoDB Atlas](https://www.mongodb.com/cloud?tck=docs_server)

你可以做什么

### 在 MongoDB 中处理您的数据

**存储和查询您的数据**

1. 为您的数据建模

   设计您的数据模式以支持频繁的访问模式。您可以随时更新或强制执行您的架构。

   [要了解更多信息，请参阅数据建模简介](https://www.mongodb.com/docs/v7.0/core/data-modeling-introduction/)

2. 连接到 MongoDB

   将数据从 CSV 或 JSON 文件导入到 MongoDB 数据库中。

   [要了解更多信息，请参阅 MongoDB Shell (mongosh)](https://www.mongodb.com/docs/mongodb-shell/)

3. 插入、查询、更新或删除文档

   使用 MongoDB 查询 API 对数据执行 CRUD 操作 - 无论是否有事务。

   [要了解更多信息，请参阅 MongoDB CRUD 操作](https://www.mongodb.com/docs/v7.0/crud/#std-label-crud)

```shell
➜ mongosh --port 27017
Current Mongosh Log ID:  123a4bc5d67891011ef1213g
Connecting to:    mongodb://127.0.0.1:27017/

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

test> db.messages.insertMany([
         {
            message: "Hello World!",
            author: "MongoDB",
            comments: [],
            _id: 1
         }
      ])
{ acknowledged: true, insertedIds: { '0': 1 } }

test> db.messages.findOne({ _id: 1 })
{ _id: 1, message: 'Hello World!', author: 'MongoDB', comments: [] }
```

**使用聚合转换数据**

1. 导入您的数据

   使用 mongoimport 从 CSV 或 JSON 文件导入数据。

   要了解更多信息，请参阅 [mongoimport](https://www.mongodb.com/docs/database-tools/mongoimport/)

2. 聚合您的数据

   使用聚合管道分多个阶段处理数据并返回计算结果。

   要了解更多信息，请参阅[聚合操作。](https://www.mongodb.com/docs/v7.0/aggregation/#std-label-aggregation)

```shell
test> db.orders.insertMany([
   { "item" : "almonds", "price" : 12, "quantity" : 2 },
   { "item" : "pecans", "price" : 20, "quantity" : 1 },
])

test> db.inventory.insertMany([
   { "sku" : "almonds", "description": "product 1", "instock" : 120 },
   { "sku" : "cashews", "description": "product 3", "instock" : 60 },
   { "sku" : "pecans", "description": "product 4", "instock" : 70 }
])

test> db.orders.aggregate([
   { $match: { price: { $lt: 15 } } },
   { $lookup: {
         from: "inventory",
         localField: "item",
         foreignField: "sku",
         as: "inventory_docs"
   } },
   { $sort: { price: 1 } },
])
```

**安全访问您的数据**

1. 验证客户端身份

   通过身份验证验证用户、副本集成员或分片集群成员的身份。

   [要了解更多信息，请参阅身份验证](https://www.mongodb.com/docs/v7.0/core/authentication/#std-label-authentication)

2. 控制对数据库的访问

   启用基于角色的访问控制来管理整个数据库集群或单个集合的用户权限。

   [要了解更多信息，请参阅基于角色的访问控制](https://www.mongodb.com/docs/v7.0/core/authorization/#std-label-authorization)

3. 加密您最敏感的数据

   客户端字段级加密可在数据库使用数据时保护数据。字段在离开应用程序之前会被加密，从而通过网络、内存和静态方式保护它们。

   要了解更多信息，请参阅[客户端字段级加密。](https://www.mongodb.com/docs/v7.0/core/csfle/#std-label-manual-csfle-feature)

**部署和扩展您的数据库**

1. 部署副本集

   通过部署副本集为数据库提供冗余和弹性。

   [要了解更多信息，请参阅复制](https://www.mongodb.com/docs/v7.0/replication/#std-label-replication)

2. 扩展您的数据库

   使用分片来水平扩展数据库或确保基于位置的数据分离。

   [要了解更多信息，请参阅分片](https://www.mongodb.com/docs/v7.0/sharding/#std-label-sharding-introduction)

相关产品和资源

### 进一步探索 MongoDB

探索 MongoDB 的库和工具。

* 以您的应用程序语言使用 MongoDB

  [了解驱动程序](https://www.mongodb.com/docs/drivers/)

* 使用 MongoDB Compass 直观地探索您的数据

  [查看Compass文档](https://www.mongodb.com/docs/compass/current/)

* 管理和监控您的部署

  [查看Ops Manager](https://www.mongodb.com/docs/ops-manager/current/)
