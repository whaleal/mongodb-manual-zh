# 清除`jumbo`标记

如果 MongoDB 无法拆分超过指定范围大小的块，MongoDB 会将该块标记为巨型块。

以下过程概述了手动清除标志的步骤 `jumbo`。

## 程序



### 可分割块

从块中清除`jumbo`标志的首选手动方法是尝试拆分块。如果块是可分割的，MongoDB 会在成功分割块后删除该标志。



#### 1.连接到`mongos`。

连接`mongosh`到一个`mongos`。



#### 2.找到`jumbo`块。

运行`sh.status(true)`以找到标记为 `jumbo`的块。

```shell
sh.status(true)
```



例如，sh.status(true) 的以下输出显示具有分片键范围的块`{ "x" : 2 } -->> { "x" : 4 }`是 `jumbo`。

```shell
 --- Sharding Status ---
   sharding version: {
      ...
   }
   shards:
      ...
   databases:
      ...
         test.foo
            shard key: { "x" : 1 }
         chunks:
              shard-b  2
              shard-a  2
         { "x" : { "$minKey" : 1 } } -->> { "x" : 1 } on : shard-b Timestamp(2, 0)
         { "x" : 1 } -->> { "x" : 2 } on : shard-a Timestamp(3, 1)
         { "x" : 2 } -->> { "x" : 4 } on : shard-a Timestamp(2, 2) jumbo
         { "x" : 4 } -->> { "x" : { "$maxKey" : 1 } } on : shard-b Timestamp(3, 0)
```



#### 3.拆分`jumbo`块。

使用`sh.splitAt()`或`sh.splitFind()`来拆分`jumbo`块。

```shell
sh.splitAt( "test.foo", { x: 3 })
```



MongoDB在成功拆分块后删除`jumbo`标志。

### 不可分割的块

在某些情况下，MongoDB 无法拆分不再有的`jumbo`块，例如具有一系列单个分片键值的块。因此，您不能拆分块来清除标志。

在这种情况下，您可以更改分片键以使块可以被分割或手动清除标志。

#### 细化分片键

从 4.4 开始，MongoDB 提供了 `refineCollectionShardKey`命令。使用 `refineCollectionShardKey`命令，您可以通过向现有键添加一个或多个后缀字段来优化集合的分片键。通过向分片键添加新字段，不可分割的巨型块可以变得可分割。



##### 1.连接到`mongos`。

连接`mongosh`到一个`mongos`。



##### 2.找到`jumbo`块。

运行`sh.status(true)`以找到标记为`jumbo`的块 。

```shell
sh.status(true)
```



例如，以下输出`sh.status(true)`显示对于分片集合`test.orders`，具有分片键范围的块`{ "status" : "A" } -->> { "status" : "D" }`和具有范围的块`{ "status" : "D" } -->> { "status" : "P" }`都是`jumbo`。

```shell
 --- Sharding Status ---
   sharding version: {
     ...
   }
   shards:
     ...
   databases:
     ...
     test.orders
        shard key: { "status" : 1 }
        unique: false
        balancing: true
        chunks:
                shardA       2
                shardB       2
        { "status" : { "$minKey" : 1 } } -->> { "status" : "A" } on : shardB Timestamp(3, 0)
        { "status" : "A" } -->> { "status" : "D" } on : shardA Timestamp(5, 1) jumbo
        { "status" : "D" } -->> { "status" : "P" } on : shardA Timestamp(4, 2) jumbo
        { "status" : "P" } -->> { "status" : { "$maxKey" : 1 } } on : shardB Timestamp(5, 0)
```



##### 3.细化`test.orders`集合的分片键。

要解决 key 的低基数问题`status`，请优化`test.orders`集合的 key 。例如，在当前分片键上添加 `order_id`和`customer_id`字段作为后缀；即分片键将在`{ status: 1, order_id: 1, customer_id: 1 }`细化之后。

1. 首先，如果索引尚不存在，则`创建索引`支持分片键`{ status: 1, order_id: 1, customer_id: 1 }` 。

   ```shell
   db.orders.createIndex( { status: 1, order_id: 1, customer_id: 1 } )
   ```

   

2. 在`admin`数据库中，运行`refineCollectionShardKey`命令将`order_id`和`customer_id`字段作为后缀添加到现有键：

   ```shell
   db.adminCommand( {
      refineCollectionShardKey: "test.orders",
      key: { status: 1, order_id: 1, customer_id: 1 }
   } )
   ```

   

`refineCollectionShardKey`命令更新 块范围和 区域范围以合并新字段而不修改现有键字段的范围值。也就是说，分片键的细化不会立即影响跨分片或区域的块分布。任何未来的块拆分或迁移都会作为常规分片操作的一部分发生。



>## 提示
>
>优化分片键后，可能并非集合中的所有文档都具有后缀字段。要填充缺少的分片键字段，
>
>在细化分片键之前，请确保集合中的所有或大多数文档都具有后缀字段，如果可能的话，以避免之后必须填充该字段。



#### 手动清除`jumbo`不可分割块的标志

您可以使用以下步骤手动清除标志。



>## 重要的
>
>如果您清除`jumbo`仍然超过块大小的块的标志，MongoDB 将重新标记该块，因为`jumbo`MongoDB 试图移动该块。
>
>MongoDB 4.2.3 and laterMongoDB 4.2.2 或者更早



从 4.2.3 版本（和 4.0.15）开始，MongoDB 提供了 `clearJumboFlag`手动清除 `jumbo`标志的命令。



>## 重要的
>
>仅在以下情况下使用此方法首选方法不*适用*。



##### 1.连接到`mongos`。

连接`mongosh`到一个`mongos`。



##### 2.找到`jumbo`块。

运行`sh.status(true)`以找到标记为`jumbo`的块 。

```shell
sh.status(true)
```



例如，sh.status(true) 的以下输出显示具有分片键范围的块`{ "x" : 2 } -->> { "x" : 3 }`是 `jumbo`。

```shell
 --- Sharding Status ---
   sharding version: {
      ...
   }
   shards:
      ...
   databases:
      ...
         test.foo
            shard key: { "x" : 1 }
         chunks:
              shard-b  2
              shard-a  2
         { "x" : { "$minKey" : 1 } } -->> { "x" : 1 } on : shard-b Timestamp(2, 0)
         { "x" : 1 } -->> { "x" : 2 } on : shard-a Timestamp(3, 1)
         { "x" : 2 } -->> { "x" : 3 } on : shard-a Timestamp(2, 2) jumbo
         { "x" : 3 } -->> { "x" : { "$maxKey" : 1 } } on : shard-b Timestamp(3, 0)
```



##### 3.运行`clearJumboFlag`命令。

从`admin`数据库运行`clearJumboFlag`传入分片集合的命名空间，然后：

- 块的边界`jumbo`：

  ```shell
  db.adminCommand( {
     clearJumboFlag: "test.foo",
     bounds: [{ "x" : 2 }, { "x" : 3 }]
  
  })
  ```

  

- 包含在块中的分片键和值的[查找](https://www.mongodb.com/docs/manual/reference/command/clearJumboFlag/#std-label-clearJumboFlag-find)文档`jumbo`：

  ```shell
  db.adminCommand( {
     clearJumboFlag: "test.foo",
     find: { "x" : 2 }
  })
  ```

  

  

  >## 笔记
  >
  >如果集合使用散列分片键，则不要将该 `find`字段在`clearJumboFlag`里使用. 对于散列分片键，请改用该`bounds`字段。

  ## 

原文 -  https://docs.mongodb.com/manual/tutorial/clear-jumbo-flag/

译者：陆文龙

