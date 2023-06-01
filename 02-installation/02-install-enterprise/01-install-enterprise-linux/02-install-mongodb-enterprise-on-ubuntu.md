# 在 Ubuntu 上安装 MongoDB 企业版[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#install-mongodb-enterprise-edition-on-ubuntu)



## 笔记

### MongoDB 地图集

[MongoDB 地图集](https://www.mongodb.com/cloud/atlas?tck=docs_server) 是云中托管的 MongoDB 服务选项，无需安装开销，并提供免费套餐以供入门。

## 概述[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#overview)

使用本教程使用`apt`包管理器在 Ubuntu Linux 的 LTS（长期支持）版本上 安装 MongoDB 6.0企业版。

[MongoDB 企业版](https://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server) 在选定的平台上可用，并包含对与安全和监视相关的多个功能的支持。

### MongoDB 版本[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#mongodb-version)

本教程安装 MongoDB 6.0企业 版。要安装不同版本的 MongoDB Enterprise ，请使用此页面左上角的版本下拉菜单选择该版本的文档。

## 注意事项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#considerations)

### 平台支持[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#platform-support)



## NOTE

### 停产通知

- MongoDB 5.0 企业版移除对[x86_64上的 Ubuntu 16.04 的支持](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-x86_64)
- MongoDB 5.0 企业版取消对 Ubuntu 18.04 on [s390x的支持](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-s390x)
- MongoDB 5.0 企业版取消对[PPC64LE上的 Ubuntu 18.04 的支持](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-PPC64LE)

[MongoDB 6.0 企业版在x86_64](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-x86_64)架构上支持以下 **64 位**Ubuntu LTS（长期支持）版本 ：

- 20.04 LTS（“焦点”）
- 18.04 LTS（“仿生”）
- 16.04 LTS（“Xenial”）

MongoDB 仅支持这些平台的 64 位版本。

Ubuntu 上的 MongoDB 6.0 企业版还支持特定平台上的 [ARM64](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-ARM64)架构。

有关详细信息，请参阅[平台支持](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms)。

对于支持 Ubuntu 16.04 POWER/PPC64LE 的早期 MongoDB Enterprise 版本：

`glibc`由于Ubuntu 16.04 for POWER 上旧版本包中存在锁省略错误，您必须`glibc`至少`glibc 2.23-0ubuntu5` 在运行 MongoDB 之前将包升级到。使用旧版本 `glibc`软件包的系统将因随机内存损坏而导致数据库服务器崩溃和行为不当，并且不适合 MongoDB 的生产部署

### 制作说明[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#production-notes)

在生产环境中部署 MongoDB 之前，请考虑 [生产说明](https://www.mongodb.com/docs/manual/administration/production-notes/)文档，其中提供了生产 MongoDB 部署的性能注意事项和配置建议。

### 官方 MongoDB 包[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#official-mongodb-packages)

要在您的Ubuntu系统上安装 MongoDB Enterprise ，这些说明将使用由 MongoDB Inc 维护和支持的官方包。官方 包始终包含最新版本的 MongoDB，并且可以从其自己的专用存储库中获得。`mongodb-enterprise``mongodb-enterprise`



## IMPORTANT

Ubuntu提供的`mongodb`包不是 MongoDB Inc.维护的，与官方 **包**有冲突。如果您已经在Ubuntu系统 上安装了该软件包，则**必须**先卸载该软件包，然后才能继续执行这些说明。`mongodb-enterprise``mongodb``mongodb`

看[MongoDB 企业版包](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#std-label-ubuntu-enterprise-package-content)官方软件包的完整列表。



## 安装 MongoDB 企业版[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#install-mongodb-enterprise-edition)

按照以下步骤使用`apt`包管理器安装 MongoDB企业版 。



### 导入包管理系统使用的公钥。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#import-the-public-key-used-by-the-package-management-system)

从终端发出以下命令以从中导入 MongoDB 公共 GPG 密钥https://www.mongodb.org/static/pgp/server-6.0.asc:

```
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
```



该操作应以`OK`.

但是，如果您收到指示`gnupg`未安装的错误消息，您可以：

1. 使用以下命令安装`gnupg`及其所需的库：

   ```
   sudo apt-get install gnupg
   ```

   

2. 安装后，重试导入密钥：

   ```
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   ```

   

### 为 MongoDB创建一个`/etc/apt/sources.list.d/mongodb-enterprise.list`文件。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#create-a-etc-apt-sources-list-d-mongodb-enterprise-list-file-for-mongodb)

单击适合您的 Ubuntu 版本的选项卡。

Ubuntu 20.04（重点）Ubuntu 18.04（仿生）Ubuntu 16.04（Xenial）

以下说明适用于**Ubuntu 20.04 (Focal)**。

为 Ubuntu 20.04 (Focal) 创建列表文件。

```
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.com/apt/ubuntu focal/mongodb-enterprise/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-enterprise.list
```



### 重新加载本地包数据库。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#reload-local-package-database)

发出以下命令以重新加载本地包数据库：

```
sudo apt-get update
```



### 安装 MongoDB 企业包。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#install-the-mongodb-enterprise-packages)

#### 安装 MongoDB 企业版。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#install-mongodb-enterprise)

发出以下命令：

```
sudo apt-get install -y mongodb-enterprise
```



#### 安装特定版本的 MongoDB Enterprise。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#install-a-specific-release-of-mongodb-enterprise)

要安装特定版本，您必须单独指定每个组件包以及版本号，如以下示例所示：

```
sudo apt-get install -y mongodb-enterprise=6.0.3 mongodb-org-database=6.0.3 mongodb-enterprise-server=6.0.3 mongodb-mongosh=6.0.3 mongodb-enterprise-mongos=6.0.3 mongodb-enterprise-tools=6.0.3
```



如果您只安装`mongodb-enterprise=6.0.3`而不包含组件包，则无论您指定什么版本，都会安装每个 MongoDB 包的最新版本。

#### 固定特定版本的 MongoDB Enterprise。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#pin-a-specific-version-of-mongodb-enterprise)

尽管您可以指定任何可用的 MongoDB 版本， `apt-get`但会在更新版本可用时升级包。为防止意外升级，请固定包。要将 MongoDB 的版本固定在当前安装的版本上，请发出以下命令序列：

```
echo "mongodb-enterprise hold" | sudo dpkg --set-selections
echo "mongodb-enterprise-server hold" | sudo dpkg --set-selections
echo "mongodb-enterprise-database hold" | sudo dpkg --set-selections
echo "mongodb-mongosh hold" | sudo dpkg --set-selections
echo "mongodb-enterprise-mongos hold" | sudo dpkg --set-selections
echo "mongodb-enterprise-tools hold" | sudo dpkg --set-selections
```



## NOTE

您还可以安装使用系统的 OpenSSL 的 MongoDB Shell。在安装此版本的 MongoDB Shell 之前，您必须已经在系统上安装了 OpenSSL。

您可以安装所有 MongoDB 企业包和使用系统 OpenSSL 的 MongoDB Shell，而无需先删除 MongoDB Shell。例如：

```
sudo apt-get install -y mongodb-enterprise mongodb-mongosh-shared-openssl11
```



以下示例移除 MongoDB Shell，然后安装使用系统的 OpenSSL 1.1 的 MongoDB Shell：

```
sudo apt-get remove -y mongodb-mongosh && sudo apt-get install -y
mongodb-mongosh-shared-openssl11
```



以下示例删除 MongoDB Shell，然后安装使用系统的 OpenSSL 3 的 MongoDB Shell：

```
sudo apt-get remove -y mongodb-mongosh && sudo apt-get install -y
mongodb-mongosh-shared-openssl3
```



您还可以选择要安装的 MongoDB 包。

以下示例安装了 MongoDB Enterprise 和工具，以及使用系统的 OpenSSL 1.1 的 MongoDB Shell：

```
sudo apt-get install -y mongodb-enterprise-database
mongodb-enterprise-tools mongodb-mongosh-shared-openssl11
```



以下示例安装 MongoDB Enterprise 和工具，以及使用系统的 OpenSSL 3 的 MongoDB Shell：

```
sudo apt-get install -y mongodb-enterprise-database
mongodb-enterprise-tools mongodb-mongosh-shared-openssl3
```



## 运行 MongoDB 企业版[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#run-mongodb-enterprise-edition)

默认情况下，MongoDB 实例存储：

- 它的数据文件在`/var/lib/mongodb`
- 它的日志文件在`/var/log/mongodb`

如果您通过包管理器安装，这些默认目录是在安装过程中创建的。

如果您通过下载 tarball 手动安装，则可以使用`mkdir -p <directory>`或`sudo mkdir -p <directory>`取决于将运行 MongoDB 的用户来创建目录。`mkdir`（有关和的信息，请参阅您的 linux 手册页`sudo`。）

默认情况下，MongoDB 使用`mongodb`用户帐户运行。如果更改运行 MongoDB 进程的用户，则还**必须**修改对`/var/lib/mongodb`和`/var/log/mongodb` 目录的权限，以授予该用户访问这些目录的权限。

要指定不同的日志文件目录和数据文件目录，请编辑[`systemLog.path`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-systemLog.path)和[`storage.dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)中的设置`/etc/mongod.conf`。确保运行 MongoDB 的用户有权访问这些目录。

大多数类 Unix 操作系统限制进程可能使用的系统资源。这些限制可能会对 MongoDB 操作产生负面影响，应该进行调整。有关为您的平台推荐的设置，请参阅[UNIX`ulimit`设置。](https://www.mongodb.com/docs/manual/reference/ulimit/)



## NOTE

`ulimit`从 MongoDB 4.4 开始，如果打开文件数的值小于`64000` ，则会生成启动错误 。

### 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#procedure)

按照以下步骤在您的系统上运行 MongoDB企业版。这些说明假定您使用的是官方包——而不是Ubuntu提供`mongodb-enterprise` 的非官方`mongodb`包 ——并且使用的是默认设置。

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



#### 启动 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#start-mongodb)

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)您可以通过发出以下命令来启动该过程：

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



#### 验证 MongoDB 是否已成功启动。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#verify-that-mongodb-has-started-successfully)

```
sudo systemctl status mongod
```



您可以选择通过发出以下命令确保 MongoDB 将在系统重启后启动：

```
sudo systemctl enable mongod
```



#### 停止 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#stop-mongodb)

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)根据需要，您可以通过发出以下命令来停止该过程：

```
sudo systemctl stop mongod
```



#### 重新启动 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#restart-mongodb)

您可以[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)通过发出以下命令来重新启动该过程：

```
sudo systemctl restart mongod
```



您可以通过查看文件中的输出来跟踪错误或重要消息的过程状态`/var/log/mongodb/mongod.log`。



#### 开始使用 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#begin-using-mongodb)

开始一个[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)与 .在同一台主机上的会话 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。你可以跑[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 没有任何命令行选项来连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在默认端口 27017 上运行的本地主机上。

```
mongosh
```



有关使用连接的更多信息[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，例如连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在不同主机和/或端口上运行的实例，请参阅 [蒙戈什文档。](https://www.mongodb.com/docs/mongodb-shell/)

为了帮助您开始使用 MongoDB，MongoDB 提供了各种驱动程序版本的[入门指南](https://www.mongodb.com/docs/manual/tutorial/getting-started/#std-label-getting-started)。有关驱动程序文档，请参阅[开始使用 MongoDB 进行开发。](https://api.mongodb.com/)

## 卸载 MongoDB[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#uninstall-mongodb)

要从系统中完全删除 MongoDB，您必须删除 MongoDB 应用程序本身、配置文件以及任何包含数据和日志的目录。以下部分将指导您完成必要的步骤。



## WARNING

此过程将*完全*删除 MongoDB、其配置和*所有* 数据库。此过程不可逆，因此请确保在继续之前备份所有配置和数据。



### 停止 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#stop-mongodb-2)

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)通过发出以下命令停止进程：

```
sudo service mongod stop
```



### 删除包。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#remove-packages)

删除您之前安装的所有 MongoDB 包。

```
sudo apt-get purge mongodb-enterprise*
```



### 删除数据目录。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#remove-data-directories)

删除 MongoDB 数据库和日志文件。

```
sudo rm -r /var/log/mongodb
sudo rm -r /var/lib/mongodb
```



## 附加信息[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#additional-information)

### 默认绑定本地主机[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#localhost-binding-by-default)

默认情况下，MongoDB 启动时[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)设置为 `127.0.0.1`，绑定到本地主机网络接口。这意味着`mongod`只能接受来自运行在同一台机器上的客户端的连接。远程客户端将无法连接到`mongod`，并且`mongod`将无法初始化[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)，除非此值设置为有效的网络接口。

该值可以配置为：

- 在 MongoDB 配置文件中使用[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp), 或
- 通过命令行参数[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)



## WARNING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

有关配置的详细信息[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)，请参阅 [IP 绑定。](https://www.mongodb.com/docs/manual/core/security-mongodb-configuration/)



### MongoDB 企业版包[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/#mongodb-enterprise-edition-packages)

MongoDB Enterprise Edition 可从其自己的专用存储库获得，并包含以下官方支持的包：

| 包裹名字                      | 描述                                                         |
| :---------------------------- | :----------------------------------------------------------- |
| `mongodb-enterprise`          | 一个`metapackage`自动安装下面列出的组件包的。                |
| `mongodb-enterprise-database` | 一个`metapackage`自动安装下面列出的组件包的。包裹名字描述`mongodb-enterprise-server`包含[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)守护程序和关联的配置和初始化脚本。`mongodb-enterprise-mongos`包含[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)守护进程。`mongodb-enterprise-cryptd`包含[mongocryptd](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-components/#std-label-csfle-encryption-components) 二进制文件 |
| `mongodb-mongosh`             | 包含 MongoDB shell ([`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)). |
| `mongodb-shared-openssl*`     | 包含使用您计算机上已安装的 OpenSSL 版本的 MongoDB Shell ([`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)). |
| `mongodb-enterprise-tools`    | 一个`metapackage`自动安装下面列出的组件包的：包裹名字描述`mongodb-database-tools`包含以下 MongoDB 数据库工具：[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)[`bsondump`](https://www.mongodb.com/docs/database-tools/bsondump/#mongodb-binary-bin.bsondump)[`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)[`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)[`mongostat`](https://www.mongodb.com/docs/database-tools/mongostat/#mongodb-binary-bin.mongostat)[`mongotop`](https://www.mongodb.com/docs/database-tools/mongotop/#mongodb-binary-bin.mongotop)[`mongofiles`](https://www.mongodb.com/docs/database-tools/mongofiles/#mongodb-binary-bin.mongofiles)`mongodb-enterprise-database-tools-extra`包含以下 MongoDB 支持工具：[`mongoldap`](https://www.mongodb.com/docs/manual/reference/program/mongoldap/#mongodb-binary-bin.mongoldap)[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)[`install_compass`](https://www.mongodb.com/docs/manual/reference/program/install_compass/#std-label-install-compass)脚本`mongodecrypt`二进制 |

←  [使用 .tgz Tarball 在 Red Hat 或 CentOS 上安装 MongoDB Enterprise](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/)[使用 .tgz Tarball 在 Ubuntu 上安装 MongoDB Enterprise](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/) →

原文链接 -https://docs.mongodb.com/manual/tutorial/install-mongodb-enterprise-on-ubuntu/

译者：陆文龙
