# Appendix C - OpenSSL Client Certificates for Testing
# 附录C - 用于测试的OpenSSL客户端证书

DISCLAIMER

声明

This page is provided for **testing purposes** only and the certificates are for **testing purposes only**.

此页仅用于**测试目的**；证书仅用于**测试目的**。

The following tutorial provides some basic steps for creating **test** x.509 certificates.

以下教程提供了创建**测试**x.509证书的一些基本步骤。

- Do not use these certificates for production. Instead, follow your security policies.
- 请勿将这些证书用于生产环境。相反，请遵循您的安全策略。
- For information on OpenSSL, refer to the official OpenSSL docs. Although this tutorial uses OpenSSL, the material should not be taken as an authoritative reference on OpenSSL.
- 有关OpenSSL的信息，请参考官方的OpenSSL文档。尽管本教程使用了OpenSSL，但不应将其视为OpenSSL的权威参考。

## Prerequisite 
## 前提条件

The procedure outlined on this page uses the **test** intermediate authority certificate and key `mongodb-test-ia.crt` and `mongodb-test-ia.key` created in [Appendix A - OpenSSL CA Certificate for Testing](https://docs.mongodb.com/manual/appendix/security/appendixA-openssl-ca/).

此页面上描述的过程使用了**测试**中间权限证书及在[附录A-用于测试的OpenSSL CA证书](https://docs.mongodb.com/manual/appendix/security/appendixA-openssl-ca/)中创建的密钥`mongodb-test-ia.crt`和`mongodb-test-ia.key`。

## Procedure
## 过程
The following procedure outlines the steps to create **test** certificates for MongoDB clients. For steps to create **test** certificates for MongoDB servers, see [Appendix B - OpenSSL Server Certificates for Testing](https://docs.mongodb.com/manual/appendix/security/appendixB-openssl-server/).

以下过程概述了为MongoDB客户端创建测试证书的步骤。有关为MongoDB服务器创建测试证书的步骤，请参阅[附录B - 用于测试的OpenSSL服务器证书](https://docs.mongodb.com/manual/appendix/security/appendixB-openssl-server/)

### A. Create the OpenSSL Configuration File
### A. 创建OpenSSL配置文件

1. Create a **test** configuration file `openssl-test-client.cnf` for your client with the following content: 
1. 用下面的内容为你的客户端创建一个**测试**配置文件`openssl-test-client.cnf`： 

   ```
   # NOT FOR PRODUCTION USE. OpenSSL configuration file for testing.
   
   [ req ]
   default_bits = 4096
   default_keyfile = myTestClientCertificateKey.pem    ## The default private key file name.
   default_md = sha256
   distinguished_name = req_dn
   req_extensions = v3_req
   
   
   [ v3_req ]
   subjectKeyIdentifier  = hash
   basicConstraints = CA:FALSE
   keyUsage = critical, digitalSignature, keyEncipherment
   nsComment = "OpenSSL Generated Certificate for TESTING only.  NOT FOR PRODUCTION USE."
   extendedKeyUsage  = serverAuth, clientAuth
   
   
   [ req_dn ]
   countryName = Country Name (2 letter code)
   countryName_default =
   countryName_min = 2
   countryName_max = 2
   
   stateOrProvinceName = State or Province Name (full name)
   stateOrProvinceName_default = TestClientCertificateState
   stateOrProvinceName_max = 64
   
   localityName = Locality Name (eg, city)
   localityName_default = TestClientCertificateLocality
   localityName_max = 64
   
   organizationName = Organization Name (eg, company)
   organizationName_default = TestClientCertificateOrg
   organizationName_max = 64
   
   organizationalUnitName = Organizational Unit Name (eg, section)
   organizationalUnitName_default = TestClientCertificateOrgUnit
   organizationalUnitName_max = 64
   commonName = Common Name (eg, YOUR name)
   commonName_max = 64
   ```


2. *Optional*. You can update the default Distinguished Name (DN) values. Ensure that client certificates differ from server certificates with regards to at least one of the following attributes: Organization (`O`), the Organizational Unit (`OU`) or the Domain Component (`DC`).
2. *可选*。您可以更新默认专有名称（DN）值。确保客户端证书与服务器证书在以下至少一项属性上有所不同：组织（`O`），组织单位（`OU`）或域组件（`DC`）。

### B. Generate the Test PEM File for Client

### B. 为客户端创建测试的PEM文件

1. Create the **test** key file `mongodb-test-client.key`.
1. 创建测试密钥文件`mongodb-test-client.key`。

   ```
   openssl genrsa -out mongodb-test-client.key 4096
   ```

2. Create the **test** certificate signing request `mongodb-test-client.csr`. When asked for Distinguished Name values, enter the appropriate values for your **test** certificate:
2. 创建测试的认证签名文件`mongodb-test-client.csr`。当要求提供专有名称值时，为你的测试证书输入合适的值。

  IMPORTANT

  重要

  The client certificate subject must differ to a server certificate subject with regards to at least one of the following attributes: Organization (O), the Organizational Unit (OU) or the Domain Component (DC).

  客户端证书主题必须与服务器证书主题在以下属性中至少有一项要不同：组织（`O`），组织单位（`OU`）或域组件（`DC`）。

  ```
  openssl req -new -key mongodb-test-client.key -out mongodb-test-client.csr -config openssl-test-client.cnf
  ```

3. Create the **test** client certificate `mongodb-test-client.crt`.
3. 创建测试客户端证书`mongodb-test-client.crt`。

   ```
   openssl x509 -sha256 -req -days 365 -in mongodb-test-client.csr -CA mongodb-test-ia.crt -CAkey mongodb-test-ia.key -CAcreateserial -out mongodb-test-client.crt -extfile openssl-test-client.cnf -extensions v3_req
   ```

4. Create the **test** PEM file for the client.
4. 为客户端创建测试的PEM文件。

   ```
   cat mongodb-test-client.crt mongodb-test-client.key > test-client.pem
   ```

   You can use the **test** PEM file to configure the [`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo) shell for TLS/SSL **testing**. For example, to connect to a [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) or a [`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos):

   你可以使用**测试**的PEM文件为TLS/SSL测试配置mongo shell。例如，连接一个[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)或者[`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)：

   **For MongoDB 4.2 or greater**, include the following options for the client:

   **对于MongoDB 4.2或更高版本**，在客户端中包含以下选项：

   ```
   mongo --tls --host <serverHost> --tlsCertificateKeyFile test-client.pem  --tlsCAFile test-ca.pem
   ```

   **For MongoDB 4.0 and earlier**, include the following options for the client:

   **对于MongoDB 4.0或更早版本**，在客户端中包含以下选项：

   ```
   mongo --ssl --host <serverHost> --sslPEMKeyFile test-client.pem  --sslCAFile test-ca.pem
   ```

###  On macOS

### 在macOS系统中

   If you are **testing** with Keychain Access to manage certificates, create a PKCS 12 file to add to Keychain Access instead of a PEM file:
  
   如果您使用Keychain Access管理证书，创建一个pkcs-12而不是PEM文件添加到Keychain Access中：

   ```
   openssl pkcs12 -export -out test-client.pfx -inkey mongodb-test-client.key -in mongodb-test-client.crt -certfile mongodb-test-ia.crt
   ```

   Once added to Keychain Access, instead of specifying the Certificate Key file, you can use the [`--tlsCertificateSelector`](https://docs.mongodb.com/manual/reference/program/mongo/#cmdoption-mongo-tlscertificateselector) to specify the certificate to use. If the CA file is also in Keychain Access, you can omit `--tlsCAFile` as well as in the following example:

   将其添加到Keychain Access后，您无需指定证书密钥文件，就可以使用[`--tlsCertificateSelector`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-tlscertificateselector)来指定要使用的证书。如果CA文件也在Keychain Access中，也可以省略`--tlsCAFile`。

   **For MongoDB 4.2 or greater** 
   **对于MongoDB 4.2或更高版本**

   ```
   mongo --tls --tlsCertificateSelector subject="<TestClientCertificateCommonName>"
   ```

   Although still available, [`--ssl`](https://docs.mongodb.com/manual/reference/program/mongo/#cmdoption-mongo-ssl) and [`--sslCertificateSelector`](https://docs.mongodb.com/manual/reference/program/mongo/#cmdoption-mongo-sslcertificateselector) are [deprecated as of MongoDB 4.2](https://docs.mongodb.com/manual/release-notes/4.2/#tls).

   虽然仍然可以使用，[`--sslMode`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-sslmode)和[`--sslCertificateSelector`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-sslcertificateselector)在[MongoDB 4.2中已废弃](https://docs.mongodb.com/manual/release-notes/4.2/#tls)。

   **For MongoDB 4.0 and earlier**
   **对于MongoDB 4.0及更早版本**

   ```
   mongo --ssl --sslCertificateSelector subject="<TestClientCertificateCommonName>"
   ```

   For adding certificates to Keychain Access, refer to your official documentation for Keychain Access.

   要向Keychain Access添加证书，请参阅Keychain Access的官方文档。

   ```
   mongod --tlsMode requireTLS --tlsCertificateSelector subject="<TestServerCertificateCommonName>"
   ```

SEE ALSO 

- [Appendix A - OpenSSL CA Certificate for Testing](https://docs.mongodb.com/manual/appendix/security/appendixA-openssl-ca/#appendix-ca-certificate)
- [Appendix B - OpenSSL Server Certificates for Testing](https://docs.mongodb.com/manual/appendix/security/appendixB-openssl-server/#appendix-server-certificate)
- [Client x.509 Certificate](https://docs.mongodb.com/manual/tutorial/configure-x509-client-authentication/#x509-client-authentication)

另请查阅

- [附录A - 用于测试的OpenSSL CA证书](https://docs.mongodb.com/manual/appendix/security/appendixA-openssl-ca/#appendix-ca-certificate)
- [附录C - 用于测试的OpenSSL客户端证书](https://docs.mongodb.com/manual/appendix/security/appendixC-openssl-client/#appendix-client-certificate)
- [成员的x.509证书](https://docs.mongodb.com/manual/tutorial/configure-x509-member-authentication/#x509-member-certificate)

