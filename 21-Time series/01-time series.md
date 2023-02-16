# 时间序列[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries-collections/#time-series)

时间序列数据是一系列数据点，通过分析随时间的变化获得洞察力。

时间序列数据通常由以下部分组成：

- 记录数据点的**时间。**
- **元数据**（有时称为源），是唯一标识系列且很少更改的标签或标签。
- **度量**（有时称为指标或值），它们是按时间增量跟踪的数据点。通常这些是随时间变化的键值对。

下表显示了时间序列数据的示例：

| **例子** | **测量** | **元数据**         |
| :------- | :------- | :----------------- |
| 库存数据 | 股票价格 | 股票代码、交易所   |
| 天气数据 | 温度     | 传感器标识符、位置 |
| 网站访客 | 查看次数 | 网址               |

为了高效的时序数据存储，MongoDB 提供了时序集合。



## 时间序列集合[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries-collections/#time-series-collections)

*5.0新版本*。

时间序列集合有效地存储时间序列数据。在时间序列集合中，写入是有组织的，因此来自同一源的数据与来自相似时间点的其他数据点一起存储。

### 好处[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries-collections/#benefits)

与普通集合相比，将时序数据存储在时序集合中可以提高查询效率，减少时序数据和[二级索引的磁盘占用。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary-index)

时间序列集合使用底层的列式存储格式，并使用自动创建的[聚集索引](https://www.mongodb.com/docs/manual/core/clustered-collections/#std-label-clustered-collections)按时间顺序存储数据。列式存储格式具有以下优点：

- 降低处理时间序列数据的复杂性
- 提高查询效率
- 减少磁盘使用
- 减少读取操作的 I/O
- 增加 WiredTiger 缓存使用



### 行为[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries-collections/#behavior)

时间序列集合的行为类似于普通集合。您可以像往常一样插入和查询数据。

MongoDB 将时间序列集合视为由内部集合支持的可写非物化 [视图。](https://www.mongodb.com/docs/manual/core/views/#std-label-views-landing-page)当您插入数据时，内部集合会自动将时间序列数据组织成优化的存储格式。

当您查询时间序列集合时，您对每个测量操作一个文档。对时间序列集合的查询利用优化的内部存储格式并更快地返回结果。



## IMPORTANT

### 向后不兼容的特性

您必须在降级之前删除时间序列集合：

- MongoDB 6.0 或更高版本到 MongoDB 5.0.7 或更早版本。
- MongoDB 5.3 到 MongoDB 5.0.5 或更早版本。

#### 内部索引[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries-collections/#internal-index)

当您创建时间序列集合时，MongoDB 会自动在时间字段上创建一个内部[聚集索引](https://www.mongodb.com/docs/manual/core/clustered-collections/#std-label-clustered-collections)。内部索引提供了多项性能优势，包括提高查询效率和减少磁盘使用。要了解有关聚簇索引的性能优势的更多信息，请参阅 [聚簇集合](https://www.mongodb.com/docs/manual/core/clustered-collections/#std-label-clustered-collections)。

不显示时间序列集合的内部索引 [`listIndexes`](https://www.mongodb.com/docs/manual/reference/command/listIndexes/#mongodb-dbcommand-dbcmd.listIndexes)。



## TIP

为了提高查询性能，您可以在测量字段或时间序列集合中的任何字段上手动[添加二级索引。](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-secondary-index/#std-label-timeseries-add-secondary-index)

## 开始[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries-collections/#get-started)

要开始使用时间序列集合，请参阅 [创建和查询时间序列集合。](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-procedures/#std-label-timeseries-create-query-procedures)

←  [`update`事件](https://www.mongodb.com/docs/manual/reference/change-events/update/)   [创建和查询时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-procedures/) →

原文链接 -https://www.mongodb.com/docs/manual/core/timeseries-collections/

译者：陆文龙