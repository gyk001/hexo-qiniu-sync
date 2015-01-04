var fs = require('fs');
var path = require('path');
var publicDir = hexo.public_dir;
var sourceDir = hexo.source_dir;
var htmlTag = hexo.util.html_tag;
var route = hexo.route;
var config = require('./config')(hexo);
var cmd = require('./cmd')(hexo);
var log = hexo.log;
var package_info = require('./package.json');

// 图片文件夹路径
var imgPrefix = [config.urlPrefix, '/', config.image.folder].join('');
// 脚本文件夹路径
var jsPrefix = [config.urlPrefix, '/', config.js.folder].join('');
// 样式表文件夹路径
var cssPrefix = [config.urlPrefix, '/', config.css.folder].join('');

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
 * <img title="图片标题" alt="图片说明" class="class1 class2" src="http://gyk001.qiniudn.com/images/test/demo.png">
 * 注意：参数值有空格的需要用引号将整个配置项括起来
 */
var qnImgTag = function(args,content){
  var imageName = args[0]; 
  var imgAttr = parseAttrs(args);
  var process = (imgAttr.normal || config.offline) ? '' : config.image.thumbnail; //##TODO: new version qiniu thumbnail
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
  return [config.urlPrefix, '/', path].join('');
};

hexo.extend.tag.register('qnimg',qnImgTag);
hexo.extend.tag.register('qnjs',qnJsTag);
hexo.extend.tag.register('qncss',qnCssTag);
hexo.extend.helper.register('qnjs', qnJsHelper);
hexo.extend.helper.register('qnurl', qnUrlHelper);

command_options = {
  desc: package_info.description,
  usage: ' <argument>',
  "arguments": [
    {
        "name": 'sync',
        "desc": "Sync your static files to qiniu."
    },
    {
        "name": 'info',
        "desc": "Displays useful info, like plugin version, aurthor or GitHub links"
    }
  ]
};

hexo.extend.console.register('qiniu', 'Qiniu sync', command_options, function(args, callback){
  log.d('----- qiniu sync ----');
  log.d(config);
  log.d('----- qiniu sync ----');
  console.log('\nqiniu sync plugin for hexo\n'.yellow);
  var opt = args._[0] || null; // Option
  switch (opt) {
    case 'sync':  // sync files now
      cmd.sync();
      break;
    case 'info':
      cmd.info();
      break;
    default:
      return hexo.call('help', {
          _: ['qiniu']
      }, callback);
  }
});