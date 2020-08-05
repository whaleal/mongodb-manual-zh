
### Text Search Operators（文本搜索运算符）
**在本页面**

*   [Query Framework](#query)(查询框架)<br />

*  [Aggregation Framework](#aggregation)(聚合框架)<br />

> 注意**<br />**视图不支持文本搜索。<br />

#### <span id="query">查询框架</span>

使用[$text](#)查询运算符可对具有文本索引的集合执行文本搜索。<br />$ text将使用空格和大多数标点符号作为分隔符来标记搜索字符串，并对搜索字符串中的所有此类标记执行逻辑或。<br />例如，您可以使用以下查询从列表“ coffee”，“ shop”和“ java”中查找包含任何术语的所有商店：

```shell
  db.stores.find( { $text: { $search: "java coffee shop" } } )
```

使用[$meta](#)查询运算符可获取并匹配每个匹配文档的相关性得分。 例如，要按相关性顺序订购咖啡店列表，请运行以下命令：

```shell
  db.stores.find(
  		{ $text: { $search: "coffee shop cake" } },
  		{ score: { $meta: "textScore" } }
  ).sort( { score: { $meta: "textScore" } } )
```

有关[$text](#)和[$meta operators](#) 的更多信息，包括限制和行为，请参阅：

 - [$text 参考页面](https://docs.mongodb.com/manual/reference/operator/query/text/#op._S_text)
 - [$text 查询示例](https://docs.mongodb.com/manual/reference/operator/query/text/#text-query-examples)
 - [$meta projection operator](https://docs.mongodb.com/manual/reference/operator/projection/meta/#proj._S_meta)

### <span id="aggregation">聚合框架</span>

在使用Aggregation框架时，请将[$match](#)与[$text](#)表达式一起使用以执行文本搜索查询。 要按相关性得分的顺序对结果进行排序，请在[$ sort](#)阶段使用[$meta](#)聚合运算符。<br />有关聚合框架中文本搜索的更多信息和示例，请参阅 [Text Search in the Aggregation Pipeline](https://docs.mongodb.com/manual/tutorial/text-search-in-aggregation/).<br /> [$meta](#)投影运算符的行为和要求与[$meta](#)聚合运算符的行为和要求不同。 有关[$meta](#)聚合运算符的详细信息，请参见[$meta](#)聚合运算符参考页。
<a name="FwLlx"></a>

