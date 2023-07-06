# 将独立版升级到4.4

> 警告：
>
> 将包含MongoDB 3.0元数据的MongoDB 4.2系列部署升级到4.4系列部署时，您必须升级到**MongoDB 4.4.1或更高版本**。您无法成功将包含MongoDB 3.0元数据的部署升级到MongoDB 4.4.0，否则将出现严重的停机风险。
>
> 有关更多信息，请参阅[WT-6623。](https://jira.mongodb.org/browse/WT-6623)

在升级到MongoDB 4.4之前，请熟悉本文档的内容，包括彻底审查先决条件。

以下步骤概述了将独立[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)从4.2版本升级到4.4的程序。

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

一旦升级到4.4，如果您需要降级，我们建议[降级](https://www.mongodb.com/docs/upcoming/release-notes/4.4-downgrade-standalone/)到4.2的最新补丁版本。

> 警告：
>
> **降级**
>
> 如果您需要从4.4版本降级，请降级到4.2.6或更高版本。您无法降级到4.2.5或更早的版本。

## 先决条件

### 确认清洁关机

在升级之前，请确认您的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例已[完全关闭。](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)

### 功能兼容性版本

4.2实例必须将 `featureCompatibilityVersion`设置为`"4.2"`要检查`featureCompatibilityVersion`：

```
db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
```

该操作应返回一个包含`"featureCompatibilityVersion" : { "version" : "4.2" }`的结果。

要设置或更新`featureCompatibilityVersion`，请运行以下命令：

```
db.adminCommand( { setFeatureCompatibilityVersion: "4.2" } )
```

有关更多信息，请参阅[`setFeatureCompatibilityVersion`。](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)

### 考虑转换为复制集

在升级之前，请考虑[将您的独立部署转换为副本集](https://www.mongodb.com/docs/upcoming/tutorial/convert-standalone-to-replica-set/)。副本集是MongoDB的推荐部署配置。

## 下载4.4二进制文件

### 通过软件包管理器

如果您从MongoDB `apt`、`yum`、`dnf`或`zypper`存储库安装了MongoDB，则应使用软件包管理器升级到4.4。

按照Linux系统的相应[4.4安装说明操作](https://www.mongodb.com/docs/upcoming/installation/#std-label-tutorial-installation)。这将涉及为新版本添加一个存储库，然后执行实际的升级过程。

### 手动

如果您尚未使用软件包管理器安装MongoDB，您可以手动从[MongoDB下载中心](https://www.mongodb.com/try/download?tck=docs_server)。

有关更多信息，请参阅[4.4安装说明](https://www.mongodb.com/docs/upcoming/installation/#std-label-tutorial-installation)。

## 升级流程

### 1、将现有的4.2二进制文件替换为4.4二进制文件。

关闭您的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例。将现有的二进制文件替换为4.4[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件。

使用4.4 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)重新启动部署[。](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)

### 2、启用向后不兼容的4.4功能。

此时，您可以在没有与4.2不兼容的4.4[功能的情况下](https://www.mongodb.com/docs/upcoming/release-notes/4.4-compatibility/#std-label-4.4-compatibility-enabled)运行4.4二进制文件。

要启用这些4.4功能，请将功能兼容性版本（`FCV`）设置为4.4。

> 提示：
>
> 启用这些向后不兼容的功能可能会使降级过程复杂化，因为在降级之前，您必须删除任何持续存在的向后不兼容的功能。
>
> 建议在升级后，在烧毁期间允许您的部署在不启用这些功能的情况下运行，以确保降级的可能性最小。当您确信降级的可能性很小时，请启用这些功能。

对`admin`数据库运行[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令：

```
db.adminCommand( { setFeatureCompatibilityVersion: "4.4" } ) 
```

此命令必须对内部系统集合执行写入。如果由于任何原因命令未能成功完成，您可以安全地重试该命令，因为该操作是幂等的。

## 其他升级程序

- 要升级副本集，请参阅[将副本集升级到4.4。](https://www.mongodb.com/docs/upcoming/release-notes/4.4-upgrade-replica-set/#std-label-4.4-upgrade-replica-set)
- 要升级分片集群，请参阅[将分片集群升级到4.4。](https://www.mongodb.com/docs/upcoming/release-notes/4.4-upgrade-sharded-cluster/#std-label-4.4-upgrade-sharded-cluster)





 

原文 - [Upgrade a Standalone to 4.4]( https://docs.mongodb.com/manual/release-notes/4.4-upgrade-standalone/ )

