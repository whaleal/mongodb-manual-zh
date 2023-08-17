# 将副本集升级到4.4

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

在升级MongoDB之前，请检查您是否使用的是与MongoDB 4.4兼容的驱动程序。咨询[驱动程序文档](https://www.mongodb.com/docs/drivers/)供您的特定驱动程序验证与MongoDB4.4的兼容性。

在不兼容驱动程序上运行的升级部署可能会遇到意外或未定义的行为。

### 准备工作

在开始升级之前，请参阅[MongoDB 4.4中的兼容性更改](https://www.mongodb.com/docs/upcoming/release-notes/4.4-compatibility/)文档，以确保您的应用程序和部署与MongoDB 4.4兼容。在开始升级之前，解决部署中的不兼容性。

在升级MongoDB之前，在将升级部署到生产环境之前，请务必在分期环境中测试您的应用程序。

### 降级注意事项

一旦升级到4.4，如果您需要降级，我们建议[降级](https://www.mongodb.com/docs/upcoming/release-notes/4.4-downgrade-replica-set/)到4.2的最新补丁版本。

> 警告：
>
> **降级**
>
> 如果您需要从4.4版本降级，请降级到4.2.6或更高版本。您无法降级到4.2.5或更早的版本。

## 先决条件

### 所有成员版本

所有副本集成员必须运行4.2版本。要从4.0系列及更早版本升级副本集，请*首先*[将副本集的所有成员升级到最新的4.2系列版本](https://www.mongodb.com/docs/upcoming/release-notes/4.2-upgrade-replica-set/)，然后按照程序从MongoDB 4.2升级到4.4。

### 确认清洁关机

在升级副本集的成员之前，请确认该成员已[完全关闭。](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)

### 功能兼容性版本

4.2副本集必须将`featureCompatibilityVersion`设置为`"4.2"`

为了确保副本集的所有成员都将`featureCompatibilityVersion`设置为`"4.2"`请连接到每个副本集成员并检查`featureCompatibilityVersion`：

```
db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
```

所有成员都应返回包含以下内容的结果

`"featureCompatibilityVersion" : { "version" : "4.2" }`.

要设置或更新`featureCompatibilityVersion`，请在主服务器上运行以下命令。大多数数据生成成员必须可用：

```
db.adminCommand( { setFeatureCompatibilityVersion: "4.2" } )
```

有关更多信息，请参阅[`setFeatureCompatibilityVersion`。](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)

### 副本集成员状态

确保没有副本集成员处于[`ROLLBACK`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)或[`RECOVERING`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)状态。

## 下载4.4二进制文件

### 通过软件包管理器

如果您从MongoDB `apt`、`yum`、`dnf`或`zypper`存储库安装了MongoDB，则应使用软件包管理器升级到4.4。

按照Linux系统的相应[4.4安装说明操作](https://www.mongodb.com/docs/upcoming/installation/#std-label-tutorial-installation)。这将涉及为新版本添加一个存储库，然后执行实际的升级过程。

### 手动

如果您尚未使用软件包管理器安装MongoDB，您可以手动从[MongoDB下载中心](https://www.mongodb.com/try/download?tck=docs_server)。

有关更多信息，请参阅[4.4安装说明](https://www.mongodb.com/docs/upcoming/installation/#std-label-tutorial-installation)。

## 升级流程

您可以使用“滚动”升级从MongoDB 4.2升级到4.4，以便在其他成员可用时单独升级成员，以最大限度地减少停机时间。

#### 1、升级副本集的次要成员。

一次升级一个副本的[辅助](https://www.mongodb.com/docs/upcoming/core/replica-set-members/#std-label-replica-set-secondary-members)成员：

1. 关闭[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，并将4.2二进制文件替换为4.4二进制文件。
2. 重新启动成员。

#### 2、逐步关闭副本集主副本。

将一个mongo shell连接到主服务器，并使用[`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)将主服务器降级，强制选举新的主服务器。

#### 3、升级主服务器。

当[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)显示初选已下台，而其他成员已处于`PRIMARY`状态时，请升级降级初选：

1. 关闭降级主制文件，用4.4二进制文件替换为[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件。
2. 重新启动成员。

#### 4、启用向后不兼容的4.4功能。

此时，您可以在没有与4.2不兼容的4.4[功能的情况下](https://www.mongodb.com/docs/upcoming/release-notes/4.4-compatibility/#std-label-4.4-compatibility-enabled)运行4.4二进制文件。

要启用这些4.4功能，请将功能兼容性版本（`FCV`）设置为4.4。

> 提示：
>
> 启用这些向后不兼容的功能可能会使降级过程复杂化，因为在降级之前，您必须删除任何持续存在的向后不兼容的功能。
>
> 建议在升级后，在烧毁期间允许您的部署在不启用这些功能的情况下运行，以确保降级的可能性最小。当您确信降级的可能性很小时，请启用这些功能。

> 提示：
>
> 确保没有进行初始同步。在初始同步进行时，Running[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令将导致初始同步重新启动。

在主服务器上，在`admin`数据库中运行[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令：

```
db.adminCommand( { setFeatureCompatibilityVersion: "4.4" } )
```

设置[功能兼容性版本（fCV）：“4.4”](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-set-fcv)隐式执行areplSetReconfig，将[`term`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.term)字段添加到配置文档和块中，直到新配置传播到大多数副本集成员。

此命令必须对内部系统集合执行写入。如果由于任何原因命令未能成功完成，您可以安全地重试主命令，因为操作是幂等的。

## 其他升级程序

- 要升级独立设备，请参阅[将独立升级到4.4。](https://www.mongodb.com/docs/upcoming/release-notes/4.4-upgrade-standalone/#std-label-4.4-upgrade-standalone)
- 要升级分片集群，请参阅[将分片集群升级到4.4。](https://www.mongodb.com/docs/upcoming/release-notes/4.4-upgrade-sharded-cluster/#std-label-4.4-upgrade-sharded-cluster)





原文 - [Upgrade a Replica Set to 4.4]( https://docs.mongodb.com/manual/release-notes/4.4-upgrade-replica-set/ )

