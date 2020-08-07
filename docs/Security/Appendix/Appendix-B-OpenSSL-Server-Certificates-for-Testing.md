# Appendix B - OpenSSL Server Certificates for Testing

# 附录 B-用于测试的OpenSSL服务器证书
DISCLAIMER

免责声明

This page is provided for **testing purposes** only and the certificates are for **testing purposes only**.

此页面仅用于**测试目的**；证书仅用于**测试目的**。

The following tutorial provides some basic steps for creating **test** x.509 certificates:

以下教程提供了创建**测试**x.509证书的一些基本步骤：

- Do not use these certificates for production. Instead, follow your security policies.
- For information on OpenSSL, refer to the official OpenSSL docs. Although this tutorial uses OpenSSL, the material should not be taken as an authoritative reference on OpenSSL.

- 请勿将这些证书用于生产环境。相反，请遵循您的安全策略。
- 有关OpenSSL的信息，请参考官方的OpenSSL文档。尽管本教程使用的是OpenSSL，但不应将本材料当作OpenSSL的权威参考。

## Prerequisite
## 前提条件

The procedure outlined on this page uses the **test** intermediate authority certificate and key `mongodb-test-ia.crt` and `mongodb-test-ia.key` created in [Appendix A - OpenSSL CA Certificate for Testing](https://docs.mongodb.com/manual/appendix/security/appendixA-openssl-ca/) .

本页所描述的过程会使用**测试**的中间权限证书以及在[附录A - 用于测试的OpenSSL CA证书](https://docs.mongodb.com/manual/appendix/security/appendixA-openssl-ca/)中创建的秘钥  `mongodb-test-ia.crt` 和 `mongodb-test-ia.key` 。

## Procedure[¶](https://docs.mongodb.com/manual/appendix/security/appendixB-openssl-server/#procedure)
## 过程[¶](https://docs.mongodb.com/manual/appendix/security/appendixB-openssl-server/#procedure)

The following procedure outlines the steps to create **test** certificates for MongoDB servers. For steps to create **test** certificates for MongoDB clients, see [Appendix C - OpenSSL Client Certificates for Testing](https://docs.mongodb.com/manual/appendix/security/appendixC-openssl-client/).

以下过程概述了为MongoDB服务器创建**测试**证书的步骤。有关为MongoDB客户端创建**测试**证书的步骤，请参阅[附录C - 用于测试的OpenSSL客户端证书](https://docs.mongodb.com/manual/appendix/security/appendixC-openssl-client/)。

### A. Create the OpenSSL Configuration File 

### A. 创建OpenSSL配置文件

1. Create a **test** configuration file `openssl-test-server.cnf` for your server with the following content:

1. 使用以下内容为您的服务器创建一个**测试**配置文件`openssl-test-server.cnf`：

   ```
   # NOT FOR PRODUCTION USE. OpenSSL configuration file for testing.
   
   
   [ req ]
   default_bits = 4096
   default_keyfile = myTestServerCertificateKey.pem    ## The default private key file name.
   default_md = sha256
   distinguished_name = req_dn
   req_extensions = v3_req
   
   [ v3_req ]
   subjectKeyIdentifier  = hash
   basicConstraints = CA:FALSE
   keyUsage = critical, digitalSignature, keyEncipherment
   nsComment = "OpenSSL Generated Certificate for TESTING only.  NOT FOR PRODUCTION USE."
   extendedKeyUsage  = serverAuth, clientAuth
   subjectAltName = @alt_names
   
   [ alt_names ]
   DNS.1 =         ##TODO: Enter the DNS names. The DNS names should match the server names.
   DNS.2 =         ##TODO: Enter the DNS names. The DNS names should match the server names.
   IP.1 =          ##TODO: Enter the IP address. SAN matching by IP address is available starting in MongoDB 4.2
   IP.2 =          ##TODO: Enter the IP address. SAN matching by IP address is available starting in MongoDB 4.2
   
   [ req_dn ]
   countryName = Country Name (2 letter code)
   countryName_default = TestServerCertificateCountry
   countryName_min = 2
   countryName_max = 2
   
   stateOrProvinceName = State or Province Name (full name)
   stateOrProvinceName_default = TestServerCertificateState
   stateOrProvinceName_max = 64
   
   localityName = Locality Name (eg, city)
   localityName_default = TestServerCertificateLocality
   localityName_max = 64
   
   organizationName = Organization Name (eg, company)
   organizationName_default = TestServerCertificateOrg
   organizationName_max = 64
   
   organizationalUnitName = Organizational Unit Name (eg, section)
   organizationalUnitName_default = TestServerCertificateOrgUnit
   organizationalUnitName_max = 64
   
   commonName = Common Name (eg, YOUR name)
   commonName_max = 64
   ```
   
2. In the `[alt_names]` section, enter the appropriate DNS names and/or IP addresses for the MongoDB server. You can specify multiple DNS names a MongoDB server.

2. 在该`[alt_names]`部分中，输入适合MongoDB服务器的DNS名称和/或IP地址。您可以为MongoDB服务器指定多个DNS名称。

   For OpenSSL SAN identifiers, MongoDB supports:

   对于OpenSSL SAN标识符，MongoDB支持：

   - DNS names and/or
   - IP address fields (Starting in MongoDB 4.2)
   
   - DNS名称和/或
   - IP地址字段（从MongoDB 4.2开始)

3. *Optional*. You can update the default Distinguished Name (DN) values.

3. *可选*。你可以更新默认的专有名称(DN)值

TIP

提示

  - Specify a non-empty value for at least one of the following attributes: Organization (`O`), the Organizational Unit (`OU`), or the Domain Component (`DC`).
  - 为至少一个下列属性指定一个非空值：组织 (`O`)、组织单元 (`OU`)或者域组件 (`DC`)

  - When creating **test** server certificates for internal membership authentication, the following attributes, if specified, must match exactly across the member certificates: Organization (`O`), Organizational Unit (`OU`), the Domain Component (`DC`).
  - 为内部成员身份验证创建**测试**服务器证书，如果指定了下面的属性，则在成员证书之间必须完全匹配：组织 (`O`)、组织单元 (`OU`)、域组件 (`DC`)。

  For more information on requirements for internal membership authentication, see [membership authentication](https://docs.mongodb.com/manual/core/security-internal-authentication/#internal-auth-x509).
  
  有关内部成员身份验证要求的更多信息，请查阅[成员身份验证](https://docs.mongodb.com/manual/core/security-internal-authentication/#internal-auth-x509)。

### B. Generate the Test PEM File for Server[¶](https://docs.mongodb.com/manual/appendix/security/appendixB-openssl-server/#b-generate-the-test-pem-file-for-server)
### B. 为服务器生成测试PEM文件[¶](https://docs.mongodb.com/manual/appendix/security/appendixB-openssl-server/#b-generate-the-test-pem-file-for-server)

IMPORTANT

重要

Before proceeding, ensure that you have entered the appropriate DNS names in the `[alt_names]` section of the configuration file `openssl-test-server.cnf`.

在继续之前，请确保在配置文件`openssl-test-server.cnf`中的`[alt_names]`部分输入了适当的DNS名称。

1. Create the **test** key file `mongodb-test-server1.key`.

1. 创建**测试**密钥文件`mongodb-test-server1.key`。

   ```
   openssl genrsa -out mongodb-test-server1.key 4096
   ```

2. Create the **test** certificate signing request `mongodb-test-server1.csr`.

2. 创建测试的证书签名请求`mongodb-test-server1.csr`。

   When asked for Distinguished Name values, enter the appropriate values for your test certificate:

   当要求提供专有名称值时，为您的测试证书输入适当的值：

   - Specify a non-empty value for at least one of the following attributes: Organization (`O`), the Organizational Unit (`OU`), or the Domain Component (`DC`).
   - When creating **test** server certificates for internal membership authentication, the following attributes, if specified, must match exactly across the member certificates: Organization (`O`), Organizational Unit (`OU`), the Domain Component (`DC`).

   - 为以下属性中的至少一个指定一个非空值：组织(`O`)、组织单位(`OU`)或域组件(`DC`)。
   - 为内部成员身份验证创建**测试**服务器证书时，如果指定了以下属性，则这些属性必须在成员证书之间完全匹配：组织(`O`)、组织单位(`OU`)、域组件(`DC`)。
   
   copy

   ```
   openssl req -new -key mongodb-test-server1.key -out mongodb-test-server1.csr -config openssl-test-server.cnf
   ```

3. Create the **test** server certificate `mongodb-test-server1.crt`.

3. 创建**测试**服务器证书`mongodb-test-server1.crt`。

   ```
   openssl x509 -sha256 -req -days 365 -in mongodb-test-server1.csr -CA mongodb-test-ia.crt -CAkey mongodb-test-ia.key -CAcreateserial -out mongodb-test-server1.crt -extfile openssl-test-server.cnf -extensions v3_req
   ```
   
4. Create the **test** PEM file for the server.

4. 为服务器创建**测试**PEM文件。
   
   ```
   cat mongodb-test-server1.crt mongodb-test-server1.key > test-server1.pem
   ```
   
   You can use the **test** PEM file when configuring a [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) or a [`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) for TLS/SSL **testing**. For example:
   
   你可以使用**test**PEM文件为TLS/SSL**测试**配置一个[`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod)或一个[`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos)。例如：

**For MongoDB 4.2 or greater**

**对于MongDB 4.2或更高版本**

```
mongod --tlsMode requireTLS --tlsCertificateKeyFile test-server1.pem  --tlsCAFile test-ca.pem
```

Although still available, [`--sslMode`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-sslmode), [`--sslPEMKeyFile`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-sslpemkeyfile), and [`--sslCAFile`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-sslcafile) are [deprecated as of MongoDB 4.2](https://docs.mongodb.com/manual/release-notes/4.2/#tls).

虽然仍然可以使用，但[`--sslMode`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-sslmode)、[`--sslPEMKeyFile`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-sslpemkeyfile)和[`--sslCAFile`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-sslcafile)在[MongoDB 4.2中已废弃](https://docs.mongodb.com/manual/release-notes/4.2/#tls)。

**For MongoDB 4.0 and earlier**

**对于MongoDB 4.0及更早的版本**

```
mongod --sslMode requireSSL --sslPEMKeyFile test-server1.pem  --sslCAFile test-ca.pem
```

###  On macOS

### 在macOS系统中

If you are **testing** with Keychain Access to manage certificates, create a PKCS 12 file to add to Keychain Access instead of a PEM file:

如果你使用Keychain Access管理证书，创建一个pkcs-12而不是PEM文件添加到Keychain Access中。

```
openssl pkcs12 -export -out test-client.pfx -inkey mongodb-test-client.key -in mongodb-test-client.crt -certfile mongodb-test-ia.crt
```
Once added to Keychain Access, instead of specifying the Certificate Key file, you can use the [`--tlsCertificateSelector`](https://docs.mongodb.com/manual/reference/program/mongo/#cmdoption-mongo-tlscertificateselector) to specify the certificate to use. If the CA file is also in Keychain Access, you can omit `--tlsCAFile` as well as in the following example:

将其添加到Keychain Access后，您无需指定证书密钥文件，就可以使用[`--tlsCertificateSelector`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-tlscertificateselector)来指定要使用的证书。如果CA文件也在Keychain Access中，也可省略`--tlsCAFile`。

**For MongoDB 4.2 or greater** 

**对于MongoDB 4.2或者更高版本** 

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

SEE ALSO

- [Appendix A - OpenSSL CA Certificate for Testing](https://docs.mongodb.com/manual/appendix/security/appendixA-openssl-ca/#appendix-ca-certificate)
- [Appendix C - OpenSSL Client Certificates for Testing](https://docs.mongodb.com/manual/appendix/security/appendixC-openssl-client/#appendix-client-certificate)
- [Member x.509 Certificate](https://docs.mongodb.com/manual/tutorial/configure-x509-member-authentication/#x509-member-certificate)

另请参阅

- [附录A - 用于测试的OpenSSL CA证书](https://docs.mongodb.com/manual/appendix/security/appendixA-openssl-ca/#appendix-ca-certificate)
- [附录C - 用于测试的OpenSSL客户端证书](https://docs.mongodb.com/manual/appendix/security/appendixC-openssl-client/#appendix-client-certificate)
- [成员的x.509证书](https://docs.mongodb.com/manual/tutorial/configure-x509-member-authentication/#x509-member-certificate)
