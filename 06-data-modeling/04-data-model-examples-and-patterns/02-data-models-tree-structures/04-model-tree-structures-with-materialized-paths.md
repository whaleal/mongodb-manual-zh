**具有物化路径的模型树结构**

**概述**

本页描述了一种数据模型，该模型通过存储文档之间的完整关系路径来描述 MongoDB 文档中的树状结构。

**模式**

*物化路径*模式将每个树节点存储在文档中；除了树节点之外，文档将节点的祖先或路径的 ID 作为字符串存储。虽然*物化路径*模式需要额外的步骤来处理字符串和正则表达式，但该模式在处理路径方面也提供了更大的灵活性，例如通过部分路径查找节点。

考虑以下类别层次结构：

![类别层次结构示例的树数据模型。](https://www.mongodb.com/docs/manual/images/data-model-tree.bakedsvg.svg)

下面的示例使用*物化路径*对树建模，将路径存储在字段中`path`；路径字符串使用逗号 `,`作为分隔符：

```shell
db.categories.insertMany( [
   { _id: "Books", path: null },
   { _id: "Programming", path: ",Books," },
   { _id: "Databases", path: ",Books,Programming," },
   { _id: "Languages", path: ",Books,Programming," },
   { _id: "MongoDB", path: ",Books,Programming,Databases," },
   { _id: "dbm", path: ",Books,Programming,Databases," }
] )
```

- 您可以查询以检索整棵树，按字段排序 `path`：

  ```shell
  db.categories.find().sort( { path: 1 } )
  ```

- 您可以在该字段上使用正则表达式`path`来查找以下的后代`Programming`：

  ```shell
  db.categories.find( { path: /,Programming,/ } )
  ```

- 您还可以检索也位于层次结构最顶层的`Books`位置 的后代：`Books`

  ```shell
  db.categories.find( { path: /^,Books,/ } )
  ```

- 要在字段上创建索引，请`path`使用以下调用：

  ```shell
  db.categories.createIndex( { path: 1 } )
  ```

  该索引可能会根据查询提高性能：

  - 对于来自根子`Books`树（例如`/^,Books,/` 或`/^,Books,Programming,/`）的查询，字段上的索引`path`显着提高了查询性能。

  - 对于查询中未提供从根开始的路径的子树查询（例如`/,Databases,/`），或子树的类似查询，其中节点可能位于索引字符串的中间，查询必须检查整个索引.

    对于这些查询，*如果*索引明显小于整个集合，则索引*可能会*提供一些性能改进。

 参见

原文 - [Model Tree Structures with Materialized Paths]( https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-materialized-paths/ )

译者：景圣
