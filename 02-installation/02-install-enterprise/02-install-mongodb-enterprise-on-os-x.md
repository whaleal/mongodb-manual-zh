##  在Mac OS安装MongoDB企业版



> 笔记:
>
> [MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server) 是MongoDB公司提供的MongoDB云服务，无需安装开销，并提供免费的入门套餐。

### 概述

使用本教程，可以使用下载的`.tgz`tarball 在macOS上手动安装MongoDB 7.0企业版 。

[MongoDB 企业版](https://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server) 在某些平台上可用，并且包含对与安全性和监视相关的多种功能的支持。

#### MongoDB版本

本教程将安装MongoDB 7.0企业版。要安装其他版本的MongoDB企业版，请使用此页面左上角的版本下拉菜单选择该版本的文档。

### 注意事项

#### MongoDB Shell，`mongosh`

使用该`.tgz`包安装服务器时，需要按照[mongosh安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)下载并安装[mongosh](https://www.mongodb.com/docs/mongodb-shell/)分别地。

#### 平台支持

> 笔记
>
> **停产通知**
>
> - MongoDB 5.0 企业版删除了对 macOS 10.13 的支持
>
> 

MongoDB 7.0企业版支持macOS 10.14或更高版本。

有关更多信息，请参见[支持的平台](https://www.mongodb.com/docs/v7.0/administration/production-notes/)。

#### 生产注意事项

在生产环境中部署MongoDB之前，请考虑 [生产说明](https://docs.mongodb.com/v4.2/administration/production-notes/)文档，该文档提供了生产MongoDB部署的性能注意事项和配置建议。

###  安装MongoDB企业版

请按照以下步骤从 `.tgz`中手动安装MongoDB 企业版。

### Intel芯片

#### 1、下载压缩包。

从以下链接下载MongoDB企业版`tgz`tarball：

➤ [MongoDB的下载中心](https://www.mongodb.com/try/download/enterprise?tck=docs_server)

1. 在“ **版本”**下拉列表中，选择要下载的MongoDB版本。
2. 在**平台**下拉列表中，选择**macOS**。
3. 在**包**下拉列表中，选择**tgz**。
4. 点击**下载**。

#### 2、从下载的档案中提取文件。

复制

```
tar -zxvf mongodb-macos-x86_64-enterprise-7.0.tgz
```

如果您的网络浏览器在下载过程中自动将文件解压缩，则文件将以`.tar`结尾。

#### 3、确保二进制文件在`PATH`环境变量列出的目录中。

MongoDB二进制文件位于tarball`bin/`目录中。您可以：

- 将二进制文件复制到`PATH` 变量中列出的目录中，例如`/usr/local/bin`（根据需要更新 `/path/to/the/mongodb-directory/`安装目录）

  复制

  
  
- 从`PATH`变量中列出的目录创建指向二进制文件的符号链接，例如`/usr/local/bin`（根据需要更新 `/path/to/the/mongodb-directory/`安装目录）：

  复制

  ```
  sudo ln -s  /path/to/the/mongodb-directory/bin/* /usr/local/bin/
  ```

### Apple silicon芯片

#### 1、下载压缩包

从以下链接下载 MongoDB 企业版： `tgz`

➤ [MongoDB 下载中心](https://www.mongodb.com/try/download/enterprise?tck=docs_server)

1. 在**版本**下拉列表中，选择要下载的 MongoDB 版本。
2. 在**平台**下拉列表中，选择 **macOS ARM 64**。
3. 在**包**下拉列表中，选择**tgz**。
4. 单击**“下载”**。

#### 2、从下载的存档中提取文件。

MongoDB 二进制文件位于`bin/`tarball 的目录中。您可以：

- 将二进制文件复制到变量中列出的目录中`PATH`，例如 `/usr/local/bin`. 替换`/path/to/the/mongodb-directory/`为您的安装目录

  ```
  sudo cp /path/to/the/mongodb-directory/bin/* /usr/local/bin/
  ```

- 从变量中列出的目录创建指向二进制文件的符号链接`PATH` ，例如`/usr/local/bin`. 替换 `/path/to/the/mongodb-directory/`为您的安装目录。

  ```
  sudo ln -s  /path/to/the/mongodb-directory/bin/* /usr/local/bin/
  ```

### 运行MongoDB企业版

**ulimit 注意事项**

大多数类 Unix 操作系统都会限制进程可以使用的系统资源。这些限制可能会对 MongoDB 操作产生负面影响，应该进行调整。请参阅[UNIX`ulimit`设置](https://www.mongodb.com/docs/v7.0/reference/ulimit/)以获取针对您的平台的推荐设置。

> 笔记
>
> `ulimit`从 MongoDB 4.4 开始，如果打开文件数的值低于 ，则会生成启动错误 `64000`。

#### 过程

请按照以下步骤运行MongoDB企业版。这些说明假定您使用的是默认设置。

##### 1、创建数据目录。

首次启动MongoDB之前，必须创建该[`mongod`](https://docs.mongodb.com/v4.2/reference/program/mongod/bin.mongod)进程将向其写入数据的目录。

例如，创建`~/data/db`目录：

复制

```
sudo mkdir -p ~/data/db
```

##### 2、创建日志目录。

您还必须创建该`mongod`进程将在其中写入其日志文件的目录：

例如，创建`~/data/log/mongodb`目录：

复制

```
sudo mkdir -p ~/data/log/mongodb
```

##### 3、设置数据和日志目录的权限。

确保正在运行的用户帐户[`mongod`](https://docs.mongodb.com/v4.2/reference/program/mongod/bin.mongod)对这两个目录具有读写权限。如果您以自己的用户帐户运行[`mongod`](https://docs.mongodb.com/v4.2/reference/program/mongod/bin.mongod)，并且刚刚在上面创建了两个目录，则用户应该已经可以访问它们。否则，您可以用`chown`来设置所有权，以替换适当的用户：

复制

```
sudo chown <user> ~/data/db
sudo chown <user> ~/data/log/mongodb
```

##### 4、运行MongoDB。

要运行MongoDB，请在系统提示符下运行[`mongod`](https://docs.mongodb.com/v4.2/reference/program/mongod/bin.mongod)过程，从上方提供`dbpath`和`logpath` 两个参数，并在后台`fork`该参数运行[`mongod`](https://docs.mongodb.com/v4.2/reference/program/mongod/bin.mongod)。另外，您也可以选择在 [配置文件](https://docs.mongodb.com/v4.2/reference/configuration-options/)中存储`dbpath`，`logpath`，`fork`值和许多其他的参数。

 使用命令行参数运行`mongod`

在系统提示符下运行该[`mongod`](https://docs.mongodb.com/v4.2/reference/program/mongod/bin.mongod)过程，直接在命令行上提供三个必需的参数：

复制

```
mongod --dbpath ~/data/db --logpath ~/data/log/mongodb/mongo.log --fork

```

 使用配置文件运行`mongod`

在系统提示符下运行[`mongod`](https://docs.mongodb.com/v4.2/reference/program/mongod/bin.mongod)过程，并使用`config`参数提供[配置文件](https://docs.mongodb.com/v4.2/reference/configuration-options/)的路径 ：

复制

```
mongod --config /usr/local/etc/mongod.conf
```

> 笔记:
>
> **MACOS阻止`MONGOD`打开**
>
> `mongod`安装后，macOS可能无法运行。如果在启动时收到安全错误，`mongod` 显示无法识别或验证开发人员，请执行以下操作以授予`mongod`运行权限：
>
> - 打开*系统偏好设置*
> - 选择“ *安全性和隐私”*窗格。
> - 在*常规*选项卡下，单击关于`mongod`消息右侧的按钮，根据您的macOS版本标记为“始终**打开”** 或“ **始终允许”**。
>
> 

##### 5、验证MongoDB已成功启动。

验证MongoDB已成功启动：

复制

```
ps aux | grep -v grep | grep mongod
```

如果看不到`mongod`进程正在运行，请检查日志文件中是否有任何错误消息。

##### 6、开始使用MongoDB。

在相同的主机上启动[`mongo`](https://docs.mongodb.com/v4.2/reference/program/mongo/bin.mongo) shell 作为[`mongod`](https://docs.mongodb.com/v4.2/reference/program/mongod/bin.mongod)。您可以在不使用任何命令行选项的情况下运行[`mongo`](https://docs.mongodb.com/v4.2/reference/program/mongo/bin.mongo) shell ，以使用默认端口*27017*连接到在*本地主机*上*运行的*[`mongod`](https://docs.mongodb.com/v4.2/reference/program/mongod/bin.mongod)：

复制

```
mongosh
```

有关使用连接的更多信息[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，例如连接到[`mongod`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#mongodb-binary-bin.mongod)在不同主机和/或端口上运行的实例，请参阅 [mongosh文档。](https://www.mongodb.com/docs/mongodb-shell/)

为了帮助您开始使用 MongoDB，MongoDB 提供了各种驱动程序版本的[入门指南。](https://www.mongodb.com/docs/v7.0/tutorial/getting-started/#std-label-getting-started)请参阅 [入门](https://www.mongodb.com/docs/v7.0/tutorial/getting-started/#std-label-getting-started)了解可用版本。

### 其他信息

#### 默认为localhost绑定

默认情况下，MongoDB在启动时将[`bindIp`](https://docs.mongodb.com/v4.2/reference/configuration-options/net.bindIp)设置为 `127.0.0.1`，该绑定到localhost网络接口。这意味着`mongod`只能接受来自同一计算机上运行的客户端的连接。除非将此值设置为有效的网络接口，否则远程客户端将无法连接到`mongod`，并且`mongod`不能初始化[副本集](https://docs.mongodb.com/v4.2/reference/glossary/term-replica-set)。

可以配置以下值：

- 在MongoDB配置文件中使用[`bindIp`](https://docs.mongodb.com/v4.2/reference/configuration-options/net.bindIp)，或
- 通过命令行参数 [`--bind_ip`](https://docs.mongodb.com/v4.2/reference/program/mongod/cmdoption-mongod-bind-ip)

>  警告
>
> 绑定到非本地主机（例如，可公共访问）的IP地址之前，请确保已保护群集免受未经授权的访问。有关安全建议的完整列表，请参阅“ [安全清单”](https://docs.mongodb.com/v4.2/administration/security-checklist/)。至少应考虑 [启用身份验证](https://docs.mongodb.com/v4.2/administration/security-checklist/checklist-auth)并 [强化网络基础架构](https://docs.mongodb.com/v4.2/core/security-hardening/)。

有关配置的更多信息[`bindIp`](https://docs.mongodb.com/v4.2/reference/configuration-options/net.bindIp)，请参见 [IP绑定](https://docs.mongodb.com/v4.2/core/security-mongodb-configuration/)。



原文链接：https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-enterprise-on-os-x/

译者：韩鹏帅
