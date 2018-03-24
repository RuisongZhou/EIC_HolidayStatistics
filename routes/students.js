'use strict';

let express = require('express');
let router = express.Router();
let ContactsDB = require('../models/contacts_db');
let fs = require('fs');
var email   = require("emailjs");
var server  = email.server.connect({
    user:    "1468111755@qq.com",      // 你的QQ用户
    password:"jyeccrelwjkzfifi",           // 注意，不是QQ密码，而是刚才生成的授权码
    host:    "smtp.qq.com",         // 主机，不改
    ssl:     true                   // 使用ssl
});
//对post请求处理
router.post('/', async (req, res, next) => {
    //传入新对象数据
    let params = {
        "StudentID": req.body.StudentID,
        "password": req.body.password,
        "stat": req.body.stat
    };
    console.log(params)
    
    if ("name" in req.body){
        params = {
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
    if ('stat' in params){
        if (params.stat == "login" && (result.length == 0)){
            res.json("no user");
        }else if (params.stat == "login" && (result[0].password != params.password)){
            res.json("login failed");
        }else if (params.stat == "login" && result[0].password == params.password){
            var filepath = "index_form.html"
            res.sendfile(filepath);
        }else if (params.stat == "regist" && (result.length == 0)){
            res.json('regist success');
        }else{
            res.json('regist failed');
        }
    }else if(result.length != 0){
        res.json("complete failed");
    }else{
        res.json("complete success");
    }
});

router.put('/', async (req, res, next) => {
    //传入新对象数据
    console.log(req.body.StudentID);
    let random = String(Math.floor(90000*Math.random()+10000))
    server.send({
        text:    "邮箱验证码为："+ random,       //邮件内容
        from:    "1468111755@qq.com",        //谁发送的
        to:      String(req.body.StudentID)+'@hust.edu.cn',       //发送给谁的
        subject: "邮件主题",          //邮件主题
    }, function(err, message) {
        //回调函数
        console.log(err || message);
    });
    res.json(random);
});


module.exports = router;