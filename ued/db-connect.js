var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '10.9.233.35',
    user     : 'root',
    password : 'ux123~',
    database : 'xplan',
    stringifyObjects:true
});

connection.connect();

module.exports = connection;