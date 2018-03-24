'use strict';

let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let ContactsDB = require('../models/contacts_db');
let urlencodedParser = bodyParser.urlencoded({extended: false});
let ContactsLogger = require('../logger').ContactsLogger;
let fs = require('fs'); 

// 添加一个数据库并切换到该数据库
router.post('/', async (req, res, next) => {
    let name = req.body.DatabaseName;
    let params = {
        DATABASE_URL: "mongodb://127.0.0.1:27001",
	    DATABASE_NAME: name,
	    COLLECTION_NAME: name
    }
    let NewDataStr = JSON.stringify(params);
    let file = './configs/DatabaseAll.json';
    fs.writeFile(file, NewDataStr, function(err) {
        if (err){
            res.sendStatus(500);
            console.error(err);
        } else {
            try{
                let result = await ContactsDB.AddDatabase(params);
                res.status(200);
            }  catch(err) {
                ContactsLogger.error(`add database error => ${err.stack}`);
                next(err);
            }
        }
        
    })

});

// 读取所有的数据库名称
router.get('/', async (req, res, next) => {
    let  file = './configs/DatabaseAll.json';
    fs.readFile(file , 'ascii', function(err, data) {
        if (err) {
            // 读取失败，返回500（服务器错误）
            res.sendStatus(500);
            console.error(err);
        } else {
            // 读取成功，将JSON字符串转为JSON对象并返回
            let DatabaseNameAll = JSON.parse(data);
            var name = [];
            for (var each in DatabaseNameAll){
                name.append(each.DATABASE_NAME);
            }
            // console.log(settingData);
            res.status(200).json(DatabaseNameAll);
        }
    });
});

//删除一个数据库
router.delete('/', async (req, res, next) => {
    let deletename = req.body.DeleteDatabaseName;
    let deletepath = './configs/DatabaseAll.json';
    fs.readFile(deletepath , 'ascii', function(err, data) {
        if (err) {
            // 读取失败，返回500（服务器错误）
            res.sendStatus(500);
            console.error(err);
        } else {
            // 读取成功，将JSON字符串转为JSON对象并返回
            let DatabaseNameAll = JSON.parse(data);
            for (var each in DatabaseNameAll){
                if ( deletename === each.DATABASE_NAME){
                    delete each;
                    try{
                        let result = await ContactsDB.DeleteDatabase(deletename);
                        res.json(result);
                    }  catch(err) {
                        ContactsLogger.error(`delete database error => ${err.stack}`);
                        next(err);
                    }
                }
            }
            let NewDataStr = JSON.stringify(DatabaseNameAll);
            fs.writeFile(deletepath, NewDataStr) 
            res.status(200);               
        }
    });
})

module.exports = router;