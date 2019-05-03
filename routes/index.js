/* eslint-disable no-underscore-dangle */
const express = require('express');
const viewAuth = require('../middlewares/viewAuth');

const router = express.Router();

/* GET home page. */
router.get('/', viewAuth, (req, res) => {
  const { user } = req;

  let isAnonymous;
  let nickname = 'Anonymous';
  let name = 'Anonymous';

  if (user._id === 'anonymous') {
    isAnonymous = true;
  } else {
    isAnonymous = false;
    ({ nickname, name } = user);
  }

  res.render('index', {
    title: 'Motion Picture',
    isAnonymous,
    name,
    nickname,
  });
});

module.exports = router;
