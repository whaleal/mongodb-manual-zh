# 将独立版升级到6.0

在升级到MongoDB 6.0之前，请熟悉本文档的内容，包括彻底审查先决条件。

以下步骤概述了将独立[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)从5.0版本升级到6.0的程序。

如果您需要升级到6.0的指导，[MongoDB专业服务](https://www.mongodb.com/products/consulting?tck=docs_server)提供主要版本升级支持，以帮助确保顺利过渡到MongoDB应用程序而不中断。

## 升级建议和核对清单

升级时，请考虑以下几点：

### 升级版本路径

要将现有的MongoDB部署升级到6.0，您必须运行5.0系列版本。

要从早于5.0系列的版本升级，您必须先后升级主要版本，直到升级到5.0系列。例如，如果您运行的是4.4系列，则必须[先升级到5.0](https://www.mongodb.com/docs/upcoming/release-notes/5.0/#std-label-5.0-upgrade)，*然后*才能升级到6.0。

### 检查驱动程序兼容性

在升级MongoDB之前，请检查您是否使用的是与MongoDB 6.0兼容的驱动程序。咨询[驱动程序文档](https://www.mongodb.com/docs/drivers/)供您的特定驱动程序验证与MongoDB6.0的兼容性。

在不兼容驱动程序上运行的升级部署可能会遇到意外或未定义的行为。

### 准备工作

在开始升级之前，请参阅[MongoDB 6.0中的兼容性更改](https://www.mongodb.com/docs/upcoming/release-notes/6.0-compatibility/)文档，以确保您的应用程序和部署与MongoDB 6.0兼容。在开始升级之前，解决部署中的不兼容性。

在升级MongoDB之前，在将升级部署到生产环境之前，请务必在分期环境中测试您的应用程序。

### 降级注意事项

升级到6.0后，如果您需要降级，我们建议[降级](https://www.mongodb.com/docs/upcoming/release-notes/6.0-downgrade-replica-set/)到5.0的最新补丁版本。

## 先决条件

### 功能兼容性版本

5.0实例必须将`featureCompatibilityVersion`设置为`"5.0"`要检查`featureCompatibilityVersion`：

```
db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
```

该操作应返回一个包含`"featureCompatibilityVersion" : { "version" : "5.0" }`的结果。

要设置或更新`featureCompatibilityVersion`，请运行以下命令：

```
db.adminCommand( { setFeatureCompatibilityVersion: "5.0" } )
```

有关更多信息，请参阅[`setFeatureCompatibilityVersion`。](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)

### 考虑转换为复制集

在升级之前，请考虑[将您的独立部署转换为副本集](https://www.mongodb.com/docs/upcoming/tutorial/convert-standalone-to-replica-set/)。副本集是MongoDB的推荐部署配置。

## 下载6.0 Binaries

### 通过软件包管理器

如果您从MongoDB `apt`、`yum`、`dnf`或`zypper`存储库安装了MongoDB，则应使用软件包管理器升级到6.0。

按照适用于Linux系统的相应[6.0安装说明](https://www.mongodb.com/docs/upcoming/installation/#std-label-tutorial-installation)进行操作。这将涉及为新版本添加一个存储库，然后执行实际的升级过程。

### 手动

如果您尚未使用软件包管理器安装MongoDB，您可以手动从[MongoDB下载中心](https://www.mongodb.com/try/download?tck=docs_server)。

有关更多信息，请参阅[6.0安装说明](https://www.mongodb.com/docs/upcoming/installation/#std-label-tutorial-installation)。

## 升级程序

#### 1、关闭[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例。

要关闭[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)进程，请使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到实例并运行以下命令：

``` 
db.adminCommand( { shutdown: 1 } )
```

#### 2、将5.0二进制文件替换为6.0二进制文件。

确保5.0系列二进制文件在您的系统PATH中。要确认您的二进制版本，请运行以下命令：

```
mongod --version
```

#### 3、启用向后不兼容的6.0功能

此时，您可以在没有与5.0不兼容的6.0[功能的情况下](https://www.mongodb.com/docs/upcoming/release-notes/6.0-compatibility/#std-label-6.0-downgrade-considerations)运行6.0二进制文件。

要启用这些6.0功能，请将功能兼容性版本（`FCV`）设置为6.0。

> 提示：
>
> 启用这些向后不兼容的功能可能会使降级过程复杂化，因为在降级之前，您必须删除任何持续存在的向后不兼容的功能。
>
> 建议在升级后，在烧毁期间允许您的部署在不启用这些功能的情况下运行，以确保降级的可能性最小。当您确信降级的可能性很小时，请启用这些功能。

对`admin`数据库运行[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令：

```
db.adminCommand( { setFeatureCompatibilityVersion: "6.0" } )
```

此命令必须对内部系统集合执行写入。如果由于任何原因命令未能成功完成，您可以安全地重试该命令，因为该操作是幂等的。

## 其他升级程序

- 要升级副本集，请参阅[将副本集升级到6.0。](https://www.mongodb.com/docs/upcoming/release-notes/6.0-upgrade-replica-set/#std-label-6.0-upgrade-replica-set)
- 要升级分片集群，请参阅[将分片集群升级到6.0。](https://www.mongodb.com/docs/upcoming/release-notes/6.0-upgrade-sharded-cluster/#std-label-6.0-upgrade-sharded-cluster)



原文：[Upgrade a Standalone to 6.0](https://www.mongodb.com/docs/upcoming/release-notes/6.0-upgrade-standalone/)