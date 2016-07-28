/**
 * Created by zz on 16/7/28.
 */

//    <!--引入模块, angular 启动时扫描<html ng-app="shopApp" lang="en">中是否有这个模块-->
var app = angular.module('shopApp',['ngRoute'])
//路由配置

// 测试读取json
// var appRouter = {
//     '/': {
//         templateUrl:'pages/home.html',
//         controller:'HomeCtrl'},
//     '/home':{
//         templateUrl:'pages/home.html',
//         controller:'HomeCtrl'
//     }
// };



app.config(function($routeProvider, $locationProvider) {
    //    $routeProvider路由服务 $locationProvider路径相关服务,控制pass跳转用
    // console.warn('$routeProvider路由服务',$routeProvider,'另外一个',$locationProvider);
    $routeProvider.when('/', {
//        使用哪个模版进行渲染, 和控制器
        templateUrl:'pages/home.html',
        controller:'HomeCtrl'
    }).when('/home',{
        //如果访问home也才用同样的配置
        templateUrl:'pages/home.html',
        controller:'HomeCtrl'
    }).when('/users/reg',{
        //注册
        templateUrl:'pages/users/reg.html',
        controller:'RegCtrl'//控制器也相应改变
    }).when('/users/login',{
        //登录
        templateUrl:'pages/users/login.html',
        controller:'LoginCtrl'
    }).otherwise({
        redirectTo:'/'
    });
});


//app启动后第一个运行的任务,每次刷新也会执行这里
app.run(function ($rootScope,$http,$location) {
    $http({
        url:'/users/validate',
        method:'POST'
    }).success(function (user) {
        $rootScope.isLogin = user;
        $location.path('/home');
    }).error(function (err) {
        console.log("退出错误提示",err);
        $location.path('/users/login');
    })
});

//创建控制器,控制器派生一个控制域$scope, 可以通过这个 $scope给模版中的内容赋值
app.controller('HomeCtrl',function ($scope) {
    $scope.title = 'Node Shop 吃吃';
});

//导航条控制器的声明
app.controller('NavBarCtrl',function ($rootScope,$scope,$http,$location) {
    $scope.title = '导航';
    //退出功能,调用后台
    $scope.logout = function () {
        $http({
            url:'/users/logout',
            method:'GET'
        }).success(function (user) {
            $rootScope.isLogin = null;//服务器返回的user对象返给根控制器
            $location.path('/home');
        }).error(function (err) {
            console.log("错误提示",err);
            $location.path('/users/login')
        })
    };//$scope.logout end

    //判断是否当前页面的方法,用来高亮导航内容,参数是传入目录,用来对比当前目录
    $scope.isActive = function (path) {
//        console.log("当前目录是",$location.path());
        return path == $location.path(); //$location.path()当前目录
    };//$scope.isActive end
});

//注册控制器
//TODO:校验用户名重名
app.controller('RegCtrl',function ($scope, $http,$location) {
    //为了向后台发送数据,须添加http服务, $location是注册成功后的跳转
    $scope.title = '注册';
    //注册表单的保存方法,需要在控制器中
    $scope.save = function () {
//        console.log('保存注册信息');
//        发起存储请求
        $http({
            url:'/users/reg',
            method:'post',
            data:$scope.user
        }).success(function (user) {
//            请求成功回调
            console.log("成功存储回调注册信息:", user);
            $location.path('/users/login');
        }).error(function (err) {
            console.log("错误提示",err);
            $location.path('/users/reg')
        })
    }//$scope.save end
    //判断是否同一个密码
    $scope.isSamePassword = function (userform) {
        var o = userform.password.$viewValue,
            r = userform.repassword.$viewValue;
//        console.log("两个密码:", o, "重复的是" ,r, "结果", o==r);
        return o == r ;
    }
});

//登录控制器  $rootScope为根控制器,要和其他控制器共享
app.controller('LoginCtrl',function ($rootScope,$scope,$http,$location) {
    $scope.title = '登录';
//    console.log("进入登录页面,开始登录:", $scope);
    $scope.login = function () {
        $http({
            url:'/users/login',
            method:'POST',
            data:$scope.user //表单数据,包括用户名和密码
        }).success(function (user) {
//            请求成功回调
            console.log("成功登录:", user);
            $rootScope.isLogin = user;//服务器返回的user对象返给根控制器
            $location.path('/home');
        }).error(function (err) {
            console.log("登录错误提示",err);
//            $location.path('/users/login')
        });
//        return false;//此处为禁用掉form表单提交的动作
    }//$scope.login end
});

