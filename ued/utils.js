/**
 * Created by Administrator on 2017/8/18.
 */
var fs = require('fs');
var path = require('path');
/**
 *功能： 文件遍历
 *参数：dis 遍历目录
 *参数：callback(file) 返回目录下的所有文件
 * */
function _travel(dir, callback) {
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
function _copy(src, dst) {
    var fileName = path.basename(src);
    fs.writeFileSync(path.join(dst,fileName), fs.readFileSync(src));
    //fs.existsSync(path)
}

module.exports = {
    travel:_travel,
    copy:_copy
};
