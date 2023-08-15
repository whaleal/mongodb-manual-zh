# `On-Demand`物化视图

> 笔记:
>
> **消歧义**
>
> 本页讨论按需物化视图。有关标准视图的讨论，请参阅[视图。](https://www.mongodb.com/docs/v7.0/core/views/#std-label-views-landing-page)
>
> 要了解视图类型之间的差异，请参阅 [与标准视图的比较。](https://www.mongodb.com/docs/v7.0/core/materialized-views/#std-label-materialized-view-compare)

按需物化视图是预先计算的聚合管道结果，存储在磁盘上并从磁盘读取。按需物化视图通常是[`$merge`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)或 [`$out`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)阶段的结果。

### 与标准视图的比较

MongoDB 提供两种不同的视图类型：**标准视图**和 **按需物化视图**。两种视图类型都返回来自聚合管道的结果。

- 标准视图是在您读取视图时计算的，并且不会存储到磁盘中。
- 按需物化视图存储在磁盘上并从磁盘读取。他们使用[`$merge`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)或[`$out`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)阶段来更新保存的数据。

#### 索引

标准视图使用基础集合的索引。因此，您无法直接在标准视图上创建、删除或重新构建索引，也无法获取视图上的索引列表。

您可以直接在按需物化视图上创建索引，因为它们存储在磁盘上。

#### 表现

按需物化视图比标准视图提供更好的读取性能，因为它们是从磁盘读取而不是作为查询的一部分进行计算。这种性能优势会根据管道的复杂性和聚合数据的大小而增加。

### 例子

假设临近 2019 年 1 月底，该集合`bakesales` 包含按商品分类的销售信息：

```
db.bakesales.insertMany( [
   { date: new ISODate("2018-12-01"), item: "Cake - Chocolate", quantity: 2, amount: new NumberDecimal("60") },
   { date: new ISODate("2018-12-02"), item: "Cake - Peanut Butter", quantity: 5, amount: new NumberDecimal("90") },
   { date: new ISODate("2018-12-02"), item: "Cake - Red Velvet", quantity: 10, amount: new NumberDecimal("200") },
   { date: new ISODate("2018-12-04"), item: "Cookies - Chocolate Chip", quantity: 20, amount: new NumberDecimal("80") },
   { date: new ISODate("2018-12-04"), item: "Cake - Peanut Butter", quantity: 1, amount: new NumberDecimal("16") },
   { date: new ISODate("2018-12-05"), item: "Pie - Key Lime", quantity: 3, amount: new NumberDecimal("60") },
   { date: new ISODate("2019-01-25"), item: "Cake - Chocolate", quantity: 2, amount: new NumberDecimal("60") },
   { date: new ISODate("2019-01-25"), item: "Cake - Peanut Butter", quantity: 1, amount: new NumberDecimal("16") },
   { date: new ISODate("2019-01-26"), item: "Cake - Red Velvet", quantity: 5, amount: new NumberDecimal("100") },
   { date: new ISODate("2019-01-26"), item: "Cookies - Chocolate Chip", quantity: 12, amount: new NumberDecimal("48") },
   { date: new ISODate("2019-01-26"), item: "Cake - Carrot", quantity: 2, amount: new NumberDecimal("36") },
   { date: new ISODate("2019-01-26"), item: "Cake - Red Velvet", quantity: 5, amount: new NumberDecimal("100") },
   { date: new ISODate("2019-01-27"), item: "Pie - Chocolate Cream", quantity: 1, amount: new NumberDecimal("20") },
   { date: new ISODate("2019-01-27"), item: "Cake - Peanut Butter", quantity: 5, amount: new NumberDecimal("80") },
   { date: new ISODate("2019-01-27"), item: "Tarts - Apple", quantity: 3, amount: new NumberDecimal("12") },
   { date: new ISODate("2019-01-27"), item: "Cookies - Chocolate Chip", quantity: 12, amount: new NumberDecimal("48") },
   { date: new ISODate("2019-01-27"), item: "Cake - Carrot", quantity: 5, amount: new NumberDecimal("36") },
   { date: new ISODate("2019-01-27"), item: "Cake - Red Velvet", quantity: 5, amount: new NumberDecimal("100") },
   { date: new ISODate("2019-01-28"), item: "Cookies - Chocolate Chip", quantity: 20, amount: new NumberDecimal("80") },
   { date: new ISODate("2019-01-28"), item: "Pie - Key Lime", quantity: 3, amount: new NumberDecimal("60") },
   { date: new ISODate("2019-01-28"), item: "Cake - Red Velvet", quantity: 5, amount: new NumberDecimal("100") },
] );
```

1. 定义按需物化视图

   以下`updateMonthlySales`函数定义一个 `monthlybakesales`包含每月累计销售信息的物化视图。在示例中，该函数采用日期参数来仅更新从特定日期开始的每月销售信息。

   ```
   updateMonthlySales = function(startDate) {
      db.bakesales.aggregate( [
         { $match: { date: { $gte: startDate } } },
         { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, sales_quantity: { $sum: "$quantity"}, sales_amount: { $sum: "$amount" } } },
         { $merge: { into: "monthlybakesales", whenMatched: "replace" } }
      ] );
   };
   ```

   - 该[`$match`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match)阶段过滤数据以仅处理那些大于或等于 的销售额`startDate`。

   - 该[`$group`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group)阶段按年月对销售信息进行分组。此阶段输出的文档具有以下形式：

     ```
     { "_id" : "<YYYY-mm>", "sales_quantity" : <num>, "sales_amount" : <NumberDecimal> }
     ```

   - 该[`$merge`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)阶段将输出写入集合 `monthlybakesales`。

     基于字段（未分片输出集合的默认值），该阶段检查聚合结果中的文档是否与[集合](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/merge/#std-label-merge-on)中的现有文档[匹配：](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/merge/#std-label-merge-whenMatched)`_id`

     * [当存在匹配时](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/merge/#std-label-merge-whenMatched)（即集合中已存在具有相同年月的文档），阶段将用聚合结果中的文档[替换现有文档。](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/merge/#std-label-merge-whenMatched-replace)
     * [当不存在匹配时](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/merge/#std-label-merge-whenNotMatched)，阶段将聚合结果中的文档插入到集合中（不匹配时的默认行为）。

2. 执行初始运行

   对于初始运行，您可以传入日期`new ISODate("1970-01-01")`：

   ```
   updateMonthlySales(new ISODate("1970-01-01"));
   ```

   初次运行后，`monthlybakesales`包含以下文件；即`db.monthlybakesales.find().sort( { _id: 1 } )` 返回以下内容：

   ```
   { "_id" : "2018-12", "sales_quantity" : 41, "sales_amount" : NumberDecimal("506") }
   { "_id" : "2019-01", "sales_quantity" : 86, "sales_amount" : NumberDecimal("896") }
   ```

3. 刷新物化视图

   假设到 2019 年 2 月的第一周，该`bakesales` 系列已更新为更新的销售信息；具体来说，是一月和二月的额外销售额。

   ```
   db.bakesales.insertMany( [
      { date: new ISODate("2019-01-28"), item: "Cake - Chocolate", quantity: 3, amount: new NumberDecimal("90") },
      { date: new ISODate("2019-01-28"), item: "Cake - Peanut Butter", quantity: 2, amount: new NumberDecimal("32") },
      { date: new ISODate("2019-01-30"), item: "Cake - Red Velvet", quantity: 1, amount: new NumberDecimal("20") },
      { date: new ISODate("2019-01-30"), item: "Cookies - Chocolate Chip", quantity: 6, amount: new NumberDecimal("24") },
      { date: new ISODate("2019-01-31"), item: "Pie - Key Lime", quantity: 2, amount: new NumberDecimal("40") },
      { date: new ISODate("2019-01-31"), item: "Pie - Banana Cream", quantity: 2, amount: new NumberDecimal("40") },
      { date: new ISODate("2019-02-01"), item: "Cake - Red Velvet", quantity: 5, amount: new NumberDecimal("100") },
      { date: new ISODate("2019-02-01"), item: "Tarts - Apple", quantity: 2, amount: new NumberDecimal("8") },
      { date: new ISODate("2019-02-02"), item: "Cake - Chocolate", quantity: 2, amount: new NumberDecimal("60") },
      { date: new ISODate("2019-02-02"), item: "Cake - Peanut Butter", quantity: 1, amount: new NumberDecimal("16") },
      { date: new ISODate("2019-02-03"), item: "Cake - Red Velvet", quantity: 5, amount: new NumberDecimal("100") }
   ] )
   ```

   要刷新`monthlybakesales`一月和二月的数据，请再次运行该函数以重新运行聚合管道，从 开始 `new ISODate("2019-01-01")`。

   ```
   updateMonthlySales(new ISODate("2019-01-01"));
   ```

   的内容`monthlybakesales`已更新，以反映集合中的最新数据`bakesales`；即 `db.monthlybakesales.find().sort( { _id: 1 } )`返回以下内容：

   ```
   { "_id" : "2018-12", "sales_quantity" : 41, "sales_amount" : NumberDecimal("506") }
   { "_id" : "2019-01", "sales_quantity" : 102, "sales_amount" : NumberDecimal("1142") }
   { "_id" : "2019-02", "sales_quantity" : 15, "sales_amount" : NumberDecimal("284") }
   ```

### 附加信息

"[$merge](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)" 阶段：

- 可以输出到相同或不同数据库中的集合。
- 如果输出集合尚不存在，则创建一个新集合。
- 可以将结果（插入新文档、合并文档、替换文档、保留现有文档、操作失败、使用自定义更新管道处理文档）合并到现有集合中。
- 可以输出到分片集合。输入集合也可以进行分片。

请参阅[`$merge`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)：

- [`$merge`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)有关和可用选项的更多信息
- 示例：[按需物化视图：初始创建](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/merge/#std-label-merge-mat-view-init-creation)
- 示例：[按需物化视图：更新/替换数据](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/merge/#std-label-merge-mat-view-refresh)
- 示例：[仅插入新数据](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/merge/#std-label-merge-mat-view-insert-only)
