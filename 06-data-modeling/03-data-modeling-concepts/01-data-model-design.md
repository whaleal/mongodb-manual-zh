**数据模型设计**

有效的数据模型支持您的应用程序需求。文档结构的关键考虑因素是决定 [嵌入](https://www.mongodb.com/docs/manual/core/data-model-design/#std-label-data-modeling-embedding)或者[使用参考资料。](https://www.mongodb.com/docs/manual/core/data-model-design/#std-label-data-modeling-referencing)

**嵌入式数据模型**

使用 MongoDB，您可以将相关数据嵌入到单个结构或文档中。这些模式通常被称为“非规范化”模型，并利用了 MongoDB 的丰富文档。考虑下图：

![具有包含所有相关信息的嵌入式字段的数据模型。](https://www.mongodb.com/docs/manual/images/data-model-denormalized.bakedsvg.svg)

嵌入式数据模型允许应用程序将相关的信息片段存储在同一数据库记录中。因此，应用程序可能需要发出更少的查询和更新来完成常见操作。

通常，在以下情况下使用嵌入式数据模型：

- 您在实体之间具有“包含”关系。请参阅 [为嵌入文档建立一对一关系模型。](https://www.mongodb.com/docs/manual/tutorial/model-embedded-one-to-one-relationships-between-documents/#std-label-data-modeling-example-one-to-one)
- 您在实体之间具有一对多关系。在这些关系中，“许多”或子文档总是与“一个”或父文档一起出现或在“一个”或父文档的上下文中查看。请参阅 [使用嵌入式文档建模一对多关系。](https://www.mongodb.com/docs/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/#std-label-data-modeling-example-one-to-many)

通常，嵌入为读取操作提供了更好的性能，以及在单个数据库操作中请求和检索相关数据的能力。嵌入式数据模型使得在单个原子写入操作中更新相关数据成为可能。

要访问嵌入文档中的数据，请使用[点符号](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-dot-notation)“进入”嵌入文档。有关访问数组和嵌入式文档中的数据的更多示例，请参阅[查询数组中的数据](https://www.mongodb.com/docs/manual/tutorial/query-arrays/#std-label-read-operations-arrays)和[查询嵌入式文档中的数据。](https://www.mongodb.com/docs/manual/tutorial/query-embedded-documents/#std-label-read-operations-embedded-documents)

**嵌入式数据模型和文档大小限制**

MongoDB 中的文档必须小于[最大 BSON 文档大小。](https://www.mongodb.com/docs/manual/reference/limits/#mongodb-limit-BSON-Document-Size)

对于批量二进制数据，请考虑[GridFS 。](https://www.mongodb.com/docs/manual/core/gridfs/)

**规范化数据模型**

规范化数据模型使用文档之间的[引用](https://www.mongodb.com/docs/manual/reference/database-references/)来描述关系。

![使用引用链接文档的数据模型。 ``contact`` 文档和``access`` 文档都包含对``user`` 文档的引用。](https://www.mongodb.com/docs/manual/images/data-model-normalized.bakedsvg.svg)

通常，使用规范化数据模型：

- 嵌入会导致数据重复，但不会提供足够的读取性能优势来抵消重复的影响。
- 来表示更复杂的多对多关系。
- 对大型分层数据集进行建模。

为了加入集合，MongoDB 提供了聚合阶段：

- [`$lookup`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup)（从 MongoDB 3.2 开始可用）
- [`$graphLookup`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/graphLookup/#mongodb-pipeline-pipe.-graphLookup)（从 MongoDB 3.4 开始可用）

MongoDB 还提供引用以跨集合连接数据。

有关规范化数据模型的示例，请参阅 [使用文档引用对一对多关系建模。](https://www.mongodb.com/docs/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/#std-label-data-modeling-publisher-and-books)

有关各种树模型的示例，请参阅 [模型树结构。](https://www.mongodb.com/docs/manual/applications/data-models-tree-structures/)

**进一步阅读**

有关使用 MongoDB 进行数据建模的更多信息，请下载 [MongoDB 应用程序现代化指南](https://www.mongodb.com/modernize?tck=docs_server).

下载包括以下资源：

- 介绍使用 MongoDB 进行数据建模的方法
- [涵盖从RDBMS](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-RDBMS)数据模型迁移到 MongoDB 的最佳实践和注意事项的白皮书
- 参考 MongoDB 模式及其 RDBMS 等效项
- 应用程序现代化记分卡

参见

原文 [Data Model Design](https://www.mongodb.com/docs/manual/core/data-model-design/)

译者：景圣

