# 启用访问控制

在 MongoDB 部署上启用访问控制会强制执行身份验证。启用访问控制后，用户需要表明自己的身份，并且只能执行符合分配给其用户的角色授予的权限的操作。

如果您想为独立的 MongoDB 实例启用访问控制，请参考以下资源之一：

- [使用 SCRAM 验证客户端](https://www.mongodb.com/docs/manual/tutorial/configure-scram-client-authentication/)
- [使用 x.509 证书对客户端进行身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-x509-client-authentication/)
- [在 Linux 上使用 Kerberos 身份验证配置 MongoDB](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-with-kerberos-authentication/)
- [在 Windows 上使用 Kerberos 身份验证配置 MongoDB](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-windows-with-kerberos-authentication/)
- [使用 Kerberos 身份验证和 Active Directory 授权配置 MongoDB](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/)
- [通过 ActiveDirectory 使用 SASL 和 LDAP 进行身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-ldap-sasl-activedirectory/)
- [通过 OpenLDAP 使用 SASL 和 LDAP 进行身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-ldap-sasl-openldap/)
- [通过本机 LDAP 使用 Active Directory 对用户进行身份验证和授权](https://www.mongodb.com/docs/manual/tutorial/authenticate-nativeldap-activedirectory/)

如果您想为[副本集](https://www.mongodb.com/docs/manual/replication/)或[分片集群](https://www.mongodb.com/docs/manual/sharding/)启用访问控制，请参考以下资源之一：

- [使用密钥文件身份验证部署副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-with-keyfile-access-control/)
- [将副本集更新为密钥文件身份验证](https://www.mongodb.com/docs/manual/tutorial/enforce-keyfile-access-control-in-existing-replica-set/)
- [将副本集更新为密钥文件身份验证（无停机时间）](https://www.mongodb.com/docs/manual/tutorial/enforce-keyfile-access-control-in-existing-replica-set-without-downtime/)
- [使用密钥文件身份验证部署分片集群](https://www.mongodb.com/docs/manual/tutorial/deploy-sharded-cluster-with-keyfile-access-control/)
- [将 Sharded Cluster 更新为 Keyfile 身份验证](https://www.mongodb.com/docs/manual/tutorial/enforce-keyfile-access-control-in-existing-sharded-cluster/)
- [将分片集群更新为密钥文件身份验证（无停机时间）](https://www.mongodb.com/docs/manual/tutorial/enforce-keyfile-access-control-in-existing-sharded-cluster-no-downtime/)
- [在 Linux 上使用 Kerberos 身份验证配置 MongoDB](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-with-kerberos-authentication/)
- [在 Windows 上使用 Kerberos 身份验证配置 MongoDB](https://www.mongodb.com/docs/manual/tutorial/control-access-to-mongodb-windows-with-kerberos-authentication/)
- [使用 Kerberos 身份验证和 Active Directory 授权配置 MongoDB](https://www.mongodb.com/docs/manual/tutorial/kerberos-auth-activedirectory-authz/)
- [通过 ActiveDirectory 使用 SASL 和 LDAP 进行身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-ldap-sasl-activedirectory/)
- [通过 OpenLDAP 使用 SASL 和 LDAP 进行身份验证](https://www.mongodb.com/docs/manual/tutorial/configure-ldap-sasl-openldap/)
- [通过本机 LDAP 使用 Active Directory 对用户进行身份验证和授权](https://www.mongodb.com/docs/manual/tutorial/authenticate-nativeldap-activedirectory/)

## 下一步

要创建其他用户，请参阅[创建用户。](https://www.mongodb.com/docs/manual/tutorial/create-users/)

要管理用户、分配角色和创建自定义角色，请参阅 [管理用户和角色。](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/)







译者：韩鹏帅

原文：[Enable Access Control](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)
