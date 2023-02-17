# 将分片集群升级到4.4

> 警告：
>
> 将包含MongoDB 3.0元数据的MongoDB 4.2系列部署升级到4.4系列部署时，您必须升级到**MongoDB 4.4.1或更高版本**。您无法成功将包含MongoDB 3.0元数据的部署升级到MongoDB 4.4.0，否则将出现严重的停机风险。
>
> 有关更多信息，请参阅[WT-6623。](https://jira.mongodb.org/browse/WT-6623)

在升级到MongoDB 4.4之前，请熟悉本文档的内容，包括彻底审查先决条件。

如果您需要升级到4.4的指导，[MongoDB专业服务](https://www.mongodb.com/products/consulting?tck=docs_server)提供主要版本升级支持，以帮助确保顺利过渡到MongoDB应用程序而不中断。

## 升级建议和核对清单

升级时，请考虑以下几点：

### 升级版本路径

要将现有的MongoDB部署升级到4.4，您必须运行4.2系列版本。

要从4.2系列之前的版本升级，您必须先后升级主要版本，直到升级到4.2系列。例如，如果您运行的是4.0系列，则必须[先升级到4.2](https://www.mongodb.com/docs/upcoming/release-notes/4.2/#std-label-4.2-upgrade)，*然后*才能升级到4.4。

### 检查驱动程序兼容性

在升级MongoDB之前，请检查您是否使用的是与MongoDB 4.4兼容的驱动程序。咨询[驱动程序文档](https://www.mongodb.com/docs/drivers/)用于您的特定驱动程序，以验证与MongoDB 4.4的兼容性。

在不兼容驱动程序上运行的升级部署可能会遇到意外或未定义的行为。

### 准备工作

在开始升级之前，请参阅[MongoDB 4.4中的兼容性更改](https://www.mongodb.com/docs/upcoming/release-notes/4.4-compatibility/)文档，以确保您的应用程序和部署与MongoDB 4.4兼容。在开始升级之前，解决部署中的不兼容性。

在升级MongoDB之前，在将升级部署到生产环境之前，请务必在分期环境中测试您的应用程序。

### 降级注意事项

一旦升级到4.4，如果您需要降级，我们建议[降级](https://www.mongodb.com/docs/upcoming/release-notes/4.4-downgrade-sharded-cluster/)到4.2的最新补丁版本。

> 警告：
>
> **降级**
>
> 如果您需要从4.4版本降级，请降级到4.2.6或更高版本。您无法降级到4.2.5或更早的版本。

## 先决条件

### 所有成员版本

要将分片集群升级到4.4，集群**的所有**成员必须至少是4.2版本。升级过程检查集群的所有组件，如果任何组件运行的版本早于4.2，则会发出警告。

### 确认清洁关机

在升级分片集群的成员之前，请确认该成员已[完全关闭。](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)

### 功能兼容性版本

4.2分片集群必须将`featureCompatibilityVersion`设置为`"4.2"`

为了确保分片集群的所有成员都将`featureCompatibilityVersion`设置为`"4.2"`连接到每个碎片副本集成员和每个配置服务器副本集成员，并检查`featureCompatibilityVersion`：

> 提示：
>
> 对于启用了访问控制的分片集群，要对碎片副本集成员运行以下命令，您必须以[分片本地用户](https://www.mongodb.com/docs/upcoming/core/security-users/#std-label-shard-local-users)的身份连接到该成员[。](https://www.mongodb.com/docs/upcoming/core/security-users/#std-label-shard-local-users)

``` 
db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
```

所有成员都应返回包含以下内容的结果

`"featureCompatibilityVersion" : { "version" : "4.2" }`.

要设置或更新`featureCompatibilityVersion`，请在[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)上运行以下命令[：](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)

```
db.adminCommand( { setFeatureCompatibilityVersion: "4.2" } )
```

有关更多信息，请参阅[`setFeatureCompatibilityVersion`。](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)

### 副本集成员状态

对于碎片和配置服务器，请确保没有副本集成员处于[`ROLLBACK`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)或[`RECOVERING`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)状态。

### 备份`config`数据库

*可选但推荐。*作为预防措施，在升级分片集群*之前*，请先备份`config`数据库。

## 下载4.4 二进制文件

### 使用软件包管理器

如果您从MongoDB `apt`、`yum`、`dnf`或`zypper`存储库安装了MongoDB，则应使用软件包管理器升级到4.4。

按照Linux系统的相应[4.4安装说明操作](https://www.mongodb.com/docs/upcoming/installation/#std-label-tutorial-installation)。这将涉及为新版本添加一个存储库，然后执行实际的升级过程。

### 手动下载4.4 二进制文件

如果您尚未使用软件包管理器安装MongoDB，您可以手动从[MongoDB下载中心](https://www.mongodb.com/try/download?tck=docs_server)。

有关更多信息，请参阅[4.4安装说明](https://www.mongodb.com/docs/upcoming/installation/#std-label-tutorial-installation)。

## 升级流程

#### 1、停用平衡器

将mongo shell连接到分片集群中的 [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例，并运行 [`sh.stopBalancer()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.stopBalancer/#mongodb-method-sh.stopBalancer)禁用均衡器：

```
sh.stopBalancer()
```

> 笔记：
>
> 如果迁移正在进行中，系统将在停止平衡器之前完成正在进行的迁移。您可以runsh[`sh.isBalancerRunning()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.isBalancerRunning/#mongodb-method-sh.isBalancerRunning)来检查平衡器的当前状态。

要验证平衡器是否已禁用，请运行[`sh.getBalancerState()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.getBalancerState/#mongodb-method-sh.getBalancerState)），如果平衡器被禁用，则返回false：

```
sh.getBalancerState()
```

有关禁用平衡器的更多信息，请参阅[禁用平衡器。](https://www.mongodb.com/docs/upcoming/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-balancing-disable-temporarily)

#### 2、升级配置服务器。

1. 一次升级一个副本的[辅助](https://www.mongodb.com/docs/upcoming/core/replica-set-members/#std-label-replica-set-secondary-members)成员：

   * 关闭次要[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，并将4.2二进制文件替换为4.4二进制文件。

   * 使用[`--configsvr`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--configsvr)、[`--replSet`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--replSet)和[`--port`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--port)启动4.4二进制文件。包括部署中使用的任何其他选项。

     ```
     mongod --configsvr --replSet <replSetName> --port <port> --dbpath <path> --bind_ip localhost,<ip address>
     ```

     如果使用[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/)，请更新文件以指定[`sharding.clusterRole: configsvr`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-sharding.clusterRole)、[`replication.replSetName`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-replication.replSetName)、[`net.port`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.port)和[`net.bindIp`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.bindIp)，然后启动4.4二进制文件：

     ```
     sharding:
        clusterRole: configsvr
     replication:
        replSetName: <string>
     net:
        port: <port>
        bindIp: localhost,<ip address>
     storage:
        dbpath: <path>
     ```

     包括适合您部署的任何其他设置。

   * 请等待成员恢复到SECONDARY状态，然后再升级下一个辅助成员。要检查成员的状态，请在mongo shell中发出 [`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)。

     对每个辅助成员重复。

2. 逐步关闭副本集主副本。

   * 将一个mongo shell连接到主服务器，并使用 [`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)将主服务器降级，强制选举一个新的主服务器：

     ```
     rs.stepDown()
     ```

   * 当[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)显示初选已下台，而另一个成员已处于`PRIMARY`状态时，请关闭降级初选，并将[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件替换为4.4二进制文件。

   * 使用[`--configsvr`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--configsvr)、[`--replSet`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--replSet)、[`--port`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--port)和[`--bind_ip`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--bind_ip)选项启动4.4二进制文件。包括上一次部署中使用的任何可选命令行选项：

     ```
     mongod --configsvr --replSet <replSetName> --port <port> --dbpath <path> --bind_ip localhost,<ip address>
     ```

     如果使用[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/)，请更新文件以指定[`sharding.clusterRole: configsvr`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-sharding.clusterRole)、[`replication.replSetName`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-replication.replSetName)、[`net.port`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.port)和[`net.bindIp`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.bindIp)，然后启动4.4二进制文件：

     ```
     sharding:
        clusterRole: configsvr
     replication:
        replSetName: <string>
     net:
        port: <port>
        bindIp: localhost,<ip address>
     storage:
        dbpath: <path>
     ```

     包括适合您部署的任何其他配置。

#### 3、升级分片。

一次升级一个碎片。

对于每个碎片副本集：

1. 一次升级一个副本的[辅助](https://www.mongodb.com/docs/upcoming/core/replica-set-members/#std-label-replica-set-secondary-members)成员：

   * 关闭[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，并将4.2二进制文件替换为4.4二进制文件。

   * 使用[`--shardsvr`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--shardsvr)、[`--replSet`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--replSet)、[`--port`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--port)和[`--bind_ip`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--bind_ip)选项启动4.4二进制文件。包括适合您部署的任何其他命令行选项：

     ```
     mongod --shardsvr --replSet <replSetName> --port <port> --dbpath <path> --bind_ip localhost,<ip address>
     ```

     如果使用[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/)，请将文件更新为包括[`sharding.clusterRole: shardsvr`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-sharding.clusterRole)、[`replication.replSetName`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-replication.replSetName)、[`net.port`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.port)和[`net.bindIp`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.bindIp)，然后启动4.4二进制文件：

     ```
     sharding:
        clusterRole: shardsvr
     replication:
        replSetName: <string>
     net:
        port: <port>
        bindIp: localhost,<ip address>
     storage:
        dbpath: <path>
     ```

     包括适合您部署的任何其他配置。

   * 请等待成员恢复到SECONDARY状态，然后再升级下一个辅助成员。要检查成员的状态，可以在mongo shell中发出[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)。

     对每个辅助成员重复

2. 逐步关闭副本集主副本。

   将一个mongo shell连接到主服务器，并使用[`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)将主服务器降级，强制选举一个新的主服务器：

   ```
   rs.stepDown()
   ```

3. 当[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)显示初选已下台，而其他成员已处于`PRIMARY`状态时，请升级降级初选：

   1. 关闭降级主制文件，用4.4二进制文件替换为[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件。

   2. 使用[`--shardsvr`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--shardsvr)、[`--replSet`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--replSet)、[`--port`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--port)和[`--bind_ip`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--bind_ip)选项启动4.4二进制文件。包括适合您部署的任何其他命令行选项:

      ```
      mongod --shardsvr --replSet <replSetName> --port <port> --dbpath <path> --bind_ip localhost,<ip address>
      ```

      如果使用[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/)，请更新文件以指定[`sharding.clusterRole: shardsvr`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-sharding.clusterRole)、[`replication.replSetName`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-replication.replSetName)、[`net.port`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.port)和[`net.bindIp`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.bindIp)，然后启动4.4二进制文件：

      ```
      sharding:
         clusterRole: shardsvr
      replication:
         replSetName: <string>
      net:
         port: <port>
         bindIp: localhost,<ip address>
      storage:
         dbpath: <path>
      ```

      包括适合您部署的任何其他配置。

#### 4、升级`mongos`实例。

将每个[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例替换为4.4二进制文件并重新启动。包括适合您部署的任何其他配置。

>笔记：
>
>当分片集群成员在不同主机上运行或远程客户端连接到分片集群时，必须指定[`--bind_ip`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--bind_ip)选项。有关更多信息，请参阅[Localhost绑定兼容性更改](https://www.mongodb.com/docs/upcoming/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)。

```
mongos --configdb csReplSet/<rsconfigsver1:port1>,<rsconfigsver2:port2>,<rsconfigsver3:port3> --bind_ip localhost,<ip address>
```



#### 5、重新启用平衡器。

使用4.4 mongo shell，连接到集群中的mongos并运行[`sh.startBalancer()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.startBalancer/#mongodb-method-sh.startBalancer)重新启用平衡器：

```
sh.startBalancer()
```

从MongoDB 6.1开始，不执行自动分割块。这是因为平衡了政策的改进。自动拆分命令仍然存在，但不执行操作。有关详细信息，请参阅[平衡策略更改。](https://www.mongodb.com/docs/upcoming/release-notes/6.1/#std-label-release-notes-6.1-balancing-policy-changes)

在6.1之前的MongoDB版本中，[`sh.startBalancer()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.startBalancer/#mongodb-method-sh.startBalancer)还支持分片集群的自动拆分。

如果您不希望在启用平衡器时启用自动拆分，您还必须运行[`sh.disableAutoSplit()`。](https://www.mongodb.com/docs/upcoming/reference/method/sh.disableAutoSplit/#mongodb-method-sh.disableAutoSplit)

有关重新启用平衡器的更多信息，请参阅[启用平衡器。](https://www.mongodb.com/docs/upcoming/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-balancing-enable)

#### 6、启用向后不兼容的4.4功能。

此时，您可以在没有与4.2不兼容的4.4[功能的情况下](https://www.mongodb.com/docs/upcoming/release-notes/4.4-compatibility/#std-label-4.4-compatibility-enabled)运行4.4二进制文件。

要启用这些4.4功能，请将功能兼容性版本（`FCV`）设置为4.4。

> 提示：
>
> 启用这些向后不兼容的功能可能会使降级过程复杂化，因为在降级之前，您必须删除任何持续存在的向后不兼容的功能。
>
> 建议在升级后，在烧毁期间允许您的部署在不启用这些功能的情况下运行，以确保降级的可能性最小。当您确信降级的可能性很小时，请启用这些功能。

在[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例上，在`admin`数据库中运行[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令：

```
db.adminCommand( { setFeatureCompatibilityVersion: "4.4" } )
```

设置[功能兼容性版本（fCV）：“4.4”](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-set-fcv)在每个碎片上隐式执行areplSetReconfig，将[`term`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.term)字段添加到碎片副本配置文档和块中，直到新配置传播到大多数副本集成员。

此命令必须对内部系统集合执行写入。如果由于任何原因命令未能成功完成，您可以安全地在[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)上重试该命令，因为操作是幂等的。

> 笔记：
>
> 当[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)分片集群上运行时，块迁移、拆分和合并可能会因`ConflictingOperationInProgress`而失败。

当您将[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)设置为4.4时，碎片上存在的任何[孤儿文档](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-orphaned-document)都将被清理。清洁过程：

- 不会阻止升级完成，并且
- 费率有限。要减轻孤儿文档清理期间性能的潜在影响，请参阅[范围删除性能调整。](https://www.mongodb.com/docs/upcoming/core/sharding-balancer-administration/#std-label-range-deletion-performance-tuning)

> 笔记：
>
> **其他考虑因素**
>
> 当尝试连接[功能兼容性版本（fCV）](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)大于[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例时，[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)二进制文件将崩溃。例如，您无法将MongoDB 4.2版本[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)连接到[fCV](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)设置为4.4的4.4分片集群。但是，您可以将MongoDB 4.2版本的[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)连接到[fCV](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)设置为4.2的4.4分片集群。

## 其他升级程序

- 要升级独立设备，请参阅[将独立升级到4.4。](https://www.mongodb.com/docs/upcoming/release-notes/4.4-upgrade-standalone/#std-label-4.4-upgrade-standalone)
- 要升级副本集，请参阅[将副本集升级到4.4。](https://www.mongodb.com/docs/upcoming/release-notes/4.4-upgrade-replica-set/#std-label-4.4-upgrade-replica-set)





原文 - [Upgrade a Sharded Cluster to 4.4]( https://docs.mongodb.com/manual/release-notes/4.4-upgrade-sharded-cluster/ )

