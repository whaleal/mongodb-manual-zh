# 更换配置服务器

>## 重要的
>
>以下过程适用于 6.0 配置服务器。早期版本的MongoDB请参考对应版本的MongoDB手册。



## 概述

如果配置服务器副本集变为只读，即没有主副本集，则分片集群无法支持更改集群元数据的操作，例如块拆分和迁移。虽然不能拆分或迁移任何块，但应用程序将能够将数据写入分片集群。

如果其中一台配置服务器不可用或无法运行，请尽快修复或更换它。以下过程用新节点替换配置服务器副本集的节点。

本教程特定于 MongoDB 6.0。早期版本的MongoDB请参考对应版本的MongoDB手册。

## 注意事项

用于配置服务器时，以下限制适用于副本集配置：

- 副本集节点没有仲裁者。
- 副本集没有延迟节点。
- 必须建立索引（所有何节点都不应将 `members[n].buildIndexes`设置设置为 false）。

## 程序



### 1.启动替换配置服务器。

启动一个`mongod`实例，指定`--configsvr`、 `--replSet`、`--bind_ip`选项和其他适合您的部署的选项。

>## 警告
>
>在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 安全清单。至少，考虑启用身份验证和 强化网络基础设施



```
mongod --configsvr --replSet <replicaSetName> --bind_ip localhost,<hostname(s)|ip address(es)>
```



### 2.将新的配置服务器添加到副本集。

连接`mongosh`到配置服务器副本集的主节点并用`rs.add()`添加新节点。

>## 警告
>
>在 MongoDB 5.0 之前，新添加的从节点仍然算作投票节点，即使它在数据一致之前既不能提供读取服务也不能成为主节点。如果您运行的是早于 5.0 的 MongoDB 版本并添加一个其`votes`和`priority`设置大于零的从节点，这可能会导致大多数投票节点在线但无法选举主要节点的情况。为避免这种情况，请考虑最初使用和添加新的 `votes :0`和`priority :0`的从节点。然后，运行`rs.status()`以确保节点已转换为`SECONDARY`状态。最后，用 `rs.reconfig()`更新其`priority`和`votes`。	



```shell
rs.add( { host: "<hostnameNew>:<portNew>", priority: 0, votes: 0 } )
```



初始同步过程将所有数据从配置服务器副本集的一个节点复制到新节点，而无需重新启动。

`mongos`实例自动识别配置服务器副本集节点中的更改而无需重新启动。



### 3.更新新添加的配置服务器的votes和priority设置。

1. 确保新节点已达到`SECONDARY`状态。要检查副本集节点的状态，请运行 `rs.status()`：

   ```shell
   rs.status()
   ```

   

2. 重新配置副本集以更新新节点的votes和priority：

   ```shell
   var cfg = rs.conf();
   
   cfg.members[n].priority = 1;  // Substitute the correct array index for the new member
   cfg.members[n].votes = 1;     // Substitute the correct array index for the new member
   
   rs.reconfig(cfg)
   ```

   

   `members`数组中新节点的数组索引在`n`哪里。

>## 警告
>
>- shell`rs.reconfig()`方法可以强制当前 primary 下台，从而导致选举。当主节点步骤关闭时， `mongod`关闭所有客户端连接。虽然这通常需要 10-20 秒，但请尝试在计划的维护期间进行这些更改。
>- 避免重新配置包含不同 MongoDB 版本节点的副本集，因为验证规则可能因 MongoDB 版本而异。



### 4.关闭要替换的成员。

如果更换主节点，请在关闭之前先关闭节点。



### 5.从配置服务器副本集中删除要替换的成员。

替换配置服务器的初始同步完成后，使用`mongosh`连接到主节点的会话，用`rs.remove()`删除老节点。

```shell
rs.remove("<hostnameOld>:<portOld>")
```



`mongos`实例自动识别配置服务器副本集节点中的更改而无需重新启动。



### 6.如有必要，更新`mongos`配置或 DNS 条目。

对于副本集配置服务器，`mongos`实例在`--configdb`或`sharding.configDB`设置配置服务器副本集名称并且至少一个副本集成员中指定。

因此，如果`mongos`实例未在`--configdb`或 `sharding.configDB`设置中指定已删除的副本集节点，则无需执行进一步操作。

但是，如果`mongos`实例在`--configdb`或`configDB`设置中指定了已删除的节点 ，则：

- 下次重新启动时更新设置 `mongos`
- 修改指向提供旧配置服务器的系统的 DNS 条目，以便相同*的*主机名指向新的配置服务器。

原文 -  https://docs.mongodb.com/manual/tutorial/replace-config-server/ 

译者：陆文龙

