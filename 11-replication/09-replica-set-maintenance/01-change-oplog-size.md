# 改变 Oplog 的大小

>## WARNING
>
>在 MongoDB 3.4 及更早版本中，oplog 通过删除和重新创建`local.oplog.rs`集合来调整大小。
>
>在 MongoDB 3.6 及更高版本中，使用 [`replSetResizeOplog`](https://www.mongodb.com/docs/manual/reference/command/replSetResizeOplog/#mongodb-dbcommand-dbcmd.replSetResizeOplog)命令调整 oplog 的大小，如本教程所示。
>
>从 MongoDB 4.0 开始，MongoDB 禁止删除 `local.oplog.rs`集合。有关此限制的更多信息，请参阅[Oplog Collection Behavior 。](https://www.mongodb.com/docs/manual/core/replica-set-oplog/#std-label-oplog-coll-behavior)
>
>此过程使用命令更改副本集每个节点上的 oplog [[ 1 \]](https://www.mongodb.com/docs/manual/tutorial/change-oplog-size/#footnote-oplog)[`replSetResizeOplog`](https://www.mongodb.com/docs/manual/reference/command/replSetResizeOplog/#mongodb-dbcommand-dbcmd.replSetResizeOplog)的大小，从[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)开始，然后再继续到 [主节点。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)
>
>*首先*对每个[辅助](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)副本集成员 执行这些步骤。更改所有次要成员的 oplog 大小后，对[主要成员执行这些步骤](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)[。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)



## A.连接到副本集节点[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-oplog-size/#a.-connect-to-the-replica-set-member)

使用连接到副本集节点['mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
mongosh --host <hostname>:<port>
```



>## NOTE
>
>如果副本集强制执行[身份验证](https://www.mongodb.com/docs/manual/core/authentication/#std-label-authentication)，则必须以具有修改数据库权限的用户身份进行身份验证 `local`，例如[`clusterManager`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterManager)或 [`clusterAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin)角色。



## B.（可选）验证oplog的当前大小[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-oplog-size/#b.--optional--verify-the-current-size-of-the-oplog)

要查看 oplog 的当前大小，请切换到`local` 数据库并[`db.collection.stats()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.stats/#mongodb-method-db.collection.stats)针对 `oplog.rs`集合运行。[`stats()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.stats/#mongodb-method-db.collection.stats)将 oplog 大小显示为[`maxSize`.](https://www.mongodb.com/docs/manual/reference/command/collStats/#mongodb-data-collStats.maxSize)

```
use local
db.oplog.rs.stats().maxSize
```



该`maxSize`字段以字节为单位显示集合大小。

## C. 改变副本集节点的oplog大小[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-oplog-size/#c.-change-the-oplog-size-of-the-replica-set-member)

使用命令调整 oplog 的大小[`replSetResizeOplog`](https://www.mongodb.com/docs/manual/reference/command/replSetResizeOplog/#mongodb-dbcommand-dbcmd.replSetResizeOplog)。是双精度 `size`值，必须大于`990`兆字节。`size`显式地投射 oplog[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), 使用 `Double()`构造函数。

以下操作将副本集节点的 oplog 大小更改为 16 GB，即 16000 MB。

```
db.adminCommand({replSetResizeOplog: 1, size: Double(16000)})
```



| [ [1](https://www.mongodb.com/docs/manual/tutorial/change-oplog-size/#ref-oplog-id1) ] | oplog 可以增长到超过其配置的大小限制以避免删除[`majority commit point`.](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.optimes.lastCommittedOpTime) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |

## D.（可选）压缩`oplog.rs`以回收磁盘空间[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/change-oplog-size/#d.--optional--compact-oplog.rs-to-reclaim-disk-space)

减小 oplog 的大小*不会*自动回收分配给原始 oplog 大小的磁盘空间。您必须 [`compact`](https://www.mongodb.com/docs/manual/reference/command/compact/#mongodb-dbcommand-dbcmd.compact)针对数据库中的`oplog.rs`集合 运行`local`以回收磁盘空间。增加 oplog 大小后`compact`在集合上运行没有任何好处。`oplog.rs`

>## IMPORTANT
>
>从 MongoDB v4.4 开始，副本集成员可以在`compact`操作进行时复制 oplog 条目。以前，oplog 复制会在压缩期间暂停。因此，建议仅在维护窗口期间执行 oplog 压缩，此时可以最小化或停止写入。在 MongoDB 4.4 及更高版本中，不再需要将 oplog 上的压缩操作限制在维护窗口，因为 oplog 复制可以在压缩期间正常继续。



不要针对主要副本集节点运行。**`compact`将[`mongo`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)shell 直接连接到主节点（而不是副本集）并运行[`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown). 如果成功，则主要步骤会下降。在[`mongo`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)shell 中，`compact`在现在的从节点上运行命令。

以下操作`compact`针对 `oplog.rs`集合运行命令：

```
use local
db.runCommand({ "compact" : "oplog.rs" } )
```



[对于强制执行身份](https://www.mongodb.com/docs/manual/core/authentication/#std-label-authentication)验证的集群，以对数据库和集合具有[`compact`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-compact)特权操作的用户身份进行身份验证。有关身份验证要求的完整文档，请参阅[Required Privileges ](https://www.mongodb.com/docs/manual/reference/command/compact/#std-label-compact-authentication)[。](https://www.mongodb.com/docs/manual/reference/command/compact/#std-label-compact-authentication)`local``oplog.rs`[`compact`](https://www.mongodb.com/docs/manual/reference/command/compact/#mongodb-dbcommand-dbcmd.compact)[`compact`](https://www.mongodb.com/docs/manual/reference/command/compact/#std-label-compact-authentication)

←  [副本集维护教程](https://www.mongodb.com/docs/manual/administration/replica-set-maintenance/)[对副本集成员执行维护](https://www.mongodb.com/docs/manual/tutorial/perform-maintence-on-replica-set-members/) →

原文链接 -  https://docs.mongodb.com/manual/tutorial/change-oplog-size/ 

译者：陆文龙

