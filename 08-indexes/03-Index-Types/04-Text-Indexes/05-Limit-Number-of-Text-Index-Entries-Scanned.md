## 限制扫描的文本索引条目

如果对大型数据集执行文本搜索查询，单字段文本索引可能会扫描大量条目以返回结果，这可能会导致查询速度缓慢。

为了提高查询性能，您可以创建[复合文本索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/create-text-index/#std-label-compound-text-index-example)并在文本搜索查询中包含相等匹配。如果复合索引包含相等匹配中使用的字段，则索引扫描的条目更少，返回结果的速度更快。

### 关于此任务

在此示例中，商店经理查询`inventory`包含以下文档的集合：

```
db.inventory.insertMany( [
   { _id: 1, department: "tech", description: "lime green computer" },
   { _id: 2, department: "tech", description: "wireless red mouse" },
   { _id: 3, department: "kitchen", description: "green placemat" },
   { _id: 4, department: "kitchen", description: "red peeler" },
   { _id: 5, department: "food", description: "green apple" },
   { _id: 6, department: "food", description: "red potato" }
] )
```

经理对特定部门内的项目执行文本搜索查询

`department`和字段上的复合文本索引`description`将索引键限制为仅扫描指定的文档 `department`。与字段上的单字段文本索引相比，复合文本索引提供了改进的性能`description`。

### 程序

`inventory`在包含以下字段的集合上创建复合索引：

- `department`字段上的升序或降序索引键
- 字段`text`上的索引键`description`

```
db.inventory.createIndex(
   {
     department: 1,
     description: "text"
   }
)
```

### 结果

创建复合索引后，文本搜索查询仅扫描与字段上指定的相等条件匹配的文档 `department`。

例如，以下查询扫描`department` 等于`kitchen`字段`description`包含字符串的文档 `green`：

```
db.inventory.find( { department: "kitchen", $text: { $search: "green" } } )
```

输出：

```
[ { _id: 3, department: 'kitchen', description: 'green placemat' } ]
```

### 查看已审查的文件数量

要查看扫描了多少文档以返回查询，请查看查询的[`executionStats`：](https://www.mongodb.com/docs/v7.0/reference/explain-results/#std-label-executionStats)

```
db.inventory.find(
   {
      department: "kitchen", $text: { $search: "green" }
   }
).explain("executionStats")
```

该字段中指示了检查的索引键的数量 [`totalKeysExamined`](https://www.mongodb.com/docs/v7.0/reference/explain-results/#mongodb-data-explain.executionStats.totalKeysExamined) 。检查更多索引键的查询通常需要更长的时间才能完成。

`department`使用和 的复合索引时`description`，查询仅检查**一个**索引键。集合中只有一个文档，其中`department`是`kitchen`并且`description` 包含字符串`green`。

但是，如果查询仅在字段上使用单字段文本索引 `description`，则查询将检查**三个**索引键。集合中有三个文档，其中`description` 字段包含字符串`green`。

在像上一示例中使用的小型集合中，单字段索引和复合文本索引之间的性能没有明显差异。然而，在较大的集合中，增加索引条目扫描会明显影响性能。为了获得最佳性能，请创建限制扫描索引条目数量的文本索引，以最适合您的相等匹配。

### 了解更多

- [复合文本索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-restrictions/#std-label-text-index-compound-restrictions)
- [为文本搜索结果分配权重](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/control-text-search-results/#std-label-specify-weights)
- [文本索引属性](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-properties/#std-label-text-index-properties)