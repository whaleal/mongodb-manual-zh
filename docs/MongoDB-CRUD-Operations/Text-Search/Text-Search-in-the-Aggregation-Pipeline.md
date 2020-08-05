### Text Search in the Aggregation Pipeline（聚合管道中的文本搜索）
**在本页面：**

*  [Restrictions](#Restrictions)(限制条件)<br />

*  [Text Score](#Text)(文字分数)<br />

*  [Calculate the Total Views for Articles that Contains a Word](#Calculate)(计算包含单词的文章的总浏览量)<br />

*  [Return Results Sorted by Text Search Score](#Return)(返回结果按文本搜索分数排序)<br />

*  [Match on Text Score](#Match)(文字分数匹配)<br />

*  [Specify a Language for Text Search](#Specify)(指定用于文本搜索的语言)<br />

在聚合管道中，可以在[$match](#)阶段使用[$text](#)查询运算符来进行文本搜索。

#### <span id="Restrictions">限制条件</span>

有关常规的[$text]()运算符限制，请参见[运算符限制](https://docs.mongodb.com/manual/reference/operator/query/text/#text-query-operator-behavior)。<br />此外，聚合管道中的文本搜索具有以下限制：

* 包含[$text](#)的[$match](#)阶段必须是管道中的第一阶段。<br />

* 文本运算符在阶段只能出现一次。<br />

* 文本运算符表达式不能出现在[$or](#)或[$not](#)表达式中。<br />

* 默认情况下，文本搜索不会按匹配分数的顺序返回匹配的文档。在[$sort](#)阶段使用[$meta](#)聚合表达式。

#### <span id="Text">文字分数</span>

运算符为在索引字段中包含搜索词的每个文档分配一个分数。分数表示文档与给定文本搜索查询的相关性。分数可以是[$sort](#)管道规范的一部分，也可以是投影表达式的一部分。 **{$ meta：“ textScore”}**表达式提供有关[$text](#)操作处理的信息。有关访问投影或排序分数的详细信息，请参见[$meta](#)聚合。<br />

元数据仅在包含[$text](#)操作的[$match](#)阶段之后可用。

**例子**

以下示例假定集合`articles`在字段`subject`上具有文本索引：

```shell
 db.articles.createIndex( { subject: "text" } )
```

#### <span id="Calculate">计算包含单词的文章的总浏览量</span>

以下聚合在[$match](#)阶段搜索术语蛋糕，并在[$group](#)阶段计算匹配文档的总视图。<br />

```shell
 db.articles.aggregate(
      [
        { $match: { $text: { $search: "cake" } } },
        { $group: { _id: **null**, views: { $sum: "$views" } } }
      ]
  )
```

#### <span id="Return">返回结果按文本搜索分数排序</span>

 要按文本搜索分数排序，请在[$sort](#)阶段包含一个[$meta](#)表达式。 以下 example 匹配术语`cake`或`tea`，按降序 order 中的`textScore`排序，并仅返回结果集中的`title`字段。

```shell
 db.articles.aggregate(
    [
      { $match: { $text: { $search: "cake tea" } } }, 
      { $sort: { score: { $meta: "textScore" } } }, 
      { $project: { title: 1, _id: 0 } } 
    ]
  )		
```

指定的元数据确定 sort order。对于 example，`"textScore"`元数据按降序 order 排序。有关元数据的更多信息，请参阅[$meta](#)，以及覆盖元数据的默认排序 order 的示例。

#### <span id="Match">文字分数匹配</span>

**“ textScore”**元数据可用于包含[$text](#)操作的[$match](#)阶段之后的投影，排序和条件。<br />以下 **example** 匹配术语`cake`或`tea`，投影`title`和`score`字段，然后仅返回`score`大于`1.0`的文档。

```shell
 db.articles.aggregate(
    [
    	{ $match: { $text: { $search: "cake tea" } } },
    	{ $project: { title: 1, _id: 0, score: { $meta: "textScore" } } },
    	{ $match: { score: { $gt: 1.0 } } }
    ]
 )
```

#### <span id="Specify">指定用于文本搜索的语言</span>

以下聚合在西班牙语中搜索在[$match](#)阶段中包含术语**saber**但不包含术语**claro**的文档，并在[$group](#)阶段中计算匹配文档的总视图。

```shell
 db.articles.aggregate(
    [   
    		{ $match: { $text: { $search: "saber -claro", $language: "es" } } }, 
    		{ $group: { _id: null, views: { $sum: "$views" } } } 
    ]
 )
```

​    