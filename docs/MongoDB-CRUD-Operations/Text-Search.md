  

## Text Search（文本搜索）
**在本页面**

*   [Overview](#Overview)(总览)<br />

*   [Example](#Example)(例子)<br />

*   [Language Support](#Language)(语言支持)<br />

> MONGODB ATLAS搜索
>
> 利用Atlas Search，您可以轻松地在MongoDB数据之上构建快速的，基于相关性的搜索功能。 立即在MongoDB Atlas（我们完全托管的数据库即服务）上试用。

#### <span id="Overview">总览</span>

MongoDB支持执行字符串内容的文本搜索的查询操作。 为了执行文本搜索，MongoDB使用文本索引和[$text](#)运算符。

> 注意**<br />**视图不支持文本搜索。<br />

#### <span id="Example">例子</span>

此示例演示了如何在仅指定文本字段的情况下构建文本索引并使用它来查找咖啡店。<br />使用以下文档创建一个集合存储：

```shell
  db.stores.insert(
  		[
  			{ _id: 1, name: "Java Hut", description: "Coffee and cakes" },
  			{ _id: 2, name: "Burger Buns", description: "Gourmet hamburgers" },
  			{ _id: 3, name: "Coffee Shop", description: "Just coffee" },  
  			{ _id: 4, name: "Clothes Clothes Clothes", description: "Discount clothing" }, 
  			{ _id: 5, name: "Java Shopping", description: "Indonesian goods" } 
  		]
  )
```

**文字索引**<br />MongoDB提供文本索引以支持对字符串内容的文本搜索查询。 文本索引可以包含任何值为字符串或字符串元素数组的字段。<br /> <br />要执行文本搜索查询，您的集合上必须有一个文本索引。 一个集合只能有一个文本搜索索引，但是该索引可以涵盖多个字段。<br /> <br />例如，您可以在mongo shell中运行以下命令，以允许在名称和描述字段中进行文本搜索：

```shell
db.stores.createIndex( { name: "text", description: "text" } )
```

**$text操作符**<br />使用[$text](#)查询运算符可对具有文本索引的集合执行文本搜索。<br />[$text](#)将使用空格和大多数标点符号作为分隔符来标记搜索字符串，并对搜索字符串中的所有此类标记执行逻辑或。<br />例如，您可以使用以下查询从列表“ coffee”，“ shop”和“ java”中查找包含任何术语的所有商店：

```shell
db.stores.find( { $text: { $search: "java coffee shop" } } )
```

**准确的短语**<br />您还可以通过将它们括在双引号中来搜索确切的短语。 如果**$search**字符串包含短语和单个词，则文本搜索将仅匹配包含该短语的文档。<br />例如，以下将查找包含“咖啡店”的所有文档：

```shell
db.stores.find( { $text: { $search: "\"coffee shop\"" } } )
```

更多信息参见：[Phrases](https://docs.mongodb.com/manual/reference/operator/query/text/#text-operator-phrases).<br />**期限排除**<br />要排除一个单词，可以在前面加上一个“-”字符。 例如，要查找所有包含“ java”或“ shop”但不包含“ coffee”的商店，请使用以下命令：

```shell
db.stores.find( { $text: { $search: "java shop -coffee" } } )
```

**排序**<br />默认情况下，MongoDB将以未排序的顺序返回结果。 但是，文本搜索查询将为每个文档计算相关性得分，以指定文档与查询的匹配程度。<br />要按相关性得分的顺序对结果进行排序，必须显式投影[$meta](#) textScore字段并对其进行排序：

```shell
db.stores.find( 
  	{ $text: { $search: "java coffee shop" } },
  	{ score: { $meta: "textScore" } }
  ).sort( { score: { $meta: "textScore" } } )
```

聚合管道中也提供文本搜索。

#### <span id="Language">语言支持</span>

MongoDB支持多种语言的文本搜索。 有关支持的语言列表，请参见[文本搜索语言](https://docs.mongodb.com/manual/reference/text-search-languages/)。
  <a name="H1jbm"></a>