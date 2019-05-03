const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const listSchema = new mongoose.Schema({

  public: {
    type: Boolean,
    required: true,
    default: false,
  },

  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
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

listSchema.plugin(AutoIncrement, { inc_field: 'id' });

const List = mongoose.model('List', listSchema);

module.exports = List;
