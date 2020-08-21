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
    where: {username: req.body.username},
    defaults: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      bio: req.body.bio
    }
  })
  .then(([user, created]) => {
    if (created) {
      console.log(`a new user named ${user.name}(${user.username}) was created`);
      // flash message
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'account created and logging in'
      })(req, res);
      // before passport authenticate
    } else {
      console.log(`this username already in use, please choose different username`);
      console.log(`error with user signup`, error);
      req.flash('error', 'username already in use');
      res.redirect('/auth/signup');
    }
  })
  .catch(error => {
    req.flash('error', `error with sign up ${error}`);
    res.redirect('/auth/signup');
  });
});


router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile/view',
  failureRedirect: '/auth/login',
  successFlash: 'welcome back',
  failureFlash: 'either password or username incorrect'
}));


router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success', 'see you soon, logging out');
  res.redirect('/');
});

module.exports = router;
