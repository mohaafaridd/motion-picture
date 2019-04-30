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

  genres: [String],

  actors: [String],

  lang: {
    type: String,
    required: true,
  },

  rating: [{
    source: {
      type: String,
    },
    value: {
      type: Number,
    },
  }],
});

const Movie = mongoose.model('User', movieSchema);

module.exports = Movie;
