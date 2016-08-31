[![Travis](https://img.shields.io/travis/rust-lang/rust.svg?maxAge=2592000)](https://travis-ci.org/gyk001/hexo-qiniu-sync)
[![Latest Stable Version](https://img.shields.io/npm/v/hexo-qiniu-sync.svg)](https://www.npmjs.com/package/hexo-qiniu-sync)
[![NPM Downloads](https://img.shields.io/npm/dm/hexo-qiniu-sync.svg)](https://npmjs.org/package/hexo-qiniu-sync)
[![Dependency Status](https://david-dm.org/gyk001/hexo-qiniu-sync.svg)](https://david-dm.org/gyk001/hexo-qiniu-sync)
[![Github Release](https://img.shields.io/github/tag/gyk001/hexo-qiniu-sync.svg)](https://github.com/gyk001/hexo-qiniu-sync/releases)
[![GitHub stars](https://img.shields.io/github/stars/gyk001/hexo-qiniu-sync.svg?style=social&label=Star)](https://github.com/gyk001/hexo-qiniu-sync)

## 简介

这是一个[hexo](https://github.com/tommy351/hexo)插件，
可以让你在文档中入嵌存储在七牛上的图片、JS、CSS类型的静态文件。

**你可以不用手动上传文件到七牛，插件会自动帮你将本地目录的文件同步到七牛。**

**项目作者：[gyk001](http://www.guoyukun.cn)**  
**代码贡献（字母序排列）:**
  - [Bob Liu](https://github.com/MatrixHero)
  - [Jinchun Xia](https://github.com/xiajinchun)
  - [MatrixHero](https://github.com/MatrixHero)
  - [binsee](https://github.com/binsee)
  - [javy-liu](https://github.com/javy-liu)
  - [k1988](https://github.com/k1988)
  - [robinshen](https://github.com/robinshen)
  - [楼教主](https://github.com/52cik)

## 安装

在你的hexo主目录下运行以下命令进行安装：

```
npm install hexo-qiniu-sync --save
```

添加插件配置信息到 ``_config.yml`` 文件中:

```
plugins:
  - hexo-qiniu-sync

#七牛云存储设置
##offline       是否离线. 离线状态将使用本地地址渲染
##sync          是否同步
##bucket        空间名称.
##access_key    上传密钥AccessKey
##secret_key    上传密钥SecretKey
##secret_file   秘钥文件路径，可以将上述两个属性配置到文件内，防止泄露，json格式。绝对路径相对路径均可
##dirPrefix     上传的资源子目录前缀.如设置，需与urlPrefix同步 
##urlPrefix     外链前缀.
##up_host      上传服务器路径,如选择华北区域的话配置为http://up-z1.qiniu.com
##local_dir     本地目录.
##update_exist  是否更新已经上传过的文件(仅文件大小不同或在上次上传后进行更新的才会重新上传)
##image/js/css  子参数folder为不同静态资源种类的目录名称，一般不需要改动
##image.extend  这是个特殊参数，用于生成缩略图或加水印等操作。具体请参考http://developer.qiniu.com/docs/v6/api/reference/fop/image/ 
##              可使用基本图片处理、高级图片处理、图片水印处理这3个接口。例如 ?imageView2/2/w/500 即生成宽度最多500px的缩略图
qiniu:
  offline: false
  sync: true
  bucket: bucket_name
  secret_file: sec/qn.json or C:
  access_key: AccessKey
  secret_key: SecretKey
  dirPrefix: static
  urlPrefix: http://bucket_name.qiniudn.com/static
  up_host: http://upload.qiniu.com
  local_dir: static
  update_exist: true
  image: 
    folder: images
    extend: 
  js:
    folder: js
  css:
    folder: css
```

**这里对配置中的几个需要注意的参数进行说明：**  

* `offline` 参数：  
>如果要使用同步到七牛空间的静态资源，请设置为 `false`。如果只想浏览在本地的静态资源文件，则设置为 `true`。

* `sync` 参数：  
>如果你想关掉七牛同步，将此参数设置为false即可，不过一般用不到修改这个参数。

* `dirPrefix` 参数：  
>将资源上传到七牛空间内这个目录下(说是目录会容易理解点)，默认为 `static` 目录。

* `urlPrefix` 参数：  
>七牛空间地址的前缀，会按默认格式自动生成地址，所以此参数**可省略**。  
默认格式为 `http://bucket_name.qiniudn.com/static` ，如果你的七牛空间使用自定义域名或域名不是此格式的，请配置此参数。  
当你设置了 `dirPrefix` 参数后，如`static`。则此url地址必须加上目录后缀 `/static` ，
即`http://bucket_name.qiniudn.com/static`，否则静态资源将无法访问。

* `local_dir` 参数：  
>只填写一个目录名称即可，建立在hexo博客的主目录，不需要使用子目录。  
当你在配置中填写好文件夹后，运行hexo时，会自动建立对应的目录。  
如果你了解hexo文件夹的关系，担心这样会导致离线模式不能查看到图片，我可以告诉你你不需要担心这个问题。  
在你以离线模式运行时，会自动使用软连接/联接方式帮你建立文件夹的引用，可以让你的离线浏览节省**一倍**的空间。  

* `update_exist` 参数：  
>如果你的静态文件会进行修改或替换，并需要更新七牛空间上原先上传的文件，则设置为 `true` 。  
是否更新空间上已上传的文件，是按照`对比文件大小是否相同`或者`本地文件在上传到七牛空间之后进行过修改`的规则进行判断的。

* `image` : `extend` 参数：  
>这是个特殊参数，是文章内使用 `qnimg` 标签引用图片的默认图片处理操作。请参考
**[七牛开发者中心-图片处理](http://developer.qiniu.com/docs/v6/api/reference/fop/image/)**。  
可以使用 基本图片处理（imageView2）、高级图片处理（imageMogr2）、图片水印处理（watermark）
这三个图片处理接口，多个接口内容之间用 `|` 间隔。  
例如 `?imageView2/2/w/500` 即生成宽度最多500px的缩略图。


## 使用标签

```
{% qnimg imageFile attr1:value1 attr2:value2 'attr3:value31 value32 value3n' [extend:?imageView2/2/w/600 | normal:yes] %}
{% qnjs jsFile attr1:value1 attr2:value2 'attr3:value31 value32 value3n' %}
{% qncss cssFile attr1:value1 attr2:value2 'attr3:value31 value32 value3n' %}
```
* `jnimg` 标签的图片处理：
>如果你在 ``_config.yml`` 文件中配置了 `extend` 字段，则默认会对插入的图片进行对应的处理。  
如果不想对一个图片进行处理，则可在 `jnimg` 标签内增加 `normal:yes` 参数，则使用原图，不进行图片处理。  
如果只对当前图片进行处理，则可在 `jnimg` 标签内增加 `extend:?imageView2/2/w/600` 样式的配置参数。  
当 `_config.yml` 文件中和 `jnimg` 标签内都定义了 `extend` 参数，则只会使用 `jnimg` 标签的 `extend` 参数。  
请参考**[七牛开发者中心-图片处理](http://developer.qiniu.com/docs/v6/api/reference/fop/image/)**
，可以使用 基本图片处理（imageView2）、高级图片处理（imageMogr2）、图片水印处理（watermark）
这三个图片处理接口，多个接口内容之间用 `|` 间隔。

### Demo

```
{% qnimg test/demo.png title:图片标题 alt:图片说明 'class:class1 class2' extend:?imageView2/2/w/600 %}
``` 

将会被渲染成：

```
<img title="图片标题" alt="图片说明" class="class1 class2" src="http://gyk001.u.qiniudn.com/images/test/demo.png?imageView2/2/w/600">
```


## 命令行

**作为一个带命令行功能的插件，漏掉了命令行的使用说明不是好习惯。** 
本插件命令行为 `hexo qiniu` ，所支持的子命令有：


* `info` (简写 `i` )
>功能：显示插件版本，作者及Github地址信息等

* `sync` (简写 `s` )
>功能：同步静态资源到七牛空间

* `sync2` (简写 `s2` )
>功能：同步静态资源到七牛空间，且会同步上传那些本地与七牛空间有差异的文件。  
**这个命令会无视 `update_exist` 配置**。  
对比规则请看 `update_exist` 配置参数说明。


## 同步静态资源
**当需要把静态资源同步到七牛空间中时，有如下几种方式可以同步资源：**  

* 启用本地服务器.即使用 `hexo server` 命令（简写为 `hexo s`）
>当以本地服务器模式启动后，会自动监测 `local_dir` 目录下的文件变化，
会自动将新文件进行上传。  
如果文件进行了修改，但设置中没有启用 `update_exist` 配置，则不会更新到七牛空间。

* 使用命令行命令(`sync` | `s` | `sync2` | `s2`)
>命令行命令会扫描 `local_dir` 目录下的文件，同步至七牛空间。

备注：使用生成(`generate`)或部署(`deploy`)命令时，会提示需要上传的文件数量：  
>```
[info] Need upload file num: 0
```

## 小技巧

* 文章模板
>如果你经常在文章内插入图片，你可以修改文章模板，将空白的图片插入标签粘贴进去。  
这样新建立的文章就有空白标签可以让你直接填写图片路径就好了，会很省事。  
文章模板文件：`./scaffolds/post.md`  
图片标签`{% qnimg test/demo.png title:图片标题 alt:图片说明 'class:class1 class2' %}`

* 图片处理样式
>在前边的内容里，已经介绍了图片处理参数，下面来介绍一个更省事的技巧。  
>如果你经常使用的图片效果是固定的，你可以通过设置数据处理样式来达到灵活的控制。  
>  1. 首先登陆七牛空间，选择存储空间后，再选择`数据处理`菜单。
>  2. 设置分隔符。默认的 `-` 即可。
>  3. 点击 `新建样式` 按钮，根据提示创建一个处理样式。
>  4. 创建样式完毕后，你就可以将 `extend` 参数设置为 `分隔符+样式名称`了。  
     如你设置的分隔符为 `-` ，样式名称为 `new` ，则 `extend` 参数就是 `-new` 了。  
     简单吧？  
     你可以根据自己的需要，建立多个样式，然后在文章内使用时，为不同图片标签设置
     不同的`extend`参数，来达到不同的显示效果。

## 常见问题

* WINDOWS系统下使用离线模式，运行 `hexo s` 后，在文章页面中不能无法看到引用的静态资源图片  
如：`local_dir` 参数设置为 `static` ，运行 `hexo s` 后 `source` 目录下没有出现一个名字为 `static` 的目录链接。
>首先检查以下内容：  
   * 所在的磁盘的文件系统是否为`NTFS`。因为 WINDOWS 下 `NTFS` 系统才支持目录链接。
   * 运行 `hexo s` 时，是否以管理员身份运行的。目录链接操作需要管理员身份才可以执行，  
     如果你是在打开的cmd命令行中执行 `hexo s` 的，需要以管理员身份运行cmd才可以。  
     如果你是运行批处理文件运行( 例如内容为 `hexo s` )，请批处理文件的属性中设置为以管理员身份运行。
   * 不要把 `local_dir` 参数指定的目录设置为 `source` 目录的子目录，应当为 `source` 目录的同级目录。
   * 如果你是FAT32格式的磁盘，你只使用离线模式的话，可以把`local_dir` 参数设置为`source` 目录的子目录，
     这样在 `hexo s` 时，才可以正常预览。

* 在同步模式下，不能同步，出现报错为 `[error] SyntaxError: Unexpected end of input`
>请检查设置中的 `access_key` 与 `secret_key` 是否正确，以及是否可用。
   
