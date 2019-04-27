const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 32,
    trim: true,
    match: /^[a-zA-Z][a-z-A-Z-. ]+[a-zA-Z]$/,
  },

  nickname: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-zA-Z][a-z-A-Z0-9-.]+[a-zA-Z]$/,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid Email');
      }
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 100,
  },

  age: {
    type: Number,
    required: true,
    min: 13,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
