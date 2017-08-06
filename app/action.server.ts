/**
 * Created by Administrator on 2017/8/5.
 */

import * as express from 'express';
import * as bodyParser  from 'body-parser';
import { Server } from 'ws';

//var bodyParser = require('body-parser');

const app = express();

export class Product{
    constructor(
        public id:number,
        public title:string,
        public price:number,
        public reting:number,
        public desc:string,
        public categories:Array<string>
    ){}
}

const products:Product[]=[
    new Product(1,"这是第1个商品",1.99,3.5,"这是第一个商品",["图书"]),
    new Product(2,"这是第2个商品",2.99,1.5,"这是第一个商品",["图书"]),
    new Product(3,"这是第3个商品",3.99,4.5,"这是第一个商品",["食物"]),
    new Product(4,"这是第4个商品",4.99,5.5,"这是第一个商品",["办公","图书"]),
    new Product(5,"这是第5个商品",5.99,3.5,"这是第一个商品",["衣服"]),
    new Product(6,"这是第6个商品",6.99,6.5,"这是第一个商品",["电子产品","硬件设备"]),
    new Product(7,"这是第7个商品",7.99,8.5,"这是第一个商品",["电子产品"]),
    new Product(8,"这是第8个商品",8.99,9.5,"这是第一个商品",["电子产品"]),
    new Product(9,"这是第9个商品",9.99,13.5,"这是第一个商品",["食物"])
];

app.get('/',(req,res) => {
    res.send("hello Express!!!!");
});

app.get("/api/products",(req,res) => {
   // res.send("接收商品查询请求！")
    let params = req.query;

    let result = products;
    console.log(params);
    if(params.title){
        result = result.filter( p => p.title.indexOf(params.title) !== -1);
    }
    console.log(result);
    if(params.price && result.length > 0){
        result = result.filter( p => p.price <= parseInt(params.price));
    }

    //if(params.category !=="-1" && result.length > 0){
    //    result = result.filter( p => p.price <= parseInt(params.price));
    //}
    res.json(result)
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/products', function(req, res) {
    console.log(req.query);
    console.log(req.body);
    res.json(products)
});

app.get("/api/product/:id",(req,res) => {
    // res.send("接收商品查询请求！")
    res.json(products.find( (product) => product.id == req.params.id) )
    //res.json(products.filter( (product) => product.id == req.params.id) )
});

const server=app.listen("8000","localhost",()=>{
    console.log("服务器已启动> http://localhost!")
});


const wsServer = new Server({port:8085});

wsServer.on("connection",webscoket=>{
    webscoket.send("这个消息是服务端推送的！！")
    webscoket.on("message",message=>{
        console.log("接收到消息："+message)
    })
});

setInterval(()=>{
    if(wsServer.clients){
        wsServer.clients.forEach(client=>{
            client.send("定时推送")
        })
    }
},2000)
