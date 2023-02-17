# 使用一个视图来连接两个集合

在本页面

[Example]()



 可以使用[`$lookup`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup) 在两个集合上创建一个视图，然后对该视图运行查询。

## 例子

 创建两个样例集合，`inventory` and `orders`:

```javascript
db.inventory.insertMany( [
   { prodId: 100, price: 20, quantity: 125 },
   { prodId: 101, price: 10, quantity: 234 },
   { prodId: 102, price: 15, quantity: 432 },
   { prodId: 103, price: 17, quantity: 320 }
] )

db.orders.insertMany( [
   { orderId: 201, custid: 301, prodId: 100, numPurchased: 20 },
   { orderId: 202, custid: 302, prodId: 101, numPurchased: 10 },
   { orderId: 203, custid: 303, prodId: 102, numPurchased: 5 },
   { orderId: 204, custid: 303, prodId: 103, numPurchased: 15 },
   { orderId: 205, custid: 303, prodId: 103, numPurchased: 20 },
   { orderId: 206, custid: 302, prodId: 102, numPurchased: 1 },
   { orderId: 207, custid: 302, prodId: 101, numPurchased: 5 },
   { orderId: 208, custid: 301, prodId: 100, numPurchased: 10 },
   { orderId: 209, custid: 303, prodId: 103, numPurchased: 30 }
] )
```



###  创建连接视图

 这个命令使用 [`db.createView()`](https://www.mongodb.com/docs/v6.0/reference/method/db.createView/#mongodb-method-db.createView) 基于`orders`集合创建一个名为 `sales` 的新视图:

```javascript
db.createView( "sales", "orders", [
   {
      $lookup:
         {
            from: "inventory",
            localField: "prodId",
            foreignField: "prodId",
            as: "inventoryDocs"
         }
   },
   {
      $project:
         {
           _id: 0,
           prodId: 1,
           orderId: 1,
           numPurchased: 1,
           price: "$inventoryDocs.price"
         }
   },
      { $unwind: "$price" }
] )
```

在这个示例中：

-  [`$lookup`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup) 阶段使用`orders`集合中的`prodId`字段来` "join"` `inventory`集合中具有匹配`prodId`字段的文档。
- 匹配的文档作为数组添加到`inventoryDocs`字段中。
-  [`$project`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project) 阶段选择可用字段的子集。
-  [`$unwind`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/unwind/#mongodb-pipeline-pipe.-unwind) 阶段将`price`字段从数组转换为标量值。



  `sales`视图中的文档包括:

```javascript
{ orderId: 201, prodId: 100, numPurchased: 20, price: 20 },
{ orderId: 202, prodId: 101, numPurchased: 10, price: 10 },
{ orderId: 203, prodId: 102, numPurchased: 5, price: 15 },
{ orderId: 204, prodId: 103, numPurchased: 15, price: 17 },
{ orderId: 205, prodId: 103, numPurchased: 20, price: 17 },
{ orderId: 206, prodId: 102, numPurchased: 1, price: 15 },
{ orderId: 207, prodId: 101, numPurchased: 5, price: 10 },
{ orderId: 208, prodId: 100, numPurchased: 10, price: 20 },
{ orderId: 209, prodId: 103, numPurchased: 30, price: 17 }
```



### 查询视图

如果需要查询每种产品的销售总额，可在视图中查询:

```javascript
db.sales.aggregate( [
   {
      $group:
         {
            _id: "$prodId",
            amountSold: { $sum: { $multiply: [ "$price", "$numPurchased" ] } }
         }
   }
] )
```

输出为:

```javascript
[
  { _id: 102, amountSold: 90 },
  { _id: 101, amountSold: 150 },
  { _id: 103, amountSold: 1105 },
  { _id: 100, amountSold: 600 }
]
```





原文链接：https://www.mongodb.com/docs/v6.0/core/views/join-collections-with-view/

译者：杨帅