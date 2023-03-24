# 运行聚合管道

可以使用MongoDBShell在集合上运行聚合管道。聚合管道根据选定的管道阶段将文档转换为聚合结果。

聚合的常见用途包括：

* 按给定表达式对数据分组。
* 基于多个字段计算结果并存储这些结果 在一个新的领域。
* 筛选数据以返回与给定条件匹配的子集。
* 整理数据。

运行聚合时，MongoDB Shell将结果直接输出到 终端。

## 了解聚合语法

MongoDB聚合管道由阶段组成。 [stages](https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/#aggregation-pipeline-operator-reference) . 每个阶段在文档通过管道时转换文档。 管道阶段不需要为每个生成一个输出文档 输入文件;例如，某些阶段可以生成新文档或过滤器 文件

若要创建聚合管道，请在 MongoDB Shell：

```bash
db.<collection>.aggregate([
  {
    <$stage1>
  },
  {
    <$stage2>
  }
  ...
])
```

## 示例

本页上的示例引用Atlas示例数据集。您可以创建一个免费的Atlas集群，并使用[样例数据](https://www.mongodb.com/docs/atlas/sample-data/)填充该集群，以遵循这些示例。要了解详细信息，请参见[Atlas快速入门](https://www.mongodb.com/docs/atlas/getting-started/)。

下面的示例使用Atlas [sample_mflix](https://www.mongodb.com/docs/atlas/sample-data/sample-mflix/)示例数据集中的movies集合。

### 示例文档

movies集合中的每个文档都描述一部电影：

```bash
{

  _id: 573a1397f29313caabce8347,

  fullplot: 'In a cyberpunk vision of the future, man has developed the technology to create replicants, human clones used to serve in the colonies outside Earth but with fixed lifespans. In Los Angeles, 2019, Deckard is a Blade Runner, a cop who specializes in terminating replicants. Originally in retirement, he is forced to re-enter the force when four replicants escape from an off-world colony to Earth.',

  imdb: { rating: 8.2, votes: 419589, id: 83658 },

  year: 1982,

  plot: 'A blade runner must pursue and try to terminate four replicants who stole a ship in space and have returned to Earth to find their creator.',

  genres: [ 'Sci-Fi', 'Thriller' ],

  rated: 'R',

  metacritic: 88,

  title: 'Blade Runner',

  lastupdated: '2015-09-04 00:05:51.990000000',

  languages: [ 'English', 'German', 'Cantonese', 'Japanese', 'Hungarian' ],

  writers: [

    'Hampton Fancher (screenplay)',

    'David Webb Peoples (screenplay)',

    'Philip K. Dick (novel)'

  ],

  type: 'movie',

  tomatoes: {

    viewer: { rating: 4, numReviews: 331213, meter: 91 },

    dvd: 1997-08-27T00:00:00.000Z,

    critic: { rating: 8.5, numReviews: 102, meter: 90 },

    lastUpdated: 2015-09-12T17:48:21.000Z,

    consensus: "Misunderstood when it first hit theaters, the influence of Ridley Scott's mysterious, neo-noir Blade Runner has deepened with time. A visually remarkable, achingly human sci-fi masterpiece.",

    rotten: 10,

    production: 'Warner Bros. Pictures',

    fresh: 92

  },

  poster: 'https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SY1000_SX677_AL_.jpg',

  num_mflix_comments: 1,

  released: 1982-06-25T00:00:00.000Z,

  awards: {

    wins: 13,

    nominations: 15,

    text: 'Nominated for 2 Oscars. Another 11 wins & 15 nominations.'

  },

  countries: [ 'USA', 'Hong Kong', 'UK' ],

  cast: [

    'Harrison Ford',

    'Rutger Hauer',

    'Sean Young',

    'Edward James Olmos'

  ],

  directors: [ 'Ridley Scott' ],

  runtime: 117

}
```

本教程中聚合的文档位于sample_mflix.movies集合中。使用以下命令切换到包含此集合的数据库：

```
use sample_mflix
```

### 示例聚合管道

考虑以下管道：

```bash
db.movies.aggregate([

  // First Stage

  { $project: { _id: 0, genres: 1, imdb: 1, title: 1 } },

  // Second Stage

  { $unwind: "$genres" },

  // Third Stage

  { $group:
    { _id: "$genres",
      averageGenreRating: { $avg: "$imdb.rating" }
    }
  },

   // Fourth Stage

   { $sort: { averageGenreRating: -1 } }
] )
```

此管道分四个阶段执行聚合：

#### **第一阶段**

[$project](https://www.mongodb.com/docs/manual/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project)阶段将包含以下字段的文档传递到下一个管道阶段：

* `genres`
* `imdb`
* `title`

集合中不包含所有这些字段的文档不会传递到下一个管道阶段。

> 注：
>
> `$project`阶段指定`_id：0`表示从传递到下一阶段的文档中隐藏`_id`字段。
>
> 有关更多信息，请参见[MongoDB手册](https://www.mongodb.com/docs/manual/reference/operator/aggregation/project/#suppress-id-field-in-the-output-documents)。

$project阶段转换示例文档，并将以下输出传递到下一个管道阶段：

```bash
{

  imdb: { rating: 8.2, votes: 419589, id: 83658 },

  genres: [ 'Sci-Fi', 'Thriller' ],

  title: 'Blade Runner'

}
```

#### **第二阶段**

[$unwind](https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/#mongodb-pipeline-pipe.-unwind)阶段将genres数组中每个元素的文档传递到下一个管道阶段。

$unwind阶段从原始示例文档生成以下两个文档，然后将它们传递到下一个管道阶段：

```bash
{

  imdb: { rating: 8.2, votes: 419589, id: 83658 },

  genres: 'Sci-Fi',

  title: 'Blade Runner'

}
```

```bash
{

  imdb: { rating: 8.2, votes: 419589, id: 83658 },

  genres: 'Thriller',

  title: 'Blade Runner'

}
```

#### **第三阶段**

[$group](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group)阶段：

* 从它从前一流水线阶段接收的文档中检索不同的流派值，
* 为每个不同的流派创建一个文档，其中_id是流派名称，
* 向每个新文档添加一个字段averageGenreRating，该字段包含与该类型匹配的所有文档的平均imdb.rating，以及
* 将新文档传递到下一个管道阶段。

此阶段将类似于以下内容的文档发送到下一个管道阶段：

```bash
{ _id: 'Sport', averageGenreRating: 6.781233933161954 },

{ _id: 'History', averageGenreRating: 7.202306920762287 },

{ _id: 'Biography', averageGenreRating: 7.097142857142857 },

{ _id: 'Adventure', averageGenreRating: 6.527788649706458 },

{ _id: 'Family', averageGenreRating: 6.36096256684492 },

{ _id: 'Crime', averageGenreRating: 6.730478683620045 },

{ _id: 'Western', averageGenreRating: 6.879197080291971 },

{ _id: 'Fantasy', averageGenreRating: 6.42495652173913 },

{ _id: 'Talk-Show', averageGenreRating: 7 },

{ _id: 'Documentary', averageGenreRating: 7.365266635205286 },

{ _id: 'War', averageGenreRating: 7.183944374209861 },

{ _id: 'Short', averageGenreRating: 7.355813953488372 },

{ _id: 'Horror', averageGenreRating: 5.84110718492344 },

{ _id: 'Film-Noir', averageGenreRating: 7.503809523809523 },

{ _id: 'News', averageGenreRating: 7.254901960784314 },

{ _id: 'Thriller', averageGenreRating: 6.322121555303888 },

{ _id: 'Action', averageGenreRating: 6.3774842271293375 },

{ _id: 'Music', averageGenreRating: 6.923452380952381 },

{ _id: 'Animation', averageGenreRating: 6.917993795243019 },

{ _id: 'Drama', averageGenreRating: 6.830528688822631 }
```

#### **第四阶段**

[$sort](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort)阶段根据averageGenreRating字段的值以降序对从上一阶段接收的文档进行排序。

当您运行[示例管道](https://www.mongodb.com/docs/mongodb-shell/run-agg-pipelines/#std-label-mdb-shell-example-agg-pipeline)时，MongoDBShell将类似于以下内容的文档打印到终端：

```bash
[
  { _id: 'Film-Noir', averageGenreRating: 7.503809523809523 },
  { _id: 'Documentary', averageGenreRating: 7.365266635205286 },
  { _id: 'Short', averageGenreRating: 7.355813953488372 },
  { _id: 'News', averageGenreRating: 7.254901960784314 },
  { _id: 'History', averageGenreRating: 7.202306920762287 },
  { _id: 'War', averageGenreRating: 7.183944374209861 },
  { _id: 'Biography', averageGenreRating: 7.097142857142857 },
  { _id: 'Talk-Show', averageGenreRating: 7 },
  { _id: 'Music', averageGenreRating: 6.923452380952381 },
  { _id: 'Animation', averageGenreRating: 6.917993795243019 },
  { _id: 'Western', averageGenreRating: 6.879197080291971 },
  { _id: 'Drama', averageGenreRating: 6.830528688822631 },
  { _id: 'Sport', averageGenreRating: 6.781233933161954 },
  { _id: 'Crime', averageGenreRating: 6.730478683620045 },
  { _id: 'Musical', averageGenreRating: 6.696913580246913 },
  { _id: 'Romance', averageGenreRating: 6.695711554220159 },
  { _id: 'Mystery', averageGenreRating: 6.563317384370015 },
  { _id: 'Adventure', averageGenreRating: 6.527788649706458 },
  { _id: 'Comedy', averageGenreRating: 6.479626461362988 },
  { _id: 'Fantasy', averageGenreRating: 6.42495652173913 }
]
```

>另见：
>
>* 要了解有关可用聚集阶段的详细信息，请参阅[聚集管道阶段](https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/)。
>* 若要了解有关可在阶段内使用的可用聚合运算符的详细信息，请参阅[聚合管道运算符](https://www.mongodb.com/docs/manual/reference/operator/aggregation/)。





翻译：韩鹏帅

原文：[Run Aggregation Pipelines](https://www.mongodb.com/docs/mongodb-shell/run-agg-pipelines/)