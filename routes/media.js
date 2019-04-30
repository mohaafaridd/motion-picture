const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/view', async (req, res) => {
  try {
    const { title } = req.query;
    const encoded = encodeURIComponent(title);
    const URL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encoded}`;
    const response = await axios.get(URL);
    /* Gets Array of movies [undetailed] */
    const movies = (response.data.results);

    // Sets array values to requests
    let result = movies.map(movie => `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(movie.title ? movie.title : movie.original_name)}`);
    // Ensures that there are no duplicates
    result = [...new Set(result)];
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
      genre: (media.Genre).split(', '),
      actors: (media.Actors).split(', '),
    }));

    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
