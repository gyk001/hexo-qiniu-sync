## 简介 Introduction

这是一个[hexo](https://github.com/tommy351/hexo)插件，可以让你在文档中嵌入将图片、JS、CSS类型的静态文件。
This is a [hexo](https://github.com/tommy351/hexo)
tag plugin which help you to embed static file stored on [qiniu](http://www.qiniu.com/)

**你可以不用手动上传文件到七牛，插件会自动帮你将本地目录的文件同步到七牛。**

**The point is you don't need upload files to qiniu manual**

**this plugin will sync files to qiniu for you automatically**

## 安装 Installation

在你的hexo主目录下运行以下命令进行安装：
To install, run the following command in the root directory of hexo:
```
npm install hexo-qiniu-sync --save
```


添加插件配置信息到``_config.yml``文件中:
And add this plugin in your ``_config.yml``.

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
##image.extend  这是个特殊参数，用于生成缩略图或加水印等操作。具体请看http://developer.qiniu.com/docs/v6/api/reference/fop/image/ 
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

## 使用 Usage

```
{% qnimg imageFile attr1:value1 attr2:value2 'attr3:value31 value32 value3n' [extend:?imageView2/2/w/600 | normal:yes] %}
{% qnjs jsFile attr1:value1 attr2:value2 'attr3:value31 value32 value3n' %}
{% qncss cssFile attr1:value1 attr2:value2 'attr3:value31 value32 value3n' %}
```
其中需要注意`qnimg`


## Demo

```
{% qnimg test/demo.png title:图片标题 alt:图片说明 'class:class1 class2' %}
```

将会被渲染成：
will render to:

```
<img title="图片标题" alt="图片说明" class="class1 class2" src="http://gyk001.u.qiniudn.com/images/test/demo.png">
```

## 特殊说明
1. 关于静态文件夹位置的选择：
    静态文件夹建立在hexo博客的主目录即可，文件夹名称即配置中的`local_dir`，不要选择子目录。
    当你在配置中填写好文件夹后，运行hexo时，会自动建立对应的目录。
    再次说明，请不要把静态文件夹选择在source文件夹下，你不需要担心离线阅览不能查看图片的问题。
    代码会在你需要引用图片之前，使用软连接/联接方式帮你建立文件夹的引用，可以让你的离线浏览节省**一倍**的空间。

2. 引用缩略图或对图像裁剪、加水印
    
2. 

## TODO  
1.thumbnail image.  