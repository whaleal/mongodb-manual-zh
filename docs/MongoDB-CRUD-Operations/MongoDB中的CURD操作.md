# MongoDB中的CURD操作



> 本页面中
>
> - [创建操作](https://docs.mongodb.com/manual/crud/#create-operations)
> - [读操作](https://docs.mongodb.com/manual/crud/#read-operations)
> - [更新操作](https://docs.mongodb.com/manual/crud/#update-operations)
> - [删除操作](https://docs.mongodb.com/manual/crud/#delete-operations)
> - [批量写](https://docs.mongodb.com/manual/crud/#bulk-write)



CURD操作指的是文档的*创建*、*读*、*更新*以及*删除*操作。



## 创建操作

创建或者插入操作将新的文档添加到一个集合中。如果集合当前并不存在，插入操作会创建该集合。

MongoDB提供了以下两个方法来向集合中插入文档：

- [`db.collection.insertOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/#db.collection.insertOne) *3.2版本引入*
- [`db.collection.insertMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#db.collection.insertMany) *3.2版本引入*

在MongoDB中，插入操作只针对单个集合。MongoDB中的所有写操作都是单个文档级别的原子操作。

![The components of a MongoDB insertOne operations.](https://docs.mongodb.com/manual/_images/crud-annotated-mongodb-insertOne.bakedsvg.svg)

关于示例，请参考[插入文档](https://docs.mongodb.com/manual/tutorial/insert-documents/)。



## 读操作

读操作从一个集合中检索文档；即查询集合中的文档。MongoDB提供了以下方法来从集合中读取文档：

- [`db.collection.find()`](https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find)

你可以[指定查询过滤器](https://docs.mongodb.com/manual/tutorial/query-documents/#read-operations-query-argument)或条件来标识要返回的文档

![The components of a MongoDB find operation.](https://docs.mongodb.com/manual/_images/crud-annotated-mongodb-find.bakedsvg.svg)

更多示例，请参考：

- [查询文档](https://docs.mongodb.com/manual/tutorial/query-documents/)
- [查询嵌入式文档](https://docs.mongodb.com/manual/tutorial/query-embedded-documents/)
- [查询数据](https://docs.mongodb.com/manual/tutorial/query-arrays/)
- [查询嵌入式文档的数组](https://docs.mongodb.com/manual/tutorial/query-array-of-documents/)



## 更新操作

更新操作修改一个集合中已存在的文档。MongoDB提供了以下方法来更新一个集合中的文档：

- [`db.collection.updateOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#db.collection.updateOne) *3.2版本引入*
- [`db.collection.updateMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#db.collection.updateMany) *3.2版本引入*
- [`db.collection.replaceOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.replaceOne/#db.collection.replaceOne) *3.2版本引入*

在MongoDB中，更新操作只针对单个集合。MongoDB中的所有写操作都是单个文档级别的原子操作。

你可以指定查询过滤器或条件来标识要更新的文档，这里的 [过滤器](https://docs.mongodb.com/manual/core/document/#document-query-filter)和读操作的语法是一致的。

![The components of a MongoDB updateMany operation.](https://docs.mongodb.com/manual/_images/crud-annotated-mongodb-updateMany.bakedsvg.svg)

关于示例，请参考[更新文档](https://docs.mongodb.com/manual/tutorial/update-documents/)。



## 删除操作

删除操作从一个集合中删除文档。MongoDB提供了以下方法来从一个集合中删除文档：

- [`db.collection.deleteOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.deleteOne/#db.collection.deleteOne) *3.2版本引入*
- [`db.collection.deleteMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.deleteMany/#db.collection.deleteMany)  *3.2版本引入*

在MongoDB中，删除操作只针对单个[集合](https://docs.mongodb.com/manual/reference/glossary/#term-collection)。MongoDB中的所有写操作都是单个文档级别的[原子](https://docs.mongodb.com/manual/core/write-operations-atomicity/) 操作。

你可以指定查询过滤器或条件来标识要更新的文档，这里的[过滤器](https://docs.mongodb.com/manual/core/document/#document-query-filter)和读操作的语法是一致的。

![The components of a MongoDB deleteMany operation.](https://docs.mongodb.com/manual/_images/crud-annotated-mongodb-deleteMany.bakedsvg.svg)

For examples, see [Delete Documents](https://docs.mongodb.com/manual/tutorial/remove-documents/).<br>关于示例，请参考[删除文档](https://docs.mongodb.com/manual/tutorial/remove-documents/)。



## 批量写

MongoDB提供了批量执行写操作的能力。更多细节请参考[批量写操作](https://docs.mongodb.com/manual/core/bulk-write-operations/)。



译者：刘翔

校对：徐雷