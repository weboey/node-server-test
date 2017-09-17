/**
 * Created by Administrator on 2017/8/18.
 */

var fs = require('fs');
var path = require('path');

var gitLogOfProjects = require("./project-git-log").getGitLog;  //git log 数据
var prototypeOfProjects = require("./project-prototype").projectProtoData;  //项目原型数据

function _getProjectsData(){
    var tb_projectsData = [];
    var tb_projectHistoryData = [];
    var tb_projectImages = [];
    var projectsData = [];
    gitLogOfProjects.forEach(function(projectLog){
        prototypeOfProjects.forEach(function(projectPrototype){
            if(projectPrototype.projectName == projectLog.projectName){
                projectsData.push(Object.assign(projectLog,projectPrototype));
            }
        })
    });

    projectsData.forEach(function(project){
        project.history.forEach(function(history){
            var projectHistory={};
            projectHistory.projectId=project.projectId;
            tb_projectHistoryData.push(Object.assign(history,projectHistory));
        });
        project.prototypeImgUrlList.forEach(function(images){
            var projectImages={};
            projectImages.projectId=project.projectId;
            projectImages.prototypeImgUrl=images;
            projectImages.imgType=1;
            tb_projectImages.push(projectImages);
        })
        tb_projectsData.push(shallCopy(project));
    });

    return {
        tb_projectsData:tb_projectsData,
        tb_projectHistoryData:tb_projectHistoryData,
        tb_projectImages:tb_projectImages
    }
}
function shallCopy(n){
    var o={};
    for (var p in n){
        if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) )){
            if(p!=="history" && p!=="prototypeImgUrlList")
            o[p]=n[p];
        }
    }
    return o
};

module.exports = {
    getProjectsData:_getProjectsData
};

