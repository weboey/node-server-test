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

//path.dirname(path) 返回一个 path 的目录名
//path.extname(path) 返回 path 的扩展名

var result = parseFileTree(fileTree);
//console.log(fileTree);
function parseFileTree(fileTree){
    var result=[];
    var item;var k=0;
    var j=Object.getOwnPropertyNames(fileTree).length;
    for(key in fileTree){
        k++;
        item={};
        item.label=key;
        item.level=1;
        item.id=k;
        result.push(item);
        if(fileTree[key].length>0){
            fileTree[key].forEach(function(file){
                j++;
                item={};
                //"表格121414[tableqwrq]".match(/^.*(?=\[)/)
                //"表格121414[tableqwrq]".match(/^.*\[(.*)\]/)
                if(file.indexOf("[") == -1){
                    item.label = file;
                    item.name="";
                }else{
                    item.label=file.match(/^.*(?=\[)/)[0];
                    item.name=file.match(/^.*\[(.*)\]/)[1];
                }
                item.level=2;
                item.parent=k;
                item.id=j;
                result.push(item);
            })
        }
    }
    return result;
}
console.log(result);