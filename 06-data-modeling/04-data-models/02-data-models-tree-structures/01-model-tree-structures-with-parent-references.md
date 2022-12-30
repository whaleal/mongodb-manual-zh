**具有父引用的模型树结构**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-parent-references/#model-tree-structures-with-parent-references)

**概述**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-parent-references/#overview)

此页面描述了一种数据模型，该模型通过在子节点中存储对“父”节点的[引用](https://www.mongodb.com/docs/manual/core/data-model-design/#std-label-data-modeling-referencing)来描述 MongoDB 文档中的树状结构 。

**模式**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-parent-references/#pattern)

*Parent References*模式将每个树节点存储在文档中；除了树节点之外，文档还存储节点父节点的 ID。

考虑以下类别层次结构：

![类别层次结构示例的树数据模型。](https://www.mongodb.com/docs/manual/images/data-model-tree.bakedsvg.svg)

以下示例使用*Parent References*对树建模，将对父类别的引用存储在字段中`parent`：

```shell
db.categories.insertMany( [
   { _id: "MongoDB", parent: "Databases" },
   { _id: "dbm", parent: "Databases" },
   { _id: "Databases", parent: "Programming" },
   { _id: "Languages", parent: "Programming" },
   { _id: "Programming", parent: "Books" },
   { _id: "Books", parent: null }
] )
```

- 检索节点父节点的查询快速而直接：

  ```shell
  db.categories.findOne( { _id: "MongoDB" } ).parent
  ```

- 您可以在字段上创建索引`parent`以启用父节点的快速搜索：

  ```shell
  db.categories.createIndex( { parent: 1 } )
  ```

- 您可以按`parent`字段查询以查找其直接子节点：

  ```shell
  db.categories.find( { parent: "Databases" } )
  ```

- 要检索子树，请参阅[`$graphLookup`。](https://www.mongodb.com/docs/manual/reference/operator/aggregation/graphLookup/#mongodb-pipeline-pipe.-graphLookup)

 参见

原文 - [Model Tree Structures with Parent References]( https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-parent-references/ )

译者：景圣
