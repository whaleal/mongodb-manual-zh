# 对副本集成员执行维护

## 概述[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/perform-maintence-on-replica-set-members/#overview)

[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)允许 MongoDB 部署在维护窗口的大部分时间保持可用。

本文档概述了对副本集的每个节点执行维护的基本过程。此外，这个特定的序列力求最大限度地减少 [主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)服务器不可用的时间，并控制对整个部署的影响。

使用这些步骤作为常见副本集操作的基础，特别是[升级到最新版本的 MongoDB等过程。](https://www.mongodb.com/docs/manual/tutorial/upgrade-revision/)

## 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/perform-maintence-on-replica-set-members/#procedure)

对于副本集的每个节点，从从节点开始，执行以下事件序列，以主节点结束：

- [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)作为独立实例重新启动实例。
- 在独立实例上执行任务。
- [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)作为副本集的成员重新启动实例。



### 关闭从节点。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/perform-maintence-on-replica-set-members/#stop-a-secondary)

在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), 关闭[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例：

```
db.shutdownServer()
```



### 在不同的端口上以独立方式重新启动从节点。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/perform-maintence-on-replica-set-members/#restart-the-secondary-as-a-standalone-on-a-different-port)

在操作系统 shell 提示符[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 下作为独立实例重新启动。

配置文件命令行选项

如果您使用的是配置文件，请进行以下配置更新：

- 注释掉[`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName)选项。
- 将 更改[`net.port`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.port)为不同的端口。记下原始端口设置作为注释。
- 在部分中将参数设置`disableLogicalSessionCacheRefresh`为 。`true`[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter)
- 如果[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)是分[片](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)或 [配置服务器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-server)节点，您还必须：
  - 注释掉[`sharding.clusterRole`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-sharding.clusterRole)选项。
  - 将参数[`skipShardingConfigurationChecks`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.skipShardingConfigurationChecks) （也可用于 MongoDB 3.6.3+、3.4.11+、3.2.19+）设置到 `true`部分中[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter)。

例如，如果对 shard/config server 副本集成员进行维护以进行维护，则更新后的配置文件将包含如下示例的内容：

```
net:
   bindIp: localhost,<hostname(s)|ip address(es)>
   port: 27218
#   port: 27018
#replication:
#   replSetName: shardA
#sharding:
#   clusterRole: shardsvr
setParameter:
   skipShardingConfigurationChecks: true
   disableLogicalSessionCacheRefresh: true
```

>## WARNING
>
>在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)



始终从[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)同一用户开始，即使在将副本集成员作为独立实例重新启动时也是如此。



### 对从节点执行维护操作。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/perform-maintence-on-replica-set-members/#perform-maintenance-operations-on-the-secondary)

当节点是单个节点时，使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)执行维护：

```
mongo --port 27218
```

>## IMPORTANT
>
>虽然该节点是独立的，但不会将写入复制到该节点，也不会将该节点上的写入复制到副本集的其他节点。
>
>确保这个独立的任何写入都不会与重新加入副本集时将应用于该节点的oplog写入冲突。





### `mongod`作为副本集的节点重新启动。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/perform-maintence-on-replica-set-members/#restart-mongod-as-a-member-of-the-replica-set)

执行所有维护任务后，使用以下过程[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在其常用端口上作为副本集的成节点重新启动。

从[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，完成维护后关闭独立服务器：

```
use admin
db.shutdownServer()
```



[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)使用其原始配置将实例重新启动为副本集节点；也就是说，撤消作为独立启动时所做的配置更改。

>## TIP
>
>请务必删除该`disableLogicalSessionCacheRefresh` 参数。
>
>对于分片或配置服务器节点，请务必删除该 [`skipShardingConfigurationChecks`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.skipShardingConfigurationChecks)参数。



启动后，连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到重新启动的实例。

secondary 需要时间来[赶上 primary](https://www.mongodb.com/docs/manual/core/replica-set-sync/)。从[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，使用以下命令验证节点是否从 [`RECOVERING`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)状态到[`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)状态赶上了。

```
rs.status()
```





### 对主主节点进行维护。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/perform-maintence-on-replica-set-members/#perform-maintenance-on-the-primary-last)

1. 要在完成所有从节点的维护任务后对节点执行维护，请连接 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到主节点并用于 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)降低主要并允许其中一个从节点被选为新的主节点。指定 300 秒的等待时间以防止节点在五分钟内再次被选为主节点：

   ```
   rs.stepDown(300)
   ```

   

   在主节点下台后，副本集将[选举一个新的主节点 ](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)

2. [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)作为独立实例重新启动，进行以下配置更新。

配置文件命令行选项

如果您使用的是配置文件，请进行以下配置更新：

- 注释掉[`replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName)选项。
- 将 更改[`net.port`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.port)为不同的端口。记下原始端口设置作为注释。
- `disableLogicalSessionCacheRefresh`在 选项`true`中设置参数。[`--setParameter`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--setParameter)
- 如果[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)是分[片](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-shard)或 [配置服务器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-server)节点，您还必须：
  - 注释掉[`sharding.clusterRole`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-sharding.clusterRole)选项。
  - 将参数[`skipShardingConfigurationChecks`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.skipShardingConfigurationChecks) （也可用于 MongoDB 3.6.3+、3.4.11+、3.2.19+）设置到 `true`部分中[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter)。

例如，如果对 shard/config server 副本集成员进行维护以进行维护，则更新后的配置文件将包含如下示例的内容：

```
net:
   bindIp: localhost,<hostname(s)|ip address(es)>
   port: 27218
#   port: 27018
#replication:
#   replSetName: shardA
#sharding:
#   clusterRole: shardsvr
setParameter:
   skipShardingConfigurationChecks: true
   disableLogicalSessionCacheRefresh: true
```



>## WARNING
>
>在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)



1. 在现在独立的设备上执行维护任务。

   >## IMPORTANT
   >
   >虽然该节点是独立的，但不会将写入复制到该节点，也不会将该成员上的写入复制到副本集的其他节点。
   >
   >确保这个独立的任何写入都不会与重新加入副本集时将应用于该节点的 oplog 写入冲突。

   

2. 执行完所有维护任务后， [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)以其原始配置作为副本集节点重启实例；也就是说，撤消作为独立启动时所做的配置更改。

   

   

   >## TIP
   >
   >请务必删除该`disableLogicalSessionCacheRefresh` 参数。
   >
   >对于分片或配置服务器节点，请务必删除该 [`skipShardingConfigurationChecks`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.skipShardingConfigurationChecks)参数。

←  [改变 Oplog 的大小](https://www.mongodb.com/docs/manual/tutorial/change-oplog-size/)[强制成员成为主要成员](https://www.mongodb.com/docs/manual/tutorial/force-member-to-be-primary/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/perform-maintence-on-replica-set-members/ 

译者：陆文龙



