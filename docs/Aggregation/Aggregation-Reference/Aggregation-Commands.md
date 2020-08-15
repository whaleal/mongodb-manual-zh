# [ ](#)聚合命令

[]()

在本页面

*   [聚合命令](#id1)

*   [聚合方法](#aggregation-methods)
> **注意**
>
> 有关特定 operator 的详细信息，包括语法和示例，请单击特定的 operator 以转到其 reference 页面。

[]()

## <span id="id1">聚合命令</span>

| 名称          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| [Aggregate]() | 使用聚合 framework 执行，例如 group。                        |
| [count]()     | 计算集合或视图中的文档数。                                   |
| [distinct]()  | 显示在集合或视图中为指定 key 找到的不同值。                  |
| [MapReduce]() | 对大型数据集执行[map-reduce](../Map-Reduce.md)聚合。         |

[]()

## <span id="aggregation-methods">聚合方法</span>

| 名称                                                         | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [db.collection.aggregate()](../../Reference/mongo-Shell-Methods/Collection-Methods/db-collection-aggregate.md) | 提供对[聚合管道](../Aggregation-Pipeline.md)的访问。         |
| [db.collection.group()](../../docs/Reference/mongo-Shell-Methods/Collection-Methods/db-collection-group.md) | 已过时。按指定的 key 对集合中的文档进行分组，并执行简单聚合。 |
| [db.collection.mapReduce()](../../docs/Reference/mongo-Shell-Methods/Collection-Methods/db-collection-mapReduce.md) | 对大型数据集执行[map-reduce](../Map-Reduce.md)聚合。         |

