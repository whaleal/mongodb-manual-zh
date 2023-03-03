# 故障排除[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/installation-ubuntu-community-troubleshooting/#troubleshooting)

## 检索公钥时出错[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/installation-ubuntu-community-troubleshooting/#errors-when-retrieving-the-public-key)

在[安装 MongoDB Community Edition过程](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/#std-label-install-community-ubuntu-pkg)**的导入包管理系统使用的公钥** 步骤中，您可能会遇到错误。`"gpg: no valid OpenPGP data found."`

确保您完全按照记录复制命令。该操作应响应`OK`。

要检查您的系统上是否存在 MongoDB 公共 GPG 密钥，请在终端中运行以下命令：

```
sudo apt-key list
```



输出应包含类似于以下内容的条目：

```
/etc/apt/trusted.gpg
--------------------
pub   rsa4096 2018-04-18 [SC] [expires: 2023-04-17]
      E162 F504 A20C DF15 827F  718D 4B7C 549A 058F 8B6B
uid           [ unknown] MongoDB 6.0 Release Signing Key <packaging@mongodb.com>
```

## 运行时出错`sudo apt update`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/installation-ubuntu-community-troubleshooting/#errors-when-running-sudo-apt-update)

`sudo apt-get update`作为 [安装 MongoDB 社区版](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/#std-label-install-community-ubuntu-pkg)过程的一部分运行时，您可能会遇到一个或多个类似于以下内容的错误：

```
W: GPG error: https://repo.mongodb.org/apt/ubuntu <release>/mongodb-org/6.0 Release: \
   The following signatures couldn't be verified because the public key is not available: NO_PUBKEY 4B7C549A058F8B6B
E: The repository 'https://repo.mongodb.org/apt/ubuntu <release>/mongodb-org/6.0 Release' \
   is not signed.
N: Updating from such a repository can't be done securely, and is therefore disabled by default.
N: See apt-secure(8) manpage for repository creation and user configuration details.
```

这些错误表明 MongoDB 公共 GPG 密钥未在 安装[MongoDB 社区版过程](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/#std-label-install-community-ubuntu-pkg)**的导入包管理系统使用的公共密钥**步骤中添加。

重复 [安装 MongoDB 社区版过程的](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/#std-label-install-community-ubuntu-pkg)**导入包管理系统使用的公钥** 步骤 通常可以解决此问题。确保您完全按照记录复制命令和密钥。

您可以通过在终端中运行以下命令来验证您的系统上是否存在 MongoDB 公共 GPG 密钥：

```
sudo apt-key list
```



输出应包含类似于以下内容的条目：

```
--------------------
pub   rsa4096 2018-04-18 [SC] [expires: 2023-04-17]
      E162 F504 A20C DF15 827F  718D 4B7C 549A 058F 8B6B
uid           [ unknown] MongoDB 6.0 Release Signing Key <packaging@mongodb.com>
```

## 运行时出错`sudo apt install -y mongodb-org`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/installation-ubuntu-community-troubleshooting/#errors-when-running-sudo-apt-install--y-mongodb-org)

在 [Install MongoDB Community Edition](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/#std-label-install-community-ubuntu-pkg)过程的**Create a list file for MongoDB**`sudo apt install -y mongodb-org` 步骤中运行时可能会遇到类似如下的错误 ：

```
Reading package lists... Done
Building dependency tree
Reading state information... Done
E: Unable to locate package mongodb-org
```

此错误表示 `/etc/apt/sources.list.d/mongodb-org-6.0.list` 可能配置不正确或丢失。

要查看`mongodb-org-6.0.list`文件的内容，请在终端或 shell 中运行以下命令：

```
cat /etc/apt/sources.list.d/mongodb-org-6.0.list
```



如果文件内容与上面链接步骤中您的 Ubuntu 版本的文档不完全匹配，请删除该文件并重复**为 MongoDB 创建列表文件**步骤。如果该文件不存在，请在该步骤中创建它。

验证`mongodb-org-6.0.list` 文件存在且内容正确后，运行 `sudo apt update`以更新`apt`存储库并重试`sudo apt install -y mongodb-org`。

## 由于无法安装软件包`dpkg-deb: error`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/installation-ubuntu-community-troubleshooting/#unable-to-install-package-due-to-dpkg-deb--error)

`mongodb-org`安装软件包时，您可能会遇到类似于以下内容的错误：

```
dpkg: error processing archive /var/cache/apt/archives/mongodb-org-server_6.0.0_amd64.deb (--unpack):
trying to overwrite '/usr/bin/mongod', which is also in package mongodb-server-core 1:3.6.3-0ubuntu1
```

此错误表明系统在安装官方 MongoDB Inc. 软件包之前已经安装了Ubuntu软件包。要确认主机是否安装了Ubuntu软件包，请在终端或 shell 中运行以下命令： `mongodb``mongodb-org` `mongodb`

```
sudo apt list --installed | grep mongo
```



如果您的输出类似于以下内容，您**必须先**卸载Ubuntu包，然后再重试 [安装 MongoDB 社区版](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/#std-label-install-community-ubuntu-pkg)过程： `mongodb`

```
mongodb/bionic,now 1:3.6.3-0ubuntu1 amd64 [installed]
mongodb-clients/bionic,now 1:3.6.3-0ubuntu1 amd64 [installed,automatic]
mongodb-server/bionic,bionic,now 1:3.6.3-0ubuntu1 all [installed,automatic]
mongodb-server-core/bionic,now 1:3.6.3-0ubuntu1 amd64 [installed,automatic]
```

在重试安装过程之前，在终端或 shell 中运行以下命令以完全删除 Ubuntu软件包： `mongodb`

```
sudo apt remove mongodb
sudo apt purge mongodb
sudo apt autoremove
```





## NOTE

```
sudo apt purge mongodb`删除Ubuntu软件包安装的任何默认配置文件。如果您修改了这些配置文件*并*希望保留这些修改，请将这些文件复制到另一个目录，例如 . `mongodb``/home/your-user-name
```

如果您的输出包含`mongodb-org`和 `mongodb`二进制文件的混合，您可能需要先`apt remove`、`apt purge`和包`apt autoremove`，`mongodb-org`然后再尝试删除和清除Ubuntu 包。清除所有与 MongoDB 相关的包后，重试安装过程。 `mongodb`

## `mongod`报告与打开套接字相关的错误[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/installation-ubuntu-community-troubleshooting/#mongod-reports-errors-related-to-opening-a-socket)

启动 . _ `Socket is already in use`_ 这些错误通常表示另一个进程正在使用为该 进程配置的端口，通常 是系统上运行的另一个进程。`Failed to unlink socket file`[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

以下示例使用该实用程序列出处于( ) 状态的`ss`所有打开的 TCP ( `-t`) 或 UDP ( `-u`) 套接字以及使用每个套接字 ( ) 的进程，而不解析任何服务名称或主机名 ( )。`LISTEN``-l``-p``-n`

```
sudo ss -tulpn
```



以下部分输出显示了`mongod`侦听`27017`端口的进程。试图`mongod` 在同一端口上运行另一个进程将导致套接字错误。

```
Netid        State        Local Address:Port
udp          UNCONN       127.0.0.53%lo:53        users:(("systemd-resolve",pid=663,fd=12))
udp          UNCONN   10.1.16.87%enp0s3:68        users:(("systemd-network",pid=652,fd=15))
tcp          LISTEN       127.0.0.53%lo:53        users:(("systemd-resolve",pid=663,fd=13))
tcp          LISTEN             0.0.0.0:22        users:(("sshd",pid=819,fd=3))
tcp          LISTEN        192.168.1.15:27017     users:(("mongod",pid=10027,fd=12))
tcp          LISTEN           127.0.0.1:27017     users:(("mongod",pid=10027,fd=11))
tcp          LISTEN                 ::]:22        users:(("sshd",pid=819,fd=4))
```

如果系统有一个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或其他系统进程在您想要的端口上运行，您必须关闭现有进程*或*为新进程选择一个新端口 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。您可以指定 [配置文件](https://www.mongodb.com/docs/manual/administration/configuration/#std-label-configuration-file) 选项来更改 侦听的端口。[`net.port`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.port) [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

## `mongod`报告与数据目录相关的错误[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/installation-ubuntu-community-troubleshooting/#mongod-reports-errors-related-to-the-data-directory)

[用户可能会在进程日志](https://www.mongodb.com/docs/manual/administration/monitoring/#std-label-monitoring-standard-loggging)中遇到类似于以下内容的错误 [：](https://www.mongodb.com/docs/manual/administration/monitoring/#std-label-monitoring-standard-loggging)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

```
Data directory ... not found

Attempted to create lock file on a read-only directory: ...
```

通常，这些错误表明 MongoDB 数据目录不存在，或者 [`mongod`.](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

### 数据目录必须存在[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/installation-ubuntu-community-troubleshooting/#the-data-directory-must-exist)

数据目录通过[配置文件](https://www.mongodb.com/docs/manual/administration/configuration/#std-label-configuration-file)[`storage.dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath) 中的设置指定，或者通过命令行上的选项指定 。[`--dbpath`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

- 如果您通过`apt`包管理器安装 MongoDB，则默认 `/etc/mongod.conf` [配置文件](https://www.mongodb.com/docs/manual/administration/configuration/#std-label-configuration-file) 设置[`storage.dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)为`/var/lib/mongodb`.
- 如果您[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在命令行上运行，并且完全省略该[`--dbpath`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)选项，则 MongoDB 使用默认`--dbpath`值`/data/db`.

无论您是使用上述数据目录路径之一，还是在配置文件或命令行中提供您自己的路径，请确保在启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod). `mkdir`您可以使用命令在 Ubuntu 上创建目录。

### 数据目录必须可访问[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/installation-ubuntu-community-troubleshooting/#the-data-directory-must-be-accessible)

必须为数据目录配置适当的权限和所有权设置，以允许 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)读取、写入和导航目录内容（`rwx`用户或组权限）。

在 启动 [.](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) _ `chown`_`chmod``user:group`[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

### 开始`mongod`使用数据目录[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/installation-ubuntu-community-troubleshooting/#starting-mongod-using-the-data-directory)

```
mongod`作为服务启动的用户（例如使用`sudo systemctl start mongod`或）通常只有在修改了 to 中的默认值时`sudo service mongod start`才会看到这些错误 ：[`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)`/etc/mongod.conf
```

- 不允许`mongodb`用户或`mongodb` 组读取、写入或执行 ( `rwx`) 目录及其内容的目录，*或*
- 一个不存在的目录。

用户在[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)不使用服务定义的情况下启动（例如使用终端启动`mongod`）通常会在以下情况下看到这些错误：

- 指定[`dbPath`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.dbPath)或 [`--dbpath`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)不允许用户或用户所属的组读取、写入和执行 ( `rwx`) 目录或其内容的目录，*或*
- 指定的数据目录不存在。

←  [使用 .tgz Tarball 在 Ubuntu 上安装 MongoDB Community](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu-tarball/)[在 Debian 上安装 MongoDB 社区版](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-debian/) →

原文链接 -https://docs.mongodb.com/manual/reference/installation-ubuntu-community-troubleshooting/

译者：陆文龙

