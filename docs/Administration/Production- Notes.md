# **Production** Notes[](https://docs.mongodb.com/manual/administration/production-notes/ "Permalink to this headline")

# 产品说明


- [MongoDB Binaries]MongoDB 二进制文件(https://docs.mongodb.com/manual/administration/production-notes/#mongodb-binaries)

- [MongoDB dbPath]MongoDB 文件存储路径(https://docs.mongodb.com/manual/administration/production-notes/#mongodb-dbpath)

- [Concurrency]并发(https://docs.mongodb.com/manual/administration/production-notes/#concurrency)

- [Data Consistency]数据一致性(https://docs.mongodb.com/manual/administration/production-notes/#data-consistency)

- [Networking]联网(https://docs.mongodb.com/manual/administration/production-notes/#networking)

- [Hardware Considerations]硬件注意事项(https://docs.mongodb.com/manual/administration/production-notes/#hardware-considerations)

- [Architecture]架构(https://docs.mongodb.com/manual/administration/production-notes/#architecture)

- [Compression]压缩(https://docs.mongodb.com/manual/administration/production-notes/#compression)

- [Clock Synchronization]时钟同步(https://docs.mongodb.com/manual/administration/production-notes/#clock-synchronization)

- [Platform Specific Considerations]平台特定注意事项(https://docs.mongodb.com/manual/administration/production-notes/#platform-specific-considerations)

- [Performance Monitoring]性能监控(https://docs.mongodb.com/manual/administration/production-notes/#performance-monitoring)

- [Backups]备份(https://docs.mongodb.com/manual/administration/production-notes/#backups)

  

This page details system configurations that affect MongoDB, especially when running in production.
本文详细描述了影响MongoDB，特别是在生产环境中运行时的系统配置。

MMAPV1 REMOVED：
移除 MMAPV1：

MongoDB 4.2 removes the deprecated MMAPv1 storage engine. To change your MMAPv1 storage engine deployment to [WiredTiger Storage Engine](https://docs.mongodb.com/manual/core/wiredtiger/)  , see:                                                                                          MongoDB 4.2 移除了已弃用的 MMAPv1 存储引擎。要将 MMAPv1 存储引擎部署更改为  [WiredTiger存储引擎](https://docs.mongodb.com/manual/core/wiredtiger/) ，请参见：

- [Change Standalone to WiredTiger]将单节点更改为WiredTiger(https://docs.mongodb.com/manual/tutorial/change-standalone-wiredtiger/)
- [Change Replica Set to WiredTiger]将复制集群更改为WiredTiger(https://docs.mongodb.com/manual/tutorial/change-replica-set-wiredtiger/)
- [Change Sharded Cluster to WiredTiger]将分片集群更改为WiredTiger(https://docs.mongodb.com/manual/tutorial/change-sharded-cluster-wiredtiger/)

NOTE：
注意：

[MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server) is a cloud-hosted database-as-a-service. [MongoDB Cloud Manager](https://www.mongodb.com/cloud/cloud-manager/?jmp=docs), a hosted service, and [Ops Manager](https://www.mongodb.com/products/mongodb-enterprise-advanced?jmp=docs), an on-premise solution, provide monitoring, backup, and automation of MongoDB instances. For documentation, see [Atlas documentation](https://docs.atlas.mongodb.com/?jmp=docs), the [MongoDB Cloud Manager documentation](https://docs.cloudmanager.mongodb.com/) and [Ops Manager documentation](https://docs.opsmanager.mongodb.com/?jmp=docs)

[MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server) 是云端的数据库服务。[MongoDB Cloud Manager：官方推出的运维自动化管理系统](https://www.mongodb.com/cloud/cloud-manager/?jmp=docs)， 是一个托管服务； [Ops Manager：用于监控和备份MongoDB的基础设施服务](https://www.mongodb.com/products/mongodb-enterprise-advanced?jmp=docs)，是一个本地解决方案, 提供 MongoDB 实例的监视，备份和自动化。 有关文档，请参阅 [Atlas 文档](https://docs.atlas.mongodb.com/?jmp=docs), [MongoDB Cloud Manager 文档](https://docs.cloudmanager.mongodb.com/) 和 [Ops Manager 文档](https://docs.opsmanager.mongodb.com/?jmp=docs)。


## MongoDB Binaries

## MongoDB 二进制文件

### Supported Platforms

### 支持的平台

For running **in production**, refer to the [Recommended Platforms](https://docs.mongodb.com/manual/administration/production-notes/#prod-notes-recommended-platforms) for operating system recommendations. **在生产环境中**运行时，请参阅[推荐的平台](https://docs.mongodb.com/manual/administration/production-notes/#prod-notes-recommended-platforms)以获取推荐使用的操作系统。

NOTE：
注意：

MongoDB 4.0 may lose data during unclean shutdowns on macOS 10.12.x and 10.13.x.                                                                            MongoDB 4.0 在 macOS 10.12.x 和 10.13.x 系统上当硬盘未正常关机时可能丢失数据。

For details, see [WT-4018](https://jira.mongodb.org/browse/WT-4018).                                                                                                                                                 对于更多的细节，参见[WT-4018](https://jira.mongodb.org/browse/WT-4018)。

#### x86_64                                                                                                                                                   x86_64

**Platform Support EOL Notice**                                                                                                                                       

|              |                                  |
| :----------: | :------------------------------: |
| Ubuntu 14.04 | Support removed in MongoDB 4.2+. |
|   Debian 8   | Support removed in MongoDB 4.2+. |
| macOS 10.11  | Support removed in MongoDB 4.2+. |

**平台支持的产品生命期结束通知**

|              |                              |
| :----------: | :--------------------------: |
| Ubuntu 14.04 | 在MongoDB 4.2+中移除了支持。 |
|   Debian 8   | 在MongoDB 4.2+中移除了支持。 |
| macOS 10.11  | 在MongoDB 4.2+中移除了支持。 |

*Upcoming EOL Notice*:

|                    |                                              |
| :----------------: | :------------------------------------------: |
| Windows 8.1/2012R2 | MongoDB will end support in future releases. |
|   Windows 8/2012   | MongoDB will end support in future releases. |
|  Windows 7/2008R2  | MongoDB will end support in future releases. |

即将到来的的产品生命期结束通知

|                    |                                   |
| :----------------: | :-------------------------------: |
| Windows 8.1/2012R2 | MongoDB在接下来的版本中不再支持。 |
|   Windows 8/2012   | MongoDB在接下来的版本中不再支持。 |
|  Windows 7/2008R2  | MongoDB在接下来的版本中不再支持。 |

| Platform                                                     | 4.2 Community & Enterprise | 4.0 Community & Enterprise | 3.6 Community & Enterprise | 3.4 Community & Enterprise |
| :----------------------------------------------------------- | :------------------------: | :------------------------: | :------------------------: | :------------------------: |
| Amazon Linux 2                                               |             ✓              |             ✓              |                            |                            |
| Amazon Linux 2013.03 and later                               |             ✓              |             ✓              |             ✓              |             ✓              |
| Debian 10                                                    |           4.2.1+           |                            |                            |                            |
| Debian 9                                                     |             ✓              |             ✓              |           3.6.5+           |                            |
| Debian 8                                                     |                            |             ✓              |             ✓              |             ✓              |
| RHEL/CentOS/Oracle Linux [[1\]](https://docs.mongodb.com/manual/administration/production-notes/#oracle-linux) 8.0 and later |           4.2.1+           |          4.0.14+           |          3.6.17+           |                            |
| RHEL/CentOS/Oracle Linux [[1\]](https://docs.mongodb.com/manual/administration/production-notes/#oracle-linux) 7.0 and later |             ✓              |             ✓              |             ✓              |             ✓              |
| RHEL/CentOS/Oracle Linux [[1\]](https://docs.mongodb.com/manual/administration/production-notes/#oracle-linux) 6.2 and later |             ✓              |             ✓              |             ✓              |             ✓              |
| SLES 15                                                      |           4.2.1+           |                            |                            |                            |
| SLES 12                                                      |             ✓              |             ✓              |             ✓              |             ✓              |
| Solaris 11 64-bit                                            |                            |                            |                            |       Community only       |
| Ubuntu 18.04                                                 |             ✓              |           4.0.1+           |                            |                            |
| Ubuntu 16.04                                                 |             ✓              |             ✓              |             ✓              |             ✓              |
| Ubuntu 14.04                                                 |                            |             ✓              |             ✓              |             ✓              |
| Windows Server 2019                                          |             ✓              |                            |                            |                            |
| Windows 10 / Server 2016                                     |             ✓              |             ✓              |             ✓              |             ✓              |
| Windows 8.1 / Server 2012 R2                                 |             ✓              |             ✓              |             ✓              |             ✓              |
| Windows 8 / Server 2012                                      |             ✓              |             ✓              |             ✓              |             ✓              |
| Windows 7 / Server 2008 R2                                   |             ✓              |             ✓              |             ✓              |             ✓              |
| Windows Vista                                                |                            |                            |                            |             ✓              |
| macOS 10.13 and later                                        |             ✓              |             ✓              |                            |                            |
| macOS 10.12                                                  |             ✓              |             ✓              |             ✓              |             ✓              |
| macOS 10.11                                                  |                            |             ✓              |             ✓              |             ✓              |
| macOS 10.10                                                  |                            |                            |             ✓              |             ✓              |

|                             平台                             | 4.2 社区版和企业版 | 4.0 社区版和企业版 | 3.6 社区版和企业版 | 3.4 社区版和企业版 |
| :----------------------------------------------------------: | :----------------: | :----------------: | :----------------: | :----------------: |
|                        亚马逊 Linux 2                        |         ✓          |         ✓          |                    |                    |
|               亚马逊 Linux 2013.03 和更高版本                |         ✓          |         ✓          |         ✓          |         ✓          |
|                          Debian 10                           |       4.2.1+       |                    |                    |                    |
|                           Debian 9                           |         ✓          |         ✓          |       3.6.5+       |                    |
|                           Debian 8                           |                    |         ✓          |         ✓          |         ✓          |
| RHEL/CentOS/Oracle Linux [[1\]](https://docs.mongodb.com/manual/administration/production-notes/#oracle-linux) 8.0 and later |       4.2.1+       |      4.0.14+       |      3.6.17+       |                    |
| RHEL/CentOS/Oracle Linux [[1\]](https://docs.mongodb.com/manual/administration/production-notes/#oracle-linux) 7.0 和更高版本 |         ✓          |         ✓          |         ✓          |         ✓          |
| RHEL/CentOS/Oracle Linux [[1\]](https://docs.mongodb.com/manual/administration/production-notes/#oracle-linux) 6.2 和更高版本 |         ✓          |         ✓          |         ✓          |         ✓          |
|                           SLES 15                            |       4.2.1+       |                    |                    |                    |
|                           SLES 12                            |         ✓          |         ✓          |         ✓          |         ✓          |
|                      Solaris 11 64-bit                       |                    |                    |                    |     仅社区版本     |
|                         Ubuntu 18.04                         |         ✓          |       4.0.1+       |                    |                    |
|                         Ubuntu 16.04                         |         ✓          |         ✓          |         ✓          |         ✓          |
|                         Ubuntu 14.04                         |                    |         ✓          |         ✓          |         ✓          |
|                     Windows Server 2019                      |         ✓          |                    |                    |                    |
|                   Windows 10 / Server 2016                   |         ✓          |         ✓          |         ✓          |         ✓          |
|                 Windows 8.1 / Server 2012 R2                 |         ✓          |         ✓          |         ✓          |         ✓          |
|                   Windows 8 / Server 2012                    |         ✓          |         ✓          |         ✓          |         ✓          |
|                  Windows 7 / Server 2008 R2                  |         ✓          |         ✓          |         ✓          |         ✓          |
|                        Windows Vista                         |                    |                    |                    |         ✓          |
|                    macOS 10.13 和更高版本                    |         ✓          |         ✓          |                    |                    |
|                         macOS 10.12                          |         ✓          |         ✓          |         ✓          |         ✓          |
|                         macOS 10.11                          |                    |         ✓          |         ✓          |         ✓          |
|                         macOS 10.10                          |                    |                    |         ✓          |         ✓          |

[1]	*([1](https://docs.mongodb.com/manual/administration/production-notes/#id1), [2](https://docs.mongodb.com/manual/administration/production-notes/#id2), [3](https://docs.mongodb.com/manual/administration/production-notes/#id3))* MongoDB only supports Oracle Linux running the Red Hat Compatible Kernel (RHCK). MongoDB does not support the Unbreakable Enterprise Kernel (UEK).                                                                          [1]	*([1](https://docs.mongodb.com/manual/administration/production-notes/#id1), [2](https://docs.mongodb.com/manual/administration/production-notes/#id2), [3](https://docs.mongodb.com/manual/administration/production-notes/#id3))* MongoDB 仅支持 Oracle Linux 运行 Red Hat Compatible Kernel (RHCK). MongoDB 不支持Unbreakable Enterprise Kernel (UEK)。

#### ARM64                                                                                                                                ARM64

| **Platform Support EOL Notice** |                                            |
| :-----------------------------: | :----------------------------------------: |
|       Ubuntu 16.04 ARM64        | Support removed in MongoDB Community 4.2+. |

| 平台支持的 产品生命期结束通知 |                                   |
| :---------------------------: | :-------------------------------: |
|      Ubuntu 16.04 ARM64       | 在MongoDB 社区版 4.2+中不再支持。 |

| Platform     | 4.2 Community & Enterprise | 4.0 Community & Enterprise | 3.6 Community & Enterprise | 3.4 Community & Enterprise |
| :----------- | :------------------------: | :------------------------: | :------------------------: | :------------------------: |
| Ubuntu 18.04 |       Community only       |                            |                            |                            |
| Ubuntu 16.04 |      Enterprise only       |             ✓              |             ✓              |             ✓              |

| 平台         | 4.2 社区版和企业版 | 4.0 社区版和企业版 | 3.6 社区版和企业版 | 3.4 社区版和企业版 |
| :----------- | :----------------: | :----------------: | :----------------: | :----------------: |
| Ubuntu 18.04 |      仅社区版      |                    |                    |                    |
| Ubuntu 16.04 |      仅企业版      |         ✓          |         ✓          |         ✓          |

#### PPC64LE (MongoDB Enterprise Edition)                                                                                     PPC64LE (MongoDB 企业版) 

| Platform Support EOL Notice |                                  |
| :-------------------------: | :------------------------------: |
|    Ubuntu 16.04 PPC64LE     | Support removed in MongoDB 4.2+. |

| 平台支持的 产品生命期结束通知 |                                   |
| :---------------------------: | :-------------------------------: |
|     Ubuntu 16.04 PPC64LE      | 在MongoDB 社区版 4.2+中不再支持。 |

| Platform      | 4.2 Enterprise | 4.0 Enterprise |       3.6 Enterprise       |       3.4 Enterprise       |
| :------------ | :------------: | :------------: | :------------------------: | :------------------------: |
| RHEL/CentOS 7 |       ✓        |       ✓        |             ✓              |             ✓              |
| Ubuntu 18.04  |       ✓        |                |                            |                            |
| Ubuntu 16.04  |                |       ✓        | Removed starting in 3.6.13 | Removed starting in 3.4.21 |

|     平台      | 4.2 企业版 | 4.0 企业版 |       3.6 企业版       |       3.4 企业版       |
| :-----------: | :--------: | :--------: | :--------------------: | :--------------------: |
| RHEL/CentOS 7 |     ✓      |     ✓      |           ✓            |           ✓            |
| Ubuntu 18.04  |     ✓      |            |                        |                        |
| Ubuntu 16.04  |            |     ✓      | 在3.6.13版本中开始移除 | 在3.4.21版本中开始移除 |

#### s390x                                                                                                                                        s390x  

| Platform      | 4.2 Community & Enterprise | 4.0 Enterprise |       3.6 Enterprise       |       3.4 Enterprise       |
| :------------ | :------------------------: | :------------: | :------------------------: | :------------------------: |
| RHEL/CentOS 7 |             ✓              |     4.0.6+     | Removed starting in 3.6.2  | Removed starting in 3.4.14 |
| RHEL/CentOS 6 |             ✓              |       ✓        | Removed starting in 3.6.14 | Removed starting in 3.4.22 |
| SLES12        |             ✓              |     4.0.6+     | Removed starting in 3.6.2  | Removed starting in 3.4.15 |
| Ubuntu 18.04  |           4.2.1+           |     4.0.6+     |                            |                            |



| 平台          | 4.2 社区版和企业版 | 4.0 企业版 |       3.6 企业版       |       3.4 企业版       |
| :------------ | :----------------: | :--------: | :--------------------: | :--------------------: |
| RHEL/CentOS 7 |         ✓          |   4.0.6+   | 在3.6.2版本中开始移除  | 在3.4.14版本中开始移除 |
| RHEL/CentOS 6 |         ✓          |     ✓      | 在3.6.14版本中开始移除 | 在3.4.22版本中开始移除 |
| SLES12        |         ✓          |   4.0.6+   | 在3.6.2版本中开始移除  | 在3.4.15版本中开始移除 |
| Ubuntu 18.04  |       4.2.1+       |   4.0.6+   |                        |                        |

### Recommended Platforms                                                                            推荐的平台

While MongoDB supports a variety of platforms, the following operating systems are recommended for production use:                                                                                                                                                                 虽然 MongoDB 支持各种平台，但建议使用以下操作系统使用产品：

- Amazon Linux 2                                                                                                                                                                        亚马逊 Linux
- Debian 9 and 10                                                                                                                                                                 Debian 9 和 10
- RHEL / CentOS 6, 7, and 8                                                                                                                                                        RHEL / CentOS 6, 7, 和 8
- SLES 12 and 15                                                                                                                                                                          SLES 12 和 15
- Ubuntu LTS 16.04 and 18.04                                                                                                                                              Ubuntu LTS 16.04 和 18.04
- Windows Server 2016 and 2019                                                                                                                                      Windows Server 2016 和 2019

SEE ALSO                                                                                                                                                                                          另见：

[Platform Specific Considerations](https://docs.mongodb.com/manual/administration/production-notes/#prod-notes-platform-considerations)                                                                                                                                                 [平台特定注意事项](https://docs.mongodb.com/manual/administration/production-notes/#prod-notes-platform-considerations)

### Use the Latest Stable Packages                                                                  使用最新的稳定包

Be sure you have the latest stable release.                                                                                                                   确保您拥有最新的稳定版本。

All MongoDB releases are available on the [MongoDB Download Center](https://www.mongodb.com/download-center/community?jmp=docs) page.The [MongoDB Download Center](https://www.mongodb.com/download-center/community?jmp=docs) page is a good place to verify the current stable release, even if you are installing via a package manager.                                                                                                                                                                            所有 MongoDB 版本都可在 [MongoDB 下载中心](https://www.mongodb.com/download-center/community?jmp=docs) 页面获取.  [MongoDB 下载中心](https://www.mongodb.com/download-center/community?jmp=docs) 页面可以找到当前稳定版本，即使您通过包管理进行安装。

For other MongoDB products, refer either to the [MongoDB Download Center](https://www.mongodb.com/download-center/community?jmp=docs) page or their [respective documentation](https://docs.mongodb.com/?jmp=docs).                                                                                                                                                               对对于其他 MongoDB 产品，请参阅 [MongoDB 下载中心](https://www.mongodb.com/download-center/community?jmp=docs) 页面或者 [各自对应文档](https://docs.mongodb.com/?jmp=docs)。

## MongoDB dbPath

## MongoDB 文件存储路径

The files in the [dbPath](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath) directory must correspond to the configured [storage engine](https://docs.mongodb.com/manual/reference/glossary/#term-storage-engine). [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) will not start if [dbPath](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath) contains data files created by a storage engine other than the one specified by [--storageEngine](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-storageengine).  [dbPath](https://www.docs4dev.com/docs/zh/mongodb/v3.6/reference/reference-configuration-options.html#storage.dbPath)目录中的文件必须与配置的[存储引擎](https://docs.mongodb.com/manual/reference/glossary/#term-storage-engine)对应。如果[文件存储路径](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath) 包含由 [--storageEngine](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-storageengine) 指定的存储引擎以外的存储引擎创建的数据文件，[mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 将不会启动。

[mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) must possess read and write permissions for the specified [dbPath](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath).                                            [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)必须对指定的[文件存储路径](https://docs.mongodb.com/manual/reference/configuration-options/#storage.dbPath)拥有读写权限

## Concurrency

## 并发

### WiredTiger                                                                                       WiredTiger

[WiredTiger](https://docs.mongodb.com/manual/core/wiredtiger/#storage-wiredtiger) supports concurrent access by readers and writers to the documents in a collection. Clients can read documents while write operations are in progress, and multiple threads can modify different documents in a collection at the same time.                                                                                                        [WiredTiger](https://docs.mongodb.com/manual/core/wiredtiger/#storage-wiredtiger)支持读写器对对集合中的文档进行并发访问。 客户端可以可以在进行写操作时读取文档，多个线程可以同时修改集合中的不同文档。

SEE ALSO                                                                                                                                                                            也可以看看

[Allocate Sufficient RAM and CPU](https://docs.mongodb.com/manual/administration/production-notes/#prod-notes-ram) provides information about how WiredTiger takes advantage of multiple CPU cores and how to improve operation throughput.                                                                                             [分配足够的 RAM 和 CPU](https://docs.mongodb.com/manual/administration/production-notes/#prod-notes-ram) 提供有关WiredTiger如何利用多个CPU核以及如何提高操作吞吐量的信息。

## Data Consistency

## 数据一致性

### Journaling                                                                                                               日志

MongoDB uses *write ahead logging* to an on-disk [journal](https://docs.mongodb.com/manual/reference/glossary/#term-journal). Journaling guarantees that MongoDB can quickly recover [write operations](https://docs.mongodb.com/manual/crud/) that were written to the journal but not written to data files in cases where [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) terminated due to a crash or other serious failure.                                                                                                MongoDB 使用预写式日志方式写入到磁盘[日志](https://docs.mongodb.com/manual/reference/glossary/#term-journal)。日志记录保证MongoDB可以快速从崩溃或其他严重错误中恢复写入日志但未写入数据文件的 [写操作](https://docs.mongodb.com/manual/crud/)。

Starting in MongoDB 4.0, you cannot specify [--nojournal](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-nojournal) option or [storage.journal.enabled: false](https://docs.mongodb.com/manual/reference/configuration-options/#storage.journal.enabled) for replica set members that use the WiredTiger storage engine.                                                                                                           从MongoDB 4.0开始，不能为使用WiredTiger存储引擎的副本集成员 [--nojournal](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-nojournal) 选项或者[storage.journal.enabled: false](https://docs.mongodb.com/manual/reference/configuration-options/#storage.journal.enabled) 

### Read Concern                                                                                                   读操作安全机制

*New in version 3.2. *                                                                                                                                                                     *在 version 3.2 中的新内容*  

Starting in MongoDB 3.6, you can use [causally consistent sessions](https://docs.mongodb.com/manual/core/read-isolation-consistency-recency/#sessions) to read your own writes, if the writes request acknowledgement.                                                                                                                                             从 MongoDB 3.6 开始，如果写请求确认，则可以使用[因果一致性会话](https://docs.mongodb.com/manual/core/read-isolation-consistency-recency/#sessions)来读取您自己的写入。

Prior to MongoDB 3.6, you must have issued your write operation with [{ w: "majority" }](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority") write concern and then use either ["majority"](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority") or ["linearizable"](https://docs.mongodb.com/manual/reference/read-concern-linearizable/#readconcern."linearizable") read concern for the read operations to ensure that a single thread can read its own writes.                                                                                                                                                                                                                            在 MongoDB 3.6 之前，您必须确保写操作使用了 [{ w: "majority}" ](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern."majority")写入安全机制，然后对读取操作使用 ["majority"](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")或 ["linearizable"](https://docs.mongodb.com/manual/reference/read-concern-linearizable/#readconcern."linearizable")读取安全机制，以确保单个线程可以读取自己的写入。

To use [read concern](https://docs.mongodb.com/manual/reference/glossary/#term-read-concern) level of ["majority"](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority"), replica sets must use [WiredTiger storage engine](https://docs.mongodb.com/manual/core/wiredtiger/#storage-wiredtiger).                                                                       要使用 ["majority"](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority")的级别的 [读安全机制](https://docs.mongodb.com/manual/reference/glossary/#term-read-concern) ，副本集必须使用[WiredTiger 存储引擎](https://docs.mongodb.com/manual/core/wiredtiger/#storage-wiredtiger)。

You can disable read concern ["majority"](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority") for a deployment with a three-member primary-secondary-arbiter (PSA) architecture; however, this has implications for change streams (in MongoDB 4.0 and earlier only) and transactions on sharded clusters. For more information, see [Disable Read Concern Majority](https://docs.mongodb.com/manual/reference/read-concern-majority/#disable-read-concern-majority).                                        您可以禁用具有三个成员的主-副-仲裁(PSA)体系结构部署的读安全机制 ["majority"](https://docs.mongodb.com/manual/reference/read-concern-majority/#readconcern."majority");但是，这对更改流(仅在MongoDB 4.0和更早的版本中)和分片集群上的事务有影响。有关更多信息，请参见[Disable Read Concern Majority](https://docs.mongodb.com/manual/reference/read-concern-majority/#disable-read-concern-majority)。

### Write Concern                                                                                                   写操作安全机制

[Write concern](https://docs.mongodb.com/manual/reference/write-concern/) describes the level of acknowledgement requested from MongoDB for write operations. The level of the write concerns affects how quickly the write operation returns. When write operations have a *weak* write concern, they return quickly. With *stronger* write concerns, clients must wait after sending a write operation until MongoDB confirms the write operation at the requested write concern level. With insufficient write concerns, write operations may appear to a client to have succeeded, but may not persist in some cases of server failure.                                                                                                                                       写操作安全机制](https://docs.mongodb.com/manual/reference/write-concern/) 描述 MongoDB 写操作时确认请求写入的安全机制级别。写操作安全机制的级别会影响写操作返回的速度。当写操作具有较弱的写入安全机制时，它们会快速返回。对于更强的写入安全机制，客户端必须在发送写入操作后等待，直到 MongoDB 在请求的写入安全机制级别上确认写入操作。由于写入安全机制级别不够，写操作可能会显示客户端成功，但在某些服务器故障情况下可能不会缓存。

See the [Write Concern](https://docs.mongodb.com/manual/reference/write-concern/) document for more information about choosing an appropriate write concern level for your deployment.                                                                                                                                                       有关选择适当的写操作安全机制级别的详细信息，请参阅 [写操作安全机制](https://docs.mongodb.com/manual/reference/write-concern/)文档。

## Networking                                                                             

## 联网

### Use Trusted Networking Environments                                                   使用可信网络环境

Always run MongoDB in a *trusted environment*, with network rules that prevent access from *all* unknown machines, systems, and networks. As with any sensitive system that is dependent on network access, your MongoDB deployment should only be accessible to specific systems that require access, such as application servers, monitoring services, and other MongoDB components.                                                                             始终在可信环境中运行 MongoDB，其网络规则阻止从所有未知计算机，系统和网络中进行访问。与依赖于网络访问的任何敏感系统一样，只有需要访问的特定系统才能访问 MongoDB 部署，例如应用服务器，监视服务和其他 MongoDB 组件。

IMPORTANT                                                                                                                                                                            重要

By default, [authorization](https://docs.mongodb.com/manual/core/authorization/) is not enabled, and [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) assumes a trusted environment. Enable [authorization](https://docs.mongodb.com/manual/reference/configuration-options/#security.authorization) mode as needed. For more information on authentication mechanisms supported in MongoDB as well as authorization in MongoDB, see [Authentication](https://docs.mongodb.com/manual/core/authentication/) and [Role-Based Access Control](https://docs.mongodb.com/manual/core/authorization/).                        默认情况下，[授权](https://docs.mongodb.com/manual/core/authorization/)未启用， [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)默认为受信任的环境。根据需要启用[authorization](https://docs.mongodb.com/manual/reference/configuration-options/#security.authorization) 模式。有关 MongoDB 中支持的身份验证机制以及 MongoDB 中的授权的详细信息，请参阅 [授权](https://docs.mongodb.com/manual/core/authentication/)和 [基于角色的访问控制](https://docs.mongodb.com/manual/core/authorization/)。

For additional information and considerations on security, refer to the documents in the [Security Section](https://docs.mongodb.com/manual/security/), specifically:                                                                                                                                                                                  有关安全性的其他信息和注意事项，请参阅[安全部分](https://docs.mongodb.com/manual/security/)中的文档，具体如下：

- [Security Checklist]安全检查表(https://docs.mongodb.com/manual/administration/security-checklist/)
- [Network and Configuration Hardening]网络和配置强化(https://docs.mongodb.com/manual/core/security-hardening/)

For Windows users, consider the [Windows Server Technet Article on TCP Configuration](http://technet.microsoft.com/en-us/library/dd349797.aspx) when deploying MongoDB on Windows.                                                                                                                                                对于 Windows 用户，在 Windows 上部署 MongoDB 时请考虑 [有关TCP配置的Windows Server Technet文章 ](http://technet.microsoft.com/en-us/library/dd349797.aspx)。

### Disable HTTP Interface                                                                                      禁用 HTTP 接口

*Changed in version 3.6:* MongoDB 3.6 removes the deprecated HTTP interface and REST API to MongoDB.    3.6版本中的变化： MongoDB 3.6 移除了 HTTP 接口和 REST API 。

Earlier versions of MongoDB provide an HTTP interface to check the status of the server and, optionally, run queries. The HTTP interface is disabled by default. Do not enable the HTTP interface in production environments.                                                                                                                                                                   早期版本的 MongoDB 提供了一个 HTTP 接口来检查服务器的状态，还可以选择运行查询。默认情况下禁用 HTTP 接口。不要在生产环境中启用 HTTP 接口。

### Manage Connection Pool Sizes                                                                    管理连接池大小

Avoid overloading the connection resources of a [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) or [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) instance by adjusting the connection pool size to suit your use case. Start at 110-115% of the typical number of current database requests, and modify the connection pool size as needed. Refer to the [Connection Pool Options](https://docs.mongodb.com/manual/reference/connection-string/#connection-pool-options) for adjusting the connection pool size.                                                                                                                                                        通过调整连接池大小以适合您的用例，避免重载 [mongod ](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)和 [mongos ](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)实例的连接资源。从当前数据库请求的典型数量的 110-115％开始，并根据需要修改连接池大小。请参阅[连接池选项](https://docs.mongodb.com/manual/reference/connection-string/#connection-pool-options)以调整连接池大小。

The [connPoolStats](https://docs.mongodb.com/manual/reference/command/connPoolStats/#dbcmd.connPoolStats) command returns information regarding the number of open connections to the current database for [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) and [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instances in sharded clusters.                                                            [connPoolStats](https://docs.mongodb.com/manual/reference/command/connPoolStats/#dbcmd.connPoolStats) 命令返回有关分片集群中[mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) 和 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)实例的当前数据库打开连接数的信息。 

See also [Allocate Sufficient RAM and CPU](https://docs.mongodb.com/manual/administration/production-notes/#prod-notes-ram).                                                                                                                      另见 [分配足够的 RAM 和 CPU](https://docs.mongodb.com/manual/administration/production-notes/#prod-notes-ram).

### Hardware Considerations                                                                                       硬件考虑因素

MongoDB is designed specifically with commodity hardware in mind and has few hardware requirements or limitations. MongoDB’s core components run on little-endian hardware, primarily x86/x86_64 processors. Client libraries (i.e. drivers) can run on big or little endian systems.                                           MongoDB 专为商用硬件而设计，几乎没有硬件要求或限制。 MongoDB 的核心组件运行在小端硬件上，主要是 x86/x86_64 处理器。客户端库（例如驱动程序）可以在大端或小端系统上运行。

### Allocate Sufficient RAM and CPU                                                                分配足够的 RAM 和 CPU

At a minimum, ensure that each [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) or [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) instance has access to two real cores or one multi-core physical CPU.                                                                                                                                                                        至少，确保每个 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 或者 [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)实例可以访问两个实核或一个多核物理CPU。

#### WiredTiger                                                                                                                    WiredTiger

The [WiredTiger](https://docs.mongodb.com/manual/core/wiredtiger/#storage-wiredtiger) storage engine is multithreaded and can take advantage of additional CPU cores. Specifically, the total number of active threads (i.e. concurrent operations) relative to the number of available CPUs can impact performance:                                                                                                                     [WiredTiger](https://docs.mongodb.com/manual/core/wiredtiger/#storage-wiredtiger) 存储引擎是多线程的，可以利用额外的 CPU 内核。具体而言，相对于可用CPU的数量，活动线程（即并发操作）的总数会影响性能：

- Throughput *increases* as the number of concurrent active operations increases up to the number of CPUs.
- 随着并发活动操作数量增加到 CPU 数量，吞吐量会增加。
- Throughput *decreases* as the number of concurrent active operations exceeds the number of CPUs by some threshold amount.
- 当并发活动操作的数量超过CPU数量的某个阈值时，吞吐量会降低。

The threshold depends on your application. You can determine the optimum number of concurrent active operations for your application by experimenting and measuring throughput. The output from [mongostat](https://docs.mongodb.com/manual/reference/program/mongostat/#bin.mongostat) provides statistics on the number of active reads/writes in the (ar|aw) column.                                                      阈值取决于您的应用程序。您可以通过实验和测量吞吐量来确定应用程序的最佳并发活动操作数。 [mongostat](https://docs.mongodb.com/manual/reference/program/mongostat/#bin.mongostat) 的输出提供（ar | aw）列中活动读/写次数的统计信息。

With WiredTiger, MongoDB utilizes both the WiredTiger internal cache and the filesystem cache.                             使用 WiredTiger，MongoDB同时使用WiredTiger内部缓存和文件系统缓存。

Starting in MongoDB 3.4, the default WiredTiger internal cache size is the larger of either:                                从MongoDB 3.4开始，默认的WiredTiger内部缓存大小为以下两者中的较大者：

- 50% of (RAM - 1 GB), or                                                                                                                                                             50% 的 (RAM - 1 GB), 或者
- 256 MB.                                                                                                                                                                                 256MB。

For example, on a system with a total of 4GB of RAM the WiredTiger cache will use 1.5GB of RAM (0.5 * (4 GB - 1 GB) = 1.5 GB). Conversely, a system with a total of 1.25 GB of RAM will allocate 256 MB to the WiredTiger cache because that is more than half of the total RAM minus one gigabyte (0.5 * (1.25 GB - 1 GB) = 128 MB < 256 MB).                 

例如，在总共有4GB RAM的系统上，WiredTiger缓存将使用1.5GB RAM(0.5 * (4 GB - 1 GB) = 1.5 GB)。相反，RAM总量为1.25GB的系统将为WiredTiger缓存分配256MB，因为这超过了RAM总量减去1GB（0.5*（1.25GB-1GB）=128MB<256MB) 的一半。

NOTE                                                                                                                                                                             
注意

In some instances, such as when running in a container, the database can have memory constraints that are lower than the total system memory. In such instances, this memory limit, rather than the total system memory, is used as the maximum RAM available.  

在某些情况下，例如在容器中运行时，数据库可能具有低于总系统内存的内存约束。在这种情况下，这个内存限制，而不是整个系统内存，被用作可用的最大RAM。

To see the memory limit, see [hostInfo.system.memLimitMB](https://docs.mongodb.com/manual/reference/command/hostInfo/#hostInfo.system.memLimitMB).                               

要查看内存限制，请参阅 [hostInfo.system.memLimitMB](https://docs.mongodb.com/manual/reference/command/hostInfo/#hostInfo.system.memLimitMB)。

By default, WiredTiger uses Snappy block compression for all collections and prefix compression for all indexes. Compression defaults are configurable at a global level and can also be set on a per-collection and per-index basis during collection and index creation.                                                                                       

默认情况下，WiredTiger对所有集合使用snapy块压缩，对所有索引使用前缀压缩。压缩默认值在全局级别上是可配置的，也可以在集合和索引创建期间根据每个集合和每个索引进行设置。

Different representations are used for data in the WiredTiger internal cache versus the on-disk format:

WiredTiger内部缓存中的数据与磁盘上的格式相比使用了不同的表示：

- Data in the filesystem cache is the same as the on-disk format, including benefits of any compression for data files. The filesystem cache is used by the operating system to reduce disk I/O.

文件系统缓存中的数据与磁盘上的格式相同，包括对数据文件进行任何压缩的好处。操作系统使用文件系统缓存来减少磁盘I/O。

- Indexes loaded in the WiredTiger internal cache have a different data representation to the on-disk format, but can still take advantage of index prefix compression to reduce RAM usage. Index prefix compression deduplicates common prefixes from indexed fields.  

加载在WiredTiger内部缓存中的索引与磁盘上的格式具有不同的数据表示形式，但仍然可以利用索引前缀压缩来减少RAM的使用。索引前缀压缩从索引字段中删除常用前缀。

- Collection data in the WiredTiger internal cache is uncompressed and uses a different representation from the on-disk format. Block compression can provide significant on-disk storage savings, but data must be uncompressed to be manipulated by the server.  

WiredTiger内部缓存中的收集数据是未压缩的，使用与磁盘格式不同的表示形式。块压缩可以显著节省磁盘存储空间，但数据必须解压缩才能由服务器操作。

Via the filesystem cache, MongoDB automatically uses all free memory that is not used by the WiredTiger cache or by other processes.                                                                                                                                                                                                                             MongoDB通过文件系统缓存自动使用WiredTiger缓存或其他进程未使用的所有可用内存。

To adjust the size of the WiredTiger internal cache, see [storage.wiredTiger.engineConfig.cacheSizeGB](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.engineConfig.cacheSizeGB) and [--wiredTigerCacheSizeGB](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-wiredtigercachesizegb). Avoid increasing the WiredTiger internal cache size above its default value.

要调整WiredTiger内部缓存的大小，请参见 [storage.wiredTiger.engineConfig.cacheSizeGB](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.engineConfig.cacheSizeGB) 和 [--wiredTigerCacheSizeGB](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-wiredtigercachesizegb)。避免将WiredTiger内部缓存大小增加到其默认值以上。

NOTE                                                                                                                                                                             注意

The [storage.wiredTiger.engineConfig.cacheSizeGB](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.engineConfig.cacheSizeGB) limits the size of the WiredTiger internal cache. The operating system will use the available free memory for filesystem cache, which allows the compressed MongoDB data files to stay in memory. In addition, the operating system will use any free RAM to buffer file system blocks and file system cache.                                                             

[storage.wiredTiger.engineConfig.cacheSizeGB](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.engineConfig.cacheSizeGB) 限制了wiredTiger内部缓存的大小。操作系统将使用可用的空闲内存进行文件系统缓存，这将允许压缩的MongoDB数据文件保留在内存中。此外，操作系统将使用任何空闲RAM缓冲文件系统块和文件系统缓存。

To accommodate the additional consumers of RAM, you may have to decrease WiredTiger internal cache size.                                                                         

为了适应RAM的其他使用者，您可能必须减小WiredTiger内部缓存的大小。

The default WiredTiger internal cache size value assumes that there is a single [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instance per machine. If a single machine contains multiple MongoDB instances, then you should decrease the setting to accommodate the other [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instances.                                                                                               

默认的WiredTiger内部缓存大小值假定每台计算机有一个[mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)实例。如果一台机器包含多个MongoDB实例，那么您应该减少设置以适应其他[mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)实例。

If you run [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) in a container (e.g. lxc, cgroups, Docker, etc.) that does *not* have access to all of the RAM available in a system, you must set [storage.wiredTiger.engineConfig.cacheSizeGB](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.engineConfig.cacheSizeGB) to a value less than the amount of RAM available in the container. The exact amount depends on the other processes running in the container. See [memLimitMB](https://docs.mongodb.com/manual/reference/command/hostInfo/#hostInfo.system.memLimitMB). 

如果在无法访问系统中所有可用RAM的容器（例如lxc、cgroups、Docker等）中运行[mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)，则必须将 [storage.wiredTiger.engineConfig.cacheSizeGB](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.engineConfig.cacheSizeGB)设置为小于容器中可用RAM的值。具体数量取决于容器中运行的其他进程。参见 [memLimitMB](https://docs.mongodb.com/manual/reference/command/hostInfo/#hostInfo.system.memLimitMB)。

To view statistics on the cache and eviction rate, see the [wiredTiger.cache](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.wiredTiger.cache) field returned from the [serverStatus](https://docs.mongodb.com/manual/reference/command/serverStatus/#dbcmd.serverStatus) command.                                             

要查看缓存和逐出率的统计信息，请参阅从[serverStatus](https://docs.mongodb.com/manual/reference/command/serverStatus/#dbcmd.serverStatus) 命令返回的 [wiredTiger.cache](https://docs.mongodb.com/manual/reference/command/serverStatus/#serverstatus.wiredTiger.cache) 字段。

#### Compression and Encryption                                                                                                            压缩和加密

When using encryption, CPUs equipped with AES-NI instruction-set extensions show significant performance advantages. If you are using MongoDB Enterprise with the [Encrypted Storage Engine](https://docs.mongodb.com/manual/core/security-encryption-at-rest/#encrypted-storage-engine), choose a CPU that supports AES-NI for better performance.                                                                                                              当使用加密时，配备AES-NI指令集扩展的CPU可以显示出显著的性能优势。如果将MongoDB 企业版与 [加密存储引擎](https://docs.mongodb.com/manual/core/security-encryption-at-rest/#encrypted-storage-engine)一起使用，请选择支持AES-N指令集的CPU以获得更好的性能。

SEE ALSO                                                                                                                                                                         
也可以看看

[Concurrency](https://docs.mongodb.com/manual/administration/production-notes/#prod-notes-concurrency)                                                                           

[并发](https://docs.mongodb.com/manual/administration/production-notes/#prod-notes-concurrency)


### Use Solid State Disks (SSDs) 使用固态硬盘（SSD）

MongoDB has good results and a good price-performance ratio with SATA SSD (Solid State Disk).
MongoDB使用SATA SSD能得到很好的效果和很好的性价比。

Use SSD if available and economical.

在可用且经济的情况下请使用SSD。

Commodity (SATA) spinning drives are often a good option, as the random I/O performance increase with more expensive spinning drives is not that dramatic (only on the order of 2x). Using SSDs or increasing RAM may be more effective in increasing I/O throughput.                                                                                           

传统硬盘通常也是个好的选择，因为使用更昂贵的硬盘来提高随机IO性能并不是那么有效（只能是每次2倍）。使用SSD或增加RAM的容量可能对于提升IO更有效率。

### MongoDB and NUMA Hardware MongoDB和NUMA硬件

Running MongoDB on a system with Non-Uniform Memory Access (NUMA) can cause a number of operational problems, including slow performance for periods of time and high system process usage.

在运行NUMA的系统中运行MongoDB可能造成一系列问题，包括一段时间内的效率低下和高系统进程使用率。

When running MongoDB servers and clients on NUMA hardware, you should configure a memory interleave policy so that the host behaves in a non-NUMA fashion. MongoDB checks NUMA settings on start up when deployed on Linux (since version 2.0) and Windows (since version 2.6) machines. If the NUMA configuration may degrade performance, MongoDB prints a warning.

当在NUMA硬件上运行MongoDB服务器和客户端时，应配置内存交错策略，以便主机以非NUMA方式运行。MongoDB在Linux（2.0版以后）和Windows（2.6版以后）机器上部署时，会在启动时检查NUMA设置。如果NUMA配置可能会降低性能，MongoDB会打印一个警告。

SEE ALSO                                                                                                                                                                         
也可以看看

- [The MySQL “swap insanity” problem and the effects of NUMA](http://jcole.us/blog/archives/2010/09/28/mysql-swap-insanity-and-the-numa-architecture/) post, which describes the effects of NUMA on databases. The post introduces NUMA and its goals, and illustrates how these goals are not compatible with production databases. Although the blog post addresses the impact of NUMA for MySQL, the issues for MongoDB are similar.

- [MySQL的 “疯狂交换” 问题和 NUMA的影响](http://jcole.us/blog/archives/2010/09/28/mysql-swap-insanity-and-the-numa-architecture/) 报告, ，它描述了NUMA对数据库造成的影响。这篇文章介绍了NUMA和它的目标，并指出了为什么这些目标和生产环境数据库的需求是不相容的。尽管这篇博文讨论了NUMA对于 MySQL的影响，但是MongoDB的问题是相似的。
- [NUMA: An Overview](https://queue.acm.org/detail.cfm?id=2513149). 

[NUMA: 综述](https://queue.acm.org/detail.cfm?id=2513149)。

#### Configuring NUMA on Windows 在 Windows 上配置 NUMA

On Windows, memory interleaving must be enabled through the machine’s BIOS. Consult your system documentation for details.                                                       

在 Windows 上，必须通过机器的 BIOS 启用内存交叉存取。有关详细信息，请参阅系统文档

#### Configuring NUMA on Linux 在 Linux 上配置 NUMA                                                                                                  

On Linux, you must disable *zone reclaim* and also ensure that your [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) and [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) instances are started by numactl, which is generally configured through your platform’s init system. You must perform both of these operations to properly disable NUMA for use with MongoDB.

在 Linux上，您必须禁用内存区域回收，并确保您的 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) and [mongos ](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) 实例由 numactl命令启动，numactl 通常是通过平台的 init 系统配置的。您必须执行这两个操作才能正确禁用 NUMA 以便与 MongoDB 一起使用。

1. Disable *zone reclaim* with one of the following commands: 

使用以下命令之一禁用内存区域回收:

   ```
echo 0 | sudo tee /proc/sys/vm/zone_reclaim_mod
   ```

   ```
sudo sysctl -w vm.zone_reclaim_mode=0
   ```

2. Ensure that [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) and [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) are started by numactl. This is generally configured through your platform’s init system. Run the following command to determine which init system is in use on your platform:

   然后，您应该使用 numactl 来启动 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) and [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) ，这通常是通过平台的 init 系统配置的。运行以下命令以确定平台上正在使用的init系统：

   ```
   ps --no-headers -o comm 1
   ```

   - If “systemd”, your platform uses the systemd init system, and you *must* follow the steps in the systemd tab below to edit your MongoDB service file(s).
   - 如果是systemd，则您的平台使用 systemd init 系统，您必须按照下面 systemd 选项卡中的步骤来编辑MongoDB服务文件。
   - If init, your platform uses the SysV Init system, and you do not need to perform this step. The default MongoDB init script for SysV Init includes the necessary steps to start MongoDB instances via numactl by default.
   - 如果是init，则平台使用SysV init系统，不需要执行此步骤。SysV init 的默认MongoDB init 脚本默认包含通过numactl 启动 MongoDB 实例的必要步骤。
   - If you manage your own init scripts (i.e. you are not using either of these init systems), you must follow the steps in the Custom init scripts tab below to edit your custom init script(s).
   - 如果您管理自己的 init 脚本（例如没有使用这两个 init 系统中的任何一个），则必须按照下面自定义 init 脚本选项卡中的步骤编辑自定义 init 脚本。

   ##### systemd                                                                                                                                                                      systemd

   You must use numactl to start each of your [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instances, including all [config servers](https://docs.mongodb.com/manual/core/sharded-cluster-config-servers/), [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) instances, and clients. Edit the default systemd service file for each as follows:
   
   你必须使用 numactl 启动每个 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 实例,包括所有 [配置服务器](https://docs.mongodb.com/manual/core/sharded-cluster-config-servers/), [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)实例,和客户端.。如下所示编辑每个系统的默认 systemd 服务文件：

   1. Copy the default MongoDB service file:复制默认MongoDB服务文件：

      ```
   sudo cp /lib/systemd/system/mongod.service /etc/systemd/system/
      ```


 2. Edit the /etc/systemd/system/mongod.service file,  and update the ExecStart statement to begin with:                                                                         编辑 /etc/systemd/system/mongod.service 文件，首先要更新 ExecStart 语句：
   
      ```
   /usr/bin/numactl --interleave=all
      ```
      
EXAMPLE  
例如


If your existing ExecStart statement reads: 
如果现有的 ExecStart 语句为：

      ```
   ExecStart=/usr/bin/mongod --config /etc/mongod.conf
      ```


Update that statement to read: 将该语句更新为：


      ```
   ExecStart=/usr/bin/numactl --interleave=all /usr/bin/mongod --config /etc/mongod.conf
      ```

   3. Apply the change to systemd:
   将更改应用于 systemd：

   ```
      sudo systemctl daemon-reload
   ```
   
   4. Restart any running mongod instances: 重新启动任何正在运行的 mongod 实例：

      ```
      sudo systemctl stop mongod
      sudo systemctl start mongod
      ```

   5. If applicable, repeat these steps for any [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) instances.                                       
   如果适用，对任何[mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) 重复这些步骤。
   

For more information, see the [Documentation for /proc/sys/vm/*](http://www.kernel.org/doc/Documentation/sysctl/vm.txt).                                                         

有关更多信息，请参见 [Documentation for /proc/sys/vm/*](http://www.kernel.org/doc/Documentation/sysctl/vm.txt)。

##### Custom init scripts                                                                                                                                                       自定义初始化脚本

You must use `numactl` to start each of your [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instances, including all [config servers](https://docs.mongodb.com/manual/core/sharded-cluster-config-servers/), [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) instances, and clients.                                                                                                                                                       你必须使用 numactl 启动每个 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 实例,包括所有 [配置服务器](https://docs.mongodb.com/manual/core/sharded-cluster-config-servers/), [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)实例和客户端。


1. Install numactl for your platform if not already installed. Refer to the documentation for your operating system for information on installing the numactl  package.         
如果尚未安装numactl，请为您的平台安装 numactl。有关安装 numactl 包的信息，请参阅操作系统的文档。

2. Configure each of your custom init scripts to start each MongoDB instance via numactl:
配置每个自定义init脚本以通过numactl启动每个MongoDB实例：

   ```
   numactl --interleave=all <path> <options>
   ```

   Where <path> is the path to the program you are starting and  are any optional arguments to pass to that program.                                                              其中是 <path> 是要启动的程序的路径，也是要传递给该程序的任何可选参数。

   EXAMPLE：                                                                                                                                                                       例如：

   ```
   numactl --interleave=all /usr/local/bin/mongod -f /etc/mongod.conf
   ```

For more information, see the [Documentation for /proc/sys/vm/*](http://www.kernel.org/doc/Documentation/sysctl/vm.txt).                                                         有关更多信息，请参见 [Documentation for /proc/sys/vm/*](http://www.kernel.org/doc/Documentation/sysctl/vm.txt)。

### Disk and Storage Systems 磁盘和存储系统

#### Swap 交换

MongoDB performs best where swapping can be avoided or kept to a minimum, as retrieving data from swap will always be slower than accessing data in RAM. However, if the system hosting MongoDB runs out of RAM, swapping can prevent the Linux OOM Killer from terminating the [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) process.
MongoDB在可以避免交换或将交换保持在最低限度的地方表现最好，因为从交换中检索数据总是比访问RAM中的数据慢。但是，如果托管 MongoDB 的系统没有RAM，交换可以防止 Linux OOM Killer 终止 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 进程。

Generally, you should choose one of the following swap strategies:
通常，您应该选择以下交换策略之一：

1. Assign swap space on your system, and configure the kernel to only permit swapping under high memory load, or                                                                 在系统上分配交换空间，并将内核配置为只允许在高内存负载下进行交换，或者
2. Do not assign swap space on your system, and configure the kernel to disable swapping entirely 
不要在系统上分配交换空间，并将内核配置为完全禁用交换

See [Set vm.swappiness](https://docs.mongodb.com/manual/administration/production-notes/#set-swappiness) for instructions on configuring swap on your Linux system following these guidelines.                                                                                                                                                               请参阅 [Set vm.swappiness](https://docs.mongodb.com/manual/administration/production-notes/#set-swappiness) 以获取有关在Linux系统上按照这些指导原则配置swap的说明。

NOTE                                                                                                                                                                             注意

If your MongoDB instance is hosted on a system that also runs other software, such as a webserver, you should choose the first swap strategy. Do *not* disable swap in this case. If possible, it is highly recommended that you run MongoDB on its own dedicated system.                                                                       如果MongoDB实例托管在同时运行其他软件（如Web服务器）的系统上，则应选择第一个交换策略。在这种情况下不要禁用交换。如果可能，强烈建议您在MongoDB自己的专用系统上运行MongoDB。

#### RAID                                                                                                                                                                  磁盘阵列

For optimal performance in terms of the storage layer, use disks backed by RAID-10. RAID-5 and RAID-6 do not typically provide sufficient performance to support a MongoDB deployment.
为了在存储层方面实现最佳性能，请使用 RAID-10 支持的磁盘。 RAID-5 和 RAID-6 通常不提供足够的 性能来支持 MongoDB 部署。

#### Remote Filesystems                                                                                                                                   远程文件系统

With the WiredTiger storage engine, WiredTiger objects may be stored on remote file systems if the remote file system conforms to ISO/IEC 9945-1:1996 (POSIX.1). Because remote file systems are often slower than local file systems, using a remote file system for storage may degrade performance.                                               使用 WiredTiger 存储引擎，如果远程文件系统符合 ISO/IEC 9945-1:1996(POSIX.1)，则 WiredTiger 对象 可以存储在远程文件系统上。由于远程文件系统通常比本地文件系统慢，因此使用 远程文件系统进行存储可能会降低性能。

If you decide to use NFS, add the following NFS options to your /etc/fstab file: bg, nolock, and noatime. 
如果决定使用网络文件系统，请在 /etc/fstab 文件中添加以下NFS选项：bg、nolock 和 noatime。

#### Separate Components onto Different Storage Devices 将组件分离到不同的存储设备上

For improved performance, consider separating your database’s data, journal, and logs onto different storage devices, based on your application’s access and write pattern. Mount the components as separate filesystems and use symbolic links to map each component’s path to the device storing it.

为了提高性能，请考虑根据应用程序的访问和写入模式，将数据库的数据、logs 和 journal 分离到不同的存储设备上。将组件作为单独的文件系统挂载，并使用符号链接将每个组件的路径映射到存储它的设备。

For the WiredTiger storage engine, you can also store the indexes on a different storage device. See [storage.wiredTiger.engineConfig.directoryForIndexes](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.engineConfig.directoryForIndexes).                                                         

对于WiredTiger存储引擎，还可以将索引存储在不同的存储设备上。见[storage.wiredTiger.engineConfig.directoryForIndexes](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.engineConfig.directoryForIndexes)。  

NOTE                                                                                                                                                                             注意

Using different storage devices will affect your ability to create snapshot-style backups of your data, since the files will be on different devices and volumes.               

使用不同的存储设备将影响您创建数据快照式备份的能力，因为文件将位于不同的设备和卷上。

#### Scheduling 调度

##### Scheduling for Virtual or Cloud Hosted Devices                                                                                                                          虚拟或云主机设备的调度

For local block devices attached to a virtual machine instance via the hypervisor or hosted by a cloud hosting provider, the guest operating system should use a *noop* scheduler for best performance. The *noop* scheduler allows the operating system to defer I/O scheduling to the underlying hypervisor.                                              对于通过虚拟机监视器连接到虚拟机实例或由云托管提供商托管的本地块设备，客户操作系统应使用 noop 调度器以获得最佳性能。noop 调度器允许操作系统将 I/O 调度延缓到底层管理程序。

##### Scheduling for Physical Servers 物理服务器的调度

For physical servers, the operating system should use a *deadline* scheduler. The *deadline* scheduler caps maximum latency per request and maintains a good disk throughput that is best for disk-intensive database applications.                                                                                                                           

对于物理服务器，操作系统应使用 *deadline*调度器。*deadline*调度器限制每个请求的最大延迟，并保持良好的磁盘吞吐量，这对于磁盘密集型数据库应用程序来说是最好的。

## Architecture  架构

### Replica Sets 副本集

See the [Replica Set Architectures](https://docs.mongodb.com/manual/core/replica-set-architectures/) document for an overview of architectural considerations for replica set deployments.                                                                                                                                                                     

有关副本集部署的体系结构注意事项的概述，请参阅 [副本集体系结构文档](https://docs.mongodb.com/manual/core/replica-set-architectures/)。

### Sharded Clusters 分片集群

See [Sharded Cluster Production Architecture](https://docs.mongodb.com/manual/core/sharded-cluster-components/) for an overview of recommended sharded cluster architectures for production deployments. 

有关建议的用于生产部署的分片集群体系结构的概述，请参阅[分片集群生产体系结构 ](https://docs.mongodb.com/manual/core/sharded-cluster-components/)。

SEE ALSO也可以参阅

[Development Checklist](https://docs.mongodb.com/manual/administration/production-checklist-development/)                                                                       

[开发清单列表](https://docs.mongodb.com/manual/administration/production-checklist-development/)

## Compression 压缩

WiredTiger can compress collection data using one of the following compression library: 

WiredTiger可以使用以下压缩库之一压缩收集数据：

- [snappy](https://docs.mongodb.com/manual/reference/glossary/#term-snappy)

  Provides a lower compression rate than zlib or zstd but has a lower CPU cost than either.

  [snappy](https://docs.mongodb.com/manual/reference/glossary/#term-snappy)

  提供比zlib或zstd更低的压缩率，但比任何一种的CPU成本都低。

- [zlib](https://docs.mongodb.com/manual/reference/glossary/#term-zlib)

  Provides better compression rate than snappy but has a higher CPU cost than both snappy and zstd.

  [zlib](https://docs.mongodb.com/manual/reference/glossary/#term-zlib)

  提供了比 snappy 更好的压缩率，但比 snappy 和 zstd 的CPU成本都要高。

- [zstd](https://docs.mongodb.com/manual/reference/glossary/#term-zstd) (Available starting in MongoDB 4.2)

  Provides better compression rate than both snappy and zlib and has a lower CPU cost than zlib.

  [zstd](https://docs.mongodb.com/manual/reference/glossary/#term-zstd) (从 MongoDB 4.2 开始可以使用)

  提供比 snappy 和 zlib 更好的压缩率，并且比 zlib 具有更低的CPU成本。

By default, WiredTiger uses [snappy](https://docs.mongodb.com/manual/reference/glossary/#term-snappy) compression library. To change the compression setting, see [storage.wiredTiger.collectionConfig.blockCompressor](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.collectionConfig.blockCompressor). 

默认情况下，WiredTiger使用 [snappy](https://docs.mongodb.com/manual/reference/glossary/#term-snappy) 压缩库。要更改压缩设置，请参见[storage.wiredTiger.collectionConfig.blockCompressor](https://docs.mongodb.com/manual/reference/configuration-options/#storage.wiredTiger.collectionConfig.blockCompressor)。

WiredTiger uses [prefix compression](https://docs.mongodb.com/manual/reference/glossary/#term-prefix-compression) on all indexes by default.

默认情况下，WiredTiger对所有索引使用 [前缀压缩](https://docs.mongodb.com/manual/reference/glossary/#term-prefix-compression) 。

## Clock Synchronization 

## 时钟同步 

MongoDB [components](https://docs.mongodb.com/manual/reference/program/) keep logical clocks for supporting time-dependent operations. Using [NTP](http://www.ntp.org/) to synchronize host machine clocks mitigates the risk of clock drift between components. Clock drift between components increases the likelihood of incorrect or abnormal behavior of time-dependent operations like the following:                                                                                                                                 

MongoDB [组件](https://docs.mongodb.com/manual/reference/program/)保留逻辑时钟以支持与时间相关的操作。使用[网络时间协议](http://www.ntp.org/)同步主机时钟来降低组件之间时钟漂移的风险。组件之间的时钟漂移增加了时间相关操作不正确或异常行为的可能性，如下所示：

- If the underlying system clock of any given MongoDB component drifts a year or more from other components in the same deployment, communication between those members may become unreliable or halt altogether. 

如果任何给定 MongoDB 组件的底层系统时钟偏离同一部署中的其他组件一年或更长时间，则这些成员之间的通信可能变得不可靠或完全停止。

  The [maxAcceptableLogicalClockDriftSecs](https://docs.mongodb.com/manual/reference/parameters/#param.maxAcceptableLogicalClockDriftSecs) parameter controls the amount of acceptable clock drift between components. Clusters with a lower value of maxAcceptableLogicalClockDriftSecs have a correspondingly lower tolerance for clock drift.

  [maxAcceptableLogicalClockDriftSecs](https://docs.mongodb.com/manual/reference/parameters/#param.maxAcceptableLogicalClockDriftSecs) 参数控制组件之间可接受的时钟偏移量。MaxAcceptableLogicalClockDiftSecs值较低的集群对时钟漂移的容忍度相应较低。

- Two cluster members with different system clocks may return different values for operations that return the current cluster or system time, such as [Date()](https://docs.mongodb.com/manual/reference/method/Date/#Date), [NOW](https://docs.mongodb.com/manual/reference/aggregation-variables/#variable.NOW), and [CLUSTER_TIME](https://docs.mongodb.com/manual/reference/aggregation-variables/#variable.CLUSTER_TIME).                                                                                       

对于返回当前集群或系统时间的操作，具有不同系统时钟的两个集群成员可能返回不同的值，例如 [Date()](https://docs.mongodb.com/manual/reference/method/Date/#Date), [NOW](https://docs.mongodb.com/manual/reference/aggregation-variables/#variable.NOW), 和 [CLUSTER_TIME](https://docs.mongodb.com/manual/reference/aggregation-variables/#variable.CLUSTER_TIME)。

- Features which rely on timekeeping may have inconsistent or unpredictable behavior in clusters with clock drift between MongoDB components.                                   

在MongoDB组件之间存在时钟漂移的集群中，依赖于计时的特性可能会有不一致或不可预测的行为。

For example, [TTL indexes](https://docs.mongodb.com/manual/core/index-ttl/#index-feature-ttl) rely on the system clock to calculate when to delete a given document. If two members have different system clock times, each member could delete a given document covered by the TTL index at a different time. Since [Client Sessions and Causal Consistency Guarantees](https://docs.mongodb.com/manual/core/read-isolation-consistency-recency/#sessions) use TTL indexes to control their lifespan, clock drift could result in inconsistent or unpredictable session timeout behavior.

例如，[TTL索引](https://docs.mongodb.com/manual/core/index-ttl/#index-feature-ttl)依赖于系统时钟来计算何时删除给定文档。如果两个成员有不同的系统时钟时间，则每个成员可以在不同的时间删除TTL索引覆盖的给定文档。由于[客户端会话和因果一致性](https://docs.mongodb.com/manual/core/read-isolation-consistency-recency/#sessions)保证使用TTL索引来控制它们的寿命，时钟漂移可能导致不一致或不可预测的会话超时行为。

NTP synchronization is required for deployments running MongoDB lower than 3.4.6 or 3.2.17 with the WiredTiger storage engine, where clock drift could lead to [checkpoint hangs](https://jira.mongodb.org/browse/WT-3227). The issue was fixed in MongoDB [3.4.6+](https://docs.mongodb.com/manual/release-notes/3.4-changelog/#id148) and MongoDB [3.2.17+](https://docs.mongodb.com/manual/release-notes/3.2/#id5), and is resolved in all point release of MongoDB 3.6, 4.0, and 4.2.                                           

运行 MongoDB 低于 3.4.6 或 3.2.17 的部署需要 NTP 同步，使用 WiredTiger 存储引擎，时钟漂移可能导致[检查点挂起](https://jira.mongodb.org/browse/WT-3227)。该问题在 MongoDB [3.4.6+](https://docs.mongodb.com/manual/release-notes/3.4-changelog/#id148) 和 MongoDB [3.2.17+](https://docs.mongodb.com/manual/release-notes/3.2/#id5) 中得到了修复，并在 MongoDB 3.6、4.0 和 4.2 版本中所有点得到了解决。




## Platform Specific Considerations

## 平台特定注意事项

### MongoDB on Linux  Linux 上的 MongoDB

#### Kernel and File Systems 内核和文件系统

When running MongoDB in production on Linux, you should use Linux kernel version 2.6.36 or later, with either the XFS or EXT4 filesystem. If possible, use XFS as it generally performs better with MongoDB.                                                                                                                                                   

在Linux上的生产环境中运行MongoDB时，应该使用 Linux 内核版本 2.6.36 或更高版本，并使用 XFS或 EXT4 文件系统。如果可能的话，使用 XFS，因为它通常在 MongoDB 中执行得更好。

With the [WiredTiger storage engine](https://docs.mongodb.com/manual/core/wiredtiger/#storage-wiredtiger), using XFS is strongly recommended for data bearing nodes to avoid performance issues that may occur when using EXT4 with WiredTiger. 

对于 [WiredTiger 存储引擎](https://docs.mongodb.com/manual/core/wiredtiger/#storage-wiredtiger)，强烈建议使用 XFS，以避免将 EXT4 与 WiredTiger 一起使用时可能出现的性能问题。

- In general, if you use the XFS file system, use at least version 2.6.25 of the Linux Kernel. 
- 一般来说，如果您使用的是 XFS 文件系统，那么至少要使用 2.6.25 版本的Linux内核。
- If you use the EXT4 file system, use at least version 2.6.28 of the Linux Kernel.  
- 如果使用 EXT4 文件系统，请至少使用 2.6.28 版本的 Linux 内核。
- On Red Hat Enterprise Linux and CentOS, use at least version 2.6.18-194 of the Linux kernel.
- 在Red Hat 企业版 Linux 和 CentOS 上，至少使用 2.6.18-194 版 Linux 内核。

#### System C Library    系统C库

MongoDB uses the [GNU C Library](http://www.gnu.org/software/libc/) (glibc) on Linux. Generally, each Linux distro provides its own vetted version of this library. For best results, use the latest update available for this system-provided version. You can check whether you have the latest version installed by using your system’s package manager. For example: 

MongoDB在Linux上使用 [GNU C 库](http://www.gnu.org/software/libc/) (glibc)。一般来说，每个Linux发行版都提供了自己经过审查的版本。为了获得最佳结果，请使用此系统提供版本的最新更新。您可以使用系统的包管理器检查是否安装了最新版本。例如：

- On RHEL / CentOS, the following command updates the system-provided GNU C Library:

- 在 RHEL/CentOS 上，以下命令更新系统提供的 GNU C 库：

  ```
  sudo yum update glibc
  ```

- On Ubuntu / Debian, the following command updates the system-provided GNU C Library: 

- 在Ubuntu/Debian上，以下命令更新系统提供的 GNU C 库：

  ```
  sudo apt-get install libc6
  ```

#### fsync() on Directories  目录中的 fsync()

IMPORTANT

 重要

MongoDB requires a filesystem that supports fsync() *on directories*. For example, HGFS and Virtual Box’s shared folders do *not* support this operation.

MongoDB要求文件系统对目录支持 fsync()。例如 HGFS 和 Virtual Box 的共享目录不支持这个操作。



#### Set vm.swappiness to 1 or 0

#### 将 vm.swappiness 设置为 1 或者 0

“Swappiness” is a Linux kernel setting that influences the behavior of the Virtual Memory manager. The vm.swappiness setting ranges from 0 to 100: the higher the value, the more strongly it prefers swapping memory pages to disk over dropping pages from RAM. 

“Swappiness” 是一种影响虚拟内存管理器的 Linux 内核设置，vm.swappiness 设置的范围从0到100：该值越高，它越倾向于将内存页交换到磁盘，而不是从RAM中删除页。

- A setting of 0 disables swapping entirely [[2\]](https://docs.mongodb.com/manual/administration/production-notes/#swappiness-kernel-version). 
- 设置为0将完全禁用交换 [[2\]](https://docs.mongodb.com/manual/administration/production-notes/#swappiness-kernel-version)。
- A setting of 1 permits the kernel to swap only to avoid out-of-memory problems. 
- 设置为1只允许内核交换以避免内存不足问题。
- A setting of 60 tells the kernel to swap to disk often, and is the default value on many Linux distributions.                                                                                                                                                                设置60告诉内核经常交换到磁盘，这是许多Linux发行版的默认值。
- A setting of 100 tells the kernel to swap aggressively to disk. 
- 设置为100将告诉内核尽可能交换到磁盘。

MongoDB performs best where swapping can be avoided or kept to a minimum. As such you should set vm.swappiness to either 1 or 0 depending on your application needs and cluster configuration.                                                                                                                                                    MongoDB 在可以避免或保持最小交换的地方表现最好。因此，您应该根据应用程序需要和集群配置将 vm.swappiness 设置为1或0。

[2]  With Linux kernel versions previous to 3.5, or RHEL / CentOS kernel versions previous to 2.6.32-303, a vm.swappiness setting of 0 would still allow the kernel to swap in certain emergency situations.                                                                                                                                                [2] 对于3.5之前的Linux内核版本，或 2.6.32-303 之前的 RHEL/CentOS 内核版本，vm.swappiness 设置为0仍然允许内核在某些紧急情况下进行交换。



NOTE

注意

If your MongoDB instance is hosted on a system that also runs other software, such as a webserver, you should set vm.swappiness to 1. If possible, it is highly recommended that you run MongoDB on its own dedicated system.                                                                                                    如果 MongoDB 实例托管在同时运行其他软件（如Web服务器）的系统上，则应将 vm.swappiness 设置为1。如果可能，强烈建议您在MongoDB自己的专用系统上运行MongoDB。

- To check the current swappiness setting on your system, run: 

- 要检查系统上的当前交换设置，请运行：

  ```
  cat /proc/sys/vm/swappiness
  ```

- To change swappiness on your system:

- 要更改系统上的交换设置：

  1. Edit the /etc/sysctl.conf file and add the following line: 

     编辑 /etc/sysctl.conf 文件并添加以下行：

     ```
     vm.swappiness = 1
     ```

  2. Run the following command to apply the setting: 

     运行以下命令以应用设置：

     ```
     sudo sysctl -p
     ```

NOTE

 注意

If you are running RHEL / CentOS and using a tuned performance profile, you must also edit your chosen profile to set vm.swappiness to 1 or 0.

如果您正在运行 RHEL/CentOS 并使用优化的性能配置文件，则还必须编辑所选配置文件以将vm.swappiness 设置为1或0。



#### Recommended Configuration 推荐配置

For all MongoDB deployments: 

对于所有MongoDB部署：

- Use the Network Time Protocol (NTP) to synchronize time among your hosts. This is especially important in sharded clusters.                                                                                                              在主机之间同步时间使用网络时间协议（NTP）。这在分片集群中尤为重要。

For the WiredTiger storage engines, consider the following recommendations:

对于 WiredTiger 存储引擎，请考虑以下建议：

- Turn off atime for the storage volume containing the [database files](https://docs.mongodb.com/manual/reference/glossary/#term-dbpath). 

- 在包含[数据库文件](https://docs.mongodb.com/manual/reference/glossary/#term-dbpath)的存储卷关闭 atime 配置。 

- Set the file descriptor limit, -n, and the user process limit (ulimit), -u, above 20,000, according to the suggestions in the [ulimit](https://docs.mongodb.com/manual/reference/ulimit/) reference. A low ulimit will affect MongoDB when under heavy use and can produce errors and lead to failed connections to MongoDB processes and loss of service. 

- 按照 [ulimit](https://docs.mongodb.com/manual/reference/ulimit/) 设置的推荐，设置描述符限制，-n 和用户进程限制（ulimit），-u 设置为20000以上。当大量使用时，低 ulimit 将影响 MongoDB，并可能产生错误，导致与MongoDB进程的连接失败和服务丢失。

- Disable Transparent Huge Pages. MongoDB performs better with normal (4096 bytes) virtual memory pages. See [Transparent Huge Pages Settings](https://docs.mongodb.com/manual/tutorial/transparent-huge-pages/). 

- 不要使用透明大页，因为MongoDB在标准页中表现更好。参见 [透明大页设置](https://docs.mongodb.com/manual/tutorial/transparent-huge-pages/).     

- Disable NUMA in your BIOS. If that is not possible, see [MongoDB on NUMA Hardware](https://docs.mongodb.com/manual/administration/production-notes/#production-numa).

- 在BIOS中禁用NUMA。如果做不到，请参考 [MongoDB 和 NUMA 硬件](https://docs.mongodb.com/manual/administration/production-notes/#production-numa)章节。

- Configure SELinux for MongoDB if you are not using the default MongoDB directory paths or [ports](https://docs.mongodb.com/manual/reference/default-mongodb-port/).                                                                                                                                                                        如果不使用默认的 MongoDB 目录路径或 [端口](https://docs.mongodb.com/manual/reference/default-mongodb-port/)，请为 MongoDB 配置 SELinux。

  See: [Configure SELinux for MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/#install-rhel-configure-selinux) and [Configure SELinux for MongoDB Enterprise](https://docs.mongodb.com/manual/tutorial/install-mongodb-enterprise-on-red-hat/#install-enterprise-rhel-configure-selinux) for the required configuration.                                                                                                                                         请参阅[为 MongoDB 配置 SELinux](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/#install-rhel-configure-selinux) 和 [为 MongoDB 企业版配置 SELinux](https://docs.mongodb.com/manual/tutorial/install-mongodb-enterprise-on-red-hat/#install-enterprise-rhel-configure-selinux) 以获得所需的配置。

  

  NOTE

  注意

  If you are using SELinux, any MongoDB operation that requires [server-side JavaScript](https://docs.mongodb.com/manual/core/server-side-javascript/) will result in segfault errors. [Disable Server-Side Execution of JavaScript](https://docs.mongodb.com/manual/core/server-side-javascript/#disable-server-side-js) describes how to disable execution of server-side JavaScript.                                                                                                      如果您使用的是 SELinux，任何需要 [服务器端 javaScript](https://docs.mongodb.com/manual/core/server-side-javascript/) 的 MongoDB 操作都会导致段错误。 [禁用服务器端执行JavaScript](https://docs.mongodb.com/manual/core/server-side-javascript/#disable-server-side-js) 描述如何禁用服务器端 JavaScript 执行。

  

For the WiredTiger storage engine: 

对于WiredTiger存储引擎：

- Set the readahead setting between 8 and 32 regardless of storage media type (spinning disk, SSD, etc.).                                                                       
无论存储介质类型（旋转磁盘、SSD等）如何，将 文件预读的值设置为8到32。

Higher readahead commonly benefits sequential I/O operations. Since MongoDB disk access patterns are generally random, using higher readahead settings provides limited benefit or potential performance degradation. As such, for optimal MongoDB performance, set readahead between 8 and 32, unless testing shows a measurable, repeatable, and reliable benefit in a higher readahead value. [MongoDB commercial support](https://support.mongodb.com/welcome?jmp=docs) can provide advice and guidance on alternate readahead configurations. 

较高的预读通常有利于顺序 I/O 操作。由于MongoDB 磁盘访问模式通常是随机的，因此使用更高的文件预读设置提供的好处有限，或者可能会降低性能。因此，为了获得最佳的 MongoDB 性能，请将文件预读的值设置在8到32之间，除非测试在更高的文件预读值中显示出可测量、可重复和可靠的好处。 [MongoDB 商业支持](https://support.mongodb.com/welcome?jmp=docs)可以提供关于备用文件预读配置的建议和指导。

  

#### MongoDB and TLS/SSL Libraries MongoDB 和 TLS/SSL 库

On Linux platforms, you may observe one of the following statements in the MongoDB log:  

在 Linux 平台上，您可以在 MongoDB 日志中看到以下语句之一：

```
<path to TLS/SSL libs>/libssl.so.<version>: no version information available (required by /usr/bin/mongod)
<path to TLS/SSL libs>/libcrypto.so.<version>: no version information available (required by /usr/bin/mongod)
```

These warnings indicate that the system’s TLS/SSL libraries are different from the TLS/SSL libraries that the [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) was compiled against. Typically these messages do not require intervention; however, you can use the following operations to determine the symbol versions that [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) expects:                               

这些警告表示系统的 TLS/SSL 库与 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)  编译时所依据的 TLS/SSL 库不同。通常这些消息不需要干预；但是，您可以使用以下操作来确定 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)  期望的符号版本：

```
objdump -T <path to mongod>/mongod | grep " SSL_"
objdump -T <path to mongod>/mongod | grep " CRYPTO_"
```

These operations will return output that resembles one the of the following lines: 

这些操作将返回类似于以下行之一的输出：

```
0000000000000000      DF *UND*       0000000000000000  libssl.so.10 SSL_write
0000000000000000      DF *UND*       0000000000000000  OPENSSL_1.0.0 SSL_write
```

The last two strings in this output are the symbol version and symbol name. Compare these values with the values returned by the following operations to detect symbol version mismatches:                                                                                                                                                                 此输出中的最后两个字符串是符号版本和符号名。将这些值与以下操作返回的值进行比较，以检测符号版本是否匹配：

```
objdump -T <path to TLS/SSL libs>/libssl.so.1*
objdump -T <path to TLS/SSL libs>/libcrypto.so.1*
```

This procedure is neither exact nor exhaustive: many symbols used by [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) from the libcrypto library do not begin with CRYPTO_.

这个过程既不精确也不详尽： [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 从 libcrypto 库中使用的许多符号不是以 CRYPTO_ 开头的。

### MongoDB on Windows  Windows 上的 MongoDB

For MongoDB instances using the WiredTiger storage engine, performance on Windows is comparable to performance on Linux.                                                         

对于使用 WiredTiger 存储引擎的 MongoDB 实例，Windows 上的性能与 Linux 上的性能相当。



### MongoDB on Virtual Environments   虚拟环境中的MongoDB

This section describes considerations when running MongoDB in some of the more common virtual environments.                                                                     

本章节描述了在常用虚拟环境中运行MongoDB需要考虑的问题。

For all platforms, consider [Scheduling](https://docs.mongodb.com/manual/administration/production-notes/#virtualized-disks-scheduling).                                                                                                                                                                                         对于所有平台，请考虑 [调度](https://docs.mongodb.com/manual/administration/production-notes/#virtualized-disks-scheduling).

#### AWS EC2    亚马逊弹性计算云

There are two performance configurations to consider: 

有两种性能配置需要考虑：

- Reproducible performance for performance testing or benchmarking, and 
- 性能测试或基准测试的可复制性能，以及
- Raw maximum performance
- 原始最大性能

To tune performance on EC2 for either configuration, you should: 

 要为任一配置优化弹性计算云上的性能，应：

- Enable AWS [Enhanced Networking](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/enhanced-networking.html#enabling_enhanced_networking) for your instance. Not all instance types support Enhanced Networking.                                                                                                                                               为您的实例启用亚马逊[增强的网络](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/enhanced-networking.html#enabling_enhanced_networking)。并非所有实例类型都支持增强的网络。

  

To learn more about Enhanced Networking, see to the [AWS documentation](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/enhanced-networking.html#enabling_enhanced_networking).

要了解有关增强联网的更多信息，请参阅[AWS 文档](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/enhanced-networking.html#enabling_enhanced_networking)。

If you are concerned more about reproducible performance on EC2, you should also: 

如果您更关心弹性计算云的可重复性能，您还应该：

- Use provisioned IOPS for the storage, with separate devices for journal and data. Do not use the ephemeral (SSD) storage available on most instance types as their performance changes moment to moment. (The i series is a notable exception, but very expensive.) 

- 为存储使用配置的 IOPS，日志和数据使用单独的设备。不要使用大多数实例类型上可用的临时（SSD）存储，因为它们的性能会随时发生变化。（i 系列是一个显著的例外，但非常昂贵。）

- Disable DVFS and CPU power saving modes. 

- 禁用 DVFS 和 CPU 节能模式。

  SEE ALSO

  也可以看看

  [Amazon documentation on Processor State Control](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/processor_state_control.html)

  [关于处理器状态控制的Amazon文档](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/processor_state_control.html)                                                                              

- Disable hyperthreading. 禁用超线程。

  

  SEE ALSO

  也可以看看

   [亚马逊关于禁用超线程的博客文章](https://aws.amazon.com/blogs/compute/disabling-intel-hyper-threading-technology-on-amazon-linux/).

- Use numactl to bind memory locality to a single socket. 

- 使用 numactl 将内存局部性绑定到单个套接字。

#### Azure

Use [Premium Storage](https://azure.microsoft.com/en-us/documentation/articles/storage-premium-storage/). Microsoft Azure offers two general types of storage: Standard storage, and Premium storage. MongoDB on Azure has better performance when using Premium storage than it does with Standard storage.                                                                                                                                                                   使用[高级存储](https://azure.microsoft.com/en-us/documentation/articles/storage-premium-storage/)。微软Azure提供了两种常见的存储类型：标准存储和高级存储。与标准存储相比，Azure上的MongoDB 在使用高级存储时具有更好的性能。

The TCP idle timeout on the Azure load balancer is 240 seconds by default, which can cause it to silently drop connections if the TCP keepalive on your Azure systems is greater than this value. You should set tcp_keepalive_time to 120 to ameliorate this problem. 

默认情况下，Azure 负载平衡器上的 TCP 空闲超时默认为240秒，如果 Azure 系统上的 TCP 长连接大于此值，则会导致它自动断开连接。您应该将 TCP 长连接时间设置为120以改善此问题。                                                                                          

NOTE

注意

You will need to restart [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) and [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) processes for new system-wide keepalive settings to take effect.                                                                                                                                                                                               要使新的系统范围长连接设置生效，您需要重新启动 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 和[mongos ](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)进程。

- To view the keepalive setting on Linux, use one of the following commands:

- 要在 Linux 上查看长连接设置，请使用以下命令之一：

  ```
  sysctl net.ipv4.tcp_keepalive_time
  ```

  Or: 

  或者：

  ```
  cat /proc/sys/net/ipv4/tcp_keepalive_time
  ```

  The value is measured in seconds. 

  该值以秒为单位。

  NOTE

  注意

  Although the setting name includes ipv4, the tcp_keepalive_time value applies to both IPv4 and IPv6.                                                                           
  
  尽管设置名称包括IPv4 ，但 TCP 长连接时间值同时适用于 IPv4 和 IPv6。

- To change the tcp_keepalive_time value, you can use one of the following commands, supplying a <value> in seconds:                                                             
  
  要更改 TCP 长连接时间值，可以使用以下命令之一，以秒为单位提供<value>：：

  ```
  sudo sysctl -w net.ipv4.tcp_keepalive_time=<value>
  ```

  Or:

  或者：

  ```
  echo <value> | sudo tee /proc/sys/net/ipv4/tcp_keepalive_time
  ```

  These operations do not persist across system reboots. To persist the setting, add the following line to /etc/sysctl.conf, supplying a<value> in seconds, and reboot the machine:                                                                                                                                                                  这些操作不会在系统重新启动时保持。要保持设置，请将以下行添加到 /etc/sysctl.conf，以秒为单位提供 <value>，然后重新启动计算机：

  ```
  net.ipv4.tcp_keepalive_time = <value>
  ```

  Keepalive values greater than 300 seconds, (5 minutes) will be overridden on [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) and [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) sockets and set to 300 seconds.

  长连接值大于300秒（5分钟）将在 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) and [mongos ](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)套接字上重写，并设置为300秒。

- To view the keepalive setting on Windows, issue the following command:

- 要在 Windows 上查看长连接设置，请发出以下命令：

  ```
  reg query HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters /v KeepAliveTime
  ```

  The registry value is not present by default. The system default, used if the value is absent, is 7200000 milliseconds or 0x6ddd00 in hexadecimal. 

  默认情况下不存在注册表值。如果该值不存在，则使用系统默认值7200000毫秒或0x6ddd00（十六进制）。

- To change the KeepAliveTime value, use the following command in an Administrator Command Prompt, where  is expressed in hexadecimal (e.g. 120000 is 0x1d4c0):

- 要更改长连接时间值，请在管理员命令提示符中使用以下命令，该命令以十六进制表示（例如120000是0x1d4c0）：

  ```
  reg add HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\ /t REG_DWORD /v KeepAliveTime /d <value>
  ```

  Windows users should consider the [Windows Server Technet Article on KeepAliveTime](https://technet.microsoft.com/en-us/library/cc957549.aspx) for more information on setting keepalive for MongoDB deployments on Windows systems. Keepalive values greater than or equal to *600000* milliseconds (10 minutes) will be ignored by [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) and [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos).                                                                                                                             Windows用户应考虑 [Windows服务器 Technet 关于长连接时间值的文章](https://technet.microsoft.com/en-us/library/cc957549.aspx) 以获取有关在 Windows系统上设置 MongoDB 部署长连接的详细信息。 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) and [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) 将忽略大于或等于*600000*毫秒（10分钟）的长连接值。

  

#### VMware

MongoDB is compatible with VMware. 

MongoDB 与 VMware 兼容。

VMware supports memory overcommitment, where you can assign more memory to your virtual machines than the physical machine has available. When memory is overcommitted, the hypervisor reallocates memory between the virtual machines. VMware’s balloon driver (vmmemctl) reclaims the pages that are considered least valuable.                           

VMware支持内存过量使用，在这里，您可以为虚拟机分配比物理机可用更多的内存。当内存被过度使用时，管理程序会在虚拟机之间重新分配内存。VMware 的气球驱动（vmmemctl）回收那些被认为价值最低的页面。

The balloon driver resides inside the guest operating system. When the balloon driver expands, it may induce the guest operating system to reclaim memory from guest applications, which can interfere with MongoDB’s memory management and affect MongoDB’s performance. 

气球驱动程序位于客户操作系统中。当气球驱动程序扩展时，可能导致客户操作系统从客户端应用程序中回收内存，从而干扰 MongoDB 的内存管理，影响 MongoDB 的性能。

Do not disable the balloon driver and memory overcommitment features. This can cause the hypervisor to use its swap which will affect performance. Instead, map and reserve the full amount of memory for the virtual machine running MongoDB. This ensures that the balloon will not be inflated in the local operating system if there is memory pressure in the hypervisor due to an overcommitted configuration.

不要禁用气球驱动程序和内存过载使用功能。这会导致虚拟机监控程序使用其交换，从而影响性能。相反，映射并保留运行 MongoDB 的虚拟机的全部内存。这可以确保，如果管理程序中存在由于过度提交配置而导致的内存压力，则气球不会在本地操作系统中膨胀。

Ensure that virtual machines stay on a specific ESX/ESXi host by setting VMware’s [affinity rules](https://kb.vmware.com/selfservice/microsites/search.do?cmd=displayKC&docType=kc&externalId=1005508&sliceId=1&docTypeID=DT_KB_1_1&dialogID=549881455&stateId=0 0 549889513). If you must manually migrate a virtual machine to another host and the [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) instance on the virtual machine is the [primary](https://docs.mongodb.com/manual/reference/glossary/#term-primary), you must first [step down](https://docs.mongodb.com/manual/reference/method/rs.stepDown/#rs.stepDown) the primary and then [shut down the instance](https://docs.mongodb.com/manual/reference/method/db.shutdownServer/#db.shutdownServer).                                                                                                                                                                           通过设置VMware的[关联规则](https://kb.vmware.com/selfservice/microsites/search.do?cmd=displayKC&docType=kc&externalId=1005508&sliceId=1&docTypeID=DT_KB_1_1&dialogID=549881455&stateId=0 0 549889513)，确保虚拟机留在特定的 ESX/ESXi 主机上。如果必须手动将虚拟机迁移到另一个主机，并且虚拟机上的 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 实例是[最重要的](https://docs.mongodb.com/manual/reference/glossary/#term-primary)，则必须先[逐步关闭](https://docs.mongodb.com/manual/reference/method/rs.stepDown/#rs.stepDown)最重要的实例，然后[关闭实例](https://docs.mongodb.com/manual/reference/method/db.shutdownServer/#db.shutdownServer)。

Follow the [networking best practices for vMotion](https://docs.vmware.com/en/VMware-vSphere/6.0/com.vmware.vsphere.vcenterhost.doc/GUID-7DAD15D4-7F41-4913-9F16-567289E22977.html) and the [VMKernel](https://kb.vmware.com/selfservice/microsites/search.do?language=en_US&cmd=displayKC&externalId=2054994). Failure to follow the best practices can result in performance problems and affect [replica set](https://docs.mongodb.com/manual/core/replica-set-high-availability/) and [sharded cluster](https://docs.mongodb.com/manual/tutorial/troubleshoot-sharded-clusters/) high availability mechanisms.                                                                                                                                    遵循 [vMotion的网络最佳实践](https://docs.vmware.com/en/VMware-vSphere/6.0/com.vmware.vsphere.vcenterhost.doc/GUID-7DAD15D4-7F41-4913-9F16-567289E22977.html)和 [VMKernel](https://kb.vmware.com/selfservice/microsites/search.do?language=en_US&cmd=displayKC&externalId=2054994)。未能遵循最佳实践可能会导致性能问题，并影响[副本集](https://docs.mongodb.com/manual/core/replica-set-high-availability/)和[分片集群](https://docs.mongodb.com/manual/tutorial/troubleshoot-sharded-clusters/)的高可用性机制。

It is possible to clone a virtual machine running MongoDB. You might use this function to spin up a new virtual host to add as a member of a replica set. If you clone a VM with journaling enabled, the clone snapshot will be valid. If not using journaling, first stop [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod), then clone the VM, and finally, restart [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod).                                                                                                                                                    可以克隆运行 MongoDB 的虚拟机。您可以使用此函数启动新的虚拟主机，将其添加为副本集的成员。如果克隆启用了日志记录的虚拟机，则克隆快照将有效。如果不使用日志记录，首先停止[mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)，然后克隆虚拟机，最后重新启动 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)。

#### KVM

MongoDB is compatible with KVM.

MongoDB 与 KVM 兼容。

KVM supports memory overcommitment, where you can assign more memory to your virtual machines than the physical machine has available. When memory is overcommitted, the hypervisor reallocates memory between the virtual machines. KVM’s balloon driver reclaims the pages that are considered least valuable.                                         

KVM支持内存超载使用，在这里，您可以为虚拟机分配比物理机可用更多的内存。当内存被过度提交时，管理程序会在虚拟机之间重新分配内存。KVM的气球驱动程序回收被认为价值最低的页面。

The balloon driver resides inside the guest operating system. When the balloon driver expands, it may induce the guest operating system to reclaim memory from guest applications, which can interfere with MongoDB’s memory management and affect MongoDB’s performance. 

气球驱动程序位于客户操作系统中。当气球驱动程序扩展时，可能导致客户操作系统从客户端应用程序中回收内存，从而干扰 MongoDB 的内存管理，影响 MongoDB 的性能。     

Do not disable the balloon driver and memory overcommitment features. This can cause the hypervisor to use its swap which will affect performance. Instead, map and reserve the full amount of memory for the virtual machine running MongoDB. This ensures that the balloon will not be inflated in the local operating system if there is memory pressure in the hypervisor due to an overcommitted configuration.

不要禁用气球驱动程序和内存过载使用功能。这会导致虚拟机监控程序使用其交换，从而影响性能。相反，映射并保留运行 MongoDB 的虚拟机的全部内存。这可以确保，如果管理程序中存在由于过度提交配置而导致的内存压力，则气球不会在本地操作系统中膨胀。



## Performance Monitoring

## 性能监控

NOTE 

注意

Starting in version 4.0, MongoDB offers [free Cloud monitoring](https://docs.mongodb.com/manual/administration/free-monitoring/) for standalones and replica sets. For more information, see [Free Monitoring](https://docs.mongodb.com/manual/administration/free-monitoring/).

从4.0版开始，MongoDB为标准和副本集提供[免费云监控](https://docs.mongodb.com/manual/administration/free-monitoring/)。有关更多信息，请参阅[免费监控](https://docs.mongodb.com/manual/administration/free-monitoring/)。



### iostat

On Linux, use the iostat command to check if disk I/O is a bottleneck for your database. Specify a number of seconds when running iostat to avoid displaying stats covering the time since server boot.                                                                                                                                                          在 Linux 上，使用 iostat 命令检查磁盘 I/O 是否是数据库的瓶颈。指定运行 iostat 时的秒数，以避免显示信息为自服务器启动以来的统计信息。

For example, the following command will display extended statistics and the time for each displayed report, with traffic in MB/s, at one second intervals:

例如，以下命令将每隔一秒显示扩展统计信息和每个显示报告的时间，流量单位为MB/s：

```
iostat -xmt 1
```

Key fields from iostat:

iostat中的关键字段：

- %util: this is the most useful field for a quick check, it indicates what percent of the time the device/drive is in use.                                                     

%util: 这是快速检查最有用的字段，它表示设备/驱动器使用时间的百分比。
- avgrq-sz: average request size. Smaller number for this value reflect more random IO operations.                                                                               

avgrq-sz: 平均请求大小。此值的较小数字反映了更多的随机IO操作。

### bwm-ng

 is a command-line tool for monitoring network use. If you suspect a network-based bottleneck, you may use bwm-ng to begin your diagnostic process. 

[bwm-ng](http://www.gropp.org/?id=projects&sub=bwm-ng) 是用于监视网络使用的命令行工具。如果怀疑是基于网络的瓶颈，可以使用 bwm-ng 开始诊断进程。

## Backups  备份

To make backups of your MongoDB database, please refer to [MongoDB Backup Methods Overview](https://docs.mongodb.com/manual/core/backups/).                                                                                                                                                                         
要备份 MongoDB 数据库，请参阅 [MongoDB 备份方法概述](http://docs.mongodb.com/manual/core/backups/)。



## 附录


原文链接：https://docs.mongodb.com/manual/administration/production-notes/

译者：孔令升
