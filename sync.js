var fs = require('fs');
//var qiniu = require('node-qiniu');
var path = require('path');
var log = hexo.log;

var config = require('./config');
var chokidar = require('chokidar');
var getEtag = require('./qetag');
var minimatch = require('minimatch');
var processor = require('process')

var publicDir = hexo.public_dir;
var sourceDir = hexo.source_dir;

var ignoring_log = config.ignoring_log;
var ignoring_files = config.ignoring_files || [];

var local_dir_name= config.local_dir ? config.local_dir : 'cdn';
var dirPrefix = config.dirPrefix ? config.dirPrefix : '';
local_dir_name = path.join(local_dir_name, '.').replace(/[\\\/]/g, path.sep);
var local_dir = local_dir_name;
if (!path.isAbsolute(local_dir)) {
    local_dir = path.join(processor.cwd(),local_dir_name)
}
var update_exist = config.update_exist ? config.update_exist : false;
var need_upload_nums = 0;
var scan_mode = false;


var qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = config.access_key;
qiniu.conf.SECRET_KEY = config.secret_key;


if(config.up_host){
    qiniu.conf.UP_HOST = config.up_host;
}

var bucket = config.bucket

//构造上传函数
function uploadFile(key, localFile) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  var uptoken = putPolicy.token();
  var extra = new qiniu.io.PutExtra();
  log.i(bucket, key, localFile)
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        //console.log(ret.hash, ret.key, ret.persistentId);       
      } else {
        // 上传失败， 处理返回代码
        console.log(err);
      }
  });
}

//构建bucketmanager对象
var client = new qiniu.rs.Client();



var qetag = require('./qetag');


/**
 * 上传前预先检查
 * file为本地路径(绝对路径或相对路径都可)
 * name为远程文件名
 */
var check_upload = function (file, name) {
    //uploadFile(config.bucket, file.replace(/\\/g, '/'), name);
    
    

    //获取文件信息
    client.stat(config.bucket, name, function(err, ret) {

        if (!err) {
            //console.log(ret.hash, ret.fsize, ret.putTime, ret.mimeType);
            getEtag(file, function (hash) {
                
                if(hash != ret.hash){
                    // 不更新已存在的，忽略
                    if (!update_exist) {
                        log.i('Don\'t upload exist file: '.yellow + file);
                        return;
                    } 

                    need_upload_nums++;
                    if (scan_mode) return;
                    log.i('Need upload update file: '.yellow + file);
                    uploadFile(name, file);
                }

            });

        } else {

            // 文件不存在
            if(err.code == 612){
                need_upload_nums++;
                if (scan_mode) return;
                log.i('Need upload file: '.yellow + file);
                uploadFile(name, file);
            }else{
                log.e('get file stat err: '.cyan + name + '\n' + err);    
            }
        }
    });


    // var res = imagesBucket.key(name);
    // res.stat(function(err, stat) {
    //     if (err) {
    //         log.e('get file stat err: '.cyan + name + '\n' + err);
    //         return;
    //     }

    //     getEtag(file, function (hash) {
    //         //先判断七牛是否已存在文件
    //         if (stat.hash) {
    //             if (!update_exist) {
    //                 return;
    //             }
    //             if (stat.hash != hash) {
    //                 res.remove(function(err) {
    //                     if (err) {
    //                         return console.error(err);
    //                     }
    //                     need_upload_nums++;
    //                     if (scan_mode) return;
    //                     log.i('Need upload update file: '.yellow + file);
    //                 });
    //                 uploadFile(file,name);
    //             }
    //         } else {
    //             need_upload_nums++;
    //             if (scan_mode) return;
    //             log.i('Need upload file: '.yellow + file);
    //             uploadFile(file,name);
    //         }
    //     });
    // });
};

/**
 * 文件系统监听
 * 只监听添加文件和文件修改
 * 其中在每次监听初始化时，遍历到的文件都会触发添加文件事件
 */
var watch = function () {
    scan_mode = false;
    log.i('Now start qiniu watch.'.yellow);
    var watcher = chokidar.watch(local_dir, {ignored: /[\/\\]\./, persistent: true});
   
    watcher.on('add', function(file, event) {
        
        var name = path.join(dirPrefix, file.replace(local_dir, '')).replace(/\\/g, '/').replace(/^\//g, '');
        check_upload(file, name);
    });
   
    watcher.on('change', function(file, event) {
        
        var name2 = path.join(dirPrefix, file.replace(local_dir, '')).replace(/\\/g, '/').replace(/^\//g, '');
        check_upload(file, name2);
    });
};

/**
 * 忽略指定文件
 * @param  {String}  path 文件路径
 * @return {Boolean}
 */
function isIgnoringFiles(path){
    if (!ignoring_files.length) return false;

    for (var i = 0, l = ignoring_files.length; i < l; i++){
        if (minimatch(path, ignoring_files[i])) return true;
    }

    return false;
}

/**
 * 遍历目录进行上传
 */
var sync = function (dir) {
    if (!dir) {
        dir='';
        log.i('Now start qiniu sync.'.yellow);
    }
    var files = fs.readdirSync(path.join(local_dir,dir));
    files.forEach(function(file)  {
        var fname = path.join(local_dir + '', dir + '', file + '');
    var stat = fs.lstatSync(fname);
        if(stat.isDirectory() == true) {
            sync(path.join(dir + '', file + ''));
        } else  {
            var name = path.join(dirPrefix, fname.replace(local_dir, '')).replace(/\\/g, '/').replace(/^\//g, '');

            if (!isIgnoringFiles(name)) {
                check_upload(fname, name);
            } else {
                ignoring_log && log.i(name + ' ignoring.'.yellow);
            }
        }
    })
};

/**
 * 遍历目录进行上传(会覆盖已上传且版本不同的资源)
 */
var sync2 = function () {
    update_exist = true;
    sync();
};

/**
 * 遍历目录扫描需上传文件
 */
var scan = function () {
    scan_mode = true;
    sync();
};

/**
 * 获得扫描结果
 */
var scan_end = function () {
    log.i('Need upload file num: '.yellow + need_upload_nums + (need_upload_nums>0 ? '\nPlease run `hexo qiniu sync` to sync.' : '').green.bold);
    
};

/**
 * 链接目录
 */
var symlink = function (isPublicDir){
    var dirpath = path.join(isPublicDir ? publicDir : sourceDir, local_dir_name);

    if( fs.existsSync(dirpath)){
        log.w('Dir exists,can\'t symlink:'.red + dirpath);
        return ;
    }
    // 确保父目录存在
    var parent = path.resolve(dirpath, '..');
    if( ! fs.existsSync(parent)){
        fs.mkdirSync(parent)
    }

    fs.symlinkSync(local_dir, dirpath, 'junction');
    if (!fs.existsSync(dirpath)) {
        log.e('Can\'t make link fail!'.red);
        log.w('Maybe do not have permission.'.red);
        if (process.platform === 'win32') {
            log.e('Please ensure that run in administrator mode!'.red);
        }
    }
      
};

/**
 * 取消链接目录
 */
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

/**
 * 取消链接所有目录
 */
var unsymlinkall = function (){
    unsymlink( path.join(publicDir, local_dir));
    unsymlink( path.join(sourceDir, local_dir));
};

module.exports = {
    sync:sync,
    sync2:sync2,
    scan:scan,
    scan_end:scan_end,
    watch:watch,
    symlink:symlink,
    unsymlink:unsymlinkall
};