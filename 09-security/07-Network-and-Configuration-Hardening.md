# 网络和配置强化

为了降低整个 MongoDB 系统的风险暴露，确保只有受信任的主机才能访问 MongoDB。

## MongoDB 配置加固

### IP绑定

MongoDB 二进制文件，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和 ，默认[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)绑定到。`localhost`

> 警告:
>
> 在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

> 警告:
>
> 确保您的[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例只能在受信任的网络上访问。如果您的系统有多个网络接口，请将 MongoDB 程序绑定到私有或内部网络接口。

有关详细信息，请参阅[IP 绑定。](https://www.mongodb.com/docs/manual/core/security-mongodb-configuration/)

### HTTP 状态接口和 REST API

*在3.6版中更改*：MongoDB 3.6 删除了已弃用的 HTTP 接口和 MongoDB 的 REST API。

## 网络加固

### 防火墙

防火墙允许管理员通过提供对网络通信的精细控制来过滤和控制对系统的访问。对于 MongoDB 的管理员来说，以下能力很重要：将特定端口上的传入流量限制到特定系统，并限制来自不受信任主机的传入流量。

在 Linux 系统上，该`iptables`接口提供对底层`netfilter`防火墙的访问。在 Windows 系统上，`netsh` 命令行界面提供对底层 Windows 防火墙的访问。有关防火墙配置的其他信息，请参阅：

* [为 MongoDB配置 Linux`iptables`防火墙](https://www.mongodb.com/docs/manual/tutorial/configure-linux-iptables-firewall/)和
* [为 MongoDB配置 Windows`netsh`防火墙。](https://www.mongodb.com/docs/manual/tutorial/configure-windows-netsh-firewall/)

为获得最佳结果并最大程度地减少整体风险，请确保*只有* 来自可信来源的流量才能到达[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，并且[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)只能连接到可信输出。

### 虚拟专用网络

虚拟专用网络或 VPN 使通过加密和访问受限的可信网络链接两个网络成为可能。通常，使用 VPN 的 MongoDB 用户使用 TLS/SSL 而不是 IPSEC VPN 来解决性能问题。

根据配置和实施，VPN 提供证书验证和加密协议选择，这需要对所有客户端进行严格级别的身份验证和识别。此外，由于 VPN 提供安全隧道，通过使用 VPN 连接来控制对您的 MongoDB 实例的访问，您可以防止篡改和“中间人”攻击。







译者：韩鹏帅

原文：[Network and Configuration Hardening](https://www.mongodb.com/docs/manual/core/security-hardening/)
