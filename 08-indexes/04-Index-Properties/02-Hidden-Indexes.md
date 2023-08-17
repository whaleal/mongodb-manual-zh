## 隐藏索引

*4.4版本中的新功能*。

[隐藏索引对查询计划程序](https://www.mongodb.com/docs/v7.0/core/query-plans/)不可见，并且不能用于支持查询。

通过向规划者隐藏索引，用户可以评估删除索引的潜在影响，而无需实际删除索引。如果影响是负面的，用户可以取消隐藏索引，而不必重新创建已删除的索引。

### 行为

除了对规划器隐藏之外，隐藏索引的行为与非隐藏索引类似。例如:

- 如果隐藏索引是[唯一索引](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)，则该索引仍将其唯一约束应用于文档。
- 如果隐藏索引是[TTL 索引](https://www.mongodb.com/docs/v7.0/core/index-ttl/#std-label-index-feature-ttl)，则该索引仍然会使文档过期。
- 隐藏索引包含在[`listIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/listIndexes/#mongodb-dbcommand-dbcmd.listIndexes)和 [`db.collection.getIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)结果中。
- 隐藏索引在对集合进行写入操作时更新，并继续消耗磁盘空间和内存。因此，它们包含在各种统计操作中，例如 [`db.collection.stats()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.stats/#mongodb-method-db.collection.stats)和[`$indexStats`。](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/indexStats/#mongodb-pipeline-pipe.-indexStats)
- 隐藏未隐藏的索引或取消隐藏隐藏的索引会重置其 [`$indexStats`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/indexStats/#mongodb-pipeline-pipe.-indexStats). 隐藏已隐藏的索引或取消隐藏已取消隐藏的索引不会重置[`$indexStats`.](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/indexStats/#mongodb-pipeline-pipe.-indexStats)

### 限制

- 要隐藏索引，您必须将[featureCompatibilityVersion](https://www.mongodb.com/docs/v7.0/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)设置为`4.4`或更大。[但是，一旦隐藏，即使在 MongoDB 4.4 二进制文件上将featureCompatibilityVersion](https://www.mongodb.com/docs/v7.0/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)设置为，索引仍保持隐藏状态`4.2`。
- 您无法隐藏`_id`索引。
- 你不能[`cursor.hint()`](https://www.mongodb.com/docs/v7.0/reference/method/cursor.hint/#mongodb-method-cursor.hint)隐藏索引。

### 例子

#### 创建隐藏索引

要创建`hidden`索引，请使用 [隐藏](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#std-label-method-createIndex-hidden)选项设置为 的[`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)方法。`true`

> 笔记:
>
> 要使用该`hidden`选项 [`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)，您必须将 [featureCompatibilityVersion](https://www.mongodb.com/docs/v7.0/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)设置为`4.4`或更大。[但是，一旦隐藏，即使在 MongoDB 4.4 二进制文件上将featureCompatibilityVersion](https://www.mongodb.com/docs/v7.0/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)设置为，索引仍保持隐藏状态 `4.2`。

例如，以下操作在`borough`字段上创建隐藏的升序索引：

```
db.addresses.createIndex(
   { borough: 1 },
   { hidden: true }
);
```

要验证，请在集合[`db.collection.getIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)上 运行`addresses`：

```
db.addresses.getIndexes()
```

该操作返回以下信息：

```
[
   {
      "v" : 2,
      "key" : {
         "_id" : 1
      },
      "name" : "_id_"
   },
   {
      "v" : 2,
      "key" : {
         "borough" : 1
      },
      "name" : "borough_1",
      "hidden" : true
   }
]
```

`hidden`仅当值为 时才返回索引选项`true`。

#### 隐藏现有索引

> 笔记:
>
> - 要隐藏索引，您必须将[featureCompatibilityVersion](https://www.mongodb.com/docs/v7.0/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)设置为`4.4`或更大。[但是，一旦隐藏，即使在 MongoDB 4.4 二进制文件上将featureCompatibilityVersion](https://www.mongodb.com/docs/v7.0/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)设置为，索引仍保持隐藏状态`4.2`。
> - 您无法隐藏`_id`索引

要隐藏现有索引，您可以使用[`collMod`](https://www.mongodb.com/docs/v7.0/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令或[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)帮手 [`db.collection.hideIndex()`。](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.hideIndex/#mongodb-method-db.collection.hideIndex)

例如，创建一个不隐藏的索引：

```shell
db.restaurants.createIndex( { borough: 1, ratings: 1 } );
```

要隐藏索引，您可以指定：

* 该 [`db.collection.hideIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.hideIndex/#mongodb-method-db.collection.hideIndex)方法的索引键规范文档：

  ```shell
  db.restaurants.hideIndex( { borough: 1, ratings: 1 } ); // Specify the index key specification document
  ```

* 方法的索引名称[`db.collection.hideIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.hideIndex/#mongodb-method-db.collection.hideIndex)：

  ```shell
  db.restaurants.hideIndex( "borough_1_ratings_1" );  // Specify the index name
  ```

要验证，请在集合[`db.collection.getIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)上 运行`restaurants`：

```
db.restaurants.getIndexes()
```

该操作返回以下信息：

```
[
   {
      "v" : 2,
      "key" : {
         "_id" : 1
      },
      "name" : "_id_"
   },
   {
      "v" : 2,
      "key" : {
         "borough" : 1,
         "ratings" : 1
      },
      "name" : "borough_1_ratings_1",
      "hidden" : true
   }
]
```

`hidden`仅当值为 时才返回索引选项`true`。

#### 取消隐藏现有索引

要取消隐藏隐藏索引，您可以使用[`collMod`](https://www.mongodb.com/docs/v7.0/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令或[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)帮手 [`db.collection.unhideIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.unhideIndex/#mongodb-method-db.collection.unhideIndex)。您可以指定：

* 该 [`db.collection.unhideIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.unhideIndex/#mongodb-method-db.collection.unhideIndex)方法的索引键规范文档：

  ```shell
  db.restaurants.unhideIndex( { borough: 1, city: 1 } );  // Specify the index key specification document
  ```

* [`db.collection.unhideIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.unhideIndex/#mongodb-method-db.collection.unhideIndex) 方法中的索引名称：

  ```
  db.restaurants.unhideIndex( "borough_1_ratings_1" );    // Specify the index name
  ```

要验证，请在集合[`db.collection.getIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)上 运行`restaurants`：

```
db.restaurants.getIndexes()
```

该操作返回以下信息：

```
[
   {
      "v" : 2,
      "key" : {
         "_id" : 1
      },
      "name" : "_id_"
   },
   {
      "v" : 2,
      "key" : {
         "borough" : 1,
         "ratings" : 1
      },
      "name" : "borough_1_ratings_1"
   }
]
```

索引选项`hidden`不再显示为 `borough_1_ratings_1`索引的一部分，因为仅当值为 时才返回该字段`true`。

由于索引在隐藏时得到完全维护，因此一旦取消隐藏，索引就可以立即使用。