# MongoDB 2.4中的兼容性和索引类型更改 

在2.4中，MongoDB包括两个与索引相关的新功能，升级到2.4版本的用户必须考虑这些功能，特别是在可能的降级路径方面。有关降级的更多信息，请参阅[将MongoDB从2.4降级到以前的版本。](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-downgrade)

## 新的索引类型

在2.4中，MongoDB添加了两种新的索引类型`2dsphere`和`text`。这些索引类型在2.2中不存在，对于每个数据库，创建`2dsphere`或`text`索引将升级数据文件版本，并使该数据库与2.2不兼容。

如果您打算降级，在移动到2.2之前，您应该始终删除所有`2dsphere`和`text`索引。

您可以使用[降级过程](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-downgrade)降级这些数据库，并在需要时运行2.2，但这将为所有受影响的数据库运行完整的数据库修复（如`repairDatabase`）。



## 索引类型验证

在MongoDB 2.2及更早版本中，您可以指定不存在的无效索引类型。在这些情况下，MongoDB将创建一个升序（例如1）索引。无效索引包括由不引用现有索引类型的字符串指定的索引类型，以及除`1`和`-1`以外的所有数字。[[1\]](https://www.mongodb.com/docs/upcoming/release-notes/2.4-index-types/#footnote-grandfathered-indexes)

在2.4中，创建任何无效索引都将导致错误。此外，如果包含的数据库有任何无效的索引类型，则无法在集合上创建`2dsphere`或`text`索引。[[1\]](https://www.mongodb.com/docs/upcoming/release-notes/2.4-index-types/#footnote-grandfathered-indexes)

##### 示例：

如果您尝试在MongoDB 2.4中添加无效索引，如下所示：

```shell
db.coll.ensureIndex( { field: "1" } )
```

MongoDB将返回以下错误文档：

```shell
{
  "err" : "Unknown index plugin '1' in index { field: \"1\" }"
  "code": 16734,
  "n": <number>,
  "connectionId": <number>,
  "ok": 1
}
```

| [1]  | *(1，2)* 在2.4中，尽管在启动时发出警告，但指定类型为`"1"`或`"-1"`”（字符串`"1"`和`"-1"`索引将继续存在。**但是**，副本集中的[辅助](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-secondary)无法完成具有`"1"`或`"-1"`索引的主索引的初始同步。避免所有类型无效的索引。 |
| ---- | ------------------------------------------------------------ |







译者：韩鹏帅
 参见

原文 - [Compatibility and Index Type Changes in MongoDB 2.4]( https://docs.mongodb.com/manual/release-notes/2.4-index-types/ )

