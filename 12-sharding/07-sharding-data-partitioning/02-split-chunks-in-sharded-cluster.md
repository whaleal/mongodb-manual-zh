# 在分片集群中拆分块

默认情况下，MongoDB仅在迁移属于它的数据时才可能拆分一个块。但是，如果您的集群中有大量数据而块很少 ，您可能希望手动拆分块，就像使用现有数据部署集群后的情况一样。

要手动拆分块，请使用带中间字段或查找字段的拆分命令。`mongosh`提供辅助方法`sh.splitFind()`和`sh.splitAt()`

`splitFind()`将包含返回的与此查询匹配的第一个文档的块拆分 为两个大小相等的块。您必须将分片集合的完整名称空间（即“`<database>.<collection>`”）指定给`splitFind()`。  `splitFind()`中的查询不需要使用分片键，尽管这样做几乎总是有意义的。

>## 例子
>
>以下命令拆分包含`records`数据库`people`集合中`zipcode`字段`63109`值的块 ：  
>
>```shell
>sh.splitFind( "records.people", { "zipcode": "63109" } )
>```



用于`splitAt()`将一个块一分为二，使用查询的文档作为新块中的下界：

>## 例子
>
>以下命令拆分包含 `records`数据库`people`集合中`zipcode`字段`63109`值的块 :
>
>```shell
>sh.splitAt( "records.people", { "zipcode": "63109" } )
>```



>## 笔记
>
>`splitAt()`不一定将块分成两个大小相等的块。拆分发生在与查询匹配的文档的位置，而不管该文档在块中的哪个位置。





原文 - https://docs.mongodb.com/manual/tutorial/split-chunks-in-sharded-cluster/ 

译者：陆文龙
