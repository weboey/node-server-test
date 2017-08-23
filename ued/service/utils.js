/**
 * Created by Administrator on 2017/8/18.
 */
var fs = require('fs');
var path = require('path');
var async = require("async");
/**
 *功能： 文件遍历
 *参数：dis 遍历目录
 *参数：callback(file) 返回目录下的所有文件
 * */
function _travel(dir, callback,dep) {
    dep = dep==null?true:dep; //默认深度遍历到所有子文件
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
        if (dep && fs.statSync(pathname).isDirectory()) {
            _travel(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}

/**
 *功能：文件复制，粘贴
 *参数：src 需要复制源文件
 *参数：dst 粘贴路径
 * */
function _copy(src, dst) {
    var fileName = path.basename(src);
    fs.writeFileSync(path.join(dst,fileName), fs.readFileSync(src));
    //fs.existsSync(path)
}

function mkdirs(p, mode, f, made) {
    if (typeof mode === 'function' || mode === undefined) {
        f = mode;
        mode = 0777 & (~process.umask());
    }
    if (!made)
        made = null;

    var cb = f || function () {};
    if (typeof mode === 'string')
        mode = parseInt(mode, 8);
    p = path.resolve(p);

    fs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirs(path.dirname(p), mode, function (er, made) {
                    if (er) {
                        cb(er, made);
                    } else {
                        mkdirs(p, mode, cb, made);
                    }
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                fs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) {
                        cb(er, made);
                    } else {
                        cb(null, made)
                    };
                });
                break;
        }
    });
}
/**
 *功能：文件复制，粘贴 (async)
 *参数：file 需要复制源文件
 *参数：toDir 粘贴路径
 *参数：cb 回调
 * */
function _copyFile(file, toDir, cb) {
    async.waterfall([
        function (callback) {
            fs.exists(toDir, function (exists) {
                if (exists) {
                    callback(null, false);
                } else {
                    callback(null, true);
                }
            });
        }, function (need, callback) {
            if (need) {
                mkdirs(path.dirname(toDir), callback);
            } else {
                callback(null, true);
            }
        }, function (p, callback) {
            var reads = fs.createReadStream(file);
            var writes = fs.createWriteStream(path.join(path.dirname(toDir), path.basename(file)));
            reads.pipe(writes);
            //don't forget close the  when  all the data are read
            reads.on("end", function () {
                writes.end();
                callback(null);
            });
            reads.on("error", function (err) {
                console.log("error occur in reads");
                callback(true, err);
            });

        }
    ], cb);

}


function _ccoutTask(from, to, cbw) {
    async.waterfall([
        function (callback) {
            fs.stat(from, callback);
        },
        function (stats, callback) {
            if (stats.isFile()) {
                cbw.addFile(from, to);
                callback(null, []);
            } else if (stats.isDirectory()) {
                fs.readdir(from, callback);
            }
        },
        function (files, callback) {
            if (files.length) {
                for (var i = 0; i < files.length; i++) {
                    _ccoutTask(path.join(from, files[i]), path.join(to, files[i]), cbw.increase());
                }
            }
            callback(null);
        }
    ], cbw);

}
// wrap the callback before counting
function ccoutTask(from, to, cb) {
    var files = [];
    var count = 1;

    function wrapper(err) {
        count--;
        if (err || count <= 0) {
            cb(err, files)
        }
    }
    wrapper.increase = function () {
        count++;
        return wrapper;
    }
    wrapper.addFile = function (file, dir) {
        files.push({
            file : file,
            dir : dir
        });
    }

    _ccoutTask(from, to, wrapper);
}

/**
 *功能：目录文件夹复制，粘贴 (async)
 *参数：from 需要复制文件夹
 *参数：to 目标路径
 *参数：cb 回调
 * */
function _copyDir(from, to, cb) {
    if(!cb){
        cb=function(){};
    }
    async.waterfall([
        function (callback) {
            fs.exists(from, function (exists) {
                if (exists) {
                    callback(null, true);
                } else {
                    console.log(from + " not exists");
                    callback(true);
                }
            });
        },
        function (exists, callback) {
            fs.stat(from, callback);
        },
        function (stats, callback) {
            if (stats.isFile()) {
                // one file copy
                copyFile(from, to, function (err) {
                    if (err) {
                        callback(true);
                    } else {
                        callback(null, []);
                    }
                });
            } else if (stats.isDirectory()) {
                ccoutTask(from, to, callback);
            }
        },
        function (files, callback) {
            async.mapLimit(files, 10, function (f, cb) {
                copyFile(f.file, f.dir, cb);
            }, callback);
        }
    ], cb);
}

module.exports = {
    travel:_travel, //目录遍历
    copy:_copy, //文件复制
    copyFile:_copyFile, //文件复制 async
    copyDir:_copyDir //文件夹复制 async
};
