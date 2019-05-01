const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({

  id: {
    type: Number,
    required: true,
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

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
