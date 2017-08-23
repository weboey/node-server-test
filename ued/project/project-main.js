/**
 * Created by 6396000843 on 2017/8/23.
 */

var dbConnection = require("../db-connect");

var fileds = "SeriaNum,ProjectName,ProjectImg,ProjectBrief,PrototypeView,Creator,CreatTime,creatorId";
var add_tb_xplan_project_info = "insert into xplan_project_info("+ fileds + ") values(?,?,?,?,?,?,?,?)";

var datas=[];


function insertDataToTbProject(datas){
    //dbConnection.query(truncateMenuNav,function (err, result) {
    //    if(err){
    //        console.log('[DELETE ERROR] - ',err.message);
    //    }
    //});
    datas.forEach(function(row){
        //增
        dbConnection.query(add_tb_xplan_project_info,row,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
            }
        });
    });
    dbConnection.end();
}