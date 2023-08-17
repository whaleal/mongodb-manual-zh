## 索引

索引支持 MongoDB 中查询的高效执行。如果没有索引，MongoDB 必须扫描集合中的每个文档才能返回查询结果。如果查询存在适当的索引，MongoDB 会使用该索引来限制必须扫描的文档数量。

虽然索引可以提高查询性能，但添加索引会对写入操作的性能产生负面影响。对于具有高写入读取比率的集合，索引的成本很高，因为每次插入还必须更新任何索引。

### 用例

如果您的应用程序在相同字段上重复运行查询，您可以在这些字段上创建索引以提高性能。例如，考虑以下场景：

| 设想                                                         | 指数类型                                                     |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| 人力资源部门经常需要通过员工 ID 查找员工。您可以在员工ID字段上创建索引以提高查询性能。 | [单字段索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-single/#std-label-indexes-single-field) |
| 销售人员经常需要按位置查找客户信息。位置存储在带有`state`、`city`和 等字段的嵌入对象中`zipcode`。您可以在整个对象上创建索引`location`，以提高对该对象中任何字段的查询性能。 | 对象上的[单字段索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-single/#std-label-indexes-single-field) |
| 杂货店经理经常需要按名称和数量查找库存物品，以确定哪些物品库存不足。`item`您可以在和字段上创建单个索引`quantity` 以提高查询性能。 | [复合索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound) |

### 开始使用

要了解如何使用索引执行常见任务，请参阅以下页面：

- [创建索引](https://www.mongodb.com/docs/v7.0/core/indexes/create-index/#std-label-manual-create-an-index)
- [创建复合索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/create-compound-index/#std-label-index-create-compound)
- [在数组字段上创建索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/create-multikey-index-basic/#std-label-index-create-multikey-basic)
- [创建索引以支持地理空间查询](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-geospatial/#std-label-geospatial-index)

### 细节

索引是一种特殊的数据结构，它以易于遍历的形式存储集合数据集的一小部分。MongoDB 索引使用 [B树](https://en.wikipedia.org/wiki/B-tree)数据结构。

索引存储特定字段或字段集的值，按字段值排序。索引条目的排序支持高效的相等匹配和基于范围的查询操作。此外，MongoDB 可以使用索引中的排序返回排序结果。

#### 限制

某些限制适用于索引，例如索引键的长度或每个集合的索引数量。有关详细信息，请参阅 [索引限制。](https://www.mongodb.com/docs/v7.0/reference/limits/#std-label-index-limitations)

#### 默认索引

MongoDB在创建集合期间在 [_id](https://www.mongodb.com/docs/v7.0/core/document/#std-label-document-id-field)字段上创建[唯一索引。](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)该索引可防止客户端插入两个具有相同字段值的文档。您不能删除该索引。`_id``_id`

> 笔记:
>
> 在[分片集群](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-sharded-cluster)中，如果您*不*使用`_id`字段作为[分片键](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-shard-key)，那么您的应用程序 **必须**确保字段中值的唯一性`_id`。[您可以通过使用具有自动生成的ObjectId 的](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-ObjectId)字段来执行此操作[。](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-ObjectId)

#### 索引名称

索引的默认名称是索引键和索引中每个键的方向（`1`或`-1`）的串联，使用下划线作为分隔符。例如，创建的索引的`{ item : 1, quantity: -1 }`名称为`item_1_quantity_-1`。

索引一旦创建就无法重命名。相反，您必须 [删除](https://www.mongodb.com/docs/v7.0/core/indexes/drop-index/#std-label-drop-an-index)索引并使用新名称重新创建索引。

要了解如何指定索引名称，请参阅[指定索引名称。](https://www.mongodb.com/docs/v7.0/core/indexes/create-index/specify-index-name/#std-label-specify-index-name)

#### 索引构建性能

应用程序在索引构建期间可能会遇到性能下降的情况，包括对集合的读/写访问受到限制。有关索引构建过程的更多信息，请参阅[填充集合上的索引构建](https://www.mongodb.com/docs/v7.0/core/index-creation/#std-label-index-operations)，包括[复制环境中的索引构建](https://www.mongodb.com/docs/v7.0/core/index-creation/#std-label-index-operations-replicated-build)部分。

### 了解更多

- MongoDB 提供了许多不同的索引类型来支持特定类型的数据和查询。要了解更多信息，请参阅[索引类型。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/#std-label-index-types)
- 要了解可以在索引中指定哪些属性和行为，请参阅[索引属性。](https://www.mongodb.com/docs/v7.0/core/indexes/index-properties/#std-label-index-properties)
- 要了解创建索引时可能需要考虑的事项，请参阅[索引策略。](https://www.mongodb.com/docs/v7.0/applications/indexes/#std-label-manual-indexing-strategies)
- 要了解索引对性能的影响，请参阅 [操作因素和数据模型。](https://www.mongodb.com/docs/v7.0/core/data-model-operations/#std-label-data-model-indexes)
