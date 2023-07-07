# 配置从节点的同步目标

## 概述

从节点从主节点捕获数据以维护集合数据的最新副本。但是，默认情况下，从节点可能会根据节点之间的 ping 时间变化和其他节点复制的状态自动将其同步目标更改为从节点。有关详细信息，请参阅 [副本集数据同步](https://www.mongodb.com/docs/manual/core/replica-set-sync/)和 [管理链式复制](https://www.mongodb.com/docs/manual/tutorial/manage-chained-replication/)。

对于某些部署，实现自定义复制同步拓扑可能比默认同步目标选择逻辑更有效。MongoDB 提供了指定主机作为同步目标的能力。

要临时覆盖默认同步目标选择逻辑，您可以手动配置[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)的同步目标以临时拉取[oplog](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-oplog)条目。以下提供对此功能的访问：

- [`replSetSyncFrom`](https://www.mongodb.com/docs/manual/reference/command/replSetSyncFrom/#mongodb-dbcommand-dbcmd.replSetSyncFrom)命令，或
- [`rs.syncFrom()`](https://www.mongodb.com/docs/manual/reference/method/rs.syncFrom/#mongodb-method-rs.syncFrom)帮手[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

## 注意事项

### 同步逻辑

如果在您运行时初始同步正在进行中操作[`replSetSyncFrom`](https://www.mongodb.com/docs/manual/reference/command/replSetSyncFrom/#mongodb-dbcommand-dbcmd.replSetSyncFrom)/[`rs.syncFrom()`](https://www.mongodb.com/docs/manual/reference/method/rs.syncFrom/#mongodb-method-rs.syncFrom)，[`replSetSyncFrom`/](https://www.mongodb.com/docs/manual/reference/command/replSetSyncFrom/#mongodb-dbcommand-dbcmd.replSetSyncFrom)[`rs.syncFrom()`](https://www.mongodb.com/docs/manual/reference/method/rs.syncFrom/#mongodb-method-rs.syncFrom)将停止正在进行的初始同步并重新启动与新目标的同步过程。

仅根据需要修改默认同步逻辑，并始终谨慎行事。

### 目标

要同步的节点必须是集合中数据的有效来源。要从节点同步，节点必须：

- 有资料。在启动或恢复模式下，它不能成为仲裁者，并且必须能够回答数据查询。
- 易于访问。
- 成为副本集配置中同一集的节点。
- 使用设置构建索引 [`members[n\].buildIndexes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.buildIndexes)。
- 该集合的不同节点，以防止与自身同步。

如果您尝试从落后于当前节点 10 秒以上的节点进行复制，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)将记录警告但仍会从滞后的节点	进行复制。另请参阅 [复制滞后和流量控制。](https://www.mongodb.com/docs/manual/replication/#std-label-replication-flow-control)

### Persistence

[`replSetSyncFrom`/](https://www.mongodb.com/docs/manual/reference/command/replSetSyncFrom/#mongodb-dbcommand-dbcmd.replSetSyncFrom)[`rs.syncFrom()`](https://www.mongodb.com/docs/manual/reference/method/rs.syncFrom/#mongodb-method-rs.syncFrom)提供默认行为的临时覆盖。 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在以下情况下将恢复为默认同步行为：

- [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例重新启动。
- 和同步目标之间的连接[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)关闭。
- 如果同步目标落后于副本集的另一个成员超过 30 秒。

## 程序

在中使用[`replSetSyncFrom`](https://www.mongodb.com/docs/manual/reference/command/replSetSyncFrom/#mongodb-dbcommand-dbcmd.replSetSyncFrom)命令[`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
db.adminCommand( { replSetSyncFrom: "hostname<:port>" } );
```



在中使用[`rs.syncFrom()`](https://www.mongodb.com/docs/manual/reference/method/rs.syncFrom/#mongodb-method-rs.syncFrom)助手[`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
rs.syncFrom("hostname<:port>");
```



←  [更改副本集中的主机名](https://www.mongodb.com/docs/manual/tutorial/change-hostnames-in-a-replica-set/)                              [重命名副本集](https://www.mongodb.com/docs/manual/tutorial/rename-unsharded-replica-set/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/configure-replica-set-secondary-sync-target/

译者：陆文龙

