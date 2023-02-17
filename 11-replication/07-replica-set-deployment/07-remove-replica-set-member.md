# 从副本集中删除节点

[要删除副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)的节点，请使用以下任一过程。

## 使用删除节点rs.remove()[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/remove-replica-set-member/#remove-a-member-using-rs.remove--)

1. 关闭[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)要删除的成员的实例。要关闭实例，请使用 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)并使用[`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法。

2. 连接到副本集的当前[primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)。要确定当前主节点，[`db.hello()`](https://www.mongodb.com/docs/manual/reference/method/db.hello/#mongodb-method-db.hello)请在连接到副本集的任何成员时使用。

3. 使用[`rs.remove()`](https://www.mongodb.com/docs/manual/reference/method/rs.remove/#mongodb-method-rs.remove)以下任一形式删除成员：

   ```
   rs.remove("mongod3.example.net:27017")
   rs.remove("mongod3.example.net")
   ```

   

   如果副本集需要选择一个新的主节点，MongoDB 可能会短暂地断开 shell。在这种情况下，shell 会自动重新连接。`DBClientCursor::init call() failed`即使命令成功，shell 也可能会显示错误。



## 使用删除成员`rs.reconfig()`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/remove-replica-set-member/#remove-a-member-using-rs.reconfig--)

您可以通过使用从阵列中删除该节点的[副本配置文档重新配置副本集来删除该节点。](https://www.mongodb.com/docs/manual/reference/replica-configuration/)[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)

从 MongoDB 4.4 开始，一次[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)只允许添加或删除`1` [`voting`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)节点。要从副本集中删除多个投票节点，请发出一系列[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)操作以一次删除一个节点。有关详细信息，请参阅[重新配置一次最多只能添加或删除一个投票节点](https://www.mongodb.com/docs/manual/reference/command/replSetReconfig/#std-label-replSetReconfig-cmd-single-node)。

### 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/remove-replica-set-member/#procedure)

1. 要删除的节点。要关闭[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例，请使用 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)并使用[`db.shutdownServer()`](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer) 方法。

2. 连接到副本集的当前[primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)。要确定当前主节点，[`db.hello()`](https://www.mongodb.com/docs/manual/reference/method/db.hello/#mongodb-method-db.hello)请在连接到副本集的任何节点时使用。

3. 发出[`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)查看当前配置文档的方法并确定 `members`要删除的节点在数组中的位置：

   

   ## 例子

   `mongod_C.example.net`位于`2`以下配置文件的位置：

   ```
   {
       "_id" : "rs",
       "version" : 7,
       "members" : [
           {
               "_id" : 0,
               "host" : "mongod_A.example.net:27017"
           },
           {
               "_id" : 1,
               "host" : "mongod_B.example.net:27017"
           },
           {
               "_id" : 2,
               "host" : "mongod_C.example.net:27017"
           }
       ]
   }
   ```

   

4. 将当前配置文件赋值给变量`cfg`：

   ```
   cfg = rs.conf()
   ```

   

5. 修改`cfg`对象以移除成员。

   

   ## 例子

   要删除`mongod_C.example.net:27017`，请使用以下 JavaScript 操作：

   ```
   cfg.members.splice(2,1)
   ```

   

6. 通过发出以下命令，用新配置覆盖副本集配置文档：

   ```
   rs.reconfig(cfg)
   ```

   

7. 要确认新配置，请发出[`rs.conf()`.](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)

   对于上面的示例，输出将是：

   ```
   {
       "_id" : "rs",
       "version" : 8,
       "members" : [
           {
               "_id" : 0,
               "host" : "mongod_A.example.net:27017"
           },
           {
               "_id" : 1,
               "host" : "mongod_B.example.net:27017"
           }
       ]
   }
   ```

   

←  [将成员添加到副本集](https://www.mongodb.com/docs/manual/tutorial/expand-replica-set/)[替换副本集节点](https://www.mongodb.com/docs/manual/tutorial/replace-replica-set-member/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/remove-replica-set-member/

译者：陆文龙

