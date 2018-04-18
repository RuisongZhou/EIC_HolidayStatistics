//import resolve from 'url';

'use strict';

let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');


router.post('/', async (req, res, next) => {
    let data = req.body;
    let user = {
      id: 1,
      username: 'EIC',
      password: 'EIC',
      avatar: './static/img/EIC.png',
      name: '管理员'
    }
    if (data.username === 'EIC' && data.password === 'EIC'){
        res.status(200).json({code: 200, msg: '请求成功', user });
    } else {
      res.status(200).json({code: 500, msg: '账号或密码错误'});
    }
})

module.exports = router;