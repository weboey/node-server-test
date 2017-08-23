/**
 * Created by 6396000843 on 2017/8/21.
 */
var fs = require('fs');
var path = require('path');
var uedProjectPath = "F:/git/ued-resource/项目";
var uedPath = "F:/git";
var serverPath = "http://localhost:8080/ux";

function Project(){

};
const projectFiled={
    prototypeImgUrl:"头图",
    prototypeBrief:"项目简介",
    prototypeView:"原型",
    prototypeImgUrlList:"效果图"
};
var projectList=[];
var fileTree = {};

travel(uedProjectPath,function(file){
    var fileObj = path.parse(file);
    var projectName= fileObj.name;
    if(!fileTree[projectName]){
        fileTree[projectName]={};
        fileTree[projectName]["prototypeImgUrlList"]=[];
        fileTree[projectName]["prototypeView"]="";
    }
},false);

travel(uedProjectPath,function(file){

    //console.log(path.relative(uedPath, file));
    var fileObj = path.parse(file);
    //var dirs = fileObj.dir.split(path.sep); //path.sep 平台特定的路径片段分隔符
    for(project in fileTree){
        if(fileTree.hasOwnProperty(project)){
            if(fileObj.dir.indexOf(project)!=-1){
                fileTree[project].projectName=project;
                for(filed in projectFiled){
                    if(fileObj.dir.indexOf(projectFiled[filed])!=-1 || fileObj.name.indexOf(projectFiled[filed])!=-1){
                        if(filed=="prototypeImgUrlList"){
                            fileTree[project]["prototypeImgUrlList"].push(file);
                        }else{
                            fileTree[project][filed]=file;
                        }
                    }
                }
            }
        }
    }
});
/*
travel(uedProjectPath,function(file){
    var fileObj = path.parse(file);
    for(project in fileTree){
        if(fileTree.hasOwnProperty(project)) {
            if (fileObj.dir.indexOf(project) != -1) {
                console.log(project);
            }
        }
    }
});*/

console.log(fileTree);


function travel(dir,callback,dep) {
    dep = dep==null?true:dep; //默认深度遍历到所有子文件
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
        if(dep && fs.statSync(pathname).isDirectory()){
            if(file.indexOf("原型")==-1){ //原型目录中的文件太多了，不需要遍历，特殊处理
                travel(pathname, callback);
            }else{
                callback(path.join(pathname, 'index.html'));
            }
        }else{
            callback(pathname);
        }
    });
}





