紧急随机存取存储器

Salted Challenge Response Authentication Mechanism (SCRAM) 是 MongoDB 的默认身份验证机制。

当用户对自己进行身份验证时，MongoDB 使用 SCRAM 根据用户名、密码和身份验证数据库验证提供的用户凭据。

SCRAM 基于 IETF RFC 5802该标准定义了实施质询-响应机制以使用密码对用户进行身份验证的最佳实践。

特征

MongoDB 的 SCRAM 实现提供：

- 可调工作因子（迭代次数）
- 每个用户随机盐

- 服务器和客户端之间的双向认证

SCRAM 机制

MongoDB 支持以下 SCRAM 机制：

| SCRAM 机制    | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| SCRAM-SHA-1   | 使用 SHA-1 哈希函数。<br/><br/>要修改 `SCRAM-SHA-1` 的迭代计数，请参阅 [`scramIterationCount`]()。 |
| SCRAM-SHA-256 | 使用 SHA-256 哈希函数。<br/><br/>要修改 `SCRAM-SHA-256` 的迭代计数，请参阅 [`scramSHA256IterationCount`]()。 |

 当您创建或更新一个 SCRAM 用户时，您可以指明：

- 使用的 SCRAM 机制
- 是服务端还是客户端消化密码

当您使用 SCRAM-SHA-256 时，MongoDB 需要服务器端密码散列，这意味着服务器会消化密码。 有关详细信息，请参阅 [`db.createUser()`](https://www.mongodb.com/docs/manual/reference/method/db.createUser/#mongodb-method-db.createUser) 和  [`db.updateUser()`](https://www.mongodb.com/docs/manual/reference/method/db.updateUser/#mongodb-method-db.updateUser)。

驱动程序支持

支持 SCRAM 的最低驱动程序版本是：

| 驱动语言                                              | 版本                                                         | 驱动语言                                                | 版本                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------ |
| [C](https://www.mongodb.com/docs/drivers/c/)          | [1.1.0](https://github.com/mongodb/mongo-c-driver/releases)  | [ PHP](https://www.mongodb.com/docs/drivers/php/)       | [ 1.0](https://pecl.php.net/package/mongodb)                 |
| [C++](https://www.mongodb.com/docs/drivers/cxx/)      | [ 1.0.0](https://github.com/mongodb/mongo-cxx-driver/releases) | [ Python](https://www.mongodb.com/docs/drivers/python/) | [ 2.8](https://pypi.python.org/pypi/pymongo/)                |
| [C#](https://www.mongodb.com/docs/drivers/csharp/)    | [ 1.10](https://github.com/mongodb/mongo-csharp-driver/releases) | [ Perl](https://www.mongodb.com/docs/drivers/perl/)     | [ 1.0.0](https://metacpan.org/release/MongoDB)               |
| [Go](https://www.mongodb.com/docs/drivers/go/)        | [ 1.0.0](https://github.com/mongodb/mongo-go-driver/releases) | [Ruby](https://www.mongodb.com/docs/drivers/ruby/)      | [ 1.12](https://rubygems.org/gems/mongo)                     |
| [Java](https://www.mongodb.com/docs/drivers/java/)    | [ 2.13](https://github.com/mongodb/mongo-java-driver/releases) | [ Rust](https://www.mongodb.com/docs/drivers/rust/)     | [ 1.0.0](https://github.com/mongodb/mongo-rust-driver/releases) |
| [Motor](https://www.mongodb.com/docs/drivers/python/) | [ 0.4](https://pypi.python.org/pypi/motor/)                  | [ Scala](https://www.mongodb.com/docs/drivers/scala/)   | [ 2.8.0](https://github.com/mongodb/casbah/releases)         |
| [Node.js](https://www.mongodb.com/docs/drivers/node/) | [ 1.4.29](https://github.com/mongodb/node-mongodb-native/releases) | [Swift](https://www.mongodb.com/docs/drivers/swift/)    | [ 1.0.0](https://github.com/mongodb/mongo-swift-driver/releases) |

 附加信息

如果您使用  [SCRAM-SHA-1](https://www.mongodb.com/docs/manual/reference/parameters/#std-label-authentication-parameters)：

- [md5](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-md5) 是必需的，但不用于加密目的，并且
- 如果您使用 [FIPS mode](https://www.mongodb.com/docs/manual/tutorial/configure-fips/#std-label-fips-overview)，则使用以下命令代替 [SCRAM-SHA-1](https://www.mongodb.com/docs/manual/reference/parameters/#std-label-authentication-parameters)：
  - [SCRAM-SHA-256,](https://www.mongodb.com/docs/manual/core/security-scram/#std-label-authentication-scram)
  - [Kerberos,](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-security-kerberos)
  - [LDAP](https://www.mongodb.com/docs/manual/core/security-ldap/#std-label-security-ldap), or
  - [x.509](https://www.mongodb.com/docs/manual/core/security-x.509/#std-label-security-auth-x509)

>[TIP]提示
>
>也可以看看：
>
>- [Blog Post: Improved Password-Based Authentication: SCRAM Explained (Part 1)](https://www.mongodb.com/blog/post/improved-password-based-authentication-mongodb-30-scram-explained-part-1?tck=docs_server)
>- [Blog Post: Improved Password-Based Authentication: SCRAM Explained (Part 2)](https://www.mongodb.com/blog/post/improved-password-based-authentication-mongodb-30-scram-explained-part-2?tck=docs_server)

参见

原文 - [SCRAM]( https://docs.mongodb.com/manual/core/security-scram/ )

译者： 景圣
