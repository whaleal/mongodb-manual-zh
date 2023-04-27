# 客户端字段级加密

在使用[MongoDB Enterprise](http://www.mongodb.com/products/mongodb-enterprise-advanced?jmp=docs)或MongoDB Atlas集群时，可以使用`mongosh`配置客户端字段级加密并使用加密支持进行连接。客户端字段级加密使用数据加密密钥来支持字段值的加密和解密，并将该加密密钥材料存储在密钥管理服务（KMS）中。



mongosh支持以下KMS提供程序与客户端字段级加密一起使用：

* Amazon Web Services KMS
* Azure Key Vault
* Google Cloud Platform KMS
* Locally Managed Keyfile

#### 创建数据加密密钥

以下过程使用mongosh创建数据加密密钥，以用于客户端字段级加密和解密。

使用下面的选项卡选择适合您的部署的KMS：

**Amazon Web Services KMS :**

1. **启动`mongosh` Shell** 

   使用--nodb选项创建一个mongosh会话，但不连接到正在运行的数据库：

   ```
   mongosh --nodb
   ```

2. **创建加密配置**

   为AWS KMS配置客户端字段级加密需要AWS访问密钥ID及其关联的秘密访问密钥。AWS访问密钥必须对应于对KMS服务具有所有列表和读取权限的IAM用户。

   在mongosh中，创建一个新的[AutoEncryptionOpts](https://www.mongodb.com/docs/manual/reference/method/Mongo/#std-label-autoEncryptionOpts)变量，用于存储客户端字段级加密配置，其中包含以下凭据：

   ```shell
   var autoEncryptionOpts = {
     "keyVaultNamespace" : "encryption.__dataKeys",
     "kmsProviders" : {
       "aws" : {
         "accessKeyId" : "YOUR_AWS_ACCESS_KEY_ID",
         "secretAccessKey" : "YOUR_AWS_SECRET_ACCESS_KEY"
       }
     }
   }
   ```

   根据需要填写`YOUR_AWS_ACCESS_KEY_ID`和`YOUR_AWS_SECRET_ACCESS_KEY`的值。

3. **联系加密支持**

   在mongosh中，使用[Mongo（）](https://www.mongodb.com/docs/manual/reference/method/Mongo/#mongodb-method-Mongo)构造函数建立到目标集群的数据库连接。将[AutoEncryptionOpts](https://www.mongodb.com/docs/manual/reference/method/Mongo/#std-label-autoEncryptionOpts)文档指定为[Mongo（）](https://www.mongodb.com/docs/manual/reference/method/Mongo/#mongodb-method-Mongo)构造函数的第二个参数，以配置客户端字段级加密的连接：

   ```bash
   csfleDatabaseConnection = Mongo(
     "mongodb://replaceMe.example.net:27017/?replicaSet=myMongoCluster",
     autoEncryptionOpts
   )
   ```

   将`replaceMe.example.net`[URI](https://www.mongodb.com/docs/manual/reference/connection-string/#std-label-mongodb-uri)替换为目标群集的连接字符串。

4. **创建密钥存储库对象**

   使用[getKeyVault（）](https://www.mongodb.com/docs/manual/reference/method/getKeyVault/#mongodb-method-getKeyVault)shell方法创建`keyVault`对象：

   ```bash
   keyVault = csfleDatabaseConnection.getKeyVault();
   ```

5. **创建加密密钥**

   使用[createKey（）](https://www.mongodb.com/docs/manual/reference/method/KeyVault.createKey/#mongodb-method-KeyVault.createKey)shell方法创建数据加密密钥：

   ```bash
   keyVault.createKey(
     "aws",
     { region: "regionname", key: "awsarn" },
     [ "keyAlternateName" ]
   )
   ```

   其中：

   * 第一个参数必须为“aws”以指定配置的Amazon Web Services KMS。
   * 第二个参数必须是包含以下内容的文档：
     * 要连接到的AWS地区，例如us-west-2
     * [Amazon资源名称（ARN）](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html)AWS客户主密钥（CMK）。
   * 第三参数可以是用于数据加密密钥的一个或多个keyAltName的数组。每个密钥备用名称必须唯一。[getKeyVault（）](https://www.mongodb.com/docs/manual/reference/method/getKeyVault/#mongodb-method-getKeyVault)在keyAltNames上创建一个[唯一索引](https://www.mongodb.com/docs/manual/core/index-unique/#std-label-index-type-unique)，以便在字段不存在时强制字段的唯一性。密钥备用名称有助于数据加密密钥的查找。

如果成功，[createKey（）](https://www.mongodb.com/docs/manual/reference/method/KeyVault.createKey/#mongodb-method-KeyVault.createKey)将返回新数据加密密钥的UUID。要从密钥库检索新的数据加密密钥文档，请执行以下操作之一：

* 使用[getKey（）](https://www.mongodb.com/docs/manual/reference/method/KeyVault.getKey/#mongodb-method-KeyVault.getKey)按UUID检索创建的密钥，或者
* 使用[getKeyByAltName（）](https://www.mongodb.com/docs/manual/reference/method/KeyVault.getKeyByAltName/#mongodb-method-KeyVault.getKeyByAltName)按密钥的备用名称（如果指定）检索密钥。

> 另见：
>
> * [字段级加密shell方法列表](https://www.mongodb.com/docs/mongodb-shell/reference/methods/#std-label-fle-methods-mongosh)
> * [客户端字段级加密参考](https://www.mongodb.com/docs/manual/core/security-client-side-encryption/)









翻译：韩鹏帅

原文：[Run Aggregation Pipelines](https://www.mongodb.com/docs/mongodb-shell/run-agg-pipelines/)