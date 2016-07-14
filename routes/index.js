var models  = require('../models');
var express = require('express');
var passport = require('passport');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
