var fs = require('fs');
var log = hexo.log;
var config = require('./config')(hexo);
var sync = require('./sync');
var package_info = require('./package.json');

var commands = module.exports = function(hexo) {
    return commands;
};

commands.sync = function(){
    sync.sync();
};

commands.info = function(){
    console.log('Plugin name'.bold + ': ' + package_info.name);
    console.log('Version'.bold + ': ' + package_info.version);
    console.log('Author'.bold + ':  ' + package_info.author.name);
    console.log('Github'.bold + ':  ' + package_info.repository.url);
    console.log('Bugs'.bold + ':    ' + package_info.bugs.url);
};

if(config.offline){
    log.w('qiniu sync is offline mode');
}else{
    if(config.sync ){
        hexo.on('generateBefore', sync.watch);
        hexo.on('server', sync.watch);
    }else{
        log.w('qiniu sync is off');
    }    
}
