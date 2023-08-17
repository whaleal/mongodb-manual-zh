## 管理索引

此页面显示如何管理现有索引。有关创建索引的说明，请参阅特定索引类型页面。

### 查看现有索引

以下部分提供了查看集合或整个数据库上现有索引的方法。

#### 列出集合上的所有索引

要返回集合上所有索引的列表，请使用该 [`db.collection.getIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)方法或类似的方法[适合您的驱动程序的方法。](https://api.mongodb.com/)

例如，要查看`people`集合上的所有索引，请运行以下命令：

```
db.people.getIndexes()
```

#### 列出数据库的所有索引

要列出数据库中的所有集合索引，请运行以下命令[`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
db.getCollectionNames().forEach(function(collection) {
    indexes = db[collection].getIndexes();
    print("Indexes for " + collection + ":");
    printjson(indexes);
});
```

#### 列出特定类型的索引

要列出所有数据库中所有集合的特定类型（例如[hashed](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-hashed/#std-label-index-type-hashed)或[text](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/#std-label-index-type-text)）的所有索引，请在 [`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
// The following finds all hashed indexes

db.adminCommand("listDatabases").databases.forEach(function(d){
    let mdb = db.getSiblingDB(d.name);
    mdb.getCollectionInfos({ type: "collection" }).forEach(function(c){
      let currentCollection = mdb.getCollection(c.name);
      currentCollection.getIndexes().forEach(function(idx){
        let idxValues = Object.values(Object.assign({}, idx.key));

        if (idxValues.includes("hashed")) {
          print("Hashed index: " + idx.name + " on " + d.name + "." + c.name);
          printjson(idx);
        };
      });
    });
});
```

### 删除索引

> 提示:
>
> **在删除索引之前隐藏它**
>
> 如果您删除生产中积极使用的索引，您的应用程序可能会导致性能下降。在删除索引之前，您可以通过 [隐藏索引来评估删除的潜在影响。](https://www.mongodb.com/docs/v7.0/core/index-hidden/#std-label-hide-existing-index)
>
> 隐藏索引不用于支持查询。如果隐藏索引并观察到严重的负面性能影响，请考虑保留并取消隐藏索引，以便查询可以恢复使用它。

要了解如何删除现有索引，请参阅[删除索引。](https://www.mongodb.com/docs/v7.0/core/indexes/drop-index/#std-label-drop-an-index)

要了解如何删除MongoDB Compass中的索引，请参阅[管理 Compass 中的索引。](https://www.mongodb.com/docs/compass/current/indexes/)

### 修改索引

要修改 MongoDB Shell 中的现有索引，您需要删除并重新创建索引。此规则的例外是 [TTL 索引](https://www.mongodb.com/docs/v7.0/core/index-ttl/#std-label-index-feature-ttl)，它可以通过[`collMod`](https://www.mongodb.com/docs/v7.0/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令与集合标志结合 进行修改[`index`](https://www.mongodb.com/docs/v7.0/reference/command/collMod/#mongodb-collflag-index)。

### 使用临时索引最大限度地减少性能影响

如果您删除生产中积极使用的索引，您的应用程序可能会导致性能下降。为了确保查询在修改期间仍然可以使用索引，您可以创建一个临时的冗余索引，其中包含与修改后的索引相同的字段。

#### 例子

此示例创建一个新索引并修改该索引以使其 [唯一。](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)

1. 创建一个带有字段`siteAnalytics`索引的集合`url`

   运行这个命令：

   ```
   db.siteAnalytics.createIndex( { "url": 1 } )
   ```

   该命令返回索引的名称：

   ```
   url_1
   ```

2. `url`创建包含该字段的临时索引

   运行这个命令：

   ```
   db.siteAnalytics.createIndex( { "url": 1, "dummyField": 1 } )
   ```

   该命令返回索引的名称：

   ```
   url_1_dummyField_1
   ```

   此临时索引可让您安全地删除原始`{ "url": 1 }`索引，而不会影响性能。

3. 删除原来的索引

   运行这个命令：

   ```
   db.siteAnalytics.dropIndex( { "url_1" } )
   ```

   该命令返回：

   ```
   { nIndexesWas: 3, ok: 1 }
   ```

4. `{ "url": 1 }`使用`unique`属性重新创建索引

   运行这个命令：

   ```
   db.siteAnalytics.createIndex( { "url": 1 }, { "unique": true } )
   ```

   该命令返回索引的名称：

   ```
   url_1
   ```

   索引`url_1`将重新创建，您可以删除临时索引而不影响性能。对字段的查询`url`可以使用新的唯一索引。

5. 删除临时索引

   运行这个命令：

   ```
   db.siteAnalytics.dropIndex( { "url_1_dummyField_1" } )
   ```

   该命令返回：

   ```
   { nIndexesWas: 3, ok: 1 }
   ```

6. 确认索引已更新

   要查看集合上的索引`siteAnalytics`，请运行以下命令：

   ```
   ```

   该命令返回这些索引，表明该`url_1` 索引现在是唯一的：

   ```
   [
     { v: 2, key: { _id: 1 }, name: '_id_' },
     { v: 2, key: { url: 1 }, name: 'url_1', unique: true }
   ]
   ```

### 查找跨分片不一致的索引

如果分片集合在包含集合块的每个分片上不具有完全相同的索引（包括索引选项），则分片集合的索引不一致。虽然正常操作时不应该出现索引不一致的情况，但是索引不一致的情况还是有可能发生的，比如：

- 当用户创建具有`unique`键约束的索引并且一个分片包含具有重复文档的块时。在这种情况下，创建索引操作可能在没有重复项的分片上成功，但在有重复项的分片上失败。
- 当用户以[滚动方式跨分片创建索引时（即手动跨分片逐一构建索引），](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/)但未能为关联分片构建索引，或者错误地构建了不同规格的索引。

从 MongoDB 4.4（和 4.2.6）开始，默认情况下，[配置服务器](https://www.mongodb.com/docs/v7.0/core/sharded-cluster-config-servers/#std-label-sharding-config-server)主节点会检查分片集合的分片之间的索引不一致情况，并且该命令[`serverStatus`](https://www.mongodb.com/docs/v7.0/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)在配置服务器主节点上运行时，会返回 field[`shardedIndexConsistency`](https://www.mongodb.com/docs/v7.0/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.shardedIndexConsistency) 字段以报告索引不一致的分片集合的数量。

如果[`shardedIndexConsistency`](https://www.mongodb.com/docs/v7.0/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.shardedIndexConsistency)报告任何索引不一致的情况，您可以为分片集合运行以下管道，直到找到不一致的地方。

> 笔记:
>
> 以下管道适用于 MongoDB 4.2.4 及更高版本。

1. 定义以下[聚合管道：](https://www.mongodb.com/docs/v7.0/core/aggregation-pipeline/#std-label-aggregation-pipeline)

   ```
   const pipeline = [
       // Get indexes and the shards that they belong to.
       {$indexStats: {}},
       // Attach a list of all shards which reported indexes to each document from $indexStats.
       {$group: {_id: null, indexDoc: {$push: "$$ROOT"}, allShards: {$addToSet: "$shard"}}},
       // Unwind the generated array back into an array of index documents.
       {$unwind: "$indexDoc"},
       // Group by index name.
       {
           $group: {
               "_id": "$indexDoc.name",
               "shards": {$push: "$indexDoc.shard"},
               // Convert each index specification into an array of its properties
               // that can be compared using set operators.
               "specs": {$push: {$objectToArray: {$ifNull: ["$indexDoc.spec", {}]}}},
               "allShards": {$first: "$allShards"}
           }
       },
       // Compute which indexes are not present on all targeted shards and
       // which index specification properties aren't the same across all shards.
       {
           $project: {
               missingFromShards: {$setDifference: ["$allShards", "$shards"]},
               inconsistentProperties: {
                    $setDifference: [
                        {$reduce: {
                            input: "$specs",
                            initialValue: {$arrayElemAt: ["$specs", 0]},
                            in: {$setUnion: ["$$value", "$$this"]}}},
                        {$reduce: {
                            input: "$specs",
                            initialValue: {$arrayElemAt: ["$specs", 0]},
                            in: {$setIntersection: ["$$value", "$$this"]}}}
                    ]
                }
           }
       },
       // Only return output that indicates an index was inconsistent, i.e. either a shard was missing
       // an index or a property on at least one shard was not the same on all others.
       {
           $match: {
               $expr:
                   {$or: [
                       {$gt: [{$size: "$missingFromShards"}, 0]},
                       {$gt: [{$size: "$inconsistentProperties"}, 0]},
                   ]
               }
           }
       },
       // Output relevant fields.
       {$project: {_id: 0, indexName: "$$ROOT._id", inconsistentProperties: 1, missingFromShards: 1}}
   ];
   ```

2. 运行分片集合的聚合管道进行测试。例如，要测试分片集合`test.reviews`在其关联分片之间是否具有不一致的索引：

   ```
   db.getSiblingDB("test").reviews.aggregate(pipeline)
   ```

   如果集合具有不一致的索引，则该集合的聚合将返回有关不一致索引的详细信息：

   ```
   { "missingFromShards" : [ "shardB" ], "inconsistentProperties" : [ ], "indexName" : "page_1_score_1" }
   { "missingFromShards" : [ ], "inconsistentProperties" : [ { "k" : "expireAfterSeconds", "v" : 60 }, { "k" : "expireAfterSeconds", "v" : 600 } ], "indexName" : "reviewDt_1" }
   ```

   返回的文档表明分片集合存在两个不一致之处`test.reviews`：

   * `page_1_score_1`上的集合中缺少名为 的索引`shardB`。
   * 指定的索引`reviewDt_1`在集合的分片中具有不一致的属性，具体来说，`expireAfterSeconds` 属性不同。

**要解决特定分片上的集合中缺少索引的不一致问题**

您可以：

- 在受影响的分片上对集合执行[滚动索引构建。](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/)

  -或者-

- [`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)从 实例发出索引构建[`mongos`](https://www.mongodb.com/docs/v7.0/reference/program/mongos/#mongodb-binary-bin.mongos)。该操作仅在缺少索引的分片上构建集合的索引。

**要解决分片之间索引属性不同的问题，**

从受影响分片上的集合中删除不正确的索引并重建索引。要重建索引，您可以：

- 在受影响的分片上对集合执行[滚动索引构建。](https://www.mongodb.com/docs/v7.0/tutorial/build-indexes-on-sharded-clusters/)

  -或者-

- [`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)从 实例发出索引构建[`mongos`](https://www.mongodb.com/docs/v7.0/reference/program/mongos/#mongodb-binary-bin.mongos)。该操作仅在缺少索引的分片上构建集合的索引。

或者，如果不一致的是`expireAfterSeconds`属性，您可以运行[`collMod`](https://www.mongodb.com/docs/v7.0/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令来更新秒数，而不是删除并重建索引。