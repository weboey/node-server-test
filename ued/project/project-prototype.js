/**
 * Created by 6396000843 on 2017/8/21.
 */
var fs = require('fs');
var path = require('path');

var serverPath = "localhost:8080/ux";
const uedResource = 'f:/git/ux';  //导出目标文件路径
const projectPath = 'f:/git/ux/ued-resource/项目';  //导出目标文件路径

const projectFiled={
    prototypeImgUrl:"头图",
    prototypeBrief:"项目简介",
    prototypeView:"原型",
    prototypeImgUrlList:"效果图"
};

var fileTree = {};

travel(projectPath,function(file){
    var fileObj = path.parse(file);
    var projectName= fileObj.name;
    if(!fileTree[projectName]){
        fileTree[projectName]={};
        fileTree[projectName]["prototypeImgUrlList"]=[];
        fileTree[projectName]["prototypeView"]="";
    }
},false);

travel(projectPath,function(file){
    //console.log(path.relative(uedPath, file));
    var fileObj = path.parse(file);
    //var dirs = fileObj.dir.split(path.sep); //path.sep 平台特定的路径片段分隔符
    for(project in fileTree){
        if(fileTree.hasOwnProperty(project)){
            if(fileObj.dir.indexOf(project)!=-1){
                fileTree[project].projectName=project;
                for(filed in projectFiled){
                    if(fileObj.dir.indexOf(projectFiled[filed])!=-1 || fileObj.name.indexOf(projectFiled[filed])!=-1){
                       // console.log(path.join(serverPath,path.relative(uedResource,file)).replace(/\\/g,'/'));
                        var fileUrl = "http://"+path.join(serverPath,path.relative(uedResource,file)).replace(/\\/g,'/');
                        console.log(fileUrl);
                        if(filed=="prototypeImgUrlList"){
                            fileTree[project]["prototypeImgUrlList"].push(fileUrl);
                        }else{
                            fileTree[project][filed]=fileUrl;
                        }
                    }
                }
            }
        }
    }
});

function travel(dir,callback,dep) {
    dep = dep==null?true:dep; //默认深度遍历到所有子文件
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
        if(dep && fs.statSync(pathname).isDirectory()){
            if(file.indexOf("原型")==-1){ //原型目录中的文件太多了，不需要遍历，特殊处理
                travel(pathname, callback);
            }else{
                try {
                    fs.accessSync(path.join(pathname, 'home.html')); //如果存在home.html，原型就用home.html
                    callback(path.join(pathname, 'home.html'));
                }catch(err){
                    callback(path.join(pathname, 'index.html'));
                }
            }
        }else{
            callback(pathname);
        }
    });
}

var result =[];

for(p in fileTree){
    result.push(fileTree[p]);
}

exports.projectProtoData = result;



