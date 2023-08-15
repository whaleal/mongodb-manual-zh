## 通配符索引签

从 MongoDB 5.0 开始，[通配符索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/#std-label-wildcard-index-core)`wildcardProjection`的选项 包含在**索引签名**中。索引签名是唯一标识索引的参数的组合。这意味着您可以使用相同的[键模式](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndexes/#std-label-key_patterns)创建多个通配符索引，只要选项不包含相同的字段即可。`wildcardProjection`

### 投影签名显示

从 MongoDB 6.3、6.0.5 和 5.0.16 开始，该`wildcardProjection` 字段以其提交的形式存储索引投影。服务器的早期版本可能已经以标准化形式存储了投影。

[`listIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/listIndexes/#mongodb-dbcommand-dbcmd.listIndexes)服务器以相同的方式使用索引，但您可能会注意到和 命令的输出有所不同[`db.collection.getIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)。

### 例子

考虑集合上的以下通配符索引`books`：

```
db.books.createIndex(
   {
      "$**": 1
   },
   {
      wildcardProjection: {
         "author.name": 1,
         "author.website": 1
      },
      name: "authorWildcard"
   }
)
```

索引键模式是`"$**"`. 如果指定不同的 `wildcardProjection`. 例如：

```
db.books.createIndex(
   {
      "$**": 1
   },
   {
      wildcardProjection: {
         "publisher.name": 1
      },
      name: "publisherWildcard"
   }
)
```

要查看创建的索引，请运行以下 [`getIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)方法：

```
db.books.getIndexes()
```

输出：

```
[
   { v: 2, key: { _id: 1 }, name: '_id_' },
   {
      v: 2,
      key: { '$**': 1 },
      name: 'authorWildcard',
      wildcardProjection: { author: { website: true, name: true }, _id: false }
   },
   {
      v: 2,
      key: { '$**': 1 },
      name: 'publisherWildcard',
      wildcardProjection: { publisher: { name: true }, _id: false }
   }
]
```

### 了解更多

- [`wildcard`索引选项](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#std-label-createIndex-method-wildcard-option)
- [通配符索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/reference/restrictions/#std-label-wildcard-index-restrictions)