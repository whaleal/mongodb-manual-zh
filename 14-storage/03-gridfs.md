# 网格文件系统

[GridFS](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-GridFS)是一种用于存储和检索超过[BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON)文档[大小限制](https://www.mongodb.com/docs/manual/reference/limits/#std-label-limit-bson-document-size)16 MB 的文件的规范。



## NOTE

GridFS 不支持[多文档事务。](https://www.mongodb.com/docs/manual/core/transactions/)

GridFS 不是将文件存储在单个文档中，而是将文件分成多个部分或块[[ 1 \]](https://www.mongodb.com/docs/manual/core/gridfs/#footnote-chunk-disambiguation)，并将每个块存储为一个单独的文档。默认情况下，GridFS 使用 255 kB 的默认块大小；也就是说，GridFS 将文件分成 255 kB 的块，最后一个块除外。最后一个块只有必要的大小。同样，不大于块大小的文件只有一个最终块，只使用所需的空间和一些额外的元数据。

GridFS 使用两个集合来存储文件。一个集合存储文件块，另一个存储文件元数据。这部分 [GridFS 集合](https://www.mongodb.com/docs/manual/core/gridfs/#std-label-gridfs-collections)详细描述每个集合。

当您向 GridFS 查询文件时，驱动程序将根据需要重新组合这些块。您可以对通过 GridFS 存储的文件执行范围查询。您还可以从文件的任意部分访问信息，例如“跳”到视频或音频文件的中间。

GridFS 不仅可用于存储超过 16 MB 的文件，而且可用于存储您想要访问的任何文件，而无需将整个文件加载到内存中。也可以看看 [何时使用 GridFS 。](https://www.mongodb.com/docs/manual/core/gridfs/#std-label-faq-developers-when-to-use-gridfs)



## 何时使用 GridFS

在 MongoDB 中，使用[GridFS](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-GridFS)存储大于 16 MB 的文件。

在某些情况下，在 MongoDB 数据库中存储大文件可能比在系统级文件系统中更有效。

- 如果您的文件系统限制目录中的文件数量，您可以使用 GridFS 来存储所需数量的文件。
- 当您想要从大文件的某些部分访问信息而不必将整个文件加载到内存中时，您可以使用 GridFS 来调用文件的各个部分，而无需将整个文件读入内存。
- 当您希望跨多个系统和设施自动同步和部署文件和元数据时，您可以使用 GridFS。当使用[地理分布的副本集](https://www.mongodb.com/docs/manual/core/replica-set-architecture-geographically-distributed/#std-label-replica-set-geographical-distribution)时，MongoDB 可以自动将文件及其元数据分发到多个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例和设施。

如果您需要自动更新整个文件的内容，请不要使用 GridFS。作为替代方案，您可以存储每个文件的多个版本并在元数据中指定文件的当前版本。上传文件的新版本后，您可以在原子更新中更新指示“最新”状态的元数据字段，并在需要时删除以前的版本。

此外，如果您的文件都小于 16 MB [BSON 文档大小](https://www.mongodb.com/docs/manual/reference/limits/#mongodb-limit-BSON-Document-Size)限制，请考虑将每个文件存储在单个文档中，而不是使用 GridFS。您可以使用 BinData 数据类型来存储二进制数据。看你的[司机](https://www.mongodb.com/docs/drivers/)有关使用 BinData 的详细信息的文档。



## 使用网格文件系统

[要使用GridFS](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-GridFS)存储和检索文件，请使用以下任一方法：

- 一个 MongoDB 驱动程序。见[drivers](https://www.mongodb.com/docs/drivers/) 有关将 GridFS 与您的驱动程序一起使用的信息的文档。
- [`mongofiles`](https://www.mongodb.com/docs/database-tools/mongofiles/#mongodb-binary-bin.mongofiles)命令行工具。见 [`mongofiles`](https://www.mongodb.com/docs/database-tools/mongofiles/#mongodb-binary-bin.mongofiles)文档参考。



## GridFS 集合

[GridFS](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-GridFS)将文件存储在两个集合中：

- `chunks`存储二进制块。有关详细信息，请参阅 [`chunks`收藏。_](https://www.mongodb.com/docs/manual/core/gridfs/#std-label-gridfs-chunks-collection)
- `files`存储文件的元数据。有关详细信息，请参阅 [`files`收藏。_](https://www.mongodb.com/docs/manual/core/gridfs/#std-label-gridfs-files-collection)

GridFS 通过在每个集合前加上存储桶名称作为前缀，将这些集合放在一个公共存储桶中。默认情况下，GridFS 使用两个集合和一个名为 的存储桶`fs`：

- `fs.files`
- `fs.chunks`

您可以选择不同的存储桶名称，也可以在单个数据库中创建多个存储桶。包含存储桶名称的完整集合名称受[命名空间长度限制的约束。](https://www.mongodb.com/docs/manual/reference/limits/#mongodb-limit-Namespace-Length)



### `chunks`系列_

`chunks` [[ 1 \]](https://www.mongodb.com/docs/manual/core/gridfs/#footnote-chunk-disambiguation)集合中的每个文档代表一个不同的文件块，如[GridFS](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-GridFS)中所示。此集合中的文档具有以下形式：

```
{
  "_id" : <ObjectId>,
  "files_id" : <ObjectId>,
  "n" : <num>,
  "data" : <binary>
}
```



集合中的文档`chunks`包含以下字段：

- `chunks._id`

  块的唯一[ObjectId](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-ObjectId)。

- `chunks.files_id`

  集合`_id`中指定的“父”文档的。`files`

- `chunks.n`

  块的序列号。GridFS 对所有块进行编号，从 0 开始。

- `chunks.data`

  作为[BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON) `Binary`类型的块的有效负载。



### `files`系列_

`files`集合 中的每个文档代表[GridFS中的一个文件。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-GridFS)

```
{
  "_id" : <ObjectId>,
  "length" : <num>,
  "chunkSize" : <num>,
  "uploadDate" : <timestamp>,
  "md5" : <hash>,
  "filename" : <string>,
  "contentType" : <string>,
  "aliases" : <string array>,
  "metadata" : <any>,
}
```



集合中的文档`files`包含以下部分或全部字段：

- `files._id`

  此文档的唯一标识符。`_id`是您为原始文档选择的数据类型。MongoDB 文档的默认类型是[BSON ](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON)[ObjectId 。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-ObjectId)

- `files.length`

  文档的大小（以字节为单位）。

- `files.chunkSize`

  每个块的大小（以**字节**为单位）。GridFS 将文档分成 size 的块，`chunkSize`最后一个除外，它只是根据需要的大小。默认大小为 255 千字节 (kB)。

- `files.uploadDate`

  GridFS 首次存储文档的日期。该值具有 `Date`类型。

- `files.md5`

  **弃用**FIPS 140-2 禁止使用 MD5 算法。MongoDB 驱动程序弃用 MD5 支持，并将在未来版本中删除 MD5 生成。需要文件摘要的应用程序应该在 GridFS 之外实现它并存储在[`files.metadata`.](https://www.mongodb.com/docs/manual/core/gridfs/#mongodb-data-files.metadata)[filemd5](https://www.mongodb.com/docs/manual/reference/command/filemd5/)命令返回的完整文件的 MD5 散列。该值具有`String` 类型。

- `files.filename`

  可选的。GridFS 文件的人类可读名称。

- `files.contentType`

  **弃用**可选的。GridFS 文件的有效 MIME 类型。仅供应用使用。采用[`files.metadata`](https://www.mongodb.com/docs/manual/core/gridfs/#mongodb-data-files.metadata)用于存储与 GridFS 文件的 MIME 类型相关的信息。

- `files.aliases`

  **弃用**可选的。别名字符串数组。仅供应用使用。采用[`files.metadata`](https://www.mongodb.com/docs/manual/core/gridfs/#mongodb-data-files.metadata)用于存储与 GridFS 文件的 MIME 类型相关的信息。

- `files.metadata`

  可选的。元数据字段可以是任何数据类型，并且可以包含您要存储的任何附加信息。如果您希望向`files` 集合中的文档添加额外的任意字段，请将它们添加到元数据字段中的对象。



## GridFS 索引

GridFS 在每个`chunks`和`files`集合上使用索引以提高效率。[司机](https://www.mongodb.com/docs/drivers/)符合[网格文件系统规范](https://github.com/mongodb/specifications/blob/master/source/gridfs/gridfs-spec.rst) 为方便起见自动创建这些索引。您还可以根据需要创建任何其他索引以满足您的应用程序的需要。



### `chunks`指数_

[GridFS](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-GridFS)使用和字段在集合 上使用[唯一](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-unique-index)的[复合](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-compound-index)索引。这允许高效检索块，如以下示例所示：`chunks``files_id``n`

```
db.fs.chunks.find( { files_id: myFileID } ).sort( { n: 1 } )
```



[驱动](https://www.mongodb.com/docs/drivers/)符合[网格文件系统规范](https://github.com/mongodb/specifications/blob/master/source/gridfs/gridfs-spec.rst) 在读写操作前会自动保证这个索引存在。有关 GridFS 应用程序的特定行为，请参阅相关驱动程序文档。

如果该索引不存在，您可以发出以下操作来创建它使用[`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
db.fs.chunks.createIndex( { files_id: 1, n: 1 }, { unique: true } );
```





### `files`指数_

[GridFS](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-GridFS)使用和字段在集合上使用[索引。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-index)此索引允许高效检索文件，如本例所示：`files``filename``uploadDate`

```
db.fs.files.find( { filename: myFileName } ).sort( { uploadDate: 1 } )
```



[驱动](https://www.mongodb.com/docs/drivers/)符合[网格文件系统规范](https://github.com/mongodb/specifications/blob/master/source/gridfs/gridfs-spec.rst)在读写操作前会自动保证这个索引存在。有关 GridFS 应用程序的特定行为，请参阅相关驱动程序文档。

如果该索引不存在，您可以发出以下操作来创建它使用[`mongosh`:](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
db.fs.files.createIndex( { filename: 1, uploadDate: 1 } );
```



| [ 1 ] | *( [1](https://www.mongodb.com/docs/manual/core/gridfs/#ref-chunk-disambiguation-id1) , [2](https://www.mongodb.com/docs/manual/core/gridfs/#ref-chunk-disambiguation-id3) )* 在GridFS 上下文中使用术语*块与在分片上下文中使用术语**块*无关。 |
| ----- | ------------------------------------------------------------ |
|       |                                                              |

## 分片网格文件系统

[GridFS](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-GridFS)有两个集合需要考虑-`files`和 `chunks`.

### `chunks`收藏

要对`chunks`集合进行分片，请使用`{ files_id : 1, n : 1 }`或`{ files_id : 1 }`作为分片键索引。`files_id`是一个 [ObjectId](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-ObjectId)并且[单调变化。](https://www.mongodb.com/docs/manual/core/sharding-choose-a-shard-key/#std-label-shard-key-monotonic)

对于不运行[`filemd5`](https://www.mongodb.com/docs/manual/reference/command/filemd5/#mongodb-dbcommand-dbcmd.filemd5)验证上传成功的MongoDB驱动（例如支持MongoDB 4.0或更高版本的MongoDB驱动），可以使用[Hashed Sharding](https://www.mongodb.com/docs/manual/core/hashed-sharding/)进行 `chunks`集合。

如果 MongoDB 驱动程序运行[`filemd5`](https://www.mongodb.com/docs/manual/reference/command/filemd5/#mongodb-dbcommand-dbcmd.filemd5)，则不能使用 [散列](https://www.mongodb.com/docs/manual/core/hashed-sharding/)分片。有关详细信息，请参阅[SERVER-9888 。](https://jira.mongodb.org/browse/SERVER-9888)

### `files`收藏

该`files`集合很小，仅包含元数据。GridFS 所需的密钥均不适合在分片环境中均匀分布。不分`files`片允许所有文件元数据文档都存在于[主分片上。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary-shard)

如果您*必须*对`files`集合进行分片，请使用该`_id`字段，并可能与应用程序字段结合使用。

←  [管理日记](https://www.mongodb.com/docs/manual/tutorial/manage-journaling/)[常见问题解答：MongoDB 存储](https://www.mongodb.com/docs/manual/faq/storage/) →

原文链接 - https://docs.mongodb.com/manual/core/gridfs/

译者：陆文龙

