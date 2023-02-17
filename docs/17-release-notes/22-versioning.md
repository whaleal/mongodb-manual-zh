# MongoDB版本控制

*始终升级到发布系列的最新稳定版本*

MongoDB版本控制的形式为`X.Y.Z`，其中`X.Y`指的是发布系列，`Z`表示补丁号。

从MongoDB 5.0开始，MongoDB作为两个不同的发布系列发布：

* 主要版本
* 快速版本

对于MongoDB 4.4及更高版本，MongoDB使用生产/开发版本控制系统。看[历史版本。](https://www.mongodb.com/docs/manual/reference/versioning/#std-label-historical-releases)

### 主要版本

主要版本大约每年提供一次，并引入新功能和改进。MongoDB Atlas和本地部署支持主要版本。

*示例版本：*

- `5.0`
- `6.0`

### 快速发布

快速版本大约每季度提供一次，不包含主要版本，并引入新功能和改进。快速发布仅在[MongoDB地图集](https://www.mongodb.com/cloud/atlas?tck=docs_server)，并且不支持本地部署。

快速版本不适用于[MongoDB运营经理](https://docs.opsmanager.mongodb.com/current/?tck=docs_server)

*示例版本：*

- `5.1`
- `5.2`
- `5.3`

### 补丁发布

补丁版本根据需要提供给主要版本和快速版本。补丁版本通常包括错误修复和小幅改进。

*示例版本：*

- `5.0.1`（主要发布补丁版本）
- `5.2.1`（快速发布补丁版本）

### 发布候选（RC）发布

在新的主要版本和快速版本之前，发布候选版本可供早期测试。发布候选版本代表即将发布的版本，该版本足够稳定，可以开始测试，但不适合生产部署。

*示例版本：*

- `5.0.0-rc0`
- `5.0.0-rc1`
- `5.1.2-rc5`

### 驱动程序版本

MongoDB的版本编号系统与用于[MongoDB驱动程序。](https://www.mongodb.com/docs/drivers/drivers/)

### MongoDB Shell（`mongosh`）

从MongoDB 5.0开始，[MongoDB Shell](https://www.mongodb.com/docs/mongodb-shell/)（`mongosh`）与MongoDB服务器分开发布，并使用自己的版本编号系统。

### 数据库工具

从MongoDB 4.4开始，[MongoDB数据库工具](https://www.mongodb.com/docs/database-tools/)从MongoDB服务器分开发布，并使用自己的版本编号系统。

### 历史版本

对于MongoDB 4.4及之前版本，MongoDB版本控制使用生产/开发版本控制方案，其形式为`X.Y.Z`，其中`X.Y`表示发布系列或开发系列，`Z`表示修订/补丁号。

- 如果`Y`是偶数，`X.Y`指的是发布系列；例如，`4.2`发布系列和`4.4`发布系列。发布系列**稳定**，适合生产。
- 如果`Y`是奇数，`X.Y`指的是开发系列；例如，`4.3`开发系列和`4.5`开发系列。开发系列**仅用于测试，不用于生产**。

例如，在MongoDB `4.4.7`版本中，`4.4`指的是发布系列，`.7`指的是版本。





译者：韩鹏帅

参见

原文 - [MongoDB Versioning]( https://docs.mongodb.com/manual/reference/versioning/ )

