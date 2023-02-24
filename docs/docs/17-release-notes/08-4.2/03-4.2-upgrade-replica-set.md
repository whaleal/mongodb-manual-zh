# 将副本集升级到4.2

> 重要：
>
> 在尝试任何升级之前，请熟悉本文档的内容。

如果您需要升级到4.2的指导，[MongoDB专业服务](https://www.mongodb.com/products/consulting?tck=docs_server)提供主要版本升级支持，以帮助确保顺利过渡到MongoDB应用程序而不中断。

## 升级建议和核对清单

升级时，请考虑以下几点：

### 升级版本路径

要将现有的MongoDB部署升级到4.2，您必须运行4.0系列版本。

要从4.0系列之前的版本升级，您必须先后升级主要版本，直到升级到4.0系列。例如，如果您运行的是3.6系列，则必须[先升级到4.0](https://www.mongodb.com/docs/upcoming/release-notes/4.0/#std-label-4.0-upgrade)，*然后*才能升级到4.2。

### 检查驱动程序兼容性

在升级MongoDB之前，请检查您是否使用的是与MongoDB 4.2兼容的驱动程序。咨询[驱动程序文档](https://www.mongodb.com/docs/drivers/)供您的特定驱动程序验证与MongoDB 4.2的兼容性。

在不兼容驱动程序上运行的升级部署可能会遇到意外或未定义的行为。

### 准备工作

在开始升级之前，请参阅[MongoDB 4.2中的兼容性更改](https://www.mongodb.com/docs/upcoming/release-notes/4.2-compatibility/)文档，以确保您的应用程序和部署与MongoDB 4.2兼容。在开始升级之前，解决部署中的不兼容性。

在升级MongoDB之前，在将升级部署到生产环境之前，请务必在分期环境中测试您的应用程序。

### 降级注意事项

一旦升级到4.2，如果您需要降级，我们建议[降级](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-replica-set/)到4.0的最新补丁版本。

> 笔记：
>
> **从MongoDB 4.2开始**
>
> colMod命令的noPadding和usePowerOf2Sizes MMAPv1选项已删除。不要使用这些选项，因为从MongoDB 4.0升级到4.2会导致4.2辅助成员立即停止。

## 阅读关注多数（3个成员初级-中级仲裁器架构）

从MongoDB 3.6开始，MongoDB默认支持[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取问题。

您可以禁用读取关注[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)以防止存储缓存压力固定具有主二级仲裁器（PSA）架构的三元副本集或带有三元PSA碎片的分片集群。

> 笔记：
>
> 禁用[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取关注会影响对分片集群[交易](https://www.mongodb.com/docs/upcoming/core/transactions/#std-label-transactions)的支持。具体来说：
>
> * 如果事务涉及已禁用读关注“多数”的碎片，则该事务不能使用读关注“快照”。
> * 如果事务的任何读或写操作涉及到禁用了读关注“多数”的碎片，则写入多个碎片的事务将出错。
>
> 然而，它不影响复制集上的[交易](https://www.mongodb.com/docs/upcoming/core/transactions/#std-label-transactions)。对于副本集上的事务，即使禁用了读取关注[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)您也可以为多文档事务指定读取关注[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)”（或[`"snapshot"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-snapshot/#mongodb-readconcern-readconcern.-snapshot-)或[`"local"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-local/#mongodb-readconcern-readconcern.-local-)”）。
>
> 禁用[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取关注阻止修改索引的[`collMod`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令[回滚](https://www.mongodb.com/docs/upcoming/core/replica-set-rollbacks/#std-label-replica-set-rollbacks)。如果此类操作需要回滚，您必须将受影响的节点与[主](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-primary)节点重新同步。
>
> 禁用[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取关注对更改流的可用性没有影响。
>
> 当升级到4.2并禁用读取关注“多数”时，您可以使用更改流进行部署。

有关更多信息，请参阅[主-二级仲裁器副本集。](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#std-label-disable-read-concern-majority)

### 更改流恢复令牌

MongoDB 4.2使用版本1（即`v1`）更改流[恢复令牌](https://www.mongodb.com/docs/upcoming/changeStreams/#std-label-change-stream-resume-token)，[该令牌](https://www.mongodb.com/docs/upcoming/changeStreams/#std-label-change-stream-resume-token)在版本4.0.7中引入。

恢复令牌`_data`类型取决于MongoDB版本，在某些情况下取决于更改流打开/恢复时的功能兼容性版本（fcv）（即fcv值的更改不会影响已打开的更改流的恢复令牌）：

| MongoDB版本             | 功能兼容性版本 | 恢复令牌`_data`类型    |
| :---------------------- | :------------- | :--------------------- |
| MongoDB 4.2及更高版本   | "4.2"或"4.0"   | 六角编码字符串（`v1`） |
| MongoDB 4.0.7及更高版本 | "4.0"或"3.6"   | 六角编码字符串（`v1`） |
| MongoDB 4.0.6及更早版本 | "4.0"          | 六角编码字符串（`v0`） |
| MongoDB 4.0.6及更早版本 | "3.6"          | BinData                |
| MongoDB 3.6             | "3.6"          | BinData                |

> 重要：
>
> **从MongoDB 4.0.6或更早版本升级到MongoDB 4.2时**
>
> 在升级过程中，当连接到尚未更新（即仅接受`v0`令牌）且失败的成员时，客户端可能会尝试使用新的`v1`恢复令牌恢复更改流。在这种情况下，客户端必须等待4.2升级完成，然后才能恢复更改流。

### 先决条件

## 所有成员版本

所有副本集成员必须运行4.0版本。要将副本集从3.6系列及更早版本升级，请*首先*[将副本集的所有成员升级到最新的4.0系列版本](https://www.mongodb.com/docs/upcoming/release-notes/4.0-upgrade-replica-set/)，然后按照程序从MongoDB 4.0升级到4.2。

## MMAPv1到WiredTiger存储引擎

MongoDB 4.2取消了对已弃用的MMAPv1存储引擎的支持。

如果您的4.0部署使用MMAPv1，则在升级到MongoDB 4.2之前，您必须将4.0部署更改为[WiredTiger存储引擎](https://www.mongodb.com/docs/upcoming/core/wiredtiger/)。有关详细信息，请参阅[将副本设置为WiredTiger。](https://www.mongodb.com/docs/upcoming/tutorial/change-replica-set-wiredtiger/)

## 查看当前配置

使用MongoDB 4.2，[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)进程将不会从[MMAPv1特定配置选项](https://www.mongodb.com/docs/upcoming/release-notes/4.2/#std-label-4.2-mmapv1-conf-options)开始。运行WiredTiger的先前版本的MongoDB忽略了MMAPv1配置选项（如果指定）。使用MongoDB 4.2，您必须从配置中删除这些。

## 功能兼容性版本

4.0副本集必须将`featureCompatibilityVersion`设置为`4.0`。

为了确保副本集的所有成员都将`featureCompatibilityVersion`设置为`4.0`，请连接到每个副本集成员并检查`featureCompatibilityVersion`：

```
db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
```

所有成员都应该返回一个包含`"featureCompatibilityVersion" : { "version" : "4.0" }`的结果。

要设置或更新`featureCompatibilityVersion`，请在主服务器上运行以下命令。大多数数据生成成员必须可用：

```
db.adminCommand( { setFeatureCompatibilityVersion: "4.0" } )
```

有关更多信息，请参阅[`setFeatureCompatibilityVersion`。](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)

### 副本集成员状态

确保没有副本集成员处于[`ROLLBACK`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.ROLLBACK)或[`RECOVERING`](https://www.mongodb.com/docs/upcoming/reference/replica-states/#mongodb-replstate-replstate.RECOVERING)状态。

### 下载4.2 二进制文件

## 通过软件包管理器

如果您从MongoDB `apt`、`yum`、`dnf`或`zypper`存储库安装了MongoDB，则应使用软件包管理器升级到4.2。

按照适用于Linux系统的相应4.2[安装说明](https://www.mongodb.com/docs/upcoming/installation/#std-label-tutorial-installation)进行操作。这将涉及为新版本添加一个存储库，然后执行实际的升级过程。

## 手动

如果您尚未使用软件包管理器安装MongoDB，您可以手动从[MongoDB下载中心](https://www.mongodb.com/download-center?tck=docs_server)。

有关更多信息，请参阅[4.2安装说明](https://www.mongodb.com/docs/upcoming/installation/#std-label-tutorial-installation)。

### 升级流程

您可以使用“滚动”升级从MongoDB 4.0升级到4.2，以便在其他成员可用时单独升级成员，以最大限度地减少停机时间。

#### 1、升级副本集的次要成员。

一次升级一个副本的[辅助](https://www.mongodb.com/docs/upcoming/core/replica-set-members/#std-label-replica-set-secondary-members)成员：

1. 关闭[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，并将4.0二进制文件替换为4.2二进制文件。
2. 重新启动成员。

#### 2、逐步关闭副本集主副本。

将一个mongo shell连接到主服务器，并使用[`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)将主服务器降级，强制选举新的主服务器。

#### 3、升级主服务器。

当[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)显示初选已下台，而其他成员已处于`PRIMARY`状态时，请升级降级初选：

1. 关闭降级主制，用4.2二进制文件替换为[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件。
2. 重新启动成员。

#### 4、启用向后不兼容的4.2功能。

此时，您可以在没有与4.0不兼容的4.2[功能的情况下](https://www.mongodb.com/docs/upcoming/release-notes/4.2-compatibility/#std-label-4.2-compatibility-enabled)运行4.2二进制文件。

要启用这些4.2功能，请将功能兼容性版本（`FCV`）设置为4.2。

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
db.adminCommand( { setFeatureCompatibilityVersion: "4.2" } )
```

此命令必须对内部系统集合执行写入。如果由于任何原因命令未能成功完成，您可以安全地重试主命令，因为操作是幂等的。

### 升级后

**`TLS`选项替换已弃用的`SSL`选项**

从MongoDB 4.2开始，MongoDB不再支持[mongod](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-ssl-mongod-options)、[mongos](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#std-label-mongos-ssl-options)和`mongo` shell的SSL选项以及相应的[`net.ssl` Options](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#std-label-net-ssl-conf-options)配置文件选项。为了避免出现不支持消息，请对 [mongod](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-tls-mongod-options)、 [mongos](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#std-label-mongos-tls-options)和`mongo`使用新的TLS选项。

* 对于命令行TLS选项，请参考[mongod](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-tls-mongod-options), [mongos](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#std-label-mongos-tls-options)和mongo shell页面。
* 有关相应的`mongod`和`mongos`配置文件选项，请参阅[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#std-label-net-tls-conf-options)页面。
* 有关连接字符串`tls`选项，请参阅[连接字符串](https://www.mongodb.com/docs/upcoming/reference/connection-string/#std-label-uri-options-tls)页面。

**4.2+兼容驱动程序默认重试写入**

与MongoDB 4.2及更高版本兼容的驱动程序默认启用[可重试写入](https://www.mongodb.com/docs/upcoming/core/retryable-writes/#std-label-retryable-writes)。较早的驱动程序需要[`retryWrites=true`](https://www.mongodb.com/docs/upcoming/reference/connection-string/#mongodb-urioption-urioption.retryWrites)选项。在使用与MongoDB 4.2及更高版本兼容的驱动程序的应用程序中，可以省略TheretryWrites[`retryWrites=true`](https://www.mongodb.com/docs/upcoming/reference/connection-string/#mongodb-urioption-urioption.retryWrites)选项。

要禁用可重试写入，使用与MongoDB 4.2及更高版本兼容的驱动程序的应用程序必须在连接字符串中包含retryWrites=false。

### 其他升级程序

* 要升级独立设备，请参阅[将独立版升级到4.2。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-upgrade-standalone/#std-label-4.2-upgrade-standalone)
* 要升级分片集群，请参阅[将分片集群升级到4.2。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-upgrade-sharded-cluster/#std-label-4.2-upgrade-sharded-cluster)



参见

原文 - [Upgrade a Replica Set to 4.2]( https://docs.mongodb.com/manual/release-notes/4.2-upgrade-replica-set/ )

