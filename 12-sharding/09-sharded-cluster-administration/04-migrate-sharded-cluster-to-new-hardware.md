# 将分片集群迁移到不同的硬件

本教程特定于 MongoDB 6.0。早期版本的MongoDB请参考对应版本的MongoDB手册。

分片集群的配置服务器部署为副本集。副本集配置服务器必须运行WiredTiger 存储引擎。

此过程将分片集群的组件移动到新的硬件系统，而无需停机进行读写。



>## 重要的
>
>在迁移过程中，不要尝试更改分片集群元数据信息。不要使用任何*以任何方式*修改集群元数据的操作。例如，不要创建或删除数据库、创建或删除集合或使用任何分片命令。





## 禁用平衡器

禁用平衡器以停止块迁移，并且在该过程完成之前不执行任何元数据写入操作。如果正在进行迁移，平衡器将在停止之前完成正在进行的迁移。

要禁用平衡器，请连接到集群的一个 `mongos`实例并发出以下方法：

```shell
sh.stopBalancer()
```



要检查平衡器状态，请发出`sh.getBalancerState()` 方法。

有关详细信息，请参阅禁用平衡器。

从 MongoDB 6.0.3 开始，不执行自动分块。 这是因为平衡政策的改进。 自动拆分命令仍然存在，但不执行操作。 详见Balancing Policy Changes。在MongoDB 6.0之前的版本中，sh.stopBalancer()也会关闭sharded cluster的自动分裂。

## 分别迁移每个配置服务器

*在3.4版中更改*。

