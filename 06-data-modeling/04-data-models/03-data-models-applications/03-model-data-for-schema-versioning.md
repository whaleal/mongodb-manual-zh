**模式版本控制的模型数据**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-data-for-schema-versioning/#model-data-for-schema-versioning)

**概述**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-data-for-schema-versioning/#overview)

数据库模式偶尔需要更新。例如，设计用于保存用户联系信息的模式可能需要更新以包含新的通信方法，因为它们变得流行，例如 Twitter 或 Skype。

您可以使用 MongoDB 的灵活模式模型，它支持同一集合中不同形状的文档，以逐步更新集合的模式。当您更新模式模型时，模式版本控制模式允许您使用版本号跟踪这些更新。您的应用程序代码可以使用版本号来识别和处理不同形状的文档，而无需停机。

**架构版本控制模式**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-data-for-schema-versioning/#schema-versioning-pattern)

要实施架构版本控制模式，`schema_version` 请在您第一次修改架构时向架构添加一个（或类似命名的）字段。使用新模式的文档应该有一个 `schema_version`of`2`以表明它们符合您的模式的第二次迭代。如果您再次更新架构，请增加`schema_version`.

您的应用程序代码可以使用文档的`schema_version`或缺少文档来有条件地处理文档。使用最新的模式在数据库中存储新信息。

**例子**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-data-for-schema-versioning/#example)

以下示例迭代 `users`集合中文档的架构。

在此架构的第一次迭代中，一条记录包括 `galactic_id`、`name`和`phone`字段：

```json
// users collection

{
    "_id": "<ObjectId>",
    "galactic_id": 123,
    "name": "Anakin Skywalker",
    "phone": "503-555-0000",
}
```

在下一次迭代中，模式被更新以包含更多不同形状的信息：

```json
// users collection

{
    "_id": "<ObjectId>",
    "galactic_id": 123,
    "name": "Darth Vader",
    "contact_method": {
        "work": "503-555-0210",
        "home": "503-555-0220",
        "twitter": "@realdarthvader",
        "skype": "AlwaysWithYou"
    },
    "schema_version": "2"
}
```

添加一个`schema_version`意味着应用程序可以识别为新模式塑造的文档并相应地处理它们。`schema_version`如果文档上不存在，应用程序仍然可以处理旧文档。

例如，考虑一个通过`galactic_id` 查找用户电话号码的应用程序。收到 a`galactic_id`后，应用程序需要查询数据库：

```shell
db.users.find( { galactic_id: 123 } );
```

从数据库返回文档后，应用程序检查文档是否有`schema_version`字段。

- 如果它没有`schema_version`字段，应用程序将返回的文档传递给一个专用函数，该函数从原始模式中呈现该 `phone`字段。
- 如果它确实有`schema_version`字段，则应用程序会检查架构版本。在此示例中，`schema_version`应用`2` 程序将返回的文档传递给呈现新字段`contact_method.work`和`contact_method.home`的 专用函数。

使用该`schema_version`字段，应用程序代码可以通过向代码添加专用处理函数来支持同一集合中的任意数量的模式迭代。

**用例**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-data-for-schema-versioning/#use-cases)

Schema Versioning 模式适用于以下任何一种情况或多种情况的组合：

- 应用程序停机不是一种选择
- 更新文档可能需要数小时、数天或数周的时间才能完成
- 不需要将文档更新到新的架构版本

架构版本控制模式可帮助您更好地决定相对于传统的表格数据库何时以及如何进行数据迁移。

 参见

原文 - [Model Data for Schema Versioning]( https://docs.mongodb.com/manual/tutorial/model-data-for-schema-versioning/ )

译者：景圣
