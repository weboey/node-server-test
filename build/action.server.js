/**
 * Created by Administrator on 2017/8/5.
 */
var express = require('express');
var bodyParser = require('body-parser');
var ws_1 = require('ws');
var multer  = require('multer');
var fs = require("fs");
var path = require("path");
var upload = multer();
var app = express();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
//app.use(express.bodyParser({uploadDir:'./tmp'}));
//app.use(busboy());
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

var Product = (function () {
    function Product(id, title, price, reting, desc, categories) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.reting = reting;
        this.desc = desc;
        this.categories = categories;
    }
    return Product;
})();
exports.Product = Product;
var products = [
    new Product(1, "这是第1个商品", 1.99, 3.5, "这是第一个商品", ["图书"]),
    new Product(2, "这是第2个商品", 2.99, 1.5, "这是第一个商品", ["图书"]),
    new Product(3, "这是第3个商品", 3.99, 4.5, "这是第一个商品", ["食物"]),
    new Product(4, "这是第4个商品", 4.99, 5.5, "这是第一个商品", ["办公", "图书"]),
    new Product(5, "这是第5个商品", 5.99, 3.5, "这是第一个商品", ["衣服"]),
    new Product(6, "这是第6个商品", 6.99, 6.5, "这是第一个商品", ["电子产品", "硬件设备"]),
    new Product(7, "这是第7个商品", 7.99, 8.5, "这是第一个商品", ["电子产品"]),
    new Product(8, "这是第8个商品", 8.99, 9.5, "这是第一个商品", ["电子产品"]),
    new Product(9, "这是第9个商品", 9.99, 13.5, "这是第一个商品", ["食物"])
];
app.get('/', function (req, res) {
    res.send("hello Express!!!!");
});
app.get("/api/products", function (req, res) {
    // res.send("接收商品查询请求！")
    var params = req.query;
    var result = products;
    console.log(params);
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) !== -1; });
    }
    console.log(result);
    if (params.price && result.length > 0) {
        result = result.filter(function (p) { return p.price <= parseInt(params.price); });
    }
    //if(params.category !=="-1" && result.length > 0){
    //    result = result.filter( p => p.price <= parseInt(params.price));
    //}
    res.json(result);
});



app.post('/api/products', function (req, res) {
    console.log(req.query);
    console.log(req.body);
    res.json(products);
});
app.get("/api/product/:id", function (req, res) {
    // res.send("接收商品查询请求！")
    res.json(products.find(function (product) { return product.id == req.params.id; }));
    //res.json(products.filter( (product) => product.id == req.params.id) )
});

app.post("/api/imgUpload", multipartMiddleware, function (req, res) {
    //文件
    console.log(req.files);
    const photoData = req.files.uploadPhoto[0];
    //文件路径
    const filePath = photoData.path;
    //读取文件
    fs.readFile(filePath, function (err, data) {
        //取时间戳用来命名
        const timestamp = Date.now();
        //取文件类型用来命名
        var type = photoData.type.split('/')[1];
        type=type==="plain"?type="txt":type;
        //命名文件
        const photo = timestamp + '.' + type;
        //存储路径
        const newPath = path.join(__dirname, '../', 'upload/demo/' + photo);
       // const newPath = path.join('E:/git/angular2-project/src/upload/images/' + photo);
        //写入文件
        console.log(newPath);
        console.log(type);
        fs.writeFile(newPath, data, function (err) {
            //返回状态1表示成功，返回的数据是存储后的文件名
            const reply = {
                status: 1,
                data: {
                    name: photo
                }
            };
            res.end(JSON.stringify(reply));
        })
    });
});


var server = app.listen("8000", "localhost", function () {
    console.log("服务器已启动> http://localhost!");
});
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on("connection", function (webscoket) {
    webscoket.send("这个消息是服务端推送的！！");
    webscoket.on("message", function (message) {
        console.log("接收到消息：" + message);
    });
});
setInterval(function () {
    if (wsServer.clients) {
        wsServer.clients.forEach(function (client) {
            client.send("定时推送");
        });
    }
}, 2000);
//# sourceMappingURL=action.server.js.map