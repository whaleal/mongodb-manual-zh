**对 Kerberos 身份验证进行故障排除**

**`mongokerberos` 验证工具**

与 MongoDB 4.4 一起引入的 [`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 程序提供了一种方便的方法来验证平台的 Kerberos 配置以用于 MongoDB，并测试来自 MongoDB 客户端的 Kerberos 身份验证是否按预期工作。

[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 工具可以帮助诊断常见的配置问题，并且是对 Kerberos 配置进行故障排除时推荐的起点。 有关详细信息，请参阅 [`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 文档。

[`mongokerberos`](https://www.mongodb.com/docs/manual/reference/program/mongokerberos/#mongodb-binary-bin.mongokerberos) 仅在 MongoDB Enterprise 中可用。

**Kerberos 配置调试策略**

如果您在使用 [Kerberos](https://www.mongodb.com/docs/manual/core/kerberos/) 启动或验证 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 时遇到困难：

- 确保您运行的是 MongoDB Enterprise，而不是 MongoDB Community Edition。 Kerberos 身份验证是 MongoDB Enterprise 功能，不适用于 MongoDB Community Edition 二进制文件。

  要验证您使用的是 MongoDB Enterprise，请将 --version 命令行选项传递给 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)：

  ```shell
  mongod --version
  ```

  在此命令的输出中，查找字符串 modules: subscription 或 modules: enterprise 以确认您使用的是 MongoDB Enterprise 二进制文件。

- 确保 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的规范系统主机名是可解析的完全限定域名。

  在 Linux 上，您可以在系统提示符下使用 `hostname -f` 命令验证系统主机名解析。

- 在 Linux 上，确保[primary component of the service principal name (SPN)](http://web.mit.edu/KERBEROS/krb5-1.5/krb5-1.5.4/doc/krb5-user/What-is-a-Kerberos-Principal_003f.html)的主要组成部分SPN 的是 mongodb。 如果 SPN 的主要组件不是 `mongodb`，则必须使用 `--setParameter saslServiceName` 指定主要组件。

- 在 Linux 上，确保[instance component of the service principal name (SPN)](http://web.mit.edu/KERBEROS/krb5-1.5/krb5-1.5.4/doc/krb5-user/What-is-a-Kerberos-Principal_003f.html)组件 [keytab file](https://www.mongodb.com/docs/manual/core/kerberos/#std-label-keytab-files)中的匹配 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的规范系统主机名。 如果 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的系统主机名不在 keytab 文件中，则身份验证将失败，并出现 `GSSAPI error acquiring credentials.` 错误信息。

  如果 `hostname -f` 返回的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的主机名不是完全限定的，请在启动  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 时使用[`--setParameter saslHostName`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.saslHostName)设置实例的完全限定域名。

- 确保运行 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的每个主机都有 `A` 和 `PTR` DNS 记录以提供正向和反向 DNS 查找。 `A` 记录应映射到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 的 FQDN。

- 确保托管 MongoDB 实例和 Kerberos 基础设施的服务器上的时钟在最大时间偏差范围内：默认为 5 分钟。 大于最大时间偏差的时间差会阻止成功的身份验证。

**Linux 上的 Kerberos 跟踪日志记录**

MIT Kerberos 为跟踪日志记录输出提供了 `KRB5_TRACE` 环境变量。 如果您在 Linux 上遇到 MIT Kerberos 的持续问题，您可以在启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)、[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 或 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 实例时设置 `KRB5_TRACE` 以生成详细日志记录。

例如，以下命令启动一个独立的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)，其 keytab 文件位于默认的 `/etc/krb5.keytab` 路径，并将 `/logs/mongodb-kerberos.log`写入 `KRB5_TRACE` 设置：

```shell
env KRB5_KTNAME=/etc/krb5.keytab \
    KRB5_TRACE=/logs/mongodb-kerberos.log \
    mongod --dbpath /data/db --logpath /data/db/mongodb.log \
    --auth --setParameter authenticationMechanisms=GSSAPI \
    --bind_ip localhost,<hostname(s)|ip address(es)> --fork
```

**常见错误信息**

在某些情况下，如果 Kerberos 服务出现问题，MongoDB 会从 GSSAPI 接口返回错误消息。 一些常见的错误消息是：

**`GSSAPI error in client while negotiating security context.`**

此错误发生在客户端上，反映了凭证不正确或恶意的身份验证尝试。

如果收到此错误，请确保在连接到主机时使用正确的凭证和正确的完全限定域名。

**`GSSAPI error acquiring credentials.`**

此错误发生在  [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 启动期间，反映了系统主机名配置不正确或密钥表文件丢失或配置不正确。

>[TIP]提示
>
>也可以看看：
>
>- [Kerberos Authentication](https://www.mongodb.com/docs/manual/core/kerberos/)
>- [Configure MongoDB with Kerberos Authentication on Linux](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-with-kerberos-authentication/)
>- [Configure MongoDB with Kerberos Authentication on Windows](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-windows-with-kerberos-authentication/)

 参见

原文 - [Troubleshoot Kerberos Authentication]( https://docs.mongodb.com/manual/tutorial/troubleshoot-kerberos/ )

译者：景圣
