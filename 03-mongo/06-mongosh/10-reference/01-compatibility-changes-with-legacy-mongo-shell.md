# `mongo`旧版Shell的兼容性变化

此页面描述了 mongosh 和旧版 mongo shell 之间的区别。除了此处列出的备选方案外，您还可以使用  [mongocompat](https://github.com/mongodb-labs/mongosh-snippets/blob/main/snippets/mongocompat/) 访问遗产的片段 mongo shellAPI。片段是一项实验性功能，有关更多信息，请参阅[Snippets.](https://www.mongodb.com/docs/mongodb-shell/snippets/#std-label-snip-overview)

## 弃用的方法

以下 shell 方法在`mongosh`. **相反，请使用替代资源**列中列出的方法。



| 弃用的方法                  | 替代资源                                                     |
| :-------------------------- | :----------------------------------------------------------- |
| `db.collection.copyTo()`    | 聚合阶段：[`$out`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out) |
| `db.collection.count()`     | [`db.collection.countDocuments()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.countDocuments/#mongodb-method-db.collection.countDocuments)[`db.collection.estimatedDocumentCount()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.estimatedDocumentCount/#mongodb-method-db.collection.estimatedDocumentCount) |
| `db.collection.insert()`    | [`db.collection.insertOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)[`db.collection.insertMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany)[`db.collection.bulkWrite()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/#mongodb-method-db.collection.bulkWrite) |
| `db.collection.remove()`    | [`db.collection.deleteOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/#mongodb-method-db.collection.deleteOne)[`db.collection.deleteMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/#mongodb-method-db.collection.deleteMany)[`db.collection.findOneAndDelete()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndDelete/#mongodb-method-db.collection.findOneAndDelete)[`db.collection.bulkWrite()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/#mongodb-method-db.collection.bulkWrite) |
| `db.collection.save()`      | [`db.collection.insertOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)[`db.collection.insertMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany)[`db.collection.updateOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne)[`db.collection.updateMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany)[`db.collection.findOneAndUpdate()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/#mongodb-method-db.collection.findOneAndUpdate) |
| `db.collection.update()`    | [`db.collection.updateOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne)[`db.collection.updateMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany)[`db.collection.findOneAndUpdate()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/#mongodb-method-db.collection.findOneAndUpdate)[`db.collection.bulkWrite()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/#mongodb-method-db.collection.bulkWrite) |
| `DBQuery.shellBatchSize`    | [config.set("displayBatchSize", "")](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings-api/#std-label-mongosh-config-set)[游标.batchSize()](https://www.mongodb.com/docs/mongodb-shell/reference/methods/#std-label-mongosh-cursor-methods) |
| `Mongo.getSecondaryOk`      | [`Mongo.getReadPrefMode()`](https://www.mongodb.com/docs/manual/reference/method/Mongo.getReadPrefMode/#mongodb-method-Mongo.getReadPrefMode) |
| `Mongo.isCausalConsistency` | [`Session.getOptions()`](https://www.mongodb.com/docs/manual/reference/method/Session/#mongodb-method-Session.getOptions) |
| `Mongo.setSecondaryOk`      | [`Mongo.setReadPref()`](https://www.mongodb.com/docs/manual/reference/method/Mongo.setReadPref/#mongodb-method-Mongo.setReadPref) |
| `rs.secondaryOk`            | 不再需要。看 [读取辅助节点上的操作。](https://www.mongodb.com/docs/mongodb-shell/reference/compatibility/#std-label-read-on-secondary-nodes) |

## 阅读偏好行为

### 从节点读操作

当使用遗留的 mongo shell 直接连接到 [次要的](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)副本集成员，您必须运行 `mongo.setReadPref()`以启用二次读取。

当使用`mongosh`直接连接到[次要的](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary) 副本集成员，如果你指定一个，你可以从该成员读取 [阅读偏好](https://www.mongodb.com/docs/manual/core/read-preference/)之一：

- [`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred)
- [`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)
- [`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred)

要指定阅读首选项，您可以使用以下任一方法：

- 这[`readPreference`](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.readPreference)连接到节点时的连接字符串选项。
- 这[`Mongo.setReadPref()`](https://www.mongodb.com/docs/manual/reference/method/Mongo.setReadPref/#mongodb-method-Mongo.setReadPref)方法。

当使用`mongosh`直接连接到[次要的](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary) 副本集成员，如果您的读取首选项设置为 [`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred),[`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary)或者 [`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred)它*不需要*运行 `rs.secondaryOk()`。

### `show`辅助方法

以下`show`帮助器方法始终使用 的读取首选项 `primaryPreferred`，即使已为操作指定了不同的读取首选项也是如此：

- `show dbs`
- `show databases`
- `show collections`
- `show tables`

在旧版`mongo`shell 中，这些操作使用指定的读取首选项。

## 写入首选项行为

[可重试写入](https://www.mongodb.com/docs/manual/core/retryable-writes/#std-label-retryable-writes)中默认启用 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。可重试写入在旧版中默认被禁用[`mongo`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)壳。要禁用可重试写入，请使用 [`--retryWrites=false`.](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--retryWrites)

## ObjectId 方法和属性

这些[对象标识符()](https://www.mongodb.com/docs/manual/reference/method/ObjectId/#std-label-core-object-id-class)`mongosh`方法在传统shell 中的工作方式不同`mongo`。

| 方法或属性            | `mongo`行为                                              | `mongosh`行为                                            |
| :-------------------- | :------------------------------------------------------- | :------------------------------------------------------- |
| `ObjectId.str`        | 返回十六进制字符串：`6419ccfce40afaf9317567b7`           | 不明确的（无法使用）                                     |
| `ObjectId.valueOf()`  | 返回值`ObjectId.str`：`6419ccfce40afaf9317567b7`         | 返回格式化字符串：`ObjectId("6419ccfce40afaf9317567b7")` |
| `ObjectId.toString()` | 返回格式化字符串：`ObjectId("6419ccfce40afaf9317567b7")` | 返回一个十六进制格式的字符串：`6419ccfce40afaf9317567b7` |

## 数值

旧版shell默认`mongo`存储数值。`doubles`In `mongosh`numbers 存储为 32 位整数， `Int32`，或者就好像`Double`该值不能存储为 `Int32`.

MongoDB Shell 继续支持`mongo`shell 中支持的数字类型。但是，首选类型已更新以更好地与 MongoDB 保持一致[司机](https://www.mongodb.com/docs/drivers/drivers/). 有关详细信息，请参阅 [mongosh 数据类型。](https://www.mongodb.com/docs/mongodb-shell/reference/data-types/#std-label-mongo-shell-data-type)

MongoDB Shell 中数字变量的首选类型与传统 shell 中建议的类型不同`mongo`。这些类型`mongosh`更好地与 MongoDB 驱动程序使用的类型保持一致。

| `mongo`类型     | `mongosh`类型 |
| :-------------- | :------------ |
| `NumberInt`     | `Int32`       |
| `NumberLong`    | `Long`        |
| `NumberDecimal` | `Decimal128`  |

>警告:
>
>`mongosh`如果您同时使用旧shell连接到同一个集合，则数据类型的存储可能会不一致`mongo`。

>提示:
>
>### 也可以看看：
>
>有关管理类型的更多信息，请参阅 [架构验证概述。](https://www.mongodb.com/docs/manual/core/schema-validation/)

## `--eval`行为

`mongosh --eval`不在其输出中引用对象键。

要获得适合自动解析的输出，请使用 `EJSON.stringify()`.

```
mongosh --quiet  --host rs0/centos1104 --port 27500 \
        --eval "EJSON.stringify(rs.status().members.map( \
          m => ({'id':m._id, 'name':m.name, 'stateStr':m.stateStr})));" \
| jq
```

用 解析后`jq`，输出类似于：

```
[
  {
     "id": 0,
     "name": "centos1104:27500",
     "stateStr": "PRIMARY"
  },
  {
     "id": 1,
     "name": "centos1104:27502",
     "stateStr": "SECONDARY"
  },
  {
     "id": 2,
     "name": "centos1104:27503",
     "stateStr": "SECONDARY"
  }
]
```

>笔记:
>
>`EJSON`内置了格式选项，可以消除对像`jq`. 例如，以下代码生成格式与上述相同的输出。
>
>```
>mongosh --quiet  --host rs0/centos1104 --port 27500 \
>        --eval "EJSON.stringify( rs.status().members.map( \
>          ({ _id, name, stateStr }) => ({ _id, name, stateStr })), null, 2);"
>```

## 数据库调用的限制

数据库查询的结果不能在以下上下文中传递：

- 类构造函数
- 非异步生成器函数
- `.sort()`数组回调

要访问数据库调用的结果，请使用[异步函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), [异步生成器函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of), 或者`.map()`.

### 构造器

以下构造函数不起作用：

```
// This code will fail
class FindResults {
   constructor() {
      this.value = db.students.find();
   }
}
// This code will fail
function listEntries() { return db.students.find(); }
class FindResults {
   constructor() {
      this.value = listEntries();
   }
}
```

改用`async`函数

```
class FindResults {
   constructor() {
      this.value = ( async() => {
         return db.students.find();
      } )();
   }
}
```

>笔记:
>
>您还可以创建一个在类中执行数据库操作的方法，作为使用异步 JavaScript 的替代方法。
>
>```
>class FindResults {
>   constructor() { }
>
>   init() { this.value = db.students.find(); }
> }
>```
>
>要使用此类，首先构造一个类实例，然后调用 `.init()`方法。

### 生成器函数

以下生成器函数不起作用：

```
// This code will fail
function* FindResults() {
   yield db.students.findMany();
}

// This code will fail
function listEntries() { return db.students.findMany(); }
function* findResults() {
   yield listEntries();
}
```

改为使用`async generator function`：

```
function listEntries() { return db.students.findMany(); }
async function* findResults() {
   yield listEntries();
}
```

### 数组排序

以下数组排序不起作用：

```
// This code will fail
db.getCollectionNames().sort( ( collectionOne, collectionTwo ) => {
  return db[ collectionOne ].estimatedDocumentCount() - db[ collectionOne ].estimatedDocumentCount() )
} );
```

改用`.map()`

```
db.getCollectionNames().map( collectionName => {
   return { collectionName, size: db[ collectionName ].estimatedDocumentCount() };
} ).sort( ( collectionOne, collectionTwo ) => {
   return collectionOne.size - collectionTwo.size;
} ).map( collection => collection.collectionName);
```

这种数组排序方法通常比等效的不受支持的代码更高效。





翻译：韩鹏帅

原文：[Compatibility Changes with Legacy `mongo` Shell](https://www.mongodb.com/docs/mongodb-shell/reference/compatibility/)
