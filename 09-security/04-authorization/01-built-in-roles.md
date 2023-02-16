**内置角色**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#built-in-roles)

MongoDB 通过 [role-based authorization](https://www.mongodb.com/docs/manual/core/authorization/#std-label-roles)授予对数据和命令的访问权限，并提供内置角色来提供数据库系统中通常需要的不同级别的访问权限。您还可以创建[user-defined roles](https://www.mongodb.com/docs/manual/core/security-user-defined-roles/#std-label-user-defined-roles)。

角色授予对定义的[resources](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-document)执行一组[actions](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)的权限。给定的角色适用于定义它的数据库，并且可以授予访问权限到粒度的集合级别。

MongoDB 的每个内置角色都定义了角色数据库中所有 *非*系统集合在数据库级别的访问权限，以及所有[system collections](https://www.mongodb.com/docs/manual/reference/system-collections/)在集合级别的访问权限。

MongoDB 提供了内置的[database user](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-database-user-roles)和  [database administration](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-database-administration-roles)*每个*数据库上的角色 。MongoDB 仅在`admin`数据库上提供所有其他内置角色 。

本节介绍每个内置角色的权限。 您还可以随时查看内置角色的权限，方法是发出 [`rolesInfo`](https://www.mongodb.com/docs/manual/reference/command/rolesInfo/#mongodb-dbcommand-dbcmd.rolesInfo)  命令并将 `showPrivileges` 和 `showBuiltinRoles` 字段都设置为 true。

**数据库用户角色**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#database-user-roles)

每个数据库都包含以下客户端角色：

- `read`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-read)

  提供读取所有*非*系统集合和[`system.js`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.js)集合上的数据的能力。

  > [NOTE]
  >
  > 从 MongoDB 4.2 开始，角色不再提供[`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces)直接访问集合的权限。自 MongoDB 3.0 以来，不推荐直接访问集合。在早期版本中，该角色提供了上述对[`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces)集合的特权操作，从而允许直接访问。

  该角色通过授予以下[操作](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions)来提供读取访问权限：

  - [`changeStream`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-changeStream)
  - [`collStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collStats)
  - [`dbHash`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbHash)
  - [`dbStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbStats)
  - [`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)
  - [`killCursors`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-killCursors)
  - [`listIndexes`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listIndexes)
  - [`listCollections`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listCollections)

  如果用户没有[`listDatabases`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listDatabases) 权限操作，用户可以运行该[`listDatabases`](https://www.mongodb.com/docs/manual/reference/command/listDatabases/#mongodb-dbcommand-dbcmd.listDatabases) 命令以返回用户具有权限的数据库列表（包括用户对特定集合具有权限的数据库）如果该命令运行时 `authorizedDatabases`未指定或设置到`true`。

- `readWrite`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWrite)

  提供所有特权[`read`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-read)角色加上修改所有*非*系统集合和[`system.js`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.js)集合上的数据的能力。

  该角色对这些集合提供以下操作：

  - [`changeStream`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-changeStream)
  - [`collStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collStats)
  - [`convertToCapped`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-convertToCapped)
  - [`createCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createCollection)
  - [`dbHash`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbHash)
  - [`dbStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbStats)
  - [`dropCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropCollection)
  - [`createIndex`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createIndex)
  - [`dropIndex`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropIndex)
  - [`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)
  - [`insert`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-insert)
  - [`killCursors`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-killCursors)
  - [`listIndexes`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listIndexes)
  - [`listCollections`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listCollections)
  - [`remove`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-remove)
  - [`renameCollectionSameDB`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-renameCollectionSameDB)
  - [`update`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-update)

**数据库管理角色**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#database-administration-roles)

每个数据库都包含以下数据库管理角色：

- `dbAdmin`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin)

  提供执行管理任务的能力，例如与架构相关的任务、索引和收集统计信息。此角色不授予用户和角色管理权限。

  具体来说，该角色提供以下权限：资源允许的操作

  Resource：[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)

  Permitted Actions:

  - [`changeStream`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-changeStream)
  - [`collStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collStats)
  - [`convertToCapped`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-convertToCapped)
  - [`createCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createCollection)
  - [`dbHash`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbHash)
  - [`dbStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbStats)

  - [`dropCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropCollection)

  - [`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)

  - [`killCursors`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-killCursors)

  - [`listCollections`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listCollections)

  - [`listIndexes`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listIndexes)

  - [`planCacheRead`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-planCacheRead)

    >[NOTE]
    >
    >除此以外
    >
    >从版本 4.2 开始，MongoDB 删除了  [`system.indexes`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.indexes) 和 [`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces) 集合。 因此，[`dbAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin)角色不再提供访问这些集合的权限。 自 MongoDB 3.0 以来，不推荐直接访问这些集合。
    >
    >在早期版本中，[`dbAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin) 角色在 [`system.indexes`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.indexes) 和 [`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces)  集合上提供上述特权操作（[`dropCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropCollection)和 [`createCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createCollection) 除外），从而允许直接访问 [`system.indexes`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.indexes) 和 [`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces) 集合。

  Resource：All *non*-system collections (i.e. [database resource)](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-specific-db)

  Permitted Actions：

  - [`bypassDocumentValidation`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-bypassDocumentValidation)

  - [`collMod`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collMod)

  - [`collStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collStats)

  - [`compact`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-compact)

  - [`convertToCapped`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-convertToCapped)

  - [`createCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createCollection)

  - [`createIndex`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createIndex)

  - [`dbStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbStats)

  - [`dropCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropCollection)

  - [`dropDatabase`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropDatabase)

  - [`dropIndex`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropIndex)

  - [`enableProfiler`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-enableProfiler)

  - [`listCollections`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listCollections)

  - [`listIndexes`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listIndexes)

  - [`planCacheIndexFilter`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-planCacheIndexFilter)

  - [`planCacheRead`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-planCacheRead)

  - [`planCacheWrite`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-planCacheWrite)

  - [`reIndex`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-reIndex)

  - [`renameCollectionSameDB`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-renameCollectionSameDB)

  - [`storageDetails`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-storageDetails)

  - [`validate`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-validate)

    对于这些集合，[`dbAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin) 不包括完全读取访问权限（即查找）。

- `dbOwner`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbOwner)

  数据库所有者可以对数据库执行任何管理操作。该角色结合了由[`readWrite`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWrite), [`dbAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin)和[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)角色。

- `userAdmin`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)

  提供在当前数据库上创建和修改角色和用户的能力。自从[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)角色允许用户将任何权限授予任何用户，包括他们自己，该角色还间接提供[超级用户](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-superuser) 访问数据库，或者，如果范围是`admin` 数据库，则访问集群。这[`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)角色明确提供以下操作：

  - [`changeCustomData`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-changeCustomData)
  - [`changePassword`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-changePassword)
  - [`createRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createRole)
  - [`createUser`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createUser)
  - [`dropRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropRole)
  - [`dropUser`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropUser)
  - [`grantRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-grantRole)
  - [`revokeRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-revokeRole)
  - [`setAuthenticationRestriction`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-setAuthenticationRestriction)
  - [`viewRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-viewRole)
  - [`viewUser`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-viewUser)

  >[WARNING]
  >
  >了解授予 [`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin) 角色的安全隐患很重要：具有数据库此角色的用户可以为自己分配对该数据库的任何特权。 在 admin 数据库上授予 [`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin) 角色具有进一步的安全隐患，因为这间接提供了对集群的超级用户访问权限。 在管理范围内，具有 [`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin) 角色的用户可以授予集群范围的角色或权限，包括 [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)。

**集群管理角色**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#cluster-administration-roles)

该`admin`数据库包括以下用于管理整个系统的角色，而不仅仅是一个数据库。这些角色包括但不限于[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)和[分片集群](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)管理功能。

- `clusterAdmin`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin)

  提供最大的集群管理访问。该角色结合了由[`clusterManager`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterManager), [`clusterMonitor`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterMonitor)， 和[`hostManager`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-hostManager)角色。此外，角色提供[`dropDatabase`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropDatabase)操作。

- `clusterManager`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterManager)

  提供对集群的管理和监控操作。具有此角色的用户可以访问`config`和`local` 数据库，它们分别用于分片和复制。

  Resource：[cluster](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-cluster)https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-specific-db)

  Actions：

  - [`addShard`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-addShard)
  - [`appendOplogNote`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-appendOplogNote)
  - [`applicationMessage`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-applicationMessage)
  - [`cleanupOrphaned`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-cleanupOrphaned)
  - [`flushRouterConfig`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-flushRouterConfig)
  - [`getDefaultRWConcern`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-getDefaultRWConcern) (New in version 4.4)
  - [`listSessions`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listSessions)
  - [`listShards`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listShards)
  - [`removeShard`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-removeShard)
  - [`replSetConfigure`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-replSetConfigure)
  - [`replSetGetConfig`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-replSetGetConfig)
  - [`replSetGetStatus`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-replSetGetStatus)
  - [`replSetStateChange`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-replSetStateChange)
  - [`resync`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-resync)
  - [`setDefaultRWConcern`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-setDefaultRWConcern) (New in version 4.4)
  - [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-setFeatureCompatibilityVersion)
  - [`setFreeMonitoring`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-setFreeMonitoring)

  Resource：*All* [databases](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-specific-db)

  Actions：

  - [`clearJumboFlag`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-clearJumboFlag) (New in 4.2.3)
  - [`enableSharding`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-enableSharding)
  - [`refineCollectionShardKey`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-refineCollectionShardKey) (New in 4.4)
  - [`moveChunk`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-moveChunk)
  - [`splitVector`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-splitVector)

  [`clusterManager`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterManager)`config`为和`local`数据库提供额外的权限 。

  在`config`数据库上，允许执行以下操作：

  Resource：All non-system collections in the `config` databasehttps://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-specific-db)

  Actions：

  - [`collStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collStats)
  - [`dbHash`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbHash)
  - [`dbStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbStats)
  - [`enableSharding`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-enableSharding)
  - [`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)
  - [`insert`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-insert)
  - [`killCursors`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-killCursors)
  - [`listCollections`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listCollections)
  - [`listIndexes`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listIndexes)
  - [`moveChunk`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-moveChunk)
  - [`planCacheRead`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-planCacheRead)
  - [`remove`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-remove)
  - [`splitVector`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-splitVector)
  - [`update`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-update)

  Resource：[`system.js`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.js)https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-specific-db)

  Actions：

  - [`collStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collStats)

  - [`dbHash`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbHash)

  - [`dbStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbStats)

  - [`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)

  - [`killCursors`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-killCursors)

  - [`listCollections`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listCollections)

  - [`listIndexes`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listIndexes)

  - [`planCacheRead`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-planCacheRead)

    >[NOTE]
    >
    >除此以外
    >
    >从版本 4.2 开始，MongoDB 删除了  [`system.indexes`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.indexes) 和 [`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces) 集合。 因此，[`dbAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin)角色不再提供访问这些集合的权限。 自 MongoDB 3.0 以来，不推荐直接访问这些集合。
    >
    >在早期版本中，[`dbAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin) 角色在 [`system.indexes`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.indexes) 和 [`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces)  集合上提供上述特权操作（[`dropCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropCollection)和 [`createCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createCollection) 除外），从而允许直接访问 [`system.indexes`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.indexes) 和 [`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces) 集合。

  在`local`数据库上，允许执行以下操作：

  Resource：All non-system collections in the `local` database

  Actions：

  - [`enableSharding`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-enableSharding)
  - [`insert`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-insert)
  - [`moveChunk`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-moveChunk)
  - [`remove`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-remove)
  - [`splitVector`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-splitVector)
  - [`update`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-update)

  Resource：[`system.replset`](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.system.replset) collection

  Actions：

  - [`collStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collStats)
  - [`dbHash`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbHash)
  - [`dbStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbStats)
  - [`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)
  - [`killCursors`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-killCursors)
  - [`listCollections`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listCollections)
  - [`listIndexes`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listIndexes)
  - [`planCacheRead`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-planCacheRead)

- `clusterMonitor`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterMonitor)

  提供对监控工具的只读访问，例如[MongoDB 云管理器](https://cloud.mongodb.com/?tck=docs_server) 和[运营经理](https://www.mongodb.com/docs/ops-manager/current/)监控代理。允许对整个集群执行以下操作：

  - [`checkFreeMonitoringStatus`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-checkFreeMonitoringStatus)
  - [`connPoolStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-connPoolStats)
  - [`getCmdLineOpts`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-getCmdLineOpts)
  - [`getDefaultRWConcern`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-getDefaultRWConcern) (New in version 4.4)
  - [`getLog`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-getLog)
  - [`getParameter`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-getParameter)
  - [`getShardMap`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-getShardMap)
  - [`hostInfo`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-hostInfo)
  - [`inprog`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-inprog)
  - [`listDatabases`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listDatabases)
  - [`listSessions`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listSessions)
  - [`listShards`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listShards)
  - [`netstat`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-netstat)
  - [`replSetGetConfig`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-replSetGetConfig)
  - [`replSetGetStatus`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-replSetGetStatus)
  - [`serverStatus`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-serverStatus)
  - [`setFreeMonitoring`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-setFreeMonitoring)
  - [`shardingState`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-shardingState)
  - [`top`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-top)

  对集群中的*所有*数据库执行以下操作：

  - [`collStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collStats)
  - [`dbStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbStats)
  - [`getShardVersion`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-getShardVersion)
  - [`indexStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-indexStats)
  - [`useUUID`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-useUUID)

  允许对集群中的[`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)所有[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)集合执行操作。

  在`config`数据库上，允许执行以下操作：

  Resource：All non-system collections in the `config` databasehttps://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-specific-db)

  Actions：

  [`collStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collStats)

  [`dbHash`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbHash)

  [`dbStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbStats)

  [`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)

  [`getShardVersion`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-getShardVersion)

  [`indexStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-indexStats)

  [`killCursors`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-killCursors)

  [`listCollections`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listCollections)

  [`listIndexes`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listIndexes)

  [`planCacheRead`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-planCacheRead)

  Resource：[`system.js`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.js) collection

  Actions：

  [`collStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collStats)

  [`dbHash`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbHash)

  [`dbStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbStats)

  [`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)

  [`killCursors`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-killCursors)

  [`listCollections`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listCollections)

  [`listIndexes`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listIndexes)

  [`planCacheRead`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-planCacheRead)

  >[NOTE]
  >
  >除此以外
  >
  >从版本 4.2 开始，MongoDB 删除了  [`system.indexes`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.indexes) 和 [`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces) 集合。 因此，[`dbAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin)角色不再提供访问这些集合的权限。 自 MongoDB 3.0 以来，不推荐直接访问这些集合。
  >
  >在早期版本中，[`dbAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin) 角色在 [`system.indexes`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.indexes) 和 [`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces)  集合上提供上述特权操作（[`dropCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropCollection)和 [`createCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createCollection) 除外），从而允许直接访问 [`system.indexes`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.indexes) 和 [`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces) 集合。

  在`local`数据库上，允许执行以下操作：

  Resource：All non-system collections in the `local` database

  Actions：

  [`collStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collStats)

  [`dbHash`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbHash)

  [`dbStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbStats)

  [`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)

  [`getShardVersion`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-getShardVersion)

  [`indexStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-indexStats)

  [`killCursors`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-killCursors)

  [`listCollections`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listCollections)

  [`listIndexes`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listIndexes)

  [`planCacheRead`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-planCacheRead)

  Resource：[`system.js`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.js) collection

  Actions：

  [`collStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collStats)

  [`dbHash`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbHash)

  [`dbStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbStats)

  [`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)

  [`killCursors`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-killCursors)

  [`listCollections`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listCollections)

  [`listIndexes`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listIndexes)

  [`planCacheRead`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-planCacheRead)

  从版本 4.2 开始，MongoDB 删除了  [`system.indexes`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.indexes) 和 [`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces) 集合。 因此，[`dbAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin)角色不再提供访问这些集合的权限。 自 MongoDB 3.0 以来，不推荐直接访问这些集合。

  在早期版本中，[`dbAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin) 角色在 [`system.indexes`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.indexes) 和 [`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces)  集合上提供上述特权操作（[`dropCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropCollection)和 [`createCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createCollection) 除外），从而允许直接访问 [`system.indexes`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.indexes) 和 [`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces) 集合。

  Resource：[`system.replset`](https://www.mongodb.com/docs/manual/reference/local-database/#mongodb-data-local.system.replset),

  [`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile),

  Actions：[`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)

- `hostManager`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-hostManager)

  提供监视和管理服务器的能力。在整个集群上，提供以下操作：
  
  - [`applicationMessage`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-applicationMessage)
  - [`closeAllDatabases`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-closeAllDatabases)
  - [`connPoolSync`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-connPoolSync)
  - [`flushRouterConfig`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-flushRouterConfig)
  - [`fsync`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-fsync)
  - [`invalidateUserCache`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-invalidateUserCache)
  - [`killAnyCursor`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-killAnyCursor)
  - [`killAnySession`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-killAnySession)
  - [`killop`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-killop)
  - [`logRotate`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-logRotate)
  - [`oidReset`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-oidReset)
  - [`resync`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-resync)
  - [`rotateCertificates`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-rotateCertificates) (New in version 5.0)
  - [`setParameter`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-setParameter)
  - [`shutdown`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-shutdown)
  - [`touch`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-touch)
  - [`unlock`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-unlock)
  
  *Changed in version 4.4* :从 4.4 版本开始，[`hostManager`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-hostManager)不再提供[`cpuProfiler`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-cpuProfiler)对集群的权限操作。
  
  在集群中的*所有*数据库上，提供以下操作：
  
  - [`killCursors`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-killCursors)

