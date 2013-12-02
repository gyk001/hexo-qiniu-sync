var url = require('url');
var http = require('http');
var exec = require('child_process').exec;
var fs = require('fs');
var log = hexo.log;
var config = require('./config')(hexo);

var local_dir ='source/'+ config.local_dir;

var sync =function() {
    log.i('同步目录:'+local_dir);
    var cp = require('child_process');
    //exec可以像spawn一样使用
    var ls = cp.exec('qrsync/qrsync qrsync/qn.json', {} /*options, [optional]*/ );
    
    ls.stdout.on('data', function(data) {
        log.i(data);
    });

    ls.stderr.on('data', function(data) {
        log.i(data);
    });

    ls.on('exit', function(code) {

        if (code == 0) {
            log.i('同步七牛存储成功');
        } else {
            log.e('同步七牛存储失败');
        }
    });
};

var watchAndSync = function() {
    sync();
    fs.watch(local_dir, function(event, filename) {
        sync();
        console.log('event is: ' + event);
        if (filename) {
            console.log('filename provided: ' + filename);
        } else {
            console.log('filename not provided');
        }
    });
    log.i('监听本地同步文件夹:'+local_dir);
};

module.exports = {
    sync:sync,
    watchAndSync:watchAndSync
};