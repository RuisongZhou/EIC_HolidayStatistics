'use strict';

let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let ContactsDB = require('../models/contacts_db');
let urlencodedParser = bodyParser.urlencoded({extended: false});
let ContactsLogger = require('../logger').ContactsLogger;
let fs = require('fs'); 

// 添加一个数据库并切换到该数据库
router.post('/', function(req, res, next){
    let params = {
        DATABASE_URL: "mongodb://127.0.0.1:27001",
	    DATABASE_NAME: "info",
        COLLECTION_NAME: req.body.DatabaseName,
        creator:req.body.creator,
        note :req.body.note,
        time : req.body.time
    }
    let NewDataStr = JSON.stringify(params);
    
    let file = './configs/DatabaseAll.json';
    fs.readFile(file , 'utf-8' ,function(err,data){
        if(err) {
            res.sendStatus(500);
            console.log(err);
        } else {
            let DatabaseNameAll = JSON.parse(data);
           // console.log(DatabaseNameAll)
            // var WriteToFile = {all:[]};
            // for (var each in DatabaseNameAll){
            //     WriteToFile.all.push(JSON.stringify(each));
            // }
            let AllName = DatabaseNameAll.all;
            AllName.push(NewDataStr);
            fs.writeFile(file, JSON.stringify(DatabaseNameAll), function(err) {
                    if (err){
                        res.sendStatus(500);
                        console.error(err);
                    } else {
                        try{
                            let usefilepath = './configs/config_set.json';
                            fs.writeFile(usefilepath, NewDataStr, function(err){
                                if(err) {
                                    res.sendStatus(500);
                                    console.log(err);
                                } else {
                                    res.sendStatus(200);
                                    console.log("add success!");
                                }

                            })
                        }  catch(err) {
                            ContactsLogger.error(`add database error => ${err.stack}`);
                            next(err);
                        }
                    }
                    
                })
        }
    });

});


//更改当前数据库
router.post('/change', async (req, res, next) => {
    let UseDataBase = {
        DATABASE_URL: "mongodb://127.0.0.1:27001",
	    DATABASE_NAME: "info",
        COLLECTION_NAME: req.body.COLLECTION_NAME,
        note :req.body.note,
        creator:req.body.creator,
        time : req.body.time
    }
    //console.log(req.body);
    let usefilepath = './configs/config_set.json';
    fs.writeFile(usefilepath, JSON.stringify(UseDataBase), function(err){
        if(err) {
            res.sendStatus(500)
            console.log(err);
        } else {
            res.sendStatus(200);
            console.log("change success!");
        }

    })
})

// 读取所有的数据库名称
router.get('/all', async (req, res, next) => {
    let  file = './configs/DatabaseAll.json';
    fs.readFile(file ,'utf-8', function(err, data) {
        if (err) {
            // 读取失败，返回500（服务器错误）
            res.sendStatus(500);
            console.error(err);
        } else {
            // 读取成功，将JSON字符串转为JSON对象并返回
            let DatabaseNameAll = JSON.parse(data);
            //var name = [];
            // for (var each in data){
            //     name.push(JSON.stringify(data[each]));
            // }
            // console.log(settingData);
            res.status(200).json(DatabaseNameAll);
        }
    });
});

//读取目前数据库
router.get('/', async (req, res, next) => {
    let  file = './configs/config_set.json';
    fs.readFile(file , 'utf-8', function(err, data) {
        if (err) {
            // 读取失败，返回500（服务器错误）
            res.sendStatus(500);
            console.error(err);
        } else {
            // 读取成功，将JSON字符串转为JSON对象并返回
            let DatabaseNameAll = JSON.parse(data);
            //var name = [];
            // for (var each in data){
            //     name.push(JSON.stringify(data[each]));
            // }
            // console.log(settingData);
            res.status(200).json(DatabaseNameAll);
        }
    });
});

//删除一个数据库
router.delete('/', async (req, res, next) => {
    let deletename = req.body.DeleteDatabaseName;
    let deletepath = './configs/DatabaseAll.json';
    fs.readFile(deletepath , 'utf-8', function(err, data) {
        if (err) {
            // 读取失败，返回500（服务器错误）
            res.sendStatus(500);
            console.error(err);
        } else {
            // 读取成功，将JSON字符串转为JSON对象并返回
            // let Database = JSON.parse(data);
            let DatabaseNameAll = JSON.parse(data).all;
            let result =  DatabaseNameAll.filter((element, index) => {
                if (JSON.parse(element).COLLECTION_NAME !== deletename)
                    return element;
            })
           // console.log(result);
            let NewData = {
                all : result
            }
            const del_stats = ContactsDB.DeleteDatabase(deletename)
            fs.writeFile(deletepath, JSON.stringify(NewData));
            check();
        }
    });
    function check() {
            let nowpath = './configs/config_set.json';
            fs.readFile(nowpath,'utf-8',function(err, data){
                    if (err) {
                        // 读取失败，返回500（服务器错误）
                        res.sendStatus(500);
                        console.error(err);
                    } else {
                        let NowDataBase = JSON.parse(data);
                        if( NowDataBase.COLLECTION_NAME === deletename ){
                            let Config = {
                                DATABASE_URL: "mongodb://127.0.0.1:27001",
                                DATABASE_NAME :"info",
                                COLLECTION_NAME :"infos",
                                creator:"system",
                                note :"create by system,please don't delete",
                                time :""
                            }
                            fs.writeFile(nowpath, JSON.stringify(Config) ,function(err) {
                                if (err) {
                                    res.sendStatus(500);
                                    console.error(err);
                                } else {
                                    res.status(200).send('Delete successfully');
                                }
                            })
                        } else {
                            res.status(200).send('Delete successfully');
                        }
                    }
            })               
    }
})

module.exports = router;