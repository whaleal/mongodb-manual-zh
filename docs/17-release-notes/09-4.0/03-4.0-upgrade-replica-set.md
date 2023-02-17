 

# 将副本集升级到4.0

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

升级时，请考虑以下几点：

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

一旦升级到4.0，如果您需要降级，我们建议您[降级](https://www.mongodb.com/docs/upcoming/release-notes/4.0-downgrade-replica-set/)到最新的3.6补丁版本。

## 初始同步

在开始升级之前，请确保没有进行初始同步。在初始同步进行期间执行升级将导致初始同步重新启动。

## 默认绑定到Localhost

重新启动副本集时，以下过程包括命令行选项[`--bind_ip`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--bind_ip)或配置选项[`net.bindIp`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.bindIp)。

从MongoDB 3.6开始，当副本集成员在不同主机上运行或远程客户端连接到部署时，必须指定选项。省略所有成员是否在同一主机上运行，并且所有客户端都是主机的本地。

> 警告：
>
> 在绑定到非本地主机（例如可公开访问）IP地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅[安全清单](https://www.mongodb.com/docs/upcoming/administration/security-checklist/)。至少，考虑[启用身份验证](https://www.mongodb.com/docs/upcoming/administration/security-checklist/#std-label-checklist-auth)和[强化网络基础设施。](https://www.mongodb.com/docs/upcoming/core/security-hardening/)

## 阅读关注多数（3个成员初级-中级仲裁器架构）

从MongoDB 3.6开始，MongoDB默认支持[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取问题。

从3.6.1和MongoDB 4.0.3开始，您可以禁用读取关注[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)以防止存储缓存压力固定具有主二级仲裁器（PSA）架构的三成员副本集或带有三成员PSA碎片的分片集群的部署。

禁用[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取关注对更改流的可用性没有影响。

有关更多信息，请参阅[主-二级仲裁器副本集。](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#std-label-disable-read-concern-majority)

## 更改流恢复令牌

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
> **从MongoDB 3.6升级到MongoDB 4.0.7或更高版本时**
>
> 从MongoDB 3.6升级到MongoDB 4.0.7或更高版本时，当连接到尚未更新的成员（即仅接受BinData恢复令牌）并失败时，客户端可能会尝试使用新的`v1`恢复令牌恢复更改流。在这种情况下，客户端必须等待升级完成，然后才能恢复更改流。
>
> 升级后，如果您后来决定降级到MongoDB 3.6，重新恢复更改流，客户端可以在3.6部署上使用预升级的简历令牌（如果有）。否则，客户将需要启动新的更改流。

### 先决条件

## 所有成员版本

所有副本集成员必须运行3.6版本。要从3.4系列及更早版本升级副本集，请*首先*[将副本集的所有成员升级到最新的3.6系列版本](https://www.mongodb.com/docs/upcoming/release-notes/3.6-upgrade-replica-set/)，然后按照程序从MongoDB 3.6升级到4.0。

## 移除对`MONGODB-CR`

从4.0版本开始，MongoDB取消了对已弃用的MongoDB挑战响应（`MONGODB-CR`）身份验证机制的支持。

如果您的部署在`MONGODB-CR`模式中存储了用户凭据，则在升级到4.0版本**之前，**您必须升级到[咸挑战响应身份验证机制（SCRAM](https://www.mongodb.com/docs/upcoming/core/security-scram/#std-label-authentication-scram)）。有关升级到`SCRAM`的信息，请参阅[升级到SCRAM。](https://www.mongodb.com/docs/upcoming/release-notes/3.0-scram/)

> 提示：
>
> 另见：
>
> [MongoDB 4.0中的兼容性变化](https://www.mongodb.com/docs/upcoming/release-notes/4.0-compatibility/)

## 删除复制集的`pv0`

从4.0版本开始，MongoDB删除了已弃用的副本集协议版本0 `pv0`。

在升级到MongoDB 4.0之前，您必须升级到[`pv1`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.protocolVersion)。

要升级到pv1，请将mongo shell连接到副本集主副本，并执行以下操作序列：

```
cfg = rs.conf();
cfg.protocolVersion=1;
rs.reconfig(cfg);
```

为了减少[`w:1`](https://www.mongodb.com/docs/upcoming/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)回滚的可能性，您还可以将副本集重新配置为更高的[`settings.catchUpTimeoutMillis`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.catchUpTimeoutMillis)设置。

有关`pv1`的更多信息，请参阅[Replica Set协议版本。](https://www.mongodb.com/docs/upcoming/reference/replica-set-protocol-versions/)

## 删除主从复制

MongoDB 4.0取消了对已弃用的主从复制的支持。在升级到MongoDB 4.0之前，如果您的部署使用主从复制，则必须升级到副本集。

要从主从复制转换为副本集，请参阅[将主从部署转换为副本集。](https://www.mongodb.com/docs/v4.0/core/master-slave/)

## 移除对`$isolated`

MongoDB放弃了对`$isolated`运算符的支持。如果您有一个包含`$isolated`运算符的现有部分索引或包含`$isolated`运算符的视图，请在升级之前在定义中重新创建没有运算符的索引或视图。

## 功能兼容性版本

3.6副本集必须将`featureCompatibilityVersion`设置为`3.6`。

为了确保副本集的所有成员都将`featureCompatibilityVersion`设置为`3.6`，请连接到每个副本集成员并检查`featureCompatibilityVersion`：

```
db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
```

所有成员都应该返回一个包含`"featureCompatibilityVersion" : { "version" : "3.6" }`的结果。

要设置或更新`featureCompatibilityVersion`，请在主服务器上运行以下命令。大多数数据生成成员必须可用：

```
db.adminCommand( { setFeatureCompatibilityVersion: "3.6" } )
```

有关更多信息，请参阅[`setFeatureCompatibilityVersion`。](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)

### 副本集成员状态

确保没有副本集成员处于[`ROLLBACK`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)或[`RECOVERING`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)状态。

### 下载4.0 二进制文件

## 通过软件包管理器

如果您从MongoDB `apt`、`yum`、`dnf`或`zypper`存储库安装了MongoDB，则应使用软件包管理器升级到4.0。

按照适当的[4.0 安装说明](https://www.mongodb.com/docs/v4.0/installation/)对于您的Linux系统。这将涉及为新版本添加一个存储库，然后执行实际的升级过程。

## 手动

如果您尚未使用软件包管理器安装MongoDB，您可以从[MongoDB下载中心](https://www.mongodb.com/download-center?tck=docs_server)。

看[4.0 安装说明](https://www.mongodb.com/docs/v4.0/installation/)了解更多信息。

### 升级流程

您可以使用“滚动”升级从MongoDB 3.6升级到4.0，以便在其他成员可用时单独升级成员，以最大限度地减少停机时间。

### 1、升级副本集的次要成员。

一次升级一个副本的[辅助](https://www.mongodb.com/docs/upcoming/core/replica-set-members/#std-label-replica-set-secondary-members)成员：

1. 关闭[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，并将3.6二进制文件替换为4.0二进制文件。

2. 重新启动成员。

   > 笔记：
   >
   > * 从MongoDB 4.0开始，对于使用WiredTiger存储引擎的复制集成员，您无法指定`--nojournal`选项或`storage.journal.enabled: false`。
   > * 从MongoDB 4.0开始，对于作为副本集一部分的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，不能使用`--noIndexBuildRetry`或`storage.indexBuildRetry`。

### 2、逐步降低副本集主

将一个mongo shell连接到主服务器，并使用 [`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown) 将主服务器降级，强制选举新的主服务器。

### 3、升级主服务器。

当[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)显示初选已下台，而其他成员已处于`PRIMARY`状态时，请升级降级初选：

1. 关闭降级的主制文件，用4.0二进制文件取代[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件。

2. 重新启动成员。

   > * 从MongoDB 4.0开始，对于使用WiredTiger存储引擎的复制集成员，您无法指定`--nojournal`选项或`storage.journal.enabled: false`
   >
   > * 从MongoDB 4.0开始，对于作为副本集一部分的mongod实例，不能使用--noIndexBuildRetry或storage.indexBuildRetry。

### 4、启用向后不兼容的4.0功能

此时，您可以在没有与3.6不兼容的4.0[功能的情况下](https://www.mongodb.com/docs/upcoming/release-notes/4.0-compatibility/#std-label-4.0-compatibility-enabled)运行4.0二进制文件。

要启用这些4.0功能，请将功能兼容性版本（`FCV`）设置为4.0。

> 提示：
>
> 启用这些向后不兼容的功能可能会使降级过程复杂化，因为在降级之前，您必须删除任何持续存在的向后不兼容的功能。
>
> 建议在升级后，在烧毁期间允许您的部署在不启用这些功能的情况下运行，以确保降级的可能性最小。当您确信降级的可能性很小时，请启用这些功能。

> 提示：
>
> 确保没有进行初始同步。当初始同步正在进行时，Running[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令将导致初始同步重新启动。

在主服务器上，在`admin`数据库中运行[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令：

```
db.adminCommand( { setFeatureCompatibilityVersion: "4.0" } )
```

此命令必须对内部系统集合执行写入。如果由于任何原因命令未能成功完成，您可以安全地重试主命令，因为操作是幂等的。







原文 - [Upgrade a Replica Set to 4.0]( https://docs.mongodb.com/manual/release-notes/4.0-upgrade-replica-set/ )

