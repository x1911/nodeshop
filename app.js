/**
 * 后台主入空
 * Created by zz on 16/7/26.
 */

var express = require('express');
var path = require('path');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
//将回话session存入数据库,用户不用重复登录
var MongoStore = require('connect-mongo')(session);
// 连接数据库
var DBDir = 'mongodb://115.29.185.7/shop';
var mongoose = require('mongoose');
mongoose.connect(DBDir);
var bodyParser = require('body-parser'); //解析body,需要npm另外安装
var users = require('./routes/users');//导入路由下的解释

//使用静态文件服务器中间键
app.use(express.static(path.join(__dirname,'app','public')));
// 可以解析body后就能解析json, 所有请求 content-type application/json
app.use(bodyParser.json());
// 解析post在body中传的参数,所有请求 application/x-form-urlencoded
app.use(bodyParser.urlencoded({extended:false }));
//session会话
app.use(session({
    secret:'sdshop',//对回话进行加密
    resave:true, //次数重存
    saveUninitialized: true,//是否保存为初始化,必须要
    cookie:{
        maxAge:60*60*100 //有效期
    },
    store:new MongoStore({
        url:DBDir
    })
}));
// 路由
app.use('/users',users); //访问'/users'目录的时候就跳转到路由users


// 监听端口
app.listen(8080);