## 2dsphere 索引版本

2dsphere 索引有以下版本：

| 2dsphere 索引版本 | 描述                                                         |
| :---------------- | :----------------------------------------------------------- |
| 版本3             | MongoDB 3.2 引入了 2dsphere 索引的版本 3。版本 3 是在 MongoDB 3.2 及更高版本中创建的 2dsphere 索引的默认版本。 |
| 版本2             | MongoDB 2.6 引入了 2dsphere 索引的版本 2。版本 2 是在 MongoDB 2.6 至 3.0 中创建的 2dsphere 索引的默认版本。 |
| 版本1             | MongoDB 2.4 引入了 2dsphere 索引的版本 1。MongoDB 2.4 仅支持版本 1。 |

### 更改索引版本

> **重要的**
>
> 尽可能始终使用默认索引版本。仅在出于兼容性原因需要时才覆盖默认版本。

要覆盖默认版本并为 2dsphere 索引指定不同版本，请`2dsphereIndexVersion`在创建索引时设置该选项：

```
db.<collection>.createIndex(
   { <field>: "2dsphere" },
   { "2dsphereIndexVersion": <version> }
)
```

### 例子

以下命令在 `address`字段上创建版本 2 2dsphere 索引：

```
db.test.createIndex(
   { "address": "2dsphere" },
   { "2dsphereIndexVersion": 2 }
 )
```
