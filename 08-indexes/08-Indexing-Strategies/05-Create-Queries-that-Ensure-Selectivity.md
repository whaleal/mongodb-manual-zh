## 创建确保选择性的查询

选择性是查询使用索引缩小结果范围的能力。有效索引更具选择性，允许 MongoDB 使用索引来完成与完成查询相关的大部分工作。

为了确保选择性，请编写限制带有索引字段的可能文档数量的查询。编写相对于索引数据具有适当选择性的查询。

> **例子:**
>
> 假设您有一个名为 的字段`status`，其中可能的值为`new`和`processed`。如果您添加索引，则`status` 您已创建低选择性索引。索引对于定位记录几乎没有什么帮助。
>
> 根据您的查询，更好的策略是创建一个 包含低选择性字段和另一个字段的[复合索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-compound/#std-label-index-type-compound)例如，您可以在`status`和上创建复合索引`created_at.`
>
> 另一种选择（同样取决于您的用例）可能是使用单独的集合，每个状态对应一个集合。

> **例子:**
>
> 考虑集合上的索引（即按 升序排序的`{ a : 1 }`键上的索引），其中三个值均匀分布在集合中：`a``a`
>
> ```
> { _id: ObjectId(), a: 1, b: "ab" }
> { _id: ObjectId(), a: 1, b: "cd" }
> { _id: ObjectId(), a: 1, b: "ef" }
> { _id: ObjectId(), a: 2, b: "jk" }
> { _id: ObjectId(), a: 2, b: "lm" }
> { _id: ObjectId(), a: 2, b: "no" }
> { _id: ObjectId(), a: 3, b: "pq" }
> { _id: ObjectId(), a: 3, b: "rs" }
> { _id: ObjectId(), a: 3, b: "tv" }
> ```
>
> 如果查询`{ a: 2, b: "no" }`MongoDB 必须扫描集合中的 3 个 [文档](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-document)才能返回一个匹配结果。同样，查询`{ a: { $gt: 1}, b: "tv" }` 必须扫描 6 个文档，也才能返回一个结果。
>
> 考虑集合上的相同索引，其中`a`有*九个*值均匀分布在集合中：
>
> ```
> { _id: ObjectId(), a: 1, b: "ab" }
> { _id: ObjectId(), a: 2, b: "cd" }
> { _id: ObjectId(), a: 3, b: "ef" }
> { _id: ObjectId(), a: 4, b: "jk" }
> { _id: ObjectId(), a: 5, b: "lm" }
> { _id: ObjectId(), a: 6, b: "no" }
> { _id: ObjectId(), a: 7, b: "pq" }
> { _id: ObjectId(), a: 8, b: "rs" }
> { _id: ObjectId(), a: 9, b: "tv" }
> ```
>
> 如果您查询`{ a: 2, b: "cd" }`，MongoDB 必须仅扫描一份文档来完成查询。索引和查询更具选择性，因为 的值`a`是均匀分布的*，并且*查询可以使用索引选择特定文档。
>
> 然而，虽然 on 的索引`a`更具选择性，但诸如 之类的查询`{ a: { $gt: 5 }, b: "tv" }`仍然需要扫描 4 个文档。

如果整体选择性较低，并且 MongoDB 必须读取大量文档才能返回结果，那么某些查询在没有索引的情况下可能会执行得更快。要确定性能，请参阅 [测量索引使用。](https://www.mongodb.com/docs/v7.0/tutorial/measure-index-use/#std-label-indexes-measuring-use)