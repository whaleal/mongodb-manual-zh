# 将独立机型升级至 4.2

以下步骤概述了将独立[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)从4.0版本升级到4.2的过程。

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

一旦升级到4.2，如果您需要降级，我们建议[降级](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-standalone/)到4.0的最新补丁版本。

## 先决条件

### MMAPv1到WiredTiger存储引擎

MongoDB 4.2取消了对已弃用的MMAPv1存储引擎的支持。

如果您的4.0部署使用MMAPv1，则在升级到MongoDB 4.2之前，您必须将4.0部署更改为[WiredTiger存储引擎](https://www.mongodb.com/docs/upcoming/core/wiredtiger/)。有关详细信息，请参阅[将独立更改为WiredTiger。](https://www.mongodb.com/docs/upcoming/tutorial/change-standalone-wiredtiger/)

### 查看当前配置

使用MongoDB 4.2，[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)进程将不会从[MMAPv1特定配置选项](https://www.mongodb.com/docs/upcoming/release-notes/4.2/#std-label-4.2-mmapv1-conf-options)开始。运行WiredTiger的先前版本的MongoDB忽略了MMAPv1配置选项（如果指定）。使用MongoDB 4.2，您必须从配置中删除这些。

### 功能兼容性版本

4.0实例必须将 `featureCompatibilityVersion`设置为`4.0`。要检查`featureCompatibilityVersion`：

```
db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
```

该操作应返回一个包含`"featureCompatibilityVersion" : { "version" : "4.0" }`的结果。

要设置或更新`featureCompatibilityVersion`，请运行以下命令：

```
db.adminCommand( { setFeatureCompatibilityVersion: "4.0" } )
```

有关更多信息，请参阅[`setFeatureCompatibilityVersion`。](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)

## 下载4.2 二进制文件

### 通过软件包管理器

如果您从MongoDB `apt`、`yum`、`dnf`或`zypper`存储库安装了MongoDB，则应使用软件包管理器升级到4.2。

按照适用于Linux系统的相应4.2[安装说明](https://www.mongodb.com/docs/upcoming/installation/#std-label-tutorial-installation)进行操作。这将涉及为新版本添加一个存储库，然后执行实际的升级过程。

### 手动

如果您尚未使用软件包管理器安装MongoDB，您可以手动从[MongoDB下载中心](https://www.mongodb.com/download-center?tck=docs_server)。

有关更多信息，请参阅[4.2安装说明](https://www.mongodb.com/docs/upcoming/installation/#std-label-tutorial-installation)。

## 升级流程

#### 1、将现有的4.0二进制文件替换为4.2二进制文件。

关闭您的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例。将现有的二进制文件替换为4.2[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件。

使用4.2 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)重新启动部署[。](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)

#### 2、启用向后不兼容的4.2功能。

此时，您可以在没有与4.0不兼容的4.2[功能的情况下](https://www.mongodb.com/docs/upcoming/release-notes/4.2-compatibility/#std-label-4.2-compatibility-enabled)运行4.2二进制文件。

要启用这些4.2功能，请将功能兼容性版本（`FCV`）设置为4.2。

> 提示：
>
> 启用这些向后不兼容的功能可能会使降级过程复杂化，因为在降级之前，您必须删除任何持续存在的向后不兼容的功能。
>
> 建议在升级后，在烧毁期间允许您的部署在不启用这些功能的情况下运行，以确保降级的可能性最小。当您确信降级的可能性很小时，请启用这些功能。

对`admin`数据库运行[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令：

```
db.adminCommand( { setFeatureCompatibilityVersion: "4.2" } ) 
```

此命令必须对内部系统集合执行写入。如果由于任何原因命令未能成功完成，您可以安全地重试该命令，因为该操作是幂等的。

## 升级后

**`TLS`选项替换已弃用的`SSL`选项**

从MongoDB 4.2开始，MongoDB不再支持mongod、mongos和mongo shell的SSL选项以及相应的[`net.ssl` Options](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#std-label-net-ssl-conf-options) 配置文件选项。为了避免出现不支持消息，请对mongod、mongos和mongo使用新的TLS选项。

* 对于命令行TLS选项，请参考[mongod](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-tls-mongod-options), [mongos](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#std-label-mongos-tls-options)和mongo shell页面。
* 有关相应的`mongod`和`mongos`配置文件选项，请参阅[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#std-label-net-tls-conf-options)页面。
* 有关连接字符串`tls`选项，请参阅[连接字符串](https://www.mongodb.com/docs/upcoming/reference/connection-string/#std-label-uri-options-tls)页面。

**4.2+兼容驱动程序默认重试写入**

与MongoDB 4.2及更高版本兼容的驱动程序默认启用[可重试写入](https://www.mongodb.com/docs/upcoming/core/retryable-writes/#std-label-retryable-writes)。较早的驱动程序需要[`retryWrites=true`](https://www.mongodb.com/docs/upcoming/reference/connection-string/#mongodb-urioption-urioption.retryWrites)选项。在使用与MongoDB 4.2及更高版本兼容的驱动程序的应用程序中，可以省略TheretryWrites[`retryWrites=true`](https://www.mongodb.com/docs/upcoming/reference/connection-string/#mongodb-urioption-urioption.retryWrites)选项。

要禁用可重试写入，使用与MongoDB 4.2及更高版本兼容的驱动程序的应用程序必须在连接字符串中包含[`retryWrites=false`](https://www.mongodb.com/docs/upcoming/reference/connection-string/#mongodb-urioption-urioption.retryWrites)。

## 其他升级程序

- 要升级副本集，请参阅[将副本集升级到4.2。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-upgrade-replica-set/#std-label-4.2-upgrade-replica-set)
- 要升级分片集群，请参阅[将分片集群升级到4.2。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-upgrade-sharded-cluster/#std-label-4.2-upgrade-sharded-cluster)





原文 - [Upgrade a Standalone to 4.2]( https://docs.mongodb.com/manual/release-notes/4.2-upgrade-standalone/ )

