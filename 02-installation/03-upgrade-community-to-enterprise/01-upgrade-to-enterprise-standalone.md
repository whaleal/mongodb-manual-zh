# 升级到 MongoDB Enterprise（单例）

MongoDB 企业版提供了 MongoDB 社区版所没有的各种特性，例如：

- [内存存储引擎](https://www.mongodb.com/docs/manual/core/inmemory/)
- [审计](https://www.mongodb.com/docs/manual/core/auditing/)
- [Kerberos 认证](https://www.mongodb.com/docs/manual/core/kerberos/)
- [LDAP 代理身份验证](https://www.mongodb.com/docs/manual/core/security-ldap/)和[LDAP 授权](https://www.mongodb.com/docs/manual/core/security-ldap-external/)
- [静态加密](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)

以下步骤概述了将独立版 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)从 MongoDB 社区版升级到 MongoDB 企业版的过程。例如，这些步骤可用于将 MongoDB 6.0 Community 升级到 MongoDB 6.0 Enterprise。

## 考虑[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/upgrade-to-enterprise-standalone/#consideration)



## WARNING

不要使用这些说明升级到另一个发行版本。要升级发布版本，请参阅相应的发布升级说明，例如[升级到 MongoDB 6.0 。](https://www.mongodb.com/docs/manual/release-notes/6.0/#std-label-6.0-upgrade)

## 下载企业二进制文件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/upgrade-to-enterprise-standalone/#download-enterprise-binaries)

根据您的操作系统，您可以使用包管理器或手动下载二进制文件来安装 MongoDB Enterprise 二进制文件。

Linux（包管理器）Linux（手动下载）视窗苹果系统

如果您使用包管理器安装了 MongoDB Community，请按照适用于您的操作系统的包管理器说明进行操作：

- [红帽企业或 CentOS](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-red-hat/)
- [Ubuntu](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-ubuntu/)
- [德比安](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-debian/)
- [苏斯](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-suse/)
- [亚马逊Linux](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-amazon/)

安装过程中，包管理器会删除社区包；在您重新启动之前，这不会影响正在运行的部署。

## 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/upgrade-to-enterprise-standalone/#procedure)



### 关闭当前`mongod`实例。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/upgrade-to-enterprise-standalone/#shutdown-the-current-mongod-instance)

关闭 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)社区实例。



### 重新启动企业`mongod`。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/upgrade-to-enterprise-standalone/#restart-with-enterprise-mongod)

重新启动 Enterprise [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，指定相同的配置选项（例如相同的数据目录、配置文件等）。

←  [将 MongoDB Community 升级到 MongoDB Enterprise](https://www.mongodb.com/docs/manual/administration/upgrade-community-to-enterprise/)[升级到 MongoDB Enterprise（副本集）](https://www.mongodb.com/docs/manual/tutorial/upgrade-to-enterprise-replica-set/) →

原文 - [Upgrade to MongoDB Enterprise (Standalone)]( https://docs.mongodb.com/manual/tutorial/upgrade-to-enterprise-standalone/ )

译者：陆文龙
