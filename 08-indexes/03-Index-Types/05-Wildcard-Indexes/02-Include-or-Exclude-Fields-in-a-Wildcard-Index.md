## 在通配符索引中包含或排除字段

创建通配符索引时，您可以指定要在索引中包含或排除的字段。这可以让您：

- 创建仅覆盖特定字段的通配符索引。例如，如果您有多个包含多个子字段的嵌入文档，则可以创建一个索引来涵盖对嵌入文档及其子字段的查询。
- 创建省略特定字段的通配符索引。例如，如果您的集合包含从未查询过的字段，则可以从索引中省略该字段。

要在通配符索引中包含或排除字段，请在选项中指定所选字段`wildcardProjection`：

```
db.<collection>.createIndex(
   {
      "$**" : <sortOrder>
   },
   {
      "wildcardProjection" : {
         "<field1>" : < 0 | 1 >,
         "<field2>" : < 0 | 1 >,
         ...
         "<fieldN>" : < 0 | 1 >
      }
   }
)
```

在`wildcardProjection`文档中，值`0`or`1` 表示该字段是否包含在索引中或排除在索引中：

- `0`表示该字段被排除。
- `1`表示包含该字段。

### 限制

- 要使用该`wildcardProjection`选项，您的索引键必须是 `$**`。

- 通配符索引不支持在`wildcardProjection`文档中混合包含和排除语句，除非显式包含该`_id`字段。例如：

  * 以下`wildcardProjection`文档**无效，**因为它指定了字段的包含和排除：

    ```
     {
       "wildcardProjection" : {
          "attributes" : 0,
          "users" : 1
       }
    }
    ```

  * 以下`wildcardProjection`文档是**有效的**，因为尽管它指定了包含和排除，但它包含该`_id`字段：

    ```
     {
       "wildcardProjection" : {
          "attributes" : 0,
          "_id" : 1
       }
    }
    ```

### 在你开始之前

创建`products`包含以下文档的集合：

```
db.products.insertMany( [
   {
      "item": "t-shirt",
      "price": "29.99",
      "attributes": {
         "material": "cotton",
         "color": "blue",
         "size": {
            "units": "cm",
            "length": 74
         }
      }
   },
   {
      "item": "milk",
      "price": "3.99",
      "attributes": {
         "sellBy": "02-06-2023",
         "type": "oat"
      }
   },
   {
      "item": "laptop",
      "price": "339.99",
      "attributes": {
         "memory": "8GB",
         "size": {
            "units": "inches",
            "height": 10,
            "width": 15
         }
      }
   }
] )
```

每个文档都有一个`attributes`包含产品详细信息的字段。的子字段`attributes`因产品而异。

### 步骤

您可以使用该`wildcardProjection`选项来：

- [在通配符索引中包含特定字段](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/create-wildcard-index-multiple-fields/#std-label-wildcard-index-include-specific-fields)
- [从通配符索引中排除特定字段](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/create-wildcard-index-multiple-fields/#std-label-wildcard-index-exclude-specific-fields)

### 在通配符索引中包含特定字段

如果您经常查询某些文档字段，您可以在 a 中指定这些字段`wildcardProjection`来支持这些查询，而不会给索引添加不必要的膨胀。

以下操作创建一个通配符索引，其中包含`attributes.size` 和`attributes.color`字段的所有标量值（即字符串和数字）：

```
db.products.createIndex(
   {
      "$**" : 1
   },
   {
      "wildcardProjection" : {
         "attributes.size" : 1,
         "attributes.color" : 1
      }
   }
)
```

#### 结果

虽然键模式`"$**"`涵盖了文档中的所有字段，但 `wildcardProjection`字段将索引限制为仅包含的字段。

如果字段是嵌入式文档或数组（例如`attributes.size`），则通配符索引会递归到该字段并索引所有嵌入式标量字段值。

创建的索引支持对 `wildcardProjection`对象中包含的任何标量值进行查询。例如，索引支持以下查询：

```
db.products.find( { "attributes.size.height" : 10 } )
db.products.find( { "attributes.color" : "blue" } )
```

该索引**不**支持对未包含在 中的字段进行查询 `wildcardProjection`，例如此查询：

```
db.products.find ( { "item": "milk" } )
```

### 从通配符索引中排除特定字段

如果存在您很少查询的文档字段，您可以创建省略这些字段的通配符索引。

以下操作在`products`集合中的所有文档字段上创建通配符索引，但从`attributes.memory` 索引中省略该字段：

```
db.products.createIndex(
   {
      "$**" : 1
   },
   {
      "wildcardProjection" : {
         "attributes.memory" : 0
      }
   }
)
```

#### 结果

虽然键模式`"$**"`涵盖文档中的所有字段，但该 `wildcardProjection`字段不包括`attributes.memory`索引中的值。

如果字段是嵌入式文档或数组（例如`attributes.size`），则通配符索引会递归到该字段并索引所有嵌入式标量字段值。

例如，索引支持以下查询：

```
db.products.find( { "attributes.color" : "blue" } )
db.products.find( { "attributes.size.height" : 10 } )
```

该索引**不**支持 上的查询`attributes.memory`，因为索引中省略了该字段。

### 了解更多

要了解如何使用通配符投影和复合通配符索引来过滤[字段，请参阅使用`wildcardProjection`.](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/index-wildcard-compound/#std-label-wc-compound-index-wcProject)

要了解有关通配符索引的行为和用例的更多信息，请参阅：

- [`wildcard`索引选项](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#std-label-createIndex-method-wildcard-option)
- [通配符索引签名](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/reference/wildcard-projection-signature/#std-label-wildcard-projection-signature)
- [嵌入式对象和数组的通配符索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/reference/embedded-object-behavior/#std-label-wildcard-index-embedded-object-behavior)
- [通配符索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/reference/restrictions/#std-label-wildcard-index-restrictions)