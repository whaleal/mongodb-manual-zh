# 更新文件

MongoDB shell 提供了以下方法来更新集合中的文档：

- 要更新单个文档，请使用 [`db.collection.updateOne()`.](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne)
- 要更新多个文档，请使用 [`db.collection.updateMany()`.](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany)
- 要替换文档，请使用 [`db.collection.replaceOne()`.](https://www.mongodb.com/docs/manual/reference/method/db.collection.replaceOne/#mongodb-method-db.collection.replaceOne)

此页面上的示例参考了Atlas [样本数据集](https://www.mongodb.com/docs/atlas/sample-data/). 您可以创建一个免费的Atlas 集群并使用示例数据填充该集群以跟随这些示例。要了解更多信息，请参阅 [开始使用Atlas。](https://www.mongodb.com/docs/atlas/getting-started/)

## 更新运算符语法

要更新文档，MongoDB 提供 [update operators](https://www.mongodb.com/docs/manual/reference/operator/update/)， 例如[`$set`](https://www.mongodb.com/docs/manual/reference/operator/update/set/#mongodb-update-up.-set), 修改字段值。

要使用更新运算符，请将以下形式的更新文档传递给更新方法：

```shell
{
  <update operator>: { <field1>: <value1>, ... },
  <update operator>: { <field2>: <value2>, ... },
  ...
}
```

一些更新操作符，例如[`$set`](https://www.mongodb.com/docs/manual/reference/operator/update/set/#mongodb-update-up.-set), 如果该字段不存在则创建该字段。看个人 [更新操作员](https://www.mongodb.com/docs/manual/reference/operator/update/)详情参考。

## 更新单个文档

使用[`db.collection.updateOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne)更新*第一个* 与指定过滤器匹配的文档的方法。

> 笔记:
>
> MongoDB 保留文档的自然排序顺序。此排序是一项内部实现功能，您不应依赖其中的任何特定结构。要了解更多信息，请参阅 [natural order。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-natural-order)

>例子:
>
>要更新集合中的*第一个*文档`sample_mflix.movies` ，其中`title`equals `"Tag"`：
>
>```shell
>use sample_mflix
>
>db.movies.updateOne( { title: "Tag" },
>{
>  $set: {
>    plot: "One month every year, five highly competitive friends
>           hit the ground running for a no-holds-barred game of tag"
>  }
>  { $currentDate: { lastUpdated: true } }
>})
>```
>
>更新操作：
>
>- 使用[`$set`](https://www.mongodb.com/docs/manual/reference/operator/update/set/#mongodb-update-up.-set)运算符更新 `plot`电影字段的值`Tag`。
>- 使用[`$currentDate`](https://www.mongodb.com/docs/manual/reference/operator/update/currentDate/#mongodb-update-up.-currentDate)运算符将字段的值更新`lastUpdated`为当前日期。如果 `lastUpdated`字段不存在， [`$currentDate`](https://www.mongodb.com/docs/manual/reference/operator/update/currentDate/#mongodb-update-up.-currentDate)将创建字段。看 [`$currentDate`](https://www.mongodb.com/docs/manual/reference/operator/update/currentDate/#mongodb-update-up.-currentDate)了解详情。

## 更新多个文档

使用[`db.collection.updateMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany)更新与指定过滤器匹配的所有文档。

>例子:
>
>要更新`sample_airbnb.listingsAndReviews` 集合中的所有文档以更新`security_deposit`小于的位置`100`：
>
>```
>use sample_airbnb
>
>db.listingsAndReviews.updateMany(
>  { security_deposit: { $lt: 100 } },
>  {
>    $set: { security_deposit: 100, minimum_nights: 1 }
>  }
>)
>```
>
>更新操作使用[`$set`](https://www.mongodb.com/docs/manual/reference/operator/update/set/#mongodb-update-up.-set)运算符将字段的值更新`security_deposit`为`100`并将字段的值更新`minimum_nights`为`1`.

## 替换文档

要替换除字段之外的文档的全部内容`_id` ，将一个全新的文档作为第二个参数传递给 [`db.collection.replaceOne()`.](https://www.mongodb.com/docs/manual/reference/method/db.collection.replaceOne/#mongodb-method-db.collection.replaceOne)

替换文档时，替换文档必须仅包含字段/值对。不包括[update operators](https://www.mongodb.com/docs/manual/reference/operator/update/)表达式。

替换文档可以具有与原始文档不同的字段。在替换文档中，您可以省略该`_id`字段，因为该`_id`字段是不可变的；但是，如果确实包含该 `_id`字段，则它的值必须与当前值相同。

>例子:
>
>要替换集合中的*第一个*文档， `sample_analytics.accounts`其中 `account_id: 371138`：
>
>```shell
>db.accounts.replaceOne(
>  { account_id: 371138 },
>  { account_id: 893421, limit: 5000, products: [ "Investment", "Brokerage" ] }
>)
>```
>
>运行以下命令以阅读更新后的文档：
>
>```
>db.accounts.findOne( { account_id: 893421 } )
>```

## 更新行为

要了解有关更新文档的特定行为的更多信息，请参阅[行为。](https://www.mongodb.com/docs/manual/tutorial/update-documents/#behavior)

## 了解更多

- 要了解如何使用聚合管道更新文档，请参阅 [使用聚合管道进行更新。](https://www.mongodb.com/docs/manual/tutorial/update-documents-with-aggregation-pipeline/)
- 要查看更新文档的所有可用方法，请参阅 [更新方法。](https://www.mongodb.com/docs/manual/reference/update-methods/)





翻译：韩鹏帅

原文：[Update Documents](https://www.mongodb.com/docs/mongodb-shell/crud/update/)