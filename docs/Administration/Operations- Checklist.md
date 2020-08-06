# Operations Checklist[](https://docs.mongodb.com/manual/administration/production-checklist-operations/ "Permalink to this headline")

# 操作检查表


- [Filesystem]文件系統(https://docs.mongodb.com/manual/administration/production-checklist-operations/#filesystem)

- [Replication]复制(https://docs.mongodb.com/manual/administration/production-checklist-operations/#replication)

- [Sharding]分片(https://docs.mongodb.com/manual/administration/production-checklist-operations/#sharding)

- [Journaling: WiredTiger Storage Engine]日志：WiredTiger存储引擎(https://docs.mongodb.com/manual/administration/production-checklist-operations/#journaling-wiredtiger-storage-engine)

- [Hardware]硬件(https://docs.mongodb.com/manual/administration/production-checklist-operations/#hardware)

- [Deployments to Cloud Hardware]部署到云硬件(https://docs.mongodb.com/manual/administration/production-checklist-operations/#deployments-to-cloud-hardware)

- [Operating System Configuration]操作系统配置(https://docs.mongodb.com/manual/administration/production-checklist-operations/#operating-system-configuration)

- [Backups]备份(https://docs.mongodb.com/manual/administration/production-checklist-operations/#backups)

- [Monitoring]监控(https://docs.mongodb.com/manual/administration/production-checklist-operations/#monitoring)

- [Load Balancing]负载均衡(https://docs.mongodb.com/manual/administration/production-checklist-operations/#load-balancing)


The following checklist, along with the [Development Checklist](https://docs.mongodb.com/manual/administration/production-checklist-development/) list, provides recommendations to help you avoid issues in your production MongoDB deployment.                                                                                                       下面的清单和[开发清单](https://docs.mongodb.com/manual/administration/production-checklist-development/)列表一同提供了一些建议，帮助您避免生产环境下MongoDB部署中的问题。

## Filesystem     

## 文件系统

- Align your disk partitions with your RAID configuration.                                                                                                        将磁盘分区与RAID配置对齐。

- Avoid using NFS drives for your [dbPath](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath). Using NFS drives can result in degraded and unstable performance.                                                                                                                                                                                      避免对  [dbPath](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath) 使用 NFS 驱动器。使用 NFS 驱动器可能导致性能下降和不稳定。

  See:  [Remote Filesystems](https://docs.mongodb.com/manual/administration/production-notes/#production-nfs) for more information.                                                                                                                       有关详细信息，请参阅：[远程文件系统](https://docs.mongodb.com/manual/administration/production-notes/#production-nfs) 。                        

  - VMware users should use VMware virtual drives over NFS.                                                                                                   VMware 用户应该通过 NFS 使用 VMware 虚拟驱动器。

- Linux/Unix: format your drives into XFS or EXT4. If possible, use XFS as it generally performs better with MongoDB.                                                                                                                                                                                            Linux/Unix：将驱动器格式化为 XFS 或 EXT4。如果可能的话，使用 XFS，因为它通常在MongoDB 中运行得更好。

  - With the WiredTiger storage engine, use of XFS is strongly recommended to avoid performance issues found when using EXT4 with WiredTiger.                                                                                                                 对于 WiredTiger 存储引擎，强烈建议使用XFS，以避免在将 EXT4 与 WiredTiger 一起使用时产生性能问题。
  - If using RAID, you may need to configure XFS with your RAID geometry.                                                    如果使用 RAID，可能需要使用 RAID 几何阵列配置 XFS。

- Windows: use the NTFS file system. Do not use any FAT file system (i.e. FAT 16/32/exFAT).           Windows：使用 NTFS 文件系统。不要使用任何 FAT 文件系统（例如 FAT 16/32/exFAT）。

## Replication

## 复制

- Verify that all non-hidden replica set members are identically provisioned in terms of their RAM, CPU, disk, network setup, etc.                                                                                                                                                     验证所有非隐藏副本集成员在 RAM，CPU，磁盘，网络设置等方面的配置是否相同。

- [Configure the oplog size](https://docs.mongodb.com/manual/tutorial/change-oplog-size/) to suit your use case:                                                                                                                           [配置 oplog 的大小](https://docs.mongodb.com/manual/tutorial/change-oplog-size/) 以适合您的使用案例：    

  - The replication oplog window should cover normal maintenance and downtime windows to avoid the need for a full resync.                                                                                                                                                       复制 oplog 窗口包括正常维护和停机时间窗口，以避免需要完全重新同步。

  - The replication oplog window should cover the time needed to restore a replica set member from the last backup.                                                                                                                                                              复制 oplog 窗口应涵盖从上次备份还原副本集成员所需的时间。

    *Changed in version 3.4:* The replication oplog window no longer needs to cover the time needed to restore a replica set member via initial sync as the oplog records are pulled during the data copy. However, the member being restored must have enough disk space in the [local](https://docs.mongodb.com/manual/reference/local-database/#replica-set-local-database) database to temporarily store these oplog records for the duration of this data copy stage.                                                                                                                                       *在 3.4 版本中更改*：复制 oplog 窗口不再需要覆盖通过初始同步还原副本集成员所需的时间，因为在数据复制期间会提取 oplog 记录。但是，正在还原的成员必须在[本地](https://docs.mongodb.com/manual/reference/local-database/#replica-set-local-database)数据库中具有足够的磁盘空间，以便在此数据复制阶段的持续时间内临时存储这些 oplog 记录。

    With earlier versions of MongoDB, replication oplog window should cover the time needed to restore a replica set member by initial sync.                                                                                                                       对于早期版本的 MongoDB，复制 oplog 窗口应涵盖通过初始同步还原副本集成员所需的时间。

- Ensure that your replica set includes at least three data-bearing nodes that run with journaling and that you issue writes with w:"majority" [write concern](https://docs.mongodb.com/manual/reference/write-concern/) for availability and durability.                                                                                                                                                                    确保您的副本集至少包含三个数据承载节点，这些节点与日志记录一起运行，并且为了可用性和持久性，您使用 w:"majority" [写策略](https://www.docs4dev.com/docs/zh/mongodb/v3.6/reference/reference-write-concern.html)发出写操作。

- Use hostnames when configuring replica set members, rather than IP addresses.                                        配置副本集成员时使用主机名，而不是IP地址。
- Ensure full bidirectional network connectivity between all [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instances.                                                                   确保所有 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 实例之间的完全双向网络连接。
- Ensure that each host can resolve itself.                                                                                                                               确保每个主机都可以自行解决。
- Ensure that your replica set contains an odd number of voting members.                                                    确保副本集包含奇数个投票成员。
- Ensure that [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instances have 0 or 1 votes.                                                                                                                确保 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 实例有0票或1票。
- For [high availability](https://docs.mongodb.com/manual/reference/glossary/#term-high-availability), deploy your replica set into a *minimum* of three data centers.                                        对[高可用性](https://docs.mongodb.com/manual/reference/glossary/#term-high-availability)，将副本集部署到至少三个数据中心。

## Sharding 

## 分片

- Place your [config servers](https://docs.mongodb.com/manual/core/sharded-cluster-config-servers/) on dedicated hardware for optimal performance in large clusters. Ensure that the hardware has enough RAM to hold the data files entirely in memory and that it has dedicated storage.                                                                                                                                                                                        将 [配置服务器](https://docs.mongodb.com/manual/core/sharded-cluster-config-servers/)放在专用硬件上，以便在大型集群中获得最佳性能。确保硬件有足够的 RAM 将数据文件完全保存在内存中，并且有专用的存储器。
- Deploy [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) routers in accordance with the [Production Configuration](https://docs.mongodb.com/manual/core/sharded-cluster-components/#sc-production-configuration) guidelines.                                               根据[生产配置](https://docs.mongodb.com/manual/core/sharded-cluster-components/#sc-production-configuration)指南部署 [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) 前端路由。
- Use NTP to synchronize the clocks on all components of your sharded cluster.                                                               使用NTP来同步切分集群所有组件上的时钟。
- Ensure full bidirectional network connectivity between [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod), [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos), and config servers.                                                                                                                                                                     确保 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod), [mongos ](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)和配置服务器之间的完全双向网络连接。
- Use CNAMEs to identify your config servers to the cluster so that you can rename and renumber your config servers without downtime.                                                                                                                                      使用 CNAMEs 将配置服务器标识到集群，以便可以在不停机的情况下重命名和重新编号配置服务器。

## Journaling: WiredTiger Storage Engine

## 日志：WiredTiger存储引擎

- Ensure that all instances use [journaling](https://docs.mongodb.com/manual/core/journaling/).                                                                                                                               确保所有实例都使用[日志](https://docs.mongodb.com/manual/core/journaling/)。
- Place the journal on its own low-latency disk for write-intensive workloads. Note that this will affect snapshot-style backups as the files constituting the state of the database will reside on separate volumes.将                                                                                                                                                                                      日志放在其自己的低延迟磁盘上，以适应写密集型的工作负载。请注意，这将影响快照样式备份，因为构成数据库状态的文件将位于单独的卷上。

## Hardware 

## 硬件

- Use RAID10 and SSD drives for optimal performance.                                                                                       使用 RAID10 和 SSD 驱动器可获得最佳性能。
- SAN and Virtualization:                                                                                                                                           SAN 和虚拟化：
  - Ensure that each [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) has provisioned IOPS for its [dbPath](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath), or has its own physical drive or LUN.                                                                                                                                                     确保每个[mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 已为其 [数据库文件存储路径](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath)配置了 IOPS，或者具有自己的物理驱动器或 LUN。
  - Avoid dynamic memory features, such as memory ballooning, when running in virtual environments.                                                                                                                                                                               在虚拟环境中运行时，请避免使用动态内存特性，如内存膨胀。
  - Avoid placing all replica set members on the same SAN, as the SAN can be a single point of failure.                                                                                                                                                             避免将所有副本集成员放在同一个 SAN 上，因为 SAN 可能是单点故障。

## Deployments to Cloud Hardware 

## 部署到云硬件

- Windows Azure: Adjust the TCP keepalive (tcp_keepalive_time) to 100-120. The TCP idle timeout on the Azure load balancer is too slow for MongoDB’s connection pooling behavior. See: [Azure Production Notes](https://docs.mongodb.com/manual/administration/production-notes/#windows-azure-production-notes) for more information.                                                                                                                                            Windows Azure：将 TCP 长连接（TCP长连接时间）调整为100-120。Azure 负载均衡器上的 TCP 空闲超时对于 MongoDB 的连接池行为太慢。有关详细信息，请参阅 [Azure产品说明](https://docs.mongodb.com/manual/administration/production-notes/#windows-azure-production-notes)。
- Use MongoDB version 2.6.4 or later on systems with high-latency storage, such as Windows Azure, as these versions include performance improvements for those systems.                                                                         在具有高延迟存储的系统（如Microsoft Azure）上使用 MongoDB 版本 2.6.4 或更高版本，因为这些版本包括这些系统性能的改进。

## Operating System Configuration

## 操作系统配置

### Linux                                                                                                                                    Linux

- Turn off transparent hugepages. See [Transparent Huge Pages Settings](https://docs.mongodb.com/manual/tutorial/transparent-huge-pages/) for more information.                                                                                                                                                              关闭透明大页。有关更多信息，请参见[透明大页设置](https://docs.mongodb.com/manual/tutorial/transparent-huge-pages/)。

- [Adjust the readahead settings](https://docs.mongodb.com/manual/administration/production-notes/#readahead) on the devices storing your database files.                                                                                                                                     在存储数据库文件的设备上[调整文件预读设置](https://docs.mongodb.com/manual/administration/production-notes/#readahead) 。

  - For the WiredTiger storage engine, set readahead between 8 and 32 regardless of storage media type (spinning disk, SSD, etc.), unless testing shows a measurable, repeatable, and reliable benefit in a higher readahead value.                                                                                                                                                         对于 WiredTiger 存储引擎，无论存储介质类型（旋转磁盘、固态硬盘等）如何，请将文件预读设置在8到32之间，除非测试显示在较高的文件预读值中有可测量、可重复和可靠的好处。

    [MongoDB commercial support](https://support.mongodb.com/welcome?jmp=docs) can provide advice and guidance on alternate readahead configurations                                                                                                                                                                          [MongoDB专业支持](https://support.mongodb.com/welcome?jmp=docs) 可以提供关于交替文件预读配置的建议和指导。

- If using tuned on RHEL / CentOS, you must customize your tuned profile. Many of the tuned profiles that ship with RHEL / CentOS can negatively impact performance with their default settings. Customize your chosen tuned profile to:                                                                                                                                                           如果在 RHEL/CentOS 上使用 tuned（动态内核调优工具），则必须自定义您的 tuned 配置文件。RHEL/CentOS 附带的许多 tuned 文件可能会对其默认设置的性能产生负面影响。将您选择的 tuned 文件自定义为：                                                                   

  - Disable transparent hugepages. See [Using tuned and ktune](https://docs.mongodb.com/manual/tutorial/transparent-huge-pages/#configure-thp-tuned) for instructions.                                                                         禁用透明大页。有关说明，请参见[使用 tuned 和 ktune](https://docs.mongodb.com/manual/tutorial/transparent-huge-pages/#configure-thp-tuned)。
  - Set readahead between 8 and 32 regardless of storage media type. See [Readahead settings](https://docs.mongodb.com/manual/administration/production-notes/#readahead) for more information.                                                                                                                                                               无论存储介质类型如何，都将文件预读设置为8到32之间。有关详细信息，请参阅[预读设置](https://docs.mongodb.com/manual/administration/production-notes/#readahead)。

- Use the noop or deadline disk schedulers for SSD drives.                                                                                   对SSD驱动器使用 noop 或 deadline 磁盘调度程序。

- Use the noop disk scheduler for virtualized drives in guest VMs.                                                                                              对来宾虚拟机中的虚拟化驱动器使用 noop 磁盘调度程序。

- Disable NUMA or set vm.zone_reclaim_mode to 0 and runinstances with node interleaving. See: [MongoDB and NUMA Hardware](https://docs.mongodb.com/manual/administration/production-notes/#production-numa) for more information.                                                                                                           禁用 NUMA 或将 vm.zone_reclaim_mode 设置为0并运行具有节点交错的 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 实例。请参阅：[MongoDB和NUMA硬件](https://docs.mongodb.com/manual/administration/production-notes/#production-numa)了解更多信息。

- Adjust the ulimit values on your hardware to suit your use case. If multiple [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) or [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) instances are running under the same user, scale the ulimit values accordingly. See: [UNIX ulimit Settings](https://docs.mongodb.com/manual/reference/ulimit/) for more information.                                                                                                                                                   调整硬件上的 ulimit 值以适合您的用例。如果多个 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 或者 [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) 实例在同一用户下运行，请相应地缩放 ulimit 值。有关详细信息，请参见：[UNIX ulimit 设置](https://docs.mongodb.com/manual/reference/ulimit/)。

- Use noatime for the [dbPath](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath) mount point.                                                                                                                                          使用noatime作为 [dbPath](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath) 挂载点。

- Configure sufficient file handles (fs.file-max), kernel pid limit (kernel.pid_max), maximum threads per process (kernel.threads-max), and maximum number of memory map areas per process (vm.max_map_count) for your deployment. For large systems, the following values provide a good starting point:                                                                                                                                                                                     为部署配置足够的文件句柄（fs.file max）、内核 pid 限制（kernel.pid_max）、每个进程的最大线程数（kernel.threads max）和每个进程的最大内存映射区域数（vm.max_map_count）。对于大型系统，以下值提供了一个良好的起点：

  - fs.file-max value of 98000,                                                                                                                          fs.file-max 值为98000,
  - kernel.pid_max value of 64000,                                                                                                kernel.pid_max 值为64000,
  - kernel.threads-max value of 64000, and                                                                                                                                  kernel.threads-max 值为64000, 和
  - vm.max_map_count value of 128000                                                                                vm.max_map_count 值为128000

- Ensure that your system has swap space configured. Refer to your operating system’s documentation for details on appropriate sizing.                                                                                                                                                    确保系统已配置交换空间。有关适当大小的详细信息，请参阅操作系统的文档。

- Ensure that the system default TCP keepalive is set correctly. A value of 300 often provides better performance for replica sets and sharded clusters. See: [Does TCP keepalive time affect MongoDB Deployments?](https://docs.mongodb.com/manual/faq/diagnostics/#faq-keepalive) in the Frequently Asked Questions for more information.                                                                                 确保系统默认的 TCP 长连接设置正确。TCP 长连接时间值300通常为副本集和分片集群提供更好的性能。有关详细信息，请参阅常见问题中的 [TCP 保持时间是否影响MongoDB部署?](https://docs.mongodb.com/manual/faq/diagnostics/#faq-keepalive) 。

### Windows                                                                                                 Windows

- Consider disabling NTFS “last access time” updates. This is analogous to disabling `atime` on Unix-like systems.                                                                                                                                                                                                     考虑禁用 NTFS “最后访问时间”更新。这类似于在 Unix-like 系统上禁用atime。
- Format NTFS disks using the default Allocation unit size of [4096 bytes](https://support.microsoft.com/en-us/help/140365/default-cluster-size-for-ntfs-fat-and-exfat).                                                          使用默认分配单元大小的[4096 字节](https://support.microsoft.com/en-us/help/140365/default-cluster-size-for-ntfs-fat-and-exfat)格式化NTFS磁盘。

## Backups

## 备份

- Schedule periodic tests of your back up and restore process to have time estimates on hand, and to verify its functionality.                                                                                                                                                                         安排定期测试备份和恢复过程，以便手头有时间估计，并验证其功能。

## Monitoring

## 监控

- Use [MongoDB Cloud Manager](https://www.mongodb.com/cloud/cloud-manager/?jmp=docs) or [Ops Manager, an on-premise solution available in MongoDB Enterprise Advanced](https://www.mongodb.com/products/mongodb-enterprise-advanced?jmp=docs) or another monitoring system to monitor key database metrics and set up alerts for them. Include alerts for the following metrics:                                                                                                                   使用 [MongoDB Cloud Manager](https://www.mongodb.com/cloud/cloud-manager/?jmp=docs)或者[MongoDB 企业高级版中提供的本地解决方案- Ops Manager ](https://www.mongodb.com/products/mongodb-enterprise-advanced?jmp=docs) 或者另一个监控系统来监控关键数据库指标并为它们设置警报。包括以下指标的警报:

  - replication lag                                                                                                                                                                                 复制滞后
  - replication oplog window                                                                                                                                                复制 oplog 窗口
  - assertions                                                                                                                                                                                断言
  - queues                                                                                                                                                                   队列
  - page faults                                                                                                                                                                             页面错误

- Monitor hardware statistics for your servers. In particular, pay attention to the disk use, CPU, and available disk space.                                                                                                                                                               监视服务器的硬件统计信息。尤其要注意磁盘使用、CPU 和可用磁盘空间。

  In the absence of disk space monitoring, or as a precaution:                                                                                     在没有磁盘空间监视的情况下，以下方案作为预防措施：

  - Create a dummy 4 GB file on the [storage.dbPath](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath) drive to ensure available space if the disk becomes full.                                                                                                                                                                                 在storage.dbPath驱动器上创建一个4 GB的虚拟文件，以确保磁盘满时有可用空间。
  - A combination of cron+df can alert when disk space hits a high-water mark, if no other monitoring tool is available.                                                                                                                                                                  如果没有其他监视工具可用，cron+df 的组合可以在磁盘空间达到高水位时发出警报。

## Load Balancing

## 负载均衡

- Configure load balancers to enable “sticky sessions” or “client affinity”, with a sufficient timeout for existing connections.                                                                                                                                                              将负载平衡器配置为启用“粘滞会话”或“客户端亲和性”，并为现有连接提供足够的延时。
- Avoid placing load balancers between MongoDB cluster or replica set components.                                                          避免在 MongoDB 集群或副本集组件之间放置负载平衡器。





原文链接：https://docs.mongodb.com/manual/administration/production-checklist-operations/

译者：孔令升
