**查看现有验证规则**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/view-existing-validation-rules/#view-existing-validation-rules)

您可以查看集合的验证规则以确定对文档施加了哪些限制以及 MongoDB 在出现无效文档时如何处理它们。

要查看集合的验证规则，请使用 [`db.getCollectionInfos()`](https://www.mongodb.com/docs/manual/reference/method/db.getCollectionInfos/#mongodb-method-db.getCollectionInfos)方法或[`listCollections`](https://www.mongodb.com/docs/manual/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections) 数据库命令。

这两个命令返回相同的信息，但每个命令的输出格式不同。

**先决条件**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/view-existing-validation-rules/#prerequisite)

要运行此页面上的示例，请创建一个`students`包含验证规则的集合。有关详细信息，请参阅 [指定 JSON 架构验证。](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/#std-label-schema-validation-json)

**示例：`db.getCollectionInfos()`语法**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/view-existing-validation-rules/#example--db.getcollectioninfos---syntax)

以下命令用于[`db.getCollectionInfos()`](https://www.mongodb.com/docs/manual/reference/method/db.getCollectionInfos/#mongodb-method-db.getCollectionInfos)返回`students`集合的验证规则：

```shell
db.getCollectionInfos( { name: "students" } )[0].options.validator
```

输出类似于以下验证对象：

```json
{
  '$jsonSchema': {
    bsonType: 'object',
    required: [ 'name', 'year', 'major', 'address' ],
    properties: {
      name: {
        bsonType: 'string',
        description: 'must be a string and is required'
      },
      year: {
        bsonType: 'int',
        minimum: 2017,
        maximum: 3017,
        description: 'must be an integer in [ 2017, 3017 ] and is required'
      },
      gpa: {
        bsonType: [ 'double' ],
        description: 'must be a double if the field exists'
      }
    }
  }
}
```

>[NOTE]
>
>**默认情况下不包括验证操作和级别**
>
>如果`validationAction`和`validationLevel`未明确设置，[`db.getCollectionInfos()`](https://www.mongodb.com/docs/manual/reference/method/db.getCollectionInfos/#mongodb-method-db.getCollectionInfos)则不在其输出中包含这些字段。

**示例**：`listCollections`语法[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/view-existing-validation-rules/#example--listcollections-syntax)

以下命令用于[`listCollections`](https://www.mongodb.com/docs/manual/reference/command/listCollections/#mongodb-dbcommand-dbcmd.listCollections)返回`students`集合的验证规则：

```shell
db.runCommand ( { listCollections: 1, filter: { name: "students" } } )
```

输出类似于以下对象：

```json
{
  cursor: {
    id: Long("0"),
    ns: 'test.$cmd.listCollections',
    firstBatch: [
      {
        name: 'students',
        type: 'collection',
        options: {
          validator: {
            '$jsonSchema': {
              bsonType: 'object',
              required: [ 'name', 'year', 'major', 'address' ],
              properties: {
                name: {
                  bsonType: 'string',
                  description: 'must be a string and is required'
                },
                gpa: {
                  bsonType: [ 'double' ],
                  description: 'must be a double if the field exists'
                }
              }
            },
            validationAction: 'warn'
          }
        },
        info: {
          readOnly: false,
          uuid: UUID("bf560865-5879-4ec1-b389-f77a03abbc5a")
        },
        idIndex: { v: 2, key: { _id: 1 }, name: '_id_' }
      }
    ]
  },
  ok: 1
}
```

**学到更多**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/view-existing-validation-rules/#learn-more)

- [查询和修改有效或无效文件](https://www.mongodb.com/docs/manual/core/schema-validation/use-json-schema-query-conditions/#std-label-use-json-schema-query-conditions)
- [选择如何处理无效文件](https://www.mongodb.com/docs/manual/core/schema-validation/handle-invalid-documents/#std-label-schema-validation-handle-invalid-docs)

参见

原文：[View Existing Validation Rules](https://www.mongodb.com/docs/manual/core/schema-validation/view-existing-validation-rules/)

译者：景圣