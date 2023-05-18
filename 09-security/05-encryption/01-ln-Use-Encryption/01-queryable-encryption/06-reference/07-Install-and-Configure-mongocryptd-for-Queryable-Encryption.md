# 为可查询加密安装和配置 mongocryptd

> 注意:
>
> Queryable Encryption 处于公共预览阶段，可用于评估目的。不建议将公共预览版用于生产部署，因为可能会引入重大更改。要了解有关预览版的更多信息，请参阅[可查询加密预览](https://www.mongodb.com/blog/post/mongodb-releases-queryable-encryption-preview/)博客文章。

## 概述

> 提示:
>
> **使用自动加密共享库**
>
> MongoDB 发布了一个新的加密助手，`crypt_shared`称为 [共享库](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/shared-library/#std-label-qe-reference-shared-library)。共享库替换`mongocryptd`并且不需要生成新进程

> 笔记:
>
> **企业版特征**
>
> 字段级加密的自动特性仅在 MongoDB Enterprise 4.2 或更高版本以及 MongoDB Atlas 4.2 或更高版本的集群中可用。

`mongocryptd`安装有[MongoDB 企业服务器（4.2 版及更高版本）。](https://www.mongodb.com/download-center/enterprise)

当您创建启用了可查询加密的 MongoDB 客户端时，该`mongocryptd` 进程默认自动启动并处理以下职责：

* 使用指定的自动加密规则，将读写操作中的字段标记为加密。
* 防止在加密字段上执行不受支持的操作。
* 解析指定给数据库连接的加密模式。自动加密规则使用 JSON 模式语法的严格子集。如果自动加密规则包含无效的自动加密语法*或*任何文档验证语法，`mongocryptd`则返回错误。

`mongocryptd`仅负责上述职能，不执行以下任何一项：

- `mongocryptd` *本身不*执行加密或解密
- `mongocryptd` *不*访问任何加密密钥材料
- `mongocryptd` *不*通过网络收听

与 MongoDB 4.2 及更高版本兼容的驱动程序使用 Apache 许可的[libmongocrypt](https://github.com/mongodb/libmongocrypt)用于执行客户端字段级加密和自动解密的库。

官方 MongoDB 4.2+ 兼容驱动程序，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，以及 4.2 或更高版本的旧版[`mongo`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)shell 需要访问`mongocryptd`客户端主机上的进程。`mongocryptd`默认情况下，这些客户端在系统 PATH 中搜索进程。

## 安装

[对于受支持的 Linux 操作系统，请按照在 Linux 上安装教程](https://www.mongodb.com/docs/manual/administration/install-enterprise-linux/#std-label-install-enterprise-linux)安装服务器包 ，按照记录的安装说明安装 `mongodb-enterprise`服务器包。或者， `mongodb-enterprise-cryptd`改为指定仅安装 `mongocryptd`二进制文件。包管理器将二进制文件安装到系统路径中的某个位置（例如`/usr/bin/`）

对于 OSX，按照 [在 MacOS 上安装教程](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-os-x/#std-label-install-enterprise-macos)安装服务器包。包管理器将二进制文件安装到系统路径中的某个位置。

对于 Windows，按照 [在 Windows 上安装教程](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-enterprise-on-windows/#std-label-install-enterprise-windows)安装服务器包。安装后必须将`mongocryptd`软件包添加到系统 PATH 中。`mongocryptd`有关将二进制文件添加到系统 PATH 的说明，请遵循 Windows 安装的记录最佳实践。

对于通过官方 tarball 或 ZIP 存档进行的安装，请按照您的操作系统记录的最佳实践将`mongocryptd`二进制文件添加到您的系统路径中。

## 配置

如果 4.2+ 兼容的驱动程序可以访问进程`mongocryptd`，则默认情况下驱动程序管理进程的生成`mongocryptd` 。

> 笔记:
>
> **mongocryptd 端口正在使用**
>
> 如果`mongocryptd`进程已经在驱动程序指定的端口上运行，则驱动程序可能会记录警告并继续运行而不产生新进程。驱动程序指定的任何设置仅在现有进程退出并且新的加密客户端尝试连接时才适用。

`mongocryptd`您可以通过以下参数配置驱动程序的启动方式：

| 姓名                    | 描述                                                         |
| :---------------------- | :----------------------------------------------------------- |
| port                    | `mongocryptd`侦听消息的端口。在 中指定此值`AutoEncryptionSettings`。**默认值**：`27020` |
| idleShutdownTimeoutSecs | 进程在退出前应等待的空闲秒数`mongocryptd`。在 中指定此值`AutoEncryptionSettings`。**默认值**：`60` |

> 重要的:
>
> **启动时启动**
>
> 如果可能，我们建议`mongocryptd`在引导时启动，而不是按需启动。

### 例子

要查看如何配置`mongocryptd` 过程的示例，请单击与您在应用程序中使用的驱动程序对应的选项卡：

以下代码片段设置了监听端口配置`mongocryptd`：

```
var extraOptions = new Dictionary<string, object>()
{
    { "mongocryptdSpawnArgs", new [] { "--port=30000" } },
};
autoEncryptionOptions.With(extraOptions: extraOptions);
```

以下代码片段设置了默认超时配置`mongocryptd`：

```
var extraOptions = new Dictionary<string, object>()
{
    { "idleShutdownTimeoutSecs", 60 },
};
autoEncryptionOptions.With(extraOptions: extraOptions);
```









译者：韩鹏帅

原文：[Install and Configure mongocryptd for Queryable Encryption](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/mongocryptd/)
