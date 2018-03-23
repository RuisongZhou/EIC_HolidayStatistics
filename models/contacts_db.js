'use strict';

let ConfigSet = require('../configs/config_set.json')
let Joi = require('joi');
let ContactsLogger = require('../logger').ContactsLogger;
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;
let IsEmpty = require('is-empty');

//链接数据库
let db;
MongoClient.connect(ConfigSet.DATABASE_URL, (err, client) => {
    if (err) {
        ContactsLogger.error(`database error => ${err.stack}`);
        throw err;
    } else {
        db = client.db(ConfigSet.DATABASE_NAME);
    }
})

exports.addContact = async function (params) {
    //表单的提交
    if ("name" in params){
        var collection = db.collection("infos");//操作infos集合
        let userinfo = collection.find({"StudentID": params.StudentID}).toArray(function(err,array){
            if (err){
                throw err;
            }else{
                console.log(array)
                if (array.length!=0){//如果表单信息已存在，更新数据
                    collection.update({"StudentID":params.StudentID},params,{'multi':false})
                }else{//如果不存在，存入数据
                    collection.insert(params)
                }
            }
        });
        console.log('Done');
        return [];
    //注册的提交
    }else if(params.stat == 'regist'){
        var collection = db.collection("users");//操作user集合
        let user = {//获取注册信息
            "StudentID": params.StudentID,
            "password": params.password
        }
        let userinfo = collection.find({"StudentID": params.StudentID}).toArray(function (err,arr){
            if (err){
                throw err;
            }else{//如果学生信息不存在，存入数据库
                if (arr.length==0){
                    collection.insert(user);
                }
            }
        });
        return userinfo;
    }else{//登陆的验证
        var collection = db.collection("users");//操作user集合
        let userinfo = collection.find({"StudentID":params.StudentID}).toArray();
        return userinfo;//如果学号已存在，返回已存在的学生注册信息
    }
    return true;
}