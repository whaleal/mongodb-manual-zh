 使用 x.509 证书对客户端进行身份验证

以下过程为独立 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)  实例上的客户端身份验证设置 x.509 证书身份验证。

要对副本集或分片集群使用 x.509 身份验证，请参阅[Use x.509 Certificate for Membership Authentication](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/)。

**先决条件**

TLS/SSL、PKI（公钥基础设施）证书（尤其是 x.509 证书）和证书颁发机构的完整描述超出了本文档的范围。 本教程假定您事先了解 TLS/SSL 以及访问有效的 x.509 证书。

**证书颁发机构**

对于生产用途，您的 MongoDB 部署应使用由证书颁发机构生成和签名的有效证书。 您或您的组织可以生成和维护独立的证书颁发机构，或使用第三方 TLS 供应商生成的证书。 获取和管理证书不在本文档的讨论范围之内。

要使用 x.509 身份验证，必须指定 `--tlsCAFile` 或 `net.tls.CAFile`，除非您使用 `--tlsCertificateSelector` 或 `--net.tls.certificateSelector`。

**客户端 x.509 证书**

您必须具有有效的 x.509 证书。 客户端 x.509 证书必须满足[client certificate requirements](https://www.mongodb.com/docs/manual/core/security-x.509/#std-label-client-x509-certificates-requirements)。

从 MongoDB 4.2 开始，如果在使用 x.509 身份验证时指定` --tlsAllowInvalidateCertificates` 或 `net.tls.allowInvalidCertificates: true` ，则无效证书仅足以建立 TLS 连接，但不足以进行身份验证。

**步骤**

1. 使用 x.509 身份验证进行部署

   todo

   要为副本集或分片集群设置 x.509 身份验证，请参阅[Use x.509 Certificate for Membership Authentication](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/#std-label-x509-internal-authentication)。

2. 将 x.509 证书主题添加为用户

   要使用客户端证书进行身份验证，您必须首先将客户端证书中的主题值作为 MongoDB 用户添加到 `$external` 数据库中。 每个唯一的 x.509 客户端证书对应一个 MongoDB 用户。 您不能使用单个客户端证书对多个 MongoDB 用户进行身份验证。

   >用户名要求
   >
   >- 要对 $external 身份验证用户（Kerberos、LDAP 或 x.509 用户）使用[Client Sessions and Causal Consistency Guarantees](https://www.mongodb.com/docs/manual/core/read-isolation-consistency-recency/#std-label-sessions)保证，用户名不能超过 10k 字节。
   >- 主题字符串中的 RDN 必须符合 [RFC2253](https://www.ietf.org/rfc/rfc2253.txt)标准。

   1. 您可以使用以下命令从客户端证书中检索 `RFC2253` 格式的主题：

      ```shell
      openssl x509 -in <pathToClientPEM> -inform PEM -subject -nameopt RFC2253
      ```

      该命令返回主题字符串和证书：

      ```shell
      subject= CN=myName,OU=myOrgUnit,O=myOrg,L=myLocality,ST=myState,C=myCountry
      -----BEGIN CERTIFICATE-----
      # ...
      -----END CERTIFICATE-----
      ```

   2. 添加符合 RFC2253 的值的主题作为用户。 根据需要省略空格。

      以下示例添加一个用户并授予该用户在测试数据库中的 [`readWrite`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWrite) 角色和 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase) 角色：

      ```javascript
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

      有关添加具有角色的用户的详细信息，请参阅[Manage Users and Roles](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/)。

3. 使用 x.509 证书进行身份验证

   在你拥有之后
   添加 x.509 客户端证书主题作为相应的 MongoDB 用户
   ，您可以使用客户端证书进行身份验证：

   todo

**下一步**

要对副本集或分片集群使用 x.509 身份验证，请参阅[Use x.509 Certificate for Membership Authentication](https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/)。

 参见

原文 - [Use x.509 Certificates to Authenticate Clients]( https://docs.mongodb.com/manual/tutorial/configure-x509-client-authentication/ )

译者: 景圣
