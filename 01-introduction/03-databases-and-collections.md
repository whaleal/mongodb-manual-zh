#  数据库和集合

在本页面

- 总览

- [数据库](https://docs.mongodb.com/v4.2/core/databases-and-collections/databases)
- [集合](https://docs.mongodb.com/v4.2/core/databases-and-collections/collections)



## 总览

MongoDB 将数据记录存储为[文档](https://www.mongodb.com/docs/v6.0/reference/glossary/#std-term-document) （特别是[BSON 文档](https://www.mongodb.com/docs/v6.0/core/document/#std-label-bson-document-format)）这些文档在[集合](https://www.mongodb.com/docs/v6.0/reference/glossary/#std-term-collection)中聚集在一起。[数据库](https://www.mongodb.com/docs/v6.0/reference/glossary/#std-term-database)存储一个或多个文档集合。

## 数据库

在 MongoDB 中，数据库包含一个或多个文档集合。要选择使用的数据库，请在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), 发出 `use <db>`语句，如以下示例所示：

```
use myDB
```

### 创建一个数据库

如果数据库不存在，MongoDB会在您第一次为该数据库存储数据时创建该数据库。 因此，可以在`mongosh`中切换到一个不存在的数据库:

```javascript
use myNewDB
db.myNewCollection1.insertOne( { x: 1 } )
```

`insertOne()`操作在数据库中创建`myNewDB`和`myNewCollection1`集合如果它们不存在。 确保数据库和集合名称都遵循MongoDB[命名限制](https://www.mongodb.com/docs/v6.0/reference/limits/#std-label-restrictions-on-db-names)。



## 集合

MongoDB以集合的形式存储文档。集合类似于关系数据库中的表。



![A collection of MongoDB documents.](https://docs.mongodb.com/v4.2/_images/crud-annotated-collection.bakedsvg.svg)

### 创建集合

如果集合不存在，`MongoDB`会在首次为该集合存储数据时创建该集合。

```javascript
db.myNewCollection2.insertOne( { x: 1 } )
db.myNewCollection3.createIndex( { y: 1 } )
```

如果不存在该集合，则[`insertOne()`](https://www.mongodb.com/docs/v6.0/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)和[`createIndex()`](https://www.mongodb.com/docs/v6.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) 操作都会创建它们各自的集合。确保集合名称遵循 MongoDB的命名规则（ [Naming Restrictions ](https://www.mongodb.com/docs/v6.0/reference/limits/#std-label-restrictions-on-db-names)）



### 显式创建

 MongoDB提供了[`db.createCollection()`](https://www.mongodb.com/docs/v6.0/reference/method/db.createCollection/#mongodb-method-db.createCollection) 方法来显式地创建一个包含各种选项的集合，例如设置最大空间或文档验证规则。 如果你没有指定这些选项，你不需要显式地创建集合，因为MongoDB会在你第一次为集合存储数据时创建新的集合。

 要修改这些集合的选项，参见[`collMod`.](https://www.mongodb.com/docs/v6.0/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)。



### 文档验证

 默认情况下，集合不要求其文档具有相同的模式，也就是说，单个集合中的文档不需要具有相同的字段集，并且集合中的各个文档中的字段的数据类型可能不同。

但是，从 MongoDB 3.2 开始，可以在更新和插入操作期间为集合强制执行[文档验证规则。](https://www.mongodb.com/docs/v6.0/core/schema-validation/)有关详细信息，请参阅[模式验证](https://www.mongodb.com/docs/v6.0/core/schema-validation/)。



### 修改文档结构

若要更改集合中文档的结构，如添加新字段、删除现有字段或将字段值更改为新类型，请将文档更新为新结构。



### 唯一标识符

集合被分配一个不可变的UUID。集合UUID在复制集的所有成员和分片集群中的分片中保持相同。

 要检索集合的UUID，请运行[`listCollections`](https://www.mongodb.com/docs/manual/reference/command/listCollections/) 命令或[`db.getCollectionInfos()`](https://www.mongodb.com/docs/v6.0/reference/method/db.getCollectionInfos/#mongodb-method-db.getCollectionInfos)方法。

 

原文链接：https://www.mongodb.com/docs/v6.0/core/databases-and-collections/

译者：杨帅

