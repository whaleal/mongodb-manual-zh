# 安装 `mongosh`

### 前置条件

要使用 MongoDB shell程序，必须有MongoDB服务才能连接到。

* 对于免费的云托管部署，您可以使用MongoDBAtlas。
* 要了解如何运行本地MongoDB服务，请参见 [安装MongoDB。](https://www.mongodb.com/docs/manual/installation/)

### 支持的MongoDB版本

您可以使用 MongoDB shell程序 连接到MongoDB版本4.2或 更大。

# 安装程序

为您的操作系统选择适当的选项：

### Windows操作系统 :

> 注：
>
> 在Windows上，`mongosh`首选项和配置选项 存储在`%APPDATA%/mongodb/mongosh`目录中。

#### 从MSI安装

1. 打开MongoDBShell下载页面

   打开 [MongoDB下载中心。](https://www.mongodb.com/try/download/shell?jmp=docs)

2. 在 平台 下拉列表中，选择 Windows 64位（8.1+）（MSI）

3. 单击 下载。

4. 双击安装程序文件。

5. 按照提示安装`mongosh`。

#### 从 `.zip` 文件安装

1. 打开MongoDBShell下载页面。

   打开 [MongoDB下载中心。](https://www.mongodb.com/try/download/shell?jmp=docs)

2. 下载 `mongosh`操作系统安装存档文件

   下载适合您的操作系统的`mongosh`版本。MongoDB还提供了使用系统的OpenSSL安装的`mongosh`版本。有关详细信息，请参见[MongoDB下载中心](https://www.mongodb.com/try/download/shell?jmp=docs)。

3. 从下载的归档文件中解压缩文件。

4. 将 `mongosh` 二进制文件添加到`PATH`环境变量中。

   确保提取的MongoDBShell二进制文件位于所需的 文件系统中的位置，然后将该位置添加到PATH `PATH` 环境变量。

   要将MongoDBShell二进制文件的位置添加到 `PATH` 环境变量：

   **a. 打开 控制面板。**

   **b. 在“系统和安全性”类别中，单击“系统”。**

   **c. 单击高级系统设置。将显示"系统属性"模式。**

   **d. 单击“环境变量”。**

   **e. 在“系统变量”区域中，选择“路径”并单击“编辑”。将显示“编辑”环境变量模态。**

   **f.单击New并将文件路径添加到mongosh二进制文件中。**

   **g. 单击“确定”确认更改。在每个其他模态上，单击“确定”以确认更改。**

要确认PATH环境变量是否正确配置为查找mongosh，请打开命令提示符并输入mongosh --help命令。如果PATH配置正确，将显示有效命令的列表。



### macos操作系统：

#### 使用自制程序安装

> 重要：
>
> 要查看Homebrew系统要求的完整列表，请参阅[Homebrew网站](https://docs.brew.sh/Installation)。

Homebrew软件包管理器是在macOS上安装[mongosh](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)的推荐方法。要了解如何从归档文件手动安装[mongosh](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，请参阅[从.zip文件安装](https://www.mongodb.com/docs/mongodb-shell/install/#std-label-macos-install-archive)。

##### 考虑因素

[`与`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) Homebrew一起安装的mongosh不支持 [自动客户端字段级加密。](https://www.mongodb.com/docs/manual/core/security-automatic-client-side-encryption/)

##### 程序

要使用Homebrew安装[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

1. 安装自制软件

   请参阅 [Homebrew](https://brew.sh/) 网站 了解在macOS上安装Homebrew的步骤。

2. 安装 `mongosh`包。

   从终端发出以下命令以安装 `mongosh` 软件包：

   ```bash
   brew install mongosh
   ```

#### 从 `.zip` 文件安装

要使用下载的.zip文件手动安装mongosh：

1. 打开MongoDBShell下载页面。

   打开 [MongoDB下载中心。](https://www.mongodb.com/try/download/shell?jmp=docs)

2. 下载 `mongosh`操作系统安装存档文件。

   下载适合您的操作系统的mongosh版本。MongoDB还提供了使用系统的OpenSSL安装的mongosh版本。有关详细信息，请参见[MongoDB下载中心](https://www.mongodb.com/try/download/shell?jmp=docs)。

3. 从下载的归档文件中解压缩文件。

   从包含 `mongosh` `.zip压缩`包：

   ```bash
   unzip mongosh-1.6.2-darwin-x64.zip
   ```

   解压缩的bin文件夹包含两个二进制文件：mongosh和mongosh_csfle_v1.dylib。

   如果您的Web浏览器在下载过程中自动提取归档文件，或者您提取归档文件时没有使用unzip命令，则可能需要将二进制文件设置为可执行文件。从解压缩归档文件的目录中运行以下命令：

   ```
   chmod +x bin/mongosh
   ```

4. 将下载的二进制文件添加到PATH环境变量中。

   您可以：

   * 将mongosh二进制文件复制到PATH变量中列出的目录中，例如/usr/local/bin。从解压缩下载文件的目录中运行以下命令：

     ```
     sudo cp mongosh /usr/local/bin/
     sudo cp mongosh_csfle_v1.so /usr/local/lib/
     ```

     对于支持OpenSSL的`mongosh`包，您将看到一个不同的`. so`文件。例如，`mongosh_crypt_v1.so`。请在上一个命令中使用该文件。

   * 创建指向`MongoDB Shell`的符号链接。切换到从`.tgz`归档文件中解压缩文件的目录。运行以下命令，创建指向`PATH`中已有目录（例如`/usr/local/bin`）的链接。

     ```
     sudo ln -s $(pwd)/bin/* /usr/local/bin/
     ```

5. 允许macOS运行`mongosh`。

   macOS可能会阻止mongosh在安装后运行。如果您在启动mongosh时收到安全错误，指出无法识别或验证开发者，请执行以下操作：

   **a. 打开 *系统偏好设置*。**

   **b. 选择“*安全和隐私”*窗格。**

   **c. 在 *一般情况*选项卡上，单击 消息关于 `mongosh` ，标记为 始终打开 或 始终允许具体取决于您的macOS版本。**



### linux操作系统：

#### 程序

根据您的Linux发行版选择适当的选项卡，然后 从下面的选项卡选择所需的包装：

* 要在Ubuntu 20.04（Focal）、Ubuntu 18.04（Bionic）和Debian上安装.deb软件包，请看.deb标签。
* 要在RHEL或Amazon Linux 2上安装.rpm软件包，请单看.rpm选项卡。
* 要安装.tgz tarball，请单看.tgz选项卡。



#### .deb安装

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 可作为 PPA 适用于Ubuntu 20.04（Focal）和Ubuntu 18.04 （Bionic）。

1. **导入程序包管理系统使用的公钥**

   从终端发出以下命令以导入 来自https：//www.mongodb.org/static/pgp/server-6.0.asc的MongoDB公共GPG密钥： https://www.mongodb.org/static/pgp/server-6.0.asc :

   ```
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   ```

   操作应响应`OK`。

   但是，如果您收到一个错误，指出`gnupg`没有 安装后，您可以：

   * 使用以下命令安装gnupg及其所需的库：

     ```bash
     sudo apt-get install gnupg
     ```

   * 安装后，请重试导入密钥：

     ```bash
     wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
     ```

2. **为MongoDB创建一个列表文件**

   创建列表文件 `/etc/apt/sources.list.d/mongodb-org-6.0.list`. Ubuntu的版本。

   单击与您的Ubuntu版本对应的选项卡。 如果您不确定主机运行的是哪个Ubuntu版本， 在主机上打开终端或shell，然后执行`lsb_release -dc`。

   * **Ubuntu 20.04 (Focal)方法：**

     为Ubuntu 20.04（Focal）创建/etc/apt/sources.list.d/mongodb-org-6.0.list文件：

     ```
     echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
     ```

   * **Ubuntu 18.04 (Bionic)方法：**

     创建Ubuntu 18.04（Bionic）的/etc/apt/sources.list.d/mongodb-org-6.0.list文件：

     ```
     echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
     ```

3. **重新加载本地程序包数据库。**

   发出以下命令以重新加载本地程序包数据库：

   ```
   sudo apt-get update
   ```

4. **安装 `mongosh`包。**

   要安装mongosh的最新稳定版本，请使用以下命令：

   ```
   sudo apt-get install -y mongodb-mongosh
   ```

   MongoDB还提供`了`使用系统的 OpenSSL库。

   要安装使用OpenSSL 1.1的mongosh，请使用以下命令：

   ```
   sudo apt-get install -y mongodb-mongosh-shared-openssl11
   ```

   要安装使用OpenSSL 3.0的mongosh，请发出以下命令：

   ```
   sudo apt-get install -y mongodb-mongosh-shared-openssl3
   ```



#### .rpm安装

mongosh可作为RHEL和Amazon Linux 2的yum软件包提供。

1. **配置包管理系统（yum）**

   创建一个/etc/yum.repos.d/mongodb-org-6.0.repo文件，这样您就可以直接使用yum安装mongosh。

   RHEL和Amazon Linux都有.rpm发行版。

   * 根据你的版本选择下面的内容。
   * 复制选项卡的内容。
   * 将内容粘贴到.repo文件中。

   **RHEL:**

   ```
   [mongodb-org-6.0]
   name=MongoDB Repository
   baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/6.0/$basearch/
   gpgcheck=1
   enabled=1
   gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
   ```

   **您还可以直接从[MongoDB存储库](https://repo.mongodb.org/yum/amazon/)下载.rpm文件**
   **按以下顺序：**

   * Red Hat或CentOS版本（例如，8）
   * MongoDB版本（例如，mongodb-enterprise）
   * MongoDB发布版本（例如，6.0）
   * 体系结构（例如，x86_64）

   **Amazon Linux:**

   ```
   [mongodb-org-6.0]
   name=MongoDB Repository
   baseurl=https://repo.mongodb.org/yum/amazon/$releasever/mongodb-org/6.0/$basearch/
   gpgcheck=1
   enabled=1
   gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
   ```

   **您还可以直接从[MongoDB存储库](https://repo.mongodb.org/yum/amazon/)下载.rpm文件**
   **按以下顺序：**

   * Amazon Linux版本（例如，2）
   * MongoDB[发布版本](https://www.mongodb.com/docs/manual/reference/versioning/)（例如，6.0）
   * 体系结构（例如，x86_64）

2. **安装 `mongosh`。**

   要安装mongosh的最新稳定版本，请使用以下命令：

   ```
   sudo yum install -y mongodb-mongosh
   ```

   MongoDB还提供了使用系统OpenSSL库的mongosh版本。
   要安装使用OpenSSL 1.1的mongosh，请发出以下命令：

   ```
   sudo yum install -y mongodb-mongosh-shared-openssl11
   ```

   要安装使用OpenSSL 3.0的mongosh，请发出以下命令：

   ```
   sudo yum install -y mongodb-mongosh-shared-openssl3
   ```

#### .tgz安装

1. **打开MongoDBShell下载页面。**

   打开[MongoDB下载中心](https://www.mongodb.com/try/download/shell?jmp=docs)。

2. **下载Linux 64位.tgz软件包。**

   下载适合您的操作系统的`mongosh`版本。MongoDB还提供了使用系统的OpenSSL安装的`mongosh`版本。有关详细信息，请参见[MongoDB下载中心](https://www.mongodb.com/try/download/shell?jmp=docs)。

3. **从下载的归档文件中解压缩文件。**

   从下载的归档文件中解压缩文件。例如，从包含下载的. tgz软件包的目录中运行以下命令：

   ```
   tar -zxvf mongosh-1.6.2-linux-x64.tgz
   ```

   您需要在命令中提供确切的.tgz软件包，具体取决于您下载的软件包版本。例如，mongosh OpenSSL 3软件包为：

   ```
   mongosh-1.6.2-linux-x64-openssl3.tgz
   ```

   解压缩的bin文件夹包含两个二进制文件：`mongosh`和`mongosh_csfle_v1.so`。

   对于支持OpenSSL的mongosh包，您将看到一个不同的`. so`文件。例如，`mongosh_crypt_v1.so`。

   如果您的Web浏览器在下载过程中自动提取归档文件，或者您在不使用`tar`命令的情况下提取归档文件，则可能需要使二进制文件可执行。从解压缩归档文件的目录中运行以下命令：

   ```
   chmod +x bin/mongosh
   ```

4. **将下载的二进制文件添加到PATH环境变量中。**

   您可以：

   * 将`mongosh`二进制文件复制到PATH变量中列出的目录中，例如`/usr/local/bin`。从解压缩下载文件的目录中运行以下命令：

     ```
     sudo cp mongosh /usr/local/bin/
     sudo cp mongosh_csfle_v1.so /usr/local/lib/
     ```

     对于支持OpenSSL的`mongosh`包，您将看到一个不同的`. so`文件。例如，`mongosh_crypt_v1.so`。请在上一个命令中使用该文件。

   * 创建指向`MongoDB Shell`的符号链接。切换到从`.tgz`归档文件中解压缩文件的目录。运行以下命令，创建指向路径中已有目录（例如`/usr/local/bin`）的链接。

     ```
     sudo ln -s $(pwd)/bin/* /usr/local/bin/
     ```

# 后续步骤

成功安装[mongosh](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)之后，学习如何[连接到MongoD服务](https://www.mongodb.com/docs/mongodb-shell/connect/#std-label-mdb-shell-connect)。







翻译：韩鹏帅

原文：[Install mongosh](https://www.mongodb.com/docs/mongodb-shell/install/)
