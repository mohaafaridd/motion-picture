const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

listSchema.virtual('content', {
  ref: 'Media',
  localField: '_id',
  foreignField: 'owner',
});

const List = mongoose.model('List', listSchema);

module.exports = List;
