require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const SECRET_SESSION = process.env.SECRET_SESSION;
const API_KEY = process.env.API_KEY;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const passport = require('./config/ppConfig');
const axios = require('axios');
const app = express();
const flash = require('connect-flash');
// const request = require('request');

//require authorization of middleware
const isLoggedIn = require('./middleware/isLoggedIn');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({extended: false}));
app.use('/static', express.static(__dirname + '/public'));
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
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/animals/search', (req, res) => {
  // let d = `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${CLIENT_SECRET}`;
  // axios.post('https://api.petfinder.com/v2/oauth2/token', d)
  // .then(accessToken => {
  //   const H =
  //     "Bearer " + accessToken.data.access_token;
  //   const options = {method: 'GET', headers: {'Authorization': H}, url: "https://api.petfinder.com/v2/animals"};
  //   axios(options)
  //   .then(response => {
  //     let animalResults = response.data.animals;
  res.render('animals/search'
    // , {animalResults}
  );
});
// .catch(error => {
//   console.log(`error with 2nd api call ${error}`);
// });
// })
// .catch(error => {
//   console.log(`error with 1st api call ${error}`);
// });
// })
// ;

app.get("/show", (req, res) => {
  // qs means query string
  let qs = {
    params: {
      s: req.query.animalSearch,
    },
  };
  console.log(qs.params.s);
  let d = `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${CLIENT_SECRET}`;
  axios.post('https://api.petfinder.com/v2/oauth2/token', d)
  .then(accessToken => {
    const H =
      "Bearer " + accessToken.data.access_token;
    const options = {
      method: 'GET',
      headers: {'Authorization': H},
      url: "https://api.petfinder.com/v2/animals?type=" + qs.params.s + "&page=4"
    };
    axios(options)
    // .get("https://api.petfinder.com/v2/animals", qs)
    .then((response) => {
      let searchResults = response.data.animals;
      console.log(searchResults);
      // console.log(searchResults.primary_photo_cropped);
      res.render("animals/show", {searchResults});
    })
    .catch((err) => {
      console.log(err);
    });
  });
});

app.get('/details/:id', (req, res) => {
  let qs = {
    params: {
      i: req.params.id,
    },
  };
  let d = `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${CLIENT_SECRET}`;
  axios.post('https://api.petfinder.com/v2/oauth2/token', d)
  .then(accessToken => {
    const H =
      "Bearer " + accessToken.data.access_token;
    const options = {
      method: 'GET',
      headers: {'Authorization': H},
      url: "https://api.petfinder.com/v2/animals/" + qs.params.i
    }; // 48815885
    console.log("https://api.petfinder.com/v2/animals/" + qs.params.i);
    axios(options)
    .then((response) => {
      console.log(response.data);
      let animalDetails = response.data.animal;
      console.log(animalDetails.primary_photo_cropped.full);
      res.render("details", {animalDetails});
    })
    .catch((err) => {
      console.log(err);
    });
  });
});


//
//   res.render('animals/details');
// });

// https://api.petfinder.com/v2/animals?type=dog&page=2
// let qs = {
//   params: {
//     s: req.query.animalSearch
//   },
// };
// console.log(qs.params.s);

app.get('/', (req, res) => {
  console.log(res.locals.alerts);
  res.render('index', {alerts: res.locals.alerts});
});

//
// app.get("/results", (req, res) => {
//   // qs means query string
//   let qs = {
//     params: {
//       s: req.query.titleSearch,
//       apikey: API_KEY,
//     },
//   };
//   axios
//   .get("http://www.omdbapi.com", qs)
//   .then((response) => {
//     console.log(response.data);
//     let searchResults = response.data.Search;
//     res.render("results", { searchResults });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// });
//
// app.get("/movies/:id", (req, res) => {
//   let qs = {
//     params: {
//       i: req.params.id,
//       apikey: API_KEY,
//     },
//   };
//   axios
//   .get("http://www.omdbapi.com", qs)
//   .then((response) => {
//     let movieDetails = response.data;
//     res.render("detail", { movieDetails });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// });

// app.get('/show', (req, res) => {
//   res.render('animals/show');
// });


app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', {user: req.user});
});


app.use('/auth', require('./routes/auth'));
app.use('/animals', require('./routes/animals'));

const port = process.env.PORT || 4200;
const server = app.listen(port, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${port} 🎧`);
});

module.exports = server;
