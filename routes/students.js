'use strict';

let express = require('express');
let router = express.Router();
let ContactsDB = require('../models/contacts_db');
let fs = require('fs');
var email   = require("emailjs");
var server  = email.server.connect({
    user:    "1468111755@qq.com",      // 发送人账户
    password:"jyeccrelwjkzfifi",       // 授权码
    host:    "smtp.qq.com",            // 邮件主机
    ssl:     true                      // 使用ssl
});
//对post请求处理
router.post('/', async (req, res, next) => {
    //传入新对象数据
    let params = {//接受默认参数为登陆、注册参数
        "StudentID": req.body.StudentID,
        "password": req.body.password,
        "stat": req.body.stat
    };
    
    if ("name" in req.body){
        params = {//若存在name属性则更新为表单参数
        "name": req.body.name,
        'class':req.body.class,
        'grade':req.body.grade,
        'StudentID':req.body.StudentID,
        'leave_school':req.body.leave_school,
        'leave_reason':req.body.leave_reason,
        'leave_for':req.body.leave_for,
        'leave_time':req.body.leave_time,
        'back_time':req.body.back_time,
        'note':req.body.note
    };}
    
    let result = await ContactsDB.addContact(params);
    //根据返回值判断请求类型
    if ('stat' in params){//注册、登陆请求类型
        if (params.stat == "login" && (result.length == 0)){//用户不存在
            res.json("no user");
        }else if (params.stat == "login" && (result[0].password != params.password)){//密码错误
            res.json("login failed");
        }else if (params.stat == "login" && result[0].password == params.password){//登陆成功页面跳转
            var filepath = "index_form.html"
            res.sendfile(filepath);
        }else if (params.stat == "regist" && (result.length == 0)){//注册成功
            res.json('regist success');
        }else{//用户已存在
            res.json('regist failed');
        }
    }else{//表单提交请求类型更新||填写均可
        res.json(true);
    }
});

router.put('/', async (req, res, next) => {
    //传入新对象数据
    console.log(req.body.StudentID);
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