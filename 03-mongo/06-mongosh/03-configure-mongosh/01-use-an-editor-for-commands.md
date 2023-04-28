## 使用命令编辑器

控制台[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)是面向行的。但是，您也可以使用编辑器来处理多行函数。有两种选择：

- 将`edit`命令与[外部编辑器。](https://www.mongodb.com/docs/mongodb-shell/reference/editor-mode/#std-label-mongosh-external-editor)
- 使用`.editor`命令，一个[内置编辑器。](https://www.mongodb.com/docs/mongodb-shell/reference/editor-mode/#std-label-monogsh-built-in-editor)

## 使用外部编辑器

该命令适用于外部编辑器。您可以在运行的 shell 中 或从[.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) `edit`[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

如果在两个位置都配置了编辑器，则其中配置的编辑器[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)优先。

要在 中设置编辑器[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，请使用 [config.set()](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings/#std-label-mongosh-shell-settings)命令。

```
config.set( "editor", "vi" )
```

看[设置外部编辑器](https://www.mongodb.com/docs/mongodb-shell/reference/editor-mode/#std-label-mongosh-ex-setting-the-editor) 有关更多示例。

`edit`您可以通过三种方式使用：

- [开始新的编辑会话](https://www.mongodb.com/docs/mongodb-shell/reference/editor-mode/#std-label-mongosh-start-editing)
- [编辑变量](https://www.mongodb.com/docs/mongodb-shell/reference/editor-mode/#std-label-mongosh-edit-variable)
- [编辑声明](https://www.mongodb.com/docs/mongodb-shell/reference/editor-mode/#std-label-mongosh-edit-statement)

### 开始新的编辑会话

自行输入`edit`开始新的编辑会话。

```
edit
```

如果您在没有任何参数的情况下启动编辑会话，则编辑器将打开并加载最后的编辑。看例子，[编辑命令。](https://www.mongodb.com/docs/mongodb-shell/reference/editor-mode/#std-label-mongosh-ex-edit-last)

### 编辑变量

如果控制台命名空间中存在参数，您可以使用`edit`来更新它。

```
var albums = [ ];
edit albums
```

- 变量`albums`设置在第一行。
- 第二行打开外部编辑器来编辑 的值 `albums`。

### 编辑声明

要在外部编辑器中编辑语句，请使用`edit`如下语句调用[`db.collection.insertMany()`.](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany)

```
edit db.digits.insertMany( [] )
```

编辑`db.music.insertMany( [] )`并退出外部编辑器后，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)控制台可能如下所示：

```
prompt> db.digits.insertMany([{ "zero": 0 }, { "one": 1 }, { "two": 2 }])
```

当您退出外部编辑器时，语句被复制到控制台输入行，准备运行。它不会自动运行。按`<enter>`运行语句或`<ctrl> + c`取消它。

## 使用内置编辑器

该`.editor`命令提供基本的多行编辑功能。

编辑器不保存代码。当您关闭内置编辑器时，您的编辑将加载到全局范围内。如果您的编辑调用任何函数或命令，它们将在您关闭编辑器时运行。

要启动内置编辑器：

```
.editor
```

输入`<ctrl> + d`退出并运行您的功能。

看[使用内置编辑器。](https://www.mongodb.com/docs/mongodb-shell/reference/editor-mode/#std-label-mongosh-ex-built-in-editor)

例子：

### 设置外部编辑器

如果`EDITOR`在运行的 shell 中设置了环境变量 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，该`edit`命令将使用该编辑器。

如果还设置了该属性， 将改用该程序。该 属性覆盖环境变量。[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) `editor`[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)`editor``EDITOR`

#### 设置`EDITOR`环境变量

环境变量应在启动前设置 [`mongosh`。](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

`bash`在or中设置环境变量`zsh`：

```
export EDITOR=vi
```

当您在 控制台中运行时，编辑`vi`器将打开。`edit`[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

>笔记：
>
>您还可以 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)使用`process.env.<VARIABLE>`.
>
>从以下位置设置 EDITOR 环境变量[`mongosh`：](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)
>
>```
>process.env.EDITOR = 'nano'
>```
>
>环境变量仅针对当前 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh). 退出时更新不会持续存在 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。

#### 设置`editor`属性

要从内部设置`nano`为编辑器[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，请使用[config.set()](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings/#std-label-mongosh-shell-settings)命令

```
config.set( "editor", "nano" )
```

当您在 控制台中运行时，编辑`nano`器将打开。`edit`[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

> 笔记：
>
> [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)将尝试使用配置的任何程序。像这样的程序`less`会起作用。其他程序（例如`grep`）可能会崩溃或产生意外结果。

### 编辑命令

用于`edit`启动编辑会话。如果编辑器已在当前控制台会话中使用，则编辑器将打开上次编辑。

以下语句有语法错误。突出显示的行缺少逗号：

```
// WARNING: This code contains an error

db.users.insertMany( [
   { "name": "Joey", "group": "sales" }
   { "name": "Marie", "group": "sales" },
   { "name": "Elton", "group": "accounting" },
   { "name": "Paola", "group": "marketing" }
] )
```

要设置示例：

1. 复制示例代码。
2. 输入`edit`开始编辑会话。
3. 将示例代码粘贴到编辑器中。
4. 退出编辑器。
5. 按`enter`。

当您退出编辑器时，它会将示例代码复制到命令行。[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)代码运行时返回错误。

要重新加载示例代码，请`edit`不带任何参数输入。

```
// WARNING: This code contains an error
db.users.insertMany([{
        "name": "Joey",
        "group": "sales"
   } {
        "name": "Marie",
        "group": "sales"
   },
   {
        "name": "Elton",
        "group": "accounting"
   },
   {
        "name": "Paola",
        "group": "marketing"
   }
])
```

重新格式化代码以便于编辑。在这种情况下，突出显示的行中缺少逗号会导致文档未对齐。

### 使用 Visual Studio 作为外部编辑器

Visual Studio 需要一个特殊参数才能用作外部编辑器。`--wait`与 Visual Studio 一起使用。

设置环境变量：

```
export EDITOR="/usr/local/bin/code --wait"
```

[您还可以使用config.set()](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings/#std-label-mongosh-shell-settings)设置编辑器。如果 Visual Studio 在您的 中`PATH`，请打开 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)并运行：

```
config.set("editor", "code --wait")
```

如果您使用 Visual Studio，您还可以使用[MongoDB VS 代码扩展。](https://www.mongodb.com/products/vs-code)

### 取消设置外部编辑器

取消`editor`设置变量[`mongosh`：](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
config.set("editor", null)
```

如果`EDITOR`配置了环境，也请取消设置。从 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，运行：

```
process.env.EDITOR = ''
```

如果您取消设置`EDITOR`，使用`process.env`更改将不会在退出后持续存在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。要使更改持久化，请`EDITOR`从您的 shell 中取消设置。

### 使用内置编辑器

启动编辑器:

```
.editor
```

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)进入编辑器模式。输入您的代码：

```
// Entering editor mode (^D to finish, ^C to cancel)
var albums =
    [
       { "artist": "Beatles", "album": "Revolver" },
       { "artist": "The Monkees", "album": "Head"}
    ]
db.music.insertMany( albums )
```

离开编辑器，

- 按`<ctrl> + d`退出并运行您的功能
- 按`<ctrl> + c`退出而不运行您的功能

使用 声明的对象`.editor`，如`albums`本例中所示，被添加到全局范围。它们在关闭后可用 `.editor`。









翻译：韩鹏帅

原文：[Use an Editor for Commands](https://www.mongodb.com/docs/mongodb-shell/reference/editor-mode/)
