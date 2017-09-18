/**
 * Created by 6396000843 on 2017/8/17.
 */

var fs = require('fs');
var path = require('path');
var utils = require("./service/utils.js");

var imgPath = "F:/git/ux/ued-resource/组件/imgs/组件"; //图片路径
var dst="F:/git/ued-website/src/doc/ued-design/img";  //图片移动到指定路径

utils.travel(imgPath,function(file){
    utils.copy(file,dst);
});


