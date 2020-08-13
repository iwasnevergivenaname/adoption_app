const localStrategy = require('passport-local').Strategy;
const db = require('../models');

// passport serializes information to make login easier

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

// passport deserialized user takes id and looks up in database
passport.deserializeUser((id, cb) => {
  cb(null, id)
  .catch(cb());
});

// pass localStrategy into passport
passport.use(new localStrategy({
    // looks for these
    usernameField: 'email',
    passwordField: 'password'
  // pass in and search db
  }, (email, password, cb) => {
    db.user.findOne({
      where: {email}
    })
    // return a user
    .then(user => {
      if (!user || !user.validPassword(password)) {
        cb(null, false);
      } else {
        cb(null, user);
      }
    })
    .catch(cb());
  }
));