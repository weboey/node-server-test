/**
 * Created by 6396000843 on 2017/9/6.
 */

var fs = require("fs");
var path = require('path');
var utils = require("./service/utils.js");
var jigsawMenuFilePath = "E:/git/jigsaw/documentation";

var menu = {name:"other-api",label:"其它API",level:1,parent:0,orderByNum:4};


const menuType = ["classes-frag","directives-frag","injectables-frag","interfaces-frag","modules-frag"];

var jigsawFileTree = {
    "其它API":[]
};

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};
var apiListResult=[];
var apiList={};
utils.travel(jigsawMenuFilePath,function(file){
    var fileObj = path.parse(file);
    if(menuType.contains(fileObj.name)){
        apiList[fileObj.name]=[];
        utils.travel(file,jigsawApiList,false);
    }
},false);

//function jigsawApiList(jigsawapiItem){
//    var apiItem = path.parse(jigsawapiItem);
//    var dirs = apiItem.dir.split(path.sep); //path.sep 平台特定的路径片段分隔符
//    var len = dirs.length;
//    if(len>0 && dirs[len-1] in apiList){
//        apiList[dirs[len-1]].push(apiItem.name);
//    }
//}

function jigsawApiList(jigsawapiItem){
    var apiItem = path.parse(jigsawapiItem);
    var dirs = apiItem.dir.split(path.sep); //path.sep 平台特定的路径片段分隔符
    var len = dirs.length;
    if(len>0 && dirs[len-1] in apiList){
        var item={};
        item.name=apiItem.name;
        item.parentName=dirs[len-1].replace("-frag","");
        apiListResult.push(item);
    }
}
var dbConnection = require("./db-connect");
var addSql_MenuNavApi = "insert into ued_component_menu_api(name,parentName) values(?,?)";
var truncateMenuNav ="truncate table ued_component_menu_api";

var jigsawApiDatas=utils.transToArray(apiListResult);
insertData(jigsawApiDatas,addSql_MenuNavApi,truncateMenuNav);

function insertData(datas,addSql,truncateSql){
    dbConnection.connect();
    dbConnection.query(truncateSql,function (err, result) {
        if(err){
            console.log('[DELETE ERROR] - ',err.message);
        }
    });
    datas.forEach(function(row){
        //增
        dbConnection.query(addSql,row,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
            }
        });
    });
    dbConnection.end();
}
/*
utils.travel(jigsawMenuFilePath,function(file){
    var fileObj = path.parse(file);
    var fileMenu = fileObj.name.match(/(.*)-frag/);
    if(fileMenu){ // 查找-frag 后缀的文件夹
        if( fileMenu[1]!=="components"){ //排除组件模块的菜单
            jigsawFileTree["其它API"].push(fileMenu[1]);
        }
    }
},false);

var k=32;

var j = Object.getOwnPropertyNames(jigsawFileTree).length +32;
var result = parseJigsawFileTree(jigsawFileTree);
function parseJigsawFileTree(fileTree){
    var result=[];
    var item;
    for(key in fileTree){
        item={};
        k++;
        item.id=k;
        item.name="";
        item.label=key;
        item.level=1;
        item.parent=0;
        item.order = 99;
        result.push(item);
        if(fileTree[key].length>0){
            fileTree[key].forEach(function(file){
                j++;
                item={};
                item.id=j;
                item.name=file;
                item.label = file;
                item.level=2;
                item.parent=k;
                item.order = j;
                result.push(item);
            })
        }
    }
    return result;
}

var datas = utils.transToArray(result);
console.log(datas);*/
