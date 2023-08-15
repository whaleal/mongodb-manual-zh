## 嵌入式对象和数组的通配符索引

通配符索引在索引嵌入对象和数组字段时具有特定行为：

- 如果该字段是一个对象，则通配符索引会下降到该对象并对其内容进行索引。通配符索引继续下降到它遇到的任何其他嵌入文档。
- 如果字段是数组，则通配符索引遍历数组并对每个元素进行索引：
  - 如果元素是对象，则通配符索引下降到对象中以索引其内容。
  - 如果元素是数组（即直接嵌入到父数组中的数组），则通配符索引不会遍历嵌入的数组，而是将整个数组索引为单个*值*。
- 对于所有其他字段，索引存储**原始值**。原始值是非对象、非数组值。

通配符索引继续遍历任何附加的嵌入对象或数组，直到达到原始值。然后，它对原始值以及该字段的完整路径进行索引。

### 嵌入对象的通配符索引

当通配符索引遇到嵌入对象时，它会深入到该对象并对其内容进行索引。例如，考虑这个文档：

```
db.users.insertOne( {
   account: {
      username: "SuperAdmin01",
      contact: {
         phone: "123-456-7890",
         email: "xyz@example.com"
      },
      access: {
         group: "admin"
      }
   }
} )
```

包含字段的通配符索引`account`下降到 `account`对象中以遍历并索引其内容:

- 对于本身就是一个对象的每个子字段（例如， `account.contact`and `account.access`），索引会下降到该对象并记录其内容。
- 对于所有其他子字段，索引将原始值记录到索引中。

给定示例文档，通配符索引将以下记录添加到索引中：

- `"account.username" : "SuperAdmin01"`
- `"account.contact.phone" : "123-456-7890"`
- `"account.contact.email" : "xyz@example.com"`
- `"account.access.group" : "admin"`

### 数组上的通配符索引

当通配符索引遇到数组时，它会遍历数组以索引其元素。如果数组元素本身是一个数组（嵌入式数组），则索引将整个*嵌入式*数组记录为值，而不是遍历其内容。

例如，考虑这个文档：

```
 db.fleet.insertOne( {
    "ship": {
       "coordinates" : [
          [-5, 10],
          [-7, 8]
       ],
       "type": "Cargo Ship",
       "captains": [
          {
             "name": "Francis Drake",
             "crew": [ "first mate", "carpenter" ]
          }
       ]
    }
} )
```

包含字段的通配符索引`ship`下降到对象中以遍历并索引其内容：

- 对于数组中的每个元素：
  - 如果元素本身是一个数组（如在嵌入数组中），则索引将整个*数组*记录为一个值。
  - 如果元素是对象，则索引下降到对象中以遍历并索引其内容。
  - 如果元素是原始值，则索引记录该值。
- 对于非数组、非对象字段，索引将原始值记录到索引中。

给定示例文档，通配符索引将以下记录添加到索引中：

- `"ship.coordinates" : [-5, 10]`
- `"ship.coordinates" : [-7, 8]`
- `"ship.type" : "Cargo Ship"`
- `"ship.captains.name" : "Francis Drake"`
- `"ship.captains.crew" : "first mate"`
- `"ship.captains.crew" : "carpenter"`

### 使用显式数组索引的查询

通配符索引在索引期间不会记录数组中任何给定元素的数组位置。但是，MongoDB 仍可能使用通配符索引来完成包含具有一个或多个显式数组索引的字段路径的查询。

例如，考虑这个文档：

```
 db.fleet.insertOne( {
    "ship": {
       "coordinates" : [
          [-5, 10],
          [-7, 8]
       ],
       "type": "Cargo Ship",
       "captains": [
          {
             "name": "Francis Drake",
             "crew": [ "first mate", "carpenter" ]
          }
       ]
    }
} )
```

创建包含以下字段的通配符索引`ship`：

```
db.fleet.createIndex( { "ship.$**": 1 } )
```

索引记录`ship.coordinates`但`ship.captains`不包括每个元素的数组位置。将元素记录到索引中时，通配符索引会忽略数组元素位置。但是，通配符索引仍然可以支持包含显式数组索引的查询。

MongoDB 可以使用通配符索引来完成这个查询：

```
db.fleet.find( { "ship.captains.0.name": "Francis Drake" } )
```

查询返回示例文档：

```
[
  {
    _id: ObjectId("6350537db1fac2ee2e957efc"),
    ship: {
      coordinates: [ [ -5, 10 ], [ -7, 8 ] ],
      type: 'Cargo Ship',
      captains: [
        { name: 'Francis Drake', crew: [ 'first mate', 'carpenter' ] }
      ]
    }
  }
]
```

MongoDB**无法**使用通配符索引来完成此查询：

```
db.fleet.find( { "ship.coordinates.0.1": 10 } )
```

该`ship.coordinates`字段包含嵌入数组。通配符索引不记录嵌入数组的各个值。相反，它们记录整个嵌入数组。因此，通配符索引无法支持嵌入数组值的匹配，并且 MongoDB 通过集合扫描来完成查询。

#### 数组索引限制

如果路径包含 8 个或更少的显式数组索引，MongoDB 只能使用通配符索引来满足查询中的给定字段路径。如果字段路径包含超过 8 个显式索引，为了完成查询，MongoDB 要么：

- 选择另一个符合条件的索引。
- 执行集合扫描。

通配符索引本身在索引文档时对其遍历文档的深度没有限制。该限制仅适用于显式指定确切数组索引的查询。

### 了解更多

- [BSON深度限制](https://www.mongodb.com/docs/v7.0/reference/limits/#std-label-limit-nested-depth)
- [点符号](https://www.mongodb.com/docs/v7.0/core/document/#std-label-document-dot-notation)
- [通配符索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-wildcard/reference/restrictions/#std-label-wildcard-index-restrictions)

