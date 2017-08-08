/**
 * Created by Administrator on 2017/8/8.
 */

var fs = require("fs");
var path = require('path');
fs.readFile("./build/test.md",function(err,data){
    if(err) return console.log(err);
    //console.log(data.toString())
});

console.log("程序执行结束!");

var fsData = [];
var obj={};
fs.exists("./组件", function(){
    fs.readdir("./组件",function(err, files){
        if (err) {
            return console.error(err);
        }
        files.forEach( function (file){
            console.log("第一级："+file);
            obj={};
            if(isDir("./组件/"+file)){
                fs.readdir("./组件/"+file,function(err, files2){
                    obj[file]=[];
                    files2.forEach( function (file2){
                        console.log("第二级："+file2);

                        obj[file].push(file2)
                    })
                })
            }
            fsData.push(obj);
        });
        console.log(fsData);
    });
})

console.log(fs.readdirSync("./组件"));
setTimeout(function(){
    console.log(fsData);
},5100);


function isFile(path){
    return exists(path) && fs.statSync(path).isFile();
}

function isDir(path){
    return exists(path) && fs.statSync(path).isDirectory();
}

function exists(path){
    return fs.existsSync(path);
}
console.log("文件路径");
console.log(process.execPath);
console.log(__dirname);
console.log(process.cwd());