/**
 * Created by 6396000843 on 2017/8/24.
 */

var async = require("async");

async.waterfall([
    function(cb) { console.log('1.1.1: ', 'start'); cb(null, 3); },
    function(n, cb) { console.log('1.1.2: ',n);cb(null, 8);},
    function(n, cb) { console.log('1.1.3: ',n); cb(null, n);}
], function (err, result) {
    console.log('1.1 err: ', err); // -> null
    console.log('1.1 result: ', result); // -> 16
});

var task1 =function(callback){
    console.log("task1");
    callback(null,"task1")
};

var task2 =function(callback){
    console.log("task2");
    callback(null,"task2")
};

var task3 =function(callback){
    console.log("task3");
    callback(null,"task3")
};

async.series([task1,task2,task3],function(err,result){

    console.log("series");

    if (err) {
        console.log(err);
    }

    console.log(result);
})

//exports.fire = function(obj, callback, timeout) {
//    timeout = timeout || 200;
//    setTimeout(function() {
//        callback(null, obj);
//    }, timeout);
//};


