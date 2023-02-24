# 将独立版升级到4.0 

> 重要:
>
> MongoDB 4.0可能会在macOS 10.12.x、10.13.x和10.14.0的不干净关机期间丢失数据。Apple 在 macOS 10.14.1 中修复了这个问题。
>
> 有关详细信息，请参阅[WT-4018。](https://jira.mongodb.org/browse/WT-4018)

以下步骤概述了将独立[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)从3.6版本升级到4.0的程序.

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

一旦升级到4.0，如果您需要降级，我们建议您[降级](https://www.mongodb.com/docs/upcoming/release-notes/4.0-downgrade-standalone/)到最新的3.6补丁版本。

## 先决条件

### 移除对`MONGODB-CR`

从4.0版本开始，MongoDB取消了对已弃用的MongoDB挑战响应（`MONGODB-CR`）身份验证机制的支持。

如果您的部署在`MONGODB-CR`模式中存储了用户凭据，则在升级到4.0版本**之前，**您必须升级到[咸挑战响应身份验证机制（SCRAM](https://www.mongodb.com/docs/upcoming/core/security-scram/#std-label-authentication-scram)）。有关升级到`SCRAM`的信息，请参阅[升级到SCRAM。](https://www.mongodb.com/docs/upcoming/release-notes/3.0-scram/)

> 提示：
>
> 另见：
>
> [MongoDB 4.0中的兼容性变化](https://www.mongodb.com/docs/upcoming/release-notes/4.0-compatibility/)

### 移除对`$isolated`

MongoDB放弃了对`$isolated`运算符的支持。如果您有一个包含`$isolated`运算符的现有部分索引或包含`$isolated`运算符的视图，请在升级之前在定义中重新创建没有运算符的索引或视图。

### 功能兼容性版本

3.6实例必须将 `featureCompatibilityVersion`设置为`3.6`。要检查`featureCompatibilityVersion`：

```
db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
```

该操作应返回一个包含`"featureCompatibilityVersion" : { "version" : "3.6" }`的结果。

要设置或更新`featureCompatibilityVersion`，请运行以下命令:

```
db.adminCommand( { setFeatureCompatibilityVersion: "3.6" } )
```

有关更多信息，请参阅[`setFeatureCompatibilityVersion`。](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)

## 下载4.0 二进制文件

### 通过软件包管理器

如果您从MongoDB `apt`、`yum`、`dnf`或`zypper`存储库安装了MongoDB，则应使用软件包管理器升级到4.0。

按照适当的[4.0 安装说明](https://www.mongodb.com/docs/v4.0/installation/)对于您的Linux系统。这将涉及为新版本添加一个存储库，然后执行实际的升级过程。

### 手动

如果您尚未使用软件包管理器安装MongoDB，您可以从[MongoDB下载中心](https://www.mongodb.com/download-center?tck=docs_server)。

看[4.0 安装说明](https://www.mongodb.com/docs/v4.0/installation/)了解更多信息。

## 升级流程

### 1、用4.0二进制文件替换现有的3.6二进制文件。

关闭您的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例。将现有的二进制文件替换为4.0[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件。

使用4.0 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)重新启动部署[。](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)

### 2、启用向后不兼容的4.0功能。

此时，您可以在没有与3.6不兼容的4.0[功能的情况下](https://www.mongodb.com/docs/upcoming/release-notes/4.0-compatibility/#std-label-4.0-compatibility-enabled)运行4.0二进制文件。

要启用这些4.0功能，请将功能兼容性版本（`FCV`）设置为4.0。

> 提示：
>
> 启用这些向后不兼容的功能可能会使降级过程复杂化，因为在降级之前，您必须删除任何持续存在的向后不兼容的功能。
>
> 建议在升级后，在烧毁期间允许您的部署在不启用这些功能的情况下运行，以确保降级的可能性最小。当您确信降级的可能性很小时，请启用这些功能。

对`admin`数据库运行[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令：

```
db.adminCommand( { setFeatureCompatibilityVersion: "4.0" } ) 
```

此命令必须对内部系统集合执行写入。如果由于任何原因命令未能成功完成，您可以安全地重试该命令，因为该操作是幂等的。







原文 - [Upgrade a Standalone to 4.0]( https://docs.mongodb.com/manual/release-notes/4.0-upgrade-standalone/ )

