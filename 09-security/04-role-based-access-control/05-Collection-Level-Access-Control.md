# 集合级访问控制

集合级访问控制允许管理员授予用户权限，这些权限仅限于特定集合。

[管理员可以通过用户定义的角色](https://www.mongodb.com/docs/manual/core/security-user-defined-roles/#std-label-user-defined-roles)实现集合级别的访问控制 。通过创建具有特定数据库中特定集合[权限](https://www.mongodb.com/docs/manual/core/authorization/#std-label-privileges)的角色 ，管理员可以为用户提供在集合级别授予权限的角色。

## 权限和范围

特权由[操作](https://www.mongodb.com/docs/manual/reference/privilege-actions/) 和允许操作的[资源组成；](https://www.mongodb.com/docs/manual/reference/resource-document/)即资源定义了该权限的操作范围。

[通过在资源文档](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-specific-db-collection)中为权限指定数据库和集合 ，管理员可以将权限操作限制为特定数据库中的特定集合。角色中的每个特权操作都可以限定在不同的集合中。

例如，用户定义的角色可以包含以下权限：

```shell
privileges: [
  { resource: { db: "products", collection: "inventory" }, actions: [ "find", "update", "insert" ] },
  { resource: { db: "products", collection: "orders" },  actions: [ "find" ] }
]
```

第一个权限将其操作范围限定为`inventory`数据库集合`products`。第二个权限将其操作范围限定为`orders`数据库集合`products`。

## 附加信息

有关用户定义角色和 MongoDB 授权模型的更多信息，请参阅[基于角色的访问控制](https://www.mongodb.com/docs/manual/core/authorization/)。有关创建用户定义角色的教程，请参阅[管理用户和角色。](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/)







译者：韩鹏帅

原文：[Collection-Level Access Control](https://www.mongodb.com/docs/manual/core/collection-level-access-control/)