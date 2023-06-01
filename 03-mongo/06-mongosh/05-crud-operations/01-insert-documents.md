# 插入文档

MongoDB shell 提供了以下方法来将文档插入到集合中：

- 要插入单个文档，请使用[`db.collection.insertOne()`.](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)
- 要插入多个文档，请使用 [`db.collection.insertMany()`.](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany)

此页面上的示例参考了Atlas [样本数据集](https://www.mongodb.com/docs/atlas/sample-data/). 您可以创建一个免费的Atlas 集群并使用示例数据填充该集群以跟随这些示例。要了解更多信息，请参阅 [开始使用Atlas。](https://www.mongodb.com/docs/atlas/getting-started/)

## 插入单个文档

[`db.collection.insertOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)插入*一个* [文档](https://www.mongodb.com/docs/manual/core/document/#std-label-bson-document-format)成一个集合。如果文档没有指定`_id`字段，MongoDB 会将`_id`带有 ObjectId 值的字段添加到新文档中。看 [插入行为。](https://www.mongodb.com/docs/manual/tutorial/insert-documents/#std-label-write-op-insert-behavior)

>例子:
>
>要将新文档插入集合`sample_mflix.movies`：
>
>```shell
>use sample_mflix
>
>db.movies.insertOne(
>  {
>    title: "The Favourite",
>    genres: [ "Drama", "History" ],
>    runtime: 121,
>    rated: "R",
>    year: 2018,
>    directors: [ "Yorgos Lanthimos" ],
>    cast: [ "Olivia Colman", "Emma Stone", "Rachel Weisz" ],
>    type: "movie"
>  }
>)
>```
>
>[`insertOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)返回包含新插入文档字段值的文档`_id`。
>
>要检索插入的文档， [请阅读集合：](https://www.mongodb.com/docs/mongodb-shell/crud/read/#std-label-mongosh-read)
>
>```
>db.movies.find( { title: "The Favourite" } )
>```
>
>为确保返回插入的文档，您可以改为通过查询`_id`。

## 插入多个文档

[`db.collection.insertMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany)可以插入*多个* [文件](https://www.mongodb.com/docs/manual/core/document/#std-label-bson-document-format)成一个集合。将文档数组传递给该方法。如果文档没有指定`_id` 字段，MongoDB 会`_id`为每个文档添加带有 ObjectId 值的字段。看[插入行为。](https://www.mongodb.com/docs/manual/tutorial/insert-documents/#std-label-write-op-insert-behavior)

> 例子:
>
> 向集合中插入两个新文档`sample_mflix.movies` ：
>
> ```shell
> use sample_mflix
> 
> db.movies.insertMany([
>    {
>       title: "Jurassic World: Fallen Kingdom",
>       genres: [ "Action", "Sci-Fi" ],
>       runtime: 130,
>       rated: "PG-13",
>       year: 2018,
>       directors: [ "J. A. Bayona" ],
>       cast: [ "Chris Pratt", "Bryce Dallas Howard", "Rafe Spall" ],
>       type: "movie"
>     },
>     {
>       title: "Tag",
>       genres: [ "Comedy", "Action" ],
>       runtime: 105,
>       rated: "R",
>       year: 2018,
>       directors: [ "Jeff Tomsic" ],
>       cast: [ "Annabelle Wallis", "Jeremy Renner", "Jon Hamm" ],
>       type: "movie"
>     }
> ])
> ```
>
> [`insertMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany)返回包含新插入文档字段值的文档`_id`。
>
> 要[阅读集合中的文档：](https://www.mongodb.com/docs/mongodb-shell/crud/read/#std-label-mongosh-read)
>
> ```
> db.movies.find( {} )
> ```

## 插入行为

要了解有关插入文档的特定行为的更多信息，请参阅[插入行为。](https://www.mongodb.com/docs/manual/tutorial/insert-documents/#std-label-write-op-insert-behavior)

## 了解更多

- 要查看更多将文档插入集合的示例，请参阅[`insertOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)和 [`db.collection.insertMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany)方法页面。
- 要查看将文档插入集合的所有可用方法，请参阅[插入的其他方法](https://www.mongodb.com/docs/manual/reference/insert-methods/#additional-inserts)



翻译：韩鹏帅

原文：[Insert Documents](https://www.mongodb.com/docs/mongodb-shell/crud/insert/)
