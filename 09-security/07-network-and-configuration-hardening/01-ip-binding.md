## **IP绑定**

**概述**

MongoDB 二进制文件 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到 localhost。 如果为二进制文件设置了 [`net.ipv6`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ipv6) 配置文件设置或` --ipv6` 命令行选项，则二进制文件还会绑定到本地主机 IPv6 地址。

**注意事项**

>[WARNING]
>
>确保您的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例只能在受信任的网络上访问。 如果您的系统有多个网络接口，请将 MongoDB 程序绑定到私有或内部网络接口。

如果为二进制文件设置了 [`net.ipv6`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ipv6) 配置文件设置或 `--ipv6` 命令行选项，则二进制文件还会绑定到本地主机 IPv6 地址。

要绑定到所有 IPv4 地址，您可以指定绑定 ip 地址 `0.0.0.0`。 要绑定到所有 IPv4 和 IPv6 地址，您可以指定 `::,0.0.0.0` 的绑定 IP 地址，或者使用新的 [`net.bindIpAll`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIpAll) 设置或新的命令行选项 `--bind_ip_all`。

>[TIP]
>
>也可以看看：
>
>- [Firewalls](https://www.mongodb.com/docs/manual/core/security-hardening/#std-label-security-firewalls)
>- [Security Considerations](https://www.mongodb.com/docs/manual/administration/configuration/#std-label-configuration-security)

 参见

原文 - [IP Binding]( https://docs.mongodb.com/manual/core/security-mongodb-configuration/ )

译者：景圣