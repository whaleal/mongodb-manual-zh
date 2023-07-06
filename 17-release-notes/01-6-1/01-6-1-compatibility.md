# MongoDB 6.1中的兼容性变化

> 重要：
>
> MongoDB 6.1是一个快速版本，仅支持MongoDB Atlas。MongoDB 6.1不支持在本地使用。有关更多信息，请参阅[MongoDB版本控制。](https://www.mongodb.com/docs/upcoming/reference/versioning/#std-label-release-version-numbers)
>
> 要安装支持本地使用的最新MongoDB版本MongoDB 6.0，请参阅[MongoDB 6.0安装说明。](https://www.mongodb.com/docs/v6.0/installation/)

本页面介绍了MongoDB 6.1中引入的可能影响与旧版本MongoDB兼容性的更改。

## 集合

以下对[聚合的](https://www.mongodb.com/docs/upcoming/aggregation/#std-label-aggregation)更改可能会影响与旧版本MongoDB的兼容性。

### `$add`浮点四舍五入错误

从MongoDB 6.1开始，当[`$add`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/add/#mongodb-expression-exp.-add)表达式收到具有多个浮点值的输入列表时，MongoDB可能会返回与以前版本略有不同的结果。

`$add`表达式不再解释浮点四舍五入错误。因此，在大多数编程语言中，`$add`的行为就像加法一样。

例如，与旧版本相比，以下`$add`表达式在MongoDB 6.1上运行时返回不同的结果：

```
db.test.aggregate(
   [
     {
        $project: {
           sumOfValues: {
              $add: [ 0.1, 0.2, 0.3 ]
           }
         }
      }
   ]
)
```

MongoDB 6.1及更高版本的输出：

```
[
  {
    _id: ObjectId("6390f8085425651d8d0ef0a7"),
    sumOfValues: 0.6000000000000001
  }
]
```

MongoDB 6.0及更早版本的输出：

```
[
  {
    _id: ObjectId("6390f8085425651d8d0ef0a7"),
    sumOfValues: 0.6
  }
]
```

## 删除了选项

从MongoDB 6.1开始，日志记录始终处于启用状态。因此，MongoDB删除了`storage.journal.enabled`选项以及相应的`--journal`和`--nojournal`命令行选项。

## 时间序列集合

### 不允许在存储桶集合命名空间上查看

您无法从[时间序列](https://www.mongodb.com/docs/upcoming/core/timeseries-collections/#std-label-manual-timeseries-collection)存储桶集合命名空间（即以`system.buckets`为前缀的集合）创建[视图。](https://www.mongodb.com/docs/upcoming/core/views/#std-label-views-landing-page)

如果您要从之前的版本升级到MongoDB 6.1，则必须删除在`system.buckets`集合上创建的所有视图。

## 服务器参数

从MongoDB 6.1开始，[`coordinateCommitReturnImmediatelyAfterPersistingDecision`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.coordinateCommitReturnImmediatelyAfterPersistingDecision)的默认值为`false`。

## 没有自动切块

从MongoDB 6.1开始，不执行自动分割块。这是因为平衡了政策的改进。自动拆分命令仍然存在，但不执行操作。有关详细信息，请参阅[平衡策略更改。](https://www.mongodb.com/docs/upcoming/release-notes/6.1/#std-label-release-notes-6.1-balancing-policy-changes)

从MongoDB 6.1开始，以下自动拆分命令不执行操作：

- [`sh.enableAutoSplit()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.enableAutoSplit/#mongodb-method-sh.enableAutoSplit)
- [`sh.disableAutoSplit()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.disableAutoSplit/#mongodb-method-sh.disableAutoSplit)

## 分级指标变更

`currentOp.opStatus`从MongoDB 6.1中的分片指标中删除。有关替换`currentOp.opStatus`报告的新指标列表，请参阅[发布说明。](https://www.mongodb.com/docs/upcoming/release-notes/6.1/#std-label-6.1-rel-notes-currentOp)





原文：[Compatibility Changes in MongoDB 6.1](https://www.mongodb.com/docs/upcoming/release-notes/6.1-compatibility/)  







