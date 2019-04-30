const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true,
  },

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

  type: {
    type: String,
    required: true,
  },

  seasons: {
    type: Number,
  },
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
