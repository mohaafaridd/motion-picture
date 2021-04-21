const axios = require('axios');
const _ = require('lodash');

// #1
const mapInput = input => input.map(e => ({
  type: e.type ? e.type : e.media_type,
  id: parseInt(e.id, 10),
}));

// #2 - alternative 1 - Simple Case
const mapSimpleRequests = lists => lists
  .map(
    media => axios.get(
      `https://api.themoviedb.org/3/${media.type}/${media.id}?api_key=${process.env.TMDB_API_KEY}`,
    ),
  );

// #2 - alternative 2 - Complicated Case
const mapComplexRequests = lists => lists
  .map(
    media => axios.get(
      `https://api.themoviedb.org/3/${media.type}/${media.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos,similar`,
    ),
  );

// #3 - Implemented in main function
// const getResponse = async (requests) => {
//   await Promise.all(requests);
// };

// #4 - alternative 1
const mapSimpleResponse = response => response.map(obj => (_.pick(obj.data, [
  'id',
  'vote_average',
  'title',
  'original_name',
  'poster_path',
  'popularity',
  'overview',
])));

// #4 - alternative 1
const mapComplexResponse = response => response.map(obj => (_.pick(obj.data, [
  'id',
  'vote_average',
  'title',
  'original_name',
  'poster_path',
  'overview',
  'first_air_date',
  'release_date',
  'videos.results[0]',
  'credits.cast',
  'similar',
])));

// #5 - Mapping Keys
const mappingKey = mappedResponse => mappedResponse.map(obj => _.mapKeys(obj, (val, key) => {
  switch (key) {
    case 'original_name':
      return 'title';

    case 'vote_average':
      return 'votes';

    case 'poster_path':
      return 'poster';

    case 'first_air_date':
    case 'release_date':
      return 'year';

    case 'videos':
      return 'trailer';

    case 'credits':
      return 'cast';

    default:
      return key;
  }
}));

const getInfo = async (lists, simpleOutput = true) => {
  // #1
  if (lists.length < 0) {
    throw new Error('Empty List');
  }
  const content = mapInput(lists);

  // #2
  let requests;
  if (simpleOutput) {
    requests = mapSimpleRequests(content);
  } else {
    requests = mapComplexRequests(content);
  }

  // #3
  const response = await Promise.all(requests);

  if (!response[0].data) {
    throw new Error('No media is found');
  }

  // #4
  let mappedResponse;
  if (simpleOutput) {
    mappedResponse = mapSimpleResponse(response);
  } else {
    mappedResponse = mapComplexResponse(response);
    mappedResponse.forEach((element) => {
      element.videos = element.videos.results[0];
      element.credits = _.orderBy(element.credits.cast, ['order'], ['asc']);
      element.similar = _.orderBy(element.similar.results, ['popularity'], ['desc']);
      element.similar = element.similar.map(e => ({
        id: e.id,
        // title for movies, original name for tv shows
        title: e.title ? e.title : e.original_name,
        poster: e.poster_path,
        overview: e.overview,
      }));
    });
  }


  // #5
  const mappedKeys = mappingKey(mappedResponse);

  const final = _.map(content, item => (
    _.assignIn(item, _.find(mappedKeys, { id: item.id }))
  ));

  return final;
};

module.exports = getInfo;
