const axios = require('axios');

// Maps titles to return an array of links
const getLink = (id) => {
  // Returns non duplicated set of links
  const link = `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos,similar,keywords`;
  return link;
};

// Maps links to return array of requests
const mapRequests = link => axios.get(link);

// Gets data property from each object
const getData = obj => obj.data;

const mapData = data => data
  .map(obj => ({
    id: obj.id,
    title: obj.title,
    trailer: (obj.videos.results.filter(video => video.type === 'Trailer'))[0],
    poster: obj.poster_path,
    overview: obj.overview,
    actors: obj.credits.cast,
    similar: obj.similar.results.map(similarMovie => ({
      id: similarMovie.id,
      title: similarMovie.title,
      poster: similarMovie.poster_path,
    })),
  }));

module.exports = {
  getLink,
  mapRequests,
  getData,
  mapData,
};
