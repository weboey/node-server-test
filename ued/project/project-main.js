/**
 * Created by 6396000843 on 2017/8/23.
 */

var dbConnection = require("../db-connect");

var project = require("./project-data");
var utils = require("../service/utils");

var fileds = "SerialNum,ProjectName,Creator,creatorId,CreatTime,PrototypeView,ProjectImg,ProjectBrief";
var add_tb_xplan_project_info = "insert into xplan_project_info("+ fileds + ") values(?,?,?,?,?,?,?,?)";
var query_tb_xplan_project_info = "select SerialNum from xplan_project_info where SerialNum=?";
var del_tb_xplan_project_info = "delete from xplan_project_info  where SerialNum=?";

var datas=[];


setTimeout(function(){
    var projectData = project.getProjectsData();
    var tb_projectsData = utils.transToArray(projectData.tb_projectsData);
    var tb_projectHistoryData = utils.transToArray(projectData.tb_projectHistoryData);
    var tb_projectImages = utils.transToArray(projectData.tb_projectImages);

    console.log("-----------");
    console.log(tb_projectsData);

    console.log("-----------");
    insertDataToTbProject(tb_projectsData)

},5000)


function insertDataToTbProject(datas){
    datas.forEach(function(row){
        //查
        dbConnection.query(query_tb_xplan_project_info,row[0],function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            console.log('--------------------------SELECT QUERY----------------------------');
            console.log(result);

            console.log('------------------------------------------------------------\n\n');
        });
        //增
        dbConnection.query(add_tb_xplan_project_info,row,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
            }
        });
    });
    dbConnection.end();
}
