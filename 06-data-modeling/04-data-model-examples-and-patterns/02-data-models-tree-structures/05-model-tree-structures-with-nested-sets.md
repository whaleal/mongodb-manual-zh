**具有嵌套集的模型树结构**

**概述**

本文档描述了一种数据模型，该模型描述了一种树状结构，以牺牲树的可变性为代价来优化子树的发现。

**模式**

*嵌套集*模式将树中的每个节点标识为树的往返遍历中的停靠点。应用程序访问树中的每个节点两次；首先是在初次旅行期间，其次是在回程期间。*嵌套集*模式将每个树节点存储在文档中；除了树节点之外，document 还存储节点父节点的 ID、节点在该字段中的初始停靠点`left`以及它在该字段中的返回停靠点`right`。

考虑以下类别层次结构：

![分层数据的示例。 这些数字标识在树的往返遍历期间节点处的停靠点。](https://www.mongodb.com/docs/manual/images/data-model-example-nested-set.bakedsvg.svg)

点击放大

以下示例使用*Nested Sets*对树建模：

```shell
db.categories.insertMany( [
   { _id: "Books", parent: 0, left: 1, right: 12 },
   { _id: "Programming", parent: "Books", left: 2, right: 11 },
   { _id: "Languages", parent: "Programming", left: 3, right: 4 },
   { _id: "Databases", parent: "Programming", left: 5, right: 10 },
   { _id: "MongoDB", parent: "Databases", left: 6, right: 7 },
   { _id: "dbm", parent: "Databases", left: 8, right: 9 }
] )
```

您可以查询以检索节点的后代：

```shell
var databaseCategory = db.categories.findOne( { _id: "Databases" } );
db.categories.find( { left: { $gt: databaseCategory.left }, right: { $lt: databaseCategory.right } } );
```

*Nested Sets*模式为查找子树提供了一种快速有效的解决方案，但对于修改树结构而言效率低下。因此，此模式最适合不会更改的静态树。

 参见

原文 - [Model Tree Structures with Nested Sets]( https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-nested-sets/ )

译者：景圣
