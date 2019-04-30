const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/view', async (req, res) => {
  try {
    const { title } = req.query;
    const { type } = req.query;

    if (type !== 'tv' && type !== 'movie') {
      return res.status(400).send('you can use only movie and tv');
    }

    const encoded = encodeURIComponent(title);
    const URL = `https://api.themoviedb.org/3/search/${type}?api_key=${process.env.TMDB_API_KEY}&query=${encoded}`;
    const response = await axios.get(URL);
    /* Gets Array of movies [undetailed] */
    const movies = (response.data.results);

    // Sets array values to requests
    let result = movies.map(movie => `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(movie.title ? movie.title : movie.original_name)}`);
    // Ensures that there are no duplicates
    result = [...new Set(result)];

    if (result.length === 0) {
      return res.status(404).send();
    }

    // maps the array into axios requests
    result = result.map(movie => axios.get(movie));
    // trigger all requests
    result = await Promise.all(result);
    // maps the results
    result = result.map(resultv => resultv.data);
    // filter non found values
    result = result.filter(movie => movie.Response === 'True');

    // map the result to fit the model
    result = result.map(media => ({
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

    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
});

module.exports = router;
