'use strict';

let express = require('express');
let router = express.Router();
let REContactsDB = require('../models/recontacts_db');
let fs = require('fs');
var email   = require("emailjs");
var server  = email.server.connect({
    user:    "1468111755@qq.com",      // 发送人账户
    password:"xjcwpbarzhklbaff",       // 授权码
    host:    "smtp.qq.com",            // 邮件主机
    ssl:     true                      // 使用ssl
});
//对post请求处理
router.post('/', async (req, res, next) => {
    //传入新对象数据
    let params = {//接受默认参数为登陆、注册参数
        "StudentID": req.body.StudentID,
    };
    if ("password" in req.body){
        params = {//接受默认参数为登陆、注册参数
            "StudentID": req.body.StudentID,
            "password": req.body.password
        };
    }
    let result = await REContactsDB.addContact(params);
    //根据返回值判断请求类型
    if (result.length == 0){
        res.json("no user");
    }else{
        res.json("done");
    }
});

router.put('/', async (req, res, next) => {
    //传入新对象数据
    let random = String(Math.floor(90000*Math.random()+10000))     //生成随机码
    server.send({
        text:    "邮箱验证码为："+ random,                          //邮件内容
        from:    "1468111755@qq.com",                              //发件人
        to:      String(req.body.StudentID)+'@hust.edu.cn',        //目标邮箱
        subject: "邮件主题",                                        //邮件主题
    }, function(err, message) {//回调函数
        console.log(err || message);
    });
    res.json(random);
});
module.exports = router;
