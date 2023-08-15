## 在所有字段上创建通配符索引

您可以创建支持对所有可能的文档字段进行查询的通配符索引。通配符索引支持对任意或未知字段名称的查询。

要在所有字段（不包括 ）上创建通配符索引`_id`，请使用通配符说明符 ( `$**`) 作为索引键：

```
db.<collection>.createIndex( { "$**": <sortOrder> } )
```

### 关于此任务

仅当您要索引的字段未知或可能更改时才使用通配符索引。通配符索引在特定字段上的性能不如目标索引。如果您的集合包含阻止目标索引的任意字段名称，请考虑重新建模您的架构以具有一致的字段名称。要了解有关目标索引的更多信息，请参阅 [创建索引以支持您的查询。](https://www.mongodb.com/docs/v7.0/tutorial/create-indexes-to-support-queries/#std-label-create-indexes-to-support-queries)

### 在你开始之前

创建`artwork`包含以下文档的集合：

```
db.artwork.insertMany( [
   {
      "name": "The Scream",
      "artist": "Edvard Munch",
      "style": "modern",
      "themes": [ "humanity", "horror" ]
   },
   {
      "name": "Acrobats",
      "artist": {
         "name": "Raoul Dufy",
         "nationality": "French",
         "yearBorn": 1877
      },
      "originalTitle": "Les acrobates",
      "dimensions": [ 65, 49 ]
   },
   {
      "name": "The Thinker",
      "type": "sculpture",
      "materials": [ "bronze" ],
      "year": 1904
   }
] )
```

每个文档都包含有关艺术品的详细信息。文档之间的字段名称有所不同，具体取决于有关该作品的可用信息。

### 步骤

以下操作在`artwork`集合中的所有文档字段（不包括`_id`）上创建通配符索引：

```
db.artwork.createIndex( { "$**" : 1 } )
```

### 结果

该索引支持对集合中任意字段的单字段查询。如果文档包含嵌入文档或数组，则通配符索引会遍历文档或数组并存储文档或数组中所有字段的值。

例如，索引支持以下查询：

询问：

```
db.artwork.find( { "style": "modern" } )
```

输出：

```
[
   {
      _id: ObjectId("6352c401b1fac2ee2e957f09"),
      name: 'The Scream',
      artist: 'Edvard Munch',
      style: 'modern',
      themes: [ 'humanity', 'horror' ]
   }
]
```

询问：

```
db.artwork.find( { "artist.nationality": "French" } )
```

输出：

```
[
   {
      _id: ObjectId("6352c525b1fac2ee2e957f0d"),
      name: 'Acrobats',
      artist: { name: 'Raoul Dufy', nationality: 'French', yearBorn: 1877 },
      originalTitle: 'Les acrobates',
      dimensions: [ 65, 49 ]
   }
]
```

询问：

```
db.artwork.find( { "materials": "bronze" } )
```

输出：

```
[
   {
      _id: ObjectId("6352c387b1fac2ee2e957f08"),
      name: 'The Thinker',
      type: 'sculpture',
      materials: [ 'bronze' ],
      year: 1904
   }
]
```

### 了解更多

要了解如何创建投影要覆盖的特定字段的通配符索引，请参阅以下页面：

- [过滤字段`wildcardProjection`](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/index-wildcard-compound/#std-label-wc-compound-index-wcProject)
- [在通配符索引中包含或排除字段](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/create-wildcard-index-multiple-fields/#std-label-create-wildcard-index-multiple-fields)

要了解有关通配符索引行为的更多信息，请参阅：

- [嵌入式对象和数组的通配符索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/reference/embedded-object-behavior/#std-label-wildcard-index-embedded-object-behavior)
- [通配符索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/reference/restrictions/#std-label-wildcard-index-restrictions)

