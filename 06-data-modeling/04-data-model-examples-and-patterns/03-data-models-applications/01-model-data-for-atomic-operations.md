**原子操作的模型数据**

尽管 MongoDB 支持副本集（从 4.0 版开始）和分片集群（从 4.2 版开始）的[多文档事务](https://www.mongodb.com/docs/manual/core/transactions/)，但对于许多场景，如本页所讨论的非规范化数据模型将继续对您的数据和用例。

**模式**

在 MongoDB 中，对单个文档的写操作是原子的。对于必须一起更新的字段，将字段嵌入同一文档中可确保可以自动更新字段。

例如，考虑这样一种情况，您需要维护书籍信息，包括可供结账的份数以及当前的结账信息。

图书的可用副本和结帐信息应同步。因此，将`available`field 和 `checkout`field 嵌入同一文档可确保您可以自动更新这两个字段。

```json
{
    _id: 123456789,
    title: "MongoDB: The Definitive Guide",
    author: [ "Kristina Chodorow", "Mike Dirolf" ],
    published_date: ISODate("2010-09-24"),
    pages: 216,
    language: "English",
    publisher_id: "oreilly",
    available: 3,
    checkout: [ { by: "joe", date: ISODate("2012-10-15") } ]
}
```

然后更新新的结帐信息，您可以使用该 [`db.collection.updateOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne)方法自动更新`available`字段和`checkout`字段：

```json
db.books.updateOne (
   { _id: 123456789, available: { $gt: 0 } },
   {
     $inc: { available: -1 },
     $push: { checkout: { by: "abc", date: new Date() } }
   }
)
```

该操作返回一个文档，其中包含有关操作状态的信息：

```json
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }
```

该`matchedCount`字段显示`1`文档符合更新条件，并`modifiedCount`显示操作更新了`1` 文档。

如果没有文档符合更新条件，则`matchedCount`和 `modifiedCount`将`0`和 表示您无法借出该书。

 参见

原文 - [Model Data for Atomic Operations]( https://docs.mongodb.com/manual/tutorial/model-data-for-atomic-operations/ )

译者：景圣
