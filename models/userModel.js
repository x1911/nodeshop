/**
 * 用户数据
 * Created by zz on 16/7/27.
 */
var mongoose = require('mongoose');
//对外暴露数据类型,名字叫'UserModel'
module.exports = mongoose.model('UserModel',new mongoose.Schema({//Schema定义类型
    username:String,
    password:String,
    useremail:String,
    avatar:String
}));