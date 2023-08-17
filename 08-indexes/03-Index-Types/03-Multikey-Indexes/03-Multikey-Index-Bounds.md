## 多键索引范围

**索引边界**定义了 MongoDB 在使用索引完成查询时搜索的索引值的范围。当您在索引字段上指定多个查询谓词时，MongoDB 会尝试组合这些谓词的边界以生成具有较小边界的索引扫描。较小的索引范围可以加快查询速度并减少资源使用。

MongoDB 结合了任一边界[相交](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/multikey-index-bounds/#std-label-multikey-index-bounds-intersecting)或者[复利](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/multikey-index-bounds/#std-label-multikey-index-bounds-compound)界限。

### 多键索引的边界交集

边界交集是指多个边界重叠的点。例如，给定边界`[ [ 3, Infinity ] ]`和`[ [ -Infinity, 6 ] ]`，边界的交集结果为`[ [ 3, 6 ] ]`。

给定一个索引数组字段，考虑一个在数组上指定多个查询谓词并使用[多键索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/#std-label-index-type-multikey)来完成查询的查询。如果[`$elemMatch`](https://www.mongodb.com/docs/v7.0/reference/operator/query/elemMatch/#mongodb-query-op.-elemMatch)运算符连接查询谓词，MongoDB 可以与多键索引边界相交。

#### 例子：边界交叉

以下示例展示了 MongoDB 如何使用边界交集来定义要查询的较小范围的值，从而提高查询性能。

1. 填充样本集合

   创建一个`students`包含带有字段`name`和数组字段的文档的集合`grades`：

   ```
   db.students.insertMany(
      [
         { _id: 1, name: "Shawn", grades: [ 70, 85 ] },
         { _id: 2, item: "Elena", grades: [ 92, 84 ] }
      ]
   )
   ```

2. 创建多键索引

   在数组上创建[多键索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/#std-label-index-type-multikey)`grades` ：

   ```
   db.students.createIndex( { grades: 1 } )
   ```

3. 查询集合

   运行以下查询：

   ```
   db.students.find( { grades : { $elemMatch: { $gte: 90, $lte: 99 } } } )
   ```

   前面的查询用于`$elemMatch`返回数组中`grades`至少包含一个 与*两个*指定条件都匹配的元素的文档。

   单独采用查询谓词：

   * 大于或等于 90 谓词 ( `$gte: 90`) 的界限是`[ [ 90, Infinity ] ]`。
   * 小于或等于 99 谓词 ( `$lte: 99`) 的界限是`[ [ -Infinity, 99 ] ]`。

   因为查询用于`$elemMatch`连接这些谓词，所以 MongoDB 与边界相交：

   ```
   ratings: [ [ 90, 99 ] ]
   ```

#### 没有 $elemMatch 的查询

如果查询未使用 联接数组字段上的条件 `$elemMatch`，MongoDB 无法与多键索引边界相交。

考虑这个查询：

```
db.students.find( { grades: { $gte: 90, $lte: 99 } } )
```

该查询`grades`在数组中搜索：

* 至少有一个元素大于或等于`90`
* 至少有一个元素小于或等于`99`

同一元素可以满足这两个标准。

因为前面的查询没有使用`$elemMatch`，所以 MongoDB 不会与边界相交。相反，MongoDB 使用以下任一边界：

- `[ [ 90, Infinity ] ]`
- `[ [ -Infinity, 99 ] ]`

MongoDB 不保证它选择这两个边界中的哪一个。

### 多键索引的复合界限

[复合边界组合了复合索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound)的多个键的边界。使用多个键的边界可以减少处理查询所需的时间，因为 MongoDB 不需要单独计算每个边界的结果。

例如，考虑`{ temperature: 1, humidity: 1 }`具有以下边界的复合索引：

- `temperature`有一个界限`[ [ 80, Infinity ] ]`.
- `humidity`有一个界限`[ [ -Infinity, 20 ] ]`.

复合边界会导致使用两个边界：

```
{ temperature: [ [ 80, Infinity ] ], humidity: [ [ -Infinity, 20 ] ] }
```

如果 MongoDB 无法复合这两个边界，MongoDB 将通过前导字段上的边界来约束索引扫描。在此示例中，前导字段为`temperature`，导致约束为`temperature: [ [ 80, Infinity ] ]`。

### 示例：非数组字段和数组字段的复合边界

以下示例展示了 MongoDB 如何使用复合边界来定义更高效的查询约束，从而提高查询性能

1. 填充样本集合

   创建一个`survey`包含带有字段 `item`和数组字段的文档的集合`ratings`：

   ```
   db.survey.insertMany(
      [
         { _id: 1, item: "ABC", ratings: [ 2, 9 ] },
         { _id: 2, item: "XYZ", ratings: [ 4, 3 ] }
      ]
   )
   ```

2. 创建复合多键索引

   在 和字段上创建[复合多键索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound)：`item``ratings`

   ```
   db.survey.createIndex( { item: 1, ratings: 1 } )
   ```

3. 查询集合

   运行以下查询：

   ```
   db.survey.find( { item: "XYZ", ratings: { $gte: 3 } } )
   ```

   前面的查询在索引的两个键（`item`和`ratings`）上指定了条件。

   分别采用谓词：

   - 谓词的界限`item: "XYZ"`是 `[ [ "XYZ", "XYZ" ]]`。
   - 谓词的界限`ratings: { $gte: 3 }`是 `[ [ 3, Infinity ] ]`。

   MongoDB 使用以下组合边界：

   ```
   { item: [ [ "XYZ", "XYZ" ] ], ratings: [ [ 3, Infinity ] ] }
   ```

#### 示例：非数组字段和多个数组字段的复合边界

以下示例展示了当索引包含非数组字段和多个数组字段时 MongoDB 如何使用复合边界。

1. 填充样本集合

   创建一个`survey2`包含带有字符串字段`item`和数组字段的文档的集合`ratings`：

   ```
   db.survey2.insertMany( [
      {
         _id: 1,
         item: "ABC",
         ratings: [ { score: 2, by: "mn" }, { score: 9, by: "anon" } ]
      },
      {
         _id: 2,
         item: "XYZ",
         ratings: [ { score: 5, by: "anon" }, { score: 7, by: "wv" } ]
      }
   ] )
   ```

2. 创建复合多键索引

   在以下字段上创建复合索引：

   - `item`（非数组）
   - `ratings.score`（大批）
   - `ratings.by`（大批）

   ```
   db.survey2.createIndex(
      {
         "item": 1,
         "ratings.score": 1,
         "ratings.by": 1
      }
   )
   ```

3. 查询集合

   运行以下查询：

   ```
   db.survey2.find(
      {
         item: "XYZ",
         "ratings.score": { $lte: 5 },
         "ratings.by": "anon"
      }
   )
   ```

   分别采用谓词：

   - 谓词的界限`item: "XYZ"`是 `[ [ "XYZ", "XYZ" ] ]`。
   - 谓词的界限`score: { $lte: 5 }`是 `[ [ -Infinity, 5] ]`。
   - 谓词的界限`by: "anon"`是 `[ "anon", "anon" ]`。

   MongoDB 将键的边界`item`与 for 的边界`"ratings.score"`或 的边界混合`"ratings.by"`，具体取决于查询谓词和索引键值。MongoDB 不保证它与字段复合的边界`item`。

   MongoDB 通过以下方式之一完成查询：

   * MongoDB 将`item`边界与`"ratings.score"` 边界复合：

     ```
     {
        "item" : [ [ "XYZ", "XYZ" ] ],
        "ratings.score" : [ [ -Infinity, 5 ] ],
        "ratings.by" : [ [ MinKey, MaxKey ] ]
     }
     ```

   * MongoDB 将`item`边界与`"ratings.by"` 边界复合：

     ```
     {
        "item" : [ [ "XYZ", "XYZ" ] ],
        "ratings.score" : [ [ MinKey, MaxKey ] ],
        "ratings.by" : [ [ "anon", "anon" ] ]
     }
     ```

   要将 for 的边界`"ratings.score"`与 for 的边界 复合`"ratings.by"`，查询必须使用`$elemMatch`。

### 同一数组中多个字段的复合边界

要复合同一数组中索引键的边界，以下两个条件都必须为真：

- 索引键必须共享相同的字段路径（但不包括字段名称）。
- 查询必须 `$elemMatch`在该路径上使用的字段上指定谓词。

对于嵌入文档中的字段，[点分字段名称](https://www.mongodb.com/docs/v7.0/core/document/#std-label-document-dot-notation)（例如`"a.b.c.d"`）是 的字段路径 `d`。要复合同一数组中索引键的边界， 必须 `$elemMatch`位于直至*但不包括*字段名称本身的路径上（即`"a.b.c"`）。

#### 例子

以下示例显示 MongoDB 如何组合同一数组中索引键的边界。此示例使用了`survey2`中使用的集合[前面的例子。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/multikey-index-bounds/#std-label-index-bounds-example-non-array-multiple-array)

1. 创建复合多键索引

   `ratings.score`在和 字段上创建复合索引`ratings.by`：

   ```
   db.survey2.createIndex( { "ratings.score": 1, "ratings.by": 1 } )
   ```

   字段`"ratings.score"`和`"ratings.by"`共享字段路径`ratings`。

2. 查询集合

   运行以下查询：

   ```
   db.survey2.find( { ratings: { $elemMatch: { score: { $lte: 5 }, by: "anon" } } } )
   ```

   前面的查询`$elemMatch`在`ratings`字段上使用，要求数组至少包含一个与这两个条件都匹配的*单个*元素。

   分别采用谓词：

   - 谓词的界限`score: { $lte: 5 }`是 `[ [ -Infinity, 5 ] ]`。
   - 谓词的界限`by: "anon"`是 `[ [ "anon", "anon" ] ]`。

   MongoDB 将两个边界复合为以下边界：

   ```
   { "ratings.score" : [ [ -Infinity, 5 ] ], "ratings.by" : [ [ "anon", "anon" ] ] }
   ```

#### 例子：$elemMatch在不同字段路径上的应用

如果您的查询指定了`$elemMatch`与公共路径不同的字段，则 MongoDB**无法**复合来自同一数组的索引键的边界。

以下示例演示了`$elemMatch`发散的字段路径。

1. 填充样本集合

   创建一个`survey3`包含带有字符串字段`item`和数组字段的文档的集合`ratings`：

   ```
   db.survey3.insertMany( [
      {
         _id: 1,
         item: "ABC",
         ratings: [
            { scores: [ { q1: 2, q2: 4 }, { q1: 3, q2: 8 } ], loc: "A" },
            { scores: [ { q1: 2, q2: 5 } ], loc: "B" }
         ]
      },
      {
         _id: 2,
         item: "XYZ",
         ratings: [
            { scores: [ { q1: 7 }, { q1: 2, q2: 8 } ], loc: "B" }
         ]
      }
   ] )
   ```

2. 创建复合多键索引

   `ratings.scores.q1`在和 字段上创建复合索引`ratings.scores.q2`：

   ```
   db.survey3.createIndex( { "ratings.scores.q1": 1, "ratings.scores.q2": 1 } )
   ```

   字段`"ratings.scores.q1"`和`"ratings.scores.q2"` 共享字段路径`"ratings.scores"`。为了复合索引范围，查询必须`$elemMatch`在公共字段路径上使用。

3. 查询集合

   以下查询使用`$elemMatch` *不在*所需路径上的查询：

   ```
   db.survey3.find( { ratings: { $elemMatch: { 'scores.q1': 2, 'scores.q2': 8 } } } )
   ```

   MongoDB 无法复合索引边界，并且 `"ratings.scores.q2"`在索引扫描期间该字段不受约束。

   要复合边界，查询必须`$elemMatch`在公共路径上使用`"ratings.scores"`：

   ```
   db.survey3.find( { 'ratings.scores': { $elemMatch: { 'q1': 2, 'q2': 8 } } } )
   ```

