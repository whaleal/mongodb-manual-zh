# [ ](#)聚合命令比较

以下表格简要概述了 MongoDB 聚合命令的特点。

|              | [Aggregate]() / [db.collection.aggregate()]()                | [MapReduce]() / [db.collection.mapReduce()]()                |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **描述**     | 旨在提高聚合任务的性能和可用性的具体目标。 <br/>使用“管道”方法，其中 objects 在通过一系列管道操作符(如[$group]()，[$match]()和[$sort]())时进行转换。 <br/>有关管道 operators 的更多信息，请参见[聚合管道操作符](../../docs/Reference/Operators/Aggregation-Pipline-Operators.md)。 | 实现 Map-Reduce 聚合以处理大型数据集。                       |
| **主要特点** | 可以根据需要重复管道操作符。 <br/> Pipeline operators 不需要为每个输入文档生成一个输出文档。 <br/>还可以生成新文档或过滤掉文档。 | 除了分组操作之外，还可以执行复杂的聚合任务以及对不断增长的数据集执行增量聚合。 <br/>见[Map-Reduce 例子]()和[执行增量 Map-Reduce]()。 |
| **灵活性**   | 仅限于聚合管道支持的 operators 和表达式。 <br/>但是，可以使用[$project]() pipeline operator 添加计算字段，创建新虚拟 sub-objects，并将 sub-fields 提取到 top-level 结果中。 <br/>有关更多信息，请参阅[$project]()以及有关所有可用管道操作符的更多信息[聚合管道操作员](../../docs/Reference/Operators/Aggregation-Pipline-Operators.md)。 | 自定义`map`，`reduce`和`finalize` JavaScript 函数为聚合逻辑提供了灵活性。 <br/>有关功能的详细信息和限制，请参阅[MapReduce]()。 |
| **输出结果** | 将结果作为游标返回。如果管道包含[$out]()阶段，则游标为空。 <br/>在 version 3.6 中更改：MongoDB 3.6 删除了使用[aggregate]()命令**而没有** `cursor`选项，除非该命令包含`explain`选项。除非包含`explain`选项，否则必须指定游标选项。 <br/>要指示具有默认批处理大小的游标，请指定`cursor: {}`。 <br/>要指示 non-default 批量大小的光标，请使用`cursor: { batchSize: <num> }`。 | 返回各种选项的结果(内联，新集合，合并，替换，减少)。有关输出选项的详细信息，请参阅[MapReduce]()。 |
| **分片**     | 支持 non-sharded 和分片输入集合。                            | 支持 non-sharded 和分片输入集合。                            |
| **更多信息** | [聚合管道](../Aggregation-Pipline.md)<br/>[db.collection.aggregate()]()<br/>[Aggregate]() | [Map-Reduce](../Map-Reduce.md)<br/>[db.collection.mapReduce()]()<br/>[MapReduce](). |



译者：李冠飞

校对：李冠飞