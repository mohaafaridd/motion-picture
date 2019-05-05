const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({

  id: {
    type: String,
  },

  type: {
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

  watched: {
    type: Boolean,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'List',
  },
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
