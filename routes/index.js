var models  = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  models.Injury.findAll().then(function(injuries) {
    res.json(injuries);
  });
});

module.exports = router;
