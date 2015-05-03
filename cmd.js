var fs = require('fs');
var path = require('path');
var log = hexo.log;
var config = require('./config');
var sync = require('./sync');
var package_info = require('./package.json');

var commands = module.exports = function() {
    return commands;
};

var mkcdndir = function (dirpath) {
    fs.exists(dirpath, function(exists){
        if (!exists) {
            fs.mkdirSync(dirpath);
        }
    });
};

var local_dir = config.local_dir ? config.local_dir : 'cdn';
mkcdndir(local_dir);
mkcdndir(path.join(local_dir, config.image.folder));
mkcdndir(path.join(local_dir, config.js.folder));
mkcdndir(path.join(local_dir, config.css.folder));

commands.sync = function(){
    if (config.access_key && config.secret_key && config.bucket) {
        sync.sync(); 
    } else {
        console.log('Qiniu config is not complete.\nCan\'t Sync.'.red);
    }

};

commands.sync2 = function(){
    if (config.access_key && config.secret_key && config.bucket) {
        sync.sync2(); 
    } else {
        console.log('Qiniu config is not complete.\nCan\'t Sync.'.red);
    }
};

commands.info = function(){
    console.log('Plugin name'.bold + ': ' + package_info.name);
    console.log('Version'.bold + ': ' + package_info.version);
    console.log('Author'.bold + ':  ' + package_info.author.name);
    console.log('Github'.bold + ':  ' + package_info.repository.url);
    console.log('Bugs'.bold + ':    ' + package_info.bugs.url);
};

hexo.on('ready', sync.unsymlink);
hexo.on('exit', sync.unsymlink);

if(config.offline){
    log.w('qiniu sync is offline mode');
    hexo.on('generateAfter', function(){
        sync.symlink(true);
    });
    hexo.on('server', function(){
        sync.symlink(false);
    });
}else{
    if(config.sync){
        hexo.on('generateBefore', sync.scan);
        hexo.on('generateAfter', sync.scan_end);
        hexo.on('server', sync.watch);
    }else{
        log.w('qiniu sync is off');
        hexo.on('server', function(){
            sync.symlink(false);
        });
    }
    hexo.on('deployBefore',sync.unsymlink);   
}
