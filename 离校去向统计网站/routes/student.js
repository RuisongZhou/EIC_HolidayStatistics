'use strict';

let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});
let ContactsLogger = require('../logger').ContactsLogger;
let ContactsDB = require('../models/contacts_db');


router.get('/', function(req, res, next) {
    res.sendfile("student.html");//打开主页面
  });

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

module.exports = router;
