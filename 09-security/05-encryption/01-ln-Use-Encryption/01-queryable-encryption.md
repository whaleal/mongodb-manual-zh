# 可查询加密

> 注意:
>
> Queryable Encryption 处于公共预览阶段，可用于评估目的。不建议将公共预览版用于生产部署，因为可能会引入重大更改。要了解有关预览版的更多信息，请参阅[可查询加密预览](https://www.mongodb.com/blog/post/mongodb-releases-queryable-encryption-preview/)博客文章。

## 介绍

可查询加密使您能够执行以下任务：

* 从客户端加密敏感数据字段。
* 将敏感数据字段存储为数据库服务器端的完全随机加密数据。
* 对加密数据运行表达式查询。

这些任务都是在服务器不知道它正在处理的数据的情况下完成的。

敏感数据在其整个生命周期（传输中、静态、使用中、日志中和备份中）都经过加密，并且只能在客户端解密，因为只有您可以访问加密密钥。

Queryable Encryption 引入了由加密搜索先驱开发的业界首创的快速、可搜索加密方案。该功能支持相等搜索，并计划在未来版本中使用其他查询类型，例如范围、前缀、后缀和子字符串。

您可以使用以下机制设置可查询加密：

* 自动加密：使您能够执行加密的读取和写入操作，而无需编写代码来指定如何加密字段。
* 显式加密：使您能够通过 MongoDB 驱动程序的加密库执行加密的读写操作。您必须在整个应用程序中指定使用此库进行加密的逻辑。

下表显示了哪些 MongoDB 服务器产品支持哪些 CSFLE 机制：

| 产品名称           | 支持自动加密 | 支持显式加密 |
| :----------------- | :----------- | :----------- |
| MongoDB  Atlas     | 是的         | 是的         |
| MongoDB 企业高级版 | 是的         | 是的         |
| MongoDB 社区版     | 不           | 是的         |

要了解哪些 MongoDB 驱动程序支持可查询加密，请参阅 [可查询加密兼容性。](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/compatibility/#std-label-qe-compatibility-reference)

## 特征

要了解可查询加密对您的应用程序的安全优势，请参阅[功能](https://www.mongodb.com/docs/manual/core/queryable-encryption/features/#std-label-qe-features)页面。

## 安装

要了解使用可查询加密必须安装的内容，请参阅[安装要求](https://www.mongodb.com/docs/manual/core/queryable-encryption/install/#std-label-qe-install)页面。

## 快速开始

要开始使用可查询加密，请参阅[快速入门。](https://www.mongodb.com/docs/manual/core/queryable-encryption/quick-start/#std-label-qe-quick-start)

## 基础知识

要了解可查询加密的工作原理和设置方法，请参阅 [基础](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/#std-label-qe-fundamentals)部分。

基础部分包含以下页面：

- [字段加密和可查询性](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/encrypt-and-query/#std-label-qe-fundamentals-encrypt-query)
- [加密馆藏管理](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/manage-collections/#std-label-qe-fundamentals-collection-management)
- [密钥和密钥保管库](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/keys-key-vaults/#std-label-qe-reference-keys-key-vaults)
- [加密密钥管理](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/manage-keys/#std-label-qe-fundamentals-manage-keys)
- [知识管理系统供应商](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/kms-providers/#std-label-qe-fundamentals-kms-providers)

## 教程

要了解如何使用可查询加密执行特定任务，请参阅 [教程](https://www.mongodb.com/docs/manual/core/queryable-encryption/tutorials/#std-label-qe-tutorials)部分。

## 参考

要查看信息以帮助您开发支持可查询加密的应用程序，请参阅[参考](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/#std-label-qe-reference)部分。

参考部分包含以下页面：

- [可查询的加密兼容性](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/compatibility/#std-label-qe-compatibility-reference)
- [可查询加密限制](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/limitations/#std-label-qe-reference-encryption-limits)
- [可查询加密支持的操作](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/supported-operations/#std-label-qe-reference-automatic-encryption-supported-operations)
- [可查询加密的 MongoClient 选项](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/qe-options-clients/#std-label-qe-reference-mongo-client)
- [用于可查询加密的自动加密共享库](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/shared-library/#std-label-qe-reference-shared-library)
- [安装 libmongocrypt](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/libmongocrypt/#std-label-qe-reference-libmongocrypt)
- [为可查询加密安装和配置 mongocryptd](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/mongocryptd/#std-label-qe-reference-mongocryptd)









译者：韩鹏帅

原文：[Queryable Encryption](https://www.mongodb.com/docs/manual/core/queryable-encryption/)