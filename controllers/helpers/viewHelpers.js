const axios = require('axios');

// Maps titles to return an array of links
const getLink = (id, type) => {
  // Returns non duplicated set of links
  const link = `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos,similar,keywords`;
  return link;
};

// Maps links to return array of requests
const mapRequests = link => axios.get(link);

// Gets data property from each object
const getData = obj => obj.data;

const mapData = data => data
  .map(obj => ({
    id: obj.id,
    // title for movies, original name for tv shows
    title: obj.title ? obj.title : obj.original_name,
    trailer: (obj.videos.results.filter(video => video.type === 'Trailer'))[0],
    poster: obj.poster_path,
    overview: obj.overview,
    actors: obj.credits.cast,
    similar: obj.similar.results.map(similarMovie => ({
      id: similarMovie.id,
      // title for movies, original name for tv shows
      title: similarMovie.title ? similarMovie.title : similarMovie.original_name,
      poster: similarMovie.poster_path,
    })),
  }));

module.exports = {
  getLink,
  mapRequests,
  getData,
  mapData,
};
