const axios = require('axios');

// Returns array of undetailed media array
const getMediaArray = async ({ title, type }) => {
  const encoded = encodeURIComponent(title);
  const URL = `https://api.themoviedb.org/3/search/${type}?api_key=${process.env.TMDB_API_KEY}&query=${encoded}`;
  const response = await axios.get(URL);
  return response.data.results;
};

// Maps around the array of media to get titles
const getTitles = (arrayOfMedia, type) => {
  const titles = arrayOfMedia.map((media) => {
    if (type === 'tv') {
      return media.original_name;
    }
    return media.title;
  });

  return titles;
};

// Maps titles to return an array of links
const getLinks = (titles) => {
  // Returns non duplicated set of links
  const links = [...new Set(titles.map(title => `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(title)}`))];
  return links;
};

// Maps links to return array of requests
const mapRequests = links => links.map(link => axios.get(link));

// Gets data property from each object
const getData = json => json.map(obj => obj.data);

// Gets data with only postive response
const filterData = data => data.filter(obj => obj.Response === 'True');

// Maps filtered data to fit the model
const mapData = data => data
  .map(media => ({
    title: media.Title,
    poster: media.Poster,
    year: parseInt(media.Year, 10),
    rated: media.Rated,
    runtime: parseInt(media.Runtime, 10),
    genres: (media.Genre).split(', '),
    actors: (media.Actors).split(', '),
    rating: (media.Ratings).map(rating => ({
      source: rating.Source,
      value: parseFloat(rating.Value),
    })),
  }));

const search = async (req, res) => {
  try {
    const { title } = req.query;
    const { type } = req.query;

    if ((type !== 'tv' && type !== 'movie') || title.trim() === '') {
      return res.status(400).send('Error search');
    }

    // Get media array
    const mediaArray = await getMediaArray(req.query);

    // Get all titles
    const titles = getTitles(mediaArray, type);

    const links = getLinks(titles);

    if (links.length === 0) {
      return res.status(404).send();
    }

    const requests = mapRequests(links);

    const results = await Promise.all(requests);

    const data = getData(results);

    const filteredData = filterData(data);

    const mappedData = mapData(filteredData);

    return res.send(mappedData);
  } catch (error) {
    return res.send(error);
  }
};

module.exports = search;
