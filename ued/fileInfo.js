/**
 * Created by Administrator on 2017/8/16.
 */

var fs = require("fs");
var path = require('path');
var utils = require("./service/utils.js");
var uedPath = "F:/git/ux/ued-resource/组件";

var fileTree = {};

function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
        if (fs.statSync(pathname).isDirectory()) {
            if(file!=="imgs"){ // 过滤imgs目录的文件
                if(!fileTree[file]){
                    fileTree[file]=[];
                }
                travel(pathname, callback);
            }
        } else {
            if(path.extname(pathname) === ".md"){ // 过滤掉非指定格式的文件
                callback(pathname);
            }
        }
    });
}

travel(uedPath,function(file){
    var fileObj = path.parse(file);
    var dirs = fileObj.dir.split(path.sep); //path.sep 平台特定的路径片段分隔符
    var len = dirs.length;
    if(len>0 && dirs[len-1] in fileTree){
        fileTree[dirs[len-1]].push(fileObj.name);
    }
});

//path.dirname(path) 返回一个 path 的目录名
//path.extname(path) 返回 path 的扩展名
var j=Object.getOwnPropertyNames(fileTree).length;
var result = parseFileTree(fileTree);

function parseFileTree(fileTree){
    var result=[];
    var item;var k=0;
    for(key in fileTree){
        k++;
        item=[];
        item.id=k;
        item.name="";
        item.label=utils.getTagValue(key,0);
        item.level=1;
        item.parent=0;
        item.order = utils.getTagValue(key,1);
        result.push(item);
        if(fileTree[key].length>0){
            fileTree[key].forEach(function(file){
                j++;
                item={};
                //"表格121414[tableqwrq]".match(/^.*(?=\[)/)
                //"表格121414[tableqwrq]".match(/^.*\[(.*)\]/)
                item.id=j;
                if(file.indexOf("[") == -1){
                    item.name="";
                    item.label = file;
                }else{
                    item.name=utils.getTagValue(file,1);//file.match(/\[(.*)\]/)[1];
                    item.label=utils.getTagValue(file,0);//file.match(/^.*(?=\[)/)[0];
                }
                item.level=2;
                item.parent=k;
                item.order = utils.getTagValue(file,2);
                result.push(item);
            })
        }
    }
    return result;
}


module.exports = result;

