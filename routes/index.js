/* eslint-disable no-underscore-dangle */
const express = require('express');
const viewAuth = require('../middlewares/viewAuth');

const router = express.Router();

/* GET home page. */
router.get('/', viewAuth, (req, res) => {
  const { user } = req;

  res.render('index', {
    title: 'Motion Picture',
    user,
  });
});

module.exports = router;
