# [ ](#)Map-Reduce

[]()

在本页面

*   [Map-Reduce JavaScript 函数](#map-reduce-javascript-functions)

*   [Map-Reduce 行为](#map-reduce-results)

Map-reduce 是一种数据处理范例，用于将大量数据压缩为有用的汇总结果。对于 map-reduce 操作，MongoDB 提供[MapReduce]()数据库命令。

> **注意**<br />
> 从4.2版开始，MongoDB弃用：
>
> - 地图-reduce选项来*创建*一个新的分片集合以及使用的[分片]()供选择的map-reduce。要输出到分片集合，请首先创建分片集合。MongoDB 4.2还不建议替换现有分片集合。
> - [nonAtomic：false]()选项的显式规范。

考虑以下 map-reduce 操作：

![带注释的 map-reduce 操作图。](https://docs.mongodb.com/manual/_images/map-reduce.bakedsvg.svg)

在此 map-reduce 操作中，MongoDB 将 map 阶段应用于每个输入文档(即：集合中与查询条件匹配的文档)。 map function 会发出 key-value 对。对于具有多个值的密钥，MongoDB 应用 reduce 阶段，该阶段收集并压缩聚合数据。 MongoDB 然后 store 存储集合中的结果。可选地，reduce function 的输出可以通过 finalize function 以进一步压缩或处理聚合的结果。

MongoDB 中的所有 map-reduce 函数都是process 中的 JavaScript 和 run。 Map-reduce 操作将单个[采集]()的文档作为输入，并且可以在开始 map 阶段之前执行任意排序和限制。 [MapReduce]()可以操作的结果作为文档返回，或者可以将结果写入集合。输入和输出集合可以分片。

> **注意**<br />
> 对于大多数聚合操作，[聚合管道](Aggregation-Pipeline.md)提供更好的 performance 和更一致的接口。但是，map-reduce 操作提供了一些在聚合管道中目前不可用的灵活性。

[]()

## <span id="map-reduce-javascript-functions">Map-Reduce JavaScript 函数</span>

在 MongoDB 中，map-reduce 操作使用自定义 JavaScript 函数将值映射或关联到 key。如果 key 有多个值映射到它，则操作会将 key 的值减少为单个 object。

自定义 JavaScript 函数的使用为 map-reduce 操作提供了灵活性。例如，在处理文档时，map function 可以创建多个 key 和 value 映射或不创建映射。 Map-reduce 操作还可以使用自定义 JavaScript function 对 map 末尾的结果进行最终修改并减少操作，例如执行其他计算。

在4.2.1版本开始，MongoDB的不赞成使用范围（即使用JavaScript的[BSON类型15]()）的 `map`，`reduce`和`finalize`功能。要确定变量的范围，请改用`scope`参数。

[]()

## <span id="map-reduce-results">Map-Reduce 行为</span>

在 MongoDB 中，map-reduce 操作可以将结果写入集合或 return 结果内联。如果将 map-reduce 输出写入集合，则可以对同一输入集合执行后续 map-reduce 操作，这些集合将替换，合并或减少新结果与先前结果合并。有关详细信息和示例，请参阅[MapReduce]()和[执行增量 Map-Reduce]()。

在内联返回 map-reduce 操作的结果时，结果文档必须在[BSON 文件大小]()限制范围内，当前为 16 兆字节。有关 map-reduce 操作的限制和限制的其他信息，请参阅[MapReduce]() reference 页面。

### 分片集合

MongoDB 支持[分片集合]()上的 map-reduce 操作。

但是，从版本4.2开始，MongoDB弃用map-reduce选项以*创建*新的分片集合，并将该 `sharded`选项用于map-reduce。要输出到分片集合，请首先创建分片集合。MongoDB 4.2还不建议替换现有分片集合。

见[Map-Reduce 和 Sharded Collections](Map-Reduce/Map-Reduce-and-Sharded-Collections.md)。

### 视图

[视图]()不支持 map-reduce 操作。

