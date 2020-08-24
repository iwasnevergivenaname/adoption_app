require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const db = require('./models');
const SECRET_SESSION = process.env.SECRET_SESSION;
const API_KEY = process.env.API_KEY;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const passport = require('./config/ppConfig');
const axios = require('axios');
const methodOverride = require('method-override');
const app = express();
const flash = require('connect-flash');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({extended: false}));
app.use('/public', express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
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
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});


app.get('/', (req, res) => {
  console.log(res.locals.alerts);
  res.render('index', {alerts: res.locals.alerts});
});

app.get('/search', (req, res) => {
  res.render('search');
});


app.use('/auth', require('./routes/auth'));
app.use('/animals', require('./routes/animals'));
app.use('/organizations', require('./routes/orgs'));
app.use('/profile', require('./routes/profile'));

const port = process.env.PORT || 4200;
const server = app.listen(port, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${port} 🎧`);
});

app.get('*', (req, res) => {
  res.render('error');
});


module.exports = server;
