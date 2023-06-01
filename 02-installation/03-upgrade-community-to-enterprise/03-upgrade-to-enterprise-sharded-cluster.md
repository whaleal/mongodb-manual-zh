# 升级到 MongoDB Enterprise（分片集群）

MongoDB 企业版提供了 MongoDB 社区版所没有的各种特性，例如：

- [内存存储引擎](https://www.mongodb.com/docs/manual/core/inmemory/)
- [审计](https://www.mongodb.com/docs/manual/core/auditing/)
- [Kerberos 认证](https://www.mongodb.com/docs/manual/core/kerberos/)
- [LDAP 代理身份验证](https://www.mongodb.com/docs/manual/core/security-ldap/)和[LDAP 授权](https://www.mongodb.com/docs/manual/core/security-ldap-external/)
- [静态加密](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)

以下步骤概述了将分片集群从 MongoDB 社区版升级到 MongoDB 企业版的过程。例如，这些步骤可用于将 MongoDB 6.0 Community 升级到 MongoDB 6.0 Enterprise。

## 考虑[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/upgrade-to-enterprise-sharded-cluster/#consideration)



## WARNING

不要使用这些说明升级到另一个发行版本。要升级发布版本，请参阅相应的发布升级说明，例如[升级到 MongoDB 6.0 。](https://www.mongodb.com/docs/manual/release-notes/6.0/#std-label-6.0-upgrade)

## 下载企业二进制文件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/upgrade-to-enterprise-sharded-cluster/#download-enterprise-binaries)

根据您的操作系统，您可以使用包管理器或手动下载二进制文件来安装 MongoDB Enterprise 二进制文件。

Linux (Package Manager)Linux (Manual Download)WindowsmacOS

如果您使用包管理器安装了 MongoDB Community，请按照适用于您的操作系统的包管理器说明进行操作：

- [红帽企业或 CentOS](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat/)
- [Ubuntu](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/)
- [德比安](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-debian/)
- [苏斯](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/)
- [亚马逊Linux](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-amazon/)

安装过程中，包管理器会删除社区包；在您重新启动之前，这不会影响正在运行的部署。

## 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/upgrade-to-enterprise-sharded-cluster/#procedure)

为了最大限度地减少停机时间，您可以使用“滚动”升级从 MongoDB Community 升级到 Enterprise Edition，方法是在其他成员可用时单独升级成员。



### 禁用平衡器。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/upgrade-to-enterprise-sharded-cluster/#disable-the-balancer)

连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)分片集群中的一个实例，并运行[`sh.stopBalancer()`](https://www.mongodb.com/docs/manual/reference/method/sh.stopBalancer/#mongodb-method-sh.stopBalancer)以禁用平衡器：

```
sh.stopBalancer()
```



## NOTE

如果正在进行迁移，系统将在停止平衡器之前完成正在进行的迁移。您可以运行 [`sh.isBalancerRunning()`](https://www.mongodb.com/docs/manual/reference/method/sh.isBalancerRunning/#mongodb-method-sh.isBalancerRunning)以检查平衡器的当前状态。

要验证平衡器是否已禁用，请运行 [`sh.getBalancerState()`](https://www.mongodb.com/docs/manual/reference/method/sh.getBalancerState/#mongodb-method-sh.getBalancerState)，如果平衡器已禁用，则返回 false：

```
sh.getBalancerState()
```



从 MongoDB 6.0.3 开始，不执行自动分块。这是因为平衡政策的改进。自动拆分命令仍然存在，但不执行操作。有关详细信息，请参阅 [平衡策略更改。](https://www.mongodb.com/docs/manual/release-notes/6.0/#std-label-release-notes-6.0-balancing-policy-changes)

在 MongoDB 6.0 之前的版本中，[`sh.stopBalancer()`](https://www.mongodb.com/docs/manual/reference/method/sh.stopBalancer/#mongodb-method-sh.stopBalancer) 还禁用分片集群的自动拆分。

有关禁用平衡器的更多信息，请参阅 [禁用平衡器。](https://www.mongodb.com/docs/manual/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-balancing-disable-temporarily)



### 升级配置服务器。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/upgrade-to-enterprise-sharded-cluster/#upgrade-the-config-servers)

1. 一次升级副本集的[从节点：](https://www.mongodb.com/docs/manual/core/replica-set-members/#std-label-replica-set-secondary-members)

   1. 关闭辅助[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例。
   2. 使用 Enterprise 重新启动节点[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，指定相同的配置选项（例如相同的数据目录、配置文件等）。
   3. 等待节点恢复到`SECONDARY`状态，然后再升级下一个从节点。要检查节点的状态，请在[`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)中使用[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)命令

   对每个剩余的次要成员重复此操作。

2. 降级副本集主要。

   连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到主节点并用于 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)降低主节点并强制选举新的主节点：

   ```
   rs.stepDown()
   ```

   

3. 当[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)显示primary已经降级，另一个节点是primary时，升级降级的primary：

   1. 关闭降压初级。
   2. 重新启动 Enterprise [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，指定相同的配置选项（例如相同的数据目录、配置文件等）。



### 升级分片。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/upgrade-to-enterprise-sharded-cluster/#upgrade-the-shards)

一次升级一个分片。

对于每个分片副本集：

1. 一次升级副本集的[从节点：](https://www.mongodb.com/docs/manual/core/replica-set-members/#std-label-replica-set-secondary-members)

   1. 关闭辅助[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例。
   2. 使用 Enterprise 重新启动成员[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，指定相同的配置选项（例如相同的数据目录、配置文件等）。
   3. 等待节点恢复到`SECONDARY`状态，然后再升级下一个从节点。要检查节点的状态，请在[`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)使用[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)命令查看

   对每个剩余的从节点重复此操作。

2. 降级副本集主节点。

   连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到主要并用于 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)降低主要并强制选举新的主节点：

   ```
   rs.stepDown()
   ```

   

3. 当[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)显示primary已经降级，另一个成员是primary时，升级降级的primary：

   1. 关闭降压初级。
   2. 重新启动 Enterprise [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，指定相同的配置选项（例如相同的数据目录、配置文件等）。

4个

### 升级`mongos`实例。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/upgrade-to-enterprise-sharded-cluster/#upgrade-the-mongos-instances)

对于每个实例，使用 Enterprise[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)关闭 并重新启动，指定相同的配置选项。[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

5个

### 重新启用平衡器。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/upgrade-to-enterprise-sharded-cluster/#re-enable-the-balancer)

使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，连接到 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)集群中的a并运行 [`sh.startBalancer()`](https://www.mongodb.com/docs/manual/reference/method/sh.startBalancer/#mongodb-method-sh.startBalancer)以重新启用平衡器：

```
sh.startBalancer()
```



从 MongoDB 6.0.3 开始，不执行自动分块。这是因为平衡政策的改进。自动拆分命令仍然存在，但不执行操作。有关详细信息，请参阅 [平衡策略更改。](https://www.mongodb.com/docs/manual/release-notes/6.0/#std-label-release-notes-6.0-balancing-policy-changes)

在 MongoDB 6.0 之前的版本中，[`sh.startBalancer()`](https://www.mongodb.com/docs/manual/reference/method/sh.startBalancer/#mongodb-method-sh.startBalancer) 还启用了分片集群的自动拆分。

有关平衡器的更多信息，请参阅 [启用平衡器。](https://www.mongodb.com/docs/manual/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-balancing-enable)



## IMPORTANT

在使用任何企业功能之前，请确保所有节点都已升级到企业版。

←  [升级到 MongoDB Enterprise（副本集）](https://www.mongodb.com/docs/manual/tutorial/upgrade-to-enterprise-replica-set/)[验证 MongoDB 包的完整性](https://www.mongodb.com/docs/manual/tutorial/verify-mongodb-packages/) →

原文 - [Upgrade to MongoDB Enterprise (Sharded Cluster)]( https://docs.mongodb.com/manual/tutorial/upgrade-to-enterprise-sharded-cluster/ )

译者：陆文龙
