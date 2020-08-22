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
      console.log(`ORG RESULTS ${orgResults}`);
      res.render('resources/organizations', {orgResults, user: req.user});
    })
    .catch(error => {
      console.log(`error with second api call ${error}`);
    });
  }).catch(error => {
    console.log(`error from first api call ${error}`);
  });
});

router.post('/kept', (req, res) => {
  db.resource.create({
    orgId: req.body.orgId,
    name: req.body.name,
    userId: req.body.userId
  }).then(response => {
    console.log('VVVVVVVVVVV THIS IS MY RESPONSE VVVVVVVVVV');
    console.log(response.get());
    console.log('^^^^^^^^^^^ THIS IS MY RESPONSE ^^^^^^^^^^^');
    let savedOrgs = response.get();
    res.redirect('/organizations/kept');
  }).catch(error => {
    console.log(error);
  });
});

router.get('/kept', async (req, res) => {
  const savedOrgs = await db.resource.findAll({
    where: {userId: req.user.id},
    include: [db.user]
  });
  console.log('VVVVVVVVVVV SAVED PETS VVVVVVVVVV');
  console.log(savedOrgs);
  console.log('^^^^^^^^^^^ SAVED PETS ^^^^^^^^^^^');
  res.render("resources/kept", {savedOrgs, user: req.user});
});

// router.get('/:id', (req, res) => {
//   let qs = {
//     params: {
//       i: req.params.id,
//     },
//   };
//   let d = `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${CLIENT_SECRET}`;
//   axios.post('https://api.petfinder.com/v2/oauth2/token', d)
//   .then(accessToken => {
//     const H =
//       "Bearer " + accessToken.data.access_token;
//     const options = {
//       method: 'GET',
//       headers: {'Authorization': H},
//       url: "https://api.petfinder.com/v2/organizations/" + qs.params.i
//     };
//     console.log("THIS IS THE ORG ID CALL https://api.petfinder.com/v2/organizations/" + qs.params.i);
//     axios(options)
//     .then((response) => {
//       console.log(`THIS IS TEH RESPONSE DATA  FOR ORG ID ${response.data}`);
//       let orgDetails = response.data.organizations;
//       console.log(`THIS IS TEH  ORG ID DETAILS ${orgDetails}`)
//       res.render("resources/org", {orgDetails, user: req.user});
//     })
//     .catch(error => {
//       console.log(`error with second detail api call ${error}`);
//     });
//   }).catch(error => {
//     console.log(`error with first detail api call ${error}`);
//   });
// });


module.exports = router;