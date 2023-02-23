# MongoDB Shell (`mongosh`)

MongoDB Shell mongosh是一个功能齐全的JavaScript和Node.js 16.x REPL环境，用于与MongoDB部署交互。您可以使用MongoDBShell直接对数据库测试查询和操作。

`mongosh`在MongoDB[下载中心作](https://www.mongodb.com/try/download/shell?jmp=docs)为一个独立的包提供。

## 下载并安装 `mongosh`

要了解如何下载和安装`mongosh`二进制文件，请参见 [安装 `mongosh` 。](https://www.mongodb.com/docs/mongodb-shell/install/#std-label-mdb-shell-install)

## 连接到MongoDB

一旦安装了MongoDB Shell并将其添加到系统PATH中，就可以连接到MongoDB。要了解详细信息，请参见[连接到mongodb](https://www.mongodb.com/docs/mongodb-shell/connect/#std-label-mdb-shell-connect)

## 该MongoDB Shell对比传统的`mongo` Shell

传统的mongo shell在MongoDB 5.0中被弃用，在MongoDB 6.0中被删除。新的MongoDB Shell mongosh提供了许多优于传统Shell的优点。新shell改进了：

* 与MongoDB Node.js驱动程序兼容
* 语法突出显示
* 命令历史
* Logging

在mongosh中，一些遗留方法不可用或已被更新的方法替换。为了保持向后兼容性，Mongosh支持的遗留方法使用与MongoShell中相应方法相同的语法。

查看支持的方法的完整列表 `mongosh`，请参阅： [MongoDB shell方法。](https://www.mongodb.com/docs/mongodb-shell/reference/methods/)

## 了解更多

* [连接到MongoDB部署](https://www.mongodb.com/docs/mongodb-shell/connect/#std-label-mdb-shell-connect)
* [执行CRUD操作](https://www.mongodb.com/docs/mongodb-shell/crud/#std-label-mdb-shell-crud)
* [运行聚合管道](https://www.mongodb.com/docs/mongodb-shell/run-agg-pipelines/#std-label-mdb-shell-aggregation)
* [使用编辑器模式。](https://www.mongodb.com/docs/mongodb-shell/reference/editor-mode/#std-label-mongosh-editor-mode)
* [编写脚本](https://www.mongodb.com/docs/mongodb-shell/write-scripts/#std-label-mdb-shell-write-scripts)
* [检索日志](https://www.mongodb.com/docs/mongodb-shell/logs/#std-label-mdb-shell-logs)
* [在MongoDBShell中查看可用方法](https://www.mongodb.com/docs/mongodb-shell/reference/methods/#std-label-mdb-shell-methods)





翻译：韩鹏帅

原文：[MongoDB Shell (`mongosh`)](https://www.mongodb.com/docs/mongodb-shell/)