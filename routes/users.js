/**
 * users路由
 * Created by zz on 16/7/27.
 */

var express = require('express');
var router = express.Router(); //生成路由实例
var UserModel = require('../models/index.js').UserModel;//导入模型
var crypto = require('crypto');

// 配合前面传过来的/users路径
router.post('/reg', function (req, res) {
    //接受post请求,用中间键接受参数,app.js处理过bodyParser后req就有了body属性
    var user = req.body; //这里的body就是注册save()函数中 data:$scope.user发送过来的对象
    var md5Email = encrypt(user.useremail);//加密email
    user.password = encrypt(user.password);
// console.log("post发送的内容",user);
    /**
    var avatar = "https://secure.gravatar.com/avatar/"+md5Email+"?s=48";
    //新建对象
    new UserModel({
        username:user.username,
        password:user.password,
        email:user.useremail,
        avatar:avatar
    })
     **/
    user.avatar = "https://secure.gravatar.com/avatar/"+md5Email+"?s=48";
    new UserModel(user).save(function (err, saveData) {
        // console.error("保存数据的信息:",saveData);
        if (err){
            // 如果出错则返回500和一个json,包含错误信息
            res.status(500).json({msg:err});
        }else{
            res.json(saveData);
        }
    }); //直接模型存储到数据库
});

// 登录路由
router.post('/login', function (req, res) {
    var user = req.body;
    // 静态方法匹配用户数据
    UserModel.findOne({username:user.username, password:encrypt(user.password)}, function (err, loginData) {
        if (err){
            // 如果出错则返回500和一个json,包含错误信息
            res.status(500).json({msg:err});
        }else{
            //登录后保存session到数据库
            req.session.user = loginData;
            res.json(loginData);
        }
    });
});

//退出路由
router.get('/logout', function (req, res) {
    req.session.user = null; //会自动清除数据库中的值
    res.status(200).json({msg:'logout success'});
});
//判断是否登录
router.post('/validate', function (req, res) {
    var user = req.session.user; //读取数据库中的值
    if (user && user._id){
        res.status(200).json(user)
    }else{
        res.status(401).json({msg:'用户未登录'})
    }

});

module.exports = router; //导出路由

// 加密md5
function encrypt(str){
    //添加算法,往算法中加字符串,然后进行输出
    return crypto.createHash('md5').update(str).digest('hex');
}