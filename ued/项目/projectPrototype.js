/**
 * Created by 6396000843 on 2017/8/21.
 */


var fs = require('fs');
var path = require('path');

var uedProjectPath = "F:/git/ued-resource/项目";

var projectList=[];
var fileTree = {};
travel(uedProjectPath,function(file){
    var project={};
    var fileObj = path.parse(file);

    var projectName= fileObj.name;

    if(!fileTree[projectName]){
        fileTree[projectName]=[];
    }
    projectList.push(project);
},false);

console.log(projectList);
console.log(fileTree);



function travel(dir,callback,dep) {
    dep = dep==null?true:dep; //默认深度遍历到所有子文件
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
        if(dep && fs.statSync(pathname).isDirectory()){
            travel(pathname, callback);
        }else{
            callback(pathname);
        }
    });
}