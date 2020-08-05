
改变流

改变流
在本页面
打开变革流
修改更改流输出
查找更新操作的完整文档
恢复变更流
用例
访问控制
Event 通知
version 3.6 中的新内容。
更改流允许 applications 访问 real-time 数据更改，而没有拖尾OPLOG的复杂性和风险。 Applications 可以使用更改流来订阅集合上的所有数据更改，并立即对它们做出反应。
重要仅当启用了“多数”读取关注支持时，才能使用更改流(默认)。
打开变革流您只能针对副本 sets或分片簇打开更改流。对于分片 cluster，您必须针对mongos发出打开更改流操作。
副本集或分片 cluster 必须使用副本集协议 version 1(PV1)和WiredTiger存储引擎(可以是加密)。
以下 example 打开集合的更改流，并迭代光标以检索更改流文档。与 MongoDB 部署的连接保持打开状态时，光标将保持打开状态，直到出现以下情况之一：
游标显式关闭。
发生使 event 无效。
如果部署是分片 cluster，则删除分片可能会导致打开更改流游标关闭，并且关闭的更改流游标可能无法完全恢复。
蟒蛇下面的 Python 示例假设您有连接到 MongoDB 副本集并访问过数据库包含inventory集合。
cursor = db.inventory.watch()document = next(cursor)Java(同步)下面的 Java 示例假设您有连接到 MongoDB 副本集并访问过数据库包含inventory集合。
MongoCursor<ChangeStreamDocument> cursor = inventory.watch().iterator();ChangeStreamDocument next = cursor.next();Node.js下面的 Node.js 示例假设您有包含inventory集合的连接到 MongoDB 副本集并访问过数据库。
以下 example 使用 stream 来处理更改 events。
const collection = db.collection('inventory');const changeStream = collection.watch();changeStream.on('change', next => {// process next document});或者，您也可以使用迭代器来处理更改 events：
const changeStreamIterator = collection.watch();const next = await changeStreamIterator.next(); PHP下面的示例假设您有连接到 MongoDB 副本集并访问过数据库包含inventory集合。
$changeStream = $db->inventory->watch();$changeStream->rewind();
$firstChange = $changeStream->current();
$changeStream->next();
$secondChange = $changeStream->current();发动机下面的示例假设您有连接到 MongoDB 副本集并访问过数据库包含inventory集合。
cursor = db.inventory.watch()document = await cursor.next()C#下面的 C#示例假设您有连接到 MongoDB 副本集并访问过数据库包含inventory集合。
var enumerator = inventory.Watch().ToEnumerable().GetEnumerator();enumerator.MoveNext();var next = enumerator.Current;enumerator.Dispose();红宝石下面的示例假设您有连接到 MongoDB 副本集并访问过数据库包含inventory集合。
cursor = inventory.watch.to_enumnext_change = cursor.next要检索数据更改 event 通知，请迭代更改流cursor。
注意未封闭游标的生命周期为 language-dependent。
有关更改流响应文档格式的更多信息，请参见改变 Events。
修改更改流输出蟒蛇在配置更改流时，可以通过提供以下一个或多个管道阶段的 array 来控制改变流输出：
$match
$project
$addFields
$replaceRoot
$redact
Java(同步)在配置更改流时，可以通过提供以下一个或多个管道阶段的 array 来控制改变流输出：
$match
$project
$addFields
$replaceRoot
$redact
MongoClient mongoClient = new MongoClient( new MongoClientURI("mongodb://host1:port1,host2:port2..."));
// Select the MongoDB database and collection to open the change stream against
MongoDatabase db = mongoClient.getDatabase("myTargetDatabase");
MongoCollection collection = db.getCollection("myTargetCollection");
// Create $match pipeline stage.List pipeline = singletonList(Aggregates.match(Filters.or(Document.parse("{'fullDocument.username': 'alice'}"),Filters.in("operationType", asList("delete")))));
// Create the change stream cursor, passing the pipeline to the// collection.watch() method
MongoCursor cursor = collection.watch(pipeline).iterator();pipeline列表包括一个$match阶段，用于过滤username为alice的任何操作，或者operationType为delete的操作。
将pipeline传递给watch()方法会在将更改流传递给指定的pipeline后将更改流指向 return 通知。
Node.js在配置更改流时，可以通过提供以下一个或多个管道阶段的 array 来控制改变流输出：
$match
$project
$addFields
$replaceRoot
$redact
以下 example 使用 stream 来处理更改 events。
const pipeline = [{ $match: { 'fullDocument.username': 'alice' } },{ $addFields: { newField: 'this is an added field!' } }];
const collection = db.collection('inventory');const changeStream = collection.watch(pipeline);changeStream.on('change', next => {// process next document});或者，您也可以使用迭代器来处理更改 events：
const changeStreamIterator = collection.watch(pipeline);const next = await changeStreamIterator.next(); PHP在配置更改流时，可以通过提供以下一个或多个管道阶段的 array 来控制改变流输出：
$match
$project
$addFields
$replaceRoot
$redact
发动机在配置更改流时，可以通过提供以下一个或多个管道阶段的 array 来控制改变流输出：
$match
$project
$addFields
$replaceRoot
$redact
C#在配置更改流时，可以通过提供以下一个或多个管道阶段的 array 来控制改变流输出：
$match
$project
$addFields
$replaceRoot
$redact
红宝石在配置更改流时，可以通过提供以下一个或多个管道阶段的 array 来控制改变流输出：
$match
$project
$addFields
$replaceRoot
$redact
有关更改流响应文档格式的更多信息，请参见改变 Events。
查找更新操作的完整文档默认情况下，仅更改流在更新操作期间返回字段的增量。但是，您可以将更改流配置为 return 更新文档的最新 majority-committed version。蟒蛇要_return 更新文档的最新 majority-committed version，请将full_document='updateLookup'传递给db.collection.watch()方法。
在下面的 example 中，所有更新操作通知都包含一个full_document字段，该字段表示受更新操作影响的文档的当前 version。
cursor = db.inventory.watch(full_document='updateLookup')document = next(cursor)Java(同步)要_return 更新文档的最新 majority-committed version，请将FullDocument.UPDATE_LOOKUP传递给db.collection.watch.fullDocument()方法。
在下面的 example 中，所有更新操作通知都包含一个FullDocument字段，该字段表示受更新操作影响的文档的当前 version。
cursor = inventory.watch().fullDocument(FullDocument.UPDATE_LOOKUP).iterator();next = cursor.next();Node.js要_return 更新文档的最新 majority-committed version，请将{ fullDocument: 'updateLookup' }传递给collection.watch()方法。
在下面的 example 中，所有更新操作通知都包含一个fullDocument字段，该字段表示受更新操作影响的文档的当前 version。
以下 example 使用 stream 来处理更改 events。
const collection = db.collection('inventory');const changeStream = collection.watch({ fullDocument: 'updateLookup' });changeStream.on('change', next => {// process next document});或者，您也可以使用迭代器来处理更改 events：
const changeStreamIterator = collection.watch({ fullDocument: 'updateLookup' });const next = await changeStreamIterator.next(); PHP要_return 更新文档的最新 majority-committed version，请将"fullDocument' => \MongoDB\Operation\ChangeStreamCommand::FULL_DOCUMENT_UPDATE_LOOKUP"传递给watch()方法。
在下面的 example 中，所有更新操作通知都包含一个fullDocument字段，该字段表示受更新操作影响的文档的当前 version。
$changeStream = $db->inventory->watch([], ['fullDocument' => \MongoDB\Operation\Watch::FULL_DOCUMENT_UPDATE_LOOKUP]);$changeStream->rewind();
$firstChange = $changeStream->current();
$changeStream->next();
$nextChange = $changeStream->current();发动机要_return 更新文档的最新 majority-committed version，请将full_document='updateLookup'传递给db.collection.watch()方法。
在下面的 example 中，所有更新操作通知都包含一个“full_document”字段，表示受更新操作影响的文档的当前 version。
cursor = db.inventory.watch(full_document='updateLookup')document = await cursor.next()C#要_return 更新文档的最新 majority-committed version，请将"FullDocument = ChangeStreamFullDocumentOption.UpdateLookup"传递给collection.Watch()方法。
在下面的 example 中，所有更新操作通知都包含一个FullDocument字段，该字段表示受更新操作影响的文档的当前 version。
var options = new ChangeStreamOptions { FullDocument = ChangeStreamFullDocumentOption.UpdateLookup };var enumerator = inventory.Watch(options).ToEnumerable().GetEnumerator();enumerator.MoveNext();var next = enumerator.Current;enumerator.Dispose();红宝石要_return 更新文档的最新 majority-committed version，请将full_document: 'updateLookup'传递给watch()方法。
在下面的 example 中，所有更新操作通知都包含一个full_document字段，该字段表示受更新操作影响的文档的当前 version。
cursor = inventory.watch([], full_document: 'updateLookup').to_enumnext_change = cursor.next注意有关更改流响应文档格式的更多信息，请参见改变 Events。
恢复变更流打开游标时，通过指定resumeAfter标记可以恢复更改流。对于resumeAfter标记，请使用更改流 event 文档的_id value。将_id value 传递给更改流会尝试在指定的操作之后恢复通知。
重要
如果时间戳是过去的，则 oplog 必须具有足够的历史记录来定位与令牌或时间戳关联的操作。
在使 event 无效(对于 example，集合删除或重命名)关闭流之后，您无法恢复更改流。Python在下面的 example 中，resume_token包含更改流通知 ID。 resume_after修饰符采用必须解析为恢复标记的参数。将resume_token传递给resume_after修饰符会指示更改流尝试在恢复令牌中指定的操作之后开始恢复通知。
resume_token = document.get("_id")cursor = db.inventory.watch(resume_after=resume_token)document = next(cursor)Java(同步)在下面的 example 中，resumeToken包含更改流通知 ID。 resumeAfter()方法采用必须解析为恢复标记的参数。将resumeToken传递给resumeAfter()方法会指示更改流尝试在恢复令牌中指定的操作之后开始恢复通知。
BsonDocument resumeToken = next.getResumeToken();cursor = inventory.watch().resumeAfter(resumeToken).iterator();next = cursor.next();Node.js在下面的 example 中，resumeToken包含更改流通知 ID。 resumeAfter采用必须解析为恢复令牌的参数。将resumeToken传递给resumeAfter修饰符会指示更改流尝试在指定的操作之后开始恢复通知。
const collection = db.collection('inventory');const changeStream = collection.watch();
let resumeToken, newChangeStream;changeStream.on('change', next => {resumeToken = next._id;changeStream.close();
newChangeStream = collection.watch({ resumeAfter });newChangeStream.on('change', next => {// process next document});}); PHP在下面的 example 中，$resumeToken包含更改流通知 ID。 resumeAfter选项需要一个必须解析为恢复标记的 value。将$resumeToken传递给resumeAfter选项会指示更改流尝试在恢复令牌中指定的操作之后开始恢复通知。
$resumeToken = ($lastChange !== null) ? $lastChange->_id : null;
if ($resumeToken === null) {throw new \Exception('resumeToken was not found');}
$changeStream = $db->inventory->watch([], ['resumeAfter' => $resumeToken]);$changeStream->rewind();
$nextChange = $changeStream->current();发动机在下面的 example 中，resume_token包含更改流通知 ID。 resume_after修饰符采用必须解析为恢复标记的参数。将resume_token传递给resume_after修饰符会指示更改流尝试在恢复令牌中指定的操作之后开始恢复通知。
resume_token = document.get("_id")cursor = db.inventory.watch(resume_after=resume_token)document = await cursor.next()C#在下面的 example 中，从最后一个更改流文档中检索resumeToken并作为选项传递给Watch()方法。将resumeToken传递给Watch()方法会指示更改流尝试在恢复令牌中指定的操作之后开始恢复通知。
var resumeToken = lastChangeStreamDocument.ResumeToken;var options = new ChangeStreamOptions { ResumeAfter = resumeToken };var enumerator = inventory.Watch(options).ToEnumerable().GetEnumerator();enumerator.MoveNext();var next = enumerator.Current;enumerator.Dispose();红宝石在下面的 example 中，resume_token包含更改流通知 ID。 resume_after修饰符采用必须解析为恢复标记的参数。将resume_token传递给resume_after修饰符会指示更改流尝试在恢复令牌中指定的操作之后开始恢复通知。
resume_token = next_change['_id']cursor = inventory.watch([], resume_after: resume_token).to_enumresumed_change = cursor.next
用例变更流可以使具有相关业务系统的架构受益，一旦数据变化持久，就可以通知下游系统。例如，在实现 Extract，Transform 和 Load(ETL)服务，cross-platform 同步，协作功能和通知服务时，更改流可以为开发人员节省 time。
访问控制对于强制执行认证和授权的部署，请对要对其打开更改流的集合执行changeStream和找权限操作的用户进行身份验证。
读 built-in 角色包括支持针对集合打开更改流所需的权限。任何 built-in 角色或user-defined 角色继承读角色也可以支持打开集合的更改流。
或者，使用db.createRole创建 user-defined 角色，在目标集合上授予changeStream和找权限操作。有关更完整的文档，请参见User-Defined 角色。
要将 built-in 角色或 user-defined 角色与现有用户相关联，请使用db.grantRolesToUser()或db.updateUser()方法。您还可以在_使用db.createUser()创建新用户时指定角色。
Event 通知更改流仅通知已保留到副本集中大多数 data-bearing 成员的数据更改。这可确保仅在失败方案中持久的 majority-committed 更改触发通知。
例如，考虑一个 3-member 副本集，其中一个更改流游标针对主打开。如果 client 发出 insert 操作，则只要 insert 持续存在于大多数 data-bearing 成员，更改流才会通知 application 数据更改。
Change Streams Production Recommendations
改变 Events


