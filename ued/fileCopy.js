/**
 * Created by 6396000843 on 2017/8/17.
 */

var fs = require('fs');
var path = require('path');

var imgPath = "F:/git/ued-resource/组件/imgs/组件"; //图片路径
var dst="../组件/img";  //图片移动到指定路径

travel(imgPath,function(file){
    copy(file,dst);
});



/**
 *功能： 文件遍历
 *参数：dis 遍历目录
 *参数：callback(file) 返回目录下的所有文件
 * */
function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
        if (fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}
/**
 *功能：复制，粘贴
 *参数：src 需要复制源文件
 *参数：dst 粘贴路径
 * */
function copy(src, dst) {
    var fileName = path.basename(src);
    fs.writeFileSync(path.join(dst,fileName), fs.readFileSync(src));
    //fs.existsSync(path)
}

