# 修改分片集群中的范围大小

分片集群的默认范围大小为 128 兆字节。此默认范围大小适用于大多数部署；但是，如果您注意到自动迁移使用的 I/O 超出了您的硬件可以处理的范围，您可能需要减小范围大小。较小的范围大小会导致更快速和更频繁的迁移。允许的大小介于 1 到 1024 兆字节之间（含）。

要修改范围大小，请使用以下过程：

1. 连接到[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)集群中的任何使用 [`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

2. 发出以下命令以切换到配置数据库：

   ```shell
   use config
   ```

   

3. 发出以下命令以存储全局范围大小配置值：

   ```shell
   db.settings.updateOne(
      { _id: "chunksize" },
      { $set: { _id: "chunksize", value: <sizeInMB> } },
      { upsert: true }
   )
   ```

   

修改块大小有几个限制：

- 从 MongoDB 6.0.3 开始，不执行自动分块。这是因为平衡政策的改进。自动拆分命令仍然存在，但不执行操作。有关详细信息，请参阅 平衡策略更改。

  从 MongoDB 6.0 开始，以下自动拆分命令不执行操作：

  - `sh.enableAutoSplit()`
  - `sh.disableAutoSplit()`

- 在 MongoDB 6.0 之前的版本中，自动拆分仅发生在插入或更新操作中。

- 如果降低块大小，所有块拆分为新大小可能需要一些时间。

- 拆分无法撤消。

- 如果增加块大小，则现有块仅通过插入或更新增长，直到它们达到新大小。

- 块大小的允许范围是 1 到 1024 兆字节（含）。

原文 - https://docs.mongodb.com/manual/tutorial/modify-chunk-size-in-sharded-cluster/

译者：陆文龙

