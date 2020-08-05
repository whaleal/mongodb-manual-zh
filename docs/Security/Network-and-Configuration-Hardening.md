# Network and Configuration Hardening

<a name="X9Rd5"></a>
# Network and Configuration Hardening
<a name="Ah0eu"></a>
# 网络和配置强化

- [MongoDB Configuration Hardening]MongoDB 配置强化([https://docs.mongodb.com/manual/core/security-hardening/#mongodb-configuration-hardening](https://docs.mongodb.com/manual/core/security-hardening/#mongodb-configuration-hardening))
- [Network Hardening]网络强化([https://docs.mongodb.com/manual/core/security-hardening/#network-hardening](https://docs.mongodb.com/manual/core/security-hardening/#network-hardening))

To reduce the risk exposure of the entire MongoDB system, ensure that only trusted hosts have access to MongoDB.<br />要降低整个 MongoDB 系统的风险暴露，请确保只有可信主机才能访问 MongoDB。
<a name="feSd4"></a>
## MongoDB Configuration Hardening
<a name="ZgHwv"></a>
## MongoDB 配置强化
<a name="F6cfl"></a>
### IP Binding
<a name="dbDmg"></a>
### IP绑定
Starting with MongoDB 3.6, MongoDB binaries, [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)  and  [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos), bind to localhost by default. From MongoDB versions 2.6 to 3.4, only the binaries from the official MongoDB RPM (Red Hat, CentOS, Fedora Linux, and derivatives) and DEB (Debian, Ubuntu, and derivatives) packages would bind to localhost by default. To learn more about this change, see  [Localhost Binding Compatibility Changes.](https://docs.mongodb.com/manual/release-notes/3.6-compatibility/#bind-ip-compatibility)<br />从MongoDB 3.6开始，MongoDB 二进制文件, [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 和 [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) 默认绑定本地主机(localhost)。从MongoDB 版本 2.6 到 3.4，只有官方 MongoDB RPM安装包(Red Hat，CentOS，Fedora Linux 和衍生产品)和 DEB安装包(Debian，Ubuntu 及衍生产品)中的二进制文件默认绑定到本地主机(localhost)。要了解有关此更改的更多信息，请参阅 [本地主机绑定兼容性更改](https://docs.mongodb.com/manual/release-notes/3.6-compatibility/#bind-ip-compatibility)。<br />WARNING：<br />警告：<br />Before binding to a non-localhost (e.g. publicly accessible) IP address, ensure you have secured your cluster from unauthorized access. For a complete list of security recommendations, see [Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/). At minimum, consider [enabling authentication](https://docs.mongodb.com/manual/administration/security-checklist/#checklist-auth) and [hardening network infrastructure](https://docs.mongodb.com/manual/core/security-hardening/#).<br />在绑定到非本地主机(例如可公开访问的) IP 地址之前，请确保已保护数据库集群防止未经授权的访问。有关安全建议的完整列表，请参阅[安全检查表](https://docs.mongodb.com/manual/administration/security-checklist/)。至少需要要考虑 [启用身份验证](https://docs.mongodb.com/manual/administration/security-checklist/#checklist-auth) 和施[强化网络基础架构](https://docs.mongodb.com/manual/core/security-hardening/#)。<br />WARNING：<br />警告：<br />Make sure that your [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) and [mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) instances are only accessible on trusted networks. If your system has more than one network interface, bind MongoDB programs to the private or internal network interface.<br />确保只能在受信任的网络上访问 [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) 和[mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)实例。如果您的系统具有多个网络接口，请将 MongoDB 程序绑定到专用或内部网络接口。<br />For more information, see [IP Binding](https://docs.mongodb.com/manual/core/security-mongodb-configuration/).<br />更多的信息，参照 [IP 绑定](https://docs.mongodb.com/manual/core/security-mongodb-configuration/)。
<a name="Y7k8I"></a>
### HTTP Status Interface and REST API
<a name="JqHmG"></a>
### HTTP状态接口和REST API
_Changed in version 3.6:_ MongoDB 3.6 removes the deprecated HTTP interface and REST API to MongoDB.<br />3.6版本的变化： MongoDB 3.6 移除了 MongoDB数据库的HTTP Interface 和REST API。
<a name="RSvi3"></a>
## Network Hardening
<a name="BLOLz"></a>
## 网络强化
<a name="LmxFi"></a>
### Firewalls
<a name="RRUql"></a>
### 防火墙
Firewalls allow administrators to filter and control access to a system by providing granular control over network communications. For administrators of MongoDB, the following capabilities are important: limiting incoming traffic on a specific port to specific systems and limiting incoming traffic from untrusted hosts.<br />防火墙允许管理员通过提供网络通信的细粒度控制来过滤和控制对系统的访问。对于 MongoDB 的管理员，以下功能非常重要：将特定端口上的传入流量限制到特定系统，并限制来自不受信任主机的传入流量。<br />On Linux systems, the **iptables** interface provides access to the underlying **netfilter** firewall. On Windows systems, **netsh** command line interface provides access to the underlying Windows Firewall. For additional information about firewall configuration, see:<br />在 Linux 系统上，**iptables **接口提供对底层 **netfilter** 防火墙的访问。在 Windows 系统上**，netsh** 命令 line 接口提供对底层 Windows 防火墙的访问。有关防火墙配置的其他信息，请参阅：

- [Configure Linux iptables Firewall for MongoDB]为 MongoDB 配置 Linux iptables 防火墙([https://docs.mongodb.com/manual/tutorial/configure-linux-iptables-firewall/](https://docs.mongodb.com/manual/tutorial/configure-linux-iptables-firewall/))
- [Configure Windows netsh Firewall for MongoDB]为 MongoDB 配置 Windows netsh 防火墙([https://docs.mongodb.com/manual/tutorial/configure-windows-netsh-firewall/](https://docs.mongodb.com/manual/tutorial/configure-windows-netsh-firewall/))

For best results and to minimize overall exposure, ensure that _only_ traffic from trusted sources can reach [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) and [`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) instances and that the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) and [`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) instances can only connect to trusted outputs.<br />为了获得最佳结果并最大限度地减少总体风险，请确保只有来自可靠来源的流量才能到达[mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)和[mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)实例，并且[mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)和[mongos](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)实例只能连接到受信任的输出。
<a name="Byx3t"></a>
### Virtual Private Networks
<a name="O9Dq1"></a>
### 虚拟专用网
Virtual private networks, or VPNs, make it possible to link two networks over an encrypted and limited-access trusted network. Typically, MongoDB users who use VPNs use TLS/SSL rather than IPSEC VPNs for performance issues.<br />虚拟专用网络或VPN使得通过加密和有限访问的可信网络连接两个网络成为可能。通常，使用 VPN 的 MongoDB 用户使用 TLS/SSL 而不是 IPSEC VPN 来解决性能问题。<br />Depending on configuration and implementation, VPNs provide for certificate validation and a choice of encryption protocols, which requires a rigorous level of authentication and identification of all clients. Furthermore, because VPNs provide a secure tunnel, by using a VPN connection to control access to your MongoDB instance, you can prevent tampering and “man-in-the-middle” attacks.|<br />根据配置和实现，VPN 提供证书验证和加密协议选择，这需要对所有客户端进行严格的身份验证和识别。此外，由于 VPN 提供了一个安全通道，通过使用 VPN 连接来控制对 MongoDB 实例的访问，您可以防止篡改和“中间人”攻击。
<a name="XqTT8"></a>
## 附录
IP Binding IP绑定：[https://docs.mongodb.com/manual/core/security-mongodb-configuration/](https://docs.mongodb.com/manual/core/security-mongodb-configuration/)<br />Configure Linux  `iptables`  Firewall for MongoDB  `iptables`为MongoDB 配置Linux 防火墙：[https://docs.mongodb.com/manual/tutorial/configure-linux-iptables-firewall/](https://docs.mongodb.com/manual/tutorial/configure-linux-iptables-firewall/)<br />Configure Windows  `netsh`  Firewall for MongoDB    `netsh`为MongoDB 配置Windows 防火墙：[https://docs.mongodb.com/manual/tutorial/configure-windows-netsh-firewall/](https://docs.mongodb.com/manual/tutorial/configure-windows-netsh-firewall/)<br />Implement Field Level Redaction实施字段级别修订：[https://docs.mongodb.com/manual/tutorial/implement-field-level-redaction/](https://docs.mongodb.com/manual/tutorial/implement-field-level-redaction/)<br />原文链接：[https://docs.mongodb.com/manual/core/security-hardening/](https://docs.mongodb.com/manual/core/security-hardening/)<br />
<br />

