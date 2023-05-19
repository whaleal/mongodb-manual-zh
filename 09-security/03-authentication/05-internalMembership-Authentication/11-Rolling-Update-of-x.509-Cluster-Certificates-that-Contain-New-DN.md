 **包含新 DN 的 x.509 集群证书的滚动更新**

副本集或分片集群的成员可以使用 [x.509 certificates for membership authentication](https://www.mongodb.com/docs/manual/core/security-internal-authentication/#std-label-internal-auth-x509)，以将彼此识别为同一部署的成员。

要将彼此识别为同一部署的成员，证书中的组织属性 (`O`)、组织单位属性 (`OU`) 和域组件 (`DC`) 必须匹配。

在某些情况下，您可能需要将成员证书更新为具有新可分辨名称 (`DN`) 的新证书，例如组织更改其名称时。 从 version 4.2 开始，MongoDB 提供了一个新的 [`tlsX509ClusterAuthDNOverride`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.tlsX509ClusterAuthDNOverride) 参数来设置用于匹配的替代 `DN`。 使用此参数，您可以将证书滚动更新为具有不同 `DN` 的新证书。

以下教程描述了在不停机的情况下更新副本集证书的过程。

考虑一个副本集，其中每个成员的证书（[`clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile) 和 [`certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile)）的 `DN` 值包含`“OU=10gen Server,O=10gen”`（其他属性不被视为比较的一部分）：

```properties
net.tls.mode: requireTLS
net.tls.certificateKeyFile: "./mycerts/10gen-server1.pem"
net.tls.CAFile: "./mycerts/ca.pem"

security.clusterAuthMode: x509
net.tls.clusterFile:  "./mycerts/10gen-cluster1.pem"
net.tls.clusterCAFile: "./mycerts/ca.pem"
```

以下过程将成员的证书（[`clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile) 和 [`certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile)）更新为 `DN` 值为`“OU=MongoDB Server,O=MongoDB”`的新证书。

>[NOTE]注意
>
>以下过程假定新的 x.509 证书满足成员证书的所有其他要求。 详情请见[Member Certificate Requirements](https://www.mongodb.com/docs/manual/core/security-x.509/#std-label-x509-member-certificate-requirements)

**步骤**

**0. 可选。 在运行成员上设置覆盖参数**

该过程要求重新启动部署的所有成员。 由于在您重新启动所有成员之前不会考虑这些设置，因此您的实例可能会记录消息，直到该过程完成。

为避免出现这些消息，您可以在运行成员上设置覆盖参数。

将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 直接连接到部署的每个成员并将 [`tlsX509ClusterAuthDNOverride`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.tlsX509ClusterAuthDNOverride) 参数设置为新证书 `DN`：

```shell
db.adminCommand( { setParameter: 1, tlsX509ClusterAuthDNOverride: "OU=MongoDB Server,O=MongoDB" } )
```

1. **修改所有成员的配置**

   修改每个成员的配置：

   将 [`net.tls.certificateKeyFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.certificateKeyFile) 更新为新证书。

   将 [`net.tls.clusterFile`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.tls.clusterFile) 更新为新证书。

   将 [`tlsX509ClusterAuthDNOverride`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.tlsX509ClusterAuthDNOverride) 参数设置为新的证书 DN。

   例如：

   ```properties
   net.tls.mode: requireTLS
   net.tls.certificateKeyFile: "./mycerts/mongodb-server1.pem"
   net.tls.CAFile: "./mycerts/ca.pem"
   
   security.clusterAuthMode: x509
   
   net.tls.clusterFile:  "./mycerts/mongodb-cluster1.pem"
   net.tls.clusterCAFile: "./mycerts/ca.pem"
   
   setParameter:
      tlsX509ClusterAuthDNOverride: "OU=MongoDB Server,O=MongoDB"
   ```

   在您重新启动每个成员之前，这些设置不会被考虑在内（请参阅下一步）。

2. **重启每个成员**

   修改所有成员的配置后，重新启动每个辅助节点，然后重新启动主节点。

   **对于每个次要成员**，将 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到该成员并：

   - 使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法关闭成员：

     ```javascript
     use admin
     db.shutdownServer()
     ```

   - 重新启动成员。

     在重新启动下一个辅助节点之前，确保该成员已达到 SECONDARY 状态。

   **对于主要的**，将  [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 连接到成员，然后

   - 使用 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown) 降级成员：

     ```shell
     rs.stepDown()
     ```

   - 使用 [`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法关闭成员：

     ```shell
     use admin
     db.shutdownServer()
     ```

   - 重新启动成员。

3. **删除 `tlsX509ClusterAuthDNOverride` 设置**

   使用新证书重新启动所有成员后，您可以从配置中删除 `tlsX509ClusterAuthDNOverride` 参数。

   例如：

   ```properties
   net.tls.mode: requireTLS
   net.tls.certificateKeyFile: "./mycerts/mongodb-server1.pem"
   net.tls.CAFile: "./mycerts/ca.pem"
   
   security.clusterAuthMode: x509
   
   net.tls.clusterFile:  "./mycerts/mongodb-cluster1.pem"
   net.tls.clusterCAFile: "./mycerts/ca.pem"
   ```

   在您重新启动每个成员之前，这些设置不会被考虑在内。

 参见

原文 - [Rolling Update of x.509 Cluster Certificates that Contain New DN]( https://docs.mongodb.com/manual/tutorial/rotate-x509-membership-certificates/ )

译者：景圣