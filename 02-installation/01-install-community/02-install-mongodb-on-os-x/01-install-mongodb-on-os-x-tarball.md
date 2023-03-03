# `.tgz`使用Tarball在 macOS 上安装 MongoDB Community



## NOTE

### MongoDB Atlas

[MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server) 是云中托管的 MongoDB 服务选项，无需安装开销，并提供免费套餐以供入门。

## 概述[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#overview)

使用本教程使用下载的`.tgz` tarball在 macOS 上手动安装 MongoDB 6.0 Community Edition 。

### MongoDB 版本[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#mongodb-version)

本教程安装 MongoDB 6.0 Community Edition。要安装不同版本的 MongoDB Community ，请使用此页面左上角的版本下拉菜单选择该版本的文档。

### 安装方法[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#installation-method)

虽然 MongoDB 可以通过下载的`.tgz` tarball 手动安装，如本文档所述，但建议尽可能使用系统上的 `brew`包管理器来安装 MongoDB。使用包管理器会自动安装所有需要的依赖项，提供一个示例`mongod.conf`文件来帮助您入门，并简化未来的升级和维护任务。

➤有关说明，请参阅[使用 brew 包管理器安装 MongoDB](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/) 。

## 注意事项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#considerations)

### MongoDB shell，`mongosh`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#mongodb-shell--mongosh)

