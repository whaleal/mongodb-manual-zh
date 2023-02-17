# `Views`

在本页面

[`Use Cases`]()

[`Create and Manage Views`]()

[`Comparison with On-Demand Materialized Views`]()

[`Behavior`]()

[`Access Control`]()



 `MongoDB`视图是一个只读可查询对象，其内容由其他集合或视图上的[`aggregation pipeline`](https://www.mongodb.com/docs/v6.0/core/aggregation-pipeline/#std-label-aggregation-pipeline)定义。

`MongoDB`不会将视图内容持久化到磁盘。视图的内容在客户端查询视图时按需计算。

```javascript
**NOTE**
  	`解疑`
			 本页讨论标准视图。用于按需讨论实体化观点,参见see On-Demand Materialized Views		（https://www.mongodb.com/docs/v6.0/core/materialized-views/#std-label-manual-materialized-views）
				 为了理解视图类型之间的差异，参见Comparison with On-Demand Materialized Views（）
```



## 用例

 你可以使用视图来:

- 在员工数据集合上创建一个视图，以排除任何个人身份信息(`PII`),那么应用程序可以查询不包含任何`PII`(个人身份信息)的员工数据视图。
- 在传感器数据集合上创建视图，以添加计算字段和指标。 应用程序可以使用[`find operations`](https://www.mongodb.com/docs/v6.0/reference/method/db.collection.find/#mongodb-method-db.collection.find)查询计算数据。
- 创建连接两个包含库存和订单历史记录的集合的视图。应用程序无需管理或理解底层管道就可以查询视图。



## 创建和管理视图

要了解如何创建和管理视图，请参见以下页面:

- [`Create and Query a View`](https://www.mongodb.com/docs/v6.0/core/views/create-view/#std-label-manual-views-create)
- [`Use a View to Join Two Collections`](https://www.mongodb.com/docs/v6.0/core/views/join-collections-with-view/#std-label-manual-views-lookup)
- [`Create a View with Default Collation`](https://www.mongodb.com/docs/v6.0/core/views/specify-collation/#std-label-manual-views-collation)
- [`Modify a View`](https://www.mongodb.com/docs/v6.0/core/views/update-view/#std-label-manual-views-modify)
- [`Remove a View`](https://www.mongodb.com/docs/v6.0/core/views/drop-view/#std-label-manual-views-remove)



## `On-Demand`物化视图对照

` MongoDB`提供两种不同的视图类型: **`standard views`** 和**`on-demand materialized views`**. 这两种视图类型都从聚合管道返回结果。

- **`standard views`**是在读取视图时计算的，不存储到磁盘中。
-  **`on-demand materialized views`**存储在磁盘上并从磁盘中读取。它们使用[`$merge`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)  [`$out`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)阶段来更新保存的数据。



### `Indexes`

**`standard views`**使用底层集合的索引。 因此，您不能直接在标准视图上创建、删除或重新构建索引，也不能获得视图上的索引列表。

可以直接在**`on-demand materialized views`**上创建索引，因为它们存储在磁盘上。



### `Performance`

**`on-demand materialized views`**提供了比**`standard views`**更好的读取性能，因为它们是从磁盘读取的，而不是作为查询的一部分进行计算。 这种性能优势会随着管道的复杂性和聚合数据的大小而增加。



## 行为

下面几节描述特定于视图的行为。



### `Read Only`

视图是只读的。对视图的写操作返回错误。



### 视图管道

视图的底层聚合管道受制于阻塞排序和阻塞组操作的`100`兆字节内存限制。

 从`MongoDB 6.0`开始，默认情况下需要`100`兆以上内存的管道阶段执行将临时文件写入磁盘。在`MongoDB`的早期版本中，必须将`{allowDiskUse: true}`传递给单独的查找和聚合命令来启用此行为。

 单独的`find`和`aggregate`命令可以覆盖[`allowDiskUseByDefault`](https://www.mongodb.com/docs/v6.0/reference/parameters/#mongodb-parameter-param.allowDiskUseByDefault) 参数:

-  当`allowdiskebydefault`设置为`false`时，使用`{allowDiskUse: true}`允许将临时文件写入磁盘
- 当`allowdiskebydefault`设置为`true`时，使用`{allowDiskUse: false}`禁止将临时文件写入磁盘



### 分片视图

 如果视图的底层集合是分片的，则视图被认为是分片的。 在[`$lookup`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup) 和 [`$graphLookup`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/graphLookup/#mongodb-pipeline-pipe.-graphLookup) 操作中，不能为`from`字段指定一个分片视图。



### 时间序列集合

 时间序列集合是可写的非物化视图。视图的限制适用于时间序列集合。

有关详细信息，请参见 [Time Series Collection Limitations](https://www.mongodb.com/docs/v6.0/core/timeseries/timeseries-limitations/#std-label-manual-timeseries-collection-limitations)。



## 访问控制

如果部署强制[认证](https://www.mongodb.com/docs/v6.0/core/authentication/#std-label-authentication),[`db.createView()`](https://www.mongodb.com/docs/v6.0/reference/method/db.createView/#mongodb-method-db.createView) 要求经过身份验证的用户在数据库上拥有[`createCollection`](https://www.mongodb.com/docs/v6.0/reference/privilege-actions/#mongodb-authaction-createCollection)权限。

 但是，如果用户在数据库中拥有[`createCollection`](https://www.mongodb.com/docs/v6.0/reference/privilege-actions/#mongodb-authaction-createCollection)，并且在视图中[`find`](https://www.mongodb.com/docs/v6.0/reference/privilege-actions/#mongodb-authaction-find) 要创建的对象，则用户还必须具有以下附加权限:

- [`find`](https://www.mongodb.com/docs/v6.0/reference/privilege-actions/#mongodb-authaction-find) 在源集合或视图上
- [`find`](https://www.mongodb.com/docs/v6.0/reference/privilege-actions/#mongodb-authaction-find)  在管道中引用的任何其他集合或视图上(如果有的话)。

在数据库上具有内置 [`readWrite`](https://www.mongodb.com/docs/v6.0/reference/built-in-roles/#mongodb-authrole-readWrite) 角色的用户具有运行列出的操作所需的特权。要么创建具有所需角色的用户，要么将角色授予现有用户。







原文链接：https://www.mongodb.com/docs/v6.0/core/views/

译者：杨帅