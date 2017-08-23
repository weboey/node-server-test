/**
 * Created by 6396000843 on 2017/8/23.
 */
var fs = require('fs');
var path = require('path');

var utils = require("../service/utils");

const uedResource = 'f:/git/ux';  //导出目标文件路径
const projectPath = 'f:/git/ux/ued-resource/项目';  //导出目标文件路径

var simpleGit = require('simple-git')(uedResource);

function exportGitLog(logFile){
    //"ued-resource/项目/[日本-日本软银]公参管理"
    var project ={
        projectName:logFile,
        history:[]
    };
    //,"--date":'short' git log --pretty=format:"%h,%an,%ad,%s" --date=format:'%Y-%m-%d %H:%M:%S' -- "%1" > f:/gitlog/"%2"
    simpleGit.log({file:logFile,"--pretty":'format:"%h,%an,%ad,%s"'},  function(err, log) {
        log.all.forEach(function(commitRecord,index){
            if(index==log.total-1){
                project.creator = _getCreatorName(commitRecord.author_name);
                project.creatorId = _getCreatorId(commitRecord.author_name);
                project.projectId = commitRecord.hash.slice(0,5);
                project.history.push({date:_formatStrDate(commitRecord.date),message:commitRecord.message});
                project.creatTime=_formatStrDate(commitRecord.date);
            }else{
                project.history.push({date:_formatStrDate(commitRecord.date),message:commitRecord.message});
            }
        });
        console.log(project);
    });
    return  project
}

var gitLogOfProjects =[];

utils.travel(projectPath,function(file){
    var targetFile = path.relative(uedResource,file);
    // var a = p.replace("/\\\/g",'/');
    while(targetFile.indexOf("\\")!=-1){
        targetFile=targetFile.replace("\\",'/');
    }
    console.log(targetFile,logName);
    gitLogOfProjects.push(exportGitLog(targetFile));
},false);

function _formatStrDate(str){
    var result = str.split(" ");
    result.pop();
    return result.join(" ");
}
function _getCreatorName(str){
    return str.match(/[\u4e00-\u9fa5]{2,}/g)
}

function _getCreatorId(str){
    return str.match(/(\d{1,3})+(?:\.\d+)?/g)
}


exports.gitLogOfProjects = gitLogOfProjects;