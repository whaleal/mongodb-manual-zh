# 将从节点转换为仲裁节点

如果[副本集中](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)的[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)不再需要保存数据但需要保留在集合中以确保该集合可以[选择主节点](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)，则可以使用本教程中的任一过程将辅从节点转换为[仲裁节点。](https://www.mongodb.com/docs/manual/core/replica-set-members/#std-label-replica-set-arbiters)这两个过程在操作上是等效的：

- 您可以在与前次级相同的端口上操作仲裁器。在此过程中，您必须在重新启动并将其重新配置为仲裁器之前关闭从节点并删除其数据。

  有关此过程，请参阅[将从节点转换为仲裁节点并重新使用端口号。](https://www.mongodb.com/docs/manual/tutorial/convert-secondary-into-arbiter/#std-label-replica-set-convert-secondary-to-arbiter-same-port)

- 在新端口上运行仲裁程序。在此过程中，您可以在关闭作为从节点实例运行的实例之前将服务器重新配置为仲裁器。

  有关此过程，请参阅[将 Secondary 转换为在新端口号上运行的 Arbiter 。](https://www.mongodb.com/docs/manual/tutorial/convert-secondary-into-arbiter/#std-label-replica-set-convert-secondary-to-arbiter)

>## NOTE
>
>对于以下 MongoDB 版本，与具有仲裁器的副本集相比 （MongoDB 4.0+ 不再支持）`pv1`增加了回滚的可能性：[`w:1`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)`pv0`
>
>- MongoDB 3.4.1
>- MongoDB 3.4.0
>- MongoDB 3.2.11 或更早版本
>
>请参阅[副本集协议版本。](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/)





## 将从节点转换为仲裁节点并重新使用端口号

1. 如果您的应用程序直接连接到从节点，请修改应用程序，使 MongoDB 查询不会到达从节点。

2. 关闭从节点。

3. 通过调用该方法从[副本集中](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)删除[从节点。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)在连接到当前 [主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)时执行此操作[`rs.remove()`](https://www.mongodb.com/docs/manual/reference/method/rs.remove/#mongodb-method-rs.remove)[`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

   ```
   rs.remove("<hostname><:port>")
   ```

   

4. [`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)通过调用中的方法验证副本集不再包含辅助副本[`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

   ```
   rs.conf()
   ```

   

5. 将辅助数据目录移动到存档文件夹。例如：

   ```
   mv /data/db /data/db-old
   ```

   

   >## NOTE
   >
   >您可以改为删除数据。
   
   

6. [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)创建一个新的空数据目录以在重新启动实例时指向该目录 。您可以重复使用以前的名称。例如：

   ```
   mkdir /data/db
   ```

   

7. 重新启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)从节点实例，指定端口号、空数据目录和副本集。您可以使用之前使用的相同端口号。发出类似于以下的命令：

   >## WARNING
   >
   >在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

   

   ```
   mongod --port 27021 --dbpath /data/db --replSet rs  --bind_ip localhost,<hostname(s)|ip address(es)>
   ```

   

8. 在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)使用以下方法将辅助设备转换为仲裁设备[`rs.addArb()`](https://www.mongodb.com/docs/manual/reference/method/rs.addArb/#mongodb-method-rs.addArb)：

   ```
   rs.addArb("<hostname><:port>")
   ```

   

9. [`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)通过调用方法验证仲裁器是否属于副本集 [`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

   ```
   rs.conf()
   ```

   

   仲裁员应包括以下内容：

   ```
   "arbiterOnly" : true
   ```

   



## 将从节点转换为在新端口号上运行的仲裁节点

1. 如果您的应用程序直接连接到从节点或具有引用从节点的连接字符串，请修改应用程序，以便 MongoDB 查询不会到达从节点。

2. 创建一个新的空数据目录以用于新的端口号。例如：

   ```
   mkdir /data/db-temp
   ```

   

3. 在新端口号上启动一个新[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例，指定新数据目录和现有副本集。发出类似于以下的命令：

   >## WARNING
   >
   >在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

   

   ```
   mongod --port 27021 --dbpath /data/db-temp --replSet rs --bind_ip localhost,<hostname(s)|ip address(es)>
   ```

   

4. 在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到当前[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)主节点实例，使用以下方法将新实例转换为仲裁器[`rs.addArb()`](https://www.mongodb.com/docs/manual/reference/method/rs.addArb/#mongodb-method-rs.addArb) ：

   ```
   rs.addArb("<hostname><:port>")
   ```

   

5. [`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)通过调用中的方法验证仲裁器是否已添加到副本集 [`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

   ```
   rs.conf()
   ```

   

   仲裁员应包括以下内容：

   ```
   "arbiterOnly" : true
   ```

   

6. 关闭从节点。

7. 通过调用方法从[副本集中](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)删除[辅助](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)[`rs.remove()`](https://www.mongodb.com/docs/manual/reference/method/rs.remove/#mongodb-method-rs.remove)[`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

   ```
   rs.remove("<hostname><:port>")
   ```

   

8. [`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)通过调用方法验证副本集不再包含旧的辅助[`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

   ```
   rs.conf()
   ```

   

9. 将从节点数据目录移动到存档文件夹。例如：

   ```
   mv /data/db /data/db-old
   ```

   

   >## NOTE
   >
   >您可以改为删除数据。
   
   

←  [配置非投票副本集成员](https://www.mongodb.com/docs/manual/tutorial/configure-a-non-voting-replica-set-member/)[副本集维护教程](https://www.mongodb.com/docs/manual/administration/replica-set-maintenance/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/convert-secondary-into-arbiter/

译者：陆文龙

