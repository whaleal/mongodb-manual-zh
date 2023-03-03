# 使用 .tgz Tarball 在 Red Hat 或 CentOS 上安装 MongoDB Enterprise



## NOTE

### MongoDB Atlas

[MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server) 是云中托管的 MongoDB 服务选项，无需安装开销，并提供免费套餐以供入门。

## 概述[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#overview)

使用本教程使用下载的`.tgz`tarball 在 Red Hat Enterprise Linux、CentOS Linux 或 Oracle Linux [1](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#footnote-oracle-linux)上手动安装 MongoDB 6.0企业版。

[MongoDB 企业版](https://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server) 在选定的平台上可用，并包含对与安全和监视相关的多个功能的支持。

### MongoDB 版本[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#mongodb-version)

本教程安装 MongoDB 6.0企业 版。要安装不同版本的 MongoDB Enterprise ，请使用此页面左上角的版本下拉菜单选择该版本的文档。

### 安装方法[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#installation-method)

虽然 MongoDB 可以通过下载的`.tgz` tarball 手动安装，如本文档所述，但建议尽可能使用系统上的 `yum`包管理器来安装 MongoDB。使用包管理器会自动安装所有需要的依赖项，提供一个示例`mongod.conf`文件来帮助您入门，并简化未来的升级和维护任务。

➤有关说明，请参阅[使用 yum 包管理器安装 MongoDB](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat/) 。

## 注意事项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#considerations)

### MongoDB shell，`mongosh`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#mongodb-shell--mongosh)

使用`.tgz`包安装服务器时，需要按照[mongosh安装说明](https://www.mongodb.com/docs/mongodb-shell/install/)下载并安装[mongosh](https://www.mongodb.com/docs/mongodb-shell/)分别地。

### 平台支持[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#platform-support)



## NOTE

### 停产通知

- MongoDB 5.0 企业版取消 对[x86_64上的](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-x86_64)RHEL / CentOS / Oracle 6 的 支持
- MongoDB 企业版 在版本 4.0 和 5.0 之间删除了对RHEL 7 / CentOS / Oracle [PPC64LE的支持。](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-PPC64LE)但是，5.0.X 版本支持这些体系结构。

MongoDB 6.0 企业版在[x86_64](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-x86_64)架构上支持以下 **64 位**版本的 Red Hat Enterprise Linux (RHEL)、CentOS Linux、Oracle Linux [[ 1 \]](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#footnote-oracle-linux)、Rocky Linux 和 AlmaLinux [[ 2 \] ：](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#footnote-rocky-almalinux)

- RHEL / CentOS / Oracle / Rocky / Alma 9
- RHEL / CentOS / 甲骨文 / Rocky / Alma 8
- RHEL / CentOS / 甲骨文 7

MongoDB 仅支持这些平台的 64 位版本。

RHEL / CentOS / Oracle / Rocky / Alma Linux 上的 MongoDB 6.0 企业版 还支持特定平台上的[ARM64](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms-ARM64)架构。

有关详细信息，请参阅[平台支持](https://www.mongodb.com/docs/manual/administration/production-notes/#std-label-prod-notes-supported-platforms)。

| [ 1 ] | *( [1](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#ref-oracle-linux-id1) , [2](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#ref-oracle-linux-id1) )* MongoDB 仅支持运行 Red Hat 兼容内核 (RHCK) 的 Oracle Linux。MongoDB 不**支持**Unbreakable Enterprise Kernel (UEK)。 |
| ----- | ------------------------------------------------------------ |
|       |                                                              |

| [ [2](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#ref-rocky-almalinux-id2) ] | 为 RHEL 版本 8.0+ 发布的 MongoDB 本地产品与 Rocky Linux 版本 8.0+ 和 AlmaLinux 版本 8.0+ 兼容并受其支持，具体取决于这些发行版履行其提供完全 RHEL 兼容性的义务。 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |

### 制作说明[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#production-notes)

在生产环境中部署 MongoDB 之前，请考虑 [生产说明](https://www.mongodb.com/docs/manual/administration/production-notes/)文档，其中提供了生产 MongoDB 部署的性能注意事项和配置建议。



## 安装 MongoDB 企业版[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#install-mongodb-enterprise-edition)

### 先决条件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#prerequisites)

使用以下命令安装 MongoDB Enterprise  `.tgz`tarball所需的依赖项：

RHEL / CentOS 9   RHEL / CentOS 8     RHEL / CentOS 7    RHEL / CentOS 6

```
sudo yum install cyrus-sasl cyrus-sasl-gssapi cyrus-sasl-plain krb5-libs libcurl net-snmp openldap openssl xz-libs
```



### 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#procedure)

按照以下步骤从 .tgz 手动安装 MongoDB 企业版。



#### 下载压缩包。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#download-the-tarball)

安装所需的 先决条件包后，从以下链接下载 MongoDB Enterprise  `tgz`tarball：

➤ [MongoDB 下载中心](https://www.mongodb.com/try/download/enterprise?tck=docs_server)

1. 在**版本**下拉列表中，选择要下载的 MongoDB 版本。
2. 在**平台**下拉列表中，选择您的操作系统版本和体系结构。
3. 在**包**下拉列表中，选择**tgz**。
4. 单击**下载**。



#### 从下载的存档中提取文件。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#extract-the-files-from-the-downloaded-archive)

例如，从系统 shell 中，您可以使用以下`tar`命令提取：

```
tar -zxvf mongodb-linux-*-6.0.3.tgz
```



#### `PATH`确保二进制文件位于环境变量中列出的目录中。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#ensure-the-binaries-are-in-a-directory-listed-in-your-path-environment-variable)

MongoDB 二进制文件位于`bin/`tarball 的目录中。您可以：

- 将二进制文件复制到变量中列出的目录中`PATH` ，例如`/usr/local/bin`（根据需要更新 `/path/to/the/mongodb-directory/`安装目录）

  ```
  sudo cp /path/to/the/mongodb-directory/bin/* /usr/local/bin/
  ```

  

- 从变量中列出的目录创建指向二进制文件的符号链接`PATH`，例如`/usr/local/bin`（根据需要更新 `/path/to/the/mongodb-directory/`安装目录）：

  ```
  sudo ln -s  /path/to/the/mongodb-directory/bin/* /usr/local/bin/
  ```

  

#### 安装 MongoDB Shell ( `mongosh`)。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#install-the-mongodb-shell-mongosh)

[安装](https://www.mongodb.com/docs/mongodb-shell/install/) `mongosh`然后使用 MongoDB Shell 连接到您的部署。

`mongosh`从您需要 的版本下载包[MongoDB 下载中心](https://www.mongodb.com/try/download/enterprise?tck=docs_server)并解压缩包。

## 运行 MongoDB 企业版[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#run-mongodb-enterprise-edition)

### 先决条件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#prerequisites-1)

#### 限制[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#ulimit)

大多数类 Unix 操作系统限制进程可能使用的系统资源。这些限制可能会对 MongoDB 操作产生负面影响，应该进行调整。有关为您的平台推荐的设置，请参阅[UNIX`ulimit`设置。](https://www.mongodb.com/docs/manual/reference/ulimit/)



## NOTE

`ulimit`从 MongoDB 4.4 开始，如果打开文件数的值小于 `64000`，则会生成启动错误 。

#### 目录路径[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#directory-paths)

##### 使用默认目录[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#to-use-default-directories)

默认情况下，MongoDB 使用`mongod`用户帐户运行并使用以下默认目录：

- `/var/lib/mongo`（数据目录）
- `/var/log/mongodb`（日志目录）

创建 MongoDB 数据和日志目录：

```
sudo mkdir -p /var/lib/mongo
sudo mkdir -p /var/log/mongodb
```



默认情况下，MongoDB 使用`mongod`用户帐户运行。创建一个`mongod`和一个`mongodb`组。确保`mongod` 属于该组，然后将这些目录的所有者和组设置为`mongod`：

```
sudo chown -R mongod:mongod /var/lib/mongo
sudo chown -R mongod:mongod /var/log/mongodb
```



##### 使用非默认目录[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#to-use-non-default-directories)

要使用默认目录以外的数据目录和/或日志目录：

1. 创建一个或多个新目录。

2. 编辑配置文件`/etc/mongod.conf`并相应修改以下字段：

   - [`storage.dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)指定新的数据目录路径（例如`/some/data/directory`）
   - [`systemLog.path`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-systemLog.path)指定新的日志文件路径（例如`/some/log/directory/mongod.log`）

3. 确保运行 MongoDB 的用户有权访问一个或多个目录：

   ```
   sudo chown -R mongod:mongod <directory>
   ```

   

   如果更改运行 MongoDB 进程的用户，则**必须** 授予新用户访问这些目录的权限。

4. 如果强制执行，请配置 SELinux。请参阅[配置 SELinux 。](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#std-label-install-rhel-configure-selinux)



#### 配置 SELinux[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#configure-selinux)



## WARNING

配置不当的 SELinux 策略可能不安全或可能使您的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例停止工作。

如果 SELinux 处于`enforcing`模式，您必须为 MongoDB 自定义 SELinux 策略以

- 允许访问`cgroup`
- 允许访问`netstat`

##### 允许访问`cgroup`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#permit-access-to-cgroup)

当前的 SELinux 策略不允许 MongoDB 进程访问`/sys/fs/cgroup`，这是确定系统上可用内存所必需的。如果您打算在 `enforcing`模式下运行 SELinux，则需要对您的 SELinux 策略进行以下调整：

1. 确保您的系统已`checkpolicy`安装软件包：

   ```
   sudo yum install checkpolicy
   ```

   

2. 创建自定义策略文件`mongodb_cgroup_memory.te`：

   ```
   cat > mongodb_cgroup_memory.te <<EOF
   module mongodb_cgroup_memory 1.0;
   
   require {
         type cgroup_t;
         type mongod_t;
         class dir search;
         class file { getattr open read };
   }
   
   #============= mongod_t ==============
   allow mongod_t cgroup_t:dir search;
   allow mongod_t cgroup_t:file { getattr open read };
   EOF
   ```

   

3. 创建后，通过运行以下三个命令编译并加载自定义策略模块：

   ```
   checkmodule -M -m -o mongodb_cgroup_memory.mod mongodb_cgroup_memory.te
   semodule_package -o mongodb_cgroup_memory.pp -m mongodb_cgroup_memory.mod
   sudo semodule -i mongodb_cgroup_memory.pp
   ```

   

MongoDB 进程现在能够在 SELinux 设置为`enforcing`.

##### 允许访问`netstat`FTDC[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#permit-access-to-netstat-for-ftdc)

当前的 SELinux 策略不允许 MongoDB 进程打开和读取`/proc/net/netstat`，这是 [全时诊断数据捕获 (FTDC)](https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/#std-label-ftdc-stub)所必需的。如果您打算在 `enforcing`模式下运行 SELinux，则需要对您的 SELinux 策略进行以下调整：

1. 确保您的系统已`checkpolicy`安装软件包：

   ```
   sudo yum install checkpolicy
   ```

   

2. 创建自定义策略文件`mongodb_proc_net.te`：

   ```
   cat > mongodb_proc_net.te <<EOF
   module mongodb_proc_net 1.0;
   
   require {
       type proc_net_t;
       type mongod_t;
       class file { open read };
   }
   
   #============= mongod_t ==============
   allow mongod_t proc_net_t:file { open read };
   EOF
   ```

   

3. 创建后，通过运行以下三个命令编译并加载自定义策略模块：

   ```
   checkmodule -M -m -o mongodb_proc_net.mod mongodb_proc_net.te
   semodule_package -o mongodb_proc_net.pp -m mongodb_proc_net.mod
   sudo semodule -i mongodb_proc_net.pp
   ```

   



###### 使用自定义 MongoDB 目录路径[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#using-a-custom-mongodb-directory-path)

1. 更新 SELinux 策略以允许`mongod`服务使用新目录：

   ```
   sudo semanage fcontext -a -t <type> </some/MongoDB/directory.*>
   ```

   

   根据需要指定以下类型之一：

   - `mongod_var_lib_t`对于数据目录
   - `mongod_log_t`对于日志文件目录
   - `mongod_var_run_t`对于pid文件目录

   

   ## NOTE

   请务必`.*`在目录末尾包含 。

2. 更新新目录的 SELinux 用户策略：

   ```
   sudo chcon -Rv -u system_u -t <type> </some/MongoDB/directory>
   ```

   

   根据需要指定以下类型之一：

   - `mongod_var_lib_t`对于数据目录
   - `mongod_log_t`对于日志目录
   - `mongod_var_run_t`对于pid文件目录

3. 将更新的 SELinux 策略应用于目录：

   ```
   sudo restorecon -R -v </some/MongoDB/directory>
   ```

   

例如：



## TIP

请务必在操作`.*`目录的末尾包含 `semanage fcontext`。

- 如果使用非默认 MongoDB 数据路径`/mongodb/data`：

  ```
  sudo semanage fcontext -a -t mongod_var_lib_t '/mongodb/data.*'
  sudo chcon -Rv -u system_u -t mongod_var_lib_t '/mongodb/data'
  sudo restorecon -R -v '/mongodb/data'
  ```

  

- 如果使用非默认的 MongoDB 日志目录`/mongodb/log` （例如，如果日志文件路径为`/mongodb/log/mongod.log`）：

  ```
  sudo semanage fcontext -a -t mongod_log_t '/mongodb/log.*'
  sudo chcon -Rv -u system_u -t mongod_log_t '/mongodb/log'
  sudo restorecon -R -v '/mongodb/log'
  ```

  

###### 使用自定义 MongoDB 端口[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#using-a-custom-mongodb-port)

```
sudo semanage port -a -t mongod_port_t -p tcp <portnumber>
```



## IMPORTANT

除了上述之外，如果 SELinux 处于`enforcing`模式中，您还需要针对以下每种情况进一步自定义您的 SELinux 策略：

- 您正在使用**自定义目录路径**而不是对以下任意组合使用默认路径：
  - [`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)
  - [`systemLog.path`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-systemLog.path)
  - [`pidFilePath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-processManagement.pidFilePath)
- 您正在使用**自定义端口**而不是使用[默认的 MongoDB 端口。](https://www.mongodb.com/docs/manual/reference/default-mongodb-port/)
- 如果您对 MongoDB 安装进行了其他修改。

### 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#procedure-1)

按照以下步骤在您的系统上运行 MongoDB企业版。这些说明假定您使用的是默认设置。



#### 创建数据和日志目录。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#create-the-data-and-log-directories)

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



#### 运行 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#run-mongodb)

要运行 MongoDB，请[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在系统提示符下运行该进程。

```
mongod --dbpath /var/lib/mongo --logpath /var/log/mongodb/mongod.log --fork
```



有关命令行选项[`--dbpath`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)和的详细信息[`--logpath`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--logpath)，请参阅 [选项。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-label-mongod-options)



#### 验证 MongoDB 是否已成功启动。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#verify-that-mongodb-has-started-successfully)

通过检查日志文件中以下行的进程输出来验证 MongoDB 是否已成功启动`/var/log/mongodb/mongod.log`：

```
[initandlisten] waiting for connections on port 27017
```

您可能会在过程输出中看到非严重警告。只要看到上面显示的日志行，就可以在初始评估 MongoDB 期间安全地忽略这些警告。



#### 开始使用 MongoDB。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#begin-using-mongodb)

开始一个[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)与 .在同一台主机上的会话 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。你可以跑[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 没有任何命令行选项来连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在默认端口 27017 上运行的本地主机上。

```
mongosh
```



有关使用连接的更多信息[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，例如连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在不同主机和/或端口上运行的实例，请参阅 [mongosh文档。](https://www.mongodb.com/docs/mongodb-shell/)

为了帮助您开始使用 MongoDB，MongoDB 提供了各种驱动程序版本的[入门指南](https://www.mongodb.com/docs/manual/tutorial/getting-started/#std-label-getting-started)。有关驱动程序文档，请参阅[开始使用 MongoDB 进行开发。](https://api.mongodb.com/)

## 附加信息[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#additional-information)

### 默认绑定本地主机[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/#localhost-binding-by-default)

默认情况下，MongoDB 启动时[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)设置为 `127.0.0.1`，绑定到本地主机网络接口。这意味着`mongod`只能接受来自运行在同一台机器上的客户端的连接。远程客户端将无法连接到`mongod`，并且`mongod`将无法初始化[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)，除非此值设置为有效的网络接口。

该值可以配置为：

- 在 MongoDB 配置文件中使用[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp), 或
- 通过命令行参数[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)



## WARNING

在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

有关配置的详细信息[`bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)，请参阅 [IP 绑定。](https://www.mongodb.com/docs/manual/core/security-mongodb-configuration/)

←  [在 Red Hat 或 CentOS 上安装 MongoDB 企业版](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat/)[在 Ubuntu 上安装 MongoDB 企业版](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/) →

原文链接 -https://docs.mongodb.com/manual/tutorial/install-mongodb-enterprise-on-red-hat-tarball/

译者：陆文龙

