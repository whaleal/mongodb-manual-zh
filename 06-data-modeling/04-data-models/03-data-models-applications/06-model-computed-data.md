**模型计算数据**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-computed-data/#model-computed-data)

**概述**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-computed-data/#overview)

通常，应用程序需要从存储在数据库中的源数据中获取值。计算新值可能需要大量 CPU 资源，尤其是在大型数据集或必须检查多个文档的情况下。

如果经常请求计算值，提前将该值保存在数据库中会更有效。这样，当应用程序请求数据时，只需要一次读取操作。

**计算模式**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-computed-data/#computed-pattern)

如果您的读取数量明显超过写入数量，则计算模式会降低必须执行计算的频率。应用程序不会将计算负担附加到每次读取，而是存储计算值并根据需要重新计算。应用程序可以在每次写入更改计算值的源数据时重新计算该值，或者作为定期作业的一部分。

>[NOTE]
>
>通过定期更新，不能保证计算值在任何给定读取中都是准确的。但是，如果不需要精确度，这种方法可能值得提高性能。

**例子**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-computed-data/#example)

一个应用程序显示电影观众和收入信息。

考虑以下`screenings`集合：

```json
// screenings collection

{
    "theater": "Alger Cinema",
    "location": "Lakeview, OR",
    "movie_title": "Reservoir Dogs",
    "num_viewers": 344,
    "revenue": 3440
}
{
    "theater": "City Cinema",
    "location": "New York, NY",
    "movie_title": "Reservoir Dogs",
    "num_viewers": 1496,
    "revenue": 22440
}
{
    "theater": "Overland Park Cinema",
    "location": "Boise, ID",
    "movie_title": "Reservoir Dogs",
    "num_viewers": 760,
    "revenue": 7600
}
```

用户通常想知道有多少人看过某部电影以及这部电影赚了多少钱。在此示例中，对于 total`num_viewers` 和`revenue`，您必须对放映标题为“落水狗”的电影的剧院执行读取操作，并对这些字段的值求和。为了避免每次请求信息时都执行该计算，您可以计算总值并将它们 `movies`与电影记录本身一起存储在一个集合中：

```json
// movies collection

{
    "title": "Reservoir Dogs",
    "total_viewers": 2600,
    "total_revenue": 33480,
    ...
}
```

在低写入环境中，计算可以与`screenings`数据的任何更新结合进行。

在具有更多定期写入的环境中，可以按定义的时间间隔进行计算 - 例如每小时一次。中的源数据 `screenings`不受写入`movies`集合的影响，因此您可以随时运行计算。

这是一种常见的设计模式，可减少 CPU 工作负载并提高应用程序性能。每当您重复执行相同的计算并且具有高读写比时，请考虑计算模式。

**其他示例用例**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-computed-data/#other-sample-use-cases)

除了频繁请求求和的情况，例如在电影数据库示例中获取总收入或观众，计算模式非常适合需要对数据运行计算的任何地方。例如：

- 一家汽车公司对车辆数据运行大量聚合查询，存储结果以在接下来的几个小时内显示，直到重新计算数据。
- 一家消费者报告公司，它从几个不同的来源编译数据，以创建排名排序的列表，如“100 个最受好评的小工具”。列表可以定期重新生成，同时基础数据独立更新。

 参见

原文 - [Model Computed Data]( https://docs.mongodb.com/manual/tutorial/model-computed-data/ )

译者：景圣
