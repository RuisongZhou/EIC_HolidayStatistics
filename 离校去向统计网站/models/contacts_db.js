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
    //确定集合infos
    let collection = db.collection(ConfigSet.COLLECTION_NAME);
    let result = collection.insert(params);
    return result.ops[0];
}

exports.getContact = async function(params) {
    let collection = db.collection(ConfigSet.COLLECTION_NAME);
    let result = await collection.find().toArray();
    return result;
};

exports.deleteContact = async function (params) {
    let collection = db.collection(ConfigSet.COLLECTION_NAME);
    let results = collection.deleteOne({
        _id: ObjectID(params._id)
    });
    return result;
}

exports.updateContact = async function (params) {
    let collection = db.collection(ConfigSet.COLLECTION_NAME);
    let results = await collection.update({
        _id: ObjectID(params._id)
    },{
        _id: ObjectID(params._id),
        name: req.body.name,
        class:req.body.class,
        grade:req.body.grade,
        studentID:req.body._ID,
        leave_school:req.body.leave_school,
        leave_reason:req.body.leave_reason,
        leave_for:req.body.leave_for,
        leave_time:req.body.leave_time,
        back_time:req.body.back_time,
        note:req.body.note
    });
    return true;
}

exports.findContact = async function (params) {
    let collection = db.collection(ConfigSet.COLLECTION_NAME);
    if (collection.find({
        studentID = params.studentID
    })){
        return true;
    } else {
        return false;
    } 
}


exports.AddDatabase = async function (params) {
    let name = params.DATABASE_NAME;
    var url = 'mongodb://127.0.0.1:27001/' + name;
    MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    else{
        console.log('数据库已创建');
        let data = JSON.stringify(params);
        let result = fs.writeFile(file, data);
        return result;
    }
   
    });
};

exports.DeleteDatabase = async function (params) {
    let name = deletename;
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://127.0.0.1:27001/";
 
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("info");
    dbo.collection(name).drop(function(err, delOK) {  // 执行成功 delOK 返回 true，否则返回 false
        if (err) throw err;
        if (delOK) console.log("集合已删除");
        db.close();
    });
    let data = {
        DATABASE_URL: "mongodb://127.0.0.1:27001",
        DATABASE_NAME: "info",
        COLLECTION_NAME: "infos"
    }
    let dataStr = JSON.stringify(data);
    let result = fs.writeFile(file, dataStr);
    return result;
});
}
