# 删除文件

MongoDB shell 提供了以下方法来从集合中删除文档：

- 要删除多个文档，请使用 [`db.collection.deleteMany()`.](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/#mongodb-method-db.collection.deleteMany)
- 要删除单个文档，请使用[`db.collection.deleteOne()`.](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/#mongodb-method-db.collection.deleteOne)

此页面上的示例参考了Atlas [样本数据集](https://www.mongodb.com/docs/atlas/sample-data/). 您可以创建一个免费的Atlas 集群并使用示例数据填充该集群以跟随这些示例。要了解更多信息，请参阅 [开始使用Atlas。](https://www.mongodb.com/docs/atlas/getting-started/)

## 删除所有文件

要从集合中删除所有文档，传递一个空的 [筛选](https://www.mongodb.com/docs/manual/core/document/#std-label-document-query-filter)文档`{}`到 [`db.collection.deleteMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/#mongodb-method-db.collection.deleteMany)方法。

>例子:
>
>要从集合中删除所有文档`sample_mflix.movies`：
>
>```
>use sample_mflix
>
>db.movies.deleteMany({})
>```
>
>该方法返回一个包含操作状态的文档。有关详细信息和示例，请参阅 [`deleteMany()`.](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/#mongodb-method-db.collection.deleteMany)

## 删除符合条件的所有文档

您可以指定用于标识要删除的文档的条件或过滤器。这[过滤器](https://www.mongodb.com/docs/manual/core/document/#std-label-document-query-filter)使用与读取操作相同的语法。

要指定相等条件，请`<field>:<value>`在查询过滤器文档中使用表达式。

要删除所有符合删除条件的文档，请将过滤器参数传递给[`deleteMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/#mongodb-method-db.collection.deleteMany)方法。

>例子:
>
>`sample_mflix.movies`从集合中删除`title`equals 的所有文档`"Titanic"`：
>
>```
>use sample_mflix
>
>db.movies.deleteMany( { title: "Titanic" } )
>```
>
>该方法返回一个包含操作状态的文档。有关详细信息和示例，请参阅 [`deleteMany()`.](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/#mongodb-method-db.collection.deleteMany)

## 只删除一个符合条件的文档

要最多删除一个与指定过滤器匹配的文档（即使多个文档可能与指定过滤器匹配）使用 [`db.collection.deleteOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/#mongodb-method-db.collection.deleteOne)方法。

>例子:
>
>要从数组包含的 集合中删除*第一个*文档：`sample_mflix.movies``cast``"Brad Pitt"`
>
>```
>use sample_mflix
>
>db.movies.deleteOne( { cast: "Brad Pitt" } )
>```
>
>>笔记:
>>
>>MongoDB 保留文档的自然排序顺序。此排序是一项内部实现功能，您不应依赖其中的任何特定结构。要了解更多信息，请参阅 [自然秩序。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-natural-order)

## 删除行为

要了解有关删除文档的具体行为的更多信息，请参阅[行为。](https://www.mongodb.com/docs/manual/tutorial/remove-documents/#delete-behavior)

## 了解更多

- 要查看删除文档的其他示例，请参阅以下方法页面：
  - [`db.collection.deleteMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/#mongodb-method-db.collection.deleteMany)
  - [`db.collection.deleteOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/#mongodb-method-db.collection.deleteOne)
- 要查看删除文档的所有可用方法，请参阅 [删除方法。](https://www.mongodb.com/docs/manual/reference/delete-methods/)





翻译：韩鹏帅

原文：[Delete Documents](https://www.mongodb.com/docs/mongodb-shell/crud/delete/)



