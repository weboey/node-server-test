/**
 * Created by 6396000843 on 2017/8/23.
 */

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var git = require("nodegit");

var utils = require("../service/utils");

const uedResource = 'f:/git/ux';  //导出目标文件路径
const projectPath = 'f:/git/ux/ued-resource/项目';  //导出目标文件路径
const git_log_path = 'f:/gitlog';  //日志导出路径
const gitbat = 'f:/git/github/node-server-test/ued/project/git-log.bat'; //脚本路径

var simpleGit = require('simple-git')(uedResource);


//,"--date":'short' git log --pretty=format:"%h,%an,%ad,%s" --date=format:'%Y-%m-%d %H:%M:%S' -- "%1" > f:/gitlog/"%2"
simpleGit.log({file:"ued-resource/项目/[日本-日本软银]公参管理","--pretty":'format:"%h,%an,%ad,%s"'},  function(err, log) {
    //console.log(log.total);
    var project ={history:[]};
    log.all.forEach(function(commitRecord,index){
        //console.log(formatStrDate(commitRecord.date))
        if(index==log.total-1){
            project.creator = getCreatorName(commitRecord.author_name);
            project.creatorId = getCreatorId(commitRecord.author_name);
            project.id = commitRecord.hash.slice(0,5);
            project.history.push({date:formatStrDate(commitRecord.date),message:commitRecord.message});
            project.creatTime=formatStrDate(commitRecord.date);
        }else{
            project.history.push({date:formatStrDate(commitRecord.date),message:commitRecord.message});
        }
    });
    console.log(project);
    //var re1 = /(\d{1,3})+(?:\.\d+)?/g
    //var re2 = /[\u4e00-\u9fa5]{2,}/g
});




utils.travel(projectPath,function(file){
    var targetFile = path.relative(uedResource,file);
    // var a = p.replace("/\\\/g",'/');
    while(targetFile.indexOf("\\")!=-1){
        targetFile=targetFile.replace("\\",'/');
       // targetFile=targetFile.replace("\,",'\\,');
    }
    var logName= path.basename(file)+".txt";
    console.log(targetFile,logName);
   // execBat(gitbat,targetFile,logName);
    //// console.log(p);

    ////console.log(fileName);

},false);





function formatStrDate(str){
    var result = str.split(" ");
    result.pop();
    return result.join(" ");
}

function getCreatorName(str){
    return str.match(/[\u4e00-\u9fa5]{2,}/g)
}

function getCreatorId(str){
    return str.match(/(\d{1,3})+(?:\.\d+)?/g)
}
