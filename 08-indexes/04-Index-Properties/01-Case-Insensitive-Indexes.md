## 不区分大小写的索引

不区分大小写的索引支持执行字符串比较而不考虑大小写的查询。

[`db.collection.createIndex()`](https://www.mongodb.com/docs/v7.0/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)您可以通过将参数指定`collation` 为选项来创建不区分大小写的索引 。例:

```shell
db.collection.createIndex( { "key" : 1 },
                           { collation: {
                               locale : <locale>,
                               strength : <strength>
                             }
                           } )
```

要指定区分大小写的索引的排序规则，请包括：

- `locale`：指定语言规则。有关可用区域设置的列表，请参阅 [排序规则区域设置。](https://www.mongodb.com/docs/v7.0/reference/collation-locales-defaults/#std-label-collation-languages-locales)
- `strength`：确定比较规则。值 `1`或`2`表示不区分大小写的排序规则。

有关其他排序规则字段，请参阅 [排序规则。](https://www.mongodb.com/docs/v7.0/reference/collation/#std-label-collation-document-fields)

### 行为

使用不区分大小写的索引不会影响查询的结果，但可以提高性能；有关索引成本和收益的详细讨论，请参阅 [索引。](https://www.mongodb.com/docs/v7.0/indexes/#std-label-indexes)

要使用指定排序规则的索引，查询和排序操作必须指定与索引相同的排序规则。如果集合定义了排序规则，则所有查询和索引都会继承该排序规则，除非它们显式指定不同的排序规则。

### 例子

#### 创建不区分大小写的索引

要在没有默认排序规则的集合上使用不区分大小写的索引，请创建带有排序规则的索引并将参数设置`strength` 为`1`or `2`（ 有关参数的详细说明，请参阅[排序规则](https://www.mongodb.com/docs/v7.0/reference/collation/#std-label-collation-document-fields)`strength`）。您必须在查询级别指定相同的排序规则才能使用索引级别排序规则。

以下示例创建一个没有默认排序规则的集合，然后在`type`具有不区分大小写排序规则的字段上添加索引。

```
db.createCollection("fruit")

db.fruit.createIndex( { type: 1},
                      { collation: { locale: 'en', strength: 2 } } )
```

要使用索引，查询必须指定相同的排序规则。

```shell
db.fruit.insertMany( [
   { type: "apple" },
   { type: "Apple" },
   { type: "APPLE" }
] )

db.fruit.find( { type: "apple" } ) // does not use index, finds one result

db.fruit.find( { type: "apple" } ).collation( { locale: 'en', strength: 2 } )
// uses the index, finds three results

db.fruit.find( { type: "apple" } ).collation( { locale: 'en', strength: 1 } )
// does not use the index, finds three results
```

#### 具有默认排序规则的集合上的不区分大小写的索引

当您使用默认排序规则创建集合时，您随后创建的所有索引都会继承该排序规则，除非您指定不同的排序规则。所有未指定不同排序规则的查询也会继承默认排序规则。

以下示例创建一个使用`names`默认排序规则调用的集合，然后在字段上创建索引`first_name`。

```
db.createCollection("names", { collation: { locale: 'en_US', strength: 2 } } )

db.names.createIndex( { first_name: 1 } ) // inherits the default collation
```

插入一小部分名称：

```shell
db.names.insertMany( [
   { first_name: "Betsy" },
   { first_name: "BETSY"},
   { first_name: "betsy"}
] )
```

对此集合的查询默认使用指定的排序规则，如果可能的话也使用索引.

```shell
db.names.find( { first_name: "betsy" } )
// inherits the default collation: { collation: { locale: 'en_US', strength: 2 } }
// finds three results
```

上述操作使用集合的默认排序规则并查找所有三个文档。它使用字段上的索引`first_name`以获得更好的性能。

仍然可以通过在查询中指定不同的排序规则来对此集合执行区分大小写的搜索：

```
db.names.find( { first_name: "betsy" } ).collation( { locale: 'en_US' } )
// does not use the collection's default collation, finds one result
```

上述操作仅查找一个文档，因为它使用未`strength`指定值的排序规则。它不使用集合的默认排序规则或索引。