var url = require('url');
var http = require('http');
var fs = require('fs');
var log = hexo.log;
var config = require('./config')(hexo);
var unzip = require('unzip');
var temp = require('temp');
var sync = require('./sync');

var commands = module.exports = function(hexo) {
    return commands;
};

var qrsync = '/Users/Guo/.qiniu/';

var download = function(){
    // 下载对应的包到目录
    // ~/.qiniu/qiniu.zip
};

commands.install = function(){
    var readStream = fs.createReadStream('/Users/Guo/Downloads/qiniu-devtools-darwin_amd64-v2.6.20131020.zip');
    //var writeStream = fs.createWriteStream(qrsync);
    readStream.pipe(unzip.Extract({ path: qrsync }));
    fs.chmod(qrsync+'qrsync', '755', function(err){
        log.e(err);
    });
    /*
    readStream.pipe(unzip.Parse())
      .on('entry', function (entry) {
        var fileName = entry.path;
        var type = entry.type; // 'Directory' or 'File'
        var size = entry.size;
        if (fileName === "this IS the file I'm looking for") {
          entry.pipe(writeStream);
        } else {
          entry.autodrain();
        }
      });
*/
    log.e('install method not written');
};

commands.remove = function(){
    console.log('remove method not written');
    fs.rmdir(path, callback)
};

commands.sync = function(){
    sync.sync();
};

commands.help = function(){
    console.log('help');
};

if(config.offline){
    log.w('qiniu sync is offline mode');
}else{
    if(config.sync ){
        hexo.on('generateBefore', sync.watchAndSync);
        hexo.on('server', sync.watchAndSync);
    }else{
        log.w('qiniu sync is off');
    }    
}
