const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },

  year: {
    type: Number,
    required: true,
  },

  rated: {
    type: String,
    required: true,
  },

  runtime: {
    type: Number,
    required: true,
  },

  genre: [String],

  actors: [String],

  lang: {
    type: String,
    required: true,
  },

});

const Movie = mongoose.model('User', movieSchema);

module.exports = Movie;
