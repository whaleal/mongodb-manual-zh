# 入门指南

本教程将引导您将测试数据插入到MongoDB数据库中，并使用文档的嵌入式web shell查询数据。您不需要部署或安装MongoDB来完成本教程。

本教程中的示例使用了 [示例 Mflix 数据集](https://www.mongodb.com/docs/atlas/sample-data/sample-mflix/)，这是 MongoDB 云托管服务中包含的示例数据的一部分， [MongoDB Atlas](https://www.mongodb.com/cloud/atlas?tck=docs_server). Atlas 不需要安装，并提供免费套餐以供入门。完成本教程后，您可以使用 Atlas 探索其他示例数据或托管您自己的数据。

<iframe class="mws-root" allowfullscreen="" sandbox="allow-scripts allow-same-origin" width="100%" height="320" src="https://mws.mongodb.com/?version=4.2" style="box-sizing: border-box; border: 0px;"></iframe>

单击shell内部进行连接。连接之后，您可以在上面的shell中运行示例。

## 切换数据库

在[shell](https://www.mongodb.com/docs/v6.0/tutorial/getting-started/#std-label-mongo-web-shell)中,`db`指的是当前的数据库。键入`db`以显示当前数据库。

```html
db
```

该操作应该返回`test`，这是默认的数据库。

 要切换数据库，输入`use <db>`。例如，切换到`examples`数据库:

```html
use examples
```

 切换前不需要创建数据库。MongoDB在第一次在该数据库中存储数据时会自动创建数据库(例如在数据库中创建第一个集合)。

要验证数据库现在是`examples`在[shell](https://www.mongodb.com/docs/v6.0/tutorial/getting-started/#std-label-mongo-web-shell)上执行`db`:

```
db
```

 要在数据库中创建一个集合，请参见下一个tab。

## 填充一个集合(insert)

MongoDB 将文档存储在[集合(collections)](https://www.mongodb.com/docs/v6.0/core/databases-and-collections/)中。集合类似于关系数据库中的表。如果集合不存在，MongoDB 会在首次为该集合存储数据时创建该集合。

下面的示例使用[`db.collection.insertMany()`](https://www.mongodb.com/docs/v6.0/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany)方法将新文档插入到`movies`集合中。可以将示例复制并粘贴到shell上。

```javascript
db.movies.insertMany([
   {
      title: 'Titanic',
      year: 1997,
      genres: [ 'Drama', 'Romance' ],
      rated: 'PG-13',
      languages: [ 'English', 'French', 'German', 'Swedish', 'Italian', 'Russian' ],
      released: ISODate("1997-12-19T00:00:00.000Z"),
      awards: {
         wins: 127,
         nominations: 63,
         text: 'Won 11 Oscars. Another 116 wins & 63 nominations.'
      },
      cast: [ 'Leonardo DiCaprio', 'Kate Winslet', 'Billy Zane', 'Kathy Bates' ],
      directors: [ 'James Cameron' ]
   },
   {
      title: 'The Dark Knight',
      year: 2008,
      genres: [ 'Action', 'Crime', 'Drama' ],
      rated: 'PG-13',
      languages: [ 'English', 'Mandarin' ],
      released: ISODate("2008-07-18T00:00:00.000Z"),
      awards: {
         wins: 144,
         nominations: 106,
         text: 'Won 2 Oscars. Another 142 wins & 106 nominations.'
      },
      cast: [ 'Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine' ],
      directors: [ 'Christopher Nolan' ]
   },
   {
      title: 'Spirited Away',
      year: 2001,
      genres: [ 'Animation', 'Adventure', 'Family' ],
      rated: 'PG',
      languages: [ 'Japanese' ],
      released: ISODate("2003-03-28T00:00:00.000Z"),
      awards: {
         wins: 52,
         nominations: 22,
         text: 'Won 1 Oscar. Another 51 wins & 22 nominations.'
      },
      cast: [ 'Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki', 'Takashi Naitè' ],
      directors: [ 'Hayao Miyazaki' ]
   },
   {
      title: 'Casablanca',
      genres: [ 'Drama', 'Romance', 'War' ],
      rated: 'PG',
      cast: [ 'Humphrey Bogart', 'Ingrid Bergman', 'Paul Henreid', 'Claude Rains' ],
      languages: [ 'English', 'French', 'German', 'Italian' ],
      released: ISODate("1943-01-23T00:00:00.000Z"),
      directors: [ 'Michael Curtiz' ],
      awards: {
         wins: 9,
         nominations: 6,
         text: 'Won 3 Oscars. Another 6 wins & 6 nominations.'
      },
      lastupdated: '2015-09-04 00:22:54.600000000',
      year: 1942
   }
])
```

该操作返回一个包含确认指示符的文档和一个包含每个成功插入文档的数组的 `_id`。

要验证插入，您可以查询集合（请参阅下一个tab）。

## 选择所有集合

 要从集合中选择文档，可以使用[`db.collection.find()`](https://www.mongodb.com/docs/v6.0/reference/method/db.collection.find/#mongodb-method-db.collection.find)方法。若要选择集合中的所有文档，请将一个空文档作为[query filter document](https://www.mongodb.com/docs/v6.0/core/document/#std-label-document-query-filter) 传递给该方法。

 在`shell`中 ，复制并粘贴以下内容以返回`movies`集合中的所有文档。

```javascript
db.movies.find( { } )
```

## 使用比较操作符过滤数据

对于相等匹配(<field> = <value>)，在 [query filter document](https://www.mongodb.com/docs/v6.0/core/document/#std-label-document-query-filter) 文档中指定<field>: <value>并传递给[`db.collection.find()`](https://www.mongodb.com/docs/v6.0/reference/method/db.collection.find/#mongodb-method-db.collection.find)方法。

```javascript
db.movies.find( { "directors": "Christopher Nolan" } );
```

 可以使用[比较运算符](https://www.mongodb.com/docs/v6.0/reference/operator/query-comparison/#std-label-query-selectors-comparison)来执行更高级的查询:

-  运行以下查询返回`2000`年之前上映的电影:

```javascript
db.movies.find( { "released": { $lt: ISODate("2000-01-01") } } );
```

-  运行以下查询以返回获得`100`个以上奖项的电影：

```javascript
db.movies.find( { "awards.wins": { $gt: 100 } } );
```

- 运行以下查询返回`languages`数组中包含 `Japanese` or `Mandarin`的电影:

```javascript
db.movies.find( { "languages": { $in: [ "Japanese", "Mandarin" ] } } )
```



```javascript
Tip:
	See also:
	Query and Projection Operators(https://www.mongodb.com/docs/v6.0/reference/operator/query/#std-label-query-projection-operators-top)
```

##  

## 指定返回字段(Projection)

要指定要返回的字段，请将投影文档传递给该[`db.collection.find(<query document>,<projections document>)`](https://www.mongodb.com/docs/v6.0/reference/method/db.collection.find/#mongodb-method-db.collection.find) 方法。在`projection`文档中，详细说明：

- ` <field>: 1`在返回的文档中包含一个字段
- ` <field>: 0`排除返回文档中的字段

在`shell`中， 运行以下查询，从`movies`集合中的所有文档中返回`id`, `title`, `directors`, 和 `year`字段:

```javascript
db.movies.find( { }, { "title": 1, "directors": 1, "year": 1 } );
```

不必指定`_id`字段来返回该字段。 默认情况下返回。 若要排除该字段，请在`projection`文档中将其设置为`0`。例如，运行以下查询只返回`title`和匹配文档中的`genres`字段:

```javascript
db.movies.find( { }, { "_id": 0, "title": 1, "genres": 1 } );
```



## 聚合数据（[`$group`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group)）

可以使用聚合将来自多个文档的值分组在一起并返回单个结果。 MongoDB中的聚合是通过[`aggregation pipeline`](https://www.mongodb.com/docs/v6.0/core/aggregation-pipeline/#std-label-aggregation-pipeline)执行的。

虽然 [`find()`](https://www.mongodb.com/docs/v6.0/reference/method/db.collection.find/#mongodb-method-db.collection.find) 操作对于数据检索很有用， 聚合管道允许您操作数据、执行计算和编写比简单的[`CRUD operations`](https://www.mongodb.com/docs/v6.0/crud/#std-label-crud)操作更具表现力的查询。

在`shell`中， 运行以下聚合管道来计算每个`genre`值的出现次数:

```javascript
db.movies.aggregate( [
   { $unwind: "$genres" },
   {
     $group: {
       _id: "$genres",
       genreCount: { $count: { } }
     }
   },
   { $sort: { "genreCount": -1 } }
] )
```

`pipeline`使用:

- [`$unwind`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/unwind/#mongodb-pipeline-pipe.-unwind) 为`genres`数组中的每个元素输出一个文档。
- [`$group`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group)和[`$count`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/count-accumulator/#mongodb-group-grp.-count)累加器来计算每 出现的次数`genre`。该值存储在`genreCount`字段中。
- [`$sort`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort)按`genreCount`字段降序对结果文档进行排序。



## 下一步

###  设置自己的部署

 要设置自己的部署:

| 部署                            | 说明                                                         |
| :------------------------------ | ------------------------------------------------------------ |
| MongoDB Atlas Free Tier Cluster | MongoDB Atlas是一个快速，简单，免费的方式开始与MongoDB。要了解更多，请参见 Atlas入门 教程。 |
| MongoDB本地安装                 | 有关在本地安装MongoDB的详细信息，请参见[安装MongoDB](https://www.mongodb.com/docs/v6.0/installation/#std-label-tutorial-installation)。 |

###  其他案例

有关其他示例，包括MongoDB驱动程序特定的示例(Python, Java, Node.js等)，请参见:

| 查询文档示例 | [Query Documents](https://www.mongodb.com/docs/v6.0/tutorial/query-documents/) 、[Query on Embedded/Nested Documents](https://www.mongodb.com/docs/v6.0/tutorial/query-embedded-documents/) 、[Query an Array](https://www.mongodb.com/docs/v6.0/tutorial/query-arrays/) 、[Query an Array of Embedded Documents](https://www.mongodb.com/docs/v6.0/tutorial/query-array-of-documents/) 、[Project Fields to Return from Query](https://www.mongodb.com/docs/v6.0/tutorial/project-fields-from-query-results/) 、[Query for Null or Missing Fields](https://www.mongodb.com/docs/v6.0/tutorial/query-for-null-fields/) |
| :----------: | ------------------------------------------------------------ |
| 更新文档示例 | [Update Documents](https://www.mongodb.com/docs/v6.0/tutorial/update-documents/) |
| 删除文档示例 | [Delete Documents](https://www.mongodb.com/docs/v6.0/tutorial/remove-documents/) |

### 额外的Topics

| Introduction                                                 | Developers                                                   | Administrators                                               | Reference                                                    |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| [Introduction to MongoDB](https://www.mongodb.com/docs/v6.0/introduction/)[Installation Guides](https://www.mongodb.com/docs/v6.0/installation/)[Databases and Collections](https://www.mongodb.com/docs/v6.0/core/databases-and-collections/)[Documents](https://www.mongodb.com/docs/v6.0/core/document/) | [CRUD Operations](https://www.mongodb.com/docs/v6.0/crud/)[Aggregation](https://www.mongodb.com/docs/v6.0/aggregation/)[SQL to MongoDB](https://www.mongodb.com/docs/v6.0/reference/sql-comparison/)[Indexes](https://www.mongodb.com/docs/v6.0/indexes/) | [Production Notes](https://www.mongodb.com/docs/v6.0/administration/production-notes/)[Replica Sets](https://www.mongodb.com/docs/v6.0/replication/)[Sharded Clusters](https://www.mongodb.com/docs/v6.0/sharding/)[MongoDB Security](https://www.mongodb.com/docs/v6.0/security/) | [Shell Methods](https://www.mongodb.com/docs/v6.0/reference/method/)[Query Operators](https://www.mongodb.com/docs/v6.0/reference/operator/)[Reference](https://www.mongodb.com/docs/v6.0/reference/)[Glossary](https://www.mongodb.com/docs/v6.0/reference/glossary/) |



原文链接：https://www.mongodb.com/docs/v6.0/tutorial/getting-started/

译者：杨帅


 

