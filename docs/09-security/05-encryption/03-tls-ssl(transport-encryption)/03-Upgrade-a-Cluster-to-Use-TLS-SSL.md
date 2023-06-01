## 升级集群以使用 TLS/SSL

MongoDB 服务器支持在同一 TCP 端口上侦听 TLS/SSL 加密和未加密连接。这允许升级 MongoDB 集群以使用 TLS/SSL 加密连接。

>[NOTE]
>
>从 4.0 版开始，MongoDB在 TLS 1.1+ 可用的系统上禁用对 TLS 1.0 加密的支持。有关详细信息，请参阅[禁用 TLS 1.0 。](https://www.mongodb.com/docs/manual/release-notes/4.0/#std-label-4.0-disable-tls)

**步骤（使用`tls`设置）**

>[IMPORTANT]
>
>TLS/SSL、PKI（公钥基础设施）证书和证书颁发机构的完整描述超出了本文档的范围。此页面假定您事先了解 TLS/SSL 以及对有效证书的访问权限。

要从不使用 TLS/SSL 加密的 MongoDB 集群升级到*仅*使用 TLS/SSL 加密的集群，请使用以下滚动升级过程。

>[NOTE]
>
>本节中的过程使用`tls`设置/选项（在 MongoDB 4.2 中可用）。有关使用其`ssl` 别名的过程，请参见[步骤（使用`ssl`设置）。](https://www.mongodb.com/docs/manual/tutorial/upgrade-cluster-to-ssl/#std-label-upgrade-to-ssl)
>
>`tls`设置/选项提供与选项**相同**的功能，`ssl`因为 MongoDB 一直支持 TLS 1.0 及更高版本。



1. 对于集群的每个节点，启动节点时将命令行选项 `--tlsMode`或配置文件选项[`net.tls.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.mode)设置为`allowTLS`. 该`allowTLS`设置允许节点接受 TLS/SSL 和非 TLS/非 SSL 传入连接。它与其他服务器的连接不使用 TLS/SSL。包括其他[TLS/SSL 选项](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/) [[ 2 \]](https://www.mongodb.com/docs/manual/tutorial/upgrade-cluster-to-ssl/#footnote-systemstore)以及您的特定配置所需的任何其他选项。

   >[NOTE]
   >
   >[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)并[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到本地主机。如果部署的成员在不同的主机上运行，或者如果您希望远程客户端连接到您的部署，则必须指定`--bind_ip`或 [`net.bindIp`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)

   例如：

   **命令行选项配置文件选项**

   ```shell
   mongod --replSet <name> --tlsMode allowTLS --tlsCertificateKeyFile <TLS/SSL certificate and key file> --sslCAFile <path to root CA PEM file> <additional options>
   ```

   **配置文件选项**

   要在[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)中指定这些选项，请在文件中包含以下设置：

   ```yaml
   net:
      tls:
         mode: allowTLS
         certificateKeyFile: <path to TLS/SSL certificate and key PEM file>
         CAFile: <path to root CA PEM file>
   ```

   将集群的所有节点升级到这些设置。

2. 将所有客户端切换为使用 TLS/SSL。请参阅[客户端的 TLS/SSL 配置。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-ssl-clients)

3. 对于集群的每个节点，使用[`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter) 命令更新[`tlsMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.tlsMode)到`preferTLS`. [[ 1 \]](https://www.mongodb.com/docs/manual/tutorial/upgrade-cluster-to-ssl/#footnote-update-mode-alternative)节点接受 TLS/SSL 和非 TLS/非 SSL 传入连接，并且它与其他服务器的连接使用 TLS/ `preferTLS`SSL 。[`net.tls.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.mode)例如：

   ```shell
   db.adminCommand( { setParameter: 1, tlsMode: "preferTLS" } )
   ```

   将集群的所有节点升级到这些设置。

   此时，所有连接都应使用 TLS/SSL。

4. 对于集群的每个节点，使用 [`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter)命令更新[`tlsMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.tlsMode) 到`requireTLS`. [[ 1 \]](https://www.mongodb.com/docs/manual/tutorial/upgrade-cluster-to-ssl/#footnote-update-mode-alternative)`requireTLS` 节点将[`net.tls.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.mode)拒绝任何非 TLS/非 SSL 连接。例如：

   ```shell
   db.adminCommand( { setParameter: 1, tlsMode: "requireTLS" } )
   ```

5. 升级所有节点后，使用适当的 TLS/SSL 设置编辑[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)，以确保在随后重新启动时，集群使用 TLS/SSL。

**步骤（使用`ssl`设置）**

>[IMPORTANT]
>
>TLS/SSL、PKI（公钥基础设施）证书和证书颁发机构的完整描述超出了本文档的范围。此页面假定您事先了解 TLS/SSL 以及对有效证书的访问权限。

要从不使用 TLS/SSL 加密的 MongoDB 集群升级到*仅*使用 TLS/SSL 加密的集群，请使用以下滚动升级过程。

>[NOTE]
>
>本节中的过程使用`ssl`设置/选项。有关使用`tls`别名的过程（在 MongoDB 4.2 中可用），请参阅[步骤（使用`tls`设置）。](https://www.mongodb.com/docs/manual/tutorial/upgrade-cluster-to-ssl/#std-label-upgrade-to-tls)
>
>`tls`设置/选项提供与选项**相同**的功能，`ssl`因为 MongoDB 一直支持 TLS 1.0 及更高版本。

1. 对于集群的每个节点，启动节点时将命令行选项 `--sslMode`或配置文件选项[`net.ssl.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.mode)设置为`allowSSL`. 该`allowSSL`设置允许节点接受 TLS/SSL 和非 TLS/非 SSL 传入连接。它与其他服务器的连接不使用 TLS/SSL。包括其他[TLS/SSL 选项](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/) [[ 2 \]](https://www.mongodb.com/docs/manual/tutorial/upgrade-cluster-to-ssl/#footnote-systemstore)以及您的特定配置所需的任何其他选项。

   >[NOTE]
   >
   >[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)并[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 默认绑定到本地主机。如果部署的成员在不同的主机上运行，或者如果您希望远程客户端连接到您的部署，则必须指定`--bind_ip`或 [`net.bindIp`。](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp)

   例如：

   **命令行选项配置文件选项**

   ```shell
   mongod --replSet <name> --sslMode allowSSL --sslPEMKeyFile <path to TLS/SSL Certificate and key PEM file> --sslCAFile <path to root CA PEM file> <additional options>
   ```

   **配置文件选项**

   要在[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)中指定这些选项，请在文件中包含以下设置：

   ```yaml
   net:
      ssl:
         mode: <allowSSL>
         certificateKeyFile: <path to TLS/SSL certificate and key PEM file>
         CAFile: <path to root CA PEM file>
   ```

   将集群的所有节点升级到这些设置。

2. 将所有客户端切换为使用 TLS/SSL。请参阅[客户端的 TLS/SSL 配置。](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-ssl-clients)

3. 对于集群的每个节点，使用[`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter) 命令更新[`sslMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.sslMode)到`preferSSL`. [[ 1 \]](https://www.mongodb.com/docs/manual/tutorial/upgrade-cluster-to-ssl/#footnote-update-mode-alternative)节点接受 TLS/SSL 和非 TLS/非 SSL 传入连接，并且它与其他服务器的连接使用 TLS/ `preferSSL`SSL 。[`net.ssl.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.mode)例如：

   ```shell
   db.adminCommand( { setParameter: 1, sslMode: "preferSSL" } )
   ```

   将集群的所有节点升级到这些设置。

   此时，所有连接都应使用 TLS/SSL。

4. 对于集群的每个节点，使用 [`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter)命令更新[`sslMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.sslMode) 到`requireSSL`. [[ 1 \]](https://www.mongodb.com/docs/manual/tutorial/upgrade-cluster-to-ssl/#footnote-update-mode-alternative)`requireSSL` 节点将[`net.ssl.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.mode)拒绝任何非 TLS/非 SSL 连接。例如：

   ```shell
   db.adminCommand( { setParameter: 1, sslMode: "requireSSL" } )
   ```

5. 升级所有节点后，使用适当的 TLS/SSL 设置编辑[配置文件](https://www.mongodb.com/docs/manual/reference/configuration-options/)，以确保在随后重新启动时，集群使用 TLS/SSL。

[ 1 ]  *( [1](https://www.mongodb.com/docs/manual/tutorial/upgrade-cluster-to-ssl/#ref-update-mode-alternative-id2) , [2](https://www.mongodb.com/docs/manual/tutorial/upgrade-cluster-to-ssl/#ref-update-mode-alternative-id3) , [3](https://www.mongodb.com/docs/manual/tutorial/upgrade-cluster-to-ssl/#ref-update-mode-alternative-id5) , [4](https://www.mongodb.com/docs/manual/tutorial/upgrade-cluster-to-ssl/#ref-update-mode-alternative-id6) )* 作为使用该 [`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter)命令的替代方法，您还可以使用适当的 TLS/SSL 选项和值重新启动节点。

*[ 2 ]( [1](https://www.mongodb.com/docs/manual/tutorial/upgrade-cluster-to-ssl/#ref-systemstore-id1) , [2](https://www.mongodb.com/docs/manual/tutorial/upgrade-cluster-to-ssl/#ref-systemstore-id4) )* 从 MongoDB 4.0 开始，您可以为 Windows 和 macOS 使用系统 SSL 证书存储。要使用系统 SSL 证书存储，请使用：

- [`net.tls.certificateSelector`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateSelector)（或命令行选项 `--tlsCertificateSelector`）而不是 [`net.tls.certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile)（或命令行选项``--certificateKeyFile``）。
- [`net.ssl.certificateSelector`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.certificateSelector)（或命令行选项 `--sslCertificateSelector`）而不是 [`net.ssl.PEMKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.ssl.PEMKeyFile)（或命令行选项``--sslPEMKeyFile``）。

使用系统 SSL 证书存储时，OCSP（在线证书状态协议）用于验证证书的吊销状态。

 参见

原文 - [Upgrade a Cluster to Use TLS/SSL]( https://docs.mongodb.com/manual/tutorial/upgrade-cluster-to-ssl/ )

译者：景圣