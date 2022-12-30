 按位置分割数据[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#segmenting-data-by-location)

在分片集群中，您可以根据分[片键创建分片数据](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard-key)[区域](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-zone)。您可以将每个区域与集群中的一个或多个分片相关联。一个分片可以关联任意数量的区域。在平衡集群中，MongoDB仅将区域覆盖的[块](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-chunk)迁移 到与该区域关联的那些分片。

>[TIP]
>
>*在4.0.3版中更改*：通过在对空集合或不存在的集合进行分片*之前*定义区域和区域范围，分片集合操作会为定义的区域范围创建块以及任何其他块以覆盖整个范围分片键值并根据区域范围执行初始块分配。这种块的初始创建和分布允许更快地设置分区分片。在初始分配之后，平衡器管理接下来的块分配。有关示例，请参阅[为空或不存在的集合预定义区域和区域范围。](https://www.mongodb.com/docs/manual/reference/method/sh.updateZoneKeyRange/#std-label-pre-define-zone-range-example)

本教程使用[Zones](https://www.mongodb.com/docs/manual/core/zone-sharding/#std-label-zone-sharding)根据地理区域对数据进行分段。

以下是按地理区域划分数据的一些示例用例：

- 必须按国家/地区划分用户数据的应用程序
- 必须按国家/地区分配资源的数据库

下图说明了一个分片集群，它使用地理区域来管理和满足数据分段要求。

![基于区域的地理分布图](https://www.mongodb.com/docs/manual/images/sharding-segmenting-data-by-location-overview.bakedsvg.svg)

**设想**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#scenario)

金融聊天应用程序记录消息，跟踪原始用户所在的国家/地区。应用程序将日志存储在集合`chat`下的数据库中。`messages`聊天包含必须按国家/地区分段的信息，以便让该国家/地区的本地服务器为该国家/地区的用户提供读写请求。可以为一组国家分配相同的区域以共享资源。

该应用目前在美国、英国和德国拥有用户。该 `country`字段代表用户所在的国家 /地区[ISO 3166-1 阿尔法-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 两个字符的国家代码。

以下文档代表三个聊天消息的部分视图：

```json
{
  "_id" : ObjectId("56f08c447fe58b2e96f595fa"),
  "country" : "US",
  "userid" : 123,
  "message" : "Hello there",
  ...,
}
{
  "_id" : ObjectId("56f08c447fe58b2e96f595fb"),
  "country" : "UK",
  "userid" : 456,
  "message" : "Good Morning"
  ...,
}
{
  "_id" : ObjectId("56f08c447fe58b2e96f595fc"),
  "country" : "DE",
  "userid" : 789,
  "message" : "Guten Tag"
  ...,
}
```

**片键**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#shard-key)

该`messages`集合使用`{ country : 1, userid : 1 }`复合索引作为分片键。

每个文档中的`country`字段允许为每个不同的国家/地区值创建一个区域。

该`userid`字段为相对于 的分片键提供了高[基数](https://www.mongodb.com/docs/manual/core/sharding-choose-a-shard-key/#std-label-shard-key-cardinality) 和[低频](https://www.mongodb.com/docs/manual/core/sharding-choose-a-shard-key/#std-label-shard-key-frequency)分量`country`。

有关[选择分片键](https://www.mongodb.com/docs/manual/core/sharding-choose-a-shard-key/#std-label-sharding-shard-key-requirements)的更多一般说明，请参阅选择分片键。

**结构**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#architecture)

分片集群在两个数据中心有分片——一个在欧洲，一个在北美。

![用于支持地理分布架构的区域图](https://www.mongodb.com/docs/manual/images/sharding-segmenting-data-by-location-architecture.bakedsvg.svg)

**区域**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#zones)

此应用程序需要每个数据中心一个区域。

- `EU`- 欧洲数据中心

  部署在该数据中心上的分片被分配到该`EU`区域。对于使用`EU`数据中心进行本地读写的每个国家/地区，为该`EU`区域创建一个区域范围：的下限`{ "country" : <country>, "userid" : MinKey }`的上限`{ "country" : <country>, "userid" : MaxKey }`

- `NA`- 北美数据中心

  部署在该数据中心上的分片被分配到该`NA`区域。对于使用`NA`数据中心进行本地读写的每个国家/地区，为该`NA`区域创建一个区域范围：的下限`{ "country" : <country>, "userid" : MinKey }`的上限`{ "country" : <country>, "userid" : MaxKey }`

>[NOTE]
>
>[`MinKey`](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#mongodb-bsontype-MinKey)和[`MaxKey`](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#mongodb-bsontype-MaxKey)值是为比较保留的特殊值

**写操作**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#write-operations)

对于区域，如果插入或更新的文档与配置的区域匹配，则它只能写入该区域内的分片。

MongoDB 可以将与配置区域不匹配的文档写入集群中的任何分片。

>[NOTE]
>
>上述行为要求集群处于稳定状态，没有任何块违反配置的区域。请参阅以下部分[平衡器](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#std-label-sharding-segmenting-data-by-location-balancer)想要查询更多的信息。

**读取操作**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#read-operations)

如果查询至少包含该`country`字段，MongoDB 可以将查询路由到特定的分片。

例如，MongoDB 可以尝试对以下查询进行有[针对性的读取操作：](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-sharding-mongos-targeted)

```javascript
chatDB = db.getSiblingDB("chat")
chatDB.messages.find( { "country" : "UK" , "userid" : "123" } )
```

没有`country`字段的查询执行[广播操作。](https://www.mongodb.com/docs/manual/core/sharded-cluster-query-router/#std-label-sharding-mongos-broadcast)

**平衡器**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#balancer)

[平衡器](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-sharding-balancing) 根据任何已配置的区域将块[迁移](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#std-label-sharding-chunk-migration)到适当的分片。在迁移之前，分片可能包含违反配置区域的块。平衡完成后，分片应仅包含其范围不违反其分配区域的块。

添加或删除区域或区域范围可能会导致块迁移。根据数据集的大小和区域或区域范围影响的块数，这些迁移可能会影响集群性能。考虑在特定的预定窗口期间运行您的[平衡器。](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-sharding-balancing)有关如何设置计划窗口的教程，请参阅[计划平衡窗口。](https://www.mongodb.com/docs/manual/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-schedule-balancing-window)

**安全**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#security)

对于使用[Role-Based Access Control](https://www.mongodb.com/docs/manual/core/authorization/#std-label-authorization)运行的分片集群，作为至少具有数据库[`clusterManager`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterManager)角色的用户进行身份验证`admin`。

**步骤**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#procedure)

您必须连接到 a[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)才能创建区域和区域范围。您不能通过直接连接到分片来创建区域或区域 [范围。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)

1. **禁用平衡器（可选）**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#disable-the-balancer-optional)

   为了减少性能影响，可以在集合上禁用平衡器，以确保在配置新区域时不会发生迁移。

   使用[`sh.disableBalancing()`](https://www.mongodb.com/docs/manual/reference/method/sh.disableBalancing/#mongodb-method-sh.disableBalancing)，指定集合的命名空间，以停止平衡器。

   ```shell
   sh.disableBalancing("chat.message")
   ```

   用于[`sh.isBalancerRunning()`](https://www.mongodb.com/docs/manual/reference/method/sh.isBalancerRunning/#mongodb-method-sh.isBalancerRunning)检查平衡器进程当前是否正在运行。等到任何当前的平衡回合完成后再继续。

2. **将每个分片添加到适当的区域**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#add-each-shard-to-the-appropriate-zone)

   将北美数据中心的每个分片添加到`NA`区域中。

   ```shell
   sh.addShardTag(<shard name>, "NA")
   ```

   将欧洲数据中心中的每个分片添加到`EU`区域中。

   ```shell
   sh.addShardTag(<shard name>, "EU")
   ```

   您可以通过运行[`sh.status()`。](https://www.mongodb.com/docs/manual/reference/method/sh.status/#mongodb-method-sh.status)查看分配给任何给定分片的区域 

3. **定义每个区域的范围**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#define-ranges-for-each-zone)

   对于分片键值 where ，定义一个分片键范围并使用该 方法`country : US`将其关联到区域。此方法需要：`NA`[`sh.addTagRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.addTagRange/#mongodb-method-sh.addTagRange)

   - 目标集合的完整命名空间。
   - 范围的包含下限。
   - 范围的唯一上限。
   - 区域的名称。

   ```shell
   sh.addTagRange( 
     "chat.messages",
     { "country" : "US", "userid" : MinKey },
     { "country" : "US", "userid" : MaxKey }, 
     "NA"
   )
   ```

   对于分片键值 where ，定义一个分片键范围并使用该 方法`country : UK`将其关联到区域。此方法需要：`EU`[`sh.addTagRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.addTagRange/#mongodb-method-sh.addTagRange)

   - 目标集合的完整命名空间。
   - 范围的包含下限。
   - 范围的唯一上限。
   - 区域的名称。

   ```shell
   sh.addTagRange( 
     "chat.messages",
     { "country" : "UK", "userid" : MinKey },
     { "country" : "UK", "userid" : MaxKey }, 
     "EU"
   )
   ```

   对于分片键值 where ，定义一个分片键范围并使用该 方法`country : DE`将其关联到区域。此方法需要：`EU`[`sh.addTagRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.addTagRange/#mongodb-method-sh.addTagRange)

   - 目标集合的完整命名空间。
   - 范围的包含下限。
   - 范围的唯一上限。
   - 区域的名称。

   ```shell
   sh.addTagRange( 
     "chat.messages",
     { "country" : "DE", "userid" : MinKey },
     { "country" : "DE", "userid" : MaxKey }, 
     "EU"
   )
   ```

   [`MinKey`](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#mongodb-bsontype-MinKey)和[`MaxKey`](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#mongodb-bsontype-MaxKey)值是为比较保留的特殊值。[`MinKey`](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#mongodb-bsontype-MinKey)总是比其他所有可能的值都低，而[`MaxKey`](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#mongodb-bsontype-MaxKey)总是比其他所有可能的值都高。配置的范围捕获每个用户的每个`device`.

   `country : UK` 和 `country : DE` 都被分配到欧盟区域。 这会将任何文档与 `UK` 或 `DE` 相关联，作为欧盟数据中心的国家/地区值。

4. **启用平衡器（可选）**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#enable-the-balancer-optional)

   如果在前面的步骤中禁用了平衡器，请在完成此过程后重新启用平衡器以重新平衡集群。

   使用[`sh.enableBalancing()`](https://www.mongodb.com/docs/manual/reference/method/sh.enableBalancing/#mongodb-method-sh.enableBalancing)，指定集合的命名空间，以启动平衡器。

   ```shell
   sh.enableBalancing("chat.message")
   ```

   [`sh.isBalancerRunning()`](https://www.mongodb.com/docs/manual/reference/method/sh.isBalancerRunning/#mongodb-method-sh.isBalancerRunning)用于检查平衡器进程当前是否正在运行。

5. **查看更改**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#review-the-changes)

   下一次[平衡器](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-sharding-balancing)运行时，它会在必要时拆分块，并根据配置的区域跨分片[迁移块。](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#std-label-sharding-chunk-migration)

   平衡完成后：

   - 区域中的分片 `NA`应该只包含带有 `country : US`, 和
   - 区域中的分片`EU`应仅包含带有 `country : UK`或的文档`country : DE`。

   值为 、 或 以外的文档可以驻留 `country`在集群中的任何分片上。`US``UK``DE`

   要确认块分布，请运行[`sh.status()`.](https://www.mongodb.com/docs/manual/reference/method/sh.status/#mongodb-method-sh.status)

**更新区域**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#updating-zones)

该应用程序需要以下更新：

- `country : UK`现在必须将文档关联到新的`UK` 数据中心。`EU`必须迁移数据中心中的任何数据
- 聊天应用程序现在支持墨西哥用户。文档 `country : MX`必须路由到`NA`数据中心。

执行以下过程以更新区域范围。

1. **禁用平衡器（可选）**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#disable-the-balancer-optional-1)

   为了减少性能影响，可以在集合上禁用平衡器，以确保在配置新区域或删除旧区域时不会发生迁移。

   使用[`sh.disableBalancing()`](https://www.mongodb.com/docs/manual/reference/method/sh.disableBalancing/#mongodb-method-sh.disableBalancing)，指定集合的命名空间，停止平衡器

   ```shell
   sh.disableBalancing("chat.messages")
   ```

   [`sh.isBalancerRunning()`](https://www.mongodb.com/docs/manual/reference/method/sh.isBalancerRunning/#mongodb-method-sh.isBalancerRunning)用于检查平衡器进程当前是否正在运行。等到任何当前的平衡回合完成后再继续。

2. **添加新`UK`区域**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#add-the-new-uk-zone)

   `UK`将数据中心中的每个分片添加到`UK`区域中。

   ```shell
   sh.addShardTag("<shard name>", "UK")
   ```

   您可以通过运行[`sh.status()`](https://www.mongodb.com/docs/manual/reference/method/sh.status/#mongodb-method-sh.status)查看分配给任何给定分片的区域 。

3. **删除旧的区域范围**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#remove-the-old-zone-range)

   `UK`使用该 [`sh.removeTagRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.removeTagRange/#mongodb-method-sh.removeTagRange)方法删除与国家关联的旧区域范围。此方法需要：

   - 目标集合的完整命名空间。
   - 范围的包含下限。
   - 范围的唯一上限。
   - 区域的名称。

   ```shell
   sh.removeTagRange(
     "chat.messages",
     { "country" : "UK", "userid" : MinKey },
     { "country" : "UK", "userid" : MaxKey }
     "EU"
   )
   ```

4. **添加新的区域范围**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#add-new-zone-ranges)

   对于分片键值 where ，定义一个分片键范围并使用该 方法`country : UK`将其关联到区域。此方法需要：`UK`[`sh.addTagRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.addTagRange/#mongodb-method-sh.addTagRange)

   - 目标集合的完整命名空间。
   - 范围的包含下限。
   - 范围的唯一上限。
   - 区域的名称。

   ```shell
   sh.addTagRange( 
     "chat.message",
     { "country" : "UK", "userid" : MinKey },
     { "country" : "UK", "userid" : MaxKey }, 
     "UK"
   )
   ```

   对于分片键值 where ，定义一个分片键范围并使用该 方法`country : MX`将其关联到区域。此方法需要：`NA`[`sh.addTagRange()`](https://www.mongodb.com/docs/manual/reference/method/sh.addTagRange/#mongodb-method-sh.addTagRange)

   - 目标集合的完整命名空间。
   - 范围的包含下限。
   - 范围的唯一上限。
   - 区域的名称。

   ```shell
   sh.addTagRange( 
     "chat.messages",
     { "country" : "MX", "userid" : MinKey },
     { "country" : "MX", "userid" : MaxKey }, 
     "NA"
   )
   ```

   [`MinKey`](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#mongodb-bsontype-MinKey)和[`MaxKey`](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#mongodb-bsontype-MaxKey)值是为比较保留的特殊值。[`MinKey`](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#mongodb-bsontype-MinKey)总是比其他所有可能的值都低，而[`MaxKey`](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#mongodb-bsontype-MaxKey)总是比其他所有可能的值都高。这确保这两个范围捕获 的整个可能值空间`userid`。

5. **启用平衡器（可选）**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#enable-the-balancer-optional-1)

   如果在前面的步骤中禁用了平衡器，请在完成此过程后重新启用平衡器以重新平衡集群。

   使用[`sh.enableBalancing()`](https://www.mongodb.com/docs/manual/reference/method/sh.enableBalancing/#mongodb-method-sh.enableBalancing)，指定集合的命名空间，启动平衡器

   ```shell
   sh.enableBalancing("chat.messages")
   ```

   [`sh.isBalancerRunning()`](https://www.mongodb.com/docs/manual/reference/method/sh.isBalancerRunning/#mongodb-method-sh.isBalancerRunning)用于检查平衡器进程当前是否正在运行。

6. **查看更改**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/sharding-segmenting-data-by-location/#review-the-changes-1)

   下一次[平衡器](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-sharding-balancing)运行时，它会在必要时拆分块，并根据配置的区域跨分片[迁移块。](https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/#std-label-sharding-chunk-migration)

   平衡前：

   - 区域中的分片`EU`仅包含文档 where `country : DE`or `country : UK`, and
   - 文档`country : MX`可以存储在分片集群中的任何分片上。

   平衡后：

   - 区域中的分片`EU`仅包含文档，其中 `country : DE`，
   - 区域中的分片`UK`仅包含文档 where `country : UK`, and
   - 区域中的分片`NA`仅包含 `country : US`或`country : MX`.

   值为 、 、 或 以外的文档可以驻留 在`country`集群中的任何分片上。`US``MX``UK``DE`

   要确认块分布，请运行[`sh.status()`.](https://www.mongodb.com/docs/manual/reference/method/sh.status/#mongodb-method-sh.status)

>[TIP]
>
>**也可以看看**：
>
>[区域](https://www.mongodb.com/docs/manual/core/zone-sharding/#std-label-zone-sharding)
>
>[分片集群平衡器](https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/#std-label-sharding-balancing)
>
>[部署分片集群](https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/)

 参见

原文 - [Segmenting Data by Location]( https://docs.mongodb.com/manual/tutorial/sharding-segmenting-data-by-location/ )

译者：景圣
