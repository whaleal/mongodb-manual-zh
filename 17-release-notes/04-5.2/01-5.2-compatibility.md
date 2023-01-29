# MongoDB 5.2中的兼容性变化

> 重要：
>
> MongoDB 5.2是一个快速版本，仅支持MongoDB Atlas。MongoDB 5.2不支持在本地使用。有关更多信息，请参阅[MongoDB版本控制。](https://www.mongodb.com/docs/upcoming/reference/versioning/#std-label-release-version-numbers)

以下5.2更改可能会影响与旧版本MongoDB的兼容性。

## `$setWindowFields` 阶段，包含事务和快照读取问题

在MongoDB 5.3之前的版本中，[`$setWindowFields`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/setWindowFields/#mongodb-pipeline-pipe.-setWindowFields) 聚合管道阶段不能用于 [事务](https://www.mongodb.com/docs/upcoming/core/transactions/#std-label-transactions)或[`“快照”`](https://www.mongodb.com/docs/upcoming/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)读取关注。

## 删除参数

### 删除 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod) 选项 

| 删除了[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)选项 | 说明                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `--cpu`                                                      | MongoDB 5.2删除了 `--cpu` [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod) option.  选项。 |

## 在索引生成过程中可以删除现有索引

从MongoDB 5.2开始，您可以使用[`dropIndexes`](https://www.mongodb.com/docs/upcoming/reference/command/dropIndexes/#mongodb-dbcommand-dbcmd.dropIndexes) 或[`db.collection.dropIndexes()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.dropIndexes/#mongodb-method-db.collection.dropIndexes)删除同一集合上的现有索引，即使正在构建索引。在早期版本中，尝试在正在进行的索引生成期间删除其他索引会导致`BackgroundOperationInProgressForNamespace`错误。



原文：[Compatibility Changes in MongoDB 5.2](https://www.mongodb.com/docs/upcoming/release-notes/5.2-compatibility/)