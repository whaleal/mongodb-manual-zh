# 将独立版升级到5.0

在升级到MongoDB 5.0之前，请熟悉本文档的内容，包括彻底审查先决条件。

以下步骤概述了将独立[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)从4.4版本升级到5.0的程序。

如果您需要升级到5.0的指导，[MongoDB专业服务](https://www.mongodb.com/products/consulting?tck=docs_server)提供主要版本升级支持，以帮助确保顺利过渡到MongoDB应用程序而不中断。

## 升级建议和核对清单

升级时，请考虑以下几点：

### 升级版本路径

要将现有的MongoDB部署升级到5.0，您必须运行4.4系列版本。

要从4.4系列之前的版本升级，您必须先后升级主要版本，直到升级到4.4系列。例如，如果您运行的是4.2系列，则必须[先升级到4.4](https://www.mongodb.com/docs/upcoming/release-notes/4.4/#std-label-4.4-upgrade)，*然后*才能升级到5.0。

### 检查驱动程序兼容性

在升级MongoDB之前，请检查您是否使用的是与MongoDB 5.0兼容的驱动程序。咨询[驱动程序文档](https://www.mongodb.com/docs/drivers/)供您的特定驱动程序验证与MongoDB 5.0的兼容性。

在不兼容驱动程序上运行的升级部署可能会遇到意外或未定义的行为。

### 准备工作

在开始升级之前，请参阅[MongoDB 5.0中的兼容性更改](https://www.mongodb.com/docs/upcoming/release-notes/5.0-compatibility/)文档，以确保您的应用程序和部署与MongoDB 5.0兼容。在开始升级之前，解决部署中的不兼容性。

在升级MongoDB之前，在将升级部署到生产环境之前，请务必在分期环境中测试您的应用程序。

### 降级注意事项

一旦升级到5.0，如果您需要降级，我们建议您[降级](https://www.mongodb.com/docs/upcoming/release-notes/5.0-downgrade-standalone/)到4.4的最新补丁版本。

## 先决条件

### 确保 TTL 配置有效

确保TTL配置有效。升级之前，请删除或更正expireAfterSeconds设置为NaN的所有TTL索引。在MongoDB 5.0和更高版本中，将expireAfterSeconds设置为NaN与将expireAfterSeconds设置为0具有相同的效果。有关详细信息，请参见 [TTL `expireAfterSeconds`Behavior When Set to `NaN`.](https://www.mongodb.com/docs/upcoming/release-notes/5.0-compatibility/#std-label-ttl_expireAfterSeconds_behavior)

### 确认清洁关机

在升级之前，请确认您的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例已[完全关闭。](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)

### 功能兼容性版本

4.4实例必须将 `featureCompatibilityVersion`设置为`"4.4"`要检查`featureCompatibilityVersion`：

```
db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
```

该操作应返回一个包含`"featureCompatibilityVersion" : { "version" : "4.4" }`的结果。

要设置或更新`featureCompatibilityVersion`，请运行以下命令：

```
db.adminCommand( { setFeatureCompatibilityVersion: "4.4" } )
```

有关更多信息，请参阅[`setFeatureCompatibilityVersion`。](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)

### 考虑转换为复制集

在升级之前，请考虑[将您的独立部署转换为副本集](https://www.mongodb.com/docs/upcoming/tutorial/convert-standalone-to-replica-set/)。副本集是MongoDB的推荐部署配置。

## 下载5.0 二进制包

### 通过软件包管理器

如果您从MongoDB `apt`、`yum`、`dnf`或`zypper`存储库安装了MongoDB，则应使用软件包管理器升级到5.0。

按照Linux系统的相应[5.0安装说明](https://www.mongodb.com/docs/upcoming/installation/#std-label-tutorial-installation)进行操作。这将涉及为新版本添加一个存储库，然后执行实际的升级过程。

### 手动[![img](https://www.mongodb.com/docs/upcoming/assets/link.svg)](https://www.mongodb.com/docs/upcoming/release-notes/5.0-upgrade-standalone/#manually)

如果您尚未使用软件包管理器安装MongoDB，您可以手动从[MongoDB下载中心](https://www.mongodb.com/try/download?tck=docs_server)。

有关更多信息，请参阅[5.0安装说明](https://www.mongodb.com/docs/upcoming/installation/#std-label-tutorial-installation)。

## 升级流程

#### 1、将现有的4.4二进制文件替换为5.0二进制文件

关闭您的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例。将现有的二进制文件替换为5.0[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件。

使用5.0 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)重新启动部署[。](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)

#### 2、启用向后不兼容的5.0功能。

此时，您可以在没有与4.4不兼容的5.0[功能的情况下](https://www.mongodb.com/docs/upcoming/release-notes/5.0-compatibility/#std-label-5.0-compatibility-enabled)运行5.0二进制文件。

要启用这些5.0功能，请将功能兼容性版本（`FCV`）设置为5.0。

> 提示：
>
> 启用这些向后不兼容的功能可能会使降级过程复杂化，因为在降级之前，您必须删除任何持续存在的向后不兼容的功能。
>
> 建议在升级后，在烧毁期间允许您的部署在不启用这些功能的情况下运行，以确保降级的可能性最小。当您确信降级的可能性很小时，请启用这些功能。

对`admin`数据库运行[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令：

```
db.adminCommand( { setFeatureCompatibilityVersion: "5.0" } ) 
```

此命令必须对内部系统集合执行写入。如果由于任何原因命令未能成功完成，您可以安全地重试该命令，因为该操作是幂等的。

## 其他升级程序

- 要升级副本集，请参阅[将副本集升级到5.0。](https://www.mongodb.com/docs/upcoming/release-notes/5.0-upgrade-replica-set/#std-label-5.0-upgrade-replica-set)
- 要升级分片集群，请参阅[将分片集群升级到5.0。](https://www.mongodb.com/docs/upcoming/release-notes/5.0-upgrade-sharded-cluster/#std-label-5.0-upgrade-sharded-cluster)



原文：[Upgrade a Standalone to 5.0](https://www.mongodb.com/docs/upcoming/release-notes/5.0-upgrade-standalone/)