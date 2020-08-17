# Schema Validation 模式验证

On this page 在本页中

- [Specify Validation Rules](https://docs.mongodb.com/manual/core/schema-validation/#specify-validation-rules)
- [JSON Schema](https://docs.mongodb.com/manual/core/schema-validation/#json-schema)
- [Other Query Expressions](https://docs.mongodb.com/manual/core/schema-validation/#other-query-expressions)
- [Behavior](https://docs.mongodb.com/manual/core/schema-validation/#behavior)
- [Restrictions](https://docs.mongodb.com/manual/core/schema-validation/#restrictions)
- [Bypass Document Validation](https://docs.mongodb.com/manual/core/schema-validation/#bypass-document-validation)
- [Additional Information](https://docs.mongodb.com/manual/core/schema-validation/#additional-information)
- 

- [指定验证规则](https://docs.mongodb.com/manual/core/schema-validation/#specify-validation-rules)
- [JSON模式](https://docs.mongodb.com/manual/core/schema-validation/#json-schema)
- [其他查询表达式](https://docs.mongodb.com/manual/core/schema-validation/#other-query-expressions)
- [行为](https://docs.mongodb.com/manual/core/schema-validation/#behavior)
- [限制](https://docs.mongodb.com/manual/core/schema-validation/#restrictions)
- [绕过文档验证](https://docs.mongodb.com/manual/core/schema-validation/#bypass-document-validation)
- [附加信息](https://docs.mongodb.com/manual/core/schema-validation/#additional-information)

*New in version 3.2.*

MongoDB provides the capability to perform schema validation during updates and insertions.

*版本3.2中的新功能*

MongoDB提供了在更新和插入期间执行模式验证的功能。



## Specify Validation Rules 指定验证规则

Validation rules are on a per-collection basis.

To specify validation rules when creating a new collection, use [`db.createCollection()`](https://docs.mongodb.com/manual/reference/method/db.createCollection/#db.createCollection) with the `validator` option.

To add document validation to an existing collection, use [`collMod`](https://docs.mongodb.com/manual/reference/command/collMod/#dbcmd.collMod) command with the `validator` option.

MongoDB also provides the following related options:

- `validationLevel` option, which determines how strictly MongoDB applies validation rules to existing documents during an update, and
- `validationAction` option, which determines whether MongoDB should `error` and reject documents that violate the validation rules or `warn` about the violations in the log but allow invalid documents.

验证规则基于每个集合。

要在创建新集合时指定验证规则，请使用[`db.createCollection()`](https://docs.mongodb.com/manual/reference/method/db.createCollection/#db.createCollection)使用`validator`选项。

若要将文档验证添加到现有集合，请使用[`collMod`](https://docs.mongodb.com/manual/reference/command/collMod/#dbcmd.collMod)带有 `validator` 选项的命令。

MongoDB还提供了以下相关选项：

- `validationLevel` 选项，该选项确定MongoDB在更新期间对现有文档应用验证规则的严格程度，以及
- `validationAction` 选项，该选项确定MongoDB是否应显示错误并拒绝违反验证规则的文档，或 `warn` 日志中的违反行为，但允许无效文档。



## JSON Schema  JSON模式

*New in version 3.6.*

Starting in version 3.6, MongoDB supports JSON Schema validation. To specify JSON Schema validation, use the [`$jsonSchema`](https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/#op._S_jsonSchema) operator in your `validator` expression.

> NOTE
>
> JSON Schema is the recommended means of performing schema validation.
>
> For example, the following example specifies validation rules using JSON schema:
>

*版本3.6中的新功能*

从3.6版开始，MongoDB支持JSON模式验证。要指定JSON模式验证，请使用 [`$jsonSchema`](https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/#op._S_jsonSchema) 操作`validator`表达式中的运算符。

> 注意
>
> 推荐使用JSON模式执行模式验证。
>

例如，以下示例使用JSON模式指定验证规则：

```
db.createCollection("students", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: [ "name", "year", "major", "address" ],
         properties: {
            name: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            year: {
               bsonType: "int",
               minimum: 2017,
               maximum: 3017,
               description: "must be an integer in [ 2017, 3017 ] and is required"
            },
            major: {
               enum: [ "Math", "English", "Computer Science", "History", null ],
               description: "can only be one of the enum values and is required"
            },
            gpa: {
               bsonType: [ "double" ],
               description: "must be a double if the field exists"
            },
            address: {
               bsonType: "object",
               required: [ "city" ],
               properties: {
                  street: {
                     bsonType: "string",
                     description: "must be a string if the field exists"
                  },
                  city: {
                     bsonType: "string",
                     "description": "must be a string and is required"
                  }
               }
            }
         }
      }
   }
})
```

For more information, see [`$jsonSchema`](https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/#op._S_jsonSchema).

有关详细信息，请参见 [`$jsonSchema`](https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/#op._S_jsonSchema)。



## Other Query Expressions 其他查询表达式

In addition to JSON Schema validation that uses the [`$jsonSchema`](https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/#op._S_jsonSchema) query operator, MongoDB supports validation with [other query operators](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors), with the exception of the [`$near`](https://docs.mongodb.com/manual/reference/operator/query/near/#op._S_near), [`$nearSphere`](https://docs.mongodb.com/manual/reference/operator/query/nearSphere/#op._S_nearSphere), [`$text`](https://docs.mongodb.com/manual/reference/operator/query/text/#op._S_text), and [`$where`](https://docs.mongodb.com/manual/reference/operator/query/where/#op._S_where) operators.

For example, the following example specifies validator rules using the query expression:

除了使用[`$jsonSchema`](https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/#op._S_jsonSchema) 操作查询运算符，MongoDB支持使用 [其他查询运算符](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors) 查询选择器，除了[`$near`](https://docs.mongodb.com/manual/reference/operator/query/near/#op._S_near)，[$nearSphere](https://docs.mongodb.com/manual/reference/operator/query/nearSphere/'35；操作/u nearSphere)， [`$text`](https://docs.mongodb.com/manual/reference/operator/query/text/#op._S_text)，和 [`$where`](https://docs.mongodb.com/manual/reference/operator/query/where/#op._S_where) 运算符。

例如，以下示例使用查询表达式指定验证器规则：

```
db.createCollection( "contacts",
   { validator: { $or:
      [
         { phone: { $type: "string" } },
         { email: { $regex: /@mongodb\.com$/ } },
         { status: { $in: [ "Unknown", "Incomplete" ] } }
      ]
   }
} )
```

SEE ALSO

[query operators](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors)

另请参见

[查询运算符](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors)



## Behavior 行为

Validation occurs during updates and inserts. When you add validation to a collection, existing documents do not undergo validation checks until modification.

在更新和插入期间进行验证。将验证添加到集合时，现有文档在修改之前不会进行验证检查。



### Existing Documents 现有文档

The `validationLevel` option determines which operations MongoDB applies the validation rules:

- If the `validationLevel` is `strict` (the default), MongoDB applies validation rules to all inserts and updates.
- If the `validationLevel` is `moderate`, MongoDB applies validation rules to inserts and to updates to existing documents that already fulfill the validation criteria. With the `moderate` level, updates to existing documents that do not fulfill the validation criteria are not checked for validity.

For example, create a `contacts` collection with the following documents:

`validationLevel` 选项确定MongoDB应用验证规则的操作：

- 如果 `validationLevel` 是 `strict`（默认值），MongoDB会对所有插入和更新应用验证规则。
- 如果 `validationLevel`是 `moderate`，MongoDB将验证规则应用于已满足验证条件的现有文档的插入和更新。使用 `moderate` 级别时，不检查对不符合验证条件的现有文档的更新是否有效。

例如，使用以下文档创建 `contacts` 集合:

```
db.contacts.insert([
   { "_id": 1, "name": "Anne", "phone": "+1 555 123 456", "city": "London", "status": "Complete" },
   { "_id": 2, "name": "Ivan", "city": "Vancouver" }
])
```

Issue the following command to add a validator to the `contacts` collection:

发出以下命令将验证器添加到 `contacts` 集合：

```
db.runCommand( {
   collMod: "contacts",
   validator: { $jsonSchema: {
      bsonType: "object",
      required: [ "phone", "name" ],
      properties: {
         phone: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         name: {
            bsonType: "string",
            description: "must be a string and is required"
         }
      }
   } },
   validationLevel: "moderate"
} )
```

The `contacts` collection now has a validator with the `moderate` validationLevel:

- If you attempted to update the document with `_id` of `1`, MongoDB would apply the validation rules since the existing document matches the criteria.
- In contrast, MongoDB will not apply validation rules to updates to the document with `_id` of `2` as it does not meet the validation rules.

To disable validation entirely, you can set `validationLevel` to `off`.

这 `contacts` 集合现在有一个使用 `moderate` 验证级别的验证器：

- 如果试图更新 `_id`为1, MongoDB将应用验证规则，因为现有文档与条件匹配。
- 相反，MongoDB不会对`_id`为2的文档应用验证规则，因为它不符合验证规则。

要完全禁用验证，可以将`validationLevel`设置为`off`。



### Accept or Reject Invalid Documents 接受或拒绝无效文档

The `validationAction` option determines how MongoDB handles documents that violate the validation rules:

- If the `validationAction` is `error` (the default), MongoDB rejects any insert or update that violates the validation criteria.
- If the `validationAction` is `warn`, MongoDB logs any violations but allows the insertion or update to proceed.

For example, create a `contacts2` collection with the following JSON Schema validator:

`validationAction`选项确定MongoDB如何处理违反验证规则的文档：

- 如果`validationAction` 为`error` （默认值），MongoDB将拒绝任何违反验证条件的插入或更新。
- 如果`validationAction` 为`warn`，MongoDB会记录任何冲突，但允许继续插入或更新。

例如，使用以下JSON模式验证器创建一个`contacts2`集合：

```
db.createCollection( "contacts2", {
   validator: { $jsonSchema: {
      bsonType: "object",
      required: [ "phone" ],
      properties: {
         phone: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         email: {
            bsonType : "string",
            pattern : "@mongodb\.com$",
            description: "must be a string and match the regular expression pattern"
         },
         status: {
            enum: [ "Unknown", "Incomplete" ],
            description: "can only be one of the enum values"
         }
      }
   } },
   validationAction: "warn"
} )
```

With the `warn` [`validationAction`](https://docs.mongodb.com/manual/reference/command/collMod/#validationAction), MongoDB logs any violations but allows the insertion or update to proceed.

使用`warn` [`validationAction`](https://docs.mongodb.com/manual/reference/command/collMod/#validationAction)，MongoDB会记录任何冲突，但允许继续插入或更新。



For example, the following insert operation violates the validation rule:

例如，以下插入操作违反了验证规则：

```
db.contacts2.insert( { name: "Amanda", status: "Updated" } )
```

However, since the `validationAction` is `warn` only, MongoDB only logs the validation violation message and allows the operation to proceed:

不过，由于`validationAction` 仅为`warn` ，MongoDB只记录验证冲突消息并允许操作继续：

```
2017-12-01T12:31:23.738-0500 W STORAGE  [conn1] Document would fail validation collection: example.contacts2 doc: { _id: ObjectId('5a2191ebacbbfc2bdc4dcffc'), name: "Amanda", status: "Updated" }
```



## Restrictions 限制

You cannot specify a validator for collections in the `admin`, `local`, and `config` databases.

You cannot specify a validator for `system.*` collections.

不能为`admin`、`local`和`config` 数据库中的集合指定验证器。

不能为 `system.*`集合指定验证器。



## Bypass Document Validation  绕过文档验证

Users can bypass document validation using the `bypassDocumentValidation` option.

The following commands can bypass validation per operation using the new option `bypassDocumentValidation`:

- [`applyOps`](https://docs.mongodb.com/manual/reference/command/applyOps/#dbcmd.applyOps) command
- [`findAndModify`](https://docs.mongodb.com/manual/reference/command/findAndModify/#dbcmd.findAndModify) command and [`db.collection.findAndModify()`](https://docs.mongodb.com/manual/reference/method/db.collection.findAndModify/#db.collection.findAndModify) method
- [`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce) command and [`db.collection.mapReduce()`](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#db.collection.mapReduce) method
- [`insert`](https://docs.mongodb.com/manual/reference/command/insert/#dbcmd.insert) command
- [`update`](https://docs.mongodb.com/manual/reference/command/update/#dbcmd.update) command
- [`$out`](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out) and [`$merge`](https://docs.mongodb.com/manual/reference/operator/aggregation/merge/#pipe._S_merge) stages for the [`aggregate`](https://docs.mongodb.com/manual/reference/command/aggregate/#dbcmd.aggregate) command and [`db.collection.aggregate()`](https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/#db.collection.aggregate) method

For deployments that have enabled access control, to bypass document validation, the authenticated user must have [`bypassDocumentValidation`](https://docs.mongodb.com/manual/reference/privilege-actions/#bypassDocumentValidation) action. The built-in roles [`dbAdmin`](https://docs.mongodb.com/manual/reference/built-in-roles/#dbAdmin) and [`restore`](https://docs.mongodb.com/manual/reference/built-in-roles/#restore) provide this action.



用户可以使用`bypassDocumentValidation` 选项绕过文档验证。

以下命令可以使用新选项`bypassDocumentValidation`跳过每个操作的验证：

- [`applyOps`](https://docs.mongodb.com/manual/reference/command/applyOps/#dbcmd.applyOps) 命令
- [`findAndModify`](https://docs.mongodb.com/manual/reference/command/findAndModify/#dbcmd.findAndModify) 命令和 [`db.collection.findAndModify()`](https://docs.mongodb.com/manual/reference/method/db.collection.findAndModify/#db.collection.findAndModify) 方法
- [`mapReduce`](https://docs.mongodb.com/manual/reference/command/mapReduce/#dbcmd.mapReduce) 命令和 [`db.collection.mapReduce()`](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#db.collection.mapReduce) 方法
- [`insert`](https://docs.mongodb.com/manual/reference/command/insert/#dbcmd.insert) 命令
- [`update`](https://docs.mongodb.com/manual/reference/command/update/#dbcmd.update) 命令
-  为[`聚合`](https://docs.mongodb.com/manual/reference/command/aggregate/#dbcmd.aggregate) 命令和 [`db.collection.aggregate()`](https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/#db.collection.aggregate) 方法提供的过程命令[`$out`](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out) 和 [`$merge`](https://docs.mongodb.com/manual/reference/operator/aggregation/merge/#pipe._S_merge) 

对于已启用访问控制的部署，若要绕过文档验证，经过身份验证的用户必须具有[`bypassDocumentValidation`](https://docs.mongodb.com/manual/reference/privilege-actions/#bypassDocumentValidation)行动。内置角色[`dbAdmin`](https://docs.mongodb.com/manual/reference/built-in-roles/#dbAdmin) 和 [`restore`](https://docs.mongodb.com/manual/reference/built-in-roles/#restore) 提供此操作。



## Additional Information 附加信息

SEE ALSO

[`collMod`](https://docs.mongodb.com/manual/reference/command/collMod/#dbcmd.collMod), [`db.createCollection()`](https://docs.mongodb.com/manual/reference/method/db.createCollection/#db.createCollection), [`db.getCollectionInfos()`](https://docs.mongodb.com/manual/reference/method/db.getCollectionInfos/#db.getCollectionInfos).

另请参见

[`collMod`](https://docs.mongodb.com/manual/reference/command/collMod/#dbcmd.collMod), [`db.createCollection()`](https://docs.mongodb.com/manual/reference/method/db.createCollection/#db.createCollection), [`db.getCollectionInfos()`](https://docs.mongodb.com/manual/reference/method/db.getCollectionInfos/#db.getCollectionInfos)。



←  [Data Modeling Introduction](https://docs.mongodb.com/manual/core/data-modeling-introduction/)  [Data Modeling Concepts](https://docs.mongodb.com/manual/core/data-models/) →

←  [数据建模简介](https://docs.mongodb.com/manual/core/data-modeling-introduction/)  [数据建模概念](https://docs.mongodb.com/manual/core/data-models/) →



译者：张鹏

原文链接：https://docs.mongodb.com/manual/core/schema-validation/
