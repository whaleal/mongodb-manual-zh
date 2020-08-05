# Data Modeling Introduction 数据建模介绍

On this page 在本页中

- [Flexible Schema ](https://docs.mongodb.com/manual/core/data-modeling-introduction/#flexible-schema)
- [Document Structure](https://docs.mongodb.com/manual/core/data-modeling-introduction/#document-structure)
- [Atomicity of Write Operations](https://docs.mongodb.com/manual/core/data-modeling-introduction/#atomicity-of-write-operations)
- [Data Use and Performance](https://docs.mongodb.com/manual/core/data-modeling-introduction/#data-use-and-performance)
- [Further Reading](https://docs.mongodb.com/manual/core/data-modeling-introduction/#further-reading)
- [灵活的模式](https://docs.mongodb.com/manual/core/data-modeling-introduction/#flexible-schema)
- [文档结构](https://docs.mongodb.com/manual/core/data-modeling-introduction/#document-structure)
- [写操作原子性](https://docs.mongodb.com/manual/core/data-modeling-introduction/#atomicity-of-write-operations)
- [数据使用和性能](https://docs.mongodb.com/manual/core/data-modeling-introduction/#data-use-and-performance)
- [扩展阅读](https://docs.mongodb.com/manual/core/data-modeling-introduction/#further-reading)

The key challenge in data modeling is balancing the needs of the application, the performance characteristics of the database engine, and the data retrieval patterns. When designing data models, always consider the application usage of the data (i.e. queries, updates, and processing of the data) as well as the inherent structure of the data itself.

数据建模的关键挑战是平衡应用程序的需求、数据库引擎的性能特征和数据检索模式。在设计数据模型时，始终考虑数据的应用程序使用（即数据的查询、更新和处理）以及数据本身的固有结构。



## Flexible Schema 灵活的模式

Unlike SQL databases, where you must determine and declare a table’s schema before inserting data, MongoDB’s [collections](https://docs.mongodb.com/manual/reference/glossary/#term-collection), by default, does not require its [documents](https://docs.mongodb.com/manual/core/document/) to have the same schema. That is:

- The documents in a single collection do not need to have the same set of fields and the data type for a field can differ across documents within a collection.
- To change the structure of the documents in a collection, such as add new fields, remove existing fields, or change the field values to a new type, update the documents to the new structure.

This flexibility facilitates the mapping of documents to an entity or an object. Each document can match the data fields of the represented entity, even if the document has substantial variation from other documents in the collection.

In practice, however, the documents in a collection share a similar structure, and you can enforce [document validation rules](https://docs.mongodb.com/manual/core/schema-validation/) for a collection during update and insert operations. See [Schema Validation](https://docs.mongodb.com/manual/core/schema-validation/) for details.

与SQL数据库不同，在SQL数据库中，在插入数据之前必须确定并声明表的架构，MongoDB的 [集合](https://docs.mongodb.com/manual/reference/glossary/#term-collection)，默认情况下，集合不需要其[文档](https://docs.mongodb.com/manual/core/document/) 有相同的模式。即：

- 单个集合中的文档不需要具有相同的字段集，并且字段的数据类型可以在集合中的各个文档之间有所不同。
- 若要更改集合中文档的结构（如添加新字段、删除现有字段或将字段值更改为新类型），请将文档更新为新结构。

这种灵活性有助于将文档映射到实体或对象。每个文档都可以匹配所表示实体的数据字段，即使该文档与集合中的其他文档有很大的差异。

但实际上，集合中的文档共享类似的结构，您可以强制执行[文档验证规则](https://docs.mongodb.com/manual/core/schema-validation/)用于在更新和插入操作期间的集合。请参阅[模式验证](https://docs.mongodb.com/manual/core/schema-validation/)详细情况。



## Document Structure 文档结构

The key decision in designing data models for MongoDB applications revolves around the structure of documents and how the application represents relationships between data. MongoDB allows related data to be embedded within a single document.

为MongoDB应用程序设计数据模型的关键决策是围绕文档的结构以及应用程序如何表示数据之间的关系。MongoDB允许将相关数据嵌入到单个文档中。



### Embedded Data 嵌入数据方式

Embedded documents capture relationships between data by storing related data in a single document structure. MongoDB documents make it possible to embed document structures in a field or array within a document. These *denormalized* data models allow applications to retrieve and manipulate related data in a single database operation.

嵌入式文档通过在单个文档结构中存储相关数据来捕获数据之间的关系。MongoDB文档使得在文档中的字段或数组中嵌入文档结构成为可能。这些*非规范化*数据模型允许应用程序在单个数据库操作中检索和操作相关数据。

![Data model with embedded fields that contain all related information.](https://docs.mongodb.com/manual/_images/data-model-denormalized.bakedsvg.svg)

For many use cases in MongoDB, the denormalized data model is optimal.

See [Embedded Data Models](https://docs.mongodb.com/manual/core/data-model-design/#data-modeling-embedding) for the strengths and weaknesses of embedding documents.

对于MongoDB中的许多用例，非规范化数据模型是最优的。

参见[嵌入式数据模型](https://docs.mongodb.com/manual/core/data-model-design/#data-modeling-embedding)为嵌入文档的优点和缺点建模。



### References 引用数据方式

References store the relationships between data by including links or *references* from one document to another. Applications can resolve these [references](https://docs.mongodb.com/manual/reference/database-references/) to access the related data. Broadly, these are *normalized* data models.

引用通过包含从一个文档到另一个文档的链接或*引用*来存储数据之间的关系。应用程序可以解析这些[参考](https://docs.mongodb.com/manual/reference/database-references/)访问相关数据。一般来说，这些是“标准化”数据模型。

![Data model using references to link documents. Both the ``contact`` document and the ``access`` document contain a reference to the ``user`` document.](https://docs.mongodb.com/manual/_images/data-model-normalized.bakedsvg.svg)

See [Normalized Data Models](https://docs.mongodb.com/manual/core/data-model-design/#data-modeling-referencing) for the strengths and weaknesses of using references.

参见 [规范化数据模型](https://docs.mongodb.com/manual/core/data-model-design/#data-modeling-referencing) 了解使用参考的优点和缺点。



## Atomicity of Write Operations 写操作原子性

### Single Document Atomicity 单文档原子性

In MongoDB, a write operation is atomic on the level of a single document, even if the operation modifies multiple embedded documents *within* a single document.

A denormalized data model with embedded data combines all related data in a single document instead of normalizing across multiple documents and collections. This data model facilitates atomic operations.

When a single write operation (e.g. [`db.collection.updateMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#db.collection.updateMany)) modifies multiple documents, the modification of each document is atomic, but the operation as a whole is not atomic.

When performing multi-document write operations, whether through a single write operation or multiple write operations, other operations may interleave.

For situations that require atomicity of reads and writes to multiple documents (in a single or multiple collections), MongoDB supports multi-document transactions:

- **In version 4.0**, MongoDB supports multi-document transactions on replica sets.
- **In version 4.2**, MongoDB introduces distributed transactions, which adds support for multi-document transactions on sharded clusters and incorporates the existing support for multi-document transactions on replica sets.

For details regarding transactions in MongoDB, see the [Transactions](https://docs.mongodb.com/manual/core/transactions/) page.

在MongoDB中，写操作在单个文档的级别上是原子的，即使该操作修改了单个文档中的多个嵌入文档。



带有嵌入数据的非规范化数据模型将所有相关数据合并到单个文档中，而不是跨多个文档和集合进行规范化。这个数据模型有助于原子操作。



当一次写入操作（例如[`db.collection.updateMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/édb.collection.updateMany))修改多个文档，每个文档的修改是原子的，但整个操作不是原子的。



在执行多文档写入操作时，无论是通过单个写入操作还是通过多个写入操作，其他操作都可能交叉进行。



对于需要对多个文档（在单个或多个集合中）进行原子性读写的情况，MongoDB支持多文档事务：

- **在4.0版中**，MongoDB支持副本集上的多文档事务。
- **在4.2版中**，MongoDB引入了分布式事务，增加了对分片集群上多文档事务的支持，并结合了对副本集上多文档事务的现有支持。

有关MongoDB中事务的详细信息，请参阅[事务](https://docs.mongodb.com/manual/core/transactions/)章节。



### Multi-Document Transactions 多文档事务

For situations that require atomicity of reads and writes to multiple documents (in a single or multiple collections), MongoDB supports multi-document transactions:

- **In version 4.0**, MongoDB supports multi-document transactions on replica sets.
- **In version 4.2**, MongoDB introduces distributed transactions, which adds support for multi-document transactions on sharded clusters and incorporates the existing support for multi-document transactions on replica sets.

For details regarding transactions in MongoDB, see the [Transactions](https://docs.mongodb.com/manual/core/transactions/) page.

IMPORTANT

In most cases, multi-document transaction incurs a greater performance cost over single document writes, and the availability of multi-document transactions should not be a replacement for effective schema design. For many scenarios, the [denormalized data model (embedded documents and arrays)](https://docs.mongodb.com/manual/core/data-model-design/#data-modeling-embedding) will continue to be optimal for your data and use cases. That is, for many scenarios, modeling your data appropriately will minimize the need for multi-document transactions.

For additional transactions usage considerations (such as runtime limit and oplog size limit), see also [Production Considerations](https://docs.mongodb.com/manual/core/transactions-production-consideration/).

SEE ALSO

[Atomicity Considerations](https://docs.mongodb.com/manual/core/data-model-operations/#data-model-atomicity)

对于需要对多个文档（在单个或多个集合中）进行原子性读写的情况，MongoDB支持多文档事务：

- **在4.0版中**，MongoDB支持副本集上的多文档事务。
- **在4.2版中**，MongoDB引入了分布式事务，增加了对分片集群上多文档事务的支持，并结合了对副本集上多文档事务的现有支持。

有关MongoDB中事务的详细信息，请参阅[事务](https://docs.mongodb.com/manual/core/transactions/)章节。



> 注意事项:
>
> 在大多数情况下，多文档事务比单文档写入带来更高的性能成本，而且多文档事务的可用性不应替代有效的模式设计。对于许多情况，[非规范化数据模型（嵌入文档和数组）](https://docs.mongodb.com/manual/core/data-model-design/#data-modeling-embedding)将继续是数据和用例的最佳选择。也就是说，对于许多场景，对数据进行适当的建模将最大限度地减少对多文档事务的需求。
>
> 
>
> 有关其他事务使用注意事项（如运行时限制和oplog大小限制），另请参阅[生产注意事项](https://docs.mongodb.com/manual/core/transactions-production-consideration/).

另请参见:

[原子性注意事项](https://docs.mongodb.com/manual/core/data-model-operations/#data-model-atomicity)



## Data Use and Performance 数据使用和性能

When designing a data model, consider how applications will use your database. For instance, if your application only uses recently inserted documents, consider using [Capped Collections](https://docs.mongodb.com/manual/core/capped-collections/). Or if your application needs are mainly read operations to a collection, adding indexes to support common queries can improve performance.

See [Operational Factors and Data Models](https://docs.mongodb.com/manual/core/data-model-operations/) for more information on these and other operational considerations that affect data model designs.

设计数据模型时，请考虑应用程序将如何使用数据库。例如，如果您的应用程序只使用最近插入的文档，请考虑使用[Capped Collections](https://docs.mongodb.com/manual/core/capped-collections/). 或者，如果应用程序需要的主要是对集合的读取操作，则添加索引以支持常见查询可以提高性能。



见[操作因素和数据模型](https://docs.mongodb.com/manual/core/data-model-operations网站/)有关影响数据模型设计的这些和其他操作注意事项的详细信息。



## Further Reading 扩展阅读

For more information on data modeling with MongoDB, download the [MongoDB Application Modernization Guide](https://www.mongodb.com/modernize?tck=docs_server).

The download includes the following resources:

- Presentation on the methodology of data modeling with MongoDB
- White paper covering best practices and considerations for migrating to MongoDB from an [RDBMS](https://docs.mongodb.com/manual/reference/glossary/#term-rdbms) data model
- Reference MongoDB schema with its RDBMS equivalent
- Application Modernization scorecard

←  [Data Models](https://docs.mongodb.com/manual/data-modeling/)  [Schema Validation](https://docs.mongodb.com/manual/core/schema-validation/) →



有关MongoDB数据建模的更多信息，请下载[MongoDB应用程序现代化指南](https://www.mongodb.com/modernize?tck=docs_server)。

下载包括以下资源：

- 用MongoDB实现数据建模的方法论
- 白皮书涵盖了从[RDBMS](https://docs.mongodb.com/manual/reference/glossary/#term-rdbms)数据模型迁移到MongoDB的最佳实践和考虑事项
- 参考MongoDB模式及其等价的RDBMS概念
- 应用程序现代化记分卡

←  [数据模型](https://docs.mongodb.com/manual/data-modeling/)  [模式验证](https://docs.mongodb.com/manual/core/schema-validation/) →



原文链接：https://docs.mongodb.com/manual/core/data-modeling-introduction/

译者：张鹏
