# 安装要求

## 概述

了解必须安装才能使用客户端字段级加密 (CSFLE) 的应用程序和库。

## 你需要什么

在使用 CSFLE 之前，必须在开发环境中设置以下项目：

- 安装[MongoDB 企业版 4.2 或更高版本。](https://www.mongodb.com/docs/manual/installation/#mongodb-enterprise-edition-installation-tutorials)
- 安装[与 CSFLE 兼容的 MongoDB 驱动程序。](https://www.mongodb.com/docs/manual/core/csfle/reference/compatibility/#std-label-csfle-driver-compatibility)
- 安装[打开SSL](https://www.openssl.org/source/) *可选的*。
- 开始一个 [MongoDB实例](https://www.mongodb.com/docs/manual/tutorial/manage-mongodb-processes/#start-mongod-processes) 或者 [阿特拉斯集群。](https://www.mongodb.com/docs/atlas/getting-started/?jmp=docs)
- 授予文件系统权限。客户端应用程序或特权用户需要权限才能在主机上启动[mongocryptd进程。](https://www.mongodb.com/docs/manual/core/csfle/reference/mongocryptd/#std-label-csfle-reference-mongocryptd)
- 安装特定的驱动程序依赖项。要查看您的驱动程序的依赖项列表，请选择与您要用于完成本指南的语言对应的选项卡：

| 驱动程序   | 依赖名称                                                     | 描述                                                         |
| ---------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| C#         | x64 Support                                                  | CSFLE requires x64 support.                                  |
| Go         | [安装 libmongocrypt](https://www.mongodb.com/docs/manual/core/csfle/reference/libmongocrypt/#std-label-csfle-reference-libmongocrypt) | 该`libmongocrypt`库包含与管理加密的本机库通信的绑定。        |
| Java(sync) | [mongodb-crypt](https://www.mongodb.com/docs/drivers/java/sync/current/fundamentals/csfle/#mongodb-crypt) | 该`mongodb-crypt`库包含与管理加密的本机库通信的绑定。        |
| Node.js    | [mongodb-client-encryption](https://www.npmjs.com/package/mongodb-client-encryption) | 加密库的 NodeJS 包装器`libmongocrypt`。该`libmongocrypt`库包含与管理加密的本机库通信的绑定 |
| Python     | [pymongocrypt](https://pypi.org/project/pymongocrypt/)       | 加密库的 Python 包装器`libmongocrypt`。该`libmongocrypt`库包含与管理加密的本机库通信的绑定。 |

## 了解更多

要开始使用 CSFLE，请参阅[快速入门。](https://www.mongodb.com/docs/manual/core/csfle/quick-start/#std-label-csfle-quick-start)

要了解如何将 CSFLE 与远程密钥管理服务提供商一起使用，请参阅[教程。](https://www.mongodb.com/docs/manual/core/csfle/tutorials/#std-label-csfle-tutorial-automatic-encryption)







译者：韩鹏帅

原文：[Installation Requirements](https://www.mongodb.com/docs/manual/core/csfle/install/)
