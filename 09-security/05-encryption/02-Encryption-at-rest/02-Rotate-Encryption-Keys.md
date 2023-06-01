## 轮换加密密钥

大多数监管要求规定，用于解密敏感数据的托管密钥必须每年轮换一次并更换为新密钥。

>[NOTE]
>
>**消歧义**
>
>要在文件系统还原后滚动使用 AES256-GCM 密码配置的数据库密钥，请参阅[`--eseDatabaseKeyRollover`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--eseDatabaseKeyRollover)。

MongoDB 提供了两种密钥轮换选项。您可以使用使用新密钥的新实例轮换出二进制文件。或者，如果您使用 KMIP 服务器进行密钥管理，则可以轮换主密钥。

**旋转副本集成员**

>[NOTE]
>
>为防止更改写入仲裁，一次不要轮换一个以上的副本集成员。

对于副本集，要轮换出一个成员：

1. 启动一个新[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例，配置为使用新密钥。包括[`--replSet`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--replSet)带有副本集名称的选项以及特定于您的配置的任何其他选项，例如 [`--dbpath`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--dbpath)和[`--bind_ip`。](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip)

   ```shell
   mongod --replSet myReplSet --enableEncryption \
   --kmipServerName <KMIP Server HostName> \
   --kmipServerCAFile ca.pem --kmipClientCertificateFile client.pem
   ```

2. 连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到副本集的主要。

3. 将实例添加到副本集：

   ```shell
   rs.add( { host: <host:port> } )
   ```

   >[WARNING]
   >
   >在 MongoDB 5.0 之前，新添加的辅助节点仍然算作投票成员，即使它在其数据一致之前既不能提供读取也不能成为主要成员。如果您运行的是早于 5.0 的 MongoDB 版本并添加一个其[`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes) 和[`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)设置大于零的辅助节点，这可能会导致大多数投票成员在线但无法选举主要节点的情况。为避免这种情况，请考虑最初使用 [`priority :0`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)和添加新的辅助[`votes :0`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)。然后，运行[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)以确保成员已转换为[`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY)状态。最后，用于 [`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)更新其优先级和选票。

   在初始同步过程中，会使用一组全新的数据库密钥和一个新的系统密钥对数据进行重新加密。

4. 从副本集中移除旧节点并删除其所有数据。有关说明，请参阅[从副本集中删除成员](https://www.mongodb.com/docs/manual/tutorial/remove-replica-set-member/)

**KMIP 主密钥轮换**

如果您使用 KMIP 服务器进行密钥管理，则可以轮换主密钥，这是唯一的外部管理密钥。使用新的主密钥，内部密钥库将被重新加密，但数据库密钥将保持不变。这避免了重新加密整个数据集的需要。

1. [一次轮换副本集次要](https://www.mongodb.com/docs/manual/core/replica-set-members/#std-label-replica-set-secondary-members)成员的主密钥。

   1. 重新启动辅助，包括该 [`--kmipRotateMasterKey`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipRotateMasterKey)选项。包括特定于您的配置的任何其他选项，例如[`--bind_ip`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--bind_ip). 如果成员已经包含该选项，则使用要使用的新密钥[`--kmipKeyIdentifier`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipKeyIdentifier) 更新该选项，或者忽略从 KMIP 服务器请求新密钥：[`--kmipKeyIdentifier`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipKeyIdentifier)

      ```shell
      mongod --enableEncryption --kmipRotateMasterKey \
        --kmipServerName <KMIP Server HostName> \
        --kmipServerCAFile ca.pem --kmipClientCertificateFile client.pem
      ```

      如果使用配置文件，请包含 [`security.kmip.rotateMasterKey`.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.kmip.rotateMasterKey)

   2. 成功完成主密钥轮换和数据库密钥库的重新加密后，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 将退出。

   3. [`--kmipRotateMasterKey`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipRotateMasterKey) 在没有参数的情况下重新启动辅助。包括特定于您的配置的任何其他选项，例如`--bind_ip`.

      ```shell
      mongod --enableEncryption --kmipServerName <KMIP Server HostName> \
        --kmipServerCAFile ca.pem --kmipClientCertificateFile client.pem
      ```

      如果使用配置文件，请删除 [`security.kmip.rotateMasterKey`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.kmip.rotateMasterKey)设置。

2. 降级副本集主要。

   连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到主要并用于 [`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)降低主要并强制选举新的主要：

   ```shell
   rs.stepDown()
   ```

3. 当[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status) 显示主要成员已下台并且另一个成员已`PRIMARY`进入状态时，轮换已下台成员的主密钥：

   1. 重启降压成员，包括 [`--kmipRotateMasterKey`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipRotateMasterKey)选项。包括特定于您的配置的任何其他选项，例如`--bind_ip`. 如果成员已包含该选项，则使用要使用的新密钥[`--kmipKeyIdentifier`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipKeyIdentifier)更新该选项或忽略。[`--kmipKeyIdentifier`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipKeyIdentifier)

      ```shell
      mongod --enableEncryption --kmipRotateMasterKey \
        --kmipServerName <KMIP Server HostName> \
        --kmipServerCAFile ca.pem --kmipClientCertificateFile client.pem
      ```

      如果使用配置文件，请包含 [`security.kmip.rotateMasterKey`.](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.kmip.rotateMasterKey)

   2. 成功完成主密钥轮换和数据库密钥库的重新加密后，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 将退出。

   3. [`--kmipRotateMasterKey`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--kmipRotateMasterKey)重启没有选项的降级成员 。包括特定于您的配置的任何其他选项，例如`--bind_ip`.

      ```shell
      mongod --enableEncryption --kmipServerName <KMIP Server HostName> \
        --kmipServerCAFile ca.pem --kmipClientCertificateFile client.pem
      ```

      如果使用配置文件，请删除 [`security.kmip.rotateMasterKey`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.kmip.rotateMasterKey)设置。

 参见

原文 - [Rotate Encryption Keys]( https://docs.mongodb.com/manual/tutorial/rotate-encryption-key/ )

译者：景圣