## Introduction

This is a [hexo](https://github.com/tommy351/hexo)
tag plugin which help you to embed static file stored on [qiniu](http://www.qiniu.com/)

**The point is you don't need upload files to qiniu manual**

**this plugin will sync files to qiniu for you automatically**

## Installation

To install, run the following command in the root directory of hexo:
```
npm install hexo-qiniu-sync --save
```

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
##local_dir     本地目录. ##TODO
##image/js/css  子参数folder为不同静态资源种类的目录名称，一般不需要改动
qiniu:
  offline: false
  sync: true
  bucket: bucket_name
  access_key: AccessKey
  secret_key: SecretKey
  dirPrefix: static
  urlPrefix: http://bucket_name.qiniudn.com/static
  local_dir: source\static
  image: 
    folder: images
  js:
    folder: js
  css:
    folder: css
```

## Usage

```
{% qnimg imageFile attr1:value1 attr2:value2 'attr3:value31 value32 value3n' %}
{% qnjs jsFile attr1:value1 attr2:value2 'attr3:value31 value32 value3n' %}
{% qncss cssFile attr1:value1 attr2:value2 'attr3:value31 value32 value3n' %}
```
## Demo

```
{% qnimg test/demo.png title:图片标题 alt:图片说明 'class:class1 class2' %}
```

will render to:

```
<img title="图片标题" alt="图片说明" class="class1 class2" src="http://gyk001.u.qiniudn.com/images/test/demo.png">
```

## All Configuration and Default value

``` 
qiniu:
  offline: false
  sync: true
  bucket: bucket_name
  access_key: AccessKey
  secret_key: SecretKey
  dirPrefix: static
  urlPrefix: http://bucket_name.qiniudn.com/static
  local_dir: source\static
  image: 
    folder: images
  js:
    folder: js
  css:
    folder: css
```

## TODO  
1.thumbnail image.  
2.Static resource directory.  