**备份和恢复角色**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#backup-and-restoration-roles)

`admin`数据库包括以下用于备份和恢复数据的角色：

- `backup`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-backup)

  提供备份数据所需的最低权限。 此角色提供足够的权限来使用[MongoDB Cloud Manager](https://cloud.mongodb.com/?tck=docs_server)备份代理，[
  Ops Manager](https://www.mongodb.com/docs/ops-manager/current/)备份代理，或者使用[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)来备份整个 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例。

  提供对管理数据库中的 `mms.backup` 集合和配置数据库中的设置集合的[`insert`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-insert)和[`update`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-update)操作。

  在[`anyResource`](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-anyResource)上，提供

  - [`listDatabases`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listDatabases) action
  - [`listCollections`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listCollections) action
  - [`listIndexes`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listIndexes) action

  在整个[cluster](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-cluster)上，提供了

  - [`appendOplogNote`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-appendOplogNote)
  - [`getParameter`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-getParameter)
  - [`listDatabases`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listDatabases)
  - [`serverStatus`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-serverStatus) (Starting in MongoDB 4.2)
  - [`setUserWriteBlockMode`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-setUserWriteBlockMode) (Starting in MongoDB 6.0)

  提供对以下内容的查找操作：

  - all *non*-system collections in the cluster, including those in the `config` and `local` databases

  - The following system collections in the cluster:

    [`system.js`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.js), and [`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)

  - The [`admin.system.users`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data-admin.system.users) and [`admin.system.roles`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data-admin.system.roles) collections

  - The [`config.settings`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.settings) collection

  - Legacy `system.users` collections from versions of MongoDB prior to 2.6

  提供对 [`config.settings`](https://www.mongodb.com/docs/manual/reference/config-database/#mongodb-data-config.settings) 集合的插入和更新操作。

  [`backup`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-backup) 角色提供额外的权限来备份运行[database profiling](https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/#std-label-database-profiling)时存在的 [`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile) 集合。

- `restore`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-restore)

  提供[`convertToCapped`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-convertToCapped)非系统集合。
  
  如果数据不包括 [`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)集合数据并且您在不使用 [`--oplogReplay`](https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--oplogReplay) 选项的情况下运行 [`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)，则提供从备份恢复数据所需的权限。
  
  如果备份数据包括 [`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile) 集合数据或者您使用 [`--oplogReplay`](https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--oplogReplay) 运行，您需要额外的权限：
  
  `system.profile` 
  
  如果备份数据包含[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)集合数据，而目标数据库不包含[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile) 集合，[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)尝试创建集合，即使该程序实际上并未恢复`system.profile` 文档。因此，用户需要额外的权限才能 对数据库的集合执行[`createCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createCollection)和[`convertToCapped`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-convertToCapped) 操作。[`system.profile`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.profile)
  
  两个内置角色[`dbAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin)和 [`dbAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdminAnyDatabase)提供额外的特权。
  
  `--oplogReplay`
  
  运行[`--oplogReplay`](https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--oplogReplay)，创建 具有 on的[用户定义角色](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/#std-label-create-user-defined-role)[。](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-anyresource)[`anyAction`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-anyAction)[`anyResource`](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-anyresource)
  
  仅授予必须运行的用户[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore) 和[`--oplogReplay`.](https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--oplogReplay)

在整个集群上提供以下操作：

- [`getParameter`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-getParameter)

*对所有非*系统集合提供以下操作：

- [`bypassDocumentValidation`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-bypassDocumentValidation)
- [`changeCustomData`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-changeCustomData)
- [`changePassword`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-changePassword)
- [`collMod`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collMod)
- [`convertToCapped`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-convertToCapped)
- [`createCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createCollection)
- [`createIndex`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createIndex)
- [`createRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createRole)
- [`createUser`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createUser)
- [`dropCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropCollection)
- [`dropRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropRole)
- [`dropUser`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropUser)
- [`grantRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-grantRole)
- [`insert`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-insert)
- [`revokeRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-revokeRole)
- [`viewRole`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-viewRole)
- [`viewUser`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-viewUser)

提供以下[`system.js`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.js)收集操作：

- [`bypassDocumentValidation`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-bypassDocumentValidation)
- [`collMod`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collMod)
- [`createCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createCollection)
- [`createIndex`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createIndex)
- [`dropCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropCollection)
- [`insert`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-insert)

在 上提供以下操作[`anyResource`：](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-anyResource)

- [`listCollections`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listCollections)

`config`对和`local`数据库上的所有非系统集合提供以下操作 ：

- [`bypassDocumentValidation`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-bypassDocumentValidation)
- [`collMod`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collMod)
- [`createCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createCollection)
- [`createIndex`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createIndex)
- [`dropCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropCollection)
- [`insert`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-insert)

提供以下操作[`admin.system.version`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data-admin.system.version)

- [`bypassDocumentValidation`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-bypassDocumentValidation)
- [`collMod`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collMod)
- [`createCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createCollection)
- [`createIndex`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createIndex)
- [`dropCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropCollection)
- [`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)
- [`insert`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-insert)

提供以下操作[`admin.system.roles`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data-admin.system.roles)

- [`createIndex`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createIndex)

提供对[`admin.system.users`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data-admin.system.users) 遗留`system.users`集合的以下操作：

- [`bypassDocumentValidation`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-bypassDocumentValidation)
- [`collMod`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collMod)
- [`createCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createCollection)
- [`createIndex`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createIndex)
- [`dropCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropCollection)
- [`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)
- [`insert`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-insert)
- [`remove`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-remove)
- [`update`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-update)

虽然，[`restore`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-restore)[`admin.system.users`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data-admin.system.users)包括使用正常修改操作修改集合中文档的能力，*仅使用*[用户管理方法](https://www.mongodb.com/docs/manual/reference/method/#std-label-user-management-methods)修改这些数据 [。](https://www.mongodb.com/docs/manual/reference/method/#std-label-user-management-methods)

在整个[集群](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-cluster)上，提供以下操作：

- [`bypassWriteBlockingMode`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-bypassWriteBlockingMode)（盯着 MongoDB 6.0）
- [`setUserWriteBlockMode`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-setUserWriteBlockMode)（从 MongoDB 6.0 开始）

>[NOTE]
>
>除此以外
>
>从版本 4.2 开始，MongoDB 删除了  [`system.indexes`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.indexes) 和 [`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces) 集合。 因此，[`dbAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin)角色不再提供访问这些集合的权限。 自 MongoDB 3.0 以来，不推荐直接访问这些集合。
>
>在早期版本中，[`dbAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin) 角色在 [`system.indexes`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.indexes) 和 [`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces)  集合上提供上述特权操作（[`dropCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropCollection)和 [`createCollection`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createCollection) 除外），从而允许直接访问 [`system.indexes`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.indexes) 和 [`system.namespaces`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data--database-.system.namespaces) 集合。

**全数据库角色**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#all-database-roles)

以下角色在`admin`数据库上可用，并提供适用于除`local`和 之外的所有数据库的特权`config`：

- `readAnyDatabase`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readAnyDatabase)

  提供与[`read`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-read)`local`在除和之外的所有数据库上`config`。该角色还提供 [`listDatabases`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listDatabases)对整个集群的操作。另见[`clusterManager`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterManager)和 [`clusterMonitor`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterMonitor)访问`config`和 `local`数据库的角色。

- `readWriteAnyDatabase`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWriteAnyDatabase)

  提供与以下相同的特权[`readWrite`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWrite)`local`在除和之外的所有数据库上`config`。该角色还提供：

  - [`listDatabases`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listDatabases)对整个集群的操作
  - [`compactStructuredEncryptionData`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-compactStructuredEncryptionData)行动_

  另见[`clusterManager`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterManager)和 [`clusterMonitor`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterMonitor)访问`config`和 `local`数据库的角色。

- `userAdminAnyDatabase`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)

  提供与用户管理操作相同的访问权限 [`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)`local`在除和 之外的所有数据库上`config`。[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)还在集群上提供以下特权操作：

  - [`authSchemaUpgrade`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-authSchemaUpgrade)
  - [`invalidateUserCache`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-invalidateUserCache)
  - [`listDatabases`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listDatabases)

  该角色在 `admin` 数据库的 [`system.users`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data-admin.system.users) 和 [`system.roles`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data-admin.system.roles) 集合以及 2.6 之前的 MongoDB 版本的遗留 `system.users` 集合上提供以下特权操作：

  - [`collStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-collStats)
  - [`dbHash`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbHash)
  - [`dbStats`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dbStats)
  - [`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)
  - [`killCursors`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-killCursors)
  - [`planCacheRead`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-planCacheRead)
  - [`createIndex`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-createIndex)
  - [`dropIndex`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-dropIndex)

  这[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)角色不限制用户可以授予的权限。因此，[`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)用户可以授予自己超过当前权限的权限，甚至可以授予自己*所有权限*，即使该角色没有明确授权超出用户管理的权限。这个角色实际上是一个 MongoDB 系统[超级用户。](https://www.mongodb.com/docs/manual/reference/built-in-roles/#std-label-superuser)

  另见[`clusterManager`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterManager)和 [`clusterMonitor`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterMonitor)访问`config`和 `local`数据库的角色。

- `dbAdminAnyDatabase`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdminAnyDatabase)

  在除 `local` 和 `config` 之外的所有数据库上提供与 [`dbAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdmin) 相同的权限。 该角色还提供对整个集群的 [`listDatabases`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-listDatabases) 操作。

  另请参阅[`clusterManager`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterManager)和 [`clusterMonitor`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterMonitor)访问`config`和 `local`数据库的角色。

  从 MongoDB 5.0 开始，[`dbAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdminAnyDatabase)包括 [applyOps](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-internal-actions)特权操作。

**超级用户角色**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#superuser-roles)

多个角色提供间接或直接的系统级超级用户访问权限。

以下角色提供了为任何用户分配对任何数据库的任何权限的能力，这意味着具有这些角色之一的用户可以 *为自己*分配对任何数据库的任何权限：

- [`dbOwner`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbOwner)角色，当范围限定为`admin`数据库时
- [`userAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdmin)角色，当范围限定为`admin`数据库时
- [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)角色

以下角色提供对所有资源的完全权限：

- `root`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-root)

  提供对以下角色*组合*的操作和所有资源的访问权限：

  - [`readWriteAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readWriteAnyDatabase)
  - [`dbAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-dbAdminAnyDatabase)
  - [`userAdminAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)
  - [`clusterAdmin`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-clusterAdmin)
  - [`restore`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-restore)
  - [`backup`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-backup)

  还提供对`system.`集合的[`validate`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-validate) 特权操作。

  *在6.0版中更改*：[`root`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-root)角色包括`config`数据库中`system.preimages` 集合的[`find`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-find)和[`remove`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-remove)权限。

**内部角色**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#internal-role)

- `__system`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-__system)

  MongoDB 将此角色分配给代表集群成员的用户对象，例如副本集成员和[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)实例。该角色授权其持有者对数据库中的任何对象执行任何操作。**除非在特殊情况下，否则不要**将此角色分配给代表应用程序或人工管理员的用户对象。如果您需要访问所有资源的所有操作，例如运行[`applyOps`](https://www.mongodb.com/docs/manual/reference/command/applyOps/#mongodb-dbcommand-dbcmd.applyOps)命令，请不要分配此角色。相反，[创建一个用户定义的角色](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/#std-label-create-user-defined-role)，授予[`anyAction`](https://www.mongodb.com/docs/manual/reference/privilege-actions/#mongodb-authaction-anyAction)并[`anyResource`](https://www.mongodb.com/docs/manual/reference/resource-document/#std-label-resource-anyresource)确保只有需要访问这些操作的用户才具有此访问权限。

 参见

原文 - [Built-In Roles]( https://docs.mongodb.com/manual/reference/built-in-roles/ )

译者：景圣
