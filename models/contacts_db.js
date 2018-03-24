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
    if ("name" in params){
        var collection = db.collection("infos");
        let userinfo = collection.find({"StudentID": params.StudentID}).toArray(function(err,array){
            if (err){
                throw err;
            }else{
                console.log(array)
                if (array.length!=0){
                    collection.update({"StudentID":params.StudentID},params,{'multi':false})
                }else{
                    collection.insert(params)
                }
            }
        });
        console.log('Done');
        return [];
    }else if(params.stat == 'regist'){
        var collection = db.collection("users");
        let user = {
            "StudentID": params.StudentID,
            "password": params.password
        }
        let userinfo = collection.find({"StudentID": params.StudentID}).toArray();
        collection.insert(user);
        console.log('Done');
        return userinfo;
    }else{
        console.log(params);
        var collection = db.collection("users");
        let userinfo = collection.find({"StudentID":params.StudentID}).toArray();
        return userinfo;
    }
    return true;
}