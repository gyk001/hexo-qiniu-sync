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
#hexo-qiniu-sync plugin config
qiniu:
  bucket: gyk001
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
<img title="图片标题" alt="图片说明" class="class1 class2" src="http://gyk001.u.qiniudn.com/images/test/demo.png/thumbnail.jpg">
```

## All Configuration and Default value

``` 
qiniu:
  bucket: 
  offline: false
  sync: true
  local_dir: cdn
  key_store: ~/.qiniu_key.json
  image: 
    folder: images
    thumbnail: 
  js:
    folder: js
  css:
    folder: css
```
