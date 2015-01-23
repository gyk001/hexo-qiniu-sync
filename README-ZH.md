## 简介

这是一个[hexo](https://github.com/tommy351/hexo)插件，可以让你在文档中入嵌存储在七牛上的图片、JS、CSS类型的静态文件。

**你可以不用手动上传文件到七牛，插件会自动帮你将本地目录的文件同步到七牛。**

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
##dirPrefix     上传的资源子目录前缀.如设置，需与urlPrefix同步 
##urlPrefix     外链前缀. 
##local_dir     本地目录.
##update_exist  是否更新已经上传过的文件(仅文件大小不同或在上次上传后进行更新的才会重新上传)
##image/js/css  子参数folder为不同静态资源种类的目录名称，一般不需要改动
##image.extend  这是个特殊参数，用于生成缩略图或加水印等操作。具体请参考http://developer.qiniu.com/docs/v6/api/reference/fop/image/ 
##              可使用基本图片处理、高级图片处理、图片水印处理这3个接口。例如 ?imageView2/2/w/500 即生成宽度最多500px的缩略图
qiniu:
  offline: false
  sync: true
  bucket: bucket_name
  access_key: AccessKey
  secret_key: SecretKey
  dirPrefix: static
  urlPrefix: http://bucket_name.qiniudn.com/static
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
>如果要使用同步到七牛空间的静态资源，请设置为 `true`。如果只想浏览在本地的静态资源文件，则设置为 `false`。

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


## 使用

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



## Demo

```
{% qnimg test/demo.png title:图片标题 alt:图片说明 'class:class1 class2' extend:?imageView2/2/w/600 %}
``` 

将会被渲染成：

```
<img title="图片标题" alt="图片说明" class="class1 class2" src="http://gyk001.u.qiniudn.com/images/test/demo.png?imageView2/2/w/600">
```

























