# 对 Kerberos 身份验证进行故障排除

## `mongokerberos`验证工具

该程序与 MongoDB 4.4 一起推出，[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 提供了一种方便的方法来验证平台的 Kerberos 配置以用于 MongoDB，并测试来自 MongoDB 客户端的 Kerberos 身份验证是否按预期工作。

该[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)工具可以帮助诊断常见的配置问题，并且是对 Kerberos 配置进行故障排除时推荐的起点。[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)有关详细信息，请参阅 文档。

[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos)仅在 MongoDB Enterprise 中可用。

## Kerberos 配置调试策略

[如果您](https://www.mongodb.com/docs/manual/core/kerberos/)在启动或验证 Kerberos 时[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)遇到困难[：](https://www.mongodb.com/docs/manual/core/kerberos/)[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

* 确保您运行的是 MongoDB Enterprise，而不是 MongoDB Community Edition。Kerberos 身份验证是 MongoDB Enterprise 功能，不适用于 MongoDB Community Edition 二进制文件。

  要验证您使用的是 MongoDB Enterprise，请将`--version` 命令行选项传递给[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or [`mongos`：](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

  ```
  mongod --version
  ```

  在此命令的输出中，查找字符串`modules: subscription`或`modules: enterprise`确认您使用的是 MongoDB Enterprise 二进制文件。

* 确保 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例的规范系统主机名是可解析的完全限定域名。

  `hostname -f`在 Linux 上，您可以在系统提示符下使用命令验证系统主机名解析。

* 在 Linux 上，确保[服务主体名称 (SPN) 的主要组成部分](http://web.mit.edu/KERBEROS/krb5-1.5/krb5-1.5.4/doc/krb5-user/What-is-a-Kerberos-Principal_003f.html) 的 SPN 是`mongodb`. 如果 SPN 的主要组件 **不是** `mongodb`，则必须使用 指定主要组件 [`--setParameter saslServiceName`。](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslServiceName)

* 在 Linux 上，确保[服务主体名称 (SPN) 的实例组件](http://web.mit.edu/KERBEROS/krb5-1.5/krb5-1.5.4/doc/krb5-user/What-is-a-Kerberos-Principal_003f.html) 在 [keytab 文件](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)中匹配或实例的规范系统主机名[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 。如果[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的系统主机名不在密钥表文件中，则身份验证将失败并显示一条`GSSAPI error acquiring credentials.`错误消息。

  如果返回的mongodor实例的主机名 不是完全限定的，请在启动or时使用设置实例的完全限定域名。`mongoshostname -f--setParameter saslHostNamemongodmongos`

* 确保运行[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例的每个主机都有`A`DNS`PTR`记录以提供正向和反向 DNS 查找。该`A`记录应映射到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)或[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)的 FQDN。

* 确保托管 MongoDB 实例和 Kerberos 基础设施的服务器上的时钟在最大时间偏差范围内：默认为 5 分钟。大于最大时间偏差的时间差会阻止成功的身份验证。

## Linux 上的 Kerberos 跟踪日志记录

MIT Kerberos`KRB5_TRACE`为跟踪日志记录输出提供了环境变量。如果您在 Linux 上使用 MIT Kerberos 时遇到持续性问题，您可以`KRB5_TRACE`在启动您的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)、[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)或[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)产生详细日志记录的实例。

例如，以下命令启动一个独立的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) ，其 keytab 文件位于默认`/etc/krb5.keytab`路径并设置`KRB5_TRACE`为写入`/logs/mongodb-kerberos.log`：

```
env KRB5_KTNAME=/etc/krb5.keytab \
    KRB5_TRACE=/logs/mongodb-kerberos.log \
    mongod --dbpath /data/db --logpath /data/db/mongodb.log \
    --auth --setParameter authenticationMechanisms=GSSAPI \
    --bind_ip localhost,<hostname(s)|ip address(es)> --fork
```

## 常见错误信息

在某些情况下，如果 Kerberos 服务出现问题，MongoDB 会从 GSSAPI 接口返回错误消息。一些常见的错误消息是：

```
GSSAPI error in client while negotiating security context.
```

​	此错误发生在客户端上，反映了凭据不足或恶意的身份验证尝试。

​	如果收到此错误，请确保在连接到主机时使用正确的凭据和正确的完全限定域名。

```
GSSAPI error acquiring credentials.
```

​	[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)此错误发生在or 启动期间[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，反映了系统主机名配置不正确或密钥表文件丢失或配置不正确。

> 提示:
>
> **也可以看看**
>
> - [Kerberos 认证](https://www.mongodb.com/docs/manual/core/kerberos/)
> - [在 Linux 上使用 Kerberos 身份验证配置 MongoDB](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-with-kerberos-authentication/)
> - [在 Windows 上使用 Kerberos 身份验证配置 MongoDB](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-windows-with-kerberos-authentication/)





翻译：韩鹏帅

原文：[Troubleshoot Kerberos Authentication](https://www.mongodb.com/docs/manual/tutorial/troubleshoot-kerberos/)