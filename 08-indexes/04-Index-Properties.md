## 索引属性

索引属性影响查询计划程序如何使用索引以及索引文档的存储方式。创建索引时，您可以将索引属性指定为可选参数。

以下部分介绍了您在构建索引时可以指定的索引属性。

> 笔记:
>
> 并非所有索引类型都与所有索引属性兼容。

### 不区分大小写的索引

[不区分大小写的索引](https://www.mongodb.com/docs/v7.0/core/index-case-insensitive/#std-label-index-feature-case-insensitive)支持对字符串的查询，而不考虑字母大小写。

### 隐藏索引

[隐藏索引对](https://www.mongodb.com/docs/v7.0/core/index-hidden/#std-label-index-type-hidden)[查询计划程序](https://www.mongodb.com/docs/v7.0/core/query-plans/#std-label-query-plans-query-optimization)不可见 ，并且不能用于支持查询。

您可以使用隐藏索引来评估删除索引的潜在影响，而无需实际删除它。如果影响是负面的，您可以取消隐藏索引，而不必重新创建已删除的索引。隐藏索引得到完全维护，一旦取消隐藏即可立即使用。

### 部分索引

[部分索引](https://www.mongodb.com/docs/v7.0/core/index-partial/#std-label-index-type-partial)仅对集合中满足指定过滤表达式的文档进行索引。部分索引的存储要求较低，并降低了索引创建和维护的性能成本。

部分索引提供了稀疏索引功能的超集，并且应该优于稀疏索引。

### 稀疏索引

[稀疏索引](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-index-type-sparse)仅包含具有索引字段的文档的条目。这些索引会跳过没有索引字段的文档。

### TTL索引

[TTL 索引](https://www.mongodb.com/docs/v7.0/core/index-ttl/#std-label-index-feature-ttl)会在一段时间后自动从集合中删除文档。将这些索引用于仅需要保留有限时间的数据，例如机器生成的事件数据、日志和会话信息。

### 唯一索引

[唯一索引](https://www.mongodb.com/docs/v7.0/core/index-unique/#std-label-index-type-unique)导致 MongoDB 拒绝索引字段的重复值。当您的文档包含唯一标识符（例如`userId`.