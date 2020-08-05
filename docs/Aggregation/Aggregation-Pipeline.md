# [ ](#)聚合管道
[]()

在本页面

*   [管道](#pipeline)
*   [管道表达式](#pipeline-expressions)
*   [聚合管道行为](#aggregation-pipeline-behavior)
*   [注意事项 ](#considerations)

聚合管道是用于数据聚合的 framework，其模型基于数据处理流水线的概念。文档进入 multi-stage 管道，将文档转换为聚合结果。

<iframe 
    height=450 
    width=800 
    src="../../img/docs/Aggregation/agg-pipeline.mp4" 
    frameborder=0 
    allowfullscreen>
</iframe>

在这个例子中

```
db.orders.aggregate([
    { $match: { status: "A" } },
    { $group: { _id: "$cust_id", total: { $sum: "$amount" } } }
])
```

**第一阶段**：该[`$match`]()阶段按`status`字段过滤文档，并将`status`等于的文档传递到下一阶段`"A"`。

**第二阶段**：该[`$group`]()阶段按`cust_id`字段将文档分组，以计算每个唯一值的总和`cust_id`。

[]()

[]()

## <span id="pipeline">管道</span>

MongoDB 聚合管道由[阶段](../Reference/Operators/Aggregation-Pipeline-Stages.md)组成。每个阶段在文档通过管道时转换文档。管道阶段不需要为每个输入文档生成一个输出文档; 如：某些阶段可能会生成新文档或过滤掉文档。管道阶段可以在管道中多次出现。

MongoDB 在[mongo](../docs/Reference/MongoDB-Package-Components/mongo.md) shell 中提供[db.collection.aggregate()](../Reference/mongo-Shell-Methods/Collection-Methods/db-collection-aggregate.md)方法，在聚合管道中提供[聚合](../docs/Reference/Database-Commands/Aggregation-Commands.md)命令。有关可用阶段，请参阅[聚合管道阶段](../Reference/Operators/Aggregation-Pipeline-Stages.md)。

对于聚合管道的 example 用法，请考虑[使用用户首选项数据进行聚合](Aggregation-Pipeline/Example-with-User-Preference-Data.md)和[使用 Zip Code 数据集进行聚合](Aggregation-Pipeline/Example-with-ZIP-Code-Data.md)。

从MongoDB 4.2开始，您可以使用聚合管道在以下位置进行更新：

| 命令                | Mongoshall方法                                               |
| ------------------- | ------------------------------------------------------------ |
| [`findAndModify`]() | [db.collection.findOneAndUpdate（）]()<br />[db.collection.findAndModify（）]() |
| [`pdate`]()         | [db.collection.updateOne（）]()<br />[db.collection.updateMany（）]()<br />[db.collection.update（）]()<br /><br />[Bulk.find.update（）]()<br />[Bulk.find.updateOne（）]()<br />[Bulk.find.upsert（）]() |

> **也可以看看**<br />
> [聚合管道更新]()

[]()

[]()

## <span id="pipeline-expressions">管道表达式</span>

某些管道阶段将管道表达式作为操作数。管道表达式指定要应用于输入文档的转换。表达式具有[文档](../Introduction-to-MongoDB/Documents.md)结构，可以包含其他[表达式](Aggregation-Reference/Aggregation-Pipeline-Quick-Reference.md)。

管道表达式只能对管道中的当前文档进行操作，并且不能引用其他文档中的数据：表达式操作提供文档的 in-memory 转换。

通常，表达式是 stateless，只有在聚合 process 看到一个 exception：[累加器](Aggregation-Reference/Aggregation-Pipeline-Quick-Reference.md)表达式时才会计算。

在文档通过管道进行时，在[$group]()阶段中使用的累加器将保持其 state(如： 总计，最大值，最小值和相关数据)。

更改 version 3.2：[$project]()阶段有一些累加器可用;但是，在[$project]()阶段使用时，累加器不会跨文档维护 state。

有关表达式的更多信息，请参阅[表达式](Aggregation-Reference/Aggregation-Pipeline-Quick-Reference.md)。

[]()

[]()

## <span id="aggregation-pipeline-behavior">聚合管道行为</span>

在 MongoDB 中，[管道]()命令在单个集合上运行，从逻辑上将整个集合传递到聚合管道。要尽可能优化操作，请使用以下策略以避免扫描整个集合。

[]()

[]()

### 管道运算符和索引

MongoDB的[query planner]()分析聚合管道，以确定是否 可以使用[索引](https://docs.mongodb.com/manual/indexes/#indexes)来改善管道性能。例如，以下管道阶段可以利用索引：

> **注意**<br />
> 以下管道阶段并不代表可以使用索引的所有阶段的完整列表。

* **$match**

  如果[`$match`]()阶段出现在管道的开始，阶段可以使用索引来过滤文档。

* **$sort**

  该[`$sort`]()阶段可以使用索引，只要它不是由前面[`$project`]()，[`$unwind`]()或 [`$group`]()阶段。

* **$group**

  该[`$group`]()阶段有时可以使用的索引来查找每一个组中的第一文档，如果所有的满足下列条件：

  * 该[`$group`]()阶段之前是一个[`$sort`]() 阶段，该阶段对字段进行分组
  * 在分组的字段上有一个索引，它与排序顺序匹配
  * 该[`$group`]()阶段中使用的唯一累加器是 [`$first`]()

* **$geoNear**

  该[`$geoNear`]()管道运算符需要一个地理空间索引的优势。使用时[`$geoNear`]()， [`$geoNear`]()管道操作必须出现在聚合管道的第一阶段。

> 在版本3.2中进行了更改：从MongoDB 3.2开始，索引可以覆盖聚合管道。在MongoDB 2.6和3.0中，索引无法覆盖聚合管道，因为即使管道使用索引，聚合仍需要访问实际文档。

[]()

### []()早期过滤

如果聚合操作仅需要集合中的数据子集，请使用[$match]()，[$limit]()和[$skip]()阶段来限制在管道开头输入的文档。当放置在管道的开头时，[$match]()操作使用合适的索引来仅扫描集合中的匹配文档。

在管道的开头放置[$match](reference-operator-aggregation-match.html#pipe._S_match)管道阶段后跟[$sort](reference-operator-aggregation-sort.html#pipe._S_sort)阶段在逻辑上等同于具有排序的单个查询并且可以使用索引。如果可能，将[$match](reference-operator-aggregation-match.html#pipe._S_match) operators 放在管道的开头。

[]()

### 附加功能
止于4.0版本

聚合管道具有内部优化阶段，为 operators 的某些序列提供改进的 performance。有关详细信息，请参阅[聚合管道优化](Aggregation-Pipeline/Aggregation-Pipeline-Optimization.md)。

聚合管道支持对分片集合的操作。见[聚合管道和分片集合](Aggregation-Pipeline/Aggregation-Pipeline-and-Sharded-Collections.md)。

*   [聚合管道优化](Aggregation-Pipeline/Aggregation-Pipeline-Optimization.md)

*   [聚合管道限制](Aggregation-Pipeline/Aggregation-Pipeline-Limits.md)

*   [聚合管道和分片集合](Aggregation-Pipeline/Aggregation-Pipeline-and-Sharded-Collections.md)

*   [使用 Zip Code 数据集进行聚合](Aggregation-Pipeline/Example-with-ZIP-Code-Data.md)

*   [Example with User Preference Data](Aggregation-Pipeline/Example-with-User-Preference-Data.md)

## <span id="considerations">注意事项</span>
始于4.0版本

### 分片集合
聚合管道支持对分片集合的操作。请参阅聚合管道和分片集合。  
### 聚合管道与Map-Reduce的比较
聚合管道比Map-Reduce提供更好的性能和更一致的接口。可以使用聚合管道运算符（例如$ group，$ merge等）来重写各种map-reduce操作。对于需要自定义功能的map-reduce操作，MongoDB从版本4.4开始提供$ accumulator和$ function聚合运算符。这些运算符使用户能够在JavaScript中定义自定义聚合表达式。有关详细信息，请参见Map-Reduce示例。
### 限制
聚合管道对值类型和结果大小有一些限制。有关聚合管道的限制和限制的详细信息，请参见聚合管道限制。管道优化聚合管道具有内部优化阶段，可为某些操作员序列提供改进的性能。有关详细信息，请参阅聚合管道优化。
