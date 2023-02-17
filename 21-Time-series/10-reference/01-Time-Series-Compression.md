# 时间序列压缩 

本页介绍 MongoDB 如何压缩时间序列集合中的数据，以及如何优化压缩。

## 默认压缩算法[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-compression/#default-compression-algorithm)

时间序列集合使用[zstd](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-zstd)压缩，这与全局默认压缩算法[snappy不同。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-snappy)

## 列压缩[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-compression/#column-compression)

从 MongoDB 5.2 开始，时间序列集合使用**列压缩**。列压缩增加了许多创新，这些创新协同工作可显着改进实际压缩、减少数据在磁盘上的整体存储并提高读取性能。

这些增强功能进一步减少了使用压缩时磁盘上的数据大小`zstd`，并且还显着减少了 WiredTiger 缓存中使用的空间。

引入的压缩类型有：

- 增量编码
- 对象压缩
- 数组压缩（从 MongoDB 6.0 开始）
- 运行长度编码 (RLE)

### 增量编码（增量压缩）[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-compression/#delta-encoding--delta-compression-)

增量编码利用时间序列集合中具有时间序列特征的数据。Delta Encoding 不是存储绝对值，而是假设测量值不会在彼此之间快速变化。这种方法通过仅存储测量值之间的差异来减少所需的信息量。

### 增量编码增量（增量压缩增量）[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-compression/#delta-of-delta-encoding--delta-of-delta-compression-)

对于单调递增的数据，Delta Encoding 的 Delta 可以通过计算 delta 本身的 delta 来进一步最小化存储数的大小。

### 对象和数组压缩[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-compression/#object-and-array-compression)

列压缩可确保如果您在文档中使用对象和数组，那么如果这些嵌入字段存在于文档的根级别，您将获得相同的压缩优势。

## 学到更多[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-compression/#learn-more)

要了解如何优化压缩，请参阅 [优化压缩。](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-best-practices/#std-label-tsc-best-practice-optimize-compression)

←  [时间序列集合参考](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-reference/)   [时间序列收集限制](https://www.mongodb.com/docs/manual/core/timeseries/timeseries-limitations/) →

原文链接 -https://www.mongodb.com/docs/manual/core/timeseries/timeseries-compression/

译者：陆文龙