# 用户定义的角色

MongoDB 提供了许多[内置角色](https://www.mongodb.com/docs/manual/reference/built-in-roles/)。但是，如果这些角色无法描述所需的权限集，您可以创建新角色。

## 角色管理界面

MongoDB 提供了添加角色的[`db.createRole()`](https://www.mongodb.com/docs/manual/reference/method/db.createRole/#mongodb-method-db.createRole)方法。MongoDB 还提供了更新现有用户定义角色的方法。有关角色管理方法的完整列表，请参阅 [角色管理。](https://www.mongodb.com/docs/manual/reference/method/#std-label-role-management-methods)

## 范围

添加角色时，您会在特定数据库中创建角色。MongoDB 使用数据库和角色名称的组合来唯一定义一个角色。

除了在`admin`数据库中创建的角色外，角色只能包含适用于其数据库的特权，并且只能从其数据库中的其他角色继承。

在数据库中创建的角色`admin`可以包括适用于`admin`数据库、其他数据库或 [集群](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-cluster)资源的特权，并且可以从其他数据库和`admin`数据库中的角色继承

## 集中角色数据

MongoDB将所有角色信息存储在数据库中的[system.roles](https://www.mongodb.com/docs/manual/reference/system-roles-collection/)集合中`admin`

不要直接访问此集合，而是使用[角色管理命令](https://www.mongodb.com/docs/manual/reference/command/#std-label-role-management-commands)来查看和编辑自定义角色。



译者：韩鹏帅

原文：[User-Defined Roles](https://www.mongodb.com/docs/manual/core/security-user-defined-roles/)
