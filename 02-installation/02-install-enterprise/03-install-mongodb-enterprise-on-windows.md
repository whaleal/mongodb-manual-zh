## 在Windows安装MongoDB企业版



> 笔记
>
> **MONGODB ATLAS**
>
> [MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server) 是MongoDB公司提供的MongoDB云服务，无需安装开销，并提供免费的入门套餐。



### 概述

使用本教程使用默认安装向导在 Windows 上安装 MongoDB 7.0企业版。

[MongoDB 企业版](https://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server) 可在选定的平台上使用，并包含对与安全和监控相关的多种功能的支持。

#### MongoDB版本

本教程将安装MongoDB 7.0企业版。要安装其他版本的MongoDB企业版，请使用此页面左上角的版本下拉菜单选择该版本的文档。

####  安装方法

本教程使用默认的 MSI 安装向导在 Windows 上安装 MongoDB。要使用`msiexec.exe` 命令行工具安装 MongoDB，请参阅[使用 msiexec.exe 安装 MongoDB](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-enterprise-on-windows-unattended/#std-label-install-enterprise-windows-msiexec)。该 `msiexec.exe`工具对于希望使用自动化以无人值守的方式部署 MongoDB 的系统管理员非常有用。

### 注意事项

#### MongoDB Shell，`mongosh`

MongoDB shell ([mongosh](https://www.mongodb.com/docs/mongodb-shell/)) 未随 MongoDB Server 一起安装。您需要遵循[mongosh安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)下载并安装 [mongosh](https://www.mongodb.com/docs/mongodb-shell/)分别地。

#### 平台支持

[MongoDB 7.0 企业版支持x86_64](https://www.mongodb.com/docs/v7.0/administration/production-notes/#std-label-prod-notes-supported-platforms-x86_64)架构上的以下 **64 位**版本的 Windows ：

- Windows 服务器 2019
- Windows 10 / Windows Server 2016

MongoDB 仅支持这些平台的 64 位版本。

有关更多信息，请参见[支持的平台](https://docs.mongodb.com/v4.2/administration/production-notes/prod-notes-supported-platforms)。

> 笔记:
>
> 适用于 Linux 的 Windows 子系统 (WSL) 不支持 MongoDB。要在 Linux 上运行 MongoDB，请使用受支持的 Linux 系统。

#### 虚拟化

甲骨文提供[实验支持](https://docs.oracle.com/en/virtualization/virtualbox/6.0/admin/hyperv-support.html) 适用于运行 Hyper-V 的 Windows 主机上的 VirtualBox。不过微软不支持[Hyper-V 上的 VirtualBox 。](https://docs.microsoft.com/en-us/troubleshoot/windows-client/application-management/virtualization-apps-not-work-with-hyper-v)

如果您想使用 VirtualBox 在 Windows 上安装 MongoDB，请禁用 Hyper-V。

#### 制作笔记

在生产环境中部署 MongoDB 之前，请考虑 [生产说明](https://www.mongodb.com/docs/v7.0/administration/production-notes/)文档，其中提供了生产 MongoDB 部署的性能注意事项和配置建议。

#### 全时诊断数据采集

MongoDB 记录诊断数据以帮助排除故障。有关详细信息，请参阅[全时诊断数据捕获。](https://www.mongodb.com/docs/v7.0/administration/analyzing-mongodb-performance/#std-label-ftdc-stub)

在 Windows 上，为了收集磁盘、CPU 和内存等系统数据，FTDC 需要以下组的 Microsoft 访问权限：

- 性能监视器用户
- 性能日志用户

[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)如果正在运行的用户[`mongos`](https://www.mongodb.com/docs/v7.0/reference/program/mongos/#mongodb-binary-bin.mongos)不是管理员，请将其添加到这些组中以记录 FTDC 数据。有关更多信息，请参阅[微软文档在这里](https://learn.microsoft.com/en-us/windows/win32/perfctrs/restricting-access-to-performance-extension--dlls)。

### 安装MongoDB企业版

#### 过程

按照以下步骤使用 Windows 安装向导安装 MongoDB企业版。安装过程会安装 MongoDB 二进制文件以及默认[配置文件](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#std-label-configuration-options) `<install directory>\bin\mongod.cfg`。

##### 1、下载安装程序。

从以下链接下载MongoDB社区安装程序`.msi`：

➤ [MongoDB的下载中心](https://www.mongodb.com/try/download/enterprise?tck=docs_server)

1. 在“ **版本”**下拉列表中，选择要下载的MongoDB版本。
2. 在**平台**下拉菜单中，选择**Windows**。
3. 在**Package**下拉列表中，选择**msi**。
4. 点击**下载**。

##### 2、运行 MongoDB 安装程序。

例如，从 Windows 资源管理器/文件资源管理器：

1. 转到下载 MongoDB 安装程序（`.msi`文件）的目录。默认情况下，这是您的`Downloads`目录。
2. 双击该`.msi`文件。

##### 3、遵循MongoDB企业版安装向导。

该向导将引导您完成MongoDB和MongoDB Compass的安装。

* **选择安装类型**

您可以选择“ **完整”**（建议大多数用户使用）或“ **自定义”**安装类型。“ **完整**设置”选项会将MongoDB和MongoDB工具安装到默认位置。使用“ **自定义** 安装”选项可以指定要安装的可执行文件以及安装位置。

* **服务配置**

从MongoDB 4.0开始，您可以在安装过程中将MongoDB设置为Windows服务，也可以仅安装二进制文件。

- **MongoDB服务**

  * 从MongoDB 4.0开始，您可以在安装过程中将MongoDB配置和启动为Windows服务，并在成功安装后启动MongoDB服务。
    ![Image of the MongoDB Installer wizard - Service Configuration.](https://docs.mongodb.com/v4.2/_images/windows-installer.png)

  * 选择“ **将MongoD作为服务安装”**。

  * 选择以下任一项：

    * **以网络服务用户身份运行服务**（默认）

      这是Windows内置的Windows用户帐户

      **或者**

    * **以本地或域用户身份运行服务**

      * **对于现有本地用户帐户，为帐户域**指定句点（即`.`），并指定用户的**帐户名**和**帐户密码。**
      * 对于现有域用户，指定 该用户的**帐户域**、 **帐户名**和 **帐户密码。**

  * **服务名称**。指定服务名称。默认名称为`MongoDB`。如果您已经具有使用指定名称的服务，则必须选择另一个名称。

  * **数据目录**。指定数据目录，它对应于 [`--dbpath`](https://docs.mongodb.com/v4.2/reference/program/mongod/cmdoption-mongod-dbpath)。如果目录不存在，安装程序将创建该目录并设置对服务用户的目录访问权限。

  * **日志目录**。指定日志目录，它对应于 [`--logpath`](https://docs.mongodb.com/v4.2/reference/program/mongod/cmdoption-mongod-logpath)。如果目录不存在，安装程序将创建该目录并设置对服务用户的目录访问权限。

- **仅安装MongoDB不将 MongoDB 配置为 Windows 服务**

  如果您选择不将 MongoDB 配置为 Windows 服务，请取消选中**Install MongoD as a Service**。

  ![MongoDB 安装程序向导的图像。 不是作为服务。](https://www.mongodb.com/docs/v7.0/images/windows-installer-install-only.png)

* **安装MongoDB Compass**

  *可选*。让向导安装[MongoDB 指南针](https://www.mongodb.com/products/compass)，选择 **安装 MongoDB Compass**（默认）。

* 准备就绪后，点击**安装**。



### 如果您将MongoDB安装为Windows服务

MongoDB 服务在安装成功后启动。使用配置文件配置 MongoDB 实例 `<install directory>\bin\mongod.cfg`。

如果您还没有这样做，请按照 [mongosh安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)下载并安装 MongoDB Shell ([mongosh](https://www.mongodb.com/docs/mongodb-shell/)）。

请务必在安装过程中将二进制文件的路径添加到环境变量`mongosh.exe`中 `PATH`。

打开一个新的**命令解释器**并输入`mongosh.exe` 以连接到 MongoDB。

有关连接的更多信息，请`mongod`使用 [mongosh](https://www.mongodb.com/docs/mongodb-shell/)，例如连接到在不同主机和/或端口上运行的 MongoDB 实例，请参阅 [连接到部署。](https://www.mongodb.com/docs/mongodb-shell/connect/)

有关CRUD（创建，读取，更新，删除）操作的信息，请参阅：

- [插入文档](https://docs.mongodb.com/v4.2/tutorial/insert-documents/)
- [查询文档](https://docs.mongodb.com/v4.2/tutorial/query-documents/)
- [更新文档](https://docs.mongodb.com/v4.2/tutorial/update-documents/)
- [删除文档](https://docs.mongodb.com/v4.2/tutorial/remove-documents/)

#### 如果您没有将MongoDB安装为Windows服务

如果您仅安装了可执行文件而没有将 MongoDB 安装为 Windows 服务，则必须手动启动 MongoDB 实例。

看[从命令解释器启动 MongoDB 企业版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-enterprise-on-windows/#std-label-run-mongodb-enterprise-from-cmd)有关启动 MongoDB 实例的说明。

### 从命令解释器启动MongoDB企业版

#### 1、创建数据库目录。

创建MongoDB存储数据的[数据目录。](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-dbpath)`\data\db`MongoDB 的默认数据目录路径是启动 MongoDB 的驱动器上的绝对路径 。

在**命令解释器中**，创建数据目录：

复制

```
cd C:\
md "\data\db"
```

#### 2、启动您的MongoDB数据库。

要启动MongoDB，请运行[`mongod.exe`](https://docs.mongodb.com/v4.2/reference/program/mongod.exe/bin.mongod.exe)。

复制

```
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="c:\data\db"
```

该[`--dbpath`](https://docs.mongodb.com/v4.2/reference/program/mongod/cmdoption-mongod-dbpath)选项指向您的数据库目录。

如果MongoDB数据库服务器正常运行，则 **命令解释器将**显示：

复制

```
[initandlisten] waiting for connections
```

> 重要
>
> 根据 Windows主机上的 [Windows Defender防火墙](https://docs.microsoft.com/en-us/windows/security/identity-protection/windows-firewall/windows-firewall-with-advanced-security)设置，Windows可能会显示“ **安全警报”**对话框，显示`C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe`的“某些功能” 在网络上进行通信被阻止。要解决此问题：
>
> 1. 点击**专用网络，例如我的家庭或工作网络**。
> 2. 点击**允许访问**。
>
> 要了解有关安全性和MongoDB的更多信息，请参阅“ [安全性文档”](https://docs.mongodb.com/v4.2/security/)。

#### 3、连接到MongoDB。

如果您还没有这样做，请按照 [蒙戈什安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)下载并安装 MongoDB Shell ([蒙戈什](https://www.mongodb.com/docs/mongodb-shell/)）。

请务必在安装过程中将二进制文件的路径添加到环境变量`mongosh.exe`中 `PATH`。

打开一个新的**命令解释器**并输入`mongosh.exe` 以连接到 MongoDB。

有关连接的更多信息，请`mongod`使用 [蒙戈什](https://www.mongodb.com/docs/mongodb-shell/)，例如连接到在不同主机和/或端口上运行的 MongoDB 实例，请参阅 [连接到部署。](https://www.mongodb.com/docs/mongodb-shell/connect/)

有关CRUD（创建，读取，更新，删除）操作的信息，请参阅：

- [插入文档](https://docs.mongodb.com/v4.2/tutorial/insert-documents/)
- [查询文档](https://docs.mongodb.com/v4.2/tutorial/query-documents/)
- [更新文档](https://docs.mongodb.com/v4.2/tutorial/update-documents/)
- [删除文档](https://docs.mongodb.com/v4.2/tutorial/remove-documents/)

###  将MongoDB企业版作为Windows服务启动

从版本7.0开始，您可以在安装过程中将MongoDB安装和配置为 **Windows服务**，并在成功安装后启动MongoDB服务。

要启动/重新启动MongoDB服务，请使用服务控制台：

1. 在服务控制台中，找到MongoDB服务。
2. 右键单击MongoDB服务，然后单击**启动**。

您也可以从命令行手动管理服务。要从命令行启动MongoDB服务，请以**管理员**身份打开[Windows命令提示符/解释器](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/cmd)（`cmd.exe`），然后运行以下命令：

#### 1、启动MongoDB服务。

关闭所有其他命令提示符，然后调用以下命令：

复制

```
net start MongoDB
```

#### 2、验证MongoDB已成功启动。

检查您的MongoDB日志文件是否存在以下行：

```
[initandlisten] waiting for connections on port 27017
```

您可能会在流程输出中看到非严重警告。只要您在 MongoDB 日志中看到此消息，您就可以在初次评估 MongoDB 期间安全地忽略这些警告。

#### 3、连接到MongoDB服务器。

如果您还没有这样做，请按照 [mongosh安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)下载并安装 MongoDB Shell ([mongosh](https://www.mongodb.com/docs/mongodb-shell/)）。

请务必在安装过程中将二进制文件的路径添加到环境变量`mongosh.exe`中 `PATH`。

打开一个新的**命令解释器**并输入`mongosh.exe` 以连接到 MongoDB。



### 将企业版MongoDB作为Windows服务停止

要停止/暂停MongoDB服务，请使用服务控制台：

1. 在服务控制台中，找到MongoDB服务。
2. 右键单击MongoDB服务，然后单击“ **停止”**（或“ **暂停”**）。



您也可以从命令行管理服务。要从命令行停止MongoDB服务，请以**管理员**身份打开[Windows命令提示符/解释器](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/cmd)（`cmd.exe`），然后运行以下命令：

复制

```
net stop MongoDB
```



### 将企业版MongoDB作为Windows服务删除

要删除MongoDB服务，请首先使用服务控制台停止该服务。然后以**管理员**身份打开[Windows命令提示符/解释器](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/cmd) （`cmd.exe`），然后运行以下命令：

复制

```
sc.exe delete MongoDB
```

### 其他注意事项

#### 默认为localhost绑定

默认情况下，MongoDB在启动时将[`bindIp`](https://docs.mongodb.com/v4.2/reference/configuration-options/net.bindIp)设置为 `127.0.0.1`，该绑定到localhost网络接口。这意味着`mongod.exe`只能接受来自同一计算机上运行的客户端的连接。除非将此值设置为有效的网络接口，否则远程客户端将无法连接到`mongod.exe`，并且`mongod.exe`不能初始化[副本集](https://docs.mongodb.com/v4.2/reference/glossary/term-replica-set)。

可以配置以下值：

- 在MongoDB配置文件中使用[`bindIp`](https://docs.mongodb.com/v4.2/reference/configuration-options/net.bindIp)，或
- 通过命令行参数 [`--bind_ip`](https://docs.mongodb.com/v4.2/reference/program/mongod/cmdoption-mongod-bind-ip)

> 警告
>
> 在将实例绑定到可公开访问的 IP 地址之前，您必须保护集群免遭未经授权的访问。有关安全建议的完整列表，请参阅 [安全检查表](https://www.mongodb.com/docs/v7.0/administration/security-checklist/#std-label-security-checklist)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/v7.0/administration/security-checklist/#std-label-checklist-auth)和[强化网络基础设施。](https://www.mongodb.com/docs/v7.0/core/security-hardening/#std-label-network-config-hardening)

有关配置[`bindIp`](https://docs.mongodb.com/v4.2/reference/configuration-options/net.bindIp)的更多信息，请参见 [IP绑定](https://docs.mongodb.com/v4.2/core/security-mongodb-configuration/)。

#### 点发布和`.msi`

如果您使用Windows安装程序（`.msi`）安装了MongoDB ，它将`.msi`在其[发行系列](https://docs.mongodb.com/v4.2/reference/versioning/release-version-numbers)（例如4.2.1到4.2.2）中自动升级。

升级完整版本系列（例如4.0至4.2）需要重新安装。

#### 将MongoDB二进制文件添加到系统路径

本教程中的所有命令行示例都提供了 MongoDB 二进制文件的绝对路径。您可以添加`C:\Program Files\MongoDB\Server\7.0\bin`到您的系统`PATH`，然后省略 MongoDB 二进制文件的完整路径。



原文链接：https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-enterprise-on-windows/

译者：韩鹏帅
