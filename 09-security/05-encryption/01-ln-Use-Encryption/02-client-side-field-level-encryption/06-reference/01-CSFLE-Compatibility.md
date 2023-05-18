# CSFLE 兼容性

此页面描述了与客户端字段级加密兼容的 MongoDB 和驱动程序版本。

## MongoDB 版本和版本兼容性

[使用客户端字段级加密的自动加密](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/automatic-encryption/#std-label-csfle-fundamentals-automatic-encryption) 仅适用于 MongoDB 企业版 4.2 或更高版本。

MongoDB 社区和企业版 4.2 或更高版本提供使用客户端字段级加密的[手动加密。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manual-encryption/#std-label-csfle-fundamentals-manual-encryption)

## 驱动程序兼容性表

客户端字段级加密仅适用于以下官方兼容驱动程序版本或更高版本：

| 驱动程序                                                     | 支持的版本 | 快速入门/教程                                                |
| :----------------------------------------------------------- | :--------- | :----------------------------------------------------------- |
| [Node](https://www.mongodb.com/docs/drivers/node/)           | `3.4.0+`   | [Node.js 快速入门](https://mongodb.github.io/node-mongodb-native/3.4/reference/client-side-encryption/)[客户端字段级加密指南](https://www.mongodb.com/docs/drivers/security/client-side-field-level-encryption-guide/) |
| [Java](https://www.mongodb.com/docs/drivers/java/sync/)      | `3.12.0+`  | [Java 驱动程序快速入门](https://mongodb.github.io/mongo-java-driver/3.12/driver/tutorials/client-side-encryption/)[Java 异步驱动程序快速入门](https://mongodb.github.io/mongo-java-driver/3.12/driver-async/tutorials/client-side-encryption/)[客户端字段级加密指南](https://www.mongodb.com/docs/drivers/security/client-side-field-level-encryption-guide/) |
| [Java Reactive Streams](https://mongodb.github.io/mongo-java-driver-reactivestreams/1.13/) | `1.13.0+`  | [Java RS 文档](https://mongodb.github.io/mongo-java-driver-reactivestreams/1.13/javadoc/) |
| [Python (PyMongo)](https://www.mongodb.com/docs/drivers/pymongo/) | `3.10.0+`  | [Python 驱动程序快速入门](https://pymongo.readthedocs.io/en/3.10.0/examples/encryption.html)[客户端字段级加密指南](https://www.mongodb.com/docs/drivers/security/client-side-field-level-encryption-guide/) |
| [C#/.NET](https://www.mongodb.com/docs/drivers/csharp/)      | `2.10.0+`  | [.NET 驱动程序快速入门](https://mongodb.github.io/mongo-csharp-driver/2.10/reference/driver/crud/client_side_encryption/) |
| [C](https://www.mongodb.com/docs/drivers/c/)                 | `1.17.5`   | [C 驱动程序客户端字段级加密](http://mongoc.org/libmongoc/current/using_client_side_encryption.html) |
| [Go](https://www.mongodb.com/docs/drivers/go/)               | `1.2+`     | [Go 驱动程序快速入门](https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo?tab=doc#hdr-Client_Side_Encryption/) |
| [Scala](https://www.mongodb.com/docs/drivers/scala/)         | `2.8.0+`   | [Scala 文档](https://mongodb.github.io/mongo-scala-driver/2.8/) |
| [PHP](https://www.mongodb.com/docs/drivers/php/)             | `1.6.0+`   | [PHP 驱动程序快速入门](https://docs.mongodb.com/php-library/current/tutorial/client-side-encryption/) |
| [Ruby](https://docs.mongodb.com/ruby-driver/current/)        | `2.12.1+`  | [Ruby 驱动程序快速入门](https://docs.mongodb.com/ruby-driver/current/tutorials/client-side-encryption/) |

> 重要的:
>
> ### 密钥轮换支持
>
> 要使用 CSFLE 的密钥轮换 API，例如方法 `rewrapManyDateKey`，您必须使用特定版本的驱动程序绑定包或`libmongocrypt`.
>
> 以下列表详细说明了每个驱动程序的密钥轮换 API 依赖项：
>
> - Node.js 驱动程序：使用`mongodb-client-encryption` 2.2.0-alpha.6 或更高版本。
> - Java 驱动程序：使用`mongodb-crypt`1.5.2 或更高版本。
> - pymongo：使用`pymongocrypt`1.3.1 或更高版本。
> - Go Driver：使用`libmongocrypt`1.5.2或更高版本。
> - C#/.NET 驱动程序：使用 MongoDB C#/.NET 驱动程序版本 2.17.1 或更高版本。

有关语法和实现示例，请参阅驱动程序参考文档。







译者：韩鹏帅

原文：[CSFLE Compatibility](https://www.mongodb.com/docs/manual/core/csfle/reference/compatibility/)