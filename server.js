require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const SECRET_SESSION = process.env.SECRET_SESSION;
const passport = require('./config/ppConfig');
const app = express();
const flash = require('connect-flash');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
// secret is what we give back to user to use on site (session cookie)
app.use(session({
  secret: SECRET_SESSION,
  // save session set to false
  resave: false,
  // if new session with no change, save
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
//   before every route we will attach our current user to res.local
  res.local.alerts = req.flash();
  res.local.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  res.render('index', {alert: req.flash()});
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${port} 🎧`);
});

module.exports = server;