使用`.tgz`包安装服务器时，需要按照[mongosh安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)下载并安装[mongosh](https://www.mongodb.com/docs/mongodb-shell/)。

### 平台支持[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#platform-support)



## NOTE

### 停产通知

- MongoDB 5.0 Community Edition 移除对 macOS 10.13 的支持

MongoDB 6.0 社区版支持 macOS 10.14 或更高版本。

有关详细信息，请参阅[平台支持](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms)。

### 制作说明[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#production-notes)

在生产环境中部署 MongoDB 之前，请考虑 [生产说明](https://www.mongodb.com/docs/manual/administration/production-notes/)文档，其中提供了生产 MongoDB 部署的性能注意事项和配置建议。



## 安装 MongoDB 社区版[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#install-mongodb-community-edition)

按照以下步骤下载`.tgz`包.



### 下载压缩包。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#download-the-tarball)

从以下链接下载 MongoDB社区压缩包： `tgz`

➤ [MongoDB 下载中心](https://www.mongodb.com/try/download/community?tck=docs_server)

1. 在**版本**下拉列表中，选择要下载的 MongoDB 版本。
2. 在**平台**下拉列表中，选择**macOS**。
3. 在**包**下拉列表中，选择**tgz**。
4. 单击**下载**。



### 从下载的存档中提取文件。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#extract-the-files-from-the-downloaded-archive)

```
tar -zxvf mongodb-macos-x86_64-6.0.tgz
```



如果您的 Web 浏览器在下载过程中自动解压缩该文件，则该文件将`.tar`改为结尾。



### `PATH`确保二进制文件位于环境变量中列出的目录中。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#ensure-the-binaries-are-in-a-directory-listed-in-your-path-environment-variable)

MongoDB 二进制文件位于`bin/`tarball 的目录中。您可以：

- 将二进制文件复制到变量中列出的目录中`PATH` ，例如`/usr/local/bin`（根据需要更新 `/path/to/the/mongodb-directory/`安装目录）

  ```
  sudo cp /path/to/the/mongodb-directory/bin/* /usr/local/bin/
  ```

  

- 从变量中列出的目录创建指向二进制文件的符号链接`PATH`，例如`/usr/local/bin`（根据需要更新 `/path/to/the/mongodb-directory/`安装目录）：

  ```
  sudo ln -s  /path/to/the/mongodb-directory/bin/* /usr/local/bin/
  ```

  

## 运行 MongoDB 社区版[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#run-mongodb-community-edition)

- ulimit 注意事项

  大多数类 Unix 操作系统限制进程可能使用的系统资源。这些限制可能会对 MongoDB 操作产生负面影响，应该进行调整。有关为您的平台推荐的设置，请参阅[UNIX`ulimit`设置。](https://www.mongodb.com/docs/manual/reference/ulimit/)
  
  >**NOTE**
  >
  >从 MongoDB 4.4 开始，如果打开文件数的`ulimit`值小于`64000` ，则会生成启动错误 。
  
  

### 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#procedure)

按照以下步骤运行 MongoDB社区版。这些说明假定您使用的是默认设置。



#### 创建数据目录。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#create-the-data-directory)

在第一次启动 MongoDB 之前，您必须创建[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)进程将写入数据的目录。

例如，要创建`/usr/local/var/mongodb`目录：

```
sudo mkdir -p /usr/local/var/mongodb
```





## IMPORTANT

从 macOS 10.15 Catalina 开始，Apple 限制访问 MongoDB 默认数据目录`/data/db`. 在 macOS 10.15 Catalina 上，您必须使用不同的数据目录，例如 `/usr/local/var/mongodb`.



#### 创建日志目录。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#create-the-log-directory)

您还必须创建`mongod`进程将在其中写入其日志文件的目录：

例如，要创建`/usr/local/var/log/mongodb`目录：

```
sudo mkdir -p /usr/local/var/log/mongodb
```





#### 设置数据和日志目录的权限。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#set-permissions-for-the-data-and-log-directories)

确保运行的用户帐户[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)对这两个目录具有读写权限。如果您 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)以自己的用户帐户运行，并且刚刚创建了上面的两个目录，那么您的用户应该已经可以访问它们了。否则，您可以使用`chown`设置所有权，替换适当的用户：

```
sudo chown my_mongodb_user /usr/local/var/mongodb
sudo chown my_mongodb_user /usr/local/var/log/mongodb
```





#### 运行 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#run-mongodb)

要运行 MongoDB，请[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在系统提示符下运行进程，提供 上面的两个参数`dbpath`和 在后台运行的参数。或者，您可以选择将 、 、 和许多其他参数的值存储在配置文件 [中](https://www.mongodb.com/docs/manual/reference/configuration-options/)[。](https://www.mongodb.com/docs/manual/reference/configuration-options/)`logpath``fork`[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)`dbpath``logpath``fork`

##### `mongod`使用命令行参数运行[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#run-mongod-with-command-line-parameters)

在系统提示符下运行该[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)过程，直接在命令行上提供三个必要的参数：

```
mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork
```



##### `mongod`使用配置文件运行[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#run-mongod-with-a-configuration-file)

在系统提示符下运行该[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)过程，提供 [配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)的路径 和`config`参数：

```
mongod --config /usr/local/etc/mongod.conf
```





## NOTE

### macOS 阻止 mongod 打开

macOS 可能会在安装后阻止[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)运行。如果您在开始时收到安全错误，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 表明无法识别或验证开发人员，请执行以下操作以授予[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)运行权限：

- 打开*系统偏好设置*
- 选择*安全和隐私*窗格。
- 在“*常规*”选项卡下，单击“关于”消息右侧的按钮[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，标记为“仍然**打开**”或“**仍然允许**”，具体取决于您的 macOS 版本。



#### 验证 MongoDB 是否已成功启动。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#verify-that-mongodb-has-started-successfully)

验证 MongoDB 是否启动成功：

```
ps aux | grep -v grep | grep mongod
```



如果您没有看到`mongod`正在运行的进程，请检查日志文件中是否有任何错误消息。



#### 开始使用 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#begin-using-mongodb)

开始一个[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)与 .在同一台主机上的会话 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。你可以跑[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 没有任何命令行选项连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在您的*本地主机*上运行的默认端口*27017*：

```
mongosh
```





## NOTE

### macOS 阻止 mongosh 打开

macOS 可能会阻止[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)从安装后运行。如果您在启动时收到安全错误[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 表示无法识别或验证开发者，请执行以下操作以授予[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)访问运行：

- 打开*系统偏好设置*
- 选择*安全和隐私*窗格。
- 在“*常规*”选项卡下，单击有关消息右侧的按钮[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，标记为“仍然**打开**”或“**仍然允许**”，具体取决于您的 macOS 版本。

有关使用连接的更多信息[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，例如连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在不同主机和/或端口上运行的实例，请参阅 [mongosh文档。](https://www.mongodb.com/docs/mongodb-shell/)

为了帮助您开始使用 MongoDB，MongoDB 提供了各种驱动程序版本的[入门指南](https://www.mongodb.com/docs/manual/tutorial/getting-started/#std-label-getting-started)。有关可用版本，请参阅 [入门](https://www.mongodb.com/docs/manual/tutorial/getting-started/#std-label-getting-started)。

## 附加信息[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#additional-information)

### 默认绑定本地主机[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/#localhost-binding-by-default)

默认情况下，MongoDB 启动时[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)设置为 `127.0.0.1`，绑定到本地主机网络接口。这意味着`mongod`只能接受来自运行在同一台机器上的客户端的连接。远程客户端将无法连接到`mongod`，并且`mongod`将无法初始化[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)，除非此值设置为有效的网络接口。

该值可以配置为：

- 在 MongoDB 配置文件中使用[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp), 或
- 通过命令行参数[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)



## 警告

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

有关配置的详细信息[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)，请参阅 [IP 绑定。](https://www.mongodb.com/docs/manual/core/security-mongodb-configuration/)

←  [在 macOS 上安装 MongoDB 社区版](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)[在 Windows 上安装 MongoDB 社区版](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/) →

原文链接 -  https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x-tarball/

译者：陆文龙
