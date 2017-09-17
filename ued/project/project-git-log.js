/**
 * Created by 6396000843 on 2017/8/23.
 */
var fs = require('fs');
var path = require('path');
var Q = require('q');
var async = require("async");
var utils = require("../service/utils");

const uedResource = 'f:/git/ux';  //导出目标文件路径
const projectPath = 'f:/git/ux/ued-resource/项目';  //导出目标文件路径

var simpleGit = require('simple-git')(uedResource);

var gitLogOfProjects =[];

function travalAndExportGitLog(callback){
    utils.travel(projectPath,function(file){
        async.waterfall([
            function(cb){
                var targetFile = path.relative(uedResource,file);
                // var a = p.replace("/\\\/g",'/');
                while(targetFile.indexOf("\\")!=-1){
                    targetFile=targetFile.replace("\\",'/');
                }
                cb(null,targetFile);
            },
            function(logFile,cb){
                //"ued-resource/项目/[日本-日本软银]公参管理"
                var project ={
                    history:[]
                };
                //,"--date":'short' git log --pretty=format:"%h,%an,%ad,%s" --date=format:'%Y-%m-%d %H:%M:%S' -- "%1" > f:/gitlog/"%2"
                simpleGit.log({file:logFile,"--pretty":'format:"%h,%an,%ad,%s"'},  function(err, log) {
                    //console.log(log);
                    log.all.forEach(function(commitRecord,index){
                        if(index==log.total-1){
                            project.projectId = commitRecord.hash.slice(0,6);
                            project.projectName=path.parse(logFile).name;
                            project.creator = _getCreatorName(commitRecord.author_name);
                            project.creatorId = _getCreatorId(commitRecord.author_name);
                            project.history.push({
                                messageId:commitRecord.hash.slice(0,6),
                                updator:_getCreatorName(commitRecord.author_name),
                                updaterId:_getCreatorId(commitRecord.author_name),
                                date:_formatStrDate(commitRecord.date),
                                message:commitRecord.message.replace(/\(HEAD.*\)/g,"").trim()
                            });
                            project.creatTime=_formatStrDate(commitRecord.date);
                        }else{
                            project.history.push({
                                messageId:commitRecord.hash.slice(0,6),
                                updator:_getCreatorName(commitRecord.author_name),
                                updaterId:_getCreatorId(commitRecord.author_name),
                                date:_formatStrDate(commitRecord.date),
                                message:commitRecord.message.replace(/\(HEAD.*\)/g,"").trim()
                            });
                        }
                    });
                    cb(null, project)
                })
            },
            function(project,cb){
                cb(null,project);
            }
        ],callback);
    },false);
}

var readLog = function(filename){
    var defer=Q.defer();

    travalAndExportGitLog(function (err,result) {
        if(err) defer.reject(err);
        else {
            console.log(result);
            gitLogOfProjects.push(result);
            defer.resolve(result);
        }
    });
    return defer.promise;
}

readLog().then(function(value){
    //console.log(value);
});

/**/

function _formatStrDate(str){
    var result = str.split(" ");
    result.pop();
    return result.join(" ");
}
function _getCreatorName(str){
    return str.match(/[\u4e00-\u9fa5]{2,}/g)[0]
}

function _getCreatorId(str){
    return str.match(/(\d{1,3})+(?:\.\d+)?/g)[0]
}
//setTimeout(function(){
//    console.log(gitLogOfProjects);
//},5000);

//var Promise = new Promise(resolve=>{
//        resolve(gitLogOfProjects)
//    }).then(value=>console.log(value))

exports.getGitLog = gitLogOfProjects;