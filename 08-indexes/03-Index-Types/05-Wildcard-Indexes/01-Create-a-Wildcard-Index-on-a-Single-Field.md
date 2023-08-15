### 在单个字段上创建通配符索引

 单个字段上的通配符索引支持对索引字段的任何子字段进行查询。使用通配符索引来支持对您事先不知道或文档之间有所不同的字段名称的查询。

要在单个字段上创建通配符索引，请使用该 方法并在索引键中[`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)包含通配符说明符 ( )：`$**`

```
db.collection.createIndex( { "<field>.$**": <sortOrder> } )
```

### 关于此任务

仅当您要索引的字段未知或可能更改时才使用通配符索引。通配符索引在特定字段上的性能不如目标索引。如果您的集合包含阻止目标索引的任意字段名称，请考虑重新建模您的架构以具有一致的字段名称。要了解有关目标索引的更多信息，请参阅 [创建索引以支持您的查询。](https://www.mongodb.com/docs/v7.0/tutorial/create-indexes-to-support-queries/#std-label-create-indexes-to-support-queries)

### 在你开始之前

创建`products`包含以下文档的集合：

```
db.products.insertMany( [
   {
      "product_name" : "Spy Coat",
      "attributes" : {
         "material" : [ "Tweed", "Wool", "Leather" ],
         "size" : {
            "length" : 72,
            "units" : "inches"
         }
      }
   },
   {
      "product_name" : "Spy Pen",
      "attributes" : {
         "colors" : [ "Blue", "Black" ],
         "secret_feature" : {
            "name" : "laser",
            "power" : "1000",
            "units" : "watts",
         }
      }
   }
] )
```

### 步骤

以下操作在`attributes` 字段上创建通配符索引：

```
db.products.createIndex( { "attributes.$**" : 1 } )
```

### 结果

通配符索引支持`attributes`对其内嵌字段进行单字段查询。例如，索引支持以下查询：

- 询问：

  ```
  db.products.find( { "attributes.size.length" : { $gt : 60 } } )
  ```

  输出：

  ```
  [
    {
      _id: ObjectId("63472196b1fac2ee2e957ef6"),
      product_name: 'Spy Coat',
      attributes: {
        material: [ 'Tweed', 'Wool', 'Leather' ],
        size: { length: 72, units: 'inches' }
      }
    }
  ]
  ```

  询问：

  ```
  db.products.find( { "attributes.material" : "Leather" } )
  ```

  输出：

  ```
  [
    {
      _id: ObjectId("63472196b1fac2ee2e957ef6"),
      product_name: 'Spy Coat',
      attributes: {
        material: [ 'Tweed', 'Wool', 'Leather' ],
        size: { length: 72, units: 'inches' }
      }
    }
  ]
  
  ```

  询问：

  ```
  db.products.find(
     { "attributes.secret_feature.name" : "laser" },
     { "_id": 0, "product_name": 1, "attributes.colors": 1 }
  )
  
  
  ```

  输出：

  ```
  [
    {
      product_name: 'Spy Pen',
      attributes: { colors: [ 'Blue', 'Black' ] }
    }
  ]
  ```

当索引字段包含嵌入对象（例如`attributes.secret_feature`）时，通配符索引具有特定行为。有关详细信息，请参阅[嵌入式对象和数组的通配符索引。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/reference/embedded-object-behavior/#std-label-wildcard-index-embedded-object-behavior)

## 了解更多

要了解有关通配符索引的行为和用例的更多信息，请参阅：

- [在所有字段上创建通配符索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/create-wildcard-index-all-fields/#std-label-create-wildcard-index-all-fields)
- [在通配符索引中包含或排除字段](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/create-wildcard-index-multiple-fields/#std-label-create-wildcard-index-multiple-fields)
- [复合通配符索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/index-wildcard-compound/#std-label-wildcard-index-compound)
- [通配符索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/reference/restrictions/#std-label-wildcard-index-restrictions)