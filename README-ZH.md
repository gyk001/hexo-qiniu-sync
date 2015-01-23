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



## 使用

```
{% qnimg imageFile attr1:value1 attr2:value2 'attr3:value31 value32 value3n' [extend:?imageView2/2/w/600 | normal:yes] %}
{% qnjs jsFile attr1:value1 attr2:value2 'attr3:value31 value32 value3n' %}
{% qncss cssFile attr1:value1 attr2:value2 'attr3:value31 value32 value3n' %}
```
`jnimg` 标签的图片处理：
>如果你在 ``_config.yml`` 文件中配置了 `extend` 字段，则默认会对插入的图片进行对应的处理。  
如果不想对一个图片进行处理，则可在 `jnimg` 标签内增加 `normal:yes` 参数，则使用原图，不进行图片处理。  
如果只对当前图片进行处理，则可在 `jnimg` 标签内增加 `extend:?imageView2/2/w/600` 样式的配置参数。  
当``_config.yml`` 文件中和 `jnimg` 标签内都定义了 `extend` 参数，则只会使用 `jnimg` 标签的 `extend` 参数。  
图片处理请参考**[七牛开发者中心-图片处理](http://developer.qiniu.com/docs/v6/api/reference/fop/image/)**
，可以使用 基本图片处理（imageView2）、高级图片处理（imageMogr2）、图片水印处理（watermark） 这三个图片处理接口。



## Demo

```
{% qnimg test/demo.png title:图片标题 alt:图片说明 'class:class1 class2' %}
```

将会被渲染成：

```
<img title="图片标题" alt="图片说明" class="class1 class2" src="http://gyk001.u.qiniudn.com/images/test/demo.png">
```


## 特殊说明
1. 关于本地目录位置的选择：  
```
    本地目录建立在hexo博客的主目录下即可，目录名称即配置中的 `local_dir` ，不需要使用子目录。  
    当你在配置中填写好文件夹后，运行hexo时，会自动建立对应的目录。  
    再次说明，请不要把静态文件夹选择在source文件夹下，你不需要担心离线阅览不能查看图片的问题。  
    代码会在你需要引用图片之前，使用软连接/联接方式帮你建立文件夹的引用，可以让你的离线浏览节省**一倍**的空间。  
```

2. 引用缩略图
```
    你可以注意到
```

2. 

## TODO  
1.thumbnail image.  

