从 MongoDB 3.2 开始，分片集群的配置服务器可以部署为[副本集](https://www.mongodb.com/docs/manual/replication/)(CSRS)，而不是三个镜像配置服务器 (SCCC)。为配置服务器使用副本集可以提高配置服务器之间的一致性，因为 MongoDB 可以利用配置数据的标准副本集读写协议。此外，为配置服务器使用副本集允许分片集群拥有超过 3 个配置服务器，因为副本集最多可以有 50 个节点。要将配置服务器部署为副本集，配置服务器必须运行WiredTiger 存储引擎。

在 3.4 版中，MongoDB删除了对 SCCC 配置服务器的支持。

用于配置服务器时，以下限制适用于副本集配置：

- 没有仲裁节点。
- 没有延迟节点。
- 必须建立索引（即任何节点都不应将 `members[n].buildIndexes`设置设置为 false）。

对于配置服务器副本集的每个节点：

>## 重要的
>
>### 在更换主节点之前更换从节点。

### 



### 1.启动替换配置服务器。

启动一个`mongod`实例，指定`--configsvr`、 `--replSet`、`--bind_ip`选项和其他适合您的部署的选项。

>## 警告
>
>在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 安全清单。至少，考虑 启用身份验证和强化网络基础设施。

```shell
mongod --configsvr --replSet <replicaSetName> --bind_ip localhost,<hostname(s)|ip address(es)>
```



### 2.将新的配置服务器添加到副本集。

连接`mongosh`到配置服务器副本集的主节点并用于`rs.add()`添加新节点。



>## 警告
>
>在 MongoDB 5.0 之前，新添加的从节点仍然算作投票节点，即使它在数据一致之前既不能提供读取服务也不能成为主节点。如果您运行的是早于 5.0 的 MongoDB 版本并添加一个`votes`和`priority`设置大于零的从节点，这可能会导致大多数投票节点在线但无法选举主节点的情况。为避免这种情况，添加新的 `votes :0`和`priority :0`的从节点。然后，运行`rs.status()`以确保节点已转换为`SECONDARY`状态。最后，用于 `rs.reconfig()`更新其priority和votes。

```shell
rs.add( { host: "<hostnameNew>:<portNew>", priority: 0, votes: 0 } )
```

初始同步过程将所有数据从配置服务器副本集的一个节点复制到新节点，而无需重新启动。

`mongos`实例自动识别配置服务器副本集节点中的更改而无需重新启动。



### 3.更新新添加的配置服务器的投票和优先级设置。

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
>- shell`rs.reconfig()`方法可以强制当前 primary 下台，从而导致选举。当主节点关闭时， `mongod`关闭所有客户端连接。虽然这通常需要 10-20 秒，但请尝试在计划的维护期间进行这些更改。
>- 避免重新配置包含不同 MongoDB 版本节点的副本集，因为验证规则可能因 MongoDB 版本而异。



### 4.关闭要替换的节点。

如果更换主节点，请在关闭之前先关闭主节点。



### 5.从配置服务器副本集中删除要替换的节点。

替换配置服务器的初始同步完成后，`mongosh`连接到主节点的会话，用`rs.remove()`删除老节点。

```shell
rs.remove("<hostnameOld>:<portOld>")
```



`mongos`实例自动识别配置服务器副本集节点中的更改而无需重新启动。



## 重启`mongos`实例

*在3.2版更改*：对于副本集配置服务器，mongos 实例在 --configdb 或 sharding.configDB 设置中指定配置服务器副本集名称和至少一个副本集节点。分片集群的实例`mongos`必须指定相同的配置服务器副本集名称，但可以指定副本集的不同节点。

如果`mongos`实例在`--configdb`或`sharding.configDB`设置中指定了迁移的副本集节点，则在下次重新启动`mongos`实例时更新配置服务器设置 。

有关详细信息，请参阅分片集群启动一个mongos服务



## 分片迁移

一次一个地迁移分片。对于每个分片，请遵循本部分中的适当过程。



### 迁移副本集分片

要迁移分片集群，请分别迁移每个节点。首先迁移非主节点，然后最后迁移主节点 。

如果副本集有两个能投票的节点，请向副本集添加一个仲裁器，以确保该集在迁移期间保持其大部分投票可用。您可以在完成迁移后删除仲裁程序。



#### 迁移副本集分片的节点

1. 关闭`mongod`进程。为确保干净关闭，请使用`shutdown`命令。

2. 将数据目录（即`dbPath`）移动到 新机器。

3. `mongod`在新位置重新启动该过程。

4. 连接到副本集的当前主节点。

5. 如果节点的主机名已更改，请使用`rs.reconfig()` 更新副本集配置文档的新主机名。

   例如，以下命令序列更新`members`数组`2`中某个位置的实例的主机名 ：

   ```shell
   cfg = rs.conf()
   cfg.members[2].host = "pocatello.example.net:27018"
   rs.reconfig(cfg)
   ```

   

6. 要确认新配置，使用`rs.conf()`命令.

7. 等待节点恢复。要检查节点的状态，使用`rs.status()`命令.

#### 迁移副本集分片中的主节点

在迁移副本集的主节点时，该集合必须选择一个新的主节点。此故障转移过程使副本集在选举期间无法执行读取或接受写入，通常会很快完成。如果可能，请在维护窗口期间计划迁移。

1. 降级主节点以允许正常的故障转移过程。要降级主节点，请连接到主节点并发出命令 `replSetStepDown`或`rs.stepDown()`方法。以下示例演示了`rs.stepDown()` 方法：

   ```shell
   rs.stepDown()
   ```

   

2. 一旦主节点下台并且另一个节点成为 `PRIMARY`状态。要迁移降级的主节点，请遵循迁移副本集分片的节点程序

   您可以检查`rs.status()`的输出以确认状态的变化。



## 重新启用平衡器

要完成迁移，请重新启用平衡器以恢复 块迁移。

连接到集群的一个`mongos`实例并传递 `true`给`sh.startBalancer()`方法：

```shell
sh.startBalancer()
```



要检查平衡器状态，请使用`sh.getBalancerState()` 方法。



从 MongoDB 6.0.3 开始，不执行自动分块。这是因为平衡政策的改进。自动拆分命令仍然存在，但不执行操作。在 MongoDB 6.0 之前的版本中，`sh.startBalancer()`还启用了分片集群的自动拆分

原文 - https://docs.mongodb.com/manual/tutorial/migrate-sharded-cluster-to-new-hardware/

译者：陆文龙

