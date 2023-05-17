# 手动创建注册表索引文件

>警告:
>
>**实验特征**
>
>此功能是实验性的。MongoDB 不提供对片段的支持。此功能可能随时更改或删除，恕不另行通知。
>
>预计不会出现错误，但是如果您遇到错误，请在 [GitHub 仓库](https://github.com/mongodb-labs/mongosh-snippets/issues) 对于这个项目。

本页讨论如何手动创建注册表索引文件。要使用脚本生成注册表索引文件，请参阅[创建注册表索引文件。](https://www.mongodb.com/docs/mongodb-shell/snippets/packages/#std-label-snip-make-a-registry-index)

要创建注册表索引文件：

1. 复制以下 TypeScript 模板并将其另存为`make-index.ts`：

   ```
   import bson from 'bson';
   import zlib from 'zlib';
   
   interface ErrorMatcher {
      // Add additional information to shell errors matching one of the regular.
      // expressions. The message can point to a snippet helping solve that error.
      matches: RegExp[];
      message: string;
   }
   
   interface SnippetDescription {
      // The *npm* package name. Users do not interact with this.
      name: string;
   
      // The snippet name. This is what users interact with.
      snippetName: string;
   
      // An optional install specifier that can be used to point npm towards
      // packages that are not uploaded to the registry. For example,
      // this could be an URL to a git repository or a tarball.
      installSpec?: string;
   
      // A version field. Users do not interact with this, as currently, `snippet`
      // always installs the latest versions of snippets.
      version: string;
      description: string;
      readme: string;
   
      // License should be a SPDX license identifier.
      license: string;
      errorMatchers?: ErrorMatcher[];
   }
   
   interface SnippetIndexFile {
      // This must be 1 currently.
      indexFileVersion: 1;
      index: SnippetDescription[];
      metadata: { homepage: string };
   }
   
   const indexFileContents: SnippetIndexFile = {
      indexFileVersion: 1,
      index: [ /* ... */ ],
      metadata: { homepage: 'https://example.com' }
   };
   
   // Serialize, compress and store the index file:
   fs.writeFileSync('index.bson.br',
      zlib.brotliCompressSync(
      bson.serialize(indexFileContents)));
   ```

2. `make-index.ts`根据您的代码段包的需要进行编辑。使用评论作为填写所需信息的指南。

3. 运行`ts-node make-index.ts`以创建`index.bson.br file`.

4. 上传`index.bson.br`到您的 GitHub 存储库。

5. 更新`snippetIndexSourceURLs`以包含引用您的`index.bson.br`.





翻译：韩鹏帅

原文：[Create a Registry Index File Manually](https://www.mongodb.com/docs/mongodb-shell/snippets/registry-index/)
