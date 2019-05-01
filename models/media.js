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

  overview: {
    type: String,
    required: true,
  },

  poster: {
    type: String,
    required: true,
  },

  tags: [{
    type: String,
  }],

});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
