require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const SECRET_SESSION = process.env.SECRET_SESSION;
const API_KEY = process.env.API_KEY;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const passport = require('../config/ppConfig');
const axios = require('axios');
const router = express.Router();
const db = require('../models');

router.get('/', (req, res) => {
  let qs = {
    params: {
      s: req.query.orgSearch,
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
      url: "https://api.petfinder.com/v2/organizations?location=" + qs.params.s
    };
    axios(options)
    .then((response) => {
      let orgResults = response.data.organizations;
      console.log(orgResults);
      // console.log(searchResults.primary_photo_cropped);
      res.render('resources/organizations', {orgResults});
    })
    .catch(error => {
      console.log(`error with second api call ${error}`);
    });
  }).catch(error => {
    console.log(`error from first api call ${error}`);
  });
});




module.exports = router;