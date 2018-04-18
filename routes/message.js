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
        class:req.body.Class,
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
        let result = await ContactsDB.addContactForAdmin(params);
        ContactsLogger.info(`add contact result => ${JSON.stringify(result, null, 2)}`);
        res.json(result);
    } catch(err) {
        ContactsLogger.error(`add contact error => ${err.stack}`);
        next(err);
    }
});


router.post('/find', async (req, res, next) => {
    //查找数据
	let params = {
        name: req.body.name,
    };
    try {     
        let result = await ContactsDB.findContact(params);
        ContactsLogger.info(`find contact result => ${JSON.stringify(result, null, 2)}`);
        res.json(result);
    } catch(err) {
        ContactsLogger.error(`find contact error => ${err.stack}`);
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    let params = {
    };
    try {
        let result = await ContactsDB.getContact(params);
        ContactsLogger.info(`get contact result => ${JSON.stringify(result, null, 2)}`);
        res.status(200).json({users:result});
    } catch(err) {
        ContactsLogger.error(`get contact error => ${err.stack}`);
        next(err);
    }
});

router.post('/page', async (req, res, next) => {
    let data = {
        page : req.body.page,
        name : req.body.name
    }
    let page = data.page;
    let name = data.name;
    try {   
                let AllUsers = await ContactsDB.getContact({});
                let Users = AllUsers.filter(user => {
                    if (name && user.name.indexOf(name) == -1) return false;
                    return true;
                  });
                            let total = Users.length;
                            let result = Users.filter((element ,index) => index < 20 * parseInt(page, 10) && index >= 20 * (parseInt(page, 10) - 1));
                            let PageResult = {
                                total: total,
                                users: result
                            }
                            res.status(200).json(PageResult);
        
    } catch(err) {
        ContactsLogger.error(`get contact error => ${err.stack}`);
        next(err);
    }
});

router.delete('/', async (req, res, next) => {
    let params = {
             _id : req.body._id
        }
        console.log(req.body);
    try {
        let result = await ContactsDB.deleteContact(params);
        ContactsLogger.info(`delete contact result => ${JSON.stringify(result, null, 2)}`);
        res.send('delete success');
    } catch(err) {
        ContactsLogger.error(`delete contact error => ${err.stack}`);
        next(err);
    }
});


router.delete('/batchremove' , async (req, res, next) => {
    let params = {
        ids : req.body.ids
   }
   console.log(req.body);
   params.ids = params.ids.split(',');
   //console.log(params.ids);

   try {
       function ToDelete()
       {
            params.ids.filter(element => {
            ContactsDB.deleteContact({ _id : element }); 
        })
            Tores();
       }
       function Tores()
       {
        res.status(200).send('delete success');           
       }
       ToDelete()
   } catch (err) {
    ContactsLogger.error(`delete contact error => ${err.stack}`);
    next(err);   
   }
});


router.put('/', urlencodedParser, async (req, res, next) => {
    let params = {
        _id: req.body._id,
        name: req.body.name,
        class:req.body.Class,
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