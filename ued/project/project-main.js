/**
 * Created by 6396000843 on 2017/8/23.
 */

var dbConnection = require("../db-connect");

var project = require("./project-data");
var utils = require("../service/utils");

var fileds = "ProjectName,Creator,creatorId,CreatTime,Updator,updaterId,UpdateTime,SerialNum,PrototypeView,ProjectImg,ProjectBrief";
var filedsOfhistory = "messageId,updator,updaterId,updateTime,message,SerialNum";
var filedsOfImages = "SerialNum,PrototypeImgUrl,imgType";

var add_tb_xplan_project_info = "insert into xplan_project_info("+ fileds + ") values(?,?,?,?,?,?,?,?,?,?,?)";
var del_tb_xplan_project_info = "delete from xplan_project_info  where SerialNum=?";

var add_tb_ued_project_history = "insert into ued_project_history("+ filedsOfhistory + ") values(?,?,?,?,?,?)";
var del_tb_ued_project_history = "delete from ued_project_history  where messageId=?";

var add_tb_xplan_prototype_images = "insert into xplan_prototype_images("+ filedsOfImages + ") values(?,?,?)";
var del_tb_xplan_prototype_images = "delete from xplan_prototype_images  where PrototypeImgUrl=?";


setTimeout(function(){
    var projectData = project.getProjectsData();
    var tb_projectsData = utils.transToArray(projectData.tb_projectsData);
    var tb_projectHistoryData = utils.transToArray(projectData.tb_projectHistoryData);
    var tb_projectImages = utils.transToArray(projectData.tb_projectImages);
    console.log(tb_projectImages);
    dbConnection.connect();
      insertDataToTbProject(tb_projectsData,add_tb_xplan_project_info,del_tb_xplan_project_info,7);
      insertDataToTbProject(tb_projectHistoryData,add_tb_ued_project_history,del_tb_ued_project_history);
      insertDataToTbProject(tb_projectImages,add_tb_xplan_prototype_images,del_tb_xplan_prototype_images,1);
    dbConnection.end();
},10000);

function execSql(fn){

}

function insertDataToTbProject(datas,addSql,delSql,key){

    datas.forEach(function(row){
        //查
        //dbConnection.query(query_tb_xplan_project_info,row[0],function (err, result) {
        //    if(err){
        //        console.log('[SELECT ERROR] - ',err.message);
        //        return;
        //    }
        //    console.log('--------------------------SELECT----------------------------');
        //    console.log(result);
        //});
        //删掉旧数据
        if(!!delSql){
            dbConnection.query(delSql,row[key || 0],function (err, result) {
                if(err){
                    console.log('[INSERT ERROR] - ',err.message);
                }
                console.log('DELETE affectedRows',result.affectedRows);
            });
        }
        //增
        dbConnection.query(addSql,row,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
            }
        });
    });

}
