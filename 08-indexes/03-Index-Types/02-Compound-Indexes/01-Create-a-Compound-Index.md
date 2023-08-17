### 创建复合索引

**复合索引**是包含对多个字段的引用的索引。复合索引提高了对索引中的字段或[索引前缀中的字段进行查询的性能。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-compound-index-prefix)

要创建复合索引，请使用以下 [`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)方法：

```
db.<collection>.createIndex( {
   <field1>: <sortOrder>,
   <field2>: <sortOrder>,
   ...
   <fieldN>: <sortOrder>
} )
```

### 限制

单个复合索引中最多可以指定 32 个字段。

### 在你开始之前

创建一个`students`包含这些文档的集合：

```
db.students.insertMany([
   {
      "name": "Alice",
      "gpa": 3.6,
      "location": { city: "Sacramento", state: "California" }
   },
   {
      "name": "Bob",
      "gpa": 3.2,
      "location": { city: "Albany", state: "New York" }
   }
])
```

### 步骤

`name` 以下操作创建包含和字段的复合索引`gpa`：

```
db.students.createIndex( {
   name: 1,
   gpa: -1
} )
```

在这个例子中：

- 上的索引`name`为升序 ( `1`)。
- 上的索引`gpa`是降序的 ( `-1`)。

### 结果

创建的索引支持选择以下项的查询：

- 两者`name`和`gpa`领域。
- 只有`name`字段，因为`name`是复合索引的[前缀。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-compound-index-prefix)

例如，索引支持以下查询：

```
db.students.find( { name: "Alice", gpa: 3.6 } )

db.students.find( { name: "Bob" } )
```

该索引**不**支持仅对`gpa`字段进行查询，因为`gpa`该字段不是索引前缀的一部分。例如，索引不支持以下查询：

```
db.students.find( { gpa: { $gt: 3.5 } } )
```

### 了解更多

- 要了解如何创建高效的复合索引，请参阅 [ESR（相等、排序、范围）规则。](https://www.mongodb.com/docs/v7.0/tutorial/equality-sort-range-rule/#std-label-esr-indexing-rule)
- 要了解排序顺序（升序或降序）如何影响复合索引的性能，请参阅[使用索引对查询结果进行排序。](https://www.mongodb.com/docs/v7.0/tutorial/sort-results-with-indexes/#std-label-sorting-with-indexes)
- 要了解其他索引类型，请参阅[索引类型。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/#std-label-index-types)
- 要了解可以为索引指定哪些属性，请参阅 [索引属性。](https://www.mongodb.com/docs/v7.0/core/indexes/index-properties/#std-label-index-properties)