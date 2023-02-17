**Kerberos 认证**

**概述**

MongoDB Enterprise 支持 MongoDB 客户端对 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的 Kerberos 身份验证。 Kerberos 是用于大型客户端/服务器系统的行业标准身份验证协议。 Kerberos 允许 MongoDB 和应用程序利用现有的身份验证基础设施和流程。 MongoDB Enterprise 仅支持 Kerberos 的[MIT implementation](https://kerberos.org/)。

**Kerberos 组件和 MongoDB**

**主体**

在基于 Kerberos 的系统中，经过身份验证的通信中的每个参与者都被称为“委托人”，并且每个委托人都必须有一个唯一的名称。

主体属于称为领域的管理单元。 对于每个领域，Kerberos Key Distribution Center (KDC) 维护一个数据库，其中包含领域的主体和主体的关联“秘密密钥”。

对于客户端-服务器身份验证，客户端向 KDC 请求“票证”以访问特定资产。 KDC 使用客户端的秘密和服务器的秘密构造票证，允许客户端和服务器相互认证，同时保持秘密隐藏。

对于 Kerberos 支持的 MongoDB 配置，有两种主体名称很重要：[user principals](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-kerberos-user-principal)和[service principals](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-kerberos-service-principal)。

**用户主体**

要使用 Kerberos 进行身份验证，您必须将 Kerberos 用户主体添加到 MongoDB 的 `$external` 数据库中。 用户主体名称具有以下形式：

```shell
<username>@<KERBEROS REALM>
```

对于每个要使用 Kerberos 进行身份验证的用户，您必须在 `$external` 数据库中的 MongoDB 中创建一个相应的用户。

要对 `$external` 身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[Client Sessions and Causal Consistency Guarantees](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)，用户名不能超过 10k 字节。

有关将用户添加到 MongoDB 以及作为该用户进行身份验证的示例，请参阅[Configure MongoDB with Kerberos Authentication on Linux](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-with-kerberos-authentication/)和[Configure MongoDB with Kerberos Authentication on Windows.](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-windows-with-kerberos-authentication/)。

>[TIP]提示
>
>也可以看看：
>
>​	[Manage Users and Roles](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/)了解有关在 MongoDB 中创建和管理用户的一般信息。

**服务主体**

每个 MongoDB [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例（或 Windows 上的 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 或 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe)）都必须有一个关联的服务主体。 服务主体名称具有以下形式：

```shell
<service>/<fully qualified domain name>@<KERBEROS REALM>
```

对于 MongoDB，`<service>` 默认为 `mongodb`。 例如，如果 `m1.example.com` 是一个 MongoDB 服务器，并且 `example.com` 维护着 `EXAMPLE.COM` Kerberos 领域，那么` m1` 应该有服务主体名称 `mongodb/m1.example.com@EXAMPLE.COM`。

要为 `<service>` 指定不同的值，请在 mongod 或 mongos（或 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 或 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe)）.`mongosh`启动期间使用 [`serviceName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.sasl.serviceName)。或者其他客户端也可以使用[`serviceName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.sasl.serviceName) 指定不同的服务主体名称。

服务主体名称必须可以使用其服务主体名称的完全限定域名 (FQDN) 部分通过网络访问。

默认情况下，Kerberos 在使用 DNS 解析主机之前尝试使用 `/etc/krb5.conf `文件来识别主机。

在 Windows 上，如果将 MongoDB 作为服务运行，请参阅[Assign Service Principal Name to MongoDB Windows Service](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-windows-with-kerberos-authentication/#std-label-assign-service-principal-name)。

**Linux 密钥表文件**

Linux 系统可以存储 Kerberos 身份验证密钥为密钥表文件中的服务主体。 在 Linux 上运行的每个 Kerberized mongod 和 mongos 实例都必须有权访问包含其服务主体密钥的密钥表文件。

为了确保 keytab 文件的安全，请使用文件权限将访问权限限制为仅运行 mongod 或 mongos 进程的用户。

**凭证**

在 Linux 上，MongoDB 客户端可以使用 Kerberos 的 kinit 程序来初始化凭证缓存，以向服务器验证用户主体。

**Windows 活动目录**

与 Linux 系统不同，在 Windows 上运行的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例不需要访问 keytab 文件。 相反，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例从特定于操作系统的凭据存储中读取它们的服务器凭据。

但是，您可以从 Windows Active Directory 导出密钥表文件以在 Linux 系统上使用。 有关详细信息，请参阅 [
Ktpass](http://technet.microsoft.com/en-us/library/cc753771.aspx)。

**使用 Kerberos 进行身份验证**

如果要为 Kerberos提供支持和身份验证通过配置 MongoDB，请参阅[Configure MongoDB with Kerberos Authentication on Linux](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-with-kerberos-authentication/)和[Configure MongoDB with Kerberos Authentication on Windows](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-windows-with-kerberos-authentication/)。

**操作注意事项**

**域名系统**

每个运行 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的主机必须同时具有 `A` 和 `PTR` DNS 记录以提供正向和反向查找。

如果没有 `A` 和 `PTR` DNS 记录，主机将无法解析 Kerberos 域或密钥分发中心 (KDC) 的组件。

**系统时间同步**

要成功进行身份验证，每个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的系统时间必须与 Kerberos 基础结构中其他主机的系统时间相差 5 分钟以内。

**Kerberized MongoDB 环境**

**驱动支持**

以下 MongoDB 驱动程序支持 Kerberos 身份验证：

- [C](https://api.mongodb.com/c)
- [C++](https://mongodb.github.io/mongo-cxx-driver/mongocxx-v3/configuration/)
- [Java](https://www.mongodb.com/docs/drivers/tutorial/authenticate-with-java-driver/)
- [C#](http://mongodb.github.io/mongo-csharp-driver/2.0/reference/driver/authentication/#gssapi-kerberos)
- [Go](https://pkg.go.dev/go.mongodb.org/mongo-driver)
- [Node.js](http://mongodb.github.io/node-mongodb-native/2.0/tutorials/enterprise_features/)
- [Perl](https://metacpan.org/pod/MongoDB::MongoClient#GSSAPI-(for-Kerberos))
- [PHP](http://php.net/manual/en/mongodb-driver-manager.construct.php)
- [Python](https://api.mongodb.com/pymongo)
- [Ruby](https://www.mongodb.com/docs/ruby-driver/current/tutorials/ruby-driver-authentication/#kerberos-gssapi-mechanism)
- [Scala](http://mongodb.github.io/mongo-scala-driver/2.1/reference/connecting/authenticating/)
- [Swift](https://mongodb.github.io/mongo-swift-driver/docs/current/)

**与其他 MongoDB 身份验证机制一起使用**

尽管 MongoDB 支持将 Kerberos 身份验证与其他身份验证机制结合使用，但请仅在必要时添加其他机制。 有关详细信息，请参阅[Configure MongoDB with Kerberos Authentication on Linux](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-with-kerberos-authentication/) 和[Configure MongoDB with Kerberos Authentication on Windows](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-windows-with-kerberos-authentication/) 中的`Incorporate Additional Authentication Mechanisms`部分。

**测试和验证**

与 MongoDB 4.4 一起引入的 [`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 程序提供了一种方便的方法来验证平台的 Kerberos 配置以用于 MongoDB，并测试来自 MongoDB 客户端的 Kerberos 身份验证是否按预期工作。 有关详细信息，请参阅 [`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 文档。

[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 仅在 MongoDB Enterprise 中可用。

 参见

原文 - [Kerberos Authentication]( https://docs.mongodb.com/manual/core/kerberos/ )

译者：景圣
