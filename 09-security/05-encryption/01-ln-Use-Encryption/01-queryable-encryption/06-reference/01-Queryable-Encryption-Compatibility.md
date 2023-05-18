# 可查询的加密兼容性

> 注意:
>
> Queryable Encryption 处于公共预览阶段，可用于评估目的。不建议将公共预览版用于生产部署，因为可能会引入重大更改。要了解有关预览版的更多信息，请参阅[可查询加密预览](https://www.mongodb.com/blog/post/mongodb-releases-queryable-encryption-preview/)博客文章。

此页面描述了可查询加密兼容的 MongoDB 和驱动程序版本。

## MongoDB 版本、拓扑和版本兼容性

使用可查询加密的自动加密仅适用于 MongoDB 企业版和 MongoDB Atlas，版本 6.0 或更高版本。您可以在 MongoDB 副本集或分片集群上使用可查询加密，但不能在独立实例上使用。

## 驱动程序兼容性表

可查询加密仅适用于以下官方兼容驱动程序版本或更高版本：

| 驱动程序                                                     | 加密库                                                       |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [Node.js](https://www.mongodb.com/docs/drivers/node/) 版本`4.7.0` 或更高版本。 | [mongodb-client-encryption](https://www.npmjs.com/package/mongodb-client-encryption/v/2.2.0-alpha.6) 版本 `2.2.0-alpha.6` 或更高版本 |
| [C#/.NET](https://www.mongodb.com/docs/drivers/csharp/) 版本 `2.17.1`或更高版本。 | No additional dependency                                     |
| [Java (Synchronous)](https://www.mongodb.com/docs/drivers/java/sync/) 版本`4.7.1` 或更高版本。 | [MongoCrypt](https://mvnrepository.com/artifact/org.mongodb/mongodb-crypt) 版本 `1.5.2` 或更高版本 |
| [Pymongo](https://www.mongodb.com/docs/drivers/python/) 版本 `4.1.1` 或更高版本。 | [pymongocrypt](https://pypi.org/project/pymongocrypt/) 版本 `1.3.1` 或更高版本 |
| [Go](https://www.mongodb.com/docs/drivers/go/) 版本 `1.10.0-beta1` 或更高版本。 | [libmongocrypt](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/libmongocrypt/#std-label-qe-reference-libmongocrypt) 版本 `1.5.2` 或更高版本 |
| [C](https://www.mongodb.com/docs/drivers/c/) 版本 `1.22.0` 或更高版本。 | [libmongocrypt](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/libmongocrypt/#std-label-qe-reference-libmongocrypt) 版本 `1.5.2` 或更高版本 |
| [PHP](https://www.mongodb.com/docs/drivers/php/) 版本 `1.14.0beta1` 或更高版本。 | No additional dependency                                     |
| [Ruby](https://www.mongodb.com/docs/drivers/ruby/) 版本 `2.18.0.beta1` 或更高版本。 | [libmongocrypt](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/libmongocrypt/#std-label-qe-reference-libmongocrypt) 版本 `1.5.2` 或更高版本 |







译者：韩鹏帅

原文：[Queryable Encryption Compatibility](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/compatibility/)