# 将MongoDB升级到2.4

在一般情况下，从MongoDB 2.2升级到2.4是一个二进制兼容的“下拉式”升级：关闭[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，并将其替换为运行2.4的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例。**但是**，在尝试任何升级之前，请熟悉本文档的内容，特别是[升级分片集群](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-upgrade-cluster)以及[运行2.4后恢复到2.2。](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-downgrade)

### 升级建议和核对清单

升级时，请考虑以下几点：

- 对于所有使用身份验证的部署，在升级[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例之前，请升级驱动程序（即客户端库）。

- 要升级到2.4分片集群，*必须*按照[元数据升级程序。](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-upgrade-cluster)

- 如果您使用的是2.2.0并在启用[`authorization`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-security.authorization)的情况下运行，则需要先升级到2.2.1，然后升级到2.4。看[启用`auth`运行的2.2.0部署的滚动升级限制。](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-upgrade-auth-limitation)

- 如果您有在2.4之前创建的`system.users`文档（即[`authorization`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-security.authorization)），则*必须*确保*任何*数据库中的`system.users`集合中没有`user`字段的重复值。如果您确实有带有重复用户字段的文档，则必须在升级之前删除它们。

  有关更多信息，请参阅[安全增强功能](https://www.mongodb.com/docs/upcoming/release-notes/2.4/#std-label-2.4-unique-users)。

### 将独立`mongod`实例升级到MongoDB 2.4

1. 从2.4系列中下载最新版本的二进制文件[MongoDB下载页面](http://www.mongodb.org/downloads)。有关更多信息，请参阅[Install MongoDB](https://www.mongodb.com/docs/upcoming/installation/)。
2. 关闭您的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例。将现有的二进制文件替换为2.4[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件，然后重新启动[`mongod`。](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)

### 将副本集从MongoDB 2.2升级到MongoDB 2.4

您可以通过单独升级成员来执行套装的“滚动”升级到2.4，而其他成员可以最大限度地减少停机时间。请按照以下规程操作：

1、通过关闭mongod并用2.4二进制文件替换2.2二进制文件，一次升级一个次要成员。升级mongod实例后，请等待成员恢复到SECONDARY状态，然后再升级下一个实例。要检查成员的状态，请在mongo shell中发出rs.status（）。

2、使用mongo shell方法rs.stepDown（）逐步关闭主服务器，以允许正常的故障转移过程。rs.stepDown（）加快了故障转移过程，比直接关闭主服务器更可取。

一旦主制下台，另一个成员假设`PRIMARY`状态，如[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)输出所观察到的那样，关闭上一个主制文件，用2.4二进制文件替换[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件，并开始新进程。

>笔记：
>
>复制集故障转移不是即时的，但将使该集无法读取或接受写入，直到故障转移过程完成。通常这需要10秒或更长时间。您可能希望在预定义的维护窗口内计划升级。

### 将分片集群从MongoDB 2.2升级到MongoDB 2.4

> 重要：
>
> 只有当集群**的所有**成员当前都在运行2.2的实例时，才能将分片集群升级到2.4。运行2.0的分片集群唯一支持的升级路径是通过2.2。

 一览表[![img](https://www.mongodb.com/docs/upcoming/assets/link.svg)](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#overview)

将[分片集群](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-sharded-cluster)从MongoDB版本2.2升级到2.4（或2.3）需要使用本过程中描述的`--upgrade`选项运行2.4 [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)。升级过程不需要停机。

MongoDB 2.4的升级为现有集群中所有集合和块的元数据增加了纪元。MongoDB 2.2进程能够处理时代，尽管2.2不需要它们。本规程仅适用于从2.2版本升级。早期版本的MongoDB无法正确处理纪元。看[集群元数据升级](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-sharded-cluster-meta-data-upgrade)了解更多信息。

完成元数据升级后，您可以完全升级集群的组件。停用平衡器后：

- 升级集群中的所有[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例。
- 升级所有3个[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)配置服务器实例。
- 升级每个碎片的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，一次一个。

看[升级分片集群组件](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-finalize-shard-cluster-upgrade)了解更多信息。

### 集群元数据升级

#### 注意事项

谨防集群升级过程的以下属性：

- 在开始升级之前，请确保配置文件系统中[配置数据库](https://www.mongodb.com/docs/upcoming/reference/config-database/)的可用空间至少是[配置数据库](https://www.mongodb.com/docs/upcoming/reference/config-database/)数据文件当前使用的空间量的4到5倍。

  此外，请确保[配置数据库](https://www.mongodb.com/docs/upcoming/reference/config-database/)中的所有索引都是`{v:1}`索引。如果关键索引是`{v:0}`索引，则由于`{v:0}`格式的已知问题，块分割可能会失败。`{v:0}`索引存在于使用MongoDB 2.0或更低版本创建的集群中。

  元数据升级的持续时间取决于执行升级的节点和三个配置服务器之间的网络延迟。确保升级过程和配置服务器之间的低延迟。

- 在升级过程中，您无法更改收集元数据。例如，在升级期间，**不要**执行：

  - [`sh.enableSharding()`，](https://www.mongodb.com/docs/upcoming/reference/method/sh.enableSharding/#mongodb-method-sh.enableSharding)
  - [`sh.shardCollection()`，](https://www.mongodb.com/docs/upcoming/reference/method/sh.shardCollection/#mongodb-method-sh.shardCollection)
  - [`sh.addShard()`，](https://www.mongodb.com/docs/upcoming/reference/method/sh.addShard/#mongodb-method-sh.addShard)
  - [`db.createCollection()`，](https://www.mongodb.com/docs/upcoming/reference/method/db.createCollection/#mongodb-method-db.createCollection)
  - [`db.collection.drop()`，](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.drop/#mongodb-method-db.collection.drop)
  - [`db.dropDatabase()`，](https://www.mongodb.com/docs/upcoming/reference/method/db.dropDatabase/#mongodb-method-db.dropDatabase)
  - 创建数据库的任何操作，或
  - 以任何方式修改集群元数据的任何其他操作。有关分片命令的完整列表，请参阅分片[参考](https://www.mongodb.com/docs/upcoming/reference/sharding/)。但是，请注意，并非分[页引用](https://www.mongodb.com/docs/upcoming/reference/sharding/)页面上的所有命令都会修改集群元数据。

- 一旦您升级到2.4并完成升级过程**，请勿**在集群中使用2.0 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)流程。2.0进程可能会将旧的元数据格式重新引入集群元数据。

升级后的配置数据库将比以前需要更多的存储空间，才能对[`config.chunks`](https://www.mongodb.com/docs/upcoming/reference/config-database/#mongodb-data-config.chunks)和[`config.collections`](https://www.mongodb.com/docs/upcoming/reference/config-database/#mongodb-data-config.collections)集合进行备份和工作副本。一如既往，如果存储需求增加，[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)可能需要预先分配其他数据文件。[看看我如何获得有关数据库存储使用的信息？](https://www.mongodb.com/docs/upcoming/faq/storage/#std-label-faq-tools-for-measuring-storage-use)了解更多信息。

#### 元数据升级程序

更改存储在[配置数据库](https://www.mongodb.com/docs/upcoming/reference/config-database/)中的分片集群的元数据格式，在移动到2.4时需要特殊的元数据升级过程。

在执行此过程时，请勿执行修改元数据的操作。看[将分片集群从MongoDB 2.2升级到MongoDB 2.4](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-upgrade-cluster)禁止操作的例子。

1. 在开始升级之前，请确保配置文件系统中[配置数据库](https://www.mongodb.com/docs/upcoming/reference/config-database/)的可用空间至少是[配置数据库](https://www.mongodb.com/docs/upcoming/reference/config-database/)数据文件当前使用的空间量的4到5倍。

   此外，请确保[配置数据库](https://www.mongodb.com/docs/upcoming/reference/config-database/)中的所有索引都是`{v:1}`索引。如果关键索引是`{v:0}`索引，则由于`{v:0}`格式的已知问题，块分割可能会失败。`{v:0}`索引存在于使用MongoDB 2.0或更低版本创建的集群中。

   元数据升级的持续时间取决于执行升级的节点和三个配置服务器之间的网络延迟。确保升级过程和配置服务器之间的低延迟。

   要检查索引的版本，请使用[`db.collection.getIndexes()`。](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)

   如果**配置数据库上**的任何索引是`{v:0}`，您应该通过连接到[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)来重建这些索引，并且：使用[`db.collection.reIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.reIndex/#mongodb-method-db.collection.reIndex)方法重建所有索引，或使用[`db.collection.dropIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex)和thendb[`db.collection.ensureIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.ensureIndex/#mongodb-method-db.collection.ensureIndex)删除并重建特定索引。如果您需要将`_id`索引升级到`{v:1}`请使用[`db.collection.reIndex()`。](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.reIndex/#mongodb-method-db.collection.reIndex)

   集群中的其他数据库上可能有`{v:0}`索引。

2. 关闭[分片集群](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-sharded-cluster)中的[平衡器](https://www.mongodb.com/docs/upcoming/core/sharding-balancer-administration/#std-label-sharding-balancing-internals)，如[禁用平衡器](https://www.mongodb.com/docs/upcoming/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-balancing-disable-temporarily)中所述[。](https://www.mongodb.com/docs/upcoming/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-balancing-disable-temporarily)

   > ##### 笔记:
   >
   > ##### 选修科目
   >
   > 为了在升级期间获得额外的安全性，您可以使用[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)或其他备份工具。

3. 确保没有2.0版本的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)进程在分片集群中仍然活跃。自动升级流程检查2.0个进程，但网络可用性可能会阻止最终检查。在停止或升级2.0版本的[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)进程后等待5分钟，以确认没有进程仍然有效。

4. 使用[`configDB`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-sharding.configDB)指向分片集群的[配置服务器](https://www.mongodb.com/docs/upcoming/core/sharded-cluster-config-servers/#std-label-sharding-config-server)和`--upgrade`选项启动单个2.4 [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)进程。升级过程发生在流程成为守护进程之前（即[`--fork`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#std-option-mongos.--fork)之前）。

   您可以将现有的[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例升级到2.4，或者如果您需要避免重新配置生产[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)您可以启动一个新的`mongos`实例，该实例可以到达所有配置服务器[。](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)

   以类似于以下命令启动[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)：

   ```
   mongos --configdb <config servers> --upgrade
   ```

   如果没有`--upgrade`选项2.4，在升级过程完成之前，[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)进程将无法启动。

   升级将防止在升级过程中发生任何块移动或分裂。如果有很多碎片集合，或者有其他失败过程保存的陈旧的锁，获取所有集合的锁可能需要几秒钟或几分钟。有关进度更新，请参阅日志。

5. 当[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)过程成功启动时，升级就完成了。如果[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)进程无法启动，请查看日志以获取更多信息。

   如果[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)在升级期间终止或失去与配置服务器的连接，您可以随时安全地重试升级。

   但是，如果升级在简短的关键部分失败，它们将退出并报告升级需要手动干预。要继续升级流程，您必须按照[关键部分中断后重新同步](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-upgrade-cluster-resync)程序。

   > ##### 笔记:
   >
   > ##### 选修科目
   >
   > 如果[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)日志显示等待升级锁的升级，则之前的升级过程可能仍然有效或可能异常结束。在15分钟后，没有远程活动后，[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)将强制升级锁定。如果您可以验证没有正在运行的升级进程，您可以连接到2.2[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)进程并手动强制锁定：

   ```shell
   mongo <mongos.example.net>
   ```

   ```shell
   db.getMongo().getCollection("config.locks").findOne({ _id : "configUpgrade" })
   ```

   如果本文档`process`字段中指定的进程*可验证*离线，请运行以下操作以强制锁定。

   ```shell
   db.getMongo().getCollection("config.locks").update({ _id : "configUpgrade" }, { $set : { state : 0 } })
   ```

   如果您对另一个升级操作的活动有任何疑问，等待[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)验证锁是否处于非活动状态总是更安全。除了`configUpgrade`外，[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)可能需要等待特定的集合锁。不要强制使用特定的收集锁。

6. 升级并重新启动分片集群中的其他[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)进程，*而无需*`--upgrade`选项。

   看[升级分片集群组件](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-finalize-shard-cluster-upgrade)了解更多信息。

7. [重新启用平衡器](https://www.mongodb.com/docs/upcoming/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-balancing-disable-temporarily)。您现在可以执行修改集群元数据的操作。

升级后，*不要*在分片集群中引入2.0版本的MongoDB进程。这可以将旧的元数据格式重新引入配置服务器。此升级过程所做的元数据更改将有助于防止未来版本的MongoDB中因跨版本不兼容而导致的错误。

#### 关键部分中断后重新同步

在升级中对元数据应用更改的简短关键部分，网络中断不太可能但可能阻止所有三台配置服务器验证或修改数据。如果发生这种情况，[配置服务器](https://www.mongodb.com/docs/upcoming/core/sharded-cluster-config-servers/#std-label-sharding-config-server)必须重新同步，并且启动newmongos进程可能会出现问题。[分片集群](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-sharded-cluster)将保持可访问性，但在重新同步配置服务器之前，请避免所有集群元数据更改。更改元数据的操作包括：添加碎片、删除数据库和删除集合。

>笔记：
>
>仅*当*某些东西（例如网络、电源等）在升级的简短关键部分中断升级过程时，才执行以下过程。请记住，您可以随时安全地尝试[元数据升级过程。](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-upgrade-meta-data)

要重新同步配置服务器：

1. 关闭分片集群中的[平衡器](https://www.mongodb.com/docs/upcoming/core/sharding-balancer-administration/#std-label-sharding-balancing-internals)，并停止所有元数据操作。如果您正在升级过程中（[将分片集群从MongoDB 2.2升级到MongoDB 2.4](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-upgrade-cluster)），您已经禁用了平衡器。

2. 关闭三台配置服务器中的两台，最好是[`configDB`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-sharding.configDB)字符串中列出的最后两台。例如，如果您的[`configDB`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-sharding.configDB)字符串是`configA:27019,configB:27019,configC:27019`，请关闭`configB`和`configC`。关闭最后两个配置服务器可以确保大多数[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例可以不间断地访问集群元数据。

3. [`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)活动配置服务器（`configA`）的数据文件。

4. 将停用的配置服务器（`configB`和`configC`）的数据文件移动到备份位置。

5. 创建新的空[数据目录。](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-dbpath)

6. 重新启动禁用的配置服务器，[`--dbpath`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--dbpath)指向现在空的数据目录，[`--port`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--port)指向备用端口（例如`27020`）。

7. 使用[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)将禁用文档上的数据文件从活动配置服务器（`configA`）重新填充到新端口上重新启动的配置服务器（`configB:27020,configC:27020`）。这些配置服务器现在已重新同步。

8. 在旧端口上重新启动恢复的配置服务器，将端口重置为旧设置（`configB:27019`和`configC:27019`）。

9. 在某些情况下，连接池可能会导致虚假故障，因为它们仅在尝试使用后才禁用旧连接。2.4修复了这个问题，但为了在2.2版本中避免这个问题，您可以重新启动所有[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例（一个接一个，以避免停机），并在重新启动每个碎片[副本集](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-replica-set)[原语](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-primary)之前使用[`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)方法[。](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-primary)

10. 现在，分片群集已完全重新同步;然而在你再次尝试升级过程之前，你必须使用2.2版本的mongos手动重置升级状态.首先使用mongo shell连接到2.2 mongos：

    ```
    mongo <mongos.example.net>
    ```

    然后，使用以下操作来重置升级过程：

    ```
    db.getMongo().getCollection("config.version").update({ _id : 1 }, { $unset : { upgradeState : 1 } })
    ```

11. 最后，请重试升级流程，如[将分片集群从MongoDB 2.2升级到MongoDB 2.4。](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-upgrade-cluster)

#### 升级分片集群组件

在您成功完成[元数据升级程序](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-upgrade-meta-data)，2.4 [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例启动，您可以升级MongoDB部署中的其他进程。

当平衡器仍然处于禁用状态时，请按以下顺序升级分片集群的组件：

- 以任何顺序升级集群中的所有[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例。
- 升级所有3个[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)配置服务器实例，*最后*升级[`mongos --configdb`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#std-option-mongos.--configdb)参数中*的第一个*系统。
- 升级每个碎片，一次一个，在运行[`replSetStepDown`](https://www.mongodb.com/docs/upcoming/reference/command/replSetStepDown/#mongodb-dbcommand-dbcmd.replSetStepDown)之前升级[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)次要，并升级每个碎片的主。

完成此过程后，您现在可以[重新启用平衡器。](https://www.mongodb.com/docs/upcoming/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-balancing-disable-temporarily)

### 在启用`auth`的情况下运行的2.2.0部署的滚动升级限制

MongoDB*不能*支持混合2.2.0和2.4.0或更高版本的部署。MongoDB 2.2.1版本及更高版本的进程*可以*存在于2.4系列进程的混合部署中。因此，您无法执行从MongoDB 2.2.0到MongoDB 2.4.0的滚动升级。要升级包含2.2.0组件的集群，请使用以下程序之一。

1. 对所有2.2.0进程进行滚动升级，以更新到最新的2.2系列版本（例如2.2.3）以便部署中没有在2.2.1之前出现任何流程。当部署中没有2.2.0进程时，执行2.4.0的滚动升级。
2. 停止集群中的所有进程。将所有进程升级到MongoDB的2.4系列版本，并同时启动所有进程。

### 从2.3升级到2.4

如果您使用2.3或2.4-rc（发布候选）系列中的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)，您可以安全地将这些数据库过渡到2.4.0或更高版本；*但是*，如果您在v2.4-rc2之前使用[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)创建了`2dsphere`或`text`索引，则需要重建这些索引。例如：

```shell
db.records.dropIndex( { loc: "2dsphere" } )
db.records.dropIndex( "records_text" )

db.records.ensureIndex( { loc: "2dsphere" } )
db.records.ensureIndex( { records: "text" } )
```

### MongoDB从2.4降级到以前的版本

在某些情况下，2.4和2.2 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)使用的数据文件的磁盘格式是兼容的，如果需要，您可以升级和降级。然而，2.4中的几个新功能与之前的版本不兼容：

- `2dsphere`索引与2.2及更早的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例不兼容。
- `text`索引与2.2及更早的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例不兼容。
- 使用`hashed`索引作为分键与2.2和早期[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例不兼容。
- `hashed`索引与2.0及更早的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例不兼容。

> 重要；
>
> 使用哈希碎片键分片的集合不应使用2.2[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，这不能正确支持这些集合的集群操作。

如果您已完成[分片集群的元数据升级](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-upgrade-cluster)，您可以安全地降级到2.2 MongoDBprocesses。完成升级规程后，**请勿**使用 2.0 流程。

>笔记：
>
>在分片集群中，一旦您完成了[元数据升级程序](https://www.mongodb.com/docs/upcoming/release-notes/2.4-upgrade/#std-label-2.4-upgrade-cluster)，您不能在同一集群中使用2.0[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例。
>
>如果您完成元数据升级，您可以安全地按任何顺序降级组件。再次升级时，请务必在[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例之前升级[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例。
>
>**不要在**包含2.2个组件的集群中创建`2dsphere`或`text`索引。

#### 注意事项和兼容性

如果您升级到MongoDB 2.4，然后需要使用相同的数据文件运行MongoDB 2.2，请考虑以下限制。

- 如果您使用`hashed`索引作为分片键索引，这只能在2.4下使用，您将无法查询此分片集合中的数据。此外，2.2个[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)无法正确路由使用`hashed`索引的集合的插入操作：您使用2.2 [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)插入的任何数据都不会到达正确的碎片上，并且无法通过未来的查询访问。
- 如果您*从未*创建`2dsphere`或`text`索引，您可以在给定数据集的2.4和2.2[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)之间移动；但是，在使用2.4[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)创建第一个`2dsphere`或`text`索引后，您需要使用[`--upgrade`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--upgrade)选项运行2.2[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)，并删除任何`2dsphere`或`text`索引。

#### 升级和降级程序

##### 基本降级和升级

**除**下文所述外，在2.2和2.4之间移动是一种掉落的替换：

- 使用[`--shutdown`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--shutdown)选项停止现有的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)如下：

  ```
  mongod --dbpath /var/mongod/data --shutdown
  ```

  将`/var/mongod/data`为MongoDB [`dbPath`。](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.dbPath)

- 使用相同的[`dbPath`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.dbPath)设置启动新的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)进程，例如：

  ```
  mongod --dbpath /var/mongod/data
  ```

  将`/var/mongod/data`为MongoDB [`dbPath`。](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.dbPath)

##### 创建`2dsphere`或`text`索引后降级到2.2

如果您在运行2.4 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例时创建了2dsphere或文本索引，您可以随时降级，方法是使用[`--upgrad`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--upgrade)选项启动2.2  [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)，如下所示：

```shell
mongod --dbpath /var/mongod/data/ --upgrade
```

然后，您需要使用[`db.collection.dropIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex)删除任何现有的`2dsphere`或`text`索引，例如：

```shell
db.records.dropIndex( { loc: "2dsphere" } )
db.records.dropIndex( "records_text" )
```

>警告：
>
>[`--upgrade`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--upgrade)将在您创建`2dsphere`或`text`索引的任何数据库上运行`repairDatabase`，该数据库将重建*所有*索引。

#### 对升级/降级操作进行故障诊断

如果您不使用[`--upgrade`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--upgrade)，当您尝试启动2.2 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)并创建`2dsphere`或`text`索引时，[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)将返回以下消息：

```
'need to upgrade database index_plugin_upgrade with pdfile version 4.6, new version: 4.5 Not upgrading, exiting'
```

在运行2.4时，要检查MongoDB数据库的数据文件版本，请在shell中使用以下操作：

```
db.getSiblingDB('<databasename>').stats().dataFileVersion
```

在创建`2dsphere`或`text`索引**后，**2.2和2.4的主要数据文件[1]版本为4，2.2的次要数据文件版本为`5`，2.4的次要数据文件版本为`6`。

| [1]  | 数据文件版本（即`pdfile version`）是独立的，与MongoDB的发布版本无关。 |
| ---- | ------------------------------------------------------------ |







译者：韩鹏帅
 参见

原文 - [Upgrade MongoDB to 2.4]( https://docs.mongodb.com/manual/release-notes/2.4-upgrade/ )

