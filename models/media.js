const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'List',
  },
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
