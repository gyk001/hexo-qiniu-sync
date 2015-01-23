var fs = require('fs');
var qiniu = require('node-qiniu');
var path = require('path');
var log = hexo.log;
var config = require('./config')(hexo);
var chokidar = require('chokidar');
var publicDir = hexo.public_dir;
var sourceDir = hexo.source_dir;

var local_dir = config.local_dir ? config.local_dir : 'cdn';
var dirPrefix = config.dirPrefix ? config.dirPrefix : '';
local_dir = path.join(local_dir, '.').replace(/[\\\/]/g, path.sep);
var update_exist = config.update_exist ? config.update_exist : false;

// 引入七牛 Node.js SDK
// 设置全局参数，包括必须的 AccessKey 和 SecretKey，
qiniu.config({
  access_key: config.access_key,
  secret_key: config.secret_key
});

// 获得空间对象
var imagesBucket = qiniu.bucket(config.bucket);

/**
 * 上传文件
 * file为本地路径(绝对路径或相对路径都可)
 * name为远程文件名
 */
var upload_file = function (file,name) {
    imagesBucket.putFile(name, file, function(err, reply) {
        if (err) {
            return console.error(err);
        }
        log.i('upload file'.green + ': ' + reply.key);
    });
};

/**
 * 上传前预先检查
 * file为本地路径(绝对路径或相对路径都可)
 * name为远程文件名
 */
var check_upload = function (file,name) {
    var res = imagesBucket.key(name);
    res.stat(function(err, stat) {
        if (stat.hash) {
            log.i('uploaded file'.cyan + ': ' + name);
            if (!update_exist) {
                log.i('skip update file'.blue + ': ' + name);
                return false;
            }
            fs.stat(file,function(fserr,fsstat){
                if(!fserr) {
                    var ftime = new Date(fsstat.mtime).getTime()*1000;
                    if (fsstat.size != stat.fsize || ftime > stat.putTime) {
                        res.remove(function(err) {
                            if (err) {
                                console.log(err);
                                return console.error(err);
                            }
                            log.i('again upload file'.yellow + ': ' + name);
                        });
                        upload_file(file,name);
                    }
                }
            });
        } else {
            upload_file(file,name);
        }
    });
};

/**
 * 文件系统监听
 * 只监听添加文件和文件修改
 * 其中在每次监听初始化时，遍历到的文件都会触发添加文件事件
 */
var watch = function () {
    var watcher = chokidar.watch(local_dir, {ignored: /[\/\\]\./, persistent: true});
   
    watcher.on('add', function( file) {
        var name = path.join(dirPrefix, file.replace(local_dir, '')).replace(/\\/g, '/').replace(/^\//g, '');
        check_upload(file, name);
    });
   
    watcher.on('change', function(file) {
        var name = path.join(dirPrefix, file.replace(local_dir, '')).replace(/\\/g, '/').replace(/^\//g, '');
        check_upload(file, name);
    });
};

/**
 * 遍历目录进行上传
 */
var sync = function (dir) {
    if (!dir) {
        dir='';
    }
    var files = fs.readdirSync(path.join(local_dir, dir));
    for(i in files) {
        var fname = path.join(local_dir, dir, files[i]);
        var stat = fs.lstatSync(fname);
        if(stat.isDirectory() == true) {
            sync(path.join(dir, files[i]));
        } else  {
            var name = path.join(dirPrefix, fname.replace(local_dir, '')).replace(/\\/g, '/').replace(/^\//g, '');
            check_upload(fname,name);
        }
    }
};

/**
 * 遍历目录进行上传(覆盖已上传资源)
 */
var sync2 = function (dir) {
    update_exist = true;
    sync(dir);
};

var symlink = function (publicdir){
    var dirpath = path.join(publicdir ? publicDir : sourceDir, local_dir);
    fs.exists(dirpath, function(exists){
        if (!exists) {
            fs.symlinkSync(local_dir, dirpath, 'junction');
        } else {
            log.w('dir exists,can\'t symlink:' + dirpath);
        }
    });
};

var unsymlink = function (dirpath){
    fs.exists(dirpath, function(exists){
        if (exists) {
            issymlink = fs.lstatSync(dirpath).isSymbolicLink();
            if (issymlink) {
                fs.unlink(dirpath);
            }
        }
    });
};

var unsymlinkall = function (){
    unsymlink( path.join(publicDir, local_dir));
    unsymlink( path.join(sourceDir, local_dir));
};

module.exports = {
    sync:sync,
    sync2:sync2,
    watch:watch,
    symlink:symlink,
    unsymlink:unsymlinkall
};