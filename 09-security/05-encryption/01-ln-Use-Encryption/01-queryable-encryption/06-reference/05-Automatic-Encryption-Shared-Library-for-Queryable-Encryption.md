# 用于可查询加密的自动加密共享库

> 注意:
>
> Queryable Encryption 处于公共预览阶段，可用于评估目的。不建议将公共预览版用于生产部署，因为可能会引入重大更改。要了解有关预览版的更多信息，请参阅[可查询加密预览](https://www.mongodb.com/blog/post/mongodb-releases-queryable-encryption-preview/)博客文章。

## 概述

自动加密共享库是一个**动态库**，它使您的客户端应用程序能够执行自动可查询加密。动态库是应用程序在运行时而不是编译时访问的一组功能。自动加密共享库执行以下任务：

* 使用您的加密字段映射来标记读写操作中的字段以进行加密
* 防止您的应用程序对加密字段执行不受支持的操作

自动加密共享库不执行以下任何任务：

- 自动加密共享库本身*不*执行加密或解密
- 自动加密共享库*不*访问任何加密密钥材料
- 自动加密共享库*不*监听网络

> 重要的:
>
> **支持的 MongoDB 服务器产品**
>
> 自动可查询加密仅在以下 MongoDB 服务器产品中可用：
>
> - MongoDB Atlas 6.0 或更高版本集群
> - MongoDB Enterprise 6.0 或更高版本
>
> 自动可查询加密在任何版本的 MongoDB 社区服务器中都不可用。

自动加密共享库提供与 相同的功能`mongocryptd`，但不需要您生成另一个进程来执行自动加密。

要了解有关自动加密的更多信息，请参阅 [功能。](https://www.mongodb.com/docs/manual/core/queryable-encryption/features/#std-label-qe-features)

要了解更多信息`mongocryptd`，请参阅 [为可查询加密安装和配置 mongocryptd 。](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/mongocryptd/#std-label-qe-reference-mongocryptd)

> 笔记:
>
> **libmongocrypt 执行加密**
>
> 与 MongoDB 6.0 及更高版本兼容的驱动程序使用 Apache-licensed[libmongocrypt](https://github.com/mongodb/libmongocrypt)用于执行加密和解密的库。

## 下载自动加密共享库

使用以下链接从 MongoDB 下载中心下载自动加密共享库：

[MongoDB 下载中心](https://www.mongodb.com/try/download/enterprise)

- 在**版本**下拉列表中，选择`6.0.0 (current)`.
- 在**平台**下拉列表中，选择您的平台。
- 在**包**下拉列表中，选择`crypt_shared`.
- 单击**下载**。

## 配置

您可以通过以下参数配置您的驱动程序如何搜索自动加密共享库：

| 姓名                | 描述                                                         |
| :------------------ | :----------------------------------------------------------- |
| 加密共享库路径      | 指定自动加密共享库包的绝对路径，`crypt_shared`.**默认值**：`undefined` |
| cryptSharedRequired | 指定驱动程序是否必须使用自动加密共享库。如果`true`,如果自动加密共享库不可用，驱动程序会引发错误。如果`false`，驱动程序执行以下操作序列：尝试使用自动加密共享库。如果自动加密共享库不可用，驱动程序会尝试生成并连接到`mongocryptd`.**默认值**：`false` |

要查看演示如何配置这些参数的示例，请参阅[快速入门。](https://www.mongodb.com/docs/manual/core/queryable-encryption/quick-start/#std-label-qe-quick-start-shared-lib)







译者：韩鹏帅

原文：[Automatic Encryption Shared Library for Queryable Encryption](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/shared-library/)