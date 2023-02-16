**具有子引用的模型树结构**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-child-references/#model-tree-structures-with-child-references)

**概述**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-child-references/#overview)

此页面描述了一种数据模型，该模型通过在父节点中存储对子节点的[引用](https://www.mongodb.com/docs/manual/core/data-model-design/#std-label-data-modeling-referencing)来描述 MongoDB 文档中的树状结构。

**模式**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-child-references/#pattern)

*子引用*模式将每个树节点存储在文档中；除了树节点之外，文档还将节点的子节点的 ID 存储在一个数组中。

考虑以下类别层次结构：

![类别层次结构示例的树数据模型。](https://www.mongodb.com/docs/manual/images/data-model-tree.bakedsvg.svg)

以下示例使用*Child References*对树建模，将对节点子节点的引用存储在字段中`children`：

```shell
db.categories.insertMany( [
   { _id: "MongoDB", children: [] },
   { _id: "dbm", children: [] },
   { _id: "Databases", children: [ "MongoDB", "dbm" ] },
   { _id: "Languages", children: [] },
   { _id: "Programming", children: [ "Databases", "Languages" ] },
   { _id: "Books", children: [ "Programming" ] }
] )
```

- 检索节点的直接子节点的查询快速而直接：

  ```shell
  db.categories.findOne( { _id: "Databases" } ).children
  ```

- 您可以在字段上创建索引`children`以启用子节点的快速搜索：

  ```shell
  db.categories.createIndex( { children: 1 } )
  ```

- 您可以查询`children`字段中的节点以查找其父节点及其兄弟节点：

  ```shell
  db.categories.find( { children: "MongoDB" } )
  ```

只要不需要对子树进行操作，子引用模式就为树存储提供了合适的解决方案*。*这种模式还可以提供一个合适的解决方案来存储一个节点可能有多个父节点的图。

 参见

原文 - [Model Tree Structures with Child References]( https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-child-references/ )

译者：景圣
