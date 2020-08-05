# [Configure Auditing](#configure-auditing "Permalink to this headline")
# 配置审计

On this page
在本页
*   [启用和配置审计输出](#enable-and-configure-audit-output)
*   [启用和配置审计输出](#enable-and-configure-audit-output)

Auditing in MongoDB Atlas:
MONGODB ATLAS中的审计:

MongoDB Atlas supports auditing for all `M10` and larger clusters. 
MongoDB Atlas支持对所有M10更大的集群进行审计。
Atlas supports specifying a JSON-formatted audit filter as documented in [Configure Audit Filters](../configure-audit-filters/) and using the Atlas audit filter builder for simplified auditing configuration. 
Atlas支持指定“[配置审计过滤器](../configure-audit-filters/)”中所述的JSON格式的审计过滤器， 并使用Atlas审计过滤器构建器来简化审计配置。
To learn more, see the Atlas documentation for [Set Up Database Auditing](https://docs.atlas.mongodb.com/database-auditing) and [Configure a Custom Auditing Filter](https://docs.atlas.mongodb.com/tutorial/auditing-custom-filter).
要了解更多信息，请参阅Atlas文档中的“[设置数据库审计](https://docs.atlas.mongodb.com/database-auditing)和[配置自定义审计过滤器](https://docs.atlas.mongodb.com/tutorial/auditing-custom-filter)”。


[MongoDB Enterprise](https://www.mongodb.com/products/mongodb-enterprise-advanced?jmp=docs) supports [auditing](../../core/auditing/#auditing) of various operations.
[MongoDB 企业版](https://www.mongodb.com/products/mongodb-enterprise-advanced?jmp=docs)支持[审计](../../core/auditing/#auditing)各种操作。
A complete auditing solution must involve **all** [`mongod`](../../reference/program/mongod/#bin.mongod "bin.mongod") server and [`mongos`](../../reference/program/mongos/#bin.mongos "bin.mongos") router processes.
完整的审计解决方案必须涉及所有 [`mongod`](../../reference/program/mongod/#bin.mongod "bin.mongod")服务器 和 [`mongos`](../../reference/program/mongos/#bin.mongos "bin.mongos") 路由器过程。

The audit facility can write audit events to the console, the [syslog](../../reference/glossary/#term-syslog) (option is unavailable on Windows), a JSON file, or a BSON file. For details on the audited operations and the audit log messages, see [System Event Audit Messages](../../reference/audit-message/).
审计工具可以将审计事件写入到控制台、[syslog](../../reference/glossary/#term-syslog)（Windows上不提供该 选项）、JSON文件或BSON文件。有关审计的操作和审计日志消息的详细信息，请参阅系统事件审计消息[系统事件审计消息](../../reference/audit-message/)。

## Enable and Configure Audit Output[¶](#enable-and-configure-audit-output "Permalink to this headline")
## 启用和配置审计输出

Use the [`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination) option to enable auditing and specify where to output the audit events.
使用该[`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination)选项可以启用审计并指定在何处输出审计事件。

Warning
警告

For sharded clusters, if you enable auditing on [`mongos`](../../reference/program/mongos/#bin.mongos "bin.mongos") instances, you must enable auditing on all [`mongod`](../../reference/program/mongod/#bin.mongod "bin.mongod") instances in the cluster, i.e. shards and config servers.
对于分片群集，如果对[`mongos`](../../reference/program/mongos/#bin.mongos "bin.mongos")实例启用审计，则必须对群集中的所有[`mongod`](../../reference/program/mongod/#bin.mongod "bin.mongod")实例（即分片和配置服务器）启用审计。

### Output to Syslog[¶](#output-to-syslog "Permalink to this headline")
### 输出到[Syslog](#output-to-syslog "Permalink to this headline")

To enable auditing and print audit events to the syslog (option is unavailable on Windows) in JSON format, specify `syslog` for the [`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination) setting. For example:
要启用审计并将审计事件以JSON格式打印到syslog（在Windows上该选项不可用），请为[`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination)设置为syslog。例如：

```sh
mongod --dbpath data/db --auditDestination syslog
```
Include additional options as required for your configuration. For instance, if you wish remote clients to connect to your deployment or your deployment members are run on different hosts, specify the `--bind_ip`. For more information, see [Localhost Binding Compatibility Changes](../../release-notes/3.6-compatibility/#bind-ip-compatibility).

包括配置所需的其他选项。例如，如果您希望远程客户端连接到您的部署，或者您的部署成员在不同的主机上运行，请指定 --bind_ip。有关更多信息，请参见 [Localhost绑定兼容性更改](../../release-notes/3.6-compatibility/#bind-ip-compatibility)。

Important
重要

Before you bind to other ip addresses, consider [enabling access control](../../administration/security-checklist/#checklist-auth) and other security measures listed in [Security Checklist](../../administration/security-checklist/) to prevent unauthorized access.
绑定到其他IP地址之前，请考虑[启用范围控制](../../administration/security-checklist/#checklist-auth)和其他
绑定到其他IP地址之前，请考虑启用[“安全性检查表”](../../administration/security-checklist/) 中列出的[访问控制](../../administration/security-checklist/#checklist-auth)和其他安全措施，以防止未经授权的访问。

Warning
警告

The syslog message limit can result in the truncation of the audit messages. The auditing system will neither detect the truncation nor error upon its occurrence.
syslog消息限制可能导致审计消息被截断。审计系统不会在发生截断时检测到截断或错误。

You may also specify these options in the [configuration file](../../reference/configuration-options/):
您也可以在[配置文件](../../reference/configuration-options/)中指定以下选项：

```yml
storage:
   dbPath: data/db
auditLog:
   destination: syslog
```

### Output to Console[¶](#output-to-console "Permalink to this headline")
### 输出到控制台

To enable auditing and print the audit events to standard output (i.e. `stdout`), specify `console` for the [`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination) setting. For example:
要启用审计并将审计事件打印到标准输出（即stdout），请为[`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination)指定参数为'console'。例如：

```sh
mongod --dbpath data/db --auditDestination console
```
Include additional options as required for your configuration. For instance, if you wish remote clients to connect to your deployment or your deployment members are run on different hosts, specify the `--bind_ip`. For more information, see [Localhost Binding Compatibility Changes](../../release-notes/3.6-compatibility/#bind-ip-compatibility).
包括配置所需的其他选项。例如，如果您希望远程客户端连接到您的部署，或者您的部署成员在不同的主机上运行，请指定 --bind_ip。有关更多信息，请参见 [Localhost绑定兼容性更改](../../release-notes/3.6-compatibility/#bind-ip-compatibility)。

Important
重要

Before you bind to other ip addresses, consider [enabling access control](../../administration/security-checklist/#checklist-auth) and other security measures listed in [Security Checklist](../../administration/security-checklist/) to prevent unauthorized access.
绑定到其他IP地址之前，请考虑启用“安全性检查表”中列出的访问控制和其他安全措施，以防止未经授权的访问。

You may also specify these options in the [configuration file](../../reference/configuration-options/):
您也可以在[配置文件中](../../reference/configuration-options/)指定以下选项：

```yml
storage:
   dbPath: data/db
auditLog:
   destination: console
```

### Output to JSON File[¶](#output-to-json-file "Permalink to this headline")
### 输出到JSON文件[¶](#output-to-json-file "Permalink to this headline")

To enable auditing and print audit events to a file in JSON format, specify the following options:
要启用审计并将审计事件打印为BSON二进制格式的文件，请指定以下选项：

Option    Value

[`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination)  `file`

[`--auditFormat`](../../reference/program/mongod/#cmdoption-mongod-auditformat)  `JSON`

[`--auditPath`](../../reference/program/mongod/#cmdoption-mongod-auditpath) The output filename. Accepts either the full path name or relative path name.

选项 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;值 
------
[`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination) &emsp;&emsp;`file`
------
[`--auditFormat`](../../reference/program/mongod/#cmdoption-mongod-auditformat)&emsp;&emsp;&emsp;&emsp;&emsp;`JSON`
------
[`--auditPath`](../../reference/program/mongod/#cmdoption-mongod-auditpath) &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;输出文件名，接受完整路径名或相对路径名。


For example, the following enables auditing and records audit events to a file with the relative path name of `data/db/auditLog.json`:
例如，以下选项启用审计并将审计事件记录到相对路径'data/db/auditLog.json'的文件中：

```sh
mongod --dbpath data/db --auditDestination file --auditFormat JSON --auditPath data/db/auditLog.json
```

Include additional options as required for your configuration. For instance, if you wish remote clients to connect to your deployment or your deployment members are run on different hosts, specify the `--bind_ip`. For more information, see [Localhost Binding Compatibility Changes](../../release-notes/3.6-compatibility/#bind-ip-compatibility).
包括配置所需的其他选项。例如，如果您希望远程客户端连接到您的部署，或者您的部署成员在不同的主机上运行，请指定--bind_ip参数。有关更多信息，请参见[Localhost绑定兼容性更改](../../release-notes/3.6-compatibility/#bind-ip-compatibility)。

Important:
重要：
Before you bind to other ip addresses, consider [enabling access control](../../administration/security-checklist/#checklist-auth) and other security measures listed in [Security Checklist](../../administration/security-checklist/) to prevent unauthorized access.
绑定到其他IP地址之前，请考虑启用[“安全性检查表”](../../administration/security-checklist/)中列出的[访问控制](../../administration/security-checklist/#checklist-auth)和其他安全措施，以防止未经授权的访问。

The audit file rotates at the same time as the server log file.
审计文件与服务器日志文件同时旋转。

You may also specify these options in the [configuration file](../../reference/configuration-options/):
您也可以在[配置文件](../../reference/configuration-options/)中指定以下选项：
```yml
storage:
   dbPath: data/db
auditLog:
   destination: file
   format: JSON
   path: data/db/auditLog.json
```

Note
注意

Printing audit events to a file in JSON format degrades server performance more than printing to a file in BSON format.
与以BSON格式打印到文件相比，以JSON格式打印审计事件到文件的性能降低服务器性能。

### Output to BSON File[¶](#output-to-bson-file "Permalink to this headline")
### 输出到BSON文件 [¶](#output-to-bson-file "Permalink to this headline")
To enable auditing and print audit events to a file in BSON binary format, specify the following options:
要启用审计并将审计事件打印为BSON二进制格式的文件，请指定以下选项：  

Option  Value

[`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination) `file`

[`--auditFormat`](../../reference/program/mongod/#cmdoption-mongod-auditformat) `BSON`

[`--auditPath`](../../reference/program/mongod/#cmdoption-mongod-auditpath)  The output filename. Accepts either the full path name or relative path name.

选项 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;值 
------
[`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination) &emsp;&emsp;`file`
------
[`--auditFormat`](../../reference/program/mongod/#cmdoption-mongod-auditformat)&emsp;&emsp;&emsp;&emsp;&emsp;`BSON`
------
[`--auditPath`](../../reference/program/mongod/#cmdoption-mongod-auditpath) &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; 输出文件名，接受完整路径名或相对路径名。


For example, the following enables auditing and records audit events to a BSON file with the relative path name of `data/db/auditLog.bson`:
例如，以下选项启用审计并将审计事件记录到相对路径'data/db/auditLog.bson'的文件中：

```sh
mongod --dbpath data/db --auditDestination file --auditFormat BSON --auditPath data/db/auditLog.bson
```

Include additional options as required for your configuration. For instance, if you wish remote clients to connect to your deployment or your deployment members are run on different hosts, specify the `--bind_ip`. For more information, see [Localhost Binding Compatibility Changes](../../release-notes/3.6-compatibility/#bind-ip-compatibility).

Important
重要
Before you bind to other ip addresses, consider [enabling access control](../../administration/security-checklist/#checklist-auth) and other security measures listed in [Security Checklist](../../administration/security-checklist/) to prevent unauthorized access.
绑定到其他IP地址之前，请考虑启用[“安全性检查表”](../../administration/security-checklist/)中列出的[访问控制](../../administration/security-checklist/#checklist-auth)和其他安全措施，以防止未经授权的访问。

The audit file rotates at the same time as the server log file.
审计文件与服务器日志文件同时旋转。

You may also specify these options in the [configuration file](../../reference/configuration-options/):
您也可以在[配置文件](../../reference/configuration-options/)中指定以下选项：
```yml
storage:
   dbPath: data/db
auditLog:
   destination: file
   format: BSON
   path: data/db/auditLog.bson
```

To view the contents of the file, pass the file to the MongoDB utility [`bsondump`](../../reference/program/bsondump/#bin.bsondump "bin.bsondump"). For example, the following converts the audit log into a human-readable form and output to the terminal:
要查看文件的内容，请将文件传递给MongoDB实用程序 bsondump。例如，以下内容将审计日志转换为可读格式并输出到终端：

```sh
bsondump data/db/auditLog.bson
```
See also
也可以看

[Configure Audit Filters](../configure-audit-filters/), [Auditing](../../core/auditing/), [System Event Audit Messages](../../reference/audit-message/)
[配置审计过滤器](../configure-audit-filters/)，[审计](../../core/auditing/)，[系统事件审计消息](../../reference/audit-message/)

原文链接：https://docs.mongodb.com/manual/tutorial/configure-auditing/

译者：谢伟成
