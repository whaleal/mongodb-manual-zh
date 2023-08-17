## 删除索引

您可以从集合中删除特定索引。如果您发现索引对性能产生负面影响、想要用新索引替换它或不再需要该索引，则可能需要删除该索引。

要删除索引，请使用以下 shell 方法之一：

| 方法                                                         | 描述                                               |
| :----------------------------------------------------------- | :------------------------------------------------- |
| [`db.collection.dropIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex) | 从集合中删除特定索引。                             |
| [`db.collection.dropIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.dropIndexes/#mongodb-method-db.collection.dropIndexes) | 从集合或索引数组中删除所有可移动索引（如果指定）。 |

### 关于此任务

您可以删除字段上除默认索引之外的任何索引`_id`。要删除`_id`索引，您必须删除整个集合。

如果删除生产中积极使用的索引，则可能会遇到性能下降的情况。在删除索引之前，请考虑[隐藏该索引](https://www.mongodb.com/docs/v7.0/core/index-hidden/#std-label-index-type-hidden)以评估删除的潜在影响。

### 在你开始之前

要删除索引，您需要它的名称。要获取集合的所有索引名称，请运行以下[`getIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)方法：

```
db.<collection>.getIndexes()
```

### 步骤

确定要删除哪些索引后，请对指定集合使用以下删除方法之一：

#### 删除单个索引

要删除特定索引，请使用该[`dropIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex) 方法并指定索引名称：

```
db.<collection>.dropIndex("<indexName>")
```

#### 删除多个索引

要删除多个索引，请使用该[`dropIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.dropIndexes/#mongodb-method-db.collection.dropIndexes) 方法并指定索引名称数组：

```
db.<collection>.dropIndexes("<index1>", "<index2>", "<index3>")
```

#### 删除除 `_id` 索引之外的所有索引

要删除除 `_id` 索引之外的所有索引，请使用以下[`dropIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.dropIndexes/#mongodb-method-db.collection.dropIndexes)方法：

```
db.<collection>.dropIndexes()
```

### 结果

删除索引后，系统会返回有关操作状态的信息。

输出示例：

```
...
{ "nIndexesWas" : 3, "ok" : 1 }
...
```

的值`nIndexesWas`反映了删除索引之前的索引数量。

要确认索引已删除，请运行以下 [`db.collection.getIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)方法：

```
db.<collection>.getIndexes()
```

删除的索引不再出现在`getIndexes()`输出中。

### 了解更多

- 要了解有关管理现有索引的更多信息，请参阅[管理索引。](https://www.mongodb.com/docs/v7.0/tutorial/manage-indexes/#std-label-manage-indexes)
- 要了解如何删除MongoDB Compass中的索引，请参阅[管理 Compass 中的索引。](https://www.mongodb.com/docs/compass/current/indexes/)