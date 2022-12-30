 具有祖先数组的模型树结构[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-ancestors-array/#model-tree-structures-with-an-array-of-ancestors)

**概述**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-ancestors-array/#overview)

[本页介绍了一种数据模型，该模型使用对父节点的引用](https://www.mongodb.com/docs/manual/core/data-model-design/#std-label-data-modeling-referencing)和存储所有祖先的数组来描述 MongoDB 文档中的树状结构。

**模式**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-ancestors-array/#pattern)

*Array of Ancestors*模式将每个树节点存储在文档中；除了树节点之外，文档还将节点的祖先或路径的 ID 存储在一个数组中。

考虑以下类别层次结构：

![类别层次结构示例的树数据模型。](https://www.mongodb.com/docs/manual/images/data-model-tree.bakedsvg.svg)

以下示例使用*Array of Ancestors*对树建模。除了`ancestors`字段之外，这些文档还在字段中存储了对直接父类别的引用`parent`：

```shell
db.categories.insertMany( [
  { _id: "MongoDB", ancestors: [ "Books", "Programming", "Databases" ], parent: "Databases" },
  { _id: "dbm", ancestors: [ "Books", "Programming", "Databases" ], parent: "Databases" },
  { _id: "Databases", ancestors: [ "Books", "Programming" ], parent: "Programming" },
  { _id: "Languages", ancestors: [ "Books", "Programming" ], parent: "Programming" },
  { _id: "Programming", ancestors: [ "Books" ], parent: "Books" },
  { _id: "Books", ancestors: [ ], parent: null }
] )
```

- 检索节点的祖先或路径的查询快速而直接：

  ```shell
  db.categories.findOne( { _id: "MongoDB" } ).ancestors
  ```

- 您可以在字段上创建索引`ancestors`以启用祖先节点的快速搜索：

  ```shell
  db.categories.createIndex( { ancestors: 1 } )
  ```

- 您可以按字段查询`ancestors`以查找其所有后代：

  ```shell
  db.categories.find( { ancestors: "Programming" } )
  ```

*Array of Ancestors*模式提供了一种快速有效的解决方案，通过在祖先字段的元素上创建索引来查找节点的后代和祖先。这使得*Array of Ancestors*成为处理子树的不错选择。

*Array of Ancestors模式比*[Materialized Paths](https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-materialized-paths/)模式稍慢， 但更易于使用。

 参见

原文 - [Model Tree Structures with an Array of Ancestors]( https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-ancestors-array/ )

译者：景圣
