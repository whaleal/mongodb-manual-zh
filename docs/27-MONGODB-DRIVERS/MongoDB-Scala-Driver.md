# MongoDB的Scala驱动

**在本页面**

- [概述](#概述)
- [安装](#安装)
- [连接到MongoDB Atlas](#连接)
- [兼容性](#兼容)

## <span id="概述">概述</span>

这是官方支持的MongoDB的Scala驱动程序。

它是一个具有异步和非阻塞IO的现代惯用Scala驱动程序。

- [参考文档](http://mongodb.github.io/mongo-java-driver/4.1/driver-scala/)

- [教程](http://mongodb.github.io/mongo-java-driver/4.1/driver-scala/tutorials/)

- [API 文档](http://mongodb.github.io/mongo-java-driver/4.1/apidocs/)

- [What's New](https://mongodb.github.io/mongo-java-driver/4.1/whats-new/)

- [源代码](http://github.com/mongodb/mongo-scala-driver)

  

## <span id="安装">安装</span>

在项目中开始使用驱动程序的推荐方法是使用依赖项管理系统，比如sbt或maven。有关更多信息，请参阅[安装指南](http://mongodb.github.io/mongo-java-driver/4.1/driver-scala/getting-started/installation/) 。

## <span id="连接">连接到MongoDB Atlas</span>

要连接到[MongoDB Atlas](https://docs.atlas.mongodb.com/) 集群，请使用集群的[Atlas连接字符串](https://docs.atlas.mongodb.com/driver-connection) :

```powershell
import org.mongodb.scala._

// ...

val uri: String = "mongodb+srv://<username>:<password>@<cluster-address>/test?retryWrites=true&w=majority"
System.setProperty("org.mongodb.async.type", "netty")
val client: MongoClient = MongoClient(uri)
val db: MongoDatabase = client.getDatabase("test")
```

请参阅我们的连接指南，了解更多的连接方式。

## <span id="兼容">兼容性</span>

### MongoDB的兼容性

| Scala 驱动 | MongoDB 4.4 | MongoDB 4.2 | MongoDB 4.0 | MongoDB 3.6 | MongoDB 3.4 | MongoDB 3.2 | MongoDB 3.0 | MongoDB 2.6 |
| :--------- | :---------: | :---------: | :---------: | :---------: | :---------: | :---------: | :---------: | :---------: |
| 4.1        |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |
| 2.9        |             |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |
| 2.8        |             |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |
| 2.7        |             |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |
| 2.6        |             |             |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |
| 2.5        |             |             |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |
| 2.4        |             |             |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |
| 2.3        |             |             |             |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |
| 2.2        |             |             |             |      ✓      |      ✓      |      ✓      |      ✓      |      ✓      |
| 2.1        |             |             |             |             |      ✓      |      ✓      |      ✓      |      ✓      |
| 2.0        |             |             |             |             |      ✓      |      ✓      |      ✓      |      ✓      |
| 1.2        |             |             |             |             |      ✓      |      ✓      |      ✓      |      ✓      |
| 1.1        |             |             |             |             |             |      ✓      |      ✓      |      ✓      |
| 1.0        |             |             |             |             |             |             |      ✓      |      ✓      |

驱动程序不支持旧版本的MongoDB。

### 语言的兼容性

| Scala 驱动 | Scala 2.13 | Scala 2.12 | Scala 2.11 |
| :--------- | :--------: | :--------: | :--------: |
| 2.9        |     ✓      |     ✓      |     ✓      |
| 2.8        |     ✓      |     ✓      |     ✓      |
| 2.7        |     ✓      |     ✓      |     ✓      |
| 2.6        |            |     ✓      |     ✓      |
| 2.5        |            |     ✓      |     ✓      |
| 2.4        |            |     ✓      |     ✓      |
| 2.3        |            |     ✓      |     ✓      |
| 2.2        |            |     ✓      |     ✓      |
| 2.1        |            |     ✓      |     ✓      |
| 2.0        |            |     ✓      |     ✓      |
| 1.1        |            |     ✓      |     ✓      |
| 1.1        |            |            |     ✓      |
| 1.0        |            |            |     ✓      |

有关如何阅读兼容性表的更多信息，请参阅我们的MongoDB兼容性表指南。

### 如何获得帮助

- 在我们的[MongoDB社区论坛](https://community.mongodb.com/)上提问。
- 访问我们的[支持渠道](https://docs.mongodb.com/manual/support/)。
- 查看我们的[SCALA](https://jira.mongodb.org/browse/SCALA) JIRA项目来提出问题或请求特性。