require('dotenv').config();
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const db = require('../models');

//passport serrialize's info to make it easier to login
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

// deserializeUser takes the id and looks it up in db
passport.deserializeUser((id, cb) => {

  db.user.findByPk(id)
  .then(user => {
    cb(null, user);
  }).catch(cb);
});

passport.use(new localStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, (username, password, cb) => {
  db.user.findOne({
    where: {username}
  })
  .then(user => {
    if (!user || !user.validPassword(password)) {
      cb(null, false);
    } else {
      cb(null, user);
    }
  })
  .catch(err => {
    cb(err, null);
  });
}));

module.exports = passport;