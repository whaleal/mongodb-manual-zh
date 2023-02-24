# 将分片集群升级到4.0

> 重要：
>
> MongoDB 4.0可能会在macOS 10.12.x、10.13.x和10.14.0的不干净关机期间丢失数据。Apple 在 macOS 10.14.1 中修复了这个问题。
>
> 有关详细信息，请参阅[WT-4018。](https://jira.mongodb.org/browse/WT-4018)

> 重要：
>
> 在尝试任何升级之前，请熟悉本文档的内容。

如果您需要升级到4.0的指导，[MongoDB专业服务](https://www.mongodb.com/products/consulting?tck=docs_server)提供主要版本升级支持，以帮助确保顺利过渡到MongoDB应用程序而不中断。

## 升级建议和核对清单

升级时，请考虑以下几点

### 升级版本路径

要将现有的MongoDB部署升级到4.0，您必须运行3.6系列版本。

要从3.6系列之前的版本升级，您必须先后升级主要版本，直到升级到3.6系列。例如，如果您运行的是3.4系列，则必须[先升级到3.6](https://www.mongodb.com/docs/upcoming/release-notes/3.6/#std-label-3.6-upgrade)，*然后*才能升级到4.0。

### 检查驱动程序兼容性

在升级MongoDB之前，请检查您是否使用的是与MongoDB 4.0兼容的驱动程序。咨询[驱动程序文档](https://www.mongodb.com/docs/drivers/)供您的特定驱动程序验证与MongoDB 4.0的兼容性。

在不兼容驱动程序上运行的升级部署可能会遇到意外或未定义的行为。

### 准备工作

在开始升级之前，请参阅[MongoDB 4.0中的兼容性更改](https://www.mongodb.com/docs/upcoming/release-notes/4.0-compatibility/)文档，以确保您的应用程序和部署与MongoDB 4.0兼容。在开始升级之前，解决部署中的不兼容性。

在升级MongoDB之前，在将升级部署到生产环境之前，请务必在分期环境中测试您的应用程序。

### 降级注意事项

一旦升级到4.0，如果您需要降级，我们建议您[降级](https://www.mongodb.com/docs/upcoming/release-notes/4.0-downgrade-sharded-cluster/)到最新的3.6补丁版本。

## 默认绑定到Localhost

重新启动副本集时，以下过程包括命令行选项[`--bind_ip`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--bind_ip)或配置选项[`net.bindIp`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.bindIp)。

从MongoDB 3.6开始，当副本集成员在不同主机上运行或远程客户端连接到部署时，必须指定选项。省略所有成员是否在同一主机上运行，并且所有客户端都是主机的本地。

>警告：
>
>在绑定到非本地主机（例如可公开访问）IP地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅[安全清单](https://www.mongodb.com/docs/upcoming/administration/security-checklist/)。至少，考虑[启用身份验证](https://www.mongodb.com/docs/upcoming/administration/security-checklist/#std-label-checklist-auth)和[强化网络基础设施。](https://www.mongodb.com/docs/upcoming/core/security-hardening/)

## 阅读关注多数（3个成员初级-中级仲裁器架构）

从MongoDB 3.6开始，MongoDB默认支持[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取问题。

对于MongoDB 4.0.3+（和3.6.1+），您可以禁用读取关注[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)以防止存储缓存压力固定具有主二级仲裁器（PSA）架构的三成员副本集或带有三元PSA碎片的碎片集群的部署

> 笔记：
>
> 禁用[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取关注对更改流的可用性没有影响。
>
> 禁用[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)不会影响[多文档事务](https://www.mongodb.com/docs/upcoming/core/transactions/#std-label-transactions)；也就是说，即使禁用读取关注[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)，您也可以为事务指定读取关注[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)

有关更多信息，请参阅[主-二级仲裁器副本集。](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#std-label-disable-read-concern-majority)

## 更改流恢复令

MongoDB 4.0引入了新的十六进制编码字符串更改流[恢复令牌：](https://www.mongodb.com/docs/upcoming/changeStreams/#std-label-change-stream-resume-token)

恢复令牌`_data`类型取决于MongoDB版本，在某些情况下取决于更改流打开/恢复时的功能兼容性版本（fcv）（即fcv值的更改不会影响已打开的更改流的恢复令牌）：

| MongoDB版本             | 功能兼容性版本 | 恢复令牌`_data`类型    |
| :---------------------- | :------------- | :--------------------- |
| MongoDB 4.0.7及更高版本 | "4.0"或"3.6"   | 六角编码字符串（`v1`） |
| MongoDB 4.0.6及更早版本 | "4.0"          | 六角编码字符串（`v0`） |
| MongoDB 4.0.6及更早版本 | "3.6"          | BinData                |
| MongoDB 3.6             | "3.6"          | BinData                |

> 重要：
>
> **从MongoDB 3.6升级到MongoDB 4.0.7时**
>
> 从MongoDB 3.6升级到MongoDB 4.0.7或更高版本时，升级后的分片集群成员将继续生成`v0`令牌，直到第一个[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例升级。如果客户端在连接到另一个尚未更新的[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)（即仅接受BinData恢复令牌）时尝试使用新的`v1`恢复令牌恢复更改流，则恢复操作将失败。在这种情况下，客户端必须等待升级完成，然后才能恢复更改流。
>
> 升级后，如果您后来决定降级到MongoDB 3.6，重新恢复更改流，客户端可以在3.6部署上使用预升级的简历令牌（如果有）。否则，客户将需要启动新的更改流。

### 必要条件

## 所有成员版本

要将分片集群升级到4.0，集群**的所有**成员必须至少是3.6版本。升级过程检查集群的所有组件，如果任何组件运行版本早于3.6，则会发出警告。

### 副本集成员状态

对于碎片和配置服务器，请确保没有副本集成员处于[`ROLLBACK`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)或[`RECOVERING`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)状态。

## 删除对`MONGODB-CR`的支持

从4.0版本开始，MongoDB取消了对已弃用的MongoDB挑战响应（`MONGODB-CR`）身份验证机制的支持。

如果您的部署在`MONGODB-CR`模式中存储了用户凭据，则在升级到4.0版本**之前，**您必须升级到[咸挑战响应身份验证机制（SCRAM](https://www.mongodb.com/docs/upcoming/core/security-scram/#std-label-authentication-scram)）。有关升级到`SCRAM`的信息，请参阅[升级到SCRAM。](https://www.mongodb.com/docs/upcoming/release-notes/3.0-scram/)

> 另见：
>
> [MongoDB 4.0中的兼容性变化](https://www.mongodb.com/docs/upcoming/release-notes/4.0-compatibility/)

## 删除副本集的`pv0`

从4.0版本开始，MongoDB删除了已弃用的副本集协议版本0 `pv0`。

在升级到MongoDB 4.0之前，您必须升级到[`pv1`。](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.protocolVersion)

要升级到pv1，请将mongo shell连接到副本集主副本，并执行以下操作序列：

```
cfg = rs.conf();
cfg.protocolVersion=1;
rs.reconfig(cfg);
```

为了减少[`w:1`](https://www.mongodb.com/docs/upcoming/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)回滚的可能性，您还可以将副本集重新配置为更高的[`settings.catchUpTimeoutMillis`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.catchUpTimeoutMillis)设置。

有关`pv1`的更多信息，请参阅[Replica Set协议版本。](https://www.mongodb.com/docs/upcoming/reference/replica-set-protocol-versions/)

## 删除主-从复制

MongoDB 4.0取消了对已弃用的主从复制的支持。在升级到MongoDB 4.0之前，如果您的部署使用主从复制，则必须升级到副本集。

要从主从复制转换为副本集，请参阅[将主从部署转换为副本集。](https://www.mongodb.com/docs/v4.0/core/master-slave/)

## 删除对`$isolated`的支持

MongoDB放弃了对`$isolated`运算符的支持。如果您有一个包含`$isolated`运算符的现有部分索引或包含`$isolated`运算符的视图，请在升级之前在定义中重新创建没有运算符的索引或视图。

## 功能兼容性版本

3.6分片集群必须将`featureCompatibilityVersion`设置为`3.6`。

为了确保分片集群的所有成员都将`featureCompatibilityVersion`设置为`3.6`，请连接到每个碎片副本集成员和每个配置服务器副本集成员，并检查`featureCompatibilityVersion`：

> 提示：
>
> 对于启用了访问控制的分片集群，要对碎片副本集成员运行以下命令，您必须以[分片本地用户](https://www.mongodb.com/docs/upcoming/core/security-users/#std-label-shard-local-users)的身份连接到该成员[。](https://www.mongodb.com/docs/upcoming/core/security-users/#std-label-shard-local-users)

```
db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
```

所有成员都应该返回一个包含`"featureCompatibilityVersion" : { "version" : "3.6" }`的结果。

要设置或更新`featureCompatibilityVersion`，请在[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)上运行以下命令[：](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)

```
db.adminCommand( { setFeatureCompatibilityVersion: "3.6" } )
```

有关更多信息，请参阅[`setFeatureCompatibilityVersion`。](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)

## 备份配置数据库

*可选但推荐。*作为预防措施，在升级分片集群*之前*，请先备份`config`数据库。

### 下载4.0 二进制文件

## 使用软件包管理器

如果您从MongoDB `apt`、`yum`、`dnf`或`zypper`存储库安装了MongoDB，则应使用软件包管理器升级到4.0。

按照适当的[4.0 安装说明](https://www.mongodb.com/docs/v4.0/installation/)对于您的Linux系统。这将涉及为新版本添加一个存储库，然后执行实际的升级过程。

## 手动下载4.0 二进制文件

如果您尚未使用软件包管理器安装MongoDB，您可以从[MongoDB下载中心](https://www.mongodb.com/download-center?tck=docs_server)。

看[4.0 安装说明](https://www.mongodb.com/docs/v4.0/installation/)了解更多信息。

### 升级流程

### 1、停用平衡器

将mongo shell连接到分片集群中的 [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例，并运行[`sh.stopBalancer()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.stopBalancer/#mongodb-method-sh.stopBalancer)禁用均衡器：

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

### 2、升级配置服务器。

1. 一次升级一个副本的[辅助](https://www.mongodb.com/docs/upcoming/core/replica-set-members/#std-label-replica-set-secondary-members)成员：

   * 关闭二级[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，并将3.6二进制文件替换为4.0二进制文件。

   * 使用[`--configsvr`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--configsvr)、[`--replSet`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--replSet)和[`--port`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--port)启动4.0二进制文件。包括部署中使用的任何其他选项。

     > 笔记：
     >
     > - 从MongoDB 4.0开始，对于使用WiredTiger存储引擎的复制集成员，您无法指定`--nojournal`选项或`storage.journal.enabled: false`。
     > - 从MongoDB 4.0开始，对于作为副本集一部分的 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，不能使用`--noIndexBuildRetry`或`storage.indexBuildRetry`。

     ```
     mongod --configsvr --replSet <replSetName> --port <port> --dbpath <path> --bind_ip localhost,<hostname(s)|ip address(es)>
     ```

     如果使用[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/)，请更新文件以指定[`sharding.clusterRole: configsvr`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-sharding.clusterRole)、[`replication.replSetName`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-replication.replSetName)、[`net.port`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.port)和[`net.bindIp`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.bindIp)，然后启动4.0二进制文件：

     ```
     sharding:
        clusterRole: configsvr
     replication:
        replSetName: <string>
     net:
        port: <port>
        bindIp: localhost,<hostname(s)|ip address(es)>
     storage:
        dbpath: <path>
     ```

     包括适合您部署的任何其他设置。

     > 笔记：
     >
     > - 从MongoDB 4.0开始，对于使用WiredTiger存储引擎的复制集成员，您无法指定`--nojournal`选项或`storage.journal.enabled: false`。
     > - 从MongoDB 4.0开始，对于作为副本集一部分的mongod实例，不能使用--noIndexBuildRetry或storage.indexBuildRetry。

   * 请等待成员恢复到SECONDARY状态，然后再升级下一个辅助成员。要检查成员的状态，请在mongo shell中发出[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)。

     对每个辅助成员重复。

2. 逐步关闭副本集主副本。

   * 将一个mongo shell连接到主服务器，并使用 [`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)将主服务器降级，强制选举一个新的主服务器：

     ```
     rs.stepDown()
     ```

   * 当[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)显示主制已下级，另一个成员已处于`PRIMARY`状态时，请关闭降级主制，并将[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件替换为4.0二进制文件。

   * 使用[`--configsvr`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--configsvr)、[`--replSet`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--replSet)、[`--port`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--port)和[`--bind_ip`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--bind_ip)选项启动4.0二进制文件。包括上一次部署使用的任何可选命令行选项：

     ```
     mongod --configsvr --replSet <replSetName> --port <port> --dbpath <path> --bind_ip localhost,<hostname(s)|ip address(es)>
     ```

     > 笔记：
     >
     > - 从MongoDB 4.0开始，对于使用WiredTiger存储引擎的复制集成员，您无法指定`--nojournal`选项或`storage.journal.enabled: false`。
     > - 从MongoDB 4.0开始，对于作为副本集一部分的 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，不能使用--noIndexBuildRetry或storage.indexBuildRetry。

     如果使用[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/)，请更新文件以指定[`sharding.clusterRole: configsvr`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-sharding.clusterRole)、[`replication.replSetName`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-replication.replSetName)、[`net.port`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.port)和[`net.bindIp`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.bindIp)，然后启动4.0二进制文件：

     ```
     sharding:
        clusterRole: configsvr
     replication:
        replSetName: <string>
     net:
        port: <port>
        bindIp: localhost,<hostname(s)|ip address(es)>
     storage:
        dbpath: <path>
     ```

     包括适合您部署的任何其他配置。

     > 笔记：
     >
     > - 从MongoDB 4.0开始，对于使用WiredTiger存储引擎的复制集成员，您无法指定`--nojournal`选项或`storage.journal.enabled: false`。
     > - 从MongoDB 4.0开始，对于作为副本集一部分的 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，不能使用--noIndexBuildRetry或storage.indexBuildRetry。

### 3、升级分片。

一次升级一个分片。

对于每个碎片副本集：

1. 一次升级一个副本的[辅助](https://www.mongodb.com/docs/upcoming/core/replica-set-members/#std-label-replica-set-secondary-members)成员：

   * 关闭[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，并将3.6二进制文件替换为4.0二进制文件。

   * 使用[`--shardsvr`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--shardsvr)、[`--replSet`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--replSet)、[`--port`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--port)和[`--bind_ip`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--bind_ip)选项启动4.0二进制文件。在您的部署中包含任何其他命令行选项：

     > 笔记：
     >
     > - 从MongoDB 4.0开始，对于使用WiredTiger存储引擎的复制集成员，您无法指定`--nojournal`选项或`storage.journal.enabled: false`。
     > - 从MongoDB 4.0开始，对于作为副本集一部分的 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，不能使用--noIndexBuildRetry或storage.indexBuildRetry。

     ```
     mongod --shardsvr --replSet <replSetName> --port <port> --dbpath <path> --bind_ip localhost,<hostname(s)|ip address(es)>
     ```

     如果使用[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/)，请将文件更新为包括[`sharding.clusterRole: shardsvr`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-sharding.clusterRole)、[`replication.replSetName`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-replication.replSetName)、[`net.port`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.port)和[`net.bindIp`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.bindIp)，然后启动4.0二进制文件：

     ```
     sharding:
        clusterRole: shardsvr
     replication:
        replSetName: <string>
     net:
        port: <port>
        bindIp: localhost,<hostname(s)|ip address(es)>
     storage:
        dbpath: <path>
     ```

     包括适合您部署的任何其他配置。

     > 笔记：
     >
     > - 从MongoDB 4.0开始，对于使用WiredTiger存储引擎的复制集成员，您无法指定`--nojournal`选项或`storage.journal.enabled: false`。
     > - 从MongoDB 4.0开始，对于作为副本集一部分的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，不能使用--noIndexBuildRetry或storage.indexBuildRetry。

   * 请等待成员恢复到SECONDARY状态，然后再升级下一个辅助成员。要检查成员的状态，可以在mongo shell中发出 [`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)。

     对每个辅助成员重复。

2. 逐步关闭副本集主副本。

   将一个mongo shell连接到主服务器，并使用 [`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)将主服务器降级，强制选举一个新的主服务器：

   ```
   rs.stepDown()
   ```

3. 当[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)显示初选已下台，而其他成员已处于`PRIMARY`状态时，请升级降级初选：

   * 关闭降级的主制文件，用4.0二进制文件取代[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件。

   * 使用[`--shardsvr`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--shardsvr)、[`--replSet`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--replSet)、[`--port`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--port)和[`--bind_ip`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--bind_ip)选项启动4.0二进制文件。在您的部署中包含任何其他命令行选项：

     ```
     mongod --shardsvr --replSet <replSetName> --port <port> --dbpath <path> --bind_ip localhost,<hostname(s)|ip address(es)>
     ```

     > 笔记：
     >
     > - 从MongoDB 4.0开始，对于使用WiredTiger存储引擎的复制集成员，您无法指定`--nojournal`选项或`storage.journal.enabled: false`。
     > - 从MongoDB 4.0开始，对于作为副本集一部分的 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，不能使用--noIndexBuildRetry或storage.indexBuildRetry。

     如果使用[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/)，请更新文件以指定[`sharding.clusterRole: shardsvr`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-sharding.clusterRole)、[`replication.replSetName`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-replication.replSetName)、[`net.port`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.port)和[`net.bindIp`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.bindIp)，然后启动4.0二进制文件：

     ```
     sharding:
        clusterRole: shardsvr
     replication:
        replSetName: <string>
     net:
        port: <port>
        bindIp: localhost,<hostname(s)|ip address(es)>
     storage:
        dbpath: <path>
     ```

     包括适合您部署的任何其他配置。

     > 笔记：
     >
     > - 从MongoDB 4.0开始，对于使用WiredTiger存储引擎的复制集成员，您无法指定`--nojournal`选项或`storage.journal.enabled: false`。
     > - 从MongoDB 4.0开始，对于作为副本集一部分的 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，不能使用--noIndexBuildRetry或storage.indexBuildRetry。

### 4、升级`mongos`实例。

将每个[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例替换为4.0二进制文件并重新启动。包括适合您部署的任何其他配置。

> 笔记：
>
> 当分片集群成员在不同主机上运行或远程客户端连接到分片集群时，必须指定[`--bind_ip`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--bind_ip)选项。有关更多信息，请参阅[Localhost绑定兼容性更改。](https://www.mongodb.com/docs/upcoming/release-notes/3.6-compatibility/#std-label-3.6-bind_ip-compatibility)

```
mongos --configdb csReplSet/<rsconfigsver1:port1>,<rsconfigsver2:port2>,<rsconfigsver3:port3> --bind_ip localhost,<hostname(s)|ip address(es)>

```

### 5、重新启用平衡器。

使用4.0 mongo shell，连接到集群中的 [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)并运行[`sh.setBalancerState()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.setBalancerState/#mongodb-method-sh.setBalancerState)来重新启用平衡器：

```
sh.setBalancerState(true)
```

3.6和更早版本的mongo shell与4.0集群不兼容。

有关重新启用平衡器的更多信息，请参阅[启用平衡器。](https://www.mongodb.com/docs/upcoming/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-balancing-enable)

### 6、启用向后不兼容的4.0功能。

此时，您可以在没有与3.6不兼容的4.0[功能的情况下](https://www.mongodb.com/docs/upcoming/release-notes/4.0-compatibility/#std-label-4.0-compatibility-enabled)运行4.0二进制文件。

要启用这些4.0功能，请将功能兼容性版本（`FCV`）设置为4.0。

> 提示：
>
> 启用这些向后不兼容的功能可能会使降级过程复杂化，因为在降级之前，您必须删除任何持续存在的向后不兼容的功能。
>
> 建议在升级后，在烧毁期间允许您的部署在不启用这些功能的情况下运行，以确保降级的可能性最小。当您确信降级的可能性很小时，请启用这些功能。

在[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例上，在`admin`数据库中运行[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令：

```
db.adminCommand( { setFeatureCompatibilityVersion: "4.0" } )
```

此命令必须对内部系统集合执行写入。如果由于任何原因命令未能成功完成，您可以安全地在[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)上重试该命令，因为操作是幂等的。

### 7、重新启动`mongos`实例。

更改`featureCompatibilityVersion`后，需要重新启动所有[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例，以接收因果一致性行为的更改。

### 其他升级程序

- 要升级独立设备，请参阅[将独立升级到4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.0-upgrade-standalone/#std-label-4.0-upgrade-standalone)
- 要升级副本集，请参阅[将副本集升级到4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.0-upgrade-replica-set/#std-label-4.0-upgrade-replica-set)





原文 - [Upgrade a Sharded Cluster to 4.0]( https://docs.mongodb.com/manual/release-notes/4.0-upgrade-sharded-cluster/ )

