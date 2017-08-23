/**
 * Created by Administrator on 2017/8/18.
 */

var fs = require('fs');
var path = require('path');

var gitLogOfProjects = require("./project-git-log");  //git log 数据
var prototypeOfProjects = require("./project-git-log");  //项目原型数据


var tb_projectsData = [];

var tbProjectHistoryData = [];

function getProjectsData(){
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
            tb_projectsData.push(Object.assign(projectHistory,history))
        })
    });

    return projectsData;

    //tb_projectsData.push(projectLog.history);

}



