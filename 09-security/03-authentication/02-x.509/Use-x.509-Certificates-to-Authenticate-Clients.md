# 使用 x.509 证书对客户端进行身份验证

以下过程为独立实例上的客户端身份验证设置 x.509 证书身份验证[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

要对副本集或分片集群使用 x.509 身份验证，请参阅 [使用 x.509 证书进行成员身份验证。](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/)

## 先决条件

TLS/SSL、PKI（公钥基础设施）证书（尤其是 x.509 证书）和证书颁发机构的完整描述超出了本文档的范围。本教程假定您事先了解 TLS/SSL 以及访问有效的 x.509 证书。

### 证书颁发机构

对于生产用途，您的 MongoDB 部署应使用由证书颁发机构生成和签名的有效证书。您或您的组织可以生成和维护独立的证书颁发机构，或使用第三方 TLS 供应商生成的证书。获取和管理证书超出了本文档的范围。

要使用 x.509 身份验证， 必须指定`--tlsCAFile`or除非您使用 or 。`net.tls.CAFile``--tlsCertificateSelector``--net.tls.certificateSelector`

### 客户端 x.509 证书

您必须具有有效的 x.509 证书。客户端 x.509 证书必须满足[客户端证书要求。](https://www.mongodb.com/docs/manual/core/security-x.509/#std-label-client-x509-certificates-requirements)

从 MongoDB 4.2 开始，如果您指定 `--tlsAllowInvalidateCertificates`或 `net.tls.allowInvalidCertificates: true`使用 x.509 身份验证时，无效证书仅足以建立 TLS 连接但不足以*进行*身份验证。

## 程序

1. 使用 x.509 身份验证进行部署

   命令选项:

   您可以[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)从命令行为 x.509 身份验证配置实例。

   要配置独立[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例，请运行以下命令：

   ```
   mongod --tlsMode requireTLS \
       --tlsCertificateKeyFile <path to TLS/SSL certificate and key PEM file> \
       --tlsCAFile <path to root CA PEM file> --bind_ip <hostnames>
   ```

   根据您的配置需要包括其他选项。

   x.509 配置要求：

   | 选项                                                         | 笔记                                         |
   | :----------------------------------------------------------- | :------------------------------------------- |
   | [`--tlsMode`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsMode) | 指定`requireTLS`。                           |
   | [`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsCertificateKeyFile) | 指定实例的 x.509 证书以呈现给客户端。        |
   | [`--tlsCAFile`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--tlsCAFile) | 指定证书颁发机构文件以验证提供给实例的证书。 |

   要为副本集或分片集群设置 x.509 身份验证，请参阅[使用 x.509 证书进行成员身份验证。](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/#std-label-x509-internal-authentication)

2.  将 x.509 证书添加`subject`为用户

   要使用客户端证书进行身份验证，您必须首先将来自客户端证书的值`subject`作为 MongoDB 用户添加到 `$external`数据库中。每个唯一的 x.509 客户端证书对应一个 MongoDB 用户。您不能使用单个客户端证书对多个 MongoDB 用户进行身份验证。

   >笔记:
   >
   >**用户名要求**
   >
   >- 要对身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[客户端会话和因果一致性保证](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)，`$external`用户名不能超过 10k 字节。
   >- 字符串中的 RDN`subject`必须与 [RFC2253](https://www.ietf.org/rfc/rfc2253.txt)标准。

   * 您可以使用以下命令从客户端证书中检索`RFC2253`格式化：`subject`

     ```
     openssl x509 -in <pathToClientPEM> -inform PEM -subject -nameopt RFC2253
     ```

     该命令返回`subject`字符串和证书：

     ```
     subject= CN=myName,OU=myOrgUnit,O=myOrg,L=myLocality,ST=myState,C=myCountry
     -----BEGIN CERTIFICATE-----
     # ...
     -----END CERTIFICATE-----
     ```

   * 添加作为用户`RFC2253`的合规值。`subject`根据需要省略空格。

     以下示例添加一个用户并授予该用户 [`readWrite`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWrite)在数据库中的角色`test`和 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)角色：

     ```
     db.getSiblingDB("$external").runCommand(
       {
         createUser: "CN=myName,OU=myOrgUnit,O=myOrg,L=myLocality,ST=myState,C=myCountry",
         roles: [
              { role: "readWrite", db: "test" },
              { role: "userAdminAnyDatabase", db: "admin" }
         ],
         writeConcern: { w: "majority" , wtimeout: 5000 }
       }
     )
     ```

     有关添加具有角色的用户的详细信息，请参阅[管理用户和角色。](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/)

     

3. 使用 x.509 证书进行身份验证

   在你拥有之后[添加 x.509 客户端证书主题作为相应的 MongoDB 用户](https://www.mongodb.com/docs/manual/tutorial/configure-x509-client-authentication/#std-label-addX509SubjectUser)，您可以使用客户端证书进行身份验证：

   **连接身份验证;**

   要在连接期间进行身份验证，请运行以下命令：

   ```
   mongosh --tls --tlsCertificateKeyFile <path to client PEM file> \
       --tlsCAFile <path to root CA PEM file> \
       --authenticationDatabase '$external' \
       --authenticationMechanism MONGODB-X509
   ```

   | 选项                                                         | 笔记                                                         |
   | :----------------------------------------------------------- | :----------------------------------------------------------- |
   | [`--tls`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tls) |                                                              |
   | [`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateKeyFile) | 指定客户端的 x.509 文件。                                    |
   | [`--tlsCAFile`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCAFile) | 指定证书颁发机构文件以验证实例提供的证书[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 。 |
   | [`--authenticationDatabase`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationDatabase) | 指定`'$external'`。                                          |
   | [`--authenticationMechanism`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationMechanism) | 指定`MONGODB-X509`。                                         |

   **连接后验证:**

   您可以在不进行身份验证的情况下进行连接，并 [`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth)在连接后使用该方法进行身份验证。

   例如，如果使用[`mongosh`,](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

   * 连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到 [`mongod`：](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

     ```
     mongosh --tls --tlsCertificateKeyFile <path to client PEM file> \
         --tlsCAFile <path to root CA PEM file>
     ```

     | 选项                                                         | 笔记                                                         |
     | :----------------------------------------------------------- | :----------------------------------------------------------- |
     | [`--tls`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tls) |                                                              |
     | [`--tlsCertificateKeyFile`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateKeyFile) | 指定客户端的 x.509 文件。                                    |
     | [`--tlsCAFile`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCAFile) | [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)指定证书颁发机构文件以验证或实例提供的证书 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 。 |

   * 要进行身份验证，请使用数据库[`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth)中的方法`$external`。对于该`mechanism`字段，指定`"MONGODB-X509"`。

     ```
     db.getSiblingDB("$external").auth(
       {
         mechanism: "MONGODB-X509"
       }
     )
     ```

     

   ## 下一步

   要对副本集或分片集群使用 x.509 身份验证，请参阅 [使用 x.509 证书进行成员身份验证。](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/)



翻译：韩鹏帅

原文：[Use x.509 Certificates to Authenticate Clients](https://www.mongodb.com/docs/manual/tutorial/configure-x509-client-authentication/)