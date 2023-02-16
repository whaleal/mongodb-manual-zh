# 重新同步副本集的节点

当副本集节点的复制过程落后太多以至于[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)覆盖该节点尚未复制的 oplog 条目时，副本集节点就会变得“陈旧”。该节点无法跟上并变得“陈旧”。发生这种情况时，您必须通过删除其数据并执行 [初始同步来完全重新同步该节点](https://www.mongodb.com/docs/manual/core/replica-set-sync/#std-label-replica-set-initial-sync)。

本教程解决了重新同步陈旧成员和使用来自另一个节点的种子数据创建新节点的问题，这两者都可用于恢复副本集成员。同步成员时，请选择系统具有移动大量数据的带宽的时间。在低使用率或维护窗口期间安排同步。

MongoDB 提供了两个用于执行初始同步的选项：

- [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)使用空数据目录重新启动，让 MongoDB 的正常初始同步功能恢复数据。这是更简单的选项，但可能需要更长的时间来替换数据。

  看[自动同步节点。](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/#std-label-replica-set-auto-resync-stale-member)

- 使用副本集中另一个成员的最新数据目录的副本重新启动机器。此过程可以更快地替换数据，但需要更多手动步骤。

  看[通过从另一个节点复制数据文件来同步。](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/#std-label-replica-set-resync-by-copying)

## 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/#procedures)

>## NOTE
>
>为防止更改写入仲裁，一次不要轮换一个以上的副本集节点。



### 自动同步节点![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/#automatically-sync-a-member)

>## WARNING
>
>在初始同步期间，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)删除 [`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)目录的内容。



此过程依赖于 MongoDB 的 [副本集同步](https://www.mongodb.com/docs/manual/core/replica-set-sync/)的常规过程。这将存储节点的当前数据。有关 MongoDB 初始同步过程的概述，请参阅 [副本集同步](https://www.mongodb.com/docs/manual/core/replica-set-sync/)部分。

初始同步操作会影响集合中的其他节点，并为主节点创建额外的流量。同步节点需要集合中的另一个可访问且最新的节点。

如果实例没有数据，您可以按照 [Add Members to a Replica Set](https://www.mongodb.com/docs/manual/tutorial/expand-replica-set/)或 [Replace a Replica Set Member](https://www.mongodb.com/docs/manual/tutorial/replace-replica-set-member/)过程将新节点添加到副本集。

您还可以[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)通过在没有目录内容的情况下重新启动实例来强制已经是集合节点的 a 执行初始同步 [`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)：

1. 停止节点的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例。为确保干净关闭，请使用[`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 来自[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)或者在 Linux 系统上， [`mongod --shutdown`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--shutdown)选项。
2. （可选）备份节点[`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)目录中的所有数据和子目录。如果不需要完整备份，请考虑仅备份`diagnostic.data` 目录以在出现问题时保留可能有用的故障排除数据。有关详细信息，请参阅[全时诊断数据捕获](https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/#std-label-ftdc-stub)。
3. 从节点目录中删除所有数据和子目录 [`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)。
4. [重新启动 mongod 进程。](https://www.mongodb.com/docs/manual/tutorial/manage-mongodb-processes/)

此时，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)执行初始同步。初始同步过程的长度取决于数据库的大小和副本集节点之间的网络延迟。



### 通过从另一个节点复制数据文件来同步[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/#sync-by-copying-data-files-from-another-member)

这种方法使用来自副本集现有成员的数据文件“播种”新成员或陈旧节点。数据文件**必须**足够新以允许新节点赶上操作 [日志](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-oplog)。否则，节点将需要执行初始同步。

#### 复制数据文件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/#copy-the-data-files)

您可以将数据文件捕获为快照或直接副本。但是，在大多数情况下，您无法将数据文件从一个正在运行的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例复制到另一个实例，因为数据文件会在文件复制操作期间更改。

>## IMPORTANT
>
>如果复制数据文件，请确保您的副本包含`local`数据库的内容。

你*不能*使用[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)数据文件的备份： **只有快照备份**。有关捕获正在运行的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例的一致快照的方法，请参阅 [MongoDB 备份方法](https://www.mongodb.com/docs/manual/core/backups/)文档。

#### 同步节点[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/#sync-the-member)

从“种子”源复制数据文件后， [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)使用新实例启动实例[`members[n\]._id`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-._id)并允许它应用操作日志中的所有操作，直到它反映副本集的当前状态。要查看副本集的当前状态，请使用[`rs.printSecondaryReplicationInfo()`](https://www.mongodb.com/docs/manual/reference/method/rs.printSecondaryReplicationInfo/#mongodb-method-rs.printSecondaryReplicationInfo)或 [`rs.status()`。](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)

←  [强制节点成为主节点](https://www.mongodb.com/docs/manual/tutorial/force-member-to-be-primary/)                 [配置副本集标签集](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/)



原文链接 - https://docs.mongodb.com/manual/tutorial/resync-replica-set-member/ 

译者：陆文龙

