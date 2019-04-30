const express = require('express');
const axios = require('axios');
const searchController = require('../controllers/searchController');
const { mapData } = require('../controllers/helpers/searchHelpers');

const router = express.Router();

router.get('/search', searchController);

router.get('/view', async (req, res) => {
  const { title } = req.query;
  const link = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(title)}`;
  let request = await axios.get(link);
  request = [request.data];
  const response = mapData(request);
  res.send(response);
});

module.exports = router;
