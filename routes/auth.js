const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/signup', (req, res) => {
  console.log(req.body);
  db.user.findOrCreate({
    where: {email: req.body.email},
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  })
  .then(([user, created]) => {
    if (created) {
      console.log(`a new user named ${user.name} was created`);
      // flash message
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'account created and logging in'
      })(req, res);
      // before passport authenticate
    } else {
      console.log(`this email already in use, please use different email or log in`);
      console.log(`error with user signup`, error);
      req.flash('error', 'email already in use')
      res.redirect('/auth/signup');
    }
  })
  .catch(error => {
    req.flash('error', `error with sign up ${error}`)
    res.redirect('/auth/signup');
  });
});


router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: 'welcome back',
  failureFlash: 'either password or email incorrect'
}));


router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success', 'see you soon, logging out');
  res.redirect('/');
});

module.exports = router;
