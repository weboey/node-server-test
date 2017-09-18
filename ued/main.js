/**
 * Created by 6396000843 on 2017/8/17.
 */

var componentFiles = require("./fileInfo");
var dbConnection = require("./db-connect");

var fs = require("fs");
var path = require('path');
var utils = require("./service/utils.js");
var jigsawMenuFilePath = "E:/git/jigsaw/documentation";


var addSql_componentMenuNav = "insert into ued_component_menu_nav(menuId,name,label,level,parent,orderByNum) values(?,?,?,?,?,?)";
var truncateMenuNav ="truncate table ued_component_menu_nav";
var datas = utils.transToArray(componentFiles);


var totalCount=datas.length;

var jigsawFileTree = {
    "其它API":[]
};

utils.travel(jigsawMenuFilePath,function(file){
    var fileObj = path.parse(file);
    var fileMenu = fileObj.name.match(/(.*)-frag/);
    if(fileMenu){ // 查找-frag 后缀的文件夹
        if( fileMenu[1]!=="components"){ //排除组件模块的菜单
            jigsawFileTree["其它API"].push(fileMenu[1]);
        }
    }
},false);


var jigsawMenuData = utils.transToArray(parseJigsawFileTree(jigsawFileTree,totalCount));

datas = datas.concat(jigsawMenuData);


insertData(datas);

function parseJigsawFileTree(fileTree,totalCount){
    var result=[];
    var item;
    var k=totalCount || 0;
    var j = Object.getOwnPropertyNames(fileTree).length + k;
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



