var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.sendfile("../public/admin.html");//打开主页面
});

module.exports = router;