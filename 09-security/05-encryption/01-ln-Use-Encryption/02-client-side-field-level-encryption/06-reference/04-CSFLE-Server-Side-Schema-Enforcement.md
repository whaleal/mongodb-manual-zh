# CSFLE 服务器端模式实施

在启用了客户端字段级加密 (CSFLE) 的客户端应用程序中，您可以使用[模式验证](https://www.mongodb.com/docs/manual/core/schema-validation/) 让您的 MongoDB 实例强制对特定字段进行加密。要指定哪些字段需要加密，请将 [自动加密规则关键字](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#std-label-field-level-encryption-json-schema) 与[`$jsonSchema`](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)验证对象一起使用。如果指定的字段不是[`Binary (BinData)`](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/#mongodb-bsontype-Binary) 子类型 6 对象，服务器将拒绝对该集合的任何写操作。

要了解配置为使用自动加密的启用 CSFLE 的客户端在遇到服务器端模式时的行为方式，请参阅[服务器端字段级加密实施。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/automatic-encryption/#std-label-field-level-encryption-automatic-remote-schema)

要了解启用 CSFLE 的客户端配置为使用显式加密时遇到服务器端模式时的行为方式，请参阅[服务器端字段级加密实施。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/manual-encryption/#std-label-csfle-fundamentals-manual-encryption-server-side-schema)

## 例子

考虑一个`hr`带有集合的数据库`employees`。集合中的文档`employees`具有以下形式：

```
{
  "name": "Jane Doe",
  "age": 51
}

```

您希望使用您的集合对客户端应用程序强制执行以下行为：

- 加密`age`字段时，客户端必须遵循以下加密规则：
  - `_id`使用带有of 的数据加密密钥`UUID("e114f7ad-ad7a-4a68-81a7-ebcb9ea0953a")`。
  - 使用 [随机](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-field-level-encryption-random) 加密算法。
  - 该`age`字段必须是整数。
- 加密`name`字段时，客户端必须遵循以下加密规则：
  - `_id`使用带有of 的数据加密密钥`UUID("33408ee9-e499-43f9-89fe-5f8533870617")`。
  - 使用 [确定性](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-field-level-encryption-deterministic) 加密算法。
  - 该`name`字段必须是字符串。

下列[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)代码使用 [`collMod`](https://www.mongodb.com/docs/manual/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令更新`hr.employees` 集合以包含一个`validator`以强制执行上述行为：

```
db.getSiblingDB("hr").runCommand({
  collMod: "employees",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        age: {
          encrypt: {
            keyId: [UUID("e114f7ad-ad7a-4a68-81a7-ebcb9ea0953a")],
            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
            bsonType: "int",
          },
        },
        name: {
          encrypt: {
            keyId: [UUID("33408ee9-e499-43f9-89fe-5f8533870617")],
            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
            bsonType: "string",
          },
        },
      },
    },
  },
});

```

## 了解更多

要了解有关 CSFLE 支持的加密算法的更多信息，请参阅[字段和加密类型。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-csfle-reference-encryption-algorithms)

要了解有关加密模式和加密规则的更多信息，请参阅 [CSFLE 加密模式。](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#std-label-csfle-reference-encryption-schemas)





译者：韩鹏帅

原文：[CSFLE Server-Side Schema Enforcement](https://www.mongodb.com/docs/manual/core/csfle/reference/server-side-schema/)