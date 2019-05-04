const axios = require('axios');
const _ = require('lodash');
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

const mapActors = (actors) => {
  const cast = actors.sort((a, b) => {
    const popA = (a.order);
    const popB = (b.order);
    return popA - popB;
  });

  return cast;
};

const mapSimilar = (similar) => {
  const result = similar.map(similarMovie => ({
    id: similarMovie.id,
    // title for movies, original name for tv shows
    title: similarMovie.title ? similarMovie.title : similarMovie.original_name,
    poster: similarMovie.poster_path,
    overview: similarMovie.overview,
  }));

  return result;
};

const mapData = (data, type) => data
  .map(obj => ({
    type,
    id: obj.id,
    // title for movies, original name for tv shows
    title: obj.title ? obj.title : obj.original_name,
    year: obj.first_air_date ? parseInt(obj.first_air_date, 10) : parseInt(obj.release_date, 10),
    trailer: (obj.videos.results.filter(video => video.type === 'Trailer'))[0],
    poster: obj.poster_path,
    overview: obj.overview,
    actors: mapActors(obj.credits.cast),
    similar: mapSimilar(obj.similar.results),

  }));

module.exports = {
  getLink,
  mapRequests,
  getData,
  mapData,
};
