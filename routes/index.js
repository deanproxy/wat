var models  = require('../models');
var express = require('express');
var passport = require('passport');
var auth = require('./auth-middleware');
var router = express.Router();


/* GET home page. */
router.get('/', auth.isLoggedIn, function(req, res, next) {
  models.Injury.findAll().then(function(injuries) {
    res.json(injuries);
  });
});

router.get('/login', function(req, res) {
  res.render('login', {
    user: req.user
  });
});

router.get('/auth/google',
  passport.authenticate('google', {scope: ['email profile']}));

router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
