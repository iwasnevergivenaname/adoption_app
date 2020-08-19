const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig');

router.get('/search', (req, res) => {
  res.render('animals/search');
});

router.get('/show', (req, res) => {
  res.render('animals/show'
    // , {searchResults}
    );
});

router.get('/details', (req, res) => {
  res.render('animals/details');
});

module.exports = router;