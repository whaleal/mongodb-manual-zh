## 确保索引适合 RAM

为了实现最快的处理速度，请确保索引完全适合 RAM，以便系统可以避免从磁盘读取索引。

要检查索引的大小，请使用 [`db.collection.totalIndexSize()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.totalIndexSize/#mongodb-method-db.collection.totalIndexSize)帮助程序，它以字节为单位返回数据：

```
> db.collection.totalIndexSize()
4617080000
```

上面的示例显示索引大小几乎为 4.3 GB。为了确保该索引适合 RAM，您不仅必须有更多的可用 RAM，而且还必须有可用于工作集其余部分的 [RAM](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-working-set)。还请记住：

如果您拥有并使用多个集合，则必须考虑所有集合上所有索引的大小。索引和工作集必须能够同时装入内存。

在某些有限的情况下，索引不需要适合内存。看[仅保存 RAM 中最新值的索引。](https://www.mongodb.com/docs/v7.0/tutorial/ensure-indexes-fit-ram/#std-label-indexing-right-handed)

> 提示
>
> **也可以看看：**
>
> - [`collStats`](https://www.mongodb.com/docs/v7.0/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats)命令
> - [`db.collection.stats()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.stats/#mongodb-method-db.collection.stats)shell 方法

### 仅保存 RAM 中最新值的索引

在所有情况下，索引不必*完全*适合RAM。如果索引字段的值随着每次插入而增加，并且大多数查询选择最近添加的文档；那么 MongoDB 只需要保留 RAM 中保存最新或“最右边”值的索引部分。这样可以有效地使用索引进行读写操作，并最大限度地减少支持索引所需的 RAM 量。