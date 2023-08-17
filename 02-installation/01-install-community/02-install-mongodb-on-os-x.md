 

## 在macOS上安装MongoDB社区版

**MONGODB ATLAS**

[MongoDB Atlas](https://www.mongodb.com/atlas/database?tck=docs_server) 是MongoDB公司提供的MongoDB云服务，无需安装开销，并提供免费的入门套餐。

### 概述

使用本教程在 macOS 上通过第三方的 Homebrew 包管理器安装 MongoDB 7.0 社区版。

从 MongoDB 4.4.1 开始，通过 Homebrew 安装 MongoDB 还会安装[MongoDB 数据库工具](https://www.mongodb.com/docs/database-tools/)。看 [使用 MongoDB 数据库工具](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-os-x/#std-label-brew-installs-dbtools)了解更多信息。



### MongoDB版本

本教程将安装MongoDB 7.0社区版。要安装其他版本的MongoDB，请使用此页面左上角的版本下拉菜单选择该版本的文档。

### 注意事项

 平台支持

MongoDB 7.0 社区版支持 macOS 10.14 或更高版本。

有关更多信息，请参见[支持的平台](https://www.mongodb.com/docs/v7.0/administration/production-notes/#std-label-prod-notes-supported-platforms)。

#### 生产注意事项

在生产环境中部署 MongoDB 之前，请考虑 [生产说明](https://www.mongodb.com/docs/v7.0/administration/production-notes/)文档，其中提供了生产 MongoDB 部署的性能注意事项和配置建议。

###  安装MongoDB社区版

 **前提条件**

确保您的系统满足以下每个先决条件。您只需在系统上执行每个先决步骤一次。如果您已经使用 Homebrew 执行了早期 MongoDB 安装的先决条件步骤，则可以跳到 [安装程序](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-os-x/#std-label-install)

 安装 Xcode 命令行工具

Homebrew 需要 Apple Xcode 中的 Xcode 命令行工具。

- 通过在 macOS 终端中运行以下命令来安装 Xcode 命令行工具：

  ```
  xcode-select --install
  ```

安装自制软件

默认情况下，macOS 不包含 Homebrew`brew`软件包。

- `brew`使用官方 安装[自制安装说明](https://brew.sh/#install)。

#### 安装MongoDB 7.0社区版

按照以下步骤使用 Homebrew 的 包管理器安装 MongoDB 社区版 。确保您已遵循 `brew`[安装先决条件](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-os-x/#std-label-osx-prereq)在继续之前先执行上述操作。

1. 点击[MongoDB 自制 Tap](https://github.com/mongodb/homebrew-brew)要下载 MongoDB 和数据库工具的官方 Homebrew 公式，请在 macOS 终端中运行以下命令：

   ```
   brew tap mongodb/brew
   ```

   如果您之前安装的 MongoDB 已经执行此操作，则可以跳过此步骤。

2. 要更新 Homebrew 和所有现有公式：

   ```
   brew update
   ```

3. 要安装 MongoDB，请在 macOS 终端应用程序中运行以下命令：

   ```
   brew install mongodb-community@7.0
   ```

> 提示:
>
> 或者，如果需要，您可以指定 MongoDB 的早期版本。您还可以通过这种方式并行维护 MongoDB 的多个版本。

> 提示:
>
> 如果您之前安装了旧版本的公式，则可能会遇到 ChecksumMismatchError。要解决，请参阅 [对 ChecksumMismatchError 进行故障排除。](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-os-x/#std-label-troubleshooting-checksumerror)

安装包括以下二进制文件：

- 服务器[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)_
- 分[`mongos`](https://www.mongodb.com/docs/v7.0/reference/program/mongos/#mongodb-binary-bin.mongos)片集群查询路由器
- MongoDB Shell，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

此外，安装程序还会在下面指定的位置创建以下文件和目录，具体取决于您的 Apple 硬件：

|                                                              | Intel Processor              | Apple Silicon Processor         |
| :----------------------------------------------------------- | :--------------------------- | :------------------------------ |
| [配置文件](https://www.mongodb.com/docs/v7.0/reference/configuration-options/) | `/usr/local/etc/mongod.conf` | `/opt/homebrew/etc/mongod.conf` |
| [`log directory`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-systemLog.path) | `/usr/local/var/log/mongodb` | `/opt/homebrew/var/log/mongodb` |
| [`data directory`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-storage.dbPath) | `/usr/local/var/mongodb`     | `/opt/homebrew/var/mongodb`     |

看[苹果的文档](https://support.apple.com/en-us/HT211814) 查看当前使用 Apple Silicon 处理器的 Apple 硬件列表。您还可以运行以下命令来检查`brew`这些文件和目录的安装位置：

```
brew --prefix
```

从 MongoDB 4.4.1 开始，安装还包括 [MongoDB 数据库工具](https://www.mongodb.com/docs/database-tools/)。看[使用 MongoDB 数据库工具](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-os-x/#std-label-brew-installs-dbtools)了解更多信息。

#### 运行 MongoDB 社区版

请按照以下步骤运行 MongoDB社区版。这些说明假设您使用的是默认设置。

您可以使用 来将 MongoDB 作为 macOS 服务运行`brew`，也可以将 MongoDB 作为后台进程手动运行。建议将 MongoDB 作为 macOS 服务运行，因为这样做会 `ulimit`自动设置正确的系统值（有关更多信息，请参阅 [ulimit 设置](https://www.mongodb.com/docs/v7.0/reference/ulimit/#std-label-ulimit-settings)）。

* 要将 MongoDB（即进程[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)）**作为 macOS 服务**运行，请运行：

  ```
  brew services start mongodb-community@7.0
  ```

  要停止[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)作为 macOS 服务运行，请根据需要使用以下命令：

  ```
  brew services stop mongodb-community@7.0
  ```

* **要作为后台进程手动**运行 MongoDB（即[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)进程），请运行：

  * 对于运行 Intel 处理器的 macOS：

    ```
    mongod --config /usr/local/etc/mongod.conf --fork
    ```

  * 对于运行在 macOS 上的[Apple Silicon处理器：](https://support.apple.com/en-us/HT211814)

    ```
    mongod --config /opt/homebrew/etc/mongod.conf --fork
    ```

    要停止[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)作为后台进程运行，请[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)使用[蒙戈什](https://www.mongodb.com/docs/mongodb-shell/)，并[`shutdown`](https://www.mongodb.com/docs/v7.0/reference/command/shutdown/#mongodb-dbcommand-dbcmd.shutdown)根据需要发出命令。

两种方法都使用`mongod.conf`安装期间创建的文件。您也可以将自己的 MongoDB [配置选项添加到此文件中。](https://www.mongodb.com/docs/v7.0/reference/configuration-options/)

> 笔记:
>
> **macOS 阻止 mongod 打开**
>
> macOS 可能会[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在安装后阻止运行。如果您在开始时收到安全错误，[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod) 指示无法识别或验证开发人员，请执行以下操作以授予[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)运行访问权限：
>
> * 打开*系统偏好设置*
> * 选择*“安全和隐私”*窗格。
> * 在*“常规”*选项卡下，单击有关消息右侧的按钮[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)，该按钮标记为“**仍然打开”**或**“仍然允许”，**具体取决于您的 macOS 版本。

要验证 MongoDB 是否正在运行，请执行以下操作之一：

* 如果您将 MongoDB**作为 macOS 服务**启动：

  ```
  brew services list
  ```

  您应该看到该服务`mongodb-community`列为 `started`。

* 如果您**手动启动 MongoDB 作为后台进程**：

  ```
  ps aux | grep -v grep | grep mongod
  ```

  `mongod`您应该在输出中看到您的过程。

您还可以查看日志文件以了解进程的当前状态 `mongod`：`/usr/local/var/log/mongodb/mongo.log`。

#### 连接和使用 MongoDB

要开始使用 MongoDB，请连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到正在运行的实例。从新终端发出以下命令：

```
mongosh
```

有关 CRUD（创建、读取、更新、删除）操作的信息，请参阅：

- [插入文档](https://www.mongodb.com/docs/v7.0/tutorial/insert-documents/)
- [查询文件](https://www.mongodb.com/docs/v7.0/tutorial/query-documents/)
- [更新文件](https://www.mongodb.com/docs/v7.0/tutorial/update-documents/)
- [删除文档](https://www.mongodb.com/docs/v7.0/tutorial/remove-documents/)

#### 使用 MongoDB 数据库工具

从 MongoDB 4.4.1 开始，安装 MongoDB`brew`还会安装 MongoDB 数据库工具。

这[MongoDB 数据库工具](https://www.mongodb.com/docs/database-tools/)是用于 MongoDB 部署的命令行实用程序的集合，包括数据备份和导入/导出工具，例如 [`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)和[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)以及监控工具，例如[`mongotop`。](https://www.mongodb.com/docs/database-tools/mongotop/#mongodb-binary-bin.mongotop)

在上述步骤中安装 MongoDB 服务器后，可以直接从 macOS 终端应用程序中的命令行使用数据库工具。例如你可以运行[`mongotop`](https://www.mongodb.com/docs/database-tools/mongotop/#mongodb-binary-bin.mongotop) 通过在 macOS 终端中调用正在运行的 MongoDB 实例，如下所示：

```
mongotop
```

它应该启动，连接到您正在运行的[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)，并开始报告使用情况统计信息。

请参阅[MongoDB 数据库工具文档](https://www.mongodb.com/docs/database-tools/)有关每个数据库工具的使用信息。

### 附加信息

#### 默认本地主机绑定

默认情况下，MongoDB 启动时[`bindIp`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-net.bindIp)设置为 `127.0.0.1`，绑定到本地主机网络接口。这意味着`mongod`只能接受来自同一计算机上运行的客户端的连接。除非将此值设置为有效的网络接口，否则远程客户端将无法连接到`mongod`，并且`mongod`将无法初始化[副本集。](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-replica-set)

该值可以配置为：

- 在 MongoDB 配置文件中使用[`bindIp`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-net.bindIp), 或
- 通过命令行参数[`--bind_ip`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#std-option-mongod.--bind_ip)

> 警告
>
> 在将实例绑定到可公开访问的 IP 地址之前，您必须保护集群免遭未经授权的访问。有关安全建议的完整列表，请参阅 [安全检查表](https://www.mongodb.com/docs/v7.0/administration/security-checklist/#std-label-security-checklist)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/v7.0/administration/security-checklist/#std-label-checklist-auth)和[强化网络基础设施。](https://www.mongodb.com/docs/v7.0/core/security-hardening/#std-label-network-config-hardening)

有关配置的详细信息[`bindIp`](https://www.mongodb.com/docs/v7.0/reference/configuration-options/#mongodb-setting-net.bindIp)，请参阅 [IP 绑定。](https://www.mongodb.com/docs/v7.0/core/security-mongodb-configuration/)

#### 校验和不匹配错误故障排除

如果您之前安装过旧版本的公式，您可能会遇到`ChecksumMismatchError`类似于以下内容的情况：

```
Error: An exception occurred within a child process:
  ChecksumMismatchError: SHA256 mismatch
Expected: c7214ee7bda3cf9566e8776a8978706d9827c1b09017e17b66a5a4e0c0731e1f
  Actual: 6aa2e0c348e8abeec7931dced1f85d4bb161ef209c6af317fe530ea11bbac8f0
 Archive: /Users/kay/Library/Caches/Homebrew/downloads/a6696157a9852f392ec6323b4bb697b86312f0c345d390111bd51bb1cbd7e219--mongodb-macos-x86_64-4.2.0.tgz
To retry an incomplete download, remove the file above.
```

修理：

1. 删除下载的`.tgz`存档。

2. 重新输入公式。

   ```
   brew untap mongodb/brew && brew tap mongodb/brew
   ```

3. 重试安装。

   ```
   brew install mongodb-community@7.0
   ```





原文链接：https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-os-x/

译者：韩鹏帅
