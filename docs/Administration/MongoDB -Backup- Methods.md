# MongoDB Backup Methods
# MogoDB 备份方法

On this page
在本页

- [Back Up with Atlas](https://docs.mongodb.com/manual/core/backups/#back-up-with-atlas)
- [使用 Atlas 备份](https://docs.mongodb.com/manual/core/backups/#back-up-with-atlas)
- [Back Up with MongoDB Cloud Manager or Ops Manager](https://docs.mongodb.com/manual/core/backups/#back-up-with-mms-or-ops-manager)
- [使用 MongoDB Cloud 或者 Ops Manager 备份](https://docs.mongodb.com/manual/core/backups/#back-up-with-mms-or-ops-manager)
- [Back Up by Copying Underlying Data Files](https://docs.mongodb.com/manual/core/backups/#back-up-by-copying-underlying-data-files)
- [通过拷贝基础数据文件备份](https://docs.mongodb.com/manual/core/backups/#back-up-by-copying-underlying-data-files)
- [Back Up with `mongodump`](https://docs.mongodb.com/manual/core/backups/#back-up-with-mongodump)
- [使用 `mongodump` 备份](https://docs.mongodb.com/manual/core/backups/#back-up-with-mongodump)

When deploying MongoDB in production, you should have a strategy for capturing and restoring backups in the case of data loss events.

当在生产环境中部署 MongoDB 时，应该制定一种策略，以备在发生数据丢失事件时捕获和还原备份。

## Back Up with Atlas
## 使用 Atlas 进行备份

MongoDB Atlas, the official MongoDB cloud service, provides 2 fully-managed methods for backups:

MongoDB 官方云服务 MongoDB Atlas 提供2种完全托管的备份方法

1. [Continuous Backups](https://docs.atlas.mongodb.com/backup/continuous-backups), which take incremental backups of data in your cluster, ensuring your backups are typically just a few seconds behind the operational system. Atlas continuous backups allow you to restore from stored snapshots or from a selected point in time within the last 24 hours. You can also query a continuous backup snapshot.

1. [连续备份](https://docs.atlas.mongodb.com/backup/continuous-backups)，它对群集中的数据进行增量备份，从而确保备份通常仅比操作系统落后几秒钟。利用 Atlas 连续备份，您可以从存储的快照或最近24小时内的选定时间点还原。您还可以查询连续备份快照。

2. [Cloud Provider Snapshots](https://docs.atlas.mongodb.com/backup/cloud-provider-snapshots), which provide localized backup storage using the native snapshot functionality of the cluster’s cloud service provider.

2. [云提供商快照](https://docs.atlas.mongodb.com/backup/cloud-provider-snapshots),使用集群的云服务提供商的原生快照功能提供的本地化的备份存储。

## Back Up with MongoDB Cloud Manager or Ops Manager
## 使用 MongoDB Cloud Manage 或者 Ops Manager

MongoDB Cloud Manager is a hosted back up, monitoring, and automation service for MongoDB. [MongoDB Cloud Manager](https://www.mongodb.com/cloud/cloud-manager/?tck=docs_server) supports backing up and restoring MongoDB [replica sets](https://docs.mongodb.com/manual/reference/glossary/#term-replica-set) and [sharded clusters](https://docs.mongodb.com/manual/reference/glossary/#term-sharded-cluster) from a graphical user interface.

MongoDB Cloud Manager 是针对 MongoDB 的托管备份，监控和自动化服务。[MongoDB Cloud Manager](https://www.mongodb.com/cloud/cloud-manager/?tck=docs_server) 支持用户在图形化界面操作备份和还原 MongoDB [副本集](https://docs.mongodb.com/manual/reference/glossary/#term-replica-set)和[分片集群](https://docs.mongodb.com/manual/reference/glossary/#term-sharded-cluster).

### MongoDB Cloud Manager
### MongoDB Cloud Manager

The [MongoDB Cloud Manager](https://www.mongodb.com/cloud/cloud-manager/?tck=docs_server) supports the backing up and restoring of MongoDB deployments.

[MongoDB Cloud Manager](https://www.mongodb.com/cloud/cloud-manager/?tck=docs_server) 支持 MongoDB 部署的备份和恢复

MongoDB Cloud Manager continually backs up MongoDB [replica sets](https://docs.mongodb.com/manual/reference/glossary/#term-replica-set) and [sharded clusters](https://docs.mongodb.com/manual/reference/glossary/#term-sharded-cluster) by reading the [oplog](https://docs.mongodb.com/manual/reference/glossary/#term-oplog) data from your MongoDB deployment. MongoDB Cloud Manager creates snapshots of your data at set intervals, and can also offer point-in-time recovery of MongoDB replica sets and sharded clusters.

通过从 MongoDB 部署中读取[操作日志](https://docs.mongodb.com/manual/reference/glossary/#term-oplog)数据，MongoDB Cloud Manager 持续备份 MongoDB [副本集](https://docs.mongodb.com/manual/reference/glossary/#term-replica-set)和[分片群集](https://docs.mongodb.com/manual/reference/glossary/#term-sharded-cluster)。MongoDB Cloud Manager 会按设置的时间间隔创建数据快照，还可以提供 MongoDB 副本集和分片群集的时间点恢复。

TIP

提示

Sharded cluster snapshots are difficult to achieve with other MongoDB backup methods.

使用其他 MongoDB 备份方法很难实现分片群集快照。

To get started with MongoDB Cloud Manager Backup, sign up for [MongoDB Cloud Manager](https://www.mongodb.com/cloud/cloud-manager/?tck=docs_server). For documentation on MongoDB Cloud Manager, see the [MongoDB Cloud Manager documentation](https://docs.cloudmanager.mongodb.com/).

要开始使用 MongoDB Cloud Manager 备份，请注册 [MongoDB Cloud Manager](https://www.mongodb.com/cloud/cloud-manager/?tck=docs_server)。有关 MongoDB Cloud Manager 的文档，请参阅 [MongoDB Cloud Manager 的文档](https://docs.cloudmanager.mongodb.com/)。

### Ops Manager
### Ops Manager

With Ops Manager, MongoDB subscribers can install and run the same core software that powers [MongoDB Cloud Manager](https://docs.mongodb.com/manual/core/backups/#backup-with-mms) on their own infrastructure. Ops Manager is an on-premise solution that has similar functionality to MongoDB Cloud Manager and is available with Enterprise Advanced subscriptions.

借助 Ops Manager，MongoDB 用户可以在自己的基础架构上安装和运行驱动 [MongoDB Cloud Manager](https://docs.mongodb.com/manual/core/backups/#backup-with-mms) 的相同核心软件。Ops Manager 是一种本地解决方案，具有与 MongoDB Cloud Manager 相似的功能，可与订阅的企业版高级功能一起使用。

For more information about Ops Manager, see the [MongoDB Enterprise Advanced](https://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server) page and the [Ops Manager Manual](https://docs.opsmanager.mongodb.com/current/).

有关更多 Ops Manager，请看[MongoDB 企业版高级高级功能](https://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server) 和 [Ops Manager 操作手册](https://docs.opsmanager.mongodb.com/current/).

## Back Up by Copying Underlying Data Files
## 通过复制基础数据文件进行备份

Considerations for Encrypted Storage Engines using AES256-GCM

使用 AES256-GCM 的加密存储引擎的注意事项

For [encrypted storage engines](https://docs.mongodb.com/manual/core/security-encryption-at-rest/#encrypted-storage-engine) that use `AES256-GCM` encryption mode, `AES256-GCM` requires that every process use a unique counter block value with the key.

对于使用 `AES256-GCM` 加密模式的[加密存储引擎](https://docs.mongodb.com/manual/core/security-encryption-at-rest/#encrypted-storage-engine)，AES256-GCM 要求每个进程都使用唯一的计数器块值和密钥。

For [encrypted storage engine](https://docs.mongodb.com/manual/core/security-encryption-at-rest/#encrypted-storage-engine) configured with `AES256-GCM` cipher:

对于配置了 `AES256-GCM` 密码[加密存储引擎](https://docs.mongodb.com/manual/core/security-encryption-at-rest/#encrypted-storage-engine):

- Restoring from Hot Backup
- 从热备份还原

  Starting in 4.2, if you restore from files taken via “hot” backup (i.e. the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) is running), MongoDB can detect “dirty” keys on startup and automatically rollover the database key to avoid IV (Initialization Vector) reuse.

  从 4.2 开始，如果您通过“热”备份(即 [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 正在运行)获取的文件进行还原，MongoDB 可以在启动时检测“脏”密钥并自动翻转数据库密钥以避免IV（初始化向量）重用。

- Restoring from Cold Backup
- 从冷备份还原

  However, if you restore from files taken via “cold” backup (i.e. the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) is not running), MongoDB cannot detect “dirty” keys on startup, and reuse of IV voids confidentiality and integrity guarantees.

  Starting in 4.2, to avoid the reuse of the keys after restoring from a cold filesystem snapshot, MongoDB adds a new command-line option [`--eseDatabaseKeyRollover`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-esedatabasekeyrollover). When started with the [`--eseDatabaseKeyRollover`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-esedatabasekeyrollover) option, the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instance rolls over the database keys configured with `AES256-GCM` cipher and exits.

  但是, 如果您通过“冷”备份获取的文件恢复(即 [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 没有在运行),则MongoDB无法在启动时检测到“脏”密钥，并且IV的重用会使机密性和完整性保证无效。

  从4.2开始, 为了避免从冷的文件系统快照还原后重新使用密钥，MongoDB 添加了一个新的命令行选项 [`--eseDatabaseKeyRollover`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-esedatabasekeyrollover). 使用[`--eseDatabaseKeyRollover`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-esedatabasekeyrollover) 选项启动, [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 实例将回滚使用 `AES256-GCM` 密码配置的数据库密钥，然后退出。

TIP

提示

- In general, if using filesystem based backups for MongoDB Enterprise 4.2+, use the “hot” backup feature, if possible.
- 通常，如果对 MongoDB Enterprise 4.2+ 使用基于文件系统的备份，情尽可能使用“热”备份功能。
- For MongoDB Enterprise versions 4.0 and earlier, if you use `AES256-GCM` encryption mode, do **not** make copies of your data files or restore from filesystem snapshots (“hot” or “cold”).
- 对于 MongoDB Enterprise 4.0 及更早版本，如果您使用 `AES256-GCM` 加密模式，请**不要**复制数据文件或从文件系统快照（“热”或“冷”）还原。

### Back Up with Filesystem Snapshots
### 使用文件系统快照备份

You can create a backup of a MongoDB deployment by making a copy of MongoDB’s underlying data files.

您可以通过复制MongoDB的基础数据文件来创建MongoDB部署的备份。

If the volume where MongoDB stores its data files supports point-in-time snapshots, you can use these snapshots to create backups of a MongoDB system at an exact moment in time. File system snapshots are an operating system volume manager feature, and are not specific to MongoDB. With file system snapshots, the operating system takes a snapshot of the volume to use as a baseline for data backup. The mechanics of snapshots depend on the underlying storage system. For example, on Linux, the Logical Volume Manager (LVM) can create snapshots. Similarly, Amazon’s EBS storage system for EC2 supports snapshots.

如果 MongoDB 存储数据文件的卷支持时间点快照，则可以使用这些快照在确切的时间创建 MongoDB 系统的备份。文件系统快照是操作系统卷管理器功能，并非特定于 MongoDB。借助文件系统快照，操作系统可以获取卷的快照以用作数据备份的基准。快照的机制取决于基础存储系统。例如，在 Linux 上，逻辑卷管理器（LVM）可以创建快照。同样，Amazon 的 EC2 EBS 存储系统支持快照。

To get a correct snapshot of a running [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) process, you must have journaling enabled and the journal must reside on the same logical volume as the other MongoDB data files. Without journaling enabled, there is no guarantee that the snapshot will be consistent or valid.

要获取正在运行的 mongod 进程的正确快照，您必须启用日记功能，并且日记必须与其他MongoDB 数据文件位于同一逻辑卷上。如果未启用日记功能，则无法保证快照将保持一致或有效。

To get a consistent snapshot of a [sharded cluster](https://docs.mongodb.com/manual/reference/glossary/#term-sharded-cluster), you must disable the balancer and capture a snapshot from every shard as well as a config server at approximately the same moment in time.

要获得[分片群集](https://docs.mongodb.com/manual/reference/glossary/#term-sharded-cluster)的一致快照，必须禁用平衡器并在大约同一时间从每个分片以及配置服务器捕获快照。

For more information, see the [Back Up and Restore with Filesystem Snapshots](https://docs.mongodb.com/manual/tutorial/backup-with-filesystem-snapshots/) and [Back Up a Sharded Cluster with File System Snapshots](https://docs.mongodb.com/manual/tutorial/backup-sharded-cluster-with-filesystem-snapshots/) for complete instructions on using LVM to create snapshots.

欲了解更多信息，请参阅[使用文件系统快照备份和恢复](https://docs.mongodb.com/manual/tutorial/backup-with-filesystem-snapshots/) 和 [使用文件系统快照备份分片集群](https://docs.mongodb.com/manual/tutorial/backup-sharded-cluster-with-filesystem-snapshots/)使用 LVM 创建快照的完整说明。

### Back Up with `cp` or `rsync`
### 使用 `cp` 或者 `rsync` 备份

If your storage system does not support snapshots, you can copy the files directly using `cp`, `rsync`, or a similar tool. Since copying multiple files is not an atomic operation, you must stop all writes to the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) before copying the files. Otherwise, you will copy the files in an invalid state.

如果存储系统不支持快照，可以直接使用 cp，rsync 或类似的工具拷贝文件。由于复制多个文件不是原子操作，因此必须[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)在复制文件之前停止对的所有写操作。否则，您将以无效状态复制文件。

Backups produced by copying the underlying data do not support point in time recovery for [replica sets](https://docs.mongodb.com/manual/reference/glossary/#term-replica-set) and are difficult to manage for larger sharded clusters. Additionally, these backups are larger because they include the indexes and duplicate underlying storage padding and fragmentation. [`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump), by contrast, creates smaller backups.

通过复制基础数据生成的备份不支持[副本集](https://docs.mongodb.com/manual/reference/glossary/#term-replica-set)的时间点恢复，并且对于较大的[分片群集](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump)很难管理。此外，这些备份更大，因为它们包括索引以及重复的基础存储填充和碎片。mongodump 相反，创建的备份较小。

## Back Up with `mongodump`
## 使用 `mongodump` 备份

[`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) reads data from a MongoDB database and creates high fidelity BSON files which the [`mongorestore`](https://docs.mongodb.com/database-tools/mongorestore/#bin.mongorestore) tool can use to populate a MongoDB database. [`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) and [`mongorestore`](https://docs.mongodb.com/database-tools/mongorestore/#bin.mongorestore) are simple and efficient tools for backing up and restoring small MongoDB deployments, but are not ideal for capturing backups of larger systems.

[`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) 从 MongoDB 数据库读取数据，并创建高保真 BSON 文件，该 [`mongorestore`](https://docs.mongodb.com/database-tools/mongorestore/#bin.mongorestore) 工具可用于填充 MongoDB 数据库。 [`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) 和 [`mongorestore`](https://docs.mongodb.com/database-tools/mongorestore/#bin.mongorestore) 是用于备份和还原小型 MongoDB 部署的简单高效的工具，但是对于捕获大型系统的备份而言并不是理想的选择。

[`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) and [`mongorestore`](https://docs.mongodb.com/database-tools/mongorestore/#bin.mongorestore) operate against a running [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) process, and can manipulate the underlying data files directly. By default, [`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) does not capture the contents of the [local database](https://docs.mongodb.com/manual/reference/local-database/).

[`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) 和 [`mongorestore`](https://docs.mongodb.com/database-tools/mongorestore/#bin.mongorestore)针对正在运行的 [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 进程进行操作，并且可以直接操作基础数据文件。默认情况下，mongodump 不捕获本地数据库的内容。

[`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) only captures the documents in the database. The resulting backup is space efficient, but [`mongorestore`](https://docs.mongodb.com/database-tools/mongorestore/#bin.mongorestore) or [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) must rebuild the indexes after restoring data.

[`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) 仅捕获数据库中的文档。生成的备份是节省空间的，但是[`mongorestore`](https://docs.mongodb.com/database-tools/mongorestore/#bin.mongorestore) 或 [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)恢复数据后，必须重建索引。

When connected to a MongoDB instance, [`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) can adversely affect [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) performance. If your data is larger than system memory, the queries will push the working set out of memory, causing page faults.

当连接一个 MongoDB 实例时，[`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump)可能会对[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)的性能产生不利影响。如果您的数据大于系统内存，则查询会将工作集推出内存，从而导致页面错误。

Applications can continue to modify data while [`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) captures the output. For replica sets, [`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) provides the [`--oplog`](https://docs.mongodb.com/database-tools/mongodump/#cmdoption-mongodump-oplog) option to include in its output [oplog](https://docs.mongodb.com/manual/reference/glossary/#term-oplog) entries that occur during the [`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) operation. This allows the corresponding [`mongorestore`](https://docs.mongodb.com/database-tools/mongorestore/#bin.mongorestore) operation to replay the captured oplog. To restore a backup created with [`--oplog`](https://docs.mongodb.com/database-tools/mongodump/#cmdoption-mongodump-oplog), use [`mongorestore`](https://docs.mongodb.com/database-tools/mongorestore/#bin.mongorestore) with the [`--oplogReplay`](https://docs.mongodb.com/database-tools/mongorestore/#cmdoption-mongorestore-oplogreplay) option.

应用程序可以在 [`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) 捕获输出的同时继续修改数据，对于副本集，当进行[`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) 操作时，[`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) 提供 [`--oplog`](https://docs.mongodb.com/database-tools/mongodump/#cmdoption-mongodump-oplog) 选项来包括它输出的[oplog](https://docs.mongodb.com/manual/reference/glossary/#term-oplog) 实体。这允许响应的[`mongorestore`](https://docs.mongodb.com/database-tools/mongorestore/#bin.mongorestore)恢复捕获的 oplog。要恢复创建时带了[`--oplog`](https://docs.mongodb.com/database-tools/mongodump/#cmdoption-mongodump-oplog)选项的备份，进行[`mongorestore`](https://docs.mongodb.com/database-tools/mongorestore/#bin.mongorestore)操作是需要有 [`--oplogReplay`](https://docs.mongodb.com/database-tools/mongorestore/#cmdoption-mongorestore-oplogreplay)选项。

However, for replica sets, consider [MongoDB Cloud Manager](https://docs.mongodb.com/manual/core/backups/#backup-with-mms) or [Ops Manager](https://docs.mongodb.com/manual/core/backups/#backup-with-mms-onprem).

但是对于副本集，请考虑使用 [MongoDB Cloud Manager](https://docs.mongodb.com/manual/core/backups/#backup-with-mms) 或 [Ops Manager](https://docs.mongodb.com/manual/core/backups/#backup-with-mms-onprem)。

NOTE

注意

[`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) and [`mongorestore`](https://docs.mongodb.com/database-tools/mongorestore/#bin.mongorestore) **cannot** be part of a backup strategy for 4.2+ sharded clusters that have sharded transactions in progress, as backups created with [`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) *do not maintain* the atomicity guarantees of transactions across shards.

[`mongodump`](https://docs.mongodb.com/database-tools/mongodump/#bin.mongodump) 和 [`mongorestore`](https://docs.mongodb.com/database-tools/mongorestore/#bin.mongorestore)**不能**作为正在进行分片事务的4.2+版本分片群集的备份策略的一部分，因为使用创建的备份*不会保持*跨分片事务的原子性保证。

For 4.2+ sharded clusters with in-progress sharded transactions, use one of the following coordinated backup and restore processes which *do maintain* the atomicity guarantees of transactions across shards:

对于具有正在进行的分片事务的 4.2+ 版本分片集群，请使用以下一个协调的备份和还原过程，这些过程*确实维护*了跨分片事务的原子性保证：

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server),
- [MongoDB Cloud Manager](https://www.mongodb.com/cloud/cloud-manager?tck=docs_server), or 或
- [MongoDB Ops Manager](https://www.mongodb.com/products/ops-manager?tck=docs_server).

See [Back Up and Restore with MongoDB Tools](https://docs.mongodb.com/manual/tutorial/backup-and-restore-tools/) and [Back Up a Sharded Cluster with Database Dumps](https://docs.mongodb.com/manual/tutorial/backup-sharded-cluster-with-database-dumps/) for more information.

有关更多信息请参阅[Back Up and Restore with MongoDB Tools](https://docs.mongodb.com/manual/tutorial/backup-and-restore-tools/) 和 [Back Up a Sharded Cluster with Database Dumps](https://docs.mongodb.com/manual/tutorial/backup-sharded-cluster-with-database-dumps/)
