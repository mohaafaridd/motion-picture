/* eslint-disable no-underscore-dangle */
const express = require('express');
const axios = require('axios');
const viewAuth = require('../middlewares/viewAuth');
const listsHelpers = require('../controllers/helpers/listsHelpers');
const searchHelpers = require('../controllers/helpers/searchHelpers');

const router = express.Router();

/* GET home page. */
router.get('/', viewAuth, async (req, res) => {
  try {
    const { user } = req;
    user.isAnonymous = !!user.isAnonymous;
    const link = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`;
    const result = await axios.get(link);
    const { results } = result.data;
    const mappedData = searchHelpers.mapData(results);
    console.log(user.isAnonymous);
    const lists = user.isAnonymous ? [] : await listsHelpers.getListJSON(req, 'user');
    const hasList = lists.length !== 0;
    res.render('index', {
      title: 'Motion Picture',
      user,
      popular: mappedData,
      options: lists,
      hasList,
      isLogged: !user.isAnonymous,
    });
  } catch (error) {
    res.send(error.message);
  }


});

module.exports = router;
