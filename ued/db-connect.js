/**
 * Created by Administrator on 2017/8/8.
 */

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '10.9.233.35',
    user     : 'root',
    password : 'ux123~',
    database : 'xplan',
    stringifyObjects:true
});

connection.connect();

var  sql = 'SELECT * from xplan_sys_roles limit 3';

connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    console.log('--------------------------SELECT----------------------------');
    results.forEach(function(rowData){
        console.log(rowData.roleID);
    })
    console.log('------------------------------------------------------------\n\n');
});

connection.end();