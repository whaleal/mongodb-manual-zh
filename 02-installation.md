## 安装MongoDB

MongoDB有两个服务器版本：*社区版*和 *企业版*。

> 笔记
>
> [MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server) 是MongoDB公司提供的MongoDB云服务，无需安装开销，并提供免费的入门套餐。

手册的这部分包含有关安装MongoDB的信息。

- 有关将当前部署升级到 MongoDB 7.0 的说明，请参阅[升级过程](https://www.mongodb.com/docs/v7.0/release-notes/7.0/#std-label-7.0-upgrade)。
- 有关升级到当前版本的最新补丁版本的说明，请参阅[升级到 MongoDB 的最新版本](https://www.mongodb.com/docs/v7.0/tutorial/upgrade-revision/)

### MongoDB社区版安装教程

MongoDB 安装教程适用于以下平台，包括社区版和 [企业版：](https://www.mongodb.com/products/mongodb-enterprise-advanced?tck=docs_server)

| 平台    | 社区版                                                       | 企业版                                                       |
| :------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| Linux   | [在 Red Hat 或 CentOS 上安装 MongoDB 社区版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-red-hat/)、[在 Ubuntu 上安装 MongoDB 社区版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-ubuntu/)、[在 Debian 上安装 MongoDB 社区版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-debian/)、[在 SUSE 上安装 MongoDB 社区版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-suse/)、[在 Amazon Linux 上安装 MongoDB 社区版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-amazon/) | [在 Red Hat 或 CentOS 上安装 MongoDB 企业版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-enterprise-on-red-hat/)、[在 Ubuntu 上安装 MongoDB 企业版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-enterprise-on-ubuntu/)、[在 Debian 上安装 MongoDB 企业版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-enterprise-on-debian/)、[在 SUSE 上安装 MongoDB 企业版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-enterprise-on-suse/)、[在 Amazon Linux 上安装 MongoDB 企业版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-enterprise-on-amazon/) |
| macOS   | [在 macOS 上安装 MongoDB 社区版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-os-x/) | [在 macOS 上安装 MongoDB 企业版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-enterprise-on-os-x/) |
| Windows | [在 Windows 上安装 MongoDB 社区版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-windows/) | [在 Windows 上安装 MongoDB 企业版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-enterprise-on-windows/) |
| Docker  | [使用 Docker 安装 MongoDB 社区](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-community-with-docker/#std-label-docker-mongodb-community-install) | [使用 Docker 安装 MongoDB 企业版](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-enterprise-with-docker/#std-label-docker-mongodb-enterprise-install) |

### 社区版升级到企业版教程

> 重要的
>
> 请勿使用这些说明升级到其他发行版本。要升级发行版本，请参阅相应的发行升级说明，例如[升级到 MongoDB 7.0 。](https://www.mongodb.com/docs/v7.0/release-notes/7.0/#std-label-7.0-upgrade)

- [升级到 MongoDB Enterprise（独立版）](https://www.mongodb.com/docs/v7.0/tutorial/upgrade-to-enterprise-standalone/)
- [升级到 MongoDB Enterprise（副本集）](https://www.mongodb.com/docs/v7.0/tutorial/upgrade-to-enterprise-replica-set/)
- [升级到 MongoDB Enterprise（分片集群）](https://www.mongodb.com/docs/v7.0/tutorial/upgrade-to-enterprise-sharded-cluster/)

### 支持的平台

> 重要的:
>
> MongoDB 不支持 32 位 x86 平台。

| 平台                                            | 架构    | 版本 | 7.0  | 6.0    | 5.0    | 4.4            |
| :---------------------------------------------- | :------ | :--- | :--- | :----- | :----- | :------------- |
| Amazon Linux 2023                               | x86_64  | 企业 | ✓    | 6.2.0+ |        |                |
| Amazon Linux 2023                               | x86_64  | 社区 | ✓    | 6.2.0+ |        |                |
| Amazon Linux V2                                 | x86_64  | 企业 | ✓    | ✓      | ✓      | ✓              |
| Amazon Linux V2                                 | x86_64  | 社区 | ✓    | ✓      | ✓      | ✓              |
| Debian 12                                       | x86_64  | 企业 | ✓    |        |        |                |
| Debian 11                                       | x86_64  | 企业 | ✓    | ✓      | 5.0.8+ |                |
| Debian 11                                       | x86_64  | 企业 | ✓    | ✓      | 5.0.8+ |                |
| Debian 11                                       | x86_64  | 社区 | ✓    | ✓      | 5.0.8+ |                |
| Debian 10                                       | x86_64  | 企业 |      | ✓      | ✓      | ✓              |
| Debian 10                                       | x86_64  | 社区 |      | ✓      | ✓      | ✓              |
| Debian 9                                        | x86_64  | 企业 |      |        | ✓      | ✓              |
| Debian 9                                        | x86_64  | 社区 |      |        | ✓      | ✓              |
| RHEL/CentOS Stream/Oracle Linux/Rocky/Alma 9.0+ | x86_64  | 企业 | ✓    | 6.0.4+ |        |                |
| RHEL/CentOS Stream/Oracle Linux/Rocky/Alma 9.0+ | x86_64  | 社区 | ✓    | 6.0.4+ |        |                |
| RHEL/CentOS Stream/Oracle Linux/Rocky/Alma 8.0+ | x86_64  | 企业 | ✓    | ✓      | ✓      | ✓              |
| RHEL/CentOS Stream/Oracle Linux/Rocky/Alma 8.0+ | x86_64  | 社区 | ✓    | ✓      | ✓      | ✓              |
| RHEL/CentOS/Oracle Linux 7.0+                   | x86_64  | 企业 | ✓    | ✓      | ✓      | ✓              |
| RHEL/CentOS/Oracle Linux 7.0+                   | x86_64  | 社区 | ✓    | ✓      | ✓      | ✓              |
| RHEL/CentOS/Oracle Linux 6.2+                   | x86_64  | 企业 |      |        |        | ✓              |
| RHEL/CentOS/Oracle Linux 6.2+                   | x86_64  | 社区 |      |        |        | ✓              |
| SLES15                                          | x86_64  | 企业 | ✓    | ✓      | ✓      | ✓              |
| SLES15                                          | x86_64  | 社区 | ✓    | ✓      | ✓      | ✓              |
| SLES12                                          | x86_64  | 企业 | ✓    | ✓      | ✓      | ✓              |
| SLES12                                          | x86_64  | 社区 | ✓    | ✓      | ✓      | ✓              |
| Ubuntu22.04                                     | x86_64  | 企业 | ✓    | 6.0.4+ |        |                |
| Ubuntu22.04                                     | x86_64  | 社区 | ✓    | 6.0.4+ |        |                |
| Ubuntu20.04                                     | x86_64  | 企业 | ✓    | ✓      | ✓      | ✓              |
| Ubuntu20.04                                     | x86_64  | 社区 | ✓    | ✓      | ✓      | ✓              |
| Ubuntu18.04                                     | x86_64  | 企业 |      | ✓      | ✓      | ✓              |
| Ubuntu18.04                                     | x86_64  | 社区 |      | ✓      | ✓      | ✓              |
| Ubuntu16.04                                     | x86_64  | 企业 |      |        |        | ✓              |
| Ubuntu16.04                                     | x86_64  | 社区 |      |        |        | ✓              |
| Windows11                                       | x86_64  | 企业 | ✓    | ✓      |        |                |
| Windows11                                       | x86_64  | 社区 | ✓    | ✓      |        |                |
| Windows Server 2022                             | x86_64  | 企业 | ✓    | ✓      |        |                |
| Windows Server 2022                             | x86_64  | 社区 | ✓    | ✓      |        |                |
| Windows Server 2019                             | x86_64  | 企业 | ✓    | ✓      | ✓      | ✓              |
| Windows Server 2019                             | x86_64  | 社区 | ✓    | ✓      | ✓      | ✓              |
| Windows 7/8/8.1                                 | x86_64  | 企业 |      |        |        |                |
| Windows 7/8/8.1                                 | x86_64  | 社区 |      |        |        |                |
| Windows Server 2008R2/2012/2012R2               | x86_64  | 企业 |      |        |        |                |
| Windows Server 2008R2/2012/2012R2               | x86_64  | 社区 |      |        |        |                |
| Windows 10 / Server 2016                        | x86_64  | 企业 |      | ✓      | ✓      | ✓              |
| Windows 10 / Server 2016                        | x86_64  | 社区 |      | ✓      | ✓      | ✓              |
| macOS 13                                        | x86_64  | 企业 | ✓    |        |        |                |
| macOS 13                                        | x86_64  | 社区 | ✓    |        |        |                |
| macOS 12                                        | x86_64  | 企业 | ✓    | ✓      |        |                |
| macOS 12                                        | x86_64  | 社区 | ✓    | ✓      |        |                |
| macOS 11                                        | x86_64  | 企业 | ✓    | ✓      |        |                |
| macOS 11                                        | x86_64  | 社区 | ✓    | ✓      |        |                |
| macOS 10.15                                     | x86_64  | 企业 |      | ✓      | ✓      | ✓              |
| macOS 10.15                                     | x86_64  | 社区 |      | ✓      | ✓      | ✓              |
| macOS 10.14                                     | x86_64  | 企业 |      |        | ✓      | ✓              |
| macOS 10.14                                     | x86_64  | 社区 |      |        | ✓      | ✓              |
| macOS 10.13                                     | x86_64  | 企业 |      |        |        | ✓              |
| macOS 10.13                                     | x86_64  | 社区 |      |        |        | ✓              |
| macOS 13                                        | ARM64   | 企业 | ✓    |        |        |                |
| macOS 13                                        | ARM64   | 社区 | ✓    |        |        |                |
| macOS 12                                        | ARM64   | 企业 | ✓    | ✓      |        |                |
| macOS 12                                        | ARM64   | 社区 | ✓    | ✓      |        |                |
| macOS 11                                        | ARM64   | 企业 | ✓    | ✓      |        |                |
| macOS 11                                        | ARM64   | 社区 | ✓    | ✓      |        |                |
| Amazon Linux 2023                               | ARM64   | 企业 | ✓    | 6.2.0+ |        |                |
| Amazon Linux 2023                               | ARM64   | 社区 | ✓    | 6.2.0+ |        |                |
| AmazonLinux 2                                   | ARM64   | 企业 | ✓    | ✓      | ✓      | 4.4.4+         |
| AmazonLinux 2                                   | ARM64   | 社区 | ✓    | ✓      | ✓      | 4.4.4+         |
| RHEL/CentOS/Rocky/Alma 9                        | ARM64   | 企业 | ✓    | ✓      |        |                |
| RHEL/CentOS/Rocky/Alma 9                        | ARM64   | 社区 | ✓    | ✓      |        |                |
| RHEL/CentOS/Rocky/Alma 8                        | ARM64   | 企业 | ✓    | ✓      | ✓      | 4.4.4+         |
| RHEL/CentOS/Rocky/Alma 8                        | ARM64   | 社区 | ✓    | ✓      | ✓      | 4.4.4+         |
| Ubuntu22.04                                     | ARM64   | 企业 | ✓    | 6.0.4+ |        |                |
| Ubuntu22.04                                     | ARM64   | 社区 | ✓    | 6.0.4+ |        |                |
| Ubuntu20.04                                     | ARM64   | 企业 | ✓    | ✓      | ✓      | ✓              |
| Ubuntu20.04                                     | ARM64   | 社区 | ✓    | ✓      | ✓      | ✓              |
| Ubuntu18.04                                     | ARM64   | 企业 |      | ✓      | ✓      | ✓              |
| Ubuntu18.04                                     | ARM64   | 社区 |      | ✓      | ✓      | ✓              |
| Ubuntu16.04                                     | ARM64   | 企业 |      |        |        | ✓              |
| Ubuntu16.04                                     | ARM64   | 社区 |      |        |        |                |
| RHEL/CentOS Stream/Rocky/Alma 9                 | ppc64le | 企业 | ✓    |        |        |                |
| RHEL/CentOS Stream/Rocky/Alma 8                 | ppc64le | 企业 | ✓    | ✓      | ✓      | ✓              |
| RHEL/CentOS 7                                   | ppc64le | 企业 |      | 6.0.7+ | ✓      | ✓              |
| Ubuntu18.04                                     | ppc64le | 企业 |      |        |        | 4.4.0 - 4.4.10 |
| RHEL/CentOS Stream/Rocky/Alma 9                 | s390x   | 企业 | ✓    |        |        |                |
| RHEL/CentOS Stream/Rocky/Alma 9                 | s390x   | 社区 |      |        |        |                |
| RHEL/CentOS Stream/Rocky/Alma 8                 | s390x   | 企业 | ✓    | ✓      | 5.0.9+ |                |
| RHEL/CentOS Stream/Rocky/Alma 8                 | s390x   | 社区 |      |        |        |                |
| RHEL/CentOS 7                                   | s390x   | 企业 |      | ✓      | ✓      | ✓              |
| RHEL/CentOS 7                                   | s390x   | 社区 |      |        | ✓      | ✓              |
| RHEL/CentOS 6                                   | s390x   | 企业 |      |        |        |                |
| RHEL/CentOS 6                                   | s390x   | 社区 |      |        |        |                |
| SLES12                                          | s390x   | 企业 |      |        |        | 4.4.0 - 4.4.6  |
| SLES12                                          | s390x   | 社区 |      |        |        | 4.4.0 - 4.4.6  |
| Ubuntu18.04                                     | s390x   | 企业 |      |        |        | 4.4.0 - 4.4.6  |
| Ubuntu18.04                                     | s390x   | 社区 |      |        |        | 4.4.0 - 4.4.6  |



1、MongoDB 仅支持运行 Red Hat 兼容内核 (RHCK) 的 Oracle Linux。MongoDB 不**支持**Unbreakable Enterprise Kernel (UEK)。

2、针对 RHEL 版本 8.0+ 发布的 MongoDB 本地产品与 Rocky Linux 版本 8.0+ 和 AlmaLinux 版本 8.0+ 兼容并受支持，具体取决于这些发行版履行其提供完全 RHEL 兼容性的义务。

3、MongoDB 版本 5.0 及更高版本针对 SLES 12 Service Pack 5 进行测试。早期版本的 MongoDB 针对不带 Service Pack 的 SLES 12 进行测试。

4、MongoDB 版本 7.0 及更高版本针对 SLES 15 Service Pack 4 进行测试。早期版本的 MongoDB 针对不带 Service Pack 的 SLES 15 进行测试。

5、MongoDB 版本 7.0 是针对 RHEL 7.9 构建和测试的。早期版本的 MongoDB 针对 RHEL 7 进行了测试，并假定向前兼容。



原文链接：https://www.mongodb.com/docs/v7.0/installation/

译者：韩鹏帅


 参见

原文 - [Installation]( https://www.mongodb.com/docs/v7.0/installation/ )

