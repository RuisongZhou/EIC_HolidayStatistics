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
        var collection = db.collection("users");
        var userinfo = collection.find({"StudentID": params.StudentID}).toArray();
        if (userinfo.length!=0){
            collection.update({"StudentID": params.StudentID},params);
        }
        return userinfo;
}

