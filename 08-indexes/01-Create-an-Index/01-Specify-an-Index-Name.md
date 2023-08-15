## 指定索引名称

创建索引时，您可以为索引指定自定义名称。为索引命名有助于区分集合中的不同索引。 例如，如果您的索引具有不同的名称，您可以更轻松地在查询计划的[解释结果](https://www.mongodb.com/docs/v7.0/reference/explain-results/#std-label-explain-results)中识别查询使用的索引。

要指定索引名称，请`name`在创建索引时包含以下选项：

```
db.<collection>.createIndex(
   { <field>: <value> },
   { name: "<indexName>" }
)
```

### 关于此任务

在指定索引名称之前，请考虑以下事项：

- 索引名称必须是唯一的。使用现有索引的名称创建索引会返回错误。
- 您无法重命名现有索引。相反，您必须[删除](https://www.mongodb.com/docs/v7.0/core/indexes/drop-index/#std-label-drop-an-index)索引并使用新名称重新创建索引。

### 默认索引名称

如果创建索引时不指定名称，系统将通过将每个索引键字段和值用下划线连接来生成名称。例如：

| 索引                                                   | 默认名称                             |
| :----------------------------------------------------- | :----------------------------------- |
| `{ score : 1 }`                                        | `score_1`                            |
| `{ content : "text", "description.tags": "text" }`     | `content_text_description.tags_text` |
| `{ category : 1, locale : "2dsphere"}`                 | `category_1_locale_2dsphere`         |
| `{ "fieldA" : 1, "fieldB" : "hashed", "fieldC" : -1 }` | `fieldA_1_fieldB_hashed_fieldC_-1`   |

### 步骤

集合`blog`包含有关博客文章和用户交互的数据。

`content`在、`users.comments`和 字段上创建文本索引`users.profiles`。将索引设置`name`为 `InteractionsTextIndex`：

```
db.blog.createIndex(
   {
     content: "text",
     "users.comments": "text",
     "users.profiles": "text"
   },
   {
     name: "InteractionsTextIndex"
   }
)
```

### 结果

创建索引后，可以使用以下 [`db.collection.getIndexes()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.getIndexes/#mongodb-method-db.collection.getIndexes)方法获取索引名称：

```
db.blog.getIndexes()
```

输出：

```
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  {
    v: 2,
    key: { _fts: 'text', _ftsx: 1 },
    name: 'InteractionsTextIndex',
    weights: { content: 1, 'users.comments': 1, 'users.profiles': 1 },
    default_language: 'english',
    language_override: 'language',
    textIndexVersion: 3
  }
]
```

### 了解更多

- 要了解如何创建索引，请参阅[创建索引。](https://www.mongodb.com/docs/v7.0/core/indexes/create-index/#std-label-manual-create-an-index)
- 有关索引属性的更多信息，请参阅[索引属性。](https://www.mongodb.com/docs/v7.0/core/indexes/index-properties/#std-label-index-properties)

