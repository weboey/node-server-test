/**
 * Created by Administrator on 2017/8/8.
 */

var fs = require("fs");
var path = require('path');

var fsLists=[];

//目录遍历
function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
        if (fs.statSync(pathname).isDirectory()) {
            fsLists.push(file);
            travel(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}

travel("./组件",function(file){
    if(path.extname(file) == ".md"){ //path.extname() 方法返回 path 的扩展名
        console.log(path.parse(file));
        fsLists.push(file);
        //console.log(path.dirname(file));
    }
});
console.log(fsLists);
function isFile(path){
    return exists(path) && fs.statSync(path).isFile();
}

function isDir(path){
    return exists(path) && fs.statSync(path).isDirectory();
}

function exists(path){
    return fs.existsSync(path);
}
