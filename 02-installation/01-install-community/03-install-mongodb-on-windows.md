## 在Windows上安装MongoDB社区版

在本页面

- [概述]()
- [注意事项]()
- [安装MongoDB社区版]()
- [将MongoDB社区版作为Windows服务运行]()
- [从命令解释器运行MongoDB社区版]()
- [其他注意事项]()



MONGODB ATLAS

[MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server) 是MongoDB公司提供的MongoDB云服务，无需安装开销，并提供免费的入门套餐。



 概述

使用本教程可以使用默认安装向导在Windows上安装MongoDB 7.0社区版。



 MongoDB版本

本教程将安装MongoDB 7.0社区版。要安装其他版本的MongoDB社区，请使用此页面左上角的版本下拉菜单选择该版本的文档。

 安装方法

本教程使用默认的 MSI 安装向导在 Windows 上安装 MongoDB。要使用`msiexec.exe` 命令行工具安装 MongoDB，请参阅[使用 msiexec.exe 安装 MongoDB](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-windows-unattended/#std-label-install-mdb-community-windows-msiexec)。该 `msiexec.exe`工具对于希望使用自动化以无人值守的方式部署 MongoDB 的系统管理员非常有用。



### 注意事项

#### MongoDB Shell，`mongosh`

MongoDB Shell（[mongosh](https://www.mongodb.com/docs/mongodb-shell/)）未随 MongoDB Server 一同安装。你需要按照 [mongosh 安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)单独下载和安装 mongosh。

 平台支持

MongoDB 7.0 社区版在[x86_64](https://docs.mongodb.com/v4.2/administration/production-notes/prod-notes-supported-platforms-x86-64)架构上支持Windows 的以下 **64位**版本 ：

- Windows Server 2019
- Windows 10 / Windows Server 2016

MongoDB仅支持这些平台的64位版本。

有关更多信息，请参见[支持的平台](https://www.mongodb.com/docs/v7.0/administration/production-notes/#std-label-prod-notes-supported-platforms)。

> **笔记:**
>
> 适用于 Linux 的 Windows 子系统 (WSL) 不支持 MongoDB。要在 Linux 上运行 MongoDB，请使用受支持的 Linux 系统。

#### 虚拟化

甲骨文提供[实验支持](https://docs.oracle.com/en/virtualization/virtualbox/6.0/admin/hyperv-support.html) 适用于运行 Hyper-V 的 Windows 主机上的 VirtualBox。不过微软不支持[Hyper-V 上的 VirtualBox 。](https://docs.microsoft.com/en-us/troubleshoot/windows-client/application-management/virtualization-apps-not-work-with-hyper-v)

如果您想使用 VirtualBox 在 Windows 上安装 MongoDB，请禁用 Hyper-V。

#### 生产注意事项

在生产环境中部署 MongoDB 之前，请考虑 [生产说明](https://www.mongodb.com/docs/v7.0/administration/production-notes/)文档，其中提供了生产 MongoDB 部署的性能注意事项和配置建议。

#### 全时诊断数据采集

MongoDB 记录诊断数据以帮助排除故障。有关详细信息，请参阅[全时诊断数据捕获。](https://www.mongodb.com/docs/v7.0/administration/analyzing-mongodb-performance/#std-label-ftdc-stub)

在 Windows 上，为了收集磁盘、CPU 和内存等系统数据，FTDC 需要以下组的 Microsoft 访问权限：

- 性能监视器用户
- 性能日志用户

[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)如果正在运行的用户[`mongos`](https://www.mongodb.com/docs/v7.0/reference/program/mongos/#mongodb-binary-bin.mongos)不是管理员，请将其添加到这些组中以记录 FTDC 数据。有关更多信息，请参阅[微软文档在这里](https://learn.microsoft.com/en-us/windows/win32/perfctrs/restricting-access-to-performance-extension--dlls)。

### 安装 MongoDB 社区版

#### 改成

按照以下步骤使用 MongoDB 安装程序向导安装 MongoDB社区版。安装过程会安装 MongoDB 二进制文件以及默认[配置文件](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#std-label-configuration-options) `<install directory>\bin\mongod.cfg`。

1. 下载安装程序

   从以下链接下载 MongoDB社区安装程序： `.msi`

   * [MongoDB 下载中心](https://www.mongodb.com/try/download/community?tck=docs_server)
     * 在**版本**下拉列表中，选择要下载的 MongoDB 版本。
     * 在**平台**下拉列表中，选择**Windows**。
     * 在**“包”**下拉列表中，选择**msi**。
     * 单击**“下载”**。

2. 运行 MongoDB 安装程序。

   例如，从 Windows 资源管理器/文件资源管理器：

   * 转到下载 MongoDB 安装程序（`.msi`文件）的目录。默认情况下，这是您的`Downloads`目录。
   * 双击该`.msi`文件。

3. 按照 MongoDB Community Edition 安装向导进行操作

   该向导将引导您完成 MongoDB 和 MongoDB Compass 的安装。

   * **选择安装类型**

     可以选择“**完整”**（推荐大多数用户）或**“自定义”**安装类型。**完整**安装选项 将 MongoDB 和 MongoDB 工具安装到默认位置。**自定义**安装选项 允许您指定安装哪些可执行文件以及安装位置。

   * **服务配置**

     从 MongoDB 4.0 开始，您可以在安装过程中将 MongoDB 设置为 Windows 服务，或者只安装二进制文件。

     **以下内容将 MongoDB 安装并配置为 Windows 服务** 

     从 MongoDB 4.0 开始，您可以在安装过程中将 MongoDB 配置为 Windows 服务并将其启动，并在安装成功后启动 MongoDB 服务。

     ![MongoDB 安装程序向导 - 服务配置的图像。](../../images/windows-installer.png)

     * 选择**安装 MongoD 作为服务**MongoDB 作为服务。

     * 选择：

       * **以网络服务用户身份运行服务**（默认）

         这是 Windows 内置的 Windows 用户帐户

         **或者**

       * **以本地或域用户身份运行服务**

         * **对于现有本地用户帐户，为帐户域**指定句点（即`.`），并指定用户的**帐户名**和**帐户密码。**
         * 对于现有域用户，指定 该用户的**帐户域**、 **帐户名**和 **帐户密码。**

     * **服务名称**。指定服务名称。默认名称是`MongoDB`. 如果您已有指定名称的服务，则必须选择其他名称。

     * **数据目录**。指定数据目录，对应于 [`--dbpath`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#std-option-mongod.--dbpath). 如果该目录不存在，安装程序将创建该目录并将目录访问权限设置为服务用户。

     * **日志目录**。指定日志目录，该目录对应于 [`--logpath`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#std-option-mongod.--logpath). 如果该目录不存在，安装程序将创建该目录并将目录访问权限设置为服务用户。

     **以下仅安装 MongoDB，不将 MongoDB 配置为 Windows 服务。**

     如果您选择不将 MongoDB 配置为 Windows 服务，请取消选中**Install MongoD as a Service**。

     ![MongoDB 安装程序向导的图像。 不是作为服务。](../../images/windows-installer-install-only.png)

   * **安装 MongoDB Compass **

     *可选*。让向导安装[MongoDB Compass](https://www.mongodb.com/products/compass)，选择 **安装 MongoDB Compass**（默认）。

   * 准备就绪后，单击**“安装”**。

### 安装`mongosh`

安装程序`.msi`不包括[mongosh](https://www.mongodb.com/docs/mongodb-shell/)。跟着[mongosh安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)单独下载并安装 shell。

### 如果您将 MongoDB 安装为 Windows 服务

MongoDB 服务在安装成功后启动。

如果您想自定义该服务，您必须停止该服务。通过编辑位于 <安装目录>\bin\mongod.cfg 的配置文件来自定义 MongoDB 实例。

有关可用配置选项的信息，请参阅 [配置文件选项。](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#std-label-configuration-options)

进行更改后，[再次启动服务。](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-windows/#std-label-start-mongodb-community-edition-windows-service)

### 如果您没有将 MongoDB 安装为 Windows 服务

如果您仅安装了可执行文件而没有将 MongoDB 安装为 Windows 服务，则必须手动启动 MongoDB 实例。

看[从命令解释器运行 MongoDB 社区版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-windows/#std-label-run-mongodb-from-cmd)有关启动 MongoDB 实例的说明。

## 将 MongoDB 社区版作为 Windows 服务运行

从版本 4.0 开始，您可以在安装过程中将 MongoDB 安装和配置为 **Windows 服务**。MongoDB 服务在安装成功后启动。使用配置文件配置 MongoDB 实例 `<install directory>\bin\mongod.cfg`。

如果您还没有这样做，请按照 [mongosh安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)下载并安装 MongoDB Shell ([mongosh](https://www.mongodb.com/docs/mongodb-shell/)）。

请务必在安装过程中将二进制文件的路径添加到环境变量`mongosh.exe`中 `PATH`。

打开一个新的**命令解释器**并输入`mongosh.exe` 以连接到 MongoDB。

有关连接到[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)使用的 更多信息[mongosh](https://www.mongodb.com/docs/mongodb-shell/)，例如连接到在不同主机和/或端口上运行的 MongoDB 实例，请参阅 [连接到部署。](https://www.mongodb.com/docs/mongodb-shell/connect/)

有关 CRUD（创建、读取、更新、删除）操作的信息，请参阅：

- [插入文档](https://www.mongodb.com/docs/v7.0/tutorial/insert-documents/#std-label-write-op-insert)
- [查询文件](https://www.mongodb.com/docs/v7.0/tutorial/query-documents/#std-label-read-operations-queries)
- [更新文件](https://www.mongodb.com/docs/v7.0/tutorial/update-documents/#std-label-write-op-update)
- [删除文档](https://www.mongodb.com/docs/v7.0/tutorial/remove-documents/#std-label-write-op-delete)

### 将 MongoDB 社区版 作为 Windows 服务启动

要启动/重新启动 MongoDB 服务，请使用服务控制台：

1. 从服务控制台中，找到 MongoDB 服务。
2. 右键单击 MongoDB 服务，然后单击**“启动”**。

### 停止 MongoDB 社区版 作为 Windows 服务

要停止/暂停 MongoDB 服务，请使用服务控制台：

1. 从服务控制台中，找到 MongoDB 服务。
2. 右键单击 MongoDB 服务，然后单击**“停止”**（或**“暂停**”）。

### 删除 MongoDB 社区版 作为 Windows 服务

要删除 MongoDB 服务，请首先使用服务控制台停止该服务。然后打开一个[Windows 命令提示符/解释器](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/cmd)( `cmd.exe`) 以**管理员身份**运行以下命令：

```
sc.exe delete MongoDB
```

## 从命令解释器运行 MongoDB 社区版

您可以从 Windows 命令提示符/解释器 ( `cmd.exe`) 运行 MongoDB社区版，而不是作为服务运行。

打开一个[Windows 命令提示符/解释器](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/cmd) ( `cmd.exe`) 作为**管理员**。

> 重要的:
>
> **您必须以管理员**身份打开命令解释器 。

1、创建数据库目录

创建MongoDB存储数据的[数据目录。](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-dbpath)`\data\db`MongoDB 的默认数据目录路径是启动 MongoDB 的驱动器上的绝对路径 。

从**命令解释器**创建数据目录：

```
cd C:\
md "\data\db"
```

2、启动您的 MongoDB 数据库。

要启动 MongoDB，请运行[`mongod.exe`.](https://www.mongodb.com/docs/v7.0/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)

```
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="c:\data\db"
```

该[`--dbpath`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#std-option-mongod.--dbpath)选项指向您的数据库目录。

如果 MongoDB 数据库服务器运行正常， **命令解释器**将显示：

```
[initandlisten] waiting for connections
```

> 重要的
>
> 取决于 [Windows Defender 防火墙](https://docs.microsoft.com/en-us/windows/security/identity-protection/windows-firewall/windows-firewall-with-advanced-security) 在 Windows 主机上进行设置时，Windows 可能会显示一个 **安全警报**对话框，阻止“某些功能”`C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe` 在网络上进行通信。要解决此问题：
>
> 1. 单击**专用网络，例如我的家庭或工作网络**。
> 2. 单击**“允许访问”**。
>
> 要了解有关安全性和 MongoDB 的更多信息，请参阅 [安全文档](https://www.mongodb.com/docs/v7.0/security/#std-label-security)

3、连接到 MongoDB

如果您还没有这样做，请按照 [mongosh安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)下载并安装 MongoDB Shell ([mongosh](https://www.mongodb.com/docs/mongodb-shell/)）。

请务必在安装过程中将二进制文件的路径添加到环境变量`mongosh.exe`中 `PATH`。

打开一个新的**命令解释器**并输入`mongosh.exe` 以连接到 MongoDB。

有关连接的更多信息，请`mongod`使用 [mongosh](https://www.mongodb.com/docs/mongodb-shell/)，例如连接到在不同主机和/或端口上运行的 MongoDB 实例，请参阅 [连接到部署。](https://www.mongodb.com/docs/mongodb-shell/connect/)

有关 CRUD（创建、读取、更新、删除）操作的信息，请参阅：

- [插入文档](https://www.mongodb.com/docs/v7.0/tutorial/insert-documents/)
- [查询文件](https://www.mongodb.com/docs/v7.0/tutorial/query-documents/)
- [更新文件](https://www.mongodb.com/docs/v7.0/tutorial/update-documents/)
- [删除文档](https://www.mongodb.com/docs/v7.0/tutorial/remove-documents/)

### 其他注意事项

#### 默认为localhost绑定

默认情况下，MongoDB在启动时将[`bindIp`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-net.bindIp)设置为 `127.0.0.1`，绑定到localhost网络接口。这意味着`mongod.exe`只能接受来自同一计算机上运行的客户端的连接。除非将此值设置为有效的网络接口，否则远程客户端将无法连接到`mongod.exe`，并且`mongod.exe`不能初始化[副本集](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-replica-set)。

可以配置以下值：

- 在MongoDB配置文件中使用[`bindIp`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-net.bindIp)，或
- 通过命令行参数 [`--bind_ip`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#std-option-mongod.--bind_ip)

> 警告
>
> 绑定到非本地主机（例如，可公共访问）的IP地址之前，请确保已保护群集免受未经授权的访问。有关安全建议的完整列表，请参阅“ [安全清单”](https://www.mongodb.com/docs/v7.0/administration/security-checklist/#std-label-security-checklist)。至少应考虑 [启用身份验证](https://www.mongodb.com/docs/v7.0/administration/security-checklist/#std-label-checklist-auth)并 [增强网络基础架构](https://www.mongodb.com/docs/v7.0/core/security-hardening/#std-label-network-config-hardening)。
>
> 有关配置[`bindIp`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-net.bindIp)的更多信息，请参见 [IP绑定](https://www.mongodb.com/docs/v7.0/core/security-mongodb-configuration/)。

#### 版本发布和 `.msi`

如果您使用Windows安装程序（`.msi`） 安装了MongoDB，`.msi`将在其[发行系列](https://www.mongodb.com/docs/v7.0/reference/versioning/#std-label-release-version-numbers)（例如4.2.1到4.2.2）中自动升级。

升级完整版本系列（例如4.0至4.2）需要重新安装。

#### 将MongoDB二进制文件添加到系统路径

如果添加`C:\Program Files\MongoDB\Server\7.0\bin`到系统中`PATH`，您可以省略 MongoDB 服务器二进制文件的完整路径。您还应该添加路径[mongosh](https://www.mongodb.com/docs/mongodb-shell/)如果您还没有这样做。
