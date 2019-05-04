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

    const final = [];

    let link = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`;
    let result = await axios.get(link);
    let { results } = result.data;
    let mappedData = searchHelpers.mapData(results);
    mappedData = mappedData.map(details => ({ ...details, type: 'movie' }));
    final.push(...mappedData);

    link = `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}`;
    result = await axios.get(link);
    results = result.data.results;
    mappedData = searchHelpers.mapData(results);
    mappedData = mappedData.map(details => ({ ...details, type: 'tv' }));
    final.push(...mappedData);

    final.sort((a, b) => {
      const popA = (a.popularity);
      const popB = (b.popularity);
      return popB - popA;
    });

    console.log(final[0]);

    const lists = user.isAnonymous ? [] : await listsHelpers.getListJSON(req, 'user');
    const hasList = lists.length !== 0;
    res.render('index', {
      title: 'Motion Picture',
      user,
      popular: final,
      options: lists,
      hasList,
      isLogged: !user.isAnonymous,
    });
  } catch (error) {
    res.send(error.message);
  }


});

module.exports = router;
