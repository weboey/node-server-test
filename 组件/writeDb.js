/**
 * Created by Administrator on 2017/8/16.
 */

var fs = require("fs");
var path = require('path');
var child_process = require('child_process');

var bat = 'f:/git/github/node-server-test/git-log.bat';
var logPath = 'e:/test';
var filePath = 'f:/git/rdk/rdk/app/libs';

function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
        if (fs.statSync(pathname).isDirectory()) {
            callback(pathname);
        } else {
           // if(path.extname(pathname) === ".txt"){ // 过滤掉非指定格式的文件

          //  }
        }
    });
}
var execBat = function(url,file,log){
    child_process.execFile(url,[file,log],{cwd:'f:/'},function (error,stdout,stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        else console.log('成功执行指令!');
    });
};

/*travel("../组件",function(file){
    var pa = path.relative('../', file);
    var log = path.basename(file,".txt")+".log";
    pa = pa.replace(/\\/g,"/");
    execBat(bat,pa,log);
});*/

travel(filePath,function(file){
    var p = path.relative("f:/git/rdk",file);
   // var a = p.replace("/\\\/g",'/');
    while(p.indexOf("\\")!=-1){
        p=p.replace("\\",'/');
    }
   // console.log(p);
    var fileName= path.basename(file)+".log";
    //console.log(fileName);
    execBat(bat,p,fileName);
});

//git log  http://fsjoy.blog.51cto.com/318484/245261/
