### 文本索引属性

本页描述[版本 3](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-versions/#std-label-text-index-versions) 文本索引的行为。

### 不区分大小写

文本索引不区分大小写。文本索引不区分大小写字符，例如`e`和`E`。

文本索引支持大小写折叠，如中指定的[Unicode 8.0 字符数据库大小写折叠](http://www.unicode.org/Public/8.0.0/ucd/CaseFolding.txt):

- 普通C
- 简单S
- 土耳其语的特殊 T
- 带变音符号的字符，例如`é`和`É`
- 非拉丁字母表中的字符，例如西里尔字母表中的`И`和。`и`

[以前的文本索引版本](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-versions/#std-label-text-index-versions)仅对于非变音符号拉丁字符不区分大小写`[A-z]`。以前的文本索引版本将所有其他字符视为不同的。

### 变音符号不敏感

文本索引不区分变音符号。文本索引不区分包含变音标记的字符及其未标记的对应字符，例如`é`、`ê`和`e`。更具体地说，文本索引剥离了分类为变音符号的标记[Unicode 8.0 字符数据库道具列表](http://www.unicode.org/Public/8.0.0/ucd/PropList.txt)。

[以前版本](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-versions/#std-label-text-index-versions)的文本索引将带有变音符号的字符视为不同的字符。

### 标记化分隔符

对于标记化，文本索引使用分类在`Dash`、 `Hyphen`、`Pattern_Syntax`、`Quotation_Mark`、`Terminal_Punctuation`、 和`White_Space`下的分隔符[Unicode 8.0 字符数据库道具列表](http://www.unicode.org/Public/8.0.0/ucd/PropList.txt)。

例如，在短语 中`Il a dit qu'il «était le meilleur joueur du monde»`，引号（`«`, `»`）和空格是分隔符。

[以前版本](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-versions/#std-label-text-index-versions)的索引将其视为`«`术语的一部分`«était`并`»`视为术语的一部分`monde»`。

### 索引条目

文本索引对索引条目的索引字段中的术语进行标记和词干化。索引使用简单 [特定于语言的](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-properties/#std-label-text-index-supported-languages)后缀词干。对于集合中的每个文档，文本索引为每个索引字段中的每个唯一词干术语存储一个索引条目。

### 支持的语言和停用词  

MongoDB 支持多种语言的文本搜索。文本索引使用简单的特定于语言的后缀词干。文本索引还会删除特定于语言的停用词，例如英语中的`the`、`an`、`a`和。`and`有关支持的语言的列表，请参阅[文本搜索语言。](https://www.mongodb.com/docs/v7.0/reference/text-search-languages/#std-label-text-search-languages)

要指定文本索引的语言，请参阅 [指定文本索引的默认语言。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/specify-text-index-language/#std-label-specify-text-index-language)

### 稀疏属性

文本索引总是[稀疏的](https://www.mongodb.com/docs/v7.0/core/index-sparse/#std-label-index-type-sparse)。当您创建文本索引时，MongoDB 会忽略该`sparse`选项。

如果现有或新插入的文档缺少文本索引字段（或者该字段为 null 或空数组），MongoDB 不会为该文档添加文本索引条目。

### 了解更多

要了解文本索引限制，请参阅 [文本索引版本。](https://www.mongodb.com/docs/v7.0/core/indexes/index-types/index-text/text-index-versions/#std-label-text-index-versions)

