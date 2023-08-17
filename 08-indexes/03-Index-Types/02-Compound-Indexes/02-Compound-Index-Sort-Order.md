## 复合索引的排序顺序

索引以升序 ( `1`) 或降序 ( `-1`) 顺序存储对字段的引用。对于[复合索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound)，排序顺序可以决定索引是否支持排序操作。

复合索引支持与索引的排序顺序或索引的反向排序顺序匹配的排序操作。

### 使用案例

一款手机游戏有一个排行榜，显示以下信息：

- 最高游戏分数
- 获得每个分数的用户
- 每个分数的获得日期

该应用程序首先按降序对排行榜进行排序`score`。然后，`username`与每个相关联的内容`score`按升序（按字母顺序）排序。

如果索引中的排序顺序与查询中的排序顺序匹配，则复合索引可以提高排行榜的性能。

### 例子

考虑`leaderboard`包含这些文档的集合：

```
db.leaderboard.insertMany( [
   {
      "score": 50,
      "username": "Alex Martin",
      "date": ISODate("2022-03-01T00:00:00Z")
   },
   {
      "score": 55,
      "username": "Laura Garcia",
      "date": ISODate("2022-03-02T00:00:00Z")
   },
   {
      "score": 60,
      "username": "Alex Martin",
      "date": ISODate("2022-03-03T00:00:00Z")
   },
   {
      "score": 60,
      "username": "Riya Patel",
      "date": ISODate("2022-03-04T00:00:00Z")
   },
   {
      "score": 50,
      "username": "Laura Garcia",
      "date": ISODate("2022-03-05T00:00:00Z")
   }
] )
```

此查询返回排行榜结果：

```
db.leaderboard.find().sort( { score: -1, username: 1 } )
```

输出：

```
[
   {
      _id: ObjectId("632235700646eaee87a56a74"),
      score: 60,
      username: 'Alex Martin',
      date: ISODate("2022-03-03T00:00:00.000Z")
   },
   {
      _id: ObjectId("632235700646eaee87a56a75"),
      score: 60,
      username: 'Riya Patel',
      date: ISODate("2022-03-04T00:00:00.000Z")
   },
   {
      _id: ObjectId("632235700646eaee87a56a73"),
      score: 55,
      username: 'Laura Garcia',
      date: ISODate("2022-03-02T00:00:00.000Z")
   },
   {
      _id: ObjectId("632235700646eaee87a56a72"),
      score: 50,
      username: 'Alex Martin',
      date: ISODate("2022-03-01T00:00:00.000Z")
   },
   {
      _id: ObjectId("632235700646eaee87a56a76"),
      score: 50,
      username: 'Laura Garcia',
      date: ISODate("2022-03-05T00:00:00.000Z")
   }
]
```

结果首先按分数降序排序，然后按用户名升序排序（按字母顺序）。

#### 排行榜的支持索引

以下索引提高了排行榜结果的性能，因为索引的排序顺序与查询中使用的排序顺序相匹配：

```
db.leaderboard.createIndex( { score: -1, username: 1 } )
```

该复合索引存储：

- `score`值按降序排列。
- `username`值按升序排列（按字母顺序）。

#### 倒序结果

MongoDB 可以在任一方向遍历复合索引。如果应用程序允许用户以相反的顺序查看排行榜，则索引也支持该查询。

以下查询以相反的顺序返回排行榜，其中结果首先按升序值排序`score`，然后按降序`username`值排序（按字母顺序逆序）：

```
db.leaderboard.find().sort( { score: 1, username: -1 } )
```

输出:

```
[
   {
      _id: ObjectId("632235700646eaee87a56a76"),
      score: 50,
      username: 'Laura Garcia',
      date: ISODate("2022-03-05T00:00:00.000Z")
   },
   {
      _id: ObjectId("632235700646eaee87a56a72"),
      score: 50,
      username: 'Alex Martin',
      date: ISODate("2022-03-01T00:00:00.000Z")
   },
   {
      _id: ObjectId("632235700646eaee87a56a73"),
      score: 55,
      username: 'Laura Garcia',
      date: ISODate("2022-03-02T00:00:00.000Z")
   },
   {
      _id: ObjectId("632235700646eaee87a56a75"),
      score: 60,
      username: 'Riya Patel',
      date: ISODate("2022-03-04T00:00:00.000Z")
   },
   {
      _id: ObjectId("632235700646eaee87a56a74"),
      score: 60,
      username: 'Alex Martin',
      date: ISODate("2022-03-03T00:00:00.000Z")
   }
]
```

索引`{ score: -1, username: 1 }`支持该查询。

### 不支持的查询

复合索引不支持排序顺序与索引不匹配或与索引相反的查询。因此，`{ score: -1, username: 1 }`索引**不**支持先按升序排序 `score`再按升序`username`排序，例如以下查询：

```
db.leaderboard.find().sort( { score: 1, username: 1 } )
```

此外，对于使用索引的排序操作，排序中指定的字段的出现顺序必须与它们在索引中出现的顺序相同。因此，上述索引无法支持此查询：

```
db.leaderboard.find().sort( { username: 1, score: -1, } )
```

### 了解更多

- 有关排序顺序和索引的更多信息，请参阅 [使用索引对查询结果进行排序。](https://www.mongodb.com/docs/v7.0/tutorial/sort-results-with-indexes/#std-label-sorting-with-indexes)
- 有关对查询结果进行排序的更多信息，请参阅 [`sort()`。](https://www.mongodb.com/docs/v7.0/reference/method/cursor.sort/#mongodb-method-cursor.sort)

