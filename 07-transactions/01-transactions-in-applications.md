# 驱动API

## 回调 API 与核心 API

[回调接口：](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-txn-callback-api)

- 启动一个事务，执行指定的操作，并提交（或出错时中止）。
- 自动合并错误处理逻辑 [`"TransientTransactionError"`](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-transient-transaction-error)和 [`"UnknownTransactionCommitResult"`.](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-unknown-transaction-commit-result)

[核心API ：](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-txn-core-api)

- 需要显式调用以启动事务并提交事务。
- 不包含错误处理逻辑 [`"TransientTransactionError"`](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-transient-transaction-error)和 [`"UnknownTransactionCommitResult"`](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-unknown-transaction-commit-result)，而是提供了为这些错误合并自定义错误处理的灵活性。



## 回调接口

回调 API 包含以下逻辑：

- 如果事务遇到 [`"TransientTransactionError"`.](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-transient-transaction-error)
- 如果提交遇到 [`"UnknownTransactionCommitResult"`.](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-unknown-transaction-commit-result)



## IMPORTANT

- *推荐*。使用针对您的 MongoDB 部署版本更新的 MongoDB 驱动程序。对于 MongoDB 4.2 部署（副本集和分片集群）上的事务，客户端 **必须**使用针对 MongoDB 4.2 更新的 MongoDB 驱动程序。
- 使用驱动程序时，事务中的每个操作都**必须**与会话相关联（即，将会话传递给每个操作）。
- 事务中的操作使用[事务级读关注](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions-read-concern)、[事务级写关注](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions-write-concern)和 [事务级读偏好。](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions-read-preference)
- 在 MongoDB 4.2 及更早版本中，您无法在事务中创建集合。如果在事务内运行，导致文档插入的写操作（例如`insert`或更新操作`upsert: true`）必须在**现有**集合上。
- 从 MongoDB 4.4 开始，您可以隐式或显式地在事务中创建集合。请参阅 [在事务中创建集合和索引。](https://www.mongodb.com/docs/manual/core/transactions/#std-label-transactions-create-collections-indexes)

该示例使用新的回调 API 来处理事务，它启动事务、执行指定的操作并提交（或出错时中止）。新的回调 API 合并了重试逻辑 [`"TransientTransactionError"`](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-transient-transaction-error)或者 [`"UnknownTransactionCommitResult"`](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-unknown-transaction-commit-result)报错。

```java
/*
For a replica set, include the replica set name and a seedlist of the members in the URI string; e.g.
String uri = "mongodb://mongodb0.example.com:27017,mongodb1.example.com:27017/admin?replicaSet=myRepl";
For a sharded cluster, connect to the mongos instances; e.g.
String uri = "mongodb://mongos0.example.com:27017,mongos1.example.com:27017:27017/admin";
*/

final MongoClient client = MongoClients.create(uri);

/*
   Create collections.
*/

client.getDatabase("mydb1").getCollection("foo")
      .withWriteConcern(WriteConcern.MAJORITY).insertOne( new Document("abc", 0));
client.getDatabase("mydb2").getCollection("bar")
      .withWriteConcern(WriteConcern.MAJORITY).insertOne( new Document("xyz", 0));

/* Step 1: Start a client session. */

final ClientSession clientSession = client.startSession();

/* Step 2: Optional. Define options to use for the transaction. */

TransactionOptions txnOptions = TransactionOptions.builder()
      .readPreference(ReadPreference.primary())
      .readConcern(ReadConcern.LOCAL)
      .writeConcern(WriteConcern.MAJORITY)
      .build();

/* Step 3: Define the sequence of operations to perform inside the transactions. */

TransactionBody txnBody = new TransactionBody<String>() {
   public String execute() {
      MongoCollection<Document> coll1 = client.getDatabase("mydb1").getCollection("foo");
      MongoCollection<Document> coll2 = client.getDatabase("mydb2").getCollection("bar");

      /*
         Important:: You must pass the session to the operations..
         */

      coll1.insertOne(clientSession, new Document("abc", 1));
      coll2.insertOne(clientSession, new Document("xyz", 999));

      return "Inserted into collections in different databases";
   }
};
try {
   /*
      Step 4: Use .withTransaction() to start a transaction,
      execute the callback, and commit (or abort on error).
   */

   clientSession.withTransaction(txnBody, txnOptions);
} catch (RuntimeException e) {
   // some error handling
} finally {
   clientSession.close();
}
```



## 核心接口

核心事务 API 不包含针对标记为以下错误的重试逻辑：

- [`"TransientTransactionError"`](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-transient-transaction-error). 如果事务中的操作返回标记为错误[`"TransientTransactionError"`](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-transient-transaction-error), 交易作为一个整体可以被重试。

  处理[`"TransientTransactionError"`](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-transient-transaction-error)，应用程序应明确包含错误的重试逻辑。

- [`"UnknownTransactionCommitResult"`](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-unknown-transaction-commit-result). 如果提交返回标记为错误[`"UnknownTransactionCommitResult"`](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-unknown-transaction-commit-result)，可以重试提交。

  处理[`"UnknownTransactionCommitResult"`](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-unknown-transaction-commit-result)，应用程序应明确包含错误的重试逻辑。



------

以下示例合并了逻辑以重试暂时性错误的事务并重试未知提交错误的提交：

```java
void runTransactionWithRetry(Runnable transactional) {
    while (true) {
        try {
            transactional.run();
            break;
        } catch (MongoException e) {
            System.out.println("Transaction aborted. Caught exception during transaction.");

            if (e.hasErrorLabel(MongoException.TRANSIENT_TRANSACTION_ERROR_LABEL)) {
                System.out.println("TransientTransactionError, aborting transaction and retrying ...");
                continue;
            } else {
                throw e;
            }
        }
    }
}

void commitWithRetry(ClientSession clientSession) {
    while (true) {
        try {
            clientSession.commitTransaction();
            System.out.println("Transaction committed");
            break;
        } catch (MongoException e) {
            // can retry commit
            if (e.hasErrorLabel(MongoException.UNKNOWN_TRANSACTION_COMMIT_RESULT_LABEL)) {
                System.out.println("UnknownTransactionCommitResult, retrying commit operation ...");
                continue;
            } else {
                System.out.println("Exception during commit ...");
                throw e;
            }
        }
    }
}

void updateEmployeeInfo() {

    MongoCollection<Document> employeesCollection = client.getDatabase("hr").getCollection("employees");
    MongoCollection<Document> eventsCollection = client.getDatabase("reporting").getCollection("events");

    TransactionOptions txnOptions = TransactionOptions.builder()
            .readPreference(ReadPreference.primary())
            .readConcern(ReadConcern.MAJORITY)
            .writeConcern(WriteConcern.MAJORITY)
            .build();

    try (ClientSession clientSession = client.startSession()) {
        clientSession.startTransaction(txnOptions);

        employeesCollection.updateOne(clientSession,
                Filters.eq("employee", 3),
                Updates.set("status", "Inactive"));
        eventsCollection.insertOne(clientSession,
                new Document("employee", 3).append("status", new Document("new", "Inactive").append("old", "Active")));

        commitWithRetry(clientSession);
    }
}


void updateEmployeeInfoWithRetry() {
    runTransactionWithRetry(this::updateEmployeeInfo);
}
```





## 驱动程序版本

*对于 MongoDB 4.2 部署（副本集和分片集群）上的事务*，客户端**必须**使用为 MongoDB 4.2 更新的 MongoDB 驱动程序：

| [C 1.15.0](http://mongoc.org/libmongoc/)    [C# 2.9.0](https://mongodb.github.io/mongo-csharp-driver/)  [Go 1.1](https://godoc.org/go.mongodb.org/mongo-driver/mongo) | [Java 3.11.0](https://mongodb.github.io/mongo-java-driver/)   [Node 3.3.0](https://mongodb.github.io/node-mongodb-native/)   [Perl 2.2.0](https://metacpan.org/author/MONGODB) | [Python 3.9.0](https://api.mongodb.com/pymongo)   [Ruby 2.10.0](https://www.mongodb.com/docs/ruby-driver/current/)   [Scala 2.7.0](https://mongodb.github.io/mongo-scala-driver/) |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |                                                              |

## Transaction Error Handling

无论是什么数据库系统，无论是MongoDB还是关系型数据库，应用程序都应该采取措施处理事务提交时的错误，并为事务加入重试逻辑。



### `"TransientTransactionError"`

事务内的*单个*[`retryWrites`](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.retryWrites)写操作不可重试，无论 的值如何。如果操作遇到错误[与标签相关联](https://github.com/mongodb/specifications/blob/master/source/transactions/transactions.rst#error-labels) `"TransientTransactionError"`，例如当主节点停止时，可以重试整个事务。

- 回调 API 合并了重试逻辑 `"TransientTransactionError"`。
- 核心事务 API 不包含`"TransientTransactionError"`. 要处理 `"TransientTransactionError"`，应用程序应明确包含错误的重试逻辑。



### `"UnknownTransactionCommitResult"`

提交操作是可[重试的写操作](https://www.mongodb.com/docs/manual/core/retryable-writes/)。如果提交操作遇到错误，MongoDB 驱动程序会重试提交，而不管 [`retryWrites`.](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.retryWrites)

如果提交操作遇到标记为 的错误 `"UnknownTransactionCommitResult"`，则可以重试提交。

- 回调 API 合并了重试逻辑 `"UnknownTransactionCommitResult"`。
- 核心事务 API 不包含 `"UnknownTransactionCommitResult"`. 要处理 `"UnknownTransactionCommitResult"`，应用程序应明确包含错误的重试逻辑。

### 驱动程序版本错误

在具有多个实例的分片集群上[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)，使用为 MongoDB 4.0（而不是 MongoDB 4.2）更新的驱动程序执行事务将失败并可能导致错误，包括：



## NOTE

您的驱动程序可能会返回不同的错误。有关详细信息，请参阅驱动程序的文档。

| 错误代码 | 错误信息                                                |
| :------- | :------------------------------------------------------ |
| 251      | `cannot continue txnId -1 for session ... with txnId 1` |
| 50940    | `cannot commit with no participants`                    |

*对于 MongoDB 4.2 部署（副本集和分片集群）上的事务*，请使用为 MongoDB 4.2 更新的 MongoDB 驱动程序

## 附加信息



### `mongosh`例子

下列[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)事务可用的方法：

- [`Session.startTransaction()`](https://www.mongodb.com/docs/manual/reference/method/Session.startTransaction/#mongodb-method-Session.startTransaction)
- [`Session.commitTransaction()`](https://www.mongodb.com/docs/manual/reference/method/Session.commitTransaction/#mongodb-method-Session.commitTransaction)
- [`Session.abortTransaction()`](https://www.mongodb.com/docs/manual/reference/method/Session.abortTransaction/#mongodb-method-Session.abortTransaction)



## 

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)为简单起见，示例省略了重试逻辑和强大的错误处理。有关在应用程序中合并事务的更实际示例，请参阅[	事务错误处理](https://www.mongodb.com/docs/manual/core/transactions-in-applications/#std-label-transactions-retry)反而。

```java
// Create collections:
db.getSiblingDB("mydb1").foo.insertOne(
    {abc: 0},
    { writeConcern: { w: "majority", wtimeout: 2000 } }
)
db.getSiblingDB("mydb2").bar.insertOne(
   {xyz: 0},
   { writeConcern: { w: "majority", wtimeout: 2000 } }
)
// Start a session.
session = db.getMongo().startSession( { readPreference: { mode: "primary" } } );
coll1 = session.getDatabase("mydb1").foo;
coll2 = session.getDatabase("mydb2").bar;
// Start a transaction
session.startTransaction( { readConcern: { level: "local" }, writeConcern: { w: "majority" } } );
// Operations inside the transaction
try {
   coll1.insertOne( { abc: 1 } );
   coll2.insertOne( { xyz: 999 } );
} catch (error) {
   // Abort transaction on error
   session.abortTransaction();
   throw error;
}
// Commit the transaction using write concern set at transaction start
session.commitTransaction();
session.endSession();
```

←  [交易](https://www.mongodb.com/docs/manual/core/transactions/)[生产注意事项](https://www.mongodb.com/docs/manual/core/transactions-production-consideration/)

原文链接 - https://www.mongodb.com/docs/manual/core/transactions-in-applications/

译者：陆文龙
