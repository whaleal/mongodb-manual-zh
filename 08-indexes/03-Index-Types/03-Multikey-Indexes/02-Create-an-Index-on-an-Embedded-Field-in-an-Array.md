## 在数组中的嵌入字段上创建索引

您可以在数组内的嵌入文档字段上创建索引。这些索引提高了对数组中出现的特定嵌入字段的查询性能。当您在数组内的字段上创建索引时，MongoDB 将该索引存储为多键索引。

要创建索引，请使用该[`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex) 方法。您的操作应该类似于此原型：

```
db.<collection>.createIndex( { <field>: <sortOrder> } )
```

#### 关于此任务

本页上的示例使用`inventory`包含以下文档的集合：

```
db.inventory.insertMany( [
   {
      "item": "t-shirt",
      "stock": [
         {
            "size": "small",
            "quantity": 8
         },
         {
            "size": "large",
            "quantity": 10
         },
       ]
   },
   {
      "item": "sweater",
      "stock": [
         {
            "size": "small",
            "quantity": 4
         },
         {
            "size": "large",
            "quantity": 7
         },
       ]
   },
   {
      "item": "vest",
      "stock": [
         {
            "size": "small",
            "quantity": 6
         },
         {
            "size": "large",
            "quantity": 1
         }
       ]
   }
] )
```

当库存商品少于五件时，您就需要订购更多库存。要查找要重新排序的项目，您可以查询数组中元素`stock`小于`quantity`的 文档`5`。为了提高此查询的性能，您可以在字段上创建索引`stock.quantity`。

### 步骤

以下操作在 集合`stock.quantity`的字段上创建升序多键索引`inventory`：

```
db.inventory.createIndex( { "stock.quantity": 1 } )
```

由于`stock`包含数组值，MongoDB 将此索引存储为多键索引。

### 结果

该索引包含字段中出现的每个单独值的键 `stock.quantity`。索引是升序的，这意味着键按以下顺序存储：`[ 1, 4, 6, 7, 8, 10 ]`。

索引支持对字段进行选择的查询`stock.quantity`。例如，以下查询返回数组中至少`stock`有一个元素`quantity`小于的文档`5`：

```
db.inventory.find(
   {
      "stock.quantity": { $lt: 5 }
   }
)
```

输出：

```
[
  {
    _id: ObjectId("63449793b1fac2ee2e957ef3"),
    item: 'vest',
    stock: [ { size: 'small', quantity: 6 }, { size: 'large', quantity: 1 } ]
  },
  {
    _id: ObjectId("63449793b1fac2ee2e957ef2"),
    item: 'sweater',
    stock: [ { size: 'small', quantity: 4 }, { size: 'large', quantity: 7 } ]
  }
]
```

### 对结果排序

索引还支持对字段进行排序操作`stock.quantity`，比如这个查询：

```
db.inventory.find().sort( { "stock.quantity": -1 } )
```

输出：

```
[
  {
    _id: ObjectId("63449793b1fac2ee2e957ef1"),
    item: 't-shirt',
    stock: [ { size: 'small', quantity: 8 }, { size: 'large', quantity: 10 } ]
  },
  {
    _id: ObjectId("63449793b1fac2ee2e957ef2"),
    item: 'sweater',
    stock: [ { size: 'small', quantity: 4 }, { size: 'large', quantity: 7 } ]
  },
  {
    _id: ObjectId("63449793b1fac2ee2e957ef3"),
    item: 'vest',
    stock: [ { size: 'small', quantity: 6 }, { size: 'large', quantity: 1 } ]
  }
]
```

当对对象数组进行降序排序时，MongoDB 首先根据具有最高值元素的字段进行排序。要了解更多信息，请参阅[数组排序行为。](https://www.mongodb.com/docs/v7.0/release-notes/3.6-compatibility/#std-label-3.6-sort-behavior-compatibility)

> 笔记:
>
> **索引排序顺序**
>
> 对于单字段索引，索引键的排序顺序（升序或降序）并不重要，因为 MongoDB 可以沿任一方向遍历索引。

### 了解更多

- [在标量值数组上创建多键索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/create-multikey-index-basic/#std-label-index-create-multikey-basic)
- [了解多键索引范围。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/multikey-index-bounds/#std-label-indexes-multikey-bounds)