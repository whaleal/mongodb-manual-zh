**使用文档引用对一对多关系建模**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/#model-one-to-many-relationships-with-document-references)

**概述**

本页介绍了一种数据模型，该模型使用文档之间的[引用](https://www.mongodb.com/docs/manual/core/data-model-design/#std-label-data-modeling-referencing)来描述连接数据之间的一对多关系。

**模式**

请考虑以下映射出版商和图书关系的示例。该示例说明了引用优于嵌入以避免重复发布者信息的优势。

将出版商文档嵌入到书籍文档中会导致 出版商数据**重复**，如以下文档所示：

```json
{
   title: "MongoDB: The Definitive Guide",
   author: [ "Kristina Chodorow", "Mike Dirolf" ],
   published_date: ISODate("2010-09-24"),
   pages: 216,
   language: "English",
   publisher: {
              name: "O'Reilly Media",
              founded: 1980,
              location: "CA"
            }
}

{
   title: "50 Tips and Tricks for MongoDB Developer",
   author: "Kristina Chodorow",
   published_date: ISODate("2011-05-06"),
   pages: 68,
   language: "English",
   publisher: {
              name: "O'Reilly Media",
              founded: 1980,
              location: "CA"
            }
}
```

为避免重复出版商数据，请使用*参考资料*并将出版商信息保存在与图书收藏不同的馆藏中。

使用引用时，关系的增长决定了引用的存储位置。如果每个出版商的图书数量很少且增长有限，则将图书参考存储在出版商文档中有时可能会有用。否则，如果每个出版商的图书数量没有限制，则此数据模型将导致可变的、不断增长的数组，如下例所示：

```json
{
   name: "O'Reilly Media",
   founded: 1980,
   location: "CA",
   books: [123456789, 234567890, ...]
}

{
    _id: 123456789,
    title: "MongoDB: The Definitive Guide",
    author: [ "Kristina Chodorow", "Mike Dirolf" ],
    published_date: ISODate("2010-09-24"),
    pages: 216,
    language: "English"
}

{
   _id: 234567890,
   title: "50 Tips and Tricks for MongoDB Developer",
   author: "Kristina Chodorow",
   published_date: ISODate("2011-05-06"),
   pages: 68,
   language: "English"
}
```

为避免可变的、不断增长的数组，将出版商参考存储在书籍文档中：

```json
{
   _id: "oreilly",
   name: "O'Reilly Media",
   founded: 1980,
   location: "CA"
}

{
   _id: 123456789,
   title: "MongoDB: The Definitive Guide",
   author: [ "Kristina Chodorow", "Mike Dirolf" ],
   published_date: ISODate("2010-09-24"),
   pages: 216,
   language: "English",
   publisher_id: "oreilly"
}

{
   _id: 234567890,
   title: "50 Tips and Tricks for MongoDB Developer",
   author: "Kristina Chodorow",
   published_date: ISODate("2011-05-06"),
   pages: 68,
   language: "English",
   publisher_id: "oreilly"
}
```

 参见

原文 - [Model One-to-Many Relationships with Document References]( https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/ )

译者：景圣
