/**
 * Created by 6396000843 on 2017/8/17.
 */

var componentFiles = require("./fileInfo");
var dbConnection = require("./db-connect");

var addSql_componentMenuNav = "insert into ued_component_menu_nav(menuId,name,label,level,parent) values(?,?,?,?,?)";
var truncateMenuNav ="truncate table ued_component_menu_nav";
var datas = transToArrayFromObj(componentFiles);

insertData(datas);

function insertData(datas){
    dbConnection.query(truncateMenuNav,function (err, result) {
        if(err){
            console.log('[DELETE ERROR] - ',err.message);
        }
    });
    datas.forEach(function(row){
        //增
        dbConnection.query(addSql_componentMenuNav,row,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
            }
        });
    });
    dbConnection.end();
}

function transToArrayFromObj(obj){
    var arr=[];
    componentFiles.forEach(function(rowItem,index){
        arr[index]=[];
        for(key in rowItem){
            arr[index].push(rowItem[key]);
        }
    });
    return arr;
}

