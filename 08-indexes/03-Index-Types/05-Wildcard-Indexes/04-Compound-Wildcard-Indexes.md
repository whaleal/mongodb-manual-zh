## 复合通配符索引

*7.0版本中的新内容*。

MongoDB 支持在一个字段或一组字段上创建通配符索引。复合索引有多个索引项。复合通配符索引具有一个通配符术语和一个或多个附加索引术语。

> 重要的:
>
> 通配符索引不会取代基于工作负载的索引规划。
>
> 有关创建支持您的工作负载的索引的更多信息，请参阅 [创建索引以支持您的查询。](https://www.mongodb.com/docs/v7.0/tutorial/create-indexes-to-support-queries/#std-label-create-indexes-to-support-queries)

### 用例

#### 使用属性模式进行搜索

[属性模式](https://www.mongodb.com/blog/post/building-with-patterns-the-attribute-pattern)是一种用于搜索共享公共特征的文档的有用技术。

不幸的是，创建大量单独的索引来覆盖所有可能的查询的成本很高。通配符索引是创建大量单独索引的一个很好的替代方案，因为一个通配符索引可以有效地覆盖许多潜在的查询。

考虑这样的模式：

```
{
     tenantId: <Number>,
     tenantRegion: <Number>,
     customFields: {
                     addr: <String>,
                     name: <String>,
                     blockId: <Number>,
                     ...
     }
    dateOpened: <Date>
 }
```

您可能想要查询该`customFields`字段的各个方面，以查找具有特定`tenantId`. 您可以创建一系列单独的索引：

```
{ tenantId: 1, “customFields.addr": 1 }
{ tenantId: 1, “customFields.name": 1 }
{ tenantId: 1, “customFields.blockId": 1 }
...
```

这种方法很难维护，并且您可能会达到每个集合的最大索引数 (64)。

请改用复合通配符索引。复合通配符索引更容易编写，更容易维护，并且不太可能达到 64 个索引集合的限制。

此示例在集合上创建复合通配符索引`salesData` ：

```
db.runCommand(
   {
       createIndexes: "salesData",
       indexes: [
          {
             key: {
                tenantId: 1,
                "customFields.$**": 1
             },
             name: "tenant_customFields"
          }
       ]
   }
)
```

通配符`"customFields.$**"`指定该字段中的所有子字段`customFields`。另一个索引项`tenantId`不是通配符规范；它是一个标准的现场规范。

### 行为

要创建通配符索引，请使用标准索引创建命令：

- [`createIndexes`](https://www.mongodb.com/docs/v7.0/reference/command/createIndexes/#mongodb-dbcommand-dbcmd.createIndexes)
- [`createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)
- [`createIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndexes/#mongodb-method-db.collection.createIndexes)

### 通配符索引的一般注意事项

* 通配符索引`_id`默认省略该字段。要将 `_id`字段包含在通配符索引中，您必须将其显式包含在`wildcardProjection`文档中。

  ```
  db.salesData.createIndex(
     { "$**" : 1 },
     { "wildcardProjection" :
        { "_id": 1, "customers.lastName": 1, "customers.FirstName": 1, }
     }
  )
  ```

* 您可以在一个集合上创建多个通配符索引。

* 通配符索引可以覆盖与集合中其他索引相同的字段。

* 通配符索引[稀疏](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-index-type-sparse)。它们仅包含包含索引字段的文档条目。

  如果复合通配符索引中的所有字段均缺失，则不会对文档建立索引。

### 复合通配符索引注意事项

- 复合通配符索引是稀疏索引。
- 如果文档缺少通配符字段但具有复合字段之一，则文档将包含在索引中。
- 索引字段（包括通配符字段）可以按升序 ( `1`) 或降序 ( `-1`) 排序。

### 开始使用

#### 过滤字段`wildcardProjection`

您可以使用 a`wildcardProjection`来指定各个子字段。

```
db.runCommand(
   {
       createIndexes: "salesData",
       indexes: [
          {
             key: {
                tenantId: 1,
                "$**": 1
             },
             name: "tenant_customFields_projection",
             wildcardProjection: {
                "customFields.addr": 1,
                "customFields.name": 1
             }
          }
       ]
   }
)
```

通配符索引项`"$**"`指定集合中的每个字段。将索引限制`wildcardProjection`为指定字段，`"customFields.addr"`并且`"customFields.name"`.

`wildcardProjection`仅当通配符为 时才 可以使用 a `$**`。

#### 使用辅助方法创建通配符索引

MongoDB为大多数[数据库命令](https://www.mongodb.com/docs/v7.0/reference/command/#std-label-database-commands)提供[shell 帮助器方法](https://www.mongodb.com/docs/v7.0/reference/method/#std-label-js-administrative-methods)。这些 shell 方法提供了简化的语法，并且在功能上与数据库命令等效。

shell 助手[第一个例子](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/index-wildcard-compound/#std-label-wc-ex-first)是：

```
db.salesData.createIndex(
   { tenantId: 1, "customFields.$**": 1 },
   {
      name: "tenant_customFields_shellHelper"
   }
)
```

shell 助手[第二个例子](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/index-wildcard-compound/#std-label-wc-ex-second)是：

```
db.salesData.createIndex(
  { tenantId: 1, "$**": 1 },
  { "wildcardProjection": {
        "customFields.addr": 1,
        "customFields.name": 1
     },
     name: "tenant_customFields_projection_helper"
  }
)
```

如果要比较 shell 命令和数据库命令，则必须删除命令调用之间的索引。即使名称不同，也不能两次创建相同的索引。

要删除索引，请插入索引名称并运行 [db.collection.dropIndex() 。](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.dropIndex/#std-label-collection-drop-index)

```
db.salesData.dropIndex( "tenant_customFields" )
```

前面的命令`"tenant_customFields"`从`salesData`数据库中删除索引。

### 了解更多

- [通配符索引的行为详细信息](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/#std-label-wildcard-index-details)
- [单通配符索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/create-wildcard-index-single-field/#std-label-wildcard-index-single)
- [通配符文本索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/create-wildcard-text-index/#std-label-create-wildcard-text-index)