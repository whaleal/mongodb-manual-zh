# 入门

本教程将引导您将测试数据插入 MongoDB 数据库并使用文档的嵌入式 Web shell 查询该数据。您无需部署或安装 MongoDB 即可完成本教程。

<iframe class="mws-root" allowfullscreen="" sandbox="allow-scripts allow-same-origin" width="100%" height="320" src="https://mws.mongodb.com/?version=4.2" style="box-sizing: border-box; border: 0px;"></iframe>

本教程中的示例使用了以下内容的子集 [Mflix 数据集示例](https://www.mongodb.com/docs/atlas/sample-data/sample-mflix/)，这是 MongoDB 云托管服务中包含的示例数据的一部分， [MongoDB 阿特拉斯](https://www.mongodb.com/atlas/database?tck=docs_server)。Atlas 不需要安装开销，并提供免费套餐来开始使用。完成本教程后，您可以使用 Atlas 探索其他示例数据或托管您自己的数据。

### 下一步

建立自己的部署

要建立自己的部署:

| 部署                     | 描述                                                         |
| :----------------------- | :----------------------------------------------------------- |
| MongoDB Atlas 免费层集群 | MongoDB Atlas 是一种快速、简单且免费的 MongoDB 入门方式。要了解更多信息，请参阅 [阿特拉斯入门](https://www.mongodb.com/docs/atlas/getting-started/)教程。 |
| 本地 MongoDB 安装        | 有关本地安装 MongoDB 的更多信息，请参阅 [安装 MongoDB 。](https://www.mongodb.com/docs/v7.0/installation/#std-label-tutorial-installation) |

#### 其他示例

有关其他示例，包括 MongoDB 驱动程序特定示例（Python、Java、Node.js 等），请参阅：

|              |                                                              |
| :----------- | :----------------------------------------------------------- |
| 查询文档示例 | [查询文件](https://www.mongodb.com/docs/v7.0/tutorial/query-documents/#std-label-read-operations-queries)[嵌入/嵌套文档查询](https://www.mongodb.com/docs/v7.0/tutorial/query-embedded-documents/#std-label-read-operations-subdocuments)[查询数组](https://www.mongodb.com/docs/v7.0/tutorial/query-arrays/#std-label-read-operations-arrays)[查询嵌入文档数组](https://www.mongodb.com/docs/v7.0/tutorial/query-array-of-documents/#std-label-array-match-embedded-documents)[从查询返回的项目字段](https://www.mongodb.com/docs/v7.0/tutorial/project-fields-from-query-results/#std-label-projection)[查询空或缺失字段](https://www.mongodb.com/docs/v7.0/tutorial/query-for-null-fields/#std-label-faq-developers-query-for-nulls) |
| 更新文档示例 | [更新文件](https://www.mongodb.com/docs/v7.0/tutorial/update-documents/#std-label-write-op-update) |
| 删除文档示例 | [删除文档](https://www.mongodb.com/docs/v7.0/tutorial/remove-documents/#std-label-write-op-delete) |

#### 附加主题

| 介绍                                                         | 开发商                                                       | 管理员                                                       | 参考                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| [MongoDB简介](https://www.mongodb.com/docs/v7.0/introduction/#std-label-intro-to-mongodb) | [增删改查操作](https://www.mongodb.com/docs/v7.0/crud/#std-label-crud) | [生产注意事项](https://www.mongodb.com/docs/v7.0/administration/production-notes/#std-label-production-notes) | [Shell 方法](https://www.mongodb.com/docs/v7.0/reference/method/#std-label-js-administrative-methods) |
| [安装指南](https://www.mongodb.com/docs/v7.0/installation/#std-label-tutorial-installation) | [聚合](https://www.mongodb.com/docs/v7.0/aggregation/#std-label-aggregation) | [副本集](https://www.mongodb.com/docs/v7.0/replication/#std-label-replication) | [查询操作符](https://www.mongodb.com/docs/v7.0/reference/operator/#std-label-operator-ref-landing) |
| [数据库和集合](https://www.mongodb.com/docs/v7.0/core/databases-and-collections/#std-label-databases-and-collections) | [SQL 到 MongoDB](https://www.mongodb.com/docs/v7.0/reference/sql-comparison/#std-label-sql-to-mongodb-mapping) | [分片集群](https://www.mongodb.com/docs/v7.0/sharding/#std-label-sharding-background) | [参考](https://www.mongodb.com/docs/v7.0/reference/#std-label-reference-landing) |
| [文件](https://www.mongodb.com/docs/v7.0/core/document/#std-label-bson-document-format) | [索引](https://www.mongodb.com/docs/v7.0/indexes/#std-label-indexes) | [MongoDB 安全](https://www.mongodb.com/docs/v7.0/security/#std-label-security) | [词汇表](https://www.mongodb.com/docs/v7.0/reference/glossary/#std-label-glossary) |
