## 在单个字段上创建索引

您可以在单个字段上创建索引以提高对该字段的查询性能。

要创建单字段索引，请使用以下 [`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)方法：

```
db.<collection>.createIndex( { <field>: <sortOrder> } )
```

> 笔记:
>
> **索引排序顺序**
>
> 对于单字段索引，索引键的排序顺序（升序或降序）并不重要，因为 MongoDB 可以沿任一方向遍历索引。

### 在你开始之前

创建`students`包含以下文档的集合：

```
db.students.insertMany( [
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
] )
```

### 步骤

以下示例向您展示如何：

- [在单个字段上创建索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-single/create-single-field-index/#std-label-index-create-ascending-single-field)
- [在嵌入文档上创建索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-single/create-single-field-index/#std-label-index-embedded-documents)
- [在嵌入字段上创建索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-single/create-single-field-index/#std-label-index-embedded-fields)

#### 在单个字段上创建索引

假设有一位经常通过GPA来查找学生的学校管理人员。您可以在字段上创建索引 `gpa`以提高这些查询的性能：

```
db.students.createIndex( { gpa: 1 } )
```

#### 结果

该索引支持对字段进行选择的查询`gpa`，如下所示:

```
db.students.find( { gpa: 3.6 } )

db.students.find( { gpa: { $lt: 3.4 } } )
```

#### 在嵌入文档上创建索引

您可以对整个嵌入文档创建索引。

考虑一个社交网络应用程序，学生可以在其中按位置搜索彼此。学生位置存储在名为 的嵌入式文档中`location`。该`location`文档包含字段`city`和`state`。

您可以在字段上创建索引`location`以提高文档查询的性能`location`：

```
db.students.createIndex( { location: 1 } )
```

#### 结果

以下查询使用字段上的索引`location`：

```
db.students.find( { location: { city: "Sacramento", state: "California" } } )
```

> 重要的:
>
> 嵌套文档的字段顺序
>
> 当您基于嵌入文档进行查询时，指定字段的顺序很重要。查询中嵌入的文档和返回的文档必须完全匹配。要查看嵌入文档查询的更多示例，请参阅[嵌入/嵌套文档查询。](https://www.mongodb.com/docs/v7.0/tutorial/query-embedded-documents/#std-label-read-operations-subdocuments)

#### 细节

当您在嵌入文档上创建索引时，只有指定整个*嵌入*文档的查询才会使用该索引。对文档中特定字段的查询不使用索引。

例如，以下查询*不*使用字段上的索引 `location`，因为它们查询嵌入文档中的特定字段：

```
db.students.find( { "location.city": "Sacramento" } )

db.students.find( { "location.state": "New York" } )
```

为了让[点表示法](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-dot-notation)查询使用索引，您必须在正在查询的特定嵌入字段（而不是整个嵌入对象）上创建索引。有关示例，请参见 [在嵌入字段上创建索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-single/create-single-field-index/#std-label-index-embedded-fields)

#### 在嵌入字段上创建索引

您可以在嵌入文档中的字段上创建索引。嵌入字段上的索引可以满足使用[点表示法的查询。](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-dot-notation)

该`location`字段是一个嵌入文档，包含嵌入字段`city`和`state`。在字段上创建索引 `location.state`：

```
db.students.createIndex( { "location.state": 1 } )
```

#### 结果

索引支持对字段进行查询`location.state`，例如：

```
db.students.find( { "location.state": "California" } )

db.students.find( { "location.city": "Albany", "location.state": "New York" } )
```

### 了解更多

- [在数组中的嵌入字段上创建索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/create-multikey-index-embedded/#std-label-index-create-multikey-embedded)
- [检查查询是否使用索引](https://www.mongodb.com/docs/v7.0/tutorial/measure-index-use/#std-label-index-measure-index-use)
- [了解其他类型的索引类型](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/#std-label-index-types)
- [了解索引属性](https://www.mongodb.com/docs/v7.0/core/indexes/index-properties/#std-label-index-properties)

