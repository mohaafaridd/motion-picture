const axios = require('axios');
const { mapData } = require('./helpers/searchHelpers');

const getTopMovies = async (req, res) => {
  try {
    // const link = `https://api.themoviedb.org/3/popular/movie?api_key=${process.env.TMDB_API_KEY}`;
    const link = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`;
    const result = await axios.get(link);
    const { results } = result.data;
    const mappedData = mapData(results);

    res.send(mappedData);
  } catch (error) {
    res.send(error);
  }
};

module.exports = { getTopMovies };
