const axios = require('axios');

// Map Object
// const objectMap = (object, mapFn) => {
//   return Object.keys(object).reduce((result, key) => {
//     const mapped = result;
//     mapped[key] = mapFn(object[key]);
//     return mapped;
//   }, {});
// };

// // Maps titles to return an array of links
// const getLink = (id, type, mode) => {
//   // Returns non duplicated set of links
//   if (mode === 'Simple') {
//     return `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.TMDB_API_KEY}`;
//   }
//   return `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos,similar,keywords`;
// };

// // Maps links to return array of requests
// const mapRequests = link => axios.get(link);

// // Gets data property from each object
// const getData = obj => obj.data;

// const mapActors = (actors) => {
//   const cast = actors.sort((a, b) => {
//     const popA = (a.order);
//     const popB = (b.order);
//     return popA - popB;
//   });

//   return cast;
// };

// const mapSimilar = (similar) => {
//   const result = similar.map(similarMovie => ({
//     id: similarMovie.id,
//     // title for movies, original name for tv shows
//     title: similarMovie.title ? similarMovie.title : similarMovie.original_name,
//     poster: similarMovie.poster_path,
//     overview: similarMovie.overview,
//   }));

//   return result;
// };

// const getSimpleData = async (id, type) => {
//   const link = getLink(id, type, 'Simple');
//   const request = mapRequests(link);
//   const response = await request;
//   const dataObj = getData(response);
//   // const data = getSimpleDataJSON(dataObj);
//   return dataObj;
// };

// // Getting simple data for view cards only
// const mapSimpleData = async (data) => {
//   // console.log(data);
//   // const mapped = objectMap(data, value => ({
//   //   id: value.id,
//   //   title: value.title,
//   //   poster: value.poster_path,
//   //   vote: value.vote_average,
//   // }));

//   // console.log(mapped);
//   return data.map(obj => ({
//     id: obj.id,
//     title: obj.title,
//     poster: obj.poster_path,
//     vote: obj.vote_average,
//   }));
//   // return mapped;
// };

// // Getting detailed data for complete media view
// const mapData = (data, type) => data
//   .map(obj => ({
//     type,
//     id: obj.id,
//     // title for movies, original name for tv shows
//     title: obj.title ? obj.title : obj.original_name,
//     year: obj.first_air_date ? parseInt(obj.first_air_date, 10) : parseInt(obj.release_date, 10),
//     trailer: (obj.videos.results.filter(video => video.type === 'Trailer'))[0],
//     poster: obj.poster_path,
//     overview: obj.overview,
//     actors: mapActors(obj.credits.cast),
//     similar: mapSimilar(obj.similar.results),

//   }));

module.exports = {
  // getLink,
  // mapRequests,
  // getData,
  // mapData,
  // getSimpleData,
  // mapSimpleData,
};
