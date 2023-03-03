# 使用 .tgz Tarball 在 Ubuntu 上安装 MongoDB Enterprise



## NOTE

### MongoDB Atlas

[MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server) 是云中托管的 MongoDB 服务选项，无需安装开销，并提供免费套餐以供入门。

## 概述[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#overview)

使用本教程使用下载的`.tgz`tarball 在 Ubuntu Linux 的 LTS（长期支持）版本上手动安装 MongoDB 6.0企业版。

[MongoDB 企业版](https://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server) 在选定的平台上可用，并包含对与安全和监视相关的多个功能的支持。

### MongoDB 版本[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#mongodb-version)

本教程安装 MongoDB 6.0企业 版。要安装不同版本的 MongoDB Enterprise ，请使用此页面左上角的版本下拉菜单选择该版本的文档。

### 安装方法[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#installation-method)

虽然 MongoDB 可以通过下载的`.tgz` tarball 手动安装，如本文档所述，但建议尽可能使用系统上的 `apt`包管理器来安装 MongoDB。使用包管理器会自动安装所有需要的依赖项，提供一个示例`mongod.conf`文件来帮助您入门，并简化未来的升级和维护任务。

➤有关说明，请参阅[使用 apt 包管理器安装 MongoDB](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/) 。

## 注意事项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#considerations)

### MongoDB shell，`mongosh`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#mongodb-shell--mongosh)

使用`.tgz`包安装服务器时，需要按照[mongosh安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)下载并安装[mongosh](https://www.mongodb.com/docs/mongodb-shell/)。

### 平台支持[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#platform-support)



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

### 制作说明[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#production-notes)

在生产环境中部署 MongoDB 之前，请考虑 [生产说明](https://www.mongodb.com/docs/manual/administration/production-notes/)文档，其中提供了生产 MongoDB 部署的性能注意事项和配置建议。



## 安装 MongoDB 企业版[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#install-mongodb-enterprise-edition)

### 先决条件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#prerequisites)

使用以下命令安装 MongoDB Enterprise tarball所需的依赖项： `.tgz`

Ubuntu 20.04 (Focal)Ubuntu 18.04 (Bionic)Ubuntu 16.04 (Xenial)

```
sudo apt-get install libcurl4 libgssapi-krb5-2 libldap-2.4-2 libwrap0 libsasl2-2 libsasl2-modules libsasl2-modules-gssapi-mit snmp openssl liblzma5
```



### 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#procedure)

按照以下步骤从`.tgz`.



#### 下载压缩包。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#download-the-tarball)

安装所需的先决条件包后，从以下链接下载 MongoDB Enterprise tarball： `tgz`

➤ [MongoDB 下载中心](https://www.mongodb.com/try/download/enterprise?tck=docs_server)

1. 在**版本**下拉列表中，选择要下载的 MongoDB 版本。
2. 在**平台**下拉列表中，选择您的操作系统版本和体系结构。
3. 在**包**下拉列表中，选择**tgz**。
4. 单击**下载**。



#### 从下载的存档中提取文件。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#extract-the-files-from-the-downloaded-archive)

使用存档管理器程序或`tar`命令，提取文件。

例如，要从终端 shell 中提取，可以使用以下`tar`命令：



## TIP

如果您下载了不同的 MongoDB 6.0 版本，请务必修改命令以反映正确的`.tgz` 文件名。

```
tar -zxvf mongodb-linux-*-6.0.3.tgz
```



#### 选修的。`PATH`确保二进制文件位于环境变量中列出的目录中。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#optional-ensure-the-binaries-are-in-a-directory-listed-in-your-path-environment-variable)

MongoDB 二进制文件位于该`<mongodb-install-directory>/bin/` 目录中。

为避免必须指定 MongoDB 二进制文件的路径，您可以从`PATH`变量中列出的目录创建指向二进制文件的符号链接，例如`/usr/local/bin`. 根据需要更新 `/path/to/the/mongodb-directory/`您的安装目录。

```
sudo ln -s  /path/to/the/mongodb-directory/bin/* /usr/local/bin/
```



或者，您可以将这些二进制文件复制到`PATH`变量中列出的目录中，例如`/usr/local/bin`.

```
sudo cp <mongodb-install-directory>/bin/* /usr/local/bin/
```



#### 安装 MongoDB Shell ( `mongosh`)。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#install-the-mongodb-shell-mongosh)

[安装](https://www.mongodb.com/docs/mongodb-shell/install/) `mongosh`然后使用 MongoDB Shell 连接到您的部署。

`mongosh`从您需要 的版本下载包[MongoDB 下载中心](https://www.mongodb.com/try/download/enterprise?tck=docs_server)并解压缩包。

## 运行 MongoDB 企业版[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#run-mongodb-enterprise-edition)

- ulimit 注意事项

  大多数类 Unix 操作系统限制进程可能使用的系统资源。这些限制可能会对 MongoDB 操作产生负面影响，应该进行调整。有关为您的平台推荐的设置，请参阅[UNIX`ulimit`设置。](https://www.mongodb.com/docs/manual/reference/ulimit/)笔记`ulimit`从 MongoDB 4.4 开始，如果打开文件数的值小于 ，则会生成启动错误 `64000`。

- 配置

  [您可以使用命令行选项或配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)配置 MongoDB 实例（例如数据目录和日志目录规范）[。](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)

### 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#procedure-1)

按照以下步骤运行 MongoDB企业版。这些说明假定您使用的是默认设置。



#### 创建数据和日志目录。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#create-the-data-and-log-directories)

创建 MongoDB 实例存储其数据的目录。例如：

```
sudo mkdir -p /var/lib/mongo
```



创建 MongoDB 实例存储其日志的目录。例如：

```
sudo mkdir -p /var/log/mongodb
```



启动MongoDB进程的用户必须对这些目录有读写权限。例如，如果您打算自己运行 MongoDB：

```
sudo chown `whoami` /var/lib/mongo     # Or substitute another user
sudo chown `whoami` /var/log/mongodb   # Or substitute another user
```



#### 运行 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#run-mongodb)

要运行 MongoDB，请[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在系统提示符下运行该进程。

```
mongod --dbpath /var/lib/mongo --logpath /var/log/mongodb/mongod.log --fork
```



有关命令行选项[`--dbpath`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)和的详细信息[`--logpath`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--logpath)，请参阅 [选项。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-label-mongod-options)



#### 验证 MongoDB 是否已成功启动。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#verify-that-mongodb-has-started-successfully)

通过检查日志文件中以下行的进程输出来验证 MongoDB 是否已成功启动`/var/log/mongodb/mongod.log`：

```
[initandlisten] waiting for connections on port 27017
```

您可能会在过程输出中看到非严重警告。只要看到上面显示的日志行，就可以在初始评估 MongoDB 期间安全地忽略这些警告。



#### 开始使用 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#begin-using-mongodb)

开始一个[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)与 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod).在同一台主机上的会话 。你可以跑[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 没有任何命令行选项来连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在默认端口 27017 上运行的本地主机上。

```
mongosh
```



有关使用连接的更多信息[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，例如连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在不同主机和/或端口上运行的实例，请参阅 [mongosh文档。](https://www.mongodb.com/docs/mongodb-shell/)

为了帮助您开始使用 MongoDB，MongoDB 提供了各种驱动程序版本的[入门指南](https://www.mongodb.com/docs/manual/tutorial/getting-started/#std-label-getting-started)。有关驱动程序文档，请参阅[开始使用 MongoDB 进行开发。](https://api.mongodb.com/)

## 附加信息[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#additional-information)

### 默认绑定本地主机[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/#localhost-binding-by-default)

默认情况下，MongoDB 启动时[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)设置为 `127.0.0.1`，绑定到本地主机网络接口。这意味着`mongod`只能接受来自运行在同一台机器上的客户端的连接。远程客户端将无法连接到`mongod`，并且`mongod`将无法初始化[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)，除非此值设置为有效的网络接口。

该值可以配置为：

- 在 MongoDB 配置文件中使用[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp), 或
- 通过命令行参数[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)



## WARNING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

有关配置的详细信息[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)，请参阅 [IP 绑定。](https://www.mongodb.com/docs/manual/core/security-mongodb-configuration/)

←  [在 Ubuntu 上安装 MongoDB 企业版](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/)                                                       [在 Debian 上安装 MongoDB 企业版](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-debian/) →

原文链接 -https://docs.mongodb.com/manual/tutorial/install-mongodb-enterprise-on-ubuntu-tarball/

译者：陆文龙

