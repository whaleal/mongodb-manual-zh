# 在 Windows 上使用安装 MongoDB Community`msiexec.exe`



> 笔记:
>
> **MongoDB Atlas**
>
> [MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server) 是云中托管的 MongoDB 服务选项，无需安装开销，并提供免费套餐以供入门。

### 概述

使用本教程以无人值守的方式从命令行在 Windows 上安装 MongoDB 7.0 社区版 。`msiexec.exe`这对于希望使用自动化部署 MongoDB 的系统管理员很有用。

#### MongoDB 版本

本教程安装 MongoDB 7.0  社区版。要安装不同版本的 MongoDB  社区，请使用此页面左上角的版本下拉菜单选择该版本的文档。

#### 安装方法

本教程使用命令行工具在 Windows 上安装 MongoDB `msiexec.exe`。要改为使用图形 MSI 安装程序[安装 MongoDB，请参阅使用 MSI 安装程序安装 MongoDB 。](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/)

### 注意事项

#### MongoDB shell，`mongosh`

MongoDB 外壳 ([mongosh](https://www.mongodb.com/docs/mongodb-shell/)) 未与 MongoDB 服务器一起安装。您需要遵循[mongosh安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)下载并安装 [mongosh](https://www.mongodb.com/docs/mongodb-shell/)分别地。

#### 平台支持

[MongoDB 7.0 社区版 在x86_64](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-x86_64)架构上支持以下 **64 位**版本的 Windows ：

- Windows 服务器 2019
- Windows 10 / Windows 服务器 2016

MongoDB 仅支持这些平台的 64 位版本。

有关详细信息，请参阅[平台支持](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms)。

>  笔记
>
> 适用于 Linux 的 Windows 子系统 (WSL) 不支持 MongoDB。要在 Linux 上运行 MongoDB，请使用受支持的 Linux 系统

#### 虚拟化

甲骨文提供[实验支持](https://docs.oracle.com/en/virtualization/virtualbox/6.0/admin/hyperv-support.html) 适用于运行 Hyper-V 的 Windows 主机上的 VirtualBox。不过微软不支持[Hyper-V 上的 VirtualBox 。](https://docs.microsoft.com/en-us/troubleshoot/windows-client/application-management/virtualization-apps-not-work-with-hyper-v)

如果您想使用 VirtualBox 在 Windows 上安装 MongoDB，请禁用 Hyper-V。

#### 制作说明

在生产环境中部署 MongoDB 之前，请考虑 [生产说明](https://www.mongodb.com/docs/manual/administration/production-notes/)文档，其中提供了生产 MongoDB 部署的性能注意事项和配置建议。

#### 全时诊断数据采集

MongoDB 记录诊断数据以帮助排除故障。有关详细信息，请参阅[全时诊断数据捕获。](https://www.mongodb.com/docs/v7.0/administration/analyzing-mongodb-performance/#std-label-ftdc-stub)

在 Windows 上，为了收集磁盘、CPU 和内存等系统数据，FTDC 需要以下组的 Microsoft 访问权限：

- 性能监视器用户
- 性能日志用户

[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)如果正在运行的用户[`mongos`](https://www.mongodb.com/docs/v7.0/reference/program/mongos/#mongodb-binary-bin.mongos)不是管理员，请将其添加到这些组中以记录 FTDC 数据。有关更多信息，请参阅[微软文档在这里](https://learn.microsoft.com/en-us/windows/win32/perfctrs/restricting-access-to-performance-extension--dlls)。

### 安装 MongoDB 社区版

### 程序

按照以下步骤在 Windows 上以无人值守的方式安装 MongoDB 社区版[ Windows 命令提示符/解释器](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/cmd)( `cmd.exe`) 使用`msiexec.exe`。

#### 1、下载安装程序。

从以下链接下载 MongoDB社区 `.msi`安装程序：

➤ [MongoDB 下载中心](https://www.mongodb.com/try/download/community?tck=docs_server)

1. 在**版本**下拉列表中，选择要下载的 MongoDB 版本。
2. 在**平台**下拉列表中，选择**Windows**。
3. 在**包**下拉列表中，选择**msi**。
4. 单击**下载**。

#### 2、从 Windows 命令解释器运行 Windows Installer。

> 重要
>
> **您必须以管理员**身份打开命令解释器 。

使用`.msi`安装程序安装所有 MongoDB 二进制文件，包括 [MongoDB Compass。](https://www.mongodb.com/products/compass)

从命令解释器，转到包含 `.msi`安装二进制文件的目录并运行：

```
msiexec.exe /l*v mdbinstall.log  /qb /i mongodb-windows-x86_64-7.0-signed.msi
```



该操作将二进制文件安装到默认目录 `C:\Program Files\MongoDB\Server\7.0\bin`。

要为可执行文件指定不同的安装位置，请添加该`INSTALLLOCATION`值。

```
msiexec.exe /l*v mdbinstall.log  /qb /i mongodb-windows-x86_64-7.0-signed.msi ^
            INSTALLLOCATION="C:\MongoDB\Server\7.0\"
```

抑制安装[MongoDB Compass](https://www.mongodb.com/docs/compass/current/#std-label-compass-index)，您必须明确包含 `SHOULD_INSTALL_COMPASS="0"`参数。

```
msiexec.exe /l*v mdbinstall.log  /qb /i mongodb-windows-x86_64-7.0-signed.msi ^
            SHOULD_INSTALL_COMPASS="0"
```

`ADDLOCAL`要安装特定的 MongoDB 组件集，您可以使用逗号分隔的列表在参数中指定它们，其中包括以下一个或多个组件集：

| 组件集名称           | 组件集中包含的二进制文件                                     |
| :------------------- | :----------------------------------------------------------- |
| `ServerNoService`    | [`mongod.exe`](https://www.mongodb.com/docs/v7.0/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) |
| `ServerService`      | 设置[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)为 Windows 服务。 |
| `Router`             | [`mongos.exe`](https://www.mongodb.com/docs/v7.0/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe) |
| `MonitoringTools`    | [`mongostat.exe`](https://www.mongodb.com/docs/database-tools/mongostat/#mongodb-binary-bin.mongostat), [`mongotop.exe`](https://www.mongodb.com/docs/database-tools/mongotop/#mongodb-binary-bin.mongotop) |
| `ImportExportTools`  | [`mongodump.exe`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump), [`mongorestore.exe`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore), [`mongoexport.exe`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport), [`mongoimport.exe`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport) |
| `MiscellaneousTools` | `mongodecrypt.exe`, [`mongokerberos.exe`](https://www.mongodb.com/docs/v7.0/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos), [`mongoldap.exe`](https://www.mongodb.com/docs/v7.0/reference/program/mongoldap/#mongodb-binary-bin.mongoldap) |

例如，要使用[`mongod.exe`](https://www.mongodb.com/docs/v7.0/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)旧版`mongo` 客户端安装 MongoDB 服务器 ( )，然后将 MongoDB 服务器设置为 Windows 服务，请运行：

```
msiexec.exe /l*v mdbinstall.log  /qb /i mongodb-windows-x86_64-7.0-signed.msi ^
            ADDLOCAL="ServerService,LegacyClient" ^
            SHOULD_INSTALL_COMPASS="0"
```



要在安装中包含 Compass，请删除`SHOULD_INSTALL_COMPASS="0"`.

### 从命令解释器启动 MongoDB 社区版

打开一个[Windows 命令提示符/解释器](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/cmd)( `cmd.exe`) 作为**管理员**。

>  重要
>
> **您必须以管理员**身份打开命令解释器 。

#### 1、创建数据库目录。

创建MongoDB 存储数据的[数据目录。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-dbpath)`\data\db`MongoDB 的默认数据目录路径是您启动 MongoDB 的驱动器上的绝对路径 。

从**命令解释器**创建数据目录：

```
cd C:\
md "\data\db"
```

#### 2、启动您的 MongoDB 数据库。

要启动 MongoDB，请运行[`mongod.exe`.](https://www.mongodb.com/docs/v7.0/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe)

```
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="c:\data\db"
```



该[`--dbpath`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)选项指向您的数据库目录。

如果 MongoDB 数据库服务器运行正常， **命令解释器**会显示：

```
[initandlisten] waiting for connections
```

> 重要的
>
> 取决于 [Windows Defender 防火墙](https://docs.microsoft.com/en-us/windows/security/identity-protection/windows-firewall/windows-firewall-with-advanced-security) Windows 主机上的设置，Windows 可能会显示一个 关于阻止“某些功能” 在网络上通信的**安全警报**对话框。C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe要解决此问题：
>
> 1. 单击**专用网络，例如我的家庭或工作网络**。
> 2. 单击**允许访问**。
>
> 要了解有关安全性和 MongoDB 的更多信息，请参阅 [安全文档。](https://www.mongodb.com/docs/manual/security/)
>

#### 3、连接到 MongoDB。

如果您还没有这样做，请按照 [mongosh安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)下载并安装 MongoDB Shell ([mongosh](https://www.mongodb.com/docs/mongodb-shell/)).

请务必在安装期间将`mongosh.exe`二进制文件的路径添加到 `PATH`环境变量中。

打开一个新的**命令解释器**并输入`mongosh.exe` 以连接到MongoDB。

有关连接到`mongod`使用 的更多信息[mongosh.exe](https://www.mongodb.com/docs/mongodb-shell/)，例如连接到在不同主机和/或端口上运行的 MongoDB 实例，请参阅 [连接到 Deployment 。](https://www.mongodb.com/docs/mongodb-shell/connect/)

有关 CRUD（创建、读取、更新、删除）操作的信息，请参阅：

- [插入文件](https://www.mongodb.com/docs/manual/tutorial/insert-documents/)
- [查询文件](https://www.mongodb.com/docs/manual/tutorial/query-documents/)
- [更新文件](https://www.mongodb.com/docs/manual/tutorial/update-documents/)
- [删除文件](https://www.mongodb.com/docs/manual/tutorial/remove-documents/)

### 将 MongoDB 社区版 作为 Windows 服务运行

#### 将 MongoDB 社区版 作为 Windows 服务启动

从 4.0 版本开始，您可以在安装过程中将 MongoDB 安装并配置为 **Windows 服务**，MongoDB 服务在安装成功后启动。

您还可以从命令行手动管理该服务。要从命令行启动 MongoDB 服务，请打开一个[Windows 命令提示符/解释器](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/cmd)( `cmd.exe`) 以**管理员**身份运行以下命令：

##### 1、启动 MongoDB 服务。

关闭所有其他命令提示符，然后调用以下命令：

```
net start MongoDB
```

##### 2、验证 MongoDB 是否已成功启动。

检查您的 MongoDB 日志文件中是否有以下行：

```
[initandlisten] waiting for connections on port 27017
```

您可能会在过程输出中看到非严重警告。只要您在 MongoDB 日志中看到此消息，您就可以在初始评估 MongoDB 期间安全地忽略这些警告。

##### 3、连接到 MongoDB 服务器。

如果您还没有这样做，请按照 [mongosh安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)下载并安装 MongoDB Shell ([mongosh](https://www.mongodb.com/docs/mongodb-shell/)).

请务必在安装期间将`mongosh.exe`二进制文件的路径添加到 `PATH`环境变量中。

打开一个新的**命令解释器**并输入`mongosh.exe` 以连接到MongoDB。

#### 将 MongoDB 社区版 作为 Windows 服务停止

要停止/暂停 MongoDB 服务，您可以使用服务控制台：

1. 在服务控制台中，找到 MongoDB 服务。
2. 右键单击 MongoDB 服务并单击**停止**（或**暂停**）。

您还可以从命令行管理该服务。要从命令行停止 MongoDB 服务，请打开一个[Windows 命令提示符/解释器](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/cmd)( `cmd.exe`) 以**管理员**身份运行以下命令：

```
net stop MongoDB
```

#### 将 MongoDB 社区版 作为 Windows 服务删除

要删除 MongoDB 服务，请先使用服务控制台停止该服务。然后打开一个[Windows 命令提示符/解释器](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/cmd)( `cmd.exe`) 以**管理员**身份运行以下命令：

```
sc.exe delete MongoDB
```

### 其他注意事项

#### 默认绑定本地主机

默认情况下，MongoDB 启动时[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)设置为 `127.0.0.1`，绑定到本地主机网络接口。这意味着`mongod.exe`只能接受来自运行在同一台机器上的客户端的连接。远程客户端将无法连接到`mongod.exe`，并且`mongod.exe`将无法初始化[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)，除非此值设置为有效的网络接口。

该值可以配置为：

- 在 MongoDB 配置文件中使用[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp), 或
- 通过命令行参数[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)

> 警告
>
> 在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

有关配置的详细信息[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)，请参阅 [IP 绑定。](https://www.mongodb.com/docs/manual/core/security-mongodb-configuration/)

#### 点发布和`.msi`

如果您使用 Windows 安装程序 ( `.msi`) 安装 MongoDB，则会在[同一版本系列](https://www.mongodb.com/docs/manual/reference/versioning/#std-label-release-version-numbers)`.msi`中自动升级（例如 4.2.1 到 4.2.2）。

升级完整版本系列（例如 4.0 到 4.2）需要全新安装。

### 将 MongoDB 二进制文件添加到系统路径

如果添加C:\Program Files\MongoDB\Server\7.0\bin到系统`PATH`，则可以省略 MongoDB 服务器二进制文件的完整路径。您还应该将路径添加到[mongosh](https://www.mongodb.com/docs/mongodb-shell/)如果您还没有这样做。



原文链接 -https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-windows-unattended/

译者：韩鹏帅

