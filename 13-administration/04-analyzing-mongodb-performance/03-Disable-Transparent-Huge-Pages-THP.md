## 禁用透明大页 (THP)

透明大页（Transparent Huge Pages，THP）是一种Linux内存管理系统，通过使用更大的内存页来减少具有大量内存的计算机上的转换查找缓冲区（TLB）查找的开销。

然而，启用透明大页（THP）通常会导致数据库工作负载性能下降，因为它们往往具有稀疏而不是连续的内存访问模式。在Linux上运行MongoDB时，为了获得最佳性能，应禁用THP。

为了确保在 [mongod](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 启动之前禁用 THP，您应该为您的平台初始化系统创建一个服务文件，以在启动时禁用 THP。以下提供了针对 systemd 和 System V init 初始化系统的说明。

此外，对于使用 ktune 和 tuned 性能配置文件的 RHEL/CentOS 系统，您还必须创建一个自定义的 tuned 配置文件。

### 创建服务文件

要创建禁用 THP 的服务文件，您将使用平台的内置初始化系统。最新版本的 Linux 倾向于使用**systemd**（它使用该`systemctl`命令），而旧版本的 Linux 倾向于使用**System V init**（它使用该`service`命令）。有关详细信息，请参阅适用于您的操作系统的文档。

使用适合您平台的初始化系统：

#### 系统(systemctl)

1. 创建`systemd`单元文件

   在以下位置创建以下文件`/etc/systemd/system/disable-transparent-huge-pages.service`：

   ```
   [Unit]
   Description=Disable Transparent Huge Pages (THP)
   DefaultDependencies=no
   After=sysinit.target local-fs.target
   Before=mongod.service
   
   [Service]
   Type=oneshot
   ExecStart=/bin/sh -c 'echo never | tee /sys/kernel/mm/transparent_hugepage/enabled > /dev/null'
   
   [Install]
   WantedBy=basic.target
   ```

   > 笔记:
   >
   > 红帽企业 Linux的某些版本以及可能的其他基于 Red Hat 的衍生版本对 THP 文件使用不同的路径`enabled`：
   >
   > ```
   > /sys/kernel/mm/redhat_transparent_hugepage/enabled
   > ```
   >
   > 检查系统上正在使用哪个路径，并`disable-transparent-huge-pages.service`相应地更新文件。

   > 笔记:
   >
   > 在版本 4.2 之前，MongoDB 还会检查 THP *defrag* 设置，并在启用 defrag 时显示启动警告。只要 THP 本身在`systemd`单元文件中被禁用，MongoDB 就不会受到碎片整理设置的影响。但是，为了避免出现此消息，您可以通过在单元文件中现有语句之后`never`添加以下附加行来 设置 defrag ：`systemd``ExecStart`
   >
   > ```
   > ExecStart=/bin/sh -c 'echo never | tee /sys/kernel/mm/transparent_hugepage/defrag > /dev/null'
   > ```
   >
   > 如果在 Red Hat 或类似系统上，文件的路径`defrag`可能会有所不同。有关更多详细信息，请参阅上面的注释，并`disable-transparent-huge-pages.service`相应地更新文件。

2. 重新加载`systemd`单元文件

   运行以下命令重新加载`systemd`单元文件以供 `disable-transparent-huge-pages.service`使用：

   ```
   sudo systemctl daemon-reload
   ```

3. 启动服务

   手动启动服务一次，以确保适当的 THP 设置已更改：

   ```
   sudo systemctl start disable-transparent-huge-pages
   ```

   `[never]`通过运行以下命令验证 THP 是否已成功设置：

   ```
   cat /sys/kernel/mm/transparent_hugepage/enabled
   ```

   在红帽企业 Linux和可能的其他基于 Red Hat 的衍生产品上，您可能需要使用以下命令:

   ```
   cat /sys/kernel/mm/redhat_transparent_hugepage/enabled
   ```

4. 配置您的操作系统以在启动时运行它

   ```
   sudo systemctl enable disable-transparent-huge-pages
   ```

5. 自定义tuned / ktune 配置文件（如果适用）。

   如果您正在使用RHEL `tuned`/ CentOS，则现在还必须创建自定义配置文件。`ktune``tuned`

#### System V init(service)

1. 创建`init.d`脚本

   在以下位置创建以下文件`/etc/init.d/disable-transparent-hugepages`：

   ```
   #!/bin/bash
   ### BEGIN INIT INFO
   # Provides:          disable-transparent-hugepages
   # Required-Start:    $local_fs
   # Required-Stop:
   # X-Start-Before:    mongod mongodb-mms-automation-agent
   # Default-Start:     2 3 4 5
   # Default-Stop:      0 1 6
   # Short-Description: Disable Linux transparent huge pages
   # Description:       Disable Linux transparent huge pages, to improve
   #                    database performance.
   ### END INIT INFO
   
   case $1 in
     start)
       if [ -d /sys/kernel/mm/transparent_hugepage ]; then
         thp_path=/sys/kernel/mm/transparent_hugepage
       elif [ -d /sys/kernel/mm/redhat_transparent_hugepage ]; then
         thp_path=/sys/kernel/mm/redhat_transparent_hugepage
       else
         return 0
       fi
   
       echo 'never' | tee ${thp_path}/enabled > /dev/null
   
       unset thp_path
       ;;
   esac
   ```

   > 笔记
   >
   > 在版本 4.2 之前，MongoDB 还会检查 THP *defrag* 设置，并在启用 defrag 时显示启动警告。只要在`init.d`脚本中禁用 THP 本身，MongoDB 就不会受到碎片整理设置的影响。 但是，为了避免出现此消息，您可以通过在脚本中的语句之前`never`添加以下行来设置碎片整理 ：`init.d``unset thp_path`
   >
   > ```
   > echo 'never' | tee ${thp_path}/defrag > /dev/null
   > ```

2. 使其可执行

   运行以下命令使脚本可执行：

   ```
   sudo chmod 755 /etc/init.d/disable-transparent-hugepages
   ```

3. 运行脚本

   手动运行一次脚本以确保适当的 THP 设置已更改：

   ```
   sudo /etc/init.d/disable-transparent-hugepages start
   ```

   `[never]`通过运行以下命令验证 THP 是否已成功设置：

   ```
   cat /sys/kernel/mm/transparent_hugepage/enabled
   ```

   在 Red Hat Enterprise Linux 和可能的其他基于 Red Hat 的衍生产品上，您可能需要使用以下命令：

   ```
   cat /sys/kernel/mm/redhat_transparent_hugepage/enabled
   ```

4. 配置您的操作系统以在启动时运行它

   要确保每次系统启动时都应用此设置，请针对您的 Linux 发行版运行以下命令：

   | 分配                                       | 命令                                                      |
   | :----------------------------------------- | :-------------------------------------------------------- |
   | Ubuntu 和 Debian                           | `sudo update-rc.d disable-transparent-hugepages defaults` |
   | SUSE                                       | `sudo insserv /etc/init.d/disable-transparent-hugepages`  |
   | Red Hat、CentOS、Amazon Linux 及其衍生产品 | `sudo chkconfig --add disable-transparent-hugepages`      |

5. 自定义tuned / ktune 配置文件（如果适用）

   如果您正在使用RHEL `tuned`/ CentOS，则现在还必须创建自定义配置文件。`ktune``tuned`

### 使用`tuned`和`ktune`

> 重要的
>
> 如果使用`tuned`或`ktune`，您还必须在创建上述服务文件后执行本节中的步骤。

`tuned`和`ktune`是动态内核调整工具，可以影响系统上的透明大页面设置。如果您在运行时在RHEL /CentOS 系统上使用 `tuned`/ ，则必须创建自定义 配置文件以确保 THP 保持禁用状态。`ktune``mongod``tuned`

#### Red Hat/CentOS 6

1. 创建一个新的配置文件

   通过复制相关目录，从现有配置文件创建新配置文件。此示例使用 `virtual-guest`配置文件作为基础，并用作 `virtual-guest-no-thp`新配置文件：

   ```
   sudo cp -r /etc/tune-profiles/virtual-guest /etc/tune-profiles/virtual-guest-no-thp
   ```

2. 编辑`ktune.sh`

   编辑`/etc/tune-profiles/virtual-guest-no-thp/ktune.sh` 并将设置更改`set_transparent_hugepages`为以下内容：

   ```
   set_transparent_hugepages never
   ```

3. 启用新的配置文件

   启用新的配置文件：

   ```
   sudo tuned-adm profile virtual-guest-no-thp
   ```

#### Red Hat/CentOS 7 和 8

1. 创建一个新的配置文件。

   创建一个新目录来保存自定义`tuned`配置文件。此示例继承现有`virtual-guest` 配置文件，并用作`virtual-guest-no-thp`新配置文件：

   ```
   sudo mkdir /etc/tuned/virtual-guest-no-thp
   ```

2. 编辑`tuned.conf`

   创建并编辑，`/etc/tuned/virtual-guest-no-thp/tuned.conf`使其包含以下内容：

   ```
   [main]
   include=virtual-guest
   
   [vm]
   transparent_hugepages=never
   ```

   此示例继承自现有`virtual-guest` 配置文件。选择最适合您的系统的配置文件。

3. 启用新的配置文件

   启用新的配置文件：

   ```
   sudo tuned-adm profile virtual-guest-no-thp
   ```

   



 参见

原文 - [Disable Transparent Huge Pages (THP)]( https://docs.mongodb.com/manual/tutorial/transparent-huge-pages/ )

