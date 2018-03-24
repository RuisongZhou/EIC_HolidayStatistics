'use strict';

let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let ContactsDB = require('../models/contacts_db');
let urlencodedParser = bodyParser.urlencoded({extended: false});
let ContactsLogger = require('../logger').ContactsLogger;

//对post请求处理
router.post('/', async (req, res, next) => {
    //传入新对象数据
	let params = {
        name: req.body.name,
        class:req.body.class,
        grade:req.body.grade,
        studentID:req.body.studentID,
        leave_school:req.body.leave_school,
        leave_reason:req.body.leave_reason,
        leave_for:req.body.leave_for,
        leave_time:req.body.leave_time,
        back_time:req.body.back_time,
        note:req.body.note
    };
    try {
        let jugdge = await ContactsDB.findContact(params);
        if (jugdge == true){
            let result = await ContactsDB.addContact(params);
        } else {
            let result = await ContactsDB.updateContact(params);
        }
        ContactsLogger.info(`add contact result => ${JSON.stringify(result, null, 2)}`);
        res.json(result);
    } catch(err) {
        ContactsLogger.error(`add contact error => ${err.stack}`);
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    let params = {};
    try {
        let result = await ContactsDB.getContact(params);
        ContactsLogger.info(`get contact result => ${JSON.stringify(result, null, 2)}`);
        res.json(result);
    } catch(err) {
        ContactsLogger.error(`get contact error => ${err.stack}`);
        next(err);
    }
})

router.delete('/', async (req, res, next) => {
    let params = {
            studentID : req.params.studentID
        }
    try {
        let result = await ContactsDB.deleteContact(params);
        ContactsLogger.info(`delete contact result => ${JSON.stringify(result, null, 2)}`);
        res.json(result);
    } catch(err) {
        ContactsLogger.error(`delete contact error => ${err.stack}`);
        next(err);
    }
});

router.put('/', urlencodedParser, async (req, res, next) => {
    let params = {
        name: req.body.name,
        class:req.body.class,
        grade:req.body.grade,
        studentID:req.body.studentID,
        leave_school:req.body.leave_school,
        leave_reason:req.body.leave_reason,
        leave_for:req.body.leave_for,
        leave_time:req.body.leave_time,
        back_time:req.body.back_time,
        note:req.body.note
    };
    try {
        let result = await ContactsDB.updateContact(params);
        ContactsLogger.info(`update contact result => ${JSON.stringify(result, null, 2)}`);
        res.json(result);
    } catch(err) {
        ContactsLogger.error(`update contact error => ${err.stack}`);
        next(err);
    }
});

module.exports = router;