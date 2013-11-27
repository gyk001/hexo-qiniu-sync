var fs = require('fs');
var path = require('path');
var publicDir = hexo.public_dir;
var sourceDir = hexo.source_dir;
var htmlTag = hexo.util.html_tag;
var route = hexo.route;

// 七牛的配置组
var qnConfig = hexo.config.qiniu;
// 七牛空间地址，bucket就是建立的的空间名
var urlPrefix = ['http://',qnConfig.bucket,'.u.qiniudn.com'].join('');
// 图片文件夹路径
var imgPrefix = [urlPrefix,'/',qnConfig.image.folder,].join('');
// 图片缩略图后缀, 登录空间点击数据处理，新建图片样式
// http://docs.qiniu.com/api/v6/image-process.html#imageView
var thumbnail = qnConfig.image.thumbnail || '';
// 脚本文件夹路径
var jsPrefix = [urlPrefix,'/',qnConfig.js.folder,].join('');
// 样式表文件夹路径
var cssPrefix = [urlPrefix,'/',qnConfig.css.folder,].join('');

/** 
 * 将markdown里的tag 数组解析成配置对象<br/>
 * 如标签: {% qnimg test/demo.png title:图片标题 alt:图片说明 'class:class1 class2' %}<br/>
 * 则传入参数为: ['test/demo.png', 'title:图片标题', 'alt:图片说明', 'class:class1 class2'] <br/>
 * 解析结果为:{ title: '图片标题',  alt: '图片说明', class: 'class1 class2'}<br/>
 * 注意：参数值有空格的需要用引号将整个配置项括起来
 */
var parseAttrs = function(argArray){
  var attrs = {};
  for(var i=1;i< argArray.length ;i++){
    var txt = argArray[i];
    if(txt.length>2){
      if(txt[0]==='\'' || txt[0]==='"'){
        txt=txt.substring(1,txt.length-1);
      }
    }
    var parseAttr = txt.split(':');
    attrs[parseAttr[0]] = parseAttr[1];
  }
  return attrs;
}

/** 
 * 如标签: {% qnimg test/demo.png title:图片标题 alt:图片说明 'class:class1 class2' %}<br/>
 * 解析结果为:<br/>
 * <img title="图片标题" alt="图片说明" class="class1 class2" src="http://gyk001.u.qiniudn.com/images/test/demo.png/thumbnail.jpg">
 * 注意：参数值有空格的需要用引号将整个配置项括起来
 */
var qnImgTag = function(args,content){
  var imageName = args[0]; 
  var imgAttr = parseAttrs(args);
  var process = imgAttr.normal ? '' : thumbnail;
  delete imgAttr.normal;
  imgAttr.src  = [imgPrefix,'/', imageName , process].join('');
  return htmlTag('img', imgAttr);
};

var qnJsTag = function(args,content){
  var jsName = args[0]; 
  var jsAttr = parseAttrs(args);

  js.src  = [jsPrefix,'/', jsName].join('');
  js.type = 'text/javascript';
  return htmlTag('script', jsAttr);
};

var qnCssTag = function(args,content){
  var jsName = args[0]; 
  var jsAttr = parseAttrs(args);
  js.src  = [cssPrefix,'/', cssName].join('');
  js.rel = 'stylesheet';
  js.type = 'text/css';
  return htmlTag('link', jsAttr);
};

var qnJsHelper = function(path){
  return ['<script type="text/javascript" src="',jsPrefix,'/',path,'"></script>'].join('');
};

var qnUrlHelper = function(path){
  return [urlPrefix, '/', path].join('');
};

hexo.extend.tag.register('qnimg',qnImgTag);
hexo.extend.tag.register('qnjs',qnJsTag);
hexo.extend.tag.register('qncss',qnCssTag);
hexo.extend.helper.register('qnjs', qnJsHelper);
hexo.extend.helper.register('qnurl', qnUrlHelper);