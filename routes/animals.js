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

router.get('/show', (req, res) => {
  // qs means query string
  let qs = {
    params: {
      s: req.query.animalSearch,
    },
  };
  // console.log(qs.params.s);
  let d = `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${CLIENT_SECRET}`;
  axios.post('https://api.petfinder.com/v2/oauth2/token', d)
  .then(accessToken => {
    const H =
      "Bearer " + accessToken.data.access_token;
    const options = {
      method: 'GET',
      headers: {'Authorization': H},
      url: "https://api.petfinder.com/v2/animals?type=" + qs.params.s
    };
    // console.log("THIS IS THE ANIMALS CALL https://api.petfinder.com/v2/animals?type=" + qs.params.s)
    axios(options)
    // .get("https://api.petfinder.com/v2/animals", qs)
    .then((response) => {
      let searchResults = response.data.animals;
      // console.log(searchResults);
      // console.log(searchResults.primary_photo_cropped);
      res.render("animals/show", {searchResults});
    })
    .catch(error => {
      console.log(`error with second api call ${error}`);
    });
  }).catch(error => {
    console.log(`error from first api call ${error}`);
  });
});

router.get('/details/:id', (req, res) => {
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
    console.log("THIS IS THE PET ID CALL https://api.petfinder.com/v2/animals/" + qs.params.i);
    axios(options)
    .then((response) => {
      console.log(response.data);
      let animalDetails = response.data.animal;
      res.render("animals/details", {animalDetails, user: req.user});
    })
    .catch(error => {
      console.log(`error with second detail api call ${error}`);
    });
  }).catch(error => {
    console.log(`error with first detail api call ${error}`);
  });
});

router.post('/saved', (req, res) => {
  db.pet.create({
    petId: req.body.petId,
    name: req.body.name,
    type: req.body.type,
    userId: req.body.userId
  }).then(response => {
    // console.log('VVVVVVVVVVV THIS IS MY RESPONSE VVVVVVVVVV');
    // console.log(response.get());
    // console.log('^^^^^^^^^^^ THIS IS MY RESPONSE ^^^^^^^^^^^');
    let savedPets = response.get();
    res.redirect('/animals/saved');
  }).catch(error => {
    console.log(error);
  });
  // res.render('saved', {user: req.body.user})
});

router.get('/saved', async (req, res) => {
  const savedPets = await db.pet.findAll({
    where: {userId: req.user.id},
    include: [db.user]
  });
  // console.log('VVVVVVVVVVV SAVED PETS VVVVVVVVVV');
  // console.log(savedPets);
  // console.log('^^^^^^^^^^^ SAVED PETS ^^^^^^^^^^^');
  res.render("animals/saved", {savedPets, user: req.user});
});

router.delete('/saved', async (req, res) => {
  try {
    await db.pet.destroy({
      where: {
        name: req.body.name
      },
    });
    res.redirect('/animals/saved');
  } catch (error) {
    res.render(error);
  }
});

module.exports = router;