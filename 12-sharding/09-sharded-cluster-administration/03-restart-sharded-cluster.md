# 重启分片集群

本教程特定于 MongoDB 6.0。早期版本的MongoDB请参考对应版本的MongoDB手册。

此过程演示了重新启动分片集群的关闭和启动顺序。以不同的顺序停止或启动分片集群的组件可能会导致节点之间的通信错误。例如，如果没有可用的配置服务器，分片服务器可能会挂起 。



>## 重要的
>
>此程序应仅在计划的维护期间执行。在此期间，应用程序应停止对集群的所有读取和写入，以防止潜在的数据丢失或读取过时数据。



## 禁用平衡器

禁用平衡器以停止块迁移，并且在该过程完成之前不执行任何元数据写入操作。如果正在进行迁移，平衡器将在停止之前完成正在进行的迁移。

要禁用平衡器，请连接到集群的一个 `mongos`实例并发出以下命令：[ 1 ]

```shell
sh.stopBalancer()
```



检查平衡器状态，请发出`sh.getBalancerState()`命令。

有关详细信息，请参阅禁用平衡器。

从 MongoDB 6.0.3开始,不执行自动分块。 这是因为平衡政策的改进。 自动拆分命令仍然存在，但不执行操作。 有关详细信息，请参阅`平衡策略更改`.在 6.0 之前的 MongoDB 版本中，`sh.stopBalancer()` 还禁用了分片集群的自动拆分。

## 停止分片集群

### 1.停止`mongos`路由器。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/restart-sharded-cluster/#stop-mongos-routers)

在每个`mongos`路由器的`admin`数据库 运行`db.shutdownServer()`：

```shell
use admin
db.shutdownServer()
```



### 2.停止每个分片副本集。

在每个分片副本集节点的admin数据库上运行`sh.shutdownServer()`关闭mongod服务。在关闭每个副本集中的主节点之前关闭所有从节点。



### 3.停止配置服务器。

在配置副本集左右节点的admin数据库上运行`sh.shutdownServer()`关闭mongod服务。在关闭每个副本集中的主节点之前关闭所有从节点。



## 启动分片集群



### 1.启动配置服务器。

启动 `mongod` 时，使用配置文件或命令行指定配置。`mongod`有关启动参数的更多信息，请参阅 `mongod`参考页。

**配置文件**

如果使用配置文件，`mongod`在将`--config`选项设置为配置文件路径的情况下启动。

```shell
mongod --config <path-to-config-file>
```



**命令行**

如果使用命令行选项，`mongod` 指定`--configsvr`、`--replSet`、`--bind_ip`和其他适合您的部署的选项启动。例如：

```shell
mongod --configsvr --replSet <replica set name> --dbpath <path> --bind_ip localhost,<hostname(s)|ip address(es)>
```

启动所有配置服务器后，连接到主节点 `mongod`并运行`rs.status()`以确认每个 CSRS 节点的健康状况和可用性。



### 2.启动每个分片副本集。

启动`mongod` 时，使用配置文件或命令行指定`mongod`设置。

**配置文件**

如果使用配置文件，`mongod`]在将`--config`选项设置为配置文件路径的情况下启动。

```shell
mongod --config <path-to-config-file>
```



**命令行**

如果使用命令行选项，`mongod`指定`--replSet`、`--shardsvr`和`--bind_ip`选项以及适合您的部署的其他选项启动。例如：

```shell
mongod --shardsvr --replSet <replSetname> --dbpath <path> --bind_ip localhost,<hostname(s)|ip address(es)>
```

启动每个分片的所有节点后，连接到每个主节点 `mongod`并运行`rs.status()`以确认每个节点的健康和可用性。



### 3.启动`mongos`路由器。

`mongos`使用配置文件或命令行参数启动路由器以指定配置服务器。

**配置文件**

如果使用配置文件，启动`mongos`指定`--config`选项和配置文件的路径。

```shell
mongos --config <path-to-config>
```



有关配置文件的更多信息，请参阅 配置选项。

**命令行**

如果使用命令行参数，启动`mongos`并指定`--configdb`、 `--bind_ip`和其他适合您的部署的选项。例如：

>## 警告
>
>在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 安全清单。至少，考虑 启用身份验证和 强化网络基础设施。

```shell
mongos --configdb <configReplSetName>/cfg1.example.net:27019,cfg2.example.net:27019 --bind_ip localhost,<hostname(s)|ip address(es)>
```



包括适合您的部署的任何其他选项。

## 重新启用平衡器

重新启用平衡器以恢复 块迁移。

连接到集群的一个`mongos`实例并运行`sh.startBalancer()`命令：

```shell
sh.startBalancer()
```



要检查平衡器状态，请发出`sh.getBalancerState()`命令。

有关详细信息，请参阅启用平衡器。

从 MongoDB 6.0.3 开始，不执行自动分块。 这是因为平衡政策的改进。 自动拆分命令仍然存在，但不执行操作。 详见Balancing Policy Changes。在MongoDB 6.0之前的版本中，sh.startBalancer()也开启了sharded cluster的自动分拆分。

## 验证集群可访问性

`mongo`shell 连接到集群 `mongos`的进程之一。用`sh.status()`检查整体集群状态。

要确认所有分片都可以访问和通信，请将测试数据插入临时分片集合。确认数据正在集群中的每个分片之间拆分和迁移。您可以使用`mongo`shell 连接到每个主分片，并用`db.collection.find()`验证数据是否按预期分片。

>## 重要的
>
>为防止潜在的数据丢失或读取陈旧数据，在确认集群健康且可访问之前，不要启动应用程序读取和写入集群。



原文 -  https://docs.mongodb.com/manual/tutorial/restart-sharded-cluster/

译者：陆文龙

