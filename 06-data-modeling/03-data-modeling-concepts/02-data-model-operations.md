**操作因素和数据模型**

为 MongoDB 建模应用程序数据应该考虑影响 MongoDB 性能的各种操作因素。例如，不同的数据模型可以允许更高效的查询，增加插入和更新操作的吞吐量，或者更有效地将活动分配到分片集群。

在开发数据模型时，请结合以下注意事项分析应用程序的所有 [读写操作。](https://www.mongodb.com/docs/manual/crud/)

**原子性**

在 MongoDB 中，写操作在单个文档级别上是原子的，即使该操作修改 了单个文档*中*的多个嵌入文档。当单个写操作修改多个文档时（例如[`db.collection.updateMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany)），每个文档的修改是原子的，但整个操作不是原子的。

**嵌入式数据模型**

嵌入式数据模型将所有相关数据组合在一个文档中，而不是跨多个文档和集合进行规范化。此数据模型有助于原子操作。

有关为单个文档提供原子更新的示例数据模型，请参阅[原子操作的模型数据。](https://www.mongodb.com/docs/manual/tutorial/model-data-for-atomic-operations/#std-label-data-modeling-atomic-operation)

**多文件交易**

对于在相关数据块之间存储引用的数据模型，应用程序必须发出单独的读取和写入操作来检索和修改这些相关数据块。

对于需要对多个文档（在单个或多个集合中）进行读写原子性的情况，MongoDB 支持多文档事务：

- **在 4.0 版本**中，MongoDB 支持副本集上的多文档事务。
- **在 4.2 版本**中，MongoDB 引入了分布式事务，它增加了对分片集群上的多文档事务的支持，并合并了现有的对副本集上的多文档事务的支持。

有关 MongoDB 中事务的详细信息，请参阅 [事务](https://www.mongodb.com/docs/manual/core/transactions/)页面。

>[IMPORTANT]
>
>在大多数情况下，多文档事务会比单文档写入产生更大的性能成本，并且多文档事务的可用性不应取代有效的模式设计。对于许多场景， [非规范化数据模型（嵌入式文档和数组）](https://www.mongodb.com/docs/manual/core/data-model-design/#std-label-data-modeling-embedding)将继续成为您的数据和用例的最佳选择。也就是说，对于许多场景，适当地建模数据将最大限度地减少对多文档事务的需求。
>
>有关其他事务使用注意事项（例如运行时限制和 oplog 大小限制），另请参阅 [生产注意事项。](https://www.mongodb.com/docs/manual/core/transactions-production-consideration/)

**分片**

MongoDB 使用[分片](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharding)来提供水平扩展。这些集群支持具有大数据集和高吞吐量操作的部署。分片允许用户在数据库中对[集合进行](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-collection)[分区](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-data-partition)，以 将集合的文档分布到多个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例或 [分片](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)中。

为了在分片集合中分配数据和应用程序流量，MongoDB 使用[分片键](https://www.mongodb.com/docs/manual/core/sharding-shard-key/#std-label-shard-key)。选择合适的 [分片键](https://www.mongodb.com/docs/manual/core/sharding-shard-key/#std-label-shard-key)对性能有重大影响，可以启用或阻止查询隔离和增加写入容量。虽然您可以稍后[更改分片键](https://www.mongodb.com/docs/manual/core/sharding-change-a-shard-key/#std-label-change-a-shard-key)，但仔细考虑您的分片键选择很重要。

有关详细信息，请参阅[分片](https://www.mongodb.com/docs/manual/sharding/)和 [分片键](https://www.mongodb.com/docs/manual/core/sharding-shard-key/)。

**索引**

使用索引来提高常见查询的性能。为经常出现在查询中的字段和返回排序结果的所有操作建立索引。`_id`MongoDB 自动在字段上创建唯一索引 。

创建索引时，请考虑索引的以下行为：

- 每个索引至少需要 8 kB 的数据空间。
- 添加索引对写操作有一些负面的性能影响。对于具有高写入读取比率的集合，索引是昂贵的，因为每个插入还必须更新任何索引。
- 具有高读写比的集合通常受益于额外的索引。索引不影响未索引的读取操作。
- 活动时，每个索引都会消耗磁盘空间和内存。这种使用情况可能很重要，应该跟踪容量规划，尤其是考虑到工作集大小。

有关索引以及[分析查询性能](https://www.mongodb.com/docs/manual/tutorial/analyze-query-plan/)的更多信息，请参阅[索引策略](https://www.mongodb.com/docs/manual/applications/indexes/)。此外，MongoDB [数据库分析器](https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/)可能有助于识别低效查询。

**大量收藏**

在某些情况下，您可能会选择将相关信息存储在多个集合中，而不是单个集合中。

考虑一个示例集合`logs`，它存储各种环境和应用程序的日志文档。该`logs`集合包含以下形式的文档：

```json
{ log: "dev", ts: ..., info: ... }
{ log: "debug", ts: ..., info: ...}
```

如果文档总数很少，您可以按类型将文档分组到集合中。对于日志，请考虑维护不同的日志集合，例如`logs_dev`和`logs_debug`。该`logs_dev` 集合将仅包含与开发环境相关的文档。

通常，拥有大量集合不会造成明显的性能损失，并且会产生非常好的性能。不同的集合对于高吞吐量批处理非常重要。

使用具有大量集合的模型时，请考虑以下行为：

- 每个集合都有几千字节的最小开销。
- 每个索引，包括 上的索引`_id`，至少需要 8 kB 的数据空间。
- 对于每个[数据库](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-database)，单个命名空间文件（即 `<database>.ns`）存储该数据库的所有元数据，并且每个索引和集合在命名空间文件中都有自己的条目。有关特定限制，请参阅地方[名称空间长度限制](https://www.mongodb.com/docs/manual/reference/limits/#std-label-limit-namespace-length)。

**集合包含大量小文件**

如果您有一个包含大量小文档的集合，则出于性能原因，您应该考虑嵌入。如果您可以按某种逻辑关系对这些小文档进行分组，*并且*您经常通过这种分组检索文档，则可以考虑将这些小文档“汇总”为包含嵌入式文档数组的较大文档。

将这些小文档“卷起”到逻辑组中意味着检索一组文档的查询涉及顺序读取和更少的随机磁盘访问。此外，“汇总”文档并将公共字段移动到更大的文档有利于这些字段的索引。*公共字段的*副本将更少，相应索引中的关联键条目将更少。有关 [索引](https://www.mongodb.com/docs/manual/indexes/)的更多信息，请参阅索引。

但是，如果您通常只需要检索组内文档的一个子集，那么“汇总”文档可能不会提供更好的性能。此外，如果小型、独立的文档代表数据的自然模型，您应该维护该模型。

**小文档存储优化**

每个 MongoDB 文档都包含一定数量的开销。这种开销通常是微不足道的，但如果所有文档都只有几个字节，就会变得很重要，如果您的集合中的文档只有一个或两个字段，情况可能就是这样。

考虑以下优化这些集合的存储利用率的建议和策略：

- `_id`明确使用该字段。

  MongoDB 客户端自动为每个文档添加一个字段，并为该字段`_id`生成一个唯一的 12 字节的[ObjectId](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-ObjectId)`_id` 。此外，MongoDB 总是索引该`_id`字段。对于较小的文档，这可能会占用大量空间。

  `_id`为了优化存储使用，用户可以在将文档插入集合时明确指定字段的值。此策略允许应用程序将值存储在本`_id`应占用文档另一部分空间的字段中。

  您可以在该字段中存储任何值`_id`，但由于此值用作集合中文档的主键，因此它必须唯一地标识它们。如果该字段的值不是唯一的，那么它不能作为主键，因为在集合中会发生冲突。

- 使用较短的字段名称。

  >[NOTE]
  >
  >缩短字段名称会降低表现力，并且不会为较大的文档和文档开销不是很重要的地方提供相当大的好处。较短的字段名称不会减小索引的大小，因为索引具有预定义的结构。
  >
  >通常，没有必要使用短字段名称。

  MongoDB 存储每个文档中的所有字段名称。对于大多数文档，这只占文档使用空间的一小部分；然而，对于小文档，字段名称可能代表相当大的空间量。考虑一组类似于以下内容的小文档：

  ```json
  { last_name : "Smith", best_score: 3.9 }
  ```

  如果缩短名为`last_name`to的字段和名为的`lname`字段，如下所示，每个文档可以节省 9 个字节。`best_score``score`

  ```json
  { lname : "Smith", score : 3.9 }
  ```

- 嵌入文档。

  在某些情况下，您可能希望将文档嵌入到其他文档中并节省每个文档的开销。看 [集合包含大量小文档。](https://www.mongodb.com/docs/manual/core/data-model-operations/#std-label-faq-developers-embed-documents)

**数据生命周期管理**

数据建模决策应考虑数据生命周期管理。

集合的[生存时间或 TTL 功能](https://www.mongodb.com/docs/manual/tutorial/expire-data/)会在一段时间后使文档过期。如果您的应用程序需要一些数据在数据库中保留一段有限的时间，请考虑使用 TTL 功能。

此外，如果您的应用程序仅使用最近插入的文档，请考虑[Capped Collections](https://www.mongodb.com/docs/manual/core/capped-collections/)。上限集合提供对插入文档*的先进先出*(FIFO) 管理，并有效地支持根据插入顺序插入和读取文档的操作。

参见

原文：[Operational Factors and Data Models](https://www.mongodb.com/docs/manual/core/data-model-operations/)

译者：景圣

