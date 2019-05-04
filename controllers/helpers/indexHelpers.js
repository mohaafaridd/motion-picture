const axios = require('axios');
const { mapData } = require('./searchHelpers');

const requestPopular = async (type) => {
  const link = `https://api.themoviedb.org/3/${type}/popular?api_key=${process.env.TMDB_API_KEY}`;
  const request = await axios.get(link);
  const { results } = request.data;
  let mappedData = mapData(results);
  mappedData = mappedData.map(media => ({ ...media, type }));

  return mappedData;
};

const getPopular = async () => {
  const popularMovies = await requestPopular('movie');
  const popularTVShows = await requestPopular('tv');
  const popular = [...popularMovies, ...popularTVShows];
  popular.sort((a, b) => {
    const popA = (a.popularity);
    const popB = (b.popularity);
    return popB - popA;
  });
  return popular;
};

module.exports = {
  getPopular,
};
