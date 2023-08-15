## 索引策略

最适合您的应用程序的索引必须考虑许多因素，包括您期望的查询类型、读取与写入的比率以及系统上的可用内存量。

在开发索引策略时，您应该深入了解应用程序的查询。在构建索引之前，请规划出要运行的查询类型，以便可以构建引用这些字段的索引。索引会带来性能成本，但对于大型数据集的频繁查询来说，这是值得的。考虑应用程序中每个查询的相对频率以及查询是否证明索引合理。

设计索引的最佳总体策略是使用与您将在生产中运行的数据集类似的数据集来分析各种索引配置，以了解哪些配置性能最佳。检查为您的集合创建的当前索引，以确保它们支持您当前和计划的查询。如果不再使用某个索引，请删除该索引。

一般来说，MongoDB只使用*一个*索引来完成大多数查询。但是，[`$or`](https://www.mongodb.com/docs/v7.0/reference/operator/query/or/#mongodb-query-op.-or)查询的每个子句可以使用不同的索引。

以下文档介绍了索引策略：

[使用 ESR（相等、排序、范围）规则](https://www.mongodb.com/docs/v7.0/tutorial/equality-sort-range-rule/#std-label-esr-indexing-rule)

ESR（相等、排序、范围）规则是创建高效支持查询的索引的指南。

[创建索引来支持您的查询](https://www.mongodb.com/docs/v7.0/tutorial/create-indexes-to-support-queries/#std-label-create-indexes-to-support-queries)

当索引包含查询扫描的所有字段时，索引支持查询。创建支持查询的索引可以大大提高查询性能。

[使用索引对查询结果进行排序](https://www.mongodb.com/docs/v7.0/tutorial/sort-results-with-indexes/#std-label-sorting-with-indexes)

为了支持高效查询，请在指定索引字段的顺序和排序顺序时使用此处的策略。

[确保索引适合 RAM](https://www.mongodb.com/docs/v7.0/tutorial/ensure-indexes-fit-ram/#std-label-indexes-ensure-indexes-fit-ram)

当您的索引适合 RAM 时，系统可以避免从磁盘读取索引，并且您可以获得最快的处理速度。

[创建确保选择性的查询](https://www.mongodb.com/docs/v7.0/tutorial/create-queries-that-ensure-selectivity/#std-label-index-selectivity)

选择性是查询使用索引缩小结果范围的能力。选择性允许 MongoDB 使用索引来完成与完成查询相关的大部分工作。

