# 查询文件

使用[`db.collection.find()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find)MongoDB Shell中的方法 来查询集合中的文档。

此页面上的示例参考了Atlas [样本数据集](https://www.mongodb.com/docs/atlas/sample-data/). 您可以创建一个免费的Atlas 集群并使用示例数据填充该集群以跟随这些示例。要了解更多信息，请参阅 [开始使用Atlas。](https://www.mongodb.com/docs/atlas/getting-started/)

## 读取集合中的所有文档

要读取集合中的所有文档，请将空文档作为查询过滤器参数传递给 find 方法。查询过滤器参数确定选择标准。

>例子:
>
>要返回`sample_mflix.movies`集合中的所有文档：
>
>```shell
>use sample_mflix
>db.movies.find()
>```
>
>这个操作相当于下面的 SQL 语句：
>
>````shell
>SELECT * FROM movies
>````

## 指定相等条件

要选择匹配相等条件的文档，请`<field>:<value>`在 [查询过滤文档。](https://www.mongodb.com/docs/manual/document/#query-filter-documents)

> 例子:
>
> 要返回集合中 `title`相等的所有电影：`Titanic``sample_mflix.movies`
>
> ```
> use sample_mflix
> db.movies.find( { "title": "Titanic" } )
> ```
>
> 该操作对应如下SQL语句：
>
> ```
> SELECT * FROM movies WHERE title = "Titanic"
> ```

## 使用查询运算符指定条件

使用[查询运算符](https://www.mongodb.com/docs/manual/reference/operator/query/#query-selectors)在一个 [查询过滤文档](https://www.mongodb.com/docs/manual/core/document/#document-query-filter) 进行更复杂的比较和评估。查询过滤器文档中的查询运算符具有以下形式：

```
{ <field1>: { <operator1>: <value1> }, ... }
```

>例子:
>
>`sample_mflix.movies`要返回集合中评级为`PG`或的所有电影`PG-13`：
>
>```
>use sample_mflix
>
>db.movies.find( { rated: { $in: [ "PG", "PG-13" ] } } )
>```
>
>该操作对应如下SQL语句:
>
>```
>SELECT * FROM movies WHERE rated in ("PG", "PG-13")
>```

>笔记:
>
>尽管您可以使用[`$or`](https://www.mongodb.com/docs/manual/reference/operator/query/or/#mongodb-query-op.-or)运营商，使用[`$in`](https://www.mongodb.com/docs/manual/reference/operator/query/in/#mongodb-query-op.-in)运营商，而不是[`$or`](https://www.mongodb.com/docs/manual/reference/operator/query/or/#mongodb-query-op.-or) 对同一字段执行相等性检查时的运算符

## 指定逻辑运算符 ( `AND`/ `OR`)

复合查询可以为集合文档中的多个字段指定条件。隐含地，逻辑`AND`连接将复合查询的子句连接起来，以便查询选择集合中匹配所有条件的文档。

>例子:
>
>要返回在墨西哥发行**且**IMDB 评分至少为 7 的电影：
>
>```
>use sample_mflix
>
>db.movies.find( { countries: "Mexico", "imdb.rating": { $gte: 7 } } )
>```

使用[`$or`](https://www.mongodb.com/docs/manual/reference/operator/query/or/#mongodb-query-op.-or)运算符指定一个复合查询，该查询将每个子句与逻辑`OR`合取符连接起来，以便查询选择集合中至少匹配一个条件的文档。

> 例子:
>
> 返回`sample_mflix.movies`2010 年发行**且** *至少*获得 5 个奖项或获得以下`genre`奖项的电影`Drama`：
>
> ```
> use sample_mflix
> 
> db.movies.find( {
>      year: 2010,
>      $or: [ { "awards.wins": { $gte: 5 } }, { genres: "Drama" } ]
> } )
> ```

## 读取行为

要了解有关阅读文档的具体行为的更多信息，请参阅[行为。](https://www.mongodb.com/docs/manual/tutorial/query-documents/#behavior)

## 其他查询教程

有关其他查询示例，请参阅：

- [查询嵌入文档](https://www.mongodb.com/docs/manual/tutorial/query-embedded-documents/)
- [查询数组](https://www.mongodb.com/docs/manual/tutorial/query-arrays/)
- [查询嵌入式文档数组](https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/)
- [要从查询返回的项目字段](https://www.mongodb.com/docs/manual/tutorial/project-fields-from-query-results/)
- [查询空字段或缺失字段](https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/)





翻译：韩鹏帅

原文：[Query Documents](https://www.mongodb.com/docs/mongodb-shell/crud/read/)
