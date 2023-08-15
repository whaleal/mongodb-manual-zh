## 二维索引内部结构

[本文档解释了二维索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2d/#std-label-2d-index)的内部结构。本材料对于正常操作或应用程序开发不是必需的，但对于故障排除和进一步理解可能有用。

### Geohash 值

当您在包含 [旧坐标对的](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-legacy-coordinate-pairs)字段上创建地理空间索引时，MongoDB 会计算指定[位置范围](https://www.mongodb.com/docs/v7.0/tutorial/build-a-2d-index/#std-label-geospatial-indexes-range)内坐标对的[geohash](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-term-geohash)值，然后对 geohash 值建立索引。

为了计算 geohash 值，MongoDB 递归地将二维地图划分为象限。然后，它为每个象限分配一个两位值。例如，四个象限的两位表示为：

```
01  11

00  10
```

这些两位值（`00`、`01`、`10`和`11`）代表每个象限以及每个象限内的所有点。每个象限都有一个对应的geohash值：

| 象限   | 地理哈希 |
| :----- | :------- |
| 左下方 | `00`     |
| 左上方 | `01`     |
| 右下角 | `10`     |
| 右上   | `11`     |

为了提供额外的精度，MongoDB 可以将每个象限划分为子象限。每个子象限都有包含象限的 geohash 值与子象限的值连接。例如，右上象限的 geohash 为`11`，子象限的 geohash 为（从左上角顺时针方向）：

- `1101`
- `1111`
- `1110`
- `1100`

### 二维索引的多位置文档

虽然 2d 索引不支持文档中多个位置字段，但您可以使用[多键索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/#std-label-index-type-multi-key)来索引单个文档中的多个坐标对。例如，在以下文档中，该`locs`字段保存一个坐标对数组：

```
db.places.insertOne( {
   locs : [
      [ 55.5 , 42.3 ],
      [ -74 , 44.74 ],
      { long : 55.5 , lat : 42.3 }
   ]
} )
```

数组中的值`locs`可以是：

- 数组，如`[ 55.5, 42.3 ]`.
- 嵌入文档，如`{ long : 55.5 , lat : 42.3 }`.

要索引数组中的所有坐标对`locs`，请在字段上创建 2d 索引`locs`：

```
db.places.createIndex( { "locs": "2d" } )
```

### 嵌入式多位置文档

您可以将位置数据存储为嵌入文档内的字段。例如，您可以拥有一组嵌入文档，其中每个嵌入文档都有一个包含位置数据的字段。

在以下文档中，该`addresses`字段是嵌入文档的数组。嵌入文档包含一个`loc`字段，它是一个坐标对：

```
db.records.insertOne( {
   name : "John Smith",
   addresses : [
      {
         context : "home" ,
         loc : [ 55.5, 42.3 ]
      },
      {
         context : "work",
         loc : [ -74 , 44.74 ]
      }
   ]
} )
```

`loc`要索引数组中的所有值`addresses`，请在字段上创建 2d 索引`addresses.loc`：

```
db.records.createIndex( { "addresses.loc": "2d" } )
```

### 了解更多

- [旧坐标对](https://www.mongodb.com/docs/v7.0/geospatial-queries/#std-label-geospatial-legacy)
- [查询 2dsphere 索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/2dsphere/query/#std-label-2dsphere-index-query)
- [多键索引](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-multikey/#std-label-index-type-multikey)
- [地理空间索引限制](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/geospatial/restrictions/#std-label-geospatial-restrictions)