# Change Streams Production Recommendations

**在本页面**

- [改变 Events](#)
- [insert Event]()
- [更新 Event]()
- [替换 Event]()
- [删除 Event]()
- [使 Event 无效]()
<br />
<a name="f2mHB"></a>
## 改变 Events
以下文档表示更改流响应文档可以具有的所有可能字段。
```powershell
{
   _id : { <BSON Object> },
   "operationType" : "<operation>",
   "fullDocument" : { <document> },
   "ns" : {
      "db" : "<database>",
      "coll" : "<collection"
   },
   "documentKey" : { "_id" : <value> },
   "updateDescription" : {
      "updatedFields" : { <document> },
      "removedFields" : [ "<field>", ... ]
   }
}
```
某些字段仅适用于某些操作，例如更新。以下 table 描述了更改流响应文档中的每个字段：

| 领域 | 类型 | 描述 |
| :--- | :--- | :--- |
| `_id` | 文献 | 与操作相关的元数据。<br />恢复更改流时，将此文档用作`resumeAfter`的`resumeAfter`参数。 |
| `operationType` | 串 | 发生的操作类型。可以是以下任何值：<br />`insert`<br />`delete`<br />`replace`<br />`update`<br />`invalidate` |
| `fullDocument` | 文献 | 该操作创建或修改的文档。<br />对于`insert`和`replace`操作，这表示操作创建的新文档。<br />对于`delete`操作，由于文档不再存在，因此省略此字段。<br />对于`update`操作，仅当您将更改流配置为`fullDocument`设置为`updateLookup`时，才会显示此字段。然后，该字段表示由更新操作修改的文档的最新 majority-committed version。如果其他 majority-committed 操作在原始更新操作和完整文档查找之间修改了文档，则此文档可能与`updateDescription`中描述的更改不同。 |
| `ns` | 文献 | 数据库的名称空间和更改流的集合是打开的。 |
| `ns.db` | 串 | 数据库的 name。 |
| `ns.coll` | 串 | 集合的 name。 |
| `documentKey` | 文献 | 包含操作创建或修改的文档的`_id`的文档。对于分片集合，还会显示文档的完整分片 key。如果`_id`字段已经是分片 key 的一部分，则不会重复该字段。 |
| `updateDescription` | 文献 | 描述更新操作更新或删除的字段的文档。<br />仅当`operationType`为`update`时，才会显示此文档及其字段。 |
| `updateDescription.updatedFields` | 文献 | 一个文档，其键对应于更新操作修改的字段。每个字段的 value 对应于这些字段的新 value，而不是导致新 value 的操作。 |
| `updateDescription.removedFields` | array | 更新操作删除的 array 字段。 |

## insert Event
以下 example 说明了`insert` event：
```
{
   _id: { < Resume Token > },
   operationType: 'insert',
   ns: {
      db: 'engineering',
      coll: 'users'
   },
   documentKey: {
      userName: 'alice123',
      _id: ObjectId("599af247bb69cd89961c986d")
   },
   fullDocument: {
      _id: ObjectId("599af247bb69cd89961c986d"),
      userName: 'alice123',
      name: 'Alice'
   }
}
```
`documentKey`字段包括`_id`和`userName`字段。这表示`engineering.users`集合是分片的，`userName`和`_id`上有一个 shard key。<br />`fullDocument`文档表示 insert 的 time 处文档的 version。

<a name="3333V"></a>
## 更新 Event
以下 example 说明了`update` event：
```
{
   _id: { < Resume Token > },
   operationType: 'update',
   ns: {
      db: 'engineering',
      coll: 'users'
   },
   documentKey: {
      _id: ObjectId("58a4eb4a30c75625e00d2820")
   },
   updateDescription: {
      updatedFields: {
         email: 'alice@10gen.com'
      },
      removedFields: ['phoneNumber']
   }
}
```
以下 example 说明了使用`fullDocument : updateLookup`选项打开的更改流的`update` event：
```
{
   _id: { < Resume Token > },
   operationType: 'update',
   ns: {
      db: 'engineering',
      coll: 'users'
   },
   documentKey: {
      _id: ObjectId("58a4eb4a30c75625e00d2820")
   },
   updateDescription: {
      updatedFields: {
         email: 'alice@10gen.com'
      },
      removedFields: ['phoneNumber']
   },
   fullDocument: {
      _id: ObjectId("58a4eb4a30c75625e00d2820"),
      name: 'Alice',
      userName: 'alice123',
      email: 'alice@10gen.com',
      team: 'replication'
   }
}
```
`fullDocument`文档代表更新文档的最新 majority-committed version。 `fullDocument`文档可能与更新操作的 time 时的文档不同，具体取决于更新操作和文档查找之间发生的交错 majority-committed 操作的数量。<br />
<a name="T2uKA"></a>
## 替换 Event
以下 example 说明了`replace` event：
```
{
   _id: { < Resume Token > },
   operationType: 'replace',
   ns: {
      db: 'engineering',
      coll: 'users'
   },
   documentKey: {
      _id: ObjectId("599af247bb69cd89961c986d")
   },
   fullDocument: {
      _id: ObjectId("599af247bb69cd89961c986d"),
      userName: 'alice123',
      name: 'Alice'
   }
}
```
`replace`操作使用 update 命令，包含两个阶段：

- 使用`documentKey`和删除原始文档<br />
- 使用相同的`documentkey`插入新文档<br />

`replace` event 的`fullDocument`表示替换文档的 insert 之后的文档。<br />
<a name="sH3OG"></a>
## 删除 Event
以下 example 说明了`delete` event：
```
{
   _id: { < Resume Token > },
   operationType: 'delete',
   ns: {
      db: 'engineering',
      coll: 'users'
   },
   documentKey: {
      _id: ObjectId("599af247bb69cd89961c986d")
   }
}
```
文档被省略，因为更改流游标将`delete` event 发送到 client 的 time 时文档不再存在。

<a name="wSk94"></a>
## 使 Event 无效
以下 example 说明了`invalidate` event：
```
{
   _id: { < Resume Token > },
   operationType: 'invalidate'
}
```
对于针对集合打开的更改流，`invalidate` events 发生在影响监视集合的[dropDatabase]()