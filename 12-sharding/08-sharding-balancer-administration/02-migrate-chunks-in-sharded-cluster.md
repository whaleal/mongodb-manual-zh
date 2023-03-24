# 迁移分片集群中的范围

在大多数情况下，您应该让自动平衡器在分片之间迁移范围。但是，在某些情况下您可能希望手动迁移范围：

- 预拆分空集合时，手动迁移范围以将它们均匀分布在分片中。在有限的情况下使用预拆分来支持批量数据摄取。
- 如果活动集群中的平衡器无法在平衡窗口内分配范围，那么您将不得不手动迁移范围。

要手动迁移范围，请使用`moveChunk`or `moveRange`命令。有关自动平衡器如何在分片之间移动范围的更多信息，请参阅 平衡器内部结构和范围迁移。

>## 例子
>
>### 迁移单个范围
>
>以下示例假设该字段`username`是  `myapp`数据库中命名为`users`的集合的分片键 ，并且`smith`值存在于要迁移的范围内 。在`mongosh`使用以下迁移范围命令：
>
>```
>db.adminCommand( { moveChunk : "myapp.users",
>                   find : {username : "smith"},
>                   to : "mongodb-shard3.example.net" } )
>```
>
>
>
>此命令将包含分片键值“smith”的范围移动到 名为`mongodb-shard3.example.net`的分片。该命令将阻塞，直到迁移完成。
>
>>## 提示
>>
>>要返回分片列表，请使用`listShards`命令。





>## 例子
>
>### 均匀迁移范围
>
>要均匀迁移`myapp.users`集合的范围，请将每个前缀范围放在彼此的下一个分片上，并在 mongo shell 中运行以下命令：
>
>```shell
>var shServer = [ "sh0.example.net", "sh1.example.net", "sh2.example.net", "sh3.example.net", "sh4.example.net" ];
>for ( var x=97; x<97+26; x++ ){
>  for( var y=97; y<97+26; y+=6 ) {
>    var prefix = String.fromCharCode(x) + String.fromCharCode(y);
>    db.adminCommand({moveChunk : "myapp.users", find : {email : prefix}, to : shServer[(y-97)/6]})
>  }
>}
>```



有关预拆分的介绍，请参阅在分片集群中创建范围。

- 使用`moveRange`带有`_secondaryThrottle` 和`writeConcern`字段的命令来确定平衡器何时继续处理迁移范围中的下一个文档。
- 使用`moveRange`带有`secondaryThrottle` 和`writeConcern`字段的命令来确定平衡器何时继续处理迁移范围中的下一个文档。

有关详细信息，请参阅`moveRange`和`moveRange`。

## 更改流和孤立文档[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/migrate-chunks-in-sharded-cluster/#change-streams-and-orphan-documents)

从 MongoDB 5.3 开始,在范围迁移期间， 不会为孤立文档的更新生成更改流事件。

原文 -  https://docs.mongodb.com/manual/tutorial/migrate-chunks-in-sharded-cluster/

译者：陆文龙
