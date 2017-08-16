/**
 * Created by Administrator on 2017/8/16.
 */

var fs = require("fs");
var path = require('path');

var fileTree = {};

function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
        if (fs.statSync(pathname).isDirectory()) {
            if(!fileTree[file]){
                fileTree[file]=[];
            }
            travel(pathname, callback);
        } else {
            if(path.extname(pathname) === ".txt"){ // 过滤掉非指定格式的文件
                callback(pathname);
            }
        }
    });
}

travel("../组件",function(file){
    var fileObj = path.parse(file);
    var dirs = fileObj.dir.split(path.sep); //path.sep 平台特定的路径片段分隔符
    var len = dirs.length;
    if(len>0 && dirs[len-1] in fileTree){
        fileTree[dirs[len-1]].push(fileObj.name);
    }
});

console.log("第一级的目录:",fileTree);
