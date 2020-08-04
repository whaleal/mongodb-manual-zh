### Text Indexes（文本索引）
MongoDB 提供文本索引以支持对 string 内容的文本搜索查询。 `text`索引可以包含 value 是 string 或 string 元素的 array 的任何字段。

要执行文本搜索查询，您的集合上必须具有`text`索引。一个集合只能有**一个**文本搜索索引，但该索引可以覆盖多个字段。

对于 example，您可以在mongo shell 中运行以下内容，以允许在`name`和`description`字段上进行文本搜索：

```shell
db.stores.createIndex( { name: "text", description: "text" } )
```

有关文本索引的完整参考，请参见 [Text Indexes](https://docs.mongodb.com/manual/core/index-text/)部分，包括行为，标记化和属性。
<a name="OVpi2"></a>

