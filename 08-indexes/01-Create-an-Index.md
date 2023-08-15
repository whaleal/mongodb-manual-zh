## 创建索引

索引支持 MongoDB 中查询的高效执行。如果您的应用程序在相同字段上重复运行查询，您可以在这些字段上创建索引以提高这些查询的性能。

要创建索引，请使用[`createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)shell 方法或驱动程序的等效方法。此页面显示 MongoDB Shell 和驱动程序的示例。

### 关于此任务

当您在 MongoDB Shell 或驱动程序中运行创建索引命令时，MongoDB 仅在不存在相同规格的索引时创建索引。

虽然索引可以提高查询性能，但添加索引会对写入操作的性能产生负面影响。对于具有高写入读取比率的集合，索引的成本很高，因为每次插入和更新也必须更新任何索引。

### 步骤

创建索引[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), 使用 [`db.collection.createIndex()`.](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)

```
db.collection.createIndex( <key and index type specification>, <options> )
```

### 例子

此示例在字段上创建一个单键降序索引 `name`：

```
db.collection.createIndex( { name: -1 } )
```

> 笔记:
>
> **索引排序顺序**
>
> 对于单字段索引，索引键的排序顺序（升序或降序）并不重要，因为 MongoDB 可以沿任一方向遍历索引。

### 结果

要确认索引已创建，请使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)运行该 [`db.collection.getIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)方法：

```
db.collection.getIndexes()
```

输出：

```
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { name: -1 }, name: 'name_-1' }
]
```

要查看有关使用驱动程序创建的索引的信息，请参阅 [驱动程序文档](https://www.mongodb.com/docs/drivers/)

### 了解更多

- 要了解如何在MongoDB Compass中创建索引，请参阅[管理索引](https://www.mongodb.com/docs/compass/current/indexes/#std-label-compass-indexes)在指南针文档中。
- 要查看索引的使用频率，请参阅 [衡量索引使用情况。](https://www.mongodb.com/docs/v7.0/tutorial/measure-index-use/#std-label-index-measure-index-use)
- 要了解如何指定索引名称，请参阅[指定索引名称。](https://www.mongodb.com/docs/v7.0/core/indexes/create-index/specify-index-name/#std-label-specify-index-name)
- 要了解 MongoDB 如何构建索引，请参阅[索引构建流程。](https://www.mongodb.com/docs/v7.0/core/index-creation/#std-label-index-build-process)

