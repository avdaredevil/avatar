var express = require('express');
var router = express.Router();
var path = require('path');
//==Routes========================================================================|
router.get('/', function(req, res) {res.render("index")});
module.exports = router;
