# configure-Auditing

<a name="81si4"></a>
# Configure Auditing
<a name="s5Hy7"></a>
# 配置审计
On this page<br />在本页

- [Enable and Configure Audit Output]启用和配置审计输出(#enable-and-configure-audit-output)
- [启用和配置审计输出](#enable-and-configure-audit-output)

Auditing in MongoDB Atlas:<br />MONGODB ATLAS中的审计:<br />MongoDB Atlas supports auditing for all `M10` and larger clusters.<br />MongoDB Atlas支持对所有M10更大的集群进行审计。<br />Atlas supports specifying a JSON-formatted audit filter as documented in [Configure Audit Filters](../configure-audit-filters/) and using the Atlas audit filter builder for simplified auditing configuration.<br />Atlas支持指定“[配置审计过滤器](../configure-audit-filters/)”中所述的JSON格式的审计过滤器， 并使用Atlas审计过滤器构建器来简化审计配置。<br />To learn more, see the Atlas documentation for [Set Up Database Auditing](https://docs.atlas.mongodb.com/database-auditing) and [Configure a Custom Auditing Filter](https://docs.atlas.mongodb.com/tutorial/auditing-custom-filter).<br />要了解更多信息，请参阅Atlas文档中的“[设置数据库审计](https://docs.atlas.mongodb.com/database-auditing)和[配置自定义审计过滤器](https://docs.atlas.mongodb.com/tutorial/auditing-custom-filter)”。<br />[MongoDB Enterprise](https://www.mongodb.com/products/mongodb-enterprise-advanced?jmp=docs) supports [auditing](../../core/auditing/#auditing) of various operations.<br />[MongoDB 企业版](https://www.mongodb.com/products/mongodb-enterprise-advanced?jmp=docs)支持[审计](../../core/auditing/#auditing)各种操作。<br />A complete auditing solution must involve **all** [`mongod`](../../reference/program/mongod/#bin.mongod) server and [`mongos`](../../reference/program/mongos/#bin.mongos) router processes.<br />完整的审计解决方案必须涉及所有 [`mongod`](../../reference/program/mongod/#bin.mongod)服务器 和 [`mongos`](../../reference/program/mongos/#bin.mongos) 路由器过程。<br />The audit facility can write audit events to the console, the [syslog](../../reference/glossary/#term-syslog) (option is unavailable on Windows), a JSON file, or a BSON file. For details on the audited operations and the audit log messages, see [System Event Audit Messages](../../reference/audit-message/).<br />审计工具可以将审计事件写入到控制台、[syslog](../../reference/glossary/#term-syslog)（Windows上不提供该 选项）、JSON文件或BSON文件。有关审计的操作和审计日志消息的详细信息，请参阅系统事件审计消息[系统事件审计消息](../../reference/audit-message/)。
<a name="vC0Gu"></a>
## Enable and Configure Audit Output[¶](#enable-and-configure-audit-output)
<a name="3UtvD"></a>
## 启用和配置审计输出
Use the [`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination) option to enable auditing and specify where to output the audit events.<br />使用该[`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination)选项可以启用审计并指定在何处输出审计事件。<br />Warning<br />警告<br />For sharded clusters, if you enable auditing on [`mongos`](../../reference/program/mongos/#bin.mongos) instances, you must enable auditing on all [`mongod`](../../reference/program/mongod/#bin.mongod) instances in the cluster, i.e. shards and config servers.<br />对于分片群集，如果对[`mongos`](../../reference/program/mongos/#bin.mongos)实例启用审计，则必须对群集中的所有[`mongod`](../../reference/program/mongod/#bin.mongod)实例（即分片和配置服务器）启用审计。
<a name="1Ou8T"></a>
### Output to Syslog[¶](#output-to-syslog)
<a name="jKNlT"></a>
### 输出到[Syslog](#output-to-syslog)
To enable auditing and print audit events to the syslog (option is unavailable on Windows) in JSON format, specify `syslog` for the [`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination) setting. For example:<br />要启用审计并将审计事件以JSON格式打印到syslog（在Windows上该选项不可用），请为[`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination)设置为syslog。例如：
```sh
mongod --dbpath data/db --auditDestination syslog
```
Include additional options as required for your configuration. For instance, if you wish remote clients to connect to your deployment or your deployment members are run on different hosts, specify the `--bind_ip`. For more information, see [Localhost Binding Compatibility Changes](../../release-notes/3.6-compatibility/#bind-ip-compatibility).<br />包括配置所需的其他选项。例如，如果您希望远程客户端连接到您的部署，或者您的部署成员在不同的主机上运行，请指定 --bind_ip。有关更多信息，请参见 [Localhost绑定兼容性更改](../../release-notes/3.6-compatibility/#bind-ip-compatibility)。<br />Important<br />重要<br />Before you bind to other ip addresses, consider [enabling access control](../../administration/security-checklist/#checklist-auth) and other security measures listed in [Security Checklist](../../administration/security-checklist/) to prevent unauthorized access.<br />绑定到其他IP地址之前，请考虑[启用范围控制](../../administration/security-checklist/#checklist-auth)和其他<br />绑定到其他IP地址之前，请考虑启用[“安全性检查表”](../../administration/security-checklist/) 中列出的[访问控制](../../administration/security-checklist/#checklist-auth)和其他安全措施，以防止未经授权的访问。<br />Warning<br />警告<br />The syslog message limit can result in the truncation of the audit messages. The auditing system will neither detect the truncation nor error upon its occurrence.<br />syslog消息限制可能导致审计消息被截断。审计系统不会在发生截断时检测到截断或错误。<br />You may also specify these options in the [configuration file](../../reference/configuration-options/):<br />您也可以在[配置文件](../../reference/configuration-options/)中指定以下选项：
```
storage:
   dbPath: data/db
auditLog:
   destination: syslog
```
<a name="Fe9s3"></a>
### Output to Console[¶](#output-to-console)
<a name="8apCE"></a>
### 输出到控制台
To enable auditing and print the audit events to standard output (i.e. `stdout`), specify `console` for the [`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination) setting. For example:<br />要启用审计并将审计事件打印到标准输出（即stdout），请为[`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination)指定参数为'console'。例如：
```sh
mongod --dbpath data/db --auditDestination console
```
Include additional options as required for your configuration. For instance, if you wish remote clients to connect to your deployment or your deployment members are run on different hosts, specify the `--bind_ip`. For more information, see [Localhost Binding Compatibility Changes](../../release-notes/3.6-compatibility/#bind-ip-compatibility).<br />包括配置所需的其他选项。例如，如果您希望远程客户端连接到您的部署，或者您的部署成员在不同的主机上运行，请指定 --bind_ip。有关更多信息，请参见 [Localhost绑定兼容性更改](../../release-notes/3.6-compatibility/#bind-ip-compatibility)。<br />Important<br />重要<br />Before you bind to other ip addresses, consider [enabling access control](../../administration/security-checklist/#checklist-auth) and other security measures listed in [Security Checklist](../../administration/security-checklist/) to prevent unauthorized access.<br />绑定到其他IP地址之前，请考虑启用“安全性检查表”中列出的访问控制和其他安全措施，以防止未经授权的访问。<br />You may also specify these options in the [configuration file](../../reference/configuration-options/):<br />您也可以在[配置文件中](../../reference/configuration-options/)指定以下选项：
```yml
storage:
   dbPath: data/db
auditLog:
   destination: console
```
<a name="iJDGS"></a>
### Output to JSON File[¶](#output-to-json-file)
<a name="FdftG"></a>
### 输出到JSON文件[¶](#output-to-json-file)
To enable auditing and print audit events to a file in JSON format, specify the following options:<br />要启用审计并将审计事件打印为BSON二进制格式的文件，请指定以下选项：<br />Option    Value<br />[`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination)  `file`<br />[`--auditFormat`](../../reference/program/mongod/#cmdoption-mongod-auditformat)  `JSON`<br />[`--auditPath`](../../reference/program/mongod/#cmdoption-mongod-auditpath) The output filename. Accepts either the full path name or relative path name.
<a name="6Wfr6"></a>
## 选项            值
<a name="KDUze"></a>
## [`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination)   `file`
<a name="fMInB"></a>
## [`--auditFormat`](../../reference/program/mongod/#cmdoption-mongod-auditformat)     `JSON`
[`--auditPath`](../../reference/program/mongod/#cmdoption-mongod-auditpath)       输出文件名，接受完整路径名或相对路径名。<br />For example, the following enables auditing and records audit events to a file with the relative path name of `data/db/auditLog.json`:<br />例如，以下选项启用审计并将审计事件记录到相对路径'data/db/auditLog.json'的文件中：
```sh
mongod --dbpath data/db --auditDestination file --auditFormat JSON --auditPath data/db/auditLog.json
```
Include additional options as required for your configuration. For instance, if you wish remote clients to connect to your deployment or your deployment members are run on different hosts, specify the `--bind_ip`. For more information, see [Localhost Binding Compatibility Changes](../../release-notes/3.6-compatibility/#bind-ip-compatibility).<br />包括配置所需的其他选项。例如，如果您希望远程客户端连接到您的部署，或者您的部署成员在不同的主机上运行，请指定--bind_ip参数。有关更多信息，请参见[Localhost绑定兼容性更改](../../release-notes/3.6-compatibility/#bind-ip-compatibility)。<br />Important:<br />重要：<br />Before you bind to other ip addresses, consider [enabling access control](../../administration/security-checklist/#checklist-auth) and other security measures listed in [Security Checklist](../../administration/security-checklist/) to prevent unauthorized access.<br />绑定到其他IP地址之前，请考虑启用[“安全性检查表”](../../administration/security-checklist/)中列出的[访问控制](../../administration/security-checklist/#checklist-auth)和其他安全措施，以防止未经授权的访问。<br />The audit file rotates at the same time as the server log file.<br />审计文件与服务器日志文件同时旋转。<br />You may also specify these options in the [configuration file](../../reference/configuration-options/):<br />您也可以在[配置文件](../../reference/configuration-options/)中指定以下选项：
```yml
storage:
   dbPath: data/db
auditLog:
   destination: file
   format: JSON
   path: data/db/auditLog.json
```
Note<br />注意<br />Printing audit events to a file in JSON format degrades server performance more than printing to a file in BSON format.<br />与以BSON格式打印到文件相比，以JSON格式打印审计事件到文件的性能降低服务器性能。
<a name="4Srih"></a>
### Output to BSON File[¶](#output-to-bson-file)
<a name="C89tu"></a>
### 输出到BSON文件 [¶](#output-to-bson-file)
To enable auditing and print audit events to a file in BSON binary format, specify the following options:<br />要启用审计并将审计事件打印为BSON二进制格式的文件，请指定以下选项：<br />Option  Value<br />[`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination) `file`<br />[`--auditFormat`](../../reference/program/mongod/#cmdoption-mongod-auditformat) `BSON`<br />[`--auditPath`](../../reference/program/mongod/#cmdoption-mongod-auditpath)  The output filename. Accepts either the full path name or relative path name.
<a name="EDPjn"></a>
## 选项            值
<a name="mlbZi"></a>
## [`--auditDestination`](../../reference/program/mongod/#cmdoption-mongod-auditdestination)   `file`
<a name="zZVTU"></a>
## [`--auditFormat`](../../reference/program/mongod/#cmdoption-mongod-auditformat)     `BSON`
[`--auditPath`](../../reference/program/mongod/#cmdoption-mongod-auditpath)        输出文件名，接受完整路径名或相对路径名。<br />For example, the following enables auditing and records audit events to a BSON file with the relative path name of `data/db/auditLog.bson`:<br />例如，以下选项启用审计并将审计事件记录到相对路径'data/db/auditLog.bson'的文件中：
```sh
mongod --dbpath data/db --auditDestination file --auditFormat BSON --auditPath data/db/auditLog.bson
```
Include additional options as required for your configuration. For instance, if you wish remote clients to connect to your deployment or your deployment members are run on different hosts, specify the `--bind_ip`. For more information, see [Localhost Binding Compatibility Changes](../../release-notes/3.6-compatibility/#bind-ip-compatibility).<br />Important<br />重要<br />Before you bind to other ip addresses, consider [enabling access control](../../administration/security-checklist/#checklist-auth) and other security measures listed in [Security Checklist](../../administration/security-checklist/) to prevent unauthorized access.<br />绑定到其他IP地址之前，请考虑启用[“安全性检查表”](../../administration/security-checklist/)中列出的[访问控制](../../administration/security-checklist/#checklist-auth)和其他安全措施，以防止未经授权的访问。<br />The audit file rotates at the same time as the server log file.<br />审计文件与服务器日志文件同时旋转。<br />You may also specify these options in the [configuration file](../../reference/configuration-options/):<br />您也可以在[配置文件](../../reference/configuration-options/)中指定以下选项：
```yml
storage:
   dbPath: data/db
auditLog:
   destination: file
   format: BSON
   path: data/db/auditLog.bson
```
To view the contents of the file, pass the file to the MongoDB utility [`bsondump`](../../reference/program/bsondump/#bin.bsondump). For example, the following converts the audit log into a human-readable form and output to the terminal:<br />要查看文件的内容，请将文件传递给MongoDB实用程序 bsondump。例如，以下内容将审计日志转换为可读格式并输出到终端：
```sh
bsondump data/db/auditLog.bson
```
See also<br />也可以看<br />[Configure Audit Filters](../configure-audit-filters/), [Auditing](../../core/auditing/), [System Event Audit Messages](../../reference/audit-message/)<br />[配置审计过滤器](../configure-audit-filters/)，[审计](../../core/auditing/)，[系统事件审计消息](../../reference/audit-message/)<br />
<br />
<br />
