# 在 SUSE 上安装 MongoDB 企业版



## NOTE

### MongoDB Atlas

[MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server) 是云中托管的 MongoDB 服务选项，无需安装开销，并提供免费套餐以供入门。

## 概述[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#overview)

使用本教程使用`zypper`包管理器在 SUSE Linux Enterprise Server (SLES) 上安装 MongoDB 6.0 Enterprise Edition 。

[MongoDB 企业版](https://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server) 在选定的平台上可用，并包含对与安全和监视相关的多个功能的支持。

### MongoDB 版本[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#mongodb-version)

本教程安装 MongoDB 6.0企业 版。要安装不同版本的 MongoDB Enterprise ，请使用此页面左上角的版本下拉菜单选择该版本的文档。

## 注意事项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#considerations)

### 平台支持[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#platform-support)



## NOTE

### 停产通知

- MongoDB 5.0 企业版移除了对[s390x上的 SLES12 的支持](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-s390x)

[MongoDB 6.0 Enterprise Edition 在x86_64](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-x86_64)架构上支持以下 **64 位**SUSE Linux Enterprise Server (SLES) 版本 ：

- SLES 15
- SLES 12

MongoDB 仅支持这些平台的 64 位版本。

有关详细信息，请参阅[平台支持](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms)。

### 制作说明[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#production-notes)

在生产环境中部署 MongoDB 之前，请考虑 [生产说明](https://www.mongodb.com/docs/manual/administration/production-notes/)文档，其中提供了生产 MongoDB 部署的性能注意事项和配置建议。



## 安装 MongoDB 企业版[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#install-mongodb-enterprise-edition)

按照以下步骤使用`zypper`包管理器安装 MongoDB企业版。



### 导入 MongoDB 公钥。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#import-the-mongodb-public-key)

```
sudo rpm --import https://www.mongodb.org/static/pgp/server-6.0.asc
```



### 添加 MongoDB 存储库。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#add-the-mongodb-repository)

添加存储库以便您可以安装 MongoDB。使用适合您的 SUSE 版本的命令：

- SLES 15
- SLES 12

```
sudo zypper addrepo --gpgcheck "https://repo.mongodb.com/zypper/suse/12/mongodb-enterprise/6.0/x86_64/" mongodb
```



如果您想安装以前 [版本系列](https://www.mongodb.com/docs/manual/reference/versioning/#std-label-release-version-numbers)（例如 4.0）中的 MongoDB 包，您可以在存储库配置中指定版本系列。例如，要将您的 SUSE 12 系统限制为 4.0 版本系列，请使用以下命令：

```
sudo zypper addrepo --no-gpgcheck "https://repo.mongodb.com/zypper/suse/12/mongodb-enterprise/4.0/x86_64/" mongodb
```



### 安装 MongoDB 包。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#install-the-mongodb-packages)

要安装 MongoDB 6.0，请发出以下命令：

```
sudo zypper -n install mongodb-enterprise
```



要安装特定版本的 MongoDB，请单独指定每个组件包并将版本号附加到包名称，如以下示例所示：

```
sudo zypper install mongodb-enterprise-6.0.4 mongodb-enterprise-database-6.0.4 mongodb-enterprise-server-6.0.4 mongodb-enterprise-mongos-6.0.4 mongodb-enterprise-tools-6.0.4
```



您可以指定任何可用版本的 MongoDB。但是，`zypper` 当更新版本可用时升级软件包。为防止意外升级，请通过运行以下命令固定软件包：

```
sudo zypper addlock mongodb-enterprise-6.0.4 mongodb-enterprise-database-6.0.4 mongodb-enterprise-server-6.0.4 mongodb-enterprise-mongos-6.0.4 mongodb-enterprise-tools-6.0.4
```



以前版本的 MongoDB 包使用不同的存储库位置。请参阅适合您的 MongoDB 版本的文档版本。

## 运行 MongoDB 企业版[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#run-mongodb-enterprise-edition)

默认情况下，MongoDB 实例存储：

- 它的数据文件在`/var/lib/mongo`
- 它的日志文件在`/var/log/mongodb`

如果您通过包管理器安装，这些默认目录是在安装过程中创建的。

`mkdir -p <directory>`如果您通过下载 tarball 手动安装，则可以使用或`sudo mkdir -p <directory>`取决于将运行 MongoDB 的用户来创建目录。（有关`mkdir`和 的信息，请参阅您的 linux 手册页`sudo`。）

默认情况下，MongoDB 使用用户帐户运行`mongod`。如果更改运行 MongoDB 进程的用户，则还**必须**`/var/lib/mongo`修改对和目录的权限`/var/log/mongodb` ，以授予该用户访问这些目录的权限。

要指定不同的日志文件目录和数据文件目录，请编辑[`systemLog.path`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-systemLog.path)和[`storage.dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)中的设置`/etc/mongod.conf`。确保运行 MongoDB 的用户有权访问这些目录。

大多数类 Unix 操作系统限制进程可能使用的系统资源。这些限制可能会对 MongoDB 操作产生负面影响，应该进行调整。有关为您的平台推荐的设置，请参阅[UNIX`ulimit`设置。](https://www.mongodb.com/docs/manual/reference/ulimit/)



## NOTE

`ulimit`从 MongoDB 4.4 开始，如果打开文件数的值小于`64000`，则会生成启动错误 。

### 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#procedure)

按照以下步骤运行 MongoDB企业版。这些说明假定您使用的是默认设置。

**初始化系统**

要运行和管理您的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)进程，您将使用操作系统的内置[初始化系统](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-init-system)。最新版本的 Linux 倾向于使用**systemd**（使用`systemctl`命令），而旧版本的 Linux 倾向于使用**System V init**（使用`service`命令）。

如果您不确定您的平台使用哪个 init 系统，请运行以下命令：

```
ps --no-headers -o comm 1
```



然后根据结果选择下面适当的选项卡：

- `systemd`- 选择下面的**systemd (systemctl)**选项卡。
- `init`- 选择下面的**System V Init（服务）**选项卡。

系统（系统控制）System V 初始化（服务）



#### 启动 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#start-mongodb)

您可以[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)通过发出以下命令来启动该过程：

```
sudo systemctl start mongod
```



如果您在启动时收到类似以下的错误 [`mongod`：](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

```
Failed to start mongod.service: Unit mongod.service not found.
```

首先运行以下命令：

```
sudo systemctl daemon-reload
```



然后再次运行上面的启动命令。



#### 验证 MongoDB 是否已成功启动。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#verify-that-mongodb-has-started-successfully)

您可以[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)通过发出以下命令来验证进程是否已成功启动：

```
sudo systemctl status mongod
```



您可以选择通过发出以下命令确保 MongoDB 将在系统重启后启动：

```
sudo systemctl enable mongod
```



#### 停止 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#stop-mongodb)

根据需要，您可以[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)通过发出以下命令来停止该过程：

```
sudo systemctl stop mongod
```



#### 重新启动 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#restart-mongodb)

您可以[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)通过发出以下命令来重新启动该过程：

```
sudo systemctl restart mongod
```



您可以通过查看文件中的输出来跟踪错误或重要消息的过程状态`/var/log/mongodb/mongod.log`。



#### 开始使用 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#begin-using-mongodb)

开始一个[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)与 . 在同一台主机上的会话 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。你可以跑[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 没有任何命令行选项来连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在默认端口 27017 上运行的本地主机上。

```
mongosh
```



有关使用连接的更多信息[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，例如连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在不同主机和/或端口上运行的实例，请参阅 [蒙戈什文档。](https://www.mongodb.com/docs/mongodb-shell/)

为了帮助您开始使用 MongoDB，MongoDB 提供了各种驱动程序版本的[入门指南。](https://www.mongodb.com/docs/manual/tutorial/getting-started/#std-label-getting-started)有关驱动程序文档，请参阅[开始使用 MongoDB 进行开发。](https://api.mongodb.com/)

## 卸载 MongoDB[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#uninstall-mongodb)

要从系统中完全删除 MongoDB，您必须删除 MongoDB 应用程序本身、配置文件以及任何包含数据和日志的目录。以下部分将指导您完成必要的步骤。



## WARNING

此过程将*完全*删除 MongoDB、其配置和*所有* 数据库。此过程不可逆，因此请确保在继续之前备份所有配置和数据。



### 停止 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#stop-mongodb-2)

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)通过发出以下命令停止进程：

```
sudo service mongod stop
```



### 删除包。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#remove-packages)

删除您之前安装的所有 MongoDB 包。

```
sudo zypper remove $(rpm -qa | grep mongodb-enterprise)
```



### 删除数据目录。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#remove-data-directories)

删除 MongoDB 数据库和日志文件。

```
sudo rm -r /var/log/mongodb
sudo rm -r /var/lib/mongo
```



## 附加信息[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#additional-information)

### 默认绑定本地主机[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#localhost-binding-by-default)

默认情况下，MongoDB 启动时[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)设置为 `127.0.0.1`，绑定到本地主机网络接口。这意味着`mongod`只能接受来自运行在同一台机器上的客户端的连接。远程客户端将无法连接到`mongod`，并且`mongod`将无法初始化[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)，除非此值设置为有效的网络接口。

该值可以配置为：

- 在 MongoDB 配置文件中使用[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp), 或
- 通过命令行参数[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)



## WARNING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

有关配置的详细信息[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)，请参阅 [IP 绑定。](https://www.mongodb.com/docs/manual/core/security-mongodb-configuration/)

### MongoDB 企业版包[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/#mongodb-enterprise-edition-packages)

MongoDB Enterprise Edition 可从其自己的专用存储库获得，并包含以下官方支持的包：

| 包裹名字                      | 描述                                                         |
| :---------------------------- | :----------------------------------------------------------- |
| `mongodb-enterprise`          | 一个`metapackage`自动安装下面列出的组件包的。                |
| `mongodb-enterprise-database` | 一个`metapackage`自动安装下面列出的组件包的。包裹名字描述`mongodb-enterprise-server`包含[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)守护程序和关联的配置和初始化脚本。`mongodb-enterprise-mongos`包含[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)守护进程。`mongodb-enterprise-cryptd`包含[mongocryptd](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-components/#std-label-csfle-encryption-components) 二进制文件 |
| `mongodb-mongosh`             | 包含 MongoDB shell ([`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)). |
| `mongodb-shared-openssl*`     | 包含使用您计算机上已安装的 OpenSSL 版本的 MongoDB Shell ([`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)). |
| `mongodb-enterprise-tools`    | 一个`metapackage`自动安装下面列出的组件包的：包裹名字描述`mongodb-database-tools`包含以下 MongoDB 数据库工具：[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)[`bsondump`](https://www.mongodb.com/docs/database-tools/bsondump/#mongodb-binary-bin.bsondump)[`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)[`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)[`mongostat`](https://www.mongodb.com/docs/database-tools/mongostat/#mongodb-binary-bin.mongostat)[`mongotop`](https://www.mongodb.com/docs/database-tools/mongotop/#mongodb-binary-bin.mongotop)[`mongofiles`](https://www.mongodb.com/docs/database-tools/mongofiles/#mongodb-binary-bin.mongofiles)`mongodb-enterprise-database-tools-extra`包含以下 MongoDB 支持工具：[`mongoldap`](https://www.mongodb.com/docs/manual/reference/program/mongoldap/#mongodb-binary-bin.mongoldap)[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)[`install_compass`](https://www.mongodb.com/docs/manual/reference/program/install_compass/#std-label-install-compass)脚本`mongodecrypt`二进制 |

←  [使用 .tgz Tarball 在 Debian 上安装 MongoDB Enterprise](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-debian-tarball/)[使用 .tgz Tarball 在 SUSE 上安装 MongoDB Enterprise](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse-tarball/) →

原文链接 -https://docs.mongodb.com/manual/tutorial/install-mongodb-enterprise-on-suse/

译者：陆文龙
