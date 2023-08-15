## 在数组字段上创建索引

您可以在包含数组值的字段上创建索引，以提高对该字段的查询性能。当您在包含数组值的字段上创建索引时，MongoDB 将该索引存储为多键索引。

要创建索引，请使用该[`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) 方法。您的操作应该类似于此原型：

```
db.<collection>.createIndex( { <field>: <sortOrder> } )
```

### 关于此任务

本页上的示例使用`students`包含以下文档的集合：

```
db.students.insertMany( [
   {
      "name": "Andre Robinson",
      "test_scores": [ 88, 97 ]
   },
   {
      "name": "Wei Zhang",
      "test_scores": [ 62, 73 ]
   },
   {
      "name": "Jacob Meyer",
      "test_scores": [ 92, 89 ]
   }
] )
```

您定期运行一个查询，返回至少大于 1 的 `test_score`学生`90`。您可以在字段上创建索引 `test_scores`以提高此查询的性能。

### 步骤

以下操作在 集合`test_scores`的字段上创建升序多键索引`students`：

```
db.students.createIndex( { test_scores: 1 } )
```

由于`test_scores`包含数组值，MongoDB 将此索引存储为多键索引。

### 结果

该索引包含字段中出现的每个单独值的键 `test_scores`。索引是升序的，这意味着键按以下顺序存储：`[ 62, 73, 88, 89, 92, 97 ]`。

索引支持对字段进行选择的查询`test_scores`。例如，以下查询返回数组中至少有一个元素`test_scores`大于 90 的文档：

```
db.students.find(
   {
      test_scores: { $elemMatch: { $gt: 90 } }
   }
)
```

输出:

```
[
   {
      _id: ObjectId("632240a20646eaee87a56a80"),
      name: 'Andre Robinson',
      test_scores: [ 88, 97 ]
   },
   {
      _id: ObjectId("632240a20646eaee87a56a82"),
      name: 'Jacob Meyer',
      test_scores: [ 92, 89 ]
   }
]
```

### 了解更多

- 要了解如何在嵌入文档字段上创建多键索引，请参阅[在数组中的嵌入字段上创建索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/create-multikey-index-embedded/#std-label-index-create-multikey-embedded)
- 要了解多键索引边界，请参阅 [多键索引边界。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/multikey-index-bounds/#std-label-indexes-multikey-bounds)