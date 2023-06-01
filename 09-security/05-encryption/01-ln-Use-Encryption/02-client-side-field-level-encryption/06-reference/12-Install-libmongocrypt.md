## 安装 libmongocrypt

*4.2版中的新功能*。

### 概述

了解如何安装 客户端字段级加密的[核心组件](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-components/#std-label-csfle-reference-encryption-components)`libmongocrypt`。

> 警告:
>
> 不要`libmongocrypt`从源代码构建。使用此页面上列出的安装方法之一。

## macOS 安装

```
brew install mongodb/brew/libmongocrypt
```

## Windows 安装

点击[这里](https://s3.amazonaws.com/mciuploads/libmongocrypt/windows/latest_release/libmongocrypt.tar.gz) 开始下载最新版本的二进制文件和`includes`目录。

## Linux安装

### Debian

1. 导入用于签署包存储库的公钥：

   ```
   sudo sh -c 'curl -s --location https://www.mongodb.org/static/pgp/libmongocrypt.asc | gpg --dearmor >/etc/apt/trusted.gpg.d/libmongocrypt.gpg'
   ```

2. 将 MongoDB 存储库添加到您的包源：

   > 重要的:
   >
   > `<release>`将以下 shell 命令更改为您的平台版本（例如“xenial”或“buster”）。

   ```
   echo "deb https://libmongocrypt.s3.amazonaws.com/apt/debian <release>/libmongocrypt/1.7 main" | sudo tee /etc/apt/sources.list.d/libmongocrypt.list
   ```

3. 更新包缓存：

   ```
   sudo apt-get update
   ```

4. 安装`libmongocrypt`：

   ```
   sudo apt-get install -y libmongocrypt
   ```

### Ubuntu

1. 导入用于签署包存储库的公钥：

   ```
   sudo sh -c 'curl -s --location https://www.mongodb.org/static/pgp/libmongocrypt.asc | gpg --dearmor >/etc/apt/trusted.gpg.d/libmongocrypt.gpg'
   ```

2. 将 MongoDB 存储库添加到您的包源：

   > 重要的:
   >
   > `<release>`将以下 shell 命令更改为您的平台版本（例如“xenial”或“buster”）。

   ```
   echo "deb https://libmongocrypt.s3.amazonaws.com/apt/ubuntu <release>/libmongocrypt/1.7 universe" | sudo tee /etc/apt/sources.list.d/libmongocrypt.list
   ```

3. 更新包缓存：

   ```
   sudo apt-get update
   ```

4. 安装`libmongocrypt`：

   ```
   sudo apt-get install -y libmongocrypt
   ```

### RedHat

1. 为包创建存储库文件`libmongocrypt`：

   ```
   [libmongocrypt]
   name=libmongocrypt repository
   baseurl=https://libmongocrypt.s3.amazonaws.com/yum/redhat/$releasever/libmongocrypt/1.7/x86_64
   gpgcheck=1
   enabled=1
   gpgkey=https://www.mongodb.org/static/pgp/libmongocrypt.asc
   ```

2. 安装`libmongocrypt`包：

   ```
   sudo yum install -y libmongocrypt
   ```

### Amazon Linux 2

1. 为包创建存储库文件`libmongocrypt`：

   ```
   [libmongocrypt]
   name=libmongocrypt repository
   baseurl=https://libmongocrypt.s3.amazonaws.com/yum/amazon/2/libmongocrypt/1.7/x86_64
   gpgcheck=1
   enabled=1
   gpgkey=https://www.mongodb.org/static/pgp/libmongocrypt.asc
   ```

2. 安装`libmongocrypt`包：

   ```
   sudo yum install -y libmongocrypt
   ```

### Amazon Linux

1. 为包创建存储库文件`libmongocrypt`：

   ```
   [libmongocrypt]
   name=libmongocrypt repository
   baseurl=https://libmongocrypt.s3.amazonaws.com/yum/amazon/2013.03/libmongocrypt/1.7/x86_64
   gpgcheck=1
   enabled=1
   gpgkey=https://www.mongodb.org/static/pgp/libmongocrypt.asc
   ```

2. 安装`libmongocrypt`包：

   ```
   sudo yum install -y libmongocrypt
   ```

### Suse

1. 导入用于签署包存储库的公钥：

   ```
   sudo rpm --import https://www.mongodb.org/static/pgp/libmongocrypt.asc
   ```

2. 将存储库添加到您的包源:

   > 重要的:
   >
   > `<release>`将以下 shell 命令更改为您的平台版本（例如“12”或“15”）。

   ```
   sudo zypper addrepo --gpgcheck "https://libmongocrypt.s3.amazonaws.com/zypper/suse/<release>/libmongocrypt/1.7/x86_64" libmongocrypt
   ```

3. 安装`libmongocrypt`包：

   ```
   sudo zypper -n install libmongocrypt
   ```








译者：韩鹏帅

原文：[Install libmongocrypt](https://www.mongodb.com/docs/manual/core/csfle/reference/libmongocrypt/)

