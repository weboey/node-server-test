/**
 * Created by Administrator on 2017/8/18.
 */

var fs = require('fs');
var path = require('path');
const readline = require('readline');

var utils = require("./utils");

const git_log_path = 'e:/test';

const rl = readline.createInterface({
    input: fs.createReadStream('e:/test/表格[table].md.log'),
    output: fs.createWriteStream('e:/test/myOut.txt')
});

utils.travel(git_log_path,function(file){
    if(path.extname(file) === ".log"){ // 过滤掉非日志文件
        console.log(file);
    }
});
//rl.write("随便写入一个");
var result=[];
rl.on('line', (line) => {
    var commitKey = line.trim().slice(line.indexOf("commit")+7);
    var arr = line.split(/\:/);
    var item={};
    item[arr[0]]=arr[1];
    result.push(item);
});
setTimeout(function(){
    console.log(result);
},0)


//然后用String.split(/\r?\n/ig)来分隔  \s+ 一个或多个空格