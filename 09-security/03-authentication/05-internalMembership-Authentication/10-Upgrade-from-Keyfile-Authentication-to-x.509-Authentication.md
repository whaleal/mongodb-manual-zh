 **从密钥文件身份验证升级到 x.509 身份验证**

要将当前使用密钥文件身份验证的集群升级到 x.509 身份验证，请使用以下滚动升级过程。

>[NOTE]注意
>
>从 4.0 版开始，MongoDB 在 TLS 1.1+ 可用的系统上禁用对 TLS 1.0 加密的支持。 有关详细信息，请参阅[Disable TLS 1.0](https://www.mongodb.com/docs/manual/release-notes/4.0/#std-label-4.0-disable-tls)。

**升级过程（使用 tls 选项）**

>[NOTE]注意
>
>从版本 4.2 开始，MongoDB 提供与 `net.ssl` 设置（及其相应的 `--ssl` 命令行选项）相对应的 `net.tls `设置（以及相应的` --tls` 命令行选项）。 新的 `tls` 设置/选项提供与 `ssl` 设置/选项相同的功能，因为 MongoDB 一直支持 TLS 1.0 及更高版本。
>
>本节中的过程使用 `tls` 设置/选项。 有关使用 `ssl` 设置/选项的过程，请参阅[Upgrade Procedures (Using `ssl` Options)](https://www.mongodb.com/docs/manual/tutorial/upgrade-keyfile-to-x509/#std-label-upgrade-to-x509-ssl)。

**使用 TLS/SSL 和密钥文件升级（使用 tls 选项）集群**

>[NOTE]注意
>
>该过程使用 tls 设置/选项。 有关使用 ssl 设置/选项的过程，请参阅
>当前使用 TLS/SSL 的集群（使用 ssl 选项）。

对于使用 TLS/SSL 和密钥文件身份验证的集群，要升级到 x.509 集群身份验证，请使用以下滚动升级过程：

1. 对于集群的每个成员，将以下设置添加到[configuration file](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-conf-file)并重新启动：

   - [`security.clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.clusterAuthMode)

     设置为发送密钥文件。 使用此设置值，每个节点继续发送其密钥文件以将自己验证为成员。 但是，每个节点都可以从其他成员接收密钥文件或 x.509 证书来验证这些成员。

   - [`net.tls.clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile)

     设置为用于成员身份验证的节点证书密钥文件的适当路径。 mongod / mongos 将此文件呈现给集群的其他成员，以将自己标识为成员。

   包括其他 [TLS/SSL options](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)和适合您的特定配置的任何其他选项。

   例如：

   ```yaml
   net:
      tls:
         mode: requireTLS
         certificateKeyFile: /etc/ssl/mongodb.pem
         CAFile: /etc/ssl/caToValidateReceivedCertificates.pem
         clusterFile: "/etc/ssl/myReplMembershipCertificateKeyFile.pem"
   security:
      clusterAuthMode: sendKeyFile
      keyFile: /my/securely/located/membershipkey
   replication:
      replSetName: myReplicaSet
   net:
      bindIp: localhost,mongodb0.example.net
      port: 27017
   systemLog:
      destination: file
      path: "/var/log/mongodb/mongod.log"
      logAppend: true
   storage:
      dbPath: "/var/lib/mongodb"
   processManagement:
      fork: true
   ```

   在继续之前更新集群的所有节点以包括 [`security.clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.clusterAuthMode)和 [`net.tls.clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile) 设置。

2. 连接到每个节点并使用 [`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter)  命令将[`clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.clusterAuthMode) 更新为 `sendX509`。 [1]

   ```shell
   db.adminCommand( { setParameter: 1, clusterAuthMode: "sendX509" } )
   ```

   使用 `sendX509`，每个节点发送其 [`net.tls.clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile)  以将自己验证为成员。 但是，每个节点都可以从其他成员接收密钥文件或 x.509 证书来验证这些成员。

   在继续之前将集群的所有节点升级到此设置。

3. 可选但推荐。 最后，对于集群的每个节点，连接到该节点并使用[`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter)命令将[`clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.clusterAuthMode)更新为x509以仅使用x.509证书进行身份验证。 [1]

   ```shell
   db.adminCommand( { setParameter: 1, clusterAuthMode: "x509" } )
   ```

4. 升级所有节点后，使用适当的 x.509 设置编辑[configuration file](https://www.mongodb.com/docs/manual/reference/configuration-options/)，以确保在随后重新启动时，集群使用 x.509 身份验证。 例如：

   ```yaml
   net:
      tls:
         mode: requireTLS
         certificateKeyFile: /etc/ssl/mongodb.pem
         CAFile: /etc/ssl/caToValidateReceivedCertificates.pem
         clusterFile: "/etc/ssl/myReplMembershipCertificateKeyFile.pem"
   security.clusterAuthMode: x509
   replication:
      replSetName: myReplicaSet
   net:
      bindIp: localhost,mongodb0.example.net
      port: 27017
   systemLog:
      destination: file
      path: "/var/log/mongodb/mongod.log"
      logAppend: true
   storage:
      dbPath: "/var/lib/mongodb"
   processManagement:
      fork: true
   ```

>[TIP]提示
>
>也可以看看：
>
>您还可以使用命令行选项而不是配置文件来配置 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) ：
>
>- For [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod), see: - [`--tlsMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsMode) - [`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsCertificateKeyFile) - [`--tlsCAFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsCAFile) - [`--tlsClusterFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsClusterFile) - [`--clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--clusterAuthMode)
>- For [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos), see: - [`--tlsMode`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsMode) - [`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsCertificateKeyFile) - [`--tlsCAFile`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsCAFile) - [`--tlsClusterFile`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsClusterFile) - [`--clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--clusterAuthMode)

**使用密钥文件而不是 TLS/SSL 更新（使用 tls 选项）集群**

>[NOTE]注意
>
>该过程使用 `tls` 选项。 有关使用 `ssl` 设置/选项的过程，请参阅[Clusters Currently Not Using TLS/SSL (Using `ssl` Options)](https://www.mongodb.com/docs/manual/tutorial/upgrade-keyfile-to-x509/#std-label-upgrade-keyfile-to-x509-ssl)。

对于使用密钥文件身份验证但不使用 TLS/SSL 的集群，升级到 x.509 成员资格身份验证和 TLS/SSL 连接：

1. 对于集群的每个成员，将以下设置添加到配置文件并重新启动：

   - [`net.tls.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.mode)

     设置为允许 TLS。 该值允许节点接受 TLS/SSL 和非 TLS/非 SSL 传入连接。 它的传出连接不使用 TLS/SSL。

   - [`net.tls.certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile)

     设置为包含 TLS/SSL 证书和密钥的文件的路径。[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) / [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)将此文件呈现给其客户端以建立实例的身份。 使用 TLS/SSL 时需要。

   - [`net.tls.CAFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.CAFile)

     设置为包含用于验证收到的证书的证书链的文件的路径。

   - [`security.clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.clusterAuthMode)

     设置为发送密钥文件。 使用此设置值，每个节点继续发送其密钥文件以将自己验证为成员。 但是，每个节点都可以从其他成员接收密钥文件或 x.509 证书来验证这些成员。

   包括其他 [TLS/SSL options](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)和适合您的特定配置的任何其他选项。

   例如：

   ```yaml
   net:
      tls:
         mode: allowTLS
         certificateKeyFile: /etc/ssl/mongodb.pem
         clusterFile: "/etc/ssl/myReplMembershipCertificateKeyFile.pem"
         CAFile: /etc/ssl/caToValidateReceivedCertificates.pem
   security:
      clusterAuthMode: sendKeyFile
      keyFile: /my/securely/located/membershipkey
   replication:
      replSetName: myReplicaSet
   net:
      bindIp: localhost,mongodb0.example.net
      port: 27017
   systemLog:
      destination: file
      path: "/var/log/mongodb/mongod.log"
      logAppend: true
   storage:
      dbPath: "/var/lib/mongodb"
   processManagement:
      fork: true
   ```

   升级集群的所有节点以包括 [`net.tls.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.mode)、[`net.tls.certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile)、[`net.tls.clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile) 和 [`security.clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.clusterAuthMode)。

2. 连接到每个节点并使用 [`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter)  命令 [1] 来：

   - 将[`tlsMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.tlsMode) 更新为 preferSSL。 将[`tlsMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.tlsMode) 设置为 preferTLS 时，节点接受 TLS/SSL 和非 TLS/非 SSL 传入连接，并且其传出连接使用 TLS/SSL。
   - 将 [`clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.clusterAuthMode) 更新为 `sendX509`。 将 [`clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.clusterAuthMode) 设置为 `sendX509` 后，每个节点都会发送其 [`net.tls.clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile) 以将自己验证为成员。 但是，每个节点继续接受来自其他成员的密钥文件或 x.509 证书以验证这些成员。

   ```shell
   db.adminCommand( { setParameter: 1, tlsMode: "preferTLS" } );
   db.adminCommand( { setParameter: 1, clusterAuthMode: "sendX509" } );
   ```

   在继续之前将集群的所有节点升级到这些设置。

3. 升级所有节点后，使用适当的 TLS/SSL 和 x.509 设置编辑[configuration file](https://www.mongodb.com/docs/manual/reference/configuration-options/)，以确保在随后重新启动时，集群使用 x.509 身份验证。

   ```yaml
   net:
      tls:
         mode: preferTLS
         certificateKeyFile: /etc/ssl/mongodb.pem
         clusterFile: "/etc/ssl/myReplMembershipCertificateKeyFile.pem"
         CAFile: /etc/ssl/caToValidateReceivedCertificates.pem
   security:
      clusterAuthMode: sendX509
   replication:
      replSetName: myReplicaSet
   net:
      bindIp: localhost,mongodb0.example.net
      port: 27017
   systemLog:
      destination: file
      path: "/var/log/mongodb/mongod.log"
      logAppend: true
   storage:
      dbPath: "/var/lib/mongodb"
   processManagement:
      fork: true
   ```

   >[NOTE]注意
   >
   >在此刻，
   >
   >- 集群中的节点使用 TLS/SSL 连接。 但是，节点可以接受来自客户端应用程序的非 TLS/SSL 连接。
   >
   >
   >- 节点发送它们的 x.509 证书以进行成员身份验证，但可以接受来自其他节点的 x.509 证书或密钥文件以验证其他节点的成员身份。
   >
   >
   >要从客户端应用程序强制执行 TLS/SSL 连接以及仅接受 x.509 进行成员身份验证，请参阅下一步。

4. 可选但推荐。 更新所有节点以仅使用 `TLS/SSL` 连接和仅用于成员身份验证的 x.509 证书。

   >[IMPORTANT]重要
   >
   >此 TLS/SSL 连接要求适用于所有连接； 也就是说，与客户以及集群的成员。 也就是说，客户端必须指定 TLS/SSL 连接，并在连接到集群时出示其证书密钥文件。 有关使用 TLS/SSL 连接的更多信息，请[Connect to MongoDB Instance that Requires Client Certificates (`tls` Options)](https://www.mongodb.com/docs/manual/tutorial/configure-ssl-clients/#std-label-mongo-connect-require-client-certificates-tls)。 另请参阅[Validate Only if a Client Presents a Certificate](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/#std-label-ssl-mongod-weak-certification)。

   将 [`net.tls.mode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.mode) 更新为 `requireTLS` 并将 [`security.clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.clusterAuthMode) 更新为 x509。

   例如：

   ```yaml
   net:
      tls:
         mode: requireTLS
         certificateKeyFile: /etc/ssl/mongodb.pem
         clusterFile: "/etc/ssl/myReplMembershipCertificateKeyFile.pem"
         CAFile: /etc/ssl/caToValidateReceivedCertificates.pem
   security:
      clusterAuthMode: x509
   replication:
      replSetName: myReplicaSet
   net:
      bindIp: localhost,mongodb0.example.net
      port: 27017
   systemLog:
      destination: file
      path: "/var/log/mongodb/mongod.log"
      logAppend: true
   storage:
      dbPath: "/var/lib/mongodb"
   processManagement:
      fork: true
   ```

>[TIP]提示
>
>也可以看看：
>
>您还可以使用命令行选项而不是配置文件来配置 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) ：
>
>- For [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod), see: - [`--tlsMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsMode) - [`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsCertificateKeyFile) - [`--tlsCAFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsCAFile) - [`--tlsClusterFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsClusterFile) - [`--clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--clusterAuthMode)
>- For [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos), see: - [`--tlsMode`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsMode) - [`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsCertificateKeyFile) - [`--tlsCAFile`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsCAFile) - [`--tlsClusterFile`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--tlsClusterFile) - [`--clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-option-mongos.--clusterAuthMode)

**使用密钥文件而不是 TLS/SSL 更新（使用 tls 选项）集群**

>[NOTE]注意
>
>该过程使用 `tls` 选项。 有关使用 `ssl` 设置/选项的过程，请参阅[Clusters Currently Not Using TLS/SSL (Using `ssl` Options)](https://www.mongodb.com/docs/manual/tutorial/upgrade-keyfile-to-x509/#std-label-upgrade-keyfile-to-x509-ssl)。

对于使用 TLS/SSL 和密钥文件身份验证的集群，要升级到 x.509 集群身份验证，请使用以下滚动升级过程：

1. 对于集群的每个节点，启动节点时将选项 [`--clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--clusterAuthMode) 设置为 `sendKeyFile` 并将选项 [`--sslClusterFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslClusterFile) 设置为节点证书的适当路径。 包括其他 [TLS/SSL options](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)以及特定配置所需的任何其他选项。 例如：

   ```shell
   mongod --replSet <name> --sslMode requireSSL --clusterAuthMode sendKeyFile --sslClusterFile <path to membership certificate and key PEM file> --sslPEMKeyFile <path to TLS/SSL Certificate and key PEM file>  --sslCAFile <path to root CA PEM file> --bind_ip localhost,<hostname(s)|ip address(es)>
   ```

   使用此设置，每个节点继续使用其密钥文件将自己验证为成员。 但是，每个节点现在都可以接受来自其他成员的密钥文件或 x.509 证书来验证这些成员。 将集群的所有节点升级到此设置。

2. 然后，对于集群的每个节点，连接到该节点并使用 [`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter) 命令将 [`clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.clusterAuthMode) 更新为 `sendX509`。 [1] 例如，

   ```shell
   db.adminCommand( { setParameter: 1, clusterAuthMode: "sendX509" } )
   ```

   使用此设置，每个节点都使用其 x.509 证书（在上一步中使用 [`--sslClusterFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslClusterFile) 选项指定）将自己验证为成员。 但是，每个节点继续接受来自其他成员的密钥文件或 x.509 证书以验证这些成员。 将集群的所有节点升级到此设置。

3. 可选但推荐。 最后，对于集群的每个节点，连接到该节点并使用[`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter)命令将[`clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.clusterAuthMode)更新为x509以仅使用x.509证书进行身份验证。 [1] 例如：

   ```shell
   db.adminCommand( { setParameter: 1, clusterAuthMode: "x509" } )
   ```

4. 升级所有节点后，使用适当的 x.509 设置编辑[configuration file](https://www.mongodb.com/docs/manual/reference/configuration-options/)，以确保在随后重新启动时，集群使用 x.509 身份验证。

有关各种模式及其描述，请参阅 [`--clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--clusterAuthMode)。

**当前未使用 TLS/SSL 的集群（使用 ssl 选项）**

>[NOTE]注意
>
>该过程使用 `tls` 选项。 有关使用 `ssl` 设置/选项的过程，请参阅[Clusters Currently Not Using TLS/SSL (Using `ssl` Options)](https://www.mongodb.com/docs/manual/tutorial/upgrade-keyfile-to-x509/#std-label-upgrade-keyfile-to-x509-ssl)。

对于使用密钥文件身份验证但不使用 TLS/SSL 的集群，要升级到 x.509 身份验证，请使用以下滚动升级过程：

1. 对于集群的每个节点，启动节点时将选项 [`--sslMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslMode)设置为 `allowSSL` ,选项 [`--clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--clusterAuthMode) 设置为 `sendKeyFile`，选项 [`--sslClusterFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslClusterFile) 设置为节点证书的适当路径。 包括其他 [TLS/SSL options](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)以及特定配置所需的任何其他选项。 例如：

   ```shell
   mongod --replSet <name> --sslMode allowSSL --clusterAuthMode sendKeyFile --sslClusterFile <path to membership certificate and key PEM file> --sslPEMKeyFile <path to TLS/SSL certificate and key PEM file> --sslCAFile <path to root CA PEM file> --bind_ip localhost,<hostname(s)|ip address(es)>
   ```

   [`--sslMode allowSSL`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslMode) 设置允许节点接受 TLS/SSL 和非 TLS/非 SSL 传入连接。 它的传出连接不使用 TLS/SSL。

   [`--clusterAuthMode sendKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--clusterAuthMode) 设置允许每个节点继续使用其密钥文件将自己验证为成员。 但是，每个节点现在都可以接受来自其他成员的密钥文件或 x.509 证书来验证这些成员。

   将集群的所有节点升级到这些设置。

2. 然后，对于集群的每个节点，连接到该节点并使用 [`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter) 命令将 [`sslMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.sslMode) 更新为 `preferSSL` 并将 [`clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.clusterAuthMode) 更新为`sendX509`。 [1] 例如：

   ```shell
   db.adminCommand( { setParameter: 1, sslMode: "preferSSL", clusterAuthMode: "sendX509" } )
   ```

   将 [`sslMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.sslMode) 设置为 `preferSSL` 后，节点接受 TLS/SSL 和非 TLS/非 SSL 传入连接，并且其传出连接使用 TLS/SSL。

   将 [`clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.clusterAuthMode) 设置为 `sendX509` 后，每个节点都使用其 x.509 证书（在上一步中使用 [`--sslClusterFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--sslClusterFile) 选项指定）将自己验证为成员。 但是，每个节点继续接受来自其他成员的密钥文件或 x.509 证书以验证这些成员。

   将集群的所有节点升级到这些设置。

3. 可选但推荐。 最后，对于集群的每个节点，连接到该节点并使用 [`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter) 命令将 [`sslMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.sslMode) 更新为 `requireSSL` 并将 [`clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.clusterAuthMode) 更新为 `x509`。 [1] 例如：

   ```shell
   db.adminCommand( { setParameter: 1, sslMode: "requireSSL", clusterAuthMode: "x509" } )
   ```

   将 [`sslMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.sslMode) 设置为 requireSSL 后，节点仅使用 TLS/SSL 连接。

   当 [`clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.clusterAuthMode) 设置为 x509 时，节点仅使用 x.509 证书进行身份验证。

4. 升级所有节点后，使用适当的 TLS/SSL 和 x.509 设置编辑[configuration file](https://www.mongodb.com/docs/manual/reference/configuration-options/)，以确保在随后重新启动时，集群使用 x.509 身份验证。

有关各种模式及其描述，请参阅 [`--clusterAuthMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--clusterAuthMode)。

[1] (1, 2, 3, 4, 5, 6, 7) 作为使用 [`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter) 命令的替代方法，您还可以使用适当的 TLS/SSL 和 x509 选项和值重新启动节点。

 参见

原文 - [Upgrade from Keyfile Authentication to x.509 Authentication]( https://docs.mongodb.com/manual/tutorial/upgrade-keyfile-to-x509/ )

译者：景圣