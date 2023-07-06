#  将 Standalone 更改为 WiredTiger



## NOTE

从 4.2 版开始，MongoDB 删除了已弃用的 MMAPv1 存储引擎。如果从使用 MMAPv1 的 MongoDB 4.0 部署升级到 MongoDB 4.2，则必须升级到 WiredTiger。

[使用本教程将独立](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-standalone) MongoDB 实例的存储引擎更改为[WiredTiger 。](https://www.mongodb.com/docs/manual/core/wiredtiger/#std-label-storage-wiredtiger)

## 注意事项

### `mongodump`和`mongorestore`

本教程使用[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)和 [`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)用于导出和导入数据的实用程序。

- 确保在您的系统上安装并更新了这些 MongoDB 包组件。
- 确保您有足够的驱动器空间可用于 [`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)使用 WiredTiger 运行的新实例的导出文件和数据文件 。

### 默认绑定到本地主机

MongoDB 二进制文件，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，默认绑定到`localhost`。

教程运行[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)和 [`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)来自与他们连接的同一主机 。如果远程运行， [`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)和[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)必须指定 IP 地址或关联的主机名才能连接到 [`mongod`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

### MongoDB 3.0 或更高版本

您必须使用 MongoDB 版本 3.0 或更高版本才能使用 WiredTiger 存储引擎。如果使用较早的 MongoDB 版本，您必须在继续更改存储引擎之前升级您的 MongoDB 版本。要升级您的 MongoDB 版本，请参阅相应版本的手册。

### XFS 和 WiredTiger

使用 WiredTiger 存储引擎，在 Linux 上建议使用 XFS 作为数据承载节点。有关详细信息，请参阅 [内核和文件系统。](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-linux-file-system)

### 仅限 MMAPv1 限制

升级到 WiredTiger 后，您的 WiredTiger 部署将**不受** 以下仅限 MMAPv1 的限制：

| MMAPv1 限制        | 简短的介绍                                                   |
| :----------------- | :----------------------------------------------------------- |
| 命名空间数量       | 对于 MMAPv1，命名空间的数量限制为命名空间文件的大小除以 628。 |
| 命名空间文件的大小 | 对于 MMAPv1，命名空间文件不能大于 2047 兆字节。              |
| 数据库大小         | MMAPv1 存储引擎限制每个数据库不超过 16000 个数据文件。       |
| 数据大小           | 对于 MMAPv1，单个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例无法管理超过底层操作系统提供的最大虚拟内存地址空间的数据集。 |
| 数据库中的集合数   | 对于 MMAPv1 存储引擎，数据库中集合的最大数量是命名空间文件大小和数据库中集合索引数量的函数。 |

## 程序

 

### 启动`mongod`您要更改的 WiredTiger。

如果[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)已经在运行，则可以跳过此步骤。

 

### 使用`mongodump`导出数据。

```
mongodump --out=<exportDataDestination>
```

如果在启用授权的情况下运行，请根据需要指定其他选项，例如用户名和密码。看 [`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)可用选项。



### 使用 WiredTiger为新`mongod`运行创建一个数据目录。

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)为将使用 WiredTiger 存储引擎运行的新实例创建一个数据目录。`mongod`必须对该目录具有读写权限。

`mongod`WiredTiger 不会从使用不同存储引擎创建的数据文件开始。

 

### 更新 WiredTiger 的配置。

从[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例配置中删除所有[MMAPv1 特定配置选项。](https://www.mongodb.com/docs/manual/release-notes/4.2/#std-label-4.2-mmapv1-conf-options)

 

### 用WiredTiger启动`mongod`。

启动，将WiredTiger 的新创建数据目录指定`wiredTiger`为



启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，将 wiredTiger 指定为  [.](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)[`--storageEngine`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--storageEngine)，并将为 WiredTiger 新创建的数据目录指定为 [`--dbpath`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)。

根据需要指定其他选项，例如[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)。



## WARNING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

```
mongod --storageEngine wiredTiger --dbpath <newWiredTigerDBPath> --bind_ip localhost,<hostname(s)|ip address(es)>
```



您还可以在[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)中指定选项。要指定存储引擎，请使用[`storage.engine`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.engine)设置。



### 使用 上传导出的数据`mongorestore`。

```
mongorestore <exportDataDestination>
```



根据需要指定其他选项。看 [`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)可用选项。

←  [WiredTiger 存储引擎](https://www.mongodb.com/docs/manual/core/wiredtiger/)[将副本集更改为 WiredTiger](https://www.mongodb.com/docs/manual/tutorial/change-replica-set-wiredtiger/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/change-standalone-wiredtiger/

译者：陆文龙

