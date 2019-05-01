const axios = require('axios');

// Returns array of undetailed media array
const getMediaArray = async ({ title, type }) => {
  const encoded = encodeURIComponent(title);
  const URL = `https://api.themoviedb.org/3/search/${type}?api_key=${process.env.TMDB_API_KEY}&query=${encoded}`;
  const response = await axios.get(URL);
  return response.data.results;
};

const mapData = data => data
  .map(obj => ({
    id: obj.id,
    // title for movies, original name for tv shows
    title: obj.title ? obj.title : obj.original_name,
    overview: obj.overview,
    poster: obj.poster_path,
  }));

module.exports = {
  getMediaArray,
  mapData,
};
