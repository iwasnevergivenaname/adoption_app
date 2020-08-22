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

const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/view', isLoggedIn, async (req, res) => {
  const userProfile = await db.user.findOne({
    // where: {id: req.body.id},
    // include: [db.user]
  });
  // console.log(userProfile);
  res.render('profile/view', {user: req.user});
});

router.get('/edit', (req, res) => {
  res.render('profile/edit', {user: req.user});
});

router.put('/view', async (req, res) => {
  console.log('hit put route');
  db.user.findByPk(req.user.id)
  .then(async (user) => {
    user.bio = req.body.userBio;
    await user.save();
    // console.log(req.query.userBio);
    res.redirect("/profile/view");
  })
  .catch(error => {
    console.log(`error with ${error}`)
  })
});

module.exports = router;