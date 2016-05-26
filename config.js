var defaults = require('./default');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var log = hexo.log;

// 如果配置独立秘钥文件，则使用文件里的秘钥配置
if(hexo.config.qiniu.secret_file){
	var secPath = path.normalize(path.resolve('', hexo.config.qiniu.secret_file));
	var qnSec=JSON.parse(fs.readFileSync(secPath,'utf-8'))
	if(qnSec.secret_key){
		hexo.config.qiniu.secret_key=qnSec.secret_key;
	}
	if(qnSec.access_key){
		hexo.config.qiniu.access_key=qnSec.access_key;
	}    
}

// 七牛的配置组
var qnConfig = _.defaults(hexo.config.qiniu,defaults);
if(qnConfig.offline){
	// 离线状态不进行同步，覆盖同步配置，
	qnConfig.sync = false;
	// 离线状态渲染的的链接路径也是本地的，覆盖urlPrefix配置
	qnConfig.url_Prefix = path.join(hexo.config.root, qnConfig.local_dir).replace(/\\/g, '/');
}else{
	// 在线状态要看是否同步
	if(qnConfig.sync){
		// 同步功能必须配置空间名
		if(! qnConfig.bucket){
			throw new Error('enable sync must set bucket');	
		}
	}
	if(!qnConfig.urlPrefix){
		// 在线渲染urlPrefix和bucket至少配置一个
		if(!qnConfig.bucket){
		throw new Error('bucket and urlPrefix must has one');
		}else{
			// 没有配置urlPrefix时根据bucket生成
			qnConfig.url_Prefix = ['http://',qnConfig.bucket,'.qiniucdn.com',qnConfig.dirPrefix ? '/' + qnConfig.dirPrefix : ''].join('');
		}
	} else {
		qnConfig.url_Prefix = qnConfig.urlPrefix;
	}
}
log.i('-----------------------------------------------------------');
log.i('qiniu state: '.yellow + (qnConfig.offline ? 'offline' : 'online'));
log.i('qiniu sync:  '.yellow + (qnConfig.sync ? 'true' : 'false'));
log.i('qiniu local dir:  '.yellow + qnConfig.local_dir);
log.i('qiniu url:   '.yellow + qnConfig.url_Prefix);
log.i('-----------------------------------------------------------');
module.exports = qnConfig;
