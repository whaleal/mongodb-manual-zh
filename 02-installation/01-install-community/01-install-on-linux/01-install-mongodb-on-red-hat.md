# 在 Red Hat 或 CentOS 上安装 MongoDB Community Edition



## NOTE

### MongoDB atlas

[MongoDB atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server) 是云中托管的 MongoDB 服务选项，无需安装开销，并提供免费套餐以供入门。

## 概述[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#overview)

使用`yum`本教程使用包管理器在 Red Hat Enterprise Linux、CentOS Linux 或 Oracle Linux [1 ](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#footnote-oracle-linux)上安装 MongoDB 6.0 Community Edition。

### MongoDB 版本[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#mongodb-version)

本教程安装 MongoDB 6.0 Community Edition。要安装不同版本的 MongoDB Community ，请使用此页面左上角的版本下拉菜单选择该版本的文档。

## 注意事项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#considerations)

### 平台支持[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#platform-support)



## NOTE

### 停产通知

- MongoDB 5.0 Community Edition 移除了 对[x86_64上的](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-x86_64)RHEL / CentOS / Oracle 6 的 支持
- MongoDB 5.0 Community Edition 在[s390x上移除了对](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-s390x)RHEL / CentOS / Oracle 7 的 支持

MongoDB 6.0 Community Edition在[x86_64](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-x86_64)架构上支持以下 **64 位**版本的 Red Hat Enterprise Linux (RHEL)、CentOS Linux、Oracle Linux [[ 1 \]](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#footnote-oracle-linux)、Rocky Linux 和 AlmaLinux [[ 2 \] ：](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#footnote-rocky-almalinux-note)

- RHEL / CentOS / Oracle / Rocky / AlmaLinux 9
- RHEL / CentOS / Oracle / Rocky / AlmaLinux 8
- RHEL / CentOS / 甲骨文 7
- RHEL / CentOS / 甲骨文 6

MongoDB 仅支持这些平台的 64 位版本。

RHEL / CentOS / Oracle / Rocky / AlmaLinux上的MongoDB 6.0 Community Edition 在 特定平台上也支持[ARM64](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-ARM64)架构。

有关详细信息，请参阅[平台支持](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms)。

| [ 1 ] | *( [1](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#ref-oracle-linux-id1) , [2](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#ref-oracle-linux-id1) )* MongoDB 仅支持运行 Red Hat 兼容内核 (RHCK) 的 Oracle Linux。MongoDB 不**支持**Unbreakable Enterprise Kernel (UEK)。 |
| ----- | ------------------------------------------------------------ |
|       |                                                              |

| [ [2](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#ref-rocky-almalinux-note-id2) ] | 为 RHEL 版本 8.0+ 发布的 MongoDB 本地产品与 Rocky Linux 版本 8.0+ 和 AlmaLinux 版本 8.0+ 兼容并受其支持，具体取决于这些发行版履行其提供完全 RHEL 兼容性的义务。 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |

### 制作说明[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#production-notes)

在生产环境中部署 MongoDB 之前，请考虑 [生产说明](https://www.mongodb.com/docs/manual/administration/production-notes/)文档，其中提供了生产 MongoDB 部署的性能注意事项和配置建议。



## 安装 MongoDB 社区版[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#install-mongodb-community-edition)

使用`yum`安装 MongoDB Community Edition 。



### 配置包管理系统 ( `yum`)。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#configure-the-package-management-system-yum)

创建一个`/etc/yum.repos.d/mongodb-org-6.0.repo`文件，以便您可以直接使用`yum`命令安装 MongoDB ：

```
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
```



您也可以`.rpm`直接从以下网址下载文件 [MongoDB 存储库](https://repo.mongodb.org/yum/redhat/). 下载 Red Hat / CentOS 版本（例如`7`）、MongoDB [发行版](https://www.mongodb.com/docs/manual/reference/versioning/) （例如`6.0`）、体系结构（例如`x86_64`）组织。

在 MongoDB 5.0 之前，奇数 MongoDB 发行版本，例如 `4.3`，是开发版本。从 MongoDB 5.1 开始，MongoDB 每季度快速发布一次。有关快速和长期支持版本之间差异的更多信息，请参阅 [MongoDB 版本控制。](https://www.mongodb.com/docs/manual/reference/versioning/#std-label-release-version-numbers)



### 安装 MongoDB 包。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#install-the-mongodb-packages)

要安装最新稳定版本的 MongoDB，请发出以下命令：

```
sudo yum install -y mongodb-org
```



或者，要安装特定版本的 MongoDB，请单独指定每个组件包并将版本号附加到包名称，如以下示例所示：

```
sudo yum install -y mongodb-org-6.0.3 mongodb-org-database-6.0.3 mongodb-org-server-6.0.3 mongodb-mongosh-6.0.3 mongodb-org-mongos-6.0.3 mongodb-org-tools-6.0.3
```



您可以指定任何可用版本的 MongoDB。但是`yum` 当更新版本可用时升级软件包。为防止意外升级，请固定包。要固定包，请将以下`exclude`指令添加到您的`/etc/yum.conf`文件中：

```
exclude=mongodb-org,mongodb-org-database,mongodb-org-server,mongodb-mongosh,mongodb-org-mongos,mongodb-org-tools
```



## 运行 MongoDB 社区版[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#run-mongodb-community-edition)

### 先决条件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#prerequisites)

#### 限制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#ulimit)

大多数类 Unix 操作系统限制进程可能使用的系统资源。这些限制可能会对 MongoDB 操作产生负面影响，应该进行调整。有关为您的平台推荐的设置，请参阅[UNIX`ulimit`设置。](https://www.mongodb.com/docs/manual/reference/ulimit/)



## NOTE

`ulimit`从 MongoDB 4.4 开始，如果打开文件数的值小于`64000` ，则会生成启动错误 。

#### 目录路径[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#directory-paths)

##### 使用默认目录[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#to-use-default-directories)

默认情况下，MongoDB 使用`mongod`用户帐户运行并使用以下默认目录：

- `/var/lib/mongo`（数据目录）
- `/var/log/mongodb`（日志目录）

包管理器在安装期间创建默认目录。所有者和组名称是`mongod`。

##### 使用非默认目录[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#to-use-non-default-directories)

要使用默认目录以外的数据目录和/或日志目录：

1. 创建一个或多个新目录。

2. 编辑配置文件`/etc/mongod.conf`并相应修改以下字段：

   - [`storage.dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)指定新的数据目录路径（例如`/some/data/directory`）
   - [`systemLog.path`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-systemLog.path)指定新的日志文件路径（例如`/some/log/directory/mongod.log`）

3. 确保运行 MongoDB 的用户有权访问一个或多个目录：

   ```
   sudo chown -R mongod:mongod <directory>
   ```

   

   如果更改运行 MongoDB 进程的用户，则**必须**授予新用户访问这些目录的权限。

4. 如果强制执行，请配置 SELinux。看[配置 SELinux 。](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#std-label-install-rhel-configure-selinux)



#### 配置 SELinux[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#configure-selinux)

从 MongoDB 5.0 开始，新的 SELinux 策略可用于 MongoDB 安装：

- 使用`.rpm`安装程序。
- 使用默认配置设置。
- 在 RHEL7 或 RHEL8 上运行。

如果您的安装不满足这些要求，请参阅软件`.tgz`包的 SELinux 说明[。](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#std-label-install-enterprise-tarball-rhel-configure-selinux)



## NOTE

如果您的 MongoDB 部署使用以下任何一项的自定义设置：

- [MongoDB 连接端口](https://www.mongodb.com/docs/manual/reference/default-mongodb-port/)
- [`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)
- [`systemLog.path`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-systemLog.path)
- [`pidFilePath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-processManagement.pidFilePath)

您不能使用 MongoDB 提供的 SELinux 策略。另一种方法是创建[自定义 SELinux 策略](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#std-label-install-enterprise-tarball-rhel-configure-selinux)，但是编写不当的自定义策略可能会降低安全性或可能会阻止您的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例运行。

##### 安装 SELinux 策略[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#install-the-selinux-policy)

1. 确保您安装了以下软件包：

   - `git`
   - `make`
   - `checkpolicy`
   - `policycoreutils`
   - `selinux-policy-devel`

   ```
   sudo yum install git make checkpolicy policycoreutils selinux-policy-devel
   ```

   

2. 下载策略存储库。

   ```
   git clone https://github.com/mongodb/mongodb-selinux
   ```

   

3. 制定政策。

   ```
   cd mongodb-selinux
   make
   ```

   

4. 应用政策。

   ```
   sudo make install
   ```

   



## IMPORTANT

### 向后不兼容的特性

从 MongoDB 5.1 开始，您必须从之前克隆 SELinux 策略的目录运行以下命令，然后才能降级到更早的 MongoDB 版本：

```
sudo make uninstall
```



##### SELinux 策略注意事项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#selinux-policy-considerations)

- SELinux 策略旨在与标准 MongoDB`.rpm`包安装产生的配置一起使用。看 [标准安装假设](https://github.com/mongodb/mongodb-selinux/blob/master/README.md#standard-installation) 更多细节。

- SELinux 策略是为[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)服务器设计的。它不适用于其他 MongoDB 守护进程或工具，例如：

  - [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)
  - [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)
  - [安装和配置 mongocryptd](https://www.mongodb.com/docs/manual/core/csfle/reference/mongocryptd/#std-label-mongocryptd)

- 这[参考政策](https://github.com/SELinuxProject/refpolicy/blob/master/policy/modules/services/mongodb.if) SELinux 项目提供的包含一个`mongodb_admin`宏。此宏不包含在 MongoDB SELinux 策略中。`unconfined_t`域中 的管理员可以管理[`mongod`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

- 要卸载策略，请转到下载策略存储库的目录并运行：

  ```
  sudo make uninstall
  ```

  

### 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#procedure)

按照以下步骤在您的系统上运行 MongoDB Community Edition。这些说明假定您使用的是默认设置。

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

 

#### 启动 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#start-mongodb)

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



#### 验证 MongoDB 是否已成功启动。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#verify-that-mongodb-has-started-successfully)

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)您可以通过发出以下命令来验证进程是否已成功启动：

```
sudo systemctl status mongod
```



您可以选择通过发出以下命令确保 MongoDB 将在系统重启后启动：

```
sudo systemctl enable mongod
```





#### 停止 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#stop-mongodb)

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)根据需要，您可以通过发出以下命令来停止该过程：

```
sudo systemctl stop mongod
```





#### 重新启动 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#restart-mongodb)

您可以[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)通过发出以下命令来重新启动该过程：

```
sudo systemctl restart mongod
```



您可以通过查看文件中的输出来跟踪错误或重要消息的过程状态`/var/log/mongodb/mongod.log`。



#### 开始使用 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#begin-using-mongodb)

开始一个[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)与 .在同一台主机上的会话 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。你可以跑[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 没有任何命令行选项来连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在默认端口 27017 上运行的本地主机上。

```
mongosh
```



有关使用连接的更多信息[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，例如连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在不同主机和/或端口上运行的实例，请参阅 [mongosh文档。](https://www.mongodb.com/docs/mongodb-shell/)

为了帮助您开始使用 MongoDB，MongoDB 提供了各种驱动程序版本的[入门指南](https://www.mongodb.com/docs/manual/tutorial/getting-started/#std-label-getting-started)。有关驱动程序文档，请参阅[开始使用 MongoDB 进行开发。](https://api.mongodb.com/)

## 卸载 MongoDB 社区版[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#uninstall-mongodb-community-edition)

要从系统中完全删除 MongoDB，您必须删除 MongoDB 应用程序本身、配置文件以及任何包含数据和日志的目录。以下部分将指导您完成必要的步骤。



## WARNING

此过程将*完全*删除 MongoDB、其配置和*所有* 数据库。此过程不可逆，因此请确保在继续之前备份所有配置和数据。



### 停止 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#stop-mongodb-2)

[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)通过发出以下命令停止进程：

```
sudo service mongod stop
```





### 删除包。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#remove-packages)

删除您之前安装的所有 MongoDB 包。

```
sudo yum erase $(rpm -qa | grep mongodb-org)
```





### 删除数据目录。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#remove-data-directories)

删除 MongoDB 数据库和日志文件。

```
sudo rm -r /var/log/mongodb
sudo rm -r /var/lib/mongo
```



## 附加信息[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#additional-information)

### 默认绑定本地主机[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#localhost-binding-by-default)

默认情况下，MongoDB 启动时[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)设置为 `127.0.0.1`，绑定到本地主机网络接口。这意味着`mongod`只能接受来自运行在同一台机器上的客户端的连接。远程客户端将无法连接到`mongod`，并且`mongod`将无法初始化[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)，除非此值设置为有效的网络接口。

该值可以配置为：

- 在 MongoDB 配置文件中使用[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp), 或
- 通过命令行参数[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)



## WARNING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

有关配置的详细信息[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)，请参阅 [IP 绑定。](https://www.mongodb.com/docs/manual/core/security-mongodb-configuration/)

### MongoDB 社区版包[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#mongodb-community-edition-packages)

MongoDB Community Edition 可从其自己的专用存储库获得，并包含以下官方支持的包：

| 包裹名字               | 描述                                                         |
| :--------------------- | :----------------------------------------------------------- |
| `mongodb-org`          | 一个`metapackage`自动安装下面列出的组件包的。                |
| `mongodb-org-database` | 一个`metapackage`自动安装下面列出的组件包的。包裹名字描述`mongodb-org-server`包含[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)守护程序、关联的初始化脚本和[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)( `/etc/mongod.conf`)。您可以使用初始化脚本从[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 配置文件开始。有关详细信息，请参阅上面的“运行 MongoDB 社区版”部分。`mongodb-org-mongos`包含[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)守护进程。 |
| `mongodb-mongosh`      | 包含 MongoDB shell ([`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)). |
| `mongodb-org-tools`    | 一个`metapackage`自动安装下面列出的组件包的：包裹名字描述`mongodb-database-tools`包含以下 MongoDB 数据库工具：[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)[`bsondump`](https://www.mongodb.com/docs/database-tools/bsondump/#mongodb-binary-bin.bsondump)[`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)[`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)[`mongostat`](https://www.mongodb.com/docs/database-tools/mongostat/#mongodb-binary-bin.mongostat)[`mongotop`](https://www.mongodb.com/docs/database-tools/mongotop/#mongodb-binary-bin.mongotop)[`mongofiles`](https://www.mongodb.com/docs/database-tools/mongofiles/#mongodb-binary-bin.mongofiles)`mongodb-org-database-tools-extra`包含[`install_compass`](https://www.mongodb.com/docs/manual/reference/program/install_compass/#std-label-install-compass)脚本 |

←  [在 Linux 上安装 MongoDB 社区版](https://www.mongodb.com/docs/manual/administration/install-on-linux/)                                  [使用 .tgz Tarball 在 Red Hat 或 CentOS 上安装 MongoDB Community](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat-tarball/) →

原文链接 -https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/

译者：陆文龙

