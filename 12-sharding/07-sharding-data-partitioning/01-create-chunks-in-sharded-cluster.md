# 在分片集群中创建范围

在大多数情况下，分片集群将自动创建/拆分和分配范围而无需用户干预。但是，在少数情况下，MongoDB 无法创建足够的范围或足够快地分发数据来支持所需的吞吐量。

例如，如果要将大量数据摄取到不平衡的集群中，或者摄取数据会导致数据不平衡，例如单调增加或减少的分片键。在这些情况下，预拆分空分片集合的范围有助于提高吞吐量。

或者，从 MongoDB 4.0.3 开始，通过在对空集合或不存在的集合进行分片之前定义区域和区域范围，分片集合操作会为定义的区域范围以及任何其他范围创建范围以覆盖整个范围分片键值并根据区域范围执行初始范围分配。有关详细信息，请参阅 空集合。

>## 警告
>
>仅为空集合预拆分范围。手动拆分已填充集合的范围可能会导致不可预测的范围范围和大小以及低效或无效的平衡行为。

要手动拆分空范围，您可以运行以下`split`命令：

>## 例子
>
>要使用`email`字段作为分片键为`myapp.users`集合中的文档创建范围，请在`mongosh`中运行下面命令:
>
>```shell
>for ( var x=97; x<97+26; x++ ){
>    for ( var y=97; y<97+26; y+=6 ) {
>        var prefix = String.fromCharCode(x) + String.fromCharCode(y);
>        db.adminCommand( { split: "myapp.users", middle: { email : prefix } } );
>    }
>}
>```
>
>这假设集合大小为 1 亿个文档。



- 有关分片命令创建和分发的初始范围的信息，请参阅空集合。
- 有关跨分片的平衡器和范围自动分配的信息，请参阅平衡器内部结构和 范围迁移。
- 有关手动迁移范围的信息，请参阅 在分片集群中迁移范围。



原文 - https://docs.mongodb.com/manual/tutorial/create-chunks-in-sharded-cluster/

译者：陆文龙
