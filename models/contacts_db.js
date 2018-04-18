'use strict';

let ConfigSet = require('../configs/config_set.json')
let Joi = require('joi');
let ContactsLogger = require('../logger').ContactsLogger;
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;
let IsEmpty = require('is-empty');
let ObjectID = require('mongodb').ObjectID;
let fs = require('fs');
let path = './configs/config_set.json';
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
    console.log(params);
    //表单的提交
    if ("name" in params){
        var collection = db.collection("infos");//操作infos集合
        let userinfo = collection.find({"StudentID": params.StudentID}).toArray(function(err,array){
            if (err){
                throw err;
            }else{
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
        console.log('a');
        var collection = db.collection("users");//操作user集合
        let user = {//获取注册信息
            "StudentID": params.StudentID,
            "password": params.password
        }
        let userinfo = collection.find({"StudentID": params.StudentID}).toArray();
        collection.find({"StudentID": params.StudentID}).toArray(function(err,arr){
            if(arr.length==0){
                collection.insert(user);
            }
        });
        console.log(userinfo)
        return userinfo;
    }else if(params.stat == 'login'){//登陆的验证
        console.log('b');
        var collection = db.collection("users");//操作user集合
        let userinfo = collection.find({"StudentID":params.StudentID}).toArray();
        return userinfo;//如果学号已存在，返回已存在的学生注册信息
    }else{
        console.log('c');
        var collection = db.collection("infos");//操作infos集合
        let userinfo = collection.find({"StudentID": params.StudentID}).toArray();
        return userinfo;
    }
    return true;
}


exports.addContactForAdmin = async function (params) {
    let CollectionName = JSON.parse(fs.readFileSync(path, 'utf-8')).COLLECTION_NAME;
    let collection = db.collection(CollectionName);
    let result = await collection.insertOne({
        name: params.name,
        class:params.class,
        grade:params.grade,
        studentID:params.studentID,
        leave_school:params.leave_school,
        leave_reason:params.leave_reason,
        leave_for:params.leave_for,
        leave_time:params.leave_time,
        back_time:params.back_time,
        note:params.note
    });
    return result.ops[0];
}

exports.getContact = async function(params) {
    let CollectionName = JSON.parse(fs.readFileSync(path, 'utf-8')).COLLECTION_NAME;
    let collection = db.collection(CollectionName);
    let result = await collection.find().toArray();
    return result;
};

exports.deleteContact = async function (params) {
    let CollectionName = JSON.parse(fs.readFileSync(path, 'utf-8')).COLLECTION_NAME;
    let collection = db.collection(CollectionName)
    let results =  await collection.deleteOne({
        _id: ObjectID(params._id)
    });
    return results;
}

exports.updateContact = async function (params) {
    let CollectionName = JSON.parse(fs.readFileSync(path, 'utf-8')).COLLECTION_NAME;
    let collection = db.collection(CollectionName)
    let results = await collection.update({
        _id: ObjectID(params._id)
    },{
        _id: ObjectID(params._id),
        name: params.name,
        class:params.class,
        grade:params.grade,
        studentID:params.studentID,
        leave_school:params.leave_school,
        leave_reason:params.leave_reason,
        leave_for:params.leave_for,
        leave_time:params.leave_time,
        back_time:params.back_time,
        note:params.note
    });
    return true;
}

exports.findContact = async function (params) {
    let CollectionName = JSON.parse(fs.readFileSync(path, 'utf-8')).COLLECTION_NAME;
    let collection = db.collection(CollectionName)
    let result = await collection.find({
        name : params.name
    }).toArray();
    return result;
}

exports.DeleteDatabase = async function (params) {
    let collection = db.collection(params);
    let result =  await collection.deleteMany();
    return result;

}
