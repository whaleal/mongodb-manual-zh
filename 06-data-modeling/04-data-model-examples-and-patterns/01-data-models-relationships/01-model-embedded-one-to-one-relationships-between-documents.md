**与嵌入式文档建立一对一关系模型**

**概述**

本页介绍了一种数据模型，该模型使用[嵌入式](https://www.mongodb.com/docs/manual/core/data-model-design/#std-label-data-modeling-embedding)文档来描述连接数据之间的一对一关系。在单个文档中嵌入关联数据可以减少获取数据所需的读取操作次数。通常，您应该构造您的架构，以便您的应用程序在单个读取操作中接收所有必需的信息。

**嵌入式文档模式**

考虑以下映射赞助人和地址关系的示例。该示例说明了如果您需要在另一个数据实体的上下文中查看一个数据实体，则嵌入优于引用。`patron`在和 `address`数据之间的这种一对一关系中， the`address`属于`patron`.

在规范化数据模型中，`address`文档包含对文档的引用`patron`。

```json
// patron document
{
   _id: "joe",
   name: "Joe Bookreader"
}

// address document
{
   patron_id: "joe", // reference to patron document
   street: "123 Fake Street",
   city: "Faketon",
   state: "MA",
   zip: "12345"
}
```

如果`address`经常使用`name` 信息检索数据，然后使用引用，您的应用程序需要发出多个查询来解析引用。更好的数据模型是将数据嵌入到`address`数据中`patron`，如以下文档所示：

```json
{
   _id: "joe",
   name: "Joe Bookreader",
   address: {
              street: "123 Fake Street",
              city: "Faketon",
              state: "MA",
              zip: "12345"
            }
}
```

使用嵌入式数据模型，您的应用程序可以通过一次查询检索完整的顾客信息。

**子集模式**

[嵌入式文档模式](https://www.mongodb.com/docs/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/#std-label-one-to-many-embedded-document-pattern)的一个潜在问题是它可能导致包含应用程序不需要的字段的大型文档。这些不必要的数据可能会给您的服务器带来额外的负载并减慢读取操作。相反，您可以使用子集模式来检索在单个数据库调用中访问最频繁的数据子集。

考虑一个显示电影信息的应用程序。数据库包含`movie`具有以下架构的集合：

```json
{
  "_id": 1,
  "title": "The Arrival of a Train",
  "year": 1896,
  "runtime": 1,
  "released": ISODate("01-25-1896"),
  "poster": "http://ia.media-imdb.com/images/M/MV5BMjEyNDk5MDYzOV5BMl5BanBnXkFtZTgwNjIxMTEwMzE@._V1_SX300.jpg",
  "plot": "A group of people are standing in a straight line along the platform of a railway station, waiting for a train, which is seen coming at some distance. When the train stops at the platform, ...",
  "fullplot": "A group of people are standing in a straight line along the platform of a railway station, waiting for a train, which is seen coming at some distance. When the train stops at the platform, the line dissolves. The doors of the railway-cars open, and people on the platform help passengers to get off.",
  "lastupdated": ISODate("2015-08-15T10:06:53"),
  "type": "movie",
  "directors": [ "Auguste Lumière", "Louis Lumière" ],
  "imdb": {
    "rating": 7.3,
    "votes": 5043,
    "id": 12
  },
  "countries": [ "France" ],
  "genres": [ "Documentary", "Short" ],
  "tomatoes": {
    "viewer": {
      "rating": 3.7,
      "numReviews": 59
    },
    "lastUpdated": ISODate("2020-01-09T00:02:53")
  }
}
```

目前，该`movie`集合包含几个字段，应用程序不需要这些字段来显示电影的简单概览，例如 `fullplot`评级信息。您可以将集合拆分为两个集合，而不是将所有电影数据存储在一个集合中：

- 该`movie`集合包含有关电影的基本信息。这是应用程序默认加载的数据：

  ```json
  // movie collection
  
  {
    "_id": 1,
    "title": "The Arrival of a Train",
    "year": 1896,
    "runtime": 1,
    "released": ISODate("1896-01-25"),
    "type": "movie",
    "directors": [ "Auguste Lumière", "Louis Lumière" ],
    "countries": [ "France" ],
    "genres": [ "Documentary", "Short" ],
  }
  ```

- 该`movie_details`集合包含每部电影的额外的、访问频率较低的数据：

  ```json
  // movie_details collection
  
  {
    "_id": 156,
    "movie_id": 1, // reference to the movie collection
    "poster": "http://ia.media-imdb.com/images/M/MV5BMjEyNDk5MDYzOV5BMl5BanBnXkFtZTgwNjIxMTEwMzE@._V1_SX300.jpg",
    "plot": "A group of people are standing in a straight line along the platform of a railway station, waiting for a train, which is seen coming at some distance. When the train stops at the platform, ...",
    "fullplot": "A group of people are standing in a straight line along the platform of a railway station, waiting for a train, which is seen coming at some distance. When the train stops at the platform, the line dissolves. The doors of the railway-cars open, and people on the platform help passengers to get off.",
    "lastupdated": ISODate("2015-08-15T10:06:53"),
    "imdb": {
      "rating": 7.3,
      "votes": 5043,
      "id": 12
    },
    "tomatoes": {
      "viewer": {
        "rating": 3.7,
        "numReviews": 59
      },
      "lastUpdated": ISODate("2020-01-29T00:02:53")
    }
  }
  ```

此方法提高了读取性能，因为它需要应用程序读取较少的数据来满足其最常见的请求。如果需要，应用程序可以进行额外的数据库调用以获取访问频率较低的数据。

>[TIP]
>
>在考虑将数据拆分到哪里时，最常访问的数据部分应该放在应用程序最先加载的集合中。

>[TIP]
>
>也可以看看：
>
>要了解如何使用子集模式对集合之间的一对多关系 [建模，请参阅使用嵌入式文档对一对多关系建模。](https://www.mongodb.com/docs/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/#std-label-data-modeling-example-one-to-many)

**子集模式的权衡**

使用包含更频繁访问的数据的较小文档可以减少工作集的整体大小。这些较小的文档可以提高读取性能，并为应用程序提供更多可用内存。

但是，了解您的应用程序及其加载数据的方式很重要。如果您不恰当地将数据分成多个集合，您的应用程序通常需要多次访问数据库并依赖`JOIN`操作来检索它需要的所有数据。

此外，将数据拆分为许多小集合可能会增加所需的数据库维护，因为可能很难跟踪哪些数据存储在哪个集合中。

 参见

原文 - [Model One-to-One Relationships with Embedded Documents]( https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-one-relationships-between-documents/ )

译者：景圣
