**与嵌入式文档建立一对多关系模型**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/#model-one-to-many-relationships-with-embedded-documents)

**概述**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/#overview)

本页介绍了一种数据模型，该模型使用[嵌入式](https://www.mongodb.com/docs/manual/core/data-model-design/#std-label-data-modeling-embedding)文档来描述连接数据之间的一对多关系。在单个文档中嵌入关联数据可以减少获取数据所需的读取操作次数。通常，您应该构造您的架构，以便您的应用程序在单个读取操作中接收所有必需的信息。

**嵌入式文档模式**

考虑以下映射赞助人和多个地址关系的示例。该示例说明了如果您需要在另一个上下文中查看许多数据实体，则嵌入优于引用的优势。`patron`在和 `address`数据之间的这种一对多关系中，`patron`有多个`address`实体。

在规范化数据模型中，`address`文档包含对文档的引用`patron`。

```json
// patron document
{
   _id: "joe",
   name: "Joe Bookreader"
}

// address documents
{
   patron_id: "joe", // reference to patron document
   street: "123 Fake Street",
   city: "Faketon",
   state: "MA",
   zip: "12345"
}

{
   patron_id: "joe",
   street: "1 Some Other Street",
   city: "Boston",
   state: "MA",
   zip: "12345"
}
```

如果您的应用程序频繁检索`address`包含信息的数据 `name`，那么您的应用程序需要发出多个查询来解析引用。更理想的模式是将`address`数据实体嵌入数据中`patron`，如以下文档所示：

```json
{
   "_id": "joe",
   "name": "Joe Bookreader",
   "addresses": [
                {
                  "street": "123 Fake Street",
                  "city": "Faketon",
                  "state": "MA",
                  "zip": "12345"
                },
                {
                  "street": "1 Some Other Street",
                  "city": "Boston",
                  "state": "MA",
                  "zip": "12345"
                }
              ]
 }
```

使用嵌入式数据模型，您的应用程序可以通过一次查询检索完整的顾客信息。

**子集模式**

一个潜在的问题[嵌入式文档模式](https://www.mongodb.com/docs/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/#std-label-one-to-many-embedded-document-pattern)是它会导致大文档，特别是如果嵌入字段是无界的。在这种情况下，您可以使用子集模式来仅访问应用程序所需的数据，而不是整个嵌入式数据集。

考虑一个具有产品评论列表的电子商务网站：

```json
{
  "_id": 1,
  "name": "Super Widget",
  "description": "This is the most useful item in your toolbox.",
  "price": { "value": NumberDecimal("119.99"), "currency": "USD" },
  "reviews": [
    {
      "review_id": 786,
      "review_author": "Kristina",
      "review_text": "This is indeed an amazing widget.",
      "published_date": ISODate("2019-02-18")
    },
    {
      "review_id": 785,
      "review_author": "Trina",
      "review_text": "Nice product. Slow shipping.",
      "published_date": ISODate("2019-02-17")
    },
    ...
    {
      "review_id": 1,
      "review_author": "Hans",
      "review_text": "Meh, it's okay.",
      "published_date": ISODate("2017-12-06")
    }
  ]
}
```

评论按时间倒序排列。当用户访问产品页面时，应用程序会加载十个最近的评论。

您可以将集合拆分为两个集合，而不是将所有评论与产品一起存储：

- 该`product`集合存储每个产品的信息，包括该产品的十个最新评论：

  ```json
  {
    "_id": 1,
    "name": "Super Widget",
    "description": "This is the most useful item in your toolbox.",
    "price": { "value": NumberDecimal("119.99"), "currency": "USD" },
    "reviews": [
      {
        "review_id": 786,
        "review_author": "Kristina",
        "review_text": "This is indeed an amazing widget.",
        "published_date": ISODate("2019-02-18")
      }
      ...
      {
        "review_id": 777,
        "review_author": "Pablo",
        "review_text": "Amazing!",
        "published_date": ISODate("2019-02-16")
      }
    ]
  }
  ```

- 该`review`集合存储所有评论。每篇评论都包含对其所针对的产品的引用。

  ```json
  {
    "review_id": 786,
    "product_id": 1,
    "review_author": "Kristina",
    "review_text": "This is indeed an amazing widget.",
    "published_date": ISODate("2019-02-18")
  }
  {
    "review_id": 785,
    "product_id": 1,
    "review_author": "Trina",
    "review_text": "Nice product. Slow shipping.",
    "published_date": ISODate("2019-02-17")
  }
  ...
  {
    "review_id": 1,
    "product_id": 1,
    "review_author": "Hans",
    "review_text": "Meh, it's okay.",
    "published_date": ISODate("2017-12-06")
  }
  ```

通过在集合中存储十个最近的评论，在对`product` 集合的调用中仅返回整体数据的所需子`product`集。如果用户想要查看其他评论，应用程序会调用该`review` 集合。

>[TIP]
>
>在考虑将数据拆分到哪里时，最常访问的数据部分应该放在应用程序最先加载的集合中。在此示例中，架构被拆分为 10 个评论，因为这是默认情况下在应用程序中可见的评论数。

>[TIP]
>
>也可以看看：
>
>要了解如何使用子集模式对集合之间的一对一关系建模，请参阅 [使用嵌入式文档建模一对一关系。](https://www.mongodb.com/docs/manual/tutorial/model-embedded-one-to-one-relationships-between-documents/#std-label-data-modeling-example-one-to-one)

**子集模式的权衡**

使用包含更频繁访问的数据的较小文档可以减少工作集的整体大小。这些较小的文档可以提高应用程序访问最频繁的数据的读取性能。

但是，子集模式会导致数据重复。在示例中，评论在`product`集合和 `reviews`集合中维护。必须采取额外的步骤来确保每个集合之间的评论是一致的。例如，当客户编辑他们的评论时，应用程序可能需要进行两次写操作：一次更新`product`集合，一次更新`reviews`集合。

您还必须在您的应用程序中实现逻辑，以确保`product`集合中的评论始终是该产品的十个最新评论。

**其他示例用例**

除了产品评论，子集模式也很适合存储：

- 对博客文章的评论，默认情况下您只想显示最新或评分最高的评论。
- 电影中的演员，默认情况下您只想显示扮演最大角色的演员。

 参见

原文 - [Model One-to-Many Relationships with Embedded Documents]( https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/ )

译者：景圣
